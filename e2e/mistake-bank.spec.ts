// E2E: sổ lỗi có BẰNG CHỨNG `/so-tay-loi-sai` (S12-2, AC-11).
//
// Ba thứ chỉ trình duyệt thật mới chốt được: nhãn "ghi tay" không biến thành "có bằng chứng",
// nút "Ôn lại lỗi này" thật sự ĐI TỚI đúng màn/đúng câu, và bộ lọc môn đổi được nội dung mà
// không làm trắng trang.
import { test, expect } from '@playwright/test'
import { mockLogin, USER_ID } from './helpers/auth'

// Bài Lí CÓ THẬT trong chỉ mục (không nhập registry vào E2E — tsconfig.e2e không phân giải
// `@dhcb/*`, và kéo cả môn vào test chỉ để lấy một mã là thừa). URL phải mang tiêu đề theo quy
// ước `<mã>--<slug>`, nên phần slug dưới đây cũng là bằng chứng chỉ mục còn khớp.
const BAI = { id: 'ly10-c1-b1', slug: 'lam-quen-voi-vat-li' }

const LOI_ANH = {
  id: '9f1d3a2e-1111-4111-8111-111111111111',
  wrong: 'I go to school yesterday',
  corrected: 'I went to school yesterday',
  explanation: 'Quá khứ đơn dùng "went"',
  source: 'speaking',
  dir: 'A',
  createdAt: Date.now() - 86_400_000,
  count: 1,
  lastReviewedAt: null,
  reviewCount: 0,
}

function luotSai(contentId: string) {
  return {
    schemaVersion: 1,
    subjectId: 'physics',
    contentId,
    activityKind: 'stem_lesson_check',
    attemptId: 'aaaaaaaabbbbcccc',
    clientAt: '2026-09-10T08:00:00.000Z',
    serverAt: '2026-09-10T08:00:01.000Z',
    ownerId: USER_ID,
    evidenceKind: 'server_graded',
    correct: 0,
    total: 2,
    ratio: 0,
    passed: false,
    items: [{ questionIndex: 1, correct: false, reason: 'WRONG_VALUE' }],
  }
}

test.beforeEach(async ({ page }) => {
  // Sổ lỗi môn Anh: gieo cục bộ + để server trả đúng bản đó (đồng bộ khi mở trang).
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: `et_mistakes_${USER_ID}`,
    value: [LOI_ANH],
  })
  await page.route('**/api/mistakes**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ mistakes: [LOI_ANH] }),
    }),
  )
})

test('lỗi không có bằng chứng hiện "ghi tay" và "Ôn lại" đi tới đúng màn nguồn', async ({
  page,
}) => {
  await mockLogin(page, 'vi')
  await page.goto('/so-tay-loi-sai', { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('group', { name: 'Lọc sổ lỗi theo môn' })).toBeVisible()
  await expect(page.getByText('ghi tay').first()).toBeVisible()
  await expect(page.getByText('có bằng chứng')).toHaveCount(0)

  // Danh sách "Tất cả" hiện nút ôn lại ngay, không phải lật thẻ.
  await page.getByRole('button', { name: /Tất cả/ }).click()
  await page
    .getByRole('link', { name: /Ôn lại lỗi này/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/luyen-noi/)
})

test('lọc sang môn STEM: câu sai từ bằng chứng, "Ôn lại" neo tới đúng câu của đúng bài', async ({
  page,
}) => {
  await page.route('**/api/learning/evidence*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ state: [], attempts: [luotSai(BAI.id)] }),
    }),
  )
  await mockLogin(page, 'vi')
  await page.goto('/so-tay-loi-sai', { waitUntil: 'domcontentloaded' })

  await page.getByRole('button', { name: 'Vật lí', exact: true }).click()
  await expect(page.getByText(/câu 2/).first()).toBeVisible()
  await expect(page.getByText(/có bằng chứng/).first()).toBeVisible()

  const onLai = page.getByRole('link', { name: /Ôn lại lỗi này/ }).first()
  await expect(onLai).toHaveAttribute(
    'href',
    `/goc-hoc-tap/physics/bai-hoc/${BAI.id}--${BAI.slug}#cau-2`,
  )
})

test('không tải được nhật ký STEM → nói "chưa tải được", KHÔNG nói là hết lỗi', async ({
  page,
}) => {
  await page.route('**/api/learning/evidence*', (route) => route.fulfill({ status: 500 }))
  await mockLogin(page, 'vi')
  await page.goto('/so-tay-loi-sai', { waitUntil: 'domcontentloaded' })

  await page.getByRole('button', { name: 'Hoá học', exact: true }).click()
  await expect(page.getByText('Chưa tải được lỗi từ bài STEM')).toBeVisible()
  await expect(page.getByText('Không còn câu nào sai')).toHaveCount(0)
})

test('môn Lập trình nói thẳng "chưa có bằng chứng câu sai" (không sổ ghi tay giả)', async ({
  page,
}) => {
  await mockLogin(page, 'vi')
  await page.goto('/so-tay-loi-sai', { waitUntil: 'domcontentloaded' })

  await page.getByRole('button', { name: 'Lập trình', exact: true }).click()
  await expect(page.getByText('Chưa có bằng chứng câu sai')).toBeVisible()
})
