# 0304 — 2026-09-14 — Trả 4 nợ nhỏ từ báo cáo ưu tiên nợ nội dung, đề xuất ưu tiên môn Toán

PR: (điền số PR khi tạo)

## Việc đã làm

Từ báo cáo "còn nợ — xếp theo mức" (2026-09-14), xử lý 4 khoản có thể đóng an toàn trong một
đợt (KHÔNG đụng các khoản cần chuyên môn con người/quyết định ưu tiên của người dùng — xem mục
"Chưa làm" bên dưới):

1. **Ngân sách JS 96,74% → 90,06%** (`apps/dhcb/vite.config.ts`): sửa lỗi cấu hình
   `manualChunks` khiến `@marijn/find-cluster-break` (dependency CodeMirror) rơi nhầm vào
   `vendor-misc` thay vì `vendor-codemirror`; tách `qrcode`+`dijkstrajs` (chỉ dùng sau route
   lazy-load) ra chunk riêng `vendor-qrcode` không bị preload eager. Đo bằng
   `npx size-limit --json` trước/sau, không đổi logic ứng dụng.

2. **30 câu lời giải Vật lí/Hoá học cụt (41–59 ký tự)** (`packages/subject-physics/lessons/*.ts`,
   `packages/subject-chemistry/lessons/*.ts`): nối thêm 1-2 câu giải thích bản chất/đơn vị/bẫy
   sai thường gặp vào field `explain`, giữ nguyên phần công thức/đáp số cũ. Danh sách đầy đủ 25
   câu Lí + 5 câu Hoá đã sửa nằm trong diff.

3. **Hạ tầng "mỗi test-case một bộ dữ liệu" cho bài SQL**: thêm field tuỳ chọn `datasetSql` vào
   `TestCaseSchema` (`packages/subject-programming/lessonTypes.ts`), đồng bộ xuống toàn bộ chuỗi
   chấm bài thật (`lessonsSql.test.ts` → `sqlWorker.ts` → `sqlRunner.ts` → `codeRunner.ts` →
   `ProgrammingLessonPage.tsx`) để tránh lệch giữa cổng CI và trải nghiệm học viên. Áp dụng thử
   nghiệm cho bài `p5u5.ts`: thêm 3 bộ dữ liệu riêng (bảng rỗng, giá trị NULL + thứ tự đảo, id
   nhảy cóc) cho 3/5 test case để bắt lỗi "chỉ đúng tình cờ với đúng bộ mẫu". Đã kiểm ngược bằng
   cách cố ý phá 1 seed — suite báo đỏ đúng chỗ, xác nhận dataset thật sự được dùng.

4. **Công cụ hỗ trợ rà 442 câu trắc nghiệm chưa duyệt chuyên môn**
   (`scripts/export-review-queue.ts`, lệnh `npm run export:review-queue`): xuất
   `docs/audit/review-queue/{toan,vat-li,hoa-hoc,sinh-hoc}.md` — mỗi câu trắc nghiệm chưa
   `daDuocNguoiDuyet()` kèm prompt, phương án, đáp án hệ thống, và cột trống "Ý kiến chuyên gia".
   **Không tự sửa/phán đáp án** — chỉ là công cụ đọc registry rồi xuất ra định dạng dễ rà tay,
   tận dụng đúng hạ tầng duyệt chuyên môn đã có từ PR #904/#905 (`lessonReview.ts`,
   `stem_lesson_reviews`), không xây trùng.

## Đã viết thêm (không sửa nội dung)

- `docs/research/de-xuat-uu-tien-mon-toan-2026-09-14.md` — tài liệu QUYẾT ĐỊNH (không phải đặc
  tả thi hành): môn Toán chỉ 35 bài, thủng 6 chương GDPT 2018 (lớp 10 chương 5; lớp 11 chương
  3,4,8; lớp 12 chương 2,3). Không tự đoán tên 6 chương vì 3 bộ SGK đánh số khác nhau và repo
  không ghi rõ đang theo bộ nào — xin người dùng chọn bộ sách + thứ tự ưu tiên trước khi giao
  soạn bài mới.

## Chưa làm — cần bạn quyết hoặc cần chuyên môn con người

- 442 câu trắc nghiệm cần người có chuyên môn đọc — chỉ làm công cụ hỗ trợ (mục 4), không tự sửa
  đáp án.
- Môn Toán 35 bài/6 chương thủng — chờ bạn trả lời 3 câu hỏi trong
  `docs/research/de-xuat-uu-tien-mon-toan-2026-09-14.md`.
- 610 vòng từ vựng thiếu câu mẫu, hoạt ảnh STEM phủ thấp, chuyên đề HSG Hoá 12 — cần đặc tả riêng
  trước khi giao (đúng quy ước "sinh nội dung mới cần đặc tả trước", chưa làm trong đợt này).

## Bằng chứng kiểm chứng

```
npm run typecheck   → 0 lỗi
npm run lint         → 0 cảnh báo
npm run build        → OK (client + server + hub)
npx size-limit        → JS 126,07/140 kB (90,06%) · CSS 18,11/20 kB (90,6%)
npm run test:coverage → 594/594 file, 12378/12378 test xanh
                        Statements 94,54% · Branches 90,61% · Functions 94,78% · Lines 94,95%
npm run export:review-queue → Toán 17 · Vật lí 119 · Hoá học 137 · Sinh học 169 · Tổng 442
```
