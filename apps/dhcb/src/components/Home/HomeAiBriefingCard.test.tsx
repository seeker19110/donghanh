// apps/dhcb/src/components/Home/HomeAiBriefingCard.test.tsx — Cổng canh thẻ AI mở đầu trang chủ.
//
// VÌ SAO CẦN (đợt C thiết kế lại UI/UX, 2026-09-03): thẻ này là thứ đầu tiên người học nhìn
// thấy mỗi ngày. Trước đợt C nó mang 2 quầng sáng blur, gradient + bóng màu, một chấm "trực
// tuyến" nhấp nháy vĩnh viễn và nhãn HOA nhỏ giãn chữ — đúng bộ "tell" của UI do AI sinh mà
// mục 9 của `.agents/skills/ui-ux-craftsman` liệt kê. Mấy thứ này rất dễ quay lại theo từng
// PR nhỏ, nên canh bằng test render thật (happy-dom) ở cả trạng thái đang tải lẫn đã tải.
//
// [P0-2, 2026-09-17] Thêm ca canh `comeback` (gộp luồng "quay lại sau bỏ bẵng" vào bong bóng
// Companion, thay cho `.glass` card riêng ở `Home.tsx` cũ) + canh không còn import `Bot`.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import HomeAiBriefingCard, { type HomeComeback } from './HomeAiBriefingCard'

const fetchBriefing = vi.fn()
const speak = vi.fn()
vi.mock('../../lib/proactiveBriefingApi', () => ({
  fetchProactiveBriefing: () => fetchBriefing(),
}))
vi.mock('../../lib/tts', () => ({ speak: (...args: unknown[]) => speak(...args) }))
vi.mock('../../lib/analytics', () => ({ track: vi.fn() }))

// happy-dom không có sẵn cờ này; React 18 cần nó để act() không cảnh báo.
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root

async function render(props: Parameters<typeof HomeAiBriefingCard>[0]) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => {
    root.render(
      <MemoryRouter>
        <HomeAiBriefingCard {...props} isDesktop={props.isDesktop ?? false} />
      </MemoryRouter>,
    )
  })
  return container
}

// Ba mẫu trang trí mà đợt C gỡ — không được quay lại ở BẤT KỲ trạng thái nào.
const FORBIDDEN = ['animate-ping', 'blur-', 'bg-gradient-', 'shadow-accent-', 'uppercase']

function comebackProp(overrides: Partial<HomeComeback> = {}): HomeComeback {
  return {
    daysAway: 5,
    reviewLabel: 'Ôn 5 thẻ',
    onReview: vi.fn(),
    learnLabel: 'Học 3 từ mới',
    onLearnNew: vi.fn(),
    onDismiss: vi.fn(),
    ...overrides,
  }
}

describe('HomeAiBriefingCard — thẻ AI tập trung (đợt C)', () => {
  beforeEach(() => {
    fetchBriefing.mockReset()
    speak.mockReset()
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
  })

  it('đang tải: chỉ có skeleton, không có chấm nhấp nháy hay quầng sáng', async () => {
    fetchBriefing.mockReturnValue(new Promise(() => {}))
    const el = await render({ userName: 'An', isDesktop: false })
    const html = el.innerHTML
    expect(html).toContain('Đang tải bản tin')
    for (const cls of FORBIDDEN) expect(html).not.toContain(cls)
    // Tiêu đề thẻ phải là "Bạn Đồng Hành AI" — e2e/v2-hubs.spec.ts tìm heading này trên trang chủ.
    expect(el.querySelector('h2')?.textContent).toBe('Bạn Đồng Hành AI')
    expect(html).toContain(', An.')
    expect(el.querySelector('[aria-label="Đang tải bản tin"]')?.parentElement?.className).toContain(
      'min-h-[80px]',
    )
  })

  it('candidate comeback reserve đúng 173px ngay trong loading, trước khi detail/actions có mặt', async () => {
    fetchBriefing.mockReturnValue(new Promise(() => {}))
    const el = await render({ isDesktop: false, reserveComeback: true })
    const reserve = el.querySelector('[aria-label="Đang tải bản tin"]')?.parentElement
    expect(reserve?.className).toContain('min-h-[173px]')
    expect(reserve?.className).not.toContain('min-h-[70px]')
  })

  it('đã tải: không còn animate-pulse nào (pulse chỉ dành cho skeleton — luật 6 mục 9)', async () => {
    fetchBriefing.mockResolvedValue({ summary: 'Bản tin thử.', insights: ['Đã ôn 3 thẻ'] })
    const el = await render({
      isDesktop: true,
      showDailyWords: true,
      dailyLearned: 3,
      dailyMax: 20,
    })
    const html = el.innerHTML
    expect(html).toContain('Bản tin thử.')
    expect(html).toContain('Đã ôn 3 thẻ')
    expect(html).not.toContain('animate-pulse')
    for (const cls of FORBIDDEN) expect(html).not.toContain(cls)
    expect(el.textContent).toContain('3/20')
    expect(
      el.querySelector('[aria-label="Lời chào của Bạn Đồng Hành"]')?.parentElement?.parentElement
        ?.className,
    ).toContain('min-h-[80px]')
  })

  it('API lỗi: vẫn có câu dự phòng, không vỡ thẻ', async () => {
    fetchBriefing.mockRejectedValue(new Error('down'))
    const el = await render({ isDesktop: false })
    expect(el.textContent).toContain('Bắt đầu việc quan trọng nhất hôm nay.')
    expect(el.innerHTML).not.toContain('animate-pulse')
    expect(el.textContent).not.toContain('chuỗi học tập rất tốt')
  })

  // [S06-2] Bất biến MỚI: thẻ chào KHÔNG được quyết định việc học nữa. Bản cũ tự dựng "Kế hoạch
  // hôm nay" từ tín hiệu môn Anh và điều hướng về `/lo-trinh-hoc` — đúng cái "mặc định tiếng
  // Anh" mà nền tảng cấm. Việc học nay ở TodayCard.
  it('không còn khối kế hoạch/việc học nào trong thẻ chào', async () => {
    fetchBriefing.mockResolvedValue({ summary: 'Bản tin thử.', insights: [] })
    const el = await render({ userName: 'An', isDesktop: false })
    expect(el.textContent).not.toContain('Kế hoạch hôm nay')
    expect(el.textContent).not.toContain('Ưu tiên 1')
    expect(el.innerHTML).not.toContain('/lo-trinh-hoc')
  })

  // §7 Q5: dòng "x/y từ" là kế toán RIÊNG môn Anh — người chỉ học Lập trình không được thấy.
  it('không học tiếng Anh: không hiện dòng đếm từ của môn Anh', async () => {
    fetchBriefing.mockResolvedValue({ summary: 'Bản tin thử.', insights: [] })
    const el = await render({ isDesktop: false, dailyLearned: 0, dailyMax: 50 })
    expect(el.textContent).not.toContain('Hôm nay đã học')
    expect(el.textContent).not.toContain('0/50')
  })

  // [P0-2] KHÔNG còn import Bot từ lucide — thay bằng CompanionAvatar SVG inline.
  it('không import Bot từ lucide-react', () => {
    const src = readFileSync(join(__dirname, 'HomeAiBriefingCard.tsx'), 'utf-8')
    // Chỉ soi CODE (bỏ dòng comment `//`) — bình luận lịch sử được phép nhắc lại tên icon đã gỡ.
    const codeOnly = src
      .split('\n')
      .filter((l) => !l.trim().startsWith('//'))
      .join('\n')
    expect(codeOnly).not.toMatch(/\bBot\b/)
  })

  // [P0-2] Luồng "quay lại sau bỏ bẵng" gộp vào bong bóng, không còn card `.glass` riêng.
  it('có comeback: DOM có "Đã 5 ngày" và KHÔNG có card .glass riêng', async () => {
    fetchBriefing.mockResolvedValue({ summary: 'Bản tin thử.', insights: [] })
    const el = await render({
      isDesktop: false,
      reserveComeback: true,
      comeback: comebackProp(),
    })
    expect(el.textContent).toContain('Đã 5 ngày')
    expect(el.querySelector('.glass')).toBeNull()
    expect(el.textContent).toContain('Ôn 5 thẻ')
    expect(el.textContent).toContain('Học 3 từ mới')
    expect(fetchBriefing).toHaveBeenCalledTimes(1)
    expect(
      el.querySelector('[aria-label="Lời chào của Bạn Đồng Hành"]')?.parentElement?.parentElement
        ?.className,
    ).toContain('min-h-[173px]')
  })

  it('mobile hiện trọn summary dài và comeback detail, override line-clamp chỉ tại Home', async () => {
    const longSummary =
      'Đây là bản tóm tắt dài cần được hiển thị trọn vẹn trên trang chủ để người học không mất bất kỳ thông tin quan trọng nào dù nội dung vượt quá hai dòng trên màn hình điện thoại nhỏ.'
    fetchBriefing.mockResolvedValue({ summary: longSummary, insights: [] })
    const el = await render({
      isDesktop: false,
      reserveComeback: true,
      comeback: comebackProp({ daysAway: 123 }),
    })
    const fullCopy = el.querySelector('[data-testid="home-companion-full-copy"]')
    const paragraphs = fullCopy?.querySelectorAll('p') ?? []

    expect(fullCopy?.className).toContain('[&_p]:!line-clamp-none')
    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0]?.textContent).toBe(longSummary)
    expect(paragraphs[1]?.textContent).toContain('Đã 123 ngày')
    // Reserve chỉ là sàn chống CLS; nội dung dài được phép nở tự nhiên, không đặt max-height.
    expect(fullCopy?.parentElement?.className).toContain('min-h-[173px]')
    expect(fullCopy?.parentElement?.className).not.toContain('max-h-')
  })

  it('comeback.reviewLabel = null: không hiện link ôn thẻ, vẫn hiện link học từ mới', async () => {
    fetchBriefing.mockResolvedValue({ summary: 'Bản tin thử.', insights: [] })
    const el = await render({ isDesktop: false, comeback: comebackProp({ reviewLabel: null }) })
    expect(el.textContent).not.toContain('Ôn 5 thẻ')
    expect(el.textContent).toContain('Học 3 từ mới')
  })

  it('bấm nút học từ mới trong comeback → gọi đúng callback', async () => {
    fetchBriefing.mockResolvedValue({ summary: 'Bản tin thử.', insights: [] })
    const onLearnNew = vi.fn()
    const el = await render({ isDesktop: false, comeback: comebackProp({ onLearnNew }) })
    const btn = [...el.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Học 3 từ mới'),
    ) as HTMLButtonElement
    act(() => btn.click())
    expect(onLearnNew).toHaveBeenCalledTimes(1)
  })

  it('mobile giữ summary/fact nhưng ẩn insight và không còn link tiến độ', async () => {
    fetchBriefing.mockResolvedValue({ summary: 'Tóm tắt đủ.', insights: ['Insight phụ'] })
    const el = await render({
      isDesktop: false,
      showDailyWords: true,
      dailyLearned: 2,
      dailyMax: 10,
    })
    expect(el.textContent).toContain('Tóm tắt đủ.')
    expect(el.textContent).toContain('2/10')
    expect(el.textContent).not.toContain('Insight phụ')
    expect(el.textContent).not.toContain('Xem tiến độ')
  })

  it('desktop hiện insight và TTS vẫn đọc toàn bộ summary', async () => {
    fetchBriefing.mockResolvedValue({ summary: 'Tóm tắt cần đọc.', insights: ['Insight phụ'] })
    const el = await render({ isDesktop: true })
    expect(el.textContent).toContain('Insight phụ')
    const speakButton = el.querySelector(
      'button[aria-label="Nghe giọng đọc"]',
    ) as HTMLButtonElement | null
    expect(speakButton).not.toBeNull()
    act(() => speakButton?.click())
    expect(speak).toHaveBeenCalledWith('Tóm tắt cần đọc.', 'vi-VN')
  })
})
