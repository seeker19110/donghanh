# Đặc tả — Bài học thật cho `mathforcode-s2`

> Ngày: 2026-09-16  
> Trạng thái: **APPROVED FOR IMPLEMENTATION** — chủ dự án đã yêu cầu tiếp tục và chạy các lát
> cắt độc lập song song ngày 2026-09-16.  
> Goal: `GOAL-2026-ASA`, lát cắt `M2/S1b` (phần tổ hợp và xác suất).

## ① Phạm vi

**LÀM:**

- Biến chặng “Tổ hợp và xác suất cho lập trình viên” thành đúng bốn unit
  `p6-u138..p6-u141`, phủ một-một và đúng thứ tự bốn module `mathforcode-s2-m1..m4`.
- Soạn đúng tám bài `language: 'python'`, mỗi unit hai bài theo đủ vòng học hiện có: hook,
  theory, worked example, Predict, Parsons, Make, test cases, homework và SRS.
- Dùng Python thuần để người học tự cài phép đếm, xác suất/kỳ vọng, PRNG có hạt giống,
  Fisher–Yates và thống kê mô tả/phân vị; mọi kết luận đều có số chạy thật để đối chiếu.
- Đăng ký unit vào curriculum, registry/lazy index và `SPEC_STAGE_UNITS` chỉ khi cả tám bài
  thật đã tồn tại; giữ project/rubric hiện có làm bằng chứng cuối chặng.

**KHÔNG LÀM:**

- Không dạy lại cú pháp Python hay nền tảng rời rạc của `mathforcode-s1`; bài được phép nhắc lại
  ngắn gọn nhưng phải dành phần thực hành cho nội dung S2.
- Không mở sang đại số tuyến tính hoặc giải tích (`mathforcode-s3..s4`), và không đổi metadata
  stage, detail, rubric, project hay năm câu quiz đã phát hành.
- Không thêm UI, API, migration, bảng dữ liệu, cơ chế tiến độ hoặc dependency mới.
- Không dùng NumPy, SciPy, pandas, provider trả phí hay nguồn ngẫu nhiên hệ thống; thư viện chuẩn
  Python chỉ được dùng khi không che mất cơ chế đang học, và mọi mô phỏng phải nhận seed.
- Không dùng thời gian thực của máy làm expected output trong Make, vì tải CI và phần cứng làm
  kết quả không tất định; bài thống kê chấm trên dãy số đo cố định.

## ② Điểm chạm và thiết kế bài học

Khảo sát ngày 2026-09-16 cho thấy unit lớn nhất đã dùng là `p6-u137`; dải liên tiếp
`p6-u138..p6-u141` chưa xuất hiện trong curriculum, registry, lazy index hay stage mapping.

| Việc | Đường dẫn file                                                    | Ghi chú                                 |
| ---- | ----------------------------------------------------------------- | --------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u138.ts`                  | Đếm, hoán vị, tổ hợp                    |
| Thêm | `packages/subject-programming/lessons/p6u139.ts`                  | Xác suất rời rạc và kỳ vọng             |
| Thêm | `packages/subject-programming/lessons/p6u140.ts`                  | PRNG có seed và Fisher–Yates            |
| Thêm | `packages/subject-programming/lessons/p6u141.ts`                  | Thống kê mô tả và phân vị               |
| Sửa  | `packages/subject-programming/curriculum.ts`                      | Bốn unit P6 mới                         |
| Sửa  | `packages/subject-programming/lessons.ts`                         | Registry đồng bộ cho server/test/script |
| Sinh | `packages/subject-programming/lessonsLazy.ts`                     | Chạy `npm run gen:lesson-index`         |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts`      | Ánh xạ `mathforcode-s2` tới bốn unit    |
| Sửa  | `packages/subject-programming/specializations/stageUnits.test.ts` | Khóa đủ bốn unit theo thứ tự            |
| Thêm | `docs/changelog/`                                                 | Nhật ký riêng của PR thi hành           |

**Tám bài bắt buộc:**

| Unit/module    | Bài                                             | Mục tiêu thực hành đo được                                                                                                                          | Ca biên bắt buộc trong Make                                                                                                               |
| -------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u138` / m1 | `l1` — Quy tắc cộng, nhân và kích thước vét cạn | Tính trước số cấu hình từ các nhóm lựa chọn, sinh bộ ca cho bốn tham số nhị phân và đối chiếu số đếm lý thuyết với số phần tử sinh ra               | Tích Descartes của không nhóm có đúng một cấu hình rỗng; một nhóm có 0 lựa chọn cho 0 cấu hình; số lựa chọn âm bị từ chối                 |
| `p6-u138` / m1 | `l2` — Hoán vị, chỉnh hợp, tổ hợp               | Quyết định khi nào thứ tự quan trọng; cài `C(n,k)` bằng hàng Pascal chỉ với số nguyên và đối chiếu trên nhiều cặp `n,k`                             | `C(n,0)=C(n,n)=1`; `k<0`, `n<0` hoặc `k>n` bị từ chối rõ ràng; không tính giai thừa khổng lồ rồi đổi sang float                           |
| `p6-u139` / m2 | `l1` — Xác suất có điều kiện và va chạm         | Lọc không gian mẫu để tính xác suất có điều kiện; tính xác suất va chạm bằng phần bù rồi đối chiếu một mô phỏng `random.Random(seed)` tái hiện được | Biến cố điều kiện rỗng bị từ chối; `k=0`/`k=1` cho xác suất va chạm 0; `k>N` cho 1; `N<=0` bị từ chối                                     |
| `p6-u139` / m2 | `l2` — Kỳ vọng và nhiễu A/B                     | Cộng kỳ vọng từng biến chỉ báo; tính chênh lệch hai tỉ lệ và kiểm xem nó có vượt ngưỡng dao động xấp xỉ được công bố hay chưa                       | Nhóm A hoặc B có cỡ mẫu 0 bị từ chối; 0 và 100% conversion vẫn cho kết quả hữu hạn; không tuyên bố quan hệ nhân quả từ phép kiểm đơn giản |
| `p6-u140` / m3 | `l1` — LCG, chu kỳ và tái hiện                  | Tự cài LCG, chứng minh cùng tham số và seed sinh đúng cùng dãy, rồi phát hiện chu kỳ trên bộ tham số nhỏ                                            | Seed ngoài miền được chuẩn hóa modulo `m`; `m<=0` bị từ chối; giới hạn dò chu kỳ phải kết thúc kể cả khi chưa gặp lại trạng thái          |
| `p6-u140` / m3 | `l2` — Fisher–Yates không thiên lệch            | Cài Fisher–Yates với nguồn số nguyên được truyền vào, so phân bố vị trí với bản đổi chỗ sai và giải thích vì sao PRNG thường không dùng cho mật mã  | Mảng rỗng và một phần tử giữ nguyên; chỉ số đổi chỗ luôn thuộc `[0,i]`; không làm mất hoặc nhân đôi phần tử                               |
| `p6-u141` / m4 | `l1` — Trung tâm và độ phân tán                 | Tự cài trung bình, trung vị, phương sai tổng thể và độ lệch chuẩn; đo mức nhạy của trung bình/trung vị khi thêm ngoại lai                           | Dãy rỗng bị từ chối; một phần tử có phương sai 0; độ dài chẵn lấy trung bình hai phần tử giữa; hàm không sửa dãy đầu vào                  |
| `p6-u141` / m4 | `l2` — p50/p95/p99 và độ ổn định                | Tự cài phân vị nearest-rank đã công bố, lập báo cáo p50/p95/p99 trên dãy latency cố định và so các prefix tăng dần để thấy khi nào p95 ổn định      | Dãy rỗng hoặc `p` ngoài `[0,100]` bị từ chối; `p=0` trả min và `p=100` trả max; dữ liệu chưa sắp xếp vẫn cho đúng kết quả                 |

**Ảnh hưởng lan ra:**

- Trang stage/path tự mở nút “Vào học” khi `unitsOfStage('mathforcode-s2')` không còn rỗng.
- `lessonsLoader.ts` nạp bốn chunk mới qua chỉ mục sinh; `lessons.ts` vẫn là nguồn sự thật cho
  server/test/script.
- Các cổng schema, Python thật, curriculum, lazy registry, stage mapping, SRS và Markdown tự quét
  tám bài mới mà không cần tạo runner riêng.

## ③ Hợp đồng dữ liệu và hành vi

**Vào:** metadata đã phát hành và dữ liệu nhỏ, tất định; không nhận dữ liệu mạng.

```ts
type MathForCodeS2ModuleId =
  'mathforcode-s2-m1' | 'mathforcode-s2-m2' | 'mathforcode-s2-m3' | 'mathforcode-s2-m4'

type MathForCodeS2UnitId = 'p6-u138' | 'p6-u139' | 'p6-u140' | 'p6-u141'
```

**Ra:**

```ts
const MATHFORCODE_S2_UNIT_IDS = ['p6-u138', 'p6-u139', 'p6-u140', 'p6-u141'] as const

// Mỗi file unit export đúng hai ProgrammingLesson có language: 'python'.
// SPEC_STAGE_UNITS['mathforcode-s2'] === MATHFORCODE_S2_UNIT_IDS.
// Mỗi lesson id có dạng `${unitId}-l1` hoặc `${unitId}-l2`.
```

Hợp đồng số học chung: hàm xác suất trả số hữu hạn trong `[0,1]`; hàm đếm trả số nguyên không âm;
mô phỏng nhận seed/tham số PRNG tường minh; hàm thống kê không sửa dữ liệu đầu vào. So sánh số thực
dùng tolerance được ghi ngay trong đề/test, không dùng chuỗi làm tròn như bằng chứng toán học.

| Tình huống                                              | Cổng phát hiện                                                | Hành vi mong đợi                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Unit/lesson id trùng hoặc unit chưa có trong curriculum | `curriculum.test.ts`, `lessons.test.ts`, `stageUnits.test.ts` | CI đỏ, không merge                                                             |
| Code mẫu, Predict hoặc đáp án Make sai                  | `lessonsPython.test.ts`                                       | Chạy bằng Python thật và CI đỏ                                                 |
| Make thiếu ca hiện hoặc ca biên trong bảng mục ②        | `lessons.test.ts` + review test cases của tám bài             | Bổ sung ca trước khi merge                                                     |
| Seed giống nhau nhưng kết quả khác                      | test case của `p6-u140-l1/l2`                                 | CI đỏ; không chấp nhận random ngầm                                             |
| Xác suất ngoài `[0,1]`, chia cho 0 hoặc NaN/Infinity    | test case của `p6-u139-l1/l2`                                 | Hàm từ chối input sai hoặc trả kết quả hữu hạn đúng hợp đồng                   |
| Dữ liệu latency rỗng hoặc percentile ngoài miền         | test case của `p6-u141-l1/l2`                                 | Ném `ValueError` có thông điệp rõ; chương trình mẫu bắt và in kết quả tất định |

## ④ Tiêu chí chấp nhận, nghiệm thu và rollout

- [ ] Có đúng bốn unit mới và tám lesson; mỗi unit đúng hai lesson, id không trùng, module được
      phủ một-một theo thứ tự m1 → m4.
- [ ] Cả tám lesson đạt mục tiêu thực hành và đủ ca biên tương ứng trong bảng mục ②; mỗi Make có
      ít nhất một ca hiện, một ca ẩn và không phụ thuộc mạng, đồng hồ hay random hệ thống.
- [ ] `p6-u138` đối chiếu phép đếm trước/sau khi sinh ca và cài tổ hợp Pascal đúng trên ít nhất
      sáu cặp `(n,k)`, gồm ba ca biên.
- [ ] `p6-u139` tính xác suất va chạm tại `N=365, k=23` trong khoảng `0.507 ± 0.002`, đối chiếu
      mô phỏng có seed lệch dưới hai điểm phần trăm, đồng thời thể hiện xác suất có điều kiện,
      tuyến tính kỳ vọng và một ví dụ A/B có kết luận thận trọng.
- [ ] `p6-u140` chứng minh hai lần chạy cùng seed cho dãy và hoán vị giống hệt; Fisher–Yates giữ
      nguyên multiset ở mảng rỗng, một phần tử, có phần tử trùng và mảng thông thường.
- [ ] `p6-u141` khớp mean/median/population variance trên ít nhất năm bộ số cố định; nearest-rank
      p50/p95/p99 đúng quy ước, có ngoại lai và không sửa input.
- [ ] `unitsOfStage('mathforcode-s2')` trả đúng `p6-u138..p6-u141`; UI không còn ghi chặng đang
      soạn, còn stage detail, rubric, project và quiz giữ nguyên.
- [ ] Không có dependency, API, migration, dữ liệu người học, NumPy/provider trả phí hoặc thay đổi
      ngoài các điểm chạm đã nêu.

**Lệnh chứng minh khi thi hành:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming apps/dhcb/src/lib/lessonMarkdown.test.ts
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

**Nghiệm thu:** PR source/changelog phải ghi output thật của từng lệnh, xác nhận từng ô trên, nêu
rõ nếu có mở rộng phạm vi và đối chiếu rubric dự án `mathforcode-s2-r1..r4`; hoàn thành tám lesson
không tự động đồng nghĩa đã đạt rubric dự án.

**Rollout:** merge additive một PR source sau khi toàn bộ cổng xanh. Bốn unit, registry và stage
mapping phải lên cùng nhau; không phát hành mapping trước lesson. Sau merge, smoke test mở stage,
mở bài đầu/cuối và chạy lại một Make có seed ở trình duyệt.

## ⑤ Bất biến và test canh

| Bất biến                                                                        | Test canh                                           |
| ------------------------------------------------------------------------------- | --------------------------------------------------- |
| Mọi bài khớp `LessonSchema`, unit tồn tại, id duy nhất và Make có ca hiện       | `lessons.test.ts`                                   |
| Python sample solution, worked example và Predict chạy thật                     | `lessonsPython.test.ts`                             |
| Unit không thuộc hai stage; stage chỉ trỏ tới unit có bài thật                  | `stageUnits.test.ts`                                |
| Curriculum giữ id duy nhất và thứ tự bậc ổn định                                | `curriculum.test.ts`                                |
| Lazy registry khớp chính xác registry nguồn                                     | `lessonsLazy.test.ts`, `npm run gen:lesson-index`   |
| SRS hỏi một ý, không lộ đáp án, không trùng và đủ nghĩa                         | `srsCards.test.ts`                                  |
| Quiz S2 vẫn đúng năm câu/bốn lựa chọn và stage thuộc `principal-ai`             | `learningPaths/stageQuizzes.test.ts`                |
| `principal-ai`, phase/stage/module id, detail, rubric và project cũ không đổi   | `learningPaths.test.ts`, `specStageDetails.test.ts` |
| Kết quả ngẫu nhiên tái hiện được; output chấm không phụ thuộc thời gian/tải máy | test cases `p6-u140-l1/l2`, review `p6-u141-l2`     |

## ⑥ Quy ước, rollback và báo cáo bàn giao

- Nội dung giải thích bằng tiếng Việt; code Python dùng tên không dấu, rõ nghĩa và chỉ thư viện
  chuẩn. Công thức phải đi cùng thí nghiệm chạy được, không dùng “hiển nhiên” thay chứng minh.
- Predict có đúng một đáp án; lựa chọn nhiễu không là chuỗi con của output đúng. Worked example
  và sample solution phải in output hữu hạn, ổn định trên Python CI.
- Make dùng hàm thuần hoặc nguồn PRNG được truyền tường minh; không đọc file, mạng, thời gian hệ
  thống, `random` toàn cục hoặc seed ngầm. Seed không được mô tả như bảo mật.
- Công thức va chạm dùng tích tuần tự xác suất không va chạm rồi lấy phần bù, không tính giai thừa
  khổng lồ. Quy ước variance là **population variance**; percentile là **nearest-rank**, với
  `p=0 → min`, tránh để người thi hành tự chọn công thức khác nhau.
- Bài A/B chỉ dạy phân biệt tín hiệu với dao động theo ngưỡng xấp xỉ đã công bố; phải nói rõ đây
  không phải bằng chứng nhân quả hay thay thế thiết kế thí nghiệm đầy đủ.
- Mỗi bài nối với một lỗi production cụ thể: vét cạn nổ quy mô, collision bị đánh giá thấp, test
  flaky vì mất seed, shuffle thiên lệch, hoặc average che tail latency.

**Rollback:** revert nguyên PR source để đồng thời bỏ bốn unit khỏi curriculum, registry, lazy
index và `SPEC_STAGE_UNITS`; không cần rollback DB hay dữ liệu người học vì lát cắt không thêm
schema/state. Nếu chỉ một bài lỗi sau merge, vẫn tắt mapping cả stage hoặc revert trọn PR, không để
nút vào học dẫn tới chặng thiếu bài.

**Báo cáo bàn giao của bên thi hành:** liệt kê files changed, lệnh/check đã chạy kèm kết quả và số
ca, cùng rủi ro còn lại. Rủi ro đã biết cần nhắc lại: kiểm thống kê có thể flaky nếu dùng ngưỡng
ngẫu nhiên; định nghĩa percentile khác nhau cho kết quả khác; `random.Random` không phù hợp mật mã;
đồ thị trong rubric dự án vẫn là artifact riêng, không thuộc tám lesson này.
