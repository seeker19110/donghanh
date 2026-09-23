import { test, expect } from '@playwright/test'
import { mockLogin } from './helpers/auth'

test('xếp lớp: lỗi tải → thử lại ngay trong phiên → câu hỏi', async ({ page }) => {
  await page.route('**/api/**', (route) =>
    route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }),
  )
  await mockLogin(page, 'vi', 'blue-sky')
  let attempts = 0
  await page.route('**/data/dialogues.json', async (route) => {
    attempts += 1
    if (attempts === 1) await route.abort()
    else await route.continue()
  })
  await page.goto('/placement')
  await page.getByRole('button', { name: 'Bắt đầu', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Chưa tải được câu hỏi')
  await expect(page.getByText('Đang chuẩn bị câu hỏi…')).toHaveCount(0)
  await page.getByRole('button', { name: 'Thử lại', exact: true }).click()
  await expect(page.getByText(/Vòng 1\//)).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
  expect(attempts).toBe(2)
})
