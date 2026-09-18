# Feature spec: Trang chủ rõ việc chính bằng progressive disclosure

| Thuộc tính    | Giá trị                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| Slice         | UX-R2 — Home progressive disclosure                                          |
| Spec cha      | [`2026-09-18-ui-clarity-foundation.md`](2026-09-18-ui-clarity-foundation.md) |
| Base          | `main@806e77c0` — PR #1020 đã merge                                          |
| Spec owner    | Agent chính Đồng Hành                                                        |
| Trạng thái    | **Approved for implementation — chỉ UX-R2**                                  |
| Người duyệt   | Chủ dự án theo mandate giao subagent từng PR; independent reviewer PASS      |
| Ngày cập nhật | 2026-09-18                                                                   |

> File này là hợp đồng cho worker sau khi spec PR merge. Không sửa source trước khi bản Approved
> này vào `main`.
> UX-R2 giảm số quyết định phải xử lý cùng lúc trên mobile; không xóa chức năng và không biến
> Trang chủ thành một trang mới.

## 0. Một câu

Giúp người học ở màn 320/390px thấy rõ thứ tự **Bạn Đồng Hành → Hôm nay → Hỏi nhanh**, còn gợi ý,
mô tả dài và lối tắt phụ chỉ mở khi cần; desktop 1440px giữ đầy đủ chức năng hiện hành.

## 1. Bối cảnh và bằng chứng

- Ảnh baseline tại `main@2c9025a6` (source Home không đổi trong UX-R1) cho thấy Trang chủ thành
  viên cao **2.027px ở 390px** và **1.395px ở 1440px**. Manifest ngoài repo:
  `%TEMP%/dhcb-ui-audit-member/before/manifest.json`.
- Ở mobile loaded state, năm prompt chip luôn xuất hiện ngay dưới ô Hỏi nhanh; ba môn đầu hiển
  thị mô tả/trạng thái/lối tắt; khối Sự nghiệp hiển thị mô tả và bốn lối tắt. Những control phụ
  có trọng lượng gần bằng CTA Hôm nay.
- Có hai lối vào `/tien-do` trên cùng Trang chủ: `HomeAiBriefingCard` và nút Tiến độ ở
  `progressHistory`. Đây là thông tin lặp, không phải hai hành động khác nhau.
- UX-R1 đã merge trong PR #1020: vùng chạm và failure state của `/tien-do` đã đủ nền tin cậy để
  UX-R2 chỉ tập trung vào hierarchy và tải nhận thức của `/`.
- Adversarial review vòng 1: **BLOCK — 2 critical · 7 major · 2 minor**. Bản sửa này đóng các
  finding về phạm vi đếm navigation, lifecycle toggle/focus, fixture pixel, resize, nội dung
  Companion, motion, touch target, artifact CI và network-negative control; trạng thái vẫn là
  Review pending cho tới re-review độc lập.
- Re-review vòng 2: **BLOCK — 2 critical · 4 major · 1 minor**. Bản sửa tiếp theo chốt DOM tự
  nhiên của subject toggle, evidence option B, responsive state của danh sách môn, shell fixture,
  Date/RAF, phép đo CLS và tách error khỏi validation; tiếp tục chờ re-review.
- Re-review vòng 3: **BLOCK — 1 critical · 1 major**. Bản sửa này chốt controlled container luôn
  mounted với HTML `hidden`, IDREF hợp lệ và chuyển focus chủ đích khi prompt toggle unmount lúc
  resize lên desktop; trạng thái vẫn Review pending.
- Independent final review: **PASS — 0 critical · 0 major · 0 minor**. Không còn product blocker;
  hợp đồng đủ điều kiện giao worker sau khi spec merge.

## 2. Outcome, metric và guardrails

### Outcome

Ở 320/390px, người học phân biệt được một việc chính hôm nay với các lựa chọn phụ, đồng thời vẫn
mở được mọi đích hiện hành qua một hành động disclosure hoặc qua trang hub tương ứng.

### Metric kỹ thuật của slice

| Phép đo                                               | Baseline hiện hành                     | Target UX-R2                                                          |
| ----------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------- |
| Chiều cao Trang chủ member/data ở 390px               | 2.027px                                | **≤ 1.700px**                                                         |
| Chiều cao Trang chủ member/data ở 320px               | Chưa có số canonical                   | **≤ 1.850px**, không tràn ngang                                       |
| Prompt chip focusable trước khi người dùng disclosure | 5                                      | **0 chip**; chỉ một nút `Xem 5 gợi ý nhanh`                           |
| Lối vào `/tien-do` trong `<main>` do Home sở hữu      | 2                                      | **đúng 1**; không tính nav/sidebar cố định                            |
| Control phụ môn/Sự nghiệp ở mobile, loaded non-empty  | Lối tắt render sẵn                     | **0 lối tắt phụ render sẵn**; 3 môn + 1 không gian là bốn entry chính |
| Desktop 1440                                          | 5 chip, mô tả, trạng thái và shortcuts | Giữ đủ chức năng/đích trừ duplicate Tiến độ bị bỏ; cao **≤ 1.459px**  |

Các số chiều cao là cổng chống phình lại, không phải metric sản phẩm. Không suy activation,
retention hay chất lượng học từ chiều cao trang.

### Guardrails

- Ba theme hiện hành: `dark-blue`, `blue-sky`, `kid`.
- Nội dung/tiêu đề đạt WCAG AAA; control/icon đạt AA; vùng chạm mobile tối thiểu 44×44px.
- Không đổi route, API, auth, quota, billing, entitlement, mastery, schema hoặc dữ liệu có thẩm
  quyền; không thêm dependency, telemetry hoặc provider call.
- Không mặc định Tiếng Anh; không đưa band/CEFR/phần trăm năng lực lên Trang chủ.
- Xóa **mọi** `transition-all` trong bốn file runtime được chạm, thay bằng thuộc tính cụ thể;
  mọi `animate-*`, `translate-*` và `scale-*` trong chính bốn file có nhánh `motion-reduce`.
  Focus ring hiện tức thì, không nằm trong transition.

## 3. Phạm vi

### LÀM — đúng bốn file runtime

| Việc | File                                                   | Hợp đồng thay đổi                                                                                  |
| ---- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Sửa  | `apps/dhcb/src/pages/core/Home.tsx`                    | Giữ thứ tự Companion → Today → Hỏi nhanh; truyền `isDesktop`; compact Sự nghiệp; một entry Tiến độ |
| Sửa  | `apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx` | Nhận `isDesktop`; compact mobile chính xác; bỏ entry Tiến độ trùng, giữ fact/briefing/comeback     |
| Sửa  | `apps/dhcb/src/components/Home/HomeUniversalAiBar.tsx` | Nhận `isDesktop`; một DOM chip, collapsed mobile, mở/đóng có ngữ nghĩa và ổn định qua resize       |
| Sửa  | `apps/dhcb/src/components/Home/SubjectSpaceList.tsx`   | Môn compact trên mobile; desktop giữ mô tả/trạng thái/shortcut; empty CTA `Thử 5 phút` luôn giữ    |

Test được phép thêm/sửa cạnh bốn file và trong `e2e/`; đó là bằng chứng, không phải mở rộng runtime
scope. Trước khi sửa source, worker phải chạy `npm run codemap -- impact` cho cả bốn file và ghi
kết quả thực vào PR.

### KHÔNG LÀM

- Không đổi `TodayCard`, `TodayPlan`, resolver, analytics event hoặc logic chọn việc.
- Không làm UX-R3 (`/tien-do` progressive disclosure), UX-R4 (taxonomy/header/navigation).
- Không làm P2-10 `ProgressStory`, P2-11 Companion inline hoặc P2-12 demo/chip động; năm prompt
  hiện tại chỉ được disclosure, không đổi sang AI-generated chips.
- Không đổi `GuestHome`; baseline/AC của slice này áp cho member Home.
- Không sửa `WeekRhythm`, banner, `Layout`, `TwoPane`, bottom nav, token/theme hoặc route.
- Không tạo `DESIGN.md`, không thêm card lồng card, gradient/glow trang trí hay style system thứ hai.

## 4. Hợp đồng trải nghiệm đã chốt

### 4.1 Hierarchy Companion và Hôm nay

1. Thứ tự DOM giữ: `FirstTaskCard` nếu có → Companion → `TodayCard` → `WeekRhythm` nếu có → Hỏi
   nhanh. `TodayCard` tiếp tục là khối hành động chính duy nhất.
2. Mobile Companion compact **chỉ bằng spacing/avatar**, không cắt nội dung chính: hiện tên,
   greeting, toàn bộ `summary` thật/fallback và daily fact. TTS vẫn đọc đúng toàn bộ `summary`.
   `insight` phụ chỉ hiện ở desktop.
3. Khi có comeback, `detail`, `reviewLabel`, `learnLabel` và dismiss hiện đầy đủ ở cả mobile;
   không `line-clamp`, truncate hoặc giấu sau disclosure. Dòng fact `Hôm nay đã học x/y từ` chỉ
   hiện theo luật `showDailyWords`; trường hợp khác giữ câu trung tính, không phát minh số đa môn.
4. Bỏ nút `Xem tiến độ` trong Companion. Entry Tiến độ duy nhất là control hiện hành trong
   `progressHistory`; desktop đặt ở rail, mobile đặt sau phần Bộ môn & không gian như hiện nay.
5. Loading reserve đúng khung mobile compact và desktop hiện hành để CLS ≤0,1; fetch lỗi dùng
   fallback deterministic. Ảnh/test bắt buộc có bốn biến thể normal, `insight`, comeback, loading.

### 4.2 Năm prompt chip

1. `Home` truyền `isDesktop` thật từ `useIsDesktopViewport` vào `HomeUniversalAiBar`. State
   `expanded` khởi tạo `false`; trạng thái hiệu lực duy nhất là `isDesktop || expanded`.
2. Chỉ có một panel chip trong DOM: `<div id="home-prompt-chips"
hidden={!effectiveVisible}>…5 chip…</div>`. Mobile 320/390 khởi tạo collapsed nên panel có
   `hidden`; không chip nào visible/focusable/ở accessibility tree. Ngay trước panel là button
   tối thiểu 44px `Xem 5 gợi ý nhanh`.
3. Mobile button có `aria-expanded` và `aria-controls="home-prompt-chips"`; bấm mở bỏ `hidden`,
   hiện đúng năm chip, giữ nguyên label/query/màu/hành vi `suggest()`. Khi mở, nhãn thành
   `Ẩn gợi ý nhanh`. Desktop không render prompt toggle; panel vẫn mounted và visible.
4. Focus sau mở ở lại disclosure button; Tab tiếp theo đi vào chip đầu. Khi đóng bằng bàn phím,
   focus trở về button và chip không còn trong tab order.
5. Resize live 390→1440→390 không reset `expanded`: đã mở thì quay lại mobile vẫn mở; chưa mở
   thì panel lại `hidden` và toggle mounted. Nếu resize mobile→desktop đúng lúc focus ở prompt
   toggle, component chuyển focus có chủ đích tới chip đầu **trước khi toggle unmount**; focus
   đang ở nơi khác thì không cưỡng ép. Test điều khiển `matchMedia` và phát event `change`.
6. Query, lỗi quá dài, voice listening, draft guest→account, suggestion panel và điều hướng giữ
   nguyên. Bấm prompt chip chỉ chạy phép chọn cục bộ: từ trạng thái network đã settle tới khi
   suggestion hiện, phát sinh **0 network request**, kể cả `/api/agent` hay provider khác.

### 4.3 Bộ môn và Sự nghiệp/Đời sống

1. Mobile loaded state có đúng ba môn đầu visible/accessible + toggle luôn mounted; mỗi môn mặc
   định chỉ hiện icon, tên và một dòng trạng thái ngắn. Mô tả dài và direct shortcut (`Lộ trình
CEFR`, `Luyện nói`, `Từ điển`) không render sẵn trên mobile; entry chính vẫn đưa tới hub.
2. Khi `primary.kind === 'pick'`, CTA `Thử 5 phút` của từng môn **bắt buộc giữ**, tối thiểu 44px.
   Progressive disclosure không được làm empty state mất đường bắt đầu.
3. Desktop 1440 giữ đủ mô tả, trạng thái và shortcut của môn như trước; thứ tự `orderSubjects`
   và logic môn đang học lên đầu không đổi.
4. Mobile Sự nghiệp/Khởi nghiệp/Đời sống chỉ hiện icon, tên và một dòng mô tả ngắn; bốn direct
   shortcut không render sẵn. Entry chính `/su-nghiep-khoi-nghiep` giữ nguyên và đạt 44px.
5. Desktop giữ đủ bốn direct shortcut và copy hiện hành. Không đổi destination hay gom route.
6. DOM mobile có thứ tự chính xác: `<ul>` đầu chứa entry 1–3 → toggle luôn mounted →
   `<ul id="home-subjects-revealed" hidden={!effectiveExpanded}>` chứa entry 4–6. Controlled
   `<ul>` luôn mounted khi toggle tồn tại, nên `aria-controls="home-subjects-revealed"` luôn là
   IDREF hợp lệ. Toggle có `aria-expanded`, nhãn `Xem tất cả (6 môn)` khi đóng và `Thu gọn danh
sách môn` khi mở.
7. Mở giữ focus ở toggle; lần Tab tự nhiên kế tiếp đi entry 4 → 5 → 6 → control sau danh sách do
   thứ tự DOM, **không** key trap, handler Tab, roving tabindex hoặc focus cycle tùy biến. Collapse
   đặt lại HTML `hidden` trên nhóm revealed và giữ focus ở toggle; descendants hidden biến khỏi
   accessibility tree và tab order nhưng không unmount.
8. `SubjectSpaceList` có state `expanded` khởi tạo `false`; `effectiveExpanded = isDesktop ||
expanded`. Desktop hiện đủ sáu entry và **không render toggle**. Lựa chọn mở trên mobile sống
   qua vòng resize 390→1440→390; nếu chưa mở thì quay lại mobile vẫn đóng. Không lưu storage.

### 4.4 Responsive contract và desktop guard

- `Home` là nguồn viewport duy nhất cho ba component cần phân nhánh: truyền `isDesktop` vào
  `HomeAiBriefingCard`, `HomeUniversalAiBar`, và giữ prop hiện có của `SubjectSpaceList`.
- Không component nào tự tạo bản DOM mobile + desktop song song. Resize phải cập nhật trực tiếp,
  không đòi reload và không để control ẩn còn trong accessibility tree/tab order.
- Desktop giữ đủ: năm prompt chip, sáu môn, mô tả/trạng thái, ba shortcut Tiếng Anh, bốn shortcut
  Sự nghiệp, WeekRhythm, banner, **một** `progressHistory` Tiến độ và control Lịch sử. Duplicate
  `Xem tiến độ` trong Companion là phần duy nhất cố ý bỏ ở mọi bề rộng.

## 5. Năm trạng thái bắt buộc

| Trạng thái          | Hành vi UX-R2                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Initial/empty       | Today `pick` giữ một CTA chính; mỗi môn còn `Thử 5 phút`; prompt collapsed nhưng mở được                           |
| Loading             | Companion và Today skeleton giữ nhịp compact, không CLS > 0,1; disclosure button vẫn dùng được                     |
| Data loaded         | Áp hierarchy/compact/count ở §2–§4; desktop đủ chức năng                                                           |
| Error/offline       | Companion dùng fallback; Today giữ error/retry; Hỏi nhanh giữ error tại chỗ; disclosure không che lỗi              |
| Validation feedback | Lỗi câu hỏi dài giữ `role="alert"`, chừa chỗ/không làm mất focus; chip vẫn chỉ gợi ý nơi học, không giả trả lời AI |

Không thêm toast thành công cho disclosure hoặc điều hướng đã thấy trực tiếp.

## 6. Acceptance criteria

- [ ] **AC-1 — hierarchy:** ở 320/390, DOM và ảnh thể hiện Companion trước Today; CTA chính của
      Today nằm trọn trong viewport đầu 844px (`y + height ≤ 844`) ở loaded non-comeback state.
- [ ] **AC-2 — page budget:** đo cùng canonical fixture/settle §7 trên base `806e77c0` trước khi
      sửa, rồi sau sửa. Member/data dark-blue có `documentElement.scrollHeight ≤ 1.850` tại
      320px và `≤ 1.700` tại 390px; `scrollWidth === innerWidth` ở cả hai.
- [ ] **AC-3 — không trùng Tiến độ trong content:** bên trong `<main>`/Home-owned content có đúng
      một control dẫn `/tien-do` ở 320/390/1440. Không tính persistent bottom nav/sidebar/header;
      test navigation riêng xác nhận chúng vẫn có đúng entry theo hợp đồng hiện hành.
- [ ] **AC-4 — prompt disclosure mobile:** trước mở có 0 chip focusable và một button
      `Xem 5 gợi ý nhanh`; sau mở có đúng 5 chip theo thứ tự hiện hành, `aria-expanded=true`;
      panel `#home-prompt-chips` luôn mounted, `hidden` đúng trạng thái; đóng trả focus và hidden
      descendants vắng khỏi tab order/accessibility tree. Axe không có lỗi IDREF. Resize live và
      focus transfer đúng §4.2; desktop không có prompt toggle.
- [ ] **AC-5 — prompt desktop:** 1440 có đúng 5 chip focusable ngay khi loaded, không có bước
      disclosure bắt buộc; mỗi chip giữ query/destination. Từ network-idle trước click tới panel
      suggestion hiện, request counter tăng đúng **0** cho mọi URL.
- [ ] **AC-6 — subject compact:** loaded non-empty ở mobile có đúng ba entry môn
      visible/accessible ban đầu, một toggle `Xem tất cả`, không shortcut visible; sau mở có sáu
      entry visible/accessible + toggle
      `Thu gọn danh sách môn`. DOM/focus/Tab tự nhiên/collapse đúng §4.3; không handler Tab tùy
      biến. `#home-subjects-revealed` luôn mounted khi toggle có mặt, dùng `hidden`, IDREF hợp lệ;
      hidden descendants không ở a11y/tab. Desktop đủ sáu môn, không toggle; resize giữ lựa chọn.
- [ ] **AC-7 — empty CTA:** với `primary.kind='pick'`, mọi môn đang render ở mobile đều có
      `Thử 5 phút` ≥44px; CTA đi đúng `entry.ctaPath`.
- [ ] **AC-8 — career compact:** mobile có một entry Sự nghiệp chính và 0 direct shortcut;
      desktop có entry chính + đúng bốn shortcut, giữ nguyên destination.
- [ ] **AC-9 — state coverage:** unit/component test phủ loading, loaded, empty, error/fallback
      và validation; comeback/TTS/draft/suggestion test hiện có xanh.
- [ ] **AC-10 — accessibility:** mọi control **được tạo hoặc thay đổi trong UX-R2** đạt ≥44×44px;
      thứ tự Tab/focus đúng; axe AA và content AAA xanh trên `/` ở ba theme, collapsed/expanded.
      Đồng thời chạy page-level touch/a11y gate hiện có. Nếu gate tìm control cũ ngoài bốn file
      dưới 44px, ghi dependency slice riêng; không nới/baseline/ẩn lỗi và không phình UX-R2.
- [ ] **AC-11 — desktop guard:** ảnh/test 1440 xác nhận còn năm chip, sáu môn, mô tả/trạng thái,
      3 shortcut Tiếng Anh, 4 shortcut Sự nghiệp, WeekRhythm, banner, đúng một Home-owned Tiến độ
      và Lịch sử; TTS/comeback giữ. Chỉ duplicate Companion progress bị bỏ; cao ≤1.459px.
- [ ] **AC-12 — quality gate:** Node 22 chạy xanh build, typecheck, lint, format check, unit,
      budget, targeted E2E và toàn bộ E2E; không thêm dependency và bundle không vượt hard cap.
- [ ] **AC-13 — motion/code guard:** `rg -n "transition-all"` trong đúng bốn runtime file trả 0;
      source/design test thất bại nếu `animate-*|translate-*|scale-*` trong bốn file thiếu
      `motion-reduce:*`. Focus ring không có transition.
- [ ] **AC-14 — Companion exact states:** ảnh + component test cho normal, insight, comeback và
      loading: mobile có greeting+summary+daily fact, không insight; desktop có insight; TTS đọc
      summary; comeback detail/actions nguyên vẹn.
- [ ] **AC-15 — CLS đo thật:** Chromium cài `PerformanceObserver` với options
      `{ type: 'layout-shift', buffered: true }` bằng init script **trước navigation/render**,
      cộng `entry.value` chỉ khi
      `!entry.hadRecentInput` từ loading tới loaded; tổng ≤0,1. Chromium phải hỗ trợ observer;
      thiếu support làm test fail, không skip/fallback hay tự suy từ screenshot.

## 7. Test và bằng chứng bắt buộc

### Unit/component

- `HomeAiBriefingCard.test.tsx`: prop `isDesktop`; normal/insight/comeback/loading; không progress
  link; summary/TTS/daily fact/fallback giữ.
- `HomeUniversalAiBar.test.tsx`: `expanded=false`; desktop-or-expanded; một panel stable-id luôn
  mounted + `hidden`; open/close/a11y/focus; resize live `matchMedia`, gồm toggle-focused
  mobile→desktop chuyển focus chip đầu và desktop→mobile expanded=false trả panel hidden/toggle
  mounted; năm query; validation/voice/draft/suggestion; click chip zero network.
- `SubjectSpaceList.test.tsx`: DOM mobile đúng list 1–3 → toggle → list stable-id 4–6 luôn mounted;
  HTML hidden/IDREF/axe; focus ở toggle; Tab tự nhiên 4→5→6→next; không trap; collapse giữ focus và
  hidden descendants khỏi a11y/tab; desktop-or-expanded; roundtrip; desktop không toggle; empty CTA.
- Home composition/targeted E2E: DOM order; một progress trong `<main>`; progressHistory + History;
  persistent navigation kiểm riêng, không cộng vào Home-owned count.
- Source guard cho bốn file: 0 `transition-all`; mọi animation/transform có motion-reduce.

### E2E targeted

Tạo hoặc mở rộng một spec Home clarity chạy trên member fixture:

1. 320×844 và 390×844: AC-1–AC-4, AC-6–AC-10, overflow và touch target changed controls.
2. 1440×900: AC-3, AC-5, AC-8, AC-11, kể cả progressHistory + History.
3. Ba theme `dark-blue`, `blue-sky`, `kid`: collapsed + expanded; axe AA/content AAA, gồm IDREF
   và hidden descendants vắng khỏi accessibility tree.
4. Bàn phím: prompt/subject hidden descendants không vào tab; subject theo DOM tự nhiên, không
   trap/cycle; resize live prompt khi toggle focused chuyển focus chip đầu trước unmount; resize
   khi focus nơi khác không đổi focus; desktop→mobile giữ `expanded` và hidden tương ứng.
5. Request listener được bật **sau settle**, trước click prompt chip; suggestion xuất hiện và
   listener ghi 0 request mới. Không chỉ grep `/api/agent`.
6. CLS observer cài trước navigation, đo loading→loaded và fail nếu API không tồn tại.

### Canonical fixture và settle protocol cho pixel/height gates

Mọi ảnh/số before và after phải dùng cùng script, cùng fixture; before checkout base `806e77c0`,
after checkout commit ứng viên. Không dùng lại ảnh `2c9025a6` để quyết pass/fail target.

Canonical `member-data`:

- tài khoản member cố định, locale `vi`, theme theo case, timezone `Asia/Ho_Chi_Minh`;
- `FirstTaskCard` ẩn; comeback tắt; banner phụ `null`; `WeekRhythm` có model cố định; Today có
  primary Lập trình + 0 secondary; briefing normal có summary cố định và không insight;
- shell toàn cục được khóa bằng dữ liệu chính xác: user `plan='free'`, `planExpiresAt=null` nên
  không `PlanExpiryBanner`; settings `promoUntil=null` nên không `PromoEndingBanner`; navigator
  online + outbox rỗng nên không `OfflineSyncIndicator`; service worker/update API được mock về
  trạng thái không có update nên không update prompt;
- localStorage/sessionStorage/cookie được seed cùng payload. Browser context đặt
  `timezoneId='Asia/Ho_Chi_Minh'`; init script stub cả `Date.now()` và constructor `new Date()`
  không tham số về một epoch cố định, còn `new Date(value)`/`Date.parse`/`Date.UTC` giữ native;
  **không** fake timer, `requestAnimationFrame` hoặc interval;
- mọi API Home route bằng fixture cục bộ, không production/provider; network ngoài fixture bị
  abort và làm test fail;
- font chờ `document.fonts.ready`; ảnh/icon decode xong; React loading/skeleton kết thúc; không
  toast; chờ network fixture settle rồi chờ **hai `requestAnimationFrame` thật** nối tiếp;
  `networkidle` chỉ dùng sau khi route mock đã lắp;
- inject reduced-motion, tắt caret/animation/transition cho screenshot; không tắt focus trong test
  keyboard; scroll về `(0,0)` trước đo.

Fixture phụ chỉ đổi đúng state được đặt tên; còn lại kế thừa canonical:

- `member-empty`: Today `primary.kind='pick'`.
- `member-error`: proactive briefing request reject; Today trả `state='error'` với Retry; query
  Hỏi nhanh rỗng, không validation error.
- `member-validation`: canonical data nhưng submit câu hỏi quá `MAX_QUESTION_LENGTH`, kiểm
  `role='alert'`; đây là state/test riêng, không trộn với `member-error`.
- `member-insight`: briefing success có đúng một insight cố định.
- `member-comeback`: comeback bật với ngày/review/learn copy cố định.

Script ghi `fixtureVersion` và hash JSON fixture vào manifest. CLS script cài
`PerformanceObserver` trước navigation/render, loại `hadRecentInput`, đo tới loaded/settled; môi
trường Chromium được kỳ vọng hỗ trợ, thiếu API làm test fail rõ ràng.

### Screenshot manifest

Chọn **evidence option B**; ảnh không commit PNG:

```text
BEFORE canonical local, base 806e77c0
  / member-data: 320, 390, 1440 × dark-blue, blue-sky, kid
AFTER attached by CI
  / member-data: 320, 390, 1440 × dark-blue, blue-sky, kid
  / member-empty: 390 × 3 theme
  / member-error: 390 × 3 theme
  / member-validation: 390 × 3 theme
  / member-insight: 390 + 1440 × 3 theme
  / member-comeback: 390 + 1440 × 3 theme
  / member-data-expanded-prompts: 390 × 3 theme
```

Hai manifest cùng schema: `commit`, `state`, `theme`, `width`, `pageHeightPx`, `scrollWidthPx`, số
progress entry trong `<main>`, số chip focusable, `fixtureVersion`, fixture hash và SHA-256 ảnh.

- **BEFORE:** worker checkout/build base `806e77c0`, chạy canonical script cục bộ, lưu ảnh/manifest
  ngoài repo và đưa **numeric + SHA-256** vào bảng PR. BEFORE manifest/hash là evidence local đã
  khai báo, **không** phải artifact CI và không yêu cầu CI dựng commit cũ.
- **AFTER:** Playwright trên commit ứng viên phải `testInfo.attach()` từng ảnh và
  `manifest-after.json`; GitHub Actions lưu artifact và PR dẫn artifact link.
- `%TEMP%` chỉ là working copy. PR có bảng before→after theo viewport/theme/state, hash BEFORE và
  hash/artifact AFTER; không dùng ảnh commit cũ làm after evidence.

### Lệnh gate

```bash
npm run codemap -- impact apps/dhcb/src/pages/core/Home.tsx
npm run codemap -- impact apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx
npm run codemap -- impact apps/dhcb/src/components/Home/HomeUniversalAiBar.tsx
npm run codemap -- impact apps/dhcb/src/components/Home/SubjectSpaceList.tsx
rg -n "transition-all" apps/dhcb/src/pages/core/Home.tsx apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx apps/dhcb/src/components/Home/HomeUniversalAiBar.tsx apps/dhcb/src/components/Home/SubjectSpaceList.tsx
npm run build
npm run typecheck
npm run lint
npm run format:check
npm test
npm run budget
# targeted Home clarity E2E
npm run test:e2e
git diff --check
```

## 8. Bất biến và rủi ro

| Bất biến/rủi ro                                         | Cổng canh hoặc giảm thiểu                                               |
| ------------------------------------------------------- | ----------------------------------------------------------------------- |
| Today vẫn đúng một CTA chính; resolver không đổi        | Today tests + DOM order E2E                                             |
| Không mất đường bắt đầu của người mới                   | Empty fixture + `Thử 5 phút` AC-7                                       |
| Shortcut phụ mobile bị ẩn nhưng hub vẫn là entry đầy đủ | Test `ctaPath`; không đổi route                                         |
| Resize mobile↔desktop không tạo hai bộ chip/focus ma    | Component test resize + E2E 390/1440                                    |
| Compact làm cắt mất nội dung comeback quan trọng        | Comeback fixture và screenshot riêng nếu phát sinh                      |
| Giảm chiều cao bằng target nhỏ/chữ quá nhỏ              | 44px, sàn typography, AA/AAA tuyệt đối                                  |
| Animation disclosure gây layout thrash                  | Chỉ opacity/transform/grid rows; reduced-motion; không `transition-all` |
| Pixel gate flaky vì dữ liệu/thời gian/font/network      | Canonical fixture + settle protocol + fixture hash                      |
| Navigation cố định làm sai số entry Tiến độ             | Đếm trong `<main>`; persistent nav có test độc lập                      |
| CSS/bundle tăng                                         | `npm run budget`; ưu tiên class/token sẵn có                            |

## 9. Rollout và rollback

- Additive UI-only, không migration/flag/data rewrite. Merge chỉ khi `quality` và toàn bộ shard
  `e2e` xanh.
- Sau merge, manual smoke member Home ở 320/390/1440 trên ba theme; không cần production secret
  hoặc provider trả phí.
- Rollback bằng revert riêng PR UX-R2. Vì không đổi storage/API/data contract, không cần recovery
  query hay data rollback.
- Nếu target chiều cao xung đột với 44px/AAA hoặc làm mất empty CTA/comeback, **không nới cổng
  accessibility**; giữ hành vi an toàn và trả spec về review để điều chỉnh target.

## 10. Traceability

| Requirement                              | Runtime file                         | Test/evidence            |
| ---------------------------------------- | ------------------------------------ | ------------------------ |
| Companion/Today hierarchy + one Progress | `Home.tsx`, `HomeAiBriefingCard.tsx` | AC-1, AC-3, screenshot   |
| 5 prompt chips collapsed mobile          | `HomeUniversalAiBar.tsx`             | AC-4, AC-5, keyboard E2E |
| Subject/career compact + empty CTA       | `SubjectSpaceList.tsx`, `Home.tsx`   | AC-6–AC-8                |
| Five states, WCAG, height/control budget | Cả bốn file                          | AC-2, AC-9–AC-12         |

## 11. Decision record và phê duyệt

| ID  | Quyết định đã chốt                                                                         | Lý do                                                                |
| --- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| D1  | Đếm đúng một `/tien-do` chỉ trong `<main>`/Home-owned content                              | Bottom nav/sidebar là persistent shell, không phải duplicate do Home |
| D2  | Bỏ Companion progress; giữ `progressHistory` + History                                     | Giữ navigation đầy đủ và hạ cạnh tranh với Today                     |
| D3  | Mobile DOM list 1–3 → toggle → revealed list 4–6 luôn mounted, đóng bằng HTML hidden       | IDREF luôn hợp lệ; Tab tự nhiên; không trap                          |
| D4  | Prompt/subject dùng desktop-or-expanded; mobile choice sống resize; desktop không toggle   | Một nguồn responsive, không focus ma                                 |
| D5  | Mobile Companion giữ greeting+summary+daily fact; insight desktop-only; comeback đầy đủ    | Compact bằng hierarchy, không cắt nội dung quan trọng                |
| D6  | Xóa toàn bộ `transition-all` và bổ sung reduced-motion trong bốn file                      | File đã chạm phải tuân skill hiện hành                               |
| D7  | 44px bắt buộc cho control tạo/đổi; lỗi cũ ngoài scope thành dependency slice               | Không che lỗi nhưng tránh scope creep                                |
| D8  | Evidence B: BEFORE canonical local + hash/table; CI attach AFTER only                      | Không đòi CI build hai commit, vẫn truy vết before/after             |
| D9  | Prompt-chip click phát sinh 0 network request                                              | Đây là local navigation suggestion, không giả gọi AI                 |
| D10 | UX-R3, UX-R4, P2-10 tiếp tục là non-goal                                                   | Một outcome/PR và tránh tăng mật độ                                  |
| D11 | Fixture tắt chính xác 4 shell overlay/banner bằng plan/settings/date/network state         | Chiều cao/pixel không bị UI toàn cục chen ngẫu nhiên                 |
| D12 | Stub Date bằng init script + timezone; giữ timer và hai RAF thật                           | Ổn định copy theo giờ mà không phá settle/render                     |
| D13 | CLS dùng PerformanceObserver trước render, bỏ hadRecentInput; Chromium thiếu API thì fail  | Đo đúng CLS loading→loaded, không fallback tự chế                    |
| D14 | `member-error` là briefing reject + Today error/retry; validation là fixture riêng         | Mỗi ảnh/test chứng minh đúng một state                               |
| D15 | Prompt toggle unmount khi lên desktop: nếu đang focus, chuyển focus chip đầu trước unmount | Không rơi focus về body; focus nơi khác không bị cưỡng ép            |

Không còn câu hỏi sản phẩm blocking. Independent final review xác nhận toàn bộ finding vòng 1–3
đã đóng: **PASS — 0 critical · 0 major · 0 minor**.

- [x] Product outcome/scope/metric UX-R2
- [x] UX/accessibility/responsive/focus contract
- [x] Architecture/API/data/security/cost guardrails
- [x] Canonical fixture, test, evidence, rollout và rollback
- [x] Independent UX/architecture review PASS 0/0/0
- [x] Chủ dự án đã cấp mandate “giao subagent theo từng PR cho tới khi hoàn thành”
- [x] Mọi câu hỏi blocking của UX-R2 đã đóng

**Kết luận:** **Approved for implementation — chỉ UX-R2.**

**Bằng chứng phê duyệt:** mandate của chủ dự án trong phiên 2026-09-18; independent final review
PASS 0 critical · 0 major · 0 minor. UX-R3, UX-R4 và P2-10 không được phê duyệt bởi kết luận này.
