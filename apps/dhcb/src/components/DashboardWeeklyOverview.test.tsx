// Test canh gác R3-3 §6.2 — một heading "Tuần này", scope label English, programming-only
// copy, và calendar embedded không sinh card/heading lồng.
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DashboardWeeklyOverview from './DashboardWeeklyOverview'
import type { ActivityCalendar } from '../lib/stats'
import type { WeeklyProgress } from '../lib/weeklyGoal'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function makeCalendar(): ActivityCalendar {
  const days = Array.from({ length: 8 }, (_, i) => ({
    date: `2026-09-${String(11 + i).padStart(2, '0')}`,
    dow: (i + 5) % 7,
    count: i,
    active: i > 0,
  }))
  return { days, firstColumn: 5, activeDays: 5, bestDay: 7 }
}

function makeWeekly(overrides: Partial<WeeklyProgress> = {}): WeeklyProgress {
  return { daysDone: 4, goal: 5, achieved: false, weekStart: '2026-09-14', ...overrides }
}

let container: HTMLDivElement
let root: Root

function render(props: Partial<React.ComponentProps<typeof DashboardWeeklyOverview>> = {}) {
  act(() => {
    root.render(
      <DashboardWeeklyOverview
        vi
        weekTotal={12}
        weekly={makeWeekly()}
        onChangeGoal={() => {}}
        calendar={{
          calendar: makeCalendar(),
          uid: 'u1',
          isDesktop: false,
          weeks: 5,
          wdow: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          selectedDate: '',
          onSelectedDateChange: () => {},
        }}
        {...props}
      />,
    )
  })
}

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('DashboardWeeklyOverview (R3-3)', () => {
  it('có đúng một heading "Tuần này" và scope label English ngay dưới', () => {
    render()
    const headings = container.querySelectorAll('#dashboard-weekly-overview-heading')
    expect(headings).toHaveLength(1)
    expect(headings[0]?.textContent).toBe('Tuần này')
    expect(container.textContent).toContain('Hoạt động Tiếng Anh đã ghi nhận')
  })

  it('hiện narrative deterministic + số ngày/mục tiêu khi có evidence English', () => {
    render({ weekTotal: 12, weekly: makeWeekly({ daysDone: 4, goal: 5 }) })
    expect(container.textContent).toContain('4/5 ngày')
    expect(container.textContent).toContain('12 hoạt động / 7 ngày')
    expect(container.textContent).toContain('Chỉ còn 1 ngày học nữa')
  })

  it('fixture programming-only (weekTotal=0, daysDone=0) hiện đúng copy, không suy evidence English giả', () => {
    render({ weekTotal: 0, weekly: makeWeekly({ daysDone: 0, goal: 5, achieved: false }) })
    expect(container.textContent).toContain('Chưa có hoạt động Tiếng Anh được ghi nhận tuần này.')
    expect(container.textContent).not.toContain('ngày mục tiêu')
  })

  it('calendar disclosure mở mặc định, đóng lại bằng đúng một click, embedded không sinh card/heading lồng', () => {
    render()
    const toggle = container.querySelector<HTMLButtonElement>('#dashboard-calendar-toggle')!
    const panel = container.querySelector('#dashboard-calendar-panel')!
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(panel.hasAttribute('hidden')).toBe(false)
    // Embedded: không có section/h2 lồng bên trong panel calendar.
    expect(panel.querySelector('section')).toBeNull()
    expect(panel.querySelector('h2')).toBeNull()
    expect(panel.querySelector('[role="grid"]')).not.toBeNull()

    act(() => toggle.click())
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(panel.hasAttribute('hidden')).toBe(true)
  })

  it('CTA "Đổi mục tiêu ở Hồ sơ" gọi onChangeGoal và giữ vùng chạm 44px', () => {
    const onChangeGoal = vi.fn()
    render({ onChangeGoal })
    const cta = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Đổi mục tiêu'),
    )!
    expect(cta.className).toContain('min-h-11')
    act(() => cta.click())
    expect(onChangeGoal).toHaveBeenCalledTimes(1)
  })
})
