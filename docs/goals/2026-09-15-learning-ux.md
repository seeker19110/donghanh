# Goal: Học tập liền mạch, có bằng chứng và giao diện xuất sắc

| Thuộc tính        | Giá trị                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| Goal ID           | GOAL-2026-0915-LEARNING-UX                                                                                       |
| Owner             | Chủ sản phẩm Đồng Hành; agent chính điều phối và review                                                          |
| Trạng thái        | WAITING — PR đặc tả S01                                                                                          |
| Bắt đầu           | 2026-09-15                                                                                                       |
| Target review     | Sau mỗi slice; chưa cam kết ngày phát hành toàn bộ                                                               |
| Quyền được cấp    | Người dùng yêu cầu triển khai, branch/PR và mỗi subagent một PR, làm tuần tự. Chưa có quyền merge/deploy rõ ràng |
| Budget/guardrails | Một outcome/PR/agent; tối đa 3 lần sửa cùng lỗi; không paid provider, production data hoặc secrets trong test    |

## 1. Outcome và Definition of Goal Complete

- Outcome: biết học gì, bắt đầu ngay, giữ được bài làm, nhận phản hồi đúng và quay lại đúng chỗ.
- Người dùng: khách và tài khoản; tiếng Anh, STEM, lập trình, toàn bộ môn/khóa có nội dung xuất bản.
- Metric baseline → target: baseline production chưa đo; không suy activation/retention từ audit giả lập. Luồng chuẩn Hôm nay → bài tối đa 2 thao tác; resume đúng activity/step/draft ở mọi ca nghiệm thu; 0 mất nháp/đếm trùng ở ma trận kiểm thử.
- Cửa sổ đo: kiểm tra kỹ thuật từng PR; đánh giá học trì hoãn 7/14 ngày và usability sau khi có bản thử được phép vận hành. Chưa có dữ liệu để kết luận hiệu quả học tăng.
- Guardrails: completion/mastery/quyền/billing do domain/server xác nhận; guest limits giữ nguyên; mục lục độc lập shellbar; không hồi quy theme/a11y/bundle.
- Completion approver: chủ sản phẩm sau evidence trên main và kiểm tra trải nghiệm; không gọi goal complete khi mới viết spec hoặc tạo PR.
- Thị giác: sáu màn mẫu có ảnh 390/768/1440px, kiểm tra 320px và năm theme; mỗi trục phân cấp, typography, bố cục, nhất quán, hoàn thiện đạt tối thiểu 4/5 qua review thiết kế.

## 2. Scope và non-goals

### In scope

- Tin cậy hỏi nhanh; lỗi/dialog/renderer; onboarding theo ý định; Hôm nay; mục lục môn và khóa trong vùng nội dung.
- Phiên học, resume, đồng bộ có version, trợ giảng, kết quả và ôn lại có bằng chứng; nâng thị giác trên token hiện có.

### Không làm

- Viết lại payment/auth/guest mode, nâng 3D/WebGL, thay font toàn app hoặc hứa AI trả lời đúng tuyệt đối.
- Merge/deploy, sửa production hay dùng provider có phí khi chưa có quyền tương ứng.

## 3. Milestones và slices

Danh sách sau phản ánh 13 PR trong kế hoạch người dùng đã chọn. S04–S13 cần discovery và đặc tả nhỏ trước implementation; spec nền không biến cả backlog thành READY. Làm tuần tự; mỗi PR giao một subagent và agent chính review diff/gate.

| ID  | Outcome/AC                                 | Dependency          | Spec                                                 | Issue    | PR                                                       | State   | Evidence                        |
| --- | ------------------------------------------ | ------------------- | ---------------------------------------------------- | -------- | -------------------------------------------------------- | ------- | ------------------------------- |
| S01 | Đặc tả, baseline và ma trận nghiệm thu     | main hiện tại       | [Nền](../specs/2026-09-15-learning-ux-foundation.md) | Chưa tạo | [#920](https://github.com/seeker19110/donghanh/pull/920) | SPEC    | Đối chiếu code, chưa triển khai |
| S02 | Hỏi nhanh trung thực, giữ câu hỏi/ngữ cảnh | S01 merged/approved | Nền §④ A                                             | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S03 | Dialog/lỗi mạng/renderer                   | S02                 | Nền §④ B                                             | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S04 | Tokens và thành phần sáu màn mẫu           | S03                 | Cần spec nhỏ + prototype                             | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S05 | Bắt đầu theo ý định, thống nhất hub        | S04                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S06 | Hôm nay, điểm học tiếp                     | S05                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S07 | Mục lục môn/khóa độc lập shellbar          | S06                 | Nền §④ C + adapter spec                              | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S08 | Khung phiên, nháp/resume cùng thiết bị     | S07                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S09 | Đồng bộ version/retry/xung đột             | S08                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S10 | Trợ giảng trong bài, voice thật            | S09                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S11 | Completion evidence và kết quả             | S10                 | Cần spec nhỏ từng hoạt động                          | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S12 | Ôn lại/sổ lỗi/tiến độ có bằng chứng        | S11                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |
| S13 | Responsive/theme/hiệu năng/rollout         | S12                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                         |

## 4. Risk register

| Risk                         | Trigger/guardrail                     | Mitigation/rollback                                                            | Owner              | State          |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------------------------------ | ------------------ | -------------- |
| Khách bị đưa vào API private | Companion không phải API thử guest    | Giữ câu hỏi qua login hoặc đích hỗ trợ guest; không auto-send                  | Kỹ thuật           | Mở             |
| Mất bài/ghi đè tiến độ       | Hai tab, timeout sau server commit    | Version/idempotency và test trước S09; rollback UI giữ dữ liệu                 | Kỹ thuật           | Mở             |
| AI trở thành authority       | Click/AI text tăng completion/mastery | Domain evidence; chưa đo thì ghi chưa đo                                       | Kỹ thuật + môn học | Mở             |
| Spec cũ không khớp main      | #919 thêm guest sau audit             | Reconcile từng vòng từ main                                                    | Agent chính        | Đang kiểm soát |
| Merge tự phát hành           | Workflow deploy main                  | Chờ quyền merge/deploy rõ ràng, PR sẵn review trước khi hỏi                    | Agent chính        | Mở             |
| Đẹp nhưng không học tốt      | Chỉ review screenshot                 | Phiên tiếng Anh/Toán, mục lục khóa lập trình, test gián đoạn và thử người dùng | Thiết kế + môn học | Mở             |

## 5. Current truth

- Commit main đã reconcile: `45195feb` (#919). Guest browsing/local progress/trial AI đã có; không bắt login để đọc/học nội dung.
- Goal gap hiện tại: mới có spec nền; chưa có prototype sáu màn, source, regression gate hoặc metric mới.
- Baseline audit ngày 15/09 ở `80c2b416`: expert review frontend local, auth giả, API lỗi chủ động, Node26; 16 trạng thái không tràn ngang không chứng minh toàn bộ catalog/theme/production.
- Blocker/câu hỏi mở: technical review spec; handoff guest gắn owner cần nghiệm thu; việc thay chính sách khóa zoom cần ghi quyết định rõ; spec S04–S13 còn thiếu.
- Next best slice: S02 sau S01 approved/merged; loại lời giải viết sẵn vì tác động trực tiếp niềm tin học tập.
- Quyền cần thêm: merge/deploy (main có tự deploy). Không coi yêu cầu tạo PR là đã cho phép phát hành.

## 6. Iteration log

### Iteration 1 — 2026-09-15

- State: SPEC.
- Slice: S01.
- Goal gap trước/sau: kế hoạch ngoài repo → goal/spec trong repo; trải nghiệm chưa đổi.
- Research/spec/issue/PR: spec nền liên kết ở trên; issue chưa tạo; PR [#920](https://github.com/seeker19110/donghanh/pull/920), đang chờ CI và quyền merge/phát hành.
- Thay đổi: 3 tài liệu; không source, schema hay dependencies.
- Validation và test count: Node22.23.2 Prettier check ba file PASS; git diff --check PASS. Không chạy runtime test cho docs-only; không reuse test count cũ.
- Metric/guardrail: chưa đo metric sản phẩm; giữ toàn bộ bất biến và guest mode.
- Quyết định: tuần tự một agent/PR; technical review riêng với phê duyệt hướng sản phẩm.
- Blocker: chờ merge spec; review S03 trở đi chưa hoàn tất.
- Next best slice: S02.
- Quyền cần thêm: merge/deploy trước khi tích hợp vào main.

## 7. Final audit

- [ ] Mọi Goal AC có bằng chứng trên main.
- [ ] Metrics đạt, guardrails không suy giảm.
- [ ] Không còn milestone bắt buộc/blocker cao/migration dang dở.
- [ ] Regression/security/privacy/a11y/operational gates xanh.
- [ ] Production verification hoàn tất nếu được mở rộng quyền/scope.
- [ ] Docs/runbook/telemetry/rollback cập nhật.
- [ ] Residual risks và out-of-scope được ghi rõ.
- [ ] Owner xác nhận completion.

**Kết luận:** NOT COMPLETE  
**Người xác nhận:** chưa có  
**Ngày:** 2026-09-15
