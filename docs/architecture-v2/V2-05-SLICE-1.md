# V2-05 Life Graph foundation — slice 1

> **[2026-09-08] Trạng thái:** ACTIVE theo roadmap sản phẩm
> `docs/specs/2026-09-08-product-roadmap-life-graph.md`. Slice này là P2.1 và được chia thành
> ba PR nhỏ: schema/integrity → adapter/API → audit/concurrency/negative tests. Không xây UI Life
> Graph trong slice này.

## Outcome

Một learning goal đang chạy thật có thể backfill vào Life Graph và round-trip an toàn mà Life
Graph không giành ownership dữ liệu Learning.

## Quyết định ownership

Learning goal được chọn cho gate là mục tiêu onboarding đang chạy thật:
`public.profiles.goal + daily_minutes`, với điều kiện `onboarded=true`. Bảng
`english.user_profile` chưa được dùng vì hiện chỉ là snapshot backfill và không phải nguồn code
production đang đọc/ghi.

Life Graph là projection/read view, không giành ownership của Learning. Bảng
`personal.life_goal_sources` chỉ lưu `(domain, type, source_id)`; không lưu bản sao
`daily_minutes`. Adapter đọc payload từ Learning mỗi lần dựng read view. Nếu label node khác label
nguồn, adapter trả conflict thay vì âm thầm đổi nghĩa.

## Slice 1a — schema + integrity

Deliverables:

- `personal.life_graph_nodes`;
- `personal.life_graph_edges`;
- `personal.life_goals`;
- `personal.life_goal_sources`;
- `personal.life_graph_audit_log`;
- node/edge enums hoặc CHECK tương ứng với contract V2;
- composite key/foreign key chặn orphan và cross-user edge;
- trigger/constraint buộc `life_goals.node_id` là node type `Goal` cùng person;
- version field phục vụ optimistic concurrency;
- archived state thay vì hard delete.

Acceptance:

1. migration chạy lặp theo cơ chế migration hiện tại mà không phá bảng V1;
2. không có FK nào cho phép edge nối node khác person;
3. source link unique theo `(person_id, domain, type, source_id)`;
4. audit log append-only ở application contract;
5. rollback/recovery note rõ ràng.

## Slice 1b — adapter + round-trip API

`POST /api/life-goals` backfill goal của chính user đã xác thực. Unique source key làm thao tác
idempotent. `GET /api/life-goals?nodeId=...` đọc node/source link, đọc lại Learning source và trả
`GoalSchema` hiện có.

Test tự động chứng minh:

1. gọi backfill hai lần trả cùng node;
2. không có câu UPDATE/DELETE tới `public.profiles`;
3. `label`, `targetMinutesPerDay`, status và learner identity giữ nguyên sau round-trip;
4. profile chưa onboarding không bị biến default DB thành goal do người dùng khai.

## Slice 1c — integrity mutation + audit

- Mọi update/archive khoá row và yêu cầu `expectedVersion`; stale writer nhận 409.
- Delete API là soft archive. Mutation tạo audit row append-only trong cùng transaction.
- Xoá mềm node đồng thời archive mọi edge active nối vào node đó.
- Negative tests cho cross-user, orphan, stale version, wrong node type và unauthorized access.

## Integrity và concurrency

- Composite foreign key của edge tới `(node_id, person_id)` chặn cả orphan lẫn cross-user edge.
- Mọi update/archive khoá row và yêu cầu `expectedVersion`; stale writer nhận 409.
- Delete API là soft archive. Mutation tạo audit row append-only trong cùng transaction.
- Xoá mềm node đồng thời archive mọi edge active nối vào node đó.
- Trigger DB buộc `personal.life_goals.node_id` trỏ node type `Goal` cùng person.

## Backfill và round-trip

`POST /api/life-goals` backfill goal của chính user đã xác thực. Unique source key làm thao tác
idempotent. `GET /api/life-goals?nodeId=...` đọc node/source link, đọc lại Learning source và trả
`GoalSchema` hiện có. Test tự động chứng minh:

1. gọi backfill hai lần trả cùng node;
2. không có câu UPDATE/DELETE tới `public.profiles`;
3. `label`, `targetMinutesPerDay`, status và learner identity giữ nguyên sau round-trip;
4. profile chưa onboarding không bị biến default DB thành goal do người dùng khai.

## Rollback

Rollback production ưu tiên gỡ route/code và giữ bảng/audit. Nếu migration chưa có dữ liệu cần
giữ, drop theo thứ tự: `life_graph_audit_log`, `life_goal_sources`, `life_goals`,
`life_graph_edges`, `life_graph_nodes`. Không drop schema `personal` hoặc bảng V2-03/V2-04.

## Chưa làm

- UI Life Graph/Goal Graph;
- bulk backfill toàn bộ production;
- outbox/reconciliation khi Learning goal thay đổi;
- Context Builder/tool runtime enforcement của V2-04;
- graph database;
- recommendation bằng LLM;
- cross-domain mutation.
