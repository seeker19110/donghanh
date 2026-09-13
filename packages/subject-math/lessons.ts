// lessons.ts — Registry BÀI HỌC môn Toán (gộp từ các file theo chương) + hàm tra cứu.
import type { MathLesson } from './lessonTypes.js'
import { TOAN10_C1_LESSONS } from './lessons/toan10c1.js'

export const MATH_LESSONS: MathLesson[] = [...TOAN10_C1_LESSONS]

const lessonMap = new Map<string, MathLesson>(MATH_LESSONS.map((l) => [l.id, l]))

export function getMathLesson(id: string): MathLesson | undefined {
  return lessonMap.get(id)
}

export function listMathLessonsByGrade(grade: '10' | '11' | '12'): MathLesson[] {
  return MATH_LESSONS.filter((l) => l.grade === grade).sort((a, b) =>
    a.chapterNumber !== b.chapterNumber
      ? a.chapterNumber - b.chapterNumber
      : a.lessonNumber - b.lessonNumber,
  )
}
