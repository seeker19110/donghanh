# S07d — focus không bị header/thanh đáy che, vùng chạm 44px, tiêu đề h1, cổng ma trận

- **Ngày:** 2026-09-25 · **PR:** PR source của nhánh `seeker/gifted-johnson-2qrl9y` (sau #1168)
- **Loại:** `fix(a11y)`
- **Spec:** `docs/specs/2026-09-23-uiux-s06-s08-accessibility.md`, mục S07d (Approved #1168)

## Đã làm

1. **Focus không bị che (WCAG 2.4.11).**
   - `index.css` có quy tắc `html[data-kbd-nav] { scroll-padding-top/bottom }`: phía trên chừa
     chiều cao header sticky, phía dưới chừa `--bnav-h`, đều cộng thêm 8px. Ở chế độ tập trung,
     phía dưới chỉ chừa 8px.
   - `lib/keyboardNavModality.ts` (mới): nhấn Tab thì bật `data-kbd-nav` trên `<html>`; chạm hoặc
     bấm chuột thì tắt. Hàm được gọi một lần ở `main.tsx`.
   - `Layout.tsx`: dùng ResizeObserver đo header sticky và ghi vào biến `--app-header-h`, xoá
     biến khi unmount.
2. **Vùng chạm:**
   - Ô hỏi Home: thêm `.tap-44-y`. Hình dạng form giữ nguyên vì nút anh em đã 44px sẵn.
   - Placement: hai nút "Bỏ qua — tự chọn trình độ" thêm `.tap-44-y`; nút "Thoát" thêm `.tap-44`.
   - Sidebar: nút thu gọn nhóm và nút thu gọn thanh dùng `.tap-44`; khoảng chừa bên phải cho
     chevron đổi từ `pr-10` sang `pr-12` để nhãn không bị đè.
   - Liên kết con sidebar và liên kết gói dùng utility mới `.tap-44-coarse-y`, chỉ có hiệu lực
     trong `@media (pointer: coarse)`.
3. **Tiêu đề:**
   - CEFR ở tab khác "Bài học": `<p>` tiêu đề cấp thành `<h1>`, giữ nguyên style.
   - Placement màn câu hỏi và màn kết quả: thêm `h1` ẩn thị giác.
4. **Cổng `e2e/s07-matrix.spec.ts`** (76 ca), gồm:
   - Tràn ngang + 44px + đúng một h1: 7 màn × 320/390/768 × 3 theme.
   - Tab rồi Shift+Tab không bị che: 4 màn × 320/390.
   - Sidebar `hasTouch` ≥ 44px (3 theme); dùng chuột thì giữ mật độ cũ, sàn 24px.
   - Negative control: bỏ `scroll-padding` thì phép đo phải bắt được cả `NAV` lẫn `HEADER` che focus.

## Lệch so với đặc tả và lý do

Đặc tả ghi đặt `html { scroll-padding-bottom }` thường trực. Khi đi Shift+Tab, cổng mới phát hiện
thêm lỗi cùng khuôn: **header sticky che nút ở mép trên**. Lỗi này có ở Home, Placement câu hỏi,
kết quả STEM và CEFR. Thử nghiệm trên Chromium 141 cho kết quả:

| Cách                                                        | Nút cuối (vốn bị thanh đáy che) nằm ở y = |
| ----------------------------------------------------------- | ----------------------------------------- |
| Không có gì                                                 | 837 (sát đáy 844)                         |
| `scroll-margin` trên `:focus-visible` hoặc trên mọi control | không đổi (**bị bỏ qua**)                 |
| `scroll-padding` trên `html`                                | 669 (thoát khỏi thanh đáy)                |

Vậy chỉ `scroll-padding` của `<html>` có tác dụng. Nhưng để nó thường trực thì nó cộng dồn với
`scroll-mt-*` sẵn có của các điểm neo (#cau-N, #luot-M, đơn vị CEFR, `LessonView` tự tính lệch)
và làm lệch mọi cú nhảy neo bằng chuột. Vì thế nó chỉ bật khi đang điều hướng bằng bàn phím.
Chiều cao header thay đổi theo safe-area nên được đo thật thay vì dùng hằng số. Các thay đổi
này nằm ngoài danh sách file của đặc tả (`main.tsx`, `Layout.tsx`, một file lib mới), nhưng vẫn
trong phạm vi "focus không bị che" đã duyệt. Không đổi logic học, URL, nhãn hay thứ tự Tab.

## Không làm

Pinch, bàn phím ảo, browser zoom trên trình duyệt khác, NVDA/VoiceOver và thiết bị thật vẫn
**WAITING**. S07 rộng vẫn PARTIAL.

## Bằng chứng

- Probe trước khi sửa: `docs/research/2026-09-25-s07d-ma-tran-tu-dong.md`. Sau khi sửa,
  `e2e/s07-matrix.spec.ts` đạt 76/76.
- Tầng 8b: ảnh trước/sau Home, Placement (bắt đầu + câu hỏi), CEFR quiz ở 390/1440 × 3 theme
  (24 cặp). Đã xem bằng mắt:
  - Placement: nút "Bỏ qua" cao thêm 8px; nút "Thoát" có vùng chạm rộng hơn nhưng nhìn giống cũ.
  - CEFR: tiêu đề cấp giữ nguyên hình.
  - Sidebar 1440 dùng chuột: mật độ không đổi.
  - Không lặp hay mất nội dung. Home 390 giống hệt từng byte.
- Unit `keyboardNavModality.test.ts` 3/3. Cổng đầy đủ ghi ở mục Validation của PR.
