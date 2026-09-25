# Hai nợ nhỏ sau S09: bỏ qua mục lục bằng bàn phím, đếm lượt thoại thống nhất (+ một lỗi focus thật)

- **Ngày:** 2026-09-25 · **PR:** (PR của nhánh `claude/uiux-no-nho-skip-link-luot-thoai`)
- **Nguồn:** hai nợ ghi ở PROGRESS sau S09b/S09d (changelog 0437, 0439) và S09c (0438).

## 1. Bàn phím desktop phải Tab qua cả mục lục môn học

**Đo (Playwright, 1440px, blue-sky):** liên kết "Bỏ qua tới nội dung chính" có sẵn, nhưng đích
`<main>` lại CHỨA cột mục lục trái (`TwoPane railSide="left"`) đứng trước nội dung bài. Qua liên
kết đó vẫn còn ~20 điểm dừng trong cây mục lục.

| Trang                                     | Trước (Tab tới đích) | Sau (đi qua hai liên kết bỏ qua) |
| ----------------------------------------- | -------------------- | -------------------------------- |
| Bài Vật lí `ly10-c2-b10` → "Lý thuyết"    | 52                   | **5**                            |
| Bài lập trình `p1-u1-l1` → "Kết quả chấm" | 40                   | **4**                            |

**Sửa (một chỗ dùng chung):** `packages/core-ui/TwoPane.tsx` — khi `railSide="left"`, chèn liên
kết ẩn "Bỏ qua mục lục, tới nội dung" ngay trước cột trái (vô hình tới khi nhận tiêu điểm, cùng
khuôn `SkipLink`); cột nội dung có `tabIndex=-1` làm đích. Bấm được xử lý bằng mã (không đổi
`location.hash`) vì trang bài đọc hash làm đích điều hướng trong bài (S09b/S09d) — hash lạ sẽ bị
coi là đích sai. Áp cho mọi trang cột trái: bài STEM, bài/bậc/khoá lập trình, cấp CEFR, hội
thoại mẫu (`Lessons.tsx` truyền nhãn tiếng Anh ở chiều B). Cột phải và mobile không đổi.

**Sửa kèm — `packages/core-ui/SkipLink.tsx`:** liên kết "Bỏ qua tới nội dung chính" có sẵn đi
theo `href="#noi-dung-chinh"`, nên trình duyệt cuộn `<main>` sát mép trên: phần tử đầu nội dung
(liên kết quay lại) nằm ở top=32px, DƯỚI header sticky cao 56px (WCAG 2.4.11), và URL bị gắn
`#noi-dung-chinh` — hash lạ mà trang bài học (S09b/S09d) coi là đích sai. Nay focus bằng mã với
`preventScroll`, không đổi hash; không tìm thấy đích thì để trình duyệt xử lý như cũ.

## 2. Thẻ bài hội thoại ghi "10 lượt thoại", trang bài đếm 20

`LessonList.tsx` hiện `turnCount / 2`, trong khi trang bài đếm "Lượt 20", link `#luot-20` tồn tại,
và dòng mô tả trang ghi "Mỗi bài 10–20 đoạn" — đo dữ liệu thật: `turnCount` của 350 bài nằm trong
10–20. Thẻ nay ghi đúng `turnCount` ("20 lượt thoại" / "20 turns"); chuỗi i18n tiếng Anh đổi
"exchanges" → "turns" cho cùng nghĩa.

## 3. Phát hiện thêm khi kiểm: tiêu điểm rơi về `<body>` sau khi chọn trong mục lục mobile

Chạy E2E dưới tải CPU, `outline-english.spec.ts` (mobile CEFR) đỏ — **đỏ cả trên `main` gốc
10/16**. Ghi dòng thời gian tiêu điểm cho thấy lỗi xảy ra MỌI lần, kể cả không tải: chọn một
hội thoại → `<h1>` cũ nhận focus → màn hội thoại dựng xong **không có `<h1>`** (chỉ `<h3>`) → `<h1>`
bị gỡ → tiêu điểm ở `<body>` (người dùng bàn phím mất chỗ đứng). Test cũ đọc tiêu điểm MỘT lần
ngay khi panel ẩn, đúng khoảnh khắc `<h1>` cũ còn sống, nên xanh giả.

- `apps/dhcb/src/components/useOutlinePane.tsx` — `dieuTieuDiemVeTieuDe` canh 3 giây theo thời
  gian (không theo số khung hình): ưu tiên `<h1>` mới; sau 0,5 giây nhận `<h1>` đang có (trang lập
  trình dùng lại node `<h1>`); tiêu điểm mồ côi mà không có `<h1>` → `#noi-dung-chinh`. Người dùng
  đã tự chuyển tiêu điểm thì không giành lại.
- `e2e/outline-english.spec.ts` — kiểm trạng thái CUỐI (sau cửa sổ 3 giây), điều kiện giữ nguyên.
  Phép thử ngược: hook cũ + test mới → đỏ 4/4 không cần tải.

## Bằng chứng

- `e2e/skip-link.spec.ts` thêm: hash không đổi sau Enter; ca mới cho trang bài có mục lục trái
  (liên kết thứ hai hiện khi có tiêu điểm, tiêu điểm vào cột nội dung, không bị header che, tới
  "Lý thuyết" ≤5 Tab). Bản cũ (`SkipLink` + `TwoPane` gốc): 2 ca đỏ đúng chỗ; bản mới: 15/15
  (lặp 3).
- Lưu ý đo: dev server Vite KHÔNG nạp lại gói `packages/core-ui` sau khi tráo file để làm phép
  thử ngược — một lượt E2E đã chạy trên `TwoPane` cũ. Đã khởi động lại server (`--force`), xác
  nhận module phục vụ đúng bản mới, rồi chạy lại mọi lượt E2E; số dưới đây là của lượt chạy lại.

- Unit: `TwoPane.test.tsx` 3 ca (bản cũ đỏ 2/3), `LessonList.test.tsx` 2 ca; `components/` 43
  file / 1001 test xanh.
- E2E (server riêng cổng 5296, đã khởi động lại): 12 spec mục lục/điều hướng/skip-link/mobile
  → 91/91; mục lục/điều hướng × lặp 2 → 140/140; ca mobile mục lục ba môn dưới tải CPU × 6 →
  30/30; a11y AA+AAA các route bài học/lập trình/CEFR/English × 3 theme → 144/144.
- Cổng: xem mục Validation của PR.
