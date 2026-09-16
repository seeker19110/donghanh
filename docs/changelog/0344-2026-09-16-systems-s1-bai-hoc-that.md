# 0344 — Mở chặng Hệ thống S1 bằng tám bài mô phỏng kiểm chứng được

## Thay đổi

- Thêm bốn unit `p6-u146..p6-u149` và tám bài Python về vùng nhớ/lifetime, ABI đồ chơi,
  ownership, chuỗi NUL, debug/sanitizer, pipeline build/link và ISA đồ chơi.
- Ánh xạ `systems-s1` vào bốn unit thật, đồng bộ registry thường/lazy và mở nút học ở trang hướng
  Hệ thống.
- Thêm cổng riêng khóa đủ tám bài, ca hiện/ẩn, các lỗi memory/linker cốt lõi và ranh giới rõ:
  đây là mô phỏng Python — không giả nhận đã chạy C/gdb/sanitizer thật.

## Kiểm chứng

- `npm run gen:lesson-index`: 405 bài, 174 unit.
- Test schema/curriculum/lazy/SRS/markdown/stage: 2.495/2.495 xanh; test Systems S1: 3/3.
- `lessonsPython.test.ts`: 664/664 code Python chạy thật.
- `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`: xanh.
- Playwright Chromium `e2e/programming-path.spec.ts`: 1/1 xanh trên cả lộ trình chính và trang
  hướng Hệ thống.
- `npm test`: 13.412 pass, 7 fail nền (5 ca `report-status.sh` do đường dẫn WSL/Windows và 2
  timeout khi full-suite tải cao); chạy riêng hai file timeout: 53/53 xanh. CI Linux là cổng merge
  cuối cùng.

## Phạm vi

- Không thêm lane C, compiler, API, migration hay dependency.
- Artifact allocator và báo cáo từ toolchain C thật trong rubric vẫn phải làm ngoài sandbox.
