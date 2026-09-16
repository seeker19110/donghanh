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
  // Chỉ đếm POST: từ S11-3 trang CÓ đọc trạng thái hoàn thành bằng GET để đắp lên mục lục
  // (AC-15). Đọc không tạo ra bằng chứng; bất biến cần canh là không có lượt NỘP nào.
  let soLuotNop = 0
  await page.route(API, async (route) => {
    if (route.request().method() === 'POST') soLuotNop += 1
    await route.fulfill({ status: 500, body: '{}' })
  })

  await page.goto(BAI)
  await expect(khungCauHoi(page)).toBeVisible()
  await khungCauHoi(page).locator('> li').first().getByRole('button').first().click()
  await page.waitForTimeout(900) // quá debounce ghi nháp — nếu có gửi thì đã gửi rồi

  expect(soLuotNop).toBe(0)
  // Nút Nộp có tồn tại, vùng chạm đủ lớn, và đang khoá vì chưa trả lời hết.
  const nut = page.getByRole('button', { name: 'Nộp bài tự kiểm tra' })
  await expect(nut).toBeDisabled()
  expect((await nut.boundingBox())!.height).toBeGreaterThanOrEqual(44)
})

test('khách nộp bài: chấm ngay trên máy, nói rõ là kết quả cục bộ, không gọi server', async ({
  page,
}) => {
  let soLuotNop = 0
  await page.route(API, async (route) => {
    if (route.request().method() === 'POST') soLuotNop += 1
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
  expect(soLuotNop).toBe(0)

  const khoa = await page.evaluate(() => Object.keys(localStorage))
  expect(khoa.some((k) => k.startsWith('dhcb_evidence_'))).toBe(true)
})

// ——— [S11-3] Mục lục đọc bằng chứng; màn kết quả dùng chung ———

test('mục lục chỉ đổi trạng thái khi NỘP, không phải khi mở bài', async ({ page }) => {
  await page.goto(BAI)
  await expect(khungCauHoi(page)).toBeVisible()

  // AC-16: khách đã tải xong lớp trạng thái (đọc localStorage, đồng bộ) mà chưa nộp gì →
  // "Chưa học". Tuyệt đối KHÔNG phải "Đang học dở": mở trang không bao giờ là học.
  const la = page.getByRole('link', { name: /Sự rơi tự do/ })
  await expect(la).toHaveAccessibleName(/Chưa học/)

  await traLoiHet(page)
  await page.getByRole('button', { name: 'Nộp bài tự kiểm tra' }).click()
  await expect(page.getByRole('region', { name: 'Kết quả lượt nộp' })).toBeVisible()

  // AC-15: có bằng chứng thì hết "chưa đo được" và hết "chưa học" — bài đã có trạng thái thật.
  await expect(la).toHaveAccessibleName(/Đang học dở|Đã xong/)
})

test('màn kết quả mời làm lại và đi tiếp, không bỏ người học ở đó', async ({ page }) => {
  await page.goto(BAI)
  await expect(khungCauHoi(page)).toBeVisible()
  await traLoiHet(page)
  await page.getByRole('button', { name: 'Nộp bài tự kiểm tra' }).click()

  const ketQua = page.getByRole('region', { name: 'Kết quả lượt nộp' })
  await expect(ketQua).toBeVisible()
  await expect(ketQua.getByRole('link', { name: 'Bài tiếp theo' })).toBeVisible()

  // "Làm lại" dọn màn kết quả để lượt nộp sau sinh `attemptId` MỚI (không phải gửi lại lượt cũ).
  const lamLai = ketQua.getByRole('button', { name: 'Làm lại' })
  expect((await lamLai.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  await lamLai.click()
  await expect(ketQua).toBeHidden()
})
