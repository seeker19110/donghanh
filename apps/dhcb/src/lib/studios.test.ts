import { describe, it, expect } from 'vitest'
import { STUDIOS, NAV_HIDDEN_PATHS } from './studios'

// Cổng canh registry studio — 81 file phụ thuộc (codemap 2026-09-15), và hai chỗ tra theo id
// (`DesktopSidebar.studio()`, `breadcrumb.studioPath()`) NÉM LỖI LÚC NẠP MODULE khi id không có:
// sai một dòng ở đây là app trắng, không có thông báo nào để lần ra.
describe('STUDIOS — không gian nền tảng', () => {
  it('đúng 5 studio, id duy nhất, đường dẫn tuyệt đối', () => {
    expect(STUDIOS.map((s) => s.id)).toEqual([
      'companion',
      'practice',
      'subjects',
      'career',
      'worklife',
    ])
    expect(new Set(STUDIOS.map((s) => s.id)).size).toBe(STUDIOS.length)
    for (const st of STUDIOS) expect(st.to.startsWith('/'), st.id).toBe(true)
  })

  // Slice 02: Tiếng Anh là MỘT MÔN, không phải không gian cấp nền tảng.
  it('KHÔNG có studio english — Tiếng Anh nằm trong Góc học tập', () => {
    expect(STUDIOS.some((s) => s.id === 'english')).toBe(false)
    expect(STUDIOS.some((s) => s.to === '/hoc-tieng-anh')).toBe(false)
  })

  it('Góc học tập trỏ đúng tiền tố chuẩn', () => {
    expect(STUDIOS.find((s) => s.id === 'subjects')?.to).toBe('/goc-hoc-tap')
  })

  it('mọi màu chữ đều có biến thể theme-light (AA ở 3 theme nền sáng)', () => {
    for (const st of STUDIOS) expect(st.color, st.id).toMatch(/theme-light:text-/)
  })

  it('trang ẩn thanh điều hướng vẫn là login + onboarding', () => {
    expect(NAV_HIDDEN_PATHS).toEqual(['/login', '/onboarding'])
  })
})
