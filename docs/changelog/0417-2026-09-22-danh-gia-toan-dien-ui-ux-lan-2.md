# 0417 — 2026-09-22 — Đánh giá UI/UX toàn diện lần 2: 51 trang × 3 theme × 2 bề rộng (306 ảnh), kiểm lại 6 đợt A–F

- **PR:** (đợt này) · nhánh `claude/ui-ux-comprehensive-review-rplwjh`
- **Loại:** audit chỉ đọc (`docs`), không đổi code
- **Báo cáo:** `docs/audit/2026-09-22-danh-gia-toan-dien-ui-ux-lan-2.md`

## Việc đã làm

- Chụp Tầng 8b **toàn bộ route có giao diện riêng** (51 trang) ở 1440/390px × `blue-sky` ·
  `dark-blue` · `kid` = 306 ảnh `fullPage` + 45 ảnh khung nhìn đầu; đo bằng máy chiều cao trang,
  tràn ngang, lỗi JS, số `<h1>`, số nút chạm < 32px. Ảnh ngoài repo, file spec tạm đã xoá.
- Kiểm lại 6 đợt A–F của changelog 0412 bằng ảnh: **5/6 có hiệu lực**, đợt B để lại một lỗi mới ở
  desktop (ô nhập đè gợi ý nhanh).
- Rà mã bổ trợ: `err.message` còn lộ ở 14 file, `alert()` 6 chỗ, `thongDiepLoiThanThien` đã áp ở
  21 file.

## Phát hiện chính (chi tiết và số đo trong báo cáo)

- **P0-1** Luyện nghe tab "Câu thông dụng": 1.000 thẻ in phẳng, **74.309px ở 390px** (88 màn hình),
  không tìm kiếm/nhóm.
- **P0-2** Trang bán VIP mô tả bằng thuật ngữ (`Gemini Live Full-Duplex`, `Memory Palace Loci`,
  `Chirp3-HD`) và hứa tính năng `PROGRESS.md` ghi chưa kiểm chứng.
- **P1** Companion desktop ô nhập che gợi ý nhanh · Nhiệm vụ báo "Đăng nhập" khi API lỗi · thuật
  ngữ còn sót 5 chỗ · skeleton treo ở Hồ sơ + tab `(0)` cạnh khối lỗi · Truyện 17.456px.
- **P2** câu lặp 5 lần (Lập trình home, Tiến độ) · header rỗng khi lỗi · 14 hướng mobile thiếu
  mục lục · tách cài đặt chung/môn · theme `kid` chỉ đổi màu.
- **Tốt, giữ:** 0 tràn ngang, 0 lỗi JS, 3 theme khớp bố cục; khối lỗi chuẩn đã nhất quán; mẫu
  `/cau-thong-dung` (tiếp tục + tìm kiếm dán đáy) là lời giải cho P0-1.

## Quyết định

- Theo QUY-TRINH-AUDIT §1.2: không sửa trong lượt audit. Đề xuất 6 đợt G–M ở báo cáo mục 5; đợt H
  (trang VIP) cần chủ dự án chốt câu chữ vì đụng thanh toán.

## Bằng chứng

- 306/306 ảnh chụp thành công (`playwright test` 11,9 phút), bảng số đo ở báo cáo mục 2.
- Cổng: chỉ đổi 3 file Markdown → `npm run format:check` trên các file đó.
