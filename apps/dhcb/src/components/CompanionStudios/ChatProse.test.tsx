// Cổng cho bộ hiển thị câu trả lời Companion.
//
// Hai nhóm test, theo đúng hai gạch của đặc tả nền §④ B:
//   1. AN TOÀN — payload độc của mô hình không bao giờ thành HTML/liên kết thi hành được.
//      Đây là nhóm KHÔNG ĐƯỢC PHÉP đỏ: nội dung ở đây do LLM sinh ra, tức là do người lạ
//      gián tiếp điều khiển được qua câu hỏi họ gõ vào (prompt injection).
//   2. GIỮ NGUYÊN CODE — code inline và khối code ra màn hình đúng nguyên văn.
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ChatProse from './ChatProse'

const text = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Dựng HTML đã render thành cây DOM THẬT rồi đếm phần tử.
 *
 * Phải đo bằng cây DOM chứ không bằng `toContain('href=')` trên chuỗi: chuỗi `onerror=` hay
 * `href=` VẪN xuất hiện trong HTML an toàn, dưới dạng chữ đã thoát (`&lt;a href=&quot;…`).
 * Đếm trên chuỗi ở đây sẽ đỏ với đúng đầu ra đúng — tức là canh nhầm thứ.
 */
function elements(html: string, selector: string): number {
  const host = document.createElement('div')
  host.innerHTML = html
  return host.querySelectorAll(selector).length
}

describe('ChatProse — an toàn', () => {
  it('thẻ HTML trong câu trả lời ra màn hình là CHỮ, không phải thẻ', () => {
    const html = renderToStaticMarkup(
      <ChatProse text={'Thử: <script>alert(1)</script> và <img src=x onerror=alert(1)>'} />,
    )
    expect(elements(html, 'script')).toBe(0)
    expect(elements(html, 'img')).toBe(0)
    expect(elements(html, '[onerror]')).toBe(0)
    // Vẫn phải THẤY được nội dung — chặn không có nghĩa là xoá mất chữ của mô hình.
    expect(html).toContain('&lt;script&gt;')
  })

  it('không sinh liên kết nào — cú pháp link markdown giữ nguyên văn', () => {
    const html = renderToStaticMarkup(<ChatProse text={'Bấm [vào đây](javascript:alert(1)) nhé'} />)
    expect(elements(html, 'a')).toBe(0)
    expect(elements(html, '[href]')).toBe(0)
    expect(text(html)).toBe('Bấm [vào đây](javascript:alert(1)) nhé')
  })

  it('không sinh liên kết kể cả khi payload nằm trong khối code', () => {
    const html = renderToStaticMarkup(
      <ChatProse text={'```html\n<a href="javascript:alert(1)">x</a>\n```'} />,
    )
    expect(elements(html, 'a')).toBe(0)
    expect(elements(html, '[href]')).toBe(0)
    // Nguyên văn vẫn hiện ra cho người đọc — đây là code mô hình đang GIẢNG, không phải thẻ.
    expect(elements(html, 'pre')).toBe(1)
    expect(html).toContain('&lt;a href=&quot;javascript:alert(1)&quot;&gt;')
  })
})

describe('ChatProse — giữ nguyên code', () => {
  it('khối code rào ``` ra một vùng <pre>, nguyên văn cả thụt lề', () => {
    const html = renderToStaticMarkup(
      <ChatProse text={'Ví dụ:\n```python\ntong = 0\nfor x in ds:\n    tong += x\n```'} />,
    )
    expect(html).toContain('<pre')
    expect(html).toContain('for x in ds:\n    tong += x')
  })

  it('ký tự trùng dấu markdown bên trong code không bị nuốt', () => {
    // `2 ** (lan - 1)` là ca thật trong bài học: hiểu `**` là chữ đậm sẽ mất hai dấu sao.
    const html = renderToStaticMarkup(<ChatProse text={'```\nx = 2 ** (lan - 1)\n```'} />)
    expect(text(html)).toContain('x = 2 ** (lan - 1)')
  })

  it('`code` trong dòng thành thẻ <code>, không còn dấu huyền trên màn hình', () => {
    const html = renderToStaticMarkup(<ChatProse text="Gọi `max(a, b)` là xong." />)
    expect(html).toContain('<code')
    expect(text(html)).toBe('Gọi max(a, b) là xong.')
  })
})

describe('ChatProse — cấu trúc', () => {
  it('**đậm** thành <strong>, không hiện dấu sao', () => {
    const html = renderToStaticMarkup(<ChatProse text="Nhớ **làm rõ đề** trước." />)
    expect(html).toContain('<strong')
    expect(text(html)).toBe('Nhớ làm rõ đề trước.')
  })

  it('danh sách đánh số thành <ol>, gạch đầu dòng thành <ul>', () => {
    const html = renderToStaticMarkup(<ChatProse text={'1. một\n2. hai\n\n- a\n- b'} />)
    expect(html).toContain('<ol')
    expect(html).toContain('<ul')
    expect((html.match(/<li/g) || []).length).toBe(4)
  })

  it('tiêu đề ## thành h4 (KHÔNG phải h2) để không phá thứ bậc tiêu đề của trang', () => {
    const html = renderToStaticMarkup(<ChatProse text={'## Bước tiếp theo\n### Chi tiết'} />)
    expect(html).toContain('<h4')
    expect(html).toContain('<h5')
    expect(html).not.toContain('<h2')
    expect(html).not.toContain('<h3')
  })

  it('câu trả lời chỉ có chữ thường vẫn ra đúng một đoạn, không mất chữ', () => {
    const html = renderToStaticMarkup(<ChatProse text="Chào bạn, hôm nay học gì nào?" />)
    expect(text(html)).toBe('Chào bạn, hôm nay học gì nào?')
  })

  it('chuỗi rỗng không làm vỡ hiển thị', () => {
    expect(() => renderToStaticMarkup(<ChatProse text="" />)).not.toThrow()
  })
})
