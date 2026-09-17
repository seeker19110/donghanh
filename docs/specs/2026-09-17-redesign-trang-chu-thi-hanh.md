# Đặc tả THI HÀNH — Thiết kế lại Trang chủ & trải nghiệm học cốt lõi (13 lát, P0 → P2)

| Thuộc tính    | Giá trị                                                                                                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec nền      | [`../research/thiet-ke-lai-trang-chu-va-trai-nghiem-hoc-2026-09-17.md`](../research/thiet-ke-lai-trang-chu-va-trai-nghiem-hoc-2026-09-17.md) (THIẾT KẾ — mục A–G)                                                                       |
| Spec kề       | S06 `2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md` (`TodayPlan`) · S05 `…-s05-bat-dau-theo-y-dinh.md` (`/bat-dau`) · `2026-09-15-mo-xem-web-khong-can-dang-nhap.md` (khách) · `2026-09-15-goc-hoc-tap-architecture.md` (host routing) |
| Base khảo sát | `main` `5f7d329` (#999) + nhánh `claude/blissful-fermi-1i2b1p` (PR #1000), khảo sát 2026-09-17 bằng đọc mã thật                                                                                                                         |
| Trạng thái    | **Chờ "Approved for implementation"** — chủ dự án duyệt từng lát; lát nào duyệt thì ghi ngày vào bảng §9 rồi mới code lát đó                                                                                                            |
| Người duyệt   | Chủ dự án                                                                                                                                                                                                                               |

> Khuôn: `docs/templates/dac-ta-tinh-nang.md` — mỗi lát đủ 6 ô ①–⑥. Ô ④ (tiêu chí chấp nhận)
> viết TRƯỚC giải pháp. Bên thi hành KHÔNG thấy hội thoại: mọi thứ cần biết nằm trong file này +
> spec nền.
>
> **Ba luật sản phẩm chi phối MỌI lát** (vi phạm = PR bị từ chối dù test xanh):
>
> 1. Chẩn đoán KHÔNG bao giờ là màn hình chính; không band/CEFR/%/bậc năng lực lên thẻ chọn việc
>    (CLAUDE.md §2). Mã chặng nội dung (`A2`, `P1`) là ĐỊA CHỈ, được phép; "trình độ A2" là ĐÁNH GIÁ,
>    cấm.
> 2. Không mặc định tiếng Anh (S06 AC-3).
> 3. Một CTA chính trên màn chọn việc (`TodayCard` ba luật).

## 0. Một câu

Người mở app — khách hay tài khoản — thấy một Bạn Đồng Hành có mặt, có trạng thái, nói một sự
thật cụ thể về mình, rồi một nút duy nhất để học tiếp; sau phiên thấy nhịp học đi đều bằng bảy
chấm tuần chứ không bằng phần trăm; và mọi màn của Góc học tập nằm dưới một khuôn URL.

## 1. Đính chính so với spec nền (đọc trước khi làm)

| Spec nền nói                                | Thực tế mã (2026-09-17)                                                                                                                                                                   | Hệ quả cho lát                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| "`Home` trả `null` khi `!user`" (mục 0, C1) | Route `/` bọc `AllowGuest` (`App.tsx:751`); `AuthProvider` luôn cấp user KHÁCH (`isGuest`), `Home` chỉ trả `null` trong khoảnh khắc loading. Khách đang thấy Home đầy đủ + `GuestBanner`. | P0-3 `GuestHome` là NHÁNH `isGuest` bên trong `Home`, không phải trang mới. |
| "Streak hiện `🔥7` ở header"                | Đúng, `Layout.tsx:169` `streakBadge`, ẩn khi `focus`.                                                                                                                                     | P0-4 giữ, chỉ thu gọn.                                                      |
| Theme `kid` "chưa có màu ấm"                | `kid` accent ĐÃ là cam (`--a-500: 249 115 22`). Màu ấm Companion ở `kid` phải KHÁC cam.                                                                                                   | P0-2 chọn hồng đậm cho `kid` (§P0-2 ③).                                     |
| Huy hiệu "rải ở 3 nơi"                      | Có `lib/achievements.ts` + `achievementRewards.ts` (đã có test). Nguồn sự thật đã tồn tại.                                                                                                | P1-5 đọc từ đó, không tạo bảng mới.                                         |
| Chấm tuần "mới"                             | `lib/weeklyGoal.ts` đã có `getWeekDays(uid): DayActivity[]` (T2→hôm nay) + `getWeeklyProgress`.                                                                                           | P1-5 tái dùng, thêm phần "ngày chưa tới".                                   |

## 2. Thứ tự và phụ thuộc

```
P0-1 sắp lại trang chủ ──┐
P0-2 token ấm + Companion ┼──► P0-3 GuestHome ──► P2-12 demo 30s + chip gợi ý
P0-4 header mobile ──────┘
P1-5 WeekRhythm ──► P1-6 SessionDone ──► P2-10 buildProgressStory
P1-7 sidebar/bottom nav ──► P1-9 URL Góc học tập (3 PR)
P1-8 SubjectSpaceList (độc lập)
P2-11 Companion inline (cần P0-2)     P2-13 reduced-motion (độc lập, làm bất kỳ lúc)
```

Mỗi lát = MỘT PR (P1-9 = ba PR). Không gộp hai lát vào một PR: E2E ảnh chụp (Tầng 8b) phải quy
được cho đúng một thay đổi.

## 3. Quy ước dùng chung cho mọi lát (ô ⑥ chung — lát nào có thêm thì ghi riêng)

- Import xuyên gói `@dhcb/<gói>/<file>` không đuôi; nội bộ gói đường tương đối có `.js`.
- Màu: token `--a-*`/`--z-*`/`content*`/`line-*`; lát P0-2 thêm `--w-*`. **Cấm** `text-zinc-*`
  mới cho chữ nội dung (dùng `text-content`/`text-content-secondary`); cấm hex trong TSX.
- Tương phản: chữ nội dung/tiêu đề AAA ≥ 7:1, thành phần khác AA; canh bởi `e2e/a11y.spec.ts` +
  `e2e/a11y-aaa.spec.ts` (15 trang × 3 theme, 0 vi phạm, không baseline).
- Vùng chạm ≥ 44px: dùng class `tap-44`.
- Chữ giao diện tiếng Việt, comment tiếng Việt, tên biến tiếng Anh; hàm dựng URL tiếng Việt theo
  mẫu `duongDan*` (`lib/programmingRoutes.ts`).
- Không `console.log`; không `any`; dữ liệu ngoài qua Zod.
- Bundle: `.size-limit.json` JS 150 kB / CSS 20 kB; mỗi lát chạm client phải dán số
  `npx size-limit` trước/sau vào PR.
- Ảnh chụp bắt buộc (Tầng 8b): 1440px + 390px, trước/sau, 3 theme, cho MỌI lát chạm giao diện.
  Lệnh: `npm run shots:learning-ux` (mở rộng script nếu trang mới chưa có).
- Analytics: chỉ thêm tên sự kiện vào union `AnalyticsEvent` (`lib/analytics.ts:13`), gọi qua
  `track()`; không fetch tay.
- Cổng commit: `npm run typecheck && npm run lint && npm run format && npm run test:coverage &&
npm run build`; trước push cuối `rm -rf packages/*/dist dist dist-server` rồi `npm run typecheck`.
- PR: tiêu đề khớp regex `pr-policy.yml`; `feat(...)` phải dẫn file này + "Approved for
  implementation" (chỉ khi lát đã được duyệt ở §9). Changelog riêng `docs/changelog/NNNN-*.md`.

---

# P0 — bốn lát đầu

## P0-1 · Sắp lại thứ tự trang chủ + một banner phụ duy nhất

### ① Phạm vi

**LÀM:**

- Đổi thứ tự khối trong `Home.tsx` thành: `FirstTaskCard` (nếu có) → `HomeAiBriefingCard` →
  `TodayCard` → `HomeUniversalAiBar` → thẻ "quay lại" → phần môn. (Hiện `TodayCard` đã đứng thứ 3
  sau `HomeAiBriefingCard`; việc thật của lát này là **gỡ khoảng cách/viền để Today là khối tương
  phản lớn nhất** và **đưa mọi banner phụ xuống DƯỚI phần môn**.)
- Hàm thuần `pickHomeBanner(input): HomeBanner | null` chọn ĐÚNG MỘT banner phụ theo ưu tiên
  `planExpiry > promoEnding > pricePromo > rewardTip`.
- Ở trang chủ, chỉ render banner do `pickHomeBanner` trả; các banner đó vẫn render như cũ ở
  trang khác (lát này KHÔNG đụng `AllowGuest`/`RequireAccount` trong `App.tsx`).
- Mobile: khối `topBlocks` (Chào + Today) phải nằm trọn trong 844px chiều cao không cuộn ở 390px.

**KHÔNG LÀM:**

- Không đổi vỏ `HomeAiBriefingCard` (P0-2), không đổi logic `TodayCard`/`buildTodayPlan`.
- Không đụng `SUBJECT_ENTRIES`, không sắp lại môn (P1-8).
- Không đụng `PlanExpiryBanner`/`PromoEndingBanner` bên trong `App.tsx` — chúng vẫn hiện trên
  trang khác; trang chủ chỉ **ẩn** bản của mình khi `pickHomeBanner` không chọn.

### ② Điểm chạm

| Việc | Đường dẫn file                                                  | Ghi chú                                                                  |
| ---- | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Thêm | `apps/dhcb/src/lib/home/pickHomeBanner.ts` + `.test.ts`         | thuần, không React, không storage                                        |
| Sửa  | `apps/dhcb/src/pages/core/Home.tsx`                             | thứ tự khối, gọi `pickHomeBanner`, gỡ `RewardTipBanner` khỏi `topBlocks` |
| Sửa  | `apps/dhcb/src/pages/core/Home.test.tsx`, `Home.design.test.ts` | cập nhật thứ tự DOM                                                      |
| Sửa  | `e2e/learning-ux-layout.spec.ts`                                | thêm ca "Today nằm trong fold 390×844"                                   |

**Ảnh hưởng lan ra:** `npm run codemap -- impact apps/dhcb/src/pages/core/Home.tsx` → chỉ
`App.tsx` (route). Banner components không đổi chữ ký.

### ③ Hợp đồng dữ liệu

```ts
// apps/dhcb/src/lib/home/pickHomeBanner.ts
export type HomeBannerKind = 'planExpiry' | 'promoEnding' | 'pricePromo' | 'rewardTip'
export interface PickHomeBannerInput {
  isGuest: boolean
  planExpiresInDays: number | null // null = không có gói trả phí
  promoEndsInDays: number | null // null = không có khuyến mãi đang chạy
  hasRewardTip: boolean // RewardTipBanner có nội dung cho uid này không
}
export interface HomeBanner {
  kind: HomeBannerKind
}
/** Đúng MỘT banner hoặc null. Khách chỉ có thể nhận 'pricePromo'. */
export function pickHomeBanner(input: PickHomeBannerInput): HomeBanner | null
```

Ưu tiên: `planExpiry` khi `planExpiresInDays !== null && ≤ 7` → `promoEnding` khi
`promoEndsInDays !== null && ≤ 3` → `pricePromo` khi `promoEndsInDays !== null` → `rewardTip`
khi `hasRewardTip` → `null`. Khách (`isGuest`): chỉ `pricePromo` hoặc `null`.

**Ca lỗi:** input thiếu trường → TypeScript chặn; không có runtime error path.

### ④ Tiêu chí chấp nhận

- [ ] **AC-1** `pickHomeBanner` test bảng ≥ 10 ca (mỗi nhánh ưu tiên + khách + rỗng) —
      `npx vitest run apps/dhcb/src/lib/home/pickHomeBanner.test.ts`.
- [ ] **AC-2** Trang chủ (user có gói sắp hết hạn + có promo + có reward tip) render ĐÚNG MỘT
      phần tử `[data-home-banner]` — `Home.test.tsx`.
- [ ] **AC-3** Thứ tự DOM trong `<main>`: `#today-card-heading` xuất hiện TRƯỚC ô tìm kiếm
      (`HomeUniversalAiBar`) và TRƯỚC mọi `[data-home-banner]` — `Home.design.test.ts`.
- [ ] **AC-4** Playwright 390×844: `boundingBox` của nút CTA chính trong `TodayCard` có
      `y + height ≤ 844` khi chưa cuộn, ở cả 3 theme — `e2e/learning-ux-layout.spec.ts`.
- [ ] **AC-5** Ảnh chụp trước/sau 1440 + 390 × 3 theme dán vào PR.
- [ ] **AC-6** `npx size-limit` JS không tăng quá 0,3 kB.

### ⑤ Bất biến

| Bất biến                                                | Test canh                                                     |
| ------------------------------------------------------- | ------------------------------------------------------------- |
| `TodayCard` vẫn đúng một CTA, không quyết định việc học | `components/Home/TodayCard.test.tsx` (có sẵn)                 |
| Không mặc định tiếng Anh                                | `packages/core-learner/today/buildTodayPlan.test.ts` (có sẵn) |
| Mỗi khối render một lần (không nhân bản mobile/desktop) | `Home.design.test.ts` (có sẵn, mở rộng)                       |
| `PlanExpiryBanner` vẫn hiện ở trang KHÁC trang chủ      | thêm ca vào `Layout.test.tsx` hoặc `App` test                 |

### ⑥ Quy ước riêng

- Đọc S06 §④ để hiểu vì sao `TodayCard` không được nhận thêm prop quyết định.

---

## P0-2 · Token ấm `--w-*` + `CompanionAvatar` + `CompanionBubble` + thay vỏ lời chào

### ① Phạm vi

**LÀM:**

- Thêm 4 token `--w-50 · --w-100 · --w-500 · --w-700` vào `packages/core-ui/theme.css` cho cả 3
  theme + map Tailwind `warm.{50,100,500,700}` trong `apps/dhcb/tailwind.config.js`.
- `CompanionAvatar` (SVG inline, 4 trạng thái, 3 cỡ) — `packages/core-ui/CompanionAvatar.tsx`.
- `CompanionBubble` (bong bóng ≤ 2 dòng, 3 biến thể) — `packages/core-ui/CompanionBubble.tsx`.
- `HomeAiBriefingCard`: thay icon `Bot` + thẻ xám bằng `CompanionAvatar size=48 (md) / 64 (lg)` +
  `CompanionBubble variant="home"`; GIỮ nguyên `fetchProactiveBriefing`, `speak`, `FALLBACK_SUMMARY`,
  `showDailyWords`.
- Gộp thẻ "quay lại sau bỏ bẵng" (`showComeback`, `Home.tsx:160-213`) vào **dòng thứ hai** của
  bong bóng: câu "Đã N ngày rồi — bắt đầu nhẹ thôi." + hai link chữ nhỏ (`Ôn k thẻ` · `Học k từ
mới`) đặt DƯỚI bong bóng, không còn card riêng. Nút đóng giữ `dismissComebackToday`.
- Giọng viết Companion: hằng khuôn câu chào ở `apps/dhcb/src/prompts/companionVoice.ts` (KHÔNG
  gọi AI thêm; chỉ khuôn chuỗi cho phần không đến từ `/api/proactive-briefing`).

**KHÔNG LÀM:**

- Không đụng `/api/proactive-briefing` server, không đổi hợp đồng `ProactiveBriefing`.
- Không thay `AvatarSpeaking.tsx` (viseme LED của trang Bạn Đồng Hành) — hai avatar khác mục đích;
  ghi nợ hợp nhất ở P2-11.
- Không animation Canvas/WebGL; không nạp font/asset ngoài.

### ② Điểm chạm

| Việc | Đường dẫn file                                                | Ghi chú                                                                                                          |
| ---- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Sửa  | `packages/core-ui/theme.css`                                  | 3 khối `[data-theme=…]` + `:root` fallback                                                                       |
| Sửa  | `apps/dhcb/tailwind.config.js`                                | `colors.warm`                                                                                                    |
| Thêm | `packages/core-ui/CompanionAvatar.tsx` + `.test.tsx`          |                                                                                                                  |
| Thêm | `packages/core-ui/CompanionBubble.tsx` + `.test.tsx`          |                                                                                                                  |
| Thêm | `apps/dhcb/src/prompts/companionVoice.ts` + golden snapshot   | nếu chuỗi đi vào prompt AI thì thêm vào `golden.test.ts`; ở lát này KHÔNG đi vào prompt AI → chỉ unit test chuỗi |
| Sửa  | `apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx` + test |                                                                                                                  |
| Sửa  | `apps/dhcb/src/pages/core/Home.tsx`                           | gỡ card comeback, truyền `comeback` prop                                                                         |
| Sửa  | `scripts/fixed-color-contrast-audit.ts`                       | thêm `--w-*` vào bảng token được quét                                                                            |
| Sửa  | `e2e/comeback.spec.ts`                                        | selector mới                                                                                                     |

**Ảnh hưởng lan ra:** `codemap -- impact packages/core-ui/theme.css` → toàn app (chỉ THÊM biến,
không sửa biến cũ nên không đổi hành vi). `impact HomeAiBriefingCard.tsx` → `Home.tsx` duy nhất.

### ③ Hợp đồng dữ liệu

```css
/* packages/core-ui/theme.css — giá trị RGB tách khoảng trắng, cùng quy ước --a-* */
[data-theme='blue-sky'] {
  --w-50: 255 251 235;
  --w-100: 254 243 199;
  --w-500: 217 119 6;
  --w-700: 146 64 14;
}
[data-theme='dark-blue'] {
  --w-50: 45 36 18;
  --w-100: 69 52 20;
  --w-500: 251 191 36;
  --w-700: 253 224 71;
}
[data-theme='kid'] {
  --w-50: 253 242 248;
  --w-100: 252 231 243;
  --w-500: 190 24 93;
  --w-700: 131 24 67;
}
```

Quy tắc dùng: nền bong bóng `bg-warm-50` + viền `border-warm-100`; viền/vòng avatar
`warm-500`; **chữ trong bong bóng LUÔN `text-content`** (không `text-warm-*`) để AAA.

```ts
// packages/core-ui/CompanionAvatar.tsx
export type CompanionMood = 'idle' | 'thinking' | 'cheer' | 'hasNote'
export interface CompanionAvatarProps {
  mood?: CompanionMood // mặc định 'idle'
  size?: 32 | 48 | 64 // px, mặc định 48
  /** Có nhãn cho trình đọc màn hình không; mặc định true = aria-hidden (trang trí). */
  decorative?: boolean
  className?: string
}
// packages/core-ui/CompanionBubble.tsx
export interface CompanionBubbleProps {
  variant: 'home' | 'inline' | 'done'
  /** Dòng 1, bắt buộc, ≤ 90 ký tự (cắt bằng CSS line-clamp, KHÔNG cắt chuỗi). */
  lead: string
  /** Dòng 2, ≤ 120 ký tự. */
  detail?: string
  onSpeak?: () => void // hiện nút 🔊 khi có
  onDismiss?: () => void // hiện nút ✕ khi có (chỉ 'inline' và comeback)
  children?: ReactNode // link chữ nhỏ dưới bong bóng
}
// apps/dhcb/src/prompts/companionVoice.ts
export function loiChaoTheoGio(hour: number, name?: string): string // "Chào buổi sáng, Minh."
export function cauQuayLai(daysAway: number): string // "Đã 5 ngày rồi — bắt đầu nhẹ thôi, không cần ôn hết nợ cũ."
```

Trạng thái avatar: `idle` chớp mắt mỗi 6s (CSS keyframe, tắt khi `prefers-reduced-motion`);
`thinking` ba chấm nhấp nháy; `cheer` scale 1→1.08→1 trong 600ms rồi tự về `idle` (component tự
quản bằng `setTimeout`, dọn khi unmount); `hasNote` chấm nhỏ `warm-500` góc phải trên.

**Ca lỗi:** `fetchProactiveBriefing` fail → bong bóng dùng `FALLBACK_SUMMARY` (như hiện tại);
`speak` fail → nút 🔊 disabled 2s rồi bật lại; không throw.

### ④ Tiêu chí chấp nhận

- [ ] **AC-1** `scripts/fixed-color-contrast-audit.ts` chạy xanh với `--w-*`; `text-content` trên
      `bg-warm-50` đo ≥ 7:1 ở cả 3 theme (in số vào PR) — `npx tsx scripts/fixed-color-contrast-audit.ts`.
- [ ] **AC-2** `CompanionAvatar` render `<svg>` với `aria-hidden="true"` khi `decorative` (mặc
      định) và `role="img" aria-label="Bạn Đồng Hành"` khi `decorative={false}`; `mood='cheer'`
      tự về `idle` sau 600ms (fake timers) — `CompanionAvatar.test.tsx`.
- [ ] **AC-3** `CompanionBubble` không bao giờ cắt chuỗi trong JS (`lead` 200 ký tự vẫn nằm nguyên
      trong DOM, chỉ `line-clamp-2`) — test.
- [ ] **AC-4** `HomeAiBriefingCard` không còn import `Bot` từ lucide; vẫn gọi
      `fetchProactiveBriefing` đúng 1 lần; khi có `comeback={ daysAway: 5, … }` thì DOM có
      chuỗi "Đã 5 ngày" và KHÔNG có phần tử `.glass` card riêng — `HomeAiBriefingCard.test.tsx`.
- [ ] **AC-5** `e2e/comeback.spec.ts` xanh với selector mới; `e2e/a11y*.spec.ts` 0 vi phạm.
- [ ] **AC-6** `npx size-limit` JS tăng ≤ 3 kB (dán số).
- [ ] **AC-7** Ảnh chụp 3 theme × 2 bề rộng: avatar và bong bóng là vùng màu ấm DUY NHẤT; nút
      Today vẫn là accent (kiểm bằng mắt, dán ảnh).

### ⑤ Bất biến

| Bất biến                                        | Test canh                                                         |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| Thẻ chào KHÔNG quyết định việc học (S06 AC-14)  | `HomeAiBriefingCard.test.tsx` — không có link tới `/lo-trinh-hoc` |
| Dòng "x/y từ" chỉ hiện khi `showDailyWords`     | test có sẵn, giữ                                                  |
| Comeback chỉ hiện khi `shouldShowComeback(uid)` | `lib/comeback.test.ts` (có sẵn)                                   |
| Mọi theme vẫn 0 vi phạm a11y                    | `e2e/a11y.spec.ts`, `a11y-aaa.spec.ts`                            |

### ⑥ Quy ước riêng

- SVG inline viết tay ≤ 1,5 kB, không import file `.svg` (tránh thêm chunk).
- Animation qua class Tailwind `animate-*` khai trong `tailwind.config.js` keyframes (đã có
  `scale-in`, `pulse-ring`); gói mọi keyframe mới trong `@media (prefers-reduced-motion: no-preference)`.

---

## P0-3 · `GuestHome` — trang chủ cho khách

### ① Phạm vi

**LÀM:**

- Trong `Home.tsx`: khi `isGuest` (từ `useAuth()`), render `GuestHome` thay vì bố cục thường.
- `GuestHome` = 3 khối: (1) `CompanionAvatar` + `CompanionBubble variant="home"` tự giới thiệu
  (chuỗi tĩnh, không gọi API); (2) CTA duy nhất "Bắt đầu — chọn việc đầu tiên" → `/bat-dau`;
  dưới nút là dòng chữ "Không cần tài khoản"; (3) dải môn từ `SUBJECT_ENTRIES` dạng chip
  (`entry.label` → `entry.ctaPath`) + 2 trụ.
- `GuestBanner` (`App.tsx` `AllowGuest`) đổi điều kiện: chỉ hiện khi khách **đã có ít nhất một
  phiên học** (`hasAnyGuestSession()` — đếm khoá `LEARNING_SESSION_PREFIX` trong localStorage
  hoặc `readLocalIntent()` đã có `chosenTaskId`). Trước đó không hiện.
- Không render `HomeUniversalAiBar`, `TodayCard`, streak, `FirstTaskCard` cho khách.

**KHÔNG LÀM:**

- Không đụng `/bat-dau` (`StartByIntent`), không đụng `pickStartAction`.
- Không làm hai "demo 30 giây" (P2-12) — chỉ chừa chỗ (không có placeholder rỗng trong DOM).
- Không đổi `AuthProvider`/`isGuest`.

### ② Điểm chạm

| Việc | Đường dẫn file                                               | Ghi chú                |
| ---- | ------------------------------------------------------------ | ---------------------- |
| Thêm | `apps/dhcb/src/components/Home/GuestHome.tsx` + `.test.tsx`  |                        |
| Thêm | `apps/dhcb/src/lib/guestActivity.ts` + `.test.ts`            | `hasAnyGuestSession()` |
| Sửa  | `apps/dhcb/src/pages/core/Home.tsx`                          | nhánh `isGuest`        |
| Sửa  | `apps/dhcb/src/components/GuestBanner.tsx` + `App.tsx`       | điều kiện hiện         |
| Sửa  | `e2e/start-by-intent.spec.ts`, thêm `e2e/guest-home.spec.ts` |                        |
| Sửa  | `scripts/shots-learning-ux.ts`                               | thêm màn guest         |

**Ảnh hưởng lan ra:** `GuestBanner` được import ở `App.tsx` duy nhất. `Home.tsx` → `App.tsx`.

### ③ Hợp đồng dữ liệu

```ts
// apps/dhcb/src/lib/guestActivity.ts
/** Khách đã làm ít nhất một việc thật trên máy này chưa (phiên học hoặc đã chọn việc ở /bat-dau). */
export function hasAnyGuestSession(): boolean // đọc localStorage, try/catch → false
// GuestHome: không prop. Chuỗi tĩnh:
//  lead:   'Chào bạn. Mình là Bạn Đồng Hành — học cùng bạn mỗi ngày.'
//  detail: 'Từ tiếng Anh tới lập trình, toán, lý, hoá, sinh — bắt đầu từ một việc nhỏ.'
```

Sự kiện: `track('cta_click', { refCode: 'guest_home_start' })` khi bấm CTA (tên event có sẵn).

**Ca lỗi:** localStorage bị chặn → `hasAnyGuestSession()` = false → banner không hiện; GuestHome
vẫn render đầy đủ (không phụ thuộc storage).

### ④ Tiêu chí chấp nhận

- [ ] **AC-1** Với `isGuest = true`, `Home` render `GuestHome` và KHÔNG render `#today-card-heading`,
      ô tìm kiếm, `FirstTaskCard` — `Home.test.tsx`.
- [ ] **AC-2** `GuestHome` có ĐÚNG MỘT `<a>`/`<button>` mang class nút chính (`Button` variant
      primary) và nó trỏ `/bat-dau` — `GuestHome.test.tsx`.
- [ ] **AC-3** Dải môn render đủ `SUBJECT_ENTRIES.length` chip, mỗi chip `href === entry.ctaPath` —
      test.
- [ ] **AC-4** `hasAnyGuestSession()` bảng 4 ca: rỗng → false; có khoá `dhcb_lsession_v1_*` → true;
      có intent `chosenTaskId` → true; storage throw → false.
- [ ] **AC-5** E2E khách mới mở `/`: KHÔNG thấy `GuestBanner`; bấm CTA → URL `/bat-dau`; sau khi
      hoàn tất 1 phiên (dùng helper có sẵn của `learning-session-resume.spec.ts`) quay về `/` →
      thấy `GuestBanner` — `e2e/guest-home.spec.ts`.
- [ ] **AC-6** Thời gian tới CTA: Playwright đo `performance.now()` từ `goto('/')` tới CTA
      `visible` < 3000ms trên CI (ghi số vào PR; mục tiêu sản phẩm 10s tính cả đọc).
- [ ] **AC-7** a11y 3 theme xanh cho `/` ở trạng thái khách (thêm vào danh sách 15 trang nếu
      chưa có ca guest).
- [ ] **AC-8** Ảnh chụp guest 1440 + 390 × 3 theme.

### ⑤ Bất biến

| Bất biến                                                                                  | Test canh                              |
| ----------------------------------------------------------------------------------------- | -------------------------------------- |
| Khách vẫn dùng trọn `/bat-dau` không token (S05)                                          | `e2e/start-by-intent.spec.ts` (có sẵn) |
| Không route nào chuyển từ `AllowGuest` sang `RequireAccount`                              | `e2e/login-redirect.spec.ts` (có sẵn)  |
| Không mặc định tiếng Anh: chip môn thứ tự đúng `SUBJECT_ENTRIES`, không môn nào "nổi" hơn | `GuestHome.test.tsx`                   |

### ⑥ Quy ước riêng

- Đọc `docs/specs/2026-09-15-mo-xem-web-khong-can-dang-nhap.md` §③ trước (luật `AllowGuest`).

---

## P0-4 · Header mobile 4 khe + `focus` ẩn bottom nav

### ① Phạm vi

**LÀM:**

- Dưới 1024px (`lg:hidden` phần tử, hoặc điều kiện JS `useIsDesktopViewport()` khi cần không render):
  ẩn **bộ chuyển Studio** và **nút đổi theme** khỏi header; bộ chuyển Studio vào một mục "Không
  gian" trong trang Hồ sơ (`/trang-ca-nhan`); nút theme đã có ở Hồ sơ/`/cai-dat` — xác nhận rồi
  gỡ ở header mobile.
- Ở trang chủ mobile: gỡ nút "Đồng Hành AI" khỏi header (Orb bottom nav + Ask bar đã là hai lối).
  Trang khác giữ nút này.
- `focus={true}`: ngoài 2 khe đã ẩn, **ẩn `BottomNav`** — thêm cờ qua `document.documentElement.dataset.focus='1'`
  (cùng cơ chế `dataset.sidebar`), `BottomNav` đọc `data-focus` bằng CSS `[data-focus='1'] nav.bottom-nav { display:none }`.
- Nhãn nút Back mobile: giữ icon-only dưới `sm` (đã vậy), `aria-label` = `backLabel` (đã vậy).

**KHÔNG LÀM:**

- Không đụng desktop (`lg:`) header; không đụng `DesktopSidebar` (P1-7).
- Không đổi `PageHeader`.
- Không gỡ streak badge (giữ, đã ẩn khi `focus`).

### ② Điểm chạm

| Việc | Đường dẫn file                                              | Ghi chú                                 |
| ---- | ----------------------------------------------------------- | --------------------------------------- |
| Sửa  | `apps/dhcb/src/components/Layout.tsx` + `.test.tsx`         | điều kiện render 3 nút; `dataset.focus` |
| Sửa  | `apps/dhcb/src/components/BottomNav.tsx`                    | class `bottom-nav`                      |
| Sửa  | `apps/dhcb/src/index.css`                                   | rule `[data-focus='1']`                 |
| Sửa  | `apps/dhcb/src/pages/core/Profile.tsx`                      | mục "Không gian" (danh sách `STUDIOS`)  |
| Sửa  | `e2e/mobile-layout-guards.spec.ts`, `e2e/bottomnav.spec.ts` |                                         |

**Ảnh hưởng lan ra:** `codemap -- impact Layout.tsx` → ~80 trang dùng `Layout` (chỉ đổi header,
không đổi prop → không cần sửa trang nào). `impact BottomNav.tsx` → `App.tsx`.

### ③ Hợp đồng dữ liệu

```ts
// Layout props KHÔNG đổi. Quy tắc render header < 1024px:
//   isHome (pathname === '/'): [Logo] ............ [streak] [avatar]
//   trang thường:              [← back] [title?] ... [AI] [avatar]
//   focus:                     [← back] [extra?] ... [AI-inline?] [avatar]   (không streak, không Studio, không theme; BottomNav ẩn)
// document.documentElement.dataset.focus: '1' khi focus, xoá khi unmount.
```

**Ca lỗi:** không có.

### ④ Tiêu chí chấp nhận

- [ ] **AC-1** Render `Layout` ở viewport 390 (jsdom + `matchMedia` mock): header có ≤ 4 phần
      tử tương tác (`button, a`) trên trang chủ, ≤ 4 trên trang thường, ≤ 3 khi `focus` —
      `Layout.test.tsx` đếm `getAllByRole`.
- [ ] **AC-2** `focus` → `document.documentElement.dataset.focus === '1'`; unmount → xoá — test.
- [ ] **AC-3** Playwright 390: trang bài học Lập trình (`focus`) KHÔNG thấy `nav[aria-label="Điều hướng chính"]`;
      trang chủ THẤY — `e2e/bottomnav.spec.ts`.
- [ ] **AC-4** Playwright 360×740: không phần tử header nào bị `truncate` mất chữ (kiểm
      `scrollWidth <= clientWidth` cho từng nút) — `mobile-layout-guards.spec.ts`.
- [ ] **AC-5** Trang Hồ sơ có mục "Không gian" liệt kê đủ `STUDIOS.length` mục — test Profile.
- [ ] **AC-6** a11y 3 theme xanh; ảnh chụp 390 trước/sau cho `/`, một trang thường, một trang focus.

### ⑤ Bất biến

| Bất biến                                                 | Test canh                                                         |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| Nút Back giữ nhãn đích thật (changelog 0359)             | `e2e/programming-lesson.spec.ts`, `english-tools-context.spec.ts` |
| Phím `/` vẫn focus ô hỏi chính (audit B20)               | `e2e/home-quick-ask.spec.ts`                                      |
| Reachability (kéo màn) vẫn hoạt động ở trang không focus | `e2e/mobile-layout-guards.spec.ts`                                |
| Desktop header không đổi                                 | ảnh chụp 1440 trước/sau giống nhau (diff pixel = 0)               |

---

# P1 — nhịp học, sau phiên, điều hướng, URL

## P1-5 · `WeekRhythm` — 7 chấm tuần + nhiệm vụ + huy hiệu mới nhất

### ① Phạm vi

**LÀM:**

- Component `WeekRhythm` đặt ngay dưới `TodayCard` (mobile) / cột phải trên cùng (desktop).
- 7 chấm T2→CN: ● ngày có học (`DayActivity.active`), ○ ngày đã qua không học, ◐ hôm nay chưa
  học, ▢ ngày chưa tới (mờ), kèm chữ "Tuần này 4/7 ngày" (số ngày học / 7, KHÔNG phải / mục tiêu —
  mục tiêu tuần vẫn ở `/tien-do`).
- Dòng 2: "Nhiệm vụ 1/3" từ `fetchQuestsStatus()` (đếm quest `canClaim` + đã claim hôm nay; nếu
  API null → ẩn dòng) · "Huy hiệu mới: <tên>" từ `lib/achievements.ts` (mới nhất theo thời gian
  mở khoá; không có → ẩn).
- Cả khối là một `<Link to="/nhiem-vu">`.
- Ẩn hoàn toàn khi: khách, hoặc `getWeekDays(uid)` toàn `active=false` VÀ chưa từng có streak
  (`getStreak(uid) === 0`) — không hiện "0/7".

**KHÔNG LÀM:**

- Không đổi cách tính streak/tuần (`storage.ts`, `weeklyGoal.ts`).
- Không đổi `/nhiem-vu`, `QuestsPanel`.
- Không tạo API mới; không gọi AI.

### ② Điểm chạm

| Việc | Đường dẫn file                                               | Ghi chú                                |
| ---- | ------------------------------------------------------------ | -------------------------------------- |
| Thêm | `apps/dhcb/src/lib/home/weekRhythm.ts` + `.test.ts`          | thuần: `buildWeekRhythm`               |
| Thêm | `apps/dhcb/src/components/Home/WeekRhythm.tsx` + `.test.tsx` |                                        |
| Sửa  | `apps/dhcb/src/pages/core/Home.tsx`                          | lắp vào 2 bố cục                       |
| Sửa  | `apps/dhcb/src/lib/achievements.ts`                          | thêm `latestUnlocked(uid)` nếu chưa có |
| Sửa  | `e2e/today-plan.spec.ts` hoặc thêm `e2e/week-rhythm.spec.ts` |                                        |

### ③ Hợp đồng dữ liệu

```ts
// apps/dhcb/src/lib/home/weekRhythm.ts
export type DayDot = 'done' | 'missed' | 'today-pending' | 'future'
export interface WeekRhythmModel {
  dots: DayDot[] // luôn length 7, index 0 = T2
  daysDone: number // 0..7
  quests?: { done: number; total: number }
  latestBadge?: { id: string; label: string }
  visible: boolean // false = không render gì
}
export function buildWeekRhythm(input: {
  weekDays: DayActivity[] // getWeekDays(uid): T2 → hôm nay
  todayIndex: number // 0..6
  streak: number
  quests: QuestsStatus | null
  latestBadge: { id: string; label: string } | null
}): WeekRhythmModel
```

**Ca lỗi:** `fetchQuestsStatus()` reject/null → `quests` undefined (dòng ẩn), không toast.

### ④ Tiêu chí chấp nhận

- [ ] **AC-1** `buildWeekRhythm` bảng ≥ 8 ca: T2 chưa học (`[today-pending, future×6]`); CN đủ
      7; giữa tuần có nghỉ; tuần rỗng + streak 0 → `visible=false`; tuần rỗng + streak>0 →
      `visible=true` — `weekRhythm.test.ts`.
- [ ] **AC-2** DOM: đúng 7 phần tử `[data-dot]` với `data-dot` ∈ 4 giá trị; `aria-label` toàn
      khối dạng "Tuần này học 4 trên 7 ngày" — `WeekRhythm.test.tsx`.
- [ ] **AC-3** Không có ký tự `%` và không có chuỗi khớp `/\b[ABC][12]\b/` hay `/\bP[1-6]\b/`
      trong DOM của `WeekRhythm` — test bất biến.
- [ ] **AC-4** Khách → `Home` không render `WeekRhythm` — `Home.test.tsx`.
- [ ] **AC-5** E2E: sau khi hoàn tất một hoạt động (helper sẵn có), quay về `/`, chấm hôm nay
      `data-dot="done"` — spec E2E.
- [ ] **AC-6** a11y + ảnh chụp 3 theme × 2 bề rộng; size-limit ≤ +1,5 kB.

### ⑤ Bất biến

| Bất biến                                                                                                | Test canh                     |
| ------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Chấm "done" chỉ khi `DayActivity.active` thật (không vẽ ✓ giả — nguyên tắc của `WeeklyGoalCelebration`) | `weekRhythm.test.ts`          |
| Không con số chẩn đoán trên trang chủ                                                                   | AC-3                          |
| `getWeekDays` không đổi chữ ký                                                                          | `weeklyGoal.test.ts` (có sẵn) |

---

## P1-6 · `SessionDone` — một màn kết gộp ba celebration

### ① Phạm vi

**LÀM:**

- `SessionDone` (overlay, dựa trên `Celebration.tsx`) hiện khi một hoạt động học kết thúc, gồm 3
  tầng có điều kiện: (1) `CompanionAvatar mood="cheer"` + `CompanionBubble variant="done"` nói
  **một sự thật** của phiên; (2) `WeekRhythm` thu gọn (chỉ hàng chấm) + dòng streak/nhiệm vụ nếu
  vừa đổi; (3) CTA phụ "Thêm 3 phút? Ôn k thẻ" (khi có SRS due) + link chữ "Về trang chủ".
- Gate gộp: `StreakCelebration` (`shouldCelebrateStreak`) và `WeeklyGoalCelebration`
  (`shouldCelebrateWeeklyGoal`) KHÔNG còn tự bật overlay riêng; nội dung của chúng thành tầng (2).
  `markWeeklyGoalCelebrated`/mark streak vẫn gọi để không lặp.
- Query `?xong=1` gắn vào URL bài khi mở overlay (`history.replaceState`), F5/Back giữ overlay;
  đóng overlay thì xoá query.
- Nơi gọi: những trang hiện gọi `StreakCelebration`/`WeeklyGoalCelebration`
  (`studyTabs/TodayLesson.tsx`, `pages/subjects/english/Challenge.tsx`) + bài Lập trình + bài STEM
  (điểm "hoàn thành" đã có evidence).

**KHÔNG LÀM:**

- Không đụng kết quả chấm chi tiết (IELTS band ở luyện viết/nói) — màn riêng, người dùng mở.
- Không xoá `Celebration.tsx` (dùng lại), không xoá `VocabMilestone`.
- Không tính "sự thật" bằng AI; chỉ từ dữ liệu phiên (§③).

### ② Điểm chạm

| Việc | Đường dẫn file                                                                                                                            | Ghi chú                        |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Thêm | `apps/dhcb/src/lib/session/sessionFact.ts` + `.test.ts`                                                                                   | thuần: `buildSessionFact`      |
| Thêm | `apps/dhcb/src/components/SessionDone.tsx` + `.test.tsx`                                                                                  |                                |
| Sửa  | `StreakCelebration.tsx`, `WeeklyGoalCelebration.tsx`                                                                                      | thành sub-block, không overlay |
| Sửa  | `studyTabs/TodayLesson.tsx`, `pages/subjects/english/Challenge.tsx`, `pages/programming/Lesson*.tsx`, `pages/learning/StemLessonView.tsx` | gọi `SessionDone`              |
| Sửa  | `e2e/quiz-session.spec.ts`, `e2e/learning-session-resume.spec.ts`                                                                         |                                |

### ③ Hợp đồng dữ liệu

```ts
// apps/dhcb/src/lib/session/sessionFact.ts
export interface SessionOutcome {
  subjectId: string
  contentId: string
  kind: 'lesson' | 'quiz' | 'speaking' | 'writing' | 'review' | 'project-step'
  steps: number // số bước đã làm
  correct?: number // số câu đúng (quiz/review)
  total?: number
  newItems?: string[] // từ/khái niệm lần đầu đúng (≤ 3, đã lọc)
  durationSec: number
}
export interface SessionFact {
  lead: string // "Xong rồi! Bạn vừa nói được 5 câu."
  detail?: string // "'I'd love to' là lần đầu bạn dùng đúng."
}
export function buildSessionFact(o: SessionOutcome): SessionFact
// Luật: lead LUÔN có một số đếm việc đã làm (bước/câu/thẻ); detail chỉ khi có newItems;
// KHÔNG có "%", không "band", không "trình độ". Câu cảm thán một mình ("Tuyệt vời!") là cấm.

export interface SessionDoneProps {
  outcome: SessionOutcome
  uid: string
  srsDue: number // 0 = ẩn CTA phụ
  onClose: () => void // về trang chủ hoặc đóng
  onMore?: () => void // CTA phụ
}
```

**Ca lỗi:** `outcome.steps === 0` → không mở overlay (không ăn mừng việc chưa làm). `srsDue < 0`
→ coi như 0.

### ④ Tiêu chí chấp nhận

- [ ] **AC-1** `buildSessionFact` bảng ≥ 12 ca (6 `kind` × có/không `newItems`); mọi `lead` khớp
      `/\d/` và không khớp `/%|band|trình độ|Tuyệt vời!$/` — test.
- [ ] **AC-2** `SessionDone` render đúng 1 nút chính + ≤ 1 CTA phụ; có `role="dialog"` `aria-modal`
      và focus trap (dùng `useDialogBehavior` có sẵn) — test.
- [ ] **AC-3** Trong một lần hoàn thành có cả streak mốc 7 lẫn đạt mục tiêu tuần: DOM chỉ có MỘT
      `[role="dialog"]` — test tích hợp với `TodayLesson`.
- [ ] **AC-4** Mở overlay → URL có `?xong=1`; reload (E2E) → overlay vẫn hiện; đóng → query mất —
      `e2e/quiz-session.spec.ts`.
- [ ] **AC-5** `steps === 0` → không dialog — test.
- [ ] **AC-6** `prefers-reduced-motion` → không confetti (đã có ở `Celebration`), avatar không
      `cheer` animation — test class.
- [ ] **AC-7** a11y (thêm trang có overlay vào `a11y-modals.spec.ts`), ảnh chụp 3 theme × 2.

### ⑤ Bất biến

| Bất biến                                              | Test canh                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| Streak/tuần chỉ mừng 1 lần (mark* vẫn ghi)            | `storage.test.ts` `shouldCelebrateStreak`, `weeklyGoal.test.ts` |
| Chỉ ăn mừng thành tựu thật (`Celebration` nguyên tắc) | AC-5                                                            |
| Phiên S08 vẫn đóng đúng (S11)                         | `e2e/learning-session-resume.spec.ts`                           |

---

## P1-7 · Sidebar 10 → 7 mục + nhãn bottom nav đồng bộ

### ① Phạm vi

**LÀM (desktop `DesktopSidebar.tsx`):**

- `MAIN_NAV` = Trang chủ · **Góc học tập ▾** (giữ `SUBJECT_CHILDREN`) · Ôn tập · Bạn Đồng Hành ·
  **Sự nghiệp & Đời sống ▾** (nhóm mới gộp `career` + `worklife`, mục con = 2 studio đó).
- Gỡ "Luyện tập" khỏi `MAIN_NAV` (đường `/luyen-tap` vẫn tồn tại; vào từ mục con môn/hub).
- `CORE_BOTTOM` = Tiến độ · Hồ sơ. "Nâng cấp" thành dòng nhỏ dưới avatar: "Free · Nâng cấp" (link
  `/nang-cap`), không màu amber ở trạng thái thường, `text-content-muted`, hover → `text-content`.
- Cập nhật `ACTIVE_ORDER`, `navTree.ts` (nhóm mới), `resolveActiveNav` không đổi.

**LÀM (mobile `BottomNav.tsx`):**

- Tab 4 "Luyện tập" → "Ôn tập", `to="/goc-hoc-tap/on-tap"`, active theo `REVIEW_PATHS`.
- Nhãn: Trang chủ · Học · Đồng Hành · Ôn tập · Tôi (≤ 8 ký tự).
- Bỏ `scale-105/110` khi active; giữ đổi màu; thêm chấm `hasNote` cho Orb (đọc từ prop
  `companionHasNote?: boolean`, mặc định false — nguồn dữ liệu nối ở P2-11).

**KHÔNG LÀM:**

- Không đổi route nào; không đổi `STUDIOS`; không đổi `NAV_HIDDEN_PATHS`.
- Không đổi cơ chế thu gọn `--sidebar-w`.

### ② Điểm chạm

| Việc | Đường dẫn file                                                                                                 | Ghi chú  |
| ---- | -------------------------------------------------------------------------------------------------------------- | -------- |
| Sửa  | `components/DesktopSidebar.tsx` + `.test.tsx`                                                                  |          |
| Sửa  | `components/BottomNav.tsx`                                                                                     |          |
| Sửa  | `lib/navTree.ts` (+ test), `lib/navPaths.ts` (thêm `CAREER_LIFE_PATHS = [...CAREER_PATHS, ...WORKLIFE_PATHS]`) |          |
| Sửa  | `e2e/bottomnav.spec.ts`, `e2e/v2-hubs.spec.ts`, `e2e/review-hub.spec.ts`, `Layout.test.tsx`                    | nhãn/tab |

**Ảnh hưởng lan ra:** `codemap -- impact lib/navPaths.ts` → `DesktopSidebar`, `BottomNav`,
`Layout`, `breadcrumb.ts` — chạy và dán danh sách vào PR.

### ③ Hợp đồng dữ liệu

```ts
// navPaths.ts
export const CAREER_LIFE_PATHS: readonly string[] // = CAREER_PATHS ∪ WORKLIFE_PATHS, không trùng
// BottomNav
interface Props {
  triggerHandlers?
  isReachabilityOpen?
  companionHasNote?: boolean
}
```

### ④ Tiêu chí chấp nhận

- [ ] **AC-1** `DesktopSidebar` render đúng 7 `<a>` cấp 1 khi mọi nhóm đóng (đếm
      `getAllByRole('link')` trừ mục con) — test.
- [ ] **AC-2** Không mục nào xuất hiện hai lần (tập `href` cấp 1 + cấp 2 không trùng) — test.
- [ ] **AC-3** `resolveActiveNav` cho `/su-nghiep`, `/cong-viec`, `/cuoc-song` → mục "Sự nghiệp &
      Đời sống"; `/luyen-tap` → "Góc học tập" (không còn mục riêng) — test bảng.
- [ ] **AC-4** `BottomNav`: 5 tab, nhãn đúng, tab 4 `href="/goc-hoc-tap/on-tap"`, không class
      `scale-1*` — test + E2E.
- [ ] **AC-5** Playwright 360: không nhãn nào bị cắt (`scrollWidth <= clientWidth`).
- [ ] **AC-6** Link "Nâng cấp" vẫn tồn tại trong sidebar (`href="/nang-cap"`) — test (bảo vệ
      chuyển đổi VIP).
- [ ] **AC-7** a11y + ảnh chụp 1440 (sidebar mở/thu) + 390.

### ⑤ Bất biến

| Bất biến                                                      | Test canh                          |
| ------------------------------------------------------------- | ---------------------------------- |
| Thu gọn sidebar vẫn ghi `dataset.sidebar` + `--sidebar-w`     | `DesktopSidebar.test.tsx` (có sẵn) |
| `/goc-hoc-tap/on-tap` sáng "Ôn tập", không sáng "Góc học tập" | test có sẵn (S12-1), giữ           |
| Mọi route trong `LEARNING_PATHS` vẫn làm sáng đúng một mục    | `navPaths.test.ts`                 |

---

## P1-8 · `SubjectSpaceList` — môn đang học lên đầu, trạng thái bằng chữ

### ① Phạm vi

**LÀM:**

- Tách khối môn (`Home.tsx` từ `SUBJECT_ICON` tới hết `subjectSpaces`) thành
  `components/Home/SubjectSpaceList.tsx`.
- Sắp xếp: môn có trong `todayPlan.subjectsSeen` lên đầu (giữ thứ tự registry trong từng nhóm).
- Mỗi thẻ 1 dòng trạng thái: "đang học · <tên chặng>" (từ `TodayPlan` item của môn đó nếu có,
  `item.title`) hoặc "chưa bắt đầu". Không thanh %, không số.
- Mobile: 3 thẻ đầu + nút "Xem tất cả (6 môn)" mở phần còn lại tại chỗ (`<details>` hoặc state);
  desktop: lưới 2 cột đủ.
- Empty state (C3, `todayPlan.primary.kind === 'pick'`): nút thẻ đổi thành "Thử 5 phút".

**KHÔNG LÀM:** không đổi `SUBJECT_ENTRIES`, không đổi `ctaPath`, không thêm môn.

### ② Điểm chạm

| Việc | Đường dẫn file                                                                             |
| ---- | ------------------------------------------------------------------------------------------ |
| Thêm | `components/Home/SubjectSpaceList.tsx` + `.test.tsx` + `lib/home/orderSubjects.ts` (+test) |
| Sửa  | `pages/core/Home.tsx`, `Home.test.tsx`, `e2e/subjects-catalog-states.spec.ts`              |

### ③ Hợp đồng dữ liệu

```ts
export function orderSubjects(entries: SubjectEntry[], seen: string[]): SubjectEntry[] // ổn định
export interface SubjectSpaceListProps {
  plan: TodayPlan | null
  isDesktop: boolean
  initialVisible?: number // mặc định 3 (mobile)
}
```

### ④ Tiêu chí chấp nhận

- [ ] **AC-1** `orderSubjects` ổn định: `seen=['programming']` → programming đầu, còn lại nguyên
      thứ tự; `seen=[]` → nguyên thứ tự; id lạ trong `seen` bỏ qua — test.
- [ ] **AC-2** Mobile render 3 thẻ + nút "Xem tất cả"; bấm → đủ `SUBJECT_ENTRIES.length` — test.
- [ ] **AC-3** Không ký tự `%`; chuỗi trạng thái ∈ {"đang học · …", "chưa bắt đầu"} — test.
- [ ] **AC-4** `kind:'pick'` → mọi thẻ có nút "Thử 5 phút" trỏ `ctaPath` — test.
- [ ] **AC-5** Ảnh chụp + a11y.

### ⑤ Bất biến

| Bất biến                                                    | Test canh                     |
| ----------------------------------------------------------- | ----------------------------- |
| Không mặc định tiếng Anh: `seen=[]` không đưa `english` lên | `orderSubjects.test.ts`       |
| Thẻ trỏ đúng `entry.ctaPath` (host routing S02)             | `Home.test.tsx` (có sẵn, giữ) |

---

## P1-9 · Một khuôn URL Góc học tập — ba PR

Bảng ánh xạ đầy đủ: spec nền §F5. Dưới đây là phần thi hành.

### P1-9a · Lập trình → `/goc-hoc-tap/programming/*`

**① LÀM:** đổi hằng `PROGRAMMING_PREFIX` (thêm nếu chưa có) trong `lib/programmingRoutes.ts` =
`/goc-hoc-tap/programming`; mọi `duongDan*` dựng từ hằng; bậc dùng đốt `bac`
(`duongDanBac` → `${PREFIX}/bac/${slug}`); thêm `<Route path="/lap-trinh/*">` → component
`LegacyProgrammingRedirect` ánh xạ 13 mẫu cũ sang mới bằng `<Navigate replace>` (giữ query
`?khoa=`); `SUBJECTS_ON_APP_HOST.programming = '/goc-hoc-tap/programming'`; cập nhật
`navPaths.ts` (`LEARNING_PATHS` thêm prefix mới, giữ `/lap-trinh` để redirect vẫn sáng mục),
`navTree.ts`, `breadcrumb.ts`, sitemap (nếu có script), `e2e/programming-*.spec.ts`,
`route-alias.spec.ts`.
**KHÔNG:** không đổi `lessonId`/`courseId`/`specId`; không đổi khoá tiến độ; không đổi server
ownership (Lập trình vẫn app host — kiểm `subjectsRouting.ts` `decideRedirect` với path mới không
đẩy sang host hoc-tap).

**③** `export const PROGRAMMING_PREFIX = '/goc-hoc-tap/programming'`;
`export function legacyProgrammingPath(pathname: string, search: string): string | null` (thuần,
test bảng 13 ca + 3 ca không khớp → null).

**④ AC:**

- [ ] `legacyProgrammingPath` bảng đủ 13 dòng ánh xạ §F5 + giữ `?khoa=` — test.
- [ ] `grep -rn "'/lap-trinh" apps/dhcb/src --include=*.ts --include=*.tsx` chỉ còn trong file
      redirect + `navPaths.ts` — ghi output vào PR.
- [ ] E2E lặp qua 13 URL cũ: mỗi URL cuối cùng `page.url()` là URL mới và trang render đúng
      tiêu đề — `e2e/route-alias.spec.ts`.
- [ ] `decideRedirect({ pathname: '/goc-hoc-tap/programming/bai-hoc/x', host: subjects })` → về
      app host (test `subjectsRouting.test.ts`).
- [ ] Toàn bộ `e2e/programming-*.spec.ts` xanh sau khi đổi selector URL.

**⑤ Bất biến:** khoá tiến độ Lập trình không đổi (`programmingProgress.test.ts`); `?khoa=` giữ
qua redirect (S07 AC-7); `lessonsLazy.test.ts` không đổi.

### P1-9b · Tiếng Anh → `/goc-hoc-tap/english/*`

**① LÀM:** tạo `lib/englishRoutes.ts` với `ENGLISH_PREFIX = '/goc-hoc-tap/english'` và hàm
`duongDanLoTrinh(levelId?)`, `duongDanTroTruyen()`, `duongDanLuyenNoi()`, `duongDanLuyenViet()`,
`duongDanLuyenNghe()`, `duongDanTuDien(word?)`, `duongDanOnThi()`, `duongDanBaiHoc()`,
`duongDanTruyen(id?)`, `duongDanCauThongDung()`, `duongDanSoTayLoiSai()`, `duongDanThuThach()`;
thay MỌI chuỗi cứng (`Home.tsx SUBJECT_SHORTCUTS`, `navTree.ts:61-82`, `today/englishNext.ts
duongDanCapCefr`, `comeback`, `Layout`…) bằng hàm; 12 redirect `<Route path="/<cũ>/*">`;
`navPaths.ts` thêm prefix mới; `e2e/english-*.spec.ts`, `outline-english.spec.ts`,
`route-alias.spec.ts`.
**KHÔNG:** không đổi `levelId` CEFR (`/lo-trinh/A2` giữ mã), không đổi `/tu-vung/:word` thành
khuôn `--` (ngoại lệ đã chốt ở CLAUDE.md §7 — chỉ dời prefix).

**③** `legacyEnglishPath(pathname, search): string | null` thuần, bảng 12 + ca `/tu-vung/hello` →
`/goc-hoc-tap/english/tu-dien/hello`.

**④ AC:**

- [ ] `grep -rnE "'/(lo-trinh-hoc|tro-truyen|luyen-noi|luyen-viet|luyen-nghe|tu-dien|tu-vung|on-thi|bai-hoc|truyen-song-ngu|cau-thong-dung|so-tay-loi-sai|thu-thach)" apps/dhcb/src` chỉ còn file redirect + `navPaths.ts`.
- [ ] `englishNext` trả `href` bắt đầu bằng `/goc-hoc-tap/english/lo-trinh/` — cập nhật
      `englishNext.test.ts`.
- [ ] S06 AC-3 đổi grep: `grep -rn "english/lo-trinh" packages/core-learner/today/` = 0 dòng.
- [ ] E2E 12 URL cũ → mới; `english-tools-context.spec.ts` nhãn Back vẫn "Tiếng Anh".
- [ ] Golden snapshot prompt KHÔNG đổi (`golden.test.ts` xanh không `-u`) — URL không nằm trong
      prompt.

**⑤ Bất biến:** không mặc định tiếng Anh (S06 AC-3, grep đổi như trên); `SUBJECTS_ON_APP_HOST.english`
giữ `/goc-hoc-tap/english`.

### P1-9c · Server, sitemap, SEO

**① LÀM:** `apps/server/src/subjectsRouting.ts`: thêm test khẳng định 2 prefix mới thuộc app host
(ownership theo độ sâu đã có); nginx: thêm `location ^~ /lap-trinh/ { return 301 … }` vào
`docs/deploy-vps-ubuntu.md` (việc TAY — ghi vào `PROGRESS.md` mục việc tay) — client redirect đã
đủ cho người dùng, 301 chỉ để bot; sitemap (nếu có script sinh) dùng URL mới; thêm dòng vào
`PROGRESS.md`: "đo Google Search Console sau 14 ngày".
**KHÔNG:** không đổi hostname, không đổi `LEGACY_SUBJECTS_PREFIXES`.

**④ AC:** `subjectsRouting.test.ts` thêm ≥ 4 ca; `docs/deploy-vps-ubuntu.md` có khối nginx;
`PROGRESS.md` có việc tay.

---

# P2 — chiều sâu

## P2-10 · `buildProgressStory` — ba câu "Bạn đã…"

### ① Phạm vi

**LÀM:** hàm thuần từ dữ liệu 7 ngày (`getActivityCalendar(uid, 7)`, SRS stats, số bài xong theo
môn từ `TodayPlan`/evidence cache) → ≤ 3 câu; component `ProgressStory` ở cột phải desktop trang
chủ và đầu trang `/tien-do`; mobile trang chủ ẩn (chỉ ở `/tien-do`).
**KHÔNG:** không gọi AI; không câu nào chứa %, band, bậc; không so sánh với người khác.

### ② Điểm chạm

`lib/progress/buildProgressStory.ts` (+test) · `components/ProgressStory.tsx` (+test) ·
`pages/core/Home.tsx` (cột phải) · `pages/core/Dashboard.tsx` (`/tien-do`) · E2E ảnh chụp.

### ③ Hợp đồng

```ts
export interface StoryInput {
  days7: DayActivity[] // cũ → mới
  srs: { reviewed7d: number; correct7d: number }
  lessonsDone7d: Array<{ subjectId: string; count: number }>
  newWords7d: number
  streak: number
}
export interface StoryLine {
  text: string
  icon: 'calendar' | 'brain' | 'book' | 'flame'
}
export function buildProgressStory(i: StoryInput): StoryLine[] // 0..3, ưu tiên: streak → bài xong → ôn đúng → ngày học
```

Khuôn câu (cố định, test snapshot chuỗi): "Bạn học 4 ngày trong 7 ngày qua." · "Bạn ôn đúng 18/24
thẻ tuần này." · "Bạn xong 3 bài Lập trình." · "Chuỗi 5 ngày — cứ đều thế." Con số ở đây là
**đếm việc đã làm**, không phải điểm năng lực (được phép theo luật 1).

### ④ AC

- [ ] Bảng ≥ 10 ca; input rỗng → `[]`; không chuỗi nào khớp `/%|band|trình độ|\b[ABC][12]\b/`.
- [ ] Snapshot chuỗi (`toMatchInlineSnapshot`) để đổi chữ là có chủ đích.
- [ ] `Home` mobile không render `ProgressStory`; desktop có — `Home.design.test.ts`.
- [ ] `/tien-do` render `ProgressStory` trên cùng, trước biểu đồ.

### ⑤ Bất biến: chẩn đoán không phải màn hình chính (AC regex); `getActivityCalendar` chữ ký giữ.

## P2-11 · Companion inline trong phiên học

### ① Phạm vi

**LÀM:** `CompanionInline` (bong bóng đáy, `CompanionBubble variant="inline"`, `CompanionAvatar
size=32`) gắn vào `Layout focus` qua prop mới `companionNote?: { lead: string; detail?: string } | null`;
nguồn nội dung lát này = **gợi ý tất định** từ bài (STEM: `hint` của câu đang làm; Lập trình:
`feedbackPrompt` kết quả đã có; Anh: câu sửa lỗi TTS đã có) — KHÔNG gọi AI thêm; vuốt xuống/✕ ẩn
(nhớ theo phiên `sessionStorage`); bấm avatar → `/ban-dong-hanh?hoi=<ngữ cảnh>`; Orb bottom nav
nhận `companionHasNote` (P1-7) = có note chưa đọc.
Thứ tự môn: Tiếng Anh (luyện nói/viết đã có dữ liệu sửa lỗi) → Lập trình → STEM.
**KHÔNG:** không mở WebSocket/voice; không tự phát tiếng; không chặn nội dung (bong bóng
`position: sticky bottom` trên CTA đáy, chiều cao ≤ 96px).

### ③ Hợp đồng

```ts
export interface CompanionNote {
  id: string
  lead: string
  detail?: string
  askContext?: string
}
// Layout prop: companionNote?: CompanionNote | null
// lib/companion/noteStore.ts: markRead(id), isRead(id) — sessionStorage, try/catch
```

### ④ AC

- [ ] Bong bóng chỉ render khi `focus && companionNote && !isRead(id)` — `Layout.test.tsx`.
- [ ] Chiều cao bong bóng ≤ 96px ở 390 (Playwright `boundingBox`).
- [ ] Không phần tử nào của nội dung bài bị che: CTA đáy vẫn `visible` và click được khi bong
      bóng hiện — E2E.
- [ ] Ẩn rồi reload: vẫn ẩn trong phiên; tab mới: hiện lại — E2E.
- [ ] `grep` không có `fetch('/api/agent` trong `CompanionInline` — lát này không gọi AI.
- [ ] a11y: bong bóng `role="status"` `aria-live="polite"`, nút ✕ `aria-label`.

### ⑤ Bất biến: `focus` vẫn ẩn Studio/streak/bottom nav (P0-4 test); đếm lượt AI không tăng (không gọi AI).

## P2-12 · Chip gợi ý Ask bar + hai demo 30 giây cho khách

### ① Phạm vi

**LÀM:** (a) `HomeUniversalAiBar` nhận `suggestions: string[]` (≤ 3) dựng bởi
`buildAskChips(plan: TodayPlan | null): string[]` thuần ("Giải thích bài đang dở" khi có `resume`;
"Tôi có 10 phút, học gì?" luôn; "Tạo lịch tuần này" khi có ≥ 2 môn); bấm chip →
`duongDanHoiDongHanh(cau)` = `/ban-dong-hanh?hoi=<encodeURIComponent>`; trang Bạn Đồng Hành đọc
`hoi` điền sẵn ô nhập (không tự gửi). (b) Hai route công khai `/thu-ngay/noi-mot-cau` (một câu
tiếng Anh, STT + TTS sửa lỗi — dùng `/api/stt` + `/api/tts` với hạn mức khách sẵn có) và
`/thu-ngay/chay-mot-dong` (một ô `CodeEditor` chạy `print("Xin chào")` bằng runner sẵn có của
`/lap-trinh/chay-thu`); mỗi demo ≤ 30 giây, kết thúc bằng `SessionDone` rút gọn + lời mời đăng
ký; `GuestHome` thêm 2 chip "thử ngay".
**KHÔNG:** không tạo API mới; không tăng hạn mức khách; không lưu gì ngoài `hasAnyGuestSession`.

### ② Điểm chạm

`lib/home/askChips.ts` (+test) · `lib/homeRoutes.ts` (`duongDanHoiDongHanh`, `duongDanThuNgay`) ·
`HomeUniversalAiBar.tsx` · `pages/companion/*` (đọc `hoi`) · `pages/core/TryNow*.tsx` (2 trang,
`AllowGuest`) · `App.tsx` routes · `GuestHome.tsx` · `e2e/guest-home.spec.ts`, `home-quick-ask.spec.ts`.

### ④ AC

- [ ] `buildAskChips` bảng 6 ca; kết quả ≤ 3, không trùng.
- [ ] Bấm chip → URL `/ban-dong-hanh?hoi=…`; ô nhập có sẵn chữ; KHÔNG có request `/api/agent`
      cho tới khi bấm gửi — E2E network assert.
- [ ] `/thu-ngay/*` mở được khi khách; sau khi xong → `hasAnyGuestSession()===true` → về `/` thấy
      `GuestBanner`.
- [ ] Demo nói: nếu `/api/stt` trả lỗi hạn mức → màn lỗi có nút "Đăng ký để có 30 lượt/ngày",
      không crash — E2E mock 429.
- [ ] Route mới trong `AllowGuest`; `e2e/login-redirect.spec.ts` thêm 2 URL.
- [ ] a11y + ảnh chụp.

### ⑤ Bất biến: đếm lượt AI server-side vẫn áp cho khách (`session-cap.spec.ts`); `/` chính là

`homeRoutes.ts` dựng, không ghép chuỗi (grep `'/ban-dong-hanh?hoi'` = 0 ngoài file đó).

## P2-13 · Rà `prefers-reduced-motion` toàn app

### ① Phạm vi

**LÀM:** một rule chung trong `index.css` `@media (prefers-reduced-motion: reduce) { .animate-*,
[class*="animate-"] { animation: none !important; transition-duration: 0.01ms !important } }`
(giữ đổi màu); rà `grep -rn "animate-\|transition-transform" apps/dhcb/src packages/core-ui` và
`confetti.ts`, `LessonAnimation.tsx`, `Celebration.tsx` (đã có) — bảng kết quả trong PR; test E2E
bật `reducedMotion: 'reduce'` chụp 5 trang, `getComputedStyle().animationName === 'none'` cho
mọi phần tử có class `animate-`.
**KHÔNG:** không xoá animation cho người không bật giảm chuyển động; không đụng `pop-correct`/`shake`
semantics (chúng vẫn chạy khi không reduce).

### ④ AC

- [ ] E2E `reducedMotion:'reduce'`: 0 phần tử `animate-*` có `animationName !== 'none'` trên `/`,
      bài Lập trình, bài STEM, luyện nói, `/tien-do`.
- [ ] `UiNoise.design.test.ts` mở rộng: mọi keyframe mới trong `tailwind.config.js` từ P0-2 trở
      đi phải có tên trong danh sách được rule chung phủ.
- [ ] Không thay đổi ảnh chụp ở chế độ bình thường (diff pixel = 0 trên 3 trang mẫu).

---

## 4. Sự kiện đo (thêm vào `AnalyticsEvent`, chỉ những gì cần)

| Sự kiện                          | Lát   | Khi nào                      | Mục tiêu đo                              |
| -------------------------------- | ----- | ---------------------------- | ---------------------------------------- |
| `cta_click` (có sẵn)             | P0-3  | `refCode:'guest_home_start'` | guest chạm CTA / lượt xem                |
| `daily_plan_click` (có sẵn)      | P0-1  | giữ                          | mở app → vào phiên                       |
| `session_done_view`              | P1-6  | mở `SessionDone`             | tỉ lệ hoàn thành phiên                   |
| `session_done_more`              | P1-6  | bấm "Thêm 3 phút"            | tỉ lệ nhận lời mời                       |
| `try_now_start` / `try_now_done` | P2-12 | demo khách                   | chuyển đổi khách → đăng ký sau phiên đầu |

## 5. Ngân sách & đo (dán vào mỗi PR)

| Lát      | JS dự kiến                                        | Ghi chú                                       |
| -------- | ------------------------------------------------- | --------------------------------------------- |
| P0-1     | ≤ +0,3 kB                                         |                                               |
| P0-2     | ≤ +3 kB                                           | SVG inline + 2 component                      |
| P0-3     | ≤ +1,5 kB                                         | nếu vượt: `lazy(() => import('./GuestHome'))` |
| P0-4     | ≈ 0                                               |                                               |
| P1-5     | ≤ +1,5 kB                                         |                                               |
| P1-6     | ≤ +2 kB                                           | dùng lại `Celebration`                        |
| P1-7/8/9 | ≈ 0                                               | redirect components nhỏ                       |
| P2-*     | P2-12 hai trang mới PHẢI lazy (không vào initial) |                                               |

Tổng P0+P1 ≤ +9 kB → 144,4 kB, dưới trần 150 kB, trên mốc cảnh báo 142,5 kB → **P1-6 xong thì
đo lại và cân nhắc lazy `SessionDone`**.

## 6. Ca biên chung phải có test (mục 4.9 CLAUDE.md)

- Múi giờ: chấm tuần dùng `vnDayOfWeek()`/`vnDateStr()` (`lib/date.ts`), không `Date.getDay()`.
- Ngày đổi khi đang mở trang chủ: `WeekRhythm` tính lại khi `visibilitychange` (test fake timers).
- Hai tab: `SessionDone` mở ở tab A, tab B không tự mở (query chỉ ở tab A).
- localStorage/sessionStorage bị chặn: mọi `read*` trả mặc định, không throw (test `throw` mock).
- `TodayPlan` null/loading: `SubjectSpaceList`, `askChips` phải hoạt động với `null`.

## 7. Câu hỏi đã có đề xuất mặc định (chủ dự án chỉ cần phản đối nếu khác ý)

| #   | Câu hỏi                                                 | Đề xuất mặc định                                       |
| --- | ------------------------------------------------------- | ------------------------------------------------------ |
| Q1  | Màu ấm theme `kid`                                      | hồng đậm `--w-500: 190 24 93` (tránh trùng accent cam) |
| Q2  | "Nâng cấp" hạ khỏi nhóm chính                           | Có, giữ link ở chân sidebar (P1-7 AC-6 bảo vệ)         |
| Q3  | Đốt `bac` cho bậc Lập trình                             | Có — `/goc-hoc-tap/programming/bac/p1--…`              |
| Q4  | `/tu-vung/:word` → `/goc-hoc-tap/english/tu-dien/:word` | Có (dời prefix, giữ ngoại lệ không dùng `--`)          |
| Q5  | Streak badge header mobile trang chủ                    | Giữ (nhỏ), vì `WeekRhythm` chỉ hiện sau khi cuộn tới   |
| Q6  | P2-12 demo nói dùng hạn mức khách hiện có               | Có; hết hạn mức → màn mời đăng ký, không nới hạn mức   |

## 8. Nghiệm thu (điền SAU mỗi lát)

| Lát  | PR  | Lệnh + kết quả thật | AC chưa đạt & lý do | Bất biến phá? | Ngoài phạm vi? | Còn ngỏ |
| ---- | --- | ------------------- | ------------------- | ------------- | -------------- | ------- |
| P0-1 |     |                     |                     |               |                |         |
| …    |     |                     |                     |               |                |         |

## 9. Bảng duyệt từng lát (chủ dự án điền)

| Lát       | Approved for implementation? | Ngày | Ghi chú |
| --------- | ---------------------------- | ---- | ------- |
| P0-1      |                              |      |         |
| P0-2      |                              |      |         |
| P0-3      |                              |      |         |
| P0-4      |                              |      |         |
| P1-5      |                              |      |         |
| P1-6      |                              |      |         |
| P1-7      |                              |      |         |
| P1-8      |                              |      |         |
| P1-9a/b/c |                              |      |         |
| P2-10     |                              |      |         |
| P2-11     |                              |      |         |
| P2-12     |                              |      |         |
| P2-13     |                              |      |         |
