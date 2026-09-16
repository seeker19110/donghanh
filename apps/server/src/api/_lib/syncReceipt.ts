// apps/server/src/api/_lib/syncReceipt.ts — Biên nhận idempotency theo LẦN GỬI (slice S09-1).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md §③.2 và §③.8.
//
// Vấn đề được giải: server commit tiến độ xong rồi kết nối mới đứt (F2 của đặc tả). Client không
// biết là đã lưu, gửi lại — nếu không có biên nhận thì transaction merge chạy lần hai, cộng
// thưởng lần hai, ghi `daily_plan_completions` lần hai.
//
// Quyết định Q2: lưu ở POSTGRES, ghi CÙNG transaction với upsert tiến độ — KHÔNG Redis.
// Redis của dự án đang rớt ~7 lần/ngày và bật `enableOfflineQueue: false`, nên biên nhận sẽ
// "biến mất" đúng lúc cần nhất; ghi cùng transaction cũng loại bỏ cửa sổ "đã ghi tiến độ mà
// chưa có biên nhận".
//
// Bảng: public.sync_receipts (migration 0083), khoá chính `(user_id, attempt_id)`.

import type { Pool, PoolClient } from 'pg'

/** Endpoint nào được phép ghi biên nhận — khớp ràng buộc `check` của bảng. */
export type SyncEndpoint = 'progress' | 'programming-progress'

/** Số ngày giữ biên nhận trước khi job dọn xoá (đủ dài cho một thiết bị offline vài ngày). */
export const SYNC_RECEIPT_RETENTION_DAYS = 7

export interface SyncReceipt {
  endpoint: SyncEndpoint
  response: Record<string, unknown>
}

interface ReceiptRow {
  endpoint: SyncEndpoint
  response: Record<string, unknown>
}

/**
 * Tra biên nhận của lần gửi `attemptId`.
 *
 * Trả `null` khi chưa từng gửi (đường bình thường). Có giá trị = đây là lần gửi LẠI: nơi gọi
 * phải trả lại `response` kèm `replayed: true` và KHÔNG chạy transaction ghi.
 */
export async function findReceipt(
  db: Pool | PoolClient,
  userId: string,
  attemptId: string,
): Promise<SyncReceipt | null> {
  const { rows } = await db.query<ReceiptRow>(
    'select endpoint, response from public.sync_receipts where user_id = $1 and attempt_id = $2',
    [userId, attemptId],
  )
  const row = rows[0]
  return row ? { endpoint: row.endpoint, response: row.response ?? {} } : null
}

/**
 * Ghi biên nhận. PHẢI gọi bằng `client` của chính transaction đã upsert tiến độ.
 *
 * `on conflict do nothing`: hai request cùng `attemptId` chạy song song thì row lock đã giữ
 * chúng tuần tự, nhưng vẫn để câu lệnh tự chịu được ca đua — không làm vỡ transaction.
 */
export async function saveReceipt(
  client: PoolClient,
  userId: string,
  attemptId: string,
  endpoint: SyncEndpoint,
  response: Record<string, unknown>,
): Promise<void> {
  await client.query(
    `insert into public.sync_receipts (user_id, attempt_id, endpoint, response)
     values ($1, $2, $3, $4::jsonb)
     on conflict (user_id, attempt_id) do nothing`,
    [userId, attemptId, endpoint, JSON.stringify(response)],
  )
}

/** Xoá biên nhận quá hạn (job nền, xem `startSyncReceiptCleanup` trong server.ts). */
export async function purgeOldSyncReceipts(
  pool: Pool,
  retentionDays: number = SYNC_RECEIPT_RETENTION_DAYS,
): Promise<{ deleted: number }> {
  const { rowCount } = await pool.query(
    `delete from public.sync_receipts
      where created_at < now() - ($1 || ' days')::interval`,
    [String(retentionDays)],
  )
  return { deleted: rowCount ?? 0 }
}
