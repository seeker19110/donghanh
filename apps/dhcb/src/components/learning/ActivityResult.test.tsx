// Cổng của màn kết quả dùng chung (S11-3, AC-14).
//
// Điều đáng canh nhất ở đây KHÔNG phải bố cục mà là CÂU CHỮ: năm trạng thái phải nói ra năm
// sự thật khác nhau, và chữ "hoàn thành" chỉ được thuộc về phán quyết của server.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import ActivityResult, { type ActivityResultProps } from './ActivityResult'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const ITEMS = [
  {
    prompt: 'Gia tốc rơi tự do là bao nhiêu?',
    yourAnswer: '9,8',
    correct: false,
    explain: 'g ≈ 9,8 m/s².',
    reason: 'MISSING_UNIT',
  },
  {
    prompt: 'Vật rơi tự do có vận tốc đầu bằng?',
    yourAnswer: '0',
    correct: true,
    reason: 'CORRECT',
  },
]

describe('ActivityResult', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function hien(props: ActivityResultProps) {
    act(() => {
      root.render(
        <MemoryRouter>
          <ActivityResult {...props} />
        </MemoryRouter>,
      )
    })
    return container.textContent ?? ''
  }

  const CO_BAN = { correct: 1, total: 2, items: ITEMS, passRatio: 0.8 } as const

  it('server nói ĐẠT thì mới có chữ "hoàn thành"', () => {
    const chu = hien({ ...CO_BAN, status: 'passed', correct: 2 })
    expect(chu).toContain('Đúng 2/2 câu')
    expect(chu).toContain('Đã hoàn thành bài này')
    // Đã đạt thì không nhắc ngưỡng nữa — thông tin đó chỉ có ích khi còn phải cố.
    expect(chu).not.toContain('Cần đúng từ')
  })

  it('server nói CHƯA ĐẠT: không có chữ "hoàn thành", có ngưỡng để biết còn thiếu bao nhiêu', () => {
    const chu = hien({ ...CO_BAN, status: 'failed' })
    expect(chu).not.toContain('hoàn thành')
    expect(chu).toContain('Chưa đạt')
    expect(chu).toContain('Cần đúng từ 80% số câu trở lên')
  })

  it('kết quả chấm CỤC BỘ nói rõ nó mới nằm trên máy này', () => {
    expect(hien({ ...CO_BAN, status: 'local', passed: true })).toContain(
      'kết quả ghi trên máy này, đăng nhập để lưu vào tài khoản',
    )
    expect(hien({ ...CO_BAN, status: 'local', passed: false })).toContain(
      'Chưa đạt — kết quả ghi trên máy này',
    )
    // Dù chấm ở máy có ra "đạt", chữ "hoàn thành" vẫn KHÔNG thuộc về nó.
    expect(hien({ ...CO_BAN, status: 'local', passed: true })).not.toContain('hoàn thành')
  })

  it('đang chờ gửi lại: phân biệt mất mạng/server hỏng với hết phiên đăng nhập', () => {
    expect(
      hien({ ...CO_BAN, status: 'pending', passed: false, pendingReason: 'offline' }),
    ).toContain('Đã lưu trên máy này, sẽ gửi lại')
    expect(
      hien({ ...CO_BAN, status: 'pending', passed: false, pendingReason: 'server' }),
    ).toContain('Đã lưu trên máy này, sẽ gửi lại')
    expect(hien({ ...CO_BAN, status: 'pending', passed: true, pendingReason: 'auth' })).toContain(
      'Đăng nhập lại để lưu kết quả',
    )
  })

  it('bị từ chối: nói nguyên văn lý do và trấn an rằng phần chấm tại chỗ vẫn còn', () => {
    const chu = hien({
      status: 'error',
      correct: 0,
      total: 0,
      items: [],
      errorMessage: 'UNSUPPORTED_ACTIVITY',
    })
    expect(chu).toContain('Không gửi được kết quả: UNSUPPORTED_ACTIVITY')
    expect(chu).toContain('vẫn xem được')
    // Không có phán quyết thì không bịa ra con số điểm nào.
    expect(chu).not.toContain('Đúng 0/0')
  })

  it('từng câu: hiện câu trả lời của người học và LÝ DO sai bằng tiếng Việt, không gọi AI', () => {
    const chu = hien({ ...CO_BAN, status: 'failed' })
    expect(chu).toContain('Gia tốc rơi tự do là bao nhiêu?')
    expect(chu).toContain('Bạn trả lời: 9,8')
    expect(chu).toContain('Thiếu đơn vị')
    expect(chu).toContain('g ≈ 9,8 m/s².')
    // Câu đúng không bị dán thêm lời giảng (người học đã làm đúng rồi).
    expect(chu).toContain('Bạn trả lời: 0 · Đúng')
  })

  it('câu bỏ trống nói rõ là bỏ trống, không hiện một khoảng rỗng khó hiểu', () => {
    const chu = hien({
      ...CO_BAN,
      status: 'failed',
      items: [{ prompt: 'Câu bỏ qua', yourAnswer: '  ', correct: false, reason: 'EMPTY' }],
    })
    expect(chu).toContain('(bỏ trống)')
    expect(chu).toContain('Chưa trả lời')
  })

  it('"Làm lại" gọi lại nơi ra lệnh; "Bài tiếp theo" là liên kết thật; vùng chạm đủ 44px', () => {
    let lan = 0
    act(() => {
      root.render(
        <MemoryRouter>
          <ActivityResult
            {...CO_BAN}
            status="failed"
            onRetry={() => {
              lan += 1
            }}
            nextHref="/goc-hoc-tap/physics/bai-hoc/ly10-c2-b11--roi-tu-do-2"
          />
        </MemoryRouter>,
      )
    })
    const nut = [...container.querySelectorAll('button')].find((b) => b.textContent === 'Làm lại')!
    expect(nut.className).toContain('min-h-[44px]')
    act(() => nut.click())
    expect(lan).toBe(1)
    const link = container.querySelector('a')!
    expect(link.getAttribute('href')).toBe('/goc-hoc-tap/physics/bai-hoc/ly10-c2-b11--roi-tu-do-2')
    expect(link.className).toContain('min-h-[44px]')
  })

  it('chừa chỗ "Hẹn ôn" cho S12 — S11 không tự ghi thẻ ôn nào', () => {
    const chu = hien({
      ...CO_BAN,
      status: 'passed',
      reviewSlot: <p>Hẹn ôn lại sau 1 ngày</p>,
    })
    expect(chu).toContain('Hẹn ôn lại sau 1 ngày')
    // Không truyền slot thì không có khung rỗng nào lòi ra.
    expect(hien({ ...CO_BAN, status: 'passed' })).not.toContain('Hẹn ôn')
  })

  it('mã lý do lạ (server mới hơn bản web) thì bỏ qua chứ không vỡ trang', () => {
    const chu = hien({
      ...CO_BAN,
      status: 'failed',
      items: [{ prompt: 'Câu lạ', yourAnswer: 'x', correct: false, reason: 'MOT_MA_CHUA_TUNG_CO' }],
    })
    expect(chu).toContain('Chưa đúng')
    // Mã thiếu hẳn (bản ghi cũ) cũng vậy: không có lý do thì nói "Chưa đúng", không nói bừa.
    expect(
      hien({
        ...CO_BAN,
        status: 'failed',
        items: [{ prompt: 'Câu không mã', yourAnswer: 'x', correct: false }],
      }),
    ).toContain('Chưa đúng')
  })

  it('không có chi tiết từng câu (bản ghi cũ) thì chỉ hiện câu tổng kết', () => {
    const chu = hien({ status: 'passed', correct: 3, total: 3, items: [] })
    expect(chu).toContain('Đúng 3/3 câu')
    expect(chu).not.toContain('Bạn trả lời')
  })
})
