// e2e/outline-stem.spec.ts — MỤC LỤC MÔN trong vùng học bốn môn STEM (S07-2).
//
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md (AC-9, AC-10, AC-11, AC-15).
//
// Điều quan trọng nhất ở đây là một điều KHÔNG được xảy ra: mở một bài STEM rồi quay lại mục
// lục, bài đó vẫn phải là "chưa đo được". STEM chưa có bằng chứng hoàn thành nào (bằng chứng
// là slice S11), và "đã mở trang" KHÔNG BAO GIỜ là "đã học xong".
import { test, expect, type Page } from '@playwright/test'
import { mockLogin } from './helpers/auth'

const BAI_LY = '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do'
const DANH_SACH_LY = '/goc-hoc-tap/physics/bai-hoc'

const mucLuc = (page: Page) => page.getByRole('navigation', { name: /^Mục lục/ })

test.describe('mục lục STEM — desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('trang bài có cột mục lục của đúng lớp, bài đang mở mang aria-current', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_LY, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1, name: 'Sự rơi tự do' })).toBeVisible()

    const nav = page.getByRole('navigation', { name: 'Mục lục môn học' }).first()
    await expect(nav).toBeVisible()
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1)
  })

  test('MỞ BÀI KHÔNG PHẢI LÀ HỌC XONG: bài vừa xem vẫn "chưa đo được"', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_LY, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1, name: 'Sự rơi tự do' })).toBeVisible()

    // Quay lại danh sách rồi vào lại — không có gì được đánh dấu hoàn thành.
    await page.goto(DANH_SACH_LY, { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Chưa đo được').first()).toBeAttached()
    await expect(page.getByText('Đã xong')).toHaveCount(0)
  })

  test('thu gọn sidebar thì mục lục vẫn hiện', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.addInitScript(() => localStorage.setItem('ui_sidebar_collapsed', '1'))
    await page.goto(BAI_LY, { waitUntil: 'domcontentloaded' })
    await expect(mucLuc(page).first().getByRole('link').first()).toBeVisible()
  })

  test('tìm KHÔNG DẤU ra đúng bài, kèm đường dẫn chương', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(DANH_SACH_LY, { waitUntil: 'domcontentloaded' })
    const o = mucLuc(page).first().getByRole('searchbox')
    await o.fill('roi tu do')
    await expect(page.getByRole('link', { name: /Sự rơi tự do/ }).first()).toBeVisible()
    await expect(page.getByText(/Vật lí · Lớp 10 › Chương/).first()).toBeVisible()
  })

  test('"Bài sau" đi theo cây của lớp đang học', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_LY, { waitUntil: 'domcontentloaded' })
    const sau = page.getByRole('link', { name: /^Bài sau:/ })
    await expect(sau).toBeVisible()
    const ten = (await sau.textContent())!.replace('Bài sau:', '').trim()
    await sau.click()
    await expect(page.getByRole('heading', { level: 1, name: ten })).toBeVisible()
  })
})

test.describe('mục lục STEM — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('nút "Mục lục môn học" mở panel; chọn bài thì panel đóng và tiêu điểm về tiêu đề', async ({
    page,
  }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_LY, { waitUntil: 'domcontentloaded' })
    await expect(mucLuc(page)).toHaveCount(0)

    const nut = page.getByRole('button', { name: 'Mục lục môn học' })
    expect((await nut.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    await nut.click()

    const panel = page.getByRole('dialog', { name: 'Mục lục môn học' })
    await expect(panel).toBeVisible()
    await panel
      .getByRole('link')
      .filter({ hasNot: page.locator('[aria-current]') })
      .first()
      .click()
    await expect(panel).toHaveCount(0)
    await expect(page.locator('h1')).toBeFocused()
  })
})

test.describe('mục lục STEM — 320px', () => {
  test.use({ viewport: { width: 320, height: 568 } })

  test('danh sách bài không sinh cuộn ngang', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(DANH_SACH_LY, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const tran = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(tran).toBeLessThanOrEqual(1)
  })
})
