// e2e/today-plan.spec.ts — thẻ "Hôm nay" ở Trang chủ (slice S06-2).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md §④ AC-10..AC-14.
//
// Ba thứ chỉ E2E mới chứng minh được, và cả ba đều là bất biến sản phẩm:
//   1. Từ Trang chủ tới màn học đúng MỘT cú bấm, và chỉ có MỘT nút chính để bấm.
//   2. Người chưa có tín hiệu nào KHÔNG bị đẩy vào lộ trình tiếng Anh (bản trước của
//      `HomeAiBriefingCard` hard-code `/lo-trinh-hoc`).
//   3. Tính "Hôm nay" không sinh ra một lượt gọi AI tính phí nào — đây là tiền thật.
import { test, expect, type Page } from '@playwright/test'
import { mockLogin, USER_ID } from './helpers/auth'

const AI_ENDPOINTS = /\/api\/(agent|companion|tts|stt|chat)/

/** Đếm request SINH NỘI DUNG AI (khuôn của e2e/home-quick-ask.spec.ts: chỉ tính không phải GET). */
function watchAiCalls(page: Page): string[] {
  const calls: string[] = []
  page.on('request', (req) => {
    if (req.method() !== 'GET' && AI_ENDPOINTS.test(req.url())) {
      calls.push(`${req.method()} ${req.url()}`)
    }
  })
  return calls
}

/** Phiên học dở của môn Lập trình (khoá Git) — đúng khuôn khoá `dhcb_lsession_v1_*`. */
async function seedPhienLapTrinh(page: Page) {
  await page.addInitScript((uid) => {
    const now = Date.now()
    localStorage.setItem(
      `dhcb_lsession_v1_account:${uid}_programming_p3-u10-l1`,
      JSON.stringify({
        version: 1,
        subjectId: 'programming',
        courseId: 'git',
        contentId: 'p3-u10-l1',
        contentVersion: 'v1',
        owner: { kind: 'account', id: uid },
        stepIndex: 2,
        stepLabel: 'Thuc hanh',
        draft: { code: 'git init' },
        startedAt: now - 600_000,
        updatedAt: now - 300_000,
      }),
    )
  }, USER_ID)
}

/**
 * [S06-3 · AC-19] Phiên học dở môn Tiếng Anh ở vòng từ vựng `greetings` (A1 · Chào hỏi & giới
 * thiệu bản thân — có thật trong `public/data/cefr.json`, nên `resumeTarget` tra ra `/lo-trinh-hoc/a1`).
 * `phutTruoc` để đặt phiên này trước/sau phiên Lập trình mà không phụ thuộc đồng hồ máy chạy test.
 */
async function seedPhienTiengAnh(page: Page, phutTruoc: number) {
  await page.addInitScript(
    (arg) => {
      localStorage.setItem(
        `dhcb_lsession_v1_account:${arg.uid}_english_greetings`,
        JSON.stringify({
          version: 1,
          subjectId: 'english',
          contentId: 'greetings',
          contentVersion: 'v1',
          owner: { kind: 'account', id: arg.uid },
          stepIndex: 1,
          stepLabel: 'Tu vung',
          // `draft` là khoá BẮT BUỘC của `LearningSessionSchema` (z.unknown() vẫn đòi có mặt):
          // thiếu nó thì `parseSession` trả `invalid` và phiên bị bỏ IM LẶNG — test sẽ đỏ ở
          // chỗ khác hẳn nguyên nhân. Phiên chưa có nháp thì để `null`.
          draft: null,
          startedAt: Date.now() - arg.phutTruoc * 60_000 - 60_000,
          updatedAt: Date.now() - arg.phutTruoc * 60_000,
        }),
      )
    },
    { uid: USER_ID, phutTruoc },
  )
}

/** Vài từ đã thuộc = tín hiệu môn Tiếng Anh (khoá `et_learned_<uid>`, src/lib/vocab.ts). */
async function seedTiengAnh(page: Page) {
  await page.addInitScript((uid) => {
    localStorage.setItem(`et_learned_${uid}`, JSON.stringify(['apple', 'book', 'cat']))
  }, USER_ID)
}

/** Tiến độ Lập trình từ server — `fail: true` để dựng ca lỗi mạng. */
async function gioLapTiendo(page: Page, options: { fail?: boolean } = {}) {
  await page.route('**/api/programming/progress', (route) =>
    options.fail
      ? route.fulfill({ status: 500, body: '{}' })
      : route.fulfill({ status: 200, body: JSON.stringify({ lessons: [] }) }),
  )
}

/** Nút chính của thẻ "Hôm nay" — tên luôn mở đầu bằng "Học tiếp"/"Bắt đầu" (AC-10). */
function ctaChinh(page: Page) {
  return page.getByRole('link', { name: /^(Học tiếp|Bắt đầu)/ })
}

function theHomNay(page: Page) {
  return page.getByRole('region', { name: 'Hôm nay' })
}

/**
 * Mở Trang chủ và CHỜ thẻ "Hôm nay" tính xong.
 *
 * Chờ tường minh chứ không dựa vào timeout mặc định 5 giây: máy CI chạy Vite dev, lần đầu vào
 * route nào cũng phải biên dịch, và thẻ có trạng thái "đang tải" hợp lệ — bỏ qua bước này thì
 * test đỏ vì chậm chứ không phải vì sai.
 */
async function moTrangChu(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(theHomNay(page)).toBeVisible({ timeout: 30_000 })
  await expect(theHomNay(page).locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 30_000 })
}

test('phiên Lập trình đang dở → MỘT nút "Học tiếp", một cú bấm là tới đúng bài dở', async ({
  page,
}) => {
  await seedPhienLapTrinh(page)
  await gioLapTiendo(page)
  await mockLogin(page, 'vi')
  const aiCalls = watchAiCalls(page)
  await moTrangChu(page)

  const cta = ctaChinh(page)
  await expect(cta).toHaveCount(1)
  await expect(cta).toContainText('Git')
  // Nguồn nói bằng CHỮ, không phải con số chẩn đoán.
  await expect(page.getByText(/Phiên đang dở ·/)).toBeVisible()

  await cta.click() // đúng MỘT thao tác từ "Hôm nay" tới màn học
  await expect(page).toHaveURL(/\/lap-trinh\/bai-hoc\/p3-u10-l1(--[a-z0-9-]+)?(\?khoa=git)?$/)
  expect(aiCalls).toEqual([])
})

test('người mới chưa có tín hiệu nào → mời CHỌN MÔN, không đẩy vào lộ trình tiếng Anh', async ({
  page,
}) => {
  await gioLapTiendo(page)
  await mockLogin(page, 'vi')
  await moTrangChu(page)

  const the = theHomNay(page)
  await expect(the.getByRole('link', { name: /^Bắt đầu/ })).toHaveCount(1)
  await expect(the.getByRole('link', { name: /^Bắt đầu/ })).toHaveAttribute('href', '/goc-hoc-tap')
  // Bất biến của slice: thẻ "Hôm nay" KHÔNG chứa lối vào lộ trình CEFR khi chưa có tín hiệu.
  await expect(the.locator('a[href^="/lo-trinh-hoc"]')).toHaveCount(0)
  await expect(the.locator('a[href^="/onboarding"]')).toHaveCount(0)
})

test('chỉ học tiếng Anh → CTA về đúng cấp CEFR đang học, vẫn chỉ MỘT nút chính', async ({
  page,
}) => {
  await seedTiengAnh(page)
  await gioLapTiendo(page)
  await mockLogin(page, 'vi')
  await moTrangChu(page)

  const cta = ctaChinh(page)
  await expect(cta).toHaveCount(1)
  await expect(cta).toHaveAttribute('href', /^\/lo-trinh-hoc\/[a-c][12]$/)
})

test('lỗi tải tiến độ → vẫn có CTA từ dữ liệu cục bộ + dòng "Thử lại"', async ({ page }) => {
  await seedPhienLapTrinh(page)
  await gioLapTiendo(page, { fail: true })
  await mockLogin(page, 'vi')
  await moTrangChu(page)

  await expect(ctaChinh(page)).toHaveCount(1)
  await expect(page.getByText('Chưa tải được tiến độ')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Thử lại' })).toBeVisible()
})

test('khách (chưa đăng nhập): thấy CTA của GuestHome, 0 lượt gọi AI', async ({ page }) => {
  // [P0-3, lệnh 4, 2026-09-17] Khách nay thấy `GuestHome` thay cho thẻ "Hôm nay" (không có tài
  // khoản để tính tiến độ) — chỉ Companion giới thiệu + ĐÚNG MỘT CTA vào `/bat-dau`. Bất biến gốc
  // của test này ("0 lượt gọi AI khi mở Trang chủ") vẫn còn nguyên giá trị, chỉ đổi cách kiểm.
  await gioLapTiendo(page)
  const aiCalls = watchAiCalls(page)
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('link', { name: 'Bắt đầu — chọn việc đầu tiên' })).toBeVisible()
  expect(aiCalls).toEqual([])
})

// ── [S06-3 · AC-19] Hai môn cùng có phiên dở: chọn theo phiên GẦN NHẤT, không xoay vòng ngầm.
//
// Đây là ca duy nhất chứng minh được "không mặc định tiếng Anh" ở mức mạnh nhất: cả hai môn đều
// có dấu vết thật, nên thứ tự phá hoà không cứu được — chỉ mốc thời gian mới quyết định đúng.

test('2 môn có phiên dở → phiên MỚI NHẤT làm việc chính, môn kia xuống mục phụ', async ({
  page,
}) => {
  await seedPhienLapTrinh(page) // updatedAt = now − 5 phút
  await seedPhienTiengAnh(page, 120) // updatedAt = now − 120 phút
  await gioLapTiendo(page)
  await mockLogin(page, 'vi')
  await moTrangChu(page)

  const cta = ctaChinh(page)
  await expect(cta).toHaveCount(1)
  await expect(cta).toContainText('Git')

  // Môn thứ hai vẫn có lối vào, nhưng là mục PHỤ và nói rõ nó thuộc môn nào.
  const phu = theHomNay(page).getByRole('listitem').filter({ hasText: 'Môn thứ hai: Tiếng Anh' })
  await expect(phu).toHaveCount(1)
  await expect(phu.getByRole('link')).toHaveAttribute('href', '/lo-trinh-hoc/a1')
})

test('đổi thứ tự thời gian → đổi việc chính (không phải môn nào cứng thắng)', async ({ page }) => {
  await seedPhienLapTrinh(page) // updatedAt = now − 5 phút
  await seedPhienTiengAnh(page, 1) // updatedAt = now − 1 phút → MỚI HƠN
  await gioLapTiendo(page)
  await mockLogin(page, 'vi')
  await moTrangChu(page)

  const cta = ctaChinh(page)
  await expect(cta).toHaveCount(1)
  await expect(cta).toHaveAttribute('href', '/lo-trinh-hoc/a1')
  await expect(cta).toContainText('Chào hỏi')
})
