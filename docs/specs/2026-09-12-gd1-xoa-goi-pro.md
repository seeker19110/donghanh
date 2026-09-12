# Đặc tả GĐ1 — Xoá gói Pro/Plus, dự án miễn phí với hạn mức Plus cũ

**Ngày:** 2026-09-12 · **Trạng thái:** ✅ Đã chốt phương án (xem §0.1) — sẵn sàng thi hành ở
phiên sau · **Người quyết:** chủ dự án

> Khuôn: `docs/templates/dac-ta-tinh-nang.md`. Thi hành ở phiên sau, MỘT PR.

## 0. Một câu

Xoá gói **Pro** và **Plus** khỏi sản phẩm: mọi người dùng **Free** được hưởng thẳng hạn mức
lượt/ngày của **Plus** cũ (30 lượt/ngày) mà không phải trả tiền; **VIP** là gói trả phí duy nhất
(thêm quyền "học tự do" ở GĐ2).

## 0.1. Quyết định đã chốt (chủ dự án, 2026-09-12)

Khi khảo sát mã phát hiện hệ thống thực tế có **BỐN** gói chứ không phải ba như `CLAUDE.md` mục 6
mô tả:

```
packages/core-billing/plan.ts:3   export type Plan = 'free' | 'plus' | 'pro' | 'vip'
packages/core-billing/prices.ts:6 export type PayablePlan = 'plus' | 'pro' | 'vip'   ← bán được cả 3
packages/core-billing/usage.ts:156 const limit = plan === 'plus' ? 30 : limits[plan] ← Plus hard-code 30
```

**Chốt:** xoá **cả Pro và Plus**, chỉ còn **Free + VIP**. Hạn mức của Free = **hạn mức Plus cũ =
30 lượt/ngày** (KHÔNG phải `pro_daily_limit`).

**Hệ quả cần chú ý khi thi hành:**

1. Con số 30 hiện **hard-code** trong `usage.ts` dòng 156, còn `pro_daily_limit` thì **cấu hình
   được** qua `/admin-settings`. Chọn hạn mức Plus nghĩa là Free mặc định 30. **Nên** chuyển 30
   này thành giá trị cấu hình được (tái dùng cột `pro_daily_limit` sẵn có, đổi ý nghĩa thành
   "hạn mức người dùng miễn phí") thay vì để hard-code — nếu không, muốn đổi hạn mức toàn hệ
   thống lại phải deploy.
2. **Phải kiểm dữ liệu thật trước khi chạy migration** để biết có bao nhiêu người đang ở Plus/Pro:
   `select plan, count(*) from public.profiles group by 1;`
3. Người đang trả tiền ở **cả Plus lẫn Pro** còn hạn → nâng VIP giữ nguyên `plan_expires_at`.

## ① Phạm vi

### LÀM

1. Người dùng gói `free` được hưởng hạn mức tổng/ngày **bằng hạn mức Plus cũ (30/ngày)**, thay
   cho cơ chế kho lượt cửa sổ trượt 7 ngày hiện tại. Con số này nên trở thành **cấu hình được**
   (dùng lại cột `pro_daily_limit`, đổi ý nghĩa) thay vì hard-code như hiện nay.
2. `pro` và `plus` không còn **bán được** và không còn là gói hợp lệ.
3. **Di trú người đang trả tiền:** mọi user có `plan in ('plus','pro')` và `plan_expires_at` còn
   hạn → chuyển thành `plan = 'vip'`, **giữ nguyên `plan_expires_at`** (người dùng chốt:
   "nâng thành VIP tới hết hạn đã trả").
4. Gỡ Pro/Plus khỏi giao diện: trang Nâng cấp, admin (hạn mức, ma trận tính năng, cấp gói,
   nội dung marketing), banner hết hạn.

### KHÔNG làm (để GĐ khác)

- **Không** đụng luật mở khoá bài học — đó là GĐ2/GĐ3/GĐ4.
- **Không** xoá cột/bảng dữ liệu lịch sử (`payments.plan='pro'`, `plan_prices` dòng pro…) — chỉ
  ngừng đọc/bán. Xoá dữ liệu là thao tác không hoàn tác được (CLAUDE.md mục 12).
- **Không** đổi giá VIP.

## ② Điểm chạm (đã đọc mã xác minh 2026-09-12)

| File                                                                      | Sửa gì                                                                                                                                                                                                                |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core-billing/plan.ts`                                           | `type Plan` còn `'free' \| 'vip'`; `normalizePlan` map `'plus'`/`'pro'` cũ trong DB → `'vip'` nếu còn hạn, ngược lại `'free'`                                                                                         |
| `packages/core-billing/usage.ts`                                          | Nhánh `free` hiện dùng `consume_rolling_credit` (kho trượt 7 ngày) → chuyển sang `consume_usage_total` với **hạn mức Free = 30** (Plus cũ). Bỏ nhánh hard-code `plan === 'plus' ? 30` — con số 30 chuyển vào cấu hình |
| `packages/core-billing/prices.ts`                                         | `PayablePlan` chỉ còn `'vip'`                                                                                                                                                                                         |
| `packages/core-db/settings.ts`                                            | `limits.pro` đổi ý nghĩa thành **hạn mức của Free**, giá trị mặc định **30** (giữ tên cột DB `pro_daily_limit` để **không cần migration cột**, ghi comment giải thích rõ vì sao tên cột không khớp ý nghĩa)           |
| `apps/server/src/api/billing/checkout.ts`                                 | `z.enum(['plus','pro','vip'])` → `z.enum(['vip'])`                                                                                                                                                                    |
| `apps/server/src/api/admin/admin-grant-plan.ts`, `admin-plan-features.ts` | enum gói còn `['free','vip']`                                                                                                                                                                                         |
| `apps/server/src/api/_lib/planExpiry.ts`                                  | `where plan in ('plus','pro','vip')` → `in ('vip')`                                                                                                                                                                   |
| `apps/server/src/api/_lib/{referral,achievementRewards,quests}.ts`        | Phần thưởng đang cấp "ngày Pro" → cấp "ngày VIP"                                                                                                                                                                      |
| `apps/dhcb/src/components/UpgradeSection.tsx`                             | Bảng so sánh còn 2 cột Free/VIP                                                                                                                                                                                       |
| `apps/dhcb/src/components/PlanExpiryBanner.tsx`                           | Bỏ nhánh nhãn Plus/Pro                                                                                                                                                                                                |
| `apps/dhcb/src/components/admin/*Panel.tsx` (7 file)                      | Bỏ cột/ô Pro (+Plus)                                                                                                                                                                                                  |
| `postgres/migrations/00NN_*.sql`                                          | Migration di trú dữ liệu, xem §③                                                                                                                                                                                      |

Chạy `npm run codemap -- impact <file>` cho `plan.ts` và `usage.ts` **trước khi sửa** — đây là
hai file hotspot.

## ③ Hợp đồng dữ liệu

**Migration (lũy đẳng, có rollback note):**

```sql
-- Nâng người đang trả Plus/Pro còn hạn thành VIP, giữ nguyên hạn đã trả.
update public.profiles
   set plan = 'vip'
 where plan in ('plus', 'pro')
   and plan_expires_at is not null
   and plan_expires_at > now();

-- Người Plus/Pro đã HẾT hạn → free (dọn giá trị chết, resolvePlan vốn đã coi là free).
update public.profiles
   set plan = 'free'
 where plan in ('plus', 'pro')
   and (plan_expires_at is null or plan_expires_at <= now());

-- Ngừng bán: ẩn dòng giá của gói không còn bán (GIỮ dữ liệu lịch sử, không xoá).
-- (tuỳ cấu trúc plan_prices thật — kiểm trước khi viết, có thể chỉ cần bỏ ở tầng ứng dụng)
```

**Rollback:** không khôi phục được nguyên trạng gói cũ từ bảng `profiles` (giá trị đã bị ghi đè).
Vì vậy **BẮT BUỘC** export trước khi chạy:
`\copy (select id, plan, plan_expires_at from public.profiles where plan in ('plus','pro')) to 'backup-plans-2026-09-12.csv' csv header`

## ④ Tiêu chí chấp nhận (đo được)

1. User `plan='free'` gọi `/api/agent` lần thứ 31 trong ngày → bị chặn (hạn mức Free = 30 = Plus
   cũ), lần thứ 30 → qua. Test tích hợp trên `consume_usage_total`.
2. User `plan='pro'` **hoặc `plan='plus'`**, `plan_expires_at = now() + 10 ngày` sau migration → đọc ra `plan='vip'`,
   `plan_expires_at` **không đổi**.
3. User `plan='pro'`/`plan='plus'` đã hết hạn sau migration → `plan='free'` với hạn mức 30/ngày.
4. `POST /api/checkout` với `plan='pro'` hoặc `plan='plus'` → **400** (Zod từ chối), `plan='vip'` → 200.
5. Trang Nâng cấp không còn chữ "Pro" lẫn "Plus" (trừ phần lịch sử giao dịch nếu có).
6. Toàn bộ cổng CLAUDE.md mục 8 xanh; coverage không tụt dưới sàn hiện hành.

## ⑤ Bất biến không được phá

- **Không ai đang trả tiền bị mất quyền lợi đã mua.** Test canh: user Plus/Pro còn hạn luôn ra
  VIP với đúng `plan_expires_at` cũ.
- **Không tin client:** hạn mức vẫn kiểm ở server (`usage.ts`), client chỉ hiển thị.
- **Fail-open của `checkAndConsumeUsage` giữ nguyên** (lỗi hạ tầng → cho qua, không chặn nhầm).
- Ranh giới ngày vẫn theo giờ VN; `refund_usage` vẫn hoàn đúng `day` gốc (bẫy đã ghi ở
  `usage.ts` dòng 170+ — **đừng làm hỏng lại**).

## ⑥ Quy ước dự án liên quan

- Tiêu đề PR: `refactor(billing): ...` hoặc `feat(billing): ...` — nếu dùng `feat(` thì mô tả PR
  phải trỏ tới **chính file đặc tả này** kèm cụm "Approved for implementation" (CLAUDE.md mục 11).
- Migration đặt ở `postgres/migrations/`, **phải thêm dòng mô tả vào
  `postgres/migrations/README.md`** — quên là `scripts/migrations-readme-coverage.test.ts` đỏ
  (đã dính đúng bẫy này ở PR #883).
- Nhật ký: một file mới trong `docs/changelog/` (`npm run changelog` in số kế tiếp).
- Cập nhật `CLAUDE.md` mục 6 (đang ghi sai là 3 gói) và `PROGRESS.md`.

## Nghiệm thu (điền sau khi thi hành)

**Đã thi hành 2026-09-12** — xem `docs/changelog/0289-2026-09-12-gd1-xoa-goi-pro-plus.md`.

- [x] §0.1 đã chốt: xoá cả Pro lẫn Plus; Free hưởng hạn mức Plus cũ (30/ngày) — chủ dự án, 2026-09-12
- [ ] ~~Đã chạy `select plan, count(*) from public.profiles group by 1;`~~ — **KHÔNG chạy được:
      phiên thi hành không có DB thật** (không `.env`, không `DATABASE_URL`, `pg_isready` không
      phản hồi). Đã thi hành theo hướng **migration lũy đẳng an toàn với cả trường hợp không có
      dữ liệu Pro/Plus nào**: cả 3 lệnh trong `0076_remove_pro_plus_plans.sql` đều là
      `update ... where` theo điều kiện "chưa di trú", chạy trên DB rỗng hoặc chạy lại lần hai
      đều không đổi thêm hàng nào. Ngoài ra `normalizePlan()` được viết để **chịu được hàng
      `'plus'`/`'pro'` lọt lưới migration** (coi như VIP, rồi `resolvePlan` kiểm hạn) nên kể cả
      migration chưa chạy, không ai đang trả tiền bị mất quyền lợi.
- [ ] **Đã export CSV backup trước migration — CHƯA LÀM, việc cần làm TAY trên VPS trước khi
      merge.** Lệnh ghi sẵn ở đầu file migration và ở `PROGRESS.md` mục "⚠️ Cần làm tay / A".
- [x] 6 tiêu chí §④ đạt — bảng đối chiếu từng tiêu chí kèm nơi kiểm nằm ở changelog `0289`.
      Cổng CLAUDE.md §8: build ✅ · typecheck ✅ · lint ✅ (0 cảnh báo) · format ✅ ·
      test ✅ 577 file / 12.194 test.

### Quyết định phát sinh ngoài chữ của đặc tả (ghi lại để rà)

Đặc tả không nói gì về **khuyến mãi** (`effectivePlan`). Mất bậc Pro thì "nâng đúng 1 bậc" chỉ
có thể là Free → VIP. Với **hạn mức** điều đó đúng ý; với **quyền giọng** thì KHÔNG: giọng Studio
$24/1 triệu ký tự, không có hạn mức miễn phí — mở cho toàn bộ Free trong một đợt khuyến mãi là
rủi ro chi phí thật, và repo vốn đã có test canh đúng điều đó. Đã thêm `PROMO_FREE_VOICES` ở cả
`packages/core-ai/voiceAccess.ts` lẫn `apps/dhcb/src/lib/voiceTiers.ts` = đúng bộ giọng Free từng
được nâng lên trước GĐ1 → chi phí giọng không đổi. Nếu chủ dự án muốn khuyến mãi mở luôn giọng
VIP cho Free thì xoá hai hằng số đó là xong.
