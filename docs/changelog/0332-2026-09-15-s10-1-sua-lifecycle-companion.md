# 0332 — 2026-09-15 — S10-1: rời trang là im — huỷ stream, nhả mic, chặn TTS phát muộn

**PR:** #(điền khi tạo) · **Loại:** `fix`, không đổi giao diện, không đổi API công khai, không
đổi hạn mức, không schema/migration.

Đặc tả: `docs/specs/2026-09-15-learning-ux-s10-tro-giang-trong-bai-voice.md` §④ Phần 1
(AC-1…AC-6) và §2.1 (bảng sáu lỗi L1–L6 kèm file:dòng). Đây là **PR con thứ nhất trong ba** của
slice S10; S10-2 (trợ giảng bằng chữ) và S10-3 (voice trong bài) là PR riêng, chưa làm ở đây.

## Vì sao phải sửa trước khi làm trợ giảng

Slice S10 sắp gắn thêm một chỗ gọi AI + TTS + micro nữa (panel trợ giảng trong bài). Sáu lỗi
vòng đời dưới đây đều thuộc loại "rời trang rồi mà thứ cũ vẫn chạy" — thêm tính năng lên trên
một nền như vậy là nhân đôi số chỗ hỏng. Triệu chứng nặng nhất người học gặp được: **rời trang
Bạn Đồng Hành giữa lúc AI đang trả lời thì AI cất tiếng ở trang kế**, giữa một màn hình chẳng
liên quan.

## Test đỏ TRƯỚC / xanh SAU (viết test trước, chứng minh đỏ trên mã cũ, rồi mới sửa)

| Lỗi    | Triệu chứng người dùng gặp                                                       | Test canh (ca đỏ trên mã cũ)                                                                                                    | Trước                 | Sau      |
| ------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------- |
| **L1** | Rời trang giữa lúc AI đang nói → AI cất tiếng ở trang kế                         | `Companion.voice.test.tsx` — "onDone của stream về SAU khi đã rời trang → speak() 0 lần"                                        | ❌ `speak` 1 lần      | ✅ 0 lần |
| **L2** | Stream SSE chạy tới hết dù trang đã rời (không huỷ được, callback vẫn bắn)       | `companionApi.test.ts` — "abort TRƯỚC done → reject AbortError, onDone không gọi" + "abort SAU done → kết quả không đổi"        | ❌ 1 ca đỏ            | ✅ 2/2   |
| **L2** | (phía trang) lượt gửi không có controller để huỷ                                 | `Companion.voice.test.tsx` — "lượt gửi có AbortSignal và signal bị abort khi rời trang"                                         | ❌ `signal` undefined | ✅ xanh  |
| **L3** | StrictMode gọi `fetchProactiveAgentState` hai lượt, lượt cũ setState sau unmount | `Companion.voice.test.tsx` — "fetchProactiveAgentState nhận signal; StrictMode huỷ lượt một, rời trang huỷ hết"                 | ❌ `signal` undefined | ✅ xanh  |
| **L4** | Bấm Tắt tiếng / rời trang **trong lúc audio còn đang tải** → audio vẫn nổ sau đó | `tts.test.ts` — "stop giữa lúc tải → audio.play() 0 lần, promise vẫn resolve" + "stop SAU khi phát xong → hành vi cũ không đổi" | ❌ `play` 1 lần       | ✅ 0 lần |
| **L5** | `new MediaRecorder()` ném → micro không bao giờ được nhả, đèn mic sáng vô hạn    | `sttServer.test.ts` (**file MỚI**) — "constructor NÉM → mọi track được stop đúng 1 lần"                                         | ❌ 0 lần stop         | ✅ 1 lần |
| **L6** | Gợi ý + bậc gợi ý của bài A còn nguyên khi đã sang bài B                         | `AiHelpPanel.test.tsx` (**file MỚI**) — "đổi lessonId → bậc gợi ý về 1, trả lời bài cũ biến mất"                                | ❌ còn nguyên         | ✅ xanh  |
| **L6** | Response trễ của bài A đổ vào màn hình bài B                                     | `AiHelpPanel.test.tsx` — "response TRỄ của bài cũ → bị bỏ"                                                                      | ❌ đổ vào             | ✅ bị bỏ |

**Tổng: 8 ca đỏ trước khi sửa → 8/8 xanh sau khi sửa.** Ngoài ra mọi ca cũ của các file bị
chạm đều giữ nguyên xanh: `companionApi.test.ts` 9/9 cũ, `tts.test.ts` 69/69 cũ (`tts.ts` là
hotspot 64 file phụ thuộc — xem §8 của đặc tả), `programmingFeedback.test.ts` 7/7.

Cách tái hiện màu đỏ: `git checkout origin/main -- <file nguồn>` rồi chạy test tương ứng.

## Đã sửa gì

- **`apps/dhcb/src/lib/companionApi.ts`** — `sendCompanionMessageStream(params, callbacks, {signal})`
  nhận tham số thứ ba tuỳ chọn: truyền `signal` xuống `fetch`, gọi `reader.cancel()` khi abort,
  và kiểm cờ huỷ **ngay sau mỗi lượt `reader.read()`, trước mọi callback** rồi ném lỗi
  `name === 'AbortError'`. Tham số là tuỳ chọn nên mọi nơi gọi cũ không đổi.
- **`apps/dhcb/src/pages/companion/Companion.tsx`** — cleanup unmount nay làm đủ: đặt cờ huỷ
  giọng nói, `abort()` lượt gửi đang bay, nhả recorder, `stopSpeaking()`. `handleSend` giữ một
  `AbortController` cho lượt hiện tại; `onDone` bỏ qua khi signal đã abort; `catch` im lặng với
  `AbortError` (rời trang không phải lỗi, không toast); `finally` không `setLoading` sau unmount.
  Effect `fetchProactiveAgentState` chuyển sang khuôn `AbortController` giống effect lịch sử.
- **`apps/dhcb/src/lib/proactiveAgentApi.ts`** — `fetchProactiveAgentState(params?, {signal}?)`.
- **`apps/dhcb/src/lib/tts.ts`** — trong `speakViaGoogle`, chốt "vé" `playToken` **TRƯỚC** khi
  `await ensureAudioWithTimeline(...)`; tải xong mà vé đã bị chiếm thì `return` **vé cũ** chứ
  không phát. Trả vé cũ (không phải `playToken` hiện tại) là có chủ đích: `speakBilingual` so
  `playToken !== myToken` sẽ thấy lệch và dừng luôn phần đọc còn lại. Dùng `return` chứ không
  `throw` vì `speak()` bắt lỗi là rơi sang Web Speech — tức lại phát thành tiếng đúng thứ vừa
  bị huỷ. Chữ ký export không đổi.
- **`apps/dhcb/src/lib/sttServer.ts`** — `try/catch` quanh `new MediaRecorder(...)`: nhả hết
  track rồi mới ném lại lỗi gốc. `cleanup` được khai báo lên trước constructor.
- **`apps/dhcb/src/components/programming/AiHelpPanel.tsx`** — dọn state khi `lessonId` đổi
  bằng khuôn "adjusting state when a prop changes" của React (trong lượt render, không
  `useEffect` — tránh một lượt render thừa hiện dữ liệu bài cũ, và tránh lỗi lint
  `react-hooks/set-state-in-effect`); thêm `useMountedRef` + `lessonIdRef` để bỏ response về
  muộn. Chỉ so `lessonId`: sửa code rồi chạy lại trong cùng một bài vẫn **giữ** bậc gợi ý.
- **`apps/dhcb/src/pages/subjects/programming/ProgrammingLessonPage.tsx`** — `key={lesson.id}`
  cho `AiHelpPanel` (trang là cùng một instance khi `:lessonId` đổi vì `App.tsx` render không
  key). Không đặt key theo `code`/`results`.

## Quyết định khi thi hành

- **Lượt AI đã trừ ở server KHÔNG hoàn khi client abort.** Server không biết client rời trang;
  đặc tả AC-2 chốt không đổi luật hoàn lượt. Nhánh `catch` chỉ im lặng, không gọi API hoàn.
- **Dọn state của `AiHelpPanel` trong render, không trong effect.** `useEffect` + `setState` bị
  cổng lint `react-hooks/set-state-in-effect` chặn (và đúng: nó đẻ một lượt render thừa hiện
  gợi ý bài cũ). `key` ở nơi dùng vẫn giữ — hai lớp, lớp trong panel là lớp test đơn vị canh.
- **`tts.ts` trả vé cũ thay vì ném lỗi** — lý do đầy đủ ở phần trên và ở chú thích trong mã.

## Validation

| Cổng                    | Kết quả                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `npm run build`         | ✅                                                                                    |
| `npm run typecheck`     | ✅ (chạy lại sau `rm -rf packages/*/dist dist dist-server` để tái hiện checkout sạch) |
| `npm run lint`          | ✅ 0 cảnh báo                                                                         |
| `npm run format`        | ✅                                                                                    |
| `npm run test:coverage` | ✅ 12.704 ca; coverage 94,42 / 90,46 / 94,81 / 94,86 (sàn 93 / 89 / 93 / 93)          |

Chạy riêng theo AC: `npx vitest run apps/dhcb/src/pages/companion apps/dhcb/src/lib/companionApi.test.ts apps/dhcb/src/lib/tts.test.ts apps/dhcb/src/lib/sttServer.test.ts apps/dhcb/src/components/programming/AiHelpPanel.test.tsx`
→ 5 file, 98 ca, xanh hết.

**Không chạy `eval:tutor`/`eval:code-feedback`**: PR này không chạm `apps/dhcb/src/prompts/*`,
`packages/core-ai/aiConfig.ts` hay `packages/subject-programming/feedbackPrompt.ts`.

**Phạm vi ảnh hưởng đo bằng `npm run codemap -- impact`** (không đoán): `tts.ts` → 64 file
(chỉ sửa trong thân `speakViaGoogle`, không đổi chữ ký export) · `companionApi.ts` → 5 ·
`proactiveAgentApi.ts` → 8 · `sttServer.ts` → 9 · `AiHelpPanel.tsx` → 3. Mọi nơi gọi hiện có
truyền 0 hoặc 1 tham số nên hai chữ ký mới (tham số tuỳ chọn cuối) tương thích ngược.

## Ghi nhận: hai test flaky KHÔNG liên quan diff này

Chạy toàn bộ suite hai lượt, mỗi lượt đỏ một tập khác nhau:
`packages/subject-programming/lessonsPython.test.ts > p5-s2` (lượt 1 + 2) và
`apps/dhcb/src/lib/programmingSrs.test.ts` (chỉ lượt 1). Chạy riêng hai file: **577/577 xanh**.
Nguyên nhân: `lessonsPython.test.ts` spawn `python3` với `timeout: 15_000` (dòng 104) — dưới tải
của cả suite trên máy nhiều nhân dùng chung, tiến trình con vượt ngưỡng. Không file nào trong
hai file đó nằm trong `codemap impact` của các file PR này sửa. Đây là nợ flaky sẵn có
(QUY-TRINH-AUDIT Tầng 1b), ghi lại ở `PROGRESS.md` chứ không xử trong PR `fix` này.

## Rollback

`git revert` PR. Không migration, không schema, không cột mới, không đổi hợp đồng API. Revert
đưa lại đúng hành vi cũ (bao gồm cả sáu lỗi) — không mất dữ liệu.
