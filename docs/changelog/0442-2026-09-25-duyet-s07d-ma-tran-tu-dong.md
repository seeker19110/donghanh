# Duyệt S07d — cổng ma trận tự động: focus bị che, vùng chạm, tiêu đề

- **Ngày:** 2026-09-25 · **PR:** PR tài liệu của nhánh `seeker/gifted-johnson-2qrl9y`
- **Loại:** `docs(spec)`, chỉ đổi tài liệu, không đổi source.
- **Nguồn quyết định:** ngày 25/09 người dùng yêu cầu "những gì bạn có thể làm được thì làm hết
  đi, ưu tiên chất lượng cao". Đây là phần S07 còn kiểm được bằng CI và trình duyệt.

## Đã làm

- `docs/research/2026-09-25-s07d-ma-tran-tu-dong.md`: probe 9 trạng thái màn × 4 bề rộng ×
  3 theme trên main `6e47152`. Kết quả:
  - Không màn nào tràn ngang.
  - **Thanh điều hướng đáy che hoàn toàn nút đang focus**, vi phạm WCAG 2.4.11: Home ở
    320/390/768, CEFR quiz ở 320.
  - Vùng chạm dưới 44 px: ô hỏi Home cao 24 px; ở Placement, nút "Bỏ qua" cao 36 px và nút
    "Thoát" 58×20 px; hai nút icon sidebar 28–32 px.
  - Thiếu `h1` ở CEFR (tab khác "Bài học") và ở Placement màn câu hỏi/kết quả.
- `docs/specs/2026-09-23-uiux-s06-s08-accessibility.md`: thêm quyết định **S07d Approved for
  implementation**, ghi phạm vi source và cổng E2E `e2e/s07-matrix.spec.ts` có negative control.
- Goal (dòng M2/S07) và `PROGRESS.md`: cập nhật tại chỗ.

## Không làm

- Không sửa source trong PR này.
- Không chuyển pinch, bàn phím ảo, browser zoom trên trình duyệt khác hay AT thật thành đạt.
  Các mục đó vẫn WAITING.

## Bằng chứng

- Probe chạy bằng Playwright 1.63.0 và Chromium 141 headless: 105/108 ô đạt, 3 ô N/A (sheet
  mục lục không tồn tại ở 1440).
- `npx prettier --check` các file đã sửa, `npm run check:specs`,
  `npx vitest run scripts/changelog.test.ts`.
