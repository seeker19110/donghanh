// StoryReader.resume.test.tsx — cổng canh "Đọc tiếp" (docs/specs/2026-09-24-truyen-doc-tiep.md):
// mở lại truyện đọc dở thì cuộn tới đúng đoạn + báo cho người đọc; đọc tới đoạn khác thì lưu
// vị trí; chạm mốc cuối truyện thì xoá; "Đọc lại từ đầu" xoá; chạy cho CẢ hai chiều học A/B.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import StoryReader from './StoryReader'
import { LangProvider } from '../../../context/LangProvider'
import { duongDanTruyen } from '../../../lib/englishRoutes'
import type { Story } from '../../../data/stories/index'
import { getStoryProgress, saveStoryProgress } from '../../../lib/storyProgress'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// 4 đoạn, mỗi đoạn 1 câu. URL mở bằng id trần → StoryReader tự chuyển về URL chuẩn
// `fox--<tiêu đề>` (cùng route), id truyện không đổi nên trạng thái đọc dở vẫn giữ.
const STORY: Story = {
  id: 'fox',
  kind: 'fable',
  titleEn: 'The Fox',
  titleVi: 'Con cáo',
  countryVi: 'Hy Lạp',
  countryEn: 'Greece',
  flag: '🇬🇷',
  level: 'A2',
  lineCount: 4,
  source: { en: 'Aesop', enUrl: '', vi: 'Dịch tay' },
  lines: [0, 1, 2, 3].map((p) => ({ p, en: `English ${p}`, vi: `Tiếng Việt ${p}` })),
}

vi.mock('../../../components/Layout', () => ({ default: () => null }))
vi.mock('../../../context/useAuth', () => ({ useAuth: () => ({ user: null }) }))
vi.mock('../../../lib/useIsDesktopViewport', () => ({ useIsDesktopViewport: () => false }))
vi.mock('../../../data/stories/loader', () => ({ loadStory: async () => STORY }))
vi.mock('../../../lib/tts', () => ({
  speak: vi.fn(),
  stopSpeaking: vi.fn(),
  pauseCurrentAudio: vi.fn(),
  resumeCurrentAudio: vi.fn(),
  unlockAudio: vi.fn(),
}))

// IntersectionObserver giả: giữ lại từng observer để test tự "báo" phần tử nào đang hiện.
interface FakeObserver {
  cb: IntersectionObserverCallback
  targets: Element[]
}
let observers: FakeObserver[] = []

function report(target: Element, isIntersecting: boolean) {
  const obs = observers.find((o) => o.targets.includes(target))
  if (!obs) throw new Error('phần tử không được observer nào theo dõi')
  act(() => {
    obs.cb(
      [{ target, isIntersecting } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
  })
}

const scrollIntoView = vi.fn()

describe('StoryReader — Đọc tiếp', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    observers = []
    scrollIntoView.mockClear()
    Element.prototype.scrollIntoView = scrollIntoView
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        private o: FakeObserver
        constructor(cb: IntersectionObserverCallback) {
          this.o = { cb, targets: [] }
          observers.push(this.o)
        }
        observe(el: Element) {
          this.o.targets.push(el)
        }
        disconnect() {
          this.o.targets = []
        }
        unobserve() {}
        takeRecords() {
          return []
        }
      },
    )
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  })

  async function open(direction: 'A' | 'B' = 'A') {
    localStorage.setItem('et_direction', direction)
    act(() => {
      root.render(
        <LangProvider>
          <MemoryRouter initialEntries={[duongDanTruyen('fox')]}>
            <Routes>
              <Route path={duongDanTruyen(':id')} element={<StoryReader />} />
            </Routes>
          </MemoryRouter>
        </LangProvider>,
      )
    })
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
  }

  const para = (i: number) => container.querySelector(`[data-story-para="${i}"]`) as Element

  it('chưa đọc gì → mở từ đầu, không cuộn, không có dòng "đọc tiếp"', async () => {
    await open()
    expect(container.textContent).not.toContain('Đang đọc tiếp')
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('đang đọc dở → cuộn tới đúng đoạn, báo "đọc tiếp", tiêu điểm vào dòng báo', async () => {
    saveStoryProgress('fox', 2, 4)
    await open()
    expect(container.textContent).toContain('Đang đọc tiếp từ đoạn 3/4.')
    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(scrollIntoView.mock.instances[0]).toBe(container.querySelector('#doan-2'))
    expect(document.activeElement?.textContent).toContain('Đang đọc tiếp')
  })

  it('cuộn tới đoạn khác → lưu vị trí đoạn trên cùng đang hiện', async () => {
    await open()
    report(para(1), true)
    report(para(2), true)
    expect(getStoryProgress('fox')?.para).toBe(1)
    report(para(1), false)
    expect(getStoryProgress('fox')?.para).toBe(2)
  })

  it('chạm mốc cuối truyện → xoá trạng thái, cuộn ngược lên cũng không ghi lại', async () => {
    saveStoryProgress('fox', 2, 4)
    await open()
    const end = container.querySelector('[aria-hidden="true"].h-px') as Element
    report(end, true)
    expect(getStoryProgress('fox')).toBeNull()
    report(para(1), true)
    expect(getStoryProgress('fox')).toBeNull()
  })

  it('"Đọc lại từ đầu" → xoá trạng thái và bỏ dòng báo', async () => {
    saveStoryProgress('fox', 2, 4)
    await open()
    const btn = [...container.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Đọc lại từ đầu'),
    ) as HTMLButtonElement
    act(() => btn.click())
    expect(getStoryProgress('fox')).toBeNull()
    expect(container.textContent).not.toContain('Đang đọc tiếp')
  })

  it('chiều B (học tiếng Việt) dùng chung vị trí, nhãn tiếng Anh', async () => {
    saveStoryProgress('fox', 1, 4)
    await open('B')
    expect(container.textContent).toContain('Continuing from paragraph 2/4.')
    expect(container.textContent).toContain('Tiếng Việt 1')
  })

  it('bản ghi trỏ quá số đoạn (truyện bị sửa ngắn) → bỏ, mở từ đầu', async () => {
    localStorage.setItem(
      'et_story_progress',
      JSON.stringify({ fox: { para: 6, total: 9, updatedAt: 1 } }),
    )
    await open()
    expect(scrollIntoView).not.toHaveBeenCalled()
    expect(getStoryProgress('fox')).toBeNull()
  })
})
