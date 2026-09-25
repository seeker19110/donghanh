// Canh trạng thái đang tải / rỗng / lỗi của thẻ "Nói Đè Theo Mẫu" và Scenario Holodeck.
//
// VÌ SAO CẦN (nợ ghi ở docs/changelog/0451): trước đây hai thẻ nuốt lỗi fetch vào console, nên
// khi API lỗi hoặc trả rỗng thì thân thẻ TRỐNG TRƠN — người học không biết đang tải, không có
// bài hay mạng hỏng. Test render thật (happy-dom) với fetch giả cho từng nhánh.
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import EchoShadowingCard from './EchoShadowingCard'
import ScenarioHolodeckCard from './ScenarioHolodeckCard'
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function render(el: React.ReactElement) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => {
    root.render(el)
  })
}

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

const PASSAGE = {
  id: 'p1',
  title: 'Bài một — mô tả',
  targetText: 'Stay hungry, stay foolish.',
  bpmPacing: 120,
  speakerAccent: 'us',
}

describe('EchoShadowingCard — trạng thái nạp bài mẫu', () => {
  it('đang tải: hiện role=status, chưa có nút bắt đầu', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {})),
    )
    await render(<EchoShadowingCard />)
    expect(container.querySelector('[role="status"]')?.textContent).toContain('Đang tải bài mẫu')
    expect(container.textContent).not.toContain('Bắt đầu Luyện Shadowing')
  })

  it('API trả mảng rỗng: báo chưa có bài, không để thân thẻ trống', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ passages: [] })),
    )
    await render(<EchoShadowingCard />)
    expect(container.textContent).toContain('Hiện chưa có bài mẫu nào')
  })

  it('API lỗi: hiện role=alert + Thử lại; bấm Thử lại nạp được thì hiện bài', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: 'x' }, 500))
      .mockResolvedValueOnce(jsonResponse({ passages: [PASSAGE] }))
    vi.stubGlobal('fetch', fetchMock)
    await render(<EchoShadowingCard />)

    const alert = container.querySelector('[role="alert"]')
    expect(alert?.textContent).toContain('Chưa tải được bài mẫu')

    const retry = [...container.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Thử lại'),
    )
    await act(async () => {
      retry?.click()
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(container.querySelector('[role="alert"]')).toBeNull()
    expect(container.textContent).toContain('Stay hungry, stay foolish.')
  })

  it('JSON sai hình dạng (không có mảng passages) cũng coi là lỗi', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ passages: 'không phải mảng' })),
    )
    await render(<EchoShadowingCard />)
    expect(container.querySelector('[role="alert"]')).not.toBeNull()
  })
})

describe('ScenarioHolodeckCard — trạng thái nạp kịch bản', () => {
  it('mạng hỏng: hiện lỗi có nút Thử lại thay vì thân trống', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    await render(<ScenarioHolodeckCard />)
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'Chưa tải được kịch bản',
    )
  })

  it('API trả rỗng: báo chưa có kịch bản, không hiện nút vào phòng', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ scenarios: [] })),
    )
    await render(<ScenarioHolodeckCard />)
    expect(container.textContent).toContain('Hiện chưa có kịch bản nào')
    expect(container.textContent).not.toContain('Bước vào phòng giả lập')
  })
})
