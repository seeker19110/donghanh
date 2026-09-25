// [S09b] Mục "Trong bài" của trang bài STEM trên trình duyệt thật.
//
// Contract §2.3 + AC01–AC03, AC07–AC08 (phần STEM) của
// docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md. Fixture = bốn bài id thật ở
// docs/research/2026-09-23-s09-b1-navigation-contract-audit.md + MỘT bài dài có hoạt ảnh
// (`ly10-c2-b10`, 4.469px ở 390px trước khi sửa) vì bốn bài mẫu ngắn không chứng minh "bài dài".
//
// Số lần kích hoạt được IN RA (`console.log('KICH_HOAT …')`) để changelog ghi số thật, và được
// khẳng định ≤ 2 — cuộn tay không được tính là đạt.
import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockLogin, USER_ID, type ThemeName } from './helpers/auth'
import { freezeAnimations, waitForStableDom } from './helpers/axe'

const BAI = [
  { path: '/goc-hoc-tap/mathematics/bai-hoc/toan10-c1-b1', h1: 'Mệnh đề', hoatAnh: false },
  { path: '/goc-hoc-tap/physics/bai-hoc/ly10-c1-b1', h1: 'Làm quen với Vật lí', hoatAnh: false },
  { path: '/goc-hoc-tap/chemistry/bai-hoc/hoa10-c1-b1', h1: 'Nhập môn Hoá học', hoatAnh: false },
  {
    path: '/goc-hoc-tap/biology/bai-hoc/sinh10-c1-b1',
    h1: 'Giới thiệu khái quát môn Sinh học',
    hoatAnh: false,
  },
  {
    path: '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do',
    h1: 'Sự rơi tự do',
    hoatAnh: true,
  },
] as const
const BAI_DAI = BAI[4].path

/**
 * GET trạng thái hoàn thành trả rỗng; POST (nộp) bị ĐẾM. Trả về hàm đọc số POST.
 * `traLoiNop` cho phép test nộp thật trả một kết quả chấm của server.
 */
async function giaLapEvidence(
  page: Page,
  traLoiNop?: (attemptId: string) => unknown,
): Promise<() => number> {
  let soPost = 0
  await page.route('**/api/learning/evidence*', async (route) => {
    const req = route.request()
    if (req.method() !== 'POST') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"state":[]}' })
    }
    soPost += 1
    const body = (req.postDataJSON() ?? {}) as { attemptId?: string }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(traLoiNop ? traLoiNop(body.attemptId ?? 'x') : {}),
    })
  })
  return () => soPost
}

async function moBai(page: Page, url: string) {
  await page.goto(url)
  await expect(page.locator('article h1')).toBeVisible()
}

/** Đích nằm trong khung nhìn và KHÔNG bị header dính che. */
async function khongBiCheBoiHeader(page: Page, id: string) {
  const dich = page.locator(`#${id}`)
  await expect(dich).toBeInViewport()
  const dayHeader = await page
    .locator('header')
    .first()
    .evaluate((el) => el.getBoundingClientRect().bottom)
  const dinh = await dich.evaluate((el) => el.getBoundingClientRect().top)
  expect(dinh).toBeGreaterThanOrEqual(dayHeader - 1)
}

/**
 * Từ đầu bài đi tới một mục bằng CHUỘT/CHẠM, đếm số lần kích hoạt.
 * Mobile: nút "Trong bài" (1) + chọn mục (2). Desktop: danh sách hiện sẵn, chọn mục (1).
 */
async function denMucBangChuot(page: Page, nhan: string, laMobile: boolean): Promise<number> {
  let kichHoat = 0
  if (laMobile) {
    await page.getByRole('button', { name: 'Trong bài', exact: true }).click()
    kichHoat += 1
  }
  await page
    .getByRole('navigation', { name: 'Trong bài' })
    .getByRole('link', { name: nhan, exact: true })
    .click()
  kichHoat += 1
  return kichHoat
}

for (const width of [390, 1440]) {
  const laMobile = width < 1024
  for (const bai of BAI) {
    test(`${bai.path.split('/').pop()} @${width}: URL có hash, hash sai, ≤2 kích hoạt`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await mockLogin(page, 'vi')
      const soPost = await giaLapEvidence(page)

      // URL trực tiếp kèm hash section → focus đúng heading, không bị header che.
      await moBai(page, `${bai.path}#tu-kiem`)
      await expect(page.locator('#tu-kiem')).toBeFocused()
      await khongBiCheBoiHeader(page, 'tu-kiem')

      // Hash sai / section tùy chọn vắng mặt → tiêu đề bài hiện tại.
      for (const hashSai of [
        '#khong-co-muc-nay',
        '#cau-999',
        bai.hoatAnh ? '#cau-0' : '#hoat-anh',
      ]) {
        await moBai(page, `${bai.path}${hashSai}`)
        await expect(page.locator('article h1')).toBeFocused()
        if (bai.h1) await expect(page.locator('article h1')).toContainText(bai.h1)
      }

      // Từ đầu bài (không hash) tới lý thuyết / tự kiểm / kết quả: ≤ 2 kích hoạt mỗi đích.
      for (const [nhan, id] of [
        ['Lý thuyết', 'ly-thuyet'],
        ['Tự kiểm tra', 'tu-kiem'],
        ['Kết quả', 'ket-qua'],
      ] as const) {
        await moBai(page, bai.path)
        const n = await denMucBangChuot(page, nhan, laMobile)
        console.log(`KICH_HOAT ${bai.path.split('/').pop()} ${width} ${id} ${n}`)
        expect(n).toBeLessThanOrEqual(2)
        await expect(page.locator(`#${id}`)).toBeFocused()
        await khongBiCheBoiHeader(page, id)
        await expect(page).toHaveURL(new RegExp(`${bai.path}#${id}$`))
      }
      // Heading #ket-qua luôn có, trước khi nộp không giả điểm.
      await expect(page.getByText('Chưa có kết quả lượt nộp trong lần mở bài này')).toBeVisible()
      expect(soPost()).toBe(0)
    })
  }

  test(`bàn phím @${width}: số Tab tới Trong bài và đích, Enter/Escape đúng chỗ`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await mockLogin(page, 'vi')
    await giaLapEvidence(page)
    await moBai(page, BAI_DAI)

    // Đếm Tab từ đầu trang (body) tới phần tử đầu của khối Trong bài.
    const dauKhoi = laMobile
      ? page.getByRole('button', { name: 'Trong bài', exact: true })
      : page.getByRole('navigation', { name: 'Trong bài' }).getByRole('link').first()
    let soTab = 0
    for (; soTab < 80; soTab += 1) {
      if (await dauKhoi.evaluate((el) => el === document.activeElement)) break
      await page.keyboard.press('Tab')
    }
    console.log(`TAB_TOI_TRONG_BAI ${width} ${soTab}`)
    await expect(dauKhoi).toBeFocused()

    if (laMobile) {
      // Enter mở; focus vào mục đầu. Escape đóng và TRẢ focus về nút mở.
      await page.keyboard.press('Enter')
      await expect(page.getByRole('navigation', { name: 'Trong bài' })).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.getByRole('navigation', { name: 'Trong bài' })).toHaveCount(0)
      await expect(dauKhoi).toBeFocused()
      // Space cũng mở được (nút thật).
      await page.keyboard.press('Space')
      await expect(page.getByRole('navigation', { name: 'Trong bài' })).toBeVisible()
    }
    // Tab trong danh sách tới "Kết quả" rồi Enter → focus nằm ở ĐÍCH, không bị trả về nút mở.
    const link = page
      .getByRole('navigation', { name: 'Trong bài' })
      .getByRole('link', { name: 'Kết quả', exact: true })
    let soTabTrongDs = 0
    for (; soTabTrongDs < 12; soTabTrongDs += 1) {
      if (await link.evaluate((el) => el === document.activeElement)) break
      await page.keyboard.press('Tab')
    }
    console.log(`TAB_TRONG_DS_TOI_KET_QUA ${width} ${soTabTrongDs}`)
    await page.keyboard.press('Enter')
    await expect(page.locator('#ket-qua')).toBeFocused()
    if (laMobile) await expect(page.getByRole('navigation', { name: 'Trong bài' })).toHaveCount(0)
  })

  test(`Back/Forward và history @${width}: đích khác +1 entry, cùng đích +0`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await mockLogin(page, 'vi')
    await giaLapEvidence(page)
    await moBai(page, `${BAI_DAI}?tu=kiem-thu`)
    const dai = () => page.evaluate(() => history.length)
    const goc = await dai()

    await denMucBangChuot(page, 'Lý thuyết', laMobile)
    expect(await dai()).toBe(goc + 1)
    await denMucBangChuot(page, 'Kết quả', laMobile)
    expect(await dai()).toBe(goc + 2)
    // Chọn lại CÙNG đích: vẫn focus đích, không thêm entry.
    await page.locator('#tu-kiem').focus()
    await denMucBangChuot(page, 'Kết quả', laMobile)
    await expect(page.locator('#ket-qua')).toBeFocused()
    expect(await dai()).toBe(goc + 2)
    await expect(page).toHaveURL(/\?tu=kiem-thu#ket-qua$/)

    await page.goBack()
    await expect(page.locator('#ly-thuyet')).toBeFocused()
    await page.goBack()
    await expect(page).toHaveURL(/\?tu=kiem-thu$/)
    await expect(page.locator('article h1')).toBeFocused()
    await page.goForward()
    await expect(page.locator('#ly-thuyet')).toBeFocused()
    expect(await dai()).toBe(goc + 2)
  })
}

test('nháp sống qua nhảy mục + Back + reload; nhảy mục không POST evidence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await mockLogin(page, 'vi')
  const soPost = await giaLapEvidence(page)
  await moBai(page, BAI_DAI)
  const lua = page.locator('#cau-1').locator('..').getByRole('button').first()
  await lua.click()
  await expect(lua).toHaveAttribute('aria-pressed', 'true')

  for (const nhan of ['Lý thuyết', 'Ví dụ mẫu', 'Kết quả', 'Thẻ ôn tập', 'Đầu bài']) {
    await denMucBangChuot(page, nhan, true)
  }
  await page.goBack()
  await expect(page.locator('#the-on')).toBeFocused()
  await expect(lua).toHaveAttribute('aria-pressed', 'true')

  await page.reload()
  await expect(page.locator('#the-on')).toBeFocused()
  await expect(lua).toHaveAttribute('aria-pressed', 'true')
  // Không có màn kết quả nào dựng lại từ nháp sau reload.
  await expect(page.getByText('Chưa có kết quả lượt nộp trong lần mở bài này')).toBeVisible()
  expect(soPost()).toBe(0)
})

test('từ tóm tắt kết quả tới câu sai ≤2 kích hoạt, focus đúng câu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await mockLogin(page, 'vi')
  const soPost = await giaLapEvidence(page, (attemptId) => ({
    schemaVersion: 1,
    subjectId: 'physics',
    contentId: 'ly10-c1-b1',
    activityKind: 'stem_lesson_check',
    attemptId,
    clientAt: '2026-09-24T00:00:00.000Z',
    ownerId: USER_ID,
    evidenceKind: 'server_graded',
    correct: 1,
    total: 2,
    ratio: 0.5,
    passed: false,
    serverAt: '2026-09-24T00:00:01.000Z',
    items: [
      { questionIndex: 0, correct: true, reason: 'CORRECT' },
      { questionIndex: 1, correct: false, reason: 'WRONG_CHOICE' },
    ],
  }))
  await moBai(page, BAI[1].path)
  for (const id of ['cau-1', 'cau-2']) {
    await page.locator(`#${id}`).locator('..').getByRole('button').first().click()
  }
  await page.getByRole('button', { name: 'Nộp bài tự kiểm tra' }).click()
  const tomTat = page.locator('section[aria-label="Kết quả lượt nộp"]')
  await expect(tomTat).toBeVisible()
  expect(soPost()).toBe(1)

  // Heading #ket-qua vẫn một, kết quả nằm ngay dưới nó.
  await expect(page.locator('#ket-qua')).toHaveCount(1)
  let kichHoat = 0
  await tomTat.getByRole('link', { name: 'Xem câu 2' }).click()
  kichHoat += 1
  console.log(`KICH_HOAT tom-tat->cau-sai 390 ${kichHoat}`)
  expect(kichHoat).toBeLessThanOrEqual(2)
  await expect(page.locator('#cau-2')).toBeFocused()
  await khongBiCheBoiHeader(page, 'cau-2')
  // Mục Trong bài đưa về Kết quả mà không nộp lại.
  await denMucBangChuot(page, 'Kết quả', true)
  await expect(page.locator('#ket-qua')).toBeFocused()
  await expect(tomTat).toBeVisible()
  expect(soPost()).toBe(1)
})

test('320px + giảm chuyển động: danh sách mở không tràn ngang, mục ≥44px, cuộn tức thì', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await mockLogin(page, 'vi')
  await giaLapEvidence(page)
  await moBai(page, BAI_DAI)
  await page.getByRole('button', { name: 'Trong bài', exact: true }).click()
  const ds = page.getByRole('navigation', { name: 'Trong bài' })
  const tran = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(tran).toBeLessThanOrEqual(0)
  const kichThuoc = await ds
    .locator('a, button')
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()))
  for (const r of kichThuoc) {
    expect(r.height).toBeGreaterThanOrEqual(44)
    expect(r.width).toBeGreaterThanOrEqual(44)
  }
  const nut = page.getByRole('button', { name: 'Trong bài', exact: true }).boundingBox()
  expect((await nut)!.height).toBeGreaterThanOrEqual(44)

  await ds.getByRole('link', { name: 'Thẻ ôn tập', exact: true }).click()
  // Focus và cuộn nằm trong CÙNG một effect đồng bộ. Đo vị trí trong đúng khung hình mà focus
  // vừa tới: cuộn mượt thì lúc này đích còn đang trôi ở dưới; cuộn tức thì thì đã nằm yên.
  await expect(page.locator('#the-on')).toBeFocused()
  const dinh = await page.locator('#the-on').evaluate((el) => el.getBoundingClientRect().top)
  expect(dinh).toBeGreaterThanOrEqual(0)
  expect(dinh).toBeLessThan(700)
  await khongBiCheBoiHeader(page, 'the-on')
})

// Cổng a11y chung (e2e/a11y*.spec.ts) quét trang ở 1280px — tức dáng DESKTOP, danh sách luôn
// hiện. Dáng MOBILE với danh sách ĐANG MỞ chỉ tồn tại sau một cú bấm nên phải quét riêng.
for (const theme of ['blue-sky', 'dark-blue', 'kid'] as ThemeName[]) {
  test(`a11y A/AA: danh sách Trong bài đang mở ở 390px theme=${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await mockLogin(page, 'vi', theme)
    await giaLapEvidence(page)
    await moBai(page, BAI_DAI)
    await page.getByRole('button', { name: 'Trong bài', exact: true }).click()
    await expect(page.getByRole('navigation', { name: 'Trong bài' })).toBeVisible()
    await waitForStableDom(page)
    await freezeAnimations(page)
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(violations.map((v) => `${v.id}: ${v.nodes[0]?.target.join(' ')}`)).toEqual([])
  })
}
