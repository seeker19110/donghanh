# Goal: Nâng cấp UI/UX và độ tin cậy sư phạm

| Thuộc tính        | Giá trị                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| Goal ID           | GOAL-2026-0923-UIUX-PEDAGOGY                                                                                     |
| Owner             | Chủ sản phẩm Đồng Hành; agent phụ trách kế hoạch và bằng chứng kỹ thuật                                          |
| Trạng thái        | WAITING — S01 full gate local đạt, đang mở PR để review/CI                                                       |
| Bắt đầu           | 2026-09-23                                                                                                       |
| Target review     | Sau từng slice; tổng lịch được ước lượng lại sau M1                                                              |
| Quyền được cấp    | Lập kế hoạch, tự quyết phương án và triển khai local, push và mở PR đã được cho phép; chưa có quyền merge/deploy |
| Budget/guardrails | Một outcome/PR; tối đa 3 lần sửa cùng lỗi; 0 paid provider trong test; không production data/secrets             |

## 1. Outcome và Definition of Goal Complete

Người học vào đúng môn, học đúng ngôn ngữ, làm câu hỏi hợp lệ, hiểu phản hồi, sửa được
lỗi và biết chính xác bài/kết quả đã lưu hay chưa. Các luồng này dùng được trên mobile,
bàn phím và công nghệ hỗ trợ.

Kế hoạch tiếp nối [Learning UX 15/09](2026-09-15-learning-ux.md) và các spec UI clarity;
tái sử dụng hạ tầng đã có. Không kế thừa quyền merge/approval hay checklist hoàn thành
của goal cũ. Không sửa lại trạng thái lịch sử khi chưa đối chiếu bằng chứng.

### Metric baseline → target

| Tiêu chí           | Baseline đã biết                                            | Đích nghiệm thu                                                                                                                            |
| ------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Lỗi audit F1–F8    | 8 phát hiện ở SHA 1d9e247e                                  | 8/8 được sửa và có test hồi quy tương ứng trên main                                                                                        |
| Phục hồi tải/lưu   | Placement mất mạng kẹt; hàm lưu nuốt lỗi                    | Mọi ca timeout/offline/HTTP lỗi có kết thúc pending, giữ dữ liệu và retry hữu hạn; không xác nhận lưu sai                                  |
| Môn và ngôn ngữ    | Thẻ Hóa trong màn Lý; isA gắn UI language                   | 0 sai môn ở hàng đợi có cap; 4 tổ hợp UI language × direction đúng độc lập                                                                 |
| Câu hỏi điền từ    | Có ứng viên không tạo được chỗ trống                        | 100% câu được phát có đúng 1 vị trí trống, đáp án theo câu và lựa chọn phân biệt; báo rõ khi thiếu câu hợp lệ                              |
| Accessibility      | 18/18 meta-viewport; contrast incomplete; gate AAA lọt span | 0 vi phạm A/AA trong ma trận; 100% incomplete có kết luận kiểm chứng; nội dung/tiêu đề ≥7:1 theo quy định dự án                            |
| Điều hướng bài dài | Bài mẫu mobile 4.469px; kết quả 6.053px                     | Tới phần học/tự kiểm/kết quả trong ≤2 thao tác; focus không bị thanh cố định che                                                           |
| Usability          | Chưa có baseline người học thật                             | Pilot tối thiểu 8 người lớn, ≥90% lượt làm nhiệm vụ cốt lõi hoàn tất không cần hướng dẫn; báo số tuyệt đối và lỗi, không suy rộng thống kê |
| Hiệu quả học       | Chưa đo                                                     | Có đánh giá trì hoãn ngày 7/14 và báo cáo giới hạn; chưa đặt KPI tăng điểm khi chưa có baseline                                            |

Cửa sổ đo: từng PR cho correctness/a11y; M5 cho usability; ngày 7/14 tính từ phiên
pilot đầu của từng người. Pilot với người thật chỉ bắt đầu khi có người tham gia tự
nguyện và môi trường được phép sử dụng. Nếu chưa có, trạng thái phần đó là WAITING,
không thay bằng dữ liệu giả và không tuyên bố Goal Complete.

Goal Complete yêu cầu M1–M5 đạt, evidence trên main, không còn lỗi chặn học/sai trạng
thái lưu, và chủ sản phẩm xác nhận nghiệm thu. Bản kế hoạch hoàn tất không đồng nghĩa
goal hoàn tất. Phát hành production là hoạt động riêng sau khi được cho phép.

## 2. Scope và quyết định thiết kế

### Quyết định đã chọn trong kế hoạch

1. **Cho phép zoom.** Bỏ ngoại lệ khóa zoom cũ; kiểm 200% và reflow 320 CSS px,
   bàn phím ảo, sticky header và thanh điều hướng. Giữ chống iOS tự zoom ô nhập
   bằng cỡ chữ thích hợp, không cấm người dùng chủ động phóng to.
2. **Tách ba khái niệm:** ngôn ngữ nhãn UI, ngôn ngữ đích, ngôn ngữ giải thích.
   Đổi nhãn UI không tự đổi chiều học; dùng cấu hình hướng học hiện có.
3. **Trạng thái lưu phải trung thực:** đang lưu / đã lưu / chưa lưu, có retry;
   kết quả làm bài không bị xóa khi lỗi mạng. Không dùng cache làm bằng chứng server đã lưu.
4. **Câu hỏi phải được kiểm tra trước khi phát.** Dùng đáp án trong ngữ cảnh,
   không suy từ cả chuỗi nghĩa từ điển. Tạm loại ứng viên không xác định chắc;
   câu thiếu được bù từ tập hợp lệ, thiếu tập thì báo rõ thay vì bịa dữ liệu.
5. **Giữ ba theme và hệ token hiện có.** Chỉnh phân cấp chữ, khoảng cách, focus,
   vùng chạm ở các màn được nâng cấp; không thay framework, font hay token hóa toàn repo.
6. **Một việc học chính mỗi màn.** Mục lục môn và mục lục trong bài có tên/chức năng
   riêng. Lời giải đầy đủ xuất hiện ở nơi phù hợp; bảng kết quả tóm tắt và dẫn về câu.
7. **Phản hồi theo mục tiêu và trình độ:** ghi nhận cụ thể → chỉ ra nguyên nhân →
   một hành động sửa/luyện tiếp. Không tự nhồi C1/C2 vào phản hồi A1; người học được
   tự thử trước khi xem đáp án trong chế độ luyện.
8. **Phân biệt luyện tập và đánh giá.** Bài luyện có gợi ý; bài đánh giá theo blueprint
   và quy tắc phản hồi riêng. Chưa đổi thuật toán xếp lớp/chấm điểm khi chưa có evidence.

### Phạm vi

Luồng vào học/onboarding/xếp lớp → bài học → quiz/tự kiểm → phản hồi/kết quả → ôn lại;
English hai chiều, bốn môn STEM và mẫu đại diện lập trình. Rà thêm trạng thái lỗi và
khả năng tiếp cận của nói/viết bằng provider mock.

### Ngoài phạm vi

Thay nền tảng, mở thêm môn, viết lại auth/payment/entitlement, migration mastery,
chấm điểm AI mới, sửa hàng loạt giáo trình bằng AI, chứng nhận CEFR/IELTS, hứa tăng
retention, gamification mở rộng. Không âm thầm mở rộng những mục này khi sửa lỗi UI.

## 3. Milestones và slices

Mỗi S là một PR nhỏ dự kiến; tách thêm nếu impact map cho thấy phạm vi quá lớn.
S00 là PR tài liệu; S01–S12 là 12 slice kỹ thuật/nghiệm thu. Chưa có issue/PR nào
được tạo. S01 đang WAITING sau full gate cục bộ; các slice còn lại chưa triển khai, không phải DONE.

| ID     | Outcome/AC                                                | Dependency    | Spec                                                  | Issue/PR | State    | Evidence cần có                                                                                   |
| ------ | --------------------------------------------------------- | ------------- | ----------------------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------- |
| S00    | Baseline, kế hoạch, liên kết goal cũ                      | main hiện tại | Tài liệu này + baseline                               | —        | RESEARCH | SHA, review kế hoạch và ma trận                                                                   |
| M1/S01 | Placement tải lỗi thoát pending và thử lại được (F1)      | S00           | Đặc tả lỗi nhỏ trước code                             | —        | WAITING  | reject → retry thành công; timeout; unmount; cache không giữ reject                               |
| M1/S02 | Lưu hồ sơ trung thực ở Placement và Onboarding (F2)       | S01           | Hợp đồng kết quả lưu + hai caller                     | —        | BACKLOG  | 500/offline/retry/double-click; local draft còn; chỉ điều hướng sau thành công                    |
| M1/S03 | Ôn đúng môn, cap sau lọc (F6)                             | S00           | Quy tắc hàng đợi hiện có                              | —        | BACKLOG  | Bốn môn, due xen kẽ, cap=1, môn rỗng; hub xuyên môn không hồi quy                                 |
| M1/S04 | UI language độc lập chiều học (F8)                        | S00           | Ma trận ngôn ngữ cho mọi mode Practice                | —        | BACKLOG  | 2×2 tổ hợp; nhãn/audio/câu/đáp án đúng; reload giữ lựa chọn                                       |
| M1/S05 | Bộ tạo câu điền từ hợp lệ (F7)                            | S04           | Contract câu hỏi và chính sách dữ liệu                | —        | BACKLOG  | Dạng từ, dấu Việt, đa nghĩa, từ con, đáp án trùng, pool nhỏ; báo độ phủ trước/sau                 |
| M2/S06 | Gate AAA phản ánh đúng chữ thực và 7:1 (F5)               | S00           | Mở rộng cổng hiện hữu                                 | —        | BACKLOG  | Negative controls span/em/heading, token/nền alpha; mọi incomplete được xử lý                     |
| M2/S07 | Zoom/reflow/focus/44px trên màn bị ảnh hưởng (F3)         | S06           | Quyết định zoom ở §2 + checklist UI                   | —        | BACKLOG  | 320/390/768/1440, ba theme, zoom 200%, reflow, keyboard, dialog, input                            |
| M2/S08 | Quiz có phản hồi đọc/nghe được và focus đúng (F4)         | S06           | Contract hiển thị câu hỏi dùng chung                  | —        | BACKLOG  | Đúng/sai bằng chữ, lựa chọn có ngữ nghĩa; live region không đọc lặp; NVDA/VoiceOver               |
| M3/S09 | Điều hướng trong bài dài; kết quả gọn, sửa sai thuận tiện | M1, M2        | Feature spec mới, tái dùng LessonProse/ActivityResult | —        | BACKLOG  | Prototype và ảnh trước/sau; tới phần cần ≤2 thao tác; giữ nháp/focus/URL                          |
| M4/S10 | Chuẩn phản hồi sư phạm và rubric đánh giá nội dung        | M1, S08       | Feature/content spec riêng                            | —        | BACKLOG  | Luyện/đánh giá tách rõ; ba nhóm trình độ; chuyên gia rà bộ mẫu, không coi AI tự duyệt là evidence |
| M4/S11 | Sau phản hồi có bước thử lại/ôn đúng chỗ                  | S09, S10      | Feature spec nối cơ chế ôn và sổ lỗi hiện có          | —        | BACKLOG  | CTA từ lỗi tới bài/thẻ đúng môn; tự thử trước đáp án; không tự nâng mastery                       |
| M5/S12 | Audit toàn luồng và pilot giáo dục                        | S01–S11       | Kịch bản nghiệm thu + kế hoạch pilot                  | —        | BACKLOG  | Full gate, ma trận a11y, thiết bị thật, usability, báo cáo ngày 7/14                              |

**Thứ tự thực hiện chọn:** S00 → S01 → S02 → S03 → S04 → S05 → S06 → S07 → S08
→ S09 → S10 → S11 → S12. Phát hiện blocker accessibility mới có thể đưa S06–S08 lên sớm.
Không cần tạo agent song song cho kế hoạch; khi thực thi, ưu tiên tuần tự để kiểm soát shared UI.

### Điểm chạm dự kiến và hợp đồng

- S01: `Placement.tsx`, `data/dialoguesLoader.ts`; phân biệt lỗi dữ liệu/tải và kết quả
  đánh giá. Không trả trình độ suy đoán chỉ vì không tải được câu hỏi.
- S02: `lib/cloud.ts`, `pages/core/Onboarding.tsx`, `Placement.tsx`, test liên quan.
  Hàm lưu trả success/error có kiểu; cập nhật mọi caller trong cùng PR, validate response
  theo contract thật. Không đổi schema server nếu không cần. Mất response sau khi server
  đã lưu phải retry an toàn, không tạo thêm tác dụng phụ.
- S03: `StemReview.tsx`, `lib/stemSrs.ts`, `review-hub.spec.ts`; giữ API hàng đợi tổng
  dùng bởi hub, lọc riêng ở đường ôn môn trước limit, không xóa/di chuyển thẻ đã lưu.
- S04–S05: `Practice.tsx`, các mode trong `practice/`, bộ tạo câu hỏi thuần và type liên quan.
  Contract tối thiểu cần ngôn ngữ đích, câu gốc, span đáp án, options và nguồn từ/bài.
  Không dùng LLM runtime để đoán span; dữ liệu bổ sung phải kiểm duyệt, thêm theo batch riêng.
- S06–S08: `e2e/a11y*.spec.ts`, helper hiện có, `ExamQuestionCard`, `QuizTab`,
  `apps/dhcb/index.html`, `src/index.css`, `packages/core-ui/theme.css` nếu đo buộc phải sửa.
  Không tạo cổng a11y song song hoặc miễn trừ mới để làm test xanh.
- S09–S11: màn STEM/English/lập trình mẫu, `ActivityResult`, `FlashcardReview`,
  sổ lỗi/outline hiện có. Chốt spec và chạy codemap trước khi chọn file cụ thể.

Chạy `npm run codemap -- impact <file>` trước sửa hotspot. Những đường dẫn rút gọn
ở trên nằm trong `apps/dhcb/src/`. Chưa chạy impact map cho source vì lượt này chỉ lập kế hoạch.

## 4. Ma trận chất lượng và bằng chứng

### Luồng bắt buộc

1. Onboarding/xếp lớp: bắt đầu, làm bài, tải lỗi, lưu lỗi, retry, quay lại đúng nơi.
2. English: bài → quiz → sửa sai → ôn; hai chiều học × hai ngôn ngữ UI.
3. STEM: một bài có hoạt ảnh và tự kiểm của mỗi môn; hàng đợi hai/bốn môn xen kẽ.
4. Lập trình: bài nhiều bước → nháp → kết quả → mở lại bài/ôn.
5. Nói/viết: mock đang xử lý/lỗi/hết quyền/mất mạng, giữ đầu vào, phương án chữ khi audio lỗi.

Kết hợp 320/390/768/1440px và ba theme cho màn chịu tác động. Năm trạng thái
rỗng/tải/dữ liệu/lỗi/phản hồi phải có evidence hoặc lý do N/A; không gọi toàn bộ
tích số là coverage nếu có trạng thái chưa chạy. Zoom, reduced motion, keyboard,
focus restore và screen reader có test/checklist riêng, không suy từ ảnh.

### Gate mỗi PR

- Node 22 theo AGENTS/CI; dùng npm và lockfile hiện tại. Phiên bản/budget đọc từ mã,
  không dùng con số cũ của skill: hiện `.size-limit.json` là JS 160kB/CSS 26kB brotli.
- Test hồi quy tình huống thật → `npm run build`, `npm run typecheck`, `npm run lint`,
  `npm run format:check`, `npm test`; `npm run test:e2e` cho UI/luồng/API tích hợp.
- Chạy size/budget khi chạm bundle, ảnh trước/sau 390/1440, kiểm 320/768 và theme.
- Cổng mới cần negative control: đưa lỗi biết trước vào fixture phải báo fail,
  bản tốt phải pass. Không skip hoặc hạ ngưỡng khi cổng phát hiện lỗi thật.
- Snapshot không thay thế kiểm tra nội dung: thẻ/câu đúng môn, đáp án hợp lệ,
  trạng thái lưu thật, focus và điều hướng sau tương tác phải được assert.
- Tài liệu-only: Prettier cho file đổi và `git diff --check`.

### Nghiệm thu sư phạm và pilot

S10 lập bộ mẫu có version tối thiểu 40 trường hợp: 12 English (hai chiều × ba nhóm
A1–A2/B1–B2/C1–C2 × đúng/sai), 16 STEM (bốn môn × đúng/sai/thiếu dữ kiện/ngộ nhận),
8 lập trình (bốn loại lỗi × đúng/sai), 4 lỗi hệ thống. Đây là bộ smoke chuyên môn,
không phải chứng minh độ tin cậy khảo thí. Phản hồi phải đúng nội dung, rõ nguyên nhân,
đúng ngôn ngữ/trình độ, và có bước tiếp theo khả thi. Không chấp nhận lỗi sai kiến thức
hoặc feedback biến lỗi mạng thành lỗi học viên; case chưa duyệt phải giữ nhãn chưa duyệt.

M5 pilot với tối thiểu 8 người lớn; tuyển để có người mới, người quay lại và người dùng
công nghệ hỗ trợ. Năm nhiệm vụ/người: vào đúng bài, thử trả lời, hiểu sửa lỗi, ôn đúng môn,
phục hồi lỗi lưu. Đích vận hành ≥36/40 lượt hoàn tất không cần chỉ dẫn, không có mất bài
hoặc xác nhận lưu sai. Đây là ngưỡng nội bộ dự kiến, không phải chuẩn nghiên cứu phổ quát.
Đo thời gian/lỗi/yêu cầu hỗ trợ và phỏng vấn ngắn; ngày 7/14 dùng câu tương đương thay vì
học thuộc đáp án cũ. Chưa tuyển trẻ em trong pilot đầu; chưa khẳng định hiệu quả cho trẻ em.

## 5. Risk register và rollout

| Rủi ro                                       | Trigger/guardrail                 | Giảm thiểu/rollback                                                                     | Owner                          | State |
| -------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------ | ----- |
| Sửa hàm lưu làm onboarding mắc kẹt           | Caller chưa xử lý error/pending   | Cập nhật hai caller cùng PR, giữ draft, thử retry và response thất lạc                  | Agent triển khai               | OPEN  |
| Gate đúng phát hiện nhiều lỗi cũ             | F5 tăng số vi phạm                | Sửa theo nhóm màn và token; không giảm ngưỡng, không giả định trước số PR cần           | Agent triển khai               | OPEN  |
| Loại câu sai khiến pool quá nhỏ              | Thiếu câu hợp lệ chiều B          | Đo coverage, hiển thị thiếu dữ liệu, bổ sung bộ câu được duyệt; không khôi phục câu lỗi | Agent + người duyệt chuyên môn | OPEN  |
| Zoom làm sticky UI che nội dung              | Focus/CTA bị che ở 200%           | Kiểm layout và scroll-margin; sửa cục bộ, không quay lại khóa zoom                      | Agent UI                       | OPEN  |
| Cải thiện hình thức không cải thiện việc học | Pilot không đạt hoặc phản hồi sai | Tái thiết kế slice gây lỗi theo bằng chứng; giữ bản ổn định và nháp                     | Agent + chủ sản phẩm           | OPEN  |
| Thiếu người dùng/chuyên gia/thiết bị thật    | M4/M5 thiếu evidence              | Ghi WAITING, hoàn tất phần kỹ thuật độc lập; không tự bịa kết quả                       | Chủ sản phẩm                   | OPEN  |

Rollout theo PR nhỏ sau quality/e2e; spec tính năng phải researched, reviewed,
**Approved for implementation** và merge trước source. Yêu cầu tự quyết định kế hoạch
cho phép chọn phương án ở §2, không phải bằng chứng review/merge đã diễn ra.
Chuẩn bị spec của slice sắp làm; không tạo hàng loạt spec rỗng hoặc đánh dấu Approved giả.

M1/M2 dự kiến không cần migration. Nếu phát sinh thay đổi dữ liệu/schema, tách proposal
additive với verification/recovery trước khi thực hiện. Không sửa hồi tố mastery hay
lịch sử SRS để che lỗi cũ. Lùi PR UI bằng revert tương thích dữ liệu; không rollback bằng
cách khôi phục cổng kiểm sai hay câu hỏi sai. Nếu chưa có cách an toàn, dừng rollout.

Khi được phép phát hành: kiểm staging bằng tài khoản thử, rồi triển khai theo quy trình
hiện có, kiểm smoke và lỗi trong 24–48 giờ. Không bổ sung telemetry PII; ưu tiên log/test
hiện có. Việc gửi lời mời pilot, truy cập production và triển khai cần phạm vi cho phép riêng.

## 6. Current truth

- `main` đã reconcile: `1d9e247e`; branch triển khai `codex/uiux-pedagogy-upgrade-plan`.
- Baseline: [nghiên cứu 23/09](../research/2026-09-23-uiux-su-pham-baseline.md).
- Goal gap: F1 đã có bản sửa local, full gate đạt; chưa đóng trước review/merge. F2–F8 còn mở; M3/M4 cần spec; M5 chưa có pilot.
- Quyết định sản phẩm trong kế hoạch đã chọn, không có câu hỏi cần chặn việc lập kế hoạch.
- Next best slice: review S01 và đặc tả, push/PR đã được cấp quyền, tích hợp sau CI; sau đó S02.
  [Spec S02](../specs/2026-09-23-uiux-s02-luu-ho-so-trung-thuc.md) mới là Draft; chưa triển khai.
- Chưa được suy trạng thái review/CI/merge từ goal cũ; kiểm lại main đầu mỗi vòng.

### Đặc tả chi tiết đã chuẩn bị

- [S02 — Lưu hồ sơ trung thực](../specs/2026-09-23-uiux-s02-luu-ho-so-trung-thuc.md).
- [S03–S05 — Tính đúng của bài tập](../specs/2026-09-23-uiux-s03-s05-tinh-dung-bai-tap.md).
- [S06–S08 — Accessibility](../specs/2026-09-23-uiux-s06-s08-accessibility.md).
- [S09–S12 — Trải nghiệm và nghiệm thu](../specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md).

Các tài liệu trên là Draft; review kỹ thuật của agent không thay thế phê duyệt/merge,
kiểm thử source hoặc nghiệm thu sư phạm. S01 vẫn là slice source đang được kiểm chứng.

## 7. Iteration log

### Iteration 1 — 2026-09-23

- State: PLANNING; yêu cầu người dùng: lập kế hoạch nâng cấp, tự quyết định phương án.
- Thay đổi: goal này và baseline bền vững; ghi liên kết kế hoạch trong PROGRESS.
- Gap trước/sau: không đổi lỗi sản phẩm; đã có thứ tự 5 milestone, 12 slice sau PR tài liệu,
  metric, test, điểm chạm, phụ thuộc, rollout và rollback.
- Validation: kiểm Markdown và diff ở lượt tạo; không có source đổi, không chạy full code gate.
- Next: S00 review rồi S01; chưa có PR, chưa triển khai hoặc phát hành.

## 8. Final audit

- [ ] F1–F8 có bằng chứng sửa trên main.
- [ ] M1–M5 đạt AC; incomplete accessibility đã có kết luận.
- [ ] Full regression, a11y, bundle và privacy guardrails đạt.
- [ ] Thiết bị/công nghệ hỗ trợ và pilot có dữ liệu thật.
- [ ] Tài liệu, rollback, residual risks được cập nhật.
- [ ] Chủ sản phẩm xác nhận nghiệm thu.

**Kết luận goal: NOT COMPLETE. S01 full gate local đạt, chờ review/CI/tích hợp; S02–S12 còn Draft, chưa triển khai.**

### Iteration 2 — 2026-09-23: S01

- Người dùng yêu cầu triển khai; bắt đầu slice sửa lỗi F1 trên base `1d9e247e`.
- Codemap: loader ảnh hưởng 11 file trực tiếp/gián tiếp; Placement ảnh hưởng App/main.
- Loader kiểm HTTP/JSON/schema Zod, timeout 15 giây, chia sẻ request và giải phóng cache reject.
- Placement có lỗi/retry/thoát, giữ vòng hoàn tất; không suy trình độ từ tập câu rỗng; bỏ qua response sau unmount/thoát.
- State: BLOCKED. Unit loader 6/6 và E2E phục hồi 1/1 đạt. Build/typecheck Node 24 đạt; typecheck Node 22 đạt, build Node 22 hết heap.
- Full gate chưa đạt: lint vướng checkout lồng ngoài phạm vi; unit có lỗi report-status/chấm lập trình; E2E có lỗi fixture và browser crash. Lượt unit/E2E đã ngắt, không có tổng kết hoàn chỉnh.
- Bằng chứng, giới hạn và rollback: [changelog S01](../changelog/0420-2026-09-23-placement-phuc-hoi-tai-loi.md).
- Bước gỡ chặn: chạy gate tuần tự trên môi trường đủ bộ nhớ, rà shell/Python và checkout lồng; xử lý các failure ngoài S01 trong phạm vi riêng trước tích hợp.
- Không có migration hoặc API provider trả phí. Targeted unit 6/6 và E2E 1/1 đạt trên Node 22.23.2 và 24.19.0; chưa có kết quả CI.
- Giữ nguyên nguyên tắc một slice/PR; slice sau bắt đầu trên base đã tích hợp và kiểm chứng.

### Iteration 3 — 2026-09-23: gỡ blocker qua subagent

- Người dùng yêu cầu giao việc còn lại cho subagent Astra light; dùng Astra/low,
  ba phạm vi độc lập, exclusive write set và review tập trung.
- State: WAITING. Bỏ lint nhầm nested worktree; unit/E2E targeted đạt khi cấu hình
  đúng shell/Python và giảm tải. Không bỏ test hay hạ rule.
- Full build/typecheck/lint/format Node 22 đạt; full unit 16.744 pass, 2 skip hiện có.
  Full E2E 873 pass, 5 N/A skipped trong 28,3 phút; size gate JS 151,47/160 kB, CSS 23,62/26 kB đạt.
  Log và giới hạn trong changelog 0420; không thêm skip hoặc tắt rule.
- Hoàn thiện Draft S02–S12 từ code thực; chưa Approved/merge hoặc triển khai source.
- Next: review bản sửa S01/config lint và đặc tả; push/mở PR đã được người dùng cho phép ở lượt tiếp theo. Chưa có quyền merge/deploy.

### Iteration 4 — mở PR theo quyền đã cấp

- Người dùng xác nhận cho phép push/mở PR và yêu cầu cập nhật tiến độ.
- Fetch lại origin: main vẫn ở `1d9e247e`, không có divergence trước tạo commit.
- Tách PR tài liệu (goal/baseline/Draft S02–S12/bằng chứng) và PR S01 đặt trên nhánh
  tài liệu. Chỉ PR S01 thay source; đặc tả phần sau vẫn Draft.
- Full gate local ở iteration 3 là bằng chứng hiện có; chờ CI cho commit đã push.
- Chưa cấp quyền merge/deploy; không coi push hoặc mở PR là hoàn thành goal.
