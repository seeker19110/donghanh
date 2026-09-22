# Đánh giá sâu UI/UX toàn app — 2026-09-22

> Đợt audit chỉ **đọc và nhìn**, không sửa code. Bằng chứng là **ảnh chụp thật** (Tầng 8b của
> `docs/framework/QUY-TRINH-AUDIT.md`) + **số đo bằng máy** (chiều cao trang đọc từ header PNG,
> toạ độ phần tử đo bằng `getBoundingClientRect`). Nhánh: `claude/ui-ux-deep-review-bbgqf8`,
> commit gốc `ea87859`.

## 1. Phạm vi và cách làm

- 20 trang × 2 bề rộng (1440px · 390px) × 2 theme (`blue-sky` · `dark-blue`) = **80 ảnh** `fullPage`,
  chụp bằng công thức Tầng 8b (`mockLogin` thật, Vite dev, không backend). Ảnh nằm ngoài repo
  (`/tmp/shots/`), repo giữ kỷ luật 0 file PNG.
- Trang chụp: `/` · `/goc-hoc-tap` · Tiếng Anh (home · trò chuyện · luyện nói · luyện viết · từ điển
  · lộ trình · bài học) · Lập trình (home · bài `p2-u6-l1` · 14 hướng) · `/ban-dong-hanh` ·
  `/trang-ca-nhan` · `/ghi-chu` · `/nang-cap` · `/luyen-tap` · `/bat-dau` · `/login` · `/welcome`.
- Mỗi ảnh trả lời 4 câu của Tầng 8b: có chữ lặp không · trang cao bao nhiêu và có đường tắt không
  · 1440px có mảng trống lớn không · 390px có vỡ không.
- **Giới hạn cần nói rõ:** môi trường chụp không có Postgres nên mọi trang gọi API rơi vào trạng thái
  lỗi/rỗng. Đây lại là dịp tốt để chấm **trạng thái lỗi** (mục 4 luật kỹ thuật) — nhưng những nhận
  xét về nội dung có dữ liệu thật (bảng giá, huy hiệu, Ghi chú) chưa kiểm được.

## 2. Bảng số đo (chiều cao trang, px — theme blue-sky; dark-blue lệch ≤ 60px)

| Trang                                                                            |   1440px |    390px | Ghi chú                                            |
| -------------------------------------------------------------------------------- | -------: | -------: | -------------------------------------------------- |
| Trang chủ `/`                                                                    |     1615 |     1771 | vừa phải, có "Xem tất cả (6 môn)" gập bớt ở mobile |
| Môn Lập trình home                                                               | **3513** | **5671** | 6,7 màn hình mobile, KHÔNG có mục lục/đường tắt    |
| 14 hướng chuyên sâu                                                              |     2405 |     4556 | 5,4 màn hình mobile, không đường tắt               |
| Lộ trình Tiếng Anh                                                               |     2205 |     3784 | 6 thẻ bậc A1–C2 xếp dọc, không nhảy bậc            |
| Trang cá nhân                                                                    |     2221 |     3015 |                                                    |
| Phòng luyện tập `/luyen-tap`                                                     |     1584 |     3179 |                                                    |
| Bạn Đồng Hành                                                                    |     1309 |     1613 | ô nhập tin nhắn ở y = 1458/1613 (mobile)           |
| Còn lại (chat · nói · viết · từ điển · bài học · nâng cấp · đăng nhập · bắt đầu) | 900–1256 | 844–1606 | nằm trong 1–2 màn hình                             |

## 3. Phát hiện — xếp theo mức ảnh hưởng

Thang: **P0** = chặn/đánh lừa người dùng · **P1** = làm khó rõ rệt, nên sửa trong 1–2 đợt tới ·
**P2** = độ bóng, gom vào đợt tiện tay.

### P0-1 · Companion vẫn chào mời ba trụ ĐÃ GỠ (Sự nghiệp · Khởi nghiệp · Đời sống)

- **Thấy ở:** `/ban-dong-hanh` cả 2 bề rộng. Hàng chip "Lĩnh vực" có `Sự nghiệp` · `Khởi nghiệp` ·
  `Đời sống`; lời chào mở đầu viết "hỗ trợ bạn xuyên suốt … Sự nghiệp, Công việc đến Đời sống và
  Khởi nghiệp"; gợi ý nhanh "🚀 Khảo sát ý tưởng kinh doanh", "📚 Xây dựng thói quen đọc sách".
- **Mã:** `apps/dhcb/src/components/CompanionStudios/studioTypes.ts:40-68`,
  `apps/dhcb/src/pages/companion/Companion.tsx:59`.
- **Vì sao P0:** CLAUDE.md mục 6 chốt 2026-09-20 ba trụ này đã xoá cả route API lẫn bảng CSDL
  (migration `0085`). Người dùng bấm chip rồi hỏi về khởi nghiệp sẽ nhận câu trả lời không còn read
  model phía sau — giao diện hứa thứ hệ thống không làm. Đây đúng loại "tài liệu điều hành nói sai
  thực tế" (Tầng 6b) nhưng ở tầng UI.
- **Đề xuất:** rút `DOMAINS` về `auto · learning · work`; viết lại lời chào theo 2 trụ còn lại; thay
  4 gợi ý nhanh bằng việc thật của Learning/Ghi chú (vd "Hôm nay nên học gì trong 10 phút?",
  "Tóm tắt các việc còn mở trong Ghi chú"). Kèm test canh: `studioTypes` không được chứa id
  `career|startup|life`.

### P0-2 · Bạn Đồng Hành trên mobile: phải cuộn 1,7 màn hình mới tới ô nhập tin nhắn

- **Số đo (390×844):** canvas avatar 3D `top=376px, cao 280px`; ô nhập tin nhắn `top=1458px` trên
  trang cao 1613px; trang tự cuộn xuống `scrollY=753` khi mở (do `scrollIntoView` ở
  `Companion.tsx:262`). Việc chính của trang (nhắn tin) nằm ngoài màn hình đầu ở mobile.
- **Trên 1440px:** khung avatar chiếm ~340px + 2 hàng tab + hàng chip lĩnh vực, còn khung tin nhắn
  chỉ hiện được **1 dòng** của lời chào trước khi bị ô nhập che (ảnh desktop). Bên dưới ô nhập là
  mảng trống ~200px rồi mới tới 4 gợi ý nhanh — thứ tự ngược: gợi ý nên nằm trong khung chat.
- **Đề xuất:** avatar mặc định là "Gọn nhẹ (LITE)" ở < 1024px, 3D chỉ bật khi người dùng chọn;
  khung tin nhắn chiếm phần còn lại của viewport (`flex-1 min-h-0`), ô nhập dán đáy; gợi ý nhanh
  hiện _trong_ khung chat khi chưa có tin nào.

### P1-1 · Thuật ngữ nội bộ/kỹ thuật lộ lên giao diện người học

Thấy nguyên văn trên ảnh: `V4 FLAGSHIP` · `VISEME: SIL` · `READY / 3D CYBER TUTOR` ·
`Interactive Gaze Active` · `15 Oculus Morphing` · `PBR Cyber Shader` · `Edge AI WASM` (Companion và
Luyện viết) · `Platform V2` (Trang cá nhân) · `LaTeX OCR` · `PTHH Step` · `Chirp3 HD` · `Live STT` ·
`Band 9.0` · `Smart Mistake Bank` · `PVP 1v1 LIVE ARENA` · `Elo Rating & Ghost Matchmaking`
(Phòng luyện tập) · `Nữ · Kore` (tên giọng Google TTS ở Từ điển).

- **Vì sao:** người dùng mục tiêu là học sinh/người đi làm ở Việt Nam, không phải kỹ sư. Mỗi badge
  là một câu hỏi "cái này là gì?" chưa được trả lời. Quy ước dự án là "nội dung sát đời sống Việt
  Nam" (CLAUDE.md mục 1).
- **Đề xuất:** một đợt "dọn badge": xoá badge không mang thông tin cho người học; badge nào giữ thì
  nói bằng lợi ích ("Chấm ngay trên máy, không cần mạng" thay `Edge AI WASM`; "Giọng nữ" thay
  `Nữ · Kore`). Thêm test kiểu `UiNoise.design.test.ts` (đã có ở `pages/core`) chặn danh sách từ cấm.

### P1-2 · Môn Lập trình home: 5.671px ở mobile, lộ trình chính bị chôn dưới 13 khoá ngắn

- Thứ tự trên trang: Học tiếp → Dự án xuyên suốt → 3 nút → **13 khoá ngắn** (mỗi khoá 2–4 dòng mô
  tả) → Lộ trình mục tiêu → **Nền tảng P1** → Cơ bản→Nâng cao P2–P5 → Chuyên sâu P6. Bậc học
  P1–P6 là xương sống của môn nhưng xuất hiện ở ~60% chiều cao trang.
- "Tiến độ của bạn 0/506 bài" ở đầu trang là con số làm nản người mới (vi phạm tinh thần "kết quả
  chẩn đoán không phải màn hình chính").
- **Đề xuất:** gập danh sách khoá ngắn thành 3 khoá + "Xem 13 khoá"; đưa P1–P6 lên ngay sau "Học
  tiếp"; thêm mục lục nhảy (Học tiếp · Bậc học · Khoá ngắn · Hướng chuyên sâu) dán dưới header ở
  mobile; thay "0/506 bài" bằng tiến độ của bậc hiện tại ("Bậc P1: 0/10 bài").

### P1-3 · Trang cá nhân: 3 ô đích lặp hai lần trong hai khối cách nhau 150px

- Khối "Không gian" có Bạn Đồng Hành · Phòng Luyện Tập · Góc học tập · Ghi chú; ngay dưới, khối
  "Không Gian Chuyên Biệt (Hubs) · Platform V2" lại có Ghi chú · Góc học tập · Bạn Đồng Hành (+ Bạn
  bè · Tin nhắn). Đúng khuôn lỗi "hai khối cách nhau 40 dòng cùng nói một câu" mà Tầng 8b sinh ra để
  bắt. Mã: `apps/dhcb/src/pages/core/Profile.tsx:336-369`.
- **Đề xuất:** gộp thành một khối "Đi tới" 6 ô; bỏ nhãn `Platform V2`.

### P1-4 · Hai trang cùng in nguyên khối "Mốc từ vựng + phiên Hôm nay"

- `/goc-hoc-tap/english/lo-trinh` (tiêu đề "Học theo lộ trình") mở đầu bằng thanh Mốc từ vựng và
  tab `Hôm nay · Ôn SRS · Từ khó · Kiểm tra` kèm thẻ flashcard — y hệt phần đầu `/tu-dien`. Bản đồ
  6 bậc A1–C2 (thứ người dùng vào để xem) nằm dưới 1 màn hình. Comment ở `Learn.tsx:4` nói các tab
  "đã chuyển vào trang" từ điển nhưng thực tế vẫn dựng ở cả hai (`Learn.tsx:96` +
  `StudyPanel`).
- **Đề xuất:** Lộ trình chỉ giữ bản đồ bậc + "Bài tiếp theo"; flashcard ở một nơi duy nhất là Từ
  điển. Ở mobile thêm hàng nút A1…C2 dán trên để nhảy bậc (trang 3.784px).

### P1-5 · Thông báo mâu thuẫn trên cùng một màn hình

- Trang chủ hiện đồng thời "⚠ Chưa tải được tiến độ · Thử lại" và dải xanh "✓ Đã đồng bộ dữ liệu
  học tập thành công!". Dải xanh này bắn ở **mọi** trang trong đợt chụp (home, Tiếng Anh, chat, nói,
  viết, hồ sơ…). Changelog 0380 đã sửa nguyên nhân "đẩy lại nguyên văn bản cloud", nhưng ở môi trường
  E2E (mock `/api/progress` trả `{"ok":true}`) hàng đợi vẫn có mục → còn bắn. **Cần kiểm lại trên
  production** bằng cách mở 5 trang liên tiếp và đếm số lần dải hiện; nếu > 1 thì lỗi 0380 chưa hết.
- Dù đúng hay sai về logic, "đồng bộ thành công" là thông tin không ai cần xem — đề xuất chỉ hiện
  dải khi **offline** hoặc **cần đăng nhập lại**; thành công thì im lặng (chuẩn UX: không khen việc
  hiển nhiên).

### P1-6 · Trạng thái lỗi lộ chuỗi kỹ thuật thô

- `/ghi-chu`: "Unexpected token '<', "<!doctype "... is not valid JSON" — chuỗi từ `err.message`
  (`Notes.tsx:115`). Các nút `toast.error(err.message)` ở dòng 142–208 cũng vậy.
- **Đối chứng tốt** đã có trong app: `/goc-hoc-tap` viết "Đây là lỗi tải danh mục, không phải danh
  mục trống — các môn vẫn còn nguyên." — mẫu câu này nên là chuẩn chung.
- **Đề xuất:** một hàm `thongDiepLoiThanThien(err)` trong `core-http` (hoặc `lib/`): map lỗi mạng /
  JSON / 401 / 5xx sang câu tiếng Việt, chuỗi thô chỉ vào Sentry.

### P2-1 · Phòng luyện tập `/luyen-tap`: trang "catalog" 4 tầng, lặp với Tiếng Anh home

Sổ tay lỗi sai xuất hiện 2 lần (hero + mục 4); Từ điển · Truyện · Mẫu câu · Thử thách 1 phút lặp
lại đúng các ô "Tài nguyên & công cụ bổ trợ" ở Tiếng Anh home. Cùng một điểm đến có ≥ 3 lối vào ở 3
trang là dấu hiệu chưa chốt "trang nào là nhà của tính năng nào".

### P2-2 · Badge dài vỡ 2 dòng ở 390px

`CEFR A1–C2` (Tiếng Anh home) và `AI SOCRATIC TUTOR` (Góc học tập) gãy thành pill 2 dòng cao 44px.
Thêm `whitespace-nowrap` hoặc rút chữ (`A1–C2`, `Gia sư AI`).

### P2-3 · Không nhất quán nhỏ giữa hai trang chọn tình huống

Trò chuyện và Luyện nói dùng cùng khuôn (icon · tiêu đề · dropdown · 3 mức) nhưng nút mức đang chọn
khác gradient, và Luyện nói thiếu dòng gợi ý dưới mức ("A1–A2, câu đơn giản") mà Trò chuyện có. Nên
tách một component `ChonTinhHuong` dùng chung.

### P2-4 · Luyện viết: đếm từ đỏ "0 từ (tối thiểu 150)" khi chưa gõ chữ nào

Phản hồi tiêu cực trước khi người dùng làm gì. Chỉ tô đỏ sau khi bấm chấm hoặc sau khi đã gõ > 0 từ.

### P2-5 · Tiêu đề header dài bị cắt ở mobile

"Không Gian Môn Học & Gi…", "Bạn Đồng Hành Đa Lĩnh V…". Tiêu đề trang nên ≤ 3 từ ở header
mobile ("Góc học tập", "Bạn Đồng Hành"); phần mô tả dài để trong nội dung.

### P2-6 · Landing `/welcome` còn nói "bốn trụ khác: sự nghiệp, công việc, khởi nghiệp và đời sống"

Cùng gốc với P0-1 nhưng ở trang công khai (SEO) — sửa cùng đợt.

## 4. Những gì đã tốt, cần GIỮ

- Luồng `/bat-dau` (5 câu hỏi, thanh tiến trình, "Bỏ qua" luôn có) — gọn, đúng luật "gợi ý ĐÚNG MỘT
  việc".
- Bài học Lập trình: bố cục 3 cột (mục lục · nội dung · 6 bước), "Bước tiếp/Bài sau" rõ; đây là
  trang chín nhất về UX.
- Trang chủ: thứ tự Companion → Hôm nay → tìm kiếm → 6 môn là đúng; mobile gập "Xem tất cả (6 môn)".
- Trạng thái lỗi ở `/goc-hoc-tap` và `/nang-cap` (icon · tiêu đề · giải thích không mất dữ liệu ·
  Thử lại) là mẫu chuẩn.
- Theme `dark-blue` khớp 1:1 với `blue-sky` về bố cục (chiều cao lệch ≤ 60px, không vỡ khối).
- Đăng nhập: 4 nút OAuth nền cố định dùng đúng `text-[#fff]`, không bị đảo màu.

## 5. Đề xuất chia đợt việc (mỗi đợt một PR, có ảnh trước/sau)

| Đợt | Việc                                                                                   | Ước lượng     |
| --- | -------------------------------------------------------------------------------------- | ------------- |
| A   | P0-1 + P2-6: rút Companion/landing về 2 trụ + test canh `studioTypes`                  | nhỏ, làm ngay |
| B   | P0-2: bố cục lại Bạn Đồng Hành (avatar LITE mặc định ở mobile, chat chiếm viewport)    | vừa           |
| C   | P1-3 + P1-4 + P2-1: gỡ 3 chỗ lặp nội dung (Hồ sơ · Lộ trình · Luyện tập)               | vừa           |
| D   | P1-1 + P1-6 + P2-2..P2-5: dọn badge/thuật ngữ, thông điệp lỗi thân thiện, chi tiết nhỏ | vừa, cơ học   |
| E   | P1-2: sắp lại Lập trình home + mục lục nhảy                                            | vừa           |
| F   | P1-5: kiểm production dải "Đã đồng bộ", đổi chính sách chỉ báo khi có vấn đề           | nhỏ           |

Sau mỗi đợt: chụp lại đúng các trang chạm tới bằng công thức Tầng 8b, dán số đo chiều cao
trước/sau vào PR.

## 6. Nợ mở ghi nhận cho `PROGRESS.md`

- Chưa chấm được: bảng giá `/nang-cap` có dữ liệu, huy hiệu ở Hồ sơ, bảng Kanban Ghi chú (đều cần
  backend). Chưa chụp theme `kid` (khoá theo nhóm tuổi, cần mock profile `ageGroup`).
- Hiện tượng trang Hồ sơ hiện mờ toàn bộ trong ảnh 1440px không tái hiện được khi đo lại
  (`opacity` mọi phần tử = 1 sau 2,5s) — có thể là hoạt ảnh `animate-fade-in` chưa xong lúc chụp;
  ghi lại để lần chụp sau chờ 3s và so.
