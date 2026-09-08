# 0286 — Đặc tả P1.3a completion Daily Plan server-owned

## Mục tiêu

Chốt nghĩa của “hoàn thành có ý nghĩa” cho Daily Learning Plan trước khi thêm metric, để
funnel không tin click, `daily_usage`, hay event completion do client tự khai.

## Quyết định

- Chỉ `srs_review` được triển khai ở P1.3a: server xác nhận một card từ vựng đến hạn đã tăng
  `reps`, được dời hạn và state merged đã lưu thành công.
- `continue_learning` và `discover_path` chưa có transition domain server-owned nên hiện báo
  `n/a`, không suy ra completion.
- Receipt append-only, idempotent theo user/action/planner-version/ngày VN; evidence chỉ là
  số card, không chứa word/card id hoặc nội dung học.

## Lý do

`daily_usage.learn_count` gộp học mới và ôn lại, chỉ theo ngày và không có provenance theo
Daily Plan. Dùng nó sẽ biến tương quan thành completion. Đặc tả mới giữ P1 nhỏ, đo được và
reversible; action khác chỉ được bổ sung khi có state transition riêng.
