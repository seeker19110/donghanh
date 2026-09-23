import { test, expect } from '@playwright/test'
import { mockLogin } from './helpers/auth'

for (const width of [390, 1440]) {
  test(`danh sách bài giữ đích duy nhất khi tải thêm và đọc đủ tình huống (${width}px)`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await mockLogin(page, 'vi', 'blue-sky')
    await page.goto('/bai-hoc')
    const cards = page.locator('button[id^="lesson-card-"]')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    const situation = page.locator('#lesson-card-8-situation')
    await situation.scrollIntoViewIfNeeded()
    await cards.last().scrollIntoViewIfNeeded()
    await expect.poll(() => cards.count()).toBeGreaterThan(count)
    await expect(situation).toHaveCount(1)
    await situation.scrollIntoViewIfNeeded()
    expect(await situation.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
    const ids = await page
      .locator('[id^="lesson-card-"]')
      .evaluateAll((elements) => elements.map((el) => el.id))
    expect(new Set(ids).size).toBe(ids.length)
    await page.screenshot({ path: test.info().outputPath(`lesson-list-${width}.png`) })
  })
}
