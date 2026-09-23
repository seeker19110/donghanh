// e2e/subjects-catalog-states.spec.ts — S03-1: bốn trạng thái của danh mục môn học.
//
// VÌ SAO CÓ FILE NÀY: `/goc-hoc-tap` vốn đã nằm trong vòng quét a11y, nhưng CHỈ ở trạng thái
// thành công. Trạng thái LỖI (mất mạng / 503 / payload sai) trước đây không tồn tại trên
// giao diện — mọi lỗi đều bị `.catch(() => setSubjects([]))` hoá trang thành màn hình
// "chưa có môn học nào". Nay nó là một màn hình thật, nên nó phải được gác như mọi màn
// hình thật: hiện đúng chuyện đã xảy ra, thử lại được, và không rớt a11y ở theme nào.
//
// Nguồn dữ liệu: MOCK route `/api/subjects` (nêu rõ theo yêu cầu đặc tả §④ B) — không có
// cách nào bắt máy chủ thật trả 503 theo ý muốn trong một lượt test.
import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockLogin, type ThemeName } from './helpers/auth'
import { freezeAnimations, waitForStableDom } from './helpers/axe'

// Cùng luật với e2e/a11y-aaa.spec.ts: chữ ĐỂ ĐỌC phải đạt AAA (≥7:1), phần vỏ giao diện
// chỉ buộc AA. Bảng lỗi mới có hai đoạn <p> nội dung nên phải qua cả hai cổng.
const AAA_TAGS = ['wcag2aaa', 'wcag21aaa', 'wcag22aaa']
const CONTENT_SELECTOR =
  'h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,td,th,article,main > div'
const CHROME_ANCESTOR = 'nav,header,footer,button,a,[role="button"],[role="tab"],label,input,select'

const THEMES: ThemeName[] = ['dark-blue', 'blue-sky', 'kid']

/** Manifest thật rút gọn — cùng hình dạng `SUPPORTED_SUBJECTS` máy chủ trả ra. */
const CATALOG = {
  subjects: [
    {
      id: 'english',
      label: 'Tiếng Anh',
      description: 'Luyện giao tiếp, ngữ pháp, phát âm và từ vựng theo chuẩn CEFR quốc tế',
      category: 'language',
      taxonomyKind: 'cefr',
      standardLevels: ['A1', 'A2', 'B1'],
      questionTypes: ['vocabulary_mcq'],
      evaluationModes: ['rubric_ai'],
      schemaVersion: 1,
    },
  ],
}

async function scan(page: Page) {
  await freezeAnimations(page)
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  return violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length} phần tử)`)
}

test('503: hiện lỗi thật, KHÔNG giả vờ danh mục trống', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.route('**/api/subjects*', (route) =>
    route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"down"}' }),
  )

  await page.goto('/goc-hoc-tap')

  const alert = page.getByRole('alert')
  await expect(alert).toBeVisible()
  await expect(alert).toContainText('503')
  await expect(alert).toContainText('không phải danh mục trống')
  // Câu của nhánh rỗng không được xuất hiện ở đây.
  await expect(page.getByText('Bộ lọc này hiện chưa có môn học nào')).toHaveCount(0)
})

test('mất mạng: nói là không kết nối được, không đổ tại danh mục', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.route('**/api/subjects*', (route) => route.abort('failed'))

  await page.goto('/goc-hoc-tap')

  await expect(page.getByRole('alert')).toContainText('máy chủ')
  await expect(page.getByRole('alert')).not.toContainText('503')
})

test('"Thử lại" gọi lại API và dựng lại danh sách khi máy chủ khoẻ trở lại', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')

  // Máy chủ hỏng cho tới khi test tự cho khoẻ lại. KHÔNG đếm theo "lượt gọi thứ nhất":
  // StrictMode ở dev mount hai lần nên lần tải trang đầu đã sinh hai lượt.
  let hong = true
  let luot = 0
  await page.route('**/api/subjects*', (route) => {
    luot += 1
    if (hong) {
      return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' })
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(CATALOG),
    })
  })

  await page.goto('/goc-hoc-tap')
  await expect(page.getByRole('alert')).toBeVisible()

  // Không tự thử lại: đứng yên một lúc thì KHÔNG có lượt gọi nào tự mọc thêm.
  const sauKhiHong = luot
  await page.waitForTimeout(1500)
  expect(luot).toBe(sauKhiHong)

  hong = false
  await page.getByRole('button', { name: 'Thử lại' }).click()

  await expect(page.getByRole('heading', { name: 'Tiếng Anh' })).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
  // Đúng MỘT lượt gọi thêm cho MỘT cú bấm.
  expect(luot).toBe(sauKhiHong + 1)
})

test('danh mục rỗng THẬT nói đúng là bộ lọc rỗng, không hiện bảng lỗi', async ({ page }) => {
  await mockLogin(page, 'vi', 'dark-blue')
  await page.route('**/api/subjects*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ subjects: [] }),
    }),
  )

  await page.goto('/goc-hoc-tap')

  // Bộ lọc mặc định là "Tất cả môn" — gợi ý "Thử chọn Tất cả môn" khi đang CHỌN ĐÚNG nó là
  // sai logic (sửa cùng đợt audit UI/UX 2026-09-19), nên câu đúng cho ca danh mục rỗng THẬT
  // (không phải do lọc) là câu trung tính, không gợi ý đổi bộ lọc.
  await expect(page.getByText('Hiện chưa có môn học nào trong danh mục')).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
})

async function scanAaa(page: Page) {
  await freezeAnimations(page)
  const { violations } = await new AxeBuilder({ page }).withTags(AAA_TAGS).analyze()

  const violated: string[] = []
  for (const v of violations) {
    const targets = v.nodes.map((n) => (Array.isArray(n.target) ? String(n.target[0]) : ''))
    const n = await page.evaluate(
      ({ targets, content, chrome }) =>
        targets.filter((t) => {
          const el = t ? document.querySelector(t) : null
          return !!el && el.matches(content) && !el.closest(chrome)
        }).length,
      { targets, content: CONTENT_SELECTOR, chrome: CHROME_ANCESTOR },
    )
    if (n === 0) continue
    violated.push(`${v.id} (${n} phần tử)`)
  }
  return violated
}

// Trạng thái lỗi là màn hình mới → phải vào cổng a11y như mọi màn hình khác, ở CẢ 5 theme.
for (const theme of THEMES) {
  test(`a11y: /goc-hoc-tap trạng thái lỗi theme=${theme} — 0 vi phạm A/AA`, async ({ page }) => {
    await mockLogin(page, 'vi', theme)
    await page.route('**/api/subjects*', (route) =>
      route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }),
    )

    await page.goto('/goc-hoc-tap')
    await expect(page.getByRole('alert')).toBeVisible()
    await waitForStableDom(page)

    expect(await scan(page)).toEqual([])
  })
}

for (const theme of THEMES) {
  test(`a11y AAA: /goc-hoc-tap trạng thái lỗi theme=${theme} — nội dung ≥ 7:1`, async ({
    page,
  }) => {
    await mockLogin(page, 'vi', theme)
    await page.route('**/api/subjects*', (route) =>
      route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }),
    )

    await page.goto('/goc-hoc-tap')
    await expect(page.getByRole('alert')).toBeVisible()
    await waitForStableDom(page)

    expect(await scanAaa(page)).toEqual([])
  })
}
