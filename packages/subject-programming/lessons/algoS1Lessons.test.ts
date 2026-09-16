import { execFileSync, spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { P6U142_LESSONS } from './p6u142.js'
import { P6U143_LESSONS } from './p6u143.js'
import { P6U144_LESSONS } from './p6u144.js'
import { P6U145_LESSONS } from './p6u145.js'

const LESSONS = [...P6U142_LESSONS, ...P6U143_LESSONS, ...P6U144_LESSONS, ...P6U145_LESSONS]
const hasPython = spawnSync('python3', ['--version']).status === 0

function runPython(code: string, stdin: string): string {
  return execFileSync('python3', ['-c', code], {
    input: stdin,
    encoding: 'utf8',
    timeout: 5_000,
  }).trim()
}

describe('algo-s1 — hợp đồng nội dung và differential test', () => {
  it('có đúng tám bài, mỗi unit hai bài và mỗi Make có ca hiện lẫn ca ẩn', () => {
    expect(LESSONS).toHaveLength(8)
    for (const unitId of ['p6-u142', 'p6-u143', 'p6-u144', 'p6-u145']) {
      expect(LESSONS.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of LESSONS) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
    }
  })

  it('bài differential dùng RNG cục bộ, lưu seed và có negative control', () => {
    const lesson = P6U145_LESSONS[1]
    if (!lesson) throw new Error('Thiếu bài p6-u145-l2')
    const evidence = [lesson.theory, lesson.make.prompt, lesson.make.sampleSolution].join('\n')
    expect(evidence).toContain('random.Random(seed)')
    expect(evidence).toContain('LECH')
    expect(evidence).toContain('[1]')
    expect(evidence).toContain('target')
  })

  ;(hasPython ? it : it.skip)(
    'cùng seed tái hiện kết quả và negative control thực sự bị bắt',
    () => {
      const lesson = P6U145_LESSONS[1]
      if (!lesson) throw new Error('Thiếu bài p6-u145-l2')
      const code = lesson.make.sampleSolution
      const first = runPython(code, '7\n100\ndung\n')
      const second = runPython(code, '7\n100\ndung\n')
      expect(first).toBe('OK 7 100')
      expect(second).toBe(first)
      expect(runPython(code, '7\n100\nloi\n')).toBe('LECH 7 [1] 2')
    },
  )
})
