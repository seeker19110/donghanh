import { describe, expect, it } from 'vitest'
import { P6U166_LESSONS } from './lessons/p6u166.js'
import { P6U167_LESSONS } from './lessons/p6u167.js'
import { P6U168_LESSONS } from './lessons/p6u168.js'
import { P6U169_LESSONS } from './lessons/p6u169.js'
import { P6U170_LESSONS } from './lessons/p6u170.js'
import { P6U171_LESSONS } from './lessons/p6u171.js'
import { P6U172_LESSONS } from './lessons/p6u172.js'
import { P6U173_LESSONS } from './lessons/p6u173.js'
import { P6U174_LESSONS } from './lessons/p6u174.js'
import { P6U175_LESSONS } from './lessons/p6u175.js'
import { P6U176_LESSONS } from './lessons/p6u176.js'
import { P6U177_LESSONS } from './lessons/p6u177.js'

const lessons = [
  ...P6U166_LESSONS,
  ...P6U167_LESSONS,
  ...P6U168_LESSONS,
  ...P6U169_LESSONS,
  ...P6U170_LESSONS,
  ...P6U171_LESSONS,
  ...P6U172_LESSONS,
  ...P6U173_LESSONS,
  ...P6U174_LESSONS,
  ...P6U175_LESSONS,
  ...P6U176_LESSONS,
  ...P6U177_LESSONS,
]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('ai-s2..s4 — simulator ML/LLM bounded và fail closed', () => {
  it('có mười hai unit, hai mươi bốn lesson Python, Make visible và hidden', () => {
    expect(lessons).toHaveLength(24)
    for (let unit = 166; unit <= 177; unit += 1) {
      expect(lessons.filter((lesson) => lesson.unitId === `p6-u${unit}`)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('giữ các ranh giới leakage, số học, release và human review có evidence', () => {
    for (const marker of [
      'leakage',
      'denominator',
      'nhạy cảm',
      'dominated',
      'finite difference',
      'mask',
      'histogram shift',
      'quantization',
      'rollback',
      'quality=unknown',
      'idempotency',
      'human-review',
      'audit',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('không gọi I/O, model, GPU hay random bên ngoài simulator', () => {
    const executableCode = lessons
      .flatMap((lesson) => [
        lesson.workedExample.code,
        lesson.predict.code,
        lesson.parsons.lines.join('\n'),
        lesson.make.starterCode,
        lesson.make.sampleSolution,
      ])
      .join('\n')
    expect(executableCode).not.toMatch(
      /\bopen\(|\brequests\b|\burllib\b|\bsubprocess\b|\bsocket\b|\brandom\b|torch|tensorflow|transformers|cuda|gpu/i,
    )
  })
})
