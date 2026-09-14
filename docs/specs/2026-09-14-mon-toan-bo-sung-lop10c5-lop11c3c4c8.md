# Đặc tả — Bổ sung Toán 10 chương 5 và Toán 11 chương 3, 4, 8

> Ngày: 2026-09-14 · Trạng thái: **Approved for implementation** (chỉ dẫn trực tiếp của người
> dùng: "Làm tiếp lớp 10 chương 5 và lớp 11 chương 3/4/8" — tiếp nối phương án B/C đã nêu ở
> `docs/research/de-xuat-uu-tien-mon-toan-2026-09-14.md` mục 4, sau khi lớp 12 (PR #908) đã xong).
> Căn cứ: `docs/research/muc-luc-sgk/toan-10.md` + `toan-11.md` (mục lục SGK Kết Nối Tri Thức
> **thật, đã đối chiếu 2026-08-03** — nguồn chính xác nhất hiện có, ưu tiên hơn
> `kho-kien-thuc-mon-hoc.md` §5 nếu có khác biệt).

## 0. Một câu

Bổ sung 4 chương môn Toán lớp 10-11 đang thủng hoàn toàn (0 bài) vào
`packages/subject-math/lessons/`, đóng nốt phần còn lại của lỗ hổng 6 chương đã phát hiện (2/6
đã đóng ở PR #908).

## ① Phạm vi

**LÀM — 4 file mới, tối thiểu 11 bài:**

1. `packages/subject-math/lessons/toan10c5.ts` — Chương 5 "Các số đặc trưng của mẫu số liệu
   không ghép nhóm" (`toan10-c5-b<N>`), tối thiểu 3 bài theo đúng 3 bài SGK:
   - Số gần đúng và sai số (sai số tuyệt đối/tương đối, quy tròn, độ chính xác).
   - Các số đặc trưng đo xu thế trung tâm (số trung bình, trung vị, tứ phân vị, mốt) — mẫu
     **KHÔNG ghép nhóm** (dữ liệu rời rạc, khác lớp 12 chương 3 vừa làm là ghép nhóm).
   - Các số đặc trưng đo độ phân tán (khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch
     chuẩn, giá trị ngoại lệ) — cũng dữ liệu không ghép nhóm.

2. `packages/subject-math/lessons/toan11c3.ts` — Chương 3 "Các số đặc trưng đo xu thế trung tâm
   của mẫu số liệu ghép nhóm" (`toan11-c3-b<N>`), tối thiểu 2 bài:
   - Mẫu số liệu ghép nhóm (bảng tần số ghép nhóm, giá trị đại diện của nhóm = trung điểm).
   - Các số đặc trưng đo xu thế trung tâm ghép nhóm (số trung bình, trung vị, tứ phân vị, mốt —
     dùng công thức nội suy như đã làm ở Toán 12 chương 3, PR #908, tái dùng đúng logic đó).

3. `packages/subject-math/lessons/toan11c4.ts` — Chương 4 "Quan hệ song song trong không gian"
   (`toan11-c4-b<N>`), tối thiểu 3 bài. **Lưu ý đặc biệt:** SGK đánh dấu phần lớn nội dung chương
   này 🟡/❌ (không chấm tự động được — chủ yếu chứng minh/dựng hình). Thiết kế câu hỏi theo đúng
   tinh thần "chỉ chọn chủ đề chấm được":
   - Bài 1 (gộp Bài 10-11 SGK: đường thẳng-mặt phẳng, hai đường thẳng song song): câu hỏi dạng
     `choice` nhận biết vị trí tương đối (cắt nhau/song song/chéo nhau/trùng nhau), không yêu cầu
     chứng minh.
   - Bài 2 (Bài 12-13 SGK: đường thẳng-mặt phẳng song song, hai mặt phẳng song song, định lí
     Thalès trong không gian): câu hỏi `numeric` tính tỉ lệ đoạn thẳng qua định lí Thalès không
     gian (`AM/AB = AN/AC` khi `MN // BC`) — đây là phần DUY NHẤT của chương có đáp số tính toán
     rõ ràng, ưu tiên khai thác kỹ.
   - Bài 3 (Bài 14 SGK: phép chiếu song song): câu hỏi `choice` nhận biết tính chất bảo toàn của
     phép chiếu song song (giữ tỉ lệ, giữ tính song song; không giữ độ dài/góc).

4. `packages/subject-math/lessons/toan11c8.ts` — Chương 8 "Các quy tắc tính xác suất"
   (`toan11-c8-b<N>`), tối thiểu 3 bài theo đúng 3 bài SGK:
   - Biến cố hợp, biến cố giao, biến cố độc lập (câu hỏi `choice` nhận biết + `numeric` đếm
     `n(A∪B)`, `n(A∩B)` từ tập hợp cụ thể).
   - Công thức cộng xác suất `P(A∪B) = P(A) + P(B) − P(A∩B)`.
   - Công thức nhân xác suất cho hai biến cố độc lập `P(A∩B) = P(A)·P(B)`.

Mỗi bài đúng khuôn `MathLesson` như PR #908 đã làm: `hook` (tình huống Việt Nam tự soạn), `theory`
giải thích VÌ SAO, tối thiểu 1 `animation`/chương, `workedExample`, 2-10 `checkQuestions`,
2-4 `srsCards`, `track: 'core'`, `reviewStatus: 'draft'` BẮT BUỘC.

Đăng ký cả 4 file vào `packages/subject-math/lessons.ts` (đúng vị trí thứ tự lớp/chương tăng
dần), mở rộng `CHUONG_DA_CO_LUC_KHOA` trong `lessons.test.ts` thêm `10-c5`, `11-c3`, `11-c4`,
`11-c8`. Chạy `npm run gen:stem-lesson-index` rồi tự `prettier --write` lại đúng 4 file
`lessonsLazy.ts` bị động chạm (KHÔNG phải cả 4 môn — xem mục ⑤ về nợ kỹ thuật script sinh).

**KHÔNG LÀM:**

- KHÔNG đưa nội dung "Chuyên đề học tập" (tự chọn) vào — chỉ SGK chính.
- KHÔNG cố chấm tự động phần dựng hình/chứng minh thuần của chương 11c4 (Bài 10, Bài 14 phần
  "hình biểu diễn") — bỏ qua hoặc chuyển thành câu hỏi nhận biết khái niệm, không ép ra đáp số.
- KHÔNG tự đặt `reviewStatus: 'reviewed'`.
- KHÔNG chép nguyên văn đề bài/ví dụ SGK — chỉ dùng công thức/định lý làm nền.
- KHÔNG đụng `MathLessonSchema`/`lessonTypes.ts`.

## ② Điểm chạm

| Việc            | Đường dẫn file                                         | Ghi chú                                      |
| --------------- | ------------------------------------------------------ | -------------------------------------------- |
| Thêm            | `packages/subject-math/lessons/toan10c5.ts`            | 3 bài                                        |
| Thêm            | `packages/subject-math/lessons/toan11c3.ts`            | 2 bài                                        |
| Thêm            | `packages/subject-math/lessons/toan11c4.ts`            | 3 bài                                        |
| Thêm            | `packages/subject-math/lessons/toan11c8.ts`            | 3 bài                                        |
| Sửa             | `packages/subject-math/lessons.ts`                     | import + gộp 4 mảng mới                      |
| Sửa             | `packages/subject-math/lessons.test.ts`                | thêm 4 mã chương vào `CHUONG_DA_CO_LUC_KHOA` |
| Sửa             | `packages/subject-math/lessonsLazy.ts`                 | chạy lại `npm run gen:stem-lesson-index`     |
| Sửa (sau merge) | `docs/research/de-xuat-uu-tien-mon-toan-2026-09-14.md` | đánh dấu Việc B đã xong                      |

## ③ Hợp đồng dữ liệu

Giống hệt PR #908 đã làm: `MathLesson[]` đúng `MathLessonSchema`. Mỗi câu hỏi số chỉ hỏi MỘT giá
trị duy nhất — không dùng `expression` cho tuple/bộ nhiều số.

**Riêng chương 11c4 (quan hệ song song):** ưu tiên `answer.kind: 'choice'` cho câu nhận biết vị
trí tương đối/tính chất; chỉ dùng `numeric` cho câu tính tỉ lệ Thalès không gian có đáp số rõ.

**Ca lỗi:**

| Tình huống                                         | Hành vi mong đợi                        |
| -------------------------------------------------- | --------------------------------------- |
| `MathLessonSchema.safeParse` fail                  | Sửa lại cho khớp schema                 |
| `timLoiTuCham` fail                                | Soạn lại phép tính, không nới lỏng test |
| `chapterTitle` không khớp đúng tên đã chốt ở mục ① | Sửa lại theo đúng tên trong mục lục SGK |

## ④ Tiêu chí chấp nhận

- [ ] `npx vitest run packages/subject-math/lessons.test.ts` xanh — mọi ca cũ + ca "không thủng
      chương" với 4 mã chương mới.
- [ ] Cả 4 chương đạt số bài tối thiểu đã nêu ở mục ①.
- [ ] Mọi bài mới `reviewStatus: 'draft'`.
- [ ] `npm run typecheck && npm run lint && npm run build` sạch.
- [ ] Không trùng tiêu đề với bài đã có.
- [ ] Toán 10 đủ 9/9 chương, Toán 11 đủ 9/9 chương (chỉ còn 12c chuyên đề nâng cao ngoài phạm vi).

**Lệnh chứng minh:**

```bash
npm run typecheck && npm run lint && npx vitest run packages/subject-math/lessons.test.ts && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                     | Test nào canh nó                                      |
| -------------------------------------------- | ----------------------------------------------------- |
| Đáp án khai tự chấm đúng bằng engine thật    | `lessons.test.ts` ca "mọi checkQuestion tự chấm ĐÚNG" |
| Không xoá/đổi các chương đã có trước đó      | `lessons.test.ts` ca "không thủng chương"             |
| `id` khớp khuôn `toan<lớp>-c<chương>-b<bài>` | `MathLessonSchema` refine                             |

**Nợ kỹ thuật đã biết (từ PR #908):** `scripts/gen-stem-lesson-index.ts` không tự chạy Prettier —
sau khi chạy, kiểm `git diff` chỉ có 4 file `lessonsLazy.ts` môn Toán đổi thật, nếu 3 môn STEM
khác cũng đổi (chỉ khác định dạng) thì `git checkout` trả lại, KHÔNG commit lẫn.

## ⑥ Quy ước dự án liên quan

Giống PR #908: import nội bộ gói dùng `.js`, không hard-code màu (dùng token ngữ nghĩa trong
animation), commit `feat(math): ...`, PR cần đường dẫn đặc tả này + "Approved for implementation".

---

## Nghiệm thu (điền sau khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa:
- Có phá bất biến ⑤ nào không:
- Còn để ngỏ:
