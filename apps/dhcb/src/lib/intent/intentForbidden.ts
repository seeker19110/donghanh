// lib/intent/intentForbidden.ts — Bộ lọc NGÔN NGỮ cho luồng "Bắt đầu theo ý định".
// Đặc tả: docs/specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md §③.5.
//
// Chín mẫu cấm gốc sống ở `@dhcb/core-personal/intakeSuggestion` (`findForbiddenLanguage`). S05
// thêm BA mẫu nữa cho đúng thứ luồng này có mà luồng cũ không có: lớp hồ sơ ẩn, token enum thô
// (`lv_new`…), và cách xếp loại người dùng theo bậc.
//
// KHÔNG dùng `\b` — nó chỉ coi `[A-Za-z0-9_]` là ký tự từ nên sẽ MÙ với tiếng Việt có dấu (bẫy đã
// ghi ở changelog 0094). Dùng lookaround `\p{L}` + cờ `u`.

import { findForbiddenLanguage, type ForbiddenHit } from '@dhcb/core-personal/intakeSuggestion'

export type { ForbiddenHit }

function phrase(pattern: string): RegExp {
  return new RegExp(`(?<!\\p{L})(?:${pattern})(?!\\p{L})`, 'iu')
}

/** Ba mẫu RIÊNG của S05 (S05a–S05c trong bảng §③.5). */
export const INTENT_FORBIDDEN_PATTERNS: { re: RegExp; why: string }[] = [
  {
    re: phrase('hồ sơ (năng lực|của bạn)|năng lực của bạn|chẩn đoán|phân tích cho thấy'),
    why: 'nhắc tới lớp hồ sơ ẩn',
  },
  {
    re: phrase('lv_new|lv_some|lv_solid|thi_cu|cong_viec|so_thich|chua_ro'),
    why: 'token enum thô rò lên chữ hiển thị',
  },
  {
    re: phrase('bạn (đang )?ở (bậc|cấp|mức|trình độ)|cấp độ của bạn|top \\d+'),
    why: 'xếp loại người dùng theo bậc',
  },
]

/**
 * Quét một tập chuỗi HIỂN THỊ bằng CẢ 12 mẫu (9 cũ + 3 mới). Danh sách rỗng nghĩa là sạch.
 * Dùng trong test bất biến T1/T2 và test DOM T6.
 */
export function findIntentForbiddenLanguage(texts: readonly string[]): ForbiddenHit[] {
  const hits: ForbiddenHit[] = [...findForbiddenLanguage([...texts])]
  for (const text of texts) {
    for (const { re, why } of INTENT_FORBIDDEN_PATTERNS) {
      if (re.test(text)) hits.push({ text, why })
    }
  }
  return hits
}
