# 0367 — 2026-09-18 — UX-R1: nền tin cậy và vùng chạm cho Tiến độ

## Kết quả

- Lịch hoạt động trên mobile dùng vùng chạm 44×44px, cuộn ngang bên trong card và giữ nhãn thứ
  thẳng cột với ô ngày. Điều hướng bàn phím tự đưa ô được chọn vào vùng nhìn; heatmap desktop
  16px giữ nguyên.
- CTA đổi mục tiêu có vùng chạm tối thiểu 44px và focus ring rõ ràng.
- Đọc/ghi giờ nhắc không còn làm vỡ giao diện khi `localStorage` bị chặn. User ID đến muộn được
  remount theo đúng namespace; lỗi ghi vẫn dùng giờ vừa chọn cho lần đăng ký hiện tại và lần mở
  sau quay về 20:00.
- Web Push trả discriminated union `success | denied | failed | partial`. Hủy đăng ký xác nhận
  server trước browser; UI phân biệt hướng dẫn cấp quyền với lỗi có thể Retry, luôn thoát loading
  và phục hồi focus sau Retry.
- Dọn comment runtime lỗi thời: ma trận hiện hành có đúng ba theme `dark-blue`, `blue-sky`, `kid`.

## Review và bằng chứng

- Review độc lập vòng đầu: BLOCK 1 critical · 2 major · 2 minor; đã sửa mất focus sau Retry,
  permission-denied preflight, coverage state machine, phép đo overflow và auto-scroll.
- Review cuối: PASS 0 critical · 0 major · 0 minor.
- Vitest mục tiêu: 21/21 xanh; riêng QuickActions sau assertion AC-2 cuối: 10/10 xanh.
- Playwright `calendar-keyboard.spec.ts`: 4/4 xanh ở desktop, 320px và 390px.
- Ma trận 18 ảnh ngoài repo: `/tien-do` ở 320/390/1440 × ba theme × data/error; manifest tại
  `%TEMP%/dhcb-ui-ux-r1/after/manifest.json`.
- Node 22.23.2: build, typecheck, lint, format, budget và `git diff --check` xanh.

## Ghi chú full gate cục bộ

- Full unit trên Windows chạy được 14.897/14.900 ca trước khi một cổng import Swift timeout 5s;
  ca đó chạy riêng xanh 44/44. Lượt chạy lại dưới tải đồng thời phát sinh thêm timeout ở các test
  không thuộc diff.
- Full E2E cục bộ bắt đầu xanh, gồm AAA `/tien-do` dark-blue, rồi Vite test server dừng và các ca
  sau cùng lỗi `ERR_CONNECTION_REFUSED`. Required CI `quality` + sáu shard `e2e` là release gate;
  auto-merge không được thực hiện nếu một gate đỏ.

## Phạm vi và rollback

Không đổi route, API, schema, migration, dependency, auth, billing, entitlement hoặc dữ liệu học
có thẩm quyền. Rollback bằng revert riêng PR này; không cần data recovery hay flag.
