import { describe, expect, it } from 'vitest'
import { P6U162_LESSONS } from './lessons/p6u162.js'
import { P6U163_LESSONS } from './lessons/p6u163.js'
import { P6U164_LESSONS } from './lessons/p6u164.js'
import { P6U165_LESSONS } from './lessons/p6u165.js'

const lessons = [...P6U162_LESSONS, ...P6U163_LESSONS, ...P6U164_LESSONS, ...P6U165_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('algo-s2 — simulator thuật toán bounded, deterministic', () => {
  it('có bốn unit, tám lesson Python và Make case hiện/ẩn', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u162', 'p6-u163', 'p6-u164', 'p6-u165']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('khóa termination, ordering, đồ thị và greedy bằng evidence cụ thể', () => {
    for (const marker of [
      'trường hợp cơ sở',
      'cắt tỉa',
      'trie',
      'top-k',
      'cycle',
      'negative-edge',
      'khong-co-duong',
      'oracle',
      'counterexample',
      'exchange',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('không dùng I/O hoặc thư viện thuật toán ngoài simulator', () => {
    const executableCode = lessons
      .flatMap((lesson) => [
        lesson.workedExample.code,
        lesson.predict.code,
        lesson.parsons.lines.join('\n'),
        lesson.make.starterCode,
        lesson.make.sampleSolution,
      ])
      .join('\n')
    expect(executableCode).not.toMatch(/networkx|\bopen\(|\brandom\b|\btime\b|requests\b/i)
  })
})
