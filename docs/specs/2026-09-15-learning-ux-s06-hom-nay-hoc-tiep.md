# Học tập liền mạch — slice S06: "Hôm nay" và điểm học tiếp (hợp đồng `TodayPlan`/`ResumePoint` + resolver thuần + bố cục MỘT CTA)

| Thuộc tính    | Giá trị                                                                                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec nền      | [`2026-09-15-learning-ux-foundation.md`](2026-09-15-learning-ux-foundation.md) §④ D ("Hôm nay → mục lục/lộ trình → màn học → trợ giảng → kết quả → tiến độ")                                              |
| Spec cha      | [`2026-09-15-goc-hoc-tap-architecture.md`](2026-09-15-goc-hoc-tap-architecture.md) §"Hướng kiến trúc cho 02–04" (04 rà Home/Onboarding/practice/daily plan/Companion và mọi default `'english'`)          |
| Spec kề       | S07 [`2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md`](2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md) (`Outline`, `prevNext`, `duongDanBaiHoc`) · S08 khung phiên (`LearningSession`, `SessionReadResult`) |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md) dòng S06 — "Hôm nay, điểm học tiếp" (Dependency: S08 + spec)                                                                                          |
| Thứ tự chốt   | S07 → S08 → **S06** → S05 → S10 → S11 → S09 → S12 → S13 (chủ dự án, 2026-09-15)                                                                                                                           |
| Base khảo sát | `main` `7c2d81c` (#928), khảo sát 2026-09-15 bằng đọc mã thật + `npm run codemap -- impact` (số liệu ở §②)                                                                                                |
| Trạng thái    | **In review** — chờ chủ dự án chốt 6 quyết định ở §7                                                                                                                                                      |
| Người duyệt   | Chủ dự án                                                                                                                                                                                                 |

> Không bắt đầu code khi trạng thái chưa là **Approved for implementation**. Luật số 1 của khuôn
> `docs/templates/dac-ta-tinh-nang.md`: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.
>
> Hai luật sản phẩm chi phối toàn bộ spec này:
>
> 1. **"Kết quả chẩn đoán KHÔNG bao giờ là màn hình chính"** (CLAUDE.md §2) — "Hôm nay" là công
>    cụ chọn MỘT việc, không phải bảng điểm. Không con số band/CEFR/điểm placement nào lên thẻ chính.
> 2. **"Platform không mặc định tiếng Anh"** (slice 04 spec cha) — "Hôm nay" phải trả lời đúng khi
>    người học CHƯA chọn môn, học NHIỀU môn, hoặc CHỈ học STEM/Lập trình.

## 0. Một câu

Khi mở app, người học (khách hay tài khoản, học một hay nhiều môn) thấy ĐÚNG MỘT nút "Học tiếp
<tên bài>" dẫn về đúng phiên đang dở (activity/step/nháp) hoặc bài kế tiếp trong mục lục môn
đang học, tối đa 2 thao tác từ "Hôm nay" tới màn học, kèm tối đa hai việc phụ có nguồn bằng
chứng rõ — mà không tự đẩy ai vào lộ trình tiếng Anh và không gọi AI trả phí để tính việc đó.

## ④ Tiêu chí chấp nhận (đo được — mỗi dòng ghi lệnh/bằng chứng)

Chia 3 PR con (§9): **S06-1** hợp đồng + resolver thuần (không UI) · **S06-2** thẻ "Hôm nay" ở
Trang chủ `/` · **S06-3** thẻ "Học tiếp" của trang môn dùng chung resolver + E2E đa môn. AC ghi rõ
thuộc PR nào.

### S06-1 — hợp đồng `TodayPlan`/`ResumePoint` + resolver thuần, không đổi giao diện

- [ ] **AC-1 Một hợp đồng dùng chung.** `packages/core-contracts/todayPlan.ts` export
      `ResumePoint`, `TodayItem`, `TodayPlan`, `TodaySource` đúng §③.1 kèm Zod
      `ResumePointSchema`, `TodayItemSchema`, `TodayPlanSchema`; test `todayPlan.test.ts` canh:
      `primary` (nếu có) luôn có `href` nội bộ (bắt đầu bằng `/`, không `http`), `secondary.length
≤ 2`, mọi mục có `evidenceSource` thuộc bảng §③.3, `subjectId` là id có trong
      `SUPPORTED_SUBJECTS` (`packages/core-learner/subjectRegistry.ts:10`), `kind:'resume'` bắt
      buộc `resume.updatedAt`. — `npx vitest run packages/core-contracts/todayPlan.test.ts`.
- [ ] **AC-2 Resolver thuần, thứ tự ưu tiên cố định.** `packages/core-learner/today/buildTodayPlan.ts`
      export `buildTodayPlan(input: TodayInput): TodayPlan` (đồng bộ, không fetch, không đọc
      storage, không React). Thứ tự chọn `primary`: (1) phiên dở S08 mới nhất → (2) bài kế tiếp
      theo mục lục S07 của môn đang học → (3) SRS đến hạn / kế hoạch ngày → (4) không có gì:
      `kind:'pick'` trỏ `/goc-hoc-tap`. Test bảng 4 ca × 3 tổ hợp môn (chỉ Anh · chỉ Lập trình ·
      chỉ STEM) = 12 ca, cộng ca "2+ môn" (§7 Q1). — `buildTodayPlan.test.ts` ≥ 16 ca.
- [ ] **AC-3 Không mặc định tiếng Anh (bất biến).** `buildTodayPlan({ signals: [], now })` (người
      học chưa có gì — không phiên, không tiến độ, không SRS) trả `primary.kind === 'pick'`, `href ===
'/goc-hoc-tap'`, `subjectId` **undefined**; KHÔNG có mục nào `href` bắt đầu bằng
      `/lo-trinh-hoc`. Test canh bằng `grep -rn "'/lo-trinh-hoc'" packages/core-learner/today/`
      = 0 dòng. — `buildTodayPlan.test.ts` ca "rỗng".
- [ ] **AC-4 Phiên dở thắng mọi thứ và giữ đủ ngữ cảnh.** Có `LearningSession` trạng thái dở
      (theo spec S08) cho bài `p3-u10-l1` mở từ khoá `git` → `primary.kind === 'resume'`,
      `href` mang `?khoa=git` (dựng qua `duongDanBaiHoc` S07 AC-7, KHÔNG tự ghép chuỗi),
      `resume.activityId`/`resume.step` chép nguyên từ phiên, `resume.hasDraft === true` khi phiên
      có nháp, `evidenceSource:'session.resume'`. Cùng phiên nhưng bài ấy đã `completed` trong
      evidence môn → vẫn `resume` (phiên là nguồn sự thật gần nhất; S11 mới đóng phiên). —
      `buildTodayPlan.test.ts`.
- [ ] **AC-5 Bài kế tiếp theo mục lục S07, không theo danh sách phẳng.** Không có phiên dở, có
      `Outline` môn Lập trình (cây khoá `git`) với `activeContentId` là lá cuối đã xong →
      `primary` = `prevNext(outline, id).next` (bỏ `locked`), `href` giữ `?khoa=git`,
      `evidenceSource:'outline.next'`. Lá kế tiếp `locked` → nhảy tới lá `available` đầu tiên sau
      nó; toàn bộ còn lại `locked` → không có mục `next` cho môn đó (không hiện bài khoá làm CTA
      chính). — `buildTodayPlan.test.ts` dùng fixture `Outline` nhỏ (không import registry 3 MB;
      spy `loadLesson` = 0).
- [ ] **AC-6 Tiếng Anh vẫn đúng như hôm nay, qua adapter chứ không qua nhánh riêng.** Với
      fixture `cefr.json` A1 và `learned`/`doneGrammar` như `cefrProgress.test.ts`, adapter
      `englishNext(ctx)` (bọc `findNextStep` ở `apps/dhcb/src/lib/cefrProgress.ts:238`) trả
      `TodayItem` có `href = '/lo-trinh-hoc/a1'`, `title` = đúng nhãn vòng/ngữ pháp mà
      `Home.tsx:104–118` đang dựng (`"${emoji} ${titleVi} (done/total)"` hoặc `g.titleVi`),
      `evidenceSource:'english.vocab' | 'english.cefrGrammar'`. Cấp bị khoá server
      (`computeLockedMapFromServer`) bị bỏ qua y như hiện nay. — `englishNext.test.ts`.
- [ ] **AC-7 Lập trình: ưu tiên bài dở, rồi bài chưa xong, qua adapter.** `programmingNext(ctx)`
      bọc `pickNextLesson` (`apps/dhcb/src/lib/programmingNextLesson.ts:66`): `resuming:true` →
      `TodayItem.kind:'next'` với `hint:'Đang học dở'`; null (xong hết) → không có mục. `href` qua
      `duongDanBaiHoc(lesson, { levelId })` — `grep -n "lap-trinh/bai-hoc/" apps/dhcb/src/pages/subjects/programming/ProgrammingHome.tsx`
      sau S06-3 = 0 dòng (hiện dòng 133 tự ghép). — `programmingNext.test.ts` +
      `programmingNextLesson.test.ts` (đang có) xanh.
- [ ] **AC-8 STEM không bịa tiến độ.** Bốn môn STEM hiện KHÔNG có evidence (S07 §③.3, `grep -rn
"dhcb_stem" apps/dhcb/src/lib` = 0) → adapter `stemNext` chỉ trả mục khi có phiên S08; không
      phiên → **không có mục** (không "bài 1 lớp 10" mặc định). Người chỉ học STEM, chưa có phiên
      → `primary.kind === 'pick'` với `href = '/goc-hoc-tap/<subjectId>'` (môn gần nhất theo §7
      Q1, nếu biết) hoặc `/goc-hoc-tap`. — `buildTodayPlan.test.ts` ca "chỉ STEM".
- [ ] **AC-9 SRS/kế hoạch ngày là mục phụ, giữ nguyên accounting.** `srsDueCount > 0` → mục
      `kind:'review'`, `evidenceSource:'english.srs'`, `href` = `/lo-trinh-hoc/<cấp đang học>?tab=srs`
      CHỈ KHI có `englishNext` (đang học Anh); không học Anh → **không có mục review** (SRS hiện
      chỉ là từ vựng Anh — `getSRSStats(uid)` `apps/dhcb/src/lib/srs.ts:297`). `buildDailyLearningPlan`
      (`dailyLearningPlan.ts:25`) và 4 test của nó **không đổi** — S06 không đổi cách đếm
      `dailyLearned/dailyMax`, không đổi `estimatedMinutes`. — `dailyLearningPlan.test.ts` 4/4
      xanh, `git diff --stat apps/dhcb/src/lib/dailyLearningPlan.ts` = 0.

### S06-2 — thẻ "Hôm nay" ở Trang chủ `/` (thay hai nút kế hoạch trong `HomeAiBriefingCard`)

- [ ] **AC-10 MỘT CTA chính + tối đa 2 mục phụ, ≤ 2 thao tác tới màn học (bất biến goal).**
      Trang chủ có đúng MỘT nút `role="link"`/`<Link>` tên bắt đầu bằng "Học tiếp" (hoặc "Bắt đầu"
      khi `kind:'pick'`); bấm → tới thẳng `href` (thao tác 1); ở màn bài, S08 tự mở đúng
      activity/step (không cần bấm thêm). Mục phụ ≤ 2, mỗi mục là `<Link>` ≥ 44px. — E2E
      `e2e/today-plan.spec.ts` đếm `getByRole('link', { name: /^(Học tiếp|Bắt đầu)/ })` = 1 và
      đếm click từ `/` tới `h1` của bài = 1; `TodayCard.test.tsx` ca "tối đa 2 mục phụ".
- [ ] **AC-11 Mỗi mục nói rõ nguồn bằng CHỮ, không con số chẩn đoán.** Mỗi mục có dòng phụ từ
      `evidenceSource` (bảng §③.3: "Phiên đang dở · 5 phút trước" / "Bài kế tiếp trong khoá Git" /
      "12 thẻ đến hạn"); toàn thẻ KHÔNG chứa chuỗi khớp `/\b(A1|A2|B1|B2|C1|C2)\b.*(điểm|band|%)/`,
      không "Band", không phần trăm thành thạo. Số duy nhất được phép là số đếm việc (thẻ, phút).
      — `TodayCard.test.tsx` ca regex; E2E a11y đọc `textContent`.
- [ ] **AC-12 Bốn trạng thái: tải / sẵn sàng / rỗng / lỗi, không nhảy layout.** (a) Đang tải
      phiên S08 và tiến độ Lập trình → skeleton cùng chiều cao thẻ, `aria-busy="true"`; (b) sẵn
      sàng → CTA; (c) rỗng (`kind:'pick'`) → "Chọn môn để bắt đầu" trỏ `/goc-hoc-tap`, KHÔNG
      trỏ `/onboarding`, KHÔNG trỏ `/lo-trinh-hoc`; (d) lỗi fetch tiến độ → vẫn hiện CTA từ dữ
      liệu cache/local + dòng "Chưa tải được tiến độ · Thử lại" (`role="status"`). CLS trên thẻ
      < 0.1 (Playwright `layout-shift`). — `TodayCard.test.tsx` 4 ca + E2E chặn
      `/api/programming/progress` và endpoint phiên S08.
- [ ] **AC-13 Khách: cùng thẻ, cùng luật, không gọi API private.** Khách (`user.isGuest`) thấy
      thẻ "Hôm nay" dựng từ localStorage (`dhcb_prog_progress_guest_*`, `et_learned_guest_*`, phiên
      S08 local) — **0 request** tới `/api/proactive-briefing`, `/api/intake`, endpoint phiên S08
      server (đếm bằng `page.on('request')`); `GuestBanner` giữ nguyên; hạn mức thử của khách
      (`packages/core-auth/guestTrial.test.ts`) không đổi. — E2E `today-plan.spec.ts` ca khách.
- [ ] **AC-14 Không gọi AI trả phí để tính "Hôm nay".** `buildTodayPlan` và `TodayCard` không
      import `companionApi`, `/api/agent`, `proactiveBriefingApi`; `HomeAiBriefingCard` GIỮ bản
      tin (`fetchProactiveBriefing` — dịch vụ `generateProactiveBriefing` là template, không gọi
      model: `grep -n "aiConfig\|callAI" packages/core-personal/proactiveBriefingService.ts` = 0)
      nhưng **không** còn quyết định việc học. E2E: 0 request tới `/api/agent|/api/companion|/api/stt|/api/tts`
      khi chỉ mở `/` và bấm CTA (khuôn `e2e/home-quick-ask.spec.ts:28` `AI_ENDPOINTS`). —
      `today-plan.spec.ts` ca "0 network AI".
- [ ] **AC-15 Luồng quay lại và tab Hôm nay của CEFR không hỏng.** `e2e/comeback.spec.ts` 7/7,
      `e2e/session-cap.spec.ts` 2/2, `e2e/continue-viewing.spec.ts` 2/2, `e2e/home-quick-ask.spec.ts`
      xanh — banner "Mừng bạn quay lại" và `?tab=today&cap=3` **không đổi hành vi** trong S06 (§7
      Q3). — chạy 4 file E2E trên.
- [ ] **AC-16 Nhìn bằng mắt (Tầng 8b) + a11y.** Ảnh 1440/768/390/320px TRƯỚC/SAU của `/` ở 3 tổ
      hợp dữ liệu (chỉ Anh · chỉ Lập trình có phiên dở khoá Git · rỗng) + khách; tên bài ≥ 80 ký tự
      không tràn (`line-clamp-2`); 5 theme. `e2e/a11y.spec.ts` + `a11y-aaa.spec.ts` đã quét `/` —
      0 vi phạm sau khi đổi; `e2e/mobile-layout-guards.spec.ts` xanh (CTA bấm được, không bị
      bottom nav che). Dán ảnh vào PR.
- [ ] **AC-17 Ngân sách.** `npm run budget` sau `npm run build`: chunk `Home` tăng ≤ 4 kB gzip
      so với `main`; không kéo `@dhcb/subject-programming/lessons` (3 MB) hay registry STEM vào
      chunk Home (kiểm `dist/assets` size, ghi số vào PR). Coverage không tụt dưới 97/93/96/97.

### S06-3 — trang môn dùng chung resolver + E2E đa môn

- [ ] **AC-18 Một logic "học tiếp", ba nơi hiển thị.** `EnglishHome.tsx:88–131` và
      `Home.tsx:104–118` (hai bản chép `continueLevel` giống nhau) đều gọi `englishNext`;
      `ProgrammingHome.tsx:74,133` gọi `programmingNext` + `duongDanBaiHoc`. `grep -rn
"findNextStep(" apps/dhcb/src/pages` chỉ còn khớp trong adapter (hiện 2 trang). E2E
      `e2e/programming-home.spec.ts` 4/4 xanh (ca "đang học dở → về ĐÚNG bài dở" dòng 36 là bất
      biến). — `EnglishHome.test.tsx` (spec 02 tạo) + `programming-home.spec.ts`.
- [ ] **AC-19 Đa môn: chọn theo phiên gần nhất, không xoay vòng ngầm.** Seed phiên S08 môn Anh
      `updatedAt = T` và môn Lập trình `updatedAt = T + 1h` → `primary` là Lập trình; mục phụ đầu
      là "Học tiếp môn Tiếng Anh: <bài>" (`kind:'next'`, môn thứ hai). Đổi thứ tự `updatedAt` →
      đổi `primary`. Không có phiên nào, có evidence hai môn → thứ tự theo §7 Q1. — E2E
      `today-plan.spec.ts` ca "2 môn" + `buildTodayPlan.test.ts`.

**Lệnh chứng minh (mỗi PR con, trên checkout sạch):**

```bash
rm -rf packages/*/dist dist dist-server
npm run typecheck && npm run lint && npm run format && npm run build && npm run test:coverage
npm run budget
npx vitest run packages/core-contracts/todayPlan.test.ts packages/core-learner/today \
  apps/dhcb/src/lib/today apps/dhcb/src/components/Home apps/dhcb/src/lib/dailyLearningPlan.test.ts
npx playwright test e2e/today-plan.spec.ts e2e/comeback.spec.ts e2e/session-cap.spec.ts \
  e2e/continue-viewing.spec.ts e2e/home-quick-ask.spec.ts e2e/programming-home.spec.ts \
  e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts e2e/mobile-layout-guards.spec.ts
grep -rn "'/lo-trinh-hoc'" packages/core-learner/today/ apps/dhcb/src/components/Home/ ; echo "(phải = 0 dòng)"
```

## ① Phạm vi

**LÀM (theo PR con):**

**S06-1 — hợp đồng + resolver (0 thay đổi giao diện, merge độc lập sau S08-1 hợp đồng):**

1. `packages/core-contracts/todayPlan.ts` + Zod + test (§③.1).
2. `packages/core-learner/today/buildTodayPlan.ts` + test: resolver thuần nhận `TodayInput` (đã
   gom sẵn), xếp ưu tiên §③.2, chọn môn theo §7 Q1. Không import registry bài, không import
   `apps/`.
3. Adapter mỗi môn một file, thuần, đồng bộ, KHÔNG fetch, đặt ở `apps/dhcb/src/lib/today/` vì
   cần `data/cefr*` và `lib/cefrProgress` (packages không import apps): `englishNext.ts`,
   `programmingNext.ts`, `stemNext.ts` (+ test). Mỗi adapter trả `TodayItem | null` và **dùng
   lại** hàm đang có (`findNextStep`, `pickNextLesson`, `prevNext` S07) — không viết lại luật.
4. `apps/dhcb/src/lib/today/useTodayPlan.ts`: hook gom dữ liệu (phiên S08 qua
   `SessionReadResult`, `fetchProgress` Lập trình, `getSRSStats`, `getDailyLearned/Max`, CEFR
   loader đã có ở Home) → `buildTodayPlan`; trả `{ plan, state:'loading'|'ready'|'error', retry }`.

**S06-2 — Trang chủ:**

5. `apps/dhcb/src/components/Home/TodayCard.tsx` (+ test): MỘT CTA + ≤ 2 mục phụ + 4 trạng thái.
6. `HomeAiBriefingCard.tsx`: bỏ khối "Kế hoạch hôm nay" (dòng 107–129 `runAction` + lưới
   `plan.map`) và 5 prop `srsDueCount/dailyLearned/dailyMax/continueLessonLabel/continueLevelId/
onContinueClick`; giữ lời chào + bản tin + dòng "Hôm nay đã học x/y từ" (chỉ hiện khi đang học
   Anh — §7 Q5). Analytics `daily_plan_impression/click` chuyển sang `TodayCard` với `refCode =
item.kind + ':' + item.subjectId` (giữ tên event để dashboard cũ không gãy).
7. `Home.tsx`: xoá khối `continueLevel`/`nextLabel`/`goToNextStep` (dòng 104–137), thay bằng
   `useTodayPlan`; `spaces[0].shortcuts` "Lộ trình CEFR" giữ (đó là lối tắt có nhãn môn, không
   phải mặc định ngầm). Khối comeback GIỮ NGUYÊN (Q3).
8. `e2e/today-plan.spec.ts` (mới), ảnh, changelog, `PROGRESS.md`, goal.

**S06-3 — trang môn + đa môn:**

9. `EnglishHome.tsx`, `ProgrammingHome.tsx` gọi adapter; E2E đa môn; xoá bản chép logic.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- KHÔNG làm onboarding theo ý định / thống nhất hub (**S05**); `/bat-dau`, `FirstTaskCard`,
  `intakeApi` giữ nguyên — thẻ `FirstTaskCard` vẫn đứng trên `TodayCard` như hiện nay.
- KHÔNG định nghĩa "hoàn thành" hay tạo evidence mới (**S11**); STEM tiếp tục "chưa đo được";
  không thêm khoá `localStorage`, endpoint, cột DB nào cho tiến độ.
- KHÔNG đồng bộ phiên/tiến độ giữa thiết bị, không version/retry/xung đột (**S09**); S06 chỉ đọc
  `SessionReadResult` mà S08 cung cấp cùng thiết bị.
- KHÔNG đổi accounting của kế hoạch ngày: `buildDailyLearningPlan`, `getDailyLearned/Max`,
  `estimatedMinutes`, `srs_review` là nguồn của mục `review` — không đổi cách đếm, không đổi
  ngưỡng; KHÔNG đổi hạn mức Free/VIP/khách (`guestTrial`, `pro_daily_limit`).
- KHÔNG đổi `markStudiedToday`/streak/`daysSinceLastActivity`/`comeback.ts` (chỉ ghi nhận nợ ở
  §8: streak hiện chỉ đếm hoạt động môn Anh).
- KHÔNG tạo route mới `/hom-nay`; "Hôm nay" sống ở `/` (tab "Trang chủ" của `BottomNav.tsx:30–51`
  — §7 Q4). KHÔNG đổi `navTree.ts` (mục "Bài học hôm nay" `/bai-hoc` dòng 94 là trang khác, giữ).
- KHÔNG sửa `learningReadModelService.ts` / `learnerState.ts` (server, default `subject='english'`,
  đọc `english.learning_progress`) — "Hôm nay" là read-model **client** từ dữ liệu đã có; nối
  server là việc của S09/S12.
- KHÔNG đụng `HomeUniversalAiBar` (440 dòng, S02 vừa chốt), `PricePromoBanner`, `RewardTipBanner`.
- KHÔNG cài thư viện mới.

## ② Điểm chạm (đã khảo sát thật trên `7c2d81c`)

| PR  | Việc | Đường dẫn file                                                                       | Ghi chú khảo sát                                                                                                                                                                                                    |
| --- | ---- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Thêm | `packages/core-contracts/todayPlan.ts` (+ `.test.ts`)                                | Cạnh `learningReadModel.ts`, `subjectManifest.ts`; Zod đã có trong gói (`import { z } from 'zod'`).                                                                                                                 |
| 1   | Thêm | `packages/core-learner/today/buildTodayPlan.ts` (+ test)                             | Gói phẳng, `tsconfig.include: ["**/*.ts"]` nên thư mục con hợp lệ (cùng cách S07 đặt `outline/`). Chỉ import `core-contracts`.                                                                                      |
| 1   | Thêm | `apps/dhcb/src/lib/today/{englishNext,programmingNext,stemNext,useTodayPlan}.ts`     | Import `lib/cefrProgress` (`findNextStep`), `lib/programmingNextLesson` (`pickNextLesson`), `lib/programmingRoutes` (`duongDanBaiHoc` S07), `lib/srs`, `lib/curriculum`, `@dhcb/core-learner/outline` (`prevNext`). |
| 2   | Thêm | `apps/dhcb/src/components/Home/TodayCard.tsx` (+ test)                               | Cạnh `HomeAiBriefingCard.tsx`, `HomeUniversalAiBar.tsx`. Dùng `Link` react-router (app, không phải core-ui).                                                                                                        |
| 2   | Sửa  | `apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx` (+ test 3 ca đang có)         | Bỏ `runAction` (dòng 114–129: `nav('/lo-trinh-hoc?tab=srs')` dòng 120, `nav('/lo-trinh-hoc')` dòng 128 — hai default English) và lưới kế hoạch; 3 test skeleton/pulse/API lỗi phải xanh y nguyên.                   |
| 2   | Sửa  | `apps/dhcb/src/pages/core/Home.tsx` (406 dòng, **không có test unit**)               | Xoá `continueLevel` (104–110), `nextLabel` (125–137), `goToNextStep`; giữ comeback, spaces, rail. `if (!user) return null` dòng 120 chỉ là khoảnh khắc trước khi `AuthProvider` cấp user khách.                     |
| 2   | Thêm | `e2e/today-plan.spec.ts`                                                             | Seed localStorage theo khuôn `e2e/comeback.spec.ts:13–27` (`et_usage_*`, `et_learned_*`) + `dhcb_prog_progress_*` + phiên S08.                                                                                      |
| 2   | Sửa  | `e2e/a11y.spec.ts`, `e2e/a11y-aaa.spec.ts`                                           | `/` đã trong 15 trang quét — chỉ chạy lại, không thêm route.                                                                                                                                                        |
| 3   | Sửa  | `apps/dhcb/src/pages/subjects/english/EnglishHome.tsx` (494 dòng)                    | Dòng 88–131 là bản chép `continueLevel` của Home; thay bằng `englishNext`. Thẻ "Bài học tiếp theo theo lộ trình" (179–193) giữ hình, đổi nguồn.                                                                     |
| 3   | Sửa  | `apps/dhcb/src/pages/subjects/programming/ProgrammingHome.tsx` (340 dòng)            | Dòng 74 `pickNextLesson`, dòng 133 tự ghép `/lap-trinh/bai-hoc/${buildSlugSegment(...)}` → `duongDanBaiHoc`. `AllowGuest` (App.tsx:503).                                                                            |
| 3   | Đọc  | `apps/dhcb/src/lib/programmingNextLesson.ts`, `apps/dhcb/src/lib/cefrProgress.ts`    | KHÔNG đổi chữ ký; chỉ được gọi từ adapter.                                                                                                                                                                          |
| —   | Đọc  | `apps/dhcb/src/lib/comeback.ts`, `apps/dhcb/src/lib/storage.ts`, `dailyLearningPlan` | KHÔNG đổi (bất biến §⑤). `storage.ts` ảnh hưởng **177 file** — lý do cấm chạm.                                                                                                                                      |

**Ảnh hưởng lan ra (đo `npm run codemap -- impact`, 2026-09-15 trên `7c2d81c`):**

- `apps/dhcb/src/pages/core/Home.tsx` → **2 file** (`App.tsx`, `main.tsx`) — lazy route, không ai
  import trực tiếp; **không có test unit** nào canh Home (chỉ E2E `home-quick-ask`, `comeback`).
- `apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx` → **4 file** (Home, test 3 ca, App, main).
- `apps/dhcb/src/lib/dailyLearningPlan.ts` → **6 file** — KHÔNG đổi; nếu S06 đổi kiểu
  `DailyPlanAction` sẽ gãy `HomeAiBriefingCard` + test → lý do giữ nguyên và dựng `TodayItem` riêng.
- `apps/dhcb/src/lib/programmingNextLesson.ts` → **4 file** (ProgrammingHome, test, App, main).
- `apps/dhcb/src/lib/cefrProgress.ts` → **9 file** (Home, EnglishHome, RoadmapTab,
  CefrLessonViews, CefrLevelPage, Learn, test…) — KHÔNG đổi chữ ký.
- `apps/dhcb/src/lib/comeback.ts` → **5 file** (Home, EnglishHome, test…) — KHÔNG đổi.
- `apps/dhcb/src/lib/storage.ts` → **177 file** — TUYỆT ĐỐI không chạm trong S06.
- `packages/core-learner/subjectRegistry.ts` → **5 file** (server `subjects.ts`, `server.ts`,
  routes…) — chỉ đọc `SUPPORTED_SUBJECTS` để validate `subjectId`, không đổi.
- `EnglishHome.tsx`, `ProgrammingHome.tsx` → mỗi trang **2 file** (App, main).

## ③ Hợp đồng

### 3.1 Kiểu dùng chung (`packages/core-contracts/todayPlan.ts`)

```ts
import { z } from 'zod'

/** Nguồn bằng chứng của một mục — chữ hiển thị lấy từ bảng §③.3, không tự bịa. */
export const TodaySourceSchema = z.enum([
  'session.resume', // phiên dở S08 (LearningSession)
  'outline.next', // lá kế tiếp trong Outline S07 (prevNext)
  'programming.progress', // pickNextLesson trên /api/programming/progress hoặc cache khách
  'english.vocab', // vòng từ vựng chưa đủ (findNextStep kind:'vocab')
  'english.cefrGrammar', // bài ngữ pháp chưa xong (findNextStep kind:'grammar')
  'english.srs', // getSRSStats(uid).due > 0
  'none', // kind:'pick' — chưa có bằng chứng nào
])
export type TodaySource = z.infer<typeof TodaySourceSchema>

/** Điểm quay lại — chép từ LearningSession (theo spec S08), KHÔNG tự suy. */
export const ResumePointSchema = z.object({
  sessionId: z.string().min(1),
  subjectId: z.string().min(1),
  courseId: z.string().min(1).optional(), // khoá ngắn Lập trình → href phải có ?khoa=
  contentId: z.string().min(1), // lessonId / circleId / grammarId
  activityId: z.string().min(1).optional(), // theo spec S08
  step: z.number().int().nonnegative().optional(), // theo spec S08
  hasDraft: z.boolean(),
  updatedAt: z.number().int().positive(), // epoch ms — tiêu chí chọn giữa nhiều môn (Q1)
})
export type ResumePoint = z.infer<typeof ResumePointSchema>

export const TodayItemSchema = z.object({
  id: z.string().min(1), // `${kind}:${subjectId ?? '-'}:${contentId ?? '-'}`
  kind: z.enum(['resume', 'next', 'review', 'pick']),
  subjectId: z.string().min(1).optional(), // undefined CHỈ khi kind:'pick' toàn cục
  courseId: z.string().min(1).optional(),
  contentId: z.string().min(1).optional(),
  title: z.string().min(1).max(160), // "Sự rơi tự do" · "Ôn 12 thẻ đến hạn" · "Chọn môn để bắt đầu"
  hint: z.string().max(120).optional(), // "Đang học dở" · "Bài kế tiếp trong khoá Git"
  href: z.string().regex(/^\/(?!\/)/), // route NỘI BỘ; giữ ?khoa= khi có courseId
  evidenceSource: TodaySourceSchema,
  estimatedMinutes: z.number().int().positive().max(60).optional(),
  resume: ResumePointSchema.optional(), // bắt buộc khi kind:'resume' (refine)
})
export type TodayItem = z.infer<typeof TodayItemSchema>

export const TodayPlanSchema = z
  .object({
    primary: TodayItemSchema.nullable(), // null CHỈ khi state:'empty' (không có cả 'pick') — không xảy ra ở resolver, để UI phòng thủ
    secondary: z.array(TodayItemSchema).max(2),
    subjectsSeen: z.array(z.string()), // môn có ít nhất một tín hiệu — để UI đổi chữ ("môn thứ hai")
    builtAt: z.number().int().positive(),
  })
  .refine((p) => !p.primary || p.primary.kind !== 'resume' || !!p.primary.resume)
  .refine((p) => !p.primary || p.primary.kind !== 'pick' || p.primary.evidenceSource === 'none')
export type TodayPlan = z.infer<typeof TodayPlanSchema>
```

**Luật hợp đồng:** (1) `primary` luôn có khi resolver chạy — tệ nhất là `pick`; (2) `secondary`
không bao giờ chứa mục cùng `id` với `primary`; (3) `href` là chỗ DUY NHẤT UI dùng để điều hướng
— UI không tự ghép URL từ `subjectId/contentId`; (4) `title` là tên nội dung, KHÔNG là cấp/điểm.

### 3.2 Resolver thuần (`packages/core-learner/today/buildTodayPlan.ts`)

```ts
export interface SubjectSignal {
  subjectId: string
  /** Phiên dở gần nhất của môn (S08 SessionReadResult → ResumePoint) — undefined nếu không có. */
  resume?: ResumePoint
  /** Bài kế tiếp do adapter môn tính (englishNext/programmingNext/stemNext) — undefined nếu xong hết/không đo được. */
  next?: TodayItem // kind:'next'
  /** Mục ôn tập do adapter cấp (hiện chỉ Anh: SRS) — undefined nếu 0 thẻ. */
  review?: TodayItem // kind:'review'
  /** Mốc hoạt động gần nhất KHÔNG phải phiên (vd completedAt Lập trình) — dùng khi không có phiên (Q1 bậc 2). */
  lastEvidenceAt?: number
}

export interface TodayInput {
  signals: readonly SubjectSignal[] // mỗi môn tối đa một phần tử; thứ tự KHÔNG có ý nghĩa
  now: number // Date.now() truyền vào để test deterministic
}

export function buildTodayPlan(input: TodayInput): TodayPlan
```

**Thứ tự chọn `primary` (cố định, có test bảng):**

1. Có `resume` ở ≥ 1 môn → môn có `resume.updatedAt` lớn nhất; `primary = { kind:'resume', href:
duongDan..., evidenceSource:'session.resume', resume }`. Hoà (cùng ms) → theo Q1 bậc 3.
2. Không có `resume` → môn có `next` và `lastEvidenceAt` lớn nhất (Q1 bậc 2); không môn nào có
   `lastEvidenceAt` → Q1 bậc 3.
3. Không môn nào có `next` → `review` nếu có (Anh: SRS) làm `primary`.
4. Không gì cả → `pick`: `href = '/goc-hoc-tap/<subjectId>'` nếu đúng MỘT môn có tín hiệu bất
   kỳ (vd chỉ có STEM đã mở trang nhưng không phiên — thực tế STEM không có tín hiệu nên rơi về
   toàn cục), còn lại `'/goc-hoc-tap'`; `subjectId` undefined; `evidenceSource:'none'`.

**`secondary` (≤ 2, theo thứ tự):** (a) `next` của môn đang là `primary` nếu `primary` là
`resume` và `next.contentId !== resume.contentId` (bài tiếp sau bài dở — **không** đưa vào khi
trùng); (b) `review` của môn `primary`; (c) `next`/`resume` của môn thứ hai (theo cùng tiêu chí
thời gian) — `hint` = "Môn thứ hai: <tên môn>". Cắt ở 2. `pick` không bao giờ là mục phụ.

**Adapter (`apps/dhcb/src/lib/today/*.ts`, thuần, đồng bộ):**

```ts
englishNext(ctx: { levels: CefrLevel[]; circleById: Record<string, Circle>; learned: Set<string>;
  doneGrammar: Set<string>; lockedMap: Map<string, boolean>; isA: boolean; srsDue: number })
  : Pick<SubjectSignal, 'next' | 'review'>            // bọc findNextStep + getSRSStats; href '/lo-trinh-hoc/<id>'
programmingNext(ctx: { progress: ProgrammingLessonProgress[]; outline?: Outline; activeContentId?: string })
  : Pick<SubjectSignal, 'next' | 'lastEvidenceAt'>   // có outline (S07) → prevNext; không → pickNextLesson; href duongDanBaiHoc
stemNext(ctx: { subjectId: StemSubjectId; resume?: ResumePoint }): Pick<SubjectSignal, 'next'>
  // KHÔNG có evidence → chỉ trả next khi có resume (lá sau bài dở theo outline S07); không thì {}
toResumePoint(session: LearningSession): ResumePoint  // theo spec S08; href dựng qua duongDanBaiHoc/stemLessonRoutes.duongDanBaiHoc/'/lo-trinh-hoc/<id>'
```

`useTodayPlan(uid)` gom: `SessionReadResult` (S08, cùng thiết bị), `fetchProgress(uid)` (khách
đọc cache — `programmingProgress.ts:35`), CEFR loader (đã có ở Home), `getSRSStats(uid)`,
`getLearnedWords/getDoneGrammar` theo `syncVersion` như Home đang làm. Trả `state` để UI vẽ 4
trạng thái; lỗi fetch Lập trình → vẫn gọi `buildTodayPlan` với cache + `state:'error'`.

### 3.3 Nguồn bằng chứng · chữ hiển thị · ca bẫy (bảng adapter)

| `evidenceSource`       | Nguồn thật (đã đọc mã)                                                                                     | Chữ dòng phụ trên thẻ                    | Ca bẫy đã thấy                                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `session.resume`       | `LearningSession` S08 (cùng thiết bị)                                                                      | "Phiên đang dở · <x phút/giờ> trước"     | Phiên của bài đã bị gỡ khỏi registry → `href` không tra được → bỏ phiên, rơi xuống bậc 2 (không trắng thẻ)                                                   |
| `outline.next`         | `prevNext(outline, id)` S07, bỏ `locked`                                                                   | "Bài kế tiếp trong <khoá/bậc/lớp>"       | Lá kế tiếp `locked` (Free P2) → nhảy tới `available` sau; hết → không mục                                                                                    |
| `programming.progress` | `pickNextLesson` — chỉ xương sống P1–P6, **bỏ khoá ngắn** (`lessonsInOrder` `programmingNextLesson.ts:24`) | "Đang học dở" / "Bài chưa học tiếp theo" | `ProgrammingLessonProgress` **không có `updatedAt`** (chỉ `completedAt`, null khi dở) → `lastEvidenceAt = max(completedAt)`; không có → undefined (Q1 bậc 3) |
| `english.vocab`        | `findNextStep` kind `vocab`, `circleDoneCount < words.length`                                              | "<emoji> <vòng> (đã x/y từ)"             | Số x/y là số ĐẾM từ, không phải điểm — được phép (AC-11)                                                                                                     |
| `english.cefrGrammar`  | `findNextStep` kind `grammar`, `!doneGrammar.has(id)`                                                      | "Ngữ pháp · Cấp <A1>"                    | Cấp bị khoá server → bỏ (giữ như `Home.tsx:105`)                                                                                                             |
| `english.srs`          | `getSRSStats(uid).due` (`srs.ts:297`)                                                                      | "<n> thẻ đến hạn"                        | SRS là từ vựng ANH → chỉ hiện khi đang học Anh; `?tab=srs` cần cấp → dùng cấp của `englishNext`                                                              |
| STEM                   | **Không có** — `grep dhcb_stem apps/dhcb/src/lib` = 0; S07 §③.3 `unknown`                                  | —                                        | Không được bịa "Bài 1 lớp 10"; chỉ `resume` (S08) hoặc `pick` về `/goc-hoc-tap/<môn>`                                                                        |
| `none`                 | —                                                                                                          | "Chưa có gì để tiếp tục — chọn một môn"  | KHÔNG trỏ `/onboarding` (`AllowGuest` đã bắt `!onboarded` ở `App.tsx:160`), KHÔNG `/lo-trinh-hoc`                                                            |

### 3.4 Ca lỗi (là hợp đồng)

| Tình huống                                                                    | Hành vi mong đợi                                                                                                                          |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `SessionReadResult` lỗi đọc / schema S08 không parse                          | Coi như không có phiên; `state:'error'` chỉ khi CẢ tiến độ Lập trình cũng lỗi; log `console.warn` một dòng, không throw                   |
| `/api/programming/progress` 401/5xx/timeout                                   | Dùng cache `dhcb_prog_progress_<uid>`; `state:'error'` + "Thử lại"; CTA vẫn hiện nếu có tín hiệu môn khác                                 |
| `subjectId` trong phiên không thuộc `SUPPORTED_SUBJECTS`                      | `TodayPlanSchema` từ chối mục đó ở test; resolver bỏ tín hiệu, không throw                                                                |
| `resume.courseId` là khoá ngắn không còn trong `SHORT_COURSES`                | `href` không `?khoa=` (bậc), `hint` bỏ tên khoá — cùng luật S07 §③.4 "id lạ → cây bậc"                                                    |
| Hai phiên cùng `updatedAt` ở hai môn                                          | Q1 bậc 3 (ổn định, có test); không phụ thuộc thứ tự mảng đầu vào (test đảo mảng ra cùng kết quả)                                          |
| `localStorage` bị chặn (private mode)                                         | Mọi đọc storage đã try/catch trong lib hiện có; `useTodayPlan` nhận `[]` → `pick`; không trắng trang                                      |
| Khách có tiến độ Lập trình local + chưa từng học Anh                          | `primary` Lập trình; KHÔNG mục `review`; 0 request API private (AC-13)                                                                    |
| `cefr.json` chưa tải xong (Home hiện `Promise.all(loadCefr, loadFoundation)`) | `state:'loading'` cho tới khi cả loader lẫn `fetchProgress` xong; skeleton cùng chiều cao (AC-12)                                         |
| Người dùng xong HẾT mọi bài mọi môn                                           | Không `next`; `review` nếu có; không → `pick` với chữ "Bạn đã đi hết nội dung đang có — chọn môn/khoá mới" (không phải chữ rỗng mặc định) |
| Tên bài dài ≥ 80 ký tự / 320px                                                | `line-clamp-2`, `break-words`; CTA vẫn ≥ 44px và bấm được (mobile guards)                                                                 |

## ⑤ Bất biến không được phá

| Bất biến                                                             | Test canh                                                                                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Hôm nay → màn học ≤ 2 thao tác; đúng MỘT CTA chính                   | E2E `today-plan.spec.ts` (đếm link + đếm click); `TodayCard.test.tsx`                                                           |
| Không default English khi thiếu ngữ cảnh (`pick` → `/goc-hoc-tap`)   | `buildTodayPlan.test.ts` ca rỗng; `grep '/lo-trinh-hoc'` trong `core-learner/today/` + `components/Home/` = 0 (lệnh chứng minh) |
| Không con số chẩn đoán trên thẻ chính                                | `TodayCard.test.tsx` regex AC-11; review ảnh Tầng 8b                                                                            |
| Không gọi AI trả phí để tính việc; khách 0 request API private       | E2E AC-13/AC-14 (`page.on('request')`), khuôn `home-quick-ask.spec.ts:28`                                                       |
| Hạn mức khách/Free/VIP không đổi                                     | `packages/core-auth/guestTrial.test.ts`, không diff ở `packages/core-billing/`                                                  |
| Kế hoạch ngày accounting không đổi                                   | `dailyLearningPlan.test.ts` 4/4, `git diff --stat` file = 0                                                                     |
| Luồng comeback, `?tab=today&cap=3`, streak không đổi                 | `e2e/comeback.spec.ts` 7 ca, `e2e/session-cap.spec.ts` 2 ca, `comeback.test.ts`                                                 |
| "Đang học dở → về ĐÚNG bài dở" của Lập trình                         | `e2e/programming-home.spec.ts:36`, `programmingNextLesson.test.ts`                                                              |
| Không tải nội dung bài / registry 3 MB vào chunk Home                | spy `loadLesson` = 0 trong adapter test; `npm run budget` AC-17                                                                 |
| `HomeAiBriefingCard` 3 ca skeleton/pulse/API lỗi giữ nguyên          | `HomeAiBriefingCard.test.tsx`                                                                                                   |
| `storage.ts` (177 file), `cefrProgress.ts` (9 file) chữ ký không đổi | `cefrProgress.test.ts`, toàn bộ `npm run test:coverage`; `git diff --stat` hai file = 0                                         |
| Mobile: CTA không bị bottom nav che; a11y AA + AAA 5 theme           | `e2e/mobile-layout-guards.spec.ts`, `e2e/a11y.spec.ts`, `e2e/a11y-aaa.spec.ts`                                                  |

## ⑥ Quy ước dự án liên quan (bên thi hành không thấy hội thoại)

- Import xuyên gói `@dhcb/<gói>/<file>` không đuôi `.js`; nội bộ gói đường tương đối có `.js`;
  `packages/` không import `apps/` (lint chặn) — vì thế adapter cần `data/cefr*` nằm ở
  `apps/dhcb/src/lib/today/`, resolver thuần nằm ở `packages/core-learner/today/`.
- URL dựng qua MỘT hàm: `duongDanBaiHoc` (S07 AC-7, `programmingRoutes.ts`),
  `stemLessonRoutes.duongDanBaiHoc(subjectId, lessonId, title)` (đã có, dòng 62), cấp CEFR
  `/lo-trinh-hoc/<id thường>`. UI chỉ dùng `TodayItem.href`.
- Chữ nội dung AAA (≥ 7:1), nút/nhãn AA; màu từ token `--a-*`/`--z-*`; trạng thái phải có CHỮ;
  vùng chạm ≥ 44px (`tap-44`); `text-[#fff]` trên nền cố định tối. Skeleton là chỗ DUY NHẤT được
  `animate-pulse` (luật đang canh ở `HomeAiBriefingCard.test.tsx:65`).
- Responsive quyết định bằng JS (`useIsDesktopViewport`), không `lg:hidden` — Home đã theo khuôn
  `TwoPane`; `TodayCard` render MỘT lần trong DOM.
- Khách = `User` ảo `guest_<uuid>` (`AuthProvider.tsx:20`), mọi lib tiến độ dùng `uid` như thường;
  `programmingProgress.fetchProgress` tự đọc cache cho khách — không thêm nhánh `isGuest` trong UI.
- Analytics: giữ tên event `daily_plan_impression`/`daily_plan_click` (`lib/analytics.track`),
  `utmSource` đổi `'p1.1'` → `'s06'` để tách số liệu.
- Đổi UI → ảnh 1440/768/390/320 trước/sau (QUY-TRINH-AUDIT Tầng 8b) dán vào PR.
- PR: `feat(learning): …`, mô tả dẫn file này + "Approved for implementation"; đủ 6 tiêu đề cổng
  `metadata`; READY; bật auto-merge (squash) ngay sau tạo; CI đỏ là việc của PR.
- Cổng trên checkout sạch (`rm -rf packages/*/dist dist dist-server`), `npm ci` trước lần chạy
  đầu; cổng test CI là `test:coverage`.

## 7. Quyết định cần chủ dự án chốt trước khi Approved

| #   | Câu hỏi                                                                                                                                                         | Đề xuất của AI (mặc định nếu không có ý kiến khác)                                                                                                                                                                                                                             | Lý do                                                                                                                                                                                                                                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Người học 2+ môn: chọn `primary` theo gì? Có "xoay vòng theo ngày" không?                                                                                       | **Ba bậc, KHÔNG xoay vòng:** (1) phiên S08 `updatedAt` mới nhất → (2) evidence môn mới nhất (`lastEvidenceAt`) → (3) hoà/không có mốc thời gian: thứ tự ổn định `programming → mathematics → physics → chemistry → biology → english` (Anh cuối để không thành mặc định ngầm). | Xoay vòng theo ngày làm CTA đổi khi người học chưa làm gì → mất "quay lại đúng chỗ" (goal metric). Bậc 3 hiếm (chỉ khi không có thời gian nào) nên thứ tự cố định đủ dùng; môn thứ hai luôn có mặt ở mục phụ nên không "mất" môn. Phương án thay thế: cho chọn "Môn ưu tiên" ở Profile (S05). |
| Q2  | STEM chưa có evidence: "Hôm nay" có được gợi "Bài 1" mặc định khi người học chỉ mới xem danh sách bài không?                                                    | **Không.** Chỉ `resume` (S08) hoặc `pick` → `/goc-hoc-tap/<môn>`.                                                                                                                                                                                                              | "Đã mở trang" không phải evidence (spec nền, S07 Q5); gợi bài 1 mãi khi người ta đang học bài 7 là sai và không đo được. S11 định nghĩa hoàn thành rồi S12 nối lại.                                                                                                                           |
| Q3  | Luồng comeback + streak (`markStudiedToday` chỉ gọi ở `TodayLesson.tsx`, `CefrLessonViews.tsx` — môn Anh) có mở rộng đa môn trong S06 không?                    | **Không, ghi nợ.** Giữ banner comeback y nguyên (chỉ hiện khi có tín hiệu Anh như hôm nay).                                                                                                                                                                                    | `storage.ts` ảnh hưởng 177 file; streak đa môn cần định nghĩa "hoạt động" theo evidence (S11). Làm trong S06 là phình phạm vi.                                                                                                                                                                |
| Q4  | "Hôm nay" đặt ở `/` (tab "Trang chủ") hay route riêng `/hom-nay` + đổi nhãn tab?                                                                                | **Ở `/`, không route mới, không đổi nhãn tab.**                                                                                                                                                                                                                                | `BottomNav.tsx:30–51` tab 1 đã là `/`; thêm route = thêm một màn giữa người học và bài (vi phạm ≤ 2 thao tác). Đổi nhãn "Trang chủ" → "Hôm nay" là quyết định S05 (thống nhất hub).                                                                                                           |
| Q5  | `HomeAiBriefingCard`: giữ lời chào + bản tin (fetch `/api/proactive-briefing`, template không AI) và dòng "Hôm nay đã học x/y từ", hay gộp hết vào `TodayCard`? | **Giữ thẻ chào + bản tin, bỏ phần kế hoạch; dòng x/y từ chỉ hiện khi `subjectsSeen` có `english`.**                                                                                                                                                                            | Bản tin là giọng Companion (tư thế đồng hành), không quyết định việc học; dòng "x/y từ" là accounting Anh, hiện với người chỉ học Lập trình là default English ngầm.                                                                                                                          |
| Q6  | Số mục phụ tối đa N = 2?                                                                                                                                        | **N = 2** (bài tiếp sau phiên dở · ôn SRS · môn thứ hai — cắt ở 2).                                                                                                                                                                                                            | Kế hoạch ngày hiện tại đã là 2 và người dùng quen; 3+ làm thẻ thành danh sách, CTA chính mất trọng tâm ở 390px (ảnh Tầng 8b sẽ chứng minh).                                                                                                                                                   |

## 8. Rủi ro và giảm thiểu

| Rủi ro                                                                                              | Giảm thiểu                                                                                                                                     |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| S08 chưa merge / hợp đồng `LearningSession` đổi tên trường                                          | S06-1 chỉ phụ thuộc `toResumePoint(session)` — một hàm chuyển đổi, test bằng fixture; S06-1 có thể merge với `signals[].resume` luôn undefined |
| S07-1 chưa merge → không có `prevNext`/`duongDanBaiHoc`                                             | `programmingNext` có nhánh fallback `pickNextLesson` (đã có); AC-5 chỉ nghiệm thu khi S07-1 đã vào `main` (thứ tự chốt S07 → S08 → S06)        |
| `ProgrammingLessonProgress` không có `updatedAt` → bài dở không có mốc thời gian → hoà với môn khác | Q1 bậc 2 dùng `max(completedAt)`; bài dở không mốc → bậc 3 ổn định; ghi nợ: S08 phiên sẽ là mốc thật                                           |
| Home không có test unit → đổi 30 dòng logic mà chỉ E2E canh                                         | S06-2 thêm `TodayCard.test.tsx` (≥ 6 ca) và `useTodayPlan.test.ts`; Home vẫn chỉ lắp ráp                                                       |
| Khách bị gọi `/api/proactive-briefing` (401) và `/api/intake` — tồn tại từ trước                    | Ngoài phạm vi S06 (không phải AI, không tốn tiền); ghi nợ; AC-13 chỉ canh KHÔNG THÊM request mới                                               |
| Người dùng cũ quen "Ưu tiên 1 / Tiếp theo" thấy thẻ đổi                                             | Giữ vị trí thẻ, giữ icon `Play/Brain`, dòng phụ nói nguồn; analytics cùng tên event để so trước/sau                                            |
| `daysSinceLastActivity` đọc tới 61 khoá localStorage, Home gọi 2 lần (`comeback.ts:40,47`)          | Không đổi trong S06 (Q3); ghi nợ hiệu năng nhỏ                                                                                                 |
| Coverage tụt vì nhiều nhánh trạng thái UI                                                           | Resolver + adapter thuần test 100%; `npm run budget` trước push                                                                                |

## 9. Kế hoạch thi hành (3 PR, tuần tự; mỗi PR một subagent, agent chính review)

1. **S06-1 `feat(learning): hop dong TodayPlan/ResumePoint + resolver hom nay`** — contracts +
   `buildTodayPlan` + 3 adapter + `useTodayPlan`. 0 UI. Cần S07-1 (`prevNext`, `duongDanBaiHoc`)
   và S08 hợp đồng đã merge; nếu S08 trễ, `toResumePoint` nhận fixture và `resume` luôn undefined.
2. **S06-2 `feat(learning): the Hom nay mot CTA hoc tiep o Trang chu`** — `TodayCard`, sửa
   `HomeAiBriefingCard` + `Home`, E2E `today-plan.spec.ts`, ảnh 4 bề rộng × 3 dữ liệu, a11y.
3. **S06-3 `refactor(learning): trang mon dung chung resolver hoc tiep`** — `EnglishHome`,
   `ProgrammingHome`, xoá bản chép, E2E đa môn (AC-18/19).
4. Mỗi PR: changelog `docs/changelog/03xx-*.md` (`npm run changelog` in số kế tiếp — hiện sau
   `0325`), `PROGRESS.md` chỉ khi trạng thái đổi, goal bảng S06 (Issue/PR/State/Evidence), đổi
   trạng thái ở spec này.

**Rollback:** revert PR tương ứng; không migration/schema/khoá storage mới (S06 chỉ ĐỌC khoá đã
có: `dhcb_prog_progress_*`, `et_learned_*`, `et_cefr_grammar_*`, `et_srs_*`, phiên S08); revert
S06-2 trả lại `HomeAiBriefingCard` bản cũ mà không mất dữ liệu người dùng.

## 19. Phê duyệt

- [ ] Product outcome và scope (Q1–Q6)
- [ ] UX/accessibility (MỘT CTA, 4 trạng thái, không con số chẩn đoán, ≤ 2 thao tác)
- [ ] Architecture (hợp đồng `TodayPlan`/`ResumePoint`, resolver thuần trong `core-learner`,
      adapter trong app, `href` là nguồn điều hướng duy nhất)
- [ ] Test/rollout/rollback (3 PR)

**Kết luận:** In review  
**Người duyệt:** —  
**Ngày:** —
