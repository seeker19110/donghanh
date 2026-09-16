# Đặc tả — Bài học thật cho `systems-s1`

> Ngày: 2026-09-16  
> Trạng thái: **APPROVED FOR IMPLEMENTATION** — chủ dự án đã yêu cầu tiếp tục và triển khai
> song song ngày 2026-09-16.  
> Goal: `GOAL-2026-ASA`, lát cắt `M2/S1d` — riêng `systems-s1`.

## 0. Một câu

Biến chặng “Bộ nhớ và C” từ bản đồ đọc thành tám bài tương tác chạy bằng Python thật để học
và kiểm chứng mô hình hệ thống, đồng thời nói rõ C/gcc/gdb/sanitizer thật vẫn là artifact ngoài
sandbox vì runtime bài học hiện chưa hỗ trợ C.

## ① Phạm vi

**LÀM:**

- Tạo bốn unit `p6-u146..p6-u149`, phủ một-một và đúng thứ tự bốn module
  `systems-s1-m1..m4`; mỗi unit có đúng hai lesson theo khuôn tám bước hiện có.
- Dùng `language: 'python'` cho cả tám bài. Worked example, Predict và Make chạy Python thật;
  mô hình C được biểu diễn bằng trạng thái tường minh, đầu vào tất định và output kiểm được.
- `p6-u146` — **Mô hình bộ nhớ**:
  - `p6-u146-l1`: phân loại text/data/stack/heap, vòng đời và con trỏ treo bằng bảng vùng nhớ
    mô phỏng; không dùng địa chỉ thật hoặc dựa vào undefined behavior.
  - `p6-u146-l2`: byte, endianness, kích thước kiểu và căn chỉnh struct trên một ABI đồ chơi
    được khai báo rõ (`char=1`, `int32=4`, alignment tối đa 4), không suy rộng sang mọi máy.
- `p6-u147` — **C thực dụng**:
  - `p6-u147-l1`: ownership của vùng cấp phát, `alloc/free`, NULL, double-free và leak bằng bộ
    cấp phát mô phỏng có ledger; người học phải ghi rõ ai chịu trách nhiệm giải phóng.
  - `p6-u147-l2`: chuỗi kết thúc NUL trên `bytearray`, copy có giới hạn, chừa chỗ cho `\0` và
    phát hiện thiếu terminator; header/đơn vị biên dịch chỉ được giới thiệu như hợp đồng, chưa
    tuyên bố biên dịch C.
- `p6-u148` — **Debug và sanitizer**:
  - `p6-u148-l1`: đọc trace có cấu trúc, breakpoint/backtrace/biến và lần ngược frame gây lỗi
    bằng một debugger simulator Python; không gọi nó là gdb thật.
  - `p6-u148-l2`: phân loại báo cáo mô phỏng cho out-of-bounds, use-after-free, double-free và
    leak; báo cáo phải trỏ được thao tác gây lỗi và tách nguyên nhân khỏi nơi biểu hiện.
- `p6-u149` — **Build, link và assembly**:
  - `p6-u149-l1`: mô hình pipeline preprocess → compile → assemble → link; bảng symbol bắt
    missing/duplicate symbol và đồ thị dependency quyết định tệp nào cần build lại.
  - `p6-u149-l2`: chạy máy assembly đồ chơi nhỏ (`LOAD`, `ADD`, `MUL`, `RET`) và khớp từng
    lệnh với hàm nguồn; phân biệt khái niệm static/dynamic library bằng manifest phụ thuộc.
- Đăng ký unit vào curriculum, registry/lazy index và `SPEC_STAGE_UNITS` chỉ sau khi đủ bài và
  test. Giữ rubric/project “Cấp phát bộ nhớ của riêng bạn” trong `details/systems-s1.ts` làm
  chuẩn artifact cuối chặng trên máy có toolchain C.

**KHÔNG LÀM:**

- Không thêm `language: 'c'`, không shell-out tới `gcc`/`clang`, không nhúng compiler, không
  giả lập rằng code C trong trình duyệt đã được biên dịch hoặc sanitizer thật đã chạy.
- Không dạy concurrency, syscall, tiến trình, socket của `systems-s2`.
- Không đổi stage/module/rubric/quiz đã phát hành; không thêm API, UI, migration hay dependency.
- Không coi hoàn thành tám lesson Python là bằng chứng rubric C. Valgrind/ASan/gdb/core dump và
  Makefile thật chỉ được yêu cầu ở homework/artifact ngoài sandbox với nhãn “tự chạy trên máy”.
- Không mô phỏng undefined behavior bằng kết quả cố định như thể C bảo đảm kết quả đó.

## ② Điểm chạm

| Việc | Đường dẫn file                                                    | Ghi chú                                      |
| ---- | ----------------------------------------------------------------- | -------------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u146.ts`                  | Hai bài mô hình bộ nhớ                       |
| Thêm | `packages/subject-programming/lessons/p6u147.ts`                  | Hai bài C thực dụng qua mô phỏng Python      |
| Thêm | `packages/subject-programming/lessons/p6u148.ts`                  | Hai bài debugger/sanitizer mô phỏng          |
| Thêm | `packages/subject-programming/lessons/p6u149.ts`                  | Hai bài build/link/assembly mô phỏng         |
| Sửa  | `packages/subject-programming/curriculum.ts`                      | Bốn unit P6 mới, không `projectStep`         |
| Sửa  | `packages/subject-programming/lessons.ts`                         | Registry nguồn cho server/test/script        |
| Sinh | `packages/subject-programming/lessonsLazy.ts`                     | Chạy `npm run gen:lesson-index`              |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts`      | `systems-s1` → bốn unit                      |
| Sửa  | `packages/subject-programming/specializations/stageUnits.test.ts` | Khóa đủ bốn unit theo thứ tự                 |
| Thêm | `packages/subject-programming/systemsS1Lessons.test.ts`           | Khóa ngữ nghĩa mô phỏng và ranh giới runtime |
| Thêm | `docs/changelog/`                                                 | Nhật ký riêng của PR implementation          |

**Khảo sát runtime tại thời điểm duyệt:**

- `LESSON_LANGUAGES` không có `c`; không có lane, worker, runner hay content gate cho C.
- Cổng có thể chứng minh lát cắt này là `lessonsPython.test.ts`: Python thật trên CI và engine
  Python/Pyodide ở bài học. Repo không có cổng chạy gcc/clang, gdb, Valgrind hoặc ASan.
- `stageQuizzes.ts` không có khóa `systems-s1`; ngân hàng đó phục vụ các chặng trong lộ trình
  `principal-ai`, còn `systems-s1` hiện là chặng hướng chuyên sâu. Slice này không tự thêm quiz
  và không lấy việc thiếu quiz làm bằng chứng kiến thức.
- Dải `p6-u146..p6-u149` đã được dành riêng cho slice này và không xuất hiện trong curriculum,
  lesson registry hoặc stage mapping tại thời điểm đặc tả.

**Ảnh hưởng lan ra:** khi mapping được thêm, trang stage tự hiện “Vào học”; loader lấy bài qua
lazy index sinh lại. Không có thay đổi dữ liệu tiến độ cho đến khi người học mở các ID mới.

## ③ Hợp đồng dữ liệu

```ts
type SystemsS1ModuleId = 'systems-s1-m1' | 'systems-s1-m2' | 'systems-s1-m3' | 'systems-s1-m4'

const SYSTEMS_S1_UNIT_IDS = ['p6-u146', 'p6-u147', 'p6-u148', 'p6-u149'] as const

// Mỗi file export đúng hai ProgrammingLesson, đều language: 'python'.
// SPEC_STAGE_UNITS['systems-s1'] === SYSTEMS_S1_UNIT_IDS.
```

Mọi simulator dùng hàm thuần hoặc lớp trạng thái tạo mới cho từng lần chạy; không đọc file,
mạng, địa chỉ tiến trình, đồng hồ hay random. Input/output là JSON đơn giản hoặc các dòng text
ổn định để `TestCaseSchema` chấm được. Tên và báo cáo phải chứa nhãn `MÔ PHỎNG`, kèm giả định
ABI/ISA khi có; code C thật chỉ nằm trong phần lý thuyết/homework, không nằm trong code Python
mà nút Chạy thực thi.

| Tình huống                                             | Cổng phát hiện                    | Hành vi mong đợi                                           |
| ------------------------------------------------------ | --------------------------------- | ---------------------------------------------------------- |
| Unit/lesson id trùng hoặc sai prefix                   | curriculum/schema/stage-unit test | CI đỏ, không merge                                         |
| Code Python mẫu, Predict hoặc Make sai                 | `lessonsPython.test.ts`           | Chạy thật và CI đỏ                                         |
| Simulator đọc ngoài biên hoặc free sai nhưng không báo | `systemsS1Lessons.test.ts`        | Trả lỗi miền xác định, không crash mơ hồ                   |
| Symbol thiếu/trùng mà linker mô phỏng vẫn thành công   | test ca âm riêng                  | CI đỏ                                                      |
| Nội dung gọi mô phỏng là gcc/gdb/ASan/Valgrind thật    | test chuỗi cấm + review           | CI đỏ hoặc chặn review                                     |
| ABI/ISA đồ chơi không ghi giả định                     | test nội dung mục tiêu + review   | Không nghiệm thu                                           |
| Máy học viên không có toolchain C cho homework         | ngoài runtime                     | Lesson vẫn học được; artifact C ghi BLOCKED, không giả đạt |

## ④ Tiêu chí chấp nhận, nghiệm thu và phát hành

- [ ] Có đúng bốn unit `p6-u146..p6-u149`, đúng tám lesson, mỗi unit hai lesson và không ID
      nào trùng registry hiện có.
- [ ] Bốn module gốc được phủ một-một theo thứ tự m1 → m4; từng lesson có hook, theory, worked
      example, Predict, Parsons, Make, homework và 2–4 thẻ SRS.
- [ ] Cả tám lesson dùng `language: 'python'`; mọi worked example, Predict và sample solution
      chạy thật. Mỗi Make có ít nhất một ca hiện, một ca ẩn và một ca lỗi/biên liên quan.
- [ ] Unit 146 phân biệt region với lifetime; nhận ra dangling pointer; tính đúng offset/padding
      và endianness trên ABI đồ chơi được ghi rõ.
- [ ] Unit 147 giữ bất biến ownership, bắt double-free/leak và không ghi quá capacity; phép copy
      luôn dành một byte cho NUL khi capacity dương.
- [ ] Unit 148 lần ngược được call stack tới thao tác gốc và phân loại đủ bốn lỗi
      out-of-bounds/use-after-free/double-free/leak từ trace mô phỏng.
- [ ] Unit 149 bắt missing/duplicate symbol, tính đúng tập build lại từ dependency graph, chạy
      đúng assembly đồ chơi và không mô tả static/dynamic library như đã link thật.
- [ ] `unitsOfStage('systems-s1')` trả đúng bốn ID; trang stage hết trạng thái “đang soạn”.
- [ ] Không có `language: 'c'`; không có lời tuyên bố runner C, debugger hay sanitizer thật.
- [ ] Rubric C hiện có không bị hạ chuẩn: artifact allocator, báo cáo sanitizer/Valgrind, benchmark
      và build một lệnh vẫn phải được làm ngoài sandbox trước khi tuyên bố hoàn thành chặng.

**Lệnh nghiệm thu:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/systemsS1Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npx vitest run packages/subject-programming apps/dhcb/src/lib/lessonMarkdown.test.ts
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

**Rollout:** một PR source thêm đủ tám lesson + registry + test; sinh lại lazy index trong cùng PR.
Trước merge, reviewer mở ít nhất một lesson mỗi unit trong UI và chạy một ca đạt/một ca lỗi. Sau
merge, kiểm tra stage mapping và theo dõi lỗi load/grade; không bật cờ hay backfill dữ liệu. Một
slice C thật về sau phải có đặc tả hạ tầng riêng, runner sandboxed và content gate trước khi đổi
`language` hoặc chuyển bài từ mô phỏng sang C.

**Rollback:** revert mapping `systems-s1` trước để UI ngừng dẫn vào bài; sau đó revert bốn unit,
registry, lesson files, test và lazy index trong cùng PR rollback. Không xóa/chỉnh bản ghi tiến độ
của người học; giữ nguyên ID để có thể phát hành lại mà không làm mồ côi tiến độ. Không rollback
bằng cách đổi bài sang ngôn ngữ khác hoặc nới schema/test.

## ⑤ Bất biến không được phá

| Bất biến                                                          | Test canh                                           |
| ----------------------------------------------------------------- | --------------------------------------------------- |
| Mọi bài khớp `LessonSchema`, unit tồn tại, Make có ca kiểm        | `lessons.test.ts`                                   |
| Python mẫu/đáp án/test-case chạy thật                             | `lessonsPython.test.ts`                             |
| Unit không thuộc hai stage; stage chỉ trỏ unit có bài             | `stageUnits.test.ts`                                |
| Curriculum giữ ID duy nhất và thứ tự ổn định                      | `curriculum.test.ts`                                |
| Lazy registry đồng bộ registry nguồn                              | `lessonsLazy.test.ts`, lệnh sinh index              |
| SRS hỏi một ý, không lộ đáp án và đủ nghĩa                        | `srsCards.test.ts`                                  |
| Simulator tất định, bắt ca lỗi và tự nhận là mô phỏng             | `systemsS1Lessons.test.ts`                          |
| `systems-s1` stage/module/rubric cũ và các stage khác không đổi   | `specStageDetails.test.ts`, `learningPaths.test.ts` |
| Không có mã C nào được nút Chạy gửi vào Python như thể thực thi C | content gate + review                               |

## ⑥ Quy ước dự án liên quan

- Nội dung giải thích bằng tiếng Việt; tên Python không dấu, rõ nghĩa. Thuật ngữ C giữ tên chuẩn
  trong ngoặc khi cần: dangling pointer, ownership, symbol, linker, stack frame.
- Mọi sơ đồ bộ nhớ là mô hình logic, không vẽ địa chỉ tuyệt đối hoặc khẳng định stack/heap luôn
  tăng theo một hướng. Endianness, size và alignment luôn đi cùng giả định ABI cụ thể.
- Không cho undefined behavior một output “đúng”. Bài phải giải thích kết quả không được C bảo
  đảm, rồi dùng simulator để kiểm tra invariant thay vì tái tạo UB.
- Predict có đúng một đáp án; lựa chọn nhiễu không dùng chuỗi con gây khớp giả. Make không phụ
  thuộc thứ tự map/set, hash ngẫu nhiên hay thông tin máy chạy.
- Báo cáo debugger/sanitizer mô phỏng dùng từ “trace mô phỏng”, “frame mô phỏng”, “lỗi được mô
  hình hóa”; tên công cụ thật chỉ xuất hiện trong phần so sánh hoặc homework ngoài sandbox.
- Bài C thật ở homework phải ghi nền tảng/toolchain đã dùng, lệnh đầy đủ và bằng chứng output;
  thiếu bằng chứng thì rubric chưa đạt. Lesson completion và stage artifact là hai lớp riêng.
- Rủi ro còn lại: simulator có thể đơn giản hóa ABI, allocator và linker; giảm thiểu bằng giả định
  tường minh, ca âm, review chuyên môn và không dùng simulator làm bằng chứng production.
- Ngoài phạm vi sau slice này: runner C sandboxed, test gcc/clang đa nền tảng, gdb/core dump,
  Valgrind/ASan thật và `systems-s2`.

**Biên bản nghiệm thu để điền trong PR implementation:** files changed thực tế; kết quả từng
lệnh ở mục ④; checklist đạt/chưa đạt; rủi ro sai khác simulator với toolchain thật; xác nhận không
mở rộng sang C runner, quiz, API, migration hoặc `systems-s2`.
