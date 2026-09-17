# Đặc tả — `security-s3`: vì sao lỗ hổng tồn tại và cách TÌM ra chúng

> Ngày: 2026-09-17 · Trạng thái: **APPROVED FOR IMPLEMENTATION** (chủ dự án duyệt ngày 2026-09-17)
> Goal: `docs/goals/2026-09-15-ai-systems-architect.md` — lát cắt `M6/S1c`.
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`.

## 0. Một câu

`security-s3` có bốn unit / tám bài Python MÔ PHỎNG dạy người học **hiểu cơ chế sinh ra lỗ hổng và
tự tìm được lỗi bằng công cụ**, để họ thiết kế và thẩm định hệ thống bằng hiểu biết thật chứ không
bằng niềm tin.

## 1. Vì sao chặng này được GIỮ, và giữ theo cách nào

Chủ dự án chốt ngày 2026-09-17: giữ `security-s3` trong khoá, bác đề xuất loại. Lý do đứng vững —
một kiến trúc sư phải **thẩm định được** lựa chọn ngôn ngữ, phải hiểu vì sao "viết cẩn thận" không
thay thế được an toàn bộ nhớ, và phải biết fuzzing tìm ra lỗi mà code review bỏ sót. Đây là nội
dung chuẩn của mọi chương trình an toàn phần mềm bậc đại học.

Nhưng **cách dạy phải giữ đúng ranh giới đã chốt** ở `security-s1`/`security-s2`. Nguyên tắc chi
phối toàn bộ lát cắt này:

> Dạy **vì sao lỗ hổng tồn tại** và **cách phát hiện** nó.
> Không cung cấp công cụ, quy trình hay mã để khai thác lỗ hổng trên hệ thống thật.

Cụ thể hoá thành bốn quyết định thiết kế:

1. **Máy ảo đồ chơi, không phải kiến trúc thật.** Module dịch ngược dùng một tập lệnh tự đặt
   (khoảng 12 lệnh) do chính đặc tả này định nghĩa. Người học luyện đúng kỹ năng cần có — đọc luồng
   điều khiển từ mã mức thấp — mà bài học không trở thành bảng tra opcode x86/ARM.
2. **Mô hình bộ nhớ trừu tượng, và bài là PHÁT HIỆN lỗi.** Người học viết bộ kiểm tra tìm ra ghi
   ngoài biên, dùng sau giải phóng, giải phóng hai lần trên một mô hình ô nhớ có nhãn. Kết bài là
   so sánh: cùng chương trình đó viết bằng ngôn ngữ có kiểm biên thì lớp lỗi này **biến mất**.
   Không dựng chuỗi ROP, không sinh shellcode, không có công thức vượt ASLR/DEP.
3. **Fuzzing trên parser đồ chơi tất định.** Đây là phần có giá trị nghề nghiệp cao nhất và an toàn
   nhất: đo độ phủ nhánh, thu nhỏ ca lỗi bằng delta-debugging. Kỹ năng thu được dùng thẳng vào việc
   viết test hồi quy.
4. **Không mã độc, không mục tiêu thật.** Không phân tích mẫu mã độc, không đụng nhị phân thật,
   không có bước nào hướng vào một hệ thống đang chạy.

Dự án chặng trong bản đồ hướng (`specializations/security.ts`: fuzz một thư viện mã nguồn mở, báo
cáo theo quy trình công bố có trách nhiệm) **giữ nguyên** — nó là bài tập NGOÀI sandbox, đã có sẵn
khung trách nhiệm từ `security-s2` (`p6-u189`, công bố có trách nhiệm).

## ① Phạm vi

**LÀM:**

- Bốn unit `p6-u210…p6-u213`, mỗi unit hai lesson 8 bước, bám bốn module của `security-s3` trong
  `specializations/security.ts` (dòng 174–225).
- Simulator Python deterministic, bounded, fail closed; mỗi Make có ca hiện, ca ẩn, ca âm.
- Nối `SPEC_STAGE_UNITS['security-s3']`, curriculum, registry, `lessonsLazy.ts`.
- Semantic gate `securityS3Lessons.test.ts` với danh sách cấm ở ⑤.
- **Nối `security-s3` vào `principal-ai-p4`**, ngay sau `security-s2`.

**KHÔNG LÀM (đây là ranh giới cứng, không phải lời khuyên):**

- **Không sinh mã khai thác dưới bất kỳ dạng nào**: shellcode, chuỗi ROP/JOP, mồi heap, payload,
  hay các bước vượt ASLR/DEP/stack canary. Những cơ chế phòng thủ đó được giải thích là **chúng bảo
  vệ cái gì**, không phải cách đi vòng qua chúng.
- **Không nhị phân thật, không mã độc.** Không tải, không tháo rời, không chạy, không phân tích mẫu
  mã độc. Không nhắc tên họ mã độc cụ thể.
- **Không bảng opcode kiến trúc thật.** Tập lệnh là đồ chơi, do đặc tả này định nghĩa.
- **Không nhắm vào hệ thống đang chạy**: không dò quét, không network, không CVE kèm bước tái hiện.
- Không filesystem, subprocess, biến môi trường, đồng hồ hệ thống hay random toàn cục trong code
  chạy được. Fuzzer dùng hạt giống cố định truyền vào, sinh input tất định.
- Không đụng `security-s1`/`security-s2`/`security-s4` đã có; không tái dùng unit id.

## ② Điểm chạm

| Việc | Đường dẫn file                                               | Ghi chú                                   |
| ---- | ------------------------------------------------------------ | ----------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u210.ts`             | Đọc luồng điều khiển từ mã mức thấp       |
| Thêm | `packages/subject-programming/lessons/p6u211.ts`             | Vì sao an toàn bộ nhớ là biện pháp gốc rễ |
| Thêm | `packages/subject-programming/lessons/p6u212.ts`             | Fuzzing theo độ phủ và thu nhỏ ca lỗi     |
| Thêm | `packages/subject-programming/lessons/p6u213.ts`             | Chuỗi cung ứng, IAM cloud và bảo mật AI   |
| Thêm | `packages/subject-programming/securityS3Lessons.test.ts`     | Semantic gate + danh sách cấm             |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts` | Thêm khoá `security-s3`                   |
| Sửa  | `packages/subject-programming/lessons.ts`                    | Đăng ký 4 unit                            |
| Sửa  | `packages/subject-programming/curriculum.ts`                 | Gắn unit vào bậc P6                       |
| Sửa  | `packages/subject-programming/lessonsLazy.ts`                | **SINH LẠI**, không gõ tay                |
| Sửa  | `packages/subject-programming/learningPaths/principal-ai.ts` | Thêm `security-s3` vào `principal-ai-p4`  |

**Ảnh hưởng lan ra:** `stageUnits.test.ts`, `lessonsLazy.test.ts`, `lessonsPython.test.ts`,
`specializations.test.ts`, `learningPaths.test.ts`, `ProgrammingPathPage.tsx` (mẫu số chặng của P4).
Chạy `npm run codemap -- impact packages/subject-programming/specializations/stageUnits.ts` trước
khi sửa.

## ③ Hợp đồng dữ liệu

```ts
SPEC_STAGE_UNITS['security-s3'] = ['p6-u210', 'p6-u211', 'p6-u212', 'p6-u213']
```

### Tập lệnh đồ chơi cho `p6-u210` (do đặc tả này định nghĩa, KHÔNG phải ISA thật)

Mười hai lệnh, mỗi lệnh một dòng `OP arg`: `PUSH n` · `POP` · `ADD` · `SUB` · `LOAD s` ·
`STORE s` · `CMP` · `JMP i` · `JZ i` · `JNZ i` · `CALL i` · `RET` · `HALT`.
Máy có ngăn xếp giá trị, bảng biến theo tên, con trỏ lệnh. Không có con trỏ thô, không có địa chỉ
tuyệt đối — **cố ý**, để không ai biến nó thành bài tập khai thác.

| Unit      | Module                                     | Hợp đồng simulator và ca biên BẮT BUỘC                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u210` | `security-s3-m1` Dịch ngược                | Từ chuỗi lệnh đồ chơi, dựng đồ thị luồng điều khiển: chia khối cơ bản, nối cạnh, nhận dạng vòng lặp và nhánh, phục hồi cấu trúc `if`/`while`. Lệnh lạ → `invalid`; đích nhảy ngoài phạm vi → `invalid`; khối không bao giờ tới được → `unreachable` (nêu rõ khối nào); vòng lặp không có lối thoát → `no-exit`; trần số bước thực thi để không treo.                                                                                                                                                      |
| `p6-u211` | `security-s3-m2` An toàn bộ nhớ            | Mô hình ô nhớ có nhãn `{owner, len, freed}` cùng một chuỗi thao tác đọc/ghi/cấp/giải phóng. Người học viết bộ **PHÁT HIỆN**: ghi ngoài biên → `oob-write`; đọc sau giải phóng → `use-after-free`; giải phóng hai lần → `double-free`; rò rỉ khi kết thúc còn ô chưa giải phóng → `leak`; chỉ số âm hoặc `len = 0` → `invalid`. Bài chốt so cùng chuỗi thao tác đó dưới ngữ nghĩa **có kiểm biên**: mọi lỗi trên phải thành `prevented`. **Không trả về địa chỉ, không dựng payload — chỉ phân loại lỗi.** |
| `p6-u212` | `security-s3-m3` Tìm lỗi tự động           | Parser đồ chơi tất định + fuzzer theo độ phủ với hạt giống truyền vào. Đo độ phủ nhánh; giữ input làm tăng độ phủ; thu nhỏ ca lỗi bằng delta-debugging. **Ca lỗi sau khi thu nhỏ phải VẪN gây đúng lỗi đó** — test canh bằng cách chạy lại; thu nhỏ quá tay thành ca không còn lỗi là SAI. Ngân sách số lần thử có trần; hết ngân sách mà không tìm ra → `not-found`, cấm báo "không có lỗi"; cùng hạt giống phải cho cùng kết quả (tất định).                                                            |
| `p6-u213` | `security-s3-m4` Bảo mật hệ thống hiện đại | Ba nhóm phân loại + biện pháp giảm thiểu: (a) chuỗi cung ứng — phụ thuộc thiếu xuất xứ/chữ ký → `deny`, lệ thuộc chuyển tiếp không khai báo → gắn cờ; (b) IAM cloud — vai trò ký tự đại diện, ranh giới tài khoản bị xuyên qua → `deny`; (c) bảo mật AI — nội dung lấy về luôn là **dữ liệu, không phải lệnh**; tiêm lệnh qua tài liệu truy hồi → `contain`; đầu độc dữ liệu huấn luyện → `quarantine` nguồn; công cụ ngoài allow-list → `deny`. Nguồn không xác thực được → fail closed.                 |

**Ra (mọi simulator):** một dòng `"<decision>: <reason>"`, `decision ∈ {ok, invalid, unreachable,
no-exit, oob-write, use-after-free, double-free, leak, prevented, not-found, deny, contain,
quarantine}`.

**Ca lỗi:** input sai kiểu/thiếu trường → `invalid`; vượt trần bước/ngân sách → dừng có kiểm soát và
báo rõ, không treo; trạng thái lạ → fail closed. Không ném exception ra ngoài.

## ④ Tiêu chí chấp nhận

- [ ] `unitsOfStage('security-s3').length === 4`; 8 lesson Python; Make có ca hiện + ẩn + âm
- [ ] Code mẫu và ca Predict chạy Python thật, qua hết test-case — `lessonsPython.test.ts`
- [ ] `p6-u211` có ca chứng minh ngữ nghĩa kiểm biên biến mọi lỗi thành `prevented`
- [ ] `p6-u212` có test canh: ca lỗi đã thu nhỏ chạy lại vẫn gây đúng lỗi ban đầu
- [ ] `p6-u212` tất định: cùng hạt giống → cùng kết quả qua hai lần chạy
- [ ] **Danh sách cấm (gate đỏ nếu xuất hiện ở bất kỳ đâu trong lesson, kể cả phần giải thích):**
      `shellcode`, `rop chain`, `gadget`, `nop sled`, `heap spray`, `egg hunter`, `bypass aslr`,
      `bypass dep`, `defeat canary`, `\x90`, và mọi chuỗi byte payload
- [ ] Không tên kiến trúc thật (`x86`, `x86_64`, `arm64`, `aarch64`) trong **code chạy được**; nếu
      nhắc trong phần giải thích thì chỉ ở mức đối chiếu khái niệm
- [ ] Không tên công cụ tấn công đi kèm bước dùng; `Ghidra`/`IDA`/`AFL`/`Semgrep` chỉ được nhắc là
      "công cụ cùng loại ngoài đời", không có hướng dẫn thao tác
- [ ] Không mẫu mã độc, không mã CVE kèm bước tái hiện
- [ ] Executable code không có `import os`, `import sys`, `open(`, `socket`, `subprocess`,
      `requests`, `random`, `datetime.now`
- [ ] Markers bắt buộc: `basic block`, `control flow`, `unreachable`, `bounds`, `use-after-free`,
      `double-free`, `prevented`, `memory-safe`, `coverage`, `minimize`, `seed`, `deterministic`,
      `provenance`, `least privilege`, `prompt injection`, `data poisoning`
- [ ] Mỗi unit có ít nhất một đoạn nêu rõ **mục đích phòng thủ** của kiến thức đó
- [ ] `principal-ai-p4` có `security-s3` sau `security-s2`; `getSpecStage` tra được; không vòng lặp
      `requires`
- [ ] `lessonsLazy.ts` sinh lại bằng lệnh

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/securityS3Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                              | Test nào canh nó                       |
| --------------------------------------------------------------------- | -------------------------------------- |
| **Bài dạy phát hiện và phòng ngừa, không cung cấp công cụ khai thác** | `securityS3Lessons.test.ts` (viết mới) |
| Không nhị phân thật, mã độc, ISA thật hay mục tiêu đang chạy          | `securityS3Lessons.test.ts` (viết mới) |
| Fuzzer tất định, không random toàn cục                                | `securityS3Lessons.test.ts` (viết mới) |
| Thu nhỏ ca lỗi giữ nguyên tính chất gây lỗi                           | `securityS3Lessons.test.ts` (viết mới) |
| Chỉ khai chặng có bài khi unit thật đã tồn tại                        | `specializations/stageUnits.test.ts`   |
| Chỉ mục nạp lười khớp registry đồng bộ                                | `lessonsLazy.test.ts`                  |
| Id đã phát hành không đổi, không tái dùng                             | `learningPaths/learningPaths.test.ts`  |

## ⑥ Quy ước dự án liên quan

- `npm run gen:lesson-index` sau mọi thay đổi bài học.
- Make dùng `match: 'contains'` vì runner echo stdin.
- Cổng CI là `npm run test:coverage`.
- Import nội bộ gói có đuôi `.js`; xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi.
- Comment tiếng Việt, giải thích "vì sao".

## ⑦ Rollout và rollback

Một PR. Rollback = revert trọn PR + sinh lại chỉ mục; không xoá tiến độ/artifact, không tái dùng id.

**Rủi ro lớn nhất của cả goal nằm ở lát cắt này:** một bài giải thích lỗ hổng trượt thành một bài
hướng dẫn khai thác. Bốn lớp chặn, theo thứ tự hiệu lực: (1) thiết kế — máy ảo đồ chơi và mô hình
bộ nhớ trừu tượng khiến kiến thức **không chuyển thẳng** sang mục tiêu thật; (2) hướng bài — mọi
unit hỏi "phát hiện thế nào", không hỏi "khai thác thế nào"; (3) danh sách cấm chặn CI ở ④;
(4) review của chủ dự án trước khi merge. **Đề nghị: lát cắt này người chủ dự án đọc diff bài học
trước khi bật auto-merge**, khác với bốn lát còn lại.

## ⑧ Quyết định đã duyệt (chủ dự án, 2026-09-17)

1. ✅ **Giữ `security-s3` trong khoá** — "khoá học này đáng để thêm".
2. ✅ Cấp dải `p6-u210…p6-u213`.
3. ✅ Thêm `security-s3` vào `principal-ai-p4` sau `security-s2`.
4. Cách dạy theo bốn quyết định thiết kế ở mục 1 — do AI đề xuất trong chính đặc tả này, chủ dự án
   xác nhận khi review PR bài học.

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Đã đọc diff bài học trước khi merge chưa:
- Còn để ngỏ:
