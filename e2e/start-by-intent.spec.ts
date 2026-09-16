// e2e/start-by-intent.spec.ts — Luồng "Bắt đầu theo ý định" (/bat-dau) trên TRÌNH DUYỆT THẬT.
// Đặc tả: docs/specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md (AC-3, AC-4, AC-6, AC-11,
// bất biến T7).
//
// Trang này CÔNG KHAI: mọi ca dưới đây chạy với KHÁCH (không mockLogin) — đúng cảnh người bấm CTA
// "Bắt đầu" từ hub.

import { test, expect, type Page } from '@playwright/test'

/** 12 mẫu cấm của §③.5 — kiểm trên chữ THẬT của DOM. */
const MAU_CAM: RegExp[] = [
  /\d+\s*\/\s*100/,
  /\d+\s*%/,
  /điểm số|chấm điểm/i,
  /bạn (đang ở )?mức|trình độ của bạn/i,
  /bạn (thiếu|yếu|kém|chưa đạt)/i,
  /so với (người|bạn bè|những người) (cùng|khác)/i,
  /xếp hạng|thứ hạng/i,
  /đáng lẽ|lẽ ra/i,
  /tuổi này (mà|bạn phải|phải)/i,
  /hồ sơ (năng lực|của bạn)|năng lực của bạn|chẩn đoán|phân tích cho thấy/i,
  /lv_new|lv_some|lv_solid|thi_cu|cong_viec|so_thich|chua_ro/i,
  /bạn (đang )?ở (bậc|cấp|mức|trình độ)|cấp độ của bạn|top \d+/i,
]

/** Đếm mọi request tới API trả phí / API riêng của tài khoản. */
function demRequestCam(page: Page): { list: string[] } {
  const box = { list: [] as string[] }
  page.on('request', (req) => {
    const url = req.url()
    if (/\/api\/(agent|companion|stt|tts|intake|learner-intent)/.test(url)) box.list.push(url)
  })
  return box
}

async function toiManGoiY(page: Page) {
  await expect(page.getByRole('button', { name: 'Vì thích' })).toBeVisible()
  await page.getByRole('button', { name: 'Vì thích' }).click()
  await page.getByRole('button', { name: '10 phút' }).click()
  await page.getByRole('button', { name: 'Mới bắt đầu' }).click()
  await expect(page.getByText('Mình gợi ý bắt đầu từ đây nhé?')).toBeVisible()
}

test('khách mở được /bat-dau (không cần đăng nhập) và không bị mặc định tiếng Anh', async ({
  page,
}) => {
  await page.goto('/bat-dau', { waitUntil: 'domcontentloaded' })
  await expect(page.getByText('Bạn muốn học môn gì?')).toBeVisible()
  const daChon = page.locator('[aria-pressed="true"]')
  await expect(daChon).toHaveCount(0)
})

test('khách BỎ HẾT → vẫn có đúng một nút "Bắt đầu" dẫn về danh mục môn', async ({ page }) => {
  await page.goto('/bat-dau', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Bỏ qua' }).click()
  await expect(page.getByText('Mình gợi ý bắt đầu từ đây nhé?')).toBeVisible()
  await page.getByRole('button', { name: 'Bắt đầu' }).click()
  await expect(page).toHaveURL(/\/goc-hoc-tap$/)
})

test('?mon=programming tiền điền đúng môn Lập trình, các ô khác không', async ({ page }) => {
  await page.goto('/bat-dau?mon=programming', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('[aria-pressed="true"]')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Lập trình' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByRole('button', { name: 'Tiếng Anh' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
})

test('một bấm từ màn gợi ý là vào màn học, Back quay lại KHÔNG hỏi lại 5 câu', async ({ page }) => {
  await page.goto('/bat-dau?mon=programming', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Tiếp' }).click()
  await toiManGoiY(page)

  await page.getByRole('button', { name: 'Bắt đầu' }).click()
  await expect(page).not.toHaveURL(/\/bat-dau/)

  await page.goBack()
  await expect(page.getByText('Mình gợi ý bắt đầu từ đây nhé?')).toBeVisible()
  await expect(page.getByText('Bạn muốn học môn gì?')).toHaveCount(0)
})

test('chọn hai môn: việc chính là môn chọn TRƯỚC, môn kia thành lựa chọn phụ', async ({ page }) => {
  await page.goto('/bat-dau', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Lập trình' }).click()
  await page.getByRole('button', { name: 'Toán học' }).click()
  await page.getByRole('button', { name: 'Tiếp' }).click()
  await page.getByRole('button', { name: 'Vì thích' }).click()
  await page.getByRole('button', { name: '10 phút' }).click()
  await page.getByRole('button', { name: 'Mới bắt đầu' }).click()
  await page.getByRole('button', { name: 'Lớp 10' }).click()
  await expect(page.getByText('Mình gợi ý bắt đầu từ đây nhé?')).toBeVisible()
  await expect(page.getByText('Hoặc bắt đầu với môn khác:')).toBeVisible()
})

test('T7 — màn gợi ý không khớp bất kỳ mẫu cấm nào (DOM thật)', async ({ page }) => {
  await page.goto('/bat-dau?mon=programming', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Tiếp' }).click()
  await toiManGoiY(page)

  const text = await page.locator('body').innerText()
  for (const re of MAU_CAM) expect(text, `khớp mẫu cấm ${re}`).not.toMatch(re)
})

test('AC-11 — suốt luồng không gọi API trả phí, khách không gọi /api/learner-intent', async ({
  page,
}) => {
  const cam = demRequestCam(page)
  await page.goto('/bat-dau?mon=programming', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Tiếp' }).click()
  await toiManGoiY(page)
  await page.getByRole('button', { name: 'Bắt đầu' }).click()
  await page.waitForLoadState('domcontentloaded')
  expect(cam.list).toEqual([])
})

test('đã trả lời rồi thì mở lại KHÔNG bị hỏi lại; "Đổi ý định" mở lại 5 câu', async ({ page }) => {
  await page.goto('/bat-dau?mon=programming', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Tiếp' }).click()
  await toiManGoiY(page)

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.getByText('Mình gợi ý bắt đầu từ đây nhé?')).toBeVisible()
  await expect(page.getByText('Bạn muốn học môn gì?')).toHaveCount(0)

  await page.getByRole('button', { name: 'Đổi ý định' }).click()
  await expect(page.getByText('Bạn muốn học môn gì?')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Lập trình' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})
