// completionSandboxServer.test.ts — chạy python3 THẬT (như lessonsPython.test.ts) để kiểm
// đúng cả chấm đúng/sai lẫn ba lớp bảo vệ (ADR-0007). Không có python3 → bỏ qua, không đỏ CI oan.
import { describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { getLesson, getLessonsByUnit, PROGRAMMING_LESSONS } from './lessons.js'
import {
  regradeMakeSubmission,
  regradeInterpretedSubmission,
  regradeSubmission,
  regradeWebSubmission,
  regradeSqlSubmission,
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

  it('B3 — MỌI bài JavaScript/TypeScript/html/dom/fetch nay THUỘC phạm vi (97 bài)', () => {
    const web = PROGRAMMING_LESSONS.filter((l) =>
      ['javascript', 'typescript', 'html', 'dom', 'fetch'].includes(l.language),
    )
    expect(web).toHaveLength(97)
    for (const lesson of web) {
      expect(isServerRegradableLesson(lesson.id), `${lesson.language} (${lesson.id})`).toBe(true)
    }
  })

  it('SQL (5 bài) nay THUỘC phạm vi — sql.js đã xác minh an toàn (câu hỏi 3 của ADR-0008)', () => {
    const sql = PROGRAMMING_LESSONS.filter((l) => l.language === 'sql')
    expect(sql).toHaveLength(5)
    for (const lesson of sql) {
      expect(isServerRegradableLesson(lesson.id), `sql (${lesson.id})`).toBe(true)
    }
  })

  it('NGOÀI phạm vi ADR-0008: bước dự án, hướng chuyên sâu', () => {
    expect(isServerRegradableLesson('p1-s1')).toBe(false) // bước dự án
    expect(isServerRegradableLesson('web-s2-m1')).toBe(false) // tiêu chí hướng chuyên sâu
    expect(isServerRegradableLesson('khong-ton-tai-u1-l1')).toBe(false)
  })
})

// ────────────────────────────────────────────────────────────────────────────────────────────
// ADR-0008 B3 — làn WEB chạy bằng node:vm (không cần python3).
// ────────────────────────────────────────────────────────────────────────────────────────────

describe('ADR-0008 B3 — chấm lại JS/TS/html/dom/fetch bằng node:vm', () => {
  // [mô tả, lessonId, code SAI chắc chắn không ra output kỳ vọng]
  const CAS: ReadonlyArray<readonly [string, string, string]> = [
    ['JavaScript', 'p3-u6-l1', 'console.log("khong lien quan gi ca")'],
    ['TypeScript', 'p4-u10-l1', 'console.log("khong lien quan gi ca")'],
    ['html', 'p3-u4-l1', '<!doctype html><html><body><p>khong lien quan</p></body></html>'],
    ['dom', 'p3-u6-l2', '/* khong lam gi */'],
    ['fetch', 'p3-u7-l1', '/* khong lam gi */'],
  ]

  it.each(CAS)(
    '%s (%s) — code mẫu ĐẠT, code sai KHÔNG đạt',
    async (_ten, lessonId, codeSai) => {
      const lesson = getLesson(lessonId)
      expect(lesson, `bài ${lessonId} phải tồn tại trong registry`).toBeDefined()
      expect((await regradeWebSubmission(lessonId, lesson!.make.sampleSolution)).passed).toBe(true)
      expect((await regradeWebSubmission(lessonId, codeSai)).passed).toBe(false)
    },
    120_000,
  )

  it('regradeSubmission điều hướng đúng luồng cho bài làn web', async () => {
    const lesson = getLesson('p3-u6-l1')!
    expect((await regradeSubmission('p3-u6-l1', lesson.make.sampleSolution)).passed).toBe(true)
  })

  it('bài TypeScript sai KIỂU thì KHÔNG đạt (tsc chặn trước, chương trình không chạy)', async () => {
    const r = await regradeWebSubmission('p4-u10-l1', 'const x: number = "chuoi"\n')
    expect(r.passed).toBe(false)
  }, 120_000)

  it('code học viên KHÔNG với tới được require/process trong context vm', async () => {
    // Bài JS nào cũng được: code này in ra "undefined undefined" nên chắc chắn rớt test-case,
    // điều cần canh là nó KHÔNG ném lỗi kiểu "require is not defined" ở tầng khác — tức context
    // đúng là tối giản và code chạy lọt tới chỗ in ra.
    const r = await regradeWebSubmission('p3-u6-l1', 'console.log(typeof require, typeof process)')
    expect(r.passed).toBe(false)
    expect(r.results[0]?.actual ?? '').toContain('undefined undefined')
  })

  it('vòng lặp vô hạn bị timeout cứng cắt, không treo tiến trình chấm', async () => {
    const r = await regradeWebSubmission('p3-u6-l1', 'while (true) {}')
    expect(r.passed).toBe(false)
    expect(r.results.every((x) => !x.passed)).toBe(true)
  }, 120_000)

  it('bài ngoài làn web → ném lỗi rõ ràng, không im lặng cho qua', async () => {
    await expect(regradeWebSubmission('p1-u1-l1', 'print(1)')).rejects.toThrow()
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

  it('regradeSubmission điều hướng đúng luồng cho bài thông dịch', async () => {
    const lesson = getLesson('p6-u5-l1')!
    expect((await regradeSubmission('p6-u5-l1', lesson.make.sampleSolution)).passed).toBe(true)
  })

  it('bài ngoài phạm vi thông dịch → ném lỗi rõ ràng, không im lặng cho qua', async () => {
    expect(() => regradeInterpretedSubmission('p1-u1-l1', 'print(1)')).toThrow()
    await expect(regradeSubmission('khong-ton-tai', 'x')).rejects.toThrow()
  })
})

describe.skipIf(!hasPython)(
  'ADR-0008 B1 — chấm lại Python bậc P5/P6 bằng hạ tầng cũ',
  () => {
    const p6 = getLesson('p6-u1-l1')!

    it('code mẫu của bài P6 ĐẠT khi chấm lại', async () => {
      expect((await regradeSubmission(p6.id, p6.make.sampleSolution)).passed).toBe(true)
    })

    it('code sai của bài P6 KHÔNG đạt', () => {
      expect(regradeMakeSubmission(p6.id, 'print("khong lien quan gi ca")').passed).toBe(false)
    })
  },
  120_000,
)

describe('ADR-0008 câu hỏi 3 — chấm lại SQL bằng sql.js (WASM, không subprocess)', () => {
  const SQL_LESSON_IDS = PROGRAMMING_LESSONS.filter((l) => l.language === 'sql').map((l) => l.id)

  it('mọi bài SQL: code mẫu chính thức ĐẠT khi chấm lại', async () => {
    for (const id of SQL_LESSON_IDS) {
      const lesson = getLesson(id)!
      const { passed, results } = await regradeSqlSubmission(id, lesson.make.sampleSolution)
      expect(passed, `bài ${id}: ${JSON.stringify(results)}`).toBe(true)
    }
  }, 30_000)

  it('code SQL sai (không liên quan) → KHÔNG đạt', async () => {
    const id = SQL_LESSON_IDS[0]!
    const { passed } = await regradeSqlSubmission(id, "SELECT 'khong lien quan gi ca' AS x;")
    expect(passed).toBe(false)
  })

  it('câu lệnh sai cú pháp → không đạt, không ném lỗi ra ngoài', async () => {
    const id = SQL_LESSON_IDS[0]!
    const { passed, results } = await regradeSqlSubmission(id, 'SELEC * FROM khong_ton_tai;')
    expect(passed).toBe(false)
    expect(results.every((r) => !r.passed)).toBe(true)
  })

  it('cố ATTACH DATABASE ra đường dẫn thật → không chạm hệ thống file (đã xác minh an toàn)', async () => {
    const id = SQL_LESSON_IDS[0]!
    const scratchPath = '/tmp/dhcb-sql-regrade-attach-probe.db'
    const { passed } = await regradeSqlSubmission(
      id,
      `ATTACH DATABASE '${scratchPath}' AS x; CREATE TABLE x.t(a INT); INSERT INTO x.t VALUES (1);`,
    )
    // Không đạt vì output không khớp test-case của bài (đây không phải điều đang canh) — điều
    // đang canh là ATTACH không được phép tạo file thật trên đĩa của server.
    expect(passed).toBe(false)
    const { existsSync, rmSync } = await import('node:fs')
    const bịTạoThật = existsSync(scratchPath)
    if (bịTạoThật) rmSync(scratchPath)
    expect(bịTạoThật, 'ATTACH DATABASE không được phép tạo file thật trên server').toBe(false)
  })

  it('regradeSubmission điều hướng đúng luồng cho bài SQL', async () => {
    const id = SQL_LESSON_IDS[0]!
    const lesson = getLesson(id)!
    expect((await regradeSubmission(id, lesson.make.sampleSolution)).passed).toBe(true)
  })

  it('bài ngoài phạm vi SQL → ném lỗi rõ ràng, không im lặng cho qua', async () => {
    await expect(regradeSqlSubmission('p1-u1-l1', 'SELECT 1;')).rejects.toThrow()
  })
})
