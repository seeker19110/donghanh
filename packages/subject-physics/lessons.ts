// lessons.ts — Registry BÀI HỌC môn Vật lí (gộp từ các file theo chương) + hàm tra cứu.
import type { PhysicsLesson } from './lessonTypes.js'
import { LY10_C1_LESSONS } from './lessons/ly10c1.js'
import { LY10_C2_LESSONS } from './lessons/ly10c2.js'
import { LY10_C3_LESSONS } from './lessons/ly10c3.js'
import { LY10_C4_LESSONS } from './lessons/ly10c4.js'
import { LY10_C5_LESSONS } from './lessons/ly10c5.js'
import { LY10_C6_LESSONS } from './lessons/ly10c6.js'
import { LY10_C7_LESSONS } from './lessons/ly10c7.js'
import { LY11_C1_LESSONS } from './lessons/ly11c1.js'
import { LY11_C2_LESSONS } from './lessons/ly11c2.js'
import { LY11_C3_LESSONS } from './lessons/ly11c3.js'
import { LY11_C4_LESSONS } from './lessons/ly11c4.js'
import { LY12_C1_LESSONS } from './lessons/ly12c1.js'
import { LY12_C2_LESSONS } from './lessons/ly12c2.js'
import { LY12_C3_LESSONS } from './lessons/ly12c3.js'
import { LY12_C4_LESSONS } from './lessons/ly12c4.js'
// Chuyên đề bồi dưỡng học sinh giỏi (track: 'advanced'), đánh số chương 91/92/93 để không
// đụng chương của chương trình chuẩn — xem docs/specs/2026-09-13-hoan-thien-4-mon-stem.md.
import { LY_HSG_CO_HOC_LESSONS } from './lessons/lyhsgcohoc.js'
import { LY_HSG_DAO_DONG_LESSONS } from './lessons/lyhsgdaodong.js'
import { LY_HSG_NHIET_DIEN_TU_LESSONS } from './lessons/lyhsgnhietdientu.js'

export const PHYSICS_LESSONS: PhysicsLesson[] = [
  ...LY10_C1_LESSONS,
  ...LY10_C2_LESSONS,
  ...LY10_C3_LESSONS,
  ...LY10_C4_LESSONS,
  ...LY10_C5_LESSONS,
  ...LY10_C6_LESSONS,
  ...LY10_C7_LESSONS,
  ...LY11_C1_LESSONS,
  ...LY11_C2_LESSONS,
  ...LY11_C3_LESSONS,
  ...LY11_C4_LESSONS,
  ...LY12_C1_LESSONS,
  ...LY12_C2_LESSONS,
  ...LY12_C3_LESSONS,
  ...LY12_C4_LESSONS,
  ...LY_HSG_CO_HOC_LESSONS,
  ...LY_HSG_DAO_DONG_LESSONS,
  ...LY_HSG_NHIET_DIEN_TU_LESSONS,
]

/** Bài học của chương trình chuẩn (track 'core'), theo đúng thứ tự chương/bài. */
export function listPhysicsCoreLessons(): PhysicsLesson[] {
  return PHYSICS_LESSONS.filter((l) => l.track === 'core')
}

/** Chuyên đề bồi dưỡng học sinh giỏi, xếp từ cấp trường → cấp tỉnh → cấp quốc gia. */
export function listPhysicsAdvancedLessons(): PhysicsLesson[] {
  const tierOrder = { 'hsg-truong': 0, 'hsg-tinh': 1, 'hsg-quoc-gia': 2 } as const
  return PHYSICS_LESSONS.filter((l) => l.track === 'advanced').sort((a, b) => {
    // advancedTier chắc chắn tồn tại với bài 'advanced' (schema đã ràng buộc), nhưng vẫn
    // dùng giá trị mặc định để không phải ép kiểu.
    const ta = a.advancedTier ? tierOrder[a.advancedTier] : 0
    const tb = b.advancedTier ? tierOrder[b.advancedTier] : 0
    return ta !== tb ? ta - tb : a.id.localeCompare(b.id)
  })
}

const lessonMap = new Map<string, PhysicsLesson>(PHYSICS_LESSONS.map((l) => [l.id, l]))

export function getPhysicsLesson(id: string): PhysicsLesson | undefined {
  return lessonMap.get(id)
}

export function listPhysicsLessonsByGrade(grade: '10' | '11' | '12'): PhysicsLesson[] {
  return PHYSICS_LESSONS.filter((l) => l.grade === grade).sort((a, b) =>
    a.chapterNumber !== b.chapterNumber
      ? a.chapterNumber - b.chapterNumber
      : a.lessonNumber - b.lessonNumber,
  )
}
