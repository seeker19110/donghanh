# Học tập liền mạch — slice S08: Khung phiên học, nháp/resume CÙNG THIẾT BỊ (hợp đồng `LearningSession` + hook + áp vào 3 màn)

> **Ghi chú lỗi thời (2026-09-17):** tham chiếu tới `apps/dhcb/src/lib/dailyLearningPlan.ts` ở
> §"KHÔNG LÀM" đã LỖI THỜI ngay từ ngày viết — Home đã chuyển sang `curriculum.ts` từ PR #929
> (2026-09-15). File mồ côi đã bị XOÁ ở PR dọn dẹp 2026-09-17.

| Thuộc tính    | Giá trị                                                                                                                                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec nền      | [`2026-09-15-learning-ux-foundation.md`](2026-09-15-learning-ux-foundation.md) §④ D (phiên học · resume cần spec riêng), §③ (khuôn `LearningQuestionDraft` đã duyệt), §⑤ (bất biến completion do server)                                                                         |
| Spec kề       | [`2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md`](2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md) — AC-17 của S07 viện dẫn "cơ chế nháp hiện có của `ProgrammingLessonPage`"; khảo sát S08 cho thấy cơ chế đó **chưa tồn tại** (xem §2 phát hiện #1) — S08 chính là nơi tạo ra nó |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md) dòng S08 (dependency S07); thứ tự chủ dự án chốt: S07 → **S08** → S06 → S05 → S10 → S11 → S09 → S12 → S13                                                                                                                    |
| Base khảo sát | `main` `7c2d81c` (#928), khảo sát 2026-09-15 bằng đọc mã thật + `npm run codemap -- impact` cho 10 file, số liệu đếm thật                                                                                                                                                        |
| Trạng thái    | **Approved for implementation** — chủ dự án chốt TOÀN BỘ câu hỏi §7 theo đề xuất mặc định (2026-09-15); S08-1 đã thi hành (changelog `0331`)                                                                                                                                     |
| Người duyệt   | Chủ dự án                                                                                                                                                                                                                                                                        |

> Không bắt đầu code khi trạng thái chưa là **Approved for implementation**. Luật số 1 của khuôn
> `docs/templates/dac-ta-tinh-nang.md`: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.
>
> **Ranh giới với S09 (ghi một lần, áp toàn spec):** S08 chỉ làm resume trên **cùng một trình
> duyệt/thiết bị** bằng `localStorage` + bộ nhớ dự phòng. Mọi thứ liên quan server — đẩy nháp lên
> server, đồng bộ giữa thiết bị, version/retry/xung đột khi gửi, thiết bị cũ gửi muộn, offline
> khi gửi rồi server lưu mà client timeout — là **S09** và KHÔNG có dòng nào của S08 chạm tới
> API. S08 chỉ chuẩn bị cho S09 đúng một thứ: hợp đồng `LearningSession` có `version`,
> `updatedAt`, `contentVersion` để S09 có cái mà so sánh.

## 0. Một câu

Người học đang dở một bài (gõ code ở bước "Tự viết", trả lời câu tự kiểm tra STEM, đang ở tab
"Hôm nay" của cấp A1) mà lỡ reload, đóng tab, bấm nhầm sang bài khác hay hết phiên đăng nhập,
thì mở lại **cùng thiết bị** vẫn quay về đúng bước + đúng nháp — không phải làm lại từ đầu, và
việc "đã hoàn thành hay chưa" **vẫn chỉ do server/domain quyết**, không do nháp trên máy.

## ④ Tiêu chí chấp nhận (đo được — mỗi dòng ghi lệnh/bằng chứng)

Chia 3 PR con (§9): **S08-1** khung phiên + hook, không đổi giao diện · **S08-2** bài Lập trình ·
**S08-3** bài STEM + tab học CEFR. AC ghi rõ thuộc PR nào. File test nêu dưới đây đều là **(mới)**
trừ khi ghi "đang có".

### S08-1 — khung phiên dùng chung (0 thay đổi giao diện, merge độc lập)

- [ ] **AC-1 Hợp đồng có version, validate bằng Zod.** `apps/dhcb/src/lib/learningSession.ts`
      export `LearningSessionSchema` (v1, §③.1), `SessionReadResult` 6 trạng thái
      `ready | empty | expired | invalid | stale | unavailable`, `saveSession`, `readSession`,
      `clearSession`, `listResumableSessions`, `pruneExpiredSessions`, `contentFingerprint`.
      Bản ghi thiếu trường, sai `version`, `ownerId` rỗng, `updatedAt < startedAt`, hoặc
      JSON hỏng → `invalid` (không ném, không xoá ngầm). —
      `npx vitest run apps/dhcb/src/lib/learningSession.test.ts` (≥ 24 ca, liệt kê ở §⑤).
- [ ] **AC-2 Ghi ở `localStorage`, có dò trước khi tin.** Khoá đúng khuôn
      `dhcb_lsession_v1_<ownerKind>:<ownerId>_<subjectId>_<contentId>` (§③.3). Probe ghi/xoá
      như `getSessionStorage()` của `learningQuestionDraft.ts:74-86` (Safari riêng tư cho đọc
      nhưng ném lúc GHI). Storage bị chặn hoặc `QuotaExceededError` → `saveSession` trả
      `{ status: 'memory-only' }` và bản ghi vẫn đọc lại được **trong cùng lượt tải trang** từ
      `Map` bộ nhớ. — `learningSession.test.ts` ca "storage ném lỗi" + "quota".
- [ ] **AC-3 Cách ly theo chủ sở hữu.** `readSession` với `owner` khác (kind hoặc id khác) trả
      `empty` — KHÔNG trả `ready`, KHÔNG lộ là "có nháp của người khác" (đúng luật
      `readDraft` ở `learningQuestionDraft.ts:157-164`). Hai owner cùng `contentId` là hai khoá
      khác nhau, không ghi đè nhau. — `learningSession.test.ts` ca "owner khác → empty",
      "guest vs account cùng bài".
- [ ] **AC-4 TTL.** `SESSION_TTL_MS` (mặc định 7 ngày — §7 Q2) tính từ `updatedAt` (KHÔNG từ
      `startedAt`: đang học đều thì nháp không được hết hạn giữa chừng). Quá hạn → `expired`,
      không tự nạp; `pruneExpiredSessions(now)` xoá mọi khoá `dhcb_lsession_v1_*` quá hạn và
      **không đụng khoá khác** (đếm `localStorage.length` trước/sau chỉ giảm đúng số khoá hết
      hạn). — `learningSession.test.ts` ca "TTL biên" (`updatedAt + TTL` = còn, `+ TTL + 1` =
      hết) + ca "prune chỉ xoá khoá của mình".
- [ ] **AC-5 Nháp quá lớn thì BÁO, không cắt.** `MAX_SESSION_CHARS = 16_000` đo trên chuỗi
      JSON đã serialize. Vượt → `{ status: 'too-large' }`, bản trước đó (nếu có) **giữ nguyên**
      trong storage; không bao giờ `slice` nháp của người học. — `learningSession.test.ts` ca
      "16_000 đúng ngưỡng còn lưu, 16_001 báo too-large, bản cũ còn".
- [ ] **AC-6 Đổi nội dung bài → nháp cũ thành `stale`, không prefill ngầm.** `readSession`
      nhận `contentVersion` hiện tại; khác với bản lưu → `{ status: 'stale', session }` (vẫn
      trả bản ghi để UI mời "khôi phục nháp cũ" cho phần văn bản — §③.4). `contentFingerprint`
      là hàm thuần, tất định, cùng input → cùng output, đổi 1 ký tự → khác. —
      `learningSession.test.ts` ca "fingerprint tất định", "stale trả kèm session".
- [ ] **AC-7 Hai tab cùng bài: last-write-wins theo `updatedAt`, không ping-pong.**
      `useLearningSession` lắng `window` sự kiện `storage` (chỉ bắn ở TAB KHÁC — đúng như
      `AuthProvider.tsx:69-75` đang dựa vào); nhận bản có `updatedAt` mới hơn thì cập nhật
      state, cũ hơn/bằng thì bỏ qua; tab nhận KHÔNG ghi lại (không tạo vòng lặp). Ghi có
      debounce 500 ms và **flush ngay** ở `pagehide` + `visibilitychange` → `hidden`. —
      `apps/dhcb/src/lib/useLearningSession.test.tsx` ca "dispatch StorageEvent mới hơn → đổi",
      "cũ hơn → giữ", "không ghi lại sau khi nhận", "pagehide flush trước 500 ms".
- [ ] **AC-8 Khung phiên KHÔNG chạm completion/tiến độ/hạn mức.** `grep -n
"saveLessonProgress\|pushProgress\|fetch(\|/api/" apps/dhcb/src/lib/learningSession.ts
apps/dhcb/src/lib/useLearningSession.ts` = 0 dòng; module không import
      `programmingProgress`, `progressSync`, `guestProgress`. `useLearningSession` không có
      tham số nào tên `completed`/`status`. — grep trong CI của PR + review diff.
- [ ] **AC-9 Nguồn cho "Học tiếp" (S06) có sẵn nhưng chưa có UI.** `listResumableSessions(owner,
now)` trả mảng `{ subjectId, contentId, courseId?, stepLabel?, updatedAt }` sắp theo
      `updatedAt` giảm dần, bỏ `expired`/`invalid`, **không đọc payload** (không giải mã
      `draft`). S08 không thêm nút/thẻ nào ở Home. — `learningSession.test.ts` ca "3 phiên, 1
      hết hạn, 1 hỏng → trả 1, đúng thứ tự".
- [ ] **AC-10 Khách → tài khoản: nháp đi theo người, đăng xuất không lộ.** Đăng nhập gọi
      `mergeGuestProgressInto` (đang có, `guestProgress.ts:157`) → nháp khoá `guest:<gid>` được
      **dời** sang `account:<uid>` theo luật: tài khoản chưa có nháp cho bài đó thì lấy bản
      khách; đã có thì giữ bản có `updatedAt` mới hơn; xong xoá khoá khách. Đăng xuất → owner
      đổi thành khách MỚI → `readSession` trả `empty` cho mọi bài (không prefill chéo); đăng
      nhập lại đúng tài khoản cùng máy → `ready`. — `guestProgress.test.ts` (đang có, 20 ca)
      thêm 3 ca; `learningSession.test.ts` ca "logout → empty, login lại → ready".

### S08-2 — bài Lập trình (`ProgrammingLessonPage`)

- [ ] **AC-11 Reload giữa chừng về đúng bước + đúng code.** Mở `/lap-trinh/bai-hoc/p1-u4-l1`,
      sang bước "Tự viết", gõ thêm một dòng vào ô code, reload → vẫn ở "Tự viết", ô code có
      đúng dòng vừa gõ; `predictChoice`, `arranged` (Parsons), `hintsShown`, `sampleViewed`
      cũng còn. `results`/`passed` **KHÔNG khôi phục** (phải bấm "Chấm bài" lại — kết quả chấm
      không phải nháp, §③.4); `parsonsResult` được tính lại bằng `checkParsonsOrder` (hàm
      thuần) chứ không lưu. — E2E `e2e/learning-session-resume.spec.ts` ca "Lập trình reload";
      unit `ProgrammingLessonPage.test.tsx` (mới — S07-2 cũng tạo file này; PR nào vào sau thì
      mở rộng, không tạo bản thứ hai).
- [ ] **AC-12 Đổi bài không dính nháp bài cũ; quay lại thì còn.** Đang gõ ở `p1-u4-l1`, bấm sang
      `p1-u4-l2` → ô code là `starterCode` của l2; quay lại l1 → code đã gõ còn. Khoá tách theo
      `contentId` nên `key={lesson.id}` ở dòng 120 vẫn dựng lại thân trang như cũ. — E2E cùng
      file + unit test.
- [ ] **AC-13 Bài đổi nội dung → hỏi trước khi đổ nháp.** Giả lập `contentVersion` khác (unit
      test đổi `lesson.make.starterCode`) → trang hiện hộp "Bài này đã được cập nhật — dùng lại
      code bạn đã gõ?" với 2 nút (Dùng lại / Bắt đầu mới); chưa bấm thì ô code là
      `starterCode` mới, bước về 0. Không tự đổ nháp cũ. — unit test 2 nhánh.
- [ ] **AC-14 Hoàn thành không đổi vì nháp; nháp không đổi vì hoàn thành.** Đạt hết test →
      `saveLessonProgress(..., 'completed')` gọi đúng như hiện nay (dòng 184) và **nháp được
      xoá** (`clearSession`) — vì bài đã xong, resume không còn nghĩa (§7 Q6). Khôi phục nháp
      KHÔNG gọi `saveLessonProgress('completed')`; spy `fetch('/api/programming/progress')`
      với body `completed` = 0 lần khi chỉ reload. — unit test spy + E2E chặn route.
- [ ] **AC-15 Storage bị chặn: vẫn học được, có dòng báo thật.** Playwright `addInitScript` ghi
      đè `Storage.prototype.setItem` ném lỗi → trang vẫn dựng, gõ code bình thường, có dòng
      `role="status"` "Trình duyệt đang chặn lưu nháp — rời trang là mất phần đang gõ" (chữ
      AAA, không chỉ icon); reload → về `starterCode` (đúng như đã báo). — E2E ca "private
      mode".

### S08-3 — bài STEM + tab học CEFR

- [ ] **AC-16 STEM: đáp án tự kiểm tra sống qua reload, kết quả chấm tính lại.** Mở
      `/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do`, trả lời câu 1 (trắc nghiệm) và
      gõ câu 2 (tự luận) rồi reload → câu 1 vẫn `aria-pressed` đúng lựa chọn + hiện "Đúng
      rồi/Chưa đúng" (tính lại bằng `gradeAnswer` — hàm thuần, offline, `StemLessonView.tsx:36`),
      câu 2 còn chữ đã gõ nhưng **chưa chấm** (chỉ chấm khi bấm "Kiểm tra" — giữ đúng hành vi
      hiện có dòng 72-76). Trạng thái từng câu dời từ `CauHoi` (dòng 31-32) lên
      `StemLessonView` để có một nguồn ghi. — `StemLesson.test.tsx` (đang có, 10 ca) thêm 3 ca;
      E2E ca "STEM reload".
- [ ] **AC-17 STEM: không tạo tiến độ/evidence.** Không có `localStorage` key mới ngoài
      `dhcb_lsession_v1_*`, không endpoint, không cột — STEM vẫn `unknown` "chưa đo được" ở mục
      lục S07. Snapshot `Object.keys(localStorage)` trước/sau bài STEM chỉ thêm đúng 1 khoá
      `dhcb_lsession_v1_*`. — E2E đếm khoá.
- [ ] **AC-18 CEFR: quay lại đúng tab + màn con.** Mở `/lo-trinh-hoc/a1`, sang tab "Hôm nay",
      reload (URL không có `?tab=`) → vẫn ở "Hôm nay". Mở bài ngữ pháp X trong unit 2 ở tab "Bài
      học", reload → vẫn mở bài X (state `lesson`/`circle`/`dialogue` dòng 142-144 khôi phục
      theo id, KHÔNG lưu nội dung). **URL thắng nháp:** có `?tab=quiz` thì mở quiz dù nháp ghi
      "today" (không phá link "Học tiếp" ở Home và `?tab=&cap=` của `comeback.ts`). — E2E ca
      "CEFR reload" + "URL thắng"; `session-cap.spec.ts`, `quiz-session.spec.ts`,
      `listening.spec.ts` (đang có) xanh.
- [ ] **AC-19 CEFR: KHÔNG chạm `quizSession.ts`, KHÔNG khôi phục `idx` của "Hôm nay".**
      `git diff --stat apps/dhcb/src/lib/quizSession.ts apps/dhcb/src/components/studyTabs/` chỉ
      được đổi `TodayLesson.tsx`/`QuizTab.tsx` nếu §7 Q5 chốt "có"; mặc định = 0 dòng. Lý do ở
      §① KHÔNG LÀM.
- [ ] **AC-20 Nhìn bằng mắt + a11y + ngân sách.** Ảnh 1440/390/320 TRƯỚC/SAU cho: hộp "dùng lại
      nháp" (AC-13), dòng "chặn lưu nháp" (AC-15), 5 theme. `e2e/a11y.spec.ts` +
      `a11y-aaa.spec.ts` (đang có route `/lap-trinh/bai-hoc/p1-u4-l1`, `/goc-hoc-tap/physics/...`,
      `/lo-trinh-hoc/a1`) 0 vi phạm; `npm run budget`: chunk 3 trang tăng ≤ 3 kB gzip mỗi chunk
      (dán số vào PR). `learningSession.ts` KHÔNG import Zod schema của bài (chỉ Zod cho phong bì
      — payload môn để `z.unknown()` rồi mỗi trang tự parse bằng schema nhỏ của mình, §③.2).

**Lệnh chứng minh (mỗi PR con, trên checkout sạch):**

```bash
rm -rf packages/*/dist dist dist-server
npm ci
npm run typecheck && npm run lint && npm run format && npm run build && npm run test:coverage
npm run budget
# AC-8: khung phiên không chạm tiến độ/API
grep -n "saveLessonProgress\|pushProgress\|fetch(\|/api/" \
  apps/dhcb/src/lib/learningSession.ts apps/dhcb/src/lib/useLearningSession.ts ; echo "exit=$? (mong 1 = không khớp)"
# Test đơn vị của slice
npx vitest run apps/dhcb/src/lib/learningSession.test.ts apps/dhcb/src/lib/useLearningSession.test.tsx \
  apps/dhcb/src/lib/guestProgress.test.ts apps/dhcb/src/lib/learningQuestionDraft.test.ts \
  apps/dhcb/src/pages/learning/StemLesson.test.tsx
# E2E của slice + các cổng đang có phải giữ xanh
npx playwright test e2e/learning-session-resume.spec.ts e2e/programming-lesson.spec.ts \
  e2e/quiz-session.spec.ts e2e/session-cap.spec.ts e2e/continue-viewing.spec.ts \
  e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts e2e/mobile-layout-guards.spec.ts
```

## ① Phạm vi

**LÀM (theo PR con):**

**S08-1 — khung phiên (không UI, merge độc lập, không đợi S07-2/S07-3):**

1. `apps/dhcb/src/lib/learningSession.ts` (mới): schema Zod phong bì v1, khoá storage, probe,
   bộ nhớ dự phòng, TTL, giới hạn ký tự, `contentFingerprint`, `listResumableSessions`,
   `pruneExpiredSessions`, `moveGuestSessionsTo` (dùng ở bước 3). Khuôn theo
   `learningQuestionDraft.ts` (đã duyệt ở S02) — cùng cách đặt tên `read*/save*/clear*`, cùng
   `DraftOwner`-style owner, cùng probe. **Không** dùng `packages/core-learner/` (§7 Q1: gói đó
   đang import `@dhcb/core-db/pgPool` — `learnerState.ts:28` — là gói phía server; khung nháp là phía
   trình duyệt).
2. `apps/dhcb/src/lib/useLearningSession.ts` (mới): hook React gói `read → state → save
(debounce 500 ms) → flush pagehide/visibilitychange → storage event`. Không có JSX.
3. `apps/dhcb/src/lib/guestProgress.ts`: thêm `LEARNING_SESSION_PREFIX`, quét khoá
   `dhcb_lsession_v1_guest:<gid>_*` trong `clearGuestKeys` (giống cách quét `et_usage_` dòng
   137-146) và gọi `moveGuestSessionsTo(realUid)` trong `mergeGuestProgressInto` TRƯỚC
   `clearGuestKeys` (dòng 196).
4. `apps/dhcb/src/App.tsx`: gọi `pruneExpiredSessions()` một lần lúc khởi động (cạnh effect
   `visibilitychange` dòng 298-320 đang có) — không thêm effect lặp.
5. Test: `learningSession.test.ts` ≥ 24 ca, `useLearningSession.test.tsx` ≥ 6 ca,
   `guestProgress.test.ts` +3 ca.

**S08-2 — bài Lập trình:**

6. `ProgrammingLessonPage.tsx` `LessonBody`: 8 `useState` (dòng 127-144) → khởi tạo từ
   `useLearningSession` (ready) hoặc mặc định; ghi `{ stepIndex, code, predictChoice, arranged,
hintsShown, sampleViewed }`; `parsonsResult` và `predictRevealed` suy ra; hộp "dùng lại
   nháp" khi `stale`; dòng báo khi `memory-only`; `clearSession` khi đạt hết test (Q6).
7. `ProgrammingLessonPage.test.tsx` (mới hoặc mở rộng của S07-2), E2E
   `e2e/learning-session-resume.spec.ts` (mới) ca Lập trình ×4, ảnh, changelog.

**S08-3 — STEM + CEFR:**

8. `StemLessonView.tsx`: nâng state `traLoi`/`ketQua` của `CauHoi` lên cha thành
   `answers: Record<number, string>`; ghi nháp `{ answers, checkedIdx: number[] }`; kết quả
   tính lại từ `gradeAnswer`.
9. `CefrLevelPage.tsx`: ghi `{ tab, view: { kind: 'grammar'|'circle'|'dialogue', id } | null }`
   cho `contentId = levelId`; ưu tiên `?tab=` khi có; khôi phục `lesson`/`circle`/`dialogue` bằng
   cách tra id trong dữ liệu đã tải (`levels`, `circleById`, `levelDialogues`), không lưu object.
10. `StemLesson.test.tsx` +3 ca, E2E ca STEM ×2 + CEFR ×2, ảnh, changelog, `PROGRESS.md`, goal.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- **KHÔNG đồng bộ server, KHÔNG cross-device, KHÔNG version/retry/xung đột khi gửi** — toàn bộ là
  S09. Không thêm endpoint, không cột DB, không migration, không gọi `pushProgress`.
- **KHÔNG đổi completion / evidence / mastery.** Không đụng `saveLessonProgress` (ngoài việc
  gọi `clearSession` cạnh nó ở AC-14), `progressMerge.ts`, `progress.ts`, `learnerState.ts`,
  `dailyLearningPlan.ts`. Nháp trên máy **không bao giờ** là bằng chứng hoàn thành; mục lục S07
  đọc tiến độ từ nguồn cũ, không đọc `dhcb_lsession_*`.
- **KHÔNG đổi hạn mức** khách/Free/VIP, không đổi `RequireAccount`/`AllowGuest`, không đổi luật
  khoá bậc/cấp.
- **KHÔNG thêm dependency** (không `idb-keyval`, không `zustand`, không `use-local-storage-state`).
  Zod đã có ở root `package.json:110` (`^4.5.4`).
- **KHÔNG thay `quizSession.ts`** (6 test + E2E `quiz-session.spec.ts` đang canh; nó dùng
  `sessionStorage` có chủ đích — bài kiểm tra 10 câu không nên sống qua ngày). Hợp nhất nó vào
  khung là nợ ghi ở §8, làm ở S12 (ôn tập) khi đụng tab quiz thật.
- **KHÔNG khôi phục `idx`/`batch` của `TodayLesson.tsx`** (dòng 316-319): batch được tính từ
  `getDailyLearned`/`getSkippedToday` — trạng thái NGÀY đã có nguồn riêng ở `curriculum.ts`;
  lưu thêm `idx` là hai nguồn sự thật cho một con số (Q5 để chủ dự án bác nếu muốn).
- **KHÔNG lưu nội dung bài, kết quả chấm, lời giải, câu trả lời AI** vào nháp — chỉ id/chỉ số/
  chữ người học gõ. Không đưa nháp vào URL, log, analytics.
- **KHÔNG dùng `sessionStorage` cho phiên học** (yêu cầu resume sau đóng tab — §7 Q2), **KHÔNG
  `BroadcastChannel`** (sự kiện `storage` đủ, đã có tiền lệ ở `AuthProvider.tsx:74`, và jsdom
  test được).
- KHÔNG đụng `OutlineTree`/`OutlinePane`/`TocRail`/`Modal` của S07; KHÔNG đụng renderer, host mode.

## ② Điểm chạm (đã khảo sát thật trên `7c2d81c`)

| PR  | Việc | Đường dẫn file                                                                  | Ghi chú khảo sát (số dòng thật)                                                                                                                                                                                                                                        |
| --- | ---- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Thêm | `apps/dhcb/src/lib/learningSession.ts` (+ `.test.ts`)                           | Bám khuôn `learningQuestionDraft.ts` (239 dòng, 21 test): probe dòng 74-86, owner dòng 33-36, `readDraft` dòng 157-164, `clearDraft(id)` dòng 176-190, `__reset*` dòng 236-238.                                                                                        |
| 1   | Thêm | `apps/dhcb/src/lib/useLearningSession.ts` (+ `.test.tsx`)                       | Không có hook `useSyncExternalStore` nào trong repo (grep = 0) → viết bằng `useState`+`useEffect`; luật `react-hooks/set-state-in-effect` đang bật (xem cách `useProgrammingLesson.ts:7-9` né).                                                                        |
| 1   | Sửa  | `apps/dhcb/src/lib/guestProgress.ts` (+ test đang có 20 ca)                     | `ALL_PREFIXES` dòng 50-60 khớp khoá **chính xác** `prefix + uid`; khoá phiên có hậu tố `_<subject>_<content>` nên phải QUÉT như `et_usage_` dòng 137-146. Dời ở `mergeGuestProgressInto` trước dòng 196.                                                               |
| 1   | Sửa  | `apps/dhcb/src/App.tsx`                                                         | Thêm 1 lời gọi `pruneExpiredSessions()` trong effect khởi động; effect `visibilitychange` đã có dòng 298-320 — không thêm listener trùng.                                                                                                                              |
| 2   | Sửa  | `apps/dhcb/src/pages/subjects/programming/ProgrammingLessonPage.tsx` (467 dòng) | **KHÔNG có nháp nào hiện nay**: `code` là `useState(lesson.make.starterCode)` dòng 140; `step` dòng 127; `key={lesson.id}` dòng 120 dựng lại thân trang khi đổi bài. `grep -n "localStorage\|sessionStorage\|draft"` trong file và `CodeEditor.tsx` = 0. Chưa có test. |
| 2   | Thêm | `apps/dhcb/src/pages/subjects/programming/ProgrammingLessonPage.test.tsx`       | S07-2 (AC-13/AC-17 của S07) cũng tạo file này — PR nào vào sau thì mở rộng.                                                                                                                                                                                            |
| 2   | Thêm | `e2e/learning-session-resume.spec.ts`                                           | Khuôn `mockLogin` + `addInitScript` như `quiz-session.spec.ts:23-30`; bài `p1-u4-l1` như `programming-lesson.spec.ts:20`.                                                                                                                                              |
| 3   | Sửa  | `apps/dhcb/src/pages/learning/StemLessonView.tsx` (238 dòng)                    | `CauHoi` giữ `traLoi`/`ketQua` cục bộ dòng 31-32; `gradeAnswer` dòng 36 thuần; input tự luận `setKetQua(null)` khi gõ dòng 75. Test đang có `StemLesson.test.tsx` 10 ca (ca "chấm trắc nghiệm" dòng 146).                                                              |
| 3   | Sửa  | `apps/dhcb/src/pages/subjects/english/CefrLevelPage.tsx` (1229 dòng)            | `tab` dòng 122-125 khởi tạo từ `?tab=`; **`setTab` (dòng 626) không ghi URL** → reload mất tab; `sessionCap` từ `?cap=` dòng 129-132; màn con `lesson`/`circle`/`dialogue` dòng 142-144. Không có unit test cho file này → chứng minh bằng E2E.                        |
| 3   | Sửa  | `e2e/learning-session-resume.spec.ts`, `docs/changelog/0326-*.md` (số kế tiếp)  | `npm run changelog` in "Đợt kế tiếp nên đánh số: 0326" lúc khảo sát; đánh lại khi tạo PR.                                                                                                                                                                              |

**Ảnh hưởng lan ra (đo `npm run codemap -- impact`, 2026-09-15 trên `7c2d81c`):**

- `ProgrammingLessonPage.tsx` → **2 file** (`App.tsx`, `main.tsx`) — trang lá, an toàn.
- `StemLessonView.tsx` → **3 file** (`App.tsx`, `StemLesson.test.tsx`, `main.tsx`).
- `CefrLevelPage.tsx` → **2 file** (`App.tsx`, `main.tsx`).
- `guestProgress.ts` → **4 file** (`AuthProvider.tsx`, `guestProgress.test.ts`, `App.tsx`,
  `main.tsx`) — sửa ở đây là chạm luồng đăng nhập của MỌI người dùng: test đỏ trước khi sửa.
- `AuthProvider.tsx` → 2 file — S08 **không sửa** file này (chỉ đọc `user.id`/`user.isGuest` qua
  `useAuth`; `buildGuestUser` dòng 20-30 cho `id = getGuestId()`).
- `learningQuestionDraft.ts` → 7 file — S08 **không sửa**, chỉ sao khuôn.
- `programmingProgress.ts` → **19 file** — S08 **không sửa** (bất biến AC-8).
- `quizSession.ts` → 9 file, `TodayLesson.tsx`/`QuizTab.tsx` → 7 file — S08 **không sửa** (AC-19).
- Trang mới của S07 (`OutlinePane`) đọc tiến độ qua `programmingProgress` — không đọc nháp; hai
  slice không giẫm file nhau trừ `ProgrammingLessonPage.tsx` (+ test) — xem §9 thứ tự.

## ③ Hợp đồng

### 3.1 Phong bì phiên (`apps/dhcb/src/lib/learningSession.ts`)

```ts
import { z } from 'zod'

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // §7 Q2
export const MAX_SESSION_CHARS = 16_000 // đo trên JSON.stringify(session)

const ownerSchema = z.object({ kind: z.enum(['guest', 'account']), id: z.string().min(1) })
export type SessionOwner = z.infer<typeof ownerSchema> // cùng hình với DraftOwner của S02

export const LearningSessionSchema = z
  .object({
    version: z.literal(1),
    subjectId: z.string().min(1), // 'programming' | 'physics' | ... | 'english'
    courseId: z.string().min(1).optional(), // ?khoa= của S07; không đổi khoá storage
    contentId: z.string().min(1), // lessonId / stemLessonId / levelId (CEFR)
    contentVersion: z.string().min(1), // contentFingerprint(...) — §3.4
    owner: ownerSchema,
    stepIndex: z.number().int().nonnegative(), // vị trí trong phiên (bước/tab)
    stepLabel: z.string().max(60).optional(), // chữ cho "Học tiếp" (S06), không phải khoá
    draft: z.unknown(), // payload theo môn — trang tự parse bằng schema nhỏ của mình (§3.2)
    startedAt: z.number().int().positive(),
    updatedAt: z.number().int().positive(),
  })
  .refine((s) => s.updatedAt >= s.startedAt, { message: 'updatedAt < startedAt' })

export type LearningSession = z.infer<typeof LearningSessionSchema>

export type SessionReadResult =
  | { status: 'ready'; session: LearningSession }
  | { status: 'stale'; session: LearningSession } // contentVersion khác — KHÔNG tự prefill
  | { status: 'empty' | 'expired' | 'invalid' | 'unavailable' }

export type SaveSessionResult =
  | { status: 'saved' | 'memory-only'; session: LearningSession }
  | { status: 'too-large'; chars: number } // bản cũ (nếu có) giữ nguyên

export interface SessionKeyParts {
  owner: SessionOwner
  subjectId: string
  contentId: string
}

export function saveSession(
  parts: SessionKeyParts,
  input: Omit<
    LearningSession,
    'version' | 'owner' | 'subjectId' | 'contentId' | 'startedAt' | 'updatedAt'
  >,
  now?: number,
): SaveSessionResult
export function readSession(
  parts: SessionKeyParts,
  contentVersion: string,
  now?: number,
): SessionReadResult
export function clearSession(parts: SessionKeyParts): void
export function listResumableSessions(owner: SessionOwner, now?: number): ResumableSessionSummary[]
export function pruneExpiredSessions(now?: number): number // trả số khoá đã xoá
export function moveGuestSessionsTo(guestId: string, accountId: string): number // dùng ở guestProgress
export function contentFingerprint(parts: readonly (string | number)[]): string // FNV-1a 32-bit hex
export function isSessionStorageAvailable(): boolean
export function __resetSessionMemory(): void // chỉ test

export interface ResumableSessionSummary {
  subjectId: string
  courseId?: string
  contentId: string
  stepIndex: number
  stepLabel?: string
  updatedAt: number
}
```

**Luật `saveSession`:** giữ `startedAt` của bản đang có (nếu có, cùng khoá, cùng owner), gán
`updatedAt = now`; serialize; đếm ký tự; > `MAX_SESSION_CHARS` → `too-large` và KHÔNG ghi; ghi
vào `Map` bộ nhớ trước, rồi `localStorage` (probe ở lần đầu, kết quả probe cache theo lượt tải
trang); ném lỗi → `memory-only`. `readSession`: `Map` bộ nhớ ưu tiên khi storage không dùng được;
parse Zod → `invalid` khi hỏng (KHÔNG xoá — người dùng có thể đang mở bản app cũ ở tab khác);
owner khác → `empty`; `now - updatedAt > TTL` → `expired`; `contentVersion` khác → `stale`.

### 3.2 Hook React (`apps/dhcb/src/lib/useLearningSession.ts`)

```ts
export interface UseLearningSessionArgs<T> {
  owner: SessionOwner | null // null khi AuthProvider chưa xong → status 'loading', không ghi
  subjectId: string
  contentId: string
  courseId?: string
  contentVersion: string
  draftSchema: z.ZodType<T> // schema NHỎ của trang; payload không parse được → coi như 'invalid'
  initial: () => { stepIndex: number; draft: T } // mặc định khi không có gì để khôi phục
  stepLabel?: (stepIndex: number) => string
}

export interface UseLearningSessionResult<T> {
  status: 'loading' | 'restored' | 'fresh' | 'stale' | 'memory-only'
  stepIndex: number
  draft: T
  staleSession: { stepIndex: number; draft: T } | null // để UI hỏi "dùng lại?"
  setStep(i: number): void
  setDraft(updater: T | ((prev: T) => T)): void
  adoptStale(): void // người dùng bấm "Dùng lại"
  discardStale(): void // "Bắt đầu mới" — xoá bản cũ
  clear(): void // bài xong → xoá nháp
  storageMode: 'local' | 'memory' // để hiện dòng báo
}
```

Hành vi: đọc MỘT lần lúc mount (không đọc lại khi re-render); ghi debounce 500 ms sau mỗi
`setStep`/`setDraft`; **flush đồng bộ** ở `pagehide` và `visibilitychange`→`hidden` (Safari iOS
không bắn `beforeunload` ổn định — repo hiện không dùng `beforeunload` ở đâu, giữ vậy); lắng
`storage` event với đúng khoá của mình: bản đến có `updatedAt` mới hơn → thay state, không ghi
lại. Owner đổi giữa chừng (đăng xuất trong tab khác → `AuthProvider` refresh) → hook coi như
mount lại với owner mới: đọc lại, state cũ **không** được ghi sang khoá của owner mới.

### 3.3 Khoá storage

```
dhcb_lsession_v1_<ownerKind>:<ownerId>_<subjectId>_<contentId>
ví dụ: dhcb_lsession_v1_account:42_programming_p1-u4-l1
       dhcb_lsession_v1_guest:guest_9f1c…_physics_ly10-c2-b10
       dhcb_lsession_v1_account:42_english_a1
```

- Tiền tố `dhcb_lsession_v1_` là tiền tố MỚI, đăng ký ở `guestProgress.ts` (quét theo
  `dhcb_lsession_v1_guest:<gid>_`). `courseId` KHÔNG nằm trong khoá: cùng bài mở từ khoá Git
  hay bậc P3 là cùng nháp (một bài một nháp — khớp Q1 của S07 "một bài một URL chuẩn").
- `ownerId` của khách là `guest_<uuid>` (có dấu `_`) — vì thế tách bằng `:` giữa kind và id, và
  khi quét tiền tố phải dùng `startsWith` chứ không `split('_')`.
- Không đăng ký vào `ARRAY_KEYS`/`MAP_KEYS` (không phải tiến độ, không union, không đẩy server).

### 3.4 Payload theo môn (schema nhỏ, sống trong file trang) + `contentVersion`

| Màn                               | `contentId`            | `draft` (Zod trong file trang)                                                                                             | `stepIndex`                   | `contentVersion = contentFingerprint([...])`                                                                                                       | Khôi phục KHÔNG gồm                                                    |
| --------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Lập trình `ProgrammingLessonPage` | `lesson.id`            | `{ code: string ≤ 8000, predictChoice: number\|null, arranged: string[] ≤ 12, hintsShown: number, sampleViewed: boolean }` | 0-5 theo `STEPS` (dòng 58-65) | `[lesson.id, lesson.title, lesson.make.starterCode, lesson.make.testCases.length, lesson.parsons.lines.join('\n'), lesson.predict.choices.length]` | `results`, `passed`, `exampleOutput`; `parsonsResult` tính lại         |
| STEM `StemLessonView`             | `bai.id`               | `{ answers: Record<string, string>, checked: string[] }` (khoá = chỉ số câu dạng chuỗi)                                    | luôn 0 (trang một màn)        | `[bai.id, bai.title, bai.checkQuestions.length, ...bai.checkQuestions.map((c) => c.prompt)]`                                                       | Kết quả đúng/sai (tính lại bằng `gradeAnswer` cho câu trong `checked`) |
| CEFR `CefrLevelPage`              | `level.id` (`a1`…`c2`) | `{ tab: StudyTab, view: { kind: 'grammar'\|'circle'\|'dialogue', id: string } \| null }`                                   | chỉ số tab trong `STUDY_TABS` | `[level.id, level.units.length, ...level.units.map((u) => u.id)]`                                                                                  | Nội dung bài/vòng/hội thoại; `idx` của "Hôm nay"; quiz (đã có riêng)   |

Vì sao fingerprint thay vì trường `version` mới: kiểu `ProgrammingLesson` (`lessonTypes.ts:72-150`),
`StemLessonLike` (`stemLesson.ts:22-40`) và `CefrLevel` (`cefrTypes.ts`) **đều không có** trường
version/hash/updatedAt (grep 3 file = 0). Thêm trường là sửa 373 + 318 bài + `cefr.json` +
`gen:lesson-index` — ngoài phạm vi và không cần: fingerprint đủ để biết "phần người học đã gõ
còn khớp khung bài không". Chọn FNV-1a 32-bit (≈ 10 dòng, không dependency, tất định) — §7 Q4.

### 3.5 Ca lỗi (là hợp đồng)

| Tình huống                                                                           | Kết quả module                        | Hành vi giao diện mong đợi                                                                                                   |
| ------------------------------------------------------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `localStorage` bị chặn / ném lúc ghi (Safari riêng tư)                               | `memory-only`, `storageMode:'memory'` | Vẫn học; dòng `role="status"` "Trình duyệt đang chặn lưu nháp — rời trang là mất phần đang gõ" (AC-15)                       |
| `QuotaExceededError` khi ghi                                                         | `memory-only`                         | Như trên; KHÔNG xoá khoá của người khác/khoá tiến độ để lấy chỗ                                                              |
| Nháp > 16 000 ký tự                                                                  | `too-large`, bản cũ giữ               | Dòng báo "Nháp quá dài nên không lưu tự động — hãy chấm bài hoặc rút gọn"; ô code KHÔNG bị cắt                               |
| JSON hỏng / thiếu trường / `version` lạ                                              | `invalid`                             | Coi như không có nháp; KHÔNG xoá (tab khác có thể là app bản mới hơn ghi); prune chỉ xoá khi hết TTL đọc được `updatedAt`    |
| `updatedAt` quá TTL                                                                  | `expired`                             | Không nạp; `pruneExpiredSessions` dọn lúc khởi động                                                                          |
| Owner khác (đăng xuất, đổi tài khoản, khách mới)                                     | `empty`                               | Bắt đầu mới; không có dấu hiệu nào cho biết người trước từng gõ gì                                                           |
| `contentVersion` khác                                                                | `stale` + session                     | Hộp "Bài này đã được cập nhật — dùng lại code bạn đã gõ?" (Lập trình); STEM/CEFR: bỏ nháp im lặng (chỉ là chỉ số/id, Q4)     |
| Hai tab: tab B ghi mới hơn                                                           | `storage` event → thay state          | Không hỏi, không nhấp nháy; tab A tiếp tục từ bản mới; tab A ghi tiếp thì đến lượt B nhận                                    |
| Hai tab: sự kiện đến với `updatedAt` cũ hơn (đồng hồ lệch trong cùng máy = không có) | Bỏ qua                                | —                                                                                                                            |
| Owner `null` (AuthProvider đang `loading`)                                           | hook `status:'loading'`               | Trang dựng với mặc định nhưng **không ghi**; khi owner có → đọc lại, nếu `ready` thì thay state (chỉ khi người dùng chưa gõ) |
| `?tab=` có trong URL (CEFR)                                                          | URL thắng                             | Nháp cập nhật theo tab URL, không ngược lại                                                                                  |
| Bài xong (đạt hết test)                                                              | `clear()`                             | Mở lại bài đã xong → bắt đầu ở bước 0 với `starterCode` (Q6)                                                                 |

## ⑤ Bất biến không được phá

| Bất biến                                                                                 | Test canh                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Completion chỉ do server/domain; nháp không tạo/đổi completion                           | AC-8 grep; `ProgrammingLessonPage.test.tsx` spy `fetch` completed = 0 khi reload; `apps/server/src/api/core/progress.test.ts` (30 ca), `progressMerge.test.ts` (11 ca) không đổi |
| Merge khách không ghi đè tiến độ tài khoản; khoá khách được dọn sạch                     | `guestProgress.test.ts` (20 ca đang có + 3 ca mới: dời nháp, bản mới hơn thắng, khoá khách sạch)                                                                                 |
| Nháp có chủ sở hữu; đăng xuất không prefill chéo                                         | `learningSession.test.ts` ca owner; E2E "logout → empty"; cùng luật với `learningQuestionDraft.test.ts` (21 ca, không đổi)                                                       |
| Không đưa nháp vào URL/log; không `console.log`                                          | grep `console.` trong 2 file mới = 0; E2E kiểm URL không đổi khi gõ                                                                                                              |
| `quizSession.ts` và E2E quiz giữ nguyên                                                  | `quizSession.test.ts` (6 ca), `e2e/quiz-session.spec.ts` xanh; `git diff --stat` = 0 dòng ở file đó                                                                              |
| `?tab=`/`?cap=` của CEFR vẫn hoạt động (Home "Học tiếp", comeback)                       | `e2e/session-cap.spec.ts` (2 ca), `comeback.test.ts` (10 ca), E2E "URL thắng nháp"                                                                                               |
| Luồng 8 bước bài Lập trình không đổi (Pyodide/Worker/SQL/HTML/Git/Kotlin)                | `e2e/programming-lesson.spec.ts` (31 test) xanh — không chờ cứng, không đổi selector                                                                                             |
| Bài STEM không có tiến độ/evidence; chấm thuần offline                                   | `StemLesson.test.tsx` (10 + 3 ca); AC-17 đếm khoá                                                                                                                                |
| Không khoá `localStorage` mới ngoài `dhcb_lsession_v1_*`; không tiền tố `et_`/`srs_` mới | `guestProgress.test.ts` (ALL_PREFIXES không đổi trừ quét mới), E2E snapshot khoá                                                                                                 |
| a11y AA + AAA 5 theme; mobile không bị che                                               | `e2e/a11y.spec.ts`, `a11y-aaa.spec.ts`, `mobile-layout-guards.spec.ts` (đang có route 3 trang)                                                                                   |
| Ngân sách bundle/coverage không tụt (97/93/96/97)                                        | `npm run budget`, `npm run test:coverage`                                                                                                                                        |

**Danh sách ca tối thiểu của `learningSession.test.ts` (24):** schema hợp lệ · thiếu trường ·
version 2 · owner id rỗng · `updatedAt < startedAt` · JSON hỏng → invalid không xoá · save rồi
read → ready · giữ `startedAt` khi save lại · owner kind khác → empty · owner id khác → empty ·
guest/account cùng bài hai khoá · TTL đúng biên còn · TTL + 1 hết · prune xoá đúng khoá hết hạn ·
prune không đụng khoá lạ · 16 000 lưu · 16 001 too-large giữ bản cũ · storage ném → memory-only
đọc lại được · quota → memory-only · fingerprint tất định · fingerprint đổi 1 ký tự khác ·
contentVersion khác → stale kèm session · listResumable lọc + sắp xếp · moveGuestSessionsTo (mới
hơn thắng, khoá khách xoá).

## ⑥ Quy ước dự án liên quan (bên thi hành không thấy hội thoại)

- Zod validate mọi thứ đọc từ storage (dữ liệu NGOÀI — người dùng sửa được bằng devtools); không
  `as` ép kiểu từ `JSON.parse` (khác `quizSession.ts` đang kiểm tay — không sửa nó ở S08).
- Không `any`; TS `strict`; import xuyên gói `@dhcb/<gói>/<file>` không đuôi; `@core/*` alias
  cho `packages/core-ui`. Không import `apps/` từ `packages/`.
- Luật ESLint `react-hooks/set-state-in-effect` đang bật: không `setState` đồng bộ trong effect
  (xem cách `useProgrammingLesson.ts:7-9` và `StemLessonView.tsx:117-119` né).
- Chữ nội dung AAA ≥ 7:1, nút AA; màu qua token `--a-*`/`--z-*`; trạng thái có CHỮ (dòng báo
  `role="status"`), vùng chạm ≥ 44 px (`tap-44`); hộp "dùng lại nháp" dùng `Modal`/
  `useDialogBehavior` đang có (6 hành vi APG), không dựng overlay mới.
- Mọi thao tác storage `try/catch`; không `console.log`; thời gian là epoch ms, truyền `now`
  vào hàm để test không phụ thuộc đồng hồ.
- Đổi UI → ảnh 1440/390/320 trước/sau (QUY-TRINH-AUDIT Tầng 8b) dán vào PR; a11y AA + AAA.
- Test đỏ TRƯỚC khi sửa `guestProgress.ts` (4 file ảnh hưởng, luồng đăng nhập).
- PR: `feat(learning): …` mô tả dẫn file này + "Approved for implementation"; đủ 6 tiêu đề cổng
  `metadata`; READY; auto-merge (squash) ngay sau tạo; CI đỏ là việc của PR; changelog
  `docs/changelog/0326-*` (đánh lại số lúc tạo bằng `npm run changelog`).
- Cổng trên checkout sạch (`rm -rf packages/*/dist dist dist-server`), `npm ci` trước lần chạy
  đầu; cổng test CI là `test:coverage`.

## 7. Quyết định cần chủ dự án chốt trước khi Approved

> **CHỐT 2026-09-15 — chủ dự án:** lấy TOÀN BỘ cột "Đề xuất của AI (mặc định)"
> làm quyết định cuối cho mọi câu hỏi trong bảng dưới. Không có ý kiến khác.

| #   | Câu hỏi                                                                                                                         | Đề xuất của AI (mặc định nếu không có ý kiến khác)                                    | Lý do                                                                                                                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Khung phiên đặt ở `apps/dhcb/src/lib/learningSession.ts` hay `packages/core-learner/session/`?                                  | **`apps/dhcb/src/lib/`** (cùng chỗ với `learningQuestionDraft.ts`, `quizSession.ts`). | `core-learner` là gói phía server (`learnerState.ts:28` import `@dhcb/core-db/pgPool`; tsconfig tham chiếu `core-db`); khung này thuần trình duyệt. Chưa có app thứ hai cần dùng; khi `apps/hub` cần thì dời sang `packages/core-ui` — hàm thuần, dời rẻ.                       |
| Q2  | Nơi ghi + TTL: `localStorage` 7 ngày, hay `sessionStorage` (như quiz) / 30 phút (như nháp câu hỏi)?                             | **`localStorage`, TTL 7 ngày tính từ `updatedAt`.**                                   | Yêu cầu "đóng tab rồi mở lại vẫn học tiếp" chỉ `localStorage` đáp ứng; nháp code không phải chữ riêng tư nhạy như câu hỏi Companion (S02 chọn 30 phút vì lý do riêng tư); 7 ngày khớp nhịp "quay lại sau khi bỏ bẵng" 3 ngày của `comeback.ts` (còn nháp để quay về).           |
| Q3  | Khách → tài khoản: dời nháp NGẦM lúc `mergeGuestProgressInto` (như tiến độ) hay bắt bấm "dùng lại" (như S02 `claimGuestDraft`)? | **Dời ngầm, bản mới hơn thắng.**                                                      | Cùng thiết bị, cùng người vừa bấm đăng nhập; tiến độ khách đã được dời ngầm theo đúng cơ chế này (`guestProgress.ts:157-205`) — nháp đi kèm tiến độ cho nhất quán. S02 khác vì câu hỏi là chữ riêng tư có thể của người khác ngồi trước máy; code bài tập không mang rủi ro đó. |
| Q4  | `contentVersion`: fingerprint FNV-1a trên các trường khung bài (§3.4) hay thêm trường `version` vào 3 kiểu bài + registry?      | **Fingerprint.**                                                                      | 3 kiểu bài đều không có version; thêm trường = sửa 691 bài + `cefr.json` + file sinh. Fingerprint ≈ 10 dòng, tất định, không dependency. Khi S09 cần version thật ở server thì dùng lại chính hàm này ở server (hàm thuần, không phụ thuộc DOM).                                |
| Q5  | Có khôi phục `idx` của tab "Hôm nay" (`TodayLesson.tsx:319`) và dời `quizSession.ts` vào khung ở S08 không?                     | **Không — để S12.**                                                                   | `batch` được suy từ trạng thái ngày (`getDailyLearned`/`getSkippedToday`) — lưu `idx` là hai nguồn sự thật; quiz đã có cơ chế riêng chạy tốt (6 test + E2E). S12 (ôn tập) sẽ đụng hai tab này thật, làm lúc đó có ngữ cảnh hơn.                                                 |
| Q6  | Bài Lập trình đạt hết test → xoá nháp ngay (mở lại bài = bắt đầu sạch) hay giữ nháp code để xem lại?                            | **Xoá nháp khi đạt hết test.**                                                        | "Resume" là cho việc DỞ; bài xong mà mở lại vẫn thấy code cũ ở bước "Tự viết" dễ bị hiểu là chưa xong. Muốn xem lại lời giải của mình là tính năng khác (portfolio/sổ bài làm — S11/S12). Chấp nhận trả giá: người học muốn sửa tiếp code sau khi đạt thì gõ lại.               |

## 8. Rủi ro và giảm thiểu

| Rủi ro                                                                                                   | Giảm thiểu                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hai PR (S07-2 và S08-2) cùng sửa `ProgrammingLessonPage.tsx` + cùng tạo `ProgrammingLessonPage.test.tsx` | Thứ tự chốt: S07 trước. S08-2 rebase lên `main` sau S07-2 merge; nếu S07-2 chưa vào, S08-2 chờ (S08-1 và S08-3 không phụ thuộc).                                                                     |
| Khôi phục `stepIndex` = 4 ("Tự viết") mà `results` không khôi phục → người học tưởng mất bài chấm        | Dòng nhỏ dưới ô code khi `status:'restored'` và có code khác `starterCode`: "Đã khôi phục code bạn gõ — bấm Chấm bài để chấm lại." (chữ, AAA).                                                       |
| Lưu `code` mỗi phím gõ làm chậm ô code (CodeEditor là textarea)                                          | Debounce 500 ms + `JSON.stringify` chỉ trong callback debounce; đo `performance.now()` < 2 ms/lần ghi ở unit test với code 8 000 ký tự.                                                              |
| `storage` event nhận bản mới hơn khi người dùng đang gõ ở tab A → chữ nhảy                               | Chấp nhận last-write-wins **theo `updatedAt`**: tab đang gõ có `updatedAt` mới nhất sau ≤ 500 ms nên bản của tab kia không thắng được trừ khi họ gõ ở cả hai tab — ca này E2E ghi nhận, không "sửa". |
| `moveGuestSessionsTo` chạy trước `clearGuestId()` (dòng 199) nhưng `getGuestId()` đã đổi ở đâu đó        | Truyền `guestId` đã đọc ở đầu `mergeGuestProgressInto` (dòng 159) vào hàm — không gọi lại `getGuestId()`.                                                                                            |
| Coverage tụt vì nhánh UI (hộp stale, dòng báo)                                                           | Module thuần test 100%; hook ≥ 6 ca; hai nhánh UI có unit test riêng (AC-13, AC-15).                                                                                                                 |
| Prune chạy lúc khởi động quét toàn bộ `localStorage` (có thể vài trăm khoá)                              | Chỉ `startsWith('dhcb_lsession_v1_')`, một vòng `for`; đo trong test với 500 khoá lạ < 5 ms.                                                                                                         |
| CEFR: khôi phục `view.id` mà id không còn trong dữ liệu đã tải (unit bị bỏ)                              | Tra không thấy → `view = null`, tab giữ; không lỗi; fingerprint theo `units.map(id)` đã bắt phần lớn ca này thành `stale`.                                                                           |

## 9. Kế hoạch thi hành (3 PR, tuần tự; mỗi PR một subagent Sonnet, agent chính review)

1. **S08-1 `feat(learning): khung phien hoc LearningSession + hook resume cung thiet bi`** —
   `learningSession.ts` + `useLearningSession.ts` + test + `guestProgress.ts` (dời/dọn) +
   `App.tsx` (prune). 0 thay đổi giao diện. Có thể merge **trước** S07-2/S07-3.
2. **S08-2 `feat(learning): nhap code va buoc dang hoc song qua reload o bai Lap trinh`** — ✅
   ĐÃ THI HÀNH (changelog `0343-2026-09-16-s08-2-nhap-bai-lap-trinh.md`). Sau
   S07-2 merge (cùng file). Hộp stale, dòng memory-only, E2E, ảnh.
3. **S08-3 `feat(learning): resume dap an tu kiem tra STEM va tab hoc CEFR`** — sau S07-3 nếu
   S07-3 đổi `CefrLevelPage`; STEM có thể tách PR riêng nếu S07-3 kẹt (Q2 của S07).
   **[2026-09-16] Đã tách thật:** phần STEM (AC-16, AC-17) thi hành ở changelog `0347`; phần
   tab học CEFR (AC-18, AC-19) chờ S07-3 merge — nhánh S07-3 đổi 207 dòng đúng vùng khai báo
   `tab`/màn con của `CefrLevelPage.tsx`.
4. Mỗi PR: changelog `docs/changelog/03xx-*.md`, `PROGRESS.md` bảng slice, goal bảng S08
   (Issue/PR/State/Evidence), đổi trạng thái ở spec này; S08-3 xong thì ghi vào goal dòng S06
   "nguồn Học tiếp: `listResumableSessions`".

**Rollback:** revert PR tương ứng; không migration/schema; khoá `dhcb_lsession_v1_*` còn lại
trong trình duyệt người dùng là vô hại (không module nào khác đọc; hết TTL tự bị prune nếu S08-1
còn, hoặc nằm im nếu revert cả S08-1). Revert S08-1 sau khi S08-2/3 đã vào là KHÔNG hợp lệ (2
trang import) — revert theo thứ tự ngược.

## 19. Phê duyệt

- [x] Product outcome và scope (Q1–Q6)
- [x] UX/accessibility (hộp stale, dòng báo storage, không nhảy chữ hai tab)
- [x] Architecture (phong bì v1 + payload theo môn, `localStorage` + memory, fingerprint, ranh giới S09)
- [x] Test/rollout/rollback (3 PR)

**Kết luận:** Approved for implementation (S08-1 đã thi hành)  
**Người duyệt:** Chủ dự án  
**Ngày:** 2026-09-15
