# 0376 — 2026-09-19 — Siết khoá bậc P1→P6 môn Lập trình ở SERVER

PR: (điền số PR khi mở)

## Việc đã làm

Dọn nợ kỹ thuật ghi ở `PROGRESS.md` (2026-09-12, GĐ3, `docs/changelog/0291-*.md`): luật "Free
học tuần tự P1→P6" trước đây **chỉ tính ở client** (`apps/dhcb/src/lib/programmingLevelLock.ts`)
— người sửa `localStorage` hoặc gõ thẳng URL `/lap-trinh/bai-hoc/<id>` vẫn **ghi được** tiến độ
bài thuộc bậc chưa mở (nội dung bài học vẫn không phải bí mật, chỉ tiến độ mới cần siết).

**Chỉ áp cho người dùng ĐÃ ĐĂNG NHẬP** (endpoint `programming-progress` vốn đã đòi `validateAuth`).
Nhánh khách vãng lai (`X-Guest-Id`) KHÔNG đụng tới — giữ nguyên quyết định
`docs/specs/2026-09-15-mo-xem-web-khong-can-dang-nhap.md`.

1. **`packages/subject-programming/levelLockServer.ts`** (mới) — bản SERVER của luật khoá bậc:
   - `buildLevelLessonsServer()`: ráp danh sách bài "đã soạn" từng bậc từ registry ĐẦY ĐỦ
     `lessons.ts` (server luôn có sẵn, khác client dùng `lessonsLoader` nạp lười).
   - `levelOfSpineLesson()`: chỉ bài xương sống `p<n>-u<x>-l<y>` đi qua khoá bậc — bước dự án
     trục (`p1-s1`), module/tiêu chí hướng chuyên sâu (`web-s2-m1`), bài khoá ngắn
     (`git-u2-l1`…) KHÔNG bị khoá theo bậc (đúng phạm vi đặc tả GĐ3 §"PHẠM VI").
   - `checkLevelWriteAllowed()`: dùng LẠI hàm THUẦN `computeLevelLockMap` (đã có, dùng chung với
     client) — không viết lại luật, chỉ ráp dữ liệu server vào.
2. **Grandfather ở server suy TỪ DỮ LIỆU SẴN CÓ, KHÔNG cần migration/cột mới:** client giữ tập
   "bậc đã từng vào" ở `localStorage` (không có cột DB tương ứng — xem comment cũ ở
   `programmingLevelLock.ts`). Server không có localStorage, nhưng suy được tập TƯƠNG ĐƯƠNG:
   bất kỳ bài nào ở một bậc đã có dòng `programming.lesson_progress` (bất kể `status`) tức là
   người học **đã từng vào bậc đó** — cùng đúng phép tính `seedGrandfather()` phía client (cũng
   duyệt toàn bộ tiến độ để đánh dấu bậc đã vào). **Quyết định trong lúc thi hành** (không có
   trong đặc tả gốc, tự chọn theo tinh thần "không khoá oan người dùng hợp lệ hơn là siết chặt
   tuyệt đối" — đúng bất biến §⑤ của đặc tả GĐ3): không thêm cột `levels_entered` mới vì dữ liệu
   đã đủ để suy chính xác, tránh một migration không cần thiết.
3. **`apps/server/src/api/subjects/programming/progress.ts`** — thêm bước kiểm SAU khi tra biên
   nhận idempotency (không tốn query nếu là lần gửi lại) và TRƯỚC transaction ghi: đọc gói hiệu
   lực (`resolvePlan`, khuôn giống `api/core/progress.ts` môn Anh GĐ2a — lỗi đọc DB → fail-safe
   coi như Free, khoá chặt chứ không phát nhầm VIP) + tiến độ hiện có, rồi gọi
   `checkLevelWriteAllowed` cho TỪNG mục trong batch, **mô phỏng tuần tự trong cùng batch** (mục
   sau thấy được các mục ĐÃ QUA của mục trước trong cùng lượt gửi — một batch có thể vừa hoàn
   thành đủ P(n) vừa ghi P(n+1)). Vi phạm → **403** (không phải 500), CẢ BATCH bị từ chối (khớp
   quy ước sẵn có "một mục sai → cả batch 400/403", đơn giản hơn partial success).
4. Test: `packages/subject-programming/levelLockServer.test.ts` (8 ca, hàm thuần — ghi P2 khi
   chưa đủ P1 bị chặn, P1 luôn qua, đủ 70% P1 thì P2 qua, grandfather qua được dù thiếu %, VIP tự
   do, khoá ngoài phạm vi không bị chặn) + 5 ca tích hợp mới trong
   `apps/server/src/api/subjects/programming/progress.test.ts` (Free nhảy bậc bị chặn 403 không
   ghi DB · Free tuần tự P1 qua · grandfather qua · VIP tự do P6 · chưa đăng nhập vẫn 401 trước
   khi chạm bước khoá bậc). Cập nhật 2 test cũ lệch index câu SQL do thêm 2 query mới trước
   transaction.

## Research / spec

`docs/specs/2026-09-12-gd3-khoa-bai-mon-lap-trinh.md` (luật gốc) +
`docs/specs/2026-09-12-gd2-vip-hoc-tu-do-mon-anh.md` (khuôn siết ở server đã áp cho môn Anh, sao
chép cách làm — không sao chép cách lưu grandfather vì môn Anh cần migration 0077 do có sẵn cột
`cefr_unlocked` phải tách, còn môn Lập trình có thể suy thẳng từ `lesson_progress`).

## Validation

Build ✅ | Type ✅ | Lint ✅ 0 cảnh báo | Format ✅ | Test ✅ (toàn bộ + 8 ca mới
`levelLockServer.test.ts` + 5 ca mới `progress.test.ts`, xanh).

## Rủi ro, rollout và rollback

- Rủi ro: người dùng cũ hợp lệ (đã học lên bậc cao trước đợt này) bị khoá oan nếu phép suy
  grandfather sai — đã kiểm bằng test "User GRANDFATHER" (bất kỳ dòng tiến độ nào ở bậc đó, kể cả
  `in_progress`, đều mở). Không đổi schema nên không có rủi ro migration.
- Rollout: chỉ đổi code server, không cần thứ tự deploy đặc biệt (không như migration 0077 của
  môn Anh).
- Rollback: revert PR — client vẫn tính đúng luật như cũ (không đổi `programmingLevelLock.ts`),
  chỉ mất lớp chặn ở server, không ai mất dữ liệu.

## Definition of Done

- [x] Server từ chối ghi tiến độ bài xương sống thuộc bậc chưa mở (Free, chưa đủ %, chưa
      grandfather).
- [x] Không khoá nội dung bài học (đọc) — chỉ chặn ghi.
- [x] Không đụng nhánh khách (`X-Guest-Id`).
- [x] ≥ 3 test canh gác (ghi đúng tuần tự qua · nhảy bậc bị chặn · grandfather qua) — có 8 (đơn
      vị) + 5 (tích hợp).
- [x] `PROGRESS.md` cập nhật tại chỗ, đóng nhánh đã đăng nhập, giữ nguyên nhánh khách.
