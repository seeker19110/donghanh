import { expect, test, type Page } from '@playwright/test'
import { mockLogin, type ThemeName } from './helpers/auth'
import { freezeAnimations, waitForStableDom } from './helpers/axe'
import { muteTts } from './helpers/tts'

// ──────────────────────────────────────────────────────────────────────────────
// S07d — cổng ma trận tự động cho tập màn §3 AC2 (spec S06–S08, mục "S07d").
// Nền đo: docs/research/2026-09-25-s07d-ma-tran-tu-dong.md.
//
// Ba phép đo, đều TUYỆT ĐỐI (không baseline, không ngoại lệ):
//   1. Không tràn ngang + mọi control đang hiển thị ≥ 44×44 CSS px + đúng một <h1>.
//   2. Đi Tab rồi Shift+Tab: không phần tử focus nào bị che HOÀN TOÀN (WCAG 2.4.11).
//   3. Sidebar desktop: chạm (pointer: coarse) → 44px; chuột → giữ mật độ cũ.
// Viewport Playwright KHÔNG thay browser zoom thật / pinch / bàn phím ảo / thiết bị thật —
// các mục đó vẫn WAITING ở goal, cổng này không chứng minh chúng.
// ──────────────────────────────────────────────────────────────────────────────

const THEMES: ThemeName[] = ['dark-blue', 'blue-sky', 'kid']
type Width = 320 | 390 | 768 | 1440
const HEIGHT: Record<Width, number> = { 320: 568, 390: 844, 768: 1024, 1440: 900 }
const STEM = '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do'
const MIN_TARGET = 44

type Screen = {
  id: string
  path: string
  onboarded?: boolean
  /** Thao tác sau khi trang nạp để tới đúng trạng thái cần đo. */
  after?: (page: Page) => Promise<void>
}

const HOME: Screen = { id: 'home', path: '/' }

const SCREENS: Screen[] = [
  HOME,
  { id: 'onboarding', path: '/onboarding', onboarded: false },
  { id: 'placement', path: '/placement' },
  {
    id: 'placement-question',
    path: '/placement',
    after: async (page) => {
      await page.getByRole('button', { name: 'Bắt đầu', exact: true }).click()
      await expect(page.getByText(/Vòng 1\//)).toBeVisible()
    },
  },
  { id: 'stem-lesson', path: STEM },
  {
    id: 'stem-result',
    path: STEM,
    after: async (page) => {
      await page.route('**/api/learning/evidence**', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, status: 'attempted', scoreRatio: 0.2 }),
        }),
      )
      const questions = page.locator('ul li:has(> p:has-text("Câu "))')
      const count = await questions.count()
      for (let i = 0; i < count; i += 1) {
        const question = questions.nth(i)
        const option = question.locator('button[aria-pressed]').first()
        if (await option.count()) await option.click()
        else await question.locator('input').first().fill('x')
      }
      await page.getByRole('button', { name: /Nộp bài tự kiểm tra/ }).click()
      await expect(page.getByRole('button', { name: /Làm lại/ }).first()).toBeVisible()
    },
  },
  {
    id: 'cefr-quiz',
    path: '/goc-hoc-tap/english/lo-trinh/a1?tab=quiz',
    after: async (page) => {
      await expect(page.locator('main h2').first()).toBeVisible()
    },
  },
]

async function openScreen(page: Page, screen: Screen, width: Width, theme: ThemeName) {
  await page.setViewportSize({ width, height: HEIGHT[width] })
  await mockLogin(page, 'vi', theme, screen.onboarded === false ? { onboarded: false } : undefined)
  await muteTts(page)
  await page.goto(screen.path, { waitUntil: 'domcontentloaded' })
  // Chờ vỏ trang thật (`<main>`) trước khi chờ DOM đứng yên — xem learningUxScreens.ts.
  // Onboarding là màn toàn trang không có <main> → không ném, phép đo sau tự đỏ nếu trang hỏng.
  await page
    .locator('main')
    .first()
    .waitFor({ state: 'attached', timeout: 15_000 })
    .catch(() => {})
  await waitForStableDom(page)
  if (screen.after) {
    await screen.after(page)
    await waitForStableDom(page)
  }
  await freezeAnimations(page)
}

type SmallTarget = { tag: string; name: string; width: number; height: number }

/** Mọi control đang hiển thị có box nhỏ hơn 44×44. `root` giới hạn vùng đo (vd sidebar). */
async function smallTargets(page: Page, root = 'body'): Promise<SmallTarget[]> {
  return page.evaluate(
    ({ rootSelector, min }) => {
      const selector = [
        'a[href]',
        'button',
        'input:not([type=hidden])',
        'select',
        'textarea',
        'summary',
        '[role=button]',
        '[role=tab]',
        '[role=link]',
        '[role=checkbox]',
        '[role=radio]',
        '[role=switch]',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',')
      const scope = document.querySelector(rootSelector)
      if (!scope) return [{ tag: 'MISSING', name: rootSelector, width: 0, height: 0 }]
      const found: SmallTarget[] = []
      for (const el of Array.from(scope.querySelectorAll<HTMLElement>(selector))) {
        const rect = el.getBoundingClientRect()
        const style = getComputedStyle(el)
        if (rect.width === 0 || rect.height === 0) continue
        if (style.visibility === 'hidden' || style.display === 'none') continue
        if (el.closest('[aria-hidden="true"],[inert]')) continue
        // Skip link `sr-only` (1×1 khi chưa focus) — thành control đầy đủ lúc nhận focus.
        if (rect.width <= 2 && rect.height <= 2) continue
        if (rect.width >= min && rect.height >= min) continue
        found.push({
          tag: el.tagName,
          name: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 60),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        })
      }
      return found
    },
    { rootSelector: root, min: MIN_TARGET },
  )
}

type FocusStop = { id: string; covered: boolean; coveredBy: string }

/**
 * Phần tử đang focus có bị che HOÀN TOÀN không: cả tâm lẫn hai góc đều trúng một
 * phần tử khác (thanh đáy, header cố định…) hoặc nằm ngoài viewport.
 */
async function focusStop(page: Page): Promise<FocusStop | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body || el === document.documentElement) return null
    const rect = el.getBoundingClientRect()
    const label = (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40)
    const id = `${el.tagName}|${label}|${Math.round(rect.top + window.scrollY)}`
    const points: Array<[number, number]> = [
      [rect.left + rect.width / 2, rect.top + rect.height / 2],
      [rect.left + 2, rect.top + 2],
      [rect.right - 2, rect.bottom - 2],
    ]
    let hidden = 0
    let coveredBy = ''
    for (const [x, y] of points) {
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
        hidden += 1
        coveredBy = 'ngoài viewport'
        continue
      }
      const hit = document.elementFromPoint(x, y)
      if (hit && (hit === el || el.contains(hit) || hit.contains(el))) continue
      hidden += 1
      const owner = hit?.closest('nav,header,footer,[role=dialog]') ?? hit
      coveredBy = owner ? `${owner.tagName}.${String(owner.className).slice(0, 40)}` : 'null'
    }
    return { id, covered: hidden === points.length, coveredBy }
  })
}

/** Đi Tab xuôi rồi Shift+Tab ngược; trả mọi điểm dừng bị che hoàn toàn. */
async function obscuredFocusStops(page: Page): Promise<FocusStop[]> {
  const bad: FocusStop[] = []
  for (const key of ['Tab', 'Shift+Tab']) {
    const seen = new Set<string>()
    for (let i = 0; i < 80; i += 1) {
      await page.keyboard.press(key)
      const stop = await focusStop(page)
      if (!stop) continue
      if (seen.has(stop.id)) break
      seen.add(stop.id)
      if (stop.covered) bad.push(stop)
    }
  }
  return bad
}

for (const screen of SCREENS) {
  for (const width of [320, 390, 768] as const) {
    for (const theme of THEMES) {
      test(`S07d reflow + 44px + h1: ${screen.id}, ${width}px, ${theme}`, async ({ page }) => {
        await openScreen(page, screen, width, theme)
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          ),
          'không tràn ngang',
        ).toBe(0)
        expect(await smallTargets(page), 'mọi control ≥ 44×44 CSS px').toEqual([])
        await expect(page.locator('h1'), 'đúng một h1').toHaveCount(1)
      })
    }
  }
}

for (const screen of SCREENS.filter((s) =>
  ['home', 'placement-question', 'stem-result', 'cefr-quiz'].includes(s.id),
)) {
  for (const width of [320, 390] as const) {
    test(`S07d focus không bị che: ${screen.id}, ${width}px`, async ({ page }) => {
      await openScreen(page, screen, width, 'blue-sky')
      expect(await obscuredFocusStops(page)).toEqual([])
    })
  }
}

test('S07d negative control: bỏ scroll-padding thì header/thanh đáy che focus ở Home 390px', async ({
  page,
}) => {
  await openScreen(page, HOME, 390, 'blue-sky')
  await page.addStyleTag({ content: 'html { scroll-padding: 0 !important; }' })
  const bad = await obscuredFocusStops(page)
  const by = bad.map((stop) => stop.coveredBy.split('.')[0])
  expect(by, 'phép đo phải bắt được thanh đáy che (Tab xuôi)').toContain('NAV')
  expect(by, 'phép đo phải bắt được header che (Shift+Tab)').toContain('HEADER')
})

test.describe('S07d sidebar desktop 1440px', () => {
  test.describe('màn cảm ứng (pointer: coarse)', () => {
    test.use({ hasTouch: true })
    for (const theme of THEMES) {
      test(`mọi control sidebar ≥ 44px: ${theme}`, async ({ page }) => {
        await openScreen(page, HOME, 1440, theme)
        expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true)
        expect(await smallTargets(page, 'aside')).toEqual([])
      })
    }
  })

  test('chuột: giữ mật độ liên kết con, nút icon vẫn 44px', async ({ page }) => {
    await openScreen(page, HOME, 1440, 'dark-blue')
    expect(await page.evaluate(() => matchMedia('(pointer: fine)').matches)).toBe(true)
    const small = await smallTargets(page, 'aside')
    // Chỉ liên kết (A) được thấp hơn 44 khi dùng chuột — vẫn trên sàn 24px của WCAG 2.5.8.
    expect(small.filter((t) => t.tag !== 'A')).toEqual([])
    for (const target of small) expect(target.height).toBeGreaterThanOrEqual(24)
    expect(small.length, 'mật độ desktop không đổi').toBeGreaterThan(0)
  })
})
