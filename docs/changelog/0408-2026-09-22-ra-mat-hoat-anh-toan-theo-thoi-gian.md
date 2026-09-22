# 0408 — 2026-09-22 — Rà bằng mắt theo thời gian 34/34 hoạt ảnh môn Toán, sửa 15

> PR: (điền khi merge) · Đặc tả: `docs/specs/2026-09-21-hoat-anh-mo-phong-bai-hoc.md`
> (mục "Kết quả rà mắt Toán") · Bẫy: `TRAPS.md` mục 10 (bẫy thứ ba)

## Việc đã làm

Trả nợ ghi ở `0407`: 159 hoạt ảnh STEM chỉ mới chạy lần đầu sau khi sửa renderer, Toán là môn
duy nhất đã nối `apps/` nhưng mới soi 1 bài. Lượt này soi **34/34 hoạt ảnh Toán × 5 mốc thời
gian** (2/25/50/75/98 % `durationMs`) = 170 khung hình, đọc từng dải ghép.

**Công cụ mới `npm run shots:lesson-anim`** (`scripts/shots-lesson-animations.ts`): render
`LessonAnimation` ra HTML tĩnh kèm token theme (không cần DB/đăng nhập), Chromium đặt
`currentTime` mọi animation về từng mốc, chụp SVG, ghép 5 khung thành `montage/<id>.png`; thoát
mã 1 nếu hoạt ảnh nào có 0 animation chạy (cổng cho bẫy `TRAPS.md` 10). Ảnh ghi ngoài repo.
Bẫy riêng của cách này: `renderToStaticMarkup` escape dấu nháy trong `<style>` → CSS không khớp
selector, 0 animation chạy dù client thật chạy — script giải escape khối `<style>` trước khi ghi.

**Kết quả: 19/34 đạt ngay; 15 sửa (dữ liệu bài học, KHÔNG đụng renderer):**

| Mức             | Bài            | Lỗi thấy trên ảnh                                                     | Sửa                                                                                              |
| --------------- | -------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 🔴 Sai nội dung | `toan11-c1-b1` | Bán kính `rotate` quay quanh TRUNG ĐIỂM của chính nó → thanh lơ lửng  | 17 mốc `rotate` + `dx/dy` trung điểm chạy trên đường tròn r/2; thêm điểm trên tròn + điểm vẽ sin |
| 🔴 Sai nội dung | `toan10-c7-b2` | Nhãn giữ "d > R: không cắt nhau" suốt 7,5 s dù đã tiếp xúc rồi cắt    | 3 nhãn riêng bật/tắt bằng opacity theo mốc 2500/4500                                             |
| 🔴 Sai nội dung | `toan11-c4-b2` | Đoạn MN trượt, nhãn M/N đứng yên                                      | M/N mang keyframes tịnh tiến theo đầu mút                                                        |
| 🔴 Chữ bị cắt   | `toan12-c1-b2` | Dòng kết luận dài hơn viewBox 300, hai nhãn "x = 4/6 →" tràn mép phải | Rút ngắn chữ, đổi neo, hạ nhãn hàm lên mép trên                                                  |
| 🟡 Đè/cắt       | `toan11-c5-b2` | "f(x) = (x²−1)/(x−1)" tràn mép + đè "x → 1⁺"                          | Dời xuống góc phải dưới, neo `end`                                                               |
| 🟡 Đè/cắt       | `toan10-c3-b1` | "a ≈ 9,43" bị đường BC′ gạch ngang; "b = 8" chạm đường đứt AC′        | Đưa "a ≈ 9,43" lên sát C′; dịch "b = 8"                                                          |
| 🟡 Đè/cắt       | `toan10-c6-b2` | "đỉnh (2; −1)" đè "x = 3"; "f(x) > 0" trái bị trục Oy và parabol gạch | Dời hai nhãn                                                                                     |
| 🟡 Đè/cắt       | `toan10-c4-b2` | Đường giá nét đứt gạch ngang chữ "u (8)"                              | Hạ nhãn xuống dưới giá                                                                           |
| 🟡 Phối cảnh    | `toan11-c7-b1` | c quay 180° phẳng → ở 75 % trông bật ra khỏi (P) vẽ phối cảnh         | Chỉ quét dải góc 38° → −30° → 8° (trông nằm trong (P))                                           |
| 🟡 Lệch         | `toan11-c2-b1` | Chấm giao điểm lệch khỏi chỗ hai đường cắt                            | Tính lại giao hai đoạn: (252; 108)                                                               |
| 🟡 Che          | `toan10-c8-b2` | Hai đầu mũi tên che số 10                                             | Dừng mũi tên sớm 8 px                                                                            |
| 🟡 Đè           | `toan12-c2-b2` | "A(3;0;0)" đè đầu mũi tên Ox và chữ x; "O" bị vectơ OM gạch           | Dời ba nhãn                                                                                      |
| 🟢 Chữ          | `toan12-c3-b1` | "Δ_Q" in dấu gạch dưới thô                                            | "ΔQ" (nhãn + caption)                                                                            |
| 🟢 Gạch         | `toan11-c6-b1` | "(1; 2)" bị trục Oy gạch                                              | Sang trái trục                                                                                   |

Soi lại đủ 15 dải sau sửa: đúng hết. Còn ngỏ mức nhẹ (ghi ở đặc tả): `toan12-c4-b2` lớp hình
chữ nhật thô vẫn hiện dưới lớp mịn; `toan12-c5-b2` nhãn "(P): Ax + By…" bị đường tròn cắt qua.

## Quyết định

- **Sửa dữ liệu, không đụng renderer** — kể cả lỗi `rotate` quanh tâm: đúng ① đặc tả (renderer chỉ
  đổi khi thiếu khả năng biểu đạt); quay quanh đầu mút mô phỏng được bằng khuôn `rotate + dx/dy`,
  ghi thành khuôn dữ liệu ở đặc tả để lần soạn sau không mắc lại.
- Màu nhãn môn Toán chỉ nhận `primary|accent|neutral|muted|surface` (`lessons.test.ts` canh) —
  nhãn "tiếp xúc" dùng `primary`, không dùng `correct`.
- Script chụp ĐƯA VÀO REPO (không để harness tạm) vì luật ⑥ bắt buộc mọi đợt hoạt ảnh sau phải
  chụp theo thời gian; hiện chỉ nối `math`, môn khác mở rộng `napHoatAnh`.

## Bằng chứng kiểm chứng

- `npm run shots:lesson-anim`: 34/34 hoạt ảnh có animation chạy (3–24 mỗi bài), 170 khung + 34
  dải ghép đã đọc bằng mắt trước và sau sửa.
- `npm run typecheck` xanh · `npx eslint` các file đổi 0 cảnh báo · Prettier xanh.
- `npx vitest run` toàn repo: **TESTLINE**
