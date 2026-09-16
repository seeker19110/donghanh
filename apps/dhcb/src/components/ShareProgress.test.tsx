// Cổng AC-16 (S12-3): khối "Tiến độ theo môn" là THÊM, không được đổi con số cũ ở chỗ khác.
//
// `ShareProgress` là nơi những con số tiến độ cũ đi ra NGOÀI app (người học gửi cho bạn bè),
// nên nó là chỗ dễ nhận ra nhất nếu ai đó lỡ đổi nguồn số: chúng phải vẫn là `getStreak` +
// `getLearnedCount` — bằng chứng tiếng Anh hợp lệ, không phải số tính lại từ cây mục lục.
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ShareProgress from './ShareProgress'

vi.mock('../lib/storage', async (goc) => ({
  ...(await goc<Record<string, unknown>>()),
  getStreak: () => 7,
}))
vi.mock('../lib/vocab', async (goc) => ({
  ...(await goc<Record<string, unknown>>()),
  getLearnedCount: () => 123,
}))

beforeEach(() => localStorage.clear())

const render = (isA: boolean) =>
  renderToStaticMarkup(<ShareProgress userId="u1" isA={isA} onClose={() => undefined} />)

describe('ShareProgress — nguồn số KHÔNG đổi sau S12-3', () => {
  it('chiều A: vẫn là số từ đã thuộc và chuỗi ngày, không phải số từ cây mục lục', () => {
    const html = render(true)
    expect(html).toContain('123')
    expect(html).toContain('7')
  })

  it('chiều B giữ nguyên bản tiếng Anh với cùng hai con số', () => {
    const html = render(false)
    expect(html).toContain('123')
    expect(html).toContain('7')
  })

  it('không rò điểm chẩn đoán ra ngoài app', () => {
    const html = render(true).toLowerCase()
    for (const cam of ['placement', 'mastery', 'band', 'năng lực']) {
      expect(html, `chia sẻ không được mang "${cam}"`).not.toContain(cam)
    }
  })
})
