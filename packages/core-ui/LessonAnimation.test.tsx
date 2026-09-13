// Cổng cho trình vẽ hoạt ảnh bài học.
//
// Hai thứ đáng canh nhất, vì hỏng thì hỏng lặng lẽ:
//  1. Vai trò màu phải ra biến CSS token — lọt một mã màu thô là mất tương phản ở theme khác.
//  2. Hoạt ảnh luôn phải có kênh thay thế bằng lời; đây là điều khiến nội dung tới được người
//     dùng trình đọc màn hình và người bật "giảm chuyển động".
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { LessonAnimation as Spec } from '@dhcb/core-contracts/lessonAnimation'
import { LessonAnimation } from './LessonAnimation.js'

const spec: Spec = {
  title: 'Rơi tự do',
  description: 'Hai vật khác khối lượng rơi trong ống chân không và chạm đáy cùng lúc.',
  viewBoxWidth: 200,
  viewBoxHeight: 100,
  durationMs: 2000,
  loop: true,
  shapes: [
    {
      kind: 'circle',
      id: 'bi',
      cx: 20,
      cy: 10,
      r: 5,
      fill: 'accent',
      keyframes: [
        { atMs: 0, dy: 0 },
        { atMs: 2000, dy: 60, opacity: 0.8 },
      ],
    },
    { kind: 'rect', id: 'ong', x: 5, y: 5, w: 40, h: 80, stroke: 'neutral', strokeWidth: 2 },
    { kind: 'line', id: 'day', x1: 5, y1: 85, x2: 45, y2: 85, stroke: 'muted', dash: '4 2' },
    { kind: 'arrow', id: 'luc', x1: 20, y1: 20, x2: 20, y2: 50, stroke: 'correct' },
    {
      kind: 'polyline',
      id: 'do-thi',
      points: [
        [60, 80],
        [80, 60],
        [100, 20],
      ],
      stroke: 'primary',
    },
    { kind: 'label', id: 'nhan', x: 60, y: 95, text: 'thời gian', fill: 'neutral' },
  ],
  captions: [{ atMs: 0, text: 'Thả đồng thời hai vật.' }],
}

function html(): string {
  return renderToStaticMarkup(<LessonAnimation spec={spec} />)
}

describe('LessonAnimation', () => {
  it('vẽ đủ mọi loại hình được khai báo', () => {
    const h = html()
    for (const the of ['<circle', '<rect', '<line', '<polyline', '<text']) {
      expect(h, `thiếu thẻ ${the}`).toContain(the)
    }
  })

  it('màu lấy từ biến CSS token, KHÔNG có mã màu thô', () => {
    const h = html()
    expect(h).toContain('rgb(var(--a-400))')
    expect(h).toContain('rgb(var(--anim-correct))')
    // Mã hex trong thuộc tính màu là dấu hiệu ai đó lách token — trừ hex nằm trong nội dung chữ.
    expect(/(?:fill|stroke)="#[0-9a-f]{3,8}"/i.test(h)).toBe(false)
  })

  it('luôn có mô tả bằng lời và được thẻ svg trỏ tới bằng aria-describedby', () => {
    const h = html()
    expect(h).toContain(spec.description)
    const id = /aria-describedby="([^"]+)"/.exec(h)?.[1]
    expect(id, 'svg thiếu aria-describedby').toBeTruthy()
    expect(h).toContain(`id="${id}"`)
  })

  it('tôn trọng prefers-reduced-motion — có nhánh tắt hẳn hoạt ảnh', () => {
    expect(html()).toContain('prefers-reduced-motion')
  })

  it('có nút tạm dừng để người học dừng chuyển động', () => {
    expect(html()).toContain('Tạm dừng hoạt ảnh')
  })

  it('sinh @keyframes cho hình CÓ mốc thời gian và chỉ hình đó', () => {
    const h = html()
    expect(h).toContain('@keyframes')
    // Hình 'bi' có keyframes nên được đánh dấu chạy; 'ong' không có thì không.
    expect((h.match(/data-animated="true"/g) ?? []).length).toBe(1)
  })

  it('mốc thời gian đổi thành phần trăm đúng theo durationMs', () => {
    const h = html()
    expect(h).toContain('0.000%')
    expect(h).toContain('100.000%')
  })

  it('chỉ sinh đầu mũi tên cho vai trò màu thật sự có dùng', () => {
    const h = html()
    expect(h).toContain('dhcb-arrowhead-correct')
    expect(h).not.toContain('dhcb-arrowhead-primary')
  })

  it('in lời dẫn theo thời gian thành danh sách đọc được', () => {
    expect(html()).toContain('Thả đồng thời hai vật.')
  })

  it('hoạt ảnh không lặp thì khai iteration-count là 1', () => {
    const h = renderToStaticMarkup(<LessonAnimation spec={{ ...spec, loop: false }} />)
    expect(h).toContain('animation-iteration-count: 1')
  })
})
