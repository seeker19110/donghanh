import { describe, it, expect } from 'vitest'
import { normalizePlan, resolvePlan } from './plan.js'

// GĐ1 2026-09-12 (docs/specs/2026-09-12-gd1-xoa-goi-pro.md): chỉ còn 2 gói free + vip.
describe('normalizePlan', () => {
  it('nhận vip, mọi giá trị lạ → free', () => {
    expect(normalizePlan('vip')).toBe('vip')
    expect(normalizePlan('free')).toBe('free')
    expect(normalizePlan(null)).toBe('free')
    expect(normalizePlan(undefined)).toBe('free')
    expect(normalizePlan('rac-gi-do')).toBe('free')
  })

  // Bất biến §⑤ của đặc tả: KHÔNG ai đang trả tiền bị mất quyền lợi đã mua. Hàng cũ 'plus'/'pro'
  // còn sót trong DB (tạo ra giữa lúc deploy, khôi phục sao lưu tay...) phải được coi như vip —
  // kết hợp resolvePlan kiểm hạn thì còn hạn = hưởng VIP, hết hạn = free.
  it('giá trị gói CŨ plus/pro trong DB → coi như vip (không mất quyền lợi đã mua)', () => {
    expect(normalizePlan('plus')).toBe('vip')
    expect(normalizePlan('pro')).toBe('vip')
  })
})

describe('resolvePlan', () => {
  const now = new Date('2026-07-24T00:00:00Z')

  it('free luôn là free, bất kể planExpiresAt', () => {
    expect(resolvePlan('free', null, now)).toBe('free')
    expect(resolvePlan('free', new Date('2020-01-01'), now)).toBe('free')
  })

  it('vip không có planExpiresAt (null) → vĩnh viễn, giữ nguyên gói', () => {
    expect(resolvePlan('vip', null, now)).toBe('vip')
  })

  it('vip còn hạn (planExpiresAt trong tương lai) → giữ nguyên gói', () => {
    const future = new Date('2026-08-01T00:00:00Z')
    expect(resolvePlan('vip', future, now)).toBe('vip')
  })

  it('vip đã hết hạn (planExpiresAt trong quá khứ) → coi như free', () => {
    const past = new Date('2026-07-01T00:00:00Z')
    expect(resolvePlan('vip', past, now)).toBe('free')
  })

  it('hết hạn ĐÚNG lúc now (ca biên, không lệch 1 mili-giây) → coi như free', () => {
    expect(resolvePlan('vip', now, now)).toBe('free')
  })

  it('chấp nhận planExpiresAt dạng chuỗi ISO (từ JSON) không chỉ Date', () => {
    expect(resolvePlan('vip', '2020-01-01T00:00:00Z', now)).toBe('free')
    expect(resolvePlan('vip', '2030-01-01T00:00:00Z', now)).toBe('vip')
  })

  // Tiêu chí chấp nhận §④.2 và §④.3 của đặc tả, đo ở tầng hàm thuần (migration 0076 lo phần DB).
  it('hàng CŨ plus/pro còn hạn → vip (giữ nguyên hạn); đã hết hạn → free', () => {
    const future = new Date('2026-08-03T00:00:00Z') // now + 10 ngày
    expect(resolvePlan('pro', future, now)).toBe('vip')
    expect(resolvePlan('plus', future, now)).toBe('vip')
    expect(resolvePlan('pro', new Date('2026-07-01T00:00:00Z'), now)).toBe('free')
    expect(resolvePlan('plus', new Date('2026-07-01T00:00:00Z'), now)).toBe('free')
  })
})
