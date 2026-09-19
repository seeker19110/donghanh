# 0376 — 2026-09-19 — Sửa F6/F8: trọng tài merge `hard`/`placement`/`weeklyGoal` dùng đồng hồ client nhất quán thay đồng hồ hệ thống rải rác

- **Bối cảnh:** nợ mở ở `PROGRESS.md` ("Ba lỗi merge tinh tế ghi nợ ở S09-1 — CÒN 2/3"), đề xuất
  cụ thể ở `docs/changelog/0373-2026-09-19-s09-1-followup-ba-loi-merge.md`. Chủ dự án đã CHỐT
  hướng xử lý cho cả F6 và F8 (không cần đặc tả riêng nữa) — đợt này thi hành đúng quyết định đó.

## F6 — `hard` ghi đè theo thứ tự ĐẾN của request, không theo thời gian sửa thật

**Giữ nguyên bản chất:** `hard` vẫn CHỈ là nhãn lọc hiển thị, ghi đè tự do theo client — KHÔNG
đổi sang hợp nhất union (đúng comment gốc đầu `progressMerge.ts`).

**Sửa:** thêm hàm `resolveHard()` ở `progressMerge.ts` — so `client_updated_at` (đồng hồ client
lúc gửi, cột thêm ở migration `0083`) của **bản đã lưu trong DB** với **request hiện tại**:

- Request hiện tại có `client_updated_at` CŨ HƠN bản đã lưu → BỎ QUA thay đổi `hard` của request
  đó (giữ bản đã lưu). Đây là ca race chính cần chặn: request tới SAU ở tầng mạng nhưng mang dữ
  liệu logic CŨ HƠN không còn ghi đè lên bản mới hơn.
- Thiếu `client_updated_at` hợp lệ ở MỘT bên → bên có dữ liệu hợp lệ (không thiếu) thắng.
- Thiếu ở CẢ HAI bên (client cũ chưa gửi phong bì `sync`, hoặc dòng DB chưa từng ghi
  `client_updated_at`) → giữ hành vi ghi đè tự do cũ (client luôn thắng), không throw.

`progress.ts`: đọc thêm cột `client_updated_at` trong câu `select ... for update`, gọi
`resolveHard(existing?.hard ?? [], d.hard, existingClientUpdatedAt, incomingClientUpdatedAt)`
thay vì gán thẳng `d.hard`. Cột Postgres là `timestamptz` — driver `pg` trả về `Date`, không
phải chuỗi, nên thêm hàm `clientUpdatedAtIso()` chuẩn hoá về ISO string trước khi so (giống cách
`core-db/settings.ts` đã làm với cột timestamptz khác).

## F8 — `mergeByTimestamp` so 2 chuỗi ISO do CLIENT SINH cho `placement`/`weeklyGoal` — đồng hồ lệch giữa 2 thiết bị quyết định sai bên thắng

**Phát hiện khi đọc code thật (khác giả định trong brief):** cột `version` (migration `0083`) là
version của **CẢ DÒNG** `english.learning_progress` (1 dòng/user), KHÔNG tách riêng theo field
`placement`/`weeklyGoal`. Vì vậy KHÔNG thể dùng `version` để biết đúng NHÁNH `placement` hay
`weeklyGoal` cụ thể đã bị ghi ở nơi khác hay chưa — brief đã lường trước đúng tình huống này và
cho phép chuyển sang phương án đơn giản hơn khi gặp giới hạn này.

**Phương án đã chọn (phương án đơn giản hơn theo đúng tinh thần brief):** giữ NGUYÊN field nội
bộ `lastAt`/`updatedAt` mà client tự ghi vào từng object (không đổi, vẫn dùng để hiển thị) —
chỉ đổi TIÊU CHÍ SO SÁNH CHÍNH ở tầng `progressMerge`/`progress.ts`: `mergeByTimestamp()` nhận
thêm tham số tuỳ chọn `clientClock: { existing, incoming }` — `client_updated_at` của **TOÀN BỘ
REQUEST** (một nguồn duy nhất, nhất quán cho cả payload — `sync.clientUpdatedAt`) thay vì mốc
`lastAt`/`updatedAt` tự ghi riêng lẻ theo từng object con. Dùng MỘT đồng hồ chung cho cả request
giảm bề mặt lệch đồng hồ (không loại bỏ hoàn toàn — client_updated_at vẫn do client sinh), và
tận dụng đúng dữ liệu S09-1 đã có sẵn mà không cần đổi ý nghĩa cột `lastAt`/`updatedAt` đang dùng
để hiển thị.

- Cả 2 phía có `clientClock` hợp lệ VÀ khác nhau → dùng nó làm tiêu chí CHÍNH.
- Bằng nhau (ví dụ chính request đã tăng version đó gửi lại — idempotent retry qua biên nhận
  `sync_receipts`, hoặc client cũ gửi lại y hệt) hoặc thiếu ở 1/2 bên → rơi về so `field` nội bộ
  như cũ (tie-break phụ đúng như brief yêu cầu).

`progress.ts`: truyền `{ existing: existingClientUpdatedAt, incoming: incomingClientUpdatedAt }`
vào cả 2 lời gọi `mergeByTimestamp` cho `placement`/`weeklyGoal`. Lời gọi cho `settings` (dùng
cùng hàm) CỐ Ý không đổi — nằm ngoài phạm vi F6/F8 (brief chỉ nêu `placement`/`weeklyGoal`), và
tham số mới là tuỳ chọn nên không đổi hành vi khi bỏ qua.

## Test canh gác mới (`progressMerge.test.ts`)

- **F6 (`resolveHard`, 5 ca):** request cũ hơn bị bỏ qua · request mới hơn thắng bình thường ·
  thiếu ở request hiện tại (bản đã lưu có) → giữ bản đã lưu · thiếu ở CẢ HAI → không throw, giữ
  hành vi ghi đè tự do · bản đã lưu thiếu (dòng cũ trước migration) nhưng request hiện tại có →
  request thắng.
- **F8 (`mergeByTimestamp` với `clientClock`, 3 ca):** `clientClock` phân định đúng khi field
  nội bộ NÓI SAI do đồng hồ hệ thống máy lệch (mô phỏng race 2 thiết bị) · request tới SAU ở
  tầng mạng nhưng `clientClock` cũ hơn KHÔNG được thắng · `clientClock` bằng nhau/thiếu 1 bên →
  rơi về field nội bộ như cũ (không phá test cũ).

Test cũ (18 ca trước đợt này ở `progressMerge.test.ts`, 44 ca ở `progress.test.ts`) đều PASS
KHÔNG SỬA — xác nhận tham số mới là tuỳ chọn, không đổi hành vi mặc định.

## Bằng chứng kiểm chứng

```
npm ci                                                            ✅ (lockfile khớp)
npx vitest run apps/server/src/api/_lib/progressMerge.test.ts     ✅ 22/22 pass (thêm 8 ca mới)
npx vitest run apps/server/src/api/core/progress.test.ts          ✅ 44/44 pass (không sửa, vẫn xanh)
npm run typecheck                                                 ✅ 0 lỗi
npm run lint                                                      ✅ 0 cảnh báo
npm run build                                                     ✅ client + hub + server, exit 0
npm run test:coverage                                             ✅ xem kết quả đầy đủ trong PR/CI
```

## Kết luận

F6 và F8 đóng hoàn toàn theo đúng quyết định đã chốt của chủ dự án. `PROGRESS.md` cập nhật tại
chỗ. Phần "hard chỉ là lọc hiển thị" và "placement/weeklyGoal field nội bộ dùng để hiển thị"
KHÔNG đổi ý nghĩa — chỉ đổi trọng số quyết định bên thắng khi có xung đột ghi đồng thời.
