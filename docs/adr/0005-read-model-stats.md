# ADR-0005: Không dùng cột `stats` không tồn tại cho learning read-model

- **Ngày:** 2026-09-18
- **Trạng thái:** đề xuất (Proposed — chưa phê duyệt triển khai)
- **Người quyết định:** Chủ dự án (chưa chốt)

## Bối cảnh

`packages/core-learner/learningReadModelService.ts` đang đọc
`settings, placement, stats, updated_at` từ `english.learning_progress`. Schema hiện tại
không có cột `stats`; dữ liệu tiến độ thực tế nằm trong các JSONB `learned`, `srs`,
`placement`, `weekly_goal` và các trường liên quan. Test hiện tại dựng fake row có `stats`,
nên chưa phát hiện lỗi production.

Read-model này được dùng bởi `/api/learning-read-model`, rồi bởi
`companionRuntime`, `proactiveBriefingService`, `careerService` và
`crossDomainGraphService`. Contract v1 yêu cầu các số `masteredCount`, `inProgressCount`,
`dueForReviewCount` và `srsDueCount`, nhưng semantics và nguồn dữ liệu của ba số đầu chưa
được chốt trong schema.

`recentEvidenceCount` hiện được suy ra bằng `masteredCount + inProgressCount`; phép cộng
này không chứng minh số evidence, cũng không định nghĩa cửa sổ "recent". Không được coi
`learned` là mastery chỉ vì tên trường hoặc coi mọi SRS entry là evidence đã xác thực.

Nguồn đối chiếu: `postgres/schema.sql`, `packages/core-contracts/learningReadModel.ts`,
`packages/core-learner/learningReadModelService.ts`, `PROGRESS.md` mục nợ S12. ADR này ghi
đề xuất; spec triển khai và hợp đồng consumer vẫn cần được duyệt theo
[`AI_DELIVERY_LOOP.md`](../AI_DELIVERY_LOOP.md).

## Các phương án đã cân nhắc

### A. Thêm và duy trì cột `stats` tổng hợp

- Được: đọc nhanh, contract hiện tại ít thay đổi.
- Mất: migration/backfill, đồng bộ với mọi writer JSONB, nguy cơ số liệu stale hoặc lệch
  khi client sync/retry; chưa giải quyết định nghĩa metric.

### B. Tính từ các JSONB hiện có, chỉ công bố metric có semantics rõ

- Được: dùng nguồn dữ liệu đang có, không tạo thêm authoritative state; có thể tính
  `srsDueCount` từ `srs` theo server time và `masteredCount` từ `learned` sau khi xác nhận
  semantics.
- Mất: cần chốt schema contract cho giá trị chưa biết (nullable/`dataQuality` hoặc bỏ
  khỏi v2), có thể tốn CPU khi JSONB lớn.

### C. Tạo view/materialized read-model riêng

- Được: tách query khỏi document JSONB và tối ưu được sau khi có số đo.
- Mất: thêm schema, refresh/backfill và vận hành; hiện chưa có bằng chứng latency cần
  tối ưu sớm.

## Quyết định

**Đề xuất chọn B.** Không thêm cột `stats` chỉ để làm query hiện tại chạy. Trước khi sửa
code, chủ dự án phải chốt semantics của từng metric và contract tương thích (khuyến nghị
v2 cho phép `unknown`/nullable thay vì trả `0` giả). Sau đó service đọc các JSONB thật và
chỉ tính các metric có nguồn xác định; `stats` không được trở thành nguồn authoritative mới.

## Vì sao loại các phương án kia

Phương án A che khuất vấn đề semantics và tạo thêm một bản sao trạng thái phải đồng bộ
với client snapshot. Phương án C có thể là bước tối ưu sau này, nhưng premature khi chưa
có số đo kích thước JSONB, cardinality người dùng và p95 latency.

## Hệ quả

- **Kéo theo:** cập nhật contract/test để không còn fake `stats`; xác nhận `learned` có
  nghĩa là mastered và quy ước `srs.due` (epoch/timezone); thêm telemetry cho giá trị
  unknown và query latency.
- **Chấp nhận đánh đổi:** read-model có thể trả thiếu một số summary trong thời gian
  chuyển tiếp; không được biến unknown thành zero nếu consumer dùng zero như sự thật.
- **Điều kiện xem lại:** JSONB hoặc p95 query vượt ngưỡng vận hành đã chốt, hoặc cần
  dashboard/query đa người dùng; khi đó cân nhắc C với backfill và verification query.

## Quyết định cần chủ dự án

1. `inProgressCount` và `dueForReviewCount` được định nghĩa từ dữ liệu nào?
2. Cho phép contract v2 trả `null`/`unknown`, hay bắt buộc tương thích số nguyên v1?
3. Có chấp nhận server-time làm chuẩn cho SRS due và coi client snapshot là nguồn đầu vào
   của số đếm SRS không? Snapshot này chỉ là dữ liệu tự báo cáo, không cấp mastery.
4. `recentEvidenceCount` đếm loại evidence nào, theo cửa sổ thời gian nào, và thể hiện
   dữ liệu chưa biết ra sao? `masteredCount` cũng cần nguồn/tiêu chí mastery được xác nhận.

## Bảo mật và thẩm quyền dữ liệu

- Chỉ đọc dữ liệu của user đã xác thực, kiểm liên kết `personId`/`userId` và scope domain
  ở caller; không tin các định danh do client tự khai. Test phải phủ truy cập chéo user.
- Read-model không ghi ngược mastery, completion, billing hoặc quyền. Consumer Companion
  chỉ được dùng summary như ngữ cảnh có nguồn, không làm bằng chứng để cấp quyền/thành tích.
- Validate dữ liệu DB và response theo schema; phân biệt thiếu dữ liệu, sai định dạng
  và số không đo được. Không ghi raw settings, placement hoặc mục tiêu cá nhân vào log.
- Telemetry chỉ ghi lỗi schema, trạng thái chất lượng dữ liệu và thời lượng tổng hợp;
  không đưa nội dung learner vào nhãn metric.

## Triển khai, tương thích và rollback

1. Chốt semantics từng metric và kiểm kê toàn bộ consumer trước khi đổi contract.
   Không phát v2 với null cho client còn parse v1; duyệt đường chuyển tiếp và thứ tự
   triển khai server/consumer trong spec riêng.
2. Xác minh query bằng PostgreSQL local với schema/migrations thật. Test mock chỉ là
   lớp bổ sung, không phải bằng chứng cột tồn tại. Không dùng DB production để thử.
3. Nếu chuyển tiếp lỗi, tắt nhánh tiêu thụ summary mới và giữ nguồn học tập hiện có;
   không khôi phục câu SQL đọc `stats` hoặc biến unknown thành zero để né lỗi.
   Revert consumer mới trước khi bỏ hỗ trợ contract mới theo thứ tự đã duyệt.
4. Phương án B không yêu cầu migration/backfill. Nếu triển khai cần thêm schema thì
   cập nhật spec/ADR trước, kèm migration additive và truy vấn kiểm chứng riêng.

## Tiêu chí kiểm chứng trước khi chấp nhận triển khai

- Query chạy trên schema thật không lỗi undefined-column; fixture chỉ dùng cột có thật.
- Unit test phân biệt user chưa có progress, số không hợp lệ, JSONB lỗi và trường hợp
  thật sự đo được số đếm bằng không; không tự đổi dữ liệu thiếu/lỗi thành zero.
- Nếu duyệt SRS due: test đúng biên thời gian, timestamp sai, item trùng, dữ liệu rỗng
  và clock cố định; không phụ thuộc đồng hồ client.
- Nếu duyệt evidence count: test cửa sổ thời gian, dedupe và loại evidence hợp lệ theo
  contract đã chốt; không dùng tổng mastery làm proxy.
- Contract test phủ consumer cũ/mới và unknown; ngữ cảnh Companion không tuyên bố
  learner đã thành thạo khi không có nguồn xác thực.
- Test endpoint phủ auth, ownership và scope; không có query ghi authoritative state.
- Chạy full gate theo `AGENTS.md` sau code change; ADR tài liệu-only chỉ cần Prettier
  và `git diff --check`. Các tiêu chí trên chưa phải kết quả đã chạy.

## Unknowns

- Kích thước thực tế của các JSONB và p95 của query trên dữ liệu production-like.
- Tất cả writer hiện tại của `learned`/`srs` và khả năng replay/backfill nếu semantics thay đổi.
- Consumer có xử lý được `unknown` mà không biến thành cảnh báo/briefing sai hay không.
