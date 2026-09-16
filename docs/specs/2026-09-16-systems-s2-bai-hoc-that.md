# Đặc tả — Bài học thật cho `systems-s2`

> Ngày: 2026-09-16  
> Trạng thái: **APPROVED FOR IMPLEMENTATION** — đặc tả khóa tổng đã được chủ dự án duyệt; chủ
> dự án yêu cầu “triển khai nốt” sau khi `systems-s1` merge.  
> Goal: `GOAL-2026-ASA`, lát cắt `M2/S1h`.

## 0. Một câu

Biến chặng “Hệ điều hành nhìn từ chương trình” thành tám bài Python tương tác giúp người học kiểm
chứng vòng đời tiến trình, đồng bộ, file descriptor, độ bền ghi, TCP framing và event loop trước
khi làm artifact shell/server bằng C và Rust trên Linux thật.

## ① Phạm vi

**LÀM:**

- Tạo bốn unit `p6-u150..p6-u153`, mỗi unit phủ đúng một module `systems-s2-m1..m4`; mỗi unit
  có hai bài Python theo vòng hook → theory → worked example → Predict → Parsons → Make →
  homework → SRS.
- `p6-u150` — **Tiến trình, luồng và đồng bộ**: mô phỏng `fork/exec/wait`, exit/signal,
  zombie/orphan; interleaving, mutex/condition, race và chu trình wait-for gây deadlock.
- `p6-u151` — **Vào/ra, file và bộ nhớ ảo**: file descriptor, pipe, redirect, EOF,
  backpressure, partial read/write; state machine `temp → fsync(file) → rename → fsync(dir)`,
  crash point và page/mmap trên miền hữu hạn.
- `p6-u152` — **Socket và event loop**: TCP byte stream với length-prefix chịu split/coalescing
  và peer đóng dở; non-blocking readiness, output buffer, fairness budget và backpressure.
- `p6-u153` — **Rust cho hệ thống**: mô hình move/borrow/lifetime; `Option`/`Result`, truyền lỗi
  và ranh giới `unsafe` có precondition/postcondition tường minh.
- Đăng ký curriculum, registry thường/lazy và `SPEC_STAGE_UNITS['systems-s2']` sau khi đủ tám bài;
  giữ project/rubric shell + TCP server 1000 kết nối là artifact ngoài sandbox.

**KHÔNG LÀM:**

- Không thêm runtime C/Rust, compiler, syscall, socket hoặc process thật vào browser/CI.
- Không shell-out tới `fork`, `gcc`, `rustc`, `strace`, sanitizer hay mở cổng mạng.
- Không coi simulator vượt test là bằng chứng đạt shell nhiều pipe, TCP 1000 kết nối hay chạy một
  giờ không leak; các yêu cầu đó giữ nguyên trong rubric.
- Không mở sang cache/hardware/kernel/eBPF của `systems-s3`; không đổi quiz, module, rubric, API,
  migration, dependency hoặc dữ liệu tiến độ đã có.

## ② Điểm chạm

| Việc | Đường dẫn                                                                        |
| ---- | -------------------------------------------------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u150.ts` — process/thread state          |
| Thêm | `packages/subject-programming/lessons/p6u151.ts` — fd/file/durability            |
| Thêm | `packages/subject-programming/lessons/p6u152.ts` — TCP/event loop                |
| Thêm | `packages/subject-programming/lessons/p6u153.ts` — ownership/Result/unsafe       |
| Thêm | `packages/subject-programming/systemsS2Lessons.test.ts` — semantic boundary gate |
| Sửa  | `curriculum.ts`, `lessons.ts`, `lessonsLazy.ts` — bốn unit và tám bài            |
| Sửa  | `specializations/stageUnits.ts` + test — mapping `systems-s2`                    |
| Sửa  | `e2e/programming-path.spec.ts` — trang hướng hiện nút học cho S2                 |
| Thêm | `docs/changelog/` — bằng chứng implementation                                    |

Ảnh hưởng lan ra: `lessonsPython.test.ts` chạy sample/worked/Predict bằng Python thật; schema,
curriculum, SRS, Markdown và lazy-index tests kiểm chéo dữ liệu; trang hướng tự mở CTA khi mapping
không rỗng.

## ③ Hợp đồng dữ liệu

```ts
type SystemsS2ModuleId = 'systems-s2-m1' | 'systems-s2-m2' | 'systems-s2-m3' | 'systems-s2-m4'

const SYSTEMS_S2_UNIT_IDS = ['p6-u150', 'p6-u151', 'p6-u152', 'p6-u153'] as const

// Mỗi file export đúng hai ProgrammingLesson, language: 'python'.
// SPEC_STAGE_UNITS['systems-s2'] === SYSTEMS_S2_UNIT_IDS.
```

Mọi simulator nhận input hữu hạn, tất định và tạo state mới mỗi lượt. Không đọc file/mạng/process,
không dùng clock hay random toàn cục. Trace phải ghi sự kiện và state đủ để tái hiện quyết định.

| Tình huống                           | Hành vi bắt buộc                                             |
| ------------------------------------ | ------------------------------------------------------------ |
| child exit nhưng cha chưa `wait`     | zombie; sau `wait` bị reap                                   |
| hai task ghi shared state không lock | trace đánh dấu race nếu read-modify-write xen kẽ             |
| wait-for graph có chu trình          | báo deadlock cùng chu trình; không treo simulator            |
| pipe hết writer và buffer rỗng       | EOF; buffer đầy thì writer bị backpressure                   |
| write trả ít byte                    | vòng lặp giữ phần còn lại; không coi là thành công toàn phần |
| crash trước/sau rename/fsync         | kết quả theo state machine, không suy rộng filesystem thật   |
| TCP thiếu frame                      | giữ buffer; peer đóng khi còn frame dở → `truncated-frame`   |
| socket chưa writable                 | giữ output buffer và write-interest, không drop byte         |
| borrow trái luật                     | từ chối với lý do; `unsafe` chỉ qua khi precondition đúng    |

## ④ Tiêu chí chấp nhận

- [ ] Có đúng bốn unit, tám lesson, mỗi unit hai lesson; mỗi Make có visible, hidden và ca biên.
- [ ] Mọi worked example, Predict và sample solution chạy bằng Python thật; output tất định.
- [ ] Process simulator phân biệt running/exited/zombie/reaped; scheduler bắt lost update và
      deadlock cycle mà không treo.
- [ ] I/O simulator giữ đúng descriptor/pipe ownership, EOF/backpressure, partial write;
      durability phân biệt rename, fsync file và fsync directory.
- [ ] TCP parser xử lý split/coalesced/truncated frames; event loop giữ output còn lại, có fairness
      budget và không busy-spin khi không readiness.
- [ ] Borrow simulator bắt use-after-move, alias mutable và lifetime escape; bài Result/unsafe
      khóa precondition/postcondition.
- [ ] Tất cả bài ghi rõ “MÔ PHỎNG”; không có `language: 'c'|'rust'` hay tuyên bố toolchain thật.
- [ ] `unitsOfStage('systems-s2')` trả đúng `p6-u150..p6-u153`; UI hướng Hệ thống hiện CTA S2.
- [ ] Rubric shell/TCP/C/Rust thật không bị hạ chuẩn hoặc tự đánh dấu hoàn thành.

**Lệnh nghiệm thu:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/systemsS2Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming apps/dhcb/src/lib/lessonMarkdown.test.ts
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npx playwright test e2e/programming-path.spec.ts --project=chromium
```

## ⑤ Bất biến

| Bất biến                                              | Cổng                                    |
| ----------------------------------------------------- | --------------------------------------- |
| Lesson schema, unit thật, test hiện/ẩn                | `lessons.test.ts`, `curriculum.test.ts` |
| Python mẫu/đáp án chạy thật                           | `lessonsPython.test.ts`                 |
| State machine không treo và bắt ca âm                 | `systemsS2Lessons.test.ts`              |
| Không giả toolchain/kernel/socket thật                | `systemsS2Lessons.test.ts` + review     |
| Unit không thuộc hai stage, thứ tự ổn định            | `stageUnits.test.ts`                    |
| Registry nguồn và lazy đồng bộ                        | `lessonsLazy.test.ts`, generator        |
| SRS không lộ đáp án                                   | `srsCards.test.ts`                      |
| Rubric 1000 connection, leak, atomic write giữ nguyên | review `details/systems-s2.ts`          |

## ⑥ Quy ước, rollout và rollback

- Nội dung tiếng Việt; code Python tên không dấu và state transition tường minh.
- Không dạy “TCP là message”: framing là trách nhiệm tầng ứng dụng.
- Không dạy readiness là completion; non-blocking call vẫn có thể xử lý ít hơn yêu cầu.
- Không dạy rename đồng nghĩa mọi filesystem đều durable; giả định đứng cạnh kết quả.
- `unsafe` không phải lối tắt bỏ kiểm tra: mỗi block có safety contract và test ca vi phạm.
- Hoàn thành lesson và đạt artifact rubric là hai lớp bằng chứng khác nhau.

Rollout một PR source sau khi PR spec merge: thêm bài → chạy semantic/Python gates → sinh lazy
index → cuối cùng mới ánh xạ stage và E2E. Rollback bằng revert trọn PR source, sinh lại lazy index,
không đổi/xóa tiến độ hay tái sử dụng ID. Production deploy ngoài phạm vi nếu không có lệnh riêng.

## Nghiệm thu đặc tả

- Phủ đủ bốn module và giữ đúng ranh giới runtime hiện có: có.
- Giữ nguyên artifact Linux/C/Rust thật: có.
- Rủi ro chính: simulator bị hiểu nhầm là OS/toolchain thật; đã khóa bằng nhãn, test và rubric.
- Còn để ngỏ: `systems-s3`; hạ tầng C/Rust sandbox; artifact shell/server thật.
