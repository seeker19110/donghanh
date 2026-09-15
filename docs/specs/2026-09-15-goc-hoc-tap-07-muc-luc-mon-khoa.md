# Góc học tập — slice S07: Mục lục môn/khoá độc lập shellbar (hợp đồng cây + adapter 3 môn + rail/panel)

| Thuộc tính    | Giá trị                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec cha      | [`2026-09-15-goc-hoc-tap-architecture.md`](2026-09-15-goc-hoc-tap-architecture.md) §① "Sau 04 ưu tiên mục lục độc lập shellbar (S07)"                            |
| Spec nền      | [`2026-09-15-learning-ux-foundation.md`](2026-09-15-learning-ux-foundation.md) §④ C (9 yêu cầu bắt buộc) + §③ khung `OutlineNode`                                |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md) dòng S07                                                                                                     |
| Base khảo sát | `main` `7c2d81c` (#928, sau slice 02 spec), khảo sát 2026-09-15 bằng 3 lượt đọc mã thật (Lập trình · STEM · Tiếng Anh/dialog), số liệu đếm thật                  |
| Trạng thái    | **Approved for implementation** — chủ dự án chốt TOÀN BỘ câu hỏi §7 theo đề xuất mặc định (2026-09-15). **S07-1 đã thi hành** (changelog 0330); còn S07-2, S07-3 |
| Người duyệt   | Chủ dự án                                                                                                                                                        |

> Không bắt đầu code khi trạng thái chưa là **Approved for implementation**. Luật số 1 của khuôn
> `docs/templates/dac-ta-tinh-nang.md`: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.
>
> Spec này đồng thời là **"adapter spec"** mà spec nền §④ C dòng cuối đòi hỏi ("Adapter spec phải
> chốt payload metadata, khoá và evidence từng môn trước source S07") — xem §③.

## 0. Một câu

Cho người học nhìn thấy TOÀN BỘ cây môn/khoá đang học ngay trong vùng học (cột trái ở desktop,
panel "Mục lục" ở mobile), biết bài nào đang mở · đang dở · đã xong · khoá · chưa đo được, nhảy
tới bài trong ≤ 2 thao tác, và không mất ngữ cảnh khoá khi một bài thuộc nhiều khoá — mà không
phụ thuộc vào sidebar/bottom-nav của ứng dụng và không tải nội dung bài chỉ để vẽ mục lục.

## ④ Tiêu chí chấp nhận (đo được — mỗi dòng ghi lệnh/bằng chứng)

Chia 3 PR con (§9): **S07-1** hợp đồng và adapter (không UI) · **S07-2** rail/panel cho Lập trình
và STEM · **S07-3** Tiếng Anh (lộ trình CEFR). AC ghi rõ thuộc PR nào.

### S07-1 — hợp đồng cây + adapter, không đổi giao diện

- [x] **AC-1 Một kiểu cây dùng chung.** `packages/core-contracts/outline.ts` export `OutlineNode`,
      `Outline`, `OutlineProgress`, `OutlineAvailability` đúng §③.1; có schema Zod `OutlineSchema`
      và test `outline.test.ts` canh: `order` duy nhất trong cùng `parentId`, `parentId` phải trỏ
      nút có thật, `kind:'lesson'|'activity'` bắt buộc `href`, `progress:'completed'` bắt buộc
      `evidenceSource`. — `npx vitest run packages/core-contracts/outline.test.ts`.
- [x] **AC-2 Adapter Lập trình — bậc.** `buildLevelOutline(levelId, ctx)` trả cây
      `level → unit (chapter) → lesson` đúng số unit/bài của `PROGRAMMING_LEVELS` +
      `getUnitSummaries`; P6 có thêm tầng mạch (`UNIT_TRACKS`) — cây P6 có 65 unit gom vào mạch
      như E2E `programming-lesson.spec.ts:491` đang khẳng định. Bài `href` =
      `duongDanBaiHoc(lesson, {levelId})`. Khoá: `availability:'locked'` + `lockReason` lấy từ
      `LevelLockInfo` (`levelLock.ts`), **không tự tính lại luật**. Tiến độ:
      `ProgrammingLessonProgress.status` → `in-progress`/`completed` (`evidenceSource:
'programming.progress'`), không có bản ghi → `not-started`. Unit chưa có bài → nút chapter
      có `hint` "sắp mở", **không** sinh nút lesson rỗng. — `programmingOutline.test.ts`.
- [x] **AC-3 Adapter Lập trình — khoá ngắn.** `buildCourseOutline(courseId, ctx)` trả
      `course → chapter → lesson`, `courseId` gắn trên MỌI nút, bài `href` =
      `duongDanBaiHoc(lesson, {courseId})` (có `?khoa=<courseId>`). Ca chồng lấn THẬT phải có test:
      `git-c1` chứa `p3-u10-l1` → href mang `?khoa=git`; cùng bài trong `buildLevelOutline('p3')`
      → href KHÔNG có `?khoa=`; `ml` và `mlds` cùng chứa `ml-u1-l1` → hai href khác nhau. Khoá
      ngắn không khoá (`availability:'available'` toàn bộ). — `programmingOutline.test.ts`.
- [x] **AC-4 Adapter STEM.** `buildStemOutline(subjectId, grade, ctx)` trả
      `level(lớp) → chapter → lesson` từ `loader.listCoreByGrade(grade)` gom theo `chapterNumber`
      (KHÔNG theo `chapterTitle`, KHÔNG theo `chapterKey` — xem §③.3 bẫy Hoá/Sinh); nhánh HSG
      `listAdvanced()` là một nút `chapter` riêng "Bồi dưỡng học sinh giỏi" (con = bài, `hint` =
      `nhanCapHsg(tier)`), **vắng khi rỗng** (Sinh có 0 chuyên đề → không có nút). Mọi bài
      `progress:'unknown'` (STEM chưa có evidence — §③.3), `availability:'available'`.
      Test chạy trên dữ liệu THẬT bốn loader như `StemLesson.test.tsx` đang làm: tổng số nút
      `lesson` của Toán = 53, Lí = 94, Hoá = 87, Sinh = 84 (bằng `loader.index.length`), và
      **không gọi `loadLesson`** (spy = 0 lần). — `stemOutline.test.ts`.
- [x] **AC-5 Adapter Tiếng Anh — cấp CEFR.** `buildCefrOutline(levelId, ctx)` trả
      `level → chapter(unit) → activity` với đúng 3 hoạt động cố định theo thứ tự ① Từ vựng (mỗi
      vòng một `activity`) ② Ngữ pháp (mỗi `GrammarLesson` một `activity`) ③ Hội thoại; unit không
      có ngữ pháp thì KHÔNG sinh nút ngữ pháp rỗng. Số unit mỗi cấp bằng `cefr.json` thật (A1 15
      · A2 27 · B1 40 · B2 43 · C1 32 · C2 44). Tiến độ: vòng từ vựng `completed` khi
      `circleDoneCount === words.length` (`evidenceSource:'english.vocab'`), ngữ pháp `completed`
      khi `isGrammarDone` (`'english.cefrGrammar'`), hội thoại `completed` khi đã xem
      (`'english.cefrDialogue'`); dở dang = vòng có ≥ 1 từ thuộc nhưng chưa đủ. Khoá cấp: đọc
      `computeLockedMapFromServer` (server là authority), **không** đọc placement. —
      `cefrOutline.test.ts` với fixture rút từ `cefr.json` (không fetch mạng trong test).
- [x] **AC-6 Không tải nội dung bài để dựng cây (bất biến).** Ba adapter chỉ import chỉ mục nhẹ
      (`lessonsLoader`/`lessonIndex`, `StemLessonLoader.index`, `cefr.json` đã có trong bộ nhớ
      của trang). Test canh: `vi.spyOn(loader, 'loadLesson')` / `loadUnitLessons` được gọi **0
      lần** trong mỗi `build*Outline`; `grep` xác nhận `packages/core-learner/outline/*.ts`
      không import `@dhcb/subject-programming/lessons` (registry 3 MB). — 3 file test trên +
      lint rule đã có (packages không import apps).
- [x] **AC-7 Một hàm dựng URL bài học Lập trình.** `programmingRoutes.ts` có
      `duongDanBaiHoc(lesson, ctx?: {courseId?} | {levelId?})`; `grep -rn "/lap-trinh/bai-hoc/"
apps/dhcb/src --include=*.tsx` chỉ còn khớp trong `programmingRoutes.ts` và test
      (hiện tại ≥ 2 trang tự ghép chuỗi). `programmingRoutes.test.ts` thêm ca: có/không
      `courseId`, mã tách lại được, `?khoa=` không lọt vào slug. — `npx vitest run
apps/dhcb/src/lib/programmingRoutes.test.ts`.

### S07-2 — rail desktop + panel mobile cho Lập trình (bậc, khoá ngắn) và STEM (bài)

- [ ] **AC-8 Cây thay vì danh sách phẳng, tái dùng `TocRail`.** `packages/core-ui/OutlineTree.tsx`
      (mới) render `Outline` thành `<nav aria-label>` + `<ul>` lồng (`role="tree"`/`treeitem`
      theo APG hoặc `<details>`-less disclosure có `aria-expanded`), mỗi bài là `<Link>` route
      thật (KHÔNG phải `<a href="#…">`), `aria-current="page"` cho bài đang mở. `TocRail` GIỮ
      NGUYÊN cho mục lục neo trong một trang ("Trong bài này"); `OutlineTree` tái dùng
      `TocItem` cho lá + cùng token màu. `git diff --stat packages/core-ui/TocRail.tsx` = không
      đổi hành vi (7 test cũ xanh). — `OutlineTree.test.tsx` (mới) ≥ 8 ca: rỗng → null, chương
      hiện tại tự mở, mở/thu bằng chuột + phím (Enter/Space/←/→), `aria-current` đúng 1 nút,
      5 trạng thái có nhãn chữ (không chỉ màu), khoá là `<span aria-disabled>` + lý do, "chưa đo
      được" cho `unknown`, thứ tự theo `order`.
- [ ] **AC-9 Năm trạng thái phân biệt được, không coi mở bài là hoàn thành.** Nhãn/icon: đang mở
      (`aria-current`), đang học dở, hoàn thành ✓, chưa học, khoá 🔒 + lý do, chưa đo được (STEM).
      Mở một bài STEM rồi quay lại mục lục → bài đó vẫn "chưa đo được" (không tự thành ✓). —
      `OutlineTree.test.tsx` + E2E `outline-stem.spec.ts` ca "mở bài không đổi trạng thái".
- [ ] **AC-10 Desktop: cột trái vùng học, độc lập shellbar.** Ở ≥ 1024px, trang bài Lập trình
      (`/lap-trinh/bai-hoc/:lessonId`), trang bậc, trang khoá ngắn, và trang bài STEM
      (`/goc-hoc-tap/:subjectId/bai-hoc/:lessonSlug`) có `TwoPane railSide="left"
railLabel="Mục lục …"` chứa `OutlineTree`. Thu gọn `DesktopSidebar` (đặt
      `localStorage.ui_sidebar_collapsed` + `document.documentElement.dataset.sidebar`) → mục lục
      **vẫn hiện, không đổi nội dung**; `NAV_HIDDEN_PATHS` không ảnh hưởng. — E2E
      `outline-programming.spec.ts` + `outline-stem.spec.ts` ca "sidebar thu gọn".
- [ ] **AC-11 Mobile: nút "Mục lục khoá học"/"Mục lục môn học" cạnh tên bài, panel focus chuẩn.**
      Ở < 1024px không có cột trái; có nút ≥ 44px cạnh tiêu đề bài mở panel (`Modal
variant="sheet"`, xem §③.5) có tên, focus vào ô tìm (nếu có) hoặc bài đang mở, Tab không
      lọt nền, Escape đóng, đóng trả focus về nút mở; **chọn bài → panel đóng → focus vào `<h1>`
      tiêu đề bài mới** (`document.activeElement === h1`). — `e2e/a11y-modals.spec.ts` thêm ca
      panel mục lục; E2E `outline-*.spec.ts` @390 và @320.
- [ ] **AC-12 Chọn bài ≤ 2 thao tác; chương hiện tại tự mở.** Desktop: bài trong chương đang mở =
      1 bấm; bài ở chương khác = mở chương + bấm = 2. Mobile: mở panel + bấm bài (chương đích mở
      sẵn) = 2. Trạng thái mở/thu lưu `sessionStorage` khoá `ui_outline_open_<subject|course
id>` — đổi môn/khoá dùng khoá riêng, không kế thừa. — E2E đếm click; unit test khoá
      storage tách theo id.
- [ ] **AC-13 Ngữ cảnh khoá không mất.** Mở `/lap-trinh/khoa-hoc/git--…` → bấm bài `p3-u10-l1` →
      URL có `?khoa=git`, mục lục hiện cây **khoá Git** (không phải bậc P3), breadcrumb
      `… › Khoá Git › <bài>`; Back/Forward/reload giữ nguyên; prev/next (AC-14) đi theo cây khoá.
      Cùng bài mở từ trang bậc P3 → không `?khoa=`, mục lục là cây P3. `?khoa=<id lạ>` → bỏ qua
      query, dùng cây bậc, không lỗi. Canonical-slug redirect (`buildSlugSegment`) **giữ query**.
      — `ProgrammingLessonPage.test.tsx` (mới) + E2E `outline-programming.spec.ts`.
- [ ] **AC-14 Prev/next theo cây đang mở.** Trang bài Lập trình và STEM có "← Bài trước / Bài
      sau →" tính từ `Outline` (lá kế tiếp theo `order`, bỏ qua nút `locked`), giữ `?khoa=`; bài
      đầu/cuối ẩn nút tương ứng (không disabled giả). — `outlineNav.test.ts` (`prevNext(outline,
contentId)`) + E2E.
- [ ] **AC-15 Tìm theo bài/chủ đề, có đường dẫn chương.** Ô tìm trong rail/panel lọc lá theo
      `normalizeVi` (bỏ dấu, `đ→d`, không phân biệt hoa thường): gõ "roi tu do" tìm ra "Sự rơi
      tự do" kèm dòng phụ "Lớp 10 › Chương 2: Động học"; rỗng → "Không có bài nào khớp"
      (`role="status"`); xoá query → cây trở lại trạng thái mở/thu trước đó. — `normalizeVi.test.ts`,
      `OutlineTree.test.tsx`, E2E.
- [ ] **AC-16 Trạng thái tải/lỗi/rỗng.** Cây dựng đồng bộ từ chỉ mục nên không có "đang tải" cho
      cấu trúc; riêng lớp tiến độ (fetch `/api/programming/progress`) đến muộn → hiện cây với
      `unknown` rồi cập nhật, **không nhảy layout** (CLS đo bằng Playwright `layout-shift` < 0.1
      trên rail). Lỗi fetch tiến độ → cây vẫn dùng được + dòng "Chưa tải được tiến độ · Thử lại".
      — unit test 3 trạng thái + E2E chặn route API.
- [ ] **AC-17 Không vượt khoá; không tạo cơ chế nháp mới.** Khảo sát S08 (2026-09-15) xác nhận
      `ProgrammingLessonPage` HIỆN KHÔNG có nháp nào (`code` = `useState(starterCode)`, không
      storage) — vì vậy S07 KHÔNG hứa "giữ nháp khi đổi bài" và KHÔNG tự thêm storage; nháp/resume
      là việc của S08 (`learningSession.ts`). S07 chỉ bảo đảm: bấm bài khác qua mục lục khi đang
      gõ → có hộp xác nhận "Rời bài? Code chưa lưu sẽ mất" (`useBlocker`/`beforeunload` hiện có
      trong repo? — nếu chưa có thì confirm đơn giản, test canh). Bài trong bậc khoá → không có `<Link>`, chỉ `<span aria-disabled>` + lý do
      từ `loiGiaiThichKhoa`; gõ thẳng URL bài khoá vẫn bị chặn như hiện nay (server/route guard
      hiện hữu, S07 không đổi). — E2E + `ProgrammingLevelPage.test.tsx` ca Free P2 khoá (đang có)
      mở rộng kiểm rail.
- [ ] **AC-18 Nhìn bằng mắt (Tầng 8b) + a11y.** Ảnh 1440/768/390/320px TRƯỚC/SAU của: trang bài
      Lập trình (khoá Git + bậc P3), trang bậc P6 (mạch), trang bài Lí `ly10-c2-b10`, panel mobile
      mở; tên bài dài (≥ 80 ký tự) và chương 12 bài (Sinh 11-C1) không tràn; 5 theme. `e2e/a11y.spec.ts` + `a11y-aaa.spec.ts` thêm route trang bài có `?khoa=git` và một trang STEM có rail; 0 vi phạm.
- [ ] **AC-19 Ngân sách.** `npm run budget` sau `npm run build`: chunk trang bài Lập trình và
      STEM tăng ≤ 6 kB gzip mỗi chunk so với `main` (đo và dán số vào PR); **không** kéo
      `lessons.ts` 3 MB / 4 registry STEM ~2 MB vào chunk (kiểm bằng `npx vite-bundle-visualizer`
      hoặc `dist/assets` size — ghi số).

### S07-3 — Tiếng Anh: lộ trình CEFR

- [ ] **AC-20** `/lo-trinh-hoc/:levelId` (hoặc URL mới nếu slice 03 đã dời — §7 Q2) thay
      `masterList` (cột trái hiện tại, không có neo) bằng `OutlineTree` từ `buildCefrOutline`;
      unit đang học tự mở; hoạt động đã xong ✓; cấp khoá hiện đúng lý do server; mobile có nút
      "Mục lục cấp học" mở panel. `CefrLevelPage` KHÔNG đổi 5 tab học, `?tab=`/`?cap=` giữ nguyên
      (`session-cap.spec.ts`, `listening.spec.ts`, `quiz-*.spec.ts` xanh). — E2E
      `outline-english.spec.ts`; `a11y` route `/lo-trinh-hoc/a1`, `/c1` đã có sẵn.
- [ ] **AC-21** `/bai-hoc` (350 bài phẳng) và `/cau-thong-dung` **không** đổi trong S07 (chỉ có
      "đã xem" `et_viewed_*`, không phải evidence) — ghi rõ ở §① KHÔNG LÀM; nếu chủ dự án muốn
      cây theo `category` cho câu thông dụng thì tách slice.

**Lệnh chứng minh (mỗi PR con, trên checkout sạch):**

```bash
rm -rf packages/*/dist dist dist-server
npm run typecheck && npm run lint && npm run format && npm run build && npm run test:coverage
npm run budget
npx playwright test e2e/outline-programming.spec.ts e2e/outline-stem.spec.ts \
  e2e/outline-english.spec.ts e2e/a11y-modals.spec.ts e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts \
  e2e/mobile-layout-guards.spec.ts e2e/programming-lesson.spec.ts e2e/programming-course.spec.ts
```

## ① Phạm vi

**LÀM (theo PR con):**

**S07-1 — hợp đồng + adapter (0 thay đổi giao diện, có thể merge độc lập):**

1. `packages/core-contracts/outline.ts` + Zod + test (§③.1).
2. `packages/core-learner/outline/` — `outlineNav.ts` (`findNode`, `prevNext`, `pathTo`,
   `flattenLeaves`), `normalizeVi.ts` (rút từ `slugify` của `core-ui/slug.ts`, KHÔNG copy-paste:
   `slugify` gọi lại `normalizeVi`), test.
3. Adapter thuần, mỗi môn một file, KHÔNG React, KHÔNG fetch: `programmingOutline.ts`
   (`buildLevelOutline`, `buildCourseOutline`), `stemOutline.ts` (`buildStemOutline`),
   `cefrOutline.ts` (`buildCefrOutline`). Đặt trong `apps/dhcb/src/lib/outline/` vì cefr cần
   `apps/dhcb/src/data/*` (packages không được import apps) — programming/stem adapter có thể
   nằm ở `packages/core-learner/outline/` nếu chỉ import gói; quyết ở §7 Q3.
4. `programmingRoutes.ts`: thêm `duongDanBaiHoc(lesson, ctx?)` + `maKhoaTuQuery(searchParams)`;
   thay 2+ chỗ ghép chuỗi (`ProgrammingCoursePage`, `ProgrammingLevelPage`, chỗ khác `grep` ra).

**S07-2 — giao diện Lập trình + STEM:**

5. `packages/core-ui/OutlineTree.tsx` (+ test) và `Modal` thêm `variant?: 'center' | 'sheet'` +
   `createPortal` vào `document.body` (§③.5) — `useDialogBehavior` KHÔNG đổi (6 hành vi APG giữ
   nguyên, test hiện có xanh).
6. `apps/dhcb/src/components/OutlinePane.tsx` (mới): gói `TwoPane` + `OutlineTree` + nút/panel
   mobile + ô tìm + trạng thái tiến độ; nhận `outline`, `activeContentId`, `title`. Dùng ở:
   `ProgrammingLessonPage` (cây bậc hoặc cây khoá theo `?khoa=`), `ProgrammingCoursePage`,
   `ProgrammingLevelPage` (thay `TocRail` neo bằng `OutlineTree` — nhưng GIỮ thẻ "Tiến độ bậc"
   và chặng dự án), `StemLessonView`, `StemLessonList` (mobile: panel; desktop: cây thay `<ol>`
   hiện tại hoặc song song — chọn ở §7 Q4).
7. Prev/next ở `ProgrammingLessonPage` và `StemLessonView`; `Layout focus` cho hai trang STEM
   (đang gọi `<Layout />` trần — chế độ tập trung đã có, chỉ chưa dùng).
8. `sessionStorage` `ui_outline_open_<id>` cho mở/thu; đăng ký tiền tố `ui_` đã được AC-7 spec 02
   coi là ngoại lệ khi so khớp storage.
9. Breadcrumb: `breadcrumb.ts` nhận nút "Khoá <tên>" khi có `?khoa=` (chỉ thêm nút, không đổi
   cách khớp biên đoạn).
10. E2E mới 2 file, cập nhật `a11y*`, ảnh, changelog, `PROGRESS.md`, goal.

**S07-3 — Tiếng Anh:** 11. `CefrLevelPage`: `masterList` → `OutlinePane`; `EnglishHome` KHÔNG đổi. E2E + ảnh.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- KHÔNG tạo tiến độ/evidence cho STEM (không key `localStorage`, không endpoint, không cột DB,
  không tiền tố mới trong `guestProgress.ts`) — STEM hiện là `unknown` "chưa đo được" đúng luật
  spec nền; evidence STEM là slice **S11** (completion). Cây phải hiển thị được với `unknown`.
- KHÔNG đổi luật khoá (`levelLock.ts`, `cefrUnlock.ts`), ngưỡng `UNLOCK_PCT`, entitlement, gói
  Free/VIP, hạn mức khách, `RequireAccount`/`AllowGuest`.
- KHÔNG viết lại `TocRail`, `TwoPane`, `useActiveSection`, `useDialogBehavior`, `DesktopSidebar`,
  `BottomNav`; KHÔNG thêm nhánh chương/bài vào sidebar (sidebar dừng ở cấp môn — spec cha §③).
- KHÔNG đổi mã bài/unit/khoá, thứ tự registry, `lessonsLazy.ts` (file sinh), `LessonSummary`
  (thêm `order`/`levelId` vào chỉ mục là cám dỗ nhưng thứ tự đã là thứ tự mảng và
  `getLevelIdOfLesson` đã có — không đụng file sinh).
- KHÔNG cài thư viện mới (tree/virtualize/fuzzy). Cây lớn nhất đo được: Lí 94 bài, C2 44 unit ×
  ~3–5 hoạt động ≈ 200 lá — render thẳng, không cần virtualize.
- KHÔNG dựng mục lục cho `/bai-hoc`, `/cau-thong-dung`, `/truyen-song-ngu`, `/luyen-nghe`
  (Listening đã có `TocRail` neo, giữ nguyên), hướng chuyên sâu/lộ trình mục tiêu (chặng chứa
  module + dự án, không chứa bài — cây khác kiểu, tách slice sau khi có S08 resume).
- KHÔNG dùng `STEM_CURRICULUM` (`data/stemCurriculum.ts`) làm nguồn cây — đó là taxonomy "đề mẫu
  cho AI giải" song song và lệch (`grade_12` vs `'12'`); nguồn duy nhất là `StemLessonLoader.index`.
- KHÔNG thêm parser toán, KHÔNG đổi renderer, KHÔNG đụng host mode/DNS/cookie.

## ② Điểm chạm (đã khảo sát thật trên `7c2d81c`)

| PR  | Việc | Đường dẫn file                                                                                            | Ghi chú khảo sát                                                                                                                                                                                                 |
| --- | ---- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Thêm | `packages/core-contracts/outline.ts` (+ `.test.ts`)                                                       | Cạnh `subjectManifest.ts`, `stemLesson.ts`. Zod đã có trong gói.                                                                                                                                                 |
| 1   | Thêm | `packages/core-learner/outline/{outlineNav,normalizeVi}.ts` (+ test)                                      | Gói phẳng, không có `src/`; thêm thư mục con là hợp lệ (tsconfig composite `include` cần kiểm — xem `packages/core-learner/tsconfig.json`).                                                                      |
| 1   | Sửa  | `packages/core-ui/slug.ts`                                                                                | `slugify` gọi `normalizeVi` — nhưng `core-ui` → `core-learner` có thể tạo vòng phụ thuộc; nếu `npm run codemap -- cycles` báo thì đặt `normalizeVi` ở `core-ui/normalizeVi.ts` thay vì `core-learner`.           |
| 1   | Thêm | `apps/dhcb/src/lib/outline/{programmingOutline,stemOutline,cefrOutline}.ts` (+ test)                      | Import: `@dhcb/subject-programming/{curriculum,lessonsLoader,courses/registry,levelLock}`, `lib/stemLessonRoutes` (`STEM_SUBJECTS`), `data/cefrTypes`, `lib/cefrProgress`, `lib/vocab`.                          |
| 1   | Sửa  | `apps/dhcb/src/lib/programmingRoutes.ts` (+ test)                                                         | Thêm `duongDanBaiHoc`, `maKhoaTuQuery`. File cố ý không import registry — giữ nguyên tính chất (chỉ nhận `Pick<…,'id'\|'title'>`).                                                                               |
| 1   | Sửa  | `ProgrammingCoursePage.tsx`, `ProgrammingLevelPage.tsx`                                                   | Thay chuỗi `/lap-trinh/bai-hoc/${buildSlugSegment(...)}` bằng `duongDanBaiHoc`. Course page truyền `{courseId}`.                                                                                                 |
| 2   | Thêm | `packages/core-ui/OutlineTree.tsx` (+ test)                                                               | Dùng `Link` từ `react-router-dom` — kiểm `core-ui` đã phụ thuộc react-router chưa (`grep -l react-router packages/core-ui/*.tsx`); nếu chưa, nhận prop `renderLink` để không thêm dependency vào gói.            |
| 2   | Sửa  | `apps/dhcb/src/components/Modal.tsx` (+ `Modal.test.tsx`)                                                 | `variant:'sheet'` (đáy, `max-h-[85dvh]`, `rounded-t-2xl`, `env(safe-area-inset-bottom)`), `createPortal(document.body)`. 20 file đang dùng `Modal`/hook → mặc định `center` giữ y nguyên; test render 2 variant. |
| 2   | Thêm | `apps/dhcb/src/components/OutlinePane.tsx` (+ test)                                                       | Hợp `TwoPane` + `OutlineTree` + nút mobile + panel + ô tìm + fetch tiến độ (Lập trình).                                                                                                                          |
| 2   | Sửa  | `apps/dhcb/src/pages/subjects/programming/ProgrammingLessonPage.tsx` (+ test MỚI)                         | 467 dòng, hiện KHÔNG có test, KHÔNG prev/next, `backTo` ghép `/lap-trinh/${levelId}` không slug (đổi sang `duongDanBac`). Đọc `?khoa=` → chọn cây. `Layout focus` đang có.                                       |
| 2   | Sửa  | `ProgrammingCoursePage.tsx` (+ test MỚI), `ProgrammingLevelPage.tsx` (+ test đang có)                     | Course page hiện không có test. Level page giữ thẻ "Tiến độ bậc" + chặng dự án trong rail.                                                                                                                       |
| 2   | Sửa  | `apps/dhcb/src/pages/learning/StemLessonView.tsx`, `StemLessonList.tsx` (+ `StemLesson.test.tsx`)         | View: 238 dòng, chỉ 1 link về danh sách; thêm rail + prev/next + `Layout focus`. List: giữ nút lớp/nhánh, phần thân có thể tái dùng `OutlineTree` (Q4).                                                          |
| 2   | Sửa  | `apps/dhcb/src/lib/breadcrumb.ts` (+ test)                                                                | Nút "Khoá <tên>" khi có `?khoa=`; `buildCrumbs` hiện chỉ nhận `pathname` — cần thêm tham số tuỳ chọn `search`, KHÔNG đổi chữ ký cũ (81 file ảnh hưởng qua `Layout`).                                             |
| 2   | Thêm | `e2e/outline-programming.spec.ts`, `e2e/outline-stem.spec.ts`                                             | Sidebar thu gọn, `?khoa=`, prev/next, panel mobile @390/@320, tìm kiếm, chặn API tiến độ.                                                                                                                        |
| 2   | Sửa  | `e2e/a11y.spec.ts`, `e2e/a11y-aaa.spec.ts`, `e2e/a11y-modals.spec.ts`, `e2e/mobile-layout-guards.spec.ts` | Thêm route bài có rail + panel; mobile guard thêm `/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do` (hiện chưa có route môn nào).                                                                         |
| 3   | Sửa  | `apps/dhcb/src/pages/subjects/english/CefrLevelPage.tsx` (1229 dòng)                                      | Dòng 348 `masterList` → `OutlinePane`; rail ẩn khi `locked` giữ nguyên; `UnitSection` giữ cho cột phải.                                                                                                          |
| 3   | Thêm | `e2e/outline-english.spec.ts`                                                                             |                                                                                                                                                                                                                  |

**Ảnh hưởng lan ra (đo `npm run codemap -- impact`, 2026-09-15 trên `7c2d81c`):**

- `packages/core-ui/TocRail.tsx` → **7 file** (trực tiếp: `Listening.tsx`, `ProgrammingLevelPage.tsx`,
  `ProgrammingCoursePage.tsx`, test) — S07 không đổi hành vi, chỉ dùng thêm.
- `packages/core-ui/TwoPane.tsx` → **15 file** (11 trang trực tiếp: `Home`, `Dashboard`, `Profile`,
  `Writing`, `Listening`, `StoryReader`, `Lessons`, `CefrLevelPage`, 3 trang Lập trình) — KHÔNG đổi.
- `apps/dhcb/src/lib/programmingRoutes.ts` → **17 file** (10 trang Lập trình + `programmingRoutesSpec.ts`)
  — chỉ thêm hàm, không đổi hàm cũ.
- `apps/dhcb/src/lib/stemLessonRoutes.ts` → **10 file** (gồm `AdminStemReviewPanel`, `SubjectDetail`)
  — không đổi.
- `apps/dhcb/src/components/Modal.tsx` → 20 file dùng `Modal`/hook (đếm bằng grep) — thêm prop mặc
  định, không đổi hành vi cũ; test render mọi variant. Portal đổi vị trí DOM: E2E dùng
  `getByRole('dialog')` không bị ảnh hưởng, nhưng test unit đang `container.querySelector` bên
  trong wrapper sẽ đỏ → sửa test sang `screen.getByRole`.
- `apps/dhcb/src/lib/breadcrumb.ts` → 81 file qua `Layout` (đo ở spec 02) — chỉ thêm tham số tuỳ chọn.

## ③ Hợp đồng

### 3.1 Kiểu cây dùng chung (`packages/core-contracts/outline.ts`)

```ts
export type OutlineKind = 'level' | 'chapter' | 'lesson' | 'activity'
export type OutlineAvailability = 'available' | 'locked'
export type OutlineProgress = 'unknown' | 'not-started' | 'in-progress' | 'completed'

export interface OutlineNode {
  nodeId: string // duy nhất trong cây: `${kind}:${contentId}` (+ `@${courseId}` nếu có)
  parentId?: string
  subjectId: string // 'programming' | 'mathematics' | ... | 'english'
  courseId?: string // khoá ngắn Lập trình; cấp CEFR dùng levelId ở contentId, không dùng courseId
  contentId?: string // lessonId / unitId / chapterNumber / circleId / grammarId
  kind: OutlineKind
  title: string
  hint?: string // "4 bài" · "sắp mở" · "Cấp tỉnh" — chữ, không màu
  order: number // 0-based trong cùng parentId, duy nhất
  href?: string // BẮT BUỘC với lesson/activity available; luôn là route nội bộ, giữ ngữ cảnh khoá
  availability: OutlineAvailability
  lockReason?: string // chữ giải thích từ luật khoá hiện có, KHÔNG tự bịa
  progress: OutlineProgress
  evidenceSource?: string // bắt buộc khi completed/in-progress: 'programming.progress' | 'english.vocab' | ...
}

export interface Outline {
  rootId: string // nút level/course
  subjectId: string
  courseId?: string
  nodes: readonly OutlineNode[] // đã sắp theo thứ tự duyệt trước (pre-order)
  builtAt: number // Date.now() — để UI biết lớp tiến độ cũ/mới
}
export const OutlineSchema: z.ZodType<Outline>
```

**Luật cây:** "đang mở" là trạng thái route (`activeContentId` truyền vào UI), KHÔNG ghi vào
`progress`. Không sinh tầng rỗng: chapter không có lá thì bỏ (trừ unit Lập trình "sắp mở" — giữ
nút chapter với `hint`, không có con, vì đó là thông tin có chủ đích cho người học). `completed`
chỉ khi adapter có evidence từ nguồn domain (bảng 3.3); "đã mở trang" không bao giờ là evidence.

### 3.2 Adapter (hàm thuần, đồng bộ, không fetch)

```ts
// Lập trình
interface ProgrammingCtx {
  progress: readonly ProgrammingLessonProgress[] // [] khi chưa tải / lỗi
  progressState: 'loading' | 'ready' | 'error' // → progress 'unknown' khi != ready
  lockMap: ReadonlyMap<string, LevelLockInfo> // từ levelLockMap(); rỗng = không khoá
}
buildLevelOutline(levelId: ProgrammingLevelId, ctx): Outline | undefined // undefined khi id lạ
buildCourseOutline(courseId: ShortCourseId, ctx): Outline | undefined

// STEM
buildStemOutline(subjectId: StemSubjectId, grade: string): Outline | undefined // progress luôn 'unknown'

// Tiếng Anh
interface CefrCtx {
  learned: ReadonlySet<string>; doneGrammar: ReadonlySet<string>; viewedDialogues: ReadonlySet<string>
  lockedMap: ReadonlyMap<CefrLevelId, { locked: boolean; reason?: string }>
  circles: ReadonlyMap<string, Circle> // từ loadFoundation() đã có trong trang
}
buildCefrOutline(level: CefrLevel, ctx: CefrCtx): Outline

// Điều hướng
prevNext(outline, contentId): { prev?: OutlineNode; next?: OutlineNode } // bỏ qua locked
pathTo(outline, nodeId): OutlineNode[] // [root, ..., node] cho dòng phụ tìm kiếm + breadcrumb
normalizeVi(s: string): string // NFD, bỏ dấu, đ→d, lowercase, gộp khoảng trắng
```

**URL bài Lập trình có ngữ cảnh khoá:**

```ts
duongDanBaiHoc(lesson: Pick<LessonSummary,'id'|'title'>, ctx?: { courseId?: string }): string
// → `/lap-trinh/bai-hoc/<id>--<slug>` hoặc `…?khoa=<courseId>`
maKhoaTuQuery(search: URLSearchParams): ShortCourseId | undefined // id lạ → undefined
```

Chọn **query `?khoa=`** thay vì route lồng `/lap-trinh/khoa-hoc/:courseId/bai-hoc/:lessonId` vì:
(1) một bài = một URL chuẩn cho SEO/bookmark, khoá chỉ là ngữ cảnh; (2) không phải thêm route,
`CourseRedirect`, alias server; (3) canonical-slug redirect hiện có đã giữ query (slice 01 AC).
Trả giá: `?khoa=` không được index như trang riêng — chấp nhận. (§7 Q1 cho chủ dự án.)

### 3.3 Payload metadata · khoá · evidence từng môn (bảng adapter — yêu cầu spec nền §④ C)

| Môn              | Nguồn cây (chỉ mục nhẹ, KHÔNG nội dung)                                                                                                      | Tầng                                                              | Khoá (nguồn sự thật)                                                                                          | Evidence tiến độ                                                                                                       | Ca bẫy dữ liệu đã thấy                                                                                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lập trình — bậc  | `PROGRAMMING_LEVELS[].units` (118 unit) + `getUnitSummaries(unitId)` từ `LESSON_INDEX` (373 bài, 157 loader)                                 | level → (track chỉ P6) → chapter=unit → lesson                    | `levelLockMap()` client-persist trên luật thuần `computeLevelLockMap` (70%, VIP mở hết); nợ: khoá ở CLIENT    | `/api/programming/progress` → `status in_progress/completed`; khách: `dhcb_prog_progress_<guest>` là nguồn sự thật     | `LessonSummary` không có `order`/`levelId`: thứ tự = thứ tự mảng chỉ mục (test `lessonsLazy.test.ts` canh khớp registry); bậc suy bằng `getLevelIdOfLesson`                          |
| Lập trình — khoá | `SHORT_COURSES[].chapters[].lessonIds` (11 khoá) + `getLessonSummary`                                                                        | course → chapter → lesson                                         | Không khoá                                                                                                    | Như trên (cùng `lessonId`)                                                                                             | **Một bài nhiều khoá**: `git-c1` ⊃ `p3-u10-l1/l2`; `ml` ∩ `mlds` = 10 bài → href PHẢI mang `?khoa=`                                                                                  |
| STEM (4 môn)     | `STEM_SUBJECTS[id].loader.index` (`StemLessonSummary`: grade, chapterNumber, chapterTitle, lessonNumber, track, tier)                        | level=lớp → chapter=chapterNumber → lesson; + chapter HSG         | Không khoá, `AllowGuest`                                                                                      | **KHÔNG CÓ** (không key, không API, không DB) → `unknown` "chưa đo được"; evidence là S11                              | Hoá HSG: 15 chương 1 bài, trùng `chapterTitle` → gom theo `chapterNumber`; Sinh: `chapterKey` ≠ chương (9 tệp gom nhiều chương), advanced = 0; Toán: 9 chương 1 bài; Lí 10-C3 10 bài |
| Tiếng Anh — CEFR | `loadCefr()` (`/data/cefr.json`, đã fetch sẵn ở `CefrLevelPage`): `level.units[].{grammar[], vocabCircleIds[]}` + vòng từ `loadFoundation()` | level=cấp → chapter=unit → activity (vòng · ngữ pháp · hội thoại) | `computeUnlockedLevels` SERVER (VIP / thi đạt cấp trước / grandfathered); client `computeLockedMapFromServer` | `et_learned_<uid>` (vòng 100%), `et_cefr_grammar_<uid>` (union server), `et_cefr_dialogue_<uid>`; `pushProgress` đã có | Unit ≫ bài ngữ pháp (B2: 43 unit / 14 bài) → không sinh nút ngữ pháp rỗng; `cefr.json` nặng nhưng đã nằm trong trang, adapter không fetch thêm                                       |
| Tiếng Anh — khác | `/bai-hoc` 350 bài phẳng, `/cau-thong-dung` 1000 mẫu có `category`                                                                           | —                                                                 | —                                                                                                             | Chỉ `et_viewed_*` (không sync) — KHÔNG phải evidence                                                                   | Ngoài phạm vi S07                                                                                                                                                                    |

### 3.4 Ca lỗi (là hợp đồng)

| Tình huống                                                                                           | Hành vi mong đợi                                                                                                                      |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `buildLevelOutline('p9')`, `buildCourseOutline('x')`                                                 | `undefined`, không ném; trang xử lý như hiện nay (`Navigate` về `/lap-trinh`)                                                         |
| `?khoa=<id lạ>` hoặc bài không thuộc khoá đó                                                         | Bỏ query, dùng cây bậc; không redirect vòng; không lỗi console                                                                        |
| Bài có `getLevelIdOfLesson` = `undefined` (bài chỉ thuộc khoá, vd `pyai-u1-l1`) mở KHÔNG có `?khoa=` | Không có cây bậc → rail hiện "Bài này thuộc khoá: <danh sách khoá chứa nó>" (tra `SHORT_COURSES`) với link về khoá; không trắng trang |
| Tiến độ Lập trình fetch lỗi                                                                          | `progressState:'error'` → mọi lá `unknown` + dòng "Chưa tải được tiến độ · Thử lại"; cây vẫn bấm được                                 |
| Chỉ mục STEM có `grade` không nằm trong `STEM_SUBJECTS[id].grades`                                   | Bài vẫn vào cây dưới lớp của nó (không mất bài); test canh không rớt bài nào                                                          |
| `sessionStorage` bị chặn (private mode)                                                              | try/catch; mặc định mở chương hiện tại, thu các chương khác                                                                           |
| `IntersectionObserver` không có (test/SSR)                                                           | Không tô sáng theo cuộn; `aria-current` vẫn đúng theo route                                                                           |
| Panel mobile mở rồi xoay ngang ≥ 1024px                                                              | Panel đóng, rail desktop hiện; focus không rơi vào `body` (đưa về nút mở hoặc `h1`)                                                   |

### 3.5 Panel mobile (`Modal variant="sheet"`)

- Cùng `useDialogBehavior` (6 hành vi APG giữ nguyên), thêm: neo đáy, `max-h-[85dvh]`, `overflow-y-auto`
  trong panel, `padding-bottom: env(safe-area-inset-bottom)`, `rounded-t-2xl`, backdrop bấm đóng.
- `createPortal(document.body)` cho **cả hai** variant — hiện Modal render tại chỗ (grep `portal`
  = 0) nên panel mở từ trong `TwoPane`/vùng có `overflow` sẽ bị cắt; portal là điều kiện để rail
  và panel dùng chung một cây.
- Đóng sau khi chọn bài: `onClose()` rồi `requestAnimationFrame(() => h1.focus())` — `h1` trang
  bài phải có `tabIndex={-1}` (`ProgrammingLessonPage`, `StemLessonView`, `CefrLevelPage`).

## ⑤ Bất biến không được phá

| Bất biến                                                                         | Test canh                                                                                                                                          |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Không tải nội dung bài để dựng mục lục                                           | spy `loadLesson`/`loadUnitLessons` = 0 trong 3 adapter test; `lessonsLazy.test.ts` (chỉ mục khớp registry)                                         |
| `TocRail` giữ nguyên hành vi (3 nơi dùng)                                        | `TocRail.test.tsx` 7 ca; E2E `programming-lesson.spec.ts:491` (P6 mạch)                                                                            |
| Luật khoá không đổi, server là authority (CEFR); client-lock Lập trình không nới | `levelLock.test.ts`, `programmingLevelLock.test.ts`, `cefrUnlock.test.ts`, `ProgrammingLevelPage.test.tsx` (Free P2 khoá)                          |
| "Mở bài" không là hoàn thành                                                     | `OutlineTree.test.tsx`, E2E `outline-stem.spec.ts`                                                                                                 |
| Không mất nháp/tiến độ khách; không khoá storage mới ngoài `ui_*`                | `guestProgress.test.ts`, snapshot storage E2E (khuôn AC-7 spec 02)                                                                                 |
| Modal cũ (20 nơi) không đổi hành vi; 6 hành vi APG                               | `useDialogBehavior.test.tsx`, `Modal.test.tsx` (mới), `e2e/a11y-modals.spec.ts`                                                                    |
| Một bài = một URL chuẩn; slug redirect giữ query; không loop                     | `programmingRoutes.test.ts`, `ProgrammingLessonPage.test.tsx`, `route-alias.spec.ts`                                                               |
| Sidebar dừng ở cấp môn; mục lục sống trong vùng nội dung                         | `navTree.test.ts` (không thêm mục con), E2E "sidebar thu gọn" AC-10                                                                                |
| Mobile: lề dưới ≥ bottom nav, CTA bấm được; a11y AA + AAA 5 theme                | `mobile-layout-guards.spec.ts` (+ route STEM), `a11y.spec.ts`, `a11y-aaa.spec.ts`                                                                  |
| Ngân sách bundle/coverage không tụt                                              | `npm run budget`, `npm run test:coverage` (sàn thật 93/89/93/93 theo `vitest.config.ts` — CLAUDE.md/PROGRESS ghi 97/93/96/97 là lỗi thời, S13 sửa) |

## ⑥ Quy ước dự án liên quan (bên thi hành không thấy hội thoại)

- Import xuyên gói `@dhcb/<gói>/<file>` không đuôi `.js`; nội bộ gói đường tương đối có `.js`;
  `packages/` không import `apps/`; `core-ui` không được kéo `react-router` nếu chưa có (kiểm).
- URL dựng qua MỘT hàm (`programmingRoutes.ts`, `stemLessonRoutes.ts`); khuôn `<mã>--<slug>`;
  `idFromSlugSegment` để đọc. Khớp tiền tố theo biên đoạn.
- Chữ nội dung AAA (≥ 7:1), nút/nhãn AA; màu từ token `--a-*`/`--z-*`; trạng thái phải có CHỮ
  hoặc icon kèm chữ, không chỉ màu; vùng chạm ≥ 44px (`tap-44`); `text-[#fff]` trên nền cố định tối.
- Quyết định responsive bằng JS (`useIsDesktopViewport`), không `lg:hidden` — để DOM không có hai
  bản mục lục (a11y + Playwright strict mode) — bất biến ghi ở đầu `TwoPane.tsx`.
- Thêm/đổi bài học Lập trình/STEM KHÔNG thuộc S07; nếu lỡ chạm thì `npm run gen:lesson-index` /
  `gen:stem-lesson-index`.
- Đổi UI → ảnh 1440/768/390/320 trước/sau (QUY-TRINH-AUDIT Tầng 8b) dán vào PR; a11y AA + AAA.
- Test đỏ trước khi sửa `Modal.tsx` (20 nơi dùng) và `breadcrumb.ts` (81 file).
- PR: `feat(learning): …` với mô tả dẫn file này + "Approved for implementation"; đủ 6 tiêu đề
  cổng `metadata`; READY; bật auto-merge (squash) ngay sau tạo; CI đỏ là việc của PR.
- Cổng trên checkout sạch (`rm -rf packages/*/dist dist dist-server`), `npm ci` trước lần chạy
  đầu; cổng test CI là `test:coverage`.

## 7. Quyết định cần chủ dự án chốt trước khi Approved

> **CHỐT 2026-09-15 — chủ dự án:** lấy TOÀN BỘ cột "Đề xuất của AI (mặc định)"
> làm quyết định cuối cho mọi câu hỏi trong bảng dưới. Không có ý kiến khác.

| #   | Câu hỏi                                                                                                                                                                               | Đề xuất của AI (mặc định nếu không có ý kiến khác)                                                                                                               | Lý do                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Ngữ cảnh khoá trong URL bài Lập trình: query `?khoa=git` hay route lồng `/lap-trinh/khoa-hoc/git--…/bai-hoc/…`?                                                                       | **Query `?khoa=`.**                                                                                                                                              | Một bài một URL chuẩn; không thêm route/alias server; slug redirect đã giữ query. Route lồng đẹp hơn cho SEO khoá nhưng nhân đôi URL của cùng nội dung.                         |
| Q2  | S07 có phải đợi 02–04 merge không (goal ghi "Dependency: 04")? **Cập nhật: 02–04 đã merge ở #929 (`main` `8d5abe4`) — câu hỏi hết hiệu lực; S07-3 chỉ cần kiểm URL lộ trình sau 03.** | **S07-1 và S07-2 KHÔNG đợi** (Lập trình/STEM không chạm entry English, không chạm default `'english'`). **S07-3 đợi slice 03** vì 03 có thể dời `/lo-trinh-hoc`. | Tránh nghẽn: 02 đang chờ Q1–Q3, 03/04 chưa READY. Mục lục Lập trình/STEM là giá trị người học thấy ngay.                                                                        |
| Q3  | Adapter đặt ở `packages/core-learner/outline/` (Lập trình + STEM, import gói) và `apps/dhcb/src/lib/outline/` (CEFR, cần `data/*`)?                                                   | **Có, tách như vậy.**                                                                                                                                            | `packages/` không import `apps/`; CEFR data sống trong app. Hợp đồng `OutlineNode` vẫn một chỗ ở `core-contracts`.                                                              |
| Q4  | `StemLessonList` (trang danh sách bài STEM) sau S07: thay thân bằng `OutlineTree` (một mã nguồn cho cây) hay giữ `<ol>` hiện có và chỉ thêm rail ở trang bài?                         | **Thay thân bằng `OutlineTree`** (giữ nút lớp + nhánh + tóm tắt chưa duyệt).                                                                                     | Một cây một mã; `StemLesson.test.tsx` 10 ca chạy dữ liệu thật sẽ canh không rớt bài.                                                                                            |
| Q5  | Tiến độ STEM: chấp nhận hiển thị "chưa đo được" trong S07 và để evidence cho S11?                                                                                                     | **Chấp nhận.** Không tạo key/API tạm.                                                                                                                            | Spec nền cấm coi mở bài là hoàn thành; làm evidence tạm bằng localStorage sẽ thành nợ phải migrate. S11 định nghĩa "hoàn thành" = trả lời đúng câu tự kiểm tra? Cần spec riêng. |

## 8. Rủi ro và giảm thiểu

| Rủi ro                                                                                     | Giảm thiểu                                                                                                                         |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `createPortal` trong `Modal` làm 20 nơi dùng đổi vị trí DOM → test unit `querySelector` đỏ | Chạy `npm test` sau khi thêm portal, sửa test sang `screen.getByRole`; variant mặc định `center` không đổi CSS                     |
| `core-ui` → `core-learner` tạo vòng phụ thuộc khi `slugify` gọi `normalizeVi`              | `npm run codemap -- cycles` trước khi chọn chỗ đặt; mặc định đặt ở `core-ui`                                                       |
| Cây C2 (44 unit × 3–5 hoạt động) + `cefr.json` làm trang cấp chậm hơn                      | Adapter O(n) đồng bộ, `useMemo` theo `[level, learned, doneGrammar]`; đo `performance.now()` < 16 ms trong test; không virtualize  |
| `?khoa=` bị mất ở một chỗ điều hướng nào đó (Home "học tiếp", `pickNextLesson`)            | `pickNextLesson` chỉ duyệt xương sống → không có khoá, đúng; E2E Back/Forward/reload; `duongDanBaiHoc` là chỗ duy nhất tạo URL bài |
| Người dùng lệ thuộc `TocRail` neo ở trang bậc bị đổi sang cây route                        | Trang bậc giữ neo `#unit-…` cho cây (lá = link route, chương = neo) — kiểm bằng E2E P6 hiện có                                     |
| Mobile 320px: tên bài dài + dòng phụ đường dẫn chương tràn                                 | `line-clamp-2`, `break-words`; ảnh 320px là AC-18                                                                                  |
| Coverage tụt vì thêm nhiều nhánh UI                                                        | Adapter thuần test 100%; `OutlineTree` ≥ 8 ca; `npm run budget` trước push                                                         |

## 9. Kế hoạch thi hành (3 PR, tuần tự; mỗi PR một subagent, agent chính review)

1. **S07-1 `feat(learning): hop dong muc luc OutlineNode + adapter 3 mon`** — contracts + nav +
   normalizeVi + 3 adapter + `duongDanBaiHoc` + thay chỗ ghép chuỗi. Không đổi UI. Cổng đầy đủ.
   Có thể merge dù 02 chưa xong.
2. **S07-2 `feat(learning): muc luc mon/khoa trong vung hoc Lap trinh va STEM`** — `OutlineTree`,
   `Modal sheet+portal`, `OutlinePane`, 5 trang, prev/next, breadcrumb khoá, E2E, ảnh, a11y.
3. **S07-3 `feat(learning): muc luc cap CEFR mon Tieng Anh`** — sau slice 03 merge (Q2).
4. Mỗi PR: changelog `docs/changelog/03xx-*.md`, `PROGRESS.md` bảng slice, goal bảng S07 (Issue/PR/
   State/Evidence), đổi trạng thái ở spec này.

**Rollback:** revert PR tương ứng; không migration/schema; `?khoa=` là query — URL không có
query vẫn hợp lệ trước và sau; `sessionStorage ui_outline_*` tự hết khi đóng tab.

## 19. Phê duyệt

- [x] Product outcome và scope (Q1–Q5)
- [x] UX/accessibility (5 trạng thái, panel mobile, ≤ 2 thao tác)
- [x] Architecture (hợp đồng `OutlineNode`, adapter thuần, `?khoa=`, portal)
- [x] Test/rollout/rollback (3 PR)

**Kết luận:** Approved for implementation  
**Người duyệt:** Chủ dự án  
**Ngày:** 2026-09-15

**Tiến độ thi hành:** S07-1 ✅ (changelog `0330-2026-09-15-s07-1-hop-dong-muc-luc-va-adapter.md`) —
AC-1…AC-7 đạt. **Lệch có chủ đích so với Q3:** adapter Lập trình và CEFR nằm ở
`apps/dhcb/src/lib/outline/`, chỉ adapter STEM ở `packages/core-learner/outline/` (để adapter Lập
trình ở gói sẽ tạo vòng phụ thuộc `core-learner ↔ subject-programming` — xem changelog). S07-2 và
S07-3 chưa làm.
