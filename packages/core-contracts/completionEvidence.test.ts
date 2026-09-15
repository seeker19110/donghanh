import { describe, expect, it } from 'vitest'
import {
  ActivityKindSchema,
  COMPLETION_EVIDENCE_SCHEMA_VERSION,
  CompletionEvidenceInputSchema,
  CompletionEvidenceSchema,
  CompletionStateSchema,
} from './completionEvidence.js'

const hopLe = {
  schemaVersion: 1,
  subjectId: 'physics',
  contentId: 'ly10-c2-b10',
  activityKind: 'stem_lesson_check',
  attemptId: '0123456789abcdef',
  clientAt: '2026-09-15T08:00:00.000Z',
  answers: [{ questionIndex: 0, raw: '9.8 m/s^2' }],
}

describe('CompletionEvidenceInputSchema', () => {
  it('nhận payload hợp lệ', () => {
    expect(CompletionEvidenceInputSchema.safeParse(hopLe).success).toBe(true)
  })

  it('thiếu attemptId → lỗi', () => {
    const thieu: Record<string, unknown> = { ...hopLe }
    delete thieu.attemptId
    expect(CompletionEvidenceInputSchema.safeParse(thieu).success).toBe(false)
  })

  it('attemptId ngắn hơn 16 ký tự → lỗi; fallback 16+ ký tự không phải UUID vẫn đạt', () => {
    expect(CompletionEvidenceInputSchema.safeParse({ ...hopLe, attemptId: 'abc' }).success).toBe(
      false,
    )
    const fallback = `${Date.now().toString(36)}-abcdefghijklmnop`
    expect(fallback.length).toBeGreaterThanOrEqual(16)
    expect(CompletionEvidenceInputSchema.safeParse({ ...hopLe, attemptId: fallback }).success).toBe(
      true,
    )
  })

  it('activityKind ngoài enum → lỗi', () => {
    expect(
      CompletionEvidenceInputSchema.safeParse({ ...hopLe, activityKind: 'an_uong' }).success,
    ).toBe(false)
  })

  it('answers rỗng hoặc > 50 phần tử → lỗi', () => {
    expect(CompletionEvidenceInputSchema.safeParse({ ...hopLe, answers: [] }).success).toBe(false)
    const nhieu = Array.from({ length: 51 }, () => ({ questionIndex: 0, raw: 'x' }))
    expect(CompletionEvidenceInputSchema.safeParse({ ...hopLe, answers: nhieu }).success).toBe(
      false,
    )
  })

  it('schemaVersion ≠ 1 → lỗi', () => {
    expect(CompletionEvidenceInputSchema.safeParse({ ...hopLe, schemaVersion: 2 }).success).toBe(
      false,
    )
    expect(COMPLETION_EVIDENCE_SCHEMA_VERSION).toBe(1)
  })

  it('.strict(): client KHÔNG gửi được correct/passed/score', () => {
    for (const la of [{ correct: 5 }, { passed: true }, { clientCorrect: 5 }, { score: 9 }]) {
      expect(CompletionEvidenceInputSchema.safeParse({ ...hopLe, ...la }).success).toBe(false)
    }
  })

  it('subjectId ngoài 4 môn STEM → lỗi; contentId sai khuôn → lỗi', () => {
    expect(
      CompletionEvidenceInputSchema.safeParse({ ...hopLe, subjectId: 'english' }).success,
    ).toBe(false)
    expect(CompletionEvidenceInputSchema.safeParse({ ...hopLe, contentId: 'LY10' }).success).toBe(
      false,
    )
  })

  it('questionIndex âm hoặc ≥ 50 → lỗi; raw rỗng → lỗi', () => {
    const ans = (a: unknown) => CompletionEvidenceInputSchema.safeParse({ ...hopLe, answers: [a] })
    expect(ans({ questionIndex: -1, raw: 'x' }).success).toBe(false)
    expect(ans({ questionIndex: 50, raw: 'x' }).success).toBe(false)
    expect(ans({ questionIndex: 0, raw: '' }).success).toBe(false)
  })
})

describe('CompletionEvidenceSchema (server → client)', () => {
  const ketQua = {
    schemaVersion: 1,
    subjectId: 'physics',
    contentId: 'ly10-c2-b10',
    activityKind: 'stem_lesson_check',
    attemptId: '0123456789abcdef',
    clientAt: '2026-09-15T08:00:00.000Z',
    ownerId: 'user-1',
    evidenceKind: 'server_graded',
    correct: 4,
    total: 5,
    ratio: 0.8,
    passed: true,
    contentVersion: 'a'.repeat(64),
    serverAt: '2026-09-15T08:00:01.000Z',
    items: [{ questionIndex: 0, correct: true, reason: 'CORRECT' }],
  }

  it('nhận kết quả server đầy đủ và bản khách (local_graded, không serverAt/contentVersion)', () => {
    expect(CompletionEvidenceSchema.safeParse(ketQua).success).toBe(true)
    const khach: Record<string, unknown> = { ...ketQua }
    delete khach.serverAt
    delete khach.contentVersion
    expect(
      CompletionEvidenceSchema.safeParse({
        ...khach,
        ownerId: 'guest_abc',
        evidenceKind: 'local_graded',
      }).success,
    ).toBe(true)
  })

  it('contentVersion phải đúng 64 ký tự; ratio ngoài [0,1] → lỗi; total < 1 → lỗi', () => {
    expect(CompletionEvidenceSchema.safeParse({ ...ketQua, contentVersion: 'abc' }).success).toBe(
      false,
    )
    expect(CompletionEvidenceSchema.safeParse({ ...ketQua, ratio: 1.5 }).success).toBe(false)
    expect(CompletionEvidenceSchema.safeParse({ ...ketQua, total: 0 }).success).toBe(false)
  })

  it('evidenceKind ngoài 2 giá trị → lỗi; field lạ → lỗi', () => {
    expect(CompletionEvidenceSchema.safeParse({ ...ketQua, evidenceKind: 'ai' }).success).toBe(
      false,
    )
    expect(CompletionEvidenceSchema.safeParse({ ...ketQua, la: 1 }).success).toBe(false)
  })
})

describe('CompletionStateSchema', () => {
  const state = {
    subjectId: 'physics',
    contentId: 'ly10-c2-b10',
    status: 'completed',
    bestRatio: 1,
    lastRatio: 0.4,
    attempts: 2,
    completedAt: '2026-09-15T08:00:01.000Z',
    updatedAt: '2026-09-15T09:00:01.000Z',
    source: 'server',
  }

  it('nhận state hợp lệ; completedAt null khi chưa hoàn thành', () => {
    expect(CompletionStateSchema.safeParse(state).success).toBe(true)
    expect(
      CompletionStateSchema.safeParse({ ...state, status: 'in_progress', completedAt: null })
        .success,
    ).toBe(true)
  })

  it('attempts < 1 → lỗi; source ngoài enum → lỗi', () => {
    expect(CompletionStateSchema.safeParse({ ...state, attempts: 0 }).success).toBe(false)
    expect(CompletionStateSchema.safeParse({ ...state, source: 'ai' }).success).toBe(false)
  })
})

describe('ActivityKindSchema', () => {
  it('khai đủ 8 loại hoạt động của bảng luật §③.2', () => {
    expect(ActivityKindSchema.options).toHaveLength(8)
    expect(ActivityKindSchema.options).toContain('stem_lesson_check')
  })
})
