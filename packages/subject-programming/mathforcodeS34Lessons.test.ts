import { describe, expect, it } from 'vitest'
import { P6U158_LESSONS } from './lessons/p6u158.js'
import { P6U159_LESSONS } from './lessons/p6u159.js'
import { P6U160_LESSONS } from './lessons/p6u160.js'
import { P6U161_LESSONS } from './lessons/p6u161.js'

const lessons = [...P6U158_LESSONS, ...P6U159_LESSONS, ...P6U160_LESSONS, ...P6U161_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('mathforcode S3-S4 — mô phỏng toán cho lập trình có hợp đồng rõ ràng', () => {
  it('có bốn unit, tám lesson Python và Make case hiện/ẩn', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u158', 'p6-u159', 'p6-u160', 'p6-u161']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
    }
  })

  it('khóa các trạng thái biên của vector, đại số tuyến tính và tối ưu', () => {
    for (const marker of [
      'vector-zero',
      'transform',
      'pivot',
      'vo-nghiem',
      'xác suất',
      'delta',
      'epsilon',
      'diverged',
      'mse',
      'gradient',
      'infeasible',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('không biến simulator thành runtime ML hay kết luận production', () => {
    expect(evidence).toContain('mô phỏng')
    expect(evidence).toMatch(/không (?:train|autograd|dùng thư viện ml|phải).*?(?:thật|production)/)
    const executableCode = lessons
      .flatMap((lesson) => [
        lesson.workedExample.code,
        lesson.predict.code,
        lesson.parsons.lines.join('\n'),
        lesson.make.starterCode,
        lesson.make.sampleSolution,
      ])
      .join('\n')
    expect(executableCode).not.toMatch(/import\s+(?:numpy|torch)|from\s+(?:numpy|torch)\b/i)
  })
})
