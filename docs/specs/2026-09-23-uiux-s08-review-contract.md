# S08 — Review hợp đồng phản hồi và focus của quiz

- Trạng thái: **Draft — đã rà mã, chờ duyệt triển khai**.
- Base được rà: `b0c424c0` (`main`, S06 đã tích hợp qua #1122).
- Phạm vi: bổ sung [đặc tả S06–S08](2026-09-23-uiux-s06-s08-accessibility.md), mục 4.
- Đây là review thiết kế bằng mã; chưa phải bằng chứng browser, NVDA hoặc VoiceOver.

## 1. Phát hiện và quyết định cần duyệt

| Lỗi                                                                                        | Ở đâu                                                                                                                       | Mức      | Sửa                                                                                                                      |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| Trạng thái lựa chọn chỉ có màu/animation, chưa có tên nhóm và trạng thái accessible        | `apps/dhcb/src/components/ExamQuestionCard.tsx`, khối đáp án; `apps/dhcb/src/components/studyTabs/QuizTab.tsx`, khối đáp án | critical | Nhóm đáp án dùng `role="group"` và `aria-labelledby`; button giữ tên đáp án, thêm `aria-pressed`, chữ phản hồi rõ nghĩa. |
| Không có đích focus sau chuyển câu/kết thúc                                                | Hai component trên và tiêu đề kết quả của ba caller ExamQuestionCard                                                        | critical | Component sở hữu câu lấy focus khi chuyển câu; caller sở hữu kết quả lấy focus khi kết thúc.                             |
| Phím Enter/Space toàn cửa sổ không loại nút tương tác khác hoặc modal; không bỏ key repeat | `packages/core-ui/useQuizKeyboard.ts`, `handle()`                                                                           | critical | Chốt ownership phím: input/modal và tương tác khác giữ phím gốc; một keydown chỉ tạo một hành động, bỏ repeat.           |
| Lời giải trong bảng kết quả bị truncate                                                    | `apps/dhcb/src/components/studyTabs/QuizTab.tsx`, nhánh done                                                                | major    | Cho câu và đáp án xuống dòng; chữ Đúng/Chưa đúng nhìn thấy được, icon trang trí aria-hidden.                             |
| Animation thiếu nhánh giảm chuyển động, transition-all                                     | Hai component quiz, class đáp án                                                                                            | major    | Dùng transition-colors, motion-reduce:animate-none; ring không transition.                                               |

3 critical · 2 major · 0 minor. Đây là phát hiện đọc mã, chưa đo độ tương phản hoặc tái hiện trình duyệt.

## 2. Hợp đồng triển khai cụ thể

### Đáp án và công bố kết quả

Cả ba caller hiện dùng ExamQuestionCard với phản hồi đáp án ngay khi `selected !== null`.
S08 giữ nguyên thời điểm đó; không thêm cơ chế chấm điểm hoặc đổi chính sách bài thi.
Nội dung audio không được lộ qua accessible name trước khi chọn. Tên nhóm cho câu nghe
là số câu và chỉ dẫn nghe, không lấy `audioText` hoặc đáp án đúng.

Sau chọn, các đáp án giữ khả năng nhận focus để đọc; `aria-disabled` biểu thị không
được đổi lựa chọn, và handler phải tự chặn thao tác. `aria-disabled` không tự ngăn click.
Không dùng native disabled khiến nút đang focus mất khỏi luồng bàn phím. Trước chọn,
không được để thông báo/nhãn ẩn chứa đáp án đúng. Sau chọn hiển thị “Đúng” hoặc
“Chưa đúng”, câu đã chọn và đáp án đúng khi chọn sai; không chỉ thêm sr-only.

### Thông báo và focus

| Sự kiện               | Chữ nhìn thấy                | Live region                                     | Focus                                                   |
| --------------------- | ---------------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| Vào quiz mới          | Câu hiện tại                 | Rỗng                                            | Giữ focus của điều hướng vào màn                        |
| Chọn đáp án           | Kết quả + lựa chọn           | Ghi đúng một lần từ sự kiện pick hợp lệ         | Giữ tại đáp án đang chọn; phím số đưa tới nút tương ứng |
| Rerender, đổi nhãn UI | Phản ánh trạng thái hiện tại | Không phát lại                                  | Không đổi                                               |
| Restore câu đã chọn   | Kết quả cũ vẫn hiện          | Rỗng                                            | Không tự nhảy                                           |
| Next                  | Câu kế                       | Xóa thông báo cũ, không đọc toàn câu qua status | Heading câu mới, tabIndex=-1, có số câu                 |
| Câu cuối              | Kết quả tổng                 | Không lặp toàn kết quả                          | Heading kết quả do caller sở hữu                        |
| Restart               | Câu 1                        | Rỗng                                            | Heading câu đầu                                         |

Tách state thông báo khỏi `selected` để restore không bị hiểu thành một lựa chọn mới.
Một status node ổn định, `aria-live="polite"` và `aria-atomic="true"`; không bọc danh
sách đáp án trong live region. Chỉ đổi nội dung theo sự kiện thực, không effect phát lại
trên mỗi render. Mount/focus của React StrictMode cần test không gây đọc lặp.

ExamQuestionCard không sở hữu màn kết quả nên không thể tự hoàn tất AC focus cuối bài.
Slice source phải gồm thay đổi nhỏ ở `CefrExam.tsx`, `ListeningTab.tsx`, `Placement.tsx`
hoặc tách follow-up được ghi rõ; chỉ sửa hai component chưa được tính S08 hoàn tất.
Phối hợp chủ nhánh Placement trước khi mở rộng exclusive write set.

### Ownership phím và dữ liệu

Giữ 1..n chọn đáp án. Enter/Space tại nút đáp án trước chọn dùng native activation;
sau chọn có thể tiếp tục theo shortcut hiện hữu. Tại nút nghe lại/thoát/modal thì
Enter/Space thuộc nút đó, không đồng thời chuyển câu. `event.repeat`, sự kiện đã
`defaultPrevented`, Ctrl/Alt/Meta và vùng nhập liệu không tạo thao tác quiz.

Guard tại handler `pick`/`next` là bắt buộc; không chỉ tin hook hoặc nút ẩn. Next khi
chưa chọn, đã done hoặc đã xử lý cùng bước phải không ghi `answers`, `reviewGrammar`
hoặc `bumpDailyQuizPasses` lần nữa. Giữ nguyên schema phiên và thuật toán chấm điểm.
Shared keyboard hook có nhiều consumer ngoài S08: review impact riêng trước sửa,
không áp ownership mới toàn hệ thống mà chỉ test hai component.

## 3. Ma trận nghiệm thu tối thiểu

- Fixture câu đúng/sai cố định cho ExamQuestionCard và QuizTab; UI Việt/Anh × ba theme.
- Mouse, native Enter/Space, phím số cho cùng kết quả; double-click/keydown repeat
  không ghi lặp; input và modal không bị quiz chiếm phím.
- Audio question không lộ audioText/đáp án trước chọn; nút nghe lại không chuyển câu.
- Next, câu cuối, Restart, restore selected/unselected, rerender và StrictMode:
  assert activeElement, số thao tác lưu/chấm, nội dung status và số lần thay đổi.
- Quét AA/AAA ở chưa chọn/đúng/sai/kết quả; đọc thực ≥7:1; nội dung dài không truncate
  ở 320/390/768/1440. Ảnh trước/sau 390/1440 bằng mock không gọi provider trả phí.
- NVDA và VoiceOver thật ghi OS/browser/AT, thứ tự thao tác và transcript; chưa có
  evidence này giữ WAITING, không thay bằng accessibility snapshot.

## 4. Kết luận review và bước tiếp

Hợp đồng trên đủ cụ thể để review và giao slice source. S08 vẫn **Draft**, chưa có
người/ngày duyệt và chưa có source hay test sản phẩm mới. Chỉ triển khai sau khi spec
được đánh dấu **Approved for implementation** bằng phê duyệt thật và merge.
Không có migration; rollback tài liệu bằng revert PR, không thay đổi trạng thái học viên.
