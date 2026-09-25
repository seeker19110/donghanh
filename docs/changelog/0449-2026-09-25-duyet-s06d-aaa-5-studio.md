# Duyệt S06d — AAA cho chữ đọc ở 5 studio Bạn Đồng Hành, sửa tràn ngang 390 px

- **Ngày:** 2026-09-25 · **PR:** PR tài liệu của nhánh `claude/uiux-upgrade-continue-hv4ioh`
- **Loại:** `docs(spec)`, chỉ đổi tài liệu.

## Bối cảnh

S06c (`0448`) để lại hai nợ: chữ đọc ở 5 studio `/ban-dong-hanh` chưa qua cổng AAA, và thẻ
Workplace Harvester tràn ngang ở 390 px. Người dùng yêu cầu tiếp tục nâng cấp UI/UX.

## Đo trên main `05d0929`

Thêm tạm vào `e2e/a11y-aaa.spec.ts` một vòng 5 studio × 3 theme, dùng `scanAaa` hiện có. Kết quả
**10/15 ca đỏ**:

| Studio     | dark-blue | blue-sky | kid |
| ---------- | --------- | -------- | --- |
| Trò chuyện | ✅        | ✅       | ✅  |
| Ghi nhớ    | ❌        | ❌       | ❌  |
| Thử thách  | ❌        | ❌       | ❌  |
| Kế hoạch   | ❌        | ✅       | ✅  |
| Tổng kết   | ❌        | ❌       | ❌  |

Có hai nhóm lỗi:

- Badge/nhãn/đoạn chữ nội dung có tỷ lệ 5.1–6.96, dưới 7:1.
- Chữ đọc nằm trên nền gradient, axe không đo được nên cổng báo "chưa kết luận".

Chi tiết theo component ghi ở mục "Quyết định S06d" của spec.

Lần đo đầu ở 390 px còn cho thêm các ca "partially obscured" ở nhãn thanh điều hướng đáy. Lỗi này
chung cho mọi trang ở viewport hẹp, nên được tách khỏi S06d và ghi thành nợ riêng. Vòng quét
S06d dùng viewport mặc định, giống mọi route AAA khác.

## Đã làm

- Spec S06–S08: thêm **Quyết định S06d — Approved for implementation**.
- `PROGRESS.md`: thêm dòng S06d.

## Bằng chứng

- `npx playwright test e2e/a11y-aaa.spec.ts -g "Bạn Đồng Hành"` trên main: 10 failed / 5 passed.
- `npx prettier --check` · `npm run check:specs` · `npx vitest run scripts/changelog.test.ts`
