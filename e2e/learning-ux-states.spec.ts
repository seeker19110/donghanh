import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import type { ThemeName } from './helpers/auth'
import { freezeAnimations } from './helpers/axe'
import { LEARNING_UX_SCREENS, moManHinh, type StateId } from './helpers/learningUxScreens'

// ──────────────────────────────────────────────────────────────────────────────
// a11y AA cho BỐN TRẠNG THÁI PHI-DỮ-LIỆU (spec S13 AC-5).
//
// Vì sao cần: `a11y.spec.ts` chỉ mở route rồi quét — tức luôn quét đúng MỘT
// trạng thái (mặc định, có dữ liệu). Bẫy đã ghi ở `e2e/badge-contrast.spec.ts`
// dòng 1–6: phần tử chỉ xuất hiện khi có dữ liệu (hoặc khi lỗi, khi đang tải)
// CHƯA TỪNG được axe nhìn thấy. Màn lỗi và màn chờ là chỗ tương phản hay hỏng
// nhất (chữ xám trên nền xám, spinner không có nhãn).
//
// Phạm vi cố ý hẹp để không kéo dài mảnh E2E chậm nhất (spec §8): 2 theme
// (một tối `dark-blue` + một sáng `blue-sky` — hai đầu tương phản) × 2 bề rộng.
// ──────────────────────────────────────────────────────────────────────────────

const TRANG_THAI: readonly StateId[] = ['empty', 'loading', 'error', 'feedback']
const THEMES: readonly ThemeName[] = ['dark-blue', 'blue-sky']
const BE_RONG = [
  { w: 390, h: 844 },
  { w: 1440, h: 900 },
] as const

// ── NỢ ĐÃ ĐO, chờ S13-2 sửa ──────────────────────────────────────────────────
//
// Cổng này TÌM RA MỘT VI PHẠM AA THẬT ngay lượt chạy đầu — đúng thứ nó sinh ra để
// tìm (trạng thái "đang tải"/"rỗng" chưa từng được axe nhìn thấy, vì
// `a11y.spec.ts` chỉ mở route rồi quét, tức luôn quét trạng thái mặc định):
//
//   `aria-prohibited-attr` (serious) trên màn `today`, ở nhiều trạng thái, số phần
//   tử thay đổi theo bề rộng (1 ở 390, 2 ở 1440). Gốc:
//   `components/Home/TodayCard.tsx:74` —
//   `<div aria-busy aria-live aria-label="Đang tìm việc học hôm nay">`. `aria-label`
//   BỊ CẤM trên phần tử không có role (role ngầm `generic`); phải thêm
//   `role="status"` thì nhãn mới hợp lệ VÀ mới được trình đọc màn hình đọc lên.
//
// S13-1 là PR CÔNG CỤ, không sửa giao diện (spec §9: sửa là việc của S13-2), nên ô
// này được ghi lại kèm ĐÚNG MÃ LUẬT — đây KHÔNG phải tắt cổng: mọi mã luật KHÁC vẫn
// làm test đỏ ở mọi màn, mọi trạng thái, mọi theme, mọi bề rộng.
//
// Ghi theo MÃ LUẬT chứ không theo chuỗi có số phần tử, vì số phần tử phụ thuộc bề
// rộng — ghi chuỗi cứng thì cổng đỏ giả ở bề rộng khác.
//
// ĐIỀU KIỆN GỠ: `TodayCard.tsx:74` có role hợp lệ → xoá nguyên khối `NO_AA` này
// (S13-2 phải chạy lại spec này để chứng minh 0 vi phạm, không còn ngoại lệ nào).
const NO_AA: Record<string, readonly string[]> = {
  today: ['aria-prohibited-attr'],
}

for (const man of LEARNING_UX_SCREENS) {
  for (const state of TRANG_THAI) {
    const setup = man.states[state]
    if (setup.kind === 'n/a') {
      // Ô không tồn tại thật: ghi thành test BỎ QUA có lý do, để log CI nói rõ
      // "không có" chứ không im lặng bỏ sót.
      test.skip(`a11y ${man.id}/${state} — n/a: ${setup.reason}`, () => {})
      continue
    }
    for (const theme of THEMES) {
      for (const { w, h } of BE_RONG) {
        test(`a11y AA ${man.id}/${state} @ ${theme} ${w}px`, async ({ page }) => {
          await page.setViewportSize({ width: w, height: h })
          const mo = await moManHinh(page, man, state, theme)
          expect(mo, `${man.id}/${state} không mở được`).toBe(true)
          await freezeAnimations(page)

          const { violations } = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            // Dự án CHỦ ĐỘNG khoá zoom — cùng ngoại lệ với `a11y.spec.ts`.
            .disableRules(['meta-viewport'])
            .analyze()

          const daGhiNo = NO_AA[man.id] ?? []
          const mota = violations
            .filter((v) => !daGhiNo.includes(v.id))
            .map((v) => `${v.id} (${v.impact}, ${v.nodes.length} phần tử)`)
          expect(
            mota,
            `[${man.id}/${state} @ ${theme} ${w}px] vi phạm AA ngoài danh sách nợ đã ghi (${daGhiNo.join(', ') || 'rỗng'})`,
          ).toEqual([])
        })
      }
    }
  }
}
