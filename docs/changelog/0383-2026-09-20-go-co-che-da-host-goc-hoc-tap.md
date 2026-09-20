# 0383 — 2026-09-20 — Gỡ hẳn cơ chế đa host của Góc học tập: một host, một đường dẫn

## Tóm tắt

Xoá hoàn toàn cơ chế subdomain `hoc-tap.donghanhcungban.org` khỏi mã. Từ nay **mọi môn** —
`english`, `programming`, `mathematics`, `physics`, `chemistry`, `biology` — và danh mục gốc
đều dùng path thống nhất `/goc-hoc-tap/<mã môn>` trên **một host duy nhất**
(`www.donghanhcungban.org`), đúng cách Tiếng Anh/Lập trình vốn đã chạy.

Trước đợt này, cơ chế đang **BẬT trên production**: danh mục `/goc-hoc-tap` và bốn môn STEM bị
đẩy 302 sang `hoc-tap.`, trong khi Tiếng Anh/Lập trình ở lại app host. Hệ quả là hai origin cùng
phục vụ một app, mà `localStorage` (token đăng nhập, tiến độ, SRS, từ vựng) thì **không dùng
chung giữa hai origin** — người đăng nhập ở `www.` mở một môn STEM là bị giao diện coi như
khách với tiến độ 0.

## Việc đã làm

**Client**

- `apps/dhcb/src/lib/subjectsHost.ts` — xoá `subjectsHostname()`, `isSubjectsHost()`,
  `usesSubjectsSubdomain()`, `subjectsTarget()`, `subjectsLinkTarget()`, `canonicalHostname()`
  và kiểu trả về phân biệt `{kind:'path'|'url'}`. `goToSubjects`/`goToSubjectHome`/`navigateTo`
  giờ chỉ gọi `navigate()` với đường dẫn tương đối. Giữ lại `SUBJECTS_PREFIX`, bảng tiền tố cũ,
  `normalizeLegacySubjectsPath`, `subjectsPath`, `duongDanMonTiengAnh` — đây vẫn là MỘT chỗ duy
  nhất dựng đường dẫn Góc học tập (CLAUDE.md §7).
- `apps/dhcb/src/components/SubjectsLink.tsx` — bỏ nhánh `<a href="https://…">`; luôn `<Link>`.
- `apps/dhcb/src/App.tsx` — xoá `onSubjectsHost`, component `SubjectsHostLegacyRedirect` và
  route `/:subjectId` chỉ tồn tại trên host cũ; route `/` luôn là trang chủ nền tảng.

**Server**

- Xoá `apps/server/src/subjectsRouting.ts` + `subjectsRouting.test.ts` (toàn bộ `decideRedirect`,
  bảng ownership theo host, `DEFAULT_SUBJECTS_HOSTNAME`).
- `apps/server/src/server.ts` — gỡ middleware chuyển hướng theo hostname (đứng trước static) và
  hai import chỉ phục vụ nó.

**Cấu hình & tài liệu**

- `.env.example` — thay khối bật/tắt bằng ghi chú "ĐÃ GỠ": `SUBJECTS_HOSTNAME`,
  `VITE_SUBJECTS_HOSTNAME`, `CANONICAL_HOSTNAME` không còn được đọc ở đâu.
- `nginx/en-vi.conf` — khối HỌC TẬP ghi rõ cơ chế đã gỡ. **Giữ `hoc-tap.` trong `server_name`**
  (chứng chỉ đã cấp, link đã chia sẻ): host đó nay phục vụ app như mọi host khác, nên
  `hoc-tap…/goc-hoc-tap/physics` vẫn mở đúng bài thay vì chết.
- `packages/core-learner/subjectHome.ts` — bảng `SUBJECTS_ON_APP_HOST` giữ nguyên tên và hành vi
  nhưng chú thích sửa lại cho đúng ý nghĩa còn lại: "môn có TRANG CHỦ RIÊNG do app dựng" chứ
  không còn là "môn thuộc host nào". `SubjectDetail.tsx` dùng đúng câu hỏi đó.
- `PROGRESS.md` — sửa TẠI CHỖ hai chỗ nói cơ chế còn sống; món nợ "dữ liệu đã ghi ở origin
  `hoc-tap.`" **vẫn 🟡** (phần dữ liệu cũ chưa dọn) nhưng ghi rõ nguồn lỗi đã bị chặn vĩnh viễn.

## Quyết định

- **Không viết cơ chế migrate localStorage giữa hai origin.** Chủ dự án đã chọn "tắt hẳn + dọn
  code"; spec cha vốn cấm chuyển dữ liệu qua query/postMessage, tập người ảnh hưởng nhỏ, và tiến
  độ đã đồng bộ lên server không mất — chỉ cần đăng nhập lại ở `www.`.
- **Không xoá tài liệu lịch sử** (`docs/specs/2026-08-28-tru-hoc-tap-subdomain.md`,
  `docs/specs/2026-09-15-goc-hoc-tap-architecture.md`, changelog 0192/0193/0324…). Chúng ghi
  quyết định tại thời điểm đó; file mã còn lại mang chú thích "đã gỡ" để không ai dựng lại.
- **Giữ tên `SUBJECTS_ON_APP_HOST` / `isAppHostSubject`.** Đổi tên sẽ chạm ~10 nơi gọi ngoài
  phạm vi đợt việc; ý nghĩa mới ghi ngay trong chú thích của file.

## Bằng chứng kiểm chứng

| Cổng                | Kết quả                                          |
| ------------------- | ------------------------------------------------ |
| `npm run build`     | ✅ (app + hub + `build:packages` + `tsc` server) |
| `npm run typecheck` | ✅ 0 lỗi (4 tsconfig)                            |
| `npm run lint`      | ✅ 0 cảnh báo                                    |
| `npm test`          | ✅ 14914 pass / 2 skip — 713 file test           |
| `npm run format`    | ✅ không file nào đổi                            |

Route đã đối chiếu trong `apps/dhcb/src/App.tsx`: `/goc-hoc-tap`, `/goc-hoc-tap/:subjectId`,
`/goc-hoc-tap/:subjectId/bai-hoc`, `/goc-hoc-tap/:subjectId/bai-hoc/:lessonSlug`,
`/goc-hoc-tap/:subjectId/on-tap` — tất cả vốn đã định nghĩa ở app host, trước đây chỉ bị đẩy đi
nơi khác. E2E hiện hành đã đi qua chính các đường này (`e2e/a11y.spec.ts`,
`e2e/route-alias.spec.ts`, `e2e/subjects-catalog-states.spec.ts`, `e2e/outline-stem.spec.ts`) và
không file nào phụ thuộc host `hoc-tap.`.

Test canh gác mới ở `apps/dhcb/src/lib/subjectsHost.test.ts`: sáu môn (gồm đủ bốn môn STEM) phải
nhận **đường dẫn tương đối**, khẳng định `not.toMatch(/^https?:/)` — dựng lại cơ chế đổi origin
là test đỏ ngay.

## Việc tay trên VPS (không bắt buộc, không chặn deploy)

1. Xoá `SUBJECTS_HOSTNAME` / `VITE_SUBJECTS_HOSTNAME` / `CANONICAL_HOSTNAME` khỏi `.env`
   production. Để lại cũng vô hại — không dòng mã nào đọc chúng nữa.
2. Muốn dọn hẳn subdomain: bỏ `hoc-tap.donghanhcungban.org` khỏi `server_name` và thêm block
   301 sang `www`. Chưa làm thì host cũ vẫn phục vụ app bình thường.
