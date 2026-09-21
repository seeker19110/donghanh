# 0405 — 2026-09-21 — Hoạt ảnh mô phỏng bài học: GĐ0 kiểm kê + GĐ1 thí điểm 5 bài

> PR: #1099 (merged) · Đặc tả: `docs/specs/2026-09-21-hoat-anh-mo-phong-bai-hoc.md`

## Việc đã làm

Khởi động kế hoạch "hoạt ảnh mô phỏng cho từng bài học" (theo yêu cầu người dùng): GĐ0 kiểm
kê hạ tầng animation hiện có + chốt danh sách 25 khái niệm ưu tiên, GĐ1 giao 5 subagent thí
điểm soạn nội dung thật.

- **Xác nhận hạ tầng đã đủ dùng, không thêm thư viện:** `LessonAnimationSchema`
  (`packages/core-contracts/lessonAnimation.ts`, SVG khai báo, chống XSS) đã dùng ở 4 môn STEM
  từ PR trước (`docs/specs/2026-09-13-hoan-thien-4-mon-stem.md`).
- **Mở rộng cùng cơ chế sang môn Lập trình:** thêm `animation?: LessonAnimation` vào
  `SpecModuleDetail` (`packages/subject-programming/specializations/stageDetailTypes.ts`) +
  project reference `core-contracts` trong `tsconfig.json` của gói.
- **5 việc GĐ1 hoàn thành** (chi tiết trong đặc tả mục "Kết quả GĐ1"):
  1. Sửa lỗi hình học animation Toán có sẵn (`toan11-c9-b1` — cát tuyến giờ hội tụ đúng về tiếp tuyến).
  2. Animation mới — sắp xếp nổi bọt (`algo-s1-m1`, Lập trình).
  3. Animation mới — pin Galvani Zn–Cu (`hoa12-c90-b1`, Hoá, bài HSG).
  4. Animation mới — thanh dẫn trượt trên ray/định luật Lenz (`ly12-c93-b3`, Vật lý, bài HSG).
  5. Animation mới — vòng năng lượng ATP (`sinh11-c1-b1`, Sinh).
- Sửa 1 test đếm cứng bị ảnh hưởng bởi animation HSG mới
  (`apps/dhcb/src/lib/outline/stemOutlineApp.test.ts`).

## Quyết định

- **Danh sách 25 khái niệm ở GĐ0 SAI một phần** — lập trước khi đối chiếu mã nguồn thật; 4/5
  bài thí điểm ban đầu hoá ra đã có animation từ trước (Hoá 21/26 file, Sinh dày đặc nhất,
  Toán có nhưng sai hình học). Đã điều hướng lại 3 subagent (Hoá/Sinh/Vật lý) sang bài thật sự
  còn trống sau khi tự kiểm kê. Đặc tả đã cập nhật lại danh sách + ghi rõ bài học vận hành cho GĐ2.
- 3/4 animation mới nằm ở bài `track: 'advanced'` (HSG) hoặc môn còn `reviewStatus: 'draft'`
  chưa nối `apps/` (Vật lý/Hoá/Sinh) — **chưa lộ ra người dùng thật**, vẫn cần duyệt nội dung
  chuyên môn trước khi nối.
- `npm run gen:stem-lesson-index` là **bắt buộc** sau mọi lần thêm animation STEM (test
  `lessonsLazy.test.ts` canh) — và là điểm tranh chấp chung khi nhiều subagent chạy song song
  (sinh lại cả 4 môn cùng lúc, output không theo Prettier). Đã xử lý bằng cách chạy lại một
  lần cuối sau khi gộp + `prettier --write`.

## Việc còn để ngỏ / nợ mới

- **GĐ2 (nhân rộng ra nhiều bài hơn) chưa làm** — chờ quyết định tiếp theo của người dùng.
- Cấu trúc animation cho môn Anh chưa thiết kế (không có "bài học theo chương" như STEM).
- Nơi hiển thị animation Lập trình trong UI chưa xác định (dữ liệu đã có ở `algo-s1-m1` nhưng
  chưa có component render).
- Chưa kiểm chứng bằng mắt (Tầng 8b — ảnh chụp 1440px + 390px) cho cả 5 animation mới: Vật
  lý/Hoá/Sinh chưa nối vào `apps/` nên chưa render được, Lập trình chưa có UI hiển thị.

## Bằng chứng kiểm chứng

`npm run typecheck` xanh · `npm run lint` xanh (0 cảnh báo) · `npx vitest run` toàn repo:
705 test file / 16.299 test xanh · mọi `animation` mới qua `LessonAnimationSchema.parse` (Zod
strict, id không trùng, keyframe không vượt `durationMs`, màu chỉ dùng enum vai trò) · CI PR
#1099 xanh cả 3 required check (`metadata`/`quality`/`e2e`), merge squash sạch không xung đột.
