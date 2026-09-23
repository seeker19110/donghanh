import { test, expect } from '@playwright/test'
import { mockLogin, USER_ID } from './helpers/auth'

const profile = {
  id: USER_ID,
  email: 'e2e@example.com',
  name: 'E2E User',
  plan: 'free',
  onboarded: false,
}

test('S02 onboarding: HTTP 500 giữ nhóm tuổi, retry cùng dữ liệu rồi mới điều hướng', async ({
  page,
}) => {
  await mockLogin(page, 'vi', undefined, { onboarded: false })
  const posted: unknown[] = []
  let saved = false
  await page.route('**/api/profile**', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fulfill({ json: profile })
      return
    }
    posted.push(route.request().postDataJSON())
    if (posted.length === 1) await route.fulfill({ status: 500, json: { error: 'unavailable' } })
    else {
      saved = true
      await route.fulfill({ json: { ok: true } })
    }
  })
  await page.route('**/api/auth?action=me', (route) =>
    route.fulfill({ json: { ...profile, onboarded: saved } }),
  )
  await page.goto('/onboarding')
  await page.getByRole('button', { name: /Toán học/ }).click()
  await page.getByRole('button', { name: /Thiếu niên/ }).click()
  await page.getByRole('button', { name: /Bắt đầu học/ }).click()
  await expect(page.getByRole('alert')).toContainText('Chưa xác nhận')
  await expect(page).toHaveURL(/\/onboarding$/)
  await expect(page.getByRole('button', { name: /Thiếu niên/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'Thử lưu lại' }).click()
  await expect(page).toHaveURL(/\/goc-hoc-tap\/mathematics/)
  expect(posted).toHaveLength(2)
  expect(posted[1]).toEqual(posted[0])
})

for (const readFailure of ['http', 'not-onboarded'] as const) {
  test(`S02 onboarding: đã lưu nhưng đọc phiên ${readFailure}, chỉ retry GET`, async ({ page }) => {
    await mockLogin(page, 'vi', undefined, { onboarded: false })
    let posts = 0,
      readsAfterSave = 0
    await page.route('**/api/profile**', async (route) => {
      if (route.request().method() === 'POST') posts++
      await route.fulfill({ json: route.request().method() === 'POST' ? { ok: true } : profile })
    })
    await page.route('**/api/auth?action=me', async (route) => {
      if (!posts) {
        await route.fulfill({ json: profile })
        return
      }
      readsAfterSave++
      if (readsAfterSave === 1 && readFailure === 'http')
        await route.fulfill({ status: 500, json: { error: 'unavailable' } })
      else await route.fulfill({ json: { ...profile, onboarded: readsAfterSave > 1 } })
    })
    await page.goto('/onboarding')
    await page.getByRole('button', { name: /Toán học/ }).click()
    await page.getByRole('button', { name: /Bắt đầu học/ }).click()
    await expect(page.getByRole('alert')).toContainText('Hồ sơ đã lưu')
    await expect(page).toHaveURL(/\/onboarding$/)
    await page.getByRole('button', { name: 'Thử đọc lại phiên' }).click()
    await expect(page).toHaveURL(/\/goc-hoc-tap\/mathematics/)
    expect(posts).toBe(1)
    expect(readsAfterSave).toBe(2)
  })
}

test('S02 placement: kết quả B1 còn sau lỗi lưu, retry mới về cài đặt', async ({ page }) => {
  await mockLogin(page, 'vi')
  await page.addInitScript(
    (uid) =>
      localStorage.setItem(
        `et_placement_${uid}`,
        JSON.stringify({ cefr: 'B1', appLevel: 'intermediate', lastAt: new Date().toISOString() }),
      ),
    USER_ID,
  )
  let posts = 0
  await page.route('**/api/profile**', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fulfill({ json: profile })
      return
    }
    posts++
    await route.fulfill({
      status: posts === 1 ? 500 : 200,
      json: posts === 1 ? { error: 'unavailable' } : { ok: true },
    })
  })
  await page.goto('/placement')
  await page.getByRole('button', { name: 'Dùng kết quả này' }).click()
  await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Kết quả vẫn còn')
  await expect(page.getByText(/B1 ·/)).toBeVisible()
  await page.getByRole('button', { name: 'Thử lưu lại' }).click()
  await expect(page).toHaveURL(/\/cai-dat$/)
  expect(posts).toBe(2)
})
