# 0361 — 2026-09-17 — P0-4: Header mobile 4 khe + `focus` ẩn BottomNav

**Lát**: P0-4 của `docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md` (lệnh 5/15).
**PR**: (điền khi mở)

## Việc đã làm

- `apps/dhcb/src/components/Layout.tsx`: dưới 1024px (`useIsDesktopViewport`) ẩn bộ chuyển
  Studio và nút đổi giao diện (`ThemeToggle`) khỏi header — nội dung của chúng dời sang trang
  Hồ sơ. Trang chủ mobile (`pathname === '/'`) ẩn thêm nút "Đồng Hành AI" (Orb ở BottomNav + ô
  hỏi `HomeUniversalAiBar` đã là hai lối vào AI). `focus={true}` giữ nguyên hành vi cũ (ẩn
  Studio + streak) và THÊM: đặt `document.documentElement.dataset.focus = '1'` khi bật, xoá khi
  tắt hoặc unmount (cùng cơ chế `dataset.sidebar` của `DesktopSidebar`).
- `apps/dhcb/src/components/BottomNav.tsx`: thêm class `bottom-nav` (móc CSS thuần, không mang
  style riêng).
- `apps/dhcb/src/index.css`: rule `html[data-focus='1'] nav.bottom-nav { display: none }`.
- `apps/dhcb/src/pages/core/Profile.tsx`: thêm mục "Không gian" liệt kê `STUDIOS` (bộ chuyển
  Studio cũ ở header) và một hàng "Giao diện" dùng `ThemeToggle` trong "Cài đặt & Tiện ích" —
  cả hai thay thế đường vào đã bị ẩn khỏi header mobile.
- Test: `Layout.test.tsx` (đếm số phần tử tương tác header theo viewport + AC dataset.focus
  bật/tắt/unmount qua `createRoot`+`act`), `Profile.test.tsx` (mới — canh mục "Không gian" đủ
  `STUDIOS.length` mục), `e2e/bottomnav.spec.ts` (AC-3: focus ẩn BottomNav, trang chủ vẫn thấy),
  `e2e/mobile-layout-guards.spec.ts` (AC-4: không phần tử header nào bị cắt chữ ở 360×740).

## Quyết định

- Themes hiện chỉ còn 2 lựa chọn (Blue sky/Xanh đêm, chốt 2026-09-17 PR #929) — mục "Giao diện"
  mới ở Hồ sơ ghi đúng 2 theme, không lặp lại chữ "Pink/Rực rỡ" đã bị xoá.
- Không zero hoá `--bnav-h`/`--bnav-only-h` khi `focus` — chỉ ẩn hẳn `<nav>` bằng CSS đúng như
  đặc tả yêu cầu; khoảng đệm đáy trang giữ nguyên (không có trang nào trong phạm vi lát này bị
  ảnh hưởng bởi khoảng trống nhỏ đó, xem `e2e/mobile-layout-guards.spec.ts`).

## Bằng chứng kiểm chứng

- `npm run typecheck` ✅ · `npm run lint` (0 cảnh báo) ✅ · `npm run format` ✅
- `npm run test:coverage` ✅ 12k+ test xanh, coverage 94.05/89.85/94.43/94.61 (≥ sàn 93/89/93/93)
- `npm run build` ✅ (app + server + hub)
- `npx size-limit`: JS 136.59 kB / 150 kB brotli · CSS 18.08 kB / 20 kB brotli — trong ngân sách
- `npx playwright test e2e/mobile-layout-guards.spec.ts e2e/bottomnav.spec.ts`: KHÔNG chạy được
  cục bộ (môi trường phiên này không có trình duyệt Playwright cài sẵn) — sẽ chạy trong CI `e2e`.
- Ảnh chụp trước/sau: chưa đính kèm (môi trường phiên không có trình duyệt để chạy
  `npm run shots:learning-ux`) — đã kiểm thay bằng test đếm phần tử tương tác header
  (`Layout.test.tsx`) + test không cắt chữ (`mobile-layout-guards.spec.ts` AC-4); CI `e2e` (a11y
  AA/AAA 3 theme) vẫn chạy đầy đủ.
