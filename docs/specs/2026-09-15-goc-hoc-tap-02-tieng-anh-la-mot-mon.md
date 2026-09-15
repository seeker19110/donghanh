# Góc học tập — slice 02: Tiếng Anh là MỘT MÔN ngang hàng, bỏ "không gian" riêng

| Thuộc tính    | Giá trị                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Spec cha      | [`2026-09-15-goc-hoc-tap-architecture.md`](2026-09-15-goc-hoc-tap-architecture.md) §① slice 02 |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md)                                            |
| Base khảo sát | `main` `9193164` (#927, slice 01 đã merge), khảo sát 2026-09-15                                |
| Trạng thái    | **In review** — chờ chủ dự án duyệt ba quyết định ở §7                                         |
| Người duyệt   | Chủ dự án                                                                                      |

> Không bắt đầu code khi trạng thái chưa là **Approved for implementation**. Luật số 1 của khuôn
> `docs/templates/dac-ta-tinh-nang.md`: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.

## 0. Một câu

Đưa trang tổng quan môn Tiếng Anh về đúng chỗ `/goc-hoc-tap/english`, gỡ "Không Gian Học Tiếng
Anh" khỏi mọi thanh điều hướng cấp nền tảng, và sửa lỗi điều hướng làm người đã đăng nhập bị
biến thành khách khi mở Tiếng Anh/Lập trình từ danh mục trên host Góc học tập.

## ④ Tiêu chí chấp nhận (đo được — mỗi dòng ghi lệnh/bằng chứng)

- [ ] **AC-1 Một trang tổng quan, một địa chỉ.** `/goc-hoc-tap/english` render đúng nội dung
      `EnglishHome` (không phải trang manifest `SubjectDetail` với tab "Giải đề"/"Lớp 12").
      `/hoc-tieng-anh`, `/tieng-anh`, `/english` → `<Navigate replace>` tới
      `/goc-hoc-tap/english`, GIỮ query + hash. — `e2e/route-alias.spec.ts` (3 alias + 1 ca
      query/hash), `SubjectDetail.test.tsx` không còn ca `english`.
- [ ] **AC-2 Chủ sở hữu = app host.** Khi host mode BẬT: `www…/goc-hoc-tap/english` được PHỤC VỤ
      (không 302 sang `hoc-tap.`); `hoc-tap…/goc-hoc-tap/english` và `hoc-tap…/english` → 302
      `www…/goc-hoc-tap/english`; `www…/hoc-tieng-anh` → 302 `www…/goc-hoc-tap/english` (một chặng,
      không qua host kia). — `apps/server/src/subjectsRouting.test.ts` (ma trận §③).
- [ ] **AC-3 Không còn entry cấp không gian.** `STUDIOS` có đúng 5 mục, không có `id: 'english'`;
      dropdown header `aria-label="Không Gian Nền Tảng"` có 5 `menuitem`; sidebar desktop nhóm
      "Không Gian Nền Tảng" không có "Học Tiếng Anh"; nhóm "Góc học tập" vẫn đủ 6 môn và mục
      "Tiếng Anh" trỏ tới `/goc-hoc-tap/english` trên **app host** (thẻ `<Link>`, không phải
      `<a href="https://hoc-tap…">`). — `studios.test.ts` (mới), `Layout.test.tsx`,
      `navTree.test.ts`, `SubjectsLink.test.tsx` (mới, ca host mode bật).
- [ ] **AC-4 Lookup không ném lỗi.** `breadcrumb.ts` và `DesktopSidebar.tsx` KHÔNG còn gọi
      `studio('english')`/`studioPath('english')`; `buildCrumbs('/lo-trinh-hoc/a1', 'Cấp A1')`
      = `['Trang chủ', 'Góc học tập', 'Tiếng Anh', 'Lộ trình CEFR', 'Cấp A1']`. — `breadcrumb.test.ts`.
- [ ] **AC-5 Active nav đúng.** Ở `/goc-hoc-tap/english`, `/lo-trinh-hoc/a1`: nhóm "Góc học tập"
      sáng + mục con "Tiếng Anh" sáng; KHÔNG mục nào khác sáng; `/goc-hoc-tap/english-abc` không
      sáng gì. — `navPaths.test.ts`, `navTree.test.ts`.
- [ ] **AC-6 Sửa lỗi đổi origin ngầm (bug thật, xem §2.3).** Trên host Góc học tập, nút "Vào …
      Tiếng Anh"/"Vào Lộ Trình Lập Trình" ở danh mục dẫn tới **app host** bằng
      `window.location.assign` (đổi origin thật) chứ không `navigate()` tại chỗ. Ở localhost
      (host mode tắt) vẫn `navigate()`. — `Subjects.test.tsx` (mock `subjectsHost`, 2 ca),
      `subjectsHost.test.ts` cho helper mới.
- [ ] **AC-7 Không mất gì của người học.** Snapshot toàn bộ khoá `localStorage` (guest fixture + mock account) TRƯỚC và SAU khi đi `/hoc-tieng-anh` → alias → tổng quan → "Luyện nói"
      → Back: khớp 100% (không khoá mới ngoài `ui_*`, không khoá mất). Nút "Luyện nói với 3 từ
      vừa học" (`e2e/comeback.spec.ts`) và `e2e/a11y.spec.ts` ca `/hoc-tieng-anh` chạy ở URL mới
      và vẫn xanh. — E2E mới `e2e/english-subject-home.spec.ts`.
- [ ] **AC-8 Mọi đích của `ENGLISH_CHILDREN` vẫn tới được trong ≤ 1 lượt bấm** từ
      `/goc-hoc-tap/english` (Lộ trình CEFR · Bài học hôm nay · Câu thông dụng · Sổ tay lỗi sai ·
      Ôn thi) — vì sidebar không còn nhóm con "Học Tiếng Anh". — `EnglishHome.test.tsx` (mới, ca
      "có liên kết tới 5 đích"); E2E bấm thử từng nút.
- [ ] **AC-9 Đăng nhập không hồi quy.** `RequireAccount`/`AllowGuest` không đổi; Login vẫn về
      Home (đường về bài là việc của 04). Khách vào `/goc-hoc-tap/english` thấy `GuestBanner`. —
      `e2e/login-redirect.spec.ts` + `e2e/smoke.spec.ts` hiện có (khách/đăng nhập) + ca mới trong `english-subject-home.spec.ts`.
- [ ] **AC-10 Nhìn bằng mắt (Tầng 8b).** Ảnh 1440px + 390px TRƯỚC/SAU của `/goc-hoc-tap/english`,
      `/goc-hoc-tap`, sidebar mở nhóm Góc học tập; kiểm 320px và 5 theme; a11y AA + AAA
      (`e2e/a11y.spec.ts`, `e2e/a11y-aaa.spec.ts`) đổi URL sang địa chỉ mới và xanh.
- [ ] **AC-11 Cổng đầy đủ trên checkout sạch:** `rm -rf packages/*/dist dist dist-server` rồi
      `npm run typecheck && npm run lint && npm run format && npm run build && npm run test:coverage` + E2E: `route-alias`, `bottomnav`, `comeback`, `a11y`, `a11y-aaa`, `mobile-layout-guards`,
      `english-subject-home`.

**Lệnh chứng minh:**

```bash
rm -rf packages/*/dist dist dist-server
npm run typecheck && npm run lint && npm run format && npm run build && npm run test:coverage
npx playwright test e2e/route-alias.spec.ts e2e/bottomnav.spec.ts e2e/comeback.spec.ts \
  e2e/english-subject-home.spec.ts e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts e2e/mobile-layout-guards.spec.ts
```

## ① Phạm vi

**LÀM:**

1. Route `/goc-hoc-tap/english` → `EnglishHome` (đặt TRƯỚC `/goc-hoc-tap/:subjectId`, kèm chú
   thích vì sao — React Router 7 xếp hạng theo độ cụ thể, nhưng ghi rõ để người sau không dời).
2. Alias client: `/hoc-tieng-anh`, `/tieng-anh`, `/english` → `LegacyEnglishRedirect` (giữ
   search/hash, `replace`). Bỏ hai route `Navigate` cũ `/tieng-anh`/`/english` → `/hoc-tieng-anh`.
3. Alias server (`subjectsRouting.ts`): coi ba đường cũ là alias của `/goc-hoc-tap/english`
   trong bước chuẩn hoá; `english` vào bảng "môn thuộc app host" (cùng cơ chế `programming`).
4. **Một nguồn sự thật cho "môn nào ở host nào"**: thêm `packages/core-learner/subjectHome.ts`
   (`subjectHomePath(id): string` + `SUBJECTS_ON_APP_HOST`), server và client cùng import; xoá
   bảng `SUBJECTS_WITH_OWN_SPACE` cục bộ ở server.
5. `subjectsHost.ts`: `subjectsTarget(hostname, subjectId)` trả `kind:'path'` cho môn thuộc app
   host khi đang ở app host, và `kind:'url'` về **canonical host** khi đang ở host Góc học tập
   (chiều ngược với hiện nay). Thêm `goToSubjectHome(navigate, id)` = quyết định assign/navigate.
   `SubjectsLink` dùng cùng helper → mục "Tiếng Anh"/"Lập trình" trong sidebar đúng host.
6. `Subjects.tsx`: nút hành động gọi `goToSubjectHome(nav, sub.id)` cho MỌI môn — bỏ ba nhánh
   `if` tự ghép chuỗi. Đổi chữ nút Tiếng Anh: "Vào Không Gian Học Tiếng Anh" → "Vào môn Tiếng Anh".
7. `studios.ts`: xoá mục `english`. `DesktopSidebar.tsx`: xoá `studioItem('english', …)`; mục con
   "Tiếng Anh" của `SUBJECT_CHILDREN` nhận `paths: [...ENGLISH_PATHS, '/goc-hoc-tap/english']`.
   `breadcrumb.ts`: `ENGLISH_CHILDREN` treo dưới một nút mới (path `/goc-hoc-tap/english`, nhãn
   "Tiếng Anh", parent = SUBJECTS). `navPaths.ts`: `ENGLISH_PATHS` thêm `/goc-hoc-tap/english`,
   giữ nguyên các mục cũ (tool paths là việc của 03).
8. Các nơi tự ghép `'/hoc-tieng-anh'` trong `@dhcb/app` → đổi sang `duongDanMonTiengAnh()` (một
   hàm, xem §⑥): `Home.tsx`, `Practice.tsx`, `ExamPlan.tsx`. Hub (`apps/hub/src/App.tsx`, `ctaUrl`)
   đổi chuỗi tại chỗ + test unit (xem ② vì sao hub không import gói).
9. `EnglishHome.tsx`: `usePageTitle('Tiếng Anh | Đồng hành cùng bạn')`; tiêu đề Layout
   "Không Gian Tiếng Anh"/"English Studio" → "Tiếng Anh"/"English"; `Layout crumbs` để breadcrumb
   ra `Trang chủ › Góc học tập › Tiếng Anh`; đảm bảo 5 đích `ENGLISH_CHILDREN` có nút (AC-8).
10. `SubjectDetail.tsx`: bỏ nhánh màu `english` trong `subjectTheme` (chết sau khi route tách);
    nếu vẫn nhận `subjectId === 'english'` (chỉ khi ai đó dựng URL lạ) → `<Navigate>` tới
    `subjectHomePath('english')` thay vì render trang manifest.
11. Test + E2E + ảnh theo §④; changelog `docs/changelog/03xx-*.md`; cập nhật `PROGRESS.md` bảng
    slice; cập nhật chú thích ở `e2e/a11y.spec.ts`/`e2e/comeback.spec.ts` đang trỏ `/hoc-tieng-anh`.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- KHÔNG dời bất kỳ route công cụ nào (`/tro-truyen`, `/luyen-viet`, `/luyen-noi`, `/lo-trinh-hoc`,
  `/tu-dien`, `/bai-hoc`, `/cau-thong-dung`, `/luyen-nghe`, `/truyen-song-ngu`, `/placement`,
  `/thu-thach`, `/cai-dat`, `/on-thi`, `/so-tay-loi-sai`) — đó là slice **03** (cần inventory).
- KHÔNG đổi `english.isDefault`, `getDirection`, onboarding, Home "Học tiếp", Companion, mọi
  fallback `'english'` — slice **04**.
- KHÔNG đổi `RequireAccount`/`AllowGuest`, không thêm "đường về bài sau đăng nhập" (04 phải định
  nghĩa allowlist + test open-redirect trước).
- KHÔNG đổi mã môn/bài, khoá `localStorage`/`sessionStorage` (`et_*`, `dhcb_*`, `gsa_session_token_v1`,
  `ui_sidebar_groups`), API, quyền, entitlement, hạn mức khách, trạng thái hoàn thành.
- KHÔNG bật/tắt host mode, không đổi DNS/chứng chỉ/cookie; không đọc `.env` production.
- KHÔNG thêm nested-group cho sidebar (mục con có mục con) — nếu 03 cần thì 03 đặc tả.
- KHÔNG đụng anchor `#mon-hoc` của hub.

## ② Điểm chạm (đã khảo sát thật trên `9193164`)

| Việc | Đường dẫn file                                                                                  | Ghi chú khảo sát                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thêm | `packages/core-learner/subjectHome.ts` (+ `.test.ts`)                                           | `subjectHomePath('english') = '/goc-hoc-tap/english'`, `('programming') = '/lap-trinh'`, môn khác = `/goc-hoc-tap/<id>`; `isAppHostSubject(id)`. Gói `core-learner` đã được cả server (`server.ts` import `subjectRegistry`) và client dùng — không thêm dependency.                                                                                                                                                                                                                                                 |
| Sửa  | `apps/server/src/subjectsRouting.ts` (+ `.test.ts`)                                             | `classify()` tra `isAppHostSubject` thay bảng cục bộ; thêm `LEGACY_ENGLISH_PREFIXES = ['/hoc-tieng-anh','/tieng-anh','/english']` → chuẩn hoá thành `/goc-hoc-tap/english` (khớp biên đoạn). 302 cho toàn bộ phần mới.                                                                                                                                                                                                                                                                                               |
| Sửa  | `apps/dhcb/src/lib/subjectsHost.ts` (+ `.test.ts`)                                              | `subjectsTarget` biết chiều "về app host"; `goToSubjectHome`; `duongDanMonTiengAnh()` re-export từ `subjectHomePath`. Hợp đồng `NavigationTarget` giữ nguyên discriminated union.                                                                                                                                                                                                                                                                                                                                    |
| Sửa  | `apps/dhcb/src/components/SubjectsLink.tsx` (+ test mới)                                        | Dùng `subjectsTarget` mới → `<Link>` khi cùng origin, `<a>` khi đổi origin (cả hai chiều).                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Sửa  | `apps/dhcb/src/App.tsx`                                                                         | Route mới + `LegacyEnglishRedirect`; xoá 2 `Navigate` cũ. Lazy import `EnglishHome` giữ nguyên.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Sửa  | `apps/dhcb/src/lib/studios.ts` (+ `studios.test.ts` mới)                                        | Xoá mục `english`. Test canh: đúng 5 studio, id duy nhất, không id `english`.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Sửa  | `apps/dhcb/src/components/DesktopSidebar.tsx`                                                   | Xoá `studioItem('english', …)` khỏi `STUDIO_NAV` và khỏi `ACTIVE_ORDER`; `ENGLISH_CHILDREN` không còn được render ở sidebar (AC-8 bù bằng trang tổng quan).                                                                                                                                                                                                                                                                                                                                                          |
| Sửa  | `apps/dhcb/src/lib/breadcrumb.ts` (+ test)                                                      | Bỏ `const ENGLISH = studioPath('english')` (hiện ném lỗi lúc nạp module nếu xoá registry mà quên chỗ này — spec cha §"Hướng kiến trúc" đã cảnh báo). Nút cha mới cho `ENGLISH_CHILDREN`.                                                                                                                                                                                                                                                                                                                             |
| Sửa  | `apps/dhcb/src/lib/navTree.ts`, `navPaths.ts` (+ test)                                          | `SUBJECT_CHILDREN[0].paths` mở rộng; `ENGLISH_PATHS` thêm địa chỉ mới.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Sửa  | `apps/dhcb/src/components/Layout.tsx` (+ `Layout.test.tsx`)                                     | Dropdown tự co còn 5 mục (data-driven). **Sửa kèm:** `isActive = location.pathname.startsWith(st.to)` là khớp chuỗi trần → đổi sang khớp biên đoạn (export `underPrefix` từ `breadcrumb.ts` và dùng chung), vì `/goc-hoc-tap-abc` sẽ sáng nhầm — cùng họ lỗi 01 đã chặn ở nav.                                                                                                                                                                                                                                       |
| Sửa  | `apps/dhcb/src/pages/learning/Subjects.tsx` (+ test)                                            | Nút hành động qua `goToSubjectHome`; đổi nhãn nút Tiếng Anh.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Sửa  | `apps/dhcb/src/pages/learning/SubjectDetail.tsx` (+ test)                                       | Bỏ theme `english`; guard `Navigate` cho `english`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Sửa  | `apps/dhcb/src/pages/subjects/english/EnglishHome.tsx`                                          | Tiêu đề/crumbs/liên kết 5 đích. Test render mới (`EnglishHome.test.tsx`) mock `useAuth`, `useCloudSync`, loader.                                                                                                                                                                                                                                                                                                                                                                                                     |
| Sửa  | `Home.tsx`, `Practice.tsx`, `ExamPlan.tsx`, `apps/hub/src/App.tsx`                              | Thay chuỗi `'/hoc-tieng-anh'` bằng hàm dùng chung. Hub là app RIÊNG và hiện **không import gói `@dhcb/*` nào** (chỉ có alias tsconfig cho core-ui, `apps/hub/vite.config.ts` KHÔNG có alias `@dhcb`). Để không thêm dependency/alias build cho một chuỗi, hub giữ hằng `${APP_URL}/goc-hoc-tap/english` tại chỗ, kèm test unit `apps/hub/src/App.test.tsx` (hoặc file test hub hiện có) khẳng định `ctaUrl` của môn `english` kết thúc bằng `/goc-hoc-tap/english` — đúng cách hub đang tự giữ đồng bộ với registry. |
| Sửa  | `e2e/route-alias.spec.ts`, `e2e/a11y*.spec.ts`, `e2e/comeback.spec.ts`, `e2e/bottomnav.spec.ts` | Đổi URL; thêm `e2e/english-subject-home.spec.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

**Ảnh hưởng lan ra (theo `npm run codemap -- impact`, đo 2026-09-15):**

- `studios.ts` → **81 file** (trực tiếp: `DesktopSidebar.tsx`, `breadcrumb.ts`, `Layout.tsx`; gián
  tiếp: mọi trang dùng `Layout`). Rủi ro tập trung ở hai chỗ lookup theo id (`studio('english')`,
  `studioPath('english')`) — cả hai **ném lỗi lúc nạp module** → toàn app trắng nếu xoá registry mà
  sót một chỗ. Test `studios.test.ts` + `breadcrumb.test.ts` + `Layout.test.tsx` phải đỏ TRƯỚC khi
  sửa (viết test trước).
- `EnglishHome.tsx` → 2 file (`App.tsx`, `main.tsx`).
- `subjectsHost.ts` → 81 file (đo ở spec cha); consumer trực tiếp: `SubjectsLink`, `Layout`
  (`navigateTo`), `Home`, `Profile`, `About`, `Subjects`, `SubjectDetail`, `Practice`,
  `ProgrammingHome`, `App`.

### 2.3 Phát hiện trong lúc khảo sát — lỗi THẬT đang chạy trên production

Host mode phía server đang BẬT (bằng chứng spec cha: `HEAD www…/mon-hoc` → 301 `hoc-tap…`). Trên
host `hoc-tap.`, trang danh mục `Subjects.tsx` gọi `nav('/hoc-tieng-anh')` và `nav('/lap-trinh')`
— **điều hướng trong app, không đổi origin**. Hệ quả: người dùng đang ở `hoc-tap.` mở Tiếng Anh
thì toàn bộ hoạt động chạy trên origin `hoc-tap.`, nơi `localStorage` (token `gsa_session_token_v1`,
tiến độ `et_*`/`dhcb_*` theo uid) **trống** → người đã đăng nhập bỗng thành KHÁCH, tiến độ 0, và
mọi thứ họ học ở đó ghi vào một origin không ai đọc lại. Luật server "mọi thứ ngoài Góc học tập
→ 301 về www" chỉ bắt được lượt tải trang đầy đủ, không bắt được `navigate()`.

Lỗi này là lý do kỹ thuật mạnh nhất để làm 02 ngay sau 01: nó chỉ hết khi mọi liên kết ra khỏi
host Góc học tập đi qua MỘT helper biết ownership (AC-6). Không migrate dữ liệu đã lỡ ghi ở
`hoc-tap.` (không có cách nhận diện đáng tin, và spec cha cấm chuyển dữ liệu qua query/postMessage);
ghi nhận ở `PROGRESS.md` như nợ đã biết, kèm cách đo: đếm khoá `et_learned_*` trên origin
`hoc-tap.` qua Sentry breadcrumb nếu cần.

## ③ Hợp đồng

### 3.1 Bảng ownership (mở rộng §③ spec cha — chỉ thêm dòng, không đổi dòng cũ)

| Input                                                              | Đích cuối                                                                      | Mã  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------ | --- |
| app host `/goc-hoc-tap/english[?q][#h]`                            | phục vụ tại chỗ (`EnglishHome`)                                                | —   |
| app host `/hoc-tieng-anh`, `/tieng-anh`, `/english` (+ đuôi/query) | server 302 + client replace → `/goc-hoc-tap/english` cùng host, giữ query/hash | 302 |
| subjects host `/goc-hoc-tap/english`, `/english`, `/hoc-tieng-anh` | app host `/goc-hoc-tap/english`                                                | 302 |
| subjects host danh mục → bấm "Tiếng Anh"/"Lập trình"               | `location.assign(https://<canonical>/…)`                                       | —   |
| localhost (host mode tắt) mọi dòng trên                            | `navigate()` cùng origin, cùng đường dẫn chuẩn                                 | —   |
| `/goc-hoc-tap/english/<gì đó>`                                     | KHÔNG định nghĩa ở 02 → rơi route `*` như hiện nay (03 quyết)                  | —   |

### 3.2 Helper

```ts
// packages/core-learner/subjectHome.ts
export const SUBJECTS_ON_APP_HOST: Readonly<Record<string, string>> = {
  english: '/goc-hoc-tap/english',
  programming: '/lap-trinh', // tương thích tạm tới spec adapter lập trình (S07)
}
export function isAppHostSubject(id: string): boolean
export function subjectHomePath(id: string): string // môn khác → `/goc-hoc-tap/${id}`

// apps/dhcb/src/lib/subjectsHost.ts — giữ union hiện có
type NavigationTarget = { kind: 'path'; value: string } | { kind: 'url'; value: string }
export function subjectsTarget(hostname: string, subjectId?: string): NavigationTarget
//  - host mode tắt            → path
//  - đang ở subjects host      → môn app-host: url canonical; môn catalog: path
//  - đang ở app host (subdomain) → môn app-host: path; danh mục/môn catalog: url subjects host
export function goToSubjectHome(navigate: (p: string) => void, subjectId: string): void
export function duongDanMonTiengAnh(): string // = subjectHomePath('english')
```

**Ca lỗi (là hợp đồng):**

| Tình huống                                         | Hành vi mong đợi                                                                  |
| -------------------------------------------------- | --------------------------------------------------------------------------------- |
| `subjectHomePath('khong-co')`                      | trả `/goc-hoc-tap/khong-co` (không ném) — trang không-tìm-thấy của app lo, như 01 |
| `subjectsTarget` với `VITE_SUBJECTS_HOSTNAME` rỗng | luôn `kind:'path'`                                                                |
| `SubjectDetail` nhận `subjectId='english'`         | `<Navigate replace>` tới `subjectHomePath('english')`, không fetch manifest       |
| `studio('english')` ở bất kỳ đâu                   | KHÔNG được tồn tại — `grep -rn "studio('english')\|studioPath('english')"` = 0    |

## ⑤ Bất biến không được phá

| Bất biến                                                        | Test canh                                                                             |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 5 studio, id duy nhất, `Layout` dropdown = số studio            | `studios.test.ts` (mới), `Layout.test.tsx`                                            |
| Nhóm Góc học tập đủ 6 môn của `subjectRegistry`                 | `navTree.test.ts` (đang có)                                                           |
| Không loop chuyển hướng; alias đi thẳng đích; giữ query/hash    | `subjectsRouting.test.ts` (ca "đích của alias là điểm dừng"), `route-alias.spec.ts`   |
| Không mất nháp/tiến độ khách; không khoá storage mới            | `guestProgress.test.ts`, `learningQuestionDraft.test.ts`, E2E snapshot storage (AC-7) |
| Người đã đăng nhập không bị thành khách khi đổi môn từ danh mục | `Subjects.test.tsx` ca host mode (AC-6)                                               |
| Mobile/focus/theme/a11y AA+AAA                                  | `mobile-layout-guards`, `a11y`, `a11y-aaa`                                            |
| Server là authority; không đổi endpoint/billing/entitlement     | review diff; `grep` không có thay đổi dưới `apps/server/src/api/`                     |

## ⑥ Quy ước dự án liên quan (bên thi hành không thấy hội thoại)

- Import xuyên gói `@dhcb/core-learner/subjectHome` (không đuôi `.js`); nội bộ gói dùng đường
  tương đối có `.js`. `packages/` không import `apps/`.
- Dựng URL qua **một hàm** (`programmingRoutes.ts` là mẫu) — không ghép chuỗi rải rác (CLAUDE.md §7).
- Khớp tiền tố theo **biên đoạn**, không `includes`/`startsWith` trần.
- Chuyển hướng mới ở server dùng **302**; client `replace`. Chỉ GET/HEAD.
- Nhãn/nút: chữ nội dung AAA, phần còn lại AA; màu từ token, không ghi cứng; vùng chạm ≥ 44px.
- Viết test ĐỎ trước khi sửa `studios.ts` (81 file ảnh hưởng; lỗi nạp module làm trắng app).
- Đổi UI → ảnh 1440/390 trước/sau (QUY-TRINH-AUDIT Tầng 8b). Không dùng kết quả #927 làm chứng cứ.
- PR: `refactor(learning): …` (không có `feat` vì đây là tái cấu trúc theo spec đã duyệt; nếu
  dùng `feat(` thì mô tả phải dẫn file này + "Approved for implementation"), mô tả đủ 6 tiêu đề
  cổng `metadata`, READY, bật auto-merge ngay sau tạo.

## 7. Quyết định cần chủ dự án chốt trước khi Approved

| #   | Câu hỏi                                                                                                                               | Đề xuất của AI (mặc định nếu không có ý kiến khác)                                                                                    | Lý do                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Q1  | Sau khi bỏ nhóm "Học Tiếng Anh" ở sidebar, 5 mục con (Lộ trình CEFR, Bài học hôm nay, Câu thông dụng, Sổ tay lỗi sai, Ôn thi) đi đâu? | **Không hiển thị ở sidebar trong 02**; đảm bảo có trên trang tổng quan (AC-8). 03 quyết chỗ đứng cuối cùng cùng inventory 14 công cụ. | Thêm nested-group cho sidebar là thay đổi UI có tác động toàn app, vượt phạm vi "bỏ entry cấp không gian".        |
| Q2  | Nhãn nút danh mục cho Tiếng Anh                                                                                                       | "Vào môn Tiếng Anh" (đồng dạng "Vào Lộ Trình Lập Trình" → cũng đổi thành "Vào môn Lập trình"?)                                        | Ngôn ngữ nhất quán "môn" ở cả 6 thẻ. Nếu chốt, đổi cả hai.                                                        |
| Q3  | Dữ liệu người dùng đã lỡ ghi ở origin `hoc-tap.` do lỗi §2.3                                                                          | **Không migrate**, ghi nợ có đo được.                                                                                                 | Spec cha cấm chuyển dữ liệu qua query/postMessage; không có cách nhận diện đáng tin; tập người ảnh hưởng chưa đo. |

## 8. Rủi ro và giảm thiểu

| Rủi ro                                                                   | Giảm thiểu                                                                                        |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Xoá `english` khỏi `STUDIOS` làm app trắng vì một lookup theo id còn sót | Test đỏ trước; `grep` AC §③ = 0; `Layout.test.tsx` render với registry thật                       |
| Hub (app riêng) trỏ URL cũ                                               | Test unit cho `SUBJECTS[].ctaUrl` môn english; `e2e/v2-hubs.spec.ts` hiện có                      |
| Người dùng có bookmark `/hoc-tieng-anh`                                  | Alias vĩnh viễn ở cả client + server (302), E2E canh                                              |
| Sidebar mất lối tắt 1 bấm tới Lộ trình CEFR                              | Q1; đo lại ở 03                                                                                   |
| Host mode client/server lệch cấu hình                                    | Helper hoạt động đúng ở cả 3 trạng thái (tắt / chỉ server / cả hai) — có test cho từng trạng thái |

## 9. Kế hoạch thi hành (một PR, thứ tự trong PR)

1. `subjectHome.ts` + test → server `subjectsRouting` + test (đỏ→xanh) → client `subjectsHost` + test.
2. Viết `studios.test.ts`, sửa `breadcrumb.test.ts`/`Layout.test.tsx`/`navTree.test.ts` → chạy: phải ĐỎ.
3. Sửa registry/sidebar/breadcrumb/navPaths/Layout → xanh.
4. Route + alias + `SubjectDetail` guard + `Subjects.tsx` + `SubjectsLink` + 4 nơi ghép chuỗi + hub.
5. `EnglishHome` tiêu đề/crumbs/5 liên kết + test render.
6. E2E mới + cập nhật E2E cũ; ảnh trước/sau; cổng đầy đủ trên checkout sạch.
7. Changelog + `PROGRESS.md` (bảng slice: 02 ✅, nợ §2.3) + đổi trạng thái slice trong spec cha.

**Rollback:** revert PR; server chỉ 302 nên không kẹt cache; không có migration/schema.

## 19. Phê duyệt

- [ ] Product outcome và scope (Q1–Q3)
- [ ] UX/accessibility
- [ ] Architecture/ownership/helper
- [ ] Test/rollout/rollback

**Kết luận:** In review  
**Người duyệt:** —  
**Ngày:** —
