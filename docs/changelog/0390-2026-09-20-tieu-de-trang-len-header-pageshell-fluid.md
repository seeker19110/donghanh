# 0390 — 2026-09-20 — Chuyển tiêu đề trang lên header + PageShell thêm biến thể fluid

## Việc đã làm

Theo yêu cầu trực tiếp trong phiên (phân tích ảnh chụp layout desktop + hai yêu cầu tiếp theo):

1. **`packages/core-ui/PageShell.tsx` thêm biến thể bề rộng `fluid`** (`lg:max-w-[100rem]`,
   1600px thay vì 1152px của `standard`) — dùng cho trang có cột chính đã tự co giãn bằng
   flex/grid (`flex-1`, `minmax(0,1fr)…`). Trần cao hơn nhiều so với bề rộng khả dụng thực tế ở
   màn hình phổ biến (≤1440px) khiến nội dung bị giới hạn bởi khoảng trống thật (viewport trừ
   sidebar) thay vì bởi trần cố định — co giãn theo sidebar mở/thu gọn một cách gián tiếp. Áp
   dụng cho `Home.tsx` và `Dashboard.tsx` (hai trang có trong ảnh chụp gốc).
2. **`Dashboard.tsx`**: tiêu đề "Tiến độ học" chuyển lên thanh header (`Layout title=`), bỏ hẳn
   mô tả phụ (subtitle) theo yêu cầu; `DashboardWeeklyOverview` đổi mặc định lịch hoạt động
   thành MỞ SẴN (trước đây đóng, phải bấm mới thấy).
3. **~57 trang còn lại đang dùng `<PageHeader title= subtitle=>` trong thân trang** (component
   này vốn tách tiêu đề khỏi thanh header — xem doc cũ trong `PageHeader.tsx`): tiêu đề chuyển
   lên `Layout title=` (thanh header, cùng khuôn Dashboard/Home), mô tả phụ (subtitle) xoá hẳn
   không chuyển đi đâu khác, giữ đúng một `<h1 className="sr-only">` tại vị trí cũ trong thân
   trang để không mất cấu trúc heading cho trình đọc màn hình. Danh sách đầy đủ trong diff PR.

## Issue / outcome

Trước: nội dung trang bị giới hạn ở bề rộng cố định (1152px) bất kể sidebar desktop mở hay thu
gọn — thu gọn sidebar chỉ tạo thêm khoảng trắng hai bên thay vì tận dụng chỗ trống. Đồng thời
mọi trang "cùng loại" hiện tiêu đề to + mô tả phụ ngay trong thân trang, tách khỏi thanh header
phía trên (thanh header trống, chỉ có nút Back). Sau: nội dung co giãn tận dụng khoảng trống thật
khi sidebar thu gọn (đo 1440px: 1152px → 1336px); tiêu đề trang hiện ngay trên thanh header, mô
tả phụ (thường chỉ mang tính trang trí, không phải thông tin phải giữ) đã bỏ để giao diện gọn hơn.

## Research / spec

Không có đặc tả trước — thay đổi giao diện theo yêu cầu trực tiếp trong phiên (ảnh chụp + mô tả

- xác nhận phạm vi "tất cả trang dùng PageHeader"), dùng `refactor` cho commit đúng mục 11
  CLAUDE.md.

## Validation

`npm run typecheck` 0 lỗi (4 tsconfig) · `npm run lint` 0 cảnh báo (`--max-warnings 0`) ·
`npx prettier --check` sạch trên toàn bộ file đã sửa · `npm run build` (app + packages + server +
hub) xanh · `npm run test:coverage` (`vitest run` với ngưỡng coverage) — 714 file / 14962 test
xanh (1 file / 2 test skip, không liên quan), coverage đạt sàn (statements 94.09% / branches 90%
/ functions 94.6% / lines 94.65%). Đã cập nhật test canh hành vi mới: `Dashboard.test.tsx` (lịch
hoạt động mở mặc định), `DashboardWeeklyOverview.test.tsx` (idem), `Profile.test.tsx` (bỏ mock
`PageHeader` không còn dùng).

Đã chụp ảnh 1440px trước/sau qua Playwright (mockLogin E2E helper) cho: Home (sidebar mở/thu
gọn), Dashboard/Tiến độ (sidebar mở/thu gọn, xác nhận tiêu đề + lịch mở sẵn), và 4 trang mẫu đại
diện cho đợt chuyển PageHeader (Hồ sơ, Sổ tay lỗi sai, Lịch sử học, Giới thiệu nền tảng) — gửi
trực tiếp cho người dùng xem trong phiên, không đính kèm PNG vào repo (giữ kỷ luật 0 PNG).

## Rủi ro, rollout và rollback

Rủi ro trung bình do phạm vi rộng (65 file, ~57 trang cùng một khuôn thay đổi lặp lại): rà bằng
`npm run typecheck`/`lint`/`test:coverage` toàn repo sau khi gộp (không chỉ từng file riêng lẻ)
để bắt biến/import không còn dùng phát sinh từ việc xoá subtitle (đã bắt và sửa 5 trường hợp:
`Challenge.tsx`, `Dictionary.tsx`, `ProgrammingSpecStagePage.tsx`, `ProgrammingSpecializations.tsx`
có biến/hằng số tính riêng cho subtitle nay không còn dùng). Không đổi route/schema/API, không
đổi hành vi nghiệp vụ — thuần trình bày. Component `PageHeader.tsx` nay không còn nơi nào dùng
nhưng CHƯA xoá (ngoài phạm vi yêu cầu, giữ lại phòng khi cần loại trang hiển thị tiêu đề to trong
thân trang trở lại). Rollback: revert 1 commit, không có migration dữ liệu.

## Definition of Done

- [x] PageShell có biến thể `fluid`, áp dụng cho Home/Dashboard
- [x] Dashboard: tiêu đề lên header, xoá subtitle, lịch hoạt động mặc định mở
- [x] Toàn bộ ~57 trang dùng `PageHeader` đã chuyển tiêu đề lên `Layout`, xoá subtitle, giữ h1 sr-only
- [x] Không còn `<PageHeader` nào được gọi thật trong `apps/dhcb/src` (chỉ còn định nghĩa component)
- [x] typecheck/lint/format/test:coverage/build xanh trên kết quả đã gộp
- [x] Xác nhận bằng ảnh chụp thật 1440px, gửi trực tiếp cho người dùng
