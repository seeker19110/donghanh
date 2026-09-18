# 0366 — 2026-09-18 — Chốt nền clarity-first cho đợt tái thiết kế UI/UX

## Kết quả

- Đối chiếu `main@2c9025a6`: chuỗi redesign cũ đã merge 12/15 lát; cập nhật nghiệm thu lệnh
  10–12 theo PR #1018.
- Đo ảnh thật ngoài repo: Trang chủ thành viên cao 2.027px và `/tien-do` cao 3.421px ở viewport
  390px; đây là baseline tải nhận thức, không phải chỉ số chất lượng sản phẩm.
- Chủ dự án chọn phương án A: giữ đúng ba theme hiện hành `dark-blue`, `blue-sky`, `kid`; không
  phục hồi `pink`/`vibrant`.
- Thêm đặc tả `2026-09-18-ui-clarity-foundation.md`, duyệt **chỉ lát UX-R1**: sửa failure state,
  storage fallback và vùng chạm trên trang Tiến độ trước khi thay đổi bố cục lớn.
- Adversarial review lần đầu BLOCK 2 critical · 4 major · 2 minor; đã chốt cuộn nội bộ cho calendar
  44px, typed result/state machine Web Push, storage read/write, full E2E và budget gate.
- Re-review lần hai còn 3 major · 2 minor; đã chốt header thứ cuộn cùng ô ngày, `denied` không
  Retry, union kết quả push tường minh và bổ sung ảnh 320px.
- Re-review cuối: PASS, 0 critical · 0 major · 0 minor blocking.
- Đồng bộ tài liệu quản trị sang ba theme + mặc định Blue sky; không sửa token hay màu runtime.
- Hoãn P2-10 `ProgressStory`: thêm nội dung vào Home/Dashboard lúc này có thể làm nặng đúng màn
  người dùng phản hồi đang rối.

## Phạm vi và rủi ro

Đợt này chỉ thay tài liệu; không source, API, schema, migration, dependency, production config
hoặc ảnh PNG trong repo. UX-R2–UX-R4 chưa được duyệt source.

## Validation

- `npx prettier --check` cho các file Markdown thay đổi.
- `git diff --check`.

Kết quả: PASS trên Node 22.23.2; review độc lập PASS; không chạy runtime test vì PR chỉ thay
Markdown/skill Markdown.
