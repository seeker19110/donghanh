// packages/core-contracts/completionEvidence.ts — Hợp đồng "bằng chứng hoàn thành" một hoạt động
// học (slice S11).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md §③.1
//
// VÌ SAO CÓ FILE NÀY: trước S11, "hoàn thành" mỗi môn mỗi kiểu, và phần lớn do CLIENT tự khai
// (bấm nút = xong). Hợp đồng này chốt chiều ngược lại: client chỉ gửi TRẢ LỜI THÔ, server chấm
// lại bằng chính engine `@dhcb/core-grading` rồi mới nói ai hoàn thành cái gì.
//
// CỐ Ý KHÔNG dùng lại `EvidenceSchema` ở `evidence.ts` (Phase 06 — một quan sát cho Mastery,
// `skillId` là UUID, không gắn với bài/nội dung nào). Hai khái niệm khác nhau, gộp là hỏng cả hai.

import { z } from 'zod'
import { IsoDateTimeSchema } from './shared.js'
import { versionedObject } from './version.js'

/** Bump khi đổi kiểu/ý nghĩa field bắt buộc. Thêm field optional thì KHÔNG bump (xem version.ts). */
export const COMPLETION_EVIDENCE_SCHEMA_VERSION = 1

/**
 * Hoạt động nào SINH evidence. S11 thi hành ĐÚNG MỘT loại (`stem_lesson_check`); các loại còn
 * lại khai ở đây để bảng luật `@dhcb/core-learner/completionRules` có chỗ đứng — server trả 400
 * `UNSUPPORTED_ACTIVITY` cho tới khi có slice riêng dời chúng sang endpoint này.
 */
export const ActivityKindSchema = z.enum([
  'stem_lesson_check', // S11 — bài STEM, câu tự kiểm tra
  'programming_lesson', // đã có ở /api/programming/progress — KHÔNG đi qua endpoint này
  'programming_stage_quiz', // đã có ở /api/programming/path-quiz
  'programming_project_step', // đã có (ProgrammingProjectPage → progress)
  'cefr_vocab_circle', // đã có ở /api/progress (learned)
  'cefr_grammar', // đã có ở /api/progress (cefrGrammar)
  'cefr_dialogue', // đã có ở /api/progress (cefrDialogues)
  'cefr_level_exam', // đã có ở /api/progress (cefrExams) + computeUnlockedLevels
])
export type ActivityKind = z.infer<typeof ActivityKindSchema>

/** 4 môn STEM — khớp `stemLesson.ts` (mathematics/physics/chemistry/biology). */
export const EvidenceSubjectSchema = z.enum(['mathematics', 'physics', 'chemistry', 'biology'])
export type EvidenceSubject = z.infer<typeof EvidenceSubjectSchema>

/** Id nội dung (lessonId STEM, vd 'ly10-c2-b10'). */
export const ContentIdSchema = z.string().regex(/^[a-z0-9-]{3,64}$/)

/**
 * Khoá idempotent do client sinh MỖI lần nộp. CỐ Ý không dùng `z.uuid()`: `crypto.randomUUID`
 * vắng mặt trên HTTP không-localhost và WebView cũ, nên client có fallback chuỗi thời gian +
 * random — regex này nhận cả hai.
 */
export const AttemptIdSchema = z.string().regex(/^[A-Za-z0-9-]{16,64}$/)

/** Một câu trả lời THÔ. Không có chỗ cho đúng/sai — đó là việc của server. */
export const StemAnswerSchema = z
  .object({
    questionIndex: z.number().int().min(0).max(49), // vị trí trong lesson.checkQuestions
    raw: z.string().min(1).max(500), // chuỗi học viên gõ / id lựa chọn
  })
  .strict()
export type StemAnswer = z.infer<typeof StemAnswerSchema>

/**
 * Client → server. `.strict()` (do `versionedObject`): field lạ bị TỪ CHỐI, nên không có đường
 * cho client gửi `correct`/`passed`/`score` do nó tự tính.
 */
export const CompletionEvidenceInputSchema = versionedObject(
  {
    subjectId: EvidenceSubjectSchema,
    contentId: ContentIdSchema,
    courseId: z.string().max(64).optional(), // dự phòng; STEM không có khoá học
    activityKind: ActivityKindSchema,
    attemptId: AttemptIdSchema,
    clientAt: IsoDateTimeSchema, // giờ máy học viên — CHỈ để hiển thị, không dùng sắp thứ tự
    answers: z.array(StemAnswerSchema).min(1).max(50),
  },
  COMPLETION_EVIDENCE_SCHEMA_VERSION,
)
export type CompletionEvidenceInput = z.infer<typeof CompletionEvidenceInputSchema>

/** Kết quả chấm từng câu — `reason` là mã của `GradeResult` (`@dhcb/core-grading`). */
export const EvidenceItemSchema = z
  .object({
    questionIndex: z.number().int().min(0).max(49),
    correct: z.boolean(),
    reason: z.string().min(1).max(40),
  })
  .strict()
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>

/** Server → client (kết quả 1 lần nộp) và bản ghi lưu localStorage của khách. */
export const CompletionEvidenceSchema = z
  .object({
    schemaVersion: z.literal(COMPLETION_EVIDENCE_SCHEMA_VERSION),
    subjectId: EvidenceSubjectSchema,
    contentId: ContentIdSchema,
    courseId: z.string().max(64).optional(),
    activityKind: ActivityKindSchema,
    attemptId: AttemptIdSchema,
    clientAt: IsoDateTimeSchema,
    /** userId (uuid) HOẶC `guest_*` — để cache/merge không lẫn chủ sở hữu. */
    ownerId: z.string().min(1),
    /** Khách tự chấm ở máy mình = `local_graded`; server chấm = `server_graded`. */
    evidenceKind: z.enum(['server_graded', 'local_graded']),
    correct: z.number().int().min(0),
    total: z.number().int().min(1),
    ratio: z.number().min(0).max(1),
    passed: z.boolean(),
    /** sha256 hex nội dung bài lúc chấm (`bamNoiDungBaiHoc`); khách: vắng. */
    contentVersion: z.string().length(64).optional(),
    serverAt: IsoDateTimeSchema.optional(), // vắng khi local_graded
    /** true = `attemptId` đã có, server trả lại bản cũ, không ghi thêm. */
    duplicate: z.boolean().optional(),
    items: z.array(EvidenceItemSchema).max(50),
  })
  .strict()
export type CompletionEvidence = z.infer<typeof CompletionEvidenceSchema>

/** Trạng thái suy ra, 1 dòng/người/nội dung — thứ mục lục (S07) đọc. */
export const CompletionStateSchema = z
  .object({
    subjectId: EvidenceSubjectSchema,
    contentId: ContentIdSchema,
    status: z.enum(['in_progress', 'completed']),
    bestRatio: z.number().min(0).max(1),
    lastRatio: z.number().min(0).max(1),
    attempts: z.number().int().min(1),
    completedAt: IsoDateTimeSchema.nullable(),
    updatedAt: IsoDateTimeSchema,
    /** Mục lục hiện 'stem.evidence' (server) hoặc 'stem.evidence.local' (khách). */
    source: z.enum(['server', 'local']),
  })
  .strict()
export type CompletionState = z.infer<typeof CompletionStateSchema>
