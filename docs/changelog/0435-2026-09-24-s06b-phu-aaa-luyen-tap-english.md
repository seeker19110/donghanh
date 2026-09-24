# 0435 — S06b: đưa Phòng luyện tập và Tiếng Anh home vào cổng AAA

- **Ngày:** 2026-09-24
- **PR:** (điền khi mở PR)
- **Đặc tả:** `docs/specs/2026-09-23-uiux-s06-s08-accessibility.md` mục "Quyết định S06b"
  (Approved for implementation, duyệt ở PR #1160).

## Việc đã làm

`/luyen-tap` và `/goc-hoc-tap/english` đã nằm trong cổng AA (`e2e/a11y.spec.ts`) nhưng
chưa nằm trong `ROUTES` của cổng AAA (`e2e/a11y-aaa.spec.ts`). Đợt này thêm hai route vào
cổng AAA rồi sửa component cho tới khi cổng xanh. Không thêm ngoại lệ, không `disableRules`,
không hạ ngưỡng 7:1 / 4.5:1, không đổi collector hay cách xử lý `incomplete`.

### Tái hiện trước khi sửa (chỉ thêm route, chưa sửa component)

`npx playwright test e2e/a11y-aaa.spec.ts -g "tiêu đề.: /(luyen-tap|goc-hoc-tap/english) theme"`
cho **6/6 đỏ**:

| Route                  | dark-blue                           | blue-sky                                 | kid                                      |
| ---------------------- | ----------------------------------- | ---------------------------------------- | ---------------------------------------- |
| `/luyen-tap`           | 7 incomplete (6 content + 1 chrome) | 7 incomplete (6 content + 1 chrome)      | 7 incomplete (6 content + 1 chrome)      |
| `/goc-hoc-tap/english` | 2 incomplete (chrome)               | 2 incomplete (chrome) + 1 vi phạm 6.25:1 | 2 incomplete (chrome) + 1 vi phạm 5.85:1 |

- Mọi `incomplete` đều là `color-contrast` — "Element's background color could not be
  determined due to a background gradient".
- `/luyen-tap`: tiêu đề + đoạn mô tả banner Sổ tay lỗi sai; nhãn "Xếp hạng theo điểm Elo",
  badge "Đấu 1v1", tiêu đề + đoạn mô tả thẻ Đấu trường (content), chữ nút "Vào Đấu Trường"
  (chrome, nút gradient amber→orange).
- `/goc-hoc-tap/english`: `h4` + dòng mô tả của nút "Thử Thách Video Nói 1 Phút" (nền gradient).
- Vi phạm thật trên theme sáng: badge "A1–C2" trong `h2` (content) — `#006045` trên
  `#cbf1e5` = 6.25:1 (blue-sky), trên `#caeacd` = 5.85:1 (kid).

### Sửa

| File                                                   | Thay đổi                                                                                                                                                                                     | Lý do                                                                                   |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `apps/dhcb/src/pages/learning/Practice.tsx`            | Banner Sổ tay: nền `bg-surface-card` đặc thay gradient; gradient rose→amber thành dải trang trí 4px `aria-hidden` ở mép trên (ngoài vùng chữ); chữ `text-content` / `text-content-secondary` | Chữ đọc phải nằm trên nền đo được; token ngữ nghĩa đã được thiết kế đạt AAA ở mọi theme |
| `apps/dhcb/src/components/PvPArena/PvPArenaCard.tsx`   | Như trên (dải amber→orange); nút "Vào Đấu Trường" `bg-amber-500` đặc; bỏ `backdrop-blur-xl` (nền đặc thì blur vô nghĩa)                                                                      | Cùng lý do; component dùng chung với studio "Thử thách" ở `/ban-dong-hanh`              |
| `apps/dhcb/src/pages/subjects/english/EnglishHome.tsx` | Nút Thử thách video: `bg-zinc-900` đặc thay gradient; badge A1–C2 `theme-light:text-emerald-900` (thay `-800`)                                                                               | Hết `incomplete`; đưa badge trong `h2` lên ≥ 7:1 ở theme sáng                           |
| `e2e/a11y-aaa.spec.ts`                                 | Thêm `/luyen-tap`, `/goc-hoc-tap/english` vào `ROUTES`                                                                                                                                       | Phủ F5 cho hai màn                                                                      |

## Bằng chứng sau sửa

- AAA hai route × 3 theme: **6/6 xanh**; thêm `/ban-dong-hanh` (dùng chung `PvPArenaCard`
  qua `StudioLabs`): **9/9 xanh**.
- AA: `/luyen-tap` + `/ban-dong-hanh` × 3 theme **6/6 xanh**; test AA "Home — gợi ý luyện
  nói với từ vừa học" (trang `/goc-hoc-tap/english`) × 3 theme **3/3 xanh**.
- Tương phản đo bằng axe sau sửa (thấp nhất theo từng theme dark-blue / blue-sky / kid):
  - Tiêu đề banner: 13.26 / 16.29 / 12.25. Đoạn mô tả + nhãn Elo: 9.48 / 9.45 / 7.76.
  - Badge "Đấu 1v1": 7.26 / 7.18 / 7.24. Nút "Vào Đấu Trường": 9.83 ở cả ba theme.
  - English: badge A1–C2 7.25 / 7.90 / 7.40; `h4` Thử thách video 14.94 / 16.29 / 15.94;
    dòng mô tả 7.38 / 7.73 / 7.41.
  - Studio "Thử thách" ở `/ban-dong-hanh` (đã đóng băng hoạt ảnh): cùng các con số trên,
    0 `incomplete`.
- `npm run codemap -- impact`: `PvPArenaCard` → `StudioLabs` → `Companion` (`/ban-dong-hanh`)
  và `Practice`; `Practice` → `App`; `EnglishHome` → `App` + 2 file test. Đã quét AA/AAA các
  route đó như trên.
- Tầng 8b: ảnh 1440px + 390px trước/sau, 3 theme, cả hai trang (12 cặp). Nhìn ảnh sau: hai
  banner vẫn liền mạch, dải màu mảnh ở mép trên giữ nhận diện rose/amber; không lặp nội dung;
  `scrollWidth - clientWidth = 0` ở cả 24 ảnh (không cuộn ngang).

## Rủi ro còn lại

- Badge "Đấu 1v1" chỉ dư ~0.2 trên ngưỡng 7:1 (7.18–7.26). Đổi token amber sau này có thể
  làm cổng AAA đỏ lại — đó là hành vi mong muốn của cổng, không phải lỗi.
- Nút "Mở Sổ Lỗi & Ôn Tập" (chữ đen trên `bg-rose-500`) 5.59:1: đạt AA cho chrome, không
  thuộc phạm vi AAA; giữ nguyên.
- Khối "Học tập trọng tâm" ở English home vẫn khai `bg-gradient-to-br` nhưng lớp `.glass`
  ghi đè `background` nên gradient không hiển thị và axe đo được — không đổi trong đợt này.
