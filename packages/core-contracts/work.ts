// packages/core-contracts/work.ts — Contract cho Work Domain (V2-15).
import { z } from 'zod'
import { versionedObject } from './version.js'
import { IsoDateTimeSchema, UuidSchema } from './shared.js'

export const WORK_SCHEMA_VERSION = 1

/**
 * Giới hạn ĐỘ DÀI nội dung một ghi chú (trường `summary` của `WorkDocument`) — 10.000 ký tự,
 * chốt 2026-09-20 cùng đợt đổi tên trụ "Công việc" thành "Ghi chú".
 *
 * Một hằng số DÙNG CHUNG cho cả ba tầng, cố ý không lặp lại con số ở đâu khác:
 *   - giao diện: `maxLength` của ô nhập + bộ đếm ký tự (apps/dhcb/src/pages/domains/notes/Notes.tsx)
 *   - API: Zod `.max()` ở apps/server/src/api/domains/work.ts (KHÔNG tin client — CLAUDE.md 4.2)
 *   - hợp đồng: chính schema dưới đây, nên dữ liệu đọc lên từ CSDL cũng phải qua cổng này.
 *
 * Cột CSDL vẫn là TEXT không giới hạn (postgres/migrations/0066_worklife_merge.sql) — không đổi
 * kiểu cột, vì dữ liệu cũ dài hơn ngưỡng (nếu có) vẫn phải đọc lên được để người dùng tự cắt.
 */
export const NOTE_CONTENT_MAX_LENGTH = 10_000

export const WorkProjectStatusSchema = z.enum(['active', 'completed', 'archived'])

export const WorkProjectSchema = versionedObject(
  {
    id: UuidSchema,
    personId: UuidSchema,
    name: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    status: WorkProjectStatusSchema,
    deadline: IsoDateTimeSchema.optional(),
    version: z.number().int().positive().optional(),
    createdAt: IsoDateTimeSchema,
    updatedAt: IsoDateTimeSchema,
  },
  WORK_SCHEMA_VERSION,
)

export const WorkTaskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])
export const WorkTaskStatusSchema = z.enum(['todo', 'in_progress', 'blocked', 'done'])

export const WorkTaskSchema = versionedObject(
  {
    id: UuidSchema,
    personId: UuidSchema,
    projectId: UuidSchema.optional(),
    title: z.string().min(1).max(200),
    priority: WorkTaskPrioritySchema,
    status: WorkTaskStatusSchema,
    dueAt: IsoDateTimeSchema.optional(),
    version: z.number().int().positive().optional(),
    createdAt: IsoDateTimeSchema,
    updatedAt: IsoDateTimeSchema,
  },
  WORK_SCHEMA_VERSION,
)

export const WorkMeetingSchema = versionedObject(
  {
    id: UuidSchema,
    personId: UuidSchema,
    title: z.string().min(1).max(200),
    scheduledAt: IsoDateTimeSchema,
    durationMinutes: z.number().int().positive(),
    summary: z.string().max(2000).optional(),
    actionItems: z.array(z.string().min(1).max(500)),
    createdAt: IsoDateTimeSchema,
  },
  WORK_SCHEMA_VERSION,
)

export const WorkDocumentTypeSchema = z.enum(['spec', 'minutes', 'proposal', 'report', 'note'])

export const WorkDocumentSchema = versionedObject(
  {
    id: UuidSchema,
    personId: UuidSchema,
    projectId: UuidSchema.optional(),
    title: z.string().min(1).max(200),
    documentType: WorkDocumentTypeSchema,
    summary: z.string().min(1).max(NOTE_CONTENT_MAX_LENGTH),
    contentUri: z.string().max(500).optional(),
    version: z.number().int().positive().optional(),
    createdAt: IsoDateTimeSchema,
    updatedAt: IsoDateTimeSchema,
  },
  WORK_SCHEMA_VERSION,
)

export type WorkProject = z.infer<typeof WorkProjectSchema>
export type WorkTask = z.infer<typeof WorkTaskSchema>
export type WorkMeeting = z.infer<typeof WorkMeetingSchema>
export type WorkDocument = z.infer<typeof WorkDocumentSchema>
