// packages/core-ui/CompanionAvatar.test.tsx — canh a11y + `cheer` tự về `idle` sau 600ms (P0-2).
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { CompanionAvatar } from './CompanionAvatar.js'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root

function render(props: Parameters<typeof CompanionAvatar>[0]) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root.render(<CompanionAvatar {...props} />)
  })
  return container
}

describe('CompanionAvatar', () => {
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.useRealTimers()
  })

  it('mặc định trang trí: <svg aria-hidden="true">, không có role="img"', () => {
    const el = render({})
    const svg = el.querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.getAttribute('role')).toBeNull()
  })

  it('decorative=false: role="img" + aria-label "Bạn Đồng Hành"', () => {
    const el = render({ decorative: false })
    const svg = el.querySelector('svg')
    expect(svg?.getAttribute('role')).toBe('img')
    expect(svg?.getAttribute('aria-label')).toBe('Bạn Đồng Hành')
  })

  it('mood="cheer" tự về "idle" sau 600ms (fake timers)', () => {
    vi.useFakeTimers()
    const el = render({ mood: 'cheer' })
    expect(el.querySelector('svg')?.getAttribute('class')).toContain('animate-companion-cheer')
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(el.querySelector('svg')?.getAttribute('class')).not.toContain('animate-companion-cheer')
  })

  it('mood="hasNote" vẽ chấm thông báo góc phải trên', () => {
    const el = render({ mood: 'hasNote' })
    // Chấm thông báo là <circle> thứ ba với bán kính 6 — không có ở mood khác.
    const dots = [...el.querySelectorAll('circle')].filter((c) => c.getAttribute('r') === '6')
    expect(dots.length).toBe(1)
  })

  it('3 cỡ hợp lệ render đúng width/height', () => {
    for (const size of [32, 48, 64] as const) {
      const el = render({ size })
      const svg = el.querySelector('svg')
      expect(svg?.getAttribute('width')).toBe(String(size))
      expect(svg?.getAttribute('height')).toBe(String(size))
      act(() => root.unmount())
      container.remove()
    }
  })
})
