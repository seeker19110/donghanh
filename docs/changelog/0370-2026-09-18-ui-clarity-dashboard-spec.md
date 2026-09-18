# 0370 — 2026-09-18 — Đặc tả clarity-first cho trang Tiến độ UX-R3

## Kết quả

- Soạn và duyệt hợp đồng quality-first cho toàn UX-R3 trên base `main@5d81c6c8`; trạng thái
  **Approved for implementation** theo bốn source slice tuần tự sau khi PR docs này merge.
- Khóa phương án A người dùng đã chọn: không tạo `ProgressStory` độc lập; P2-10 được supersede và
  narrative deterministic tối đa một câu được gộp vào vùng “Tuần này”.
- Chia source thành bốn PR tuần tự: R3-1 async truth/retry (gồm rejected loader cache), R3-2
  responsive state/focus/calendar, R3-3 hierarchy + weekly consolidation, R3-4 English progressive
  disclosure. Các slice không chạy song song vì cùng chạm `Dashboard.tsx`.
- Chốt keyed state chống stale response, một cây DOM/QuickActions/calendar ổn định qua breakpoint,
  component boundaries, touch sets, rollback và escalation conditions.
- Chốt baseline/target page height: 320 **3.722→≤2.300px**, 390 **3.527→≤2.100px**, 1440
  **2.195→≤1.450px**; CLS từng state `<0,1`, không overflow, AAA nội dung/AA control.
- Chốt 28 evidence cases trên ba theme gồm loaded/collapsed, English expanded, hai dạng weekly
  unavailable, CEFR delayed/error recovery khi English đang mở, programming-only và live resize
  1024/1280 với ngày calendar rời range.
- Sau adversarial review vòng 1, đã sửa sáu finding: touch đủ ba resource loader + outer cache,
  `response.ok`/identity guard/fake-fetch; Zod và semantics quota null/0; scope English cho “Tuần
  này”; focus Retry có điều kiện; calendar đóng mặc định mọi width với explicit state sống resize;
  R3-3 dùng presentation `embedded` không card/heading lồng.
- Review vòng 2 còn 0 critical · 2 major; spec đã khóa recovery target theo panel mở/đóng và cấm
  focus steal, đồng thời yêu cầu promise recovery chờ ≥600ms monotonic sau input, chụp đủ reserve/
  error/ready và flush `PerformanceObserver.takeRecords()`. Review vòng 3 **PASS 0 critical · 0
  major · 0 minor**.

## Phạm vi

Docs-only: thêm spec UX-R3 và reconcile goal. Không source, test runtime, API, schema, migration,
dependency, generated artifact hoặc production. Bốn source slice chỉ được bắt đầu sau khi spec
được review, đánh dấu Approved và merge vào `main`.

## Validation

- `npx prettier --check` cho ba tài liệu thay đổi.
- `git diff --check`.
- Không chạy runtime test vì PR này chỉ thay Markdown; không tái sử dụng test count từ PR trước.

## Rủi ro còn lại

- Layout grid một DOM, disclosure Tiếng Anh/calendar và async boundaries đã qua independent
  adversarial review; runtime vẫn phải chứng minh từng contract theo bốn source PR.
- Loader cache nằm bốn tầng; thiếu reset ở chỉ một tầng sẽ làm Retry giả. Ma trận unit + integration
  fake-fetch từng tài nguyên là release gate của R3-1.
- Target chiều cao không được dùng để nới 44px/AAA/AA; nếu xung đột, trả spec về review thay vì ẩn
  lỗi hoặc giảm khả năng tiếp cận.
