-- postgres/migrations/0085_drop_career_startup_life.sql
-- Xoá HẲN dữ liệu ba trụ CAREER · STARTUP · LIFE (quyết định của chủ dự án, 2026-09-20).
--
-- Bối cảnh: 2026-09-20 (docs/changelog/0389-*.md) giao diện ba trụ này đã bị gỡ, backend cố ý
-- giữ lại vì Companion còn đọc read model của chúng. Nay chủ dự án chốt xoá luôn backend: service,
-- route API và BẢNG CSDL. Chấp nhận Companion mất khả năng tư vấn xuyên trụ ở ba mảng này.
--
-- ⚠️ KHÔNG HOÀN TÁC ĐƯỢC. Migration này XOÁ DỮ LIỆU THẬT của người dùng (hồ sơ sự nghiệp, kinh
-- nghiệm, mục tiêu, venture/giả định/bằng chứng khởi nghiệp, kế hoạch/thói quen/nhật ký sức khoẻ).
-- Đây là chủ ý, không phải sơ suất: người dùng đã đồng ý mất dữ liệu cũ. Muốn giữ thì phải
-- `pg_dump` các bảng dưới đây TRƯỚC khi deploy (xem docs/ke-hoach-khoi-phuc-su-co-server.md).
--
-- TRỤ "GHI CHÚ" (`work`) KHÔNG BỊ ĐỤNG TỚI. Lưu ý quan trọng: từ migration `0066_worklife_merge.sql`,
-- bảng của trụ Life KHÔNG còn nằm ở schema `life` nữa mà đã được chuyển vào CHUNG schema
-- `worklife` với bảng của trụ Work. Vì vậy ở đây KHÔNG được `drop schema worklife` — chỉ xoá đúng
-- 5 bảng của trụ Life, giữ nguyên `worklife.projects` · `tasks` · `meetings` · `documents`.
--
-- Lũy đẳng: mọi lệnh đều `if exists`, chạy lại lần hai không lỗi.

-- ── Trụ CAREER (schema riêng: career.profiles · experiences · goals, migration 0047) ──────────
drop table if exists career.goals cascade;
drop table if exists career.experiences cascade;
drop table if exists career.profiles cascade;
-- `restrict` để nếu còn sót đối tượng lạ trong schema thì migration BÁO LỖI chứ không xoá âm thầm.
drop schema if exists career restrict;

-- ── Trụ STARTUP (schema riêng: ventures · problems · hypotheses · evidence, migration 0049) ───
-- Xoá theo thứ tự ngược khoá ngoại: evidence → hypotheses → problems → ventures.
drop table if exists startup.evidence cascade;
drop table if exists startup.hypotheses cascade;
drop table if exists startup.problems cascade;
drop table if exists startup.ventures cascade;
drop schema if exists startup restrict;

-- ── Trụ LIFE (migration 0050, nay nằm trong schema `worklife` sau 0066) ───────────────────────
-- CHỈ 5 bảng này. Index/unique index (kể cả `uq_worklife_habit_logs_habit_day` thêm ở 0072)
-- tự mất theo bảng, không cần drop riêng.
drop table if exists worklife.growth_milestones cascade;
drop table if exists worklife.wellbeing_checks cascade;
drop table if exists worklife.habit_logs cascade;
drop table if exists worklife.habits cascade;
drop table if exists worklife.plans cascade;

-- Phòng trường hợp DB nào đó chưa từng chạy 0066 (bảng Life còn ở schema `life`).
drop table if exists life.growth_milestones cascade;
drop table if exists life.wellbeing_checks cascade;
drop table if exists life.habit_logs cascade;
drop table if exists life.habits cascade;
drop table if exists life.plans cascade;
drop schema if exists life restrict;

-- LÙI: KHÔNG CÓ. Cấu trúc bảng lùi được bằng cách chạy lại 0047/0049/0050 + 0066, nhưng DỮ LIỆU
-- đã xoá thì không lấy lại được ngoài đường restore backup.
