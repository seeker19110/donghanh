// apps/dhcb/src/lib/home/pickHomeBanner.test.ts — Test bảng cho luật ưu tiên banner trang chủ.
import { describe, it, expect } from 'vitest'
import { pickHomeBanner, type PickHomeBannerInput, type HomeBannerKind } from './pickHomeBanner'

const base: PickHomeBannerInput = {
  isGuest: false,
  planExpiresInDays: null,
  promoEndsInDays: null,
  hasRewardTip: false,
}

describe('pickHomeBanner — đúng MỘT banner theo ưu tiên planExpiry > promoEnding > pricePromo > rewardTip', () => {
  it.each<[string, Partial<PickHomeBannerInput>, HomeBannerKind | null]>([
    ['không có gì cả → null', {}, null],
    ['chỉ có rewardTip → rewardTip', { hasRewardTip: true }, 'rewardTip'],
    ['chỉ có promo (còn nhiều ngày) → pricePromo', { promoEndsInDays: 20 }, 'pricePromo'],
    ['promo còn đúng 4 ngày (trên ngưỡng ≤3) → pricePromo', { promoEndsInDays: 4 }, 'pricePromo'],
    ['promo còn đúng 3 ngày (chạm ngưỡng) → promoEnding', { promoEndsInDays: 3 }, 'promoEnding'],
    ['promo còn 1 ngày → promoEnding', { promoEndsInDays: 1 }, 'promoEnding'],
    ['gói còn đúng 7 ngày (chạm ngưỡng) → planExpiry', { planExpiresInDays: 7 }, 'planExpiry'],
    [
      'gói còn 8 ngày (trên ngưỡng) → không phải planExpiry, không có gì khác → null',
      { planExpiresInDays: 8 },
      null,
    ],
    ['gói còn 1 ngày → planExpiry', { planExpiresInDays: 1 }, 'planExpiry'],
    [
      'gói sắp hết hạn + promo sắp hết + rewardTip cùng lúc → planExpiry thắng',
      { planExpiresInDays: 2, promoEndsInDays: 1, hasRewardTip: true },
      'planExpiry',
    ],
    [
      'promo sắp hết + rewardTip cùng lúc (không có planExpiry) → promoEnding thắng',
      { promoEndsInDays: 1, hasRewardTip: true },
      'promoEnding',
    ],
    [
      'promo còn nhiều ngày + rewardTip cùng lúc → pricePromo thắng',
      { promoEndsInDays: 15, hasRewardTip: true },
      'pricePromo',
    ],
    [
      'khách + promo còn nhiều ngày → pricePromo (khách vẫn được thấy)',
      { isGuest: true, promoEndsInDays: 10 },
      'pricePromo',
    ],
    [
      'khách + promo sắp hết (≤3 ngày) → vẫn CHỈ pricePromo, không lên promoEnding',
      { isGuest: true, promoEndsInDays: 2 },
      'pricePromo',
    ],
    [
      'khách + gói sắp hết hạn (dữ liệu không hợp lệ với khách) → bỏ qua, không phải planExpiry',
      { isGuest: true, planExpiresInDays: 1 },
      null,
    ],
    [
      'khách + rewardTip=true (không hợp lệ với khách) → vẫn null',
      { isGuest: true, hasRewardTip: true },
      null,
    ],
    ['khách + không có gì → null', { isGuest: true }, null],
  ])('%s', (_label, partial, expected) => {
    const result = pickHomeBanner({ ...base, ...partial })
    expect(result?.kind ?? null).toBe(expected)
  })
})
