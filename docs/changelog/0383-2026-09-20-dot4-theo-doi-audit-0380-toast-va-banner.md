# 0383 — 2026-09-20 — Đợt 4 theo dõi audit 0380: gỡ banner luyện nói + sửa gốc toast đồng bộ lặp

## Việc đã làm

Tiếp nối audit UI/UX `docs/changelog/0380-*.md` — ba phát hiện còn để ngỏ chờ chủ dự án quyết
định. Chủ dự án chốt sửa việc 1 và 2, việc 3 cần backend thật nên vẫn để mở.

1. **Gỡ `ComingSoonBanner` khỏi trang `/luyen-noi`** (`apps/dhcb/src/pages/subjects/english/Speaking.tsx`).
   Banner "Sắp ra mắt — bản đang hoàn thiện" đến từ quyết định 2026-08-09 lúc tính năng còn chưa
   ổn định. Nay CLAUDE.md xác nhận Luyện nói song ngữ đã chạy thật với TTS/STT thật trên
   production — banner giờ chỉ gây hiểu lầm cho người dùng. Component `ComingSoonBanner.tsx`
   vẫn giữ lại (còn dùng ở `AvatarDemo.tsx`), chỉ gỡ import + usage ở `Speaking.tsx`.

2. **Sửa gốc rễ toast "Đã đồng bộ dữ liệu học tập thành công!" bắn lại mỗi lần điều hướng
   trang.** Truy ngược từ `OfflineSyncIndicator.tsx` (hiện banner khi số mục hàng đợi chuyển
   từ >0 về 0) → `useCloudSync.ts` (hook gọi ở TỪNG TRANG: Home/Dashboard/Profile/History/
   EnglishHome/Speaking/Writing/Chat — mount lại mỗi lần điều hướng tới, không phải hook toàn
   cục) → `pullProgress()` → `applyCloudProgress()` trong `apps/dhcb/src/lib/progressSync.ts`.
   Tìm ra: `applyCloudProgress()` gọi `enqueueSync(userId, 'english')` **VÔ ĐIỀU KIỆN** ở cuối
   hàm, dù bản hợp nhất (local ∪ cloud) không có gì mới ngoài đúng bản cloud vừa kéo về. Kết quả:
   mỗi lần mở một trong 8 trang trên, app kéo dữ liệu về rồi **đẩy lại nguyên văn** lên server —
   hàng đợi luôn có đúng 1 mục, gửi xong ngay, và `OfflineSyncIndicator` thấy "chờ → 0" nên bắn
   banner, dù không có gì mới thật sự cần đồng bộ.

   Sửa: thêm cờ `changed`, chỉ tính lại khi hợp nhất THẬT SỰ đưa vào bản mới nội dung mà cloud
   chưa có — so từng nhóm dữ liệu (`learned`/`hard`/`cefrGrammar`/`cefrDialogues`/`achievements`/
   `streakFreezeDates`: local có phần tử cloud chưa có; `srs`/`cefrExams`: bản hợp nhất khác nội
   dung cloud; `placement`/`weeklyGoal`: local thắng theo mốc thời gian; `settings`: nội dung
   khác nhau sau khi bỏ khoá `updatedAt` rỗng — `readSettingsBlob()` luôn trả `updatedAt: ''`
   mặc định nên so JSON trực tiếp sẽ luôn lệch giả). Chỉ gọi `enqueueSync` khi `changed === true`.

## Issue / outcome

Trước: banner "Sắp ra mắt" hiện vĩnh viễn trên tính năng đã chạy thật; toast đồng bộ bắn lại
không cần thiết mỗi lần chuyển trang, có lúc đè lên nút CTA chính ở `/luyen-noi` trên mobile
(nợ đã ghi ở `PROGRESS.md`). Sau: banner đã gỡ; toast chỉ hiện đúng lúc có dữ liệu MỚI thật sự
được đồng bộ (ví dụ vừa học một từ mới trên máy khác), không còn bắn giả mỗi lần điều hướng.

## Research / spec

Không có đặc tả trước — phát hiện từ audit UI/UX trong phiên trước, việc sửa không đổi
schema/API, dùng `fix` cho commit theo đúng tinh thần mục 11 CLAUDE.md.

## Validation

`npm run typecheck` 0 lỗi · `npx eslint apps/dhcb/src/lib/progressSync.ts
apps/dhcb/src/lib/progressSync.test.ts apps/dhcb/src/pages/subjects/english/Speaking.tsx
--max-warnings 0` sạch · `npx vitest run apps/dhcb/src/lib apps/dhcb/src/pages/subjects/english
apps/dhcb/src/pages/core apps/dhcb/src/components` — 200 file / 3835 test xanh · thêm 2 test
canh mới trong `progressSync.test.ts` (không có gì mới → không xếp hàng đẩy lại; có dữ liệu mới
→ vẫn đẩy lên đúng như trước) · cập nhật 1 test cũ (`localStorage đầy khi ghi bản hợp nhất`) cho
khớp logic mới (test cần dữ liệu cục bộ THẬT SỰ mới để việc đẩy lên còn ý nghĩa) · `npm test`
(coverage) chạy nền, xem PROGRESS.md/kết quả CI của PR.

## Rủi ro, rollout và rollback

Rủi ro thấp–vừa: thay đổi logic đồng bộ dữ liệu học tập, đã có test canh cho cả hai nhánh
(có/không có gì mới) và giữ nguyên toàn bộ luật hợp nhất (union/mốc thời gian mới hơn/reps cao
hơn) — chỉ thêm điều kiện TRƯỚC KHI xếp hàng gửi, không đổi cách hợp nhất hay ghi localStorage.
Không đổi schema/API. Rollback: revert commit, không có migration.

## Definition of Done

- [x] Banner "Sắp ra mắt" đã gỡ khỏi `/luyen-noi`
- [x] Toast đồng bộ chỉ bắn khi có dữ liệu mới thật sự, có test canh
- [x] typecheck/lint/test xanh
- [ ] Phát hiện thứ 3 của audit 0380 (màn lỗi API nghi do môi trường) — CHƯA kiểm được vì phiên
      này không có backend Postgres thật (`DATABASE_URL` rỗng); để mở, ghi ở `PROGRESS.md`
