// src/lib/authHeader.ts — Lấy session token hiện tại để gửi kèm request lên server.
// Giai đoạn B: token tự phát hành (xem api/auth.ts), lưu trong localStorage — thay
// Supabase access_token trước đây.

import { getGuestHeader } from './guestId.js'

const TOKEN_KEY = 'gsa_session_token_v1'

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null // localStorage bị chặn (chế độ ẩn danh nghiêm ngặt) — coi như chưa đăng nhập
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* bỏ qua — chỉ ảnh hưởng persist qua lần tải lại, không chặn phiên hiện tại */
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export function getAccessToken(): string | undefined {
  return getStoredToken() ?? undefined
}

// Header sẵn sàng spread vào fetch({ headers: { ...getAuthHeader() } }).
//
// [2026-09-15 — chế độ Khách] Chưa đăng nhập thì KHÔNG còn trả về rỗng nữa mà gửi danh tính
// khách ẩn danh (`X-Guest-Id`). Nhờ vậy 3 endpoint AI/audio có nhánh dùng thử giới hạn nhận
// diện được "cùng một trình duyệt" mà không cần tài khoản. Mọi endpoint khác vẫn trả 401 y như
// cũ — chúng không đọc header này. Đường ĐÃ đăng nhập không đổi gì: có token thì chỉ gửi token.
export function getAuthHeader(): Record<string, string> {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : getGuestHeader()
}
