# 0410 — 2026-09-22 — Trả nốt 3 nợ còn mở của đợt 0409: mốc C1 cho sàn bậc, quét dạng chia theo `forms`, hồ câu mẫu

> PR: (đợt này) · Tiếp `0409`. Chủ dự án yêu cầu "tiếp tục trả nốt 3 nợ còn mở" — ba mục ghi ở
> `PROGRESS.md` mục nợ 1 (audit câu chữ 0406/0408/0409).

## Việc đã làm

**Nợ (1) — sàn bậc theo tần suất mới áp tới B2, chưa xét lên C1.** Đo lại phân bố hạng trên
12 153 mục (trung vị: B1 6 498 · B2 12 675 · C1 17 853 · C2 21 652) rồi thêm mốc thứ ba vào
`UNSOURCED_LEVEL_FLOORS` (`packages/subject-english/dictionaryLevels.ts`): **hạng ≥ 30 000 → sàn
C1** — mốc trùng `RARE_RANK_FLOOR` ("rất hiếm" thì bậc thấp nhất hợp lý là C1) và vượt cả trung
vị C2. Áp bằng `scripts/archive/relevel-unsourced-easy-words.ts`: **128 mục B2 → C1**
(`urbanization` 73 622 · `viscosity` 39 974 · `judiciary` 34 016 · `debugger` 52 281…), lan tiếp
1 dạng chia (`criteria` theo `criterion`). Hai ngoại lệ CÓ TÊN thêm vào
`UNSOURCED_EASY_ALLOWLIST`: `app::n` (chính hội thoại của dự án dùng 50 lần) và `downloads::n`
(cùng gốc với `download` v, A2 — chỉ khác từ loại).

**Nợ (2) — dạng chia còn đứng như từ riêng trong vòng.** 0409 nối tay 12 mục, nợ ghi là "cần
quét theo `forms` của từ gốc". Thêm **bất biến thứ tư** `findUnlinkedInflections`: mục KHÔNG khai
`base` nhưng là dạng chia do một từ gốc khác tự khai trong `forms`, cùng từ loại. Quét ra **42
mục**, trong đó **30 mục nối `base`** (so sánh/so sánh nhất `bigger`/`biggest`/`latest`/`farther`…,
quá khứ `died`/`lied`/`sucked`/`sued`, số nhiều trong suốt `ads`/`alumni`/`parameters`/`stats`) —
người học không còn phải học "bigger" như từ mới sau khi đã học "big". **12 mục còn lại đứng
riêng là ĐÚNG** vì đã từ vựng hoá, liệt kê thành danh sách CÓ TÊN `LEXICALIZED_FORM_ALLOWLIST`
kèm lý do từng mục (`premises` = mặt bằng ≠ `premise` = tiền đề · `terms` · `sales` · `stairs` ·
`trousers` · `guts` · `nerves` · `lyrics` · `norms` · `provisions` · `facilities` · `utilities`).
Cổng: `dictionaryLevels.test.ts` so kết quả quét với đúng danh sách đó. Bản đầu của hàm quét đôi
n×n làm test **quá 5 giây và đỏ vì timeout** — viết lại bằng chỉ mục "dạng chia đã khai → từ
gốc", cổng chạy 605 ms.

**Nợ (3) — 40 câu mẫu mồ côi bị bỏ khi sinh lại vòng.** Nguyên nhân gốc: `reassign-circle-sentences.ts`
**bỏ thẳng** câu không gán được, nên 40 câu viết tay đúng và dùng được bị mất chỉ vì lúc ấy không
vòng nào cần. Sửa cả cơ chế lẫn dữ liệu:

- Thêm trường `pool` vào `cefrCircleSentences.json` (khai trong schema Zod ở
  `cefrCircleSentences.ts`, giao diện KHÔNG đọc): câu chưa gán được **về hồ** thay vì bị bỏ, và
  lần sinh lại vòng sau script **lấy hồ ra dùng trước**.
- **Cứu lại 40 câu đã mất** bằng cách đọc lại từ commit 604d9f5 (trước đợt 0409) và nạp vào hồ.
- Sinh lại vòng theo đúng 5 bước (`docs/audit/2026-09-15-sinh-lai-vong-theo-thang-bac.md` §2):
  **673 → 671 vòng**, 11 893 → 11 864 từ (30 dạng chia rời vòng). Reassign **gán lại 95 câu** (có
  câu lấy từ hồ), **58 câu giữ trong hồ** (0 câu bị bỏ), còn **11 vòng thiếu → viết tay 12 câu**
  (A2 1 · B2 3 · C1 5 · C2 2). Vẫn **0 vòng thiếu câu mẫu**.

## Quyết định

- Mốc sàn là NGƯỠNG SỐ có lý do đo được, ngoại lệ là DANH SÁCH CÓ TÊN — giữ đúng luật 0313 cho cả
  bất biến thứ ba (`UNSOURCED_EASY_ALLOWLIST`) và bất biến thứ tư (`LEXICALIZED_FORM_ALLOWLIST`).
- Câu mẫu viết tay **không bao giờ bị bỏ nữa**. Hồ `pool` là nợ CÓ KIỂM SOÁT: 58 câu đang chờ,
  lần sinh lại vòng nào cũng được đem ra thử lại trước khi phải viết tay câu mới.

## Bằng chứng kiểm chứng

- `npm run typecheck` ✅ · `npm run lint` ✅ (0 cảnh báo) · `npm run format` ✅ · `npm run build` ✅
- `npm test` ✅ 711 file / 16 661 test (lượt đầu 1 đỏ: `cefrOutline.test.ts` đếm unit — B2 45 → 44,
  C1 32 → 33 do 128 mục lên C1; đã cập nhật số kèm giải trình tại chỗ, không sửa test cho vừa).
- Hai mốc chống lùi được hạ KÈM GIẢI TRÌNH: `MIN_CIRCLES_WITH_SENTENCES` 673 → 671 (tổng vòng
  giảm 2, không phải mất câu mẫu).
- Quét lại sau khi áp: `findUnlinkedInflections` còn đúng 12 mục allowlist ·
  `findUnsourcedEasyOutliers` còn đúng 2 mục allowlist.

## Nợ còn lại (mục nợ 1 của `PROGRESS.md` sau đợt này)

- 58 câu mẫu trong `pool` chưa gán được vòng nào (giữ lại, không mất).
- Nội dung học chưa có người có chuyên môn sư phạm đọc lại — phần "dễ hiểu / đúng sư phạm" vẫn
  ngoài tầm mọi cổng máy.
