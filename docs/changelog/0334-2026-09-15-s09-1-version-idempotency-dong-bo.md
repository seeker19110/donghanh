# 0334 — 2026-09-15 — S09-1: version đơn điệu + idempotency cho đồng bộ tiến độ (server)

- **PR:** #TBD (nhánh `claude/laughing-babbage-o25bls-s09-1`)
- **Đặc tả:** `docs/specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md` (S09-1, AC-1…AC-7) — Approved for implementation, §7 chốt theo cột "Đề xuất của AI".
- **Phạm vi:** **chỉ SERVER**, 0 thay đổi giao diện, tương thích client cũ 100%. Outbox/retry/hai tab ở client là S09-2; `ConflictRecord` + hộp thoại là S09-3.

## Việc đã làm

| Việc                                                                     | File                                                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Hợp đồng `SyncEnvelope` / `SyncResult` / `ConflictRecord`                | `packages/core-contracts/sync.ts` (+ test, 13 ca)                                     |
| Biên nhận idempotency dùng chung + job dọn 7 ngày                        | `apps/server/src/api/_lib/syncReceipt.ts` (+ test, 6 ca), `apps/server/src/server.ts` |
| Migration lũy đẳng: 2 cột × 2 bảng + `sync_receipts` + `sync_conflicts`  | `postgres/migrations/0082_sync_version_receipts.sql` + `schema.sql` + dòng README     |
| `/api/progress`: `sync` tuỳ chọn, version, conflict, replay, Retry-After | `apps/server/src/api/core/progress.ts` (+ test, 36 → 44 ca)                           |
| Test tích hợp hai request đồng thời trên Postgres THẬT                   | `apps/server/src/api/core/progress.concurrency.test.ts` (mới, 2 ca)                   |
| `/api/programming/progress`: batch ≤ 50 mục, version theo dòng, replay   | `apps/server/src/api/subjects/programming/progress.ts` (+ test, 8 → 14 ca)            |

## Quyết định khi thi hành

1. **Số migration là `0082`, không phải `0083` như đặc tả dự tính.** Đặc tả viết lúc S05 chưa
   merge và giả định "S05 lấy 0081, S11 lấy 0082"; thực tế `main` chỉ mới có tới `0081`
   (S11 — `completion_evidence`). Theo quyết định của chủ dự án 2026-09-15: **số cấp theo thứ tự
   MERGE thật, không đặt trước**. Kiểm lại `git ls-tree origin/main postgres/migrations/` ngay
   trước khi merge; bị PR song song chiếm thì đổi tên file + sửa mọi chỗ nhắc số + chạy lại
   `migrate:pg` ×2.
2. **Biên nhận ghi TRONG cùng transaction với upsert tiến độ** (Q2 của đặc tả). Có test canh thứ
   tự call: chỉ số của câu `insert into public.sync_receipts` phải nhỏ hơn chỉ số `commit`. Không
   có cửa sổ "đã merge nhưng chưa có biên nhận" — đúng chỗ phát hiện F2 đã khoanh.
3. **`version` tăng TRONG câu SQL** (`version = english.learning_progress.version + 1`), không
   tính ở tầng ứng dụng: hai tiến trình PM2 song song không bao giờ ghi trùng số.
4. **Biên nhận KHÔNG lưu `merged`** (để dòng receipt nhỏ). Lần gửi lại chỉ cần `version` +
   `cefrUnlocked`; bản gộp đầy đủ lấy bằng `pullProgress` như thường lệ.
5. **`attemptId` trùng nhưng khác `endpoint` → 409** (ca hiếm, chỉ do bug client) — đúng bảng ca
   lỗi §③.8.
6. **Dạng body cũ của `/api/programming/progress` vẫn hợp lệ** nhưng nay chạy trong
   `withTransaction` (trước là 2 `pool.query` rời). Đổi này khiến 2 test cũ phải cập nhật cách
   đếm call (bỏ qua `begin`/`commit`) — không đổi hành vi.
7. **Test AC-4 bỏ qua khi thiếu `DATABASE_URL`**: job `unit` của CI không có service Postgres
   (đọc `.github/workflows/ci.yml`, không có khối `services`). Bằng chứng chạy thật ở dưới.

## Bất biến KHÔNG bị phá (kiểm bằng lệnh)

- `git diff origin/main -- apps/server/src/api/_lib/progressMerge.ts` = **rỗng** — luật merge
  domain không đổi một dòng nào.
- Câu `case when programming.lesson_progress.status = 'completed' then 'completed' …` giữ nguyên
  (test canh chuỗi đó).
- `select … for update` vẫn còn trong `progress.ts` (test tích hợp AC-4 sẽ đỏ nếu ai bỏ đi).
- Hạn mức không đổi: 30/phút `/api/progress`, 60/phút programming. Replay VẪN bị đếm (đếm lượt
  chạy trước khi tra biên nhận — test canh `query` chưa hề được gọi khi 429).

## Bằng chứng kiểm chứng

```
npm run typecheck   ✅ 0 lỗi
npm run lint        ✅ 0 cảnh báo
npm run format      ✅
npm run build       ✅ dist/assets/index-*.js 217,35 kB (gzip 66,45 kB)
npm run test:coverage ✅ 12 898 pass | 2 skip (634 file), ngưỡng coverage đạt
```

Migration trên DB sạch (Postgres 16.13 local, `initdb` mới):

```
# lần 1
[migrate:pg] → 0082_sync_version_receipts.sql ... xong
[migrate:pg] ✅ Hoàn tất — đã áp dụng 85 migration lẻ mới.
# lần 2 (lũy đẳng)
[migrate:pg] Áp postgres/schema.sql (idempotent) ...
[migrate:pg] ✅ schema.sql xong.
[migrate:pg] Đã áp dụng đủ 85 migration lẻ — không có gì mới.
EXIT=0
```

`\d` của 4 bảng (`sync_receipts`, `sync_conflicts`, `english.learning_progress`,
`programming.lesson_progress`) chụp trước và sau lần chạy thứ 2 → `diff` **rỗng**.

Đoạn ROLLBACK trong comment cuối file chạy tay được (`ON_ERROR_STOP=1`):
`DROP TABLE ×2 · ALTER TABLE ×2 · DROP VIEW · CREATE VIEW` → `ROLLBACK OK`; áp lại migration sau
đó cũng sạch.

AC-4 trên Postgres thật:

```
DATABASE_URL=postgres://…/dhcb_s09 npx vitest run apps/server/src/api/core/progress.concurrency.test.ts
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

(hai POST `Promise.all` cùng `baseVersion=1` → `learned` có CẢ `cat` lẫn `dog`, `version = 3`,
đúng một response `conflict: true`; gửi lại cùng `attemptId` → `replayed: true`, version không tăng.)

## Còn nợ / việc tiếp

- **S09-2** (client): `syncOutbox.ts`, `progressSync.ts`, `programmingProgress.ts`, indicator, xoá
  `offlineStore.ts`. Chừng nào S09-2 chưa lên, client vẫn KHÔNG gửi `sync` → cột `version` tăng
  nhưng chưa ai dùng, và ba lỗi mất dữ liệu F1/F4/F5 vẫn còn nguyên.
- **S09-3**: `sync_conflicts` đã có bảng nhưng chưa ai ghi (chờ S08 có endpoint nháp — Q5).
- **Nợ Q6** (không sửa trong S09): F6 `hard` ghi đè theo thứ tự đến · F7 `mergeSrsMap` hoà reps thì
  client thắng · F8 so chuỗi ISO do client sinh. Sau PR này DB đã có `client_updated_at` +
  `version` — đủ dữ liệu cho một slice riêng sửa theo mốc server-side.
