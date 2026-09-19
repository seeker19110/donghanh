# 0376 — 2026-09-19 — UX-R3.3: gộp "Tuần này" (streak · mục tiêu · lịch)

## Bối cảnh

Đặc tả: `docs/specs/2026-09-18-ui-clarity-dashboard-progressive-disclosure.md` §6.2, §8 (R3-3 —
Hierarchy and consolidated weekly). Base: R3-1 (#1024) và R3-2 (#1025, `0b49300`) đã merge vào
`main`. Việc này là **R3-3 trong chuỗi tuần tự R3-1→R3-4**; R3-4 (English progressive disclosure

- 28 evidence cases) làm sau khi R3-3 merge xanh, theo đúng §8/§12 của đặc tả ("Touch set được
  serialize: không cho hai agent sửa `Dashboard.tsx` đồng thời").

## Đã làm

- Thêm `apps/dhcb/src/components/DashboardWeeklyOverview.tsx` — boundary mới sở hữu khối "Tuần
  này": đúng MỘT heading `Tuần này`, scope label `Hoạt động Tiếng Anh đã ghi nhận` ngay dưới, một
  hàng tóm tắt (số ngày đã học/mục tiêu + tổng hoạt động 7 ngày) và một narrative deterministic
  (`weeklyLine`, chuyển từ `Dashboard.tsx`). CTA `Đổi mục tiêu ở Hồ sơ` giữ nguyên route/vùng
  chạm/tên truy cập.
- Fixture chỉ có evidence môn khác (Lập trình): `weekTotal === 0 && weekly.daysDone === 0` hiện
  đúng copy `Chưa có hoạt động Tiếng Anh được ghi nhận tuần này.` — không suy diễn số ngày/mục
  tiêu từ dữ liệu rỗng, không cộng nhầm evidence môn khác vào con số English (AC-7).
- Calendar disclosure (mở/đóng, đóng mặc định mọi width, focus transfer trước khi hide) chuyển
  từ `Dashboard.tsx` vào `DashboardWeeklyOverview` — Dashboard chỉ còn sở hữu `selectedDate`
  (đúng đặc tả §5.4 "Dashboard là owner" của selection, không phải của disclosure state).
- Thêm `presentation?: 'standalone' | 'embedded'` (mặc định `standalone`, backward-compatible)
  cho `ActivityCalendarCard`. `embedded` bỏ surface/viền/nền/heading riêng — chỉ còn grid + chi
  tiết ngày + chú thích — vì `DashboardWeeklyOverview` đã sở hữu heading/section của toàn khối.
  `aria-label` của grid, roving tabindex và live detail giữ nguyên ở cả hai chế độ.
- Xoá `GoalRing`, `weeklyLine` (bản cũ), `streakSection`, `weeklyGoalSection` khỏi
  `Dashboard.tsx`; dọn theo import/biến không còn dùng (`Flame`, `CalendarCheck`, `T.streakDays`,
  `maxDay`, `dow`, refs/state calendar toggle cũ).
- P2-10 (`ProgressStory` độc lập) tiếp tục được đánh dấu **superseded** bởi phương án A của
  UX-R3 (đã chốt ở PR #1023/#1024) — không tạo file source P2-10 mới.

## Test/bằng chứng

- Mới: `apps/dhcb/src/components/DashboardWeeklyOverview.test.tsx` (5 case: một heading + scope
  label, narrative có evidence, copy programming-only, calendar disclosure đóng mặc định + mở
  không sinh card/heading lồng, CTA gọi callback + vùng chạm 44px).
- Sửa: `apps/dhcb/src/components/ActivityCalendarCard.test.tsx` — thêm 2 case cho
  `presentation`: `standalone` giữ nguyên section/heading, `embedded` không sinh
  section/h2 nhưng giữ `aria-label`/roving tabindex.
- `npm run codemap -- impact apps/dhcb/src/pages/core/Dashboard.tsx` → 3 file (App.tsx,
  Dashboard.test.tsx, main.tsx qua App.tsx) — không có call site nào khác vỡ.
- `npm run codemap -- impact apps/dhcb/src/components/ActivityCalendarCard.tsx` → 7 file, gồm
  `DashboardWeeklyOverview.tsx`/`.test.tsx` mới thêm — soát thủ công, không có vỡ props.
- Cổng đầy đủ chạy thật trên nhánh này: build ✅ · typecheck ✅ · lint (0 cảnh báo) ✅ ·
  format:check ✅ · `npm test` **14972 passed | 2 skipped** ✅.
- E2E mục tiêu: `e2e/calendar-keyboard.spec.ts` **11/11 PASS** (roving tabindex, resize
  1023→1024→1279→1280→390, focus transfer, QuickActions dialog qua resize, axe 3 theme).
- `e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts` lọc `/tien-do` cả ba theme: **6/6 PASS** (0 vi phạm
  A/AA và AAA nội dung/tiêu đề).

## Phạm vi KHÔNG làm (để R3-4)

- Chưa làm §6.3 English progressive disclosure (`DashboardEnglishDetails`, panel đóng mặc định,
  target chiều cao cuối, ma trận 28 evidence case) — đó là R3-4, chạy sau khi PR này merge theo
  đúng thứ tự phụ thuộc R3-1→R3-2→R3-3→R3-4 của đặc tả.
- Không đổi route/API/schema/thuật toán streak/mục tiêu tuần/CEFR/IELTS/SRS.
