// Test navPaths — bảng tiền tố đường dẫn dùng chung cho BottomNav/DesktopSidebar.
import { describe, it, expect } from 'vitest'
import {
  LEARNING_PATHS,
  PRACTICE_PATHS,
  COMPANION_PATHS,
  PRICING_PATHS,
  PROFILE_PATHS,
  ENGLISH_PATHS,
  NOTES_PATHS,
  LEGACY_NOTES_PATHS,
  REMOVED_DOMAIN_PATHS,
  PROGRESS_PATHS,
  matchesNav,
  resolveActiveNav,
  underPrefix,
} from './navPaths.js'

// Mọi bảng path phải là mảng khác rỗng — nếu ai đó lỡ xoá sạch nội dung, test này bắt ngay.
describe('các bảng hằng path', () => {
  it.each([
    ['LEARNING_PATHS', LEARNING_PATHS],
    ['PRACTICE_PATHS', PRACTICE_PATHS],
    ['COMPANION_PATHS', COMPANION_PATHS],
    ['PRICING_PATHS', PRICING_PATHS],
    ['PROFILE_PATHS', PROFILE_PATHS],
    ['ENGLISH_PATHS', ENGLISH_PATHS],
    ['NOTES_PATHS', NOTES_PATHS],
    ['LEGACY_NOTES_PATHS', LEGACY_NOTES_PATHS],
    ['REMOVED_DOMAIN_PATHS', REMOVED_DOMAIN_PATHS],
    ['PROGRESS_PATHS', PROGRESS_PATHS],
  ])('%s không rỗng và mọi phần tử bắt đầu bằng "/"', (_name, paths) => {
    expect(paths.length).toBeGreaterThan(0)
    for (const p of paths) expect(p.startsWith('/')).toBe(true)
  })
})

// [2026-09-20] Ba trụ Sự nghiệp · Khởi nghiệp · Đời sống bị gỡ hẳn; chỉ còn "Ghi chú".
describe('bảng path sau khi gỡ ba trụ', () => {
  it('NOTES_PATHS bắt đầu bằng đường CHÍNH THỨC /ghi-chu', () => {
    // `resolveActiveNav` lấy mục ĐẦU TIÊN khớp, và `Item.to` của mục Ghi chú là `/ghi-chu` —
    // bảng này chỉ dùng để so khớp, nhưng để đầu bảng là đường chính thức giúp đọc code dễ.
    expect(NOTES_PATHS[0]).toBe('/ghi-chu')
  })

  it('mọi URL cũ của trụ Công việc đều nằm trong NOTES_PATHS (sidebar không nhấp nháy)', () => {
    // Trong nhịp render TRƯỚC khi <Navigate> kịp chạy, sidebar vẫn phải sáng mục "Ghi chú".
    for (const p of LEGACY_NOTES_PATHS)
      expect(NOTES_PATHS.some((n) => underPrefix(p, n))).toBe(true)
  })

  it('KHÔNG đường nào của ba trụ đã gỡ còn làm sáng mục Ghi chú hay Hồ sơ', () => {
    for (const p of REMOVED_DOMAIN_PATHS) {
      expect(matchesNav(p, NOTES_PATHS), p).toBe(false)
      expect(matchesNav(p, PROFILE_PATHS), p).toBe(false)
    }
  })

  it('hai bảng URL cũ KHÔNG giao nhau — một đường chỉ có MỘT đích chuyển hướng', () => {
    // Giao nhau nghĩa là App.tsx dựng hai <Route> cùng path: React Router lấy cái đầu, cái sau
    // chết lặng. Đúng loại lỗi không ai thấy cho tới khi người dùng báo link sai chỗ.
    const removed = new Set<string>(REMOVED_DOMAIN_PATHS)
    for (const p of LEGACY_NOTES_PATHS) expect(removed.has(p), p).toBe(false)
  })
})

describe('matchesNav', () => {
  it('khớp khi pathname trùng chính xác một tiền tố', () => {
    expect(matchesNav('/tien-do', PROGRESS_PATHS)).toBe(true)
  })

  it('khớp khi pathname là trang con (khớp một phần theo tiền tố)', () => {
    expect(matchesNav('/luyen-tap/bai-1', PRACTICE_PATHS)).toBe(true)
  })

  // [Slice 03] Công cụ Tiếng Anh thuộc MÔN, không thuộc "Luyện tập" (hub đa môn).
  it.each([
    '/tro-truyen',
    '/luyen-noi',
    '/luyen-viet',
    '/tu-dien',
    '/tu-vung/apple',
    '/placement',
    '/cai-dat',
    '/thu-thach',
  ])('%s thuộc ENGLISH_PATHS + LEARNING_PATHS, KHÔNG thuộc PRACTICE_PATHS', (p) => {
    expect(matchesNav(p, ENGLISH_PATHS)).toBe(true)
    expect(matchesNav(p, LEARNING_PATHS)).toBe(true)
    expect(matchesNav(p, PRACTICE_PATHS)).toBe(false)
  })

  it('không khớp khi pathname không thuộc nhóm', () => {
    expect(matchesNav('/khong-ton-tai', PROGRESS_PATHS)).toBe(false)
  })

  it('chuỗi rỗng không khớp bất kỳ tiền tố nào (trừ khi tiền tố cũng rỗng)', () => {
    expect(matchesNav('', PROGRESS_PATHS)).toBe(false)
  })

  it('mảng path rỗng thì không bao giờ khớp', () => {
    expect(matchesNav('/tien-do', [])).toBe(false)
  })

  // Slice 02: khớp theo BIÊN đoạn — `/goc-hoc-tap/english-abc` không được làm sáng "Tiếng Anh".
  it('khớp theo BIÊN đoạn, không phải chuỗi con', () => {
    expect(matchesNav('/goc-hoc-tap/english-abc', ENGLISH_PATHS)).toBe(false)
    expect(matchesNav('/goc-hoc-tap/english/x', ENGLISH_PATHS)).toBe(true)
    expect(matchesNav('/luyen-tapx', PRACTICE_PATHS)).toBe(false)
  })
})

describe('underPrefix', () => {
  it.each([
    ['/goc-hoc-tap', '/goc-hoc-tap', true],
    ['/goc-hoc-tap/english', '/goc-hoc-tap', true],
    ['/goc-hoc-tap-abc', '/goc-hoc-tap', false],
    ['/goc-hoc-tapabc', '/goc-hoc-tap', false],
    ['/', '/', true],
    ['/x', '/', true],
    ['/x', '', false],
  ])('%s dưới %s → %s', (pathname, prefix, expected) => {
    expect(underPrefix(pathname, prefix)).toBe(expected)
  })
})

describe('resolveActiveNav', () => {
  it('trả về to của entry khớp ĐẦU TIÊN theo thứ tự (ai đứng trước thắng)', () => {
    const result = resolveActiveNav('/goc-hoc-tap/english', [
      { to: '/english', paths: ENGLISH_PATHS },
      { to: '/phong-hoc', paths: LEARNING_PATHS },
    ])
    expect(result).toBe('/english')
  })

  it('entry sau vẫn khớp nếu entry trước không khớp', () => {
    const result = resolveActiveNav('/luyen-tap', [
      { to: '/english', paths: ENGLISH_PATHS },
      { to: '/luyen-tap', paths: PRACTICE_PATHS },
    ])
    expect(result).toBe('/luyen-tap')
  })

  it('không entry nào khớp → trả về null', () => {
    const result = resolveActiveNav('/khong-ton-tai', [{ to: '/english', paths: ENGLISH_PATHS }])
    expect(result).toBeNull()
  })

  it('entry exact=true chỉ khớp khi pathname bằng CHÍNH XÁC to', () => {
    expect(resolveActiveNav('/', [{ to: '/', exact: true }])).toBe('/')
    expect(resolveActiveNav('/khac', [{ to: '/', exact: true }])).toBeNull()
  })

  it('entry không truyền paths thì dùng chính [to] làm tiền tố duy nhất', () => {
    expect(resolveActiveNav('/nang-cap', [{ to: '/nang-cap' }])).toBe('/nang-cap')
    expect(resolveActiveNav('/nang-cap/xyz', [{ to: '/nang-cap' }])).toBe('/nang-cap')
    expect(resolveActiveNav('/khac', [{ to: '/nang-cap' }])).toBeNull()
  })

  it('mảng entries rỗng → luôn null', () => {
    expect(resolveActiveNav('/tien-do', [])).toBeNull()
  })
})
