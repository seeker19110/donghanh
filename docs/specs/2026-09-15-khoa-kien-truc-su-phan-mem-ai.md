# Đặc tả: Khoá “Kiến trúc sư phần mềm & AI”

> Ngày: 2026-09-15 · Trạng thái: **CHỜ NGƯỜI DÙNG DUYỆT — chưa thi hành source**  
> Goal: `docs/goals/2026-09-15-ai-systems-architect.md`  
> Nâng cấp additive từ lộ trình `principal-ai`; không tạo khoá trùng và không đổi id đã phát hành.

## 0. Một câu

Nâng lộ trình “Kỹ Sư Trưởng AI” hiện có thành khóa nghề nghiệp **Kiến trúc sư phần mềm & AI**:
người mới đi từ xương sống lập trình P1, người đã có kinh nghiệm làm chẩn đoán để vào đúng chặng,
và mọi giai đoạn kết thúc bằng một hệ thống hoặc hồ sơ kiến trúc có bằng chứng đo được.

## 1. Quyết định sản phẩm và lý do

### 1.1 Không tạo một `ShortCourse` mới

Yêu cầu mới trùng đích với `learningPaths/principal-ai.ts`: đều là hành trình nhiều năm, ghép toán,
dữ liệu, backend, AI, vận hành và năng lực ra quyết định. `courses/` dành cho khóa ngắn tham chiếu
bài lẻ, không có dependency giữa chặng. Tạo `ai-architect` ở đó sẽ sinh hai source of truth và hai
thanh tiến độ cho cùng một nghề.

**Quyết định:** giữ `pathId = principal-ai`, giữ toàn bộ URL/progress/artifact hiện có; đổi tên hiển
thị và lấp khoảng trống nội dung theo từng slice.

### 1.2 Course spine

```text
Xương sống P1–P4
  → CS/Systems
  → Backend/Data
  → Distributed/Reliability
  → AI Engineering
  → AI Platform/Security
  → Enterprise Architecture/Leadership
```

Mỗi giai đoạn tuân theo vòng:

```text
Hiểu khái niệm → xem ví dụ → dự đoán → sửa lỗi → tự xây
→ test tự động → benchmark/eval → nộp artifact → phản tư bằng ADR
```

## 2. Người học, điểm vào và thời lượng

### Nhóm A — bắt đầu từ số 0

- Vào P1 của xương sống môn Lập trình.
- Hoàn thành P1–P4 trước các chặng chuyên môn.
- Thời lượng mục tiêu: 24–36 tháng, 10–14 giờ/tuần.

### Nhóm B — đã là backend/data/DevOps engineer

- Làm chẩn đoán hiện có.
- Được đề xuất miễn những chặng đã có bằng chứng, nhưng có thể chọn học lại.
- Thời lượng mục tiêu: 12–20 tháng.

### Nhóm C — đã là ML/AI engineer

- Tập trung distributed systems, reliability, security, economics và architecture leadership.
- Thời lượng mục tiêu: 9–15 tháng.

Không hiển thị “điểm năng lực” làm trung tâm. Chẩn đoán chỉ trả lời: **bắt đầu từ việc nào tiếp theo**.

## 3. Chuẩn đầu ra toàn khóa

Người hoàn thành phải chứng minh được cả tám năng lực:

1. Chuyển bài toán kinh doanh thành functional requirement, quality attribute và SLO đo được.
2. Mô hình hóa domain, API, dữ liệu và ranh giới module; ghi quyết định bằng ADR.
3. Thiết kế hệ phân tán chịu partial failure, retry, duplicate, partition và overload.
4. Xây AI feature có baseline, RAG/ML phù hợp, evaluation dataset và release gate.
5. Vận hành model/agent với routing, fallback, permission boundary, telemetry và cost budget.
6. Threat-model data–model–tool supply chain; thiết kế privacy, audit và human oversight.
7. Tính capacity/TCO; quyết định build–buy, API–self-host bằng benchmark thay vì sở thích.
8. Dẫn architecture review và migration nhiều giai đoạn trên một hệ đang sống.

## 4. Chương trình chi tiết

### Giai đoạn 0 — Xương sống lập trình từ số 0

**Nguồn:** tham chiếu `curriculum.ts` P1–P4, không chép bài sang lộ trình.  
**Thời lượng:** 4–8 tháng.  
**Đầu ra:** API nhỏ có PostgreSQL, test, Docker, Git và CI.

| Học phần | Nội dung bắt buộc                          | Bằng chứng                        |
| -------- | ------------------------------------------ | --------------------------------- |
| P1       | biến, kiểu, điều kiện, vòng lặp, hàm, lỗi  | chương trình CLI có test          |
| P2       | cấu trúc dữ liệu, module, file, debug      | ứng dụng nhiều module             |
| P3       | Python/JS/SQL, HTTP, Git, frontend–backend | web app nối API và database       |
| P4       | thiết kế module, kiểm thử, triển khai      | production-ready service đầu tiên |

UI lộ trình phải hiện bốn bậc này trước các phase chuyên sâu, đọc tiến độ hiện có; không tạo bảng
progress mới.

### Giai đoạn 1 — Computer Science & Systems Foundations

**Thời lượng:** 12–18 tuần.  
**Chặng:** `mathforcode-s1..s4`, `algo-s1..s2`, `systems-s1..s2`, `devops-s1`.  
**Đồ án:** “Runtime Lab” — HTTP server có worker pool, profiler, load test và báo cáo memory/I/O.

Nội dung:

- Big-O, arrays, hashing, trees, graphs, queues và caching.
- Đại số tuyến tính, xác suất, gradient và optimization đủ dùng cho ML.
- Process, thread, coroutine, scheduling, virtual memory, GC và file descriptor.
- Race condition, deadlock, lock, semaphore và backpressure.
- TCP/IP, DNS, TLS, HTTP/2, WebSocket, gRPC.
- Linux, shell, systemd, process/network debugging.
- Python async; chọn TypeScript/Go/Rust làm trục backend thứ hai.

**Gate:** giải thích được một request từ DNS tới database; benchmark sync/async; không có race trong
test concurrency; báo cáo p50/p95/p99 thay vì chỉ average.

### Giai đoạn 2 — Software Architecture, Backend & Data

**Thời lượng:** 14–20 tuần.  
**Chặng:** `architecture-s1..s2`, `backend-s1..s2`, `data-s1..s2`.  
**Đồ án:** SaaS modular monolith nhiều tenant.

Nội dung:

- SOLID, cohesion/coupling, dependency inversion và design patterns theo vấn đề.
- DDD: bounded context, entity, value object, aggregate, domain event.
- Hexagonal/Clean Architecture và modular monolith.
- REST/gRPC, OpenAPI, versioning, pagination và idempotency key.
- OAuth/OIDC, RBAC/ABAC, audit trail và tenant isolation.
- PostgreSQL: index, execution plan, MVCC, isolation, lock và migration.
- Redis, cache invalidation, distributed lock và session.
- ETL/ELT, CDC, data contract, quality, lineage và schema evolution.
- Unit, integration, contract, property, fuzz, load và soak testing.

**Gate:** C4 L1–L3, domain model, API contract, threat model, 5 ADR, load report và migration plan.

### Giai đoạn 3 — Distributed Systems & Reliability

**Thời lượng:** 14–20 tuần.  
**Chặng:** `backend-s3..s4`, `data-s3`, `devops-s2..s3`.  
**Đồ án:** nền tảng order/payment event-driven.

Nội dung:

- Partial failure, CAP/PACELC, quorum, replication và partitioning.
- Strong/eventual consistency, logical clocks và consensus ở mức ứng dụng.
- Kafka/RabbitMQ, partition, consumer group, ordering và backpressure.
- Outbox/inbox, Saga, CDC, event versioning, replay và DLQ.
- Rate limit, circuit breaker, bulkhead, retry/backoff/jitter và load shedding.
- SLI/SLO/SLA, error budget, capacity planning, RTO/RPO.
- Logs, metrics, traces, OpenTelemetry và user-journey SLO.
- IaC, containers, Kubernetes, canary, rollback, backup/restore và chaos test.

**Gate:** kill service giữa transaction không làm trừ tiền hai lần; phục hồi từ backup; trace xuyên
5 service; postmortem có timeline, impact, root cause và action owner.

### Giai đoạn 4 — Applied AI, LLM & Evaluation

**Thời lượng:** 14–20 tuần.  
**Chặng:** `ai-s1..s4` cùng khóa ngắn `airel` như nhánh đào sâu tự chọn.  
**Đồ án:** secure multi-tenant RAG.

Nội dung:

- Regression, tree ensemble, clustering, calibration và data leakage.
- Neural network, transformer, attention, tokenization và embeddings.
- Structured output, context budget, prompt versioning và prompt cache.
- Ingestion, OCR, chunking, hybrid search, metadata filter và reranking.
- Retrieval metrics: Recall@K, Precision@K, MRR, nDCG.
- Generation metrics: groundedness, correctness, completeness và citation accuracy.
- Golden set, slice evaluation, LLM-as-a-judge calibration, human review và A/B test.
- Prompt injection, retrieval poisoning, PII leakage và unsafe output handling.

**Gate:** có deterministic baseline; evaluation dataset được version hóa; regression gate chặn quality
giảm; mọi citation truy được về nguồn; tenant A không thể retrieve tài liệu tenant B.

### Giai đoạn 5 — AI Platform, Serving & Agent Runtime

**Thời lượng:** 12–18 tuần.  
**Chặng:** `devops-s4`, `security-s1..s2`, `principal-s1..s2`.  
**Đồ án:** model gateway và durable agent runtime.

Nội dung:

- vLLM/TGI/Triton/Ollama ở vai trò lab, không khóa vendor.
- Batching, PagedAttention, KV/prefix cache, quantization và GPU memory estimate.
- Model registry, versioning, release gate, rollback và drift monitoring.
- Routing, small-to-large cascade, fallback và cost-per-success.
- State machine/DAG, tool contract, checkpoint, timeout, cancellation và loop cap.
- Permission boundary, allowlist, sandbox và human approval.
- AI telemetry: TTFT, inter-token latency, retrieval/model/tool spans và safety events.
- GPU scheduling, autoscaling, cold start và artifact distribution.

**Gate:** provider chính tắt vẫn graceful-degrade; kill worker không lặp side effect; tool argument sai
bị từ chối; dashboard phân rã latency/cost theo từng node.

### Giai đoạn 6 — Enterprise AI Architecture & Technical Leadership

**Thời lượng:** 14–20 tuần.  
**Chặng:** `architecture-s3..s4`, `data-s4`, `security-s4`, `principal-s3..s4`.  
**Đồ án:** architecture portfolio và phiên architecture board giả lập.

Nội dung:

- Requirements discovery và quality-attribute scenarios.
- Capacity model, latency budget, token/GPU throughput và multi-region design.
- Build/buy, API/self-host, TCO, break-even, FinOps và vendor exit.
- Zero Trust, data classification, retention, residency và supply-chain integrity.
- Model/system card, provenance, approval flow và AI incident response.
- NIST AI RMF: Govern, Map, Measure, Manage.
- Strangler migration, backward compatibility và evolutionary architecture.
- RFC, ADR, architecture review, technology radar và paved road.
- Giao tiếp cùng một quyết định cho executive, product/security và engineering.

**Gate:** bảo vệ thiết kế trước hội đồng; trả lời được phương án bị loại và điều kiện đổi quyết định;
roadmap migration có canary, rollback, owner, metric và ngày review.

## 5. Capstone cuối khóa

Người học chọn một domain thật và nộp:

1. Problem brief, user journey, functional/non-functional requirements.
2. Capacity estimate và cost ceiling.
3. C4 Context/Container/Component/Deployment.
4. Data-flow diagram và trust boundaries.
5. Tối thiểu 10 ADR.
6. Threat model và abuse cases cho data–model–tool chain.
7. Golden evaluation set, baseline, release threshold và regression report.
8. Load/chaos/backup-restore evidence.
9. SLO dashboard, alert, runbook và postmortem giả lập.
10. TCO ba phương án và vendor-exit plan.
11. Roadmap 12 tháng, team topology và risk register.
12. Video hoặc transcript review: 5 phút executive + 20 phút architecture board.

Rubric 100 điểm: correctness 15; architecture/trade-off 15; AI evaluation 15; reliability 15;
security/privacy 15; cost/capacity 10; operations 10; communication 5. Không đạt nếu security,
reliability hoặc evaluation dưới 50%, dù tổng điểm cao.

## 6. Hợp đồng dữ liệu cần bổ sung ở slice implementation đầu tiên

Mở rộng additive, giữ tương thích:

```ts
export interface LearningPath {
  // ...giữ nguyên trường cũ
  /** Các bậc xương sống phải đi trước phase chuyên sâu; chỉ tham chiếu id. */
  foundationLevelIds?: ProgrammingLevelId[]
}
```

`principal-ai` khai `foundationLevelIds: ['p1', 'p2', 'p3', 'p4']`; route và id không đổi. UI đọc
progress môn hiện có để hiện `done/total`, trạng thái khóa và nút học tiếp cho từng bậc. Lộ trình khác
không khai trường này vẫn render như cũ.

## 7. Điểm chạm dự kiến của slice implementation đầu tiên

| Hành động | File                                                                    |
| --------- | ----------------------------------------------------------------------- |
| Sửa       | `packages/subject-programming/learningPaths/types.ts`                   |
| Sửa       | `packages/subject-programming/learningPaths/principal-ai.ts`            |
| Sửa       | `packages/subject-programming/learningPaths/learningPaths.test.ts`      |
| Sửa       | `apps/dhcb/src/pages/subjects/programming/ProgrammingPathPage.tsx`      |
| Sửa       | `apps/dhcb/src/pages/subjects/programming/ProgrammingPathPage.test.tsx` |

Không migration, không endpoint, không thay `pathId/phaseId/stageId`, không sửa progress hiện có.

## 8. Acceptance criteria toàn goal

- [ ] Người mới nhìn thấy điểm bắt đầu P1 và một hành động tiếp theo duy nhất.
- [ ] Người cũ làm chẩn đoán và giữ quyền sửa đề xuất điểm vào.
- [ ] 100% chặng bắt buộc có `unitsOfStage(stageId).length > 0`.
- [ ] Mỗi unit có ít nhất hai bài theo vòng 8 bước; sample solution qua toàn bộ test-case.
- [ ] Mỗi giai đoạn có artifact và rubric; capstone có 12 thành phần ở mục 5.
- [ ] Không bài nào chỉ yêu cầu “đọc hiểu”; phải có predict/debug/build/measure/decide.
- [ ] Nội dung nguyên lý không khóa framework/vendor; ví dụ tool-specific ghi rõ có thể thay thế.
- [ ] URL/progress/artifact cũ của `principal-ai` vẫn dùng được.
- [ ] `npm run build`, `typecheck`, `lint`, `format:check`, `test` xanh.
- [ ] E2E lộ trình và ảnh thật 390px/1440px; a11y AA tương tác, AAA chữ đọc.
- [ ] Bundle vẫn trong budget; bài/code runner nạp lười.

## 9. Rollout và rollback

1. Merge đặc tả đã duyệt.
2. Slice manifest/UI foundation; không đổi nội dung stage.
3. Mỗi cụm nội dung là một PR nhỏ, chỉ nối stage khi lesson đã có và test xanh.
4. Stage chưa có bài tiếp tục hiện “đang soạn”; không có nút học giả.
5. Sau mỗi milestone, quan sát start→first lesson, completion và D2 trong 2–4 tuần.
6. Nếu phễu giảm hoặc UI quá tải, rollback phần trình bày; data/progress không cần rollback vì id giữ nguyên.

## 10. Câu hỏi duyệt

Đề nghị chủ dự án duyệt ba quyết định cùng lúc:

1. Dùng `principal-ai` làm lộ trình duy nhất, đổi tên hiển thị thành “Kiến trúc sư phần mềm & AI”.
2. Cho người mới bắt đầu từ P1; `foundationLevelIds` chỉ tham chiếu xương sống, không nhân bản bài.
3. Triển khai theo 7 milestone trong goal, mỗi milestone một hoặc nhiều PR nhỏ và dừng ở cổng review.

Khi ba quyết định được duyệt, đổi trạng thái tài liệu thành **APPROVED FOR IMPLEMENTATION** rồi mới
sửa source.
