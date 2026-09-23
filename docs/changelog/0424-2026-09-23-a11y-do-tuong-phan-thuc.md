# S06 — Đo tương phản thực và sửa nội dung khó đọc

Ngày 2026-09-23. Cổng AAA trước đây bỏ sót một số chữ đọc trong span/nút và chưa
phân biệt đủ kết quả đo với trường hợp axe không kết luận được. Cổng mới giữ hợp
rule AA/AAA, kiểm chữ đọc ở 7:1 kể cả heading lớn, giữ raw evidence và chặn trường
hợp không đo được hoặc DOM thay đổi. Các fixture đối chứng bảo vệ quy tắc này.

Sửa màu chữ/nhãn, nút hành động và thẻ từ vựng theo từng lỗi thực; nhãn SVG dùng
halo có phép đo fill/stroke và kiểm điều kiện hiển thị. Đo lại chữ trong scrollport
chỉ kết luận khi cùng đích có bằng chứng ổn định và đủ tỷ lệ; không miễn trừ
incomplete, gradient hoặc ảnh theo tên component.

Kết quả kiểm tra và giới hạn hiện hành nằm trong
[evidence S06](../research/2026-09-23-s06-implementation-evidence.md).
Chưa coi toàn S06 hoặc chương trình S01–S12 hoàn tất. Không migration, không đổi
learner state/billing. Rollback source theo commit khi có hồi quy; giữ lỗi và bằng
chứng đo trong backlog, không giảm ngưỡng kiểm tra để vượt CI.
