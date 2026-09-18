// E2E: lịch hoạt động là MỘT điểm dừng Tab, đi lại bên trong bằng phím mũi tên.
//
// Bản trước cho mọi ô ngày `tabIndex={0}`. Đo thật: 182 trong 213 điểm dừng Tab của cả trang
// là ô lịch — người dùng bàn phím phải bấm Tab 182 lần để đi qua một thẻ số liệu. Test này
// canh cả hai vế: số điểm dừng KHÔNG phình lại, và phím mũi tên vẫn đi được từng ngày.
import { test, expect } from '@playwright/test'
import { mockLogin, USER_ID } from './helpers/auth'

test.beforeEach(async ({ page }) => {
  await mockLogin(page)
  await page.addInitScript((uid) => {
    const today = new Date()
    // Gieo hoạt động cho MỌI ngày, không phải cách quãng: bản trước gieo mỗi 3 ngày, nên ô
    // xa nhất có dữ liệu hay không phụ thuộc HÔM NAY là ngày nào — test đỏ vào một số ngày
    // và xanh vào những ngày khác. Test điều hướng thì không được phụ thuộc lịch thật.
    for (let i = 0; i < 190; i++) {
      const d = new Date(today.getTime() - i * 86400000)
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      localStorage.setItem(
        `et_usage_${uid}_${k}`,
        JSON.stringify({
          chatCount: 2,
          writingCount: 1,
          speakingCount: 0,
          sttCount: 0,
          learnCount: 5,
        }),
      )
    }
  }, USER_ID)
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto('/tien-do')
})

test('cả lưới lịch chỉ chiếm MỘT điểm dừng Tab', async ({ page }) => {
  const grid = page.getByRole('grid', { name: /Lịch hoạt động theo ngày/ })
  await expect(grid).toBeVisible()

  const cells = await grid.getByRole('gridcell').count()
  expect(cells, 'lịch desktop hiện 26 tuần').toBeGreaterThan(100)

  const focusable = await grid.locator('[role="gridcell"][tabindex="0"]').count()
  expect(focusable, `${cells} ô nhưng chỉ 1 ô được nhận Tab (roving tabindex)`).toBe(1)
})

test('phím mũi tên đi từng tuần, Home về ngày xa nhất, chi tiết đổi theo', async ({ page }) => {
  const detail = page.locator('[aria-live="polite"]').first()
  const grid = page.getByRole('grid', { name: /Lịch hoạt động theo ngày/ })

  // Mặc định chọn hôm nay — vào lưới là đứng ở ngày gần nhất, không phải ngày cách đây nửa năm.
  const first = await detail.innerText()

  await grid.locator('[role="gridcell"][tabindex="0"]').focus()
  await page.keyboard.press('ArrowLeft') // lùi trọn 1 tuần (lưới đổ theo cột)
  await expect(detail).not.toHaveText(first)

  await page.keyboard.press('Home')
  // Ô xa nhất trong dữ liệu gieo ở trên luôn có hoạt động ⇒ chi tiết phải liệt kê ra.
  await expect(detail).toContainText(/từ đã học|lượt chat/)

  await page.keyboard.press('End')
  await expect(detail).toHaveText(first)
})

for (const width of [320, 390]) {
  test(`${width}px: ô ngày và CTA đủ 44px, header thẳng cột, trang không tràn ngang`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.reload()

    const grid = page.getByRole('grid', { name: /Lịch hoạt động theo ngày/ })
    await expect(grid).toBeVisible()
    const firstCell = grid.getByRole('gridcell').first()
    const cellBox = await firstCell.boundingBox()
    expect(cellBox).not.toBeNull()
    expect(cellBox!.width).toBeGreaterThanOrEqual(44)
    expect(cellBox!.height).toBeGreaterThanOrEqual(44)

    const firstColumn = Number(
      (await firstCell.getAttribute('style'))?.match(/grid-column-start:\s*(\d+)/)?.[1] ?? 1,
    )
    const firstHeader = grid.locator(`xpath=preceding-sibling::div[1]/span[${firstColumn}]`)
    const headerBox = await firstHeader.boundingBox()
    expect(headerBox).not.toBeNull()
    expect(Math.abs(headerBox!.x - cellBox!.x), 'nhãn thứ phải thẳng cột với ô ngày').toBeLessThan(
      1,
    )

    if (width === 320) {
      const scroller = grid.locator('xpath=..')
      const scrollerBefore = await scroller.boundingBox()
      expect(scrollerBefore).not.toBeNull()
      expect(
        cellBox!.x < scrollerBefore!.x ||
          cellBox!.x + cellBox!.width > scrollerBefore!.x + scrollerBefore!.width,
        'ô đầu phải nằm ngoài vùng nhìn trước khi điều hướng để test scrollIntoView có ý nghĩa',
      ).toBe(true)

      await grid.locator('[role="gridcell"][tabindex="0"]').focus()
      await page.keyboard.press('Home')
      await expect(firstCell).toBeFocused()

      const focusedBox = await firstCell.boundingBox()
      const scrollerAfter = await scroller.boundingBox()
      const headerAfter = await firstHeader.boundingBox()
      expect(focusedBox).not.toBeNull()
      expect(scrollerAfter).not.toBeNull()
      expect(headerAfter).not.toBeNull()
      expect(focusedBox!.x).toBeGreaterThanOrEqual(scrollerAfter!.x)
      expect(focusedBox!.x + focusedBox!.width).toBeLessThanOrEqual(
        scrollerAfter!.x + scrollerAfter!.width,
      )
      expect(
        Math.abs(headerAfter!.x - focusedBox!.x),
        'nhãn thứ vẫn thẳng cột sau scroll',
      ).toBeLessThan(1)
    }

    const goalCta = page.getByRole('button', { name: /Đổi mục tiêu ở Hồ sơ/ })
    const goalBox = await goalCta.boundingBox()
    expect(goalBox).not.toBeNull()
    expect(goalBox!.width).toBeGreaterThanOrEqual(44)
    expect(goalBox!.height).toBeGreaterThanOrEqual(44)

    const documentWidth = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }))
    expect(documentWidth.scrollWidth, `trang /tien-do bị tràn ngang ở ${width}px`).toBe(
      documentWidth.innerWidth,
    )
  })
}
