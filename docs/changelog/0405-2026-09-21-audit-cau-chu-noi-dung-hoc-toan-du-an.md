# 0405 — 2026-09-21 — Audit câu chữ nội dung học TOÀN DỰ ÁN (49 lát, 5 tiêu chuẩn)

> PR: (điền khi merge) · Yêu cầu chủ dự án: "audit chất lượng nội dung bài học, bài viết trên từng
> câu chữ, ưu tiên dễ hiểu, sửa cho đúng ngữ nghĩa và chuẩn nghiệp vụ sư phạm, kiểm tra và sửa
> trên toàn dự án, không cần dừng lại hỏi, ưu tiên chất lượng cao nhất".

## Việc đã làm

**Phạm vi:** toàn bộ nội dung cho người học đọc, ~20 MB nguồn, chia 49 lát, mỗi lát một agent đọc
TRỌN VẸN và sửa tại chỗ theo brief chung (5 tiêu chuẩn, xếp theo ưu tiên: đúng chuyên môn → đúng
sư phạm → dễ hiểu → chính tả/dấu câu → nhất quán; vùng cấm: id, code mẫu, `expected`/`testCases`,
đáp án chấm máy, độ dài Zod):

| Mảng                                                                                | Lát | File | Ghi chú                                                        |
| ----------------------------------------------------------------------------------- | --- | ---- | -------------------------------------------------------------- |
| Lập trình — bài học P1–P6 + khoá ngắn                                               | 13  | 320  | `packages/subject-programming/lessons`                         |
| Lập trình — 14 hướng chuyên sâu, chặng, quiz, lộ trình, khoá                        | 3   | 96   | `specializations`, `learningPaths`, `courses`, `curriculum.ts` |
| Toán 10–12                                                                          | 2   | 27   | `packages/subject-math/lessons`                                |
| Vật lí 10–12 + HSG                                                                  | 3   | 18   | `packages/subject-physics/lessons`                             |
| Hoá 10–12 + HSG                                                                     | 3   | 26   | `packages/subject-chemistry/lessons`                           |
| Sinh 10–12                                                                          | 3   | 9    | `packages/subject-biology/lessons`                             |
| Tiếng Anh — hội thoại 350 bài, CEFR ngữ pháp, từ vựng nền, ví dụ, câu mẫu vòng CEFR | 6   | 12   | `apps/dhcb/src/data/*`                                         |
| Tiếng Anh — 129 truyện song ngữ                                                     | 5   | 129  | `apps/dhcb/src/data/stories/raw`                               |
| Tiếng Anh — từ điển 12.000 mục (nguồn sự thật của vòng từ vựng)                     | 10  | 10   | `apps/dhcb/public/data/dictionary/chunk-*.json`                |

**Kết quả:** 329 file nội dung đổi (4.026 dòng thêm / 7.336 dòng bớt), ~2.300 chỗ sửa. Không đổi
bất kỳ `answerIndex`/`correctIds`/`expected`/`testCases`/code mẫu nào — mọi agent đều tính lại bằng
tay/Python các con số chấm máy và xác nhận đáp án hiện có đúng. Phân loại (ước tính từ 49 báo cáo):

- **Chuyên môn ~330 chỗ** — ví dụ tiêu biểu: sinh 12 liệt kê "cách li sinh sản" là nhân tố tiến
  hoá (đúng: giao phối không ngẫu nhiên); hoá 12 gán ngược điều kiện hai chiều cân bằng
  CaCO₃/Ca(HCO₃)₂; lí 10 "xung lượng = biến thiên động năng"; lí 11 hook "cường độ dòng điện là
  tốc độ dòng chảy"; toán 10 ví dụ "không đồng khả năng" mà thực ra đồng khả năng; toán 11 định lí
  ba đường vuông góc thiếu giả thiết; lập trình `flags & mask != 0` (ưu tiên toán tử Python sai),
  iOS Keychain sống sót sau gỡ app (bài viết ngược), `RANK()` "hụt món" (sai chiều), 4 câu `why`
  của lộ trình principal-ai mô tả nhầm chặng; tiếng Anh: bản dịch mất thì giả định quá khứ ("giá
  mà tôi ĐÃ…"), causative `have sth done` dịch mất nghĩa thuê người, `musician` = nhạc công (không
  phải nhạc sĩ), `eagle` = đại bàng, `veal` = thịt bê, `kilowatt per hour` (sai vật lí), `/v/` mô
  tả ngược cấu âm, mức giảm trừ gia cảnh lỗi thời (11 → 15,5 triệu theo NQ 110/2025).
- **Sư phạm ~250 chỗ** — `explain` chỉ lặp đáp án → nói vì sao đúng và vì sao các phương án khác
  sai; ví dụ dùng sai từ loại đang dạy (`vent`/`waste`/`mock`/`snow`…); hint chỉ tới chỗ không
  tồn tại; câu hỏi ≠ phương án; xưng hô sai tình huống (người yêu/chị em xưng "tao/mày" ở 3 bài
  hội thoại — viết lại 43 lượt); thuật ngữ Anh lần đầu xuất hiện thiếu nghĩa Việt.
- **Dễ hiểu ~900 chỗ** — câu dịch máy ("thực hiện việc…", "một cách…", "cảm thấy lỏng"), Anh-Việt
  lai, câu tối nghĩa, câu quá dài.
- **Chính tả/dấu câu ~450 chỗ** — trong đó **hai bài lập trình (`p6u96`, `p6u97`) và phương án
  trắc nghiệm của 8 bài khác gõ tiếng Việt hoàn toàn không dấu** đã được phục hồi dấu; 26 lỗi chính
  tả chuẩn ("sổ xố", "giải phòng", "xúi giẩy", "thiếu xót"…); từ lặp; khoảng trắng; 26 `ipa_vi`
  lẫn chữ Việt có dấu vào IPA.
- **Nhất quán ~400 chỗ** — danh pháp hoá 2018 (`axit`→`acid`…), `lí/hoá/kì` theo quy ước áp đảo
  của từng gói, ký hiệu tổ hợp `Cᵏₙ` chuẩn SGK (toán 10 c8 dùng lẫn hai quy ước ngược nhau), tiêu
  đề 148 unit P6 (65 unit viết thuần tiếng Anh dạng liệt kê → tiếng Việt, giữ thuật ngữ chuẩn).

**Công cụ mới:**

- `scripts/audit-prose.ts` (`npm run audit:prose`, `-- --ci` chặn CI ở job `audit`): quét
  chính tả tiếng Việt sai chuẩn (bảng ~100 cặp có ràng buộc ngữ cảnh), từ lặp đôi, dấu câu, tiếng
  Việt không dấu, TODO sót — trên `.ts` (bỏ template literal = code mẫu) và `.json`. Cảnh báo △
  không chặn (từ láy/tỉ lệ/căn cột…), lỗi ✖ chặn. Trước đợt: 42 ✖; sau: 0 ✖.
- `scripts/archive/sync-vocab-from-dictionary.ts`: đồng bộ nghĩa/ví dụ/IPA từ từ điển sang hai
  file vòng từ vựng **giữ nguyên thành phần vòng** (xem Quyết định).
- Sửa đường gốc sai (lùi 1 cấp thay vì 2) của `scripts/archive/build-lessons-public.mjs` và
  `gen-form-examples.ts` — hai script này không chạy được từ khi dời vào `archive/`.

**Dữ liệu sinh lại** từ nguồn đã sửa: `public/data/{cefr,curriculum,dialogues,form-examples}.json`,
`public/data/lessons/*`, `public/data/stories/*`, `src/data/cefr{A1B2Extra,C1C2}Vocab.json` (chỉ
trường chữ), `lessonsLazy.ts` của 5 gói môn.

## Quyết định

- **KHÔNG chạy lại `gen-a1b2-extra-vocab.ts` / `gen-cefr-c1c2-vocab.ts`.** Hai script xếp từ vào
  vòng theo chủ đề suy từ NGHĨA TIẾNG VIỆT (`scripts/lib/vocabTopics.ts`); sửa nghĩa 391 từ làm
  xáo thành phần 74 vòng, và bộ 1.761 câu mẫu VIẾT TAY theo id vòng
  (`cefrCircleSentences.json`) lệch hết (5 test bất biến đỏ). Đo thêm: file vòng đã commit vốn
  **lệch sẵn** với từ điển từ trước phiên này (sinh lại trên cây sạch vẫn ra B2 2766 từ ≠ 2765 —
  từ `pajama`), tức pipeline "sửa từ điển → sinh lại vòng" đã đứt từ lâu. Thay bằng script đồng bộ
  chỉ chép trường chữ. Ghi vào CLAUDE.md mục 8 và nợ mở.
- Cập nhật `GOLDEN_MANUAL_HASH` trong `cefrCircleSentences.test.ts` kèm giải trình tại chỗ: 89
  vòng thủ công đổi câu mẫu/bản dịch (nghĩa sai, câu Anh sai ngữ pháp, Anh-Anh/Anh-Mỹ lẫn), danh
  sách từ không đổi.
- Hạ mức `KHONG_DAU` của máy quét xuống cảnh báo: 4 ca còn lại là chuỗi đầu ra của bộ mô phỏng
  (`expected`/`choices` của `gitSim`, `p6u225`) cố ý không dấu để chấm máy — không thể phân biệt
  bằng máy với văn xuôi.
- Giữ nguyên các ví dụ giảng dạy dùng gói `"pro"` (`p6u62`, `p6u65`): là giá trị minh hoạ trong
  `expected`, không phải mô tả sản phẩm; riêng chỗ MÔ TẢ sản phẩm thật (`llmagentu2`: "Free/Pro")
  đã sửa thành Free/VIP.
- Không viết lại theo khẩu vị: dải ~39 vòng `cefr-b2-modifier-*` câu nhạt nhưng đúng ngữ pháp để
  nguyên (cần đặc tả riêng nếu muốn nâng).

## Bằng chứng kiểm chứng

- Mỗi lát: `prettier --check` + `audit-prose` + import module + test Zod của gói → xanh (49/49 báo
  cáo có kết quả lệnh thật).
- Cổng gộp trên checkout sạch (`rm -rf packages/*/dist dist dist-server`): `npm run typecheck` ✅ ·
  `npm run lint` ✅ (0 cảnh báo) · `npx prettier --check .` ✅ · `npm run test:coverage` ✅ 708
  file / 16.641 test xanh, 2 bỏ qua có sẵn · `npm run build` ✅ · `npm run audit:prose -- --ci` ✅
  0 lỗi · `npm run audit:lessons -- --ci` ✅ (cảnh báo có sẵn) · `npm run check:docs` ✅ ·
  `scripts/ci-workflow-policy.test.ts` ✅.
- Hai test đỏ giữa chừng và cách xử lý: `subject-physics/lessonsLazy.test.ts` (tiêu đề bài đổi
  "chuyển thế"→"chuyển thể") → `gen:stem-lesson-index`; `lib/curriculum.test.ts` (cefr.json sinh
  lúc vòng còn bản tạm 39 vòng) → sinh lại sau khi đồng bộ.

## Nợ / việc tiếp theo (ghi ở PROGRESS.md "Nợ kỹ thuật còn mở")

Các phát hiện agent KHÔNG được phép sửa trong đợt (ngoài vùng câu chữ), để chủ dự án quyết:

1. **Từ điển `forms` sai hàng loạt** (script `gen-word-forms` cũ): `repeling/repeled`, `repayed`,
   `resetted`, `retelled`, `ridded`, `mimicing`, `misleaded`, `offseting`, `alloting`, `frolicing`,
   `monarches`, `mooses`, `mother-in-laws`, `bisons`; so sánh hơn bịa `liabler/lonest/mainer/
nextest/nonnest`, `numb → number`. Vài `pos` sai (`enviable` adv, `upscale` v, `ow`/`pre` n),
   `level` lệch (`mane`/`manor`/`momentum` A1…), hai từ không tồn tại (`bereftly`, `evokingly`),
   `gook` là tiếng lóng miệt thị, `ford`/`canon`/`cookie` định nghĩa theo thương hiệu/nghĩa hẹp.
2. **Pipeline vòng từ vựng đứt** (xem Quyết định): cần đặc tả cách sinh lại vòng mà không phá câu
   mẫu viết tay (vd khoá thành phần vòng theo snapshot, chỉ sinh vòng MỚI cho từ mới).
3. Cấu trúc/đặc tả bài: `sinh11c2` b24 mang hoạt ảnh của b25; `ly12c3` b16/b17 (tự cảm, máy biến
   áp) nằm dưới chương "Từ trường"; `stemCurriculum` có 2 phần tử `grade: 'university'` và dấu
   thập phân lẫn; `courses/ml.ts` `prerequisites: []` mâu thuẫn mô tả "đã biết Python";
   `security-s3` tên "tấn công chuyên sâu" nhưng nội dung phòng thủ; `p6u200` công thức KV cache
   thiếu hệ số 2 và `head_dim` (bám `expected`); `mlu1` ca ẩn rơi đúng ca hoà không nêu quy ước;
   `lessons.json` id=109 nửa sau là thoại mồi chung, id=56 hai lượt A liền nhau;
   `ft-emperor-clothes` khai A2 nhưng văn bản mức B2; `my-perseus-4` dòng 105 quan niệm sai lầm
   thế kỷ 19 về màu da (nguyên tác public domain — cân nhắc bỏ khỏi bài nghe).
4. Nhất quán toàn gói cần quyết một lần: `idempotent` có 3 cách gọi trong `specializations`;
   `DNA`/`ADN`, `ti thể`/`ty thể`, `hoá`/`hóa` lệch giữa các file môn Sinh; `pronunciationTraps`
   nhóm ch-tr dạy /tr/ "tách biệt" (quy ước dạy học, không đúng ngữ âm bản xứ).
5. Chuyển nội dung: hai "chú thích" tiếng Anh/`**markdown**` trong `theory` môn Sinh 10 (c1 b3/b5)
   chưa xác minh hiển thị — cần chụp ảnh Tầng 8b.
