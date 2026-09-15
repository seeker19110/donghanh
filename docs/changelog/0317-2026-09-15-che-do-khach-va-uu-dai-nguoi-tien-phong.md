# 0317 — 2026-09-15 — Chế độ Khách (xem web không cần đăng nhập) + Ưu đãi 2026 Người tiên phong

**PR:** (đợt này) · **Nhánh:** `claude/dazzling-meitner-t8rtlp`

Hai hạng mục người dùng chốt trong cùng một phiên, gộp vào một PR vì hạng mục thứ hai chạm đúng
những file hạng mục thứ nhất vừa mở ra (`ensureProfileRow`, kiểu `User` phía client).

Đặc tả: `docs/specs/2026-09-15-mo-xem-web-khong-can-dang-nhap.md` ·
`docs/specs/2026-09-15-uu-dai-2026-nguoi-tien-phong.md` (cả hai **Approved for implementation**).

---

## A. Chế độ Khách

### Việc đã làm

1. **Danh tính khách** (`packages/core-ui/guestId.ts`): uid ổn định dạng `guest_<uuid>` lưu
   localStorage. Có bộ nhớ đệm trong tiến trình để Safari chế độ riêng tư (chặn localStorage)
   không sinh id mới mỗi lần gọi — nếu không, hạn mức dùng thử mất tác dụng hoàn toàn.
2. **Khách chạy được mà không phải sửa từng trang.** `AuthProvider` cấp một `User` ảo mang uid
   khách khi không có phiên. Mọi module tiến độ sẵn có đã nhận `uid: string` và ghi localStorage
   theo `<tiền tố>_<uid>`, nên chúng hoạt động nguyên vẹn. Đây là quyết định kiến trúc quan
   trọng nhất của đợt: phương án thay thế (truyền cờ `isGuest` xuống từng trang) đụng hàng chục
   file và chắc chắn sót chỗ.
3. **Tách hai lớp bảo vệ route** trong `App.tsx`: `AllowGuest` (nội dung học/đọc — 38 route) và
   `RequireAccount` (hồ sơ, nâng cấp gói, bạn bè, tin nhắn, lịch sử, tiến độ, sổ lỗi, thử thách,
   nhiệm vụ, quản trị, các studio cá nhân Kanban/Canvas/Wheel/LifeGraph — 21 route, không đổi
   hành vi).
4. **Nhánh dùng thử ở 3 endpoint AI/audio.** `resolveActor()` (`packages/core-auth/guest.ts`)
   trả về `user` hoặc `guest`; `checkAndConsumeActorUsage()` (`actorUsage.ts`) là MỘT cửa duy
   nhất để trừ/hoàn lượt. Khách: **3 lượt/ngày** theo `X-Guest-Id` + **trần 15/ngày** theo IP.
   TTS chỉ tính lượt ở đường **tạo audio mới** — cache HIT miễn phí nên khách vẫn nghe thoải mái
   câu đã có sẵn.
5. **Hợp nhất tiến độ khi đăng ký/đăng nhập** (`apps/dhcb/src/lib/guestProgress.ts`), móc vào
   `AuthProvider.refresh()` nên **mọi** đường đăng nhập (email, Google, Facebook, Apple,
   Microsoft, OAuth redirect) đều đi qua, không thể quên đường nào. Hợp nhất union ở client rồi
   `pushProgressAsync()` để server hợp nhất tiếp bằng `api/_lib/progressMerge.ts` — cơ chế union
   sẵn có, không viết lại.
6. **Chặn mọi đường đồng bộ server cho khách** (`progressSync.ts`, `cloud.ts`,
   `programmingProgress.ts`) — khách không có phiên, gọi lên chỉ sinh 401 rác.
7. **`GuestBanner`** mời đăng ký, đóng được, nhớ trong phiên; màu theo token `--a-*`.

### Quyết định

- **Không nới `validateAuth()` ở đâu cả.** Ba endpoint AI/audio nhận THÊM một nhánh khách, không
  bỏ nhánh cũ. Mọi endpoint có dữ liệu cá nhân/thanh toán/admin giữ nguyên 100%. Luật chống gian
  lận `cefrUnlocked` tính ở server (GĐ2a) không bị chạm.
- **`guestTrial.ts`/`actorUsage.ts` đặt ở `core-auth` chứ không phải `core-billing`** — dù về
  nghĩa chúng là "hạn mức". Lý do kỹ thuật: `core-auth` ĐÃ phụ thuộc `core-billing`, đặt ngược
  lại tạo vòng phụ thuộc và `tsc -b` (project references) từ chối biên dịch.
- **Bộ đếm ngày dùng Redis, không thêm migration.** Khách không có hàng nào trong `profiles`.
  Redis hỏng → rơi về Map in-memory: **chặt hơn** chứ không fail-open, vì đây là lượt tốn tiền
  của người chưa đăng nhập.
- **Chấp nhận khách tự sửa localStorage của chính họ để mở khoá sớm.** Không có điểm/tiền/xếp
  hạng gắn với danh tính khách. Đã ghi vào nợ kỹ thuật `PROGRESS.md` như một nhánh **cố ý không
  đóng**, kèm lý do, để lần siết sau không kéo nhầm phần khách vào.

---

## B. Ưu đãi "Người tiên phong" — 2026 tài khoản đầu tiên, VIP vĩnh viễn

### Việc đã làm

1. **Migration `0080_founder_lifetime_vip.sql`** (lũy đẳng, rollback ghi ở đầu file): cột
   `profiles.is_founder`, index một phần để đếm hạn ngạch, hàm
   `grant_founder_if_available(user_id, limit)` có khoá tư vấn, và backfill xếp toàn bộ `users`
   theo `(created_at, id)` tăng dần.
2. **Cấp bù cho người đăng ký sau**: `ensureProfileRow()` gọi hàm trên khi hồ sơ được tạo lần
   đầu — nếu lúc migration chạy tổng tài khoản còn dưới 2026 thì người tiếp theo vẫn được cấp,
   cho tới khi đủ suất.
3. **Huy hiệu** ở `/trang-ca-nhan`, `isFounder` đi một chiều server → UI.

### Quyết định

- **KHÔNG thêm nhánh kiểm quyền VIP nào.** Đã đọc `packages/core-billing/plan.ts` như brief yêu
  cầu: `plan_expires_at IS NULL` **đã** mang nghĩa "vĩnh viễn" cho gói trả phí (`resolvePlan`
  trả 'vip' bất kể `now`), `computePlanGrant` có sẵn bất biến §3 "gói vĩnh viễn là cao nhất,
  không đụng vào", và `downgradeExpiredPlans()` chỉ hạ hàng có hạn KHÔNG null. Nghĩa là mọi
  nhánh "user này có phải VIP không" đã đúng sẵn — thêm `if (isFounder)` ở đó sẽ tạo nguồn sự
  thật thứ hai cho quyền trả phí, đúng thứ phải tránh nhất.
- **Vẫn thêm cột `is_founder`**, nhưng cho việc khác: trả lời "VÌ SAO vĩnh viễn" (tiên phong vs
  whitelist vs admin cấp tay) và "đã cấp bao nhiêu suất". Đếm hạn ngạch bằng "vip + hạn null" sẽ
  đếm nhầm hai nhóm kia.
- **Người đang trả tiền có hạn được nâng thẳng lên vĩnh viễn** (ghi đè `plan_expires_at` thành
  NULL) — không ai thiệt. Từ đó mọi lần gia hạn SePay về sau giữ nguyên trạng thái vĩnh viễn.
- **Tie-break bằng `id`** trong cả SQL lẫn TS. Thiếu nó, hai lần chạy có thể chọn ra hai tập
  khác nhau khi trùng `created_at` — tức là **không** lũy đẳng.
- **FAIL-SAFE đúng chiều**: lỗi hạ tầng lúc cấp → KHÔNG cấp. Cấp nhầm một suất vĩnh viễn không
  lấy lại được; bỏ sót thì lần đăng nhập sau cấp bù.

---

## Bằng chứng kiểm chứng

```
typecheck ✅ · lint ✅ (0 cảnh báo) · format ✅ · build ✅
test ✅ — 12.424 test cũ + 63 test mới:
  packages/core-auth/guest.test.ts        (12) — từ chối id chứa ':' / khoảng trắng / sai tiền tố
  packages/core-auth/guestTrial.test.ts   (8)  — hạn mức khách < Free; chặn IP thì HOÀN lượt id
  packages/core-billing/founder.test.ts   (14) — mốc 2025/2026/2027; SePay không hạ lifetime
  apps/dhcb/src/lib/guestProgress.test.ts (29) — union không mất dữ liệu; khoá bậc không lỏng hơn
```

## Rủi ro đã biết

- `getAuthHeader()` là điểm nóng (mọi lời gọi API client). Thay đổi chỉ THÊM header khi **không
  có** token — đường đã đăng nhập không đổi một byte, có test canh cả hai nhánh.
- Migration 0080 ghi đè `plan`/`plan_expires_at` của 2026 tài khoản đầu. Chỉ theo chiều **nâng**
  (lên VIP vĩnh viễn), không có chiều hạ.
