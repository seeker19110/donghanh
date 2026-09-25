import { expect, type Page } from '@playwright/test'
import { USER_ID } from './auth'

// [S11b] Đưa trang tới trạng thái "tự thử lại câu 3 bài Sự rơi tự do từ Sổ lỗi" — dùng chung
// cho cổng AA (a11y.spec.ts) và AAA (a11y-aaa.spec.ts). Trạng thái này chỉ tồn tại sau một
// lượt bấm từ Sổ lỗi (router state), nên vòng quét theo route không bao giờ thấy nó.
export const BAI_TU_THU = '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do'

export async function moCauTuThuLai(page: Page): Promise<void> {
  await page.route('**/api/learning/evidence*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        state: [],
        attempts: [
          {
            schemaVersion: 1,
            subjectId: 'physics',
            contentId: 'ly10-c2-b10',
            activityKind: 'stem_lesson_check',
            attemptId: 'aaaaaaaabbbbcccc',
            clientAt: '2026-09-10T08:00:00.000Z',
            serverAt: '2026-09-10T08:00:01.000Z',
            ownerId: USER_ID,
            evidenceKind: 'server_graded',
            correct: 2,
            total: 3,
            ratio: 2 / 3,
            passed: false,
            items: [{ questionIndex: 2, correct: false, reason: 'WRONG_CHOICE' }],
          },
        ],
      }),
    }),
  )
  // Nháp trên CÙNG máy: câu 3 đã chọn sai — có đáp án cũ để ẩn.
  await page.goto(BAI_TU_THU, { waitUntil: 'domcontentloaded' })
  const cau3 = page.locator('li:has(> #cau-3)')
  await cau3.getByRole('button').first().click()
  await expect(cau3).toContainText('Chưa đúng.')
  await page.goto('/so-tay-loi-sai', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Vật lí', exact: true }).click()
  await page
    .getByRole('link', { name: /Ôn lại lỗi này/ })
    .first()
    .click()
  await expect(cau3).toContainText('câu trả lời lần trước đang được ẩn')
}
