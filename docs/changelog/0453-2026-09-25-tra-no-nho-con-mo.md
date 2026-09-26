# Trả nợ nhỏ còn mở: lỗi chấm lượt shadowing, badge một dòng, thanh đáy nền đặc, lỗi thô

- **Ngày:** 2026-09-25 · **PR:** #1179 (nhánh `seeker/zealous-allen-ygj0gw`)
- **Loại:** `fix(ui)`. Người dùng yêu cầu "liệt kê, sửa và hoàn thiện toàn bộ", rồi "còn lỗi nào
  fix toàn bộ đi". Năm việc dưới đây gồm phần nợ đang mở sửa được hoàn toàn bằng code (nợ ghi ở
  `0450`/`0451`, phần sót của nợ lỗi thô ở audit UI/UX 2026-09-22), cộng một lỗi đua thời gian có
  sẵn trên `main` lộ ra khi CI của PR này chạy.
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

5. **Lỗi đua thời gian ở trang bài Lập trình (S09d), có sẵn trên `main`, làm E2E của PR này đỏ.**
   CI đỏ cả hai lượt ở `S09-P-AC06`: sau Back, URL mất `#example`.
   - **Nguyên nhân gốc:** React Router v7 cập nhật location trong `startTransition`. Khi máy chậm,
     cú bấm thứ hai (lối tắt "Kết quả chấm") chạy lúc trang chưa render lại, nên `goTo` đọc `loc`
     cũ, tưởng còn ở entry đầu bài và `replace` đè mất entry `#example`. Người dùng thật trên máy
     yếu bấm nhanh hai lần cũng dính.
   - **Cách sửa:** `goTo` đọc vị trí qua `viTriRef`. Ref được cập nhật ngay khi trang điều hướng
     và đồng bộ theo `loc` sau mỗi commit. Trang STEM/Tiếng Anh đã có cơ chế tương đương
     (`hashDangCho`, bài học S09b); trang Lập trình làm sau mà quên.
   - **Unit test tái hiện tất định:** hai cú bấm trong cùng một `act()`. Trước khi sửa đỏ đúng
     triệu chứng CI (`expected '' to be '#example'`).
   - **E2E:** hai chỗ kiểm ngay sau `goto` URL cũ và sau `reload` chưa chờ bài nạp lười như `mo()`.
     Thêm helper `taiLai` và chờ `#dau-bai` 30s.
   - Ghi vào `TRAPS.md`: mục 14 mới, cộng một dòng tái phát ở mục 7.

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

- Lỗi đua thời gian, đo bằng `--repeat-each=12 --retries=0`:
  - Ca AC06, 6 worker: `main` đỏ 7/12; sau khi sửa 12/12 xanh.
  - Cả file 7 ca, 8 worker: trước khi thêm `taiLai` đỏ 16–18/84; sau khi sửa 84/84 xanh.
  - `ProgrammingLessonPage.test.tsx`: 25/25.

## Nợ còn lại

- `e2e/programming-lesson.spec.ts` (spec khác, không đụng trong PR này) còn vài `expect` đầu tiên
  sau `goto` dùng ngưỡng 5s mặc định. Ép 6 worker × 4 lần ở máy thì đỏ 12/32 lượt (đúng biến thể
  "dev server nguội" ở `TRAPS.md` mục 7); cấu hình CI (2 worker) xanh 42/42. Sửa theo đúng khuôn
  mục 7 khi có đợt riêng.

Không còn nợ mở của chuỗi S06. Các nợ khác trong `PROGRESS.md` cần người, chuyên gia, thiết bị thật
hoặc chờ ràng buộc bên ngoài. Xem danh sách phân loại trong mô tả PR.
