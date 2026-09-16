-- 0084_mistakes_evidence.sql — Gắn BẰNG CHỨNG vào sổ lỗi môn Anh (slice S12-2).
--
-- Đặc tả: docs/specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md §③.3, AC-9.
--
-- VÌ SAO: tới trước migration này, một dòng trong `english.mistakes` không nói được nó SINH RA
-- TỪ ĐÂU — chỉ có `source` ('chat'/'writing'/'speaking') là loại màn hình, không phải lượt làm
-- bài cụ thể. Người học bấm "Ôn lại lỗi này" thì không có chỗ nào để quay về. Ba cột dưới đây
-- là móc nối tới bằng chứng: `attempt_id` trỏ lượt nộp trong `platform.completion_evidence`
-- (migration 0081), `content_id` trỏ nội dung (bài học) đã sinh ra lỗi.
--
-- BA ĐIỀU CỐ Ý KHÔNG LÀM:
--   1. KHÔNG đổi `unique (user_id, dedupe_key)`: lỗi trùng vẫn gộp về MỘT dòng như cũ, bằng
--      chứng chỉ giữ bản MỚI nhất. Đưa `attempt_id` vào khoá gộp sẽ làm mỗi lượt sai thành một
--      thẻ mới — đúng thứ sổ lỗi cố tình tránh.
--   2. KHÔNG bắt buộc (`null` được): sổ lỗi cũ của người dùng thật không có bằng chứng, và
--      giao diện phải nói thẳng "ghi tay" chứ không giả vờ có bằng chứng.
--   3. KHÔNG tạo bảng lỗi thứ hai cho STEM — câu sai của bài STEM đã nằm trong
--      `platform.completion_evidence.answers`, đọc thẳng từ đó (§7 Q1).
--
-- `subject_id` có default 'english' vì đây là bảng của môn Anh; cột tồn tại để truy vấn sau này
-- không phải suy "bảng nào thì môn nấy".
--
-- Lũy đẳng (`add column if not exists`): chạy lại nhiều lần không đổi kết quả.
--
-- Rollback (cột nullable/có default, mã cũ không đọc tới — revert mã trước, drop cột sau đều an toàn):
--   alter table english.mistakes
--     drop column if exists attempt_id,
--     drop column if exists content_id,
--     drop column if exists subject_id;

alter table english.mistakes
  add column if not exists attempt_id uuid,
  add column if not exists content_id text,
  add column if not exists subject_id text not null default 'english';

comment on column english.mistakes.attempt_id is
  'Lượt nộp đã sinh ra lỗi này (platform.completion_evidence.attempt_id) — null = lỗi ghi tay, không có bằng chứng';
comment on column english.mistakes.content_id is
  'Nội dung (bài học) đã sinh ra lỗi — null khi lỗi đến từ hội thoại/bài viết tự do';
comment on column english.mistakes.subject_id is
  'Môn của lỗi; bảng này là của môn Anh nên mặc định english';
