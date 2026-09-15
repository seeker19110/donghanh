# Đặc tả — "Ưu đãi Người tiên phong": 2026 tài khoản đầu tiên được VIP vĩnh viễn

> **Approved for implementation** — người dùng chốt qua hỏi đáp trong phiên 2026-09-15.
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`. Đi cùng PR với
> `docs/specs/2026-09-15-mo-xem-web-khong-can-dang-nhap.md`.

## 0. Một câu

2026 tài khoản **đầu tiên trong toàn bộ lịch sử** của nền tảng (tính cả người đã đăng ký từ
trước) được gói VIP **vĩnh viễn**, một lần theo mốc lịch sử — không phải cửa sổ trượt.

## ① Phạm vi

**LÀM:**

- Thêm cột `profiles.is_founder` — ghi nhận **vì sao** một người là VIP vĩnh viễn, và cho phép
  **đếm được hạn ngạch**.
- Migration lũy đẳng: xếp toàn bộ `users` theo `(created_at, id)` tăng dần, 2026 người đầu được
  `plan='vip'`, `plan_expires_at=NULL`, `is_founder=true`.
- Hàm SQL `grant_founder_if_available(user_id, limit)` có khoá tư vấn, gọi từ `ensureProfileRow()`
  khi hồ sơ được tạo lần đầu: nếu lúc migration chạy tổng số tài khoản còn **dưới** 2026 thì
  người đăng ký tiếp theo vẫn được cấp, cho tới khi đủ suất.
- Trả `isFounder` qua `/api/auth?action=me` + huy hiệu tối giản ở `/trang-ca-nhan`.

**KHÔNG LÀM:**

- **KHÔNG** thêm nhánh kiểm quyền VIP nào mới. "VIP vĩnh viễn" đã là trạng thái hợp lệ sẵn có
  (`plan='vip'` + `plan_expires_at IS NULL`); `resolvePlan()`, `computePlanGrant()` và
  `downgradeExpiredPlans()` đều đã xử lý đúng. Rải thêm `if (isFounder)` ở các nhánh kiểm quyền
  là tạo nguồn sự thật thứ hai — cấm.
- **KHÔNG** để client quyết định gì. `is_founder` chỉ đi MỘT chiều server → UI, để hiện huy hiệu.
- **KHÔNG** biến ưu đãi thành cửa sổ trượt: sau khi đủ 2026 suất, người thứ 2027 trở đi không
  được hưởng, mãi mãi.

## ② Điểm chạm

| Việc | Đường dẫn file                                         | Ghi chú                                     |
| ---- | ------------------------------------------------------ | ------------------------------------------- |
| Thêm | `postgres/migrations/0080_founder_lifetime_vip.sql`    | Cột + hàm SQL + backfill                    |
| Thêm | `packages/core-billing/founder.ts`                     | `FOUNDER_LIMIT`, `selectFounderIds` (thuần) |
| Sửa  | `packages/core-auth/authService.ts`                    | Cấp suất khi tạo hồ sơ; trả `isFounder`     |
| Sửa  | `packages/core-auth/auth.ts` · `core-ui/clientAuth.ts` | Đưa `isFounder` ra API/client               |
| Sửa  | `apps/dhcb/src/pages/core/Profile.tsx`                 | Huy hiệu                                    |

**Ảnh hưởng lan ra:** `ensureProfileRow()` là điểm nóng (mọi đường đăng nhập đi qua). Nhánh mới
chỉ chạy khi hồ sơ **vừa được tạo** (`rowCount > 0`), đúng chỗ nhánh whitelist VIP đang đứng —
người dùng cũ đăng nhập lại không đi vào nhánh này.

## ③ Hợp đồng dữ liệu

**Vào:**

```sql
public.grant_founder_if_available(p_user_id uuid, p_limit int) returns boolean
```

**Ra:**

```ts
// /api/auth?action=me
{
  /* … */ isFounder: boolean
}
```

**Ca lỗi:**

| Tình huống                      | Hành vi mong đợi                                              |
| ------------------------------- | ------------------------------------------------------------- |
| Hết hạn ngạch                   | Trả `false`, không ghi gì                                     |
| Hai lượt đăng ký đồng thời      | Khoá tư vấn — không bao giờ cấp quá `p_limit` suất            |
| Lỗi hạ tầng khi cấp             | FAIL-SAFE: **không** cấp; lần đăng nhập sau gọi lại và cấp bù |
| Gọi lại cho người đã là founder | Trả `true`, không ghi gì (lũy đẳng)                           |

## ④ Tiêu chí chấp nhận

- [x] Tổng 2025 tài khoản → tất cả được hưởng; 2026 → tất cả; 2027 → đúng 2026 người đầu.
      Test: `packages/core-billing/founder.test.ts`.
- [x] Thứ tự chọn khớp `order by created_at, id` của migration, kể cả khi trùng `created_at`.
- [x] Người đang trả tiền VIP có hạn, sau khi nâng lifetime, mọi lần gia hạn/hết hạn về sau
      KHÔNG kéo họ xuống free. Test: `founder.test.ts` mục "không bao giờ bị hạ xuống free".
- [x] Migration chạy lại lần hai cho cùng kết quả (lũy đẳng theo thiết kế: thứ tự `(created_at,
    id)` không đổi khi có người đăng ký thêm).

**Lệnh chứng minh:**

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                     | Test nào canh nó                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| Gói vĩnh viễn không bao giờ bị cấp/gia hạn làm thành có hạn  | `packages/core-billing/planGrant.test.ts` + `founder.test.ts` |
| `resolvePlan` coi (vip, hạn NULL) là VIP ở mọi mốc thời gian | `packages/core-billing/plan.test.ts` + `founder.test.ts`      |
| Không cấp quá `FOUNDER_LIMIT` suất                           | khoá tư vấn trong hàm SQL (migration 0080)                    |
| Quyền VIP vẫn tính ở SERVER, client không tự quyết           | `is_founder` chỉ đi một chiều server → UI                     |

## ⑥ Quy ước dự án liên quan

- Migration `NNNN_mo-ta-ngan.sql`, viết **lũy đẳng** (`if not exists`, `create or replace`), tự
  áp khi deploy — xem `postgres/migrations/README.md`.
- Logic nhạy cảm (quyền, thanh toán) chỉ ở server.
- Màu theo token `--a-*`; huy hiệu đạt AA.
- Comment tiếng Việt ở chỗ quan trọng; conventional commits.

---

## Nghiệm thu

- Lệnh đã chạy + kết quả thật: xem `## Validation` của PR.
- Còn để ngỏ: chưa có màn hình quản trị đếm "còn bao nhiêu suất" — admin tra bằng SQL
  (`select count(*) from public.profiles where is_founder`). Thêm sau nếu thật sự cần.
