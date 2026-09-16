// packages/core-personal/learnerIntentService.ts — Cất/lấy Ý ĐỊNH HỌC của một tài khoản.
// Đặc tả: docs/specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md §③.2.
//
// Mọi truy vấn LUÔN lọc theo `userId` do tầng API lấy từ token — không có nhánh nào đọc dữ liệu
// của người khác. Giá trị đều là enum đóng nên không mã hoá (xem migration 0082).

import type { Pool } from 'pg'
import {
  LearnerIntentSchema,
  LEARNER_INTENT_SCHEMA_VERSION,
  type LearnerIntent,
} from '@dhcb/core-contracts/learnerIntent'

interface LearnerIntentRow {
  subject_ids: string[]
  purpose: string | null
  time_budget: number | null
  level: string | null
  grade: string | null
  schema_version: number
  created_at: Date
  updated_at: Date
}

/** Dòng CSDL → hợp đồng. Dòng cũ/lệch hợp đồng ⇒ `null` (coi như chưa có, không ném lên API). */
function rowToIntent(row: LearnerIntentRow): LearnerIntent | null {
  const parsed = LearnerIntentSchema.safeParse({
    schemaVersion: LEARNER_INTENT_SCHEMA_VERSION,
    subjectIds: row.subject_ids,
    ...(row.purpose ? { purpose: row.purpose } : {}),
    ...(row.time_budget ? { timeBudget: row.time_budget } : {}),
    ...(row.level ? { level: row.level } : {}),
    ...(row.grade ? { grade: row.grade } : {}),
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  })
  return parsed.success ? parsed.data : null
}

const SELECT_COLS = `subject_ids, purpose, time_budget, level, grade,
                     schema_version, created_at, updated_at`

/** Ý định đã lưu, hoặc `null` khi người này chưa từng trả lời (KHÔNG phải lỗi). */
export async function getLearnerIntent(pool: Pool, userId: string): Promise<LearnerIntent | null> {
  const { rows } = await pool.query<LearnerIntentRow>(
    `select ${SELECT_COLS} from personal.learner_intent where user_id = $1`,
    [userId],
  )
  const row = rows[0]
  return row ? rowToIntent(row) : null
}

/**
 * Ghi đè ý định của một người (upsert theo `user_id` ⇒ PUT bao nhiêu lần cũng chỉ MỘT dòng).
 *
 * `created_at` do SERVER giữ: lần PUT sau không kéo lùi/đẩy tới mốc tạo, dù client gửi số gì.
 */
export async function saveLearnerIntent(
  pool: Pool,
  userId: string,
  raw: unknown,
): Promise<LearnerIntent> {
  const intent = LearnerIntentSchema.parse(raw)
  const { rows } = await pool.query<LearnerIntentRow>(
    `insert into personal.learner_intent
       (user_id, subject_ids, purpose, time_budget, level, grade, schema_version)
     values ($1, $2, $3, $4, $5, $6, $7)
     on conflict (user_id) do update set
       subject_ids = excluded.subject_ids,
       purpose = excluded.purpose,
       time_budget = excluded.time_budget,
       level = excluded.level,
       grade = excluded.grade,
       schema_version = excluded.schema_version,
       updated_at = now()
     returning ${SELECT_COLS}`,
    [
      userId,
      intent.subjectIds,
      intent.purpose ?? null,
      intent.timeBudget ?? null,
      intent.level ?? null,
      intent.grade ?? null,
      intent.schemaVersion,
    ],
  )
  const row = rows[0]
  // Không có dòng trả về nghĩa là CSDL bất thường — trả lại bản vừa gửi để API không 500 vô cớ.
  return (row && rowToIntent(row)) ?? intent
}
