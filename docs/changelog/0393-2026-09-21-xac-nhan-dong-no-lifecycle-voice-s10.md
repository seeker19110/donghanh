# 0393 — 2026-09-21 — Xác nhận đóng nợ "6 lỗi lifecycle voice/AI" (khảo sát S10)

## Việc đã làm

Theo yêu cầu người dùng ("khảo sát 6 lỗi lifecycle voice/AI" — mục nợ ghi ở `PROGRESS.md`
trước đợt việc này). Đọc spec `docs/specs/2026-09-15-learning-ux-s10-tro-giang-trong-bai-voice.md`
§2.1 + §④ Phần 1 và changelog `docs/changelog/0332-2026-09-15-s10-1-sua-lifecycle-companion.md`:
cả 6 lỗi (L1–L6, AC-1…AC-6) đã được **sửa xong hoàn toàn từ 2026-09-15** ở PR S10-1, có bảng
8 ca test đỏ-trước/xanh-sau đầy đủ trong changelog đó. Dòng nợ 🟡 ở `PROGRESS.md` mô tả kết quả
khảo sát ban đầu (trước khi sửa), không phải trạng thái thật hiện tại — đã lỗi thời.

Xác minh lại bằng cách chạy các test canh liên quan trên `main` hiện tại:

```
npx vitest run apps/dhcb/src/pages/companion apps/dhcb/src/lib/companionApi.test.ts \
  apps/dhcb/src/lib/tts.test.ts apps/dhcb/src/lib/sttServer.test.ts \
  apps/dhcb/src/components/programming/AiHelpPanel.test.tsx
```

Kết quả: 5 file test / 98 ca — tất cả xanh, không regression.

**Việc làm:** dời mục nợ từ `PROGRESS.md` (🟡 đang mở) sang `docs/legacy/no-ky-thuat-da-dong.md`
(🟢 đã trả) theo đúng quy ước ở cuối `PROGRESS.md` § "Nợ kỹ thuật còn mở". Không sửa code —
đây là cập nhật tài liệu điều hành cho khớp thực tế (đúng tinh thần Tầng 6b của
`docs/framework/QUY-TRINH-AUDIT.md`: tài liệu điều hành có nói đúng thực tế không).

## Issue / outcome

`PROGRESS.md` phản ánh đúng trạng thái hiện tại: không còn liệt kê một món nợ đã trả từ 6 ngày
trước là "đang mở".

## Research / spec

Không có thay đổi hành vi — chỉ đối chiếu tài liệu với spec/changelog/test đã có sẵn.

## Validation

- Chạy lại 5 file test liên quan (98 ca) trên `main` hiện tại: ✅ xanh, không regression.
- `npm run typecheck` ✅ · `npm run lint` ✅ (0 cảnh báo) · `npm run build` ✅
- `npm test` (toàn bộ): không chạy lại toàn bộ vì không đổi code nguồn; các file liên quan đã
  xác minh riêng ở trên.

## Rủi ro, rollout và rollback

Không có rủi ro — chỉ sửa tài liệu (`PROGRESS.md` + `docs/legacy/no-ky-thuat-da-dong.md`).
Rollback: `git revert`.

## Definition of Done

- [x] Xác minh lại 6 lỗi lifecycle đã sửa (test đỏ/xanh của PR S10-1 vẫn xanh)
- [x] Dời mục nợ từ `PROGRESS.md` sang `docs/legacy/no-ky-thuat-da-dong.md` kèm bằng chứng
- [x] Cổng typecheck/lint/build đều xanh
