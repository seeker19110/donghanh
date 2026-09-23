# Giữ bố cục Home ổn định khi dữ liệu tải xong

- Ngày: 2026-09-23. Trigger: E2E `home-clarity-evidence` ở trạng thái
  `member-insight` desktop đo CLS 0,102–0,110, vượt ngưỡng 0,1. PR review tài liệu
  #1128 không thay source nhưng hai lượt CI cùng tái hiện lỗi này.
- `HomeAiBriefingCard` dành sẵn 98px cho nội dung desktop vì insight tới sau
  request làm thẻ tăng 18px. Mobile và comeback giữ sàn riêng hiện có.
- `TodayCard` giữ tối thiểu 96px cho nội dung loading và loaded, tránh thẻ co 24px
  sau khi resolver trả dữ liệu. Đệm dọc desktop giảm 4px mỗi phía, giữ chiều cao
  trang trong cổng 1459px mà không cắt chữ hoặc giảm kích thước CTA.
- Impact map: cả hai component ảnh hưởng Home, unit component và App. Không đổi
  resolver, dữ liệu học, click target, analytics hay API.
- Kiểm cục bộ: Prettier, ESLint hai component và `git diff --check` đạt; E2E canonical
  Home 1/1 đạt trên Node 22 sau sửa, gồm CLS và chiều cao trang. Test cục bộ dùng
  `node_modules` nối từ checkout gốc nên Vite chặn font bên ngoài allow list; CI
  với cài đặt chuẩn phải xác nhận lần cuối. Đã nhìn ảnh 390/1440 từ Playwright.
- Không migration. Rollback bằng revert hai thay đổi layout; lỗi CLS có thể tái xuất
  hiện, giữ cổng E2E để phát hiện.
