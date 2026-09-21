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

| Việc | Đường dẫn file | Ghi chú |
| ---- | -------------- | ------- |
| Đọc (đã xong) | `packages/core-contracts/lessonAnimation.ts` | Schema dùng chung, KHÔNG sửa ở GĐ0 |
| Đọc (đã xong) | `packages/core-ui/LessonAnimation.tsx` | Renderer, lo `prefers-reduced-motion` + a11y |
| Đọc (đã xong) | `packages/subject-{physics,chemistry,biology,math}/lessonTypes.ts` | Nơi gắn `animation` hiện tại |
| Thêm (GĐ1) | `packages/subject-programming/specializations/stageDetailTypes.ts` | Thêm `animation?: LessonAnimation` vào kiểu module |
| Sửa nội dung (GĐ1, thí điểm) | `packages/subject-{physics,chemistry,biology,math}/lessons/*.ts` (chọn mẫu) + `specializations/details/algo-s1.ts` (chọn 1 module) | Soạn `animation` thật cho bài mẫu |

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

| Tình huống | Mã lỗi | Hành vi mong đợi |
| ---------- | ------ | ---------------- |
| `animation` không qua Zod parse (vd id trùng, keyframe vượt `durationMs`) | build-time (test) | Test dữ liệu bài học đỏ ngay, không lọt vào build |
| Thiếu `description` hoặc quá ngắn (<20 ký tự) | build-time (test) | Đỏ — hoạt ảnh không có mô tả là thiếu a11y |

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

| Bất biến | Test nào canh nó |
| -------- | ------------------ |
| Màu hoạt ảnh chỉ lấy từ `AnimationColorRoleSchema` (token `--a-*`), không hex tự do | schema Zod tại nguồn (`.strict()`) |
| Hoạt ảnh luôn có `description` cho người tắt animation/dùng trình đọc màn hình | `LessonAnimationSchema` bắt buộc `description` (min 20 ký tự) |
| `id` các hình trong một hoạt ảnh không trùng nhau | `.refine()` trong `LessonAnimationSchema` |
| `advancedTier` chỉ có mặt khi `track === 'advanced'` (không liên quan animation nhưng cùng schema bài học, tránh phá khi sửa `lessonTypes.ts`) | `.refine()` trong từng `lessonTypes.ts` môn STEM |

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

**Hoá học** (`packages/subject-chemistry/lessons/`):
6. Phản ứng trao đổi ion / kết tủa — `hoa11*`
7. Liên kết ba N≡N và cơ chế phản ứng — `hoa11c2.ts`
8. Cân bằng hoá học dịch chuyển (Le Chatelier) — `hoa10c7.ts`
9. Điện phân / pin điện hoá (dòng electron) — `hoa-hsg-dien-hoa.ts`
10. Cấu hình electron nguyên tử, orbital — `hoa10c1.ts`

**Sinh học** (`packages/subject-biology/lessons/`, nhiều animation mẫu nhất):
11. Nguyên phân/giảm phân (phân chia NST) — `sinh10*`/`sinh12c1.ts`
12. Phiên mã – dịch mã (DNA→mRNA→protein) — `sinh12c1.ts`
13. Vận chuyển qua màng (thẩm thấu, khuếch tán) — `sinh10*`
14. Chu trình Krebs/hô hấp tế bào — `sinh10*`
15. Dòng năng lượng trong hệ sinh thái — `sinh12c2.ts`/`sinh12c3.ts`

**Toán** (`packages/subject-math/lessons/`):
16. Hoán vị/chỉnh hợp/tổ hợp (cây lựa chọn) — `toan10c8.ts`
17. Đạo hàm = độ dốc tiếp tuyến (cát tuyến → tiếp tuyến) — `toan11*`
18. Vector mặt phẳng/không gian (cộng, tích vô hướng) — `toan10*`/`toan12*`
19. Hàm lượng giác trên đường tròn lượng giác — `toan10*`/`toan11*`

**Lập trình** (`packages/subject-programming/specializations/details/`, cần mở rộng schema trước):
20. Thuật toán sắp xếp (so sánh/hoán đổi từng bước) — `algo-s1.ts`/`algo-s2.ts`
21. Cấu trúc dữ liệu: mảng động nhân đôi, bảng băm va chạm — `algo-s1.ts` (module `algo-s1-m2`)
22. Cây/đồ thị: lan truyền BFS/DFS — `algo-s2.ts`/`algo-s3.ts`
23. Kiến trúc hệ thống: request/response, load balancing — `architecture-s*.ts`
24. Pipeline dữ liệu ETL — `data-s2.ts`

**Tiếng Anh** — khoảng mở, cần thiết kế cấu trúc riêng (xem mục ① KHÔNG LÀM):
25. Trục thời gian các thì tiếng Anh (timeline quá khứ/hiện tại/tương lai) — chưa có
    file nguồn phù hợp, để lại cho buổi `/grill` riêng.

---

## Nghiệm thu (điền sau khi người dùng duyệt danh sách + trước khi mở GĐ1)

- Lệnh đã chạy + kết quả thật: `grep` xác nhận không có animation lib (mục ④).
- Tiêu chí ④ đạt hết chưa: 2/4 (còn chờ người dùng duyệt danh sách 25 mục + làm mở rộng schema Lập trình ở GĐ1).
- Có phá bất biến ⑤ nào không: không — GĐ0 chỉ đọc, chưa sửa file thật.
- Có mở rộng ngoài phạm vi ① không: không.
- Còn để ngỏ: cấu trúc animation cho môn Anh; nơi render animation trong UI môn Lập trình (chưa xác định — cần đọc `apps/dhcb/src/pages` phần Lập trình ở GĐ1).
