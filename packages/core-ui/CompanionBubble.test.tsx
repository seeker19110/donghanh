// packages/core-ui/CompanionBubble.test.tsx — canh: không cắt chuỗi trong JS, nút 🔊/✕ có
// điều kiện, chữ luôn `text-content` (P0-2).
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { CompanionBubble } from './CompanionBubble.js'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root

function render(props: Parameters<typeof CompanionBubble>[0]) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root.render(<CompanionBubble {...props} />)
  })
  return container
}

describe('CompanionBubble', () => {
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('không cắt chuỗi trong JS: lead 200 ký tự vẫn nằm nguyên trong DOM', () => {
    const lead = 'A'.repeat(200)
    const el = render({ variant: 'home', lead })
    expect(el.textContent).toContain(lead)
    const p = el.querySelector('p')
    expect(p?.className).toContain('line-clamp-2')
  })

  it('chữ luôn dùng text-content, không dùng text-warm-*', () => {
    const el = render({ variant: 'home', lead: 'Chào bạn.', detail: 'Bản tin.' })
    for (const p of el.querySelectorAll('p')) {
      expect(p.className).toContain('text-content')
      expect(p.className).not.toMatch(/text-warm-/)
    }
  })

  it('không có onSpeak/onDismiss thì không render nút tương ứng', () => {
    const el = render({ variant: 'home', lead: 'Chào bạn.' })
    expect(el.querySelector('button')).toBeNull()
  })

  it('có onSpeak → nút 🔊 gọi đúng callback khi bấm', () => {
    const onSpeak = vi.fn()
    const el = render({ variant: 'home', lead: 'Chào bạn.', onSpeak })
    const btn = el.querySelector('button[aria-label="Nghe giọng đọc"]') as HTMLButtonElement
    expect(btn).not.toBeNull()
    act(() => btn.click())
    expect(onSpeak).toHaveBeenCalledTimes(1)
  })

  it('có onDismiss → nút ✕ gọi đúng callback khi bấm', () => {
    const onDismiss = vi.fn()
    const el = render({ variant: 'inline', lead: 'Ghi chú.', onDismiss })
    const btn = el.querySelector('button[aria-label="Đóng"]') as HTMLButtonElement
    act(() => btn.click())
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('children render dưới bong bóng (link chữ nhỏ)', () => {
    const el = render({
      variant: 'home',
      lead: 'Chào bạn.',
      children: <button type="button">Ôn 5 thẻ</button>,
    })
    expect(el.textContent).toContain('Ôn 5 thẻ')
  })
})
