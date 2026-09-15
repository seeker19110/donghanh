# Đợt 4 — sinh lại vòng từ vựng theo thang bậc đã sửa (phương án b) — 2026-09-15

Khép hẳn chuỗi rà thang bậc: PR #915 · #916 · #917 · đợt này. Người dùng chốt **phương án (b)**
trong ba phương án nêu ở `docs/audit/2026-09-15-ve-sinh-du-lieu-tu-dien.md` mục 4.

**Vấn đề còn lại sau PR #917:** 43 từ đã mang bậc ĐÚNG nhưng vẫn nằm trong vòng của bậc CŨ —
`impetus` (C1) vẫn thuộc `cefr-a1-noun-16`, nên người học A1 vẫn gặp nó.

**Kết quả:** **0 từ còn nằm trong vòng sai bậc** (đo trên `curriculum.json` — thứ app thật sự đọc).

## 1. Ước lượng ban đầu SAI — nói thẳng

Khi đề xuất phương án (b) tôi ước "phạm vi hẹp, khoảng 8 vòng". **Đo thật thì lớn hơn nhiều:**
123 vòng đổi thành phần, 328 từ đổi vòng. Ước lượng đó dựa trên số từ phải chuyển (43), không
phải trên cách generator chia lại vòng — nó gom lại toàn bộ theo chủ đề và cắt 20 từ/vòng, nên
một từ rời đi làm xê dịch dây chuyền các vòng phía sau.

Con số thật của đợt này:

| Chỉ số                    | Trước  | Sau    |
| ------------------------- | ------ | ------ |
| Vòng A1–B2 (sinh tự động) | 359    | 357    |
| Vòng C1–C2 (sinh tự động) | 229    | 230    |
| Tổng vòng toàn lộ trình   | 677    | 676    |
| Từ trong lộ trình         | 11 907 | 11 908 |

## 2. Bẫy đã tránh: 8 từ C1 suýt biến mất khỏi lộ trình

`gen-a1b2-extra-vocab.ts` chỉ dựng vòng **A1–B2**. Tám từ tôi nâng lên C1 ở PR #916
(`impetus` · `tenancy` · `skirting` · `rattan` · `rebar` · `systemic` · `downsizing` ·
`postulate`) vì thế **rơi khỏi kết quả** của nó. Nếu chỉ chạy generator đó rồi dừng, tám từ này
biến mất khỏi lộ trình hoàn toàn — không cổng nào báo, vì "vòng ít từ hơn" không vi phạm gì.

Cả hai generator đều khử trùng bằng cách đọc `curriculum.json` và **bỏ qua tiền tố của chính
mình**. Nên thứ tự chạy là một phần của lời giải, không phải chi tiết vặt:

```
1. npx tsx scripts/archive/gen-a1b2-extra-vocab.ts   # dựng lại A1–B2, 8 từ C1 rơi ra
2. npx tsx scripts/archive/gen-curriculum-json.ts    # curriculum.json KHÔNG còn chứa 8 từ đó
3. npx tsx scripts/archive/gen-cefr-c1c2-vocab.ts    # nhờ (2), C1 mới nhận được 8 từ
4. npx tsx scripts/archive/gen-curriculum-json.ts    # chốt lại
5. npx tsx scripts/archive/gen-learn-json.ts         # public/data/cefr.json (units/vocabCircleIds)
```

Chạy (3) trước (2) thì 8 từ vẫn bị coi là "đã có ở vòng nền tảng" và bị loại — im lặng.

Bước (5) là bẫy thứ hai: `public/data/cefr.json` giữ danh sách `vocabCircleIds` của từng Phần.
Quên sinh lại thì nó còn trỏ tới `cefr-a1-noun-17` đã bị gộp — test thứ tự lộ trình
(`curriculum.test.ts`) bắt được, và đó là cổng duy nhất bắt được bước này.

## 3. Hệ quả dây chuyền: 13 vòng phải viết lại câu mẫu

Câu mẫu (F3) gắn với **thành phần vòng**: mỗi câu phải dùng ≥ 1 từ của chính vòng đó, và bộ câu
phải phủ ≥ 3 từ phân biệt. Vòng đổi thành phần ⇒ câu cũ có thể không còn dùng từ nào của vòng.

Đo bằng chính `matchedCircleWords` của dự án: **13 vòng hỏng** (không phải 123 — phần lớn vòng
đổi thành phần vẫn giữ được câu vì câu vốn bám các từ phổ biến ở đầu vòng). Đã xử lý:

- **16 câu viết lại** cho 11 vòng (`cefr-a2-thinking-1` · `cefr-a2-noun-30` — mất cả 3 câu ·
  `cefr-a2-noun-31` · `cefr-b2-noun-59` · `cefr-c2-noun-61` · `cefr-b2-modifier-33..38`).
- **6 câu mới** cho 2 vòng mới sinh: `cefr-b2-modifier-39` · `cefr-c1-noun-34`.
- **3 khoá mồ côi xoá** (`cefr-a1-modifier-9` · `cefr-a1-noun-17` · `cefr-a2-modifier-15` — các
  vòng bị gộp sau khi từ rời đi).

Viết tay, theo đúng 10 bất biến của đặc tả câu mẫu (khung độ dài theo bậc · ≤ 4 từ của vòng mỗi
câu · phủ ≥ 3 từ · song ngữ đúng ngôn ngữ · không trùng câu trên toàn bộ kho).

## 4. Một mốc ratchet phải hạ — giải trình

`MIN_CIRCLES_WITH_SENTENCES` ghi rõ "chỉ được TĂNG", nay **677 → 676**. Lý do KHÔNG phải mất câu
mẫu mà là **tổng số vòng giảm đúng 1** (gộp 3, thêm 2). Để mốc này không còn là thứ có thể hạ cho
vừa, bất biến được đổi sang kiểm điều **mạnh hơn một con số đếm**: _mọi_ vòng phải có câu mẫu
(số vòng thiếu câu = 0). Ngưỡng đếm đơn thuần có thể xanh trong khi một vòng mới bị bỏ quên.

## 5. Ảnh hưởng người học (đã cảnh báo trước khi làm)

328 từ đổi vòng ⇒ tiến độ theo vòng của những vòng đó bị xê dịch: người đang học dở một vòng có
thể thấy danh sách từ khác đi. Đây là cái giá đã nêu khi đề xuất phương án (b) và người dùng
chấp nhận. Không từ nào biến mất khỏi lộ trình (11 907 → 11 908).
