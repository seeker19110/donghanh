import { describe, expect, it } from 'vitest'
import { P6U154_LESSONS } from './lessons/p6u154.js'
import { P6U155_LESSONS } from './lessons/p6u155.js'
import { P6U156_LESSONS } from './lessons/p6u156.js'
import { P6U157_LESSONS } from './lessons/p6u157.js'

const lessons = [...P6U154_LESSONS, ...P6U155_LESSONS, ...P6U156_LESSONS, ...P6U157_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLowerCase()

describe('devops-s1 — simulator fail closed và không giả Linux thật', () => {
  it('có bốn unit, tám lesson Python và visible/hidden Make case', () => {
    expect(lessons).toHaveLength(8)
    for (const unit of ['p6-u154', 'p6-u155', 'p6-u156', 'p6-u157']) {
      expect(lessons.filter((lesson) => lesson.unitId === unit)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.title).toContain('MÔ PHỎNG')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
    }
  })

  it('khóa service, network, automation và restore theo evidence', () => {
    for (const marker of [
      'journal',
      'triage',
      'dns',
      'tls',
      'blocked:port',
      'fail-fast',
      'idempotency',
      'secret',
      'off-site',
      'restore evidence',
      'rpo',
      'rto',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('không đánh đồng mô phỏng với host, VPS hay công cụ vận hành thật', () => {
    expect(evidence).toContain('mô phỏng')
    expect(evidence).toMatch(/không (?:gọi|truy vấn|cấu hình|chạy|đo|tạo|restore)/)
    expect(evidence).toContain('linux')
  })
})
