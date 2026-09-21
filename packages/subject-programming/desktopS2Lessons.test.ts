import { describe, expect, it } from 'vitest'
import { P6U278_LESSONS } from './lessons/p6u278.js'
import { P6U279_LESSONS } from './lessons/p6u279.js'
import { P6U280_LESSONS } from './lessons/p6u280.js'
import { P6U281_LESSONS } from './lessons/p6u281.js'

const lessons = [...P6U278_LESSONS, ...P6U279_LESSONS, ...P6U280_LESSONS, ...P6U281_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('desktop-s2 — việc nền, trải nghiệm, đồng bộ tuỳ chọn và chẩn đoán từ xa', () => {
  it('có bốn unit, tám lesson Python cùng Make visible và hidden', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u278', 'p6-u279', 'p6-u280', 'p6-u281']) {
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

  it('khoá ui thread, cancel, undo, redo, drift, encrypted, consent và pii', () => {
    for (const marker of [
      'ui thread',
      'cancel',
      'undo',
      'redo',
      'drift',
      'encrypted',
      'consent',
      'pii',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('nhắc rõ đây là MÔ PHỎNG, không dựng giao diện hay đồng bộ thật', () => {
    for (const lesson of lessons) {
      expect(lesson.title.startsWith('MÔ PHỎNG')).toBe(true)
      expect(lesson.theory).toContain('MÔ PHỎNG')
    }
  })

  it('không đụng luồng, tệp, mạng, thời gian thực hay random', () => {
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
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|import\s+(os|sys)\b|threading|asyncio/i,
    )
  })
})
