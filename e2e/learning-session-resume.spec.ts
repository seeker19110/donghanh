// E2E: phiên học sống qua RELOAD ở bài Lập trình (slice S08-2).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s08-khung-phien-resume.md (AC-11, AC-12, AC-14, AC-15).
//
// Vì sao phải là E2E chứ không chỉ unit test: thứ hỏng ở đây là phần LẮP RÁP — localStorage
// thật, một lần tải trang thật, CodeMirror thật. Unit test không thấy được ca "reload".
import { test, expect, type Page } from '@playwright/test'
import { mockLogin } from './helpers/auth'

// Bài mẫu P1-U4 (cùng bài mà e2e/programming-lesson.spec.ts dùng).
const BAI = '/lap-trinh/bai-hoc/p1-u4-l1'
// Bài KHÁC để kiểm "đổi bài không dính nháp bài cũ". P1-U4 chỉ có ĐÚNG MỘT bài (đếm thật:
// grep "id: 'p1-u4-l" = 1 dòng) nên bài thứ hai lấy ở unit kế tiếp.
const BAI_KHAC = '/lap-trinh/bai-hoc/p1-u5-l1'
const DAU_AN = '# dau an cua toi'

/** Ô soạn code của bước "Tự viết" (CodeMirror đặt aria-label lên vùng contenteditable). */
function oCode(page: Page) {
  return page.getByRole('textbox', { name: /Ô (soạn code|gõ lệnh) bài tự viết/ })
}

/** Sang bước "Tự viết" rồi gõ thêm một dòng vào ô code. */
async function goThemDong(page: Page, chu: string) {
  await page.getByRole('button', { name: 'Tự viết' }).click()
  const o = oCode(page)
  await expect(o).toBeVisible()
  await o.click()
  await page.keyboard.press('Control+End')
  await page.keyboard.type(`\n${chu}`)
  await expect(o).toContainText(chu)
  // Ghi có debounce 500 ms — chờ THEO TRẠNG THÁI (khoá đã nằm trong localStorage), không chờ cứng.
  await expect
    .poll(() =>
      page.evaluate(() => Object.keys(localStorage).some((k) => k.startsWith('dhcb_lsession_v1_'))),
    )
    .toBe(true)
}

test('Lập trình: reload giữa chừng thì về đúng bước "Tự viết" với đúng code đã gõ', async ({
  page,
}) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.goto(BAI, { waitUntil: 'domcontentloaded' })
  await goThemDong(page, DAU_AN)

  await page.reload({ waitUntil: 'domcontentloaded' })

  // Vẫn ở bước "Tự viết" (nút "Chấm bài" chỉ có ở bước này) và code còn nguyên.
  await expect(page.getByRole('button', { name: 'Chấm bài' })).toBeVisible()
  await expect(oCode(page)).toContainText(DAU_AN)
  // Nói thật rằng KẾT QUẢ CHẤM không được khôi phục.
  await expect(page.getByText('Đã khôi phục code bạn gõ')).toBeVisible()
  await expect(page.getByText('Đạt toàn bộ test!')).toHaveCount(0)
})

test('Lập trình: đổi bài không dính nháp bài cũ, quay lại thì nháp còn', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.goto(BAI, { waitUntil: 'domcontentloaded' })
  await goThemDong(page, DAU_AN)

  await page.goto(BAI_KHAC, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Tự viết' }).click()
  await expect(oCode(page)).toBeVisible()
  await expect(oCode(page)).not.toContainText(DAU_AN)

  await page.goto(BAI, { waitUntil: 'domcontentloaded' })
  await expect(oCode(page)).toContainText(DAU_AN)
})

test('Lập trình: khôi phục nháp KHÔNG ghi "hoàn thành" lên server', async ({ page }) => {
  const thanBai: string[] = []
  await page.route('**/api/programming/progress**', async (route) => {
    thanBai.push(route.request().postData() ?? '')
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    })
  })
  await mockLogin(page, 'vi', 'dark-blue')
  await page.goto(BAI, { waitUntil: 'domcontentloaded' })
  await goThemDong(page, DAU_AN)

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(oCode(page)).toContainText(DAU_AN)

  expect(thanBai.filter((b) => b.includes('completed'))).toHaveLength(0)
})

test('Lập trình: trình duyệt chặn lưu nháp → vẫn học được và có dòng báo thật', async ({
  page,
}) => {
  await mockLogin(page, 'vi', 'dark-blue')
  // Chế độ riêng tư của Safari: đọc được nhưng NÉM LỖI lúc ghi. Chỉ chặn đúng khoá của khung
  // phiên VÀ khoá dò (`__dhcb_lsession_probe__`) — chặn sạch mọi khoá thì hỏng luôn phần giả
  // đăng nhập của E2E, không còn đo được điều đang cần đo.
  await page.addInitScript(() => {
    const goc = Storage.prototype.setItem
    Storage.prototype.setItem = function (key: string, value: string) {
      if (key.includes('lsession')) throw new Error('storage bị chặn')
      return goc.call(this, key, value)
    }
  })
  await page.goto(BAI, { waitUntil: 'domcontentloaded' })

  await expect(page.getByText('Trình duyệt đang chặn lưu nháp')).toBeVisible()

  // Vẫn gõ code bình thường…
  await page.getByRole('button', { name: 'Tự viết' }).click()
  await oCode(page).click()
  await page.keyboard.press('Control+End')
  await page.keyboard.type(`\n${DAU_AN}`)
  await expect(oCode(page)).toContainText(DAU_AN)

  // …nhưng reload thì mất — ĐÚNG như đã báo trước, không hứa suông.
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Tự viết' }).click()
  await expect(oCode(page)).not.toContainText(DAU_AN)
})
