# 0411 — 2026-09-22 — Đánh giá sâu UI/UX (80 ảnh Tầng 8b) + xử lý 6 đợt A–F trong một PR

> PR: (đợt này), nhánh `claude/ui-ux-deep-review-bbgqf8`. Chủ dự án yêu cầu "đánh giá sâu UI/UX"
> rồi "xử lý đi". Báo cáo đầy đủ ở `docs/audit/2026-09-22-danh-gia-sau-ui-ux.md` (mục 3 xếp
> P0/P1/P2, mục 5 chia đợt). Sáu đợt A–F gộp một PR theo yêu cầu, mỗi đợt một commit.

## Cách đánh giá

20 trang × 1440/390px × 2 theme = 80 ảnh `fullPage` (công thức Tầng 8b), đo chiều cao trang từ
header PNG, đo toạ độ phần tử bằng `getBoundingClientRect`, rồi đối chiếu mã. Ảnh nằm ngoài repo.

## Việc đã làm (theo đợt = theo commit)

**A — Companion và landing về hai trụ còn lại (P0-1, P2-6).** `DOMAIN_OPTIONS` chỉ còn
`all · learning · work` (nhãn "Ghi chú"), 4 gợi ý nhanh viết lại quanh việc học/Ghi chú, lời chào
không nhắc Sự nghiệp/Khởi nghiệp/Đời sống, `/welcome` bỏ câu "bốn trụ khác". Test canh mới
`CompanionStudios/studioTypes.test.ts`. E2E `v2-hubs.spec.ts` đổi chip từ "Sự nghiệp" sang "Ghi chú".

**C — gỡ ba chỗ lặp nội dung (P1-3, P1-4, P2-1).** Hồ sơ: hai khối "Không gian" và "Không Gian
Chuyên Biệt (Hubs) · Platform V2" gộp thành một (STUDIOS + Bạn bè + Tin nhắn), `Profile.test.tsx`
canh số nút = `STUDIOS.length + 2`. Lộ trình Tiếng Anh (`Learn.tsx`): bỏ 4 tab + `StudyPanel`
(bản sao của Từ điển), thay bằng một link "Ôn từ hôm nay… → Mở Từ điển". Phòng luyện tập: bỏ ô
"Sổ Tay Lỗi Sai" lặp với banner đầu trang.

**D — dọn thuật ngữ, lỗi thân thiện, chi tiết nhỏ (P1-1, P1-6, P2-2..P2-5).** Gỡ/đổi ~20 badge
kỹ thuật (`V4 Flagship` → "Đẹp nhất", `Edge AI WASM` → "Chấm trên máy", `LaTeX OCR` → "Giải từng
bước", `Chirp3 HD` → "Giọng bản xứ", `Nữ · Kore` → "Giọng nữ", gỡ FPS/`Viseme: SIL`/3 nhãn shader
khỏi avatar…). Hàm mới `lib/friendlyError.ts` (`thongDiepLoiThanThien`) + test, áp cho 6 chỗ ở
Ghi chú (ca thật: `Unexpected token '<'…` → "Máy chủ trả về dữ liệu không đọc được…"). Luyện viết
không tô đỏ khi chưa gõ. Badge `A1–C2`/`Gia sư AI` `whitespace-nowrap`. Tiêu đề header ngắn:
"Góc học tập", "Bạn Đồng Hành". Luyện nói có dòng giải thích mức như Trò chuyện.

**B — Bạn Đồng Hành ưu tiên khung chat (P0-2).** Dưới 1024px mặc định hình đại diện "Gọn nhẹ"
(3D vẫn chọn được); gợi ý nhanh chuyển vào TRONG luồng tin nhắn ngay dưới lời chào; ô nhập dùng
`pb-[calc(0.5rem+var(--bnav-h))]` thay `pb-24`; không tự cuộn khi trang chỉ có lời chào.

**E — Lập trình home (P1-2).** Bậc P1–P6 + chuyên sâu lên TRƯỚC khoá ngắn và lộ trình mục tiêu;
khoá ngắn mặc định 3 + "Xem tất cả 12 khoá"; mục lục nhảy 4 mỏ neo (`#bac-hoc #chuyen-sau
#khoa-ngan #lo-trinh-muc-tieu`, `scroll-mt-20`); tiến độ đầu trang là bậc đang học ("Bậc P1:
0/10 bài · cả môn 0/506").

**F — dải "Đã đồng bộ" (P1-5).** `OfflineSyncIndicator` chỉ khoe thành công khi hàng đợi từng bị
kẹt THẬT (offline hoặc 401); đồng bộ nền bình thường im lặng. Hai test mới canh cả hai chiều.

## Bằng chứng (số đo trước → sau, theme blue-sky)

| Trang                                                 |           1440px |       390px | Ghi chú                                        |
| ----------------------------------------------------- | ---------------: | ----------: | ---------------------------------------------- |
| Bạn Đồng Hành                                         |      1309 → 1090 | 1613 → 1217 | ô nhập mobile: y=1458 → nằm trong màn hình đầu |
| Lập trình home                                        |      3513 → 2796 | 5671 → 4388 | có mục lục nhảy                                |
| Lộ trình Tiếng Anh                                    |      2205 → 1518 | 3784 → 3133 | bản đồ bậc lên màn hình đầu                    |
| Hồ sơ                                                 |      2221 → 2004 | 3015 → 2712 | 0 ô đích lặp                                   |
| Trang chủ · Góc học tập · Tiếng Anh home · Luyện viết | không đổi (±6px) |             | đối chứng 390px                                |

Cổng: typecheck ✅ · lint 0 cảnh báo ✅ · prettier ✅ · unit test các vùng chạm ✅ · E2E
`programming-home` · `programming-course` · `v2-hubs` · `chat` 26/26 ✅.

## Chưa làm / ghi nhận

- Ảnh Hồ sơ 1440px vẫn "mờ toàn bộ" ở cả trước và sau; đo bằng máy thì `opacity=1` mọi phần tử
  sau 2,5s (`animate-fade-in` fill `both`). Kết luận: hiện tượng của cách chụp `fullPage`, không
  phải lỗi trang — nhưng chưa chứng minh được bằng ảnh, nên ghi lại.
- **ĐÃ TRẢ trong cùng PR (commit sau):** `thongDiepLoiThanThien` có thêm tham số `lang` (chiều B
  nhận câu tiếng Anh) và áp cho **34 chỗ / 19 file** người dùng nhìn thấy (Chat · Speaking ·
  Writing · Challenge · Companion · PvP · League · Holodeck · MemoryPalace · Integrations…).
  **Cố ý giữ nguyên** 15 chỗ còn lại: 12 ở `components/admin/*` (người vận hành cần chuỗi thô),
  3 `console.warn` trong `lib/` (không lên UI) và `workers/pyodideWorker.ts` (lỗi Python là nội
  dung học).
- Lặp giữa Phòng luyện tập và Tiếng Anh home (cùng đích ≥ 3 lối vào) chỉ gỡ phần trong cùng
  trang; câu hỏi "trang nào là nhà của tính năng nào" chưa chốt.
