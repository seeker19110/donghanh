import { describe, expect, it } from 'vitest'
import { P6U146_LESSONS } from './lessons/p6u146.js'
import { P6U147_LESSONS } from './lessons/p6u147.js'
import { P6U148_LESSONS } from './lessons/p6u148.js'
import { P6U149_LESSONS } from './lessons/p6u149.js'

const LESSONS = [...P6U146_LESSONS, ...P6U147_LESSONS, ...P6U148_LESSONS, ...P6U149_LESSONS]

describe('systems-s1 — mô phỏng có ranh giới runtime rõ ràng', () => {
  it('có đúng tám bài Python, mỗi unit hai bài và Make có ca hiện/ẩn', () => {
    expect(LESSONS).toHaveLength(8)
    for (const unitId of ['p6-u146', 'p6-u147', 'p6-u148', 'p6-u149']) {
      expect(LESSONS.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of LESSONS) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
    }
  })

  it('mọi bài tự nhận là mô phỏng và không tuyên bố chạy toolchain C thật', () => {
    for (const lesson of LESSONS) {
      const evidence = [lesson.title, lesson.theory, lesson.make.prompt].join('\n')
      expect(evidence.toLocaleLowerCase('vi')).toContain('mô phỏng')
      expect(evidence).toMatch(
        /không (?:đọc|chạy|gọi|phải|truy cập|tạo|cấp phát|tái tạo|biên dịch|thực thi)/i,
      )
    }
  })

  it('khóa các ca lỗi cốt lõi của memory, sanitizer và linker', () => {
    const evidence = LESSONS.map((lesson) =>
      [
        lesson.theory,
        lesson.make.prompt,
        ...lesson.make.testCases.flatMap((testCase) => [testCase.label, testCase.expected]),
      ].join('\n'),
    ).join('\n')
    for (const marker of ['dangling', 'double-free', 'leak', 'out-of-bounds', 'use-after-free']) {
      expect(evidence).toContain(marker)
    }
    expect(evidence).toContain('missing')
    expect(evidence).toContain('duplicate')
    expect(evidence).toContain('ABI ĐỒ CHƠI')
    expect(evidence).toContain('LOAD')
    expect(evidence).toContain('RET')
  })
})
