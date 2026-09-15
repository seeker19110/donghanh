# Goal: Khoá Kiến trúc sư phần mềm & AI từ số 0 tới chuyên gia

| Thuộc tính        | Giá trị                                                              |
| ----------------- | -------------------------------------------------------------------- |
| Goal ID           | GOAL-2026-ASA                                                        |
| Owner             | Chủ dự án Đồng Hành                                                  |
| Trạng thái        | FRAMING                                                              |
| Bắt đầu           | 2026-09-15                                                           |
| Target review     | Sau mỗi lát cắt                                                      |
| Quyền được cấp    | Research, viết đặc tả, mở PR đặc tả; implementation chờ duyệt đặc tả |
| Budget/guardrails | 1 outcome/PR; không provider trả phí; không dữ liệu production       |

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

| ID    | Outcome/AC                                                     | Dependency | Spec                                          | Issue | PR  | State   | Evidence |
| ----- | -------------------------------------------------------------- | ---------- | --------------------------------------------- | ----- | --- | ------- | -------- |
| M1/S1 | Đặc tả chương trình, coverage map và kế hoạch phát hành        | —          | `2026-09-15-khoa-kien-truc-su-phan-mem-ai.md` | —     | —   | SPEC    |          |
| M1/S2 | Manifest mới + chặng xương sống P1–P4 hiện đúng trong UI       | S1 duyệt   | cùng spec                                     | —     | —   | BACKLOG |          |
| M2/S1 | Nền CS: toán, DSA, OS, concurrency, network, Linux có bài thật | M1         | viết trước slice                              | —     | —   | BACKLOG |          |
| M3/S1 | Backend, data, distributed systems và reliability hoàn chỉnh   | M2         | viết trước slice                              | —     | —   | BACKLOG |          |
| M4/S1 | ML/LLM, RAG, evaluation và AI security hoàn chỉnh              | M3         | viết trước slice                              | —     | —   | BACKLOG |          |
| M5/S1 | Serving, LLMOps, agent runtime, GPU/K8s và observability       | M4         | viết trước slice                              | —     | —   | BACKLOG |          |
| M6/S1 | Enterprise architecture, governance, FinOps và leadership      | M5         | viết trước slice                              | —     | —   | BACKLOG |          |
| M7/S1 | Capstone, full audit, ảnh 390/1440 và release evidence         | M2–M6      | viết trước slice                              | —     | —   | BACKLOG |          |

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

- Commit `main` đã reconcile: `866c50b4`.
- Goal gap hiện tại: 14/27 chặng của `principal-ai` chưa có unit; chưa có phần xương sống từ số 0
  trên trang lộ trình; tên hiện tại nhấn “Kỹ Sư Trưởng AI” nhưng chưa diễn đạt đúng đích kiến trúc.
- Blocker/câu hỏi mở: chủ dự án cần duyệt đặc tả trước khi sửa source theo `AGENTS.md`.
- Next best slice: M1/S2 sau khi đặc tả được duyệt và merge.
- Quyền hoặc quyết định cần thêm: duyệt đặc tả; merge/deploy vẫn theo quyền riêng từng bước.

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
