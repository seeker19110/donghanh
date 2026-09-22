# 0406 — 2026-09-22 — Hoạt ảnh mô phỏng GĐ2 (bước 1): nối UI hiển thị animation môn Lập trình

> PR: (điền khi merge) · Đặc tả: `docs/specs/2026-09-21-hoat-anh-mo-phong-bai-hoc.md`
> (mục "Kết quả GĐ2 — bước 1")

## Việc đã làm

Trả một trong ba khoảng mở của GĐ1 (`docs/changelog/0405-*.md`): dữ liệu `animation` của module
`algo-s1-m1` (sắp xếp nổi bọt) đã có từ PR #1099 nhưng **chưa có chỗ nào trong UI vẽ nó**. Đợt này
nối renderer dùng chung vào trang chặng hướng chuyên sâu và thêm hai cổng test canh.

- **UI:** `apps/dhcb/src/pages/subjects/programming/ProgrammingSpecStagePage.tsx` — `ModuleBlock`
  vẽ `<LessonAnimation>` (renderer `packages/core-ui/LessonAnimation.tsx`, dùng chung 4 môn STEM)
  ngay sau mục "Kiến thức" và **trước** "Tự tay làm": thấy cơ chế chạy rồi mới tự tay viết. Module
  không có `animation` thì không hiện khung nào (không có khung "Hoạt ảnh minh hoạ" rỗng).
- **Cổng dữ liệu (Zod):** `packages/subject-programming/specStageDetails.test.ts` — mọi
  `module.animation` phải qua `LessonAnimationSchema.safeParse` (strict). Bốn môn STEM canh việc này
  qua `lessonSchema` của gói; môn Lập trình gắn `animation` vào interface TypeScript thuần nên GĐ1
  **chưa có** cổng chạy-thật này dù đặc tả ③ ghi "test Zod canh" — nay đã có.
- **Cổng trang:** `ProgrammingSpecStagePage.test.tsx` (mới) — render tĩnh chặng `algo-s1`: số
  nhãn "Hoạt ảnh minh hoạ" và số SVG `role="img"` khớp đúng số module có animation, mô tả bằng lời
  và `aria-label` lộ ra HTML; chặng không có animation (tìm động trong hướng `web`) không có SVG nào.
- **Sửa nội dung theo ảnh chụp (Tầng 8b):** `specializations/details/algo-s1.ts` — mô tả viết
  "Khung viền **cam**" nhưng khung dùng vai trò màu `accent` (đổi theo theme: xanh da trời ở
  blue-sky, xanh lơ ở dark-blue). Đổi thành "khung viền màu nhấn (sáng hơn viền các ô)" — mô tả
  bằng lời KHÔNG được gọi tên màu cụ thể vì màu là token theme.
- **Sửa bố cục theo ảnh chụp:** viewBox hoạt ảnh nhỏ (440×180) mà renderer để `w-full` → ở cột
  4xl trên 1440px sáu ô số phình gần gấp ba, chữ mô tả bên dưới trông lép. Thêm
  `[&_svg]:max-w-2xl [&_svg]:mx-auto` ở className truyền vào figure (không sửa renderer chung).

## Quyết định

- **Nơi hiển thị animation Lập trình = trang chặng hướng chuyên sâu**, trong từng `ModuleBlock`
  (chứ không phải trang bài học P1–P6 `ProgrammingLessonPage`): vì `animation` gắn ở
  `SpecModuleDetail`, đúng tầng "module này dạy cơ chế gì".
- **Không sửa renderer `LessonAnimation.tsx`** (đúng ① đặc tả): giới hạn bề rộng SVG làm ở tầng
  gọi bằng arbitrary variant Tailwind 3.4, để trang STEM (`StemLessonView`) không đổi hình.
- Chưa nhân rộng nội dung animation ở đợt này — mỗi PR một việc kiểm chứng được. Bước tiếp của
  GĐ2 (soạn thêm animation cho các module thuật toán `algo-s1`…`algo-s3`, hoặc thiết kế cho môn
  Anh) chờ chủ dự án chọn.

## Việc còn để ngỏ / nợ mới

- Cấu trúc animation cho môn Anh vẫn chưa thiết kế (cần `/grill` riêng).
- Vật lý/Hoá/Sinh còn `reviewStatus: 'draft'` chưa nối `apps/` → 3 animation GĐ1 ở đó vẫn chưa
  kiểm chứng bằng mắt.
- Trang `ProgrammingSpecStagePage` không nằm trong 15 trang của `e2e/a11y*.spec.ts`; renderer đã
  qua a11y ở trang STEM, nhưng nếu GĐ2 nhân rộng nhiều thì nên cân nhắc thêm route này vào danh
  sách quét.

## Bằng chứng kiểm chứng

- `npm run typecheck` xanh · `npm run lint` xanh (0 cảnh báo) · `prettier --check` 4 file đổi xanh.
- `npx vitest run` toàn repo (sau khi gộp đủ thay đổi): 709 file / 16.644 test xanh, 1 file + 2 test skipped có sẵn.
- Tầng 8b: chụp trang `/goc-hoc-tap/programming/huong/algo/algo-s1` (tự chuyển về URL chuẩn
  `algo--thuat-toan-giai-quyet-van-de/algo-s1--nen-tang-va-do-phuc-tap`) ở **1440px + 390px ×
  2 theme blue-sky/dark-blue**, hoạt ảnh tạm dừng để ảnh ổn định. Ảnh lần 1 phát hiện 2 lỗi trên
  (màu "cam" sai · SVG quá to ở desktop); ảnh lần 2 sau sửa: khung nằm giữa, rộng tối đa 2xl, mô
  tả + 10 chú thích + nút "Chạy hoạt ảnh" đủ tương phản ở cả hai theme, 390px không tràn ngang.
