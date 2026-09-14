# 0296 — 2026-09-14 — Ghi bẫy "cổng ở máy xanh giả" vào TRAPS.md

**PR:** (điền khi tạo) · **Nhánh:** `claude/jolly-galileo-8uy96y`

## Việc đã làm

Thêm mục 3 vào `TRAPS.md`: **cổng ở máy XANH GIẢ vì môi trường máy khác môi trường CI**, rút từ
ba lần CI đỏ liên tiếp của PR #893 — cả ba lần đều đã chạy đủ cổng ở máy và đều xanh trước khi
push.

Ba biến thể, cùng một khuôn:

| Biến thể         | Máy xanh vì                             | CI đỏ vì                                             |
| ---------------- | --------------------------------------- | ---------------------------------------------------- |
| Lockfile lệch    | `npm install` tự liên kết workspace mới | CI chạy `npm ci`, lệnh này từ chối khi lockfile lệch |
| Tạo tác build cũ | còn `packages/*/dist` để phân giải kiểu | runner checkout sạch, không có `dist`                |
| Lệnh khác nhau   | `npm test` không bật coverage           | `npm run test:coverage` có ngưỡng chặn               |

Mục mới ghi cả **cách nhận ra từ bảng check trước khi đọc log** — quan trọng nhất là dấu hiệu
"mọi job đỏ, mỗi job chỉ sống ~10 giây" nghĩa là hỏng ở bước cài đặt chứ không phải nội dung
hỏng nặng, tránh đi chẩn đoán nhầm hướng như đợt vừa rồi.

Kèm một dòng trỏ từ `CLAUDE.md` mục 8 (cổng trước khi commit) sang mục bẫy này, để người đọc
danh sách cổng gặp nó đúng lúc cần.

## Vì sao đáng ghi

Cả ba lần đều không phải lỗi nội dung, mà là lỗi **quy trình kiểm chứng**: tôi tin "đã chạy đủ
cổng" trong khi cổng chạy ở máy không phải cổng CI chạy. Đây đúng loại việc `TRAPS.md` sinh ra
để chặn — lần sau tra bảng dấu hiệu là biết ngay hướng, thay vì đọc log từng job.

`CLAUDE.md` mục 8 vốn đã cảnh báo "công cụ phải khớp lockfile" nhưng chỉ cho trường hợp
`node_modules` cũ; mục mới mở rộng sang lockfile, tạo tác build và lệnh chạy.

## Bằng chứng kiểm chứng

```
npm run lint    ✅  0 cảnh báo
npm run format  ✅  All matched files use Prettier code style
npm test        ✅
```

Đợt này chỉ sửa tài liệu (`TRAPS.md`, `CLAUDE.md`), không chạm mã nguồn.

## Còn nợ

Ba biện pháp chốt chặn của mục 3 hiện là **quy ước làm việc, chưa tự động hoá**. Có thể siết
thêm về sau: một hook trước khi push kiểm `npm ci` trả về 0 khi `package.json` của workspace
thay đổi. Chưa làm vì chưa rõ nó có làm chậm nhịp push tới mức khó chịu không.
