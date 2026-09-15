// e2e/companion-history.spec.ts — mở lại trang Bạn Đồng Hành phải thấy lại hội thoại cũ.
//
// VÌ SAO CỔNG NÀY Ở TẦNG E2E CHỨ KHÔNG PHẢI UNIT: lỗi nó canh chỉ tồn tại khi React chạy
// effect HAI LẦN — tức dưới `StrictMode`, tức đúng môi trường mà `npm run dev` (và bộ E2E
// này) dựng lên. Một unit test render component một lần sẽ xanh trong khi trang thật hỏng.
//
// Lỗi đã có thật (phát hiện 2026-09-15 khi dựng ảnh Tầng 8b cho S03-3): `Companion.tsx` khoá
// effect nạp lịch sử bằng `historyLoadedRef` để chặn chèn hai lần, nhưng cleanup của lượt
// MỘT đặt `cancelled = true` còn lượt HAI thì bị chính cái khoá đó chặn — nên response về
// tới nơi thì bị bỏ, và hội thoại cũ KHÔNG BAO GIỜ hiện ra trong dev.
import { test, expect } from '@playwright/test'
import { mockLogin } from './helpers/auth'

const LICH_SU = {
  messages: [
    {
      id: 'h1',
      role: 'user',
      content: 'Hom qua minh hoi ve vong lap for',
      createdAt: '2026-09-14T03:00:00.000Z',
    },
    {
      id: 'h2',
      role: 'companion',
      content: 'Dung roi, minh da giai thich vong lap for va bai tap kem theo',
      domain: 'learning',
      createdAt: '2026-09-14T03:00:05.000Z',
    },
  ],
}

test('mở trang thấy lại hội thoại cũ, mỗi tin ĐÚNG MỘT LẦN', async ({ page }) => {
  await mockLogin(page)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.route('**/api/companion**', (route) => {
    if (route.request().method() !== 'GET') return route.continue()
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(LICH_SU),
    })
  })

  await page.goto('/ban-dong-hanh')

  // 1) Hội thoại cũ PHẢI hiện ra. Đây là vế mà bản cũ hỏng: nó im lặng nuốt response.
  const cauHoiCu = page.getByText('Hom qua minh hoi ve vong lap for')
  await expect(cauHoiCu).toBeVisible()
  await expect(
    page.getByText('Dung roi, minh da giai thich vong lap for va bai tap kem theo'),
  ).toBeVisible()

  // 2) Và ĐÚNG MỘT LẦN. Đây là vế mà `historyLoadedRef` sinh ra để giữ — bỏ khoá đó đi mà
  //    không thay bằng gì khác thì StrictMode chèn hội thoại cũ thành hai bản.
  await expect(cauHoiCu).toHaveCount(1)

  // 3) Tin chào vẫn còn, và cũng chỉ một lần.
  await expect(page.getByText(/Tôi là .*Bạn Đồng Hành AI/)).toHaveCount(1)
})

test('lịch sử rỗng: giữ nguyên tin chào, không hiện gì thừa', async ({ page }) => {
  await mockLogin(page)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.route('**/api/companion**', (route) => {
    if (route.request().method() !== 'GET') return route.continue()
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ messages: [] }),
    })
  })

  await page.goto('/ban-dong-hanh')
  await expect(page.getByText(/Tôi là .*Bạn Đồng Hành AI/)).toHaveCount(1)
})

test('lịch sử lỗi mạng: im lặng giữ tin chào, KHÔNG làm vỡ trang', async ({ page }) => {
  await mockLogin(page)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.route('**/api/companion**', (route) => {
    if (route.request().method() !== 'GET') return route.continue()
    return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/ban-dong-hanh')
  // Hội thoại cũ là thứ "có thì tốt" — hỏng thì trang vẫn dùng được bình thường.
  await expect(page.getByText(/Tôi là .*Bạn Đồng Hành AI/)).toHaveCount(1)
  await expect(page.getByPlaceholder(/Nhắn tin cho/)).toBeVisible()
})
