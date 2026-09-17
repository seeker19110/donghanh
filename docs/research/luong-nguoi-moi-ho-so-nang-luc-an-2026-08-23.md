# Đặc tả: Luồng người mới — 5 câu → hồ sơ năng lực ẩn → gợi ý ĐÚNG MỘT việc (2026-08-23)

> **Trạng thái tài liệu (viết lại 2026-09-17):** CLAUDE.md mục 2 dẫn tới file này từ trước, mô tả
> đúng nội dung dưới đây, nhưng file vật lý **chưa từng tồn tại** trong repo — phát hiện khi viết
> đặc tả S05/S10/S12 (`docs/changelog/0328-2026-09-15-dac-ta-s07-va-cac-slice-con-lai-learning-ux.md`),
> ghi thành nợ kỹ thuật #1 trong `PROGRESS.md`. Khác với phần lớn tài liệu ở `docs/research/` (viết
> TRƯỚC khi có code), tài liệu này viết **SAU** — mã đã chạy thật từ 2026-08-23 (PR chuỗi ba đợt,
> xem mục 8), nên đây vừa là đặc tả vừa là mô tả đối chiếu với `packages/core-personal/intakeService.ts`,
> `packages/core-personal/intakeSuggestion.ts`, `packages/core-contracts/intake.ts`,
> `apps/dhcb/src/pages/core/Intake.tsx` — **KHÔNG bịa thêm hành vi nào chưa có trong các file đó.**
> Route dẫn người dùng mới tới luồng này đã bị TẮT từ 2026-09-13
> (`docs/changelog/0293-2026-09-13-tat-intake-do-rot-onboarding.md`) vì lý do funnel, không phải vì
> luồng sai — xem mục 9.

> **Thuộc bộ tài liệu năng lực cá nhân theo độ tuổi.** Ba tài liệu gốc mà mục 2 CLAUDE.md liệt kê
> tách rời (`dac-ta-nang-luc-ca-nhan-theo-do-tuoi-2026-08-23.md`,
> `nang-luc-10-40-chi-tiet-2026-08-23.md`, `dong-hanh-va-phat-trien-nang-khieu-2026-08-23.md`)
> **cũng không tồn tại dưới tên riêng** trong repo hiện tại — nội dung của cả ba đã được một đợt
> gộp tài liệu đưa vào một file duy nhất, `docs/research/nang-luc-va-do-tuoi.md` ("Tổng hợp Nghiên
> cứu: Nang Luc Va Do Tuoi"), mỗi tài liệu gốc là một mục lớn trong đó. Đây là một khoảng lệch
> khác giữa CLAUDE.md và thực tế repo, **ngoài phạm vi việc được giao** (chỉ tạo lại file này) —
> ghi ở mục 10 để người dùng quyết định có cần sửa CLAUDE.md mục 2 hay không. Tài liệu này lấy
> **Luật số 1** ("kết quả chẩn đoán không bao giờ là màn hình chính") từ file gộp đó, mục
> `dong-hanh-va-phat-trien-nang-khieu-2026-08-23.md`.

## 1. Vấn đề

Người dùng mới đăng ký cần được hiểu nhanh (tuổi, mối bận tâm, đà học) để Companion gợi ý đúng
việc — nhưng **hỏi trực tiếp kiểu bài kiểm tra thì phản tác dụng**: một bảng câu hỏi dài, có tiến
trình kiểu thi cử, khiến người mới nản trước khi chạm được tính năng nào; và một kết quả chẩn đoán
hiện ra như bảng điểm khiến người ta thấy bị đo thay vì được đồng hành. Luật số 1 của sản phẩm
(nêu ở `docs/research/nang-luc-va-do-tuoi.md`, phần "đồng hành và phát triển năng khiếu"):

> Kết quả chẩn đoán KHÔNG bao giờ là màn hình chính — nó là công cụ CHỌN VIỆC, không phải bảng
> chấm điểm con người.

Giải pháp: hỏi rất ít, rất nhanh, tuỳ chọn hoàn toàn, và không bao giờ cho người dùng thấy hồ sơ
năng lực — họ chỉ thấy **một việc nên làm tuần này**.

## 2. Kiến trúc 3 lớp

```
Người dùng ──> [Lớp HỎI]  ──lưu──> [Lớp HỒ SƠ ẨN]  ──đọc──> [Lớp GỢI Ý] ──hiện──> Người dùng
              5 câu, bỏ           personal.intake          hàm THUẦN,           1 việc chính
              qua tự do           (mã hoá 2 cột tự do)     tất định,            + ≤2 lựa chọn
                                                            không gọi AI
```

- **Lớp HỎI** — `apps/dhcb/src/pages/core/Intake.tsx`, route `/bat-dau`. 5 câu (mục 3), bỏ qua
  câu nào cũng được, bỏ hết cả 5 vẫn vào được app. Không thanh tiến trình kiểu bài thi, không đếm
  điểm khi đang trả lời.
- **Lớp HỒ SƠ ẨN** — `packages/core-personal/intakeService.ts` + bảng `personal.intake`
  (migration `0061`, thêm cột đo lường ở `0062`). Đây là chỗ câu trả lời được **cất**, không phải
  chỗ chúng được đem ra khoe: file này **không có đường xuất trực tiếp lên giao diện** — mọi thứ
  hiện cho người dùng phải đi qua lớp GỢI Ý.
- **Lớp GỢI Ý** — `packages/core-personal/intakeSuggestion.ts`. Hàm THUẦN (`buildIntakeResult`),
  tất định, không gọi AI, không đụng CSDL. Trả đúng **1 việc chính** + tối đa **2 lựa chọn**. Câu
  "vì sao" trích lại lời người dùng khi có, không bao giờ nói về "hồ sơ" hay "suy luận".

Ranh giới cố ý: kiểu dữ liệu `IntakeResult` (`packages/core-contracts/intake.ts`) là điểm nghẽn
DUY NHẤT giữa lớp ẩn và giao diện — nó **không có trường điểm số, thang bậc, hay phần trăm nào**,
và schema Zod `.strict()` khiến thêm trường lạ là lỗi biên dịch/runtime chứ không phải lỗi phong
cách.

## 3. Năm câu hỏi (~90 giây)

Nguyên văn từ `Intake.tsx` — mỗi câu là một bước riêng, có nút bỏ qua:

1. **Nhóm tuổi** — dùng lại đúng 4 nhóm nền tảng đã có từ migration `0002`
   (`nhi_dong` · `thieu_nien` · `thanh_nien` · `nguoi_lon`), không tạo hệ phân loại tuổi mới.
   Nhóm tuổi **không lưu ở bảng `personal.intake`** — nguồn sự thật vẫn là `public.profiles.age_group`.
2. **"Dạo này điều gì chiếm nhiều tâm trí bạn nhất?"** — chọn sẵn 6 khả năng (`hoc_thi` ·
   `cong_viec` · `suc_khoe` · `tien_bac` · `quan_he` · `chua_ro`).
3. **"Nếu mỗi ngày có thêm một giờ, bạn dùng vào việc gì?"** — câu trả lời TỰ DO, tối đa 200 ký tự.
4. **"Việc gì bạn làm mà quên mất thời gian?"** — câu trả lời TỰ DO, tín hiệu năng khiếu tự phát,
   đáng tin cậy nhất trong 5 câu vì người dùng tự nói ra chứ không chọn từ danh sách.
5. **"Lần gần nhất bạn tự học xong một thứ mới là khi nào?"** — 4 mức đà học (`tuan_nay` ·
   `vai_thang` · `lau_roi` · `khong_nho`).

Mọi trường trong `IntakeAnswersSchema` đều `.optional()` — đây là ràng buộc kiểu, không phải quy
ước tài liệu: bỏ qua câu nào cũng hợp lệ về kiểu dữ liệu.

## 4. Hồ sơ năng lực ẩn — cái gì được cất, cất thế nào

Bảng `personal.intake` (một dòng/người dùng):

| Cột                                                     | Nguồn | Cách lưu                                                                                    |
| ------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------- |
| `focus`                                                 | Câu 2 | Nguyên văn — giá trị đóng (6 khả năng), giấu cũng vô nghĩa, cần lọc/thống kê                |
| `last_learned`                                          | Câu 5 | Nguyên văn — giá trị đóng (4 khả năng), lý do như trên                                      |
| `extra_hour_enc`                                        | Câu 3 | **Mã hoá** qua `encryptUserField` (`@dhcb/core-config/userDataCrypto`), khoá theo `user_id` |
| `flow_activity_enc`                                     | Câu 4 | **Mã hoá**, cùng cơ chế                                                                     |
| `chosen_task_id` / `suggested_task_id` / `task_done_at` | —     | Dữ liệu ĐO lường (mục 6), không phải câu trả lời                                            |

Chỉ hai câu **tự do** (3 và 4) được mã hoá — đây là văn bản người dùng tự viết, có thể chứa nội
dung nhạy cảm hơn một lựa chọn đóng trong danh sách 4–6 khả năng đã biết trước. Bỏ qua câu tự do
→ lưu `null`, **không mã hoá chuỗi rỗng** (phân biệt rõ "bỏ qua" với "trả lời rỗng").

`getIntakeState` đọc lại — kể cả bản ghi CŨ lưu từ trước khi mã hoá được thêm vào vẫn đọc được
(chuyển đổi dần, không cần migration dữ liệu một lần).

## 5. Lớp gợi ý — luật ngôn ngữ cấm/cho phép

`buildIntakeResult()` (hàm thuần) chọn đúng 1 việc chính từ 10 việc có sẵn
(`packages/core-personal/intakeSuggestion.ts`, hằng `TASKS`), dựa trên mối bận tâm (câu 2), có
điều chỉnh theo đà học (câu 5, "yếu" → chọn việc nhỏ hơn) và độ tuổi (tuổi đi học chọn "công việc"
→ đổi hướng, không nhận việc nghề nghiệp người lớn).

**Cấm** (kiểm bằng `findForbiddenLanguage`, một mẫu regex cho mỗi loại):

| Bị cấm                  | Ví dụ mẫu bị bắt                     | Lý do                                       |
| ----------------------- | ------------------------------------ | ------------------------------------------- |
| Điểm số dạng phân số    | `72/100`                             | Biến người thành con số                     |
| Phần trăm               | `80%`                                | Như trên                                    |
| Ngôn ngữ chấm điểm      | "điểm số", "chấm điểm"               | Như trên                                    |
| Ngôn ngữ xếp loại       | "bạn đang ở mức", "trình độ của bạn" | Ngụ ý một thang đo cố định                  |
| Ngôn ngữ khiếm khuyết   | "bạn thiếu/yếu/kém/chưa đạt"         | Ngụ ý thiếu sót                             |
| So sánh với người khác  | "so với người/bạn bè khác"           | Vi phạm tinh thần đồng hành cá nhân hoá     |
| Xếp hạng                | "xếp hạng", "thứ hạng"               | Biến hồ sơ cá nhân thành cuộc đua           |
| Định mệnh luận tuổi tác | "đáng lẽ", "lẽ ra", "tuổi này mà"    | Áp đặt kỳ vọng theo tuổi thay vì theo người |

**Cho phép / bắt buộc:** câu "vì sao" **trích lại nguyên văn** lời người dùng khi có (ưu tiên câu
4 > câu 3 — tín hiệu tự phát đáng tin hơn một câu trả lời có gợi ý sẵn), ví dụ: `Bạn có nhắc tới
"vẽ" — mình nghĩ bắt đầu từ đó là hợp nhất.` Không có chữ nào của người dùng thì diễn đạt lại theo
mối bận tâm đã chọn, vẫn không chứa con số nào.

**Bẫy kỹ thuật đã mắc thật khi viết bộ lọc:** `\b` của JavaScript chỉ hiểu ranh giới từ trong
`[A-Za-z0-9_]`, nên `\bđáng lẽ` và `mà\b` **không bao giờ khớp** với tiếng Việt có dấu — bộ lọc mù
với đúng phần nó sinh ra để canh. Test bắt được ngay lần chạy đầu; đã đổi sang lookaround Unicode
`(?<!\p{L})…(?!\p{L})` với cờ `u`. Bài học chung: **đừng dùng `\b` cho tiếng Việt.**

## 6. Đo gợi ý có TRÚNG không (không phải hồ sơ, là hiệu quả)

Tách rõ **hai câu hỏi khác nhau** (`docs/changelog/0095-2026-08-23-...`), trộn lẫn là mất cả hai:

1. **Suy luận có đúng không?** → người dùng nhận việc CHÍNH / đổi sang lựa chọn khác / bỏ qua
   (`chosen_task_id` so với `suggested_task_id`).
2. **Có tác dụng thật không?** → làm xong việc đầu **trong 7 ngày** (`task_done_at` so với thời
   điểm chọn, có mốc để không đếm nhầm "làm xong ngày thứ 9" vào "trong 7 ngày").

`suggested_task_id` được **lưu**, không tính lại từ `buildIntakeResult()` — vì hàm này có thể được
sửa thuật toán sau này, và tính lại sẽ làm toàn bộ số liệu lịch sử đổi theo, mất khả năng so sánh
trước/sau cải tiến. `markTaskDone` chỉ ghi mốc lần ĐẦU (`where task_done_at is null`) — bấm lại
không dời mốc.

Trình bày ở `/api/admin-intake-stats` + `AdminIntakePanel` (tab Analytics trang `/admin-s`):
mẫu số bằng 0 trả `null` (hiện dấu gạch), **không phải `0%`** — "chưa có dữ liệu" và "bằng không"
là hai chuyện khác nhau. Số liệu thống kê **không đụng** tới hai cột đã mã hoá — đếm không phải
cái cớ để mở hồ sơ cá nhân.

## 7. Bảy test bất biến chặn CI (không rò số năng lực lên giao diện)

Bảy test đại diện, chạy trong CI mọi PR (`npm test` job unit + `npm run test:e2e` job e2e), giữ
đúng luật ngôn ngữ cấm/cho phép ở mục 5 và Luật số 1:

| #   | Test                                                                                                | File                       | Bắt cái gì                                                                                                                                           |
| --- | --------------------------------------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1  | `KHÔNG tổ hợp nào sinh ra ngôn ngữ bị cấm`                                                          | `intakeSuggestion.test.ts` | Quét **1.575 tổ hợp** (5 tuổi × 7 bận tâm × 5 đà học × 3 câu 3 × 3 câu 4) qua `buildIntakeResult` rồi `findForbiddenLanguage` — không tổ hợp nào lọt |
| T2  | `luôn đúng 1 việc chính + tối đa 2 lựa chọn, và chúng khác nhau`                                    | `intakeSuggestion.test.ts` | Trần cứng "đúng 1 việc chính" không bị phá bởi thay đổi thuật toán chọn việc                                                                         |
| T3  | `kết quả luôn hợp lệ theo contract (Zod strict)`                                                    | `intakeSuggestion.test.ts` | Không trường lạ (điểm số, thang bậc…) lọt qua `IntakeResultSchema.strict()`                                                                          |
| T4  | `mọi việc gợi ý đều có câu "vì sao" không rỗng`                                                     | `intakeSuggestion.test.ts` | Không rơi vào bảng chấm điểm trần trụi không giải thích                                                                                              |
| T5  | `bỏ HẾT 5 câu vẫn ra được một việc`                                                                 | `intakeSuggestion.test.ts` | Bỏ qua không được chặn luồng — đúng đặc tả mục 3                                                                                                     |
| T6  | `findForbiddenLanguage bắt điểm số, phần trăm, xếp loại, khiếm khuyết, so sánh, định mệnh tuổi tác` | `intakeSuggestion.test.ts` | Chính bộ lọc — không báo nhầm câu nói bình thường, không bỏ sót mẫu cấm                                                                              |
| T7  | `màn gợi ý KHÔNG hiện điểm số, thang bậc hay so sánh`                                               | `e2e/a11y-intake.spec.ts`  | Cấp trình duyệt thật — DOM render ra sau khi qua React/CSS vẫn sạch, bổ sung cho T1 (chỉ kiểm chuỗi ở tầng hàm thuần)                                |

Ngoài 7 test trên còn có test tương đương ở lớp HỒ SƠ ẨN (`intakeService.test.ts`): câu tự do
không bao giờ chạm CSDL ở dạng plaintext, và thống kê không đụng hai cột đã mã hoá — thuộc nhóm
"không rò dữ liệu cá nhân", khác nhóm "không rò ngôn ngữ chấm điểm" ở bảng trên nên không tính
vào 7 test chặn ngôn ngữ.

## 8. Lịch sử triển khai (đã code thật, không phải kế hoạch)

| Đợt | Việc                                                                                                       | Changelog                                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | 3 lớp + contract + bộ lọc ngôn ngữ + test quét 1.575 tổ hợp + migration `0061` + `e2e/a11y-intake.spec.ts` | `docs/changelog/0094-2026-08-23-feat-c1b-2-luong-nguoi-moi-5-cau-ho-so-an-goi-y-mot-viec.md` |
| 2   | Đo gợi ý có trúng không: migration `0062`, `getIntakeStats()`, `/api/admin-intake-stats`, `FirstTaskCard`  | `docs/changelog/0095-2026-08-23-feat-do-goi-y-cua-luong-nguoi-moi-co-trung-khong.md`         |
| 3   | `AdminIntakePanel` trong tab Analytics `/admin-s`, `e2e/a11y-admin-intake.spec.ts`                         | `docs/changelog/0096-2026-08-23-feat-panel-luong-nguoi-moi-trong-trang-admin.md`             |
| 4   | Tắt route `/bat-dau` khỏi luồng đăng ký mới (giữ nguyên code)                                              | `docs/changelog/0293-2026-09-13-tat-intake-do-rot-onboarding.md`                             |

## 9. Trạng thái hiện tại (2026-09-17) — vì sao route đang TẮT

Đọc dữ liệu thật (14 ngày, 20 người dùng): 20 đăng ký nhưng chỉ 4 hoàn thành phiên học đầu tiên —
rớt 80% ngay sau đăng ký. Nguyên nhân xác nhận được: **số màn hình/thao tác** trước khi vào nội
dung học (Intake 5 câu rồi Onboarding 4 bước, tối đa 9 lượt bấm), không phải nội dung câu hỏi hay
việc ép buộc — cả hai màn đều có nút bỏ qua/giá trị mặc định.

Quyết định (chủ dự án, 2026-09-13): **tắt route** `/bat-dau` khỏi `RequireAuth`, người dùng mới đi
thẳng vào Onboarding 4 bước. Toàn bộ code 3 lớp (`Intake.tsx`, `intakeService.ts`,
`intakeSuggestion.ts`, panel admin) **giữ nguyên, không xoá** — truy cập được qua URL trực tiếp,
và có thể bật lại route nếu quyết định giữ lớp hồ sơ năng lực ẩn ở một hình thức ít bước hơn (ví
dụ 1–2 câu lồng vào Onboarding thay vì một trang riêng). Bảy test bất biến ở mục 7 vẫn chạy trong
CI dù route đang tắt — chúng canh đúng logic/component, không canh việc route có được dùng hay
không.

## 10. Việc CHƯA làm ở đợt viết tài liệu này (ngoài phạm vi được giao)

- CLAUDE.md mục 2 vẫn dẫn tới ba tên file `dac-ta-nang-luc-ca-nhan-theo-do-tuoi-2026-08-23.md` /
  `nang-luc-10-40-chi-tiet-2026-08-23.md` / `dong-hanh-va-phat-trien-nang-khieu-2026-08-23.md` như
  ba file riêng, nhưng thực tế chỉ có một file gộp `docs/research/nang-luc-va-do-tuoi.md`. Đây là
  một khoảng lệch tài liệu KHÁC với nợ #1 (file này) — không sửa trong đợt việc này vì không nằm
  trong việc được giao; cần người dùng quyết định sửa CLAUDE.md hay khôi phục ba file riêng.
- `docs/research/eval-tutor-baseline.md` và `docs/research/cai-tien-lo-trinh-hoc.md` — hai tài
  liệu khác cũng được CLAUDE.md/mã dẫn tới nhưng không tồn tại, phát hiện cùng đợt khảo sát S07
  (`docs/changelog/0328-*.md`) — KHÔNG thuộc phạm vi việc này, vẫn còn là nợ mở riêng.
