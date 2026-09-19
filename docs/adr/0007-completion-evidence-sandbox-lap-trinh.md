# ADR-0007: Bằng chứng hoàn thành bài Lập trình phải được server chấm lại, không tin nguyên trạng thái client gửi lên

- **Ngày:** 2026-09-19
- **Trạng thái:** ✅ Accepted — chốt Phương án B (2026-09-19), ĐÃ THI HÀNH cho phạm vi P1–P4
- **Người quyết định:** Chủ dự án (đã chốt 2026-09-19, uỷ quyền cho AI đọc code/đánh giá rủi ro
  rồi quyết thay theo tinh thần "ưu tiên chất lượng, không khoá oan/không mở toang rủi ro")

## Bối cảnh

Nợ kỹ thuật ghi ở `PROGRESS.md` (2026-09-15, S11-1, `docs/changelog/0333-*.md`), bảng luật
`packages/core-learner/completionRules.ts` đã ghi rõ: bài Lập trình chấm test case NGAY TẠI
CLIENT (Web Worker chạy Pyodide — Python biên dịch sang WASM, xem `apps/dhcb/src/lib/pythonRunner.ts`

- `apps/dhcb/src/workers/pyodideWorker.ts`), rồi `ProgrammingLessonPage.tsx:184` chỉ POST
  `status:'completed'` lên server. Server (`apps/server/src/api/subjects/programming/progress.ts`,
  vừa được PR #1033 siết thêm khoá bậc tuần tự) hiện CHỈ kiểm `lessonId` có thật và (từ PR #1033)
  bậc có được mở hay chưa — **không kiểm code nộp lên có thật sự đúng hay không**. Người sửa
  DevTools/gọi thẳng API vẫn tự đánh dấu "đã hoàn thành" bất kỳ bài nào đã mở khoá, dù chưa từng
  giải đúng — annh hưởng: (a) `recentEvidenceCount` (ADR-0005) đã cố ý trả `null` cho subject không
  có nguồn evidence xác thực — Lập trình đang là một trong các subject đó; (b) huy hiệu/streak/
  mục tiêu tuần tính trên "đã hoàn thành" tự khai; (c) nếu sau này môn Lập trình muốn tham gia
  `platform.completion_evidence` (bảng evidence chung, hiện CHECK constraint chỉ nhận 4 môn STEM —
  xem `postgres/migrations/0081_completion_evidence.sql`) thì phải có nguồn chấm lại đáng tin trước.

Bài STEM (Toán/Lý/Hoá/Sinh) đã đi đúng mô hình: server chấm lại (so đáp án trắc nghiệm/số, không
chạy code tuỳ ý người dùng) — nhẹ nhàng vì không có "chạy code". Lập trình khác về BẢN CHẤT: chấm
đúng/sai đòi hỏi THỰC THI mã người dùng viết (test case dạng "input → output mong đợi"), tức là
**chạy code không tin cậy trên server** — rủi ro bảo mật thật (không phải lý thuyết): vòng lặp vô
hạn, DoS bằng CPU/RAM, cố truy cập filesystem/network/biến môi trường chứa secret nếu sandbox hở.

**Vì sao cần ADR thay vì giao thẳng subagent:** đây đúng loại việc CLAUDE.md mục 12 liệt kê phải
dừng hỏi — "đụng bảo mật", "breaking change ảnh hưởng nhiều nơi" (mọi bài P1-P6 có test case),
và "nhiều giải pháp đánh đổi khác nhau đáng kể" (chọn sai kiến trúc sandbox rất tốn công sửa lại).

## Bằng chứng đã đọc (không đoán)

- Client CHỈ chạy Python qua Pyodide/WASM trong Web Worker — không có iframe `eval`, không gọi
  trình biên dịch native nào ở client (`pythonRunner.ts` dòng 1-50).
- Test nội dung (không phải bài người dùng nộp) của kho bài Lập trình ĐÃ chạy `python3` thật ở
  MÔI TRƯỜNG SERVER/CI qua `execFileSync` với timeout (xem `packages/subject-programming/lessonsPython.test.ts`,
  đã ổn định 2026-09-15 — `docs/changelog/0334-2026-09-15-on-dinh-test-python3.md`). Đây là bằng
  chứng "chạy Python trong tiến trình con có timeout" ĐÃ CÓ SẴN trong CI/Node của dự án — không
  phải công nghệ mới hoàn toàn, nhưng đó là chạy nội dung DO ĐỘI DỰ ÁN VIẾT (tin cậy), không phải
  code DO NGƯỜI DÙNG BẤT KỲ gửi lên (không tin cậy) — khác nhau về mức độ rủi ro cần phòng.
- `platform.completion_evidence` (migration 0081) CHECK constraint hiện CHỈ nhận
  `'mathematics','physics','chemistry','biology'` — môn `programming`/`english` không nằm trong
  danh sách, phải ALTER CHECK constraint nếu muốn Lập trình ghi vào bảng evidence chung.
- 13 hướng chuyên sâu môn Lập trình (`docs/research/dac-ta-huong-chuyen-sau-mon-lap-trinh-2026-08-27.md`)
  không chỉ có Python — hướng web/backend/data/AI có thể dùng JS/SQL/khác. **ADR này CHỈ giải
  quyết phạm vi P1-P4 (lõi, xác nhận đang dùng Python/Pyodide)** — chưa khảo sát hết ngôn ngữ các
  hướng chuyên sâu, xem câu hỏi 4 bên dưới.

## Các phương án đã cân nhắc

### A. Không làm gì — giữ nguyên "client tự khai"

- Được: không tốn công, không rủi ro triển khai sai sandbox.
- Mất: nợ kỹ thuật tồn tại vĩnh viễn, mọi số liệu "đã hoàn thành"/badge/streak môn Lập trình mãi
  mãi không đáng tin trước gian lận cố ý (không phải lỗi ngẫu nhiên); Lập trình không bao giờ có
  thể tham gia hệ evidence chung (ADR-0005 vẫn phải trả `recentEvidenceCount: null`).

### B. Chấm lại BẰNG CÁCH SO SÁNH OUTPUT — chạy lại chính test case đó trong tiến trình con

(`child_process`/`execFile`) có sandbox hoá trên server, KHÔNG dùng Docker/VM riêng

- Cơ chế: server nhận `{lessonId, code, testCaseId}` (không nhận "tôi đã đúng" từ client), tự lấy
  test case + input/expected-output THẬT từ nguồn dữ liệu bài học (server đã có sẵn, không tin
  client gửi kèm), chạy `code` trong tiến trình `python3` con: giới hạn CPU thời gian
  (`timeout` + `SIGKILL`, đã có mẫu ở `lessonsPython.test.ts`), giới hạn bộ nhớ (`ulimit -v` hoặc
  cờ tương đương), **không mount filesystem thật** (chạy trong `mkdtemp` xoá ngay sau), **không
  biến môi trường** (`env: {}` tuyệt đối, không kế thừa secret của process cha), không quyền mạng
  (cần xác nhận hạ tầng VPS có hỗ trợ network namespace cô lập theo tiến trình hay không — nếu
  không, đây là LỖ HỔNG cần chấp nhận có ý thức hoặc chặn bằng cách khác, xem câu hỏi 2).
- Được: tái dùng đúng runtime Python đã có trên máy chủ (không cần cài thêm Docker/gVisor/Firecracker),
  triển khai nhanh, đúng tinh thần "vốn tối thiểu" của dự án.
- Mất: cách ly KHÔNG BẰNG container/VM thật — một lỗ hổng Python (hiếm nhưng có, ví dụ qua
  `os`/`subprocess` module nếu không chặn import) có thể thoát tiến trình con lên máy chủ thật.
  Cần MỘT lớp chặn import module nguy hiểm (allowlist `builtins`, chặn `import os/sys/subprocess/socket`)
  — việc này CÓ RỦI RO BỊ BYPASS nếu allowlist thiếu, đã có tiền lệ CVE trong nhiều "Python sandbox"
  tự chế trên thế giới.

### C. Chấm lại bằng SANDBOX MẠNH HƠN — container/VM ngắn hạn cho mỗi lần chấm (Docker rootless /

Firecracker microVM / dịch vụ chấm bài thuê ngoài kiểu Judge0)

- Được: cách ly thật ở mức hệ điều hành — mức an toàn cao nhất, không phụ thuộc allowlist Python
  hoàn hảo.
- Mất: hạ tầng MỚI HOÀN TOÀN trên VPS hiện tại (PM2 + Nginx, không có Docker daemon đang chạy —
  cần xác nhận VPS có tài nguyên/quyền cài Docker hay không), độ trễ khởi tạo container mỗi lần
  chấm (vài trăm ms → vài giây tuỳ cấu hình), chi phí vận hành thêm nếu dùng dịch vụ thuê ngoài
  (mâu thuẫn "vốn tối thiểu" nếu tính phí theo lượt chấm và có ~30 lượt AI/ngày × nhiều người dùng
  Free).

### D. KÝ (sign) kết quả worker thay vì chấm lại — client ký kết quả bằng khoá không lộ, server

chỉ xác minh chữ ký

- Được: không cần chạy code trên server, không rủi ro sandbox.
- Mất: **KHÔNG giải quyết được vấn đề gốc** — khoá ký nằm ở client (trình duyệt), người có DevTools
  vẫn đọc được khoá hoặc giả lập lời gọi ký, tương đương "client tự khai" nhưng phức tạp hơn vô ích.
  Loại phương án này ngay — không phải giải pháp bảo mật thật.

## Quyết định (Accepted 2026-09-19)

Đề xuất đi theo **Phương án B** cho phạm vi P1-P4 (Python/Pyodide) làm bước đầu, có 3 lớp chặn bổ
sung bắt buộc đi kèm (không phải "chạy python3 trần"):

1. Allowlist `builtins`/module nhập được (chặn `os`, `sys`, `subprocess`, `socket`, `ctypes`,
   `importlib`, mọi I/O ra ngoài `stdin`/`stdout` được cấp).
2. Chạy dưới user hệ thống RIÊNG, không có quyền ghi ngoài thư mục tạm của chính lượt chấm đó,
   không có quyền `sudo`/quyền ghi vào mã nguồn ứng dụng.
3. Giới hạn CPU + bộ nhớ + số tiến trình con (`ulimit`/`prlimit`), timeout cứng giống
   `pythonRunner.ts` đã làm ở client (10s).

**Vì sao loại các phương án kia:** (A) để nợ tồn tại vĩnh viễn, vi phạm CLAUDE.md mục 3 "chủ động
góp ý" — đã đủ chứng cứ để không im lặng bỏ qua. (C) đúng nhưng vượt quá "chia nhỏ" cho MỘT PR —
đổi cả hạ tầng deploy hiện tại (PM2 + Nginx, không Docker), rủi ro vận hành lớn hơn lợi ích ở quy
mô người dùng hiện tại (dự án "vốn tối thiểu", ưu tiên chi phí thấp theo CLAUDE.md mục 7). (D) không
giải quyết đúng vấn đề, loại thẳng.

## Bốn quyết định — ĐÃ CHỐT (2026-09-19)

1. **Mức cách ly: Phương án B (mức tiến trình), KHÔNG chờ Docker/VM.** Đánh đổi chấp nhận: rủi ro
   thoát sandbox lý thuyết nếu allowlist thiếu sót, bù lại bằng 3 lớp chặn bắt buộc ở trên. Quyết
   định CÓ THỂ ĐẢO NGƯỢC — một ADR sau có thể supersede khi có lý do thật (xem "Điều kiện xem lại").
2. **Cô lập mạng: HAI TẦNG, không chọn một.** Tầng chính (bắt buộc, không phụ thuộc hạ tầng):
   allowlist Python chặn `socket`/`urllib`/`http`/`ftplib`/`smtplib`/`requests` thật. Tầng phụ
   (best-effort): nếu VPS hỗ trợ `unshare --net`/`ip netns` (XÁC NHẬN THẬT lúc chạy bằng lệnh dò,
   KHÔNG giả định), bọc lệnh chấm trong đó; không hỗ trợ thì KHÔNG chặn PR — ghi thành nợ kỹ thuật
   hẹp riêng trong `PROGRESS.md` để xem lại sau, không được im lặng bỏ qua.
3. **Phạm vi chấm lại: CHỈ ở bước "Nộp bài"/"Đánh dấu hoàn thành".** Client giữ nguyên trải nghiệm
   "Chạy thử" tức thời bằng Pyodide; server chấm lại ĐÚNG MỘT LẦN tại thời điểm gọi API ghi
   `status:'completed'`. Kèm rate-limit số lần NỘP SAI liên tiếp/bài/người trong một cửa sổ ngắn
   (chống lạm dụng CPU qua spam nộp bài) — ngưỡng cụ thể + lý do chọn phải ghi trong changelog thi
   hành.
4. **Phạm vi ngôn ngữ: CHỈ P1-P4 (Python qua Pyodide) trong đợt này.** Các hướng chuyên sâu dùng
   ngôn ngữ khác Python vẫn "client tự khai" — PHẢI ghi thành một dòng nợ kỹ thuật MỚI, phạm vi
   hẹp, riêng biệt trong `PROGRESS.md` (không được coi là đã giải quyết bởi ADR này).

## Hệ quả

- **Kéo theo:** module chấm lại server-side mới
  (`packages/subject-programming/completionSandboxServer.ts`), sửa
  `apps/server/src/api/subjects/programming/progress.ts` để BẮT BUỘC gọi chấm lại trước khi ghi
  `status:'completed'` (bài thuộc phạm vi P1–P4/Python), rate-limit riêng cho lượt nộp sai liên
  tiếp. `completionRules.ts` KHÔNG đổi — Lập trình tiếp tục có nguồn evidence riêng
  (`/api/programming/progress`) như comment đầu file đã ghi, không cần dời sang
  `platform.completion_evidence` chung (việc đó vẫn là lựa chọn MỞ cho đợt sau, không bắt buộc).
- **Chấp nhận đánh đổi:** thêm tải CPU cho server mỗi lần nộp bài — không dùng chung hạn mức AI/
  ngày (chấm bài không tính là lượt AI), có luật hạn mức RIÊNG (Quyết định 3).
- **Điều kiện xem lại:** nếu đo tải thật cho thấy Phương án B không đáp ứng nổi số người dùng
  đồng thời, hoặc phát hiện lỗ hổng thoát sandbox THẬT (không chỉ lý thuyết), nâng lên Phương án C.
