# 0419 — 2026-09-22 — Sửa toàn bộ phát hiện audit UI/UX lần 2 (đợt G–M), mỗi đợt một commit

- **PR:** (đợt này) · nhánh `claude/ui-ux-comprehensive-review-rplwjh`
- **Nền:** `docs/audit/2026-09-22-danh-gia-toan-dien-ui-ux-lan-2.md` (mục 3 phát hiện, mục 5 chia
  đợt). Chủ dự án chốt "fix hết lỗi". Riêng **P2-5 theme `kid` chỉ đổi màu** là câu hỏi sản phẩm,
  KHÔNG làm trong đợt này — chờ chủ dự án quyết.

## Việc đã làm (theo đợt = theo commit)

**G — Luyện nghe (P0-1).** Tab "Câu thông dụng" từng in phẳng 1.000 thẻ. Nay nhóm theo chủ đề
(gập/mở, mở sẵn nhóm đầu), 24 thẻ + "Xem thêm" mỗi nhóm, ô tìm kiếm, thẻ "Tiếp tục" mẫu chưa
nghe (`viewedTracking` namespace `listening`). Cổng mới `e2e/listening-phrases.spec.ts` canh trang
390px ≤ 4 màn hình; thêm trang vào `a11y.spec.ts` + `a11y-aaa.spec.ts`.

**H + K — Trang VIP và thuật ngữ đợt 2 (P0-2, P1-3).** 3 bullet VIP viết theo lợi ích, Gemini Live
gắn "(đang thử nghiệm)" vì nợ PROGRESS #15 chưa đóng. 5 tab Companion → Trò chuyện · Ghi nhớ ·
Thử thách · Kế hoạch · Tổng kết. Chip/badge Simulators · Socratic · REAL-LIFE LAB · Dictation ·
Echo Shadowing → tiếng Việt. `VoicePicker` hiện "Giọng nữ 1…" (tên Google giữ ở `title`).
`UiNoise.design.test.ts` thêm 5 cụm cấm. Còn sót (ghi trong comment test): `Edge AI`, `Memory
Palace`, `Viseme`, `Chirp3` ở các component chuyên biệt (EdgeAiIndicator, MemoryPalaceCard…) —
đợt riêng.

**L + M — Truyện, 14 hướng, câu lặp, header, cài đặt (P1-5, P2-1..P2-4).** Truyện: 12 thẻ + "Xem
thêm (N truyện nữa)" + dòng đếm (không làm "Đọc tiếp" vì app chưa lưu truyện đang đọc dở — việc
mới). 14 hướng: 2 chip mỏ neo ở mobile (E2E `outline-programming`). `LevelMilestones`: chỉ bậc
khoá kế tiếp in câu giải thích, bậc xa ghi "Mở sau P<n-1>". `SubjectProgressSection`: một dòng
chú thích thay vì 5 lần, bỏ từ "bằng chứng". `SubjectDetail` và Tin nhắn luôn có `title` + `h1` ở
nhánh lỗi/tải. Trang Cài đặt đổi tên "Cài đặt", tách h2 "Chung — áp dụng cho cả app" / "Môn
Tiếng Anh" và sắp lại khối. Banner "Mẹo kiếm huy hiệu": kiểm mã thấy hai trang đã dùng chung
`RewardTipBanner` + một khoá đóng — phát hiện P2-1 mục 3 của audit là dương tính giả, không sửa.

**I — Ba lỗi trạng thái (P1-1, P1-2, P1-4).** Companion: nguyên nhân thật là ô nhập `sticky
bottom-0` dính đáy viewport trong khi cả trang cuộn theo document, nên thêm padding không cứu
được (agent đã thử và đo); sửa gốc bằng khung chat `flex-col` giới hạn chiều cao, danh sách
`flex-1 min-h-0 overflow-y-auto`, ô nhập trong luồng. E2E `companion-history` đo boundingBox ở
1440×900 (đỏ trước, xanh sau). Nhiệm vụ: tách "chưa đăng nhập" khỏi "API lỗi" (LoadError +
Thử lại, 3 unit test mới). Hồ sơ: `ReferralSection`/`CompanionLinkSection` chờ tối đa 8 s rồi
ẩn khối thay vì skeleton vô hạn. Ghi chú: tab ẩn "(0)" khi đang tải/lỗi. Bỏ "(Personal
Companion)", badge `general` → "Chung".

## Bằng chứng (Tầng 8b, theme blue-sky, chiều cao trang px trước → sau)

| Trang                      |         1440px |          390px | Ghi chú                                    |
| -------------------------- | -------------: | -------------: | ------------------------------------------ |
| Luyện nghe                 | 24.893 → 1.273 | 74.309 → 2.159 | nhóm gập, 88 màn hình → 2,6 màn hình       |
| Truyện song ngữ            |  8.742 → 1.091 | 17.456 → 2.009 | 12 thẻ + Xem thêm                          |
| Bạn Đồng Hành              |  1.082 → 1.011 |  1.201 → 1.162 | desktop: 4 gợi ý nằm TRÊN ô nhập, không đè |
| Tiến độ                    |      992 → 992 |  2.378 → 2.291 | 1 dòng chú thích thay 5                    |
| Cài đặt                    |  1.682 → 1.786 |  1.994 → 2.178 | +2 tiêu đề mục (cố ý)                      |
| 14 hướng · Lập trình home  |  2.405 · 2.770 |  4.556 · 4.362 | ≈ không đổi, có mục lục nhảy / bớt câu lặp |
| Nhiệm vụ · Hồ sơ · Ghi chú |      không đổi |      không đổi | chỉ đổi trạng thái lỗi                     |

- Unit: `npm test` **16.738/16.738** ✅ · typecheck ✅ · lint 0 cảnh báo ✅ · prettier ✅.
- E2E đã chạy: `listening-phrases` (mới, 3) · `companion-history` (4, có 1 mới) ·
  `outline-programming` (có 1 mới) · `home-clarity-evidence` · `v2-hubs` · `programming-home` ·
  `chat` · a11y AA+AAA cho `/luyen-nghe` và `/cai-dat` (12/12).
- `home-clarity-evidence`: một lần đỏ vì agent sót mảng `promptNames` còn nhãn chip cũ (dòng
  400-401) — đã sửa. Sau đó test `:660` còn đỏ **1/3 lượt** ở ca CLS 0,103 > 0,1
  (`member-insight-*-1440`); tái hiện trên commit gốc `0d1d6bf` trong worktree riêng cũng đỏ
  **1/3 lượt** cùng ca → không phải hồi quy của đợt này, đúng test đã ghi đỏ sẵn ở changelog
  0414/0415. Chưa sửa test (ngoài phạm vi), ghi nợ.

## Chưa làm / ghi nhận

- **P2-5 theme `kid` chỉ đổi màu** — câu hỏi sản phẩm, chờ chủ dự án.
- Thuật ngữ còn sót ngoài phạm vi audit: `Edge AI`, `Memory Palace`, `Viseme`, `Chirp3` ở
  `EdgeAiIndicator`, `MemoryPalaceCard`, `CyberTutorAvatar3D`… (ghi trong comment
  `UiNoise.design.test.ts`).
- "Đọc tiếp" ở Truyện cần cơ chế lưu truyện đang đọc — chưa có.
- Khung chat Companion dùng `h-[min(68dvh,640px)]`; ảnh 390px sau sửa nhìn ổn (ô nhập ở
  y≈970/1.162) nhưng chưa có test canh riêng cho mobile.
