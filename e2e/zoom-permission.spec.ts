import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockLogin, type ThemeName } from './helpers/auth'

// Đo quyền zoom và reflow; không coi viewport giả lập là bằng chứng pinch trên thiết bị thật.
for (const theme of ['dark-blue', 'blue-sky', 'kid'] as const satisfies readonly ThemeName[]) {
  test(`viewport cho phép zoom và trang chào không tràn ngang — ${theme}`, async ({ page }) => {
    await mockLogin(page, 'vi', theme)
    await page.goto('/welcome')
    await expect(page.locator('main')).toBeVisible()
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).not.toHaveAttribute('content', /user-scalable\s*=\s*(no|0)/i)
    const scan = await new AxeBuilder({ page }).withRules(['meta-viewport']).analyze()
    expect(scan.violations).toEqual([])
    expect(scan.incomplete).toEqual([])
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await expect
        .poll(
          () =>
            page.evaluate(
              () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
            ),
          { message: `${theme} @${width}: tràn trang` },
        )
        .toBeLessThanOrEqual(1)
      const layout = await page.evaluate(() => ({
        touchActions: [document.documentElement, document.body].map(
          (node) => getComputedStyle(node).touchAction,
        ),
      }))
      for (const action of layout.touchActions) {
        expect(
          action === 'auto' || action === 'manipulation' || action.includes('pinch-zoom'),
        ).toBe(true)
      }
    }
  })
}

test('negative control: cổng axe bắt viewport khóa zoom', async ({ page }) => {
  await page.setContent(
    '<html lang="vi"><head><title>Control zoom</title><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></head><body><main><h1>Kiểm tra phóng to</h1></main></body></html>',
  )
  const scan = await new AxeBuilder({ page }).withRules(['meta-viewport']).analyze()
  expect(scan.violations.map((rule) => rule.id)).toContain('meta-viewport')
})
