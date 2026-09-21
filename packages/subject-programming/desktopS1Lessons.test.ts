import { describe, expect, it } from 'vitest'
import { P6U274_LESSONS } from './lessons/p6u274.js'
import { P6U275_LESSONS } from './lessons/p6u275.js'
import { P6U276_LESSONS } from './lessons/p6u276.js'
import { P6U277_LESSONS } from './lessons/p6u277.js'

const lessons = [...P6U274_LESSONS, ...P6U275_LESSONS, ...P6U276_LESSONS, ...P6U277_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

describe('desktop-s1 — nền tảng, tệp, lưu trữ cục bộ và đóng gói', () => {
  it('có bốn unit, tám lesson Python cùng Make visible và hidden', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u274', 'p6-u275', 'p6-u276', 'p6-u277']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('mỗi bài có ít nhất một ca âm — fixture sai miền/sai kiểu phải fail closed', () => {
    for (const lesson of lessons) {
      expect(
        lesson.make.testCases.some(
          (testCase) =>
            testCase.expected.startsWith('invalid:') ||
            testCase.expected.startsWith('deny:') ||
            testCase.expected.startsWith('reject:') ||
            testCase.expected.startsWith('refuse:'),
        ),
      ).toBe(true)
    }
  })

  it('khoá packagesizemb, shortcut, temp file, rename, path, schemaversion, migration, signed, checksum', () => {
    for (const marker of [
      'packagesizemb',
      'shortcut',
      'temp file',
      'rename',
      'path',
      'schemaversion',
      'migration',
      'signed',
      'checksum',
    ]) {
      expect(evidence).toContain(marker)
    }
  })

  it('nhắc rõ đây là MÔ PHỎNG, không chạy hệ điều hành hay trình cài đặt thật', () => {
    for (const lesson of lessons) {
      expect(lesson.title.startsWith('MÔ PHỎNG')).toBe(true)
      expect(lesson.theory).toContain('MÔ PHỎNG')
    }
  })

  it('không đụng tệp, tiến trình, mạng, thời gian thực hay random', () => {
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
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|import\s+(os|sys)\b|shutil|pathlib/i,
    )
  })
})
