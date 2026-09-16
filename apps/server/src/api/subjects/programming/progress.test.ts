import { beforeEach, describe, expect, it, vi } from 'vitest'

const authState: { user: { userId: string } | null } = { user: { userId: 'user-1' } }
let rateLimitOk = true

vi.mock('@dhcb/core-auth/security', () => ({
  getCorsHeaders: () => ({}),
  SECURITY_HEADERS: {},
  checkRateLimit: async () => rateLimitOk,
  validateAuth: async () => authState.user,
  logSecurityEvent: () => {},
}))

const query = vi.hoisted(() => vi.fn())
const release = vi.hoisted(() => vi.fn())
// S09-1: POST nay chạy trong withTransaction → cần `connect()` trả client dùng CÙNG mock `query`
// (nên thứ tự call gồm cả 'begin'/'commit').
vi.mock('@dhcb/core-db/pgPool', () => ({
  getPgPool: () => ({ query, connect: async () => ({ query, release }) }),
}))

/** Các câu SQL thật sự chạy, bỏ qua 'begin'/'commit'/'rollback' của transaction. */
function sqlCalls(): { sql: string; params: unknown[] }[] {
  return query.mock.calls
    .map(([sql, params]) => ({ sql: String(sql), params: (params ?? []) as unknown[] }))
    .filter((c) => !/^(begin|commit|rollback)$/i.test(c.sql.trim()))
}

import handler from './progress.js'

function req(method: string, body?: unknown) {
  return new Request('http://localhost/api/programming/progress', {
    method,
    ...(body === undefined
      ? {}
      : { headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  authState.user = { userId: 'user-1' }
  rateLimitOk = true
  query.mockResolvedValue({ rows: [] })
})

describe('/api/programming/progress', () => {
  it('chưa đăng nhập → 401; quá rate limit → 429', async () => {
    authState.user = null
    expect((await handler(req('GET'))).status).toBe(401)
    authState.user = { userId: 'user-1' }
    rateLimitOk = false
    expect((await handler(req('GET'))).status).toBe(429)
  })

  it('GET người mới (chưa có dòng nào) → mặc định p1/T1, lessons rỗng', async () => {
    const res = await handler(req('GET'))
    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      state: { currentLevel: string; projectTrack: string }
      lessons: unknown[]
    }
    expect(body.state).toEqual({ currentLevel: 'p1', projectTrack: 'T1' })
    expect(body.lessons).toEqual([])
  })

  it('GET trả tiến độ có sẵn (completed_at → mili-giây epoch)', async () => {
    const at = new Date(1_756_000_000_000)
    query
      .mockResolvedValueOnce({ rows: [{ current_level: 'p2', project_track: 'T1' }] })
      .mockResolvedValueOnce({
        rows: [{ lesson_id: 'p1-u4-l1', status: 'completed', completed_at: at, version: 3 }],
      })
    const body = (await (await handler(req('GET'))).json()) as {
      state: { currentLevel: string }
      lessons: { lessonId: string; status: string; completedAt: number | null }[]
    }
    expect(body.state.currentLevel).toBe('p2')
    expect(body.lessons).toEqual([
      { lessonId: 'p1-u4-l1', status: 'completed', completedAt: at.getTime(), version: 3 },
    ])
  })

  it('POST bài không tồn tại trong giáo trình → 400, KHÔNG ghi DB', async () => {
    const res = await handler(req('POST', { lessonId: 'p1-u9-l9', status: 'completed' }))
    expect(res.status).toBe(400)
    expect(query).not.toHaveBeenCalled()
  })

  it('POST hợp lệ → tạo learner_state (idempotent) + upsert tiến độ', async () => {
    const res = await handler(req('POST', { lessonId: 'p1-u4-l1', status: 'completed' }))
    expect(res.status).toBe(200)
    const calls = sqlCalls()
    expect(calls).toHaveLength(2)
    expect(calls[0]?.sql).toContain('learner_state')
    const upsert = calls[1]!
    // Bất biến chống kéo lùi: đã completed thì giữ completed.
    expect(upsert.sql).toContain("then 'completed' else excluded.status end")
    // S09-1: dạng cũ không có attemptId → clientUpdatedAt null, KHÔNG ghi biên nhận.
    expect(upsert.params).toEqual(['user-1', 'p1-u4-l1', 'completed', null])
    expect(calls.some((c) => c.sql.includes('sync_receipts'))).toBe(false)
  })

  // Tầng HƯỚNG CHUYÊN SÂU dùng chung bảng tiến độ (chi tiết chặng, nay đủ S1→S4).
  it('POST module/tiêu chí hướng chuyên sâu có thật → ghi bình thường', async () => {
    expect(
      (await handler(req('POST', { lessonId: 'web-s2-m1', status: 'completed' }))).status,
    ).toBe(200)
    expect(sqlCalls()[1]?.params).toEqual(['user-1', 'web-s2-m1', 'completed', null])
    vi.clearAllMocks()
    query.mockResolvedValue({ rows: [] })
    expect(
      (await handler(req('POST', { lessonId: 'web-s2-r3', status: 'completed' }))).status,
    ).toBe(200)
  })

  it('POST khoá hướng chuyên sâu không tồn tại → 400, KHÔNG ghi DB', async () => {
    for (const lessonId of ['web-s2-m99', 'khongco-s2-m1', 'web-s1-r99', 'web-s5-m1']) {
      vi.clearAllMocks()
      const res = await handler(req('POST', { lessonId, status: 'completed' }))
      expect(res.status, lessonId).toBe(400)
      expect(query, lessonId).not.toHaveBeenCalled()
    }
  })

  it('POST body sai khuôn (status lạ) → 400; method lạ → 405', async () => {
    expect((await handler(req('POST', { lessonId: 'p1-u4-l1', status: 'done' }))).status).toBe(400)
    expect((await handler(req('DELETE'))).status).toBe(405)
  })
})

// ── S09-1: batch + version theo dòng + idempotency ───────────────────────────
describe('/api/programming/progress — batch, version, replay (S09-1)', () => {
  const ATTEMPT = 'attempt-0000-1111'

  function batch(items: { lessonId: string; status: string; clientUpdatedAt?: string }[]) {
    return {
      attemptId: ATTEMPT,
      items: items.map((i) => ({
        lessonId: i.lessonId,
        status: i.status,
        clientUpdatedAt: i.clientUpdatedAt ?? '2026-09-15T08:00:00.000Z',
      })),
    }
  }

  it('batch nhiều bài → upsert từng dòng trong MỘT transaction, trả version theo dòng', async () => {
    query.mockImplementation(async (sql: string, params?: unknown[]) => {
      if (String(sql).includes('insert into programming.lesson_progress'))
        return {
          rows: [
            {
              lesson_id: params?.[1],
              status: params?.[2],
              completed_at: new Date(1_756_000_000_000),
              version: 7,
            },
          ],
        }
      return { rows: [] }
    })
    const res = await handler(
      req(
        'POST',
        batch([
          { lessonId: 'p1-u4-l1', status: 'completed' },
          { lessonId: 'web-s2-m1', status: 'in_progress' },
        ]),
      ),
    )
    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      ok: boolean
      replayed: boolean
      lessons: { lessonId: string; version: number }[]
    }
    expect(body.replayed).toBe(false)
    expect(body.lessons.map((l) => l.lessonId)).toEqual(['p1-u4-l1', 'web-s2-m1'])
    expect(body.lessons.every((l) => l.version === 7)).toBe(true)
    // Đúng MỘT transaction bọc cả hai upsert.
    const raw = query.mock.calls.map(([s]) => String(s).trim().toLowerCase())
    expect(raw.filter((s) => s === 'begin')).toHaveLength(1)
    expect(raw.filter((s) => s === 'commit')).toHaveLength(1)
    // Câu upsert giữ nguyên bất biến "completed không kéo lùi" + thêm version tăng 1.
    const upserts = sqlCalls().filter((c) => c.sql.includes('into programming.lesson_progress'))
    expect(upserts).toHaveLength(2)
    expect(upserts[0]?.sql).toContain("then 'completed' else excluded.status end")
    expect(upserts[0]?.sql).toContain('version = programming.lesson_progress.version + 1')
    // Biên nhận ghi TRONG cùng transaction (trước 'commit').
    const receiptIdx = raw.findIndex((s) => s.includes('insert into public.sync_receipts'))
    expect(receiptIdx).toBeGreaterThan(-1)
    expect(receiptIdx).toBeLessThan(raw.lastIndexOf('commit'))
  })

  it('gửi lại cùng attemptId → replay: trả response cũ, KHÔNG upsert lần hai', async () => {
    query.mockImplementation(async (sql: string) => {
      if (String(sql).includes('select endpoint, response'))
        return {
          rows: [
            {
              endpoint: 'programming-progress',
              response: { ok: true, lessons: [{ lessonId: 'p1-u4-l1', version: 2 }] },
            },
          ],
        }
      return { rows: [] }
    })
    const res = await handler(req('POST', batch([{ lessonId: 'p1-u4-l1', status: 'completed' }])))
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ ok: true, replayed: true })
    expect(
      query.mock.calls.filter(([s]) =>
        String(s).includes('insert into programming.lesson_progress'),
      ),
    ).toHaveLength(0)
  })

  it('attemptId đã dùng cho endpoint KHÁC → 409, không ghi gì', async () => {
    query.mockImplementation(async (sql: string) => {
      if (String(sql).includes('select endpoint, response'))
        return { rows: [{ endpoint: 'progress', response: { ok: true } }] }
      return { rows: [] }
    })
    const res = await handler(req('POST', batch([{ lessonId: 'p1-u4-l1', status: 'completed' }])))
    expect(res.status).toBe(409)
    expect(query.mock.calls.filter(([s]) => String(s).includes('lesson_progress'))).toHaveLength(0)
  })

  it('một mục sai trong batch → CẢ batch 400, KHÔNG ghi DB', async () => {
    const res = await handler(
      req(
        'POST',
        batch([
          { lessonId: 'p1-u4-l1', status: 'completed' },
          { lessonId: 'p1-u9-l9', status: 'completed' },
        ]),
      ),
    )
    expect(res.status).toBe(400)
    expect(query).not.toHaveBeenCalled()
  })

  it('batch rỗng hoặc quá 50 mục → 400 (Zod chặn trước khi chạm DB)', async () => {
    expect((await handler(req('POST', { attemptId: ATTEMPT, items: [] }))).status).toBe(400)
    const tooMany = Array.from({ length: 51 }, () => ({
      lessonId: 'p1-u4-l1',
      status: 'completed',
    }))
    expect((await handler(req('POST', batch(tooMany)))).status).toBe(400)
    expect(query).not.toHaveBeenCalled()
  })

  it('429 mang header Retry-After để client lùi đúng số giây', async () => {
    rateLimitOk = false
    const res = await handler(req('GET'))
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('60')
  })
})
