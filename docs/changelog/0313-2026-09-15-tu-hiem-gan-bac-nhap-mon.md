# 0313 — 2026-09-15 — 45 từ rất hiếm thoát khỏi bậc nhập môn (đợt 2 của rà thang bậc)

**PR:** (đợt này) · **Nhánh:** `claude/loving-fermi-soclh1` · Tiếp nối `0312-*.md` (PR #915)

## Việc đã làm

Trả nợ mục số 1 của đợt rà thang bậc: **56 mục hạng tần suất ≥ 30 000 nhưng gắn A1/A2**.
Báo cáo: `docs/audit/2026-09-15-tu-hiem-gan-bac-nhap-mon.md`.

1. **Truy nguyên, tách làm hai nhóm có nguyên nhân khác hẳn nhau** — 45 mục do Words-CEFR-Dataset
   gán cho dạng PHÁI SINH đúng bậc của từ GỐC (`tense` A1 → `tensely` A1, dù `tensely` hạng
   72 439); 10 mục do chính CEFR-J chấm A1/A2 theo chủ đề giáo trình (`grandparent`, `kilogram`,
   `tablespoon`…); 1 mục `iii` là chữ số La Mã.
2. **Sửa 45 mục** — B1 (6): từ đời sống quen thuộc · B2 (31): phái sinh trong suốt, gồm 15 trạng
   từ `-ly` · C1 (8): thuật ngữ chuyên ngành/học thuật. Không mục nào lên C2.
3. **Giữ nguyên 10 mục CEFR-J, cố ý** — đè nguồn tin cậy nhất bằng suy đoán tần suất là đi ngược
   thứ tự ưu tiên nguồn đã chốt trong `scripts/tag-cefr-levels.ts`.
4. **Cổng chặn tái phát** — `findRareEasyOutliers` + `RARE_EASY_ALLOWLIST` (danh sách ngoại lệ CÓ
   TÊN, không phải ngưỡng số) trong `packages/subject-english/dictionaryLevels.test.ts`.

## Quyết định

- **Mốc "rất hiếm" = hạng ≥ 30 000 lấy từ dữ liệu, không áp đặt:** hiệu chuẩn trên các mục do
  chính CEFR-J chấm, p25 của C1 đã là 12 528 và trung vị C2 là 32 175.
- **Tần suất cho SÀN, hình thái quyết định DỪNG Ở ĐÂU.** Xếp bậc thuần theo tần suất sẽ đẩy
  `coldly`/`thoughtfully` lên C2 — vô lý với từ mà người học đoán được nghĩa ngay khi biết gốc.
- **Ngoại lệ ghi bằng TÊN, không bằng số.** Ngưỡng đếm cho phép mục sai mới lọt vào chỗ mục cũ;
  danh sách có tên bắt mọi mục mới phải được xem xét.

## Bằng chứng

```
npx vitest run packages/subject-english/  → 6 file · 55 test xanh (thêm 1 test mới)
Cổng cắn thật: trả tensely về A1 ⇒ đỏ đúng khoá "tensely::adv"; đặt lại B2 ⇒ xanh
git diff --stat apps/dhcb/public/data/dictionary → 45 dòng đổi (45+/45−)
Mục hạng ≥ 30 000 ở bậc A1/A2: 56 → 11 (10 CEFR-J giữ cố ý + iii)
Dạng chia lệch bậc (bất biến PR #915): vẫn 0
```
