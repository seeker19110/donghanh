// Test biên nhận idempotency (S09-1) — mock `pg` như các test handler khác trong repo.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Pool, PoolClient } from 'pg'
import {
  findReceipt,
  saveReceipt,
  purgeOldSyncReceipts,
  SYNC_RECEIPT_RETENTION_DAYS,
} from './syncReceipt.js'

const query = vi.fn()
const db = { query } as unknown as Pool & PoolClient

beforeEach(() => query.mockReset())

describe('findReceipt', () => {
  it('chưa từng gửi → null', async () => {
    query.mockResolvedValueOnce({ rows: [] })
    expect(await findReceipt(db, 'u1', 'a'.repeat(10))).toBeNull()
  })

  it('đã gửi → trả endpoint + response đã lưu, tra theo cả user_id lẫn attempt_id', async () => {
    query.mockResolvedValueOnce({
      rows: [{ endpoint: 'progress', response: { ok: true, version: 4 } }],
    })
    const receipt = await findReceipt(db, 'u1', 'attempt-1234')
    expect(receipt).toEqual({ endpoint: 'progress', response: { ok: true, version: 4 } })
    const [sql, params] = query.mock.calls[0] as [string, unknown[]]
    expect(sql).toContain('public.sync_receipts')
    expect(params).toEqual(['u1', 'attempt-1234'])
  })

  it('response NULL trong DB (dữ liệu hỏng) → coi là object rỗng, không ném', async () => {
    query.mockResolvedValueOnce({ rows: [{ endpoint: 'progress', response: null }] })
    expect((await findReceipt(db, 'u1', 'attempt-1234'))?.response).toEqual({})
  })
})

describe('saveReceipt', () => {
  it('ghi kèm on conflict do nothing (chịu được ca đua)', async () => {
    query.mockResolvedValueOnce({ rows: [] })
    await saveReceipt(db, 'u1', 'attempt-1234', 'progress', { ok: true, version: 2 })
    const [sql, params] = query.mock.calls[0] as [string, unknown[]]
    expect(sql).toContain('insert into public.sync_receipts')
    expect(sql).toContain('on conflict (user_id, attempt_id) do nothing')
    expect(params[0]).toBe('u1')
    expect(params[2]).toBe('progress')
    expect(JSON.parse(params[3] as string)).toEqual({ ok: true, version: 2 })
  })
})

describe('purgeOldSyncReceipts', () => {
  it('mặc định dọn theo hạn 7 ngày', async () => {
    query.mockResolvedValueOnce({ rowCount: 12 })
    expect(await purgeOldSyncReceipts(db)).toEqual({ deleted: 12 })
    expect(query.mock.calls[0]?.[1]).toEqual([String(SYNC_RECEIPT_RETENTION_DAYS)])
  })

  it('rowCount null (driver không báo) → coi là 0, không ném', async () => {
    query.mockResolvedValueOnce({ rowCount: null })
    expect(await purgeOldSyncReceipts(db, 3)).toEqual({ deleted: 0 })
    expect(query.mock.calls[0]?.[1]).toEqual(['3'])
  })
})
