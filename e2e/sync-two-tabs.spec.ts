import { test, expect, type Page } from '@playwright/test'
import { mockLogin, USER_ID } from './helpers/auth'

// Cổng HAI TAB CÙNG CHỦ (slice S09-2, AC-12).
//
// Web Locks (`navigator.locks`) chỉ tồn tại trong trình duyệt thật và chỉ có nghĩa khi có ÍT
// NHẤT HAI ngữ cảnh cùng origin — không unit test nào tái hiện được. Không có khoá này, hai tab
// cùng gửi hai bản chụp khác nhau: dữ liệu union thì server cứu được, nhưng `hard`/`settings`
// (ghi đè theo thứ tự đến) thì không.

interface OutboxWindow extends Window {
  __sync: {
    enqueue: (uid: string, kind: 'english') => void
    flush: (uid: string) => Promise<{ sent: number; remaining: number; blocked?: string }>
    pending: (uid: string) => number
  }
}

interface OutboxModule {
  enqueue: (uid: string, kind: 'english') => void
  pending: (uid: string) => number
  flush: (
    uid: string,
    opts?: { resetBackoff?: boolean },
  ) => Promise<{ sent: number; remaining: number; blocked?: string }>
}

async function prepare(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.evaluate(async () => {
    // Đường dẫn để trong biến — module của APP trong trang, không phải của bộ test.
    const syncPath = '/src/lib/progressSync.ts'
    const outboxPath = '/src/lib/syncOutbox.ts'
    await import(/* @vite-ignore */ syncPath) // đăng ký handler 'english' cho hàng đợi
    const outbox = (await import(/* @vite-ignore */ outboxPath)) as OutboxModule
    ;(window as unknown as OutboxWindow).__sync = {
      enqueue: (uid: string, kind: 'english') => outbox.enqueue(uid, kind),
      flush: (uid: string) => outbox.flush(uid, { resetBackoff: true }),
      pending: outbox.pending,
    }
  })
}

test('hai tab cùng chủ gửi cùng lúc → đúng MỘT request lên /api/progress', async ({ context }) => {
  const tabA = await context.newPage()
  await mockLogin(tabA, 'vi', 'dark-blue')
  const tabB = await context.newPage()
  await mockLogin(tabB, 'vi', 'dark-blue')

  let posts = 0
  const countPost = (req: { url(): string; method(): string }) => {
    if (req.url().includes('/api/progress') && req.method() === 'POST') posts++
  }
  tabA.on('request', countPost)
  tabB.on('request', countPost)

  // POST phải GIỮ LẠI đủ lâu để hai tab thật sự chồng lấn — nếu tab A gửi xong trước khi tab B
  // bắt đầu thì chẳng có gì để tranh khoá, và ca test sẽ xanh giả.
  for (const tab of [tabA, tabB]) {
    await tab.route('**/api/progress**', async (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      await new Promise((r) => setTimeout(r, 1500))
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"ok":true,"version":2,"conflict":false,"replayed":false,"cefrUnlocked":[]}',
      })
    })
  }

  await prepare(tabA)
  await prepare(tabB)

  // Cả hai tab cùng có thay đổi và cùng gọi gửi trong một nhịp.
  const [resA, resB] = await Promise.all([
    tabA.evaluate((uid) => {
      const w = window as unknown as OutboxWindow
      w.__sync.enqueue(uid, 'english')
      return w.__sync.flush(uid)
    }, USER_ID),
    tabB.evaluate((uid) => {
      const w = window as unknown as OutboxWindow
      w.__sync.enqueue(uid, 'english')
      return w.__sync.flush(uid)
    }, USER_ID),
  ])

  // Một tab gửi, tab kia thấy khoá đang bị giữ và rút lui — KHÔNG có request thứ hai.
  expect(posts).toBe(1)
  expect([resA.blocked, resB.blocked].filter((b) => b === 'locked')).toHaveLength(1)
  // Thay đổi của tab bị chặn KHÔNG bị coi là đã gửi: nó vẫn nằm trong hàng đợi dùng chung (đọc
  // từ tab NÀO cũng thấy — localStorage chung một origin), và lượt gửi kế tiếp dọn sạch.
  const pendingA = await tabA.evaluate(
    (uid) => (window as unknown as OutboxWindow).__sync.pending(uid),
    USER_ID,
  )
  const pendingB = await tabB.evaluate(
    (uid) => (window as unknown as OutboxWindow).__sync.pending(uid),
    USER_ID,
  )
  expect(pendingA).toBe(pendingB)
  expect(pendingA).toBeLessThanOrEqual(1)

  const drained = await tabA.evaluate(
    (uid) => (window as unknown as OutboxWindow).__sync.flush(uid),
    USER_ID,
  )
  expect(drained.remaining).toBe(0)
  expect(
    await tabB.evaluate((uid) => (window as unknown as OutboxWindow).__sync.pending(uid), USER_ID),
  ).toBe(0)
})
