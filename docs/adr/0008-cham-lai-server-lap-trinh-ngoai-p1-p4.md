# ADR-0008: Chấm lại ở server cho bài Lập trình NGOÀI phạm vi P1–P4 (ADR-0007)

- **Ngày:** 2026-09-19
- **Trạng thái:** đề xuất — CẦN CHỦ DỰ ÁN CHỐT CÂU HỎI Ở CUỐI TRƯỚC KHI THI HÀNH
- **Người quyết định:** chờ chủ dự án

## Bối cảnh

ADR-0007 (Accepted, đã thi hành PR #1038/#1039/#1040) chỉ chấm lại ở server cho bài xương sống
P1–P4 dùng làn Python (`isServerRegradableLesson()` trong `completionSandboxServer.ts` chỉ nhận
`lessonId` khớp `^p[1-4]-u\d+-l\d+$` VÀ `laLanPython(lesson.language)`). Mọi bài NGOÀI phạm vi đó
— P5/P6 xương sống, bước dự án (`p<n>-s<x>`), tiêu chí hướng chuyên sâu (`web-s2-m1`…), 12 khoá
ngắn (`git`/`hermes`/`vibe`/`openclaw`/`ml`/`pyai`/`mathai`/`mlds`/`cv1`/`cv2`/`llmagent`) — vẫn
"client tự khai": client chạy/mô phỏng bài, tự POST `status:'completed'`, server chỉ kiểm
`lessonId` có thật.

**PROGRESS.md ghi nợ này là MỘT KHỐI đồng nhất** ("bài Lập trình ngoài P1-P4 vẫn client tự khai
— chưa có ADR riêng"), ngụ ý cần một kiến trúc sandbox mới giống Python cho từng ngôn ngữ khác.
**Đọc code thật cho thấy điều đó SAI với phần lớn khối lượng bài** — ba nhóm dưới đây có mức rủi
ro và chi phí thi hành khác nhau HẲN nhau, gộp chung sẽ khoá oan phần rẻ/an toàn theo phần đắt/
rủi ro.

## Bằng chứng đã đọc (không đoán) — đếm thật từ `PROGRAMMING_LESSONS`

Đếm bằng `packages/subject-programming/lessons.ts` (509 bài), nhóm theo bậc + ngôn ngữ:

| Ngôn ngữ / mô phỏng                                                          | Số bài                                                                                                                     | Bậc/khoá xuất hiện  |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `python` (bao gồm làn `pytest`/`httpsim`/`apisim`), NGOÀI phần P1-P4 đã chấm | 174 (P6) + 8 (P5, gồm 1 `apisim`) + 20+13+11+17+14+14+14 (7 khoá ngắn: ml/mathai/mlds/pyai/cv1/cv2/llmagent) = **285 bài** | P5, P6, 7 khoá ngắn |
| `kotlin`                                                                     | 7                                                                                                                          | P6                  |
| `swift`                                                                      | 0 (hạ tầng có sẵn, chưa có bài)                                                                                            | —                   |
| `typescript`                                                                 | 82                                                                                                                         | P4 (2), P6 (80)     |
| `javascript`                                                                 | 6                                                                                                                          | P3 (1), P6 (5)      |
| `sql`                                                                        | 5                                                                                                                          | P3, P5, P6          |
| `bash`, mô phỏng riêng (`git`/`hermes`/`vibe`/`openclaw` — 4 khoá ngắn)      | 3 + 76 = 79                                                                                                                | P6, 4 khoá ngắn     |
| `html`/`dom`/`fetch`                                                         | 9                                                                                                                          | P3, P6              |

**Phát hiện quan trọng nhất: Kotlin, Swift, `bash`, và 4 khoá ngắn mô phỏng (`git`/`hermes`/
`vibe`/`openclaw`) KHÔNG chạy mã thật.** Đọc `apps/dhcb/src/lib/kotlinRunner.ts` (comment nguyên
văn): _"bộ chạy là trình thông dịch cây thuần TypeScript, KHÔNG gọi eval và KHÔNG thực thi mã
của học viên bằng máy JavaScript — nó chỉ duyệt cây cú pháp, và đã có hai trần cứng (số bước +
độ dài output) nên không thể treo."_ Xác nhận tương tự ở `packages/subject-programming/
bashSim.ts` (biến `TRAN_LENH` chặn số lệnh thực thi + cú pháp CỐ Ý không hỗ trợ `while`/`case`/
`function` — không thể viết vòng lặp vô hạn) và `gitSim.ts`/`hermesSim.ts`/`vibeSim.ts`/
`openclawSim.ts` (`grep eval|new Function|child_process` cả 4 file: **0 kết quả**). Cổng nội
dung `lessonsKotlin.test.ts`/`lessonsSwift.test.ts`/`lessonsBash.test.ts`/`lessonsGit.test.ts`/
`lessonsHermes.test.ts`/`lessonsOpenclaw.test.ts`/`lessonsVibe.test.ts` ĐÃ gọi đúng các hàm
`chayKotlin()`/`chaySwift()`/`chayBash()`… này thẳng trong Node (Vitest) ngay bây giờ, cho mọi
bài trong registry — HẠ TẦNG CHẤM-LẠI-Ở-SERVER **ĐÃ TỒN TẠI VÀ ĐANG CHẠY**, chỉ chưa được gọi từ
API `/progress`.

**Sửa lại so với đánh giá ban đầu: `html`/`dom`/`fetch` (9 bài) KHÔNG thuộc nhóm an toàn — cùng
rủi ro với JavaScript/TypeScript, thậm chí NẶNG hơn.** Đọc `packages/subject-programming/
domPrelude.ts` dòng 70-72 và `fetchPrelude.ts` dòng 73-76: cả hai chạy code học viên bằng
**`new Function('document', 'window', js)(document, window)`** — thực thi JS thật ngay trong
CÙNG realm với tiến trình gọi nó (không có ranh giới `vm.createContext` nào bọc ngoài như JS/TS
thường). Ba nhóm này phải gộp chung một tầng rủi ro với JS/TS ở Phương án B, KHÔNG được xếp vào
nhóm "gọi thẳng hàm thông dịch, an toàn tuyệt đối" của Kotlin/Swift/bash-sim.

**Nhóm giữa — SQL:** `apps/dhcb/src/lib/sqlRunner.ts` dùng `sql.js` (SQLite biên dịch WASM) —
DB `:memory:`, không có I/O file/mạng thật ở tầng SQL chuẩn (không tính `ATTACH DATABASE`/
`load_extension` nếu không tắt). Rủi ro thấp nhưng CHƯA đọc kỹ cấu hình `sqlWorker.ts` có tắt
hai tính năng đó chưa — cần xác minh trước khi chấm ở server (server chạy chung tiến trình,
khác iframe cô lập của trình duyệt).

**Nhóm rủi ro thật — JavaScript/TypeScript + html/dom/fetch (97 bài):**
`packages/subject-programming/lessonsJs.test.ts` chạy code học viên bằng
`vm.createContext({...}); vm.runInContext(code, context, {timeout})` — tài liệu Node chính thức
nói thẳng: **"The vm module is not a security mechanism. Do not use it to run untrusted code."**
`html`/`dom`/`fetch` còn yếu hơn: `new Function(...)` không có NỔI ranh giới `vm.createContext`.
Đây là rủi ro THẬT, không phải lý thuyết — khác hẳn Kotlin/Swift/bash-sim (trình thông dịch cây
tự viết, không đụng tới máy ảo JS của Node). TypeScript đi qua cùng đường (transpile rồi chạy
bằng `vm`, `tsPrelude.ts`).

**Nhóm P5/P6 dùng Python:** đây là ĐÚNG HẠ TẦNG đã build cho ADR-0007
(`completionSandboxServer.ts` dùng `laLanPython()`/`grading.ts`/`pyLanes.ts` — không phân biệt
theo bậc) — lý do DUY NHẤT các bài này chưa được chấm là biểu thức chính quy
`SPINE_P1_P4_RE = /^p[1-4]-u\d+-l\d+$/` cố ý chặn P5/P6 và không khớp id khoá ngắn
(`ml-u1-l1`…). ADR-0007 chọn phạm vi hẹp CÓ CHỦ ĐÍCH lúc đó ("bước đầu") — không phải vì P5/P6
có rủi ro khác P1-P4.

**Bước dự án (`p<n>-s<x>`) và tiêu chí hướng chuyên sâu (`web-s2-m1`…):** không chấm bằng
test-case input/output — `projectStepTypes.ts` dùng `referenceCode` (code mẫu tham khảo, không
phải bộ test tự động) và tiêu chí hướng chuyên sâu là rubric văn bản (đọc
`docs/research/dac-ta-huong-chuyen-sau-mon-lap-trinh-2026-08-27.md` §2.5). Đây KHÔNG PHẢI cùng
bài toán "chấm lại test-case" — chấm được cần một cơ chế khác hẳn (chấm bằng AI đọc code so
rubric, hoặc buộc nộp link deploy/artifact) — NGOÀI PHẠM VI ADR này.

## Các phương án đã cân nhắc

### A. Coi "ngoài P1-P4" là MỘT khối, hoãn tất cả chờ thiết kế sandbox đa ngôn ngữ

- Được: đơn giản, không phải quyết định gì thêm.
- Mất: khoá oan 374 bài (Kotlin/bash/4 khoá mô phỏng/P5-P6 Python/khoá ngắn Python) vốn KHÔNG
  có rủi ro bảo mật thật hoặc đã có hạ tầng chấm sẵn, chỉ vì 97 bài JS/TS/dom/html/fetch thật sự
  cần quyết định khó hơn. Vi phạm CLAUDE.md mục 3 "chia nhỏ" — gộp việc rẻ với việc đắt thành
  một khối không tất yếu.

### B. [ĐỀ XUẤT] Chia 3 đợt theo đúng ranh giới rủi ro đã đo được ở trên

- **Đợt B1 — mở rộng phạm vi Python (rẻ nhất, rủi ro = 0 so với ADR-0007):** nới
  `SPINE_P1_P4_RE` thành `^p[1-6]-u\d+-l\d+$` + nhận thêm id khoá ngắn Python
  (`(ml|pyai|mathai|mlds|cv1|cv2|llmagent)-u\d+-l\d+`). KHÔNG đổi một dòng nào trong
  `completionSandboxServer.ts` — chỉ đổi phạm vi regex nhận diện. Bao phủ thêm 285 bài.
- **Đợt B2 — chấm lại Kotlin/Swift/bash/git/hermes/vibe/openclaw bằng GỌI THẲNG hàm thông dịch
  (không cần subprocess/sandbox mới):** các hàm `chayKotlin()`/`chaySwift()`/`chayBash()`/
  `chayGit()`/`chayHermes()`/`chayVibe()`/`chayOpenclaw()` đã THUẦN (không I/O, có trần bước +
  trần output), gọi thẳng trong tiến trình Node của API — CÙNG MỨC TIN CẬY như gọi `grading.ts`
  hiện tại (không phải "chạy code không tin cậy", vì các hàm này không bao giờ nhường quyền điều
  khiển cho input của học viên theo nghĩa Turing-complete-trên-máy-thật). Bao phủ thêm 89 bài
  (Kotlin 7 + bash/git/hermes/vibe/openclaw 79 + Swift khi có bài).
- **Đợt B3 — JavaScript/TypeScript + html/dom/fetch (CẦN QUYẾT ĐỊNH RIÊNG, không tự chốt trong
  ADR này):** `vm`/`new Function` không phải hàng rào bảo mật thật theo tài liệu Node — ba
  hướng khả dĩ: (i) chấp nhận rủi ro có kiểm soát (context tối giản, không expose `require`/
  `process`/`global`, timeout cứng — giống hệt cấu hình hiện tại của `lessonsJs.test.ts`, chấp
  nhận vì đây là hạn chế đã biết và không có API nhạy cảm nào trong tầm với của
  `vm.createContext({})` rỗng — riêng `html`/`dom`/`fetch` cần bọc lại bằng `vm` thay vì
  `new Function` trần trước khi áp dụng hướng này); (ii) chạy trong tiến trình con
  `node -e`/module riêng giống cách Python đã làm (subprocess cách ly hệ điều hành thay vì cách
  ly trong-tiến-trình của `vm`); (iii) giữ "client tự khai" cho nhóm này thêm một đợt, chờ đo
  rủi ro kỹ hơn. Bao phủ 97 bài NẾU chốt.
- Được: mỗi đợt độc lập, kiểm chứng được riêng, không đợt nào chặn đợt khác; đúng CLAUDE.md mục
  3 "chia nhỏ" — 374/476 bài (79%; B1 = 285 bài Python P5/P6/khoá ngắn, B2 = 89 bài Kotlin/bash/
  4 mô phỏng) đóng được mà KHÔNG đụng tới câu hỏi khó (B3 = 97 bài JS/TS/dom/html/fetch, 5 bài SQL
  đứng ngoài cả hai chờ xác minh riêng — xem câu hỏi 3).
- Mất: vẫn phải quay lại B3 sau — không giải quyết dứt điểm "ngoài P1-P4" trong một PR.

### C. Chạy CẢ JS/TS trong subprocess Node riêng (như Python), né hẳn rủi ro của `vm`

- Được: nhất quán kiến trúc với Python, cách ly ở mức hệ điều hành thay vì trong-tiến-trình.
- Mất: `node -e "<code>"` KHÔNG có allowlist import kiểu Python (`require('fs')`,
  `require('child_process')` là built-in, không cần "import" theo nghĩa chặn được bằng
  `__import__` override) — cần cơ chế khác hẳn để chặn (`--disable-proto`, xoá `require` khỏi
  scope bằng cách bọc trong ESM module ảo không có `require`, hoặc dùng `node:vm` NHƯNG BÊN
  TRONG tiến trình con thay vì tiến trình chính để giới hạn thiệt hại nếu `vm` bị thoát). Đây
  chính là câu hỏi cần chốt ở B3, không phải thứ ADR này tự quyết được ngay — xem "Câu hỏi".

## Quyết định (đề xuất — CHƯA CHỐT)

Đề xuất đi theo **Phương án B**: thi hành B1 + B2 trong MỘT PR (rủi ro bằng 0, dùng lại hạ tầng
đã kiểm chứng), để B3 (JavaScript/TypeScript) làm một ADR/PR RIÊNG sau khi chủ dự án chốt hướng
cách ly.

**Vì sao loại A:** khoá oan phần việc an toàn/rẻ chỉ vì có phần khó lẫn trong cùng nhãn "ngôn
ngữ khác Python" — vi phạm nguyên tắc chia nhỏ. **Vì sao chưa chốt C ngay:** cần chủ dự án xác
nhận mức chấp nhận rủi ro cho `vm` (câu hỏi 1 bên dưới) trước khi chọn giữa (i)/(ii)/(iii) — đây
đúng loại quyết định CLAUDE.md mục 12 liệt kê phải dừng hỏi ("đụng bảo mật", "nhiều giải pháp
đánh đổi khác nhau đáng kể").

## Câu hỏi cần chủ dự án chốt trước khi thi hành B3 (B1+B2 có thể thi hành ngay, không cần chờ)

1. **JavaScript/TypeScript + html/dom/fetch (97 bài): chấp nhận rủi ro của `node:vm` (context tối giản + timeout,
   giống cấu hình `lessonsJs.test.ts` hiện tại), hay bắt buộc thêm lớp cách ly hệ điều hành
   (subprocess riêng, tương tự Python) trước khi chấm ở server?** Đánh đổi: chấp nhận `vm` là
   nhanh (không code mới ngoài việc gọi lại `wrapJavaScript`/hàm chạy đã có) nhưng Node tự nhận
   đây không phải hàng rào bảo mật; thêm subprocess an toàn hơn nhưng cần thiết kế allowlist
   RIÊNG cho JS (khác Python — `require` là built-in, không "import" được để chặn theo cách cũ).
2. **Có mở rộng B1 sang bước dự án (`p<n>-s<x>`) không?** Đề xuất mặc định: KHÔNG — bước dự án
   chấm bằng rubric/artifact chứ không phải test-case, cần thiết kế hoàn toàn khác (ngoài phạm
   vi ADR này, xem "Bằng chứng" ở trên). Đồng ý giữ ngoài phạm vi, hay muốn gộp vào?
3. **Có cần xác minh cấu hình `sql.js` (`sqlWorker.ts`) đã tắt `ATTACH DATABASE`/
   `load_extension` trước khi B-nào-đó chấm SQL ở server không, hay để SQL đứng ngoài B1/B2 (đợt
   riêng, sau khi xác minh)?** Đề xuất mặc định: để SQL đứng ngoài B1/B2, xác minh + xử lý ở một
   PR riêng nhỏ (chỉ 5 bài, không đáng gộp vào B1/B2 khi câu hỏi bảo mật đó còn treo).

## Hệ quả (áp dụng SAU KHI chốt câu hỏi trên, với B1+B2 không cần chờ)

- **B1+B2 kéo theo:** sửa `isServerRegradableLesson()` (nới regex + nhận thêm ngôn ngữ mô
  phỏng), thêm nhánh gọi đúng hàm thông dịch theo `lesson.language` trong
  `regradeMakeSubmission()` (hoặc tách hàm mới cùng file), cập nhật test
  `completionSandboxServer.test.ts` cho từng ngôn ngữ mới, cập nhật `progress.ts`'s
  `UpdateSchema`/`BatchSchema` (đã có trường `code` optional — không cần đổi wire contract),
  cập nhật client (`saveLessonProgress` gọi ở các trang bài Kotlin/Swift/bash/git/hermes/vibe/
  openclaw/khoá ngắn Python) để gửi kèm `code`.
- **B3 kéo theo (nếu chốt hướng (i) hoặc (ii)):** module chấm JS/TS mới, KHÔNG dùng chung
  `completionSandboxServer.ts` (khác cơ chế cách ly), rate-limit riêng (có thể dùng chung bucket
  `programming-regrade-fail` theo `lessonId`).
- **Chấp nhận đánh đổi:** thêm tải CPU/RAM cho mỗi lượt nộp bài Kotlin/Swift/bash-sim/…
  (thông dịch cây rẻ hơn NHIỀU so với subprocess Python — không cần `fork()`, không cần
  `ulimit`/`sudo`) — không cần rate-limit riêng ngoài cái đã có, nhưng nên đo thử trước khi
  khẳng định.
- **Điều kiện xem lại:** nếu B2 phát hiện một hàm thông dịch nào đó (ví dụ `hermesSim.ts`) có
  đường I/O ẩn chưa rà hết, tách bài đó khỏi B2, xử lý riêng như B3.
