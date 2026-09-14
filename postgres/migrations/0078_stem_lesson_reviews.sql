-- Migration 0078: bàn làm việc của người duyệt chuyên môn nội dung STEM.
--
-- Đặc tả: docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md (ô ②bis).
--
-- BẢNG NÀY KHÔNG PHẢI NGUỒN SỰ THẬT. Nội dung bài học nằm trong mã nguồn TypeScript, còn cổng
-- CI chạy trên repo; nếu app đọc trạng thái duyệt thẳng từ đây thì sinh đúng bẫy TRAPS.md mục 4
-- ở dạng mới: DB nói "đã duyệt", repo nói "draft". Luồng đúng là: người duyệt ghi vào bảng này
-- → `npm run review:sync` đọc ra, ghi vào file dữ liệu trong repo, in diff → người commit.
-- Repo chốt, DB chỉ là nơi làm việc.
--
-- Rollback ứng dụng: gỡ route /api/admin-stem-review, giữ nguyên bảng (không xoá việc đã làm).
-- Rollback schema (chỉ sau khi export và owner duyệt):
--   drop table if exists public.stem_lesson_reviews;

create table if not exists public.stem_lesson_reviews (
  id            bigserial primary key,
  -- Không có khoá ngoại tới bài học: bài học sống trong mã nguồn, không có bảng nào để trỏ tới.
  lesson_id     text not null check (lesson_id ~ '^(toan|ly|hoa|sinh)(10|11|12)-c[0-9]+-b[0-9]+$'),
  mon           text not null check (mon in ('math', 'physics', 'chemistry', 'biology')),
  loai          text not null check (loai in ('ai-sang-loc', 'nguoi-duyet')),

  -- Ai chịu trách nhiệm. Với 'ai-sang-loc' thì để trống — máy không ký tên thay người.
  nguoi_duyet   text check (nguoi_duyet is null or length(btrim(nguoi_duyet)) between 2 and 100),
  user_id       uuid references public.users(id) on delete set null,

  phien_ban_tieu_chi text,
  -- 7 tiêu chí của bộ sinh-v1, mỗi khoá một boolean. Ràng buộc hình dạng nằm ở Zod
  -- (packages/core-contracts/lessonReview.ts) để chỉ có MỘT nơi định nghĩa bộ tiêu chí.
  tieu_chi      jsonb,
  bam_noi_dung  text check (bam_noi_dung is null or bam_noi_dung ~ '^[0-9a-f]{64}$'),
  ghi_chu       text check (ghi_chu is null or length(ghi_chu) <= 4000),

  tao_luc       timestamptz not null default now(),
  cap_nhat_luc  timestamptz not null default now(),

  -- Bản ghi của NGƯỜI phải đủ chữ ký + thước đo + băm; bản ghi của MÁY thì không được có.
  -- Đây là bản sao ở tầng DB của cùng luật mà Zod canh — để một client hỏng không ghi được
  -- bản ghi "đã duyệt" rỗng ruột.
  constraint stem_lesson_reviews_nguoi_duyet_du_chu_ky check (
    (loai = 'nguoi-duyet'
      and nguoi_duyet is not null
      and phien_ban_tieu_chi is not null
      and tieu_chi is not null
      and jsonb_typeof(tieu_chi) = 'object'
      and bam_noi_dung is not null)
    or
    (loai = 'ai-sang-loc'
      and nguoi_duyet is null
      and phien_ban_tieu_chi is null
      and tieu_chi is null)
  )
);

-- Một người một bài một loại: người duyệt sửa lại đánh giá của chính mình thì GHI ĐÈ, không đẻ
-- thêm dòng. Hai người khác nhau cùng duyệt một bài vẫn giữ được hai ý kiến.
create unique index if not exists stem_lesson_reviews_lesson_nguoi_loai_uidx
  on public.stem_lesson_reviews (lesson_id, coalesce(nguoi_duyet, ''), loai);

create index if not exists stem_lesson_reviews_mon_idx on public.stem_lesson_reviews (mon);

comment on table public.stem_lesson_reviews is
  'Bàn làm việc của người duyệt chuyên môn bài STEM; nguồn sự thật cuối là file dữ liệu trong repo';
