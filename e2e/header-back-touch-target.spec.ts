import { expect, test } from '@playwright/test'
import { mockLogin, type ThemeName } from './helpers/auth'
import { muteTts } from './helpers/tts'

const THEMES: ThemeName[] = ['dark-blue', 'blue-sky', 'kid']
const ROUTES = [
  {
    name: 'CEFR',
    path: '/goc-hoc-tap/english/lo-trinh/a1',
    destination: /\/goc-hoc-tap\/english\/lo-trinh\/?$/,
    backName: 'Lộ trình CEFR',
  },
  {
    name: 'Lập trình',
    path: '/goc-hoc-tap/programming/bai-hoc/p1-u4-l1',
    destination: /\/goc-hoc-tap\/programming\/bac\/p1--/,
    backName: 'Nhập môn tư duy',
  },
] as const

for (const width of [320, 390]) {
  for (const theme of THEMES) {
    for (const route of ROUTES) {
      test(`header Back hit target and activation: ${route.name}, ${width}px, ${theme}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 844 })
        await mockLogin(page, 'vi', theme)
        await muteTts(page)
        await page.goto(route.path, { waitUntil: 'domcontentloaded' })

        const back = page.locator('header > div').getByRole('button', { name: route.backName })
        await expect(back).toBeVisible({ timeout: 60_000 })
        const box = await back.boundingBox()
        expect(box, 'Back button must have a visible box').not.toBeNull()
        expect(box!.width).toBeGreaterThanOrEqual(44)
        expect(box!.height).toBeGreaterThanOrEqual(44)
        expect(
          await back.evaluate((element) => {
            const rect = element.getBoundingClientRect()
            const hit = document.elementFromPoint(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
            )
            return hit === element || element.contains(hit)
          }),
          'Back center must hit its own button',
        ).toBe(true)
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          ),
        ).toBe(0)
        await expect(page.locator('header p').first()).toBeVisible()
        await expect(
          page.locator('header').getByRole('button', { name: 'Mở Bạn Đồng Hành AI' }),
        ).toBeVisible()

        if (route.name === 'CEFR') {
          await back.click()
        } else {
          await back.focus()
          await expect(back).toBeFocused()
          await page.keyboard.press(width === 320 ? 'Enter' : 'Space')
        }
        await expect(page).toHaveURL(route.destination)
      })
    }
  }
}
