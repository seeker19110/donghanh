// E2E [S08-3]: đáp án phần "Tự kiểm tra" của bài STEM sống qua reload — CÙNG thiết bị.
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s08-khung-phien-resume.md AC-16, AC-17.
//
// Vì sao cần E2E chứ unit test chưa đủ: thứ hỏng trước đây là phần LẮP RÁP — bài nạp lười, hook
// phiên đọc storage lúc mount, reload thật mới chứng minh được chữ quay lại đúng ô. Unit test
// dựng lại cây React, còn đây là trình duyệt thật tải lại trang thật.
//
// File tách riêng khỏi `learning-session-resume.spec.ts` (ca bài Lập trình, PR S08-2 #961) vì
// lúc PR này mở thì #961 CHƯA vào `main` — hai PR cùng THÊM một đường dẫn mới là xung đột
// add/add chắc chắn. Khi #961 đã vào `main`, gộp ba ca dưới đây vào file đó và xoá file này.
import { test, expect } from '@playwright/test'

const BAI = '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do'
const TIEN_TO_PHIEN = 'dhcb_lsession_v1_'

/** Khối câu hỏi của mục "Tự kiểm tra" — bám theo tiêu đề, không bám thứ tự `ul` trong trang. */
function khungCauHoi(page: import('@playwright/test').Page) {
  return page.locator('h2:has-text("Tự kiểm tra") + ul')
}

test('trả lời tự kiểm tra STEM rồi reload thì đáp án còn, kết quả được chấm lại', async ({
  page,
}) => {
  await page.goto(BAI)
  const khung = khungCauHoi(page)
  await expect(khung).toBeVisible()

  // Câu 1 là trắc nghiệm: bấm một lựa chọn = vừa chọn vừa chấm.
  const luaChon = khung.locator('> li').first().getByRole('button').first()
  const nhanLuaChon = (await luaChon.textContent())?.trim() ?? ''
  await luaChon.click()
  await expect(luaChon).toHaveAttribute('aria-pressed', 'true')
  // Có phán đúng/sai ngay tại chỗ (một trong hai, tuỳ lựa chọn có đúng không).
  await expect(khung.locator('> li').first().locator('[role="status"]')).toBeVisible()

  // Câu tự luận: gõ chữ nhưng KHÔNG bấm "Kiểm tra".
  const oTuLuan = page.locator('input[id^="tra-loi-"]').first()
  await oTuLuan.fill('20 m/s')

  // Chờ quá debounce 500 ms của hook để chắc chắn nháp đã xuống storage.
  await page.waitForTimeout(900)
  await page.reload()

  const khungMoi = khungCauHoi(page)
  await expect(khungMoi).toBeVisible()
  const luaChonMoi = khungMoi.locator('> li').first().getByRole('button', { name: nhanLuaChon })
  await expect(luaChonMoi).toHaveAttribute('aria-pressed', 'true')
  await expect(khungMoi.locator('> li').first().locator('[role="status"]')).toBeVisible()
  await expect(page.locator('input[id^="tra-loi-"]').first()).toHaveValue('20 m/s')
})

test('câu tự luận chưa bấm Kiểm tra thì sau reload vẫn CHƯA được chấm', async ({ page }) => {
  await page.goto(BAI)
  await expect(khungCauHoi(page)).toBeVisible()

  const oTuLuan = page.locator('input[id^="tra-loi-"]').first()
  await oTuLuan.fill('20 m/s')
  await page.waitForTimeout(900)
  await page.reload()

  await expect(page.locator('input[id^="tra-loi-"]').first()).toHaveValue('20 m/s')
  // Ô tự luận nằm ở câu 2 — khối của nó không được có phán đúng/sai nào.
  const khoiTuLuan = khungCauHoi(page).locator('> li').filter({ has: oTuLuan })
  await expect(khoiTuLuan.locator('[role="status"]')).toHaveCount(0)
})

test('bài STEM chỉ thêm ĐÚNG MỘT khoá phiên học, không sinh tiến độ', async ({ page }) => {
  await page.goto(BAI)
  await expect(khungCauHoi(page)).toBeVisible()
  const truoc = await page.evaluate(() => Object.keys(localStorage))

  await khungCauHoi(page).locator('> li').first().getByRole('button').first().click()
  await page.waitForTimeout(900)

  const sau = await page.evaluate(() => Object.keys(localStorage))
  const them = sau.filter((k) => !truoc.includes(k))
  expect(them).toHaveLength(1)
  expect(them[0]!.startsWith(TIEN_TO_PHIEN)).toBe(true)
})
