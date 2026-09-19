# 0373 — Test canh gác cột SELECT của `learningReadModelService` khớp schema thật

- **Ngày:** 2026-09-19
- **PR:** (điền số PR khi mở)

## Việc đã làm

`packages/core-learner/learningReadModelService.ts` đang SELECT `settings, placement, stats,
updated_at` từ `english.learning_progress`, nhưng `postgres/schema.sql` KHÔNG có cột `settings`
và `stats` (bug thật, khảo sát S12 ghi trong `PROGRESS.md`). Test unit hiện có
(`learningReadModelService.test.ts`) mock `pool.query` và tự bịa field `settings`/`stats` trong
fixture nên không bắt được lỗi này — xanh giả.

PR này **KHÔNG sửa hành vi/semantics** của `learningReadModelService.ts` (việc đó chờ
`docs/adr/0005-read-model-stats.md` được chủ dự án chốt phương án). PR này chỉ thêm một bài
test canh gác mới, độc lập:
`packages/core-learner/learningReadModelService.schemaGuard.test.ts`.

Test đọc trực tiếp `postgres/schema.sql` (nguồn sự thật của schema), trích danh sách cột thật
của bảng `english.learning_progress` bằng cách parse SQL (regex đơn giản trên khối
`CREATE TABLE`), rồi đối chiếu với danh sách cột mà câu SELECT trong
`learningReadModelService.ts` đang lấy — assert mọi cột SELECT đều nằm trong danh sách cột
thật.

Repo hiện **chưa có cơ chế chạy Postgres thật trong test** (không có docker-compose test DB,
không CI job nào migrate rồi test trên DB thật — đã kiểm bằng
`grep -rl "TEST_DATABASE_URL\|DATABASE_URL"` trên `packages/`/`scripts/`, chỉ thấy dùng ở script
vận hành thật, không có ở test). Vì vậy chọn cách đối chiếu qua schema.sql thay vì dựng thêm hạ
tầng Postgres test mới, theo đúng lựa chọn 3 trong đặc tả việc.

## Cách chạy tay để xác nhận test đang ĐỎ THẬT

Test được đặt trong `describe.skip(...)` có chủ đích (để không phá cổng CI `npm test` /
`npm run test:coverage` — xem lý do dưới). Để tự tay xác nhận nó đỏ:

```bash
# Tạm đổi describe.skip thành describe trong file test, rồi:
npx vitest run packages/core-learner/learningReadModelService.schemaGuard.test.ts
```

Kết quả thật đã chạy (2026-09-19), trước khi thêm `.skip`:

```
AssertionError: expected [ 'settings', 'stats' ] to deeply equal []
```

tức là hai cột `settings` và `stats` được SELECT nhưng không tồn tại trong schema — đúng bug
đang mô tả ở ADR-0005.

## Vì sao `describe.skip` chứ không để test chạy trong CI ngay

Yêu cầu của việc này: PR phải đi qua đủ cổng commit hiện tại của `CLAUDE.md`
(`npm run build` · `npm run typecheck` · `npm run lint` · `npm test`) — tất cả XANH — trong khi
bug thật (SELECT cột không tồn tại) vẫn CHƯA được sửa (sửa nó là phạm vi của một PR khác, sau
khi ADR-0005 được chốt). Nếu để test chạy thật trong `npm test`, cổng commit của chính PR này
sẽ đỏ vì một bug nó không có nhiệm vụ sửa. `describe.skip` (kèm comment giải thích + link
ADR-0005 trong file test) là cách vitest hỗ trợ sẵn để giữ bài test này "chờ sẵn", không tính
vào cổng hiện tại, nhưng không bị quên: comment nói rõ khi nào bỏ `.skip`.

## Bước tiếp theo (khi ADR-0005 được chốt)

1. Sửa `learningReadModelService.ts` theo phương án đã chọn trong ADR-0005.
2. Bỏ `describe.skip` → `describe` trong
   `packages/core-learner/learningReadModelService.schemaGuard.test.ts`.
3. Chạy lại `npx vitest run packages/core-learner/learningReadModelService.schemaGuard.test.ts`
   để xác nhận XANH, rồi coi nợ liên quan trong `PROGRESS.md` là đã đóng.

## Validation (đã chạy thật, 2026-09-19)

- `npm run typecheck` → xanh.
- `npm run lint` → xanh, 0 cảnh báo.
- `npm run build` → xanh.
- `npx vitest run packages/core-learner/learningReadModelService.schemaGuard.test.ts` (tạm bỏ
  `.skip`) → ĐỎ đúng như mong đợi, lỗi `expected [ 'settings', 'stats' ] to deeply equal []`.
- `npm test` (với `.skip` giữ nguyên) → xanh (xem kết quả đầy đủ trong mô tả PR).
