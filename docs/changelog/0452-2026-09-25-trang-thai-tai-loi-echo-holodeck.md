# Trạng thái tải / lỗi / rỗng cho thẻ Nói Đè Theo Mẫu và Scenario Holodeck

- **Ngày:** 2026-09-25 · **PR:** PR của nhánh `claude/uiux-upgrade-continue-hv4ioh` (sau #1177)
- **Loại:** `fix(companion)`. Người dùng yêu cầu trực tiếp trong phiên ("tiếp tục sửa trạng thái
  rỗng/lỗi cho Echo và Holodeck"). Đây là nợ ghi ở `0451`.

## Vấn đề

Hai thẻ ở studio "Thử thách" tải danh mục (bài mẫu, kịch bản) bằng `if (res.ok) …` +
`console.error`. Khi API lỗi, mất mạng hoặc trả HTML, thân thẻ để **trống trơn**. Người học không
phân biệt được thẻ đang tải, bị lỗi hay không có nội dung. Việc này vi phạm CLAUDE.md mục 4.3.

## Đã làm

- **`apps/dhcb/src/lib/useCatalogList.ts`** là hook dùng chung, trả trạng thái
  `loading | error | ready` và hàm `retry`.
  - `fetchCatalog` kiểm HTTP và JSON, rồi kiểm từng phần tử bằng schema Zod có sẵn trong
    `core-contracts`. Sai hợp đồng thì báo **lỗi**, không coi là rỗng.
  - Mảng rỗng hợp lệ là trạng thái "sẵn sàng, chưa có gì".
  - Request bị huỷ khi unmount hoặc khi thử lại.
  - Câu lỗi đi qua `thongDiepLoiThanThien`.
- **Hai thẻ** dùng hook này:
  - Đang tải: câu `role="status"`.
  - Lỗi: component `LoadError` có sẵn, nút "Thử lại", kèm câu trấn an rằng tiến độ học không bị ảnh
    hưởng.
  - Rỗng: câu "Chưa có … nào để luyện".
  - Thanh chọn bài mẫu chỉ dựng khi có bài.
- **Test hợp đồng** `useCatalogList.contract.test.ts`: dữ liệu thật của server
  (`listShadowingPassages`, `listPredefinedScenarios`) đi qua JSON phải khớp schema `.strict()` mà
  client dùng. Nếu không có test này, dữ liệu server lệch schema sẽ biến thẻ đang chạy được thành
  thẻ báo lỗi trên production mà CI không hay biết.

## Tầng 8b — ảnh

Đã chụp studio "Thử thách" ở 390/1440 × blue-sky/dark-blue với API lỗi (dev server không có
backend nên trả HTML).

- Trước khi sửa: thân hai thẻ để trống (ảnh ở `0451`).
- Sau khi sửa: mỗi thẻ có khung báo lỗi, câu thân thiện và nút Thử lại. Đọc rõ ở cả hai theme,
  không có nội dung bị lặp hay mất.

## Bằng chứng

- Unit `useCatalogList.test.ts` 6/6: hợp đồng đúng, rỗng, HTTP 500, body HTML, sai hợp đồng, mất
  mạng.
- Test hợp đồng 2/2.
- E2E `e2e/companion-catalog-states.spec.ts` 3/3:
  - Echo: 500 → Thử lại → hiện bài mẫu.
  - Holodeck: rỗng thì báo "chưa có", không báo lỗi.
  - Holodeck: sai hợp đồng → Thử lại → hiện kịch bản.
- Negative control: đưa hai thẻ về bản cũ thì E2E đỏ 3/3.
- Cổng a11y AA/AAA của `/ban-dong-hanh` vẫn xanh khi khung lỗi hiện trong lượt quét. Cả nhóm test
  chạy cùng: 37/37.
- Lúc đầu, test giả lập lỗi theo "thứ tự lần gọi" nên bị React StrictMode chạy effect hai lần ăn
  mất phản hồi 500. Đã đổi sang giả lập theo trạng thái (`set()`), có ghi chú trong test.
