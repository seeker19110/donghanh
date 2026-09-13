// lessons.ts — Registry BÀI HỌC môn Toán (gộp từ các file theo chương) + hàm tra cứu.
import type { MathLesson } from './lessonTypes.js'
import { TOAN10_C1_LESSONS } from './lessons/toan10c1.js'
import { TOAN10_C2_LESSONS } from './lessons/toan10c2.js'
import { TOAN10_C3_LESSONS } from './lessons/toan10c3.js'
import { TOAN10_C4_LESSONS } from './lessons/toan10c4.js'
import { TOAN10_C6_LESSONS } from './lessons/toan10c6.js'
import { TOAN10_C7_LESSONS } from './lessons/toan10c7.js'
import { TOAN10_C8_LESSONS } from './lessons/toan10c8.js'
import { TOAN10_C9_LESSONS } from './lessons/toan10c9.js'
import { TOAN11_C1_LESSONS } from './lessons/toan11c1.js'
import { TOAN11_C2_LESSONS } from './lessons/toan11c2.js'
import { TOAN11_C5_LESSONS } from './lessons/toan11c5.js'
import { TOAN11_C6_LESSONS } from './lessons/toan11c6.js'
import { TOAN11_C7_LESSONS } from './lessons/toan11c7.js'
import { TOAN10_C20_LESSONS } from './lessons/toan10c20.js'
import { TOAN11_C9_LESSONS } from './lessons/toan11c9.js'
import { TOAN11_C20_LESSONS } from './lessons/toan11c20.js'
import { TOAN12_C1_LESSONS } from './lessons/toan12c1.js'
import { TOAN12_C4_LESSONS } from './lessons/toan12c4.js'
import { TOAN12_C5_LESSONS } from './lessons/toan12c5.js'
import { TOAN12_C6_LESSONS } from './lessons/toan12c6.js'
import { TOAN12_C20_LESSONS } from './lessons/toan12c20.js'

export const MATH_LESSONS: MathLesson[] = [
  ...TOAN10_C1_LESSONS,
  ...TOAN10_C2_LESSONS,
  ...TOAN10_C3_LESSONS,
  ...TOAN10_C4_LESSONS,
  ...TOAN10_C6_LESSONS,
  ...TOAN10_C7_LESSONS,
  ...TOAN10_C8_LESSONS,
  ...TOAN10_C9_LESSONS,
  ...TOAN11_C1_LESSONS,
  ...TOAN11_C2_LESSONS,
  ...TOAN11_C5_LESSONS,
  ...TOAN11_C6_LESSONS,
  ...TOAN11_C7_LESSONS,
  ...TOAN11_C9_LESSONS,
  ...TOAN12_C1_LESSONS,
  ...TOAN12_C4_LESSONS,
  ...TOAN12_C5_LESSONS,
  ...TOAN12_C6_LESSONS,
  // Nhánh nâng cao (HSG): cấp trường → cấp tỉnh → cấp quốc gia.
  ...TOAN10_C20_LESSONS,
  ...TOAN11_C20_LESSONS,
  ...TOAN12_C20_LESSONS,
]

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
