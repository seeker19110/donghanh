# 0392 — 2026-09-21 — Xoá `PageHeader.tsx` mồ côi

## Việc đã làm

Trả nợ kỹ thuật đã ghi ở `PROGRESS.md` (từ PR #1064, `docs/changelog/0390-*.md`):
`apps/dhcb/src/components/PageHeader.tsx` không còn nơi nào gọi thật sau khi ~57 trang chuyển
tiêu đề lên `Layout`. Xác nhận bằng `grep` toàn bộ `apps/dhcb/src` — chỉ còn nhắc tới trong
comment (giải thích lịch sử), không có import/JSX nào dùng. Xoá file, không có test riêng đi
kèm để xoá theo.

## Issue / outcome

Dọn nợ kỹ thuật đã liệt kê, không có thay đổi hành vi người dùng.

## Research / spec

Không cần đặc tả mới — đây là dọn dẹp cơ học theo mục nợ đã ghi sẵn, không phải tính năng mới.

## Validation

- `npm ci` (môi trường phiên lệch lockfile trước đó, gây `TS5101` giả ở `typecheck` — chữa bằng
  `npm ci`, không sửa code theo báo lỗi giả, đúng TRAPS.md).
- `npm run typecheck` ✅
- `npm run lint` ✅ (0 cảnh báo)
- `npm test` ✅ 692 file / 14777 test qua, 1 file / 2 test skip (không đổi so với trước)
- `npm run build` ✅ (app + server + hub)

## Rủi ro, rollout và rollback

Rủi ro thấp: xoá component không còn ai import. Rollback: `git revert` commit này, không đụng
schema/dữ liệu.

## Definition of Done

- [x] File mồ côi đã xoá
- [x] Mục nợ tương ứng đã xoá khỏi `PROGRESS.md`
- [x] Cổng build/type/lint/test đều xanh
