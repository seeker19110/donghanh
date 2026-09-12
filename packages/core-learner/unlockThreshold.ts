// packages/core-learner/unlockThreshold.ts — NGƯỠNG MỞ CHẶNG SAU, dùng chung CẢ NỀN TẢNG.
//
// Một con số duy nhất cho mọi môn: người học chỉ phải nhớ MỘT luật ("xong khoảng 70% là đi
// tiếp được"), và khi đổi ngưỡng thì đổi đúng ở đây, không phải đi lùng số 70 rải rác.
//
//   · Môn Anh  — `apps/dhcb/src/lib/cefrProgress.ts` re-export hằng này (điều kiện dự thi cuối cấp).
//   · Môn Lập trình — `packages/subject-programming/levelLock.ts` (mở bậc P(n+1)).
//
// Đặc tả: docs/specs/2026-09-12-gd3-khoa-bai-mon-lap-trinh.md §⑥.

/** Tỉ lệ hoàn thành của chặng trước để mở chặng sau (0.7 = 70%). */
export const UNLOCK_PCT = 0.7

/**
 * Số mục tối thiểu phải hoàn thành trong `total` mục để đạt ngưỡng.
 * Làm tròn LÊN (5 bài → 4 bài, vì 3/5 = 60% < 70%); trừ epsilon để sai số dấu phẩy động
 * không đẩy một ngưỡng chẵn lên thêm 1 (vd 10 × 0.7 = 7.000000000000001).
 */
export function requiredToUnlock(total: number): number {
  if (total <= 0) return 0
  return Math.ceil(total * UNLOCK_PCT - 1e-9)
}
