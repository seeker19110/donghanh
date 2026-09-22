# Đặc tả: Hoạt ảnh mô phỏng minh hoạ bài học (khung dùng chung mọi môn)

> GĐ0 của kế hoạch "hoạt ảnh mô phỏng cho từng bài học" (thống nhất với người dùng
> 2026-09-21). Trạng thái: **research xong, chờ duyệt trước khi thi hành GĐ1.**

## 0. Một câu

Xác nhận hạ tầng hoạt ảnh SVG khai báo (`LessonAnimationSchema`) đã đủ dùng cho 4 môn
STEM, mở rộng cùng cơ chế đó (không thêm thư viện) sang môn Lập trình, và chốt danh sách
bài ưu tiên soạn nội dung `animation` trước.

## ① Phạm vi

**LÀM (GĐ0 — đợt này):**

- Ghi nhận hạ tầng đã có: `packages/core-contracts/lessonAnimation.ts`
  (`LessonAnimationSchema` — SVG khai báo: `shapes` (circle/rect/line/arrow/polyline/label) +
  `keyframes` (dx/dy/rotate/scale/opacity) + `captions` theo mốc thời gian), renderer
  `packages/core-ui/LessonAnimation.tsx`, đã dùng ở Toán/Lý/Hoá/Sinh qua trường
  `animation?: LessonAnimationSchema` trong `lessonTypes.ts` mỗi gói (thêm ở PR
  `docs/specs/2026-09-13-hoan-thien-4-mon-stem.md`).
- Chốt danh sách **~25 khái niệm ưu tiên** cần hoạt ảnh (bảng ở mục dưới), xếp theo
  môn + bài/chặng nguồn cụ thể.
- Thiết kế mở rộng schema `SpecStageDetail` (môn Lập trình,
  `packages/subject-programming/specializations/stageDetailTypes.ts`) để nhận trường
  `animation?: LessonAnimation` **cho từng module**, tái dùng nguyên `LessonAnimationSchema`
  — không tạo schema hoạt ảnh thứ hai.
- Ra tiêu chí chấp nhận đo được cho MỘT bài mẫu (dùng ở GĐ1).

**KHÔNG LÀM (đợt này):**

- Không viết nội dung `animation` thật cho bất kỳ bài nào (để GĐ1 thí điểm 3–5 bài trước).
- Không đụng môn Anh — `subject-english` không có cấu trúc "bài học theo chương" (chỉ có
  từ điển/CEFR tagging/dataset), cần một buổi `/grill` riêng để thiết kế trước khi áp
  animation vào đó. Ghi lại như một khoảng mở, không đoán.
- Không thêm thư viện animation (framer-motion/lottie/gsap/d3/three) — xác nhận
  `package.json` gốc chưa có, và không cần: schema SVG khai báo hiện tại đã đủ biểu đạt.
- Không đổi renderer `LessonAnimation.tsx` trừ khi GĐ1 phát hiện thiếu khả năng biểu đạt.

## ② Điểm chạm

| Việc                         | Đường dẫn file                                                                                                                     | Ghi chú                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Đọc (đã xong)                | `packages/core-contracts/lessonAnimation.ts`                                                                                       | Schema dùng chung, KHÔNG sửa ở GĐ0                 |
| Đọc (đã xong)                | `packages/core-ui/LessonAnimation.tsx`                                                                                             | Renderer, lo `prefers-reduced-motion` + a11y       |
| Đọc (đã xong)                | `packages/subject-{physics,chemistry,biology,math}/lessonTypes.ts`                                                                 | Nơi gắn `animation` hiện tại                       |
| Thêm (GĐ1)                   | `packages/subject-programming/specializations/stageDetailTypes.ts`                                                                 | Thêm `animation?: LessonAnimation` vào kiểu module |
| Sửa nội dung (GĐ1, thí điểm) | `packages/subject-{physics,chemistry,biology,math}/lessons/*.ts` (chọn mẫu) + `specializations/details/algo-s1.ts` (chọn 1 module) | Soạn `animation` thật cho bài mẫu                  |

**Ảnh hưởng lan ra (theo codemap — chạy khi bắt đầu GĐ1):**

- `apps/dhcb/src/pages/learning/StemLessonView.tsx` (renderer đang gọi cho STEM).
- Trang hiển thị bài học Lập trình (cần tìm component tương ứng — hiện `specializations/details/*`
  chỉ có text, GĐ1 phải xác định nơi render trước khi thêm animation vào UI).
- `npm run codemap -- impact packages/subject-programming/specializations/stageDetailTypes.ts`
  (chạy thật ở đầu GĐ1, không đoán ở đây).

## ③ Hợp đồng dữ liệu

**Vào (không đổi — tái dùng nguyên):**

```ts
// packages/core-contracts/lessonAnimation.ts — ĐÃ CÓ, không sửa
LessonAnimationSchema // title, description(20-800 ký tự), viewBoxWidth/Height,
// durationMs(500-60000), loop, shapes[1-60], captions?[<=12]
```

**Ra (mở rộng, GĐ1 mới thêm):**

```ts
// packages/subject-programming/specializations/stageDetailTypes.ts
interface SpecStageModule {
  // ...các trường hiện có: moduleId, objective, practice, selfCheck, doneSignals
  animation?: LessonAnimation // MỚI — optional, module nào hoạt ảnh không giúp hiểu thêm thì bỏ trống
}
```

**Ca lỗi:**

| Tình huống                                                                | Mã lỗi            | Hành vi mong đợi                                  |
| ------------------------------------------------------------------------- | ----------------- | ------------------------------------------------- |
| `animation` không qua Zod parse (vd id trùng, keyframe vượt `durationMs`) | build-time (test) | Test dữ liệu bài học đỏ ngay, không lọt vào build |
| Thiếu `description` hoặc quá ngắn (<20 ký tự)                             | build-time (test) | Đỏ — hoạt ảnh không có mô tả là thiếu a11y        |

## ④ Tiêu chí chấp nhận (cho GĐ0 — đợt đang làm)

- [x] Xác nhận không có animation library nào đã cài — `grep -E "framer-motion|lottie|gsap|d3|three" package.json` không ra kết quả.
- [x] Xác nhận `LessonAnimationSchema` tồn tại và đã dùng ở 4 môn STEM — đọc trực tiếp `lessonTypes.ts` của cả 4 gói.
- [ ] Danh sách 25 khái niệm ưu tiên đã ghi vào đặc tả này (mục dưới) — người dùng duyệt danh sách trước khi giao subagent GĐ1.
- [ ] `SpecStageDetail` mở rộng trường `animation` — làm ở GĐ1, có test Zod canh.

**Lệnh chứng minh (GĐ0 — đã chạy, chỉ đọc):**

```bash
grep -E "framer-motion|lottie|gsap|\"d3\"|\"three\"" package.json   # không khớp dòng nào
```

## ⑤ Bất biến không được phá

| Bất biến                                                                                                                                       | Test nào canh nó                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Màu hoạt ảnh chỉ lấy từ `AnimationColorRoleSchema` (token `--a-*`), không hex tự do                                                            | schema Zod tại nguồn (`.strict()`)                            |
| Hoạt ảnh luôn có `description` cho người tắt animation/dùng trình đọc màn hình                                                                 | `LessonAnimationSchema` bắt buộc `description` (min 20 ký tự) |
| `id` các hình trong một hoạt ảnh không trùng nhau                                                                                              | `.refine()` trong `LessonAnimationSchema`                     |
| `advancedTier` chỉ có mặt khi `track === 'advanced'` (không liên quan animation nhưng cùng schema bài học, tránh phá khi sửa `lessonTypes.ts`) | `.refine()` trong từng `lessonTypes.ts` môn STEM              |

## ⑥ Quy ước dự án liên quan

- Nội dung/tiêu đề (bao gồm `label` trong animation là `<text>` thật) phải đạt AAA
  (tương phản ≥ 7:1) — schema đã tự loại `correct/warn/danger` khỏi màu chữ label vì
  ba màu đó chỉ đạt 3:1.
- Bài học là DỮ LIỆU do AI sinh — không nhúng HTML/SVG tự do (rủi ro XSS), luôn qua
  schema khai báo + một renderer duy nhất.
- Vật lý/Hoá/Sinh còn `reviewStatus: 'draft'`, CHƯA nối vào `apps/` — soạn animation cho
  các môn này không tự động lộ ra người dùng, vẫn cần bước duyệt nội dung riêng trước khi nối.
- Môn Lập trình dùng nạp lười theo unit (`lessonsLoader`) — thêm trường `animation` vào
  `specializations/details/*.ts` xong phải chạy `npm run gen:lesson-index` nếu cấu trúc
  file lesson đổi (cần xác nhận lại ở GĐ1 vì `stageDetailTypes` khác cấu trúc `lessons/*.ts`).
- Mọi PR chạm giao diện phải chụp ảnh Tầng 8b (1440px + 390px, trước/sau).

---

## Danh sách 25 khái niệm ưu tiên (kết quả kiểm kê, chờ người dùng duyệt)

**Vật lý** (`packages/subject-physics/lessons/`):

1. Dao động điều hoà = hình chiếu chuyển động tròn đều — `ly11c1.ts` (đã có animation mẫu)
2. Sóng cơ lan truyền / giao thoa sóng — `ly11c2.ts`/`ly11c3.ts`
3. Cảm ứng điện từ (từ thông biến thiên → dòng cảm ứng) — `ly11c4.ts`/`ly12*`
4. Chuyển động ném xiên/rơi tự do (vector vận tốc phân rã) — `ly10c1.ts`–`ly10c3.ts`
5. Mạch điện xoay chiều (pha giữa U và I) — `ly12*`

**Hoá học** (`packages/subject-chemistry/lessons/`): 6. Phản ứng trao đổi ion / kết tủa — `hoa11*` 7. Liên kết ba N≡N và cơ chế phản ứng — `hoa11c2.ts` 8. Cân bằng hoá học dịch chuyển (Le Chatelier) — `hoa10c7.ts` 9. Điện phân / pin điện hoá (dòng electron) — `hoa-hsg-dien-hoa.ts` 10. Cấu hình electron nguyên tử, orbital — `hoa10c1.ts`

**Sinh học** (`packages/subject-biology/lessons/`, nhiều animation mẫu nhất): 11. Nguyên phân/giảm phân (phân chia NST) — `sinh10*`/`sinh12c1.ts` 12. Phiên mã – dịch mã (DNA→mRNA→protein) — `sinh12c1.ts` 13. Vận chuyển qua màng (thẩm thấu, khuếch tán) — `sinh10*` 14. Chu trình Krebs/hô hấp tế bào — `sinh10*` 15. Dòng năng lượng trong hệ sinh thái — `sinh12c2.ts`/`sinh12c3.ts`

**Toán** (`packages/subject-math/lessons/`): 16. Hoán vị/chỉnh hợp/tổ hợp (cây lựa chọn) — `toan10c8.ts` 17. Đạo hàm = độ dốc tiếp tuyến (cát tuyến → tiếp tuyến) — `toan11*` 18. Vector mặt phẳng/không gian (cộng, tích vô hướng) — `toan10*`/`toan12*` 19. Hàm lượng giác trên đường tròn lượng giác — `toan10*`/`toan11*`

**Lập trình** (`packages/subject-programming/specializations/details/`, cần mở rộng schema trước): 20. Thuật toán sắp xếp (so sánh/hoán đổi từng bước) — `algo-s1.ts`/`algo-s2.ts` 21. Cấu trúc dữ liệu: mảng động nhân đôi, bảng băm va chạm — `algo-s1.ts` (module `algo-s1-m2`) 22. Cây/đồ thị: lan truyền BFS/DFS — `algo-s2.ts`/`algo-s3.ts` 23. Kiến trúc hệ thống: request/response, load balancing — `architecture-s*.ts` 24. Pipeline dữ liệu ETL — `data-s2.ts`

**Tiếng Anh** — khoảng mở, cần thiết kế cấu trúc riêng (xem mục ① KHÔNG LÀM): 25. Trục thời gian các thì tiếng Anh (timeline quá khứ/hiện tại/tương lai) — chưa có
file nguồn phù hợp, để lại cho buổi `/grill` riêng.

---

## Kết quả GĐ1 (thí điểm, chạy 2026-09-21 — QUAN TRỌNG: sửa lại danh sách 25 mục ở trên)

**Phát hiện chính: danh sách 25 khái niệm ở GĐ0 lập bằng phán đoán theo chương trình SGK,
CHƯA đối chiếu mã nguồn thật.** Khi giao 5 subagent thí điểm (mỗi môn 1 bài), **4/5 mục tiêu
ban đầu đã có sẵn animation từ trước** (PR `docs/specs/2026-09-13-hoan-thien-4-mon-stem.md`
và các đợt sau đã soạn nhiều hơn ghi nhận ở đây). Kiểm kê thật lúc đó:

- **Hoá học:** 21/26 file lesson đã có animation (62 animation), chỉ 5 file HSG còn trống.
  Mục 6/7/8 (trao đổi ion, N≡N, Le Chatelier) đều ĐÃ CÓ từ trước — **không phải việc chưa làm.**
- **Sinh học:** animation phủ dày nhất — `sinh12c1.ts` 17/19 bài đã có (kể cả mục 12 phiên mã–
  dịch mã); mục 13/14/15 (vận chuyển màng, hô hấp tế bào, dòng năng lượng hệ sinh thái) **đều
  đã có animation**, không còn trống như ghi ở GĐ0.
- **Vật lý:** mục 3 (cảm ứng điện từ) ghi sai file (`ly11c4.ts` không tồn tại nội dung này);
  thực tế nằm ở `ly12c3.ts` và 7/8 bài chương "Từ trường" đã có animation từ trước.
- **Toán:** mục 17 (đạo hàm) **đã có animation** ở `toan11c9.ts` — nhưng animation đó có
  **lỗi hình học thật** (cát tuyến xoay không đồng bộ với điểm di chuyển, không hội tụ đúng
  về tiếp tuyến). Đã sửa lại toạ độ/góc quay cho khớp toán học.
- **Lập trình:** không lệch (đúng như dự đoán, chưa có animation nào) — đã thêm animation sắp
  xếp nổi bọt vào `algo-s1-m1` (không phải `algo-s1-m2` như GĐ0 đoán — module đó không dạy sắp xếp).

**5 việc đã hoàn thành (PR #1099):**

1. Sửa lỗi hình học animation có sẵn — `packages/subject-math/lessons/toan11c9.ts` (`toan11-c9-b1`).
2. Animation mới — `packages/subject-programming/specializations/details/algo-s1.ts` (module `algo-s1-m1`, sắp xếp nổi bọt).
3. Animation mới — `packages/subject-chemistry/lessons/hoa-hsg-dien-hoa.ts` (`hoa12-c90-b1`, pin Galvani Zn–Cu — bài HSG vì mọi bài Hoá phổ thông đã có animation).
4. Animation mới — `packages/subject-physics/lessons/lyhsgnhietdientu.ts` (`ly12-c93-b3`, thanh dẫn trượt trên ray — bài HSG vì chương Từ thông phổ thông đã có animation).
5. Animation mới — `packages/subject-biology/lessons/sinh11c1.ts` (`sinh11-c1-b1`, vòng năng lượng ATP — bài lý thuyết cốt lõi còn trống thật sự sau khi rà toàn môn).

**Bài học vận hành cho các đợt sau (GĐ2 nhân rộng phải áp dụng):**

- **Luôn `grep -c "animation: {" packages/subject-<môn>/lessons/*.ts` TRƯỚC khi giao việc**,
  không giao theo tên khái niệm suông — tốn ít nhất 1 vòng brief/blocker cho mỗi mục nếu bỏ qua.
- **`npm run gen:stem-lesson-index` là bắt buộc sau MỌI lần thêm animation STEM** (test
  `lessonsLazy.test.ts` canh `hasAnimation` khớp nội dung thật) — không phải tuỳ chọn như GĐ0
  từng viết ở mục ⑥. Lệnh này sinh lại chỉ mục của **cả 4 môn cùng lúc** và xuất KHÔNG theo
  Prettier, nên nhiều subagent chạy song song sẽ đè mất thay đổi của nhau ở `lessonsLazy.ts`.
  Cách xử lý đã dùng ở GĐ1: mỗi subagent tự `git checkout --` trả lại 3 file môn không phụ
  trách sau khi sinh, rồi coordinator chạy lại **một lần cuối** sau khi gộp hết + `prettier --write`.
  GĐ2 nên cân nhắc mỗi lô một worktree riêng để tránh điểm tranh chấp này hoàn toàn.
- **Thêm animation cho bài HSG (track "advanced") có thể làm lệch test đếm cứng ở tầng UI**
  ghép core+advanced — xem `apps/dhcb/src/lib/outline/stemOutlineApp.test.ts` (đã sửa). Chạy
  `npx vitest run` toàn repo sau mỗi đợt, đừng chỉ chạy test trong phạm vi gói vừa sửa.
- Animation cho bài `track: 'advanced'`/`reviewStatus: 'draft'` (Vật lý/Hoá/Sinh còn nháp,
  chưa nối `apps/`) vẫn cần duyệt nội dung chuyên môn riêng trước khi lộ ra người dùng — GĐ1
  chỉ xác nhận đúng kỹ thuật (schema + toán/lý/hoá đúng), không thay cho bước duyệt đó.
- Nơi render animation của môn Lập trình trong UI **vẫn chưa xác định** (để ngỏ, như GĐ0 đã ghi).

## Kết quả GĐ2 — bước 1 (2026-09-22, `docs/changelog/0406-*.md`): nối UI môn Lập trình

- **Nơi render đã chốt:** `apps/dhcb/src/pages/subjects/programming/ProgrammingSpecStagePage.tsx`,
  trong `ModuleBlock` — sau mục "Kiến thức", trước "Tự tay làm". Dùng nguyên renderer
  `packages/core-ui/LessonAnimation.tsx`, không sửa renderer (đúng ①); bề rộng SVG giới hạn
  `max-w-2xl` ở tầng gọi vì viewBox nhỏ mà cột 4xl rộng.
- **Cổng Zod cho môn Lập trình nay có thật:** `packages/subject-programming/specStageDetails.test.ts`
  chạy `LessonAnimationSchema.safeParse` cho mọi `module.animation` (GĐ1 mới có kiểu TS, chưa có cổng
  chạy-thật này). Cổng trang: `ProgrammingSpecStagePage.test.tsx`.
- **Tầng 8b đã chụp** cho `algo-s1-m1` (1440 + 390 × blue-sky/dark-blue) — phát hiện và sửa: mô tả
  gọi "khung viền cam" trong khi màu là token `accent` đổi theo theme → **luật mới cho mọi
  animation: mô tả bằng lời KHÔNG gọi tên màu cụ thể**, chỉ mô tả tương đối ("sáng hơn", "viền
  đậm", "đổi màu báo đúng").
- Còn ngỏ: nhân rộng nội dung (bước 2), môn Anh, 3 animation STEM nháp chưa nối `apps/`.

## Kết quả GĐ2 — bước 2 (2026-09-22, `docs/changelog/0407-*.md`): 10 hoạt ảnh thuật toán + sửa renderer

- **Nhân rộng:** 10 hoạt ảnh mới cho `algo-s1-m2/m3`, `algo-s2-m1..m4`, `algo-s3-m1..m4` (bảng ở
  changelog). Bỏ qua có chủ đích `algo-s1-m4` và cả `algo-s4` (hình động không giúp hiểu thêm).
- **Phát hiện lớn: hoạt ảnh CHƯA TỪNG CHẠY ở cả 5 môn** từ khi có renderer (`TRAPS.md` mục 10).
  Hai lỗi: (1) `animation-name` ở hình con còn duration ở `<g>` cha — CSS animation không kế thừa;
  (2) opacity tĩnh × opacity động, 159/238 hoạt ảnh mắc. Cả hai sửa ở `core-ui/LessonAnimation.tsx`
  (đây là sửa LỖI, không phải thêm khả năng biểu đạt — không trái ①), có 2 test canh.
- **Luật ⑥ bổ sung (bắt buộc cho mọi đợt hoạt ảnh sau):** Tầng 8b cho hoạt ảnh = chụp **≥ 3 mốc
  thời gian** và so ảnh khác nhau thật; kỹ thuật đáng tin
  `el.getAnimations().forEach(a => { a.pause(); a.currentTime = t })`. Ảnh cảnh đầu không phân
  biệt được hoạt ảnh chạy và hoạt ảnh đứng yên. Subagent soạn hoạt ảnh phải tự chụp và ĐỌC ảnh
  trước khi báo xong; "qua Zod + typecheck" không đủ.
- **Khuôn dữ liệu đã chốt:** hình "hiện muộn" = keyframes `{atMs:0, opacity:0}` giữ 0 tới ngay
  trước lúc hiện rồi lên 1, giữ tới `atMs: durationMs`; overlay đánh dấu (viền đúng/đang xét)
  KHÔNG đặt `fill` đục vì vẽ sau sẽ che hình dưới; mốc quyết định cách nhau ≥ 600ms.
- Còn ngỏ: rà bằng mắt theo thời gian cho hoạt ảnh Toán (môn STEM duy nhất đã nối `apps/`); môn
  Anh; 3 môn STEM nháp.

## Kết quả rà mắt Toán (2026-09-22, `docs/changelog/0408-*.md`): 34/34 hoạt ảnh, sửa 15

- Công cụ chính thức cho luật ⑥: `npm run shots:lesson-anim` (`scripts/shots-lesson-animations.ts`)
  render `LessonAnimation` ra HTML tĩnh (không cần DB), chụp 5 mốc 2/25/50/75/98% và ghép dải
  `montage/<id>.png`; thoát 1 nếu hoạt ảnh nào có 0 animation chạy. Ảnh ghi ngoài repo.
- 4 lỗi SAI NỘI DUNG: `rotate` quay quanh tâm hình chứ không quanh đầu mút (`toan11-c1-b1`), nhãn
  trạng thái không đổi theo ba vị trí (`toan10-c7-b2`), nhãn M/N đứng yên khi MN trượt
  (`toan11-c4-b2`), chữ tràn viewBox bị cắt (`toan12-c1-b2`). 11 lỗi nhãn đè/cắt/gạch ngang.
- **Khuôn dữ liệu bổ sung:** hình "quay quanh đầu mút" = `rotate` + `dx/dy` cho trung điểm chạy
  trên đường tròn r/2; nhãn gọi tên hình động PHẢI mang cùng keyframes tịnh tiến; mỗi trạng thái
  một nhãn riêng bật/tắt bằng opacity; chữ ≤ ~0,55·size px/ký tự so với `viewBoxWidth`.
- Còn ngỏ (chưa sửa, mức nhẹ): `toan12-c4-b2` ba hình chữ nhật thô vẫn hiện dưới lớp mịn ở cảnh
  cuối; `toan12-c5-b2` nhãn "(P): Ax + By…" bị đường tròn cắt qua ở hai mốc cuối.

## Nghiệm thu

- Lệnh đã chạy + kết quả thật: `npm run typecheck` xanh, `npm run lint` xanh (0 cảnh báo),
  `npx vitest run` toàn repo 705 file/16299 test xanh (1 test bị ảnh hưởng đã sửa, xem trên).
- Tiêu chí ④ đạt hết: 4/4 — danh sách 25 mục đã duyệt (dù cần sửa theo thực trạng ở trên),
  schema Lập trình đã mở rộng và có nội dung thật dùng thử.
- Có phá bất biến ⑤ nào không: không — mọi Zod parse qua, màu chỉ dùng enum, description ≥ 20 ký tự.
- Có mở rộng ngoài phạm vi ① không: có MỘT việc ngoài phạm vi ban đầu nhưng cần thiết — sửa
  lỗi hình học của animation `toan11-c9-b1` đã có sẵn (phát hiện giữa chừng, không phải "thêm
  animation mới" như đặc tả GĐ0 dự định) — giữ lại vì đây đúng tinh thần "chất lượng cao nhất".
- Còn để ngỏ: cấu trúc animation cho môn Anh; nơi render animation trong UI môn Lập trình;
  kiểm chứng bằng mắt (Tầng 8b — ảnh chụp 1440px + 390px) cho cả 5 animation mới, vì Vật
  lý/Hoá/Sinh chưa nối vào `apps/` nên chưa render được, còn Lập trình chưa có UI hiển thị.
