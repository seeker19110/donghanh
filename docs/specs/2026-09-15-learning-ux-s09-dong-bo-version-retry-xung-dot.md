# Học tập liền mạch — slice S09: Đồng bộ tiến độ có version, retry và xử lý xung đột (cross-device)

| Thuộc tính    | Giá trị                                                                                                                                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec nền      | [`2026-09-15-learning-ux-foundation.md`](2026-09-15-learning-ux-foundation.md) §④ D gạch 4 ("Resume cùng thiết bị/cross-device cần spec riêng: offline khi gửi, server lưu rồi timeout, hai tab, thiết bị cũ gửi muộn, hết auth, đổi version bài"), §⑤, "Rollout và rollback" |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md) dòng S09 (dependency: S11 + sync spec); rủi ro "Mất bài/ghi đè tiến độ — hai tab, timeout sau server commit → Version/idempotency và test trước S09"                                                                      |
| Spec anh em   | S08 khung phiên `LearningSession` (`…-s08-khung-phien-resume.md`, đang viết song song) · S11 `CompletionEvidence` + `POST /api/learning/evidence` (`…-s11-completion-evidence.md`, đang viết song song) — S09 chỉ THAM CHIẾU TÊN, không định nghĩa lại                        |
| Mẫu cấu trúc  | [`2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md`](2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md)                                                                                                                                                                              |
| Base khảo sát | `main` `7c2d81c` (#928), khảo sát 2026-09-15 bằng đọc mã thật + `grep` + `npm run codemap -- impact`; mọi số đếm trong spec là số đo thật ở base này                                                                                                                          |
| Trạng thái    | **Approved for implementation** — chủ dự án chốt TOÀN BỘ câu hỏi §7 theo đề xuất mặc định (2026-09-15)                                                                                                                                                                        |
| Người duyệt   | Chủ dự án                                                                                                                                                                                                                                                                     |

> Không bắt đầu code khi trạng thái chưa là **Approved for implementation**. Luật số 1 của khuôn
> `docs/templates/dac-ta-tinh-nang.md`: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.
>
> Thứ tự chốt của goal: S07 → S08 → S06 → S05 → S10 → S11 → **S09** → S12 → S13. S09 đứng SAU S11
> vì evidence (S11) là loại "tài liệu tiến độ" thứ ba phải đi qua cùng một hàng đợi gửi lại.
> Spec nền "Rollout và rollback" đòi: "Các slice persistence sau phải có version/migration/rollback
> riêng trước review" — §9 của spec này là câu trả lời.

## 0. Một câu

Bảo đảm mọi thay đổi tiến độ học (môn Anh · môn Lập trình · evidence S11) mà người học tạo ra
trên BẤT KỲ thiết bị/tab nào, kể cả khi mất mạng, hết phiên đăng nhập hay server đã lưu rồi mới
timeout, **đến được server đúng một lần, không bao giờ kéo lùi tiến độ đã có, và khi hai bên
thật sự mâu thuẫn thì giữ cả hai rồi hỏi người học** — bằng version đơn điệu ở server +
idempotency theo lần gửi + hàng đợi gửi lại theo chủ sở hữu ở client.

## ④ Tiêu chí chấp nhận (đo được — mỗi dòng ghi lệnh/bằng chứng)

Chia 3 PR con (§9): **S09-1** schema/version/idempotency ở server · **S09-2** outbox + retry +
hai tab ở client · **S09-3** xung đột không tự gộp được (`ConflictRecord`) + UI hỏi người học.
AC ghi rõ thuộc PR nào. Ma trận 6 ca bắt buộc của spec nền §④ D được ánh xạ ở cuối mục.

### S09-1 — server: version đơn điệu + idempotency, KHÔNG đổi luật merge

- [ ] **AC-1 Version đơn điệu cho tài liệu tiến độ môn Anh.** Sau migration `0083` (S05 lấy `0081`, S11 lấy `0082`),
      `GET /api/progress` trả thêm `version: number ≥ 1`; mỗi `POST /api/progress` thành công tăng
      `version` đúng 1 (kể cả khi payload không đổi gì — vì server vẫn ghi `updated_at`); hai POST
      liên tiếp trả `version` = n, n+1. Test đọc lại cột `version` trong câu `insert … on conflict`
      (mock `pg` như `progress.test.ts` đang làm, 30 ca hiện có vẫn xanh). —
      `npx vitest run apps/server/src/api/core/progress.test.ts`.
- [ ] **AC-2 `baseVersion` khớp → áp; lệch → vẫn merge theo luật domain hiện có, trả bản gộp.**
      Body có `sync.baseVersion = v` và server đang ở `v` → merge như hôm nay, trả
      `{ ok, version: v+1, conflict: false }`. Server ở `v+k` (k ≥ 1, thiết bị khác đã ghi) →
      **vẫn** merge bằng đúng 4 hàm `mergeArrayUnion`/`mergeSrsMap`/`mergeExamMap`/`mergeByTimestamp`
      (không thêm hàm merge mới, `progressMerge.ts` `git diff` = rỗng), trả
      `{ ok, version: v+k+1, conflict: true, merged: <ProgressDoc đầy đủ> }` để client thay bản
      cục bộ. Thiếu `sync` (client cũ) → đường cũ y nguyên, response vẫn có `version`. — test 3 ca
      trong `progress.test.ts` + `progressMerge.test.ts` (11 ca) không đổi.
- [ ] **AC-3 Gửi trùng không ghi hai lần, không cộng thưởng hai lần.** Hai `POST /api/progress`
      cùng `sync.attemptId` (UUID) → lần 2 KHÔNG chạy transaction merge, KHÔNG gọi
      `grant_daily_bonus_rolling`, KHÔNG insert `daily_plan_completions`; trả lại đúng response đã
      lưu trong `public.sync_receipts` kèm `replayed: true`. `attemptId` trùng nhưng KHÁC `user_id`
      → xử lý bình thường (khoá chính là `(user_id, attempt_id)`). — `progress.test.ts` ca "replay"
      đếm số lần `client.query` chứa `insert into english.learning_progress` = 1 trên 2 request.
- [ ] **AC-4 Hai request đồng thời cùng user không mất dữ liệu, version không trùng.** Test tích
      hợp chạy trên Postgres thật (job `unit` CI có service Postgres? — kiểm `ci.yml`; nếu không có
      thì test đánh dấu `describe.skipIf(!process.env.DATABASE_URL)` và ghi rõ trong PR là đã chạy
      ở máy với DB thật, dán output): `Promise.all` 2 POST với `baseVersion` cùng = 1, payload A
      thêm từ `cat`, payload B thêm từ `dog` → sau đó GET có CẢ `cat` và `dog`, `version = 3`, đúng
      một trong hai response có `conflict: true`. Cơ chế: `select … for update` đã có ở
      `progress.ts:229-235` giữ tuần tự; test canh không ai bỏ dòng đó. —
      `apps/server/src/api/core/progress.concurrency.test.ts` (mới).
- [ ] **AC-5 Programming: version theo dòng, batch, replay.** `POST /api/programming/progress`
      nhận thêm dạng batch `{ attemptId, items: [{ lessonId, status, clientUpdatedAt }] }` (≤ 50
      mục, mỗi mục qua đúng regex + `getLesson`/`getProjectStep`/`isSpecProgressKey` hiện có); dạng
      cũ `{ lessonId, status }` vẫn hợp lệ. Mỗi dòng `programming.lesson_progress` có
      `version` tăng 1 mỗi lần upsert; response `{ ok, lessons: [{lessonId,status,completedAt,version}],
replayed }`. Gửi lại cùng `attemptId` → replay, không upsert. Bất biến "completed không kéo
      lùi" giữ nguyên (câu `case when … = 'completed'` không đổi). — `programming/progress.test.ts`
      (8 ca cũ + ≥ 4 ca mới).
- [ ] **AC-6 Migration lũy đẳng, rollback được.** `postgres/migrations/0083_sync_version_receipts.sql`
      chạy **2 lần liên tiếp** trên DB đã áp `schema.sql` → lần 2 exit 0, không lỗi "already
      exists"; backfill `version = 1` cho mọi dòng hiện có (default), `client_updated_at` NULL; view
      `public.learning_progress` lộ cột mới ở CUỐI (`create or replace view`, khuôn `0077`); đoạn
      ROLLBACK ghi trong comment cuối file chạy được (test bằng tay, dán output vào PR). —
      `npm run migrate:pg` ×2 trên DB local + `scripts/migrate-pg.test.ts` nếu có; nếu không, ghi
      output tay.
- [ ] **AC-7 Rate limit không đổi, 429 mang `Retry-After`.** `/api/progress` vẫn `checkRateLimit(ip,
30, 'progress')`, `/api/programming/progress` vẫn 60; response 429 thêm header
      `Retry-After: 60` để client lùi đúng. Replay (AC-3) VẪN tính vào rate limit (đếm trước khi tra
      receipt — không cho ai dùng replay để dò receipt miễn phí). — `progress.test.ts` ca rate
      limit hiện có mở rộng kiểm header.

### S09-2 — client: outbox theo chủ sở hữu, retry, gộp, hai tab, hết auth

- [ ] **AC-8 Offline khi gửi → không mất, tự gửi khi có mạng.** Unit: `navigator.onLine=false`,
      gọi `markLearned` → `fetch` KHÔNG được gọi, `dhcb_sync_outbox_<uid>` có 1 mục kind
      `'english'`; bắn `window 'online'` → đúng 1 POST với payload đọc localStorage LÚC GỬI, outbox
      rỗng sau 200. E2E `e2e/sync-offline.spec.ts` (mới): `mockLogin` → `context.setOffline(true)` →
      học 1 từ → `setOffline(false)` → `page.waitForRequest('**/api/progress')` thấy đúng 1 POST
      có `sync.attemptId`. Hiện repo có **0** file E2E dùng `setOffline` — đây là ca đầu tiên. —
      `apps/dhcb/src/lib/syncOutbox.test.ts` + E2E.
- [ ] **AC-9 Gộp nhiều thay đổi thành một request, không chạm rate limit.** 40 lần `rate()` SRS
      trong 5 giây (một phiên ôn nhanh) → ≤ 2 POST `/api/progress` (debounce 1 500 ms + gộp mục
      cùng kind/uid; hôm nay là 40 POST → vượt 30/phút → 429 → `console.warn` mất im lặng, xem §②
      phát hiện F3). `pushProgressAsync()` vẫn resolve SAU KHI server đã nhận (`CefrExam.tsx` claim
      cần điều này) — hàm gọi `flush(uid)` và await. — `syncOutbox.test.ts` với fake timers.
- [ ] **AC-10 Retry backoff có trần, không retry lỗi 4xx (trừ 401/408/429).** Lỗi mạng/5xx/timeout
      → lùi 2 s → 4 s → 8 s → 16 s → 32 s (tối đa 6 lần một phiên tab; sau đó chờ `online`/
      `visibilitychange`/mở app lần sau — mục KHÔNG bị xoá). 400/403/404/413 → xoá mục, ghi
      `console.warn` kèm `attemptId` (gửi lại mãi cũng không thành). 429 → lùi theo `Retry-After`.
      401 → giữ mục, dừng gửi tới khi có token mới (AC-13). — `syncOutbox.test.ts` fake timers ≥
      6 ca.
- [ ] **AC-11 Server lưu rồi timeout → gửi lại cùng `attemptId`, không đếm hai lần.** Mock `fetch`
      lần 1 reject sau khi server "đã commit" (test giả lập bằng cách lần 2 trả `replayed: true`)
      → outbox gửi lại cùng `attemptId` (so sánh 2 body), nhận `replayed` → coi là thành công, ghi
      `version` server trả về vào `dhcb_sync_version_<uid>`. Bất biến: **`attemptId` chỉ đổi khi
      payload đổi; gửi lại nguyên payload giữ nguyên `attemptId`** (nếu payload đổi vì người học học
      tiếp trong lúc chờ → mục mới, `attemptId` mới; mục cũ vẫn gửi cho xong). — unit test.
- [ ] **AC-12 Hai tab cùng chủ: một tab gửi, tab kia không gửi trùng, cả hai thấy kết quả.** Hai
      `BrowserContext.newPage()` cùng `storageState` → tab A học từ `cat`, tab B học từ `dog` trong
      cùng 2 s → đúng **1** POST (giữ khoá `navigator.locks.request('dhcb-sync-<uid>')`, §③.4); sau
      khi POST xong, tab kia nhận sự kiện `storage` và render đủ 2 từ. Trình duyệt không có Web
      Locks (`navigator.locks === undefined`, test giả lập) → mỗi tab tự gửi, server merge — không
      mất dữ liệu, chỉ tốn 2 request. — E2E `e2e/sync-two-tabs.spec.ts` (mới) + unit.
- [ ] **AC-13 Hết auth: giữ outbox, gửi sau khi đăng nhập lại ĐÚNG chủ; đổi tài khoản không gửi
      chéo.** Token hết hạn → 401 → mục nằm lại, `OfflineSyncIndicator` hiện "N mục chờ đồng bộ —
      đăng nhập lại"; đăng nhập lại cùng `uid` → gửi hết; đăng nhập `uid` KHÁC → outbox của `uid`
      cũ KHÔNG gửi (không đọc `dhcb_sync_outbox_<uid cũ>`), không xoá; đăng xuất KHÔNG xoá outbox.
      Khách vãng lai (`isGuestId`) không bao giờ vào outbox (như `pushProgressAsync` hôm nay, dòng
      287). — `syncOutbox.test.ts` + `guestProgress.test.ts` (mở rộng).
- [ ] **AC-14 Thiết bị cũ gửi muộn (baseVersion cũ, dữ liệu cũ) → UI không "nhảy lùi".** Client
      nhận `conflict: true` + `merged` → thay localStorage bằng `merged` (union nên chỉ thêm),
      tăng `version` của `useCloudSync` để `useMemo` tính lại; test canh: local có 5 từ đã thuộc,
      `merged` có 7 → sau khi áp local có 7, KHÔNG BAO GIỜ ít hơn 5. `hard` (ghi đè theo client —
      luật hiện có, không đổi ở S09, ghi nợ §7 Q6) áp theo `merged`. — unit test + E2E "thiết bị
      cũ" mô phỏng bằng `page.route` trả `conflict:true`.
- [ ] **AC-15 Programming offline không còn mất khi fetch về.** Hôm nay `fetchProgress` ghi đè cache
      bằng bản server (`programmingProgress.ts:40`) nên bài hoàn thành lúc offline **biến mất** ở
      lần mở sau (phát hiện F4 §②). Sau S09: `fetchProgress` áp các mục outbox `programming` còn
      chờ lên bản server trước khi ghi cache (completed thắng — cùng luật server). E2E: offline →
      hoàn thành bài → reload (vẫn offline) → bài vẫn ✓ → online → 1 POST batch → server có bài. —
      `programmingProgress.test.ts` + `e2e/sync-offline.spec.ts`.
- [ ] **AC-16 Evidence S11 đi qua cùng outbox.** Mục kind `'evidence'` gói payload
      `CompletionEvidence` (theo spec S11) gửi `POST /api/learning/evidence` với cùng cơ chế retry/
      backoff/401; idempotency của evidence do S11 định nghĩa (S09 không thêm khoá thứ hai — tránh
      hai cơ chế dedupe cho một bản ghi). Nếu S11 chưa merge khi S09-2 lên, kind này có test hợp
      đồng nhưng không có caller (ghi rõ trong changelog). — `syncOutbox.test.ts`.
- [ ] **AC-17 `offlineStore.ts` cũ được thay, không còn hàng đợi "giả".** `enqueueOfflineAction`
      hiện có **0** caller ngoài file, khoá `donghanh_offline_queue` KHÔNG theo chủ sở hữu, và
      `OfflineSyncIndicator.tsx:27` flush bằng `async () => true` — nghĩa là xoá mục mà không gửi
      gì (phát hiện F5). S09-2 chuyển indicator sang đọc `syncOutbox`, xoá `offlineStore.ts` +
      test của nó; `grep -rn "donghanh_offline_queue" apps/dhcb/src` = 0. — `npm run codemap --
orphans` không còn liệt kê nó.

### S09-3 — xung đột không tự gộp được

- [ ] **AC-18 `ConflictRecord` được tạo khi hai bản nháp khác nhau cho cùng bài.** Với tài liệu
      "phiên/nháp" S08 có trường tự do (mã nguồn bài Lập trình, bài viết Writing): server thấy
      `baseVersion` lệch **và** nội dung trường tự do khác nhau ở cả hai phía so với bản gốc →
      KHÔNG chọn hộ; lưu `public.sync_conflicts` (`ConflictRecord` §③.5) giữ CẢ HAI, trả
      `conflict: true, conflicts: [id]`. Trường union/timestamp (mọi trường hiện có của
      `/api/progress`) KHÔNG BAO GIỜ sinh `ConflictRecord` (test canh: 100 cặp ngẫu nhiên → 0
      record). — `syncConflict.test.ts` (server) — phụ thuộc S08 đẩy nháp lên server (§7 Q5).
- [ ] **AC-19 UI hỏi người học khi mở bài, không hỏi lúc đang học.** Mở bài có `ConflictRecord`
      chưa giải quyết → hộp thoại (`Modal`, 6 hành vi APG) hiện hai bản "Trên máy này (hh:mm,
      thiết bị)" / "Từ thiết bị khác (hh:mm)" + nút "Giữ bản này" cho từng bản; chọn xong →
      `POST /api/learning/conflicts/:id/resolve { keep: 'local' | 'remote' }` → record `resolved_at`
      có giá trị, bản không chọn vẫn tra được 7 ngày. Không có record → không có hộp thoại (0 DOM).
      — `ConflictDialog.test.tsx` + `e2e/a11y-modals.spec.ts` thêm ca.
- [ ] **AC-20 Nhìn bằng mắt + a11y.** Ảnh 1440/390 của: indicator "N mục chờ đồng bộ", trạng thái
      "đăng nhập lại để đồng bộ", hộp thoại xung đột (2 bản dài ≥ 40 dòng, cuộn trong hộp); 5
      theme; `a11y.spec.ts` + `a11y-aaa.spec.ts` 0 vi phạm.

**Ánh xạ 6 ca bắt buộc (spec nền §④ D):** offline khi gửi → AC-8/15 · server lưu rồi timeout →
AC-3/11 · hai tab → AC-4/12 · thiết bị cũ gửi muộn → AC-2/14 · hết auth → AC-13 · đổi version bài
→ §③.6 (`contentVersion` trong evidence/nháp, không trong tiến độ tổng) + AC-18.

**Lệnh chứng minh (mỗi PR con, trên checkout sạch):**

```bash
rm -rf packages/*/dist dist dist-server
npm ci
npm run typecheck && npm run lint && npm run format && npm run build && npm run test:coverage
npx vitest run apps/server/src/api/core/progress.test.ts \
  apps/server/src/api/core/progress.concurrency.test.ts \
  apps/server/src/api/_lib/progressMerge.test.ts \
  apps/server/src/api/subjects/programming/progress.test.ts \
  apps/dhcb/src/lib/syncOutbox.test.ts apps/dhcb/src/lib/progressSync.test.ts \
  apps/dhcb/src/lib/programmingProgress.test.ts apps/dhcb/src/lib/guestProgress.test.ts
npm run migrate:pg && npm run migrate:pg   # lũy đẳng: lần 2 phải exit 0
npx playwright test e2e/sync-offline.spec.ts e2e/sync-two-tabs.spec.ts \
  e2e/a11y-modals.spec.ts e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts e2e/authenticated.spec.ts
npm run codemap -- impact apps/dhcb/src/lib/progressSync.ts   # 75 file — soát danh sách
```

## ① Phạm vi

**LÀM (theo PR con):**

**S09-1 — server (có thể merge độc lập, tương thích client cũ):**

1. Migration `0083_sync_version_receipts.sql` (§③.7): cột `version` + `client_updated_at` cho
   `english.learning_progress` và `programming.lesson_progress`; bảng `public.sync_receipts`;
   bảng `public.sync_conflicts` (tạo sẵn, S09-3 mới ghi). Cập nhật `postgres/schema.sql` cùng
   nội dung (đường cài mới — QUY-TRINH-AUDIT Tầng 11) và bảng ở `postgres/migrations/README.md`.
2. `apps/server/src/api/core/progress.ts`: Zod thêm `sync` tuỳ chọn; tra receipt TRƯỚC
   transaction; `version = version + 1` trong câu upsert; `returning version`; response thêm
   `version/conflict/merged/replayed`; ghi receipt TRONG cùng transaction (một commit — không có
   cửa sổ "đã merge nhưng chưa có receipt"); 429 thêm `Retry-After`.
3. `apps/server/src/api/subjects/programming/progress.ts`: batch `items`, `attemptId`, version theo
   dòng, receipt; giữ dạng body cũ.
4. Hàm dùng chung `apps/server/src/api/_lib/syncReceipt.ts` (`findReceipt`, `saveReceipt`) + test;
   job dọn receipt > 7 ngày gắn vào scheduler đã có trong `apps/server/src/server.ts` (cùng khuôn
   `startPlanExpiryScheduler`, dòng 283–300).
5. `packages/core-contracts/sync.ts`: `SyncEnvelopeSchema`, `SyncResultSchema`,
   `ConflictRecordSchema` (§③) + test.

**S09-2 — client:**

6. `apps/dhcb/src/lib/syncOutbox.ts` (+ test): hàng đợi theo `uid`, debounce, gộp, backoff, Web
   Locks, `online`/`visibilitychange`, 401 giữ mục; API `enqueue(uid, kind, payload)`,
   `flush(uid): Promise<FlushResult>`, `pending(uid): number`, `subscribe(cb)`.
7. `progressSync.ts`: `sendProgressSnapshot` → đi qua outbox, đọc localStorage LÚC GỬI (không lúc
   enqueue — giữ đúng tinh thần guard `pullInFlight` hiện có); `doPull` áp `merged`/`version`;
   `pushProgressAsync` = `enqueue` + `flush`. 20 chỗ gọi `pushProgress()` (12 file) KHÔNG đổi chữ
   ký.
8. `programmingProgress.ts`: `saveLessonProgress` → outbox kind `'programming'`; `fetchProgress`
   áp mục chờ lên bản server trước khi ghi cache (AC-15).
9. `useCloudSync.ts`: thêm `visibilitychange` (hôm nay chỉ `online` + 1 giờ; `App.tsx:317` đã dùng
   `visibilitychange` cho app-settings — cùng khuôn); sau `pull` gọi `flush`.
10. `OfflineSyncIndicator.tsx` đọc `syncOutbox`; xoá `offlineStore.ts` (AC-17).
11. E2E `sync-offline.spec.ts`, `sync-two-tabs.spec.ts`; ảnh; changelog `03xx`; `PROGRESS.md`; goal.

**S09-3 — xung đột:**

12. Server: `apps/server/src/api/learning/sync-conflicts.ts` (GET danh sách chưa giải quyết,
    POST resolve) + ghi `ConflictRecord` từ handler nháp của S08 (chỉ khi S08 có endpoint — §7 Q5).
13. Client: `ConflictDialog.tsx` + hook đọc conflict khi mở bài (S08 `LearningSession`).

**KHÔNG LÀM (quan trọng ngang mục trên):**

- KHÔNG đổi luật merge domain: `progressMerge.ts` (4 hàm, 84 dòng) và câu upsert "completed không
  kéo lùi" của programming **diff = rỗng**. S09 chỉ BỌC version/receipt quanh luật đã có. Kể cả
  ca `mergeSrsMap` "hoà reps thì client thắng" (nợ, §7 Q6) — không sửa trong S09.
- KHÔNG CRDT/OT, KHÔNG WebSocket/realtime, KHÔNG service worker background sync (Safari không
  hỗ trợ; `online`/`visibilitychange` đủ cho ca của goal).
- KHÔNG đổi hạn mức (30/phút `/api/progress`, 60/phút programming), KHÔNG đổi
  `grant_daily_bonus_rolling`, `daily_plan_completions`, `computeUnlockedLevels`, gói Free/VIP.
- KHÔNG xoá dữ liệu người dùng: migration chỉ THÊM cột/bảng; rollback không `drop column` dữ liệu
  tiến độ; receipt/conflict dọn theo tuổi, không đụng bảng tiến độ.
- KHÔNG đẩy `LearningSession` (S08) lên server trong S09-1/2 — S08 chốt "cùng thiết bị"; S09-3
  chỉ xử lý xung đột cho tài liệu nào S08 quyết định đẩy lên (Q5).
- KHÔNG đụng `cloud.ts` (`/api/history`: chat/writing/speaking — ghi đè theo bản ghi, không phải
  tiến độ; tách slice nếu cần), `programmingProject.ts` (`/api/programming/project` có
  `updated_at` riêng), `offlineSrsStore.ts` (IndexedDB SRS — giữ, chỉ bỏ lời gọi
  `clearPendingOfflineReviews` sang sau khi outbox xác nhận).
- KHÔNG đổi khoá localStorage hiện có (`et_*`, `srs_*`, `dhcb_prog_progress_*`); khoá MỚI chỉ:
  `dhcb_sync_outbox_<uid>`, `dhcb_sync_version_<uid>` (đăng ký vào ngoại lệ so khớp storage của
  AC-7 spec 02 nếu cổng đó tồn tại khi S09 lên).
- KHÔNG thêm thư viện (UUID dùng `crypto.randomUUID()` — có ở mọi trình duyệt app hỗ trợ; fallback
  `Date.now()+random` khi thiếu, test canh).

## ② Điểm chạm (đã khảo sát thật trên `7c2d81c`)

**Luồng hiện tại (đọc mã thật, không suy đoán):**

- Môn Anh: 20 chỗ gọi `pushProgress(uid)` trong 12 file (`vocab.ts`, `srs.ts:244`, `cefrProgress.ts`
  ×2, `guestProgress.ts`…) → `pushProgressAsync` chờ `pullInFlight` → `sendProgressSnapshot` đọc
  TOÀN BỘ localStorage → `POST /api/progress` **ngay lập tức, không debounce, không retry**; lỗi →
  `console.warn` (`progressSync.ts:249-269`). `pullProgress` (khi mở app, `online`, mỗi 1 giờ —
  `useCloudSync.ts:50-52`) kéo → union/timestamp cục bộ → ghi localStorage → push lại.
- Server `/api/progress` (345 dòng): rate limit 30/phút/IP → `validateAuth` → Zod → đọc plan →
  `withTransaction`: `select … for update` (dòng 229–235) → merge 4 hàm → upsert (dòng 279–314) →
  receipt daily plan → commit → cộng thưởng ngoài transaction (fail-open). **Không có version,
  không có idempotency, không đọc timestamp client** (grep `If-Match|Idempotency-Key|version` trong
  file = 0).
- Môn Lập trình: `saveLessonProgress` ghi cache lạc quan rồi `POST` 1 bài, lỗi mạng nuốt
  (`programmingProgress.ts:66-74`); 5 chỗ gọi trong 4 file. Server upsert per-row, "completed
  không kéo lùi" bằng `case when` (dòng 131–140), 60/phút.
- Idempotency đã có ở nơi KHÁC trong repo (khuôn để tái dùng, không bịa): `personal.action_receipts`
  unique `(person_id, idempotency_key)` (migration `0051:50-51`), `expectedVersion` + `ConflictError`
  trong `packages/core-personal/lifeGraphService.ts:216/268/361/395`, cột `version integer not null
default 1 check (version >= 1)` (`0050_life_foundation.sql:17,35`). `createIdempotencyTracker`
  ở `core-contracts/eventEnvelope.ts:50` **cố ý chỉ trong bộ nhớ** — không dùng cho S09.
- Redis: chỉ `packages/core-auth/security.ts` (rate limit, `enableOfflineQueue: false`, rơi về Map
  khi chưa `ready`) + chat/location/guest. Nợ PROGRESS.md dòng 836–870: rớt 7 lần/ngày < 1 s.
  → **Không đặt idempotency lên Redis** (§7 Q2).

**Phát hiện lỗi/race THẬT trong mã hiện tại (bằng chứng để §④ có ca tương ứng):**

| #   | Phát hiện                                                                                                                                                                                                                                                                           | Ở đâu                                            | Ca AC |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----- |
| F1  | Push thất bại (mạng/5xx/401/429) chỉ `console.warn`, không có hàng đợi; dữ liệu union sống sót nhờ lượt pull sau, nhưng `hard`/`settings`/`weeklyGoal` có thể bị bản server (cũ hơn về ý người dùng) ghi đè khi pull trước push                                                     | `progressSync.ts:249-269`                        | 8, 10 |
| F2  | Timeout sau khi server đã commit → client không biết, gửi lại toàn bộ snapshot; hôm nay vô hại nhờ union + `grant_daily_bonus_rolling` idempotent theo ngày, nhưng receipt `daily_plan_completions` chỉ idempotent nhờ unique index "trong ngày" — không có bằng chứng theo lần gửi | `progress.ts:316-324`, test dòng 463             | 3, 11 |
| F3  | Mỗi `rate()` SRS = 1 POST snapshot đầy đủ; phiên ôn > 30 thẻ/phút → 429 → mất im lặng cho tới lượt pull kế (mảng `srs` toàn bộ gửi lại nên không mất vĩnh viễn, nhưng `daily_plan_completions` có thể trễ)                                                                          | `srs.ts:244`, `progress.ts:142`                  | 7, 9  |
| F4  | Programming offline: hoàn thành bài lúc mất mạng → cache có `completed` → lần mở sau `fetchProgress` **ghi đè cache bằng bản server** (chưa có bài) → mất, không bao giờ gửi lại                                                                                                    | `programmingProgress.ts:40,72-74`                | 15    |
| F5  | `offlineStore.ts` là hàng đợi "giả": `enqueueOfflineAction` 0 caller, khoá không theo chủ, indicator flush `async () => true` (xoá không gửi)                                                                                                                                       | `offlineStore.ts`, `OfflineSyncIndicator.tsx:27` | 17    |
| F6  | `hard` ghi đè theo THỨ TỰ ĐẾN của request, không theo thời gian sửa → thiết bị cũ gửi muộn thắng thiết bị mới (luật đã chốt 2026-08-13, S09 không đổi — ghi nợ)                                                                                                                     | `progress.ts:241`                                | Q6    |
| F7  | `mergeSrsMap`: `bReps >= aReps` → hoà reps thì client thắng dù bản client cũ hơn (`due` có thể lùi về quá khứ)                                                                                                                                                                      | `progressMerge.ts:34`                            | Q6    |
| F8  | So sánh timestamp `lastAt`/`updatedAt` bằng chuỗi ISO do CLIENT sinh → lệch đồng hồ giữa thiết bị quyết định bên thắng (`mergeByTimestamp`, client `progressSync.ts:136,165,382`)                                                                                                   | —                                                | §③.6  |
| F9  | Hai tab: `pullInFlight` chỉ sống trong một JS context; hai tab cùng push snapshot khác nhau — union cứu tiến độ, không cứu `hard`/`settings`                                                                                                                                        | `progressSync.ts:276`                            | 12    |

| PR  | Việc | Đường dẫn file                                                                     | Ghi chú khảo sát                                                                                                                                             |
| --- | ---- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Thêm | `postgres/migrations/0083_sync_version_receipts.sql`                               | Số kế tiếp sau `0080_founder_lifetime_vip.sql` (đếm `ls postgres/migrations \| tail`). Khuôn `0077` (`if not exists` + `create or replace view` + ROLLBACK). |
| 1   | Sửa  | `postgres/schema.sql`                                                              | Bảng `english.learning_progress` dòng 150–163 thêm 2 cột; thêm 2 bảng mới; `programming.lesson_progress` (migration 0064:26-34).                             |
| 1   | Sửa  | `postgres/migrations/README.md`                                                    | Thêm dòng `0083` (S05 lấy `0081`, S11 lấy `0082`).                                                                                                           |
| 1   | Sửa  | `apps/server/src/api/core/progress.ts` (+ `progress.test.ts` 30 ca)                | Zod `sync`, receipt, `version`, `Retry-After`. Codemap impact: **3 file** (`routes.ts`, test, `server.ts`).                                                  |
| 1   | Thêm | `apps/server/src/api/core/progress.concurrency.test.ts`                            | Postgres thật, `describe.skipIf` khi thiếu `DATABASE_URL`.                                                                                                   |
| 1   | Sửa  | `apps/server/src/api/subjects/programming/progress.ts` (+ test 8 ca)               | Batch + receipt + version. Impact **3 file**.                                                                                                                |
| 1   | Thêm | `apps/server/src/api/_lib/syncReceipt.ts` (+ test)                                 | Cạnh `progressMerge.ts` (impact 5 file — KHÔNG sửa).                                                                                                         |
| 1   | Thêm | `packages/core-contracts/sync.ts` (+ test)                                         | Zod đã có trong gói; cạnh `eventEnvelope.ts`/`automation.ts`.                                                                                                |
| 1   | Sửa  | `apps/server/src/server.ts`                                                        | Thêm `startSyncReceiptCleanup()` cùng khuôn dòng 283–300.                                                                                                    |
| 2   | Thêm | `apps/dhcb/src/lib/syncOutbox.ts` (+ test)                                         | Thuần TS, không React; import `@core/authHeader`, `@core/guestId`.                                                                                           |
| 2   | Sửa  | `apps/dhcb/src/lib/progressSync.ts` (418 dòng, + test 33 ca)                       | Impact **75 file** (`vocab.ts`, `guestProgress.ts`, `useCloudSync.ts` trực tiếp) — chữ ký `pushProgress`/`pushProgressAsync`/`pullProgress` GIỮ NGUYÊN.      |
| 2   | Sửa  | `apps/dhcb/src/lib/programmingProgress.ts` (79 dòng, + test)                       | Impact **19 file** (`guestProgress.ts`, `programmingLevelLock.ts`, `programmingNextLesson.ts`…) — chữ ký giữ nguyên.                                         |
| 2   | Sửa  | `apps/dhcb/src/lib/useCloudSync.ts` (62 dòng, + test)                              | Impact **11 file** (Home, History, Dashboard…). Chỉ thêm listener, giá trị trả về không đổi.                                                                 |
| 2   | Sửa  | `apps/dhcb/src/components/OfflineSyncIndicator.tsx`                                | Dùng ở `App.tsx`. Đọc `syncOutbox.pending/subscribe`.                                                                                                        |
| 2   | Xoá  | `apps/dhcb/src/lib/offlineStore.ts` (+ test nếu có)                                | AC-17.                                                                                                                                                       |
| 2   | Sửa  | `apps/dhcb/src/lib/guestProgress.ts` (+ test)                                      | `mergeGuestProgressInto` dòng 189–193 gửi từng bài → 1 batch qua outbox; `pushProgressAsync` cuối hàm giữ.                                                   |
| 2   | Thêm | `e2e/sync-offline.spec.ts`, `e2e/sync-two-tabs.spec.ts`                            | Dùng `mockLogin` (`e2e/helpers/auth.ts:28`) + `page.route` cho `/api/progress`.                                                                              |
| 3   | Thêm | `apps/server/src/api/learning/sync-conflicts.ts` (+ test), route trong `routes.ts` | `app.all('/api/learning/sync-conflicts', wrapEdge(...))`.                                                                                                    |
| 3   | Thêm | `apps/dhcb/src/components/ConflictDialog.tsx` (+ test)                             | `Modal` (20 nơi dùng, không đổi), `useDialogBehavior`.                                                                                                       |
| 3   | Sửa  | `e2e/a11y-modals.spec.ts`, `e2e/a11y.spec.ts`, `e2e/a11y-aaa.spec.ts`              | Thêm hộp thoại xung đột.                                                                                                                                     |

**Ảnh hưởng lan ra (đo `npm run codemap -- impact`, 2026-09-15 trên `7c2d81c`):**

- `progressSync.ts` → **75 file**: giữ nguyên 3 export public; mọi thay đổi nằm trong
  `sendProgressSnapshot`/`doPull`. Cổng: 33 test cũ xanh không sửa, trừ ca đếm `fetch` ngay lập
  tức (giờ qua debounce → dùng fake timers `vi.advanceTimersByTime(1500)`).
- `programmingProgress.ts` → **19 file**; `useCloudSync.ts` → **11 file**; server handlers → 3 file
  mỗi cái (chỉ `routes.ts` + test + `server.ts`).
- `progressMerge.ts` → 5 file — **không sửa**.

## ③ Hợp đồng

### 3.1 Phong bì đồng bộ (`packages/core-contracts/sync.ts`)

```ts
export const SyncEnvelopeSchema = z.object({
  attemptId: z.string().min(8).max(64), // UUID v4 từ crypto.randomUUID(); đổi khi payload đổi
  baseVersion: z.number().int().min(0), // 0 = client chưa từng thấy version (lần đầu/xoá cache)
  clientUpdatedAt: z.string().datetime(), // ISO UTC lúc thay đổi cuối cùng ở client — chỉ để ghi
  //   `client_updated_at` phục vụ chẩn đoán + ConflictRecord; KHÔNG dùng để quyết định merge
  //   (F8: đồng hồ client không tin được; luật merge vẫn là luật domain hiện có)
})
export type SyncEnvelope = z.infer<typeof SyncEnvelopeSchema>

export const SyncResultSchema = z.object({
  ok: z.literal(true),
  version: z.number().int().min(1), // version MỚI của server sau request này
  conflict: z.boolean(), // true khi baseVersion != version server trước merge
  replayed: z.boolean(), // true khi trả lại từ sync_receipts
  conflicts: z.array(z.string()).optional(), // id ConflictRecord (S09-3), chỉ khi không tự gộp được
})
```

**Vì sao KHÔNG cần CRDT/OT:** mọi trường tiến độ hiện có đều đã là **bán dàn (semilattice)**
theo luật domain đã chốt 2026-08-13 — union (learned, cefrGrammar, cefrDialogues, achievements,
streakFreezeDates), max/OR (cefrExams), "reps cao hơn" (srs), timestamp mới hơn (placement,
weeklyGoal, settings), "completed không kéo lùi" (programming). Gộp hai bản theo bất kỳ thứ tự
nào cho cùng kết quả → chỉ cần **row lock + version để biết "có ai ghi chen vào không"**, không
cần vector clock. Thứ duy nhất KHÔNG phải bán dàn là văn bản tự do (nháp mã, bài viết) — với nó ta
không gộp mà giữ cả hai (`ConflictRecord`, §③.5). CRDT văn bản (Yjs…) là thư viện mới, kéo theo
đồng bộ realtime — ngoài phạm vi goal.

### 3.2 `POST /api/progress` (mở rộng tương thích ngược)

```ts
// Vào — body cũ + trường mới tuỳ chọn:
type ProgressBody = ProgressSchema /* hiện có, 11 trường */ & { sync?: SyncEnvelope }
// Ra:
type ProgressResult = SyncResult & {
  cefrUnlocked: string[] // như hôm nay
  merged?: ProgressDoc // CHỈ khi conflict === true: 11 trường camelCase như GET, để client thay bản cục bộ
}
// GET /api/progress: thêm `version: number` (1 khi dòng cũ chưa từng POST sau migration)
```

Luồng server (thứ tự BẮT BUỘC):

1. rate limit (như cũ) → `validateAuth` → Zod.
2. Nếu có `sync.attemptId`: `select response from public.sync_receipts where user_id=$1 and
attempt_id=$2` → có → trả `response` với `replayed: true`, **dừng** (không transaction, không
   thưởng).
3. `withTransaction`: `select … , version … for update` → `conflict = sync ? sync.baseVersion !==
existing.version : false` → merge 4 hàm (không đổi) → upsert với `version = coalesce(existing.version,0)+1`,
   `client_updated_at = $sync.clientUpdatedAt` → receipt daily plan (như cũ) → **insert
   `sync_receipts` cùng transaction** (response JSON gồm `version/conflict/cefrUnlocked`, KHÔNG
   gồm `merged` để receipt nhỏ) → commit.
4. Cộng thưởng ngoài transaction (như cũ). Trả response; nếu `conflict` thì gắn `merged` từ bản
   vừa ghi (đã có trong bộ nhớ, không query lại).

### 3.3 `POST /api/programming/progress` (batch)

```ts
type ProgrammingBody =
  | { lessonId: string; status: 'in_progress' | 'completed' } // cũ, giữ
  | {
      attemptId: string
      items: Array<{
        lessonId: string
        status: 'in_progress' | 'completed'
        clientUpdatedAt: string
      }> // 1..50
    }
type ProgrammingResult = {
  ok: true
  replayed: boolean
  lessons: Array<{ lessonId: string; status: string; completedAt: number | null; version: number }>
}
```

Mỗi `lessonId` kiểm y như hôm nay (regex + tồn tại thật); một mục sai → **cả batch 400** (client
không gửi mục lạ; đơn giản hơn partial success). Upsert từng dòng trong MỘT transaction, câu
`case when … 'completed'` giữ nguyên, thêm `version = programming.lesson_progress.version + 1`.

### 3.4 Outbox client (`apps/dhcb/src/lib/syncOutbox.ts`)

```ts
type OutboxKind = 'english' | 'programming' | 'evidence'
interface OutboxEntry {
  attemptId: string
  kind: OutboxKind
  uid: string
  payload: unknown // programming: items[]; evidence: CompletionEvidence (S11); english: null — đọc localStorage LÚC GỬI
  payloadHash: string // để biết payload đổi → attemptId mới (AC-11)
  createdAt: string // ISO
  tries: number
  nextAt: number // epoch ms; 0 = gửi ngay
  lastError?: 'network' | 'http_5xx' | 'http_401' | 'http_429' | 'timeout'
}
// localStorage `dhcb_sync_outbox_<uid>` = OutboxEntry[]  (≤ 200 mục; vượt → gộp programming/evidence theo lessonId, english luôn 1 mục)
// localStorage `dhcb_sync_version_<uid>` = number  (baseVersion gửi kèm; 0 khi chưa có)

enqueue(uid, kind, payload): void      // guest → no-op; english: đặt cờ "dirty" (1 mục duy nhất, attemptId mới nếu chưa có)
flush(uid): Promise<{ sent: number; remaining: number; blocked?: 'auth' | 'offline' }>
pending(uid): number
subscribe(cb: (uid: string) => void): () => void  // cho OfflineSyncIndicator
```

**Luật gửi:**

- Debounce 1 500 ms sau `enqueue`; `flush()` gọi tay bỏ qua debounce (`pushProgressAsync` cần).
- Giữ khoá `navigator.locks.request('dhcb-sync-' + uid, { ifAvailable: true }, …)`: không lấy
  được → tab khác đang gửi → thoát, chờ sự kiện `storage` (khoá outbox thay đổi) rồi thử lại.
  Không có Web Locks → gửi thẳng (server merge; AC-12 nhánh fallback).
- `english`: đọc localStorage lúc gửi (giữ guard `pullInFlight`), `baseVersion` =
  `dhcb_sync_version_<uid>`; thành công → ghi `version` mới; `conflict` → áp `merged` xuống
  localStorage bằng đúng đường `doPull` (tái dùng, không viết merge thứ hai ở client) rồi
  `setVersion` của `useCloudSync` qua callback đã đăng ký.
- Backoff: `nextAt = now + min(2^tries, 32) * 1000` (tries 1..6); 429 → `Retry-After` giây (mặc
  định 60); sau 6 lần → dừng tự động, chờ `online`/`visibilitychange`/`flush()` tay.
- Gửi lại **cùng attemptId** khi `payloadHash` không đổi; đổi → mục mới.
- 401 → `blocked: 'auth'`, không xoá; `authHeader` có token mới (đăng nhập lại cùng uid) → flush.
- Kích hoạt: `enqueue` (debounce), `window 'online'`, `document 'visibilitychange' → visible`,
  `useCloudSync` sau pull, `storage` event trên khoá outbox của uid hiện tại.

### 3.5 `ConflictRecord` (S09-3, bảng `public.sync_conflicts`)

```ts
export const ConflictRecordSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  docKind: z.enum(['session_draft']), // S08 quyết định tên tài liệu nháp; mở rộng sau
  docId: z.string().max(200), // ví dụ `programming:p1-u1-l1` — khoá do S08 định nghĩa
  field: z.string().max(100), // 'code' | 'text'
  base: z.string().nullable(), // bản gốc chung (theo baseVersion), null nếu không còn
  local: z.object({ content: z.string(), clientUpdatedAt: z.string(), version: z.number() }),
  remote: z.object({ content: z.string(), clientUpdatedAt: z.string(), version: z.number() }),
  contentVersion: z.string().optional(), // version BÀI HỌC (§③.6) lúc tạo nháp — hiện khi khác nhau
  createdAt: z.string(),
  resolvedAt: z.string().nullable(),
  keep: z.enum(['local', 'remote']).nullable(),
})
```

Sinh khi và chỉ khi: `baseVersion` lệch **và** `local.content !== base` **và** `remote.content
!== base` **và** `local.content !== remote.content`. Một bên bằng `base` → bên kia thắng, không
hỏi. Giới hạn 20 record chưa giải quyết/user (vượt → giữ mới nhất, log). Resolve: `keep` +
`resolved_at`; bản thua vẫn nằm trong record 7 ngày (job dọn cùng receipt).

### 3.6 "Đổi version bài" và đồng hồ

- Nội dung bài (registry Lập trình, `cefr.json`, STEM) có thể đổi giữa hai lần đồng bộ. Tiến độ
  tổng (`/api/progress`, `lesson_progress`) KHÔNG mang version bài — id bài ổn định là hợp đồng
  đã chốt (CLAUDE.md §7 URL mang mã). Chỉ **evidence (S11)** và **nháp (S08)** mang
  `contentVersion` (hash/nhãn của nội dung lúc làm) — S09 chỉ chuyển tiếp trường này, không
  kiểm tra; UI S08 hiện "bài đã cập nhật sau khi bạn lưu nháp" khi khác.
- Mọi mốc thời gian server dùng `now()` UTC; `clientUpdatedAt` chỉ để hiển thị/chẩn đoán. Luật
  `mergeByTimestamp` vẫn so chuỗi ISO client (F8) — không đổi trong S09 (Q6).

### 3.7 Migration `0083_sync_version_receipts.sql` (lũy đẳng, chạy 2 lần)

```sql
-- version đơn điệu + mốc client cho tài liệu tiến độ môn Anh (1 dòng/user)
alter table english.learning_progress
  add column if not exists version integer not null default 1 check (version >= 1),
  add column if not exists client_updated_at timestamptz;
create or replace view public.learning_progress as select * from english.learning_progress;

-- version theo dòng cho tiến độ bài Lập trình
alter table programming.lesson_progress
  add column if not exists version integer not null default 1 check (version >= 1),
  add column if not exists client_updated_at timestamptz;

-- biên nhận idempotency theo lần gửi (khuôn personal.action_receipts, migration 0051)
create table if not exists public.sync_receipts (
  user_id    uuid not null references public.users(id) on delete cascade,
  attempt_id text not null check (char_length(attempt_id) between 8 and 64),
  endpoint   text not null check (endpoint in ('progress', 'programming-progress')),
  response   jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, attempt_id)
);
create index if not exists idx_sync_receipts_created_at on public.sync_receipts (created_at);

-- xung đột không tự gộp được (S09-3 mới ghi; tạo sẵn để một migration cho cả slice)
create table if not exists public.sync_conflicts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  doc_kind        text not null,
  doc_id          text not null check (char_length(doc_id) <= 200),
  field           text not null check (char_length(field) <= 100),
  base            text,
  local_doc       jsonb not null,
  remote_doc      jsonb not null,
  content_version text,
  created_at      timestamptz not null default now(),
  resolved_at     timestamptz,
  keep            text check (keep in ('local', 'remote'))
);
create index if not exists idx_sync_conflicts_user_open
  on public.sync_conflicts (user_id) where resolved_at is null;

-- ROLLBACK (chạy tay): mã cũ KHÔNG đọc cột mới nên deploy lại mã cũ là đủ; cột/bảng để lại vô hại.
-- Muốn xoá hẳn:
--   drop table if exists public.sync_conflicts; drop table if exists public.sync_receipts;
--   alter table programming.lesson_progress drop column if exists version, drop column if exists client_updated_at;
--   drop view if exists public.learning_progress;
--   alter table english.learning_progress drop column if exists version, drop column if exists client_updated_at;
--   create view public.learning_progress as select * from english.learning_progress;
```

Backfill: `default 1` áp cho mọi dòng hiện có ngay trong `add column` (Postgres ≥ 11 không rewrite
bảng); không cần `update`. `gen_random_uuid()` có sẵn từ PG13 (kiểm `select version()` trên VPS;
nếu < 13 dùng `pgcrypto` đã bật? — ghi kết quả vào PR).

### 3.8 Ca lỗi (là hợp đồng)

| Tình huống                                                            | Mã/hành vi server                                          | Hành vi client                                                                                  |
| --------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Offline lúc gửi (`fetch` reject / `navigator.onLine=false`)           | —                                                          | Không gọi; mục nằm outbox; gửi khi `online`/visible; indicator "N mục chờ"                      |
| Server commit rồi kết nối đứt (timeout)                               | Receipt đã ghi cùng transaction                            | Gửi lại cùng `attemptId` → `replayed: true` → xoá mục, ghi version                              |
| Hai tab cùng chủ                                                      | Row lock + version; một trong hai `conflict: true`         | Web Locks: một tab gửi; tab kia chờ `storage`; fallback: cả hai gửi, cả hai áp `merged`         |
| Thiết bị cũ (baseVersion cũ, dữ liệu thiếu)                           | Merge domain (union…) → `conflict: true, merged`           | Thay local bằng `merged` (chỉ tăng); không hiện gì ngoài dấu "đã đồng bộ"                       |
| Hết auth (401)                                                        | 401 như hôm nay                                            | Giữ outbox; indicator "đăng nhập lại để đồng bộ"; login cùng uid → flush; uid khác → không      |
| Đổi version bài                                                       | Chuyển tiếp `contentVersion` (evidence/nháp)               | S08 hiện cảnh báo; tiến độ tổng không ảnh hưởng                                                 |
| Payload rỗng/sai Zod (400), bài không tồn tại (400), quá 50 mục (400) | 400 như hôm nay                                            | Xoá mục, `console.warn` kèm `attemptId` — không retry                                           |
| 429                                                                   | `Retry-After: 60`                                          | Lùi đúng số giây, không tăng `tries`                                                            |
| 5xx / DB lỗi trong transaction                                        | `internalErrorResponse`, rollback cả upsert lẫn receipt    | Backoff; gửi lại cùng `attemptId` (receipt chưa có → xử lý bình thường)                         |
| `attemptId` trùng, `user_id` khác                                     | Không phải replay (PK gồm user)                            | —                                                                                               |
| Receipt tồn tại nhưng `endpoint` khác                                 | Trả 409 `{ error: 'attemptId đã dùng cho endpoint khác' }` | Coi như 4xx: xoá mục, sinh `attemptId` mới cho payload đó (ca hiếm — chỉ do bug client)         |
| Web Locks không có / ném                                              | —                                                          | Gửi thẳng (fallback); test canh không throw                                                     |
| `localStorage` đầy khi ghi outbox                                     | —                                                          | Gửi ngay không qua outbox (best-effort như hôm nay) + `console.warn`; không mất tệ hơn hiện tại |
| `crypto.randomUUID` thiếu                                             | —                                                          | Fallback `${Date.now().toString(36)}-${random}` ≥ 8 ký tự                                       |
| Người dùng đăng xuất khi outbox còn mục                               | —                                                          | KHÔNG xoá (AC-13); không gửi bằng token người khác                                              |
| `merged` từ server thiếu trường (server cũ chưa deploy S09-1)         | Không có `version` trong response                          | Client coi là "không hỗ trợ version": vẫn xoá mục khi 200, không ghi version (tương thích)      |

## ⑤ Bất biến không được phá

| Bất biến                                                                            | Test canh                                                                                                                                    |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiến độ chỉ tăng (union/max/reps/completed) — không kéo lùi dù thiết bị cũ gửi muộn | `progressMerge.test.ts` (11 ca, diff rỗng), `progress.test.ts` dòng 284–398, `programming/progress.test.ts` "completed không kéo lùi", AC-14 |
| Gửi trùng không ghi hai lần, không thưởng hai lần, không receipt daily plan hai lần | AC-3, AC-5, AC-11                                                                                                                            |
| Hai request đồng thời không mất dữ liệu; version không trùng                        | AC-4 (`progress.concurrency.test.ts`); grep `for update` trong `progress.ts` ≠ 0                                                             |
| Rate limit 30/60 phút giữ nguyên; replay vẫn bị đếm                                 | AC-7; `progress.test.ts` ca 429 hiện có                                                                                                      |
| `cefrUnlocked` do server tính, không nhận từ client                                 | `progress.test.ts` dòng 195–282 (6 ca TIÊU CHÍ) — không đổi                                                                                  |
| Khách vãng lai không gọi API tiến độ; merge guest không ghi đè tài khoản            | `guestProgress.test.ts`, `progressSync.test.ts` "userId rỗng/guest → không fetch"                                                            |
| `pushProgressAsync` resolve SAU khi server nhận (CefrExam claim)                    | `progressSync.test.ts` dòng 84 (chờ pull) + ca mới "flush chờ response"                                                                      |
| Không gửi outbox của chủ khác; đăng xuất không xoá outbox                           | AC-13                                                                                                                                        |
| Migration chạy 2 lần exit 0; `schema.sql` cài mới ra cùng schema                    | AC-6; QUY-TRINH-AUDIT Tầng 11                                                                                                                |
| 20 chỗ gọi `pushProgress()` và 5 chỗ `saveLessonProgress()` không đổi chữ ký        | `npm run typecheck`; `npm run codemap -- impact` 75/19 file — soát tay danh sách                                                             |
| Modal 6 hành vi APG; a11y AA + AAA 5 theme                                          | `useDialogBehavior.test.tsx`, `a11y-modals.spec.ts`, `a11y.spec.ts`, `a11y-aaa.spec.ts`                                                      |
| Coverage 97/93/96/97 và bundle không tụt                                            | `npm run test:coverage`, `npm run budget`                                                                                                    |

## ⑥ Quy ước dự án liên quan (bên thi hành không thấy hội thoại)

- Mọi handler tự `validateAuth()` trước khi query; `user_id` luôn từ token, không từ body.
  `attemptId` chỉ có nghĩa trong phạm vi `(user_id, attempt_id)`.
- Async race/idempotency (CLAUDE.md §4.9): mọi nhánh mới có ≥ 1 test ca biên; thời gian UTC
  (`now()` server); không tin đồng hồ client.
- Redis chỉ cho rate limit/cache (`enableOfflineQueue: false`, rớt 7 lần/ngày) — không đặt
  idempotency/version lên Redis.
- Migration: `NNNN_mo-ta.sql`, lũy đẳng, có ROLLBACK trong comment, cập nhật `schema.sql` +
  `README.md`; tự áp khi deploy (`scripts/deploy.sh` → `npm run migrate:pg`). **Thứ tự deploy:**
  migration chạy trước mã trong cùng deploy (như 0077) — mã S09-1 chịu được cột đã có.
- Import xuyên gói `@dhcb/<gói>/<file>` không đuôi `.js`; nội bộ gói `.js`; `packages/` không
  import `apps/`.
- Khoá localStorage mới có tiền tố `dhcb_sync_`; không đổi khoá cũ; try/catch mọi truy cập.
- Chữ nội dung AAA, nút AA, token `--a-*`; indicator có chữ, không chỉ màu; ảnh 1440/390 (Tầng
  8b) dán PR.
- PR: `feat(learning): …` với mô tả dẫn file này + "Approved for implementation", đủ 6 tiêu đề
  cổng `metadata`, READY, auto-merge (squash) ngay; `rm -rf packages/*/dist dist dist-server`
  trước lần chạy cổng cuối; cổng test CI là `test:coverage`.
- Changelog `docs/changelog/03xx-*.md` (số kế tiếp sau `0325`), `PROGRESS.md` sửa tại chỗ, goal
  bảng S09.

## 7. Quyết định cần chủ dự án chốt trước khi Approved

> **CHỐT 2026-09-15 — chủ dự án:** lấy TOÀN BỘ cột "Đề xuất của AI (mặc định)"
> làm quyết định cuối cho mọi câu hỏi trong bảng dưới. Không có ý kiến khác.

| #   | Câu hỏi                                                                                                                                            | Đề xuất của AI (mặc định nếu không có ý kiến khác)                                                                                                                                                                                                                                                                                                   | Lý do                                                                                                                                                                                                                                                                 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Mô hình version: số nguyên đơn điệu theo TÀI LIỆU (1 dòng/user cho môn Anh, 1 dòng/bài cho Lập trình) hay theo từng trường?                        | **Theo tài liệu/dòng, số nguyên `version` server tăng 1 mỗi lần ghi.** Không vector clock, không CRDT (§③.1).                                                                                                                                                                                                                                        | Mọi trường đã là bán dàn theo luật domain; version chỉ để biết "có chen ngang" và để client biết bản mình cũ. Theo trường = 11 số cho một dòng, không mua thêm tính đúng.                                                                                             |
| Q2  | Idempotency lưu ở đâu: Redis TTL 24 h (nhanh) hay Postgres `sync_receipts` (bền)?                                                                  | **Postgres, ghi CÙNG transaction với upsert.** Không Redis, không hai tầng.                                                                                                                                                                                                                                                                          | Redis đang rớt 7 lần/ngày (PROGRESS.md:836) và `enableOfflineQueue: false` → receipt "biến mất" đúng lúc cần; ghi cùng transaction thì không có cửa sổ "đã ghi tiến độ mà chưa có receipt" (F2). Chi phí: 1 insert/POST, dọn 7 ngày bằng job.                         |
| Q3  | Khoá idempotency: header `Idempotency-Key` (chuẩn IETF draft) hay trường body `sync.attemptId`?                                                    | **Body `sync.attemptId` (UUID).**                                                                                                                                                                                                                                                                                                                    | Body đi qua Zod `validateBody` như mọi trường khác; header tuỳ biến kéo theo preflight CORS + `getCorsHeaders` phải liệt kê; `automation.ts:56` và `eventEnvelope.ts:27` trong repo đã dùng khoá trong body — nhất quán.                                              |
| Q4  | Hai tab: bầu "tab leader" bằng `BroadcastChannel` + heartbeat, hay `navigator.locks` (Web Locks), hay để mỗi tab tự gửi?                           | **Web Locks `ifAvailable`, fallback mỗi tab tự gửi.**                                                                                                                                                                                                                                                                                                | Web Locks tự nhả khi tab đóng/treo (không cần heartbeat, không có "leader chết"); hỗ trợ Chrome 69+/Firefox 96+/Safari 15.4+. Fallback vẫn đúng nhờ server merge — chỉ tốn request. BroadcastChannel election là ~80 dòng mã tự viết cho việc trình duyệt đã làm sẵn. |
| Q5  | S09-3 (`ConflictRecord`) chỉ có nghĩa khi S08 đẩy nháp lên server. S08 hiện chốt "cùng thiết bị". Làm S09-3 ngay hay chờ S08 mở rộng cross-device? | **S09-1 tạo sẵn bảng + contract; S09-3 CHỜ S08 có endpoint nháp** (hoặc gộp vào slice S08-2 nếu S08 quyết đẩy nháp lên). **[2026-09-21] Chủ dự án đã chốt: MỞ RỘNG** — xem slice mới S08-5 ghi ở `docs/specs/2026-09-15-learning-ux-s08-khung-phien-resume.md` §0. S09-3 vẫn CHỜ, nhưng nay chờ đặc tả S08-5 được Approved, không còn là câu hỏi mở. | Không dựng UI hỏi xung đột cho tài liệu chưa tồn tại trên server (vi phạm "không triển khai dở dang"). Tiến độ tổng hiện có KHÔNG BAO GIỜ sinh ConflictRecord (AC-18 test canh) nên S09-1/2 độc lập.                                                                  |
| Q6  | Ba luật merge cũ có lỗi tinh tế (F6 `hard` theo thứ tự đến, F7 hoà reps client thắng, F8 so chuỗi ISO client): sửa trong S09 hay ghi nợ?           | **Ghi nợ, không sửa trong S09** (spec bắt buộc "KHÔNG đổi luật merge domain"). Sau S09 có `client_updated_at` + `version` là đủ dữ liệu để slice riêng sửa F6/F7 theo timestamp server-side.                                                                                                                                                         | Trộn đổi luật với thêm version làm PR không kiểm được (cùng test, hai nguyên nhân). Ba lỗi đều "nhỏ" (nhãn lọc, `due` lùi vài giờ) và đã được người dùng chấp nhận 2026-08-13.                                                                                        |

## 8. Rủi ro và giảm thiểu

| Rủi ro                                                                        | Giảm thiểu                                                                                                                                                               |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Debounce 1,5 s làm `CefrExam` claim gửi trước khi server có kết quả thi       | `pushProgressAsync` = `enqueue` + `flush()` chờ response, test canh (⑤); E2E `session-cap`/quiz hiện có xanh                                                             |
| Client mới gặp server cũ (deploy lệch vài phút) → không có `version`          | Client coi thiếu `version` là "không hỗ trợ", vẫn xoá mục khi 200 (ca lỗi cuối §③.8); server S09-1 lên trước S09-2 (thứ tự §9)                                           |
| `sync_receipts` phình (mỗi review 1 dòng)                                     | Debounce/gộp giảm ~20× số POST; job dọn 7 ngày; index `created_at`; đo `select count(*)` sau 1 tuần, ghi PROGRESS                                                        |
| Migration `add column … default` trên bảng lớn khoá bảng                      | PG ≥ 11: default hằng không rewrite; `learning_progress` 1 dòng/user; chạy trong deploy như 0077                                                                         |
| Web Locks giữ mãi do promise không resolve (bug) → tab khác không bao giờ gửi | Callback lock luôn `finally`; timeout 30 s cho một lượt gửi (`AbortController`); fallback tab khác gửi khi `storage` event mà outbox không giảm sau 60 s                 |
| Áp `merged` xuống localStorage trong lúc người dùng đang học (state React cũ) | Dùng đúng đường `doPull` + `setVersion` `useCloudSync` (đã là cơ chế "đồng bộ xong → tính lại" từ 2026-07-28); union nên UI chỉ thêm, không mất                          |
| 75 file phụ thuộc `progressSync.ts`                                           | Không đổi export; 33 test cũ + fake timers; `codemap impact` soát tay; E2E `authenticated`/`quiz-*`/`session-cap`                                                        |
| Test đồng thời (AC-4) không chạy được trong CI vì thiếu Postgres              | `describe.skipIf(!DATABASE_URL)` + bằng chứng chạy tay dán PR; đề xuất thêm service Postgres vào job `unit` ở slice riêng (đo thời gian trước — luật CI §11.1)           |
| Xoá `offlineStore.ts` gãy nơi khác                                            | Đã đếm: 0 caller `enqueueOfflineAction` ngoài file; chỉ `OfflineSyncIndicator.tsx` dùng `getPendingOfflineActions`/`flushOfflineQueue`; `codemap -- orphans` sau khi xoá |

## 9. Kế hoạch thi hành (3 PR, tuần tự; mỗi PR một subagent, agent chính review)

1. **S09-1 `feat(learning): version don dieu + idempotency cho /api/progress va programming`**
   — migration `0083` (S05 lấy `0081`, S11 lấy `0082`) + `schema.sql` + README; contracts `sync.ts`; `syncReceipt.ts`; 2 handler;
   `concurrency.test.ts`; job dọn receipt. **Tương thích client cũ 100%** (không có `sync` → đường
   cũ). Có thể merge độc lập, trước S08/S11.
   _Rollback:_ revert PR mã; cột/bảng để lại (mã cũ không đọc); nếu cần xoá hẳn: SQL ROLLBACK §③.7.
2. **S09-2 `feat(learning): outbox dong bo tien do — retry, gop, hai tab, het auth`** — `syncOutbox.ts`,
   `progressSync.ts`, `programmingProgress.ts`, `useCloudSync.ts`, indicator, xoá `offlineStore.ts`,
   `guestProgress.ts` batch, 2 E2E, ảnh. Sau S09-1 deploy (client gửi `sync` chỉ có ích khi server
   hiểu; server cũ vẫn bỏ qua khoá lạ nhờ Zod object mặc định strip — an toàn cả khi lệch).
   _Rollback:_ revert PR; outbox còn trong localStorage vô hại (mã cũ không đọc); dữ liệu chưa gửi
   sẽ được lượt `pullProgress` union kế tiếp đẩy lên như hôm nay — không tệ hơn hiện trạng.
3. **S09-3 `feat(learning): ConflictRecord — giu ca hai ban nhap, hoi nguoi hoc khi mo bai`** —
   chỉ khi Q5 chốt và S08 có endpoint nháp. Endpoint conflicts + `ConflictDialog` + a11y + ảnh.
   _Rollback:_ revert PR; bảng `sync_conflicts` để lại; không ai đọc → không hộp thoại.
4. Mỗi PR: changelog `docs/changelog/03xx-*.md`, `PROGRESS.md` (nợ Q6 ghi vào "nợ kỹ thuật"),
   goal bảng S09 (Issue/PR/State/Evidence), đổi trạng thái ở spec này; S11 spec cập nhật dòng
   "evidence gửi qua outbox S09".

## 19. Phê duyệt

- [x] Product outcome và scope (Q1–Q6; đặc biệt Q5 thứ tự với S08 và Q6 ghi nợ)
- [x] UX/accessibility (indicator, trạng thái hết auth, hộp thoại xung đột)
- [x] Architecture (version theo tài liệu, receipt Postgres cùng transaction, outbox + Web Locks)
- [x] Test/rollout/rollback (3 PR, migration 0083 (S05 0081, S11 0082) lũy đẳng, thứ tự server trước client)

**Kết luận:** Approved for implementation  
**Người duyệt:** Chủ dự án  
**Ngày:** 2026-09-15
