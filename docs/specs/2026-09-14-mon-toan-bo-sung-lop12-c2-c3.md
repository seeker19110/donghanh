# Đặc tả — Bổ sung Toán 12, chương 2 (Vectơ & hệ toạ độ Oxyz) và chương 3 (số đặc trưng đo phân tán mẫu ghép nhóm)

> Ngày: 2026-09-14 · Trạng thái: **CHỜ DUYỆT** (chưa "Approved for implementation")
> Căn cứ: `docs/research/de-xuat-uu-tien-mon-toan-2026-09-14.md` (quyết định ưu tiên A, bộ SGK
> Kết Nối Tri Thức) + `docs/research/kho-kien-thuc-mon-hoc.md` §5 mục "Lớp 12" (đã đối chiếu SGK
> thật 2026-08-03 — nguồn công thức dùng ở đặc tả này).

## 0. Một câu

Bổ sung 2 chương môn Toán lớp 12 đang thủng hoàn toàn (0 bài) vào `packages/subject-math/lessons/`,
theo đúng khuôn dữ liệu 4 môn STEM đã có, để lớp 12 không còn lỗ hổng chương trình chính khoá.

## ① Phạm vi

**LÀM:**

- Tạo file mới `packages/subject-math/lessons/toan12c2.ts` — Chương 2 "Vectơ và hệ trục toạ độ
  trong không gian" — tối thiểu 4 bài: (1) Vectơ trong không gian — các phép toán; (2) Toạ độ của
  vectơ, của điểm; (3) Biểu thức toạ độ của các phép toán vectơ, tích vô hướng; (4) Ứng dụng: tính
  góc, khoảng cách bằng toạ độ.
- Tạo file mới `packages/subject-math/lessons/toan12c3.ts` — Chương 3 "Các số đặc trưng đo mức độ
  phân tán của mẫu số liệu ghép nhóm" — tối thiểu 3 bài: (1) Khoảng biến thiên, khoảng tứ phân vị;
  (2) Phương sai, độ lệch chuẩn của mẫu số liệu ghép nhóm; (3) Ý nghĩa, vận dụng so sánh độ phân
  tán giữa hai mẫu số liệu.
- Đăng ký 2 file mới vào `packages/subject-math/lessons.ts` (nơi gộp registry `MATH_LESSONS`).
- Mỗi bài đúng khuôn `MathLesson` (`lessonTypes.ts`): `hook` (tình huống đời sống Việt Nam, tự
  soạn — KHÔNG chép ví dụ SGK), `theory` (giải thích VÌ SAO, không chỉ liệt kê công thức), tối
  thiểu 1 `animation` cho toàn chương (ví dụ: dựng hệ trục Oxyz quay, hoặc minh hoạ khoảng tứ phân
  vị trên biểu đồ), `workedExample` đủ bước, 2-10 `checkQuestions` mỗi bài (dùng `answer.kind`
  phù hợp: `numeric` cho toạ độ/khoảng cách/phương sai, `choice` cho câu lý thuyết), `srsCards`,
  `reviewStatus: 'draft'` (BẮT BUỘC — chưa qua duyệt chuyên môn con người).
- Cập nhật `docs/research/de-xuat-uu-tien-mon-toan-2026-09-14.md` đánh dấu chương 2-3 đã có bài
  (draft, chờ duyệt) sau khi PR này merge.

**KHÔNG LÀM:**

- KHÔNG tự đặt `reviewStatus: 'reviewed'` — nội dung Toán mới PHẢI qua quy trình duyệt chuyên môn
  đã xây ở PR #904/#905 (`packages/core-contracts/lessonReview.ts`) trước khi coi là chính thức.
  Sinh ra ở trạng thái `draft` là đúng quy trình, không phải thiếu sót.
- KHÔNG đụng lớp 10 (chương 5) hay lớp 11 (chương 3, 4, 8) — để dành đặc tả riêng (phương án
  B/C trong tài liệu quyết định).
- KHÔNG chép nguyên văn đề bài/ví dụ/cách diễn đạt từ bất kỳ sách giáo khoa nào — chỉ dùng công
  thức/định lý (sự thật toán học, không thuộc bản quyền ai) làm nền, tự soạn ví dụ và đề mới hoàn
  toàn (đúng ranh giới đã chốt ở `kho-kien-thuc-mon-hoc.md` §0.2).
- KHÔNG đưa "Chuyên đề học tập" (tự chọn, không bắt buộc) vào — chỉ làm nội dung SGK chính.
- KHÔNG sửa `MathLessonSchema`/`lessonTypes.ts` — khuôn dữ liệu đã đủ dùng (có sẵn `fraction`,
  `expression` cho đáp số toạ độ/biểu thức nếu cần).

## ② Điểm chạm

| Việc | Đường dẫn file | Ghi chú |
| ---- | -------------- | ------- |
| Thêm | `packages/subject-math/lessons/toan12c2.ts` | Export `TOAN12_C2_LESSONS: MathLesson[]` |
| Thêm | `packages/subject-math/lessons/toan12c3.ts` | Export `TOAN12_C3_LESSONS: MathLesson[]` |
| Sửa | `packages/subject-math/lessons.ts` | Import + gộp 2 mảng mới vào `MATH_LESSONS` |
| Sửa | `packages/subject-math/lessons.test.ts` | Thêm `12-c2`, `12-c3` vào mảng `CHUONG_DA_CO_LUC_KHOA` (test khoá chương thêm ở đợt trước) |
| Sửa (chờ merge) | `docs/research/de-xuat-uu-tien-mon-toan-2026-09-14.md` | Đánh dấu chương 2-3 đã có bài draft |

**Ảnh hưởng lan ra:** `packages/subject-programming/lessonsLoader.ts`-tương-đương của môn Toán
(`packages/subject-math/lessonsLoader.ts`/`lessonsLazy.ts`) tự nạp theo registry — chạy
`npm run gen:lesson-index` NẾU môn Toán cũng dùng cơ chế nạp lười theo unit (kiểm tra file đó có
tồn tại và có phụ thuộc `lessons.ts` không trước khi bỏ qua bước này).

## ③ Hợp đồng dữ liệu

**Vào:** không có input runtime — đây là dữ liệu tĩnh biên dịch vào bundle.

**Ra:** `MathLesson[]` đúng `MathLessonSchema` (`packages/subject-math/lessonTypes.ts`), mẫu 1
câu hỏi cho bài "Toạ độ của vectơ, của điểm":

```ts
{
  prompt: 'Cho A(1; 2; -3) và B(4; -2; 0). Tính toạ độ vectơ AB→.',
  answer: { kind: 'numeric', value: /* ... */ , unit: undefined, tolerance: { mode: 'exact' } },
  explain: '...',
}
```

Với câu hỏi có đáp số là bộ ba toạ độ, KHÔNG dùng một `numeric` duy nhất cho cả vectơ — tách
thành nhiều câu hỏi con (mỗi câu hỏi 1 thành phần toạ độ, hoặc dùng `answer.kind: 'expression'`
với `expr` là chuỗi toạ độ chuẩn hoá, ví dụ `"(3;-4;3)"`) — quyết định cụ thể để dành cho lúc
soạn nội dung thật, dựa theo cách `@dhcb/core-grading` đã hỗ trợ so khớp `expression` (đọc
`packages/core-grading/` trước khi chọn).

**Ca lỗi (là một phần hợp đồng):**

| Tình huống | Hành vi mong đợi |
| ---------- | ----------------- |
| `MathLessonSchema.safeParse` fail | Không được commit — sửa lại cho khớp schema trước |
| `timLoiTuCham` (tự chấm bằng chính đáp án khai) fail | Đáp án khai sai — soạn lại phép tính, không nới lỏng test |
| `chapterTitle` không khớp đúng 1 trong 2 tên chương đã chốt ở mục ① | Sai — chỉnh lại theo đúng tên |

## ④ Tiêu chí chấp nhận

- [ ] `npx vitest run packages/subject-math/lessons.test.ts` xanh — bao gồm ca mới "không thủng
      chương" (đã thêm ở đợt trước) VÀ mọi ca cũ (Zod, id duy nhất, tự chấm đúng, không trùng
      tiêu đề, lời giải đủ dài, trạng thái duyệt khớp băm nội dung).
- [ ] `MATH_LESSONS.filter(l => l.grade === '12' && l.chapterNumber === 2).length >= 4` và tương
      tự chương 3 `>= 3` — đo bằng script nhanh hoặc thêm tạm assertion khi review PR.
- [ ] Mọi bài mới có `reviewStatus: 'draft'` (không có bài nào tự nhận `'reviewed'`).
- [ ] `npm run typecheck && npm run lint && npm run build` sạch.
- [ ] Không có bài nào trong 2 chương mới lặp `title` với bài đã có (test "không trùng tiêu đề"
      đã canh việc này).

**Lệnh chứng minh:**

```bash
npm run typecheck && npm run lint && npx vitest run packages/subject-math/lessons.test.ts && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến | Test nào canh nó |
| -------- | ----------------- |
| Đáp án khai trong `answer` phải tự chấm đúng bằng chính engine `@dhcb/core-grading`, không tự tính tay | `packages/subject-math/lessons.test.ts` ca "mọi checkQuestion tự chấm ĐÚNG" |
| Không xoá/đổi 18 chương đã có trước đó | `packages/subject-math/lessons.test.ts` ca "không thủng chương" |
| `id` khớp đúng khuôn `toan<lớp>-c<chương>-b<bài>` | `MathLessonSchema` refine trong `lessonTypes.ts` |
| Bài `advanced` phải có `advancedTier`; bài `core` thì không | `MathLessonSchema` refine |

## ⑥ Quy ước dự án liên quan

- Import xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi `.js`; import nội bộ gói (`lessons.ts` →
  `lessons/toan12c2.ts`) dùng đường tương đối có đuôi `.js`.
- Nội dung tiếng Việt, thuật ngữ tiếng Anh (nếu có) kèm ngoặc lần đầu xuất hiện.
- Không hard-code màu — `animation` dùng token màu ngữ nghĩa có sẵn trong `LessonAnimationSchema`
  (xem ví dụ `toan12c1.ts`: `stroke: 'muted' | 'primary'`, không phải mã hex).
- Commit theo `feat(math): ...`, PR cần mô tả có đường dẫn `docs/specs/2026-09-14-mon-toan-bo-sung-lop12-c2-c3.md`
  và cụm "Approved for implementation" (đúng luật cổng `metadata` ở CLAUDE.md mục 11).
- Sau khi PR này merge: nội dung vẫn ở trạng thái `draft`, cần chạy qua UI duyệt chuyên môn STEM
  (đã có từ PR #904/#905) để một người có chuyên môn Toán thật xác nhận trước khi coi là đã xong.

---

## Nghiệm thu (điền sau khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ:
