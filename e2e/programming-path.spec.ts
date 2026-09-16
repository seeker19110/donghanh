import { expect, test, type Page } from '@playwright/test'
import { mockLogin } from './helpers/auth'

async function mockProgrammingProgress(page: Page) {
  await page.route('**/api/programming/progress', (route) =>
    route.request().method() === 'GET'
      ? route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ lessons: [] }),
        })
      : route.fulfill({ status: 200, body: '{}' }),
  )
}

test('lộ trình kiến trúc sư AI mở từ P1 và dùng URL chuẩn mới', async ({ page }, testInfo) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await mockProgrammingProgress(page)

  await page.goto('/lap-trinh/lo-trinh/principal-ai', { waitUntil: 'domcontentloaded' })

  await expect(page).toHaveURL(/\/lap-trinh\/lo-trinh\/principal-ai--kien-truc-su-phan-mem-ai$/)
  await expect(
    page.getByRole('heading', { name: 'Chặng nền tảng — bắt đầu từ số 0' }),
  ).toBeVisible()
  await expect(page.getByText('P1 · Nhập môn tư duy')).toBeVisible()
  await expect(page.getByText('P2 · Nền tảng vững')).toBeVisible()
  await expect(page.getByText('P3 · Làm được việc thật')).toBeVisible()
  await expect(page.getByText('P4 · Lập trình có cấu trúc lớn')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Học bậc này' })).toHaveCount(4)

  if (process.env.CAPTURE_PATH_JOURNEY === '1') {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(viewport)
      await page.screenshot({
        path: testInfo.outputPath(`ai-architect-${viewport.width}.png`),
        fullPage: true,
      })
    }
  }
})
