# V2-05 Life Graph foundation — slice 1

> **[2026-09-08] Trạng thái đo lại:** IMPLEMENTED trên `main`, không phải backlog mới.
> Bằng chứng hiện có: migration `postgres/migrations/0043_life_graph.sql`, service
> `packages/core-personal/lifeGraphService.ts` và test `packages/core-personal/lifeGraphService.test.ts`.
> Tài liệu này từ nay giữ vai trò baseline/invariant để các phase sản phẩm mới tái sử dụng, không yêu cầu viết lại schema/API đã tồn tại.

## Outcome đã đạt

Một learning goal đang chạy thật có thể được biểu diễn trong Life Graph mà Life Graph không giành ownership dữ liệu Learning.

## Ownership baseline

Learning goal nguồn vẫn thuộc Learning. Life Graph là projection/read view. `personal.life_goal_sources`
chỉ giữ liên kết nguồn; adapter đọc payload từ domain nguồn thay vì copy thành nguồn sự thật thứ hai.

## Baseline đã có

- `personal.life_graph_nodes`;
- `personal.life_graph_edges`;
- `personal.life_goals`;
- `personal.life_goal_sources`;
- `personal.life_graph_audit_log`;
- integrity chống orphan/cross-user edge;
- optimistic concurrency/versioning;
- soft archive;
- audit mutation;
- service CRUD/read model và test tương ứng.

## Invariant phải giữ khi phát triển tiếp

1. Không edge nào được nối node khác `person_id`.
2. Goal import từ domain nguồn không được đổi nghĩa âm thầm trong Life Graph.
3. Mutation yêu cầu version hợp lệ; stale writer phải conflict.
4. Delete là soft archive; audit giữ append-only.
5. Domain nguồn tiếp tục sở hữu payload nghiệp vụ.
6. AI/derived state không trở thành authoritative state nếu thiếu policy/evidence.

## Việc còn lại liên quan roadmap sản phẩm

Các việc sau là phase mới, không phải “hoàn tất V2-05 slice 1”:

- nối thêm evidence read models cho Recommendation Engine;
- Goal Graph read API tối ưu cho Daily Plan/Companion nếu baseline hiện tại chưa đủ;
- reconciliation/outbox khi domain nguồn thay đổi;
- bulk backfill chỉ khi có use case và đo được nhu cầu;
- cross-domain links khi có flow Career ↔ Learning thật.

## Rollback

Không tạo migration mới từ tài liệu này. Nếu thay đổi tương lai chạm Life Graph, rollback phải ưu tiên gỡ route/code mới và giữ bảng/audit hiện có để tránh mất lịch sử.

## Không làm chỉ vì roadmap này

- graph database;
- UI graph lớn;
- bulk inference bằng LLM;
- tự tạo goal từ chat;
- cross-domain mutation không có policy/evidence.
