# 0373 — Đóng nợ "hub nằm ngoài cổng tương phản tĩnh"

- **Ngày:** 2026-09-19
- **Bối cảnh:** `PROGRESS.md` (mục nợ ghi 2026-09-16, `docs/changelog/0356-*.md`, PR #992) nói
  `apps/hub/src` không đưa được vào `scripts/fixed-color-contrast-audit.ts` vì "là app landing
  riêng, không có bộ chuyển theme, thang `zinc` không cùng hệ token với `@dhcb/app`".

## Phát hiện: tiền đề của nợ đã LỖI THỜI

Đọc mã thật (`apps/hub/src/App.tsx`, `apps/hub/src/pages/HubLogin.tsx`,
`apps/hub/tailwind.config.js`) thấy **cả ba lý do loại trừ đều không còn đúng**:

1. `apps/hub/src/App.tsx:26` và `HubLogin.tsx:32` đã `import { ThemeToggle } from '@core/ThemeToggle'`
   và render nó (`App.tsx:342`, `HubLogin.tsx:254`) — hub **CÓ** bộ chuyển theme.
2. `apps/hub/tailwind.config.js` map `zinc`/`accent` sang **ĐÚNG** biến CSS
   `rgb(var(--z-*))`/`rgb(var(--a-*))` — giống hệt cách `@dhcb/app` làm.
3. `apps/hub/src/index.css` dòng 1 `@import '../../../packages/core-ui/theme.css'` — hub đọc
   **CÙNG MỘT FILE TOKEN** với `@dhcb/app`, không phải bảng màu riêng.

Nói cách khác: hub là một app Vite khác, nhưng thang `zinc`/`accent` của nó là cùng một hệ
token thật (`--z-*`/`--a-*`) như `@dhcb/app`. Không có "bảng màu sai" nào để lo đo nhầm — dùng
thẳng `auditRepo()` hiện có là đúng, không cần công cụ riêng.

## Đã làm

- Thêm `apps/hub/src` vào danh sách thư mục quét của `auditRepo()`
  (`scripts/fixed-color-contrast-audit.ts`) — cùng một script, không tạo script riêng.
- Ghi lại phát hiện trên thành comment ngay trong file (phần "PHẠM VI QUÉT"), trỏ về changelog
  0356 (lý do loại trừ cũ) và changelog này (lý do gỡ).
- Chạy script trên toàn repo (đã gồm hub): phát hiện **4 chỗ** rớt AA ở hai theme nền sáng
  (`blue-sky`, `kid`) — đều là màu Tailwind cố định (`amber`/`emerald`/`red`) chưa có biến thể
  `theme-light:` vá, đúng khuôn lỗi #981/#984 đã biết:
  - `apps/hub/src/pages/HubLogin.tsx:298` `text-emerald-400` (badge "Trạng thái SSO") → 1.56:1
  - `apps/hub/src/pages/HubLogin.tsx:416` `text-red-400` (khối lỗi) → 2.24:1
  - `apps/hub/src/pages/HubLogin.tsx:422` `text-emerald-400` (khối thành công) → 1.56:1
  - `apps/hub/src/pages/HubLogin.tsx:486` `text-amber-300` (nút "Đăng nhập Google chuyển trang") → 1.17:1
  - `apps/hub/src/App.tsx:495` `text-amber-200` (badge "Admin") → 1.01:1
- Vá cả 5 chỗ bằng đúng cách dự án đã dùng ~720 lần trước đó: thêm biến thể
  `theme-light:text-<họ màu>-800/900` cạnh class trần (không đổi màu ở theme tối).
- ~60 chỗ `text-zinc-*` còn lại trong `apps/hub/src/App.tsx` (nợ ghi trong PROGRESS 2026-09-16)
  **đã tự đạt AA** — kiểm bằng script: toàn bộ dùng bậc sáng (100–500/950), không có bậc tối
  600/700/800 (khuôn lỗi #981) nào trong hub. Không cần sửa thêm.
- Thêm 2 ca canh mới trong `scripts/fixed-color-contrast-audit.test.ts`: xuất `walk()` để test
  trực tiếp xác nhận `apps/hub/src` nằm trong danh sách quét (đỏ ngay nếu ai lỡ xoá dòng đó) +
  xác nhận hub hiện sạch (0 vi phạm).
- **Không cần đổi `.github/workflows/ci.yml`** — `fixed-color-contrast-audit.test.ts` đã chạy
  trong `npm run test:coverage` ở job con hiện có (không thêm job/bước mới), nên không đụng
  luật mục 11.1 CLAUDE.md.
- Sửa `PROGRESS.md`: đánh dấu nợ 2026-09-16 ĐÃ ĐÓNG, dẫn về changelog này.

## Xác nhận

- `npx tsx scripts/fixed-color-contrast-audit.ts` → **0 cặp rớt AA** trên toàn repo (gồm hub).
- `npx vitest run scripts/fixed-color-contrast-audit.test.ts` → 13/13 ca xanh (thêm 2 ca mới).
- Build ✅ (`@dhcb/hub` build ra `dist/assets/index-*.js` 219.39 kB gzip 66.74 kB — không đổi so
  với trước, vì chỉ thêm class `theme-light:` chứ không thêm import).
- Typecheck ✅ · Lint (0 cảnh báo) ✅ · Format ✅ · `npm run test:coverage` (kết quả dán khi PR
  mở, xem log CI).
