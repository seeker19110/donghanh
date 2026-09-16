-- 0082_personal_learner_intent.sql — Ý ĐỊNH HỌC của người mới (slice S05-1).
-- Đặc tả: docs/specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md §③.2.
--
-- Người mới nói trong ≤ 5 câu: học MÔN gì · để làm gì · mỗi ngày bao lâu · đã quen chưa · lớp mấy.
-- Bảng này chỉ cất ĐÚNG chừng đó, để `/bat-dau` lần sau không hỏi lại và để "Hôm nay" (S06) biết
-- người này đang muốn học gì.
--
-- VÌ SAO BẢNG RIÊNG (quyết định Q3 của đặc tả): nhét vào `public.profiles` là đụng bảng nằm trên
-- luồng đăng nhập của MỌI người dùng; nhét vào `personal.intake` là trộn hai luồng khác nghĩa
-- (intake hỏi về ĐỜI SỐNG và có ràng buộc CHECK riêng). Bảng riêng thì rollback gọn bằng một
-- lệnh drop, không ai tham chiếu tới nó.
--
-- KHÔNG MÃ HOÁ (khác `personal.intake`): mọi giá trị ở đây là enum ĐÓNG (6 môn, 4 mục đích,
-- 4 mốc thời gian, 3 mức, 3 lớp). Mã hoá chúng chỉ làm hỏng truy vấn/thống kê mà không giấu được
-- gì — không có câu tự do nào ở luồng này.
--
-- KHOÁ NGOẠI trỏ `public.users(id)` cho khớp bảng anh em `personal.intake` (0061).
--
-- Số migration cấp theo thứ tự MERGE thật, không đặt trước (quyết định chủ dự án 2026-09-15):
-- đặc tả viết `0081` khi khảo sát, nhưng `0081_completion_evidence.sql` (PR #935) merge trước.
--
-- Lũy đẳng (chạy lại không lỗi).
-- Rollback: drop table if exists personal.learner_intent;

create schema if not exists personal;

create table if not exists personal.learner_intent (
  user_id        uuid primary key references public.users(id) on delete cascade,
  -- Câu 1 — môn muốn học, GIỮ THỨ TỰ người dùng bấm: phần tử đầu là môn được chọn việc chính.
  subject_ids    text[] not null,
  -- Câu 2–5 — null nghĩa là người dùng BỎ QUA câu đó (được phép, không chặn luồng).
  purpose        text,
  time_budget    smallint,
  level          text,
  grade          text,
  schema_version int not null default 1,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'learner_intent_subject_ids_check') then
    alter table personal.learner_intent add constraint learner_intent_subject_ids_check
      check (cardinality(subject_ids) between 1 and 6
             and subject_ids <@ array['english','programming','mathematics',
                                      'physics','chemistry','biology']::text[]);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'learner_intent_purpose_check') then
    alter table personal.learner_intent add constraint learner_intent_purpose_check
      check (purpose is null or purpose in ('thi_cu','cong_viec','so_thich','chua_ro'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'learner_intent_time_budget_check') then
    alter table personal.learner_intent add constraint learner_intent_time_budget_check
      check (time_budget is null or time_budget in (5,10,20,30));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'learner_intent_level_check') then
    alter table personal.learner_intent add constraint learner_intent_level_check
      check (level is null or level in ('lv_new','lv_some','lv_solid'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'learner_intent_grade_check') then
    alter table personal.learner_intent add constraint learner_intent_grade_check
      check (grade is null or grade in ('10','11','12'));
  end if;
end $$;
