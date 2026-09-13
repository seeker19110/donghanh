# Đặc tả: Hoàn thiện 4 môn STEM phổ thông (Toán · Lí · Hoá · Sinh)

**Ngày:** 2026-09-13 · **Trạng thái:** Approved for implementation
**Người duyệt:** người dùng (phiên 2026-09-13)

## 1. Bối cảnh và mục tiêu

Trước đợt này (đo 2026-09-13):

| Môn      | Nội dung          | Nối vào `apps/` |
| -------- | ----------------- | --------------- |
| Vật lí   | 85 bài, lớp 10–12 | Chưa            |
| Hoá học  | 72 bài, lớp 10–12 | Chưa            |
| Sinh học | dở dang (8 file)  | Chưa            |
| Toán     | chưa có package   | Chưa            |

Mục tiêu đợt này: **cả 4 môn có bài học đầy đủ, chất lượng sư phạm cao, có hoạt ảnh minh hoạ,
và có nhánh chuyên đề bồi dưỡng học sinh giỏi** — rồi nối vào app cho người học dùng thật.

## 2. Phạm vi

**LÀM:**

- Nội dung bài học chương trình chuẩn GDPT 2018, lớp 10–12, cho cả 4 môn.
- **Hoạt ảnh minh hoạ** khai báo theo `LessonAnimationSchema` cho những bài mà hình động
  thật sự giúp hiểu (chuyển động, trường lực, phản ứng, quá trình sinh học, biến đổi đồ thị).
- **Nhánh nâng cao (`track: 'advanced'`)** cho Toán · Lí · Hoá: chuyên đề bồi dưỡng HSG,
  ba cấp `hsg-truong` → `hsg-tinh` → `hsg-quoc-gia`, đi từ cơ bản lên nâng cao.
- Nối 4 môn vào app: trang danh sách môn, trang bài học, chấm điểm qua `@dhcb/core-grading`.

**KHÔNG làm trong đợt này:**

- Hoạt ảnh 3D/WebGL (người dùng chốt: SVG/CSS).
- Nhánh HSG cho môn Sinh (chỉ 3 môn Toán/Lí/Hoá theo yêu cầu).
- Sinh nội dung bằng AI lúc chạy — bài học là dữ liệu tĩnh, chấm điểm tất định.

## 3. Quyết định đã chốt trong phiên

1. **Bỏ cổng duyệt chuyên môn trước khi nối vào app** (người dùng chốt 2026-09-13).
   Đảo ngược quyết định cũ trong `PROGRESS.md`. Rủi ro: nội dung STEM sai công thức/đơn vị
   đến thẳng người học. **Biện pháp thay thế bắt buộc:** mỗi môn phải có test canh kiểm tính
   nhất quán nội bộ của mọi bài (mục 6), coi như "người duyệt tự động".
2. **Hoạt ảnh là dữ liệu khai báo, không phải HTML tự do** — chống XSS, giữ màu theo token,
   gom xử lý a11y về một chỗ. Hợp đồng: `packages/core-contracts/lessonAnimation.ts`.
3. **Màu đúng/sai (`correct`/`warn`/`danger`) chỉ dùng cho hình vẽ, cấm dùng cho CHỮ** trong
   hoạt ảnh — chữ cần 4.5:1/7:1, hình chỉ cần 3:1. Schema chặn sẵn tại chỗ khai báo.

## 4. Hợp đồng vào–ra (nền móng, đã dựng ở Giai đoạn 0)

- `packages/core-contracts/lessonAnimation.ts`
  - `LessonAnimationSchema` — cảnh hoạt ảnh: `viewBox`, `durationMs`, `loop`, `shapes[]`,
    `captions[]`, và `description` **bắt buộc** (mô tả bằng lời, tối thiểu 20 ký tự).
  - `AnimationShapeSchema` — 6 loại hình: `circle` · `rect` · `line` · `arrow` · `polyline` ·
    `label`. Mỗi hình có `keyframes[]` (chỉ `dx`/`dy`/`rotate`/`scale`/`opacity`).
  - `AnimationColorRoleSchema` — 8 vai trò màu theo ngữ nghĩa, KHÔNG cho mã màu thô.
  - `LessonTrackSchema` = `'core' | 'advanced'`; `AdvancedTierSchema` = ba cấp HSG.
- `packages/core-ui/LessonAnimation.tsx` — trình vẽ dùng chung: ánh xạ vai trò màu sang token,
  tôn trọng `prefers-reduced-motion`, có nút tạm dừng, luôn hiện mô tả bằng lời.
- `packages/core-ui/theme.css` — thêm `--anim-correct` · `--anim-warn` · `--anim-danger`.

Mỗi môn mở rộng `lessonTypes.ts` của mình bằng ba trường mới:

```ts
animation: LessonAnimationSchema.optional(),
track: LessonTrackSchema,              // mặc định 'core'
advancedTier: AdvancedTierSchema.optional(), // bắt buộc khi track === 'advanced'
```

## 5. Chuẩn chất lượng sư phạm (áp cho cả 4 môn)

Mỗi bài học phải có đủ, theo đúng thứ tự người học đi qua:

1. `hook` — tình huống đời thực Việt Nam, gợi tò mò, chưa dạy kiến thức.
2. `theory` — kiến thức cốt lõi, **giải thích cái VÌ SAO chứ không chỉ nêu công thức**;
   nêu rõ điều kiện áp dụng và giới hạn.
3. `animation` (khi hợp) — minh hoạ đúng cơ chế đang dạy, không phải hình trang trí.
4. `workedExample` — một bài mẫu giải từng bước, mỗi bước nói rõ lý do chọn bước đó.
5. `checkQuestions` — 2–10 câu, có **ít nhất một câu bẫy vào lỗi sai phổ biến**, và
   `explain` phải chữa được cái hiểu sai đó chứ không chỉ nhắc lại đáp án đúng.
6. `srsCards` — 2–4 thẻ ôn ngắt quãng, hỏi ý cốt lõi.

Ngôn ngữ: tiếng Việt, xưng hô thân thiện, không hạ thấp người học. Thuật ngữ tiếng Anh
kèm trong ngoặc ở lần xuất hiện đầu.

## 6. Tiêu chí chấp nhận (đo được)

Với mỗi môn:

- `npm test` xanh; test của môn phải kiểm **mọi** bài:
  - Parse qua Zod schema của môn — 0 lỗi.
  - `id` duy nhất và khớp khuôn `<mã môn><lớp>-c<chương>-b<bài>`.
  - Mọi `checkQuestions[].answer` chấm được bằng `@dhcb/core-grading` và **đáp án đúng
    thật sự được chấm là đúng** (chống lỗi sai lệch đơn vị/dung sai).
  - Bài `track: 'advanced'` phải có `advancedTier`; bài `core` thì không được có.
  - Hoạt ảnh: mọi `keyframes[].atMs <= durationMs`; `id` hình không trùng; nhãn `label`
    không dùng vai trò màu `correct`/`warn`/`danger`.
- Cổng chung: `npm run build` · `npm run typecheck` · `npm run lint` (0 cảnh báo) ·
  `npm run format` · `npm test`.
- Cổng a11y `e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts` xanh sau khi nối vào app.

## 7. Bất biến + test canh

| Bất biến                                 | Test canh                                      |
| ---------------------------------------- | ---------------------------------------------- |
| Bài học không nhúng HTML thô             | Schema Zod `.strict()` từ chối trường lạ       |
| Màu hoạt ảnh luôn từ token               | `AnimationColorRoleSchema` là enum đóng        |
| Chữ trong hoạt ảnh đạt ngưỡng tương phản | `label` loại trừ 3 vai trò màu đồ hoạ          |
| Đáp án đúng luôn được chấm đúng          | test mỗi môn chấm lại toàn bộ `checkQuestions` |
| Hoạt ảnh luôn có kênh thay thế bằng lời  | `description` là trường bắt buộc               |

## 8. Quy ước dự án phải theo

- `packages/` không import `apps/`, không import `api/` (ESLint chặn).
- Import xuyên gói dùng `@dhcb/<gói>/<file>` (không đuôi `.js`); import trong cùng gói dùng
  đường tương đối **có** đuôi `.js`.
- URL mang tiêu đề: mọi route có id nội dung có tiêu đề phải dùng `buildSlugSegment` /
  `idFromSlugSegment` của `packages/core-ui/slug.ts`.
- Không hard-code màu; dùng token `--a-*` / `--text-*` / `--anim-*`.
- Vùng chạm ≥ 44px; thiết kế màn nhỏ trước.

## 9. Nghiệm thu

Đợt này xong khi: 4 môn có nội dung đủ theo mục 2, mọi test mục 6 xanh, app hiển thị được
bài học của cả 4 môn kèm hoạt ảnh, và nhánh HSG của Toán/Lí/Hoá truy cập được từ giao diện.
