# S07a — Khôi phục quyền phóng to cho người học

Ngày 2026-09-23. Bỏ khóa zoom trong viewport và cho phép pinch qua `touch-action: manipulation`; giữ font input cảm ứng ≥16px. Gỡ miễn trừ meta-viewport khỏi 15 bộ kiểm thử accessibility hiện hữu.

Bốn kiểm thử cấu hình zoom/reflow và negative control đạt trên Chromium Windows, ba theme và bốn bề rộng. Chưa chứng minh pinch trên thiết bị thật hoặc toàn bộ S07. Full build local gặp lỗi thiếu bộ nhớ; cần CI đầy đủ trước tích hợp.

Xem [bằng chứng và giới hạn](../research/2026-09-23-s07a-zoom-evidence.md). Không migration; revert slice khi cần, ghi F3 mở lại thay vì thêm miễn trừ cho gate.
