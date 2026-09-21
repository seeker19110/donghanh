import { describe, expect, it } from 'vitest'
import { P6U266_LESSONS } from './lessons/p6u266.js'
import { P6U267_LESSONS } from './lessons/p6u267.js'
import { P6U268_LESSONS } from './lessons/p6u268.js'
import { P6U269_LESSONS } from './lessons/p6u269.js'

const lessons = [...P6U266_LESSONS, ...P6U267_LESSONS, ...P6U268_LESSONS, ...P6U269_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('embedded-s3 — độ tin cậy, kiểm thử qua HAL, Linux nhúng và an toàn bộ nhớ', () => {
  it('có bốn unit, tám lesson Python cùng Make visible và hidden', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u266', 'p6-u267', 'p6-u268', 'p6-u269']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('mỗi lesson đều dán nhãn MÔ PHỎNG, không hứa kết quả từ phần cứng hay hệ điều hành thật', () => {
    for (const lesson of lessons) {
      expect(lesson.title).toContain('MÔ PHỎNG')
      expect(lesson.theory).toContain('MÔ PHỎNG')
    }
  })

  it('khóa watchdog, torn write, HAL, read-only và no_std', () => {
    for (const marker of ['watchdog', 'torn write', 'hal', 'read-only', 'no_std']) {
      expect(evidence).toContain(marker)
    }
  })

  it('không chạm phần cứng, hệ tệp, mạng, ngẫu nhiên hay đồng hồ hệ thống', () => {
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
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|import\s+(os|sys)\b|serial|smbus|RPi|machine\./i,
    )
  })
})
