// apps/dhcb/src/lib/confetti.test.ts — AC-4 (P2-13, docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md)
// `burst()` phải KHÔNG tạo bất kỳ phần tử confetti nào khi hệ điều hành bật
// "giảm chuyển động" (`prefers-reduced-motion: reduce`).
import { describe, it, expect, vi, afterEach } from 'vitest'
import { burst } from './confetti'

function mockMatchMedia(reduce: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? reduce : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('confetti.burst — tôn trọng prefers-reduced-motion', () => {
  it('reduce=true: không thêm phần tử nào vào container', () => {
    mockMatchMedia(true)
    const container = document.createElement('div')
    document.body.appendChild(container)

    burst(container)

    expect(container.children.length).toBe(0)
  })

  it('reduce=false: có bắn confetti (thêm phần tử .et-confetti vào container)', () => {
    mockMatchMedia(false)
    const container = document.createElement('div')
    document.body.appendChild(container)

    burst(container)

    expect(container.querySelectorAll('.et-confetti').length).toBeGreaterThan(0)
  })
})
