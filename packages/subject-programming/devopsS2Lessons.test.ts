import { describe, expect, it } from 'vitest'
import { P6U178_LESSONS } from './lessons/p6u178.js'
import { P6U179_LESSONS } from './lessons/p6u179.js'
import { P6U180_LESSONS } from './lessons/p6u180.js'
import { P6U181_LESSONS } from './lessons/p6u181.js'

const lessons = [...P6U178_LESSONS, ...P6U179_LESSONS, ...P6U180_LESSONS, ...P6U181_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('devops-s2 — policy simulator bounded, deterministic và fail closed', () => {
  it('có bốn unit, tám lesson Python cùng Make visible và hidden', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u178', 'p6-u179', 'p6-u180', 'p6-u181']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('khóa root, secret, digest, promotion, rollback, lock, drift, wildcard và budget', () => {
    for (const marker of [
      'root',
      'secret',
      'digest',
      'immutable',
      'rollback',
      'lock',
      'drift',
      'wildcard',
      'budget',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('không thực thi Docker, cloud, shell hay external I/O', () => {
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
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|terraform|docker\s+run|kubectl|boto3/i,
    )
  })
})
