# Đặc tả — Sinh CÂU MẪU cho các vòng từ vựng sinh tự động của môn Anh

**Ngày:** 2026-09-14 · **Trạng thái:** chờ người dùng duyệt (chưa "Approved for implementation")
**Nguồn gốc:** phát hiện **F3** trong `docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md`
**Slug file này (dùng cho cổng `metadata` của PR thi hành):** `docs/specs/2026-09-14-cau-mau-cho-vong-tu-vung-cefr.md`

> ⚠️ **ĐÍNH CHÍNH SỐ LIỆU SO VỚI BÁO CÁO AUDIT — đo lại bằng lệnh thật (xem §0.2).**
> Audit ghi "610/699 vòng". Con số THẬT trên nhánh `claude/pensive-mccarthy-x1naux` hôm nay là
> **588/677 vòng** (588 vòng `cefr-*` sinh tự động, 89 vòng thủ công). Bản chất phát hiện không
> đổi (**86,9 %** lộ trình mất câu mẫu, và vẫn là **0** vòng sinh tự động có câu mẫu), nhưng mọi
> con số trong đặc tả này dùng **588/677**. Tên file đã đổi bỏ chữ "610" để không mang con số sai.

---

## 0. Một câu

Sinh **một lần, ngoại tuyến, bằng script chạy tay** các câu mẫu song ngữ cho **588 vòng từ vựng
`cefr-*`** của môn Anh (mỗi câu phải dùng từ CỦA CHÍNH vòng đó), commit kết quả thành dữ liệu
tĩnh, và khoá lại bằng test bất biến chặn CI — để 86,9 % lộ trình từ vựng giữ đúng lời hứa sư
phạm ghi ở đầu `apps/dhcb/src/data/curriculum.ts`.

## 0.1. Bối cảnh sư phạm (vì sao đáng làm)

Triết lý gốc, nguyên văn `apps/dhcb/src/data/curriculum.ts` dòng 1–10:

> "Mỗi vòng (circle) gom ~20 từ cùng chủ đề, kèm vài CÂU THÔNG DỤNG dùng chính những từ trong
> vòng đó (để học từ xong là ráp được câu ngay)."

Người học hết 89 vòng nền tảng (A1–B2 thủ công) là **mất hẳn** phần ráp câu ở phần còn lại của
lộ trình. Câu ví dụ lẻ của từng từ (`DictEntry.ex_en`/`ex_vi`) **không thay thế được**: nó chỉ
minh hoạ MỘT từ, trong khi câu mẫu của vòng dạy cách **ráp nhiều từ vừa học vào cùng một câu**.

## 0.2. ĐO THẬT (lệnh + kết quả, không lấy lại từ audit)

```bash
cd /home/user/donghanh && node -e "
const fs=require('fs');
const d=require('./apps/dhcb/public/data/curriculum.json');
const arr=Array.isArray(d)?d:d.circles;
const cefr=arr.filter(c=>c.id.startsWith('cefr-'));
const man =arr.filter(c=>!c.id.startsWith('cefr-'));
const has=c=>Array.isArray(c.sentences)&&c.sentences.length>0;
console.log('tổng vòng      :',arr.length);
console.log('thủ công       :',man.length,'— có câu mẫu:',man.filter(has).length);
console.log('sinh tự động   :',cefr.length,'— có câu mẫu:',cefr.filter(has).length);
"
```

Kết quả thật (2026-09-14):

```
tổng vòng      : 677
thủ công       : 89 — có câu mẫu: 89
sinh tự động   : 588 — có câu mẫu: 0
```

Đếm từ nguồn `.json` trong `src/data/` cho cùng con số: `cefrC1C2Vocab.json` 229 vòng +
`cefrA1B2ExtraVocab.json` 359 vòng = **588**; `curriculum.ts` có **89** khối vòng thủ công,
**89/89** có `sentences` không rỗng.

**Phân bố 588 vòng theo bậc CEFR** (dùng để chia đợt ở §②bis):

| Bậc   | Số vòng | Số mục từ  | Nguồn                       |
| ----- | ------- | ---------- | --------------------------- |
| A1    | 34      | 643        | `cefrA1B2ExtraVocab.json`   |
| A2    | 65      | 1 181      | `cefrA1B2ExtraVocab.json`   |
| B1    | 120     | 2 283      | `cefrA1B2ExtraVocab.json`   |
| B2    | 140     | 2 738      | `cefrA1B2ExtraVocab.json`   |
| C1    | 82      | 1 253      | `cefrC1C2Vocab.json`        |
| C2    | 147     | 2 295      | `cefrC1C2Vocab.json`        |
| **Σ** | **588** | **10 393** | trung bình **17,7 từ/vòng** |

Kích thước hiện tại `apps/dhcb/public/data/curriculum.json`: **3,13 MB**.

## 0.3. BA ĐIỀU PHẢI CHỐT TRƯỚC KHI THI HÀNH (không tự quyết thay người dùng)

| #      | Câu hỏi                                                                    | Đề xuất của tôi                                                                                                     |
| ------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Q1** | Sinh **ngoại tuyến một lần** (script tay → JSON tĩnh commit) hay lúc chạy? | **Ngoại tuyến, tĩnh.** Lý do + ước tính chi phí ở §0.4. Sinh lúc chạy bị loại thẳng.                                |
| **Q2** | **N câu/vòng** là bao nhiêu?                                               | **N = 3** (sàn cứng), trần 5. Đúng bằng nhịp của 89 vòng thủ công đang chạy — xem §0.5.                             |
| **Q3** | Có bắt buộc **người duyệt chuyên môn** trước khi bật ra cho người học?     | **Có, nhưng nhẹ hơn môn Sinh**: sàng AI hai vòng + người duyệt theo lô mẫu, KHÔNG dựng `reviewStatus` mới — xem §⑦. |

Ba điều này chạm nội dung dạy người thật và chạm chi phí API, nên **tôi không tự chốt**.

## 0.4. Quyết định kỹ thuật: SINH NGOẠI TUYẾN, TĨNH (trả lời Q1)

**Chọn: script chạy tay `scripts/gen-cefr-circle-sentences.ts` → ghi ra file dữ liệu tĩnh
`apps/dhcb/src/data/cefrCircleSentences.json` → commit vào repo.**

Vì sao **không** sinh lúc chạy:

1. Nội dung này **cố định** — cùng một vòng, ai học cũng thấy cùng câu. Trả tiền API mỗi lượt
   xem cho một nội dung bất biến là đốt tiền vô nghĩa (`CLAUDE.md` §7: "ưu tiên giải pháp miễn
   phí / chi phí thấp").
2. Sinh lúc chạy thì **không kiểm được chất lượng** — không cổng CI nào soi được câu chưa tồn
   tại. Toàn bộ §⑤ của đặc tả này sẽ không thi hành được.
3. App **chạy ngoại tuyến**: `apps/dhcb/src/lib/dataPrecache.ts` tải trước mọi JSON trong
   `public/data/` theo `manifest.json`. Nội dung sinh lúc chạy không precache được.
4. Cùng đúng khuôn đã dùng cho chính hai file này (`scripts/archive/gen-cefr-c1c2-vocab.ts`,
   `gen-a1b2-extra-vocab.ts`): "KHÔNG sửa file .json bằng tay — chạy lại script sinh".

**Ước tính chi phí thô (một lần, cho cả 588 vòng):**

- Vào: mỗi lời gọi gửi 1 vòng (≈ 17,7 từ + nghĩa Việt) ≈ **600–900 token**; gom **4 vòng/lời
  gọi** để giảm overhead → ≈ **3 000 token vào/lời gọi** × 147 lời gọi ≈ **0,45 M token vào**.
- Ra: 4 vòng × 3 câu song ngữ ≈ **700 token/lời gọi** → ≈ **0,10 M token ra**.
- Với một model rẻ hạng "mini/flash" (~0,15 $/M vào, ~0,60 $/M ra): **≈ 0,13 $** một lượt chạy.
  Kể cả chạy lại 5–10 lượt trong lúc chỉnh prompt và sàng lại: **dưới 2 $ tổng**.
- Với model hạng trung (~3 $/M vào, ~15 $/M ra) nếu cần chất lượng cao hơn: **≈ 2,9 $/lượt**.

> Con số trên là **ước tính thô theo token đếm được**, KHÔNG phải báo giá — bảng giá thật phải
> tra lúc thi hành. Bên thi hành phải in **token thật đã dùng** ở cuối script và dán vào PR.

## 0.5. Vì sao N = 3 (trả lời Q2)

89 vòng thủ công đang chạy dùng **3 câu/vòng** (kiểm mẫu: `letters`, `numbers`, vòng kinh tế
cuối file đều đúng 3). Chọn N = 3 nghĩa là **giữ nguyên nhịp người học đã quen**, không tạo hai
trải nghiệm khác nhau giữa phần thủ công và phần sinh tự động. 3 câu cũng vừa đủ để mỗi câu
"ăn" được 2–3 từ của vòng mà không biến màn "Xong bộ từ này!" (`CefrLessonViews.tsx:545`) thành
bức tường chữ trên màn hình điện thoại.

---

## ① Phạm vi

**LÀM:**

- Thêm script sinh **chạy tay** `scripts/gen-cefr-circle-sentences.ts` (+ npm script
  `gen:circle-sentences`), gọi AI theo lô, có **cờ `--level=<a1|a2|b1|b2|c1|c2>`** để chia đợt
  và **cờ `--dry-run`** in thống kê mà không gọi AI.
- Thêm file dữ liệu tĩnh `apps/dhcb/src/data/cefrCircleSentences.json` — **bản đồ
  `circleId → { en, vi }[]`**, commit vào repo.
- Thêm wrapper typed `apps/dhcb/src/data/cefrCircleSentences.ts` (đúng khuôn hai wrapper
  `cefrC1C2Vocab.ts` / `cefrA1B2ExtraVocab.ts` đang có).
- **Nối câu mẫu vào vòng ở đúng MỘT chỗ**: `apps/dhcb/src/data/curriculum.ts`, khi dựng
  `FOUNDATION` (ghép `sentences` cho vòng `cefr-*` từ bản đồ trên).
- Thêm bộ **test bất biến chặn CI** `apps/dhcb/src/data/cefrCircleSentences.test.ts` (§⑤) —
  đây là phần quan trọng nhất của đợt này.
- Thêm **bộ kiểm chất lượng chạy trong chính script** (`--verify`): script tự loại câu không đạt
  và **thoát mã 1** nếu sau khi loại còn vòng nào < N câu.
- Sinh lại `apps/dhcb/public/data/curriculum.json` bằng
  `npx tsx scripts/archive/gen-curriculum-json.ts` và commit (đây là file app THẬT SỰ đọc lúc
  chạy, qua `curriculumLoader.ts`).
- Ghi quy trình duyệt chuyên môn nhẹ (§⑦) vào `docs/review/tieng-anh/README.md`.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- ❌ **KHÔNG đụng 89 vòng thủ công** trong `apps/dhcb/src/data/curriculum.ts` (khối
  `FOUNDATION_BASE`). Chúng đã 89/89 có câu mẫu do người viết; sửa chúng là rủi ro thuần tuý,
  không đổi lấy được gì. Test §⑤ canh đúng điều này bằng **golden hash**.
- ❌ **KHÔNG đổi schema `Circle` theo cách nào khác** — `sentences: { en: string; vi: string }[]`
  ở `apps/dhcb/src/data/curriculumTypes.ts` giữ NGUYÊN hình dạng và tên trường. Lý do: 6 nơi
  giao diện + 4 nơi test đã đọc đúng tên đó (§②). Đổi nó là breaking change chạm cả UI.
- ❌ **KHÔNG đụng F4** (cờ `notForKids` không phủ vòng `cefr-*`) — là **đợt khác**, dù đợt đó
  sửa đúng hai file này. Trộn vào đây thì không ai review nổi diff.
- ❌ **KHÔNG đụng F5** — đợt khác.
- ❌ **KHÔNG sửa tay `cefrCircleSentences.json`** sau khi sinh (trừ thao tác XOÁ câu bị người
  duyệt loại — xem §⑦). Sửa nội dung thì sửa prompt rồi chạy lại script.
- ❌ **KHÔNG gọi AI lúc chạy** cho nội dung này, ở bất kỳ hoàn cảnh nào (§0.4).
- ❌ **KHÔNG sinh lại `cefrC1C2Vocab.json` / `cefrA1B2ExtraVocab.json`** — đợt này chỉ THÊM một
  file phụ; hai file từ vựng giữ nguyên byte-for-byte (test §⑤ canh).
- ❌ **KHÔNG dựng enum `reviewStatus` cho môn Anh** — đó là kiến trúc của môn STEM
  (`docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md`); §⑦ giải thích vì sao ở đây
  dùng cách nhẹ hơn.

## ② Điểm chạm

| Việc           | Đường dẫn file                                    | Ghi chú                                                                                        |
| -------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Thêm           | `scripts/gen-cefr-circle-sentences.ts`            | Script sinh chạy tay, có `--level` / `--dry-run` / `--verify`                                  |
| Thêm           | `apps/dhcb/src/data/cefrCircleSentences.json`     | Dữ liệu tĩnh `circleId → câu[]`. Lớn dần theo từng đợt                                         |
| Thêm           | `apps/dhcb/src/data/cefrCircleSentences.ts`       | Wrapper typed, đúng khuôn `cefrC1C2Vocab.ts`                                                   |
| Thêm           | `apps/dhcb/src/data/cefrCircleSentences.test.ts`  | **Test bất biến chặn CI** — §⑤                                                                 |
| Thêm           | `scripts/lib/sentenceQuality.ts` (+ `.test.ts`)   | Hàm kiểm chất lượng DÙNG CHUNG cho script và test (không chép hai bản)                         |
| Sửa            | `apps/dhcb/src/data/curriculum.ts`                | **Chỉ** phần ghép `FOUNDATION` ở cuối file (~4 dòng). Khối `FOUNDATION_BASE` KHÔNG đụng        |
| Sửa (sinh lại) | `apps/dhcb/public/data/curriculum.json`           | Chạy `npx tsx scripts/archive/gen-curriculum-json.ts`; **KHÔNG sửa tay**                       |
| Sửa            | `package.json`                                    | Thêm `"gen:circle-sentences": "tsx scripts/gen-cefr-circle-sentences.ts"`                      |
| Thêm           | `docs/review/tieng-anh/README.md`                 | Phiếu duyệt theo lô — §⑦                                                                       |
| Thêm           | `docs/changelog/NNNN-2026-..-..-*.md`             | Bắt buộc theo `CLAUDE.md` §3; số kế tiếp lấy bằng `npm run changelog`                          |
| **KHÔNG sửa**  | `apps/dhcb/src/data/curriculumTypes.ts`           | Kiểu `Circle.sentences` giữ nguyên — cả UI lẫn test đang đọc                                   |
| **KHÔNG sửa**  | `apps/dhcb/src/data/cefrC1C2Vocab.{ts,json}`      | Giữ nguyên byte-for-byte                                                                       |
| **KHÔNG sửa**  | `apps/dhcb/src/data/cefrA1B2ExtraVocab.{ts,json}` | Giữ nguyên byte-for-byte                                                                       |
| **KHÔNG sửa**  | `apps/dhcb/src/components/CefrLessonViews.tsx`    | Dòng 545–551 đã hiển thị `circle.sentences` sẵn — dữ liệu vào là nó tự hiện, không phải sửa gì |
| **KHÔNG sửa**  | `apps/dhcb/src/lib/curriculum.ts:177`             | Vòng `extra-*` (từ CHƯA gắn nhãn CEFR) cố ý giữ `sentences: []` — ngoài phạm vi đợt này        |

**Ảnh hưởng lan ra (codemap ĐÃ CHẠY THẬT 2026-09-14, sau `npm ci`):**

```
$ npm run codemap -- impact apps/dhcb/src/data/curriculum.ts
47 file bị ảnh hưởng khi sửa "apps/dhcb/src/data/curriculum.ts"
  · curriculumLoader.ts · lib/curriculum.ts · lib/cefrProgress.ts · pages/core/Home.tsx
  · lib/stats.ts · pages/subjects/english/EnglishHome.tsx · components/RoadmapTab.tsx
  ·· CefrExam.tsx · ActivityCalendarCard.tsx · lib/weeklyGoal.ts · App.tsx · scripts/seed-all.test.ts
  ··· main.tsx · Dictionary.tsx · StudyTabs.tsx · ExamPlan.tsx · Chat.tsx · Writing.tsx
  ··· Speaking.tsx · SRSReview.tsx · AppThemeProvider.tsx (+ các file test kèm theo)
```

**Đọc ra điều gì:** `curriculum.ts` là điểm nóng — 47 file phụ thuộc, chạm tới cả ba chế độ học
(Chat/Writing/Speaking), SRS, thống kê và kế hoạch thi. Đây chính là lý do đặc tả này chọn
**KHÔNG đổi schema và KHÔNG sửa hai file từ vựng**, chỉ thêm một file bản đồ ghép vào đúng một
chỗ: bề mặt rủi ro giữ ở mức nhỏ nhất có thể.

Grep thật (`grep -rn "from '.*data/curriculum'" --include=*.ts*`) — nơi đọc `Circle`/`sentences`:

- Hiển thị câu mẫu: `apps/dhcb/src/components/CefrLessonViews.tsx:545` (màn "Xong bộ từ này!"),
  `apps/dhcb/src/components/studyTabs/TodayLesson.tsx:97,168` (tab hôm nay — hiện đang dựng câu
  từ `ex_en` của từng từ, KHÔNG đọc `circle.sentences`; đợt này không đổi nó).
- Đọc kiểu `Circle`: `lib/curriculum.ts`, `lib/stats.ts`, `lib/cefrProgress.ts`,
  `components/RoadmapTab.tsx`, `pages/subjects/english/CefrLevelPage.tsx`,
  `pages/subjects/english/EnglishHome.tsx`, `pages/core/Home.tsx`.
- Test đang đọc: `lib/curriculum.test.ts`, `lib/cefrProgress.test.ts`, `lib/stats.test.ts`
  (hai file sau dựng `Circle` giả với `sentences: []` → vẫn hợp lệ, không gãy).
- Luồng dữ liệu lúc chạy: `data/curriculumLoader.ts` `fetch('/data/curriculum.json')` → nên
  **quên sinh lại `curriculum.json` = người dùng KHÔNG thấy gì cả** dù test xanh. Đây là cái bẫy
  số một của đợt này; §⑤ có test canh đúng nó.
- `scripts/gen-data-manifest.mjs` chạy trong `npm run build` → `manifest.json` tự cập nhật hash,
  không phải làm gì tay.

**Ngân sách dung lượng:** 588 vòng × 3 câu song ngữ × ≈ 120 byte ≈ **+0,21 MB** trên nền
`curriculum.json` 3,13 MB (**+6,7 %**). Bên thi hành phải chạy `npm run budget` và dán kết quả.

## ②bis. Chia đợt (588 vòng KHÔNG vào một PR)

Một PR thêm ~1 764 câu do AI sinh thì không ai đọc hết để review → duyệt sẽ thành đóng dấu. Chia
**theo bậc CEFR**, mỗi bậc một PR, theo **đúng thứ tự người học gặp**:

| Đợt   | Bậc | Vòng | Câu sinh ra | Mốc hoàn thành                                                                   |
| ----- | --- | ---- | ----------- | -------------------------------------------------------------------------------- |
| **0** | —   | 0    | 0           | **Hạ tầng**: script + wrapper + test §⑤ + **A1 làm mẫu**. Không bật bậc nào khác |
| 1     | A1  | 34   | 102         | (nằm trong đợt 0)                                                                |
| 2     | A2  | 65   | 195         | Rút kinh nghiệm prompt từ đợt 0                                                  |
| 3     | B1  | 120  | 360         |                                                                                  |
| 4     | B2  | 140  | 420         |                                                                                  |
| 5     | C1  | 82   | 246         |                                                                                  |
| 6     | C2  | 147  | 441         | Xong: 588/588, test `PHAI_DU_CAU_MAU` chuyển sang chế độ "toàn bộ"               |

**Đợt 0 là cổng quyết định**: làm xong A1 (34 vòng), người dùng đọc mẫu, nếu chất lượng không
đạt thì dừng ở đây — mất 34 vòng chứ không mất 588.

Trong lúc chưa xong hết, test §⑤ chỉ ép các bậc **đã tuyên bố xong** (danh sách hằng số
`LEVELS_DONE` trong file test), để bậc chưa làm không làm đỏ CI.

## ③ Hợp đồng dữ liệu

**Vào (script đọc):**

```ts
// từ apps/dhcb/src/data/cefr{C1C2,A1B2Extra}Vocab.json — KHÔNG đụng, chỉ đọc
interface Circle {
  id: string // 'cefr-b1-health_med-3'
  titleVi: string
  titleEn: string
  emoji: string
  words: DictEntry[] // ≈ 17,7 mục, mỗi mục có word/pos/vi/ex_en/ex_vi
  sentences: [] // hiện luôn rỗng — đây chính là thứ đợt này lấp
}
```

**Ra (file tĩnh mới `apps/dhcb/src/data/cefrCircleSentences.json`):**

```ts
interface CircleSentencesFile {
  /** Phiên bản prompt đã sinh ra dữ liệu này — đổi prompt thì tăng số. */
  promptVersion: number
  /** Model đã dùng + ngày sinh, để truy vết. */
  generatedWith: { model: string; date: string }
  /** Các bậc đã hoàn tất — test đọc đúng trường này (xem §②bis). */
  levelsDone: ('a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2')[]
  /** circleId → đúng 3–5 câu. */
  sentences: Record<string, { en: string; vi: string }[]>
}
```

**Ca lỗi (là một phần hợp đồng, không phải phụ lục):**

| Tình huống                                               | Hành vi bắt buộc                                                                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| AI trả câu không dùng từ nào của vòng                    | Script **loại câu đó**, ghi log `SKIP <circleId>: no target word`, gọi lại lô tối đa 2 lần                            |
| Sau 3 lần gọi vẫn < 3 câu đạt cho một vòng               | Script **thoát mã 1**, in danh sách circleId hỏng. KHÔNG ghi file dở dang                                             |
| AI trả JSON sai hình                                     | Parse bằng **Zod**, hỏng thì coi như lô lỗi và gọi lại; 3 lần vẫn hỏng → thoát mã 1                                   |
| Câu trùng với câu của vòng khác (kể cả 89 vòng thủ công) | Loại câu đó (so khớp sau khi chuẩn hoá: lower + bỏ dấu câu)                                                           |
| Thiếu key AI trong `.env`                                | Thoát mã 1 với thông báo tiếng Việt nói rõ biến môi trường nào thiếu. KHÔNG im lặng ghi file rỗng                     |
| Chạy lại script với `--level` đã có dữ liệu              | **Lũy đẳng**: ghi đè đúng các vòng của bậc đó, không đụng bậc khác, không đổi thứ tự key (sort theo circleId khi ghi) |
| Vòng có < 3 từ dùng được                                 | Không tồn tại trên dữ liệu hiện tại (min đang là 16 từ), nhưng script vẫn phải báo lỗi rõ thay vì sinh câu nhồi nhét  |

## ④ Tiêu chí chấp nhận

> Viết TRƯỚC phần giải pháp, theo luật số 1 của khuôn đặc tả.

- [ ] **Độ phủ.** Mọi vòng thuộc bậc trong `levelsDone` đều có **≥ 3** và **≤ 5** câu.
      Lệnh: `npx vitest run apps/dhcb/src/data/cefrCircleSentences.test.ts`
- [ ] **Câu dùng từ của chính vòng đó.** Mỗi câu chứa **≥ 1** từ (so khớp theo gốc từ, không
      phân biệt hoa thường, ranh giới từ) trong `words` của vòng. Cùng lệnh trên.
- [ ] **Mỗi vòng dạy được ≥ 3 từ khác nhau.** Hợp của các từ mà 3 câu "ăn" được phải có **≥ 3**
      từ phân biệt của vòng — chặn kiểu "3 câu cùng lặp mỗi một từ". Cùng lệnh trên.
- [ ] **Song ngữ đầy đủ.** Mọi câu có cả `en` và `vi` không rỗng; `vi` **phải chứa ký tự tiếng
      Việt có dấu** (chặn AI trả tiếng Anh vào ô dịch). Cùng lệnh trên.
- [ ] **Độ dài theo bậc CEFR** (đếm từ của phần `en`), sàn/trần cứng theo bảng ngay dưới mục
      này. Cùng lệnh trên.

- [ ] **Không trùng câu.** Chuẩn hoá (lower, bỏ dấu câu, gộp khoảng trắng) rồi so: không câu nào
      trùng trong toàn bộ 677 vòng — **kể cả trùng với 89 vòng thủ công**. Cùng lệnh trên.
- [ ] **89 vòng thủ công nguyên vẹn.** Golden hash của `FOUNDATION_BASE` không đổi. Cùng lệnh trên.
- [ ] **Hai file từ vựng nguyên vẹn.** `git diff --stat` KHÔNG có `cefrC1C2Vocab.json` /
      `cefrA1B2ExtraVocab.json`. Lệnh: `git diff --name-only origin/main...HEAD`
- [ ] **Dữ liệu đến được người học.** `apps/dhcb/public/data/curriculum.json` đã sinh lại, và
      với mỗi bậc trong `levelsDone`, mọi vòng `cefr-*` trong file đó có `sentences.length ≥ 3`.
      **Đây là tiêu chí dễ quên nhất** — test §⑤ `PUBLIC_JSON_DONG_BO` canh nó.
- [ ] **Script lũy đẳng.** Chạy `npm run gen:circle-sentences -- --level=a1` hai lần liên tiếp
      → lần hai `git diff` của file JSON **rỗng** (khi cùng `promptVersion`, dùng cache lời gọi).
- [ ] **Cổng dự án xanh** (không có ngoại lệ nào cho đợt này).

**Bảng sàn/trần độ dài câu theo bậc** (thuộc tiêu chí "Độ dài theo bậc CEFR" ở trên):

| Bậc     | Số từ tối thiểu | Số từ tối đa |
| ------- | --------------- | ------------ |
| A1      | 3               | 10           |
| A2      | 4               | 12           |
| B1      | 5               | 16           |
| B2      | 6               | 20           |
| C1 · C2 | 6               | 24           |

Lý do: A1 mà 20 từ/câu thì người học mới không đọc nổi; C2 mà 5 từ/câu thì không thể hiện được
từ vựng trừu tượng của bậc đó.

**Lệnh chứng minh:**

```bash
npm ci
npm run typecheck && npm run lint && npm run test:coverage && npm run build
npx vitest run apps/dhcb/src/data/cefrCircleSentences.test.ts
npm run codemap -- impact apps/dhcb/src/data/curriculum.ts     # dán kết quả vào PR
npm run budget                                                  # ngân sách sau khi curriculum.json to thêm
# đo lại độ phủ bằng chính lệnh ở §0.2 — số "có câu mẫu" phải tăng đúng bằng số vòng của các bậc đã làm
```

## ⑤ Bất biến không được phá — **PHẦN QUAN TRỌNG NHẤT**

Toàn bộ đặt ở **`apps/dhcb/src/data/cefrCircleSentences.test.ts`** (chạy trong `npm test` →
job `unit` → job tổng hợp `quality` → required check của `main`, nên **chặn CI thật**). Hàm kiểm
dùng chung để script và test **không lệch nhau**: `scripts/lib/sentenceQuality.ts`.

| #   | Bất biến                                                                                                                                     | Tên test canh nó            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | Mọi vòng của bậc trong `levelsDone` có 3–5 câu                                                                                               | `PHAI_DU_CAU_MAU`           |
| 2   | Mỗi câu chứa ≥ 1 từ của chính vòng đó                                                                                                        | `CAU_PHAI_DUNG_TU_CUA_VONG` |
| 3   | 3 câu phủ được ≥ 3 từ phân biệt của vòng                                                                                                     | `PHU_DU_TU`                 |
| 4   | `vi` không rỗng và có dấu tiếng Việt; `en` không chứa ký tự tiếng Việt                                                                       | `SONG_NGU_DUNG_NGON_NGU`    |
| 5   | Độ dài câu nằm trong khung theo bậc (bảng §④)                                                                                                | `DO_DAI_THEO_BAC`           |
| 6   | Không câu nào trùng nhau trên **toàn bộ 677 vòng**                                                                                           | `KHONG_TRUNG_CAU`           |
| 7   | **89 vòng thủ công bất biến** — golden hash của `FOUNDATION_BASE` (id + words + sentences)                                                   | `KHONG_DUNG_VONG_THU_CONG`  |
| 8   | **`public/data/curriculum.json` đồng bộ với nguồn** — với mọi bậc đã xong, số vòng có câu mẫu trong file public **bằng** số vòng trong nguồn | `PUBLIC_JSON_DONG_BO`       |
| 9   | Không vòng `cefr-*` nào **mất** câu mẫu so với lần commit trước (số vòng có câu mẫu chỉ tăng)                                                | `KHONG_LUI_DO_PHU`          |
| 10  | File JSON parse được bằng **Zod schema** đúng hình `CircleSentencesFile`                                                                     | `HINH_DANG_FILE`            |

Bất biến **#7** và **#8** là hai cái không có thì đợt này vô nghĩa: #7 chặn "sửa nhầm phần đang
tốt", #8 chặn "test xanh mà người dùng không thấy gì" (bẫy đã ghi ở §②).

Bất biến **#9** chống lùi: nó đọc số vòng có câu mẫu tối thiểu từ một hằng số trong chính file
test, và hằng số đó chỉ được **tăng**, không bao giờ giảm.

> Theo `CLAUDE.md` §11.1 luật 2: test này nằm trong job `unit`, không được tạo job CI mới.
> Theo `docs/templates/dac-ta-tinh-nang.md`: **viết test #7, #8, #10 TRƯỚC khi sinh câu nào**
> (chúng chạy được ngay trên dữ liệu hiện tại — #7, #8 phải XANH, #1 phải xanh-rỗng vì
> `levelsDone` còn rỗng).

## ⑥ Quy ước dự án liên quan (bên thi hành KHÔNG thấy hội thoại này)

- **TypeScript `strict`, không `any`.** JSON thô phải qua **Zod** (`CLAUDE.md` §4.1) — cả trong
  script (khi parse phản hồi AI) lẫn trong wrapper `.ts`.
- **Import xuyên gói** dùng `@dhcb/<gói>/<file>` **không đuôi `.js`**; import nội bộ gói dùng
  đường tương đối **có đuôi `.js`**. Ở đây mọi thứ nằm trong `apps/dhcb` và `scripts/` nên là
  import tương đối — theo đúng kiểu các file `data/*.ts` hàng xóm.
- **`packages/` không import `apps/`** (ESLint chặn). `scripts/` thì được (các script sinh sẵn
  có đã import `../../apps/dhcb/src/types.ts`).
- **Key AI chỉ từ `.env`**, không bao giờ vào code (`CLAUDE.md` §7).
- **Tiêu đề PR + mô tả phải khớp cổng `metadata`** (~4 giây, đỏ là không vào được `main`):
  regex `^(feat|fix|refactor|docs|test|chore|style|perf|build|ci|revert)(\([a-z0-9._/-]+\))?!?: .+`
  (**scope chữ thường**: `feat(english)` đạt, `feat(cefrVocab)` trượt), mô tả đủ **6 tiêu đề**
  `## Tóm tắt` · `## Issue / outcome` · `## Research / spec` · `## Validation` ·
  `## Rủi ro, rollout và rollback` · `## Definition of Done`, và vì là `feat(` nên **phải** dẫn
  `docs/specs/2026-09-14-cau-mau-cho-vong-tu-vung-cefr.md` + cụm "Approved for implementation".
- **Tạo PR ở trạng thái READY** (không nháp), bật auto-merge squash ngay trong vài giây.
- **Mỗi PR = một file mới trong `docs/changelog/`** (`npm run changelog` in số kế tiếp), KHÔNG
  chồng mục vào `PROGRESS.md`.
- **Cổng CI thật là `npm run test:coverage`**, không phải `npm test`. Trước lần push cuối:
  `rm -rf packages/*/dist dist dist-server && npm run typecheck` để tái hiện checkout sạch.
- **Comment tiếng Việt** ở chỗ quan trọng; nội dung hiển thị cho người học theo **hai chiều
  A/B** (`isA`) — nhưng đợt này KHÔNG thêm chuỗi giao diện mới, `CefrLessonViews.tsx` đã có sẵn
  cả hai chiều.
- Prompt gửi AI của script này nằm **trong chính script** (`scripts/`), **không** đặt vào
  `apps/dhcb/src/prompts/` — nên nó **không** kích hoạt cổng `eval:tutor` / golden snapshot
  (`CLAUDE.md` §8). Bên thi hành phải nói rõ điều này trong mô tả PR để người review không chờ
  bảng eval.

## ⑦ Quy trình duyệt chuyên môn (trả lời Q3 — đề xuất)

Tham chiếu: `docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md`.

**Vì sao KHÔNG bê nguyên kiến trúc `reviewStatus` của môn STEM sang đây:** rủi ro khác hẳn. Một
câu tiếng Anh sai ngữ pháp thì người học vẫn học được từ, và lỗi lộ ra ngay khi đọc; một bài
Sinh sai kiến thức thì người học **tin nhầm** và không có cách nào biết. Dựng thêm bảng Postgres

- màn `/admin` + `review:sync` cho 1 764 câu là chi phí không tương xứng.

**Đề xuất — ba lớp, nhẹ dần:**

1. **Lớp máy (bắt buộc, tự động):** 10 bất biến ở §⑤. Đây là lớp duy nhất **không ai bỏ qua được**.
2. **Lớp AI sàng vòng 2 (bắt buộc, trong script):** sau khi sinh, gọi AI **lần hai với vai người
   chấm**, hỏi đúng 3 câu cho mỗi câu sinh ra: (a) câu tiếng Anh có tự nhiên với người bản ngữ
   không; (b) bản dịch Việt có đúng nghĩa không; (c) có phù hợp bậc CEFR đã ghi không. Câu nào
   bị chấm "không" thì **loại**, sinh bù. Điểm mấu chốt: **AI chấm KHÔNG được là AI vừa sinh
   ra câu đó trong cùng lời gọi** — phải là lượt gọi riêng, không mang theo ngữ cảnh sinh.
3. **Lớp người (bắt buộc trước khi bật bậc đó):** mỗi đợt, người duyệt đọc **mẫu ngẫu nhiên 10 %**
   số vòng của bậc (A1: 4 vòng; C2: 15 vòng) — script `--sample=10` in ra đúng mẫu đó dưới dạng
   markdown dán thẳng vào mô tả PR. **Ngưỡng chấp nhận: ≥ 90 % câu trong mẫu đạt.** Dưới ngưỡng
   → sửa prompt, `promptVersion + 1`, sinh lại cả bậc. Kết quả ghi vào
   `docs/review/tieng-anh/README.md` (một dòng/đợt: ngày · bậc · cỡ mẫu · số đạt · người duyệt).

**Không dùng trường `reviewStatus`** cho môn Anh trong đợt này. Nếu sau này cần, `promptVersion`

- `generatedWith` trong file JSON đã đủ để truy vết "câu này sinh ra lúc nào, bằng gì".

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật (dán output, **không** viết "chạy ok"):
- Kết quả `npm run codemap -- impact` cho từng file đã sửa (đặc tả đã chạy sẵn cho `curriculum.ts` ở ô ②):
- Token + chi phí THẬT script đã dùng (so với ước tính §0.4):
- Mẫu 10 % đã duyệt: bậc nào · cỡ mẫu · số câu đạt · ai duyệt:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không (đặc biệt: có lỡ đụng F4/F5 hay 89 vòng thủ công không):
- Còn để ngỏ:
