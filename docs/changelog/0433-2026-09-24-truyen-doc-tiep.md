# "Đọc tiếp" cho Truyện — nhớ truyện đang đọc dở

- **Ngày:** 2026-09-24 · **PR:** #1158
- **Đặc tả:** [docs/specs/2026-09-24-truyen-doc-tiep.md](../specs/2026-09-24-truyen-doc-tiep.md)
  (tự viết cho việc giao trực tiếp trong phiên, Approved for implementation)
- **Trả nợ:** `PROGRESS.md`, audit UI/UX lần 2 (`0419-*`) — ""Đọc tiếp" ở Truyện cần cơ chế lưu
  truyện đang đọc".

## Đã làm

- `apps/dhcb/src/lib/storyProgress.ts` (mới) — map `storyId → {para, total, updatedAt}` ở
  localStorage key `et_story_progress`, đọc ra qua Zod (bỏ riêng từng bản ghi hỏng). Lưu ở đoạn 0
  hoặc đoạn cuối = xoá (không có gì để đọc tiếp / đã xong). Giữ tối đa 30 truyện.
- `StoryReader.tsx` — lúc tải truyện đọc vị trí đã lưu; cuộn TỨC THÌ tới đoạn đó rồi mới gắn
  `IntersectionObserver` (nếu gắn trước, lần báo đầu thấy đoạn 0 và xoá mất chỗ đang đọc). Vị trí
  = đoạn trên cùng nằm trong dải đọc (dưới header 80px → 40% màn hình). Mốc 1px sau phần bài học
  rút ra lọt vào màn hình = đọc xong → xoá, và khoá ghi trong lượt xem đó. Dòng "Đang đọc tiếp từ
  đoạn X/Y" + nút "Đọc lại từ đầu" đặt NGAY ĐẦU đoạn được cuộn tới (đặt đầu trang thì không ai
  thấy), nhận tiêu điểm để trình đọc màn hình biết trang vừa nhảy.
- `StoryCard.tsx` — prop tuỳ chọn `progress`: nhãn "Đọc tiếp · đã đọc N%" (chiều B "Continue · N%
  read") nằm trong tên truy cập của nút, thanh tiến độ `aria-hidden`. `Stories.tsx` đọc map một
  lần khi mở trang.

## Quyết định

- **localStorage, KHÔNG đồng bộ CSDL.** Đồng bộ qua `learning_progress` cần cột + migration + nhánh
  hợp nhất server/`progressSync.ts`; vị trí đọc dở là dữ liệu tạm, mất thì chỉ về "bắt đầu".
- **File riêng thay vì nhét vào `storage.ts`** — khuôn tiến độ theo tính năng của dự án
  (`cefrProgress.ts`, `programmingProgress.ts`), tránh phình file dùng chung.
- **Đơn vị là ĐOẠN** — ổn định khi đổi khuôn mobile/desktop, bật bản dịch; cấu trúc đoạn giống hệt
  ở chiều A và B nên một bản ghi dùng chung cho cả hai chiều.

## Bằng chứng

- Test mới: `storyProgress.test.ts` (12), `StoryCard.test.tsx` (3), `StoryReader.resume.test.tsx`
  (7: chưa đọc · đọc dở cuộn đúng đoạn + tiêu điểm · lưu đoạn trên cùng · chạm cuối xoá và không
  ghi lại · Đọc lại từ đầu · chiều B · bản ghi quá số đoạn).
- **Negative control:** bỏ guard `finishedRef` trong observer → ca "chạm mốc cuối… không ghi lại"
  đỏ; khôi phục → xanh.
- Cổng: xem mục Validation của PR.
- **Tầng 8b (chụp bổ sung sau khi mở PR):** spec tạm dùng `e2e/helpers/fullPageShot.ts`, mock
  `et_story_progress` cho `ft-jack-beanstalk`, chụp danh sách `/goc-hoc-tap/english/truyen` và trang
  đọc ở 1440/390px × `blue-sky`/`dark-blue` (4/4 đạt; ảnh để ngoài repo, spec tạm đã xoá). Kết quả:
  thẻ hiện "Đọc tiếp · đã đọc 42%"; trang đọc tự cuộn tới giữa truyện (390px: `scrollY` 6553 /
  cao 11.439px), dòng "Đang đọc tiếp từ đoạn 41/56." + nút "Đọc lại từ đầu" nằm ngay dưới header;
  không cuộn ngang (`scrollWidth` = bề rộng khung nhìn) ở cả 4 tổ hợp. Lưu ý đo: trang đọc gom
  dòng theo đoạn (`p`), truyện này 96 dòng nhưng 56 đoạn — bản ghi thật luôn lưu số đoạn do chính
  trang đọc đếm nên nhất quán; con số 96 chỉ là dữ liệu mẫu của lần chụp.
