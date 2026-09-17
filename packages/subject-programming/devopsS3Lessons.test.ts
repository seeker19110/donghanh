import { describe, expect, it } from 'vitest'
import { P6U194_LESSONS } from './lessons/p6u194.js'
import { P6U195_LESSONS } from './lessons/p6u195.js'
import { P6U196_LESSONS } from './lessons/p6u196.js'
import { P6U197_LESSONS } from './lessons/p6u197.js'

const lessons = [...P6U194_LESSONS, ...P6U195_LESSONS, ...P6U196_LESSONS, ...P6U197_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('devops-s3 — simulator Kubernetes, GitOps, quan sát và độ tin cậy', () => {
  it('có bốn unit, tám lesson Python cùng Make visible và hidden', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u194', 'p6-u195', 'p6-u196', 'p6-u197']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('khóa probe, request, limit, drift, reconcile, cardinality, symptom, burn, error budget, blast radius, abort và freeze', () => {
    for (const marker of [
      'probe',
      'request',
      'limit',
      'drift',
      'reconcile',
      'cardinality',
      'symptom',
      'burn',
      'error budget',
      'blast radius',
      'abort',
      'freeze',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('không gọi cluster, collector, shell hay external I/O', () => {
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
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|import\s+(os|sys)\b|kubectl|helm\s|prometheus/i,
    )
  })
})
