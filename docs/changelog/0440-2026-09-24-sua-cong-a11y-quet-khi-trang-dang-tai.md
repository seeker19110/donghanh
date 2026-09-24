# Sửa cổng a11y quét khi trang còn đang tải (main đỏ sau #1162)

- **Ngày:** 2026-09-24 · **PR:** (PR của nhánh `claude/fix-stable-dom-page-loading`)
- **Loại:** Tầng 1b (test đỏ ngẫu nhiên). Kết luận: **không phải nhiễu**, mà là cổng đo sai thời điểm.

## Triệu chứng

CI của `main` sau #1162 (run 36019290200) và PR #1163 đỏ cùng một ca:
`a11y-aaa.spec.ts › /lap-trinh/bai-hoc/p1-u4-l1 theme=dark-blue` →
`unresolved: DOM changed during scan (1 mutations)`, đỏ cả ở lần retry. #1162 không chạm trang
lập trình; thêm test mới làm Playwright chia lại shard nên ca này đổi vị trí/tải.

## Nguyên nhân (đo, không đoán)

Tái hiện ở máy: `--repeat-each=8 --workers=4` → đỏ 6/8 trên nhánh #1163 và **8/8 trên `129f4f2`
(trước S09a)** — lỗi có sẵn, phụ thuộc tải máy. Chi tiết mutation đính kèm cho thấy trong lúc quét,
khung chờ `PageLoading` (Suspense) bị gỡ và cả Layout bị dựng lại; kèm `href` của
`<link rel=canonical>` đổi sang URL chuẩn. `waitForStableDom` chỉ đếm số phần tử: skeleton đứng yên
đủ 3 nhịp × 200ms khi dev server chậm nên bị coi là "đã ổn định".

## Đã sửa

- `apps/dhcb/src/App.tsx` — `PageLoading` gắn `aria-busy="true"` + `data-page-loading` (cũng đúng
  ngữ nghĩa cho công nghệ hỗ trợ).
- `e2e/helpers/axe.ts` — `waitForStableDom` chỉ coi là ổn định khi **số phần tử + URL** không đổi
  qua đủ nhịp và **không còn** `[data-page-loading]`. Hết giờ vẫn không ném lỗi (giữ hành vi cũ).
- Không đổi ngưỡng, không đổi collector/`scanAaa`, không thêm ngoại lệ hay retry.

## Bằng chứng

- Trước: 0/8 (`129f4f2`) và 2/8 (nhánh #1163) đạt, cùng lệnh `--repeat-each=8 --workers=4`.
- Sau: 8/8 đạt, cùng lệnh.
- Toàn bộ `a11y.spec.ts` + `a11y-aaa.spec.ts`: xem mục Validation của PR.
