export type DailyPlanActionKind =
  | 'srs_review'
  | 'continue_learning'
  | 'discover_path'
  // [Slice 04] Người chưa có tiến độ môn nào: việc đầu tiên là CHỌN MÔN, không phải "lộ trình"
  // (vốn là lộ trình CEFR Tiếng Anh) — nền tảng không ngầm định môn.
  | 'choose_subject'

export interface DailyPlanAction {
  kind: DailyPlanActionKind
  priority: number
  title: string
  reason: string
  estimatedMinutes: number
}

export interface DailyPlanInput {
  srsDueCount: number
  dailyLearned: number
  dailyMax: number
  continueLessonLabel?: string
  /**
   * Người dùng đã có tiến độ ở môn đang được lập kế hoạch chưa (hiện là Tiếng Anh: từ đã học,
   * ngữ pháp đã xong, hoặc đã thi). `false` → không đề xuất ôn/học tiếp của môn đó mà mời chọn
   * môn. Mặc định `true` để các nơi gọi cũ không đổi hành vi.
   */
  hasSubjectProgress?: boolean
}

/**
 * P1.1 Daily Learning Loop — deterministic planner.
 *
 * Không gọi model, không đọc/ghi storage và không mutate user state. Hàm này chỉ xếp hạng
 * những tín hiệu mà Home đã có sẵn. Sau này Life Graph/Recommendation Engine có thể cấp thêm
 * candidate nhưng vẫn đi qua cùng một lớp xếp hạng trước khi cần LLM giải thích.
 */
export function buildDailyLearningPlan(input: DailyPlanInput): DailyPlanAction[] {
  const candidates: DailyPlanAction[] = []
  if (input.hasSubjectProgress === false) {
    return [
      {
        kind: 'choose_subject',
        priority: 50,
        title: 'Chọn môn để bắt đầu',
        reason:
          'Bạn chưa học môn nào — vào Góc học tập chọn Tiếng Anh, Toán, Lý, Hoá, Sinh hay Lập trình.',
        estimatedMinutes: 1,
      },
    ]
  }
  const srsDue = Math.max(0, Math.floor(input.srsDueCount))
  const dailyMax = Math.max(0, Math.floor(input.dailyMax))
  const dailyLearned = Math.max(0, Math.floor(input.dailyLearned))

  if (srsDue > 0) {
    candidates.push({
      kind: 'srs_review',
      priority: 100 + Math.min(srsDue, 50),
      title: `Ôn ${srsDue} thẻ đến hạn`,
      reason: 'Ôn trước khi quên để giữ trí nhớ dài hạn.',
      estimatedMinutes: Math.max(2, Math.min(12, Math.ceil(srsDue / 5))),
    })
  }

  if (input.continueLessonLabel) {
    const remaining = Math.max(0, dailyMax - dailyLearned)
    candidates.push({
      kind: 'continue_learning',
      priority: srsDue > 0 ? 90 : 110,
      // Ghi rõ MÔN: nền tảng có nhiều môn, "học tiếp" trần không nói đang tiếp môn nào.
      title: `Tiếng Anh · ${input.continueLessonLabel}`,
      reason:
        remaining > 0
          ? `Tiếp tục mạch đang học; hôm nay còn ${remaining} từ trong nhịp bạn đã chọn.`
          : 'Giữ mạch học đang dang dở thay vì mở thêm nội dung mới.',
      estimatedMinutes: 10,
    })
  }

  if (candidates.length < 2) {
    candidates.push({
      kind: 'discover_path',
      priority: 20,
      title: 'Chọn bước tiếp theo trong lộ trình',
      reason: 'Chưa có việc đến hạn; chọn một bước nhỏ để giữ nhịp hôm nay.',
      estimatedMinutes: 10,
    })
  }

  return candidates.sort((a, b) => b.priority - a.priority).slice(0, 2)
}
