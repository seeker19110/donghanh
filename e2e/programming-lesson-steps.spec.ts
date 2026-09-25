// E2E: sáu bước bài Lập trình ↔ URL (S09d).
// Đặc tả: docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md §2.8 (B3) + §2.5.
//
// Vì sao cần E2E ngoài unit test: thứ dễ hỏng ở đây là phần LẮP RÁP với trình duyệt thật —
// history thật (Back/Forward), reload thật, chuyển hướng URL cũ/bare-id, CodeMirror thật giữ
// nháp, header dính che mất heading đích, và request tiến độ phát sinh thêm do nhảy bước.
import { test, expect, type Page } from '@playwright/test'
import { mockLogin } from './helpers/auth'

const PREFIX = '/goc-hoc-tap/programming/bai-hoc'
// Bài fixture của đặc tả: p1-u1-l1 (bốn ca chấm), p3-u10-l1 mở trong ngữ cảnh khoá `git`.
const BAI = `${PREFIX}/p1-u1-l1`
const BAI_KHOA = `${PREFIX}/p3-u10-l1?khoa=git`

// Trần số lần Tab khi đếm đường bàn phím tới lối tắt (desktop có sidebar + cây mục lục môn).
const MAX_TAB = 120

const SAU_DICH: ReadonlyArray<readonly [string, string]> = [
  ['concept', 'Khái niệm'],
  ['example', 'Ví dụ mẫu'],
  ['predict', 'Dự đoán'],
  ['parsons', 'Xếp code'],
  ['make', 'Tự viết'],
  ['done', 'Về nhà'],
]

/** Chặn API tiến độ (không có backend trong E2E) và ĐẾM số lần ghi (POST/PUT…). */
async function demGhiTienDo(page: Page): Promise<{ ghi: () => number }> {
  let ghi = 0
  await page.route('**/api/programming/progress**', (route) => {
    const method = route.request().method()
    if (method !== 'GET') ghi += 1
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        method === 'GET' ? { lessons: [] } : { ok: true, replayed: false, lessons: [] },
      ),
    })
  })
  return { ghi: () => ghi }
}

async function mo(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  // Dev server nạp lười chunk bài ở lần đầu — chờ rộng tay, không chờ cứng.
  await expect(page.locator('#dau-bai')).toBeAttached({ timeout: 30_000 })
}

/** Bước đang `aria-current="step"` — DOM chỉ được có đúng MỘT thanh bước. */
async function kiemBuoc(page: Page, nhan: string) {
  await expect(page.getByRole('navigation', { name: 'Các bước bài học' })).toHaveCount(1)
  const cur = page.locator('[aria-current="step"]')
  await expect(cur).toHaveCount(1)
  await expect(cur).toHaveAttribute('aria-label', new RegExp(nhan))
}

/** Heading đích đã nhận focus, nhìn thấy được và KHÔNG nằm dưới header dính. */
async function kiemDich(page: Page, id: string) {
  const dich = page.locator(`#${id}`)
  await expect(dich).toBeFocused()
  await expect(dich).toBeVisible()
  const hop = await dich.boundingBox()
  const header = await page.locator('header').first().boundingBox()
  expect(hop).not.toBeNull()
  if (hop && header) expect(hop.y).toBeGreaterThanOrEqual(header.y + header.height - 1)
}

function oCode(page: Page) {
  return page.getByRole('textbox', { name: /Ô (soạn code|gõ lệnh) bài tự viết/ })
}

test.describe('S09d — bước bài Lập trình ↔ URL', () => {
  test.beforeEach(async ({ page }) => {
    // Mỗi test mở bài nhiều lần (6 hash, reload, URL cũ) trên dev server — cần quá 30 giây.
    test.setTimeout(120_000)
    await mockLogin(page, 'vi', 'dark-blue')
  })

  test('S09-P-AC01: sáu hash mở đúng bước, focus đúng heading; reload giữ bước', async ({
    page,
  }) => {
    await demGhiTienDo(page)
    for (const [id, nhan] of SAU_DICH) {
      await mo(page, `${BAI}#${id}`)
      await kiemBuoc(page, nhan)
      await kiemDich(page, id)
    }
    // Reload trên #done: vẫn bước Về nhà (URL là nguồn quyết bước), và không nói "hoàn thành".
    await page.reload({ waitUntil: 'domcontentloaded' })
    await kiemBuoc(page, 'Về nhà')
    await expect(page.getByText('Bài học đã hoàn thành')).toHaveCount(0)
  })

  for (const vp of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    test(`S09-P-AC01: lối tắt "Kết quả chấm" tới #ket-qua trong 1 kích hoạt (bàn phím, ${vp.width}px)`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(vp)
      await demGhiTienDo(page)
      await mo(page, BAI)
      await kiemBuoc(page, 'Khái niệm')
      // Đếm số lần Tab từ đầu trang tới lối tắt (báo riêng, không tính là "kích hoạt").
      await page.locator('body').focus()
      let soTab = 0
      for (; soTab < MAX_TAB; soTab += 1) {
        const ten = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')
        if (ten === 'Kết quả chấm') break
        await page.keyboard.press('Tab')
      }
      expect(soTab).toBeLessThan(MAX_TAB)
      await page.keyboard.press('Enter') // kích hoạt thứ 1 — và là duy nhất
      await expect(page).toHaveURL(/#ket-qua$/)
      await kiemBuoc(page, 'Tự viết')
      await kiemDich(page, 'ket-qua')
      await expect(page.getByText('Chưa có kết quả chấm trong lần mở bài này')).toBeVisible()
      testInfo.annotations.push({
        type: 'kich-hoat',
        description: `${vp.width}px: ${soTab} Tab tới lối tắt, 1 kích hoạt tới #ket-qua`,
      })
      console.log(`[S09d] ${vp.width}px: ${soTab} Tab tới lối tắt, 1 kích hoạt tới #ket-qua`)
    })
  }

  test('S09-P-AC02/AC03: nháp giữ nguyên khi nhảy bước, Back/Forward và reload có hash', async ({
    page,
  }) => {
    await demGhiTienDo(page)
    await mo(page, `${BAI}#make`)
    const o = oCode(page)
    await o.click()
    await page.keyboard.press('Control+End')
    await page.keyboard.type('\n# nhap s09d')
    await expect(o).toContainText('# nhap s09d')

    await page.getByRole('button', { name: 'Dự đoán' }).click()
    await expect(page).toHaveURL(/#predict$/)
    await kiemDich(page, 'predict')
    await page.goBack()
    await kiemBuoc(page, 'Tự viết')
    await kiemDich(page, 'make')
    await expect(oCode(page)).toContainText('# nhap s09d')
    await page.goForward()
    await kiemBuoc(page, 'Dự đoán')

    // Chờ nháp ghi xuống storage (debounce 500 ms) rồi reload trên #predict: hash thắng resume.
    await expect
      .poll(() =>
        page.evaluate(() =>
          Object.keys(localStorage).some((k) => k.startsWith('dhcb_lsession_v1_')),
        ),
      )
      .toBe(true)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await kiemBuoc(page, 'Dự đoán')
    await page.getByRole('button', { name: 'Tự viết' }).click()
    await expect(oCode(page)).toContainText('# nhap s09d')
  })

  test('S09-P-AC04: hash lạ → Khái niệm + focus đầu bài (heading hiện ra), không crash', async ({
    page,
  }) => {
    const loi: string[] = []
    page.on('pageerror', (e) => loi.push(e.message))
    await demGhiTienDo(page)
    for (const hash of ['#khong-ton-tai', '#Make', '#%3Cimg%3E', '#cau-1']) {
      await mo(page, `${BAI}${hash}`)
      await kiemBuoc(page, 'Khái niệm')
      await kiemDich(page, 'dau-bai')
    }
    expect(loi).toEqual([])
  })

  test('S09-P-AC06: ?khoa= giữ qua nhảy bước, URL cũ và reload; Back về entry đầu', async ({
    page,
  }) => {
    await demGhiTienDo(page)
    // URL cũ `/lap-trinh/...` + bare id + hash: chuyển về URL chuẩn giữ cả query lẫn hash.
    await page.goto('/lap-trinh/bai-hoc/p3-u10-l1?khoa=git#parsons', {
      waitUntil: 'domcontentloaded',
    })
    await expect(page).toHaveURL(/\/p3-u10-l1--[a-z0-9-]+\?khoa=git#parsons$/)
    await kiemBuoc(page, 'Xếp code')
    await kiemDich(page, 'parsons')

    // Mở bình thường trong ngữ cảnh khoá, nhảy hai đích, Back hai lần về entry đầu.
    await mo(page, BAI_KHOA)
    await kiemBuoc(page, 'Khái niệm')
    await page.getByRole('button', { name: 'Ví dụ mẫu' }).click()
    await page.getByRole('link', { name: 'Kết quả chấm' }).click()
    await expect(page).toHaveURL(/\?khoa=git#ket-qua$/)
    await page.goBack()
    await expect(page).toHaveURL(/\?khoa=git#example$/)
    await kiemBuoc(page, 'Ví dụ mẫu')
    await page.goBack()
    await expect(page).toHaveURL(/\?khoa=git$/)
    await kiemBuoc(page, 'Khái niệm')
    await kiemDich(page, 'dau-bai')
  })

  test('S09-P-AC07: nhảy bước không phát sinh request ghi tiến độ, không tự chạy code', async ({
    page,
  }) => {
    const dem = await demGhiTienDo(page)
    await mo(page, BAI)
    await kiemBuoc(page, 'Khái niệm')
    // Mount có ghi `in_progress` (hành vi cũ, không đổi) — chờ nó xong rồi mới lấy mốc.
    await expect.poll(() => dem.ghi()).toBeGreaterThanOrEqual(1)
    await page.waitForTimeout(300)
    const moc = dem.ghi()

    for (const [, nhan] of SAU_DICH) {
      await page.getByRole('button', { name: nhan }).click()
      await kiemBuoc(page, nhan)
    }
    await page.getByRole('link', { name: 'Kết quả chấm' }).click()
    await page.goBack()
    await page.goForward()
    await kiemDich(page, 'ket-qua')
    await page.waitForTimeout(300)
    expect(dem.ghi()).toBe(moc)
    // Không có ví dụ nào tự chạy (nút chạy vẫn là trạng thái chưa chạy) và chưa có kết quả chấm.
    await expect(page.getByText('Chưa có kết quả chấm trong lần mở bài này')).toBeVisible()
  })
})
