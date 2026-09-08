# P1.3a — Completion Daily Plan có bằng chứng server

Trạng thái: **Approved for implementation.**

Ngày chốt: 2026-09-08  
Owner decision: completion chỉ được tính khi server xác nhận đúng tác vụ của thẻ; không suy từ hoạt động trong ngày và không nhận event `complete` do client tự bắn.

## Outcome

Đo bước `meaningful completion` đầu tiên của Daily Learning Plan mà không biến click
hay `daily_usage` thành completion. Slice này là **P1.3a**, chỉ áp dụng action
`daily_plan:srs_review`; hai action còn lại chưa có state domain đủ thẩm quyền.

## Phạm vi và mapping

| Daily Plan action   | Bằng chứng được chấp nhận                                                                                                        | P1.3a     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `srs_review`        | API `/api/progress` đã xác thực user, merge thành công và server phát hiện ít nhất một thẻ từ vựng đang đến hạn được ôn tiến lên | Có        |
| `continue_learning` | Chưa có transition completion server-owned, ổn định theo lesson/path                                                             | Không đếm |
| `discover_path`     | Chỉ là điều hướng, không có outcome học tập                                                                                      | Không đếm |

Một `srs_review` hoàn thành khi và chỉ khi, trong lần POST `/api/progress` thành công:

1. server có state trước merge;
2. có ít nhất một SRS card từ vựng (không phải `grammar:*`) có `due <= now` trước merge;
3. card cùng id trong state sau merge có `reps` tăng và `due` được dời sang tương lai;
4. state merged đã được ghi thành công.

Không tính completion khi sync chỉ lặp lại state cũ, chỉ đổi `hard`, chỉ có grammar card,
hoặc payload không làm tiến độ card đủ điều kiện tăng. Client không được chọn action kind,
user id, thời điểm hay tự gọi endpoint analytics để tạo completion.

## Thiết kế dữ liệu

Migration tạo bảng append-only `public.daily_plan_completions`:

- `id bigserial primary key`;
- `user_id uuid not null references public.users(id) on delete cascade`;
- `action_kind text not null check (action_kind = 'srs_review')`;
- `planner_version text not null`;
- `source text not null check (source = 'progress_merge')`;
- `occurred_at timestamptz not null default now()`;
- `evidence jsonb not null`, chỉ chứa `{ reviewedCardCount: number }`, không chứa word/card id hay nội dung học;
- unique `(user_id, action_kind, planner_version, date(occurred_at at time zone 'Asia/Ho_Chi_Minh'))` **không dùng được** vì Postgres index expression; thay bằng unique index expression cùng bốn trường để mỗi action chỉ có một completion/ngày VN.

Endpoint `/api/progress` là nơi duy nhất ghi bảng này, sau upsert `learning_progress`.
Ghi completion nằm trong cùng transaction với state merge; lỗi ghi completion phải rollback state
để không có progress được báo thành công nhưng mất bằng chứng. Endpoint analytics công khai
không được thêm event type completion.

## Funnel và báo cáo

Admin summary thêm event dẫn xuất `daily_plan_completion` từ bảng completion. Báo cáo phải
nhóm theo ngày VN, `action_kind`, và `planner_version`; chỉ tính user đã xác thực. Một user
được tính một lần mỗi action/ngày/version, dù ôn nhiều thẻ. Funnel P1 hiển thị rõ:

`daily_plan_impression → daily_plan_click → daily_plan_completion → D1/D7 return`

P1.3a chỉ công bố completion rate cho `srs_review`; dashboard phải hiển thị `n/a` cho
`continue_learning` và `discover_path`, không thay bằng 0.

## Acceptance criteria

- Có migration idempotent và rollback note; không lưu word/card id hoặc payload học.
- Unit test route `/api/progress` chứng minh đủ bốn điều kiện thì tạo đúng một receipt; mọi
  trường hợp loại trừ không tạo receipt.
- Test idempotency chứng minh sync/retry trong ngày VN không nhân completion.
- Test admin summary chứng minh completion được đọc từ bảng server-owned, không từ request
  analytics client; daily aggregation dùng `Asia/Ho_Chi_Minh`.
- Không đổi ranking, không gọi AI, không thêm cookie/tracker, và không thay đổi đường học.
- Chạy `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

## Rollout và rollback

Rollout theo migration trước, rồi code đọc/ghi. Bảng mới ban đầu chỉ ghi từ thời điểm deploy,
không backfill vì lịch sử không có evidence card-level đáng tin. Rollback ứng dụng dừng ghi/đọc
receipt; migration giữ bảng append-only để không xoá bằng chứng đã thu. Nếu buộc phải rollback
schema, chỉ drop index/bảng sau khi export được số liệu và có owner approval.

## Ngoài phạm vi

- Không đo completion giả từ `daily_usage` hoặc click.
- Không hỗ trợ `continue_learning`/`discover_path` cho đến khi mỗi action có server-owned
  transition và acceptance criteria riêng.
- Không sửa Life Graph, recommendation ranking, nội dung học hoặc model/AI configuration.
