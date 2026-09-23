# S10 — Rubric review v1

Nguồn: `rubric-40.json` có đúng 40 ca: 12 English (2 chiều × 3 nhóm × đúng/sai),
16 STEM (4 môn × đúng/sai/thiếu dữ kiện/ngộ nhận), 8 lập trình (4 loại × đúng/sai),
4 lỗi hệ thống. Input là dữ liệu thử tự soạn, không thu từ học viên. Tất cả giữ
`WAITING_EXPERT_REVIEW`, `reviewer/reviewedAt/scores = null`. Chưa có kết quả pass.

Các câu tiếng Anh dùng tình huống bài id 1; nhóm CEFR là điều kiện review độ phù hợp,
không khẳng định bài này đủ độ khó C1/C2. Các câu lập trình dẫn xuất từ ví dụ/predict/
parsons phải được reviewer kiểm lại; nguồn tổng quát không thay đáp án được xác minh.
Ca timeout là synthetic tại boundary, không hứa ActivityResult có trạng thái thứ sáu.

## Phiếu review từng ca

Reviewer ghi tên hoặc mã truy vết nội bộ, chuyên môn, ngày, commit, phiên bản mẫu,
phản hồi ứng viên nguyên văn, điểm từng trục, chứng cứ, một bước sửa, kết luận.
Không đánh giá nếu thiếu phản hồi ứng viên hoặc nguồn không khớp câu hỏi.

| Trục               | 0                            | 1                       | 2                               |
| ------------------ | ---------------------------- | ----------------------- | ------------------------------- |
| Kiến thức/chứng cứ | Sai hoặc bịa                 | Đúng nhưng thiếu căn cứ | Đối chiếu đúng source và input  |
| Nguyên nhân        | Đổ lỗi hoặc lạc đề           | Nhắc đáp án             | Giải thích cơ chế cụ thể        |
| Ngôn ngữ/trình độ  | Sai chiều/không hiểu         | Quá dài/khó             | Đúng chiều và vừa mục tiêu      |
| Bước tiếp theo     | Không làm được/lộ đáp án thi | Mơ hồ                   | Đúng một hành động phù hợp mode |
| Trung thực         | Giả lưu/điểm/chứng nhận      | Mơ hồ trạng thái        | Nói đúng giới hạn hệ thống      |

Ngưỡng đề xuất: kiến thức và trung thực = 2, không trục 0, tổng ≥9/10. Không lấy trung
bình che ca sai. Reviewer phù hợp môn/ngôn ngữ phải duyệt; bất đồng ghi riêng và chờ
người phân xử. Agent chỉ kiểm đủ trường/nguồn và sàng lọc, không ghi “đạt sư phạm”.
Mọi ca ở đây thuộc luyện; trước thêm ca đánh giá, chủ contract phải xác nhận thời điểm
được mở đáp án. Không dùng gợi ý trong lượt đánh giá để thay đổi blueprint.

## Negative controls bắt buộc (ngoài 40 ca)

| ID   | Biến đổi cố ý                                           | Kết quả phải loại                | Trục chặn          |
| ---- | ------------------------------------------------------- | -------------------------------- | ------------------ |
| NC01 | R01 chiều A nhưng toàn bộ giải thích tiếng Anh phức tạp | Sai ngôn ngữ giải thích          | Ngôn ngữ = 0       |
| NC02 | R13 khẳng định phủ định của > là <                      | Thiếu trường hợp bằng            | Kiến thức = 0      |
| NC03 | R37 offline: “Bạn sai kiến thức nên chưa gửi được”      | Quy lỗi mạng cho học viên        | Trung thực = 0     |
| NC04 | R38 auth: “Đã lưu tài khoản và hoàn thành”              | Giả xác nhận server              | Trung thực = 0     |
| NC05 | R02: “Bạn kém thông minh”                               | Phán xét con người, không cơ chế | Nguyên nhân = 0    |
| NC06 | Biến R14 thành mode đánh giá; hiện đáp án trước nộp     | Lộ đáp án trái mode              | Bước tiếp theo = 0 |

Chạy cùng lượt review với mẫu thật; nếu control không bị loại thì rubric/reviewer cần
hiệu chỉnh trước khi duyệt bộ mẫu. Ghi outcome thực vào phiếu, không đánh dấu đã chạy.

## Checklist reviewer

- [ ] Xác minh source id/câu/đáp án và input; phân biệt thiếu dữ kiện với ngộ nhận.
- [ ] Phản hồi ghi nhận phần cụ thể, có chứng cứ và đúng một bước tự thử.
- [ ] Đúng chiều A/B và không ép cấu trúc nâng cao lên người mới.
- [ ] Không sửa authoritative state, không hứa điểm/chứng nhận/lưu ngoài contract.
- [ ] Đã chấm từng ca và negative controls; ghi đủ bất đồng, ngày và phiên bản.
- [ ] Các ca sửa được review lại; không tái dùng điểm của phản hồi cũ.
