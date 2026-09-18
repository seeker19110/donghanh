// SubjectSpaceList.test.tsx — AC-2/AC-3/AC-4 của đặc tả P1-8.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { SUBJECT_ENTRIES } from '@dhcb/core-learner/subjectEntry'
import type { TodayPlan, TodayItem } from '@dhcb/core-contracts/todayPlan'
import SubjectSpaceList from './SubjectSpaceList'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function pickItem(): TodayItem {
  return {
    id: 'pick:-:-',
    kind: 'pick',
    title: 'Chọn môn để bắt đầu',
    href: '/goc-hoc-tap',
    evidenceSource: 'none',
  }
}

function nextItem(subjectId: string, title: string): TodayItem {
  return {
    id: `next:${subjectId}:bai-1`,
    kind: 'next',
    subjectId,
    contentId: 'bai-1',
    title,
    href: '/goc-hoc-tap/bai-1',
    evidenceSource: 'outline.next',
  }
}

function planVoiPrimary(primary: TodayItem, secondary: TodayItem[] = []): TodayPlan {
  return {
    primary,
    secondary,
    subjectsSeen: [primary, ...secondary]
      .filter((i) => i.subjectId)
      .map((i) => i.subjectId as string),
    builtAt: 1,
  }
}

describe('SubjectSpaceList', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function render(props: React.ComponentProps<typeof SubjectSpaceList>) {
    root = createRoot(container)
    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/']}>
          <SubjectSpaceList {...props} />
        </MemoryRouter>,
      )
    })
  }

  function titles() {
    return Array.from(container.querySelectorAll('h3'))
      .filter((h) => !h.closest('ul')?.hidden)
      .map((h) => h.textContent ?? '')
  }

  function xemTatCaButton() {
    return Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.startsWith('Xem tất cả'),
    )
  }

  it('AC-2: mobile chỉ hiện 3 thẻ đầu + nút "Xem tất cả"; bấm → đủ SUBJECT_ENTRIES.length', () => {
    render({ plan: null, isDesktop: false })
    expect(titles()).toHaveLength(3)
    const nut = xemTatCaButton()
    expect(nut).toBeTruthy()
    expect(nut?.textContent).toBe(`Xem tất cả (${SUBJECT_ENTRIES.length} môn)`)
    act(() => nut?.click())
    expect(titles()).toHaveLength(SUBJECT_ENTRIES.length)
  })

  it('AC-2: desktop hiện đủ lưới 2 cột ngay, không có nút "Xem tất cả"', () => {
    render({ plan: null, isDesktop: true })
    expect(titles()).toHaveLength(SUBJECT_ENTRIES.length)
    expect(xemTatCaButton()).toBeFalsy()
  })

  it('AC-3: chuỗi trạng thái chỉ ∈ {"đang học · …", "chưa bắt đầu"}, không có ký tự %', () => {
    const plan = planVoiPrimary(nextItem('programming', 'Sự rơi tự do'))
    render({ plan, isDesktop: true })
    const statusNodes = Array.from(container.querySelectorAll('p')).filter(
      (p) => p.textContent?.startsWith('đang học · ') || p.textContent === 'chưa bắt đầu',
    )
    expect(statusNodes.length).toBeGreaterThanOrEqual(SUBJECT_ENTRIES.length)
    expect(statusNodes.map((p) => p.textContent)).toContain('đang học · Sự rơi tự do')
    expect(statusNodes.every((p) => p.classList.contains('text-content-secondary'))).toBe(true)
    expect(container.textContent).not.toContain('%')
  })

  it('AC-3: không có bằng chứng môn nào → mọi thẻ "chưa bắt đầu"', () => {
    render({ plan: null, isDesktop: true })
    const statuses = Array.from(container.querySelectorAll('p')).map((p) => p.textContent ?? '')
    const trangThai = statuses.filter((s) => s === 'chưa bắt đầu' || s.startsWith('đang học · '))
    expect(trangThai.every((s) => s === 'chưa bắt đầu')).toBe(true)
  })

  it('AC-4: primary.kind === "pick" → mọi thẻ có nút "Thử 5 phút"', () => {
    const plan = planVoiPrimary(pickItem())
    render({ plan, isDesktop: true })
    const nutThu5Phut = Array.from(container.querySelectorAll('button')).filter(
      (b) => b.textContent === 'Thử 5 phút',
    )
    expect(nutThu5Phut).toHaveLength(SUBJECT_ENTRIES.length)
  })

  it('không phải empty state → KHÔNG có nút "Thử 5 phút"', () => {
    const plan = planVoiPrimary(nextItem('programming', 'Sự rơi tự do'))
    render({ plan, isDesktop: true })
    const nutThu5Phut = Array.from(container.querySelectorAll('button')).filter(
      (b) => b.textContent === 'Thử 5 phút',
    )
    expect(nutThu5Phut).toHaveLength(0)
  })

  it('môn đang học (subjectsSeen) lên đầu danh sách', () => {
    const plan = planVoiPrimary(nextItem('biology', 'Di truyền học cơ bản'))
    render({ plan, isDesktop: true })
    const bienBiology = SUBJECT_ENTRIES.find((e) => e.id === 'biology')?.label
    expect(titles()[0]).toBe(bienBiology)
  })

  it('mobile có DOM 1–3 → toggle → list 4–6 stable-id; collapse giữ focus và hidden', () => {
    render({ plan: null, isDesktop: false })
    const lists = container.querySelectorAll('ul')
    const toggle = xemTatCaButton() as HTMLButtonElement
    const revealed = container.querySelector('#home-subjects-revealed') as HTMLUListElement
    expect(lists).toHaveLength(2)
    expect(lists[0].nextElementSibling).toBe(toggle)
    expect(toggle.nextElementSibling).toBe(revealed)
    expect(toggle.getAttribute('aria-controls')).toBe('home-subjects-revealed')
    expect(revealed.hidden).toBe(true)

    toggle.focus()
    act(() => toggle.click())
    expect(revealed.hidden).toBe(false)
    expect(titles()).toHaveLength(SUBJECT_ENTRIES.length)
    expect(document.activeElement).toBe(toggle)
    expect(toggle.textContent).toBe('Thu gọn danh sách môn')

    act(() => toggle.click())
    expect(revealed.hidden).toBe(true)
    expect(document.activeElement).toBe(toggle)
  })

  it('mobile compact không render mô tả/shortcut nhưng empty CTA của 3 môn visible vẫn còn', () => {
    render({ plan: planVoiPrimary(pickItem()), isDesktop: false })
    expect(container.textContent).not.toContain('Lộ trình CEFR')
    expect(container.textContent).not.toContain('Gia sư song ngữ')
    const visibleCtas = Array.from(container.querySelectorAll('button')).filter(
      (button) => button.textContent === 'Thử 5 phút' && !button.closest('ul')?.hidden,
    )
    expect(visibleCtas).toHaveLength(3)
  })

  it('roundtrip mobile→desktop→mobile giữ lựa chọn đã mở', () => {
    render({ plan: null, isDesktop: false })
    act(() => xemTatCaButton()?.click())
    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/']}>
          <SubjectSpaceList plan={null} isDesktop />
        </MemoryRouter>,
      )
    })
    expect(xemTatCaButton()).toBeFalsy()
    expect(titles()).toHaveLength(SUBJECT_ENTRIES.length)
    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/']}>
          <SubjectSpaceList plan={null} isDesktop={false} />
        </MemoryRouter>,
      )
    })
    expect(container.querySelector('#home-subjects-revealed')?.hasAttribute('hidden')).toBe(false)
    expect(container.textContent).toContain('Thu gọn danh sách môn')
  })
})
