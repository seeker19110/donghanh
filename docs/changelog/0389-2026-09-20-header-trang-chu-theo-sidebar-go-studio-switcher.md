# 0389 — 2026-09-20 — Nút "Trang chủ" header ẩn/hiện theo sidebar + gỡ bộ chuyển Studio

## Việc đã làm

Theo yêu cầu trực tiếp trong phiên (ảnh chụp layout desktop, khoanh đỏ 2 chỗ ở header):

1. **Nút "Trang chủ" ở header (`components/Layout.tsx`) nay ẩn khi sidebar đang MỞ RỘNG, hiện
   lại khi sidebar thu gọn hoặc không có sidebar.** Trước đây nút này luôn hiện ở desktop
   (`isDesktop && ...`), đứng cạnh sidebar cũng có sẵn nút "Trang chủ" riêng ở hàng đầu — hai
   nút cùng chữ, cùng ý nghĩa, đứng gần nhau là thừa khi sidebar đang mở. Thêm hook nội bộ
   `useSidebarDataset()` đọc `document.documentElement.dataset.sidebar` (nơi `DesktopSidebar.tsx`
   tự ghi trạng thái `expanded`/`collapsed`/`off`) qua `MutationObserver` — không có props/context
   chung giữa hai component nên phải theo dõi thuộc tính DOM này (cùng cơ chế `--sidebar-w`).
2. **Gỡ hẳn "bộ chuyển Studio" (dropdown "Studio" ở header, khoanh đỏ thứ 2 trong ảnh) khỏi
   `Layout.tsx`** — nút Layers + dropdown 4 miền + toàn bộ state/effect liên quan (mở/đóng, bấm ra
   ngoài, điều hướng bằng phím ↑/↓/Home/End, phím tắt ⌘K). Ô chọn miền này đã trùng với: (a) mục
   "Góc học tập"/"Sự nghiệp & Đời sống" ở sidebar desktop, và (b) mục "Không gian" ở trang Hồ sơ
   (dời sang đó từ P0-4, 2026-09-17) — không còn phục vụ mục đích riêng nào ở header.

## Issue / outcome

Trước: desktop luôn thấy 2 nút "Trang chủ" (header + sidebar) cùng lúc khi sidebar mở, và một
dropdown "Studio" ở header trùng lặp với điều hướng đã có ở sidebar/Hồ sơ. Sau: header chỉ hiện
nút "Trang chủ" khi thật sự cần (sidebar thu gọn/không có), dropdown Studio đã gỡ hẳn khỏi
header — giảm số khe tương tác, không mất chức năng (vẫn vào được các miền qua sidebar/Hồ sơ).

## Research / spec

Không có đặc tả trước — thay đổi giao diện theo yêu cầu trực tiếp trong phiên (ảnh chụp +
mô tả), dùng `refactor` cho commit đúng mục 11 CLAUDE.md (dọn UI theo yêu cầu phiên, không phải
tính năng mới có đặc tả).

## Validation

`npm run typecheck` 0 lỗi (4 tsconfig) · `npm run lint` 0 cảnh báo (`--max-warnings 0`) ·
`npx prettier --check` sạch trên các file đã sửa · `npm run build` (app + packages + server + hub)
xanh · `npm test` (`vitest run`) — 714 file / 14962 test xanh (1 file / 2 test skip, không liên
quan thay đổi), gồm cả `Layout.test.tsx` đã cập nhật để canh: (a) dropdown Studio không còn trong
markup tĩnh, (b) nút "Trang chủ" ẩn/hiện đúng theo `data-sidebar` ở cả 3 trạng thái
(`expanded`/`collapsed`/`off`).

Chưa chụp ảnh 1440px/390px trước/sau theo Tầng 8b — đổi ở header/thanh điều hướng, người dùng
xem trực tiếp trên môi trường chạy thật (dev container không có UI kiểm bằng mắt).

## Rủi ro, rollout và rollback

Rủi ro thấp: chỉ đổi hiển thị/gỡ một khối UI (dropdown Studio) trong `Layout.tsx`, không đổi
route/schema/API. Sidebar (`DesktopSidebar.tsx`) không đổi — Layout chỉ ĐỌC thêm thuộc tính DOM
nó đã tự ghi từ trước. Rollback: revert 1 commit, không có migration.

## Definition of Done

- [x] Nút "Trang chủ" header ẩn khi sidebar mở rộng, hiện lại khi thu gọn/không có sidebar
- [x] Gỡ hẳn dropdown "Studio" + toàn bộ state/effect liên quan khỏi header
- [x] Test cũ canh dropdown Studio đã cập nhật sang canh "đã gỡ"; thêm test canh hành vi mới
- [x] typecheck/lint/format/test/build xanh
