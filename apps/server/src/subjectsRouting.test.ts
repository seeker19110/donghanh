import { describe, it, expect } from 'vitest'
import {
  decideRedirect,
  isAssetPath,
  normalizeLegacySubjectsPath,
  DEFAULT_SUBJECTS_HOSTNAME,
  DEFAULT_CANONICAL_HOSTNAME,
  SUBJECTS_PREFIX,
} from './subjectsRouting.js'

const SUBJECT_IDS = ['english', 'mathematics', 'physics', 'chemistry', 'biology', 'programming']
const WWW = DEFAULT_CANONICAL_HOSTNAME
const H = DEFAULT_SUBJECTS_HOSTNAME
const LEGACY_PREFIXES = ['/mon-hoc', '/subjects', '/phong-hoc', '/hoc-mon-hoc']

function quyet(hostname: string | undefined, pathname: string, search = '') {
  return decideRedirect({
    hostname,
    pathname,
    search,
    subjectIds: SUBJECT_IDS,
    subjectsHostname: DEFAULT_SUBJECTS_HOSTNAME,
  })
}

// Cờ bật/tắt: không khai host Góc học tập thì KHÔNG chuyển hướng gì — để deploy code trước,
// bật sau khi DNS + cert đã sống.
describe('decideRedirect — chưa bật (không khai SUBJECTS_HOSTNAME)', () => {
  it.each([
    [WWW, '/goc-hoc-tap'],
    [WWW, '/mon-hoc/mathematics'],
    [H, '/tien-do'],
  ])('%s%s → không chuyển hướng', (host, path) => {
    expect(decideRedirect({ hostname: host, pathname: path, subjectIds: SUBJECT_IDS })).toBeNull()
  })
})

describe('isAssetPath', () => {
  it.each([
    '/assets/index-a1b2c3d4.js',
    '/assets/index-a1b2c3d4.css',
    '/favicon.svg',
    '/manifest.webmanifest',
    '/robots.txt',
    '/sw.js',
    '/icon-512.png',
    '/data/curriculum.json',
    '/pyodide/pyodide.asm.wasm',
    '/sqljs/sql-wasm.wasm',
    '/uploads/abc.mp3',
  ])('%s là file tĩnh — KHÔNG được chuyển hướng', (p) => {
    expect(isAssetPath(p)).toBe(true)
  })

  it.each(['/', '/mathematics', '/tien-do', '/goc-hoc-tap/physics'])(
    '%s KHÔNG phải file tĩnh',
    (p) => {
      expect(isAssetPath(p)).toBe(false)
    },
  )
})

describe('normalizeLegacySubjectsPath', () => {
  it.each(LEGACY_PREFIXES)('%s → tiền tố chuẩn, giữ nguyên phần đuôi', (prefix) => {
    expect(normalizeLegacySubjectsPath(prefix)).toBe(SUBJECTS_PREFIX)
    expect(normalizeLegacySubjectsPath(`${prefix}/physics`)).toBe(`${SUBJECTS_PREFIX}/physics`)
    expect(normalizeLegacySubjectsPath(`${prefix}/physics/bai-hoc/ly10`)).toBe(
      `${SUBJECTS_PREFIX}/physics/bai-hoc/ly10`,
    )
  })

  // Khớp theo BIÊN đoạn: `/mon-hoc-khac` là một route khác, không phải tiền tố cũ.
  it.each(['/mon-hoc-khac', '/subjectsx', '/phong-hoc-nhom', '/goc-hoc-tap', '/tien-do'])(
    '%s KHÔNG phải tiền tố cũ',
    (p) => {
      expect(normalizeLegacySubjectsPath(p)).toBeNull()
    },
  )
})

describe('decideRedirect — trên host Góc học tập', () => {
  it('danh mục ở đúng đường dẫn chuẩn → phục vụ tại chỗ', () => {
    expect(quyet(H, SUBJECTS_PREFIX)).toBeNull()
  })

  it.each(SUBJECT_IDS.filter((id) => id !== 'programming' && id !== 'english'))(
    '/goc-hoc-tap/%s là trang môn → phục vụ tại chỗ',
    (id) => {
      expect(quyet(H, `${SUBJECTS_PREFIX}/${id}`)).toBeNull()
    },
  )

  // URL cũ của chính host này (tiền tố từng bị bỏ đi) — đưa về dạng chuẩn, không mất link.
  it('trang gốc → đường dẫn chuẩn trên CÙNG host (302, còn rollback được)', () => {
    expect(quyet(H, '/')).toEqual({ location: `https://${H}${SUBJECTS_PREFIX}`, status: 302 })
  })

  it('/mathematics (URL cũ không tiền tố) → /goc-hoc-tap/mathematics cùng host', () => {
    expect(quyet(H, '/mathematics', '?tab=hoc')).toEqual({
      location: `https://${H}${SUBJECTS_PREFIX}/mathematics?tab=hoc`,
      status: 302,
    })
  })

  it.each(LEGACY_PREFIXES)('%s trên host này → đường dẫn chuẩn cùng host', (prefix) => {
    expect(quyet(H, prefix)).toEqual({
      location: `https://${H}${SUBJECTS_PREFIX}`,
      status: 302,
    })
  })

  // Lập trình có không gian riêng trên app nền tảng (route /lap-trinh) — đi thẳng, không dựng
  // trang chi tiết môn rồi mới chuyển tiếp bằng JS.
  it.each([`${SUBJECTS_PREFIX}/programming`, '/programming'])('%s → thẳng tới /lap-trinh', (p) => {
    expect(quyet(H, p)).toEqual({ location: `https://${WWW}/lap-trinh`, status: 302 })
  })

  // Bài học STEM thuộc APP host (bảng ownership của đặc tả): trước đây cặp luật cũ đá qua đá
  // lại và đích cuối là một đường dẫn không tồn tại.
  it('bài học STEM → app host, GIỮ nguyên tiền tố và phần đuôi', () => {
    expect(quyet(H, `${SUBJECTS_PREFIX}/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do`)).toEqual({
      location: `https://${WWW}${SUBJECTS_PREFIX}/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do`,
      status: 302,
    })
  })

  // Đây là điều kiện chính của phương án "mỗi nội dung chỉ ở MỘT host".
  it.each(['/tien-do', '/tro-truyen', '/cai-dat', '/lap-trinh', '/login', '/ho-so'])(
    '%s không thuộc Góc học tập → 301 về www (luật đã nghiệm thu 2026-08-28)',
    (p) => {
      expect(quyet(H, p)).toEqual({ location: `https://${WWW}${p}`, status: 301 })
    },
  )

  it('giữ nguyên query string khi chuyển hướng', () => {
    expect(quyet(H, '/tien-do', '?tab=tuan')).toEqual({
      location: `https://${WWW}/tien-do?tab=tuan`,
      status: 301,
    })
  })

  it('mã môn KHÔNG tồn tại → về www (không trả SPA để tránh trùng nội dung)', () => {
    expect(quyet(H, '/khong-co-mon-nay')).toEqual({
      location: `https://${WWW}/khong-co-mon-nay`,
      status: 301,
    })
    expect(quyet(H, `${SUBJECTS_PREFIX}/khong-co-mon-nay`)).toEqual({
      location: `https://${WWW}${SUBJECTS_PREFIX}/khong-co-mon-nay`,
      status: 302,
    })
  })

  // Nếu luật quá rộng, chính bundle của SPA bị chuyển hướng và trang trắng — không có lỗi nào
  // để lần ra.
  it('file tĩnh của chính SPA vẫn được phục vụ, KHÔNG bị đẩy đi', () => {
    expect(quyet(H, '/assets/index-abc12345.js')).toBeNull()
    expect(quyet(H, '/manifest.webmanifest')).toBeNull()
  })

  it('không phân biệt hoa thường ở Host header', () => {
    expect(quyet('Hoc-Tap.DongHanhCungBan.ORG', '/tien-do')).not.toBeNull()
  })
})

describe('decideRedirect — trên app nền tảng (www/en-vi)', () => {
  it('/goc-hoc-tap → cùng đường dẫn trên host Góc học tập', () => {
    expect(quyet(WWW, SUBJECTS_PREFIX)).toEqual({
      location: `https://${H}${SUBJECTS_PREFIX}`,
      status: 302,
    })
  })

  it('/goc-hoc-tap/mathematics → GIỮ nguyên tiền tố, chỉ đổi host', () => {
    expect(quyet(WWW, `${SUBJECTS_PREFIX}/mathematics`)).toEqual({
      location: `https://${H}${SUBJECTS_PREFIX}/mathematics`,
      status: 302,
    })
  })

  it.each(LEGACY_PREFIXES)(
    'alias cũ %s đi THẲNG tới đích cuối, không qua chặng trung gian',
    (p) => {
      expect(quyet(WWW, p)).toEqual({ location: `https://${H}${SUBJECTS_PREFIX}`, status: 302 })
      expect(quyet(WWW, `${p}/physics`)).toEqual({
        location: `https://${H}${SUBJECTS_PREFIX}/physics`,
        status: 302,
      })
    },
  )

  it('giữ query string', () => {
    expect(quyet(WWW, `${SUBJECTS_PREFIX}/physics`, '?tu=abc')).toEqual({
      location: `https://${H}${SUBJECTS_PREFIX}/physics?tu=abc`,
      status: 302,
    })
  })

  // Bài học STEM là nhà của app host: URL chuẩn phải được PHỤC VỤ, không bị đẩy đi đâu cả.
  it('bài học STEM ở dạng chuẩn → phục vụ tại chỗ', () => {
    expect(quyet(WWW, `${SUBJECTS_PREFIX}/physics/bai-hoc`)).toBeNull()
    expect(quyet(WWW, `${SUBJECTS_PREFIX}/biology/bai-hoc/sinh12-c1-b1--nhan-doi-adn`)).toBeNull()
  })

  it('bài học STEM ở URL cũ → đổi tiền tố, GIỮ nguyên host (không vòng qua host kia)', () => {
    expect(quyet(WWW, '/mon-hoc/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do')).toEqual({
      location: `https://${WWW}${SUBJECTS_PREFIX}/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do`,
      status: 302,
    })
  })

  it('môn có không gian riêng → /lap-trinh trên chính app host', () => {
    expect(quyet(WWW, `${SUBJECTS_PREFIX}/programming`)).toEqual({
      location: `https://${WWW}/lap-trinh`,
      status: 302,
    })
  })

  it('mã môn lạ → ở lại app host (trang "không tìm thấy" của app lo)', () => {
    expect(quyet(WWW, `${SUBJECTS_PREFIX}/khong-co-mon-nay`)).toBeNull()
  })

  // Bất biến quan trọng nhất: KHÔNG được đụng tới phần còn lại của app.
  it.each(['/', '/tien-do', '/tro-truyen', '/lap-trinh', '/login', '/mon-hoc-khac'])(
    '%s KHÔNG bị chuyển hướng',
    (p) => {
      expect(quyet(WWW, p)).toBeNull()
    },
  )

  it('en-vi cũng áp dụng cùng luật, và KHÔNG bị kéo về www vì cớ khác', () => {
    expect(quyet('en-vi.donghanhcungban.org', '/mon-hoc')).toEqual({
      location: `https://${H}${SUBJECTS_PREFIX}`,
      status: 302,
    })
    expect(quyet('en-vi.donghanhcungban.org', '/tien-do')).toBeNull()
  })
})

// ── Slice 02: Tiếng Anh là MỘT MÔN, trang tổng quan `/goc-hoc-tap/english` thuộc APP host ──
// (`docs/specs/2026-09-15-goc-hoc-tap-02-tieng-anh-la-mot-mon.md` §③, AC-2)
describe('decideRedirect — môn Tiếng Anh thuộc app host', () => {
  const ENGLISH_HOME = `${SUBJECTS_PREFIX}/english`

  it('app host: trang tổng quan Tiếng Anh được PHỤC VỤ, không đẩy sang host Góc học tập', () => {
    expect(quyet(WWW, ENGLISH_HOME)).toBeNull()
    expect(quyet('en-vi.donghanhcungban.org', ENGLISH_HOME)).toBeNull()
  })

  it.each(['/hoc-tieng-anh', '/tieng-anh', '/english'])(
    'app host: alias cũ %s → 302 tới trang tổng quan, GIỮ host và query',
    (p) => {
      expect(quyet(WWW, p, '?tab=hom-nay')).toEqual({
        location: `https://${WWW}${ENGLISH_HOME}?tab=hom-nay`,
        status: 302,
      })
    },
  )

  it('alias cũ khớp theo BIÊN đoạn — /english-abc không phải Tiếng Anh', () => {
    expect(quyet(WWW, '/english-abc')).toBeNull()
    expect(quyet(WWW, '/hoc-tieng-anh-x')).toBeNull()
  })

  it.each([`${SUBJECTS_PREFIX}/english`, '/english', '/hoc-tieng-anh', '/mon-hoc/english'])(
    'host Góc học tập: %s → app host /goc-hoc-tap/english (một chặng)',
    (p) => {
      expect(quyet(H, p)).toEqual({ location: `https://${WWW}${ENGLISH_HOME}`, status: 302 })
    },
  )

  it('đường sâu hơn dưới môn Tiếng Anh KHÔNG bị gộp về trang tổng quan (02 chưa định nghĩa)', () => {
    // App host: để nguyên cho route `*` của app xử lý.
    expect(quyet(WWW, `${ENGLISH_HOME}/gi-do`)).toBeNull()
    // Host Góc học tập: về app host, giữ nguyên đường dẫn.
    expect(quyet(H, `${ENGLISH_HOME}/gi-do`)).toEqual({
      location: `https://${WWW}${ENGLISH_HOME}/gi-do`,
      status: 302,
    })
  })

  it('đích của mọi alias Tiếng Anh là điểm dừng (không chuỗi chuyển hướng)', () => {
    for (const [host, p] of [
      [WWW, '/hoc-tieng-anh'],
      [H, '/english'],
      [H, `${SUBJECTS_PREFIX}/english`],
    ] as const) {
      const first = quyet(host, p)
      expect(first).not.toBeNull()
      const url = new URL(first!.location)
      expect(quyet(url.hostname, url.pathname)).toBeNull()
    }
  })
})

describe('decideRedirect — ca biên', () => {
  it('không có Host header → không chuyển hướng (không đoán mò)', () => {
    expect(quyet(undefined, '/mon-hoc')).toBeNull()
  })

  // localhost/dev: một host phục vụ tất cả, alias do React Router lo.
  it.each(['/mon-hoc', '/mon-hoc/physics', '/goc-hoc-tap', '/goc-hoc-tap/physics'])(
    'localhost %s KHÔNG bị chuyển hướng',
    (p) => {
      expect(quyet('localhost', p)).toBeNull()
    },
  )

  it('domain lạ giả dạng host Góc học tập → xử như host thường', () => {
    expect(quyet('hoc-tap.donghanhcungban.org.ke-gian.example', '/tien-do')).toBeNull()
    expect(quyet('hoc-tap.donghanhcungban.org.ke-gian.example', '/goc-hoc-tap')).toBeNull()
  })

  it('không có chuỗi chuyển hướng: đích của mọi alias là điểm dừng', () => {
    const first = quyet(WWW, '/mon-hoc/physics')
    expect(first).not.toBeNull()
    const url = new URL(first!.location)
    expect(quyet(url.hostname, url.pathname)).toBeNull()
  })
})
