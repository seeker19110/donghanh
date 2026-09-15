// EnglishHome.test.tsx — cổng canh slice 02 (spec §④ AC-1, AC-8): trang tổng quan môn Tiếng Anh
// tại /goc-hoc-tap/english là MỘT MÔN (tiêu đề "Tiếng Anh", không còn "Không Gian"), và đủ 5
// công cụ của ENGLISH_CHILDREN (navTree.ts) có nút ở trang này.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import EnglishHome from './EnglishHome'
import { ENGLISH_CHILDREN } from '../../../lib/navTree'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const layoutProps = vi.hoisted(() => ({ last: {} as Record<string, unknown> }))
vi.mock('../../../components/Layout.js', () => ({
  default: (props: Record<string, unknown>) => {
    layoutProps.last = props
    return null
  },
}))
vi.mock('../../../components/PricePromoBanner.js', () => ({ default: () => null }))
vi.mock('../../../components/RewardTipBanner.js', () => ({ default: () => null }))
vi.mock('../../../context/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'u1', name: 'An', onboarded: true, plan: 'free' },
    isGuest: false,
  }),
}))
vi.mock('../../../lib/useCloudSync', () => ({ useCloudSync: () => ({ synced: true }) }))
vi.mock('../../../data/cefrLoader', () => ({ loadCefr: async () => [] }))
vi.mock('../../../data/curriculumLoader', () => ({ loadFoundation: async () => [] }))

describe('EnglishHome — trang tổng quan môn Tiếng Anh', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  async function hien() {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/goc-hoc-tap/english']}>
          <Routes>
            <Route path="/goc-hoc-tap/english" element={<EnglishHome />} />
          </Routes>
        </MemoryRouter>,
      )
    })
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
  }

  it('tiêu đề là tên MÔN, không còn "Không Gian Tiếng Anh"/"English Studio"', async () => {
    await hien()
    expect(layoutProps.last.title).toBe('Tiếng Anh')
    expect(container.textContent).not.toContain('Không Gian')
    expect(container.textContent).not.toContain('English Studio')
  })

  it('đủ 5 công cụ của ENGLISH_CHILDREN có nút bấm trên trang (AC-8)', async () => {
    await hien()
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent ?? '')
    const expected: Record<string, RegExp> = {
      '/lo-trinh-hoc': /Lộ trình|CEFR/i,
      '/bai-hoc': /Ngữ Pháp|Bài học/i,
      '/cau-thong-dung': /Câu thông dụng|Mẫu câu/i,
      '/so-tay-loi-sai': /Lỗi sai|Sổ Lỗi/i,
      '/on-thi': /Ôn thi/i,
    }
    for (const child of ENGLISH_CHILDREN) {
      const re = expected[child.to ?? '']
      expect(re, `chưa khai kỳ vọng cho ${child.to}`).toBeDefined()
      expect(
        buttons.some((t) => re!.test(t)),
        `thiếu nút tới ${child.to}`,
      ).toBe(true)
    }
  })
})
