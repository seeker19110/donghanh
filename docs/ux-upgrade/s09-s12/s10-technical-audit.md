# S10 — Rà kỹ thuật bộ 40 ca trước review chuyên gia

Trạng thái: **chờ chuyên gia**, kiểm kỹ thuật trên `rubric-40.json` v1 tại
`55945d261916866c8dc83dccea67bbb2cc108963` (2026-09-23). Đây không phải điểm
rubric sư phạm, chứng nhận CEFR, kết quả người học hoặc quyền phát nội dung. Không có
phản hồi ứng viên để chấm; `reviewer`, `reviewedAt`, `scores` và `negativeControl` của
mọi ca vẫn `null` và `status` vẫn `WAITING_EXPERT_REVIEW`.

## Kết quả kiểm kỹ thuật

| Cổng               | Kết quả                                                                                                                     | Giới hạn                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Schema và ID       | 40 object; 40 ID khác nhau, liên tiếp R01–R40; đủ 14 trường như v1                                                          | Chưa có schema máy kiểm enum, phiên bản nguồn từng ca hay hash phản hồi ứng viên                     |
| Cân bằng số lượng  | English 12 = 2 chiều × 3 nhóm × 2; STEM 16 = 4 môn × 4; lập trình 8 = 4 cặp; hệ thống 4                                     | Đây là cân bằng ô, chưa phải cân bằng độ khó hay loại lỗi thực                                       |
| Nguồn              | Các path tồn tại; câu STEM đầu mỗi môn và English `id=1/turns/0` đối chiếu được; `p1u1.ts` có predict/parsons/workedExample | Nguồn lập trình gộp nhiều section, không chỉ tới câu/prompt và đáp án chính xác; R40 chủ ý synthetic |
| Review và riêng tư | 40/40 đang chờ; input tự soạn, không có định danh cá nhân thấy trong bộ mẫu                                                 | Chưa có phản hồi ứng viên, danh tính/vai trò chuyên gia, bất đồng, ngày hay kết quả negative control |
| Mode               | 40/40 là `practice`; NC06 mô tả ca `assessment` giả định                                                                    | Chưa kiểm một caller đánh giá thật, thời điểm mở đáp án hay chính sách gợi ý trong lượt thi          |

Đã sửa một mâu thuẫn tất định: R29 có `print("Xin chao")` đủ ngoặc nhưng bản v1
nói thiếu dấu đóng ngoặc. R30 mới là ca thiếu ngoặc. Chỉnh `expectedReason` R29
không làm ca này được duyệt.

## Danh sách cần giải quyết trước khi duyệt/phát

| ID      | Vấn đề chính xác                                                                                                                                                                                                                                                                                                                                                                                                                          | Người cần chốt                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| R01–R12 | Cả 12 ca đều dựa trên **một** turn của bài English `id=1`. Mỗi chiều chỉ có một input đúng và một input sai, lặp ở cả ba nhóm A1–A2/B1–B2/C1–C2; chỉ có **4 tổ hợp source/input/reason/language khác nhau**. Chưa thử khác biệt độ dài, cơ chế hoặc sắc thái phản hồi giữa trình độ.                                                                                                                                                      | Chuyên gia ngôn ngữ chọn bài/câu đúng mức; chủ contract xác nhận chiều B và ngôn ngữ giải thích. |
| R01–R12 | Turn gốc có thêm lời chào và câu về phòng họp; prompt mẫu chỉ lấy vế hỏi chỗ ngồi. Cần ghi rõ đây là mục tiêu trích đoạn hay thay bằng task thật, để không chấm cả turn bằng một vế.                                                                                                                                                                                                                                                      | Chủ nội dung English.                                                                            |
| R13–R28 | Đúng/sai/thiếu dữ kiện/ngộ nhận đều dùng một câu trắc nghiệm mỗi môn. R16/R20/R24/R28 thêm “giải thích rằng hai khái niệm giống nhau” vào input lựa chọn, nhưng câu nguồn là choice; chưa chỉ ra UI/API nào thu lời giải thích tự do. Với Toán, lỗi của lựa chọn `b` là bỏ dấu bằng, trong khi lời giải thích mẫu “hai khái niệm giống nhau” không thể hiện lỗi đó. Các ca ngộ nhận cần input thực hoặc ghi rõ synthetic ở tầng phản hồi. | Chủ caller STEM và chuyên gia từng môn.                                                          |
| R29–R30 | Tác vụ “Tạo lệnh in Xin chao” không phải prompt `predict` hay `workedExample` thực trong `p1u1.ts`. Input R29 đúng cú pháp và expectedReason đã sửa; cần định danh task nguồn thật hoặc ghi synthetic, rồi chuyên gia xác nhận nội dung.                                                                                                                                                                                                  | Chủ nội dung lập trình.                                                                          |
| R31–R32 | Câu predict có thật, nhưng input đang là chuỗi kết quả; nguồn là MCQ với `answerIndex: 0`. Cần xác nhận tầng feedback nhận nhãn hay index, tránh kiểm một loại input mà caller không nhận.                                                                                                                                                                                                                                                | Chủ caller lập trình.                                                                            |
| R33–R34 | Prompt Parsons có thật, nhưng input “lớp → lời chào → môn” là diễn giải, không phải ba dòng code/ID theo contract Parsons; xác minh thứ tự và cách serialize câu trả lời.                                                                                                                                                                                                                                                                 | Chủ caller lập trình.                                                                            |
| R35–R36 | “Dự đoán số dòng cho hai lệnh print” suy ra từ workedExample, không có câu hỏi tương ứng trong bài. Cần nguồn câu cụ thể hoặc nhãn synthetic; không coi là case production.                                                                                                                                                                                                                                                               | Chủ nội dung lập trình.                                                                          |
| R37–R39 | `ActivityResult` có pending/offline, pending/auth và error/server nhưng input chung không định danh attempt/status/reason. R38 “không mất bản giữ lại” chỉ đúng khi cơ chế pending thực sự giữ được bản; cần test caller, mất mạng/hết phiên/retry, không suy ra bảo đảm từ component text.                                                                                                                                               | Chủ evidence/caller.                                                                             |
| R40     | Provider timeout là synthetic; không có `ActivityResult` status thứ sáu. Chỉ đối chiếu boundary có thật sau khi chốt caller; không dùng làm coverage production.                                                                                                                                                                                                                                                                          | Chủ provider boundary, không gọi provider thật.                                                  |
| Tất cả  | Chưa có phản hồi ứng viên nguyên văn, source revision từng ca, điểm 5 trục hay negative control outcome. 40/40 ở mode luyện; chưa có mẫu đánh giá thật.                                                                                                                                                                                                                                                                                   | Chuyên gia và chủ contract assessment.                                                           |

## Phiếu bàn giao chuyên gia

Với **từng ID**, lưu: version bộ mẫu + SHA nguồn, câu hỏi/đáp án nguồn đã xác minh,
input đúng kiểu caller, mode và thời điểm được mở gợi ý, phản hồi ứng viên nguyên văn,
ngôn ngữ giải thích/chiều học, mục tiêu trình độ, tên/mã và chuyên môn reviewer, ngày,
điểm 0–2 ở cả năm trục, dẫn chứng cho mỗi trục, kết luận và người phân xử nếu bất đồng.
Đánh dấu ca synthetic rõ ràng; nếu sửa input, expectedReason hoặc phản hồi ứng viên,
chấm lại phiên bản mới. Không điền điểm vào bản v1 khi chưa có review thực.

1. Đối chiếu đáp án với bài/câu gốc và kiểm liệu phản hồi chỉ nói điều có chứng cứ.
2. Kiểm một bước thử tiếp cụ thể; đúng thì nêu cơ chế đúng, sai thì không phán xét người học.
3. Kiểm ngôn ngữ theo chiều A/B và độ khó thực của **nhiệm vụ**, không suy CEFR từ nhãn.
4. Với đánh giá, xác nhận blueprint và cấm lộ đáp án/gợi ý trước mốc cho phép; không suy từ mode luyện.
5. Với lỗi hệ thống, kiểm trạng thái lưu/điểm/attempt thật và đường phục hồi; không quy lỗi cho người học.
6. Chạy NC01–NC06 cùng lượt; ghi kết quả từng control. Bất kỳ control nguy hại nào không bị loại thì dừng duyệt và hiệu chỉnh rubric.
7. Chỉ đề xuất pass từng ca khi kiến thức và trung thực đều 2, không trục nào 0, tổng ≥9/10; chuyên gia xác nhận hoặc sửa ngưỡng nội bộ trong spec trước khi dùng.

**Kết luận kỹ thuật:** đạt kiểm đếm và cấu trúc tối thiểu sau sửa R29; chưa đạt điều kiện phát
bộ mẫu vì các vấn đề nguồn/caller, độ phủ năng lực và review chuyên gia ở trên. Giữ
`WAITING_EXPERT_REVIEW` cho toàn bộ 40 ca.
