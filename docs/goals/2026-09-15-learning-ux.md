# Goal: Học tập liền mạch, có bằng chứng và giao diện xuất sắc

| Thuộc tính        | Giá trị                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| Goal ID           | GOAL-2026-0915-LEARNING-UX                                                                                    |
| Owner             | Chủ sản phẩm Đồng Hành; agent chính điều phối và review                                                       |
| Trạng thái        | SPEC — #920–#924 đã merge; ưu tiên kiến trúc Góc học tập (0S)                                                 |
| Bắt đầu           | 2026-09-15                                                                                                    |
| Target review     | Sau mỗi slice; chưa cam kết ngày phát hành toàn bộ                                                            |
| Quyền được cấp    | Triển khai tuần tự, mỗi subagent một PR; người dùng đã cấp quyền auto-merge và deployment khi các check đạt   |
| Budget/guardrails | Một outcome/PR/agent; tối đa 3 lần sửa cùng lỗi; không paid provider, production data hoặc secrets trong test |

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

- Góc học tập `/goc-hoc-tap`, tiếng Anh là môn; link và dữ liệu cũ được bảo toàn.
- Tin cậy hỏi nhanh; lỗi/dialog/renderer; onboarding theo ý định; Hôm nay; mục lục môn và khóa trong vùng nội dung.
- Phiên học, resume, đồng bộ có version, trợ giảng, kết quả và ôn lại có bằng chứng; nâng thị giác trên token hiện có.

### Không làm

- Viết lại payment/auth/guest mode, nâng 3D/WebGL, thay font toàn app hoặc hứa AI trả lời đúng tuyệt đối.
- Merge/deploy, sửa production hay dùng provider có phí khi chưa có quyền tương ứng.

## 3. Milestones và slices

Các mã S giữ liên kết kế hoạch cũ; thứ tự mới ưu tiên 0S → 01–04 → S07 trước S05/S06. S05–S13 đã có đặc tả riêng (2026-09-15, changelog 0328), đều **Approved for implementation** từ 2026-09-15 (chủ dự án chốt toàn bộ §7 theo đề xuất mặc định) → READY; S04 đi cùng từng slice. Làm tuần tự; mỗi PR giao một subagent và agent chính review diff/gate.

| ID  | Outcome/AC | Dependency | Spec | Issue | PR  | State | Evidence |
| --- | ---------- | ---------- | ---- | ----- | --- | ----- | -------- |

| S01 | Đặc tả, baseline và ma trận nghiệm thu | main hiện tại | [Nền](../specs/2026-09-15-learning-ux-foundation.md) | Chưa tạo | [#920](https://github.com/seeker19110/donghanh/pull/920) | MERGED | Đã vào main tại `46e7b54` |
| S02 | Hỏi nhanh trung thực, giữ câu hỏi/ngữ cảnh | S01 merged/approved | Nền §④ A | Chưa tạo | [#921](https://github.com/seeker19110/donghanh/pull/921) | MERGED | [0319](../changelog/0319-2026-09-15-hoi-nhanh-trung-thuc.md), main `2719790` |
| S03-1 | Subjects: lỗi tải nói thật, chống race | S02 | Nền §④ B (nhóm 1/3) | Chưa tạo | [#922](https://github.com/seeker19110/donghanh/pull/922) | MERGED | [0320](../changelog/0320-2026-09-15-danh-muc-mon-hoc-trang-thai-loi.md) |
| S03-2 | Dialog/bố cục mobile | S03-1 | Nền §④ B (nhóm 2/3) | Chưa tạo | [#923](https://github.com/seeker19110/donghanh/pull/923) | MERGED | [0321](../changelog/0321-2026-09-15-bo-cuc-mobile-khong-bi-thanh-nav-che.md) |
| S03-3 | Markdown/code; toán còn thiếu | S03-2 | Nền §④ B | Chưa tạo | [#924](https://github.com/seeker19110/donghanh/pull/924) | PARTIAL | main `f5beb7a1`; parser toán cần spec riêng |
| S04 | Tokens và thành phần sáu màn mẫu | Đi cùng từng slice | Cần spec nhỏ + prototype | Chưa tạo | — | BACKLOG | Chưa có |
| S05 | Bắt đầu theo ý định, thống nhất hub | S06 + spec | [S05](../specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md) (Approved for implementation) | S05-1 [#939](https://github.com/seeker19110/donghanh/pull/939) · S05-2 [#953](https://github.com/seeker19110/donghanh/pull/953) | changelog `0334` (S05-1) · `0342` (S05-2) · migration `0082` · chunk 5,38 kB gzip | S05-1 MERGED · S05-2 PR mở, chờ CI | Chốt §7 theo mặc định 2026-09-15; migration lấy số `0082` theo thứ tự merge thật (`0081` đã bị S11 chiếm); S05-2 hợp nhất danh mục môn hub+app qua `SUBJECT_ENTRIES` |
| S06 | Hôm nay, điểm học tiếp | S08 + spec | [S06](../specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md) (Approved for implementation) | Chưa tạo | — | READY | Chốt §7 theo mặc định 2026-09-15; nguồn "Học tiếp": `listResumableSessions` (`apps/dhcb/src/lib/learningSession.ts`, S08-1) |
| S06-1 | Hợp đồng `TodayPlan` + resolver Hôm nay | S07-1 + S08-1 | [S06](../specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md) (Approved for implementation) | Chưa tạo | — | DONE | [0337](../changelog/0337-2026-09-16-s06-1-hop-dong-today-plan-va-resolver.md) — 0 đổi giao diện |
| S06-2 | Thẻ "Hôm nay" ở Trang chủ (một CTA) | S06-1 | [S06](../specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md) (Approved for implementation) | [#952](https://github.com/seeker19110/donghanh/pull/952) | E2E `today-plan` 5/5 · a11y 347/347 · ảnh 4 bề rộng × 3 trạng thái | MERGED | [0338](../changelog/0338-2026-09-16-s06-2-the-hom-nay-o-trang-chu.md) — bỏ hai lối `/lo-trinh-hoc` hard-code |
| S06-3 | Trang môn dùng chung resolver "học tiếp" | S06-2 | [S06](../specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md) (Approved for implementation) | [#964](https://github.com/seeker19110/donghanh/pull/964) | E2E 43/43 (thêm 2 ca đa môn) · a11y 472/472 · coverage 94,28/90,18/94,79/94,79 · ảnh 1440/390/320 trước-sau trùng kích thước | REVIEW | [0348](../changelog/0348-2026-09-16-s06-3-trang-mon-dung-chung-resolver.md) — `pickNextLesson` không còn trong `pages/`; `CefrLevelPage:621` giữ `findNextStep` (cách dùng khác, có lý do đo được); sửa `dongNguon` nuốt tên môn thứ hai |
| S07-1 | Hợp đồng `OutlineNode` + adapter 3 môn | 02–04 đã merge (#929) | [S07](../specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md) (Approved for implementation) | Chưa tạo | [#933](https://github.com/seeker19110/donghanh/pull/933) | DONE | [0330](../changelog/0330-2026-09-15-s07-1-hop-dong-muc-luc-va-adapter.md) |
| S07-2 | Rail/panel mục lục Lập trình + STEM | S07-1 | [S07](../specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md) (Approved for implementation) | Chưa tạo | — | DONE | [0335](../changelog/0335-2026-09-15-s07-2-muc-luc-mon-khoa-lap-trinh-stem.md) |
| S07-3 | Mục lục cấp CEFR môn Tiếng Anh | S07-2 | [S07](../specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md) (Approved for implementation) | Chưa tạo | [#960](https://github.com/seeker19110/donghanh/pull/960) | DONE | [0342](../changelog/0342-2026-09-16-s07-3-muc-luc-cap-cefr.md) — `?unit=&hd=` + `activeNodeId` |
| S08-1 | Khung phiên `LearningSession` + hook | — (merge độc lập) | [S08](../specs/2026-09-15-learning-ux-s08-khung-phien-resume.md) (Approved for implementation) | Chưa tạo | [#932](https://github.com/seeker19110/donghanh/pull/932) | DONE | [0331](../changelog/0331-2026-09-15-s08-1-khung-phien-hoc.md) — 0 đổi giao diện |
| S08-2 | Nháp/bước bài Lập trình sống qua reload | S08-1 + S07-2 | [S08](../specs/2026-09-15-learning-ux-s08-khung-phien-resume.md) (Approved for implementation) | Chưa tạo | [#961](https://github.com/seeker19110/donghanh/pull/961) | DONE | [0343](../changelog/0343-2026-09-16-s08-2-nhap-bai-lap-trinh.md) — hook thêm `paused`; ảnh Tầng 8b bắt lỗi nền dính `Modal` che dòng đầu |
| S08-3 | Resume STEM (phần tab học CEFR hoãn) | S08-1 | [S08](../specs/2026-09-15-learning-ux-s08-khung-phien-resume.md) (Approved for implementation) | [#962](https://github.com/seeker19110/donghanh/pull/962) | E2E `learning-session-resume-stem` 3/3 · a11y 455/455 · `StemLesson.test.tsx` 14 ca · ảnh 1440/390/320 trước-sau | REVIEW | [0347](../changelog/0347-2026-09-16-s08-3-resume-tu-kiem-tra-stem.md) — AC-18/AC-19 (tab học CEFR) TÁCH sang PR sau: lúc thi hành, nhánh S07-3 đổi 207 dòng đúng vùng `tab`/màn con của `CefrLevelPage.tsx` |
| S09-1 | Version đơn điệu + idempotency (server) | — (merge độc lập) | [S09](../specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md) §9 mục 1 (AC-1…AC-7) | Chưa tạo | [#940](https://github.com/seeker19110/donghanh/pull/940) | REVIEW | [0334](../changelog/0334-2026-09-15-s09-1-version-idempotency-dong-bo.md) — migration 0083, 0 đổi giao diện |
| S09-2 | Outbox client: retry, gộp, hai tab, hết auth | S09-1 | [S09](../specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md) §9 mục 2 (AC-8…AC-17) | Chưa tạo | — | READY | Sau S09-1 merge; sửa F1/F4/F5 (mất tiến độ offline) |
| S09-3 | ConflictRecord + hộp thoại hỏi người học | S09-1 + S08 endpoint nháp | [S09](../specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md) §9 mục 3 (AC-18…AC-20) | Chưa tạo | — | BLOCKED | Chờ S08 quyết đẩy nháp lên server (Q5) |
| S10-1 | Sửa 6 lỗi lifecycle voice/AI trước | — (merge độc lập) | [S10](../specs/2026-09-15-learning-ux-s10-tro-giang-trong-bai-voice.md) §④ Phần 1 (AC-1…AC-6) | Chưa tạo | [#934](https://github.com/seeker19110/donghanh/pull/934) | DONE | [0332](../changelog/0332-2026-09-15-s10-1-sua-lifecycle-companion.md) — 8 ca đỏ trước / xanh sau |
| S10-2 | Trợ giảng trong bài (chữ) | S10-1 + S07-2 (3 trang bài) | [S10](../specs/2026-09-15-learning-ux-s10-tro-giang-trong-bai-voice.md) (Approved for implementation) | Chưa tạo | — | READY | Chờ S07-2 merge (cùng 3 trang bài) |
| S10-3 | Voice thật trong bài | S10-2 | [S10](../specs/2026-09-15-learning-ux-s10-tro-giang-trong-bai-voice.md) (Approved for implementation) | Chưa tạo | — | READY | Sau S10-2 |
| S11 | Completion evidence và kết quả | S08 + domain spec | [S11](../specs/2026-09-15-learning-ux-s11-completion-evidence.md) (Approved for implementation) | Chưa tạo | S11-1: changelog 0333 · S11-2 [#964](https://github.com/seeker19110/donghanh/pull/964) | PARTIAL | S11-1 nền tảng (hợp đồng + migration 0081 + `POST /api/learning/evidence`) — [0333](../changelog/0333-2026-09-15-s11-1-completion-evidence-nen-tang.md); S11-2 client STEM + khách + hàng đợi — [0348](../changelog/0348-2026-09-16-s11-2-evidence-stem-client.md); S11-3 chờ S07-2 |
| S12-1 | Hàng đợi ôn xuyên môn + thẻ SRS STEM + hub | S07-1 | [S12](../specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md) §9 mục 1 (Approved for implementation) | Chưa tạo | [#951](https://github.com/seeker19110/donghanh/pull/951) | IN REVIEW | [0341](../changelog/0341-2026-09-16-s12-1-hang-doi-on-xuyen-mon.md) — golden snapshot SRS chụp ở commit đầu; nhóm STEM chưa có thẻ tới khi S11-3 gọi `addStemLessonCardsToSrs` |
| S12-2/3 | Sổ lỗi có bằng chứng · tiến độ theo môn | S12-1 + S11 | [S12](../specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md) (Approved for implementation) | Chưa tạo | — | READY | Chốt §7 theo mặc định 2026-09-15 |
| S13 | Responsive/theme/hiệu năng/rollout | S12 | [S13](../specs/2026-09-15-learning-ux-s13-responsive-theme-hieu-nang-rollout.md) (Approved for implementation) | Chưa tạo | — | READY | Chốt §7 theo mặc định 2026-09-15 |

### Chặng tái cấu trúc ưu tiên

| ID  | Outcome                                 | Dependency              | State    | Spec / bằng chứng                                                                      |
| --- | --------------------------------------- | ----------------------- | -------- | -------------------------------------------------------------------------------------- |
| 0S  | Đặc tả kiến trúc và reconcile goal      | main f5beb7a1           | REVIEWED | [Spec 0S](../specs/2026-09-15-goc-hoc-tap-architecture.md), root approve 01; chờ merge |
| 01  | Đổi tên/route Góc học tập               | 0S merge                | WAITING  | Spec 0S Approved chỉ 01                                                                |
| 02  | English ngang hàng môn, bỏ studio riêng | 01 + spec bổ sung merge | BACKLOG  | Inventory route/host/auth/storage trước source                                         |
| 03  | Công cụ English trong môn               | 02 + spec bổ sung merge | BACKLOG  | Inventory component/API/context                                                        |
| 04  | Platform không default English          | 03 + spec bổ sung merge | BACKLOG  | Hợp đồng thiếu context và legacy adapter                                               |

## 4. Risk register

| Risk                         | Trigger/guardrail                     | Mitigation/rollback                                                                       | Owner              | State          |
| ---------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------ | -------------- |
| Khách bị đưa vào API private | Companion không phải API thử guest    | Giữ câu hỏi qua login hoặc đích hỗ trợ guest; không auto-send                             | Kỹ thuật           | Mở             |
| Mất bài/ghi đè tiến độ       | Hai tab, timeout sau server commit    | Version/idempotency và test trước S09; rollback UI giữ dữ liệu                            | Kỹ thuật           | Mở             |
| AI trở thành authority       | Click/AI text tăng completion/mastery | Domain evidence; chưa đo thì ghi chưa đo                                                  | Kỹ thuật + môn học | Mở             |
| Spec cũ không khớp main      | #919 thêm guest sau audit             | Reconcile từng vòng từ main                                                               | Agent chính        | Đang kiểm soát |
| Merge tự phát hành           | Workflow deploy main                  | Quyền auto-merge/deploy đã cấp; chỉ merge khi review/checks đạt, kiểm tra deploy mỗi vòng | Agent chính        | Đang kiểm soát |
| Đẹp nhưng không học tốt      | Chỉ review screenshot                 | Phiên tiếng Anh/Toán, mục lục khóa lập trình, test gián đoạn và thử người dùng            | Thiết kế + môn học | Mở             |

## 5. Current truth

- Main đã đối chiếu: `f5beb7a1d7d044232b686301e1cb2b0010535a65` (#924). #920–#924 đã merge; [deploy thành công](https://github.com/seeker19110/donghanh/actions/runs/34946596471).
- Markdown/code, lỗi SubjectDetail và skip link landing đã sửa #924. Công thức toán còn thiếu; StrictMode nạp lịch sử Companion và nhãn animation mobile còn mở trong PROGRESS.
- Quyết định mới: **Góc học tập `/goc-hoc-tap`**, tiếng Anh ngang hàng môn học, không còn là không gian platform; giữ dữ liệu và link cũ. [Spec 0S](../specs/2026-09-15-goc-hoc-tap-architecture.md) đã được root review cho 01, hiệu lực sau merge; 02–04 cần spec bổ sung.
- Thứ tự: 0S → 01 đổi route/nhãn → 02 tích hợp English → 03 công cụ theo môn → 04 bỏ default English → S07 mục lục (lập trình, STEM, English) → S08 resume → S06/S05 Home/onboarding → S10 tutor/voice (sửa lifecycle trước) → S11 completion → S09 sync → S12 ôn tập → S13 final audit. S04 thiết kế đi cùng từng slice. Renderer toán không bị bỏ khỏi backlog.
- Next best slice: merge 0S đã review, rồi 01. Không source trước spec Approved và merge.
- Quyền cần thêm: không cần hỏi lại cho push/auto-merge/deploy trong phạm vi đã cấp. Không có quyền dùng secrets/paid provider/production data trong test hoặc đổi DNS.
- Goal gap: chưa có mục lục toàn catalog, continuity/evidence chưa hoàn chỉnh, chưa đo metric sản phẩm. Audit ở `80c2b416` chỉ là frontend local mock, không chứng minh production.

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

### Iteration 5 — 2026-09-15 — reconcile và kiến trúc mới

- State: SPEC; slice 0S; base `f5beb7a1`.
- Cập nhật current truth theo #923/#924; giữ iteration log cũ là lịch sử quyền tại thời điểm đó, không phải yêu cầu xin lại quyền hiện nay.
- Quyết định: canonical path `/goc-hoc-tap`, host theo cấu hình sẵn; giữ origin hoạt động và key dữ liệu. Không đổi DNS, không gom hoạt động qua origin khi chưa có spec.
- Bằng chứng: docs-only, validation ghi trong changelog 0323; chưa có test runtime mới hoặc metric mới.
- Next: 01 sau review/merge spec; 02–04 cần discovery/spec bổ sung.

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
