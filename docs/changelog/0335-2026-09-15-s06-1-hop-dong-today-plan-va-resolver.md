# 0335 · 2026-09-15 · S06-1 — hợp đồng `TodayPlan`/`ResumePoint` + resolver "Hôm nay"

- **PR:** #TBD (nháp, merge tuần tự cùng S07-2 · S05-1 · S09-1)
- **Đặc tả:** `docs/specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md` §9 mục 1 (Approved for
  implementation) — phạm vi S06-1, **0 thay đổi giao diện**.

## Đã làm

- `packages/core-contracts/todayPlan.ts` — hợp đồng dùng chung: `TodaySource`, `ResumePoint`,
  `TodayItem`, `TodayPlan` + Zod (`href` phải là route nội bộ, `secondary ≤ 2`, `kind:'resume'`
  bắt buộc có `ResumePoint`, `kind:'pick'` bắt buộc `evidenceSource:'none'`, mục phụ không trùng
  id với mục chính và không bao giờ là `pick`) + `todayItemId`.
- `packages/core-learner/today/buildTodayPlan.ts` — resolver **thuần, đồng bộ**: phiên dở mới nhất
  → bài kế tiếp của môn có bằng chứng mới nhất → ôn tập → `pick`. Hoà thì theo `TIE_BREAK_ORDER`
  (`programming → mathematics → physics → chemistry → biology → english`, tiếng Anh CUỐI).
- Adapter trong app (packages không import apps): `apps/dhcb/src/lib/today/englishNext.ts` (bọc
  `findNextStep` + SRS), `programmingNext.ts` (`prevNext` S07, fallback `pickNextLesson`),
  `stemNext.ts` (chỉ trả bài khi có phiên — STEM chưa có evidence), `resumePoint.ts`
  (`LearningSession` S08 → `ResumePoint`, tra `href` qua `duongDanBaiHoc`/`stemLessonRoutes`).
- `apps/dhcb/src/lib/today/useTodayPlan.ts` — hook gom dữ liệu (phiên S08, `fetchProgress`, CEFR
  loader, `getSRSStats`) rồi gọi resolver; trả `{ plan, state, retry }`. Chưa nơi nào dùng (S06-2).

## Quyết định tự chọn (đặc tả không nói rõ)

1. **`href` của phiên do adapter cấp, không do resolver dựng.** `SubjectSignal` mang thêm
   `resumeHref`/`resumeTitle`; resolver thuần không được biết URL của môn nào. Hệ quả đúng ý đặc
   tả: phiên không tra được đường dẫn (bài bị gỡ khỏi registry) thì bị bỏ và kế hoạch rơi xuống
   bài kế tiếp, thay vì hiện một nút chết.
2. **`pick` một môn vẫn mang `subjectId`.** §③.2 bậc 4 viết "subjectId undefined" nhưng AC-8 đòi
   `href = /goc-hoc-tap/<subjectId>`; hợp đồng nói `subjectId` chỉ vắng khi "pick toàn cục". Chọn:
   đúng một môn có tín hiệu → `subjectId` + href của môn; nhiều/không môn → toàn cục, undefined.
3. **`ResumePoint.activityId` lấy từ `stepLabel` của S08** (S08 đã merge không có trường
   `activityId`), `step` = `stepIndex`, `sessionId` = `sessionKey(...)`. Tóm tắt phiên không mang
   nháp nên `hasDraft = false` — không hứa với người học một bản nháp chưa kiểm chứng được.

## Bằng chứng

- `npx vitest run packages/core-contracts/todayPlan.test.ts packages/core-learner/today apps/dhcb/src/lib/today`
  — 5 file, 71 test xanh (resolver 25 ca, gồm ca rỗng "không mặc định tiếng Anh").
- `grep -rn "'/lo-trinh-hoc'" packages/core-learner/today/` = 0 dòng.
- Cổng: build · typecheck · lint (0 cảnh báo) · format · test:coverage — xem mô tả PR.
