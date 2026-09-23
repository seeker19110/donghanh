# S02 — Lưu hồ sơ trung thực và xác nhận lại phiên

Onboarding và xếp lớp chỉ cập nhật cache, tốc độ học và điều hướng khi server trả
`{ ok: true }` hợp lệ. Lỗi HTTP/mạng/timeout giữ lựa chọn hoặc kết quả để người học
thử lại; gửi trùng bị khóa trong lúc pending.

Sau khi hồ sơ đã lưu, onboarding xác nhận lại đúng tài khoản và `onboarded` từ
server. Đọc phiên lỗi chỉ retry GET; không gửi POST/cập nhật cache lần nữa. Method
verified mới không diễn giải lỗi tạm thời thành đăng xuất; response cũ sau đổi tài
khoản hoặc unmount không được áp dụng. Giữ cơ chế cookie adoption của refresh cũ.

Kiểm tra local: 200/200 unit mục tiêu, 8/8 E2E, typecheck 4 cấu hình, lint các file
thay đổi, Prettier và diff-check đạt. Full CI đang chờ PR; không tuyên bố hoàn tất
S02. Chưa có bằng chứng PostgreSQL concurrency thật hoặc ma trận ảnh responsive/theme.

Không migration, không đổi server endpoint, mastery, billing hoặc usage. Rollback
bằng revert đồng bộ helper, hai caller, method auth và tests.

Chi tiết: [bằng chứng S02](../research/2026-09-23-s02-implementation-evidence.md).
