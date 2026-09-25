# Trả nợ nhỏ còn mở: lỗi chấm lượt shadowing, badge một dòng, thanh đáy nền đặc, lỗi thô

- **Ngày:** 2026-09-25 · **PR:** #1179 (nhánh `seeker/zealous-allen-ygj0gw`)
- **Loại:** `fix(ui)`. Người dùng yêu cầu "liệt kê, sửa và hoàn thiện toàn bộ". Bốn việc dưới đây
  là phần nợ đang mở sửa được hoàn toàn bằng code: nợ ghi ở `0450`/`0451`, cộng phần sót của nợ
  lỗi thô (audit UI/UX 2026-09-22).
- **Trùng việc với PR #1178, đã gộp:** trong lúc PR này mở, `main` nhận #1178 (`0452`), cùng sửa
  trạng thái tải/lỗi/rỗng của thẻ Nói Đè Theo Mẫu + Scenario Holodeck bằng `lib/useCatalogList.ts`.
  Khi gộp `main`, PR này **giữ bản của #1178** vì nó kiểm từng phần tử bằng Zod và huỷ request
  bằng `AbortController`. PR này bỏ hẳn `CompanionVoice/useCompanionList.ts` +
  `CardLoadStatus.tsx` của mình để không có hai hook cùng làm một việc. Chỉ giữ hai phần #1178
  chưa phủ, ghi ở mục 1.

## Đã làm

1. **Thẻ Nói Đè Theo Mẫu báo lỗi khi CHẤM lượt thất bại.** Lỗi tải danh sách đã được #1178 xử lý;
   còn lượt chấm vẫn là `if (res.ok)` + `console.error`. API lỗi thì nút trở lại như chưa bấm,
   không báo gì. Nay có khung `role="alert"`, chữ `text-content` để đạt AAA. Kèm test
   `EchoShadowingCard.test.tsx` (timer giả vì thẻ mô phỏng 4,5 giây thu âm). Holodeck: "Tổng kết"
   xoá lỗi của lượt trước trước khi gọi lại.
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

Studio Thử thách và Kế hoạch, 390px và 1440px, theme blue-sky. Chụp lại **trên kết quả đã gộp
`main` (sau #1178)**, không dùng ảnh của bản trước khi gộp.

- Ở 390px, badge A2A/Ambient còn một dòng (trước: 2 dòng).
- Thẻ Echo/Holodeck hiện đúng MỘT khối lỗi `LoadError` của #1178 kèm "Thử lại". Máy dev không có
  CSDL nên API lỗi, đúng là trường hợp cần kiểm. Khối trạng thái cũ của nhánh này đã gỡ hẳn, không
  lặp.
- Ở 1440px, bố cục giữ nguyên. Không có nội dung bị lặp hay bị mất.

## Bằng chứng

- `EchoShadowingCard.test.tsx` 3 ca. Negative control: chạy với bản `main` (chưa có nhánh lỗi
  chấm) thì đỏ đúng 2 ca lỗi, ca chấm thành công vẫn xanh.
- Cổng thanh đáy: sau khi sửa xanh 9/9. Negative control: trả lại nền `/90 backdrop-blur-xl` thì đỏ
  9 ca.
- `npx playwright test e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts e2e/bottomnav.spec.ts -g "Bạn Đồng
Hành|BottomNav"`: 49/49.
- Lỗi thô: `feedbackApi.test.ts` 3 ca + `friendlyError.test.ts` thêm 5 ca. Negative control: trả
  `feedbackApi.ts` + một panel admin về bản cũ thì đỏ đúng 2 ca (nhánh `HTTP <mã>` và cổng canh).
- E2E vùng chạm tới, trước khi gộp: `admin`, `a11y-admin-intake`, `companion-history`,
  `learning-ux-states`, `bottomnav`: 178 passed (5 skip có sẵn).
- **Trên kết quả đã gộp `main`** (gộp có xung đột nên chạy lại đủ cổng theo CLAUDE.md mục 11):
  sau khi xoá `dist`, typecheck ✅, lint ✅, prettier ✅, `npm run test:coverage` 17.169 ✅
  (94,67/90,6/95,36/95,18, sàn 93/89/93/93), build ✅. E2E `companion-catalog-states` (của
  #1178) + `bottomnav` + `admin` + `companion-history` + a11y AA/AAA các studio: 152 passed.
  Bundle JS 152,21 kB / 160, CSS 23,72 kB / 26.

## Nợ còn lại

Không còn nợ mở của chuỗi S06. Các nợ khác trong `PROGRESS.md` cần người, chuyên gia, thiết bị thật
hoặc chờ ràng buộc bên ngoài. Xem danh sách phân loại trong mô tả PR.
