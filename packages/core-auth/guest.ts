// guest.ts — Nhận diện KHÁCH VÃNG LAI ở server (chế độ xem web không cần đăng nhập).
//
// Đặc tả: docs/specs/2026-09-15-mo-xem-web-khong-can-dang-nhap.md
//
// RANH GIỚI BẢO MẬT — đọc kỹ trước khi dùng ở endpoint mới:
//   `Actor` kiểu 'guest' KHÔNG phải một danh tính được xác thực. Nó chỉ là một chuỗi do trình
//   duyệt tự khai, dùng ĐÚNG MỘT việc: gom lượt dùng thử AI của cùng một trình duyệt lại để
//   đếm. TUYỆT ĐỐI không dùng nó làm khoá đọc/ghi bất kỳ dữ liệu người dùng nào (hồ sơ, tiến
//   độ, thanh toán, lịch sử) — với những thứ đó vẫn phải `validateAuth()` như cũ.

import { validateAuth } from './security.js'

export const GUEST_ID_HEADER = 'x-guest-id'
const GUEST_ID_PREFIX = 'guest_'

// Độ dài tối đa phòng payload rác (header là dữ liệu ngoài, không tin được).
const MAX_GUEST_ID_LEN = 80

/** Người gọi một endpoint có nhánh dùng thử: tài khoản thật, hoặc khách ẩn danh. */
export type Actor = { kind: 'user'; userId: string } | { kind: 'guest'; guestKey: string }

/**
 * Đọc id khách từ header. Trả `null` nếu thiếu/sai khuôn — nơi gọi coi như "không có danh tính"
 * và trả 401 y hệt trước đây.
 *
 * Chỉ nhận ký tự an toàn (chữ/số/`-`/`_`): chuỗi này sẽ đi vào khoá Redis, không được phép
 * chứa dấu `:` hay khoảng trắng để không giả mạo được khoá của người khác.
 */
export function readGuestId(req: Request): string | null {
  const raw = req.headers.get(GUEST_ID_HEADER)
  if (!raw) return null
  const value = raw.trim()
  if (value.length < GUEST_ID_PREFIX.length + 8 || value.length > MAX_GUEST_ID_LEN) return null
  if (!value.startsWith(GUEST_ID_PREFIX)) return null
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null
  return value
}

/**
 * Ai đang gọi? Ưu tiên phiên đăng nhập thật; không có thì mới xét khách.
 * `null` = không xác định được → nơi gọi trả 401 như trước.
 */
export async function resolveActor(req: Request): Promise<Actor | null> {
  const auth = await validateAuth(req)
  if (auth) return { kind: 'user', userId: auth.userId }
  const guestKey = readGuestId(req)
  return guestKey ? { kind: 'guest', guestKey } : null
}
