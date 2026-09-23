# S03–S05 — Đúng môn, đúng chiều học và câu điền từ hợp lệ

| Thuộc tính     | Giá trị                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------- |
| Goal           | [UI/UX và sư phạm](../goals/2026-09-23-uiux-su-pham.md), M1/S03–S05                         |
| Trạng thái     | **Draft** — chưa review, chưa Approved for implementation, chưa merge, chưa triển khai      |
| Baseline       | `1d9e247e`; [F6–F8 và giới hạn bằng chứng](../research/2026-09-23-uiux-su-pham-baseline.md) |
| Cách giao việc | Ba slice, ba PR riêng; S05 phụ thuộc S04; không sửa đồng thời các mode Practice             |

## 1. Outcome và giới hạn chung

Người học ôn đúng môn đã mở; ngôn ngữ giao diện không đổi nội dung ngôn ngữ đang học;
câu điền từ có đúng một chỗ trống và đáp án khôi phục được câu gốc. Không thay thuật toán
FSRS, mastery, cấp quyền, usage, chấm CEFR/IELTS hoặc API server. Không gọi LLM để đoán
đáp án hay biến đổi câu. Không sửa hàng loạt từ điển để làm đẹp số liệu độ phủ.

Các đường dẫn rút gọn dưới đây thuộc `apps/dhcb/src/`, trừ `e2e/` và đường dẫn có ghi
rõ gốc khác. Trước mỗi PR chạy codemap impact cho các điểm chạm, đọc lại main và cập
nhật spec theo mã thực. Spec này được soạn bằng đọc mã, chưa chạy test hoặc đo lại dữ liệu.

## 2. S03 — Hàng đợi ôn riêng từng môn

### Hiện trạng và điểm chạm

`pages/learning/StemReview.tsx` chốt `hangDoiRef` bằng `getDueStemCards(user.id, cap)`
nhưng không truyền môn của route. `lib/stemSrs.ts:getDueStemCards` đưa toàn bộ thẻ STEM
vào `lib/srs.ts:getDueBy`. Hàm sau lọc đến hạn, rồi khi có limit mới sắp theo due tăng,
difficulty giảm và cắt. Do đó lọc môn sau lệnh hiện tại sẽ vẫn mất thẻ hợp lệ ở ngoài cap.

`pages/learning/ReviewHub.tsx` và `lib/reviewQueue.ts` cần giữ hàng đợi tổng xuyên môn.
`hydrateStemCards` bỏ thẻ không còn nội dung; đây là hành vi hiện có, không tự bù thẻ
ngoài cap trong S03. `reviewStemCard` tiếp tục gọi `reviewWord`, không có đường ghi mới.

### Hợp đồng được đề xuất

Giữ nguyên `getDueStemCards(uid, limit?)` và kết quả cho caller cũ. Thêm hàm thuần đọc
`getDueStemCardsForSubject(uid, subjectId: StemSubjectId, limit?)`, lọc
`getAllStemCards(uid)` theo subjectId **trước** khi gọi `getDueBy` với limit cũ.
Không copy thuật toán sắp xếp; không đổi key `stem:<subject>:<lesson>:<index>`.
`StemReview` dùng subject đã qua `getStemSubject`; route sai tiếp tục Navigate về hub.

Khi user/môn/cap đổi, reset nội dung hiển thị sang loading trước khi hydrate hàng đợi
mới; không để thẻ môn cũ xuất hiện hoặc nhận rating trong lúc tải. Response cũ đến muộn
không được thay hàng đợi mới. Giữ hàng đợi ổn định khi chấm trong cùng một phiên;
không tính lại sau mỗi lần review làm bỏ qua thẻ kế tiếp.

### AC và negative cases

- Fixture trộn đủ Toán/Lí/Hoá/Sinh: với từng môn và cap=1, thẻ đúng môn được chọn dù
  thẻ khác môn có due sớm hơn. Hai thẻ cùng môn due bằng nhau giữ thứ tự difficulty cũ.
- Không có thẻ đúng môn đến hạn: empty state của môn đó, không lấy thẻ môn khác bù.
- Không cap: trả mọi thẻ đến hạn đúng môn; cap=2 không vượt hai ref. Quy tắc query cap
  sai tiếp tục do `lib/reviewRoutes.ts:docCapTuQuery` xử lý, không thêm diễn giải khác.
- User khác không thấy thẻ user trước; đổi route nhanh/lỗi hydrate/retry không hiện
  thẻ cũ. Rating chỉ ghi key đang có trong hàng đợi hiển thị của phiên hiện tại.
- `ReviewHub` giữ đủ thẻ xuyên môn và hạn mức phiên cũ; thẻ chưa đến hạn/namespace khác/
  key rác không lọt vào hàng đợi. Thẻ thiếu nội dung vẫn bị bỏ an toàn.
- Bổ sung `lib/stemSrs.test.ts` và `e2e/review-hub.spec.ts`; E2E seed localStorage,
  mock API, kiểm câu hỏi thực trên route môn và kiểm link mở bài đúng môn.

Rollback: revert đồng bộ helper, caller và test của S03; không migration hoặc phục hồi
kho thẻ vì không thay dữ liệu. Phụ thuộc S00; không phụ thuộc implementation S02.

## 3. S04 — Tách ngôn ngữ giao diện và chiều học

### Hiện trạng và điểm chạm

`pages/learning/Practice.tsx` đặt `isA = useLang().lang === 'vi'`, rồi dùng cùng biến
cho chữ giao diện, `sentencePool`, dữ liệu từ/câu, TTS/STT và mọi mini-game. Các điểm
chạm cần rà đồng bộ:

- `practice/VocabListenGuess.tsx`, `SentenceScramble.tsx`, `DictationTyping.tsx`,
  `FillBlankQuiz.tsx`, `PronounceList.tsx`, `Shadowing.tsx`, `ReverseInterview.tsx`.
- `practice/GameChrome.tsx:GameResult`, `practice/shared.ts:pickExampleSentences`.
- Các hàm dùng lại: `lib/listening.ts:buildDictationItems`, `components/PronunciationCheck.tsx`,
  helper prompt mà `ReverseInterview` đang gọi. Rà caller trước khi đổi chữ ký.

Nguồn chiều học thật là `lib/storage.ts:getDirection()` với `Direction = 'A' | 'B'`
trong `types.ts`; không có hook `useDirection` trong context hiện tại. Key `et_direction`
và cách đồng bộ settings giữ nguyên. Đọc direction cho phiên; chỉ nhận A/B, giá trị lạ
fallback A tại ranh giới Practice (không thay semantics storage toàn app ở slice này).

### Hợp đồng được đề xuất

Dùng tên rõ `direction`/`learningIsA` cho dữ liệu sư phạm và `uiLang`/`isUiVi` cho chữ
điều khiển. Giữ boolean `isA` của helper dữ liệu cũ có nghĩa chiều học; không đổi chữ ký
helper dùng ngoài Practice nếu chỉ cần truyền đúng boolean. Mini-game nhận thêm
`uiLang: 'vi' | 'en'` cho nhãn/empty/error/result. Cập nhật tất cả caller nội bộ cùng PR.
Với component dùng chung như PronunciationCheck, bổ sung prop ngôn ngữ UI tùy chọn,
mặc định giữ hành vi cũ; prop `isA` cũ tiếp tục biểu thị chiều học, không đổi vai âm thầm.

| Direction | UI  | Từ/câu đích và TTS/STT | Chữ nút/trạng thái | Giải thích sư phạm theo chiều học |
| --------- | --- | ---------------------- | ------------------ | --------------------------------- |
| A         | vi  | Anh                    | Việt               | Việt                              |
| A         | en  | Anh                    | Anh                | Việt                              |
| B         | vi  | Việt                   | Việt               | Anh                               |
| B         | en  | Việt                   | Anh                | Anh                               |

Ở nghe đoán nghĩa, A nghe `word` và chọn `vi`; B nghe `vi` và chọn `word`. Nội dung câu
hỏi phỏng vấn/prompt feedback dựa direction; nhãn “AI hỏi”, lỗi microphone và nút bấm
dựa UI. Không đổi prompt, provider, số lượt hoặc ranh giới usage. Nếu cần sửa prompt
để đạt mục tiêu, tách spec/eval riêng, không ghép vào bugfix truyền direction.

Trong một lượt mini-game, snapshot direction khi bắt đầu; đổi UI chỉ đổi nhãn, giữ
câu hiện tại, options, đáp án đã chọn, score và audio language. Đổi direction qua setting
áp dụng khi mở lượt mới; không trộn hai chiều trong cùng phiên. Reload đọc lựa chọn đã
lưu; không hứa giữ tiến độ mini-game qua reload vì hiện không có persistence đó.

### AC và negative cases

- Kiểm đủ 2×2 ở tám mode (hai mode phát âm dùng chung PronounceList); xác nhận câu/từ,
  đáp án, nhãn, TTS locale, STT lang và direction truyền vào prompt.
- Đổi UI giữa lượt không reset score/chọn đáp án, không phát audio ngôn ngữ khác,
  không tự đổi `et_direction`. Bắt đầu lượt mới sau đổi direction lấy đúng chiều mới.
- Guest/default direction A và key lỗi có hành vi xác định; auth không quyết định chiều học.
- Mock TTS/STT/provider boundary, không microphone thật hoặc paid API trong gate.
  Test component/helper cho ma trận; E2E luồng chọn mode, đổi UI, reload settings.
- Phần phản hồi sư phạm giữ ngôn ngữ nguồn theo direction; chữ điều khiển/error/loading/
  empty/result nhất quán UI. Đánh giá thủ công cả ba theme ở 390/1440px.

Rollback: revert toàn bộ propagation props và các caller cùng PR; không migration.
Phụ thuộc S00; S05 phải dựa vào contract phân biệt UI/direction đã ổn định của S04.

## 4. S05 — Bộ tạo câu điền từ có kiểm chứng

### Hiện trạng và điểm chạm

`practice/FillBlankQuiz.tsx` lọc chỉ cần có example, cắt SESSION_SIZE=8 rồi replace
`word` hoặc toàn bộ `vi` bằng regex không có ranh giới từ. Nếu không khớp vẫn hiện câu
guyên; nếu là từ con sẽ xóa sai; options lấy ba entry khác nhưng không khử chuỗi trùng.
Chỉ cần >=4 items hiện tại không chứng minh từng câu có bốn options phân biệt.

Tách bộ tạo thuần đề xuất `practice/fillBlankQuestions.ts` và test cùng tên. Giữ
`DictEntry`/JSON từ điển hiện tại tương thích; không bắt nguồn nội dung thêm field mới.
`DictEntry.forms` đã có plural/v3s/ving/past/pastPart/comparative/superlative; không dùng
các flag boolean `uncountable`/`irregular` làm đáp án. Sửa `FillBlankQuiz` dùng question
đã validate, thay vì tự suy đáp án và options ở render.

### Hợp đồng câu hỏi và chính sách dữ liệu

Mỗi câu có `targetLang`, `sourceWord`, câu gốc NFC, span `{ start, end }` theo chỉ số
UTF-16 của chính câu NFC, `answer` đúng bằng slice span, options có id riêng/label,
`correctOptionId` và `blanked` dựng từ span. Validate tại builder; không nhận raw AI.
Builder trả danh sách và thống kê số loại bỏ theo lý do; không đưa learner data vào log.

- A: xét word và những forms dạng chuỗi có sẵn. Match không phân biệt hoa thường,
  giữ nguyên dấu/chuỗi thực trong sentence. Nếu có hơn một vị trí hợp lệ, loại câu;
  không đoán chỗ cần kiểm tra. Đáp án là dạng xuất hiện, ví dụ `went`, không phải `go`.
- B: chỉ dùng `vi` nguyên chuỗi sau trim/NFC nếu khớp một span hợp lệ trong `ex_vi`.
  Không tự tách dấu phẩy/chấm phẩy để đoán nghĩa; entry đa nghĩa không khớp bị loại.
- Ranh giới dựa chữ Unicode/mark/số, không dùng `\b` ASCII cho tiếng Việt; giữ dấu
  tiếng Việt. Không match `he` trong `the`, hoặc `an` trong `banana`.
- Câu/đáp án trống, thiếu match, nhiều match hoặc span sai bị loại **trước** shuffle
  và cap. Không tự chia một từ thành nhiều blank, không sinh câu mới bằng AI.
- Bốn options có label duy nhất sau trim/NFC/case-fold; đáp án đúng đúng một lần.
  Distractor không trùng đáp án/forms cùng entry và không dùng label rỗng. Nếu không
  đủ ba distractor thì loại câu. Dùng id ổn định để chọn/chấm, không dùng label làm key.
- Việc options phân biệt không chứng minh chỉ một từ có thể đúng về ngữ nghĩa. UI mô
  tả nhiệm vụ “Khôi phục câu ví dụ đã học”; không tuyên bố mọi lựa chọn khác sai trong
  mọi ngữ cảnh. Trước release kiểm duyệt mẫu về ngữ nghĩa; muốn bài cloze khảo thí thực
  sự cần distractor và accepted answers biên soạn riêng ở batch có review.
- Giữ ngưỡng phiên tối thiểu bốn câu hợp lệ và tối đa SESSION_SIZE hiện hành. Ít hơn
  bốn: thông báo chưa đủ câu phù hợp, nút về hub; không ghi điểm 0 hoặc chấm câu lỗi.
  Không gợi ý retry sẽ làm dữ liệu hợp lệ nếu pool không thay đổi.

### AC và negative cases

- Fixtures A/B: exact match, hoa thường, Unicode NFC/NFD, dấu tiếng Việt, dấu câu,
  regex metacharacter, từ con, nhiều vị trí, từ biến hình, thiếu ví dụ, nghĩa có dấu
  phân cách, options trùng case/NFC, pool 0–3 câu và pool đủ điều kiện.
- Với mọi câu phát ra: đúng một span không rỗng; chèn answer vào blank khôi phục câu
  NFC chính xác; bốn option ids/labels duy nhất; correct id tồn tại đúng một lần.
- Tập fixture có entry lỗi đứng trước entry tốt, SESSION_SIZE nhỏ: lọc trước cap vẫn
  chọn được câu tốt; chọn sai/đúng cập nhật score đúng một lần; double click không cộng đôi.
- UI giữ bốn options ổn định khi chọn/đổi UI, nhãn theo S04; thử lại reset score;
  empty có đường thoát và bàn phím dùng được. Phản hồi không chỉ màu/icon.
- Script phân tích offline toàn từ điển: báo tổng entry/examples, ứng viên hợp lệ và
  từng lý do loại bỏ cho A/B trước/sau, cùng SHA và luật match. Báo riêng pool học thật
  nếu có fixture sạch; không suy tỷ lệ lỗi phiên từ số liệu toàn từ điển.
- Kiểm duyệt tối thiểu 20 câu mỗi chiều, có forms/cụm từ/tiếng Việt dấu, trên fixture
  và mẫu dữ liệu thật; ghi câu bị loại cùng lý do. Đây là gate dự kiến, chưa có kết quả.

Rollback: revert builder/caller/tests cùng PR; không thay persistence hay migration.
Rủi ro chấp nhận: độ phủ giảm ở chiều B vì dữ liệu không đủ span rõ ràng. Chất lượng
câu ưu tiên hơn đủ tám câu; batch nâng độ phủ phải có spec và kiểm duyệt nội dung riêng.

## 5. Gate, bằng chứng và điều kiện triển khai

Mỗi slice riêng phải qua build/typecheck/lint/format/unit/E2E theo AGENTS bằng Node22,
đúng lockfile, fake API/provider. Kiểm responsive 320/390/768/1440, ba theme, keyboard,
ảnh trước/sau 390/1440; chữ đọc >=7:1, controls AA và vùng chạm >=44px. Không hạ gate
hoặc coi axe incomplete là pass. Không dùng kết quả của PR trước cho slice sau.

Spec hiện **Draft**. Trước source: reviewer xác nhận contract, ranh giới file/caller,
negative cases và cách lưu bằng chứng; đánh dấu Approved for implementation rồi merge
spec nếu thuộc yêu cầu feature/contract của AI_DELIVERY_LOOP. Không tự suy đã được
phê duyệt từ việc giao agent viết tài liệu. Không push/merge/deploy trong tác vụ này.
