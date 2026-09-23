# S09–S12 — Trải nghiệm bài học, sửa lỗi và nghiệm thu

| Thuộc tính | Giá trị                                                                        |
| ---------- | ------------------------------------------------------------------------------ |
| Goal       | [UI/UX và sư phạm](../goals/2026-09-23-uiux-su-pham.md), M3–M5                 |
| Trạng thái | Draft — chưa Approved for implementation, chưa triển khai/nghiệm thu           |
| Baseline   | [Audit 23/09](../research/2026-09-23-uiux-su-pham-baseline.md), SHA `1d9e247e` |
| Cách chia  | Bốn slice riêng; mỗi slice review và merge spec trước source                   |

## 1. Nguồn thực tế và giới hạn

Đã đối chiếu mã trong workspace; số đo baseline là số đo lịch sử, không phải kết quả
kiểm chứng của lượt viết đặc tả này. Không chạy test, build, pilot hay chuyên gia review
trong lượt này. Áp dụng skill UI và sư phạm theo phạm vi goal: phản hồi vừa trình độ,
không tự thêm cấu trúc C1/C2 cho người mới, không kế thừa tuyên bố độ tin cậy khảo thí
hoặc hiệu quả học từ mô tả skill.

Các điểm tái sử dụng trong `apps/dhcb/src/`:

- `components/programming/LessonProse.tsx`: render lý thuyết bằng parser hiện có,
  đoạn văn có `read-measure`, code dùng `CodeSurface`.
- `pages/subjects/programming/ProgrammingLessonPage.tsx`: đã có mục lục khóa qua
  `lessonOutlineContext` và điều hướng `OutlinePrevNext`; không dựng mục lục môn thứ hai.
- `pages/learning/StemLessonView.tsx`: có draft answers/checked, phần ví dụ, tự kiểm
  và `ActivityResult`; giữ nguyên luồng evidence của lượt nộp.
- `components/learning/ActivityResult.tsx`: đã có năm trạng thái
  passed/failed/pending/local/error, live region tóm tắt, `onRetry`, `reviewSlot` và
  `nextHref`. `ActivityResultItem` hiện chưa có khóa câu/source; không dùng thứ tự
  danh sách làm định danh xuyên bài nếu mở rộng liên kết.
- `pages/core/MistakeBank.tsx`, `lib/evidenceMistakes.ts`, `lib/mistakeRoutes.ts`:
  sổ lỗi và đường quay lại đã tồn tại. Lỗi STEM dựng từ evidence theo
  subject/content/question; lượt đúng mới hơn gỡ lỗi. English đã có đường quay lại
  theo nguồn Chat/Writing/Speaking; không mặc định nó trỏ được tới câu cụ thể.
- `components/FlashcardReview.tsx`, `pages/subjects/programming/ProgrammingReview.tsx`:
  cơ chế ôn hiện hữu; không dựng dashboard, sổ lỗi, kho thẻ hoặc thuật toán SRS mới.

Ngoài phạm vi: thuật toán chấm/xếp lớp, mastery, billing/auth, schema CSDL, AI provider
mới, sửa hàng loạt giáo trình. Nếu cần đổi prompt/model thì phải tách phạm vi, đọc skill
eval và lập evidence riêng; spec này không cấp phép gọi provider trả phí.

## 2. S09 — Bài dài và kết quả dễ tìm

**Outcome:** từ bài dài, người học tới phần học/tự kiểm/kết quả trong tối đa hai thao tác;
sau xem kết quả biết câu cần sửa mà không phải đọc lại toàn bộ lời giải.
Phụ thuộc M1 và M2; không che lỗi lưu bằng đổi bố cục.

Baseline bài mẫu mobile dài 4.469px, kết quả 6.053px; chiều dài không tự nó là lỗi.
Chọn mục lục **trong bài** có nhãn khác mục lục **khóa học**, tái dùng cấu trúc heading
hiện có. Màn kết quả giữ tóm tắt điểm/trạng thái lưu luôn thấy; danh sách câu sai trước
với quyền mở chi tiết từng câu, câu đúng vẫn truy cập được. Không tự ẩn thông tin lỗi
server, ngưỡng đạt hoặc lời giải khiến người học không phục hồi được.

### 2.1. Quyết định review 23/09/2026

**S09: Draft — chưa Approved for implementation.** Review code tại
`bec484dff7129145c531cacbb321d2942ed07b7a` (`origin/main` lúc tạo worktree).
Người dùng đã ủy quyền agent duyệt nếu đủ; giữ Draft vì các blocker ở §2.6,
không phải vì cần xin lại quyền. Quyết định này chỉ áp dụng S09 của goal UI/UX
23/09; S10–S12 vẫn Draft, chưa có nghiệm thu production hay sư phạm.

Không nhầm với [S09 đồng bộ 15/09](2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md):
spec đó đã Approved cho version/idempotency/outbox, không cấp quyền cho bố cục
bài dài. Changelog [0334](../changelog/0334-2026-09-15-s09-1-version-idempotency-dong-bo.md),
[0353](../changelog/0353-2026-09-16-s09-2-outbox-dong-bo-tien-do.md) và
[0376](../changelog/0376-2026-09-19-sua-f6-f8-progress-merge.md) là lịch sử đồng bộ;
conflict draft xuyên thiết bị còn là việc riêng, không đưa vào S09 UI/UX.

Audit [22/09](../audit/2026-09-22-danh-gia-sau-ui-ux.md) có nhiều màn lỗi/rỗng;
[baseline 23/09](../research/2026-09-23-uiux-su-pham-baseline.md) coi độ dài bài
là giả thuyết cải thiện, không phải bằng chứng hiệu quả học. [Prototype](../ux-upgrade/s09-s12/prototype.html)
và [review đã ghi](../ux-upgrade/s09-s12/README.md) chỉ chứng minh tương tác HTML
độc lập. Không lấy chúng làm ảnh/contrast/nháp của app thật.

### 2.2. Hiện trạng và ownership

Các đường dẫn source dưới đây tương đối với `apps/dhcb/src/`.

| Đích              | Hiện trạng đã đọc tại base review                                                                                                                                                                                                                                      | Contract S09 và ranh giới                                                                                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STEM bốn môn      | `pages/learning/StemLessonView.tsx`: chỉ xử lý hash bắt đầu `#cau-`; nạp lười rồi focus câu, câu không tồn tại về h1. `TuKiemTra` giữ answers/checked bằng `useLearningSession`; kết quả nộp chỉ ở React state.                                                        | Mở rộng anchor section trong chính trang; giữ nháp cùng owner/contentVersion. Reload không được dựng lại kết quả authoritative từ nháp.                                             |
| Kết quả STEM      | Caller production duy nhất của `components/learning/ActivityResult.tsx` là `StemLessonView`; `lib/stemResultView.ts` ghép evidence theo questionIndex nhưng bỏ index khỏi props. Component dùng index hiển thị làm key và số câu.                                      | Adapter sở hữu định danh/nguồn kết quả; component chỉ trình bày. Không sort trước khi giữ số câu gốc.                                                                               |
| Bài lập trình     | `pages/subjects/programming/ProgrammingLessonPage.tsx`: StepRail/StepBar gọi setStep; stepIndex và code/predictChoice/arranged/hintsShown/sampleViewed nằm trong nháp. results không persist. `components/programming/LessonProse.tsx` là renderer, không phải router. | Tái dùng thanh bước, không thêm mục lục bài trùng. Map URL ↔ bước và precedence đã chốt ở §2.8; chưa triển khai. Không chạm grader hoặc saveLessonProgress.                         |
| Hội thoại English | `pages/subjects/english/Lessons.tsx` giữ selectedMeta bằng state; `lessons/LessonView.tsx` có activeTurn/audio/role-play, cuộn trong panel mobile và theo trang desktop; không dùng ActivityResult/useLearningSession.                                                 | Fixture id 1 không phải bằng chứng route mở được bài đó. Contract chọn bài/turn, Back và audio đã chốt ở §2.7; chưa triển khai; không tự áp contract STEM vào EvaluationResultView. |
| Link sổ lỗi       | `lib/mistakeRoutes.ts` sinh STEM `#cau-N`; English chỉ về loại hoạt động. [S11a](../changelog/0423-2026-09-23-stem-so-loi-deep-link.md) đã nối đích DOM STEM.                                                                                                          | Giữ nguyên builder/đường dẫn môn và số câu; không hứa English quay lại đúng turn từ sổ lỗi.                                                                                         |

**Write set khi triển khai sau duyệt:** adapter `lib/stemResultView.ts`, component
`components/learning/ActivityResult.tsx`, caller `pages/learning/StemLessonView.tsx`
và test tương ứng là một nhóm ownership tuần tự. Chạy codemap impact trước sửa.
Caller English/lập trình là PR sau với ownership riêng; không sửa chung component
song song. Không sửa source S08, spec S04, schema, grader, curriculum, prompt/model,
SRS, outbox hoặc server-draft trong slice này. Review hiện tại chỉ sửa tài liệu.

### 2.3. Contract điều hướng STEM đã chốt

- Nhãn mục lục bài là **Trong bài**, phân biệt **Mục lục môn học**. Desktop đặt ở
  đầu nội dung; mobile dùng nút mở danh sách gọn. Không dựng cột mục lục môn thứ hai.
- Section id cố định: `#dau-bai`, `#ly-thuyet`, `#hoat-anh` (chỉ khi có), `#vi-du`,
  `#tu-kiem`, `#ket-qua`, `#the-on`. Không sinh id từ tiêu đề dịch hoặc parser prose.
  Câu hỏi vẫn `#cau-N` qua `neoCauHoi(questionIndex)`, N bắt đầu 1; phạm vi định danh
  là subjectId + contentId + phiên bản nội dung, không ổn định qua việc đổi đề.
- Nút/link jump chỉ đổi hash và focus/scroll; giữ pathname, query và nháp. Click đích
  khác tạo một history entry; click lại cùng đích không thêm entry. Back/Forward
  không ghi thêm history. Chờ bài nạp xong mới resolve; không để callback bài cũ
  focus bài mới. URL canonical hóa phải giữ hash/query như luồng hiện có.
- Hash hợp lệ đưa focus đến heading/câu có `tabIndex=-1`, sau đó cuộn có khoảng tránh
  header. Hash không tồn tại, sai cú pháp hoặc section tùy chọn vắng mặt về h1 của
  bài hiện tại; không dùng hash tùy ý làm selector CSS. Hash rỗng ở lần mở bình thường
  giữ hành vi resume hiện có; Back về entry đầu bài trả focus đầu bài.
- Luôn có heading `#ket-qua`. Trước nộp hoặc sau reload không có kết quả, hiện
  “Chưa có kết quả lượt nộp trong lần mở bài này” và link tới `#tu-kiem`; không giả
  điểm bằng 0, không tự nộp để dựng màn. Không có câu hỏi thì nói rõ, không có nút nộp.
- Chọn đích đóng mục lục rồi focus đích (không bị cleanup trả lại trigger).
  Escape/nút đóng khi chưa chọn trả focus trigger. Tab order theo DOM; nội dung
  bị đóng không nhận focus. Jump không đánh dấu đã học, không mở lời giải chưa được
  phép và không gọi chấm/nộp/gửi lại. Outbox online đang có là cơ chế độc lập.

### 2.4. Contract kết quả và nghiệp vụ sư phạm đã chốt

- Adapter phải mang `questionIndex` gốc (0-based) và định danh ổn định theo bài vào
  item; label là “Câu N” từ index gốc. Đích xem câu là `#cau-N`, id hàng kết quả là
  `ket-qua-cau-N`, không trùng id câu hỏi. Câu có kết quả sai đứng trước, câu chưa
  có kết quả đứng sau, câu đúng cuối; giữ thứ tự gốc trong từng nhóm. Không sửa mảng
  input hoặc tổng `correct/total/passed` do nguồn evidence trả về.
- **Thiếu item không có nghĩa sai:** hiện `stemResultView` dùng `it?.correct === true`,
  khiến câu thiếu bị biểu diễn như sai. Trước sort phải bổ sung trạng thái trình bày
  `ungraded` (hoặc union tương đương) trong adapter/component, hiển thị “Chưa có kết quả
  câu này”, không reason/lời giải suy diễn. Không đổi schema evidence hay luật chấm.
  Items rỗng vẫn giữ summary; index lạ không được nối nhầm câu. Caller cũ chưa cung cấp
  index tiếp tục thứ tự cũ và không có link định vị; không tạo id giả xuyên bài.
- Câu trả lời hiển thị phải thuộc **lượt đã nộp**, không lấy draft đang sửa ghép vào
  evidence cũ. Hiện caller truyền `draft.answers` trực tiếp; triển khai cần snapshot
  answers khi nộp, gắn cùng kết quả trả về, chỉ trong memory. Response bài/owner cũ
  không được thay kết quả bài/owner mới. Không persist thêm authoritative state.
- Mỗi hàng luôn có số câu gốc, đề, câu đã trả lời và nhãn Đúng/Chưa đúng/Chưa có kết
  quả. Lời giải dài mặc định đóng, nút “Xem giải thích câu N” có trạng thái mở/đóng;
  câu đúng vẫn truy cập được. Không ẩn lỗi server hoặc ngưỡng đạt trong disclosure.
  Không thêm lời giải AI hay cấu trúc C1/C2 vào bài người mới; giữ nội dung/chiều học.
- Summary điểm và trạng thái lưu không thu gọn. Khi cuộn danh sách kết quả, dùng vùng
  summary bám trong khu vực kết quả nếu không che nội dung; ở 320px/zoom 200% được
  trở về normal flow, kèm đường tới summary ≤2 lần kích hoạt. Không nhân đôi live region.
  Đây là làm rõ “luôn thấy”: không ép sticky gây mất vùng đọc ở màn hẹp.
- `passed`/`failed` chỉ từ server; chỉ passed dùng “hoàn thành”. `local` nói ở máy này;
  `pending` nói chưa gửi xong, auth cần đăng nhập lại; `error` giữ thông báo từ chối.
  Ngưỡng lấy `STEM_CHECK_PASS_RATIO`, không ghi cứng giá trị mới. Summary là live
  region duy nhất của kết quả; mở/đóng lời giải không đọc lại toàn bảng.
- “Xem câu N” chỉ điều hướng, không phải lượt tự thử sạch của S11. `onRetry` hiện chỉ
  xóa kết quả nộp, không xóa answers/checked; giữ hành vi đó trong S09. Nộp lại mới
  tạo attempt mới; resend pending dùng attempt cũ qua cơ chế evidence. Không gắn
  nút “Gửi lại” vào `onRetry`, không tự thêm nút nếu caller chưa hỗ trợ resend.
- Trình tự học vẫn mở đầu → lý thuyết → ví dụ → tự kiểm → ôn. Người học có thể chọn
  phần cần đọc, nhưng jump/xem lời giải không tăng mastery, thưởng hay completion.
  UI không gọi thiếu dữ liệu/lỗi mạng là lỗi kiến thức; không tuyên bố tăng hiệu quả
  học hoặc đã được chuyên gia duyệt từ một lần review code.

### 2.5. Acceptance phải chứng minh ở PR triển khai

Mỗi dòng dưới đây là yêu cầu tương lai, **chưa chạy/đạt trong PR tài liệu này**.

| ID       | Ca và kết quả bắt buộc                                                                                                                                                                                   | Bằng chứng                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| S09-AC01 | Từ đầu bài mở Trong bài rồi tới lý thuyết/tự kiểm/kết quả ≤2 kích hoạt; từ summary tới câu sai bất kỳ ≤2 kích hoạt. Báo riêng số Tab tới trigger và đích, không tính cuộn bằng tay là đạt.               | E2E trên bài thật, log số thao tác và focus                            |
| S09-AC02 | Direct URL, tải chậm, Back/Forward, hash sai/không có, chuyển bài nhanh: đúng heading/câu/môn, không focus DOM cũ; giữ hash qua canonical redirect.                                                      | E2E STEM và test resolver                                              |
| S09-AC03 | Điền draft/checked, jump và Back không đổi chúng; không phát sinh submit/grade/attempt bởi jump. Reload phục hồi nháp cùng owner/version; memory-only hiện cảnh báo; không phục hồi kết quả nộp từ nháp. | E2E storage và đếm request; test hook hiện có                          |
| S09-AC04 | Evidence trả câu 3 sai/câu 1 đúng không đổi nhãn thành câu 1 sai; câu 2 thiếu là chưa có kết quả; index lạ không ghép; tổng server không bị tính lại.                                                    | Unit adapter và component: shuffled/sparse/empty/all-correct/all-wrong |
| S09-AC05 | Sửa draft sau nộp hoặc trong lúc chờ không đổi câu đã trả lời ở kết quả cũ; đổi owner/bài không nhận response cũ. Jump và mở lời giải không đổi mastery/evidence.                                        | Integration caller với response trì hoãn                               |
| S09-AC06 | passed/failed/local/pending offline/server/auth/error đều có chữ đúng; ngưỡng và error không bị che. Retry gửi dùng attempt cũ, Làm lại giữ nháp và lần nộp mới dùng attempt mới.                        | Component + evidence regression tests, provider mock                   |
| S09-AC07 | Keyboard/Enter/Space/Escape đủ dùng; chọn đích giữ focus đích, đóng trả trigger; mở giải thích không đọc lại summary; không lộ đáp án qua mục lục trước thao tác cho phép.                               | E2E focus + manual screen reader ghi rõ công cụ/môi trường             |
| S09-AC08 | 320/390/768/1440px × blue-sky/dark-blue/kid, zoom 200%, reduced motion: không tràn ngoài code/bảng có vùng cuộn có nhãn; chữ ≥7:1, target ≥44px, focus không bị che.                                     | Ảnh trước/sau 390/1440 cùng bài; axe AA/AAA, kiểm contrast incomplete  |
| S09-AC09 | Không hồi quy mục lục môn, next/previous, nháp lập trình và audio English hai chiều A/B. Chỉ gọi ≤2 thao tác cho đích đã có contract; các ô còn thiếu không ghi PASS/N/A để che gap.                     | Ma trận caller và E2E sau khi đóng blocker                             |

Fixture nguồn hiện có ở [fixtures.json](../ux-upgrade/s09-s12/fixtures.json):
`toan10-c1-b1`, `ly10-c1-b1`, `hoa10-c1-b1`, `sinh10-c1-b1`, English id `1`,
lập trình `p1-u1-l1`. Chúng là id thật dùng chuẩn bị, không chứng minh “bài dài”.
Trước triển khai ghi route thật, version, câu sai mong đợi và chiều cao trước sửa;
bổ sung bài dài nếu các bài trên không tái hiện. Không dùng HTML prototype thay coverage.

Sau thay source: codemap, targeted tests, `check:ui-ux`, complete gate theo AGENTS/CLAUDE
(build/typecheck/lint/format/test:coverage và E2E). Báo SHA và môi trường Node 22;
không dùng số pass baseline. Ảnh và screen reader chưa có là thiếu nghiệm thu,
không tự nó là lý do thiếu quyền duyệt spec.

### 2.6. Blockers để chuyển Approved for implementation

| ID     | Điều còn thiếu                                                             | Cách khép / owner                                                                                                            |
| ------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| S09-B1 | OPEN — S09 vẫn Draft: phụ thuộc S04/S05 và M2 chưa được nghiệm thu đầy đủ. | Điều phối đối chiếu main và evidence phụ thuộc trước duyệt; PR này không cấp Approved, không sửa source/browser.             |
| S09-B2 | CLOSED — DESIGN CONTRACT ONLY: hội thoại mẫu English §2.7.                 | Hai audit và review tích hợp pin SHA; implementation/browser/audio/AT còn phải chứng minh. Không bao gồm CEFR/Chat/Speaking. |
| S09-B3 | CLOSED — DESIGN CONTRACT ONLY: sáu bước lập trình §2.8.                    | Map, precedence, owner/result, history/focus và fixtures đã chốt; source/browser chưa triển khai/nghiệm thu.                 |

Contract STEM §2.3–2.4 đã có quyết định review nhưng **không tự cấp Approved riêng**
trong một spec S09 toàn phạm vi còn Draft. Khi khép B1–B3, cập nhật ngay original spec
này với SHA và người review theo ủy quyền, merge spec trước source. Không cần chuyên
gia chấm 40 mẫu S10 hoặc pilot S12 để chốt riêng bố cục S09; cũng không vì chốt bố cục
mà đánh dấu các phần đó đã đạt. Rollback review này là revert tài liệu, không đổi dữ liệu.

### 2.7. B2 — Contract hội thoại mẫu English

**CLOSED — DESIGN CONTRACT ONLY, 23/09/2026.** Hai audit độc lập Astra low
(English B2 và Programming B3) đọc source tại
`b7f56206090ea9b4649fc27d61044ca9c309e826`; agent tích hợp theo ủy quyền người dùng
trên `3c0ec2830e4f6f535d9f1fa6d784008ca3f9e435` sau PR #1135. Các file caller được
audit không đổi giữa hai SHA. Các quyết định dưới đây là yêu cầu triển khai tương lai,
không phải hành vi đã chạy. S09 toàn phạm vi vẫn **Draft**, B1 còn mở.

Phạm vi B2 chỉ là `pages/subjects/english/Lessons.tsx` và
`pages/subjects/english/lessons/LessonView.tsx` (path tương đối `apps/dhcb/src/`).
CEFR có URL unit/activity và resume riêng; Chat/Speaking là caller riêng của
`components/EvaluationResultView.tsx`. Không tuyên bố coverage turn-link cho các
caller đó. Nếu sửa component dùng chung, phải kiểm hồi quy từng caller.

1. **Identity/URL:** giữ route `/goc-hoc-tap/english/bai-hoc`, dùng
   `?lesson=1#luot-20`. `lesson` là số nguyên dương tồn tại trong index; chỉ nhận một
   tham số `lesson`. Whitelist hash: `#dau-bai`, `#hoi-thoai`, `#luot-N`, `#ket-qua`.
   N bắt đầu 1 theo thứ tự source, không theo speaker hoặc thứ tự hiển thị.
   Turn index chỉ ổn định trong phiên bản nội dung đã pin SHA; chưa có turn id hay
   contentVersion bền vững, không hứa định danh xuyên lần sửa giáo trình.
2. **Load/invalid:** auth/feature gate → tải index → xác minh lesson → tải chunk →
   kiểm `loadedLesson.id` → resolve hash sau render. URL hợp lệ thắng selection cũ.
   Thiếu `lesson` mở danh sách, không tự chọn bài chưa xem. Id rỗng/lặp/sai cú pháp/
   không tồn tại hiện thông báo tại danh sách và focus heading; không mở bài khác.
   HTTP/network/chunk lỗi có Retry riêng, không báo thành id sai. Hash lạ, malformed
   hoặc N ngoài phạm vi về heading bài đang mở, không clamp sang lượt cuối.
3. **History/resume:** chọn bài/đích khác push đúng một entry; chọn lại chỉ focus,
   không push. Back/Forward đọc URL. “Danh sách” bỏ lesson/hash một cách xác định,
   giữ query khác, không gọi back vô điều kiện. Redirect legacy giữ query/hash.
   Reload mở lesson/hash, không phục hồi audio/recording/role-play/evaluation.
   Không thêm persistent resume cho hội thoại mẫu trong S09. “Tiếp tục” hiện chọn
   bài chưa xem; không được gọi đó là khôi phục lượt đang học.
4. **Focus:** đích có `tabIndex=-1`, nhãn “Lượt N — người nói”; chờ đúng bài render
   rồi focus/cuộn đúng panel mobile hoặc trang desktop, tránh header/audio toolbar.
   Reduced motion không smooth-scroll. Chọn mục lục đóng menu và giữ focus đích;
   Escape trả trigger. Back về danh sách focus bài vừa mở nếu còn hiện, nếu không
   về heading danh sách. Đổi location/bài/owner hủy callback focus cũ.
5. **Audio/role-play:** jump chỉ định vị phần đọc, không seek/đổi rpIdx/skip lượt,
   mở mic, chấm hoặc tự phát. Khi áp navigation, dừng playback/word pacing, hủy
   recorder và vô hiệu hóa callback cũ, kể cả sau await, STT và grading. Role-play
   đang chạy kết thúc chưa hoàn thành; navigation không thành skip có điểm.
   Play/record lại cần thao tác rõ ràng. Giữ chiều A/B, EN/VI/both và quyền giọng.
6. **Kết quả:** `#ket-qua` chỉ hiện evaluation memory đúng lesson/owner/direction;
   đổi các khóa này không lộ kết quả hoặc nhận response phiên cũ. Không có thì hiện
   “Chưa có kết quả trong lần mở bài này”, không giả điểm 0/tự chấm. Đóng kết quả về
   `#hoi-thoai`, focus heading, giữ reset role-play của caller. Summary/encouragement
   luôn truy cập được; explanation có thể thu gọn nhưng original/corrected vẫn thấy.
   Schema lỗi chưa có turn id: không gán lỗi thứ N thành lượt N hoặc hứa “Xem lượt
   sai”; không áp passed/pending/outbox của STEM lên English.
7. **Sư phạm:** jump không đổi mastery/completion hay đánh dấu mọi lượt đã học.
   `markViewed` hiện chạy khi mở bài; không chạy lại theo hash. Không đổi prompt,
   rubric, thứ tự nội dung hoặc thêm scaffolding C1/C2 vào bài người mới.

**Khoảng cách source phải sửa trước nghiệm thu:** `data/lessons/loader.ts` hiện chưa
kiểm HTTP status và nhận `chunk[meta.idx]` trước kiểm id; caller thiếu catch/retry.
`LessonView.tsx` còn await giữa lượt/bản dịch; token TTS riêng chưa bảo vệ cả chuỗi.
`lessons/useRolePlay.ts` cần generation theo owner/lesson/direction và cleanup waiter
cho recorder/transcription/grading. Những việc này chưa được triển khai trong PR docs.

**Fixtures pin tại SHA audit trên:** runtime source là
`apps/dhcb/public/data/lessons/index.json` và `chunk-000.json`/`chunk-001.json` cùng
thư mục, qua `apps/dhcb/src/data/lessons/loader.ts`; không dùng đường dẫn tổng hợp
`src/data/lessons.json` trong fixtures.json cũ làm bằng chứng runtime.

| ID acceptance/fixture                    | Dữ liệu thật và expected cần chứng minh                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S09-EN-AC01 / s09-en-lesson-1-last-turn  | Bài 1 “Giới thiệu bản thân”, 20 turns, chunk-000; `?lesson=1#luot-20`, cả A/B: đúng lượt/focus, direct/reload/history; tới đích ≤2 kích hoạt.                 |
| S09-EN-AC02 / s09-en-lesson-2-switch     | Bài 2 “Một ngày bình thường của tôi”, 20 turns, chunk-000; đổi bài/hash khi audio/role-play đang chạy: hủy chuỗi cũ, không phát/chấm lại, không thêm điểm.    |
| S09-EN-AC03 / s09-en-lesson-11-load-race | Bài 11 “Trả phòng khách sạn”, 20 turns, chunk-001; trì hoãn tải rồi chuyển bài 1/owner: không nhận response hoặc focus cũ; HTTP lỗi có Retry.                 |
| S09-EN-AC04 / s09-en-invalid-targets     | `lesson=0`, `lesson=abc`, rỗng, lặp, id không tồn tại; bài 1 `#luot-0`, `#luot-21`, malformed/hash lạ: fallback đúng cấp, không mở nhầm bài.                  |
| S09-EN-AC05 / s09-en-result-absent       | Reload bài 1 `#ket-qua`: thông báo rỗng, không điểm giả/request grading; memory khác owner/direction không hiện.                                              |
| S09-EN-AC06 / s09-en-result-long-mock    | Cần tạo evaluation tổng hợp có explanation dài và original trùng nhau; kiểm disclosure/focus/summary và không suy turn identity. Không phải evidence sư phạm. |

Các ca trên cần browser với audio/provider mock, đếm side effect, keyboard/reduced
motion và ma trận §2.5; chưa chạy. 20 turns là số đọc từ dữ liệu, chưa đo chiều cao
app hay chứng minh bài dài. Fixtures.json cũ giữ trạng thái lịch sử; bảng này là
contract fixture mới, không nâng các anchor null cũ thành đã triển khai.

### 2.8. B3 — Contract bài lập trình

**CLOSED — DESIGN CONTRACT ONLY**, cùng nguồn/reviewer/SHA ở §2.7.
`pages/subjects/programming/ProgrammingLessonPage.tsx` sở hữu map dưới đây.
Tái dùng StepRail/StepBar, chỉ một thanh trong DOM và `aria-current="step"` đúng.

| Step key     | stepIndex (0-based) | Nhãn         | Hash/DOM id |
| ------------ | ------------------- | ------------ | ----------- |
| concept      | 0                   | Khái niệm    | #concept    |
| example      | 1                   | Ví dụ mẫu    | #example    |
| predict      | 2                   | Dự đoán      | #predict    |
| parsons      | 3                   | Xếp code     | #parsons    |
| make         | 4                   | Tự viết      | #make       |
| done         | 5                   | Về nhà       | #done       |
| Đầu bài      | 0                   | Tên bài      | #dau-bai    |
| Kết quả Make | 4                   | Kết quả chấm | #ket-qua    |

`#ket-qua` là đích con của Make, không phải bước thứ bảy; `done` không đồng nghĩa
đã đạt bài. Thêm shortcut “Kết quả chấm” để tới kết quả ≤2 kích hoạt.

1. **Hydrate/precedence:** nạp đúng bài → canonical pathname giữ toàn bộ query/hash
   → chờ owner/session hydrate. Hash hợp lệ thắng bước resume nhưng giữ mọi trường
   draft hợp lệ (`code`, `predictChoice`, `arranged`, `hintsShown`, `sampleViewed`).
   Mở bình thường không hash dùng bước resume hợp lệ, nếu không có thì 0.
2. **Stale:** không prefill hay ghi đè stale draft bằng bước URL trước quyết định;
   modal giữ focus. “Dùng lại” nhận cả draft/bước stale rồi áp hash; “Bắt đầu mới”
   hoặc đóng modal dùng draft mới rồi áp hash. Không hash: dùng bước stale khi nhận
   lại, hoặc 0 khi bắt đầu mới. Hash sai/malformed về concept và focus đầu bài, giữ
   draft; step lưu ngoài [0,5] fallback 0, không truy cập STEPS ngoài phạm vi.
3. **History/storage:** chọn đích khác push một entry, cùng đích chỉ focus;
   Back/Forward resolve không push. Back về entry không hash dùng bước ghi trong
   history entry, thiếu metadata về đầu bài, không lấy resume vừa bị thay đổi.
   Giữ `?khoa=` và query khác qua bare-id/slug cũ/legacy redirect. Storage event mới
   vẫn theo chính sách draft hiện tại; hash hợp lệ giữ quyền quyết định bước UI.
   Không đổi chính sách đồng bộ chung trong slice điều hướng này.
4. **Kết quả:** heading `#ket-qua` luôn có trong Make. Đang grading nói “Đang chấm”,
   có thể hiện ca đã trả về nhưng chưa kết luận toàn bài. `results=null` sau direct
   open/reload nói “Chưa có kết quả chấm trong lần mở bài này”, link `#make`.
   Đã dừng nhưng thiếu ca nói rõ chưa đầy đủ. Chỉ trình bày hoàn tất lượt chấm khi
   đã dừng và đủ số test của bài; không dùng `passed` một mình và không coi kết quả
   client là xác nhận lưu server. Jump giữ results memory cùng phiên, reload không
   phục hồi results/output ví dụ/parsonsChecked từ draft. Predict explanation có
   thể suy từ lựa chọn đã khôi phục; không gọi đó là lượt trả lời mới.
5. **Owner isolation:** kết quả và callback bất đồng bộ phải gắn owner/bài/phiên;
   đổi owner/bài vô hiệu hóa kết quả và response cũ trước khi render. Hiện LessonBody
   chỉ key theo lesson id, hook reset session không tự reset results: đây là gap
   triển khai bắt buộc, không được hứa result anchor an toàn trước khi có test.
6. **Không thêm side effect:** jump không gọi runExample, gradeMake, Parsons onCheck,
   mở sample, thêm SRS hay hoàn thành bài. Giữ LessonBody mount khi chỉ đổi hash;
   run đã được người dùng bắt đầu tiếp tục, không khởi động lần mới. DOM/fetch
   LivePreview chỉ chạy sau “Xem trang chạy”; quay lại Make không tự chạy script.
   Mount hiện gọi saveLessonProgress in_progress: acceptance đếm request phát sinh
   thêm do jump, không yêu cầu direct open có tổng request bằng 0.
7. **Focus:** heading mỗi bước có id cố định/tabIndex=-1, kể cả Predict/Parsons.
   Sau đúng bước render mới focus rồi scroll tránh header; không tự focus editor.
   Kết quả rỗng vẫn focus heading kết quả. Đổi bài/owner/location hủy focus callback;
   modal stale ưu tiên. Fallback đầu bài phải có heading nhìn thấy được (h1 hiện
   sr-only). Áp ma trận keyboard/viewport/reduced motion §2.5.

**Gap source:** canonical redirect và `components/LegacyProgrammingRedirect.tsx`
chưa giữ hash; schema step chỉ nonnegative; `gradeMake` cập nhật results từng test
trong khi passed dùng allTestsPassed ngay. S09 cần phân biệt trạng thái trình bày;
nếu phải sửa lifecycle passed/xóa draft/ghi completion, tách review và scope trước
source, không âm thầm đổi grader hoặc saveLessonProgress.

| ID acceptance/fixture                                                        | Dữ liệu và expected cần chứng minh                                                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| S09-P-AC01 / s09-p-six-anchors                                               | `p1-u1-l1`: sáu hash đúng bước/heading; shortcut kết quả ≤2 kích hoạt.                                       |
| S09-P-AC02 / s09-p-url-over-resume                                           | Resume Make + #predict → Predict, mọi trường draft giữ nguyên.                                               |
| S09-P-AC03 / s09-p-stale-adopt, s09-p-stale-discard                          | Cả hai quyết định stale + hash; không prefill/ghi đè trước quyết định, focus không thoát modal.              |
| S09-P-AC04 / s09-p-invalid-target                                            | Hash lạ/malformed/step 99 → concept/đầu bài, không crash/chạy code.                                          |
| S09-P-AC05 / s09-p-result-empty, s09-p-result-partial, s09-p-result-complete | Direct/reload rỗng; pending/thiếu ca không báo hoàn tất; jump giữ kết quả memory cùng phiên.                 |
| S09-P-AC06 / s09-p-history-canonical                                         | Bare id, slug cũ, legacy, Back/Forward giữ query/hash và focus; entry không hash dùng metadata hoặc đầu bài. |
| S09-P-AC07 / s09-p-no-rerun                                                  | Đếm runner/grade/completed/SRS trước–sau jump: không tăng; quay lại Make không tự chạy LivePreview.          |
| S09-P-AC08 / s09-p-owner-load-race                                           | Đổi owner/bài, tải/chấm chậm: không hiện kết quả hoặc focus từ phiên cũ.                                     |
| S09-P-AC09 / s09-p-keyboard-layout                                           | Keyboard, mobile/desktop, reduced motion, heading thấy được và không bị che.                                 |

Nguồn fixture pin SHA audit §2.7: `packages/subject-programming/lessons/p1u1.ts`
(`p1-u1-l1`, bốn test Make để tạo partial/mixed), `p3u10.ts` cùng thư mục
(`p3-u10-l1?khoa=git`, ngữ cảnh khóa), `p3u6.ts` (`p3-u6-l2`, DOM preview;
coverage nền ở `e2e/programming-lesson.spec.ts`). Các fixture ID ở bảng là kế hoạch
unit/integration/E2E, chưa PASS; chưa đo chiều cao app, chưa có browser/AT evidence.

## 3. S10 — Phản hồi sư phạm và rubric nội dung

**Outcome:** phản hồi giúp người học hiểu nguyên nhân và có đúng một hành động thử tiếp,
phù hợp mục tiêu bài, chiều học và trình độ. Phụ thuộc M1 và S08; không thay grader.

Khuôn: ghi nhận cụ thể phần đã làm được → chỉ ra nguyên nhân với chứng cứ từ câu trả lời
→ một bước tự thử/gợi ý. Đúng thì giải thích điểm đúng thay lời khen chung chung; sai
thì không phán xét con người. Thiếu dữ kiện hoặc lỗi hệ thống phải gọi đúng tên,
không biến timeout thành trả lời sai. Nhãn UI độc lập ngôn ngữ đích/giải thích.
A1–A2 dùng chỉ dẫn ngắn và ví dụ đơn; B1–B2 thêm đối chiếu cơ chế; C1–C2 có sắc thái
khi mục tiêu cần. Đây là ba nhóm kiểm mẫu, không phải chứng nhận CEFR.

Chế độ luyện cho tự thử trước khi mở gợi ý/lời giải. Chế độ đánh giá giữ blueprint,
quy tắc hiển thị lời giải và điểm hiện có; không đưa gợi ý làm lộ đáp án giữa lượt thi.
Trước source liệt kê từng caller thuộc chế độ nào và người sở hữu contract đó.

### Bộ mẫu và thang đánh giá

Version hóa bộ mẫu tối thiểu 40 ca theo goal: 12 English (hai chiều × ba nhóm trình độ
× đúng/sai), 16 STEM (bốn môn × đúng/sai/thiếu dữ kiện/ngộ nhận), 8 lập trình (bốn loại
lỗi × đúng/sai), 4 lỗi hệ thống. Mỗi ca ghi source bài/câu, input đã khử định danh,
expected reason, ngôn ngữ, trình độ, mode, reviewer và trạng thái duyệt. Mẫu không có
source/đáp án xác minh giữ nhãn chưa duyệt, không phát vào lớp học.

| Trục                   | 0 — không đạt                                | 1 — cần sửa             | 2 — đạt                                             |
| ---------------------- | -------------------------------------------- | ----------------------- | --------------------------------------------------- |
| Kiến thức/chứng cứ     | Sai kiến thức hoặc bịa kết luận              | Đúng nhưng thiếu căn cứ | Đúng, đối chiếu được nguồn/câu trả lời              |
| Giải thích nguyên nhân | Không liên quan hoặc đổ lỗi người học        | Chỉ nhắc đáp án         | Nêu nguyên nhân cụ thể, ví dụ đúng                  |
| Ngôn ngữ/trình độ      | Sai chiều hoặc không hiểu được               | Dài/khó hơn cần thiết   | Vừa trình độ và đúng ngôn ngữ                       |
| Bước tiếp theo         | Không thể thực hiện hoặc lộ đáp án trái mode | Có nhưng mơ hồ          | Một hành động rõ, phù hợp mode                      |
| Trung thực/an toàn     | Giả lưu/điểm/chứng nhận                      | Trạng thái còn mơ hồ    | Phân biệt hệ thống và học tập, không vượt authority |

Ngưỡng dự kiến để duyệt từng mẫu: kiến thức và trung thực phải 2, không trục nào 0,
tổng ≥9/10. Không dùng điểm trung bình để che một ca sai kiến thức. Chuyên gia phù hợp
môn/ngôn ngữ review và ghi nhận bất đồng; ca bất đồng chờ phân xử, agent tự chấm chỉ là
sàng lọc. Ngưỡng này là quy tắc nội bộ cần review, không phải thang chuẩn hóa nghiên cứu.

**Evidence:** bộ mẫu có version, rubric từng ca, danh tính/vai trò reviewer và ngày duyệt,
link thay đổi nội dung; negative controls cố tình sai chiều, sai kiến thức, lỗi mạng
bị nói thành lỗi học viên phải bị loại. Chưa có chuyên gia thì trạng thái WAITING,
không viết “đã đạt sư phạm”.

## 4. S11 — Từ sửa lỗi đến tự thử và ôn đúng chỗ

**Outcome:** từ phản hồi người học quay lại đúng phần cần sửa, tự thử rồi ôn bằng cơ chế
hiện có. Phụ thuộc S09/S10 và S03 lọc đúng môn.

Dùng `reviewSlot`/`onRetry` của ActivityResult và route hiện có từ MistakeBank.
Trước triển khai lập bảng khả năng theo nguồn: STEM có questionIndex; English hiện
chỉ quay lại theo loại hoạt động; lập trình kiểm khả năng định vị bài thật. Nơi thiếu
định danh hiển thị nhãn đúng “Mở phần luyện…” thay vì hứa “Sửa đúng câu này”. Không
sinh bảng lỗi thứ hai để lấp thiếu metadata.

### Hợp đồng và nghiệm thu

- Liên kết mang đúng subject/content/question có kiểm tra hợp lệ, giữ return path;
  id đã xóa/không tồn tại báo rõ và cho về mục lục đúng môn, không rơi sang môn khác.
- Khi luyện, câu trả lời cũ/lời giải không tự lộ trước lượt tự thử mới; có nút xem lại
  rõ ràng. Không ghi một lần xem lời giải thành bằng chứng đã trả lời đúng.
- Làm lại tạo attempt mới theo cơ chế caller hiện có; retry gửi pending dùng cùng
  attempt theo contract evidence, không nhầm hai hành động.
- Lỗi chỉ hết theo evidence hợp lệ hiện có; click CTA, AI gợi ý hay tự đánh giá thẻ
  không trực tiếp nâng mastery hoặc biến kết quả local thành server-confirmed.
- Hẹn ôn/ôn lại có nhãn và trạng thái đã lưu/đang chờ/lỗi đúng khả năng storage thật;
  thao tác lặp không tạo thẻ trùng. Không đổi lịch SRS hay cách tính mastery trong slice.
- Kiểm đúng môn với hàng đợi xen kẽ bốn môn và cap=1; ôn tổng ở hub không hồi quy.
  Lỗi mạng, hết phiên, nguồn không còn và không có lỗi cần ôn đều có đường phục hồi.

**Evidence:** E2E câu sai → tự thử → evidence mới → sổ lỗi cập nhật, case local/pending
và retry mất response; test route không tồn tại và source English chưa có câu cụ thể;
kiểm keyboard/focus ở lần quay về. Tái dùng tests evidenceMistakes/MistakeBank và
FlashcardReview, không dựng API kiểm thử song song.

## 5. S12 — Audit toàn luồng và pilot

**Outcome:** có bằng chứng sử dụng được, không mất bài/xác nhận lưu sai và báo cáo học
trì hoãn có giới hạn rõ. Phụ thuộc S01–S11 đã tích hợp, không lấy checklist Draft làm DONE.

### Audit kỹ thuật

Ghi SHA, Node 22, môi trường, fixture và thời điểm cho từng lần chạy. Complete gate:
`npm run build`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`,
`npm run test:e2e`; size/budget khi đổi bundle. Không tái sử dụng số pass từ SHA cũ.
Ma trận goal bao gồm onboarding/placement, English 2×2, bốn STEM, lập trình, nói/viết
với provider mock; rỗng/tải/dữ liệu/lỗi/phản hồi và viewport/theme có evidence hoặc N/A
có lý do. Mọi contrast incomplete phải kiểm chứng; 0 vi phạm A/AA, nội dung ≥7:1.
Keyboard, NVDA/VoiceOver và thiết bị thật ghi đúng thiết bị đã thử; emulation không
được đổi tên thành kiểm thiết bị thật. Lỗi audit ghi bốn ô lỗi/ở đâu/mức/sửa.

### Pilot và đo trì hoãn

Chỉ bắt đầu khi có người lớn tự nguyện và môi trường được phép. Tối thiểu 8 người,
bao gồm người mới, quay lại và người dùng công nghệ hỗ trợ; không tuyển trẻ em ở lượt
đầu. Không thu dữ liệu nhạy cảm không cần thiết; dùng mã người tham gia, công bố cách
lưu/xóa dữ liệu và chỉ ghi âm/màn hình khi họ đồng ý. Chưa tuyển được thì WAITING.

Mỗi người năm nhiệm vụ: vào đúng bài, thử trả lời, giải thích lại lỗi theo cách hiểu
của mình, ôn đúng môn, phục hồi lỗi lưu. Kịch bản và đáp án chấm nhiệm vụ khóa trước
phiên; người điều phối không hướng dẫn trước, mọi trợ giúp được ghi là có hỗ trợ.
Báo số hoàn tất độc lập, thời gian, lỗi, trợ giúp và bỏ cuộc. Với đúng 8 người: đích
≥36/40 lượt hoàn tất độc lập, không có mất bài hoặc xác nhận lưu sai. Nếu tăng mẫu,
báo cả tử/mẫu và tỷ lệ ≥90%; không loại lượt thất bại để nâng tỷ lệ.

Đo ban đầu, sau phiên và ngày 7/14 bằng câu tương đương đã chuyên gia rà, cùng mục tiêu
và mức khó, khác đáp án bề mặt. Ghi dữ liệu thiếu và số người còn tham gia từng mốc;
không điền giả điểm thiếu, không tuyên bố quan hệ nhân quả/tăng điểm chung từ pilot nhỏ
không có nhóm đối chứng. Chưa đặt KPI tăng điểm khi chưa có baseline. Hiểu phản hồi,
hoàn tất nhiệm vụ và kết quả học là ba phép đo riêng.

**Evidence:** protocol có version, phiếu nhiệm vụ, nhật ký lỗi khử định danh, kết quả
rubric, báo cáo ngày 7/14 và giới hạn. Không giả review chuyên gia hay người tham gia.
Goal chỉ hoàn tất khi evidence trên main và chủ sản phẩm nghiệm thu theo goal.

## 6. Phụ thuộc, rollout và rollback

S09 → S10 (có thể chuẩn bị mẫu độc lập) → S11 → S12; mỗi slice nhỏ có spec được review,
Approved for implementation và merge trước source theo delivery loop. Hiện tất cả vẫn
Draft. Chạy codemap và chốt exclusive file ownership trước giao code song song vì
ActivityResult/MistakeBank/route là các điểm dùng chung.

Rollout bắt đầu ở tập bài mẫu local, rồi mở rộng các caller sau complete gate và review
ảnh/nội dung. Không tự push/merge/deploy hay mở pilot ngoài môi trường đã cho phép.
Rollback bằng revert slice UI/content và caller tương thích, giữ dữ liệu evidence,
nháp, lịch ôn và attempt đã lưu; không xóa lịch sử để làm kết quả đẹp. Sai kiến thức,
sai môn, mất bài, giả trạng thái lưu hoặc lỗi a11y chặn học là lý do dừng mở rộng và sửa
trước. Chưa có reviewer/pilot thì phần tương ứng WAITING, không ngăn báo cáo trung thực
phần kỹ thuật đã hoàn tất.
