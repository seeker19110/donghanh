// guest.test.ts — Cửa nhận diện khách vãng lai. Bất biến quan trọng nhất: id khách là dữ liệu
// NGOÀI, không tin được — phải từ chối mọi chuỗi có thể làm hỏng khoá Redis hoặc giả danh.
import { describe, it, expect, vi, beforeEach } from 'vitest'

const validateAuthMock = vi.fn()
vi.mock('./security.js', () => ({ validateAuth: validateAuthMock }))

const { readGuestId, resolveActor } = await import('./guest.js')

function reqWith(headers: Record<string, string>): Request {
  return new Request('https://x.test/api/agent', { headers })
}

describe('readGuestId', () => {
  beforeEach(() => validateAuthMock.mockReset())

  it('nhận id đúng khuôn', () => {
    const id = 'guest_1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b'
    expect(readGuestId(reqWith({ 'x-guest-id': id }))).toBe(id)
  })

  it('bỏ khoảng trắng thừa hai đầu', () => {
    expect(readGuestId(reqWith({ 'x-guest-id': '  guest_abcdefgh  ' }))).toBe('guest_abcdefgh')
  })

  it.each([
    ['thiếu header', undefined],
    ['sai tiền tố', 'user_abcdefgh'],
    ['quá ngắn', 'guest_abc'],
    ['có dấu hai chấm (giả mạo khoá Redis)', 'guest_aaaaaaaa:ip:1.2.3.4'],
    ['có khoảng trắng giữa', 'guest_aaaa aaaa'],
    ['quá dài', 'guest_' + 'a'.repeat(200)],
  ])('từ chối: %s', (_label, value) => {
    const req = reqWith(value === undefined ? {} : { 'x-guest-id': value })
    expect(readGuestId(req)).toBeNull()
  })
})

describe('resolveActor', () => {
  beforeEach(() => validateAuthMock.mockReset())

  it('phiên đăng nhập THẮNG id khách gửi kèm — không ai mạo danh được người khác', async () => {
    validateAuthMock.mockResolvedValue({ userId: 'u-1' })
    const actor = await resolveActor(reqWith({ 'x-guest-id': 'guest_aaaaaaaa' }))
    expect(actor).toEqual({ kind: 'user', userId: 'u-1' })
  })

  it('không có phiên nhưng có id khách hợp lệ → actor khách', async () => {
    validateAuthMock.mockResolvedValue(null)
    const actor = await resolveActor(reqWith({ 'x-guest-id': 'guest_aaaaaaaa' }))
    expect(actor).toEqual({ kind: 'guest', guestKey: 'guest_aaaaaaaa' })
  })

  it('không phiên, không id → null (nơi gọi trả 401 như trước)', async () => {
    validateAuthMock.mockResolvedValue(null)
    expect(await resolveActor(reqWith({}))).toBeNull()
  })
})
