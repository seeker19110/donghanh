# 0411 — 2026-09-22 — Nới đệm coverage + bundle: sửa phép đo Initial JS đếm nhầm chunk lười, thêm test cho ba file 0% nhánh

> PR: (đợt này) · Trả một phần nợ 🟡 "Cả COVERAGE lẫn BUNDLE nay đều mỏng" (`PROGRESS.md`).
> Chủ dự án chọn việc này sau khi hỏi "dự án cần cải thiện điều gì": đệm mỏng thì PR nhỏ vô hại
> kế tiếp làm CI đỏ và người viết PR đó lãnh nợ người khác đã tiêu.

## Số đo (build sạch + `npm run test:coverage`, cùng máy, trước/sau)

| Ngân sách           | Trước                   | Sau                     | Đệm              |
| ------------------- | ----------------------- | ----------------------- | ---------------- |
| Initial JS (brotli) | 136,73 / 150 kB (91,2%) | 131,99 / 150 kB (88,0%) | 13,3 → 18,0 kB   |
| Coverage branches   | 90,07% (sàn 89)         | 90,48%                  | 1,07 → 1,48 điểm |
| Coverage statements | 94,13%                  | 94,62%                  | 1,13 → 1,62 điểm |
| Coverage functions  | 94,79%                  | 95,32%                  | 1,79 → 2,32 điểm |
| Coverage lines      | 94,67%                  | 95,14%                  | 1,67 → 2,14 điểm |

CSS không đổi (17,80 / 20 kB) — ngoài phạm vi.

## Việc đã làm

**1. Bundle — phép đo đếm nhầm 4,8 kB.** Đọc `dist/js/*.map` thấy có HAI file khớp glob
`dist/js/index-*.js` của `.size-limit.json`: entry thật (35 kB brotli) và `index-CUJzsi64.js`
(4,8 kB brotli) — chunk của `apps/dhcb/src/prompts/index.ts`, chỉ được các trang lười (Chat ·
Writing · Speaking · Lessons · Practice · History · CefrLevelPage) import; trong entry nó chỉ
xuất hiện ở bảng `__vite__mapDeps`, `index.html` không preload. Rollup đặt tên chunk theo file
facade (`index.ts` → `index-<hash>`) nên nó trùng tên với entry. Sửa: thêm luật đầu tiên trong
`manualChunks` (`apps/dhcb/vite.config.ts`) đặt tên `prompts` cho mọi module dưới
`apps/dhcb/src/prompts/`. Kết quả build: `prompts-OPOLUVEx.js` tách riêng, `index.html` vẫn
không nhắc tới nó, `size-limit` chỉ còn đếm entry thật. **Không đổi thứ tự/khối lượng tải của
người dùng** — chỉ đổi tên file để phép đo đúng.

**2. Coverage — ba file logic thuần có 0% nhánh, viết test.** Chọn theo bảng "file có nhiều
nhánh chưa phủ nhất" đọc từ `coverage-summary.json`, ưu tiên file thuần logic mock được rẻ:

- `packages/core-auth/security.redis.test.ts` (19 ca): toàn bộ đường Redis của `security.ts`
  mà `security.test.ts` cũ không chạm (file cũ chỉ chạy nhánh Map in-memory). Mock `ioredis`
  bằng client giả điều khiển được `status`/`eval`/`ping`; `vi.resetModules()` + import động mỗi
  ca vì `redisClient` cache ở cấp module. Canh: đếm qua Lua khi `ready`, im lặng rơi về Map khi
  `connecting`, **cảnh báo đúng một lần mỗi lần chuyển trạng thái và báo lại khi hỏng lần nữa**
  (bài học 2026-08-23), `consumeDailyCounter` vẫn CHẶN khi Redis hỏng (không fail-open cho lượt
  AI của khách), `releaseDailyCounter` không âm, dọn Map khi > 10 000 key, `pingRedis`/
  `getRedisRuntimeStatus`/`reportRedisStatusAtStartup`. 53,4% → ~100% nhánh.
- `packages/core-ai/chatFallback.test.ts` (7 ca): chuỗi Groq → Anthropic → Gemini của
  `generateChatText`. Canh thứ tự thử, điều kiện "coi là thành công" từng provider (text rỗng,
  status ngoài 2xx, body không phải JSON, lỗi mạng), ghi token đúng provider và **Gemini ghi
  token TRƯỚC khi kiểm text** (đã tính tiền dù text rỗng). 34,8% → ~100% nhánh.
- `apps/dhcb/src/lib/subjectProgressBoard.test.ts` (10 ca): khối "Tiến độ theo môn" ở
  `/tien-do`. Canh ba ràng buộc ghi ở đầu file nguồn: đếm qua `summarizeOutline`, thứ tự 6 môn
  cố định, một môn hỏng không làm trắng cả khối; cộng các nhánh cấp CEFR đầu/`prevLevelId`/cấp
  không tồn tại, bậc Lập trình mặc định/`href` dự phòng, lớp STEM từ ý định/mặc định. 0% → ~95%.

**3. Sửa nguồn nhỏ đi kèm (không đổi hành vi):** `subjectProgressBoard.ts` — bốn thẻ STEM
trước đây mỗi thẻ tự `import()` lại cùng ba module (4 lượt song song). Gộp thành `cacTheStem`
nạp một lần rồi dựng bốn môn, mỗi môn vẫn `try` riêng. Lý do phải sửa: xem bẫy mới ở
`TRAPS.md` mục 11 — không sửa thì test không mock được ba môn sau.

## Bẫy mới ghi vào `TRAPS.md` (mục 11)

Vitest chỉ trả bản mock cho lượt `import()` động ĐẦU của một module; các lượt `import()` cùng
module chạy ĐỒNG THỜI (trong `Promise.all`) nhận module THẬT. Đo bằng log trong nguồn:
`mathematics mock mock` · `physics real real` · `chemistry real real` · `biology real real`.
Import tĩnh module đó ở test để "làm ấm cache" KHÔNG giúp. Test vẫn xanh giả (thẻ dựng bằng dữ
liệu thật, mock không được gọi mà không ai biết) — chỉ lộ khi test cố làm một môn lỗi.

## Không làm (cố ý)

- Không tách chunk `tts.ts`/`zod` khỏi entry: `main.tsx` import `tts` có chủ đích; zod là
  validation runtime dùng ngay lúc khởi động. Đệm 18 kB đã đủ cho vài lát P0 kế tiếp.
- Không nới sàn coverage, không nới trần bundle (đúng luật "nới ngân sách không phải việc của
  agent").
- CSS 89% vẫn là biên độ mỏng nhất, giữ nguyên nợ.

## Bằng chứng kiểm chứng

- `npm run build` ✅ · `npx size-limit --json` → 131 993 / 150 000 ✅
- `npm run test:coverage` ✅ 16 695 passed | 2 skipped (trước: 16 659) — ngưỡng sàn qua.
- `npm run typecheck` ✅ (sau `rm -rf packages/*/dist dist dist-server`) · `npm run lint` ✅ 0
  cảnh báo · `npx prettier --check` ✅ trên file đã chạm.
