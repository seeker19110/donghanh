-- Migration 0079: sửa giá trị `mon` của 0078 cho khớp id môn app đang dùng.
--
-- Bẫy: `packages/core-contracts/stemLesson.ts` chốt STEM_SUBJECT_IDS = ['mathematics', 'physics',
-- 'chemistry', 'biology'] — đây là id môn dùng xuyên suốt app (URL /mon-hoc/mathematics/...).
-- Migration 0078 (cùng đợt, viết trước khi đọc file này) lại khai ràng buộc CHECK bằng 'math',
-- lệch với id thật. Phát hiện ngay sau khi 0078 merge, trước khi có UI nào ghi được dữ liệu —
-- gần như chắc chắn 0 dòng trong bảng, nhưng SỬA TRỰC TIẾP MỘT MIGRATION ĐÃ MERGE là vi phạm
-- quy ước (một migration đã áp dụng ở môi trường nào đó thì không viết lại lịch sử của nó),
-- nên đây là migration RIÊNG chỉ đổi ràng buộc, không đụng gì khác của 0078.
--
-- Lũy đẳng: DROP CONSTRAINT IF EXISTS rồi ADD lại — chạy lại nhiều lần không lỗi.
-- Rollback: đổi ngược 'mathematics' -> 'math' trong hai lệnh dưới, chạy lại file.

alter table public.stem_lesson_reviews
  drop constraint if exists stem_lesson_reviews_mon_check;

alter table public.stem_lesson_reviews
  add constraint stem_lesson_reviews_mon_check
  check (mon in ('mathematics', 'physics', 'chemistry', 'biology'));

-- Phòng trường hợp có dòng dữ liệu mang giá trị 'math' cũ (chưa có UI nên khó xảy ra, nhưng
-- rẻ để phòng): đổi sang giá trị đúng thay vì để mồ côi.
update public.stem_lesson_reviews set mon = 'mathematics' where mon = 'math';
