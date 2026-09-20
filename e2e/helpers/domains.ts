import type { Page } from '@playwright/test'

// Giả dữ liệu trụ "Ghi chú" (API `/api/work`) cho E2E.
//
// E2E chạy bằng `npm run dev` (Vite), KHÔNG có backend Postgres, nên mọi lời gọi `/api/work`
// sẽ hỏng và trang rơi về danh sách rỗng. Mọi nút mở hộp thoại của trang "Ghi chú" đều nằm ở
// đầu từng mục nên danh sách rỗng là đủ để mở được cả bốn hộp thoại.
//
// [2026-09-20] Trước đây file này giả CẢ BỐN trụ Career/Work/Startup/Life. Ba trụ Sự nghiệp ·
// Khởi nghiệp · Đời sống đã bị gỡ hẳn (không còn trang, route, client API nào gọi tới), nên
// phần giả lập của chúng cũng đi theo — giữ lại chỉ là mã chết đánh lừa người đọc sau này.
//
// Server luôn BỌC response GET trong một object theo tên tài nguyên (vd { projects: [...] }) —
// xem apps/server/src/api/domains/work.ts. Mock ở đây PHẢI khớp đúng hình dạng bọc đó, nếu
// không nó khớp với đúng lỗi client-đọc-thẳng-response-trần đã sửa ở workApi.ts (2026-08-29,
// xem docs/changelog/0196-2026-08-29-fix-career-startup-api-unwrap.md) — mock kiểu cũ (mảng
// trần) từng khiến bug này lọt qua E2E y hệt cách nó lọt qua unit test.
const WORK_KEY: Record<string, string> = {
  projects: 'projects',
  tasks: 'tasks',
  meetings: 'meetings',
  documents: 'documents',
}

/** Chặn endpoint của trụ Ghi chú, trả dữ liệu tối thiểu đủ để mọi hộp thoại mở được. */
export async function mockDomainApis(page: Page): Promise<void> {
  await page.route('**/api/work**', (route) => {
    const kind = new URL(route.request().url()).searchParams.get('kind') ?? 'projects'
    const key = WORK_KEY[kind] ?? kind
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ [key]: [] }),
    })
  })
}
