# 0312 — 2026-09-14 — Gỡ 10 mục "từ vựng" không phải từ tiếng Anh + cổng canh từ điển

**PR:** #914 · **Nhánh:** `claude/zen-hawking-4ck67u`
**Nguồn gốc:** phát hiện phụ khi làm câu mẫu A2–C2 (`docs/changelog/0311-*.md`), người dùng yêu
cầu sửa ngay.

## Việc đã làm

Bắt đầu từ MỘT vòng (`cefr-b2-noun-63`), nhưng khi truy nguồn thì đây là **khuôn lỗi hệ thống**,
không phải ca lẻ.

### Truy nguồn: rác ở TỪ ĐIỂN, không phải ở vòng

Các vòng `cefr-*` **sinh tự động** từ từ điển (`scripts/archive/gen-a1b2-extra-vocab.ts` đọc
`apps/dhcb/public/data/dictionary/chunk-*.json`, lọc theo `level`). Nên **sửa tay trong vòng sẽ bị
ghi đè** ở lần sinh lại kế tiếp — phải gỡ ở từ điển thì mới đứng.

### 10 mục đã gỡ

**8 mảnh của tên riêng** — tự lời giải nghĩa đã thừa nhận không phải từ tiếng Anh:

| từ        | nghĩa ghi trong từ điển                            | bậc | hiện ở vòng       |
| --------- | -------------------------------------------------- | --- | ----------------- |
| `des`     | thường thấy trong tên địa danh (ví dụ Des Moines)  | A1  | `cefr-a1-noun-13` |
| `york`    | York (tên địa danh)                                | A1  | `cefr-a1-noun-2`  |
| `angeles` | thường thấy trong tên thành phố Los Angeles        | A2  | `cefr-a2-noun-7`  |
| `las`     | thường thấy trong tên địa danh (ví dụ Las Vegas)   | A2  | `cefr-a2-noun-10` |
| `costa`   | thường thấy trong tên riêng (ví dụ Costa Rica)     | A2  | `cefr-a2-noun-23` |
| `kong`    | thường thấy trong tên 'Hong Kong'                  | B1  | `cefr-b1-noun-6`  |
| `hong`    | thường thấy trong tên 'Hong Kong'                  | B1  | `cefr-b1-noun-8`  |
| `los`     | thường thấy trong tên địa danh (ví dụ Los Angeles) | B2  | `cefr-b2-noun-63` |

Đáng ngại nhất: **`des` và `york` nằm ở bậc A1** — bài học đầu tiên của người mới.

**2 mục còn lại**, đều ở `cefr-b2-noun-63`:

- `netsurfer` — biến thể chính tả **trùng** với `net surfer` đã có trong cùng vòng (giữ `net surfer`).
- `ios` — tên hệ điều hành, viết thường, không phải từ vựng để học.

### Chốt chặn

Test mới `apps/dhcb/src/data/vocabQuality.test.ts` (3 bất biến, chặn CI) đặt ở **đúng tầng sinh ra
lỗi là từ điển**, nên sinh lại vòng cũng không mang rác về:

- `KHONG_CO_MANH_TEN_RIENG` — bắt theo **lời giải nghĩa** (`/thường thấy trong tên|tên địa danh|
một phần của tên|viết tắt của tên/`) chứ không theo danh sách từ, nên mục rác **kiểu mới** cũng bị
  chặn.
- `KHONG_MANG_LAI_MUC_DA_GO` — danh sách 10 mục đã gỡ, không được quay lại.
- `CO_DU_LIEU` — canh chính hai test trên không âm thầm xanh vì đọc hụt từ điển.

## Bằng chứng kiểm chứng

```
Chứng kiến ĐỎ trước (git stash phần sửa từ điển rồi chạy test mới):
  × KHONG_CO_MANH_TEN_RIENG   → liệt kê đúng 8 mục, gồm des/los
  × KHONG_MANG_LAI_MUC_DA_GO  → liệt kê 10 mục
Sau khi sửa: 3/3 xanh.

npm run typecheck      → exit 0 (đã rm -rf packages/*/dist dist dist-server trước)
npm run lint           → exit 0, 0 cảnh báo
npm run format         → sạch
npm run build          → exit 0
npm run test:coverage  → 598 file / 12 418 test XANH (trước đợt: 597 / 12 415)
npm run budget         → Initial JS 126,04/140 kB · CSS 18,11/20 kB · coverage đều trên sàn
npx tsx scripts/archive/gen-curriculum-json.ts → 677 vòng, 11 907 từ (trước: 11 917 — đúng 10 từ)

Đo lại độc lập:
  từ rác còn sót trên TOÀN BỘ lộ trình: 0
  cefr-b2-noun-63: 20 → 17 từ
  các vòng còn lại bị chạm: 20 → 19 từ (7 vòng)
  đếm lại từ THỰC TẾ: a1 643→641 · a2 1181→1178 · b1 2283→2281 · b2 2738→2735 (tổng đúng 10)
```

## Hai điều đáng ghi về CÁCH làm

1. **Diff suýt thành không-review-được.** Lần ghi đầu dùng `JSON.stringify(data, null, 2)` làm
   **toàn bộ** 7 file bị viết lại (33 000 dòng thay đổi thuần định dạng, lẫn mất 10 dòng dữ liệu
   thật). Đây đúng cái bẫy mà `scripts/lib/writeJson.ts` đã ghi lại từ audit 2026-08-12. Làm lại
   bằng chính helper đó (và gọi `format()` **trực tiếp** cho `public/data/` — thư mục này bị
   `.prettierignore` loại trừ nên CLI Prettier bỏ qua): diff còn **228 dòng xoá + 4 dòng sửa**.
2. **Không sinh lại toàn bộ vòng.** Chạy lại `gen-a1b2-extra-vocab.ts` sẽ dồn lại từ giữa 359 vòng
   → diff khổng lồ **và** có thể làm câu mẫu vừa viết ở đợt 0311 không còn khớp từ của vòng. Nên gỡ
   **có phẫu thuật** khỏi file sinh, để vòng bị chạm còn 19 (hoặc 17) từ. Đã kiểm trước: không câu
   mẫu nào gãy (mọi vòng vẫn còn ≥ 1 từ khớp mỗi câu và phủ ≥ 3 từ phân biệt).

Hai câu mẫu vốn được viết chỉ để "ăn" từ rác thì viết lại cho sạch:

- `cefr-a2-noun-7`: "…the tour of Los Angeles begins" → "We need permission before the guided tour begins."
- `cefr-a2-noun-10`: "…reached the shore near Las Vegas" → "By noon, the hunter had reached the rocky shore."

## Phát hiện phụ, KHÔNG sửa trong đợt này

`cefr-b2-noun-63` vẫn còn `scholasticism` (chủ nghĩa kinh viện), `mutability` (tính khả biến) và
`RNA` gắn nhãn **B2**. Chúng là từ tiếng Anh **thật** nên không phải lỗi dữ liệu như 10 mục trên —
vấn đề là **gắn sai bậc** (đúng ra C1/C2). Sửa việc này là đánh giá lại thang bậc của cả từ điển,
cần một đợt riêng có tiêu chí rõ ràng, không nên làm lẻ tẻ theo từng vòng.
