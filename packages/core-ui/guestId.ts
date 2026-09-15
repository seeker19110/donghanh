// guestId.ts — Danh tính KHÁCH VÃNG LAI (chưa đăng nhập).
//
// Đặc tả: docs/specs/2026-09-15-mo-xem-web-khong-can-dang-nhap.md
//
// Vì sao lại là một "uid" bình thường: toàn bộ module tiến độ phía client (vocab, cefrProgress,
// srs, programmingProgress, storage…) đã nhận sẵn tham số `uid: string` và ghi localStorage theo
// khoá `<tiền tố>_<uid>`. Cấp cho khách một uid ổn định là đủ để họ học thật — KHÔNG phải sửa
// từng trang. Tiền tố `guest_` để mọi nơi phân biệt được "đây là khách" chỉ bằng chuỗi id
// (isGuestId), không cần truyền thêm cờ xuống sâu.
//
// Id này KHÔNG phải thứ để tin cậy về bảo mật: người dùng xoá/sửa được localStorage của chính
// họ. Nó chỉ dùng để (1) gom tiến độ cục bộ của một trình duyệt, (2) đếm lượt dùng thử AI ở
// server ở mức chặn lạm dụng thô — server còn chặn thêm theo IP.

// Đây là TÊN KHOÁ localStorage, không phải bí mật. gitleaks bắt nhầm vì chuỗi có entropy cao
// (rule generic-api-key); chú thích `gitleaks:allow` phải nằm NGAY TRÊN CHÍNH DÒNG bị bắt thì
// mới có tác dụng. Miễn trừ đúng một dòng — cố ý KHÔNG thêm `.gitleaks.toml` với allowlist
// regex rộng, vì như vậy là nới bộ quét bí mật của cả dự án để đi vòng qua một dòng vô hại.
const GUEST_ID_KEY = 'dhcb_guest_id_v1' // gitleaks:allow

/** Tiền tố nhận dạng — dùng chung client lẫn server. */
export const GUEST_ID_PREFIX = 'guest_'

/** Header gửi kèm request khi chưa đăng nhập. */
export const GUEST_ID_HEADER = 'X-Guest-Id'

/** Chuỗi này có phải id khách không (dùng để chặn mọi đường đồng bộ server). */
export function isGuestId(id: string | null | undefined): boolean {
  return typeof id === 'string' && id.startsWith(GUEST_ID_PREFIX)
}

function newGuestId(): string {
  // crypto.randomUUID có ở mọi trình duyệt dự án hỗ trợ; vẫn có nhánh dự phòng vì API này chỉ
  // tồn tại trên secure context (https/localhost) — mở bằng http://<ip-LAN> lúc dev là undefined.
  const uuid =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return GUEST_ID_PREFIX + uuid
}

// Bộ nhớ đệm trong tiến trình: localStorage bị chặn (Safari riêng tư nghiêm ngặt) thì khách vẫn
// giữ được MỘT id xuyên suốt phiên hiện tại, thay vì mỗi lần gọi lại sinh một id mới (mỗi lượt
// AI sẽ thành một "khách" mới → hạn mức mất tác dụng).
let cached: string | null = null

/** Id khách của trình duyệt này — sinh một lần rồi dùng mãi. */
export function getGuestId(): string {
  if (cached) return cached
  try {
    const saved = localStorage.getItem(GUEST_ID_KEY)
    if (saved && isGuestId(saved)) {
      cached = saved
      return saved
    }
  } catch {
    /* localStorage bị chặn — rơi xuống nhánh sinh mới, giữ trong bộ nhớ tiến trình */
  }
  const id = newGuestId()
  cached = id
  try {
    localStorage.setItem(GUEST_ID_KEY, id)
  } catch {
    /* ignore */
  }
  return id
}

/** Xoá danh tính khách (gọi sau khi đã hợp nhất tiến độ vào tài khoản thật). */
export function clearGuestId(): void {
  cached = null
  try {
    localStorage.removeItem(GUEST_ID_KEY)
  } catch {
    /* ignore */
  }
}

/** Header ẩn danh gửi kèm fetch khi chưa đăng nhập. */
export function getGuestHeader(): Record<string, string> {
  return { [GUEST_ID_HEADER]: getGuestId() }
}
