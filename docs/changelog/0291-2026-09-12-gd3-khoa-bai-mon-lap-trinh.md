# 0291 — 2026-09-12 — GĐ3: khoá bậc tuần tự môn Lập trình (Free), VIP học tự do

**PR:** #TBD · **Đặc tả:** `docs/specs/2026-09-12-gd3-khoa-bai-mon-lap-trinh.md` (đã chốt đủ)
**Phụ thuộc:** GĐ1 (#886, hai gói free/vip) + GĐ2a (#887, luật mở cấp CEFR ở server)

## Việc đã làm

- **Ngưỡng 70% dùng chung cả nền tảng.** Thêm `packages/core-learner/unlockThreshold.ts`
  (`UNLOCK_PCT = 0.7` + `requiredToUnlock(total)` làm tròn LÊN). `apps/dhcb/src/lib/cefrProgress.ts`
  nay import lại từ đó rồi re-export — môn Anh và môn Lập trình dùng ĐÚNG MỘT con số, không còn
  hai số 70 rời rạc (đặc tả §⑥).
- **Luật khoá bậc — hàm THUẦN.** `packages/subject-programming/levelLock.ts`:
  `computeLevelLockMap({ levels, completedLessonIds, plan, everUnlocked })`.
  - P1 luôn mở · P(n+1) mở khi ≥70% số bài ĐÃ SOẠN của P(n) có `status='completed'`.
  - VIP → mở hết. Grandfather → giữ nguyên quyền đã có.
  - Bậc bị khoá dây chuyền vẫn chỉ ra ĐÚNG bậc đang chặn, để câu giải thích không nói sai.
- **Persist tách riêng** (`apps/dhcb/src/lib/programmingLevelLock.ts`): ráp danh sách bài từ chỉ
  mục nhẹ `lessonsLoader` (KHÔNG chạm registry 3 MB), nhớ "bậc đã từng vào" trong localStorage.
- **Giao diện có LỜI GIẢI THÍCH, không phải ổ khoá câm:** thẻ bậc ở `ProgrammingHome` hiện nhãn
  "đang khoá" + câu "Còn N bài ở P1 nữa là mở — đã xong X/Y bài cần thiết"; trang bậc
  (`ProgrammingLevelPage`) hiện khối "Bậc này chưa mở" + lối quay lại học tiếp, ẩn nút "Học bài"
  nhưng GIỮ đề cương unit để người học thấy mình đang tiến tới cái gì.

## Quyết định / đánh đổi (tự quyết trong lúc thi hành)

1. **Grandfather bằng localStorage, KHÔNG migration** (đặc tả §③ cho phép chọn). Lần đầu mở app
   sau deploy, `seedGrandfather` đọc tiến độ server rồi ghi mọi bậc người dùng ĐÃ có tiến độ vào
   tập "đã từng vào". Mất localStorage chỉ đưa người học về đúng luật tuần tự — không mất tiến độ.
   Nếu về sau cần chắc chắn hơn thì chuyển sang cột DB như môn Anh đã làm ở migration 0077.
2. **Cưỡng chế ở CLIENT, chưa ở server.** Đặc tả để mở ("chỉ nếu chọn paywall server-side").
   Chọn không đụng `api/subjects/programming/progress.ts` đợt này: nội dung bài học không phải bí
   mật (có thể đọc công khai ở trang giới thiệu), còn thứ đáng bảo vệ — tiến độ, hạn mức AI — vốn
   đã do server giữ. Ghi lại thành nợ mở nếu sau này muốn chặn cả truy cập thẳng URL bài học.
3. **Dùng `effectivePlan(user.plan)`** thay vì `user.plan` thô, để đợt khuyến mãi "full access"
   mở khoá đúng như mọi quyền lợi VIP khác.
4. Bỏ `useMemo` ở `ProgrammingLevelPage` vì lint `react-hooks/preserve-manual-memoization` từ chối
   tối ưu cả component — React Compiler đã ghi nhớ hộ.

## Bằng chứng kiểm chứng

- `npm run build` ✅ · `npm run typecheck` ✅ · `npm run lint` ✅ (0 cảnh báo) · `npm run format` ✅
- `npm test` ✅ **581 file / 12242 test** (thêm 11 test thuần cho `levelLock`, 7 test persist +
  trang, 1 test canh "hướng chuyên sâu không bị khoá lây").
- Ca biên đặc tả §④ đã có test: **69% → vẫn khoá, còn ĐÚNG 1 bài** · **70% → mở** ·
  **bậc RỖNG không khoá bậc sau** · VIP mở hết · grandfather giữ P3.
- `npx playwright test e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts` ✅ **402 test** (15 trang × 5 theme),
  gồm `/lap-trinh` với ổ khoá + chữ giải thích → tiêu chí §④.6 đạt.
- `npx playwright test e2e/programming-home.spec.ts` ✅ 4 test (thêm ca "P2 khoá, nói rõ còn thiếu").
- **Tầng 8b — ảnh chụp trang thật 1440px + 390px, TRƯỚC/SAU** (`/lap-trinh` và
  `/lap-trinh/p2--nen-tang-vung`, cả Free lẫn VIP): đã chụp và soi bằng mắt. Xác nhận: Free thấy
  ổ khoá + câu giải thích ở cả hai bề rộng; VIP không thấy ổ khoá nào; bản TRƯỚC không có gì bị
  mất ngoài các nút "Học bài" của bậc đang khoá.
- `npm run codemap -- impact packages/subject-programming/lessonsLoader.ts` chạy TRƯỚC khi sửa
  (17 file bị ảnh hưởng — đã soát, chỉ chạm đúng 3 file giao diện trong danh sách đó).

## Phạm vi KHÔNG đụng

Hướng chuyên sâu (14 hướng) · khoá ngắn · lộ trình mục tiêu · khoá bước trong một dự án
(`ProgrammingProjectPage.tsx` `isStageUnlocked`) — giữ nguyên, có test canh cho mục đầu.
