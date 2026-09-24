# 0433 — Dọn lỗi thô và thuật ngữ nội bộ còn sót sau audit UI/UX

- **Ngày:** 2026-09-24
- **Nhánh:** `claude/ui-ux-upgrade-at5ocb`
- **Nguồn:** hai nợ mở trong `PROGRESS.md` (đợt audit `docs/audit/2026-09-22-danh-gia-sau-ui-ux.md`
  P1-1 và P1-6), thực hiện bằng 2 subagent Haiku (`mechanical-worker`) chạy song song sau khi đã
  dò phạm vi thật (grep toàn `apps/dhcb/src`, đọc từng file) ở phiên chính.

## Việc đã làm

1. **Bọc `err.message` thô qua `thongDiepLoiThanThien`** (`apps/dhcb/src/lib/friendlyError.ts`,
   đã có sẵn từ đợt dọn trang Ghi chú) ở 8 chỗ còn lại hiện thẳng chuỗi kỹ thuật của trình duyệt
   lên giao diện:
   - `apps/dhcb/src/components/location/LiveMap.tsx` — lỗi tải Google Maps.
   - 6 panel `apps/dhcb/src/components/admin/Admin*Panel.tsx` (Payments, Feedback, TtsCache,
     FeatureStatus, ReservedNames, SystemControl) — 11 điểm `err instanceof Error ? err.message : …`.

   **Có chủ đích KHÔNG sửa:** `lib/*Runner.ts` + `workers/*` (tính năng học lập trình — lỗi chạy
   code phải hiện nguyên văn để học viên tự debug); `cloud.ts`/`useCloudSync.ts`/`onboarding.ts`
   (chỉ `console.warn`, không hiện cho người dùng); `pages/learning/Subjects.tsx` và
   `SubjectDetail.tsx` (`err.message` ở đây đến từ `SubjectApiError` đã tự viết câu tiếng Việt sẵn
   trong `lib/subjectApi.ts`, không phải chuỗi kỹ thuật thô).

2. **Dọn 2 nhãn kỹ thuật/thuật ngữ nội bộ còn sót** (P1-1):
   - `apps/dhcb/src/components/EdgeAi/EdgeAiIndicator.tsx` — modal chi tiết hiện thẳng
     `capability.inferenceMode` (`webgpu`/`wasm`) → đổi thành câu tiếng Việt ("Chấm ngay trên
     máy"/"Chấm trên máy"/"Chấm qua máy chủ"), nhãn "GPU Adapter:" → "Phần cứng xử lý:".
   - `apps/dhcb/src/components/MemoryPalace/MemoryPalaceCard.tsx` — gộp hai badge
     "Platform V5 Method of Loci" + "Spatial Memory Palace & Mnemonics" (tiếng Anh, số phiên bản
     nội bộ) thành một badge tiếng Việt "Ghi nhớ bằng không gian".
   - `CyberTutorAvatar3D.tsx` đã được dọn từ đợt trước (comment trong code xác nhận ba nhãn
     "Interactive Gaze Active · 15 Oculus Morphing · PBR Cyber Shader" đã gỡ) — không cần sửa thêm.

## Bằng chứng kiểm chứng

- `npm run typecheck` ✅ (0 lỗi, cả 4 tsconfig).
- `npx eslint <9 file đã sửa>` ✅ (0 lỗi, 0 cảnh báo).
- `npx vitest run apps/dhcb/src/lib/friendlyError.test.ts` ✅ (5/5).
- Đọc diff `git diff` toàn bộ 9 file — đúng 1:1 với brief giao subagent, không có sửa vô ý.

## Nợ liên quan còn mở (không đụng trong đợt này)

Phần còn lại của nợ UI/UX trong `PROGRESS.md` (Phòng luyện tập vs Tiếng Anh home trùng lối vào,
ảnh Hồ sơ 1440px chụp mờ, theme `kid` chỉ đổi màu, test `home-clarity-evidence.spec.ts` flaky) cần
quyết định thiết kế hoặc quan sát tay — chưa làm ở đợt này.
