# 0293 — 2026-09-13 — Tắt gate Intake 5 câu + đo rớt từng bước Onboarding

## Bối cảnh

Đọc tab admin Analytics (14 ngày gần nhất, 20 người dùng thật): 20 đăng ký thành công nhưng chỉ
**4 người hoàn thành phiên học đầu tiên** (`first_session_done`) — rớt 80% ngay sau đăng ký.

Đọc lại code luồng sau đăng ký (`App.tsx` `RequireAuth`) xác nhận: mọi người dùng mới bị ép qua
**Intake 5 câu** (`/bat-dau`) rồi mới tới **Onboarding 4 bước** (`/onboarding`) trước khi được vào
nội dung học. `first_session_done` phía server (`analytics-summary.ts`) có ngưỡng RẤT thấp — chỉ
cần 1 hoạt động nhỏ (1 tin nhắn chat, 1 lần học từ…) là tính — nên 80% rớt gần như chắc chắn xảy
ra ngay trong khối gate này, trước khi người dùng chạm được bất kỳ tính năng học nào.

_Đính chính:_ Intake (`Intake.tsx`) thực ra ĐÃ có nút "bỏ qua" ở từng câu (đúng như comment đầu
file: "bỏ hết vẫn vào được app") — không phải ép buộc cứng như suy đoán ban đầu. Onboarding
(`Onboarding.tsx`) 4 bước cũng có giá trị mặc định sẵn, chỉ cần bấm "Tiếp theo" 4 lần là qua,
không bắt buộc phải nhập gì. Vấn đề thật là **số lượng màn hình/thao tác trước khi vào app**
(tối đa 9 lượt bấm qua 2 trang), không phải các trường bắt buộc.

## Việc đã làm

1. **Tắt hẳn gate Intake** (`App.tsx` `RequireAuth`): người chưa `onboarded` giờ vào thẳng
   `/onboarding` (4 bước, có mặc định sẵn) thay vì `/bat-dau` (5 câu) trước đó — quyết định của
   chủ dự án sau khi thấy funnel thật, ưu tiên giảm số bước hơn là giữ lớp hồ sơ năng lực ẩn.
   `Intake.tsx`/`intakeApi` giữ nguyên, không xoá — chỉ không còn route nào dẫn người dùng mới
   tới đó (vẫn truy cập được qua URL trực tiếp nếu cần dùng lại sau này).
2. **Thêm đo lường `onboarding_step_view`** (event mới trong whitelist
   `apps/server/src/api/platform/analytics.ts` + `apps/dhcb/src/lib/analytics.ts`): bắn khi mỗi
   bước Onboarding hiện ra, `refCode = "onboarding:<step>"` (khuôn giống Daily Plan sẵn có,
   không cần migration). Mục đích: biết chính xác người dùng rớt ở bước mấy trong 4 bước còn lại
   (nếu vẫn thấy rớt cao sau khi tắt Intake).

## Quyết định

- Chỉ tắt ROUTE tới Intake, không xoá code — có thể bật lại nếu cần lớp hồ sơ năng lực ẩn sau
  này (đặc tả `docs/research/luong-nguoi-moi-ho-so-nang-luc-an-2026-08-23.md` vẫn còn giá trị
  tham khảo).
- Chưa thêm bảng hiển thị `onboarding_step_view` lên tab admin Analytics ở đợt này — dữ liệu đã
  ghi được vào `analytics_events`, đọc trực tiếp bằng SQL khi cần trước khi quyết có đáng làm UI
  riêng hay không.

## Bằng chứng kiểm chứng

- `npm ci` (đồng bộ lockfile trước khi chạy cổng, theo CLAUDE.md mục 8) → `npm run typecheck` ✅
  → `npm run lint` (0 cảnh báo) ✅ → `npx vitest run` toàn bộ **5218/5218 test xanh** ✅ →
  `npm run build` (app + server + hub) ✅.
- Đã đọc lại `Onboarding.tsx`/`Intake.tsx` để xác nhận không có test nào gắn cứng đường dẫn
  `/bat-dau` là bước bắt buộc — 5218 test xanh xác nhận không phá luồng nào khác.

## Bước tiếp theo (không làm ở đợt này)

- Theo dõi tab Analytics 1–2 tuần tới: tỉ lệ `first_session_done`/đăng ký có tăng không sau khi
  bớt 1 trang gate.
- Nếu vẫn rớt cao, đọc `onboarding_step_view` theo `ref_code` để biết rớt ở bước nào trong 4 bước
  Onboarding còn lại, rồi quyết tiếp (rút gọn còn 2 bước? thêm nút "bỏ qua, học ngay"?).
