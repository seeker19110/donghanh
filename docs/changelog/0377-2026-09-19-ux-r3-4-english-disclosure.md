# 0377 — 2026-09-19 — UX-R3.4: English progressive disclosure (slice cuối UX-R3)

## Bối cảnh

Đặc tả: `docs/specs/2026-09-18-ui-clarity-dashboard-progressive-disclosure.md` §6.3, §9 (AC-8..
AC-11), §10 (28 evidence case). Base: R3-1 (#1024), R3-2 (#1025), R3-3 (#1034) đã merge vào
`main` — xác nhận bằng `git log origin/main` trước khi bắt đầu, không tin lại tóm tắt cũ.
**R3-4 là slice CUỐI trong chuỗi tuần tự R3-1→R3-4** — sau PR này, UX-R3 coi như hoàn tất.

## Đã làm

- Thêm `apps/dhcb/src/components/DashboardEnglishDetails.tsx` — boundary mới sở hữu khối
  "Chi tiết Tiếng Anh":
  - **Summary luôn hiển thị** (không nằm trong panel `hidden`): số từ cần ôn hôm nay, một chỉ
    dấu lộ trình CEFR (%, hoặc "Đang tải…"/"Chưa tải được"/"Chưa có dữ liệu" khi chưa đo/tải/lỗi),
    và toàn bộ card "Lượt AI hôm nay" (Free) hoặc lưới 3 tính năng (VIP) — gồm
    `#dashboard-weekly-credit-heading` (`tabIndex={-1}`, recovery target §4.1, KHÔNG đổi vị trí
    so với trước R3-4).
  - **Panel disclosure** `#dashboard-english-details-toggle`/`#dashboard-english-details-panel`
    (HTML `hidden`, `aria-expanded`/`aria-controls`) đóng mặc định ở **320/390/1440**, không
    localStorage, không tự mở/đóng vì breakpoint/lỗi/dữ liệu. Trước khi ẩn, nếu
    `document.activeElement` nằm trong panel thì chuyển về nút toggle; focus ở ngoài không bị
    "steal" — cùng khuôn với `DashboardWeeklyOverview`/calendar (R3-3).
  - Panel chứa nguyên vẹn 6 khối English hiện hành (Hôm nay · Từ vựng · Sổ lỗi · CEFR · IELTS ·
    Tổng kết), bỏ card "Lượt AI hôm nay" khỏi "Hôm nay" (đã lên summary — không còn số/card lặp).
    `#dashboard-cefr-heading` giữ nguyên vị trí (trong panel) — vì retry button chỉ tồn tại khi
    panel mở (HTML `hidden` gỡ nó khỏi accessibility tree), focus-recovery logic ở `Dashboard.tsx`
    không cần biết panel đang mở hay đóng: nếu panel đã đóng trước khi resolve, hide handler đã tự
    chuyển focus ra toggle rồi, nên check "Retry vẫn là activeElement" tự nhiên là `false`.
- `Dashboard.tsx`: xoá toàn bộ JSX các khối English (StatCard/Bar/ACCENT/bandBar/bandText chuyển
  sang `DashboardEnglishDetails.tsx`, chỉ dùng ở đó); thêm state `englishDetailsExpanded`
  (đóng mặc định); Dashboard chỉ còn orchestration (resource async keyed + focus recovery refs)
  theo đúng boundary §6.1 — không tự tính/tạo authoritative progress.

## Phát hiện hạ tầng test (ghi rõ vì brief cho phép tự xử lý khi hạ tầng chưa có sẵn)

- `subjectProgressBoard.ts` (SubjectProgressSection — NGOÀI touch-set R3-4) gọi thẳng
  `loadCefr()`/`loadFoundation()`, share ĐÚNG cache promise với `curriculum.ts`. Chặn mạng
  `/data/cefr.json` để giả lập CEFR "delayed"/"error" vô tình treo CẢ khối "Tiến độ theo môn"
  (nó `Promise.all` với promise đó) — nhiễu CLS đo được bằng shift không liên quan tới English
  disclosure (đo được cụ thể: CLS giả 0.87–0.88, đến từ khối kia cao thêm ~820px khi tự nó settle
  đúng lúc cửa sổ đo). Fix: case "CEFR delayed/error recovery" chặn một chunk từ điển riêng
  (`/data/dictionary/chunk-000.json`, KHÔNG được `subjectProgressBoard` gọi tới) — vẫn ép
  `cefrState` của Dashboard ở `loading`/`error` (nó chờ đủ dictionary+foundation+cefr qua
  `Promise.all`) mà không kéo theo SubjectProgressSection.
- React `StrictMode` (dev) double-invoke effect ở lần mount đầu bắn hai request gần như đồng thời
  cho cùng một resource — test giả lập "trước Retry luôn trả lỗi, sau Retry mới ready" phải dùng
  một cờ `released` lật NGAY TRƯỚC khi gọi `.click()` (không phải sau): gọi sau tạo race thật —
  request retry có thể đã tới route handler trước khi dòng JS tiếp theo chạy.
- CEFR panel reserve `min-h-[19.5rem]` (≈318px, khớp 6 cấp A1–C2 cố định của
  `src/data/cefr.ts` — không phải 4 cấp như đoán ban đầu) để giữ CLS loading/error→ready <0,1
  (AC-11); thêm `data-testid="cefr-roadmap-content"` để đo/canh chiều cao này về sau.
- Gate a11y-aaa `/tien-do` phát hiện 1 vi phạm `color-contrast-enhanced` MỚI (không phải nợ cũ):
  `<p className="text-accent-300 theme-light:text-accent-800">` ở summary tile "Lộ trình CEFR"
  (18px bold — dưới ngưỡng "large text" 18.66px của axe nên vẫn cần 7:1) chỉ đạt ~6.5–6.95:1 ở
  `blue-sky`/`kid`. Sửa: dùng `theme-light:text-accent-900` (khớp mẫu đã qua AAA ở tile "Cần ôn
  hôm nay").

## Test/bằng chứng

- Mới: `apps/dhcb/src/components/DashboardEnglishDetails.test.tsx` (8 case: panel đóng mặc định +
  stable id/HTML `hidden`, weekly-credit-heading luôn visible ngoài panel, mở bằng một click, focus
  transfer trong/ngoài panel, đủ 6 destination trong panel, five states summary — chưa đo/loading/
  0 hợp lệ/lỗi/VIP).
- Sửa: `apps/dhcb/src/pages/core/Dashboard.test.tsx` — 3 test CEFR mở panel trước khi thao tác
  Retry (thay vì thao tác trên nút nằm trong panel còn đóng); thêm case mới "CEFR Retry→đóng panel
  giữa chừng→success không cướp focus, giữ ở toggle".
- `npm run codemap -- impact apps/dhcb/src/pages/core/Dashboard.tsx` → 3 file (App.tsx,
  Dashboard.test.tsx, main.tsx qua App.tsx). `npm run codemap -- impact
apps/dhcb/src/components/DashboardEnglishDetails.tsx` → 5 file (thêm chính Dashboard.tsx +
  test mới) — không có call site nào khác vỡ.
- Cổng đầy đủ chạy thật trên nhánh này: build ✅ (bundling xong, bước copy tài nguyên Pyodide tự
  host lỗi vì `node_modules/pyodide` không có trong sandbox này — môi trường, không phải code; CI
  chạy `npm ci` đầy đủ) · typecheck ✅ · lint (0 cảnh báo) ✅ · format:check ✅ ·
  `npm test` **15002 passed | 2 skipped**.
- `e2e/ux-r3-4-english-disclosure-evidence.spec.ts` **31/31 PASS** — đủ 28 evidence case §10
  (canonical loaded/collapsed 320/390/1440×3 theme = 9 · English expanded 390×3 theme = 3 · weekly
  unavailable 390×3 theme×2 mode = 6 · CEFR delayed recovery 390×3 theme = 3 · CEFR error recovery
  390×3 theme = 3 · programming-only 390×3 theme = 3 · live responsive calendar 1) + 3 test axe
  A/AA bổ sung, chạy lại 2 lần liên tiếp đều xanh (không flaky). Canonical height đạt budget §3:
  ≤2.300/2.100/1.450px tại 320/390/1440.
- `e2e/calendar-keyboard.spec.ts` **11/11 PASS** (không hồi quy calendar/QuickActions/focus).
- `e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts` lọc `/tien-do` cả ba theme: **6/6 PASS** (0 vi phạm
  A/AA và AAA nội dung/tiêu đề) sau khi sửa contrast ở trên.

## Kết luận UX-R3

Chuỗi UX-R3 (R3-1 async truth/retry → R3-2 responsive state/focus/calendar → R3-3 hierarchy +
consolidated "Tuần này" → R3-4 English progressive disclosure) **HOÀN TẤT**. `/tien-do` giờ theo
đúng cấu trúc §2 Goal 3: `PageHeader → Tiến độ theo môn → Tuần này → Chi tiết Tiếng Anh → Công
cụ`, một DOM tree ổn định, mọi resource async có `loading|ready|error` + Retry thật, chi tiết
Tiếng Anh đóng mặc định và mở theo yêu cầu. UX-R4 (taxonomy/header/navigation) chưa thi hành —
đọc lại `docs/specs/2026-09-18-ui-clarity-foundation.md` trước khi bắt đầu.

## Phạm vi KHÔNG làm

- Không đổi route/API/schema/thuật toán streak/mục tiêu tuần/CEFR/IELTS/SRS/quota.
- Không sửa `SubjectProgressSection`/`subjectProgressBoard.ts` dù phát hiện coupling cache với
  `curriculum.ts` (ngoài touch-set R3-4) — chỉ né nó trong cách viết test, không sửa hành vi.
- Không làm UX-R4 (header/navigation/taxonomy toàn site).
