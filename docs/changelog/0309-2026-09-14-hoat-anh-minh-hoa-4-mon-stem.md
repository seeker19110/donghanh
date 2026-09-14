# 0309 — 2026-09-14 — Hoạt ảnh minh hoạ 4 môn STEM: 62 → 224 bài (F6)

**PR:** (điền khi tạo) · **Nhánh:** `claude/sleepy-franklin-iv2o1o`
**Đặc tả:** `docs/specs/2026-09-14-hoat-anh-minh-hoa-stem.md` (Approved for implementation)
**Nguồn gốc:** phát hiện **F6** của `docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md`

## Người dùng chốt gì (2026-09-14)

| #   | Câu hỏi của đặc tả  | Chốt                                                                      |
| --- | ------------------- | ------------------------------------------------------------------------- |
| 1   | Mục tiêu phủ        | **70% cho cả 4 môn** (cao hơn đề xuất Lí 60 · Hoá 40 · Sinh 40 · Toán 50) |
| 2   | Ai duyệt chuyên môn | Vào ở `reviewStatus: 'draft'`, không dựng luồng duyệt riêng               |
| 3   | Ratchet cứng        | **Có** — ngưỡng phủ chặn CI, chỉ tăng không giảm                          |
| 4   | Tách đợt 0          | **Không** — làm đợt 0 → 4 một mạch                                        |

## Kết quả đo được

| Môn      | core    | trước          | sau             | mốc 70% |
| -------- | ------- | -------------- | --------------- | ------- |
| Vật lí   | 85      | 14 (16,5%)     | **72 (84,7%)**  | ✅      |
| Hoá học  | 72      | 15 (20,8%)     | **55 (76,4%)**  | ✅      |
| Sinh học | 84      | 15 (17,9%)     | **63 (75,0%)**  | ✅      |
| Toán     | 47      | 18 (38,3%)     | **34 (72,3%)**  | ✅      |
| **Σ**    | **288** | **62 (21,5%)** | **224 (77,8%)** | ✅      |

**+162 hoạt ảnh**, tất cả nhánh `core`; nhánh HSG (`advanced`) không đụng.

## Việc đã làm

**Đợt 0 — cổng ĐO dựng trước nội dung.** `packages/core-contracts/animationQuality.ts`: 4 bất
biến chất lượng dùng chung 4 môn — mô tả ≥ 80 ký tự (Zod chỉ ép 20, đủ chép lại tiêu đề chứ
không đủ thay hình động), mô tả không được chép tiêu đề, `loop: true` không `captions` thì mô tả
≥ 160 ký tự, và phải có ít nhất một `keyframes` (chặn hình TĨNH đội lốt hoạt ảnh). Kèm hàm đo độ
phủ chỉ tính nhánh `core`. Test thử bằng **dữ liệu giả**, mỗi luật một ca cố tình sai — vì dữ
liệu thật đang sạch nên test chạy trên dữ liệu thật không chứng minh được nó có răng (đúng bẫy
`TRAPS.md` mục 4). Hằng số `TOI_THIEU_PHU_HOAT_ANH` đặt trong `lessons.test.ts` của từng môn.

**Đợt 1–4 — nội dung**, chia 5 luồng song song theo gói (Lí 12 · Lí 10–11 · Hoá · Sinh · Toán).
Mỗi luồng chỉ THÊM khoá `animation` + comment tiếng Việt, không chạm `hook`/`theory`/
`workedExample`/`checkQuestions`/`srsCards`/`review*`.

## Quyết định đáng ghi

**Không vẽ cho đủ số.** 5 luồng cộng lại **cố ý bỏ qua 52 bài**: 11 bài ôn tập chương Hoá (đặc
tả cấm thẳng), 14 bài "Thực hành" Sinh chỉ là thao tác dụng cụ, 8 bài "Bài tập về…" Lí mà hiện
tượng gốc đã có hoạt ảnh ở bài lý thuyết cùng chương, 13 bài Toán luyện tính toán/thống kê ghép
nhóm, và các bài giới thiệu môn/quy tắc an toàn. Với những bài này **để trống là đáp án đúng** —
lý do đã ghi trong schema và là lý do trường `animation` để `optional`. Vẫn vượt 70% ở cả 4 môn
mà không phải nới tiêu chí.

**Ba lỗi vật lí tự bắt được khi kiểm lại,** đáng ghi vì chúng cho thấy hoạt ảnh sai nguy hiểm
đến đâu: (1) tia phun từ bình nước vẽ "càng sâu càng xa" là SAI — tầm xa `R = 2√(h·D)` cực đại ở
giữa; đã dựng lại với bình trên giá cao để `h < D` ở cả ba lỗ, quỹ đạo tính từ `v = √(2gh)`.
(2) toạ độ chấm quét trên đường cong cộng hưởng ban đầu ước lượng bằng mắt, lệch khỏi đường cong
— đã tính lại từ chính hàm. (3) mốc lời dẫn "cắt cổng quang" lệch với quỹ đạo rơi bậc hai, đã
chỉnh theo tỉ số `√(0,15/0,55) = 0,52`.

**Hai chỗ hình cố ý không đúng tỉ lệ, và nói thẳng điều đó** trong `description` lẫn nhãn trên
hình để học sinh không rút ra kết luận sai: hạt nhân ở `ly12-c4-b20` phóng to 20 lần, và phân
hạch ở `ly12-c4-b24` vẽ 2 nơtron thay vì trung bình thực 2,5.

## Bằng chứng kiểm chứng

```
npm run typecheck                → exit 0 (sau khi rm -rf packages/*/dist dist dist-server)
npm run lint                     → exit 0, 0 cảnh báo
npm run format                   → không file nào phải sửa
npm run test:coverage            → 595 file test · 12 398/12 398 xanh · exit 0
  Statements 94,55% · Branches 90,62% · Functions 94,81% · Lines 94,96%
npm run build                    → exit 0
npm run budget                   → Initial JS 126,04/140 kB · Initial CSS 18,11/20 kB
npm run gen:stem-lesson-index    → chỉ mục khớp; lessonsLazy.test.ts 4 môn xanh
```

**Initial JS: 126,07 kB trước đợt → 126,04 kB sau đợt.** Dữ liệu bài học nằm trong chunk nạp
lười theo chương, không vào entry — đúng như đặc tả dự đoán (kỳ vọng 0 kB).

**Tính toàn vẹn (tự kiểm, không tin báo cáo của luồng):** với **từng file** của cả 4 môn, tước
bỏ mọi khối `animation` khỏi bản làm việc bằng cách đếm ngoặc, chạy Prettier cả hai bản rồi
`diff` với `git show HEAD:<file>` → khác biệt duy nhất là các dòng comment được thêm, **0 dòng
nội dung bị đổi**. Và đếm số khối `animation` HEAD vs cây làm việc để chắc không khối nào bị
nhân đôi.

## Bẫy đã mắc trong chính đợt này — đã ghi `TRAPS.md` mục 5

`lint-staged` cất/khôi phục stash quanh lượt commit, trong khi 4 luồng khác đang ghi file →
**16 hoạt ảnh Toán bị nhân đôi** trong cùng một object literal. Khoá trùng trong JS thì khoá
sau lặng lẽ thắng: TypeScript không báo, Zod chỉ thấy giá trị cuối, Prettier định dạng bình
thường, test độ phủ vẫn xanh. Chỉ lộ ra khi **đếm** số khối. Đã khôi phục từ HEAD và chuyển sang
`--no-verify` + tự chạy Prettier/ESLint. Cùng mục cũng ghi hai bẫy anh em: `git stash` để "so
với HEAD cho sạch" cất luôn việc dở của luồng khác, và scratchpad dùng chung khiến một luồng ghi
đè mất 20 hoạt ảnh đã soạn của luồng khác.

## Còn để ngỏ — CẦN NGƯỜI DÙNG QUYẾT

**Tiêu chí "không file chương nào vượt 120 kB nguồn" KHÔNG đạt với 4 file Sinh:**
`sinh12c1.ts` 249,6 kB · `sinh11c2.ts` 139,3 · `sinh12c2.ts` 136,5 · `sinh11c1.ts` 126,6.

Hai điều cần biết trước khi quyết:

1. **Mốc nền trong đặc tả ghi sai.** Đặc tả viết "hiện lớn nhất `ly10c3.ts` 56,7 kB" vì lúc đó
   chỉ đo môn Lí. Thực tế `sinh12c1.ts` **đã là 132 kB TRƯỚC đợt này** — tiêu chí đã bị vi phạm
   từ trước, đợt này làm nặng thêm.
2. **Chi phí THẬT người học chịu thì tốt.** Đo trên `dist/js/` sau `npm run build`, chunk chương
   nặng nhất là `sinh12c1` = **39,7 kB gzip**, xếp thứ 6 và nhẹ hơn hẳn nhiều chunk đang chạy
   sẵn trên production: `ProgrammingSpecStagePage` 122,2 kB gzip · `vendor-codemirror` 149,2 ·
   `grading` 61,3 · `Placement` 56,3 · `registry` 46,3.

Nghĩa là tiêu chí đang đo **byte mã nguồn**, trong khi thứ đáng đo là **kích thước chunk sau
build**. Ba lựa chọn, tôi không tự chọn:

- **(a)** Sửa tiêu chí của đặc tả sang "chunk chương sau build ≤ N kB gzip" và đặt ngưỡng theo số
  đo thật. Rẻ nhất, và đo đúng thứ cần đo.
- **(b)** Tách 4 file chương Sinh thành nhiều file nhỏ. Sạch về nguồn nhưng phải sửa loader +
  sinh lại chỉ mục, là một đợt riêng có rủi ro riêng.
- **(c)** Giữ nguyên tiêu chí và ghi nhận đây là nợ có chủ đích.
