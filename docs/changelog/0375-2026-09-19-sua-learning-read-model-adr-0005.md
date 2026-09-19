# 0375 — Sửa `learningReadModelService` theo ADR-0005 (cột `stats`/`settings` không tồn tại)

- **Ngày:** 2026-09-19
- **PR:** (điền số PR khi tạo)
- **ADR liên quan:** `docs/adr/0005-read-model-stats.md` (Accepted, chốt 2026-09-19)

## Bug gốc

`packages/core-learner/learningReadModelService.ts` SELECT hai cột `settings` và `stats` từ
`english.learning_progress` — HAI CỘT NÀY KHÔNG TỒN TẠI trong schema thật
(`postgres/schema.sql`; bảng có `learned, hard, srs, cefr_grammar, cefr_dialogues,
cefr_unlocked, cefr_exams, placement, weekly_goal, achievements, updated_at, version,
client_updated_at`). Test unit cũ mock `pool.query` với fixture tự bịa `settings`/`stats` nên
không bắt được lỗi này (xanh giả) — production có thể trả số không có nguồn hoặc lỗi runtime
undefined-column tuỳ driver Postgres.

## Đã sửa (đúng 4 quyết định ĐÃ CHỐT ở ADR-0005)

1. **Câu SELECT** chỉ còn cột thật: `learned, srs, placement, updated_at`.
2. **`direction`/`dailySpeed`**: đây là biến CLIENT-SIDE (`apps/dhcb/src/lib/storage.ts`),
   server chưa từng có cột lưu chúng — `settings` luôn `undefined` từ trước tới giờ nên hành vi
   thật trong production LUÔN là mặc định `'A'`/`10`. Bỏ hẳn `parseDirection`/code đọc
   `settings`, thay bằng hằng số — giữ nguyên hành vi quan sát được, chỉ dọn code chết.
3. **`masteredCount`** = số khoá trong `learned` (JSONB mảng) — chú thích rõ đây là số TỰ BÁO
   CÁO (client tự đánh dấu "đã thuộc"), KHÔNG phải bằng chứng đã xác thực server.
4. **`inProgressCount`** = số khoá trong `srs` chưa có mặt trong `learned`.
5. **`dueForReviewCount` và `srsDueCount`** dùng CHUNG một công thức: số khoá trong `srs` có
   `due <= Date.now()` (server time, KHÔNG lấy từ client/DB) — tránh lệch số giữa hai field như
   code cũ (`stats.srsDueCount || dueForReviewCount`).
6. **`recentEvidenceCount`**: đổi contract sang `z.number().int().nonnegative().nullable()`
   (KHÔNG bump `LEARNING_READ_MODEL_SCHEMA_VERSION` — 5 consumer nội bộ sửa cùng PR). Service
   trả `null` vì subject mặc định `english` (mọi 5 caller hiện tại không truyền `subject`)
   KHÔNG có nguồn "bằng chứng đã xác thực server" thật
   (`platform.completion_evidence.subject_id` không nhận `'english'`) — PR này KHÔNG cài logic
   đếm evidence thật cho các subject STEM (ngoài phạm vi ADR-0005), nên trả `null` cho MỌI
   subject hiện tại thay vì bịa `0`.
7. **Test canh** `packages/core-learner/learningReadModelService.schemaGuard.test.ts`:
   `describe.skip` → `describe`, xác nhận XANH THẬT.
8. **Test unit** `packages/core-learner/learningReadModelService.test.ts`: viết lại toàn bộ
   fixture theo cột thật (`learned`, `srs`, `placement`, `updated_at`), thêm ca: `learned`
   rỗng, `srs` có mục due/chưa due, mục `srs` đã có trong `learned` (không tính inProgress),
   `due` sai kiểu (không tính là đến hạn), `recentEvidenceCount` luôn `null`.
9. Rà `recentEvidenceCount` toàn repo bằng grep — không có consumer sản phẩm nào (5 caller kể
   trên) đọc trực tiếp field này để hiển thị, nên không có UI nào cần sửa để xử lý `null`.

## Bằng chứng kiểm chứng (chạy thật)

- `npx vitest run packages/core-learner/learningReadModelService.schemaGuard.test.ts
packages/core-learner/learningReadModelService.test.ts
packages/core-contracts/learningReadModel.test.ts
apps/server/src/api/learning/learning-read-model.test.ts` → 4 test files passed, 19 tests
  passed (schemaGuard KHÔNG còn skip, xanh thật).
- `npm run typecheck` → 0 lỗi.
- `npm run lint` → 0 cảnh báo.
- `npm run build` → thành công (app + hub + packages + server).
- `npx vitest run` (toàn bộ) → 710 test files passed, 1 file skipped (không liên quan — không
  còn `.skip(` nào trong bất kỳ `*.test.ts` nào của repo, skip còn lại là runtime skip có điều
  kiện có sẵn từ trước, không do PR này), 14965 tests passed, 2 tests skipped (tương tự, có
  trước PR này).
- `npm run codemap -- impact packages/core-learner/learningReadModelService.ts` và
  `-- impact packages/core-contracts/learningReadModel.ts`: soát đủ 5 consumer đã biết
  (`careerService.ts`, `crossDomainGraphService.ts`, `companionRuntime.ts`,
  `learning-read-model.ts`, `proactiveBriefingService.ts`) — không consumer nào đọc
  `recentEvidenceCount` trực tiếp.

## Quyết định giữ nguyên (không đổi trong PR này)

- KHÔNG bump `LEARNING_READ_MODEL_SCHEMA_VERSION` (vẫn = 1) theo đúng ADR-0005 mục 2.
- KHÔNG cài logic đếm evidence thật cho subject STEM — ngoài phạm vi ADR-0005.
- KHÔNG migration — phương án B không cần schema mới.
