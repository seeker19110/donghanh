import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@dhcb/core-db/pgPool', () => ({ getPgPool: vi.fn() }))
let rateLimitOk = true
vi.mock('@dhcb/core-auth/security', () => ({
  getCorsHeaders: () => ({}),
  SECURITY_HEADERS: {},
  checkRateLimit: async () => rateLimitOk,
  logSecurityEvent: () => {},
}))

import handler from './plan-prices.js'
import { getPgPool } from '@dhcb/core-db/pgPool'
import { invalidatePricesCache } from '@dhcb/core-billing/prices'

const mockedGetPool = vi.mocked(getPgPool)
const query = vi.fn()

beforeEach(() => {
  rateLimitOk = true
  invalidatePricesCache()
  query.mockReset()
  query.mockResolvedValue({ rows: [] })
  mockedGetPool.mockReturnValue({ query } as unknown as ReturnType<typeof getPgPool>)
})

describe('/api/plan-prices', () => {
  it('rate limit vượt quá → 429', async () => {
    rateLimitOk = false
    const resp = await handler(new Request('http://localhost/api/plan-prices'))
    expect(resp.status).toBe(429)
  })
  it('OPTIONS request → 204', async () => {
    const resp = await handler(
      new Request('http://localhost/api/plan-prices', { method: 'OPTIONS' }),
    )
    expect(resp.status).toBe(204)
  })

  it('HTTP method khác GET → 405', async () => {
    const resp = await handler(new Request('http://localhost/api/plan-prices', { method: 'POST' }))
    expect(resp.status).toBe(405)
  })

  it('chưa đăng nhập, trả giá mặc định đúng bảng giá đã chốt', async () => {
    const resp = await handler(new Request('http://localhost/api/plan-prices'))
    expect(resp.status).toBe(200)
    const data = (await resp.json()) as {
      plus?: unknown
      pro?: unknown
      vip: {
        '10day': { effectiveVnd: number }
        month: { effectiveVnd: number }
        year: { effectiveVnd: number }
      }
    }
    // GĐ1 2026-09-12: gói 'plus'/'pro' đã ngừng bán — endpoint KHÔNG được chào chúng nữa.
    expect(data.plus).toBeUndefined()
    expect(data.pro).toBeUndefined()
    expect(data.vip['10day'].effectiveVnd).toBe(30_000)
    expect(data.vip.month.effectiveVnd).toBe(75_000)
    expect(data.vip.year.effectiveVnd).toBe(500_000)
  })
})
