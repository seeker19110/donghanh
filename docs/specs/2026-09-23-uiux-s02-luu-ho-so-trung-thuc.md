# S02 — Lưu hồ sơ trung thực ở onboarding và xếp lớp

| Thuộc tính | Giá trị                                                            |
| ---------- | ------------------------------------------------------------------ |
| Goal       | [UI/UX và sư phạm](../goals/2026-09-23-uiux-su-pham.md), M1/S02/F2 |
| Trạng thái | Draft — đã chọn phương án, chưa review/merge, chưa triển khai      |
| Base       | `1d9e247e`                                                         |
| Owner      | Agent triển khai; chủ sản phẩm nghiệm thu                          |

## 1. Outcome và phạm vi

Khi lưu hồ sơ thất bại, người học còn nguyên lựa chọn/kết quả và có thể thử lại.
Chỉ cập nhật cache hồ sơ, tốc độ học và chuyển trang sau khi xác nhận server đã lưu.
Cả `Placement.tsx` lẫn `pages/core/Onboarding.tsx` phải xử lý cùng contract.
Không thay chấm điểm, cơ chế xác thực, schema CSDL, quyền, usage hoặc đồng bộ lịch sử ở
`firePost`. Hợp đồng trả kết quả của bước refresh auth là phụ thuộc cần review trước
triển khai; nếu phải sửa hành vi session dùng chung thì tách slice có impact/test riêng.

Giữ lựa chọn/kết quả khi lỗi trong cùng phiên component. Onboarding hiện chỉ giữ các
trường bằng `useState`, chưa có draft persistence qua reload. Lưu draft qua reload
không thuộc S02; không dùng cache hồ sơ đã lưu để giả làm draft.

## 2. Hiện trạng và hợp đồng

`apps/dhcb/src/lib/cloud.ts:142` nuốt lỗi `saveOnboarding`; hai caller tiếp tục như
thành công. Server tại `apps/server/src/api/core/profile.ts` trả `{ ok: true }` sau
transaction dual-write public.profiles và english.user_profile. Việc đồng bộ Life Graph
được gọi sau transaction; không giả định toàn endpoint idempotent chỉ vì có upsert.

Chọn trả union có kiểu cho helper client: success hoặc error phân biệt lỗi mạng/timeout,
HTTP, response không hợp lệ. Validate `{ ok: true }` bằng Zod; không coi 2xx với HTML/JSON
sai hình dạng là thành công. Hạn thời gian request 15 giây, không auto-retry POST.
Người học bấm thử lại chủ động với cùng payload; trước source chạy impact map và bổ sung
bằng chứng retry ở mức integration theo mục 4.

Trong lúc lưu, khóa gửi trùng bằng guard đồng bộ và disabled UI, giữ dữ liệu hiển thị.
Trong lỗi, giải phóng pending trong finally, hiện lời giải thích tiếng người dùng và
Thử lại; không log payload học viên/token. Nếu server đã lưu nhưng response bị mất,
retry cùng payload phải không sinh tác dụng phụ trùng. Chưa có bằng chứng integration
thì chưa Ready; không coi một lần GET profile khớp là bằng chứng projection đã đồng bộ.

### 2.1. Bằng chứng retry từ mã hiện tại

`packages/core-personal/personService.ts` dùng unique `user_id`, `ON CONFLICT DO NOTHING`
và đọc lại khi hai request cùng tạo Person. `lifeGraphService.ts` trong
`upsertLearningGoalProjection` khóa Person bằng `FOR UPDATE` trong transaction, rồi
tra source theo person/domain/type/source_id trước insert. Source cùng label đã tồn tại
thì trả node/goal cũ, không insert hoặc ghi create audit thêm.

Test adapter hiện mock projection; test service kiểm nhánh source đã có và thứ tự lock.
Đây là bằng chứng cấu trúc mã, chưa thay thế test DB concurrent/retry endpoint. Khi
label goal cũ khác nguồn mới, projection ném ConflictError; endpoint bắt lỗi và vẫn trả
`{ ok: true }`. Nhánh này không có outbox thực dù comment nhắc Outbox/Reconciliation.
S02 xác nhận lưu hồ sơ chính, không hứa Life Graph luôn đồng bộ hoặc sửa reconciliation.

### 2.2. Tách lưu thành công và đọc lại phiên

Sau POST hợp lệ, ghi cache/speed một lần và chuyển sang trạng thái đã lưu. Onboarding
chỉ điều hướng sau khi bước đọc lại phiên xác nhận cùng user id và `onboarded: true`.
Nếu bước đọc lỗi, giữ thông báo đã lưu và nút thử lại bước đọc; không POST lại.

`AuthProvider.refresh()` hiện trả `Promise<void>` và gọi `getCurrentUser()` qua
`GET /api/auth?action=me`, không phải `GET /api/profile`. Network/JSON lỗi có thể throw;
HTTP non-ok trả null, làm AuthProvider chuyển user thành guest rồi resolve. Vì vậy
chỉ try/catch quanh refresh chưa đáp ứng hợp đồng. Trước source phải review hợp đồng
refresh phân biệt thành công/lỗi; lỗi 5xx không được diễn giải là đăng xuất. HTTP 401
phải giữ đúng xử lý hết phiên hiện có và không điều hướng như đã refresh thành công.
Không suy ra refresh thành công chỉ từ việc Promise resolve hoặc cache cục bộ có dữ liệu.

## 3. Tiêu chí nghiệm thu

- HTTP 200 + `{ ok: true }`: mỗi hành động một request, cache/speed/navigation đúng.
- HTTP 400/401/403/429/500, offline, timeout, JSON lỗi: không chuyển trang/ghi cache
  như đã thành công; pending kết thúc; thông điệp phù hợp và dữ liệu còn nguyên.
- Retry sau lỗi: dùng nguyên lựa chọn/kết quả, thành công mới chuyển trang.
- Nhấn nhanh hai lần/phím Enter lặp: một request đang chạy; unmount không cập nhật UI cũ.
- Sau POST thành công, refresh auth gặp 500/offline/JSON lỗi: giữ trạng thái “đã lưu”,
  thử lại chỉ gọi bước đọc phiên, không POST lại và không coi lỗi 5xx là đăng xuất.
- Refresh trả 401 hoặc user khác/onboarded=false: không báo hoàn tất/điều hướng sai;
  xử lý hết phiên theo contract auth, giữ thông tin trạng thái lưu để phục hồi phù hợp.
- Lỗi POST trong cùng phiên giữ nguyên lựa chọn/kết quả; không hứa giữ draft qua reload.
- Hai chiều học có nhãn rõ ràng; lỗi được thông báo cho screen reader, focus hợp lý,
  nút ≥44px và nội dung đọc ≥7:1 trên ba theme.
- Không thay đổi authoritative mastery và không cấp quyền từ dữ liệu client.

## 4. Kiểm thử và triển khai

Unit helper kiểm HTTP/schema/timeout; component kiểm cache/nav chỉ sau thành công;
E2E mock lỗi rồi retry cho cả hai caller và kiểm save-success/refresh-failure riêng.
`e2e/onboarding-by-subject.spec.ts` hiện trả profile object cho cả POST: phải sửa mock
POST thành `{ ok: true }`, giữ profile ở GET và cập nhật trạng thái auth sau lưu.

Integration server dùng PostgreSQL cục bộ, không gọi provider: mô phỏng response mất
rồi retry, và hai POST cùng payload đồng thời. Xác nhận 1 Person, 1 source, 1 node/goal
và chỉ hai create audit ban đầu cho node/goal; profile dual-write đúng. Kiểm retry sau
lỗi projection tạm thời có thể hoàn tất projection, không tạo trùng. Fake kiểm thứ tự
SQL có thể bổ sung nhưng không thay bằng chứng khóa/concurrency từ DB thật cục bộ.
Không paid provider/production.

Chạy complete gate AGENTS, E2E, ảnh trước/sau 390/1440. Kiểm 320/768 và ba theme.
Node 22 và lockfile hiện tại. Spec phải review, Approved for implementation và merge
trước source nếu slice mở rộng thành capability/contract mới theo AI_DELIVERY_LOOP.

Dự kiến không migration; rollback bằng revert đồng bộ helper và hai caller.
Không revert riêng helper khiến caller diễn giải sai kiểu trả về. PR phải ghi rõ rủi ro
response thất lạc và bằng chứng retry; chưa có bằng chứng thì slice chưa Ready.

## 5. Điểm còn phải xác minh

- Chạy integration DB cho retry/concurrency; mã và unit mock đã rà tại mục 2.1.
- Review contract refresh có kết quả rõ ràng, xác định slice auth phụ thuộc và impact.
- Chạy impact map helper/hai caller/auth; rà các mock POST còn lại ngoài test đã nêu.
- Spec vẫn Draft; chưa phê duyệt hay triển khai source.

Những mục này cần đọc mã/test, không cần quyết định sản phẩm mới từ người dùng.
