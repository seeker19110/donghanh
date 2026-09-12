// Cổng cho GIAO DIỆN khoá bậc (GĐ3 — docs/specs/2026-09-12-gd3-khoa-bai-mon-lap-trinh.md).
//
// Luật thuần đã có test riêng; ở đây kiểm đúng thứ chỉ lộ ra trên trang:
//   · Free vào bậc chưa mở → thấy ổ khoá KÈM câu giải thích (ổ khoá câm là lỗi sản phẩm)
//     và KHÔNG thấy nút "Học bài".
//   · VIP vào cùng bậc đó → học bình thường.
//   · Bậc đầu (P1) không bao giờ khoá.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { getProgrammingLevel } from '@dhcb/subject-programming/curriculum'
import { buildSlugSegment } from '@core/slug'
import type { Plan } from '../../../types'
import ProgrammingLevelPage from './ProgrammingLevelPage'

vi.mock('../../../components/Layout', () => ({ default: () => null }))
// Tiến độ đọc từ server — test này chỉ quan tâm ca "chưa học gì".
vi.mock('../../../lib/programmingProgress', async () => {
  const thuc = await vi.importActual<typeof import('../../../lib/programmingProgress')>(
    '../../../lib/programmingProgress',
  )
  return { ...thuc, fetchProgress: () => Promise.resolve([]) }
})

let plan: Plan = 'free'
vi.mock('../../../context/useAuth', () => ({
  useAuth: () => ({ user: { id: 'u1', plan }, loading: false }),
}))

function render(levelId: string) {
  const level = getProgrammingLevel(levelId)
  const doan = level ? buildSlugSegment(level.id, level.name) : levelId
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[`/lap-trinh/${doan}`]}>
      <Routes>
        <Route path="/lap-trinh/:levelId" element={<ProgrammingLevelPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  plan = 'free'
})

describe('ProgrammingLevelPage — khoá bậc', () => {
  it('Free chưa học gì: P2 khoá, có câu giải thích còn thiếu bao nhiêu bài ở P1', () => {
    const html = render('p2')
    expect(html).toContain('Bậc này chưa mở')
    expect(html).toMatch(/Còn \d+ bài ở P1 nữa là mở/)
    expect(html).not.toContain('Học bài:')
  })

  it('Free: P1 luôn mở — vẫn thấy nút học bài', () => {
    const html = render('p1')
    expect(html).not.toContain('Bậc này chưa mở')
    expect(html).toContain('Học bài:')
  })

  it('VIP chưa học gì: P2 vẫn vào học được', () => {
    plan = 'vip'
    const html = render('p2')
    expect(html).not.toContain('Bậc này chưa mở')
    expect(html).toContain('Học bài:')
  })
})
