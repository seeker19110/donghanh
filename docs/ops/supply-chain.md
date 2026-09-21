# Supply-chain và release evidence

Checklist tham khảo khi rà chuỗi cung ứng phần mềm của DHCB (dependency, secret, CI hardening).
Không thay thế `npm run maintain` (`scripts/maintenance-sweep.sh`, chỉ đọc) — dùng file này để
đối chiếu khi cần đánh giá kỹ hơn, ví dụ trước một đợt bảo trì lớn hoặc khi thêm dependency mới
có ảnh hưởng bảo mật (ví dụ gói xử lý thanh toán, mã hoá). (Nguồn: `seeker19110/projects-template`
`docs/ops/supply-chain.md`, rút gọn khớp quy mô DHCB — dự án vốn tối thiểu, một VPS, không có
build artifact/container phân phối ra ngoài.)

## Baseline áp cho DHCB

- `package-lock.json` khớp thật với `node_modules` — `npm ci` trả về 0 trước khi tin cổng nào
  (đã ghi ở TRAPS.md mục 3, đừng lặp lại bẫy đó).
- Thêm dependency mới: kiểm nhanh (`npm view <gói>`) — có bảo trì gần đây không, số lượt tải,
  không phải gói mạo danh tên gần giống gói phổ biến (typosquat).
- `.env`/secret không lọt vào git — xem trước khi `git add -A`/push (CLAUDE.md mục "Git Safety
  Protocol"). Không log secret ra console/Sentry.
- CI (`ci.yml`) chạy trên runner sạch, không nội suy input không tin cậy (PR title/body từ fork)
  vào lệnh shell.
- Webhook SePay: xác thực chữ ký (HMAC) trước khi xử lý, idempotency chặn xử lý trùng — đây là
  đường tiền thật, rà kỹ hơn baseline chung mỗi khi sửa `packages/core-billing/` hoặc route
  webhook liên quan.

## Không áp dụng cho DHCB (ghi lại để không bịa ra việc thừa)

DHCB không phân phối artifact/container/binary ra ngoài (chạy trực tiếp trên một VPS qua
PM2/Nginx, không đóng gói image để phát hành) — nên **không cần** SBOM (CycloneDX/SPDX),
provenance/attestation ký OIDC, hay bậc thang SLSA của repo mẫu gốc. Nếu sau này DHCB đóng gói
container để deploy đa môi trường, quay lại repo mẫu (`seeker19110/projects-template`
`docs/ops/supply-chain.md`) để áp phần đó — đừng tự thêm hạ tầng ký/SBOM khi chưa có nhu cầu
thật (nguyên tắc "không thiết kế cho tương lai giả định", CLAUDE.md).

## Exception

Dependency có lỗ hổng đã biết nhưng chưa vá được ngay phải có: lý do, biện pháp giảm nhẹ tạm
thời, hạn xử lý, và ghi vào `PROGRESS.md` mục nợ mở — không âm thầm bỏ qua cảnh báo `npm audit`.
