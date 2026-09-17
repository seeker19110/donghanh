// E2E: phiên học sống qua RELOAD — CÙNG thiết bị, gộp CẢ BA môn dùng chung khung
// `LearningSession` (Lập trình · cấp CEFR môn Anh · STEM).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s08-khung-phien-resume.md
// (AC-11, AC-12, AC-14, AC-15 — Lập trình; AC-16, AC-17 — STEM; AC-18 — cấp CEFR).
//
// Vì sao phải là E2E chứ không chỉ unit test: thứ hỏng ở đây là phần LẮP RÁP — localStorage
// thật, một lần tải trang thật, CodeMirror thật/bài nạp lười thật. Unit test dựng lại cây
// React, còn đây là trình duyệt thật tải lại trang thật.
//
// Lịch sử gộp (2026-09-17, #NNNN): ca STEM từng ở file riêng `learning-session-resume-stem.spec.ts`
// (PR S08-3 #962) vì lúc đó PR Lập trình S08-2 #961 CHƯA vào `main` — hai PR cùng THÊM một
// đường dẫn mới là xung đột add/add chắc chắn. #961 đã vào `main` nên gộp về đây theo đúng
// ghi chú để lại trong file cũ, xoá file đó.
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

// ── Trang CẤP CEFR (AC-18) ──────────────────────────────────────────────────────────────
// Thứ được nhớ ở đây KHÔNG phải nội dung bài mà là VỊ TRÍ đang học: đang ở tab nào, đang mở
// hoạt động nào. Chỉ E2E mới thấy được — reload thật, localStorage thật, router thật.
const CAP = '/lo-trinh-hoc/a1'

/** Chờ khung phiên đã ghi xuống localStorage (debounce 500 ms) — chờ theo TRẠNG THÁI. */
async function choGhiPhien(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() =>
        Object.keys(localStorage).some(
          (k) => k.startsWith('dhcb_lsession_v1_') && k.includes('cefr-level'),
        ),
      ),
    )
    .toBe(true)
}

function nutTab(page: Page, ten: string) {
  return page.getByRole('button', { name: new RegExp(ten) }).first()
}

test('CEFR: đổi tab rồi reload (URL không có ?tab=) thì vẫn ở đúng tab', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(CAP, { waitUntil: 'domcontentloaded' })

  await nutTab(page, 'Hôm nay').click()
  await expect(nutTab(page, 'Hôm nay')).toHaveAttribute('aria-pressed', 'true')
  await choGhiPhien(page)

  await page.reload({ waitUntil: 'domcontentloaded' })

  await expect(nutTab(page, 'Hôm nay')).toHaveAttribute('aria-pressed', 'true')
  await expect(nutTab(page, 'Bài học')).toHaveAttribute('aria-pressed', 'false')
})

test('CEFR: URL thắng nháp — ?tab=quiz mở bài kiểm tra dù nháp ghi tab khác', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(CAP, { waitUntil: 'domcontentloaded' })
  await nutTab(page, 'Hôm nay').click()
  await choGhiPhien(page)

  await page.goto(`${CAP}?tab=quiz`, { waitUntil: 'domcontentloaded' })

  await expect(nutTab(page, 'Kiểm tra')).toHaveAttribute('aria-pressed', 'true')
  await expect(nutTab(page, 'Hôm nay')).toHaveAttribute('aria-pressed', 'false')
})

test('CEFR: đang mở một bài ngữ pháp, reload thì vẫn mở đúng bài đó', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(CAP, { waitUntil: 'domcontentloaded' })

  // Mở từ DANH SÁCH trong trang (đường này KHÔNG ghi URL) — đúng ca mà reload trước đây làm mất.
  await page
    .getByRole('button', { name: /^Bài 1\b/ })
    .first()
    .click()
  const tieuDe = page.getByRole('heading', { level: 3 }).first()
  const chu = (await tieuDe.textContent()) ?? ''
  expect(chu.length).toBeGreaterThan(0)
  await choGhiPhien(page)

  // Mở lại trang cấp TRẦN (không ngữ cảnh trên URL): chỉ nháp mới đưa được về đúng bài.
  await page.goto(CAP, { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('heading', { level: 3 }).first()).toHaveText(chu)
  await expect(page).toHaveURL(/hd=grammar/)
})

// ── Bài STEM (AC-16, AC-17) ─────────────────────────────────────────────────────────────
// Thứ được nhớ ở đây là đáp án phần "Tự kiểm tra" của bài STEM — bài nạp lười, hook phiên
// đọc storage lúc mount.
const BAI_STEM = '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do'
const TIEN_TO_PHIEN_STEM = 'dhcb_lsession_v1_'

/** Khối câu hỏi của mục "Tự kiểm tra" — bám theo tiêu đề, không bám thứ tự `ul` trong trang. */
function khungCauHoiStem(page: Page) {
  return page.locator('h2:has-text("Tự kiểm tra") + ul')
}

test('STEM: trả lời tự kiểm tra rồi reload thì đáp án còn, kết quả được chấm lại', async ({
  page,
}) => {
  await page.goto(BAI_STEM)
  const khung = khungCauHoiStem(page)
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

  const khungMoi = khungCauHoiStem(page)
  await expect(khungMoi).toBeVisible()
  const luaChonMoi = khungMoi.locator('> li').first().getByRole('button', { name: nhanLuaChon })
  await expect(luaChonMoi).toHaveAttribute('aria-pressed', 'true')
  await expect(khungMoi.locator('> li').first().locator('[role="status"]')).toBeVisible()
  await expect(page.locator('input[id^="tra-loi-"]').first()).toHaveValue('20 m/s')
})

test('STEM: câu tự luận chưa bấm Kiểm tra thì sau reload vẫn CHƯA được chấm', async ({ page }) => {
  await page.goto(BAI_STEM)
  await expect(khungCauHoiStem(page)).toBeVisible()

  const oTuLuan = page.locator('input[id^="tra-loi-"]').first()
  await oTuLuan.fill('20 m/s')
  await page.waitForTimeout(900)
  await page.reload()

  await expect(page.locator('input[id^="tra-loi-"]').first()).toHaveValue('20 m/s')
  // Ô tự luận nằm ở câu 2 — khối của nó không được có phán đúng/sai nào.
  const khoiTuLuan = khungCauHoiStem(page).locator('> li').filter({ has: oTuLuan })
  await expect(khoiTuLuan.locator('[role="status"]')).toHaveCount(0)
})

test('STEM: bài chỉ thêm ĐÚNG MỘT khoá phiên học, không sinh tiến độ', async ({ page }) => {
  await page.goto(BAI_STEM)
  await expect(khungCauHoiStem(page)).toBeVisible()
  const truoc = await page.evaluate(() => Object.keys(localStorage))

  await khungCauHoiStem(page).locator('> li').first().getByRole('button').first().click()
  await page.waitForTimeout(900)

  const sau = await page.evaluate(() => Object.keys(localStorage))
  const them = sau.filter((k) => !truoc.includes(k))
  expect(them).toHaveLength(1)
  expect(them[0]!.startsWith(TIEN_TO_PHIEN_STEM)).toBe(true)
})
