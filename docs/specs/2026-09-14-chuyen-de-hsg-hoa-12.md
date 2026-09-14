# Đặc tả — Chuyên đề HSG môn Hoá lớp 12 (lấp lỗ hổng F7)

**Ngày:** 2026-09-14 · **Trạng thái:** chờ người dùng duyệt (xem ô ⓪.5)
**Nguồn gốc:** phát hiện **F7** của `docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md`
— "Hoá lớp 12 có 0 chuyên đề HSG trong khi Hoá 10 có 3 và Hoá 11 có 6 — chỗ này lệch không có
lý do ghi ở đâu cả".
**Đặc tả nền còn hiệu lực:** `docs/specs/2026-09-13-hoan-thien-4-mon-stem.md` (khai sinh nhánh
`track: 'advanced'` + ba cấp `advancedTier`) · `docs/goals/2026-08-31-mon-hoc-toan-ly-hoa-sinh.md`
(nội dung STEM là **bản nháp chờ duyệt chuyên môn**) ·
`docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md` (quy trình duyệt, trường `review`).

## 0. Một câu

Bổ sung **hai chuyên đề HSG cho Hoá lớp 12** (6 bài, đủ ba cấp trường/tỉnh/quốc gia mỗi chuyên
đề) bám đúng chương trình Hoá 12 GDPT 2018 đang có trong repo, để nhánh bồi dưỡng HSG môn Hoá
phủ đủ cả ba lớp thay vì hụt hẳn lớp cuối cấp.

## 0.5. HAI ĐIỀU CẦN NGƯỜI DÙNG CHỐT TRƯỚC KHI THI HÀNH

Đây là nội dung dạy người thật, tôi không tự quyết:

| #      | Câu hỏi                                                                                                                                   | Đề xuất của tôi                                                                                                                                                                                              |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Q1** | Lớp 12 làm **2 chuyên đề (6 bài)** hay **1 chuyên đề (3 bài)**?                                                                           | **2 chuyên đề**, để Hoá cân đối 3 / 6 / 6 bài cho lớp 10 / 11 / 12 — lớp 12 là lớp thi HSG quốc gia thật nên không nên mỏng hơn lớp 11. Chọn 1 chuyên đề thì bỏ chuyên đề **Điện hoá** và ghi lý do vào ô ①. |
| **Q2** | Hai chuyên đề đề xuất (**Điện hoá & ăn mòn** · **Hoá hữu cơ tổng hợp: ester–carbohydrate–amine/amino acid–polymer**) có đúng ý bạn không? | Giữ nguyên — căn cứ ở ô ①bis. Nếu bạn muốn đổi một chuyên đề sang **Phức chất & kim loại chuyển tiếp d** (chương 8), nói trước khi thi hành vì nó đổi cả danh mục bài lẫn mã chương.                         |

Chưa có câu trả lời thì **không bắt đầu soạn nội dung**.

## ① Phạm vi

**LÀM:**

- Thêm **2 file dữ liệu chuyên đề HSG Hoá 12**, mỗi file đúng **3 bài** ứng ba cấp
  `hsg-truong` → `hsg-tinh` → `hsg-quoc-gia` (khuôn y hệt 3 file HSG Hoá đang có).
- Nối 2 file mới vào `packages/subject-chemistry/lessons.ts` (mục "Nhánh nâng cao", cuối registry).
- Chạy lại `npm run gen:stem-lesson-index` để sinh lại `lessonsLazy.ts`.
- Thêm **test bất biến chặn CI** về độ phủ HSG theo lớp (ô ⑤).
- Ghi **lý do phân bố HSG** (vì sao Sinh 0, vì sao Toán 2 bài/lớp, Hoá/Lí 3 bài/chuyên đề) vào
  đầu `packages/subject-chemistry/lessons.ts` và vào `PROGRESS.md`, để F7 không tái phát dạng
  "lệch không có lý do ghi ở đâu".
- Tạo file nhật ký đợt việc trong `docs/changelog/` theo quy ước CLAUDE.md mục 3.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- **KHÔNG thêm nhánh HSG cho môn Sinh.** Đã chốt "KHÔNG làm" ở
  `docs/specs/2026-09-13-hoan-thien-4-mon-stem.md` dòng 34. Sinh = 0 chuyên đề là ĐÚNG, không
  phải lỗ hổng.
- **KHÔNG đụng nội dung Hoá 10 / Hoá 11** (3 file HSG cũ + 13 file chương). Ngoại lệ duy nhất
  được phép: nếu bài mới vô tình trùng tiêu đề với bài cũ thì **đổi tiêu đề bài MỚI**, không sửa
  bài cũ.
- **KHÔNG đụng hoạt ảnh** (`hasAnimation` / `LessonAnimationSchema`) — F6 là đợt việc khác.
  Sáu bài mới đều **không có** `animation`, đúng như 9 bài HSG hiện tại.
- **KHÔNG sửa** `lessonTypes.ts`, `ChemLessonSchema`, `core-grading`, `core-contracts`. Đợt này
  chỉ là **dữ liệu + test**; phải sửa schema nghĩa là đã đi ra ngoài phạm vi → dừng và hỏi.
- **KHÔNG đặt `reviewStatus: 'reviewed'`.** Mọi bài mới là `'draft'` (ô ⑥).
- **KHÔNG đụng môn Toán / Lí**, kể cả để "cho cân" — Toán 2 bài/lớp là khuôn riêng của môn đó.
- **KHÔNG lấy đề từ SGK / đề thi HSG đã công bố.** Tự soạn, ranh giới bản quyền như các đợt trước.

## ①bis. Danh mục chuyên đề đề xuất cho Hoá 12 (quyết định nội dung)

**Chương trình Hoá 12 thật trong repo** (đo bằng lệnh ở ô ④, 8 chương): 1 Ester–Lipid ·
2 Carbohydrate · 3 Hợp chất chứa nitrogen · 4 Polymer · 5 Pin điện và điện phân · 6 Đại cương về
kim loại · 7 Nguyên tố nhóm IA và IIA · 8 Sơ lược kim loại chuyển tiếp d và phức chất.

### Chuyên đề A — `hoa-hsg-dien-hoa` "Điện hoá học: pin, thế điện cực và điện phân"

Gắn vào **chương 5 + 6** (Pin điện và điện phân · Đại cương về kim loại).

| Bài | id             | Cấp            | Nội dung lõi                                                                                         | Lý do sư phạm                                                                                                                        |
| --- | -------------- | -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `hoa12-c90-b1` | `hsg-truong`   | Thế điện cực chuẩn, dãy hoạt động, tính E°pin = E°catot − E°anot, dự đoán chiều phản ứng             | Với tới được từ chương trình chuẩn — chỉ cần tra bảng và trừ hai số, đúng mức đề trường                                              |
| 2   | `hoa12-c91-b1` | `hsg-tinh`     | Điện phân: định luật Faraday (m = AIt/nF), thứ tự phóng điện ở hai điện cực, điện phân dung dịch     | Mức tỉnh: nhiều bước, dễ sai vì bỏ sót nước cạnh tranh phóng điện — đúng loại bẫy đề tỉnh hay dùng                                   |
| 3   | `hoa12-c92-b1` | `hsg-quoc-gia` | Phương trình Nernst (E phụ thuộc nồng độ), quan hệ ΔG° = −nFE° và E° ↔ K, ăn mòn điện hoá định lượng | Mức quốc gia: nối điện hoá với nhiệt động (bài HSG quốc gia lớp 10 `hoa10-c92-b1` đã dạy ΔG° = −RT·lnK) → khép vòng kiến thức ba lớp |

### Chuyên đề B — `hoa-hsg-huu-co-12` "Hữu cơ lớp 12: nhận biết, chuỗi biến hoá và bài toán hỗn hợp"

Gắn vào **chương 1–4** (Ester–Lipid · Carbohydrate · Hợp chất chứa nitrogen · Polymer).

| Bài | id             | Cấp            | Nội dung lõi                                                                                                 | Lý do sư phạm                                                                                           |
| --- | -------------- | -------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 1   | `hoa12-c93-b1` | `hsg-truong`   | Thuỷ phân ester / chất béo: chỉ số xà phòng hoá, bài toán hiệu suất, xác định công thức ester từ dữ kiện mol | Kĩ năng nền của cả chương 1, đề trường gần như luôn có                                                  |
| 2   | `hoa12-c94-b1` | `hsg-tinh`     | Amine – amino acid – peptide: tính lưỡng tính, pH tại điểm đẳng điện, thuỷ phân peptide và đếm số peptide    | Mức tỉnh: đòi hỏi ghép tính acid–base (đã học ở HSG 11 dung dịch) vào hợp chất hữu cơ                   |
| 3   | `hoa12-c95-b1` | `hsg-quoc-gia` | Hỗn hợp nhiều chất: bảo toàn nguyên tố/khối lượng/electron, quy đổi hỗn hợp, biện luận công thức polymer     | Mức quốc gia: dạng "bài toán hỗn hợp" là thứ phân loại thật ở vòng quốc gia, không có công thức máy móc |

**Căn cứ số lượng (2 chuyên đề × 3 bài = 6 bài):** đo thật ở ô ④ cho thấy Hoá 11 hiện có đúng
**2 chuyên đề × 3 bài**, Hoá 10 có **1 chuyên đề × 3 bài**, môn Lí có **1 chuyên đề × 3 bài mỗi
lớp**. Khuôn "một chuyên đề = đúng 3 bài, mỗi bài một cấp" là bất biến của toàn hệ — đợt này
theo đúng, chỉ quyết **số chuyên đề**. Lớp 12 lấy 2 chuyên đề vì nó gánh cả khối hữu cơ lẫn khối
điện hoá/kim loại, và là lớp dự thi quốc gia.

**Mã chương dành riêng:** nhánh HSG dùng `chapterNumber` ≥ 90, không trùng chương SGK (1..8).
Lớp 12 chưa dùng mã nào nên lấy 90–95, đúng cách lớp 11 đã làm (90–92 và 93–95).
`lessonNumber` = 1 cho mọi bài HSG (mỗi "chương HSG" chỉ có một bài) — giữ nguyên khuôn cũ.

## ② Điểm chạm

| Việc          | Đường dẫn file                                            | Ghi chú                                                                           |
| ------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Thêm          | `packages/subject-chemistry/lessons/hoa-hsg-dien-hoa.ts`  | export `HOA_HSG_DIEN_HOA_LESSONS: ChemLesson[]`, đúng 3 phần tử                   |
| Thêm          | `packages/subject-chemistry/lessons/hoa-hsg-huu-co-12.ts` | export `HOA_HSG_HUU_CO_12_LESSONS: ChemLesson[]`, đúng 3 phần tử                  |
| Sửa           | `packages/subject-chemistry/lessons.ts`                   | 2 dòng `import` + 2 dòng spread ở cuối mảng `CHEM_LESSONS` + comment ghi lý do F7 |
| Sửa (tự sinh) | `packages/subject-chemistry/lessonsLazy.ts`               | **KHÔNG sửa tay** — chạy `npm run gen:stem-lesson-index`                          |
| Sửa           | `packages/subject-chemistry/lessons.test.ts`              | Thêm 1 ca test độ phủ HSG theo lớp (ô ⑤)                                          |
| Sửa           | `PROGRESS.md`                                             | F7 chuyển từ nợ mở sang đã xử lý, kèm số PR                                       |
| Thêm          | `docs/changelog/NNNN-2026-09-__-hsg-hoa-12.md`            | `npm run changelog` in số kế tiếp                                                 |
| KHÔNG sửa     | `packages/subject-chemistry/lessonTypes.ts`               | Schema đủ dùng; phải sửa = ra ngoài phạm vi                                       |
| KHÔNG sửa     | `packages/subject-{physics,math,biology}/**`              | Môn khác không đụng                                                               |

**Ảnh hưởng lan ra (codemap ĐÃ CHẠY THẬT 2026-09-14, sau `npm ci`):**

```
$ npm run codemap -- impact packages/subject-chemistry/lessons.ts
8 file bị ảnh hưởng khi sửa "packages/subject-chemistry/lessons.ts":
  · apps/server/src/api/admin/admin-stem-review.ts
  · packages/subject-chemistry/lessons.test.ts
  · packages/subject-chemistry/lessonsLazy.test.ts
  · scripts/export-review-queue.ts
  · scripts/review-status.ts
  ·· apps/server/src/routes.ts
  ·· apps/server/src/api/admin/admin-stem-review.test.ts
```

**Đọc ra điều gì:** phạm vi hẹp và đúng như mong đợi — thêm bài Hoá chỉ lan tới bộ test của
chính gói Hoá và **luồng duyệt chuyên môn** (`admin-stem-review`, `export-review-queue`,
`review-status`). Tức 6 bài mới sẽ tự động vào hàng chờ duyệt ở `/admin`, không cần nối tay.
Đáng chú ý: **giao diện học KHÔNG nằm trong danh sách** — vì nó đọc `lessonsLazy.ts` chứ không
đọc registry đồng bộ.

Phạm vi suy ra bằng grep (thay tạm, không thay thế codemap): `lessons.ts` của Hoá được import
bởi `lessons.test.ts`, `lessonsLoader.ts`, `scripts/gen-stem-lesson-index.ts`,
`packages/core-learner/stemLessonLoader.ts`. Giao diện **không** import registry đồng bộ — nó
đọc `lessonsLazy.ts` (luật nạp lười, CLAUDE.md mục 7), nên **quên chạy `gen:stem-lesson-index`
là 6 bài mới không hiện ra trên app** dù test registry vẫn xanh.

## ③ Hợp đồng dữ liệu

**Vào:** không có đầu vào lúc chạy — đây là dữ liệu tĩnh trong mã nguồn.

**Ra:** mỗi bài mới là một `ChemLesson` (kiểu đã có ở `packages/subject-chemistry/lessonTypes.ts`,
**không đổi**), với các trường nhánh nâng cao bắt buộc:

```ts
{
  id: 'hoa12-c9X-b1',          // regex sẵn có: /^hoa(10|11|12)-c\d+-b\d+$/
  grade: '12',
  chapterNumber: 90 | 91 | 92 | 93 | 94 | 95,
  chapterTitle: 'Chuyên đề HSG — <tên chuyên đề>',
  lessonNumber: 1,
  title: 'HSG cấp <trường|tỉnh|quốc gia>: <nội dung>',
  hook: string,                // ≥ 150 ký tự (ô ④)
  theory: string,              // ≥ 1200 ký tự (ô ④)
  workedExample: { problem, steps: string[] /* 4..8 */, answer },
  checkQuestions: [...],       // đúng 3 câu, mỗi câu explain ≥ 120 ký tự
  srsCards: [...],             // 3..4 thẻ
  track: 'advanced',
  advancedTier: 'hsg-truong' | 'hsg-tinh' | 'hsg-quoc-gia',
  reviewStatus: 'draft',
}
```

`answer` của mỗi `checkQuestion` dùng đúng `ChemAnswerSpec` đã có (`numeric` · `choice` ·
`chemFormula` · `chemEquation`). Câu `choice` **bắt buộc** có `choices` khớp `correctIds`
(schema `.refine` đã canh).

**Ca lỗi (là một phần hợp đồng):**

| Tình huống                                                | Biểu hiện                                     | Hành vi mong đợi                                                                  |
| --------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| Đáp án khai không tự chấm đúng bằng engine `core-grading` | `timLoiTuCham` trả lỗi → test đỏ              | Sửa **đáp án/đơn vị trong dữ liệu**, TUYỆT ĐỐI không nới `tolerance` cho vừa test |
| `numeric` có đơn vị nhưng quên `unit`                     | test tự chấm đỏ                               | Khai `unit` đúng chuỗi tác giả viết trong `prompt`                                |
| Trùng `id` hoặc trùng `title` với bài đã có               | test `id duy nhất` / `không trùng tiêu đề` đỏ | Đổi **bài mới**                                                                   |
| Quên `advancedTier` khi `track:'advanced'`                | Zod `.refine` đỏ                              | Bổ sung                                                                           |
| Quên chạy `gen:stem-lesson-index`                         | `lessonsLazy.test.ts` đỏ                      | Chạy `npm run gen:stem-lesson-index`, commit cả `lessonsLazy.ts`                  |
| Nội dung có công thức sai kiến thức                       | **KHÔNG cổng máy nào bắt được**               | Vì vậy `reviewStatus='draft'` + đưa 6 bài vào hàng chờ duyệt chuyên môn (ô ⑥)     |

## ④ Tiêu chí chấp nhận

Viết trước ô giải pháp, mỗi dòng kèm lệnh chứng minh.

- [ ] **Đủ 6 bài mới, đúng ba cấp mỗi chuyên đề.** Lệnh đo (đã chạy được ở phiên soạn đặc tả):

  ```bash
  npx tsx -e "(async()=>{const m=await import('./packages/subject-chemistry/lessonsLazy.ts');
  const a=(m.LESSON_INDEX as any[]).filter(l=>l.track==='advanced');
  const by:Record<string,number>={}; for(const l of a) by[l.grade+'|'+l.advancedTier]=(by[l.grade+'|'+l.advancedTier]||0)+1;
  console.log(JSON.stringify(by,null,0), 'tổng', a.length)})()"
  ```

  **Trước (đo thật 2026-09-14):**
  `{"11|hsg-truong":2,"11|hsg-tinh":2,"11|hsg-quoc-gia":2,"10|hsg-truong":1,"10|hsg-tinh":1,"10|hsg-quoc-gia":1}` — tổng 9, **lớp 12 vắng mặt hoàn toàn**.
  **Sau (bắt buộc):** thêm `"12|hsg-truong":2,"12|hsg-tinh":2,"12|hsg-quoc-gia":2` — tổng **15**.

- [ ] **Mỗi chuyên đề đúng 3 bài, mỗi cấp đúng 1 bài** (`chapterKey` mới: `hoa-hsg-dien-hoa`,
      `hoa-hsg-huu-co-12`) — test ⑤.
- [ ] **Không bài nào trùng tiêu đề với bất kỳ bài Hoá nào khác** (F8) —
      `npx vitest run packages/subject-chemistry/lessons.test.ts`.
- [ ] **Mọi `explain` ≥ 40 ký tự** (cổng CI đã có, F9) **và thực tế mỗi câu ≥ 120 ký tự** —
      ngưỡng 120 lấy từ số đo thật của 9 bài HSG hiện có: `explain` ngắn nhất là **82** ký tự,
      trung vị ~270. Đặt 120 để bài mới không kéo tụt mặt bằng; cổng CI vẫn giữ 40 vì đó là
      ngưỡng áp cho toàn môn.
- [ ] **`theory` ≥ 1200 ký tự / bài.** Số đo 9 bài hiện có: 1256–2251 (trung bình ~1612).
- [ ] **`hook` ≥ 150 ký tự** (hiện có: 190–246). **`workedExample.steps` từ 4 đến 8**
      (hiện có: 5–6). **`srsCards` 3–4 thẻ** (hiện có: 3–4). **`checkQuestions` đúng 3**
      (hiện có: 3/3 ở cả 9 bài).
- [ ] **Mọi đáp án tự chấm đúng bằng engine thật** — ca `timLoiTuCham` trong `lessons.test.ts`.
- [ ] **Mọi bài `reviewStatus: 'draft'`**, không bài nào `'reviewed'`.
- [ ] **Chỉ mục nạp lười khớp registry** — `lessonsLazy.test.ts` xanh sau khi chạy
      `npm run gen:stem-lesson-index`.
- [ ] **Không file nào ngoài ô ② bị đổi** — `git diff --stat` đọc tay.

**Lệnh chứng minh (chạy hết, dán output vào PR):**

```bash
npm ci
npm run gen:stem-lesson-index
npm run typecheck && npm run lint && npm run test:coverage && npm run build
npx vitest run packages/subject-chemistry
npm run codemap -- impact packages/subject-chemistry/lessons.ts
```

## ⑤ Bất biến không được phá

| Bất biến                                                                                                 | Test canh                                                                      |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **MỚI:** mỗi lớp Hoá 10/11/12 có **≥ 1 chuyên đề HSG**, mỗi chuyên đề **đúng 3 bài, đúng 1 bài mỗi cấp** | **Viết mới** trong `packages/subject-chemistry/lessons.test.ts` (khuôn ở dưới) |
| Không hai bài Hoá nào trùng tiêu đề nguyên văn (F8)                                                      | `lessons.test.ts` — ca đã có, chỉ cần vẫn xanh                                 |
| Không `explain` nào dưới 40 ký tự (F9)                                                                   | `lessons.test.ts` — ca đã có                                                   |
| Mọi đáp án khai tự chấm đúng bằng `core-grading` (không "đáp án tham chiếu" sai)                         | `lessons.test.ts` → `timLoiTuCham(CHEM_LESSONS)`                               |
| Mọi bài qua `ChemLessonSchema`; `id` duy nhất                                                            | `lessons.test.ts` — 2 ca đã có                                                 |
| `reviewStatus` khai rõ, không tự nhận `reviewed`                                                         | `lessons.test.ts` → `timLoiDuyet(CHEM_LESSONS)`                                |
| Chỉ mục nạp lười khớp registry                                                                           | `packages/subject-chemistry/lessonsLazy.test.ts`                               |

Khuôn ca test MỚI (viết TRƯỚC khi soạn nội dung — nó phải đỏ trước, xanh sau):

```ts
it('mỗi lớp Hoá đều có chuyên đề HSG, mỗi chuyên đề đủ ba cấp', () => {
  // Audit 2026-09-14 (F7): Hoá 12 có 0 chuyên đề HSG trong khi 10 có 1 và 11 có 2 — lệch
  // không có lý do ghi ở đâu. Ca này biến "đủ ba lớp" thành cổng chặn CI.
  const adv = CHEM_LESSONS.filter((l) => l.track === 'advanced')
  const theoChuyenDe = new Map<string, string[]>() // chapterTitle+grade -> các tier
  for (const l of adv) {
    const k = `${l.grade}|${l.chapterTitle}`
    theoChuyenDe.set(k, [...(theoChuyenDe.get(k) ?? []), l.advancedTier!])
  }
  for (const g of ['10', '11', '12'] as const) {
    const cua = [...theoChuyenDe.keys()].filter((k) => k.startsWith(`${g}|`))
    expect(cua.length, `lớp ${g} phải có ít nhất 1 chuyên đề HSG`).toBeGreaterThanOrEqual(1)
  }
  for (const [k, tiers] of theoChuyenDe) {
    expect([...tiers].sort(), `chuyên đề ${k} phải đủ ba cấp, mỗi cấp đúng 1 bài`).toEqual([
      'hsg-quoc-gia',
      'hsg-tinh',
      'hsg-truong',
    ])
  }
})
```

**Lưu ý khi viết ca này:** nó áp lên **cả 9 bài cũ**. Đo ở phiên soạn đặc tả cho thấy 3 chuyên đề
Hoá hiện có đều đúng khuôn 3 bài/3 cấp, nên ca sẽ xanh với dữ liệu cũ. Nếu đỏ ở dữ liệu cũ →
**dừng và báo**, không sửa dữ liệu cũ (ô ①).

## ⑥ Quy ước dự án liên quan

- **Nạp lười theo unit:** giao diện KHÔNG import `lessons.ts`; thêm/sửa bài xong **bắt buộc**
  `npm run gen:stem-lesson-index`, commit cả `lessonsLazy.ts` (CLAUDE.md mục 7).
- **Import:** xuyên gói dùng `@dhcb/<gói>/<file>` (không đuôi `.js`); nội bộ gói dùng đường
  tương đối **có** đuôi `.js` (ví dụ `'./lessons/hoa-hsg-dien-hoa.js'`).
- **`reviewStatus` là bắt buộc và mọi bài mới là `'draft'`.** Chỉ người chuyên môn mới được lật
  sang `'reviewed'`, qua quy trình ở
  `docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md` (duyệt trong `/admin`, ghi bản
  ghi `review`, AI **tuyệt đối không** được tự ghi `reviewed`). Đợt này chỉ **nộp 6 bài vào hàng
  chờ duyệt**, không tự duyệt.
- **Chấm điểm tất định:** mọi `checkQuestion` chấm bằng `@dhcb/core-grading`, **không AI**.
- **TypeScript `strict`, không `any`.** Dữ liệu khai kiểu `ChemLesson[]`.
- **Comment tiếng Việt** ở đầu file nói rõ: chuyên đề gì, ba cấp chia thế nào, vì sao mã chương
  ≥ 90, `reviewStatus='draft'` — đúng khuôn 3 file HSG hiện có.
- **Không lấy đề từ SGK hay đề thi đã công bố** — tự soạn.
- **Git:** nhánh riêng, conventional commits. Tiêu đề PR đề xuất:
  `feat(chemistry): chuyên đề HSG Hoá 12 (điện hoá + hữu cơ)`; vì là `feat(` nên mô tả PR phải
  trỏ tới **chính file đặc tả này** kèm cụm "Approved for implementation", và đủ 6 tiêu đề
  `## Tóm tắt` · `## Issue / outcome` · `## Research / spec` · `## Validation` ·
  `## Rủi ro, rollout và rollback` · `## Definition of Done`.
- **Không đụng prompt AI** → không cần `eval:tutor` / `eval:code-feedback` cho đợt này.

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Bảng phân bố HSG trước/sau (dán output lệnh ở ô ④):
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Kết quả `npm run codemap -- impact packages/subject-chemistry/lessons.ts` (đặc tả đã chạy sẵn ở ô ②, chạy lại để xác nhận không phát sinh phụ thuộc mới):
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ: 6 bài mới vẫn `draft` — đưa vào lô duyệt chuyên môn nào, khi nào?
