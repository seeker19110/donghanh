import { describe, expect, it } from 'vitest'
import { P6U190_LESSONS } from './lessons/p6u190.js'
import { P6U191_LESSONS } from './lessons/p6u191.js'
import { P6U192_LESSONS } from './lessons/p6u192.js'
import { P6U193_LESSONS } from './lessons/p6u193.js'

const lessons = [...P6U190_LESSONS, ...P6U191_LESSONS, ...P6U192_LESSONS, ...P6U193_LESSONS]
const evidence = lessons
  .map((x) => `${x.title}\n${x.theory}\n${x.make.prompt}`)
  .join('\n')
  .toLowerCase()

describe('architecture-s4 — quyết định Enterprise có evidence', () => {
  it('có bốn unit, tám lesson Python và Make visible/hidden contains', () => {
    expect(lessons).toHaveLength(8)
    for (const unit of ['p6-u190', 'p6-u191', 'p6-u192', 'p6-u193']) {
      expect(lessons.filter((x) => x.unitId === unit)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((x) => !x.hidden)).toBe(true)
      expect(lesson.make.testCases.some((x) => x.hidden)).toBe(true)
      expect(lesson.make.testCases.every((x) => x.match === 'contains')).toBe(true)
    }
  })

  it('giữ NFR measurable, shadow rollback, cycle/debt và ADR handoff evidence', () => {
    for (const marker of [
      'latency',
      'rollback',
      'shadow',
      'cycle',
      'debt',
      'acceptance',
      'revisit',
      'delegate',
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
