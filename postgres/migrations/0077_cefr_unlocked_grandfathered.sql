-- 0077_cefr_unlocked_grandfathered.sql
-- GĐ2a — VIP học tự do, Free đi tuần tự, CHỐT CHẶN Ở SERVER.
-- Đặc tả: docs/specs/2026-09-12-gd2-vip-hoc-tu-do-mon-anh.md §③
--
-- Tới nay tập "cấp CEFR đã mở" là do CLIENT tự khai: localStorage `et_cefr_unlocked_*` đẩy lên
-- cột `cefr_unlocked` và server ghi hộ. Từ PR này server TỰ TÍNH tập đó (gói VIP + cefr_exams)
-- và không nhận ghi từ client nữa. Nếu chỉ đổi luật mà không giữ lại giá trị đang có thì người
-- dùng cũ (đã mở cấp theo LUẬT CŨ: ≥70% từ vựng + 100% ngữ pháp, chưa có bài thi cuối cấp) sẽ bị
-- khoá lại cấp họ đang học — hồi tố, phá bất biến "không ai mất quyền đã có".
--
-- Nên: ĐÓNG BĂNG giá trị hiện có sang cột riêng `cefr_unlocked_grandfathered` = "quyền đã cấp".
-- Từ đây cột đó CHỈ ĐỌC (không handler nào ghi), còn `cefr_unlocked` thành bản chụp kết quả do
-- server tính lại mỗi lần ghi tiến độ.
--
-- LƯU Ý THỨ TỰ TRIỂN KHAI: chạy migration này TRƯỚC khi deploy mã mới. Ngược thứ tự thì trong
-- vài phút giữa hai bước, mã mới đọc cột chưa tồn tại / tập grandfather rỗng → người dùng cũ
-- mất quyền tạm thời.
--
-- Bảng thật nằm ở schema `english` (migration 0030 đã dời khỏi `public`; `public.learning_progress`
-- nay chỉ là VIEW `select * from english.learning_progress`). Đặc tả §③ viết `public.` từ trước
-- đợt dời schema đó — ở đây bám bảng thật, rồi dựng lại view cho cột mới lộ ra.
--
-- Lũy đẳng: `if not exists` + mệnh đề `where` chỉ backfill dòng chưa có gì.

alter table english.learning_progress
  add column if not exists cefr_unlocked_grandfathered text[] not null default '{}';

update english.learning_progress
   set cefr_unlocked_grandfathered = coalesce(cefr_unlocked, '{}')
 where cefr_unlocked_grandfathered = '{}'
   and coalesce(array_length(cefr_unlocked, 1), 0) > 0;

-- View public.* phải dựng lại thì cột mới mới xuất hiện qua nó (create or replace view không tự
-- thêm cột vào view đã tồn tại khi dùng `select *`).
drop view if exists public.learning_progress;
create view public.learning_progress as select * from english.learning_progress;

-- ============================================================================
-- ROLLBACK (chạy tay nếu cần lùi):
--
-- Không cần làm gì để lùi MÃ: cột `cefr_unlocked` cũ vẫn còn nguyên và vẫn được ghi, nên chỉ cần
-- deploy lại bản mã cũ (server nhận ghi `cefrUnlocked` từ client trở lại) là hệ thống chạy như cũ.
-- Cột `_grandfathered` để lại vô hại. Nếu vẫn muốn xoá hẳn:
--
-- alter table english.learning_progress drop column if exists cefr_unlocked_grandfathered;
-- drop view if exists public.learning_progress;
-- create view public.learning_progress as select * from english.learning_progress;
