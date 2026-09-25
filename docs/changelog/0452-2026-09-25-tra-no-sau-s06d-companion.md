# Trả nợ nhỏ còn mở: trạng thái tải/rỗng/lỗi, badge một dòng, thanh đáy nền đặc, lỗi thô

- **Ngày:** 2026-09-25 · **PR:** PR của nhánh `seeker/zealous-allen-ygj0gw` (sau #1177)
- **Loại:** `fix(ui)`. Người dùng yêu cầu "liệt kê, sửa và hoàn thiện toàn bộ". Bốn việc dưới đây
  là phần nợ đang mở sửa được hoàn toàn bằng code: ba nợ ghi ở `0450`/`0451`, cộng phần sót của
  nợ lỗi thô (audit UI/UX 2026-09-22).

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

4. **Lỗi thô không còn lên giao diện — đóng hẳn nợ (1) của audit UI/UX 2026-09-22.** Rà lại
   thấy đợt `0433` chỉ quét khuôn `err instanceof Error ? err.message : …`, bỏ sót khuôn
   `(err as Error).message`:
   - **Phía người học:** `FeedbackModal` hiện nguyên văn "Failed to fetch" / "Lỗi 400" (qua
     `lib/feedbackApi.ts`). Nay nhánh HTTP trả `HTTP <mã>`, giao diện dịch qua
     `thongDiepLoiThanThien` theo chiều học (A tiếng Việt, B tiếng Anh). Lỗi nhận giọng nói ở
     `pages/companion/Companion.tsx` trước đây hiện cả câu kỹ thuật tiếng Anh ("STT API returned
     invalid response"), nay cũng qua helper.
   - **Màn admin:** 27 điểm ở 14 panel. Hàm mới `thongDiepLoiQuanTri` vẫn dịch lỗi trình
     duyệt/HTTP nhưng GIỮ mọi câu khác, kể cả thông điệp Zod tiếng Anh ("Invalid email
     address"). Hàm thường sẽ thay câu đó bằng "Có lỗi xảy ra" và admin mất chi tiết cần để sửa.
     5 panel đợt `0433` (dùng hàm thường) cũng chuyển sang hàm này, tổng 19 panel.
   - **Cố ý giữ nguyên** (như `0433`): bộ chạy code môn Lập trình (`lib/*Runner.ts`, `workers/`),
     chỗ chỉ so mã lỗi (`e.message === 'EMPTY_RECORDING'`…), và `Subjects`/`SubjectDetail`
     (câu tiếng Việt viết sẵn).
   - **Cổng canh** trong `lib/friendlyError.test.ts`: quét `apps/dhcb/src`. Ngoài bộ chạy code
     Lập trình, không file nào được chứa `(x as Error).message`.

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
- Lỗi thô: `feedbackApi.test.ts` 3 ca + `friendlyError.test.ts` thêm 5 ca. Negative control: trả
  `feedbackApi.ts` + một panel admin về bản cũ thì đỏ đúng 2 ca (nhánh `HTTP <mã>` và cổng canh).
- E2E vùng chạm tới: `admin`, `a11y-admin-intake`, `companion-history`, `learning-ux-states`,
  `bottomnav`: 178 passed (5 skip có sẵn).
- Sau khi xoá `dist`: typecheck ✅, lint ✅, prettier ✅, `npm run test:coverage` 17.164 ✅
  (94,68/90,61/95,41/95,19, sàn 93/89/93/93), build ✅. Bundle JS 152,15 → 152,25 kB / 160
  (đo HEAD~1 trong worktree tạm), CSS 23,72 kB không đổi.

## Nợ còn lại

Không còn nợ mở của chuỗi S06. Các nợ khác trong `PROGRESS.md` cần người, chuyên gia, thiết bị thật
hoặc chờ ràng buộc bên ngoài. Xem danh sách phân loại trong mô tả PR.
