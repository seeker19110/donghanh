import { describe, expect, it } from 'vitest'
import { P6U286_LESSONS } from './lessons/p6u286.js'
import { P6U287_LESSONS } from './lessons/p6u287.js'
import { P6U288_LESSONS } from './lessons/p6u288.js'
import { P6U289_LESSONS } from './lessons/p6u289.js'

const lessons = [...P6U286_LESSONS, ...P6U287_LESSONS, ...P6U288_LESSONS, ...P6U289_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('desktop-s4 — cấp phép, cập nhật an toàn, bảo mật máy khách và hỗ trợ', () => {
  it('có bốn unit, tám lesson Python cùng Make visible và hidden', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u286', 'p6-u287', 'p6-u288', 'p6-u289']) {
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

  it('khoá license, clock rollback, rollback, signature, admin rights, vulnerable, affectedUserCount', () => {
    for (const marker of [
      'license',
      'clock rollback',
      'rollback',
      'signature',
      'admin rights',
      'vulnerable',
      'affectedusercount',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('nhắc rõ đây là MÔ PHỎNG, không ký mã hay phát hành bản cập nhật thật', () => {
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
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|import\s+(os|sys)\b|hashlib|hmac|time\./i,
    )
  })
})
