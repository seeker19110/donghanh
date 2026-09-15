# 0334 — 2026-09-15 — S05-1: bắt đầu theo ý định (`/bat-dau`), hợp đồng `LearnerIntent`

- **PR:** #(điền khi tạo) · nhánh `claude/laughing-babbage-o25bls-s05-1`
- **Đặc tả:** `docs/specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md` (Approved for
  implementation) — §9 mục 1, tức **PR-1 của slice S05**. S05-2 (một nguồn danh mục môn cho hub
  và app) là PR riêng, KHÔNG nằm trong đợt này.

## Việc đã làm

1. **Hợp đồng** `packages/core-contracts/learnerIntent.ts`: `LearnerIntentSchema` dựng bằng
   `versionedObject` (`schemaVersion: 1`, `.strict()`), `subjectIds` giữ thứ tự bấm · không rỗng ·
   không trùng · tối đa 6; `purpose`/`timeBudget`/`level`/`grade` là enum đóng và tuỳ chọn; `grade`
   chỉ hợp lệ khi có môn STEM. Không có — và không thêm được — trường điểm/bậc/xếp hạng.
2. **Chọn một việc** `apps/dhcb/src/lib/intent/pickStartAction.ts`: hàm THUẦN, tất định, không AI,
   không mạng (có test đọc chính mã nguồn để canh). Việc chính = lá đầu tiên `available` và chưa
   `completed` trong cây S07-1 của môn ĐẦU TIÊN; không có lá nào → trang tổng quan môn; không có ý
   định → `/goc-hoc-tap` (KHÔNG mặc định môn Tiếng Anh).
3. **Bộ lọc ngôn ngữ** `intentForbidden.ts`: 9 mẫu cũ của `intakeSuggestion.ts` + 3 mẫu mới của S05
   (hồ sơ/chẩn đoán · token enum thô `lv_*` · xếp loại theo bậc), dùng lookaround `\p{L}` chứ
   không `\b` (bẫy tiếng Việt đã ghi ở changelog `0094`).
4. **Trang** `apps/dhcb/src/pages/core/StartByIntent.tsx` gắn route công khai `/bat-dau`: ≤ 5 bước
   (bước "lớp" chỉ hiện khi có môn STEM), mỗi bước có nút "Bỏ qua" ≥ 44px, chấm chỉ VỊ TRÍ
   (`aria-label="Bước x trên y"`), `?mon=` chỉ tiền điền id hợp lệ. Đã có ý định → vào thẳng màn
   gợi ý + nút "Đổi ý định".
5. **Luồng Intake đời sống GIỮ NGUYÊN MÃ**, chỉ đổi route sang `/bat-dau/doi-song` (quyết định Q1);
   `e2e/a11y-intake.spec.ts` đổi theo.
6. **Server:** `GET|PUT /api/learner-intent` (OPTIONS → `checkRateLimit(ip, 30, 'learner-intent')`
   → `validateAuth` → method → Zod; truy vấn luôn lọc theo `auth.userId`) +
   `packages/core-personal/learnerIntentService.ts` (upsert theo `user_id`, `created_at` do server
   giữ) + migration **`0082_personal_learner_intent.sql`**.
7. **Khách:** tiền tố `dhcb_intent_` đăng ký trong `ALL_PREFIXES`; `mergeGuestProgressInto` hợp
   nhất ý định khi đăng nhập (tài khoản chưa có → PUT bản khách giữ `createdAt`; đã có → giữ bản
   server), gọi lần hai là no-op.

## Quyết định

- **Số migration là `0082`, không phải `0081` như đặc tả viết.** Số cấp theo thứ tự MERGE thật:
  `0081_completion_evidence.sql` (PR #935, slice S11) merge trước đợt này.
- **Mức tự khai không nới khoá** (Q2 (a)): môn Anh luôn dựng cây A1, môn Lập trình luôn P1; luật
  khoá của server (CEFR) và của client (70% bậc trước) là authority.
- Bỏ qua ngay ở bước chọn môn = "bỏ hết": không còn câu nào đổi được kết quả, nên luồng kết thúc
  luôn thay vì bắt người dùng bấm "Bỏ qua" thêm ba lần.
- `main` bố cục: `/bat-dau` KHÔNG nằm trong `NAV_HIDDEN_PATHS` nên thanh điều hướng đáy có hiện →
  trang chừa `pb-32` (128px > nav 97px), có `e2e/mobile-layout-guards.spec.ts` canh.

## Bằng chứng kiểm chứng (chạy thật)

| Cổng                    | Kết quả                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| `npm run typecheck`     | ✅ (chạy lại sau `rm -rf packages/*/dist dist dist-server`)                                         |
| `npm run lint`          | ✅ 0 cảnh báo                                                                                       |
| `npm run format`        | ✅                                                                                                  |
| `npm run build`         | ✅ — chunk `StartByIntent` **15,06 kB / gzip 5,38 kB** (ngân sách AC-14: ≤ 12 kB gzip)              |
| `npm run budget`        | ✅ Initial JS 130,90/140 kB · CSS 18,08/20 kB                                                       |
| `npm run test:coverage` | ✅ 12.929 test (2 đỏ khi chạy đầy tải là flake môi trường, chạy lại lẻ đều xanh — xem ghi chú dưới) |
| `npm run migrate:pg` ×2 | ✅ lần 1 áp `0082 … xong`; lần 2 "Đã áp dụng đủ 85 migration lẻ — không có gì mới"                  |
| Playwright              | ✅ `start-by-intent` 8/8 · `a11y-intent` + `a11y-intake` 36 ca · `mobile-layout-guards` 6/6         |
| Tầng 8b                 | ✅ ảnh 1440/390/320 × 4 màn (chọn môn · thời gian · gợi ý · đổi ý định) — nhìn thật, dán trong PR   |

**Ghi chú flake (KHÔNG do đợt này):** chạy `test:coverage` toàn bộ có 2 ca đỏ —
`packages/subject-programming/lessonsPython.test.ts` (timeout 5s khi máy đang tải nặng) và
`scripts/migrations-readme-coverage.test.ts` (đỏ đúng lúc chưa thêm dòng README cho `0082`, đã
sửa). Chạy lại từng file: 568/568 và 5/5 xanh. Ca E2E `a11y-intake` "thẻ việc đầu tiên, theme=kid"
cũng đỏ một lần khi chạy song song rồi xanh khi chạy lẻ — trang đó đợt này không chạm tới.

## Nợ mở ra từ đợt này

- `docs/research/luong-nguoi-moi-ho-so-nang-luc-an-2026-08-23.md` mà `CLAUDE.md` §2 dẫn tới
  **không tồn tại trong repo** (đặc tả S05 đã cảnh báo, kiểm lại 2026-09-15 vẫn đúng). Bảy test
  bất biến ngôn ngữ của đợt này lấy nguồn từ đặc tả S05 §③.5 chứ không từ file đó. Cần một PR
  `docs` riêng để khôi phục tài liệu hoặc sửa đường dẫn — KHÔNG thuộc S05.
- Nhãn môn trong `StartByIntent.tsx` hiện khai lại tại chỗ (6 dòng). **S05-2** sẽ thay bằng
  `SUBJECT_ENTRIES` dùng chung cho hub và app.
