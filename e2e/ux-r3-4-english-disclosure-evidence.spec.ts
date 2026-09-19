// UX-R3.4 — English progressive disclosure: bằng chứng CLS/height/hierarchy cho `/tien-do`.
//
// Đặc tả: docs/specs/2026-09-18-ui-clarity-dashboard-progressive-disclosure.md §10 (28 evidence
// case) + §9 AC-8..AC-11. Fixture `ux-r3-member-v1` kế thừa tinh thần UX-R2 (member cố định,
// plan Free, locale vi, timezone Asia/Ho_Chi_Minh, clock cố định) — xem
// `e2e/home-clarity-evidence.spec.ts` cho khuôn CLS gốc mà file này tái dùng cho trang
// `/tien-do` thay vì Home.
//
// GHI CHÚ PHẠM VI (R3-4, ghi trong changelog theo đúng tinh thần "tự xử lý, không dừng hỏi
// lại" mà brief cho phép khi hạ tầng test chưa có sẵn cho slice này):
// - "Cần ôn hôm nay"/"Sổ lỗi"/"IELTS" trong fixture canonical để 0 (không seed dữ liệu SRS/sổ
//   lỗi/bài viết) — các khối đó vẫn render đúng trạng thái "chưa có" xác định, không ảnh hưởng
//   tới AC chiều cao/CLS/hierarchy mà case này canh.
// - CEFR "delayed"/"error" case chặn mạng thật ở MỘT chunk từ điển (`/data/dictionary/
//   chunk-000.json`), KHÔNG phải `/data/cefr.json` trực tiếp — phát hiện thật khi viết case
//   này: `subjectProgressBoard.ts` (SubjectProgressSection, ngoài touch-set R3-4) gọi thẳng
//   `loadCefr()`/`loadFoundation()` share cache với `curriculum.ts`; chặn `cefr.json` làm
//   TOÀN BỘ khối "Tiến độ theo môn" treo theo (board dùng `Promise.all` với đúng promise đó),
//   nhiễu CLS đo được bằng shift không liên quan tới English disclosure. `loadDictionary()` là
//   phần DUY NHẤT của `curriculum.ts` mà board kia không gọi tới — chặn đúng chỗ đó vẫn ép
//   `cefrState` Dashboard ở `loading`/`error` (nó chờ cả ba nguồn qua `Promise.all`) mà không
//   kéo theo SubjectProgressSection. Trễ giữ bằng một gate Node phía test, nhả sau ĐÚNG ≥600ms
//   tường thực kể từ input cuối (không fake timer).
import { createHash } from 'node:crypto'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockLogin, USER_ID, type ThemeName } from './helpers/auth'
import { freezeAnimations, waitForStableDom } from './helpers/axe'

const FIXED_EPOCH = Date.parse('2026-09-19T03:00:00.000Z')
const FIXTURE_VERSION = 'ux-r3-member-v1'
const THEMES: readonly ThemeName[] = ['dark-blue', 'blue-sky', 'kid']
const MIN_RECOVERY_DELAY_MS = 650 // > 600ms thực yêu cầu ở §10, chừa biên cho jitter máy CI.

type EvidenceMode = 'member-data' | 'member-programming-only'

interface ClsState {
  supported: boolean
  value: number
  entries: unknown[]
}

interface EvidenceEntry {
  commit: string
  case: string
  theme: ThemeName
  width: number
  pageHeightPx: number
  scrollWidthPx: number
  cls: number
  fixtureVersion: string
  fixtureHash: string
  screenshotSha256: string
}

declare global {
  interface Window {
    __uxr3EnglishCls?: ClsState
  }
}

function sha256(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex')
}

function fixtureHash(mode: EvidenceMode): string {
  return sha256(JSON.stringify({ fixtureVersion: FIXTURE_VERSION, epoch: FIXED_EPOCH, mode }))
}

function makeGate(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void
  const promise = new Promise<void>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

/** Cài đồng hồ cố định + CLS observer TRƯỚC navigation đầu tiên — không fallback suy từ ảnh. */
async function installDeterministicBrowserState(
  page: Page,
  mode: EvidenceMode,
  theme: ThemeName,
): Promise<void> {
  await page.addInitScript(
    ({ epoch, selectedTheme, userId, seedLearned, usageDates }) => {
      const NativeDate = Date
      const FixedDate = new Proxy(NativeDate, {
        construct(target, args) {
          return Reflect.construct(target, args.length === 0 ? [epoch] : args)
        },
      })
      Object.defineProperty(FixedDate, 'now', { value: () => epoch })
      globalThis.Date = FixedDate

      Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => true })
      localStorage.clear()
      sessionStorage.clear()
      localStorage.setItem('ui_lang', 'vi')
      localStorage.setItem('ui_theme', selectedTheme)
      localStorage.setItem('dhcb_sync_outbox_v2', '[]')
      localStorage.setItem('et_learned_' + userId, JSON.stringify(seedLearned))
      for (const date of usageDates) {
        localStorage.setItem(
          `et_usage_${userId}_${date}`,
          JSON.stringify({
            date,
            chatCount: 1,
            writingCount: 0,
            speakingCount: 0,
            sttCount: 0,
            pronounceCount: 0,
            learnCount: 3,
          }),
        )
      }
    },
    {
      epoch: FIXED_EPOCH,
      selectedTheme: theme,
      userId: USER_ID,
      seedLearned: mode === 'member-data' ? ['hello', 'world', 'thanks'] : [],
      usageDates:
        mode === 'member-data'
          ? ['2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18']
          : ([] as string[]),
    },
  )

  await page.addInitScript(() => {
    const supported =
      typeof PerformanceObserver !== 'undefined' &&
      PerformanceObserver.supportedEntryTypes.includes('layout-shift')
    window.__uxr3EnglishCls = { supported, value: 0, entries: [] }
    if (!supported) return
    const observer = new PerformanceObserver((list) => {
      for (const rawEntry of list.getEntries()) {
        const entry = rawEntry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
        if (!entry.hadRecentInput && typeof entry.value === 'number') {
          window.__uxr3EnglishCls!.value += entry.value
          window.__uxr3EnglishCls!.entries.push({ value: entry.value })
        }
      }
    })
    observer.observe({ type: 'layout-shift', buffered: true })
  })
}

/** Zero hoá bộ đếm CLS — dùng để đo riêng một transition (vd loading→ready) thay vì cộng dồn
 * cả những shift của bước mở panel đứng trước nó trong cùng case. */
async function resetCls(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (window.__uxr3EnglishCls) {
      window.__uxr3EnglishCls.value = 0
      window.__uxr3EnglishCls.entries = []
    }
  })
}

async function readCls(page: Page): Promise<ClsState> {
  return page.evaluate(() => window.__uxr3EnglishCls ?? { supported: false, value: 0, entries: [] })
}

async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )
  })
  await waitForStableDom(page)
}

async function gotoDashboard(
  page: Page,
  mode: EvidenceMode,
  theme: ThemeName,
  width: number,
): Promise<void> {
  await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 })
  await installDeterministicBrowserState(page, mode, theme)
  await mockLogin(page, 'vi', theme)
  await page.goto('/tien-do')
  await expect(page.getByRole('heading', { name: /Tiến độ học|Your Progress/ })).toBeVisible()
  // SubjectProgressSection (boundary NGOÀI phạm vi R3-4 — không sửa) tự fetch bằng chứng từng
  // môn (`/api/learning/evidence`) và tăng chiều cao đáng kể khi các lời gọi đó xong. Đợi nó
  // render xong TRƯỚC khi coi trang đã settle — nếu không, case đo CLS theo transition riêng
  // (weekly/CEFR recovery) có thể lẫn shift của khối này vào bằng chứng của R3-4.
  await expect(page.getByText('Toán').first()).toBeVisible({ timeout: 15_000 })
  await settle(page)
}

async function captureEvidence(
  page: Page,
  testInfo: TestInfo,
  caseName: string,
  theme: ThemeName,
  width: number,
  mode: EvidenceMode,
  clsValue: number,
): Promise<EvidenceEntry> {
  await page.evaluate(() => scrollTo(0, 0))
  await freezeAnimations(page)
  const screenshot = await page.screenshot({ fullPage: true, animations: 'disabled' })
  await testInfo.attach(`${caseName}.png`, { body: screenshot, contentType: 'image/png' })

  const measurements = await page.evaluate(() => ({
    pageHeightPx: document.documentElement.scrollHeight,
    scrollWidthPx: document.documentElement.scrollWidth,
  }))
  expect(
    measurements.scrollWidthPx,
    `${caseName}: /tien-do không được tràn ngang`,
  ).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth))

  return {
    commit: process.env.GITHUB_SHA ?? 'local-working-tree',
    case: caseName,
    theme,
    width,
    ...measurements,
    cls: clsValue,
    fixtureVersion: FIXTURE_VERSION,
    fixtureHash: fixtureHash(mode),
    screenshotSha256: sha256(screenshot),
  }
}

const manifest: EvidenceEntry[] = []

// eslint-disable-next-line no-empty-pattern -- Playwright yêu cầu destructuring fixture đầu tiên.
test.afterAll(async ({}, testInfo) => {
  if (manifest.length === 0) return
  await testInfo.attach('manifest-after.json', {
    body: JSON.stringify(manifest, null, 2),
    contentType: 'application/json',
  })
})

// ── 1) Canonical loaded/collapsed: 320/390/1440 × 3 theme = 9 case ─────────────────────────
for (const width of [320, 390, 1440]) {
  for (const theme of THEMES) {
    test(`canonical loaded/collapsed ${width}×${theme}`, async ({ page }, testInfo) => {
      await gotoDashboard(page, 'member-data', theme, width)
      const toggle = page.locator('#dashboard-english-details-toggle')
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')
      await expect(page.locator('#dashboard-english-details-panel')).toBeHidden()
      const calendarToggle = page.locator('#dashboard-calendar-toggle')
      await expect(calendarToggle).toHaveAttribute('aria-expanded', 'false')

      const heights = { 320: 2300, 390: 2100, 1440: 1450 } as const
      const cls = await readCls(page)
      expect(cls.supported, 'Chromium phải hỗ trợ layout-shift').toBe(true)
      const entry = await captureEvidence(
        page,
        testInfo,
        `canonical-${width}-${theme}`,
        theme,
        width,
        'member-data',
        cls.value,
      )
      expect(
        entry.pageHeightPx,
        `${width}px phải ≤${heights[width as keyof typeof heights]}px`,
      ).toBeLessThanOrEqual(heights[width as keyof typeof heights])
      manifest.push(entry)
    })
  }
}

// ── 2) English expanded: 390 × 3 theme = 3 case ─────────────────────────────────────────────
for (const theme of THEMES) {
  test(`English expanded 390×${theme}`, async ({ page }, testInfo) => {
    await gotoDashboard(page, 'member-data', theme, 390)
    const toggle = page.locator('#dashboard-english-details-toggle')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const panel = page.locator('#dashboard-english-details-panel')
    await expect(panel).toBeVisible()
    // Mọi destination hiện hành vẫn còn — không bị xoá bởi disclosure.
    await expect(panel.getByRole('heading', { name: 'Hôm nay' })).toBeVisible()
    await expect(panel.getByRole('heading', { name: 'Từ vựng' })).toBeVisible()
    await expect(panel.getByRole('heading', { name: 'Lộ trình CEFR' })).toBeVisible()
    await expect(panel.getByText(/Điểm viết IELTS/)).toBeVisible()
    await expect(panel.getByText('Tổng kết')).toBeVisible()
    await settle(page)

    const cls = await readCls(page)
    const entry = await captureEvidence(
      page,
      testInfo,
      `expanded-390-${theme}`,
      theme,
      390,
      'member-data',
      cls.value,
    )
    manifest.push(entry)
  })
}

// ── 3) Weekly unavailable/null: 390 × 3 theme × 2 mode = 6 case ─────────────────────────────
for (const theme of THEMES) {
  for (const httpMode of ['null-payload', 'http-error'] as const) {
    test(`weekly unavailable (${httpMode}) 390×${theme}`, async ({ page }, testInfo) => {
      // `released=false` phục vụ MỌI request trước Retry cùng một câu trả lời cố định — kể cả
      // khi StrictMode dev double-invoke effect đầu (mount→cleanup→mount) bắn hai request gần
      // như đồng thời, thứ tự resolve của chúng không xác định. Chỉ sau khi test bấm Retry thật
      // (bump `weeklyRetryRevision`, effect chạy lại đơn — không double-invoke) mới có ĐÚNG một
      // request mới, khi đó `released` mới lật sang trạng thái ready.
      let released = false
      const gate = makeGate()
      await page.route('**/api/usage-summary', async (route) => {
        if (!released) {
          if (httpMode === 'null-payload') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({ plan: 'free', freeWeeklyCredit: null, freeWeeklyCap: 30 }),
            })
          } else {
            await route.fulfill({ status: 503, contentType: 'application/json', body: '{}' })
          }
          return
        }
        await gate.promise
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ plan: 'free', freeWeeklyCredit: 12, freeWeeklyCap: 30 }),
        })
      })

      await gotoDashboard(page, 'member-data', theme, 390)
      const heading = page.locator('#dashboard-weekly-credit-heading')
      await expect(heading).toBeVisible()
      await expect(page.getByText('Chưa tải được lượt AI hôm nay.')).toBeVisible()
      const clsAfterUnavailable = await readCls(page)
      const before = await captureEvidence(
        page,
        testInfo,
        `weekly-unavailable-${httpMode}-390-${theme}-before`,
        theme,
        390,
        'member-data',
        clsAfterUnavailable.value,
      )
      manifest.push(before)

      await settle(page)
      await resetCls(page)
      const retry = page.getByRole('button', { name: 'Thử lại' }).first()
      await retry.focus()
      // `released` phải lật NGAY TRƯỚC click, không phải sau: click() có thể trả về ở Node
      // trước khi request thật của effect retry kịp tới route handler (cùng vòng lặp sự
      // kiện) — lật sau click là một race đã bắt được thật khi chạy lại nhiều lần.
      released = true
      await retry.click()
      await expect(retry).toHaveAttribute('aria-disabled', 'true')
      await page.waitForTimeout(MIN_RECOVERY_DELAY_MS)
      gate.resolve()
      await expect(page.getByText('12/30')).toBeVisible()
      await expect(heading).toBeFocused()
      await settle(page)

      const clsRecovery = await readCls(page)
      expect(
        clsRecovery.value,
        `weekly ${httpMode} loading→ready CLS phải <0.1 (${theme}@390)`,
      ).toBeLessThanOrEqual(0.1)
      const after = await captureEvidence(
        page,
        testInfo,
        `weekly-unavailable-${httpMode}-390-${theme}-after`,
        theme,
        390,
        'member-data',
        clsRecovery.value,
      )
      manifest.push(after)
    })
  }
}

// ── 4) CEFR delayed recovery: 390 × 3 theme = 3 case ────────────────────────────────────────
for (const theme of THEMES) {
  test(`CEFR delayed recovery 390×${theme}`, async ({ page }, testInfo) => {
    const gate = makeGate()
    await page.route('**/data/dictionary/chunk-000.json', async (route) => {
      await gate.promise
      await route.continue()
    })

    await gotoDashboard(page, 'member-data', theme, 390)
    const toggle = page.locator('#dashboard-english-details-toggle')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByText('Đang tải lộ trình Tiếng Anh…')).toBeVisible()
    // Chờ phần còn lại của trang (vd SubjectProgressSection — boundary KHÔNG thuộc R3-4) settle
    // XONG rồi mới reset bộ đếm CLS, để không lẫn shift của khối khác vào transition đang đo.
    await settle(page)
    await resetCls(page)

    await page.waitForTimeout(MIN_RECOVERY_DELAY_MS)
    gate.resolve()
    await expect(page.getByRole('heading', { name: 'Lộ trình CEFR' })).toBeVisible()
    await expect(page.getByText('Đang tải lộ trình Tiếng Anh…')).toHaveCount(0)
    await settle(page)

    const cls = await readCls(page)
    expect(cls.value, `CEFR delayed→ready CLS phải <0.1 (${theme}@390)`).toBeLessThanOrEqual(0.1)
    const entry = await captureEvidence(
      page,
      testInfo,
      `cefr-delayed-390-${theme}`,
      theme,
      390,
      'member-data',
      cls.value,
    )
    manifest.push(entry)
  })
}

// ── 5) CEFR error recovery: 390 × 3 theme = 3 case ──────────────────────────────────────────
for (const theme of THEMES) {
  test(`CEFR error recovery 390×${theme}`, async ({ page }, testInfo) => {
    // `released=false` trả 503 cho MỌI request trước Retry (kể cả double-invoke của StrictMode
    // dev ở mount đầu) — chỉ sau khi test bấm Retry thật mới lật sang chờ gate rồi trả ready.
    let released = false
    const gate = makeGate()
    await page.route('**/data/dictionary/chunk-000.json', async (route) => {
      if (!released) {
        await route.fulfill({ status: 503, contentType: 'application/json', body: '{}' })
        return
      }
      await gate.promise
      await route.continue()
    })

    await gotoDashboard(page, 'member-data', theme, 390)
    const toggle = page.locator('#dashboard-english-details-toggle')
    await toggle.click()
    await expect(page.getByText('Chưa tải được lộ trình Tiếng Anh.')).toBeVisible()
    await settle(page)
    await resetCls(page)

    const retry = page
      .locator('#dashboard-cefr-heading')
      .locator('xpath=ancestor::section[1]')
      .getByRole('button', { name: 'Thử lại' })
    await retry.focus()
    // Lật `released` NGAY TRƯỚC click — xem ghi chú race ở case weekly phía trên.
    released = true
    await retry.click()
    await page.waitForTimeout(MIN_RECOVERY_DELAY_MS)
    gate.resolve()
    await expect(page.getByRole('heading', { name: 'Lộ trình CEFR' })).toBeVisible()
    await expect(page.getByText('Chưa tải được lộ trình Tiếng Anh.')).toHaveCount(0)
    await expect(page.locator('#dashboard-cefr-heading')).toBeFocused()
    await settle(page)

    const cls = await readCls(page)
    expect(cls.value, `CEFR error→ready CLS phải <0.1 (${theme}@390)`).toBeLessThanOrEqual(0.1)
    const entry = await captureEvidence(
      page,
      testInfo,
      `cefr-error-390-${theme}`,
      theme,
      390,
      'member-data',
      cls.value,
    )
    manifest.push(entry)
  })
}

// ── 6) Programming-only: 390 × 3 theme = 3 case ─────────────────────────────────────────────
for (const theme of THEMES) {
  test(`programming-only scope/copy 390×${theme}`, async ({ page }, testInfo) => {
    await gotoDashboard(page, 'member-programming-only', theme, 390)
    await expect(
      page.getByText('Chưa có hoạt động Tiếng Anh được ghi nhận tuần này.'),
    ).toBeVisible()
    await expect(page.getByText(/^\d+\/\d+ ngày/)).toHaveCount(0)

    const cls = await readCls(page)
    const entry = await captureEvidence(
      page,
      testInfo,
      `programming-only-390-${theme}`,
      theme,
      390,
      'member-programming-only',
      cls.value,
    )
    manifest.push(entry)
  })
}

// ── 7) Live responsive calendar: 1 case ─────────────────────────────────────────────────────
test('live responsive calendar giữ state/focus qua 1023→1024→1279→1280→390 (dark-blue)', async ({
  page,
}, testInfo) => {
  await gotoDashboard(page, 'member-data', 'dark-blue', 1023)
  const calendarToggle = page.locator('#dashboard-calendar-toggle')
  await calendarToggle.click()
  await expect(calendarToggle).toHaveAttribute('aria-expanded', 'true')
  const grid = page.getByRole('grid', { name: /Lịch hoạt động theo ngày/ })
  const oldCell = grid.getByRole('gridcell').first()
  const oldDate = await oldCell.getAttribute('data-date')
  await oldCell.click()
  await expect(grid.locator(`[data-date="${oldDate}"]`)).toBeFocused()

  for (const width of [1024, 1279, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(calendarToggle).toHaveAttribute('aria-expanded', 'true')
    await expect(grid.locator(`[data-date="${oldDate}"]`)).toHaveAttribute('aria-selected', 'true')
  }

  // Ở 1280px chọn một ngày cách hiện tại >5 tuần (ô đầu range 26 tuần).
  const farCell = grid.getByRole('gridcell').first()
  const farDate = await farCell.getAttribute('data-date')
  await farCell.click()
  await farCell.focus()

  await page.setViewportSize({ width: 390, height: 844 })
  // Range 5 tuần ở mobile: ngày xa rời range nên phải clamp về ngày đầu range mới. Dùng
  // assertion tự retry (không `getAttribute` một lần) vì resize→clamp chạy qua effect, có độ
  // trễ một vài tick so với lệnh setViewportSize.
  const mobileGrid = page.getByRole('grid', { name: /Lịch hoạt động theo ngày/ })
  const mobileFirst = mobileGrid.getByRole('gridcell').first()
  await expect(mobileFirst).not.toHaveAttribute('data-date', farDate ?? '__none__')
  await expect(mobileFirst).toHaveAttribute('aria-selected', 'true')
  await expect(mobileFirst).toBeFocused()

  await settle(page)
  const cls = await readCls(page)
  const entry = await captureEvidence(
    page,
    testInfo,
    'live-responsive-calendar-dark-blue',
    'dark-blue',
    390,
    'member-data',
    cls.value,
  )
  manifest.push(entry)
})

// ── A11y toàn trang, English mở, 3 theme (canh gác bổ sung — không tính vào 28 case) ────────
for (const theme of THEMES) {
  test(`English expanded đạt axe A/AA ở theme=${theme}`, async ({ page }) => {
    await gotoDashboard(page, 'member-data', theme, 390)
    await page.locator('#dashboard-english-details-toggle').click()
    await freezeAnimations(page)
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .disableRules(['meta-viewport'])
      .analyze()
    expect(violations.map((v) => ({ id: v.id, impact: v.impact }))).toEqual([])
  })
}
