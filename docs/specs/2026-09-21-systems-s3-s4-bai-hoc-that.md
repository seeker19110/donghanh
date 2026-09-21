# Đặc tả — Bài học thật cho `systems-s3` và `systems-s4`

> Ngày: 2026-09-21 · Trạng thái: **CHỜ CHỦ DỰ ÁN DUYỆT**
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`, theo đúng cấu trúc
> `docs/specs/2026-09-17-devops-s3-bai-hoc-that.md`.
> Tiền lệ cùng hướng: `docs/specs/2026-09-16-systems-s1-bai-hoc-that.md`,
> `docs/specs/2026-09-16-systems-s2-bai-hoc-that.md`.

## 0. Một câu

Lấp hai chặng rỗng cuối cùng của hướng Hệ thống: `systems-s3` (hiệu năng phần cứng + nhân hệ điều
hành) và `systems-s4` (trình biên dịch, runtime, nhân tối giản, an toàn tầng thấp) — mỗi chặng bốn
unit / tám bài Python MÔ PHỎNG, tất định và fail closed, để người học quyết định đúng thay vì chỉ
đọc lý thuyết hệ thống mức chuyên gia.

## ① Phạm vi

**LÀM:**

- Tám unit mới: `systems-s3` = `p6-u234…p6-u237`, `systems-s4` = `p6-u238…p6-u241`. Mỗi unit bám
  đúng MỘT module trong bốn module của chặng tương ứng (`systems-s3-m1..m4`, `systems-s4-m1..m4`
  ở `packages/subject-programming/specializations/systems.ts` dòng 176–267), hai lesson/unit theo
  vòng 8 bước hiện có.
- Simulator Python thuần, deterministic, bounded, fail closed cho từng cơ chế; mỗi Make có ca
  hiện, ca ẩn và ca âm.
- Nối `SPEC_STAGE_UNITS['systems-s3']` và `['systems-s4']`, đăng ký registry (`lessons.ts`),
  curriculum (`curriculum.ts`), sinh lại chỉ mục lười (`lessonsLazy.ts` qua
  `npm run gen:lesson-index`).
- Semantic gate riêng `systemsS3S4Lessons.test.ts` (một file cho cả hai chặng, theo mẫu
  `systemsS1Lessons.test.ts`/gate của `systems-s2`).

**KHÔNG LÀM (quan trọng ngang mục trên):**

- Không biên dịch/chạy C, C++, Rust, Assembly thật; không nhúng `gcc/clang/rustc`, không shell-out
  `perf`/`gdb`/`valgrind`/`eBPF`/QEMU, không tương tác kernel module thật, không network/socket
  thật. Ranh giới này giữ nguyên như `systems-s1`/`systems-s2` đã chốt.
- Không dạy lại nội dung `systems-s1` (bộ nhớ/C cơ bản) hay `systems-s2` (tiến trình/luồng/socket/
  Rust nhập môn) — `systems-s3` giả định người học đã qua hai chặng đó.
- Không đụng `systems-s1`/`systems-s2` đã phát hành, không đổi/tái dùng unit id đã cấp
  (`p6-u146…u149`, `p6-u150…u153`).
- Không tự ý nối `systems-s3`/`systems-s4` vào bất kỳ lộ trình nào (`principal-ai` hay lộ trình
  khác) — khảo sát cho thấy hướng `systems` hiện KHÔNG xuất hiện trong
  `packages/subject-programming/learningPaths/principal-ai.ts`; quyết định có nối hay không thuộc
  mục ⑧, không tự quyết trong lát này.
- Không hứa simulator là công cụ profiler/compiler/kernel/fuzzing production; nhãn MÔ PHỎNG bắt
  buộc ở mọi nơi liên quan tới công cụ thật (perf, eBPF, GC, JIT, ASLR…).
- Không coi hoàn thành 16 lesson Python là bằng chứng cho rubric/project của hai chặng (tăng tốc
  ≥5 lần đo thật, module nhân/eBPF chạy thật, ngôn ngữ/nhân chạy được trên QEMU) — rubric ở
  `details/systems-s3.ts`/`systems-s4.ts` vẫn là artifact ngoài sandbox.

## ② Điểm chạm

| Việc | Đường dẫn file                                               | Ghi chú                                                    |
| ---- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u234.ts`             | `systems-s3-m1` Phần cứng quyết định tốc độ                |
| Thêm | `packages/subject-programming/lessons/p6u235.ts`             | `systems-s3-m2` Đo trước khi sửa                           |
| Thêm | `packages/subject-programming/lessons/p6u236.ts`             | `systems-s3-m3` Bên trong nhân                             |
| Thêm | `packages/subject-programming/lessons/p6u237.ts`             | `systems-s3-m4` Đồng thời không khoá                       |
| Thêm | `packages/subject-programming/lessons/p6u238.ts`             | `systems-s4-m1` Trình biên dịch                            |
| Thêm | `packages/subject-programming/lessons/p6u239.ts`             | `systems-s4-m2` Runtime và bộ thu gom rác                  |
| Thêm | `packages/subject-programming/lessons/p6u240.ts`             | `systems-s4-m3` Hệ điều hành từ số 0                       |
| Thêm | `packages/subject-programming/lessons/p6u241.ts`             | `systems-s4-m4` An toàn ở tầng thấp                        |
| Thêm | `packages/subject-programming/systemsS3S4Lessons.test.ts`    | Semantic gate của lát cắt (cả hai chặng)                   |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts` | Thêm khoá `systems-s3`, `systems-s4` (dòng ~91–92)         |
| Sửa  | `packages/subject-programming/lessons.ts`                    | Đăng ký 8 unit vào registry đồng bộ                        |
| Sửa  | `packages/subject-programming/curriculum.ts`                 | Gắn 8 unit vào bậc P6                                      |
| Sửa  | `packages/subject-programming/lessonsLazy.ts`                | **SINH LẠI** bằng `npm run gen:lesson-index`, không gõ tay |
| Thêm | `docs/changelog/`                                            | Nhật ký riêng của PR implementation                        |

**Ảnh hưởng lan ra (chạy `npm run codemap -- impact packages/subject-programming/specializations/stageUnits.ts` trước khi sửa):**

- `stageUnits.test.ts` (kiểm chéo curriculum ↔ lessons), `lessonsLazy.test.ts`,
  `lessonsPython.test.ts`, `specializations.test.ts`.
- Trang stage hướng chuyên sâu (`ProgrammingSpecializationPage`/tương đương) tự hiện "Vào học" khi
  mapping thêm — không có mã số tiến độ theo lộ trình nào bị đổi vì `systems` không nằm trong
  `principal-ai` (khác `devops-s3` đã đổi mẫu số `principal-ai-p4`).

## ③ Hợp đồng dữ liệu

**Vào (hằng biên dịch trong `stageUnits.ts`):**

```ts
const SYSTEMS_S3_UNIT_IDS = ['p6-u234', 'p6-u235', 'p6-u236', 'p6-u237'] as const
const SYSTEMS_S4_UNIT_IDS = ['p6-u238', 'p6-u239', 'p6-u240', 'p6-u241'] as const
SPEC_STAGE_UNITS['systems-s3'] = [...SYSTEMS_S3_UNIT_IDS]
SPEC_STAGE_UNITS['systems-s4'] = [...SYSTEMS_S4_UNIT_IDS]
```

**Hợp đồng từng unit — `systems-s3`:**

| Unit      | Module                                      | Hợp đồng simulator và ca biên BẮT BUỘC                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u234` | `systems-s3-m1` Phần cứng quyết định tốc độ | Fixture truy cập mảng (stride, kích thước, số luồng ghi chung dòng cache). Stride > kích thước dòng cache mô phỏng → tính `cache_miss_rate` cao, quyết định `slow`; hai luồng ghi khác biến nhưng cùng dòng cache (offset lệch nhau < `LINE_SIZE`) → `false-sharing`; truy cập tuần tự đúng thứ tự bộ nhớ → `fast`; input thiếu `stride`/`line_size`/`access_pattern` → `invalid`.                                                                |
| `p6-u235` | `systems-s3-m2` Đo trước khi sửa            | Chuỗi mẫu đo (list số, ≥10 lần) của bản gốc và bản tối ưu. Độ lệch tương đối (dựa trung vị, không trung bình) > ngưỡng cho trước → `noisy`, cấm kết luận; số mẫu < 10 → `insufficient-samples` (`invalid`); tính tỉ lệ cải thiện tối đa theo Amdahl từ tỉ trọng phần tối ưu được, tỉ trọng ∉ [0,1] → `invalid`; phần tối ưu chiếm < ngưỡng nhỏ (vd 5%) dù tối ưu 100% vẫn → `not-worth-it`.                                                       |
| `p6-u236` | `systems-s3-m3` Bên trong nhân              | Bảng phân trang mô phỏng (working set, bộ nhớ vật lý khả dụng) + đếm syscall của một trace tiến trình. Working set > bộ nhớ vật lý → `thrash` (page fault rate cao); trace truy cập vùng ngoài không gian địa chỉ đã cấp cho tiến trình đó → `deny` (cách ly vi phạm); syscall count vượt ngưỡng/giây → `syscall-heavy`, gợi ý batch; trace rỗng hoặc pid không tồn tại trong bảng tiến trình → `invalid`.                                        |
| `p6-u237` | `systems-s3-m4` Đồng thời không khoá        | Hàng đợi lock-free mô phỏng bằng máy trạng thái tường minh (không thread thật): chuỗi thao tác producer/consumer + việc CÓ/KHÔNG đặt hàng rào bộ nhớ tại điểm găng. Thiếu hàng rào tại điểm công bố con trỏ/chỉ số → phát hiện thứ tự đọc-trước-ghi không hợp lệ → `race`; đủ hàng rào và thứ tự hợp lệ → `linearizable`; thao tác trên hàng đợi rỗng (consumer đọc khi chưa có phần tử) → `empty` (không crash); tràn capacity cố định → `deny`. |

**Hợp đồng từng unit — `systems-s4`:**

| Unit      | Module                               | Hợp đồng simulator và ca biên BẮT BUỘC                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u238` | `systems-s4-m1` Trình biên dịch      | Token stream / cây cú pháp mô phỏng cho ngôn ngữ đồ chơi (biểu thức, gán, if). Biến dùng trước khi khai báo → `undeclared-var`; sai kiểu ở phép toán (vd cộng số với chuỗi trong ngôn ngữ đồ chơi kiểu tĩnh) → `type-error`, kèm số dòng; chương trình hợp lệ → `compiled` + số lệnh IR sinh ra; token/AST rỗng hoặc thiếu vị trí dòng → `invalid`.                                                                                                                          |
| `p6-u239` | `systems-s4-m2` Runtime và GC        | Máy ảo ngăn xếp bytecode nhỏ (PUSH/ADD/CALL/RET) + heap object graph cho GC mark-sweep mô phỏng. Object không còn reachable từ root set → `collected`; object còn reachable bị đánh dấu thu gom (double free giả) → `deny` (bảo toàn an toàn bộ nhớ mô phỏng); ngăn xếp bytecode tràn/thiếu (stack underflow khi RET không có frame) → `stack-error`; heap graph có chu trình vẫn phải mark-sweep đúng (không đệ quy vô hạn) → `collected` hoặc `unreachable` chính xác.     |
| `p6-u240` | `systems-s4-m3` Hệ điều hành từ số 0 | Bảng trang hai tiến trình mô phỏng + hàng đợi lập lịch round-robin + log chuyển ngữ cảnh (thanh ghi, SP, PC lưu/khôi phục đủ trường). Tiến trình A đọc/ghi địa chỉ ảo trỏ vào trang không thuộc bảng trang của A → `deny`; context switch thiếu một trong các trường bắt buộc (registers/sp/pc) → `invalid`; lịch chạy round-robin đúng quantum → `scheduled` kèm thứ tự; hàng đợi rỗng (không tiến trình nào runnable) → `idle`.                                            |
| `p6-u241` | `systems-s4-m4` An toàn tầng thấp    | Fixture tràn bộ đệm mô phỏng (buffer size, độ dài ghi, có bật ASLR/stack-canary/W^X hay không) + kết quả một vòng fuzzing mô phỏng (coverage đạt được theo số ca). Độ dài ghi > buffer size và canary tắt → `overflow-undetected` (nguy hiểm nhất, phải fail closed ở lớp ứng dụng gọi); canary bật và bị ghi đè → `overflow-detected` + `abort`; coverage không tăng sau N ca liên tiếp → `plateau`, gợi ý đổi chiến lược; input fixture thiếu trường bắt buộc → `invalid`. |

**Ra (mọi simulator):** một dòng quyết định xác định, dạng
`"<decision>: <reason>"`.

**Ca lỗi (là một phần hợp đồng, không phải phụ lục):**

| Tình huống                                                                 | Mã / hành vi                     | Hành vi mong đợi                                                                        |
| -------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------- |
| Input rỗng, thiếu trường, sai kiểu                                         | `invalid`                        | In một dòng `invalid: <trường>`, không ném exception, không treo                        |
| Mẫu đo/coverage ít hơn ngưỡng tối thiểu                                    | `unknown`/`insufficient-samples` | Trả nhãn tường minh, **cấm** quy về "đã tối ưu"/"đã an toàn"                            |
| Mâu thuẫn giữa hai luật (vd cách ly vi phạm + working set thrash cùng lúc) | —                                | Thứ tự ưu tiên tường minh, tất định; không phụ thuộc thứ tự dict                        |
| Trạng thái không nhận dạng được                                            | `deny`                           | Fail closed — đặc biệt bắt buộc ở `p6-u236` (cách ly bộ nhớ) và `p6-u241` (tràn bộ đệm) |

## ④ Tiêu chí chấp nhận

- [ ] `unitsOfStage('systems-s3').length === 4` và `unitsOfStage('systems-s4').length === 4`, mỗi
      unit ≥ 2 lesson — `npx vitest run packages/subject-programming/specializations/stageUnits.test.ts`
- [ ] 16 lesson đều là làn `python`, đều có Make với ca hiện + ca ẩn + ca âm —
      `npx vitest run packages/subject-programming/systemsS3S4Lessons.test.ts`
- [ ] Code mẫu và ca Predict chạy Python THẬT và qua toàn bộ test-case —
      `npx vitest run packages/subject-programming/lessonsPython.test.ts`
- [ ] Không lesson nào chỉ "đọc hiểu": mỗi unit có đủ predict / debug / build / measure / decide
- [ ] Executable code không có `import os`, `import sys`, `open(`, `socket`, `subprocess`,
      `ctypes`, `threading` thật, `requests`, `random` (không seed), `datetime.now` — gate kiểm
      bằng chuỗi cấm
- [ ] Markers bắt buộc xuất hiện theo unit: `cache_miss_rate`/`false-sharing` (u234),
      `noisy`/`insufficient-samples`/`Amdahl` (u235), `thrash`/`page fault`/`syscall` (u236),
      `linearizable`/`race`/`memory barrier` (u237), `undeclared-var`/`type-error` (u238),
      `mark-sweep`/`reachable`/`stack-error` (u239), `context switch`/`page table`/`idle` (u240),
      `overflow-detected`/`canary`/`coverage`/`plateau` (u241)
- [ ] `getSpecStage('systems-s3')` và `getSpecStage('systems-s4')` tra được đúng bốn unit theo
      thứ tự m1→m4
- [ ] KHÔNG có PR nào tự thêm `systems-s3`/`systems-s4` vào một lộ trình (`principal-ai.ts` hay
      file lộ trình khác) trừ khi mục ⑧ được duyệt riêng
- [ ] `lessonsLazy.ts` được SINH LẠI, không sửa tay — `npm run gen:lesson-index` rồi `git diff`
      chỉ hiện phần sinh
- [ ] Make dùng `match: 'contains'` (runner echo stdin, so khớp tuyệt đối sẽ đỏ giả)

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/systemsS3S4Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npx vitest run packages/subject-programming/lessonsLazy.test.ts
npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                                            | Test nào canh nó                                       |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Chỉ khai chặng có bài khi unit thật đã tồn tại                                      | `specializations/stageUnits.test.ts`                   |
| Chỉ mục nạp lười khớp registry đồng bộ                                              | `lessonsLazy.test.ts`                                  |
| Mọi lesson Python có code mẫu chạy qua hết test-case                                | `lessonsPython.test.ts`                                |
| `systems-s1`/`systems-s2` đã phát hành và các stage khác không đổi                  | `stageUnits.test.ts`, `specializations.test.ts`        |
| Không lộ trình nào tự nhận `systems-s3`/`systems-s4` ngoài duyệt                    | `learningPaths/learningPaths.test.ts` (không đổi file) |
| Simulator không có I/O ngoài, không network/thread/subprocess thật                  | `systemsS3S4Lessons.test.ts` (viết mới ở lát này)      |
| Fail closed cho vi phạm cách ly bộ nhớ (u236) và tràn bộ đệm không phát hiện (u241) | `systemsS3S4Lessons.test.ts` ca âm riêng               |

## ⑥ Quy ước dự án liên quan

- Import xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi `.js`; import nội bộ gói dùng đường tương
  đối CÓ đuôi `.js`.
- Thêm/đổi bài học xong **bắt buộc** chạy `npm run gen:lesson-index`; quên thì
  `lessonsLazy.test.ts` đỏ với đúng câu nhắc đó.
- Comment trong file bài học viết tiếng Việt, giải thích "vì sao", không mô tả lại code.
- Nội dung mô phỏng dùng nhãn "mô phỏng"/"trace mô phỏng" khi nhắc tới perf, eBPF, GC, trình biên
  dịch, nhân hệ điều hành, ASLR/canary/fuzzing — tên công cụ thật chỉ xuất hiện trong phần lý
  thuyết/so sánh, không xuất hiện như thể đã chạy thật (cùng quy ước `systems-s1`).
- Cổng test của CI là `npm run test:coverage` (có ngưỡng chặn), không phải `npm test`.
- Trước lần push cuối: `rm -rf packages/*/dist dist dist-server` rồi chạy lại `npm run typecheck`
  để tái hiện checkout sạch của CI.
- Tiêu đề PR dùng scope chữ thường, ví dụ `feat(programming): ...`; mô tả phải có đủ 6 tiêu đề của
  cổng `metadata` và trỏ tới chính file đặc tả này kèm cụm "Approved for implementation" — CHỈ
  sau khi chủ dự án đã duyệt file này (mục ⑧).

## ⑦ Rollout và rollback

Một PR duy nhất cho cả hai chặng (hoặc hai PR liên tiếp nếu chủ dự án muốn tách theo chặng — chốt
ở mục ⑧). Rollback = revert trọn PR rồi chạy lại `npm run gen:lesson-index`; KHÔNG xoá tiến độ/
artifact của người học và KHÔNG tái sử dụng unit id đã cấp. Rủi ro lớn nhất là người học nhầm
simulator (cache/GC/kernel/fuzzing mô phỏng) với công cụ thật đang chạy trên máy họ; nhãn MÔ
PHỎNG, semantic gate và rubric project (yêu cầu công cụ thật NGOÀI sandbox: perf/valgrind thật,
QEMU, fuzzer thật) là ba lớp chặn — giữ đúng mô hình đã dùng ở `systems-s1`.

## ⑧ Quyết định cần chủ dự án duyệt

1. **Cấp dải `p6-u234…p6-u237` cho `systems-s3` và `p6-u238…p6-u241` cho `systems-s4`** — khảo sát
   cho thấy dải này chưa xuất hiện ở đâu trong `packages/subject-programming/` tại thời điểm viết
   đặc tả (2026-09-21).
2. **Có nối `systems-s3`/`systems-s4` vào lộ trình `principal-ai` (hay lộ trình khác) không?**
   Khác `devops-s3` (đã nối vào `principal-ai-p4`), khảo sát cho thấy hướng `systems` hiện KHÔNG
   xuất hiện trong bất kỳ file lộ trình nào (`learningPaths/principal-ai.ts`) — chặng chỉ truy cập
   được qua trang hướng chuyên sâu `systems`, không qua một lộ trình có thứ tự. Đề xuất mặc định:
   KHÔNG nối (giữ nguyên cách `systems-s1`/`systems-s2` đang là), vì `systems` là hướng độc lập
   không có lộ trình tổng hợp nào đang dùng nó; nối vào `principal-ai` cần xác nhận riêng vì sẽ
   đổi mẫu số tiến độ hiển thị của lộ trình đó.
3. **Một PR cho cả hai chặng, hay hai PR tách theo `systems-s3`/`systems-s4`?** Đề xuất: một PR,
   vì cả hai đều nhỏ (4 unit/8 bài mỗi chặng) và dùng chung một semantic gate.

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ:
