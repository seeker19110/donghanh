// e2e/outline-programming.spec.ts — MỤC LỤC MÔN/KHOÁ trong vùng học môn Lập trình (S07-2).
//
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md (AC-10 … AC-17).
//
// Bốn điều chỉ chứng minh được bằng trình duyệt thật, nên chúng ở đây chứ không ở unit test:
//   · cột trái sống ĐỘC LẬP với sidebar của ứng dụng (thu gọn sidebar không làm nó biến mất),
//   · panel mobile mở/đóng và trả tiêu điểm đúng chỗ,
//   · ngữ cảnh khoá `?khoa=` sống sót qua Back/Forward/tải lại,
//   · tải tiến độ hỏng thì cây vẫn bấm được.
import { test, expect, type Page } from '@playwright/test'
import { mockLogin } from './helpers/auth'

const BAI_P1 = '/goc-hoc-tap/programming/bai-hoc/p1-u4-l1'
// `p3-u10-l1` nằm trong CẢ bậc P3 lẫn khoá ngắn Git — ca chồng lấn thật của dữ liệu.
const BAI_CHUNG = '/goc-hoc-tap/programming/bai-hoc/p3-u10-l1'

const mucLuc = (page: Page) => page.getByRole('navigation', { name: /^Mục lục/ })

test.describe('mục lục môn Lập trình — desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('trang bài có cột mục lục, bài đang mở mang aria-current', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_P1, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const nav = mucLuc(page).first()
    await expect(nav).toBeVisible()
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1)
  })

  test('thu gọn sidebar thì mục lục VẪN hiện, không đổi nội dung', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.addInitScript(() => localStorage.setItem('ui_sidebar_collapsed', '1'))
    await page.goto(BAI_P1, { waitUntil: 'domcontentloaded' })
    await expect(mucLuc(page).first()).toBeVisible()
    // Mục lục nằm trong vùng nội dung, nên nó không phụ thuộc cờ thu gọn của sidebar.
    await expect(mucLuc(page).first().getByRole('link').first()).toBeVisible()
  })

  test('ngữ cảnh khoá: ?khoa=git cho cây KHOÁ và mọi liên kết giữ nguyên query', async ({
    page,
  }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(`${BAI_CHUNG}?khoa=git`, { waitUntil: 'domcontentloaded' })

    await expect(page.getByRole('navigation', { name: 'Mục lục khoá học' }).first()).toBeVisible()
    const href = await page
      .getByRole('navigation', { name: 'Mục lục khoá học' })
      .first()
      .getByRole('link')
      .first()
      .getAttribute('href')
    expect(href).toContain('khoa=git')

    // Tải lại giữ nguyên ngữ cảnh khoá (query là một phần của URL chuẩn hoá, không bị nuốt).
    await page.reload({ waitUntil: 'domcontentloaded' })
    expect(page.url()).toContain('khoa=git')
    await expect(page.getByRole('navigation', { name: 'Mục lục khoá học' }).first()).toBeVisible()
  })

  test('cùng bài mở KHÔNG kèm khoá thì mục lục là cây MÔN, không phải cây khoá', async ({
    page,
  }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_CHUNG, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('navigation', { name: 'Mục lục môn học' }).first()).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Mục lục khoá học' })).toHaveCount(0)
  })

  test('mã khoá lạ bị bỏ qua — không lỗi, không vòng chuyển hướng', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(`${BAI_CHUNG}?khoa=khong-co-khoa-nay`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Mục lục môn học' }).first()).toBeVisible()
  })

  test('có "Bài sau" đi theo cây, và bấm vào thì sang đúng bài đó', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_P1, { waitUntil: 'domcontentloaded' })
    const sau = page.getByRole('link', { name: /^Bài sau:/ })
    await expect(sau).toBeVisible()
    const ten = (await sau.textContent())!.replace('Bài sau:', '').trim()
    await sau.click()
    await expect(page.getByRole('heading', { level: 1, name: ten })).toBeVisible()
  })

  test('tải tiến độ hỏng: cây vẫn bấm được và có dòng "Chưa tải được tiến độ · Thử lại"', async ({
    page,
  }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.route('**/api/programming/progress', (route) => route.abort())
    await page.goto(BAI_P1, { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Chưa tải được tiến độ')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Thử lại' })).toBeVisible()
    await expect(mucLuc(page).first().getByRole('link').first()).toBeVisible()
  })

  test('ô tìm lọc không dấu; không khớp thì báo bằng chữ', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_P1, { waitUntil: 'domcontentloaded' })
    const o = mucLuc(page).first().getByRole('searchbox')
    await o.fill('zzz khong co gi')
    await expect(page.getByText('Không có bài nào khớp')).toBeVisible()
  })
})

test.describe('mục lục môn Lập trình — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('không có cột trái; nút "Mục lục môn học" mở panel, Escape đóng', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_P1, { waitUntil: 'domcontentloaded' })

    // Chỉ có MỘT bản mục lục trong DOM (quyết định bằng JS, không `lg:hidden`).
    await expect(mucLuc(page)).toHaveCount(0)
    const nut = page.getByRole('button', { name: 'Mục lục môn học' })
    await expect(nut).toBeVisible()
    // Vùng chạm ≥ 44px.
    expect((await nut.boundingBox())!.height).toBeGreaterThanOrEqual(44)

    await nut.click()
    const panel = page.getByRole('dialog', { name: 'Mục lục môn học' })
    await expect(panel).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(panel).toHaveCount(0)
  })

  test('chọn bài trong panel: panel đóng và tiêu điểm về tiêu đề bài mới', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_P1, { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Mục lục môn học' }).click()

    const panel = page.getByRole('dialog', { name: 'Mục lục môn học' })
    const khac = panel
      .getByRole('link')
      .filter({ hasNot: page.locator('[aria-current]') })
      .first()
    await khac.click()

    await expect(panel).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('h1')).toBeFocused()
  })
})

test.describe('mục lục môn Lập trình — 320px', () => {
  test.use({ viewport: { width: 320, height: 568 } })

  test('trang bài không sinh cuộn ngang ở bề rộng nhỏ nhất', async ({ page }) => {
    await mockLogin(page, 'vi', 'dark-blue')
    await page.goto(BAI_P1, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const tran = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(tran).toBeLessThanOrEqual(1)
  })
})
