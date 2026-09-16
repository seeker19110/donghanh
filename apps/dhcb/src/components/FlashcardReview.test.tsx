// FlashcardReview.test.tsx — canh NHỊP của màn lật thẻ dùng chung (S12-1 AC-6).
//
// Điều quan trọng nhất phải giữ khi tách component: đáp án ẩn cho tới khi người học tự bấm.
// Mất luật đó là mất toàn bộ giá trị của thẻ, mà không cổng nào khác bắt được.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import FlashcardReview, { type FlashcardItem } from './FlashcardReview'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const THE: FlashcardItem[] = [
  { key: 'k1', hoi: 'Biến là gì?', dap: 'Một cái tên trỏ tới giá trị', lessonTitle: 'Bài 1' },
  { key: 'k2', hoi: 'Hàm là gì?', dap: 'Một khối việc có tên', lessonTitle: 'Bài 2' },
]

describe('FlashcardReview', () => {
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

  function hien(node: React.ReactElement) {
    act(() => root.render(node))
  }

  /** Tìm nút theo nhãn — dùng vai trò thật (button) như người dùng thấy. */
  function nut(nhan: string): HTMLButtonElement | undefined {
    return [...container.querySelectorAll('button')].find((b) => b.textContent?.trim() === nhan) as
      HTMLButtonElement | undefined
  }

  function bam(nhan: string) {
    const b = nut(nhan)
    if (!b) throw new Error(`Không thấy nút "${nhan}"`)
    act(() => b.dispatchEvent(new MouseEvent('click', { bubbles: true })))
  }

  const chu = () => container.textContent ?? ''

  it('hiện câu hỏi và KHÔNG hiện đáp án cho tới khi bấm "Xem đáp án"', () => {
    hien(<FlashcardReview cards={THE} onRate={vi.fn()} />)
    expect(chu()).toContain('Biến là gì?')
    expect(chu()).not.toContain('Một cái tên trỏ tới giá trị')
    expect(nut('Nhớ được')).toBeUndefined()
  })

  it('bấm "Xem đáp án" mới lộ đáp án và 4 mức tự đánh giá', () => {
    hien(<FlashcardReview cards={THE} onRate={vi.fn()} />)
    bam('Xem đáp án')
    expect(chu()).toContain('Một cái tên trỏ tới giá trị')
    for (const nhan of ['Quên rồi', 'Khó nhớ', 'Nhớ được', 'Quá dễ']) {
      expect(nut(nhan)).toBeDefined()
    }
  })

  it('chấm một thẻ: gọi onRate đúng khoá + rating rồi sang thẻ kế, đáp án đóng lại', () => {
    const onRate = vi.fn()
    hien(<FlashcardReview cards={THE} onRate={onRate} />)
    bam('Xem đáp án')
    bam('Nhớ được')
    expect(onRate).toHaveBeenCalledWith('k1', 'good')
    expect(chu()).toContain('Hàm là gì?')
    expect(chu()).not.toContain('Một khối việc có tên')
    expect(chu()).toContain('Thẻ 2/2')
  })

  it('ôn hết hàng đợi → màn tổng kết đếm đúng số thẻ đã ôn', () => {
    hien(<FlashcardReview cards={[THE[0]!]} onRate={vi.fn()} />)
    bam('Xem đáp án')
    bam('Quá dễ')
    expect(chu()).toContain('Xong phiên ôn — 1 thẻ')
  })

  it('cap cắt số thẻ của phiên, số hiện ra là số SAU khi cắt', () => {
    hien(<FlashcardReview cards={THE} onRate={vi.fn()} cap={1} />)
    expect(chu()).toContain('Thẻ 1/1')
  })

  it('không có thẻ nào → không vẽ gì (trang gọi tự nói lời của môn mình)', () => {
    hien(<FlashcardReview cards={[]} onRate={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('nút phụ dưới thẻ do trang gọi dựng (URL là của từng môn)', () => {
    hien(
      <FlashcardReview
        cards={THE}
        onRate={vi.fn()}
        duoiThe={(c) => <button type="button">Mở lại {c.lessonTitle}</button>}
      />,
    )
    expect(nut('Mở lại Bài 1')).toBeDefined()
  })

  it('chữ tổng kết riêng của môn được dùng thay chữ mặc định', () => {
    hien(
      <FlashcardReview
        cards={[THE[0]!]}
        onRate={vi.fn()}
        xongPhien={(n) => <p>Đã ôn {n} thẻ Vật lí</p>}
      />,
    )
    bam('Xem đáp án')
    bam('Nhớ được')
    expect(chu()).toContain('Đã ôn 1 thẻ Vật lí')
  })
})
