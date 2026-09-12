// Test hàm thuần tính quyền mở cấp CEFR — chạy KHÔNG cần DB (bất biến §⑤ của đặc tả
// docs/specs/2026-09-12-gd2-vip-hoc-tu-do-mon-anh.md). Bám sát 7 tiêu chí chấp nhận §④.

import { describe, it, expect } from 'vitest'
import { computeUnlockedLevels, CEFR_LEVEL_ORDER } from './cefrUnlock.js'

const ALL = [...CEFR_LEVEL_ORDER]

describe('computeUnlockedLevels — VIP học tự do', () => {
  it('VIP chưa thi cấp nào vẫn mở cả 6 cấp (tiêu chí 1)', () => {
    expect(computeUnlockedLevels({ plan: 'vip', exams: {} })).toEqual(ALL)
  })

  it('VIP không cần grandfather để mở hết', () => {
    expect(computeUnlockedLevels({ plan: 'vip', exams: null, grandfathered: [] })).toEqual(ALL)
  })
})

describe('computeUnlockedLevels — Free đi tuần tự', () => {
  it('Free chưa thi cấp nào → chỉ A1 (tiêu chí 2)', () => {
    expect(computeUnlockedLevels({ plan: 'free', exams: {} })).toEqual(['A1'])
  })

  it('Free thi đạt A1 → mở A1 + A2 (tiêu chí 3)', () => {
    const exams = { A1: { passed: true, bestPct: 80, attempts: 1, lastAt: '2026-09-12' } }
    expect(computeUnlockedLevels({ plan: 'free', exams })).toEqual(['A1', 'A2'])
  })

  it('Free thi A1 KHÔNG đạt → vẫn chỉ A1', () => {
    expect(computeUnlockedLevels({ plan: 'free', exams: { A1: { passed: false } } })).toEqual([
      'A1',
    ])
  })

  it('đạt nhiều cấp liên tiếp → mở tới cấp kế tiếp cấp cao nhất đã đạt', () => {
    const exams = { A1: { passed: true }, A2: { passed: true }, B1: { passed: true } }
    expect(computeUnlockedLevels({ plan: 'free', exams })).toEqual(['A1', 'A2', 'B1', 'B2'])
  })

  it('đạt C2 không sinh cấp thứ 7 (ca biên cuối thang)', () => {
    const exams = Object.fromEntries(CEFR_LEVEL_ORDER.map((l) => [l, { passed: true }]))
    expect(computeUnlockedLevels({ plan: 'free', exams })).toEqual(ALL)
  })
})

describe('computeUnlockedLevels — grandfather (chống hồi tố, tiêu chí 5)', () => {
  it('user cũ có [A1,A2,B1] mà chưa thi cấp nào vẫn mở đúng 3 cấp đó', () => {
    const got = computeUnlockedLevels({
      plan: 'free',
      exams: {},
      grandfathered: ['A1', 'A2', 'B1'],
    })
    expect(got).toEqual(['A1', 'A2', 'B1'])
  })

  it('grandfather hợp với quyền thi thật, trả đúng thứ tự A1→C2', () => {
    const got = computeUnlockedLevels({
      plan: 'free',
      exams: { B2: { passed: true } },
      grandfathered: ['B1'],
    })
    expect(got).toEqual(['A1', 'B1', 'C1'])
  })

  it('bỏ qua giá trị rác trong grandfather (không có cấp "Z9")', () => {
    const got = computeUnlockedLevels({ plan: 'free', exams: {}, grandfathered: ['Z9', 'A2'] })
    expect(got).toEqual(['A1', 'A2'])
  })
})

describe('computeUnlockedLevels — hạ VIP → Free (tiêu chí 6)', () => {
  it('VIP mở B2; hết hạn về Free thì B2 khoá lại, cấp thi đạt thật vẫn mở', () => {
    const exams = { A1: { passed: true } }
    expect(computeUnlockedLevels({ plan: 'vip', exams })).toEqual(ALL)
    // Lần đọc sau khi hết hạn: chỉ còn quyền do thi thật.
    expect(computeUnlockedLevels({ plan: 'free', exams })).toEqual(['A1', 'A2'])
  })
})

describe('computeUnlockedLevels — dữ liệu exams méo mó không mở thêm quyền', () => {
  it.each([
    ['exams null', null],
    ['exams undefined', undefined],
    ['passed là chuỗi "true"', { A1: { passed: 'true' } }],
    ['giá trị là mảng', { A1: ['passed'] }],
    ['giá trị là null', { A1: null }],
    ['giá trị là số', { A1: 1 }],
  ])('%s → chỉ A1', (_label, exams) => {
    expect(
      computeUnlockedLevels({ plan: 'free', exams: exams as Record<string, unknown> }),
    ).toEqual(['A1'])
  })

  it('hàm THUẦN: gọi hai lần cùng đầu vào cho cùng kết quả, không đổi đầu vào', () => {
    const exams = { A1: { passed: true } }
    const grandfathered = ['B1']
    const first = computeUnlockedLevels({ plan: 'free', exams, grandfathered })
    const second = computeUnlockedLevels({ plan: 'free', exams, grandfathered })
    expect(first).toEqual(second)
    expect(exams).toEqual({ A1: { passed: true } })
    expect(grandfathered).toEqual(['B1'])
  })
})
