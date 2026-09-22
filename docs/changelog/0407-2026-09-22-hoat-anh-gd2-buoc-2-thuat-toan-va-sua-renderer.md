# 0407 — 2026-09-22 — Hoạt ảnh GĐ2 (bước 2): 10 hoạt ảnh thuật toán mới + sửa renderer chưa từng chạy

> PR: (điền khi merge) · Đặc tả: `docs/specs/2026-09-21-hoat-anh-mo-phong-bai-hoc.md`
> (mục "Kết quả GĐ2 — bước 2") · Bẫy: `TRAPS.md` mục 10

## Việc đã làm

Chủ dự án chọn hướng 1 của GĐ2: nhân rộng hoạt ảnh cho các module thuật toán. Ba subagent Sonnet
soạn song song, mỗi người một file (`algo-s1` · `algo-s2` · `algo-s3`) để không tranh chấp.

**10 hoạt ảnh mới** (`packages/subject-programming/specializations/details/algo-s{1,2,3}.ts`):

| Module       | Cơ chế minh hoạ                                                 | Điểm cần thấy                           |
| ------------ | --------------------------------------------------------------- | --------------------------------------- |
| `algo-s1-m2` | Mảng động nhân đôi dung lượng 2 → 4 → 8, chép phần tử sang      | Chép tốn kém nhưng hiếm → O(1) khấu hao |
| `algo-s1-m3` | Tìm kiếm nhị phân 9 số, tìm 23, `lo`/`mid`/`hi` co lại          | Mỗi bước bỏ nửa → log n                 |
| `algo-s2-m1` | Cây đệ quy quay lui, một nhánh bị cắt tỉa, nhánh phải ra nghiệm | Cắt tỉa sớm bỏ cả cây con               |
| `algo-s2-m2` | Heap min thêm 1 rồi nổi lên 2 bậc tới gốc                       | Chỉ đi một đường lên gốc → O(log n)     |
| `algo-s2-m3` | BFS 8 đỉnh lan theo lớp 0/1/2/3                                 | Thăm theo khoảng cách tăng dần          |
| `algo-s2-m4` | Xếp lịch 7 khoảng A–G, chọn kết thúc sớm nhất (A, D, G)         | Chừa nhiều chỗ nhất cho phần sau        |
| `algo-s3-m1` | Bảng dp LIS trên 3 1 4 1 5 9 → dp = 1 1 2 1 3 4                 | Ô sau phụ thuộc ô trước → thứ tự tính   |
| `algo-s3-m2` | KMP mẫu ABAB trên ABABCABABA, bảng thất bại 0 0 1 2             | Con trỏ văn bản chỉ tiến → O(n+m)       |
| `algo-s3-m3` | Sàng Eratosthenes 2..21, sàng 2 và 3                            | Chỉ cần sàng tới √n                     |
| `algo-s3-m4` | Cây phân đoạn tổng, truy vấn [2..5] chạm 2 nút (5 + 14 = 19)    | Mỗi truy vấn O(log n) nút               |

Bỏ qua có chủ đích: `algo-s1-m4` (kỷ luật giải bài — hình động không giúp hiểu thêm, đúng ①
đặc tả) và cả chặng `algo-s4` (thuật toán trong sản xuất, cùng lý do).

**Sửa renderer `packages/core-ui/LessonAnimation.tsx` — HAI lỗi có sẵn từ đợt 4 môn STEM:**

1. `animation-name` gắn lên hình con, còn duration/iteration/play-state/fill-mode gắn lên `<g>`
   cha qua CSS. CSS animation không kế thừa → thẻ cha có duration 9s nhưng không tên, thẻ con có
   tên nhưng duration 0s → **không hoạt ảnh nào từng chạy ở cả 5 môn**. Đo bằng
   `getAnimations()` trên trang thật: 0 animation đang chạy trước sửa; sau sửa 16/16, 23/23,
   22/22 (Lập trình), 3 (Toán `toan11-c9-b1`), 5 (Sinh `sinh12-c1-b3`).
2. Opacity TĨNH của hình (thẻ con) NHÂN với opacity ĐỘNG của keyframes (thẻ `<g>`). Rà máy:
   **159/238 hoạt ảnh** toàn dự án (chủ yếu Sinh học) viết `opacity: 0` tĩnh + keyframes nâng
   lên 1 với ý "keyframe quyết định lúc hiện" → vô hình vĩnh viễn. Sửa ở renderer: hình có
   keyframe điều khiển opacity thì keyframe là nguồn sự thật, bỏ opacity tĩnh; hình chỉ animate
   vị trí vẫn giữ opacity tĩnh. Không sửa 159 bộ dữ liệu.

Hai test canh mới trong `packages/core-ui/LessonAnimation.test.tsx` (đã kiểm không xanh giả).

**Sửa theo ảnh chụp theo thời gian** (sau khi hoạt ảnh chạy thật, 4/10 lộ lỗi):

- `algo-s1-m2`: 20 hình dùng opacity tĩnh × động — subagent gỡ opacity tĩnh (vô hại sau sửa renderer).
- `algo-s2-m4`: các mốc quyết định chỉ cách nhau 1000ms với vùng chuyển 300ms → giãn
  `durationMs` 9000 → 13000, mốc cách nhau ≥ 600ms; trạng thái cuối giữ tới `durationMs`.
- `algo-s3-m1`/`m4`: cùng nguyên nhân opacity tĩnh × động; sau sửa renderer chạy đúng.
- `algo-s2-m2`: vòng viền "gốc đúng" có `fill: 'surface'` đục vẽ SAU nút 1 → che mất số 1 khi lên
  gốc; bỏ fill.
- `algo-s3-m4`: dòng kết quả đè hàng lá → hạ y 205 → 236, viewBox cao 210 → 245.

## Quyết định

- **Sửa renderer thay vì sửa dữ liệu** cho lỗi opacity: 159 bộ dữ liệu cùng một ý đồ rõ ràng;
  đổi hợp đồng ngầm ở một chỗ rẻ hơn và không phá cách soạn hiện có. Đặc tả ① từng ghi "không đổi
  renderer trừ khi thiếu khả năng biểu đạt" — đây là sửa LỖI, không phải thêm khả năng.
- **Luật kiểm chứng mới cho hoạt ảnh (ghi vào đặc tả ⑥ và TRAPS.md 10):** ảnh chụp cảnh đầu
  KHÔNG đủ; phải chụp ≥ 3 mốc thời gian và so ảnh khác nhau thật. Kỹ thuật đáng tin:
  `el.getAnimations().forEach(a => { a.pause(); a.currentTime = t })` — đổi `animation-delay` âm
  trên animation đã paused cho kết quả sai giả ở mốc gần cuối trên Chromium.
- Ba subagent đầu tiên đều tự kiểm bằng schema + typecheck và báo "xanh" — đúng, nhưng không
  phát hiện được lỗi vì hoạt ảnh không chạy. Vòng hai (sau khi có ảnh theo thời gian) mỗi
  subagent nhận đúng bằng chứng ảnh + bắt buộc ĐỌC ảnh mình chụp trước khi báo xong.

## Việc còn để ngỏ / nợ mới

- 159 hoạt ảnh STEM nay mới chạy lần đầu trước mắt người dùng → **cần một lượt rà bằng mắt theo
  thời gian cho Toán (môn duy nhất đã nối `apps/`)**, cùng kỹ thuật ở trên. Đã kiểm 1 bài
  (`toan11-c9-b1`: cát tuyến hội tụ đúng), chưa rà hết.
- Môn Anh và 3 môn STEM nháp: chưa đổi so với `0406`.
- `ProgrammingSpecStagePage` vẫn chưa trong danh sách quét a11y E2E.

## Bằng chứng kiểm chứng

- `npm run typecheck` xanh · `npm run lint` xanh (0 cảnh báo) · Prettier xanh mọi file đổi.
- `npx vitest run` toàn repo: 709 file / 16.646 test xanh (1 file + 2 test skipped có sẵn).
- Tầng 8b: 3 trang chặng × 2 theme × 1440/390px (bố cục, cảnh đầu) + **55 khung hình theo thời
  gian** (11 hoạt ảnh × 5 mốc 2/25/50/75/98%) đọc từng ảnh: mọi hoạt ảnh tiến triển đúng logic
  và giữ trạng thái cuối. Ảnh Toán/Sinh xác nhận sửa renderer không phá STEM.
