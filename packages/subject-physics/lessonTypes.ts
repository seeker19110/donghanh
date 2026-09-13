// lessonTypes.ts — Kiểu + Zod schema cho BÀI HỌC môn Vật lí.
import { z } from 'zod'
import {
  AdvancedTierSchema,
  LessonAnimationSchema,
  LessonTrackSchema,
} from '@dhcb/core-contracts/lessonAnimation'

export const PHYSICS_GRADES = ['10', '11', '12'] as const
export type PhysicsGrade = (typeof PHYSICS_GRADES)[number]

export const PhysicsAnswerSpecSchema = z.union([
  z
    .object({
      kind: z.literal('numeric'),
      value: z.number(),
      unit: z.string().optional(),
      unitRequired: z.boolean().optional(),
      tolerance: z
        .union([
          z.object({ mode: z.literal('exact') }).strict(),
          z.object({ mode: z.literal('absolute'), eps: z.number() }).strict(),
          z.object({ mode: z.literal('relative'), pct: z.number() }).strict(),
          z.object({ mode: z.literal('sigfig'), digits: z.number() }).strict(),
        ])
        .optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal('choice'),
      correctIds: z.array(z.string().min(1)).min(1),
    })
    .strict(),
  z
    .object({
      kind: z.literal('fraction'),
      num: z.number(),
      den: z.number(),
      requireSimplified: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal('expression'),
      expr: z.string().min(1),
    })
    .strict(),
])
export type PhysicsAnswerSpec = z.infer<typeof PhysicsAnswerSpecSchema>

export const PhysicsCheckQuestionSchema = z
  .object({
    prompt: z.string().min(1).max(800),
    choices: z.array(z.object({ id: z.string().min(1), label: z.string().min(1) })).optional(),
    answer: PhysicsAnswerSpecSchema,
    explain: z.string().min(1).max(1000),
  })
  .strict()
  .refine((q) => (q.answer.kind === 'choice') === (q.choices !== undefined), {
    message: "câu 'choice' phải có choices; đáp án khác thì không được có choices",
  })

export const PhysicsLessonSchema = z
  .object({
    id: z.string().regex(/^ly(10|11|12)-c\d+-b\d+$/),
    grade: z.enum(PHYSICS_GRADES),
    chapterNumber: z.number().int().positive(),
    chapterTitle: z.string().min(1).max(200),
    lessonNumber: z.number().int().positive(),
    title: z.string().min(1).max(200),
    hook: z.string().min(1).max(600),
    theory: z.string().min(1).max(6000),
    workedExample: z
      .object({
        problem: z.string().min(1).max(1000),
        steps: z.array(z.string().min(1).max(1000)).min(1).max(10),
        answer: z.string().min(1).max(300),
      })
      .strict(),
    checkQuestions: z.array(PhysicsCheckQuestionSchema).min(2).max(10),
    srsCards: z
      .array(
        z
          .object({
            hoi: z.string().min(1).max(200),
            dap: z.string().min(1).max(400),
          })
          .strict(),
      )
      .min(2)
      .max(4),
    // ── Hoạt ảnh + nhánh nâng cao (thêm 2026-09-13, xem docs/specs/2026-09-13-hoan-thien-4-mon-stem.md) ──
    /** Hoạt ảnh minh hoạ cơ chế đang dạy. Không bắt buộc: bài nào hình động không giúp
     *  hiểu thêm thì bỏ trống còn hơn vẽ hình trang trí. */
    animation: LessonAnimationSchema.optional(),
    /** 'core' = chương trình chuẩn; 'advanced' = chuyên đề bồi dưỡng học sinh giỏi. */
    track: LessonTrackSchema,
    /** Cấp của chuyên đề nâng cao — chỉ có mặt khi track === 'advanced'. */
    advancedTier: AdvancedTierSchema.optional(),
    reviewStatus: z.enum(['draft', 'reviewed']),
  })
  .strict()
  .refine((l) => (l.track === 'advanced') === (l.advancedTier !== undefined), {
    message: "bài 'advanced' phải khai báo advancedTier; bài 'core' thì không được có",
  })
  .refine((l) => l.id === `ly${l.grade}-c${l.chapterNumber}-b${l.lessonNumber}`, {
    message: 'id phải khớp đúng ly<lớp>-c<chương>-b<bài>',
  })

export type PhysicsCheckQuestion = z.infer<typeof PhysicsCheckQuestionSchema>
export type PhysicsLesson = z.infer<typeof PhysicsLessonSchema>
