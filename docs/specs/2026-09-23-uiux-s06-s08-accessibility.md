# S06–S08 — Cổng tương phản, zoom và phản hồi quiz

| Thuộc tính       | Giá trị                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| Goal             | [UI/UX và sư phạm](../goals/2026-09-23-uiux-su-pham.md), M2/S06–S08                                            |
| Trạng thái       | **S08 và S07b hẹp Approved for implementation** — chưa nghiệm thu; S06 đã merge, S07 rộng còn ma trận thủ công |
| Baseline         | [Audit 23/09](../research/2026-09-23-uiux-su-pham-baseline.md), SHA `1d9e247e`                                 |
| Đơn vị giao việc | Ba PR riêng: S06, S07, S08; không gộp source vào PR đặc tả                                                     |

## 1. Phạm vi và phụ thuộc

S06 khép lỗ hổng F5 của cổng AAA và quản lý kết quả chưa kết luận. S07 sửa F3,
cho phép zoom và kiểm chứng thao tác ở bố cục hẹp. S08 sửa F4, thêm ngữ nghĩa lựa chọn,
phản hồi chữ và thông báo cho công nghệ hỗ trợ trong quiz hiện có.

S06 đã tích hợp tại PR #1122; S07a tại #1126. S08 phụ thuộc phần cổng S06 đã tích hợp.
Trước mỗi PR phải đối chiếu main, chạy impact map cho hotspot, xác định chính xác file
được sửa. Quyết định S08 dưới đây chỉ duyệt phạm vi triển khai, không chứng nhận AC.

Không sửa thuật toán ra đề/chấm điểm, thời điểm công bố đáp án của bài thi, mastery,
thanh toán hoặc API. Không đổi framework, không quét sửa màu toàn repo, không dùng AI
để tự chứng nhận đạt AAA. Lỗi ngoài tập màn phải ghi nhận và tách slice nếu phạm vi lớn;
không thêm ngoại lệ để đưa gate về xanh.

## 2. S06 — Chữ thực và kết quả chưa kết luận

### Hiện trạng và điểm chạm

`e2e/a11y-aaa.spec.ts` có `CONTENT_SELECTOR` gồm
`h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,td,th,article,main > div`.
`countContentNodes()` gọi `el.matches(content)` nên bỏ sót target `span`/`em` nằm
trong `p`. `CHROME_ANCESTOR` hiện loại toàn bộ tổ tiên `nav,header,footer,button,a,
[role="button"],[role="tab"],label,input,select`; cách này cũng có thể loại tiêu đề
đọc trong header và liên kết trong đoạn văn. `scanAaa()` chỉ lấy `violations`, ép
target về `n.target[0]`, chưa xử lý `incomplete`. Cổng AA `scan()` trong
`e2e/a11y.spec.ts` cũng chỉ lấy `violations`.

Tái sử dụng `freezeAnimations()` và `waitForStableDom()` ở `e2e/helpers/axe.ts`,
nhưng chờ trạng thái nội dung thật xuất hiện trước quét; DOM có số node ổn định chưa
chứng minh đã tải xong. Không tạo một bộ quét độc lập thay cổng hiện hữu.

### Hợp đồng dự kiến

- Phân loại chữ theo vai trò đọc thực tế, xét phần tử và tổ tiên nội dung; một
  `closest(CONTENT_SELECTOR)` đơn thuần chưa đủ vì `article` có thể chứa cả nút.
  Nội dung đoạn văn/tiêu đề và con inline của chúng cần 7:1; nhãn điều hướng/nút
  thuộc AA. Liên kết trong văn xuôi vẫn là chữ đọc. Tiêu đề ở header không bị loại
  chỉ vì nằm trong header. Trường hợp mơ hồ phải được báo để review, không tự bỏ qua.
- Giữ target đầy đủ và đường dẫn route/theme/state khi báo lỗi. Selector không
  resolve được, shadow/frame target chưa hỗ trợ phải là chưa kết luận, không trả 0.
- Ngoài rule axe AAA, kiểm quy định dự án **7:1 cả tiêu đề lớn**, không lấy ngưỡng
  chữ lớn của axe làm bằng chứng đủ. Phép đo cần màu computed sau compositing alpha
  qua nền tổ tiên; gradient/ảnh/nền không xác định không được mặc định trắng.
- Kết quả mỗi node: đạt, không đạt hoặc chưa kết luận; ghi rule, target, foreground,
  background, tỷ lệ khi đo được và lý do chưa kết luận. AA vẫn yêu cầu 0 vi phạm.
- Mọi `incomplete` cần bằng chứng kiểm thủ công tại cùng SHA và trạng thái, hoặc
  phép đo bổ sung tái lập. Chưa có kết luận thì PR ở VERIFYING/WAITING, không báo
  AAA pass. Hồ sơ kết luận thủ công không phải allowlist vĩnh viễn: thay nội dung,
  CSS, theme hoặc trạng thái liên quan phải đo lại. Không disable thêm rule.

### AC và kiểm chứng S06

1. Negative control `p > span`, `p > em`, heading có con inline với chữ 16px màu
   `#666` trên trắng bị gate bắt; ca heading lớn tỷ lệ trong khoảng 4.5–7 cũng bị bắt
   bởi quy định dự án. Màu test cố tình sai chỉ nằm trong fixture.
2. Control đạt có chữ ≥7:1 được chấp nhận; nút AA đạt không bị phân loại nhầm là
   văn xuôi. Link trong đoạn văn và heading trong header phải được kiểm 7:1.
3. Control token CSS, nền bán trong suốt nhiều lớp, node biến mất và selector không
   resolve có kết quả đúng; gradient/ảnh không đo chắc phải báo chưa kết luận.
4. Control axe trả `incomplete` không được tạo báo cáo đạt; unit kiểm aggregation và
   E2E kiểm một fixture thật mà browser/axe hiện tại không tự kết luận được.
5. Chạy lại toàn ma trận route/theme/state của AA và AAA hiện hữu, không giảm coverage.
   Báo số node được kiểm, số chưa kết luận và kết luận từng mục; ghi phiên bản axe/browser.

File dự kiến: hai spec a11y, helper axe và test helper; sửa token/component chỉ khi có
vi phạm tái hiện và impact rõ. Negative controls phải chứng minh gate thất bại khi
cố tình đưa lỗi vào, không chỉ snapshot danh sách selector.

## 3. S07 — Zoom, reflow, focus và vùng chạm

### Hiện trạng và phương án

`apps/dhcb/index.html` khóa `maximum-scale=1.0, user-scalable=no`.
`apps/dhcb/src/index.css` đặt `touch-action: pan-x pan-y`; cần cho phép pinch zoom,
không chỉ gỡ meta. Giữ quy tắc font input cảm ứng ≥16px để tránh iOS tự zoom khi focus.
Gỡ `.disableRules(['meta-viewport'])` khỏi cổng AA và cập nhật chú thích ngoại lệ cũ
ở tài liệu vận hành trong cùng PR; goal đã chọn cho phép zoom.

Tái sử dụng `.tap-44`, `.tap-44-y`, `Modal` và `useDialogBehavior()`; không viết
focus trap mới. `Modal` đã portal ra body, có header sticky, nút đóng `w-11 h-11`,
giới hạn `85dvh`/`90dvh`. Kiểm hồi quy nội dung đầu modal, focus trap và trả focus.
Tận dụng `e2e/mobile-layout-guards.spec.ts`, `learning-ux-layout.spec.ts`,
`modal-sticky-header.spec.ts` và `helpers/learningUxScreens.ts`.

### AC và ma trận S07

1. Meta không khóa zoom; pinch zoom hoạt động trên thiết bị thật. Axe meta-viewport
   phải được chạy, không exempt. Kiểm computed touch-action của phần tử/tổ tiên liên quan.
2. Tập màn gồm Home, placement/onboarding, bài STEM và kết quả, CEFR quiz, modal mục
   lục và ô nhập đang focus. Bốn bề rộng 320/390/768/1440 × ba theme hiện hành; ghi
   route, fixture và các trạng thái loading/error/data có ở màn đó.
3. Zoom trình duyệt 200% không mất chữ/chức năng; reflow tương đương 320 CSS px không
   buộc cuộn hai chiều cho văn xuôi. Nội dung vốn cần hai chiều như bảng/code được
   cuộn trong vùng riêng, không kéo tràn toàn trang; lập danh sách và lý do cụ thể.
4. Tab/Shift+Tab/Enter/Space/Escape dùng được, ring hiện tức thì, focus không bị header,
   thanh đáy hoặc bàn phím ảo che. Modal giữ focus và trả đúng trigger khi đóng.
5. Vùng tương tác trong các màn được sửa đạt tối thiểu 44×44 CSS px theo quy định
   dự án; đo hit target, không suy từ kích thước icon. Không nới threshold của test cũ.

Viewport test hoặc `deviceScaleFactor` không thay bằng chứng zoom trình duyệt thật.
Cần ghi OS/browser/device, mức zoom, thao tác, kết quả và ảnh trước/sau ở 390/1440;
bổ sung ảnh 320 khi có reflow và bằng chứng bàn phím ảo trên thiết bị thật. Nếu chưa
có thiết bị hoặc người kiểm, ghi WAITING, không đánh dấu AC tương ứng đạt.

### Quyết định S07b — bố cục tab CEFR ở 320 px

**Approved for implementation (chỉ S07b, 24/09/2026).** Primary Codex review mã
`CefrLevelPage.tsx`, impact map và [probe 320/768](../research/2026-09-24-s07-width-matrix.md)
theo quyền người dùng đã giao tự quyết phương án và triển khai. Đây là quyết định
thiết kế kỹ thuật nội bộ; không phải phê duyệt chuyên gia bên ngoài, bằng chứng thiết
bị thật hay nghiệm thu S07 rộng. PR đặc tả phải merge trước PR source.

- Sửa duy nhất hàng sáu tab của trang cấp CEFR: dưới 340 CSS px dùng ba cột/hai hàng;
  từ 340 px giữ sáu cột. Cả sáu vùng bấm phải ≥44×44 CSS px ở 320 và 390, ba theme,
  Page zoom 200%. Không thêm cuộn ngang hoặc che tab.
- Giữ đúng thứ tự DOM, nhãn và `aria-pressed`, `?tab=` thắng nháp khi mở, keyboard
  activation/focus, bài/quiz đang dở và dữ liệu học. Không đổi quiz builder, chấm
  điểm, progress, API hay owner.
- Test hồi quy đo box/hit của sáu tab ở 320/390 với ba theme; kiểm không tràn ngang,
  chuyển tab bằng click và bàn phím. Dùng Node 22/full gate và E2E theo `AGENTS.md`.
  Nếu phép đo browser trái probe, dừng source và sửa bằng chứng; không nới ngưỡng.
- Nút điều hướng shared 36×36, heading Quiz, focus/modal, pinch và bàn phím ảo nằm
  ngoài S07b; ghi theo dõi riêng. S07 rộng vẫn **PARTIAL / WAITING**, chỉ AC vùng
  tab được kiểm sau source, không suy toàn ma trận đạt.

## 4. S08 — Quiz phản hồi bằng chữ và trình đọc màn hình

**Quyết định triển khai ngày 2026-09-23:** Người dùng giao quyền tự quyết phương án và
triển khai trong goal này. Agent S08 đã review mã trên main `b0c424c0` tại
[review contract](2026-09-23-uiux-s08-review-contract.md), PR #1129 đã merge;
primary rà lại hợp đồng và chọn các quyết định dưới đây. S08 được **Approved for
implementation** sau khi PR đặc tả này merge. Quyền duyệt triển khai không thay
bằng chứng NVDA/VoiceOver, ảnh, E2E hoặc nghiệm thu của người học.

### Hiện trạng và contract

`apps/dhcb/src/components/ExamQuestionCard.tsx` nhận `q`, `selected`, `onPick`,
`onNext`, `current`, `total`; lựa chọn đúng/sai hiện chủ yếu bằng class màu/animation.
Caller thật: `pages/subjects/english/Placement.tsx`, `components/CefrExam.tsx`,
`components/studyTabs/ListeningTab.tsx`. `studyTabs/QuizTab.tsx` quản lý `pick()`,
`next()`, `restart()`, `selected`, `answers` và lưu phiên bằng `saveQuizSession()`;
kết quả hiện dấu ✓/✗. Tái sử dụng `useQuizKeyboard()`/`resolveQuizKey()` trong
`packages/core-ui/useQuizKeyboard.ts` và `e2e/quiz-keyboard.spec.ts`.

Giữ lựa chọn là button có tên bằng nội dung đáp án, nhóm có tên từ câu hỏi; biểu thị
đã chọn bằng trạng thái accessible phù hợp (`aria-pressed` nếu giữ button), không
tự gắn role radio khi chưa triển khai hợp đồng phím radio. Khi đã trả lời, handler
và phím tắt không được ghi thêm đáp án. Trạng thái unavailable vẫn phải đọc được.

Nhóm đáp án dùng `role="group"` và `aria-labelledby`. Với câu nghe, accessible name
chỉ gồm số câu và chỉ dẫn nghe; không lộ `audioText` hoặc đáp án trước chọn. Sau chọn,
button còn nhận focus để đọc, `aria-disabled` báo không đổi lựa chọn và handler tự
chặn click/phím lặp; không dùng native `disabled` làm mất focus đang đứng ở đáp án.

Thêm chữ nhìn thấy “Đúng”, “Chưa đúng”, “Bạn đã chọn…” và đáp án đúng **chỉ ở giai đoạn
hiện tại đã cho phép công bố**; không tự thay chính sách đánh giá của caller. Tách
nhãn UI khỏi nội dung ngôn ngữ đích; phối hợp S04, không mở lại logic direction trong S08.
Icon trang trí aria-hidden, không dùng màu hoặc âm thanh hiệu ứng làm kênh duy nhất.

Một live region ổn định (`role="status"`, polite, atomic khi phù hợp) thông báo kết
quả sau thao tác chọn. Không bọc cả câu hỏi/đáp án vào live region, không thông báo
lặp khi rerender hoặc restore. Sau chọn giữ focus tại đáp án; sau Next đưa focus
tới câu mới có tên/số câu, sau kết thúc tới tiêu đề kết quả; Restart trở về câu đầu.
Không tự phát TTS mới, không tranh âm thanh với trình đọc màn hình.

Thông báo là state của sự kiện chọn hợp lệ, tách khỏi `selected`: vào quiz/restore/
rerender/đổi UI không tự phát lại; Next và Restart xóa status cũ. Một node status
ổn định dùng polite và atomic. Component sở hữu câu focus heading mới; caller sở hữu
heading kết quả sau câu cuối. Phạm vi source vì vậy gồm `ExamQuestionCard`, `QuizTab`,
`CefrExam`, `ListeningTab`, `Placement` và hook bàn phím sau impact map, không chỉ hai
component đáp án. Không thay thời điểm công bố kết quả của caller hiện hữu.

`useQuizKeyboard` bỏ sự kiện repeat/defaultPrevented/Ctrl/Alt/Meta, vùng nhập liệu,
modal và nút tương tác khác khỏi shortcut Enter/Space toàn cửa sổ. Enter/Space trên
button dùng native activation. Guard ở `pick`/`next` bảo vệ một lần ghi, kể cả hai
callback trước lượt render tiếp theo. Review mọi consumer của hook trước khi sửa;
không đổi shortcut ngoài quiz này nếu chưa có test tương thích.

Bảng kết quả không cắt cụt câu/đáp án dài; chữ “Đúng/Chưa đúng” nhìn thấy được,
icon trang trí `aria-hidden`. Dùng transition màu và nhánh reduced motion; ring
focus hiện ngay. Giữ schema phiên, chấm điểm và dữ liệu học hiện hành.

### AC và kiểm chứng S08

1. Đúng/sai/đã chọn phân biệt được khi bỏ màu và tắt âm thanh. Chữ phản hồi/đáp án đọc
   đạt 7:1 theo S06; nhãn điều khiển đạt AA. Đủ ba theme và hai ngôn ngữ UI.
2. Mouse, Tab/Enter/Space và phím số cho cùng một kết quả; chọn lại/double-click
   không ghi lặp. Phím quiz không chiếm input hoặc modal đang mở.
3. Next/last/Restart và restore giữa câu không mất dữ liệu, không đổi chấm điểm,
   không gây thông báo lặp; unit cover state transitions, integration cover caller.
4. Mở rộng E2E quiz keyboard và quét AA/AAA ở trạng thái chưa trả lời/đúng/sai/kết quả;
   fixture cố định đáp án, provider mock, không gọi TTS/AI trả phí.
5. Kiểm NVDA và VoiceOver thật: tên câu/đáp án, trạng thái đã chọn, kết quả đúng một
   lần, chuyển câu, kết thúc, restore, thứ tự focus. Ghi phiên bản OS/browser/AT và
   transcript thao tác. DOM có aria-live không đủ chứng minh AT đọc đúng; thiếu AT
   thì mục này WAITING. Không tự nhận đã kiểm chỉ từ accessibility snapshot.

Không cần migration. Chỉ mở rộng component dùng chung khi impact map xác nhận các
caller; không sửa đồng thời cùng file với S04/S05 hoặc nhánh placement đang triển khai.

## 5. Gate, bằng chứng và rollback theo PR

Mỗi PR source phải có build, typecheck, lint, format:check, unit và test:e2e đầy đủ
theo AGENTS, ngoài kiểm targeted của slice. Báo SHA, lệnh, kết quả thật; browser crash,
test chưa chạy hoặc incomplete không chuyển thành pass. Negative controls thất bại
đúng ý là evidence của phép thử, không phải lý do bỏ lỗi suite sản phẩm.

Lưu báo cáo sạch cùng ảnh/trace có thể truy cập từ PR, không chứa dữ liệu người học
thật/token. Mỗi AC liên kết artifact riêng. Audit baseline là evidence trước sửa,
không dùng lại làm evidence sau sửa. Phần hợp đồng S08 được duyệt bằng review mã;
review đó chưa chạy test, trình đọc màn hình, thiết bị hay đo tương phản mới.

Rollback S06: revert phần thay đổi gate/helper của PR nếu công cụ sai, ghi rõ lỗ hổng
F5 mở lại và giữ PR sau bị chặn; không công bố AAA đạt. Rollback S07: revert slice
nếu thao tác bị chặn, báo F3 mở lại; không thêm ngoại lệ meta-viewport mới để xanh CI.
Rollback S08: revert phần hiển thị/focus của slice, giữ nguyên dữ liệu phiên và chấm
điểm, ghi F4 còn mở. Revert không phải nghiệm thu; lỗi gốc quay lại phải được theo dõi.
Không có migration, không cần sửa dữ liệu hoặc tác động production trong các rollback này.

## 6. Điều kiện chuyển trạng thái

- [ ] Review hợp đồng phân loại chữ, incomplete và ngưỡng 7:1.
- [ ] Review từng PR scope và phụ thuộc, gồm phối hợp S04/S05.
- [x] S08 đã được review và duyệt phạm vi triển khai; PR đặc tả phải merge trước source.
- [ ] Mỗi slice có automated evidence và manual evidence còn thiếu được nêu rõ.
- [ ] Chỉ đánh dấu hoàn tất sau tích hợp và kiểm chứng trên main; không suy từ phê duyệt spec.
