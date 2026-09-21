# 0401 — Bài học thật chặng `embedded-s3` và `embedded-s4`

- Ngày: 2026-09-21
- PR: #TBD (PR thứ hai, sau `docs/changelog/0397-*.md`)
- Đặc tả: `docs/specs/2026-09-21-embedded-s1-s4-bai-hoc-that.md` (Approved for implementation)

## Việc đã làm

Khép trọn hướng `embedded`: **8 unit `p6-u266`…`p6-u273`, 16 lesson Python**, mỗi unit bám đúng
MỘT module. Sau PR này hướng Nhúng có **đủ cả bốn chặng** bài học thật.

- `embedded-s3` — `p6-u266` ghi bền qua mất điện (đổi con trỏ ở bước cuối, chống bản ghi dở
  dang) + watchdog và ngân sách bộ nhớ tĩnh · `p6-u267` kiểm thử qua HAL (chặn test bỏ qua HAL,
  test không xác định) + dải môi trường thử · `p6-u268` hệ tệp chỉ-đọc và cây thiết bị + ngân
  sách thời gian khởi động · `p6-u269` hợp đồng an toàn bộ nhớ kiểu Rust + ràng buộc `no_std`.
- `embedded-s4` — `p6-u270` nạp và hiệu chuẩn tại xưởng + ngân sách trạm · `p6-u271` định danh
  từng thiết bị / khởi động an toàn + thu hồi đúng phạm vi một máy · `p6-u272` cập nhật theo đợt
  nhỏ với ngưỡng dừng + bản tin sức khoẻ và quay lui từng máy · `p6-u273` trạng thái an toàn khi
  hỏng + tính đầy đủ của checklist quy trình.
- Hai semantic gate mới: `embeddedS3Lessons.test.ts`, `embeddedS4Lessons.test.ts`.
- Nối `SPEC_STAGE_UNITS['embedded-s3'|'embedded-s4']`, đăng ký 8 unit vào `lessons.ts` +
  `curriculum.ts`, sinh lại `lessonsLazy.ts` (`549 bài · 246 unit`).

## Quyết định

- **S3-m4 (Rust) mô phỏng bằng Python thuần** — hợp đồng an toàn bộ nhớ kiểm tĩnh, KHÔNG cài
  `rustc`/toolchain `no_std` vào CI. Đây là phương án mặc định của đặc tả, đã được duyệt ở mục ⑧
  câu hỏi 4.
- **S4-m4 dán nhãn MÔ PHỎNG khái niệm, KHÔNG hứa là chứng nhận an toàn chức năng thật** — ghi
  thẳng trong phần lý thuyết và trong `makePrompt` của `p6-u273-l1`, đúng yêu cầu phạm vi ①.
- Vẫn KHÔNG nối vào `learningPaths/*.ts` nào; vẫn không sửa rubric phần cứng thật.
- `p6-u272-l1` so sánh tỉ lệ lỗi bằng **phép nhân chéo** thay vì phép chia, để quyết định ở sát
  ngưỡng không phụ thuộc làm tròn — một ca biên mà phép chia số thực rất dễ làm sai.

## Bằng chứng kiểm chứng

- `npm run gen:lesson-index` → `549 bài · 246 unit`.
- `npx vitest run` trên 5 file liên quan (hai gate mới + `lessonsPython` + `stageUnits` +
  `lessonsLazy`) → **5 file, 1129 test passed**. `lessonsPython.test.ts` chạy Python THẬT.
- `npm run typecheck` · `npm run lint` · `npm run format:check` · `npm test` · `npm run build` —
  xanh, chi tiết ở mô tả PR.
