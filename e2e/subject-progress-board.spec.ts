// Cổng E2E cho khối "Tiến độ theo môn" ở /tien-do (S12-3, AC-14/AC-17).
//
// VÌ SAO PHẢI LÀ E2E, KHÔNG PHẢI UNIT: ba đợt thiết kế lại desktop trước (PR #861/#862/#863)
// tìm ra BỐN lỗi lặp nội dung mà không cổng nào bắt được — jsdom không có bố cục, `toBeVisible()`
// vẫn đúng khi một khối bị khối khác đè lên. Cổng dưới đây so quan hệ HÌNH HỌC thật giữa hai
// khối và đếm số lần tiêu đề xuất hiện.
import { test, expect } from '@playwright/test'
import { mockLogin } from './helpers/auth'

const TIEU_DE = 'Tiến độ theo môn'

test.describe('/tien-do — khối tiến độ theo môn', () => {
  test('khối xuất hiện ĐÚNG MỘT LẦN và đứng trên các khối số liệu tiếng Anh', async ({ page }) => {
    await mockLogin(page, 'vi')
    await page.goto('/tien-do')

    const khoi = page.getByRole('heading', { name: TIEU_DE })
    // Chờ theo TRẠNG THÁI (khối đã dựng xong), không theo thời gian.
    await expect(khoi).toHaveCount(1)
    await expect(khoi).toBeVisible()

    const tuVung = page.getByRole('heading', { name: 'Từ vựng' }).first()
    await expect(tuVung).toBeVisible()

    const treen = await khoi.boundingBox()
    const duoi = await tuVung.boundingBox()
    expect(treen, 'không lấy được hộp bao của khối tiến độ theo môn').not.toBeNull()
    expect(duoi, 'không lấy được hộp bao của khối Từ vựng').not.toBeNull()
    // Quyết định Q6: khối mới đứng ĐẦU nội dung, THÊM chứ không thay các StatCard cũ.
    expect(treen!.y).toBeLessThan(duoi!.y)
  })

  test('mỗi môn nói ra tiến độ HOẶC nói thẳng "chưa đo được" — không có 0% giả', async ({
    page,
  }) => {
    await mockLogin(page, 'vi')
    await page.goto('/tien-do')
    const khoi = page.locator('section[aria-labelledby="tien-do-theo-mon"]')
    await expect(khoi).toHaveCount(1)
    // Trạng thái cuối cùng của khối: hoặc có thẻ môn, hoặc có câu giải thích vì sao chưa có.
    await expect(khoi.getByRole('status')).toHaveCount(0, { timeout: 20_000 })

    const chu = (await khoi.textContent()) ?? ''
    expect(chu).not.toContain('0%')
    // Luật số 1 của sản phẩm: khối này không bao giờ là bảng chấm điểm con người.
    for (const cam of ['placement', 'mastery', 'năng lực', 'IELTS']) {
      expect(chu.toLowerCase(), `khối tiến độ không được nhắc "${cam}"`).not.toContain(
        cam.toLowerCase(),
      )
    }
  })

  test('320px: thẻ không tràn ngang, trang không có thanh cuộn ngang', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 })
    await mockLogin(page, 'vi')
    await page.goto('/tien-do')
    await expect(page.getByRole('heading', { name: TIEU_DE })).toBeVisible()
    const tran = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    )
    expect(tran, 'trang /tien-do bị tràn ngang ở 320px').toBe(false)
  })
})
