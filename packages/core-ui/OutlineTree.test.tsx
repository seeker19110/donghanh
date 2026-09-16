// Cổng cho mục lục cây (S07-2 AC-8, AC-9, AC-12, AC-15).
//
// Render THẬT vào DOM (không phải `renderToStaticMarkup` như TocRail): component này có
// tương tác — mở/thu chương bằng chuột và bàn phím, lọc theo ô tìm — nên phải chạy thật mới
// chứng minh được. Liên kết dựng bằng `<a>` trần để test không phải kéo react-router vào
// `packages/core-ui` (đúng luật: gói này không phụ thuộc router).
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { Outline, OutlineNode } from '@dhcb/core-contracts/outline'
import { OutlineSchema } from '@dhcb/core-contracts/outline'
import { OutlineTree } from './OutlineTree.js'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function nut(p: Partial<OutlineNode> & Pick<OutlineNode, 'nodeId' | 'kind' | 'title' | 'order'>) {
  return {
    subjectId: 'physics',
    availability: 'available',
    progress: 'unknown',
    ...p,
  } as OutlineNode
}

// Cây mẫu: lớp → 2 chương → 4 bài, phủ đủ 5 trạng thái cần phân biệt.
const CAY: Outline = {
  rootId: 'level:ly10',
  subjectId: 'physics',
  builtAt: 0,
  nodes: [
    nut({ nodeId: 'level:ly10', kind: 'level', title: 'Vật lí · Lớp 10', order: 0 }),
    nut({
      nodeId: 'chapter:c1',
      parentId: 'level:ly10',
      kind: 'chapter',
      title: 'Chương 1: Mở đầu',
      hint: '2 bài',
      order: 0,
    }),
    nut({
      nodeId: 'lesson:b1',
      parentId: 'chapter:c1',
      contentId: 'b1',
      kind: 'lesson',
      title: 'Sự rơi tự do',
      href: '/bai/b1',
      order: 0,
      progress: 'completed',
      evidenceSource: 'test',
    }),
    nut({
      nodeId: 'lesson:b2',
      parentId: 'chapter:c1',
      contentId: 'b2',
      kind: 'lesson',
      title: 'Đo thời gian',
      href: '/bai/b2',
      order: 1,
      progress: 'in-progress',
      evidenceSource: 'test',
    }),
    nut({
      nodeId: 'chapter:c2',
      parentId: 'level:ly10',
      kind: 'chapter',
      title: 'Chương 2: Động học',
      hint: '2 bài',
      order: 1,
    }),
    nut({
      nodeId: 'lesson:b3',
      parentId: 'chapter:c2',
      contentId: 'b3',
      kind: 'lesson',
      title: 'Vận tốc trung bình',
      href: '/bai/b3',
      order: 0,
      progress: 'not-started',
    }),
    nut({
      nodeId: 'lesson:b4',
      parentId: 'chapter:c2',
      contentId: 'b4',
      kind: 'lesson',
      title: 'Bài khoá',
      order: 1,
      availability: 'locked',
      lockReason: 'Còn 3 bài ở chương trước nữa là mở',
    }),
  ],
}

describe('OutlineTree', () => {
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

  function hien(props: Partial<Parameters<typeof OutlineTree>[0]> = {}) {
    act(() => {
      root.render(
        <OutlineTree
          outline={CAY}
          title="Mục lục môn học"
          renderLink={({ href, className, current, children, onSelect }) => (
            <a
              href={href}
              className={className}
              aria-current={current ? 'page' : undefined}
              onClick={onSelect}
            >
              {children}
            </a>
          )}
          {...props}
        />,
      )
    })
  }

  /**
   * Gõ vào ô tìm như người dùng thật.
   *
   * Không gán thẳng `input.value = …`: React theo dõi giá trị qua một "value tracker" riêng,
   * gán trực tiếp thì nó coi như giá trị KHÔNG đổi và bỏ qua sự kiện. Phải gọi setter gốc của
   * `HTMLInputElement` để tracker thấy thay đổi.
   */
  function go(chu: string) {
    const o = container.querySelector('input[type="search"]') as HTMLInputElement
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    act(() => {
      setter?.call(o, chu)
      o.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  /** Nút mở/thu của một chương, tra theo chữ trong nhãn. */
  function nutChuong(chu: string): HTMLButtonElement {
    const el = [...container.querySelectorAll('button')].find((b) => b.textContent?.includes(chu))
    if (!el) throw new Error(`Không thấy nút chương chứa "${chu}"`)
    return el
  }

  it('cây mẫu hợp lệ theo hợp đồng OutlineSchema (test không tự bịa dữ liệu sai)', () => {
    expect(() => OutlineSchema.parse(CAY)).not.toThrow()
  })

  it('cây rỗng (chỉ có nút gốc) thì không vẽ gì — khung rỗng còn tệ hơn không có', () => {
    hien({ outline: { ...CAY, nodes: [CAY.nodes[0]!] } })
    expect(container.querySelector('nav')).toBeNull()
  })

  it('vẽ nav có nhãn, và mỗi bài là LIÊN KẾT route thật (không phải neo #)', () => {
    hien()
    expect(container.querySelector('nav')?.getAttribute('aria-label')).toBe('Mục lục môn học')
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('/bai/b1')
    expect(hrefs.every((h) => h?.startsWith('#') !== true)).toBe(true)
  })

  it('chương chứa bài ĐANG MỞ tự bung; chương khác thu lại (chọn bài ≤ 2 thao tác)', () => {
    hien({ activeContentId: 'b3' })
    expect(nutChuong('Chương 2').getAttribute('aria-expanded')).toBe('true')
    expect(nutChuong('Chương 1').getAttribute('aria-expanded')).toBe('false')
  })

  it('đúng MỘT nút mang aria-current="page" — bài đang mở', () => {
    hien({ activeContentId: 'b3' })
    const current = container.querySelectorAll('[aria-current="page"]')
    expect(current.length).toBe(1)
    expect(current[0]?.textContent).toContain('Vận tốc trung bình')
  })

  it('bấm chuột vào chương thì mở/thu; phím → mở và ← thu', () => {
    hien({ activeContentId: 'b3' })
    const c1 = nutChuong('Chương 1')
    act(() => c1.click())
    expect(nutChuong('Chương 1').getAttribute('aria-expanded')).toBe('true')
    act(() => c1.click())
    expect(nutChuong('Chương 1').getAttribute('aria-expanded')).toBe('false')

    act(() => {
      c1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    })
    expect(nutChuong('Chương 1').getAttribute('aria-expanded')).toBe('true')
    act(() => {
      c1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    })
    expect(nutChuong('Chương 1').getAttribute('aria-expanded')).toBe('false')
  })

  it('5 trạng thái đều có NHÃN CHỮ, không chỉ phân biệt bằng màu', () => {
    hien({ activeContentId: 'b3' })
    const chu = container.textContent ?? ''
    expect(chu).toContain('Đã xong') // completed
    expect(chu).toContain('Đang học dở') // in-progress
    expect(chu).toContain('Chưa học') // not-started
    expect(chu).toContain('Khoá') // locked
    expect(chu).toContain('đang mở') // bài đang xem
  })

  it('bài STEM chưa có bằng chứng hiện "Chưa đo được", KHÔNG phải "Chưa học"', () => {
    hien({
      outline: {
        ...CAY,
        nodes: CAY.nodes.map((n) =>
          n.nodeId === 'lesson:b3' ? { ...n, progress: 'unknown' as const } : n,
        ),
      },
      activeContentId: 'b3',
    })
    expect(container.textContent).toContain('Chưa đo được')
  })

  it('bài KHOÁ không phải liên kết: là span aria-disabled kèm lý do bằng chữ', () => {
    hien({ activeContentId: 'b3' })
    const khoa = container.querySelector('[aria-disabled="true"]')
    expect(khoa).not.toBeNull()
    expect(khoa?.tagName).toBe('SPAN')
    expect(khoa?.textContent).toContain('Còn 3 bài ở chương trước nữa là mở')
    // và nó KHÔNG xuất hiện trong danh sách liên kết bấm được
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.textContent)
    expect(hrefs.some((t) => t?.includes('Bài khoá'))).toBe(false)
  })

  it('thứ tự hiển thị đi theo `order`, không theo thứ tự mảng đầu vào', () => {
    const daoNguoc: Outline = { ...CAY, nodes: [...CAY.nodes].reverse() }
    hien({ outline: daoNguoc, activeContentId: 'b1' })
    const chu = container.textContent ?? ''
    expect(chu.indexOf('Chương 1')).toBeLessThan(chu.indexOf('Chương 2'))
    expect(chu.indexOf('Sự rơi tự do')).toBeLessThan(chu.indexOf('Đo thời gian'))
  })

  it('ô tìm lọc KHÔNG DẤU và kèm đường dẫn chương của bài tìm được', () => {
    hien()
    go('roi tu do')
    expect(container.textContent).toContain('Sự rơi tự do')
    expect(container.textContent).toContain('Vật lí · Lớp 10 › Chương 1: Mở đầu')
    expect(container.textContent).not.toContain('Vận tốc trung bình')
  })

  it('tìm không ra thì báo bằng role="status" chứ không để trang câm', () => {
    hien()
    go('khong ton tai gi ca')
    const tb = container.querySelector('[role="status"]')
    expect(tb?.textContent).toBe('Không có bài nào khớp')
  })

  it('chọn một bài thì xoá ô tìm và báo cho nơi gọi (panel mobile tự đóng)', () => {
    let daChon = 0
    hien({ onSelectLeaf: () => (daChon += 1) })
    go('roi tu do')
    const link = [...container.querySelectorAll('a')].find((a) =>
      a.textContent?.includes('Sự rơi tự do'),
    )!
    act(() => link.click())
    expect(daChon).toBe(1)
    expect((container.querySelector('input[type="search"]') as HTMLInputElement).value).toBe('')
  })

  it('trạng thái mở/thu nhận từ ngoài thì báo lên nơi gọi thay vì tự đổi', () => {
    const daBam: string[] = []
    hien({ openIds: new Set(['chapter:c2']), onToggleOpen: (id) => daBam.push(id) })
    expect(nutChuong('Chương 2').getAttribute('aria-expanded')).toBe('true')
    act(() => nutChuong('Chương 2').click())
    // Component KHÔNG tự đóng: chủ sở hữu trạng thái (OutlinePane) mới quyết định.
    expect(daBam).toEqual(['chapter:c2'])
    expect(nutChuong('Chương 2').getAttribute('aria-expanded')).toBe('true')
  })

  // ── activeNodeId (S07-3) ──────────────────────────────────────────────
  // Mã nội dung KHÔNG duy nhất trong mọi cây: cấp B2 của Tiếng Anh dùng vòng từ vựng `it` ở
  // hai unit. Nếu đánh dấu "đang mở" theo mã nội dung thì CẢ HAI lá mang `aria-current="page"`
  // — sai với người dùng bàn phím và trình đọc màn hình, và mở nhầm chương.
  const CAY_TRUNG_MA: Outline = {
    ...CAY,
    nodes: [
      ...CAY.nodes,
      nut({
        nodeId: 'lesson:c2-b1',
        parentId: 'chapter:c2',
        contentId: 'b1',
        kind: 'lesson',
        title: 'Sự rơi tự do (nhắc lại)',
        href: '/bai/c2-b1',
        order: 2,
      }),
    ],
  }

  it('activeNodeId: đúng MỘT lá aria-current dù hai lá trùng mã nội dung', () => {
    hien({ outline: CAY_TRUNG_MA, activeNodeId: 'lesson:c2-b1' })
    const dangMo = [...container.querySelectorAll('[aria-current="page"]')]
    expect(dangMo).toHaveLength(1)
    expect(dangMo[0]?.getAttribute('href')).toBe('/bai/c2-b1')
    // …và chương chứa ĐÚNG lá đó được mở sẵn.
    expect(nutChuong('Chương 2').getAttribute('aria-expanded')).toBe('true')
    expect(nutChuong('Chương 1').getAttribute('aria-expanded')).toBe('false')
  })

  it('activeContentId (không có nodeId) đánh dấu cả hai lá trùng mã — lý do có activeNodeId', () => {
    hien({ outline: CAY_TRUNG_MA, activeContentId: 'b1' })
    expect(container.querySelectorAll('[aria-current="page"]').length).toBeGreaterThan(1)
  })

  it('activeNodeId cũng đúng trong kết quả tìm kiếm', () => {
    hien({ outline: CAY_TRUNG_MA, activeNodeId: 'lesson:c2-b1' })
    go('roi tu do')
    const dangMo = [...container.querySelectorAll('[aria-current="page"]')]
    expect(dangMo).toHaveLength(1)
    expect(dangMo[0]?.getAttribute('href')).toBe('/bai/c2-b1')
  })
})
