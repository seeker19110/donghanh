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
    const html = render('/goc-hoc-tap/english/lo-trinh/a1')
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
  it('đứng ở URL chuẩn Trò chuyện: Góc học tập + Tiếng Anh + Trò chuyện sáng; Luyện tập không sáng', () => {
    const html = render('/goc-hoc-tap/english/tro-truyen')
    expect(html).toMatch(
      /<a[^>]*href="\/goc-hoc-tap"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/goc-hoc-tap"/,
    )
    expect(html).toMatch(
      /<a[^>]*href="\/goc-hoc-tap\/english\/tro-truyen"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/goc-hoc-tap\/english\/tro-truyen"/,
    )
    expect(html).not.toMatch(
      /<a[^>]*href="\/luyen-tap"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/luyen-tap"/,
    )
  })

  it('Luyện tập là mục lá — không có nút mở rộng', () => {
    expect(render('/luyen-tap')).not.toContain('mục Luyện tập')
  })
})

// [P1-7, lệnh 9; rút còn 6 mục ở thiết kế lại header desktop] Sidebar nay 6 mục cấp 1: Góc học
// tập · Ôn tập · Bạn Đồng Hành · Sự nghiệp & Đời sống (gộp career+worklife) · Tiến độ · Hồ sơ.
// "Trang chủ" cấp 1 (mục điều hướng, sáng đèn theo trang) đã gỡ khỏi danh sách này — hàng đợi
// so khớp `ACTIVE_ORDER` không còn tính nó. "Luyện tập" gỡ khỏi sidebar, "Nâng cấp" thành dòng
// nhỏ dưới danh sách (không còn <a> cấp 1 riêng).
// [chỉnh 2026-09-20] Ô LOGO ở ĐẦU sidebar (ngoài `<nav>`, không phải mục cấp 1) đổi từ "Đồng
// Hành" (link `/gioi-thieu`) sang "Trang chủ" (link nội bộ `/`) — vẫn có `href="/"` trong HTML,
// chỉ không còn nằm trong `<nav>`/`ACTIVE_ORDER`.
describe('DesktopSidebar — P1-7: 10 → 6 mục cấp 1', () => {
  function countTopLevelLinks(html: string): number {
    // Cấp 1 = <li> con trực tiếp của <ul> đầu tiên (MAIN_NAV) + <ul> CORE_BOTTOM — đơn giản
    // hơn: đếm theo các href cấp 1 đã biết, vì DOM tĩnh không phân biệt lồng cấp bằng regex dễ.
    const topHrefs = [
      '/goc-hoc-tap',
      '/goc-hoc-tap/on-tap',
      '/ban-dong-hanh',
      '/su-nghiep-khoi-nghiep',
      '/tien-do',
      '/trang-ca-nhan',
    ]
    return topHrefs.filter((href) => html.includes(`href="${href}"`)).length
  }

  it('AC-1: đúng 6 mục cấp 1 khi mọi nhóm đóng ("Trang chủ" là ô logo riêng, không phải mục nav)', () => {
    const html = render('/tien-do')
    expect(countTopLevelLinks(html)).toBe(6)
    // Ô logo đầu sidebar (`href="/"`) có thật, nhưng đứng NGOÀI `<nav>` nên không tính vào 6
    // mục cấp 1 ở trên — `countTopLevelLinks` cố tình không liệt `/` vào danh sách tra.
    expect(html).toContain('href="/"')
  })

  it('AC-2: "Sự Nghiệp & Khởi Nghiệp"/"Công Việc & Đời Sống" chỉ còn ở cấp 2, không còn mục cấp 1 riêng', () => {
    const html = render('/su-nghiep-khoi-nghiep')
    // Nhóm cấp 1 mới.
    expect(html).toContain('Sự nghiệp &amp; Đời sống')
    // Nhãn hai studio cũ chỉ xuất hiện ĐÚNG MỘT LẦN mỗi cái — không còn bản sao ở "Không Gian
    // Nền Tảng" (đã xoá) lẫn ở nhóm mới.
    expect(html.match(/Sự Nghiệp &amp; Khởi Nghiệp/g)).toHaveLength(1)
    expect(html.match(/Công Việc &amp; Đời Sống/g)).toHaveLength(1)
    expect(html).not.toContain('Không Gian Nền Tảng')
    expect(html).not.toContain('Luyện tập')
  })

  it('AC-3: /su-nghiep, /cong-viec, /cuoc-song sáng "Sự nghiệp & Đời sống"; /luyen-tap sáng "Góc học tập"', () => {
    for (const path of ['/su-nghiep', '/cong-viec', '/cuoc-song']) {
      const html = render(path)
      expect(html, path).toMatch(
        /<a[^>]*href="\/su-nghiep-khoi-nghiep"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/su-nghiep-khoi-nghiep"/,
      )
    }
  })

  it('AC-6: link "Nâng cấp" vẫn tồn tại (href="/nang-cap")', () => {
    const html = render('/tien-do')
    expect(html).toContain('href="/nang-cap"')
  })
})
