# Trả ba nợ nhỏ sau S06d: trạng thái tải/rỗng/lỗi, badge một dòng, thanh đáy nền đặc

- **Ngày:** 2026-09-25 · **PR:** PR của nhánh `seeker/zealous-allen-ygj0gw` (sau #1177)
- **Loại:** `fix(companion)`. Người dùng yêu cầu "liệt kê, sửa và hoàn thiện toàn bộ". Ba nợ này
  ghi ở `0450` và `0451`, là phần nợ đang mở sửa được hoàn toàn bằng code.

## Đã làm

1. **Thẻ "Nói Đè Theo Mẫu" (Echo Shadowing) và Scenario Holodeck có trạng thái tải/rỗng/lỗi.**
   Trước đây hai thẻ nuốt lỗi fetch vào console, nên khi API lỗi hoặc trả rỗng thì thân thẻ trống.
   - Hook mới `CompanionVoice/useCompanionList.ts`: bốn trạng thái `loading · ready · empty · error`,
     kiểm dữ liệu lúc chạy (không phải mảng thì là lỗi), cờ huỷ khi thẻ bị gỡ, `reload()`.
   - Component mới `CompanionVoice/CardLoadStatus.tsx`: `role="status"` khi tải/rỗng,
     `role="alert"` khi lỗi, nút "Thử lại" có vùng chạm 44px.
   - Thẻ "Nói Đè Theo Mẫu" nay cũng báo lỗi khi chấm lượt thất bại (trước đây im lặng).
   - Holodeck: "Tổng kết" xoá lỗi cũ trước khi gọi lại.
2. **Badge "0 bạn học phù hợp" (A2A) và "Chưa kích hoạt" (Ambient) còn một dòng ở 390px.**
   Khối tiêu đề `min-w-0 flex-1`, badge `shrink-0 whitespace-nowrap`. Nút mở/đóng thêm `aria-expanded`.
3. **Nhãn thanh điều hướng đáy đo được tương phản ở mọi trang.** Nền thanh đáy trước đây trong mờ
   90% + `backdrop-blur`, nên nội dung trang lọt qua. axe báo "partially obscured"/"overlapped" và
   không đo được. Nay nền đặc (`bg-zinc-950`, bỏ blur). Cổng mới trong `e2e/bottomnav.spec.ts`:
   ở 390px, cuộn nửa trang, 3 trang × 3 theme, không có vi phạm hay incomplete. Có chặn xanh giả:
   phải đo được ít nhất 5 nhãn.

## Tầng 8b — ảnh trước/sau

Studio Thử thách và Kế hoạch, 390px và 1440px, theme blue-sky.

- Ở 390px, badge A2A/Ambient còn một dòng. Thẻ Echo/Holodeck hiện khối lỗi kèm "Thử lại" thay cho
  thân trống. Máy dev không có CSDL nên API lỗi, đúng là trường hợp cần kiểm.
- Ở 1440px, bố cục giữ nguyên. Đã bỏ khoảng trống thừa dưới khối lỗi, do hàng chọn bài rỗng vẫn
  được dựng.
- Không có nội dung bị lặp hay bị mất.

## Bằng chứng

- `cardLoadStatus.test.tsx` 6 ca. Negative control: đưa hai thẻ về bản cũ thì đỏ 6/6.
- Cổng thanh đáy: sau khi sửa xanh 9/9. Negative control: trả lại nền `/90 backdrop-blur-xl` thì đỏ
  9 ca.
- `npx playwright test e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts e2e/bottomnav.spec.ts -g "Bạn Đồng
Hành|BottomNav"`: 49/49.
- Sau khi xoá `dist`: typecheck ✅, lint ✅, prettier ✅, `npm run test:coverage` 17.156 ✅,
  build ✅.

## Nợ còn lại

Không còn nợ mở của chuỗi S06. Các nợ khác trong `PROGRESS.md` cần người, chuyên gia, thiết bị thật
hoặc chờ ràng buộc bên ngoài. Xem danh sách phân loại trong mô tả PR.
