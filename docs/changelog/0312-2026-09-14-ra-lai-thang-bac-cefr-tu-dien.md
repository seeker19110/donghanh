# 0312 — 2026-09-14 — Rà lại thang bậc CEFR của từ điển: dạng chia thừa kế bậc từ gốc

**PR:** (đợt này) · **Nhánh:** `claude/loving-fermi-soclh1`

## Việc đã làm

Rà toàn bộ **12 168 mục từ** của `apps/dhcb/public/data/dictionary/chunk-*.json` đối chiếu ba
nguồn gắn nhãn thật. Báo cáo đầy đủ: `docs/audit/2026-09-14-thang-bac-cefr-tu-dien.md`.

1. **Đo trước:** nhãn không bịa — khớp CEFR-J/Octanove **100,0 %** (8 969/8 973), khớp tầng 2
   "confirmed" 99,8 %, 0 mục thiếu bậc, tương quan bậc ↔ tần suất đúng chiều.
2. **Phát hiện chính:** **101 dạng biến thể lệch bậc so với từ gốc** — `see` A1 mà `saw` **B2**,
   `find` A1 mà `found` **B2**, `go` A1 mà `went`/`gone` A2. Nguyên nhân: cả ba tầng gắn nhãn
   chấm từng dạng mặt chữ ĐỘC LẬP, không tầng nào biết đó là dạng chia của từ đã có bậc.
3. **Đã sửa 49 dòng `level`** — chỉ nhóm dạng chia THẬT (từ gốc khai dạng đó trong `forms` **và**
   cùng từ loại), theo quy tắc _thừa kế bậc của từ gốc_. Ngoại lệ sửa ngược: `pajama` C2 → B2 vì
   CEFR-J ghi thẳng "pajamas/pyjamas,noun,B2" nên mục sai là từ gốc.
4. **52 ca để nguyên, cố ý:** từ đã từ vựng hoá, có nghĩa riêng nên bậc riêng là đúng — `ground`
   (mặt đất) ≠ `grind`, `rose` (hoa hồng) ≠ `rise`, `drunk`/`known`/`written` (adj), `more`/`most`.
5. **Cổng chặn tái phát:** `packages/subject-english/dictionaryLevels.test.ts` (đọc chunk thật) +
   logic thuần `dictionaryLevels.ts`.

## Quyết định

- **Bất biến mới: dạng chia CÙNG BẬC với từ gốc.** Bậc CEFR đo độ khó của mục từ vựng, không đo
  độ khó của dạng chia — biết `see` thì `saw` không phải từ mới.
- **Đánh đổi nói thẳng:** sau khi sửa, 41 mục cố tình lệch nhãn wordlist (khớp tầng 1 100,0 % →
  99,7 %). Đây là kết quả mong muốn: với dạng chia, bất biến trên thắng nhãn rời của nguồn;
  nguồn vẫn là trọng tài cho mục TỪ GỐC.
- **Không tự sửa nhóm mơ hồ.** 56 mục hiếm-mà-A1/A2 là sai số của chính nguồn (46 từ tầng 2,
  10 từ CEFR-J), sửa phải bằng phán đoán từng từ → tách đợt riêng, ưu tiên nhóm `estimated`.

## Bằng chứng

```
npx vitest run packages/subject-english/   → 6 file · 54 test xanh (có 3 test mới)
Cổng cắn thật: đổi tay saw A1→B2 ⇒ đỏ đúng 1 ca "saw (v) B2 ≠ see A1"; trả lại ⇒ xanh
git diff --stat apps/dhcb/public/data/dictionary → 49 dòng đổi, 49+/49-
Dạng chia lệch bậc: 49 → 0
```
