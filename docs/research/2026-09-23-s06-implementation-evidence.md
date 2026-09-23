# S06a — Sửa cổng AAA bỏ sót target: bằng chứng triển khai

Trạng thái: **VERIFYING**, chưa hoàn thành S06, chưa đủ điều kiện merge. Base
`f07820aa`, nhánh `codex/uiux-accessibility`. Không gọi provider trả phí hoặc production.

## Phạm vi

Sửa lỗi hiện hữu tại `e2e/a11y-aaa.spec.ts`, thêm collector
`e2e/helpers/aaaFindings.ts`. Nội dung inline trong đoạn văn, heading trong header
và link văn xuôi không bị bỏ qua; button và navigation giữ phạm vi AA. Target axe
được giữ nguyên. Target mất khỏi DOM, selector không hợp lệ, target frame/shadow chưa
hỗ trợ, không phân loại được hoặc rule không có node đều không được thành pass.

Mọi incomplete được giữ để review, kể cả chrome. Axe 4.13.0 dùng minThreshold
4.5/3 cho `color-contrast-enhanced`, bỏ kết quả ratio chưa xác định. Vì vậy scan AAA
vẫn giữ nguyên tags và scan riêng `color-contrast` cung cấp incomplete bổ sung.
Không chain `withRules()` sau `withTags()` vì sẽ ghi đè phạm vi quét.

## Kiểm chứng local

Runtime Windows Node 22.23.2, Playwright 1.63.0, Chromium 153.0.8010.12,
axe-core 4.13.0; mỗi lượt một worker.

- Negative controls (`--grep 'S06a negative controls'`): **2/2 đạt**. Fixture HTML
  thật qua axe bắt `p > span`, `p > em`, prose link, heading trong header; chấp nhận
  chữ #333 trên trắng và chrome AA #666 trên trắng. Gradient thật tạo incomplete;
  node xóa sau scan phải báo missing; full target lồng và rule không có node không
  được bỏ qua. Hai lần thử gradient chỉ với rule enhanced không sinh incomplete;
  đã đối chiếu mã axe và bổ sung rule AA, không giả kết quả incomplete.
- Trước sửa avatar: requested `/login` redirect về `/` sau mockLogin × `dark-blue`, `blue-sky`, `kid`: **0/3 đạt, 3/3 fail**.
  Cả ba ở trang chủ đã đăng nhập báo `incomplete: color-contrast target=[".w-7"] (chrome)` với lý do
  `Element content is too short to determine if it is actual text content`.
  Không có miễn trừ hoặc evidence thủ công giả để chuyển thành đạt.
- Sau sửa avatar Layout: requested `/login` → final `/` cả ba theme: **3/3 đạt**
  (10.6s), không còn incomplete `.w-7`. Đây không phải bằng chứng màn Login.
- Unit Layout: **17/17 đạt**, Vitest 5.0.1, 691ms.
- ESLint hai file TypeScript sửa: exit 0.
- Codemap impact cho spec E2E: exit 1, bản đồ hiện không chứa file E2E này.
  Đã đọc trực tiếp helper/caller; không sửa generated codemap.

Các lượt dùng config tạm giữ browser chuẩn, tắt GPU Windows; controls không khởi
động Vite, route dùng Vite port 5182, giữ toàn bộ dữ liệu mock hiện có. Config tạm
không đưa vào commit. Full build/typecheck/lint/unit/E2E và ma trận AA/AAA **chưa
chạy**; cần root điều phối tuần tự khi tích hợp. Không tái sử dụng số pass cũ.

## Phần còn lại

S06b cần phép đo 7:1 độc lập cho heading lớn, compositing alpha, token/gradient
không kết luận, trạng thái tải nội dung và xử lý evidence incomplete trên ma trận
route/theme/state. S06a không chứng minh tất cả nội dung đạt 7:1. Avatar `.w-7` được sửa nền gradient thành `bg-zinc-800`, chữ `text-zinc-100`,
không đổi ký tự E, button `aria-label="Trang cá nhân"` hoặc tên người dùng.
Codemap Layout: 77 file ảnh hưởng. Màu computed sau sửa (foreground/background):

| Theme     | Foreground       | Background       |
| --------- | ---------------- | ---------------- |
| dark-blue | rgb(236,242,250) | rgb(34,53,84)    |
| blue-sky  | rgb(15,23,42)    | rgb(226,232,240) |
| kid       | rgb(66,42,22)    | rgb(246,234,202) |

Ảnh blue-sky 390/1440 tại `C:/Users/liend/.codex/uiux-implementation/s06-avatar-{before,after}-{390,1440}.png`.
Ảnh before là tái dựng class cũ trên DOM cùng trang/mock để đối chiếu, không phải
ảnh production hoặc bằng chứng baseline commit độc lập.

S07 (zoom/reflow) và S08 (quiz/AT) vẫn chờ đặc tả Approved/merged và S06 tích hợp.
Chưa thay meta viewport, CSS toàn cục, các component quiz, focus hoặc dữ liệu học viên; chỉ avatar trong Layout thay màu như ghi ở trên. Không migration;
rollback bằng revert bốn file của slice này, đồng thời ghi nhận lỗ hổng gate mở lại.
