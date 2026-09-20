# 0386 — 2026-09-20 — Xác nhận đóng nợ Initial JS (mô tả cũ đã lỗi thời)

## Việc đã làm

Rà lại nợ kỹ thuật ghi ở `PROGRESS.md` (2026-09-17, S13-2, `docs/changelog/0358-*.md`): "Initial
JS 135,4 kB đã vượt mốc cảnh báo 95% của ngân sách (133 kB), trần cứng vẫn 140 kB".

Phát hiện: **cùng ngày 2026-09-17** (sau thời điểm ghi nợ này), một PR khác (`#1000`, đặc tả
`docs/changelog/0360-*.md` — thiết kế lại trang chủ) đã **nới trần Initial JS có chủ đích từ
140 → 150 kB** (`.size-limit.json`) để có chỗ cho các lát P0 của trang chủ mới. Đây đúng là
quyết định của chủ dự án theo luật CLAUDE.md/spec S13 §7 Q4 ("nới ngân sách không phải việc của
agent") — không phải một PR sau đó âm thầm nới ngưỡng để né cổng.

Đo lại hôm nay (build sạch, `npm run budget`):

```
Initial JS (entry + vendors, brotli): 137.54kB / 150.00kB — còn 12.46kB (đã dùng 91.7%)
```

91,7% < mốc cảnh báo 95% — không còn trong vùng nguy hiểm. Không cần tách chunk/nạp lười thêm ở
mức dùng hiện tại; mô tả nợ cũ trong `PROGRESS.md` chỉ đơn giản chưa được cập nhật theo diễn biến
cùng ngày.

## Issue / outcome

Trước: `PROGRESS.md` mô tả sai hiện trạng (trần 140kB đã lỗi thời, đe doạ CI đỏ bất kỳ lúc nào).
Sau: `PROGRESS.md` khớp đúng cấu hình thật (`.size-limit.json` = 150kB) và số đo thật (137,54kB,
91,7%, còn margin lành mạnh).

## Research / spec

Không có đặc tả mới — chỉ xác minh lại một quyết định đã có (`docs/changelog/0360-*.md`) và cập
nhật tài liệu trạng thái cho khớp thực tế.

## Validation

`npm run build` (checkout sạch, `rm -rf dist dist-server` trước khi build) · `npm run budget` —
in đúng số 137,54/150kB.

## Rủi ro, rollout và rollback

Không có rủi ro — chỉ sửa mô tả trong `PROGRESS.md`, không đổi mã/cấu hình. Rollback: revert
commit.

## Definition of Done

- [x] `PROGRESS.md` khớp đúng ngưỡng thật (150kB) và số đo thật (137,54kB/91,7%)
- [x] Xác nhận việc nới ngưỡng trước đó là quyết định có chủ đích của chủ dự án, không phải lỗi
