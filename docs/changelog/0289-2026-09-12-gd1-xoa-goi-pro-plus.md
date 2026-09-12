# 0289 — 2026-09-12 — GĐ1: xoá gói Pro/Plus, Free hưởng hạn mức Plus cũ

**PR:** (điền khi tạo) · **Nhánh:** `claude/relaxed-hamilton-yb90lb`

Thi hành đặc tả `docs/specs/2026-09-12-gd1-xoa-goi-pro.md` (chủ dự án chốt 2026-09-12).

## Việc đã làm

### 1. Hệ thống chỉ còn HAI gói: `free` + `vip`

Khảo sát mã lúc viết đặc tả phát hiện thực tế có **bốn** gói (`free`/`plus`/`pro`/`vip`) chứ
không phải ba như `CLAUDE.md` mô tả. Đợt này xoá cả `plus` lẫn `pro`:

- `packages/core-billing/plan.ts` — `type Plan = 'free' | 'vip'`. `normalizePlan` **map giá trị
  cũ `'plus'`/`'pro'` còn sót trong DB thành `'vip'`** (kết hợp `resolvePlan` kiểm
  `plan_expires_at`: còn hạn → hưởng VIP tới hết hạn đã trả, hết hạn → free). Đây là lưới an
  toàn cho hàng lọt lưới migration (tạo ra giữa lúc deploy, khôi phục sao lưu tay).
- `packages/core-billing/prices.ts` — `PayablePlan = 'vip'`; bỏ bảng giá mặc định của plus/pro.
  Dòng `plan_prices` của gói cũ trong DB **được giữ nguyên**, chỉ không còn được đọc.
- `apps/server/src/api/billing/checkout.ts` — `z.enum(['vip'])` (đơn `plan: 'pro'` → **400**).
- `apps/server/src/api/billing/plan-prices.ts` — bỏ hai khối giá `plus`/`pro` khỏi phản hồi.
- `admin-grant-plan.ts` · `admin-plan-features.ts` · `admin-plan-marketing.ts` ·
  `admin-achievement-rewards.ts` — enum gói còn `['free','vip']` / `['vip']`.
- `planExpiry.ts` — `where plan in ('vip')`.
- Mọi nguồn CẤP THƯỞNG "N ngày gói" chuyển sang cấp **VIP**: `referral.ts`, `quests.ts`,
  `achievementRewards.ts`, `core-auth/trial.ts` (quà 14 ngày lúc đăng ký), `admin-payments.ts`
  (khớp đơn tay — kể cả đơn CŨ `plan='pro'` cũng cấp VIP, không để người đã trả tiền thiệt).
- `planGrant.ts` — `PLAN_RANK` còn `{ free: 0, vip: 1 }`, luật "không bao giờ hạ cấp" giữ nguyên.
- Ba nơi đọc bảng có cột `plan` (`planFeatures.ts`, `planMarketing.ts`, `prices.ts`) nay **lọc
  bỏ dòng của gói đã xoá** thay vì tin kiểu dữ liệu — dữ liệu lịch sử vẫn nằm trong DB.

### 2. Free hưởng thẳng hạn mức Plus cũ = 30 lượt/ngày, CẤU HÌNH ĐƯỢC

Trước đây Free dùng **kho lượt cửa sổ trượt 7 ngày** (`consume_rolling_credit`, +5 lượt mỗi
ngày có học thật), còn con số 30 của Plus thì **hard-code** ở `usage.ts` dòng 156.

- `packages/core-billing/usage.ts` — bỏ hẳn nhánh Free dùng kho trượt; Free và VIP nay đi CHUNG
  một đường `consume_usage_total` (hạn mức TỔNG mọi mode/ngày), chỉ khác con số. Bỏ hard-code
  `plan === 'plus' ? 30 : limits[plan]` → còn `limits[plan]`. `refundUsage` cũng gộp còn một
  đường (`refund_usage`), không còn `refund_rolling_credit`.
- `packages/core-db/settings.ts` — `limits: { free, vip }`. **`limits.free` đọc từ đúng cột DB
  cũ `pro_daily_limit`** — cột giữ nguyên tên để KHÔNG phải migration đổi tên (rủi ro cao, phải
  sửa đồng bộ API + panel), ý nghĩa mới ghi rõ trong comment. Mặc định 30.
- `admin-settings.ts` + `AdminLimitsPanel.tsx` — ô chỉnh hạn mức nay là **"Gói Free"** và
  **"Gói VIP"**, đổi có hiệu lực ngay, không cần deploy (đúng đề xuất §0.1 mục 1 của đặc tả).
- `api/usage-summary.ts` — đổi cách tính "còn bao nhiêu lượt": đọc `daily_usage` của ngày hôm
  nay (giờ VN) + đúng môn rồi trừ khỏi hạn mức. **Giữ nguyên tên field cũ**
  (`freeWeeklyCredit`/`freeWeeklyCap`) để không phá cache localStorage đã phát hành — ý nghĩa
  mới ghi rõ trong `weeklyCredit.ts`. Nhánh lỗi DB nay trả `null` (UI ẩn số) thay vì bịa số 0.
- Công thức "đã dùng bao nhiêu" dùng chung hằng `AI_USAGE_COLUMNS` export từ `usage.ts` — thêm
  mode AI mới mà quên một chỗ thì số hiển thị lệch số chặn thật, nên chỉ khai báo MỘT nơi.

### 3. Migration `0076_remove_pro_plus_plans.sql`

Lũy đẳng, an toàn cả khi không có hàng Plus/Pro nào:

1. `plan in ('plus','pro')` **còn hạn** → `'vip'`, **giữ nguyên `plan_expires_at`**.
2. `plan in ('plus','pro')` **hết hạn** → `'free'` (dọn giá trị chết).
3. `app_settings.pro_daily_limit` đặt sàn 30 (chỉ nâng, không hạ nếu admin đã đặt cao hơn).

**KHÔNG xoá** dữ liệu lịch sử (`payments.plan='pro'`, các dòng `plan_prices`/`plan_marketing_*`/
`plan_feature_flags` của gói cũ) — đặc tả §① mục "KHÔNG làm". Lệnh export CSV để rollback ghi
sẵn trong đầu file. Đã thêm dòng mô tả vào `postgres/migrations/README.md` (bẫy đã dính ở PR #883).

### 4. Giao diện

- `UpgradeSection.tsx` — bảng so sánh còn **2 cột Free/VIP**; bỏ hàng nút chọn gói (VIP là gói
  trả phí duy nhất, chỉ còn chọn chu kỳ). Nội dung gói Free sửa cho đúng hạn mức mới (30
  lượt/ngày thay cho "+5 lượt/ngày, tối đa 35 trong 7 ngày").
- `PlanExpiryBanner.tsx` — bỏ nhánh nhãn Plus/Pro.
- 7 panel admin (`AdminLimitsPanel` · `AdminPlanFeaturesPanel` · `AdminPlanMarketingPanel` ·
  `AdminGrantPlanPanel` · `AdminUsersPanel` · `AdminUsagePanel` · `AdminAchievementRewardsPanel`)
  — bỏ cột/ô/option của gói đã xoá. Panel thưởng huy hiệu bỏ luôn ô chọn gói (chỉ còn "ngày VIP").
- `Pricing.tsx`, `Dashboard.tsx`, và mọi chuỗi người dùng đọc được ("tặng N ngày gói Pro",
  "Nâng cấp Pro/VIP", "tính năng dành cho gói Pro/VIP"…) → VIP.
- Thẻ "Kho lượt cửa sổ trượt 7 ngày của gói Free" trong dashboard admin đổi thành **"Hạn mức
  ngày của gói Free"** (đếm người-ngày chạm trần) — cơ chế cũ không còn enforce nên để nguyên
  là số liệu vận hành nói sai sự thật.

## Quyết định trong lúc thi hành (ngoài chữ của đặc tả)

1. **Đặc tả không nói gì về khuyến mãi.** `effectivePlan()` vốn "nâng đúng 1 bậc"; mất bậc Pro
   thì Free chỉ có thể lên VIP. Với **hạn mức** điều đó ổn. Với **quyền giọng** thì không: giọng
   Studio giá $24/1 triệu ký tự và không có hạn mức miễn phí (đắt gấp 12 lần Chirp3-HD) — mở cho
   toàn bộ người dùng Free trong một đợt khuyến mãi là rủi ro chi phí thật, và repo đã có test
   canh đúng điều đó. Nên thêm `PROMO_FREE_VOICES` ở **cả hai phía**
   (`packages/core-ai/voiceAccess.ts` + `apps/dhcb/src/lib/voiceTiers.ts`) = đúng bộ giọng Free
   từng được nâng lên trước GĐ1 → **chi phí giọng không đổi một đồng nào**. Bất biến này có test
   riêng ở `voiceAccess.test.ts` và `promo.test.ts`.
2. **Cơ chế `free_daily_credit` (kho lượt trượt) KHÔNG bị xoá** — bảng, hàm SQL và lời gọi
   `grant_daily_bonus_rolling` trong `api/progress.ts` giữ nguyên (đặc tả cấm xoá dữ liệu lịch
   sử). Hệ quả: mỗi ngày vẫn ghi bonus vào một bảng không còn ai đọc để chặn. **Nợ kỹ thuật đã
   ghi vào `PROGRESS.md`** — dọn ở đợt riêng, không gộp vào PR này.

## Bằng chứng kiểm chứng

| Cổng (CLAUDE.md §8) | Kết quả                            |
| ------------------- | ---------------------------------- |
| `npm run build`     | ✅ (client + hub + server)         |
| `npm run typecheck` | ✅ 0 lỗi (4 project)               |
| `npm run lint`      | ✅ 0 cảnh báo (`--max-warnings 0`) |
| `npm run format`    | ✅ Prettier đã chạy                |
| `npm test`          | ✅ 577 file / 12.194 test          |

Tiêu chí chấp nhận §④ của đặc tả:

| #   | Tiêu chí                                                        | Kiểm ở đâu                                                                        |
| --- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 1   | Free lần thứ 31/ngày bị chặn (hạn mức 30, TỔNG mọi mode)        | `packages/core-billing/usage.test.ts` — limit=30 truyền vào `consume_usage_total` |
| 2   | Plus/Pro còn hạn → `vip`, `plan_expires_at` KHÔNG đổi           | `plan.test.ts` + migration `0076` lệnh ①                                          |
| 3   | Plus/Pro hết hạn → `free` hạn mức 30                            | `plan.test.ts` + migration `0076` lệnh ②                                          |
| 4   | `POST /api/checkout` `plan='pro'`/`'plus'` → 400, `'vip'` → 200 | `apps/server/src/api/billing/checkout.test.ts`                                    |
| 5   | Trang Nâng cấp không còn chữ "Pro"/"Plus"                       | `UpgradeSection.tsx` + `Pricing.tsx` (chỉ còn 2 cột Free/VIP)                     |
| 6   | Toàn bộ cổng §8 xanh                                            | bảng trên                                                                         |

**Chưa kiểm được trên DB thật:** phiên này KHÔNG có kết nối Postgres nào (không `DATABASE_URL`,
không container DB), nên chưa chạy `select plan, count(*) from public.profiles group by 1;` và
chưa export CSV backup. Migration viết lũy đẳng và an toàn với cả trường hợp **không có hàng
Plus/Pro nào**; `scripts/deploy.sh` tự áp khi merge vào `main`. **Việc cần làm tay trước khi
merge** đã ghi vào `PROGRESS.md`: chạy `\copy ... to 'backup-plans-2026-09-12.csv'` trên VPS.

## Tài liệu đã cập nhật

- `CLAUDE.md` §6 — sửa mô tả sai "3 gói pro/plus/vip" thành **2 gói free/vip**.
- `PROGRESS.md` — trạng thái GĐ1 + nợ kỹ thuật (kho lượt trượt mồ côi, backup CSV trước migration).
- `docs/specs/2026-09-12-gd1-xoa-goi-pro.md` — điền mục **Nghiệm thu**.
- `postgres/migrations/README.md` — dòng mô tả `0076`.
