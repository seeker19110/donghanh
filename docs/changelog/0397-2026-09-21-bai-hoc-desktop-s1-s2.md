# 0397 — 2026-09-21 — Bài học thật chặng `desktop-s1` và `desktop-s2`

- **PR:** (điền số sau khi tạo)
- **Đặc tả:** `docs/specs/2026-09-21-desktop-s1-s4-bai-hoc-that.md` (Approved for implementation, 2026-09-21)

## Việc đã làm

Hướng Desktop trước đợt này HOÀN TOÀN TRẮNG — `SPEC_STAGE_UNITS` không có khoá `desktop-*` nào,
dù bản đồ chặng (`specializations/desktop.ts`) và nội dung chi tiết (`details/desktop-s1..s4.ts`)
đã có sẵn từ lâu. PR này lấp hai chặng đầu theo đúng nhịp chia PR ở mục ⑦ của đặc tả.

- Thêm 8 unit `p6-u274…p6-u281`, mỗi unit 2 bài, tổng 16 bài Python MÔ PHỎNG:
  - `desktop-s1`: chọn nền tảng (ngân sách gói cài/RAM, phím tắt toàn cục) · làm việc với tệp
    (ghi qua tệp tạm rồi đổi tên, ký tự cấm theo hệ) · lưu trữ cục bộ (`schemaVersion` vs
    `dataVersion`, sao lưu/xuất trước migrate) · đóng gói và cài đặt (ký mã, checksum, hệ đích,
    khoảng cách phiên bản khi cập nhật tự động).
  - `desktop-s2`: việc nền (luật tuyệt đối "không chặn luồng giao diện", hợp đồng huỷ, tiến độ
    và ước lượng đo được) · trải nghiệm chuyên nghiệp (nhánh redo bị cắt, phím tắt theo quy ước
    hệ, sàn trợ năng) · đồng bộ tuỳ chọn (mã hoá trước khi gửi, `drift` khi hai bên sửa cùng
    trường, offline-first) · chẩn đoán từ xa (sự đồng ý, che PII, chế độ an toàn, gói báo lỗi).
- Thêm khuôn chung `lessons/desktopLessonFactory.ts` (ép `match: 'contains'`, gắn nhãn MÔ PHỎNG
  và câu nhắc "ngưỡng số là hằng số dạy học, không phải khuyến nghị sản xuất" vào mọi bài).
- Thêm hai semantic gate `desktopS1Lessons.test.ts` / `desktopS2Lessons.test.ts`: đếm unit/lesson,
  bắt buộc có ca hiện + ca ẩn + ca âm, khoá marker theo miền, và chặn mọi I/O ngoài trong code.
- Nối `SPEC_STAGE_UNITS['desktop-s1'|'desktop-s2']`, đăng ký vào `lessons.ts`, gắn vào bậc P6
  trong `curriculum.ts`, sinh lại `lessonsLazy.ts` bằng `npm run gen:lesson-index`.

## Quyết định

- **Mỗi unit bám đúng MỘT module của chặng, không gộp** — bốn module mỗi chặng là bốn loại quyết
  định rời nhau, gộp lại thì ca âm của module này lẫn vào policy của module kia.
- **KHÔNG nối `desktop-*` vào bất kỳ `learningPaths/*.ts` nào** (quyết định ⑧.2 của đặc tả):
  hướng đứng độc lập, học viên vào qua trang hướng chuyên sâu.
- Mọi ngưỡng số (300MB gói, 500MB RAM, 200ms huỷ, 100 thao tác chờ, 50MB gói báo lỗi, 5 phiên
  bản) là hằng số DẠY HỌC, nêu rõ trong `theory` để không bị đọc thành best practice sản xuất.

## Bằng chứng kiểm chứng

- `npm run gen:lesson-index` → `533 bài · 238 unit`
- `npx vitest run packages/subject-programming/lessonsPython.test.ts` → 1048/1048 xanh (chạy
  python3 thật cho mọi `sampleSolution`, `workedExample`, `predict`)
- `npm run typecheck` → 0 lỗi · `npm run lint` → 0 cảnh báo · `npm run format:check` → sạch
- `npm test` · `npm run build` → xem mô tả PR
