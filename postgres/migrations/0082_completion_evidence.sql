-- Migration 0082: nhật ký bằng chứng hoàn thành + trạng thái suy ra (slice S11).
--
-- Đặc tả: docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md §③.3
--
-- Hai bảng, hai vai trò tách bạch:
--   · completion_evidence — NHẬT KÝ CHỈ THÊM: mỗi lượt nộp một dòng, API không update/delete.
--     `attempt_id` do client sinh là khoá idempotent: gửi lại (bấm đúp, retry mạng, flush hàng
--     đợi) không tạo dòng thứ hai.
--   · completion_state    — TRẠNG THÁI SUY RA: 1 dòng/người/nội dung, thứ mục lục đọc.
--     "Không kéo lùi" được cưỡng chế ngay trong câu upsert (xem đặc tả §③.3), ở TẦNG DB chứ
--     không ở tầng ứng dụng, nên hai tiến trình PM2 song song cũng không hạ `completed` xuống.
--
-- Server chấm LẠI từ `answers` thô trước khi ghi — client không gửi được đúng/sai/điểm.
--
-- Lũy đẳng (`if not exists`): chạy lại nhiều lần không đổi kết quả.
--
-- Rollback (bảng mới, chưa có ai đọc — an toàn):
--   drop table if exists platform.completion_state;
--   drop table if exists platform.completion_evidence;

create schema if not exists platform; -- đã có từ 0058; giữ để file tự đứng được

create table if not exists platform.completion_evidence (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  subject_id      text not null check (subject_id in ('mathematics','physics','chemistry','biology')),
  content_id      text not null check (content_id ~ '^[a-z0-9-]{3,64}$'),
  course_id       text check (course_id is null or char_length(course_id) <= 64),
  activity_kind   text not null check (activity_kind in ('stem_lesson_check')),
  attempt_id      text not null check (attempt_id ~ '^[A-Za-z0-9-]{16,64}$'),
  evidence_kind   text not null default 'server_graded' check (evidence_kind in ('server_graded')),
  correct         integer not null check (correct >= 0),
  total           integer not null check (total >= 1 and correct <= total),
  ratio           numeric(4,3) not null check (ratio >= 0 and ratio <= 1),
  passed          boolean not null,
  content_version char(64),                       -- bamNoiDungBaiHoc(bài) lúc chấm
  answers         jsonb not null,                 -- [{questionIndex, raw, correct, reason}] ≤ 50 phần tử
  client_at       timestamptz not null,
  server_at       timestamptz not null default now(),
  constraint completion_evidence_attempt_uq unique (user_id, subject_id, content_id, attempt_id)
);

create index if not exists completion_evidence_user_content_idx
  on platform.completion_evidence (user_id, subject_id, content_id, server_at desc);

create table if not exists platform.completion_state (
  user_id       uuid not null references public.users(id) on delete cascade,
  subject_id    text not null,
  content_id    text not null,
  status        text not null check (status in ('in_progress','completed')),
  best_ratio    numeric(4,3) not null,
  last_ratio    numeric(4,3) not null,
  attempts      integer not null default 1 check (attempts >= 1),
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (user_id, subject_id, content_id)
);

comment on table platform.completion_evidence is
  'Nhật ký chỉ-thêm bằng chứng hoàn thành (S11). attempt_id là khoá idempotent do client sinh; server chấm lại từ answers thô.';
comment on table platform.completion_state is
  'Trạng thái hoàn thành suy ra từ completion_evidence; completed không bao giờ bị kéo lùi.';
