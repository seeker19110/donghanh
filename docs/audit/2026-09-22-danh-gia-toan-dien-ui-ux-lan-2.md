# Đánh giá UI/UX toàn diện — lần 2, 2026-09-22 (sau đợt sửa 0412)

> Audit **chỉ đọc và nhìn**, không sửa code (QUY-TRINH-AUDIT §1.2). Bằng chứng là **306 ảnh chụp
> thật** (Tầng 8b) + **số đo bằng máy** (chiều cao trang đọc từ header PNG, số nút chạm nhỏ,
> lỗi JS, tràn ngang, số `<h1>`). Nhánh `claude/ui-ux-comprehensive-review-rplwjh`, gốc `0d1d6bf`
> (đã gồm PR #1117). Ảnh nằm ngoài repo (`/tmp/shots/audit2/`), repo giữ 0 file PNG.
>
> Khác lần 1 (`2026-09-22-danh-gia-sau-ui-ux.md`, 20 trang × 2 theme): lần này **51 trang × 3 theme
> (kể cả `kid`) × 2 bề rộng**, phủ toàn bộ route có giao diện riêng trong `App.tsx`, và **kiểm
> lại 6 đợt A–F của 0412 đã thật sự có hiệu lực chưa**.

## 1. Cách làm và giới hạn

- Mỗi trang chụp `fullPage` ở 1440×900 và 390×844, theme `blue-sky` · `dark-blue` · `kid`, đăng
  nhập giả bằng `mockLogin` thật (không tự gieo localStorage — bẫy đã ghi ở Tầng 8b). Thêm một
  lượt chụp **đúng khung nhìn đầu** (không `fullPage`) cho 15 trang nghi ngờ để nhìn màn hình
  đầu tiên như người dùng thấy.
- Với mỗi ảnh đo bằng máy: chiều cao trang, `scrollWidth > clientWidth` (tràn ngang), số nút/link
  có cạnh < 32px, `pageerror`, số `<h1>`.
- **Giới hạn:** không có Postgres nên mọi trang gọi API rơi vào trạng thái lỗi/rỗng — đây là cơ hội
  chấm **trạng thái lỗi** (mục 4.3 CLAUDE.md) nhưng KHÔNG chấm được nội dung có dữ liệu (bảng
  giá, Kanban có thẻ, hội thoại thật). `/login` không chụp được vì `mockLogin` tự chuyển về `/`
  (lần 1 đã chấm trang này, không đổi từ đó). `kid` chỉ đổi bảng màu — xem 3.2.

## 2. Kết quả máy đo (theme `blue-sky`; `dark-blue`/`kid` lệch ≤ 60px, không ảnh nào tràn ngang, 0 lỗi JS)

| Trang                             |      1440px |       390px | Số màn 390 | Ghi chú                                                  |
| --------------------------------- | ----------: | ----------: | ---------: | -------------------------------------------------------- |
| **Luyện nghe** `/luyen-nghe`      |  **24.893** |  **74.309** |     **88** | 1.000 thẻ mẫu câu in phẳng, không tìm kiếm, không nhóm   |
| **Truyện song ngữ** `/truyen`     |   **8.742** |  **17.456** |     **21** | ~65 truyện, có 3 hàng lọc nhưng không "xem thêm"/đếm     |
| Lộ trình A1 `/lo-trinh/A1`        |       5.265 |       6.229 |        7,4 | có "Mục lục 13 phần" gập + "Học tiếp" — chấp nhận được   |
| 14 hướng `/programming/huong`     |       2.405 |       4.556 |        5,4 | không đổi từ lần 1, mobile chưa có mục lục nhảy          |
| Lập trình home                    |       2.770 |       4.362 |        5,2 | đợt E có hiệu lực: mục lục 4 mỏ neo, bậc P1–P6 lên trước |
| Giới thiệu nền tảng `/gioi-thieu` |       1.843 |       2.779 |        3,3 | trang chữ, đọc trôi                                      |
| Phòng luyện tập `/luyen-tap`      |       1.582 |       3.154 |        3,7 | vẫn là catalog 4 tầng (nợ 0412 mục 2)                    |
| Lộ trình Tiếng Anh `/lo-trinh`    |       1.518 |       3.133 |        3,7 | đợt C có hiệu lực (tab flashcard đã gỡ)                  |
| Hồ sơ                             |       2.004 |       2.712 |        3,2 | đợt C có hiệu lực (1 khối "Không gian")                  |
| Tiến độ `/tien-do`                |         992 |       2.378 |        2,8 | 5 thẻ môn cùng một câu "Chưa đo được…"                   |
| Cài đặt `/cai-dat`                |       1.682 |       1.994 |        2,4 |                                                          |
| Trang chủ · Tiếng Anh home        | 1.615/1.009 | 1.771/1.577 |      ≤ 2,1 | không đổi so với lần 1 (±6px) — đối chứng tốt            |
| Bạn Đồng Hành                     |       1.082 |       1.201 |        1,4 | đợt B có hiệu lực (ô nhập trong màn hình đầu ở mobile)   |
| 30 trang còn lại                  |   900–1.251 |   844–1.606 |      ≤ 1,9 | 1–2 màn hình, phần lớn là trạng thái lỗi/rỗng            |

Nút chạm nhỏ hơn 32px ở 390px: `/cau-thong-dung` 5 · `/cai-dat` 4 · `/action-canvas` 4 · các trang
khác ≤ 2 (cần soi tay xem có phải nút thật hay icon trang trí — chưa kết luận). Trang Vật lý/Toán
ở trạng thái lỗi **không có `<h1>`** và header trống (xem P2-2).

## 3. Phát hiện — xếp theo mức ảnh hưởng

Thang như lần 1: **P0** chặn/đánh lừa · **P1** làm khó rõ rệt · **P2** độ bóng.

### 3.1 Kiểm lại 6 đợt A–F của 0412 — kết quả

| Đợt | Nội dung                                    | Kết quả nhìn ảnh                                                                        |
| --- | ------------------------------------------- | --------------------------------------------------------------------------------------- |
| A   | Companion về 2 trụ                          | ✅ chip `Tự động · Học tập · Ghi chú`, lời chào không nhắc trụ đã gỡ                    |
| B   | Companion ưu tiên chat ở mobile             | ✅ ô nhập ở y≈650/844; ❌ desktop còn lỗi mới, xem **P1-1**                             |
| C   | Gỡ 3 chỗ lặp (Hồ sơ · Lộ trình · Luyện tập) | ✅ Hồ sơ và Lộ trình; Luyện tập vẫn là catalog (đã ghi nợ)                              |
| D   | Dọn badge, lỗi thân thiện                   | ✅ Ghi chú, Góc học tập, Vật lý hiện câu lỗi chuẩn; ❌ còn nhiều nơi khác, xem **P1-3** |
| E   | Lập trình home                              | ✅ 4.362px, mục lục nhảy, "Bậc P1: 0/10 bài · cả môn 0/506"                             |
| F   | Dải "Đã đồng bộ"                            | ✅ không thấy dải ở bất kỳ ảnh nào trong 306 ảnh                                        |

### P0-1 · Luyện nghe tab "Câu thông dụng": 1.000 thẻ in phẳng, trang cao 74.309px ở mobile

- **Thấy ở:** `/goc-hoc-tap/english/luyen-nghe` mọi theme. 88 màn hình cuộn; không ô tìm kiếm,
  không nhóm theo chủ đề/cấp, không phân trang, không mục lục. Ở 1440px là 3 cột × 334 hàng.
- **Mã:** `apps/dhcb/src/pages/subjects/english/Listening.tsx:134-149` — `index.map(...)` thẳng
  từ `public/data/patterns/index.json` (1.000 mục). Tab "Hội thoại" bên cạnh ĐÃ có `TocRail` theo
  cấp (dòng 226-245) nhưng chỉ ở desktop.
- **Vì sao P0:** vượt xa ngưỡng Tầng 8b (3–4 màn hình phải có đường tắt) gấp 20 lần; đây đúng lỗi
  "lưới trông bình thường ở dòng mã" mà Tầng 8b sinh ra để bắt. Người dùng mobile không thể tới
  mẫu câu thứ 500.
- **Đề xuất:** (1) ô tìm kiếm + nhóm theo `meta.category` (đã có trường này) thành các mục gập,
  mặc định mở 1 nhóm; (2) "Tiếp tục" mẫu đang học ở đầu như `/cau-thong-dung` đang làm rất tốt;
  (3) mobile: thanh nhảy nhóm dán dưới header. Test canh: chiều cao 390px ≤ 4 màn hình.

### P0-2 · Trang bán VIP mô tả tính năng bằng thuật ngữ kỹ thuật, có mục chưa kiểm chứng

- **Thấy ở:** `/nang-cap` (ảnh 390 và 1440). Ba gạch đầu dòng VIP: "Đàm thoại song công Gemini
  Live Full-Duplex & Phòng học nhóm âm thanh" · "Cung điện Trí nhớ Không gian 3D (Memory Palace
  Loci)" · "300 lượt AI/ngày + Trọn bộ 14 giọng Chirp3-HD + 2 giọng Studio".
- **Mã:** `apps/dhcb/src/components/UpgradeSection.tsx:60-75`.
- **Vì sao P0:** đây là trang duy nhất người dùng quyết định trả tiền; câu chữ phải nói lợi ích
  ("Nói chuyện trực tiếp với gia sư, ngắt lời được như người thật"). Nghiêm trọng hơn:
  `PROGRESS.md` nợ 15 ghi Gemini Live "CHƯA test với API key thật" — trang bán đang **hứa thứ
  chưa kiểm chứng**. Đợt D (0412) dọn badge ở trang học nhưng bỏ sót trang bán.
- **Đề xuất:** viết lại 3 dòng theo lợi ích; **gỡ hoặc ghi "sắp có"** với Gemini Live cho tới khi
  nợ 15 đóng; thêm dòng so sánh cụ thể nhất ("Free 30 lượt/ngày → VIP 300"). Cần chủ dự án chốt
  câu chữ vì đụng thanh toán (CLAUDE.md mục 12).

### P1-1 · Companion desktop: ô nhập cố định đè lên hàng gợi ý nhanh

- **Số đo (1440×900, cả 3 theme):** khung avatar 3D chiếm y=190–505 (315px), tin nhắn chào bắt
  đầu y=630, hàng gợi ý nhanh ("Hôm nay học gì trong 10 phút?", "Đặt mục tiêu IELTS 7.0") ở
  y≈826 bị ô nhập (y=840–890) **che mất nửa dưới** — chữ gợi ý bị cắt, không bấm được trọn.
- **Nguyên nhân:** đợt B chuyển gợi ý vào trong luồng tin nhắn nhưng vùng cuộn không chừa đủ
  `padding-bottom` bằng chiều cao ô nhập ở desktop (mobile đã có `pb-[calc(0.5rem+var(--bnav-h))]`).
- **Đề xuất:** vùng tin nhắn `flex-1 min-h-0 overflow-y-auto` + `padding-bottom` = chiều cao ô
  nhập; ở desktop avatar 3D mặc định thu về 200px hoặc ngang hàng với chat (2 cột) để tin nhắn
  đầu nằm trong màn hình đầu. Kèm test E2E: gợi ý nhanh `toBeInViewport()` ở 1440.

### P1-2 · Trang Nhiệm vụ nói "Đăng nhập để xem" với người ĐÃ đăng nhập khi API lỗi

- **Thấy ở:** `/nhiem-vu` (và khối Nhiệm vụ trong Hồ sơ). Người dùng mock đã đăng nhập, API lỗi,
  màn hình chỉ có "Đăng nhập để xem nhiệm vụ nhé." — thông điệp sai nguyên nhân, người dùng sẽ đi
  đăng nhập lại vô ích.
- **Mã:** `apps/dhcb/src/components/QuestsPanel.tsx:122-128` — nhánh `!status` gộp cả "chưa đăng
  nhập" lẫn "tải lỗi".
- **Đề xuất:** tách hai nhánh; lỗi tải dùng khối lỗi chuẩn (icon · "Không tải được nhiệm vụ" ·
  "Nhiệm vụ của bạn vẫn còn nguyên" · Thử lại) như Ghi chú/Góc học tập đang làm.

### P1-3 · Thuật ngữ kỹ thuật/tiếng Anh vẫn còn ở 5 chỗ người học nhìn thấy mỗi ngày

Đợt D dọn ~20 badge, còn sót các cụm sau (nguyên văn trên ảnh):

| Nơi                        | Chữ trên màn hình                                                                                           | Mã                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Companion, 5 tab đầu trang | `Đối thoại & Voice` · `Nhận thức & Ký ức` · `Đấu trường & Labs` · `Tự trị & Lộ trình` · `Tổng hợp & Studio` | `CompanionStudios/studioTypes.ts:74-78`              |
| Companion, bong bóng chat  | badge `general`; "(Personal Companion)"                                                                     | `pages/companion/Companion.tsx`                      |
| Góc học tập, Trang chủ     | `MỚI: REAL-LIFE LAB` · `10 Simulators` · `Socratic & Trí nhớ`                                               | `pages/learning/Subjects.tsx`, `pages/core/Home.tsx` |
| Cài đặt, chọn giọng        | `Kore · Aoede · Leda · Zephyr · Puck · Charon · Fenrir …` (16 tên giọng Google)                             | `pages/subjects/english/EnglishSettings.tsx`         |
| Phòng luyện tập            | `Elo` · `Socratic` · `Echo Shadowing (Nói Đè)` · `Dictation`                                                | `pages/learning/practice/*`                          |

- **Đề xuất:** đặt tên 5 tab Companion theo việc người dùng làm ("Trò chuyện · Ghi nhớ · Thử
  thách · Kế hoạch · Tổng kết"); giọng đọc hiện "Giọng nữ 1/2/3…" kèm nút nghe thử, tên Google giữ
  ở `title`; mở rộng `UiNoise.design.test.ts` (đã có) thêm danh sách từ cấm trên để chặn tái phát.

### P1-4 · Trạng thái "lỗi im lặng": khung xám vĩnh viễn ở Hồ sơ, tab đếm `(0)` khi đang lỗi

- **Hồ sơ 1440/390:** hai khối "Mời bạn cùng học" và "Người thân theo dõi" hiện **khung xám trống**
  (skeleton) suốt thời gian chụp (> 3s sau khi DOM ổn định), không chữ, không nút.
  `ReferralSection.tsx:14-24` chỉ có `.then`, không có nhánh timeout; khi request treo thì skeleton
  treo theo. Kết luận cần thêm một lần nhìn tay trên production — nhưng dù nguyên nhân là gì,
  **một khối không bao giờ nói "đang tải" hay "lỗi" là lỗi UX**.
- **Ghi chú 1440:** 4 tab `Công việc (0) · Dự án (0) · Cuộc họp (0) · Ghi chú (0)` hiện số 0 ngay
  cạnh khối "Không tải được dữ liệu" — hai thông tin mâu thuẫn trên cùng màn hình (cùng khuôn với
  P1-5 lần 1). Ẩn số đếm khi đang lỗi/đang tải.
- Huy hiệu 0/19 hiện 19 icon xám không chú thích "chưa đạt" — chấp nhận được nhưng nên có 1 dòng.

### P1-5 · Truyện song ngữ: 17.456px ở mobile, lọc có nhưng không rút ngắn được

- ~65 thẻ truyện, 3 hàng chip lọc (thể loại · cấp · quốc gia). Không có số kết quả, không "xem
  thêm", không "tiếp tục truyện đang đọc" ở đầu. Ở mobile phải cuộn 21 màn hình để thấy truyện cuối.
- **Đề xuất:** hiện 12 thẻ + "Xem thêm (53)"; thẻ "Đọc tiếp: <truyện gần nhất>" ở đầu; đếm
  "65 truyện" cạnh bộ lọc.

### P2-1 · Câu lặp nguyên văn nhiều lần trong một trang

- Lập trình home: "Còn 7 bài ở P1 nữa là mở — đã xong 0/7 bài cần thiết." in **5 lần** (P2–P6).
  Nên chỉ in ở bậc kế tiếp, các bậc sau chỉ "Mở sau P2".
- Tiến độ: "Chưa đo được — môn này chưa có bằng chứng hoàn thành nào trên thiết bị/tài khoản hiện
  tại." in **5 lần** (5 môn); từ "bằng chứng" là ngôn ngữ đặc tả, không phải của người học. Gộp
  thành một dòng chú thích + thẻ môn chỉ ghi "Chưa bắt đầu".
- "Mẹo kiếm huy hiệu & thưởng nhanh nhất" hiện ở CẢ Trang chủ lẫn Tiếng Anh home (cùng nội dung,
  cùng phiên); nút ✕ đóng một nơi nên đóng cả hai.

### P2-2 · Trạng thái lỗi làm rỗng header

Vật lý/Toán (`/goc-hoc-tap/:subjectId`) khi API lỗi: header chỉ còn mũi tên quay lại, **không tiêu
đề, không `<h1>`** (máy đo: `h1=[]`). Tin nhắn `/tin-nhan` header cũng trống dù trang có tiêu đề
"Tin nhắn" trong thân. Header nên luôn có tên trang, lấy từ route chứ không chờ dữ liệu.

### P2-3 · 14 hướng chuyên sâu ở mobile chưa có mục lục nhảy (4.556px)

Desktop có; mobile chỉ cuộn. Áp cùng công thức đợt E (hàng chip mỏ neo `scroll-mt-20`).

### P2-4 · Cài đặt: tiêu đề "Cài đặt học Tiếng Anh" nhưng chứa cài đặt nền tảng

Ngôn ngữ giao diện, nhóm tuổi, giọng đọc "áp dụng cho cả app" nằm dưới tiêu đề của một môn. Nên
tách "Cài đặt chung" (ngôn ngữ · nhóm tuổi · giao diện · âm thanh) và "Cài đặt môn Tiếng Anh"
(tốc độ từ mới · chiều học · giọng giải thích).

### P2-5 · Theme `kid` chỉ đổi màu, không đổi nội dung

Ảnh `home--kid--390`: bảng màu vàng cam hợp lệ, tương phản đạt (cổng a11y đã quét), nhưng vẫn
"Ghi chú — việc cần làm, dự án, biên bản họp và tài liệu", "Nâng cấp", chip "Socratic & Trí nhớ".
Nếu `kid` khóa theo nhóm tuổi <10 thì ít nhất Trang chủ nên ẩn Ghi chú/Nâng cấp và dùng câu ngắn.
Đây là câu hỏi sản phẩm, cần chủ dự án quyết.

## 4. Những gì tốt, cần GIỮ (bằng chứng từ ảnh)

- **Khối lỗi chuẩn** (icon · tiêu đề · giải thích không mất dữ liệu · Thử lại) đã nhất quán ở Ghi
  chú, Góc học tập, Vật lý, Nâng cấp — đợt D thành công ở các trang này.
- `/cau-thong-dung`: "Tiếp tục: I am" ở đầu + chip lọc + **ô tìm kiếm dán đáy** trên mobile — đây
  là mẫu để sửa P0-1.
- Lộ trình A1: "Học tiếp · Phần 1", "Mục lục 13 phần" gập, tiến độ hai thanh — bố cục đọc được
  ngay dù trang dài.
- Lập trình home sau đợt E: "Học tiếp" chiếm màn hình đầu, mục lục 4 mỏ neo, thứ tự đúng.
- Trạng thái rỗng `/tin-nhan` ("Chưa có tin nhắn nào" + nút "Xem danh sách bạn bè") là mẫu rỗng
  tốt: nói việc kế tiếp thay vì chỉ thông báo.
- 306 ảnh: **0 tràn ngang, 0 lỗi JS, 3 theme khớp bố cục**. Đây là nền vững để sửa nội dung.

## 5. Đề xuất chia đợt (mỗi đợt một PR, có ảnh trước/sau theo Tầng 8b)

| Đợt | Việc                                                                                        | Ước lượng      |
| --- | ------------------------------------------------------------------------------------------- | -------------- |
| G   | P0-1 Luyện nghe: tìm kiếm + nhóm theo chủ đề + "Tiếp tục"; test canh chiều cao              | vừa            |
| H   | P0-2 trang VIP: viết lại 3 dòng + gỡ/đánh dấu "sắp có" Gemini Live — **chủ dự án chốt chữ** | nhỏ, cần duyệt |
| I   | P1-1 Companion desktop + P1-2 Nhiệm vụ + P1-4 lỗi im lặng (3 lỗi trạng thái)                | vừa            |
| K   | P1-3 thuật ngữ đợt 2 + mở rộng `UiNoise.design.test.ts`                                     | vừa, cơ học    |
| L   | P1-5 Truyện + P2-3 14 hướng mobile: "xem thêm"/mục lục nhảy                                 | nhỏ            |
| M   | P2-1 · P2-2 · P2-4: câu lặp, header rỗng, tách cài đặt                                      | nhỏ            |

P2-5 (theme `kid`) tách riêng thành câu hỏi sản phẩm, không gộp vào đợt code.

## 6. Nợ ghi vào `PROGRESS.md`

- Chưa chấm được với dữ liệu thật: bảng giá, Kanban có thẻ, Hồ sơ có huy hiệu, Companion có lịch
  sử, `/login`. Cần một lượt chụp trên production hoặc mock API đầy đủ hơn.
- Số nút chạm < 32px (5 ở Câu thông dụng, 4 ở Cài đặt, 4 ở Action canvas) chưa soi tay từng nút.
- Nguyên nhân skeleton treo ở Hồ sơ (P1-4) chưa chứng minh bằng mã — cần một lần nhìn production.
