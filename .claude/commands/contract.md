---
description: Thiết kế schema DB/API contract TRƯỚC khi viết code, cho tính năng cần bảng/cột Postgres mới hoặc endpoint mới trong apps/server/src/api/ — chốt trước khi implement
---

Kích hoạt bước **thiết kế contract (schema Postgres và/hoặc API) trước khi code**, cho tính năng
cần schema mới hoặc endpoint mới. (Nguồn: `seeker19110/projects-template`
`.claude/commands/contract.md`, khớp DHCB 2026-09-21.)

> **TRIGGER:** người dùng mô tả một tính năng cần bảng/cột Postgres mới, thay đổi schema hiện
> có, hoặc một API endpoint mới/đổi chữ ký trong `apps/server/src/api/` — **trước khi** bắt đầu
> sửa source code.

## Bước 1 — Xác định phạm vi contract

- **DB:** bảng/cột mới, thay đổi kiểu dữ liệu, ràng buộc (FK/unique/check), index cần thêm —
  đặt trong `postgres/migrations/` theo đúng khuôn đánh số đang dùng (xem
  `postgres/migrations/README.md`).
- **API:** route (khớp `apps/server/src/routes.ts`), method, request/response schema (Zod), mã
  lỗi, `validateAuth()` yêu cầu gì.
- Đọc `PROJECT.md`/schema hiện có trước — không bịa cấu trúc, không đoán tên bảng/cột đã tồn tại
  (CLAUDE.md mục 5). Nghi ngờ đã có bảng/handler tương tự → giao subagent `lookup` tra trước.

## Bước 2 — Viết contract vào đặc tính năng

Ghi vào `docs/specs/<ngày>-<slug>.md` (khuôn `docs/templates/dac-ta-tinh-nang.md`), mục "điểm
chạm file"/"hợp đồng vào-ra":

- **DB:** DDL thật (`CREATE TABLE`/`ALTER TABLE`) hoặc thay đổi migration cụ thể, **lũy đẳng và
  rollback được** (CLAUDE.md mục 9 "nếu đổi schema: có migration có phiên bản, rollback được").
- **API:** chữ ký endpoint đủ rõ (path, method, request/response, mã lỗi) — theo đúng quy ước
  URL mang tiêu đề nếu route có id nội dung có tiêu đề (CLAUDE.md mục 7).
- Đối chiếu breaking change: đổi contract hiện có ảnh hưởng client/consumer khác → nêu rõ, thuộc
  CLAUDE.md mục 12.

## Bước 3 — Đối chiếu ràng buộc bất biến trước khi chốt

- Bảo mật: input từ client validate ở server bằng Zod, **mọi handler tự kiểm `user_id` khớp
  token qua `validateAuth()`** (CLAUDE.md mục 4.2) — không tin RLS (đã rời Supabase, xem
  `docs/adr/0009-thoat-ly-supabase-postgres-tu-host.md`).
- Không secret/PII lộ trong response mặc định.
- Migration có phiên bản, rollback được.
- Đụng lượt AI/gói dịch vụ (free/vip) → đối chiếu `packages/core-billing/plan.ts` cho đúng nguồn
  sự thật, không tự chế logic đếm lượt song song.

## Bước 4 — Chờ duyệt trước khi code

Spec (gồm contract vừa viết) nên được người dùng xác nhận trước khi sửa source code, đặc biệt
nếu là breaking change hoặc đổi schema (CLAUDE.md mục 7 "trước khi sửa nhiều file hoặc đổi cấu
trúc: giải thích kế hoạch ngắn gọn rồi hỏi trước").

## Ranh giới

- Không tự chế schema khi thiếu thông tin nghiệp vụ — hỏi người dùng (dùng `/grill` nếu cần làm
  rõ nhiều nhánh cùng lúc).
- Không code trước khi contract được xác nhận.
- Tính năng nhỏ không đụng DB/API mới (chỉ sửa logic nội bộ) → không cần lệnh này.
