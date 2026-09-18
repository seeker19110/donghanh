import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ActivityCalendarCard from './ActivityCalendarCard'
import type { ActivityCalendar } from '../lib/stats'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const calendar: ActivityCalendar = {
  days: Array.from({ length: 8 }, (_, index) => ({
    date: `2026-09-${String(index + 1).padStart(2, '0')}`,
    dow: index % 7,
    count: index,
    active: index > 0,
  })),
  firstColumn: 1,
  activeDays: 7,
  bestDay: 7,
}

let container: HTMLDivElement
let root: Root
const scrollIntoView = vi.fn()

function render(isDesktop = false) {
  act(() => {
    root.render(
      <ActivityCalendarCard
        calendar={calendar}
        uid="u1"
        vi
        isDesktop={isDesktop}
        weeks={5}
        wdow={['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']}
      />,
    )
  })
}

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  scrollIntoView.mockReset()
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: scrollIntoView,
  })
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('ActivityCalendarCard', () => {
  it('dùng cùng lưới 7 cột 44px trong một scroller trên mobile', () => {
    render()
    const grid = container.querySelector<HTMLElement>('[role="grid"]')
    const scroller = grid?.parentElement
    const headers = scroller?.querySelectorAll('span.w-11') ?? []
    const cells = grid?.querySelectorAll<HTMLElement>('[role="gridcell"]') ?? []

    expect(scroller?.className).toContain('overflow-x-auto')
    expect(grid?.className).toContain('w-max')
    expect(headers).toHaveLength(7)
    expect(cells).toHaveLength(8)
    cells.forEach((cell) => expect(cell.className).toContain('w-11 h-11'))
    expect(Array.from(cells).filter((cell) => cell.tabIndex === 0)).toHaveLength(1)
  })

  it('focus ô kế cận và cuộn nó vào tầm nhìn khi dùng phím', () => {
    render()
    const selected = container.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')
    act(() =>
      selected?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })),
    )

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' })
    expect(document.activeElement?.getAttribute('data-cell')).toBe('6')
  })

  it('giữ heatmap desktop 16px', () => {
    render(true)
    const cells = container.querySelectorAll<HTMLElement>('[role="gridcell"]')
    cells.forEach((cell) => expect(cell.className).toContain('w-4 h-4'))
  })
})
