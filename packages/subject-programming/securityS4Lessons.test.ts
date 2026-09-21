// CỔNG NGỮ NGHĨA của chặng `security-s4` (đặc tả
// `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md` ④ và ⑤).
//
// Bất biến lớn nhất của chặng: đây là chặng PHÒNG THỦ. Rủi ro thật là một bài giải thích cách
// phòng thủ trượt thành một playbook tấn công — kiểu TypeScript không bắt được điều đó, nên
// danh sách từ vựng cấm dưới đây là thứ duy nhất canh nó bằng máy.
import { describe, expect, it } from 'vitest'
import { P6U206_LESSONS } from './lessons/p6u206.js'
import { P6U207_LESSONS } from './lessons/p6u207.js'
import { P6U208_LESSONS } from './lessons/p6u208.js'
import { P6U209_LESSONS } from './lessons/p6u209.js'

const lessons = [...P6U206_LESSONS, ...P6U207_LESSONS, ...P6U208_LESSONS, ...P6U209_LESSONS]

/** Phần "bằng chứng nội dung" — nơi marker của chặng phải xuất hiện. */
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

/** Code CHẠY ĐƯỢC — nơi tuyệt đối không có I/O ngoài, random hay từ vựng tấn công. */
const code = lessons
  .flatMap((lesson) => [
    lesson.workedExample.code,
    lesson.predict.code,
    lesson.parsons.lines.join('\n'),
    lesson.make.starterCode,
    lesson.make.sampleSolution,
  ])
  .join('\n')

/** Mọi chuỗi đi vào/ra simulator — fixture phải là NHÃN tổng hợp, không phải dữ liệu thật. */
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

  it('giữ đủ marker của chặng phòng thủ', () => {
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

  it('KHÔNG có từ vựng tấn công trong code chạy được — chặng này chỉ dạy phòng thủ', () => {
    for (const cam of [
      /\bexploit\w*\b/i,
      /\bpayload\b/i,
      /\bshellcode\b/i,
      /\brop\b/i,
      /\bbypass\b/i,
      /\bscan(?:ner|ning)?\b/i,
      /\bbrute-?force\b/i,
      /\breverse[\s-]engineer\w*\b/i,
    ]) {
      expect(code, `code chạy được chứa từ vựng tấn công: ${cam}`).not.toMatch(cam)
    }
  })

  it('không gọi mạng, file, subprocess, random hay đồng hồ hệ thống', () => {
    expect(code).not.toMatch(
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|time\.time|import\s+(os|sys)\b/i,
    )
  })

  it('không rò dữ liệu cá nhân hay giá trị bí mật ra code lẫn fixture', () => {
    for (const [ten, khuon] of [
      ['email', /[\w.+-]+@[\w-]+\.[a-z]{2,}/i],
      ['dãy số định danh', /\b\d{9,12}\b/],
      ['ngày sinh đầy đủ', /\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/],
      ['giá trị khoá/bí mật', /\b(?:secret|api[_-]?key|token)\s*=\s*["'][^"']+["']/i],
    ] as const) {
      expect(code, `code chạy được lộ ${ten}`).not.toMatch(khuon)
      expect(fixtures, `fixture lộ ${ten}`).not.toMatch(khuon)
    }
  })

  it('bài quản trị tuân thủ có câu miễn trừ "không thay thế ý kiến pháp lý"', () => {
    for (const lesson of P6U209_LESSONS) {
      const van = `${lesson.theory}\n${lesson.homework}`.toLocaleLowerCase('vi')
      expect(van, `${lesson.id} thiếu câu miễn trừ pháp lý`).toContain(
        'không thay thế ý kiến pháp lý',
      )
    }
  })

  it('luật bằng chứng: khai đạt mà không có bằng chứng phải ra not-reported, KHÔNG phải allow', () => {
    const caKhongBangChung = P6U209_LESSONS.flatMap((lesson) => lesson.make.testCases).filter(
      (testCase) => testCase.stdinLines.some((dong) => dong.includes('bangchung:khong')),
    )
    expect(caKhongBangChung.length, 'thiếu ca kiểm soát không có bằng chứng').toBeGreaterThan(0)
    for (const testCase of caKhongBangChung) {
      expect(testCase.expected.startsWith('not-reported:')).toBe(true)
    }
  })

  it('không tự nhận là tư vấn pháp lý hay thao tác trên hệ thống đang chạy', () => {
    const prose = lessons
      .map((lesson) => `${lesson.title}\n${lesson.hook}\n${lesson.theory}\n${lesson.homework}`)
      .join('\n')
      .toLocaleLowerCase('vi')
    for (const cam of ['tư vấn pháp lý', 'dò quét hệ thống', 'dữ liệu production']) {
      expect(prose, `cụm từ cấm: ${cam}`).not.toContain(cam)
    }
  })
})
