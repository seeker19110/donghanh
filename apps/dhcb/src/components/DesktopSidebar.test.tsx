// DesktopSidebar.test.tsx — cổng canh slice 02 Góc học tập (spec §④ AC-3, AC-5, AC-8).
//
// Quyết định chủ dự án 2026-09-15 (Q1): 5 công cụ Tiếng Anh DI CHUYỂN vào nhóm "Góc học tập",
// lồng dưới mục "Tiếng Anh" — không xoá. Không còn mục "Học Tiếng Anh" ở nhóm "Không Gian Nền
// Tảng". Test render tĩnh (renderToStaticMarkup) như Layout.test.tsx: đủ để canh cấu trúc DOM
// theo đường dẫn, không cần dựng cả cây provider.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import DesktopSidebar from './DesktopSidebar'

vi.mock('../context/useAuth', () => ({
  useAuth: () => ({ user: { id: 'u1', name: 'An', onboarded: true } }),
}))

function render(pathname: string) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[pathname]}>
      <DesktopSidebar />
    </MemoryRouter>,
  )
}

beforeEach(() => localStorage.clear())

describe('DesktopSidebar — Tiếng Anh là một môn trong Góc học tập', () => {
  it('không còn mục "Học Tiếng Anh" ở nhóm Không Gian Nền Tảng', () => {
    const html = render('/tien-do')
    expect(html).not.toContain('Học Tiếng Anh')
    expect(html).not.toContain('/hoc-tieng-anh')
  })

  it('đứng ở công cụ Tiếng Anh: nhóm Góc học tập mở, mục Tiếng Anh mở cấp 2 với đủ 12 công cụ', () => {
    const html = render('/lo-trinh-hoc/a1')
    expect(html).toContain('href="/goc-hoc-tap/english"')
    for (const label of [
      'Lộ trình CEFR',
      'Bài học hôm nay',
      'Trò chuyện',
      'Luyện nói',
      'Luyện viết',
      'Luyện nghe',
      'Từ điển',
      'Câu thông dụng',
      'Truyện song ngữ',
      'Sổ tay lỗi sai',
      'Ôn thi',
      'Thử thách',
    ]) {
      expect(html, label).toContain(label)
    }
    // Cấp 2 có nút mở/đóng riêng, đang MỞ.
    expect(html).toContain('aria-label="Thu gọn công cụ Tiếng Anh"')
    expect(html).toContain('aria-label="Công cụ Tiếng Anh"')
  })

  it('đứng ngoài Góc học tập: cấp 2 Tiếng Anh KHÔNG hiện (nhóm đóng)', () => {
    const html = render('/tien-do')
    expect(html).not.toContain('Lộ trình CEFR')
    expect(html).not.toContain('Công cụ Tiếng Anh')
  })

  it('đứng ở trang tổng quan môn: mục Tiếng Anh sáng (aria-current), cấp 2 mở', () => {
    const html = render('/goc-hoc-tap/english')
    // Thứ tự thuộc tính do React quyết — khớp bằng regex, không khớp chuỗi cứng.
    expect(html).toMatch(
      /<a[^>]*href="\/goc-hoc-tap\/english"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/goc-hoc-tap\/english"/,
    )
    expect(html).toContain('Ôn thi')
  })

  it('khớp theo BIÊN đoạn: /goc-hoc-tap/english-abc không làm sáng Tiếng Anh, không mở cấp 2', () => {
    const html = render('/goc-hoc-tap/english-abc')
    expect(html).not.toMatch(
      /<a[^>]*href="\/goc-hoc-tap\/english"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/goc-hoc-tap\/english"/,
    )
    expect(html).not.toContain('Công cụ Tiếng Anh')
  })

  it('nhóm Góc học tập vẫn đủ 6 môn khi mở (đứng ở một môn thì nhóm tự mở)', () => {
    const html = render('/goc-hoc-tap/physics')
    for (const label of ['Tiếng Anh', 'Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Lập trình']) {
      expect(html, label).toContain(label)
    }
  })

  // [Slice 03] Công cụ Tiếng Anh sáng "Góc học tập › Tiếng Anh", KHÔNG sáng "Luyện tập".
  it('đứng ở /tro-truyen: Góc học tập + Tiếng Anh + Trò chuyện sáng; Luyện tập không sáng', () => {
    const html = render('/tro-truyen')
    expect(html).toMatch(
      /<a[^>]*href="\/goc-hoc-tap"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/goc-hoc-tap"/,
    )
    expect(html).toMatch(
      /<a[^>]*href="\/tro-truyen"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/tro-truyen"/,
    )
    expect(html).not.toMatch(
      /<a[^>]*href="\/luyen-tap"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/luyen-tap"/,
    )
  })

  it('Luyện tập là mục lá — không có nút mở rộng', () => {
    expect(render('/luyen-tap')).not.toContain('mục Luyện tập')
  })
})
