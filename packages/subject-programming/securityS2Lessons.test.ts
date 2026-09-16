import { describe, expect, it } from 'vitest'
import { P6U186_LESSONS } from './lessons/p6u186.js'
import { P6U187_LESSONS } from './lessons/p6u187.js'
import { P6U188_LESSONS } from './lessons/p6u188.js'
import { P6U189_LESSONS } from './lessons/p6u189.js'

const lessons = [...P6U186_LESSONS, ...P6U187_LESSONS, ...P6U188_LESSONS, ...P6U189_LESSONS]
const evidence = lessons
  .map((x) => `${x.title}\n${x.theory}\n${x.make.prompt}`)
  .join('\n')
  .toLowerCase()

describe('security-s2 — assessment và disclosure defensive', () => {
  it('có bốn unit, tám lesson Python và Make visible/hidden contains', () => {
    expect(lessons).toHaveLength(8)
    for (const unit of ['p6-u186', 'p6-u187', 'p6-u188', 'p6-u189']) {
      expect(lessons.filter((x) => x.unitId === unit)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((x) => !x.hidden)).toBe(true)
      expect(lesson.make.testCases.some((x) => x.hidden)).toBe(true)
      expect(lesson.make.testCases.every((x) => x.match === 'contains')).toBe(true)
    }
  })

  it('giữ consent/scope/refuse, redaction, non-destructive, rotate, embargo và remediation', () => {
    for (const marker of [
      'consent',
      'scope',
      'refuse',
      'redacted',
      'non-destructive',
      'rotate',
      'embargo',
      'remediation',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('không gọi external I/O', () => {
    const code = lessons
      .flatMap((x) => [
        x.workedExample.code,
        x.predict.code,
        x.parsons.lines.join('\n'),
        x.make.starterCode,
        x.make.sampleSolution,
      ])
      .join('\n')
    expect(code).not.toMatch(/\bopen\(|\b(?:import|from)\s+(?:requests|socket|subprocess)\b/i)
  })
})
