// completionSandboxServer.test.ts — chạy python3 THẬT (như lessonsPython.test.ts) để kiểm
// đúng cả chấm đúng/sai lẫn ba lớp bảo vệ (ADR-0007). Không có python3 → bỏ qua, không đỏ CI oan.
import { describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { getLesson, getLessonsByUnit, PROGRAMMING_LESSONS } from './lessons.js'
import {
  regradeMakeSubmission,
  regradeInterpretedSubmission,
  regradeSubmission,
  isServerRegradableLesson,
} from './completionSandboxServer.js'

const hasPython = spawnSync('python3', ['--version']).status === 0
const p1u1 = getLessonsByUnit('p1-u1')[0]

describe.skipIf(!hasPython)('completionSandboxServer (ADR-0007)', () => {
  it('isServerRegradableLesson: đúng bài xương sống P1-P4 Python', () => {
    expect(p1u1 && isServerRegradableLesson(p1u1.id)).toBe(true)
  })

  it('code mẫu chính thức của bài học ĐẠT khi chấm lại (dùng lại sampleSolution)', () => {
    if (!p1u1) return
    const { passed } = regradeMakeSubmission(p1u1.id, p1u1.make.sampleSolution)
    expect(passed).toBe(true)
  })

  it('code sai (in ra chuỗi cố định không liên quan) → KHÔNG đạt', () => {
    if (!p1u1) return
    const { passed } = regradeMakeSubmission(p1u1.id, 'print("khong lien quan gi ca")')
    expect(passed).toBe(false)
  })

  it('code cố import os để dò đường thoát sandbox → bị chặn (không đạt, không throw)', () => {
    if (!p1u1) return
    const { passed, results } = regradeMakeSubmission(p1u1.id, 'import os\nprint(os.listdir("/"))')
    expect(passed).toBe(false)
    expect(results.every((r) => !r.passed)).toBe(true)
  })

  it('code cố gọi socket (mạng thật) → bị chặn ở tầng allowlist', () => {
    if (!p1u1) return
    const { passed } = regradeMakeSubmission(
      p1u1.id,
      'import socket\ns = socket.socket()\nprint("khong nen toi day")',
    )
    expect(passed).toBe(false)
  })

  it('vòng lặp vô hạn bị timeout ở TỪNG ca (không treo tiến trình vô thời hạn)', () => {
    if (!p1u1) return
    const start = Date.now()
    const { passed } = regradeMakeSubmission(p1u1.id, 'while True:\n    pass\n')
    expect(passed).toBe(false)
    // Timeout cứng 10s/ca (khớp client) × số ca của bài — có buffer, không phải "treo mãi".
    const budgetMs = p1u1.make.testCases.length * 10_000 + 5_000
    expect(Date.now() - start).toBeLessThan(budgetMs)
  }, 60_000)
})

// ────────────────────────────────────────────────────────────────────────────────────────────
// ADR-0008 B1 + B2 — mở rộng phạm vi chấm-lại-ở-server.
// ────────────────────────────────────────────────────────────────────────────────────────────

describe('phạm vi chấm-lại-ở-server sau ADR-0008 (không cần python3)', () => {
  it('B1 — bài Python bậc P5/P6 và 7 khoá ngắn nay THUỘC phạm vi', () => {
    expect(isServerRegradableLesson('p5-u1-l1')).toBe(true)
    expect(isServerRegradableLesson('p6-u1-l1')).toBe(true)
    expect(isServerRegradableLesson('ml-u1-l1')).toBe(true)
  })

  it('B2 — Kotlin, bash và 4 khoá mô phỏng nay THUỘC phạm vi', () => {
    expect(isServerRegradableLesson('p6-u5-l1')).toBe(true) // kotlin
    expect(isServerRegradableLesson('p3-u11-l2')).toBe(true) // bash
    expect(isServerRegradableLesson('git-u2-l1')).toBe(true)
    expect(isServerRegradableLesson('hermes-u1-l1')).toBe(true)
    expect(isServerRegradableLesson('vibe-u1-l1')).toBe(true)
    expect(isServerRegradableLesson('openclaw-u1-l1')).toBe(true)
  })

  it('NGOÀI phạm vi ADR-0008: bước dự án, hướng chuyên sâu, JS/TS/dom/html/fetch (B3), SQL', () => {
    expect(isServerRegradableLesson('p1-s1')).toBe(false) // bước dự án
    expect(isServerRegradableLesson('web-s2-m1')).toBe(false) // tiêu chí hướng chuyên sâu
    expect(isServerRegradableLesson('khong-ton-tai-u1-l1')).toBe(false)
    // B3 + SQL vẫn "client tự khai" theo đúng quyết định đã chốt của ADR-0008.
    for (const lang of ['javascript', 'typescript', 'html', 'dom', 'fetch', 'sql']) {
      const lesson = PROGRAMMING_LESSONS.find((l) => l.language === lang)
      expect(lesson, `không tìm thấy bài ${lang} để canh`).toBeDefined()
      expect(isServerRegradableLesson(lesson!.id), `${lang} (${lesson!.id})`).toBe(false)
    }
  })
})

describe('ADR-0008 B2 — chấm lại bằng trình thông dịch thuần (không subprocess)', () => {
  // Bộ ca: [mô tả, lessonId, code SAI chắc chắn không ra output kỳ vọng]
  const CAS: ReadonlyArray<readonly [string, string, string]> = [
    ['Kotlin', 'p6-u5-l1', 'fun main() {\n    println("khong lien quan gi ca")\n}'],
    ['bash', 'p3-u11-l2', 'echo "khong lien quan gi ca"'],
    ['git', 'git-u2-l1', 'echo "khong lien quan gi ca"'],
    ['hermes', 'hermes-u1-l1', '# khong lam gi'],
    ['vibe', 'vibe-u1-l1', '# khong lam gi'],
    ['openclaw', 'openclaw-u1-l1', '# khong lam gi'],
  ]

  it.each(CAS)('%s (%s) — code mẫu ĐẠT, code sai KHÔNG đạt', (_ten, lessonId, codeSai) => {
    const lesson = getLesson(lessonId)
    expect(lesson, `bài ${lessonId} phải tồn tại trong registry`).toBeDefined()
    expect(regradeInterpretedSubmission(lessonId, lesson!.make.sampleSolution).passed).toBe(true)
    expect(regradeInterpretedSubmission(lessonId, codeSai).passed).toBe(false)
  })

  it('regradeSubmission điều hướng đúng luồng cho bài thông dịch', () => {
    const lesson = getLesson('p6-u5-l1')!
    expect(regradeSubmission('p6-u5-l1', lesson.make.sampleSolution).passed).toBe(true)
  })

  it('bài ngoài phạm vi thông dịch → ném lỗi rõ ràng, không im lặng cho qua', () => {
    expect(() => regradeInterpretedSubmission('p1-u1-l1', 'print(1)')).toThrow()
    expect(() => regradeSubmission('khong-ton-tai', 'x')).toThrow()
  })
})

describe.skipIf(!hasPython)(
  'ADR-0008 B1 — chấm lại Python bậc P5/P6 bằng hạ tầng cũ',
  () => {
    const p6 = getLesson('p6-u1-l1')!

    it('code mẫu của bài P6 ĐẠT khi chấm lại', () => {
      expect(regradeSubmission(p6.id, p6.make.sampleSolution).passed).toBe(true)
    })

    it('code sai của bài P6 KHÔNG đạt', () => {
      expect(regradeMakeSubmission(p6.id, 'print("khong lien quan gi ca")').passed).toBe(false)
    })
  },
  120_000,
)
