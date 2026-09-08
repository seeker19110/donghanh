# Đặc tả roadmap product-first: English-first → Daily Loop → Life Graph → Adaptive Companion

Ngày chốt: 2026-09-08

## 1. Mục tiêu

Roadmap này biến hướng phát triển hiện tại thành một chuỗi có thể thi hành và đo được:

`English-first → Daily Learning Loop → Life Graph → Recommendation Engine → Adaptive Companion → Cross-domain expansion`

Đây là roadmap SẢN PHẨM đang chạy, không thay thế roadmap kiến trúc tham khảo ở `docs/architecture-v2/21-ROADMAP.md`. Khi hai tài liệu cùng chạm một hạng mục, roadmap sản phẩm này quyết định **thứ tự ưu tiên**, còn tài liệu kiến trúc quyết định **invariant/biên kỹ thuật**.

## 2. Nguyên tắc bắt buộc

1. **Không mở rộng chiều rộng trước khi có bằng chứng người dùng thật.** Trong 2–4 tuần đầu không thêm môn, khóa, specialization hay mini-app mới.
2. **English là wedge market.** Người dùng vào vì nhu cầu tiếng Anh; nền tảng giữ họ lại nhờ hiểu mục tiêu và lịch sử dài hạn.
3. **Deterministic-first.** Rule/code lọc và chấm điểm trước; LLM chỉ dùng cho phần cần ngôn ngữ/suy luận mềm.
4. **Planning ≠ Execution ≠ State Mutation.** AI không được tự biến suy luận thành dữ liệu authoritative.
5. **Evidence-first personalization.** Mọi thay đổi hồ sơ phải có provenance/evidence/confidence.
6. **Một slice = một outcome nhỏ, reversible, có acceptance criteria và rollback.**
7. **Không scale theo ước lượng.** Chỉ mua hạ tầng sau load test và số liệu thật.

## 3. North Star và chỉ số cổng

### North Star

**Weekly Successful Learning Days / Active Learner**

Một ngày học thành công là ngày người dùng hoàn thành ít nhất một hoạt động có bằng chứng kết quả (lesson/quiz/SRS/speaking/writing/practice hoặc activity khác đã được domain đăng ký).

### Metric phụ

- Activation: signup → onboarding complete → first meaningful activity.
- D1 / D7 / D30 return.
- % người dùng đạt một goal đo được trong 30 ngày.
- Completion rate của Daily Plan.
- Recommendation acceptance rate.
- Cost / successful learning day.
- Tỷ lệ recommendation được tạo không cần LLM.

### Guardrail

- Không tăng call LLM/user chỉ để cá nhân hóa.
- Không ghi fact/goal derived nếu thiếu provenance.
- Không đưa dữ liệu nhạy cảm vào context sai purpose.
- Không làm giảm các cổng hiện có: typecheck/lint/test/build/a11y/bundle/security.

## 4. Phase P0 — Evidence window (2–4 tuần)

### Outcome

Biết người dùng thật dùng gì, bỏ gì và có quay lại hay không.

### Việc

- Mời tối thiểu 5 người học thật, gồm: English, Programming, Career/Work, Life và một người chiều B.
- Dùng analytics hiện có để đọc activation, DAU/WAU/MAU, returning và day-2 return.
- Ghi lại các đường đi thực tế: tính năng được dùng, bị bỏ qua, điểm rơi khỏi funnel.
- Không thêm domain/môn mới trong cửa sổ này.

### Gate

Chỉ chuyển trọng tâm sang một mảng khi có ít nhất một trong các bằng chứng:

- người dùng quay lại tự nhiên;
- completion tốt nhưng friction rõ ràng;
- goal thật có thể đo và cải thiện;
- nhu cầu lặp lại từ nhiều người.

Nếu không có bằng chứng, ưu tiên sửa activation/onboarding thay vì thêm tính năng.

## 5. Phase P1 — Daily Learning Loop

### Outcome

Home trở thành nơi trả lời câu hỏi: **“Hôm nay tôi nên làm gì?”**

### Read model tối thiểu

Mỗi recommendation candidate có:

- `activityId`
- `domain`
- `kind`
- `goalRelevance`
- `urgency`
- `weakness`
- `forgettingRisk`
- `estimatedMinutes`
- `reasonCodes[]`

### Scoring baseline

Không dùng LLM cho ranking baseline:

`score = goalRelevance × urgency × weakness × forgettingRisk × timeFit`

Có thể chuẩn hóa/weight theo domain, nhưng mọi weight phải nằm server-side và có test.

### UI tối thiểu

Home hiển thị 1–3 việc cho hôm nay, mỗi việc có:

- lý do ngắn;
- thời lượng ước tính;
- CTA đi thẳng vào activity;
- trạng thái done/skipped.

### Gate

- recommendation deterministic tạo được ít nhất 80% daily plan;
- đo được impression/start/complete/skip;
- không tăng call AI cho user chưa bắt đầu hoạt động.

## 6. Phase P2 — V2-05 Life Graph foundation

### Outcome

Có một read model chung nối mục tiêu dài hạn với domain activity mà không giành ownership dữ liệu domain.

### Node types v1

- Person
- Goal
- Project
- Skill
- Organization
- Event
- Commitment
- Constraint
- Decision

### Edge types v1

- requires
- contributes_to
- blocks
- conflicts_with
- supports
- belongs_to
- involves

### Quy tắc dữ liệu

Mọi node/edge có tối thiểu:

- owner/person id;
- provenance/source reference;
- version;
- created/updated timestamps;
- active/archived state.

Derived state phải có thêm:

- confidence;
- evidence references;
- derivation kind/version.

Life Graph là projection/read model. Domain gốc tiếp tục sở hữu payload nghiệp vụ.

### Slice P2.1 — Learning Goal round-trip

Dùng learning goal onboarding hiện tại làm gate đầu tiên. Yêu cầu chi tiết ở `docs/architecture-v2/V2-05-SLICE-1.md`.

Acceptance:

1. backfill idempotent;
2. không update/delete source Learning;
3. round-trip giữ nguyên learner identity, label, target minutes và status;
4. profile chưa onboarding không tạo goal giả;
5. edge không thể cross-user/orphan;
6. optimistic concurrency trả conflict cho stale writer;
7. mutation có audit append-only.

### Slice P2.2 — Evidence links

Nối Goal với evidence read models từ Learning mà không copy toàn bộ dữ liệu học tập.

### Slice P2.3 — Skill links

Cho phép goal yêu cầu/contributes_to skill; Learning vẫn sở hữu mastery.

### Slice P2.4 — Goal Graph read API

API trả graph nhỏ phục vụ Daily Plan và Companion; chưa cần graph database.

### Không làm trong P2

- graph database;
- bulk inference bằng LLM;
- UI graph trực quan lớn;
- tự động tạo goal từ chat;
- cross-domain mutation.

## 7. Phase P3 — Recommendation Engine

### Outcome

Daily Plan lấy signal từ Life Graph + Learning read models.

Pipeline:

`candidate generation → deterministic filters → permission/sensitivity → scoring → top-K → optional LLM wording`

LLM không được quyết activity khi deterministic layer đã loại vì policy, privacy hoặc eligibility.

### Gate

- top-K recommendation có reason codes truy vết được;
- fallback chạy được khi mọi AI provider lỗi;
- recommendation quality đo bằng start/complete/skip và outcome, không chỉ bằng eval prompt.

## 8. Phase P4 — Adaptive Companion

### Outcome

Companion hiểu mục tiêu và trạng thái dài hạn nhưng không tự ý mutate hồ sơ.

Flow chuẩn:

`request → intent → context → goal relevance → planner → proposed action → user/domain action → evidence → state candidate`

State candidate chỉ thành update khi qua rule/policy của owner tương ứng.

### Gate

- mỗi context item có provenance;
- sensitive data lọc theo purpose;
- provider thay đổi không làm mất state;
- AI outage không làm mất Daily Plan baseline.

## 9. Phase P5 — Cross-domain proof

### Outcome

Chứng minh giá trị khác biệt bằng một flow xuyên domain thật.

Flow ưu tiên:

`Career goal → skill gap English/SQL/Statistics → Learning plan → evidence/mastery → Career progress`

Chỉ mở phase này khi P0 có người dùng thật cần flow liên domain.

### Gate

- Career không query trực tiếp bảng Learning;
- Life Graph/read model làm lớp liên kết;
- progress có evidence từ domain nguồn.

## 10. Những việc tạm dừng

Cho tới khi dữ liệu người dùng mở lại gate:

- nối thêm STEM vào app;
- mở specialization/khóa mới;
- mở rộng Career/Work/Startup/Life thành mini-app độc lập;
- thêm model/provider chỉ vì mới hơn;
- graph database;
- scale 50k concurrent theo lý thuyết.

## 11. Reliability/Security track chạy song song

Các việc này được phép chạy song song vì không đổi product scope:

- kiểm tra Redis sau swap;
- verify restore backup;
- k6 theo nấc trước khi mua hạ tầng;
- verify Gemini Live với API key thật trước khi coi production-ready;
- mở rộng golden eval set;
- hoàn tất chiến lược mã hóa dữ liệu cũ + key management;
- dependency patch/minor an toàn; major upgrade tách PR riêng.

## 12. Thứ tự PR đề xuất

1. **PR-R0** — đặc tả roadmap này + liên kết vào nguồn điều hành.
2. **PR-P2.1a** — V2-05 schema + integrity + migration.
3. **PR-P2.1b** — Learning goal adapter + round-trip API.
4. **PR-P2.1c** — audit/concurrency/negative tests + operational notes.
5. **PR-P1.1** — daily candidate contract + deterministic scoring.
6. **PR-P1.2** — Home Daily Plan read-only UI + analytics.
7. **PR-P2.2** — evidence links.
8. **PR-P3.1** — recommendation engine v1.
9. **PR-P4.1** — Companion context integration read-only.

Lý do P2.1 đi trước P1 implementation: Daily Plan cần một representation ổn định của goal để tránh hard-code thêm một lớp goal mới. P1 chỉ dùng read-only Life Graph ở giai đoạn đầu.

## 13. Definition of Done cho mỗi slice

Một slice chỉ được báo xong khi:

- acceptance criteria có test hoặc bằng chứng tương ứng;
- format/typecheck/lint/build/test xanh;
- migration có rollback/recovery note nếu có;
- không sửa trực tiếp `main`;
- PR nhỏ, mô tả rõ invariant và phần chưa làm;
- UI change có Tầng 8b 1440px + 390px trước/sau;
- metric/analytics được thêm nếu slice thay đổi hành vi người dùng.

## 14. Quyết định hiện tại

Bắt đầu bằng **V2-05 Life Graph foundation — slice 1**, nhưng chia nhỏ thành schema/integrity trước, adapter/API sau. Không xây UI Life Graph ở giai đoạn này.
