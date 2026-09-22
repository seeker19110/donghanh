import type { Page } from '@playwright/test'
import { mockLogin, type ThemeName } from './auth'
import { muteTts } from './tts'
import { freezeAnimations, waitForStableDom } from './axe'

// ──────────────────────────────────────────────────────────────────────────────
// MỘT NGUỒN SỰ THẬT cho "sáu màn mẫu" của goal learning-ux (spec S13 §③.1).
//
// Vì sao tách ra file này: ba nơi cần CÙNG danh sách màn và CÙNG cách dựng trạng
// thái — script chụp ảnh (`scripts/shots-learning-ux.ts`), cổng bố cục
// (`e2e/learning-ux-layout.spec.ts`) và cổng a11y trạng thái
// (`e2e/learning-ux-states.spec.ts`). Chép ba lần là ba lần lệch nhau.
//
// Route ở đây là ROUTE THẬT ĐANG CHẠY TRÊN `main`, không phải route đoán trước
// (spec S13 §③.5: "không đoán route"). Cột `source` ghi slice nào quyết route đó
// để audit Tầng 6b tra ngược được.
// ──────────────────────────────────────────────────────────────────────────────

export type ScreenId = 'today' | 'outline' | 'lesson' | 'tutor' | 'result' | 'progress'
export type StateId = 'empty' | 'loading' | 'data' | 'error' | 'feedback'
export type Width = 320 | 390 | 768 | 1440

export const WIDTHS: readonly Width[] = [320, 390, 768, 1440]
export const HEIGHTS: Record<Width, number> = { 320: 568, 390: 844, 768: 1024, 1440: 900 }

export const STATE_IDS: readonly StateId[] = ['empty', 'loading', 'data', 'error', 'feedback']

/**
 * Cách dựng một trạng thái.
 * - `route`  — cài `page.route(...)` TRƯỚC khi `goto`; không thao tác gì thêm.
 * - `action` — chạy SAU khi trang đã nạp (bấm, gõ, nộp bài). Được phép tự cài
 *   thêm `page.route` bên trong cho những request chưa xảy ra.
 * - `n/a`    — màn này KHÔNG có trạng thái đó trong thực tế; `reason` là bắt buộc
 *   để người đọc sau biết vì sao thiếu (chứ không phải quên).
 */
export type StateSetup =
  | { kind: 'route'; install: (page: Page) => Promise<void> }
  | { kind: 'action'; install: (page: Page) => Promise<void> }
  | { kind: 'n/a'; reason: string }

export type ScreenSpec = {
  id: ScreenId
  /** Nhãn tiếng Việt để in ra bảng/thông điệp lỗi. */
  label: string
  /** Route CHUẨN (khuôn `<mã>--<slug>` khi tham số là nội dung có tiêu đề — CLAUDE.md §7). */
  route: string
  /** Selector CTA chính — dùng cho phép đo "trong màn hình đầu ở 1440" (AC-3 phép 3). */
  primaryCta: string
  states: Record<StateId, StateSetup>
  /** Route lấy từ spec slice nào — để audit Tầng 6b tra được. */
  source: 'S06' | 'S07' | 'S08' | 'S10' | 'S11' | 'S12'
}

// ── Tiện ích dựng trạng thái ─────────────────────────────────────────────────

/**
 * Mọi endpoint mà sáu màn mẫu THẬT SỰ gọi, kèm thân đáp ứng ĐÚNG HÌNH DẠNG cho
 * hai thái cực "rỗng" và "có dữ liệu".
 *
 * Đo thật 2026-09-16: `TodayCard` đọc `/api/programming/progress`
 * (`lib/programmingProgress.ts:49`), KHÔNG phải `/api/learning/*`. Mock sai địa chỉ
 * thì trang rơi về nhánh "Chưa tải được tiến độ" và ba trạng thái rỗng/dữ-liệu/lỗi
 * ra ảnh giống hệt nhau (md5 trùng) — một cổng nhìn thì có mà đo thì không.
 */
const HOC_API: ReadonlyArray<{ glob: string; empty: unknown; data: unknown }> = [
  {
    glob: '**/api/programming/progress**',
    empty: { lessons: [] },
    data: {
      lessons: [
        { lessonId: 'p1-u4-l1', status: 'completed', completedAt: 1757894400000 },
        { lessonId: 'p1-u4-l2', status: 'in_progress', completedAt: null },
      ],
    },
  },
  {
    glob: '**/api/learning/**',
    empty: { ok: true, items: [] },
    data: {
      ok: true,
      items: [
        {
          subjectId: 'physics',
          contentId: 'ly10-c2-b10',
          activityKind: 'stem_lesson_check',
          status: 'completed',
          scoreRatio: 0.9,
          recordedAt: '2026-09-15T00:00:00.000Z',
        },
      ],
    },
  },
]

const AGENT_API = '**/api/agent**'

const json = (body: unknown) => ({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify(body),
})

/** Trả đáp ứng rỗng trên MỌI endpoint học — màn "chưa có gì". */
async function mockEmpty(page: Page): Promise<void> {
  for (const { glob, empty } of HOC_API) {
    await page.route(glob, (route) => route.fulfill(json(empty)))
  }
}

/** Trả đáp ứng CÓ dữ liệu trên mọi endpoint học. */
async function mockData(page: Page): Promise<void> {
  for (const { glob, data } of HOC_API) {
    await page.route(glob, (route) => route.fulfill(json(data)))
  }
}

/** Giữ request treo → trang đứng ở trạng thái đang tải (không bao giờ fulfill). */
function mockLoading(globs: readonly string[]) {
  return async (page: Page): Promise<void> => {
    for (const glob of globs) {
      await page.route(glob, async () => {
        // Không fulfill, không abort: đúng nghĩa "đang chờ mạng".
        await new Promise<void>(() => {})
      })
    }
  }
}

/** Lỗi server thật (500 + thân lỗi đúng hình dạng API dự án). */
function mockError(globs: readonly string[]) {
  return async (page: Page): Promise<void> => {
    for (const glob of globs) {
      await page.route(glob, (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Lỗi máy chủ (giả lập E2E)' }),
        }),
      )
    }
  }
}

const MOI_GLOB_HOC = HOC_API.map((x) => x.glob)

/** Trả một thân cố định cho một endpoint duy nhất (dùng cho `/api/agent`). */
function mockMot(glob: string, body: unknown) {
  return async (page: Page): Promise<void> => {
    await page.route(glob, (route) => route.fulfill(json(body)))
  }
}

/**
 * Trả lời hết câu tự kiểm tra rồi bấm "Nộp bài tự kiểm tra".
 * Dùng cho màn `result` — màn kết quả CHỈ tồn tại sau một lượt nộp thật, không
 * có route riêng (S11-3 render `ActivityResult` ngay trong trang bài).
 */
async function nopBaiTuKiemTra(page: Page): Promise<void> {
  const cauHoi = page.locator('ul li:has(> p:has-text("Câu "))')
  const soCau = await cauHoi.count()
  for (let i = 0; i < soCau; i += 1) {
    const cau = cauHoi.nth(i)
    const chon = cau.locator('button[aria-pressed]').first()
    if (await chon.count()) await chon.click()
    else await cau.locator('input').first().fill('x')
  }
  const nut = page.getByRole('button', { name: /Nộp bài tự kiểm tra|Đang nộp/ })
  if (await nut.count()) await nut.first().click()
}

/** Gửi một câu cho trợ giảng Companion (màn `tutor` chỉ có nội dung sau khi hỏi). */
async function hoiTroGiang(page: Page): Promise<void> {
  const o = page.locator('textarea, input[type="text"]').first()
  if (!(await o.count())) return
  await o.fill('Giải thích giúp mình bài này')
  await page.keyboard.press('Enter')
}

const AGENT_REPLY = {
  reply: 'Mình gợi ý thế này: đọc lại định nghĩa rồi thử ví dụ nhỏ trước.',
  message: 'Mình gợi ý thế này: đọc lại định nghĩa rồi thử ví dụ nhỏ trước.',
}

// ── Sáu màn mẫu ───────────────────────────────────────────────────────────────

export const LEARNING_UX_SCREENS: readonly ScreenSpec[] = [
  {
    id: 'today',
    label: 'Hôm nay (Trang chủ)',
    // S06 §7 Q4 chốt: "Hôm nay" sống ở `/`, KHÔNG tạo route `/hom-nay`.
    route: '/',
    primaryCta: 'main a[href], main button',
    source: 'S06',
    states: {
      empty: { kind: 'route', install: mockEmpty },
      loading: { kind: 'route', install: mockLoading(MOI_GLOB_HOC) },
      data: { kind: 'route', install: mockData },
      error: { kind: 'route', install: mockError(MOI_GLOB_HOC) },
      feedback: {
        kind: 'n/a',
        reason:
          'Trang chủ chỉ GỢI Ý việc học tiếp, không chấm gì — phản hồi thuộc màn kết quả (result).',
      },
    },
  },
  {
    id: 'outline',
    label: 'Mục lục khoá/môn',
    // S07-2: khoá ngắn Git có rail/panel mục lục đầy đủ.
    route: '/lap-trinh/khoa-hoc/git--git-github-thuc-hanh',
    primaryCta: 'main a[href*="/lap-trinh/bai-hoc"]',
    source: 'S07',
    states: {
      empty: { kind: 'route', install: mockEmpty },
      loading: { kind: 'route', install: mockLoading(MOI_GLOB_HOC) },
      data: { kind: 'route', install: mockData },
      error: { kind: 'route', install: mockError(MOI_GLOB_HOC) },
      feedback: {
        kind: 'n/a',
        reason: 'Mục lục là màn điều hướng — không có bước nộp nên không có phản hồi chấm.',
      },
    },
  },
  {
    id: 'lesson',
    label: 'Màn học (bài STEM)',
    route: '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do',
    primaryCta: 'main button',
    source: 'S08',
    states: {
      empty: { kind: 'route', install: mockEmpty },
      loading: { kind: 'route', install: mockLoading(MOI_GLOB_HOC) },
      data: { kind: 'route', install: mockData },
      error: { kind: 'route', install: mockError(MOI_GLOB_HOC) },
      feedback: {
        kind: 'n/a',
        reason: 'Phản hồi sau khi nộp được chụp ở màn `result` (cùng trang, sau hành động nộp).',
      },
    },
  },
  {
    id: 'tutor',
    label: 'Trợ giảng (Bạn Đồng Hành)',
    // S10-2 (trợ giảng TRONG bài) chưa merge lúc viết file này → dùng route trợ
    // giảng ĐANG CÓ THẬT trên main, đúng cột "Route hiện có gần nhất" của spec S13
    // §③.1. Khi S10-2 merge, đổi route ở ĐÚNG MỘT chỗ này.
    route: '/ban-dong-hanh',
    primaryCta: 'main button',
    source: 'S10',
    states: {
      empty: {
        kind: 'route',
        install: mockEmpty,
      },
      loading: {
        kind: 'action',
        install: async (page) => {
          await mockLoading([AGENT_API])(page)
          await hoiTroGiang(page)
        },
      },
      data: {
        kind: 'action',
        install: async (page) => {
          await mockMot(AGENT_API, AGENT_REPLY)(page)
          await hoiTroGiang(page)
        },
      },
      error: {
        kind: 'action',
        install: async (page) => {
          await mockError([AGENT_API])(page)
          await hoiTroGiang(page)
        },
      },
      feedback: {
        kind: 'action',
        install: async (page) => {
          await mockMot(AGENT_API, AGENT_REPLY)(page)
          await hoiTroGiang(page)
        },
      },
    },
  },
  {
    id: 'result',
    label: 'Kết quả sau hoạt động',
    // S11-3: `ActivityResult` render NGAY TRONG trang bài sau khi nộp — không có
    // route riêng. Route ở đây trùng `lesson` là ĐÚNG THỰC TẾ, không phải lỗi sao chép.
    route: '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do',
    primaryCta: 'main button',
    source: 'S11',
    states: {
      empty: {
        kind: 'n/a',
        reason: 'Màn kết quả chỉ tồn tại SAU một lượt nộp — không có trạng thái rỗng.',
      },
      loading: {
        kind: 'action',
        install: async (page) => {
          await mockLoading(['**/api/learning/evidence**'])(page)
          await nopBaiTuKiemTra(page)
        },
      },
      data: {
        kind: 'action',
        install: async (page) => {
          await mockMot('**/api/learning/evidence**', {
            ok: true,
            status: 'completed',
            scoreRatio: 1,
          })(page)
          await nopBaiTuKiemTra(page)
        },
      },
      error: {
        kind: 'action',
        install: async (page) => {
          await mockError(['**/api/learning/evidence**'])(page)
          await nopBaiTuKiemTra(page)
        },
      },
      feedback: {
        kind: 'action',
        install: async (page) => {
          // Khác `data` ở chỗ: lượt nộp CHƯA ĐẠT → màn kết quả phải nói rõ sai ở đâu.
          await mockMot('**/api/learning/evidence**', {
            ok: true,
            status: 'attempted',
            scoreRatio: 0.2,
          })(page)
          await nopBaiTuKiemTra(page)
        },
      },
    },
  },
  {
    id: 'progress',
    label: 'Tiến độ',
    route: '/tien-do',
    primaryCta: 'main a[href], main button',
    source: 'S12',
    states: {
      empty: { kind: 'route', install: mockEmpty },
      loading: { kind: 'route', install: mockLoading(MOI_GLOB_HOC) },
      data: { kind: 'route', install: mockData },
      error: { kind: 'route', install: mockError(MOI_GLOB_HOC) },
      feedback: {
        kind: 'n/a',
        reason:
          'Trang tiến độ chỉ TỔNG HỢP bằng chứng đã có; không có bước chấm nên không có phản hồi.',
      },
    },
  },
]

// ── Runner dùng chung cho script chụp + hai cổng E2E ─────────────────────────

/**
 * Mở một ô (màn × trạng thái) đúng một cách duy nhất.
 *
 * Trả `false` khi ô đó là `n/a` (bên gọi bỏ qua, không coi là lỗi).
 *
 * Bắt buộc dùng `mockLogin` THẬT — KHÔNG tự gieo `localStorage` để giả đăng nhập
 * (bẫy đã ghi ở QUY-TRINH-AUDIT Tầng 8b: gieo tay thì thiếu mock `/api/auth?action=me`
 * và trang rơi về màn đăng nhập, ảnh chụp ra trông "đúng" nhưng là màn khác).
 */
export async function moManHinh(
  page: Page,
  man: ScreenSpec,
  state: StateId,
  theme: ThemeName = 'dark-blue',
): Promise<boolean> {
  const setup = man.states[state]
  if (setup.kind === 'n/a') return false

  await mockLogin(page, 'vi', theme)
  await muteTts(page)
  if (setup.kind === 'route') await setup.install(page)

  await page.goto(man.route, { waitUntil: 'domcontentloaded' })
  // Chờ VỎ TRANG THẬT trước khi chờ DOM đứng yên. Lý do (đo 2026-09-16, S13-2):
  // mọi trang đều `lazyWithRetry(() => import(...))`, nên trong lúc chunk chưa về,
  // React dựng Suspense fallback — một khung skeleton TĨNH. `waitForStableDom` thấy
  // số phần tử không đổi liền báo "ổn định" và trả về SỚM, khi trang thật chưa mount:
  // cổng bố cục đọc được `0 <h1>` ở 320/390 (đỏ giả, 3/3 lượt) trong khi 768/1440 lại
  // xanh vì chunk về kịp. Chờ `<main>` gắn vào DOM là mốc "trang thật đã mount".
  await page
    .locator('main')
    .first()
    .waitFor({ state: 'attached', timeout: 15_000 })
    .catch(() => {
      // Không ném: có màn hợp lệ không dựng `<main>` (lỗi tải chunk thật, màn khoá…).
      // Phép đo của cổng gọi sau sẽ tự đỏ với thông điệp của chính nó.
    })
  await waitForStableDom(page)

  if (setup.kind === 'action') {
    await setup.install(page)
    await waitForStableDom(page)
  }
  // Đóng băng animation/transition SAU KHI DOM đã ổn định — cùng thứ tự `scan()` ở
  // `e2e/a11y.spec.ts` dùng. Thiếu bước này, ảnh chụp có thể rơi đúng khung giữa của
  // `animate-fade-in`/`fade-up` (opacity/translate chưa về trạng thái cuối): phát
  // hiện được ở đợt 0416 khi diff Tầng 8b báo lệch chiều cao ~16-24px và độ mờ khác
  // nhau CHỈ ở ba màn có phần tử `animate-*` (`today`, `outline`, `tutor`) — không
  // phải hồi quy bố cục của bản nâng cấp, mà là lỗ hổng có sẵn của chính công cụ này.
  await freezeAnimations(page)
  return true
}

/** Số ô (màn × trạng thái) thật sự chụp/quét được — trừ các ô `n/a`. */
export function demOKhaDung(): number {
  return LEARNING_UX_SCREENS.reduce(
    (tong, man) => tong + STATE_IDS.filter((s) => man.states[s].kind !== 'n/a').length,
    0,
  )
}
