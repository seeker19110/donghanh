# 0388 — 2026-09-20 — Sửa tương phản màu chữ theme "blue sky" (CompanionVoice + StudioDialogue)

## Việc đã làm

Audit theo yêu cầu người dùng ("audit màu chữ và tương phản ở theme blue sky"), sau đó sửa
toàn bộ vi phạm tìm được (người dùng chốt "fix toàn bộ" rồi "sửa nốt luôn" cho phần mở rộng).

Tầng token gốc (`--z-*`/`--a-*`/`--surface-*`/`--text-*` ở `packages/core-ui/theme.css`) đúng
thiết kế — `text-primary`/`text-secondary` đạt AAA (≥7:1) trên mọi bề mặt của theme blue-sky.
Lỗi nằm ở CODE không dùng token, tự hardcode màu Tailwind cố định rồi vá bằng `theme-light:`.

1. **[NGHIÊM TRỌNG] Nền cố định + chữ `theme-light:` tối → tương phản đo được chỉ 1.72:1**
   (dưới sàn AA 4.5:1). 6 file `apps/dhcb/src/components/CompanionVoice/`
   (ArticulatoryPhoneticsVisualizer, EchoShadowingCard, ScenarioHolodeckCard,
   SocraticDiagnosticsCard, WearablesSyncCard, WorkplaceHarvesterCard) dùng nền
   `bg-slate-900/90`/`bg-slate-950/80` (không đổi theo theme) kèm `theme-light:text-slate-700`
   (hoặc teal/amber/emerald-900). Sửa gốc: đổi nền sang token tự đảo theo theme
   (`bg-surface-card`/`bg-surface-raised`, viền `border-line-subtle`/`border-line-strong`), chữ
   xám trung tính đổi hẳn sang `text-content`/`text-content-secondary` (bỏ cặp `theme-light:`),
   giữ nguyên chữ có ngữ nghĩa màu (teal/amber/emerald) vì nay nền đã tự đảo đúng. 5 file còn lại
   trong nhóm (AmbientScreenCopilot, A2ANegotiatorCard, AcousticPhoneticsLab, NeuroAffectiveCard,
   SubconsciousInsightsCard) đã dùng `bg-zinc-*` (có remap theo theme) nên không có lỗi này.

2. **[TRUNG BÌNH] `text-white` trên nền cố định bị đảo màu.** `text-white` map qua biến
   `--c-white`, ở theme blue-sky bị đảo thành chữ TỐI (#0F172A) — đúng khi nền cũng tự đảo theo
   token (`surface-*`/`zinc-*`/`accent-*`), nhưng SAI khi nền là màu Tailwind cố định
   (`bg-indigo-600`, `bg-teal-600`, `bg-violet-600`, `bg-emerald-600`, `bg-rose-600`, các
   gradient sky/blue/purple/orange/indigo...) — chữ bị đảo tối trên nền vẫn đậm, mất tương
   phản. Rà toàn bộ `text-white` trong `CompanionVoice/*` và `CompanionStudios/StudioDialogue.tsx`
   theo đúng nền cục bộ (không suy diễn từ nền card cha), đổi các chỗ nền cố định sang
   `text-[#fff]` (chữ trắng thật, đúng convention đã dùng ở `pages/core/Login.tsx:474-490`).
   2 chỗ có nền đổi theo trạng thái chọn (`isSelected`) được tách class có điều kiện. Giữ nguyên
   `text-white` ở mọi chỗ nền đã tokenized (kể cả `StudioDialogue.tsx` — toàn bộ nền cục bộ ở đó
   dùng `zinc-*`/`accent-*`, cả hai đều remap theo theme).

## Issue / outcome

Trước: nhiều thẻ CompanionVoice gần như vô hình ở theme blue-sky (tương phản 1.72:1); một số
nút/badge có chữ trắng bị đảo thành chữ tối trên nền màu đậm, cũng mất tương phản. Sau: toàn bộ
vị trí đã rà đạt AA (phần UI) hoặc AAA (nội dung/tiêu đề) theo đúng luật CLAUDE.md mục 4.5.

## Research / spec

Không có đặc tả trước — audit phát sinh từ yêu cầu trực tiếp trong phiên, dùng `fix` cho commit
theo đúng tinh thần mục 11 CLAUDE.md (không phải tính năng mới).

## Validation

`npm run typecheck` 0 lỗi (4 tsconfig) · `npm run lint` 0 cảnh báo (`--max-warnings 0`) ·
`npx prettier --check` sạch trên các file đã sửa · `npm test` (`vitest run`) — 714 file / 14957
test xanh (1 file / 2 test skip, không liên quan thay đổi). Chưa chạy `npm run build` riêng
(typecheck xanh, rủi ro build thấp) — xem kết quả CI job `build` của PR #1061.

**Nợ còn mở:** chưa chụp ảnh 1440px + 390px trước/sau theo Tầng 8b (CLAUDE.md
`docs/framework/QUY-TRINH-AUDIT.md`) — các thẻ CompanionVoice vốn thiết kế cho nền tối, nay ở
theme blue-sky đổi thành thẻ nền sáng viền màu, nên cần xem bằng mắt thật trước khi merge. Ghi
lại ở `PROGRESS.md` để không quên.

## Rủi ro, rollout và rollback

Rủi ro thấp: chỉ đổi className (màu nền/chữ/viền), không đổi logic/schema/API. Không ảnh hưởng
theme `dark-blue`/`kid` (chỉ sửa giá trị áp dụng ở theme blue-sky qua token/`theme-light:` sẵn
có). Rollback: revert 2 commit, không có migration.

## Definition of Done

- [x] Lỗi nghiêm trọng (nền cố định + `theme-light:` tối, 1.72:1) đã sửa ở 6 file
- [x] Lỗi trung bình (`text-white` bị đảo màu trên nền cố định) đã sửa ở 10 file
      CompanionVoice + xác nhận `StudioDialogue.tsx` không cần sửa
- [x] typecheck/lint/format/test xanh
- [ ] Chụp ảnh 1440px/390px trước/sau (Tầng 8b) — CHƯA làm, ghi nợ ở `PROGRESS.md`
