# 0408 — 2026-09-22 — Trả nợ từ điển + cấu trúc bài phát hiện ở audit 0406

> PR: #1102 (phần lớn — gộp cùng nhánh với đợt 0406, đã merge) + PR kế tiếp (phần chốt: `security-s3` topics, nhật ký này). Chủ dự án yêu cầu "triển theo hướng chất lượng tốt
> nhất" ngay sau đợt audit, nhánh phát triển được chỉ định là một, nên mở rộng PR thay vì tách).

## Việc đã làm

**1. Bộ sinh dạng từ của từ điển (`apps/dhcb/src/lib/wordForms.ts` + `data/irregularForms.ts`)**
— sửa tận gốc 5 lớp lỗi, rồi chạy lại `npm run gen:word-forms` (sửa luôn đường gốc sai `..` →
`../..` vì script đã dời vào `archive/`):

| Lớp lỗi                                                           | Sửa                                                                                                                                                           | Ví dụ trước → sau                                                                                                                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Động từ có TIỀN TỐ ghép với gốc bất quy tắc bị chia quy tắc       | `lookupIrregularVerb()` bóc 12 tiền tố (`re/mis/over/under/out/fore/with/un/off/up/pre/inter`) rồi tra gốc; danh sách loại trừ `relay/reprove/behave/rebound` | `repayed`→`repaid`, `misleaded`→`misled`, `resetted`→`reset`, `retelled`→`retold`, `withstanded`→`withstood`, `outshined`→`outshone`, `interweaved`→`interwove` |
| Động từ đuôi `-ic` thiếu `k`                                      | quy tắc `-ic` → `-icking/-icked`                                                                                                                              | `mimicing`→`mimicking`, `frolicing`→`frolicking`                                                                                                                |
| Động từ đa âm tiết nhấn cuối thiếu trong danh sách gấp đôi        | thêm `repel/dispel/excel/impel`                                                                                                                               | `repeled`→`repelled`, `exceling`→`excelling`                                                                                                                    |
| Số nhiều: `-ch` đọc /k/, danh từ ghép `-in-law`, danh từ bất biến | `CH_AS_K_NOUNS` (11 từ), quy tắc chia phần đầu `-in-law`, thêm `bison/moose`                                                                                  | `monarches`→`monarchs`, `mother-in-laws`→`mothers-in-law`, `mooses`→`moose`                                                                                     |
| Tính từ phân loại/tuyệt đối vẫn bị sinh so sánh hơn               | `NON_GRADABLE_ADJECTIVES` (≈65 từ)                                                                                                                            | `mainer`, `nexter`, `liabler`, `lonest`, `numb→number`, `own→owner`, `firster`, `deader` → không có                                                             |

Kết quả: **55 entry đổi `forms`** (rà từng dòng, xem diff `chunk-*.json`); 3 hồi quy bắt được ngay
khi rà (`behave→behad`, `relay→relaid`, `reprove→reproven`) và sửa trước khi commit. `rid` thêm
vào bảng bất quy tắc. Test: `wordForms.test.ts` +5 ca (45/45).

**2. Cổng canh mới `apps/dhcb/src/data/dictionaryForms.test.ts`:** mọi `forms` đã commit phải
TRÙNG KHÍT `computeForms` hiện hành (sửa bảng quy tắc mà quên `gen:word-forms` là đỏ, và ngược
lại) + chặn thẳng 4 khuôn sai kinh điển + chặn hai từ không tồn tại quay lại.

**3. Mục từ sai (`public/data/dictionary`):** xoá `bereftly`, `evokingly` (không tồn tại trong
tiếng Anh) và `gook` (tiếng lóng miệt thị chủng tộc) — gỡ khỏi cả 3 vòng từ vựng chứa chúng;
`enviable` adv→adj, `upscale` v→adj (+ nghĩa/ví dụ), `ow` n→interj, `ford` "Ford (hãng xe)"→"chỗ
cạn lội qua sông", `cookie` thêm nghĩa "bánh quy" trước nghĩa tin học. Vòng từ vựng đồng bộ lại
bằng `sync-vocab-from-dictionary.ts` (kể cả `pos`), `curriculum.json`/`cefr.json` sinh lại.

**4. Cấu trúc bài (3 sửa, 1 đóng không sửa):**

- `sinh11c2.ts`: khối hoạt ảnh "Bốn hệ cơ quan nối với nhau qua dòng máu" (199 dòng) nằm ở bài
  24 (thực hành tránh thai) → dời nguyên trạng sang bài 25 ("Mối quan hệ giữa các quá trình sinh
  lí") — nội dung hoạt ảnh trùng nguyên văn `theory` của bài 25. Bài 24 để trống hoạt ảnh (không
  bịa). `lessonsLazy.ts` sinh lại.
- `security.ts` chặng `security-s3`: tên "Bảo mật tấn công chuyên sâu" + `canDo` "viết fuzzer,
  tái hiện lỗ hổng" + 2 topic "phân tích mã độc", "vượt ASLR/DEP, ROP" **trái với đặc tả đã duyệt**
  `docs/specs/2026-09-17-security-s3-bai-hoc-that.md` (ranh giới cứng: không mã độc, không ROP,
  không công thức vượt ASLR/DEP; chỉ dạy cơ chế + phát hiện) → đổi tên "Cơ chế lỗ hổng và kỹ
  thuật phát hiện", viết lại `canDo`/2 topic/1 practice/1 selfCheck/1 invariant theo đúng ranh giới.
  `id` giữ nguyên.
- `courses/ml.ts`: `prerequisites: []` mâu thuẫn mô tả "đã biết Python căn bản" → khai đúng khuôn
  `mathai.ts` đang dùng.
- `stemCurriculum.ts`: mảng `mathematics` có HAI mục cùng `grade: 'university'`; giao diện
  (`SubjectDetail.tsx`) chọn bằng `.find()` nên mục thứ hai — **4 chương "Toán ứng dụng trong Lập
  trình" (`mfc_*`) — chưa bao giờ hiển thị được** (nội dung chết từ khi thêm). Gộp vào mục
  `university` duy nhất (5 chương) thay vì thêm giá trị `grade` mới (union đóng dùng chung
  `core-learner`, đổi là chạm gói + server). Cùng file: thống nhất dấu thập phân về dấu chấm (15
  chỗ ở chương `mfc_*`, đa số 52/67 của file dùng chấm; không có trường chấm máy).
- **ĐÓNG, không sửa:** `ly12c3.ts` bài 16/17 (tự cảm, máy biến áp) dưới chương "Từ trường" là
  **ĐÚNG** theo CT GDPT 2018 (Vật lí 12 có 4 chủ đề: Vật lí nhiệt · Khí lí tưởng · Từ trường ·
  Vật lí hạt nhân; "Cảm ứng điện từ" là mạch nội dung bên trong "Từ trường", chỉ CT 2006 mới tách
  chương riêng). Mục này ở audit 0406 là báo sai.

**5. Nhất quán thuật ngữ:** `idempotent` có 3 cách gọi trong gói Lập trình → thống nhất
`lũy đẳng (idempotent)` ở lần đầu mỗi file, sau đó `lũy đẳng` (25 chỗ / 13 file, không đụng đầu ra
mô phỏng trong `lessons/`).

**6. E2E đỏ của PR #1102 (mảnh 5/6):** đợt 0406 bỏ tiền tố "Hướng " hàng loạt cho tiêu đề unit
nhưng quét trúng cả tiêu đề MẠCH `chuyen-sau` trong `UNIT_TRACKS` → "chuyên sâu"; locator exact
`'Hướng chuyên sâu'` không thấy. Trả lại tiêu đề (commit `f6aff76`). Bài DOM `p3-u6-l2` cùng mảnh
chỉ flaky (CI tự ghi "flaky", chạy lại máy 2/2 xanh).

## Quyết định

- Sửa bộ sinh + thêm cổng canh thay vì sửa tay 55 mục: sửa tay là đường quay lại đúng nợ cũ.
- Prefix bất quy tắc dùng DANH SÁCH LOẠI TRỪ thay vì bảng liệt kê từng cặp: bảng liệt kê sẽ lại
  thiếu (`withstand`, `outshine`, `interweave` không ai nghĩ tới); loại trừ chỉ cần thêm khi rà
  thấy. Cổng canh (2) bắt mọi lệch.
- Từ `sure` giữ `surer/surest` (đúng), `blind/deaf/dead` xếp không cấp độ theo nghĩa giáo khoa.

## Bằng chứng kiểm chứng

- `wordForms.test.ts` 45/45 · `dictionaryForms.test.ts` 4/4 · `apps/dhcb/src/data` + `lib/curriculum.test.ts` 982/982 ·
  `subject-biology/lessons.test.ts` 17/17 · `subject-physics/lessons.test.ts` 17/17 ·
  `subject-programming` specializations/courses/learningPaths 60/60 + `securityS3Lessons.test.ts`.
- Cổng gộp trước push cuối: xem PR #1102 (typecheck · lint · prettier · test:coverage · build ·
  audit:prose --ci · audit:lessons --ci).

## Nợ còn lại (chuyển tiếp từ 0406, chưa làm trong đợt này)

- Pipeline vòng từ vựng CEFR (sinh vòng mới cho từ mới mà không xáo vòng cũ) — cần đặc tả.
- `level` CEFR lệch ở vài mục từ (`mane/manor/momentum` A1…), `pos` của `pre` (tiền tố) — chưa có
  nguồn chuẩn để quyết hàng loạt; `gen-stem-lesson-index.ts` xuất file chưa qua Prettier (phải
  `prettier --write` sau khi chạy).
- `lessons.json` id=109 nửa sau là thoại mồi; `ft-emperor-clothes` mức B2 nhưng khai A2;
  `my-perseus-4` dòng 105 quan niệm sai lầm thế kỷ 19 (nguyên tác) — cần chủ dự án quyết.
