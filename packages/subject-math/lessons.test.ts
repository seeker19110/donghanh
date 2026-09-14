// lessons.test.ts — Gác chất lượng nội dung bài học Toán.
import { describe, expect, it } from 'vitest'
import { gradeAnswer, UNITS } from '@dhcb/core-grading'
import { MATH_LESSONS, getMathLesson, listMathLessonsByGrade } from './lessons.js'
import { MathLessonSchema } from './lessonTypes.js'

describe('math lessons', () => {
  it('mọi bài đúng khuôn MathLessonSchema (Zod)', () => {
    for (const lesson of MATH_LESSONS) {
      const r = MathLessonSchema.safeParse(lesson)
      expect(r.success, `Bài ${lesson.id} sai khuôn: ${r.success ? '' : r.error.message}`).toBe(
        true,
      )
    }
  })

  it('id duy nhất trong toàn bộ registry', () => {
    const seen = new Set<string>()
    for (const lesson of MATH_LESSONS) {
      expect(seen.has(lesson.id), `id trùng lặp: ${lesson.id}`).toBe(false)
      seen.add(lesson.id)
    }
  })

  it('mọi bài đánh dấu reviewStatus (không âm thầm coi là đã duyệt)', () => {
    for (const lesson of MATH_LESSONS) {
      expect(['draft', 'reviewed']).toContain(lesson.reviewStatus)
    }
  })

  it('mọi checkQuestion tự chấm ĐÚNG với chính đáp án đã khai — dùng engine chấm thật, không AI', () => {
    // CẢNH BÁO ĐỌC KỸ: ca test này là CỔNG NHẤT QUÁN, KHÔNG phải cổng ĐÚNG KIẾN THỨC.
    // Nó lấy chính đáp án đã khai làm "bài làm của học sinh" rồi đòi engine chấm ra đúng —
    // tức chỉ chứng minh dữ liệu bài học không tự mâu thuẫn với engine sẽ chấm nó. Với câu
    // trắc nghiệm, nó KHÔNG chứng minh phương án được đánh dấu là phương án đúng về kiến thức.
    // Việc đó chỉ người có chuyên môn đọc mới làm được (xem TRAPS.md mục 4).
    for (const lesson of MATH_LESSONS) {
      for (const q of lesson.checkQuestions) {
        let studentInput: string
        switch (q.answer.kind) {
          case 'numeric': {
            const unitDef = q.answer.unit ? UNITS[q.answer.unit] : undefined
            const factor = unitDef ? unitDef.factor : 1
            const offset = unitDef ? (unitDef.offset ?? 0) : 0
            const displayValue = (q.answer.value - offset) / factor
            studentInput = q.answer.unit ? `${displayValue} ${q.answer.unit}` : `${displayValue}`
            break
          }
          case 'choice':
            studentInput = q.answer.correctIds.join(',')
            break
          case 'fraction':
            studentInput = `${q.answer.num}/${q.answer.den}`
            break
          case 'expression':
            studentInput = q.answer.expr
            break
        }
        const result = gradeAnswer(studentInput, q.answer)
        expect(
          result.correct,
          `Bài ${lesson.id}, câu "${q.prompt}" — đáp án đã khai KHÔNG tự chấm đúng (lý do: ${result.reason})`,
        ).toBe(true)
      }
    }
  })

  it('getMathLesson tra được đúng bài theo id', () => {
    const first = MATH_LESSONS[0]
    expect(first, 'registry môn Toán còn rỗng — chưa có bài nào để tra').toBeDefined()
    if (!first) return
    expect(getMathLesson(first.id)?.title).toBe(first.title)
  })

  it('listMathLessonsByGrade trả đúng thứ tự chương/bài', () => {
    const lessons10 = listMathLessonsByGrade('10')
    expect(lessons10.length, 'chưa có bài Toán lớp 10 nào').toBeGreaterThan(0)
    for (let i = 1; i < lessons10.length; i++) {
      const prev = lessons10[i - 1]!
      const cur = lessons10[i]!
      const prevKey = prev.chapterNumber * 1000 + prev.lessonNumber
      const curKey = cur.chapterNumber * 1000 + cur.lessonNumber
      expect(curKey).toBeGreaterThanOrEqual(prevKey)
    }
  })
})
