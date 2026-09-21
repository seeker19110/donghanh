# ADR-0010: Xoá hẳn ba trụ Career/Startup/Life (giữ Work = "Ghi chú")

- **Trạng thái:** Đã chấp nhận
- **Ngày:** 2026-09-20 (hồi cứu — ghi lại 2026-09-21 theo chốt `/adr`; quyết định và thi hành
  thật đã xong ở PR đợt `docs/changelog/0389-*.md` (gỡ UI) + `0390-*.md` (xoá backend + dữ liệu))

## Bối cảnh

`core-domains` từng gộp 4 trụ Career/Work/Startup/Life dưới Companion đồng hành xuyên trụ. Chủ
dự án chốt thu hẹp phạm vi sản phẩm: chỉ giữ trụ **Work** (hiển thị "Ghi chú", `/ghi-chu`). Ba
trụ còn lại (Sự nghiệp, Khởi nghiệp, Đời sống) không còn nằm trong hướng sản phẩm hiện tại.
Quyết định thực hiện qua hai đợt: 0389 gỡ UI trước (giữ backend vì Companion còn đọc dữ liệu qua
`domainReadModelService.ts`), 0390 xoá hẳn backend + bảng CSDL sau khi chủ dự án xác nhận chấp
nhận mất dữ liệu người dùng cũ ở ba trụ này (không hoàn tác được).

## Quyết định

Xoá hẳn service/contract/route/bảng CSDL của ba trụ Career, Startup, Life (chi tiết đầy đủ ở
`docs/changelog/0390-2026-09-20-xoa-backend-ba-tru.md`). `domainReadModelService.ts` chỉ còn
`DOMAIN_READ_MODEL_DOMAINS = ['work']`. Cố ý GIỮ LẠI `life-graph.ts`/`life-goals.ts`/
`life-synthesis.ts` + `lifeGraphService` (schema `personal`, khác schema Life bị xoá) vì đây là
hạ tầng Learning/Companion đang chạy thật (`/api/life-synthesis`, `LifeSynthesisDashboard`) —
KHÔNG thuộc phạm vi ADR này, cần chốt riêng nếu sau này muốn xoá tiếp.

## Lý do

- Companion mất khả năng tư vấn xuyên trụ ở ba mảng đã xoá — chấp nhận được vì đây không còn là
  hướng sản phẩm.
- Giữ mã/bảng chết (dead code + dead schema) tốn chi phí bảo trì và tăng diện tích tấn công/bug
  không cần thiết hơn là xoá dứt khoát.
- Xoá theo hai bước (UI trước, backend sau) giảm rủi ro: phát hiện sớm nếu còn phụ thuộc ẩn
  trước khi xoá dữ liệu không hoàn tác.

## Các phương án đã cân nhắc

- **Giữ nguyên 4 trụ, chỉ ẩn UI:** không giải quyết chi phí bảo trì mã/bảng chết, và dữ liệu cũ
  vẫn treo lơ lửng không ai xử lý — không chọn.
- **Archive dữ liệu trước khi xoá bảng:** cân nhắc nhưng chủ dự án xác nhận chấp nhận mất dữ
  liệu người dùng cũ (sản phẩm giai đoạn sớm, ít người dùng thật ở 3 trụ này) — không làm thêm
  bước archive để giữ đợt việc gọn.
- **Xoá hẳn ngay một lượt (UI + backend + DB cùng lúc):** rủi ro hơn xoá theo hai bước vì không
  có điểm dừng để phát hiện phụ thuộc ẩn (như `lifeGraphService` suýt bị xoá nhầm) — không chọn.

## Hệ quả

- Tích cực: giảm diện tích mã nguồn (nhiều service/contract/route/bảng), giảm rủi ro bảo mật/bug
  ở phần không còn dùng, kiến trúc rõ ràng hơn (chỉ còn `work`).
- Đánh đổi/rủi ro: mất dữ liệu người dùng cũ ở 3 trụ vĩnh viễn (đã chấp nhận, không hoàn tác);
  Companion không còn liên kết ý tưởng xuyên Career/Startup/Life.
- Việc tiếp theo: nếu sau này cần mở lại một trong ba trụ, đây là ADR bị thay thế — viết ADR mới
  đánh dấu ADR-0010 "Đã thay thế bởi ADR-XXXX", không khôi phục mã cũ mù quáng (kiến trúc dữ
  liệu/route đã đổi từ đó).
