// Semantic gate của lát cắt `systems-s3` + `systems-s4`.
//
// Vì sao cần ngoài các cổng chung: `lessonsPython.test.ts` chứng minh code CHẠY ĐÚNG, còn file
// này chứng minh nội dung NÓI ĐÚNG — tự nhận là mô phỏng, không hứa chạy toolchain/nhân thật,
// và khoá lại đúng những mã quyết định mà đặc tả yêu cầu (nếu ai đó đổi `deny` thành `allow` ở
// ca tràn bộ đệm hay ca vi phạm cách ly thì test này đỏ, chứ không im lặng trôi qua).
import { describe, expect, it } from 'vitest'
import { P6U234_LESSONS } from './lessons/p6u234.js'
import { P6U235_LESSONS } from './lessons/p6u235.js'
import { P6U236_LESSONS } from './lessons/p6u236.js'
import { P6U237_LESSONS } from './lessons/p6u237.js'
import { P6U238_LESSONS } from './lessons/p6u238.js'
import { P6U239_LESSONS } from './lessons/p6u239.js'
import { P6U240_LESSONS } from './lessons/p6u240.js'
import { P6U241_LESSONS } from './lessons/p6u241.js'

const BY_UNIT = {
  'p6-u234': P6U234_LESSONS,
  'p6-u235': P6U235_LESSONS,
  'p6-u236': P6U236_LESSONS,
  'p6-u237': P6U237_LESSONS,
  'p6-u238': P6U238_LESSONS,
  'p6-u239': P6U239_LESSONS,
  'p6-u240': P6U240_LESSONS,
  'p6-u241': P6U241_LESSONS,
} as const

const LESSONS = Object.values(BY_UNIT).flat()

/** Toàn bộ chữ của một bài — dùng để tra marker nghiệp vụ bắt buộc. */
function bangChung(lessons: (typeof LESSONS)[number][]): string {
  return lessons
    .map((lesson) =>
      [
        lesson.title,
        lesson.theory,
        lesson.make.prompt,
        ...lesson.make.testCases.flatMap((tc) => [tc.label, tc.expected]),
      ].join('\n'),
    )
    .join('\n')
}

/** Mọi đoạn code THỰC THI được của một bài (không tính phần mô tả). */
function codeThucThi(lesson: (typeof LESSONS)[number]): string {
  return [
    lesson.workedExample.code,
    lesson.predict.code,
    lesson.make.starterCode,
    lesson.make.sampleSolution,
  ].join('\n')
}

describe('systems-s3 + systems-s4 — mô phỏng có ranh giới runtime rõ ràng', () => {
  it('có đúng 16 bài Python, mỗi unit hai bài, Make đủ ca hiện/ẩn và chấm contains', () => {
    expect(LESSONS).toHaveLength(16)
    for (const [unitId, lessons] of Object.entries(BY_UNIT)) {
      expect(lessons).toHaveLength(2)
      for (const lesson of lessons) expect(lesson.unitId).toBe(unitId)
    }
    for (const lesson of LESSONS) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((tc) => !tc.hidden)).toBe(true)
      expect(lesson.make.testCases.some((tc) => tc.hidden)).toBe(true)
      // Ca âm: mọi bài phải có ít nhất một ca invalid/deny để fail closed được chứng minh.
      expect(
        lesson.make.testCases.some((tc) => /^(invalid|deny|overflow-undetected)/.test(tc.expected)),
      ).toBe(true)
      for (const tc of lesson.make.testCases) expect(tc.match).toBe('contains')
      expect(lesson.srsCards?.length ?? 0).toBeGreaterThanOrEqual(2)
    }
  })

  it('mọi bài tự nhận là mô phỏng và không tuyên bố chạy toolchain/nhân thật', () => {
    for (const lesson of LESSONS) {
      const evidence = [lesson.title, lesson.theory, lesson.make.prompt].join('\n')
      expect(evidence.toLocaleLowerCase('vi')).toContain('mô phỏng')
      expect(evidence).toMatch(
        /không (?:biên dịch|chạy|gọi|đọc|chạm|tạo|cấu hình|giải phóng|cấp phát)/i,
      )
    }
  })

  it('không bài nào chạm I/O ngoài, tiến trình, luồng hay ngẫu nhiên không tất định', () => {
    const cam = [
      'import os',
      'import sys',
      'open(',
      'socket',
      'subprocess',
      'ctypes',
      'threading',
      'requests',
      'random',
      'datetime.now',
    ]
    for (const lesson of LESSONS) {
      const code = codeThucThi(lesson)
      for (const tu of cam) expect(code).not.toContain(tu)
    }
  })

  it('khoá các marker nghiệp vụ bắt buộc của từng unit', () => {
    const markers: Record<string, string[]> = {
      'p6-u234': ['cache_miss_rate', 'false-sharing'],
      'p6-u235': ['noisy', 'insufficient-samples', 'Amdahl'],
      'p6-u236': ['thrash', 'page fault', 'syscall'],
      'p6-u237': ['linearizable', 'race', 'memory barrier'],
      'p6-u238': ['undeclared-var', 'type-error'],
      'p6-u239': ['mark-sweep', 'reachable', 'stack-error'],
      'p6-u240': ['context switch', 'page table', 'idle'],
      'p6-u241': ['overflow-detected', 'canary', 'coverage', 'plateau'],
    }
    for (const [unitId, tu] of Object.entries(markers)) {
      const evidence = bangChung(BY_UNIT[unitId as keyof typeof BY_UNIT])
      for (const m of tu) expect(evidence, `${unitId} thiếu marker ${m}`).toContain(m)
    }
  })

  it('fail closed ở hai ca nguy hiểm nhất: vi phạm cách ly bộ nhớ và tràn bộ đệm', () => {
    const cachLy = P6U236_LESSONS.flatMap((l) => l.make.testCases).filter((tc) =>
      tc.expected.startsWith('deny: vi pham cach ly'),
    )
    expect(cachLy.length).toBeGreaterThanOrEqual(1)

    const tranBoDem = P6U241_LESSONS.flatMap((l) => l.make.testCases).filter((tc) =>
      tc.expected.startsWith('overflow-undetected: deny'),
    )
    expect(tranBoDem.length).toBeGreaterThanOrEqual(1)
  })
})
