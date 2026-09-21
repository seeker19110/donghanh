# 0394 — 2026-09-21 — Audit toàn diện + dọn dẹp (`OutcomeCalibrationCard`, `core-ui/Card`)

## Việc đã làm

Audit toàn diện theo khuôn `docs/framework/QUY-TRINH-AUDIT.md` trên nhánh
`claude/comprehensive-audit-optimization-02ph80` (đã chạy: Tầng 1 cổng · 2/2b bảo mật · 3 vệ
sinh · 5a coverage · 6 đối chiếu · 10 logic ngẫu nhiên · `npm run maintain`). Kết quả dẫn tới hai
lần dọn dẹp thật:

1. **Xoá `apps/dhcb/src/components/DecisionLedger/OutcomeCalibrationCard.tsx`** (209 dòng, kéo
   theo cả thư mục `DecisionLedger/` vì chỉ còn đúng file này) — tàn dư của ba trụ
   Career/Startup/Life đã gỡ hẳn 2026-09-20 (`docs/changelog/0389-*.md`). Xác nhận mồ côi bằng
   `codemap -- orphans` + `grep -rn "OutcomeCalibrationCard" apps packages e2e docs scripts` (0
   import, chỉ còn nhắc trong changelog lịch sử 0039/0265). Sửa kèm
   `apps/dhcb/src/pages/core/UiNoise.design.test.ts` (gỡ dòng allowlist tương ứng, test này so
   khớp tuyệt đối nên để lại là đỏ cổng).
2. **Xoá `packages/core-ui/Card.tsx` + `cardStyles.ts` + `cardStyles.test.ts`** — theo quyết định
   của chủ dự án sau khi audit chỉ ra cả cụm "chuẩn thẻ" design system (có tài liệu đo thật:
   2026-09-02 ghi nhận `border-zinc-800` 609 lần / `bg-zinc-950` 310 lần / `rounded-xl` 894 vs
   `rounded-2xl` 603 — bốn hình dạng thẻ khác nhau đang tồn tại song song) chưa từng được áp
   dụng vào nơi nào. Xác nhận bằng `grep -rln "cardStyles"` toàn repo → chỉ ra đúng 3 file là
   chính nó. Chủ dự án chọn xoá thay vì áp dụng lại vào các chỗ dùng thẻ thủ công hiện có.

Không sửa lỗi lint/typecheck nào khác — cả hai đều đã 0 từ đầu. Không nâng version gói nào.

## Issue / outcome

Dọn hai mảng code chết không còn ai dùng thật, giảm diện tích bảo trì; không đổi hành vi người
dùng, không đổi giao diện hiển thị (Card chưa từng được render ở đâu).

## Research / spec

Không cần đặc tả mới — dọn dẹp theo phát hiện của audit, không phải tính năng mới. Căn cứ theo
`docs/framework/QUY-TRINH-AUDIT.md` (khuôn audit) và `PROGRESS.md` (nợ kỹ thuật/trạng thái nền).

## Validation

Chạy sau `npm ci` (môi trường phiên ban đầu thiếu `node_modules`, `npx` tự kéo TypeScript 6.0.2
từ registry gây `TS5101` giả ở lần chạy đầu — chữa bằng `npm ci`, không sửa code theo báo lỗi
giả, đúng khuôn bẫy CLAUDE.md mục 8):

- `npm run typecheck` ✅ 4 project, 0 lỗi
- `npm run lint` ✅ 0 cảnh báo (`--max-warnings 0`)
- `npm run format:check` ✅
- `npm test` ✅ 691 file / 14766 test qua, 1 file / 2 test skip (giảm đúng 11 test/1 file so với
  trước vì `cardStyles.test.ts` bị xoá cùng file nguồn)
- `npm run build` ✅ (app + server + hub)
- `npm run size` ✅ JS 136,67/150 kB (91,1%) · CSS 17,79/20 kB (89,0%) — dưới ngưỡng cảnh báo 95%
- Coverage (`npm run test:coverage`): stmts 94,06% · branches 90,06% · funcs 94,57% · lines
  94,61% — đều trên sàn 93/89/93/93, biên dư mỏng nhất ở branches (+1,06 điểm)
- `npm run codemap -- cycles` ✅ không có chu trình import
- `npm run codemap -- orphans` — giảm từ 3 xuống 2 file sau đợt dọn đầu (Card không tính vào lượt
  quét này vì đã xoá ở đợt sau)
- `npm run maintain` ✅ `npm audit --omit=dev` exit 0, 0 lỗ hổng

Rà bảo mật riêng (Tầng 2/2b): 0 secret hardcode, `.env` không bị track, 0 `dangerouslySetInnerHTML`
thật, 0 client đọc env server, 0 lộ `.stack` ra client, 0 tái phát lỗi phân bố `Math.random()` của
đợt 2026-08-24. Hai nghi vấn ban đầu đều xác minh là an toàn: log "token" trong
`packages/subject-programming/lessons/p6u63.ts` là nội dung bài học minh hoạ (không phải mã chạy
thật), và nối chuỗi SQL ở `packages/core-personal/personErasureService.ts:299` đã có whitelist
regex `/^[a-z_][a-z0-9_]*$/` chặn định danh trước khi nối, giá trị thật vẫn qua tham số hoá.

## Rủi ro, rollout và rollback

Rủi ro thấp: cả hai phần đã xoá đều không còn nơi nào import (xác nhận bằng grep + codemap toàn
repo). Rollback: `git revert` commit tương ứng, không đụng schema/dữ liệu, không cần migration.

## Ghi nhận nhưng CHƯA sửa trong đợt này (không phải nợ mới, chỉ chuyển tiếp để không lặp lại rà)

- 3 cặp migration trùng số (`0026`, `0027`, `0059`) — đã kiểm không cặp nào chạm chung bảng, và
  khuyến nghị **không đổi số** vì `scripts/run-pg-migrations.ts` theo dõi theo tên file, đổi số =
  production chạy lại migration.
- Tầng 11 (dựng Postgres tạm kiểm lũy đẳng migration), Tầng 8/8b (Lighthouse + ảnh chụp — không
  bắt buộc vì đợt này không đụng giao diện), Tầng 9 (Sentry/PM2 production), Tầng 5c (E2E +
  a11y Playwright) **chưa chạy trong đợt audit này** — không phải "đã đạt", chỉ chưa đo.

## Definition of Done

- [x] Hai mảng code mồ côi đã xoá, xác nhận bằng grep + codemap trước khi xoá
- [x] Cổng build/type/lint/format/test/coverage/size đều xanh sau khi dọn
- [x] Rà bảo mật (Tầng 2/2b) không phát hiện lỗ hổng thật
- [x] Không đụng vào các mục nợ kỹ thuật đã chốt có chủ đích trong `PROGRESS.md`
