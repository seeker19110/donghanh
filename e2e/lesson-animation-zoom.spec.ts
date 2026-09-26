// E2E: nút "Xem lớn" của hoạt ảnh bài học (2026-09-25).
//
// Vì sao cần E2E ngoài unit test: unit test giả lập ResizeObserver và <dialog>. Thứ dễ hỏng thật
// nằm ở trình duyệt: bề rộng svg thật trên trang, showModal() thật (inert, Esc, trả tiêu điểm),
// và phép xoay 90° có thật sự làm chữ to lên trên màn hình không.
//
// Bài đo: `sinh10-c2-b5` là hoạt ảnh tệ nhất khi đo (khung 716 × 118, chữ cỡ 12). Ở màn 390px, chữ
// hiện ra 6px.
import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockLogin } from './helpers/auth'

const BAI = '/goc-hoc-tap/biology/bai-hoc/sinh10-c2-b5'
const NGUONG_PX = 10

async function moBai(page: Page) {
  await mockLogin(page, 'vi', 'blue-sky')
  await page.goto(BAI, { waitUntil: 'domcontentloaded' })
  // Bài và hoạt ảnh nạp lười — dev server biên dịch lần đầu chậm (TRAPS.md mục 7).
  await expect(page.locator('figure svg[role="img"]').first()).toBeVisible({ timeout: 30_000 })
}

/** Cỡ chữ THẬT (px) của nhãn nhỏ nhất trong một thẻ svg, tính theo bề rộng hiển thị của nó. */
async function chuNhoNhatPx(page: Page, svgSelector: string): Promise<number> {
  return page.locator(svgSelector).evaluate((el) => {
    const svg = el as SVGSVGElement
    // Khi bị xoay, bounding box đổi chiều — lấy bề rộng CSS đã đặt nếu có, không thì bề rộng hộp.
    const rong = parseFloat(svg.style.width) || svg.getBoundingClientRect().width
    const tiLe = rong / svg.viewBox.baseVal.width
    const coChu = [...svg.querySelectorAll('text')].map((t) =>
      parseFloat(t.getAttribute('font-size') ?? '14'),
    )
    return Math.min(...coChu) * tiLe
  })
}

test.describe('Hoạt ảnh — nút "Xem lớn"', () => {
  test('điện thoại dựng đứng: có nút, mở ra chữ ≥ 10px, Esc đóng và trả tiêu điểm', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await moBai(page)
    const truoc = await chuNhoNhatPx(page, 'figure svg[role="img"]')
    expect(
      truoc,
      'chữ trong bài vốn nhỏ hơn ngưỡng — nếu không, ca này không kiểm được gì',
    ).toBeLessThan(NGUONG_PX)

    const nut = page.getByRole('button', { name: 'Xem lớn' })
    await expect(nut).toBeVisible()
    await nut.click()

    // Hộp thoại mang tên của chính hoạt ảnh (aria-label của hình trong bài), không phải tên bài.
    const tenHinh = await page.locator('figure svg[role="img"]').first().getAttribute('aria-label')
    expect(tenHinh).toBeTruthy()
    const dialog = page.getByRole('dialog', { name: tenHinh! })
    await expect(dialog).toBeVisible()
    await expect(page.getByRole('button', { name: 'Đóng' })).toBeFocused()
    await expect(
      dialog.getByText('Xoay ngang điện thoại để đọc hình theo đúng chiều.'),
    ).toBeVisible()
    expect(await chuNhoNhatPx(page, 'dialog svg')).toBeGreaterThanOrEqual(NGUONG_PX)

    // Hình xoay phải nằm gọn trong màn hình, không tràn ra ngoài.
    const hop = await page.locator('dialog svg').boundingBox()
    expect(hop).not.toBeNull()
    expect(hop!.x).toBeGreaterThanOrEqual(0)
    expect(hop!.x + hop!.width).toBeLessThanOrEqual(390 + 0.5)

    // Không vi phạm A/AA khi hộp thoại đang mở.
    const axe = await new AxeBuilder({ page }).include('dialog').analyze()
    expect(axe.violations.map((v) => v.id)).toEqual([])

    await page.keyboard.press('Escape')
    await expect(page.locator('dialog')).toHaveCount(0)
    await expect(nut).toBeFocused()
  })

  test('xoay máy khi hộp thoại đang mở: hình thôi xoay, chữ vẫn ≥ 10px', async ({ page }) => {
    // Màn ngang 844px đủ rộng để chữ trong bài ≥ 10px nên nút không hiện ở đó. Ca thật là
    // người học mở "Xem lớn" lúc cầm dọc rồi xoay máy: khung phải tự tính lại, bỏ phép xoay.
    await page.setViewportSize({ width: 390, height: 844 })
    await moBai(page)
    await page.getByRole('button', { name: 'Xem lớn' }).click()
    const svg = page.locator('dialog svg')
    await expect(svg).toBeVisible()
    expect(await svg.evaluate((el) => (el as SVGSVGElement).style.transform)).toContain(
      'rotate(90deg)',
    )

    await page.setViewportSize({ width: 844, height: 390 })
    await expect
      .poll(() => svg.evaluate((el) => (el as SVGSVGElement).style.transform))
      .not.toContain('rotate')
    expect(await chuNhoNhatPx(page, 'dialog svg')).toBeGreaterThanOrEqual(NGUONG_PX)
    await expect(page.getByText('Xoay ngang điện thoại để đọc hình theo đúng chiều.')).toHaveCount(
      0,
    )
  })

  test('desktop 1440px: chữ đã đủ lớn nên KHÔNG có nút', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await moBai(page)
    expect(await chuNhoNhatPx(page, 'figure svg[role="img"]')).toBeGreaterThanOrEqual(NGUONG_PX)
    await expect(page.getByRole('button', { name: 'Xem lớn' })).toHaveCount(0)
  })
})
