// packages/core-billing/promo.ts — Khuyến mãi ra mắt: khi admin đặt promo_until (bảng
// app_settings, chỉnh qua /api/admin-settings), gói được nâng lên bậc trên tới thời điểm đó.
// promo_until = null → tắt khuyến mãi, áp hạn mức thật ngay. PHẢI khớp Ý NGHĨA với
// src/lib/promo.ts phía client (giá trị THẬT lấy từ DB, client chỉ có bản tĩnh để hiển thị tạm).
//
// GĐ1 2026-09-12: chỉ còn 2 gói nên "nâng 1 bậc" = Free → VIP, VIP giữ nguyên VIP (trước đây có
// bậc trung gian Pro). Xem docs/specs/2026-09-12-gd1-xoa-goi-pro.md.
import { getAppSettings } from '@dhcb/core-db/settings'
import type { Plan } from './plan.js'

export async function isFullAccessPromoActive(now: Date = new Date()): Promise<boolean> {
  const { promoUntil } = await getAppSettings()
  return promoUntil !== null && now.getTime() < new Date(promoUntil).getTime()
}

// Gói THỰC SỰ áp dụng ngay bây giờ cho việc tính hạn mức/quyền giọng.
export async function effectivePlan(plan: Plan, now: Date = new Date()): Promise<Plan> {
  if (!(await isFullAccessPromoActive(now))) return plan
  return 'vip' // free → vip (hạn mức cao nhất); vip → vip (không đổi)
}
