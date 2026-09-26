# Nút "Xem lớn" cho hoạt ảnh + sửa lỗi nội dung tìm được khi quét

- **Ngày:** 2026-09-26 · **PR:** PR của nhánh `seeker/zealous-allen-ygj0gw` (sau #1179)
- **Loại:** `fix(ui)`. Người dùng yêu cầu "còn lỗi nào fix toàn bộ đi". Quét bằng chính công cụ
  rà của repo (`check:specs`, `check:docs`, `check:protocol`, `check:ui-ux`, `audit:prose --ci`,
  `audit:lessons`); các cổng chặn đều sạch. Soát từng cảnh báo để tách lỗi thật khỏi báo nhầm.

## Đã làm

1. **Chữ nhãn hoạt ảnh quá nhỏ trên điện thoại: nút "Xem lớn"** (đóng nợ 2026-09-14, phương án do
   chủ dự án chọn trong 4 phương án).
   - **Đo lại khi làm:** nợ lớn hơn nhiều so với mô tả gốc ("29/150 nhãn dài"). SVG thật rộng 358px
     ở màn 390px. Trong 238 hoạt ảnh có **1.000/1.861 nhãn hiện dưới 10px** (Hoá 424, Sinh 431,
     Lí 136, Lập trình 9, Toán 0), tệ nhất 6px (`sinh10-c2-b5`, khung 716 × 118, chữ cỡ 12).
   - **Cách làm, ở bộ vẽ `packages/core-ui/LessonAnimation.tsx`, không sửa tay nhãn nào:**
     - Đo bề rộng svg thật bằng `ResizeObserver`. Chữ nhỏ nhất dưới 10px thì hiện nút
       "Xem lớn" cùng hàng nút phát/dừng, nên không nhảy bố cục.
     - Nút mở `<dialog>` gốc bằng `showModal()`: có bẫy tiêu điểm, Esc để đóng, và tiêu điểm vào
       nút "Đóng" rồi trả về nút "Xem lớn" khi đóng.
     - Khi máy dựng đứng mà hình khổ ngang, hình xoay 90° theo chiều dài màn hình, kèm dòng gợi ý
       xoay máy. Nhờ vậy chữ về ≥ 10px kể cả khi khoá xoay. Xoay máy lúc hộp thoại đang mở thì
       khung tự tính lại và thôi xoay.
   - **Phép tính tách riêng** ở `lessonAnimationZoom.ts` (luật react-refresh). Dùng `<dialog>` gốc
     vì hook hộp thoại của dự án nằm ở `apps/`, mà `packages/` không được import `apps/`.
2. **Khoá `airel` lặp bài.** `p6-u14-l2` nằm ở cả chương 9 lẫn 10; `p6-u107-l2` ở cả chương 8
   lẫn 12. Học viên gặp lại đúng bài cũ, còn chương đó thiếu bài khớp chủ đề.
   - Chương 10 (lab "kill worker ở bước 3/5, không gọi lại API đã xong") → `p6-u104-l1` (việc nền
     bị giao hai lần).
   - Chương 8 (lab ngưỡng cảnh báo) → `p6-u110-l2` (phân loại mức sự cố + leo thang).
   - Chương 12 giữ bài SLO vì "Error budget" là trọng tâm ghi rõ của chương.
   - Thêm test chặn CI "không bài nào xuất hiện hai lần trong cùng một khoá" (trước chỉ là cảnh
     báo `KHOA_BAI_LAP`).
3. **Bài Git lộ đáp án.** Câu Dự đoán ở `gitu4.ts`: đáp án đúng là lựa chọn DUY NHẤT viết không
   dấu, ba lựa chọn sai đều có dấu, nên nhìn định dạng là đoán được. Viết lại có dấu.
4. **Công cụ rà bớt báo nhầm.** `audit-lessons` miễn cảnh báo "không có ca test ẩn" cho Kotlin. Đã
   kiểm trong mã: `kotlinSim/chayKotlin.ts` bỏ qua stdin (`void dongVao`), nên ca ẩn với input khác
   là không thể có. 13 → 6 cảnh báo, đều là bài Python thật.

## Soát rồi, KHÔNG sửa (báo nhầm hoặc là việc soạn nội dung)

- **"placeholder" ở `p6-u156-l2`, `p6-u178-l1`:** thuật ngữ trong bài ("secret placeholder"),
  không phải nội dung soạn dở.
- **Chuỗi không dấu ở `p6u225`:** quy ước của cả loạt p6u22x (kết quả chính sách máy đọc
  `allow:`/`deny:`).
- **6 bài Python `p6-u13/14/15` không có ca ẩn:** đề dùng hằng, `stdinLines: []` ở mọi ca. Muốn có
  ca ẩn phải thiết kế lại đề cho đọc input, là việc soạn nội dung, cần người duyệt sư phạm.
- **1.187 cảnh báo △ của `audit:prose`** (khoảng trắng trước dấu câu, "từ lặp" như "song song"):
  phần lớn là báo nhầm của phép dò; công cụ chủ ý để mức △, không chặn.

## Tầng 8b — ảnh trước/sau

Bài `sinh10-c2-b5`, theme blue-sky, 390 × 844 · 844 × 390 · 1440 × 900.

- **390px:** hình trong bài chỉ khác đúng vùng nút "Xem lớn" mới. Hộp thoại xoay hình dọc theo
  chiều dài màn hình, chữ đọc được.
- **844 × 390 và 1440px:** không có nút, vì chữ đã ≥ 10px. So từng điểm ảnh ở 1440px: giống hệt.
  Ở 844px chỉ khác một vùng nhỏ của hình động nằm dưới header dính, do khung hình chụp khác
  nhau.

## Bằng chứng

- `lessonAnimationZoom.test.ts` 10 ca; `LessonAnimation.test.tsx` thêm 4 ca (nút, hộp thoại,
  xoay, trả tiêu điểm).
- `e2e/lesson-animation-zoom.spec.ts` 3 ca trên Chromium thật:
  - Dựng đứng: chữ trong bài < 10px, trong hộp thoại ≥ 10px, hình nằm gọn màn hình, axe A/AA
    sạch, Esc trả tiêu điểm.
  - Xoay máy khi hộp thoại đang mở: hình thôi xoay.
  - Desktop: không có nút.
- `courses.test.ts`: test mới đỏ với dữ liệu cũ (`p6-u14-l2 ở airel-c10 đã có ở airel-c9`),
  xanh sau khi sửa.
- Sau khi xoá `dist`: typecheck ✅, lint ✅, prettier ✅, `npm run test:coverage` 17.185 ✅
  (94,66/90,59/95,36/95,17), build ✅.
- Bundle: JS 152,17 / 160 kB, CSS 23,87 / 26 kB (+0,15 kB cho lớp của hộp thoại).
