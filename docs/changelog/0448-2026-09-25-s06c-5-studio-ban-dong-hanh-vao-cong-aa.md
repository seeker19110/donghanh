# S06c — 5 studio Bạn Đồng Hành vào cổng AA

- **Ngày:** 2026-09-25 · **PR:** PR source của nhánh `seeker/gifted-johnson-2qrl9y`
- **Loại:** `fix(a11y)`. Đặc tả: `docs/specs/2026-09-23-uiux-s06-s08-accessibility.md`, mục
  "Quyết định S06c" (duyệt ở `0447`).

## Đã làm

- **Tương phản AA.** Sửa 14 nút vi phạm `color-contrast` mà quét axe ở `0447` tìm ra:
  - `ArticulatoryPhoneticsVisualizer`, `WearablesSyncCard`: nút chính đổi sang teal-700/800 và
    emerald-700/800, chữ `text-[#fff]`.
  - `EchoShadowingCard`, `SubconsciousInsightsCard`, `MicroDrillModal`: thêm nền `theme-light:*-100`
    để chữ đậm đứng trên nền sáng.
  - `LifeSynthesisDashboard`: nhãn thêm `theme-light:text-accent-800`; nút nền cyan dùng
    `text-[#09090b]`.
  - `StudioSynthesis`: banner Action Canvas bỏ gradient tối, dùng `bg-surface-card` +
    `text-content`/`text-content-secondary`.
- **Trạng thái chọn và vùng chạm.** Tab studio ở `Companion.tsx` và chip chọn ở ba thẻ Articulatory,
  Wearables và Echo Shadowing có `aria-pressed` và `tap-44-y` (vùng chạm 44 px trên thiết bị cảm ứng).
- **Cổng.** `e2e/a11y.spec.ts` thêm vòng `COMPANION_STUDIOS`: 5 studio × 3 theme ở 390 px. Mỗi ca
  chờ tab báo `aria-pressed="true"`, chờ DOM đứng yên, rồi yêu cầu 0 vi phạm A/AA.

## Tầng 8b — ảnh trước/sau

Chụp toàn trang 5 studio × 390/1440 × blue-sky/dark-blue: 20 ảnh "sau", đối chiếu với ảnh "trước"
đã chụp ở `0447`. Kết quả xem bằng mắt:

- Banner Action Canvas ở blue-sky trước đây là dải gradient tối, chữ gần như không đọc được. Giờ
  là thẻ nền sáng, đọc rõ.
- Nhãn "Holistic" và "V5.4 FLAGSHIP" trước đây nhạt trên nền sáng, giờ đậm hơn.
- Theme dark-blue không đổi bố cục. Không có nội dung bị lặp hay bị mất.

## Nợ ghi nhận (ngoài phạm vi S06c)

- **AAA ở 5 studio chưa đạt.** Probe `color-contrast-enhanced` ở 390 px còn 1–5 nút mỗi
  studio × theme. Cao nhất là "Trò chuyện" (5 ở blue-sky và kid) và "Tổng kết" (4). Probe này đếm
  mọi chữ, không riêng nội dung/tiêu đề, và chưa đo lại vùng nền gradient như `scanAaa`. Các
  studio này chưa nằm trong `e2e/a11y-aaa.spec.ts`.
- **Tràn ngang ở 390 px.** Thẻ "Workplace Error Harvester" bị cắt mất tab "Thẻ SRS (0)". Lỗi này
  đã có trong ảnh "trước", không do đợt này gây ra.

## Bằng chứng

- `npx playwright test e2e/a11y.spec.ts -g "Bạn Đồng Hành"`: 15/15 (5 studio × 3 theme).
- Commit hook: `eslint --max-warnings 0` + `prettier` cho 9 file đổi.
- Cổng nhanh trước commit: typecheck 0 lỗi, lint 0, format 0, `npm test` 1006/1006.
- Theo yêu cầu chủ dự án, ở máy chỉ chạy E2E thu hẹp. Toàn bộ E2E còn lại do CI chạy.
