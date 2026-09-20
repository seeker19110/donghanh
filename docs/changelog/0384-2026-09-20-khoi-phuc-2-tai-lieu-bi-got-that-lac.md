# 0384 — 2026-09-20 — Khôi phục 2 tài liệu bị gộp/thất lạc + sửa sàn coverage ghi sai

## Việc đã làm

Xử lý nợ kỹ thuật ghi ở `PROGRESS.md` từ 2026-09-15 (audit đặc tả S05/S10/S12,
`docs/changelog/0328-*.md`): hai tài liệu CLAUDE.md và mã nguồn dẫn tới nhưng không tồn tại
trong repo.

Nguyên nhân giống hệt khuôn lỗi đã gặp ở Đợt 1 audit UI/UX (2026-09-19, PR #1045): tài liệu
KHÔNG bị xoá mất nội dung, mà bị GỘP vào một tài liệu tổng hợp khác trong đợt dọn tài liệu, và
không ai cập nhật lại các đường dẫn cũ trỏ tới nó.

1. **`docs/research/eval-tutor-baseline.md`** — bản ghi tự động của `npm run eval:tutor --
--write-baseline`, được CLAUDE.md mục 8 và `scripts/eval-tutor.ts:53` (biến `BASELINE_PATH`)
   dẫn tới. Nội dung đầy đủ (baseline chạy 2026-08-26) vẫn còn nguyên ở
   `docs/research/dinh-huong-va-ke-hoach-chung.md` mục `[6]`. Khôi phục nguyên văn thành file
   thật ở đúng đường dẫn cũ, thêm ghi chú số liệu đã cũ — PR nào cần so sánh mới phải tự chạy
   lại script (cần key AI thật).
2. **`docs/research/cai-tien-lo-trinh-hoc.md`** — dẫn từ `apps/dhcb/src/lib/storage.ts:241`,
   `cefrProgress.ts`, `quizBuilders.ts`, `scripts/assign-word-freq.ts`. Nội dung đầy đủ vẫn còn
   nguyên ở `docs/research/phuong-phap-va-su-pham.md` mục `[1]`. Khôi phục nguyên văn thành file
   thật ở đúng đường dẫn cũ.
3. **CLAUDE.md mục 13** ghi sàn coverage `97/93/96/97` — số liệu đã lỗi thời. Số thật theo
   `vitest.config.ts` (dòng 146-149) là `statements 93 · branches 89 · functions 93 · lines 93`.
   Đã sửa cho khớp.

Không đổi nội dung hai tài liệu gộp (`dinh-huong-va-ke-hoach-chung.md`,
`phuong-phap-va-su-pham.md`) — chúng vẫn giữ nguyên làm bản lưu trữ tổng hợp.

## Issue / outcome

Trước: `npm run eval:tutor -- --write-baseline` sẽ ghi vào một đường dẫn "ma" không ai đọc lại
được qua các liên kết trong CLAUDE.md/mã nguồn; các comment trong `storage.ts`/`cefrProgress.ts`
trỏ tới tài liệu nghiên cứu không tồn tại. Sau: cả hai đường dẫn có file thật, `npm run
check:specs` xanh, CLAUDE.md mục 13 khớp đúng số thật trong `vitest.config.ts`.

## Research / spec

Không có đặc tả trước — sửa nợ kỹ thuật đã ghi ở `PROGRESS.md`. Dùng `docs:` vì đây thuần là
khôi phục/sửa tài liệu, không đổi mã.

## Validation

`npm run check:specs` — OK, 124 đặc tả · `npm run typecheck` — 0 lỗi (không đổi mã) ·
đối chiếu thủ công nội dung khôi phục với bản gộp gốc (nguyên văn, không sai lệch).

## Rủi ro, rollout và rollback

Rủi ro thấp: chỉ thêm 2 file tài liệu + sửa 1 dòng số liệu trong CLAUDE.md, không đụng mã chạy.
Rollback: revert commit.

## Definition of Done

- [x] `docs/research/eval-tutor-baseline.md` tồn tại lại, nội dung khớp bản gộp
- [x] `docs/research/cai-tien-lo-trinh-hoc.md` tồn tại lại, nội dung khớp bản gộp
- [x] CLAUDE.md mục 13 khớp đúng sàn coverage thật
- [x] `npm run check:specs` xanh
