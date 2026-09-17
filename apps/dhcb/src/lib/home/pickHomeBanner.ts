// apps/dhcb/src/lib/home/pickHomeBanner.ts — Chọn ĐÚNG MỘT banner phụ cho trang chủ (P0-1).
//
// Trang chủ trước đây có thể hiện CÙNG LÚC nhiều banner phụ (mẹo thưởng + khuyến mãi giá) —
// gây rối mắt. Hàm THUẦN này quyết định thứ tự ưu tiên, Home.tsx chỉ còn việc gọi nó rồi vẽ
// đúng một khối. Không đụng DOM/localStorage/AI — dễ test bảng đủ ca biên.
//
// Ưu tiên (spec P0-1 §③): planExpiry > promoEnding > pricePromo > rewardTip.
//   - planExpiry:   gói trả phí sắp hết hạn trong ≤ 7 ngày.
//   - promoEnding:  khuyến mãi đang chạy sắp kết thúc trong ≤ 3 ngày (khẩn hơn, ưu tiên trên
//                    pricePromo dù cùng nguồn `promoEndsInDays`).
//   - pricePromo:   khuyến mãi còn đang chạy (không gấp bằng promoEnding).
//   - rewardTip:    mẹo kiếm huy hiệu & thưởng — ưu tiên thấp nhất, chỉ hiện khi không có gì
//                    khẩn hơn.
// Khách (`isGuest`): chỉ có thể nhận 'pricePromo' hoặc null — các banner còn lại đều gắn với
// một tài khoản thật (gói trả phí, mẹo thưởng cá nhân hoá).
export type HomeBannerKind = 'planExpiry' | 'promoEnding' | 'pricePromo' | 'rewardTip'

export interface PickHomeBannerInput {
  isGuest: boolean
  /** Số ngày còn lại tới khi gói trả phí hết hạn; null = không có gói trả phí (Free/vĩnh viễn). */
  planExpiresInDays: number | null
  /** Số ngày còn lại tới khi khuyến mãi giá kết thúc; null = không có khuyến mãi đang chạy. */
  promoEndsInDays: number | null
  /** `RewardTipBanner` có nội dung chưa xem cho uid này không. */
  hasRewardTip: boolean
}

export interface HomeBanner {
  kind: HomeBannerKind
}

const PLAN_EXPIRY_WINDOW_DAYS = 7
const PROMO_ENDING_WINDOW_DAYS = 3

export function pickHomeBanner(input: PickHomeBannerInput): HomeBanner | null {
  const { isGuest, planExpiresInDays, promoEndsInDays, hasRewardTip } = input

  if (!isGuest && planExpiresInDays !== null && planExpiresInDays <= PLAN_EXPIRY_WINDOW_DAYS) {
    return { kind: 'planExpiry' }
  }

  if (!isGuest && promoEndsInDays !== null && promoEndsInDays <= PROMO_ENDING_WINDOW_DAYS) {
    return { kind: 'promoEnding' }
  }

  if (promoEndsInDays !== null) {
    // Khách chỉ có thể tới đây (mọi nhánh trên đều chặn `isGuest`).
    return { kind: 'pricePromo' }
  }

  if (!isGuest && hasRewardTip) {
    return { kind: 'rewardTip' }
  }

  return null
}
