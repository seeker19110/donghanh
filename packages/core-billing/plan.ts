// packages/core-billing/plan.ts — chuẩn hoá giá trị cột profiles.plan (text tự do, không CHECK
// constraint) thành 1 trong 2 gói hợp lệ. Dùng ở MỌI nơi đọc plan từ DB để tránh mỗi chỗ tự viết.
//
// GĐ1 (2026-09-12, đặc tả docs/specs/2026-09-12-gd1-xoa-goi-pro.md): XOÁ gói 'plus' và 'pro'.
// Chỉ còn Free (miễn phí, hưởng thẳng hạn mức Plus cũ = 30 lượt/ngày) và VIP (gói trả phí duy nhất).
export type Plan = 'free' | 'vip'

// Giá trị CŨ còn sót trong DB: migration 0076 đã dọn, nhưng vẫn phải chịu được dòng cũ lọt lưới
// (bản ghi tạo ra giữa lúc deploy, bản sao lưu khôi phục tay...). Quy ước: 'plus'/'pro' cũ được
// coi như 'vip' — kết hợp với resolvePlan (kiểm plan_expires_at) sẽ ra ĐÚNG ý nghĩa đặc tả:
// còn hạn → hưởng VIP tới hết hạn đã trả; hết hạn → free. KHÔNG ai đang trả tiền bị mất quyền lợi.
const LEGACY_PAID_PLANS = new Set(['plus', 'pro'])

export function normalizePlan(value: string | null | undefined): Plan {
  if (value === 'vip') return 'vip'
  if (typeof value === 'string' && LEGACY_PAID_PLANS.has(value)) return 'vip'
  return 'free'
}

// Gói THỰC SỰ có hiệu lực ngay lúc đọc — nếu VIP đã quá `planExpiresAt` thì coi như
// hết hạn (Free), bất kể job dọn dữ liệu (api/_lib/planExpiry.ts) đã chạy hay chưa. Free
// không bao giờ hết hạn nên bỏ qua `planExpiresAt` (kể cả nếu cột còn giá trị cũ sót lại).
export function resolvePlan(
  rawPlan: string | null | undefined,
  planExpiresAt: Date | string | null | undefined,
  now: Date = new Date(),
): Plan {
  const plan = normalizePlan(rawPlan)
  if (plan === 'free' || !planExpiresAt) return plan
  // Hết hạn = còn hiệu lực khi now < planExpiresAt (đúng lúc planExpiresAt trở đi đã hết hạn).
  return new Date(planExpiresAt).getTime() <= now.getTime() ? 'free' : plan
}
