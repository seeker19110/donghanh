# Góc học tập — slice S11: Completion evidence và màn kết quả (định nghĩa "hoàn thành" từng hoạt động + evidence STEM + `POST /api/learning/evidence`)

| Thuộc tính    | Giá trị                                                                                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec cha      | [`2026-09-15-goc-hoc-tap-architecture.md`](2026-09-15-goc-hoc-tap-architecture.md)                                                                                                                                               |
| Spec nền      | [`2026-09-15-learning-ux-foundation.md`](2026-09-15-learning-ux-foundation.md) §④ D ("kết quả và hẹn ôn", "không dùng state của UI làm authoritative completion") + §⑤ (completion do server; evidence receipt không tự mở rộng) |
| Spec mục lục  | [`2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md`](2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md) §③.3 bảng evidence (STEM "KHÔNG CÓ" → `unknown`) + §7 Q5 (đẩy evidence STEM sang S11)                                           |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md) dòng S11 (dependency S08 + domain spec; "cần spec nhỏ từng hoạt động")                                                                                                       |
| Thứ tự chốt   | S07 → S08 → S06 → S05 → S10 → **S11** → S09 (đồng bộ version/retry/xung đột) → S12 (ôn tập) → S13                                                                                                                                |
| Base khảo sát | `main` `7c2d81c` (#928), khảo sát 2026-09-15 bằng đọc mã thật + `npm run codemap -- impact` (số liệu đếm thật, ghi kèm đường dẫn/dòng)                                                                                           |
| Trạng thái    | **Approved for implementation** — chủ dự án chốt TOÀN BỘ câu hỏi §7 theo đề xuất mặc định (2026-09-15). **S11-1 đã thi hành** (changelog `0333`); S11-2/S11-3 còn lại                                                            |
| Người duyệt   | Chủ dự án                                                                                                                                                                                                                        |

> Không bắt đầu code khi trạng thái chưa là **Approved for implementation**. Luật số 1 của khuôn
> `docs/templates/dac-ta-tinh-nang.md`: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.
>
> **S11 chạm schema** (bảng mới + migration `0081`) — theo `CLAUDE.md` §12 đây là việc PHẢI hỏi
> trước; §7 Q3–Q4 là câu hỏi đó. Chưa duyệt thì không có migration.

## 0. Một câu

Chốt cho MỖI hoạt động học (bài Lập trình · bài STEM · vòng từ vựng/ngữ pháp/hội thoại CEFR ·
quiz chặng · dự án) đâu là **bằng chứng** để được gọi là "hoàn thành", **ai** được quyền ghi
bằng chứng đó (client gửi kết quả thô, server chấm lại/xác nhận), và đưa **STEM** — môn duy nhất
hiện không có tiến độ nào — từ "chưa đo được" sang trạng thái thật qua một endpoint mới có
idempotency, để mục lục S07 và màn kết quả cuối bài nói đúng sự thật.

## ④ Tiêu chí chấp nhận (đo được — mỗi dòng ghi lệnh/bằng chứng)

Chia 3 PR con (§9): **S11-1** hợp đồng + schema + API (không UI) · **S11-2** client STEM gửi
evidence + khách + merge · **S11-3** màn kết quả tái dùng + mục lục S07 đọc evidence. AC ghi rõ
thuộc PR nào.

### S11-1 — hợp đồng `CompletionEvidence`, migration `0081`, `POST /api/learning/evidence`

- [ ] **AC-1 Hợp đồng versioned.** `packages/core-contracts/completionEvidence.ts` export
      `CompletionEvidenceInputSchema` (client → server), `CompletionEvidenceSchema` (server → client,
      có `serverAt`/`passed`/`contentVersion`), `COMPLETION_EVIDENCE_SCHEMA_VERSION = 1`, dựng bằng
      `versionedObject` có sẵn (`packages/core-contracts/version.ts:19`). Test canh: thiếu
      `attemptId` → lỗi; `activityKind` ngoài enum → lỗi; `answers` > 50 phần tử → lỗi; `version`
      ≠ 1 → lỗi. — `npx vitest run packages/core-contracts/completionEvidence.test.ts`.
- [ ] **AC-2 Migration lũy đẳng.** `postgres/migrations/0081_completion_evidence.sql` tạo
      `platform.completion_evidence` (nhật ký, chỉ thêm) + `platform.completion_state` (trạng thái
      suy ra, 1 dòng/người/nội dung) đúng DDL §③.3; chạy `npm run migrate:pg` **2 lần liên tiếp**
      trên DB test đều exit 0 và `\d platform.completion_evidence` giống nhau; dòng README bảng
      migration được thêm. Rollback ghi ngay đầu file: `drop table if exists
platform.completion_state; drop table if exists platform.completion_evidence;`.
- [ ] **AC-3 Server chấm LẠI, không tin client.** `POST /api/learning/evidence` với
      `activityKind:'stem_lesson_check'` nhận `answers[]` THÔ, tra bài bằng registry server
      (`getMathLesson`/`getPhysicsLesson`/`getChemLesson`/`getBiologyLesson` — server đã import
      4 registry này ở `apps/server/src/api/admin/admin-stem-review.ts:33-36`), chấm bằng
      `gradeAnswer` của `@dhcb/core-grading` (cùng hàm client dùng — đúng lời hứa ở
      `packages/core-grading/index.ts:7-8`). Client gửi kèm `clientCorrect: 5` nhưng server chấm ra
      3 → lưu 3, trả 3. Test: body có `clientCorrect` bị Zod `.strict()` từ chối 400 (không có
      trường đó trong hợp đồng). — `apps/server/src/api/learning/evidence.test.ts`.
- [ ] **AC-4 Idempotent theo `attemptId`.** Gửi cùng `(subjectId, contentId, attemptId)` 2 lần
      → dòng nhật ký chỉ có 1 (unique index), lần 2 trả 200 với `duplicate: true` và cùng
      `passed/ratio` như lần 1; `completion_state` không đổi. — test mock `pg` bắt query
      `on conflict ... do nothing` + test tích hợp nếu có `DATABASE_URL_TEST`.
- [ ] **AC-5 "Không kéo lùi" ở tầng DB.** `completion_state` đã `completed` (ratio 1.0) nhận thêm
      evidence ratio 0.4 → `status` vẫn `completed`, `best_ratio` vẫn 1.0, `completed_at` giữ
      nguyên, `last_ratio` = 0.4, `attempts` +1. Đúng khuôn `programming.lesson_progress`
      (`apps/server/src/api/subjects/programming/progress.ts:129-137`). — test đọc SQL upsert.
- [ ] **AC-6 Ngưỡng hoàn thành là hằng số một chỗ.** `STEM_CHECK_PASS_RATIO = 0.8` export từ
      `packages/core-learner/completionRules.ts` (cùng nơi ghi luật cho các activityKind sau);
      bài có 0 `checkQuestions` → server trả 400 `NO_CHECK_QUESTIONS`, KHÔNG ghi gì (không có
      cách đo thì không giả vờ đo). Test 3 ca biên: 4/5 (đạt), 3/4 (0.75, không đạt), 1/1 (đạt).
- [ ] **AC-7 Cửa an ninh như mọi handler.** `validateAuth()` (401 khi thiếu), `checkRateLimit(ip,
60, 'learning-evidence')` (429), `readJsonBody` + `validateBody(Schema.strict())` (400), method
      khác POST/GET → 405, lỗi DB → `internalErrorResponse` 500 không lộ stack, không có SQL ghép
      chuỗi. `GET /api/learning/evidence?subjectId=physics` trả `completion_state` của ĐÚNG
      `auth.userId` (không nhận `userId` từ query). — `evidence.test.ts` ≥ 8 ca theo khuôn
      `progress.test.ts` (mock `@dhcb/core-auth/security` + `@dhcb/core-db/pgPool`).
- [ ] **AC-8 Không đổi payload/endpoint đang có.** `git diff --stat` của S11-1 KHÔNG chạm
      `apps/server/src/api/core/progress.ts`, `apps/server/src/api/subjects/programming/progress.ts`,
      `pathQuiz.ts`, `apps/dhcb/src/lib/programmingProgress.ts`, `cefrProgress.ts`, `vocab.ts`,
      `srs.ts`, `dailyLearningPlan.ts`; 8 + 30 + 11 + 6 test ở các file đó xanh nguyên. — cổng
      `npm run test:coverage`.

### S11-2 — client STEM gửi evidence; khách; merge khi đăng nhập; giữ cục bộ chờ gửi lại

- [ ] **AC-9 Một lần "Nộp" cho cả bài, không phải từng câu.** `StemLessonView` có nút "Nộp bài tự
      kiểm tra" (≥ 44px) chỉ bật khi MỌI câu đã có trả lời; bấm → `submitStemEvidence(uid,
subjectId, lessonId, answers)` gửi `attemptId = crypto.randomUUID()` (fallback chuỗi thời
      gian + random khi API vắng). Chấm từng câu tại chỗ bằng `gradeAnswer` GIỮ NGUYÊN (phản hồi tức
      thì), nhưng chữ "Đã hoàn thành" chỉ hiện sau khi server trả `passed: true`. Test: server trả
      `passed:false` → không có chữ "hoàn thành"; server lỗi → vẫn thấy đúng/sai từng câu. —
      `StemLesson.test.tsx` (10 ca cũ xanh + ≥ 4 ca mới).
- [ ] **AC-10 Khách.** `uid` là `guest_*` (`isGuestId`, `packages/core-ui/guestId.ts:28`) → chấm
      bằng `gradeAnswer` ở client (không có server để chấm lại — ghi rõ tính CỤC BỘ), lưu
      `dhcb_evidence_<uid>` (mảng `CompletionEvidence`, tối đa 200 bản ghi, cắt cũ nhất) và
      `dhcb_evidence_state_<uid>` (map contentId → state, không kéo lùi). Hai tiền tố ĐĂNG KÝ vào
      `guestProgress.ts` (`ALL_PREFIXES` + nhánh merge riêng như `PROGRAMMING_PROGRESS_PREFIX`).
      Test: `hasGuestProgress` = true khi chỉ có evidence STEM; `clearGuestKeys` xoá cả hai. —
      `guestProgress.test.ts` (20 ca cũ + ≥ 4 mới).
- [ ] **AC-11 Merge khi đăng nhập = đẩy từng evidence lên server, server chấm lại.**
      `mergeGuestProgressInto` gửi từng bản ghi khách qua `POST /api/learning/evidence` (cùng
      `attemptId` cũ → idempotent, gọi lại không tạo dòng thứ hai); server chấm lại từ `answers` thô
      nên khách sửa localStorage `passed:true` cũng không lọt; state tài khoản = "không kéo lùi"
      giữa bản có sẵn và bản khách. Lỗi mạng ở một bản ghi không chặn bản còn lại (khuôn
      `guestProgress.ts:190-193`). — `guestProgress.test.ts` ca "evidence STEM của khách được đẩy
      lên server và server là người chấm".
- [ ] **AC-12 Giữ cục bộ chờ gửi lại — CÙNG THIẾT BỊ.** Gửi lỗi mạng/5xx → bản ghi vào hàng đợi
      `dhcb_evidence_pending_<uid>` (tối đa 50), UI hiện "Đã lưu trên máy này, sẽ gửi lại" (`role=
"status"`); lần mở app sau (hoặc `online` event) gửi lại theo thứ tự, thành công thì gỡ. Hết
      auth (401) → GIỮ trong hàng đợi, không xoá, không gửi lại tự động cho tới khi đăng nhập lại.
      KHÔNG có logic version/xung đột cross-device (S09). — `stemEvidence.test.ts` ≥ 6 ca (offline,
      5xx, 401, 400 bỏ khỏi hàng đợi kèm lý do, hàng đợi đầy, gửi lại thành công).
- [ ] **AC-13 Không AI, không click.** `grep -rn "learning/evidence" apps/dhcb/src` chỉ khớp
      trong `lib/stemEvidence.ts` + test; không có `useEffect` nào gọi nó khi mount; mở bài rồi
      rời trang không tạo bản ghi (E2E chặn route, đếm request = 0). — E2E
      `e2e/stem-evidence.spec.ts` ca "mở bài không gửi evidence".

### S11-3 — màn kết quả tái dùng + mục lục S07 đọc evidence STEM

- [ ] **AC-14 Màn kết quả dùng chung.** `apps/dhcb/src/components/learning/ActivityResult.tsx`
      nhận `{ status: 'passed'|'failed'|'pending'|'local'|'error', correct, total, items:
{prompt, yourAnswer, correct, explain}[], nextHref?, retry? }` — hiện đúng/sai từng câu, lỗi
      chỉ ra (`reason` của `GradeResult` → chữ tiếng Việt, ví dụ `MISSING_UNIT` → "Thiếu đơn vị"),
      nút "Làm lại" (attemptId MỚI), "Bài tiếp theo" (từ `prevNext` của S07). Có chỗ cắm "Hẹn ôn"
      là prop `reviewSlot?: ReactNode` — S12 điền, S11 KHÔNG ghi SRS. 5 trạng thái có CHỮ, không chỉ
      màu. — `ActivityResult.test.tsx` ≥ 7 ca; `e2e/a11y.spec.ts` + `a11y-aaa.spec.ts` thêm route bài
      STEM ở trạng thái đã nộp; 0 vi phạm 5 theme.
- [ ] **AC-15 Mục lục S07 hết `unknown` cho STEM khi có evidence.** `buildStemOutline(subjectId,
grade, ctx)` nhận thêm `ctx?: { state: ReadonlyMap<string, CompletionState>; stateStatus:
'loading'|'ready'|'error' }`; `ready` + có state → `completed`/`in-progress` với
      `evidenceSource: 'stem.evidence'`; `ready` + không có → `not-started`; `loading`/`error` →
      `unknown` (giữ hành vi S07). Khách: `evidenceSource: 'stem.evidence.local'` (spec nền §③:
      "guest local status phải ghi đúng tính cục bộ"). — `stemOutline.test.ts` thêm ≥ 4 ca; AC-4
      S07 (318 lá, `loadLesson` = 0 lần) vẫn xanh.
- [ ] **AC-16 Mở bài không đổi trạng thái (bất biến S07 AC-9 giữ nguyên).** Mở bài STEM, không
      nộp, quay lại mục lục → `not-started` (nếu đã tải state) hoặc `unknown` — KHÔNG BAO GIỜ
      `in-progress`. — E2E `outline-stem.spec.ts` ca có sẵn + `stem-evidence.spec.ts`.
- [ ] **AC-17 Nhìn bằng mắt (Tầng 8b).** Ảnh 1440/768/390/320 TRƯỚC/SAU của trang bài Lí
      `ly10-c2-b10` ở 3 trạng thái: chưa nộp · nộp đạt · nộp không đạt; và trạng thái "đã lưu trên
      máy, chờ gửi". 5 theme. Dán vào PR.
- [ ] **AC-18 Ngân sách + coverage.** `npm run budget` sau build: chunk trang bài STEM tăng ≤ 4 kB
      gzip; coverage không tụt dưới ngưỡng 97/93/96/97; `core-contracts`, `core-learner` mới thêm
      có test 100% nhánh.

**Lệnh chứng minh (mỗi PR con, trên checkout sạch):**

```bash
npm ci
rm -rf packages/*/dist dist dist-server
npm run typecheck && npm run lint && npm run format && npm run build && npm run test:coverage
npm run budget
# S11-1: migration lũy đẳng — chạy HAI lần, cả hai phải exit 0
npm run migrate:pg && npm run migrate:pg
npx vitest run packages/core-contracts/completionEvidence.test.ts \
  packages/core-learner/completionRules.test.ts apps/server/src/api/learning/evidence.test.ts
# S11-2 / S11-3
npx vitest run apps/dhcb/src/lib/stemEvidence.test.ts apps/dhcb/src/lib/guestProgress.test.ts \
  apps/dhcb/src/pages/learning/StemLesson.test.tsx apps/dhcb/src/components/learning/ActivityResult.test.tsx
npx playwright test e2e/stem-evidence.spec.ts e2e/outline-stem.spec.ts e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts
# Tra ảnh hưởng của từng file đã sửa
npm run codemap -- impact apps/dhcb/src/lib/guestProgress.ts
```

## ① Phạm vi

**LÀM (theo PR con):**

**S11-1 — hợp đồng + schema + API (0 thay đổi giao diện):**

1. `packages/core-contracts/completionEvidence.ts` (+ test): Zod versioned (§③.1). Đặt tên
   `CompletionEvidence`, KHÔNG dùng lại `EvidenceSchema` đang có ở
   `packages/core-contracts/evidence.ts` (Phase 06 — quan sát 1 lần cho Mastery, `skillId` là
   UUID, không có nội dung/bài; khái niệm khác, đừng gộp).
2. `packages/core-learner/completionRules.ts` (+ test): bảng luật "hoàn thành" từng
   `activityKind` (§③.2) — hàm thuần `decideCompletion(kind, {correct,total})`.
3. `postgres/migrations/0081_completion_evidence.sql` + dòng README (§③.3).
4. `apps/server/src/api/learning/evidence.ts` (+ test) + 1 dòng `routes.ts`:
   `app.all('/api/learning/evidence', wrapEdge(learningEvidenceHandler))`. Chấm lại STEM bằng
   `packages/core-learner/stemEvidenceGrader.ts` (hàm thuần: `(lesson, answers) → {correct,
total, items[]}`; test 100%).

**S11-2 — client STEM:**

5. `apps/dhcb/src/lib/stemEvidence.ts` (+ test): `submitStemEvidence`, `fetchCompletionState`,
   hàng đợi chờ gửi, khách. `guestProgress.ts`: đăng ký 3 tiền tố mới + nhánh merge.
6. `StemLessonView.tsx`: gom trả lời các câu lên state cha, nút "Nộp bài tự kiểm tra", gọi
   `submitStemEvidence`, hiện `ActivityResult` (S11-3 tách component; S11-2 có thể hiện tạm
   dòng kết quả tổng trong lúc chờ S11-3 — ghi rõ trong PR).

**S11-3 — kết quả + mục lục:**

7. `apps/dhcb/src/components/learning/ActivityResult.tsx` (+ test); dùng ở `StemLessonView`.
8. `packages/core-learner/outline/stemOutline.ts` (S07) nhận `ctx` evidence; `OutlinePane`
   (S07) fetch `GET /api/learning/evidence?subjectId=` cho trang STEM như đang fetch
   `/api/programming/progress` cho Lập trình.
9. E2E `e2e/stem-evidence.spec.ts`, ảnh, changelog, `PROGRESS.md`, goal dòng S11.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- KHÔNG để AI hoặc thao tác click/mở trang/cuộn ghi completion cho BẤT KỲ hoạt động nào
  (guardrail goal: "AI trở thành authority"). Trợ giảng S10 chỉ đọc `completion_state`, không ghi.
- KHÔNG thay luật khoá (`levelLock.ts`, `cefrUnlock.ts`, `UNLOCK_PCT`, `computeUnlockedLevels`),
  KHÔNG đổi entitlement/gói/hạn mức khách/billing.
- KHÔNG đổi payload/endpoint/cơ chế accounting đang có: `/api/progress` (union), `/api/programming/
progress`, `/api/programming/path-quiz`, `saveLessonProgress`, `markGrammarDone`, `srs.ts`,
  `dailyLearningPlan.ts`. Lập trình và Tiếng Anh GIỮ nguồn evidence hiện có (§③.2) — S11 chỉ
  **định nghĩa** và **ghi nhận nợ**, không dời dữ liệu sang bảng mới.
- KHÔNG làm đồng bộ cross-device, version, xung đột hai tab, "thiết bị cũ gửi muộn đè bản mới"
  — S09. S11 chỉ có: idempotency theo `attemptId` + hàng đợi gửi lại CÙNG thiết bị.
- KHÔNG ghi thẻ SRS/hẹn ôn/sổ lỗi từ kết quả STEM — S12 (S11 chỉ chừa `reviewSlot`).
- KHÔNG mở rộng "evidence receipt" `srs_review` của daily plan thành completion (spec nền §⑤).
  Lưu ý khảo sát: `dailyLearningPlan.ts` (66 dòng) hiện KHÔNG có receipt nào — `srs_review` chỉ
  là `DailyPlanActionKind`; câu trong spec nền là luật cấm, không phải mô tả mã đang có.
- KHÔNG chấm STEM bằng AI, KHÔNG gọi `/api/agent`, `/api/stem-scratchpad` (scratchpad là luồng
  "đề mẫu cho AI giải", `platform.feature_state`, không phải bài học).
- KHÔNG sửa nội dung bài STEM/`lessonsLazy.ts` (file sinh); nếu lỡ chạm → `npm run gen:stem-lesson-index`.
- KHÔNG thêm thư viện.

## ② Điểm chạm (đã khảo sát thật trên `7c2d81c`)

| PR  | Việc | Đường dẫn file                                                                          | Ghi chú khảo sát                                                                                                                                                                               |
| --- | ---- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Thêm | `packages/core-contracts/completionEvidence.ts` (+ test)                                | Dùng `versionedObject` (`version.ts:19`), `IsoDateTimeSchema`/`UuidSchema` (`shared.ts:17,19`). Gói đã có Zod.                                                                                 |
| 1   | Thêm | `packages/core-learner/completionRules.ts`, `stemEvidenceGrader.ts` (+ test)            | `core-learner` tsconfig `include: ["**/*.ts"]`, references `core-contracts`/`core-db`/`core-errors` — cần thêm reference `core-grading` (+ `package.json` dependency) để import `gradeAnswer`. |
| 1   | Thêm | `postgres/migrations/0081_completion_evidence.sql`; sửa `postgres/migrations/README.md` | Migration mới nhất `0080_founder_lifetime_vip.sql`. Khuôn: comment đầu file ghi đặc tả + rollback, `create table if not exists`, `create index if not exists`, `comment on table`.             |
| 1   | Thêm | `apps/server/src/api/learning/evidence.ts` (+ test)                                     | Khuôn `subjects/programming/progress.ts` (145 dòng, 8 test) + `pathQuiz.ts` (server chấm, 6 test). Import 4 registry STEM như `admin-stem-review.ts:33-36`.                                    |
| 1   | Sửa  | `apps/server/src/routes.ts`                                                             | Thêm 1 import + 1 `app.all`. Bảng route hiện ~100 dòng; đặt cạnh `/api/stem-scratchpad` (dòng 359).                                                                                            |
| 2   | Thêm | `apps/dhcb/src/lib/stemEvidence.ts` (+ test)                                            | Khuôn `programmingProgress.ts` (79 dòng): cache lạc quan, `isGuestId`, `getAuthHeader`. Thêm hàng đợi chờ gửi.                                                                                 |
| 2   | Sửa  | `apps/dhcb/src/lib/guestProgress.ts` (+ test)                                           | 205 dòng, 20 test. `ALL_PREFIXES` (dòng 50-60) thêm 3 tiền tố; `mergeGuestProgressInto` (157-201) thêm nhánh đẩy evidence trước `clearGuestKeys`.                                              |
| 2   | Sửa  | `apps/dhcb/src/pages/learning/StemLessonView.tsx` (+ `StemLesson.test.tsx`)             | 238 dòng; `CauHoi` (dòng 30-109) giữ `useState` cục bộ + báo `onAnswer(thuTu, giaTri)` lên cha; cha gom → nút Nộp. Chấm tại chỗ `gradeAnswer` giữ (dòng 36).                                   |
| 3   | Thêm | `apps/dhcb/src/components/learning/ActivityResult.tsx` (+ test)                         | Token `--a-*`, `buttonClass`, `tap-44`; chữ nội dung AAA.                                                                                                                                      |
| 3   | Sửa  | `packages/core-learner/outline/stemOutline.ts` (+ test) — file của S07                  | Thêm tham số `ctx` tuỳ chọn; chữ ký cũ `(subjectId, grade)` vẫn chạy (S07 AC-4 giữ).                                                                                                           |
| 3   | Sửa  | `apps/dhcb/src/components/OutlinePane.tsx` — file của S07                               | Fetch state STEM giống fetch tiến độ Lập trình (S07 AC-16: đến muộn → `unknown` rồi cập nhật, không nhảy layout).                                                                              |
| 3   | Thêm | `e2e/stem-evidence.spec.ts`; sửa `e2e/a11y.spec.ts`, `e2e/a11y-aaa.spec.ts`             | `a11y.spec.ts:131` đã có route `/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do`; thêm trạng thái đã nộp.                                                                               |

**Ảnh hưởng lan ra (đo `npm run codemap -- impact`, 2026-09-15 trên `7c2d81c`):**

- `apps/dhcb/src/lib/programmingProgress.ts` → **19 file** (10 trang/lib Lập trình + `guestProgress`
  - `AuthProvider` + `App`) — S11 **KHÔNG sửa** file này; số này là lý do không dời tiến độ Lập
    trình sang bảng mới trong S11.
- `apps/dhcb/src/pages/learning/StemLessonView.tsx` → **3 file** (`App.tsx`, `StemLesson.test.tsx`,
  `main.tsx`) — chỗ sửa chính, rủi ro lan thấp.
- `apps/dhcb/src/lib/guestProgress.ts` → **4 file** (`AuthProvider.tsx:50` gọi
  `mergeGuestProgressInto`, test, `App`, `main`) — thêm tiền tố là thay đổi thuần bổ sung.
- `apps/server/src/api/subjects/programming/progress.ts` → **3 file** (`routes.ts`, test,
  `server.ts`) — KHÔNG sửa; chỉ nêu để so khuôn.
- Sau S07 merge: `stemOutline.ts`/`OutlinePane.tsx` — chạy lại `impact` trước khi sửa (S07 chưa
  có trên `main` lúc khảo sát).

## ③ Hợp đồng

### 3.1 `CompletionEvidence` (`packages/core-contracts/completionEvidence.ts`)

```ts
export const COMPLETION_EVIDENCE_SCHEMA_VERSION = 1

// Hoạt động nào SINH evidence. S11 thi hành đúng MỘT loại; các loại khác khai để bảng luật §3.2
// có chỗ đứng, server trả 400 UNSUPPORTED_ACTIVITY cho tới khi có slice riêng.
export const ActivityKindSchema = z.enum([
  'stem_lesson_check', // S11 — bài STEM, câu tự kiểm tra
  'programming_lesson', // đã có ở /api/programming/progress — KHÔNG đi qua endpoint này
  'programming_stage_quiz', // đã có ở /api/programming/path-quiz — KHÔNG đi qua endpoint này
  'programming_project_step', // đã có (ProgrammingProjectPage → progress)
  'cefr_vocab_circle', // đã có ở /api/progress (learned)
  'cefr_grammar', // đã có ở /api/progress (cefrGrammar)
  'cefr_dialogue', // đã có ở /api/progress (cefrDialogues)
  'cefr_level_exam', // đã có ở /api/progress (cefrExams) + computeUnlockedLevels
])

export const StemAnswerSchema = z.object({
  questionIndex: z.number().int().min(0).max(49), // vị trí trong lesson.checkQuestions
  raw: z.string().min(1).max(500), // chuỗi học viên gõ / id lựa chọn — KHÔNG có đúng/sai
})

/** Client → server. `.strict()`: không có chỗ cho `correct`, `passed`, `score` do client tính. */
export const CompletionEvidenceInputSchema = versionedObject(
  {
    subjectId: z.enum(['mathematics', 'physics', 'chemistry', 'biology']), // STEM_SUBJECT_IDS
    contentId: z.string().regex(/^[a-z0-9-]{3,64}$/), // lessonId, vd 'ly10-c2-b10'
    courseId: z.string().max(64).optional(), // dự phòng; STEM không có khoá
    activityKind: ActivityKindSchema,
    attemptId: z.string().regex(/^[A-Za-z0-9-]{16,64}$/), // khoá idempotent, client sinh MỖI lần nộp (UUID hoặc fallback)
    clientAt: IsoDateTimeSchema, // giờ máy học viên — chỉ để hiển thị, KHÔNG dùng để sắp thứ tự
    answers: z.array(StemAnswerSchema).min(1).max(50),
  },
  COMPLETION_EVIDENCE_SCHEMA_VERSION,
).strict()

/** Server → client (kết quả 1 lần nộp) và bản ghi lưu localStorage khách. */
export const CompletionEvidenceSchema = z.object({
  version: z.literal(1),
  subjectId,
  contentId,
  courseId,
  activityKind,
  attemptId,
  clientAt, // như trên
  ownerId: z.string().min(1), // userId (uuid) HOẶC guest_* — để cache/merge không lẫn chủ
  evidenceKind: z.enum(['server_graded', 'local_graded']), // khách = local_graded
  correct: z.number().int().min(0),
  total: z.number().int().min(1),
  ratio: z.number().min(0).max(1),
  passed: z.boolean(),
  contentVersion: z.string().length(64).optional(), // sha256 hex, server ghi (§3.4); khách: vắng
  serverAt: IsoDateTimeSchema.optional(), // vắng khi local_graded
  duplicate: z.boolean().optional(), // true = attemptId đã có, trả lại bản cũ
  items: z.array(z.object({ questionIndex, correct: z.boolean(), reason: z.string() })),
})

/** Trạng thái suy ra, 1 dòng/người/nội dung — thứ mục lục S07 đọc. */
export const CompletionStateSchema = z.object({
  subjectId,
  contentId,
  status: z.enum(['in_progress', 'completed']),
  bestRatio: z.number().min(0).max(1),
  lastRatio: z.number().min(0).max(1),
  attempts: z.number().int().min(1),
  completedAt: IsoDateTimeSchema.nullable(),
  updatedAt: IsoDateTimeSchema,
  source: z.enum(['server', 'local']), // mục lục: 'stem.evidence' | 'stem.evidence.local'
})
```

**Chữ ký client (`apps/dhcb/src/lib/stemEvidence.ts`):**

```ts
submitStemEvidence(uid, input: Omit<CompletionEvidenceInput,'version'|'attemptId'|'clientAt'>,
  lessonForLocal: StemLessonLike): Promise<
  | { kind: 'server'; evidence: CompletionEvidence }
  | { kind: 'local'; evidence: CompletionEvidence }          // khách
  | { kind: 'queued'; evidence: CompletionEvidence; reason: 'offline'|'server'|'auth' } // đã xếp hàng
  | { kind: 'rejected'; error: string }>                        // 400: không xếp hàng
fetchCompletionState(uid, subjectId): Promise<{ status:'ready'|'error'; state: Map<string, CompletionState> }>
flushPendingEvidence(uid): Promise<{ sent: number; kept: number }>
```

### 3.2 Bảng luật "hoàn thành" từng hoạt động (`packages/core-learner/completionRules.ts`)

| Hoạt động                                       | Evidence là gì                                                                                                                               | Ai chấm / ai ghi                                                                                                                                                                                                                 | Khoá idempotent                                                                      | "Không kéo lùi"                                                                                                          | Trạng thái S11                                                                                                           |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Bài STEM** (`stem_lesson_check`)              | Nộp MỘT lượt trả lời cho toàn bộ `checkQuestions`; **đạt khi `correct/total ≥ 0.8`** (`STEM_CHECK_PASS_RATIO`, §7 Q2); 0 câu → không đo được | Client: `gradeAnswer` chỉ để phản hồi tức thì. **Server chấm LẠI** từ `answers` thô bằng cùng `gradeAnswer` + registry, ghi nhật ký + state. Khách: client chấm, ghi local, ĐÁNH DẤU `local_graded`; đăng nhập → server chấm lại | `(user_id, subject_id, content_id, attempt_id)` unique; attemptId = UUID mỗi lần nộp | `completion_state`: `completed` không về `in_progress`; `best_ratio = greatest(...)`; `completed_at = coalesce(cũ, mới)` | **LÀM MỚI** (S11-1/2/3)                                                                                                  |
| **Bài Lập trình** (`programming_lesson`)        | `allTestsPassed(results)` của bộ `lesson.make.testCases`                                                                                     | **Client** chạy code trong worker (Python/JS/SQL) rồi POST `status:'completed'` (`ProgrammingLessonPage.tsx:184`); server chỉ kiểm `lessonId` có thật + lưu (`progress.ts:113-137`). → **Client là authority de facto** (nợ, §8) | Không có — upsert theo `(user_id, lesson_id)`; gửi trùng vô hại vì "không kéo lùi"   | Có ở DB (`progress.ts:129-137`) + client (`programmingProgress.ts:56-61`) + merge khách (`mergeLessonProgress`)          | **GIỮ NGUYÊN**; ghi nợ "server chạy lại test case" cho slice sau (không thuộc S11 vì cần sandbox chạy code ở server)     |
| **Bước dự án** (`programming_project_step`)     | Bấm "hoàn thành bước" sau khi nộp artifact (`ProgrammingProjectPage.tsx:191`)                                                                | Client ghi; server lưu (cùng bảng `lesson_progress`, khoá `p1-s1`)                                                                                                                                                               | Như trên                                                                             | Như trên                                                                                                                 | **GIỮ NGUYÊN**; ghi nợ (đây là "click = hoàn thành" duy nhất còn lại — cần rubric/artifact ở slice dự án)                |
| **Quiz chặng hướng** (`programming_stage_quiz`) | `correct/total ≥ 0.8` (`PASS_RATIO`, `pathProgressService.ts:137`)                                                                           | **Server chấm** bằng ngân hàng `stageQuizzes.ts`, đạt mới ghi `path_progress.completed` (`submitStageQuiz`)                                                                                                                      | Không attemptId; không đạt = không ghi; đạt lại = upsert cùng giá trị                | `upsertStageStatus` (bảng 0073)                                                                                          | **GIỮ NGUYÊN** — đây là khuôn mẫu đúng mà STEM sao theo                                                                  |
| **Vòng từ vựng CEFR** (`cefr_vocab_circle`)     | `circleDoneCount === words.length` (`cefrProgress.ts:99`), mỗi từ "thuộc" là kết quả ôn SRS/đánh dấu                                         | Client ghi `et_learned_<uid>` → `POST /api/progress`, server **union** (`mergeArrayUnion`, `progressMerge.ts:20`)                                                                                                                | Union = lũy đẳng tự nhiên                                                            | Union không bao giờ bớt                                                                                                  | **GIỮ NGUYÊN** (S07 AC-5 đã đọc)                                                                                         |
| **Ngữ pháp CEFR** (`cefr_grammar`)              | `markGrammarDone` (`cefrProgress.ts:51`) sau khi làm bài ngữ pháp                                                                            | Client ghi `et_cefr_grammar_<uid>` → server union                                                                                                                                                                                | Union                                                                                | Union (có `unmarkGrammarDone` cục bộ — không đẩy xoá lên server)                                                         | **GIỮ NGUYÊN**                                                                                                           |
| **Hội thoại CEFR** (`cefr_dialogue`)            | "Đã xem" (`markDialogueViewed`, `cefrProgress.ts:82`) — **yếu nhất**: là click                                                               | Client ghi, server union                                                                                                                                                                                                         | Union                                                                                | Union                                                                                                                    | **GIỮ NGUYÊN** nhưng mục lục S07 ghi `evidenceSource:'english.cefrDialogue'` là "đã xem", không phải "đã học"; nợ ghi §8 |
| **Thi cấp CEFR** (`cefr_level_exam`)            | `pct ≥ 0.7` (`EXAM_PASS_PCT`, `cefrExam.ts:27`) → mở cấp                                                                                     | Client chấm + ghi `et_cefr_exams_`; **server** tính cấp mở `computeUnlockedLevels` (`core/progress.ts:29`) — cấp mở là quyền, do server                                                                                          | `mergeExamMap` theo timestamp                                                        | Server không nhận `cefrUnlocked` từ client                                                                               | **GIỮ NGUYÊN**                                                                                                           |

`decideCompletion(kind, {correct, total})` chỉ thi hành dòng STEM trong S11; các dòng khác trả
`{ supported: false }` để bảng luật là NƠI DUY NHẤT ghi ngưỡng (0.8 STEM · 0.8 quiz · 0.7 thi
cấp) và test canh chúng không trôi.

### 3.3 Schema (`postgres/migrations/0081_completion_evidence.sql`)

```sql
-- 0081_completion_evidence.sql — Nhật ký bằng chứng hoàn thành + trạng thái suy ra (S11).
-- Đặc tả: docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md §③.3
-- Idempotent. Rollback:
--   drop table if exists platform.completion_state;
--   drop table if exists platform.completion_evidence;

create schema if not exists platform; -- đã có từ 0058, giữ để file tự đứng được

-- Nhật ký CHỈ THÊM: mỗi lần nộp một dòng. Không update/delete từ API.
create table if not exists platform.completion_evidence (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  subject_id      text not null check (subject_id in ('mathematics','physics','chemistry','biology')),
  content_id      text not null check (content_id ~ '^[a-z0-9-]{3,64}$'),
  course_id       text check (course_id is null or char_length(course_id) <= 64),
  activity_kind   text not null check (activity_kind in ('stem_lesson_check')),
  attempt_id      text not null check (attempt_id ~ '^[A-Za-z0-9-]{16,64}$'),
  evidence_kind   text not null default 'server_graded' check (evidence_kind in ('server_graded')),
  correct         integer not null check (correct >= 0),
  total           integer not null check (total >= 1 and correct <= total),
  ratio           numeric(4,3) not null check (ratio >= 0 and ratio <= 1),
  passed          boolean not null,
  content_version char(64),                       -- bamNoiDungBaiHoc(bài) lúc chấm
  answers         jsonb not null,                 -- [{questionIndex, raw, correct, reason}] ≤ 50 phần tử
  client_at       timestamptz not null,
  server_at       timestamptz not null default now(),
  constraint completion_evidence_attempt_uq unique (user_id, subject_id, content_id, attempt_id)
);

create index if not exists completion_evidence_user_content_idx
  on platform.completion_evidence (user_id, subject_id, content_id, server_at desc);

-- Trạng thái suy ra: 1 dòng/người/nội dung. Ghi qua upsert "không kéo lùi" trong CÙNG transaction
-- với dòng nhật ký (withTransaction, @dhcb/core-db/transaction).
create table if not exists platform.completion_state (
  user_id       uuid not null references public.users(id) on delete cascade,
  subject_id    text not null,
  content_id    text not null,
  status        text not null check (status in ('in_progress','completed')),
  best_ratio    numeric(4,3) not null,
  last_ratio    numeric(4,3) not null,
  attempts      integer not null default 1 check (attempts >= 1),
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (user_id, subject_id, content_id)
);

comment on table platform.completion_evidence is
  'Nhật ký chỉ-thêm bằng chứng hoàn thành (S11). attempt_id là khoá idempotent do client sinh; server chấm lại từ answers thô.';
comment on table platform.completion_state is
  'Trạng thái hoàn thành suy ra từ completion_evidence; completed không bao giờ bị kéo lùi.';
```

Upsert state (bất biến "không kéo lùi", cùng khuôn `programming.lesson_progress`):

```sql
insert into platform.completion_state (user_id, subject_id, content_id, status, best_ratio, last_ratio, attempts, completed_at, updated_at)
values ($1, $2, $3, $4, $5, $5, 1, case when $4 = 'completed' then now() end, now())
on conflict (user_id, subject_id, content_id) do update set
  status       = case when platform.completion_state.status = 'completed' then 'completed' else excluded.status end,
  best_ratio   = greatest(platform.completion_state.best_ratio, excluded.best_ratio),
  last_ratio   = excluded.last_ratio,
  attempts     = platform.completion_state.attempts + 1,
  completed_at = coalesce(platform.completion_state.completed_at, excluded.completed_at),
  updated_at   = now()
```

Nhật ký: `insert ... on conflict on constraint completion_evidence_attempt_uq do nothing returning id`
— không có `returning` = trùng → đọc lại dòng cũ, trả `duplicate: true`, **không** chạy upsert state.

### 3.4 Endpoint `POST | GET /api/learning/evidence`

- **POST** body = `CompletionEvidenceInputSchema`. Luồng: rate limit → auth → Zod → `activityKind`
  phải là `stem_lesson_check` (khác → 400 `UNSUPPORTED_ACTIVITY`) → tra bài theo `subjectId`
  (`getMathLesson`/…; không có → 400 `CONTENT_NOT_FOUND`) → `total = lesson.checkQuestions.length`
  (0 → 400 `NO_CHECK_QUESTIONS`) → `questionIndex` vượt `total-1` → 400 `BAD_QUESTION_INDEX` →
  chấm `stemEvidenceGrader(lesson, answers)` (câu không có trả lời = sai) → `passed =
decideCompletion('stem_lesson_check', …)` → `contentVersion = bamNoiDungBaiHoc(lesson)`
  (`packages/core-contracts/lessonReviewHash.ts:33`, dùng `node:crypto` nên chỉ server làm được)
  → transaction: insert nhật ký (on conflict do nothing) + upsert state → 200
  `CompletionEvidenceSchema`.
- **GET** `?subjectId=<stem>` → `{ state: CompletionState[] }` của `auth.userId`; thiếu/sai
  `subjectId` → 400. Không phân trang (tối đa 94 bài/môn — Lí).
- Rate limit `checkRateLimit(ip, 60, 'learning-evidence')` như `programming-progress`.

**Ca lỗi (là hợp đồng):**

| Tình huống                                                      | Mã / HTTP                                                             | Hành vi mong đợi                                                                                                                                                                   |
| --------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gửi trùng `attemptId` (retry mạng, bấm đúp, flush hàng đợi)     | 200 `duplicate:true`                                                  | Không dòng nhật ký thứ hai, state không đổi, trả đúng kết quả lần đầu; client gỡ khỏi hàng đợi                                                                                     |
| Gửi muộn (offline lúc nộp, mở app sau 3 ngày)                   | 200                                                                   | Server chấm bằng bài HIỆN TẠI, `contentVersion` là bản hiện tại; `clientAt` chỉ để hiển thị. Nếu bài đã đổi → có thể kết quả khác lúc chấm tại chỗ: UI nói "Chấm lại theo bài mới" |
| Hết auth (401) lúc nộp                                          | 401                                                                   | Client GIỮ trong hàng đợi (không xoá, không gửi lại tự động), hiện "Đăng nhập lại để lưu kết quả"; đăng nhập lại → `flushPendingEvidence`                                          |
| `version` ≠ 1, thiếu trường, có trường lạ (`correct`, `passed`) | 400 (Zod `.strict()`)                                                 | KHÔNG xếp hàng đợi (gửi lại cũng vẫn sai) — hiện lỗi rõ, kết quả tại chỗ vẫn xem được                                                                                              |
| `activityKind` chưa hỗ trợ                                      | 400 `UNSUPPORTED_ACTIVITY`                                            | Như trên                                                                                                                                                                           |
| Bài không tồn tại / 0 câu / index câu sai                       | 400 `CONTENT_NOT_FOUND` / `NO_CHECK_QUESTIONS` / `BAD_QUESTION_INDEX` | Không ghi gì                                                                                                                                                                       |
| DB lỗi (pool, transaction rollback)                             | 500 `internalErrorResponse`                                           | Không lộ stack; nhật ký + state cùng transaction nên không có "nhật ký có, state không"; client xếp hàng đợi `reason:'server'`                                                     |
| 5xx / mạng đứt                                                  | —                                                                     | Xếp hàng đợi (tối đa 50; đầy → bỏ bản cũ nhất, log console.warn có tiền tố `[evidence]`), UI "Đã lưu trên máy này, sẽ gửi lại"                                                     |
| Khách (`guest_*`)                                               | Không gọi server                                                      | `local_graded`, ghi `dhcb_evidence_<uid>` + state local; mục lục ghi `stem.evidence.local`                                                                                         |
| Khách sửa localStorage `passed:true` rồi đăng nhập              | —                                                                     | Merge gửi `answers` thô, server chấm lại → kết quả thật; bản khách bị bỏ                                                                                                           |
| localStorage bị chặn                                            | —                                                                     | try/catch (khuôn `programmingProgress.ts:14-31`); tài khoản vẫn gửi server; khách hiện "Không lưu được trên máy này"                                                               |
| Rate limit                                                      | 429                                                                   | Xếp hàng đợi `reason:'server'`, thử lại sau                                                                                                                                        |

### 3.5 Hợp đồng đọc cho mục lục S07 (`OutlineProgress`)

```ts
// packages/core-learner/outline/stemOutline.ts (S07) — mở rộng tương thích ngược
interface StemCtx {
  state: ReadonlyMap<string /*lessonId*/, CompletionState>
  stateStatus: 'loading' | 'ready' | 'error'
}
buildStemOutline(subjectId, grade, ctx?: StemCtx): Outline | undefined
// ctx vắng | stateStatus != 'ready'  → progress 'unknown'                      (giữ S07)
// ready, state.get(id) undefined     → 'not-started'
// ready, status 'in_progress'        → 'in-progress', evidenceSource 'stem.evidence' | 'stem.evidence.local'
// ready, status 'completed'          → 'completed',   evidenceSource như trên
```

`OutlinePane` (S07) cho trang STEM: gọi `fetchCompletionState(uid, subjectId)` một lần khi mở,
và lại sau mỗi `submitStemEvidence` thành công (không polling). Khách: đọc local đồng bộ →
`ready` ngay.

## ⑤ Bất biến không được phá

| Bất biến                                                                                      | Test canh                                                                                                                                                     |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Completion do server xác nhận từ dữ liệu THÔ; client không gửi được đúng/sai/điểm             | `evidence.test.ts` (strict schema từ chối `correct`/`passed`; chấm lại khác client), `completionEvidence.test.ts`                                             |
| Cùng `attemptId` = một dòng                                                                   | `evidence.test.ts` (on conflict do nothing → duplicate), `stemEvidence.test.ts` (flush 2 lần không gửi trùng khi đã 200)                                      |
| `completed` không kéo lùi (server + local + merge khách)                                      | `evidence.test.ts` (SQL upsert), `stemEvidence.test.ts` (state local), `guestProgress.test.ts` (merge)                                                        |
| Mở bài / AI / click không là evidence                                                         | E2E `stem-evidence.spec.ts` (0 request khi chỉ mở), `outline-stem.spec.ts` (S07 AC-9), `StemLesson.test.tsx` (không có chữ "hoàn thành" trước khi server trả) |
| Không đổi payload/endpoint hiện có; 8/30/11/6/4 test cũ xanh nguyên                           | `subjects/programming/progress.test.ts`, `core/progress.test.ts`, `_lib/progressMerge.test.ts`, `pathQuiz.test.ts`, `dailyLearningPlan.test.ts`               |
| Luật khoá không đổi; server là authority CEFR; client-lock Lập trình không nới                | `levelLock.test.ts`, `programmingLevelLock.test.ts`, `cefrUnlock.test.ts`, `ProgrammingLevelPage.test.tsx`                                                    |
| Merge khách không ghi đè tiến độ tài khoản; xoá sạch dấu vết khách; không merge vào id khách  | `guestProgress.test.ts` (20 ca + 4 mới)                                                                                                                       |
| Không tải nội dung bài để dựng mục lục (S07 AC-6): state đọc từ API/local, KHÔNG `loadLesson` | `stemOutline.test.ts` spy `loadLesson` = 0                                                                                                                    |
| Engine chấm không có AI, tất định                                                             | `packages/core-grading/grading.test.ts` (55 ca), `stemEvidenceGrader.test.ts`                                                                                 |
| Migration lũy đẳng; rollback là 2 lệnh drop                                                   | `npm run migrate:pg` × 2 (AC-2); CI job boot check `/api/health`                                                                                              |
| Hạn mức khách server theo guest ID + IP không đổi (không có endpoint nào cho khách)           | `packages/core-auth/guestTrial.test.ts`, `guest.test.ts`                                                                                                      |
| A11y AA + AAA 5 theme; mobile lề dưới; ngân sách bundle/coverage                              | `a11y.spec.ts`, `a11y-aaa.spec.ts`, `mobile-layout-guards.spec.ts`, `npm run budget`, `npm run test:coverage`                                                 |

## ⑥ Quy ước dự án liên quan (bên thi hành không thấy hội thoại)

- Import xuyên gói `@dhcb/<gói>/<file>` không đuôi `.js`; nội bộ gói tương đối có `.js`;
  `packages/` không import `apps/`/`api/`. Thêm phụ thuộc gói (`core-learner` → `core-grading`,
  `subject-*`) thì thêm cả `references` trong `tsconfig.json` + `package.json` của gói, chạy
  `npm install`, commit `package-lock.json`, kiểm `npm ci` exit 0 (TRAPS.md mục 3).
- Handler API: `validateAuth()` trước mọi query; `checkRateLimit`; Zod `.strict()` qua
  `readJsonBody`/`validateBody`; `jsonResponse`/`internalErrorResponse`; SQL tham số hoá; ghi
  nhiều bảng trong `withTransaction` (`@dhcb/core-db/transaction`). Test theo khuôn
  `apps/server/src/api/subjects/programming/progress.test.ts` (mock security + pgPool).
- Migration: `NNNN_mo-ta.sql`, idempotent, comment đầu file ghi đặc tả + rollback, thêm dòng vào
  `postgres/migrations/README.md`; `scripts/deploy.sh` tự chạy `migrate:pg` khi merge `main` —
  không cần thao tác tay nhưng PHẢI chạy 2 lần ở máy trước khi push.
- localStorage: mọi tiền tố mới ĐĂNG KÝ ở `guestProgress.ts` (`ALL_PREFIXES`) — nếu không,
  `clearGuestKeys` bỏ sót và khách sau kế thừa evidence khách trước; mọi truy cập try/catch.
- UI: chữ nội dung AAA (≥ 7:1), nút/nhãn AA; token `--a-*`/`--z-*`; trạng thái có CHỮ; vùng chạm
  ≥ 44px; `role="status"` cho kết quả; `text-[#fff]` trên nền cố định tối. Ảnh 1440/768/390/320
  trước/sau (Tầng 8b) dán PR.
- Không sửa `lessonsLazy.ts` (file sinh); STEM đổi thì `npm run gen:stem-lesson-index`.
- PR: `feat(learning): …` với mô tả dẫn file này + "Approved for implementation"; đủ 6 tiêu đề
  cổng `metadata`; READY (không nháp); bật auto-merge (squash) ngay sau tạo; CI đỏ là việc của
  PR. Cổng trên checkout sạch; cổng test CI là `test:coverage`.
- Changelog: một file mới `docs/changelog/NNNN-2026-MM-DD-slug.md` (`npm run changelog` in số),
  KHÔNG chồng mục vào `PROGRESS.md`.

## 7. Quyết định cần chủ dự án chốt trước khi Approved

> **CHỐT 2026-09-15 — chủ dự án:** lấy TOÀN BỘ cột "Đề xuất của AI (mặc định)"
> làm quyết định cuối cho mọi câu hỏi trong bảng dưới. Không có ý kiến khác.

| #   | Câu hỏi                                                                                                                                     | Đề xuất của AI (mặc định nếu không có ý kiến khác)   | Lý do                                                                                                                                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Ai chấm bài STEM: (a) client chấm bằng `core-grading`, server chỉ lưu; (b) client gửi trả lời THÔ, server chấm lại bằng cùng `gradeAnswer`? | **(b) server chấm lại.**                             | `core-grading/index.ts:7-8` đã hứa đúng điều này; server đã import 4 registry STEM (`admin-stem-review.ts`); `pathQuiz` là tiền lệ. (a) lặp lại nợ "client là authority" của bài Lập trình. Trả giá: server kéo registry STEM (~2 MB, đã có trong bundle server vì admin-stem-review). |
| Q2  | Ngưỡng "hoàn thành" bài STEM: 0.8 (khớp quiz chặng) · 0.7 (khớp thi cấp CEFR) · 1.0? Có bắt "mở đủ các phần" không?                         | **0.8, KHÔNG bắt "mở đủ phần".**                     | Cùng hằng số với quiz chặng Lập trình (`PASS_RATIO`); bài STEM có ~2–4 câu (đếm thô `prompt:` 198/208/200/170 trên 53/94/87/84 bài) nên 0.8 = "sai tối đa 1 câu khi có 5". "Mở phần" là click, spec nền cấm coi là evidence. Lưu `best_ratio` nên đổi ngưỡng sau không mất dữ liệu.    |
| Q3  | Bảng đặt ở schema `platform` (đã có, 0058) hay tạo schema `learning` mới?                                                                   | **`platform`.**                                      | Không tạo schema mới cho 2 bảng; `platform.feature_state` đã là "dữ liệu xuyên môn". Đổi sau bằng `alter table ... set schema` không mất dữ liệu.                                                                                                                                      |
| Q4  | Endpoint: `POST /api/learning/evidence` MỚI (chung, `activityKind` phân nhánh) hay `POST /api/stem/progress` riêng môn?                     | **Endpoint chung, S11 chỉ bật `stem_lesson_check`.** | Mục tiêu goal là "evidence từng hoạt động" — một cửa, một bảng luật; các môn STEM sau (thêm môn mới theo khuôn kiến trúc) không phải thêm endpoint. Lập trình/Tiếng Anh KHÔNG dời sang đây trong S11 (19 file ảnh hưởng ở `programmingProgress.ts`).                                   |
| Q5  | Khách STEM (`AllowGuest`): có evidence cục bộ (local_graded) hay "khách không có tiến độ STEM"?                                             | **Có, cục bộ, ghi rõ `stem.evidence.local`.**        | Bài Lập trình đã cho khách tiến độ cục bộ (`dhcb_prog_progress_`); mục lục S07 hiện "chưa đo được" mãi cho khách là trải nghiệm tệ. Đăng nhập → server chấm lại từ `answers` thô nên không có đường giả mạo.                                                                           |
| Q6  | Nộp evidence theo BÀI (1 lượt cho mọi câu) hay theo CÂU (mỗi câu một bản ghi)?                                                              | **Theo bài.**                                        | Một `attemptId`/một dòng/một kết quả; mục lục và màn kết quả đều nói về bài. Theo câu = 776 bản ghi tiềm năng/người, khó định nghĩa "hoàn thành" khi câu chấm ở các thời điểm khác nhau, và S12 vẫn đọc được `answers` jsonb để lập sổ lỗi từng câu.                                   |

## 8. Rủi ro, nợ ghi nhận và giảm thiểu

| Rủi ro / nợ                                                                                                        | Giảm thiểu                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nợ cũ lộ ra:** bài Lập trình "hoàn thành" do client tự chấm test case rồi POST (`ProgrammingLessonPage.tsx:184`) | S11 KHÔNG sửa (19 file ảnh hưởng, cần sandbox server). Ghi vào `PROGRESS.md` nợ mở: "server chạy lại test case hoặc ký kết quả worker"; bảng §③.2 ghi rõ "client là authority de facto" |
| **Nợ cũ:** bước dự án và hội thoại CEFR là "click = xong"                                                          | Ghi nợ; mục lục S07 giữ nhãn `english.cefrDialogue` = "đã xem"                                                                                                                          |
| Server kéo 4 registry STEM vào handler → bundle server nặng, boot chậm                                             | Đã có sẵn qua `admin-stem-review.ts`; đo `node dist-server/server.js` boot check CI không tăng > 1 s; nếu tăng → import động theo môn                                                   |
| Bài đổi nội dung sau khi học viên nộp (gửi muộn) → chấm lại khác kết quả tại chỗ                                   | `content_version` lưu mỗi dòng; UI nói "Chấm lại theo bài mới"; S09 quyết chính sách xung đột                                                                                           |
| Hàng đợi chờ gửi + S09 sau này chồng cơ chế                                                                        | Hàng đợi S11 là mảng đơn giản có `attemptId`; S09 thay bằng cơ chế version mà không mất bản ghi (idempotent)                                                                            |
| `numeric(4,3)` làm tròn ratio (vd 2/3 = 0.667) → so ngưỡng lệch                                                    | `passed` tính từ `correct/total` số nguyên TRƯỚC khi lưu, không từ `ratio` đã làm tròn; test 2/3 với ngưỡng 0.8                                                                         |
| `crypto.randomUUID` vắng (HTTP không phải localhost, WebView cũ)                                                   | `attemptId` cố ý KHÔNG dùng `.uuid()`: regex `[A-Za-z0-9-]{16,64}` nhận cả UUID lẫn fallback `Date.now().toString(36) + 2×Math.random().toString(36)`; test canh fallback ≥ 16 ký tự    |
| Coverage tụt vì nhiều nhánh lỗi/hàng đợi                                                                           | `stemEvidence.ts` tách hàm thuần (`enqueue`, `shouldQueue(status)`, `mergeState`) test 100%; UI test bằng RTL                                                                           |
| Khách nộp nhiều lần → localStorage phình                                                                           | Trần 200 bản ghi/khách, cắt cũ nhất; state map tách riêng nên mục lục không cần đọc nhật ký                                                                                             |

## 9. Kế hoạch thi hành (3 PR, tuần tự; mỗi PR một subagent, agent chính review)

1. **S11-1 `feat(learning): hop dong CompletionEvidence, migration 0081 va POST /api/learning/evidence`**
   — contracts + `completionRules` + `stemEvidenceGrader` + migration + handler + route + test.
   Không đổi UI. Phụ thuộc: **không** (có thể merge trước S07/S08 vì không chạm file của chúng).
   Rollback: revert PR + chạy 2 lệnh `drop table` trong comment đầu migration (bảng mới, không
   ai đọc — an toàn).
2. **S11-2 `feat(learning): bai STEM nop tu kiem tra, evidence khach va hang doi gui lai`** —
   `stemEvidence.ts`, `guestProgress.ts` tiền tố mới + merge, `StemLessonView` nút Nộp, E2E
   `stem-evidence.spec.ts`. Phụ thuộc: S11-1 merge. Rollback: revert PR; dữ liệu server đã ghi
   giữ nguyên (chỉ thêm), localStorage khách tự hết vai trò khi `clearGuestKeys`.
3. **S11-3 `feat(learning): man ket qua ActivityResult va muc luc STEM doc evidence`** —
   `ActivityResult`, `stemOutline` ctx, `OutlinePane` fetch state, a11y routes, ảnh. Phụ thuộc:
   S11-2 + **S07-2 merge** (file `stemOutline.ts`/`OutlinePane.tsx` là của S07). Rollback: revert
   PR — mục lục quay về `unknown`, không mất dữ liệu.
4. Mỗi PR: changelog `docs/changelog/03xx-*.md`, `PROGRESS.md` (nợ mới ở §8), goal bảng S11
   (Issue/PR/State/Evidence), đổi trạng thái ở spec này; S11-1 dán output `migrate:pg` × 2.

## 19. Phê duyệt

- [x] Product outcome và scope (Q1–Q6; đặc biệt Q2 ngưỡng 0.8 và Q5 khách)
- [x] Schema (§③.3 — 2 bảng `platform.*`, migration 0081, rollback) — `CLAUDE.md` §12
- [x] Architecture (server chấm lại, endpoint chung, idempotency `attemptId`, không đổi endpoint cũ)
- [x] UX/accessibility (màn kết quả 5 trạng thái có chữ, nút Nộp ≥ 44px, hàng đợi có `role="status"`)
- [x] Test/rollout/rollback (3 PR, migration × 2)

**Kết luận:** Approved for implementation  
**Người duyệt:** Chủ dự án  
**Ngày:** 2026-09-15
