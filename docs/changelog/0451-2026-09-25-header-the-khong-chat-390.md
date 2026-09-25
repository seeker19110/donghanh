# Header thẻ Bạn Đồng Hành không còn bị ép hẹp ở 390 px

- **Ngày:** 2026-09-25 · **PR:** PR của nhánh `claude/uiux-upgrade-continue-hv4ioh` (sau #1176)
- **Loại:** `style(companion)`, chỉ đổi bố cục. Người dùng yêu cầu trực tiếp trong phiên
  ("tiếp tục sửa các thẻ chật ở 390px"). Đây là nợ ghi ở `0447` và `0450`.

## Vấn đề

Sáu thẻ ở `components/CompanionVoice/` dùng chung một khuôn header: khối tiêu đề và nút CTA nằm
chung một hàng `flex justify-between`, không xuống dòng. Ở 390 px, nút chiếm chỗ nên tiêu đề bị
ép thành cột hẹp 3 dòng, và chính nút cũng bị bẻ chữ thành 3–4 dòng (cao 60–76 px). Ba thẻ lộ rõ
nhất là 3D Articulatory, Acoustic Lab và Wearables.

## Đã làm

- Áp cho 6 thẻ Articulatory, Acoustic Lab, Wearables, Echo Shadowing, Scenario Holodeck, Socratic:
  - Header: `flex-col gap-3` ở màn hẹp, `sm:flex-row sm:items-center sm:justify-between` từ 640 px.
  - Khối tiêu đề thêm `min-w-0`. Hàng tiêu đề + badge thêm `flex-wrap`. Icon thêm `shrink-0`.
  - Nút CTA thêm `self-start sm:self-auto shrink-0 whitespace-nowrap`.
- Cổng `e2e/a11y.spec.ts` đo 3 studio Ghi nhớ/Thử thách/Kế hoạch ở 390 px. Ngưỡng: mọi tiêu đề h3
  tối đa 2 dòng, và nút ngay trong header thẻ cao tối đa 48 px (một dòng).

## Tầng 8b — ảnh trước/sau

Đã chụp 3 studio × 390/1440 × blue-sky/dark-blue, tổng 12 cặp ảnh.

- Ở 390 px, tiêu đề còn 1–2 dòng và nút CTA một dòng nằm dưới khối tiêu đề.
- Ở 1440 px, bố cục giữ nguyên như trước.
- Không có nội dung bị lặp hay bị mất.

## Nợ ghi nhận

- Badge "0 bạn học phù hợp" (A2A) và "Chưa kích hoạt" (Ambient Copilot) vẫn xuống 2 dòng ở
  390 px. Đây là khuôn header khác, chữ vẫn đọc được.
- Thẻ Echo Shadowing và Scenario Holodeck có vùng thân rỗng khi API không trả dữ liệu, không có
  trạng thái rỗng/lỗi hiển thị.

## Bằng chứng

- Negative control: đưa 6 component về bản cũ thì test đỏ 2/3 studio. Test chỉ ra tiêu đề 3 dòng
  và nút cao 60/76 px ở 3 thẻ.
- `npx playwright test e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts -g "Bạn Đồng Hành"` với bản sửa: xanh.
- Cổng commit gồm typecheck + lint + test (hook) và build.
