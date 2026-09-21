import { describe, expect, it } from 'vitest'
import { P6U258_LESSONS } from './lessons/p6u258.js'
import { P6U259_LESSONS } from './lessons/p6u259.js'
import { P6U260_LESSONS } from './lessons/p6u260.js'
import { P6U261_LESSONS } from './lessons/p6u261.js'

const lessons = [...P6U258_LESSONS, ...P6U259_LESSONS, ...P6U260_LESSONS, ...P6U261_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('embedded-s1 — GPIO, ngoại vi, ngắt và cô lập lỗi phần cứng', () => {
  it('có bốn unit, tám lesson Python cùng Make visible và hidden', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u258', 'p6-u259', 'p6-u260', 'p6-u261']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('mỗi lesson đều dán nhãn MÔ PHỎNG, không hứa kết quả từ phần cứng thật', () => {
    for (const lesson of lessons) {
      expect(lesson.title).toContain('MÔ PHỎNG')
      expect(lesson.theory).toContain('MÔ PHỎNG')
    }
  })

  it('khóa pull-up, datasheet, isr, debounce và logic analyzer', () => {
    for (const marker of ['pull-up', 'datasheet', 'isr', 'debounce', 'logic analyzer']) {
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
