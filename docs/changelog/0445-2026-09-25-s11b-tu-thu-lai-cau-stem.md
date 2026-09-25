# S11b — tự thử lại câu STEM sai: không lộ đáp án cũ, nút "Thử lại câu này"

- **Ngày:** 2026-09-25 · **PR:** PR source của nhánh `seeker/gifted-johnson-2qrl9y` (sau #1170)
- **Loại:** `fix(learning)`
- **Spec:** `docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md` §4.1 (Approved #1170)

## Lỗi

Trước bản sửa, người học mở câu sai từ Sổ lỗi (`#cau-N`) trên cùng máy thì thấy ngay lựa chọn
cũ, dòng "Chưa đúng." và toàn bộ lời giải. Không có lượt tự thử sạch nào, trái hợp đồng S11.
Ảnh "trước" của Tầng 8b cho thấy rõ lời giải hiện đầy đủ.

## Đã làm

- `lib/stemRetry.ts` (mới) là hợp đồng router state `{ tuThuLaiCau }` giữa Sổ lỗi và trang bài.
  State được validate bằng Zod vì history là dữ liệu ngoài. `#cau-N` giữ nguyên.
- Thay đổi ở `StemLessonView.tsx`:
  - **Chế độ tự thử:** chỉ bật khi có cờ và nháp còn đáp án cũ. Trang ẩn lựa chọn cũ và lời giải,
    hiện dòng "Đang tự thử lại — câu trả lời lần trước đang được ẩn" cùng nút "Xem câu trả lời lần
    trước". Nháp không bị xoá.
  - Trong lúc tự thử, câu đó được tính là chưa trả lời, nên không thể nộp lặng lẽ đáp án cũ mà
    người học đang không nhìn thấy.
  - Người học trả lời lại hoặc bấm xem lại thì trang thoát chế độ tự thử.
  - Cờ được chụp một lần lúc mở, gắn với mã bài, rồi xoá khỏi history (`replace`, giữ hash). Tải
    lại trang hay chuyển sang bài khác đều không bật lại chế độ này.
  - **"Thử lại câu này"** chỉ hiện ở câu đã chấm là sai. Nút nằm ngoài vùng `role="status"`. Bấm
    thì xoá đáp án và kết quả của riêng câu đó, rồi focus vào đề câu.
- `MistakeBank.tsx`:
  - Link STEM mang state tự thử.
  - Nhãn lỗi English trong danh sách "Tất cả" đổi thành "Ôn lại ở {màn}", không hứa đúng câu.
- Giữ nguyên: cách chấm, `attemptId`, hàng đợi pending, luật gỡ lỗi của `mistakesFromEvidence`,
  SRS, mastery và API.

## Điều chỉnh so với spec

Spec viết "Tải lại trang không có state". Thực tế `history.state` vẫn còn sau khi tải lại, nên
trang chủ động xoá cờ khỏi history để đạt đúng hành vi spec yêu cầu. Thêm một điều kiện: chỉ bật
chế độ tự thử khi thật sự có đáp án cũ để ẩn. Nếu không, mở trên máy khác sẽ hiện một dòng
hướng dẫn thừa.

## Bằng chứng

- Unit `StemLessonRetry.test.tsx` 7 ca và `stemRetry.test.ts` 3 ca. Negative control: tắt chế độ
  tự thử thì 2 ca đỏ.
- E2E `stem-self-retry.spec.ts` dùng server giả lập có trạng thái, chạy cả chuỗi: sai → Sổ lỗi →
  tự thử (đáp án cũ ẩn, nộp bị khoá) → xem lại → "Thử lại câu này" → đúng → nộp với `attemptId`
  mới → Sổ lỗi "Không còn câu nào sai". Có thêm ca tải lại trang và Back về Sổ lỗi.
- Cổng AA (`a11y.spec.ts`) và AAA (`a11y-aaa.spec.ts`) có thêm trạng thái tự thử × 3 theme; đều
  xanh.
- 231 ca E2E liên quan xanh: STEM, Sổ lỗi, ôn tập, learning-ux, s07-matrix.
- Coverage 17.143 test, build, typecheck, lint và format đều xanh.
- Tầng 8b: 6 cặp ảnh trước/sau (390/1440 × 3 theme), đã xem bằng mắt. Ảnh "trước" lộ lời giải,
  ảnh "sau" ẩn lời giải, có dòng hướng dẫn và nút xem lại. Không vỡ bố cục, không lặp nội dung.

## Còn lại

- English và Lập trình chưa có định danh câu, nên giữ nhãn trung thực và chưa quay về đúng câu.
- Các ô bàn phím, AT và thiết bị thật vẫn WAITING.
