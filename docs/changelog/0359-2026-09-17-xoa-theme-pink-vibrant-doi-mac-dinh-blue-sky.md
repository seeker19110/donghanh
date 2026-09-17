# 0359 — 2026-09-17 — Xoá theme Pink/Rực rỡ, đổi mặc định sang Blue sky

**Quyết định:** chủ dự án chốt trực tiếp trong phiên (không qua đặc tả trước — đổi cấu
hình theo yêu cầu tức thời, dùng `refactor`/`chore` cho đúng bản chất, không phải `feat`).

## Việc đã làm

1. **Xoá 2 theme `pink` và `vibrant`** khỏi `packages/core-ui/theme.ts` (type `Theme`,
   mảng `THEMES`, `THEME_COLORS`) và toàn bộ khối token của chúng trong
   `packages/core-ui/theme.css`. Dự án còn lại **3 theme**: `blue-sky`, `dark-blue` (tự
   chọn qua `ThemeToggle`) và `kid` (khoá cứng theo nhóm tuổi, không đổi).
2. **Đổi theme mặc định từ `dark-blue` sang `blue-sky`** (`DEFAULT_THEME` trong `theme.ts`).
   Người dùng cũ có `localStorage.ui_theme = 'pink'` hoặc `'vibrant'` tự rơi về mặc định
   mới qua đường `VALID.has()` sẵn có — không throw, không cần migration script.
3. Cập nhật mọi nơi liệt kê tên theme để khớp danh sách mới: `ThemeToggle.tsx` (comment
   thứ tự cycle), biến thể Tailwind `theme-light:` ở cả `apps/dhcb/tailwind.config.js`
   và `apps/hub/tailwind.config.js` (bớt `[data-theme="pink"]`), script đo tương phản
   (`scripts/contrast-audit.ts`, `scripts/fixed-color-contrast-audit.ts` + hai file test
   tương ứng), `apps/dhcb/src/lib/themeContrast.test.ts` (đọc trực tiếp từ `theme.css`
   nên tự động còn 3 theme, chỉ cần sửa hằng số `LIGHT_THEMES`/`KNOWN_LOW` tĩnh),
   `scripts/shots-learning-ux.ts` (`MOI_THEME`), `e2e/helpers/auth.ts` (`ThemeName`), và
   10 file `e2e/a11y*.spec.ts` + `e2e/subjects-catalog-states.spec.ts` +
   `e2e/home-quick-ask.spec.ts` (hằng số `THEMES`/`DIRECTION_B_THEMES`).
4. **Không đụng** các chỗ dùng `pink`/`vibrant` KHÔNG liên quan hệ theme: màu Tailwind cố
   định `text-pink-400`/`bg-pink-500` dùng làm màu nhấn UI (icon trái tim, badge chủ đề
   "Đời sống"…), từ vựng tiếng Anh "pink" trong nội dung bài học (`curriculum.ts`,
   `dialogues.ts`, `extra-examples.ts`, `cefr.ts`), và tên họ màu Tailwind gốc `pink` dùng
   trong `FIXED_FAMILIES` của `fixed-color-contrast-audit.ts` (không phải theme).

## Validation

```
npx vitest run packages/core-ui/theme.test.ts packages/core-ui/useTheme.test.tsx \
  apps/dhcb/src/lib/themeContrast.test.ts scripts/contrast-audit.test.ts \
  scripts/fixed-color-contrast-audit.test.ts   → 141/141 PASS
npm run test:coverage   → 94,03 / 89,85 / 94,35 / 94,59 (không tụt so với trước)
npm run typecheck       → 0 lỗi
npm run lint            → 0 cảnh báo
npx prettier --check .  → khớp
npm run build           → exit 0 (app + server + hub)
npm run budget          → Initial CSS 18,45kB → 18,07kB (GIẢM, do bớt token 2 theme);
                           Initial JS không đổi (135,4kB, nợ có sẵn #984)
```

## Rủi ro, rollout, rollback

Điểm chạm rộng (theme ảnh hưởng ~30 trang qua biến CSS) nhưng thay đổi chỉ là XOÁ 2 khối
token không còn được chọn — không sửa token của `dark-blue`/`blue-sky`/`kid`. Cổng
a11y AA/AAA (`e2e/a11y*.spec.ts`, 15 trang × N theme) tự động chạy lại đúng 3 theme còn
lại nhờ đọc hằng số `THEMES` chung, không cần sửa logic quét. Rollback: `git revert`.

## Cập nhật PROGRESS.md

Không mở nợ mới. Nợ #12 ("ngân sách BUNDLE nay mỏng") không đổi bản chất — CSS cải thiện
nhẹ, JS giữ nguyên mức cũ.
