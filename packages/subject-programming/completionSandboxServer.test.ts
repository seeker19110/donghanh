// completionSandboxServer.test.ts — chạy python3 THẬT (như lessonsPython.test.ts) để kiểm
// đúng cả chấm đúng/sai lẫn ba lớp bảo vệ (ADR-0007). Không có python3 → bỏ qua, không đỏ CI oan.
import { describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { getLessonsByUnit } from './lessons.js'
import { regradeMakeSubmission, isServerRegradableLesson } from './completionSandboxServer.js'

const hasPython = spawnSync('python3', ['--version']).status === 0
const p1u1 = getLessonsByUnit('p1-u1')[0]

describe.skipIf(!hasPython)('completionSandboxServer (ADR-0007)', () => {
  it('isServerRegradableLesson: đúng bài xương sống P1-P4 Python, sai bài ngoài phạm vi', () => {
    expect(p1u1 && isServerRegradableLesson(p1u1.id)).toBe(true)
    expect(isServerRegradableLesson('p1-s1')).toBe(false) // bước dự án
    expect(isServerRegradableLesson('web-s2-m1')).toBe(false) // hướng chuyên sâu
    expect(isServerRegradableLesson('p5-u1-l1')).toBe(false) // ngoài phạm vi P1-P4 (nếu tồn tại)
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
