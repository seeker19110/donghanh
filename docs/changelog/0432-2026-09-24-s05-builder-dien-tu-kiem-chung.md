# S05 — Bộ tạo câu điền từ có kiểm chứng (source kỹ thuật)

- **Ngày:** 2026-09-24 · **Goal:** [UI/UX và sư phạm](../goals/2026-09-23-uiux-su-pham.md) M1/S05 (lỗi F7)
- **Đặc tả:** [S03–S05 §4](../specs/2026-09-23-uiux-s03-s05-tinh-dung-bai-tap.md) — quyết định bổ sung 24/09
  "Approved for technical implementation" (#1153) · [thiết kế audit/manifest](../specs/2026-09-23-s05-offline-audit-manifest.md)
- **Trạng thái sau đợt:** S05 technical SOURCE xong; **chuyên gia + Product vẫn `WAITING_EXPERT_REVIEW`**,
  release S05 chưa PASS.

## Đã làm

- `apps/dhcb/src/pages/learning/practice/fillBlankQuestions.ts` — **một luật duy nhất** cho runtime và
  audit: câu NFC, offset UTF-16 trên câu gốc (không lấy từ chuỗi đã lowercase), ranh giới
  chữ/mark/số Unicode (không `\b` ASCII), A = `word` + 7 form dạng chuỗi (bỏ cờ boolean), B = nguyên
  `vi` (không tách dấu phẩy). Khử trùng ứng viên rồi span; nhiều span (kể cả chồng lấn) → loại.
  Mỗi entry đúng MỘT lý do theo thứ tự `invalid_entry → … → invariant_failed`; distractor loại
  mọi nhãn/form của nguồn, khử trùng trim/NFC/lowercase; option id `A|B:<ref>:correct|d1..d3`.
  Blank dựng bằng prefix/suffix theo span, không replace marker.
- `FillBlankQuiz.tsx` — lọc hợp lệ **trước** trộn/cắt; <4 câu → màn "chưa đủ câu" + nút Về Luyện
  tập (không chấm 0); 4–7 → phiên đúng số; ≥8 → cap 8. Chấm theo id, guard đồng bộ (ref) chặn
  bấm đôi trước khi React render lại; phản hồi bằng chữ `role="status"` (không chỉ màu/icon);
  focus sang "Câu tiếp theo" rồi về câu hỏi; `lang` đúng ngôn ngữ đích; seed cố định cả phiên
  nên options giữ nguyên khi đổi ngôn ngữ UI. Copy nhiệm vụ: **"Khôi phục câu ví dụ đã học"**
  (tiêu đề phụ + thẻ hub ở `Practice.tsx`).
- `scripts/audit-fillblank.ts` — audit ngoại tuyến gọi chính builder trên (SHA256 làm hàm xếp
  hạng), xuất `summary.json` / `candidates.jsonl` / `review-manifest.json`, không ghi đè output,
  mã thoát 0/1/2, input chưa commit → technical FAIL, fixture pool phải là file public đã track
  chỉ có `entryRefs`.
- Test: `fillBlankQuestions.test.ts` (20 ca: từ con, dấu Việt, metachar regex, `İ` đổi độ dài khi
  lowercase, NFD, form/boolean, chồng lấn, marker có sẵn, distractor trùng, đối soát),
  `FillBlankQuiz.test.tsx` (6 ca: lọc trước cap, phiên 5 câu, empty, chấm đôi, đổi UI, chiều B),
  `scripts/audit-fillblank.test.ts` (10 ca), E2E `e2e/practice-fillblank.spec.ts` (A×vi, B×en,
  empty — bàn phím, Retry). Test S04 cũ (`MiniGames.s04.test.tsx`) vẫn xanh không sửa.

## Bằng chứng

- **Negative control:** gỡ guard chấm đôi → test "bấm hai lần… chỉ chấm một lần" đỏ; khôi phục → xanh.
- **Parity với audit độc lập 23/09** (toàn từ điển 12.153 entry, seed `s05-v1`): A accepted
  **12.122**, no_match 25, multiple_spans 6; B accepted **4.760**, no_match 7.385, multiple_spans 8 —
  khớp từng con số của [bằng chứng ngoại tuyến](../research/2026-09-23-s05-offline-evidence.md).
  Mỗi chiều đối soát `total = accepted + Σ lý do`; 0 invariant_failed.
- 40 mẫu (20 A + 20 B) chọn ra **trùng ref và thứ tự** với
  [manifest cũ](../research/2026-09-23-s05-review-manifest.json), span/đáp án trùng. **Distractor
  khác** ở cả 40 hàng: script độc lập cũ dùng tuple xếp hạng distractor không giống hệt; builder
  runtime theo đúng tuple §4 `[rule, seed, direction, sourceRef, distractorRef]`. Theo §4 thiết kế
  (giữ manifest cũ, ghi revision), manifest cũ **giữ nguyên**; chuyên gia cần review bộ options
  từ manifest mới do builder runtime sinh (artifact ngoài repo, xem bảng dưới).
- Tầng 8b: ảnh trước/sau 390/1440 (blue-sky, dark-blue) + sau 320/390/1440 × 3 theme cho quiz và
  empty: không lặp nội dung, không tràn ngang; axe A/AA **0 vi phạm** ở 18 tổ hợp; mọi nút ≥44px.
  1 mục `incomplete` color-contrast là nút ✕ đóng mode có từ S04 (nội dung chỉ là ký tự không
  phải chữ) — không do đợt này, không đổi.
- Cổng: typecheck ✅ · lint ✅ · `npm run test:coverage` ✅ 16.922 test (stmts/branches/funcs/lines
  94,64/90,53/95,35/95,16) · E2E `practice-fillblank` 3/3 ✅.

## Artifact audit (không commit, lưu ngoài repo)

`npx tsx scripts/audit-fillblank.ts --direction both --samples 20 --seed s05-v1 --out <dir>` trên
commit nhánh `19ba4bb9` (builderCommit trùng, `dirtyPaths` rỗng), Node v22.22.2, rule `s05-v1`,
datasetDigest `45ea26ee3066549e9aba97d3c05dc6a4a98b25c40e1d11d86516b33de36bbb65` (trùng bản
23/09). Exit 0, technical PASS, expert A/B `WAITING_EXPERT_REVIEW`, release WAITING. ~7 phút 51 giây.

| File                   | SHA256                                                             |
| ---------------------- | ------------------------------------------------------------------ |
| `summary.json`         | `0d694b3b74bbbf783d7a91052e5d99b3956540de973880dad9417d759f95a654` |
| `candidates.jsonl`     | `c96bb05d69a3afbaebe6f047ea1ad66f2df517c60f9ba7ec900bee1e684593a2` |
| `review-manifest.json` | `401ca9cc8dcc294ac3e571af6f4d0939117693a883ec9849f4b18a9c5833b436` |

Sau squash-merge, SHA trên `main` sẽ khác `19ba4bb9`; chạy lại lệnh trên `main` để có
`sourceCommit` khớp trước khi giao manifest cho chuyên gia (tree từ điển và builder không đổi thì
số liệu và mẫu giữ nguyên).

## Chưa làm / nợ ghi lại

- Review chuyên gia 20 câu/chiều + Product acceptance: `WAITING_EXPERT_REVIEW` (không tự điền).
- Fixture pool học sạch chưa có; số liệu toàn từ điển **không** bảo đảm pool người học B ≥ 4 câu —
  B chỉ 39% entry dựng được câu, nên người học chiều B có thể gặp màn "chưa đủ câu" thường hơn.
- Thời gian audit toàn từ điển ~8 phút (≈147 triệu phép băm SHA256 cho distractor) — chấp nhận vì
  chỉ chạy tay; runtime chỉ xử lý pool ≤ vài trăm entry.

## Rollback

Revert PR này (builder + caller + script + test). Không migration, không đổi dữ liệu từ điển,
API, persistence hay mastery. Manifest cũ giữ nguyên.
