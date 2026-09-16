// Test hợp đồng đồng bộ (S09-1) — ca biên của phong bì/kết quả/ConflictRecord.

import { describe, it, expect } from 'vitest'
import { SyncEnvelopeSchema, SyncResultSchema, ConflictRecordSchema } from './sync.js'

const VALID_ENVELOPE = {
  attemptId: '11111111-2222-4333-8444-555555555555',
  baseVersion: 3,
  clientUpdatedAt: '2026-09-15T08:00:00.000Z',
}

describe('SyncEnvelopeSchema', () => {
  it('phong bì hợp lệ → parse được', () => {
    expect(SyncEnvelopeSchema.parse(VALID_ENVELOPE)).toEqual(VALID_ENVELOPE)
  })

  it('baseVersion = 0 (client chưa từng thấy version) → hợp lệ', () => {
    expect(SyncEnvelopeSchema.parse({ ...VALID_ENVELOPE, baseVersion: 0 }).baseVersion).toBe(0)
  })

  it('baseVersion âm hoặc không nguyên → từ chối', () => {
    expect(SyncEnvelopeSchema.safeParse({ ...VALID_ENVELOPE, baseVersion: -1 }).success).toBe(false)
    expect(SyncEnvelopeSchema.safeParse({ ...VALID_ENVELOPE, baseVersion: 1.5 }).success).toBe(
      false,
    )
  })

  it('attemptId ngắn hơn 8 hoặc dài hơn 64 ký tự → từ chối', () => {
    expect(SyncEnvelopeSchema.safeParse({ ...VALID_ENVELOPE, attemptId: 'abc' }).success).toBe(
      false,
    )
    expect(
      SyncEnvelopeSchema.safeParse({ ...VALID_ENVELOPE, attemptId: 'a'.repeat(65) }).success,
    ).toBe(false)
  })

  it('clientUpdatedAt không phải ISO datetime → từ chối', () => {
    expect(
      SyncEnvelopeSchema.safeParse({ ...VALID_ENVELOPE, clientUpdatedAt: 'hôm qua' }).success,
    ).toBe(false)
  })
})

describe('SyncResultSchema', () => {
  it('kết quả bình thường → parse được', () => {
    const result = { ok: true as const, version: 2, conflict: false, replayed: false }
    expect(SyncResultSchema.parse(result)).toEqual(result)
  })

  it('version phải ≥ 1 (version 0 không tồn tại sau khi ghi)', () => {
    expect(
      SyncResultSchema.safeParse({ ok: true, version: 0, conflict: false, replayed: false })
        .success,
    ).toBe(false)
  })

  it('conflicts là tuỳ chọn (chỉ S09-3 mới gắn)', () => {
    const parsed = SyncResultSchema.parse({
      ok: true,
      version: 5,
      conflict: true,
      replayed: false,
      conflicts: ['c1'],
    })
    expect(parsed.conflicts).toEqual(['c1'])
  })
})

describe('ConflictRecordSchema', () => {
  const RECORD = {
    id: '11111111-2222-4333-8444-555555555555',
    userId: '99999999-2222-4333-8444-555555555555',
    docKind: 'session_draft' as const,
    docId: 'programming:p1-u1-l1',
    field: 'code',
    base: 'print(1)',
    local: { content: 'print(2)', clientUpdatedAt: '2026-09-15T08:00:00.000Z', version: 3 },
    remote: { content: 'print(3)', clientUpdatedAt: '2026-09-15T09:00:00.000Z', version: 4 },
    createdAt: '2026-09-15T09:01:00.000Z',
    resolvedAt: null,
    keep: null,
  }

  it('record chưa giải quyết → parse được', () => {
    expect(ConflictRecordSchema.parse(RECORD).keep).toBeNull()
  })

  it('base có thể null (bản gốc không còn tra được)', () => {
    expect(ConflictRecordSchema.parse({ ...RECORD, base: null }).base).toBeNull()
  })

  it('keep chỉ nhận local/remote', () => {
    expect(ConflictRecordSchema.safeParse({ ...RECORD, keep: 'both' }).success).toBe(false)
    expect(ConflictRecordSchema.parse({ ...RECORD, keep: 'remote' }).keep).toBe('remote')
  })

  it('docId quá 200 ký tự → từ chối', () => {
    expect(ConflictRecordSchema.safeParse({ ...RECORD, docId: 'x'.repeat(201) }).success).toBe(
      false,
    )
  })
})
