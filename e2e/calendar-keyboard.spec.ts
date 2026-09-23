// E2E: lịch hoạt động là MỘT điểm dừng Tab, đi lại bên trong bằng phím mũi tên.
//
// Bản trước cho mọi ô ngày `tabIndex={0}`. Đo thật: 182 trong 213 điểm dừng Tab của cả trang
// là ô lịch — người dùng bàn phím phải bấm Tab 182 lần để đi qua một thẻ số liệu. Test này
// canh cả hai vế: số điểm dừng KHÔNG phình lại, và phím mũi tên vẫn đi được từng ngày.
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockLogin, USER_ID, type ThemeName } from './helpers/auth'
import { freezeAnimations } from './helpers/axe'

async function openCalendar(page: import('@playwright/test').Page) {
  const toggle = page.locator('#dashboard-calendar-toggle')
  // Mặc định đã MỞ SẴN (2026-09-20, theo yêu cầu người dùng) — chỉ bấm khi đang đóng, để
  // hàm dùng được ở cả đầu test lẫn sau khi đã tự đóng/mở thủ công trong test.
  const expanded = await toggle.getAttribute('aria-expanded')
  if (expanded !== 'true') {
    await expect(toggle).toHaveAccessibleName(/Xem lịch hoạt động/)
    await toggle.click()
  }
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  return page.getByRole('grid', { name: /Lịch hoạt động theo ngày/ })
}

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
  const grid = await openCalendar(page)
  await expect(grid).toBeVisible()

  const cells = await grid.getByRole('gridcell').count()
  expect(cells, 'lịch desktop hiện 26 tuần').toBeGreaterThan(100)

  const focusable = await grid.locator('[role="gridcell"][tabindex="0"]').count()
  expect(focusable, `${cells} ô nhưng chỉ 1 ô được nhận Tab (roving tabindex)`).toBe(1)
})

test('phím mũi tên đi từng tuần, Home về ngày xa nhất, chi tiết đổi theo', async ({ page }) => {
  const grid = await openCalendar(page)
  const detail = grid.locator('xpath=ancestor::section[1]').locator('[aria-live="polite"]')

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
    // 35 ngày kết thúc vào Chủ nhật ⇒ range bắt đầu vào Thứ hai. Khóa mốc cho ca cuộn để
    // Home target luôn ở cột trái, không phụ thuộc thứ hiện tại của máy chạy CI.
    if (width === 320) await page.clock.setFixedTime(new Date('2026-09-20T05:00:00.000Z'))
    await page.reload()

    const grid = await openCalendar(page)
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
      await grid.locator('[role="gridcell"][tabindex="0"]').focus()
      // Chủ động đặt viewport nội bộ ở cuối range để ô đầu thật sự nằm ngoài tầm nhìn;
      // không dựa vào scroll restoration hay vị trí ngẫu nhiên sau khi mở disclosure.
      await scroller.evaluate((element) => {
        element.scrollLeft = element.scrollWidth
      })
      const scrollerBefore = await scroller.boundingBox()
      const hiddenFirstBox = await firstCell.boundingBox()
      expect(scrollerBefore).not.toBeNull()
      expect(hiddenFirstBox).not.toBeNull()
      expect(
        hiddenFirstBox!.x + hiddenFirstBox!.width <= scrollerBefore!.x,
        'ô Home phải khuất bên trái trước khi kiểm scrollIntoView',
      ).toBe(true)

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

test('calendar mở mặc định, giữ state/focus qua 1023→1024→1279→1280→390', async ({ page }) => {
  await page.setViewportSize({ width: 1023, height: 900 })
  await page.reload()
  const toggle = page.locator('#dashboard-calendar-toggle')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('grid', { name: /Lịch hoạt động theo ngày/ })).toBeVisible()

  let grid = await openCalendar(page)
  const latest = grid.locator('[role="gridcell"][tabindex="0"]')
  const latestDate = await latest.getAttribute('data-date')
  await latest.focus()

  for (const width of [1024, 1279, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    grid = page.getByRole('grid', { name: /Lịch hoạt động theo ngày/ })
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(grid.locator(`[data-date="${latestDate}"]`)).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(grid.locator(`[data-date="${latestDate}"]`)).toBeFocused()
  }

  const oldDate = await grid.getByRole('gridcell').first().getAttribute('data-date')
  await grid.getByRole('gridcell').first().click()
  await expect(grid.locator(`[data-date="${oldDate}"]`)).toBeFocused()

  await page.setViewportSize({ width: 390, height: 844 })
  grid = page.getByRole('grid', { name: /Lịch hoạt động theo ngày/ })
  const mobileFirst = grid.getByRole('gridcell').first()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(mobileFirst).toHaveAttribute('aria-selected', 'true')
  await expect(mobileFirst).toBeFocused()
  expect(await mobileFirst.getAttribute('data-date')).not.toBe(oldDate)
})

test('resize khi focus ngoài calendar không cướp focus', async ({ page }) => {
  const grid = await openCalendar(page)
  await grid.locator('[role="gridcell"][tabindex="0"]').focus()
  const goal = page.getByRole('button', { name: /Đổi mục tiêu ở Hồ sơ/ })
  await goal.focus()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(goal).toBeFocused()
})

test('ẩn calendar chuyển focus về toggle trước khi panel hidden', async ({ page }) => {
  const grid = await openCalendar(page)
  await grid.locator('[role="gridcell"][tabindex="0"]').focus()
  const toggle = page.locator('#dashboard-calendar-toggle')
  await expect(toggle).toHaveAccessibleName(/Ẩn lịch hoạt động/)
  await toggle.click()
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(grid).toBeHidden()
})

test('QuickActions dialog và focus trap sống qua resize', async ({ page }) => {
  const share = page.getByRole('button', { name: 'Chia sẻ tiến độ' })
  await share.click()
  const dialog = page.getByRole('dialog', { name: 'Chia sẻ tiến độ' })
  await expect(dialog).toBeVisible()
  const close = dialog.getByRole('button', { name: 'Đóng' })
  await close.focus()

  for (const width of [1023, 1024, 1279, 1280, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(dialog).toBeVisible()
    await expect(close).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(dialog.locator(':focus')).toHaveCount(1)
    await close.focus()
  }

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(share).toBeFocused()
})

for (const theme of ['dark-blue', 'blue-sky', 'kid'] as ThemeName[]) {
  test(`calendar mở đạt axe A/AA ở theme=${theme}`, async ({ page }) => {
    await page.evaluate((nextTheme) => localStorage.setItem('ui_theme', nextTheme), theme)
    await page.reload()
    await openCalendar(page)
    await freezeAnimations(page)
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(
      violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([])
  })
}
