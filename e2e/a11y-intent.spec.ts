// e2e/a11y-intent.spec.ts — Cổng a11y (AA + AAA cho chữ nội dung) cho luồng /bat-dau của S05.
// Khuôn lấy từ `a11y-intake.spec.ts`; `e2e/a11y.spec.ts` không quét route này.
//
// Trang CÔNG KHAI nên quét với KHÁCH — đúng trạng thái người bấm CTA từ hub gặp phải.

import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { type ThemeName } from './helpers/auth'
import { freezeAnimations } from './helpers/axe'

const THEMES: ThemeName[] = ['dark-blue', 'blue-sky', 'kid']

/** Đặt theme cho KHÁCH (không có phiên đăng nhập để `mockLogin` gắn vào). */
async function datTheme(page: Page, theme: ThemeName) {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('ui_theme', t as string)
    } catch {
      /* ignore */
    }
  }, theme)
}

async function scanAA(page: Page) {
  await freezeAnimations(page)
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .disableRules(['meta-viewport'])
    .analyze()
  return violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length} phần tử)`)
}

/** AAA chỉ áp cho CHỮ NỘI DUNG/TIÊU ĐỀ (luật CLAUDE.md §4.5). */
async function scanAAANoiDung(page: Page) {
  await freezeAnimations(page)
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2aaa'])
    .include('h1')
    .include('h2')
    .include('p')
    .include('legend')
    .analyze()
  return violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length} phần tử)`)
}

async function toiGoiY(page: Page) {
  await page.getByRole('button', { name: 'Tiếp' }).click()
  await page.getByRole('button', { name: 'Vì thích' }).click()
  await page.getByRole('button', { name: '10 phút' }).click()
  await page.getByRole('button', { name: 'Mới bắt đầu' }).click()
  await expect(page.getByText('Mình gợi ý bắt đầu từ đây nhé?')).toBeVisible()
}

for (const theme of THEMES) {
  test(`a11y: /bat-dau bước chọn môn, theme=${theme}`, async ({ page }) => {
    await datTheme(page, theme)
    await page.goto('/bat-dau', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Bạn muốn học môn gì?')).toBeVisible()
    expect(await scanAA(page)).toEqual([])
    expect(await scanAAANoiDung(page)).toEqual([])
  })

  test(`a11y: /bat-dau bước thời gian, theme=${theme}`, async ({ page }) => {
    await datTheme(page, theme)
    await page.goto('/bat-dau?mon=programming', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Tiếp' }).click()
    await page.getByRole('button', { name: 'Vì thích' }).click()
    await expect(page.getByText('Mỗi ngày bạn có bao lâu?')).toBeVisible()
    expect(await scanAA(page)).toEqual([])
    expect(await scanAAANoiDung(page)).toEqual([])
  })

  test(`a11y: /bat-dau màn GỢI Ý, theme=${theme}`, async ({ page }) => {
    await datTheme(page, theme)
    await page.goto('/bat-dau?mon=programming', { waitUntil: 'domcontentloaded' })
    await toiGoiY(page)
    expect(await scanAA(page)).toEqual([])
    expect(await scanAAANoiDung(page)).toEqual([])
  })
}
