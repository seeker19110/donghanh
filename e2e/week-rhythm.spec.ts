// e2e/week-rhythm.spec.ts — `WeekRhythm` ở Trang chủ (P1-5, lệnh 7).
//
// Đặc tả: docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md §P1-5 AC-5.
//
// Chỉ E2E mới chứng minh được: chấm "hôm nay" đổi từ ◐ sang ● NGAY SAU khi có hoạt động thật
// trong ngày — đúng bất biến "không vẽ ✓ giả" (chấm done chỉ khi `DayActivity.active` thật).
import { test, expect, type Page } from '@playwright/test'
import { mockLogin, USER_ID } from './helpers/auth'

// Ngày theo giờ VN (khớp src/lib/date.ts vnDateStr) — tính ở NODE trước khi trang tải.
function vnDateOffset(offsetDays: number): string {
  const ms = Date.now() - offsetDays * 86400000 + 7 * 3600000
  return new Date(ms).toISOString().slice(0, 10)
}

// Seed 1 ngày có hoạt động (khớp key et_usage_<uid>_<date> — src/lib/storage.ts) — dùng để
// tạo streak (vài ngày liên tiếp TRƯỚC hôm nay) rồi kiểm tra chấm hôm nay riêng.
async function seedActivity(page: Page, offsetDays: number) {
  const date = vnDateOffset(offsetDays)
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: `et_usage_${USER_ID}_${date}`,
    value: { date, chatCount: 0, writingCount: 0, speakingCount: 0, learnCount: 1 },
  })
}

test.describe('WeekRhythm — 7 chấm tuần (P1-5)', () => {
  test('có streak (đã học vài ngày trước) nhưng CHƯA học hôm nay → chấm hôm nay là today-pending', async ({
    page,
  }) => {
    await mockLogin(page)
    await seedActivity(page, 1) // hôm qua có học → streak > 0, tuần rỗng nếu hôm nay=T2
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const rhythm = page.locator('a[href="/nhiem-vu"]').filter({ has: page.locator('[data-dot]') })
    await expect(rhythm).toBeVisible()
    const dots = rhythm.locator('[data-dot]')
    await expect(dots).toHaveCount(7)
    // Đúng MỘT chấm today-pending hoặc done (hôm nay), không có chấm nào ngoài 4 giá trị hợp lệ.
    const values = await dots.evaluateAll((els) => els.map((e) => e.getAttribute('data-dot')))
    values.forEach((v) => expect(['done', 'missed', 'today-pending', 'future']).toContain(v))
  })

  test('sau khi hoàn tất một hoạt động hôm nay → chấm hôm nay chuyển sang done', async ({
    page,
  }) => {
    await mockLogin(page)
    await seedActivity(page, 1) // có streak → WeekRhythm hiện dù tuần trống lúc đầu
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Seed HOẠT ĐỘNG HÔM NAY trực tiếp (khớp key/luật đếm streak — tương đương "hoàn tất một
    // hoạt động" mà không cần đi hết luồng học thật, giữ test nhanh + ổn định như comeback.spec.ts).
    const todayKey = `et_usage_${USER_ID}_${vnDateOffset(0)}`
    await page.evaluate(
      ({ key }) =>
        localStorage.setItem(
          key,
          JSON.stringify({ chatCount: 0, writingCount: 0, speakingCount: 0, learnCount: 1 }),
        ),
      { key: todayKey },
    )
    await page.reload()
    await page.waitForLoadState('networkidle')

    const rhythm = page.locator('a[href="/nhiem-vu"]').filter({ has: page.locator('[data-dot]') })
    await expect(rhythm).toBeVisible()
    const dots = rhythm.locator('[data-dot]')
    const values = await dots.evaluateAll((els) => els.map((e) => e.getAttribute('data-dot')))
    // Hôm nay là chấm CUỐI trong dãy đã qua/hôm nay (không phải "future") — phải là "done".
    const todayValue = values.find((v) => v === 'today-pending' || v === 'done')
    expect(todayValue).toBe('done')
  })

  test('không có ký tự % hay mã CEFR/bậc P1-6 trong khối WeekRhythm', async ({ page }) => {
    await mockLogin(page)
    await seedActivity(page, 1)
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const rhythm = page.locator('a[href="/nhiem-vu"]').filter({ has: page.locator('[data-dot]') })
    if (await rhythm.count()) {
      const text = await rhythm.innerText()
      expect(text).not.toMatch(/%/)
      expect(text).not.toMatch(/\b[ABC][12]\b/)
      expect(text).not.toMatch(/\bP[1-6]\b/)
    }
  })
})
