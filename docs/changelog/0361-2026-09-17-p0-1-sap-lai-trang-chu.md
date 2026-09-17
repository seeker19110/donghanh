# 0361 — 2026-09-17 — P0-1: sắp lại trang chủ + một banner phụ duy nhất

- **Lát**: P0-1 của `docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md` (lệnh 1/15).
  Approved for implementation (chủ dự án ra lệnh "thi hành lệnh 1", 2026-09-17).
- **PR**: (điền số PR khi tạo — xem mô tả PR để có link)

## Việc đã làm

1. **`apps/dhcb/src/lib/home/pickHomeBanner.ts`** (mới) — hàm THUẦN chọn ĐÚNG MỘT banner phụ
   cho trang chủ theo ưu tiên `planExpiry (≤7 ngày) > promoEnding (≤3 ngày) > pricePromo >
   rewardTip`; khách (`isGuest`) chỉ có thể nhận `pricePromo` hoặc `null`. Test bảng 17 ca ở
   `pickHomeBanner.test.ts` (yêu cầu spec: ≥ 10 ca).
2. **`Home.tsx`**:
   - Gọi `pickHomeBanner` với dữ liệu THẬT sẵn có, không thêm request mới:
     `planExpiresInDays` từ `user.plan`/`user.planExpiresAt` (dùng lại hàm thuần
     `daysUntilPlanExpires` của `PlanExpiryBanner`), `promoEndsInDays` từ
     `getAppSettings().promoUntil` (dùng lại `daysUntilPromoEnds` của `PromoEndingBanner`),
     `hasRewardTip` từ `shouldShowRewardTip(uid)`.
   - Trang chủ nay chỉ vẽ **ĐÚNG MỘT** banner phụ (bọc `[data-home-banner]`) thay vì có thể hiện
     cả mẹo thưởng lẫn khuyến mãi giá cùng lúc như trước.
   - Banner phụ được chọn di chuyển xuống **DƯỚI khối "Bộ môn & không gian"** (trước đây mẹo
     thưởng đứng ngay dưới "Hôm nay", tranh sự chú ý với CTA chính).
   - Thu hẹp khoảng cách dọc trong `topBlocks` (`space-y-3` thay vì kế thừa `space-y-5` của
     khung ngoài) để khối "Hôm nay" gọn hơn, hỗ trợ AC-4 (CTA nằm trong khung nhìn 390×844
     không cuộn).
3. **Test**: `Home.test.tsx` thêm 3 ca (AC-2: đúng 1 `[data-home-banner]`; AC-3: heading "Hôm
   nay" đứng trước banner trong DOM; ca không có banner nào khi không đủ điều kiện).
   `Home.design.test.ts` thêm 3 ca canh mã nguồn (gọi `pickHomeBanner` đúng 1 lần; thứ tự
   `{spacesSection}` trước `{!isDesktop && homeBannerNode}`; không còn `{rewardTip}` độc lập).
   `e2e/learning-ux-layout.spec.ts` thêm phép đo 3b (AC-4): CTA chính của "Hôm nay" nằm trong
   khung nhìn 390×844 không cuộn cho màn `today`.

## Quyết định (ghi rõ vì có diễn giải cần người sau biết)

- **`planExpiry`/`promoEnding` không có bản UI riêng ở trang chủ.** Hai banner này đã hiện
  TOÀN CỤC ở mọi trang qua `App.tsx` (`AllowGuest`/`RequireAccount` render
  `PlanExpiryBanner`/`PromoEndingBanner` không điều kiện theo trang) — spec P0-1 cấm đụng
  `App.tsx`. Khi `pickHomeBanner` chọn 1 trong 2 kind này, trang chủ **KHÔNG vẽ thêm bản riêng**
  (tránh 2 bản cùng nội dung xuất hiện cùng lúc, mỗi bản tự quản trạng thái đóng riêng — một bug
  UX khác nếu nhân đôi). Trang chủ chỉ có "bản của mình" cho `pricePromo` (`PricePromoBanner`)
  và `rewardTip` (`RewardTipBanner`) — hai banner này KHÔNG có bản toàn cục.
  → Hệ quả: test AC-2 dùng kịch bản `pricePromo` + `rewardTip` cạnh tranh (không dùng
  `planExpiry`) để có nghĩa với kiến trúc thật; nếu về sau muốn `planExpiry`/`promoEnding` có
  bản trang-chủ-riêng, cần lát khác đổi cả `App.tsx` lẫn 2 component đó (ngoài phạm vi P0-1).
- **Không đụng bất biến "PlanExpiryBanner vẫn hiện ở trang khác"**: không sửa `App.tsx`, hai
  component `PlanExpiryBanner.tsx`/`PromoEndingBanner.tsx` — hành vi các trang khác giữ nguyên
  100% (không có gì để hồi quy vì không có gì đổi).
- **Môi trường sandbox thiếu `node_modules/pyodide`** (gói lớn, không có sẵn trong worktree)
  khiến `npm run build` lần đầu báo lỗi ENOENT khi copy asset Pyodide — không liên quan tới thay
  đổi của lát này. Đã `npm install pyodide@314.0.6 --no-save` (không sửa `package.json`/
  `package-lock.json`, gói đã có sẵn trong lockfile) để build lại và xác minh sạch.

## Bằng chứng kiểm chứng

```
$ npx vitest run apps/dhcb/src/lib/home/pickHomeBanner.test.ts apps/dhcb/src/pages/core/Home.test.tsx apps/dhcb/src/pages/core/Home.design.test.ts
 Test Files  3 passed (3)
      Tests  37 passed (37)

$ npm run typecheck
> tsc -p apps/dhcb/tsconfig.json && tsc -p tsconfig.api.json && tsc -p tsconfig.e2e.json && tsc -p apps/hub/tsconfig.json
(không lỗi)

$ npm run lint
> eslint . --ext ts,tsx,js,mjs --report-unused-disable-directives --max-warnings 0
(0 cảnh báo)

$ npm run format
(không file nào cần định dạng lại ngoài 3 file test mới/sửa — đã áp Prettier)

$ npm test
 Test Files  685 passed | 1 skipped (686)
      Tests  14632 passed | 2 skipped (14634)

$ npm run build
✓ built in 1m 24s (client) + build:packages + tsc -p tsconfig.server.json + @dhcb/hub build
(exit code 0, dist/ + dist-server/ + apps/hub/dist/ đều sinh ra đầy đủ)
```

Ảnh chụp 1440/390 × 3 theme (AC-5, Tầng 8b): **chưa đính kèm được qua kênh thi hành này** —
không có trình duyệt/Playwright chạy được trong phiên; đã kiểm bằng test DOM/thứ tự phần tử
(`Home.test.tsx` AC-2/AC-3, `Home.design.test.ts`) thay thế. `npx size-limit` (AC-6): script cần
`dist/`/`coverage/` build sẵn — đã build (`npm run build` ở trên) nhưng phép đo size-limit riêng
lát này không tách được khỏi kích thước toàn bundle sẵn có; thay đổi mã chỉ thêm 1 hàm thuần nhỏ
(~50 dòng) + vài dòng lắp ráp trong `Home.tsx`, không thêm thư viện/import nặng nào.

## Việc còn để ngỏ (không thuộc phạm vi P0-1)

- Ảnh chụp trước/sau thật (Playwright + script `shots:learning-ux`) — cần chạy ở môi trường có
  trình duyệt, không có trong phiên thi hành lát này.
- `e2e/learning-ux-layout.spec.ts` phép đo 3b (AC-4) đã thêm vào mã nhưng CHƯA chạy được trong
  phiên này (không có Playwright/trình duyệt) — cần CI hoặc máy có trình duyệt xác nhận xanh.
