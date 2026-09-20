# 0391 — 2026-09-21 — Sửa `chapterTitle` sai ở ly10c3, thêm cổng gác, đổi nhãn "Unit"→"Chương" môn Lập trình

## Việc đã làm

Theo yêu cầu người dùng ("rà mục lục bài học tất cả môn trừ tiếng Anh, lên kế hoạch sửa cho
đúng"). Khảo sát bằng script đối chiếu `chapterNumber`↔`chapterTitle` và `lessonNumber` liên
tiếp trên toàn bộ `packages/subject-{physics,chemistry,biology,math}/lessons/*.ts` — chỉ tìm
thấy đúng một lỗi thật, các nghi vấn khác (nhảy số chương HSG lên 20, Toán reset `lessonNumber`
mỗi chương còn Lý đánh liên tục) đều là quy ước có chủ đích, không phải lỗi.

1. **[NGHIÊM TRỌNG] `packages/subject-physics/lessons/ly10c3.ts`** — Chương 3 đúng tên là
   "Động lực học" (7/10 bài ghi đúng), nhưng 3 bài (`ly10-c3-b19` dòng 1487, `ly10-c3-b21` dòng
   1799, `ly10-c3-b22` dòng 1873) bị copy-paste sót, còn giữ `chapterTitle: 'Động học'` (tên của
   Chương 2). Lỗi lộ thẳng ra UI học sinh ở `StemLessonView.tsx:447`. Đã sửa cả 3 dòng.
2. **Thêm cổng gác chặn CI** cho cả 4 gói STEM (`lessons.test.ts` của physics/chemistry/
   biology/math): mỗi cặp `(grade, chapterNumber)` chỉ được có đúng một `chapterTitle` — lỗi
   kiểu (1) không bị bất kỳ schema/type nào bắt (chapterTitle chỉ là string tự do), giờ có test
   riêng canh, giống bài học ở TRAPS.md.
3. **Chuẩn hoá** `packages/subject-math/lessons/toan10c5.ts`: bỏ biến trung gian `CHUONG`, dùng
   chuỗi `chapterTitle` trực tiếp như mọi file khác trong gói — để grep/audit hàng loạt không bị
   sót do khác style.
4. **Đổi nhãn hiển thị môn Lập trình**: "Unit N" → "Chương N" trên `ProgrammingLevelPage.tsx` và
   `ProgrammingPathStagePage.tsx` (theo yêu cầu bổ sung giữa phiên). Khảo sát trước khi sửa xác
   nhận Unit/Lesson hiện có đã đóng đúng vai trò Chương/Bài (191 unit, 509 bài, tiến độ lưu theo
   `lesson_id` trong `programming.lesson_progress`) — **không đổi** schema/id/route/migration,
   chỉ đổi chuỗi hiển thị. Người dùng đã xác nhận chọn phương án này thay vì thêm hẳn một tầng
   "Chương" mới gộp nhiều unit (phương án nặng hơn, không chọn).

## Issue / outcome

Trước: học sinh học Vật lí 10 thấy 3/10 bài Chương 3 bị ghi nhầm tên "Động học"; môn Lập trình
gọi đơn vị nội dung là "Unit" trong khi 4 môn STEM gọi là "Chương" — không nhất quán thuật ngữ
giữa các môn. Sau: tên chương đúng 10/10 bài, có cổng CI chặn tái diễn; môn Lập trình dùng
"Chương" thống nhất với STEM.

## Research / spec

Không có đặc tả trước — phát sinh từ yêu cầu trực tiếp trong phiên (rà soát + sửa lỗi), dùng
`fix` cho commit đúng tinh thần mục 11 CLAUDE.md (không phải tính năng mới).

## Validation

`npm run typecheck` 0 lỗi (4 tsconfig) · `npm run lint` 0 cảnh báo (`--max-warnings 0`) ·
`npm run format` sạch · `npm run build` (client + server + hub) xanh · `npm test`
(`vitest run`) — 691 file / 14772 test xanh, **1 file (`completionSandboxServer.test.ts`, 5
test) đỏ** — xác nhận bằng baseline (`git stash` rồi chạy lại đúng file đó trên `main` gốc chưa
sửa gì) cũng đỏ y hệt (4/5 test cùng lỗi) → nợ kỹ thuật có sẵn (môi trường sandbox chấm bài
Python/socket trên Windows), không liên quan thay đổi này. Test 4 gói STEM + toàn bộ trang môn
Lập trình đã sửa: chạy riêng, xanh 100%.

## Rủi ro, rollout và rollback

Rủi ro thấp: 3 dòng sửa `chapterTitle` chỉ đổi text hiển thị (không đổi `id`/schema/tiến độ đã
lưu); đổi nhãn "Unit"→"Chương" chỉ đổi chuỗi JSX, không đổi route/`unitId`/DB. Không có test nào
canh chuỗi "Unit " nguyên văn (đã kiểm bằng grep) nên không phá test hiện có. Rollback: revert 1
commit, không có migration.

**Lưu ý cho reviewer:** commit này dùng `--no-verify` vì hook pre-commit-gate chặn ở bước test
toàn bộ do `completionSandboxServer.test.ts` đỏ sẵn trên `main` (không liên quan PR) — người
dùng đã xác nhận cho phép bỏ qua sau khi xem bằng chứng baseline.

## Definition of Done

- [x] 3 dòng `chapterTitle` sai ở `ly10c3.ts` đã sửa, khớp 10/10 bài trong Chương 3
- [x] Cổng gác `chapterTitle` nhất quán theo `chapterNumber` cho cả 4 môn STEM
- [x] `toan10c5.ts` chuẩn hoá cùng style với các file khác trong gói
- [x] Nhãn "Unit"→"Chương" môn Lập trình, không đổi schema/tiến độ đã lưu
- [x] typecheck/lint/format/build/test xanh (trừ 1 file nợ kỹ thuật có sẵn, đã xác nhận baseline)
