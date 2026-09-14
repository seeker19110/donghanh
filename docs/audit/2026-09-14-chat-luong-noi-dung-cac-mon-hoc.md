# Audit chất lượng nội dung TOÀN BỘ các môn học — 2026-09-14

**Phạm vi:** 6 gói môn học đang có trong repo (`packages/subject-*`) + dữ liệu môn Anh trong
`apps/dhcb/src/data/`. Đây là audit **nội dung sư phạm**, không phải audit 11 tầng toàn repo
(`docs/framework/QUY-TRINH-AUDIT.md`) — các tầng hạ tầng/bảo mật không nằm trong lượt này.

**Nguyên tắc đã theo:** chỉ ĐỌC + BÁO CÁO, không sửa. Mọi con số dưới đây đo bằng script chạy
thật trên dữ liệu thật, không lấy từ tài liệu cũ.

---

## 1. Bảng tổng quan (đo 2026-09-14)

| Môn       | Số bài                   | Trạng thái duyệt  | Hoạt ảnh | Nhánh HSG | Cổng test tự động           |
| --------- | ------------------------ | ----------------- | -------- | --------- | --------------------------- |
| Lập trình | 373                      | (không có trường) | —        | —         | **4417 test, 56 file** ✅   |
| Vật lí    | 94                       | 94/94 `draft`     | 14 (15%) | 9         | 10 test-case nội dung       |
| Sinh học  | 84                       | 84/84 `draft`     | 15 (18%) | **0**     | 9 test-case nội dung        |
| Hoá học   | 81                       | 81/81 `draft`     | 15 (19%) | 9         | 6 test-case nội dung        |
| Toán      | 35                       | 35/35 `draft`     | 11 (31%) | 6         | 6 test-case nội dung        |
| Tiếng Anh | 699 vòng / 11 917 mục từ | —                 | —        | —         | có (cefrTagging, wordFreq…) |

Cổng tự động của 5 gói (Toán/Lí/Hoá/Sinh/Anh): **122/122 xanh**.
Cổng môn Lập trình: **4417/4417 xanh** (32,5s).

---

## 2. Phát hiện — xếp theo mức độ

### 🔴 F1 — 294 bài STEM đều là `draft` nhưng giao diện KHÔNG hề nói ra

`packages/subject-chemistry/lessonTypes.ts` ghi rõ mục đích của trường `reviewStatus` là đánh
dấu bài "CHƯA DUYỆT CHUYÊN MÔN". Đo thật: **100% (294/294) bài của cả 4 môn STEM mang
`reviewStatus: 'draft'`**, và `grep` toàn repo cho thấy trường này **chỉ được đọc bởi Zod schema
và chính test của gói** — `apps/dhcb/src/pages/learning/StemLessonView.tsx` không đọc nó ở bất
kỳ dòng nào.

Hệ quả: người học thấy 294 bài Toán/Lí/Hoá/Sinh **không kèm cảnh báo nào** rằng nội dung chưa
qua duyệt chuyên môn. Đặc tả `docs/specs/2026-09-13-hoan-thien-4-mon-stem.md` mục 3.1 nói người
dùng đã chốt "bỏ cổng duyệt trước khi nối vào app" và chấp nhận rủi ro "nội dung STEM sai công
thức/đơn vị đến thẳng người học" — nhưng biện pháp thay thế chỉ là test nhất quán nội bộ, không
có phần nói với người học. Trường `reviewStatus` hiện là **dữ liệu chết**.

**Đề xuất:** hiện huy hiệu "Bản nháp — chưa duyệt chuyên môn" trên `StemLessonView` +
`StemLessonList` khi `reviewStatus === 'draft'`, và thêm test canh. Chi phí nhỏ, gỡ được đúng
rủi ro mà chính đặc tả đã ghi nhận. **AI tự làm được.**

### 🔴 F2 — Môn Toán mỏng nhất và thủng nhiều chương của chương trình GDPT 2018

Toán chỉ có **35 bài** cho cả ba lớp — bằng 1/3 ba môn STEM còn lại. Các chương có bài
(20 = mã nhánh HSG, không phải chương thật):

| Lớp | Chương CÓ bài   | Chương THIẾU |
| --- | --------------- | ------------ |
| 10  | 1,2,3,4,6,7,8,9 | **5**        |
| 11  | 1,2,5,6,7,9     | **3, 4, 8**  |
| 12  | 1,4,5,6         | **2, 3**     |

Tổng cộng **6 chương trống**. Test canh của gói Toán (`lessons.test.ts`) chỉ kiểm id/schema/thứ
tự, **không có ngưỡng số bài tối thiểu** — trong khi gói Sinh có
`expect(BIOLOGY_LESSONS.length).toBeGreaterThanOrEqual(80)`. Nên lỗ hổng này không cổng nào bắt.

**Đề xuất:** ưu tiên bổ nội dung 6 chương trống trước khi làm gì khác cho STEM; đồng thời thêm
ngưỡng số bài tối thiểu vào test của cả 4 gói cho đồng bộ. **Cần người dùng quyết ưu tiên**
(viết nội dung là việc lớn, phải tách đợt riêng).

### 🟠 F3 — Vòng từ vựng sinh tự động môn Anh KHÔNG có câu mẫu: 588/677 vòng (86,9%)

> **ĐÍNH CHÍNH 2026-09-14 (PR đặc tả, xem `docs/specs/2026-09-14-cau-mau-cho-vong-tu-vung-cefr.md`):**
> con số "610/699" ghi ban đầu ở mục này là **SAI**. Đo lại hai lượt độc lập trên cùng dữ liệu:
> tổng **677** vòng = **588** vòng `cefr-*` sinh tự động + **89** vòng thủ công. Bản chất phát
> hiện không đổi: **0/588** vòng sinh tự động có câu mẫu, **89/89** vòng thủ công thì có.
> Các mục F4 và bảng xếp ưu tiên bên dưới vẫn ghi "610" theo nguyên văn lúc audit — đọc là **588**.

Triết lý gốc ghi ngay đầu `apps/dhcb/src/data/curriculum.ts`: "Mỗi vòng gom ~20 từ cùng chủ đề,
kèm vài CÂU THÔNG DỤNG dùng chính những từ trong vòng đó (để học từ xong là ráp được câu ngay)".

Đo thật:

- 89 vòng **thủ công**: 89/89 có câu mẫu ✅
- 610 vòng **sinh tự động** (`cefr-*`, từ `cefrC1C2Vocab.ts` + `cefrA1B2ExtraVocab.ts`): **0/610
  có câu mẫu** ❌

Nghĩa là 87% lộ trình từ vựng không giữ được lời hứa sư phạm của chính nó — người học qua khỏi
89 vòng nền tảng là mất hẳn phần ráp câu.

### 🟠 F4 — Cờ `notForKids` không phủ được các vòng sinh tự động

`lib/curriculum.ts:148` lọc `notForKids` cho nhóm `nhi_dong`. Chỉ **12 vòng thủ công** gắn cờ
này; **610 vòng sinh tự động không vòng nào gắn được**. Chú thích trong
`curriculumTypes.ts` biện minh rằng "không ai ở tốc độ học của trẻ em chạm tới mức C1/C2" —
nhưng lý lẽ đó **chỉ đúng với `cefrC1C2Vocab.ts`**, còn `cefrA1B2ExtraVocab.ts` sinh ra các vòng
A1/A2/B1 mà trẻ em chắc chắn học tới, với đúng những chủ đề mà cờ này định chặn:

| Vòng                   | Chủ đề               | Mục từ thật                                  |
| ---------------------- | -------------------- | -------------------------------------------- |
| `cefr-a1-business-1`   | Kinh doanh & kinh tế | `personals` — "chuyên mục quảng cáo cá nhân" |
| `cefr-a2-society-1`    | Xã hội & con người   | `census` — "điều tra dân số"                 |
| `cefr-b1-health_med-2` | Sức khỏe & y học     | `hiv`                                        |
| `cefr-a1-emotion-1`    | Cảm xúc & tính cách  | `shyness`                                    |

**Đề xuất:** script sinh vòng gắn `notForKids` theo nhãn chủ đề (`business`, `law_politics`,
`health_med`, `society`, `emotion`) cho mọi bậc, không chỉ vòng thủ công. **AI tự làm được.**

### 🟠 F5 — 23 vòng từ vựng chỉ có 1–4 từ

Cỡ vòng đo được: min **1**, trung vị 17, max 26. 23 vòng dưới 5 từ, trong đó
`cefr-a1-nature_env-1` và `cefr-c1-modifier-28` chỉ có **đúng 1 từ**. Một "vòng" 1 từ là đơn vị
học vô nghĩa — nó vẫn chiếm một mục trong lộ trình, một lần chuyển màn hình, một mốc tiến độ.

**Đề xuất:** script sinh gộp phần đuôi < 5 từ vào vòng liền trước cùng chủ đề. **AI tự làm được.**

### 🟡 F6 — Hoạt ảnh phủ rất mỏng: 55/294 bài STEM (19%)

Chi tiết: Toán 11/35 (31%) · Hoá 15/81 (19%) · Sinh 15/84 (18%) · Lí 14/94 (**15%**). Vật lí —
môn mà hình động giúp hiểu nhiều nhất (chuyển động, trường lực, sóng) — lại phủ thấp nhất.
Không phải lỗi (schema để `optional`), nhưng lệch với mục tiêu đặc tả "có hoạt ảnh minh hoạ".

### 🟡 F7 — Nhánh HSG lệch giữa các môn

24 chuyên đề HSG chia đều ba cấp (8 `hsg-truong` / 8 `hsg-tinh` / 8 `hsg-quoc-gia`) nhưng phân
bố theo môn thì lệch: Lí 9 · Hoá 9 · Toán 6 · **Sinh 0**. Môn Sinh không có nhánh HSG là **đúng
đặc tả** (mục 2 ghi rõ "KHÔNG làm: nhánh HSG cho môn Sinh"). Nhưng **Hoá lớp 12 cũng 0 chuyên
đề** trong khi Hoá 10 có 3 và Hoá 11 có 6 — chỗ này lệch không có lý do ghi ở đâu cả.

### 🟡 F8 — Sáu bài Hoá trùng tiêu đề nguyên văn giữa lớp 11 và lớp 12

`Ôn tập chương 1..6` xuất hiện ở cả hai lớp (`hoa11-c1-b3` ↔ `hoa12-c1-b3`, …). Nội dung khác
nhau, nhưng trong danh sách bài / kết quả tìm kiếm / URL slug thì hai bài trông y hệt.
**Đề xuất:** thêm lớp vào tiêu đề ("Ôn tập chương 1 — Hoá 11"). **AI tự làm được.**

### 🟡 F9 — 19 câu hỏi môn Lí có giải thích dưới 40 ký tự

Schema chỉ yêu cầu `min(1)`. 19 câu ở môn Vật lí (và 1 ở Hoá) có `explain` quá ngắn để dạy được
gì — với môn mà học sinh sai vì hiểu nhầm khái niệm, một dòng giải thích cụt là mất luôn giá trị
sư phạm của câu hỏi. Toán và Sinh: 0 câu.

### 🟡 F10 — 14 bài Lập trình chỉ có ĐÚNG MỘT test-case

Trung vị 3 test-case/bài, max 9, nhưng 14 bài chỉ có 1. Một test-case đơn nghĩa là học viên có
thể hard-code đáp án mà vẫn "đạt 100%". Không bài nào thiếu test hay ẩn hết test.

### 🟢 F11 — 36 câu ví dụ tiếng Anh bị dùng lại cho nhiều mục từ

Nhỏ, nhưng làm loãng chất lượng cảm nhận khi hai từ khác nhau minh hoạ bằng đúng một câu.

---

## 3. Những chỗ đang LÀM TỐT (ghi lại để không phá)

- **Môn Lập trình là chuẩn mực của dự án.** 373 bài, 158 unit, phủ **kín** 65/65 unit khai báo ở
  P6 và 100% unit ở P1–P5 — không unit nào rỗng. Mọi `sampleSolution` được **chạy thật qua đúng
  bộ chấm của ngôn ngữ đó** trong test (bash · dom · fetch · git · hermes · html · javascript ·
  kotlin · openclaw · sql · swift · typescript · vibe · python/pytest/apisim/httpsim). 0 bài
  thiếu hint, 0 bài thiếu lời giải mẫu, 0 `answerIndex` trỏ sai, 0 trùng hook/theory/homework/đề
  bài. Gói `lessonsSwift.test.ts` là **cổng dựng sẵn cho ngôn ngữ chưa có bài** — mẫu tốt nên
  nhân rộng.
- **Vệ sinh dữ liệu STEM sạch:** 0 trùng id, 0 trùng hook, 0 trùng theory, 0 đáp án `choice` trỏ
  tới id không tồn tại, 0 bài có câu hỏi lặp, 0 thẻ SRS lặp — trên cả 294 bài.
- **Từ vựng môn Anh không trùng lặp:** 0 mục từ trùng (word+pos) trên 11 917 mục qua 699 vòng;
  0 mục thiếu nghĩa Việt, 0 mục thiếu câu ví dụ.
- Phân bố từ theo bậc CEFR hợp lý (a1:643 · a2:1181 · b1:2283 · b2:2738 · c1:1253 · c2:2295).

---

## 4. Đề xuất thứ tự xử lý

| #   | Việc                                                      | Ai làm              | Cỡ  |
| --- | --------------------------------------------------------- | ------------------- | --- |
| 1   | F1 — huy hiệu "chưa duyệt chuyên môn" + test canh         | AI                  | nhỏ |
| 2   | F4 — gắn `notForKids` cho vòng sinh tự động               | AI                  | nhỏ |
| 3   | F5 — gộp vòng < 5 từ                                      | AI                  | nhỏ |
| 4   | F8 — thêm lớp vào tiêu đề bài ôn tập Hoá                  | AI                  | nhỏ |
| 5   | F9 — viết lại 20 giải thích cụt (Lí + Hoá)                | AI                  | vừa |
| 6   | F10 — bổ test-case cho 14 bài Lập trình                   | AI                  | vừa |
| 7   | F2 — bổ 6 chương Toán còn trống + ngưỡng số bài tối thiểu | **cần người duyệt** | lớn |
| 8   | F3 — sinh câu mẫu cho 610 vòng từ vựng                    | **cần người duyệt** | lớn |
| 9   | F6/F7 — bù hoạt ảnh môn Lí, chuyên đề HSG Hoá 12          | **cần người duyệt** | lớn |

Việc 1–6 gộp được thành 1–2 PR nhỏ. Việc 7–9 là sinh nội dung mới, phải có đặc tả riêng trước.

---

## 5. Bằng chứng

```
npx vitest run packages/subject-{math,physics,chemistry,biology,english}
  → Test Files 15 passed · Tests 122 passed (122)
npx vitest run packages/subject-programming
  → Test Files 56 passed · Tests 4417 passed (4417) · 32,53s
```

**Đối chiếu `PROGRESS.md`:** F2 (Toán thủng chương) và F7 (Sinh chưa có HSG) đã được ghi sẵn ở
mục "Ưu tiên 2" — lượt audit này xác nhận lại bằng số đo, không phải phát hiện mới. Chín phát
hiện còn lại là mới.

Số liệu nội dung đo bằng script tạm nạp thẳng registry thật
(`MATH_LESSONS` · `PHYSICS_LESSONS` · `CHEM_LESSONS` · `BIOLOGY_LESSONS` ·
`PROGRAMMING_LESSONS` · `FOUNDATION`), chạy bằng `tsx`/`vitest` ngày 2026-09-14. Script để ở
thư mục tạm của phiên, không commit — mọi con số tái lập được bằng cách nạp lại các registry đó.
