# 0335 — Đặc tả khóa Kiến trúc sư phần mềm & AI

**Ngày:** 2026-09-15  
**Phạm vi:** tài liệu thiết kế; chưa thi hành source.

## Đã làm

- Đối chiếu yêu cầu khóa AI Systems Architect với bốn tầng nội dung hiện có của môn Lập trình.
- Đếm bằng code: lộ trình `principal-ai` có 27 chặng, 13 chặng đã nối bài thật, 14 chặng còn rỗng.
- Chốt đề xuất không tạo khóa trùng; nâng cấp additive lộ trình hiện có và giữ `pathId` ổn định.
- Thiết kế chương trình từ P1 đến cấp enterprise: 7 giai đoạn, 6 đồ án và 1 capstone 12 thành phần.
- Tạo goal nhiều lát cắt, risk register, acceptance criteria, rollout và rollback.

## Quyết định cần chủ dự án duyệt

1. Đổi tên hiển thị `principal-ai` thành “Kiến trúc sư phần mềm & AI”.
2. Nối P1–P4 vào đầu lộ trình bằng tham chiếu, không sao chép bài.
3. Biên soạn theo từng milestone nhỏ; stage chỉ được gắn “có bài” sau khi lesson/test thật tồn tại.

## Kiểm chứng

- `npx tsx -e ...`: xác nhận 13/27 chặng có unit.
- Validation Markdown và `git diff --check` chạy trước khi mở PR.

## Rollback

PR chỉ thêm tài liệu; revert ba file mới, không ảnh hưởng runtime hay dữ liệu người học.
