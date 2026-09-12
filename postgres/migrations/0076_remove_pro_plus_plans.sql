-- postgres/migrations/0076_remove_pro_plus_plans.sql
-- GĐ1 — Xoá gói Pro/Plus, dự án miễn phí với hạn mức Plus cũ.
-- Đặc tả: docs/specs/2026-09-12-gd1-xoa-goi-pro.md (chủ dự án chốt 2026-09-12).
--
-- Từ nay hệ thống CHỈ còn 2 gói: 'free' (miễn phí, hạn mức = hạn mức Plus cũ = 30 lượt/ngày)
-- và 'vip' (gói trả phí duy nhất). Migration này DI TRÚ DỮ LIỆU cho khớp:
--
--   1. Ai đang trả tiền gói Plus/Pro và CÒN HẠN  → 'vip', GIỮ NGUYÊN plan_expires_at.
--      Bất biến của đặc tả §⑤: không ai đang trả tiền bị mất quyền lợi đã mua. Họ được nâng
--      lên gói cao hơn cho tới đúng ngày đã trả, không bị rút ngắn hay kéo dài.
--   2. Ai ở Plus/Pro nhưng ĐÃ HẾT HẠN         → 'free' (dọn giá trị chết; `resolvePlan()` ở
--      packages/core-billing/plan.ts vốn đã coi những hàng này là free ngay lúc đọc, nên đây
--      chỉ là dọn dẹp cho cột `plan` phản ánh đúng thực tế — không đổi quyền lợi của ai).
--   3. Hạn mức Free lấy từ cột `app_settings.pro_daily_limit` — CỐ Ý GIỮ TÊN CỘT CŨ để không
--      phải đổi tên cột (đổi tên là thao tác rủi ro, phải sửa đồng bộ cả API lẫn panel admin).
--      Ý nghĩa mới của cột: "hạn mức lượt AI mỗi ngày của người dùng MIỄN PHÍ". Đặt về 30 nếu
--      đang nhỏ hơn 30 — không hạ xuống nếu admin đã cố ý đặt cao hơn.
--
-- KHÔNG XOÁ dữ liệu lịch sử (đặc tả §① "KHÔNG làm"): giữ nguyên `payments.plan = 'pro'`,
-- các dòng `plan_prices`/`plan_marketing_*`/`plan_feature_flags` của gói cũ. Tầng ứng dụng đã
-- ngừng đọc chúng (packages/core-billing/prices.ts, planMarketing.ts, planFeatures.ts lọc theo
-- danh sách gói còn tồn tại), nên để lại chỉ tốn vài dòng bảng mà giữ được khả năng đối chiếu
-- kế toán với các đơn đã thanh toán.
--
-- LŨY ĐẲNG: cả 3 lệnh đều là `update ... where` theo điều kiện đã-hay-chưa-di-trú, chạy lại
-- lần hai không đổi thêm hàng nào. An toàn cả khi KHÔNG có hàng Plus/Pro nào (update 0 hàng).
--
-- ROLLBACK: KHÔNG khôi phục được nguyên trạng gói cũ từ `public.profiles` — giá trị 'plus'/'pro'
-- đã bị ghi đè. Vì vậy BẮT BUỘC export trước khi chạy trên DB thật:
--   \copy (select id, plan, plan_expires_at from public.profiles where plan in ('plus','pro'))
--     to 'backup-plans-2026-09-12.csv' csv header
-- Muốn lùi: nạp lại CSV đó và `update public.profiles set plan = b.plan,
--   plan_expires_at = b.plan_expires_at from <bảng tạm> b where profiles.id = b.id;`

-- ① Người đang trả Plus/Pro CÒN HẠN → VIP, giữ nguyên hạn đã trả.
update public.profiles
   set plan = 'vip'
 where plan in ('plus', 'pro')
   and plan_expires_at is not null
   and plan_expires_at > now();

-- ② Người Plus/Pro ĐÃ HẾT HẠN (hoặc không có hạn nào ghi nhận) → free.
--    Lưu ý thứ tự: chạy SAU ① nên những hàng còn hạn đã thành 'vip' và không lọt vào đây.
update public.profiles
   set plan = 'free'
 where plan in ('plus', 'pro')
   and (plan_expires_at is null or plan_expires_at <= now());

-- ③ Hạn mức Free (cột `pro_daily_limit`, ý nghĩa mới) — tối thiểu 30 = hạn mức Plus cũ.
update public.app_settings
   set pro_daily_limit = 30,
       updated_at = now()
 where id = 1
   and pro_daily_limit < 30;
