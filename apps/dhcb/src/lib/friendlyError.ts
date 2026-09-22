// apps/dhcb/src/lib/friendlyError.ts — đổi lỗi kỹ thuật thành câu người dùng đọc được.
//
// Vì sao: audit UI/UX 2026-09-22 (P1-6) thấy trang Ghi chú in nguyên văn
// `Unexpected token '<', "<!doctype "... is not valid JSON` — chuỗi `err.message` của trình
// duyệt khi máy chủ trả HTML thay vì JSON. Người học không làm gì được với câu đó. Chuỗi thô
// vẫn giữ để gửi Sentry/console; giao diện chỉ hiện câu tiếng Việt kèm việc nên làm.

const MAU: Array<[RegExp, string]> = [
  [
    /Failed to fetch|NetworkError|Load failed|ERR_INTERNET|ERR_NETWORK/i,
    'Không kết nối được máy chủ — kiểm tra mạng rồi thử lại.',
  ],
  [
    /Unexpected token|is not valid JSON|JSON\.parse/i,
    'Máy chủ trả về dữ liệu không đọc được — thường do đang cập nhật, thử lại sau ít phút.',
  ],
  [/\b(401|Unauthorized|token)\b/i, 'Phiên đăng nhập đã hết hạn — đăng nhập lại để tiếp tục.'],
  [/\b403\b|Forbidden/i, 'Bạn không có quyền xem nội dung này.'],
  [/\b404\b|Not Found/i, 'Không tìm thấy dữ liệu được yêu cầu.'],
  [/\b(429)\b|Too Many|quá nhiều|hết lượt/i, 'Bạn thao tác hơi nhanh — chờ một chút rồi thử lại.'],
  [/\b5\d\d\b|Internal Server|HTTP error 5/i, 'Máy chủ đang gặp sự cố — thử lại sau ít phút.'],
  [/timeout|timed out|AbortError/i, 'Máy chủ phản hồi quá lâu — thử lại.'],
]

/**
 * Trả về câu thân thiện cho `err`. Thông điệp đã là tiếng Việt có dấu (do server hoặc code app
 * viết) thì giữ nguyên — chỉ dịch các chuỗi kỹ thuật của trình duyệt/HTTP.
 */
export function thongDiepLoiThanThien(
  err: unknown,
  macDinh = 'Có lỗi xảy ra, thử lại sau.',
): string {
  const raw = err instanceof Error ? err.message : typeof err === 'string' ? err : ''
  if (!raw) return macDinh
  for (const [re, cau] of MAU) if (re.test(raw)) return cau
  // Chuỗi có dấu tiếng Việt → do người viết, đã thân thiện.
  if (/[ăâđêôơưàáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵ]/i.test(raw)) return raw
  return macDinh
}
