# 0326 — 2026-09-15 — Slice 02 Góc học tập: Tiếng Anh là một môn ngang hàng (thi hành)

**PR:** (điền khi tạo) · **Đặc tả:** `docs/specs/2026-09-15-goc-hoc-tap-02-tieng-anh-la-mot-mon.md`
(Approved 2026-09-15, Q1–Q3 chủ dự án chốt trong phiên).

## Đã làm

1. **Một nguồn sự thật "môn nào ở host nào"** — `packages/core-learner/subjectHome.ts`
   (`SUBJECTS_ON_APP_HOST`, `isAppHostSubject`, `subjectHomePath`), server và client cùng đọc.
   Xoá bảng `SUBJECTS_WITH_OWN_SPACE` cục bộ ở server.
2. **Trang tổng quan Tiếng Anh ở `/goc-hoc-tap/english`** (`EnglishHome`, thuộc APP host). Ba đường
   cũ `/hoc-tieng-anh`, `/tieng-anh`, `/english` là alias ở cả client (`LegacySubjectsRedirect`,
   giữ query/hash, `replace`) lẫn server (302, khớp biên đoạn). Trên host Góc học tập chúng về
   app host một chặng. `SubjectDetail` không còn vẽ trang manifest cho Tiếng Anh/Lập trình —
   `Navigate` thẳng tới trang chủ môn, không gọi API.
3. **Sửa lỗi thật đang chạy trên production (spec §2.3):** nút "Vào …" ở danh mục trước đây
   `navigate()` tại chỗ → trên host `hoc-tap.` người đã đăng nhập thành khách, tiến độ 0. Nay
   MỌI nút đi qua `goToSubjectHome(nav, id)`; `subjectsTarget` biết chiều ngược "về app host"
   (assign sang `canonicalHostname()` khi đang ở host Góc học tập). `SubjectsLink` (sidebar)
   dùng cùng helper. Ở localhost/host mode tắt vẫn `navigate()` như cũ.
4. **Bỏ "không gian" Tiếng Anh cấp nền tảng:** `STUDIOS` còn 5 mục; dropdown header và nhóm
   "Không Gian Nền Tảng" ở sidebar không còn "Học Tiếng Anh". **Q1 — di chuyển, không xoá:** 5 công
   cụ (`ENGLISH_CHILDREN`) thành **cấp 2** dưới mục "Tiếng Anh" trong nhóm "Góc học tập"
   (`NavChild.children`), tự mở khi đang ở trang tổng quan hoặc một công cụ, nút mở/đóng có
   `aria-expanded` + vùng chạm 44px. Breadcrumb: `Trang chủ › Góc học tập › Tiếng Anh › Lộ trình CEFR`.
5. **Q2 — nhãn nút danh mục một khuôn** `Vào môn ${label}` cho cả 6 môn.
6. **Khớp tiền tố theo BIÊN đoạn ở mọi nơi** (`underPrefix` trong `navPaths.ts`, dùng cho
   `matchesNav`, `groupContainsPath`, breadcrumb, dropdown Studio): `/goc-hoc-tap/english-abc`
   không còn làm sáng mục nào. Trước đó `Layout`/sidebar dùng `startsWith` trần.
7. `EnglishHome`: tiêu đề "Tiếng Anh" (không còn "Không Gian Tiếng Anh"/"English Studio"), thêm
   nút **Ôn thi** (công cụ thứ 5 trước đây chỉ có ở sidebar). `Home`/`Practice`/`ExamPlan` dựng
   link qua `duongDanMonTiengAnh()`; hub đổi CTA + `scripts/hub-links.test.ts` canh khớp registry.

## Quyết định trong đợt

- **Q3 (uỷ quyền):** KHÔNG migrate dữ liệu đã lỡ ghi ở origin `hoc-tap.` — bịt nguồn lỗi là đủ,
  người dùng còn ít. Ghi nợ ở `PROGRESS.md`.
- Môn thuộc app host khi đang ở một app host bất kỳ (www, en-vi…) thì **ở lại host đó** — không
  kéo về www chỉ vì bấm một môn (server `targetHost`).
- Đường sâu hơn dưới `/goc-hoc-tap/english/...` KHÔNG gộp về trang tổng quan — để nguyên cho
  route `*`; slice 03 mới định nghĩa.
- Không đụng route công cụ, `isDefault`, `getDirection`, onboarding, auth, storage key (slice 03/04).

## Bằng chứng kiểm chứng (đo thật, 2026-09-15)

- `npm run format` ✅ · `npm run lint` ✅ (0 cảnh báo) · `npm run typecheck` ✅ · `npm run build` ✅
- Unit: `npx vitest run` ✅ **614 file / 12.654 test**, 0 đỏ — test mới/đổi: `subjectHome.test.ts` (5), `subjectsRouting.test.ts`
  (+15 ca Tiếng Anh), `subjectsHost.test.ts` (45), `studios.test.ts` (mới), `navTree.test.ts`,
  `navPaths.test.ts`, `breadcrumb.test.ts`, `Layout.test.tsx`, `DesktopSidebar.test.tsx` (mới, 6),
  `EnglishHome.test.tsx` (mới, 2), `Subjects.test.tsx` (+2), `SubjectDetail.test.tsx` (+2),
  `scripts/hub-links.test.ts` (mới).
- E2E: `english-subject-home` (5, mới) + `route-alias` + `comeback` + `bottomnav` ✅ 36/36.
  `a11y` + `a11y-aaa` + `mobile-layout-guards` + `subjects-catalog-states`: (điền).
- Ảnh trước/sau 1440px + 390px: (điền).
