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

| ID     | Outcome/AC                                                        | Dependency | Spec                                               | Issue | PR   | State     | Evidence                  |
| ------ | ----------------------------------------------------------------- | ---------- | -------------------------------------------------- | ----- | ---- | --------- | ------------------------- |
| M1/S1  | Đặc tả chương trình, coverage map và kế hoạch phát hành           | —          | `2026-09-15-khoa-kien-truc-su-phan-mem-ai.md`      | —     | #938 | DONE      | Spec đã duyệt và merge    |
| M1/S2  | Manifest mới + chặng xương sống P1–P4 hiện đúng trong UI          | S1 duyệt   | cùng spec                                          | —     | #942 | DONE      | CI xanh, merge `9491afb7` |
| M2/S1a | `mathforcode-s1`: số, logic, modulo, Big-O có bài thật            | M1         | `2026-09-16-mathforcode-s1-bai-hoc-that.md`        | —     | #945 | DONE      | CI xanh, merge `598df501` |
| M2/S1b | `mathforcode-s2`: tổ hợp, xác suất, thống kê có bài thật          | S1a        | `2026-09-16-mathforcode-s2-bai-hoc-that.md`        | —     | #950 | DONE      | CI xanh, merge `0e8df605` |
| M2/S1f | `mathforcode-s3..s4`: tuyến tính, giải tích có bài thật           | S1b        | `2026-09-16-mathforcode-s3-s4-bai-hoc-that.md`     | —     | #974 | DONE      | CI xanh, merge `fc1e6b60` |
| M2/S1c | `algo-s1`: nền tảng DSA và complexity có bài thật                 | S1a        | `2026-09-16-algo-s1-bai-hoc-that.md`               | —     | #954 | DONE      | CI xanh, merge `3dfd889d` |
| M2/S1g | `algo-s2`: đệ quy, cây, đồ thị và chiến lược có bài thật          | S1c        | `2026-09-16-algo-s2-bai-hoc-that.md`               | —     | #975 | DONE      | CI xanh, merge `b995df8d` |
| M2/S1d | `systems-s1`: bộ nhớ, C, debug và build có bài thật               | S1c        | `2026-09-16-systems-s1-bai-hoc-that.md`            | —     | #955 | DONE      | CI xanh, merge `3f3447f5` |
| M2/S1h | `systems-s2`: OS, tiến trình và syscall có bài thật               | S1d        | `2026-09-16-systems-s2-bai-hoc-that.md`            | —     | #957 | DONE      | CI xanh, merge `0130e577` |
| M2/S1e | `devops-s1` + Runtime Lab Linux                                   | S1d        | `2026-09-16-devops-s1-bai-hoc-that.md`             | —     | #967 | DONE      | CI xanh, merge `a2077f5f` |
| M2/S1i | `security-s1`: threat model, crypto, API và session có bài thật   | M2         | `2026-09-16-security-s1-bai-hoc-that.md`           | —     | #986 | DONE      | CI xanh, merge `65419ed7` |
| M2/S1j | `security-s2`: assessment scope, triage và disclosure có bài thật | M2         | `2026-09-16-security-s2-bai-hoc-that.md`           | —     | —    | BUILDING  | 4 unit/8 lesson, chờ PR   |
| M3/S1  | `devops-s2`: container, CI release, IaC và cloud policy           | M2         | `2026-09-16-devops-s2-bai-hoc-that.md`             | —     | #989 | DONE      | CI xanh, merge `209b110`  |
| M3/S2  | `devops-s3`: Kubernetes, GitOps, quan sát và độ tin cậy           | M3/S1      | `2026-09-17-devops-s3-bai-hoc-that.md`             | —     | —    | SPEC      | Đặc tả chờ duyệt          |
| M4/S1  | ML/LLM, RAG, evaluation và AI security hoàn chỉnh                 | M3         | `2026-09-16-ai-s2-s4-bai-hoc-that.md`              | —     | #976 | VERIFYING | Đặc tả chờ CI             |
| M5/S1  | `devops-s4`: nền tảng nội bộ, chuỗi cung ứng, phục vụ mô hình     | M4         | `2026-09-17-devops-s4-ai-platform-bai-hoc-that.md` | —     | —    | SPEC      | Đặc tả chờ duyệt          |
| M6/S1a | `data-s4`: nền tảng dữ liệu, độ tin cậy số liệu và quản trị       | M5         | `2026-09-17-data-s4-security-s4-bai-hoc-that.md`   | —     | —    | SPEC      | Đặc tả chờ duyệt          |
| M6/S1b | `security-s4`: kiến trúc an toàn, ứng cứu, điều tra, tuân thủ     | M6/S1a     | `2026-09-17-data-s4-security-s4-bai-hoc-that.md`   | —     | —    | SPEC      | Đặc tả chờ duyệt          |
| M7/S1  | Capstone, full audit, ảnh 390/1440 và release evidence            | M2–M6      | `2026-09-17-capstone-va-audit-toan-khoa.md`        | —     | —    | SPEC      | Đặc tả chờ duyệt          |

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

- `main` đã tới `3e92a78` (Architecture S4, PR #991). Đếm lại ngày 2026-09-17 từ
  `specializations/stageUnits.ts`: **cả 27 chặng mà `principal-ai` đang tham chiếu đều đã có unit
  thật** — baseline "13/27" ở mục 1 đã lỗi thời.
- Goal gap hiện tại KHÔNG còn nằm ở 27 chặng đó, mà ở bốn chặng đặc tả chương trình §4 đòi nhưng lộ
  trình CHƯA tham chiếu và bản đồ hướng còn rỗng: `devops-s3`, `devops-s4`, `data-s4`, `security-s4`.
  Mỗi chặng cần vừa soạn bài vừa nối vào `principal-ai` (27 → 31 chặng, chỉ cộng thêm, không đổi id).
- `security-s3` (bảo mật tấn công chuyên sâu: dịch ngược, khai thác bộ nhớ, fuzzing) được **đề nghị
  loại hẳn** khỏi khoá — mâu thuẫn ranh giới an toàn của `security-s1/s2` và không phục vụ chuẩn đầu
  ra nào ở §3. Cần chủ dự án chốt để lần audit sau không đọc nhầm thành nợ chưa trả.
- Bốn đặc tả còn thiếu đã viết xong ngày 2026-09-17 và đang chờ duyệt (xem cột Spec).
- Blocker/câu hỏi mở: ba câu hỏi duyệt ở cuối mỗi đặc tả; production deploy vẫn ngoài phạm vi.
- Next best slice: duyệt bốn đặc tả, rồi thi hành theo thứ tự M3/S2 → M5/S1 → M6/S1a → M6/S1b →
  M7/S1. M7 phải là lát cuối vì cổng bất biến của nó sẽ đỏ cho tới khi bốn chặng kia có bài.
- Quyền hoặc quyết định cần thêm: chốt loại `security-s3`; chốt việc nối bốn chặng mới vào lộ trình.

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

### Iteration 7 — 2026-09-17

- State: BUILDING.
- Slice: M2/S1j — thi hành `security-s2`.
- Goal gap trước/sau: Security S2 chỉ có bản đồ 4 module → có bốn unit `p6-u186..u189`, tám bài
  Python mô phỏng và stage mapping để learner mở nội dung thật.
- Research/spec/issue/PR: `docs/specs/2026-09-16-security-s2-bai-hoc-that.md`; source PR sẽ tạo
  sau lượt này.
- Thay đổi: authorized scope, web/API finding triage, exposure/secret triage và responsible
  disclosure; curriculum, registry, lazy index và semantic gate được cập nhật.
- Validation và test count: `gen:lesson-index` sinh 453 bài/198 unit; semantic/stage/lazy tests
  xanh 25/25. Cổng đầy đủ sẽ chạy trong CI.
- Metric/guardrail: fixture synthetic/redacted, contract consent và fail closed; không scan,
  payload, network, filesystem, subprocess hoặc secret output.
- Quyết định: mọi action assessment chỉ được mô phỏng sau consent, scope, time window, test account
  và non-destructive mode; disclosure public-before-fix bị block.
- Blocker: không.
- Next best slice: theo dõi PR source đến khi merge, sau đó thi hành Architecture S4 theo đặc tả
  đã duyệt.
- Quyền cần thêm: không; production deploy ngoài phạm vi.

### Iteration 6 — 2026-09-17

- State: BUILDING.
- Slice: M2/S1i — thi hành `security-s1`.
- Goal gap trước/sau: `security-s1` chỉ có manifest bốn module → có bốn unit `p6-u182..u185`,
  tám bài Python mô phỏng và stage mapping để learner mở nội dung thật.
- Research/spec/issue/PR: `docs/specs/2026-09-16-security-s1-bai-hoc-that.md`; PR source sẽ tạo
  sau lượt này.
- Thay đổi: threat boundary/least privilege, crypto policy/lifecycle, defensive API authorization,
  identity/session recovery; curriculum, registry, lazy index và semantic gate được cập nhật.
- Validation và test count: `gen:lesson-index` sinh 445 bài/194 unit; 801 test nội dung Python,
  typecheck, lint, format và build xanh. Full suite có 13.999 test xanh; 5 lỗi `report-status`
  do đường dẫn `/tmp` không tương thích Node Windows và 1 timeout Swift khi chạy song song; Swift
  chạy riêng xanh 44/44.
- Metric/guardrail: simulator dùng fixture bounded, chỉ classification/deny/remediation policy;
  không có network, filesystem, subprocess, secret, scan hoặc exploit.
- Quyết định: malformed và unknown state fail closed; API không âm thầm trim whitespace trước khi
  xét contract.
- Blocker: không; lỗi test môi trường được để tách PR riêng.
- Next best slice: theo dõi PR source đến khi merge, rồi thi hành `security-s2` theo đặc tả đã duyệt.
- Quyền cần thêm: không; production deploy ngoài phạm vi.

### Iteration 8 — 2026-09-17

- State: SPEC.
- Slice: M3/S2, M5/S1, M6/S1a, M6/S1b, M7/S1 — viết nốt đặc tả cho toàn bộ milestone còn BACKLOG.
- Goal gap trước/sau: bốn milestone ghi "viết trước slice" và không ai biết chính xác còn thiếu gì
  → đếm lại từ `stageUnits.ts`, xác định đúng bốn chặng rỗng và viết bốn đặc tả kín cho chúng.
- Research/spec/issue/PR: `2026-09-17-devops-s3-bai-hoc-that.md`,
  `2026-09-17-devops-s4-ai-platform-bai-hoc-that.md`,
  `2026-09-17-data-s4-security-s4-bai-hoc-that.md`, `2026-09-17-capstone-va-audit-toan-khoa.md`.
- Thay đổi: chỉ tài liệu; chưa sửa source.
- Validation và test count: chưa có test mới; đặc tả đối chiếu trực tiếp với
  `specializations/stageUnits.ts`, `devops.ts`, `data.ts`, `security.ts` và
  `learningPaths/principal-ai.ts` ở commit `3e92a78`.
- Metric/guardrail: dải unit mới `p6-u194…p6-u209` không đè lên id đã cấp (cao nhất hiện tại là
  `p6-u193`); mọi thay đổi lộ trình là cộng thêm.
- Quyết định đề xuất (chờ duyệt): loại `security-s3` khỏi khoá; `devops-s4` lấy phục vụ mô hình làm
  lab thay vì soạn lại agent runtime đã có ở `ai-s4`; capstone dùng lại `phaseId principal-ai-p5`
  để không phải migration.
- Blocker: cần chủ dự án duyệt bốn đặc tả trước khi thi hành source.
- Next best slice: M3/S2 — thi hành `devops-s3`.
- Quyền cần thêm: không.

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
