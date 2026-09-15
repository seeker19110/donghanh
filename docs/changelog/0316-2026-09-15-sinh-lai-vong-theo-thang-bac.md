# 0316 — 2026-09-15 — Sinh lại vòng từ vựng theo thang bậc đã sửa (phương án b)

**PR:** (đợt này) · **Nhánh:** `claude/loving-fermi-soclh1` · Khép chuỗi `0312` (#915) ·
`0313` (#916) · `0315` (#917)

## Việc đã làm

Người dùng chốt **phương án (b)**. Báo cáo: `docs/audit/2026-09-15-sinh-lai-vong-theo-thang-bac.md`.

1. **Sinh lại vòng A1–B2 và C1–C2** từ từ điển đã sửa bậc, rồi sinh lại `curriculum.json` và
   `public/data/cefr.json`. Kết quả đo trên file app thật sự đọc: **0 từ còn nằm trong vòng sai
   bậc** (trước: 43). `impetus` → `cefr-c1-noun-31`, `tensely` → `cefr-b2-modifier-38`,
   `debugger` → `cefr-b1-noun-54`.
2. **Tránh bẫy 8 từ C1 biến mất.** `gen-a1b2-extra-vocab.ts` chỉ dựng A1–B2 nên 8 từ nâng lên C1
   ở #916 rơi khỏi kết quả của nó; hai generator khử trùng qua `curriculum.json` nên **thứ tự
   chạy là một phần của lời giải** (5 bước, ghi trong báo cáo mục 2). Chạy sai thứ tự thì 8 từ
   biến mất im lặng, không cổng nào báo.
3. **Viết tay 22 câu mẫu** cho 13 vòng bị hỏng do đổi thành phần (16 câu viết lại + 6 câu cho 2
   vòng mới), xoá 3 khoá mồ côi. Theo đủ 10 bất biến của đặc tả câu mẫu.
4. **Hạ mốc ratchet 677 → 676** kèm giải trình, và **đổi bất biến sang thứ mạnh hơn**: mọi vòng
   phải có câu mẫu (số vòng thiếu = 0), thay vì chỉ so một con số đếm.

## Quyết định

- **Nói thẳng: ước lượng ban đầu của tôi SAI.** Tôi ước "khoảng 8 vòng"; đo thật là **123 vòng
  đổi thành phần, 328 từ đổi vòng**. Ước lượng dựa trên số từ phải chuyển (43) chứ không dựa trên
  cách generator chia lại vòng theo chủ đề + cắt 20 từ/vòng.
- **Không hạ ratchet cho vừa.** Mốc giảm đúng 1 vì tổng số vòng giảm 1 (gộp 3, thêm 2) — nên thay
  vì chỉnh số, bất biến được nâng cấp để con số không còn là thứ quyết định.
- **Chấp nhận xê dịch tiến độ** của 328 từ đổi vòng — đúng cái giá đã nêu khi đề xuất (b).

## Bằng chứng

```
npm run test:coverage → 600 file · 12 424 test xanh
Đo trên curriculum.json: từ nằm trong vòng sai bậc 43 → 0
Vòng: A1–B2 359→357 · C1–C2 229→230 · tổng 677→676 · từ 11 907→11 908
Câu mẫu: 13 vòng hỏng → 0 (đo bằng chính matchedCircleWords của dự án)
```
