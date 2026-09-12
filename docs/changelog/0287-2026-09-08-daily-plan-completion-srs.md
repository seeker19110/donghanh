# 0287 — Daily Plan completion có bằng chứng SRS

## Mục tiêu

Triển khai P1.3a để đo meaningful completion của action `srs_review` mà không tin click,
`daily_usage` hoặc event completion do client tự khai.

## Thay đổi

- thêm bảng append-only `daily_plan_completions`, unique theo user/action/planner version/ngày
  Việt Nam và chỉ lưu số thẻ đã ôn;
- POST `/api/progress` khóa state hiện tại và ghi progress + receipt trong cùng transaction;
- chỉ tạo receipt khi thẻ từ vựng đã đến hạn tăng `reps` và được dời `due` sang tương lai;
- admin summary dẫn xuất `daily_plan_completion` từ receipt server-owned, nhóm theo ngày Việt
  Nam/action/version;
- dashboard hiển thị funnel theo action; `continue_learning` và `discover_path` là `n/a`, không
  bị diễn giải sai thành 0%.

## Guardrails

- client không được chọn action kind, user id, planner version, occurred_at hoặc evidence;
- không lưu card id, từ vựng hay payload học;
- lỗi ghi receipt rollback cả progress; unique index chống nhân receipt khi retry;
- không đổi ranking, đường học, AI/provider, billing hoặc entitlement.

## Rollout/rollback

Chạy migration trước code. Không backfill vì lịch sử không có bằng chứng card-level đáng tin.
Rollback ứng dụng dừng đọc/ghi nhưng giữ bảng; chỉ drop sau khi export và owner duyệt.
