// MistakeBank.test.tsx — Sổ lỗi có BẰNG CHỨNG và có bộ lọc môn (S12-2, AC-11).
//
// Trang này trước S12-2 không có test unit nào. Điều đáng canh KHÔNG phải cách bày trí mà là
// LỜI HỨA về dữ liệu: thẻ không có bằng chứng phải nói "ghi tay" (không giả bằng chứng), môn
// Lập trình phải nói thẳng "chưa có bằng chứng câu sai" thay vì hiện danh sách rỗng giả, và lỗi
// tải nhật ký STEM không được hiện thành "không còn lỗi nào".
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { LangContext } from '../../context/langContext'
import { vi as viTexts } from '../../i18n'
import type { User } from '../../types'
import type { CompletionEvidence } from '@dhcb/core-contracts/completionEvidence'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

vi.mock('../../components/Layout', () => ({ default: () => null }))
// Sổ lỗi môn Anh đồng bộ server khi mở trang — ở đây chỉ cần bản cục bộ.
vi.mock('../../lib/mistakes', async () => {
  const thuc = await vi.importActual<typeof import('../../lib/mistakes')>('../../lib/mistakes')
  return { ...thuc, syncMistakes: async (uid: string) => thuc.getMistakes(uid) }
})

const fetchAttempts = vi.hoisted(() => vi.fn())
vi.mock('../../lib/stemEvidence', () => ({ fetchEvidenceAttempts: fetchAttempts }))

import MistakeBank from './MistakeBank'
import { addMistake } from '../../lib/mistakes'

const UID = '11111111-1111-4111-8111-111111111111'
const NGUOI: User = {
  id: UID,
  email: 'a@b.c',
  name: 'Học viên',
  plan: 'free',
  onboarded: true,
}

function luotSai(over: Partial<CompletionEvidence> = {}): CompletionEvidence {
  return {
    schemaVersion: 1,
    subjectId: 'physics',
    contentId: 'ly10-c2-b10',
    activityKind: 'stem_lesson_check',
    attemptId: 'aaaaaaaabbbbcccc',
    clientAt: '2026-09-10T08:00:00.000Z',
    serverAt: '2026-09-10T08:00:01.000Z',
    ownerId: UID,
    evidenceKind: 'server_graded',
    correct: 0,
    total: 1,
    ratio: 0,
    passed: false,
    items: [{ questionIndex: 1, correct: false, reason: 'WRONG_VALUE' }],
    ...over,
  }
}

describe('MistakeBank', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    fetchAttempts.mockReset()
    fetchAttempts.mockResolvedValue({ status: 'ready', attempts: [] })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  async function hien() {
    await act(async () => {
      root.render(
        <AuthContext.Provider
          value={{
            user: NGUOI,
            loading: false,
            isGuest: false,
            refresh: async () => {},
            refreshVerified: async () => {
              throw new Error('Không dùng trong fixture này')
            },
          }}
        >
          <LangContext.Provider
            value={{ lang: 'vi', toggleLang: () => {}, setLang: () => {}, T: viTexts }}
          >
            <MemoryRouter initialEntries={['/goc-hoc-tap/english/so-tay-loi-sai']}>
              <MistakeBank />
            </MemoryRouter>
          </LangContext.Provider>
        </AuthContext.Provider>,
      )
    })
  }

  /** Bấm một nút/chip theo chữ hiện trên đó (khớp trọn hoặc chứa — tab có kèm số đếm). */
  async function bam(chu: string) {
    const nut =
      [...container.querySelectorAll('button')].find((b) => b.textContent?.trim() === chu) ??
      [...container.querySelectorAll('button')].find((b) => b.textContent?.includes(chu))
    expect(nut, `không thấy nút "${chu}"`).toBeTruthy()
    await act(async () => nut!.click())
  }

  it('có bộ lọc môn với đủ Tiếng Anh + 4 môn STEM + Lập trình', async () => {
    await hien()
    const nhom = container.querySelector('[data-testid="loc-mon-loi"]')!
    const nhan = [...nhom.querySelectorAll('button')].map((b) => b.textContent?.trim())
    expect(nhan).toEqual(['Tiếng Anh', 'Toán', 'Vật lí', 'Hoá học', 'Sinh học', 'Lập trình'])
  })

  it('lỗi Anh KHÔNG có attemptId → nhãn "ghi tay", không giả bằng chứng', async () => {
    addMistake(UID, {
      wrong: 'I go yesterday',
      corrected: 'I went yesterday',
      explanation: 'Quá khứ đơn',
      source: 'writing',
      dir: 'A',
    })
    await hien()
    expect(container.textContent).toContain('ghi tay')
    expect(container.textContent).not.toContain('có bằng chứng')
  })

  it('lỗi Anh CÓ attemptId → nhãn "có bằng chứng"', async () => {
    addMistake(UID, {
      wrong: 'I go yesterday',
      corrected: 'I went yesterday',
      explanation: 'Quá khứ đơn',
      source: 'writing',
      dir: 'A',
      attemptId: 'aaaaaaaabbbbcccc',
    })
    await hien()
    expect(container.textContent).toContain('có bằng chứng')
  })

  it('"Ôn lại lỗi này" của lỗi Anh trỏ về ĐÚNG màn nguồn', async () => {
    addMistake(UID, {
      wrong: 'I go yesterday',
      corrected: 'I went yesterday',
      explanation: 'Quá khứ đơn',
      source: 'speaking',
      dir: 'A',
    })
    await hien()
    // Tab "Cần ôn" chỉ hiện nút ôn lại sau khi lật đáp án; danh sách "Tất cả" hiện luôn.
    await bam('Tất cả')
    const links = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(links).toContain('/goc-hoc-tap/english/luyen-noi')
  })

  it('nhóm Lập trình nói thẳng "chưa có bằng chứng câu sai", không danh sách rỗng giả', async () => {
    await hien()
    await bam('Lập trình')
    expect(container.textContent).toContain('Chưa có bằng chứng câu sai')
    // Không gọi nhật ký evidence cho môn không sinh evidence.
    expect(fetchAttempts).not.toHaveBeenCalled()
  })

  it('môn STEM: câu sai hiện kèm bằng chứng và nút "Ôn lại lỗi này" neo tới đúng câu', async () => {
    fetchAttempts.mockResolvedValue({ status: 'ready', attempts: [luotSai()] })
    await hien()
    await bam('Vật lí')
    expect(fetchAttempts).toHaveBeenCalledWith(UID, 'physics')
    expect(container.textContent).toContain('câu 2')
    const links = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(links.some((h) => h?.startsWith('/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10'))).toBe(true)
    expect(links.some((h) => h?.endsWith('#cau-2'))).toBe(true)
  })

  it('tải nhật ký STEM hỏng → nói "chưa tải được" + có "Thử lại", KHÔNG nói hết lỗi', async () => {
    fetchAttempts.mockResolvedValue({ status: 'error', attempts: [] })
    await hien()
    await bam('Hoá học')
    expect(container.textContent).toContain('Chưa tải được lỗi từ bài STEM')
    expect(container.textContent).not.toContain('Không còn câu nào sai')

    // "Thử lại" gọi lại đúng môn đang xem.
    fetchAttempts.mockResolvedValue({ status: 'ready', attempts: [] })
    await bam('Thử lại')
    expect(fetchAttempts).toHaveBeenLastCalledWith(UID, 'chemistry')
    expect(container.textContent).toContain('Không còn câu nào sai')
  })

  it('môn STEM không còn câu sai → nói bằng CHỮ, không phải màn trắng', async () => {
    await hien()
    await bam('Sinh học')
    expect(container.textContent).toContain('Không còn câu nào sai')
  })
})
