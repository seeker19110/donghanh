# 0387 — 2026-09-20 — ADR-0008 câu hỏi 3: chấm lại SQL ở server (509/509 bài)

## Việc đã làm

Đóng nốt câu hỏi 3 còn mở của `docs/adr/0008-cham-lai-server-lap-trinh-ngoai-p1-p4.md`: 5 bài
SQL (P3/P5/P6) vẫn "client tự khai hoàn thành" vì câu hỏi bảo mật của `sql.js` (`ATTACH DATABASE`/
`load_extension`) chưa được xác minh.

**Xác minh thật (không đoán), chạy trực tiếp bản `sql.js` dùng trong dự án:**

```js
const initSqlJs = require('sql.js')
const SQL = await initSqlJs()
const db = new SQL.Database()
db.run("ATTACH DATABASE '/tmp/pwn.db' AS x;") // KHÔNG ném lỗi
db.run('CREATE TABLE x.t (a INT); INSERT INTO x.t VALUES (1);')
db.exec('SELECT * FROM x.t') // → [{a:1}] — đọc/ghi bình thường
// nhưng:
fs.existsSync('/tmp/pwn.db') // → false — KHÔNG có file thật trên đĩa
db.exec("SELECT load_extension('/tmp/x.so');") // → throw "no such function: load_extension"
```

Kết luận: bản dựng WASM (Emscripten) của `sql.js` không kèm VFS bền lâu (persistent filesystem) —
`ATTACH DATABASE` chỉ tạo thêm một CSDL phụ TRONG BỘ NHỚ, "đường dẫn" chỉ là khoá đặt tên, không
chạm hệ thống file thật của server. `load_extension` hoàn toàn không có trong bản dựng, nên không
thể nạp mã máy gốc. Cả hai vector rủi ro ADR-0008 nêu ra đều không tồn tại thật với engine này —
an toàn để chấm-lại-ở-server ở cùng mức tin cậy với lúc nó chạy trong Worker trình duyệt
(`sqlWorker.ts`), không cần allowlist/sandbox OS riêng như Python.

**Thi hành:**

- `packages/subject-programming/completionSandboxServer.ts`: thêm `regradeSqlSubmission()` —
  nạp `sql.js` một lần cho cả đời tiến trình (nạp `.wasm` từ `node_modules`, không qua mạng,
  đúng cách `lessonsSql.test.ts` làm), mở CSDL mới tinh mỗi lượt chấm, nạp `SQL_SEED` (hoặc
  `testCase.datasetSql` riêng), chạy code học viên, chấm bằng `gradeTestCase()` — dùng chung
  engine với mọi luồng khác. `isServerRegradableLesson()` nay nhận `sql` (cả 5 bài đều là bài
  xương sống, không có khoá ngắn SQL). `regradeSubmission()` (dispatcher duy nhất cho route)
  thêm nhánh gọi `regradeSqlSubmission()`.
- Không đổi `sqlWorker.ts` (client) — vẫn dùng nguyên như cũ, chỉ thêm bản chấm-lại riêng ở server.
- Không cần sửa client gửi `code`: `ProgrammingLessonPage.tsx` đã gửi `code` chung cho MỌI ngôn
  ngữ khi báo `completed` (dùng chung route/luồng với JS/TS/Kotlin…).

**Tổng phạm vi chấm-lại-ở-server sau đợt này: 509/509 bài (100%)** — không còn bài xương sống
nào "client tự khai hoàn thành".

## Issue / outcome

Trước: 5 bài SQL client tự khai `status:'completed'`, server chỉ kiểm `lessonId` có thật, không
chấm lại test-case. Sau: server chạy lại đúng code học viên trên `sql.js`, chấm bằng đúng
test-case của bài (đọc từ registry server, không tin dữ liệu client gửi).

## Research / spec

`docs/adr/0008-cham-lai-server-lap-trinh-ngoai-p1-p4.md` (Accepted) — câu hỏi 3 đã chốt "để SQL
đứng ngoài B1/B2, xác minh trước". Đợt này là phần xác minh + thi hành đó.

## Validation

`npm run typecheck` — 0 lỗi · `npx eslint packages/subject-programming/completionSandboxServer.ts
packages/subject-programming/completionSandboxServer.test.ts --max-warnings 0` — sạch ·
`npx vitest run packages/subject-programming/completionSandboxServer.test.ts` — 37/37 xanh, gồm:
5/5 bài SQL code mẫu đạt, code sai/sai cú pháp không đạt không ném lỗi, **ATTACH DATABASE ra
`/tmp/...` không tạo file thật trên đĩa (kiểm bằng `existsSync()` ngay trong test)**,
`regradeSubmission` điều hướng đúng luồng, bài ngoài phạm vi ném lỗi rõ ràng.

## Rủi ro, rollout và rollback

Rủi ro thấp: `sql.js` chạy hoàn toàn trong bộ nhớ tiến trình Node, không subprocess, không I/O
thật (đã xác minh). Không đổi hợp đồng wire (client đã gửi `code` từ trước). Rollback: revert
commit, `isServerRegradableLesson` quay lại không nhận `sql` — bài SQL trở lại "client tự khai"
như trước, không mất dữ liệu tiến độ đã lưu.

## Definition of Done

- [x] 5 bài SQL được chấm lại ở server bằng đúng test-case của bài
- [x] Xác minh `load_extension`/`ATTACH DATABASE` an toàn — có test canh cụ thể
- [x] `regradeSubmission()` điều hướng đúng luồng cho SQL
- [x] typecheck/lint/test xanh
- [x] Tổng phạm vi chấm-lại-ở-server: 509/509 bài (100%)
