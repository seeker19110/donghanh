# 0343 — Mở chặng Thuật toán S1 bằng tám bài thực hành

## Thay đổi

- Thêm bốn unit `p6-u142..p6-u145` và tám bài Python về Big-O, chi phí khấu hao, cấu trúc dữ
  liệu tuyến tính, bảng băm, hai con trỏ, prefix sum, tìm kiếm nhị phân và differential test.
- Ánh xạ `algo-s1` vào bốn unit thật, đồng bộ registry thường/lazy và mở nút vào học trên lộ trình
  Kiến trúc sư Phần mềm & AI.
- Thêm cổng riêng khóa đủ tám bài, hidden/visible cases, RNG cục bộ có seed và negative control
  thật sự bị oracle bắt.

## Kiểm chứng

- `npm run gen:lesson-index`: 397 bài, 170 unit.
- Test schema/curriculum/lazy/SRS/markdown/stage: xanh; test Algo S1 chuyên biệt 3/3.
- `lessonsPython.test.ts`: 640/640 code Python chạy thật.
- `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`: xanh.
- Playwright Chromium `e2e/programming-path.spec.ts`: 1/1 xanh sau khi cài browser đúng phiên bản.
- `npm test`: 13.315 pass, 7 fail nền (5 ca `report-status.sh` do đường dẫn WSL/Windows và 2
  timeout khi full-suite tải cao); chạy riêng hai file timeout: 53/53 xanh. CI Linux là cổng merge
  cuối cùng cho các lỗi môi trường này.

## Phạm vi

- Không sửa API, migration, tiến độ người học, quiz hoặc rubric 80 bài hiện có.
- `algo-s2` và artifact nghiệm thu cuối chặng vẫn là lát cắt sau.
