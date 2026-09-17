import { test, expect } from '@playwright/test'

// Smoke tối thiểu: app khởi động, khách xem được nội dung, route cần tài khoản vẫn đẩy về
// /login, form hiện ra.
test.describe('Khởi động & trang đăng nhập', () => {
  // [2026-09-15 — chế độ Khách] Kỳ vọng ở đây ĐỔI có chủ ý: trước đây "/" đá thẳng về /login.
  // Đặc tả: docs/specs/2026-09-15-mo-xem-web-khong-can-dang-nhap.md
  test('truy cập / khi chưa đăng nhập → XEM ĐƯỢC nội dung, không bị đá về /login', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page).not.toHaveURL(/\/login$/)
    // [P0-3, lệnh 4, 2026-09-17] Khách nay thấy `GuestHome` — dải nhắc "chế độ khách" của
    // `GuestBanner` chỉ hiện SAU KHI khách đã có dấu vết học thật (không còn hiện ngay lúc mới
    // mở trang). CTA duy nhất của `GuestHome` là dấu hiệu chắc chắn nhất app đã vào chế độ này
    // ngay từ lần mở đầu tiên.
    await expect(page.getByRole('link', { name: 'Bắt đầu — chọn việc đầu tiên' })).toBeVisible()
  })

  test('route CẦN TÀI KHOẢN (/trang-ca-nhan) vẫn đẩy khách về /login', async ({ page }) => {
    await page.goto('/trang-ca-nhan')
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByPlaceholder('Email')).toBeVisible()
  })

  test('ui_lang=en → trang đăng nhập hiển thị tiếng Anh', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ui_lang', 'en'))
    await page.goto('/login')
    // Tên thương hiệu KHÔNG dịch — cả hai ngôn ngữ đều là "Đồng Hành Cùng Bạn". Thứ đổi theo
    // ngôn ngữ là dòng tagline và nhãn form, nên chốt bằng chúng (đổi 2026-08-28 khi gỡ định vị
    // "Gia sư tiếng Anh AI" ở mức nền tảng).
    await expect(page.getByRole('heading', { name: 'Đồng Hành Cùng Bạn' })).toBeVisible()
    await expect(page.getByText('Learning · Career · Work · Startup · Life')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible()
  })

  test('nút VI/EN đổi ngôn ngữ giao diện ngay tại trang đăng nhập', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Đồng Hành Cùng Bạn' })).toBeVisible()
    await expect(
      page.getByText('Học tập · Sự nghiệp · Công việc · Khởi nghiệp · Đời sống'),
    ).toBeVisible()
    await page.getByRole('button', { name: 'EN', exact: true }).click()
    await expect(page.getByText('Learning · Career · Work · Startup · Life')).toBeVisible()
    await page.getByRole('button', { name: 'VI', exact: true }).click()
    await expect(
      page.getByText('Học tập · Sự nghiệp · Công việc · Khởi nghiệp · Đời sống'),
    ).toBeVisible()
  })
})
