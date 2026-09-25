// stemRetry — hợp đồng "vào câu STEM để TỰ THỬ LẠI" giữa Sổ lỗi và trang bài (S11b).
//
// Đặc tả: docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md §4.1.
//
// Vì sao đi qua router state chứ không qua URL: `#cau-N` là hợp đồng neo đã chốt (S09/S11a) và
// là địa chỉ chia sẻ được. "Đang tự thử lại" là Ý ĐỊNH của một lượt bấm từ Sổ lỗi, không phải
// một địa chỉ — người mở link chia sẻ không có đáp án cũ nào để ẩn. Trang bài đọc cờ MỘT LẦN
// lúc mở rồi xoá khỏi history (`replace`), nên tải lại trang không kích hoạt lại.

import { z } from 'zod'

const tuThuLaiStateSchema = z.object({ tuThuLaiCau: z.number().int().min(0) })

/** State gắn vào `<Link state>` của nút "Ôn lại lỗi này" cho một câu STEM. */
export function stateTuThuLai(questionIndex: number): { tuThuLaiCau: number } {
  return { tuThuLaiCau: questionIndex }
}

/**
 * Đọc câu cần tự thử lại từ `location.state` (dữ liệu ngoài — history có thể chứa bất cứ gì).
 * Trả `null` khi không có cờ hoặc cờ sai hình dạng.
 */
export function docCauTuThuLai(state: unknown): number | null {
  const ok = tuThuLaiStateSchema.safeParse(state)
  return ok.success ? ok.data.tuThuLaiCau : null
}

/** Bỏ cờ tự thử khỏi state, giữ nguyên các khoá khác (vd state của điều hướng trong bài). */
export function boCoTuThuLai(state: unknown): unknown {
  if (!state || typeof state !== 'object') return state
  const { tuThuLaiCau: _bo, ...conLai } = state as Record<string, unknown>
  void _bo
  return Object.keys(conLai).length > 0 ? conLai : null
}
