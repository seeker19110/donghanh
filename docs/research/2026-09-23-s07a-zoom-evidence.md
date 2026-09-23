# S07a — Khôi phục quyền phóng to

- Base: `79835f46`; sửa lỗi F3 đã xác nhận trong audit, không thay thuật toán học.
- Gỡ `maximum-scale=1.0`/`user-scalable=no`; body dùng `touch-action: manipulation` để giữ pan và pinch zoom. Font input cảm ứng ≥16px giữ nguyên.
- Gỡ miễn trừ `meta-viewport` tại 15 spec E2E; không hạ ngưỡng hoặc bỏ kiểm thử.
- Codemap không lập bản đồ HTML/CSS; đã tìm toàn bộ viewport/touch-action và các cổng liên quan bằng `rg`.

## Bằng chứng hiện có

Node 22.23.2, Chromium Playwright trên Windows. `zoom-permission.spec.ts`: **4/4 đạt**, gồm ba theme ở 320/390/768/1440 và negative control khóa zoom phải bị axe bắt. Lượt đầu đo ngay sau resize thấy kích thước cũ; chuyển sang polling kích thước đã cập nhật, giữ ngưỡng tràn ngang ≤1px.

Ảnh trước/sau trang `/welcome` ở 390/1440 nằm trong thư mục artifact local `C:/Users/liend/.codex/uiux-implementation/zoom-{before,after}-{390,1440}.png`. Bố cục không đổi bởi meta/touch-action. Ảnh cũng cho thấy nợ tương phản sẵn có ở đoạn giới thiệu và theme trang chào; đây chưa phải bằng chứng toàn trang đạt AAA.

Full build local chưa đạt: Node hết bộ nhớ trong môi trường đang chạy nhiều browser suite. Chưa dùng lại kết quả commit trước, chưa tuyên bố full gate xanh.

## Phạm vi nghiệm thu còn mở

Viewport giả lập và axe chỉ chứng minh cấu hình cho phép zoom, không chứng minh gesture trên thiết bị thật. Pinch zoom, browser zoom 200%, bàn phím ảo, ma trận focus/44px đầy đủ của S07 vẫn chờ kiểm chứng. Không đánh dấu S07 hoàn tất.

Không migration. Rollback bằng revert slice nếu gặp hồi quy; phải ghi F3 mở lại, không thêm ngoại lệ mới cho gate.
