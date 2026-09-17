# 0361 — 2026-09-17 — P0-2: token ấm `--w-*` + `CompanionAvatar`/`CompanionBubble` + thay vỏ lời chào

**Đặc tả:** `docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md` §P0-2 (lệnh 2 trong thứ tự
thi hành 15 lệnh). **Approved for implementation** — chủ dự án ra lệnh "thi hành lệnh 2".

## Việc đã làm

1. **Token ấm `--w-50/100/500/700`** thêm vào cả 3 theme (`dark-blue`, `blue-sky`, `kid`) trong
   `packages/core-ui/theme.css` (TÁCH khỏi accent — theme `kid` đã có accent cam, nên chọn HỒNG
   ĐẬM cho `--w-*` như đính chính §1 của spec thi hành) + map Tailwind `colors.warm.{50,100,500,700}`
   trong `apps/dhcb/tailwind.config.js`.
2. **`CompanionAvatar`** (`packages/core-ui/CompanionAvatar.tsx`) — SVG inline viết tay (~1.3kB
   nguồn, không import file `.svg`), 4 trạng thái (`idle` chớp mắt, `thinking` ba chấm so le,
   `cheer` phồng nhẹ rồi TỰ VỀ `idle` sau 600ms, `hasNote` chấm thông báo góc phải trên), 3 cỡ
   (32/48/64px), `decorative` (mặc định `aria-hidden`, `false` → `role="img"` + nhãn). Đồng bộ
   `mood` prop → state RENDER-TIME (mẫu React chính thức "điều chỉnh state khi prop đổi"), effect
   chỉ hẹn giờ trả `idle` — tránh lỗi lint `react-hooks/set-state-in-effect` (gọi setState trực
   tiếp trong thân effect).
3. **`CompanionBubble`** (`packages/core-ui/CompanionBubble.tsx`) — bong bóng nền `bg-warm-50`/
   viền `border-warm-100`, chữ LUÔN `text-content` (không `text-warm-*`, giữ AAA), `lead`/`detail`
   KHÔNG cắt chuỗi trong JS (chỉ CSS `line-clamp-2`), nút 🔊/✕ có điều kiện, `children` cho link
   chữ nhỏ dưới bong bóng.
4. **`apps/dhcb/src/prompts/companionVoice.ts`** — `loiChaoTheoGio(hour, name)` +
   `cauQuayLai(daysAway)`: hằng khuôn câu THUẦN, không gọi AI → không cần golden snapshot (snapshot
   chỉ canh prompt gửi AI thật).
5. **`HomeAiBriefingCard.tsx`** — thay icon `Bot` (lucide) + thẻ xám bằng `CompanionAvatar` +
   `CompanionBubble variant="home"`; GIỮ nguyên `fetchProactiveBriefing`/`speak`/`FALLBACK_SUMMARY`/
   `showDailyWords`. Gộp luồng "quay lại sau bỏ bẵng" (trước đây một `.glass` card riêng ở
   `Home.tsx`) vào dòng thứ hai của bong bóng (`cauQuayLai`) + 2 link chữ nhỏ (`reviewLabel`/
   `learnLabel`) dưới bong bóng qua prop mới `comeback?: HomeComeback`.
6. **`Home.tsx`** — dựng `HomeComeback` từ `showComeback`/`srsDue`/`continueLevelId` sẵn có, gỡ
   khối JSX card riêng (và các icon `Brain`/`Sparkles`/`X` không còn dùng).
7. **`scripts/fixed-color-contrast-audit.ts`** — thêm `auditWarmTokenPairs()` đo tương phản
   `text-content` (bí danh `--z-100`) trên `bg-warm-50`/`bg-warm-100` (AAA) và `warm-700` (mắt/
   miệng avatar) trên cùng hai nền (AA), in ra ở cuối script; test mới trong
   `fixed-color-contrast-audit.test.ts` canh cả hai ngưỡng ở CẢ 3 THEME.
8. **`e2e/comeback.spec.ts`** — đổi selector từ `/Mừng bạn quay lại/` (đã gỡ) sang
   `/Đã N ngày rồi/` (chuỗi `cauQuayLai`); nút "Đóng"/"Học 3 từ mới" giữ nguyên tên.

## Vì sao KHÔNG cần bọc animation mới trong `prefers-reduced-motion`

Spec §⑥ yêu cầu gói keyframe mới trong `@media (prefers-reduced-motion: no-preference)`, nhưng
đọc `apps/dhcb/src/index.css` thấy khối chặn TOÀN CỤC đã có từ S13-2 (2026-09-16):
`@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0s
!important; ... } }` — áp cho MỌI phần tử, gồm 3 animation mới (`companion-blink`/
`companion-dot`/`companion-cheer`). Không cần thêm luật riêng.

## Validation

```
npm ci                          → 810 packages, 16s
npm run typecheck                → 0 lỗi (kể cả sau rm -rf packages/*/dist dist dist-server)
npm run lint                     → 0 cảnh báo
npm run format                   → khớp (2 file cần --write: comeback.spec.ts, fixed-color-contrast-audit.test.ts)
npm run test:coverage            → PASS — Statements 94.05% / Branches 89.85% / Functions 94.43% / Lines 94.61%
npm run build                    → exit 0 (app + server + hub)
npx size-limit                   → Initial JS 136.6 kB / 150 kB (trước lát: ~135.4 kB, +1.2 kB)
                                     Initial CSS 18.25 kB / 20 kB (trước lát: ~18.07 kB, +0.18 kB)
npx tsx scripts/fixed-color-contrast-audit.ts   → 0 cặp rớt AA; token --w-*:
  dark-blue  text-content(z-100)/bg-w-50   13.42:1  (≥7)   OK
  dark-blue  text-content(z-100)/bg-w-100  10.50:1  (≥7)   OK
  blue-sky   text-content(z-100)/bg-w-50   17.22:1  (≥7)   OK
  blue-sky   text-content(z-100)/bg-w-100  16.03:1  (≥7)   OK
  kid        text-content(z-100)/bg-w-50   12.22:1  (≥7)   OK
  kid        text-content(z-100)/bg-w-100  11.35:1  (≥7)   OK
  dark-blue  warm-700/bg-w-50    11.61:1  blue-sky  warm-700/bg-w-50   6.84:1  kid  warm-700/bg-w-50   8.84:1  (≥4.5, OK)
  dark-blue  warm-700/bg-w-100    9.08:1  blue-sky  warm-700/bg-w-100  6.37:1  kid  warm-700/bg-w-100  8.21:1  (≥4.5, OK)
npx vitest run packages/core-ui/CompanionAvatar.test.tsx packages/core-ui/CompanionBubble.test.tsx \
  apps/dhcb/src/components/Home/HomeAiBriefingCard.test.tsx    → 20/20 PASS
```

E2E (`e2e/comeback.spec.ts`, `e2e/a11y*.spec.ts`) không chạy được TẠI MÁY này — sandbox chặn
tải Chromium của Playwright (`cdn.playwright.dev` bị chặn ở proxy môi trường); các cổng này chạy
trên CI (job `e2e`, required check).

## Rủi ro, rollout, rollback

`theme.css` chỉ THÊM 4 biến/theme, không sửa biến cũ — không đổi hành vi màu hiện có.
`HomeAiBriefingCard` đổi cấu trúc DOM nội bộ nhưng giữ nguyên hợp đồng `fetchProactiveBriefing`/
`ProactiveBriefing`; test render thật (happy-dom) canh cả trạng thái tải/lỗi/comeback. Rủi ro
lớn nhất là a11y ở E2E CI (chưa chạy được tại máy) — số đo tương phản tĩnh ở trên đã đạt ngưỡng
với biên độ rộng (thấp nhất 6.37:1 cho AA, 10.50:1 cho AAA) nên khả năng CI đỏ vì màu là thấp.
Rollback: `git revert`.

## Cập nhật PROGRESS.md

Không mở nợ mới. Không sửa `PROGRESS.md` — lát này không đổi giai đoạn/trạng thái tổng, chỉ là
một lát trong chuỗi 15 lệnh đã lên kế hoạch ở đặc tả thi hành.
