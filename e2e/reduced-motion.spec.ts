import { test, expect } from '@playwright/test'
import { mockLogin } from './helpers/auth'
import { waitForStableDom } from './helpers/axe'

// Rà "giảm chuyển động" (prefers-reduced-motion: reduce) toàn app — P2-13
// (docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md).
//
// Đặt `reducedMotion: 'reduce'` cho CẢ FILE (không phải addStyleTag như freezeAnimations ở
// e2e/helpers/axe.ts) để trình duyệt thật sự đánh giá media query
// `prefers-reduced-motion: reduce` — đúng cơ chế người dùng bật ở hệ điều hành, không phải
// ép CSS từ ngoài vào.
test.use({ reducedMotion: 'reduce' })

// 5 phần tử có ít nhất một class `animate-*` (Tailwind) chạy CSS animation thật sự phải
// dừng: `getComputedStyle().animationName === 'none'` HOẶC animation-duration = 0s (rule
// chung ở index.css dùng animation-duration:0s!important thay vì animation:none — xem chú
// thích "TÔN TRỌNG GIẢM CHUYỂN ĐỘNG..." trong index.css để biết lý do không dùng `none`).
async function assertNoRunningAnimation(page: import('@playwright/test').Page) {
  const running = await page.evaluate(() => {
    const offenders: string[] = []
    for (const el of Array.from(document.querySelectorAll('[class*="animate-"]'))) {
      const style = getComputedStyle(el)
      const durationMs = parseFloat(style.animationDuration || '0') * 1000
      if (style.animationName !== 'none' && durationMs > 0) {
        offenders.push(el.className.toString())
      }
    }
    return offenders
  })
  expect(running).toEqual([])
}

test('reduced-motion: Trang chủ không còn hoạt ảnh chạy', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.goto('/')
  await expect(page.getByRole('banner').getByText(/Xin chào/)).toBeVisible()
  await waitForStableDom(page)
  await assertNoRunningAnimation(page)
})

test('reduced-motion: một bài Lập trình không còn hoạt ảnh chạy', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.goto('/lap-trinh/bai-hoc/p1-u4-l1')
  await waitForStableDom(page)
  await assertNoRunningAnimation(page)
})

test('reduced-motion: một bài STEM (kiến thức ứng dụng) không còn hoạt ảnh chạy', async ({
  page,
}) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.goto('/ung-dung-thuc-te')
  await waitForStableDom(page)
  await assertNoRunningAnimation(page)
})

test('reduced-motion: /luyen-noi không còn hoạt ảnh chạy', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.goto('/luyen-noi')
  await waitForStableDom(page)
  await assertNoRunningAnimation(page)
})

test('reduced-motion: /tien-do không còn hoạt ảnh chạy', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.goto('/tien-do')
  await waitForStableDom(page)
  await assertNoRunningAnimation(page)
})
