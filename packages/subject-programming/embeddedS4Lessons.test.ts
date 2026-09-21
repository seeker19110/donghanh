import { describe, expect, it } from 'vitest'
import { P6U270_LESSONS } from './lessons/p6u270.js'
import { P6U271_LESSONS } from './lessons/p6u271.js'
import { P6U272_LESSONS } from './lessons/p6u272.js'
import { P6U273_LESSONS } from './lessons/p6u273.js'

const lessons = [...P6U270_LESSONS, ...P6U271_LESSONS, ...P6U272_LESSONS, ...P6U273_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('embedded-s4 — sản xuất, bảo mật thiết bị, vận hành đội và an toàn', () => {
  it('có bốn unit, tám lesson Python cùng Make visible và hidden', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u270', 'p6-u271', 'p6-u272', 'p6-u273']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('mỗi lesson đều dán nhãn MÔ PHỎNG, không hứa là chứng nhận an toàn chức năng thật', () => {
    for (const lesson of lessons) {
      expect(lesson.title).toContain('MÔ PHỎNG')
      expect(lesson.theory).toContain('MÔ PHỎNG')
    }
  })

  it('khóa calibration, duplicate identity, đợt nhỏ/canary và safe state', () => {
    for (const marker of ['calibration', 'duplicate identity', 'safe state']) {
      expect(evidence).toContain(marker)
    }
    expect(evidence).toMatch(/canary|đợt nhỏ/)
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
