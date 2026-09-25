# S06d — AAA cho chữ đọc ở 5 studio Bạn Đồng Hành, sửa tràn ngang 390 px

- **Ngày:** 2026-09-25 · **PR:** PR source của nhánh `claude/uiux-upgrade-continue-hv4ioh`
- **Loại:** `fix(a11y)`. Đặc tả: `docs/specs/2026-09-23-uiux-s06-s08-accessibility.md`, mục
  "Quyết định S06d" (duyệt ở `0449`, PR #1175).

## Đã làm

- **Bỏ nền gradient dưới chữ đọc.** Bốn thẻ `MetacognitiveJournalCard`, `MemoryPalaceCard`,
  `DebateArenaCard`, `StemScratchpadCard` và khung `AcousticPhoneticsLab` đổi từ gradient
  `from-*-950/40 …` sang `bg-surface-card`, giữ viền màu cho nhận diện. Nút gradient (bốn thẻ trên
  và "Khởi chạy Agent" ở `AgentOrchestratorCard`) đổi sang nền đặc: teal-700/indigo-600 với
  `text-[#fff]`, amber-500 với `text-[#09090b]`.
- **Badge/nhãn chữ 11 px ≥ 7:1.** Dark: `text-*-300` → `text-*-200`. Theme sáng:
  `theme-light:text-*-800` → `*-900`. Áp cho badge ở Socratic, Wearables, Echo Shadowing, Scenario
  Holodeck, A2A, Acoustic Lab, Life Synthesis ("V5.4 Flagship", "Holistic") và "V4.2 Hub" ở
  `StudioSynthesis`. Đoạn `text-zinc-500` ở `AgentOrchestratorCard` → `text-content-secondary`.
- **Workplace Harvester.** Header dùng `flex-wrap` + `min-w-0` nên xuống dòng ở màn hẹp. Tab có
  `type="button"`, `aria-pressed`, `.tap-44-y`. Ô nhập có `aria-label` và co giãn được.
- **Cổng.**
  - `e2e/a11y-aaa.spec.ts` thêm vòng 5 studio × 3 theme.
  - `e2e/a11y.spec.ts` thêm test thẻ Workplace Harvester ở 390 px: tab "Thẻ SRS" nằm trọn trong
    viewport, và `scrollWidth - clientWidth = 0` cho cả header lẫn thẻ.

## Tầng 8b — ảnh trước/sau

Đã chụp toàn trang 4 studio bị sửa × 390/1440 × blue-sky/dark-blue, tổng 16 cặp ảnh.

- Ở blue-sky, thẻ Ghi nhớ/Thử thách trước đây là dải gradient xám đục. Giờ là thẻ nền sáng, chữ
  rõ hơn.
- Ở 390 px, thẻ Workplace Harvester hiện đủ hai tab. Trước đây tab "Thẻ SRS" bị cắt.
- Không có nội dung bị lặp hay bị mất.

## Nợ ghi nhận (ngoài phạm vi S06d)

- **Thẻ chật ở 390 px.** Wearables, 3D Articulatory và Acoustic Lab bị ép tiêu đề/nút thành cột
  hẹp, và nút CTA xuống 3–4 dòng. Chưa tràn ngang, nhưng khó đọc.
- **Nhãn thanh điều hướng đáy.** Khi quét AAA ở 390 px, axe báo "partially obscured". Lỗi này
  chung mọi trang.

## Bằng chứng

- Trên main (trước khi sửa), `npx playwright test e2e/a11y-aaa.spec.ts -g "Bạn Đồng Hành"` cho
  10 failed / 5 passed (`0449`).
- Sau khi sửa, `npx playwright test e2e/a11y-aaa.spec.ts e2e/a11y.spec.ts -g "Bạn Đồng Hành"`
  cho 31/31: 15 AAA + 15 AA của S06c + 1 test tràn ngang.
- Negative control: đặt lại `WorkplaceHarvesterCard.tsx` bản cũ thì test tràn ngang đỏ, tab "Thẻ
  SRS" chỉ nằm 69% trong viewport.
- Cổng commit gồm typecheck, lint, test (hook), cộng build.
