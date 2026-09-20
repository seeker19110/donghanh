# 0389 — 2026-09-20 — Gỡ hẳn trụ Sự nghiệp/Khởi nghiệp/Đời sống, "Công việc" → "Ghi chú"

## Việc đã làm

Theo yêu cầu của chủ dự án khi xem ảnh chụp sidebar desktop: **bỏ hẳn** mục "Sự nghiệp & Đời
sống", **giữ lại** nửa "Công việc" nhưng đổi tên hiển thị thành **"Ghi chú"**, đưa nó thành
trang cấp 1 độc lập, và **nối nội dung ghi chú vào ngữ cảnh Bạn Đồng Hành**. Bổ sung giữa
chừng: **mỗi ghi chú tối đa 10.000 ký tự**, validate cả client lẫn server.

### 1. Gỡ ba trụ khỏi giao diện

Xoá HẲN trang + route + client API của:

- studio `career` — `pages/domains/careerstartup/CareerStartup.tsx`, `career/Career.tsx`,
  `career/CareerInterview.tsx`, `startup/Startup.tsx`, `startup/StartupCanvas.tsx`, cùng
  `lib/careerApi.ts`, `lib/careerInterviewApi.ts`, `lib/startupApi.ts` (+ test).
- nửa "Đời sống" của studio `worklife` — `pages/domains/life/{Life,LifeGraph,LifeWheel}.tsx`,
  `lib/lifeApi.ts`, `lib/lifeGraphApi.ts` (+ test).
- trang gộp `pages/domains/worklife/WorkLife.tsx` (không còn tab nào để gộp).

`studios.ts` từ 5 studio còn 4: `career` + `worklife` thay bằng **`notes`** (`/ghi-chu`, icon
`StickyNote`, màu rose).

### 2. "Công việc" → "Ghi chú", trang cấp 1

`pages/domains/work/{Work,WorkKanban}.tsx` → `pages/domains/notes/{Notes,NotesKanban}.tsx`
(`git mv`, giữ lịch sử). **Bố cục Kanban và kiểu dữ liệu giữ NGUYÊN** — chỉ đổi tên hiển thị,
bỏ chế độ `embedded` (không còn ai nhúng nó), đổi tiêu đề trang thành "Ghi chú", tab "Tài liệu"
thành "Ghi chú". Route `/ghi-chu` + `/ghi-chu/kanban`.

Tên kỹ thuật **cố ý giữ tiền tố `work`** ở API (`/api/work`), bảng CSDL (`worklife.*`),
`workApi.ts` và khoá domain `work` của consent — đổi chúng là migration dữ liệu + huỷ bản ghi
consent đã phát hành, không đáng đổi chỉ vì tên hiển thị.

### 3. Không link nào gãy

`navPaths.ts` thay `CAREER_PATHS`/`WORKLIFE_PATHS`/`CAREER_LIFE_PATHS` bằng:

- `NOTES_PATHS` — làm sáng mục sidebar "Ghi chú".
- `LEGACY_NOTES_PATHS` — URL cũ trụ Công việc (`/cong-viec`, `/work`, `/cong-viec-cuoc-song`,
  `/work/kanban`…) → `<Navigate to="/ghi-chu" replace>`.
- `REMOVED_DOMAIN_PATHS` — 18 URL cũ của ba trụ đã gỡ → **Trang chủ**. Cố ý KHÔNG đẩy sang
  `/ghi-chu`: nội dung đó không còn tồn tại, đưa người dùng tới một trang khác hẳn rồi im lặng
  là nói dối về nơi họ đang đứng.

Sửa kèm cho khớp thực tế: `DesktopSidebar.tsx` (mục gộp → mục lá), `breadcrumb.ts`, `Home.tsx`,
`GuestHome.tsx`, `Profile.tsx`, `About.tsx`, `learningDestination.ts` (bỏ từ khoá trỏ tới
`/career/interview` đã xoá), `i18n` tagline, meta description của `apps/dhcb` + `apps/hub`, và
toàn bộ phần giới thiệu "bốn trụ" trong `apps/hub/src/App.tsx`.

### 4. Ghi chú vào ngữ cảnh Bạn Đồng Hành

`packages/core-domains/domainReadModelService.ts` — `getWorkReadModel` nạp thêm:

- `recentNotes`: **5** ghi chú mới nhất, mỗi cái cắt ở **400** ký tự (`NOTE_CONTEXT_LIMIT` /
  `NOTE_CONTEXT_EXCERPT`) — đủ để Companion gọi đúng tên và nói đúng nội dung, không nuốt hết
  ngân sách token của một lượt.
- `openTaskTitles`: tiêu đề việc **chưa xong** (lọc trước rồi mới cắt, nếu không người có nhiều
  việc đã xong sẽ ra danh sách rỗng dù còn việc tồn đọng).

Đây là **ngoại lệ có chủ ý** với luật "chỉ đưa số đếm, không đưa nội dung tự do" ghi ở đầu file
đó — đã ghi rõ lý do tại chỗ. Vẫn đi qua đúng cổng cũ: `isConsentActive(personId, 'work',
purpose)` ở `contextEngine` và độ nhạy `personal` của `domainState`; không lách cổng nào.
Nhãn hiển thị `[Domain: Work]` → `[Domain: Ghi chú]`.

### 5. Giới hạn 10.000 ký tự cho nội dung ghi chú

`NOTE_CONTENT_MAX_LENGTH = 10_000` ở `packages/core-contracts/work.ts` là **nguồn duy nhất**,
dùng cho cả ba tầng:

- hợp đồng: `WorkDocumentSchema.summary` (từ 2.000 → 10.000);
- server: Zod của `POST /api/work` — **cổng thật**, không tin client (CLAUDE.md 4.2);
- client: `maxLength` của textarea + bộ đếm ký tự (`aria-live="polite"`, chỉ hiện khi đã dùng
  quá 80% hạn mức để không làm nhiễu ô nhập).

Cột CSDL vẫn là `TEXT` không giới hạn — **không tạo migration mới**, tái dùng bảng `worklife`
của migration 0066 đúng như yêu cầu. Lý do không siết kiểu cột: bản ghi cũ dài hơn ngưỡng (nếu
có) vẫn phải đọc lên được để người dùng tự cắt.

### 6. Sửa kèm — lỗi của chính trang được giữ lại

`lib/workApi.ts` gửi `kind: 'project_status'` / `'task_status'` trong PATCH, không khớp
discriminator nào của `PatchBodySchema` (`'project'` / `'task'`) ở
`apps/server/src/api/domains/work.ts` → **mọi lần đổi trạng thái dự án/việc đều bị server trả
400**, im lặng, không cổng nào bắt. Đã sửa + thêm test hồi quy đọc thẳng `body` của `fetch`.

## Quyết định

- **KHÔNG xoá backend của ba trụ đã gỡ** (`/api/{career,startup,life,life-graph}`,
  `careerService`/`startupService`/`lifeFoundationService`/`lifeGraphService`, read model của
  chúng trong `domainReadModelService`). Hai lý do: (1) `lifeGraphService` là động cơ đồ thị
  xuyên miền mà `contextEngine`, `crossDomainGraphService`, `crossDomainSynergyService`,
  `subconsciousService` và `lifeSynthesis` của **Companion** đang dùng — xoá là gãy chính tính
  năng người dùng muốn giữ và mở rộng; (2) xoá bảng/dữ liệu người dùng là thao tác không hoàn
  tác được, thuộc diện CLAUDE.md mục 12 "phải dừng và hỏi". Với người dùng mới, các read model
  đó đơn giản là rỗng vì không còn đường nào nhập dữ liệu. **Cần chủ dự án quyết riêng** nếu
  muốn xoá luôn dữ liệu và API.
- **KHÔNG đụng nhãn taxonomy `career`/`startup`/`life`** trong các thành phần của Companion
  (`CompanionStudios/studioTypes.ts`, `MetacognitiveReflectionModal`, `LifeSynthesis*`,
  `CrossDomainSynergyCard`, `AgentOrchestratorCard`). Đó là phân loại chủ đề trò chuyện của
  Companion, không phải trang của ba trụ — ngoài phạm vi đợt này.

## Bằng chứng kiểm chứng

Chạy thật trên nhánh `claude/peaceful-pascal-d53qnq`, sau `npm ci` và sau khi
`rm -rf packages/*/dist dist dist-server` (tái hiện checkout sạch của CI):

| Cổng   | Lệnh                     | Kết quả                                      |
| ------ | ------------------------ | -------------------------------------------- |
| Build  | `npm run build`          | ✅ xong cả 3 bước (app + server + hub)       |
| Type   | `npm run typecheck`      | ✅ 0 lỗi (4 tsconfig)                        |
| Lint   | `npm run lint`           | ✅ 0 cảnh báo (`--max-warnings 0`)           |
| Format | `npx prettier --check .` | ✅ All matched files use Prettier code style |
| Test   | `npm test`               | ✅ 710 file, **14952 test xanh**, 2 skipped  |

E2E (Playwright) **chưa chạy** trong môi trường này — các spec đã được cập nhật theo route mới,
CI sẽ là lượt chạy thật đầu tiên.

Test mới thêm trong đợt này:

- `apps/server/src/api/domains/work.test.ts` — ca biên 10.000 ✅ / 10.001 ❌ / rỗng ❌.
- `packages/core-domains/domainReadModelService.test.ts` — ghi chú vào ngữ cảnh, cắt ở ngưỡng,
  chỉ lấy 5 cái mới nhất, việc đã xong không lọt vào danh sách tồn đọng.
- `apps/dhcb/src/lib/workApi.test.ts` — canh discriminator PATCH.
- `apps/dhcb/src/lib/navPaths.test.ts` — hai bảng URL cũ không giao nhau (nếu giao thì App.tsx
  dựng hai `<Route>` cùng path và cái sau chết lặng).
- `apps/dhcb/src/lib/studios.test.ts`, `DesktopSidebar.test.tsx`, `breadcrumb.test.ts` — canh
  ba trụ đã gỡ không lẻn trở lại.
