// StoryCard.test.tsx — thẻ truyện hiện "Đọc tiếp · N%" khi đang đọc dở, và KHÔNG hiện khi chưa đọc
// (docs/specs/2026-09-24-truyen-doc-tiep.md).
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import StoryCard from './StoryCard'
import type { StoryMeta } from '../data/stories/index'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const META: StoryMeta = {
  id: 'fox',
  kind: 'fable',
  titleEn: 'The Fox',
  titleVi: 'Con cáo',
  countryVi: 'Hy Lạp',
  countryEn: 'Greece',
  flag: '🇬🇷',
  level: 'A2',
  lineCount: 8,
}

describe('StoryCard — nhãn Đọc tiếp', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('chưa đọc → không có nhãn Đọc tiếp', () => {
    act(() => root.render(<StoryCard story={META} isA onClick={() => {}} progress={null} />))
    expect(container.textContent).not.toContain('Đọc tiếp')
  })

  it('đang đọc dở → nhãn nằm trong tên truy cập của nút, kèm % (chiều A)', () => {
    act(() =>
      root.render(
        <StoryCard
          story={META}
          isA
          onClick={() => {}}
          progress={{ para: 2, total: 5, updatedAt: 0 }}
        />,
      ),
    )
    expect(container.querySelector('button')?.textContent).toContain('Đọc tiếp · đã đọc 40%')
  })

  it('chiều B → nhãn tiếng Anh', () => {
    act(() =>
      root.render(
        <StoryCard
          story={META}
          isA={false}
          onClick={() => {}}
          progress={{ para: 1, total: 4, updatedAt: 0 }}
        />,
      ),
    )
    expect(container.textContent).toContain('Continue · 25% read')
  })
})
