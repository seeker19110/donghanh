// apps/dhcb/src/lib/guestActivity.ts — Khách (chưa đăng nhập) đã làm được VIỆC THẬT nào chưa.
//
// Đặc tả: docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md §P0-3 ③.
//
// Dùng để quyết định `GuestBanner` (nhắc "đăng ký để giữ tiến độ") có nên hiện hay không: khách
// vừa mở trang lần đầu, CHƯA làm gì thì banner chỉ gây phiền — chỉ hiện SAU KHI họ đã có ít nhất
// một dấu vết học thật trên máy này.
//
// Hai bằng chứng đủ để coi là "đã có phiên":
//  1. Có ít nhất một khoá `LEARNING_SESSION_PREFIX` trong localStorage — khách đang dở/đã dở một
//     bài học thật (xem `lib/learningSession.ts`).
//  2. `readLocalIntent(getGuestId())` trả về khác `null` — khách đã trả lời xong luồng
//     "Bắt đầu theo ý định" ở `/bat-dau` và chọn ít nhất một môn (`LearnerIntent.subjectIds`).
//
// Mọi truy cập localStorage bọc try/catch: chế độ riêng tư của trình duyệt có thể ném ngay ở
// `localStorage.length`/`getItem` — ném thì coi như CHƯA có phiên nào (an toàn hơn: banner ẩn
// nhầm còn hơn hiện nhầm lúc khách chưa làm gì).
import { getGuestId } from '@core/guestId'
import { LEARNING_SESSION_PREFIX } from './learningSession'
import { readLocalIntent } from './intent/learnerIntentStore'

function hasLearningSessionKey(): boolean {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(LEARNING_SESSION_PREFIX)) return true
  }
  return false
}

/** Khách đã làm ít nhất một việc thật trên máy này chưa (phiên học hoặc đã chọn việc ở /bat-dau). */
export function hasAnyGuestSession(): boolean {
  try {
    if (hasLearningSessionKey()) return true
    return readLocalIntent(getGuestId()) !== null
  } catch {
    return false
  }
}
