# 0297 — 2026-09-14 — Audit chất lượng nội dung toàn bộ các môn học

**PR:** (đang mở) · **Nhánh:** `claude/audit-course-quality-vj5pcu`
**Báo cáo:** `docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md`

## Việc đã làm

Rà chất lượng NỘI DUNG SƯ PHẠM của 6 môn đang có (Lập trình · Toán · Vật lí · Hoá học ·
Sinh học · Tiếng Anh) bằng script nạp thẳng registry thật, không đọc tài liệu cũ. Chỉ đọc và
báo cáo, KHÔNG sửa nội dung nào — đúng nguyên tắc 2 của `docs/framework/QUY-TRINH-AUDIT.md`.

Quy mô đo được: 373 bài Lập trình · 294 bài STEM · 699 vòng / 11 917 mục từ tiếng Anh.

## Phát hiện chính

- 🔴 **F1** — 294/294 bài STEM mang `reviewStatus: 'draft'` nhưng giao diện không đọc trường
  này ở bất kỳ đâu: người học không hề biết nội dung chưa duyệt chuyên môn. Trường đang là dữ
  liệu chết.
- 🔴 **F2** — Môn Toán mới 35 bài, thủng 6 chương GDPT 2018 (10:c5 · 11:c3,c4,c8 · 12:c2,c3);
  test gói Toán không có ngưỡng số bài tối thiểu như gói Sinh nên không cổng nào bắt.
- 🟠 **F3** — 610/699 vòng từ vựng (87%) không có câu mẫu, phá đúng triết lý ghi ở đầu
  `curriculum.ts`.
- 🟠 **F4** — Cờ `notForKids` chỉ phủ 12 vòng thủ công; 610 vòng sinh tự động không gắn được,
  kể cả vòng A1/A2/B1 chủ đề business/health_med mà trẻ em chắc chắn học tới.
- 🟠 **F5** — 23 vòng từ vựng dưới 5 từ, hai vòng chỉ có đúng 1 từ.
- 🟡 F6–F10 — hoạt ảnh phủ 19%, HSG lệch giữa các môn (Hoá 12 = 0), 6 bài Hoá trùng tiêu đề
  nguyên văn, 20 giải thích dưới 40 ký tự, 14 bài Lập trình chỉ 1 test-case.

Làm tốt (ghi lại để không phá): môn Lập trình phủ kín 100% unit, mọi `sampleSolution` chạy thật
qua bộ chấm của đúng ngôn ngữ; 294 bài STEM sạch tuyệt đối về trùng lặp và tham chiếu đáp án;
11 917 mục từ không mục nào trùng hay thiếu nghĩa/ví dụ.

## Quyết định

Chưa sửa gì trong đợt này. Báo cáo xếp 11 phát hiện thành thứ tự xử lý: 6 việc AI tự làm được
(gộp 1–2 PR nhỏ), 3 việc sinh nội dung mới cần người dùng duyệt đặc tả trước.

## Bằng chứng kiểm chứng

```
npx vitest run packages/subject-{math,physics,chemistry,biology,english}  → 122/122 xanh
npx vitest run packages/subject-programming                               → 4417/4417 xanh (32,5s)
```
