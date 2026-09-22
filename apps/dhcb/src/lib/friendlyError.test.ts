import { describe, expect, it } from 'vitest'
import { thongDiepLoiThanThien } from './friendlyError'

describe('thongDiepLoiThanThien', () => {
  it('dịch lỗi JSON của trình duyệt (ca thật ở trang Ghi chú, audit 2026-09-22)', () => {
    const e = new Error(`Unexpected token '<', "<!doctype "... is not valid JSON`)
    expect(thongDiepLoiThanThien(e)).toMatch(/không đọc được/)
    expect(thongDiepLoiThanThien(e)).not.toMatch(/Unexpected|JSON/)
  })
  it('dịch lỗi mạng và HTTP', () => {
    expect(thongDiepLoiThanThien(new Error('Failed to fetch'))).toMatch(/mạng/)
    expect(thongDiepLoiThanThien(new Error('HTTP error 500'))).toMatch(/sự cố/)
    expect(thongDiepLoiThanThien(new Error('HTTP 401'))).toMatch(/đăng nhập/)
  })
  it('giữ nguyên câu tiếng Việt có dấu do server viết', () => {
    expect(thongDiepLoiThanThien(new Error('Tên dự án không được để trống'))).toBe(
      'Tên dự án không được để trống',
    )
  })
  it('chuỗi kỹ thuật lạ → câu mặc định; không phải Error → mặc định', () => {
    expect(thongDiepLoiThanThien(new Error('ECONNRESET socket hang up'))).toBe(
      'Có lỗi xảy ra, thử lại sau.',
    )
    expect(thongDiepLoiThanThien(undefined, 'X')).toBe('X')
  })
})
