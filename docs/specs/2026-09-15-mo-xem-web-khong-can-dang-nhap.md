# Đặc tả — Mở xem toàn bộ web không cần đăng nhập (chế độ Khách)

> **Approved for implementation** — người dùng chốt qua hỏi đáp trong phiên 2026-09-15.
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`.

## 0. Một câu

Cho phép người chưa đăng nhập ("Khách") xem và học toàn bộ nội dung của nền tảng, tiến độ lưu ở
`localStorage`, dùng thử giới hạn các tính năng AI/audio, và khi đăng ký/đăng nhập thì tiến độ
khách được hợp nhất lên tài khoản thật thay vì mất trắng.

## ① Phạm vi

**LÀM:**

- Sinh **danh tính khách** ẩn danh (`guest_<uuid>`) lưu `localStorage`, dùng làm `uid` cho mọi
  module tiến độ phía client đang có sẵn (chúng đều đã nhận `uid: string`).
- `AuthProvider` cấp một `User` ảo cho khách (`isGuest: true`, `plan: 'free'`, `onboarded: true`)
  khi không có phiên đăng nhập → mọi trang nội dung chạy nguyên vẹn, không phải sửa từng trang.
- Tách hai lớp bảo vệ route: `AllowGuest` (khách vào được) và `RequireAccount` (bắt buộc tài
  khoản thật). Đổi các route CHỈ ĐỌC/học nội dung sang `AllowGuest`.
- Luật khoá bài/bậc **giữ nguyên hàm thuần** (`@dhcb/subject-programming/levelLock`,
  `@dhcb/core-learner/unlockThreshold`) — chỉ đổi nguồn tiến độ đầu vào sang `localStorage`.
- Chặn mọi đường đồng bộ server cho khách (`pushProgress`/`pullProgress`/`pullUserData`/
  `/api/programming/progress`) — khách không có phiên, gọi lên chỉ tạo 401 rác.
- Cho khách **dùng thử giới hạn** `/api/agent`, `/api/stt`, `/api/tts`: hạn mức ngày riêng, thấp
  hơn nhiều so với Free đã đăng nhập, đếm ở server theo `X-Guest-Id` **và** theo IP.
- Hợp nhất tiến độ khách → tài khoản ngay khi có phiên đăng nhập mới (mọi đường đăng nhập), đi
  qua đúng cơ chế hợp nhất UNION sẵn có ở `apps/server/src/api/_lib/progressMerge.ts`.
- Banner mời đăng nhập (dùng token `--a-*`, đạt AA) + thông báo hết lượt thử.

**KHÔNG LÀM:**

- **KHÔNG** nới `validateAuth()` cho bất kỳ endpoint nào chứa dữ liệu cá nhân, thanh toán, admin,
  bạn bè, lịch sử, hồ sơ. Chỉ 3 endpoint AI/audio ở trên có thêm **nhánh khách**, và nhánh đó
  không đọc/ghi dữ liệu người dùng nào.
- **KHÔNG** đụng luật chống gian lận `cefrUnlocked` tính ở server cho người đã đăng nhập
  (`apps/server/src/api/core/progress.ts`) — giữ nguyên 100%.
- **KHÔNG** thêm migration Postgres. Bộ đếm lượt thử của khách nằm ở Redis (fallback in-memory),
  đúng nơi `checkRateLimit` đang dùng.
- **KHÔNG** lưu lịch sử chat/viết/nói/điểm của khách lên server.

## ② Điểm chạm

| Việc | Đường dẫn file                                                              | Ghi chú                                      |
| ---- | --------------------------------------------------------------------------- | -------------------------------------------- |
| Thêm | `packages/core-ui/guestId.ts`                                               | Danh tính khách (client, dùng chung app/hub) |
| Sửa  | `packages/core-ui/authHeader.ts`                                            | Chưa đăng nhập → gửi `X-Guest-Id`            |
| Thêm | `packages/core-auth/guest.ts` + `actorUsage.ts`                             | Server: đọc `X-Guest-Id`, `resolveActor()`   |
| Sửa  | `packages/core-auth/security.ts`                                            | Thêm bộ đếm theo NGÀY (Redis/in-memory)      |
| Thêm | `packages/core-auth/guestTrial.ts`                                          | Hạn mức dùng thử của khách                   |
| Sửa  | `packages/core-ai/ai.ts` · `stt.ts` · `tts.ts`                              | Nhánh khách                                  |
| Thêm | `apps/dhcb/src/lib/guestProgress.ts`                                        | Hợp nhất tiến độ khách → tài khoản           |
| Thêm | `apps/dhcb/src/components/GuestBanner.tsx`                                  | Mời đăng nhập                                |
| Sửa  | `apps/dhcb/src/context/AuthProvider.tsx`                                    | Cấp `User` khách + kích hoạt hợp nhất        |
| Sửa  | `apps/dhcb/src/App.tsx`                                                     | `AllowGuest` / `RequireAccount`              |
| Sửa  | `apps/dhcb/src/lib/progressSync.ts` · `cloud.ts` · `programmingProgress.ts` | Bỏ qua đồng bộ cho khách                     |

**Ảnh hưởng lan ra:** `authHeader.ts` là điểm nóng (mọi lời gọi API client đi qua) — thay đổi ở
đây chỉ THÊM header khi **không có** token, nên đường đã đăng nhập không đổi một byte nào.

## ③ Hợp đồng dữ liệu

**Vào (client → server, chỉ khi chưa đăng nhập):**

```ts
// Header trên /api/agent, /api/stt, /api/tts
'X-Guest-Id': `guest_${string}` // uuid v4, tự sinh ở trình duyệt
```

**Ra (server):**

```ts
// Hết lượt thử khách
{
  error: string
  guestTrialExhausted: true
} // HTTP 429
```

**Actor phía server:**

```ts
type Actor = { kind: 'user'; userId: string } | { kind: 'guest'; guestKey: string }
```

**Ca lỗi:**

| Tình huống                             | Mã lỗi | Hành vi mong đợi                                  |
| -------------------------------------- | ------ | ------------------------------------------------- |
| Không token, không `X-Guest-Id` hợp lệ | 401    | Như cũ — "Vui lòng đăng nhập"                     |
| Khách hết lượt/ngày (theo guest id)    | 429    | `guestTrialExhausted: true`, UI mời đăng nhập     |
| Khách vượt trần theo IP                | 429    | Như trên (chống xoá localStorage để reset lượt)   |
| Redis hỏng                             | —      | Fallback bộ đếm in-memory, KHÔNG fail-open vô hạn |

## ④ Tiêu chí chấp nhận

- [x] Mở `/bai-hoc`, `/lap-trinh/p1`, `/lo-trinh-hoc` khi chưa đăng nhập → thấy nội dung, không
      bị đẩy về `/login`.
- [x] Bài 2 của một bậc vẫn **khoá** với khách cho tới khi đủ ngưỡng — cùng hàm thuần, cùng ngưỡng
      `UNLOCK_PCT` như người đã đăng nhập. Test: `apps/dhcb/src/lib/guestProgress.test.ts`.
- [x] `/trang-ca-nhan`, `/nang-cap`, `/ban-be`, `/admin-s`, `/lich-su-hoc` vẫn đẩy khách về
      `/login`.
- [x] Khách gọi `/api/agent` quá `GUEST_DAILY_TRIAL` lần trong ngày → 429 kèm
      `guestTrialExhausted`. Test: `packages/core-auth/guestTrial.test.ts`.
- [x] Khách học vài bài rồi đăng ký → tiến độ xuất hiện trên tài khoản mới, key khách bị xoá.
      Test: `apps/dhcb/src/lib/guestProgress.test.ts`.

**Lệnh chứng minh:**

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                   | Test nào canh nó                                 |
| ---------------------------------------------------------- | ------------------------------------------------ |
| `cefrUnlocked` do server tính, client không khai được      | `apps/server/src/api/core/progress.test.ts`      |
| Luật khoá bậc của khách **không lỏng hơn** người đăng nhập | `apps/dhcb/src/lib/guestProgress.test.ts`        |
| Hạn mức khách < hạn mức Free đã đăng nhập                  | `packages/core-auth/guestTrial.test.ts`          |
| Khách không bao giờ gửi tiến độ lên server                 | `apps/dhcb/src/lib/guestProgress.test.ts`        |
| Hợp nhất tiến độ chỉ TĂNG, không mất dữ liệu đã có         | `apps/server/src/api/_lib/progressMerge.test.ts` |

## ⑥ Quy ước dự án liên quan

- Import xuyên gói dùng `@dhcb/<gói>/<file>` (không đuôi `.js`); nội bộ gói dùng đường tương đối
  **có** đuôi `.js`.
- Mọi handler API tự kiểm `validateAuth()` — nhánh khách là **thêm**, không phải thay.
- TypeScript `strict`, không `any`; dữ liệu ngoài validate bằng Zod.
- Màu lấy từ token `--a-*`; nội dung/tiêu đề đạt AAA (≥ 7:1), phần còn lại AA.
- Comment tiếng Việt ở chỗ quan trọng; conventional commits.

---

## Nghiệm thu

- Lệnh đã chạy + kết quả thật: xem `## Validation` của PR.
- Còn để ngỏ: khách vẫn có thể tự sửa `localStorage` của chính mình để mở khoá sớm — chấp nhận
  (không có điểm/tiền/xếp hạng gắn với danh tính khách; tài khoản thật vẫn do server cưỡng chế).
