# 0409 — 2026-09-22 — Trả nốt nợ audit 0406: sàn bậc theo tần suất cho nhãn không nguồn, sinh lại vòng, 3 nội dung chờ quyết

> PR: (đợt này) · Tiếp `0406` (audit câu chữ) và `0408` (trả nợ từ điển). Chủ dự án yêu cầu
> "tiếp tục trả nợ còn lại", không dừng hỏi — các quyết định nội dung dưới đây ghi rõ lý do để
> đảo lại được nếu không đúng ý.

## Việc đã làm

**1. Bậc CEFR của nhãn KHÔNG có nguồn chuẩn — quy tắc mới + cổng + áp dụng.** Ba từ 0406 nêu
(`mane/manor/momentum` A1) đều không có trong CEFR-J/Octanove: nhãn đến từ Words-CEFR-Dataset
(nội suy, `momentum 1`) hoặc AI. Rà rộng: 185 mục A1/A2 và 142 mục B1 cùng kiểu (`congressional`
A1, `tenure` A1, `statute` A2, `zinc` B1…). Cổng `RARE_RANK_FLOOR` (≥ 30 000) không bắt vì chúng
chỉ "khá hiếm". Thêm bất biến thứ ba ở `packages/subject-english/dictionaryLevels.ts`:
_nhãn không có nguồn chuẩn phải tôn trọng sàn bậc theo hạng tần suất_ — hạng ≥ 8 000 → tối thiểu
B1, ≥ 15 000 → tối thiểu B2 (mốc lấy từ trung vị hạng thật của B1/B2/C1 trong từ điển: 6 312 /
11 137 / 16 838). Ngoại lệ CÓ TÊN `UNSOURCED_EASY_ALLOWLIST` (`superhero`, `indian`, `mini`).
Cổng: `dictionaryLevels.test.ts` đọc headword CEFR-J/Octanove thật (`parseWordlistHeadwords`,
tách trường có dấu nháy và headword ghép "a.m./A.M./am/AM").
Áp bằng `scripts/archive/relevel-unsourced-easy-words.ts`: **306 mục nâng bậc**
(A1→B1 33 · A1→B2 37 · A2→B1 59 · A2→B2 35 · B1→B2 142), **12 dạng chia nối `base`** (`heavier`,
`posts`, `learnt`, `grandchildren`… — đang được dạy như thẻ riêng), **3 dạng chia lan bậc theo từ
gốc** (`designated`, `upheld`, `appendices`). Xoá mục `pre` (tiền tố, không phải danh từ,
`plural: pres`). Sửa bộ sinh: `grandchild → grandchildren` (trước: `grandchilds`), thêm
`stepchild/godchild/schoolchild`.

**2. Sinh lại vòng từ vựng theo đúng 5 bước của đợt 0316** (A1B2 → curriculum → C1C2 → curriculum →
learn-json): 676 → **673 vòng**, 11 904 → 11 893 từ (13 mục rời vòng: 12 dạng chia + `pre`).
Sinh lại làm **96 vòng hỏng câu mẫu** (id vòng dịch chuyển). Thay vì viết lại 239 câu, viết
`scripts/archive/reassign-circle-sentences.ts`: gom câu "mồ côi" rồi gán lại cho vòng thiếu nếu
câu dùng ≥ 1 từ của vòng và đúng khung độ dài → **cứu 208 câu**, bỏ 40 câu không gán được, còn
**24 vòng / 31 câu viết tay** (B1 3 · B2 19 · C2 2). Sau đó 0 vòng thiếu; `MIN_CIRCLES_WITH_SENTENCES`
676 → 673 (giải trình trong test). Script lũy đẳng (chạy lại: 0 câu đổi).

**3. Ba nội dung 0406 để "chủ dự án quyết" — quyết như sau (đảo lại được):**

- `lessons.json` id=109 "Gọi món ở quán ăn Việt": 10 lượt sau là thoại mồi chung ("Can you explain
  that in more detail?") không liên quan gọi món → viết lại 10 lượt tiếp mạch (đồ uống, tương ớt,
  thời gian chờ, nhà vệ sinh, thanh toán thẻ/QR); người nói B đổi "Thủ thư/Librarian" (sai bối
  cảnh) → "Khách/Customer". `public/data/lessons/chunk-010.json` sinh lại.
- `ft-emperor-clothes`: bản Paull 1872, câu trung bình 31,7 từ (ngang `ft-beauty-beast` 30,7 —
  B2) → khai lại **B2** (trước A2). `public/data/stories/*` + `index.json` sinh lại.
- `my-perseus-4` câu 28 (dân Æthiop coi da trắng/tóc vàng là dấu hiệu thần thánh): giữ nguyên
  văn tiếng Anh (public domain), **thêm chú thích người dịch** vào `vi`: đây là cách nhìn của tác
  giả thế kỷ 19, không phải điều truyện dạy.

**4. Nợ kỹ thuật nhỏ:** `gen-stem-lesson-index.ts` tự chạy Prettier khi ghi (giống
`gen-lesson-index.ts`), hết phải nhớ `prettier --write` sau khi sinh — chạy lại: diff rỗng.
`stemCurriculum.ts` bỏ dấu chấm làm phân cách nghìn (`-50.000 J/mol` cùng dòng với `-20.2 kJ/mol`)
→ khoảng trắng `-50 000`, `3 355 443 200`.

**5. Tầng 8b — NHÌN trang thật `/mon-hoc/mathematics` tab Đại học** (nợ 0408): chụp 1440 px +
390 px bằng Playwright (mock `/api/subjects?id=mathematics` theo `SubjectManifestSchema`, bấm
UNIVERSITY → "Chương Trình & Công Thức (5)"). Cả 5 chương hiện, không lặp. Lỗi chỉ thấy khi nhìn:
UI đánh số 01–05 nhưng 4 chương `mfc_*` mang sẵn "Chương 1:…4:" → đọc thành "02 Chương 1". Bỏ
tiền tố trong `title`. Ảnh không commit (kỷ luật 0 PNG).

## Quyết định

- Sàn bậc là NGƯỠNG SỐ có lý do đo được; ngoại lệ là DANH SÁCH TÊN — đúng luật 0313. Nhãn CÓ
  nguồn CEFR-J giữ nguyên dù hạng thấp (`grandparent` A1 là chủ đích của giáo trình).
- Dạng chia nối `base` thay vì nâng bậc: `heavier` không phải từ mới của người học A1.
- Gán lại câu cũ trước, viết tay sau: giữ được 208 câu đã qua rà 0406, giảm 87 % khối lượng viết.

## Bằng chứng kiểm chứng

- `dictionaryLevels.test.ts` 7/7 (bất biến mới đỏ đúng khi `momentum` A1, xanh sau khi áp) ·
  `dictionaryForms.test.ts` 4/4 · `vocabLevelSync.test.ts` · `cefrCircleSentences.test.ts` 11/11 ·
  `curriculum.test.ts` · `stories.test.ts` · `stemCurriculum.test.ts` · `lessonsLazy.test.ts` ×4.
- `npm run typecheck` ✅ · `npm run lint` ✅ · `npm run build` ✅ · `npm run test:coverage` (xem PR)
  · `audit:prose` 0 lỗi trên file đổi · Prettier ✅.
- `reassign-circle-sentences.ts` chạy lần 2: "gán lại 0 câu · mọi vòng đủ câu mẫu".

## Nợ còn lại

- Sàn bậc chưa áp cho B1 ≥ 30 000 → C1 (chỉ B2). 40 câu mẫu mồ côi đã bỏ — nếu muốn giữ, cần
  vòng mới cùng từ.
- Dạng chia còn đứng như từ riêng ngoài 12 mục đã nối (`sung`, `designs`…): cần quét có hệ
  thống bằng `forms` của từ gốc (một đợt riêng).
