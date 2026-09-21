# 0395 — 2026-09-21 — Đóng nợ TODO(audit A4): 3 modal cuối chuyển `vh` → `dvh`

## Việc đã làm

`/maintain` (báo cáo bảo trì định kỳ) đếm 52 file có TODO/FIXME/HACK. Rà lại thủ công cho
thấy gần hết là chữ "TODO" nằm trong **nội dung bài học môn Lập trình**
(`packages/subject-programming/lessons/*.ts`) — chỗ trống cố ý để học viên tự điền code,
không phải nợ kỹ thuật thật — và một chuỗi "XXXX-XXXX..." trong `twoFactor.ts` bị đếm nhầm
là mẫu "XXX".

**Nợ thật duy nhất tìm thấy:** `TODO(audit A4)` trong `scripts/ui-policy.test.ts` — danh sách
`BASELINE` miễn trừ 3 hộp thoại tự chế còn dùng `max-h-[NNvh]` thay vì `max-h-[NNdvh]` (lỗi
tràn màn hình dưới thanh URL trên iOS Safari, xem audit UI/UX 2026-08-31 mục A4). Ghi chú
trong test đã tự hướng dẫn: "danh sách rỗng thì xoá luôn hằng số này và phần lọc bên dưới."

Đã sửa cả 3 file sang `dvh` (không đổi cấu trúc modal, không mở rộng thành cả chiến dịch
chuyển 24 modal sang `<Modal>` — đó là phạm vi khác, lớn hơn nhiều so với việc đóng đúng một
dòng TODO này):

- `apps/dhcb/src/components/MetacognitiveReflection/MetacognitiveReflectionModal.tsx`
- `apps/dhcb/src/components/LifeSynthesis/LifeSynthesisDetailModal.tsx`
- `apps/dhcb/src/pages/subjects/english/Writing.tsx` (textarea `sm:max-h-[55vh]`, không phải
  modal nhưng cùng luật)

Xoá `BASELINE` + bộ lọc miễn trừ trong `scripts/ui-policy.test.ts`, siết luật thành "không có
`max-h-[NNvh]` ở bất kỳ đâu" — không còn ngoại lệ.

## Quyết định

Không đụng tới TODO trong `packages/subject-programming/lessons/*.ts` — đó là nội dung sư
phạm (đề bài yêu cầu học viên tự viết phần còn thiếu), xoá hoặc "hoàn thiện" chúng sẽ phá bài
học. Không coi đây là nợ kỹ thuật cần đóng.

## Bằng chứng kiểm chứng

- `npx vitest run scripts/ui-policy.test.ts` — 2/2 test xanh (bao gồm luật mới không còn
  ngoại lệ).
- `npm run codemap -- impact <file>` cho cả 3 file đã sửa — chỉ ảnh hưởng qua import bình
  thường (Companion Studios, App.tsx), không có cấu trúc rủi ro.
- `npm run typecheck` ✅ · `npm run lint` ✅ (0 cảnh báo) · `npm test` ✅ (691 file / 14765 test,
  2 skip) · `npm run build` ✅.
