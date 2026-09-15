-- 0080_founder_lifetime_vip.sql — "Ưu đãi Người tiên phong": 2026 tài khoản ĐẦU TIÊN trong
-- toàn bộ lịch sử được VIP VĨNH VIỄN.
--
-- Đặc tả: docs/specs/2026-09-15-uu-dai-2026-nguoi-tien-phong.md
--
-- ── VÌ SAO CÓ CỘT RIÊNG `is_founder` ─────────────────────────────────────────────────────
-- "VIP vĩnh viễn" vốn đã biểu diễn được bằng `plan='vip' AND plan_expires_at IS NULL`
-- (xem packages/core-billing/plan.ts → resolvePlan, và computePlanGrant bất biến §3 "gói vĩnh
-- viễn là cao nhất, không đụng vào"). Cột này KHÔNG phải để biểu diễn lại điều đó, mà để trả
-- lời hai câu hỏi mà cặp (plan, plan_expires_at) không trả lời được:
--   1. VÌ SAO người này là VIP vĩnh viễn? (tiên phong, hay whitelist, hay admin cấp tay) —
--      cần cho huy hiệu trên giao diện và cho việc đối soát sau này.
--   2. Đã cấp bao nhiêu suất rồi? Hạn ngạch 2026 phải đếm được; đếm theo "vip + hạn null" sẽ
--      đếm nhầm cả VIP whitelist và VIP admin cấp tay vĩnh viễn.
--
-- ── LŨY ĐẲNG ─────────────────────────────────────────────────────────────────────────────
-- Chạy lại nhiều lần cho cùng kết quả: tập "2026 tài khoản đầu" được xác định bằng thứ tự
-- (created_at, id) trên bảng `users` — thứ tự này KHÔNG đổi khi có người đăng ký thêm (người
-- mới luôn xếp sau), nên lần chạy thứ hai cập nhật đúng đúng những dòng đã có.
--
-- ── ROLLBACK ─────────────────────────────────────────────────────────────────────────────
-- Gỡ ưu đãi (CHỈ khi thật sự cần — đây là quyền lợi đã hứa với người dùng):
--   update public.profiles set plan = 'free', plan_expires_at = null where is_founder;
--   alter table public.profiles drop column if exists is_founder;
--   drop function if exists public.grant_founder_if_available(uuid, int);
-- Bỏ cột mà KHÔNG hạ gói (an toàn hơn, người dùng giữ nguyên quyền lợi đã cấp):
--   alter table public.profiles drop column if exists is_founder;

alter table public.profiles
  add column if not exists is_founder boolean not null default false;

-- Đếm hạn ngạch nhanh (và chỉ đếm người tiên phong, không quét cả bảng).
create index if not exists profiles_is_founder_idx
  on public.profiles (is_founder) where is_founder;

-- ── Cấp suất cho MỘT tài khoản, nếu hạn ngạch còn ────────────────────────────────────────
-- Gọi từ `ensureProfileRow()` mỗi khi một hồ sơ được tạo lần đầu (packages/core-auth/
-- authService.ts). Nhờ vậy nếu lúc migration chạy tổng số tài khoản còn DƯỚI 2026 thì người
-- đăng ký tiếp theo vẫn được cấp, cho tới khi đủ 2026 — đúng yêu cầu.
--
-- `p_limit` truyền từ TypeScript (FOUNDER_LIMIT ở packages/core-billing/founder.ts) để con số
-- chỉ có MỘT nguồn sự thật, không phải sửa hai chỗ.
create or replace function public.grant_founder_if_available(p_user_id uuid, p_limit int)
returns boolean
language plpgsql
as $$
declare
  v_used int;
begin
  -- Đã là người tiên phong → không làm gì, trả true (lũy đẳng, gọi lại bao nhiêu lần cũng được).
  if exists (select 1 from public.profiles where id = p_user_id and is_founder) then
    return true;
  end if;

  -- Khoá theo transaction: hai lượt đăng ký ĐỒNG THỜI lúc còn đúng 1 suất không được cùng
  -- nhìn thấy "còn chỗ" rồi cùng cấp (cấp thừa suất thứ 2027).
  perform pg_advisory_xact_lock(hashtext('dhcb_founder_quota'));

  select count(*) into v_used from public.profiles where is_founder;
  if v_used >= p_limit then
    return false;
  end if;

  -- VIP vĩnh viễn = plan 'vip' + plan_expires_at NULL. Ghi đè hạn cũ là ĐÚNG Ý: người đang
  -- trả tiền VIP có hạn mà nằm trong nhóm tiên phong được nâng thẳng lên vĩnh viễn, không
  -- thiệt (yêu cầu người dùng chốt 2026-09-15). Từ đó computePlanGrant() giữ nguyên trạng
  -- thái vĩnh viễn ở mọi lần gia hạn sau, và downgradeExpiredPlans() bỏ qua vì hạn là NULL.
  update public.profiles
     set is_founder = true,
         plan = 'vip',
         plan_expires_at = null
   where id = p_user_id;

  return found;
end;
$$;

-- ── Cấp hàng loạt cho các tài khoản ĐÃ CÓ ────────────────────────────────────────────────
-- 2026 = hạn ngạch, khớp FOUNDER_LIMIT ở packages/core-billing/founder.ts.
-- Tie-break bằng `id` để thứ tự ổn định tuyệt đối khi nhiều tài khoản trùng `created_at`
-- (giây đầu tiên sau khi seed dữ liệu, chẳng hạn) — thiếu nó thì hai lần chạy có thể chọn ra
-- hai tập khác nhau, tức là KHÔNG lũy đẳng.
with ranked as (
  select u.id, row_number() over (order by u.created_at, u.id) as rn
  from public.users u
)
insert into public.profiles (id, plan, plan_expires_at, is_founder)
select r.id, 'vip', null, true
from ranked r
where r.rn <= 2026
on conflict (id) do update
  set is_founder = true,
      plan = 'vip',
      plan_expires_at = null;
