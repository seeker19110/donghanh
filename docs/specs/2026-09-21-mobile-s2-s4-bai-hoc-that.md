# Đặc tả — `mobile-s2`/`mobile-s3`/`mobile-s4`: bài học thật cho ba chặng còn thiếu hướng Di động

> Ngày: 2026-09-21 · Trạng thái: **CHỜ CHỦ DỰ ÁN DUYỆT**
> Tiếp mạch: `docs/specs/2026-08-31-bai-hoc-chang-s1-huong-di-dong.md` (`mobile-s1`, đã merge —
> `p6-u131..133`, làn `typescript`). Sau đợt này hướng Di động (`packages/subject-programming/specializations/mobile.ts`)
> có đủ 4/4 chặng bấm "Vào học" được.
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`.

## 0. Một câu

Soạn 12 unit / ≥ 24 bài học 8 bước cho `mobile-s2`, `mobile-s3`, `mobile-s4` (mỗi chặng 4 unit,
1 unit = 1 module gốc), làn `typescript` mô phỏng tất định — nối chặng vào giáo trình P6, giữ
nguyên quyết định "không bịa API Compose/SwiftUI/RN" đã chốt ở `mobile-s1`.

## ① Phạm vi

**LÀM:**

- 12 unit mới, mỗi chặng đúng 4 unit ánh xạ 1:1 vào 4 module gốc của chặng đó trong
  `packages/subject-programming/specializations/mobile.ts` (mảng `stages`, phần tử
  `mobile-s2`/`mobile-s3`/`mobile-s4`):
  - `mobile-s2`: `p6-u214` (m1 mạng môi trường xấu) · `p6-u215` (m2 xác thực trên điện thoại) ·
    `p6-u216` (m3 quyền & cảm biến) · `p6-u217` (m4 kiểm thử & phát hành thử).
  - `mobile-s3`: `p6-u218` (m1 hiệu năng giao diện) · `p6-u219` (m2 pin/bộ nhớ/dung lượng) ·
    `p6-u220` (m3 kiến trúc app lớn) · `p6-u221` (m4 trải nghiệm chuẩn nền tảng).
  - `mobile-s4`: `p6-u222` (m1 phát hành chuyên nghiệp) · `p6-u223` (m2 quan sát từ xa) ·
    `p6-u224` (m3 nền tảng & mã dùng chung) · `p6-u225` (m4 bảo mật ứng dụng di động).
- Mỗi unit ≥ 2 lesson theo vòng 8 bước (hook → theory → workedExample → predict → parsons →
  make/testCases → homework → thẻ SRS), làn `typescript`, chạy qua `lessonsTs.test.ts`
  (tsc thật + `node:vm`).
- Mỗi Make là simulator TypeScript thuần, tất định, bounded, fail closed: in đúng một dòng
  `"<decision>: <reason>"`; có ca hiện + ca ẩn + **ca âm**; `match: 'contains'`.
- Nối `SPEC_STAGE_UNITS['mobile-s2'|'mobile-s3'|'mobile-s4']` trong `stageUnits.ts`, đăng ký
  vào `lessons.ts` (registry đồng bộ) và `curriculum.ts` (gắn vào bậc P6), sinh lại
  `lessonsLazy.ts` bằng `npm run gen:lesson-index`.
- Semantic gate riêng cho lát cắt (theo tiền lệ `devopsS3Lessons.test.ts`).
- Nhật ký đợt việc mới trong `docs/changelog/`.

**KHÔNG LÀM:**

- Không đụng `mobile-s1` (`p6-u131..133`) đã phát hành, không đổi/tái dùng unit id đã cấp cho
  hướng khác.
- Không dựng Android Studio/Xcode/máy ảo/máy thật, không gọi Firebase/Fastlane/App
  Store/Play Console thật, không network/filesystem/subprocess/biến môi trường/`datetime.now`/
  random toàn cục trong code chạy được. Phần cần máy thật hoặc tài khoản nhà phát triển
  (build & cài lên điện thoại thật, nộp chợ ứng dụng, TestFlight/Internal testing thật, dịch
  ngược gói cài thật) chỉ nằm ở rubric bài tập về nhà NGOÀI sandbox — ghi rõ trong `homework`.
  Ca cụ thể theo unit: xem cột "Bài tập về nhà ngoài sandbox" ở mục ③.
- Không bịa API Compose/SwiftUI/React Native/Flutter cụ thể (giữ nguyên lý do đã chốt ở
  `mobile-s1` — xem mục ⑥).
- Không thêm ngôn ngữ mới vào `LESSON_LANGUAGES`, không đổi UI/route, không đổi schema DB,
  không đụng luồng auth/thanh toán, không sửa `PROGRESS.md`.
- Không tự quyết việc nối `mobile-s2/s3/s4` vào một lộ trình mục tiêu (`learningPaths/`) —
  hiện chưa lộ trình nào tham chiếu `mobile-*`; để mục ⑧.

## ② Điểm chạm

| Việc | Đường dẫn file                                                 | Ghi chú                                                                                       |
| ---- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u214.ts` … `p6u217.ts` | 4 unit `mobile-s2`                                                                            |
| Thêm | `packages/subject-programming/lessons/p6u218.ts` … `p6u221.ts` | 4 unit `mobile-s3`                                                                            |
| Thêm | `packages/subject-programming/lessons/p6u222.ts` … `p6u225.ts` | 4 unit `mobile-s4`                                                                            |
| Thêm | `packages/subject-programming/mobileS2S4Lessons.test.ts`       | Semantic gate của lát cắt (theo mẫu `devopsS3Lessons.test.ts`)                                |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts`   | Thêm 3 khoá `mobile-s2`/`mobile-s3`/`mobile-s4`, nối vào comment tiền lệ đang có ở dòng 76-83 |
| Sửa  | `packages/subject-programming/lessons.ts`                      | Đăng ký 12 unit vào registry đồng bộ                                                          |
| Sửa  | `packages/subject-programming/curriculum.ts`                   | Gắn 12 unit vào bậc P6, nối tiếp sau `p6-u201`                                                |
| Sửa  | `packages/subject-programming/lessonsLazy.ts`                  | **SINH LẠI** bằng `npm run gen:lesson-index`, không gõ tay                                    |
| Thêm | `docs/changelog/NNNN-2026-09-2x-mobile-s2-s4-bai-hoc-that.md`  | Nhật ký đợt việc, số lấy từ `npm run changelog` lúc thi hành                                  |

**Ảnh hưởng lan ra (chạy `npm run codemap -- impact packages/subject-programming/specializations/stageUnits.ts` trước khi sửa):**

- `stageUnits.test.ts`, `lessonsLazy.test.ts`, `lessonsTs.test.ts`, `curriculum.test.ts`,
  `srsCards.test.ts` — đã xác nhận các file này tồn tại thật (`ls packages/subject-programming`).
- Không có `learningPaths/*.ts` nào tham chiếu `mobile-s*` hiện nay (đã `grep` xác nhận) nên
  không có mẫu số tiến độ nào bị đổi ở lát này — khác với tiền lệ `devops-s3`.

## ③ Hợp đồng dữ liệu

**Vào (hằng biên dịch trong `stageUnits.ts`):**

```ts
SPEC_STAGE_UNITS['mobile-s2'] = ['p6-u214', 'p6-u215', 'p6-u216', 'p6-u217']
SPEC_STAGE_UNITS['mobile-s3'] = ['p6-u218', 'p6-u219', 'p6-u220', 'p6-u221']
SPEC_STAGE_UNITS['mobile-s4'] = ['p6-u222', 'p6-u223', 'p6-u224', 'p6-u225']
```

**Hợp đồng từng unit** — simulator nhận một object trạng thái (không I/O ngoài), trả về đúng
một dòng `"<decision>: <reason>"`:

| Unit      | Module                                    | Hợp đồng simulator và ca biên BẮT BUỘC                                                                                                                                                                                                                                                                                                       | Bài tập về nhà ngoài sandbox                                                                       |
| --------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `p6-u214` | `mobile-s2-m1` Mạng ở môi trường xấu      | Hàng đợi thao tác offline + retry có backoff. Request hết `maxRetries` → `fail`; hai request cùng khoá idempotent → `dedup` (không gửi lần hai); backoff âm/0 → `invalid`; hàng đợi rỗng khi có mạng lại → `noop`.                                                                                                                           | Bật chế độ máy bay thật giữa lúc gửi đơn trên máy thật, kiểm đơn tự gửi khi có mạng lại.           |
| `p6-u215` | `mobile-s2-m2` Xác thực trên điện thoại   | Máy trạng thái refresh token: `access` còn hạn → `allow`; hết hạn nhưng `refresh` còn hạn → `refresh`; cả hai hết hạn → `logout`; refresh thất bại giữa chừng (network lỗi mô phỏng) → `retry-refresh` KHÔNG đá thẳng ra đăng nhập.                                                                                                          | Lưu token thật vào Keychain/Keystore trên thiết bị, xác nhận gỡ app là mất token.                  |
| `p6-u216` | `mobile-s2-m3` Quyền và cảm biến          | Yêu cầu quyền có ngữ cảnh (đã giải thích lý do chưa, đúng thời điểm chưa). Xin quyền không kèm lý do → `deny`; bị từ chối nhưng có đường lui (ảnh có sẵn thay camera) → `fallback`; xin lại quá số lần cho phép của hệ điều hành → `blocked`; quyền không khai báo trong manifest mô phỏng mà vẫn xin → `invalid`.                           | Chạy app thật trên máy với mọi quyền bị từ chối tay, xác nhận không màn nào sập.                   |
| `p6-u217` | `mobile-s2-m4` Kiểm thử và phát hành thử  | Cổng phát hành thử: thiếu chữ ký → `reject`; `versionCode` không tăng so với bản trước → `reject`; đủ điều kiện và có ≥ ngưỡng người thử tối thiểu → `allow`; thiếu ghi chú thay đổi → `warn` (vẫn cho qua, không chặn).                                                                                                                     | Nộp bản thử thật lên TestFlight/Internal testing, mời ≥ 5 người ngoài cài và ghi phản hồi.         |
| `p6-u218` | `mobile-s3-m1` Hiệu năng giao diện        | Ngân sách khung hình 16ms: tổng thời gian frame (build + layout + draw) vượt ngân sách → `drop-frame`; danh sách dài không ảo hoá (số item render = tổng item) → `deny`; ảnh giải mã trên luồng chính (flag `onMainThread`) → `deny`; đạt ngân sách và có ảo hoá → `allow`.                                                                  | Đo số khung rơi thật bằng profiler của nền tảng trên máy đời thấp, không phải máy ảo.              |
| `p6-u219` | `mobile-s3-m2` Pin, bộ nhớ, dung lượng    | Công việc nền: dùng cơ chế hẹn giờ riêng thay vì WorkManager/BackgroundTasks chuẩn → `deny` (hao pin); tham chiếu không giải phóng sau khi màn đóng (đếm allocation còn sống) → `leak`; dung lượng gói vượt ngưỡng đã khai báo → `oversize`; đạt cả ba điều kiện → `allow`.                                                                  | Đo mức pin tiêu thụ thật khi app chạy nền 1 giờ trên thiết bị.                                     |
| `p6-u220` | `mobile-s3-m3` Kiến trúc app lớn          | Kiểm ranh giới lớp: lớp trình bày gọi thẳng nguồn mạng/CSDL (bỏ qua kho dữ liệu) → `deny`; lớp dữ liệu phụ thuộc trực tiếp một implementation cụ thể thay vì interface tiêm vào → `deny`; đủ tách lớp và test lớp dữ liệu ≥ ngưỡng tối thiểu → `allow`; thiếu test → `warn`.                                                                 | Viết ≥ 10 test thật cho lớp dữ liệu, chạy trên máy chủ CI không cần máy ảo.                        |
| `p6-u221` | `mobile-s3-m4` Trải nghiệm chuẩn nền tảng | Rà trợ năng tĩnh: nút chỉ có icon không có nhãn mô tả → `deny`; bố cục dùng chiều cao cố định (không co giãn) ở nơi có văn bản dài → `deny`; cỡ chữ hệ thống phóng to vượt khung không co giãn theo → `deny`; đủ nhãn + co giãn + hỗ trợ chế độ tối → `allow`.                                                                               | Đi trọn luồng chính thật bằng TalkBack/VoiceOver trên thiết bị, ghi lại chỗ kẹt.                   |
| `p6-u222` | `mobile-s4-m1` Phát hành chuyên nghiệp    | Rollout theo tỉ lệ: tỉ lệ lỗi phiên vượt ngưỡng dừng đã cấu hình → `halt-rollout`; bản app dưới `minSupportedVersion` gọi API → `force-update`; tăng tỉ lệ rollout khi đang trong cửa sổ theo dõi tối thiểu chưa đủ → `deny`; đủ điều kiện và dưới ngưỡng lỗi → `advance`.                                                                   | Dựng CI/CD thật build–test–nộp chợ bằng Fastlane hoặc tương đương, không thao tác tay.             |
| `p6-u223` | `mobile-s4-m2` Quan sát từ xa             | Cờ tính năng + đọc crash: thiếu bản đồ giải mã (`sourceMap` rỗng) khi symbolicate → `unresolved` (không được đoán tên hàm); tỉ lệ crash vượt ngưỡng cấu hình từ xa → `auto-disable-flag`; lấy cấu hình cờ từ xa thất bại → `use-safe-default` (fail closed về giá trị an toàn đã khai, không phải bật bừa); đủ điều kiện đọc được → `allow`. | Bật thu thập sự cố thật trên bản phát hành, tạo một sự cố cố ý và xác nhận hiện lên bảng theo dõi. |
| `p6-u224` | `mobile-s4-m3` Nền tảng và mã dùng chung  | Phân loại logic dùng chung vs riêng nền tảng: hàm thuần không đụng UI/API hệ điều hành → `share`; hàm gọi API riêng nền tảng (ví dụ cảm biến đặc thù) → `platform-specific`; thư viện nội bộ tăng version major mà không có ghi chú thay đổi (breaking) → `deny`; đủ điều kiện phát hành thư viện → `publish`.                               | Viết một module gốc thật cho phần cầu nối chung không đáp ứng nổi, đo chênh lệch hiệu năng thật.   |
| `p6-u225` | `mobile-s4-m4` Bảo mật ứng dụng di động   | Rà bí mật + chống rò dữ liệu: khoá bí mật có giá trị nằm trong mã nguồn/gói cài (không phải tham chiếu server) → `deny`; màn đánh dấu nhạy cảm không bật chống chụp màn → `deny`; dữ liệu nhạy cảm bị đưa vào bản sao lưu tự động (flag `allowBackup` bật cho trường nhạy cảm) → `deny`; đủ ba điều kiện an toàn → `allow`.                  | Dịch ngược gói cài thật của chính mình, xác nhận không tìm được khoá dùng được.                    |

**Ra (mọi simulator):** một dòng quyết định xác định, dạng `"<decision>: <reason>"` với
`decision` thuộc tập liệt kê ở cột hợp đồng của từng unit (không dùng chung một enum toàn cục —
mỗi unit có ngữ nghĩa quyết định riêng, giống cách `devops-s3` làm cho bốn unit của nó).

**Ca lỗi (áp dụng cho mọi unit, là một phần hợp đồng):**

| Tình huống                                           | Hành vi mong đợi                                                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Input rỗng, thiếu trường, sai kiểu                   | In một dòng `invalid: <trường>`, không ném exception, không treo                                                    |
| Trạng thái không nhận dạng được / mâu thuẫn hai luật | Fail closed về nhánh an toàn nhất đã liệt kê (`deny`/`reject`/`unresolved`…), thứ tự ưu tiên tường minh và tất định |
| Đo lường/ngưỡng thiếu dữ liệu để kết luận            | Trả nhãn "chưa đủ dữ liệu" tường minh (ví dụ `unknown`), **cấm** suy diễn thành "an toàn"/"đạt"                     |

## ④ Tiêu chí chấp nhận

- [ ] `unitsOfStage('mobile-s2'|'mobile-s3'|'mobile-s4').length === 4` với mỗi chặng, mỗi unit ≥ 2 lesson — `npx vitest run packages/subject-programming/specializations/stageUnits.test.ts`
- [ ] 12 unit đều là làn `typescript`, biên dịch bằng tsc thật + chạy `node:vm`, ví dụ mẫu qua hết test-case — `npx vitest run packages/subject-programming/lessonsTs.test.ts`
- [ ] Mỗi Make có ít nhất một ca test HIỆN, `unitId` tồn tại thật trong `curriculum.ts` — `npx vitest run packages/subject-programming/lessons.test.ts`
- [ ] Gate ngữ nghĩa riêng của lát cắt xanh, gồm kiểm ca âm và cấm markers cấm (`process.env`, `require('fs')`, `fetch(`, `Date.now()` ngoài phần đã seed tất định, `Math.random()`) — `npx vitest run packages/subject-programming/mobileS2S4Lessons.test.ts`
- [ ] Predict không có phương án nhiễu nào khớp trùng/là chuỗi con của output thật (bài học đã mắc ở `mobile-s1`, xem mục ⑥)
- [ ] `lessonsLazy.ts` được SINH LẠI, không sửa tay — `npm run gen:lesson-index` rồi `git diff` chỉ hiện phần sinh
- [ ] Thẻ SRS: mỗi thẻ hỏi đúng một ý, đáp án ≥ 40 ký tự, câu hỏi không tự lộ đáp án — `npx vitest run packages/subject-programming/srsCards.test.ts`
- [ ] Make dùng `match: 'contains'` (runner echo stdin, so khớp tuyệt đối sẽ đỏ giả)
- [ ] `npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build` sạch

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/mobileS2S4Lessons.test.ts
npx vitest run packages/subject-programming/lessonsTs.test.ts
npx vitest run packages/subject-programming/lessons.test.ts
npx vitest run packages/subject-programming/curriculum.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npx vitest run packages/subject-programming/lessonsLazy.test.ts
npx vitest run packages/subject-programming/srsCards.test.ts
npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                                                | Test nào canh nó                                 |
| --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Chỉ khai chặng có bài khi unit thật đã tồn tại                                          | `specializations/stageUnits.test.ts`             |
| Chỉ mục nạp lười khớp registry đồng bộ                                                  | `lessonsLazy.test.ts`                            |
| Mọi lesson `typescript` biên dịch tsc thật, code mẫu chạy qua hết test-case             | `lessonsTs.test.ts`                              |
| `unitId` của mọi bài phải tồn tại trong `curriculum.ts`, Make có ca test HIỆN           | `lessons.test.ts`                                |
| Một unit không được gán cho hai chặng                                                   | `specializations/stageUnits.test.ts`             |
| Predict không có phương án nhiễu khớp/là chuỗi con của output thật                      | `lessonsTs.test.ts`                              |
| Simulator không có I/O ngoài, không in bí mật, không random/đồng hồ hệ thống không seed | `mobileS2S4Lessons.test.ts` (viết mới ở lát này) |
| Thẻ SRS không tự lộ đáp án, đáp án đủ dài                                               | `srsCards.test.ts`                               |

## ⑥ Quy ước dự án liên quan

- **Làn ngôn ngữ: `typescript`**, giữ nguyên lý do đã chốt ở `mobile-s1`
  (`docs/specs/2026-08-31-bai-hoc-chang-s1-huong-di-dong.md` mục "Quy ước dự án") — làn
  `kotlin`/`swift` có `kotlinSim/` nhưng KHÔNG có bài học nào khai dùng nên chưa được CI chứng
  minh chấm đúng; `lessonsTs.test.ts` chấm bằng tsc thật + `node:vm`. Nguyên lý dạy ở cả 12 unit
  (retry/backoff, máy trạng thái token, cây quyết định quyền, cổng phát hành, ngân sách khung
  hình, phát hiện rò tham chiếu, ranh giới lớp kiến trúc, kiểm trợ năng tĩnh, rollout theo tỉ lệ,
  symbolicate + feature flag, phân loại mã dùng chung, rà bí mật) là nguyên lý CHUNG cho Android
  lẫn iOS, mô phỏng được bằng hàm thuần tất định — không cần API Compose/SwiftUI/RN cụ thể.
- **Không gộp module:** khác `mobile-s1` (gộp m3+m4 vì dải id chỉ có 3 chỗ cho 4 module), đợt
  này dải id cấp đủ 4 chỗ cho 4 module của mỗi chặng nên map 1:1, không cần lý do gộp.
- Import xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi `.js`; import nội bộ gói dùng đường
  tương đối CÓ đuôi `.js`.
- Thêm/đổi bài học xong **bắt buộc** chạy `npm run gen:lesson-index`; quên thì `lessonsLazy.test.ts`
  đỏ với đúng câu nhắc đó.
- Comment trong file bài học viết tiếng Việt, giải thích "vì sao", không mô tả lại code.
- Cổng test của CI là `npm run test:coverage` (có ngưỡng chặn), không phải `npm test`.
- Trước lần push cuối: `rm -rf packages/*/dist dist dist-server` rồi chạy lại `npm run typecheck`
  để tái hiện checkout sạch của CI.
- Tiêu đề PR dùng scope chữ thường, ví dụ `feat(programming): ...`; mô tả phải có đủ 6 tiêu đề
  của cổng `metadata` và trỏ tới chính file đặc tả này kèm cụm "Approved for implementation"
  (chỉ thêm cụm đó SAU khi chủ dự án đã duyệt — xem mục ⑧).

## ⑦ Rollout và rollback

Một PR cho cả 12 unit (hoặc chia 3 PR theo chặng nếu chủ dự án muốn review nhỏ hơn — không bắt
buộc trong đặc tả này, để mở ở mục ⑧). Rollback = revert trọn PR rồi chạy lại
`npm run gen:lesson-index`; KHÔNG xoá tiến độ/artifact của người học và KHÔNG tái sử dụng unit id
đã cấp (`p6-u214..225`) cho việc khác dù PR có bị revert. Rủi ro lớn nhất là người học nhầm
simulator TypeScript với hành vi thật của Android/iOS — comment "MÔ PHỎNG" ở đầu mỗi file
simulator, gate ngữ nghĩa, và cột "Bài tập về nhà ngoài sandbox" ở mục ③ là ba lớp chặn.

## ⑧ Quyết định cần chủ dự án duyệt

1. **Cấp dải id `p6-u214..217` (mobile-s2), `p6-u218..221` (mobile-s3), `p6-u222..225`
   (mobile-s4)** — dải này đã được brief giao việc cấp trước, đặc tả chỉ xác nhận lại; chủ dự án
   duyệt nghĩa là khoá dải, không cấp trùng cho lát khác đang chạy song song.
2. **Có nối `mobile-s2`/`mobile-s3`/`mobile-s4` (và `mobile-s1` cũ) vào một lộ trình mục tiêu
   trong `learningPaths/` hay không?** Hiện KHÔNG lộ trình nào tham chiếu `mobile-*` (đã xác
   nhận bằng `grep`), khác các hướng khác đã có bài học (`devops-*` nối vào `principal-ai`).
   Đặc tả này KHÔNG tự quyết việc đó vì cần biết lộ trình nào đang được ưu tiên xây (chưa có
   "mobile engineer path" trong `learningPaths/` để nối vào).
3. **Chia 1 PR hay 3 PR** (theo từng chặng) — đặc tả mặc định 1 PR cho gọn nhật ký, nhưng nếu
   chủ dự án muốn review từng chặng riêng thì báo trước khi thi hành.

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ:
