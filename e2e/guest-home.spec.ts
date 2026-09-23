// e2e/guest-home.spec.ts — Trang chủ cho KHÁCH VÃNG LAI (chưa đăng nhập).
//
// Đặc tả: docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md §P0-3 AC-5/AC-6/AC-7.
//
// KHÔNG gọi `mockLogin`: mặc định (không seed token) là chế độ Khách (`AuthProvider` tự cấp
// một `User` ảo `isGuest=true` — xem `e2e/login-redirect.spec.ts`).
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { freezeAnimations } from './helpers/axe'

const CTA = 'Bắt đầu — chọn việc đầu tiên'

// Bài mẫu P1-U4 — cùng bài `e2e/learning-session-resume.spec.ts` dùng, đủ để tạo một khoá
// `dhcb_lsession_v1_*` thật (bằng chứng "đã có phiên học" của `hasAnyGuestSession()`).
const BAI = '/lap-trinh/bai-hoc/p1-u4-l1'

test('khách mới mở "/" KHÔNG thấy GuestBanner; bấm CTA đưa tới /bat-dau; sau 1 phiên học thì quay về "/" thấy GuestBanner', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: CTA })).toBeVisible()
  // Banner nhắc "đăng ký" chỉ hiện SAU KHI khách đã có ít nhất một dấu vết học thật.
  await expect(page.getByRole('status').filter({ hasText: 'chế độ khách' })).toHaveCount(0)

  await page.getByRole('link', { name: CTA }).click()
  await expect(page).toHaveURL(/\/bat-dau$/)

  // Hoàn tất một phiên học thật (gõ vào ô code bước "Tự viết" — ghi có debounce 500ms).
  await page.goto(BAI, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Tự viết' }).click()
  const o = page.getByRole('textbox', { name: /Ô (soạn code|gõ lệnh) bài tự viết/ })
  await expect(o).toBeVisible()
  await o.click()
  await page.keyboard.press('Control+End')
  await page.keyboard.type('\n# dau an cua khach')
  await expect
    .poll(() =>
      page.evaluate(() => Object.keys(localStorage).some((k) => k.startsWith('dhcb_lsession_v1_'))),
    )
    .toBe(true)

  await page.goto('/')
  await expect(page.getByRole('status').filter({ hasText: 'chế độ khách' })).toBeVisible()
})

// AC-6: thời gian tới CTA hiện (goto → CTA visible) < 3000ms trên CI.
test('AC-6: CTA hiện trong dưới 3000ms kể từ khi mở "/"', async ({ page }) => {
  const start = Date.now()
  await page.goto('/')
  await expect(page.getByRole('link', { name: CTA })).toBeVisible()
  const elapsedMs = Date.now() - start
  // Ghi số đo ra output CI để dán vào PR (AC-6 yêu cầu "ghi số vào PR").
  console.log(`[AC-6] Thời gian tới CTA guest_home_start: ${elapsedMs}ms`)
  expect(elapsedMs).toBeLessThan(3000)
})

// AC-7: a11y 3 theme cho "/" ở trạng thái khách — dùng chung cách quét với e2e/a11y.spec.ts.
for (const theme of ['dark-blue', 'blue-sky', 'kid'] as const) {
  test(`a11y (khách): trang chủ theme=${theme} — 0 vi phạm A/AA`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('ui_theme', t), theme)
    await page.goto('/')
    await expect(page.getByRole('link', { name: CTA })).toBeVisible()
    await freezeAnimations(page)
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length} phần tử)`)).toEqual([])
  })
}
