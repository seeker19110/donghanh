// stemLesson.ts — Hình dạng CHUNG của một bài học STEM, đủ để giao diện liệt kê và định tuyến
// mà không cần biết mình đang ở môn nào.
//
// Bốn môn Toán · Lí · Hoá · Sinh mỗi môn có schema Zod riêng (khác nhau ở khuôn id và ở bộ
// AnswerSpec), nhưng phần giao diện cần thì giống hệt nhau. Khai ở đây MỘT lần để trang danh
// sách bài, trang học và thanh điều hướng viết một lần dùng cho cả bốn môn.
import type { AnswerSpec } from '@dhcb/core-grading/types'
import type { AdvancedTier, LessonAnimation, LessonTrack } from './lessonAnimation.js'

/** Một câu hỏi kiểm tra — đáp án dùng thẳng AnswerSpec của engine chấm, không khai kiểu song song. */
export interface StemCheckQuestion {
  prompt: string
  choices?: Array<{ id: string; label: string }>
  answer: AnswerSpec
  explain: string
}

/** Trạng thái duyệt chuyên môn của một bài. */
export type ReviewStatus = 'draft' | 'reviewed'

/** Phần chung mà mọi bài học STEM đều có — bốn kiểu bài của bốn môn đều thoả. */
export interface StemLessonLike {
  id: string
  grade: string
  chapterNumber: number
  chapterTitle: string
  lessonNumber: number
  title: string
  hook: string
  theory: string
  workedExample: { problem: string; steps: string[]; answer: string }
  checkQuestions: StemCheckQuestion[]
  srsCards: Array<{ hoi: string; dap: string }>
  animation?: LessonAnimation
  track: LessonTrack
  advancedTier?: AdvancedTier
  /** 'draft' = CHƯA có người chuyên môn đọc lại. Giao diện PHẢI nói ra điều này với người học
   *  (audit 2026-09-14: 294/294 bài là draft mà không màn nào hé lộ). */
  reviewStatus: ReviewStatus
}

/** Bản tóm tắt NHẸ của một bài — đủ cho mọi màn liệt kê, không kéo theo nội dung bài. */
export interface StemLessonSummary {
  id: string
  grade: string
  chapterNumber: number
  chapterTitle: string
  lessonNumber: number
  title: string
  track: LessonTrack
  advancedTier?: AdvancedTier
  hasAnimation: boolean
  reviewStatus: ReviewStatus
  /** Khoá của tệp chương chứa bài này — dùng để nạp lười đúng tệp. */
  chapterKey: string
}

/** Bốn môn STEM có bài học theo khuôn trên. */
export const STEM_SUBJECT_IDS = ['mathematics', 'physics', 'chemistry', 'biology'] as const
export type StemSubjectId = (typeof STEM_SUBJECT_IDS)[number]
