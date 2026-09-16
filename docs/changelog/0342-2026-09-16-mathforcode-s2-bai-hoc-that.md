# 0342 — Tám bài học thật cho `mathforcode-s2`

**Ngày:** 2026-09-16  
**Phạm vi:** `GOAL-2026-ASA/M2-S1b`.

## Đã làm

- Thêm `p6-u138..p6-u141`, tám bài Python về phép đếm, xác suất, giả ngẫu nhiên và thống kê.
- Nối curriculum, registry, lazy index và stage mapping; mở nút vào học trên lộ trình.
- Cố định seed và quy ước nearest-rank để kết quả chạy lại được và không flaky.

## Kiểm chứng

- Python mục tiêu: 24/24; schema/curriculum/stage/SRS/lazy/markdown: 2.394/2.394.
- Typecheck, lint, format, build và E2E Chromium xanh; ảnh 390px/1440px đã được xem.
- Full suite: 13.190 test xanh; 5 lỗi `report-status` có sẵn do WSL/Windows và hai timeout dưới
  tải. Hai test timeout chạy riêng sau đó xanh 53/53.

## Rollback

- Additive, không migration; revert PR để bỏ mapping, registry và bốn unit cùng lúc.
