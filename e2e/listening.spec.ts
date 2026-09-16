import { test, expect } from '@playwright/test'
import { mockLogin } from './helpers/auth'
import { muteTts } from './helpers/tts'

// Tab "Nghe" ở trang cấp CEFR (③ N3, docs/research/dac-ta-nang-cap-su-pham-2026-07-15.md).
// A1 luôn mở khóa (CLAUDE.md) nên vào thẳng ?tab=listening không cần seed tiến độ.
//
// Trên dev server NGUỘI (mới khởi, chưa transform module nào), `goto()` tự nó đã tốn ~2,9–3,0s
// (Vite dịch lần đầu chunk trang) rồi mới tới lúc React mount + tab Nghe render — đo thật với
// `playwright.config.cold.ts` tạm (cổng riêng, `reuseExistingServer: false`, 2026-09-16):
// expect đầu tiên sau `goto` một mình cần 2,6s (1 worker) tới 3,3s (2 worker, cùng tải với
// `programming-lesson.spec.ts`) — đã ở mức ~55–65% ngưỡng mặc định 5000ms, dưới tải CPU nặng
// hơn của toàn bộ suite (nhiều spec Pyodide/SQLite/Worker chạy song song) thời gian thật còn
// giãn thêm. Đây là chi phí THẬT của lần tải nguội (không phải việc test làm thừa) nên nới
// timeout đúng cái expect ĐẦU TIÊN sau `goto` của mỗi ca (không nới cả file).
test.describe('Tab Nghe (luyện nghe theo cấp)', () => {
  test('mở tab → mặc định "Chọn nghĩa", hiện câu hỏi trắc nghiệm 4 đáp án', async ({ page }) => {
    await muteTts(page)
    await mockLogin(page, 'vi')
    await page.goto('/lo-trinh-hoc/a1?tab=listening', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('button', { name: /Chọn nghĩa/ })).toBeVisible({ timeout: 30_000 })
    await expect(page.getByRole('button', { name: /Gõ lại/ })).toBeVisible()
    // Câu hỏi nghe: nút "Nghe lại" + 4 đáp án lựa chọn.
    await expect(page.getByRole('button', { name: /Nghe lại/ })).toBeVisible()
    const options = page.locator('button').filter({ hasText: /.+/ })
    await expect(options).not.toHaveCount(0)
  })

  test('chọn đáp án đúng/sai → hiện màu phản hồi, bấm tiếp tục sang câu sau', async ({ page }) => {
    await muteTts(page)
    await mockLogin(page, 'vi')
    await page.goto('/lo-trinh-hoc/a1?tab=listening', { waitUntil: 'domcontentloaded' })
    // Xem ghi chú ở đầu file — expect đầu tiên sau `goto` chịu chi phí tải nguội thật.
    await expect(page.getByRole('button', { name: /Nghe lại/ })).toBeVisible({ timeout: 30_000 })
    // Bấm đáp án đầu tiên trong danh sách lựa chọn (dưới khối câu hỏi) — không quan
    // trọng đúng/sai, chỉ cần xác nhận có phản hồi + nút "Câu tiếp theo"/"Xem kết quả".
    const answerButtons = page.locator('.space-y-2\\.5 button')
    await answerButtons.first().click()
    await expect(page.getByRole('button', { name: /Câu tiếp theo|Xem kết quả/ })).toBeVisible()
  })

  test('chuyển sang "Gõ lại" → hiện ô nhập + nút Kiểm tra, gõ đúng câu → báo điểm cao', async ({
    page,
  }) => {
    await muteTts(page)
    await mockLogin(page, 'vi')
    await page.goto('/lo-trinh-hoc/a1?tab=listening', { waitUntil: 'domcontentloaded' })
    // Nút "Gõ lại" là nút CHUYỂN TAB (chưa cần render xong nội dung), nhưng bấm nó ở đây
    // vẫn rơi vào cùng cửa sổ tải nguội — Playwright tự đợi ẩn ẢNH click tới khi nút actionable.
    await page.getByRole('button', { name: /Gõ lại/ }).click({ timeout: 30_000 })

    const textarea = page.getByPlaceholder(/Gõ lại câu vừa nghe/)
    // Xem ghi chú ở đầu file — expect đầu tiên sau `goto` chịu chi phí tải nguội thật.
    await expect(textarea).toBeVisible({ timeout: 30_000 })
    // .last(): trang cấp CEFR còn có tab "Kiểm tra" (quiz) trùng tên ở thanh tab trên
    // đầu — nút submit của dictation nằm SAU trong DOM nên .last() luôn trúng đúng nút.
    const checkBtn = page.getByRole('button', { name: /^Kiểm tra$/ }).last()
    await expect(checkBtn).toBeDisabled() // chưa gõ gì → không bấm được

    // Không biết trước nội dung câu (random) — gõ bừa để xác nhận LUỒNG chấm điểm
    // chạy được (không throw, hiện % + câu đúng), không assert điểm cụ thể.
    await textarea.fill('một câu trả lời bất kỳ để kiểm tra luồng chấm điểm')
    await checkBtn.click()
    await expect(page.getByText(/%/)).toBeVisible()
    await expect(page.getByRole('button', { name: /Câu tiếp theo|Xem kết quả/ })).toBeVisible()
  })
})
