import { describe, expect, it } from 'vitest'
import { P6U206_LESSONS } from './lessons/p6u206.js'
import { P6U207_LESSONS } from './lessons/p6u207.js'
import { P6U208_LESSONS } from './lessons/p6u208.js'
import { P6U209_LESSONS } from './lessons/p6u209.js'

const lessons = [...P6U206_LESSONS, ...P6U207_LESSONS, ...P6U208_LESSONS, ...P6U209_LESSONS]

// Phần "bằng chứng nội dung" — nơi marker của chặng phải xuất hiện.
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

// Mọi văn xuôi — dùng cho luật miễn trừ pháp lý và luật "không thành playbook tấn công".
const prose = lessons
  .map((lesson) => `${lesson.title}\n${lesson.hook}\n${lesson.theory}\n${lesson.homework}`)
  .join('\n')
  .toLocaleLowerCase('vi')

// Code CHẠY ĐƯỢC — nơi tuyệt đối không có I/O ngoài, random, dữ liệu cá nhân hay từ vựng tấn công.
const code = lessons
  .flatMap((lesson) => [
    lesson.workedExample.code,
    lesson.predict.code,
    lesson.parsons.lines.join('\n'),
    lesson.make.starterCode,
    lesson.make.sampleSolution,
  ])
  .join('\n')

// Mọi chuỗi đi vào/ra simulator — fixture phải là NHÃN tổng hợp, không phải dữ liệu thật.
const fixtures = lessons
  .flatMap((lesson) =>
    lesson.make.testCases.flatMap((testCase) => [...testCase.stdinLines, testCase.expected]),
  )
  .join('\n')

/** Từ vựng quyết định đã chốt ở ③ của đặc tả — output nào ngoài danh sách này là lệch hợp đồng. */
const QUYET_DINH = [
  'allow',
  'deny',
  'block',
  'violated',
  'conflict',
  'incomparable',
  'suppress',
  'redact',
  'noisy',
  'inadmissible',
  'incomplete',
  'invalid',
  'unknown',
  'not-reported',
]

/**
 * Từ vựng TẤN CÔNG bị cấm (đặc tả ④ + ⑦ rủi ro 1). `security-s4` là chặng PHÒNG THỦ: bài chỉ
 * dạy phân loại, quyết định và quy trình, không bao giờ trở thành hướng dẫn tấn công.
 * Dùng biên từ (`\b`) để không bắt oan chuỗi con vô hại (vd "rop" trong "properties").
 */
const TU_VUNG_TAN_CONG = [
  'exploit',
  'payload',
  'shellcode',
  'rop',
  'bypass',
  'scan',
  'bruteforce',
  'reverse engineer',
]

describe('security-s4 — kiến trúc an toàn, ứng cứu, điều tra số và quản trị tuân thủ', () => {
  it('có bốn unit, tám lesson Python cùng Make visible, hidden và ca âm', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u206', 'p6-u207', 'p6-u208', 'p6-u209']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
      // Ca âm: ít nhất một ca rơi vào nhánh fail closed `invalid:`.
      expect(
        lesson.make.testCases.some((testCase) => testCase.expected.startsWith('invalid:')),
        `${lesson.id} thiếu ca âm invalid`,
      ).toBe(true)
    }
  })

  it('mọi output của Make dùng đúng từ vựng quyết định đã chốt', () => {
    for (const lesson of lessons) {
      for (const testCase of lesson.make.testCases) {
        const decision = testCase.expected.split(':', 1)[0]
        expect(QUYET_DINH, `${lesson.id}: quyết định lạ "${decision}"`).toContain(decision)
      }
    }
  })

  it('KHÔNG có từ vựng tấn công trong code chạy được, fixture lẫn văn xuôi', () => {
    for (const tu of TU_VUNG_TAN_CONG) {
      const khuon = new RegExp(`\\b${tu}\\b`, 'i')
      expect(code, `code chạy được có từ vựng tấn công: ${tu}`).not.toMatch(khuon)
      expect(fixtures, `fixture có từ vựng tấn công: ${tu}`).not.toMatch(khuon)
      expect(prose, `văn xuôi có từ vựng tấn công: ${tu}`).not.toMatch(khuon)
    }
  })

  it('khoá trust boundary, zero trust, segmentation, key lifecycle, rotate, detection rule, att&ck, containment, eradication, chain of custody, integrity, utc, redact, residual risk, third-party và evidence', () => {
    for (const marker of [
      'trust boundary',
      'zero trust',
      'segmentation',
      'key lifecycle',
      'rotate',
      'detection rule',
      'att&ck',
      'containment',
      'eradication',
      'chain of custody',
      'integrity',
      'utc',
      'redact',
      'residual risk',
      'third-party',
      'evidence',
    ]) {
      expect(evidence, `thiếu marker: ${marker}`).toContain(marker)
    }
  })

  it('không gọi hệ ngoài, mạng, file, subprocess, random hay đồng hồ hệ thống', () => {
    expect(code).not.toMatch(
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|time\.time|import\s+(os|sys)\b|paramiko|scapy|hashlib\.new/i,
    )
  })

  it('không lộ giá trị khoá/bí mật hay dữ liệu cá nhân — chỉ nhãn tham chiếu', () => {
    for (const [ten, khuon] of [
      ['email', /[\w.+-]+@[\w-]+\.[a-z]{2,}/i],
      ['dãy số định danh', /\b\d{9,12}\b/],
      ['ngày sinh đầy đủ', /\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/],
      ['giá trị khoá/bí mật', /\b(secret|api[_-]?key|private[_-]?key|token)\s*=\s*["'][^"']+["']/i],
    ] as const) {
      expect(code, `code chạy được lộ ${ten}`).not.toMatch(khuon)
      expect(fixtures, `fixture lộ ${ten}`).not.toMatch(khuon)
    }
  })

  it('bài quản trị tuân thủ có câu miễn trừ "không thay thế ý kiến pháp lý"', () => {
    for (const lesson of P6U209_LESSONS) {
      expect(
        lesson.theory.toLocaleLowerCase('vi'),
        `${lesson.id} thiếu câu miễn trừ pháp lý`,
      ).toContain('không thay thế ý kiến pháp lý')
    }
  })

  it('không tự nhận là tư vấn pháp lý hay thao tác trên hệ thật', () => {
    for (const cam of ['tư vấn pháp lý', 'hệ thống thật của bạn', 'dữ liệu production']) {
      expect(prose, `cụm từ cấm: ${cam}`).not.toContain(cam)
    }
  })

  it('kiểm soát khai đạt mà không có bằng chứng phải ra not-reported, không bao giờ thành allow', () => {
    const ca = P6U209_LESSONS.flatMap((lesson) => lesson.make.testCases).filter((testCase) =>
      testCase.stdinLines.some((d) => d.includes('kiemsoat:dat') && d.includes('bangchung:no')),
    )
    expect(ca.length, 'thiếu ca kiểm soát khai đạt mà không có bằng chứng').toBeGreaterThan(0)
    for (const testCase of ca) {
      expect(testCase.expected.startsWith('not-reported:')).toBe(true)
    }
  })

  it('luật phát hiện không bắt được ca dương tính nào thì ra noisy, không được bật', () => {
    const ca = P6U207_LESSONS.flatMap((lesson) => lesson.make.testCases).filter((testCase) =>
      testCase.stdinLines.some((d) => d.includes('dung:0')),
    )
    expect(ca.length, 'thiếu ca luật phát hiện rỗng tín hiệu').toBeGreaterThan(0)
    for (const testCase of ca) {
      expect(testCase.expected.startsWith('noisy:')).toBe(true)
    }
  })
})
