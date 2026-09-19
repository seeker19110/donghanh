// packages/core-learner/learningReadModelService.ts — V2-11 Learning Domain Read Model Service.
// Encapsulates Learning domain state & exposes typed Read Model for Companion & Context Engine.
import type { Pool } from 'pg'
import {
  LearningReadModelSchema,
  LEARNING_READ_MODEL_SCHEMA_VERSION,
  type LearningReadModel,
} from '@dhcb/core-contracts/learningReadModel'
import { CefrLevelSchema, type ContractCefrLevel } from '@dhcb/core-contracts/shared'

export interface GetLearningReadModelOptions {
  personId: string
  userId: string
  subject?: string
}

interface ProfileRow {
  onboarded: boolean
  goal: string | null
  daily_minutes: number | null
}

// ADR-0005: bảng english.learning_progress KHÔNG có cột `settings`/`stats` — chỉ đọc cột thật.
interface ProgressRow {
  learned: unknown
  srs: unknown
  placement: unknown
  updated_at: Date
}

/** Trích các khoá (từ vựng) hợp lệ từ một JSONB dạng mảng chuỗi. */
function extractLearnedKeys(learned: unknown): Set<string> {
  if (!Array.isArray(learned)) return new Set()
  return new Set(learned.filter((item): item is string => typeof item === 'string'))
}

/** Trích map { khoá -> thẻ SRS } hợp lệ từ JSONB `srs`. */
function extractSrsEntries(srs: unknown): Record<string, unknown> {
  if (!srs || typeof srs !== 'object' || Array.isArray(srs)) return {}
  return srs as Record<string, unknown>
}

/** Một thẻ SRS được coi là "đến hạn" khi `due` là số và <= mốc thời gian đối chiếu. */
function isSrsCardDue(card: unknown, nowMs: number): boolean {
  return (
    Boolean(card) &&
    typeof card === 'object' &&
    typeof (card as { due?: unknown }).due === 'number' &&
    (card as { due: number }).due <= nowMs
  )
}

function parseCurrentLevel(placement: unknown): ContractCefrLevel | null {
  if (placement && typeof placement === 'object' && 'cefr' in placement) {
    const result = CefrLevelSchema.safeParse((placement as { cefr?: unknown }).cefr)
    if (result.success) return result.data
  }
  return null
}

/**
 * Returns a strongly-typed Learning Domain Read Model for a learner.
 */
export async function getLearningReadModel(
  pool: Pool,
  options: GetLearningReadModelOptions,
): Promise<LearningReadModel> {
  const { personId, userId, subject = 'english' } = options

  // Query profiles for onboarding / goal info
  const profileRes = await pool.query<ProfileRow>(
    `select onboarded, goal, daily_minutes from public.profiles where id = $1`,
    [userId],
  )
  const profile = profileRes.rows[0]

  // Query learning_progress for learned, srs, placement — CHỈ cột thật (ADR-0005).
  const progressRes = await pool.query<ProgressRow>(
    `select learned, srs, placement, updated_at from english.learning_progress where user_id = $1`,
    [userId],
  )
  const progress = progressRes.rows[0]

  const currentLevel = parseCurrentLevel(progress?.placement)
  const onboarded = Boolean(profile?.onboarded)
  const activeGoal = profile?.goal ?? null
  const dailyMinutes = profile?.daily_minutes ?? 15

  // `direction` và `dailySpeed` là biến CLIENT-SIDE (apps/dhcb/src/lib/storage.ts) — server
  // không có cột nào lưu chúng (ADR-0005). Hành vi thật từ trước tới nay luôn là mặc định
  // 'A'/10 vì `settings` chưa từng tồn tại trong schema; giữ nguyên hành vi quan sát được,
  // chỉ bỏ code chết đọc cột ảo.
  const direction = 'A' as const
  const dailySpeed = 10

  const learnedKeys = extractLearnedKeys(progress?.learned)
  const srsEntries = extractSrsEntries(progress?.srs)
  const nowMs = Date.now() // server time — KHÔNG lấy từ client/DB (ADR-0005 mục 3)

  // masteredCount: số TỰ BÁO CÁO — client tự đánh dấu "đã thuộc" trong `learned`, KHÔNG phải
  // bằng chứng đã xác thực server (ADR-0005 mục 4).
  const masteredCount = learnedKeys.size

  // inProgressCount: số khoá trong `srs` chưa có mặt trong `learned` (đang ôn, chưa thuộc).
  let inProgressCount = 0
  // dueForReviewCount/srsDueCount: DÙNG CHUNG một công thức — số khoá trong `srs` đã đến hạn
  // (`due <= nowMs`) — để tuyệt đối không lệch nhau giữa hai field (ADR-0005 mục 1).
  let dueCount = 0
  for (const [key, card] of Object.entries(srsEntries)) {
    if (!learnedKeys.has(key)) inProgressCount += 1
    if (isSrsCardDue(card, nowMs)) dueCount += 1
  }
  const dueForReviewCount = dueCount
  const srsDueCount = dueCount

  // recentEvidenceCount: chưa có nguồn "bằng chứng đã xác thực server" nào được nối vào hàm
  // này (ADR-0005 mục 4) — subject `english` (mặc định, mọi caller hiện tại không truyền
  // subject) KHÔNG nằm trong `platform.completion_evidence.subject_id`. PR này CỐ Ý không cài
  // logic đếm evidence thật cho các subject STEM (ngoài phạm vi ADR-0005), nên với MỌI subject
  // hiện tại, giá trị này luôn là "chưa đo được" → trả `null` (KHÔNG bịa `0`, tránh biến "chưa
  // đo" thành "đo được bằng không" — điều ADR-0005 cấm).
  const recentEvidenceCount: number | null = null

  const updatedAt = progress?.updated_at
    ? progress.updated_at.toISOString()
    : new Date().toISOString()

  return LearningReadModelSchema.parse({
    personId,
    subject,
    direction,
    currentLevel,
    dailySpeed,
    dailyMinutes,
    onboarded,
    activeGoal,
    masterySummary: {
      masteredCount,
      inProgressCount,
      dueForReviewCount,
    },
    recentEvidenceCount,
    srsDueCount,
    updatedAt,
    schemaVersion: LEARNING_READ_MODEL_SCHEMA_VERSION,
  })
}

/**
 * Formats a LearningReadModel into a high-signal text snippet for Context Engine.
 */
export function formatLearningReadModelForContext(model: LearningReadModel): string {
  const parts: string[] = [
    `[Domain: Learning | Subject: ${model.subject}]`,
    `Level: ${model.currentLevel ?? 'Chưa xác định'}`,
    `Direction: ${model.direction === 'A' ? 'EN -> VI' : 'VI -> EN'}`,
    `Speed: ${model.dailySpeed} từ/ngày (${model.dailyMinutes} phút/ngày)`,
  ]

  if (model.activeGoal) {
    parts.push(`Mục tiêu: "${model.activeGoal}"`)
  }

  if (model.srsDueCount > 0) {
    parts.push(`SRS cần ôn: ${model.srsDueCount} từ`)
  }

  if (model.masterySummary.masteredCount > 0) {
    parts.push(`Đã thành thạo: ${model.masterySummary.masteredCount} từ`)
  }

  return parts.join(' | ')
}
