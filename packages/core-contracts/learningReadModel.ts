// packages/core-contracts/learningReadModel.ts — Contract cho Learning Domain Read Model (V2-11).
// Expose typed Learning read model to Companion mà không lộ internal storage của Learning.
import { z } from 'zod'
import { versionedObject } from './version.js'
import { DirectionSchema, CefrLevelSchema, IsoDateTimeSchema, UuidSchema } from './shared.js'

export const LEARNING_READ_MODEL_SCHEMA_VERSION = 1

export const MasterySummarySchema = z
  .object({
    masteredCount: z.number().int().nonnegative(),
    inProgressCount: z.number().int().nonnegative(),
    dueForReviewCount: z.number().int().nonnegative(),
  })
  .strict()

export const LearningReadModelSchema = versionedObject(
  {
    personId: UuidSchema,
    subject: z.string().min(1).max(100),
    direction: DirectionSchema,
    currentLevel: CefrLevelSchema.nullable(),
    dailySpeed: z.number().int().positive(),
    dailyMinutes: z.number().int().nonnegative(),
    onboarded: z.boolean(),
    activeGoal: z.string().max(500).nullable(),
    masterySummary: MasterySummarySchema,
    // ADR-0005 mục 2 (Accepted 2026-09-19): nullable — `null` nghĩa "chưa đo được" (subject
    // không có nguồn bằng chứng đã xác thực server), KHÔNG được coi `0` là thay thế hợp lệ.
    recentEvidenceCount: z.number().int().nonnegative().nullable(),
    srsDueCount: z.number().int().nonnegative(),
    updatedAt: IsoDateTimeSchema,
  },
  LEARNING_READ_MODEL_SCHEMA_VERSION,
)

export type LearningReadModel = z.infer<typeof LearningReadModelSchema>
export type MasterySummary = z.infer<typeof MasterySummarySchema>
