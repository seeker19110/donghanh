import { describe, expect, it } from 'vitest'
import { P6U182_LESSONS } from './lessons/p6u182.js'
import { P6U183_LESSONS } from './lessons/p6u183.js'
import { P6U184_LESSONS } from './lessons/p6u184.js'
import { P6U185_LESSONS } from './lessons/p6u185.js'

const lessons = [...P6U182_LESSONS, ...P6U183_LESSONS, ...P6U184_LESSONS, ...P6U185_LESSONS]
const evidence = lessons
  .map((x) => `${x.title}\n${x.theory}\n${x.make.prompt}`)
  .join('\n')
  .toLowerCase()

describe('security-s1 — policy phòng thủ fail closed', () => {
  it('có bốn unit, tám lesson Python với Make visible/hidden contains', () => {
    expect(lessons).toHaveLength(8)
    for (const unit of ['p6-u182', 'p6-u183', 'p6-u184', 'p6-u185']) {
      expect(lessons.filter((x) => x.unitId === unit)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((x) => !x.hidden)).toBe(true)
      expect(lesson.make.testCases.some((x) => x.hidden)).toBe(true)
      expect(lesson.make.testCases.every((x) => x.match === 'contains')).toBe(true)
    }
  })

  it('giữ boundary unknown-risk, salt rotation, server-side và revoke expiry', () => {
    for (const marker of [
      'boundary',
      'unknown-risk',
      'salt',
      'rotation',
      'deny',
      'server-side',
      'revoked',
      'expired',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('không chứa I/O, scan hay exploit', () => {
    const code = lessons
      .flatMap((x) => [
        x.workedExample.code,
        x.predict.code,
        x.parsons.lines.join('\n'),
        x.make.starterCode,
        x.make.sampleSolution,
      ])
      .join('\n')
    expect(code).not.toMatch(
      /\bopen\(|\brequests\b|\bsocket\b|\bsubprocess\b|\bscan\b|\bexploit\b/i,
    )
  })
})
