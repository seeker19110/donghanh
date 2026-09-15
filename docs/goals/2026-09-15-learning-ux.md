# Goal: Học tập liền mạch, có bằng chứng và giao diện xuất sắc

| Thuộc tính        | Giá trị                                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| Goal ID           | GOAL-2026-0915-LEARNING-UX                                                                                           |
| Owner             | Chủ sản phẩm Đồng Hành; agent chính điều phối và review                                                              |
| Trạng thái        | IMPLEMENT — S02 (#921) và S03-1 (#922) đã merge, S03-2 (#923) chờ CI                                                 |
| Bắt đầu           | 2026-09-15                                                                                                           |
| Target review     | Sau mỗi slice; chưa cam kết ngày phát hành toàn bộ                                                                   |
| Quyền được cấp    | Triển khai tuần tự, mỗi slice một PR. **15/09: người dùng cho phép merge #921 và #922 khi CI xanh** (main tự deploy) |
| Budget/guardrails | Một outcome/PR/agent; tối đa 3 lần sửa cùng lỗi; không paid provider, production data hoặc secrets trong test        |

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

| ID    | Outcome/AC                                 | Dependency          | Spec                                                 | Issue    | PR                                                       | State   | Evidence                                                                     |
| ----- | ------------------------------------------ | ------------------- | ---------------------------------------------------- | -------- | -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------- |
| S01   | Đặc tả, baseline và ma trận nghiệm thu     | main hiện tại       | [Nền](../specs/2026-09-15-learning-ux-foundation.md) | Chưa tạo | [#920](https://github.com/seeker19110/donghanh/pull/920) | MERGED  | Đã vào main tại `46e7b54`                                                    |
| S02   | Hỏi nhanh trung thực, giữ câu hỏi/ngữ cảnh | S01 merged/approved | Nền §④ A                                             | Chưa tạo | [#921](https://github.com/seeker19110/donghanh/pull/921) | MERGED  | [0319](../changelog/0319-2026-09-15-hoi-nhanh-trung-thuc.md), main `2719790` |
| S03-1 | Subjects: lỗi tải nói thật, chống race     | S02                 | Nền §④ B (nhóm 1/3)                                  | Chưa tạo | [#922](https://github.com/seeker19110/donghanh/pull/922) | MERGED  | [0320](../changelog/0320-2026-09-15-danh-muc-mon-hoc-trang-thai-loi.md)      |
| S03-2 | Dialog/bố cục mobile                       | S03-1               | Nền §④ B (nhóm 2/3)                                  | Chưa tạo | [#923](https://github.com/seeker19110/donghanh/pull/923) | PR      | [0321](../changelog/0321-2026-09-15-bo-cuc-mobile-khong-bi-thanh-nav-che.md) |
| S03-3 | Renderer an toàn                           | S03-2               | Nền §④ B (nhóm 3/3) — cần review riêng               | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |
| S04   | Tokens và thành phần sáu màn mẫu           | S03-3               | Cần spec nhỏ + prototype                             | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |
| S05   | Bắt đầu theo ý định, thống nhất hub        | S04                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |
| S06   | Hôm nay, điểm học tiếp                     | S05                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |
| S07   | Mục lục môn/khóa độc lập shellbar          | S06                 | Nền §④ C + adapter spec                              | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |
| S08   | Khung phiên, nháp/resume cùng thiết bị     | S07                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |
| S09   | Đồng bộ version/retry/xung đột             | S08                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |
| S10   | Trợ giảng trong bài, voice thật            | S09                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |
| S11   | Completion evidence và kết quả             | S10                 | Cần spec nhỏ từng hoạt động                          | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |
| S12   | Ôn lại/sổ lỗi/tiến độ có bằng chứng        | S11                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |
| S13   | Responsive/theme/hiệu năng/rollout         | S12                 | Cần spec nhỏ                                         | Chưa tạo | —                                                        | BACKLOG | Chưa có                                                                      |

## 4. Risk register

| Risk                         | Trigger/guardrail                     | Mitigation/rollback                                                            | Owner              | State          |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------------------------------ | ------------------ | -------------- |
| Khách bị đưa vào API private | Companion không phải API thử guest    | Giữ câu hỏi qua login hoặc đích hỗ trợ guest; không auto-send                  | Kỹ thuật           | Mở             |
| Mất bài/ghi đè tiến độ       | Hai tab, timeout sau server commit    | Version/idempotency và test trước S09; rollback UI giữ dữ liệu                 | Kỹ thuật           | Mở             |
| AI trở thành authority       | Click/AI text tăng completion/mastery | Domain evidence; chưa đo thì ghi chưa đo                                       | Kỹ thuật + môn học | Mở             |
| Spec cũ không khớp main      | #919 thêm guest sau audit             | Reconcile từng vòng từ main                                                    | Agent chính        | Đang kiểm soát |
| Merge tự phát hành           | Workflow deploy main                  | 15/09 người dùng cấp quyền merge cho #921 + #922; slice sau vẫn phải hỏi lại   | Agent chính        | Đang kiểm soát |
| Đẹp nhưng không học tốt      | Chỉ review screenshot                 | Phiên tiếng Anh/Toán, mục lục khóa lập trình, test gián đoạn và thử người dùng | Thiết kế + môn học | Mở             |

## 5. Current truth

- Commit main đã reconcile: `45195feb` (#919). Guest browsing/local progress/trial AI đã có; không bắt login để đọc/học nội dung.
- Goal gap hiện tại: ba slice nguồn đầu tiên (S02, S03-1, S03-2) đã có mã thật và cổng canh; chưa có prototype sáu màn, chưa có metric sản phẩm nào được đo.
- Baseline audit ngày 15/09 ở `80c2b416`: expert review frontend local, auth giả, API lỗi chủ động, Node26; 16 trạng thái không tràn ngang không chứng minh toàn bộ catalog/theme/production.
- Blocker/câu hỏi mở: technical review spec; handoff guest gắn owner cần nghiệm thu; việc thay chính sách khóa zoom cần ghi quyết định rõ; spec S04–S13 còn thiếu.
- Next best slice: S03-3 (renderer an toàn) — đặc tả §④ B gạch 5 đòi review dependency/bundle RIÊNG trước khi cài parser mới, nên slice này bắt đầu bằng review chứ không bằng mã.
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

### Iteration 2 — 2026-09-15

- State: IMPLEMENT.
- Slice: S03-1 (PR #922), sau khi S02 (#921) merge vào `main`.
- Goal gap trước/sau: `/mon-hoc` biến mọi lỗi tải thành màn hình "chưa có môn học nào" → lỗi tải
  nay nói đúng chuyện đã xảy ra, thử lại được, và response cũ không ghi đè bộ lọc đang chọn.
- Research/spec/issue/PR: đặc tả nền §④ B nhóm 1/3; issue chưa tạo; PR
  [#922](https://github.com/seeker19110/donghanh/pull/922).
- Thay đổi: 3 file source + 2 file test mới + 1 changelog. Không schema, migration hay dependency.
- Validation và test count: Node22.22.2 — build/typecheck/lint/format PASS;
  `npm run test:coverage` 605 file / 12493 test PASS; `e2e/subjects-catalog-states.spec.ts` 14/14.
  Bằng chứng test bắt được lỗi cũ: trả `Subjects.tsx` về bản `main` → 6/8 ca đỏ.
- Metric/guardrail: chưa đo metric sản phẩm. `/api/subjects` giữ nguyên là endpoint công khai,
  không thêm auth; không đụng billing/entitlement/mastery/hạn mức khách; a11y AA + AAA có thêm
  màn lỗi vào cổng, 5 theme.
- Quyết định: tách S03 làm ba slice. Prop `hint` của `LoadError` là thay đổi thuần bổ sung, mặc
  định giữ đúng chữ cũ cho 8 nơi đang dùng.
- Blocker: không có.
- Next best slice: S03-2.
- Quyền cần thêm: người dùng đã cho phép merge #921 và #922 khi CI xanh (phiên 15/09).

### Iteration 4 — 2026-09-15

- State: IMPLEMENT.
- Slice: S03-2 — bố cục mobile không bị thanh điều hướng đáy che (PR #923), sau khi #922 merge.
- Goal gap trước/sau: AC §④ B gạch 2 (390×844 và 320px) KHÔNG có phép đo nào canh → có cổng
  `e2e/mobile-layout-guards.spec.ts` (6 test) và 7 file được sửa lề dưới.
- Thay đổi: 7 file source (mỗi file một lớp CSS + chú thích lý do), 1 file E2E mới. Không schema,
  migration, dependency, không đụng billing/entitlement/guest limits.
- Validation: cổng viết trước → 6/6 ĐỎ trên mã cũ, liệt kê đúng 6 mục cần sửa; sau khi sửa 6/6
  xanh. Ảnh 1440/390/320 trước-sau; ảnh 1440px giống hệt từng điểm ảnh (md5) nên desktop không
  bị chạm. Chạy lại toàn bộ cổng a11y vì bản sửa tăng lề dưới ở 4 trang trụ — đúng thao tác từng
  gây 3 vi phạm `target-size` ở Companion.tsx.
- Metric/guardrail: chưa đo metric sản phẩm. Guardrail: desktop bất biến (bằng chứng md5 ảnh
  1440px); `--bnav-h` đã bằng 0 từ 1024px nên bản sửa là thay đổi thuần mobile.
- Quyết định: cổng dùng HAI phép đo (bất biến lề — không phụ thuộc nội dung; bấm được thật —
  `elementFromPoint`), vì phép đo hành vi một mình đã báo nhầm 4 trang trụ là "sạch" khi dữ liệu
  mock còn ngắn. `/dong-hanh` là ngoại lệ có chủ đích, ghi lý do đo được ngay trong cổng.
- Phát hiện ngoài dự kiến: phần lớn AC gạch 1–2 đã đạt sẵn (15 hộp thoại sạch ở cả hai bề rộng,
  6 hành vi bàn phím có unit test đủ, không còn overlay cũ sau #921) — ghi vào changelog 0321 để
  đợt sau khỏi đo lại. Lỗi thật nằm ở chỗ không ai ngờ: nút CTA của trang landing.
- Nợ mới ghi nhận: `Landing.tsx`/`LandingEn.tsx` thiếu `id={MAIN_CONTENT_ID}` nên liên kết "Bỏ
  qua tới nội dung chính" đứt lặng lẽ ở hai trang đó. Khác họ lỗi, chưa sửa.
- Blocker: không.
- Next best slice: S03-3 (renderer an toàn) — bắt đầu bằng review dependency, không bằng mã.

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
