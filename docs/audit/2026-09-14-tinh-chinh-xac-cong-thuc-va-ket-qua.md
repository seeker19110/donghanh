# Audit TÍNH CHÍNH XÁC — công thức, phép tính, đáp án của mọi bài học · 2026-09-14

Phần 2 của lượt rà môn học ngày 2026-09-14. Phần 1
(`docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md`) hỏi "nội dung có ĐỦ và có SẠCH
không". Phần này hỏi câu khó hơn: **nội dung có ĐÚNG không** — công thức, phép tính, và đáp án
lưu trong bài có thật sự đúng, và học sinh làm đúng có được chấm là đúng không.

Đây là loại lỗi mà `docs/framework/QUY-TRINH-AUDIT.md` gọi là **Tầng 10** — mọi cổng vẫn xanh
trong lúc lỗi tồn tại.

---

## 1. Cách kiểm (để lần sau lặp lại được)

Không đọc mắt thường 294 bài. Bốn máy kiểm chạy trên dữ liệu thật:

| #   | Máy kiểm                                                                    | Số mẫu kiểm được |
| --- | --------------------------------------------------------------------------- | ---------------- |
| 1   | Chấm lại đáp án chuẩn của MỌI câu hỏi bằng chính `@dhcb/core-grading`       | 665 câu          |
| 2   | Tính lại mọi chuỗi đẳng thức số trong lời giải (`a = b = c` phải bằng nhau) | 327 chuỗi        |
| 3   | Cân bằng nguyên tố mọi phương trình hoá học xuất hiện trong văn bản bài     | 33 phương trình  |
| 4   | Đối chiếu đáp án lưu với con số mà lời giải kết luận                        | 212 câu numeric  |

Mọi trường hợp máy báo đỏ đều **được đối chiếu tay với mã nguồn** trước khi ghi vào báo cáo —
không báo cáo con số thô của script.

---

## 2. 🔴 Phát hiện nghiêm trọng: 9 câu Vật lí CHẤM SAI học sinh trả lời ĐÚNG

`packages/core-grading/types.ts:41` ghi một quy tắc chốt, viết hoa trong tài liệu:

> **QUY TẮC CHỐT: `value` LUÔN lưu ở đơn vị SI cơ sở, không phải đơn vị hiển thị.**
> `unit` chỉ dùng để (1) biết thứ nguyên mong đợi, (2) hiển thị.

**Chín câu hỏi môn Vật lí vi phạm quy tắc này** — chúng lưu con số ở ĐƠN VỊ HIỂN THỊ. Engine
chấm đổi bài làm của học sinh sang SI rồi so với `value`, nên con số lệch đúng bằng hệ số đổi
đơn vị. Học sinh gõ chính xác đáp án mà **chính lời giải của bài viết ra** vẫn bị chấm `WRONG_VALUE`:

| Câu              | Lời giải của bài kết luận | `value` lưu      | Học sinh gõ đáp án đúng | Kết quả chấm     | `value` PHẢI là |
| ---------------- | ------------------------- | ---------------- | ----------------------- | ---------------- | --------------- |
| `ly11-c1-b7#q2`  | `x = 8,66 cm`             | 8.66 `cm`        | `8.66 cm`               | ❌ `WRONG_VALUE` | `0.0866`        |
| `ly12-c1-b7#q2`  | `θ = 70 °C`               | 70 `°C`          | `70 °C`                 | ❌ `WRONG_VALUE` | `343.15`        |
| `ly12-c2-b9#q2`  | `p₂ = 4 atm`              | 4 `atm`          | `4 atm`                 | ❌ `WRONG_VALUE` | `405300`        |
| `ly12-c2-b11#q1` | `p₂ = 4 atm`              | 4 `atm`          | `4 atm`                 | ❌ `WRONG_VALUE` | `405300`        |
| `ly12-c2-b11#q2` | `22,4 lít`                | 22.4 `lít`       | `22.4 lít`              | ❌ `WRONG_VALUE` | `0.0224`        |
| `ly12-c4-b21#q2` | `dm = 0,03038 amu`        | 0.03038 `amu`    | `0.03038 amu`           | ❌ `WRONG_VALUE` | `5.0447e-29`    |
| `ly12-c4-b23#q2` | `1/8 = 12,5%`             | 12.5 `%`         | `12.5 %`                | ❌ `WRONG_VALUE` | `0.125`         |
| `ly12-c4-b25#q1` | `lambda = 0,0693 ngày⁻¹`  | 0.0693 `ngày^-1` | `0.0693 ngày^-1`        | ❌ `WRONG_VALUE` | `8.0208e-7`     |
| `ly12-c4-b25#q2` | `E = 4,6575 MeV`          | 4.6575 `MeV`     | `4.6575 MeV`            | ❌ `WRONG_VALUE` | `7.4621e-13`    |

**Độ phủ:** đây là **9/10 = 90% số câu hỏi có đơn vị hệ số ≠ 1** trong toàn bộ 4 môn STEM. Nói
cách khác, gần như **mọi** câu hỏi không dùng đơn vị SI đều hỏng. Câu duy nhất đúng là
`ly10-c4-b27#q2` (lưu `0.8` cho `80 %`) — nó theo đúng quy tắc, nhưng đọc thô trong mã lại
trông như "0,8 %", nên rất dễ bị "sửa" nhầm thành sai.

Toán · Hoá · Sinh: **0 câu vi phạm** (không câu nào dùng đơn vị hệ số ≠ 1).

**Đã kiểm chứng cách sửa:** thay 9 giá trị bằng cột cuối của bảng → chạy lại engine chấm, cả 9
câu trả về `CORRECT` cho đúng chuỗi học sinh gõ. **AI tự làm được, PR nhỏ.**

## 3. 🔴 Cổng canh cho loại lỗi này là XANH GIẢ — nó không thể bắt được thứ nó sinh ra để bắt

`docs/specs/2026-09-13-hoan-thien-4-mon-stem.md` mục 3.1 chốt bỏ cổng duyệt chuyên môn, và nêu
**biện pháp thay thế bắt buộc**: mỗi môn có test canh "coi như người duyệt tự động".
Test đó là `packages/subject-physics/lessons.test.ts:37`:

> `it('mọi checkQuestion tự chấm ĐÚNG với chính đáp án đã khai — dùng engine chấm thật, không AI')`

Nó xanh 94/94 bài. Nhưng đọc kỹ cách nó dựng bài làm của "học sinh":

```ts
const displayValue = (q.answer.value - offset) / factor
studentInput = `${displayValue} ${q.answer.unit}`
```

Nó **giả định sẵn** rằng `value` đã ở SI rồi đổi ngược ra đơn vị hiển thị. Với
`{ value: 8.66, unit: 'cm' }` nó nạp vào `866 cm` — con số không ai viết ra và trái với lời giải
của chính bài — rồi thấy engine chấm đúng và kết luận "đạt".

Tức là test **mã hoá đúng cái hiểu lầm mà nó có nhiệm vụ phát hiện**. Nó không thể đỏ dù nội
dung sai thế nào, vì nó luôn tự tính lại đầu vào từ `value`. Ba môn còn lại dùng đúng khuôn này.

Đây đúng khuôn bẫy "cổng xanh giả" ở `TRAPS.md`, ở dạng nguy hiểm nhất: cổng được viện dẫn trong
đặc tả như **lý do để bỏ khâu duyệt của người**.

**Cách sửa (đề xuất):** nạp vào engine chuỗi **đơn vị hiển thị** đọc thẳng từ `value` (`${value}
${unit}` — thứ tác giả nội dung thật sự viết), rồi khẳng định nó chấm ĐÚNG khi và chỉ khi `value`
ở SI. Thêm test riêng: mọi câu có `unit` với `factor ≠ 1` phải khai `value` khác con số xuất hiện
trong `explain` (bắt đúng khuôn lỗi này). **AI tự làm được.**

## 4. 🟡 Một chỗ nhỏ: lời giải trả lời bằng số La Mã, ô nhập đòi số Ả Rập

`hoa10-c2-b7#q1` — đề: "Hoá trị cao nhất với oxygen của nhóm VIA là bao nhiêu? **(chỉ nhập số)**";
`value: 6`; lời giải: "Nhóm VIA ⇒ hoá trị **VI**." Học sinh đọc lời giải xong vẫn không thấy chữ
số nào. Sửa lời giải thành "hoá trị VI, tức 6". Không phải lỗi chấm.

---

## 5. Những gì đã kiểm và KHÔNG có lỗi (kết luận dương tính, không phải "chưa kiểm")

- **665/665 đáp án chuẩn tự chấm đúng** qua engine thật — trừ 9 câu ở mục 2. Toán 105 · Lí 208
  (199 đạt) · Hoá 182 · Sinh 170.
- **327 chuỗi đẳng thức số trong lời giải: 0 lỗi số học.** Máy báo 20 chỗ nghi; **cả 20 đã đối
  chiếu tay với mã nguồn và đều là hạn chế của bộ trích, không phải lỗi nội dung** — chủ yếu do
  bộ trích bỏ dấu `√` (`√25 = 5`), đọc chỉ số dưới kiểu `F_1`/`t₁` thành chữ số, và đọc dấu `·`
  nhân trong `−4.d` thành dấu thập phân. Ví dụ đã kiểm tay và xác nhận ĐÚNG:
  `C³₃₀ = 30!/(3!·27!) = (30·29·28)/(3·2·1) = 24360/6 = 4060` ·
  `d = |3·3 − 4·1 + 5| / √25 = 10/5 = 2` · `0² − 10² = 2·(−2)·d ⇒ d = 25 m`.
- **33 phương trình hoá học cân bằng đúng nguyên tố** (kiểm bằng `checkBalance` của
  `@dhcb/core-grading`, có chuẩn hoá chỉ số dưới Unicode và ký hiệu ↑↓). Trường hợp duy nhất
  "không cân bằng" mà máy bắt được là **cố ý**: `hoa11-c2-b6` viết sơ đồ chưa cân
  `Cu + HNO₃ → Cu(NO₃)₂ + NO + H₂O` ở bước 1, rồi cân đúng thành `3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO
  - 4H₂O` ở bước 4 — đúng cách dạy thăng bằng electron.
- **212 câu numeric: đáp án lưu khớp con số lời giải kết luận** (sau khi chuẩn hoá dấu trừ
  Unicode, dấu phẩy thập phân và ký hiệu mũ `10⁻⁷`). 14 chỗ máy báo ở môn Toán đều là câu
  đúng/sai dạng "nhập 1 nếu ĐÚNG, 0 nếu SAI" — lời giải là văn xuôi, không phải lỗi.
- **Vệ sinh trắc nghiệm sạch tuyệt đối** trên 442 câu `choice`: 0 phương án trùng nội dung,
  0 id phương án trùng, 0 câu nhiều đáp án đúng mà đề không báo, 0 `correctIds` trỏ tới id
  không tồn tại.
- **Môn Lập trình — đúng theo kiến trúc, không phải theo may mắn.** 4417 test xanh; mọi
  `make.sampleSolution` của cả 373 bài được **chạy thật** qua đúng bộ chạy của ngôn ngữ đó và
  phải đạt 100% test-case; `predict.answerIndex` 0 câu trỏ sai. Đây là môn duy nhất mà tính đúng
  đắn của đáp án được **thi hành**, chứ không chỉ được khai báo.
- **Môn Anh:** 11 917 mục từ, 0 mục có câu ví dụ Anh–Việt giống hệt nhau, 0 mục thiếu nghĩa/ví
  dụ. 90 mục (0,8%) có câu ví dụ không chứa nguyên dạng từ — kiểm tay thì đều là **biến thể đúng
  ngữ pháp** (`tooth`→"teeth", `cry`→"cried", `win`→"won"), không phải lỗi. 4 mục có nghĩa Việt
  trùng từ tiếng Anh (`internet`, `podcast`, `golf`, `vitamin`) — từ mượn, đúng.

---

## 6. Giới hạn của lượt kiểm này (nói rõ để không tưởng là đã phủ hết)

Máy kiểm được **tính nhất quán nội bộ**: phép tính có ra đúng số đã ghi, phương trình có cân
bằng, đáp án có tự chấm đúng. Máy **KHÔNG** kiểm được:

- Công thức vật lí/hoá học dẫn ra có **đúng bản chất** không (áp dụng nhầm định luật vẫn cho ra
  một chuỗi tính toán tự nhất quán hoàn hảo).
- **442 câu trắc nghiệm** — phương án nào đúng là chuyện chuyên môn, không máy nào phân xử được.
  Đây là **60% (442/665) tổng số câu hỏi**, và ở môn Sinh là **169/170 = 99%**.
- Nội dung `theory` có sai kiến thức hay lệch chương trình GDPT 2018 không.

Nghĩa là: lượt này đóng lại được nhóm lỗi cơ học, **không** thay được người có chuyên môn đọc
lại — đúng cái nợ mà `PROGRESS.md` đang ghi. Riêng môn Sinh gần như nằm ngoài tầm mọi máy kiểm.

---

## 7. Việc cần làm

| #   | Việc                                                                                             | Ai làm             | Cỡ  |
| --- | ------------------------------------------------------------------------------------------------ | ------------------ | --- |
| 1   | Sửa 9 giá trị Vật lí về SI theo bảng mục 2 (đã kiểm chứng cách sửa)                              | AI                 | nhỏ |
| 2   | Sửa test canh 4 môn để nó nạp ĐÚNG chuỗi tác giả viết, không tự tính lại                         | AI                 | nhỏ |
| 3   | Thêm test chặn khuôn lỗi: `unit` có `factor ≠ 1` thì `value` không được trùng số trong `explain` | AI                 | nhỏ |
| 4   | `hoa10-c2-b7#q1` — thêm chữ số vào lời giải                                                      | AI                 | nhỏ |
| 5   | Người có chuyên môn đọc lại 442 câu trắc nghiệm (Sinh trước, 169 câu)                            | **cần người dùng** | lớn |

Việc 1–4 gộp được vào MỘT PR. Làm việc 2 trước việc 1 thì test sẽ đỏ đúng 9 chỗ, tự chứng minh
cổng đã hết xanh giả.

---

## 8. Bằng chứng

```
npx vitest run packages/subject-{math,physics,chemistry,biology,english}  → 122/122 xanh
npx vitest run packages/subject-programming                               → 4417/4417 xanh
```

Bốn máy kiểm ở mục 1 chạy bằng `tsx` trên registry thật ngày 2026-09-14; mọi cờ đỏ đã đối chiếu
tay với mã nguồn trước khi lên báo cáo. Cách sửa 9 câu ở mục 2 đã chạy lại qua `gradeAnswer` và
cả 9 trả về `CORRECT`.
