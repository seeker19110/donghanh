// packages/core-contracts/sync.ts — Hợp đồng ĐỒNG BỘ TIẾN ĐỘ có version + idempotency (slice S09).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md §③.1 và §③.5.
//
// Vì sao KHÔNG cần CRDT/vector clock: mọi trường tiến độ hiện có đều là BÁN DÀN (semilattice)
// theo luật domain đã chốt 2026-08-13 — union (learned, cefrGrammar, achievements…), max/OR
// (cefrExams), "reps cao hơn" (srs), "timestamp mới hơn" (placement, weeklyGoal, settings),
// "completed không kéo lùi" (programming). Gộp theo thứ tự nào cũng ra cùng kết quả, nên chỉ cần
// row lock + MỘT số nguyên `version` để biết "có ai ghi chen vào giữa hay không".
// Thứ duy nhất KHÔNG phải bán dàn là văn bản tự do (nháp mã, bài viết) — với nó ta không gộp mà
// giữ CẢ HAI bản (`ConflictRecordSchema`, S09-3).

import { z } from 'zod'

/**
 * Phong bì client gắn kèm mỗi lần gửi tiến độ lên server.
 *
 * `attemptId` là khoá idempotency theo LẦN GỬI: gửi lại cùng payload phải giữ nguyên id này
 * (server trả lại đúng response đã lưu thay vì ghi lần thứ hai); payload đổi thì client sinh id
 * mới. Chỉ có nghĩa trong phạm vi `(user_id, attempt_id)` — `user_id` luôn lấy từ token.
 */
export const SyncEnvelopeSchema = z.object({
  /** UUID v4 do `crypto.randomUUID()` sinh; đổi khi payload đổi. */
  attemptId: z.string().min(8).max(64),
  /** Version client tin là server đang có; 0 = chưa từng thấy version (lần đầu/xoá cache). */
  baseVersion: z.number().int().min(0),
  /**
   * ISO UTC lúc client thay đổi lần cuối — CHỈ để ghi `client_updated_at` phục vụ chẩn đoán và
   * `ConflictRecord`. KHÔNG dùng để quyết định merge: đồng hồ client không tin được, luật merge
   * vẫn là luật domain hiện có.
   */
  clientUpdatedAt: z.string().datetime(),
})
export type SyncEnvelope = z.infer<typeof SyncEnvelopeSchema>

/** Phần kết quả đồng bộ mà mọi endpoint tiến độ trả về (kèm dữ liệu riêng của từng endpoint). */
export const SyncResultSchema = z.object({
  ok: z.literal(true),
  /** Version MỚI của server sau request này (luôn ≥ 1, tăng đúng 1 mỗi lần ghi). */
  version: z.number().int().min(1),
  /** true khi `baseVersion` khác version server TRƯỚC khi merge (thiết bị khác đã ghi chen). */
  conflict: z.boolean(),
  /** true khi response được trả lại từ `public.sync_receipts` (không ghi lần thứ hai). */
  replayed: z.boolean(),
  /** Id `ConflictRecord` (S09-3) — chỉ có khi server không tự gộp được. */
  conflicts: z.array(z.string()).optional(),
})
export type SyncResult = z.infer<typeof SyncResultSchema>

/** Một phía của xung đột văn bản tự do (bản trên máy này / bản từ thiết bị khác). */
export const ConflictSideSchema = z.object({
  content: z.string(),
  clientUpdatedAt: z.string(),
  version: z.number().int().min(0),
})

/**
 * Xung đột KHÔNG tự gộp được (S09-3, bảng `public.sync_conflicts`).
 *
 * Sinh khi và chỉ khi: `baseVersion` lệch VÀ `local.content !== base` VÀ `remote.content !== base`
 * VÀ `local.content !== remote.content`. Một bên bằng `base` → bên kia thắng, không hỏi người học.
 * Mọi trường union/timestamp của `/api/progress` KHÔNG BAO GIỜ sinh record loại này.
 */
export const ConflictRecordSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  /** Tên loại tài liệu nháp do S08 định nghĩa; mở rộng dần, không đoán trước. */
  docKind: z.enum(['session_draft']),
  /** Khoá tài liệu, ví dụ `programming:p1-u1-l1`. */
  docId: z.string().max(200),
  field: z.string().max(100),
  /** Bản gốc chung theo `baseVersion`; null khi không còn tra được. */
  base: z.string().nullable(),
  local: ConflictSideSchema,
  remote: ConflictSideSchema,
  /** Version NỘI DUNG BÀI lúc tạo nháp — hiện cho người học khi hai bên khác nhau. */
  contentVersion: z.string().optional(),
  createdAt: z.string(),
  resolvedAt: z.string().nullable(),
  keep: z.enum(['local', 'remote']).nullable(),
})
export type ConflictRecord = z.infer<typeof ConflictRecordSchema>
