# Feature spec: Tiến độ rõ ràng, phục hồi được và mở dần theo nhu cầu

| Thuộc tính    | Giá trị                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| Slice         | UX-R3 — Dashboard progressive disclosure                                     |
| Spec cha      | [`2026-09-18-ui-clarity-foundation.md`](2026-09-18-ui-clarity-foundation.md) |
| Base          | `main@5d81c6c8` — UX-R2 đã merge trong PR #1022                              |
| Spec owner    | Agent chính Đồng Hành                                                        |
| Trạng thái    | **Approved for implementation — bốn source slice tuần tự**                   |
| Quyết định UX | Phương án A: bỏ `ProgressStory` độc lập, gộp narrative vào “Tuần này”        |
| Ngày cập nhật | 2026-09-18                                                                   |

> PR này phê duyệt **kiến trúc và toàn bộ hợp đồng UX-R3**. Đây là PR docs-only, không chứa
> source. Sau khi PR merge vào `main`, bốn source slice ở §12 được làm tuần tự, mỗi slice một PR.

## 0. Một câu

Giúp người học đọc `/tien-do` theo thứ tự **toàn bộ môn → tuần này → chi tiết Tiếng Anh**, thấy
đúng trạng thái tải/lỗi và chỉ mở dữ liệu chuyên sâu khi cần, thay vì phải quét một trang dài với
nhiều khối ngang trọng lượng.

## 1. Context, problem và evidence

- Canonical audit trên `main@5d81c6c8`, cùng fixture member/data, locale `vi`, timezone
  `Asia/Ho_Chi_Minh`, cho chiều cao `/tien-do`: **3.722px ở 320**, **3.527px ở 390** và
  **2.195px ở 1440**.
- `Dashboard.tsx` hiện đặt đoạn giải thích Tiếng Anh trước `PageHeader`, rồi lần lượt tiến độ theo
  môn, streak, mục tiêu tuần, lịch, Hôm nay, từ vựng, sổ lỗi, CEFR, IELTS và tổng kết. Nhiều khối
  có cùng cấp thị giác nên không có câu trả lời nhanh cho “tuần này tôi đang thế nào?”.
- `fetchWeeklyCredit()` chủ đích bắt lỗi/non-2xx và resolve `null`; response hợp lệ cũng cho phép
  `freeWeeklyCredit=null` để biểu thị server chưa biết. Dashboard hiện đánh đồng cả hai với loading,
  nên UI có thể giữ `…/30` vô hạn, không giải thích và không Retry.
- Chuỗi `loadCurriculum() → getCefrProgress()` không có `catch`: khi reject, `ready` không bao giờ
  thành `true`, CEFR tiếp tục nói “Đang tải…”. Cache `_loadPromise` hiện giữ promise đã reject nên
  gọi lại cũng không tải thật.
- `TwoPane` và các nhánh `isDesktop` dựng QuickActions/streak/weekly ở vị trí khác nhau; resize có
  thể remount subtree và làm mất dialog/focus/state cục bộ. Calendar đổi hình học 5/13/26 tuần
  theo viewport nhưng chưa có contract giữ ngày được chọn và focus qua breakpoint.
- P2-10 từng đề xuất một `ProgressStory` mới ở đầu `/tien-do`. Người dùng đã chọn phương án A:
  **không tạo component/khối narrative độc lập**. Narrative tối đa một câu phải là một phần của
  vùng “Tuần này”; P2-10 được supersede bởi UX-R3.
- Adversarial review vòng 1: **BLOCK — 6 findings** về nested loader cache/HTTP failure, semantics
  quota null/0, scope English của dữ liệu tuần, conditional focus, calendar disclosure qua
  breakpoint và embedded calendar boundary. Bản này đã cập nhật cả sáu contract.
- Re-review vòng 2: **BLOCK — 0 critical · 2 major** về recovery target khi English panel hidden
  và CLS bị cửa sổ recent-input che. Bản này khóa target heading/toggle theo visibility và delay
  monotonic ≥600ms + observer flush. Vòng 3 **PASS — 0 critical · 0 major · 0 minor**.

## 2. Goals, non-goals và invariants

### Goals

1. Mọi dữ liệu async do Dashboard sở hữu có `loading | ready | error`, Retry thật và chống stale
   response khi user/sync/retry đổi.
2. Một DOM tree ổn định qua 1024/1280px; state, ngày calendar được chọn và focus không rơi về
   `body` khi resize.
3. Cấu trúc thông tin mặc định: `PageHeader → Tiến độ theo môn → Tuần này → Chi tiết Tiếng Anh →
Công cụ`; narrative tuần nằm trong “Tuần này”.
4. Chi tiết riêng của Tiếng Anh đóng mặc định và mở theo yêu cầu ở mọi viewport; dữ liệu không bị
   xóa và mọi destination hiện hành vẫn truy cập được.
5. Đạt budget chiều cao, CLS, accessibility và quality gate ở §9–§11.

### Non-goals

- Không đổi route, API, response payload, auth, quota, billing, entitlement, mastery, evidence,
  schema, migration, dependency hoặc telemetry.
- Không sửa thuật toán streak, mục tiêu tuần, activity count, SRS, CEFR, IELTS hoặc giới hạn AI.
- Không tạo `ProgressStory`, `buildProgressStory`, card narrative mới hoặc AI-generated insight.
- Không làm UX-R4 taxonomy/header/navigation; không thay `Layout`, bottom nav hay global token.
- Không mặc định Tiếng Anh là môn duy nhất; không đưa placement/band/mastery/số năng lực vào khối
  đa môn và không biến AI output thành authoritative state.
- Không nới/skip/baseline các cổng a11y, chiều cao, CLS, overflow hay bundle để đạt merge.

### Invariants

- “Chưa đo được” vẫn là chữ, không quy dữ liệu thiếu thành `0%`.
- Chỉ domain evidence hiện hành quyết định hoàn thành; UX-R3 chỉ đọc và trình bày.
- Mọi control mới/đổi có vùng chạm ≥44×44px, focus ring tức thì; nội dung đạt AAA, control đạt AA
  trên `dark-blue`, `blue-sky`, `kid`.
- Không `transition-all`; chỉ animate transform/opacity hoặc grid rows khi thực sự cần, luôn có
  `motion-reduce`.
- Không card lồng card, không glow/gradient trang trí mới, không nguồn token/`DESIGN.md` thứ hai.

## 3. Outcome và metric

| Phép đo canonical, loaded/collapsed |           Baseline |                        Target UX-R3 |
| ----------------------------------- | -----------------: | ----------------------------------: |
| Page height 320×844                 |            3.722px |                        **≤2.300px** |
| Page height 390×844                 |            3.527px |                        **≤2.100px** |
| Page height 1440×900                |            2.195px |                        **≤1.450px** |
| Document overflow ngang             |          Chưa khóa | **0**; `scrollWidth === innerWidth` |
| CLS loading/error/retry→ready       |          Chưa khóa |              **<0,1** cho từng case |
| Async failure treo vô hạn           |            2 đường |           **0**; đều có lỗi + Retry |
| Narrative tiến độ độc lập           | P2-10 dự kiến thêm |                               **0** |

Đây là metric kỹ thuật chống phình/rối, không phải bằng chứng retention hay hiệu quả học.

## 4. Hợp đồng async và failure behavior

### 4.1 Keyed resource state

Hai resource do Dashboard sở hữu phải dùng cùng semantics; có thể dùng helper cục bộ có kiểu
strict nhưng không mở abstraction toàn repo chỉ cho hai call site:

```ts
type DashboardResource<T> =
  | { key: string; status: 'loading' }
  | { key: string; status: 'ready'; data: T }
  | { key: string; status: 'error' }
```

- Weekly credit key: `weekly-credit:${userId}:${effectivePlan}:${retryRevision}`. Với VIP, resource
  là `ready/not-applicable` và tuyệt đối không gọi endpoint Free.
- CEFR key: `cefr:${userId}:${syncVersion}:${retryRevision}`.
- UI chỉ đọc kết quả khi `result.key === currentKey`; key lệch được xem là `loading`. Promise cũ
  resolve/reject sau cleanup không được ghi đè key mới.
- Khi user hoặc plan đổi, không được hiện dữ liệu quota/CEFR của user trước dù chỉ một frame.
- Retry tăng revision đúng một lần và không reload trang. Retry control giữ mounted trong loading
  với `aria-disabled=true` + guard chống click lặp. Focus recovery dùng contract chính xác:
  - weekly credit nằm trong English summary luôn visible; nếu Retry vẫn là
    `document.activeElement` ngay trước commit làm nó biến mất, focus
    `#dashboard-weekly-credit-heading[tabindex="-1"]`;
  - CEFR nằm trong English detail: khi panel còn mở và Retry vẫn active, focus
    `#dashboard-cefr-heading[tabindex="-1"]`; nếu panel đã đóng, hide handler phải đưa focus về
    button `#dashboard-english-details-toggle`, và success giữ focus ở đó;
  - nếu người dùng đã chuyển focus tới nơi khác thì success tuyệt đối không steal. Không lưu một
    cờ “đã từng focus Retry” rồi cưỡng focus muộn.
- Error state dùng copy thân thiện, không render exception/message thô, token, URL nội bộ hoặc PII.

### 4.2 Weekly credit

- Loading: skeleton/reserve có nhãn `Đang tải lượt AI…`, không hiện `…/30` như thể 30 là dữ liệu
  server đã xác nhận.
- Ready chỉ khi payload qua runtime validation: `plan` là `free|vip`, `freeWeeklyCap` là số nguyên
  dương hữu hạn, `freeWeeklyCredit` là số nguyên hữu hạn trong `0..cap`. **Credit 0 là ready hợp
  lệ**, phải hiện `0/cap`, không bị truthy check biến thành loading/error.
- `fetchWeeklyCredit()` resolve `null`, payload có `freeWeeklyCredit:null`, JSON sai shape, số âm,
  `NaN`, vượt cap hoặc cap ≤0 đều là unavailable/error: `Chưa tải được lượt AI hôm nay.` + button
  `Thử lại`; các thống kê local khác vẫn dùng được. Không suy quota từ local usage và không thay
  số bằng 0/30 giả.
- `weeklyCredit.ts` dùng Zod schema/runtime parser theo invariant hiện hành; parse fail trả `null`
  như network/non-2xx, không đổi API endpoint/payload server và không ném raw validation error ra UI.
- Retry phải tạo request mới; stale request không đổi UI.

### 4.3 Curriculum/CEFR và rejected loader cache

- `loadCurriculum()` vẫn coalesce các lời gọi đồng thời thành một promise.
- Cả bốn cache promise tại `curriculum.ts`, `data/dictionary/loader.ts`,
  `data/curriculumLoader.ts`, `data/cefrLoader.ts` phải reset về `null` khi **chính promise đang
  cache** reject. Mỗi reset dùng identity guard; promise cũ reject muộn không được xóa promise mới.
- Cả 12 fetch resource (10 dictionary chunk + foundation + CEFR) kiểm `response.ok` trước `.json()`;
  non-2xx phải reject rõ ràng, không parse error page như JSON dữ liệu.
- Unit test bắt buộc cho từng loader: calls pending coalesce; reject xóa đúng cache; promise cũ
  không xóa cache mới; call sau tạo request/promise mới và resolve.
- Integration test dùng fake `fetch` riêng từng tài nguyên: cho lần lượt một dictionary chunk,
  foundation và CEFR trả non-2xx/reject, xác nhận toàn `loadCurriculum()` reject; sửa resource đó
  rồi Retry phải fetch lại resource lỗi và resolve. Dữ liệu chỉ publish sau khi đủ cả ba nhóm.
- Dashboard loading/error chỉ thay vùng English summary/CEFR liên quan; `PageHeader`, tiến độ đa
  môn, tuần này, calendar và công cụ vẫn render.
- Error copy: `Chưa tải được lộ trình Tiếng Anh.` + `Thử lại`; retry gọi lại loader thật. Không
  giữ chữ “Đang tải…” sau rejection.

## 5. Responsive state, focus và calendar

1. Dashboard dùng một cây component ổn định cho mobile/desktop; không render hai bản cùng nội dung
   rồi giấu CSS, cũng không dùng hai nhánh loại trừ làm remount stateful controls. Một grid/layout
   riêng của Dashboard được phép thay `TwoPane` tại đúng trang này; không sửa contract `TwoPane`
   dùng chung.
2. Thứ tự DOM duy nhất: header → subject progress → weekly overview → English details → actions.
   Desktop có thể đặt weekly/actions ở rail bằng CSS grid areas, nhưng thứ tự Tab vẫn đi theo DOM
   và không trái nghĩa với thứ tự đọc.
3. QuickActions chỉ có một instance. Nếu dialog đang mở rồi resize qua 1024px, dialog và focus trap
   giữ nguyên; đóng trả focus về đúng nút đã mở.
4. Calendar chỉ có một instance. `selectedDate` thuộc stable owner và giữ nguyên khi số tuần đổi
   5↔13↔26; nếu ngày còn trong range, cell tương ứng giữ `aria-selected` và nhận lại focus. Nếu
   ngày rời range, clamp theo thời gian: trước range → ngày đầu range, sau range → ngày cuối range;
   thông báo detail mới qua live region.
   R3-2 bổ sung contract controlled `selectedDate` + `onSelectedDateChange` (tên tương đương được
   phép) cho `ActivityCalendarCard`; Dashboard là owner, còn chế độ uncontrolled hiện hành phải
   giữ làm default tương thích ngược cho test/call site cũ.
5. Khi cell đang focus bị thay thế ở breakpoint, focus được chuyển có chủ đích sau commit sang cell
   cùng ngày/fallback; resize khi focus ở nơi khác không được cưỡng focus vào calendar.
6. Roving tabindex vẫn đúng một điểm Tab; Arrow/Home/End, header/cell alignment, scroll nội bộ và
   44px mobile từ UX-R1 không hồi quy. Không handler Tab tùy biến và không tràn document.
7. Calendar detail có state explicit `calendarExpanded`, khởi tạo `false` ở **mọi viewport**.
   Button `Xem lịch hoạt động`/`Ẩn lịch hoạt động` điều khiển một panel stable id dùng HTML
   `hidden`; lựa chọn của user sống qua resize nhưng không persist sau reload. Breakpoint không
   bao giờ tự mở/đóng, vì vậy desktop vẫn mở bằng đúng một click và không có adaptive focus race.
8. Trước khi đặt `hidden=true`, nếu `document.activeElement` nằm trong calendar panel thì chuyển
   focus về calendar toggle; nếu focus ở ngoài panel thì không steal. Không bao giờ giấu một panel
   đang chứa focus mà chưa transfer. Resize 1023↔1024 và 1279↔1280 không đổi expanded state.

## 6. Hierarchy và component boundaries

### 6.1 Composition

`Dashboard.tsx` chỉ làm orchestration: auth/lang/sync, keyed resources, dữ liệu local, layout và
props. Các vùng sau là boundary độc lập để test mà không dựng toàn trang:

| Boundary                  | Trách nhiệm                                                       | Không được làm                                      |
| ------------------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| `DashboardWeeklyOverview` | streak, mục tiêu, scope English, một câu narrative, lịch + detail | Không fetch, không tạo authoritative progress       |
| `DashboardEnglishDetails` | summary compact + disclosure + các khối English hiện có           | Không đổi phép tính/route hoặc tự mặc định evidence |
| `SubjectProgressSection`  | Giữ bốn state tiến độ đa môn hiện hành                            | Không nhận CEFR/quota state từ Dashboard            |
| `ActivityCalendarCard`    | Grid/calendar keyboard và selected date có kiểm soát              | Không sở hữu breakpoint/layout toàn trang           |
| `QuickActions`            | Giữ push/share/path behavior hiện hành                            | Không render hai instance responsive                |

Tên file cuối có thể giữ tiếng Anh như trên hoặc tên tương đương theo convention; boundary và
ownership không được nhập ngược lại thành một `Dashboard.tsx` lớn hơn.

### 6.2 “Tuần này” là một story duy nhất

- Thay ba vùng rời streak + mục tiêu tuần + lịch bằng một semantic section có heading
  `Tuần này`; không bọc ba card con có nền/viền riêng.
- Ngay dưới heading phải có scope label rõ **`Hoạt động Tiếng Anh đã ghi nhận`**. Số streak,
  mục tiêu, activity và narrative hiện hành đều đến từ storage English; không được trình bày như
  tiến độ mọi môn. Fixture chỉ có evidence Lập trình phải thấy copy
  `Chưa có hoạt động Tiếng Anh được ghi nhận tuần này`, không được nhận credit English và không
  đổi thuật toán để cộng activity Lập trình.
- Hàng tóm tắt gồm số ngày đã học/mục tiêu và tổng hoạt động 7 ngày. Narrative tối đa một câu từ
  `weeklyLine` deterministic hiện hành, nằm ngay dưới số; không thêm carousel, AI copy hay khối
  `ProgressStory`.
- Calendar là chi tiết của cùng section và **đóng mặc định ở mọi width** theo §5.7. Panel luôn có
  stable id/IDREF; hidden descendants không ở tab/accessibility tree; user choice sống qua resize.
- CTA `Đổi mục tiêu ở Hồ sơ` giữ route, vùng chạm và tên truy cập; không cạnh tranh như CTA chính.

### 6.3 English progressive disclosure

- Sau subject progress và weekly overview là một summary `Chi tiết Tiếng Anh`: số từ cần ôn, một
  chỉ dấu lộ trình nếu đã ready, và trạng thái lượt AI; dữ liệu chưa đo/tải/lỗi phải nói bằng chữ.
  Heading `#dashboard-weekly-credit-heading` thuộc summary **luôn visible**, không nằm trong panel
  English hidden, và nhận `tabIndex={-1}` để làm recovery target không thêm điểm Tab thường.
- Panel chi tiết chứa các khối English hiện hành: Hôm nay, Từ vựng, Sổ lỗi, CEFR, IELTS và Tổng
  kết. Không xóa destination hay phép tính; được loại bỏ số/card lặp đã có trong summary.
- Panel **đóng mặc định ở 320/390/1440** để đạt hierarchy và height target; button ≥44px
  `Xem chi tiết Tiếng Anh` có `aria-expanded`, `aria-controls`. Mở đổi thành `Ẩn chi tiết Tiếng
Anh`; một panel stable DOM dùng HTML `hidden`, không mount lại mỗi lần.
- Lựa chọn mở/đóng sống qua resize trong đời component nhưng không ghi localStorage. Trước mọi
  transition làm panel `hidden`, chỉ chuyển focus về disclosure button nếu active element đang ở
  trong panel; focus ở ngoài không bị steal. Không auto-open/close vì breakpoint, lỗi hoặc vì
  Tiếng Anh có dữ liệu.
- Intro hiện đặt trước `PageHeader` bị bỏ; giải thích phạm vi English nằm trong summary này. Không
  làm người chỉ học Lập trình hiểu rằng toàn trang là English.

## 7. Five states và nội dung

| State               | Hành vi bắt buộc                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| Initial/empty       | Multi-subject empty giữ “Chưa đo được”; English không có dữ liệu dùng chữ, không 0 giả; disclosure vẫn mở được  |
| Loading             | Weekly credit và CEFR có reserve/skeleton riêng, không khóa toàn page; CLS <0,1                                 |
| Data loaded         | Hierarchy §6, số hiện hành và đúng một weekly narrative                                                         |
| Error/offline       | Từng resource lỗi độc lập, có Retry thật; phần local còn dùng được; không exception thô                         |
| Validation/feedback | QuickActions giữ error/storage/push feedback đã có, chừa chỗ, focus và Retry; UX-R3 không thêm toast thành công |

## 8. File touch sets theo source slice

Mỗi worker phải chạy `npm run codemap -- impact <file>` trước khi sửa hotspot và ghi kết quả thật
vào PR. Test/changelog/evidence được thêm cạnh scope; lockfile, migration và generated artifacts
không thuộc bất kỳ slice nào.

### R3-1 — Async truth and retry

- Sửa: `apps/dhcb/src/pages/core/Dashboard.tsx`, `apps/dhcb/src/lib/weeklyCredit.ts`,
  `apps/dhcb/src/lib/curriculum.ts`, `apps/dhcb/src/data/dictionary/loader.ts`,
  `apps/dhcb/src/data/curriculumLoader.ts`, `apps/dhcb/src/data/cefrLoader.ts`.
- Thêm/sửa test cạnh cả sáu file: Zod/null/0 quota; keyed race/focus; coalesce/identity-reset/
  `response.ok`; integration fake-fetch lần lượt dictionary/foundation/CEFR fail→retry success.
- Chỉ làm §4; chưa đổi hierarchy/spacing ngoài reserve cần cho state.

### R3-2 — Stable responsive state/focus/calendar

- Sửa: `Dashboard.tsx`, `ActivityCalendarCard.tsx`, test cạnh hai file và E2E calendar.
- Có thể thêm một component/layout cục bộ Dashboard; không sửa `packages/core-ui/TwoPane.tsx`.
- Chỉ làm §5 và một QuickActions instance; bổ sung controlled/uncontrolled calendar props và
  explicit disclosure state, chưa gộp nội dung tuần/English.

### R3-3 — Hierarchy and consolidated weekly

- Sửa: `Dashboard.tsx`, `ActivityCalendarCard.tsx`; thêm `DashboardWeeklyOverview.tsx` + test
  (hoặc tên tương đương), sửa test calendar.
- R3-3 thêm prop backward-compatible `presentation?: 'standalone' | 'embedded'` cho
  `ActivityCalendarCard` (mặc định `standalone`). `embedded` chỉ render calendar grid/detail,
  không render surface/viền/nền/heading riêng; `DashboardWeeklyOverview` sở hữu section/heading và
  disclosure panel. Test chứng minh standalone không đổi, embedded không sinh card/heading lồng
  nhưng giữ aria-label, roving tabindex và live detail.
- Gộp streak/goal/calendar thành §6.2, bỏ intro sai vị trí, không thêm `ProgressStory`.
- P2-10 được đánh dấu superseded trong docs/changelog; không tạo file source P2-10.

### R3-4 — English progressive disclosure

- Sửa: `Dashboard.tsx`; thêm `DashboardEnglishDetails.tsx` + test (hoặc tên tương đương), E2E
  clarity/evidence.
- Làm §6.3, target chiều cao cuối và toàn bộ ma trận 28 case.

Touch set được serialize: không cho hai agent sửa `Dashboard.tsx` đồng thời. R3-(n+1) chỉ branch từ
`main` sau khi R3-n merge và phải reconcile spec với main trước khi code.

## 9. Acceptance criteria

- [ ] **AC-1 — async truth:** weekly credit và CEFR có keyed `loading|ready|error`; `null`/invalid
      là error, quota 0 là ready; lỗi không treo loading/làm trắng page, có Retry và không hiện
      stale data khác user/key.
- [ ] **AC-2 — rejected cache:** test đỏ trên code cũ và xanh sau sửa chứng minh cả bốn promise
      cache coalesce/reset có identity guard; 12 fetch kiểm `response.ok`; fake-fetch từng nhóm
      dictionary/foundation/CEFR fail rồi Retry dùng promise/request mới và resolve.
- [ ] **AC-3 — retry/focus:** mỗi click Retry tạo đúng một attempt; double click/loading không tạo
      request trùng; response cũ không overwrite response mới. Chỉ khi Retry vẫn active lúc nó
      biến mất mới focus resource heading đúng ID. Test riêng: weekly Retry khi English panel đóng;
      CEFR Retry→đóng panel→success giữ English toggle; CEFR success khi panel mở tới CEFR heading;
      focus đã đi nơi khác không bị steal.
- [ ] **AC-4 — single stable tree:** QuickActions, weekly và calendar mỗi loại đúng một instance ở
      320/390/1440; resize không remount/mất dialog/disclosure/selected date.
- [ ] **AC-5 — calendar:** roving tabindex, Arrow/Home/End, `aria-selected`, live detail, scroll
      nội bộ, 44px mobile, explicit collapsed state, focus transfer khi hide và fallback date qua
      5/13/26 tuần tại breakpoint 1024/1280 đạt §5.
- [ ] **AC-6 — hierarchy:** DOM và heading outline theo đúng §6.1; `PageHeader` đứng trước intro;
      người chỉ có evidence Lập trình không gặp copy mặc định toàn trang là Tiếng Anh.
- [ ] **AC-7 — weekly consolidation:** đúng một heading `Tuần này`, đúng một narrative
      deterministic và scope label English; programming-only không nhận credit English; không
      `ProgressStory`/`buildProgressStory`; embedded calendar không tạo card/heading lồng.
- [ ] **AC-8 — English disclosure:** panel đóng mặc định ở cả ba width, stable id + HTML `hidden`,
      0 descendant focusable/a11y khi đóng; mở giữ toàn destination và số liệu hiện hành.
- [ ] **AC-9 — focus disclosure:** open/close, resize và async transition không làm focus rơi về
      `body`, không trap/cycle Tab, không handler Tab tùy biến; IDREF axe sạch.
- [ ] **AC-10 — height/overflow:** canonical loaded/collapsed đạt ≤2.300/2.100/1.450px tại
      320/390/1440; `scrollWidth === innerWidth` ở mọi case.
- [ ] **AC-11 — CLS:** `PerformanceObserver` cài trước render, cộng layout-shift không recent input;
      recovery fixture chỉ resolve sau ≥600ms thời gian đơn điệu thực từ input cuối, rồi hai RAF
      và `takeRecords()` flush trước khi đọc. Mỗi case loading/error/retry→ready **<0,1**. Thiếu
      API là fail, không skip/fallback.
- [ ] **AC-12 — accessibility:** AA/AAA, heading/landmark, 44px, keyboard, reduced motion và ba
      theme xanh; không baseline/waiver.
- [ ] **AC-13 — regressions:** SubjectProgress “Chưa đo được”, QuickActions push/storage, route,
      quota formula, CEFR/IELTS/SRS/streak/calendar và persistent navigation giữ nguyên.
- [ ] **AC-14 — code/design guard:** 0 `transition-all` trong mọi runtime file UX-R3 chạm; mọi
      animation/transform có `motion-reduce`; không màu hex/card lồng/card/glow mới.
- [ ] **AC-15 — quality:** Node 22: build, typecheck, lint 0 warning, format, full unit, budget,
      targeted E2E và full E2E xanh; không dependency/schema/migration/API change.

## 10. Canonical fixture và 28 evidence cases

Fixture `ux-r3-member-v1` kế thừa shell khóa của UX-R2: member cố định, plan Free, locale `vi`,
timezone `Asia/Ho_Chi_Minh`, clock cố định, không banner/update/offline overlay, local data và mọi
API route bằng fixture; request ngoài fixture bị abort và làm test fail. Chờ font/image decode,
resource state settle và hai RAF thật; screenshot inject reduced motion nhưng test keyboard không
tắt focus.

### CLS settle protocol

- Cài `PerformanceObserver({ type: 'layout-shift', buffered: true })` bằng init script trước
  navigation/render; chỉ cộng entry `!hadRecentInput`. `performance.now()` không bị stub và là
  nguồn thời gian đơn điệu duy nhất cho delay.
- Fixture recovery ghi timestamp của input cuối (open/Retry) theo `performance.now()` và chỉ
  resolve promise khi đã qua **ít nhất 600ms thực**. Không fake timer, `Date`, RAF hoặc tự sửa
  `hadRecentInput`; mục đích là để layout shift do recovery nằm ngoài cửa sổ input 500ms.
- Sau DOM settled, chờ hai RAF thật, xử lý cả callback đã nhận và `observer.takeRecords()` bằng
  cùng filter trước khi disconnect/đọc tổng. Observer thiếu support hoặc còn record chưa flush làm
  test fail rõ ràng.

Đúng **28 case** được ghi vào `manifest-after.json` và attach qua `testInfo.attach()`:

| Case                       | Width/theme                        | Số case | Điều chứng minh                                                                                                      |
| -------------------------- | ---------------------------------- | ------: | -------------------------------------------------------------------------------------------------------------------- |
| canonical loaded/collapsed | 320, 390, 1440 × 3 theme           |       9 | cả English/calendar đóng; height/overflow/hierarchy                                                                  |
| English expanded           | 390 × 3 theme                      |       3 | full destinations/focus                                                                                              |
| weekly unavailable/null    | 390 × 3 theme × 2 mode             |       6 | chụp loading reserve → null/error → Retry, chờ ≥600ms → ready; CLS/focus                                             |
| CEFR delayed recovery      | 390 × 3 theme                      |       3 | mở English, chụp loading; chờ ≥600ms từ input cuối rồi release→ready                                                 |
| CEFR error recovery        | 390 × 3 theme                      |       3 | mở English, chụp error; Retry, chờ ≥600ms rồi release→ready                                                          |
| programming-only           | 390 × 3 theme                      |       3 | scope/copy English; không credit sai                                                                                 |
| live responsive calendar   | 1023→1024→1279→1280→390, dark-blue |       1 | mở calendar một lần; chọn ngày >5 tuần trước; giữ state qua hai breakpoint; về 390 clamp ngày đầu range + focus đúng |
| **Tổng**                   |                                    |  **28** |                                                                                                                      |

Mỗi case ghi: commit, fixtureVersion/hash, state, theme, viewport, pageHeight, scrollWidth, CLS,
heading outline, số weekly narrative, số instance weekly/calendar/QuickActions, English expanded,
calendar expanded, selected calendar date, active element và SHA-256 ảnh. CEFR loading/error luôn
được quan sát khi English panel đang mở; delayed promise phải settle thành ready trong cùng case.
Mỗi trong sáu weekly unavailable case phải assert và attach tuần tự loading reserve, unavailable,
ready-after-Retry; không được chỉ chụp error cuối. Interaction Retry→ready assert request count,
state và focus; mọi release tuân ≥600ms + observer flush ở trên.
Case responsive bắt đầu 1023px, mở calendar một lần và chọn một ngày gần còn ở mọi range; resize
1024→1279→1280 phải giữ expanded/date/focus. Tại 1280px chọn tiếp ngày cách hiện tại >5 tuần, rồi
resize về 390px: ngày đó rời range nên clamp về ngày đầu range 5 tuần, cập nhật live detail và chỉ
giữ/chuyển focus calendar khi focus trước resize thực sự nằm trong calendar.

BEFORE chạy cùng harness tại base `5d81c6c8`, tối thiểu canonical 9 case, lưu ngoài repo và ghi
numeric/hash vào PR. AFTER 28 case là CI artifact; PNG không commit.

## 11. Test plan và gates

### Unit/component

- `Dashboard.test.tsx`: keyed resource race, user/plan/sync đổi, null/invalid/zero quota,
  loading/error/retry/success, weekly Retry khi detail đóng, CEFR Retry→đóng→success, CEFR success
  khi mở và no-steal, Free/VIP, hierarchy và một instance.
- `weeklyCredit.test.ts`: Zod valid/invalid, response null/non-ok, credit null, credit 0.
- `curriculum.test.ts` + ba loader test: coalesce pending, `response.ok`, reject reset, identity
  guard, retry resolve; integration fake-fetch lỗi từng resource.
- `ActivityCalendarCard.test.tsx`: controlled selection/focus qua 5/13/26 tuần và fallback range.
- `DashboardWeeklyOverview.test.tsx`: một heading/narrative, scope English, programming-only,
  explicit calendar disclosure/focus; embedded calendar không lồng card/heading.
- `DashboardEnglishDetails.test.tsx`: stable hidden panel, focus, all destinations, five states.
- Regression hiện có: `SubjectProgressSection`, `QuickActions`, `calendar-keyboard`, a11y/reduced
  motion, English tools context.

### Gate commands

```bash
npm run codemap -- impact apps/dhcb/src/pages/core/Dashboard.tsx
npm run codemap -- impact apps/dhcb/src/lib/curriculum.ts
npm run codemap -- impact apps/dhcb/src/lib/weeklyCredit.ts
npm run codemap -- impact apps/dhcb/src/data/dictionary/loader.ts
npm run codemap -- impact apps/dhcb/src/data/curriculumLoader.ts
npm run codemap -- impact apps/dhcb/src/data/cefrLoader.ts
npm run codemap -- impact apps/dhcb/src/components/ActivityCalendarCard.tsx
npm run build
npm run typecheck
npm run lint
npm run format:check
npm test
npm run budget
# targeted UX-R3 + calendar + a11y E2E
npm run test:e2e
git diff --check
```

Mỗi source PR chạy gate liên quan và kết thúc bằng complete gate theo `AGENTS.md`; R3-4 bắt buộc
full 28-case evidence và full E2E.

## 12. Dependency order và work packages

```text
R3-1 async truth/retry
        ↓
R3-2 stable responsive state/focus/calendar
        ↓
R3-3 hierarchy + consolidated “Tuần này”
        ↓
R3-4 English progressive disclosure + final evidence
```

Mỗi package atomic, một PR, một worker có exclusive write set. Reviewer độc lập đọc spec, diff và
test result; agent chính review mọi diff và chạy gate. Không parallelize bốn package vì cùng chạm
`Dashboard.tsx` và contract state/layout của package sau phụ thuộc package trước.

## 13. Traceability

| Requirement                     | Source boundary                                  | Test/evidence                           |
| ------------------------------- | ------------------------------------------------ | --------------------------------------- |
| Async truth/retry/cache         | Dashboard + weekly/curriculum/3 resource loaders | AC-1–3, Zod + fake-fetch rejection/race |
| Responsive state/focus/calendar | Dashboard layout + ActivityCalendarCard          | AC-4–5, resize case 28                  |
| Hierarchy/weekly narrative      | DashboardWeeklyOverview                          | AC-6–7, canonical 9 cases               |
| English disclosure              | DashboardEnglishDetails                          | AC-8–9, expanded 3 cases                |
| Height/CLS/a11y                 | all UX-R3 boundaries                             | AC-10–15, manifest 28 cases             |

## 14. Security, privacy, compatibility và operations

- Không gọi provider trả phí, production DB/Redis/R2/email/payment webhook hoặc secrets trong test.
- Không log payload quota/user data; exception chỉ chuyển thành trạng thái UI tổng quát.
- Không thay localStorage key, API request/response, route/deep link hoặc dữ liệu persisted.
- Rollout additive UI-only, không flag/migration. Merge từng PR chỉ khi required `quality` và E2E
  xanh; không deploy trong scope này.
- Rollback từng slice bằng revert PR theo thứ tự ngược R3-4→R3-1. Không có data rollback/recovery
  query. Nếu revert R3-1 thì phải revert mọi slice phụ thuộc sau nó.

## 15. Risks và escalation

| Risk                                | Mức      | Mitigation / stop condition                                                      |
| ----------------------------------- | -------- | -------------------------------------------------------------------------------- |
| Retry vẫn dùng rejected promise     | Critical | Unit chứng minh promise mới; không merge nếu chưa đỏ-trước/xanh-sau              |
| Null/invalid quota bị hiểu là ready | Critical | Zod + explicit unavailable; regression riêng cho quota 0 hợp lệ                  |
| CSS grid làm DOM/visual focus lệch  | Critical | DOM order cố định + keyboard/resize E2E; trả spec review nếu không đồng thời đạt |
| Thu gọn che lỗi/quota thật          | Critical | Summary luôn hiện state; error không nằm riêng trong hidden panel                |
| “Tuần này” bị hiểu là đa môn        | Major    | Scope label English + fixture programming-only                                   |
| Target height xung đột 44px/AAA     | Major    | Không nới a11y; dừng và xin điều chỉnh target/scope                              |
| Component extraction đổi công thức  | Major    | Typed props + golden regression số/destination trước khi di chuyển               |
| Full English panel quá dài khi mở   | Minor    | Expanded không chịu collapsed height target; vẫn cấm overflow ngang              |

Escalate về review, không tự đổi architecture, nếu cần sửa API/schema/shared `TwoPane`, thêm
dependency, persist disclosure, thay thuật toán số liệu hoặc không đạt đồng thời height và a11y.

## 16. Decision record và phê duyệt

| ID  | Quyết định                                                                               | Trạng thái                |
| --- | ---------------------------------------------------------------------------------------- | ------------------------- |
| D1  | Phương án A: không có `ProgressStory`; narrative gộp vào “Tuần này”                      | **Đã chốt bởi chủ dự án** |
| D2  | Bốn source slice tuần tự R3-1→R3-4                                                       | **Approved**              |
| D3  | Keyed async state + rejected cache retry                                                 | **Approved**              |
| D4  | Một DOM tree/stateful instance qua breakpoint                                            | **Approved**              |
| D5  | English details đóng mặc định ở mọi width                                                | **Approved**              |
| D6  | Evidence 28 case và target 2.300/2.100/1.450px                                           | **Approved**              |
| D7  | Calendar đóng mặc định mọi width; chỉ user toggle, state sống resize                     | **Approved**              |
| D8  | Weekly activity được gắn scope English, không giả đa môn                                 | **Approved**              |
| D9  | Recovery focus chọn weekly heading/CEFR heading/English toggle theo visibility; no-steal | **Approved**              |
| D10 | CLS recovery release ≥600ms monotonic sau input và flush observer records                | **Approved**              |

- [x] Product đã chọn A và supersede P2-10 độc lập
- [x] Product outcome/scope/English disclosure được duyệt
- [x] UX/accessibility/responsive/focus contract được duyệt
- [x] Architecture/async/cache/component boundaries được duyệt
- [x] Test/evidence/rollout/rollback được duyệt
- [x] Independent adversarial review PASS — vòng 3: 0 critical · 0 major · 0 minor

**Kết luận:** **Approved for implementation — toàn UX-R3, thi hành tuần tự R3-1→R3-4 sau khi
PR đặc tả này merge.**
