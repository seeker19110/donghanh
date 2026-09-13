// lessons.ts — Registry BÀI HỌC môn Hoá học (gộp từ các file theo chương) + hàm tra cứu.
// Khuôn theo packages/subject-programming/lessons.ts — mỗi chương một file để soạn song song.
import type { AdvancedTier } from '@dhcb/core-contracts/lessonAnimation'
import type { ChemLesson } from './lessonTypes.js'
import { HOA_HSG_DUNG_DICH_LESSONS } from './lessons/hoa-hsg-dung-dich.js'
import { HOA_HSG_HUU_CO_LESSONS } from './lessons/hoa-hsg-huu-co-va-hon-hop.js'
import { HOA_HSG_NHIET_DONG_LESSONS } from './lessons/hoa-hsg-nhiet-dong-hoc.js'
import { HOA10_C1_LESSONS } from './lessons/hoa10c1.js'
import { HOA10_C2_LESSONS } from './lessons/hoa10c2.js'
import { HOA10_C3_LESSONS } from './lessons/hoa10c3.js'
import { HOA10_C4_LESSONS } from './lessons/hoa10c4.js'
import { HOA10_C5_LESSONS } from './lessons/hoa10c5.js'
import { HOA10_C6_LESSONS } from './lessons/hoa10c6.js'
import { HOA10_C7_LESSONS } from './lessons/hoa10c7.js'
import { HOA11_C1_LESSONS } from './lessons/hoa11c1.js'
import { HOA11_C2_LESSONS } from './lessons/hoa11c2.js'
import { HOA11_C3_LESSONS } from './lessons/hoa11c3.js'
import { HOA11_C4_LESSONS } from './lessons/hoa11c4.js'
import { HOA11_C5_LESSONS } from './lessons/hoa11c5.js'
import { HOA11_C6_LESSONS } from './lessons/hoa11c6.js'
import { HOA12_C1_LESSONS } from './lessons/hoa12c1.js'
import { HOA12_C2_LESSONS } from './lessons/hoa12c2.js'
import { HOA12_C3_LESSONS } from './lessons/hoa12c3.js'
import { HOA12_C4_LESSONS } from './lessons/hoa12c4.js'
import { HOA12_C5_LESSONS } from './lessons/hoa12c5.js'
import { HOA12_C6_LESSONS } from './lessons/hoa12c6.js'
import { HOA12_C7_LESSONS } from './lessons/hoa12c7.js'
import { HOA12_C8_LESSONS } from './lessons/hoa12c8.js'

export const CHEM_LESSONS: ChemLesson[] = [
  ...HOA10_C1_LESSONS,
  ...HOA10_C2_LESSONS,
  ...HOA10_C3_LESSONS,
  ...HOA10_C4_LESSONS,
  ...HOA10_C5_LESSONS,
  ...HOA10_C6_LESSONS,
  ...HOA10_C7_LESSONS,
  ...HOA11_C1_LESSONS,
  ...HOA11_C2_LESSONS,
  ...HOA11_C3_LESSONS,
  ...HOA11_C4_LESSONS,
  ...HOA11_C5_LESSONS,
  ...HOA11_C6_LESSONS,
  ...HOA12_C1_LESSONS,
  ...HOA12_C2_LESSONS,
  ...HOA12_C3_LESSONS,
  ...HOA12_C4_LESSONS,
  ...HOA12_C5_LESSONS,
  ...HOA12_C6_LESSONS,
  ...HOA12_C7_LESSONS,
  ...HOA12_C8_LESSONS,
  // Nhánh nâng cao (track 'advanced') — chuyên đề bồi dưỡng HSG, xếp cuối registry.
  ...HOA_HSG_NHIET_DONG_LESSONS,
  ...HOA_HSG_DUNG_DICH_LESSONS,
  ...HOA_HSG_HUU_CO_LESSONS,
]

const lessonMap = new Map<string, ChemLesson>(CHEM_LESSONS.map((l) => [l.id, l]))

export function getChemLesson(id: string): ChemLesson | undefined {
  return lessonMap.get(id)
}

/** Bài CHƯƠNG TRÌNH CHUẨN của một lớp, sắp theo chương rồi theo bài.
 *  Cố ý LOẠI nhánh nâng cao (track 'advanced') ra: chuyên đề HSG dùng mã chương riêng 90+, nếu
 *  trộn vào đây thì menu SGK của lớp sẽ mọc thêm "Chương 90" vô nghĩa với người học phổ thông.
 *  Muốn lấy chuyên đề HSG thì gọi listChemAdvancedLessons(). */
export function listChemLessonsByGrade(grade: '10' | '11' | '12'): ChemLesson[] {
  return CHEM_LESSONS.filter((l) => l.grade === grade && l.track === 'core').sort((a, b) =>
    a.chapterNumber !== b.chapterNumber
      ? a.chapterNumber - b.chapterNumber
      : a.lessonNumber - b.lessonNumber,
  )
}

export function listChemLessonsByChapter(
  grade: '10' | '11' | '12',
  chapterNumber: number,
): ChemLesson[] {
  return listChemLessonsByGrade(grade).filter((l) => l.chapterNumber === chapterNumber)
}

/** Chuyên đề bồi dưỡng học sinh giỏi. Không truyền `tier` thì trả về cả ba cấp, sắp theo thứ
 *  tự khó tăng dần trường → tỉnh → quốc gia (đúng thứ tự người học nên đi qua). */
export function listChemAdvancedLessons(tier?: AdvancedTier): ChemLesson[] {
  const order: Record<AdvancedTier, number> = {
    'hsg-truong': 0,
    'hsg-tinh': 1,
    'hsg-quoc-gia': 2,
  }
  return CHEM_LESSONS.filter(
    (l) => l.track === 'advanced' && (tier === undefined || l.advancedTier === tier),
  ).sort((a, b) => order[a.advancedTier ?? 'hsg-truong'] - order[b.advancedTier ?? 'hsg-truong'])
}
