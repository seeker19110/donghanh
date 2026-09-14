# 0306 — 2026-09-14 — Đóng dứt điểm 6 chương Toán thủng: lớp 10 chương 5, lớp 11 chương 3/4/8

PR: (điền số PR khi tạo)

## Việc đã làm

Tiếp nối PR #908 (lớp 12 chương 2-3), thi hành `docs/specs/2026-09-14-mon-toan-bo-sung-lop10c5-lop11c3c4c8.md`
(Approved for implementation theo chỉ dẫn trực tiếp người dùng) — đóng nốt 4 chương Toán còn
thủng:

- `packages/subject-math/lessons/toan10c5.ts` — "Các số đặc trưng của mẫu số liệu không ghép
  nhóm", 3 bài: số gần đúng/sai số, xu thế trung tâm, độ phân tán.
- `packages/subject-math/lessons/toan11c3.ts` — "Các số đặc trưng đo xu thế trung tâm của mẫu
  số liệu ghép nhóm", 2 bài (dùng đúng công thức nội suy đã kiểm chứng ở `toan12c3.ts`, PR #908).
- `packages/subject-math/lessons/toan11c4.ts` — "Quan hệ song song trong không gian", 3 bài.
  Nguồn SGK (`docs/research/muc-luc-sgk/toan-11.md`) đánh dấu phần lớn nội dung chương này
  🟡/❌ (chứng minh/dựng hình, không chấm tự động được) — thiết kế 2/3 bài toàn bộ câu `choice`
  (nhận biết vị trí tương đối, tính chất phép chiếu song song), chỉ 1 bài dùng `numeric` cho
  phần có đáp số rõ (định lí Thalès trong không gian).
- `packages/subject-math/lessons/toan11c8.ts` — "Các quy tắc tính xác suất", 3 bài.

**Kết quả đo được:** Toán 10 đủ 9/9 chương, Toán 11 đủ 9/9 chương, Toán 12 đủ 6/6 chương (đã đủ
từ PR #908) — không còn chương chính khoá nào thủng. Tổng 53 bài (từ 35 bài ban đầu, +18 bài
qua 2 đợt PR #908 + PR này).

## Quyết định

- Nguồn chương trình dùng mục lục SGK thật đã đối chiếu (`docs/research/muc-luc-sgk/toan-10.md`,
  `toan-11.md`, đối chiếu 2026-08-03) — chính xác hơn `kho-kien-thuc-mon-hoc.md` §5 vốn chỉ liệt
  kê theo mạch kiến thức không theo đúng số chương.
- Toàn bộ 11 bài mới `reviewStatus: 'draft'` — chưa chính thức, chờ duyệt chuyên môn (PR #904/#905).
- Không đưa nội dung "Chuyên đề học tập" (tự chọn) vào lộ trình chuẩn.

## Bằng chứng kiểm chứng

```
npm run typecheck    → 0 lỗi
npm run lint          → 0 cảnh báo
npx vitest run packages/subject-math → 14/14 test xanh (2 file)
npm run build         → OK
Số chương: Lớp 10 (1-9) · Lớp 11 (1-9) · Lớp 12 (1-6) — đủ, không thủng
Tổng số bài: 53 (từ 35 ban đầu)
```
