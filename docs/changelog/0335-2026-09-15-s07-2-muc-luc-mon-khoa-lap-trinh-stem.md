# 0335 — 2026-09-15 — S07-2: mục lục môn/khoá trong vùng học Lập trình và STEM

**PR:** #TBD · **Nhánh:** `claude/laughing-babbage-o25bls-s07-2-ui` · **Đặc tả:**
[`docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md`](../specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md)
(Approved for implementation) · **Slice trước:** S07-1 (changelog 0330, PR #933)

## Việc đã làm

S07-1 đã dựng **hợp đồng cây** (`OutlineNode`/`Outline`) và ba adapter thuần nhưng chưa đổi một
điểm ảnh nào trên giao diện. Đợt này đưa cây đó vào **năm trang học thật**.

1. **`packages/core-ui/OutlineTree.tsx` (mới)** — vẽ một `Outline` thành `<nav>` + `<ul>` lồng
   nhau theo khuôn **disclosure** (`<button aria-expanded aria-controls>` cho chương, liên kết
   route thật cho lá). KHÔNG dùng `role="tree"` của APG vì cây APG cấm đặt `<a>` trong
   `treeitem`, mà lá ở đây phải là liên kết thật (mở tab mới, chuột giữa, máy tìm kiếm hiểu).
   Gói `core-ui` không phụ thuộc `react-router` nên liên kết do nơi gọi dựng qua `renderLink`.
   Năm trạng thái (đã xong · đang học dở · chưa học · khoá · **chưa đo được**) đều có dấu hình
   riêng + nhãn CHỮ, không phân biệt bằng màu. Ô tìm lọc theo `normalizeVi` (gõ "roi tu do" ra
   "Sự rơi tự do") kèm đường dẫn chương; không khớp thì báo bằng `role="status"`.
2. **`Modal`** — thêm `variant: 'center' | 'sheet'` (tấm neo đáy, `max-h-[85dvh]`,
   `env(safe-area-inset-bottom)`) và `createPortal` ra `<body>` cho **cả hai** dáng. Portal là
   điều kiện để panel mở từ trong cột phụ (`overflow-y:auto`) không bị cắt. `center` giữ
   nguyên CSS — 20 nơi đang dùng không đổi hành vi; `Modal.test.tsx` (mới) canh điều đó.
3. **`useOutlinePane` + `OutlineTreeLinked` + `OutlinePrevNext`** — cột trái ở desktop, nút
   ≥44px + panel ở mobile, nhớ chương nào đang mở trong `sessionStorage`
   `ui_outline_open_<mã môn|khoá>` (khoá riêng cho từng cây, không kế thừa).
4. **Năm trang**: `ProgrammingLessonPage` · `ProgrammingLevelPage` · `ProgrammingCoursePage` ·
   `StemLessonView` · `StemLessonList` (thân danh sách nay là chính `OutlineTree`, theo Q4).
   Prev/next ở hai trang bài, tính từ cây và **bỏ qua bài đang khoá**.
5. **`lessonOutlineContext.ts` (mới)** — MỘT hàm thuần quyết định cả bốn thứ phải khớp nhau khi
   có `?khoa=`: cây nào, breadcrumb nào, nút quay lại đi đâu, prev/next theo cây nào. Trước đó
   bốn thứ này nằm rải trong JSX — đúng kiểu để một hôm breadcrumb nói "khoá Git" còn nút quay
   lại đưa về P3.
6. **`fetchProgressWithState`** — bản `fetchProgress` có NÓI RÕ lần đọc có tới được server
   không. Mục lục phải phân biệt "chưa học" với "chưa đo được": vẽ một dãy ○ "chưa học" trong
   khi thật ra vừa mất mạng là nói dối người học.

## Quyết định

- **Ngưỡng 1440px cho cột mục lục ở TRANG BÀI Lập trình** (ngoại lệ có chủ đích so với AC-10,
  vốn ghi 1024px). Trang này đã có một cột phụ (thanh bước bài học); thêm cột nữa là ba cột
  cạnh sidebar và ở 1280px cột giữa tụt xuống ~380px — **đo được bằng cổng a11y**: ô soạn code
  CodeMirror sinh thanh cuộn ngang và rớt `scrollable-region-focusable` ở cả 5 theme. Dưới
  1440px mục lục vẫn tới được đầy đủ qua nút + panel, không mất tính năng. Bốn trang còn lại
  giữ đúng 1024px như đặc tả.
- **Đổi assert theo đồng hồ tường ở `cefrOutline.test.ts`** (`performance.now() - t0 < 16`,
  do S07-1 đưa vào) sang phép đo **số lượt tra cứu**, vì assert cũ đã flake thật
  (`expect(17.56).toBeLessThan(16)` dưới tải, lượt sau xanh — cùng họ với nợ mà PR #937 vừa trả
  cho test python). Ý định đo vẫn giữ nguyên: adapter phải TUYẾN TÍNH theo số unit. Cách mới so
  TỈ LỆ số lượt tra bản đồ vòng từ vựng giữa A1 và C2 — độc lập hoàn toàn với tốc độ máy.
  **Đo thật 2026-09-15:** A1 (15 unit) 54 lượt · C2 (44 unit) 147 lượt → tỉ lệ tra **2,72** so
  với tỉ lệ unit **2,93**; một vòng lặp lồng ẩn sẽ cho ≈ 8,6 — cách ngưỡng (2,93 × 1,5 = 4,4)
  rất xa. Không skip, không disable.
- **Breadcrumb**: trang bài nay truyền thêm đốt cuối là TÊN BÀI. `Breadcrumb` cố tình cắt đốt
  cuối (trang hiện tại), nên trước đợt này chính đốt "bậc học" bị cắt và breadcrumb dừng ở
  "Lập trình" — lỗi cũ, chỉ lộ ra khi nhìn ảnh chụp.
- `preventScroll` khi hộp thoại tự đưa tiêu điểm vào phần tử đầu tiên: 6 hành vi APG không đổi,
  chỉ bỏ cú cuộn thừa đẩy phần tử đó xuống dưới tiêu đề dính.

## Nhìn bằng mắt (Tầng 8b) — ba lỗi CHỈ ảnh chụp mới bắt được

Chụp 6 trang × 1440/390/320 + panel mobile, trước/sau, theme Xanh đêm.

1. **Panel mục lục hiện TIÊU ĐỀ HAI LẦN** — `Modal` tự vẽ tiêu đề dính, `OutlineTree` vẽ tiêu
   đề của nó, bản thứ hai nằm khuất một nửa sau bản thứ nhất. → thêm `headingHidden`
   (giữ `<h2>` dạng `sr-only`) và bỏ khung viền của cây khi nằm trong panel.
2. **Ô tìm bị tiêu đề dính che mất 24px mép trên** — tiêu đề của `Modal` được kéo lên bằng
   `-mt-6` nên chiếm ít chỗ trong luồng hơn chiều cao thật (đo: mép trên cây ở 211,6px, đáy
   tiêu đề ở 235,6px). → bù `pt-6` cho nội dung panel, không sửa `Modal` (20 hộp thoại khác
   đang dựa vào khoảng đệm hiện tại).
3. **Breadcrumb dừng ở "Lập trình"**, không có đốt bậc/khoá (mục "Quyết định" ở trên).

Ảnh sau cho thấy: trang bài Lập trình @1440 thành ba cột (mục lục · nội dung · thanh bước);
trang bài STEM @1440 từ một cột hẹp với gần nửa màn hình trống thành hai cột có mục lục lớp
đang học, chương chứa bài tự bung, bài đang mở tô sáng; `?khoa=git` cho cây KHOÁ Git và
breadcrumb "… › Lập trình › Khoá Git & GitHub thực hành"; @320 không trang nào tràn ngang.

## Bằng chứng kiểm chứng

- `npm run typecheck` · `npm run lint` (0 cảnh báo) · `npm run format` · `npm run build` ·
  `npm run test:coverage` — xem mô tả PR.
- E2E mới: `e2e/outline-programming.spec.ts` (11 ca) + `e2e/outline-stem.spec.ts` (7 ca) — đều
  xanh; gồm ca "sidebar thu gọn mục lục vẫn hiện", "mở bài STEM không thành đã xong",
  "chặn `/api/programming/progress` → cây vẫn bấm được + Thử lại", panel @390, @320 không tràn.
- Cổng a11y: `e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts` (thêm route `?khoa=git`),
  `e2e/a11y-modals.spec.ts` (thêm 5 ca panel mục lục @390 × 5 theme),
  `e2e/mobile-layout-guards.spec.ts` (thêm 2 route STEM) — 0 vi phạm.
- Unit mới: `OutlineTree.test.tsx` (14 ca) · `Modal.test.tsx` (6) ·
  `lessonOutlineContext.test.ts` (9) · `stemOutlineApp.test.ts` (9) · `outlineNav.test.ts` +3.

## Nợ / việc còn lại

- **S07-3** (mục lục cấp CEFR) chưa làm — đó là PR kế tiếp của slice.
- Tiến độ STEM vẫn là "chưa đo được" đúng theo Q5; bằng chứng hoàn thành là slice **S11**.
- Ở worktree phát triển này, các test Pyodide của `e2e/programming-lesson.spec.ts` không chạy
  được vì `node_modules/pyodide` không có trong worktree (vite tự host Pyodide từ đó). Không
  liên quan tới đợt việc — CI cài đủ phụ thuộc nên chạy bình thường.
