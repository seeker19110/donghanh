# 0315 — 2026-09-15 — Vệ sinh dữ liệu từ điển + đồng bộ vòng từ vựng với thang bậc đã sửa

**PR:** (đợt này) · **Nhánh:** `claude/loving-fermi-soclh1` · Khép chuỗi `0312` (#915) · `0313` (#916)

## Việc đã làm

Báo cáo: `docs/audit/2026-09-15-ve-sinh-du-lieu-tu-dien.md`.

1. **🔴 Phát hiện ngoài dự kiến — hai đợt sửa trước CHƯA tới người học.** Vòng từ vựng `cefr-*`
   **chép** bậc từ từ điển vào JSON chứ không đọc lại lúc chạy, nên 43 từ vẫn được dạy ở bậc cũ:
   người học bậc A1 vẫn gặp `impetus`, `tensely`. Đã đồng bộ 43 bậc + **sinh lại
   `apps/dhcb/public/data/curriculum.json`** (file app thật sự đọc).
2. **Bốn liên kết `base` sai từ nguyên** (quét ra thêm 3 ca ngoài `bit` đã biết): `bit`(n)←bite ·
   `ground`(n)←grind · `rose`(n)←rise · `left`(adj)←leave. Đã bỏ trường `base`. Giữ nguyên
   `shot`(n)←shoot và `thought`(n)←think vì đó là danh từ phái sinh THẬT.
3. **Xoá mục `iii`** (chữ số La Mã duy nhất trong 41 mục `num`) khỏi từ điển và khỏi vòng
   `cefr-a2-noun-29`; gỡ ngoại lệ `iii::num` khỏi `RARE_EASY_ALLOWLIST`.
4. **Cổng mới** `apps/dhcb/src/data/vocabLevelSync.test.ts`: bậc trong vòng phải khớp từ điển, và
   mọi từ trong vòng phải còn tồn tại trong từ điển. Thêm `iii` vào danh sách `DA_GO` của
   `vocabQuality.test.ts` (cổng do PR #914 dựng) thay vì lập cơ chế song song.

## Quyết định

- **Cổng của PR #916 tự bắt lỗi của đợt này**: xoá `iii` khỏi từ điển làm danh sách ngoại lệ
  không còn khớp → CI đỏ cho tới khi gỡ tên. Đúng ý đồ "ngoại lệ ghi bằng TÊN".
- **Không tự chuyển từ sang vòng khác.** Đồng bộ bậc là an toàn; đổi thành phần vòng thì đổi khoá
  tiến độ của người đang học — **cần người dùng quyết**, ba phương án nêu ở mục 4 của báo cáo
  (đề xuất: sinh lại vòng cho các bậc bị ảnh hưởng).
- **Giữ 2 liên kết `base` đúng** thay vì quét sạch cả nhóm 38 ca khác từ loại — phần lớn nhóm đó
  (`chosen`, `hidden`, `frozen`…) là liên kết đúng và có ích.

## Bằng chứng

```
npm run test:coverage → 600 file · 12 424 test xanh (thêm 2 test mới)
Cổng mới cắn thật: hạ tensely trong vòng về A1 ⇒ đỏ đúng dòng "vòng A1 ≠ từ điển B2"
git diff: từ điển 4 file (bỏ 4 base + xoá 1 mục) · vòng 43 bậc đồng bộ + 1 từ bị bỏ
Tổng mục từ điển: 12 158 → 12 157 (xoá đúng 1 mục "iii")
```
