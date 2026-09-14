# 0297 — 2026-09-14 — Đính chính số liệu nợ nội dung STEM + trám cổng thiếu của môn Sinh

**PR:** (điền khi tạo) · **Nhánh:** `claude/optimistic-pasteur-goh7vb`
**Không có đặc tả trước** — việc phát sinh từ yêu cầu trong phiên: kiểm chứng lại con số nợ nội
dung của đợt 4 môn STEM (`docs/changelog/0295-*.md`) xem có chính xác không.

## Việc đã làm

Nạp thẳng 4 registry bài học rồi ĐẾM (không chép tay), đối chiếu với con số đang lưu hành:

| Môn      | Bài     | Tổng câu | Trắc nghiệm     | Câu tự chấm được | `reviewed` |
| -------- | ------- | -------- | --------------- | ---------------- | ---------- |
| Toán     | 35      | 105      | 17              | 88               | 0          |
| Vật lí   | 94      | 208      | 119             | 89               | 0          |
| Hoá học  | 81      | 182      | 137             | 45               | 0          |
| Sinh học | 84      | 170      | 169 (99,4%)     | 1                | 0          |
| **Tổng** | **294** | **665**  | **442 (66,5%)** | **223**          | **0**      |

Kết quả kiểm chứng: con số **442 câu trắc nghiệm** và **Sinh 169/170** ĐÚNG chính xác; nhưng
tỉ lệ bị ghi nhầm **60%** trong khi thực tế là **66,5%**, và phạm vi nợ bị ghi HẸP hơn thực tế.

## Ba phát hiện

1. **Test "chấm lại toàn bộ đáp án" là tautology.** Nhật ký #893 mô tả nó như "người duyệt tự
   động" thay cho cổng chuyên môn. Thực tế nó dựng `studentInput` từ chính `q.answer` rồi đòi
   `gradeAnswer` trả `correct: true` — với câu trắc nghiệm chỉ chứng minh `correctIds` nằm trong
   `choices`, không chứng minh phương án đó đúng về kiến thức. Ghi thành **TRAPS.md mục 4**.
2. **Môn Sinh KHÔNG có ca test đó**, dù #893 ghi "mỗi môn đều có". `lessons.test.ts` của Sinh
   không import `@dhcb/core-grading` (3 môn kia có). Đúng loại lệch "tài liệu điều hành nói
   không đúng thực tế" mà Tầng 6b của `QUY-TRINH-AUDIT.md` nhắm tới.
3. **Nợ rộng hơn con số 442.** `reviewStatus: 'reviewed'` là **0/294 bài** — nợ chuyên môn là
   toàn bộ 665 câu + 294 phần lý thuyết/ví dụ mẫu/thẻ SRS, không riêng phần trắc nghiệm.

## Đã sửa

- `packages/subject-biology/lessons.test.ts` — thêm 2 ca còn thiếu cho đủ ngang 3 môn kia:
  `reviewStatus` được đánh dấu, và mọi `checkQuestion` tự chấm đúng bằng engine thật.
- Comment cảnh báo trên thân ca test ở **cả 4 môn**: nói rõ đây là cổng NHẤT QUÁN, không phải
  cổng ĐÚNG KIẾN THỨC, trỏ về TRAPS.md mục 4 — để người đọc mã sau không kết luận nhầm.
- `TRAPS.md` mục 4 — khuôn lỗi + cách rà ("dữ liệu đầu vào của bài kiểm tra có ĐỘC LẬP với dữ
  liệu đang bị kiểm không?") + 3 cổng chốt chặn.
- `PROGRESS.md` — số liệu đúng, phạm vi nợ đúng.
- `docs/changelog/0295-*.md` — thêm khối ĐÍNH CHÍNH tại chỗ quyết định số 1.

## Chấm mẫu chất lượng nội dung

Đọc tay 4 câu Sinh rải đều (`sinh10-c1-b2`, `sinh10-c7-b21`, `sinh11-c3-b20`, `sinh12-c7-b24`):
cả 4 đúng kiến thức, phương án nhiễu hợp lý. Mẫu 4/442 KHÔNG kết luận được gì về tổng thể —
chỉ nói rằng không có dấu hiệu sai hệ thống lộ liễu. Nợ chuyên môn vẫn còn nguyên.

## Bằng chứng kiểm chứng

```
npm ci                 ✅  (lockfile khớp)
rm -rf packages/*/dist dist dist-server && npm run typecheck  ✅  (tái hiện checkout sạch của CI)
npm run lint           ✅  0 cảnh báo
npm run format         ✅  Prettier: unchanged
npm run test:coverage  ✅  590 tệp / 12305 test — stmt 94,57% · branch 90,65% · func 94,91% · line 94,96%
npm run build          ✅
```

Test môn Sinh đi từ 9 → 11 ca, đều xanh ngay lượt đầu (dữ liệu vốn đã nhất quán với engine —
đúng như dự đoán, vì ca test này không kiểm được cái đang thiếu).

Không chạy `eval:tutor` / `eval:code-feedback`: đợt này không đụng `apps/dhcb/src/prompts/*`,
`packages/core-ai/aiConfig.ts` hay `packages/subject-programming/feedbackPrompt.ts`.
Không chạy Tầng 8b (ảnh chụp trang): đợt này không chạm giao diện.

## Còn nợ

Không đổi so với #893, chỉ được ghi đúng hơn: **442 câu trắc nghiệm không có cổng máy nào kiểm
được tính đúng kiến thức**, và 0/294 bài đã qua người chuyên môn. Không có cách tự động hoá —
đây là việc của người, cần đặt lịch duyệt theo môn khi có người học thật.
