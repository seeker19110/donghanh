import { describe, expect, it } from 'vitest'
import { P6U150_LESSONS } from './lessons/p6u150.js'
import { P6U151_LESSONS } from './lessons/p6u151.js'
import { P6U152_LESSONS } from './lessons/p6u152.js'
import { P6U153_LESSONS } from './lessons/p6u153.js'

const LESSONS = [...P6U150_LESSONS, ...P6U151_LESSONS, ...P6U152_LESSONS, ...P6U153_LESSONS]

const evidenceOf = (lesson: (typeof LESSONS)[number]) =>
  [
    lesson.title,
    lesson.theory,
    lesson.make.prompt,
    ...lesson.make.testCases.flatMap((testCase) => [testCase.label, testCase.expected]),
  ].join('\n')

describe('systems-s2 — hệ điều hành qua simulator có ranh giới rõ ràng', () => {
  it('có đúng tám bài Python, mỗi unit hai bài và Make có ca hiện/ẩn', () => {
    expect(LESSONS).toHaveLength(8)
    for (const unitId of ['p6-u150', 'p6-u151', 'p6-u152', 'p6-u153']) {
      expect(LESSONS.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of LESSONS) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(evidenceOf(lesson).toLocaleLowerCase('vi')).toContain('mô phỏng')
    }
  })

  it('khóa các chuyển trạng thái lỗi cốt lõi thay vì treo hoặc đoán hành vi máy thật', () => {
    const evidence = LESSONS.map(evidenceOf).join('\n').toLocaleLowerCase('vi')
    for (const marker of [
      'zombie',
      'race',
      'deadlock',
      'eof',
      'partial',
      'fsync',
      'truncated',
      'backpressure',
      'use-after-move',
      'borrow-conflict',
      'safety-contract',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('không đánh đồng simulator với kernel, mạng hay toolchain Rust thật', () => {
    const evidence = LESSONS.map(evidenceOf).join('\n')
    expect(evidence).toMatch(/không (?:chạy|gọi|mở|truy cập|thay thế|biên dịch)/i)
    expect(evidence).toContain('compiler Rust thật')
    expect(evidence).toContain('socket')
  })
})
