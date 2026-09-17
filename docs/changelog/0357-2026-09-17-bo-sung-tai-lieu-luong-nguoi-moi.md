# 0357 — 2026-09-17 — Bổ sung tài liệu còn thiếu: luồng người mới

**PR:** (điền khi tạo) · **Loại:** docs-only, không source/schema/dependency.

## Bối cảnh

CLAUDE.md mục 2 dẫn tới `docs/research/luong-nguoi-moi-ho-so-nang-luc-an-2026-08-23.md` như thể
đã tồn tại, nhưng file này chưa từng có trong repo — phát hiện khi viết đặc tả S05/S10/S12
(`docs/changelog/0328-2026-09-15-dac-ta-s07-va-cac-slice-con-lai-learning-ux.md`), ghi thành nợ
kỹ thuật #1 trong `PROGRESS.md`.

## Đã làm

- **Đọc mã thật trước khi viết** (không bịa hành vi): `packages/core-personal/intakeService.ts`,
  `packages/core-personal/intakeSuggestion.ts`, `packages/core-contracts/intake.ts`,
  `apps/dhcb/src/pages/core/Intake.tsx`, `apps/dhcb/src/components/FirstTaskCard.tsx`,
  `apps/dhcb/src/components/admin/AdminIntakePanel.tsx`, cùng toàn bộ test liên quan
  (`intakeSuggestion.test.ts`, `intakeService.test.ts`, `e2e/a11y-intake.spec.ts`,
  `e2e/a11y-admin-intake.spec.ts`) và ba changelog gốc khi tính năng được xây (0094/0095/0096,
  2026-08-23) + changelog tắt route (0293, 2026-09-13).
- **Phát hiện quan trọng: tính năng ĐÃ được code và chạy thật từ 2026-08-23** — đây không phải
  đặc tả "sẽ làm" mà là tài liệu mô tả đúng mã đang có. Route `/bat-dau` đang bị TẮT khỏi luồng
  đăng ký mới từ 2026-09-13 (lý do funnel: rớt 80%, không phải lỗi luồng), nhưng toàn bộ code
  3 lớp (HỎI/HỒ SƠ ẨN/GỢI Ý) và test bất biến vẫn còn nguyên, vẫn chạy trong CI.
- Viết `docs/research/luong-nguoi-moi-ho-so-nang-luc-an-2026-08-23.md` (10 mục: kiến trúc 3 lớp,
  5 câu hỏi nguyên văn, cách hồ sơ ẩn được cất/mã hoá, luật ngôn ngữ cấm/cho phép có bảng mẫu
  regex thật, bảy test bất biến chặn CI đối chiếu tên test thật, lịch sử triển khai, lý do route
  đang tắt, và mục "chưa làm" ghi rõ ranh giới việc được giao).
- Cập nhật `PROGRESS.md` **tại chỗ** (không chồng mục): đóng nợ #1 trong danh sách nợ kỹ thuật,
  sửa dòng "S05-2" đang mở để không còn nhắc nợ đã đóng như đang mở.

## Phát hiện thêm (ghi lại, KHÔNG sửa trong PR này — ngoài phạm vi được giao)

- Ba tài liệu "bộ 3 năng lực theo độ tuổi" mà CLAUDE.md mục 2 liệt kê như ba file riêng
  (`dac-ta-nang-luc-ca-nhan-theo-do-tuoi-2026-08-23.md`,
  `nang-luc-10-40-chi-tiet-2026-08-23.md`, `dong-hanh-va-phat-trien-nang-khieu-2026-08-23.md`)
  **cũng không tồn tại dưới tên riêng** — nội dung đã được gộp vào một file duy nhất
  `docs/research/nang-luc-va-do-tuoi.md` ở một đợt gộp tài liệu trước đó. Là một khoảng lệch
  CLAUDE.md/repo khác, độc lập với nợ #1 vừa đóng.
- Hai tài liệu khác vẫn còn thiếu, đã ghi từ trước ở `docs/changelog/0328-*.md`:
  `docs/research/eval-tutor-baseline.md`, `docs/research/cai-tien-lo-trinh-hoc.md`. Vẫn mở trong
  `PROGRESS.md`.

## Validation (docs-only, không đụng code)

- `npx prettier --check docs/research/luong-nguoi-moi-ho-so-nang-luc-an-2026-08-23.md docs/changelog/0357-2026-09-17-bo-sung-tai-lieu-luong-nguoi-moi.md PROGRESS.md`.
- `npx vitest run scripts/changelog.test.ts` (test canh "một đợt việc = một file changelog").
- Không chạy toàn bộ `npm test`/`npm run build` vì đợt việc không đụng bất kỳ file `.ts`/`.tsx`
  nào — theo đúng phạm vi việc thuần tài liệu.

## Definition of Done

- File tài liệu tồn tại, khớp CLAUDE.md mục 2 mô tả (5 câu ~90 giây → hồ sơ ẩn → gợi ý 1 việc,
  luật ngôn ngữ cấm/cho phép, 7 test bất biến), không mâu thuẫn với mã nguồn thật.
- `PROGRESS.md` không còn liệt kê nợ #1 là "chưa tồn tại".
- Các khoảng lệch mới phát hiện (bộ 3 tài liệu năng lực đã gộp) được ghi lại rõ ràng để người dùng
  quyết định, không tự ý sửa CLAUDE.md.
