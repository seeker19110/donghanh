# 0290 — 2026-09-12 — GĐ2a: server cưỡng chế quyền mở cấp CEFR (VIP học tự do, Free tuần tự)

**PR:** #TBD · **Đặc tả:** `docs/specs/2026-09-12-gd2-vip-hoc-tu-do-mon-anh.md` (phần **GĐ2a**;
phần GĐ2b ở §⑦ CỐ Ý không làm trong đợt này)

## Vấn đề

Luật "VIP vào thẳng cấp nào cũng được, Free đi tuần tự A1→C2 và phải thi đạt mới lên cấp" trước
đây **chỉ tồn tại ở client**: `computeLockedMapPersisted` tính trong trình duyệt rồi ghi tập cấp
đã mở vào `localStorage` (`et_cefr_unlocked_*`), đẩy lên `/api/progress`, và server **ghi hộ mà
không kiểm chứng** (`cefrUnlocked: mergeArrayUnion(existing, d.cefrUnlocked)`). Hệ quả: sửa
localStorage, hoặc POST thẳng `{"cefrUnlocked":["A1",…,"C2"]}`, là mở được toàn bộ lộ trình.

## Đã làm

1. **Hàm thuần dùng chung** `packages/core-learner/cefrUnlock.ts` —
   `computeUnlockedLevels({ plan, exams, grandfathered })`. Không đọc DB/localStorage/đồng hồ nên
   test được không cần DB (bất biến §⑤). Server dùng làm nguồn sự thật, client dùng để hiển thị.
2. **Migration `0077_cefr_unlocked_grandfathered.sql`** — thêm cột
   `english.learning_progress.cefr_unlocked_grandfathered` và **đóng băng** giá trị `cefr_unlocked`
   đang có vào đó. Không có bước này, người dùng cũ (đã mở cấp theo luật CŨ: ≥70% từ vựng + 100%
   ngữ pháp, từ trước khi có bài thi cuối cấp) sẽ bị khoá lại cấp đang học.
3. **`apps/server/src/api/core/progress.ts`** — server tự tính `cefrUnlocked` từ
   `resolvePlan(plan, plan_expires_at)` + `cefr_exams` đã hợp nhất + grandfather, ở **cả GET lẫn
   POST**. Zod schema **bỏ hẳn** trường `cefrUnlocked` (Zod loại khoá lạ ⇒ client gửi lên bị vứt
   im lặng). Transaction + row lock của PR #883 giữ nguyên.
4. **Client** — `progressSync.ts` ngừng gửi `cefrUnlocked`, và nhận danh sách server trả về
   (cả trong response POST lẫn GET) làm nguồn duy nhất; `cefrProgress.ts` thay
   `computeLockedMapPersisted`/`persistUnlockedLevels` bằng `computeLockedMapFromServer` (chỉ đọc).
5. **Giao diện** — `RoadmapTab.tsx` và `CefrLevelPage.tsx` gắn nhãn **"Mở tự do (VIP)"** lên đúng
   những cấp mà người dùng Free sẽ thấy ổ khoá. `Home.tsx`/`EnglishHome.tsx` chuyển sang danh sách
   của server (hai trang này chỉ dùng `lockedMap` để chọn "cấp học tiếp", không có UI ổ khoá nên
   không có chỗ đặt nhãn).

## Quyết định / đánh đổi trong lúc thi hành

- **Bảng là `english.learning_progress`, không phải `public.`** như SQL mẫu trong đặc tả §③ viết —
  migration `0030` đã dời bảng sang schema `english` và để `public.learning_progress` làm VIEW.
  Migration bám bảng thật rồi **dựng lại view** (view `select *` không tự mọc thêm cột).
- **Đọc `plan` NGOÀI transaction.** Đặt trong transaction thì một lỗi đọc `profiles` sẽ abort cả
  transaction Postgres, và `catch` ở tầng JS không cứu được — fail-safe sẽ biến thành hỏng cả lượt
  ghi tiến độ. Ngoài transaction thì lỗi chỉ rơi về `free` đúng như §⑤ yêu cầu.
- **GET cũng tính lại** thay vì trả thẳng cột đã lưu — cần thế thì VIP hết hạn mới bị khoá lại
  đúng lúc (tiêu chí 6) mà không phụ thuộc job dọn dữ liệu chạy trước.
- **POST trả kèm `cefrUnlocked`** (thêm vào `{ok:true}`). Không có nó, người vừa thi đạt phải chờ
  lượt `pullProgress` kế tiếp mới thấy cấp sau mở ra.
- **Client vẫn có nhánh dự phòng tính theo luật sống** khi chưa có bộ đệm (lần đầu mở app / offline)
  — chỉ để HIỂN THỊ; server vẫn cưỡng chế nên đoán sai không cấp thêm quyền gì.

## Sửa test cũ — có chủ đích (tiêu chí §④.7)

- `apps/dhcb/src/lib/cefrProgress.test.ts`: nhóm test `computeLockedMapPersisted` +
  `persistUnlockedLevels` bị thay — hai hàm đó CHÍNH LÀ lỗ hổng đợt này vá (client tự tính rồi ghi
  ngược lên server) và đã bị xoá. Thay bằng nhóm `computeLockedMapFromServer`. Grandfather không
  mất đi, chỉ đổi chỗ thi hành: từ localStorage sang cột DB.
- `apps/dhcb/src/lib/progressSync.test.ts`: `cefrUnlocked` không còn hợp nhất union với bản local —
  union sẽ giữ lại đúng những cấp giả mạo/hết hạn mà server vừa gỡ.
- `apps/server/src/api/core/progress.test.ts`: hai assertion GET đổi vì response nay là kết quả
  server TÍNH, không phải cột đọc thẳng; các mock khớp SQL theo chuỗi con được rút ngắn cho khớp
  câu select đã xuống dòng.

## Bằng chứng kiểm chứng

- Cổng: `npm run build` ✅ · `npm run typecheck` ✅ · `npm run lint` ✅ (0 cảnh báo) ·
  `npm run format` ✅ · `npm test` ✅ **12220/12220 pass, 578 file**.
- Test chống giả mạo (tiêu chí 4 — quan trọng nhất của đợt): Free POST
  `cefrUnlocked: [A1..C2]` → server lưu và trả đúng `['A1']`.
- Đủ 7 tiêu chí §④ có test: VIP mở 6 cấp · Free chỉ A1 · Free đạt A1 → A1+A2 · chống giả mạo ·
  grandfather giữ quyền user cũ · VIP hết hạn khoá lại cấp mở nhờ VIP (cấp thi đạt vẫn mở) ·
  fail-safe đọc plan lỗi → Free.
- **Tầng 8b:** 32 ảnh chụp thật bằng Playwright (Free/VIP × 1440px/390px × Home · EnglishHome ·
  RoadmapTab · CefrLevelPage), trước/sau. Đã NHÌN: nhãn "Mở tự do (VIP)" hiện đúng ở B1/B2/C1/C2
  cho VIP (A1/A2 đã thi đạt nên không gắn nhãn thừa); Free thấy B1 khoá kèm dòng "Thi đạt bài cuối
  cấp A2 để mở khóa"; không lặp nội dung, không tràn ngang ở 390px.

## Rủi ro

⚠️ **PHẢI chạy migration `0077` TRƯỚC khi deploy mã mới.** Ngược thứ tự = mã mới đọc cột chưa tồn
tại và tập grandfather rỗng → người dùng cũ mất quyền trong vài phút giữa hai bước.

**Lỗ hổng CÒN LẠI, cố ý để lại cho GĐ2b:** `cefr_exams` vẫn do client ghi (chấm thi ở trình duyệt),
nên bịa một dòng `{"A1":{"passed":true}}` vẫn mở được cấp sau. Đặc tả §0.2 khuyến nghị **hoãn**
GĐ2b tới khi có dấu hiệu gian lận thật, vì chuyển chấm thi về server làm **mất khả năng thi
offline** của người dùng lương thiện. Quyết định cuối là của chủ dự án.
