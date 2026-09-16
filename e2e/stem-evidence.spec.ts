// E2E [S11-2]: nộp bài tự kiểm tra STEM sinh BẰNG CHỨNG hoàn thành — và chỉ khi NỘP.
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md AC-9, AC-10, AC-13.
//
// Vì sao phải là E2E: bất biến đáng giá nhất của slice này là một điều KHÔNG XẢY RA — mở trang,
// đọc bài, bấm thử một lựa chọn rồi rời đi thì KHÔNG có bằng chứng hoàn thành nào được tạo.
// Chỉ trình duyệt thật mới đếm được số request thật rời khỏi trang.
import { test, expect } from '@playwright/test'

const BAI = '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do'
const API = '**/api/learning/evidence*'

function khungCauHoi(page: import('@playwright/test').Page) {
  return page.locator('h2:has-text("Tự kiểm tra") + ul')
}

/** Trả lời hết mọi câu: trắc nghiệm bấm lựa chọn đầu, tự luận gõ một chuỗi. */
async function traLoiHet(page: import('@playwright/test').Page) {
  const cauHoi = khungCauHoi(page).locator('> li')
  for (let i = 0; i < (await cauHoi.count()); i += 1) {
    const li = cauHoi.nth(i)
    const o = li.locator('input[id^="tra-loi-"]')
    if ((await o.count()) > 0) await o.fill('20 m/s')
    else await li.getByRole('button').first().click()
  }
}

test('mở bài và trả lời tại chỗ KHÔNG gửi bằng chứng nào', async ({ page }) => {
  let soRequest = 0
  await page.route(API, async (route) => {
    soRequest += 1
    await route.fulfill({ status: 500, body: '{}' })
  })

  await page.goto(BAI)
  await expect(khungCauHoi(page)).toBeVisible()
  await khungCauHoi(page).locator('> li').first().getByRole('button').first().click()
  await page.waitForTimeout(900) // quá debounce ghi nháp — nếu có gửi thì đã gửi rồi

  expect(soRequest).toBe(0)
  // Nút Nộp có tồn tại, vùng chạm đủ lớn, và đang khoá vì chưa trả lời hết.
  const nut = page.getByRole('button', { name: 'Nộp bài tự kiểm tra' })
  await expect(nut).toBeDisabled()
  expect((await nut.boundingBox())!.height).toBeGreaterThanOrEqual(44)
})

test('khách nộp bài: chấm ngay trên máy, nói rõ là kết quả cục bộ, không gọi server', async ({
  page,
}) => {
  let soRequest = 0
  await page.route(API, async (route) => {
    soRequest += 1
    await route.fulfill({ status: 200, body: '{}' })
  })

  await page.goto(BAI)
  await expect(khungCauHoi(page)).toBeVisible()
  await traLoiHet(page)

  const nut = page.getByRole('button', { name: 'Nộp bài tự kiểm tra' })
  await expect(nut).toBeEnabled()
  await nut.click()

  // Khách không có tài khoản để server ghi vào → chấm ở máy, và trang NÓI RA điều đó.
  await expect(page.getByText(/kết quả ghi trên máy này/)).toBeVisible()
  expect(soRequest).toBe(0)

  const khoa = await page.evaluate(() => Object.keys(localStorage))
  expect(khoa.some((k) => k.startsWith('dhcb_evidence_'))).toBe(true)
})
