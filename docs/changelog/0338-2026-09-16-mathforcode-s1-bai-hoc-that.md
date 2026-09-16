# 0338 — Tám bài học thật cho `mathforcode-s1`

**Ngày:** 2026-09-16  
**Phạm vi:** `GOAL-2026-ASA/M2-S1a`, curriculum P6 và công cụ sinh lazy lesson index.

## Đã làm

- Thêm bốn unit `p6-u134..p6-u137`, mỗi unit phủ đúng một module của chặng “Nền tảng rời rạc
  cho lập trình viên”.
- Soạn tám bài Python theo vòng đầy đủ: hook, theory, worked example, Predict, Parsons, Make với
  ca hiện/ẩn, homework và SRS.
- Nội dung gồm: nhị phân/bù 2, sai số float, De Morgan, bit mask, modulo/ring buffer, Luhn, tổng
  tam giác và Big-O thực nghiệm.
- Nối `mathforcode-s1` vào `SPEC_STAGE_UNITS`; trang lộ trình nay chỉ hiện nút vào học sau khi
  bốn unit và bài thật đã tồn tại.
- Sinh lại `lessonsLazy.ts`: 381 bài trong 162 unit.
- Sửa bộ sinh chỉ mục dùng `pathToFileURL` để dynamic import chạy đúng trên Windows, WSL interop
  và Linux thay vì hiểu nhầm ổ `C:` là URL scheme.

## Kiểm chứng

- Cổng Python thật cho tám bài mới: 24/24 lượt Make, worked example và Predict xanh.
- Schema/curriculum/stage/SRS/lazy/markdown: 2.929 test xanh.
- Typecheck, lint, format và build xanh.
- Full suite: 13.078 test xanh; 5 lỗi `report-status` đã có sẵn do đường dẫn WSL/Windows và một
  timeout Swift khi chạy đồng thời. Cổng Swift chạy riêng sau đó xanh 44/44.
- E2E xác nhận chặng `mathforcode-s1` có nút “Vào học chặng này”; ảnh 390px/1440px được xem
  trước khi merge.

## Rollout và rollback

- Additive, không migration; id cũ và tiến độ cũ giữ nguyên.
- Rollback bằng revert PR; lazy index quay lại trạng thái trước và stage tự trở về “bài đang soạn”.
