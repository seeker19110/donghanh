# Đợt 3 — vệ sinh dữ liệu từ điển + đồng bộ vòng từ vựng — 2026-09-15

Khép lại chuỗi rà thang bậc: `docs/audit/2026-09-14-thang-bac-cefr-tu-dien.md` (PR #915) ·
`docs/audit/2026-09-15-tu-hiem-gan-bac-nhap-mon.md` (PR #916) · đợt này.

Hai việc được giao là hai mục nợ nhỏ. Khi làm, phát hiện thêm **một lỗi nghiêm trọng hơn cả
hai**: hai đợt sửa trước **chưa tới được người học**.

## 1. 🔴 Phát hiện ngoài dự kiến: sửa từ điển nhưng vòng từ vựng giữ bậc cũ

Các vòng `cefr-*` (677 vòng, 11 906 từ) được **sinh ra TỪ** từ điển, nhưng bậc được **chép** vào
`apps/dhcb/src/data/cefrA1B2ExtraVocab.json` / `cefrC1C2Vocab.json` chứ không đọc lại lúc chạy.
PR #915 và #916 sửa từ điển mà không đụng bản chép ⇒ **43 từ vẫn được DẠY ở bậc cũ**:

| Vòng                   | Từ vẫn mang bậc cũ                                                       |
| ---------------------- | ------------------------------------------------------------------------ |
| `cefr-a1-noun-16`      | `impetus` · `tenancy` · `skirting` · `rattan` · `uneasiness` · `midweek` |
| `cefr-a1-modifier-8/9` | `tensely` · `shyly` · `coldly` · `illegible` · `sheepish`                |
| `cefr-a2-noun-29`      | `downsizing` · `expenditure` · `implementation` · `debugger` …           |
| `cefr-c2-noun-26`      | `pajama` (C2 cũ, từ điển đã hạ B2 ở PR #915)                             |

Nghĩa là người học bậc **A1 vẫn gặp `impetus` và `tensely`** — đúng cái mà PR #916 tưởng đã chữa.
Không cổng nào bắt được: cổng của PR #915/#916 chỉ soi từ điển, cổng câu mẫu chỉ soi câu.

**Đã đồng bộ 43 bậc** trong hai file vòng, rồi **sinh lại `apps/dhcb/public/data/curriculum.json`**
(`npx tsx scripts/archive/gen-curriculum-json.ts`) — đây mới là file app THẬT SỰ đọc; quên bước
này là sửa xong mà người học vẫn thấy dữ liệu cũ (đúng bẫy `PUBLIC_JSON_DONG_BO` đã ghi sẵn
trong `cefrCircleSentences.test.ts`).

## 2. Hai việc vệ sinh được giao

### 2.1. Bốn liên kết `base` sai từ nguyên (không chỉ `bit`)

`bit`(n) trỏ `base: "bite"` là ca đã biết. Quét toàn bộ tìm thêm **3 ca cùng loại** — mặt chữ
trùng một dạng chia, nhưng **nghĩa không liên quan**, nên liên kết khẳng định sai:

| Mục         | Nghĩa       | `base` sai | Vì sao sai             |
| ----------- | ----------- | ---------- | ---------------------- |
| `bit`(n)    | chút/một ít | `bite`     | không phải "cắn"       |
| `ground`(n) | mặt đất     | `grind`    | không phải "đã nghiền" |
| `rose`(n)   | hoa hồng    | `rise`     | không phải "đã tăng"   |
| `left`(adj) | bên trái    | `leave`    | không phải "đã rời đi" |

Đã **bỏ trường `base`** ở 4 mục này. Hai ca trông giống nhưng **GIỮ NGUYÊN** vì liên kết đúng và
có ích cho người học: `shot`(n) ← shoot, `thought`(n) ← think — danh từ phái sinh thật của động từ.

### 2.2. Mục `iii` (chữ số La Mã)

`iii` (num, A2, hạng 55 752, "số ba") là **chữ số La Mã duy nhất** trong từ điển; 40 mục `num`
còn lại đều là từ viết chữ (`three`, `twelve`…). Nó không phải mục từ vựng mà là ký hiệu đánh số.

Cách xử lý theo đúng tiền lệ PR #914 (gỡ 10 mục không phải từ tiếng Anh, cùng ngày): gỡ ở TỪ
ĐIỂN — nguồn sinh ra mọi vòng — rồi gỡ phẫu thuật khỏi file vòng, không chạy lại generator.

**Đã xoá** khỏi từ điển **và** khỏi vòng `cefr-a2-noun-29` (vòng còn 19 từ, vẫn trên sàn 5 từ; bộ
câu mẫu của vòng không dùng từ này nên không phải viết lại câu nào). Ngoại lệ `iii::num` trong
`RARE_EASY_ALLOWLIST` cũng gỡ theo — cổng của PR #916 **tự bắt** đúng việc này khi chạy lại. Tên
`iii` được thêm vào danh sách `DA_GO` của `vocabQuality.test.ts` (cổng PR #914 đã dựng cho đúng
lớp lỗi này) để nó không quay lại, thay vì lập một cơ chế song song.

Tổng mục từ điển: **12 158 → 12 157**.

## 3. Cổng chặn tái phát

`apps/dhcb/src/data/vocabLevelSync.test.ts` — bậc của từ trong vòng phải **khớp bậc của chính từ
đó trong từ điển**, và mọi từ trong vòng phải **còn tồn tại** trong từ điển. Đây là cổng lẽ ra
phải có từ PR #915; thiếu nó nên hai đợt sửa trước không tới được người học.

Đã kiểm cắn thật: hạ `tensely` trong vòng về A1 ⇒ đỏ đúng một dòng
`cefr-a1-modifier-9 · tensely (adv): vòng A1 ≠ từ điển B2`.

## 4. CẦN NGƯỜI DÙNG QUYẾT — không tự làm

43 từ nay mang bậc đúng **nhưng vẫn nằm trong vòng của bậc cũ**: `impetus` (C1) vẫn thuộc vòng
`cefr-a1-noun-16`. Đồng bộ bậc là an toàn; **chuyển từ sang vòng khác thì không** — nó đổi thành
phần vòng, tức đổi khoá tiến độ của người đang học và đổi cỡ vòng.

Ba lựa chọn, tôi đề xuất (b):

- **(a) Giữ nguyên** — vòng A1 có vài từ gắn nhãn B2/C1. Trung thực nhưng khó hiểu với người học.
- **(b) Sinh lại vòng cho các bậc bị ảnh hưởng** bằng `scripts/archive/gen-a1b2-extra-vocab.ts`,
  chấp nhận tiến độ của một số vòng bị đặt lại — phạm vi hẹp (khoảng 8 vòng), sạch về sau.
- **(c) Chuyển tay 43 từ** sang vòng đúng bậc, giữ id vòng cũ — ít xáo trộn nhất nhưng cỡ vòng
  lệch và phải tự tay cân lại.
