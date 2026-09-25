// E2E S11b — tự thử lại câu STEM sai từ Sổ lỗi (spec S09–S12 §4.1).
//
// Chuỗi chỉ trình duyệt thật chốt được: làm bài sai → nộp → Sổ lỗi hiện đúng câu → "Ôn lại"
// mở bài với đáp án cũ + lời giải ĐƯỢC ẨN → trả lời lại đúng → nộp → Sổ lỗi hết câu đó.
// Server giả lập CÓ TRẠNG THÁI: lượt nộp được chấm theo đáp án thật của bài và trả lại qua GET,
// để Sổ lỗi dựng từ đúng bằng chứng mà trang bài vừa ghi (không gieo tay kết quả mong muốn).
import { test, expect, type Page } from '@playwright/test'
import { mockLogin, USER_ID } from './helpers/auth'

// Bài có THẬT trong chỉ mục (tsconfig.e2e không phân giải `@dhcb/*` nên ghi tay mã + đáp án).
const BAI = { id: 'ly10-c2-b10', slug: 'su-roi-tu-do' }
const DUNG: Record<number, (raw: string) => boolean> = {
  0: (raw) => raw === 'dinh_nghia',
  1: (raw) => /^20(\s*m\/s)?$/.test(raw.trim()),
  2: (raw) => raw === 'cung_luc',
}

type Answer = { questionIndex: number; raw: string }
type Post = { attemptId: string; clientAt?: string; answers: Answer[] }

async function serverCoTrangThai(page: Page) {
  const attempts: unknown[] = []
  await page.route('**/api/learning/evidence*', async (route) => {
    const req = route.request()
    if (req.method() === 'POST') {
      const body = req.postDataJSON() as Post
      const items = [0, 1, 2].map((i) => {
        const raw = body.answers.find((a) => a.questionIndex === i)?.raw ?? ''
        const correct = DUNG[i]!(raw)
        return { questionIndex: i, correct, reason: correct ? 'CORRECT' : 'WRONG_CHOICE' }
      })
      const correct = items.filter((x) => x.correct).length
      const evidence = {
        schemaVersion: 1,
        subjectId: 'physics',
        contentId: BAI.id,
        activityKind: 'stem_lesson_check',
        attemptId: body.attemptId,
        clientAt: body.clientAt ?? new Date().toISOString(),
        serverAt: new Date(Date.now() + attempts.length * 1000).toISOString(),
        ownerId: USER_ID,
        evidenceKind: 'server_graded',
        correct,
        total: 3,
        ratio: correct / 3,
        passed: correct === 3,
        items,
      }
      attempts.push(evidence)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(evidence),
      })
      return
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ state: [], attempts }),
    })
  })
  return attempts
}

function cau(page: Page, n: number) {
  return page.locator(`li:has(> #cau-${n})`)
}

test('câu sai → Sổ lỗi → tự thử (đáp án cũ ẩn) → nộp đúng → Sổ lỗi hết câu đó', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await mockLogin(page, 'vi')
  const attempts = await serverCoTrangThai(page)

  // 1. Làm bài: câu 1, 2 đúng; câu 3 chọn SAI ("sat").
  await page.goto(`/goc-hoc-tap/physics/bai-hoc/${BAI.id}--${BAI.slug}`)
  await cau(page, 1).getByRole('button').first().click()
  await page.locator('#tra-loi-2').fill('20')
  await cau(page, 3).getByRole('button').first().click()
  await expect(cau(page, 3)).toContainText('Chưa đúng.')
  await page.getByRole('button', { name: 'Nộp bài tự kiểm tra' }).click()
  await expect.poll(() => attempts.length).toBe(1)

  // 2. Sổ lỗi: đúng câu 3 của đúng bài.
  await page.goto('/so-tay-loi-sai')
  await page.getByRole('button', { name: 'Vật lí', exact: true }).click()
  await expect(page.getByText(/câu 3/).first()).toBeVisible()
  await page
    .getByRole('link', { name: /Ôn lại lỗi này/ })
    .first()
    .click()

  // 3. Trang bài: focus đề câu 3, đáp án cũ + lời giải bị ẩn, nộp bị khoá.
  await expect(page).toHaveURL(new RegExp(`${BAI.id}.*#cau-3$`))
  await expect(page.locator('#cau-3')).toBeFocused()
  await expect(cau(page, 3)).toContainText('câu trả lời lần trước đang được ẩn')
  await expect(cau(page, 3)).not.toContainText('Chưa đúng.')
  await expect(cau(page, 3).locator('ul button[aria-pressed="true"]')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Nộp bài tự kiểm tra' })).toBeDisabled()

  // "Xem câu trả lời lần trước" hiện lại đúng lựa chọn cũ, không tạo lượt nộp.
  await cau(page, 3).getByRole('button', { name: 'Xem câu trả lời lần trước' }).click()
  await expect(cau(page, 3).locator('ul button').first()).toHaveAttribute('aria-pressed', 'true')
  await expect(cau(page, 3)).toContainText('Chưa đúng.')
  expect(attempts).toHaveLength(1)

  // 4. "Thử lại câu này" → trả lời đúng → nộp lượt MỚI.
  await cau(page, 3).getByRole('button', { name: 'Thử lại câu này' }).click()
  await expect(page.locator('#cau-3')).toBeFocused()
  await cau(page, 3).getByRole('button').nth(1).click()
  await expect(cau(page, 3)).toContainText('Đúng rồi.')
  await page.getByRole('button', { name: 'Nộp bài tự kiểm tra' }).click()
  await expect.poll(() => attempts.length).toBe(2)
  const [luot1, luot2] = attempts as Array<{ attemptId: string }>
  expect(luot2!.attemptId).not.toBe(luot1!.attemptId)

  // 5. Sổ lỗi: câu 3 đã được gỡ bằng BẰNG CHỨNG mới, không phải vì bấm CTA.
  await page.goto('/so-tay-loi-sai')
  await page.getByRole('button', { name: 'Vật lí', exact: true }).click()
  await expect(page.getByText('Không còn câu nào sai')).toBeVisible()
})

test('tải lại trang sau khi vào từ Sổ lỗi: không bật lại chế độ tự thử', async ({ page }) => {
  await mockLogin(page, 'vi')
  const attempts = await serverCoTrangThai(page)
  await page.goto(`/goc-hoc-tap/physics/bai-hoc/${BAI.id}--${BAI.slug}`)
  await cau(page, 3).getByRole('button').first().click()
  await cau(page, 1).getByRole('button').first().click()
  await page.locator('#tra-loi-2').fill('20')
  await page.getByRole('button', { name: 'Nộp bài tự kiểm tra' }).click()
  await expect.poll(() => attempts.length).toBe(1)

  await page.goto('/so-tay-loi-sai')
  await page.getByRole('button', { name: 'Vật lí', exact: true }).click()
  await page
    .getByRole('link', { name: /Ôn lại lỗi này/ })
    .first()
    .click()
  await expect(cau(page, 3)).toContainText('đang được ẩn')

  await page.reload()
  await expect(page.locator('#cau-3')).toBeFocused()
  await expect(cau(page, 3)).not.toContainText('đang được ẩn')
  await expect(cau(page, 3)).toContainText('Chưa đúng.')

  // Back về Sổ lỗi bằng lịch sử trình duyệt vẫn hoạt động (return path).
  await page.goBack()
  await expect(page).toHaveURL(/\/so-tay-loi-sai/)
})
