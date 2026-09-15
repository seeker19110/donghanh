import { describe, it, expect, beforeEach } from 'vitest'
import type { Pool } from 'pg'
import { getLearnerIntent, saveLearnerIntent } from './learnerIntentService.js'

const USER = '11111111-1111-1111-1111-111111111111'
const seen: { sql: string; params: unknown[] }[] = []
let nextRows: unknown[] = []

const pool = {
  query: async (sql: string, params?: unknown[]) => {
    seen.push({ sql, params: params ?? [] })
    return { rows: nextRows, rowCount: nextRows.length }
  },
} as unknown as Pool

const ROW = {
  subject_ids: ['programming', 'mathematics'],
  purpose: 'cong_viec',
  time_budget: 20,
  level: 'lv_new',
  grade: '11',
  schema_version: 1,
  created_at: new Date(1_700_000_000_000),
  updated_at: new Date(1_700_000_900_000),
}

const INTENT = {
  schemaVersion: 1,
  subjectIds: ['programming'],
  purpose: 'so_thich' as const,
  createdAt: 1_700_000_000_000,
  updatedAt: 1_700_000_000_000,
}

beforeEach(() => {
  seen.length = 0
  nextRows = []
})

describe('getLearnerIntent', () => {
  it('chưa có dòng → null', async () => {
    expect(await getLearnerIntent(pool, USER)).toBeNull()
  })

  it('đọc đúng dòng của chính người đó và dựng lại hợp đồng', async () => {
    nextRows = [ROW]
    const intent = await getLearnerIntent(pool, USER)
    expect(intent?.subjectIds).toEqual(['programming', 'mathematics'])
    expect(intent?.timeBudget).toBe(20)
    expect(intent?.updatedAt).toBe(1_700_000_900_000)
    expect(seen[0]?.sql).toContain('where user_id = $1')
    expect(seen[0]?.params).toEqual([USER])
  })

  it('dòng lệch hợp đồng (môn lạ) → null, không ném', async () => {
    nextRows = [{ ...ROW, subject_ids: ['music'] }]
    expect(await getLearnerIntent(pool, USER)).toBeNull()
  })

  it('cột null = người dùng bỏ qua câu đó', async () => {
    nextRows = [{ ...ROW, purpose: null, time_budget: null, level: null, grade: null }]
    const intent = await getLearnerIntent(pool, USER)
    expect(intent?.purpose).toBeUndefined()
    expect(intent?.grade).toBeUndefined()
  })
})

describe('saveLearnerIntent', () => {
  it('là UPSERT theo user_id (một dòng mỗi người) và làm mới updated_at', async () => {
    nextRows = [{ ...ROW, subject_ids: ['programming'], purpose: 'so_thich' }]
    await saveLearnerIntent(pool, USER, INTENT)
    const sql = seen[0]?.sql ?? ''
    expect(sql).toContain('on conflict (user_id) do update')
    expect(sql).toContain('updated_at = now()')
    expect(seen[0]?.params[0]).toBe(USER)
  })

  it('KHÔNG ghi created_at từ client — server giữ mốc tạo', async () => {
    nextRows = [ROW]
    await saveLearnerIntent(pool, USER, INTENT)
    expect(seen[0]?.sql).not.toContain('created_at =')
    expect(seen[0]?.params).not.toContain(INTENT.createdAt)
  })

  it('từ chối dữ liệu không hợp hợp đồng trước khi chạm CSDL', async () => {
    await expect(saveLearnerIntent(pool, USER, { ...INTENT, subjectIds: [] })).rejects.toThrow()
    await expect(saveLearnerIntent(pool, USER, { ...INTENT, score: 9 })).rejects.toThrow()
    expect(seen).toEqual([])
  })

  it('CSDL không trả dòng → vẫn trả lại bản vừa gửi, không 500 vô cớ', async () => {
    nextRows = []
    expect(await saveLearnerIntent(pool, USER, INTENT)).toEqual(INTENT)
  })
})
