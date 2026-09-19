# ADR-0005: Không dùng cột `stats` không tồn tại cho learning read-model

- **Ngày:** 2026-09-18
- **Trạng thái:** ✅ Accepted — chốt phương án B (2026-09-19)
- **Người quyết định:** Chủ dự án (đã chốt 2026-09-19, xem "Quyết định cần chủ dự án" bên dưới)

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

- **[2026-09-19] ĐÃ TRIỂN KHAI theo 4 quyết định ở mục "Quyết định cần chủ dự án — ĐÃ CHỐT"
  bên dưới.** `packages/core-learner/learningReadModelService.ts` chỉ còn SELECT cột thật
  (`learned, srs, placement, updated_at`); contract `recentEvidenceCount` đã đổi sang
  nullable (không bump schema version); test canh `learningReadModelService.schemaGuard.test.ts`
  đã bỏ `describe.skip`, chạy xanh. Xem `docs/changelog/0375-2026-09-19-sua-learning-read-model-adr-0005.md`.
- **Kéo theo:** cập nhật contract/test để không còn fake `stats`; xác nhận `learned` có
  nghĩa là mastered và quy ước `srs.due` (epoch/timezone); thêm telemetry cho giá trị
  unknown và query latency.
- **Chấp nhận đánh đổi:** read-model có thể trả thiếu một số summary trong thời gian
  chuyển tiếp; không được biến unknown thành zero nếu consumer dùng zero như sự thật.
- **Điều kiện xem lại:** JSONB hoặc p95 query vượt ngưỡng vận hành đã chốt, hoặc cần
  dashboard/query đa người dùng; khi đó cân nhắc C với backfill và verification query.

## Quyết định cần chủ dự án — ĐÃ CHỐT (2026-09-19)

**Khảo sát trước khi chốt:** tất cả 5 nơi gọi `getLearningReadModel` hiện tại
(`apps/server/src/api/learning/learning-read-model.ts`, `careerService.ts`,
`crossDomainGraphService.ts`, `proactiveBriefingService.ts`, `companionRuntime.ts`) đều KHÔNG
truyền `subject`, nên luôn nhận mặc định `'english'`. Quan trọng: bảng bằng chứng thật
`platform.completion_evidence` (migration `0081`) có ràng buộc
`subject_id in ('mathematics','physics','chemistry','biology')` — **KHÔNG có `english`**. Tức
với subject đang dùng thật, hiện KHÔNG tồn tại nguồn "bằng chứng đã xác thực server" nào cho
việc học tiếng Anh (đúng nợ đã ghi ở `PROGRESS.md`: "Hội thoại CEFR chỉ đánh dấu đã xem",
"Bài Lập trình/Anh vẫn client tự khai"). Quyết định dưới đây phản ánh đúng thực tế đó thay vì
suy đoán ra một con số trông có vẻ đáng tin.

1. **`inProgressCount` và `dueForReviewCount` lấy từ dữ liệu nào:** tính từ hai JSONB thật
   `learned` (mảng từ đã tự đánh dấu "thuộc") và `srs` (map từ → thẻ ôn tập, có `reps`/`due`)
   trong `english.learning_progress`.
   - `inProgressCount` = số khoá trong `srs` **chưa có mặt** trong `learned` (đang ôn, chưa
     được đánh dấu thuộc).
   - `dueForReviewCount` = số khoá trong `srs` có `due <= now()` (now tính ở SERVER, xem mục 3).
   - `srsDueCount` (field cấp cao nhất, tách khỏi `masterySummary`) dùng **CHUNG một công thức**
     với `dueForReviewCount` — không tính hai lần theo hai cách khác nhau như code cũ ngầm định
     (`stats.srsDueCount || dueForReviewCount`), tránh lệch số giữa hai field.
2. **Contract v2:** CHỈ `recentEvidenceCount` được đổi sang **nullable** (`number | null`) —
   biểu diễn "chưa đo được" khi subject không có nguồn evidence thật (đúng trường hợp `english`
   hiện tại). Bốn field còn lại (`masteredCount`, `inProgressCount`, `dueForReviewCount`,
   `srsDueCount`) **VẪN bắt buộc số nguyên không âm** như v1 — chúng có nguồn dữ liệu thật rõ
   ràng từ JSONB, không cần nullable. **Không bump `LEARNING_READ_MODEL_SCHEMA_VERSION`** — chỉ
   5 consumer nội bộ (liệt kê ở trên, cùng repo) nên sửa `recentEvidenceCount` sang nullable và
   cập nhật cả 5 nơi đọc field này trong CÙNG một PR, không cần đường chuyển tiếp v1↔v2 riêng.
3. **Đồng ý:** SRS due dùng **server time** (`Date.now()`/`now()` phía server, KHÔNG nhận giá
   trị "bây giờ" từ client) làm chuẩn so sánh với `due` lưu trong `srs`. `due` do client ghi là
   **dữ liệu đầu vào (snapshot)**, không phải nguồn xác định thời điểm — khớp cách
   `mergeSrsMap`/`progressMerge.ts` đã xử lý (S09-1, xem `docs/changelog/0373-*.md`). Snapshot
   này KHÔNG cấp mastery hay quyền gì, chỉ là ngữ cảnh hiển thị.
4. **`recentEvidenceCount`:** với subject **không có** bảng evidence thật khớp
   (`english` — do ràng buộc `completion_evidence.subject_id` ở trên) → trả **`null`**
   (không suy đoán bằng `masteredCount + inProgressCount` như code cũ). Nếu sau này subject
   khớp một trong bốn môn STEM có `completion_evidence` thật, tính = số dòng
   `platform.completion_evidence` của user trong 7 ngày gần nhất (window cố định, có thể chỉnh
   qua hằng số) — **việc này ĐỂ NGOÀI PHẠM VI PR sửa lỗi này**, vì hiện chưa consumer nào gọi
   `getLearningReadModel` với subject STEM; chỉ cần cài đúng "trả null khi không có nguồn",
   không cần cài logic đếm STEM ngay.
   `masteredCount` = `learned.length` (số từ người học đã tự đánh dấu "thuộc" qua UI) — đây LÀ
   **số tự báo cáo (self-reported)**, KHÔNG phải bằng chứng đã xác thực server; giữ nguyên diễn
   giải này vì đó là nguồn duy nhất tồn tại và đã được hiển thị cho người dùng dưới đúng nhãn
   "Đã thành thạo: N từ" từ trước khi có ADR này — bug ở đây chỉ là NGUỒN ĐỌC sai (`stats` ảo)
   chứ không phải đổi ý nghĩa hiển thị. Phải ghi rõ trong code comment + type doc đây là số tự
   báo cáo, để không ai sau này lại coi nó là bằng chứng học thật.

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
