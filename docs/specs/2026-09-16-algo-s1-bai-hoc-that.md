# Đặc tả — Bài học thật cho `algo-s1`

> Ngày: 2026-09-16  
> Trạng thái: **APPROVED FOR IMPLEMENTATION** — chi tiết thi hành của đặc tả khóa đã được chủ dự
> án duyệt tại `2026-09-15-khoa-kien-truc-su-phan-mem-ai.md`; chủ dự án yêu cầu tiếp tục và chạy
> các lát cắt độc lập song song ngày 2026-09-16.  
> Goal: `GOAL-2026-ASA`, lát cắt `M2/S1b`.

## 0. Một câu

Biến chặng “Nền tảng và độ phức tạp” từ bản đồ đọc thành tám bài Python tương tác giúp người học
phân tích chi phí, chọn cấu trúc dữ liệu và kỹ thuật cơ bản, rồi tự bắt lỗi bằng kiểm thử đối chiếu
có thể tái hiện.

## ① Phạm vi

**LÀM:**

- Tạo bốn unit `p6-u142..p6-u145`, mỗi unit phủ đúng một module `algo-s1-m1..m4`; dải này được
  dành riêng để không xung đột với lát cắt `mathforcode-s2` đang dùng `p6-u138..p6-u141`.
- Soạn đúng tám bài Python thuần theo vòng tám bước hiện có: hook, theory, worked example,
  predict, Parsons, make, test cases, homework và SRS.
- Unit `p6-u142` — **Độ phức tạp**:
  - `p6-u142-l1`: đọc ràng buộc, đếm phép tính và chọn lớp `O(1)`, `O(log n)`, `O(n)`,
    `O(n log n)` hoặc `O(n²)` còn khả thi;
  - `p6-u142-l2`: mô phỏng mảng động tăng gấp đôi, đếm số lần sao chép để thấy chi phí khấu
    hao; đối chiếu tỷ lệ tăng trưởng bằng bộ đếm tất định thay vì lấy thời gian máy làm oracle.
- Unit `p6-u143` — **Cấu trúc dữ liệu tuyến tính**:
  - `p6-u143-l1`: chọn và dùng stack, queue, deque qua bài kiểm ngoặc và luồng công việc FIFO;
    giải thích chi phí chèn/xóa của mảng động so với danh sách liên kết;
  - `p6-u143-l2`: tự cài bảng băm chaining tối giản, chủ động tạo va chạm và đo số phép so
    sánh khi tra cứu; không dùng hiệu năng trung bình của `dict` làm bằng chứng tuyệt đối.
- Unit `p6-u144` — **Kỹ thuật cơ bản**:
  - `p6-u144-l1`: từ vét cạn sang hai con trỏ và cửa sổ trượt trên đoạn liên tiếp;
  - `p6-u144-l2`: tổng tiền tố cho truy vấn đoạn, tìm kiếm nhị phân và nhị phân trên đáp án với
    hàm kiểm khả thi đơn điệu; sắp xếp chỉ được dùng khi hợp đồng cho phép đổi thứ tự.
- Unit `p6-u145` — **Kỷ luật giải bài**:
  - `p6-u145-l1`: viết ca biên và bản vét cạn chắc đúng trước, sau đó đối chiếu với bản tối ưu;
  - `p6-u145-l2`: sinh dữ liệu bằng `random.Random(seed)`, differential test hai lời giải và in
    đủ `seed` cùng ca lệch đầu tiên để tái hiện lỗi.
- Đăng ký unit vào curriculum, lesson registry/lazy index và `SPEC_STAGE_UNITS` chỉ sau khi cả tám
  bài thật tồn tại; giữ project/rubric 80 bài trong `details/algo-s1.ts` làm chuẩn bằng chứng cuối
  chặng.

**KHÔNG LÀM:**

- Không mở sang đệ quy, cây, đồ thị, heap, tham lam hay quy hoạch động (`algo-s2` trở đi).
- Không biến tám lesson thành tuyên bố đã đạt rubric 80 bài, 15 bài giải lại sau hai tuần hoặc năm
  bộ kiểm ngẫu nhiên; lesson là nền tập luyện, rubric vẫn cần artifact riêng.
- Không thêm UI, API, bảng dữ liệu, migration, dependency hoặc cơ chế tiến độ mới.
- Không dùng NumPy, Hypothesis hay thư viện ngoài; không phụ thuộc LeetCode/Codeforces hoặc mạng.
- Không dùng benchmark thời gian tường (`time.time`/`perf_counter`) làm điều kiện pass/fail trong
  CI vì tải máy không tất định; benchmark thật chỉ là hoạt động quan sát có hướng dẫn.
- Không đổi id lộ trình, phase, stage, module, quiz hoặc bài đã phát hành.

## ② Điểm chạm

| Việc | Đường dẫn file                                                    | Ghi chú                                 |
| ---- | ----------------------------------------------------------------- | --------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u142.ts`                  | Ràng buộc, Big-O và chi phí khấu hao    |
| Thêm | `packages/subject-programming/lessons/p6u143.ts`                  | Stack/queue/deque và bảng băm va chạm   |
| Thêm | `packages/subject-programming/lessons/p6u144.ts`                  | Hai con trỏ, cửa sổ, prefix, binary     |
| Thêm | `packages/subject-programming/lessons/p6u145.ts`                  | Oracle, ca biên và differential có seed |
| Sửa  | `packages/subject-programming/curriculum.ts`                      | Bốn unit P6 mới                         |
| Sửa  | `packages/subject-programming/lessons.ts`                         | Registry đồng bộ cho server/test/script |
| Sinh | `packages/subject-programming/lessonsLazy.ts`                     | Chạy `npm run gen:lesson-index`         |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts`      | Ánh xạ `algo-s1` → bốn unit             |
| Sửa  | `packages/subject-programming/specializations/stageUnits.test.ts` | Khóa đủ bốn unit theo thứ tự            |
| Thêm | `packages/subject-programming/lessons/algoS1Lessons.test.ts`      | Khóa seed, oracle và các tính chất lõi  |
| Thêm | `docs/changelog/`                                                 | Nhật ký riêng của PR source             |

**Ảnh hưởng lan ra theo registry và các test hiện có:**

- Trang stage/path tự mở nút “Vào học” khi `unitsOfStage('algo-s1')` không còn rỗng.
- `lessonsLoader.ts` nạp bài qua chỉ mục lazy được sinh; `lessons.ts` phục vụ server, test và
  script.
- `lessonsPython.test.ts` chạy Python thật cho sample solution, worked example và Predict;
  `lessons.test.ts`, `curriculum.test.ts`, `lessonsLazy.test.ts`, `srsCards.test.ts` và test
  markdown kiểm chéo dữ liệu mới.
- Quiz `algo-s1-q1..q5`, metadata trong `specializations/algo.ts` và rubric trong
  `details/algo-s1.ts` được giữ nguyên; bài học phải cụ thể hóa chúng, không tạo nguồn sự thật thứ
  hai.

## ③ Hợp đồng dữ liệu

**Vào:** metadata đã phát hành và dữ liệu stdin hữu hạn; không nhận dữ liệu mạng.

```ts
type AlgoS1ModuleId = 'algo-s1-m1' | 'algo-s1-m2' | 'algo-s1-m3' | 'algo-s1-m4'

type DifferentialInput = {
  seed: number
  trials: number // số nguyên dương, có trần nêu rõ trong đề
}
```

**Ra:**

```ts
const ALGO_S1_UNIT_IDS = ['p6-u142', 'p6-u143', 'p6-u144', 'p6-u145'] as const

// Mỗi file export đúng hai ProgrammingLesson có language: 'python'.
// SPEC_STAGE_UNITS['algo-s1'] === ALGO_S1_UNIT_IDS.
// Bài differential dùng random.Random(seed), dừng ở ca lệch đầu tiên và in lại seed + input;
// nếu không lệch, output gồm seed + số lượt đã kiểm để kết quả vẫn kiểm chứng được.
```

**Hợp đồng Make:**

- Mỗi Make có ít nhất một test hiện và một test ẩn; test ẩn phải thêm ca biên chứ không chỉ lặp
  lại test hiện với số khác.
- Bài tối ưu phải có oracle đơn giản cùng miền đầu vào. Ca differential/random dùng seed cố định
  trong test tự động; cùng seed và số lượt phải sinh cùng dãy input, không đọc random toàn cục.
- Output để chấm là tất định, không chứa thời gian chạy, địa chỉ bộ nhớ hoặc thứ tự phụ thuộc hash
  ngẫu nhiên của tiến trình Python.
- Miền dữ liệu của bản vét cạn được chặn đủ nhỏ để toàn bộ visible/hidden test hoàn tất trong timeout
  hiện có; lời giải nhanh vẫn phải xử lý đúng rỗng, một phần tử, trùng lặp và giá trị biên đã nêu.

**Ca lỗi:**

| Tình huống                                        | Cổng phát hiện                             | Hành vi mong đợi                        |
| ------------------------------------------------- | ------------------------------------------ | --------------------------------------- |
| Unit id trùng hoặc chưa có trong curriculum       | `curriculum.test.ts`, `stageUnits.test.ts` | CI đỏ, không merge                      |
| Code mẫu, Predict hoặc Make sai                   | `lessonsPython.test.ts`                    | Chạy bằng Python thật và CI đỏ          |
| Make thiếu test hiện/ẩn hoặc thiếu ca biên        | `lessons.test.ts`, `algoS1Lessons.test.ts` | Test nội dung từ chối bài               |
| Hai bản lệch nhưng không in seed/input tái hiện   | `algoS1Lessons.test.ts`                    | CI đỏ, không chấp nhận lỗi “ngẫu nhiên” |
| Dùng random toàn cục hoặc seed bị bỏ qua          | chạy lặp `algoS1Lessons.test.ts` cùng seed | Hai lượt phải cho output giống nhau     |
| Hàm khả thi của binary search không đơn điệu      | test vét cạn/differential trên miền nhỏ    | CI đỏ với phản ví dụ cụ thể             |
| Bảng băm làm mất phần tử khi hai khóa cùng bucket | test va chạm chủ đích                      | CI đỏ                                   |
| Nội dung/SRS sai schema hoặc tự lộ đáp án         | `lessons.test.ts`, `srsCards.test.ts`      | CI đỏ                                   |

## ④ Tiêu chí chấp nhận

- [ ] Có đúng bốn unit mới và đúng tám lesson; mỗi unit có hai lesson, không id trùng.
- [ ] Bốn module gốc được phủ một-một theo thứ tự m1 → m4 và nội dung khớp stage, detail cùng quiz
      hiện có.
- [ ] Mọi worked example, Predict và Make chạy bằng Python thật; mỗi Make có visible và hidden
      test, gồm ca biên thích hợp.
- [ ] Unit 142 suy được lớp độ phức tạp từ ràng buộc, phân biệt thời gian/bộ nhớ, và chứng minh
      mảng tăng gấp đôi có tổng số lần sao chép tuyến tính trên ít nhất năm kích thước.
- [ ] Unit 143 dùng đúng LIFO/FIFO/deque, nêu đánh đổi mảng động–danh sách liên kết, và chứng minh
      chaining giữ đủ khóa khi cố tình cho nhiều khóa vào cùng bucket.
- [ ] Unit 144 có ít nhất một cặp vét cạn–tối ưu cho hai con trỏ/cửa sổ, truy vấn prefix đúng quy
      ước đoạn, và binary search không mắc lỗi biên `lo/hi` trên cả kết quả nhỏ nhất/lớn nhất.
- [ ] Unit 145 bao phủ rỗng, một phần tử, trùng lặp và biên miền; differential test dùng
      `random.Random(seed)`, chạy ít nhất 100 ca nhỏ và tái hiện cùng ca lệch bằng cùng seed.
- [ ] `algoS1Lessons.test.ts` có negative control: một lời giải tối ưu bị cài lỗi có chủ đích phải
      bị oracle/differential bắt, để chứng minh harness không xanh rỗng.
- [ ] `unitsOfStage('algo-s1')` trả đúng `p6-u142..p6-u145`; UI không còn ghi bài đang soạn.
- [ ] Không có dependency, API, migration, dữ liệu người học hoặc thay đổi quiz/rubric mới.

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/lessons/algoS1Lessons.test.ts
npx vitest run packages/subject-programming apps/dhcb/src/lib/lessonMarkdown.test.ts
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                           | Test canh                              |
| ------------------------------------------------------------------ | -------------------------------------- |
| Mọi bài khớp `LessonSchema`, unit tồn tại và Make có ca hiện       | `lessons.test.ts`                      |
| Python mẫu/đáp án/test-case chạy thật                              | `lessonsPython.test.ts`                |
| Oracle và lời giải nhanh cùng hợp đồng input/output                | `algoS1Lessons.test.ts`                |
| Ngẫu nhiên nhận seed, kết quả tái hiện được và có negative control | `algoS1Lessons.test.ts`                |
| Unit không thuộc hai stage và stage chỉ trỏ tới unit có bài        | `stageUnits.test.ts`                   |
| Curriculum giữ id duy nhất và thứ tự ổn định                       | `curriculum.test.ts`                   |
| Lazy registry đồng bộ với registry nguồn                           | `lessonsLazy.test.ts`, lệnh sinh index |
| SRS hỏi một ý, không lộ đáp án, nội dung đủ nghĩa                  | `srsCards.test.ts`                     |
| `principal-ai`, phase/stage/module/quiz id cũ không đổi            | `learningPaths.test.ts`, quiz tests    |
| Rubric 80/15/5 và cờ `crossCutting` của hướng thuật toán không đổi | review `details/algo-s1.ts`, `algo.ts` |

## ⑥ Quy ước dự án liên quan

- Nội dung giải thích bằng tiếng Việt; code Python dùng tên không dấu, rõ nghĩa và hàm thuần.
- Phân tích Big-O phải nêu biến kích thước đang đo; không suy độ phức tạp chỉ bằng cách đếm số vòng
  lặp lồng nhau.
- Không lấy một lần đo thời gian làm chứng minh. Test CI dùng bộ đếm phép tính/tính chất; hoạt động
  benchmark hướng dẫn warm-up, nhiều kích thước và nhiều lượt, chỉ để người học quan sát hằng số
  ẩn/cache như detail hiện có yêu cầu.
- Predict chỉ có đúng một đáp án; lựa chọn nhiễu không được là chuỗi con gây khớp giả.
- Make không đọc file, mạng, thời gian hệ thống hoặc random không seed; giới hạn input phải ngăn
  bản vét cạn treo bộ chạy.
- Differential test so giá trị trả về chuẩn hóa, không so text trang trí; gặp lệch phải dừng và in
  seed cùng input nhỏ nhất đã gặp để điều tra được.
- Dùng `collections.deque` khi bài cần queue thật; không dạy `list.pop(0)` như thao tác O(1).
- Mỗi bài nối với một lỗi production cụ thể: chọn thuật toán không chịu được quy mô, queue sai thứ
  tự, mất khóa do va chạm, lỗi off-by-one hoặc tối ưu sai nhưng lọt ca mẫu.
- Hoàn thành lesson và nộp artifact rubric là hai lớp riêng; UI không được tự suy mastery từ việc
  code mẫu chạy qua.

## Nghiệm thu

- Lệnh đã chạy + kết quả thật: điền trong PR source/changelog.
- Tiêu chí ④ đạt hết chưa: chờ implementation.
- Có phá bất biến ⑤ nào không: chờ implementation.
- Mở rộng ngoài phạm vi: không.
- Còn để ngỏ: `algo-s2`; artifact 80 bài, 15 lượt giải lại và năm bộ differential của rubric.

### Rollout

1. Thêm bốn unit và tám lesson nhưng chưa ánh xạ stage; chạy test nội dung, Python thật và test
   differential cho tới khi xanh.
2. Sinh lại `lessonsLazy.ts`, kiểm registry nguồn–lazy đồng bộ.
3. Cuối cùng mới thêm `SPEC_STAGE_UNITS['algo-s1']` và test thứ tự; đây là điểm làm nút “Vào học”
   xuất hiện.
4. Chạy toàn bộ cổng ở mục ④; PR source chỉ merge khi quality và E2E bắt buộc xanh.

### Rollback

- Nếu lỗi trước merge: bỏ riêng thay đổi source của lát cắt, không sửa metadata/quiz/rubric đã phát
  hành và không thu hồi dải ID cho lát cắt khác trong cùng PR.
- Nếu lỗi sau merge: revert PR source trọn lát cắt để xóa ánh xạ `algo-s1`, bốn unit, tám lesson và
  chỉ mục lazy sinh tương ứng; không xóa dữ liệu người học vì lát cắt không tạo schema hay ghi
  authoritative state.
- Sau rollback, chạy lại `npm run gen:lesson-index`, test `stageUnits`/lesson và build để xác nhận
  stage trở về trạng thái chưa có bài mà các stage song song vẫn hoạt động.
