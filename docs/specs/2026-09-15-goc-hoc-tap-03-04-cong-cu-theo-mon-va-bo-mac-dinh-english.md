# Góc học tập — slice 03 + 04: công cụ Tiếng Anh nằm trong môn; nền tảng không mặc định Tiếng Anh

| Thuộc tính    | Giá trị                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| Spec cha      | [`2026-09-15-goc-hoc-tap-architecture.md`](2026-09-15-goc-hoc-tap-architecture.md) §① slice 03, 04              |
| Slice trước   | [`02-tieng-anh-la-mot-mon.md`](2026-09-15-goc-hoc-tap-02-tieng-anh-la-mot-mon.md) (đã thi hành, changelog 0326) |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md)                                                             |
| Base khảo sát | nhánh slice 02 (`784de80`), 2026-09-15                                                                          |
| Trạng thái    | **Approved for implementation** — chủ dự án uỷ quyền "viết đặc tả hết rồi thi hành một lượt" (2026-09-15)       |
| Thi hành      | MỘT PR chung cho 03 + 04 (theo yêu cầu chủ dự án); mỗi slice một nhóm commit riêng để revert được từng phần     |

> Quyết định thiết kế ở §7 đã được chủ dự án uỷ quyền cho AI quyết; ghi rõ để nghiệm thu, không
> phải câu hỏi mở. Luật số 1 của khuôn: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.

## 0. Một câu

Mọi công cụ Tiếng Anh (14 route) được nhận diện là **của môn Tiếng Anh** ở nav/breadcrumb/nút
Back/tiêu đề; các trang dùng chung nói rõ mình đang nói về môn nào; và nền tảng (Home, onboarding,
ngôn ngữ giao diện, registry) **không còn ngầm định người dùng học Tiếng Anh**.

## ② Inventory — kết quả khảo sát mã thật (nền của cả hai slice)

### 2.1 Route công cụ và chủ sở hữu (03)

| Route                        | Component (thư mục)                         | Gate            | Phân loại                              | Kết luận 03                                                      |
| ---------------------------- | ------------------------------------------- | --------------- | -------------------------------------- | ---------------------------------------------------------------- |
| `/tro-truyen`                | `subjects/english/Chat`                     | AllowGuest+Feat | Tiếng Anh                              | công cụ môn                                                      |
| `/luyen-viet`                | `subjects/english/Writing`                  | AllowGuest+Feat | Tiếng Anh                              | công cụ môn                                                      |
| `/luyen-noi`                 | `subjects/english/Speaking`                 | AllowGuest+Feat | Tiếng Anh                              | công cụ môn                                                      |
| `/lo-trinh-hoc[/:levelId]`   | `subjects/english/Learn`, `CefrLevelPage`   | AllowGuest+Feat | Tiếng Anh                              | công cụ môn (đã ở cấp 2 từ 02)                                   |
| `/tu-dien`, `/tu-vung/:word` | `subjects/english/Dictionary`, `WordDetail` | AllowGuest+Feat | Tiếng Anh                              | công cụ môn (`/tu-vung/:word` = trang con của Từ điển)           |
| `/bai-hoc`                   | `subjects/english/Lessons`                  | AllowGuest+Feat | Tiếng Anh                              | công cụ môn (cấp 2 từ 02)                                        |
| `/cau-thong-dung`            | `subjects/english/CommonPhrases`            | AllowGuest+Feat | Tiếng Anh                              | công cụ môn (cấp 2 từ 02)                                        |
| `/luyen-nghe`                | `subjects/english/Listening`                | AllowGuest+Feat | Tiếng Anh                              | công cụ môn                                                      |
| `/truyen-song-ngu[/:id]`     | `subjects/english/Stories`, `StoryReader`   | AllowGuest+Feat | Tiếng Anh                              | công cụ môn                                                      |
| `/placement`                 | `subjects/english/Placement`                | công khai       | Tiếng Anh (test xếp lớp)               | trang con của Lộ trình CEFR (breadcrumb), KHÔNG lên sidebar      |
| `/thu-thach`                 | `subjects/english/Challenge`                | RequireAcc+Feat | Tiếng Anh                              | công cụ môn                                                      |
| `/cai-dat`                   | `subjects/english/EnglishSettings`          | AllowGuest      | Tiếng Anh (chiều học, tốc độ, giọng)   | "Cài đặt môn" — chỉ ở trang tổng quan, breadcrumb dưới Tiếng Anh |
| `/on-thi`                    | `learning/ExamPlan`                         | RequireAccount  | Tiếng Anh (kế hoạch thi CEFR)          | công cụ môn (cấp 2 từ 02)                                        |
| `/so-tay-loi-sai`            | `core/MistakeBank`                          | RequireAcc+Feat | Tiếng Anh (lỗi Chat/Viết/Nói)          | công cụ môn (cấp 2 từ 02)                                        |
| `/luyen-tap`                 | `learning/Practice`                         | AllowGuest      | ĐA MÔN (4 STEM + Anh + simulators)     | trang chung, GIỮ ở nav cấp nền tảng, thành mục LÁ                |
| `/tien-do`                   | `core/Dashboard`                            | RequireAccount  | Nền tảng, nội dung hiện chỉ Tiếng Anh  | trang chung có NGỮ CẢNH: tiêu đề nói rõ "Tiếng Anh"              |
| `/lich-su-hoc`               | `core/History`                              | RequireAccount  | Nền tảng, nội dung Chat/Viết Tiếng Anh | trang chung có ngữ cảnh "Tiếng Anh"                              |

Bất thường đang có: `PRACTICE_CHILDREN` (sidebar "Luyện tập") liệt kê 6 công cụ **Tiếng Anh**
(Trò chuyện · Luyện nói · Luyện viết · Luyện nghe · Từ điển · Thử thách) dưới một mục "đa môn";
`PRACTICE_PATHS` chứa các đường đó nên đứng ở `/tro-truyen` sáng "Luyện tập" chứ không sáng
"Góc học tập › Tiếng Anh". Breadcrumb: `Trang chủ › Phòng Luyện Tập › Trò chuyện`.

### 2.2 Chỗ nền tảng ngầm định Tiếng Anh (04)

| Nơi                                                                                                                                                         | Hiện trạng                                                                                                                                   | Kết luận 04                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core-learner/subjectRegistry.ts` `english.isDefault: true`                                                                                        | `rg isDefault`: chỉ schema + manifest, KHÔNG consumer runtime nào                                                                            | Bỏ cờ ở manifest; giữ field optional trong schema (tương thích API); test "không môn nào isDefault"                                                                                                                                                                                     |
| `Home`, `Pricing`, `Profile`, `History`, `MistakeBank`, `QuickActions`, `ExamPlan`, `Practice` dùng `getDirection() === 'A'` để chọn **ngôn ngữ giao diện** | `Direction` là cấu hình MÔN Tiếng Anh (`et_direction`); ngôn ngữ giao diện nền tảng đã có `useLang()`/`uiLang.ts` (`ui_lang`, mặc định `vi`) | Trang NỀN TẢNG dùng `useLang()`; trang môn Tiếng Anh giữ `getDirection()`. Một lần đồng bộ: `ui_lang` chưa từng đặt và direction = B → `en` (không đổi trải nghiệm người đang học chiều B)                                                                                              |
| `Home` thẻ "Học tiếp" = `continueLevel` từ CEFR (từ vựng/ngữ pháp Tiếng Anh)                                                                                | Người chưa học Tiếng Anh vẫn thấy "Học tiếp A1 …"                                                                                            | Thẻ ghi rõ môn "Tiếng Anh"; chỉ hiện khi CÓ tiến độ Tiếng Anh; chưa có → thẻ "Chọn môn để bắt đầu" → Góc học tập. Điểm học tiếp đa môn thật là S06/S08                                                                                                                                  |
| `Onboarding` 4 bước (nhóm tuổi · trình độ CEFR · mục tiêu Tiếng Anh · phút/ngày) bắt buộc với MỌI người                                                     | `AllowGuest`/`RequireAccount` → `!onboarded` → `/onboarding` — người muốn học Toán vẫn phải chọn trình độ CEFR                               | Thêm bước 0 "Bạn muốn học gì?" (6 môn). Chọn Tiếng Anh → 4 bước cũ. Chọn môn khác → lưu `onboarded` + `ageGroup` (bước nhóm tuổi vẫn giữ, dùng chung) → tới `subjectHomePath(môn)`. Không đổi API onboarding: các trường Tiếng Anh gửi giá trị mặc định như hiện có khi bấm "Tiếp theo" |
| `apps/server/src/api/learning/learning-read-model.ts` `?? 'english'`                                                                                        | Không có caller nào ở client (`rg` = 0); chỉ test                                                                                            | GIỮ (spec cha: không đổi default API trước kiểm tra contract). Ghi chú trong code                                                                                                                                                                                                       |
| `apps/server/src/api/core/history.ts` learn-day `subject = 'english'`, `progress.ts` bonus `'english'`                                                      | Số liệu Tiếng Anh thật (learn_count từ vựng; thưởng khi tiến độ CEFR tăng)                                                                   | GIỮ — đây là dữ liệu MÔN, không phải mặc định nền tảng                                                                                                                                                                                                                                  |
| `Companion`                                                                                                                                                 | `rg 'english'` = 0                                                                                                                           | Không việc                                                                                                                                                                                                                                                                              |
| `getDirection()` mặc định `'A'`                                                                                                                             | Cấu hình môn                                                                                                                                 | GIỮ                                                                                                                                                                                                                                                                                     |

## ④ Tiêu chí chấp nhận

### Slice 03

- [ ] **AC-3.1 Nav:** `ENGLISH_CHILDREN` (cấp 2 dưới "Tiếng Anh") = 12 mục theo thứ tự luồng học:
      Lộ trình CEFR · Bài học hôm nay · Trò chuyện · Luyện nói · Luyện viết · Luyện nghe · Từ điển ·
      Câu thông dụng · Truyện song ngữ · Sổ tay lỗi sai · Ôn thi · Thử thách. `PRACTICE_CHILDREN`
      bị xoá; "Luyện tập" là mục lá. `PRACTICE_PATHS` chỉ còn `/phong-luyen-tap`, `/luyen-tap`.
      `ENGLISH_PATHS` chứa mọi route ở 2.1 nhóm "Tiếng Anh" (kể cả `/placement`, `/cai-dat`,
      `/tu-vung`). — `navTree.test.ts`, `navPaths.test.ts`.
- [ ] **AC-3.2 Active nav:** ở `/tro-truyen`, `/tu-vung/apple`, `/placement`, `/cai-dat`: sidebar
      sáng "Góc học tập" + "Tiếng Anh" (+ mục cấp 2 tương ứng nếu có); KHÔNG sáng "Luyện tập".
      BottomNav mobile: tab "Góc học tập" sáng (không phải "Luyện tập"). Ở `/luyen-tap`: sáng
      "Luyện tập". — `DesktopSidebar.test.tsx`, `navPaths.test.ts`, E2E `bottomnav`.
- [ ] **AC-3.3 Breadcrumb:** mọi route 2.1 nhóm Tiếng Anh → `Trang chủ › Góc học tập › Tiếng Anh ›
<công cụ>`; `/tu-vung/:word` → `… › Từ điển › <từ>`; `/placement` → `… › Lộ trình CEFR › Xếp
lớp`; `/cai-dat` → `… › Tiếng Anh › Cài đặt môn`; `/lo-trinh-hoc/a1` → `… › Lộ trình CEFR ›
Cấp A1` (không đổi). — `breadcrumb.test.ts` (một ca `it.each` cho cả 14).
- [ ] **AC-3.4 Back có ngữ cảnh:** nút Back ở header của 12 công cụ + `/cai-dat` + `/placement`
      về **trang tổng quan môn** `/goc-hoc-tap/english` (thay vì Trang chủ), trừ trang đã có
      `onBack` phân cấp riêng (`CefrLevelPage`, `WordDetail` → Từ điển, `StoryReader` → Truyện).
      `Layout` nhận prop `backTo?: string`; `onBack` (hàm) vẫn ưu tiên. — `Layout.test.tsx`,
      E2E `english-tools-context.spec.ts` (bấm Back ở 3 trang đại diện).
- [ ] **AC-3.5 Trang chung có ngữ cảnh:** `/tien-do` và `/lich-su-hoc` có dòng phụ đề (dưới tiêu
      đề, chữ nội dung AAA) "Môn Tiếng Anh — tiến độ các môn khác xem ở trang môn" (Dashboard) /
      "Lịch sử Trò chuyện & Luyện viết môn Tiếng Anh" (History), kèm liên kết tới
      `/goc-hoc-tap/english`. `/luyen-tap` không đổi. — E2E `english-tools-context.spec.ts` (ca
      `/tien-do` có link `href="/goc-hoc-tap/english"`); `Dashboard`/`History` quá nhiều phụ thuộc
      để render đơn vị chỉ vì một dòng chữ.
- [ ] **AC-3.6 Trang tổng quan đủ lối vào:** `EnglishHome` có nút tới **mọi** mục của
      `ENGLISH_CHILDREN` + "Cài đặt môn" (`/cai-dat`). — `EnglishHome.test.tsx` mở rộng.
- [ ] **AC-3.7 Không đổi URL, gate, storage, API** của bất kỳ công cụ nào (diff không chạm
      `path=` của các route 2.1, không chạm `apps/server/src/api`). — review diff.

### Slice 04

- [ ] **AC-4.1 Registry:** không manifest nào có `isDefault: true`; `SubjectManifestSchema` giữ
      field optional. — `subjectRegistry.test.ts` (ca mới), `subjectManifest` không đổi.
- [ ] **AC-4.2 Ngôn ngữ giao diện nền tảng tách khỏi chiều học:** `Home` (chữ giao diện), `Pricing`,
      `Profile`, `MistakeBank`, `QuickActions`, `Practice`, `ExamPlan` KHÔNG còn dùng `getDirection`
      để chọn chữ giao diện; dùng `useLang()`. **Ngoại lệ có chủ đích (ghi trong code):** `History`
      dùng `getDirection` cho `situationLabel` (NHÃN NỘI DUNG phiên Tiếng Anh, không phải chữ giao
      diện) và `Home` giữ `isA` cho tên vòng từ vựng/bài ngữ pháp (nội dung song ngữ của môn). —
      E2E `onboarding-by-subject.spec.ts` (2 ca: `ui_lang=vi` + chiều B → Pricing tiếng Việt; chưa
      đặt `ui_lang` + chiều B → tiếng Anh).
- [ ] **AC-4.3 Không đổi trải nghiệm người chiều B đang có:** `uiLang.ts` — khi `ui_lang` CHƯA
      từng đặt và `et_direction === 'B'` → coi như `en` (ghi xuống `ui_lang` để ổn định); đã đặt
      thì tôn trọng. — `uiLang.test.ts` (mới, 4 ca: chưa đặt/A, chưa đặt/B, đã đặt vi/B, đã đặt en/A).
- [ ] **AC-4.4 Home không ngầm định Tiếng Anh:** người dùng KHÔNG có tiến độ Tiếng Anh (0 từ đã
      học, 0 ngữ pháp, chưa thi) → kế hoạch hôm nay không có "Ôn SRS"/"Học tiếp <vòng CEFR>", chỉ
      có "Chọn môn để bắt đầu" → Góc học tập (đúng host). Có tiến độ → việc "Tiếng Anh · <vòng>"
      (có tên môn). Logic nằm ở hàm thuần `buildDailyLearningPlan({ hasSubjectProgress })`. —
      `dailyLearningPlan.test.ts` (+3 ca); Home chỉ nối dây (`hasEnglishProgress`).
- [ ] **AC-4.5 Onboarding theo môn:** bước "Bạn muốn học gì?" hiện 6 môn (từ `listSupportedSubjects`);
      chọn môn ≠ Tiếng Anh → sau bước nhóm tuổi, hoàn tất onboarding và tới `subjectHomePath(môn)`;
      chọn Tiếng Anh → luồng 4 bước hiện có, về `/goc-hoc-tap/english` (thay vì `/`). Người đã
      `onboarded` không bị chạm. `presetLevel` từ `/placement` vẫn nhảy thẳng bước trình độ (mặc
      định môn Tiếng Anh). — `Onboarding.test.tsx` (mới, 3 ca), E2E `onboarding-by-subject.spec.ts`.
- [ ] **AC-4.6 Không đổi API/schema:** `POST` onboarding gửi cùng trường như hiện nay (môn khác
      Tiếng Anh gửi giá trị mặc định `level='beginner'`, `goal='daily'`, `minutes=10`), không thêm
      cột. `learning-read-model`/`history`/`progress` server không đổi. — review diff + test API hiện có.
- [ ] **AC-4.7 Cổng đầy đủ + ảnh:** như 02 (`rm -rf … && typecheck/lint/format/build/test:coverage`;
      E2E `route-alias`, `bottomnav`, `english-subject-home`, `english-tools-context`,
      `onboarding-by-subject`, `a11y`, `a11y-aaa`, `mobile-layout-guards`). Ảnh 1440/390 trước/sau:
      sidebar mở cấp 2 (12 mục), `/tien-do`, `/`, Onboarding bước chọn môn.

## ① Phạm vi

**LÀM (03):** `navTree.ts` (ENGLISH_CHILDREN 12 mục, xoá PRACTICE_CHILDREN), `navPaths.ts`
(ENGLISH_PATHS/PRACTICE_PATHS), `DesktopSidebar.tsx` (Luyện tập không children), `BottomNav.tsx`
(nếu tự khớp bằng PRACTICE_PATHS/LEARNING_PATHS thì tự đúng — kiểm), `breadcrumb.ts` (+nút
`/placement`, `/cai-dat`, `/tu-vung`, `/truyen-song-ngu/:id` cha Truyện), `Layout.tsx` (+`backTo`),
14 trang công cụ (`backTo={duongDanMonTiengAnh()}` hoặc `onBack` phân cấp), `Dashboard.tsx` +
`History.tsx` (dòng phụ đề + link), `EnglishHome.tsx` (đủ nút), test + E2E.

**LÀM (04):** `subjectRegistry.ts` (bỏ `isDefault`), `uiLang.ts` (đồng bộ một lần), 8 trang nền
tảng đổi `getDirection` → `useLang`, `Home.tsx` (thẻ Học tiếp có tên môn / thẻ Chọn môn),
`Onboarding.tsx` (bước chọn môn), `App.tsx` không đổi route, test + E2E.

**KHÔNG LÀM:** đổi URL công cụ (S07 mục lục sẽ quyết nếu cần); đổi API/schema/migration; đổi
`RequireAccount`/`AllowGuest`/`FeatureGate`; đường về bài sau đăng nhập (chưa có allowlist +
test open-redirect — để S08); điểm học tiếp đa môn thật (S06/S08); gỡ `getDirection` khỏi trang
MÔN Tiếng Anh; đổi `et_direction`/`ui_lang` key; dịch mới nội dung (chỉ dùng chữ đã có ở `useLang().T`
hoặc cặp `vi/en` tại chỗ như cũ).

## ③ Hợp đồng

```ts
// Layout.tsx
interface LayoutProps { …; back?: boolean; onBack?: () => void; backTo?: string }
// Ưu tiên: onBack (hàm) > backTo (đường dẫn, navigate) > '/' (mặc định cũ)

// uiLang.ts
export function getUiLang(): UiLang
//  ui_lang đã đặt → trả về; chưa đặt: et_direction === 'B' ? 'en' : 'vi', và GHI xuống ui_lang.

// navTree.ts
export const ENGLISH_CHILDREN: NavChild[] // 12 mục, thứ tự cố định (AC-3.1)
// PRACTICE_CHILDREN: XOÁ (breaking nội bộ — chỉ DesktopSidebar/breadcrumb dùng)

// Onboarding: state thêm `subjectId: string` (mặc định '' = chưa chọn); bước 0 chọn môn.
// Gửi API như cũ; điều hướng cuối = subjectHomePath(subjectId) (english → /goc-hoc-tap/english).
```

**Ca lỗi:** `subjectHomePath` mã lạ → `/goc-hoc-tap/<mã>` (đã có test); onboarding không chọn môn
→ nút "Tiếp theo" disabled; `useLang()` ngoài provider → giữ hành vi hiện tại của context.

## ⑤ Bất biến

| Bất biến                                                            | Test canh                                                                      |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Không route công cụ nào đổi URL/gate                                | `route-alias.spec.ts`, `a11y.spec.ts` (danh sách trang), review diff `App.tsx` |
| Không mất nháp/tiến độ/`et_direction`/`ui_lang` của người đang dùng | `guestProgress.test.ts`, `uiLang.test.ts` (ca "đã đặt thì không ghi đè")       |
| Người đã onboarded không thấy lại onboarding                        | `Onboarding.test.tsx`, E2E `login-redirect`                                    |
| a11y AA/AAA, 5 theme, 390/320                                       | `a11y`, `a11y-aaa`, `mobile-layout-guards`                                     |
| Server là authority; không đổi endpoint                             | review diff (`apps/server/src/api` không đổi)                                  |

## ⑥ Quy ước

Như slice 02 §⑥. Thêm: chữ giao diện nền tảng lấy từ `useLang().T` hoặc cặp `lang === 'vi' ? … : …`;
KHÔNG dùng `getDirection` ngoài `pages/subjects/english/`. Commit tách hai nhóm `refactor(learning): …
(slice 03)` và `refactor(learning): … (slice 04)`.

## 7. Quyết định thiết kế (AI quyết theo uỷ quyền, ghi để nghiệm thu)

| #   | Quyết định                                                                      | Lý do                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | **Không dời URL công cụ** dưới `/goc-hoc-tap/english/...`                       | 14 URL đã phát hành, link chia sẻ/SEO; spec cha coi đó là slice riêng; "nằm trong môn" đạt được bằng nav/breadcrumb/Back/tiêu đề mà không đổi địa chỉ. |
| D2  | Cấp 2 "Tiếng Anh" = 12 mục (bỏ `/placement`, `/cai-dat`, `/tu-vung`)            | Sidebar là lối tắt; trang xếp lớp một lần và cài đặt để ở trang tổng quan.                                                                             |
| D3  | "Luyện tập" thành mục lá                                                        | Trang là hub đa môn; mục con Tiếng Anh dưới nó là sai ngữ nghĩa và làm active-nav sai.                                                                 |
| D4  | Dashboard/History giữ ở nền tảng, chỉ thêm phụ đề + link                        | Tiến độ đa môn thật là S12; đổi lớn hơn phải có đặc tả riêng.                                                                                          |
| D5  | Ngôn ngữ giao diện từ `useLang`; đồng bộ một lần từ direction B → `en`          | Không làm đổi trải nghiệm người chiều B; sau đó hai cấu hình độc lập.                                                                                  |
| D6  | Onboarding: bước chọn môn TRƯỚC nhóm tuổi; môn khác Tiếng Anh vẫn hỏi nhóm tuổi | Nhóm tuổi dùng chung toàn nền tảng (giao diện theo tuổi); các bước còn lại là của Tiếng Anh.                                                           |
| D7  | Không đổi API onboarding                                                        | Giữ contract; môn khác gửi giá trị mặc định — server không cần biết môn ở bước này.                                                                    |

## 8. Rủi ro

| Rủi ro                                                                   | Giảm thiểu                                                                                             |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Đổi `getDirection`→`useLang` làm người chiều B thấy giao diện tiếng Việt | D5 + `uiLang.test.ts`; E2E đặt `et_direction=B` không đặt `ui_lang` → tiêu đề Pricing tiếng Anh        |
| Bước chọn môn làm phễu onboarding rớt thêm                               | Đo `onboarding_step_view` đã có (refCode `onboarding:subject`); 1 lượt bấm, có mặc định không chọn sẵn |
| Xoá `PRACTICE_CHILDREN` gãy import                                       | typecheck; `rg PRACTICE_CHILDREN` = 0 sau sửa                                                          |
| 14 trang thêm `backTo` — sót trang                                       | `rg "<Layout" pages/subjects/english` đối chiếu bảng 2.1 trong PR                                      |

## 9. Kế hoạch (một PR, hai nhóm commit)

1. **03-a** navTree/navPaths/sidebar/breadcrumb + test (đỏ→xanh). 2. **03-b** `Layout.backTo` + 14
   trang + Dashboard/History phụ đề + EnglishHome đủ nút + test + E2E `english-tools-context`.
2. **04-a** registry + `uiLang` + 8 trang nền tảng + test. 4. **04-b** Home thẻ Học tiếp / Chọn môn +
   Onboarding chọn môn + test + E2E `onboarding-by-subject`. 5. Cổng đầy đủ, ảnh, changelog 0327,
   `PROGRESS.md` (03/04 ✅, S07 kế tiếp), cập nhật bảng slice ở spec cha.

**Rollback:** revert PR; không migration. Hai nhóm commit cho phép revert riêng 04 nếu phễu onboarding xấu đi.
