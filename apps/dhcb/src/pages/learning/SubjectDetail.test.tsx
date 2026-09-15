// apps/dhcb/src/pages/learning/SubjectDetail.test.tsx
//
// [Trả nợ S03-1, 2026-09-15] Trang chi tiết môn nuốt MỌI lỗi tải bằng
// `.catch(() => goToSubjects(nav))`: mất mạng, 503 hay payload sai đều đá người dùng ngược
// về danh sách môn, không một lời giải thích và không có cách thử lại. Nó tệ hơn ca của
// `Subjects.tsx` (chỉ nói dối là danh mục trống) ở chỗ người dùng còn MẤT LUÔN đường dẫn
// môn mình vừa chọn — họ phải mò lại từ đầu, và rất dễ tin là môn đã bị gỡ.
//
// Ca race nằm ở đây cùng lý do: chuyển nhanh Toán → Lý thì response môn CŨ có thể về sau và
// ghi đè môn đang xem — lỗi nghiệp vụ mà type-checker không bắt (CLAUDE.md mục 4.9).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { SUBJECT_MANIFEST_SCHEMA_VERSION } from '@dhcb/core-contracts/subjectManifest'
import type { SubjectManifest } from '@dhcb/core-contracts/subjectManifest'
import SubjectDetail from './SubjectDetail'
import { SubjectApiError } from '../../lib/subjectApi'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

vi.mock('../../components/Layout', () => ({ default: () => null }))

const getSubjectDetailsMock = vi.hoisted(() => vi.fn())
vi.mock('../../lib/subjectApi', async () => {
  const actual =
    await vi.importActual<typeof import('../../lib/subjectApi')>('../../lib/subjectApi')
  return { ...actual, getSubjectDetails: getSubjectDetailsMock }
})

// Điều hướng đi chỗ khác là ĐÚNG THỨ đợt này cấm khi có lỗi — theo dõi nó để khẳng định.
const goToSubjectsMock = vi.hoisted(() => vi.fn())
vi.mock('../../lib/subjectsHost', async () => {
  const actual =
    await vi.importActual<typeof import('../../lib/subjectsHost')>('../../lib/subjectsHost')
  return { ...actual, goToSubjects: goToSubjectsMock }
})

function manifest(over: Partial<SubjectManifest> = {}): SubjectManifest {
  return {
    id: 'mathematics',
    label: 'Toán học',
    description: 'Giải toán theo từng bước',
    category: 'stem',
    taxonomyKind: 'grade',
    standardLevels: ['grade_12'],
    questionTypes: ['vocabulary_mcq'],
    evaluationModes: ['rubric_ai'],
    schemaVersion: SUBJECT_MANIFEST_SCHEMA_VERSION,
    ...over,
  } as SubjectManifest
}

describe('trang Chi tiết môn — trạng thái tải/lỗi', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    getSubjectDetailsMock.mockReset()
    goToSubjectsMock.mockReset()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function hien(subjectId = 'mathematics') {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={[`/goc-hoc-tap/${subjectId}`]}>
          <Routes>
            {/* Đích của guard slice 02 — một trang giả để biết đã chuyển hướng tới đâu. */}
            <Route path="/goc-hoc-tap/english" element={<p>TRANG-TONG-QUAN-TIENG-ANH</p>} />
            <Route path="/lap-trinh" element={<p>TRANG-LAP-TRINH</p>} />
            <Route path="/goc-hoc-tap/:subjectId" element={<SubjectDetail />} />
          </Routes>
        </MemoryRouter>,
      )
    })
  }

  async function chay() {
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
  }

  const chu = () => container.textContent ?? ''

  it('503: hiện bảng lỗi role="alert" và Ở LẠI trang, không đá về danh sách môn', async () => {
    getSubjectDetailsMock.mockRejectedValue(
      new SubjectApiError('http', 'Máy chủ danh mục môn học đang bảo trì hoặc quá tải (503).', 503),
    )
    hien()
    await chay()

    expect(container.querySelector('[role="alert"]')).not.toBeNull()
    expect(chu()).toContain('503')
    // Đây là bất biến quan trọng nhất của đợt này: KHÔNG điều hướng đi đâu cả.
    expect(goToSubjectsMock).not.toHaveBeenCalled()
  })

  it('mất mạng: nói đúng chuyện đã xảy ra, không im lặng', async () => {
    getSubjectDetailsMock.mockRejectedValue(
      new SubjectApiError('network', 'Không kết nối được tới máy chủ để tải danh mục môn học.'),
    )
    hien()
    await chay()
    expect(chu()).toContain('Không kết nối được')
    expect(goToSubjectsMock).not.toHaveBeenCalled()
  })

  it('lỗi lạ (không phải SubjectApiError) vẫn ra câu tiếng Việt, không lộ thông điệp kỹ thuật', async () => {
    getSubjectDetailsMock.mockRejectedValue(new Error('boom at line 42'))
    hien()
    await chay()
    expect(chu()).not.toContain('boom at line 42')
    expect(chu()).toContain('Không tải được thông tin môn học')
  })

  it('bấm "Thử lại" gọi lại ĐÚNG môn đang xem và hiện được nội dung', async () => {
    getSubjectDetailsMock.mockRejectedValueOnce(new SubjectApiError('network', 'Mất mạng.'))
    hien()
    await chay()
    expect(chu()).toContain('Mất mạng.')

    getSubjectDetailsMock.mockResolvedValueOnce(manifest())
    const retry = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Thử lại'),
    )
    expect(retry).toBeDefined()
    await act(async () => {
      retry!.click()
      await Promise.resolve()
      await Promise.resolve()
    })
    await chay()

    expect(getSubjectDetailsMock).toHaveBeenCalledTimes(2)
    expect(getSubjectDetailsMock.mock.calls[1]![0]).toBe('mathematics')
    expect(container.querySelector('[role="alert"]')).toBeNull()
    expect(chu()).toContain('Toán học')
  })

  it('đang tải: hiện trạng thái tải role="status", không phải màn hình trắng', async () => {
    getSubjectDetailsMock.mockReturnValue(new Promise(() => {}))
    hien()
    expect(container.querySelector('[role="status"]')).not.toBeNull()
    expect(chu()).toContain('Đang tải thông tin môn học')
  })

  it('huỷ request khi rời trang — AbortError không bị biến thành bảng lỗi', async () => {
    getSubjectDetailsMock.mockRejectedValue(new DOMException('aborted', 'AbortError'))
    hien()
    await chay()
    expect(container.querySelector('[role="alert"]')).toBeNull()
    expect(goToSubjectsMock).not.toHaveBeenCalled()
  })

  it('truyền signal để lượt cũ huỷ được — chống race khi đổi môn nhanh', async () => {
    getSubjectDetailsMock.mockResolvedValue(manifest())
    hien()
    await chay()
    const options = getSubjectDetailsMock.mock.calls[0]![1] as { signal?: AbortSignal } | undefined
    expect(options?.signal).toBeInstanceOf(AbortSignal)
  })

  // Slice 02: môn có không gian hoạt động riêng KHÔNG có trang manifest — đi thẳng, không fetch.
  it.each([
    ['english', 'TRANG-TONG-QUAN-TIENG-ANH'],
    ['programming', 'TRANG-LAP-TRINH'],
  ])('%s → chuyển tới trang chủ môn, không gọi API manifest', async (id, marker) => {
    hien(id)
    await chay()
    expect(container.textContent).toContain(marker)
    expect(getSubjectDetailsMock).not.toHaveBeenCalled()
  })
})
