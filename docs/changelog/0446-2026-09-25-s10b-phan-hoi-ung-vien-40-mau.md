# S10b — phản hồi ứng viên nguyên văn cho 40 mẫu S10 (chưa chấm)

- **Ngày:** 2026-09-25 · **PR:** PR source của nhánh `seeker/gifted-johnson-2qrl9y` (sau #1171)
- **Loại:** `feat(pedagogy)`, chỉ thêm công cụ và dữ liệu cho chuyên gia; chữ hiển thị không đổi.
- **Spec:** `docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md` §3.1 (Approved #1170)

## Vấn đề

Phiếu review S10 bắt buộc có "phản hồi ứng viên nguyên văn". Bộ 40 ca (`rubric-40.json`, #1123)
chưa có phản hồi ứng viên nào, nên chuyên gia chưa có gì để chấm.

## Đã làm

- **`apps/dhcb/src/lib/feedbackCopy.ts` (mới)** là nguồn chung cho chữ phản hồi:
  - STEM tự kiểm: "Đúng rồi." / "Chưa đúng." và dòng "Trả lời đủ N câu…".
  - Predict, Parsons.
  - Câu tổng kết `ActivityResult` (`cauTongKetKetQua`), chuyển từ component sang.

  `StemLessonView`, `PredictStep`, `ParsonsStep` và `ActivityResult` đọc từ đây. Chữ hiển thị
  không đổi một ký tự: 1.176 unit test component và 48 ca E2E lập trình/STEM vẫn xanh.
  `ActivityResult` xuất lại hai kiểu trạng thái, nên mọi chỗ import cũ giữ nguyên.

- **`scripts/lib/s10CandidateFeedback.ts` + `scripts/s10-candidate-feedback.ts`** sinh
  `docs/ux-upgrade/s09-s12/candidate-feedback.json`, cách dựng theo từng nhóm:
  - STEM: chấm bằng `gradeAnswer` theo đáp án thật của bài, rồi ghép với `explain`.
  - Predict: khớp input với lựa chọn thật.
  - Parsons: dùng chữ cố định.
  - Lỗi hệ thống: dùng `cauTongKetKetQua` theo trạng thái.
  - Ca không có đường phản hồi thì ghi `pathKind` kèm lý do, không bịa chữ.

  Kết quả theo đường:

  | Đường                | Số ca | Ghi chú         |
  | -------------------- | ----: | --------------- |
  | `APP_FEEDBACK`       |    19 |                 |
  | `BLOCKED_UNANSWERED` |     4 |                 |
  | `NEEDS_PROVIDER_RUN` |    12 | English, cần AI |
  | `NO_APP_GRADER`      |     4 |                 |
  | `SYNTHETIC`          |     1 |                 |

  Nguồn lạ trong rubric thì script ném lỗi, không bỏ qua im lặng. Có chế độ `--check`.

- **Cổng `scripts/s10-candidate-feedback.test.ts`** (7 ca):
  - Bộ mẫu toàn vẹn: 12/16/8/4, id duy nhất, ca WAITING không mang điểm hay người duyệt.
  - Bản đã commit phải khớp mã nguồn hiện tại.
  - Có negative control cho điểm giả, thiếu ca và `feedbackText` sửa tay.
- **`agent-screening-s10b.md`** là bản sàng lọc có nhãn "không phải review chuyên gia". Năm nghi
  vấn gửi chuyên gia:
  - Parsons luôn nhắc if/elif/else.
  - Ca ngộ nhận không được xét phần giải thích tự do.
  - Mỗi câu chỉ có một lời giải chung cho mọi lựa chọn.
  - R13 đúng mà phản hồi mở đầu bằng "Lỗi thứ nhất".
  - Ca hệ thống cần chuyên gia xác nhận trục "Trung thực".

## Không làm

- Không chấm, không đổi `status`, `scores` hay `reviewer`.
- Không sửa chữ phản hồi hay nội dung bài; việc đó làm sau khi chuyên gia kết luận.
- Không chạy provider AI trả phí cho 12 ca English.

## Bằng chứng

- `npx tsx scripts/s10-candidate-feedback.ts --check` → khớp 40 ca.
- Unit S10b 7/7; unit component 1.176/1.176; E2E lập trình/STEM 48/48.
- Cổng đầy đủ ghi ở mục Validation của PR.

## Còn lại (WAITING)

- Chuyên gia chấm 22 ca đang chấm được.
- Quyết định cho English: chạy provider hay viết mẫu tay.
- Quyết định cho 4 ca `NO_APP_GRADER`.
