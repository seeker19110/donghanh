# S11a — Khôi phục đích câu hỏi từ sổ lỗi STEM

Ngày 2026-09-23; base `bdf4b838`. Sổ lỗi đã tạo URL `#cau-N` nhưng bài STEM chưa có
đích DOM tương ứng. Câu hỏi nay nhận id từ `neoCauHoi`; sau bài nạp lười hoặc hash
đổi, trang đưa focus và cuộn tức thì đến câu, chừa chỗ header. Hash thuộc `#cau-`
nhưng không có câu về tiêu đề cùng bài; hash khác giữ hành vi cũ.

Không đổi nháp/checked, chấm điểm, route builder, attempt hoặc evidence. Đây là sửa
lỗi deep-link hiện hữu, chưa hoàn thành S11 rộng, S09 hoặc pilot S12.

Kiểm thử và giới hạn được ghi tại [evidence S11a](../ux-upgrade/s11a/evidence.md).
E2E browser chưa xác minh do môi trường thiếu bộ nhớ; PR cần CI full gate và kiểm
ảnh/focus thực trước hoàn tất. Không migration; revert slice giữ nguyên dữ liệu.
