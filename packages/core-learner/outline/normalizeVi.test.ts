import { describe, it, expect } from 'vitest'
import { normalizeVi } from './normalizeVi.js'

describe('normalizeVi', () => {
  it('bỏ dấu tiếng Việt và hạ chữ thường', () => {
    expect(normalizeVi('Phương trình bậc hai')).toBe('phuong trinh bac hai')
    expect(normalizeVi('DÃY SỐ')).toBe('day so')
  })

  it('đổi đ/Đ thành d', () => {
    expect(normalizeVi('Đường tròn đồng quy')).toBe('duong tron dong quy')
  })

  it('gộp khoảng trắng thừa và cắt hai đầu', () => {
    expect(normalizeVi('  Lập   trình \n cơ bản ')).toBe('lap trinh co ban')
  })

  it('giữ nguyên chuỗi đã chuẩn và chuỗi rỗng', () => {
    expect(normalizeVi('git basics')).toBe('git basics')
    expect(normalizeVi('')).toBe('')
  })

  it('không đụng tới chữ số và ký tự ngoài bảng chữ cái', () => {
    expect(normalizeVi('Bài 10 — Sự rơi tự do')).toBe('bai 10 — su roi tu do')
  })
})
