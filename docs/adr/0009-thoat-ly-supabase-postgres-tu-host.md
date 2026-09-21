# ADR-0009: Rời Supabase, tự host PostgreSQL trên VPS

- **Trạng thái:** Đã chấp nhận
- **Ngày:** 2026-08 (hồi cứu — ghi lại 2026-09-21 theo chốt `/adr`; quyết định thật đã thi hành
  trước đó, xem `docs/migration-thoat-ly-supabase.md` cho chi tiết kỹ thuật đầy đủ)

## Bối cảnh

Dự án khởi đầu dùng Supabase (Postgres quản lý + Auth + Row Level Security) để đi nhanh giai
đoạn đầu. Khi lượng dữ liệu/chi phí tăng và cần kiểm soát hạ tầng sát hơn (backup, chi phí biến
động theo tier Supabase, phụ thuộc dịch vụ bên thứ ba cho một sản phẩm vốn tối thiểu), cần quyết
định có tiếp tục phụ thuộc Supabase hay tự vận hành.

## Quyết định

Rời hẳn Supabase. Tự host **PostgreSQL trên VPS** (thư viện `pg`, `packages/core-db/pgPool.ts`).
Auth tự viết (Bearer token, `packages/core-auth/`) thay Supabase Auth. Kiểm quyền chuyển từ Row
Level Security của Supabase sang **mọi handler API tự kiểm `user_id` khớp token qua
`validateAuth()` trước khi query Postgres** (CLAUDE.md mục 4.2).

## Lý do

- Chi phí VPS tự host dự đoán được và rẻ hơn ở quy mô hiện tại (dự án vốn tối thiểu).
- Kiểm soát backup/restore trực tiếp (đã kiểm chứng cả hai chiều, xem PROGRESS.md) thay vì phụ
  thuộc SLA/tính năng backup của Supabase.
- Không còn phụ thuộc một nhà cung cấp có thể đổi giá/tính năng/chính sách ngoài tầm kiểm soát.
- Đánh đổi (RLS → kiểm tay ở handler) chấp nhận được vì đã có kỷ luật bắt buộc `validateAuth()`
  ở mọi handler, không để lộ khoảng trống bảo mật.

## Các phương án đã cân nhắc

- **Giữ Supabase, chỉ nâng tier:** đơn giản nhất, nhưng không giải quyết phụ thuộc nhà cung cấp
  và chi phí vẫn tăng theo lượng dữ liệu — không chọn.
- **Chuyển sang PaaS Postgres khác (Neon/RDS...):** vẫn là dịch vụ quản lý, chi phí/độ phụ thuộc
  tương tự Supabase, không giải quyết mục tiêu kiểm soát hạ tầng — không chọn.
- **Tự host trên VPS (đã chọn):** tốn công vận hành (migration, backup, PM2/Nginx) nhưng khớp
  ràng buộc vốn tối thiểu + kiểm soát trực tiếp; dự án đã có kinh nghiệm VPS cho phần deploy.

## Hệ quả

- Tích cực: chi phí thấp và ổn định hơn, toàn quyền backup/restore, không khóa nhà cung cấp.
- Đánh đổi/rủi ro: tự chịu trách nhiệm vận hành DB (patch bảo mật, sao lưu, mở rộng khi tải
  tăng); mất RLS nên bảo mật phụ thuộc hoàn toàn vào kỷ luật `validateAuth()` ở từng handler —
  phải giữ nguyên tắc này bất biến (đã ghi CLAUDE.md mục 4.2).
- Việc tiếp theo: theo dõi nợ "mã hoá dữ liệu cũ chưa xong" (PROGRESS.md nợ mở #10) — độc lập
  với ADR này nhưng cùng mạch bảo mật dữ liệu tự host.
