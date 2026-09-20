# 0385 — 2026-09-20 — Tăng coverage branch vượt sàn ≥1 điểm (AC-10)

## Việc đã làm

Xử lý nợ kỹ thuật ghi ở `PROGRESS.md` (2026-09-17, S13-2, `docs/changelog/0358-*.md`): coverage
branch chỉ dư 0,83 điểm so với sàn 89 (đo được `94,02 / 89,83 / 94,35 / 94,58`), chưa đạt mức
"≥ 1 điểm" mà AC-10 đòi. Không phải hồi quy của S13-2 — đo cùng lệnh trên `main` cho ra đúng
cùng số, nghĩa là nợ có sẵn từ trước.

Thêm test ca biên cho các hàm/nhánh trước đây hoàn toàn không có test hoặc chỉ phủ một nhánh:

1. **`packages/subject-chemistry/lessons.ts`** — `listChemAdvancedLessons()` và
   `listChemLessonsByChapter()` trước đây **0 test** (chỉ `getChemLesson`/`listChemLessonsByGrade`
   có test). Thêm 4 ca: lọc đúng chương + đúng thứ tự bài, chương không tồn tại trả mảng rỗng,
   không truyền `tier` trả đủ ba cấp đúng thứ tự trường→tỉnh→quốc gia, truyền `tier` chỉ trả đúng
   cấp đó.
2. **`packages/subject-programming/htmlPrelude.ts`** — nhánh branch coverage 63,63% dù statement/
   line đã 97-100%. Thêm 5 ca: thẻ không thuộc tính + không chữ trực tiếp (hai nhánh `? :` đều
   rơi vào phía rỗng), thẻ `<script>` không đi vào bên trong nhưng vẫn giữ chữ trực tiếp của
   chính nó, thẻ `<style>` rỗng, luật CSS rỗng (`.a{}`), khai báo CSS rỗng do dấu `;` thừa cuối.
   Kết quả riêng file: branch 63,63% → 68,18%, statement/line lên 100%.

Không đụng logic sản phẩm — chỉ thêm test cho hành vi đã có sẵn.

## Issue / outcome

Trước: coverage branch dư 0,83 điểm, PR thêm một khối logic mới nhỏ có thể làm cổng CI đỏ bất kỳ
lúc nào. Sau: đo full-suite trên checkout sạch (`rm -rf coverage && npm run test:coverage`):

```
Statements   : 94.09% ( 26520/28183 )
Branches     : 90.01% ( 16175/17969 )   ← dư 1,01 điểm so với sàn 89
Functions    : 94.62% ( 4382/4631 )
Lines        : 94.66% ( 23346/24663 )
```

## Research / spec

Không có đặc tả trước — trả nợ kỹ thuật đã ghi ở `PROGRESS.md`, đúng tinh thần S13-2 (AC-10):
"thêm test cho nhánh chưa phủ, KHÔNG hạ sàn/nới ngưỡng".

## Validation

`npx eslint <2 file test> --max-warnings 0` sạch · `npx vitest run
packages/subject-chemistry/lessons.test.ts packages/subject-programming/htmlPrelude.test.ts` —
29/29 test xanh · `rm -rf packages/*/dist dist dist-server coverage && npm run test:coverage`
(toàn bộ, checkout sạch) — branches 90,01%, dư 1,01 điểm so với sàn 89.

## Rủi ro, rollout và rollback

Rủi ro thấp: chỉ thêm test, không đổi logic sản phẩm nào. Rollback: revert commit.

## Definition of Done

- [x] Coverage branch dư ≥ 1 điểm so với sàn 89 (đo được 1,01 điểm)
- [x] Không hạ sàn, không nới ngưỡng trong `vitest.config.ts`
- [x] Test mới xanh, không phá test cũ
