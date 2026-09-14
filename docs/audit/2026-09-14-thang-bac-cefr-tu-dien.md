# Rà lại thang bậc CEFR của từ điển — 2026-09-14

**Phạm vi:** 12 168 mục từ trong `apps/dhcb/public/data/dictionary/chunk-*.json`, đối chiếu với
ba nguồn gắn nhãn mà `scripts/tag-cefr-levels.ts` dùng (CEFR-J v1.5 + Octanove C1/C2 → tầng 1;
Words-CEFR-Dataset → tầng 2; AI ước lượng → tầng 3).

**Cách đo:** script tạm nạp thẳng chunk thật + tra lại wordlist thật bằng đúng các hàm production
(`cefrjLookup.lookupCefrLevelWithLemma`, `wordsCefrDataset.lookupWordsCefrLevel`). Mọi con số dưới
đây tái lập được bằng cách chạy lại các hàm đó trên dữ liệu trong repo.

## 1. Bức tranh chung (đo TRƯỚC khi sửa)

| Chỉ số                                   | Giá trị                                                             |
| ---------------------------------------- | ------------------------------------------------------------------- |
| Tổng mục từ                              | 12 168                                                              |
| Thiếu bậc                                | **0**                                                               |
| Phân bố                                  | A1 1 273 · A2 1 559 · B1 2 663 · B2 2 993 · C1 1 305 · C2 2 375     |
| Khớp tầng 1 (CEFR-J/Octanove), 8 973 mục | 8 969 (**100,0 %**) — lệch 4                                        |
| Khớp tầng 2 "confirmed", 1 748 mục       | 1 745 (**99,8 %**) — lệch 3                                         |
| Không nguồn nào phủ (nhãn AI thuần)      | 79 — **toàn bộ là dạng bất quy tắc** (`bitten`, `geese`, `crises`…) |

Tương quan bậc ↔ thứ hạng tần suất đúng chiều, không đảo: rank trung vị A1 1 241 · A2 3 410 ·
B1 6 622 · B2 11 530 · C1 17 649 · C2 21 648.

**Kết luận phần này: nhãn KHÔNG bịa.** 99,9 % mục có nguồn đều khớp nguồn, và 79 nhãn AI thuần
đều đã trùng bậc từ gốc của chúng. Vấn đề thật nằm ở chỗ khác — mục 2.

## 2. 🔴 Phát hiện chính: dạng chia mang bậc riêng, khác hẳn từ gốc

**101 mục biến thể (có trường `base`) lệch bậc so với mục từ gốc.** Nguyên nhân gốc: cả ba tầng
gắn nhãn đều chấm **từng dạng mặt chữ một cách độc lập** — wordlist có dòng riêng cho "saw",
AI được hỏi riêng về "found" — không tầng nào biết chúng là dạng chia của từ đã có bậc.

Hậu quả người học thấy: `see` A1 nhưng `saw` **B2**; `find` A1 nhưng `found` **B2**; `say` A1
nhưng `said` B1; `go` A1 nhưng `went`/`gone`/`goes` A2. Bậc CEFR đo **độ khó của mục từ vựng**,
không đo độ khó của dạng chia — biết `see` thì `saw` không phải từ mới phải học lại.

Chia 101 ca đó làm hai nhóm, **chỉ nhóm A được sửa tự động**:

- **Nhóm A — 49 dạng chia THẬT (đã sửa):** nhận biết bằng hai dấu hiệu cùng lúc — từ gốc tự khai
  dạng đó trong `forms` (`past`/`ving`/`plural`…) **và** mục biến thể cùng từ loại với mục gốc.
  Quy tắc áp: **thừa kế bậc của từ gốc**. Ví dụ `saw` B2→A1 · `found` B2→A1 · `growing` B2→A1 ·
  `removed` C1→B1 · `criteria` C1→B2 · `worse`/`worst` A2→A1.
  **Ngoại lệ có chủ đích, sửa ngược:** cặp `pajama`(C2)/`pajamas`(B2) — CEFR-J ghi thẳng
  "pajamas/pyjamas,noun,**B2**", nên mục SAI là từ gốc; đã hạ `pajama` xuống B2 thay vì kéo
  `pajamas` lên C2. Tổng cộng **49 dòng `level` đổi giá trị**.
- **Nhóm B — 52 ca ĐỂ NGUYÊN (cố ý):** mặt chữ trùng dạng chia nhưng đã **từ vựng hoá**, mang
  nghĩa riêng nên có bậc riêng là đúng: `ground` (mặt đất, n) A1 ≠ `grind` C2 · `rose` (hoa hồng,
  n) A1 ≠ `rise` B1 · `drunk` (say, adj) · `bit` (một chút, n) · `known`/`written`/`hidden` (adj) ·
  `more`/`most`/`less`/`least`. Cùng nhóm này là các ca mục gốc chỉ có ở từ loại khác (`caused`(v)
  so với `cause`(n)) — bậc danh từ và động từ của cùng một từ có thể khác nhau thật, tự động hoá
  ở đây là đoán mò.

### Đánh đổi đã chọn, nói thẳng

Sau khi sửa, **41 mục cố tình lệch với nhãn của wordlist** (tầng 1 còn khớp 99,7 %, tầng 2
99,4 %). Đó là **kết quả mong muốn, không phải hồi quy**: với dạng chia, bất biến "cùng bậc với
từ gốc" được ưu tiên hơn nhãn rời của nguồn. Nguồn vẫn là trọng tài cho **mục từ gốc**.

## 3. Còn để ngỏ (báo cáo, KHÔNG sửa trong đợt này)

- **56 mục rất hiếm nhưng gắn A1/A2** — `tensely` A1 (rank 72 439) · `impetus` A1 · `illegible`
  A1 · `debugger` A2 · `rebar` A2… Truy nguồn: **46/56 đến từ tầng 2** (Words-CEFR-Dataset, trong
  đó 10 là giá trị nội suy "estimated") và **10 đến từ chính CEFR-J** (`kilogram` A2, `headphone`
  A2, `grandparent` A1 — CEFR-J chấm theo chủ đề giáo trình, không theo tần suất). Đây là sai số
  **của nguồn**, sửa thì phải sửa từng từ bằng phán đoán — cần một đợt riêng có tiêu chí rõ, và
  nên ưu tiên nhóm `estimated` trước.
- **7 ca lệch nguồn còn lại của tầng 1/2** (`standing` · `trying` · `theses` · `bases` …): đều là
  từ điển ĐÚNG còn wordlist khớp nhầm từ đồng tự (`standing` danh từ C2 "địa vị"). Không sửa.
- **`bit`(n) trỏ `base: "bite"`** là liên kết SAI về mặt từ nguyên (chữ "bit" nghĩa "một chút"
  không phải dạng chia của "bite"). Nhỏ, thuộc loại vệ sinh dữ liệu `base`, không phải thang bậc.

## 4. Cổng chặn tái phát

`packages/subject-english/dictionaryLevels.test.ts` đọc **chunk thật** và bắt đỏ khi:
(1) có mục thiếu bậc hoặc bậc không hợp lệ; (2) có dạng chia lệch bậc với từ gốc; (3) có mục
`base` trỏ tới từ không tồn tại. Logic thuần ở `packages/subject-english/dictionaryLevels.ts`.

Đã kiểm cổng **cắn thật**, không phải xanh giả: đổi tay `saw` A1 → B2 thì test đỏ đúng một ca
(`saw (v) B2 ≠ see A1`), trả lại A1 thì xanh.
