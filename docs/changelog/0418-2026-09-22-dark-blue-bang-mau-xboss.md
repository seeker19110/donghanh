# 0418 — 2026-09-22 — Theme Xanh đêm đổi sang bảng slate-xanh "dịu mắt" của repo xboss

- **PR:** (đợt này) · nhánh `claude/ui-ux-comprehensive-review-rplwjh`
- **Loại:** `style` — chỉ đổi token màu, không đổi bố cục/hành vi
- **Nền:** chủ dự án hỏi "mỗi theme một CSS khác nhau hay sao?" rồi chốt "áp bảng dark-blue của
  `seeker19110/xboss`" (`app/globals.css`, khối `html.darkblue`, đọc ở commit `e75829b`).

## Trả lời câu hỏi cơ chế

Cả hai repo dùng **một file CSS**, mỗi theme là một khối ghi đè biến. Khác nhau: xboss ghi đè
thẳng `--color-zinc-*` của Tailwind 4 qua class `html.darkblue`; donghanh giữ tên riêng `--z-*` /
`--a-*` qua `[data-theme]` và có thêm tầng ngữ nghĩa `--surface-*` / `--text-*` đo sẵn tương phản.
Vì vậy "áp theme xboss" = đổi 11 số ở `packages/core-ui/theme.css`, không viết CSS mới.

## Việc đã làm

- `packages/core-ui/theme.css` khối `[data-theme='dark-blue']`: `--z-50…950` lấy đúng giá trị
  xboss (nền `#0e1726`, thẻ `#182741`, viền `#223554`/`#2f466c`, chữ `#bcd0e8`/`#7da1d3`…);
  `--glass-bg` = thẻ; `--theme-color` = `#0e1726`. **Giữ nguyên** accent cyan (quyết định
  2026-09-03) và khối Sci-Fi (lưới nền 4,5 %, `tabular-nums`) — ngoài phạm vi yêu cầu.
- **Một chỗ lệch bảng gốc, có chủ ý:** `--z-400` xboss `#92a9cb` chỉ đạt **3,96:1** trên nền hover
  `z-700`, cổng `themeContrast.test.ts` đỏ đúng cặp đó. Nâng lên `#a3b8d6` (4,69 trên z-700; 8,9 ·
  7,4 · 6,1 trên z-950/900/800 — vẫn AAA). Sửa ở token, không vá từng chỗ (CLAUDE.md mục 4.5).
- **Cổng thứ hai đỏ sau đó — `scripts/fixed-color-contrast-audit.test.ts`: 164 chỗ** `text-red/rose/
indigo/violet/purple/pink-400` (màu Tailwind cố định) hụt AA (3,9–4,5:1) trên mặt thẻ nổi z-800
  nay sáng hơn. Đây đúng là vấn đề xboss đã gặp và giải bằng cách ghi đè 5 biến `--color-*-400`
  lên giá trị -300 trong khối `html.darkblue`. Áp cùng cách: Tailwind 4 phát `text-red-400` thành
  `color: var(--color-red-400)` (kiểm trong `dist/assets/index-*.css`), nên khối
  `[data-theme='dark-blue']` ghi đè 6 biến (5 của xboss + `pink-400`, xboss không dùng pink) viết
  dạng `rgb(R G B)`; assert runtime bằng Playwright `getComputedStyle(...).getPropertyValue`.
  Kèm hai sửa nhỏ ở công cụ đo để cổng KHÔNG mù trước cách ghi đè này: `parseThemeTokens`
  (`scripts/lib/contrast.ts`) nhận cả `rgb(R G B)`; `fixed-color-contrast-audit.ts` ưu tiên
  token `color-<họ>-<bậc>` của theme nếu có. 164 → 0 phát hiện, không thêm ngoại lệ nào.
- Đồng bộ `meta theme-color` ở `apps/dhcb/index.html`, `apps/hub/index.html`,
  `packages/core-ui/theme.ts`.

## Bằng chứng

- `npm test` toàn bộ: **16.725/16.725** ✅ (hai lần đỏ trung gian đúng như mô tả trên: 1 cặp
  z-400/z-700, rồi 164 màu cố định → đều sửa ở token, không nới cổng).
- `npm run build` ✅ (dùng để kiểm cách Tailwind 4 phát biến màu).
- E2E `a11y.spec.ts` + `a11y-aaa.spec.ts` + `badge-contrast.spec.ts` lọc `dark-blue`: **96/96** ✅.
- Typecheck ✅ · lint 0 cảnh báo ✅ · prettier ✅.
- Tầng 8b: 6 trang × 1440/390 theme dark-blue chụp trước (đợt 0417) và sau — chiều cao trang
  **không đổi** (chỉ đổi màu), ảnh ngoài repo.
