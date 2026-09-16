// Cổng cho khối "Tiến độ theo môn" ở `/tien-do` (S12-3, AC-14).
//
// Ca quan trọng nhất KHÔNG phải ca "hiện đúng số": đó là ca BẤT BIẾN — khối này tuyệt đối
// không được chứa điểm chẩn đoán (placement · band IELTS ước lượng · mastery · "năng lực"),
// theo luật số 1 của sản phẩm (CLAUDE.md §2). Ca đó grep thẳng trên HTML đã render.
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { SubjectProgressView } from './SubjectProgressSection'
import type { SubjectProgressCard } from '../lib/subjectProgressBoard'

const the = (
  subjectId: string,
  subjectLabel: string,
  s: Partial<SubjectProgressCard['summary']>,
): SubjectProgressCard => ({
  subjectId,
  subjectLabel,
  href: `/${subjectId}`,
  summary: {
    subjectId,
    scopeId: 'x',
    scopeTitle: 'Phạm vi X',
    total: 10,
    completed: 0,
    inProgress: 0,
    unknown: 0,
    measured: true,
    evidenceSources: [],
    ...s,
  },
})

const render = (props: Parameters<typeof SubjectProgressView>[0]) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <SubjectProgressView {...props} />
    </MemoryRouter>,
  )

const NOOP = () => undefined

describe('SubjectProgressView', () => {
  it('môn đã đo được hiện n/tổng kèm nhãn nguồn bằng chữ', () => {
    const html = render({
      trangThai: 'ready',
      onRetry: NOOP,
      cards: [
        the('programming', 'Lập trình', {
          completed: 3,
          total: 12,
          evidenceSources: ['programming.progress'],
        }),
      ],
    })
    expect(html).toContain('Lập trình')
    expect(html).toContain('3')
    expect(html).toContain('/12')
    expect(html).toContain('theo bài đã đạt test')
  })

  it('môn toàn unknown hiện CHỮ "Chưa đo được", tuyệt đối không hiện 0 hay 0%', () => {
    const html = render({
      trangThai: 'ready',
      onRetry: NOOP,
      cards: [the('physics', 'Vật lí', { total: 94, unknown: 94, measured: false })],
    })
    expect(html).toContain('Chưa đo được')
    expect(html).not.toContain('0/94')
    expect(html).not.toContain('0%')
  })

  it('BẤT BIẾN: không có placement / band / mastery / năng lực trong khối', () => {
    const html = render({
      trangThai: 'ready',
      onRetry: NOOP,
      cards: [
        the('english', 'Tiếng Anh', { completed: 5, evidenceSources: ['english.vocab'] }),
        the('mathematics', 'Toán', { total: 30, unknown: 30, measured: false }),
      ],
    })
    for (const cam of ['placement', 'band', 'mastery', 'năng lực', 'IELTS', 'điểm số']) {
      expect(html.toLowerCase(), `khối tiến độ không được nhắc "${cam}"`).not.toContain(
        cam.toLowerCase(),
      )
    }
  })

  it('bốn trạng thái nói bốn chuyện khác nhau: tải · lỗi · rỗng · có dữ liệu', () => {
    expect(render({ trangThai: 'loading', onRetry: NOOP, cards: [] })).toContain(
      'Đang tính tiến độ',
    )
    const loi = render({ trangThai: 'error', onRetry: NOOP, cards: [] })
    expect(loi).toContain('Chưa tính được tiến độ theo môn')
    expect(loi).toContain('role="alert"')
    expect(render({ trangThai: 'ready', onRetry: NOOP, cards: [] })).toContain(
      'Chưa có môn nào tải được nội dung',
    )
    expect(
      render({ trangThai: 'ready', onRetry: NOOP, cards: [the('english', 'Tiếng Anh', {})] }),
    ).toContain('Tiếng Anh')
  })

  it('mỗi thẻ là một liên kết tới đúng phạm vi đã đếm, vùng chạm ≥ 44px', () => {
    const html = render({
      trangThai: 'ready',
      onRetry: NOOP,
      cards: [the('biology', 'Sinh học', { completed: 1 })],
    })
    expect(html).toContain('href="/biology"')
    expect(html).toContain('tap-44')
  })

  it('bài đang học dở được nói riêng, không cộng vào số đã xong', () => {
    const html = render({
      trangThai: 'ready',
      onRetry: NOOP,
      cards: [the('chemistry', 'Hoá học', { completed: 2, inProgress: 3, total: 20 })],
    })
    expect(html).toContain('3 đang học dở')
  })
})
