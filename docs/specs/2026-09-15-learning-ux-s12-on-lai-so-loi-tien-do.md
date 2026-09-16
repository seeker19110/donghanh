# Góc học tập — slice S12: Ôn lại · sổ lỗi · tiến độ CÓ BẰNG CHỨNG (hàng đợi ôn xuyên môn, sổ lỗi gắn evidence, số tiến độ chỉ từ evidence)

| Thuộc tính    | Giá trị                                                                                                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec cha      | [`2026-09-15-goc-hoc-tap-architecture.md`](2026-09-15-goc-hoc-tap-architecture.md); spec nền [`2026-09-15-learning-ux-foundation.md`](2026-09-15-learning-ux-foundation.md) §① "Không đổi … mastery, thuật toán SRS", §⑤ (evidence receipt `srs_review` không tự mở rộng) |
| Phụ thuộc     | **S11** ([`…-s11-completion-evidence.md`](2026-09-15-learning-ux-s11-completion-evidence.md) — In review: `CompletionEvidence` §3.1, migration `0082` (S05 lấy `0081`), `POST                                                                                             | GET /api/learning/evidence`§3.4, màn kết quả chừa`reviewSlot`cho S12 §① KHÔNG LÀM); **S07** (hợp đồng`OutlineNode` + bảng evidence từng môn §③.3 của [`…-07-muc-luc-mon-khoa.md`](2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md)) |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md) dòng S12 (Dependency: S11); S13 đứng sau S12                                                                                                                                                                          |
| Base khảo sát | `main` `06949af` (sau spec S07/S08; spec S11 viết song song cùng ngày), khảo sát 2026-09-15 bằng grep/sed + `npm run codemap -- impact` trên mã thật; mọi số đếm trong spec là số đo được, có đường dẫn + số dòng                                                         |
| Trạng thái    | **Approved for implementation** — chủ dự án chốt TOÀN BỘ câu hỏi §7 theo đề xuất mặc định (2026-09-15)                                                                                                                                                                    |
| Người duyệt   | Chủ dự án                                                                                                                                                                                                                                                                 |

> Không bắt đầu code khi trạng thái chưa là **Approved for implementation**. Luật số 1 của khuôn
> `docs/templates/dac-ta-tinh-nang.md`: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.
>
> Spec S11 được viết song song và còn **In review**: mọi tên `CompletionEvidence`, `items[]`,
> `questionIndex`, `evidenceKind`, `reviewSlot`, `dhcb_evidence_<uid>` dưới đây lấy theo S11 §3.1/§3.4
> tại thời điểm viết — **S12 phải đối chiếu lại sau khi S11 Approved + merge**, không tự bịa field.
> Trong S11, chỉ STEM (`stem_lesson_check`) đi qua endpoint evidence; Lập trình vẫn ở
> `/api/programming/progress` (không có câu trả lời từng bước) → sổ lỗi "từ evidence" trong S12
> **chỉ có STEM**; Lập trình ghi "chưa có bằng chứng câu sai" (§7 Q1).

## 0. Một câu

Cho người học (đã đăng nhập) một chỗ duy nhất để biết **hôm nay cần ôn gì trên mọi môn** (thẻ từ
vựng/ngữ pháp Anh, thẻ Lập trình, thẻ STEM, lỗi đã mắc), ôn xong thì kết quả ghi đúng vào cơ chế
hiện có; sổ lỗi mỗi mục **chỉ vào được đúng bài/bước đã sinh ra nó**; và trang `/tien-do` chỉ hiện
những con số **có bằng chứng từ domain**, môn nào chưa có evidence thì ghi "chưa đo được" — mà
**không đổi một dòng nào của công thức FSRS/SRS, không thêm gamification, không gọi AI**.

## ④ Tiêu chí chấp nhận (đo được — mỗi dòng ghi lệnh/bằng chứng)

Chia 3 PR con (§9): **S12-1** hàng đợi ôn xuyên môn · **S12-2** sổ lỗi có bằng chứng · **S12-3**
tiến độ có bằng chứng. AC ghi rõ thuộc PR nào.

### S12-1 — hàng đợi ôn "hôm nay" gộp nguồn (chỉ ĐỌC SRS, ghi qua cơ chế hiện có)

- [ ] **AC-1 Một kiểu mục ôn dùng chung.** `packages/core-contracts/reviewItem.ts` export
      `ReviewItem`, `ReviewKind`, `ReviewQueue` đúng §③.1 + Zod `ReviewItemSchema`/`ReviewQueueSchema`;
      test canh: `href` là route nội bộ (bắt đầu `/`), `dueAt` là epoch ms hữu hạn, `courseId` có →
      `href` chứa `?khoa=<courseId>` (tái dùng luật S07 AC-3), `evidenceSource` thuộc allowlist
      §③.1, `kind:'mistake'` bắt buộc `mistakeId`. — `npx vitest run packages/core-contracts/reviewItem.test.ts`.
- [ ] **AC-2 Hàm gộp thuần, đồng bộ, không fetch, không mutate.** `apps/dhcb/src/lib/reviewQueue.ts`
      export `buildReviewQueue(sources, opts): ReviewQueue` nhận **kết quả đã đọc** của 4 nguồn
      (§③.2) và trả hàng đợi đã sắp + cắt cap. Test canh `vi.spyOn` trên `reviewWord`,
      `reviewGrammar`, `reviewProgCard`, `markReviewed`, `localStorage.setItem` = **0 lần** khi gọi
      `buildReviewQueue`. — `apps/dhcb/src/lib/reviewQueue.test.ts` ≥ 12 ca (rỗng, mỗi nguồn riêng,
      gộp 4 nguồn, trùng mục, cap, `?cap=`, thứ tự).
- [ ] **AC-3 Không đổi công thức SRS (bất biến, snapshot).** `apps/dhcb/src/lib/srs.ts` chỉ được
      thêm **một** hằng vào `NAMESPACE_KHONG_PHAI_TU_VUNG` (dòng 295, hiện `['grammar:', 'prog:']`
      → thêm `'stem:'`, §7 Q5) — KHÔNG đổi `reviewWord` (dòng 228–247), `getDueBy` (262–283),
      `SRS_SESSION_CAP = 30` (108), `LEECH_THRESHOLD = 3` (104), `NEW_CARD_DELAY_MS` (193),
      `addToSRSKnown`. Test snapshot mới `apps/dhcb/src/lib/srs.golden.test.ts`: với
      `vi.setSystemTime` cố định và chuỗi rating `again→hard→good→good→easy` trên 3 thẻ, chụp
      `due/stability/difficulty/state/lapses` sau từng bước vào `__snapshots__`; PR nào làm snapshot
      đổi mà không có lý do ở §7 thì đỏ. `getSRSStats` vẫn KHÔNG đếm `grammar:`/`prog:`/`stem:`
      (ca test đang có ở `srs.test.ts` mở rộng thêm `stem:`). —
      `npx vitest run apps/dhcb/src/lib/srs.golden.test.ts apps/dhcb/src/lib/srs.test.ts`.
- [ ] **AC-4 Thẻ STEM vào vòng ôn CHỈ khi có evidence S11.** `apps/dhcb/src/lib/stemSrs.ts` (mới,
      khuôn y hệt `programmingSrs.ts` 86 dòng): khoá `stem:<subjectId>:<lessonId>:<i>` hạ chữ
      thường; `addStemLessonCardsToSrs(uid, subjectId, lessonId)` chỉ được gọi từ `reviewSlot` của màn kết
      quả S11 khi `submitStemEvidence` trả `evidence.passed === true` (cả `server_graded` lẫn
      `local_graded` — thẻ SRS vốn cục bộ), **không** gọi khi mở trang `StemLessonView`, không gọi
      khi `kind:'rejected'`; `getDueStemCards` dùng `getDueBy`; `hydrateStemCards` nạp qua
      `STEM_SUBJECTS[id].loader.loadLesson` đúng bài (spy: chỉ nạp bài có thẻ đến hạn). Số thẻ mỗi
      bài đọc từ `srsCards.length` của bài đã nạp, KHÔNG thêm `srsCardCount` vào chỉ mục STEM (file
      sinh) trừ khi §7 Q5 chọn phương án b. — `stemSrs.test.ts` ≥ 8 ca; test "mở trang STEM không
      thêm thẻ" ở `StemLesson.test.tsx`.
- [ ] **AC-5 Trang hàng đợi `/goc-hoc-tap/on-tap` (§7 Q4).** Trang mới `ReviewHub.tsx`
      (`RequireAccount`), nhóm theo môn, mỗi nhóm: số mục đến hạn + nút "Ôn ngay" đi tới UI ôn
      **hiện có** với cap của phiên (Anh → `/lo-trinh-hoc/<cấp>?tab=srs&cap=<n>`; Lập trình →
      `/lap-trinh/on-tap`; STEM → `/goc-hoc-tap/<subjectId>/on-tap` (mới, AC-6); lỗi →
      `/so-tay-loi-sai`). Hàng đợi rỗng → một `role="status"` "Hôm nay không có gì đến hạn — quay
      lại ngày mai" + link "Học tiếp" (không phải màn trắng, không gợi ý AI). — E2E
      `e2e/review-hub.spec.ts` ca rỗng + ca có 3 nguồn (seed localStorage `srs_<uid>` bằng thẻ
      quá hạn); `a11y.spec.ts` + `a11y-aaa.spec.ts` thêm route.
- [ ] **AC-6 Ôn thẻ STEM tái dùng UI lật thẻ của Lập trình.** Tách phần thẻ/4 nút đánh giá của
      `ProgrammingReview.tsx` (213 dòng) thành `apps/dhcb/src/components/FlashcardReview.tsx` nhận
      `cards`, `onRate(key, rating)`, `cap`; `ProgrammingReview` và `StemReview` (mới, route
      `/goc-hoc-tap/:subjectId/on-tap`) cùng dùng. E2E `programming-lesson.spec.ts:540–560` (2 ca ôn
      thẻ Lập trình đang có) **xanh y nguyên** — bằng chứng tách không đổi hành vi. —
      `FlashcardReview.test.tsx` ≥ 6 ca; `npx playwright test e2e/programming-lesson.spec.ts`.
- [ ] **AC-7 Cap phiên thống nhất, tái dùng `?cap=`.** `buildReviewQueue` cắt tổng `≤ cap`
      (mặc định `SRS_SESSION_CAP` 30; `?cap=` trên `/goc-hoc-tap/on-tap` đọc y hệt
      `CefrLevelPage.tsx:126–131` — số nguyên 1..30, sai/thiếu → mặc định); luồng comeback
      (`lib/comeback.ts` `COMEBACK_SRS_CARDS = 5`) trỏ tới hub với `?cap=5` thay vì chỉ SRS Anh;
      thứ tự ưu tiên trong cap: `dueAt` tăng dần (quá hạn lâu nhất trước) → `kind:'mistake'` trước
      thẻ → `difficulty` giảm dần (§③.2). — `reviewQueue.test.ts` ca cap + `comeback.test.ts` cập
      nhật href.
- [ ] **AC-8 Ghi kết quả ôn KHÔNG qua đường mới.** Sau khi ôn ở từng UI, kết quả đi đúng hàm cũ:
      `reviewWord`/`reviewGrammar` (Anh, `pushProgress` → `/api/progress` → `mergeSrsMap` +
      receipt `srs_review` như `progress.ts:316–323`), `reviewProgCard` (Lập trình),
      `reviewStemCard` (STEM, cùng `reviewWord` dưới namespace), `markReviewed` (lỗi). Không thêm
      endpoint ghi, không thêm `action_kind` vào `daily_plan_completions` (check constraint
      `0075` chỉ nhận `'srs_review'`). — grep `insert into public.daily_plan_completions` chỉ còn
      ở `progress.ts`; `progress.test.ts` 30 ca xanh.

### S12-2 — sổ lỗi có bằng chứng (Anh giữ bảng, STEM đọc từ evidence S11)

- [ ] **AC-9 Mỗi mục lỗi Anh có thể gắn evidence, không bắt buộc.** `english.mistakes` thêm 3 cột
      nullable (migration `0084_mistakes_evidence.sql`, idempotent, có rollback): `attempt_id uuid`,
      `content_id text`, `subject_id text default 'english'`; `MistakeSchema` server
      (`mistakes.ts:37–48`) và `Mistake` client (`lib/mistakes.ts:21`) thêm `attemptId?`,
      `contentId?`; `norm()` + `dedupe_key` **không đổi** (lỗi trùng vẫn gộp một dòng, evidence
      giữ bản MỚI nhất). Chat/Writing/Speaking (`Chat.tsx:644`, `Writing.tsx:350`,
      `Speaking.tsx:941`) truyền `attemptId` khi S11 đã có, không có thì `undefined` — 43 ca
      `mistakes.test.ts` + 15 ca server xanh không sửa. — `npm run migrate:pg` chạy 2 lần không
      lỗi; `npx vitest run apps/dhcb/src/lib/mistakes.test.ts apps/server/src/api/subjects/english/mistakes.test.ts`.
- [ ] **AC-10 Sổ lỗi STEM = VIEW đọc từ evidence S11, không bảng thứ hai (§7 Q1).**
      `apps/dhcb/src/lib/evidenceMistakes.ts` export `mistakesFromEvidence(evidence)` →
      `MistakeEntry[]` (thuần, vào là `readonly CompletionEvidence[]`): mỗi `items[i].correct === false`
      (S11 §3.1 `CompletionEvidenceSchema.items`) → một `MistakeEntry` §③.3 có `attemptId`,
      `subjectId`, `contentId`, `questionIndex`, `reason` (chữ grader ghi), `href` tới đúng bài +
      neo câu. Cùng `contentId+questionIndex` sai ở nhiều `attemptId` → **một** mục, `count` = số
      lượt sai, giữ `attemptId`/`clientAt` mới nhất; câu đã trả lời ĐÚNG ở lượt mới hơn → mục bị
      gỡ (lỗi đã sửa). Bản `evidenceKind:'local_graded'` (khách) hiện nhãn "chấm trên thiết bị".
      Nguồn dữ liệu: `GET /api/learning/evidence?subjectId=&include=attempts` (mở rộng ĐỌC của
      S11 §3.4, §7 Q2) hoặc bộ đệm `dhcb_evidence_<uid>` khi lỗi mạng. —
      `evidenceMistakes.test.ts` ≥ 8 ca (rỗng, đúng hết, sai 1, sai lặp 2 attempt, sửa đúng ở
      lượt sau → gỡ, evidence thiếu field → bỏ mục đó không ném, `local_graded`).
- [ ] **AC-11 "Ôn lại lỗi này" đi tới đúng bài/câu.** Trang `/so-tay-loi-sai` (`MistakeBank.tsx`
      415 dòng, hiện chỉ Anh) thêm bộ lọc môn và nút "Ôn lại lỗi này": Anh → `href` là nơi mắc lỗi
      theo `source` (`chat`→`/tro-chuyen`, `writing`→`/luyen-viet`, `speaking`→`/luyen-noi`, đọc từ
      MỘT bảng ánh xạ, không rải chuỗi); STEM → hàm dựng URL bài của `stemLessonRoutes.ts` (S07
      dùng) + `#cau-<questionIndex+1>`; Lập trình: bài đi qua `/api/programming/progress` không
      có câu trả lời (S11 §3.1) → nhóm Lập trình hiện "chưa có bằng chứng câu sai" (chữ, không
      phải danh sách rỗng giả). Mục có `attemptId` hiện nhãn "có bằng chứng · <ngày>"; mục cũ
      không có thì hiện "ghi tay" — **không** giả bằng chứng. — `MistakeBank.test.tsx` (mới) ≥ 6
      ca; E2E `e2e/mistake-bank.spec.ts` ca bấm "Ôn lại" tới đúng URL.
- [ ] **AC-12 Lỗi vào hàng đợi ôn.** `buildReviewQueue` nhận `mistakesDue` (Anh: `getDueMistakes`
      giữ `REVIEW_SPACING_MS`, `lib/mistakes.ts:173–177`; STEM: `mistakesFromEvidence` lọc cùng
      hằng spacing, import từ `lib/mistakes.ts`) → `kind:'mistake'`. Một lỗi đã có thẻ SRS cùng `contentId` (vd bài
      ngữ pháp vừa sai) chỉ xuất hiện **một** mục (giữ `mistake`, bỏ thẻ) — ca "hai nguồn trùng
      mục" §③.4. — `reviewQueue.test.ts`.

### S12-3 — tiến độ có bằng chứng

- [x] **AC-13 Số tiến độ theo môn chỉ từ evidence, qua Outline S07.** `apps/dhcb/src/lib/progressSummary.ts`
      export `summarizeOutline(outline: Outline): SubjectProgressSummary` (§③.5): đếm lá
      `kind:'lesson'|'activity'` theo `progress` (`completed`/`in-progress`/`not-started`/`unknown`);
      `measured = false` khi **mọi** lá là `unknown` → UI ghi "chưa đo được". Không có nhánh nào
      suy `completed` từ "đã xem"/"đã mở". — `progressSummary.test.ts` ≥ 8 ca trên cây thật của
      3 adapter S07 (Lí 94 bài toàn `unknown` → `measured:false`; P1 với 2 bản ghi `completed` →
      `2/n`).
- [x] **AC-14 Trang `/tien-do` có khối "Tiến độ theo môn", không có điểm chẩn đoán.**
      `Dashboard.tsx` (787 dòng) thêm section dùng `summarizeOutline` cho Anh (cấp hiện tại),
      Lập trình (bậc hiện tại), 4 môn STEM; mỗi thẻ: `<n>/<tổng>` + nhãn nguồn ("theo bài đã đạt
      test", "theo vòng từ đã thuộc") hoặc "chưa đo được". **Không** hiện `placement`, band ước
      lượng, `masterySummary`, số "năng lực" — grep trong section mới không có `placement|band|mastery`.
      Các StatCard cũ (dòng 514–535) giữ nguyên. Khối cần `RequireAccount` như trang hiện có. —
      `Dashboard.test.tsx` (mới, ≥ 5 ca gồm ca "toàn `unknown` → chữ 'chưa đo được'"), E2E
      `a11y.spec.ts`/`a11y-aaa.spec.ts` route `/tien-do` đã có → 0 vi phạm.
- [x] **AC-15 Không dùng `learningReadModelService` làm nguồn tiến độ.** `grep -rn
"learning-read-model\|getLearningReadModel" apps/dhcb/src` = 0 sau S12 (hiện = 0; giữ). Lý
      do: service đọc cột `english.learning_progress.stats` (`learningReadModelService.ts:68`)
      **không tồn tại** trong `postgres/schema.sql:150–175` lẫn mọi migration (grep `stats` trong
      `postgres/` chỉ ra `tts_cache_stats`) — `masterySummary` là số không có nguồn. Ghi nợ ở §8,
      không sửa trong S12.
- [x] **AC-16 Thẻ tiến độ ở Home/`ShareProgress` không đổi con số cũ.** `ShareProgress.tsx:16–17`
      (`getStreak`, `getLearnedCount`) và thẻ "lộ trình %" Dashboard giữ nguyên nguồn (đó là
      evidence Anh hợp lệ: từ đã thuộc, vòng đã xong). Snapshot test render `ShareProgress` không
      đổi. — `npx vitest run apps/dhcb/src/components/ShareProgress.test.tsx` (tạo nếu chưa có).
- [x] **AC-17 Nhìn bằng mắt (Tầng 8b) + a11y + ngân sách.** Ảnh 1440/768/390/320px TRƯỚC/SAU: hub
      ôn (rỗng + có 3 nguồn), sổ lỗi có bộ lọc môn, `/tien-do` khối tiến độ theo môn (có ít nhất
      một thẻ "chưa đo được"), ôn thẻ STEM; 5 theme; `e2e/a11y*.spec.ts` 0 vi phạm; `npm run
budget` sau build: chunk `Dashboard` và chunk hub tăng ≤ 6 kB gzip mỗi chunk so với `main`
      (dán số); **không** kéo registry STEM (~2 MB) hay `lessons.ts` 3 MB vào hub (hub chỉ import
      chỉ mục + `loadLesson` lười).

**Lệnh chứng minh (mỗi PR con, trên checkout sạch):**

```bash
rm -rf packages/*/dist dist dist-server && npm ci
npm run typecheck && npm run lint && npm run format && npm run build && npm run test:coverage
npm run budget
npx vitest run apps/dhcb/src/lib/srs.golden.test.ts apps/dhcb/src/lib/reviewQueue.test.ts \
  apps/dhcb/src/lib/stemSrs.test.ts apps/dhcb/src/lib/evidenceMistakes.test.ts \
  apps/dhcb/src/lib/progressSummary.test.ts packages/core-contracts/reviewItem.test.ts
npx playwright test e2e/review-hub.spec.ts e2e/mistake-bank.spec.ts e2e/programming-lesson.spec.ts \
  e2e/quiz-session.spec.ts e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts e2e/mobile-layout-guards.spec.ts
npm run migrate:pg && npm run migrate:pg   # S12-2: lũy đẳng
```

## ① Phạm vi

**LÀM (theo PR con):**

**S12-1 — hàng đợi ôn xuyên môn:**

1. `packages/core-contracts/reviewItem.ts` + Zod + test (§③.1).
2. `apps/dhcb/src/lib/reviewQueue.ts` — `buildReviewQueue` thuần (§③.2) + `docCapTuQuery`
   (rút từ `CefrLevelPage.tsx:126–131` thành hàm dùng chung, trang cấp gọi lại hàm này —
   không copy-paste).
3. `apps/dhcb/src/lib/stemSrs.ts` — namespace `stem:` trên kho SRS chung (khuôn `programmingSrs.ts`).
4. `apps/dhcb/src/components/FlashcardReview.tsx` tách từ `ProgrammingReview.tsx`; trang
   `ReviewHub.tsx` (`/goc-hoc-tap/on-tap`) + `StemReview.tsx` (`/goc-hoc-tap/:subjectId/on-tap`).
5. `srs.ts`: thêm `'stem:'` vào `NAMESPACE_KHONG_PHAI_TU_VUNG`; test golden snapshot.
6. Home "Hôm nay" (S06) và comeback trỏ tới hub với `?cap=`; `navTree.ts` thêm mục "Ôn tập"
   cấp nền tảng (KHÔNG thêm nhánh con — sidebar dừng ở cấp môn, spec cha §③).

**S12-2 — sổ lỗi có bằng chứng:**

7. Migration `0084_mistakes_evidence.sql` (3 cột nullable) + `mistakes.ts` server/client thêm
   field tuỳ chọn; `guestProgress.ts` **không** thêm tiền tố `et_mistakes_` (sổ lỗi là
   `RequireAccount` + `FeatureGate mistake_bank`, `App.tsx:858–866`; khách không có sổ — giữ).
8. `apps/dhcb/src/lib/evidenceMistakes.ts` (thuần) + `mistakeRoutes.ts` (một bảng ánh xạ
   `source → href`).
9. `MistakeBank.tsx`: bộ lọc môn, nút "Ôn lại lỗi này", nhãn "có bằng chứng"/"ghi tay".

**S12-3 — tiến độ có bằng chứng:**

10. `apps/dhcb/src/lib/progressSummary.ts` (thuần, chỉ nhận `Outline` S07) + test.
11. `Dashboard.tsx` thêm section "Tiến độ theo môn"; E2E + ảnh + changelog + `PROGRESS.md` + goal.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- **KHÔNG đổi thuật toán SRS/FSRS, BKT, mastery**: không sửa `reviewWord`, `getDueBy`,
  `SRS_SESSION_CAP`, `LEECH_THRESHOLD`, `NEW_CARD_DELAY_MS`, tham số `getScheduler`
  (`setExamRetention`), `mergeSrsMap` server, `countCompletedDueVocabularyCards`. S12 **chỉ đọc**
  kho SRS và ghi qua hàm cũ. Golden snapshot AC-3 canh.
- KHÔNG thêm gamification mới (điểm, huy hiệu, bảng xếp hạng, streak mới); `achievements.ts`,
  `weeklyGoal.ts`, `storage.ts` streak (dòng 199–303) không đụng.
- KHÔNG gọi AI để sinh câu ôn/giải thích (không `/api/agent`, không tốn lượt). Hub và sổ lỗi là
  dữ liệu đã có.
- KHÔNG làm đồng bộ đa thiết bị/version/xung đột (S09): hàng đợi tính từ localStorage + evidence
  đã fetch; nếu S09 chưa merge thì STEM/Lập trình chỉ đúng trên thiết bị đang dùng — UI ghi rõ
  "trên thiết bị này" ở nhóm chưa sync (không giả sync).
- KHÔNG đổi billing/entitlement/`FeatureGate mistake_bank`/hạn mức khách/`RequireAccount`.
- KHÔNG mở rộng ngầm evidence receipt `srs_review`: không thêm `action_kind`, không ghi receipt từ
  client, không đổi check constraint `0075` (spec nền §⑤).
- KHÔNG hiển thị `placement`, band IELTS ước lượng, `masterySummary`, số năng lực/chẩn đoán như
  màn chính (CLAUDE.md §2 luật số 1). Khối band ở Dashboard hiện có (dòng 648–707, kết quả bài
  viết đã chấm) là evidence thật của hoạt động viết → giữ, nhưng không đưa vào "Tiến độ theo môn".
- KHÔNG đụng `memoryPalace*` (`packages/core-ai/memoryPalaceService.ts`, API
  `apps/server/src/api/learning/memory-palace.ts`): grep `memory_palace` trong
  `postgres/migrations` = 0 file → không có bảng, không phải nguồn evidence; ngoài phạm vi.
- KHÔNG sửa `learningReadModelService.ts`/`programmingReadModelService.ts` (nợ cột `stats` ghi ở
  §8, tách việc riêng).
- KHÔNG tạo bảng `mistakes` thứ hai cho STEM (§7 Q1) — đọc từ evidence S11; KHÔNG dựng sổ lỗi ghi tay cho Lập trình.
- KHÔNG viết lại `SRSReview.tsx`, `HardWords.tsx`, tab "Ôn SRS"/"Từ khó" của `CefrLevelPage`
  (`STUDY_TABS` dòng 102–103): hub chỉ **dẫn tới** chúng với `?tab=srs&cap=`.
- KHÔNG sửa file sinh `lessonsLazy.ts` (Lập trình) và chỉ mục STEM trừ khi §7 Q5 chọn (b).

## ② Điểm chạm (đã khảo sát thật trên `88778f4`; `main` `06949af` chỉ thêm docs, mã nguồn không đổi)

| PR  | Việc | Đường dẫn file                                                                                   | Ghi chú khảo sát                                                                                                                                                                                                                      |
| --- | ---- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Thêm | `packages/core-contracts/reviewItem.ts` (+ `.test.ts`)                                           | Cạnh `activity.ts` (đã có `ActivityKindSchema` gồm `'srs_review'`) và `outline.ts` (S07).                                                                                                                                             |
| 1   | Thêm | `apps/dhcb/src/lib/reviewQueue.ts`, `stemSrs.ts` (+ test)                                        | Đọc `getDueWords`/`getDueGrammarLessonIds` (`srs.ts:252, 344`), `getDueProgCards` (`programmingSrs.ts:65`), `getDueMistakes` (`mistakes.ts:173`).                                                                                     |
| 1   | Sửa  | `apps/dhcb/src/lib/srs.ts`                                                                       | **30 file ảnh hưởng** (codemap) — chỉ thêm `'stem:'` vào mảng dòng 290. Không đổi hàm.                                                                                                                                                |
| 1   | Sửa  | `apps/dhcb/src/pages/subjects/programming/ProgrammingReview.tsx`                                 | 213 dòng; tách `FlashcardReview`; giữ `getDueProgCards(user.id, SRS_SESSION_CAP)` (dòng 52), trạng thái `'error'` + `lanThu` (58–59).                                                                                                 |
| 1   | Thêm | `apps/dhcb/src/components/FlashcardReview.tsx`, `pages/learning/ReviewHub.tsx`, `StemReview.tsx` | Route mới ở `App.tsx` cạnh `/goc-hoc-tap/:subjectId/bai-hoc/:lessonSlug` (dòng 630); `RequireAccount`.                                                                                                                                |
| 1   | Sửa  | `apps/dhcb/src/pages/subjects/english/CefrLevelPage.tsx`                                         | 1229 dòng; dòng 126–131 đọc `?cap=` → thay bằng `docCapTuQuery` dùng chung, hành vi y nguyên (`session-cap.spec.ts` xanh).                                                                                                            |
| 1   | Sửa  | `apps/dhcb/src/lib/comeback.ts`, `pages/core/Home.tsx:194–206`                                   | Nút comeback "Ôn n thẻ" trỏ hub `?cap=5`; `COMEBACK_SRS_CARDS` không đổi.                                                                                                                                                             |
| 1   | Sửa  | `apps/dhcb/src/lib/navTree.ts`, `navPaths.ts`                                                    | Thêm mục "Ôn tập" (`/goc-hoc-tap/on-tap`); `navTree.test.ts` canh không thêm nhánh con.                                                                                                                                               |
| 2   | Thêm | `postgres/migrations/0084_mistakes_evidence.sql`                                                 | `alter table english.mistakes add column if not exists …` ×3; rollback `drop column if exists`. Số `0084` = sau `0081` (S05) · `0082` (S11) · `0083` (S09), theo thứ tự thi hành đã chốt — kiểm lại `ls postgres/migrations` lúc làm. |
| 2   | Sửa  | `apps/server/src/api/subjects/english/mistakes.ts` (186 dòng)                                    | `MistakeSchema` 37–48 thêm 2 field optional; `SELECT_ALL` 91–93 + `rowToMistake` + upsert 141–155 thêm cột; `dedupe_key` không đổi.                                                                                                   |
| 2   | Sửa  | `apps/dhcb/src/lib/mistakes.ts` (283 dòng)                                                       | **8 file ảnh hưởng** (codemap: Dashboard, MistakeBank, Chat, Writing, Speaking + test). Field optional → 3 trang gọi `addMistake` không bắt buộc sửa; sửa khi S11 có `attemptId`.                                                     |
| 2   | Thêm | `apps/dhcb/src/lib/evidenceMistakes.ts`, `mistakeRoutes.ts` (+ test)                             | Import `CompletionEvidence` từ `@dhcb/core-contracts/completionEvidence` (S11 §3.1). Nội dung câu hỏi nạp lười qua `STEM_SUBJECTS[id].loader.loadLesson`.                                                                             |
| 2   | Sửa  | `apps/server/src/api/learning/evidence.ts` (S11, + test)                                         | Chỉ thêm nhánh ĐỌC `?include=attempts` (§7 Q2): `select … from <bảng nhật ký 0082 (S11)> where user_id=$1 and subject_id=$2 order by … limit 200`; POST không đổi.                                                                    |
| 2   | Sửa  | `apps/dhcb/src/pages/core/MistakeBank.tsx` (415 dòng)                                            | `deck` chốt một lần (dòng 198–199) giữ; thêm bộ lọc môn + nút "Ôn lại". Hiện KHÔNG có test unit.                                                                                                                                      |
| 3   | Thêm | `apps/dhcb/src/lib/progressSummary.ts` (+ test)                                                  | Chỉ import `@dhcb/core-contracts/outline`.                                                                                                                                                                                            |
| 3   | Sửa  | `apps/dhcb/src/pages/core/Dashboard.tsx` (787 dòng)                                              | **2 file ảnh hưởng** (`App.tsx`, `main.tsx`) — an toàn. Cần 3 adapter S07 (`buildCefrOutline`, `buildLevelOutline`, `buildStemOutline`) + fetch tiến độ Lập trình đã có ở `OutlinePane` (S07-2).                                      |
| 3   | Sửa  | `e2e/a11y.spec.ts:82,105`, `e2e/a11y-aaa.spec.ts:37,56`                                          | Thêm `/goc-hoc-tap/on-tap`, `/goc-hoc-tap/physics/on-tap`; `/tien-do` và `/lap-trinh/on-tap` đã trong danh sách.                                                                                                                      |
| 1–3 | Thêm | `e2e/review-hub.spec.ts`, `e2e/mistake-bank.spec.ts`                                             | Seed `localStorage` `srs_<uid>` bằng thẻ `due` quá khứ; chặn `/api/learning/evidence` để test ca lỗi tải.                                                                                                                             |

**Ảnh hưởng lan ra (đo `npm run codemap -- impact`, 2026-09-15 trên `88778f4`):**

- `apps/dhcb/src/lib/srs.ts` → **30 file** (`SRSReview`, `HardWords`, `QuizTab`, `TodayLesson`,
  `StudyPanel`, `CefrLevelPage`, `CefrLessonViews`, `EnglishHome`, `programmingSrs`,
  `ProgrammingReview`, `srsPreloader`, `quizBuilders`, 6 test + gián tiếp `Dictionary`, `Learn`,
  `RoadmapTab`, `ProgrammingLessonPage`…) — thay đổi duy nhất là thêm 1 phần tử mảng
  `NAMESPACE_KHONG_PHAI_TU_VUNG` (dòng 295); golden test + 21 ca `srs.test.ts` canh.
- `apps/dhcb/src/lib/mistakes.ts` → **8 file** (liệt kê trên) — field optional, không đổi chữ ký.
- `apps/dhcb/src/lib/programmingSrs.ts` → **5 file** (`ProgrammingLessonPage:43,188`,
  `ProgrammingReview`, test) — KHÔNG sửa; `stemSrs.ts` là file mới cùng khuôn.
- `apps/dhcb/src/lib/dailyLearningPlan.ts` → **6 file** (`HomeAiBriefingCard`, `Home`, test) —
  KHÔNG sửa; `srsDueCount` Home vẫn từ `getSRSStats(user.id).due` (`Home.tsx:122`). Nếu S06 muốn
  Home hiện tổng hàng đợi xuyên môn thì S06 gọi `buildReviewQueue(...).items.length` — S12 chỉ
  export hàm.
- `packages/core-contracts/stemLesson.ts` → **28 file** — KHÔNG sửa (`srsCards: Array<{hoi;dap}>`
  dòng 33 đã đủ).
- `apps/dhcb/src/pages/core/Dashboard.tsx` → **2 file** — an toàn để thêm section.

## ③ Hợp đồng dữ liệu

### 3.1 Mục ôn dùng chung (`packages/core-contracts/reviewItem.ts`)

```ts
export type ReviewKind = 'vocab' | 'grammar' | 'card' | 'mistake'
// vocab/grammar: thẻ FSRS môn Anh · card: thẻ hỏi-đáp Lập trình/STEM · mistake: mục sổ lỗi

export const REVIEW_EVIDENCE_SOURCES = [
  'english.srs', // kho srs_<uid> namespace từ / grammar:
  'programming.srs', // namespace prog:
  'stem.srs', // namespace stem: (chỉ có sau evidence S11)
  'english.mistakes', // bảng english.mistakes
  'learning.evidence', // câu sai trong CompletionEvidence.items (S11 §3.1) — STEM
] as const

export interface ReviewItem {
  itemId: string // duy nhất trong hàng đợi: `${kind}:${subjectId}:${contentId}[:${index}]`
  subjectId: string // 'english' | 'programming' | 'physics' | ...
  contentId: string // word / grammar lessonId / lessonId / mistake contentId
  courseId?: string // khoá ngắn Lập trình → href PHẢI có ?khoa=
  kind: ReviewKind
  dueAt: number // epoch ms; SRS: card.due; mistake: lastReviewedAt + REVIEW_SPACING_MS hoặc createdAt
  evidenceSource: (typeof REVIEW_EVIDENCE_SOURCES)[number]
  href: string // route nội bộ tới UI ôn hiện có (giữ ?khoa=, ?cap=)
  title: string // chữ để hiện trong hub, không phải nội dung thẻ
  mistakeId?: string // bắt buộc khi kind === 'mistake'
  srsKey?: string // khoá trong kho srs_<uid> khi kind !== 'mistake' (để UI ôn chấm đúng thẻ)
  difficulty?: number // đọc từ SRSCard.difficulty — CHỈ để sắp xếp, không hiển thị
}

export interface ReviewQueue {
  items: readonly ReviewItem[] // đã sắp + cắt cap
  totalDue: number // TRƯỚC khi cắt cap — để hub ghi "còn n mục sau phiên này"
  cap: number
  bySubject: Readonly<Record<string, number>> // đếm totalDue theo môn
  builtAt: number
  sourcesState: Readonly<
    Record<
      'english.srs' | 'programming.srs' | 'stem.srs' | 'english.mistakes' | 'learning.evidence',
      'ready' | 'error' | 'unavailable'
    >
  >
}
export const ReviewItemSchema: z.ZodType<ReviewItem>
export const ReviewQueueSchema: z.ZodType<ReviewQueue>
```

### 3.2 Hàm gộp (thuần, đồng bộ)

```ts
interface ReviewSources {
  uid: string
  englishDueWords: readonly DictEntry[] // getDueWords(uid, pool)  — KHÔNG truyền limit ở đây
  englishDueGrammarIds: readonly string[] // getDueGrammarLessonIds(uid, doneIds)
  programmingDueCards: readonly ProgSrsCardRef[] // getDueProgCards(uid)
  stemDueCards: readonly StemSrsCardRef[] // getDueStemCards(uid)
  englishMistakesDue: readonly Mistake[] // getDueMistakes(uid)
  evidenceMistakesDue: readonly MistakeEntry[] // mistakesFromEvidence(evidence) đã lọc spacing (STEM)
  srsCards: Readonly<Record<string, SRSCard>> // load(uid) — để lấy due/difficulty; chỉ đọc
  sourcesState: ReviewQueue['sourcesState']
  englishLevelId?: CefrLevelId // để dựng href ?tab=srs của trang cấp đang học
}
buildReviewQueue(sources: ReviewSources, opts: { cap?: number; now?: number }): ReviewQueue
docCapTuQuery(search: URLSearchParams, fallback = SRS_SESSION_CAP): number // 1..30, sai → fallback
```

**Luật sắp xếp (một chỗ, có test):** (1) khử trùng theo `subjectId+contentId` — `mistake` thắng
thẻ; cùng loại thẻ thì giữ mục `dueAt` nhỏ hơn; (2) `dueAt` tăng dần; (3) `kind:'mistake'` trước
thẻ khi cùng `dueAt`; (4) `difficulty` giảm dần; (5) cắt `cap`. Không có tỉ lệ theo môn (không
"đảm bảo mỗi môn n mục") — luật mở rộng thẳng từ `getDueBy` hiện có (quá hạn lâu nhất trước, rồi
khó nhất), tránh thêm tham số mới.

**Ghi kết quả** (KHÔNG có hàm mới ghi kho SRS): UI ôn từng môn gọi đúng hàm hiện có theo bảng:

| `kind`    | Hàm ghi hiện có                                                           | Đường lên server hiện có                         |
| --------- | ------------------------------------------------------------------------- | ------------------------------------------------ |
| `vocab`   | `reviewWord(uid, word, rating)` — `srs.ts:228`                            | `pushProgress` → `/api/progress` (`mergeSrsMap`) |
| `grammar` | `reviewGrammar(uid, lessonId, rating)` — `srs.ts:338`                     | như trên                                         |
| `card` LT | `reviewProgCard(uid, key, rating)` — `programmingSrs.ts:48`               | như trên (cùng kho `srs`)                        |
| `card` ST | `reviewStemCard(uid, key, rating)` — `stemSrs.ts` (mới, gọi `reviewWord`) | như trên                                         |
| `mistake` | `markReviewed(uid, id)` — `mistakes.ts:157`; `syncMistakes` khi hết bộ    | `/api/mistakes` POST (upsert `greatest`)         |

### 3.3 Mục sổ lỗi có bằng chứng

```ts
// Anh — mở rộng kiểu hiện có (lib/mistakes.ts:21), field mới đều optional
interface Mistake {
  /* … 10 field cũ giữ nguyên … */ attemptId?: string
  contentId?: string
  subjectId?: 'english'
}
// STEM — đọc từ evidence S11 (`CompletionEvidence.items[]`), KHÔNG lưu riêng
interface MistakeEntry {
  entryId: string // `${subjectId}:${contentId}:${questionIndex}`
  subjectId: 'mathematics' | 'physics' | 'chemistry' | 'biology'
  contentId: string // lessonId
  questionIndex: number // vị trí trong lesson.checkQuestions (S11 StemAnswerSchema)
  attemptId: string // lượt sai GẦN NHẤT — đây là "bằng chứng"
  evidenceKind: 'server_graded' | 'local_graded'
  reason: string // items[i].reason do grader ghi; KHÔNG kéo nội dung câu hỏi vào đây
  count: number // số lượt sai cùng câu
  lastWrongAt: number // Date.parse(serverAt ?? clientAt)
  lastReviewedAt: number | null // S11 không có evidence "đã ôn" → luôn null trong S12; spacing tính từ lastWrongAt
  href: string // URL bài STEM (hàm của stemLessonRoutes.ts) + `#cau-<questionIndex+1>`
}
mistakesFromEvidence(evidence: readonly CompletionEvidence[]): MistakeEntry[]
// Nội dung câu hỏi (để hiện "câu sai") nạp lười bằng loader.loadLesson đúng bài khi mở mục — như hydrateProgCards.
```

Migration `0084` (S12-2): `attempt_id uuid null`, `content_id text null`, `subject_id text not
null default 'english'`; **không** đổi `unique (user_id, dedupe_key)`; server upsert giữ
`attempt_id = coalesce(excluded.attempt_id, english.mistakes.attempt_id)` (evidence mới thắng,
không xoá evidence cũ bằng `null`).

### 3.4 Ca lỗi (là hợp đồng)

| Tình huống                                                                                 | Hành vi mong đợi                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hàng đợi rỗng (mọi nguồn `ready`, 0 mục)                                                   | Hub: `role="status"` "Hôm nay không có gì đến hạn" + link "Học tiếp"; `totalDue = 0`; KHÔNG gợi ý sinh thẻ bằng AI                                                                                          |
| Fetch evidence S11 lỗi (mạng/500)                                                          | `sourcesState['learning.evidence'] = 'error'`; đọc bộ đệm `dhcb_evidence_<uid>` nếu có (nhãn "trên thiết bị này"); hub hiện 4 nguồn còn lại + "Chưa tải được lỗi từ bài STEM · Thử lại"; KHÔNG coi là 0 lỗi |
| Evidence trả về nhưng mục thiếu field / sai schema                                         | Zod `safeParse` từng mục; mục hỏng bị bỏ, đếm vào `skipped` trong log dev; không ném, không trắng trang                                                                                                     |
| Hai nguồn trùng mục (thẻ SRS `stem:physics:ly10-c2-b10:0` + lỗi `contentId:'ly10-c2-b10'`) | Một mục `kind:'mistake'`; test canh `items.length` và `totalDue` đều đếm 1                                                                                                                                  |
| `?cap=0`, `?cap=abc`, `?cap=999`                                                           | `docCapTuQuery` → `SRS_SESSION_CAP` (30); `?cap=5` → 5. Không đổi luật hiện có của `CefrLevelPage`                                                                                                          |
| Thẻ STEM trong kho nhưng bài đã bị đổi/xoá bớt `srsCards`                                  | `hydrateStemCards` bỏ thẻ không còn (như `hydrateProgCards` dòng 73–82); hub đếm theo thẻ hydrate được                                                                                                      |
| `localStorage` bị chặn/quota (private mode, ~12k từ)                                       | `load()` trả từ `memCache` (`srs.ts:132`); hub hiện dữ liệu phiên, nhãn "trên thiết bị này"                                                                                                                 |
| Khách (chưa đăng nhập) mở `/goc-hoc-tap/on-tap`, `/so-tay-loi-sai`, `/tien-do`             | `RequireAccount` như hiện nay → về Login; không tạo hàng đợi cho khách trong S12                                                                                                                            |
| Mục lỗi Anh cũ không `attemptId`                                                           | Hiện "ghi tay · <nguồn>"; nút "Ôn lại" đi tới trang nguồn (`chat`/`writing`/`speaking`) không có neo                                                                                                        |
| Outline S07 dựng lỗi (`undefined` do id lạ) khi tính tiến độ                               | Thẻ môn đó hiện "chưa đo được" + lý do "không dựng được mục lục"; không ném                                                                                                                                 |
| Tiến độ Lập trình `progressState:'error'` (S07 ctx)                                        | Mọi lá `unknown` → `measured:false` → "chưa đo được · Thử lại" (không hiện 0/n như thể đã đo)                                                                                                               |

### 3.5 Tiến độ theo môn (`apps/dhcb/src/lib/progressSummary.ts`)

```ts
interface SubjectProgressSummary {
  subjectId: string
  scopeId: string // levelId / courseId / grade
  scopeTitle: string
  total: number // số lá lesson|activity
  completed: number
  inProgress: number
  unknown: number
  measured: boolean // false khi unknown === total (hoặc total === 0)
  evidenceSources: readonly string[] // tập evidenceSource gặp trong cây — hiện thành nhãn nguồn
}
summarizeOutline(outline: Outline): SubjectProgressSummary
```

Hiển thị: `measured` → "`completed`/`total` · theo <nhãn nguồn>"; không `measured` → "chưa đo
được". Tuyệt đối không có nhánh tính phần trăm từ `unknown`.

## ⑤ Bất biến không được phá

| Bất biến                                                                                           | Test canh                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Công thức FSRS/lịch ôn không đổi (due/stability/difficulty/state/lapses theo chuỗi rating cố định) | `srs.golden.test.ts` (MỚI — viết TRƯỚC PR S12-1, chụp trên `main`), `srs.test.ts` 21 ca, `offlineSrsStore.test.ts`                                                 |
| `getSRSStats` chỉ đếm từ vựng (không `grammar:`/`prog:`/`stem:`)                                   | `srs.test.ts` ca hiện có + ca `stem:`                                                                                                                              |
| `buildReviewQueue`/`summarizeOutline`/`mistakesFromEvidence` thuần: không ghi storage, không fetch | spy `localStorage.setItem`/`fetch` = 0 trong 3 file test                                                                                                           |
| Evidence receipt `srs_review` chỉ do `progress_merge` ghi, chỉ khi `reviewedCardCount > 0`         | `progress.test.ts` 30 ca; grep `daily_plan_completions` = 1 nơi insert; constraint `0075`                                                                          |
| Sổ lỗi Anh: `dedupe_key` + luật `greatest` khi merge không đổi                                     | `mistakes.test.ts` 43 ca, server `mistakes.test.ts` 15 ca — xanh KHÔNG sửa                                                                                         |
| Thẻ STEM/Lập trình chỉ vào vòng ôn khi có evidence hoàn thành (không phải khi mở trang)            | `StemLesson.test.tsx` ca "mở bài không thêm thẻ"; `ProgrammingLessonPage:188` giữ điều kiện `allTestsPassed`                                                       |
| Không hiện placement/band/mastery/số năng lực trong khối tiến độ theo môn                          | `Dashboard.test.tsx` ca grep chữ; luật ngôn ngữ cấm (`docs/research/luong-nguoi-moi-ho-so-nang-luc-an-2026-08-23.md`) — thêm 1 ca vào test bất biến đang có nếu có |
| `/lap-trinh/on-tap` giữ hành vi (2 ca E2E `programming-lesson.spec.ts:540–560`)                    | E2E đó + `programmingSrs.test.ts` 9 ca (ca flaky đã ghi PROGRESS 2026-09-14 — chạy riêng file khi nghi ngờ)                                                        |
| `?cap=` của trang cấp CEFR không đổi                                                               | `e2e/session-cap.spec.ts`                                                                                                                                          |
| Khách không có sổ lỗi/hàng đợi; không thêm tiền tố storage mới ngoài `srs_` namespace `stem:`      | `guestProgress.test.ts`; snapshot storage E2E (khuôn AC-7 spec 02)                                                                                                 |
| a11y AA + AAA 5 theme; mobile lề dưới; ngân sách bundle/coverage 97/93/96/97                       | `a11y.spec.ts`, `a11y-aaa.spec.ts`, `mobile-layout-guards.spec.ts`, `npm run budget`                                                                               |

## ⑥ Quy ước dự án liên quan (bên thi hành không thấy hội thoại)

- Import xuyên gói `@dhcb/<gói>/<file>` không đuôi `.js`; nội bộ gói đường tương đối có `.js`;
  `packages/` không import `apps/`. Hợp đồng ở `core-contracts`; hàm thuần đọc localStorage/data
  app ở `apps/dhcb/src/lib/`.
- Khoá SRS luôn hạ chữ thường TRƯỚC khi đọc/ghi (bẫy ghi một đằng đọc một nẻo, ghi ở
  `programmingSrs.ts:38–41`); namespace mới `stem:` phải vào `NAMESPACE_KHONG_PHAI_TU_VUNG`.
- URL dựng qua MỘT hàm: `duongDanBaiHoc` (S07 AC-7, giữ `?khoa=`), `stemLessonRoutes.ts`; khuôn
  `<mã>--<slug>`; không ghép chuỗi rải rác; bảng `source → href` của sổ lỗi cũng là một chỗ.
- Mọi handler API tự `validateAuth()` + `checkRateLimit` (mẫu `mistakes.ts:98–112`); Zod ở biên;
  không tin client. Migration idempotent, có dòng rollback, chạy được 2 lần.
- Chữ nội dung AAA ≥ 7:1, nút AA; màu từ token `--a-*`/`--z-*`; trạng thái có CHỮ, không chỉ màu;
  `tap-44`; `text-[#fff]` trên nền tối cố định. Trạng thái "chưa đo được" là chữ, không phải "0".
- Responsive quyết bằng `useIsDesktopViewport`, không `lg:hidden` (bất biến `TwoPane`).
- Đổi UI → ảnh 1440/768/390/320 trước/sau (QUY-TRINH-AUDIT Tầng 8b) dán vào PR; a11y AA + AAA.
- Test đỏ trước khi sửa `srs.ts` (30 file), `mistakes.ts` (8 file) — viết golden/regression trước.
- PR: `feat(learning): …` với mô tả dẫn file này + "Approved for implementation"; đủ 6 tiêu đề
  cổng `metadata`; READY; auto-merge (squash) ngay sau tạo; changelog `docs/changelog/0327+`
  (số kế tiếp in bởi `npm run changelog` lúc làm); CI đỏ là việc của PR.
- Cổng trên checkout sạch (`rm -rf packages/*/dist dist dist-server`), `npm ci` trước; cổng test
  CI là `test:coverage`.

## 7. Quyết định cần chủ dự án chốt trước khi Approved

> **CHỐT 2026-09-15 — chủ dự án:** lấy TOÀN BỘ cột "Đề xuất của AI (mặc định)"
> làm quyết định cuối cho mọi câu hỏi trong bảng dưới. Không có ý kiến khác.

| #   | Câu hỏi                                                                                                                                                                                                                              | Đề xuất của AI (mặc định nếu không có ý kiến khác)                                                                                                                                                                    | Lý do                                                                                                                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Sổ lỗi STEM: (a) mở rộng `english.mistakes` thành bảng chung, (b) bảng `learning.mistakes` mới, hay (c) VIEW đọc từ evidence S11 (`items[]`)? Lập trình chưa có câu trả lời từng bước → ghi "chưa có bằng chứng" hay tạo sổ ghi tay? | **(c)** cho STEM; Anh giữ `english.mistakes` + 3 cột evidence nullable; **Lập trình: "chưa có bằng chứng câu sai"**, không sổ ghi tay.                                                                                | Một nguồn sự thật: câu sai đã nằm trong `CompletionEvidence.items` (S11 Q6 chọn nộp theo bài chính vì S12 đọc được từng câu); bảng thứ hai = hai đường ghi phải giữ khớp (bẫy `norm()` client/server ở `mistakes.ts:53`). Sổ ghi tay cho Lập trình = mục không có evidence, trái luật "chỉ từ evidence". |
| Q2  | Hàng đợi ôn gộp tính ở client (hàm thuần từ localStorage + evidence đã fetch) hay thêm endpoint `/api/learning/review-queue`? Đọc `items[]` của các lượt nộp bằng cách nào?                                                          | **Client, hàm thuần.** Không endpoint GHI mới; chỉ thêm tham số ĐỌC `include=attempts` vào `GET /api/learning/evidence` của S11 (trả các dòng nhật ký có `items`, tối đa 200 dòng mới nhất/môn, cùng `validateAuth`). | Kho SRS là localStorage (server chỉ là bản merge `mergeSrsMap`), 3 nguồn/4 đã ở client; endpoint mới sẽ tính due bằng bản server có thể cũ hơn → hai đáp án khác nhau. Sync đúng nghĩa là S09.                                                                                                           |
| Q3  | Cap phiên gộp: một cap chung 30 mục cho mọi nguồn (đề xuất) hay cap riêng từng môn?                                                                                                                                                  | **Một cap chung**, tái dùng `SRS_SESSION_CAP` + `?cap=`; thứ tự = quá hạn lâu nhất trước, lỗi trước thẻ khi cùng hạn.                                                                                                 | Không thêm hằng mới; mở rộng thẳng luật `getDueBy`. Cap riêng từng môn cần tham số mới + UI chọn — chưa có bằng chứng người dùng cần.                                                                                                                                                                    |
| Q4  | Route hub: `/goc-hoc-tap/on-tap` (mới) hay gắn vào `/tien-do` / `/lap-trinh/on-tap`?                                                                                                                                                 | **`/goc-hoc-tap/on-tap`** + mục "Ôn tập" cấp nền tảng trong sidebar; hub chỉ DẪN tới UI ôn từng môn hiện có (không viết lại `SRSReview`, `HardWords`, `MistakeBank`).                                                 | Hợp kiến trúc Góc học tập (0S); `/tien-do` là trang xem, không phải nơi hành động; `/lap-trinh/on-tap` là của một môn. Trả giá: thêm 1 trang + 1 mục nav.                                                                                                                                                |
| Q5  | Thẻ STEM: (a) đếm `srsCards.length` từ bài đã nạp lười (không đụng chỉ mục), hay (b) thêm `srsCardCount` vào chỉ mục STEM như Lập trình (file sinh)?                                                                                 | **(a)** trong S12. Chuyển sang (b) khi đo thấy hub chậm (> 200 ms dựng hàng đợi).                                                                                                                                     | (a) không đụng `gen:stem-lesson-index`/file sinh, không đổi `StemLessonSummary`; thẻ chỉ tồn tại sau evidence nên số bài phải nạp = số bài đã hoàn thành có thẻ đến hạn (nhỏ). (b) là tối ưu khi cần, có đường lên rõ.                                                                                   |
| Q6  | `/tien-do`: thêm khối "Tiến độ theo môn" cạnh các StatCard cũ (đề xuất) hay thay hẳn phần "Từ vựng"/"lộ trình %"?                                                                                                                    | **Thêm, không thay.** StatCard cũ là evidence Anh hợp lệ; khối mới đứng đầu trang, mỗi môn một thẻ, "chưa đo được" là chữ.                                                                                            | Thay = đổi hành vi 787 dòng có E2E (`bottomnav`, `calendar-keyboard`, `route-alias` trỏ `/tien-do`) không có lý do sản phẩm; thêm = rủi ro thấp, ảnh chụp trước/sau là AC-17.                                                                                                                            |

## 8. Rủi ro và giảm thiểu

| Rủi ro                                                                                                                                                                                             | Giảm thiểu                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên field `CompletionEvidence` (`items[].questionIndex/correct/reason`, `evidenceKind`) đổi khi S11 được duyệt                                                                                     | S12-2/S12-3 chỉ bắt đầu sau S11 **Approved + merge**; `evidenceMistakes.ts` import kiểu từ `@dhcb/core-contracts/completionEvidence`, test dùng `CompletionEvidenceSchema.parse` trên fixture, không tự định nghĩa lại |
| Sửa `srs.ts` (30 file ảnh hưởng) lỡ tay đổi hành vi                                                                                                                                                | Golden snapshot viết TRƯỚC trên `main`; diff `srs.ts` trong PR phải đúng 1 dòng (thêm `'stem:'`) — reviewer đối chiếu `git diff --stat`                                                                                |
| Test flaky `programmingSrs.test.ts` ("limit cắt đúng số thẻ", PROGRESS 2026-09-14) đỏ ngẫu nhiên khi chạy cả thư mục                                                                               | `reviewQueue.test.ts`/`stemSrs.test.ts` dùng `vi.useFakeTimers()` + `_resetSrsMemCacheForTests()` (`srs.ts:142`) ở `beforeEach`; nếu ca cũ đỏ trong CI thì sửa ca cũ theo cùng khuôn trong PR S12-1 (ghi changelog)    |
| `learningReadModelService.ts:68` select cột `stats` KHÔNG tồn tại (`schema.sql:150–175`, không migration nào thêm) → `/api/learning-read-model` lỗi runtime, `masterySummary` là số không có nguồn | S12 KHÔNG dùng service này (AC-15); ghi nợ vào `PROGRESS.md` mục nợ kỹ thuật với đường dẫn; tách việc sửa/xoá riêng (không gộp vào S12)                                                                                |
| Sổ lỗi Anh không có tiền tố trong `guestProgress.ts` (`et_mistakes_` — grep = 0) → khách ghi lỗi ở Chat/Writing/Speaking rồi đăng nhập thì lỗi không merge                                         | Ngoài phạm vi S12 (không đổi guest merge); ghi nợ; sổ lỗi hiện `RequireAccount` nên không lộ cho khách                                                                                                                 |
| Hub gọi `getDueWords(uid, pool)` cần từ điển toàn bộ (nạp động) — hub chậm/kéo chunk lớn                                                                                                           | Hub chỉ cần ĐẾM + tiêu đề: dùng `getSRSStats(uid).due` (đã có, không cần pool) cho nhóm Anh; danh sách chi tiết chỉ mở khi bấm vào nhóm (nạp lười như `StudyPanel` gate dòng 43); đo `npm run budget` AC-17            |
| Trùng mục giữa thẻ ngữ pháp và lỗi ngữ pháp làm `totalDue` đếm hai lần → số ở hub lệch số ở tab "Ôn SRS"                                                                                           | Luật khử trùng ở một hàm + test; hub ghi rõ "n mục (đã gộp trùng)"; số tab "Ôn SRS" của cấp vẫn là số riêng của tab đó                                                                                                 |
| Coverage tụt vì 3 trang mới                                                                                                                                                                        | 4 hàm thuần test 100%; `FlashcardReview` ≥ 6 ca; `npm run budget` trước push                                                                                                                                           |

## 9. Kế hoạch thi hành (3 PR, tuần tự; mỗi PR một subagent, agent chính review)

1. **S12-1 `feat(learning): hang doi on xuyen mon + the SRS STEM + hub /goc-hoc-tap/on-tap`** —
   `reviewItem` contract, golden snapshot SRS (commit đầu tiên, chụp trên `main`), `reviewQueue`,
   `stemSrs`, `FlashcardReview` tách, `ReviewHub` + `StemReview`, `docCapTuQuery`, comeback/nav.
   Điều kiện bắt đầu: S07-1 merge (cần `duongDanBaiHoc`), S11-3 merge (cần `reviewSlot` của
   màn kết quả để gọi `addStemLessonCardsToSrs`; nếu S11 chậm, S12-1 vẫn merge được với nhóm STEM
   hiện "chưa có thẻ — cần hoàn thành bài", `stemSrs.ts` chưa có nơi gọi).
2. **S12-2 `feat(learning): so loi co bang chung (migration 0084 + view tu evidence S11)`** —
   migration, server/client `mistakes`, `evidenceMistakes`, `mistakeRoutes`, `?include=attempts`,
   `MistakeBank` lọc môn + "Ôn lại". Điều kiện: S11-1 merge (bảng nhật ký 0082 (S11) + endpoint).
3. **S12-3 `feat(learning): tien do theo mon chi tu evidence tren /tien-do`** — `progressSummary`,
   section Dashboard, E2E, ảnh. Điều kiện: S07-1 merge (3 adapter Outline).
4. Mỗi PR: changelog `docs/changelog/03xx-*.md`, `PROGRESS.md` (bảng slice + nợ mới: cột `stats`,
   `et_mistakes_` guest), goal bảng S12 (Issue/PR/State/Evidence), đổi trạng thái ở spec này.

**Rollback:** revert PR tương ứng. S12-2 có migration: `alter table english.mistakes drop column
if exists attempt_id, drop column if exists content_id, drop column if exists subject_id;` — cột
nullable/default nên revert code trước, drop cột sau đều an toàn. Namespace `stem:` trong kho SRS:
thẻ đã có vẫn nằm trong `srs_<uid>` sau revert nhưng không ai đọc (`getSRSStats` đã loại) — vô
hại; không cần dọn.

## 19. Phê duyệt

- [x] Product outcome và scope (Q1–Q6)
- [x] UX/accessibility (hub rỗng/lỗi, "chưa đo được" là chữ, "Ôn lại" tới đúng bước)
- [x] Architecture (`ReviewItem` contract, hàm thuần, không endpoint mới, SRS chỉ đọc + golden)
- [x] Test/rollout/rollback (3 PR, migration 0084 lũy đẳng)

**Kết luận:** Approved for implementation  
**Người duyệt:** Chủ dự án  
**Ngày:** 2026-09-15
