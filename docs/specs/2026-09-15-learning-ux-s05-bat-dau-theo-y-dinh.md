# Học tập liền mạch — slice S05: Bắt đầu theo ý định, thống nhất hub (hợp đồng `LearnerIntent` + luồng `/bat-dau` + một nguồn danh mục môn cho hub và app)

| Thuộc tính    | Giá trị                                                                                                                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Spec cha      | [`2026-09-15-goc-hoc-tap-architecture.md`](2026-09-15-goc-hoc-tap-architecture.md) §"Hướng kiến trúc cho 02–04" (gạch 04: "rà Home, Onboarding/Intake … Chưa chọn môn không bị vào onboarding tiếng Anh")                |
| Spec nền      | [`2026-09-15-learning-ux-foundation.md`](2026-09-15-learning-ux-foundation.md) §④ D (Hôm nay → mục lục → màn học)                                                                                                        |
| Spec anh em   | [`S07 mục lục`](2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md) (S05 DÙNG LẠI `Outline` + adapter S07-1 để chọn "một việc"); S06 Hôm nay/học tiếp (`2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md`, đang viết song song) |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md) dòng S05 (dependency: S06 + spec). Thứ tự chốt: S07 → S08 → S06 → **S05** → S10 → S11 → S09 → S12 → S13                                                              |
| Base khảo sát | `main` `7c2d81c` (#928), khảo sát 2026-09-15 bằng grep/sed/codemap trên mã thật (Intake · Onboarding · hub · guestProgress · registry), số liệu đếm thật                                                                 |
| Trạng thái    | **In review** — chờ chủ dự án chốt 6 quyết định ở §7                                                                                                                                                                     |
| Người duyệt   | Chủ dự án                                                                                                                                                                                                                |

> Không bắt đầu code khi trạng thái chưa là **Approved for implementation**. Luật số 1 của khuôn
> `docs/templates/dac-ta-tinh-nang.md`: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.
>
> **Hai luật sản phẩm chi phối toàn bộ spec này** (CLAUDE.md §2):
> (1) _"Kết quả chẩn đoán KHÔNG bao giờ là màn hình chính"_ — người mới nhận ĐÚNG MỘT việc để
> làm, không nhận bảng đánh giá về mình; (2) _"Chưa chọn môn không bị vào onboarding tiếng Anh"_
> — nền tảng không mặc định tiếng Anh.
>
> **Cảnh báo tài liệu:** CLAUDE.md §2 dòng 73 dẫn
> `docs/research/luong-nguoi-moi-ho-so-nang-luc-an-2026-08-23.md` nhưng file này **KHÔNG tồn tại**
> trong repo và **chưa từng có trong `git log --all`** (kiểm 2026-09-15). Nội dung "5 câu ~90 giây
> → hồ sơ ẩn → gợi ý một việc + luật ngôn ngữ + test bất biến" được tái dựng từ **mã đã thi hành**
> (`packages/core-contracts/intake.ts`, `packages/core-personal/intakeSuggestion.ts` 9 mẫu cấm,
> `intakeSuggestion.test.ts` quét 1.575 tổ hợp, `e2e/a11y-intake.spec.ts:82-97`) và changelog
> `0094`/`0095`/`0293`. Spec này tuân thủ đúng các luật đó; việc khôi phục file research là nợ tài
> liệu ghi ở §8, **không** thuộc S05.

## 0. Một câu

Cho người mới (khách hoặc tài khoản chưa có ý định) nói trong ≤ 5 câu mình muốn học môn gì · để làm
gì · mỗi ngày bao lâu · đã quen chưa, rồi nhận ĐÚNG MỘT nút "Bắt đầu: <bài/hoạt động>" dẫn thẳng
vào màn học đúng ngữ cảnh (cây S07), bỏ qua được ở mọi bước, không thấy điểm/bậc, không bị mặc
định tiếng Anh — và hub (domain gốc) với Home app cùng lấy danh mục môn/CTA từ MỘT nguồn.

## ④ Tiêu chí chấp nhận (đo được — mỗi dòng ghi lệnh/bằng chứng)

Chia 2 PR (§9): **S05-1** hợp đồng + luồng `/bat-dau` trong app (client + server + guest) ·
**S05-2** thống nhất danh mục môn giữa hub và app. AC ghi rõ thuộc PR nào.

### S05-1 — hợp đồng `LearnerIntent`, gợi ý một việc, luồng `/bat-dau`

- [ ] **AC-1 Hợp đồng versioned, strict.** `packages/core-contracts/learnerIntent.ts` export
      `LearnerIntentSchema` (dùng `versionedObject` của `version.ts`, `schemaVersion: 1`) và
      `LearnerIntent` đúng §③.1: `subjectIds` là mảng id có trong `SUPPORTED_SUBJECTS`, KHÔNG rỗng
      khi có, giữ THỨ TỰ người dùng chọn, không trùng; `purpose` · `timeBudget` · `level` · `grade`
      là enum đóng; trường lạ → Zod từ chối (`.strict()`). — `npx vitest run
packages/core-contracts/learnerIntent.test.ts` (≥ 8 ca: hợp lệ tối thiểu, rỗng subjectIds
      bị từ chối, id lạ, trùng id, `schemaVersion` sai, trường lạ, `grade` không đi cùng môn STEM
      → từ chối, `createdAt` không phải số → từ chối).
- [ ] **AC-2 Đúng MỘT việc, tất định, không AI.** `apps/dhcb/src/lib/intent/pickStartAction.ts`
      export hàm THUẦN `pickStartAction(intent, ctx): StartActionResult` trả `primary` + ≤ 2
      `alternatives`; `href` LUÔN là route nội bộ bắt đầu bằng `/` (không `http`, không `//`);
      cùng đầu vào → cùng kết quả; module KHÔNG import `aiConfig`/`fetch`/`agentApi` (`grep` = 0).
      Việc chính = lá đầu tiên `availability:'available'` và `progress !== 'completed'` trong cây
      S07 của môn ĐẦU TIÊN trong `subjectIds` (§③.3). — `pickStartAction.test.ts` quét **toàn bộ
      tổ hợp đơn môn** 6 môn × 4 `purpose` × 4 `timeBudget` × 3 `level` × 4 `grade` (kể cả
      không) = **1.152 tổ hợp** + ≥ 6 ca đa môn: mọi ca có `primary`, `alternatives.length ≤ 2`,
      id khác nhau, không ca nào ném.
- [ ] **AC-3 Bảy test bất biến ngôn ngữ (T1–T7, §③.5) chặn CI.** `pickStartAction.test.ts` gọi
      `findForbiddenLanguage` (`@dhcb/core-personal/intakeSuggestion`, đã có) + 3 mẫu MỚI của S05
      trên `collectVisibleTexts(result)` của **mọi** tổ hợp AC-2: 0 hit. E2E
      `e2e/start-by-intent.spec.ts` ca "màn gợi ý không hiện điểm số, thang bậc, hồ sơ": lấy
      `body.innerText`, không khớp bất kỳ mẫu nào ở §③.5. — `npx vitest run
apps/dhcb/src/lib/intent && npx playwright test e2e/start-by-intent.spec.ts`.
- [ ] **AC-4 `/bat-dau` công khai, ≤ 5 màn, bỏ qua được từng câu, bỏ hết vẫn có một việc.** Khách
      (không token) và tài khoản đều mở được; đúng 5 bước tối đa (môn → mục đích → thời gian →
      quen chưa → lớp, bước "lớp" **chỉ hiện** khi có môn STEM trong lựa chọn); mỗi bước có nút
      "Bỏ qua" ≥ 44px; **bỏ hết** → màn gợi ý vẫn có ĐÚNG MỘT nút "Bắt đầu" với `href =
'/goc-hoc-tap'` (danh mục môn), **không phải** `/hoc-tieng-anh`, `/goc-hoc-tap/english` hay
      `/lo-trinh-hoc/a1`. Chấm chỉ vị trí (`aria-label="Bước x trên y"`), KHÔNG "câu 3/10", KHÔNG
      thanh điểm. — E2E `start-by-intent.spec.ts` ca "khách bỏ hết 5 câu" + unit
      `StartByIntent.test.tsx`.
- [ ] **AC-5 Không mặc định tiếng Anh.** Mở `/bat-dau` → bước chọn môn KHÔNG có ô nào
      `aria-pressed="true"`; `isDefault: true` của `english` trong `subjectRegistry.ts:24` **không
      được đọc** ở bất kỳ file nào dưới `apps/dhcb/src/lib/intent/` và `pages/core/StartByIntent*`
      (`grep -rn isDefault apps/dhcb/src/lib/intent apps/dhcb/src/pages/core/StartByIntent*` = 0).
      `?mon=<id>` chỉ tiền điền khi `id ∈ SUPPORTED_SUBJECTS` (`?mon=english-abc`, `?mon=` → bỏ
      qua, không lỗi console). — unit + E2E ca `?mon=programming` (ô Lập trình
      `aria-pressed="true"`, các ô khác `false`).
- [ ] **AC-6 Chọn nhiều môn được, gợi ý vẫn một việc.** Chọn Lập trình rồi Toán → `primary` là bài
      Lập trình (môn chọn TRƯỚC), `alternatives[0]` là bài Toán; đổi thứ tự chọn → đổi
      `primary`. Chọn 1 môn → `alternatives` rỗng hoặc ≤ 2 (không bịa thêm môn chưa chọn). —
      `pickStartAction.test.ts` + E2E.
- [ ] **AC-7 Tài khoản: endpoint `/api/learner-intent` an toàn.** GET/PUT (§③.2): không token →
      401; body lạ/`subjectIds` id lạ → 400 có thông điệp tiếng Việt; > 30 yêu cầu/phút cùng IP
      → 429 (`checkRateLimit(ip, 30, 'learner-intent')`); PUT 2 lần → **một** dòng trong
      `personal.learner_intent` (upsert theo `user_id`), `updated_at` đổi; GET trả đúng bản vừa
      PUT; method khác → 405; **không bao giờ** trả trường ngoài §③.1 (không `score`, không
      `rank`). Migration `0081` idempotent (chạy 2 lần không lỗi), CHECK chặn giá trị lạ. —
      `apps/server/src/api/personal/learner-intent.test.ts` (mock pool như
      `intakeService.test.ts`) + boot check CI hiện có (`/api/health`).
- [ ] **AC-8 Khách: lưu local theo `guestId`, hợp nhất khi đăng nhập, không mất dữ liệu.** Khoá
      `dhcb_intent_<guestId>` (§③.4); tiền tố được ĐĂNG KÝ trong `ALL_PREFIXES` của
      `guestProgress.ts` (hiện 11 tiền tố + `et_usage_` xử lý riêng — đếm ở dòng 50-60);
      `mergeGuestProgressInto(realUid)`: tài khoản **chưa có** ý định trên server → PUT bản của
      khách; tài khoản **đã có** → giữ bản server, bỏ bản khách; sau hợp nhất khoá khách bị xoá;
      gọi lần hai là no-op. `hasGuestProgress()` = `true` khi khách chỉ mới có ý định (quyết
      §7 Q4). — `guestProgress.test.ts` +4 ca; E2E "khách trả lời → đăng nhập mock → GET
      `/api/learner-intent` nhận đúng `subjectIds`".
- [ ] **AC-9 Một bấm là vào màn học, giữ ngữ cảnh S07.** Ở màn gợi ý, bấm "Bắt đầu" → điều hướng
      tới `primary.href` (bài Lập trình `duongDanBaiHoc(lesson, {levelId})`, bài STEM
      `duongDanBaiHoc(subjectId, lessonId, title)` của `stemLessonRoutes.ts`, hoạt động Tiếng
      Anh `/lo-trinh-hoc/a1` unit 1), `document.activeElement === h1` của trang học (S07 đã cho
      `h1 tabIndex={-1}`); Back → về màn gợi ý, KHÔNG hỏi lại 5 câu. — E2E đếm đúng 1 click từ
      màn gợi ý; unit test href cho 3 môn.
- [ ] **AC-10 Đã có ý định thì không hỏi lại, không loop.** Người có ý định (server hoặc local)
      mở `/bat-dau` → hiện thẳng màn gợi ý (tính lại từ ý định đã lưu + tiến độ hiện tại, nên
      "việc" có thể đã tiến lên bài kế) + nút phụ "Đổi ý định" mở lại 5 câu (giá trị cũ điền
      sẵn); reload 3 lần vẫn 1 lần fetch GET; không `Navigate` vòng. — unit + E2E chặn
      `/api/learner-intent` trả bản có sẵn.
- [ ] **AC-11 Không gọi AI trả phí, không gọi API riêng của tài khoản khi là khách.** Suốt luồng
      (5 câu + gợi ý + bấm Bắt đầu): 0 request tới `/api/agent`, `/api/companion*`, `/api/stt`,
      `/api/tts`, `/api/intake`; khách 0 request tới `/api/learner-intent` (chỉ localStorage).
      — E2E `page.on('request')` đếm; unit kiểm module không import.
- [ ] **AC-12 Không đụng cổng đăng nhập cũ.** `git diff --stat apps/dhcb/src/App.tsx` chỉ đổi
      dòng route `/bat-dau` (+ 1 route giữ Intake cũ, §7 Q1); hàm `RequireAccount`/`AllowGuest`
      **không đổi một ký tự**; `/onboarding` E2E hiện có xanh; `Login.tsx` không đổi. —
      `git diff main -- apps/dhcb/src/App.tsx` đọc tay + `e2e/a11y.spec.ts`.
- [ ] **AC-13 Nhìn bằng mắt (Tầng 8b) + a11y AA/AAA 5 theme.** Ảnh 1440/768/390/320px của: bước
      chọn môn (6 ô), bước thời gian, màn gợi ý (tên bài dài ≥ 80 ký tự không tràn), màn "Đổi ý
      định"; `e2e/a11y-intent.spec.ts` (khuôn `a11y-intake.spec.ts`) quét 3 màn × 5 theme AA +
      AAA cho chữ nội dung: 0 vi phạm; `mobile-layout-guards.spec.ts` thêm `/bat-dau` (CTA "Bắt
      đầu" bấm được ở 390/320, không bị bottom nav che — `/bat-dau` KHÔNG nằm trong
      `NAV_HIDDEN_PATHS`, cần kiểm lề dưới).
- [ ] **AC-14 Ngân sách + coverage.** `npm run build && npm run budget`: chunk `/bat-dau` ≤ 12 kB
      gzip (dán số); `npm run test:coverage` giữ ngưỡng 97/93/96/97; `lib/intent/*` thuần test
      100% dòng.

### S05-2 — thống nhất danh mục môn giữa hub (`apps/hub`) và app

- [ ] **AC-15 Một nguồn danh mục.** `packages/core-learner/subjectEntry.ts` export
      `SUBJECT_ENTRIES: readonly SubjectEntry[]` (§③.6) suy từ `SUPPORTED_SUBJECTS` (cùng THỨ TỰ:
      english · programming · mathematics · physics · chemistry · biology; `label` = `manifest.label`
      nguyên văn) + `ctaPath` + `status`. Test: id/thứ tự/label khớp registry 1-1; mọi `ctaPath`
      là route có thật (đối chiếu danh sách path của `App.tsx` như `navTree.test.ts` đang làm).
      — `subjectEntry.test.ts`.
- [ ] **AC-16 Hub không import gói nhưng vẫn cùng nguồn.** `scripts/gen-subject-catalog.ts` sinh
      `apps/hub/src/subjectsCatalog.generated.ts` (chỉ dữ liệu thuần: `id`, `name`, `order`,
      `ctaPath`, `status`, không React/không icon) từ `SUBJECT_ENTRIES`; `npm run
gen:subject-catalog`; test tươi `scripts/gen-subject-catalog.test.ts` đỏ với đúng câu nhắc
      "chạy `npm run gen:subject-catalog`" khi file sinh lệch nguồn (khuôn `lessonsLazy.test.ts`).
      `apps/hub/src/App.tsx` `SUBJECTS` lấy `id/name/thứ tự/ctaUrl = APP_URL + ctaPath/status` từ
      file sinh; **văn bản tiếp thị** (`tagline`, `description`, `highlight`, `skills`, `emoji`) giữ
      ở hub trong `Record<SubjectId, Copy>` — test canh `Object.keys(copy)` = tập id file sinh
      (thiếu/thừa môn → đỏ).
- [ ] **AC-17 Test của hub CHẠY THẬT trong CI.** `vitest.config.ts:23-28` hiện KHÔNG gồm
      `apps/hub/src/**` → thêm `'apps/hub/src/**/*.test.{ts,tsx}'` vào `include`; test
      `apps/hub/src/subjectsCatalog.test.ts` (id duy nhất, `ctaUrl` mọi môn bắt đầu bằng `APP_URL`
      và **không** còn `/hoc-tieng-anh` sau 02, `START_URL` kết thúc `/bat-dau`). Bằng chứng: tên
      file test hub xuất hiện trong output `npm test`.
- [ ] **AC-18 Hub CTA "Bắt đầu" đi đúng nơi công khai, giữ ngữ cảnh môn.** 5 chỗ `START_URL`
      (`apps/hub/src/App.tsx:364,431,932,994,1154`) vẫn trỏ `${APP_URL}/bat-dau` (nay là trang
      công khai — hiện tại `/bat-dau` là `Intake` gọi `/api/intake` **401 với khách**, xem §②);
      thẻ môn `status:'live'|'preview'` có thêm nút phụ "Bắt đầu với <môn>" → `${APP_URL}/bat-dau?mon=<id>`;
      thẻ `building` không có nút. — unit test hub + kiểm tay ảnh hub 1440/390.
- [ ] **AC-19 Home app cùng nguồn nhãn/thứ tự.** Khối "Bộ môn & không gian" ở `Home.tsx:236-283`
      (hiện 3 thẻ viết tay: `english` → `nav('/hoc-tieng-anh')`, `stem`, `career-life`) — phần
      **môn học** đổi sang render từ `SUBJECT_ENTRIES` (nhãn, thứ tự, `ctaPath`); thẻ Sự nghiệp/Đời
      sống giữ nguyên. Nếu S06 đã thay Home bằng "Hôm nay" trước khi S05 chạy thì AC này áp cho
      thành phần danh mục môn mà S06 dùng. — `Home.test.tsx` (mới, mock auth khách + tài khoản):
      số thẻ môn = `SUBJECT_ENTRIES.length`, nhãn khớp.
- [ ] **AC-20 Login từ hub về đúng đích, không mở open-redirect.** `HubLogin` đã dùng
      `getSafeRedirectUrl` (`packages/core-ui/clientAuth.ts:44`, allowlist 4 host dòng 37-42) —
      S05 KHÔNG thêm tham số redirect mới ở app `Login.tsx` (KHÔNG LÀM). Kiểm: `clientAuth.test.ts`
      xanh; hub login không tham số → `DEFAULT_REDIRECT_URL` (Home app) → Home/S06 đọc ý định đã
      lưu để hiện "học tiếp". — test có sẵn + E2E S06.

**Lệnh chứng minh (mỗi PR, trên checkout sạch):**

```bash
rm -rf packages/*/dist dist dist-server
npm ci
npm run typecheck && npm run lint && npm run format && npm run build && npm run test:coverage
npm run budget
npm run gen:subject-catalog && git diff --exit-code apps/hub/src/subjectsCatalog.generated.ts
npx playwright test e2e/start-by-intent.spec.ts e2e/a11y-intent.spec.ts e2e/a11y-intake.spec.ts \
  e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts e2e/mobile-layout-guards.spec.ts
npm run migrate:pg   # 2 lần liên tiếp, lần 2 phải "no-op" (AC-7)
```

## ① Phạm vi

**LÀM (theo PR):**

**S05-1 — hợp đồng + luồng trong app (client · server · khách):**

1. `packages/core-contracts/learnerIntent.ts` + test (§③.1).
2. `apps/dhcb/src/lib/intent/`: `learnerIntentStore.ts` (đọc/ghi: khách → localStorage, tài
   khoản → `/api/learner-intent` + cache local cùng khoá theo uid), `pickStartAction.ts` (thuần,
   dùng adapter S07-1 `buildLevelOutline`/`buildStemOutline`/`buildCefrOutline` + `flattenLeaves`),
   `intentForbidden.ts` (3 mẫu cấm bổ sung của S05, gộp với 9 mẫu của `intakeSuggestion.ts`), test.
3. `apps/dhcb/src/pages/core/StartByIntent.tsx` (mới) gắn route `/bat-dau`; `Intake.tsx` cũ GIỮ
   NGUYÊN mã, chuyển sang route `/bat-dau/doi-song` (§7 Q1) — 8 chỗ `goto('/bat-dau')` trong
   `e2e/a11y-intake.spec.ts` đổi theo.
4. Server: `apps/server/src/api/personal/learner-intent.ts` + dòng gắn route trong `routes.ts` +
   migration `postgres/migrations/0081_personal_learner_intent.sql` (bảng mới, §③.2) +
   `packages/core-personal/learnerIntentService.ts` (upsert/get, test mock pool).
5. `guestProgress.ts`: thêm tiền tố `dhcb_intent_` vào `ALL_PREFIXES` + nhánh hợp nhất ý định
   trong `mergeGuestProgressInto` (§③.4).
6. Analytics: KHÔNG thêm event mới — dùng `onboarding_step_view` với `refCode = 'intent:<step>'`
   (whitelist server `analytics.ts:28-35` giữ nguyên) và `cta_click` `refCode = 'intent:start'`.
7. E2E mới 2 file, ảnh Tầng 8b, changelog `0326+`, `PROGRESS.md`, goal bảng S05.

**S05-2 — thống nhất danh mục môn:**

8. `packages/core-learner/subjectEntry.ts` + test; `scripts/gen-subject-catalog.ts` + test tươi +
   script `gen:subject-catalog` trong `package.json`.
9. `apps/hub/src/subjectsCatalog.generated.ts` (sinh) + `apps/hub/src/App.tsx` đọc từ đó + test
   hub + `vitest.config.ts` thêm include hub.
10. `Home.tsx` (hoặc thành phần danh mục môn của S06) render từ `SUBJECT_ENTRIES`.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- KHÔNG đổi `Login.tsx`, `HubLogin.tsx`, `RequireAccount`, `AllowGuest`, `RequireAdmin`; KHÔNG thêm
  tham số `?redirect=` cho app Login (spec cha: "Spec 02/04 phải định nghĩa safe relative return
  target … nếu thay hành vi" — S05 không thay). Hub login → Home như hiện nay.
- KHÔNG gọi AI (không `/api/agent`, không Companion) ở bất kỳ bước nào của luồng; gợi ý là hàm
  thuần tất định như `intakeSuggestion.ts`.
- KHÔNG hiển thị chẩn đoán: không điểm, không bậc, không "trình độ của bạn", không tên enum
  `level` thô, không thanh tiến trình kiểu bài thi (§③.5).
- KHÔNG đổi billing/hạn mức/entitlement/`plan.ts`; KHÔNG nới luật khoá (`levelLock.ts`,
  `cefrUnlock.ts`) — nếu lá đầu tiên bị khoá, `pickStartAction` chọn lá `available` kế, không mở
  khoá.
- KHÔNG sửa DNS/host/nginx/`subjectsHost.ts`; KHÔNG đổi `APP_URL` của hub.
- KHÔNG xoá `Intake.tsx`, `intakeApi.ts`, `/api/intake`, `personal.intake`, `FirstTaskCard`,
  `AdminIntakePanel` — luồng "việc đời sống" (`0094`/`0095`) vẫn đo được ở route mới.
- KHÔNG đổi `Onboarding.tsx` 4 bước (nội dung môn Anh: `LEVELS` A1–A2/B1–B2/C1+, `GOALS` ielts…)
  — đó là việc của slice **04** ("Platform không default English"), đã đi trước S05 theo thứ tự
  chốt. Nếu S05 chạy mà 04 chưa merge: S05 **không** vá thay, chỉ ghi nợ.
- KHÔNG đổi `subjectRegistry.ts` (`isDefault: true` của `english` giữ nguyên — slice 04 quyết);
  S05 chỉ **không dùng** trường đó.
- KHÔNG đổi `studios.ts` (81 file ảnh hưởng, spec 02 đã sở hữu), `navTree`, `breadcrumb`.
- KHÔNG đưa văn bản tiếp thị của hub (`description`/`skills`) vào gói — chỉ id/nhãn/thứ tự/CTA/trạng
  thái là nguồn chung.
- KHÔNG cài thư viện mới.

## ② Điểm chạm (đã khảo sát thật trên `7c2d81c`)

| PR  | Việc | Đường dẫn file                                                                     | Ghi chú khảo sát                                                                                                                                                                                                                                                                                                                                 |
| --- | ---- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Thêm | `packages/core-contracts/learnerIntent.ts` (+ test)                                | Cạnh `intake.ts` (Zod strict, `INTAKE_SCHEMA_VERSION = 1`) và `learner.ts` (dùng `versionedObject` của `version.ts:19`). `learnerState.ts:40` có `LearnerGoal {label, dailyMinutes}` — chỉ là adapter đọc `profiles.goal/daily_minutes` (môn Anh), KHÔNG tái dùng làm ý định đa môn.                                                             |
| 1   | Thêm | `apps/dhcb/src/lib/intent/{learnerIntentStore,pickStartAction,intentForbidden}.ts` | Import adapter S07-1 (`apps/dhcb/src/lib/outline/*` hoặc `packages/core-learner/outline/*` theo Q3 của S07) + `flattenLeaves`; `@dhcb/core-personal/intakeSuggestion` chỉ để lấy `findForbiddenLanguage`/`collectVisibleTexts` (file thuần, không kéo `pg` — `intakeService.ts` mới import `pg`). Kiểm bundle không chứa `pg` sau build (AC-14). |
| 1   | Thêm | `apps/dhcb/src/pages/core/StartByIntent.tsx` (+ test)                              | Khuôn `Intake.tsx` (321 dòng: `fieldset/legend`, chấm vị trí, `NextRow` Tiếp/Bỏ qua, `role="status"`/`role="alert"`). Không `Layout` (như Intake — trang toàn màn, vẫn phải kiểm lề dưới AC-13).                                                                                                                                                 |
| 1   | Sửa  | `apps/dhcb/src/App.tsx`                                                            | Dòng 358 `<Route path="/bat-dau" element={<Intake />} />` → `StartByIntent`; thêm `/bat-dau/doi-song` → `Intake` (Q1). Route hiện KHÔNG bọc `RequireAccount`/`AllowGuest` (công khai) — giữ vậy. Comment dòng 184-190 (Intake đã tắt 2026-09-13) cập nhật đường dẫn.                                                                             |
| 1   | Sửa  | `apps/dhcb/src/lib/guestProgress.ts` (+ test)                                      | `ALL_PREFIXES` dòng 50-60 (11 tiền tố); `mergeGuestProgressInto` dòng ~157 (đẩy `pushProgressAsync` + `saveLessonProgress`). Thêm nhánh ý định TRƯỚC `clearGuestKeys`.                                                                                                                                                                           |
| 1   | Thêm | `apps/server/src/api/personal/learner-intent.ts` (+ test)                          | Khuôn `intake.ts`: CORS/OPTIONS → `checkRateLimit(ip, 30, 'learner-intent')` → `validateAuth` → `readJsonBody` + `validateBody(Zod)` → `jsonResponse`. Gắn ở `routes.ts` cạnh dòng 237 `app.all('/api/intake', …)`.                                                                                                                              |
| 1   | Thêm | `packages/core-personal/learnerIntentService.ts` (+ test)                          | Khuôn `intakeService.ts` (mock pool). Giá trị đều là enum đóng → **không mã hoá** (khác câu tự do của intake).                                                                                                                                                                                                                                   |
| 1   | Thêm | `postgres/migrations/0081_personal_learner_intent.sql`                             | Số kế tiếp sau `0080_founder_lifetime_vip.sql`. Khuôn `0061_personal_intake.sql` (`create table if not exists` + `do $$ … if not exists (pg_constraint)`).                                                                                                                                                                                       |
| 1   | Sửa  | `e2e/a11y-intake.spec.ts`                                                          | 8 dòng chứa `/bat-dau` → `/bat-dau/doi-song`; ca bất biến dòng 82-97 giữ nguyên.                                                                                                                                                                                                                                                                 |
| 1   | Thêm | `e2e/start-by-intent.spec.ts`, `e2e/a11y-intent.spec.ts`                           | Khuôn `a11y-intake.spec.ts` (`mockLogin`, `page.route('**/api/…')`).                                                                                                                                                                                                                                                                             |
| 1   | Sửa  | `e2e/mobile-layout-guards.spec.ts`                                                 | Thêm `/bat-dau` (màn gợi ý) vào ma trận lề dưới/bấm được.                                                                                                                                                                                                                                                                                        |
| 2   | Thêm | `packages/core-learner/subjectEntry.ts` (+ test)                                   | Cạnh `subjectRegistry.ts` (6 manifest, `listSupportedSubjects`). `ctaPath`: english `/goc-hoc-tap/english` (sau 02; trước 02 là `/hoc-tieng-anh`), programming `/lap-trinh`, 4 STEM `/goc-hoc-tap/<id>`.                                                                                                                                         |
| 2   | Thêm | `scripts/gen-subject-catalog.ts` (+ `.test.ts`)                                    | Khuôn `scripts/gen-lesson-index.ts` + `lessonsLazy.test.ts` (test tươi). `scripts/**/*.test.ts` đã nằm trong include vitest.                                                                                                                                                                                                                     |
| 2   | Thêm | `apps/hub/src/subjectsCatalog.generated.ts` (+ `subjectsCatalog.test.ts`)          | Hub KHÔNG import `@dhcb/*` (vite alias chỉ có `@core` → `packages/core-ui`, `apps/hub/vite.config.ts:18-19`; tsconfig `paths @dhcb/*` chỉ để quét kiểu, dòng 22-28). File sinh là cách duy nhất không thêm alias build.                                                                                                                          |
| 2   | Sửa  | `apps/hub/src/App.tsx` (1.286 dòng)                                                | `SUBJECTS` dòng 156-258 (6 mục, `ctaUrl` chỉ ở english:176 và programming:196; 4 STEM `status:'building'` dòng 204/220/236/252 trong khi app đã phục vụ 294 bài STEM `draft` — Q5). `START_URL` dòng 53. Copy tiếp thị tách sang `Record<id, Copy>`.                                                                                             |
| 2   | Sửa  | `vitest.config.ts`                                                                 | `include` dòng 23-28 thêm hub.                                                                                                                                                                                                                                                                                                                   |
| 2   | Sửa  | `apps/dhcb/src/pages/core/Home.tsx` (+ `Home.test.tsx` mới)                        | Khối `spaces` dòng 236-283; `nav('/hoc-tieng-anh')` dòng 251. Chưa có test (kiểm `ls` = không có).                                                                                                                                                                                                                                               |

**Ảnh hưởng lan ra (đo `npm run codemap -- impact`, 2026-09-15 trên `7c2d81c`):**

- `apps/dhcb/src/pages/core/Intake.tsx` → **2 file** (`App.tsx`, `main.tsx`) — chỉ đổi route.
- `apps/dhcb/src/lib/intakeApi.ts` → **5 file** (`FirstTaskCard`, `Intake`, `Home`, `App`, `main`)
  — KHÔNG đổi.
- `apps/dhcb/src/lib/guestProgress.ts` → **4 file** (`AuthProvider.tsx` gọi
  `mergeGuestProgressInto` dòng 50, test, `App`, `main`) — thêm nhánh, giữ chữ ký.
- `packages/core-contracts/intake.ts` → **8 file** — KHÔNG đổi (S05 thêm file mới cạnh).
- `packages/core-personal/intakeSuggestion.ts` → **4 file** — KHÔNG đổi; S05 chỉ import thêm.
- `apps/dhcb/src/pages/core/Home.tsx` → **2 file**; `FirstTaskCard.tsx` → **3 file** — giữ.
- `apps/server/src/api/personal/intake.ts` → **2 file** — KHÔNG đổi.
- `apps/hub/src/App.tsx` → **1 file** (`main.tsx`) — hub cô lập, rủi ro thấp nhưng **chưa có test
  nào** (không file `*.test.*` dưới `apps/hub/`, và vitest không quét).
- `apps/dhcb/src/lib/studios.ts` → **81 file** — S05 **KHÔNG chạm** (chỉ ghi để bên thi hành không
  "tiện tay").

## ③ Hợp đồng

### 3.1 `LearnerIntent` (`packages/core-contracts/learnerIntent.ts`)

```ts
export const LEARNER_INTENT_SCHEMA_VERSION = 1

/** Id môn — đúng tập `SUPPORTED_SUBJECTS[].id` của `@dhcb/core-learner/subjectRegistry`. */
export const IntentSubjectIdSchema = z.enum([
  'english',
  'programming',
  'mathematics',
  'physics',
  'chemistry',
  'biology',
])
/** Câu 2 — "Bạn học để làm gì?" */
export const IntentPurposeSchema = z.enum(['thi_cu', 'cong_viec', 'so_thich', 'chua_ro'])
/** Câu 3 — phút mỗi ngày; trùng MINUTES của Onboarding.tsx (5/10/20/30) để S06 tái dùng. */
export const IntentTimeBudgetSchema = z.union([
  z.literal(5),
  z.literal(10),
  z.literal(20),
  z.literal(30),
])
/** Câu 4 — tự khai, CHỈ để chọn việc, KHÔNG BAO GIỜ hiển thị (§3.5 T6). Token không phải chữ Việt
 *  để test rò rỉ bắt được nếu lọt lên giao diện. */
export const IntentLevelSchema = z.enum(['lv_new', 'lv_some', 'lv_solid'])
/** Câu 5 — chỉ khi có môn STEM. Khớp `grade` của `StemLessonSummary` ('10' | '11' | '12'). */
export const IntentGradeSchema = z.enum(['10', '11', '12'])

export const LearnerIntentSchema = versionedObject(
  {
    subjectIds: z
      .array(IntentSubjectIdSchema)
      .min(1)
      .max(6)
      .refine((a) => new Set(a).size === a.length, 'Môn bị trùng'),
    purpose: IntentPurposeSchema.optional(),
    timeBudget: IntentTimeBudgetSchema.optional(),
    level: IntentLevelSchema.optional(),
    grade: IntentGradeSchema.optional(),
    createdAt: z.number().int().positive(),
    updatedAt: z.number().int().positive(),
  },
  LEARNER_INTENT_SCHEMA_VERSION,
).refine(
  (v) => v.grade === undefined || v.subjectIds.some((s) => STEM_IDS.has(s)),
  'Lớp chỉ đi cùng môn Toán/Lý/Hoá/Sinh',
)
export type LearnerIntent = z.infer<typeof LearnerIntentSchema>

/** Bỏ hết 5 câu ⇒ KHÔNG có LearnerIntent (không lưu bản rỗng); gợi ý mặc định là `/goc-hoc-tap`. */
```

**Luật:** `subjectIds` giữ thứ tự bấm; mọi trường khác tuỳ chọn (bỏ qua không chặn luồng). Không có
trường điểm/bậc/xếp hạng và **không được phép thêm** (như `IntakeResultSchema`).

### 3.2 Endpoint `/api/learner-intent` (tài khoản) + migration `0081`

```
GET  /api/learner-intent            → 200 { intent: LearnerIntent | null }
PUT  /api/learner-intent { intent } → 200 { ok: true, intent }   (upsert theo user_id)
```

- Thứ tự kiểm: OPTIONS 204 → `checkRateLimit(ip, 30, 'learner-intent')` 429 → `validateAuth` 401
  → method ∉ {GET, PUT} 405 → `validateBody(LearnerIntentSchema)` 400 → truy vấn LUÔN lọc theo
  `auth.userId` (không có nhánh đọc user khác).
- Bảng `personal.learner_intent`: `user_id uuid primary key references public.profiles(id) on
delete cascade`, `subject_ids text[] not null check (cardinality(subject_ids) between 1 and 6)`,
  `purpose text check (…4 giá trị)`, `time_budget smallint check (in (5,10,20,30))`, `level text
check (in ('lv_new','lv_some','lv_solid'))`, `grade text check (in ('10','11','12'))`,
  `schema_version int not null default 1`, `created_at`/`updated_at timestamptz not null default
now()`. Không mã hoá (enum đóng). `createdAt` phía client = `created_at` server sau lần PUT đầu
  (server thắng).
- Rollback: `drop table if exists personal.learner_intent` — không bảng nào tham chiếu tới nó.

### 3.3 `pickStartAction` (thuần, đồng bộ, không fetch, không AI)

```ts
interface StartActionCtx {
  outlines: ReadonlyMap<IntentSubjectId, Outline | undefined> // từ adapter S07-1, đã có tiến độ/khoá
  catalogPath: string // '/goc-hoc-tap' — đích khi không có ý định
}
interface StartAction { id: string; title: string; why: string; href: string; subjectId?: IntentSubjectId }
interface StartActionResult { schemaVersion: 1; primary: StartAction; alternatives: StartAction[] /* ≤ 2 */ }

pickStartAction(intent: LearnerIntent | null, ctx: StartActionCtx): StartActionResult
```

**Luật chọn (tất định):**

1. `intent === null` → `primary = { id:'catalog', title:'Xem các môn đang có', href: ctx.catalogPath }`,
   `alternatives = []`.
2. Với mỗi `subjectId` theo thứ tự: `leaf = flattenLeaves(outline).find(l => l.availability ===
'available' && l.progress !== 'completed')`; không có lá → dùng `ctaPath` của môn (trang tổng
   quan). `primary` = môn đầu; `alternatives` = ≤ 2 môn kế.
3. `level`/`grade` chỉ đổi **cây được dựng** (ở nơi gọi, §3.3.1), không đổi luật chọn lá.
4. `title` = `"Bắt đầu: " + leaf.title`; `why` = câu theo `purpose`/`timeBudget` (bảng cố định ≤ 8
   câu, qua bộ lọc §3.5), ví dụ `timeBudget = 5` → "Bài này vừa một buổi ngắn."; `purpose =
'chua_ro'` → "Chưa rõ cũng không sao — mình chọn một bài để cùng bắt đầu.".

**3.3.1 Cây nào được dựng theo môn và mức tự khai** (nơi gọi, `StartByIntent.tsx`/S06):

| Môn         | `lv_new` (mặc định khi bỏ qua)        | `lv_some` / `lv_solid`                                                                      | Nguồn cây (S07-1)                                                                      |
| ----------- | ------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| english     | `buildCefrOutline(A1)`                | Q2: (a) vẫn A1 (A2+ khoá theo `computeUnlockedLevels`, S05 không nới) hoặc (b) `/placement` | `cefr.json` + `lockedMap` server; khách: A1 mở                                         |
| programming | `buildLevelOutline('p1')`             | như trên — P2 khoá tới 70% P1 (`levelLock.ts`); chọn lá `available` kế trong P1             | `LESSON_INDEX`; tiến độ `/api/programming/progress` hoặc `dhcb_prog_progress_<guest>`  |
| 4 STEM      | `buildStemOutline(id, grade ?? '10')` | như `lv_new`                                                                                | `STEM_SUBJECTS[id].loader.index`; `progress:'unknown'` → coi như chưa xong, lấy lá đầu |

**Vì sao "mức tự khai" gần như không đổi đích:** luật khoá hiện có (server CEFR, client 70% Lập
trình) là authority và S05 cấm nới; mức tự khai đúng vai "chỉ để chọn việc", nên S05 ghi rõ nó
được LƯU (S06/S10 dùng để chọn độ khó/lời nhắc) nhưng ở S05 chỉ ảnh hưởng môn Anh theo Q2.

### 3.4 Khách: khoá local + hợp nhất

- Khoá: `dhcb_intent_<uid>` (uid = `guest_<uuid>` hoặc id tài khoản — cùng khuôn `<tiền tố>_<uid>`
  của mọi module tiến độ, để `ALL_PREFIXES` dọn được). Giá trị: `JSON.stringify(LearnerIntent)`;
  đọc qua `LearnerIntentSchema.safeParse` — hỏng → coi như không có, không ném.
- `try/catch` mọi truy cập storage (private mode); bị chặn → giữ trong bộ nhớ phiên + gợi ý vẫn
  hiện, báo "Không lưu được trên máy này".
- Hợp nhất (`mergeGuestProgressInto(realUid)`): đọc `dhcb_intent_<guest>`; nếu có → GET server;
  server `null` → PUT bản khách (giữ `createdAt` khách); server có → bỏ bản khách. Sau đó
  `clearGuestKeys` xoá như các khoá khác. Ghi cache `dhcb_intent_<realUid>` bản thắng.

### 3.5 Luật ngôn ngữ + 7 test bất biến (chặn CI)

Bộ lọc = 9 mẫu có sẵn của `intakeSuggestion.ts:40-50` (`\d+/100` · `\d+%` · "điểm số|chấm điểm" ·
"bạn (đang ở )?mức|trình độ của bạn" · "bạn (thiếu|yếu|kém|chưa đạt)" · "so với (người|bạn
bè|những người) (cùng|khác)" · "xếp hạng|thứ hạng" · "đáng lẽ|lẽ ra" · "tuổi này (mà|bạn
phải|phải)") **+ 3 mẫu mới** trong `intentForbidden.ts` (cùng lookaround `(?<!\p{L})…(?!\p{L})`,
KHÔNG dùng `\b` — bẫy đã ghi ở changelog `0094`):

| #    | Mẫu cấm (regex `iu`)                                                         | Vì sao                                                     |
| ---- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| S05a | `hồ sơ (năng lực\|của bạn)\|năng lực của bạn\|chẩn đoán\|phân tích cho thấy` | Lớp hồ sơ ẩn không được nhắc tới trên giao diện            |
| S05b | `lv_new\|lv_some\|lv_solid\|thi_cu\|cong_viec\|so_thich\|chua_ro`            | Token enum thô rò lên chữ hiển thị = lỗi mapping           |
| S05c | `bạn (đang )?ở (bậc\|cấp\|mức\|trình độ)\|cấp độ của bạn\|top \d+`           | Xếp loại người dùng theo bậc (kể cả A1–C2 gắn với "bạn ở") |

Bảy test (mỗi test một `it` riêng, tên ghi đúng mã T1–T7):

| Test | Khẳng định                                                                                                                                         | File                                                   |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| T1   | Không tổ hợp nào trong 1.152 + đa môn sinh chuỗi khớp 9 mẫu cũ                                                                                     | `pickStartAction.test.ts`                              |
| T2   | Không tổ hợp nào sinh chuỗi khớp 3 mẫu S05a–c                                                                                                      | `pickStartAction.test.ts`                              |
| T3   | Luôn đúng 1 `primary`, ≤ 2 `alternatives`, id khác nhau, `href` bắt đầu `/` và không `//`                                                          | `pickStartAction.test.ts`                              |
| T4   | `LearnerIntent` là input, KHÔNG BAO GIỜ là output: `StartActionResult` Zod strict không có trường `level`/`purpose`/`grade`/`score`/`rank`         | `pickStartAction.test.ts` (schema strict)              |
| T5   | `intent === null` → `href === '/goc-hoc-tap'`, không phải bất kỳ route tiếng Anh nào (`/hoc-tieng-anh`, `/goc-hoc-tap/english`, `/lo-trinh-hoc/*`) | `pickStartAction.test.ts`                              |
| T6   | Render `StartByIntent` màn gợi ý với mọi `level` → `container.textContent` không chứa token `lv_*`, không chứa "trình độ", "bậc", "%", "/100"      | `StartByIntent.test.tsx`                               |
| T7   | DOM thật: `body.innerText` màn gợi ý không khớp 12 mẫu; 5 theme                                                                                    | `e2e/start-by-intent.spec.ts` (khuôn `a11y-intake:82`) |

### 3.6 `SubjectEntry` — nguồn chung cho hub và app (`packages/core-learner/subjectEntry.ts`)

```ts
export type SubjectEntryStatus = 'live' | 'preview' | 'building'
export interface SubjectEntry {
  id: SubjectManifest['id'] // 6 id của SUPPORTED_SUBJECTS, cùng thứ tự
  label: string // = manifest.label nguyên văn ('Tiếng Anh' · 'Lập trình' · 'Toán học' · 'Vật lý' · 'Hóa học' · 'Sinh học')
  order: number // 0-based = vị trí trong SUPPORTED_SUBJECTS
  ctaPath: string // route nội bộ app: '/goc-hoc-tap/english' (sau 02) · '/lap-trinh' · '/goc-hoc-tap/<stem>'
  status: SubjectEntryStatus // Q5: STEM 'preview' (294 bài draft đang phục vụ) hay 'building'
}
export const SUBJECT_ENTRIES: readonly SubjectEntry[]
```

File sinh cho hub `apps/hub/src/subjectsCatalog.generated.ts` chứa **đúng** mảng trên (không kiểu
import từ gói — kiểu khai lại tại chỗ) + dòng đầu `// SINH TỰ ĐỘNG bởi scripts/gen-subject-catalog.ts — KHÔNG sửa tay`.
Hub ghép `ctaUrl = APP_URL + ctaPath`. Lưu ý lệch nhãn đã thấy: `STEM_SUBJECTS.mathematics.label =
'Toán'` (`stemLessonRoutes.ts:26`) khác registry `'Toán học'` — S05 dùng **registry** làm chuẩn
nhãn danh mục; nhãn ngắn của route STEM giữ cho breadcrumb, không thuộc S05.

### 3.7 Ca lỗi (là hợp đồng)

| Tình huống                                                     | Mã/hành vi mong đợi                                                                                                                 |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| PUT không token / token hết hạn                                | 401 `{ error: 'Unauthorized' }`; client: khách thì không gọi (chỉ local); tài khoản thì giữ cache local + thông báo "Chưa lưu được" |
| PUT `subjectIds: []`, id lạ, `grade` không kèm STEM, trường lạ | 400 với thông điệp Zod tiếng Việt (qua `validateBody`)                                                                              |
| > 30 yêu cầu/phút/IP                                           | 429 "Quá nhiều yêu cầu — thử lại sau 1 phút" (`logSecurityEvent('RATE_LIMIT_EXCEEDED')`)                                            |
| GET khi chưa có dòng                                           | 200 `{ intent: null }` (không 404 — "chưa có ý định" là trạng thái bình thường)                                                     |
| Mạng lỗi khi PUT (tài khoản)                                   | Vẫn hiện gợi ý từ bản local; `role="alert"` "Chưa lưu được lên tài khoản — sẽ thử lại khi bạn về trang chủ"; không chặn "Bắt đầu"   |
| localStorage bị chặn (khách)                                   | Giữ trong state; gợi ý vẫn hiện; báo không lưu được; không ném                                                                      |
| Cây S07 của môn không dựng được (`undefined`)                  | Rơi về `ctaPath` trang tổng quan môn; không trắng trang, không lỗi console                                                          |
| Lá đầu tiên bị khoá (`locked`)                                 | Chọn lá `available` kế; toàn cây khoá → `ctaPath`; KHÔNG mở khoá                                                                    |
| `?mon=<id lạ>` / `?mon=` / `?mon=english,xxx`                  | Bỏ id lạ, giữ id hợp lệ theo thứ tự xuất hiện; không lỗi                                                                            |
| Người có ý định server nhưng cache local hỏng                  | Server thắng, ghi lại cache                                                                                                         |
| Hợp nhất khách: server đã có ý định                            | Giữ server, xoá khoá khách, không PUT                                                                                               |
| File sinh hub lệch nguồn (quên `gen:subject-catalog`)          | `scripts/gen-subject-catalog.test.ts` đỏ với câu nhắc đúng lệnh                                                                     |

## ⑤ Bất biến không được phá

| Bất biến                                                                        | Test canh                                                                                                                   |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Chẩn đoán không bao giờ là màn hình chính; không điểm/bậc/hồ sơ trên giao diện  | T1–T7 (§3.5); `intakeSuggestion.test.ts` 1.575 tổ hợp (giữ nguyên); `a11y-intake.spec.ts:82`                                |
| Không mặc định tiếng Anh; bỏ hết câu hỏi → danh mục, không phải môn Anh         | T5; AC-5 `grep isDefault` = 0 trong `lib/intent`                                                                            |
| Không gọi AI trả phí trong onboarding                                           | AC-11 E2E đếm request; unit `grep` import                                                                                   |
| Cổng đăng nhập cũ nguyên vẹn (`RequireAccount`/`AllowGuest`/`Login`/`HubLogin`) | `git diff` AC-12; `clientAuth.test.ts` (open redirect); `e2e/a11y.spec.ts` route `/onboarding`                              |
| Không mất tiến độ khách; hợp nhất là union; khoá mới có tiền tố đăng ký         | `guestProgress.test.ts` (20 ca hiện có + 4 mới)                                                                             |
| Luật khoá không nới (CEFR server, Lập trình 70%)                                | `cefrUnlock.test.ts`, `levelLock.test.ts`, `programmingLevelLock.test.ts`; ca "lá đầu khoá → lá kế" trong `pickStartAction` |
| Luồng đời sống cũ (`/api/intake`, `FirstTaskCard`, admin panel) vẫn đo được     | `intakeService.test.ts`, `AdminIntakePanel.test.tsx`, `a11y-intake.spec.ts` (route mới), `a11y-admin-intake.spec.ts`        |
| Hub và app cùng nguồn danh mục; file sinh không lệch                            | `subjectEntry.test.ts`, `gen-subject-catalog.test.ts`, `apps/hub/src/subjectsCatalog.test.ts` (chạy thật nhờ AC-17)         |
| Hub không import gói `@dhcb/*`                                                  | `grep -rn "@dhcb/" apps/hub/src` = 0 (ghi vào test hub)                                                                     |
| `/api/*` handler tự `validateAuth`, rate limit, Zod                             | `learner-intent.test.ts`; `scripts/ci-workflow-policy.test.ts` không đổi                                                    |
| Mobile lề dưới, a11y AA + AAA 5 theme; ngân sách bundle/coverage                | `mobile-layout-guards.spec.ts`, `a11y-intent.spec.ts`, `npm run budget`, `test:coverage`                                    |

## ⑥ Quy ước dự án liên quan (bên thi hành không thấy hội thoại)

- Import xuyên gói `@dhcb/<gói>/<file>` không đuôi `.js`; nội bộ gói đường tương đối có `.js`;
  `packages/` không import `apps/` (ESLint chặn); **hub không import `@dhcb/*`** — chỉ đọc file
  sinh.
- Mọi handler API: CORS → rate limit → `validateAuth()` → Zod (`validateBody`) → query lọc đúng
  `auth.userId`. Không tin client.
- Zod strict, `versionedObject` cho hợp đồng; không `any`.
- URL dựng qua hàm dùng chung: `duongDanBaiHoc` (Lập trình, S07-1), `duongDanBaiHoc` của
  `stemLessonRoutes.ts` (STEM), khuôn `<mã>--<slug>`; không ghép chuỗi rải rác.
- Chữ nội dung AAA (≥ 7:1), nút/nhãn AA; màu từ token `--a-*`/`--z-*`; vùng chạm ≥ 44px (`tap-44`);
  `fieldset/legend` cho nhóm lựa chọn, `aria-pressed` cho ô chọn nhiều; `role="status"`/`"alert"`.
- Tiếng Việt cho mọi chữ hiển thị; **không `\b` trong regex tiếng Việt** (dùng lookaround `\p{L}` + cờ `u`).
- Khoá localStorage `<tiền tố>_<uid>`; tiền tố mới PHẢI đăng ký trong `ALL_PREFIXES`; `try/catch`
  mọi truy cập storage.
- Sinh file: chạy `npm run gen:subject-catalog` sau khi đổi `subjectEntry.ts`; test tươi đỏ nếu quên.
- Migration: số kế tiếp `0081`, idempotent, có rollback ghi ở đầu file; `npm run migrate:pg`.
- Đổi UI → ảnh 1440/768/390/320 trước/sau (QUY-TRINH-AUDIT Tầng 8b) dán vào PR; a11y AA + AAA.
- PR: `feat(learning): …` (S05-1) / `feat(hub): …` (S05-2), mô tả dẫn file này + "Approved for
  implementation", đủ 6 tiêu đề cổng `metadata`, READY, bật auto-merge (squash) ngay sau tạo.
- Cổng trên checkout sạch (`rm -rf packages/*/dist dist dist-server`), `npm ci` trước; cổng test CI
  là `test:coverage`; thêm gói/alias → commit `package-lock.json`.

## 7. Quyết định cần chủ dự án chốt trước khi Approved

| #   | Câu hỏi                                                                                                                                                                                                                                                     | Đề xuất của AI (mặc định nếu không có ý kiến khác)                                                                                        | Lý do                                                                                                                                                                                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Bộ câu và route: dùng lại 5 câu Intake (tuổi · mối bận tâm · thêm 1 giờ · quên thời gian · đà học) hay bộ câu MỚI theo `LearnerIntent` (môn · mục đích · phút/ngày · quen chưa · lớp)? `/bat-dau` cho ai?                                                   | **Bộ câu mới ở `/bat-dau`** (hub đã trỏ 5 chỗ tới đó); Intake cũ giữ nguyên mã tại `/bat-dau/doi-song`, không link từ đâu (như hiện nay). | Intake hỏi về ĐỜI SỐNG (sức khoẻ, tiền bạc) và trả việc đời sống, không trả bài học; nó cần tài khoản (`/api/intake` 401 với khách) nên hub CTA hiện dẫn khách vào ngõ cụt. Trộn hai bộ = 10 câu, vi phạm "≤ 5 câu". Không xoá Intake vì `0095` đang đo nó. |
| Q2  | Môn Anh khi tự khai `lv_some`/`lv_solid`: (a) vẫn vào A1 (A2+ khoá theo server) hay (b) gợi ý `/placement` (bài xếp lớp 5 phút, đã có, công khai)?                                                                                                          | **(a) A1** ở S05; (b) để S10/S06 cân nhắc.                                                                                                | (b) đưa một BÀI CHẨN ĐOÁN thành "việc đầu tiên" — sát ranh Luật số 1 dù kết quả không lên Home; (a) tuân luật khoá hiện có, không nới; người quen tiếng Anh vẫn có nút "Đổi ý định"/mục lục S07 để nhảy.                                                    |
| Q3  | Lưu ý định của tài khoản ở đâu: (a) bảng mới `personal.learner_intent` + endpoint mới; (b) cột `jsonb` trên `public.profiles`; (c) nhét vào `personal.intake`?                                                                                              | **(a)**.                                                                                                                                  | (b) đụng bảng đi qua luồng đăng nhập của MỌI người dùng (`/api/auth?action=me`, `profile.ts`) — rủi ro lan; (c) trộn hai luồng khác nghĩa và bảng đó có ràng buộc CHECK riêng. (a) cô lập, rollback = drop table, đúng khuôn `0061`.                        |
| Q4  | Khách chỉ mới trả lời ý định (chưa học gì) có tính là "có tiến độ khách" để kích hoạt hợp nhất khi đăng nhập không?                                                                                                                                         | **Có** — thêm `dhcb_intent_` vào `ALL_PREFIXES`, `hasGuestProgress()` = true.                                                             | Nếu không, ý định khách mất ngay lúc đăng ký — đúng lúc cần nhất (Home S06 "học tiếp" trống). Chi phí: một GET + có thể một PUT lúc đăng nhập.                                                                                                              |
| Q5  | Trạng thái 4 môn STEM trong nguồn chung: hub đang ghi `'building'` ("Đang xây") trong khi app phục vụ 294 bài `draft` tại `/goc-hoc-tap/<id>/bai-hoc`. Chốt `'preview'` (nhãn "Đang hoàn thiện — xem trước được", có CTA) hay giữ `'building'` (không CTA)? | **`'preview'`** cho 4 STEM; `'live'` cho english/programming.                                                                             | Hub nói "đang xây" nhưng người bấm vào app lại thấy bài — hai nơi đang nói hai chuyện; nguồn chung phải nói một chuyện đúng. `preview` không hứa quá (test `StemLesson.test.tsx` canh 294/294 draft có nhãn "chưa duyệt").                                  |
| Q6  | Cơ chế đồng bộ hub: (a) file SINH `subjectsCatalog.generated.ts` + test tươi (khuôn `gen:lesson-index`), hay (b) hub giữ bản tay + test đối chiếu như spec 02 đề xuất cho `ctaUrl`?                                                                         | **(a)**.                                                                                                                                  | (b) chỉ canh được điều test nghĩ tới (một chuỗi), và test hub hiện **không chạy** (vitest không include `apps/hub`, chưa có file test nào). (a) máy chép, người không chép; test tươi bắt mọi lệch. Cả hai đều cần AC-17 sửa `vitest.config.ts`.            |

## 8. Rủi ro và giảm thiểu

| Rủi ro                                                                                                         | Giảm thiểu                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phễu rớt lần nữa như `0293` (Intake 5 câu + Onboarding 4 bước = tối đa 9 lượt bấm → 80% rớt)                   | `/bat-dau` là **tuỳ chọn** (không gate), ≤ 5 màn, bỏ qua từng câu, đo `onboarding_step_view` `intent:<step>`; tài khoản mới vẫn chỉ qua `/onboarding` như hiện nay            |
| Tài khoản mới sau khi trả lời ý định vẫn bị `RequireAccount` đẩy vào `/onboarding` môn Anh (nếu 04 chưa merge) | S05 đi SAU 04 theo thứ tự chốt; nếu đảo thứ tự, ghi nợ ở changelog, KHÔNG vá `RequireAccount` trong S05                                                                       |
| Import `@dhcb/core-personal/intakeSuggestion` vào app kéo `pg` vào bundle                                      | File thuần, không import `pg`; kiểm `dist/assets` không chứa chuỗi `pg-pool`; nếu có → chuyển `findForbiddenLanguage` sang `core-contracts` (không đổi API)                   |
| `pickStartAction` phụ thuộc adapter S07-1 chưa merge                                                           | S07-1 đứng trước S05 trong thứ tự chốt; nếu chưa, S05-1 tạm dùng `ctaPath` trang tổng quan môn (test ghi rõ ca "không có cây") và bật lá sau — không đổi hợp đồng             |
| Bộ lọc ngôn ngữ báo nhầm tên bài thật (ví dụ bài Toán "Tỉ lệ phần trăm" chứa `%`)                              | Bộ lọc áp lên `title`/`why` do S05 sinh; tên bài lấy nguyên văn từ chỉ mục — test T1/T2 dùng chỉ mục THẬT, lệch thì đưa tên bài ra khỏi vùng quét có ghi lý do, không nới mẫu |
| Hub build lệch app trong khoảng deploy (ba app không atomic — spec cha §⑥)                                     | `ctaPath` mới đều là route đã có alias từ 01/02; hub cũ trỏ `/hoc-tieng-anh` vẫn 302 đúng                                                                                     |
| `hasGuestProgress()` = true chỉ vì ý định → `AuthProvider` gọi hợp nhất → thêm 1–2 request lúc đăng nhập       | Q4 chấp nhận; test "gọi lần hai là no-op" giữ                                                                                                                                 |
| Coverage tụt vì thêm trang/nhánh UI                                                                            | `lib/intent/*` thuần 100%; handler server test đủ nhánh 401/400/405/429; UI có `StartByIntent.test.tsx`                                                                       |
| Nợ tài liệu: file research luồng người mới không tồn tại dù CLAUDE.md dẫn                                      | Ghi ở changelog S05-1; đề xuất PR `docs` riêng khôi phục/đổi dẫn — không thuộc S05                                                                                            |

## 9. Kế hoạch thi hành (2 PR, tuần tự; mỗi PR một subagent, agent chính review)

1. **S05-1 `feat(learning): bat dau theo y dinh — LearnerIntent, /bat-dau, gop y dinh khach`** —
   contracts + `lib/intent` + trang + server + migration `0081` + `guestProgress` + E2E + ảnh.
   Điều kiện vào: S07-1 (adapter cây) và S06 (Home đọc ý định) đã merge; 04 đã merge (Onboarding
   không còn mặc định Anh). Cổng đầy đủ + `migrate:pg` 2 lần.
2. **S05-2 `feat(hub): mot nguon danh muc mon cho hub va app`** — `subjectEntry.ts` + generator +
   file sinh + hub `App.tsx` + `vitest.config.ts` + `Home.tsx`. Có thể chạy **song song** S05-1 (không
   chạm file chung ngoài `package.json` script) nhưng merge sau để `START_URL` trỏ vào trang mới.
3. Mỗi PR: changelog `docs/changelog/03xx-*.md` (`npm run changelog` in số), `PROGRESS.md` mục
   "Tiếp theo", goal bảng S05 (Issue/PR/State/Evidence), đổi trạng thái ở spec này.

**Rollback:** revert PR tương ứng. S05-1: `drop table if exists personal.learner_intent` (không ai
tham chiếu); khoá `dhcb_intent_*` local vô hại khi không còn mã đọc (và bị `clearGuestKeys` dọn khi
đăng nhập nếu tiền tố còn đăng ký). Route `/bat-dau` quay về `Intake` nguyên bản; hub `START_URL`
không đổi nên không cần deploy lại hub cho S05-1. S05-2: revert file sinh + hub; app Home về 3 thẻ
tay — không dữ liệu, không migration.

## 19. Phê duyệt

- [ ] Product outcome và scope (Q1–Q6)
- [ ] UX/accessibility (≤ 5 màn, bỏ qua được, một nút Bắt đầu, không chẩn đoán, 5 theme, 320px)
- [ ] Architecture (`LearnerIntent` versioned, endpoint + migration `0081`, khách local + hợp nhất, file sinh cho hub)
- [ ] Test/rollout/rollback (2 PR, 7 test bất biến ngôn ngữ, test hub chạy thật)

**Kết luận:** In review  
**Người duyệt:** —  
**Ngày:** —
