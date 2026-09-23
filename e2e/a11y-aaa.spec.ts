import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockLogin, type ThemeName } from './helpers/auth'
import { openLiveLocationTrip } from './helpers/location'
import { freezeAnimations, waitForStableDom } from './helpers/axe'
import { collectAaaFindings } from './helpers/aaaFindings'

// ─────────────────────────────────────────────────────────────────────────────
// QUÉT WCAG 2.x mức AAA — bổ sung cho e2e/a11y.spec.ts (file kia gác mức A/AA).
//
// LUẬT DỰ ÁN (CLAUDE.md mục 4.5), theo khuyến nghị của W3C:
//   - W3C (Understanding Conformance) KHÔNG khuyến nghị lấy AAA làm chính sách cho
//     TOÀN site vì có loại nội dung không thể đạt hết AAA.
//   - Nên: **NỘI DUNG và TIÊU ĐỀ** (chữ để đọc: h1–h6, p, li, bảng, blockquote…) phải
//     đạt **AAA** (tương phản ≥ 7:1); mọi phần còn lại (nav, nút, badge, ô nhập, biểu
//     tượng…) phải đạt **AA** — cổng AA tuyệt đối 0 vi phạm ở e2e/a11y.spec.ts.
//
// Cổng này TUYỆT ĐỐI: 0 vi phạm AAA trên nội dung/tiêu đề, 15 trang × 5 theme.
// Nợ tương phản cũ (~305 phần tử) đã xử lý xong ngày 2026-08-04 bằng cách chỉnh token
// --z-300/--z-400 của cả 5 theme (xem apps/dhcb/src/index.css + PROGRESS.md), nên
// KHÔNG còn baseline nào — thêm màn hình mới mà rớt 7:1 là fail ngay.
// ─────────────────────────────────────────────────────────────────────────────

const AAA_TAGS = ['wcag2aaa', 'wcag21aaa', 'wcag22aaa']

// Quét CẢ 5 theme (4 theme chính + "Nhi đồng") vì tương phản phụ thuộc bộ token màu.
const THEMES: ThemeName[] = ['dark-blue', 'blue-sky', 'kid']

const ROUTES = [
  '/login',
  '/',
  '/tien-do',
  '/tu-dien',
  '/bai-hoc',
  '/lich-su-hoc',
  '/cau-thong-dung',
  '/lo-trinh-hoc',
  '/lo-trinh-hoc/a1', // trang riêng cấp CEFR (6 cấp dùng chung layout)
  '/lo-trinh-hoc/c1', // cấp nâng cao (accent rose) — gồm cả màn khóa
  '/tro-truyen',
  '/luyen-viet',
  '/luyen-noi',
  '/cai-dat',
  '/thu-thach',
  '/lap-trinh', // môn Lập trình: tổng quan P1–P6 (PR-L1)
  '/lap-trinh/p1', // trang một bậc, bản PHẲNG (P1–P5 dùng chung layout)
  '/lap-trinh/p6', // trang một bậc, bản CÓ CHIA MẠCH (PR-M12) — thêm tầng tiêu đề h3 + mô tả mạch
  '/lap-trinh/chay-thu', // sandbox chạy Python (PR-L2)
  '/lap-trinh/bai-hoc/p1-u4-l1', // bài học 8 bước (PR-L3)
  '/lap-trinh/du-an', // dự án trục chặng P1 (PR-L3b)
  '/so-tay-loi-sai', // sổ lỗi: bộ lọc môn + nhãn bằng chứng + nút "Ôn lại" (S12-2)
  '/lap-trinh/on-tap', // ôn thẻ SRS môn Lập trình (PR-L10) — màn rỗng khi chưa có thẻ
  '/goc-hoc-tap/on-tap', // hub ôn tập xuyên môn (S12-1) — màn rỗng khi chưa có gì đến hạn
  '/goc-hoc-tap/physics/on-tap', // ôn thẻ một môn STEM (S12-1) — bốn môn dùng chung layout
  '/lap-trinh/gioi-thieu', // mô tả khoá học & mục tiêu (PR-UX3) — trang gần như toàn chữ đọc
  '/lap-trinh/huong', // danh sách 13 hướng chuyên sâu (PR-L-SPEC)
  '/lap-trinh/huong/web--lap-trinh-web', // chi tiết một hướng — trang chữ dài, nhiều tương phản
  '/lap-trinh/huong/architecture--kien-truc-he-thong-dac-ta-cho-ai-thi-hanh', // hướng kiến trúc — trang chi tiết dài nhất, nhiều danh sách chữ
  '/lap-trinh/huong/web--lap-trinh-web/web-s2--full-stack-co-backend-cua-minh', // trang CHẶNG: mục tiêu, tự kiểm, rubric, đặc tả 6 ô
  '/lap-trinh/khoa-hoc/git--git-github-thuc-hanh', // khoá ngắn Git & GitHub (PR 3/4 khoá Git) — cắt ngang bậc
  '/lap-trinh/bai-hoc/p3-u10-l1?khoa=git', // [S07-2] bài mở theo ngữ cảnh khoá — mục lục là cây khoá
  // [2026-09-13] Bốn môn STEM nối vào app. Trang bài học gần như toàn chữ đọc nên AAA là
  // chuẩn đúng cho nó; quét một môn đại diện vì cả bốn dùng chung một khuôn trang.
  '/goc-hoc-tap/physics/bai-hoc', // danh sách bài
  '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do', // một bài đầy đủ, có hoạt ảnh
  // [S13-1] Màn trợ giảng — một trong sáu màn mẫu của goal learning-ux
  // (`e2e/helpers/learningUxScreens.ts`, màn `tutor`). Đã có ở cổng AA nhưng thiếu ở
  // AAA: đây là màn ĐỌC (lời giải thích của trợ giảng) nên AAA là chuẩn đúng cho nó.
  '/ban-dong-hanh',
  '/goc-hoc-tap/english/luyen-nghe', // audit 2026-09-22 P0-1: nhóm gập + tìm kiếm + Xem thêm
] as const

async function scanAaa(page: Page) {
  await freezeAnimations(page)
  const results = await new AxeBuilder({ page }).withTags(AAA_TAGS).analyze()
  // Axe AAA bỏ qua ratio chưa xác định do minThreshold; rule AA cung cấp incomplete.
  const contrast = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
  return collectAaaFindings(page, {
    violations: results.violations,
    incomplete: [...results.incomplete, ...contrast.incomplete],
  })
}

for (const theme of THEMES) {
  for (const route of ROUTES) {
    test(`a11y AAA (nội dung + tiêu đề): ${route} theme=${theme}`, async ({ page }) => {
      await mockLogin(page, 'vi', theme)
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      // Dữ liệu curriculum/từ điển tính OFFLINE ở client (networkidle không giúp) nên
      // chờ cố định cho render xong — cùng cách làm với e2e/a11y.spec.ts.
      // Chờ theo TRẠNG THÁI, không theo thời gian — xem lý do ở `waitForStableDom`.
      await waitForStableDom(page)

      const violated = await scanAaa(page)
      expect(
        violated,
        `Vi phạm WCAG AAA trên nội dung/tiêu đề ở ${route} theme=${theme} — ` +
          `chữ nội dung phải đạt tương phản ≥ 7:1 (chỉnh token màu ở apps/dhcb/src/index.css).`,
      ).toEqual([])
    })
  }
}

// Khối duyệt chuyên môn (chỉ admin, cuối trang bài học) mang thêm mấy đoạn <p> hướng dẫn —
// đúng loại "nội dung để đọc" nên phải qua cổng AAA này, không chỉ cổng AA.
for (const theme of THEMES) {
  test(`a11y AAA: khối duyệt trong bài học (admin) theme=${theme}`, async ({ page }) => {
    await mockLogin(page, 'vi', theme, { isAdmin: true })
    await page.route('**/api/admin-stem-review**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"luotDuyet":[]}' }),
    )
    await page.goto('/goc-hoc-tap/biology/bai-hoc/sinh12-c1-b1--nhan-doi-adn', {
      waitUntil: 'domcontentloaded',
    })
    await waitForStableDom(page)
    await page.getByRole('button', { name: /Duyệt chuyên môn bài này/ }).click()
    await expect(page.getByRole('textbox', { name: /Tên người duyệt/ })).toBeVisible()

    const violated = await scanAaa(page)
    expect(violated, `Vi phạm WCAG AAA trên nội dung khối duyệt theme=${theme}.`).toEqual([])
  })
}

// Khối AI phản hồi code (PR-L5) chỉ hiện ở bước "Tự viết" sau khi gọi API → vòng quét theo
// ROUTES ở trên không thấy. Quét riêng đúng trạng thái đó, đủ 5 theme.
for (const theme of THEMES) {
  test(`a11y AAA (nội dung + tiêu đề): AI xem code (Lập trình) theme=${theme}`, async ({
    page,
  }) => {
    await page.route('**/api/programming/feedback', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          text: 'Đề bài muốn in ra số tiền điện. Bạn thử đọc lại xem mốc 50 kWh đầu tính giá nào nhé?',
          kind: 'socratic_hint',
          hintLevel: 1,
        }),
      }),
    )
    await mockLogin(page, 'vi', theme)
    await page.goto('/lap-trinh/bai-hoc/p1-u4-l1', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Tự viết' }).click()
    await page.getByRole('button', { name: /Gợi ý bậc/ }).click()
    await expect(page.getByText(/mốc 50 kWh đầu/)).toBeVisible()

    const violated = await scanAaa(page)
    expect(violated, `Vi phạm WCAG AAA trên khối AI phản hồi code, theme=${theme}.`).toEqual([])
  })
}

// Màn "Đi chung" khi ĐANG TRONG CHUYẾN — cũng nằm ngoài vòng quét theo ROUTES ở trên vì
// giao diện chỉ dựng sau khi có dữ liệu chuyến. Fixture dùng chung với cổng A/AA.
for (const theme of THEMES) {
  test(`a11y AAA (nội dung + tiêu đề): Đi chung — trong chuyến theme=${theme}`, async ({
    page,
  }) => {
    await openLiveLocationTrip(page, theme)
    const violated = await scanAaa(page)
    expect(
      violated,
      `Vi phạm WCAG AAA trên nội dung/tiêu đề ở /nhom-di-chung theme=${theme} — ` +
        `chữ nội dung phải đạt tương phản ≥ 7:1 (chỉnh token màu ở apps/dhcb/src/index.css).`,
    ).toEqual([])
  })
}

// ── [S11-3] Màn KẾT QUẢ sau khi nộp bài tự kiểm tra STEM ────────────────────────────
// Chỉ hiện SAU một lượt POST nên vòng quét theo route ở trên không bao giờ thấy nó. Quét
// trạng thái "nộp KHÔNG đạt" vì đó là trạng thái vẽ ra NHIỀU thứ nhất: câu tổng kết, dòng
// ngưỡng, danh sách từng câu kèm lý do sai và lời giảng, nút "Làm lại", liên kết "Bài tiếp theo".
const BAI_STEM = '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do'

/** Server chấm lại và trả "chưa đạt" — chữ trên màn hình là chữ của SERVER (S11 §⑤). */
async function mockNopChuaDat(page: Page) {
  await page.route('**/api/learning/evidence*', (route) => {
    if (route.request().method() !== 'POST') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"state":[]}' })
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        schemaVersion: 1,
        subjectId: 'physics',
        contentId: 'ly10-c2-b10',
        activityKind: 'stem_lesson_check',
        attemptId: 'attempt-0123456789abcd',
        clientAt: '2026-09-16T00:00:00.000Z',
        ownerId: 'u-1',
        evidenceKind: 'server_graded',
        correct: 1,
        total: 4,
        ratio: 0.25,
        passed: false,
        serverAt: '2026-09-16T00:00:01.000Z',
        items: [
          { questionIndex: 0, correct: true, reason: 'CORRECT' },
          { questionIndex: 1, correct: false, reason: 'MISSING_UNIT' },
          { questionIndex: 2, correct: false, reason: 'WRONG_VALUE' },
          { questionIndex: 3, correct: false, reason: 'EMPTY' },
        ],
      }),
    })
  })
}

/** Trả lời hết mọi câu rồi nộp, chờ màn kết quả hiện ra theo TRẠNG THÁI (không theo thời gian). */
async function nopBaiStem(page: Page) {
  const cauHoi = page.locator('h2:has-text("Tự kiểm tra") + ul > li')
  await expect(cauHoi.first()).toBeVisible()
  for (let i = 0; i < (await cauHoi.count()); i += 1) {
    const li = cauHoi.nth(i)
    const o = li.locator('input[id^="tra-loi-"]')
    if ((await o.count()) > 0) await o.fill('20 m/s')
    else await li.getByRole('button').first().click()
  }
  await page.getByRole('button', { name: 'Nộp bài tự kiểm tra' }).click()
  await expect(page.getByRole('region', { name: 'Kết quả lượt nộp' })).toBeVisible()
}

for (const theme of THEMES) {
  test(`a11y AAA (nội dung + tiêu đề): màn kết quả bài STEM (đã nộp) theme=${theme}`, async ({
    page,
  }) => {
    await mockNopChuaDat(page)
    await mockLogin(page, 'vi', theme)
    await page.goto(BAI_STEM, { waitUntil: 'domcontentloaded' })
    await waitForStableDom(page)
    await nopBaiStem(page)
    const violated = await scanAaa(page)
    expect(violated, `Vi phạm WCAG AAA trên màn kết quả bài STEM, theme=${theme}.`).toEqual([])
  })
}

// Controls chạy qua cùng collector của gate, không cần server/provider.
test.describe('S06a negative controls', () => {
  test('bắt chữ inline, link văn xuôi và heading trong header; giữ AA cho nút', async ({
    page,
  }) => {
    await page.setContent(`
      <html lang="vi"><head><title>Control</title></head><body style="background:white">
      <main style="font:16px Arial;color:#666">
        <p><span id="span">Chữ đọc trong span</span></p>
        <p><em id="em">Chữ đọc trong em</em></p>
        <p><a id="link" href="#" style="color:inherit">Liên kết trong văn xuôi</a></p>
        <header><h2 style="font:16px Arial"><span id="heading">Tiêu đề đọc</span></h2></header>
        <nav><p><a href="#" style="color:inherit"><span id="nav">Nhãn điều hướng</span></a></p></nav>
        <button id="button" style="font:16px Arial;color:#666;background:white">Nút AA</button>
        <p id="pass" style="color:#333">Chữ đạt AAA</p>
      </main></body></html>
    `)
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast-enhanced', 'color-contrast'])
      .analyze()
    const findings = await collectAaaFindings(page, results)
    for (const id of ['span', 'em', 'link', 'heading']) {
      expect(
        findings.some((finding) => finding.includes(`#${id}`)),
        id,
      ).toBe(true)
    }
    expect(findings.some((finding) => finding.includes('#button'))).toBe(false)
    expect(findings.some((finding) => finding.includes('#pass'))).toBe(false)
    expect(findings.some((finding) => finding.includes('#nav'))).toBe(false)
  })

  test('không bỏ qua target biến mất, target lồng hoặc incomplete thật', async ({ page }) => {
    await page.setContent(`
      <html lang="vi"><head><title>Control</title></head><body>
      <p id="gradient" style="color:black;background:linear-gradient(white,black)">Nền chưa kết luận</p>
      <p id="removed" style="color:#666;background:white">Chữ sẽ biến mất</p>
      </body></html>
    `)
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast-enhanced', 'color-contrast'])
      .analyze()
    expect(results.incomplete.flatMap((rule) => rule.nodes).length).toBeGreaterThan(0)
    await page.locator('#removed').evaluate((el) => el.remove())
    const findings = await collectAaaFindings(page, results)
    expect(findings.some((finding) => finding.startsWith('incomplete:'))).toBe(true)
    expect(findings.some((finding) => finding.includes('missing target'))).toBe(true)
    const rule = results.violations[0]
    if (!rule || !rule.nodes[0]) throw new Error('Control phải sinh violation có node')
    const nested = await collectAaaFindings(page, {
      incomplete: [],
      violations: [{ ...rule, nodes: [{ ...rule.nodes[0], target: ['#frame', '#child'] }] }],
    })
    expect(nested).toEqual([expect.stringContaining('unsupported target')])
    expect(nested[0]).toContain('["#frame","#child"]')
    const empty = await collectAaaFindings(page, {
      violations: [],
      incomplete: [{ ...rule, nodes: [] }],
    })
    expect(empty).toEqual([expect.stringContaining('no target evidence')])
  })
})
