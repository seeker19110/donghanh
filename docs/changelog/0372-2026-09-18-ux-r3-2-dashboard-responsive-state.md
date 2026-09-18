# 0372 — 2026-09-18 — UX-R3.2 Dashboard giữ state và focus qua resize

## Trạng thái và phạm vi

Candidate **VERIFY, chưa merge** trên base `main@2cc505f0` (PR #1024 đã merge R3-1).
Thi hành R3-2 theo §5/§8 của [spec UX-R3](../specs/2026-09-18-ui-clarity-dashboard-progressive-disclosure.md),
**Approved for implementation**. Full gate đang chạy/chưa chốt tại checkpoint này.

## Kết quả candidate

- Dashboard dùng một cây DOM theo thứ tự header → môn → tuần → English → công cụ; một
  QuickActions instance giữ dialog và focus trap khi resize qua 1024/1280px.
- Calendar có disclosure explicit đóng mặc định mọi viewport, panel stable id dùng HTML
  `hidden`; giữ lựa chọn qua resize, chuyển focus về toggle trước khi ẩn nếu focus đang ở trong.
- Stable owner giữ ngày chọn qua range 5/13/26 tuần. Ngày ngoài range clamp về biên gần nhất;
  controlled/uncontrolled cùng giữ kết quả hợp lệ, không tự quay lại ngày cũ khi mở rộng range.
- Row key theo thứ Hai của tuần giữ node ngày ở partial week qua cả hai chiều breakpoint.
  Recovery không cướp focus bên ngoài calendar; roving tabindex, keyboard và live detail giữ nguyên.
- Calendar có `motion-reduce:animate-none`; không thêm API/schema/migration/dependency hoặc đổi
  thuật toán thống kê, dữ liệu authoritative, quota hay entitlement.

## Review và kiểm chứng

- Independent review vòng 1 BLOCK **1 critical · 3 major**: partial-week remount mất focus,
  uncontrolled không lưu clamp, thiếu reduced-motion và bỏ precondition kiểm cuộn.
- Vòng 2 còn **1 major**: harness sửa kích thước scroller để tạo tiền điều kiện. Đã bỏ override,
  khóa ngày fixture và kiểm cuộn trên layout sản phẩm thật; ô Home khuất trước phím, hiện đủ và
  thẳng header sau phím.
- Vòng 3 **PASS 0 critical · 0 major · 0 minor**.
- Kiểm độc lập trên Node 22: component **2 file / 21 test PASS**; calendar E2E **11/11 PASS**,
  gồm axe A/AA ba theme, mobile 44px/overflow, breakpoint/focus, disclosure và QuickActions dialog.
- `git diff --check`: PASS tại review.
- **Chưa chốt complete gate:** build, typecheck, lint, format, full unit, budget, full E2E và
  bằng chứng thị giác do agent chính chạy/tổng hợp. Required CI của PR vẫn là gate trước merge.
  Không dùng kết quả của R3-1 thay cho candidate này; chưa có số chiều cao/CLS cuối UX-R3.
- Không gọi paid provider hoặc truy cập production data/secrets trong scope kiểm thử.

## Tiếp theo và rollback

Hoàn tất complete gate/evidence, tạo PR và auto-merge chỉ khi required checks xanh; reload main
trước R3-3 hierarchy + “Tuần này” có scope English. R3-4 mới chốt English disclosure, target chiều
cao và toàn ma trận 28 case; UX-R4 còn lại. Goal chưa complete, không deploy.

Rollback bằng revert PR R3-2; không có migration hay dữ liệu cần khôi phục. Nếu R3-3/R3-4 đã
merge, revert các slice phụ thuộc theo thứ tự ngược. Trước mỗi lần dừng, cập nhật/nén checkpoint
ở goal và reconcile main/PR/checks trước khi chạy tiếp.
