import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  subjectsHostname,
  isSubjectsHost,
  usesSubjectsSubdomain,
  subjectsPath,
  subjectsTarget,
  goToSubjects,
  subjectsLinkTarget,
  navigateTo,
  normalizeLegacySubjectsPath,
  LEGACY_SUBJECTS_PREFIX,
} from './subjectsHost'

// Đổi window.location.hostname được trong happy-dom qua defineProperty (không gán trực tiếp).
function setHostname(hostname: string) {
  Object.defineProperty(window, 'location', {
    value: { ...window.location, hostname, assign: vi.fn() },
    writable: true,
  })
}

const HOC_TAP = 'hoc-tap.donghanhcungban.org'

// Tính năng bật bằng VITE_SUBJECTS_HOSTNAME. Mặc định TẮT — nhóm cuối file kiểm trạng thái đó.
beforeEach(() => {
  vi.stubEnv('VITE_SUBJECTS_HOSTNAME', HOC_TAP)
})
afterEach(() => {
  vi.unstubAllEnvs()
})

describe('subjectsHostname — biến môi trường chưa từng đặt (undefined, không phải rỗng)', () => {
  it('trả chuỗi rỗng khi VITE_SUBJECTS_HOSTNAME chưa từng được set', () => {
    vi.unstubAllEnvs()
    expect(subjectsHostname()).toBe('')
  })
})

describe('isSubjectsHost', () => {
  it('đúng host trụ Học tập', () => {
    expect(isSubjectsHost(HOC_TAP)).toBe(true)
  })

  it('không phân biệt hoa thường (Host header có thể viết hoa)', () => {
    expect(isSubjectsHost('Hoc-Tap.DongHanhCungBan.ORG')).toBe(true)
  })

  it.each([
    'www.donghanhcungban.org',
    'donghanhcungban.org',
    'en-vi.donghanhcungban.org',
    'localhost',
  ])('%s KHÔNG phải host trụ Học tập', (h) => {
    expect(isSubjectsHost(h)).toBe(false)
  })

  // Chống khớp lỏng: tên miền của kẻ khác chứa chuỗi giống hệt ở đầu.
  it('domain lạ giả dạng không được coi là host Học tập', () => {
    expect(isSubjectsHost('hoc-tap.donghanhcungban.org.ke-gian.example')).toBe(false)
  })
})

describe('usesSubjectsSubdomain', () => {
  it('production .org/.com → có dùng subdomain', () => {
    expect(usesSubjectsSubdomain('www.donghanhcungban.org')).toBe(true)
    expect(usesSubjectsSubdomain('en-vi.donghanhcungban.com')).toBe(true)
  })

  // Quan trọng cho `npm run dev` và Playwright: không có DNS subdomain nào ở đó.
  it.each(['localhost', '127.0.0.1', 'staging.example.test'])('%s → KHÔNG dùng subdomain', (h) => {
    expect(usesSubjectsSubdomain(h)).toBe(false)
  })
})

describe('subjectsPath', () => {
  it('một đường dẫn chuẩn duy nhất, không phụ thuộc host', () => {
    expect(subjectsPath()).toBe('/goc-hoc-tap')
    expect(subjectsPath('mathematics')).toBe('/goc-hoc-tap/mathematics')
  })
})

describe('normalizeLegacySubjectsPath', () => {
  it.each(['/mon-hoc', '/subjects', '/phong-hoc', '/hoc-mon-hoc'])(
    '%s → /goc-hoc-tap',
    (legacy) => {
      expect(normalizeLegacySubjectsPath(legacy)).toBe('/goc-hoc-tap')
      expect(normalizeLegacySubjectsPath(`${legacy}/physics`)).toBe('/goc-hoc-tap/physics')
      expect(normalizeLegacySubjectsPath(`${legacy}/physics/bai-hoc/abc`)).toBe(
        '/goc-hoc-tap/physics/bai-hoc/abc',
      )
    },
  )

  // Khớp theo BIÊN đoạn: tiền tố cũ không được nuốt một route khác chỉ vì trùng đầu chuỗi.
  it.each(['/mon-hoc-abc', '/subjectsx', '/phong-hoc-nhom', '/goc-hoc-tap', '/tien-do'])(
    '%s KHÔNG phải tiền tố cũ',
    (p) => {
      expect(normalizeLegacySubjectsPath(p)).toBeNull()
    },
  )
})

describe('subjectsTarget', () => {
  it('từ www → URL TUYỆT ĐỐI sang subdomain (đổi origin, Router không đi được)', () => {
    expect(subjectsTarget('www.donghanhcungban.org')).toEqual({
      kind: 'url',
      value: `https://${HOC_TAP}/goc-hoc-tap`,
    })
    expect(subjectsTarget('www.donghanhcungban.org', 'chemistry')).toEqual({
      kind: 'url',
      value: `https://${HOC_TAP}/goc-hoc-tap/chemistry`,
    })
  })

  it('đang ở trên host Góc học tập → điều hướng trong app, GIỮ nguyên tiền tố', () => {
    expect(subjectsTarget(HOC_TAP, 'biology')).toEqual({
      kind: 'path',
      value: '/goc-hoc-tap/biology',
    })
  })

  it('localhost → đường dẫn trong app (dev/E2E chạy được, không cần DNS)', () => {
    expect(subjectsTarget('localhost')).toEqual({ kind: 'path', value: '/goc-hoc-tap' })
    expect(subjectsTarget('localhost', 'mathematics')).toEqual({
      kind: 'path',
      value: '/goc-hoc-tap/mathematics',
    })
  })
})

describe('goToSubjects / subjectsLinkTarget / navigateTo', () => {
  const originalLocation = window.location

  afterEach(() => {
    Object.defineProperty(window, 'location', { value: originalLocation, writable: true })
  })

  it('goToSubjects trên host www → window.location.assign sang subdomain', () => {
    setHostname('www.donghanhcungban.org')
    const navigate = vi.fn()
    goToSubjects(navigate, 'chemistry')
    expect(window.location.assign).toHaveBeenCalledWith(`https://${HOC_TAP}/goc-hoc-tap/chemistry`)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('goToSubjects ở localhost → navigate trong app, không đổi origin', () => {
    setHostname('localhost')
    const navigate = vi.fn()
    goToSubjects(navigate, 'physics')
    expect(navigate).toHaveBeenCalledWith('/goc-hoc-tap/physics')
    expect(window.location.assign).not.toHaveBeenCalled()
  })

  it('subjectsLinkTarget dùng đúng hostname hiện tại', () => {
    setHostname(HOC_TAP)
    expect(subjectsLinkTarget('biology')).toEqual({
      kind: 'path',
      value: '/goc-hoc-tap/biology',
    })
  })

  it('navigateTo: path đúng bằng tiền tố cũ → gọi goToSubjects (không tiền tố con)', () => {
    setHostname('localhost')
    const navigate = vi.fn()
    navigateTo(navigate, LEGACY_SUBJECTS_PREFIX)
    expect(navigate).toHaveBeenCalledWith('/goc-hoc-tap')
  })

  it('navigateTo: path có tiền tố + subjectId → gọi goToSubjects với đúng subjectId', () => {
    setHostname('localhost')
    const navigate = vi.fn()
    navigateTo(navigate, `${LEGACY_SUBJECTS_PREFIX}/mathematics`)
    expect(navigate).toHaveBeenCalledWith('/goc-hoc-tap/mathematics')
  })

  it('navigateTo: path khác không liên quan → navigate thẳng, không qua goToSubjects', () => {
    setHostname('localhost')
    const navigate = vi.fn()
    navigateTo(navigate, '/progress')
    expect(navigate).toHaveBeenCalledWith('/progress')
  })
})

// ── Trạng thái MẶC ĐỊNH: chưa bật ────────────────────────────────────────────────────────
// Cho phép deploy code trước, bật sau khi DNS + chứng chỉ của host mới đã sống.
describe('khi tính năng CHƯA bật', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SUBJECTS_HOSTNAME', '')
  })

  it('không có host trụ Học tập nào', () => {
    expect(subjectsHostname()).toBe('')
  })

  it('không host nào được coi là host Học tập', () => {
    expect(isSubjectsHost(HOC_TAP)).toBe(false)
  })

  it('mọi điều hướng ở lại origin hiện tại, đường dẫn vẫn là /goc-hoc-tap', () => {
    expect(subjectsTarget('www.donghanhcungban.org')).toEqual({
      kind: 'path',
      value: '/goc-hoc-tap',
    })
    expect(subjectsTarget('www.donghanhcungban.org', 'physics')).toEqual({
      kind: 'path',
      value: '/goc-hoc-tap/physics',
    })
  })
})
