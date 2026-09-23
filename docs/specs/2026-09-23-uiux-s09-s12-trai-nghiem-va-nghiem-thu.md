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

### Hợp đồng và nghiệm thu

- Anchor lấy từ section/câu có id ổn định trong bài; mở trực tiếp URL hoặc Back/Forward
  tới đúng phần. Hash sai rơi về đầu bài, không crash. Trước source chốt tên anchor,
  tương thích link `mistakeRoutes` hiện hữu và các caller của `ActivityResult`.
- Jump không submit, chấm lại, reset answers/checked hoặc sinh attempt mới. Focus tới
  heading/field đích, không bị sticky header che; đóng mục lục trả focus về nút mở.
- Mục lục → phần đích và tóm tắt kết quả → câu cần sửa đều ≤2 thao tác kích hoạt.
  Báo riêng số phím Tab cần để tới control, không dùng phép đếm hai click để suy ra a11y.
- Nháp/URL/scroll phục hồi theo cơ chế hiện có; navigation trong bài không làm mất nháp.
  Không hứa persistence xuyên reload cho màn chưa có; test ghi rõ màn nào hỗ trợ.
- Cả năm trạng thái ActivityResult còn chữ trung thực: chỉ passed được gọi hoàn thành;
  pending/local không giả đã lưu server. Thu gọn không làm live region đọc lặp toàn bảng.
- 320/390/768/1440px, ba theme, zoom 200%, keyboard/reduced motion: không tràn ngang
  ngoài vùng code/bảng có cuộn có nhãn; chữ ≥7:1, target ≥44px, focus hiện rõ.

**Evidence:** prototype trước code, ảnh trước/sau cùng bài và viewport 390/1440;
E2E jump, deep-link, Back, draft, trạng thái lưu và focus; component test biến thể
ActivityResult. Chọn mẫu một bài mỗi môn STEM, một bài English dài và một bài lập trình
nhiều bước; ghi id thật khi chuẩn bị fixture, không dùng trang dựng giả làm coverage.
Chạy codemap trước sửa các hotspot trên. Nếu thay shared component ảnh hưởng rộng,
tách PR component tương thích rồi PR nối từng caller.

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
