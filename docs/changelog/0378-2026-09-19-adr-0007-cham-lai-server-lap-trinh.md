# 0378 — 2026-09-19 — ADR-0007: chấm lại bài Lập trình P1–P4 ở SERVER trước khi ghi "hoàn thành"

## Việc đã làm

- Chốt 4 quyết định còn mở của `docs/adr/0007-completion-evidence-sandbox-lap-trinh.md` (Accepted):
  1. Mức cách ly: Phương án B (tiến trình con), không chờ Docker/VM.
  2. Cô lập mạng: hai tầng — allowlist Python (bắt buộc) + `unshare --net` (best-effort, dò thật
     lúc chạy).
  3. Phạm vi chấm lại: CHỈ ở bước "Nộp bài"/"Đánh dấu hoàn thành", không phải mỗi lần "Chạy thử".
  4. Phạm vi ngôn ngữ: CHỈ P1–P4 (Python qua Pyodide) đợt này.
- Module mới `packages/subject-programming/completionSandboxServer.ts`: chạy lại code học viên
  bằng `python3` thật trong tiến trình con (dùng lại `grading.ts`/`pyLanes.ts` — đúng engine mà
  `lessonsPython.test.ts` đã dùng làm cổng nội dung), đọc test-case từ registry SERVER, có 3 lớp
  bảo vệ: allowlist chặn import module hệ thống/mạng (`os`/`sys`/`subprocess`/`socket`/…), user hệ
  thống riêng qua `PROGRAMMING_SANDBOX_USER` (best-effort — CHƯA cấu hình trên VPS, xem PROGRESS.md),
  `ulimit` (bộ nhớ ảo + số tiến trình) + timeout cứng 10s khớp client.
- `apps/server/src/api/subjects/programming/progress.ts`: bài xương sống P1–P4 (làn Python) báo
  `status:'completed'` giờ BẮT BUỘC kèm `code`; server chấm lại HẾT test-case trước khi ghi, từ
  chối 400 nếu thiếu code/chấm không đạt. Rate-limit **5 lần nộp sai liên tiếp/phút/bài**
  (bucket `programming-regrade-fail`) — lý do chọn 5: mỗi lượt chấm tốn tới 10s (timeout cứng)
  nên 5 lần/phút đã rộng hơn số lượt một người thật gõ tay kịp gửi trong cùng khung giờ, nhưng đủ
  thoáng để không chặn oan người đang sửa lỗi từng bước.
- Client: `saveLessonProgress` nhận thêm tham số `code` tuỳ chọn, `ProgrammingLessonPage.tsx` gửi
  kèm code Make khi báo hoàn thành; `syncOutbox.ts` (`ProgrammingItem`) mang `code` qua hàng đợi
  offline không đổi cơ chế gộp/replay.
- `PROGRESS.md`: đóng phần P1–P4 của dòng nợ "client tự khai hoàn thành", mở 2 dòng nợ HẸP mới
  đúng tinh thần ADR (cô lập mạng chưa xác nhận OS-level trên VPS thật; ngôn ngữ ngoài Python vẫn
  client tự khai).

## Issue / outcome

Trước PR này: DevTools/gọi thẳng API vẫn tự đánh dấu "đã hoàn thành" bài P1–P4 dù chưa giải đúng
— `checkLevelWriteAllowed` (PR #1033) chỉ kiểm khoá bậc, không kiểm code đúng/sai. Sau PR: mọi báo
cáo "hoàn thành" bài xương sống P1–P4 đều đi qua chấm lại thật bằng `python3` trên server.

## Research / spec

`docs/adr/0007-completion-evidence-sandbox-lap-trinh.md` (Accepted). Bằng chứng đọc code + tiền lệ
`execFileSync`+timeout đã ghi trong ADR.

## Validation

- `npx vitest run packages/subject-programming/completionSandboxServer.test.ts` — 6/6 xanh, dùng
  `python3` THẬT: code mẫu chính thức đạt, code sai không đạt, `import os`/`import socket` bị
  allowlist chặn (không đạt, không throw), vòng lặp vô hạn bị timeout đúng ngân sách thời gian.
- `npx vitest run apps/server/src/api/subjects/programming/progress.test.ts` — 23/23 xanh (mock
  module chấm lại để cô lập luật ROUTE khỏi việc chạy python3 thật; 4 test mới cho ADR-0007:
  thiếu code → 400, chấm không đạt → 400, chấm đạt → 200, bài ngoài phạm vi giữ hành vi cũ).
- `npx vitest run apps/dhcb/src/lib/syncOutbox.test.ts apps/dhcb/src/lib/programmingProgress.test.ts apps/dhcb/src/pages/subjects/programming/ProgrammingLessonPage.test.tsx apps/dhcb/src/lib/useProgrammingLesson.test.tsx` — 48/48 xanh.
- `npm run typecheck` · `npm run lint` · `npm run build:packages` — đều xanh.

## Rủi ro, rollout và rollback

- **Rủi ro:** thêm tải CPU server mỗi lượt nộp bài P1–P4 (đã có rate-limit riêng); cách ly mạng
  mới chỉ chắc ở tầng allowlist Python trên VPS hiện tại (ghi nợ, không giấu). Rollout đồng thời
  client+server (cùng repo/CI/CD) nên không có cửa sổ "client cũ gửi thiếu code" kéo dài — cửa sổ
  duy nhất là các mục ĐANG NẰM TRONG HÀNG ĐỢI OFFLINE từ trước lúc deploy (không có `code`), lần
  gửi đó sẽ bị 400 một lần, học viên làm lại bài (đã biết đáp án) là qua ngay — không mất dữ liệu,
  chỉ mất một lượt bấm.
- **Rollback:** revert PR này — quay lại "client tự khai" (chấp nhận lại nợ kỹ thuật cũ), không
  đổi schema DB nên rollback không cần migration ngược.

## Definition of Done

- [x] 4 quyết định ADR-0007 đã chốt và ghi lại trong chính file ADR (Accepted).
- [x] Server chấm lại thật bằng `python3`, có 3 lớp bảo vệ bắt buộc + rate-limit chống spam.
- [x] Test mới xanh thật (không giả định), test cũ không đổi hành vi ngoài phạm vi ADR.
- [x] `PROGRESS.md` cập nhật tại chỗ, 2 dòng nợ mới hẹp đúng phạm vi còn thiếu.
