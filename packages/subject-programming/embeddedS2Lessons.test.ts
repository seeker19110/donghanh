import { describe, expect, it } from 'vitest'
import { P6U262_LESSONS } from './lessons/p6u262.js'
import { P6U263_LESSONS } from './lessons/p6u263.js'
import { P6U264_LESSONS } from './lessons/p6u264.js'
import { P6U265_LESSONS } from './lessons/p6u265.js'

const lessons = [...P6U262_LESSONS, ...P6U263_LESSONS, ...P6U264_LESSONS, ...P6U265_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('embedded-s2 — RTOS, kết nối, cập nhật từ xa và năng lượng', () => {
  it('có bốn unit, tám lesson Python cùng Make visible và hidden', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u262', 'p6-u263', 'p6-u264', 'p6-u265']) {
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

  it('khóa stack budget, checksum, signature, rollback và battery budget', () => {
    for (const marker of ['stack budget', 'checksum', 'signature', 'rollback', 'battery budget']) {
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
