import { describe, expect, it } from 'vitest'
import { P6U202_LESSONS } from './lessons/p6u202.js'
import { P6U203_LESSONS } from './lessons/p6u203.js'
import { P6U204_LESSONS } from './lessons/p6u204.js'
import { P6U205_LESSONS } from './lessons/p6u205.js'

const lessons = [...P6U202_LESSONS, ...P6U203_LESSONS, ...P6U204_LESSONS, ...P6U205_LESSONS]

// Phần "bằng chứng nội dung" — nơi marker của chặng phải xuất hiện.
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

// Mọi văn xuôi — dùng cho luật miễn trừ pháp lý.
const prose = lessons
  .map((lesson) => `${lesson.title}\n${lesson.hook}\n${lesson.theory}\n${lesson.homework}`)
  .join('\n')
  .toLocaleLowerCase('vi')

// Code CHẠY ĐƯỢC — nơi tuyệt đối không có I/O ngoài, random hay dữ liệu cá nhân.
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

describe('data-s4 — nền tảng dữ liệu, độ tin cậy, định nghĩa chỉ số và đạo đức pháp lý', () => {
  it('có bốn unit, tám lesson Python cùng Make visible, hidden và ca âm', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u202', 'p6-u203', 'p6-u204', 'p6-u205']) {
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

  it('khoá owner, classification, retention, freshness, completeness, burn, conflict, version, grain, legal basis, purpose, k-anonymity và bias', () => {
    for (const marker of [
      'owner',
      'classification',
      'retention',
      'freshness',
      'completeness',
      'burn',
      'conflict',
      'version',
      'grain',
      'legal basis',
      'purpose',
      'k-anonymity',
      'bias',
    ]) {
      expect(evidence, `thiếu marker: ${marker}`).toContain(marker)
    }
  })

  it('không gọi kho dữ liệu, mạng, file, subprocess, random hay đồng hồ hệ thống', () => {
    expect(code).not.toMatch(
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|time\.time|import\s+(os|sys)\b|psycopg|sqlalchemy|boto3/i,
    )
  })

  it('không có giá trị dữ liệu cá nhân trong code chạy được lẫn fixture — chỉ nhãn phân loại', () => {
    // Email, số điện thoại/CCCD và ngày sinh đầy đủ là ba khuôn hay lọt nhất vào fixture.
    for (const [ten, khuon] of [
      ['email', /[\w.+-]+@[\w-]+\.[a-z]{2,}/i],
      ['dãy số định danh', /\b\d{9,12}\b/],
      ['ngày sinh đầy đủ', /\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/],
    ] as const) {
      expect(code, `code chạy được lộ ${ten}`).not.toMatch(khuon)
      expect(fixtures, `fixture lộ ${ten}`).not.toMatch(khuon)
    }
  })

  it('bài đạo đức pháp lý nén nhóm dưới ngưỡng k và không công bố số của nhóm đó', () => {
    const caSuppress = P6U205_LESSONS.flatMap((lesson) => lesson.make.testCases).filter(
      (testCase) => testCase.expected.startsWith('suppress:'),
    )
    expect(caSuppress.length, 'thiếu ca nén nhóm dưới ngưỡng k').toBeGreaterThan(0)
    for (const testCase of caSuppress) {
      // Quyết định nén không được kèm bất kỳ con số nào — nêu số là đã công bố thứ vừa từ chối.
      expect(testCase.expected, 'ca suppress vẫn để lọt con số').not.toMatch(/\d/)
    }
  })

  it('mọi bài chạm nội dung pháp luật đều có câu miễn trừ "không thay thế ý kiến pháp lý"', () => {
    for (const lesson of P6U205_LESSONS) {
      const van = `${lesson.theory}\n${lesson.homework}`.toLocaleLowerCase('vi')
      expect(van, `${lesson.id} thiếu câu miễn trừ pháp lý`).toContain(
        'không thay thế ý kiến pháp lý',
      )
    }
  })

  it('không tự nhận là tư vấn pháp lý hay phép đo trên hệ thật', () => {
    for (const cam of ['tư vấn pháp lý', 'kho dữ liệu thật của bạn', 'dữ liệu production']) {
      expect(prose, `cụm từ cấm: ${cam}`).not.toContain(cam)
    }
  })

  it('không nhân bản hợp đồng chi phí/quan sát của devops-s3 và devops-s4', () => {
    expect(evidence).not.toMatch(/cost-per-success|kv cache|golden path|att&ck/)
  })
})
