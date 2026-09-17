// apps/dhcb/src/prompts/companionVoice.ts — Giọng viết CỐ ĐỊNH của Companion "Bạn Đồng Hành"
// cho phần KHÔNG đến từ `/api/proactive-briefing` (lời chào theo giờ, câu quay lại sau bỏ
// bẵng). Đây là hằng khuôn câu THUẦN, KHÔNG gọi AI — vì vậy KHÔNG đi vào `golden.test.ts`
// (snapshot đó chỉ canh prompt gửi cho AI). Xem docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md
// mục P0-2 ③.
//
// [P0-2, 2026-09-17] Tách khỏi `HomeAiBriefingCard.tsx` (trước đây hàm `timeOfDayGreeting` nằm
// tại chỗ) để dùng lại được ở GuestHome (P0-3) và các nơi khác cần giọng Companion.

/** Lời chào theo giờ trong ngày, có tên nếu có. "Chào buổi sáng, Minh." */
export function loiChaoTheoGio(hour: number, name?: string): string {
  const moi =
    hour >= 5 && hour < 12
      ? 'Chào buổi sáng'
      : hour >= 12 && hour < 18
        ? 'Chào buổi chiều'
        : 'Chào buổi tối'
  return name ? `${moi}, ${name}.` : `${moi}, bạn.`
}

/** Câu mời quay lại sau khi bỏ bẵng ≥3 ngày (lib/comeback.ts COMEBACK_THRESHOLD_DAYS). */
export function cauQuayLai(daysAway: number): string {
  return `Đã ${daysAway} ngày rồi — bắt đầu nhẹ thôi, không cần ôn hết nợ cũ.`
}
