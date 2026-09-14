# 0305 — 2026-09-14 — Toán 12 chương 2-3: Vectơ Oxyz và số đặc trưng phân tán mẫu ghép nhóm

PR: (điền số PR khi tạo)

## Việc đã làm

Thi hành đúng `docs/specs/2026-09-14-mon-toan-bo-sung-lop12-c2-c3.md` (đã được người dùng duyệt
"Approved for implementation") — bổ sung 7 bài học mới, đóng 2/6 chương môn Toán còn thủng
(theo ưu tiên phương án A đã chốt ở `docs/research/de-xuat-uu-tien-mon-toan-2026-09-14.md`):

- `packages/subject-math/lessons/toan12c2.ts` — Chương 2 "Vectơ và hệ trục toạ độ trong không
  gian", 4 bài: vectơ và các phép toán (quy tắc ba điểm, quy tắc hình hộp), toạ độ điểm/vectơ
  trong Oxyz, biểu thức toạ độ + tích vô hướng, ứng dụng khoảng cách/góc giữa hai đường thẳng.
- `packages/subject-math/lessons/toan12c3.ts` — Chương 3 "Các số đặc trưng đo mức độ phân tán
  của mẫu số liệu ghép nhóm", 3 bài: khoảng biến thiên + khoảng tứ phân vị, phương sai + độ lệch
  chuẩn, so sánh độ phân tán giữa hai mẫu.
- Đăng ký vào `packages/subject-math/lessons.ts`, cập nhật `lessonsLazy.ts` (chạy
  `npm run gen:stem-lesson-index`), mở rộng ngưỡng khoá chương trong `lessons.test.ts` thêm
  `12-c2`, `12-c3`.

Toán 12 nay đủ cả 6 chương (1-6) theo bộ Kết Nối Tri Thức — không còn thủng ở lớp cuối cấp.

## Quyết định

- Mỗi câu hỏi trắc nghiệm/tự luận số chỉ hỏi **một giá trị số duy nhất** (thành phần toạ độ, độ
  dài, góc, tứ phân vị...), không dùng `answer.kind: 'expression'` cho bộ ba toạ độ — tránh rủi
  ro chưa xác nhận chắc `expressionsEqual` xử lý đúng cú pháp tuple.
- Toàn bộ 7 bài ở trạng thái `reviewStatus: 'draft'` — CHƯA chính thức, chờ người có chuyên môn
  Toán duyệt qua quy trình duyệt chuyên môn STEM (PR #904/#905) trước khi đưa vào sản xuất thật.

## Nợ kỹ thuật mới phát hiện

`scripts/gen-stem-lesson-index.ts` không chạy Prettier sau khi sinh — mỗi lần chạy tạo diff giả
(khác định dạng, không khác nội dung) ở `lessonsLazy.ts` của cả 3 môn STEM khác không liên quan
đến thay đổi đang làm. Đã tự khắc phục cho đợt này bằng `git checkout` trả lại 3 file không đụng
tới, nhưng nên vá gốc (thêm `prettier --write` vào cuối script sinh) ở đợt sau.

## Bằng chứng kiểm chứng

```
npm run typecheck    → 0 lỗi
npm run lint          → 0 cảnh báo
npx vitest run packages/subject-math → 14/14 test xanh (2 file)
npm run build         → OK
npm run test:coverage → Statements 94,54% · Branches 90,61% · Functions 94,79% · Lines 94,95%
```
