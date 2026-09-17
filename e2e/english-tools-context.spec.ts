// e2e/english-tools-context.spec.ts — Slice 03 Góc học tập: công cụ Tiếng Anh NẰM TRONG MÔN.
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-03-04-cong-cu-theo-mon-va-bo-mac-dinh-english.md
// (AC-3.2 active nav, AC-3.4 Back có ngữ cảnh, AC-3.5 trang chung nói rõ môn).
import { test, expect } from '@playwright/test'
import { mockLogin } from './helpers/auth'

const ENGLISH_HOME = '/goc-hoc-tap/english'

test.describe('Back của công cụ Tiếng Anh về trang tổng quan môn (AC-3.4)', () => {
  for (const path of ['/tro-truyen', '/tu-dien', '/on-thi']) {
    test(`${path} → Back → ${ENGLISH_HOME}`, async ({ page }) => {
      await mockLogin(page)
      await page.goto(path)
      // [2026-09-17] Nhãn nút Back nay lấy đúng đốt cha thật ("Tiếng Anh") thay vì chữ cứng
      // "Trang chủ" (vốn sai: nút này về trang môn Tiếng Anh, không phải Trang chủ tuyệt đối).
      // `exact: true` — không thì khớp nhầm nút sidebar "Thu gọn công cụ Tiếng Anh" (chứa
      // chuỗi con "Tiếng Anh"), đứng trước trong DOM nên `.first()` từng chọn nhầm nút đó.
      await page.getByRole('button', { name: 'Tiếng Anh', exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`${ENGLISH_HOME.replace(/\//g, '\\/')}$`))
    })
  }
})

test('mobile: đứng ở /tro-truyen thì tab "Góc học tập" sáng, không phải "Luyện tập" (AC-3.2)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await mockLogin(page)
  await page.goto('/tro-truyen')
  const nav = page.getByRole('navigation').last()
  await expect(nav.getByRole('link', { name: /Góc học tập/ })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(nav.getByRole('link', { name: /Luyện tập/ })).not.toHaveAttribute(
    'aria-current',
    'page',
  )
})

test('desktop: sidebar ở /luyen-viet sáng Góc học tập › Tiếng Anh › Luyện viết; Luyện tập là mục lá', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await mockLogin(page)
  await page.goto('/luyen-viet')
  const tools = page.getByRole('list', { name: 'Công cụ Tiếng Anh' })
  await expect(tools.getByRole('link', { name: 'Luyện viết' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(page.getByRole('button', { name: /mục Luyện tập/ })).toHaveCount(0)
})

test('trang chung /tien-do nói rõ đang là môn Tiếng Anh và có link về trang môn (AC-3.5)', async ({
  page,
}) => {
  await mockLogin(page)
  await page.goto('/tien-do')
  const link = page.getByRole('link', { name: /về trang môn|go to subject page/ })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', ENGLISH_HOME)
})
