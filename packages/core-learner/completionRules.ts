// packages/core-learner/completionRules.ts — BẢNG LUẬT "thế nào là hoàn thành" của từng hoạt
// động học. Đây là NƠI DUY NHẤT ghi các ngưỡng, để chúng không trôi mỗi nơi một con số.
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md §③.2
//
// S11 thi hành ĐÚNG MỘT dòng của bảng (bài STEM). Bảy hoạt động còn lại đã có nguồn evidence
// riêng đang chạy (`/api/programming/progress`, `/api/programming/path-quiz`, `/api/progress`) —
// S11 chỉ ĐỊNH NGHĨA chúng ở đây và trả `{ supported: false }` để server từ chối, KHÔNG dời dữ
// liệu sang bảng mới (xem §① "KHÔNG LÀM").

import type { ActivityKind } from '@dhcb/core-contracts/completionEvidence'

/**
 * Ngưỡng đạt của bài tự kiểm tra STEM: đúng ≥ 80% số câu.
 * Cùng con số với quiz chặng môn Lập trình (`PASS_RATIO`) — bài STEM có 2–10 câu nên 0.8 nghĩa
 * là "sai tối đa 1 câu khi có 5". Đổi ngưỡng sau không mất dữ liệu vì DB lưu `best_ratio` thô.
 */
export const STEM_CHECK_PASS_RATIO = 0.8

/** Ngưỡng của quiz chặng hướng chuyên sâu (`pathProgressService.ts`) — ghi lại để đối chiếu. */
export const PROGRAMMING_STAGE_QUIZ_PASS_RATIO = 0.8

/** Ngưỡng bài thi cuối cấp CEFR (`cefrExam.ts` `EXAM_PASS_PCT`) — ghi lại để đối chiếu. */
export const CEFR_EXAM_PASS_RATIO = 0.7

export interface CompletionScore {
  correct: number
  total: number
}

export type CompletionDecision =
  | { supported: true; passed: boolean; ratio: number; threshold: number }
  /** Hoạt động có nguồn evidence riêng đang chạy — endpoint S11 không nhận. */
  | { supported: false; reason: 'UNSUPPORTED_ACTIVITY' }
  /** Không có câu nào để đo — không có cách đo thì KHÔNG giả vờ đo. */
  | { supported: false; reason: 'NO_CHECK_QUESTIONS' }

/**
 * Quyết định một lượt nộp có phải là "hoàn thành" không.
 *
 * Hàm THUẦN, không AI, không DB. `passed` tính từ hai SỐ NGUYÊN `correct`/`total` trước khi
 * `ratio` bị làm tròn khi lưu `numeric(4,3)` — nếu so bằng ratio đã làm tròn thì 2/3 (0.667)
 * hay 4/5 có thể lệch ngưỡng ở biên.
 */
export function decideCompletion(kind: ActivityKind, score: CompletionScore): CompletionDecision {
  if (kind !== 'stem_lesson_check') return { supported: false, reason: 'UNSUPPORTED_ACTIVITY' }
  if (!Number.isFinite(score.total) || score.total < 1) {
    return { supported: false, reason: 'NO_CHECK_QUESTIONS' }
  }
  const correct = Math.max(0, Math.min(score.correct, score.total))
  return {
    supported: true,
    // Epsilon để 4/5 (= 0.8 nhưng biểu diễn nhị phân không chính xác tuyệt đối) không bị đánh
    // trượt oan ngay tại biên ngưỡng.
    passed: correct / score.total >= STEM_CHECK_PASS_RATIO - 1e-9,
    ratio: correct / score.total,
    threshold: STEM_CHECK_PASS_RATIO,
  }
}
