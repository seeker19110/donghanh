# 0371 — 2026-09-18 — UX-R3.1 Dashboard async truth và retry

## Kết quả

- Weekly quota Free và tiến độ CEFR dùng state keyed `loading|ready|error`, không còn treo loading
  khi request trả `null`, reject hoặc dữ liệu ngoài hợp đồng.
- Retry tạo request thật, chống bấm lặp, bỏ qua response cũ sau đổi user/plan/sync và chỉ phục hồi
  focus khi nút Retry vẫn là active element. VIP không gọi endpoint quota Free; credit `0` là dữ
  liệu ready hợp lệ.
- Biên `/api/usage-summary` được parse bằng Zod; payload null/thiếu/sai kiểu/ngoài khoảng trả
  unavailable thay vì đi thẳng vào UI.
- Outer curriculum và ba resource loader coalesce request đang pending, kiểm `response.ok` cho
  10 dictionary chunk + foundation + CEFR, rồi reset rejected cache bằng identity guard.
- Dashboard không còn `transition-all` hoặc transition width/height/stroke; mọi fade animation
  hiện hữu có nhánh `prefers-reduced-motion`.

## Validation

- Codemap impact đã chạy cho đủ sáu runtime file theo spec.
- Component/integration tập trung: **7 file / 92 test PASS**; gồm keyed stale response,
  Free/VIP/null/zero, retry/focus no-steal, 12 HTTP status check, fake-fetch từng nhóm lỗi rồi
  retry, và harness capture/replay cleanup cũ khi promise retry mới đang pending.
- Independent review: vòng 1 BLOCK 0 critical / 2 major / 2 minor; vòng 2 còn 2 major; vòng 3
  **PASS 0 critical / 0 major / 0 minor**.
- Build, typecheck, lint, format và budget PASS. Budget: initial JS 137,66/150 kB; CSS
  18,42/20 kB.
- Full E2E: **843 pass / 5 skip** trong 13,5 phút; `/tien-do` AA/AAA xanh ở ba theme, calendar
  keyboard/mobile và reduced-motion xanh.
- Full unit chạy 710 file: **708 file / 14.948 test PASS**, 1 file / 1 test fail do timeout Swift
  5 giây ngoài phạm vi; test Swift chạy cô lập ngay sau đó **44/44 PASS**. Không nới timeout hay
  thay test; required `quality` CI của PR là release gate cuối.
- Không API/schema/migration/dependency, paid provider, production data hoặc production access.

## Rollback

Revert riêng PR R3-1. Thay đổi chỉ ở client state/boundary/cache và test; không có dữ liệu cần
khôi phục. R3-2→R3-4 phụ thuộc R3-1 nên nếu đã merge thì phải revert theo thứ tự ngược.
