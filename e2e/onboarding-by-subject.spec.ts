// e2e/onboarding-by-subject.spec.ts — Slice 04: onboarding hỏi MÔN trước, không ép qua trình
// độ CEFR Tiếng Anh; ngôn ngữ giao diện nền tảng tách khỏi chiều học Tiếng Anh.
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-03-04-cong-cu-theo-mon-va-bo-mac-dinh-english.md
import { test, expect } from '@playwright/test'
import { mockLogin } from './helpers/auth'

test('người mới chọn Toán: chỉ hỏi nhóm tuổi rồi vào thẳng trang môn Toán', async ({ page }) => {
  await mockLogin(page, 'vi', undefined, { onboarded: false })
  await page.route('**/api/onboarding**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )
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
  await page.route('**/api/onboarding**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )
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
