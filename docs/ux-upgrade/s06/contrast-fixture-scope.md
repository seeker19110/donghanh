# Phạm vi mẫu tương phản danh sách bài học

Ngày 2026-09-23. `/bai-hoc` tải metadata thật của 350 bài và dựng thêm 10 bài mỗi
lần sentinel vào vùng nhìn. Phép đo bổ sung phải cuộn tới chữ bị scrollport che;
cuộn đó cũng kích hoạt tải thêm. Probe có giới hạn 90 giây kết thúc sau 52,7 giây
với đúng một lỗi chưa kết luận: trang tiếp tục đổi sau lần quét toàn trang mới.
Không đổi timeout 30 giây của gate hoặc tăng vòng quét vô hạn để bỏ qua lỗi này.

Raw probe cho thấy lần đầu đo lại 12 đích ở bài 7–10, lần tiếp theo đo 36 đích,
trong đó bài 20 kích hoạt trang dữ liệu tiếp. Kết quả này không phải bằng chứng
trang đạt tương phản. Log và raw report cục bộ nằm ở
`C:/Users/liend/.codex/uiux-implementation/artifacts/s06-list-timing.log` và
`s06-list-timing-report/` trong cùng thư mục artifacts.

Cổng AAA của route này nay định nghĩa một trạng thái hữu hạn: 10 metadata đầu
nguyên bản từ file dữ liệu giao cùng ứng dụng. Helper đọc qua Zod toàn bộ các
trường, kiểm ID duy nhất và kiểm đủ mọi palette hiện có của `COLORS/getColor`.
Nếu palette thay đổi khiến mẫu không còn phủ đủ, setup phải thất bại. Không đổi
source phân trang, không chặn IntersectionObserver, không ẩn chữ hoặc giảm ngưỡng.

Bằng chứng tách rõ:

- Contrast: mẫu 10 bài thật, đủ 10 palette, mọi tiêu đề/số/tình huống của trạng
  thái này vẫn đi qua cổng và đo bổ sung; không tuyên bố quét cả 350 bản ghi.
- `lesson-list-visibility.spec.ts`: dùng index thật, kiểm tải thêm, ID duy nhất và
  tình huống không bị cắt ở 390/1440 px.
- Negative control: khi cuộn phát sinh chữ tương phản thấp ngoài đích đang đo,
  snapshot toàn trang mới phải phát hiện chữ đó. Nếu DOM tiếp tục đổi ngoài giới
  hạn đo, kết quả vẫn chưa kết luận; không mặc định đạt.

# Chữ đại diện thành viên Đi chung

Avatar người tắt chia sẻ trước đây giảm opacity xuống 0,4 và dùng màu định danh
cho chữ; cổng đo được tỷ lệ 1,44–2,04. Giữ viền nét đứt/màu định danh và nhãn
“đang tắt chia sẻ”, đổi chữ sang token `text-zinc-100` không làm mờ. Không đổi
quyền vị trí, chia sẻ hoặc dữ liệu thành viên. Ba theme đã qua targeted AAA ở lượt
36 ca trên base `6f8054ff`; không dùng kết quả này để kết luận toàn bộ PR đạt.

ESLint/Prettier file MemberList đạt. Đã chụp trước/sau 390/1440 và review hình;
ảnh `member-{before,after}-{390,1440}.png` nằm trong thư mục công việc bên ngoài
repository. Codemap impact đã thử nhưng thiếu bộ nhớ Windows; kiểm consumers
bằng `rg` xác nhận MemberList được dùng ở LiveLocation. Không báo codemap đạt.
