# 0361 — P1-8: `SubjectSpaceList` — môn đang học lên đầu, trạng thái bằng chữ

- **Ngày:** 2026-09-17
- **PR:** (điền khi tạo)
- **Đặc tả:** `docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md` §P1-8 (lệnh 6, "Approved for
  implementation").

## Việc đã làm

- Tách khối "Bộ môn" của `Home.tsx` (từng khai tay `SUBJECT_ICON`/`SUBJECT_TONE`/`SUBJECT_DESC`/
  `SUBJECT_SHORTCUTS`/`subjectSpaces` tại chỗ) thành component riêng
  `apps/dhcb/src/components/Home/SubjectSpaceList.tsx`.
- Thêm hàm thuần `apps/dhcb/src/lib/home/orderSubjects.ts`: sắp môn có bằng chứng trong
  `TodayPlan.subjectsSeen` lên đầu, giữ nguyên thứ tự registry `SUBJECT_ENTRIES` trong từng nhóm
  (đang học / chưa học). `seen=[]` giữ nguyên thứ tự registry — KHÔNG mặc định đưa Tiếng Anh lên
  đầu.
- Mỗi thẻ môn thêm dòng trạng thái bằng CHỮ: "đang học · `<tên chặng>`" (lấy `title` của mục
  `TodayPlan` khớp `subjectId`) hoặc "chưa bắt đầu" — không thanh %, không số.
- Mobile: 3 thẻ đầu + nút "Xem tất cả (N môn)" mở nốt phần còn lại tại chỗ (state cục bộ, không
  lưu storage). Desktop: lưới 2 cột hiện đủ ngay.
- Empty state (`todayPlan.primary.kind === 'pick'`): mỗi thẻ có thêm nút "Thử 5 phút" trỏ
  `entry.ctaPath`.
- `Home.tsx` giữ nguyên thẻ "Sự nghiệp, Khởi nghiệp & Đời sống" (không phải môn học, không tham
  gia sắp xếp `orderSubjects`).

## Quyết định

- Không đụng `SUBJECT_ENTRIES` hay `ctaPath` (đúng phạm vi "KHÔNG LÀM" của đặc tả).
- `e2e/subjects-catalog-states.spec.ts` (nằm trong "Điểm chạm" của đặc tả) không cần sửa: file
  đó canh trang `/goc-hoc-tap` (SubjectsCatalog), không liên quan tới `Home.tsx`/
  `SubjectSpaceList` — đã đọc lại toàn bộ file để xác nhận trước khi bỏ qua.
- `Home.design.test.ts` cập nhật để đọc thẳng `SubjectSpaceList.tsx` (thay vì `Home.tsx`) khi
  canh "không viết tay từng thẻ môn dùng SUBJECT_ENTRIES".
- `Home.test.tsx` (mock mobile) cập nhật: bấm "Xem tất cả" trước khi đếm thẻ, vì mặc định mobile
  giờ chỉ hiện 3 thẻ.

## Bằng chứng

- `npx vitest run apps/dhcb/src/lib/home/orderSubjects.test.ts apps/dhcb/src/components/Home/SubjectSpaceList.test.tsx apps/dhcb/src/pages/core/Home.test.tsx apps/dhcb/src/pages/core/Home.design.test.ts`
  → 4 file, 30 test, xanh.
- `npm run typecheck` / `npm run lint` (0 cảnh báo) / `npm run format -- --check` / `npm run build`
  → xanh.
- `npm test` (toàn bộ) → 686 file test xanh (1 skip không liên quan), 14625 test xanh (2 skip).
- Ảnh chụp trước/sau: chưa đính kèm trong đợt này (môi trường phiên không chạy được
  `npm run shots:learning-ux`/Playwright ổn định trong thời gian cho phép) — đã bù bằng test
  DOM cụ thể cho AC-2/AC-3/AC-4 (`SubjectSpaceList.test.tsx`) thay cho bằng chứng hình ảnh.
