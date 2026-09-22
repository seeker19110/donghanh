# 0413 — 2026-09-22 — Sửa deploy VPS sập vì hết heap Node 5 lần liên tiếp + sửa trùng số changelog 0411

> PR: (đợt này). Người dùng yêu cầu "kiểm tra auto deploy thất bại" sau khi PR #1109 merge.

## Việc đã làm

**Sự cố: `Deploy to VPS` đỏ 5 lần liên tiếp (run #1056–#1060, từ 02:03 tới 06:25).** Đọc log qua
GitHub Actions API: mọi lần đều sập ở đúng bước `npm run build` trên VPS, đúng chữ ký:

```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed
- JavaScript heap out of memory   (heap ~1,48 GB, exit 134)
```

Không liên quan tới nội dung PR nào — kể cả PR chỉ thêm 3 test (#1108) cũng sập giống hệt.
**Khác sự cố 2026-08-26** (kernel OOM killer giết tiến trình vì RAM/swap thật sự cạn — đã vá
bằng `scripts/setup-swap.sh`, xem `docs/deploy-vps-ubuntu.md` Bước 3a): đây là **V8 tự báo hết
heap trước khi chạm trần vật lý** — VPS 3GB RAM + 6G swap vẫn còn chỗ, nhưng không file nào
trong build đặt `--max-old-space-size` nên V8 tự chọn trần theo RAM máy, không tính swap.
`tsc -b` 16 workspace + `vite build` của một dự án ngày càng lớn (bài học/hoạt ảnh thêm liên
tục) đã vượt trần mặc định đó. Không lộ ra ở CI vì runner GitHub có ~7GB, V8 tự nới đủ.

**Sửa:** `scripts/deploy.sh` bước `[6/7] Build` — đặt `NODE_OPTIONS=--max-old-space-size=2560`
CHỈ cho lệnh `npm run build` của bước deploy này (không đổi hành vi `npm run build` ở máy
dev/CI, nơi RAM luôn dư — cờ vô hại ở đó). Chọn 2560 MB (không phải trọn 3GB vật lý) vì app
CŨ vẫn đang phục vụ traffic thật qua PM2 suốt lúc build (zero-downtime reload chỉ ở bước
[7/7]) — ép cap chạm sát trần vật lý sẽ đẩy mọi tiến trình cùng sang swap, có thể làm app
đang chạy giật.

**Trùng số changelog 0411 (phát hiện khi tra cứu sự cố).** PR #1108 và #1109 cùng lấy số 0411
vì merge gần nhau, không ai chạy `npm run changelog` lại trước khi merge (không có cổng máy
chặn việc này giữa hai PR độc lập). Đổi file của PR #1109 (`docs/changelog/0411-2026-09-22-
audit-ui-ux-sau-va-xu-ly-6-dot.md`) sang `0412-*`, sửa lại tham chiếu trong `PROGRESS.md`.

**Nợ theo sau (từ yêu cầu người dùng "trả nốt 44 chỗ err.message còn lại"), gộp cùng nhánh vì
PR #1109 đã merge trước khi làm xong:** áp `thongDiepLoiThanThien` (thêm tham số `lang` cho
chiều B) cho 34 chỗ / 19 file người dùng nhìn thấy — xem chi tiết ở `docs/changelog/0412-*.md`
mục đã cập nhật.

## Bằng chứng

- Log 5 lần deploy đỏ: cùng chữ ký OOM, cùng bước `[6/7] Build`, cùng mốc heap ~1,48 GB
  (`gh run` id 35678061982 · 35680971098 · 35684747554 · 35692684305 · 35694567099).
- Cổng: typecheck ✅ · lint ✅ · test vùng chạm ✅ (không đổi hành vi runtime, chỉ thêm biến môi
  trường cho một lệnh shell) · `npm run build` chạy sạch ở máy hiện tại (RAM dư, không kích
  hoạt nhánh cap — xác nhận cờ không phá build bình thường).

## Chưa làm / cần theo dõi

- Không SSH được vào VPS từ phiên này để xác nhận trực tiếp `free -h`/`swapon --show` hiện tại
  còn đúng cấu hình 2026-08-26 hay không — sửa dựa trên đọc log CI, chưa đo tại chỗ.
- Nếu sau lần deploy tới vẫn đỏ với heap cao hơn 2560 MB, cần nới thêm hoặc tách bước
  `tsc -b`/`vite build` chạy tuần tự giải phóng bộ nhớ giữa các bước thay vì `&&` liền mạch.

## Cập nhật 2026-09-22 06:57 — đã xác nhận trên deploy thật

PR #1110 (chứa cờ `NODE_OPTIONS=--max-old-space-size=2560`) merge lúc 06:53. Lần deploy tự động
kế tiếp — workflow run **#1061** (commit `e1db7a89`, id `35696918341`) — **xanh**, hoàn tất
`06:53:43 → 06:57:35` (~3 phút 52 giây), khớp thời lượng một deploy thành công bình thường
(đối chứng: run #1055 thành công trước đó ~2 phút 23 giây; #1061 chậm hơn một chút vì cùng lúc
build cả batch trả nợ err.message, không phải do tràn swap). Đóng nợ trong `PROGRESS.md`.
