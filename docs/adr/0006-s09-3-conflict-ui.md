# ADR-0006: Giới hạn S09-3 conflict UI vào draft có hợp đồng đồng bộ rõ ràng

- **Ngày:** 2026-09-18
- **Trạng thái:** đề xuất (Proposed — chưa phê duyệt triển khai)
- **Người quyết định:** Chủ dự án (chưa chốt)

## Bối cảnh

Migration `0083_sync_version_receipts.sql` đã có `public.sync_conflicts` để lưu hai draft,
nhưng hiện chưa có endpoint tạo conflict cho draft và S08 vẫn lưu `LearningSession` local-only.
S09-3 yêu cầu chỉ tạo record khi cùng lesson có `baseVersion` conflict và nội dung tự do
khác nhau; UI chỉ hỏi khi mở lesson, cho phép giữ local/remote, giữ bản không chọn trong
7 ngày.

`/api/progress` hiện chỉ merge progress (union/timestamp) và trả cờ conflict; không nên
được dùng làm API cho free-form draft. Programming session có payload draft và
`contentVersion` rõ hơn; STEM/CEFR hiện chủ yếu là answer/tab/session state, chưa có một
hợp đồng draft server-side thống nhất. Draft có thể chứa code hoặc nội dung cá nhân nên
cần giới hạn log, retention và quyền truy cập theo user.

Nguồn đối chiếu: migration `0083_sync_version_receipts.sql`, đặc tả
[`S09`](../specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md)
AC-18–20 và Q5, cùng đặc tả
[`S08`](../specs/2026-09-15-learning-ux-s08-khung-phien-resume.md).
Q5 đã chốt S09-3 chờ endpoint nháp; ADR này không thay quyết định đó bằng một phê duyệt
ngầm. Cần spec mở rộng server-draft được duyệt trước code.

Migration chỉ tạo bảng conflict, không tự áp TTL hay triển khai job dọn conflict. Quy
định S09 giữ bản không chọn 7 ngày đã có; mốc bắt đầu TTL, xử lý conflict chưa giải quyết
và thời hạn của bản draft đang hoạt động còn cần hợp đồng riêng.

## Các phương án đã cân nhắc

### A. Làm generic conflict cho mọi LearningSession ngay

- Được: phủ rộng S09-3 và một API thống nhất.
- Mất: phải chốt semantics khác nhau giữa programming, STEM, CEFR và writing; dễ lưu
  nhầm progress state như free-form draft, tăng rủi ro privacy và merge sai.

### B. Slice đầu chỉ hỗ trợ programming lesson drafts

- Được: payload, lesson id và content version đã quan sát được; có thể dùng record hiện có,
  endpoint draft riêng, và UI hook khi mở ProgrammingLessonPage.
- Mất: STEM/CEFR chưa có conflict UX; cần thêm outbox/idempotency và quyết định retention.

### C. Hoãn toàn bộ S09-3 đến khi S08 có server-draft contract

- Được: không tạo API/UI tạm thời.
- Mất: tiếp tục có nguy cơ mất draft khi nhiều thiết bị/tab; không có trải nghiệm giải
  quyết conflict.

## Quyết định

**Đề xuất chọn B, nhưng chưa triển khai trong ADR này.** Chủ dự án cần phê duyệt một
`doc_kind`/contract riêng cho programming draft và endpoint draft có version + idempotency;
chỉ endpoint đó mới được tạo `sync_conflicts`. UI `ConflictDialog` đọc unresolved theo
lesson khi mở trang và POST lựa chọn `keep=local|remote`. Không mở rộng sang STEM/CEFR cho
đến khi payload và nguồn authoritative của chúng được chốt.

## Vì sao loại các phương án kia

Phương án A mở rộng phạm vi trước khi có data contract, trái với điều kiện S09-3 rằng
progress union/timestamp không tự tạo ConflictRecord. Phương án C an toàn hơn nhưng để
nguyên mất draft; programming là lát nhỏ nhất có thể kiểm chứng mà không giả định semantics
của các domain khác.

## Hệ quả

- **Kéo theo:** endpoint phải kiểm tra ownership, version/base, retry/idempotency và không
  ghi draft vào `/api/progress`; UI phải có trạng thái loading/error/a11y cho desktop/mobile.
  Retention 7 ngày và device label cần nguồn dữ liệu rõ; không log nội dung draft.
- **Chấp nhận đánh đổi:** coverage ban đầu chỉ là programming; local-only sessions khác
  vẫn không có conflict resolution.
- **Điều kiện xem lại:** S08 phê duyệt server sync cho domain khác, hoặc có dữ liệu cho
  thấy conflict programming không đáng kể và chi phí generic contract hợp lý.

## Quyết định cần chủ dự án

1. Có phê duyệt server sync cho programming drafts không, và remote draft có được lưu 7
   ngày hay theo thời hạn khác? Phân biệt bản draft đang hoạt động với bản thua trong
   conflict; xác định mốc tính 7 ngày cho bản thua và retention conflict chưa giải quyết.
2. Chốt contract draft/version/base và `doc_kind` tương ứng. Endpoint draft riêng và
   outbox là hai lớp bổ sung nhau, không phải hai lựa chọn loại trừ; cần xác định có
   tái sử dụng outbox hiện tại và yêu cầu migration/receipt nào.
3. Khi `contentVersion` stale nhưng không có base draft, giữ local/remote nào và có cho
   phép overwrite không?
4. Device label lấy từ đâu (hiện `LearningSession` chưa cung cấp device identity ổn định)?

## Bảo mật, quyền riêng tư và tính nguyên tử

- Mọi đọc/resolve phải xác thực và truy vấn bằng cả conflict id lẫn user id; không nhận
  ownership từ body. Response không tiết lộ draft hay sự tồn tại conflict của user khác.
- Draft có thể chứa secret do người học dán vào. Giới hạn kích thước, validate Zod,
  không log payload, không đưa nội dung vào URL/analytics hoặc tự gửi sang AI provider.
  Preview hiển thị dạng text, không thực thi code/HTML trong draft.
- Spec triển khai phải nêu auth/CSRF theo cơ chế hiện có, rate limit và hành vi 401/429;
  hàng đợi phải cô lập theo owner, không gửi nháp của tài khoản trước sau khi đăng nhập đổi user.
- Kiểm version, lưu draft được chọn, ghi resolution và receipt phải nguyên tử. Retry
  cùng idempotency key không áp lần hai; hai lần resolve khác lựa chọn không ghi đè nhau
  im lặng. Dữ liệu server mới hơn lúc mở dialog phải được kiểm lại khi chọn.
- `local`/`remote` trong conflict là hai snapshot tại lúc tạo record, không suy ra thiết
  bị đang mở dialog. Nếu không xác thực nguồn thiết bị, dùng nhãn trung tính thay vì
  gán sai "trên máy này"; nội dung nhãn cần được chốt trong spec UX.
- Xoá tài khoản, xoá draft và job retention phải có semantics cho cả bản đang dùng và
  bản giữ lại. Không dùng timestamp client để quyết thứ tự hay TTL.

## Triển khai và rollback

1. Duyệt spec draft trước; xác định storage, base snapshot, version, idempotency và
   giới hạn payload. Migration 0083 không có bảng lưu draft active; `sync_receipts.endpoint`
   hiện chỉ cho phép `progress`/`programming-progress`, nên không giả định tái sử dụng
   cho endpoint mới mà không xem contract/migration.
2. Nếu thêm schema: migration có phiên bản, additive, chạy lặp được, truy vấn kiểm
   chứng và phục hồi trên PostgreSQL local. Không sửa migration 0083 đã phát hành.
3. Triển khai backend tương thích trước, rồi client/outbox và cuối cùng conflict UI;
   điều kiện bật tính năng và thứ tự cụ thể thuộc spec. Nháp local phải còn đọc được
   khi mạng lỗi hoặc server chưa hỗ trợ.
4. Rollback tắt gửi draft mới và UI conflict, giữ nháp local, outbox và dữ liệu server
   để khôi phục; không drop bảng/xoá conflict như bước rollback mặc định. Duy trì job
   retention theo chính sách đã duyệt, không giữ dữ liệu vô hạn do tắt tính năng.
5. Diễn tập rollback phải chứng minh mở lại bài vẫn truy cập bản nháp an toàn; không
   tự chọn bản thắng hoặc đánh dấu completed khi tính năng bị tắt.

## Tiêu chí kiểm chứng trước khi chấp nhận triển khai

- **AC-18:** cùng base + chỉ một phía đổi không tạo conflict giả; cả hai phía đổi khác
  nhau thì giữ cả hai. Thiếu base hoặc stale `contentVersion` theo quyết định đã duyệt,
  không tự overwrite. Giữ test 100 cặp progress union/timestamp tạo 0 ConflictRecord.
- Test tích hợp PostgreSQL local phủ hai writer đồng thời, timeout sau commit rồi
  retry, hai resolve đồng thời và dữ liệu mới tới sau khi dialog mở; không mất draft.
- Test API phủ user khác, body sai, payload vượt giới hạn, replay đổi payload,
  401/429 và quyền đọc bản đã resolve trong thời hạn cho phép.
- Test retention với clock cố định: ngay trước hạn, đúng hạn, sau hạn; conflict chưa
  resolve và xoá tài khoản theo hợp đồng. Có truy vấn chứng minh job dọn đúng phạm vi.
- **AC-19:** dialog chỉ hiện lúc mở bài có conflict, không ngắt lúc đang gõ; retry lỗi
  resolve giữ cả hai bản và cho thao tác tiếp; không conflict thì không có DOM dialog.
- **AC-20:** ảnh 1440/390, 5 theme, hai bản dài ≥ 40 dòng; keyboard/focus/đóng-mở đúng
  Modal hiện có; a11y AA/AAA không vi phạm. Chạy E2E offline, hai tab, đổi tài khoản,
  stale lesson và rollback, cùng full gate theo `AGENTS.md`.
- Danh sách trên là điều kiện cho slice tương lai, không khẳng định đã triển khai hay
  đã vượt test. ADR hiện tại chỉ kiểm format và diff tài liệu.

## Unknowns

- Chưa có producer server-side cho `sync_conflicts`; bảng hiện chỉ là storage contract.
- Chưa xác định auth/CSRF/rate-limit contract cho GET/POST conflict trong API learning.
- Timestamp local có thể lệch clock; cần server `created_at` làm thứ tự hiển thị.
- Chưa có quyết định privacy/delete khi draft chứa code, bài viết hoặc dữ liệu cá nhân.
