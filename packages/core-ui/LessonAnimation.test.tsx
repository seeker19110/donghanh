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

  // Bẫy đã mắc thật (2026-09-22): tên @keyframes từng nằm ở hình CON, còn duration/play-state
  // nằm ở <g> CHA → không hoạt ảnh nào chạy ở cả 5 môn mà mọi cổng vẫn xanh. CSS animation không
  // kế thừa, nên đủ bộ thuộc tính phải nằm trên MỘT phần tử: đúng thẻ mang data-animated.
  it('animation-name nằm trên CHÍNH thẻ mang data-animated (không phải hình con)', () => {
    const h = html()
    const g = /<g data-animated="true"[^>]*>/.exec(h)?.[0]
    expect(g, 'không thấy thẻ g data-animated').toBeTruthy()
    expect(g).toMatch(/style="animation-name:\s*dhcbAnim/)
    // Không hình con nào mang animation-name — hai nơi cùng khai là lại lệch nhau về sau.
    expect(h.match(/animation-name:\s*dhcbAnim/g)?.length).toBe(1)
  })

  // Bẫy thứ hai cùng ngày: opacity TĨNH ở hình con NHÂN với opacity ĐỘNG ở <g> cha. 159/238
  // hoạt ảnh viết `opacity: 0` tĩnh + keyframes nâng lên 1 → vô hình vĩnh viễn. Keyframe phải
  // là nguồn sự thật khi nó điều khiển opacity; hình chỉ animate vị trí vẫn giữ opacity tĩnh.
  it('keyframe điều khiển opacity thì KHÔNG in opacity tĩnh lên hình con', () => {
    const an: Spec = {
      ...spec,
      shapes: [
        {
          kind: 'circle',
          id: 'hien-muon',
          cx: 10,
          cy: 10,
          r: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1000, opacity: 0 },
            { atMs: 1500, opacity: 1 },
            { atMs: 2000, opacity: 1 },
          ],
        },
        {
          kind: 'circle',
          id: 'mo-di-chuyen',
          cx: 30,
          cy: 10,
          r: 3,
          opacity: 0.4,
          keyframes: [
            { atMs: 0, dx: 0 },
            { atMs: 2000, dx: 50 },
          ],
        },
      ],
    }
    const h = renderToStaticMarkup(<LessonAnimation spec={an} />)
    const hienMuon = /<circle[^>]*cx="10"[^>]*>/.exec(h)![0]
    expect(hienMuon).not.toMatch(/opacity="0"/)
    const moDiChuyen = /<circle[^>]*cx="30"[^>]*>/.exec(h)![0]
    expect(moDiChuyen).toMatch(/opacity="0.4"/)
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
