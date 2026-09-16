// e2e/outline-english.spec.ts — MỤC LỤC CẤP CEFR của môn Tiếng Anh (S07-3, AC-20).
//
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md.
//
// Điểm khác hai môn kia: ba hoạt động của một unit (từ vựng · ngữ pháp · hội thoại) là màn
// CON của chính trang cấp, không phải route riêng. Nên mục lục trỏ tới `?unit=&hd=` và trang
// tự mở đúng màn — nhờ vậy liên kết vẫn là liên kết THẬT (mở tab mới, Back/Forward đúng).
// Test canh cả chiều ngược: đóng màn con thì query phải biến mất, nếu không lần render sau
// lại mở đúng màn vừa đóng.
import { test, expect, type Page } from '@playwright/test'
import { mockLogin } from './helpers/auth'

const CAP_A1 = '/lo-trinh-hoc/a1'
const TEN = 'Mục lục cấp học'

const mucLuc = (page: Page) => page.getByRole('navigation', { name: TEN })

/** Trang cấp nạp `cefr.json` + bộ vòng từ vựng rồi mới vẽ — chờ tiêu đề cấp hiện. */
async function moTrangCap(page: Page, url = CAP_A1) {
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 60_000 })
}

test.describe('mục lục cấp CEFR — desktop', () => {
  test.use({ viewport: { width: 1440, height: 1000 } })

  test('mở màn con thì cột trái là CÂY mục lục, đúng một mục "đang mở"', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await moTrangCap(page)
    await page
      .getByRole('button', { name: /Học tiếp/ })
      .first()
      .click()

    const nav = mucLuc(page).first()
    await expect(nav).toBeVisible()
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1)
    // Cây, không phải danh sách phẳng: có nút mở/thu chương.
    await expect(nav.getByRole('button', { expanded: false }).first()).toBeVisible()
  })

  test('bấm một hoạt động trong mục lục → URL mang ngữ cảnh, đúng màn con mở ra', async ({
    page,
  }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await moTrangCap(page)
    await page
      .getByRole('button', { name: /Học tiếp/ })
      .first()
      .click()

    const nav = mucLuc(page).first()
    const nguPhap = nav.getByRole('link', { name: /^Ngữ pháp: Động từ "to be"/ }).first()
    await nguPhap.click()

    await expect(page).toHaveURL(/\?unit=[^&]+&hd=grammar%3A/)
    await expect(page.getByRole('button', { name: 'Đã học xong bài này' })).toBeVisible()
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1)
  })

  test('mở thẳng bằng URL (link chia sẻ) rồi đóng thì query biến mất', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await moTrangCap(page)
    await page
      .getByRole('button', { name: /Học tiếp/ })
      .first()
      .click()
    const url = (await mucLuc(page)
      .first()
      .getByRole('link', { name: /^Ngữ pháp:/ })
      .first()
      .getAttribute('href'))!

    // Tải lại từ đầu bằng chính URL đó — giống người khác bấm link được chia sẻ.
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('button', { name: 'Đã học xong bài này' })).toBeVisible({
      timeout: 60_000,
    })

    // Đóng màn con → ngữ cảnh rời khỏi URL, nếu không lần render sau lại mở đúng màn vừa đóng.
    await page
      .getByRole('button', { name: /^Quay lại/ })
      .first()
      .click()
    await expect(page).toHaveURL(new RegExp(`${CAP_A1}$`))
    await expect(page.getByRole('button', { name: 'Đã học xong bài này' })).toHaveCount(0)
  })

  test('nút Back của trình duyệt đóng màn con vừa mở từ mục lục', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await moTrangCap(page)
    await page
      .getByRole('button', { name: /Học tiếp/ })
      .first()
      .click()
    await mucLuc(page)
      .first()
      .getByRole('link', { name: /^Ngữ pháp:/ })
      .first()
      .click()
    await expect(page.getByRole('button', { name: 'Đã học xong bài này' })).toBeVisible()

    await page.goBack()
    await expect(page).toHaveURL(new RegExp(`${CAP_A1}$`))
    await expect(page.getByRole('button', { name: 'Đã học xong bài này' })).toHaveCount(0)
  })

  test('cấp còn khoá: không có mục lục, nói rõ lý do của server', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await moTrangCap(page, '/lo-trinh-hoc/c1')
    await expect(page.getByText(/Cấp C1 đang bị khóa/).first()).toBeVisible()
    await expect(mucLuc(page)).toHaveCount(0)
  })
})

test.describe('mục lục cấp CEFR — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('nút "Mục lục cấp học" mở panel, chọn xong panel đóng và tiêu điểm không rơi về body', async ({
    page,
  }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await moTrangCap(page)
    // Không có cột trái ở mobile — đúng MỘT bản mục lục trong DOM.
    await expect(mucLuc(page)).toHaveCount(0)

    await page
      .getByRole('button', { name: /Học tiếp/ })
      .first()
      .click()
    const nut = page.getByRole('button', { name: TEN })
    await nut.click()

    const panel = page.getByRole('dialog')
    await expect(panel).toBeVisible()
    await panel.getByRole('searchbox').fill('hoi thoai')
    const ketQua = panel.getByRole('link').first()
    await ketQua.click()

    await expect(panel).toBeHidden()
    const theTieuDiem = await page.evaluate(() => document.activeElement?.tagName ?? '')
    expect(theTieuDiem).not.toBe('BODY')
  })

  test('Escape đóng panel, không rời trang', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await moTrangCap(page)
    await page
      .getByRole('button', { name: /Học tiếp/ })
      .first()
      .click()
    await page.getByRole('button', { name: TEN }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page).toHaveURL(new RegExp(`${CAP_A1}$`))
  })
})
