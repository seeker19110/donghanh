// Canh `submitFeedback` trả chuỗi lỗi mà giao diện DỊCH ĐƯỢC (2026-09-25). Trước đây nhánh HTTP
// trả "Lỗi <mã>" — có dấu tiếng Việt nên `thongDiepLoiThanThien` giữ nguyên, người dùng thấy
// "Lỗi 400" trơ trọi; nhánh mạng trả thẳng "Failed to fetch" và FeedbackModal in nguyên văn.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitFeedback } from './feedbackApi'
import { thongDiepLoiThanThien } from './friendlyError'

const INPUT = { category: 'bug' as const, rating: 4, message: 'Nút gửi không phản hồi' }

afterEach(() => vi.unstubAllGlobals())

describe('submitFeedback — nhánh lỗi', () => {
  it('HTTP lỗi không kèm thông điệp → "HTTP <mã>", giao diện dịch theo mã', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<!doctype html>', { status: 502 })),
    )
    const res = await submitFeedback(INPUT)
    expect(res).toEqual({ ok: false, error: 'HTTP 502' })
    if (!res.ok) expect(thongDiepLoiThanThien(res.error)).toMatch(/máy chủ/i)
  })

  it('server có thông điệp tiếng Việt → giữ nguyên', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ error: 'Nội dung phải có ít nhất 10 ký tự' }), {
            status: 400,
          }),
      ),
    )
    const res = await submitFeedback(INPUT)
    if (res.ok) throw new Error('phải là nhánh lỗi')
    expect(thongDiepLoiThanThien(res.error)).toBe('Nội dung phải có ít nhất 10 ký tự')
  })

  it('mất mạng → chuỗi thô, giao diện dịch thành câu đọc được (cả chiều B)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    const res = await submitFeedback(INPUT)
    if (res.ok) throw new Error('phải là nhánh lỗi')
    expect(thongDiepLoiThanThien(res.error)).toMatch(/kết nối/)
    expect(thongDiepLoiThanThien(res.error, 'x', 'en')).toMatch(/connection/)
  })
})
