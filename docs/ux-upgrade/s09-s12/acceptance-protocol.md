# S12 — Protocol nghiệm thu v1

Trạng thái: **READY_FOR_REVIEW / chưa thực hiện**. Không có người tham gia, điểm học,
review chuyên gia, ảnh app hoặc kết quả audit được suy diễn từ bộ chuẩn bị này.

## Điều kiện bắt đầu

S01–S11 đã tích hợp ở SHA xác định; spec đã Approved và merge; hoàn tất audit kỹ thuật;
chủ sản phẩm xác nhận môi trường và người điều phối. Pilot chỉ tuyển người lớn tự
nguyện, tối thiểu 8 người, gồm người mới, quay lại và người dùng công nghệ hỗ trợ.
Không gọi provider trả phí hoặc dùng production trong bài kiểm tự động; dùng mock
trung thực ở boundary. Chưa đủ điều kiện ghi WAITING và ghi rõ điều kiện còn thiếu.

## Phiếu audit kỹ thuật

Mỗi lần chạy ghi SHA, branch, ngày giờ, Node 22, hệ điều hành, trình duyệt/thiết bị,
fixture, lệnh đầy đủ, exit code, đường log/ảnh và người chạy. Không điền số cũ.

| Gate                     | Kết quả       | Evidence |
| ------------------------ | ------------- | -------- |
| build                    | Chưa chạy     | —        |
| typecheck                | Chưa chạy     | —        |
| lint                     | Chưa chạy     | —        |
| format:check             | Chưa chạy     | —        |
| npm test                 | Chưa chạy     | —        |
| test:e2e                 | Chưa chạy     | —        |
| size nếu bundle thay đổi | Chưa xác định | —        |

Ma trận luồng bắt buộc: onboarding/placement; English hai chiều × hai chế độ
luyện/đánh giá; bốn môn STEM; lập trình; nói/viết với provider mock. Mỗi dòng luồng ghi
rỗng/tải/dữ liệu/lỗi/phản hồi; 320/390/768/1440; ba theme; zoom 200%; keyboard;
reduced motion; NVDA/VoiceOver; thiết bị thật. Ô không thử ghi “chưa chạy”; N/A cần
lý do cụ thể. Emulation không ghi thành thiết bị thật. Review ảnh 390/1440 trước/sau
cùng fixture. Contrast incomplete phải kiểm thủ công; 0 lỗi A/AA, chữ đọc ≥7:1.

Phiếu lỗi dùng đúng bốn ô: **Lỗi** (luật/AC), **Ở đâu** (route + file:dòng/ảnh),
**Mức** (critical/major/minor), **Sửa** (một hành động). Mất bài, giả lưu, sai môn,
sai kiến thức hoặc a11y chặn học đều dừng mở rộng; sửa và chạy lại ca bị ảnh hưởng.

## Tuyển và quyền dữ liệu

Trước tuyển, chốt người chịu trách nhiệm dữ liệu, vị trí lưu được phép, ngày xóa,
và cách yêu cầu xóa. Không thu tên thật vào bảng kết quả; dùng P01–P08. Việc liên hệ
để đo ngày 7/14 phải có đồng ý riêng và bảng liên hệ tách khỏi kết quả. Không ghi âm/
quay màn hình nếu chưa đồng ý; từ chối ghi hình không làm mất quyền tham gia. Có thể
rút lui bất cứ lúc nào; báo dữ liệu thiếu, không thay bằng điểm giả. Chỉ tổng hợp dữ
liệu cần thiết; không thu thông tin thanh toán, tài khoản hay nhạy cảm ngoài nhiệm vụ.

## Năm phiếu nhiệm vụ (khóa trước phiên)

Người điều phối đọc câu nhiệm vụ, không chỉ vị trí nút hoặc làm mẫu trước. Đồng hồ
bắt đầu sau khi đọc và người tham gia xác nhận sẵn sàng; kết thúc lúc đạt điều kiện
hoặc bỏ cuộc. Ghi mọi trợ giúp, lỗi, đường vòng. Thời gian là dữ liệu quan sát, chưa
đặt ngưỡng tốc độ khi chưa có baseline.

| Task | Câu giao cho người tham gia                 | Đạt độc lập khi                                           | Điều kiện không đạt                                 |
| ---- | ------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------- |
| T1   | Mở bài được ghi trên phiếu của bạn          | Đúng môn và content id, tự tới bài                        | Sai môn/bài, cần chỉ nút, bỏ cuộc                   |
| T2   | Đọc câu hỏi và thử trả lời                  | Tự tìm câu, nhập, nộp và đọc trạng thái                   | Không nộp được/nhầm đã lưu/cần làm hộ               |
| T3   | Giải thích lại vì sao câu trả lời cần sửa   | Nêu đúng nguyên nhân theo key chuyên gia, bằng lời riêng  | Chép đáp án nhưng không giải thích, nguyên nhân sai |
| T4   | Tìm một mục ôn của môn trên phiếu           | Mở đúng hàng đợi/môn, giữ nội dung gốc                    | Lạc môn/cần chỉ đường                               |
| T5   | Mạng bị ngắt khi lưu; hãy tìm cách tiếp tục | Nhận biết chưa lưu server, bảo toàn bài, phục hồi theo UI | Mất bài, tin giả đã lưu, cần điều phối thao tác hộ  |

Fixture dùng `fixtures.json` và key T3 được chuyên gia khóa riêng. T5 dùng fault
injection có kiểm soát ở môi trường thử, không cắt hệ thống production. Mỗi task có
reset state đã mô tả để người sau không thấy lời giải người trước. Người điều phối
đánh dấu hoàn tất có hỗ trợ riêng, không tính vào hoàn tất độc lập.

## Phiếu quan sát trống

| Mã người   | Nhóm | Task | Fixture | Bắt đầu/kết thúc | Độc lập/có hỗ trợ/thất bại/bỏ cuộc | Lỗi | Trợ giúp | Evidence |
| ---------- | ---- | ---- | ------- | ---------------- | ---------------------------------- | --- | -------- | -------- |
| Chưa tuyển | —    | —    | —       | —                | —                                  | —   | —        | —        |

Với 8 người: cần ít nhất 36/40 task hoàn tất độc lập, không mất bài và không xác nhận
lưu sai. Nếu mẫu lớn hơn, báo tử/mẫu và tỷ lệ ≥90%; giữ mọi lượt thất bại trong mẫu.
Đạt khả dụng không đồng nghĩa đạt hiệu quả học.

## Đo học trì hoãn

Chuyên gia soạn/duyệt các form tương đương cùng mục tiêu, mức khó, khác đáp án bề mặt;
khóa phiên bản và quy tắc chấm trước phiên. Đo trước, sau, ngày 7 và ngày 14. Ghi cửa
sổ thực tế nếu trễ, không đổi ngày đo để làm đẹp. Dữ liệu thiếu là null, có lý do nếu
người tham gia tự nguyện cung cấp; báo số người còn lại từng mốc. Chưa có baseline nên
chưa đặt KPI tăng điểm. Không suy ra nhân quả từ pilot nhỏ không có nhóm đối chứng.

## Mẫu báo cáo cuối (chưa có số liệu)

- SHA/môi trường/phiên bản protocol và key: chưa có.
- Số người đồng ý/bắt đầu/còn lại ngày 7/ngày 14: chưa có.
- Hoàn tất độc lập: chưa có tử/mẫu; hoàn tất có hỗ trợ và bỏ cuộc: chưa có.
- Mất bài/xác nhận lưu sai: chưa đo, không ghi 0.
- Hiểu phản hồi (T3): chưa đo; rubric chuyên gia: chờ reviewer.
- Điểm trước/sau/ngày 7/ngày 14: chưa đo; thiếu dữ liệu: chưa xác định.
- Lỗi theo mức và sửa/kiểm lại: chưa có lượt audit.
- Giới hạn: mẫu nhỏ, không đối chứng; phân biệt khả dụng/hiểu phản hồi/kết quả học.
- Kết luận: WAITING; chủ sản phẩm ký nghiệm thu khi evidence đã lên main.
