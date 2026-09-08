# Đặc tả roadmap product-first: English-first → Daily Loop → Life Graph → Adaptive Companion

Ngày chốt: 2026-09-08

## 1. Mục tiêu

Roadmap sản phẩm đang chạy:

`English-first → Daily Learning Loop → Life Graph signals → Recommendation Engine → Adaptive Companion → Cross-domain proof`

Roadmap này quyết định **thứ tự ưu tiên sản phẩm**. `docs/architecture-v2/21-ROADMAP.md` tiếp tục quyết định invariant/biên kỹ thuật. Không tạo backlog V2 thứ hai.

## 2. Nguyên tắc bắt buộc

1. Không mở rộng chiều rộng trước khi có bằng chứng người dùng thật.
2. English là wedge market.
3. Deterministic-first; LLM chỉ dùng khi rule/code không đủ.
4. Planning ≠ Execution ≠ State Mutation.
5. Evidence-first personalization: provenance/confidence bắt buộc cho state derived.
6. Một slice = một outcome nhỏ, reversible, có acceptance criteria.
7. Không scale theo ước lượng; đo trước khi mua hạ tầng.

## 3. North Star

**Weekly Successful Learning Days / Active Learner**

Một ngày thành công = người dùng hoàn thành ít nhất một activity có bằng chứng kết quả.

Metric phụ:

- activation;
- D1/D7/D30 return;
- completion của Daily Plan;
- recommendation CTR/completion;
- % đạt goal đo được trong 30 ngày;
- cost / successful learning day;
- tỷ lệ recommendation không cần LLM.

Guardrail:

- không tăng LLM calls chỉ để “cá nhân hóa cho đẹp”;
- không ghi state derived thiếu provenance;
- không đưa dữ liệu nhạy cảm sai purpose;
- không làm giảm typecheck/lint/test/build/a11y/bundle/security.

## 4. P0 — Evidence window

Trong 2–4 tuần, ưu tiên người dùng thật và analytics. Không thêm môn/khóa/domain mới. Dùng activation, DAU/WAU/MAU, returning và đường đi thực tế để quyết định mảng nào đáng đào sâu.

## 5. P1 — Daily Learning Loop

### Outcome

Home trả lời: **“Hôm nay tôi nên làm gì?”**

### P1.1 — Deterministic Daily Plan

Trạng thái: **đang triển khai ở PR #878**.

- tách ranking khỏi JSX;
- ưu tiên SRS đến hạn, sau đó giữ mạch học đang dang dở;
- fallback an toàn;
- reason + estimated minutes;
- không gọi AI để ranking.

### P1.2 — Analytics cho recommendation

Trạng thái: **đang triển khai ở PR #879**.

- impression/click theo action kind;
- planner version được ghi để so sánh;
- không lưu nội dung học/dữ liệu nhạy cảm;
- chưa tin completion do client tự khai.

### P1.3 — Completion server-derived

Định nghĩa completion theo dữ liệu domain/server state, không cho client tùy ý bắn `complete`. Mục tiêu là funnel:

`impression → click → meaningful completion → D1/D7 return`

### Gate P1

- deterministic tạo được phần lớn plan;
- đo được impression/click/completion;
- không tăng AI call trước khi user bắt đầu activity;
- có đủ dữ liệu để thay đổi weight dựa trên outcome thay vì cảm giác.

## 6. P2 — Life Graph signals

### Trạng thái baseline

**V2-05 Life Graph foundation đã tồn tại trên `main`**, gồm migration `0043_life_graph.sql`, service `lifeGraphService.ts` và test. Không viết lại schema/API này.

`docs/architecture-v2/V2-05-SLICE-1.md` từ nay là baseline/invariant, không phải backlog implementation.

### P2.1 — Gap audit cho Daily Plan

Chỉ bổ sung phần thiếu mà P1/P3 thực sự cần, ví dụ:

- evidence links;
- Goal Graph read model tối ưu;
- reconciliation/outbox khi source thay đổi.

Không bulk backfill hay graph UI nếu chưa có use case thật.

### P2.2 — Skill/evidence links

Goal có thể nối tới skill/evidence read models; Learning vẫn sở hữu mastery và evidence payload.

## 7. P3 — Recommendation Engine

Pipeline:

`candidate generation → deterministic filters → policy/sensitivity → scoring → top-K → optional LLM wording`

Mọi recommendation phải có reason codes truy vết được và fallback khi AI provider lỗi.

## 8. P4 — Adaptive Companion

Flow:

`request → intent → context → goal relevance → planner → proposed action → domain action → evidence → state candidate`

State candidate chỉ thành update khi qua rule/policy của owner tương ứng.

## 9. P5 — Cross-domain proof

Flow ưu tiên:

`Career goal → skill gap English/SQL/Statistics → Learning plan → evidence/mastery → Career progress`

Chỉ mở rộng khi có người dùng thật cần flow này.

## 10. Những việc tạm dừng

- thêm STEM/domain mới;
- thêm specialization/khóa mới;
- Career/Work/Startup/Life thành mini-app độc lập;
- thêm provider/model chỉ vì mới;
- graph database;
- scale 50k concurrent theo lý thuyết.

## 11. Reliability/Security track chạy song song

- Redis sau swap;
- verify restore backup;
- k6 theo nấc;
- Gemini Live với API key thật;
- mở rộng golden eval;
- mã hóa dữ liệu cũ + key management;
- dependency patch/minor an toàn, major tách PR.

## 12. Thứ tự PR hiện tại

1. **PR #877** — đặc tả roadmap và sửa trạng thái V2-05 theo bằng chứng hiện có.
2. **PR #878 / P1.1** — deterministic Daily Learning Plan.
3. **PR #879 / P1.2** — impression/click analytics.
4. **P1.3** — completion server-derived + funnel.
5. **P2.1** — gap audit Life Graph cho signals thật sự cần bởi P1/P3.
6. **P3.1** — recommendation engine v1 dựa trên outcome.
7. **P4.1** — Companion context integration read-only.

## 13. Definition of Done mỗi slice

- acceptance criteria có test/bằng chứng;
- format/typecheck/lint/build/test xanh;
- migration có rollback note nếu có;
- không sửa trực tiếp `main`;
- PR nhỏ và reversible;
- UI change có Tầng 8b 1440px + 390px trước/sau;
- analytics được thêm khi thay đổi hành vi người dùng.

## 14. Quyết định hiện tại

**Không triển khai lại V2-05.** Tận dụng Life Graph baseline đã có, triển khai P1 trước để tạo dữ liệu hành vi thật. Chỉ quay lại P2 khi P1/P3 chỉ ra signal/read model cụ thể còn thiếu.
