-- Migration 0082: version đơn điệu + biên nhận idempotency cho đồng bộ tiến độ (slice S09-1).
--
-- Đặc tả: docs/specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md §③.7
--
-- Ba việc, một file (cả slice S09 dùng chung một migration):
--   · `version` + `client_updated_at` cho hai bảng tiến độ (môn Anh 1 dòng/user, Lập trình
--     1 dòng/bài). `version` là số nguyên ĐƠN ĐIỆU do server tăng, dùng để biết "có thiết bị
--     khác ghi chen vào giữa hay không" — KHÔNG phải vector clock, KHÔNG dùng để merge.
--   · `public.sync_receipts` — biên nhận theo LẦN GỬI (khuôn `personal.action_receipts` ở 0051).
--     Ghi CÙNG transaction với upsert tiến độ nên không có cửa sổ "đã ghi tiến độ mà chưa có
--     biên nhận": server commit rồi mới rớt mạng thì client gửi lại cùng `attempt_id` sẽ nhận
--     đúng response cũ, không cộng thưởng/ghi receipt lần hai.
--   · `public.sync_conflicts` — tạo SẴN cho S09-3 (giữ cả hai bản nháp khi không tự gộp được);
--     S09-1 chưa ghi vào bảng này.
--
-- `client_updated_at` chỉ để chẩn đoán và dựng ConflictRecord — mốc thời gian quyết định vẫn là
-- `now()` của server (không tin đồng hồ client).
--
-- Backfill: `default 1` áp ngay trong `add column` (PG ≥ 11 không rewrite bảng với default hằng),
-- nên mọi dòng hiện có thành `version = 1`, `client_updated_at` NULL — không cần câu `update`.
--
-- Lũy đẳng (`if not exists`): chạy lại nhiều lần không đổi kết quả, lần 2 exit 0.
--
-- ROLLBACK (chạy tay): mã cũ KHÔNG đọc cột mới nên deploy lại mã cũ là đủ; cột/bảng để lại vô hại.
-- Muốn xoá hẳn:
--   drop table if exists public.sync_conflicts;
--   drop table if exists public.sync_receipts;
--   alter table programming.lesson_progress drop column if exists version,
--                                           drop column if exists client_updated_at;
--   drop view if exists public.learning_progress;
--   alter table english.learning_progress drop column if exists version,
--                                         drop column if exists client_updated_at;
--   create view public.learning_progress as select * from english.learning_progress;

-- version đơn điệu + mốc client cho tài liệu tiến độ môn Anh (1 dòng/user)
alter table english.learning_progress
  add column if not exists version integer not null default 1 check (version >= 1),
  add column if not exists client_updated_at timestamptz;

-- Dựng lại view để cột mới lộ ra (cùng lý do như 0077).
create or replace view public.learning_progress as select * from english.learning_progress;

-- version theo DÒNG cho tiến độ bài Lập trình
alter table programming.lesson_progress
  add column if not exists version integer not null default 1 check (version >= 1),
  add column if not exists client_updated_at timestamptz;

-- Biên nhận idempotency theo lần gửi. Khoá chính gồm `user_id`: `attempt_id` trùng nhau giữa
-- HAI người dùng khác nhau là hai lần gửi độc lập, không phải replay.
create table if not exists public.sync_receipts (
  user_id    uuid not null references public.users(id) on delete cascade,
  attempt_id text not null check (char_length(attempt_id) between 8 and 64),
  endpoint   text not null check (endpoint in ('progress', 'programming-progress')),
  response   jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, attempt_id)
);
-- Job dọn biên nhận > 7 ngày quét theo tuổi → chỉ mục trên `created_at`.
create index if not exists idx_sync_receipts_created_at on public.sync_receipts (created_at);

-- Xung đột không tự gộp được (S09-3 mới ghi; tạo sẵn để một migration cho cả slice).
create table if not exists public.sync_conflicts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  doc_kind        text not null,
  doc_id          text not null check (char_length(doc_id) <= 200),
  field           text not null check (char_length(field) <= 100),
  base            text,
  local_doc       jsonb not null,
  remote_doc      jsonb not null,
  content_version text,
  created_at      timestamptz not null default now(),
  resolved_at     timestamptz,
  keep            text check (keep in ('local', 'remote'))
);
create index if not exists idx_sync_conflicts_user_open
  on public.sync_conflicts (user_id) where resolved_at is null;

comment on table public.sync_receipts is
  'Biên nhận idempotency theo lần gửi tiến độ (S09). Ghi cùng transaction với upsert; job dọn sau 7 ngày.';
comment on table public.sync_conflicts is
  'Xung đột văn bản tự do không tự gộp được (S09-3): giữ CẢ HAI bản, hỏi người học khi mở bài.';
