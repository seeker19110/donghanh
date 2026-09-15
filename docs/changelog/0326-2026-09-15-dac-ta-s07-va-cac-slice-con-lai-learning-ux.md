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

## Các slice còn lại của goal learning-ux — 8 đặc tả, mỗi slice một file (đều In review)

Thứ tự thi hành do chủ dự án chốt 2026-09-15: **S07 → S08 → S06 → S05 → S10 → S11 → S09 → S12 → S13**.
Mỗi file theo cùng khuôn S07; khảo sát mã thật trên `7c2d81c`, số đếm/codemap đo thật.

| Slice | File                                                               | Điểm chốt chính / phát hiện THẬT                                                                                                                                                                                                                                          |
| ----- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S08   | `2026-09-15-learning-ux-s08-khung-phien-resume.md`                 | `learningSession.ts` (localStorage, TTL 7 ngày, owner guest/account, `contentFingerprint` FNV-1a). **`ProgrammingLessonPage` hiện KHÔNG có nháp nào** (đã sửa AC-17 của S07); `CefrLevelPage.setTab` không ghi URL; `quizSession.ts` là cơ chế resume duy nhất đang chạy. |
| S06   | `2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md`                   | `TodayPlan`/`ResumePoint` client-side, 3 bậc ưu tiên. Home "học tiếp" chỉ tính từ CEFR; `HomeAiBriefingCard` hard-code `/lo-trinh-hoc`; `markStudiedToday`/streak bỏ qua Lập trình/STEM (`storage.ts` 177 file → ghi nợ).                                                 |
| S05   | `2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md`                | `LearnerIntent` + `/bat-dau` mới, 7 test bất biến ngôn ngữ. **`docs/research/luong-nguoi-moi-ho-so-nang-luc-an-2026-08-23.md` KHÔNG tồn tại** dù CLAUDE.md dẫn; hub `START_URL=/bat-dau` → Intake 401 với khách; vitest không quét `apps/hub`.                            |
| S10   | `2026-09-15-learning-ux-s10-tro-giang-trong-bai-voice.md`          | 6 lỗi lifecycle thật (file:dòng) ở `Companion.tsx`, `companionApi.ts`, `tts.ts`, `sttServer.ts`, `AiHelpPanel.tsx` → PR S10-1 sửa trước; `docs/research/eval-tutor-baseline.md` KHÔNG tồn tại; Gemini Live 0 client → nợ riêng.                                           |
| S11   | `2026-09-15-learning-ux-s11-completion-evidence.md`                | `CompletionEvidence` + `POST/GET /api/learning/evidence`, server chấm lại STEM bằng `core-grading`, ngưỡng 0.8; bảng `platform.completion_evidence`/`completion_state`. Lập trình "hoàn thành" hiện do client tự chạy test rồi POST (ghi nợ).                             |
| S09   | `2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md`     | Version đơn điệu + `sync_receipts` Postgres + outbox client + Web Locks. **Lỗi mất dữ liệu thật**: `fetchProgress` ghi đè cache, bài hoàn thành offline biến mất; `offlineStore.ts` là hàng đợi giả; push mỗi thẻ SRS chạm rate limit 30/phút.                            |
| S12   | `2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md`              | `buildReviewQueue` xuyên môn, namespace SRS `stem:`, sổ lỗi từ evidence, khối "Tiến độ theo môn" từ Outline. **Bug thật**: `learningReadModelService.ts:68` select cột `stats` không tồn tại.                                                                             |
| S13   | `2026-09-15-learning-ux-s13-responsive-theme-hieu-nang-rollout.md` | Ma trận 6 màn × 4 viewport × 5 theme × 5 trạng thái, script chụp + manifest, CWV đo tay. **Sàn coverage thật 93/89/93/93** (CLAUDE.md/PROGRESS ghi 97/93/96/97 lỗi thời — đã sửa trong S07, S13 sửa tài liệu); 768/1440 chưa có cổng bố cục.                              |

**Số migration đã đánh theo thứ tự thi hành (tránh trùng):** S05 `0081` · S11 `0082` · S09 `0083` · S12 `0084`.

**Ba tài liệu được CLAUDE.md/mã dẫn tới nhưng KHÔNG tồn tại** (ghi nợ ở PROGRESS): `docs/research/luong-nguoi-moi-ho-so-nang-luc-an-2026-08-23.md`, `docs/research/eval-tutor-baseline.md`, `docs/research/cai-tien-lo-trinh-hoc.md`.

## Validation (docs-only)

- `npx prettier --check` các file đổi: PASS. `npx vitest run scripts/changelog.test.ts`: 8/8 PASS.
