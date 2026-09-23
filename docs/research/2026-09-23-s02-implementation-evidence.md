# S02 — Lưu hồ sơ trung thực: bằng chứng triển khai

## Trạng thái và phạm vi

Ngày 2026-09-23, worktree `truthful-profile-save`, nhánh
`codex/uiux-truthful-profile-save`, base `bdf4b838` trên `origin/main` (đã gồm S01).
Sửa lỗi hiện hữu: client trước đây nuốt lỗi lưu và vẫn cache/điều hướng.
Root đã review hợp đồng và mở phạm vi auth prerequisite cùng hai caller; không tự
đánh dấu spec nhóm là Approved. **Chưa commit/push tại thời điểm bàn giao; full gate
và nghiệm thu trực quan còn pending.**

## Hợp đồng đã thực hiện

- `saveOnboarding` trả discriminated union `{ ok: true }` hoặc lỗi HTTP/network/
  timeout/response không hợp lệ. Chỉ `{ ok: true }` do server trả và qua Zod mới được
  xác nhận. Deadline 15 giây bao gồm đọc body; không tự retry POST, không log payload.
  `firePost` và các luồng history không thay đổi.
- Onboarding khóa gửi đồng bộ bằng ref, giữ lựa chọn khi POST lỗi, chỉ cache/speed sau
  server success. Sau success, retry đọc phiên không gửi POST hoặc cache lần nữa.
  Các lựa chọn khóa trong lúc gửi và sau khi đã lưu để UI không khác payload đã lưu.
- Placement giữ kết quả xếp lớp khi lỗi, nút thử lưu lại dùng kết quả đó; cache/speed/
  điều hướng cài đặt chỉ sau success. Không đổi thuật toán xếp lớp hoặc phần phục hồi
  tải S01. Nhánh từ onboarding vẫn trả preset về onboarding, không POST giữa chừng.
- Hai màn remount theo user id và bỏ response sau unmount/token đổi; không áp cache
  hoặc navigation từ response tài khoản cũ.
- Thêm `getCurrentUserVerified()` và `AuthContext.refreshVerified(expectedUserId)`;
  giữ `refresh(): Promise<void>` cũ và cơ chế cookie adoption. Method mới kiểm schema
  AppUser, deadline 15 giây, user id và request generation/token/mounted trước side
  effect. Caller onboarding kiểm thêm `onboarded === true` trước navigation.
- Với refresh verified: 5xx/offline/schema lỗi giữ context hiện tại. 401 hiện hành
  dọn token và chuyển guest theo cơ chế cũ, rồi reject; response 401 cũ không được
  xóa token tài khoản mới. Khi đổi user/guest, draft của tài khoản cũ bị bỏ để tránh
  rò dữ liệu; không hứa giữ draft qua hết phiên hoặc reload.

Không thay server endpoint, schema/migration, mastery, billing, permissions, usage,
projection hoặc API provider. AppUser được đọc từ server; client không tự cấp quyền.

## File thay đổi

Source: `apps/dhcb/src/lib/cloud.ts`, `apps/dhcb/src/context/AuthProvider.tsx`,
`apps/dhcb/src/context/authContext.ts`, `packages/core-ui/clientAuth.ts`,
`apps/dhcb/src/pages/core/Onboarding.tsx`,
`apps/dhcb/src/pages/subjects/english/Placement.tsx`.

Tests: cloud, Onboarding, AuthProvider (mới), Placement.save (mới),
clientAuth.verified (mới), hai E2E onboarding-by-subject/profile-save-recovery.
Bốn fixture AuthContext được thêm stub typed cho method mới:
HomeUniversalAiBar, StemLesson, MistakeBank, useStemCompletionState; không đổi assertion.

## Bằng chứng kiểm thử

Runtime Node `22.23.2`; cài `npm ci --ignore-scripts --no-audit --no-fund`, không sửa
lockfile. Codemap chạy trước edit: cloud 219 file liên đới gián tiếp, Onboarding 3,
Placement 2, AuthProvider 2, authContext 106, clientAuth 13. Giữ nguyên mọi caller cũ
của `refresh` và `getCurrentUser` ngoài phần phối hợp generation trong provider.

| Kiểm tra                                                                         | Kết quả                           |
| -------------------------------------------------------------------------------- | --------------------------------- |
| Targeted Vitest 10 file, 1 worker                                                | **200/200 pass**                  |
| E2E onboarding-by-subject + profile-save-recovery, Chromium, 1 worker, port 5184 | **8/8 pass**, lượt cuối 16.7 giây |
| `npm run typecheck` (4 tsconfig)                                                 | **PASS** ở lượt chạy tuần tự      |
| ESLint toàn bộ file TS/TSX thay đổi                                              | **PASS**                          |
| Prettier file thay đổi + báo cáo                                                 | **PASS**                          |
| `git diff --check`                                                               | **PASS**                          |

10 file unit gồm cloud, Onboarding, Placement.save, AuthProvider, clientAuth.verified,
clientAuth cũ và bốn suite server/domain có sẵn: profile, lifeGraphService,
learningGoalAdapter, personService. Các ca mới kiểm HTTP 400/401/403/429/500, body HTML/
JSON sai, offline, timeout, retry cùng payload, double click, unmount, user mismatch,
onboarded=false, cookie-only startup, stale success/401 sau đổi tài khoản, logout.
E2E dùng mock API; POST mock đã sửa trả `{ ok: true }` đúng endpoint, auth GET phản ánh
onboarded sau lưu thay vì giả profile object cho POST.

Lượt typecheck đầu bị Node OOM `Zone` khi nhiều workstream hoạt động; lượt tuần tự sau
đã pass, không thay ngưỡng hoặc tắt check. Fixture Placement ban đầu dùng timestamp số
trong `lastAt` sai contract ISO; sửa fixture đúng dạng ISO rồi ba ca pass.

Cảnh báo môi trường: prewarm E2E không có DATABASE_URL nên app settings dùng mặc định,
PostCSS cảnh báo thiếu `from`. Suite profile cũ có stderr projection từ mock thiếu
row; endpoint vẫn đi nhánh catch như mã hiện hành. Không coi các cảnh báo này là bằng
chứng DB đã hoạt động hoặc projection luôn đồng bộ.

## Rủi ro và kiểm tra còn mở

- Chưa chạy PostgreSQL thật cho response thất lạc/retry/concurrency. Suite profile
  xác nhận dual-write/rollback trong transaction bằng fake; lifeGraphService kiểm lock
  Person trước source và source có sẵn không insert trùng. Đây là bằng chứng cấu trúc/
  unit, **không thay bằng chứng concurrency DB thật**. Không thiết lập DB hoặc dùng
  credentials production trong slice này.
- `getCurrentUser` legacy giữ hành vi cũ; không tuyên bố S02 sửa mọi race hoặc lỗi
  transient ở mọi caller auth. Method verified mới là đường có contract chặt cho S02.
- Chưa chạy full build/lint/format/unit/E2E suite tại worktree này; root điều phối
  full gate/CI sau review. Không dùng số pass từ S01/S03 cho slice S02.
- Chưa có ảnh trước/sau hoặc ma trận thủ công 320/390/768/1440 và ba theme. UI chỉ thêm
  pending/error/retry và khóa control, nhưng nghiệm thu trực quan vẫn còn phải làm.
- Rollback bằng revert đồng bộ helper, hai caller, method auth và fixtures/tests.
  Không migration hoặc sửa dữ liệu đã lưu. Không revert helper riêng khỏi caller.
