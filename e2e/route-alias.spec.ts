import { test, expect } from '@playwright/test'
import { mockLogin } from './helpers/auth'

// Canh gác các ALIAS TIẾNG ANH của đường dẫn tiếng Việt.
//
// Vì sao cần: alias thiếu KHÔNG gây lỗi ồn ào — route `*` ở cuối App.tsx nuốt mọi đường
// dẫn lạ rồi đẩy về trang chủ. Người dùng gõ /programming sẽ về trang chủ, không phải
// trang môn cũng không phải 404, nên nhìn qua tưởng "app chạy bình thường". Đúng loại
// lỗi im lặng chỉ lộ ra khi có người đối chiếu từng cặp — bảng dưới đây làm việc đó.
const ALIASES: ReadonlyArray<readonly [alias: string, dich: string]> = [
  // Slice 02: Tiếng Anh là một MÔN — ba đường cũ của "không gian" về trang tổng quan môn.
  ['/english', '/goc-hoc-tap/english'],
  ['/tieng-anh', '/goc-hoc-tap/english'],
  ['/hoc-tieng-anh', '/goc-hoc-tap/english'],
  ['/programming', '/goc-hoc-tap/programming'],
  ['/lap-trinh', '/goc-hoc-tap/programming'],
  ['/lap-trinh/gioi-thieu', '/goc-hoc-tap/programming/gioi-thieu'],
  ['/lap-trinh/p1--nhap-mon-tu-duy', '/goc-hoc-tap/programming/bac/p1--nhap-mon-tu-duy'],
  ['/lap-trinh/bai-hoc/p1-u1-l1', '/goc-hoc-tap/programming/bai-hoc/p1-u1-l1'],
  [
    '/lap-trinh/khoa-hoc/git--git-github-thuc-hanh',
    '/goc-hoc-tap/programming/khoa-hoc/git--git-github-thuc-hanh',
  ],
  ['/lap-trinh/khoa/git', '/goc-hoc-tap/programming/khoa-hoc/git--git-github-thuc-hanh'],
  ['/lap-trinh/huong', '/goc-hoc-tap/programming/huong'],
  ['/lap-trinh/huong/web--lap-trinh-web', '/goc-hoc-tap/programming/huong/web--lap-trinh-web'],
  [
    '/lap-trinh/lo-trinh/principal-ai--kien-truc-su-phan-mem-ai',
    '/goc-hoc-tap/programming/lo-trinh/principal-ai--kien-truc-su-phan-mem-ai',
  ],
  ['/lap-trinh/du-an', '/goc-hoc-tap/programming/du-an'],
  ['/lap-trinh/on-tap', '/goc-hoc-tap/programming/on-tap'],
  ['/lap-trinh/chay-thu', '/goc-hoc-tap/programming/chay-thu'],
  // [2026-09-20] Alias của trụ Công việc → trang "Ghi chú". Ba trụ Sự nghiệp · Khởi nghiệp ·
  // Đời sống đã bị gỡ hẳn, alias của chúng nay về Trang chủ (xem e2e/v2-hubs.spec.ts).
  ['/work', '/ghi-chu'],
  ['/cong-viec', '/ghi-chu'],
  ['/profile', '/trang-ca-nhan'],
  ['/companion', '/ban-dong-hanh'],
  // Tiền tố CŨ của Góc học tập — mọi dạng, kể cả đường sâu, phải đi THẲNG tới đích cuối.
  ['/subjects', '/goc-hoc-tap'],
  ['/mon-hoc', '/goc-hoc-tap'],
  ['/phong-hoc', '/goc-hoc-tap'],
  ['/hoc-mon-hoc', '/goc-hoc-tap'],
  ['/mon-hoc/physics', '/goc-hoc-tap/physics'],
  ['/phong-hoc/physics/bai-hoc', '/goc-hoc-tap/physics/bai-hoc'],
  ['/workspace', '/action-canvas'],
  ['/simulators', '/ung-dung-thuc-te'],
]

for (const [alias, dich] of ALIASES) {
  test(`alias ${alias} dẫn tới ${dich}`, async ({ page }) => {
    await mockLogin(page)
    await page.goto(alias)
    // Chờ chuyển hướng xong rồi mới đối chiếu — <Navigate> chạy ở giai đoạn commit.
    await expect(page).toHaveURL(
      new RegExp(`${dich.replace(/\//g, '\\/')}(?:--[a-z0-9-]+)?(\\?|$)`),
    )
    if (alias === '/programming' || alias.startsWith('/lap-trinh')) {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
  })
}

// Đường dẫn KHÔNG tồn tại vẫn phải về trang chủ (hành vi của route `*`) — chốt lại để
// việc thêm alias mới không vô tình phá nhánh bắt-tất.
test('đường dẫn không tồn tại thì về trang chủ', async ({ page }) => {
  await mockLogin(page)
  await page.goto('/duong-dan-khong-ton-tai-abc123')
  await expect(page).toHaveURL(/\/$/)
})

test('legacy programming URL lạ không redirect vòng', async ({ page }) => {
  await mockLogin(page)
  await page.goto('/lap-trinh/khong-ton-tai-abc123')
  await expect(page).toHaveURL(/\/lap-trinh\/khong-ton-tai-abc123$/)
})

// Alias phải GIỮ query + hash: chúng là chỗ người dùng đang đứng trong trang, mất là mất
// đúng thứ họ vừa mở (đặc tả `docs/specs/2026-09-15-goc-hoc-tap-architecture.md` §③).
test('alias cũ giữ nguyên query và hash', async ({ page }) => {
  await mockLogin(page)
  await page.goto('/mon-hoc/physics/bai-hoc?lop=10#noi-dung')
  await expect(page).toHaveURL(/\/goc-hoc-tap\/physics\/bai-hoc\?lop=10#noi-dung$/)
})

// Back sau khi qua alias phải quay về trang nguồn, KHÔNG kẹt vòng lặp alias → đích → alias.
test('Back sau alias không kẹt vòng lặp', async ({ page }) => {
  await mockLogin(page)
  await page.goto('/tien-do')
  await page.goto('/mon-hoc')
  await expect(page).toHaveURL(/\/goc-hoc-tap$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/tien-do$/)
})
