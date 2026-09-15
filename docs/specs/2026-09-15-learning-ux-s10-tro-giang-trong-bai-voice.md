# Học tập liền mạch — slice S10: Trợ giảng trong bài + voice thật (sửa lifecycle trước)

| Thuộc tính    | Giá trị                                                                                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec nền      | [`2026-09-15-learning-ux-foundation.md`](2026-09-15-learning-ux-foundation.md) §④ D ("trợ giảng theo bài", "gợi ý tăng dần, phản hồi chỉ lỗi") + §⑤ "Không cho AI mutate billing/permissions/mastery"                           |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md) dòng S10 — "Trợ giảng trong bài, voice thật", dependency **S08 + tutor spec**; §5 current truth: "S10 tutor/voice (**sửa lifecycle trước**)"                                |
| Spec liên đới | [S07 mục lục](2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md) (ngữ cảnh `subjectId`/`courseId`/`contentId` từ `OutlineNode`) · [khách vãng lai](2026-09-15-mo-xem-web-khong-can-dang-nhap.md) (3 endpoint AI/audio mở cho khách) |
| Thứ tự chốt   | S07 → S08 → S06 → S05 → **S10** → S11 → S09 → S12 → S13. **S08 CHƯA có spec** (grep `docs/specs` cho `LearningSession` chỉ ra spec S07 và goal) — xem §7 Q1                                                                     |
| Base khảo sát | `main` `7c2d81c` (#928), khảo sát 2026-09-15 bằng đọc mã thật + `npm run codemap -- impact`; mọi số dòng/số đếm bên dưới là số thật tại base này                                                                                |
| Trạng thái    | **Approved for implementation** — chủ dự án chốt TOÀN BỘ câu hỏi §7 theo đề xuất mặc định (2026-09-15)                                                                                                                          |
| Người duyệt   | Chủ dự án                                                                                                                                                                                                                       |

> Không bắt đầu code khi trạng thái chưa là **Approved for implementation**. Luật số 1 của khuôn
> `docs/templates/dac-ta-tinh-nang.md`: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.
>
> Slice này chia **3 PR con tuần tự** (§9): **S10-1** sửa lifecycle (bắt buộc trước, là `fix`,
> merge độc lập) → **S10-2** trợ giảng trong bài bằng chữ → **S10-3** voice thật trong bài.

## 0. Một câu

Cho người học đang ở trong một bài (Lập trình · STEM · Tiếng Anh) hỏi trợ giảng ngay tại chỗ —
AI biết đúng bài, đúng bước, đúng câu trả lời vừa nhập, gợi ý tăng dần theo kiểu Socratic mà
không lộ lời giải, đọc được bằng giọng thật (giọng ngôn ngữ đích + giọng mẹ đẻ cho môn Anh) và
nghe được người học nói — trên nền lifecycle đã sửa để **rời trang là im, đổi bài là sạch,
StrictMode không gọi đúp**, và câu trả lời AI **không bao giờ** ghi vào completion/mastery.

## ④ Tiêu chí chấp nhận (đo được — mỗi dòng ghi lệnh/bằng chứng)

### Phần 1 — S10-1 sửa lifecycle (fix, bắt buộc trước; không thêm tính năng)

Sáu lỗi lifecycle **đã tìm thấy thật** tại base `7c2d81c` (bằng chứng file:dòng ở §2.1). Mỗi lỗi
có **một test regression viết TRƯỚC, đỏ trên mã cũ, xanh sau khi sửa** — dán số ca đỏ/xanh vào PR
(khuôn PR #922: "trả file về bản `main` → N ca đỏ").

- [ ] **AC-1 Rời trang Companion giữa lúc AI đang trả lời bằng giọng nói → KHÔNG cất tiếng ở
      trang kế.** Cleanup của `Companion.tsx` (dòng 136–142) hiện chỉ gọi `voiceRecorderRef.cancel()` + `stopSpeaking()` mà **không** đặt `voiceCancelledRef.current = true`, nên `onDone`
      (dòng 337–345) của stream còn bay vẫn gọi `speak(finalResp.reply, 'vi-VN')`. Sửa: cleanup
      đặt cờ huỷ + abort stream (AC-2). Test `Companion.voice.test.tsx` (mới): mock
      `sendCompanionMessageStream` trả `onDone` sau khi `unmount()` → `speak` được gọi **0 lần**,
      không có warning `act`/setState sau unmount. — `npx vitest run apps/dhcb/src/pages/companion`.
- [ ] **AC-2 Stream Companion huỷ được.** `sendCompanionMessageStream(params, callbacks, {signal})`
      nhận `AbortSignal` (hiện `companionApi.ts:72–77` không nhận), truyền vào `fetch`, và khi
      abort thì `reader.cancel()`; `Companion.tsx` giữ một `AbortController` cho lượt gửi hiện
      tại, abort trong cleanup unmount. Test `companionApi.test.ts` thêm ≥ 2 ca: abort trước khi
      có `done` → promise reject `AbortError`, `onDone` không gọi; abort sau `done` → không đổi
      kết quả. `companionApi.test.ts` hiện 9 ca phải xanh nguyên. Server: lượt đã trừ ở
      `checkAndConsumeUsage(auth.userId,'chat')` (`companion.ts:84`) **không hoàn** khi client
      abort — ghi rõ ở UI ("lượt đã dùng") và §③.4; không đổi luật hoàn lượt server.
- [ ] **AC-3 Mọi effect fetch-khi-mount trong `Companion.tsx` đều huỷ được theo khuôn
      `AbortController` (#925).** `fetchProactiveAgentState()` (dòng 77–81) hiện không có signal
      → StrictMode gọi hai lần và `setProactiveState` sau unmount. Sửa cùng khuôn effect lịch sử
      (dòng 96–128). Test: render dưới `<StrictMode>` → `fetch` mock được gọi với `signal`, lượt
      một bị abort, không setState sau unmount. `e2e/companion-history.spec.ts` (3 test) giữ xanh.
- [ ] **AC-4 `stopSpeaking()` trong lúc TTS còn đang TẢI thì lượt phát đó không được phát.**
      `tts.ts` `speakViaGoogle` (dòng 553–556): `myPlayToken = playToken` chốt **sau**
      `await ensureAudioWithTimeline(...)`, nên `stopSpeaking()` (đổi `playToken`, dòng 309–330) gọi
      trong lúc đang tải — chính là lúc rời trang — không ngăn được lượt phát; audio nổ ở trang
      kế. Sửa: chốt vé **trước** await, sau await nếu `playToken !== vé` thì `return` không phát.
      `tts.test.ts` (69 ca hiện có) thêm ≥ 2 ca: stop giữa lúc tải → `audio.play` 0 lần, promise
      resolve; stop sau khi phát → như cũ. Bất biến `speakBilingual` (dòng 717–736) giữ nguyên.
- [ ] **AC-5 Micro luôn được nhả.** `sttServer.ts:35–38`: `getUserMedia` xong mới
      `new MediaRecorder(stream, …)`; nếu constructor ném (mime không hỗ trợ, thiết bị bận) thì
      `stream.getTracks()` không bao giờ `.stop()` → đèn mic sáng vô hạn. Sửa: `try/catch` quanh
      constructor, catch thì release tracks rồi ném lại. Test `sttServer.test.ts` (mới — hiện
      **không có** test cho file này) ≥ 4 ca: constructor ném → `track.stop()` 1 lần; `cancel()` →
      stop tracks; `stop()` với 0 byte → `EMPTY_RECORDING` + tracks đã stop; `stop()` bình thường
      → gọi `/api/stt` đúng 1 lần với `signal`.
- [ ] **AC-6 `AiHelpPanel` không rò trạng thái giữa hai bài và không setState sau unmount.**
      `AiHelpPanel.tsx:37–58` không có `useMountedRef`/`AbortController`; `ProgrammingLessonPage`
      là cùng một instance khi `:lessonId` đổi (App.tsx:521 render `<ProgrammingLessonPage />`
      không `key`) nên `level`/`text` của bài A có thể còn nguyên ở bài B, và response trễ của
      bài A đổ vào bài B. Sửa tối thiểu: `key={lesson.id}` tại chỗ dùng (dòng 392) **và** panel
      bỏ qua response khi `lessonId` lúc gửi ≠ `lessonId` hiện tại (ref), `mountedRef` trước mọi
      setState. Test `AiHelpPanel.test.tsx` (mới — hiện không có) ≥ 3 ca: đổi `lessonId` → level về
      0, text rỗng; response trễ của bài cũ bị bỏ; unmount giữa chừng → không setState.
      `programmingFeedback.test.ts` 7 ca giữ xanh; `e2e/programming-lesson.spec.ts` (đang chặn
      `/api/programming/feedback` ở dòng 115) giữ xanh.

### Phần 2 — S10-2 trợ giảng trong bài (chữ)

- [ ] **AC-7 Một endpoint, một hợp đồng Zod.** `POST /api/lesson-tutor` (`apps/server/src/api/learning/lesson-tutor.ts`)
      nhận `LessonTutorRequest` §③.1, trả `LessonTutorResponse`; body sai → 400 kèm thông điệp
      Zod; `contentId` không tra được trong chỉ mục môn tương ứng → 400 "Bài không tồn tại"
      (không gọi AI, không trừ lượt). Test `lesson-tutor.test.ts` (server) ≥ 6 ca: 401/405/400 ×2/
      429 hạn mức/200. — `npx vitest run apps/server/src/api/learning/lesson-tutor.test.ts`.
- [ ] **AC-8 Prompt dựng Ở SERVER, client không gửi được prompt tuỳ ý** (cùng lý do
      `feedbackPrompt.ts` dòng 7–16). `packages/core-learner/tutorPrompt.ts` export
      `buildLessonTutorPrompt(input)` + `TUTOR_GUARDRAIL`; phần "câu trả lời của người học" và
      "câu hỏi" được đóng khung là DỮ LIỆU (chống prompt-injection, khuôn
      `CODE_FEEDBACK_GUARDRAIL` dòng 34–44). Golden snapshot `tutorPrompt.golden.test.ts` chụp
      nguyên văn prompt cho 3 môn × 3 bậc gợi ý (9 ca) — không gọi AI, chạy trong CI.
- [ ] **AC-9 Socratic tăng dần, không lộ lời giải.** `hintLevel` 1→3 (`clampHintLevel` tái dùng
      từ `feedbackPrompt.ts:89`), bậc sau chỉ mở khi đã có bậc trước trong cùng phiên; mọi bậc
      ≤ 3 KHÔNG chứa đáp án của `contentId` (STEM: `answer` của câu; Lập trình: không có code
      chép-dán được; Anh: không viết lại nguyên câu đúng khi `hintLevel < 3`). Bất biến đo bằng
      script `scripts/eval-lesson-tutor.ts` (khuôn `eval-code-feedback.ts`): ca vi phạm (lộ đáp
      án · không phải tiếng Việt với môn STEM/Lập trình · gợi ý không có dấu "?") → exit 1.
      Fixture ≥ 12 ca (4 mỗi môn), có ca "người học xin thẳng đáp án". **Cần key thật — là VIỆC
      TAY**, dán bảng kết quả vào PR; CI không chạy script này.
- [ ] **AC-10 Đếm lượt đúng luật hiện có, không thêm cột.** Server `checkAndConsumeActorUsage(actor,'chat',ip)`
      như `/api/agent` (`ai.ts:215`): tài khoản Free tính vào tổng 30 lượt/ngày (`pro_daily_limit`),
      VIP theo gói; **khách** đi đúng nhánh dùng thử sẵn có `GUEST_DAILY_TRIAL = 3`/ngày +
      `GUEST_IP_DAILY_TRIAL = 15` (`guestTrial.ts:24,27`) — không mở API private mới cho khách
      (spec nền §①), không nới hạn mức. Gọi AI lỗi → `refundActorUsage` như `ai.ts:244`. Test:
      429 trả `{ error, guestTrialExhausted }` đúng khuôn để UI hiện lời mời đăng ký (như
      `ai.ts:221`).
- [ ] **AC-11 Trả lời AI KHÔNG ghi completion/mastery/tiến độ.** Handler và client
      `lessonTutorApi.ts` không import `progress`, `guestProgress`, `saveLessonProgress`,
      `dailyLearningPlan`, `srs*`; `grep -rn "progress\|mastery\|completion"
apps/server/src/api/learning/lesson-tutor.ts apps/dhcb/src/lib/lessonTutorApi.ts
apps/dhcb/src/components/LessonTutorPanel.tsx` = 0 dòng (trừ chú thích). E2E: mở bài STEM,
      hỏi trợ giảng 3 lần (route mock) → mục lục S07 vẫn "chưa đo được"; bài Lập trình →
      `programming.lesson_progress` không đổi (kiểm qua `/api/programming/progress` mock không bị
      gọi POST). — `e2e/lesson-tutor.spec.ts` (mới).
- [ ] **AC-12 Panel trong màn học, tái dùng khung.** `apps/dhcb/src/components/LessonTutorPanel.tsx`
      (mới) đặt trong vùng nội dung bài của `StemLessonView`, `ProgrammingLessonPage` (thay thân
      `AiHelpPanel` — giữ 3 nút `review`/`socratic_hint`/`explain_error` gọi
      `/api/programming/feedback` như cũ, **không** gộp hai endpoint), `CefrLevelPage` (tab hội
      thoại/ngữ pháp). Nhận ngữ cảnh qua prop `LessonTutorContext` (§③.1) — nguồn: S08
      `LearningSession` nếu đã merge, không thì trang tự dựng từ `subjectId`/`courseId`/`contentId`
      (đúng các trường `OutlineNode` S07). Mobile < 1024px: panel là `Modal variant="sheet"` (S07
      §③.5) mở bằng nút ≥ 44px "Hỏi trợ giảng" cạnh tiêu đề; desktop: khối dưới nội dung bài.
      Test `LessonTutorPanel.test.tsx` ≥ 8 ca: rỗng/tải/trả lời/lỗi mạng/429 Free/429 khách
      (lời mời đăng ký)/AI không khả dụng (502/504)/nút bậc kế bị khoá khi chưa có bậc trước.
- [ ] **AC-13 Nhìn bằng mắt (Tầng 8b) + a11y.** Ảnh 1440/768/390/320 trước/sau của 3 trang có
      panel (bài Lí `ly10-c2-b10`, bài Lập trình `p1-u1-l1`, `/lo-trinh-hoc/a1` tab hội thoại),
      trạng thái rỗng + có 3 lượt hỏi + lỗi 429; 5 theme. `e2e/a11y.spec.ts` + `a11y-aaa.spec.ts`
      thêm route bài STEM có panel; `a11y-modals.spec.ts` thêm sheet trợ giảng; 0 vi phạm. Câu trả
      lời render qua **cùng bộ đọc markdown** `lessonMarkdown.ts` đã dùng cho Companion (#924),
      không `dangerouslySetInnerHTML` (grep = 0).

### Phần 3 — S10-3 voice thật trong bài

- [ ] **AC-14 Một hook lifecycle-đúng cho voice, dùng chung.** `apps/dhcb/src/lib/useLessonVoice.ts`
      (mới) gói `startRecording`/`isRecordingSupported` (`sttServer.ts`), fallback
      `startListening`/`isSTTSupported` (`stt.ts`), `speak`/`speakBilingual`/`stopSpeaking`
      (`tts.ts`), máy trạng thái `idle → recording → transcribing → thinking → speaking → idle`
      (cùng tên `CompanionVoiceState`), tự dừng ghi âm sau `MAX_REC_MS = 60_000` (khuôn
      `Speaking.tsx:618`), cleanup unmount: cancel recorder + `stopSpeaking()` + đặt cờ huỷ +
      abort request (AC-1/2/4 áp lại). `useLessonVoice.test.ts` ≥ 8 ca gồm: unmount ở từng trạng
      thái → 0 `speak`, tracks đã stop; hai lần bấm ghi liên tiếp → 1 recorder; StrictMode mount
      kép → 0 `getUserMedia` khi chưa bấm.
- [ ] **AC-15 Hai giọng cho môn Anh, một giọng cho STEM/Lập trình.** Môn Anh: câu trả lời tách
      `{ speech, feedback }` (khuôn `speakBilingual` hiện có: hội thoại giọng đích, sửa lỗi giọng
      mẹ đẻ theo `direction` A/B — `speakBilingual(speech, feedback, speechLang, feedbackLang,
voice, rate, …, feedbackVoice)` `tts.ts:717`); STEM/Lập trình: `speak(text, 'vi-VN')`. Không
      thêm giọng, không đổi `voiceTiers.ts`/`voiceAccess.ts` (2 nơi phải khớp tay — PROGRESS
      dòng 645). Test: panel môn Anh gọi `speakBilingual` đúng thứ tự tham số theo direction A
      và B (2 ca); STEM gọi `speak` với `'vi-VN'` (1 ca).
- [ ] **AC-16 STT trong bài đếm lượt đúng nơi đúng lúc.** Nhánh server (`/api/stt`, Whisper Groq/
      OpenAI, `checkAndConsumeActorUsage(actor,'stt')` `stt.ts:113`) là đường tốn tiền: client
      `incrementUsage(user.id,'sttCount')` **chỉ sau khi** `rec.stop()` resolve (kể cả rỗng), KHÔNG
      đếm khi `EMPTY_RECORDING`, KHÔNG đếm nhánh Web Speech (miễn phí) — đúng ba luật đã ghi ở
      `Speaking.tsx:704–716, 873–876`. Test hook 3 ca cho 3 luật.
- [ ] **AC-17 Khách được đọc/nghe đúng luật dùng thử, không hơn.** Sửa lỗi có thật: `tts.ts:470–471`
      `speakViaGoogle` ném "Chưa đăng nhập" khi không có token → khách **không bao giờ** tới
      `/api/tts` dù server đã nhận `X-Guest-Id` (`tts.ts` server dòng 55–56, spec khách dòng 26)
      và rơi thẳng Web Speech. Sửa: dùng `getAuthHeader()` (`authHeader.ts:43`, đã gửi
      `X-Guest-Id` khi không token) thay `getAccessToken()`; 429 `guestTrialExhausted` → fallback
      Web Speech + lời mời đăng ký, không lặp gọi. Test `tts.test.ts` thêm 2 ca; E2E khách trên
      bài STEM: bấm "Đọc" → request `/api/tts` có header `X-Guest-Id`.
- [ ] **AC-18 Trạng thái mic/quyền/mạng nói thật, không treo.** Mic bị từ chối → thông điệp
      "Không truy cập được micro…" + vẫn gõ tay được (khuôn `Speaking.tsx:859–863`); không có
      `MediaRecorder` lẫn Web Speech → ẩn nút mic, hiện ghi chú; offline (`navigator.onLine=false`
      hoặc fetch reject) → "Mất mạng" + giữ transcript đã có; `/api/stt` timeout 60s
      (`CLIENT_STT_TIMEOUT_MS`) → thông điệp sẵn có `sttServer.ts:108–110`. Mỗi ca 1 test hook +
      E2E `lesson-voice.spec.ts` (mới) chặn route: `page.route('**/api/stt')` trả 429/500/abort,
      `context.grantPermissions([])` để mô phỏng từ chối mic — **không gọi provider trả phí**.
- [ ] **AC-19 Rời trang giữa chừng ở MỌI trạng thái voice → im lặng và sạch.** E2E: bắt đầu ghi
      âm rồi `page.goto` trang khác → không còn `MediaStreamTrack` `live` (đo qua
      `page.evaluate` đếm track được stub); đang `speaking` rồi điều hướng → `audio.paused === true`
      trong ≤ 1 frame; đang `thinking` (route `/api/lesson-tutor` delay 3s) rồi điều hướng → 0
      request `/api/tts` sau khi rời. Ba ca trong `lesson-voice.spec.ts`.
- [ ] **AC-20 Ngân sách + coverage.** `npm run budget` sau `npm run build`: chunk trang bài STEM/
      Lập trình/CEFR tăng ≤ 8 kB gzip mỗi chunk so với `main` (dán số vào PR); `useLessonVoice` là
      import tĩnh nhẹ (chỉ hàm từ `tts.ts`/`sttServer.ts` đã nằm trong chunk chung); coverage
      không tụt dưới ngưỡng 97/93/96/97.

**Lệnh chứng minh (mỗi PR con, trên checkout sạch):**

```bash
npm ci && rm -rf packages/*/dist dist dist-server
npm run typecheck && npm run lint && npm run format && npm run build && npm run test:coverage
npm run budget
# S10-1
npx vitest run apps/dhcb/src/pages/companion apps/dhcb/src/lib/companionApi.test.ts \
  apps/dhcb/src/lib/tts.test.ts apps/dhcb/src/lib/sttServer.test.ts \
  apps/dhcb/src/components/programming/AiHelpPanel.test.tsx
npx playwright test e2e/companion-history.spec.ts e2e/programming-lesson.spec.ts e2e/a11y-companion-link.spec.ts
# S10-2
npx vitest run apps/server/src/api/learning/lesson-tutor.test.ts packages/core-learner/tutorPrompt.golden.test.ts \
  apps/dhcb/src/components/LessonTutorPanel.test.tsx
npx playwright test e2e/lesson-tutor.spec.ts e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts e2e/a11y-modals.spec.ts
npm run eval:lesson-tutor   # VIỆC TAY, cần key thật — dán bảng vào PR
# S10-3
npx vitest run apps/dhcb/src/lib/useLessonVoice.test.ts apps/dhcb/src/lib/tts.test.ts
npx playwright test e2e/lesson-voice.spec.ts e2e/mobile-layout-guards.spec.ts
```

## ① Phạm vi

**LÀM (theo PR con):**

**S10-1 — `fix(companion,tts,stt)`: sáu lỗi lifecycle §2.1, test đỏ trước.** Không đổi giao diện,
không đổi API, không đổi hạn mức. Có thể merge độc lập với S07/S08.

**S10-2 — `feat(learning)`: trợ giảng trong bài bằng chữ.**

1. `packages/core-contracts/lessonTutor.ts` — Zod `LessonTutorRequestSchema`/`LessonTutorResponseSchema`
   (§③.1), dùng chung server + client.
2. `packages/core-learner/tutorPrompt.ts` — `buildLessonTutorPrompt`, `TUTOR_GUARDRAIL`,
   `NO_SOLUTION_RULE` tái dùng nội dung từ `feedbackPrompt.ts` (không copy-paste: export chung một
   hằng nếu `subject-programming` → `core-learner` không tạo vòng; kiểm `npm run codemap -- cycles`).
3. `apps/server/src/api/learning/lesson-tutor.ts` + gắn route `app.all('/api/lesson-tutor', …)` ở
   `routes.ts` cạnh `/api/socratic-diagnostics` (dòng 337). Gọi AI qua `generateChatText`
   (`chatFallback.ts:22`, tham số `{system,userMessage,maxTokens,mode}`), `mode:'lesson_tutor'` chỉ
   là nhãn chi phí dashboard — cột đếm lượt là `'chat'`.
4. `apps/dhcb/src/lib/lessonTutorApi.ts` — `askLessonTutor(req, {signal})`, trả `Result` phân
   biệt `ok/limit/guestLimit/unavailable/network` (khuôn `programmingFeedback.ts:40–59` nhưng có
   `signal`).
5. `apps/dhcb/src/components/LessonTutorPanel.tsx` + test; gắn vào 3 trang (AC-12).
6. `scripts/eval-lesson-tutor.ts` + `scripts/eval-lesson-tutor-fixtures.json` + test canh fixture
   (khuôn `evalCodeFeedbackFixtures.test.ts`); script `"eval:lesson-tutor"` trong `package.json`.
7. E2E, ảnh, a11y, changelog, `PROGRESS.md`, goal dòng S10, `CLAUDE.md` §8 thêm một câu: "sửa
   `tutorPrompt.ts` PHẢI chạy `npm run eval:lesson-tutor`".

**S10-3 — `feat(learning)`: voice thật trong bài.**

8. `apps/dhcb/src/lib/useLessonVoice.ts` + test (AC-14); `LessonTutorPanel` thêm nút mic + nút
   "Đọc"; môn Anh trả `{speech, feedback}` (server tách hai phần theo dấu phân cách cố định trong
   prompt, validate Zod).
9. Sửa `tts.ts:470` sang `getAuthHeader()` (AC-17).
10. E2E `lesson-voice.spec.ts`, ảnh, changelog. Ghi "việc tay": chạy tay một lượt STT + TTS thật
    trên production sau deploy (không có key trong CI).

**KHÔNG LÀM (quan trọng ngang mục trên):**

- **KHÔNG Gemini Live / full-duplex / WebRTC / barge-in.** Server đang gắn
  `attachGeminiLiveWebSocketServer` (`server.ts:36`) + `/api/gemini-live` (`routes.ts:373`) nhưng
  **không còn client nào** trong `apps/dhcb/src` (grep `gemini-live|wsGeminiLive` = 0) và PROGRESS
  dòng 1090 ghi "CHƯA test với API key thật". Đó là **nợ riêng**, ghi lại ở PROGRESS, không kéo
  vào S10. Kỹ năng `multimodal-realtime-voice-master` §1 (≤ 250 ms, barge-in ≤ 50 ms) là mục tiêu
  của nợ đó, không phải AC của slice này. Voice S10 là pipeline **ghi âm xong → STT → LLM → TTS**
  như Companion/Speaking hiện có.
- **KHÔNG 3D viseme / avatar**; không đụng `Companion3D/`, `CompanionVoice/*` (13 file thẻ demo).
- **KHÔNG đổi prompt hay model môn Anh** (`apps/dhcb/src/prompts/*` 8 hàm export, golden snapshot
  14 ca; `aiConfig.ts`). Trợ giảng môn Anh trong S10 là **prompt mới, endpoint mới**, không chạm
  `callClaude`/`/api/agent`. Nếu lúc thi hành buộc phải sửa prompt cũ → AC bắt buộc thêm: chạy
  `npm run eval:tutor` và dán bảng so với baseline. **Lưu ý thật:** `docs/research/eval-tutor-baseline.md`
  mà `CLAUDE.md` §8 và `scripts/eval-tutor.ts:53` trỏ tới **không tồn tại** trên `7c2d81c`
  (`find docs -name "eval-tutor-baseline*"` = rỗng) — nợ ghi ở §8, không thuộc S10.
- **KHÔNG đổi billing/hạn mức**: không cột `daily_usage` mới, không đổi `GUEST_DAILY_TRIAL`,
  `pro_daily_limit`, `plan.ts`, `voiceAccess.ts`, `voiceTiers.ts`.
- **KHÔNG ghi completion/mastery/tiến độ/evidence** từ bất kỳ đường AI nào (S11 là chủ). Không
  thêm `evidenceSource` mới vào S07 outline.
- **KHÔNG gộp `/api/programming/feedback` vào `/api/lesson-tutor`** (khác luật: review chỉ mở khi
  `completed` server — `feedback.ts:87–102`; usage mode `'code_feedback'` riêng). Panel Lập trình
  chỉ **thay vỏ**, ba nút cũ gọi endpoint cũ.
- **KHÔNG viết lại `Speaking.tsx`** (1400 dòng, đã có `useMountedRef` ở 14 chỗ và cleanup đầy đủ
  dòng 641–649 — là mẫu để `useLessonVoice` học theo, không phải mục tiêu tái cấu trúc). Chuyển
  Companion sang `useLessonVoice` là tuỳ chọn ở §7 Q5.
- **KHÔNG thêm thư viện** (VAD, audio worklet, markdown, speech SDK).
- **KHÔNG test provider trả phí**: mọi test/E2E mock `/api/lesson-tutor`, `/api/stt`, `/api/tts`;
  `eval:lesson-tutor` là việc tay.

## ② Điểm chạm (đã khảo sát thật trên `7c2d81c`)

### 2.1 Bằng chứng sáu lỗi lifecycle (S10-1)

| #   | File:dòng                                                                                                    | Lỗi                                                                                                                                          | Cách sửa tối thiểu                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| L1  | `apps/dhcb/src/pages/companion/Companion.tsx:136–142, 337–345`                                               | Cleanup unmount không đặt `voiceCancelledRef=true` → `onDone` stream trễ gọi `speak()` ở trang kế; `setMessages`/`setVoiceState` sau unmount | Cleanup đặt cờ + abort controller; `onDone` kiểm cờ trước `speak`                   |
| L2  | `apps/dhcb/src/lib/companionApi.ts:72–77, 97`                                                                | `sendCompanionMessageStream` không nhận `signal`; `reader` không `cancel()` → stream chạy tới hết dù trang đã rời                            | Tham số thứ 3 `{signal}`, `signal.addEventListener('abort', () => reader.cancel())` |
| L3  | `apps/dhcb/src/pages/companion/Companion.tsx:77–81`                                                          | `fetchProactiveAgentState()` không abort → StrictMode 2 lượt, setState sau unmount (đúng họ lỗi #925 đã sửa cho lịch sử ở dòng 96–128)       | Khuôn `AbortController` như effect lịch sử                                          |
| L4  | `apps/dhcb/src/lib/tts.ts:553–556` (+ fetch không signal 474)                                                | `speakViaGoogle` chốt `myPlayToken` SAU `await ensureAudioWithTimeline` → `stopSpeaking()` trong lúc tải bị vô hiệu, audio phát ở trang kế   | Chốt vé trước await; sau await `if (playToken !== vé) return vé`                    |
| L5  | `apps/dhcb/src/lib/sttServer.ts:35–38`                                                                       | `new MediaRecorder(stream)` ném → không `getTracks().stop()` → mic mở vô hạn                                                                 | `try { rec = new MediaRecorder } catch (e) { cleanup(); throw e }`                  |
| L6  | `apps/dhcb/src/components/programming/AiHelpPanel.tsx:37–58`; `ProgrammingLessonPage.tsx:392`; `App.tsx:521` | Không `mountedRef`/abort; `ask` chốt `lessonId` trong closure; trang cùng instance khi đổi `:lessonId` → state/response rò giữa bài          | `key={lesson.id}` + ref `lessonId` so khớp khi response về + `useMountedRef`        |

Mẫu ĐÚNG để đối chiếu (không sửa): `Speaking.tsx:641–649` cleanup đủ 5 việc; `Chat.tsx:504–585`
`useMountedRef` trước mọi setState sau `await`; `useChat.ts:253–262` đóng WebSocket + clear timer;
`useRolePlay.ts:259–263` cancel recorder.

### 2.2 Bảng điểm chạm

| PR  | Việc | Đường dẫn file                                                                                | Ghi chú khảo sát                                                                                                                       |
| --- | ---- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Sửa  | `apps/dhcb/src/pages/companion/Companion.tsx` (630 dòng)                                      | L1, L3. Không có test unit nào cho trang này (ls `pages/companion/*.test.tsx` = rỗng) — thêm `Companion.voice.test.tsx`                |
| 1   | Sửa  | `apps/dhcb/src/lib/companionApi.ts` (267 dòng) + `companionApi.test.ts` (9 ca)                | L2                                                                                                                                     |
| 1   | Sửa  | `apps/dhcb/src/lib/tts.ts` (736 dòng) + `tts.test.ts` (69 ca)                                 | L4. **Hotspot: 64 file bị ảnh hưởng** (codemap) — chỉ sửa bên trong `speakViaGoogle`, không đổi chữ ký export                          |
| 1   | Sửa  | `apps/dhcb/src/lib/sttServer.ts` (154 dòng) + `sttServer.test.ts` (MỚI)                       | L5. 9 file ảnh hưởng: Companion, Speaking, useRolePlay, CefrLessonViews…                                                               |
| 1   | Sửa  | `apps/dhcb/src/components/programming/AiHelpPanel.tsx` (133 dòng) + test MỚI                  | L6. 3 file ảnh hưởng                                                                                                                   |
| 1   | Sửa  | `apps/dhcb/src/pages/subjects/programming/ProgrammingLessonPage.tsx:392`                      | thêm `key={lesson.id}`                                                                                                                 |
| 2   | Thêm | `packages/core-contracts/lessonTutor.ts` (+ test)                                             | Cạnh `stemScratchpad.ts`, `outline.ts` (S07)                                                                                           |
| 2   | Thêm | `packages/core-learner/tutorPrompt.ts` (+ golden test)                                        | Gói phẳng, thêm file là hợp lệ (S07 §②)                                                                                                |
| 2   | Sửa  | `packages/subject-programming/feedbackPrompt.ts`                                              | Chỉ export thêm hằng `NO_SOLUTION_RULE`/`INJECTION_GUARD` nếu chưa export — golden `eval:code-feedback` không đổi kết quả              |
| 2   | Thêm | `apps/server/src/api/learning/lesson-tutor.ts` (+ test) · sửa `apps/server/src/routes.ts`     | Khuôn `feedback.ts` (rate limit 60/phút/IP, `readJsonBody` + `validateBody`); actor qua `resolveActor` như `ai.ts:152`                 |
| 2   | Thêm | `apps/dhcb/src/lib/lessonTutorApi.ts` (+ test)                                                | Dùng `getAuthHeader()` (đã gửi `X-Guest-Id`)                                                                                           |
| 2   | Thêm | `apps/dhcb/src/components/LessonTutorPanel.tsx` (+ test)                                      | Render markdown qua `lessonMarkdown.ts`; sheet mobile qua `Modal variant="sheet"` (S07 §③.5 — nếu S07-2 chưa merge thì `Modal` thường) |
| 2   | Sửa  | `apps/dhcb/src/pages/learning/StemLessonView.tsx` (238 dòng)                                  | Hiện **0 AI** (chú thích dòng 6–10: "KHÔNG có AI trong luồng phán đúng/sai") — panel đặt DƯỚI khối chấm, không chạm `gradeAnswer`      |
| 2   | Sửa  | `apps/dhcb/src/pages/subjects/english/CefrLevelPage.tsx` (1229 dòng)                          | Chỉ thêm panel vào tab hội thoại/ngữ pháp; 5 tab và `?tab=`/`?cap=` không đổi                                                          |
| 2   | Thêm | `scripts/eval-lesson-tutor.ts`, `scripts/eval-lesson-tutor-fixtures.json`, test canh          | `package.json` thêm script                                                                                                             |
| 2   | Thêm | `e2e/lesson-tutor.spec.ts`; sửa `e2e/a11y.spec.ts`, `a11y-aaa.spec.ts`, `a11y-modals.spec.ts` |                                                                                                                                        |
| 3   | Thêm | `apps/dhcb/src/lib/useLessonVoice.ts` (+ test)                                                |                                                                                                                                        |
| 3   | Sửa  | `apps/dhcb/src/lib/tts.ts:470`                                                                | `getAccessToken` → `getAuthHeader`; giữ thông điệp lỗi cũ cho ca không token **và** không guest id                                     |
| 3   | Sửa  | `LessonTutorPanel.tsx`, `lesson-tutor.ts` (tách `{speech,feedback}` môn Anh)                  |                                                                                                                                        |
| 3   | Thêm | `e2e/lesson-voice.spec.ts`                                                                    |                                                                                                                                        |

**Ảnh hưởng lan ra (đo `npm run codemap -- impact`, 2026-09-15 trên `7c2d81c`):**

- `apps/dhcb/src/lib/tts.ts` → **64 file**. Rủi ro cao nhất của S10-1; sửa chỉ trong thân
  `speakViaGoogle`, 69 ca `tts.test.ts` + `WordFormsBlock.test.tsx`, `srsPreloader.test.ts`,
  `examParts.test.ts` (đều nằm trong 64) phải xanh nguyên.
- `apps/dhcb/src/lib/ai.ts` → **34 file** — **không sửa** (S10 không đụng `callClaude`).
- `apps/dhcb/src/lib/sttServer.ts` → 9 file · `companionApi.ts` → 4 · `AiHelpPanel.tsx` → 3 ·
  `programmingFeedback.ts` → 5 · `Companion.tsx` → 2 (`App.tsx`, `main.tsx`).
- `apps/server/src/routes.ts`: thêm 1 dòng route; CI boot check `/api/health` canh.
- `StemLessonView.tsx`, `CefrLevelPage.tsx`, `ProgrammingLessonPage.tsx` là 3 trang S07-2/S07-3
  cũng sửa → **S10-2 chỉ bắt đầu sau S07-2 merge** để không xung đột (§7 Q1).

## ③ Hợp đồng

### 3.1 Kiểu dùng chung (`packages/core-contracts/lessonTutor.ts`)

```ts
import { z } from 'zod'

export const LessonTutorSubjectSchema = z.enum([
  'programming',
  'mathematics',
  'physics',
  'chemistry',
  'biology',
  'english',
])

// Ngữ cảnh bài — CÙNG các trường của OutlineNode (S07 §③.1); S08 LearningSession (khi có) chỉ
// cần map sang đây. Không có trường nào là "tiến độ" — panel không được biết và không được ghi.
export const LessonTutorContextSchema = z.object({
  subjectId: LessonTutorSubjectSchema,
  courseId: z.string().max(64).optional(), // khoá ngắn Lập trình (`?khoa=`)
  contentId: z.string().min(1).max(128), // lessonId / circleId / grammarId — server tra chỉ mục, không tin title từ client
  step: z.string().max(64).optional(), // 'worked-example' | 'exercise' | 'quiz:3' | 'dialogue:2' — chuỗi tự do có trần
  learnerAnswer: z.string().max(2000).optional(), // đáp án/câu vừa nhập; 2000 khớp companion.ts:25
  direction: z.enum(['A', 'B']).optional(), // chỉ môn Anh
})

export const LessonTutorRequestSchema = z.object({
  context: LessonTutorContextSchema,
  question: z.string().min(1).max(2000),
  hintLevel: z.number().int().min(1).max(3).optional(), // clampHintLevel; vắng = 1
  sessionTurns: z
    .array(z.object({ role: z.enum(['learner', 'tutor']), text: z.string().max(2000) }))
    .max(6)
    .optional(), // 3 lượt gần nhất để bậc sau nối bậc trước
})

export const LessonTutorResponseSchema = z.object({
  text: z.string().min(1), // markdown tối giản (lessonMarkdown.ts đọc được); môn STEM/Lập trình: tiếng Việt
  hintLevel: z.number().int().min(1).max(3),
  // S10-3, chỉ môn Anh: hai phần để đọc bằng hai giọng. Vắng = đọc `text` bằng 'vi-VN'.
  voice: z.object({ speech: z.string(), feedback: z.string() }).optional(),
  model: z.string().optional(), // tên model đã dùng — để admin dashboard, không hiện cho người học
})
export type LessonTutorContext = z.infer<typeof LessonTutorContextSchema>
export type LessonTutorRequest = z.infer<typeof LessonTutorRequestSchema>
export type LessonTutorResponse = z.infer<typeof LessonTutorResponseSchema>
```

Server tra `contentId` theo `subjectId`: Lập trình `getLesson(id)` (`@dhcb/subject-programming/lessons`
— registry server-only, như `feedback.ts:27`); STEM `STEM_SUBJECTS[id].loader.loadLesson(id)` để lấy
đề + `answer` (đưa `answer` vào prompt trong khối "ĐÁP ÁN — KHÔNG ĐƯỢC NÓI RA", cùng cách
`feedbackPrompt.ts` giấu test-case); Anh: `cefr.json`/`foundation` theo `circleId`/`grammarId`.
Không tìm thấy → 400, không gọi AI.

### 3.2 Client (`apps/dhcb/src/lib/lessonTutorApi.ts`)

```ts
export type LessonTutorResult =
  | { ok: true; data: LessonTutorResponse }
  | { ok: false; kind: 'limit'; message: string } // 429 tài khoản: hết 30 lượt/ngày (Free) hoặc gói
  | { ok: false; kind: 'guestLimit'; message: string } // 429 + guestTrialExhausted → lời mời đăng ký
  | { ok: false; kind: 'unavailable'; message: string } // 500 chưa cấu hình key · 502 · 504 timeout
  | { ok: false; kind: 'invalid'; message: string } // 400
  | { ok: false; kind: 'network'; message: string } // fetch reject / offline
  | { ok: false; kind: 'aborted' } // signal — panel im lặng, không toast
export function askLessonTutor(
  req: LessonTutorRequest,
  opts?: { signal?: AbortSignal },
): Promise<LessonTutorResult>
```

### 3.3 Hook voice (`apps/dhcb/src/lib/useLessonVoice.ts`, S10-3)

```ts
export type LessonVoiceState = 'idle' | 'recording' | 'transcribing' | 'thinking' | 'speaking'
export interface UseLessonVoice {
  state: LessonVoiceState
  error: string | null // thông điệp đã dịch theo direction; null khi không lỗi
  supported: { record: boolean; webSpeech: boolean; tts: boolean }
  startRecording(): Promise<void> // idle → recording; lỗi quyền → error, state idle
  stopRecording(): Promise<string> // recording → transcribing → trả transcript ('' nếu rỗng); tự đếm sttCount đúng luật AC-16
  cancel(): void // mọi trạng thái → idle; cancel recorder, stopSpeaking, abort request, cờ huỷ
  speak(payload: { text: string } | { speech: string; feedback: string }): Promise<void> // → speaking → idle
}
export function useLessonVoice(opts: {
  lang: 'en' | 'vi'
  direction?: 'A' | 'B'
  userId?: string
}): UseLessonVoice
```

Cleanup unmount = `cancel()`. Hook **không** gọi `/api/lesson-tutor` — panel gọi, rồi đưa kết quả
vào `speak()`; vì thế "thinking" là trạng thái panel truyền vào (`setThinking`), giữ hook thuần
audio.

### 3.4 Ca lỗi (là hợp đồng)

| Tình huống                                            | Mã/trạng thái                             | Hành vi mong đợi                                                                                                                       |
| ----------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Free hết 30 lượt/ngày; VIP hết gói                    | 429 `{error}`                             | Panel hiện đúng `gate.message` server, nút hỏi disabled tới ngày mới; nội dung bài + ô nhập giữ nguyên; không retry tự động            |
| Khách hết `GUEST_DAILY_TRIAL` (3) hoặc IP hết 15      | 429 `{error, guestTrialExhausted:true}`   | Lời mời đăng ký (CTA Login) + giữ câu hỏi trong ô (nháp memory, không gửi tự động sau login — luật S02)                                |
| Server chưa cấu hình key / provider lỗi / timeout 30s | 500 / 502 / 504                           | "Trợ giảng tạm không khả dụng" + nút "Thử lại" (do người dùng bấm); server đã `refundActorUsage`; **không** hứa AI luôn trả lời        |
| `contentId` lạ hoặc body sai                          | 400                                       | Panel báo lỗi kỹ thuật ngắn, log console 1 dòng; không trừ lượt (kiểm trước gate)                                                      |
| Rời trang khi request đang bay                        | `aborted`                                 | Im lặng; không toast; lượt đã trừ **không hoàn** (server không biết client rời) — ghi chú "mỗi lần hỏi tiêu 1 lượt" như AiHelpPanel    |
| Đổi bài (S07 mục lục) khi request đang bay            | `aborted` + reset                         | Abort lượt cũ, panel về rỗng, `hintLevel` về 1, `sessionTurns` rỗng; response trễ bị bỏ (so `contentId`)                               |
| Mic bị từ chối / không có thiết bị                    | `error` hook                              | Thông điệp `sttErrorMessage` khuôn `Speaking.tsx:69–84`; nút mic vẫn hiện để thử lại; ô gõ tay luôn có                                 |
| Không `MediaRecorder` và không Web Speech             | `supported.record=false, webSpeech=false` | Ẩn nút mic; dòng ghi chú "Trình duyệt này không hỗ trợ ghi âm"                                                                         |
| Offline lúc bấm hỏi/đọc/ghi                           | `network`                                 | "Mất kết nối — kiểm tra mạng rồi thử lại"; transcript/câu hỏi giữ nguyên; TTS fallback Web Speech (đã có sẵn ở `speak`)                |
| `/api/tts` 429 cho khách                              | fallback                                  | Web Speech + lời mời đăng ký, không gọi lại `/api/tts` trong phiên                                                                     |
| `/api/stt` quá 60s                                    | throw `sttServer.ts:108`                  | Thông điệp sẵn có; state về idle; đã đếm 0 lượt (request không thành công)                                                             |
| Người học xin thẳng đáp án ("cho tôi đáp án")         | 200                                       | Bậc hiện tại trả gợi ý + câu hỏi, không lộ; **AI không phải authority** — panel luôn có dòng "Trợ giảng có thể sai; đối chiếu với bài" |
| StrictMode mount kép                                  | —                                         | 0 request AI, 0 `getUserMedia`, 0 `speak` khi chưa có thao tác người dùng                                                              |

## ⑤ Bất biến không được phá

| Bất biến                                                                                           | Test canh                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI không ghi completion/mastery/tiến độ/evidence (spec nền §⑤; goal risk "AI trở thành authority") | AC-11 grep = 0 + E2E `lesson-tutor.spec.ts`; `apps/server/src/api/core/progress.test.ts`, `programming/progress.test.ts`, `dailyLearningPlan.test.ts` giữ nguyên |
| Mọi lệnh gọi AI/STT/TTS đếm lượt ở SERVER; Free = 30/ngày tổng; khách = 3/ngày + 15/IP             | `lesson-tutor.test.ts` ca 429; `packages/core-auth/guestTrial.test.ts`, `guest.test.ts`; `packages/core-billing/usage.test.ts` không đổi                         |
| Không mở API private cho khách; Companion và `/api/programming/feedback` vẫn `validateAuth`        | `companion.ts:44`, `feedback.ts:67` không sửa; test 401 hiện có                                                                                                  |
| Không lộ lời giải; gợi ý tiếng Việt (STEM/LT); có câu hỏi                                          | `eval:lesson-tutor` (việc tay, exit 1 khi vi phạm) + golden `tutorPrompt.golden.test.ts` (CI)                                                                    |
| Prompt môn Anh + model không đổi                                                                   | `apps/dhcb/src/prompts/golden.test.ts` (14 ca, snapshot không đổi); `aiConfig.ts` không trong diff                                                               |
| `speakBilingual` thứ tự đích → mẹ đẻ; `stopSpeaking` huỷ cả phần sau                               | `tts.test.ts` 69 ca + ≥ 4 ca mới                                                                                                                                 |
| Web Speech không đếm lượt; `EMPTY_RECORDING` không đếm; server STT đếm 1 kể cả rỗng                | AC-16 3 ca hook; `Speaking.tsx` không sửa                                                                                                                        |
| Rời trang = im lặng, mic nhả, request huỷ, không setState sau unmount                              | AC-1/3/4/5/19; mọi test unit mới chạy dưới `<StrictMode>`                                                                                                        |
| Không `dangerouslySetInnerHTML`; markdown qua `lessonMarkdown.ts`                                  | `grep -rn dangerouslySetInnerHTML apps packages` = 0 (#924); `lessonMarkdown.test.ts`                                                                            |
| A11y AA (điều khiển) + AAA (nội dung) 5 theme; vùng chạm ≥ 44px; mobile không bị bottom-nav che    | `e2e/a11y.spec.ts`, `a11y-aaa.spec.ts`, `a11y-modals.spec.ts`, `mobile-layout-guards.spec.ts`                                                                    |
| Ngân sách bundle/coverage                                                                          | `npm run budget`; `npm run test:coverage` 97/93/96/97                                                                                                            |
| `tts.ts` 64 file phụ thuộc không đổi hành vi ngoài ca stop-giữa-lúc-tải                            | 3 test gián tiếp trong 64 file + E2E Speaking/Listening hiện có                                                                                                  |

## ⑥ Quy ước dự án liên quan (bên thi hành không thấy hội thoại)

- Import xuyên gói `@dhcb/<gói>/<file>` không đuôi `.js`; nội bộ gói đường tương đối có `.js`;
  `packages/` không import `apps/`, không import `api/`. Prompt dựng ở **server/packages**, client
  chỉ gửi id + dữ liệu người học (lý do ở `feedbackPrompt.ts:7–16`).
- Handler API: `getCorsHeaders` + `SECURITY_HEADERS`, `checkRateLimit(ip, 60, '<tên>')`,
  `readJsonBody` → `validateBody(Schema)`, `jsonResponse`; actor qua `resolveActor` (khách) hoặc
  `validateAuth` (tài khoản) — S10 dùng `resolveActor` như `/api/agent`; gọi AI lỗi →
  `refundActorUsage`; timeout `AI_TIMEOUT_MS = 30_000` → 504, lỗi provider → 502 (`ai.ts:400`).
- Khuôn effect fetch-khi-mount: `AbortController` trong effect, abort ở cleanup, gộp lũy đẳng
  theo id (chú thích `Companion.tsx:86–95`, #925). **Không** dùng ref "đã chạy" để chống StrictMode.
- Sau `await` trong handler: đọc state qua ref (`loadingRef`), kiểm `mountedRef.current` trước
  setState (`Chat.tsx:504`).
- Chữ nội dung AAA ≥ 7:1, nút AA; token `--a-*`/`--z-*`; trạng thái phải có CHỮ; `tap-44`;
  `text-[#fff]` trên nền cố định tối. Responsive bằng `useIsDesktopViewport`, không `lg:hidden`
  (bất biến `TwoPane.tsx`).
- Đổi UI → ảnh 1440/768/390/320 trước/sau (QUY-TRINH-AUDIT Tầng 8b) dán vào PR.
- Test đỏ TRƯỚC khi sửa file hotspot (`tts.ts` 64 file). Cổng trên checkout sạch, `npm ci` trước
  lần chạy đầu; cổng test CI là `test:coverage`.
- PR: S10-1 `fix(companion): ...` (không cần spec path); S10-2/S10-3 `feat(learning): ...` mô tả
  dẫn file này + "Approved for implementation"; đủ 6 tiêu đề cổng `metadata`; READY; auto-merge
  (squash) ngay sau tạo; CI đỏ là việc của PR. Mỗi PR một changelog `docs/changelog/03xx-*.md`,
  `PROGRESS.md` chỉ khi trạng thái đổi.
- Sửa `packages/subject-programming/feedbackPrompt.ts` (dù chỉ export thêm) → chạy
  `npm run eval:code-feedback` và dán kết quả (CLAUDE.md §8).

## 7. Quyết định cần chủ dự án chốt trước khi Approved

> **CHỐT 2026-09-15 — chủ dự án:** lấy TOÀN BỘ cột "Đề xuất của AI (mặc định)"
> làm quyết định cuối cho mọi câu hỏi trong bảng dưới. Không có ý kiến khác.

| #   | Câu hỏi                                                                                                                                           | Đề xuất của AI (mặc định nếu không phản hồi)                                                                                                                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | S08 (`LearningSession`) **chưa có spec**. S10-2 chờ S08 hay nhận ngữ cảnh qua prop từ trang?                                                      | **S10-1 làm ngay, không chờ ai.** S10-2/3 nhận `LessonTutorContext` qua prop (trang tự dựng từ `subjectId`/`courseId`/`contentId` — các trường S07 đã chốt); khi S08 có, chỉ đổi nguồn prop. S10-2 chờ **S07-2 merge** vì cùng sửa 3 trang bài.                                   |
| Q2  | Khách có được hỏi trợ giảng trong bài không?                                                                                                      | **Có, đúng nhánh dùng thử sẵn có** (`resolveActor` + 3 lượt/ngày + 15/IP) — cùng luật `/api/agent`, không mở API private mới, không nới hạn mức. Từ chối → CTA đăng ký. Nếu chủ dự án muốn "tài khoản mới được hỏi" thì đổi `resolveActor` → `validateAuth`, AC-10 đổi tương ứng. |
| Q3  | Lượt trợ giảng tính vào cột `'chat'` (tổng 30/ngày Free) hay thêm cột `daily_usage` mới?                                                          | **Cột `'chat'`.** Không migration, đúng luật "30 lượt/ngày TỔNG mọi tính năng" (CLAUDE.md §6). Nhãn `mode:'lesson_tutor'` chỉ để tách chi phí ở dashboard admin.                                                                                                                  |
| Q4  | Panel Lập trình: thay `AiHelpPanel` bằng `LessonTutorPanel` (vỏ chung, 3 nút cũ vẫn gọi `/api/programming/feedback`) hay giữ hai panel cạnh nhau? | **Một vỏ chung**, hai endpoint bên dưới. Hai panel cạnh nhau là hai chỗ hỏi AI cùng một bài — người học không phân biệt được và tốn gấp đôi lượt.                                                                                                                                 |
| Q5  | Companion voice (`Companion.tsx` dòng 130–200) có chuyển sang `useLessonVoice` trong S10-3 không?                                                 | **Không trong S10-3** (giữ diff nhỏ, Companion đã được S10-1 vá). Ghi nợ "gộp hai máy trạng thái voice" vào PROGRESS; làm khi có slice Companion riêng.                                                                                                                           |

## 8. Rủi ro và giảm thiểu

| Rủi ro                                                                                                            | Giảm thiểu                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tts.ts` là hotspot 64 file; sửa L4 làm lệch ca "bấm loa thứ hai trước khi câu đầu phát xong" (chú thích 560–571) | Test đỏ trước; giữ nguyên nhánh `currentResolve?.()`; chỉ thêm kiểm vé sau await; chạy đủ 69 ca + E2E Speaking/Listening                                                                                                          |
| `key={lesson.id}` ở `AiHelpPanel` (L6) làm mất text gợi ý khi người học chỉ chạy lại code cùng bài                | `key` theo `lesson.id`, không theo `code`/`results`; test ca "cùng bài, đổi code → giữ level"                                                                                                                                     |
| AI vẫn lộ đáp án dù prompt cấm (LLM không tất định)                                                               | `eval:lesson-tutor` có ca "xin thẳng đáp án" và so chuỗi `answer` STEM trong output → exit 1; UI ghi "có thể sai"; server có thể lọc thô: nếu output chứa nguyên `answer` → thay bằng gợi ý bậc 1 (quyết trong PR, ghi changelog) |
| `eval-tutor-baseline.md` không tồn tại → không có cách chứng minh "không tụt" nếu lỡ chạm prompt Anh              | S10 **không** chạm prompt Anh (§① KHÔNG LÀM); ghi nợ tạo baseline (`npm run eval:tutor -- --write-baseline`, cần key) vào PROGRESS                                                                                                |
| Khách dùng trợ giảng làm tăng chi phí AI                                                                          | Cùng kho 3 lượt/ngày với `/api/agent`/`/api/stt` (`checkAndConsumeActorUsage` chung actor) — không phải kho mới                                                                                                                   |
| Gemini Live server code "mồ côi" gây nhầm khi review S10-3                                                        | §① ghi rõ là nợ riêng; không xoá trong S10 (xoá là quyết định riêng: `attachGeminiLiveWebSocketServer` đang chạy thật trên production)                                                                                            |
| Mobile: panel sheet + bàn phím ảo iOS che nút gửi                                                                 | Tái dùng `useVisualViewportHeight` (`Speaking.tsx`), `mobile-layout-guards.spec.ts` thêm route bài STEM có panel mở                                                                                                               |
| Coverage tụt vì nhiều nhánh lỗi UI                                                                                | Hook/API thuần test 100%; panel ≥ 8 ca; `npm run budget` trước push                                                                                                                                                               |
| E2E giả lập mic không ổn định (flaky — QUY-TRINH-AUDIT Tầng 1b)                                                   | Stub `navigator.mediaDevices.getUserMedia` + `MediaRecorder` bằng `page.addInitScript` (không dùng `--use-fake-device-for-media-stream`); chạy 3 lượt trước khi merge                                                             |

## 9. Kế hoạch thi hành (3 PR, tuần tự; mỗi PR một subagent, agent chính review)

1. **S10-1 `fix(companion): roi trang la im — huy stream, nha mic, chan TTS phat muon`** — sáu lỗi
   §2.1, 5 file test (2 mới), 0 thay đổi giao diện/API/hạn mức. Có thể merge trước S07. Changelog
   ghi bảng "test đỏ trước/xanh sau" từng lỗi.
2. **S10-2 `feat(learning): tro giang trong bai — Socratic, dem luot, khong ghi tien do`** — sau
   S07-2 merge (Q1). Contract + prompt + endpoint + client + panel + 3 trang + eval script + E2E +
   ảnh + a11y. Việc tay: chạy `eval:lesson-tutor` với key thật, dán bảng.
3. **S10-3 `feat(learning): voice that trong bai — hai giong mon Anh, STT co dem luot`** —
   `useLessonVoice` + sửa `tts.ts:470` + panel mic/đọc + E2E. Việc tay: một lượt STT + TTS thật
   trên production sau deploy, ghi kết quả vào changelog.
4. Mỗi PR: changelog `docs/changelog/03xx-*.md`, `PROGRESS.md` (bảng slice + nợ mới: Gemini Live
   mồ côi client · `eval-tutor-baseline.md` chưa có · gộp máy trạng thái voice Companion), goal
   bảng S10 (Issue/PR/State/Evidence), đổi trạng thái ở spec này.

**Rollback:** revert PR tương ứng; không migration/schema/cột mới. S10-1 chỉ đổi hành vi huỷ —
revert không mất dữ liệu. S10-2 thêm route mới — revert là route biến mất, client cũ (nếu còn cache)
nhận 404 và panel hiện "không khả dụng" (ca lỗi §③.4). S10-3 không lưu gì ngoài `sttCount`
cục bộ đã có.

## 19. Phê duyệt

- [x] Product outcome và scope (Q1–Q5)
- [x] UX/accessibility (panel trong bài, sheet mobile, trạng thái mic/lỗi có chữ)
- [x] Architecture (contract Zod dùng chung, prompt ở server, actor/hạn mức tái dùng, hook voice)
- [x] Test/rollout/rollback (3 PR; eval là việc tay; không provider trả phí trong CI)

**Kết luận:** Approved for implementation  
**Người duyệt:** Chủ dự án  
**Ngày:** 2026-09-15
