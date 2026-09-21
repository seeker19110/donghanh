import { describe, expect, it } from 'vitest'
import { P6U282_LESSONS } from './lessons/p6u282.js'
import { P6U283_LESSONS } from './lessons/p6u283.js'
import { P6U284_LESSONS } from './lessons/p6u284.js'
import { P6U285_LESSONS } from './lessons/p6u285.js'

const lessons = [...P6U282_LESSONS, ...P6U283_LESSONS, ...P6U284_LESSONS, ...P6U285_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('desktop-s3 — dữ liệu lớn, khởi động, hệ plugin và kiểm thử đa nền', () => {
  it('có bốn unit, tám lesson Python cùng Make visible và hidden', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u282', 'p6-u283', 'p6-u284', 'p6-u285']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('mỗi bài có ít nhất một ca âm — fixture sai miền/sai kiểu phải fail closed', () => {
    for (const lesson of lessons) {
      expect(
        lesson.make.testCases.some(
          (testCase) =>
            testCase.expected.startsWith('invalid:') ||
            testCase.expected.startsWith('deny:') ||
            testCase.expected.startsWith('reject:') ||
            testCase.expected.startsWith('refuse:'),
        ),
      ).toBe(true)
    }
  })

  it('khoá stream, virtualiz, index, startup, sandbox, api version và platform', () => {
    for (const marker of [
      'stream',
      'virtualiz',
      'index',
      'startup',
      'sandbox',
      'api version',
      'platform',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('nhắc rõ đây là MÔ PHỎNG, không nạp plugin hay đo hiệu năng thật', () => {
    for (const lesson of lessons) {
      expect(lesson.title.startsWith('MÔ PHỎNG')).toBe(true)
      expect(lesson.theory).toContain('MÔ PHỎNG')
    }
  })

  it('không đụng tệp, tiến trình, mạng, thời gian thực hay random', () => {
    const code = lessons
      .flatMap((lesson) => [
        lesson.workedExample.code,
        lesson.predict.code,
        lesson.parsons.lines.join('\n'),
        lesson.make.starterCode,
        lesson.make.sampleSolution,
      ])
      .join('\n')
    expect(code).not.toMatch(
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|import\s+(os|sys)\b|threading|sqlite3|mmap/i,
    )
  })
})
