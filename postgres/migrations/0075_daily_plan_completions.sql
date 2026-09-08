-- Migration 0075: bằng chứng completion server-owned cho Daily Learning Plan P1.3a.
--
-- Bảng append-only, không lưu card id/nội dung học. Một người chỉ có một receipt cho mỗi
-- action + planner version + ngày Việt Nam, kể cả client retry hoặc đồng bộ từ nhiều thiết bị.
--
-- Rollback ứng dụng: dừng ghi/đọc, giữ nguyên bảng để không xoá bằng chứng đã thu.
-- Rollback schema (chỉ sau khi export và owner duyệt):
--   drop index if exists public.daily_plan_completions_user_action_version_vn_day_uidx;
--   drop table if exists public.daily_plan_completions;

create table if not exists public.daily_plan_completions (
  id              bigserial primary key,
  user_id         uuid not null references public.users(id) on delete cascade,
  action_kind     text not null check (action_kind = 'srs_review'),
  planner_version text not null,
  source          text not null check (source = 'progress_merge'),
  occurred_at     timestamptz not null default now(),
  evidence        jsonb not null,
  constraint daily_plan_completions_evidence_shape check (
    jsonb_typeof(evidence) = 'object'
    and evidence = jsonb_build_object('reviewedCardCount', evidence -> 'reviewedCardCount')
    and jsonb_typeof(evidence -> 'reviewedCardCount') = 'number'
    and (evidence ->> 'reviewedCardCount')::integer > 0
  )
);

create unique index if not exists daily_plan_completions_user_action_version_vn_day_uidx
  on public.daily_plan_completions (
    user_id,
    action_kind,
    planner_version,
    ((occurred_at at time zone 'Asia/Ho_Chi_Minh')::date)
  );

comment on table public.daily_plan_completions is
  'Receipt append-only do server xác nhận cho Daily Learning Plan; không chứa card id hay nội dung học';
