import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { thongDiepLoiQuanTri, thongDiepLoiThanThien } from './friendlyError'

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
  it('chiều B: câu tiếng Anh', () => {
    expect(thongDiepLoiThanThien(new Error('Failed to fetch'), 'x', 'en')).toMatch(/connection/)
    expect(thongDiepLoiThanThien(new Error('Daily limit reached for chat'), 'x', 'en')).toBe(
      'Daily limit reached for chat',
    )
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
    expect(thongDiepLoiThanThien('chuoi loi khong phai Error', 'X')).toBe('X')
  })
})

describe('thongDiepLoiQuanTri (màn quản trị)', () => {
  it('vẫn dịch lỗi kỹ thuật của trình duyệt/HTTP', () => {
    expect(thongDiepLoiQuanTri(new Error('Failed to fetch'))).toMatch(/mạng/)
    expect(thongDiepLoiQuanTri(new Error(`Unexpected token '<', "<!doctype "...`))).toMatch(
      /không đọc được/,
    )
    expect(thongDiepLoiQuanTri(new Error('HTTP 500'))).toMatch(/sự cố/)
  })
  it('GIỮ câu tiếng Anh không dấu (vd thông điệp Zod) — bản thường sẽ thay bằng câu chung', () => {
    const zod = new Error('Invalid email address')
    expect(thongDiepLoiQuanTri(zod)).toBe('Invalid email address')
    expect(thongDiepLoiThanThien(zod)).toBe('Có lỗi xảy ra, thử lại sau.')
  })
  it('giữ câu tiếng Việt; rỗng/không phải Error → câu mặc định', () => {
    expect(thongDiepLoiQuanTri(new Error('Key này đã tồn tại'))).toBe('Key này đã tồn tại')
    expect(thongDiepLoiQuanTri(undefined, 'X')).toBe('X')
    expect(thongDiepLoiQuanTri(new Error(''), 'X')).toBe('X')
  })
})

// Cổng canh (2026-09-25): khuôn `(err as Error).message` đưa thẳng chuỗi kỹ thuật của trình
// duyệt ("Failed to fetch", "Unexpected token '<'…") lên toast/khối lỗi. Đợt 0433 dọn khuôn
// `err instanceof Error ? err.message : …` nhưng grep khi đó không bắt khuôn này, nên còn sót
// 27 điểm ở 14 panel admin + `feedbackApi`. Ngoại lệ có chủ đích: bộ chạy code môn Lập trình —
// lỗi chạy code phải hiện nguyên văn để học viên tự debug.
const SRC_DIR = join(__dirname, '..')
const RAW_MESSAGE = /\(\s*\w+\s+as\s+Error\s*\)\.message/
const RAW_MESSAGE_ALLOW = [/^lib\/\w*Runner\.ts$/, /^workers\//]

function listSource(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return listSource(full)
    const ok = ['.ts', '.tsx'].includes(extname(entry)) && !/\.test\.tsx?$|\.d\.ts$/.test(entry)
    return ok ? [full] : []
  })
}

describe('Không còn `(err as Error).message` thô lên giao diện', () => {
  const files = listSource(SRC_DIR)
  it('quét đủ mã nguồn (chống quét rỗng)', () => {
    expect(files.length).toBeGreaterThan(100)
  })
  it('chỉ bộ chạy code Lập trình được dùng khuôn này', () => {
    const offenders = files
      .map((f) =>
        f
          .slice(SRC_DIR.length + 1)
          .split('\\')
          .join('/'),
      )
      .filter((rel) => !RAW_MESSAGE_ALLOW.some((re) => re.test(rel)))
      .filter((rel) => RAW_MESSAGE.test(readFileSync(join(SRC_DIR, rel), 'utf8')))
    expect(offenders).toEqual([])
  })
})
