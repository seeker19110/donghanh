// founder.ts — "Ưu đãi Người tiên phong": 2026 tài khoản ĐẦU TIÊN được VIP VĨNH VIỄN.
//
// Đặc tả: docs/specs/2026-09-15-uu-dai-2026-nguoi-tien-phong.md
// Schema + hàm SQL: postgres/migrations/0080_founder_lifetime_vip.sql
//
// ── MÔ HÌNH ─────────────────────────────────────────────────────────────────────────────
// "VIP vĩnh viễn" KHÔNG phải một gói mới. Nó là trạng thái đã có sẵn trong hệ thống:
//   plan = 'vip'  AND  plan_expires_at IS NULL
// `resolvePlan()` trả 'vip' cho trạng thái này bất kể `now` (plan.ts), `computePlanGrant()`
// coi nó là cao nhất và không bao giờ đụng vào (planGrant.ts, bất biến §3), và
// `downgradeExpiredPlans()` chỉ hạ những hàng có `plan_expires_at` KHÔNG null. Nghĩa là mọi
// nhánh "user này có phải VIP không" đã đúng sẵn — đợt này KHÔNG thêm nhánh kiểm quyền nào.
//
// Cột `profiles.is_founder` chỉ trả lời "vì sao vĩnh viễn" + "đã cấp bao nhiêu suất", để đếm
// được hạn ngạch và hiển thị huy hiệu. Nó KHÔNG phải nguồn sự thật của quyền VIP — đừng viết
// `if (isFounder) allowVip()` ở đâu cả.

import type { Pool, PoolClient } from 'pg'
import { getPgPool } from '@dhcb/core-db/pgPool'

/**
 * Số suất "Người tiên phong". Đây là NGUỒN SỰ THẬT DUY NHẤT của con số này ở tầng ứng dụng —
 * hàm SQL `grant_founder_if_available` nhận nó qua tham số thay vì tự ghi cứng.
 */
export const FOUNDER_LIMIT = 2026

export interface AccountOrder {
  id: string
  /** Mốc tạo tài khoản (ms hoặc ISO) — `users.created_at`. */
  createdAt: number | string
}

/**
 * Hàm THUẦN: chọn ra tập tài khoản được hưởng ưu đãi từ một danh sách tài khoản.
 *
 * Tách ra để test được đúng mốc 2025/2026/2027 mà không cần DB. Thứ tự phải KHỚP TUYỆT ĐỐI
 * với `order by u.created_at, u.id` trong migration — lệch một tie-break là hai nơi chọn ra
 * hai tập khác nhau.
 */
export function selectFounderIds(
  accounts: readonly AccountOrder[],
  limit: number = FOUNDER_LIMIT,
): string[] {
  return [...accounts]
    .sort((a, b) => {
      const at = new Date(a.createdAt).getTime()
      const bt = new Date(b.createdAt).getTime()
      if (at !== bt) return at - bt
      // Tie-break bằng id để thứ tự ổn định khi trùng mốc thời gian tới từng mili-giây.
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
    })
    .slice(0, Math.max(0, limit))
    .map((a) => a.id)
}

/**
 * Cấp suất cho một tài khoản NẾU hạn ngạch còn. Gọi khi hồ sơ được tạo lần đầu.
 *
 * Toàn bộ phần "còn chỗ không / cấp" nằm trong MỘT hàm SQL có khoá tư vấn, nên hai lượt đăng
 * ký đồng thời lúc còn đúng một suất không thể cùng được cấp.
 *
 * FAIL-SAFE ĐÚNG CHIỀU: lỗi hạ tầng → trả `false` (KHÔNG cấp). Cấp nhầm một suất vĩnh viễn là
 * thứ không lấy lại được; bỏ sót thì lần đăng nhập sau `ensureProfileRow()` gọi lại và cấp bù.
 */
export async function grantFounderIfAvailable(
  userId: string,
  runner: Pool | PoolClient = getPgPool(),
  limit: number = FOUNDER_LIMIT,
): Promise<boolean> {
  try {
    const { rows } = await runner.query<{ granted: boolean }>(
      'select public.grant_founder_if_available($1, $2) as granted',
      [userId, limit],
    )
    return rows[0]?.granted === true
  } catch (err) {
    console.warn('[founder] cấp ưu đãi Người tiên phong lỗi → bỏ qua lần này:', err)
    return false
  }
}
