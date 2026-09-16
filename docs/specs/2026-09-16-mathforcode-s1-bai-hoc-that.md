# Đặc tả — Bài học thật cho `mathforcode-s1`

> Ngày: 2026-09-16  
> Trạng thái: **APPROVED FOR IMPLEMENTATION** — chi tiết thi hành của đặc tả khóa đã được chủ dự
> án duyệt tại `2026-09-15-khoa-kien-truc-su-phan-mem-ai.md`; chủ dự án yêu cầu tiếp tục ngày
> 2026-09-16.  
> Goal: `GOAL-2026-ASA`, lát cắt `M2/S1a`.

## 0. Một câu

Biến chặng “Nền tảng rời rạc cho lập trình viên” từ bản đồ đọc thành tám bài Python tương tác có
code chạy thật, test tự động và bằng chứng đầu ra cho người học khóa Kiến trúc sư phần mềm & AI.

## ① Phạm vi

**LÀM:**

- Tạo bốn unit `p6-u134..p6-u137`, mỗi unit phủ đúng một module
  `mathforcode-s1-m1..m4`.
- Soạn tám bài theo vòng tám bước hiện có: hook, theory, worked example, predict, Parsons, make,
  test cases, homework và SRS.
- Dùng Python thuần để người học tự cài và kiểm chứng: biểu diễn số, Boolean/bit mask, modulo/mã
  kiểm tra, đếm phép tính và Big-O.
- Đăng ký unit vào curriculum, lesson registry/lazy index và `SPEC_STAGE_UNITS` chỉ sau khi bài
  thật tồn tại.
- Giữ rubric/project hiện có trong `details/mathforcode-s1.ts` làm chuẩn bằng chứng cuối chặng.

**KHÔNG LÀM:**

- Không dạy lại cú pháp Python P1–P4; người học chặng này đã hoàn thành hoặc được miễn phần đó.
- Không mở sang xác suất, đại số tuyến tính hay đạo hàm (`mathforcode-s2..s4`).
- Không thêm UI, API, bảng dữ liệu, migration hay cơ chế tiến độ mới.
- Không dùng NumPy hoặc thư viện ngoài; mục tiêu là nhìn thấy cơ chế bằng hàm thuần.
- Không đổi id lộ trình, phase, stage, module hoặc bài đã phát hành.

## ② Điểm chạm

| Việc | Đường dẫn file                                                    | Ghi chú                           |
| ---- | ----------------------------------------------------------------- | --------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u134.ts`                  | Nhị phân, bù 2 và số thực         |
| Thêm | `packages/subject-programming/lessons/p6u135.ts`                  | Boolean, De Morgan và bit mask    |
| Thêm | `packages/subject-programming/lessons/p6u136.ts`                  | Modulo, buffer vòng, Luhn/ISBN-10 |
| Thêm | `packages/subject-programming/lessons/p6u137.ts`                  | Đếm phép tính, tổng và Big-O      |
| Sửa  | `packages/subject-programming/curriculum.ts`                      | Bốn unit P6 mới                   |
| Sửa  | `packages/subject-programming/lessons.ts`                         | Registry đồng bộ cho server/test  |
| Sinh | `packages/subject-programming/lessonsLazy.ts`                     | Chạy `npm run gen:lesson-index`   |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts`      | Ánh xạ stage → unit               |
| Sửa  | `packages/subject-programming/specializations/stageUnits.test.ts` | Khóa đủ bốn unit theo thứ tự      |
| Thêm | `docs/changelog/`                                                 | Nhật ký riêng của PR source       |

**Ảnh hưởng lan ra theo codemap và registry:**

- Trang stage/path tự mở nút “Vào học” khi `unitsOfStage('mathforcode-s1')` không còn rỗng.
- `lessonsLoader.ts` nạp bài qua chỉ mục lazy được sinh; `lessons.ts` chỉ phục vụ server/test/script.
- Các test lesson Python, schema, curriculum, SRS và markdown chạy trên dữ liệu mới.

## ③ Hợp đồng dữ liệu

**Vào:** metadata đã phát hành, không nhận dữ liệu mạng.

```ts
type MathForCodeS1ModuleId =
  'mathforcode-s1-m1' | 'mathforcode-s1-m2' | 'mathforcode-s1-m3' | 'mathforcode-s1-m4'
```

**Ra:**

```ts
const MATHFORCODE_S1_UNIT_IDS = ['p6-u134', 'p6-u135', 'p6-u136', 'p6-u137'] as const

// Mỗi file export đúng hai ProgrammingLesson có language: 'python'.
// SPEC_STAGE_UNITS['mathforcode-s1'] === MATHFORCODE_S1_UNIT_IDS.
```

**Ca lỗi:**

| Tình huống                                  | Cổng phát hiện                             | Hành vi mong đợi                |
| ------------------------------------------- | ------------------------------------------ | ------------------------------- |
| Unit id trùng hoặc chưa có trong curriculum | `curriculum.test.ts`, `stageUnits.test.ts` | CI đỏ, không merge              |
| Code mẫu hoặc đáp án Predict sai            | `lessonsPython.test.ts`                    | Chạy bằng Python thật và CI đỏ  |
| Make không có ca kiểm hiện                  | `lessons.test.ts`                          | Schema/test từ chối bài         |
| Thẻ SRS tự lộ đáp án hoặc quá ngắn          | `srsCards.test.ts`                         | CI đỏ                           |
| Ví dụ số thực dùng `==` như lời giải đúng   | review + test nội dung mục tiêu            | Sửa sang `math.isclose`/epsilon |

## ④ Tiêu chí chấp nhận

- [ ] Có đúng bốn unit mới và đúng tám lesson; mỗi unit có hai lesson, không id trùng.
- [ ] Bốn module gốc được phủ một-một, đúng thứ tự m1 → m4.
- [ ] Mọi worked example, Predict và Make chạy bằng Python thật; mỗi Make có ít nhất một ca hiện
      và một ca ẩn, gồm ca biên liên quan.
- [ ] Unit 134 chứng minh bù 2 theo số bit tường minh và so sánh số thực bằng ngưỡng.
- [ ] Unit 135 chứng minh De Morgan bằng bảng chân trị và thao tác bit mask không làm mất cờ khác.
- [ ] Unit 136 có wrap-around đúng với số âm, buffer vòng và ít nhất một bộ kiểm Luhn/ISBN-10.
- [ ] Unit 137 đối chiếu bộ đếm thực với công thức ở ít nhất năm kích thước và phân biệt
      `O(1)`, `O(log n)`, `O(n)`, `O(n²)` bằng hành vi tăng trưởng.
- [ ] `unitsOfStage('mathforcode-s1')` trả đúng `p6-u134..p6-u137`; UI không còn ghi bài đang soạn.
- [ ] Không có dependency, API, migration hay dữ liệu người học mới.

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming apps/dhcb/src/lib/lessonMarkdown.test.ts
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                     | Test canh                              |
| ------------------------------------------------------------ | -------------------------------------- |
| Mọi bài khớp `LessonSchema`, unit tồn tại và Make có ca hiện | `lessons.test.ts`                      |
| Python mẫu/đáp án/test-case chạy thật                        | `lessonsPython.test.ts`                |
| Unit không thuộc hai stage và stage chỉ trỏ tới unit có bài  | `stageUnits.test.ts`                   |
| Curriculum giữ id duy nhất và thứ tự ổn định                 | `curriculum.test.ts`                   |
| Lazy registry đồng bộ với registry nguồn                     | `lessonsLazy.test.ts`, lệnh sinh index |
| SRS hỏi một ý, không lộ đáp án, nội dung đủ nghĩa            | `srsCards.test.ts`                     |
| `principal-ai`, phase/stage/module id cũ không đổi           | `learningPaths.test.ts`                |

## ⑥ Quy ước dự án liên quan

- Nội dung giải thích bằng tiếng Việt; code Python dùng tên không dấu, rõ nghĩa.
- Công thức phải đi cùng thí nghiệm chạy được; không dùng phát biểu “hiển nhiên”.
- Predict chỉ có đúng một đáp án; lựa chọn nhiễu không được là chuỗi con gây khớp giả.
- Make dùng hàm thuần: không đọc file, mạng, thời gian hệ thống hay random không seed.
- Mỗi bài nối với một lỗi production cụ thể: sai số tiền, điều kiện quyền sai, index âm/wrap-around,
  hoặc chọn thuật toán không chịu được quy mô.
- Bài không tuyên bố “xong” thay cho rubric; hoàn thành lesson và nộp artifact là hai lớp riêng.

## Nghiệm thu

- Lệnh đã chạy + kết quả thật: điền trong PR source/changelog.
- Tiêu chí ④ đạt hết chưa: chờ implementation.
- Có phá bất biến ⑤ nào không: chờ implementation.
- Mở rộng ngoài phạm vi: không.
- Còn để ngỏ: `mathforcode-s2..s4`, `algo-s1..s2`, `systems-s1..s2`, `devops-s1`.
