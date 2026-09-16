# 0336 — Mở lộ trình Kiến trúc sư phần mềm & AI từ P1

**Ngày:** 2026-09-16  
**Phạm vi:** manifest lộ trình, trang tổng quan lộ trình và kiểm thử.

## Đã làm

- Đổi tên hiển thị `principal-ai` thành “Kiến trúc sư phần mềm & AI” nhưng giữ nguyên id và mọi
  mã phase/stage đã phát hành.
- Khai báo `foundationLevelIds` để lộ trình tham chiếu P1–P4 từ curriculum gốc, không nhân bản bài.
- Thêm khối “Chặng nền tảng — bắt đầu từ số 0” với mô tả năng lực, thời lượng, tiến độ thật và
  lối vào học từng bậc.
- Bổ sung kiểm thử hợp lệ/thứ tự của foundation manifest, render UI và URL canonical mới.

## Kiểm chứng

- 20 test Vitest mục tiêu xanh.
- 1 test Playwright Chromium xanh.
- `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build` xanh.
- Đã kiểm tra trực quan toàn trang ở viewport 390×844 và 1440×1000.
- Full `npm test` tại máy phát triển còn 4 lỗi không thuộc lát cắt trong
  `scripts/report-status.test.ts`: tiến trình Windows không nhận biến môi trường test từ WSL và
  đọc `PROGRESS.md` thật. CI Linux sẽ là cổng xác nhận cuối.

## Rollout và rollback

- Rollout additive: người học cũ giữ nguyên tiến độ và artifact vì mọi id ổn định.
- Rollback bằng revert PR; không có migration hay dữ liệu cần phục hồi.
