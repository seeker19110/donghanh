# 0326 — 2026-09-15 — Đặc tả S07 mục lục môn/khoá + các slice còn lại của goal learning-ux

**PR:** (điền khi tạo) · **Loại:** docs-only, không source/schema/dependency.

## Đã làm

- **S07 — Mục lục môn/khoá độc lập shellbar:** `docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md`
  (In review, chờ Q1–Q5). Đồng thời là "adapter spec" mà spec nền §④ C đòi: bảng payload
  metadata · khoá · evidence cho Lập trình (bậc + khoá ngắn), 4 môn STEM, Tiếng Anh (CEFR).
  Khảo sát bằng 3 lượt đọc mã thật, số đếm thật (373 bài Lập trình/157 unit loader; STEM
  53/94/87/84 bài; CEFR 201 unit/78 bài ngữ pháp), `codemap impact` đo thật (TocRail 7 ·
  TwoPane 15 · programmingRoutes 17 · stemLessonRoutes 10).
- Cập nhật `PROGRESS.md` (bảng slice Góc học tập thêm S07) và bảng goal
  `docs/goals/2026-09-15-learning-ux.md` (S07 → SPEC).

## Phát hiện quan trọng khi khảo sát S07 (ghi để không mất)

- `LessonSummary` (chỉ mục Lập trình) không có `order`/`levelId`/`courseId`; một bài thuộc NHIỀU
  khoá là thật (`git-c1` ⊃ `p3-u10-l1/l2`; `ml` ∩ `mlds` = 10 bài) → ngữ cảnh khoá phải nằm
  trong URL (`?khoa=`), không suy ngược được.
- Không có hàm dựng URL bài học Lập trình; ≥ 2 trang tự ghép chuỗi. `ProgrammingLessonPage`
  không có prev/next, không có test; `ProgrammingCoursePage` không có test.
- `TocRail` chỉ có `done`, chỉ neo `#id`, biến mất dưới 1024px (TwoPane bỏ rail) — không có
  dạng mobile nào. `Modal` không dùng portal; không có biến thể bottom-sheet.
- STEM: KHÔNG có tiến độ/evidence nào (không key, không API, không DB); hai taxonomy song song
  lệch nhau (`data/stemCurriculum.ts` `grade_12` vs loader `'12'`); bẫy dữ liệu Hoá HSG trùng
  `chapterTitle`, Sinh `chapterKey` ≠ chương, Sinh advanced = 0.
- Tiếng Anh: evidence đáng tin chỉ ở lộ trình CEFR; `/bai-hoc`, `/cau-thong-dung` chỉ có "đã
  xem" (`et_viewed_*`, không sync) — không phải evidence.

## Validation (docs-only)

- `npx prettier --check` các file đổi: PASS. `npx vitest run scripts/changelog.test.ts`: (ghi
  kết quả khi chạy).
