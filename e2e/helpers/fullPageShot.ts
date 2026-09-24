import type { Page } from '@playwright/test'
import { waitForStableDom } from './axe'

/**
 * Chụp ảnh TOÀN TRANG mà KHÔNG dùng `page.screenshot({ fullPage: true })`.
 *
 * VÌ SAO (2026-09-24, đo thật — `docs/changelog/0433-*.md`): với `fullPage: true`, Chromium
 * chụp bằng `captureBeyondViewport` và trong lúc đó trang THẤY khung nhìn thoáng qua là
 * **1×1 px** (`innerWidth=1 innerHeight=1`, đo bằng listener `matchMedia`). Ở bề rộng 1440px,
 * truy vấn `(min-width: 1024px)` của `useIsDesktopViewport()` vì thế lật false → true.
 * `TwoPane` (packages/core-ui) đổi HÌNH CÂY giữa hai nhánh desktop/mobile theo đúng cờ đó,
 * nên React gỡ rồi dựng lại TOÀN BỘ cột chính: mọi `animate-fade-in` chạy lại từ opacity 0,
 * các khối tự tải dữ liệu quay về skeleton. Ảnh bị chụp giữa quãng đó → "cả trang mờ, lệch
 * xuống ~6px" (Hồ sơ `/trang-ca-nhan`: 8/10 lần chụp dính). Đo `opacity` NGAY TRƯỚC khi chụp
 * luôn thấy = 1, vì chính lệnh chụp mới gây ra việc dựng lại.
 *
 * Người dùng thật KHÔNG gặp: khung nhìn 1×1 chỉ tồn tại bên trong lệnh chụp của công cụ.
 * Ở 390px không dính vì 1px và 390px đều < 1024px, cờ không đổi.
 *
 * Hai cách "nhẹ" đã thử và KHÔNG đủ (đo 10 lần/cách):
 * - `freezeAnimations()` rồi `fullPage`: hết mờ, nhưng khối nạp dữ liệu vẫn bị dựng lại →
 *   ảnh chụp skeleton thay cho nội dung.
 * - `screenshot({ fullPage: true, animations: 'disabled' })`: vẫn dính 3–4/10 lần.
 *
 * Cách ở đây: giữ NGUYÊN bề rộng, nới chiều cao khung nhìn bằng đúng chiều cao trang, chụp
 * khung nhìn thường (không `captureBeyondViewport`), rồi trả lại kích thước cũ. Bề rộng không
 * đổi nên truy vấn theo bề rộng không bao giờ lật. Kèm một chốt canh: nếu trong lúc chụp mà
 * truy vấn `(min-width: 1024px)` vẫn đổi trạng thái, hàm NÉM LỖI thay vì trả về một ảnh sai
 * trông như thật (ảnh sai im lặng chính là thứ đã làm đợt audit 2026-09-22 kết luận nhầm).
 */

// Khớp `useIsDesktopViewport()` (apps/dhcb/src/lib/useIsDesktopViewport.ts). Đây là truy vấn
// duy nhất đổi hình cây React theo bề rộng nên là thứ phải canh.
const DESKTOP_QUERY = '(min-width: 1024px)'
// Trang có phần tử cao theo khung nhìn (`min-h-screen`, `100dvh`) có thể cao thêm khi nới
// khung nhìn — đo lại vài vòng cho tới khi chiều cao đứng yên.
const MAX_RESIZE_ROUNDS = 4

type FlipProbe = { __dhcbShotFlips?: number }

async function pageHeight(page: Page): Promise<number> {
  return page.evaluate(() =>
    Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
  )
}

/** Chờ trình duyệt vẽ xong hai khung hình sau khi đổi kích thước. */
async function twoFrames(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
}

// Class của `Skeleton` (apps/dhcb/src/components/Skeleton.tsx) — còn phần tử này là trang
// còn đang tải, chụp lúc đó ra ảnh khung xám chứ không phải giao diện thật.
const SKELETON_SELECTOR = '.animate-shimmer'

/**
 * Chờ trang SẴN SÀNG để chụp, theo trạng thái chứ không theo số giây.
 *
 * VÌ SAO (đo 2026-09-24): công thức Tầng 8b cũ chờ cứng 1800ms → khi dev server còn nguội, trang
 * chụp đầu tiên ra cột chính trống (Hồ sơ 1440px). Chỉ `waitForStableDom` cũng chưa đủ: trang
 * đứng yên ở skeleton đủ lâu để bị coi là "xong" (Hồ sơ 390px ra 6 thẻ xám). Nên chờ thêm tới
 * khi hết skeleton, rồi chờ DOM đứng yên lần nữa (nội dung thật vừa thay skeleton).
 *
 * Trả `false` (không ném) nếu hết giờ mà skeleton còn: có trang giữ skeleton thật khi API không
 * được giả lập — người chụp cần BIẾT điều đó để nhìn ảnh cho đúng, không cần test đỏ.
 */
export async function waitForShotReady(page: Page, timeout = 20_000): Promise<boolean> {
  await waitForStableDom(page)
  const ready = await page
    .waitForFunction((sel) => !document.querySelector(sel), SKELETON_SELECTOR, { timeout })
    .then(() => true)
    .catch(() => false)
  if (!ready) console.warn(`waitForShotReady: ${page.url()} vẫn còn skeleton sau ${timeout}ms`)
  await waitForStableDom(page)
  return ready
}

export async function screenshotFullPage(
  page: Page,
  options: { path?: string } = {},
): Promise<Buffer> {
  const original = page.viewportSize()
  if (!original) throw new Error('screenshotFullPage cần page có viewport cố định')

  // Gắn chốt canh: đếm số lần truy vấn desktop đổi trạng thái kể từ lúc này.
  await page.evaluate((query) => {
    const w = window as unknown as FlipProbe
    w.__dhcbShotFlips = 0
    window.matchMedia(query).addEventListener('change', () => {
      w.__dhcbShotFlips = (w.__dhcbShotFlips ?? 0) + 1
    })
  }, DESKTOP_QUERY)

  try {
    let height = await pageHeight(page)
    for (let round = 0; round < MAX_RESIZE_ROUNDS; round++) {
      await page.setViewportSize({
        width: original.width,
        height: Math.max(height, original.height),
      })
      await twoFrames(page)
      const next = await pageHeight(page)
      if (next === height) break
      height = next
    }

    const buf = await page.screenshot({ path: options.path, animations: 'disabled' })

    const flips = await page.evaluate(() => (window as unknown as FlipProbe).__dhcbShotFlips ?? 0)
    if (flips > 0) {
      throw new Error(
        `screenshotFullPage: truy vấn ${DESKTOP_QUERY} đổi ${flips} lần trong lúc chụp — ` +
          'trang đã bị dựng lại, ảnh không đáng tin.',
      )
    }
    return buf
  } finally {
    await page.setViewportSize(original)
  }
}
