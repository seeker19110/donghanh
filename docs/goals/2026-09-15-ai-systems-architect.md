# Goal: Khoá Kiến trúc sư phần mềm & AI từ số 0 tới chuyên gia

| Thuộc tính        | Giá trị                                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| Goal ID           | GOAL-2026-ASA                                                            |
| Owner             | Chủ dự án Đồng Hành                                                      |
| Trạng thái        | ACTIVE                                                                   |
| Bắt đầu           | 2026-09-15                                                               |
| Target review     | Sau mỗi lát cắt                                                          |
| Quyền được cấp    | Đặc tả đã duyệt; triển khai source từng lát cắt, không deploy production |
| Budget/guardrails | 1 outcome/PR; không provider trả phí; không dữ liệu production           |

## 1. Outcome và Definition of Goal Complete

- Outcome: người bắt đầu từ số 0 có một con đường duy nhất, có bài học thật và bằng chứng đầu ra,
  để tiến tới năng lực AI Systems Architect/AI Software Architect.
- Người dùng: người học Việt Nam muốn đi từ lập trình căn bản tới thiết kế và chịu trách nhiệm cho
  hệ thống AI production.
- Baseline: lộ trình `principal-ai` có 27 chặng, 13 chặng đã nối bài thật; chưa thể hiện phần xương
  sống P1–P4 trong chính trang lộ trình; thiếu các chặng quan trọng về hệ thống, AI nâng cao,
  platform, reliability, governance và kiến trúc enterprise.
- Target: 100% chặng bắt buộc có bài thật; 6 đồ án giai đoạn + 1 capstone có rubric; lộ trình từ P1;
  mọi bài mẫu/test-case chạy thật; UI 390px/1440px đạt AA/AAA.
- Cửa sổ đo: kiểm thử tự động khi mở PR; phễu học thật đo 2–4 tuần sau phát hành.
- Guardrails: giữ `principal-ai` làm id ổn định; không tạo khoá trùng; không xoá tiến độ/artifact;
  không gọi AI trả phí trong test; không hứa “đã có bài” khi `unitsOfStage()` rỗng.
- Completion approver: chủ dự án Đồng Hành.

## 2. Scope và non-goals

### In scope

- Nâng lộ trình `principal-ai` thành thương hiệu “Kiến trúc sư phần mềm & AI”.
- Nối xương sống P1–P4 vào hành trình từ số 0 mà không nhân bản nội dung.
- Biên soạn các chặng còn thiếu theo vòng 8 bước và dự án tích luỹ.
- Bổ sung system design, distributed systems, AI engineering, AI platform, SRE, security,
  governance, FinOps và technical leadership.
- Capstone có C4, ADR, threat model, SLO, evaluation, benchmark, cost model, runbook và postmortem.

### Không làm

- Không tạo lộ trình thứ hai có nội dung trùng `principal-ai`.
- Không biến khóa này thành khóa nghiên cứu AI thuần tuý hoặc luyện thuật toán thi đấu.
- Không bắt người học dùng một cloud/model/provider cụ thể.
- Không chấm artifact bằng output AI chưa kiểm chứng.
- Không deploy production trong goal nếu chưa có lệnh riêng của chủ dự án.

## 3. Milestones và slices

| ID     | Outcome/AC                                                   | Dependency | Spec                                          | Issue | PR   | State   | Evidence                  |
| ------ | ------------------------------------------------------------ | ---------- | --------------------------------------------- | ----- | ---- | ------- | ------------------------- |
| M1/S1  | Đặc tả chương trình, coverage map và kế hoạch phát hành      | —          | `2026-09-15-khoa-kien-truc-su-phan-mem-ai.md` | —     | #938 | DONE    | Spec đã duyệt và merge    |
| M1/S2  | Manifest mới + chặng xương sống P1–P4 hiện đúng trong UI     | S1 duyệt   | cùng spec                                     | —     | #942 | DONE    | CI xanh, merge `9491afb7` |
| M2/S1a | `mathforcode-s1`: số, logic, modulo, Big-O có bài thật       | M1         | `2026-09-16-mathforcode-s1-bai-hoc-that.md`   | —     | #945 | WAITING | Source chờ CI/review      |
| M2/S1b | `mathforcode-s2..s4`: xác suất, tuyến tính, giải tích        | S1a        | viết trước slice                              | —     | —    | BACKLOG |                           |
| M2/S1c | `algo-s1..s2`: DSA và complexity có bài thật                 | S1a        | viết trước slice                              | —     | —    | BACKLOG |                           |
| M2/S1d | `systems-s1..s2`: OS, concurrency, network có bài thật       | S1c        | viết trước slice                              | —     | —    | BACKLOG |                           |
| M2/S1e | `devops-s1` + Runtime Lab Linux                              | S1d        | viết trước slice                              | —     | —    | BACKLOG |                           |
| M3/S1  | Backend, data, distributed systems và reliability hoàn chỉnh | M2         | viết trước slice                              | —     | —    | BACKLOG |                           |
| M4/S1  | ML/LLM, RAG, evaluation và AI security hoàn chỉnh            | M3         | viết trước slice                              | —     | —    | BACKLOG |                           |
| M5/S1  | Serving, LLMOps, agent runtime, GPU/K8s và observability     | M4         | viết trước slice                              | —     | —    | BACKLOG |                           |
| M6/S1  | Enterprise architecture, governance, FinOps và leadership    | M5         | viết trước slice                              | —     | —    | BACKLOG |                           |
| M7/S1  | Capstone, full audit, ảnh 390/1440 và release evidence       | M2–M6      | viết trước slice                              | —     | —    | BACKLOG |                           |

State hợp lệ: BACKLOG / RESEARCH / SPEC / READY / BUILDING / VERIFYING / WAITING / BLOCKED /
DONE / DROPPED.

## 4. Risk register

| Risk                                     | Trigger/guardrail                                   | Mitigation/rollback                                      | Owner   | State |
| ---------------------------------------- | --------------------------------------------------- | -------------------------------------------------------- | ------- | ----- |
| Khoá quá dài làm người học bỏ cuộc       | Tỷ lệ bắt đầu→xong bài đầu và D2 thấp               | Chẩn đoán, miễn phần đã vững, milestone 2–6 tuần         | Product | OPEN  |
| Nhân bản nội dung giữa 4 tầng curriculum | Cùng kiến thức xuất hiện ở hai source of truth      | Manifest chỉ tham chiếu id; test registry                | Eng     | OPEN  |
| Đổi lộ trình làm mất tiến độ cũ          | Đổi `pathId`, `phaseId` hoặc `stageId` đã phát hành | Giữ id ổn định; additive first; test backward-compatible | Eng     | OPEN  |
| Bài “kiến trúc” chỉ là đọc lý thuyết     | Không có benchmark/ADR/threat model chạy được       | Mỗi phase có artifact; capstone có rubric và gate        | Content | OPEN  |
| Nội dung tool-specific nhanh lỗi thời    | Dạy tên framework thay vì nguyên lý                 | Nguyên lý bắt buộc; công cụ chỉ là lab thay thế được     | Content | OPEN  |
| Phạm vi xung đột đóng băng mở rộng       | Chưa có bằng chứng retention                        | Phát hành từng slice; đo phễu; dừng nếu D2 giảm          | Product | OPEN  |

## 5. Current truth

- `main` đã có M1/S2 qua PR #942, merge commit `9491afb7`; CI bắt buộc xanh.
- Goal gap hiện tại: `mathforcode-s1` đã có bài trên nhánh source; còn 13/27 chặng chuyên sâu
  của `principal-ai` chưa có unit thật.
- Blocker/câu hỏi mở: không; production deploy vẫn ngoài phạm vi được cấp.
- Next best slice: M2/S1b — đặc tả xác suất, đại số tuyến tính và giải tích sau khi #945 merge.
- Quyền hoặc quyết định cần thêm: không cho M2/S1a.

## 6. Iteration log

### Iteration 1 — 2026-09-15

- State: SPEC.
- Slice: M1/S1 — khảo sát lộ trình hiện hữu và thiết kế chương trình đầy đủ.
- Goal gap trước/sau: từ yêu cầu tự do → có curriculum map, guardrails, các slice và DoD đo được.
- Research/spec/issue/PR: `docs/specs/2026-09-15-khoa-kien-truc-su-phan-mem-ai.md`.
- Thay đổi: chỉ tài liệu; chưa sửa source.
- Validation và test count: chờ sau khi soạn xong đặc tả.
- Metric/guardrail: giữ nguyên id `principal-ai`; không tạo khóa trùng.
- Quyết định: mở rộng lộ trình hiện hữu thay vì thêm một `ShortCourse` mới.
- Blocker: cần chủ dự án duyệt đặc tả.
- Next best slice: manifest + UI foundation journey.
- Quyền cần thêm: phê duyệt dòng trạng thái “Approved for implementation”.

### Iteration 2 — 2026-09-16

- State: READY.
- Slice: M1/S1.
- Goal gap trước/sau: đặc tả chờ duyệt → đã được chủ dự án duyệt để triển khai.
- Research/spec/issue/PR: PR #938.
- Thay đổi: cập nhật trạng thái đặc tả và goal; chưa đổi runtime trong PR đặc tả.
- Validation và test count: Prettier + `git diff --check`.
- Metric/guardrail: giữ `principal-ai`; không tạo khóa trùng.
- Quyết định: duyệt cả ba quyết định tại mục 10 của đặc tả.
- Blocker: không.
- Next best slice: M1/S2.
- Quyền cần thêm: không.

### Iteration 3 — 2026-09-16

- State: WAITING.
- Slice: M1/S2 — manifest + UI foundation journey.
- Goal gap trước/sau: trang lộ trình bắt đầu ngầm ở P4 → người mới thấy rõ P1–P4, tiến độ thật và
  nút đi thẳng vào từng bậc trước khi vào 27 chặng chuyên sâu.
- Research/spec/issue/PR: đặc tả đã duyệt; PR source #942.
- Thay đổi: đổi tên hiển thị; thêm `foundationLevelIds`; render P1–P4 và số bài đã hoàn thành;
  thêm unit/integration test và E2E URL chuẩn.
- Validation và test count: 20 test mục tiêu xanh; 1 E2E Chromium xanh; typecheck, lint, format,
  build xanh; đã xem ảnh thật ở 390px và 1440px.
- Metric/guardrail: giữ id `principal-ai`; chỉ tham chiếu P1–P4, không sao chép bài hoặc tiến độ.
- Quyết định: tiến độ nền tảng dùng cùng `/api/programming/progress` đang có.
- Blocker: full `npm test` tại máy WSL/Windows còn 4 lỗi có sẵn ở `scripts/report-status.test.ts`
  do test gọi nhầm `PROGRESS.md` thật; các test liên quan thay đổi đều xanh.
- Next best slice: M2/S1 — viết đặc tả lát cắt nội dung nền CS đầu tiên.
- Quyền cần thêm: không; production deploy vẫn ngoài phạm vi.

### Iteration 4 — 2026-09-16

- State: SPEC.
- Slice: M2/S1a — bài học thật cho `mathforcode-s1`.
- Goal gap trước/sau: M1/S2 chờ merge → đã merge; milestone nền CS quá rộng → năm lát cắt nhỏ,
  trong đó lát đầu có hợp đồng bốn unit/tám lesson đo được.
- Research/spec/issue/PR: `docs/specs/2026-09-16-mathforcode-s1-bai-hoc-that.md`; PR #943.
- Thay đổi: tài liệu và goal; chưa đổi runtime.
- Validation và test count: Prettier + `git diff --check` trước PR.
- Metric/guardrail: giữ mọi id đã phát hành; chỉ khai stage có bài sau khi code/test thật tồn tại.
- Quyết định: một module = một unit = hai lesson; Python thuần và tất định.
- Blocker: không.
- Next best slice: implement `p6-u134..p6-u137` sau khi PR đặc tả merge.
- Quyền cần thêm: không.

### Iteration 5 — 2026-09-16

- State: WAITING.
- Slice: M2/S1a — thi hành `mathforcode-s1`.
- Goal gap trước/sau: 14/27 chặng chuyên sâu rỗng → còn 13/27; chặng đầu nền CS có bốn unit và
  tám bài tương tác chạy Python thật.
- Research/spec/issue/PR: spec PR #943 đã merge; source PR #945 đang chờ CI/review.
- Thay đổi: `p6-u134..u137`, registry/curriculum/stage mapping/lazy index, E2E và sửa generator
  URL đa nền tảng.
- Validation và test count: 24 lượt Python mục tiêu và 2.929 test schema/nội dung liên quan
  xanh; typecheck/lint/format/build xanh; full suite 13.078 xanh, 5 lỗi môi trường có sẵn và một
  timeout Swift đã chạy riêng xanh 44/44; E2E Chromium cùng ảnh 390px/1440px đạt.
- Metric/guardrail: mọi id cũ giữ nguyên; stage chỉ mở sau khi unit/bài/test thật tồn tại.
- Quyết định: bốn module tách bốn unit, mỗi unit hai lesson; Make có ca hiện và ca ẩn.
- Blocker: không.
- Next best slice: theo dõi #945 đến khi merge, sau đó đặc tả M2/S1b.
- Quyền cần thêm: không; production deploy ngoài phạm vi.

## 7. Final audit

- [ ] Mọi Goal AC có bằng chứng trên `main`.
- [ ] Metrics đạt, guardrails không suy giảm.
- [ ] Không còn milestone bắt buộc/blocker cao/migration dang dở.
- [ ] Regression/security/privacy/a11y/operational gates xanh.
- [ ] Production verification hoàn tất nếu thuộc scope.
- [ ] Docs/runbook/telemetry/rollback cập nhật.
- [ ] Residual risks và out-of-scope được ghi rõ.
- [ ] Owner xác nhận completion khi cần.

**Kết luận:** NOT COMPLETE  
**Người xác nhận:**  
**Ngày:**
