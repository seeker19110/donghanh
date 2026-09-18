// lessonOutlineContext — quyết định TRANG BÀI HỌC môn Lập trình đang nằm trong ngữ cảnh nào:
// đi theo một KHOÁ NGẮN (`?khoa=git`) hay theo XƯƠNG SỐNG P1–P6.
//
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md (S07-2, AC-13).
//
// VÌ SAO TÁCH KHỎI TRANG: một quyết định nhỏ nhưng kéo theo BỐN thứ phải khớp nhau — cây mục
// lục, breadcrumb, nút quay lại, và bài trước/sau. Để bốn thứ đó tính rải rác trong JSX là
// cách chắc chắn để một hôm nào đó breadcrumb nói "khoá Git" còn nút quay lại đưa về P3. Gom
// vào một hàm THUẦN ở đây thì test chạy trong mili giây và không cần dựng cả trang.
import type { Outline } from '@dhcb/core-contracts/outline'
import { getShortCourse, SHORT_COURSES } from '@dhcb/subject-programming/courses/registry'
import type { ShortCourse } from '@dhcb/subject-programming/courses/types'
import { getLevelIdOfLesson, getProgrammingLevel } from '@dhcb/subject-programming/curriculum'
import { duongDanBac, duongDanKhoa } from '../programmingRoutes'
import {
  buildCourseOutline,
  buildLevelOutline,
  type ProgrammingOutlineCtx,
} from './programmingOutline'

export interface LessonOutlineContext {
  /** Cây để vẽ mục lục; `undefined` khi bài không thuộc bậc nào và không mở theo khoá nào. */
  outline: Outline | undefined
  /** Khoá đang đi theo — chỉ khác `undefined` khi khoá đó THẬT SỰ chứa bài này. */
  course: ShortCourse | undefined
  /** Tiêu đề mục lục / nhãn nút mở panel. */
  tenMucLuc: string
  /** Khoá lưu trạng thái mở/thu, riêng cho từng khoá/bậc. */
  storageKey: string
  /** Nút quay lại: về khoá đang học, hoặc về bậc, hoặc về trang môn. */
  backTo: string
  /** Đốt cha ĐỘNG cho breadcrumb (cây route tĩnh chỉ biết tới "Lập trình"). */
  crumbs: Array<{ label: string; to: string }>
  /**
   * Bài CHỈ thuộc khoá ngắn mà mở không kèm `?khoa=`: không có cây nào để vẽ. Danh sách này
   * cho trang chỉ đường về các khoá đang chứa bài (ca lỗi §3.4) thay vì bỏ mặc người học.
   */
  khoaChuaBai: readonly ShortCourse[]
}

/**
 * @param lessonId mã bài đang mở
 * @param courseId mã khoá đọc từ `?khoa=` (đã qua `maKhoaTuQuery`, nên mã lạ là `undefined`)
 */
export function lessonOutlineContext(
  lessonId: string,
  courseId: string | undefined,
  ctx: ProgrammingOutlineCtx,
): LessonOutlineContext {
  const khoa = courseId ? getShortCourse(courseId) : undefined
  // `?khoa=` chỉ có giá trị khi khoá đó thật sự chứa bài này — nếu không thì bỏ qua query và
  // dùng cây bậc, KHÔNG chuyển hướng (chuyển hướng ở đây là mời một vòng lặp vào nhà).
  const course =
    khoa?.chapters.some((ch) => ch.lessonIds.includes(lessonId)) === true ? khoa : undefined

  const levelId = getLevelIdOfLesson(lessonId)
  const level = levelId ? getProgrammingLevel(levelId) : undefined

  const outline = course
    ? buildCourseOutline(course.id, ctx)
    : levelId
      ? buildLevelOutline(levelId, ctx)
      : undefined

  return {
    outline,
    course,
    tenMucLuc: course ? 'Mục lục khoá học' : 'Mục lục môn học',
    storageKey: course ? `khoa:${course.id}` : (levelId ?? 'lap-trinh'),
    backTo: course ? duongDanKhoa(course) : level ? duongDanBac(level) : '/goc-hoc-tap/programming',
    crumbs: course
      ? [{ label: `Khoá ${course.title}`, to: duongDanKhoa(course) }]
      : level
        ? [{ label: level.name, to: duongDanBac(level) }]
        : [],
    khoaChuaBai:
      outline === undefined
        ? SHORT_COURSES.filter((c) => c.chapters.some((ch) => ch.lessonIds.includes(lessonId)))
        : [],
  }
}
