# Đặc tả — Bù hoạt ảnh minh hoạ cho 4 môn STEM (ưu tiên Vật lí)

> Ngày: 2026-09-14 · Nguồn: phát hiện **F6** của `docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md`
> Khuôn: `docs/templates/dac-ta-tinh-nang.md` · Nền kỹ thuật đã có: `docs/specs/2026-09-13-hoan-thien-4-mon-stem.md`
>
> **Trạng thái: Approved for implementation** — người dùng chốt ngày 2026-09-14. Bốn điểm ở mục
> "Cần người dùng chốt" đã có câu trả lời, ghi lại nguyên văn ở mục "Quyết định của người dùng"
> ngay dưới đây; chúng **ghi đè** các đề xuất cũ còn nằm rải trong thân đặc tả.

## 0. Một câu

Bổ sung hoạt ảnh minh hoạ (trường `animation` đã có sẵn trong schema) cho các bài STEM mà hình
động THẬT SỰ giúp hiểu cơ chế — ưu tiên môn Vật lí — và dựng ngưỡng phủ chặn CI để độ phủ không
tụt lại về mức "tuỳ hứng" như hiện nay.

---

## Bối cảnh đo được (KHÔNG bịa số)

Audit F6 ghi 55/294 bài (19%). Repo đã lớn thêm từ lúc audit, nên **đo lại ngày 2026-09-14**:

```bash
# script tạm trong scratchpad của phiên (không commit), nạp thẳng 4 registry thật
npx tsx <scratchpad>/do-phu-hoat-anh.ts
```

Kết quả thật:

```
Toán     tổng= 53 có hoạt ảnh= 18 (34.0%) | core= 47 core-có= 18 (38.3%) | advanced=6
Vật lí   tổng= 94 có hoạt ảnh= 14 (14.9%) | core= 85 core-có= 14 (16.5%) | advanced=9
Hoá học  tổng= 81 có hoạt ảnh= 15 (18.5%) | core= 72 core-có= 15 (20.8%) | advanced=9
Sinh học tổng= 84 có hoạt ảnh= 15 (17.9%) | core= 84 core-có= 15 (17.9%) | advanced=0
TỔNG     tổng=312 có hoạt ảnh=62 (19.9%)

Vật lí theo lớp:
  lớp 10: 6/37 (16.2%)
  lớp 11: 6/29 (20.7%)
  lớp 12: 2/28 (7.1%)

Hoạt ảnh: n=62 · tổng=189.0 kB · TB=3122 B · min=1656 B · trung vị=3262 B · max=4525 B
```

Hai điều rút ra, quyết định luôn hình dạng đợt việc:

1. **Vật lí lớp 12 gần như trắng** (2/28 = 7,1%) — chương sóng · điện từ · hạt nhân là chỗ hình
   động ăn tiền nhất. Đây là nơi bắt đầu.
2. **Một hoạt ảnh ≈ 3,1 kB JSON thô** (trung vị 3,26 kB, max 4,5 kB). Đây là con số để tính ngân
   sách ở mục ⑤ — không phải ước đoán.

---

## ① Phạm vi

**LÀM:**

- Thêm trường `animation` cho các bài STEM `track: 'core'` **đạt tiêu chí chọn bài** ở mục ③,
  theo đúng `LessonAnimationSchema` hiện có (`packages/core-contracts/lessonAnimation.ts`).
- Chạy lại `npm run gen:stem-lesson-index` sau mỗi lần thêm, để `hasAnimation` trong
  `lessonsLazy.ts` của từng gói môn khớp nội dung thật.
- Thêm **test ngưỡng phủ chặn CI** cho từng gói môn (cùng kiểu với ngưỡng số bài
  `expect(BIOLOGY_LESSONS.length).toBeGreaterThanOrEqual(80)` ở `packages/subject-biology/lessons.test.ts`).
- Thêm **test bất biến chất lượng hoạt ảnh** dùng chung 4 môn (mục ⑤).

**KHÔNG LÀM (quan trọng ngang mục trên):**

- **KHÔNG đụng bất kỳ trường nội dung nào khác của bài học** — `hook`, `theory`, `workedExample`,
  `checkQuestions`, `srsCards`, `title`, `review*` giữ NGUYÊN từng ký tự. Đợt này chỉ thêm/sửa
  đúng khoá `animation`. Lý do: trộn nội dung vào làm diff không review nổi và phá mốc
  `reviewStatus`/băm nội dung của quy trình duyệt chuyên môn.
- **KHÔNG đụng nhánh HSG** (`track: 'advanced'`, 24 chuyên đề). Đó là F7, đợt khác, cần người
  duyệt chuyên môn khác.
- **KHÔNG sửa `packages/core-ui/LessonAnimation.tsx`** trừ khi một tiêu chí ④ không thể đạt bằng
  bộ hình hiện có — và khi đó phải dừng hỏi trước (CLAUDE.md mục 12), không tự mở rộng schema.
- **KHÔNG thêm thư viện đồ hoạ nào** (không `three`, `d3`, `framer-motion`, `lottie`, `gsap`…).
  Hoạt ảnh là SVG khai báo + CSS `@keyframes` do trình vẽ hiện có sinh ra. Không nâng phiên bản
  bất kỳ thư viện nào (CLAUDE.md mục 6: GIỮ NGUYÊN PHIÊN BẢN).
- **KHÔNG nhúng HTML/SVG tự do, không ảnh/GIF/video, không mã màu hex** — đã bị chặn tại schema
  và là lỗ XSS (lý do ghi ở đầu `lessonAnimation.ts`).
- KHÔNG chạm `apps/dhcb/src/pages/learning/StemLessonView.tsx` (nó đã render sẵn `bai.animation`).

## ② Điểm chạm

| Việc     | Đường dẫn file                                                      | Ghi chú                                                             |
| -------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Sửa      | `packages/subject-physics/lessons/ly1{0,1,2}c*.ts`                  | Chỉ thêm khoá `animation` vào các bài được chọn. Đợt 1+2.           |
| Sửa      | `packages/subject-chemistry/lessons/*.ts`                           | Đợt 3.                                                              |
| Sửa      | `packages/subject-biology/lessons/*.ts`                             | Đợt 3.                                                              |
| Sửa      | `packages/subject-math/lessons/*.ts`                                | Đợt 4 (đang cao nhất: 34%).                                         |
| Sinh lại | `packages/subject-*/lessonsLazy.ts`                                 | **TỆP SINH TỰ ĐỘNG** — chỉ đổi qua `npm run gen:stem-lesson-index`. |
| Thêm     | `packages/core-contracts/animationQuality.ts` (+ `.test.ts`)        | Hàm rà bất biến chất lượng hoạt ảnh, 4 môn dùng chung.              |
| Sửa      | `packages/subject-{physics,chemistry,biology,math}/lessons.test.ts` | Thêm test ngưỡng phủ + gọi hàm rà trên.                             |

**Ảnh hưởng lan ra:**

**Codemap ĐÃ CHẠY THẬT (2026-09-14, sau `npm ci`):**

```
$ npm run codemap -- impact packages/core-contracts/lessonAnimation.ts
124 file bị ảnh hưởng
  · core-contracts/stemLesson.ts · subject-{math,physics,chemistry,biology}/lessonTypes.ts
  · core-ui/LessonAnimation.tsx · subject-chemistry/lessons.ts · LessonAnimation.test.tsx
  ·· core-learner/stemLessonLoader.ts …

$ npm run codemap -- impact packages/core-ui/LessonAnimation.tsx
5 file bị ảnh hưởng
  · StemLessonView.tsx · LessonAnimation.test.tsx ·· App.tsx · StemLesson.test.tsx ··· main.tsx
```

**Đọc ra điều gì:** sửa _schema_ lan ra 124 file, sửa _trình vẽ_ chỉ lan ra 5. Con số này xác
nhận quyết định lớn nhất của đặc tả: **chỉ thêm dữ liệu `animation`, tuyệt đối không đụng
schema** — làm vậy thì bề mặt ảnh hưởng gần như bằng 0.

Bản đồ import chi tiết (dựng bằng grep, bổ sung cho codemap):

## ③ Hợp đồng dữ liệu

**Vào:** không có API mới. Đơn vị công việc là một khoá thêm vào object bài học:

```ts
// packages/core-contracts/lessonAnimation.ts — KHÔNG sửa, chỉ dùng
animation?: {
  title: string            // 1..120
  description: string      // 20..800 — BẮT BUỘC, là bản văn bản tương đương của hoạt ảnh
  viewBoxWidth: number     // ≤ 2000
  viewBoxHeight: number    // ≤ 2000
  durationMs: number       // 500..60_000
  loop: boolean
  shapes: AnimationShape[] // 1..60 — circle | rect | line | arrow | polyline | label
  captions?: { atMs: number; text: string }[] // ≤ 12
}
// Màu chỉ nhận VAI TRÒ ngữ nghĩa: primary | accent | correct | warn | danger | neutral | muted | surface
// Riêng `label` bị schema cấm dùng correct/warn/danger (màu đồ hoạ 3:1, không đủ cho chữ).
```

**Ra:** `LESSON_INDEX[].hasAnimation` chuyển `false → true` cho đúng các bài đã thêm, sau khi
chạy `npm run gen:stem-lesson-index`.

**TIÊU CHÍ CHỌN BÀI (phần quan trọng nhất của đặc tả — chống "phủ bừa cho đủ số"):**

Một bài **xứng đáng** có hoạt ảnh khi trả lời ĐƯỢC câu hỏi: _"hình động cho thấy điều gì mà một
câu văn không nói được?"_. Cụ thể, thêm hoạt ảnh khi bài dạy ít nhất một trong:

1. **Chuyển động / biến thiên theo thời gian** (quỹ đạo ném xiên, dao động, sóng lan truyền, chu
   trình nhiệt, phân bào, chuẩn độ).
2. **Quan hệ hình học vô hình** (hợp lực, phân tích vector, đường sức trường, quy tắc bàn tay,
   hình học không gian, phép biến hình).
3. **Quá trình nhiều bước có thứ tự** (cơ chế phản ứng, nhân đôi ADN, mạch điện đóng/mở, thuật
   toán hình học).
4. **Đồ thị biến thiên theo tham số** (đồ thị hàm số khi đổi hệ số, đặc tuyến V-A, đường cong
   chuẩn độ).

**KHÔNG thêm hoạt ảnh** cho: bài ôn tập chương, bài định nghĩa/danh pháp thuần, bài luyện tính
toán, bài mà hình chỉ là trang trí tĩnh. Với các bài này, **để trống là đáp án đúng** — nó đã
được ghi thẳng trong comment của schema và là lý do trường này `optional`.

**Ca lỗi (là một phần hợp đồng):**

| Tình huống                                     | Biểu hiện                                         | Hành vi mong đợi                                                         |
| ---------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------ |
| `description` < 20 ký tự hoặc chỉ chép `title` | Zod fail / test chất lượng đỏ                     | Chặn tại `lessons.test.ts`; viết mô tả đủ để hiểu bài khi KHÔNG xem hình |
| keyframe vượt `durationMs`                     | Zod `.refine` fail                                | Test đỏ, sửa dữ liệu                                                     |
| trùng `id` hình trong một hoạt ảnh             | Zod `.refine` fail                                | Test đỏ, sửa dữ liệu                                                     |
| `label` dùng màu `correct/warn/danger`         | Zod fail                                          | Đổi sang `neutral`/`muted`/`primary`                                     |
| quên `npm run gen:stem-lesson-index`           | `lessonsLazy.test.ts` đỏ                          | Chạy lại lệnh sinh, commit cả file sinh                                  |
| bài không đạt tiêu chí ③ nhưng vẫn được thêm   | không cổng nào bắt — **việc của người review PR** | Reviewer trả lại, ghi rõ tiêu chí nào không đạt                          |

## ④ Tiêu chí chấp nhận

> (Viết TRƯỚC mục giải pháp, theo luật số 1 của khuôn.)

**Độ phủ — tính trên bài `track: 'core'`** (nhánh HSG ngoài phạm vi, không được đưa vào mẫu số):

- [ ] **Đợt 1 — Vật lí 12 + cơ học 10:** Vật lí core từ **14/85 (16,5%)** lên **≥ 34/85 (≥ 40%)**;
      riêng lớp 12 từ 2/28 lên **≥ 12/28**. Đo bằng test ngưỡng mới trong
      `packages/subject-physics/lessons.test.ts`.
- [ ] **Đợt 2 — Vật lí 11 (điện · từ · sóng):** Vật lí core **≥ 51/85 (≥ 60%)**.
- [ ] **Đợt 3 — Hoá + Sinh:** Hoá core ≥ **40%** (từ 20,8%) · Sinh core ≥ **40%** (từ 17,9%).
- [ ] **Đợt 4 — Toán:** Toán core ≥ **50%** (từ 38,3%).
- [ ] Mỗi bài được thêm khớp ít nhất một tiêu chí chọn bài ở ③, và **PR ghi rõ tiêu chí nào**
      trong bảng "bài · tiêu chí · hình động cho thấy gì".

**Kỹ thuật:**

- [ ] `LESSON_INDEX[].hasAnimation` khớp 100% dữ liệu thật (`lessonsLazy.test.ts` xanh).
- [ ] 100% hoạt ảnh mới qua `LessonAnimationSchema` (đã có sẵn trong `lessons.test.ts`).
- [ ] **Initial JS không tăng quá 0,5 kB** so với trước đợt (kỳ vọng: **0 kB** — dữ liệu bài học
      nạp lười theo chương, không nằm trong entry). Đo bằng `npm run build && npm run budget`,
      dán số trước/sau vào PR.
- [ ] **Không chunk chương nào sau build vượt 45 kB brotli.** Lệnh:
      `npm run build && npm run size:chunks` (cổng thật `scripts/check-lesson-chunks.ts`, chạy
      trong CI ở job `build`). Hiện lớn nhất: `sinh12c1` **33,7 kB**, còn 11,3 kB biên độ.

  > **Tiêu chí này đã ĐỔI ngày 2026-09-14, người dùng chốt.** Bản đầu viết: _"không file chương
  > nào (`packages/subject-*/lessons/*.ts`) vượt 120 kB **nguồn** (hiện lớn nhất `ly10c3.ts`
  > 56,7 kB)"_. Nó sai hai lần:
  >
  > 1. **Đo sai thứ.** Byte mã nguồn không phải thứ người học tải — giữa nguồn và trình duyệt
  >    còn bundler và nén brotli. `sinh12c1.ts` 249,6 kB nguồn ra chunk **33,7 kB brotli**, chênh
  >    hơn 7 lần. Ngưỡng nguồn còn phạt nhầm thứ nên khuyến khích: comment tiếng Việt bị bundler
  >    bỏ hẳn, và `description` dài (bản văn bản thay thế hoạt ảnh cho người dùng trình đọc màn
  >    hình) thì nén rất tốt vì lặp từ — cả hai đều tính vào byte nguồn.
  > 2. **Mốc nền ghi sai.** "Lớn nhất 56,7 kB" là con số của riêng môn Lí; lúc viết đặc tả
  >    `sinh12c1.ts` đã là 132 kB, tức tiêu chí đã bị vi phạm trước khi có ai kiểm nó.
  >
  > Điều quan trọng hơn cả việc đổi con số: tiêu chí cũ **chưa bao giờ là cổng**, chỉ là một dòng
  > chữ trong tài liệu, nên nó bị vi phạm lặng lẽ. Bản mới có `scripts/check-lesson-chunks.ts`
  > chạy trong CI. Trần 45 kB đặt khi mức thật cao nhất là 33,7 kB — **nới nó phải là quyết định
  > có chủ đích ghi lý do trong PR**; cách xử lý đúng khi một chương vượt trần là **tách chương
  > thành nhiều file nguồn**, không phải nâng hằng số.

- [ ] **Tầng 8b (CLAUDE.md/QUY-TRINH-AUDIT):** ảnh chụp trang bài học **1440px + 390px**, mỗi đợt
      ít nhất 2 bài mới, đính vào PR; và **một ảnh chụp với `prefers-reduced-motion: reduce`**
      cho thấy hình đứng yên vẫn đọc được.

**Lệnh chứng minh:**

```bash
npm ci
npm run typecheck && npm run lint && npm run test:coverage && npm run build
npm run gen:stem-lesson-index && git diff --exit-code   # chỉ mục phải đã khớp
npx vitest run packages/subject-physics packages/subject-chemistry packages/subject-biology packages/subject-math packages/core-contracts packages/core-ui
npm run budget                                           # biên độ bundle trước/sau
npm run codemap -- impact packages/core-contracts/lessonAnimation.ts
npx playwright test e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts
```

## ⑤ Bất biến không được phá

| Bất biến                                                                                                      | Test nào canh nó                                                            |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Độ phủ hoạt ảnh core của từng môn **không bao giờ tụt** dưới ngưỡng đợt vừa đạt (ratchet)                     | `packages/subject-<môn>/lessons.test.ts` — hằng số `TOI_THIEU_PHU_HOAT_ANH` |
| Mọi hoạt ảnh có `description` ≥ 20 ký tự và **khác** `title` (văn bản tương đương thật)                       | `packages/core-contracts/animationQuality.test.ts` (mới)                    |
| Hoạt ảnh `loop: true` phải có `captions` hoặc `description` ≥ 80 ký tự (lặp vô hạn mà không lời dẫn là nhiễu) | `animationQuality.test.ts` (mới)                                            |
| Không mã màu thô trong hoạt ảnh — chỉ vai trò màu → token `--a-*`                                             | `packages/core-ui/LessonAnimation.test.tsx:62` (đã có) + schema             |
| `prefers-reduced-motion: reduce` tắt hẳn chuyển động, cảnh hiện ở mốc 0                                       | `packages/core-ui/LessonAnimation.test.tsx:78` (đã có)                      |
| `<svg>` luôn `aria-describedby` trỏ tới mô tả + có nút tạm dừng                                               | `LessonAnimation.test.tsx:70,82` (đã có)                                    |
| `LESSON_INDEX.hasAnimation` khớp dữ liệu thật                                                                 | `packages/subject-<môn>/lessonsLazy.test.ts` (đã có)                        |
| Initial JS ≤ 140 kB · Initial CSS ≤ 20 kB (brotli)                                                            | `size-limit` qua `npm run size` / `npm run budget` trong CI                 |
| a11y AA toàn site + AAA cho chữ nội dung, 15 trang × 5 theme, 0 vi phạm                                       | `e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts` (đã có, chặn CI)                |

**Ghi chú ngân sách (nợ kỹ thuật số 6, `PROGRESS.md` dòng ~757).** Ngân sách bundle đang mỏng:
đo 2026-09-14 JS **126,07 / 140 kB (90,06%)**, CSS **18,11 / 20 kB (90,6%)**. Đợt này **chỉ thêm
DỮ LIỆU nằm trong chunk chương nạp lười**, không thêm thư viện, không thêm class Tailwind mới,
nên kỳ vọng **cả JS lẫn CSS đứng yên**. Nếu số đo sau đợt cho thấy initial JS nhích lên, nghĩa là
có import đi nhầm đường (ai đó `import` từ `lessons.ts` thay vì `lessonsLoader.ts`) — **dừng và
sửa import, TUYỆT ĐỐI không nới ngưỡng** (PROGRESS đã ghi: không nới hai lần liên tiếp).

Ước lượng khối lượng dữ liệu, từ số đo thật (TB 3,12 kB/hoạt ảnh): đợt 1 (+20 hoạt ảnh Lí)
≈ **+62 kB nguồn**, chia đều ~18 file chương → mỗi chunk lười nặng thêm ~~3,5 kB, chưa nén.
Toàn bộ 4 đợt (~~+150 hoạt ảnh) ≈ **+470 kB nguồn**, vẫn 0 kB vào initial JS.

## ⑥ Quy ước dự án liên quan

- Import xuyên gói dùng `@dhcb/<gói>/<file>` **không đuôi `.js`**; import nội bộ trong gói dùng
  đường tương đối **có đuôi `.js`**.
- `packages/` không được import `apps/` (ESLint chặn).
- `lessonsLazy.ts` là **tệp sinh tự động** — sửa tay là sai; chạy `npm run gen:stem-lesson-index`.
- Màu lấy từ token `--a-*` (`apps/dhcb/src/index.css`), **không hard-code màu** (CLAUDE.md 4.8).
  Trong hoạt ảnh, điều này được thực thi bằng cách chỉ khai **vai trò màu**.
- a11y là **sàn cứng, dung sai 0**: chữ nội dung AAA (≥ 7:1), phần còn lại AA. Chữ trong hoạt ảnh
  (`label`) là chữ thật nên chịu ngưỡng chữ — đó là lý do schema cấm `correct/warn/danger` ở label.
- Comment tiếng Việt ở chỗ quan trọng; nội dung bài học bằng tiếng Việt.
- Cổng test của CI là `npm run test:coverage` (có ngưỡng chặn), **không phải** `npm test`.
- Trước lần push cuối: `rm -rf packages/*/dist dist dist-server && npm run typecheck` để tái hiện
  checkout sạch của CI (TRAPS.md mục 3).
- PR: tiêu đề conventional commit scope **chữ thường**; đủ 6 tiêu đề mô tả; `feat(` phải trỏ tới
  đúng đường dẫn đặc tả này + cụm "Approved for implementation".

---

## Chia đợt (mỗi đợt = 1 PR)

| Đợt | Nội dung                                                                    | Vì sao thứ tự này                                                             |
| --- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 0   | Hạ tầng: `animationQuality.ts` + test + hằng số ngưỡng (đặt = mức HIỆN TẠI) | Dựng ratchet TRƯỚC khi thêm nội dung, để mọi đợt sau có cổng đo               |
| 1   | **Vật lí 12 (2/28 → ≥12/28) + cơ học Lí 10**                                | Phủ thấp nhất toàn dự án; sóng/điện từ/hạt nhân là chỗ hình động ăn tiền nhất |
| 2   | **Vật lí 11** (điện · từ trường · dao động · sóng) → Lí core ≥ 60%          | Hoàn tất môn ưu tiên số 1 trước khi sang môn khác                             |
| 3   | **Hoá + Sinh** → mỗi môn core ≥ 40%                                         | Cơ chế phản ứng / quá trình sinh học, cùng loại hình vẽ                       |
| 4   | **Toán** → core ≥ 50%                                                       | Đang cao nhất (38,3%), ít cấp bách nhất                                       |

Mỗi đợt: nâng hằng số ngưỡng trong `lessons.test.ts` lên đúng mức vừa đạt (ratchet), kèm ảnh chụp
Tầng 8b và bảng "bài · tiêu chí ③ · hình động cho thấy gì".

## Quyết định của người dùng (2026-09-14) — GHI ĐÈ đề xuất trong thân đặc tả

| #   | Câu hỏi             | Người dùng chốt                                                                                                               |
| --- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | Mục tiêu phủ        | **70% cho CẢ BỐN môn** (tính trên bài `track: 'core'`), **cao hơn** đề xuất Lí 60 · Hoá 40 · Sinh 40 · Toán 50                |
| 2   | Ai duyệt chuyên môn | Hoạt ảnh mới vào ở `reviewStatus: 'draft'` như mọi nội dung STEM khác — không dựng luồng duyệt riêng cho đợt này              |
| 3   | Ratchet cứng        | **Có.** Ngưỡng phủ core **chặn CI**, chỉ tăng không giảm. Hạ hằng số phải là quyết định có chủ đích, ghi lý do trong mô tả PR |
| 4   | Đợt 0 tách PR riêng | **Không** — làm đợt 0 → 4 một mạch trong cùng một đợt việc                                                                    |

**Mục tiêu 70% quy ra số tuyệt đối** (mẫu số là bài `core`, đo lại 2026-09-14):

| Môn      | core    | đang có        | cần ≥ 70% | phải bù |
| -------- | ------- | -------------- | --------- | ------- |
| Vật lí   | 85      | 14 (16,5%)     | 60        | 46      |
| Hoá học  | 72      | 15 (20,8%)     | 51        | 36      |
| Sinh học | 84      | 15 (17,9%)     | 59        | 44      |
| Toán     | 47      | 18 (38,3%)     | 33        | 15      |
| **Σ**    | **288** | **62 (21,5%)** | **203**   | **141** |

**Ràng buộc KHÔNG được nới để chạy theo con số 70%:** tiêu chí chọn bài ở mục ③ vẫn là luật.
Bài ôn tập chương · danh pháp thuần · luyện tính toán thuần thì **để trống vẫn là đáp án đúng**.
Nếu một môn loại hết bài không xứng đáng mà vẫn không chạm 70%, **báo con số thật** trong mô tả
PR kèm danh sách bài đã cố ý bỏ qua và lý do — **không vẽ bừa cho đủ số**. Ngưỡng ratchet khi đó
đặt bằng mức THẬT đạt được, không đặt bằng mức mong muốn.

## Cần người dùng chốt (4 điểm) — ĐÃ CHỐT, giữ lại làm bản ghi

1. **Mục tiêu phủ có đúng tham vọng không?** Đề xuất: Lí 60% · Hoá 40% · Sinh 40% · Toán 50%
   (core). 100% là sai mục tiêu — bài ôn tập/danh pháp không nên có hoạt ảnh.
2. **Ai duyệt chuyên môn hoạt ảnh?** Audit xếp việc này "cần người duyệt". Hoạt ảnh vật lí SAI về
   mặt vật lí thì hại hơn không có. Đề xuất: đi qua đúng quy trình
   `docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md`, hoạt ảnh mới vào ở `reviewStatus: 'draft'`.
3. **Có chấp nhận ratchet cứng không?** Ngưỡng phủ chặn CI nghĩa là về sau xoá/gộp bài có thể làm
   CI đỏ và phải chỉnh hằng số có chủ đích. Đây là ý đồ (F6 xảy ra chính vì không có cổng nào).
4. **Đợt 0 tách PR riêng, hay gộp vào đợt 1?** Đề xuất tách — để cổng được review độc lập với nội dung.
