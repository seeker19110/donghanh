// stemLessonRoutes.ts — MỘT chỗ duy nhất biết bốn môn STEM có những gì và URL của chúng ra sao.
//
// Quy ước URL mang tiêu đề (CLAUDE.md mục 7): đường dẫn tới một bài học phải là
// `<mã>--<tiêu đề đã slug hoá>`, và không được tự ghép chuỗi URL rải rác nhiều nơi — mọi nơi
// tạo liên kết đều gọi hàm ở đây, theo đúng khuôn `lib/programmingRoutes.ts` của môn Lập trình.
import { buildSlugSegment, idFromSlugSegment } from '@core/slug'
import type { StemLessonLoader } from '@dhcb/core-learner/stemLessonLoader'
import type { StemLessonLike, StemSubjectId } from '@dhcb/core-contracts/stemLesson'
import { MATH_LOADER } from '@dhcb/subject-math/lessonsLoader'
import { PHYSICS_LOADER } from '@dhcb/subject-physics/lessonsLoader'
import { CHEM_LOADER } from '@dhcb/subject-chemistry/lessonsLoader'
import { BIOLOGY_LOADER } from '@dhcb/subject-biology/lessonsLoader'

export interface StemSubject {
  id: StemSubjectId
  /** Tên môn hiển thị cho người học. */
  label: string
  loader: StemLessonLoader<StemLessonLike>
  /** Các lớp môn này có bài, theo thứ tự hiển thị. */
  grades: string[]
}

export const STEM_SUBJECTS: Record<StemSubjectId, StemSubject> = {
  mathematics: {
    id: 'mathematics',
    label: 'Toán',
    loader: MATH_LOADER as StemLessonLoader<StemLessonLike>,
    grades: ['10', '11', '12'],
  },
  physics: {
    id: 'physics',
    label: 'Vật lí',
    loader: PHYSICS_LOADER as StemLessonLoader<StemLessonLike>,
    grades: ['10', '11', '12'],
  },
  chemistry: {
    id: 'chemistry',
    label: 'Hoá học',
    loader: CHEM_LOADER as StemLessonLoader<StemLessonLike>,
    grades: ['10', '11', '12'],
  },
  biology: {
    id: 'biology',
    label: 'Sinh học',
    loader: BIOLOGY_LOADER as StemLessonLoader<StemLessonLike>,
    grades: ['10', '11', '12'],
  },
}

/** Môn này có bài học theo khuôn STEM không (dùng để quyết định có hiện nút "Bài học"). */
export function getStemSubject(subjectId: string | undefined): StemSubject | undefined {
  if (!subjectId) return undefined
  return STEM_SUBJECTS[subjectId as StemSubjectId]
}

/** Đường dẫn danh sách bài học của một môn. */
export function duongDanDanhSachBai(subjectId: StemSubjectId): string {
  return `/goc-hoc-tap/${subjectId}/bai-hoc`
}

/** Đường dẫn một bài học — mã giữ nguyên, phần slug chỉ để người đọc và máy tìm kiếm hiểu. */
export function duongDanBaiHoc(subjectId: StemSubjectId, lessonId: string, title: string): string {
  return `/goc-hoc-tap/${subjectId}/bai-hoc/${buildSlugSegment(lessonId, title)}`
}

/** Lấy lại mã bài từ đoạn URL, bỏ qua phần mô tả phía sau `--`. */
export function maBaiTuUrl(segment: string | undefined): string {
  return segment ? idFromSlugSegment(segment) : ''
}

const NHAN_CAP: Record<string, string> = {
  'hsg-truong': 'Cấp trường',
  'hsg-tinh': 'Cấp tỉnh',
  'hsg-quoc-gia': 'Cấp quốc gia',
}

/** Tên tiếng Việt của một cấp chuyên đề bồi dưỡng học sinh giỏi. */
export function nhanCapHsg(tier: string | undefined): string {
  return tier ? (NHAN_CAP[tier] ?? tier) : ''
}
