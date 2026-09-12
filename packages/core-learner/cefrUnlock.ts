// packages/core-learner/cefrUnlock.ts — LUẬT MỞ CẤP CEFR của môn Anh, viết MỘT LẦN dùng CHUNG
// cho server (nguồn sự thật) và client (hiển thị lạc quan trong lúc chờ server trả lời).
//
// Đặc tả: docs/specs/2026-09-12-gd2-vip-hoc-tu-do-mon-anh.md (GĐ2a).
//
// Luật:
//   - VIP  → mở cả 6 cấp A1→C2 ("học tự do", không cần thi).
//   - Free → A1 luôn mở; cấp L(n+1) mở khi cefr_exams[L(n)].passed === true.
//   - Cộng thêm tập GRANDFATHER (quyền đã cấp trước khi server nắm luật này) — chống hồi tố,
//     không ai mất quyền đã có.
//
// Hàm THUẦN: không đọc DB, không đọc localStorage, không đọc đồng hồ — test được không cần DB.
// Đây là điều kiện bất biến §⑤ của đặc tả.

/** Thứ tự cấp CEFR — quyết định "cấp trước" của luật tuần tự. */
export const CEFR_LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

export type CefrLevelId = (typeof CEFR_LEVEL_ORDER)[number]

/** Gói dịch vụ có hiệu lực (khớp `packages/core-billing/plan.ts`). */
export type UnlockPlan = 'free' | 'vip'

export interface ComputeUnlockedLevelsInput {
  /** Gói ĐANG có hiệu lực. Đọc lỗi → nơi gọi phải truyền 'free' (fail-safe khoá chặt). */
  plan: UnlockPlan
  /** Map kết quả thi thô như đang lưu ở cột `cefr_exams` (giá trị chưa chắc đúng kiểu). */
  exams: Record<string, unknown> | null | undefined
  /** Cấp đã được cấp quyền từ trước (cột `cefr_unlocked_grandfathered`). */
  grandfathered?: readonly string[] | null
}

function isCefrLevelId(value: unknown): value is CefrLevelId {
  return (
    typeof value === 'string' && (CEFR_LEVEL_ORDER as readonly string[]).includes(value as string)
  )
}

/** Chỉ coi là "thi đạt" khi cờ passed đúng boolean true — mọi giá trị lạ khác coi như chưa đạt. */
function isPassed(exams: Record<string, unknown> | null | undefined, levelId: string): boolean {
  const entry = exams?.[levelId]
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) return false
  return (entry as Record<string, unknown>).passed === true
}

/**
 * Tính tập cấp CEFR được mở cho một người học.
 * Trả về mảng đã lọc trùng và sắp theo đúng thứ tự A1→C2 (ổn định, dễ so sánh trong test).
 */
export function computeUnlockedLevels({
  plan,
  exams,
  grandfathered,
}: ComputeUnlockedLevelsInput): CefrLevelId[] {
  // VIP: học tự do — mở hết, không cần xét thi cử hay grandfather.
  if (plan === 'vip') return [...CEFR_LEVEL_ORDER]

  const unlocked = new Set<CefrLevelId>()
  CEFR_LEVEL_ORDER.forEach((levelId, index) => {
    // A1 luôn mở — điểm bắt đầu của mọi người học.
    if (index === 0) {
      unlocked.add(levelId)
      return
    }
    const previous = CEFR_LEVEL_ORDER[index - 1]
    if (previous && isPassed(exams, previous)) unlocked.add(levelId)
  })

  // Grandfather: quyền đã cấp thì giữ, kể cả khi chưa thi (chống hồi tố — bất biến §⑤).
  for (const levelId of grandfathered ?? []) {
    if (isCefrLevelId(levelId)) unlocked.add(levelId)
  }

  return CEFR_LEVEL_ORDER.filter((levelId) => unlocked.has(levelId))
}
