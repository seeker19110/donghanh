// apps/dhcb/src/lib/friendlyError.ts — đổi lỗi kỹ thuật thành câu người dùng đọc được.
//
// Vì sao: audit UI/UX 2026-09-22 (P1-6) thấy trang Ghi chú in nguyên văn
// `Unexpected token '<', "<!doctype "... is not valid JSON` — chuỗi `err.message` của trình
// duyệt khi máy chủ trả HTML thay vì JSON. Người học không làm gì được với câu đó. Chuỗi thô
// vẫn giữ để gửi Sentry/console; giao diện chỉ hiện câu người đọc được kèm việc nên làm.
//
// Hai ngôn ngữ: chiều A (giao diện tiếng Việt) và chiều B (giao diện tiếng Anh) — truyền `lang`.
// Câu do server/app tự viết (có dấu tiếng Việt, hoặc không khớp mẫu kỹ thuật nào và có
// khoảng trắng như một câu) thì giữ nguyên.

export type NgonNgu = 'vi' | 'en'

const MAU: Array<[RegExp, string, string]> = [
  [
    /Failed to fetch|NetworkError|Load failed|ERR_INTERNET|ERR_NETWORK|ECONNREFUSED/i,
    'Không kết nối được máy chủ — kiểm tra mạng rồi thử lại.',
    'Cannot reach the server — check your connection and try again.',
  ],
  [
    /Unexpected token|is not valid JSON|JSON\.parse|Unexpected end of JSON/i,
    'Máy chủ trả về dữ liệu không đọc được — thường do đang cập nhật, thử lại sau ít phút.',
    'The server returned unreadable data — usually an update in progress, try again in a few minutes.',
  ],
  [
    /\b401\b|Unauthorized|token/i,
    'Phiên đăng nhập đã hết hạn — đăng nhập lại để tiếp tục.',
    'Your session has expired — sign in again to continue.',
  ],
  [/\b403\b|Forbidden/i, 'Bạn không có quyền xem nội dung này.', 'You do not have access to this.'],
  [
    /\b404\b|Not Found/i,
    'Không tìm thấy dữ liệu được yêu cầu.',
    'The requested data was not found.',
  ],
  [
    /\b429\b|Too Many/i,
    'Bạn thao tác hơi nhanh — chờ một chút rồi thử lại.',
    'Too many requests — wait a moment and try again.',
  ],
  [
    /\b5\d\d\b|Internal Server|HTTP error 5/i,
    'Máy chủ đang gặp sự cố — thử lại sau ít phút.',
    'The server is having trouble — try again in a few minutes.',
  ],
  [
    /timeout|timed out|AbortError/i,
    'Máy chủ phản hồi quá lâu — thử lại.',
    'The server took too long — try again.',
  ],
]

const CO_DAU_TIENG_VIET = /[ăâđêôơưàáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵ]/i
// Chuỗi kỹ thuật: mã lỗi/định danh kiểu `ECONNRESET`, `socket hang up`, đường dẫn, stack…
const TRONG_NHU_MA = /^[A-Z_]{4,}\b|\bat\s+\S+:\d+|\/[\w./-]+:\d+|<[a-z!]|\{.*\}$/

/** Lấy chuỗi lỗi thô từ `err` (Error hoặc chuỗi); kiểu khác → chuỗi rỗng. */
function chuoiLoiTho(err: unknown): string {
  return err instanceof Error ? err.message : typeof err === 'string' ? err : ''
}

/** Khớp một chuỗi kỹ thuật của trình duyệt/HTTP trong bảng `MAU` thì trả câu dịch, không thì null. */
function dichLoiKyThuat(raw: string, lang: NgonNgu): string | null {
  for (const [re, vi, en] of MAU) if (re.test(raw)) return lang === 'en' ? en : vi
  return null
}

/**
 * Trả về câu thân thiện cho `err`. Thông điệp đã là câu người viết (server hoặc code app) thì
 * giữ nguyên — chỉ dịch các chuỗi kỹ thuật của trình duyệt/HTTP.
 */
export function thongDiepLoiThanThien(
  err: unknown,
  macDinh = 'Có lỗi xảy ra, thử lại sau.',
  lang: NgonNgu = 'vi',
): string {
  const raw = chuoiLoiTho(err)
  if (!raw) return macDinh
  const daDich = dichLoiKyThuat(raw, lang)
  if (daDich) return daDich
  if (CO_DAU_TIENG_VIET.test(raw)) return raw
  if (TRONG_NHU_MA.test(raw)) return macDinh
  // Câu tiếng Anh thường do server/app viết cho chiều B ("Daily limit reached") — giữ.
  if (lang === 'en' && /\s/.test(raw)) return raw
  return macDinh
}

/**
 * Bản cho màn QUẢN TRỊ (`components/admin/*`, 2026-09-25). Vẫn dịch lỗi kỹ thuật của trình
 * duyệt/HTTP ("Failed to fetch", JSON hỏng, 401/5xx…) như bản trên, nhưng GIỮ NGUYÊN mọi câu
 * khác — kể cả câu tiếng Anh không dấu như thông điệp Zod mặc định ("Invalid email address").
 * Bản trên thay những câu đó bằng câu chung chung vì người học không làm gì được với chúng;
 * admin thì cần đúng chi tiết đó để biết phải sửa gì.
 */
export function thongDiepLoiQuanTri(err: unknown, macDinh = 'Có lỗi xảy ra, thử lại sau.'): string {
  const raw = chuoiLoiTho(err)
  if (!raw) return macDinh
  return dichLoiKyThuat(raw, 'vi') ?? raw
}
