// packages/core-learner/stemEvidenceGrader.ts — Chấm LẠI một lượt nộp bài tự kiểm tra STEM từ
// trả lời THÔ của học viên.
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md §① mục 4.
//
// Hàm THUẦN, tất định, KHÔNG AI/mạng/CSDL — dùng đúng `gradeAnswer` của `@dhcb/core-grading`,
// tức cùng một đoạn mã client dùng để phản hồi tức thì. Nhờ vậy server và client không bao giờ
// lệch luật chấm, mà quyền phán đúng/sai vẫn nằm ở server (CLAUDE.md §4.2 — không tin client).

import { gradeAnswer, type AnswerSpec } from '@dhcb/core-grading/index'
import type { EvidenceItem, StemAnswer } from '@dhcb/core-contracts/completionEvidence'

/** Phần bài học mà việc chấm cần tới — khớp cả 4 môn STEM (`checkQuestions[].answer`). */
export interface StemLessonLike {
  readonly checkQuestions: readonly { readonly answer: AnswerSpec }[]
}

export interface StemGradeSummary {
  correct: number
  total: number
  items: EvidenceItem[]
}

/**
 * Chấm toàn bộ bài: `total` là SỐ CÂU CỦA BÀI, không phải số câu học viên gửi — câu không có
 * trả lời tính là SAI (`reason: 'EMPTY'`). Nếu không thế, bỏ trống câu khó sẽ thành cách dễ nhất
 * để đạt ngưỡng.
 *
 * Trả lời trùng `questionIndex`: lấy bản ghi ĐẦU TIÊN, các bản sau bỏ qua (tất định).
 */
export function gradeStemEvidence(
  lesson: StemLessonLike,
  answers: readonly StemAnswer[],
): StemGradeSummary {
  const theoCau = new Map<number, string>()
  for (const a of answers) {
    if (!theoCau.has(a.questionIndex)) theoCau.set(a.questionIndex, a.raw)
  }

  const items: EvidenceItem[] = lesson.checkQuestions.map((q, questionIndex) => {
    const raw = theoCau.get(questionIndex)
    if (raw === undefined) return { questionIndex, correct: false, reason: 'EMPTY' }
    const ketQua = gradeAnswer(raw, q.answer)
    return { questionIndex, correct: ketQua.correct, reason: ketQua.reason }
  })

  return {
    correct: items.filter((i) => i.correct).length,
    total: lesson.checkQuestions.length,
    items,
  }
}
