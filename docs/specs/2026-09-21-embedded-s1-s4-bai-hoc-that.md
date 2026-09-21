# Đặc tả — Bài học thật cho hướng `embedded` (S1–S4)

> Ngày: 2026-09-21
> Trạng thái: **CHỜ CHỦ DỰ ÁN DUYỆT** (chưa triển khai — không được ghi "Approved for
> implementation" cho tới khi chủ dự án xác nhận mục ⑧).
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`.
> Tham khảo cấu trúc: `docs/specs/2026-09-17-devops-s3-bai-hoc-that.md`,
> `docs/specs/2026-09-16-systems-s1-bai-hoc-that.md`.

## 0. Một câu

Hướng `embedded` (Nhúng & IoT) hiện có bản đồ bốn chặng nhưng **chưa có bài học thật nào**; đặc
tả này lấp trọn cả bốn chặng bằng 16 unit / 32 lesson Python mô phỏng tất định (máy trạng thái
ngắt, ngân sách RTOS, giao thức khung có checksum, OTA có rollback, năng lượng/pin, bảo mật thiết
bị…) — vì runtime bài học không chạm được phần cứng thật, mọi thứ cần bo mạch/vi điều khiển thật
bị đẩy ra rubric bài tập về nhà ngoài sandbox.

## ① Phạm vi

**LÀM:**

- 16 unit mới, dải id đã cấp (xem mục ⑧ để chủ dự án xác nhận):
  - `embedded-s1`: `p6-u258, p6-u259, p6-u260, p6-u261` — bám 1-1 bốn module
    `embedded-s1-m1..m4` (`specializations/embedded.ts` dòng 69–106).
  - `embedded-s2`: `p6-u262, p6-u263, p6-u264, p6-u265` — bám 1-1 `embedded-s2-m1..m4`
    (dòng 123–160).
  - `embedded-s3`: `p6-u266, p6-u267, p6-u268, p6-u269` — bám 1-1 `embedded-s3-m1..m4`
    (dòng 178–214).
  - `embedded-s4`: `p6-u270, p6-u271, p6-u272, p6-u273` — bám 1-1 `embedded-s4-m1..m4`
    (dòng 233–269).
  - Không gộp module ở hướng này: bốn module mỗi chặng đã là bốn cơ chế tách bạch rõ (khác
    `web-s1`/`backend-*` nơi m3+m4 cùng trả lời một câu hỏi) — xem cột "Vì sao không gộp" ở
    mục ③.
- Mỗi unit **2 lesson** theo vòng 8 bước hiện có (`lessons/p6uNNN.ts`, `language: 'python'`):
  worked example + Predict + Make, có code mẫu Python chạy thật qua toàn bộ test-case.
- Simulator Python deterministic, bounded, fail closed cho từng cơ chế; mỗi Make có ca hiện +
  ca ẩn + **ca âm**; output là một dòng `"<decision>: <reason>"` tất định.
- Nối `SPEC_STAGE_UNITS['embedded-s1'..'embedded-s4']`, đăng ký vào `lessons.ts`, gắn vào bậc P6
  ở `curriculum.ts`, sinh lại `lessonsLazy.ts` bằng `npm run gen:lesson-index`.
- Bốn semantic gate riêng theo chặng (`embeddedS1Lessons.test.ts` … `embeddedS4Lessons.test.ts`)
  — tách theo chặng thay vì gộp một file 16-unit, theo đúng tiền lệ mỗi chặng một gate riêng
  (`devopsS3Lessons.test.ts`, `systemsS1Lessons.test.ts`).

**KHÔNG LÀM (quan trọng ngang mục trên):**

- Không chạm phần cứng, vi điều khiển, bo mạch, máy phân tích logic, máy hiện sóng thật.
  Không UART/I2C/SPI/GPIO thật, không cross-compile, không toolchain PlatformIO/FreeRTOS thật,
  không thư viện driver chip thật.
- Không network, filesystem, subprocess, biến môi trường, `datetime.now`, random toàn cục trong
  code chạy được. Không cấp phát động trong VÒNG CHẠY của simulator (bài S3-m1 mô phỏng đúng
  ràng buộc này bằng cách simulator tự cấp trước một buffer cố định, không `list.append` không
  giới hạn trong đường nóng).
- Không đụng unit id của hướng khác đã phát hành, không tái dùng id.
- Không tự ý nối `embedded-s1..s4` vào một lộ trình (`learningPaths/*.ts`) — hướng `embedded`
  hiện không nằm trong bất kỳ lộ trình chuyên biệt nào (`grep embedded packages/subject-programming/learningPaths/*.ts`
  rỗng ở thời điểm viết đặc tả này), khác `devops-s3` vốn được yêu cầu nối vào `principal-ai-p4`.
  Quyết định có nối hay không thuộc chủ dự án (mục ⑧).
- Không hứa simulator là chứng nhận EMC/an toàn chức năng thật ở S4-m4; nhãn MÔ PHỎNG bắt buộc.
- Không hạ chuẩn rubric phần cứng thật đã có trong `embedded.ts`/`embedded-s*.ts` (72 giờ/30
  ngày chạy liên tục, ảnh chụp máy phân tích logic, đo dòng thật…) — các rubric đó vẫn là bằng
  chứng NGOÀI sandbox, lesson chỉ dạy cơ chế quyết định.

## ② Điểm chạm

| Việc | Đường dẫn file                                                 | Ghi chú                                                                                                                                                                              |
| ---- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Thêm | `packages/subject-programming/lessons/p6u258.ts` … `p6u261.ts` | embedded-s1: ISR/GPIO, ngoại vi & datasheet, ngắt & chia sẻ dữ liệu, cô lập lỗi phần cứng/phần mềm                                                                                   |
| Thêm | `packages/subject-programming/lessons/p6u262.ts` … `p6u265.ts` | embedded-s2: lập lịch RTOS, khung giao thức có checksum, OTA A/B có rollback, ngân sách năng lượng                                                                                   |
| Thêm | `packages/subject-programming/lessons/p6u266.ts` … `p6u269.ts` | embedded-s3: watchdog & ghi bền qua mất điện, HAL giả lập cho CI, hệ tệp chỉ-đọc tối giản, ranh giới an toàn kiểu Rust (mô phỏng bằng hợp đồng, không cần trình biên dịch Rust thật) |
| Thêm | `packages/subject-programming/lessons/p6u270.ts` … `p6u273.ts` | embedded-s4: nạp/hiệu chuẩn tại xưởng, định danh & khởi động an toàn, vận hành đội thiết bị & OTA theo đợt, trạng thái an toàn khi hỏng                                              |
| Thêm | `packages/subject-programming/embeddedS1Lessons.test.ts`       | Semantic gate S1                                                                                                                                                                     |
| Thêm | `packages/subject-programming/embeddedS2Lessons.test.ts`       | Semantic gate S2                                                                                                                                                                     |
| Thêm | `packages/subject-programming/embeddedS3Lessons.test.ts`       | Semantic gate S3                                                                                                                                                                     |
| Thêm | `packages/subject-programming/embeddedS4Lessons.test.ts`       | Semantic gate S4                                                                                                                                                                     |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts`   | Thêm 4 khoá `embedded-s1..s4`                                                                                                                                                        |
| Sửa  | `packages/subject-programming/lessons.ts`                      | Đăng ký 16 unit vào registry đồng bộ                                                                                                                                                 |
| Sửa  | `packages/subject-programming/curriculum.ts`                   | Gắn 16 unit vào bậc P6                                                                                                                                                               |
| Sửa  | `packages/subject-programming/lessonsLazy.ts`                  | **SINH LẠI** bằng `npm run gen:lesson-index`, không gõ tay                                                                                                                           |

**Ảnh hưởng lan ra** (chạy `npm run codemap -- impact packages/subject-programming/specializations/stageUnits.ts`
trước khi sửa, và lặp lại cho `lessons.ts`):

- `specializations/stageUnits.test.ts`, `lessonsLazy.test.ts`, `lessonsPython.test.ts`,
  `specializations.test.ts`, `curriculum.test.ts`.
- Trang hướng `embedded` trong UI (`ProgrammingSpecializationPage.tsx` hoặc tương đương) —
  chuyển từ trạng thái "đang soạn" sang có nút "Vào học" ở cả bốn chặng; đọc lại test snapshot/UI
  liên quan thay vì sửa số cho vừa.

## ③ Hợp đồng dữ liệu

**Vào (hằng biên dịch trong `stageUnits.ts`):**

```ts
SPEC_STAGE_UNITS['embedded-s1'] = ['p6-u258', 'p6-u259', 'p6-u260', 'p6-u261']
SPEC_STAGE_UNITS['embedded-s2'] = ['p6-u262', 'p6-u263', 'p6-u264', 'p6-u265']
SPEC_STAGE_UNITS['embedded-s3'] = ['p6-u266', 'p6-u267', 'p6-u268', 'p6-u269']
SPEC_STAGE_UNITS['embedded-s4'] = ['p6-u270', 'p6-u271', 'p6-u272', 'p6-u273']
```

**Ra (mọi simulator):** một dòng quyết định tất định, dạng `"<decision>: <reason>"` với
`decision ∈ {allow, deny, reject, refuse, drift, freeze, redact, unknown}` — dùng lại đúng bảng
quyết định đã chốt ở `devops-s3` để giữ ngôn ngữ nhất quán xuyên các hướng hạ tầng/hệ thống.

**Hợp đồng từng unit và ca biên bắt buộc (gồm ca âm):**

| Unit      | Module                                      | Hợp đồng simulator và ca biên bắt buộc                                                                                                                                                                                                                                                                                                                                                                                                            | Vì sao không gộp module                                                                            |
| --------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `p6-u258` | `embedded-s1-m1` Vi điều khiển nhập môn     | Máy trạng thái GPIO: đọc chân input thả nổi (không điện trở kéo lên/xuống khai báo) → `unknown` (KHÔNG bịa giá trị 0/1); ghi chân đang cấu hình là input → `reject`; log gỡ lỗi UART tốn N chu kỳ mô phỏng cộng dồn vào ngân sách thời gian của vòng lặp, vượt ngân sách → `deny: log budget exceeded`.                                                                                                                                           | Chủ đề riêng: điện cơ bản + GPIO, không chồng lấp m2 (ngoại vi ADC/I2C).                           |
| `p6-u259` | `embedded-s1-m2` Ngoại vi                   | Đọc thanh ghi qua địa chỉ I2C giả lập theo bảng datasheet đồ chơi cố định; địa chỉ không có trong bảng → `reject: unknown address`; NACK giả lập (thiết bị không trả lời) → `unknown`, cấm trả giá trị bịa; đổi chu kỳ PWM ngoài dải khai báo → `deny: duty out of range`.                                                                                                                                                                        | Giao tiếp ngoại vi + đọc datasheet là kỹ năng khác hẳn xử lý ngắt ở m3.                            |
| `p6-u260` | `embedded-s1-m3` Ngắt và thời gian          | Mô hình ISR + hàng đợi: ISR chỉ được đặt cờ/đẩy 1 phần tử vào hàng đợi bounded; ISR có phép tính "dài" (mô phỏng bằng đếm bước > ngưỡng) → `deny: isr too long`; hàng đợi đầy khi ISR đẩy thêm → `reject: queue full` (không rớt ngầm); chống dội phím: chuỗi cạnh trong cửa sổ debounce → gộp thành 1 sự kiện, không đếm nhiều lần.                                                                                                              | ISR là ràng buộc thời gian thực, tách khỏi cấu hình phần cứng tĩnh ở m1/m2.                        |
| `p6-u261` | `embedded-s1-m4` Gỡ lỗi phần cứng           | Phân loại lỗi từ bằng chứng đo (khung bus giả lập + dòng tiêu thụ): có phản hồi trên bus nhưng giá trị sai → `reject: software`; im lặng trên bus (không byte nào) → `reject: hardware`; dòng đo vượt định mức tài liệu → `deny: overcurrent`; thiếu cả hai bằng chứng (chưa đo) → `unknown`, cấm đoán.                                                                                                                                           | Chẩn đoán là kỹ năng tổng hợp riêng, phải tách để đo được độc lập với 3 module kia.                |
| `p6-u262` | `embedded-s2-m1` RTOS                       | Lập lịch ưu tiên tĩnh N tác vụ với ngân sách ngăn xếp cố định: tác vụ vượt ngân sách ngăn xếp khai báo → `deny: stack overflow`; hai tác vụ cùng ưu tiên tranh 1 khoá không timeout → `refuse: priority inversion risk`; hàng đợi liên-tác-vụ đầy → `reject`; dùng biến toàn cục thay hàng đợi để truyền dữ liệu ISR↔task (đánh dấu trong input) → `deny: unsafe share`.                                                                          | RTOS là hạ tầng lập lịch, độc lập với giao thức mạng ở m2.                                         |
| `p6-u263` | `embedded-s2-m2` Kết nối                    | Khung dữ liệu có checksum (mô phỏng CRC đơn giản) gửi qua kênh mô phỏng có thể rớt gói: checksum sai → `reject: bad checksum`, không xử lý payload; mất kết nối → đẩy vào hàng đợi cục bộ bounded, đầy hàng đợi → chính sách rơi rụng tường minh (giữ mới nhất) chứ không rơi ngẫu nhiên; kết nối lại → gửi bù theo thứ tự, xác nhận từ "server" giả lập mới được xoá khỏi hàng đợi.                                                              | Giao thức mạng + đệm cục bộ là chủ đề riêng biệt khỏi lập lịch RTOS.                               |
| `p6-u264` | `embedded-s2-m3` OTA                        | Firmware A/B: gói không đúng chữ ký (mô phỏng bằng mã băm kỳ vọng) → `reject: bad signature`, không ghi vào phân vùng; ghi xong nhưng 3 lần "khởi động" thử đều thất bại (mô phỏng bằng cờ boot-fail) → tự `rollback` về bản cũ; đang ghi phân vùng đang CHẠY (A ghi đè A) → `deny: active partition`.                                                                                                                                            | Cập nhật từ xa là cơ chế an toàn riêng, không lẫn với lập lịch tác vụ hay pin.                     |
| `p6-u265` | `embedded-s2-m4` Năng lượng                 | Ngân sách điện: tổng dòng tiêu thụ các chế độ × thời gian mỗi chế độ trong 1 chu kỳ phải ≤ ngân sách pin; vượt ngân sách → `deny: battery budget exceeded` kèm số ngày dự kiến; chế độ ngủ sâu không tắt hết ngoại vi khai báo (rò dòng) → `refuse: peripheral not disabled`; thời gian mỗi chế độ âm hoặc vượt 24h/ngày → `invalid`.                                                                                                             | Ngân sách năng lượng là phép tính độc lập với 3 cơ chế còn lại của chặng.                          |
| `p6-u266` | `embedded-s3-m1` Độ tin cậy                 | Ghi bền kiểu "ghi mới rồi mới đổi con trỏ": cắt điện mô phỏng (dừng giữa chuỗi thao tác ở MỌI bước có thể) → đọc lại vẫn ra bản hợp lệ gần nhất, không bao giờ bản dở dang; watchdog không được "vuốt" (mô phỏng bằng thiếu lệnh kick) quá N chu kỳ → `deny: watchdog timeout` rồi reset trạng thái về bản bền cuối; cấp phát vượt buffer tĩnh đã dành sẵn (không `malloc` mô phỏng ngoài giai đoạn khởi tạo) → `reject: static budget exceeded`. | Trọng tâm là an toàn dữ liệu qua mất điện — tách khỏi hạ tầng test (m2).                           |
| `p6-u267` | `embedded-s3-m2` Kiểm thử phần cứng         | HAL giả lập có "double" ghi log mọi lệnh gọi; test case gọi thẳng thanh ghi thật (bỏ qua HAL, đánh dấu trong input) → `deny: bypasses HAL`; CI chạy N test trên "bo mạch" giả lập, một test không xác định (mô phỏng bằng cần > K lần lặp để ổn định) → `refuse: flaky, needs isolation`; môi trường thử (nhiệt/rung mô phỏng) ngoài dải khai báo của phần cứng → `unknown`.                                                                      | Kiểm thử là quy trình đảm bảo chất lượng, độc lập với cơ chế bền dữ liệu ở m1.                     |
| `p6-u268` | `embedded-s3-m3` Linux nhúng                | Hệ tệp chỉ-đọc mô phỏng: thao tác ghi ngoài vùng ghi riêng đã khai báo → `deny: read-only fs`; cây thiết bị thiếu khai báo ngoại vi mà driver cần → `reject: missing device node`; thời gian khởi động vượt ngân sách đã cam kết → `deny: boot budget exceeded`.                                                                                                                                                                                  | Linux nhúng là ngăn xếp hệ điều hành riêng, khác mô hình bare-metal ở m1/m2.                       |
| `p6-u269` | `embedded-s3-m4` Rust cho nhúng             | Hợp đồng an toàn bộ nhớ dạng kiểm tra tĩnh mô phỏng (không cần trình biên dịch Rust thật): truy cập biến chia sẻ ISR↔main không qua kiểu "khoá" bắt buộc trong mô hình → `deny: unsynchronized access`; dùng vùng nhớ sau khi mô hình đánh dấu đã giải phóng → `reject: use after free`; chọn `no_std` nhưng gọi API cần heap động → `deny: heap not allowed`.                                                                                    | Lựa chọn ngôn ngữ/an toàn bộ nhớ là quyết định kiến trúc riêng biệt, không lẫn HAL test hay Linux. |
| `p6-u270` | `embedded-s4-m1` Từ nguyên mẫu tới sản xuất | Quy trình nạp+hiệu chuẩn tại xưởng cho N máy: ghép firmware phiên bản không tương thích phần cứng đã khai báo → `deny: version mismatch`; hiệu chuẩn ghi đè ô nhớ không xoá đã có dữ liệu hợp lệ mà chưa xác nhận → `reject: calibration would overwrite`; thời gian nạp+kiểm một máy vượt ngân sách xưởng → `refuse: exceeds station budget`.                                                                                                    | Sản xuất hàng loạt là quy trình vận hành riêng, tách khỏi bảo mật (m2).                            |
| `p6-u271` | `embedded-s4-m2` Bảo mật thiết bị           | Định danh + khởi động an toàn: firmware không đúng chữ ký (khoá riêng từng thiết bị, KHÔNG dùng khoá chung lô) → `reject: bad signature`; phát hiện hai thiết bị cùng dùng một khoá định danh (nhân bản) → `deny: duplicate identity`; yêu cầu thu hồi một thiết bị → chỉ vô hiệu khoá của đúng thiết bị đó, các thiết bị khác không đổi trạng thái.                                                                                              | Bảo mật/định danh là lớp phòng thủ riêng, độc lập với vận hành đội (m3).                           |
| `p6-u272` | `embedded-s4-m3` Vận hành đội thiết bị      | OTA theo đợt nhỏ cho đội N thiết bị: tỉ lệ thiết bị báo lỗi sau cập nhật trong một đợt vượt ngưỡng dừng đã khai báo → `freeze: rollout paused` (không tự động đẩy đợt kế); thiết bị không báo "healthy" sau 3 lần thử khởi động bản mới → tự `rollback`; chỉ số sức khoẻ thiếu trường bắt buộc (phiên bản/pin/lần khởi động lại/lần liên lạc gần nhất) → `invalid`.                                                                               | Vận hành đội là vòng lặp giám sát+rollout, khác cơ chế ký/định danh từng máy ở m2.                 |
| `p6-u273` | `embedded-s4-m4` Chuẩn và an toàn           | Trạng thái an toàn khi hỏng: mất nguồn hoặc mất kết nối mô phỏng → thiết bị phải chuyển về trạng thái đã khai báo là an toàn (vd ngắt tải) trong bảng cấu hình, thiếu khai báo trạng thái an toàn cho một chế độ lỗi → `deny: no safe state defined`; tài liệu xưởng thiếu một bước bắt buộc trong checklist chuẩn → `reject: incomplete procedure`.                                                                                              | Tổng hợp an toàn chức năng mức khái niệm — không phải cơ chế mạng/lập lịch, đứng riêng cuối chặng. |

**Ca lỗi chung (một phần hợp đồng, áp cho toàn bộ 16 unit):**

| Tình huống                                                                                 | Mã / hành vi    | Hành vi mong đợi                                                     |
| ------------------------------------------------------------------------------------------ | --------------- | -------------------------------------------------------------------- |
| Input rỗng, thiếu trường, sai kiểu                                                         | `invalid`       | In một dòng `invalid: <trường>`, không ném exception, không treo     |
| Bằng chứng đo chưa đủ để kết luận                                                          | `unknown`       | Trả `unknown`, **cấm** bịa giá trị hoặc gọi là "bình thường"         |
| Mâu thuẫn giữa hai luật (vd vừa đủ ngân sách vừa vượt ngưỡng khác)                         | —               | Thứ tự ưu tiên tường minh, tất định; không phụ thuộc thứ tự dict/set |
| Trạng thái không nhận dạng được                                                            | `deny`          | Fail closed                                                          |
| Cấp phát/ghi vượt ngân sách tĩnh đã khai báo (S1-m1 log budget, S2-m1 stack, S3-m1 buffer) | `deny`/`reject` | Không bao giờ "chạy tiếp và hy vọng đủ chỗ"                          |

## ④ Tiêu chí chấp nhận

- [ ] `unitsOfStage('embedded-s1'..'embedded-s4').length === 4` mỗi chặng, mỗi unit = 2 lesson —
      `npx vitest run packages/subject-programming/specializations/stageUnits.test.ts`
- [ ] 32 lesson đều làn `python`, đều có Make với ca hiện + ca ẩn + ca âm —
      `npx vitest run packages/subject-programming/embeddedS1Lessons.test.ts packages/subject-programming/embeddedS2Lessons.test.ts packages/subject-programming/embeddedS3Lessons.test.ts packages/subject-programming/embeddedS4Lessons.test.ts`
- [ ] Code mẫu và ca Predict chạy Python THẬT và qua toàn bộ test-case —
      `npx vitest run packages/subject-programming/lessonsPython.test.ts`
- [ ] Không lesson nào chỉ "đọc hiểu": mỗi unit có đủ predict / debug / build / measure / decide
- [ ] Executable code không có `import os`, `import sys`, `open(`, `socket`, `subprocess`,
      `requests`, `random`, `datetime.now` — gate kiểm bằng chuỗi cấm
- [ ] Không lesson nào tuyên bố mô phỏng là kết quả từ bo mạch/vi điều khiển/hệ điều hành thật;
      nhãn "mô phỏng"/"giả lập" xuất hiện ở worked example của mỗi unit
- [ ] Markers bắt buộc theo chặng xuất hiện đủ trong nội dung:
      S1 `pull-up`, `datasheet`, `isr`, `debounce`, `logic analyzer`;
      S2 `stack budget`, `checksum`, `signature`, `rollback`, `battery budget`;
      S3 `watchdog`, `torn write`, `HAL`, `read-only`, `no_std`;
      S4 `calibration`, `duplicate identity`, `canary`/`đợt nhỏ`, `safe state`
- [ ] `lessonsLazy.ts` được SINH LẠI, không sửa tay — `npm run gen:lesson-index` rồi
      `git diff` chỉ hiện phần sinh
- [ ] Make dùng `match: 'contains'` (runner echo stdin, so khớp tuyệt đối sẽ đỏ giả)
- [ ] Rubric phần cứng thật đã có trong `embedded.ts`/`embedded-s*.ts` không bị sửa/hạ chuẩn

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/embeddedS1Lessons.test.ts
npx vitest run packages/subject-programming/embeddedS2Lessons.test.ts
npx vitest run packages/subject-programming/embeddedS3Lessons.test.ts
npx vitest run packages/subject-programming/embeddedS4Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npx vitest run packages/subject-programming/lessonsLazy.test.ts
npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                                                                  | Test nào canh nó                                                                                           |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Chỉ khai chặng có bài khi unit thật đã tồn tại                                                            | `specializations/stageUnits.test.ts`                                                                       |
| Chỉ mục nạp lười khớp registry đồng bộ                                                                    | `lessonsLazy.test.ts`                                                                                      |
| Mọi lesson Python có code mẫu chạy qua hết test-case                                                      | `lessonsPython.test.ts`                                                                                    |
| Simulator không có I/O ngoài, không cấp phát động trong vòng chạy, không random/đồng hồ hệ thống          | `embeddedS1..S4Lessons.test.ts` (viết mới ở lát này)                                                       |
| Id unit đã phát hành ở hướng khác không đổi/không tái dùng                                                | rà thủ công `grep -rn "p6-u25[89]\|p6-u26[0-9]\|p6-u27[0-3]" packages/subject-programming` trước khi mở PR |
| Rubric phần cứng thật (72 giờ, 30 ngày, ảnh máy phân tích logic, đo dòng thật…) không bị hạ chuẩn hay xoá | review thủ công diff `embedded.ts` + `embedded-s*.ts` (đặc tả này không sửa hai nhóm file đó)              |

## ⑥ Quy ước dự án liên quan

- Import xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi `.js`; import nội bộ gói dùng đường
  tương đối CÓ đuôi `.js`.
- Thêm/đổi bài học xong **bắt buộc** chạy `npm run gen:lesson-index`; quên thì
  `lessonsLazy.test.ts` đỏ với đúng câu nhắc đó.
- Comment trong file bài học viết tiếng Việt, giải thích "vì sao", không mô tả lại code.
- Cổng test của CI là `npm run test:coverage` (có ngưỡng chặn), không phải `npm test`.
- Trước lần push cuối: `rm -rf packages/*/dist dist dist-server` rồi chạy lại
  `npm run typecheck` để tái hiện checkout sạch của CI.
- Tiêu đề PR dùng scope chữ thường, ví dụ `feat(programming): ...`; mô tả phải có đủ 6 tiêu đề
  của cổng `metadata` và trỏ tới chính file đặc tả này kèm cụm "Approved for implementation"
  (chỉ sau khi chủ dự án đã duyệt mục ⑧).

## ⑦ Rollout và rollback

**Chia hai PR theo thứ tự dưới đây, không gộp một PR 16 unit** — lát này gấp đôi kích cỡ một
lát chặng đơn thường thấy (4 unit), và bốn chặng có phụ thuộc khái niệm tăng dần (bare-metal →
RTOS/kết nối → tin cậy/Linux → sản xuất/vận hành đội), nên chia theo đúng ranh giới đó giảm rủi
ro review một PR quá lớn:

1. **PR 1 — `embedded-s1` + `embedded-s2`** (`p6-u258..u265`, 8 lesson): nền tảng vi điều khiển,
   ngắt, RTOS, kết nối, OTA, năng lượng. Không phụ thuộc PR 2.
2. **PR 2 — `embedded-s3` + `embedded-s4`** (`p6-u266..u273`, 8 lesson), mở sau khi PR 1 merge:
   độ tin cậy, Linux nhúng, Rust, rồi sản xuất/bảo mật/vận hành đội — các unit này dùng lại từ
   vựng quyết định (`deny`/`reject`/`freeze`…) đã thống nhất ở PR 1, review PR 2 nhanh hơn nếu
   ngôn ngữ đã quen từ PR 1.

Mỗi PR tự đủ cổng (mục ④) và tự sinh lại `lessonsLazy.ts`. Rollback = revert trọn PR đó rồi chạy
lại `npm run gen:lesson-index`; KHÔNG xoá tiến độ/artifact của người học và KHÔNG tái sử dụng
unit id đã cấp cho phần rollback. Rủi ro lớn nhất là người học nhầm mô phỏng Python với firmware
chạy trên chip thật; nhãn MÔ PHỎNG trong worked example, semantic gate theo chặng, và rubric bài
tập về nhà (yêu cầu bo mạch thật NGOÀI sandbox, đã có sẵn trong `embedded.ts`) là ba lớp chặn.

## ⑧ Quyết định cần chủ dự án duyệt

1. ❓ **Cấp dải id** `p6-u258..u261` (S1), `p6-u262..u265` (S2), `p6-u266..u269` (S3),
   `p6-u270..u273` (S4) cho hướng `embedded` — đúng dải đã ghi trong yêu cầu giao việc, cần xác
   nhận không trùng với dải đang cấp song song cho hướng khác tại thời điểm merge.
2. ❓ **Có nối `embedded-s1..s4` vào một lộ trình học** (`learningPaths/*.ts`) hay để hướng này
   đứng độc lập như hiện tại? Đặc tả này mặc định KHÔNG nối (phạm vi ①), vì `embedded` chưa xuất
   hiện trong bất kỳ `learningPaths/*.ts` nào.
3. ❓ **Có chấp nhận chia 2 PR (S1+S2 rồi S3+S4) theo mục ⑦**, hay yêu cầu gộp một PR / chia
   khác (vd 4 PR mỗi chặng một PR)?
4. ❓ **Có chấp nhận mức trừu tượng hoá S3-m4 (Rust)**: hợp đồng an toàn bộ nhớ mô phỏng bằng
   Python thuần (không cần trình biên dịch Rust thật, không cài `rustc`/`no_std` toolchain trong
   CI) — đúng tinh thần "không phần cứng/toolchain thật" của đặc tả, nhưng là lựa chọn diễn giải
   cần xác nhận trước khi thi hành.

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ:
