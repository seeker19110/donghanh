import { test, expect } from '@playwright/test'
import { mockLogin, USER_ID } from './helpers/auth'

const path = '/goc-hoc-tap/physics/bai-hoc/ly10-c1-b1'

for (const width of [390, 1440]) {
  test(`sổ lỗi mở đúng câu, Back và reload giữ nháp (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await mockLogin(page, 'vi')
    await page.route('**/api/learning/evidence*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          state: [],
          attempts: [
            {
              schemaVersion: 1,
              subjectId: 'physics',
              contentId: 'ly10-c1-b1',
              activityKind: 'stem_lesson_check',
              attemptId: 'aaaaaaaabbbbcccc',
              clientAt: '2026-09-10T08:00:00.000Z',
              serverAt: '2026-09-10T08:00:01.000Z',
              ownerId: USER_ID,
              evidenceKind: 'server_graded',
              correct: 0,
              total: 2,
              ratio: 0,
              passed: false,
              items: [{ questionIndex: 1, correct: false, reason: 'WRONG_VALUE' }],
            },
          ],
        }),
      }),
    )
    let submissions = 0
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().includes('/api/learning/evidence'))
        submissions++
    })
    await page.goto('/so-tay-loi-sai')
    await page.getByRole('button', { name: 'Vật lí', exact: true }).click()
    await page
      .getByRole('link', { name: /Ôn lại lỗi này/ })
      .first()
      .click()
    const question = page.locator('#cau-2')
    await expect(question).toBeFocused()
    await expect(question).toBeInViewport()
    const headerBottom = await page
      .locator('header')
      .first()
      .evaluate((el) => el.getBoundingClientRect().bottom)
    const top = await question.evaluate((el) => el.getBoundingClientRect().top)
    expect(top).toBeGreaterThanOrEqual(headerBottom)
    const choice = question.locator('..').getByRole('button').first()
    await choice.click()
    await expect(choice).toHaveAttribute('aria-pressed', 'true')
    await page.evaluate(() => {
      location.hash = 'cau-1'
    })
    await expect(page.locator('#cau-1')).toBeFocused()
    await page.goBack()
    await expect(question).toBeFocused()
    await expect(choice).toHaveAttribute('aria-pressed', 'true')
    await page.reload()
    await expect(question).toBeFocused()
    await expect(choice).toHaveAttribute('aria-pressed', 'true')
    expect(submissions).toBe(0)
    await page.screenshot({ path: test.info().outputPath(`stem-deep-link-${width}.png`) })
  })
}

test('câu không còn tồn tại quay về tiêu đề đúng bài', async ({ page }) => {
  await mockLogin(page, 'vi')
  await page.goto(`${path}#cau-999`)
  await expect(page.getByRole('heading', { level: 1, name: 'Làm quen với Vật lí' })).toBeFocused()
})
