# Đợt 2 — 56 mục từ rất hiếm nhưng gắn bậc nhập môn — 2026-09-15

Tiếp nối `docs/audit/2026-09-14-thang-bac-cefr-tu-dien.md` (PR #915) — mục nợ để ngỏ số 1.

**Định nghĩa "rất hiếm":** thứ hạng tần suất `freq` ≥ **30 000**. Mốc này lấy từ dữ liệu, không
áp đặt: hiệu chuẩn trên các mục do CHÍNH CEFR-J chấm, p25 của bậc C1 đã là 12 528 và trung vị C2
là 32 175 — tức hạng ≥ 30 000 là vùng của từ C1/C2, không phải vùng A1/A2.

## 1. Hai nguyên nhân gốc, xử lý khác nhau

| Nhóm                                | Số mục | Xử lý                     |
| ----------------------------------- | ------ | ------------------------- |
| Tầng 2 — Words-CEFR-Dataset gắn sai | 45     | **Đã sửa**                |
| Tầng 1 — chính CEFR-J chấm A1/A2    | 10     | **Giữ nguyên, cố ý**      |
| `iii` (chữ số La Mã)                | 1      | Giữ nguyên, ngoài phạm vi |

### 🔴 Nhóm sửa — 45 mục: dataset gán bậc của TỪ GỐC cho dạng PHÁI SINH

Khuôn lỗi rất đều: Words-CEFR-Dataset chấm `tensely` = bậc của `tense` (A1), `coldly` = bậc của
`cold` (A1), `uneasiness` = bậc của `easy`. Dạng phái sinh vừa **hiếm hơn hẳn** vừa **khó hơn về
hình thái**, nên thừa kế thẳng bậc gốc là sai. Ví dụ nặng nhất: `tensely` A1 ở hạng **72 439**.

Tiêu chí gán bậc mới — dải tần suất cho **sàn**, độ trong suốt của phái sinh quyết định **dừng ở
đâu**:

- **B1 (6 mục)** — từ đời sống/chủ đề quen, hạng thấp là đặc tính ngữ liệu chứ không phải độ khó:
  `legging` · `midfielder` · `antibody` · `renewable` · `debug` · `debugger`.
- **B2 (31 mục)** — phái sinh TRONG SUỐT của gốc dễ (người học đoán được nghĩa khi biết gốc):
  15 trạng từ `-ly` (`tensely` · `greedily` · `coldly` · `shyly` · `noticeably` · `joyfully` ·
  `thoughtfully` · `informally` · `usefully` · `meaningfully` · `passively` · `uniformly` ·
  `markedly` · `habitually` · `methodically`), cùng `uneasiness` · `overcrowding` · `remarriage` ·
  `downpour` · `disheartened` · `sheepish` · `illegible` · `saturate` · `designation` ·
  `applicable` · `expenditure` · `insulate` · `implementation` · `wearable` · `midweek` · `vol`.
- **C1 (8 mục)** — thuật ngữ chuyên ngành hoặc đăng ký học thuật/hành chính: `rebar` ·
  `systemic` · `impetus` · `postulate` · `tenancy` · `downsizing` · `skirting` · `rattan`.

Không mục nào đẩy lên C2: các từ này hiếm trong ngữ liệu VIẾT nhưng không phải từ bí hiểm.

### ✅ Nhóm giữ nguyên — 10 mục do chính CEFR-J chấm

`grandparent` A1 · `schoolchild` · `kilogram` · `centimeter` · `metre` · `tablespoon` ·
`motorway` · `headphone` · `footballer` · `superlative` (đều A2).

Đây **không phải lỗi**: CEFR-J chấm theo **chủ đề giáo trình** (gia đình, đơn vị đo, nhà bếp,
giao thông, thể thao) — những từ giáo trình A1/A2 dạy thật, chỉ hiếm trong ngữ liệu báo chí.
Đè bậc của nguồn tin cậy nhất bằng suy đoán tần suất là đi ngược thứ tự ưu tiên nguồn mà
`scripts/tag-cefr-levels.ts` đã chốt. Ghi vào danh sách ngoại lệ có tên, không phải ngưỡng số.

## 2. Cổng chặn tái phát

Thêm vào `packages/subject-english/dictionaryLevels.test.ts`: mọi mục hạng ≥ 30 000 mà gắn A1/A2
phải **khớp đúng danh sách ngoại lệ có tên** `RARE_EASY_ALLOWLIST` (11 mục). Mục mới rơi vào vùng
này sẽ làm CI đỏ, buộc người thêm phải cân nhắc chứ không lọt im lặng.

Đã kiểm cổng cắn thật: trả `tensely` về A1 ⇒ đỏ đúng một khoá `tensely::adv`; đặt lại B2 ⇒ xanh.

## 3. Còn để ngỏ

- `iii` (num, A2, hạng 55 752) — mục "chữ số La Mã", không phải mục từ vựng theo nghĩa thường.
  Thuộc loại **vệ sinh dữ liệu** (có nên tồn tại trong từ điển học không), không phải thang bậc.
- `bit`(n) trỏ `base: "bite"` — liên kết sai từ nguyên, ghi từ đợt trước, vẫn còn.
- Chiều ngược lại (từ rất PHỔ BIẾN mà gắn C1/C2) đã đo: chỉ **1 mục** (`goodbye` interj, hạng 682,
  C2) — nhưng đó là nhãn của chính CEFR-J, cùng loại với nhóm giữ nguyên ở trên.
