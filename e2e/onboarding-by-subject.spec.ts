// e2e/onboarding-by-subject.spec.ts — Slice 04: onboarding hỏi MÔN trước, không ép qua trình
// độ CEFR Tiếng Anh; ngôn ngữ giao diện nền tảng tách khỏi chiều học Tiếng Anh.
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-03-04-cong-cu-theo-mon-va-bo-mac-dinh-english.md
import { test, expect, type Page } from '@playwright/test'
import { mockLogin } from './helpers/auth'

/**
 * Server thật: `POST /api/profile {action:'onboarding'}` lưu xong thì `GET /api/auth?action=me`
 * trả `onboarded: true`. Mock của `mockLogin` cố định `onboarded` nên phải mô phỏng lại chuyển
 * trạng thái đó — nếu không, `refresh()` sau khi lưu đọc lại `false` và guard đá về /onboarding
 * (đúng như trên production nếu server không lưu được).
 */
async function mockOnboardingSave(page: Page): Promise<void> {
  let onboarded = false
  const profile = (done: boolean) => ({
    id: 'e2e-user-0001',
    email: 'e2e@example.com',
    name: 'E2E User',
    plan: 'free',
    onboarded: done,
    userLevel: 'beginner',
    goal: 'daily',
    dailyMinutes: 10,
    ageGroup: 'nguoi_lon',
    isAdmin: false,
  })
  await page.route('**/api/profile**', async (route) => {
    if (route.request().method() === 'POST') onboarded = true
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(route.request().method() === 'POST' ? { ok: true } : profile(onboarded)),
    })
  })
  await page.route('**/api/auth?action=me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(profile(onboarded)),
    }),
  )
}

test('người mới chọn Toán: chỉ hỏi nhóm tuổi rồi vào thẳng trang môn Toán', async ({ page }) => {
  await mockLogin(page, 'vi', undefined, { onboarded: false })
  await mockOnboardingSave(page)
  await page.goto('/')
  await expect(page).toHaveURL(/\/onboarding$/)
  await expect(page.getByRole('heading', { name: 'Bạn muốn học gì?' })).toBeVisible()
  await page.getByRole('button', { name: /Toán học/ }).click()
  await expect(page.getByText('Bước 1 / 1')).toBeVisible()
  await expect(page.getByText('Trình độ')).toHaveCount(0)
  await page.getByRole('button', { name: /Bắt đầu học/ }).click()
  await expect(page).toHaveURL(/\/goc-hoc-tap\/mathematics/)
})

test('người mới chọn Tiếng Anh: đủ 4 bước như cũ, kết thúc ở trang môn Tiếng Anh', async ({
  page,
}) => {
  await mockLogin(page, 'vi', undefined, { onboarded: false })
  await mockOnboardingSave(page)
  await page.goto('/onboarding')
  await page.getByRole('button', { name: /Tiếng Anh/ }).click()
  await expect(page.getByText('Bước 1 / 4')).toBeVisible()
  await page.getByRole('button', { name: /Tiếp theo/ }).click()
  await expect(page.getByText('Bước 2 / 4')).toBeVisible()
})

test('ngôn ngữ giao diện nền tảng KHÔNG lấy từ chiều học: ui_lang=vi + chiều B → Pricing tiếng Việt', async ({
  page,
}) => {
  await mockLogin(page, 'vi')
  await page.addInitScript(() => localStorage.setItem('et_direction', 'B'))
  await page.goto('/nang-cap')
  await expect(page.getByRole('heading', { name: /Nâng cấp gói/ })).toBeVisible()
})

test('chưa đặt ui_lang mà đang học chiều B → giao diện tiếng Anh (không đổi trải nghiệm cũ)', async ({
  page,
}) => {
  await mockLogin(page, 'vi')
  await page.addInitScript(() => {
    localStorage.removeItem('ui_lang')
    localStorage.setItem('et_direction', 'B')
  })
  await page.goto('/nang-cap')
  await expect(page.getByRole('heading', { name: /Upgrade your plan/ })).toBeVisible()
})
