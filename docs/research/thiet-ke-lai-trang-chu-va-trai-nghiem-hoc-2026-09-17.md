# Thiết kế lại Trang chủ & trải nghiệm học cốt lõi — "Đồng Hành Cùng Bạn"

**Ngày:** 2026-09-17 · **Loại:** đặc tả thiết kế UI/UX (research) · **Trạng thái:** bản đề xuất,
chờ chủ dự án duyệt từng lát (P0 → P1 → P2). **Chưa** "Approved for implementation".

> Tài liệu này viết cho cả Designer lẫn Developer. Mọi đề xuất đều đối chiếu với mã THẬT đang
> chạy (đường dẫn file ghi kèm) để lát nào cũng thi hành được bằng React 18 + Tailwind 3 hiện
> có, không đổi stack, không đổi token hệ thống ngoài chỗ ghi rõ.

## 0. Hiện trạng đã đọc (căn cứ của mọi đề xuất)

| Vùng                         | Mã hiện tại                                                                                                                                                                                                              | Nhận xét                                                                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trang chủ                    | `apps/dhcb/src/pages/core/Home.tsx`: `FirstTaskCard` → `HomeAiBriefingCard` → `TodayCard` → `HomeUniversalAiBar` → thẻ "quay lại" → `RewardTipBanner` → danh sách 6 môn + 2 trụ (`SUBJECT_ENTRIES`)                      | Nền tảng ĐÃ tốt: một CTA (`TodayCard` ba luật), không mặc định tiếng Anh. Vấn đề: 4 khối xếp dọc cùng trọng lượng, mắt không biết dừng ở đâu; "Hôm nay" nằm ở khối thứ 3 chứ không phải thứ 1. |
| Lời chào AI                  | `components/Home/HomeAiBriefingCard.tsx` — icon `Bot`, chữ "Chào buổi sáng", bản tin từ `/api/proactive-briefing`                                                                                                        | Giọng có nhưng HÌNH không có: Companion là một icon robot trong thẻ xám, không có danh tính, không có "trạng thái".                                                                            |
| Sidebar desktop              | `components/DesktopSidebar.tsx`: 5 mục chính (Trang chủ · Góc học tập ▾ · Ôn tập · Bạn Đồng Hành · Luyện tập) + 2 studio (Sự nghiệp · Công việc & Đời sống) + 3 đáy (Tiến độ · Nâng cấp · Hồ sơ) = **10 mục + nhóm con** | Nhiều hơn 7±2; "Nâng cấp" màu amber nổi hơn cả "Góc học tập"; "Ôn tập" và "Luyện tập" cạnh nhau gây nhầm.                                                                                      |
| Bottom nav mobile            | `components/BottomNav.tsx`: 5 tab, tab giữa là Orb "Đồng Hành" nhô lên                                                                                                                                                   | Cấu trúc đúng; giữ. Cần đồng bộ nhãn với sidebar và bớt hiệu ứng scale.                                                                                                                        |
| Header                       | `components/Layout.tsx`: 8 khe trong 56px (Back · Studio · breadcrumb¹ · title · streak · extra · AI · theme · avatar); cờ `focus` ẩn 2 khe                                                                              | Trên 390px là chật thật. ¹ Breadcrumb vừa gỡ ở changelog 0359.                                                                                                                                 |
| Khách vãng lai               | `components/GuestBanner.tsx` dải mỏng + `/bat-dau` (`StartByIntent`) 5 câu ≤ 90 giây                                                                                                                                     | Luồng 5 câu tốt; vấn đề là trang chủ khách KHÔNG chỉ vào nó đủ mạnh, và `Home` trả `null` khi `!user`.                                                                                         |
| Streak / nhiệm vụ / huy hiệu | streak: huy hiệu nhỏ ở header (`getStreak`); nhiệm vụ: `/nhiem-vu` (`QuestsPanel`); mừng: `StreakCelebration`, `WeeklyGoalCelebration`, `Celebration`                                                                    | Rải ở 3 nơi, không có "bảng điều khiển nhịp học" nào trên trang chủ.                                                                                                                           |
| Theme & token                | `packages/core-ui/theme.ts`: `blue-sky` (mặc định) · `dark-blue` · `kid`; token `--a-*` (accent) · `--z-*` (nền/chữ); font Inter Variable; bo góc `--r-*`                                                                | Giữ nguyên hệ token, chỉ THÊM 1 nhóm token "ấm" cho Companion (mục A2).                                                                                                                        |

**Luật sản phẩm KHÔNG được vi phạm** (từ `CLAUDE.md` + `docs/research/luong-nguoi-moi-ho-so-nang-luc-an-2026-08-23.md`):

1. Kết quả chẩn đoán KHÔNG bao giờ là màn hình chính; không con số năng lực (band, %, bậc) rò lên
   giao diện chọn việc.
2. Không mặc định tiếng Anh — mọi môn bình đẳng ở lối vào.
3. Tương phản: nội dung/tiêu đề AAA (≥ 7:1), thành phần khác AA; vùng chạm ≥ 44px; 5 theme → nay
   3 theme đều phải đạt.
4. Một CTA chính trên màn hình chọn việc (ba luật của `TodayCard`).

---

## A. Thông tin tổng quan

### A1. Phong cách thiết kế: "Warm Utility" (tiện ích ấm)

**Đề xuất:** giữ khung _clean/utility_ hiện có (card, token, Inter) nhưng thêm **một lớp ấm có chủ
đích** ở đúng những chỗ Companion hiện diện: màu nhấn ấm phụ, hình khối mềm, chuyển động chậm-ngắn
và ngôn ngữ nói chuyện ngôi thứ nhất.

**Vì sao không chọn hai cực kia:**

- _Duolingo-style (game hoá đậm, mascot lớn, màu bão hoà):_ hợp trẻ em; người 18–35 học nghề/thi
  cử dễ thấy "trẻ con", và mâu thuẫn với luật "chẩn đoán không phải bảng điểm con người".
- _Notion/Linear-style (đơn sắc, lạnh, dày đặc):_ chuyên nghiệp nhưng chính là cái "lạnh như tool
  AI" mà đề bài muốn tránh.

**Warm Utility = 80% nền tiện ích trung tính + 20% "hơi ấm" tập trung vào Companion.** Quy tắc
đo được: trên một màn hình, tối đa MỘT vùng dùng màu ấm (Companion) và MỘT nút màu accent chính.
Mọi thứ khác là trung tính.

### A2. Bảng màu

Hệ token hiện có (`apps/dhcb/src/index.css`, `packages/core-ui/theme.css`) **giữ nguyên**. Chỉ
THÊM một nhóm token `--w-*` (warm) cho Companion, khai báo đủ 3 theme. Không hard-code màu ở
component.

| Vai trò                     | Token                          | Blue sky (mặc định)   | Xanh đêm                 | Ghi chú                                                        |
| --------------------------- | ------------------------------ | --------------------- | ------------------------ | -------------------------------------------------------------- |
| Primary (hành động chính)   | `--a-500` / `accent-500`       | như hiện tại (sky)    | như hiện tại             | Nút CTA duy nhất, tab active                                   |
| Secondary (nền thẻ, viền)   | `--z-800/900`, `line-subtle`   | như hiện tại          | như hiện tại             | Không đổi                                                      |
| **Warm accent (Companion)** | `--w-500` (MỚI)                | `#d97706` (amber-600) | `#fbbf24` (amber-400)    | Chỉ dùng cho avatar Companion, bong bóng lời chào, vòng streak |
| Warm surface                | `--w-50` (MỚI)                 | `#fffbeb`             | `rgb(251 191 36 / 0.08)` | Nền bong bóng Companion                                        |
| Success (đúng / hoàn thành) | `emerald-*` hiện có            | giữ                   | giữ                      | Màu ngữ nghĩa, không đổi                                       |
| Background                  | `--z-950` / `bg-zinc-950`      | `#f0f9ff`             | `#0b1226`                | Không đổi                                                      |
| Text content (AAA)          | `content`, `content-secondary` | giữ                   | giữ                      | Tiêu đề & nội dung                                             |
| Text muted (AA)             | `content-muted`                | giữ                   | giữ                      | Nhãn/chú thích, KHÔNG dùng cho nội dung                        |

**Kiểm chứng bắt buộc trước khi merge token mới:** `scripts/fixed-color-contrast-audit.ts` +
`e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts` ở cả 3 theme. Chữ trên `--w-50` phải là
`content` (không phải chữ amber) để đạt AAA.

### A3. Typography

Giữ **Inter Variable** (đã nạp, đã tối ưu bundle). Chỉ chuẩn hoá **thang 5 bậc** để mọi trang
dùng chung, chấm dứt tình trạng mỗi thẻ một cỡ:

| Bậc     | Class Tailwind                                  | Dùng cho                                    |
| ------- | ----------------------------------------------- | ------------------------------------------- |
| Display | `text-2xl sm:text-3xl font-bold tracking-tight` | Lời chào Companion (1 dòng), tiêu đề trang  |
| Title   | `text-lg font-semibold`                         | Tiêu đề thẻ ("Hôm nay", tên môn)            |
| Body    | `text-base leading-relaxed`                     | Nội dung đọc, bản tin Companion             |
| Label   | `text-sm font-medium`                           | Nút phụ, tab, nhãn                          |
| Caption | `text-xs text-content-muted`                    | Dòng nguồn ("Phiên đang dở · 5 phút trước") |

Số (streak, đếm) dùng `tabular-nums` để không nhảy layout khi đổi.

### A4. Nguyên tắc thiết kế cốt lõi

1. **Một việc, một nút.** Mỗi màn hình có đúng một CTA chính, nhìn từ 1 mét vẫn thấy. (Đã là luật
   `TodayCard`; nay nâng thành luật toàn trang chủ.)
2. **Companion là NGƯỜI, không phải widget.** Có mặt (avatar), có trạng thái (đang nghĩ / vui /
   nhắc nhẹ), có giọng nhất quán (ngôi "mình – bạn"), và không bao giờ chỉ là ô chat.
3. **Tiến bộ kể bằng chuyện, không bằng phần trăm.** "Bạn đã nói được 3 câu hoàn chỉnh hôm qua"
   thay cho "62%". Con số chỉ xuất hiện khi nó là hành động (còn 5 thẻ cần ôn).
4. **Nhịp trước, thành tích sau.** Streak/nhiệm vụ phục vụ việc _quay lại ngày mai_, không phải
   khoe. Không bao giờ phạt bằng hình ảnh (streak đứt = màu xám nhẹ, không lửa tắt đỏ).
5. **Mobile là bản gốc, desktop là bản mở rộng.** Mọi khối thiết kế cho 390px trước, desktop chỉ
   sắp lại cột, không thêm nội dung mới.
6. **Chữ ít, đọc được từ xa.** Mỗi thẻ ≤ 2 dòng chữ phụ; nội dung AAA.

---

## B. Cấu trúc trang chủ mới

### B0. Sơ đồ tổng

**Mobile (390px) — một cột, thứ tự theo trọng lượng:**

```
┌──────────────────────────────────────┐
│ ☰  Đồng Hành          🔥7   [◯ avatar] │  Header 56px, 4 khe (mục E1)
├──────────────────────────────────────┤
│ (◕‿◕) "Chào buổi sáng, Minh.          │  B2 Companion greeting
│        Hôm qua bạn dừng ở câu 4 —      │  (bong bóng nói, 2 dòng max)
│        mình để sẵn ở đây."   [🔊]      │
├──────────────────────────────────────┤
│ HÔM NAY                               │  B3 Today — CTA DUY NHẤT
│ ┌──────────────────────────────────┐ │
│ │ ▶ Tiếp tục: Hội thoại "Ở quán cà │ │  nút 68px, accent-500
│ │   phê" · còn ~6 phút             │ │
│ └──────────────────────────────────┘ │
│  Phiên đang dở · 5 phút trước         │  caption nguồn
│  · Ôn 5 thẻ    · Khám phá môn khác    │  2 việc phụ, chữ nhỏ
├──────────────────────────────────────┤
│ ● ● ● ● ○ ○ ○   Tuần này 4/7 ngày     │  B4 Nhịp học (streak tuần)
│ 🎯 Nhiệm vụ: 1/3 · Huy hiệu mới ✦     │  (một hàng, bấm mở /nhiem-vu)
├──────────────────────────────────────┤
│ 🔍 Hỏi Bạn Đồng Hành bất cứ điều gì… 🎤│  B5 Ask bar
│ [Giải thích bài này] [Tạo lịch tuần]  │  chip gợi ý theo ngữ cảnh
├──────────────────────────────────────┤
│ KHÔNG GIAN HỌC                        │  B6 Danh sách môn
│ ┌ 🎓 Tiếng Anh    đang học · A2 ─►  ┐ │  (môn đang học lên đầu,
│ ┌ </> Lập trình   đang học · P1 ─►  ┐ │   có dòng "đang học")
│ ┌ ∑  Toán         chưa bắt đầu ─►   ┐ │
│ … Xem tất cả 6 môn · Sự nghiệp · Đời sống │
├──────────────────────────────────────┤
│ 💡 Mẹo nhỏ / khuyến mãi (1 thẻ, đóng được) │  B7 phụ
└──────────────────────────────────────┘
│ 🏠   📚   (◕)   🏋   👤               │  Bottom nav (mục E2)
```

**Desktop (1440px) — sidebar 240px + cột chính 720px + cột ngữ cảnh 320px:**

```
┌────────┬──────────────────────────────────┬────────────────────┐
│ SIDEBAR│ Companion greeting (B2, ngang)    │ Nhịp học (B4)      │
│ 7 mục  ├──────────────────────────────────┤ ● ● ● ● ○ ○ ○      │
│        │ HÔM NAY (B3) — thẻ lớn, CTA 68px  │ streak · nhiệm vụ  │
│        │                                  │ · huy hiệu gần nhất│
│        ├──────────────────────────────────┼────────────────────┤
│        │ Ask bar (B5)                      │ Tiến bộ kể chuyện  │
│        ├──────────────────────────────────┤ (B7: 3 dòng "bạn   │
│        │ KHÔNG GIAN HỌC (B6) — lưới 2 cột  │  đã…")             │
│        │                                  ├────────────────────┤
│ ─────  │                                  │ Mẹo / promo (1)    │
│ Tiến độ│                                  │                    │
│ Hồ sơ  │                                  │                    │
└────────┴──────────────────────────────────┴────────────────────┘
```

Bố cục desktop dùng đúng `TwoPane` + `PageShell` đã có trong `Home.tsx` (không render trùng,
quyết định bằng `useIsDesktopViewport`).

### B1. Header / Navigation

- **Mục đích:** định vị + 2 tín hiệu nhịp (streak, avatar). Không phải nơi đặt hành động.
- **Nội dung:** logo chữ "Đồng Hành" (mobile) hoặc trống (desktop có sidebar) · huy hiệu streak ·
  avatar. Nút "Đồng Hành AI" ở header **bỏ trên trang chủ** (đã có Orb ở bottom nav và Ask bar —
  ba lối vào cùng một màn là thừa, cùng lý do changelog 0262 gỡ banner).
- **Hierarchy:** tất cả là Label; không có gì trong header lớn hơn lời chào Companion bên dưới.
- **Interaction:** bấm streak → mở panel B4 (không rời trang). Chi tiết mobile ở E1.

### B2. Companion greeting (vùng chào)

- **Mục đích:** tạo cảm giác "có người đang chờ mình" trong 2 giây đầu. Đây là chỗ DUY NHẤT dùng
  token `--w-*`.
- **Nội dung:** avatar Companion 48px (mobile) / 64px (desktop) có **trạng thái** (mục D3) +
  bong bóng lời chào **tối đa 2 dòng** dựng từ `fetchProactiveBriefing` hiện có, kèm nút 🔊 (TTS
  đã có `speak`). Câu chào theo khuôn: _[chào theo giờ], [tên]. [một sự thật cụ thể về hôm qua/
  hôm nay]._ Ví dụ: "Chào buổi tối, Lan. Hôm qua bạn ôn 12 thẻ đúng 10 — mình nhớ hai thẻ còn lại."
- **Hierarchy:** Display cho dòng chào; Body cho dòng sự thật. Bong bóng nền `--w-50`, chữ
  `content`.
- **Interaction:** bấm avatar → sang `/ban-dong-hanh`; bấm 🔊 → đọc. Không có nút thứ ba.
- **Thay thế:** `HomeAiBriefingCard` (giữ logic, đổi vỏ). Luật cũ giữ nguyên: thẻ này **không**
  quyết định việc học.

### B3. "Hôm nay" — CTA chính

- **Mục đích:** trả lời câu hỏi duy nhất người dùng có khi mở app: "giờ làm gì?".
- **Nội dung:** giữ nguyên `TodayCard` ba luật. Thay đổi trình bày: nút chính cao 68px, chữ Title,
  màu `accent-500`, có **ước lượng thời gian** ("còn ~6 phút") lấy từ `TodayItem` nếu có; caption
  nguồn giữ nguyên; 2 việc phụ thành chữ liên kết nhỏ, không phải nút.
- **Hierarchy:** đây là phần tử có tương phản và diện tích lớn nhất màn hình. Companion greeting ở
  trên **không** được có nút cùng màu.
- **Interaction:** một chạm → vào phiên học (không màn trung gian). Khi vào phiên, thẻ này là
  nguồn `returnTo` để màn "sau phiên" (C5) quay về đúng chỗ.
- **Vị trí:** kéo lên **ngay dưới greeting**, trên Ask bar (hiện Ask bar và Today ngang trọng
  lượng; Ask bar là hành động thứ cấp).

### B4. Nhịp học (streak · nhiệm vụ · huy hiệu) — MỚI

- **Mục đích:** gom 3 thứ đang rải (header, `/nhiem-vu`, celebration) thành một hàng "bạn đang
  đi đều".
- **Nội dung:** 7 chấm tuần (● đã học, ○ chưa, ◐ hôm nay chưa xong, ▢ "đóng băng" nếu có Streak
  Freeze) + "Tuần này 4/7 ngày" + nhiệm vụ đang mở (1/3) + huy hiệu gần nhất (icon nhỏ). Tối đa
  1 hàng mobile, 1 thẻ desktop.
- **Hierarchy:** Label/Caption. Cố ý NHỎ hơn Today — nhịp là nền, việc là chính.
- **Interaction:** bấm → mở `/nhiem-vu` (giữ route). Hoàn thành nhiệm vụ trong ngày → chấm hôm
  nay chuyển ● với animation `pop-correct` đã có.
- **Nguồn dữ liệu:** `getStreak`, `QuestsPanel` data, không thêm API mới ở P0.

### B5. Ask bar + gợi ý nhanh

- **Mục đích:** hỏi bất cứ gì, mọi môn (giữ `HomeUniversalAiBar`).
- **Nội dung:** ô nhập 1 dòng + mic + **2–3 chip gợi ý theo ngữ cảnh** (từ `todayPlan`: "Giải
  thích bài đang dở", "Tạo lịch tuần này", "Tôi có 10 phút, học gì?").
- **Hierarchy:** Label. Viền `line-subtle`, không nền màu.
- **Interaction:** gõ hoặc bấm chip → chuyển sang `/ban-dong-hanh` với câu hỏi đã điền. Phím `/`
  focus ô này (đã có xử lý ở `Layout.tsx`).

### B6. Không gian học (danh sách môn)

- **Mục đích:** lối vào các môn; với người mới là nơi chọn môn đầu tiên.
- **Nội dung:** render từ `SUBJECT_ENTRIES` (giữ). Thay đổi: **sắp môn đang học lên đầu**, mỗi thẻ
  có 1 dòng trạng thái bằng CHỮ ("đang học · Hội thoại A2" / "chưa bắt đầu"), không thanh %. Mobile:
  danh sách phẳng 3 môn đầu + "Xem tất cả". Desktop: lưới 2 cột đủ 6 môn. Sự nghiệp/Đời sống là
  hàng cuối, cùng khuôn.
- **Hierarchy:** Title cho tên môn, Caption cho trạng thái; icon môn giữ `SUBJECT_TONE`.
- **Interaction:** bấm thẻ → `ctaPath` của registry. Chữ "A2"/"P1" là **tên chặng nội dung** (mã
  mục lục), không phải điểm chẩn đoán — được phép vì nó là địa chỉ, không phải đánh giá.

### B7. Thành phần phụ

- **Tiến bộ kể chuyện (desktop cột phải / mobile ẩn dưới "Xem thêm"):** 3 dòng "Bạn đã…" từ dữ
  liệu 7 ngày (mục D1).
- **Mẹo / promo:** đúng MỘT thẻ, đóng được, không bao giờ nằm trên Today. Ưu tiên: `PlanExpiryBanner`
  > `PricePromoBanner` > `RewardTipBanner`. Hiện tại có thể 3 banner cùng lúc — cần một hàm chọn
  > một (`pickHomeBanner`).
- **Thẻ "quay lại sau bỏ bẵng":** giữ, nhưng hợp nhất vào bong bóng Companion (B2) thay vì thẻ
  riêng: "Đã 5 ngày rồi — bắt đầu nhẹ thôi" là câu Companion nên nói, không phải card thứ năm.

### B8. Sidebar desktop (từ 10 mục về 7)

```
Trang chủ
Hôm nay học            ← gộp "Góc học tập ▾" (nhóm con giữ) — đổi nhãn để nói việc, không nói nơi
Ôn tập                 ← giữ (hàng đợi xuyên môn)
Bạn Đồng Hành          ← giữ
Sự nghiệp & Đời sống   ← GỘP 2 studio (Sự nghiệp · Công việc & Đời sống) thành 1 nhóm ▾
──────────
Tiến độ
Hồ sơ  (Nâng cấp chuyển thành dòng nhỏ dưới avatar: "Free · Nâng cấp")
```

- "Luyện tập" (hub đa môn) rời khỏi sidebar → thành mục con của môn (nó đã là mục con của Tiếng
  Anh trong `navTree.ts`); ở cấp nền tảng, "Ôn tập" đã bao việc luyện xuyên môn.
- "Nâng cấp" hạ khỏi nhóm chính: màu amber cạnh tranh trực tiếp với Companion (cũng amber) và với
  CTA. Đặt ở chân sidebar dưới avatar, Label thường, chỉ nổi khi hover.
- Giữ cơ chế thu gọn `--sidebar-w` và `resolveActiveNav`. Cần cập nhật `ACTIVE_ORDER`,
  `DesktopSidebar.test.tsx`, `Layout.test.tsx`.

---

## C. Các màn hình / trạng thái quan trọng

### C1. Guest (chưa đăng nhập)

Hiện `Home` trả `null` khi `!user`, khách được chuyển sang landing. Đề xuất: **trang chủ khách là
một màn hình riêng, 3 khối, đọc xong trong 10 giây:**

```
┌──────────────────────────────────────┐
│ (◕‿◕)  "Chào bạn. Mình là Bạn Đồng    │  Companion tự giới thiệu, 2 dòng
│         Hành — học cùng bạn mỗi ngày, │
│         từ tiếng Anh tới lập trình."  │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │ ▶ Bắt đầu — chọn việc đầu tiên   │ │  CTA duy nhất → /bat-dau (5 câu, 90 giây)
│ │   (không cần tài khoản)          │ │
│ └──────────────────────────────────┘ │
│  hoặc thử ngay:                       │
│  [🗣 Nói 1 câu tiếng Anh] [</> Chạy 1 dòng code] │  2 "demo 30 giây" không đăng nhập
├──────────────────────────────────────┤
│ Tiếng Anh · Lập trình · Toán · Lý ·   │  dải môn, chữ nhỏ, bấm được
│ Hoá · Sinh · Sự nghiệp · Đời sống     │
└──────────────────────────────────────┘
  Đăng nhập (chữ nhỏ, góc trên phải)
```

- **Khác biệt then chốt:** khách **làm được một việc thật** trước khi bị hỏi email. Hai "demo 30
  giây" dùng tính năng đã công khai (`docs/specs/2026-09-15-mo-xem-web-khong-can-dang-nhap.md`).
- `GuestBanner` chỉ hiện SAU khi khách đã làm xong 1 việc (lúc đó câu "đăng ký để giữ tiến độ" mới
  có nghĩa). Trước đó không hiện.
- Không streak, không nhiệm vụ, không danh sách 6 thẻ môn dài.

### C2. Đã đăng nhập, có tiến độ

Đúng sơ đồ B0. Điểm nhấn: greeting nêu **một sự thật cụ thể** (không chung chung), Today có ước
lượng thời gian, B4 hiện chấm tuần, môn đang học lên đầu.

### C3. Empty state (đăng nhập nhưng chưa học môn nào)

- Greeting: "Chào [tên]. Mình chưa biết bạn muốn học gì — kể mình nghe 90 giây nhé?"
- Today: `TodayItem.kind === 'pick'` (đã có, icon `Compass`) → CTA "Chọn việc đầu tiên" →
  `/bat-dau`. Caption: "Chưa có môn nào · chọn xong là có việc ngay".
- B4 ẩn hoàn toàn (không hiện 0/7 — con số 0 là hình phạt).
- B6 hiện đủ 6 môn + 2 trụ, mỗi thẻ có nút "Thử 5 phút" thay vì "chưa bắt đầu".
- Không banner phụ.

### C4. Đang học (trong một phiên)

Áp dụng cờ `focus` của `Layout` (đã có) và mở rộng:

```
┌──────────────────────────────────────┐
│ ← Tiếng Anh    ━━━━━━━━━━░░░░  3/5    │  Header focus: Back + thanh tiến độ PHIÊN (không phải %) + (◕) nhỏ
├──────────────────────────────────────┤
│                                      │
│           [nội dung bài]             │
│                                      │
├──────────────────────────────────────┤
│ (◕) "Câu này bạn dùng thì quá khứ    │  Companion inline: gợi ý ngắn, ẩn được,
│      đúng rồi — thử thêm 'yesterday'"│  KHÔNG chặn nội dung (bong bóng đáy)
├──────────────────────────────────────┤
│ [ Kiểm tra ]                          │  CTA đáy cố định, 56px
└──────────────────────────────────────┘
```

- Thanh tiến độ phiên đếm **bước** (3/5), là thứ duy nhất hiển thị dạng số vì nó nói "còn bao lâu
  nữa là xong", không nói "bạn giỏi bao nhiêu".
- Companion inline: bong bóng đáy 1–2 dòng, vuốt xuống để ẩn, bấm avatar để mở chat đầy đủ. Đây là
  "AI xuất hiện không phải chatbot" (mục D3).
- Ẩn: bottom nav, streak, studio switcher (đã ẩn 2 khe với `focus`; thêm bottom nav).

### C5. Sau khi hoàn thành một phiên ngắn

```
┌──────────────────────────────────────┐
│           ✦ (animation 600ms)        │
│  (◕‿◕) "Xong rồi! Bạn vừa nói được   │  Companion nói SỰ THẬT, không điểm số
│         5 câu — câu 'I'd love to'    │
│         lần đầu bạn dùng đúng."      │
├──────────────────────────────────────┤
│  ● ● ● ● ● ○ ○   Hôm nay ✓ · 5 ngày │  chấm hôm nay chuyển ●, mừng nhẹ
│  🎯 Nhiệm vụ "Nói 5 câu" hoàn thành  │  (chỉ hiện nếu có)
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │ Thêm 3 phút nữa? → Ôn 5 thẻ      │ │  CTA phụ "một bước nhỏ nữa" (accent nhạt)
│ └──────────────────────────────────┘ │
│   Về trang chủ (chữ)                 │
└──────────────────────────────────────┘
```

- Thứ tự: sự thật → nhịp → lời mời nhỏ. Không có bảng điểm, không "band ước lượng" ở đây (kết
  quả chấm chi tiết vẫn ở màn riêng cho chế độ viết/IELTS, người dùng chủ động mở).
- Hợp nhất `Celebration`, `StreakCelebration`, `WeeklyGoalCelebration` thành một `SessionDone`
  có 3 tầng nội dung tuỳ điều kiện — ba modal chồng nhau là lỗi hiện tại dễ gặp.

---

## D. Cải tiến trải nghiệm học cốt lõi

### D1. Tiến độ thông minh hơn (không chỉ %)

Ba tầng, dùng đúng tầng cho đúng chỗ:

| Tầng             | Hình thức                         | Ở đâu                        | Ví dụ                                            |
| ---------------- | --------------------------------- | ---------------------------- | ------------------------------------------------ |
| **Bước** (số)    | `3/5`, thanh đoạn                 | Trong phiên (C4)             | "còn 2 bước"                                     |
| **Nhịp** (chấm)  | 7 chấm tuần, không %              | Trang chủ B4                 | ● ● ● ● ○ ○ ○                                    |
| **Chuyện** (chữ) | 3 câu "Bạn đã…" từ dữ liệu 7 ngày | Trang chủ B7, C5, `/tien-do` | "Bạn đã dùng đúng thì quá khứ 8/10 lần tuần này" |

Chỉ `/tien-do` (trang người dùng chủ động mở) mới có biểu đồ và mã CEFR/bậc. Hàm dựng câu
"chuyện" nên là hàm thuần `buildProgressStory(events7d)` có test bảng, giống `buildTodayPlan`.

### D2. Streak + Nhiệm vụ + Huy hiệu

- **Streak:** hình 7 chấm tuần thay số lửa. Số "🔥7" chỉ còn ở header (nhỏ). Đứt streak → chấm
  xám, Companion nói "Không sao, hôm nay là ngày 1 mới" — không icon lửa tắt. Streak Freeze hiện
  là chấm ▢ có tooltip.
- **Nhiệm vụ:** tối đa 3/ngày, hiện dạng `1/3` ở B4; chi tiết ở `/nhiem-vu`. Nhiệm vụ phải là
  việc học (nói 5 câu, ôn 10 thẻ), không phải "mở app 3 lần".
- **Huy hiệu:** chỉ hiện **huy hiệu mới nhất** ở B4 (icon + tên). Bộ sưu tập ở `/trang-ca-nhan`.
  Không popup huy hiệu giữa phiên học; gom vào C5.

### D3. Cách AI "xuất hiện" (không chỉ chatbot)

Companion có **4 điểm hiện diện cố định** và **1 danh tính**:

| Điểm hiện diện        | Hình thức                                  | Trạng thái avatar             |
| --------------------- | ------------------------------------------ | ----------------------------- |
| Trang chủ (B2)        | Avatar + bong bóng chào                    | `idle` (chớp mắt chậm 6s)     |
| Trong phiên (C4)      | Bong bóng đáy 1–2 dòng, ẩn được            | `thinking` (3 chấm) / `cheer` |
| Sau phiên (C5)        | Avatar lớn + sự thật                       | `cheer` (600ms rồi về idle)   |
| Bottom nav (tab giữa) | Orb hiện có, thêm chấm nhỏ khi có lời nhắc | `hasNote`                     |

- Avatar: dùng `AvatarSpeaking.tsx`/`CompanionVoice` đã có làm gốc; bản 2D SVG 4 trạng thái là
  đủ cho P0 (Canvas viseme để dành cho trang `/ban-dong-hanh`).
- Giọng viết: ngôi "mình – bạn", câu ≤ 20 từ, luôn có MỘT sự thật cụ thể, không cảm thán rỗng
  ("Tuyệt vời!" một mình là cấm). Đưa vào `apps/dhcb/src/prompts/` và golden snapshot.
- Không bao giờ: chặn màn hình, tự bật tiếng, hỏi hai câu một lúc.

### D4. Micro-interaction & feedback bắt buộc

| Sự kiện                  | Phản hồi                                                            | Có sẵn?                   |
| ------------------------ | ------------------------------------------------------------------- | ------------------------- |
| Bấm CTA "Hôm nay"        | Nút `scale-95` 80ms + chuyển trang ≤ 200ms, skeleton cùng chiều cao | có (`TodayCard` skeleton) |
| Trả lời đúng             | `pop-correct` + màu emerald + âm nhẹ (tắt được)                     | có keyframe               |
| Trả lời sai              | lắc ngang + Companion gợi ý, KHÔNG màu đỏ toàn khối                 | có keyframe               |
| Hoàn thành phiên         | chấm tuần chuyển ● với `scale-in` 300ms                             | mới                       |
| Companion "đang nghĩ"    | 3 chấm trong bong bóng, ≤ 3s rồi có chữ                             | mới                       |
| Mất mạng                 | `OfflineStatusBanner` giữ; CTA đổi thành "Ôn thẻ ngoại tuyến"       | một phần                  |
| `prefers-reduced-motion` | tắt mọi animation trừ đổi màu                                       | cần rà toàn bộ            |

---

## E. Mobile-first

### E1. Header mobile (từ 8 khe về 4)

```
Trang chủ:      [Đồng Hành]                          [🔥7] [◯]
Trang thường:   [← Tiếng Anh]  Tiêu đề trang          [◯]
Trang focus:    [← ]  ━━━━━━░░░  3/5                  [(◕)]
```

- Bỏ khỏi header mobile: nút Studio switcher (đưa vào tab "Không gian" của bottom sheet Hồ sơ),
  nút "Đồng Hành AI" (đã có Orb), nút đổi theme (vào Hồ sơ; a11y vẫn đảm bảo vì theme tự theo
  `prefers-color-scheme` lần đầu).
- Tiêu đề trang không nằm trong header 56px mà là `PageHeader` lớn ngay dưới (đã có component).
- Nút Back lấy nhãn đích thật (đã làm ở 0359).

### E2. Bottom navigation

Giữ 5 tab, đổi nhãn cho khớp sidebar mới và giảm hiệu ứng:

```
🏠 Trang chủ · 📚 Học · (◕) Đồng Hành · 🧠 Ôn tập · 👤 Tôi
```

- "Luyện tập" → "Ôn tập" (cùng route `/goc-hoc-tap/on-tap` như sidebar; hub luyện đa môn vào
  trong "Học"). Lý do: hai chữ "Luyện tập"/"Ôn tập" đang tồn tại song song ở hai thanh điều hướng.
- Tab giữa giữ Orb nhô lên nhưng bỏ `scale-105/110` khi active (gây nhảy layout); chỉ đổi màu +
  chấm `hasNote`.
- Nhãn ≤ 8 ký tự để không `truncate` ở 360px.
- `pb-safe` giữ; chiều cao 5.25rem giữ.

### E3. Ưu tiên nội dung trên màn nhỏ

Thứ tự cuộn cố định: Chào → Hôm nay → Nhịp → Hỏi → Môn → Phụ. Trong 1 màn 390×844 không cuộn phải
thấy trọn **Chào + Hôm nay + Nhịp** (≈ 520px). Mọi banner phụ nằm dưới fold. Danh sách môn chỉ 3
thẻ + "Xem tất cả".

---

## F. Deliverables

### F1. Danh sách component

| Component            | Trạng thái | Việc                                                                                     |
| -------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| `CompanionAvatar`    | MỚI        | SVG 2D, 4 trạng thái (`idle`/`thinking`/`cheer`/`hasNote`), size 32/48/64, `aria-hidden` |
| `CompanionBubble`    | MỚI        | bong bóng nền `--w-50`, ≤ 2 dòng, nút 🔊 tuỳ chọn, biến thể `home`/`inline`/`done`       |
| `HomeAiBriefingCard` | SỬA        | thay vỏ bằng `CompanionAvatar` + `CompanionBubble`; gộp thẻ "quay lại" vào câu chào      |
| `TodayCard`          | SỬA NHẸ    | ước lượng thời gian, việc phụ thành link, kéo lên vị trí 2                               |
| `WeekRhythm`         | MỚI        | 7 chấm tuần + nhiệm vụ + huy hiệu mới nhất (B4)                                          |
| `HomeUniversalAiBar` | SỬA NHẸ    | thêm chip gợi ý theo `todayPlan`                                                         |
| `SubjectSpaceList`   | TÁCH       | tách khối môn khỏi `Home.tsx`, sắp môn đang học lên đầu, dòng trạng thái chữ             |
| `pickHomeBanner`     | MỚI (hàm)  | chọn đúng 1 banner phụ                                                                   |
| `GuestHome`          | MỚI        | màn C1 (thay `return null` khi `!user`)                                                  |
| `SessionDone`        | MỚI        | gộp 3 celebration, 3 tầng nội dung (C5)                                                  |
| `buildProgressStory` | MỚI (hàm)  | thuần, test bảng, sinh 3 câu "Bạn đã…"                                                   |
| `DesktopSidebar`     | SỬA        | 10 → 7 mục, "Nâng cấp" xuống chân                                                        |
| `BottomNav`          | SỬA NHẸ    | nhãn, bỏ scale, chấm `hasNote`                                                           |
| `Layout` (header)    | SỬA        | mobile 4 khe; `focus` ẩn thêm bottom nav                                                 |
| Token `--w-*`        | MỚI        | `index.css` + `theme.css`, đủ 3 theme, qua cổng contrast                                 |

### F2. User flow

**Hành trình 1 — Guest → bắt đầu học môn đầu tiên**

```
Mở app (guest)
 └─ C1: Companion chào 2 dòng + CTA "Bắt đầu — chọn việc đầu tiên"
     ├─ [Bắt đầu] → /bat-dau (5 câu, mỗi câu bỏ qua được, ≤ 90s)
     │     └─ pickStartAction → vào thẳng phiên học 5 phút (C4, có Companion inline)
     │           └─ C5 SessionDone: sự thật + "Đăng ký để mình nhớ bạn ngày mai" (GuestBanner lúc này mới hiện)
     │                 └─ /login → về trang chủ C2 với Today = bước kế tiếp
     └─ [Demo 30 giây] → phiên mini không tài khoản → C5 rút gọn → cùng lời mời như trên
```

Mục tiêu đo: guest chạm CTA trong ≤ 10 giây (event `daily_plan_impression` → click); tỉ lệ
hoàn thành phiên đầu; tỉ lệ đăng ký SAU phiên đầu.

**Hành trình 2 — Người dùng cũ → tiếp tục học hôm nay**

```
Mở app (đã đăng nhập)
 └─ C2: Companion nêu 1 sự thật hôm qua → Today "Tiếp tục: … · còn ~6 phút" (1 chạm)
     └─ C4 phiên (thanh bước 3/5, Companion inline)
         └─ C5: sự thật + chấm hôm nay ● + "Thêm 3 phút? Ôn 5 thẻ"
             ├─ [Ôn 5 thẻ] → phiên ôn ngắn → C5 lần 2 (không lặp mừng streak)
             └─ [Về trang chủ] → C2, Today đã đổi sang việc kế tiếp
```

Mục tiêu đo: thời gian từ mở app tới vào phiên ≤ 5 giây; tỉ lệ nhận lời "thêm 3 phút".

### F4. URL của các màn hình mới

Theo quy ước URL của dự án (`CLAUDE.md` mục 7): slug tiếng Việt không dấu, route có id nội dung
có tiêu đề dùng khuôn `<mã>--<slug>`, và mọi link dựng qua đúng MỘT hàm dùng chung. **Không thêm
route mới nào cho những gì đã có đường**; chỉ thêm 2 route thật.

| Màn hình                      | URL                                                 | Ghi chú                                                                                                                                                                          |
| ----------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trang chủ (C2/C3)             | `/`                                                 | Giữ. Đã đăng nhập.                                                                                                                                                               |
| Trang chủ khách (C1)          | `/`                                                 | CÙNG URL, render `GuestHome` khi `!user` — khách và người dùng thấy cùng một địa chỉ, không redirect sang `/welcome` nữa. `/welcome` và `/learn-vietnamese` giữ làm landing SEO. |
| Bắt đầu theo ý định           | `/bat-dau`                                          | Giữ (`StartByIntent`).                                                                                                                                                           |
| Demo 30 giây (guest)          | `/thu-ngay/noi-mot-cau` · `/thu-ngay/chay-mot-dong` | MỚI (P2). Param tự mô tả nội dung, không có mã → không cần khuôn `--`.                                                                                                           |
| Trong phiên (C4)              | URL của bài đang học, KHÔNG đổi                     | ví dụ `/lap-trinh/bai-hoc/p1-u1-l1--bien-va-kieu-du-lieu`, `/lo-trinh-hoc/A2`. Chế độ focus là cờ của `Layout`, không phải route.                                                |
| Sau phiên (C5)                | `<URL bài>?xong=1`                                  | Không route riêng: `SessionDone` là overlay trên chính trang bài, query để F5/Back không mất màn kết. `returnTo` lấy từ `TodayCard`.                                             |
| Nhịp học chi tiết             | `/nhiem-vu`                                         | Giữ.                                                                                                                                                                             |
| Tiến độ đầy đủ                | `/tien-do`                                          | Giữ.                                                                                                                                                                             |
| Hỏi Bạn Đồng Hành             | `/ban-dong-hanh?hoi=<câu>`                          | Giữ route, thêm query `hoi` để chip gợi ý điền sẵn câu hỏi.                                                                                                                      |
| Ôn tập xuyên môn (tab mobile) | `/goc-hoc-tap/on-tap`                               | Giữ (đã dùng chung sidebar).                                                                                                                                                     |

Hàm dựng link mới đặt ở `apps/dhcb/src/lib/homeRoutes.ts` (`duongDanThuNgay(demoId)`,
`duongDanHoiDongHanh(cau)`, `duongDanXongPhien(urlBai)`), cùng mẫu với `programmingRoutes.ts`.

### F3. Ưu tiên triển khai

**P0 — thay đổi cảm nhận lớn nhất, rủi ro thấp nhất (2–3 PR nhỏ):**

1. Sắp lại thứ tự trang chủ (Today lên vị trí 2) + `pickHomeBanner` — chỉ đụng `Home.tsx`.
2. `CompanionAvatar` + `CompanionBubble` + token `--w-*` + thay vỏ `HomeAiBriefingCard`; gộp thẻ
   "quay lại" vào câu chào. Cổng: a11y 3 theme, golden snapshot nếu đổi prompt.
3. `GuestHome` (C1) thay `return null`, kèm E2E "guest chạm CTA".
4. Header mobile 4 khe (E1) + `focus` ẩn bottom nav.

**P1 — nhịp học & sau phiên:**

5. `WeekRhythm` (B4) từ dữ liệu streak/quest sẵn có.
6. `SessionDone` gộp 3 celebration (C5).
7. Sidebar 10 → 7 mục + nhãn bottom nav đồng bộ (cập nhật test sidebar/layout/E2E).
8. `SubjectSpaceList` sắp môn đang học lên đầu.

**P2 — chiều sâu:**

9. `buildProgressStory` + cột "Tiến bộ kể chuyện" desktop + dùng lại ở `/tien-do`.
10. Companion inline trong phiên (C4) cho môn Anh trước, Lập trình sau.
11. Chip gợi ý Ask bar theo ngữ cảnh; 2 demo 30 giây cho guest.
12. Rà `prefers-reduced-motion` toàn app.

**Cổng nghiệm thu chung cho mọi lát (theo `docs/framework/QUY-TRINH-AUDIT.md` Tầng 8b):** ảnh
chụp 1440px + 390px trước/sau ở 3 theme; `npm run shots:learning-ux`; a11y AA+AAA xanh; bundle
không vượt trần 150 kB (đang 135,4 kB — lát 2 phải đo, SVG avatar inline nhỏ hơn PNG).

---

## G. Rủi ro & điều cần chủ dự án quyết

1. **Ngân sách bundle — ĐÃ NỚI 140 → 150 kB (chủ dự án chốt 2026-09-17, cùng đợt này).** Đang
   135,4 kB, dư ~14,6 kB; mốc cảnh báo 95% = 142,5 kB. Avatar SVG + 2 component mới ước ~2–3 kB
   brotli. Vẫn tách `GuestHome` thành chunk lazy (guest và user không cùng lúc cần cả hai).
2. **Đổi nhãn/route điều hướng (P1-7)** chạm nhiều E2E. Đề xuất làm PR riêng, không gộp với P0.
3. **"Nâng cấp" hạ khỏi nhóm chính** có thể giảm chuyển đổi VIP ngắn hạn; đổi lại Companion và CTA
   không bị màu amber cạnh tranh. Cần chủ dự án xác nhận đánh đổi này.
4. **Theme `kid`** chưa có bảng màu `--w-*` trong tài liệu này; cần chọn màu ấm riêng và qua cổng
   contrast trước khi P0-2 merge.
