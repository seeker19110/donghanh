# 0295 — 2026-09-13 — Hoàn thiện 4 môn STEM và nối vào app

**PR:** #893 · **Nhánh:** `claude/jolly-galileo-8uy96y`
**Đặc tả:** `docs/specs/2026-09-13-hoan-thien-4-mon-stem.md`

## Việc đã làm

Bốn môn Toán · Vật lí · Hoá học · Sinh học từ chỗ "có dữ liệu nhưng chưa ai học được" thành
nội dung chạy thật trong app, có hoạt ảnh minh hoạ và nhánh bồi dưỡng học sinh giỏi.

| Môn      | Trước                | Sau                                    |
| -------- | -------------------- | -------------------------------------- |
| Toán     | chưa có gói nào      | 35 bài · 11 hoạt ảnh · 6 chuyên đề HSG |
| Vật lí   | 85 bài, chưa nối app | 94 bài · 14 hoạt ảnh · 9 chuyên đề HSG |
| Hoá học  | 72 bài, chưa nối app | 81 bài · 15 hoạt ảnh · 9 chuyên đề HSG |
| Sinh học | 82 bài, chưa nối app | 84 bài · 15 hoạt ảnh                   |

Tổng: **294 bài**, 55 bài có hoạt ảnh, 24 chuyên đề HSG ba cấp trường → tỉnh → quốc gia.

### Nền móng dùng chung

- `packages/core-contracts/lessonAnimation.ts` — hoạt ảnh là dữ liệu KHAI BÁO (6 loại hình +
  keyframe), không phải HTML tự do: bài học do AI sinh mà nhúng HTML thô là lỗ XSS, và màu tự
  do thì không cổng nào rà nổi tương phản trên 5 theme.
- `packages/core-ui/LessonAnimation.tsx` — một trình vẽ SVG/CSS cho cả bốn môn: ánh xạ vai trò
  màu sang token, tôn trọng `prefers-reduced-motion`, luôn kèm mô tả bằng lời + nút tạm dừng.
- `packages/core-learner/stemLessonLoader.ts` + `scripts/gen-stem-lesson-index.ts` — chỉ mục
  nhẹ + nạp lười theo chương. Bốn registry cộng lại ~2 MB; nếu import thẳng thì mọi trang của
  app đều phải gánh. Đo sau khi nối: bundle khởi động 135,09 kB / ngân sách 140 kB.
- Hai trang dùng chung cho cả bốn môn: `StemLessonList` (danh sách theo chương, tách nhánh
  chuẩn / HSG) và `StemLessonView` (hook → lý thuyết → hoạt ảnh → ví dụ mẫu → tự kiểm tra →
  thẻ ôn), chấm câu hỏi bằng `@dhcb/core-grading` — hàm thuần, tất định, không có AI trong
  luồng phán đúng/sai.

## Quyết định

1. **Bỏ cổng duyệt chuyên môn trước khi nối vào app** (người dùng chốt trong phiên). Đảo ngược
   quyết định cũ ở `PROGRESS.md`. Đổi lại, mỗi môn có test canh chấm lại TOÀN BỘ đáp án bằng
   engine chấm thật, coi như "người duyệt tự động". Mọi bài vẫn mang `reviewStatus: 'draft'`.

   > **ĐÍNH CHÍNH 2026-09-14 (xem `docs/changelog/0297-*.md` + TRAPS.md mục 4):** hai chỗ sai
   > trong câu trên. (1) Ca test đó **không phải "người duyệt tự động"** — nó lấy chính đáp án
   > đã khai làm bài làm của học sinh, nên là cổng NHẤT QUÁN chứ không phải cổng ĐÚNG KIẾN
   > THỨC; với 442/665 câu trắc nghiệm nó không kiểm được gì về đúng/sai kiến thức. (2) Lúc đó
   > **môn Sinh KHÔNG hề có ca test này** (chỉ Toán/Lí/Hoá có); đã bổ sung 2026-09-14.

2. **Màu đúng/sai chỉ dùng cho hình vẽ, cấm dùng cho CHỮ** trong hoạt ảnh — chữ cần 4,5:1/7:1,
   hình chỉ cần 3:1. Chặn ngay tại schema thay vì đợi CI đỏ.
3. Hoạt ảnh SVG/CSS, không WebGL (người dùng chốt).

## Ba lỗi THẬT tìm được, không cổng nào bắt

1. **Engine chấm sai bài làm đúng của học sinh.** Quy tắc "một dấu, theo sau đúng 3 chữ số thì
   là phân nhóm nghìn" (để hiểu đúng cách viết `1.000` của tiếng Việt) nuốt luôn mọi số thập
   phân ba chữ số: `0,866` và `0,125` bị hiểu thành 866 và 125. Đây là đáp án lượng giác và xác
   suất rất thường gặp. Hai subagent vấp phải một cách độc lập. Sửa: phần nguyên bằng 0 thì
   không thể là phân nhóm nghìn. Giữ nguyên `1.000 = một nghìn`.
2. **2225 chỗ in ra chữ `\n` thay vì xuống dòng** (Vật lí 1052, Sinh 1173, Hoá 513 — Hoá tự
   sửa). Chuỗi viết `'\\n'` nên nội dung tới tay học sinh có ký tự `\n` nằm lẫn giữa câu và cả
   đoạn lý thuyết dồn thành một dòng dài. Kiểu vẫn đúng, schema vẫn qua. Đã thêm test canh.
3. **4 điểm sai kiến thức trong nội dung Hoá cũ** — nặng nhất: bài giải thích lớp M dừng ở 8
   electron "do quy tắc bát tử", trong khi nguyên nhân thật là mức năng lượng 4s thấp hơn 3d.

Thêm một lỗi do chính đợt này gây ra và bị cổng a11y chặn lại đúng lúc: nút của hai trang mới
tự ghép `bg-accent-600 text-[#fff]`, rớt tương phản ở 3 theme. Đã đổi sang `buttonClass` dùng
chung — đây đúng là lỗi mà `packages/core-ui/buttonStyles.ts` đã cảnh báo ở đầu file.

## Bằng chứng kiểm chứng

```
npm run build      ✅  (bundle khởi động 135,09 kB / 140 kB; CSS 18,09 / 20 kB)
npm run typecheck  ✅
npm run lint       ✅  0 cảnh báo
npm run format     ✅  All matched files use Prettier code style
npm test           ✅  586 tệp / 12269 test
playwright a11y    ✅  20/20 (AA + AAA, 2 trang mới × 5 theme)
```

Đã NHÌN ảnh chụp trang thật ở 1440px và 390px (Tầng 8b của `QUY-TRINH-AUDIT.md`): lý thuyết
xuống dòng đúng, hoạt ảnh chạy kèm mô tả và nút tạm dừng, danh sách gom theo chương đọc được
trên màn nhỏ.

## Còn nợ

- **Toán thiếu hình học không gian và thống kê** (lớp 10 C5; lớp 11 C3, C4, C8; lớp 12 C2, C3,
  phương trình đường thẳng trong không gian). Đây là phần mỏng nhất của cả bốn môn.
- **Chuẩn sư phạm mới rà trên phần bài trọng điểm**, chưa quét hết 294 bài: Vật lí ~10 bài,
  Hoá ~17 bài, Sinh chưa rà 82 bài cũ.
- **Sinh chưa có nhánh HSG** (đợt này chỉ yêu cầu cho Toán/Lí/Hoá).
- Còn ~69 bài Sinh và các bài lý thuyết của ba môn kia chưa có hoạt ảnh — phần lớn là bài thực
  hành hoặc liệt kê, hình động không thêm gì; nhưng vài bài còn đáng làm (operon Lac, đột biến
  số lượng NST, chu trình carbon, sóng dừng, cảm ứng điện từ, đường sức từ).
