# 0337 — Đặc tả bài học thật cho `mathforcode-s1`

**Ngày:** 2026-09-16  
**Phạm vi:** tài liệu thi hành lát cắt `GOAL-2026-ASA/M2-S1a`; chưa sửa source bài học.

## Đã làm

- Đối soát `main`: PR #942 đã merge và M1/S2 hoàn tất; còn 14/27 chặng chuyên sâu chưa có unit.
- Chia milestone nền CS thành năm lát cắt nhỏ, mỗi lát cắt có kết quả học tập và cổng riêng.
- Chốt lát cắt đầu tiên: bốn unit, tám bài Python cho `mathforcode-s1`, phủ một-một bốn module
  hiện có.
- Xác định id `p6-u134..p6-u137`, điểm chạm registry/lazy index, tiêu chí code chạy thật và các
  bất biến được test canh.

## Quyết định

- Mỗi module dùng một unit và hai lesson để không nén bốn chủ đề nền tảng khác nhau vào cùng buổi.
- Chỉ dùng Python thuần, hàm tất định; không NumPy, UI, API hoặc migration.
- Spec được phép thi hành vì chỉ cụ thể hóa master spec đã duyệt và chủ dự án đã yêu cầu tiếp tục.

## Kiểm chứng

- `npx prettier --check` cho spec, goal và changelog.
- `git diff --check`.

## Rollback

PR chỉ thay tài liệu; revert ba file, không ảnh hưởng runtime hay dữ liệu người học.
