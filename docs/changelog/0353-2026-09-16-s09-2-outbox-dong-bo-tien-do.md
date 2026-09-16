# 0353 — S09-2: hàng đợi gửi lại tiến độ học (outbox) ở client

- **Ngày:** 2026-09-16
- **PR:** #984
- **Nhánh:** `feat/s09-2-sync-outbox`
- **Đặc tả:** [`docs/specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md`](../specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md) §① mục 6–11, AC-8 → AC-17 (Approved for implementation)
- **Goal:** [`learning-ux`](../goals/2026-09-15-learning-ux.md) dòng S09-2

## Đã làm

Ba lỗi MẤT DỮ LIỆU THẬT đã ghi trong `PROGRESS.md` (F1/F4/F5 của đặc tả §②) được đóng lại:

1. **`apps/dhcb/src/lib/syncOutbox.ts` (mới)** — hàng đợi gửi lại **theo chủ sở hữu**
   (`dhcb_sync_outbox_<uid>`): debounce 1,5 giây, gộp nhiều thay đổi thành MỘT request, backoff
   2→4→8→16→32 giây có trần, tôn trọng `Retry-After` của 429, giữ mục khi 401 (chờ đăng nhập lại
   ĐÚNG chủ), bỏ mục khi 4xx vĩnh viễn, khoá `navigator.locks` để hai tab không gửi trùng, kích
   hoạt lại khi `online`/`visibilitychange`/`storage`. Khách vãng lai không bao giờ vào hàng đợi.
   Mỗi loại tài liệu (`english` · `programming` · `evidence`) tự đăng ký `KindHandler` — chỉ có
   MỘT chính sách gửi lại cho cả ba.
2. **`progressSync.ts`** — `pushProgress` chỉ XẾP HÀNG (phiên ôn 40 thẻ SRS: 40 POST → 1);
   `pushProgressAsync` vẫn chờ server nhận thật (`CefrExam` claim cần). Bản chụp localStorage
   được đọc **lúc gửi**, sau khi lượt `pullProgress` đang chạy kết thúc (guard cũ giữ nguyên).
   Tách `applyCloudProgress` dùng chung cho lượt kéo và cho bản gộp `merged` server trả về khi
   `conflict: true` — giao diện chỉ có thể nhiều thêm, không bao giờ nhảy lùi (AC-14).
   Ghi/gửi `version` ↔ `baseVersion` của S09-1; server cũ không trả `version` vẫn chạy bình thường.
3. **`programmingProgress.ts`** — `saveLessonProgress` xếp hàng thay vì POST thẳng; `fetchProgress`
   **phủ các mục còn chờ lên bản server** trước khi ghi cache. Đây là chỗ bài học hoàn thành lúc
   mất mạng từng biến mất ở lần mở sau (F4).
4. **`OfflineSyncIndicator.tsx`** đọc hàng đợi THẬT, thêm trạng thái "đăng nhập lại để gửi lên";
   **xoá `offlineStore.ts` + test của nó** — hàng đợi giả: 0 nơi xếp hàng vào, và indicator cũ
   "đồng bộ" bằng `flushOfflineQueue(async () => true)`, tức là xoá mục mà không gửi gì (F5).
5. `useCloudSync.ts` thêm `visibilitychange`, gửi hàng đợi sau mỗi lượt kéo, và tăng `version`
   khi bản gộp từ server vừa được áp. `guestProgress.ts` dời tiến độ Lập trình của khách bằng
   MỘT batch thay vì mỗi bài một POST.

## Quyết định trong lúc làm

- **Không viết luật merge thứ hai ở client.** Bản gộp `merged` đi qua đúng `applyCloudProgress`.
- **`attemptId` xoay khi nội dung đổi.** Với `english` (payload đọc lúc gửi, không có gì để so
  băm), mỗi lần người học tạo thay đổi mới là một `attemptId` mới; gửi lại mà không có thay đổi
  thì giữ nguyên id — đúng bất biến AC-11 mà vẫn không để lần gửi mới bị server coi là "đã lưu rồi".
- **Bản sao trong bộ nhớ khi localStorage ghi hỏng** (hết dung lượng): thà mất khi đóng tab còn
  hơn đánh rơi ngay tại chỗ như trước.
- **Không thêm route vào `a11y.spec.ts`/`a11y-aaa.spec.ts`**: dải thông báo chỉ hiện khi mất mạng
  hoặc còn mục chờ, hai cổng đó quét trang ở trạng thái bình thường nên sẽ không bao giờ thấy nó.
- `evidence` (S11) có hợp đồng + test nhưng **chưa có nơi gọi** — đúng ghi chú AC-16 của đặc tả.

## Lỗi giao diện tìm ra bằng MẮT (Tầng 8b)

Dải thông báo bị **lệch hẳn sang phải, tràn khỏi mép phải màn hình** ở mọi bề rộng: `animate-fade-in`
cũng đặt `transform`, và khai báo trong `@keyframes` THẮNG utility `-translate-x-1/2`. Đo ở 390px:
`x = 195px` thay vì `16px`. Lỗi có sẵn trên `main` (ảnh "trước" chứng minh), không cổng nào bắt
được và đọc mã cũng không thấy. Sửa bằng `inset-x-0 mx-auto` (không cần `transform`).

## Bằng chứng

- `npm run typecheck` · `npm run lint` · `npx prettier --check .` · `npm run test:coverage` — xem mô tả PR.
- E2E mới: `e2e/sync-offline.spec.ts` (AC-8/AC-15), `e2e/sync-two-tabs.spec.ts` (AC-12, Web Locks thật).
- Unit mới: `syncOutbox.test.ts` (26 ca), `OfflineSyncIndicator.test.tsx` (4 ca), ca AC-14/AC-15
  thêm vào `progressSync.test.ts` / `programmingProgress.test.ts`.
- Ảnh 1440/390/320 px trước–sau của dải thông báo (trạng thái mất mạng và trạng thái hết phiên).

## Không làm (giữ nguyên phạm vi)

Không đụng luật merge domain (`progressMerge.ts` diff rỗng), không đổi hạn mức, không service
worker background sync, không CRDT, không migration (S09-1 đã có `0083`), không đụng trang
`/tien-do`, không sửa nợ `learningReadModelService.ts:68`.
