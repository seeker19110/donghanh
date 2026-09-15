# 0330 — 2026-09-15 — S07-1: hợp đồng mục lục `OutlineNode` + adapter 3 môn (không đổi giao diện)

**PR:** (điền khi tạo) · **Đặc tả:** `docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md`
(Approved for implementation; Q1–Q5 theo cột "Đề xuất của AI") · **Goal:**
`docs/goals/2026-09-15-learning-ux.md` dòng S07.

PR đầu trong ba PR của slice S07. **Không có thay đổi giao diện nào** — chỉ dựng hợp đồng cây,
điều hướng trong cây, ba adapter thuần và một hàm dựng URL bài học. Rail/panel là S07-2, lộ trình
CEFR là S07-3.

## Đã làm

- **Hợp đồng chung** `packages/core-contracts/outline.ts`: `OutlineNode` · `Outline` ·
  `OutlineKind/Availability/Progress` + `OutlineSchema` (Zod). Schema canh những luật kiểu
  TypeScript không nói được: `nodeId` duy nhất · `rootId` có thật · `parentId` trỏ nút có thật ·
  `order` duy nhất trong cùng cha · **lá mở BẮT BUỘC có `href`** · **`completed`/`in-progress`
  BẮT BUỘC có `evidenceSource`** (không có bằng chứng thì không được nói là đã xong).
- **Điều hướng** `packages/core-learner/outline/outlineNav.ts`: `findNode` · `findLeafByContentId` ·
  `childrenOf` · `pathTo` (có chặn vòng) · `flattenLeaves` · `prevNext` — `prevNext` **bỏ qua lá
  khoá** để nút "bài tiếp theo" không dẫn người học vào ổ khoá.
- **`normalizeVi`** `packages/core-learner/outline/normalizeVi.ts`, và `@core/slug` `slugify` gọi
  lại nó (không chép lại bước bỏ dấu ra hai nơi).
- **Adapter STEM** `packages/core-learner/outline/stemOutline.ts`: `lớp → chương → bài` gom theo
  `chapterNumber` (không theo `chapterTitle` — bẫy Hoá; không theo `chapterKey` — bẫy Sinh), nhánh
  HSG là một chương riêng và **vắng hẳn khi rỗng** (Sinh có 0 chuyên đề). Mọi bài `progress:'unknown'`
  = "chưa đo được" (Q5: bằng chứng hoàn thành là việc của S11, không tạo khoá/API tạm).
- **Adapter Lập trình** `apps/dhcb/src/lib/outline/programmingOutline.ts`: `buildLevelOutline`
  (P6 thêm tầng mạch theo `UNIT_TRACKS`, unit chưa soạn bài giữ nút chương với hint "sắp mở") và
  `buildCourseOutline` (`course → chương → bài`, mọi nút mang `courseId`). Khoá bậc đọc thẳng
  `LevelLockInfo`, **không tính lại luật**; tiến độ chưa tải/lỗi → mọi bài `unknown`.
- **Adapter Tiếng Anh** `apps/dhcb/src/lib/outline/cefrOutline.ts`: `cấp → unit → hoạt động` với
  đúng thứ tự ① vòng từ vựng ② bài ngữ pháp ③ hội thoại; unit không có ngữ pháp thì không sinh nút
  rỗng; khoá cấp đọc bản đồ của server.
- **URL bài học Lập trình về MỘT hàm**: `duongDanBaiHoc(lesson, { courseId })` trong
  `programmingRoutes.ts` (+ `maKhoaTuQuery` ở `programmingRoutesSpec.ts`, nơi được phép tra
  registry). Thay 6 chỗ đang tự ghép chuỗi: `ProgrammingAbout` · `ProgrammingHome` ·
  `ProgrammingReview` · `ProgrammingPathStagePage` · `ProgrammingCoursePage` (truyền `courseId`) ·
  `ProgrammingLevelPage`.
- **Sửa một lỗi đường dẫn có thật**: chuyển hướng canonical ở `ProgrammingLessonPage` trước đây
  **vứt query** — link cũ (chỉ có mã) kèm `?khoa=` sẽ mất ngữ cảnh khoá. Nay giữ `location.search`.

## Quyết định trong lúc thi hành (lệch đặc tả, có lý do)

- **Adapter Lập trình và CEFR đặt ở `apps/dhcb/src/lib/outline/`, chỉ adapter STEM ở
  `packages/core-learner/outline/`** — đặc tả §7 Q3 định để cả Lập trình + STEM ở gói. Lý do:
  `packages/subject-programming/tsconfig.json` ĐÃ tham chiếu `core-learner`, nên adapter Lập trình
  nằm ở `core-learner` là **vòng phụ thuộc** project references (`tsc -b` từ chối); thêm nữa URL do
  `lib/programmingRoutes.ts` dựng mà `packages/` không được import `apps/`. Adapter STEM không dính
  hai ràng buộc đó (nhận `loader` và `buildHref` qua tham số) nên vẫn ở gói. Hợp đồng `OutlineNode`
  vẫn nằm MỘT chỗ ở `core-contracts`, đúng tinh thần Q3.
- **`href` của hoạt động CEFR** dựng bằng `duongDanHoatDongCefr(levelId, unitId, kind, contentId)`
  → `/lo-trinh-hoc/<cấp>?unit=<unit>&hd=<loại>:<mã>`, vì ba hoạt động này là màn CON của
  `CefrLevelPage` chứ không có route riêng, trong khi hợp đồng đòi lá mở phải có `href`. **S07-3
  phải đọc đúng hai tham số này** (hoặc đổi cả hai nơi cùng lúc).
- **Hội thoại là MỘT hoạt động cho cả unit**, "đã xem" khi có ít nhất một khoá
  `dialogueKey(unitId, …)` — danh sách hội thoại nạp bất đồng bộ nên adapter thuần không đếm được
  tổng.
- `maKhoaTuQuery` đặt ở `programmingRoutesSpec.ts` chứ không phải `programmingRoutes.ts`: file kia
  cố ý không kéo registry nào (10 chunk dùng chung nó).

## Bằng chứng (đo thật 2026-09-15)

- `npm run build` ✅ · `npm run typecheck` ✅ (chạy lại sau `rm -rf packages/*/dist dist dist-server`) ·
  `npm run lint` ✅ 0 cảnh báo · `npm run format` ✅ · `npm run test:coverage` ✅.
- Test mới: `packages/core-contracts/outline.test.ts` (12) · `outline/normalizeVi.test.ts` (5) ·
  `outline/outlineNav.test.ts` (9) · `outline/stemOutline.test.ts` (12, **dữ liệu thật bốn môn**) ·
  `lib/outline/programmingOutline.test.ts` (15, dữ liệu thật P1–P6 + 11 khoá) ·
  `lib/outline/programmingOutlineEmptyUnit.test.ts` (1, chỉ mục giả cho ca "sắp mở") ·
  `lib/outline/cefrOutline.test.ts` (8, `cefr.json` thật) · `programmingRoutes.test.ts` (+7).
- Bất biến AC-6 có test canh: `loadLesson`/`loadUnitLessons` được gọi **0 lần** trong cả ba adapter;
  không adapter nào import `@dhcb/subject-programming/lessons`.
- Số liệu dữ liệu thật khớp đặc tả: số unit CEFR A1 15 · A2 27 · B1 40 · B2 43 · C1 32 · C2 44;
  tổng bài STEM mỗi môn bằng `loader.index.length`; P6 65 unit gom vào mạch.
- `npm run codemap -- impact apps/dhcb/src/lib/programmingRoutes.ts` → 20 file, chỉ **thêm** hàm,
  không đổi hàm cũ.
- Ghi chú CI: `packages/subject-programming/lessonsPython.test.ts > p5-s2` một lần đỏ do hết 5 giây
  khi chạy song song toàn bộ; chạy lại riêng file đó ✅ — không liên quan các file của PR này.

## Rollback

Revert PR. Không migration, không đổi schema, không đổi URL đang dùng (`?khoa=` là query — URL
không có query vẫn hợp lệ trước và sau).
