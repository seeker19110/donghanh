// programmingOutline — dựng cây mục lục môn Lập trình: theo BẬC (P1–P6) hoặc theo KHOÁ NGẮN.
//
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md §③.2 và §③.3 (hai dòng đầu).
//
// VÌ SAO NẰM Ở `apps/` CHỨ KHÔNG PHẢI `packages/core-learner/outline/` (đặc tả §7 Q3 định đặt
// ở gói): `packages/subject-programming` đã tham chiếu `packages/core-learner` trong project
// references, nên để adapter ở `core-learner` là tạo VÒNG phụ thuộc giữa hai gói (tsc -b từ
// chối). Ngoài ra URL bài học do `lib/programmingRoutes.ts` dựng, mà `packages/` không được
// import `apps/`. Adapter STEM (chỉ cần chỉ mục + hàm dựng href truyền vào) vẫn ở gói như
// quyết định Q3. Hợp đồng `OutlineNode` vẫn nằm MỘT chỗ ở `@dhcb/core-contracts/outline`.
//
// BẤT BIẾN (AC-6): chỉ đọc CHỈ MỤC NHẸ `@dhcb/subject-programming/lessonsLoader`. KHÔNG bao
// giờ import `…/lessons` (registry 3 MB) và không gọi `loadLesson`/`loadUnitLessons` — dựng
// mục lục là việc của chỉ mục, không phải của nội dung bài.
import type { Outline, OutlineNode } from '@dhcb/core-contracts/outline'
import {
  PROGRAMMING_LEVELS,
  getProgrammingLevel,
  nhomUnitTheoTrack,
  type ProgrammingLevelId,
  type ProgrammingUnit,
} from '@dhcb/subject-programming/curriculum'
import {
  getLessonSummary,
  getUnitSummaries,
  type LessonSummary,
} from '@dhcb/subject-programming/lessonsLoader'
import { getShortCourse } from '@dhcb/subject-programming/courses/registry'
import type { ShortCourseId } from '@dhcb/subject-programming/courses/types'
import type { LevelLockInfo } from '@dhcb/subject-programming/levelLock'
import type { ProgrammingLessonProgress } from '../programmingProgress'
import { duongDanBaiHoc } from '../programmingRoutes'

const SUBJECT_ID = 'programming'
/** Nguồn bằng chứng tiến độ — cùng một tên cho cả cây bậc lẫn cây khoá (cùng `lessonId`). */
const EVIDENCE = 'programming.progress'

export interface ProgrammingOutlineCtx {
  /** Tiến độ đã tải; `[]` khi chưa tải xong hoặc lỗi. */
  progress: readonly ProgrammingLessonProgress[]
  /** Chưa `ready` → mọi bài là `unknown` ("chưa tải được tiến độ"), KHÔNG phải `not-started`. */
  progressState: 'loading' | 'ready' | 'error'
  /** Từ `levelLockMap()`; rỗng = coi như không khoá. Adapter KHÔNG tự tính lại luật khoá. */
  lockMap: ReadonlyMap<string, LevelLockInfo>
}

/** Tiến độ của MỘT bài, theo đúng trạng thái tải. */
function tienDoBai(
  lessonId: string,
  ctx: ProgrammingOutlineCtx,
): Pick<OutlineNode, 'progress' | 'evidenceSource'> {
  if (ctx.progressState !== 'ready') return { progress: 'unknown' }
  const row = ctx.progress.find((p) => p.lessonId === lessonId)
  if (!row) return { progress: 'not-started' }
  return row.status === 'completed'
    ? { progress: 'completed', evidenceSource: EVIDENCE }
    : { progress: 'in-progress', evidenceSource: EVIDENCE }
}

/** Câu giải thích khoá, lấy từ `LevelLockInfo` — không tự bịa luật, không tự bịa con số. */
function lyDoKhoa(info: LevelLockInfo | undefined): string | undefined {
  if (!info?.locked) return undefined
  if (!info.requiredLevelId) return 'Bậc này chưa mở'
  const ten = getProgrammingLevel(info.requiredLevelId)?.name ?? info.requiredLevelId.toUpperCase()
  return `Còn ${info.remaining} bài ở ${info.requiredLevelId.toUpperCase()} · ${ten} nữa là mở`
}

function nutBai(
  lesson: LessonSummary,
  parentId: string,
  order: number,
  ctx: ProgrammingOutlineCtx,
  opts: { courseId?: ShortCourseId; locked: boolean; lockReason?: string },
): OutlineNode {
  const { courseId, locked, lockReason } = opts
  return {
    nodeId: courseId ? `lesson:${lesson.id}@${courseId}` : `lesson:${lesson.id}`,
    parentId,
    subjectId: SUBJECT_ID,
    ...(courseId ? { courseId } : {}),
    contentId: lesson.id,
    kind: 'lesson',
    title: lesson.title,
    order,
    // Bài khoá KHÔNG có href — không dẫn người học tới trang họ chưa vào được.
    ...(locked ? {} : { href: duongDanBaiHoc(lesson, courseId ? { courseId } : undefined) }),
    availability: locked ? 'locked' : 'available',
    ...(locked && lockReason ? { lockReason } : {}),
    ...tienDoBai(lesson.id, ctx),
  }
}

const demBai = (n: number): string => `${n} bài`

/**
 * Cây một BẬC: `level → (mạch, chỉ P6) → unit → bài`.
 * Bậc lạ → `undefined` (trang tự `Navigate` về `/lap-trinh` như hiện nay).
 */
export function buildLevelOutline(
  levelId: ProgrammingLevelId | string,
  ctx: ProgrammingOutlineCtx,
): Outline | undefined {
  const level = PROGRAMMING_LEVELS.find((l) => l.id === levelId)
  if (!level) return undefined

  const lockInfo = ctx.lockMap.get(level.id)
  const locked = lockInfo?.locked === true
  const lockReason = lyDoKhoa(lockInfo)

  const rootId = `level:${level.id}`
  const nodes: OutlineNode[] = [
    {
      nodeId: rootId,
      subjectId: SUBJECT_ID,
      contentId: level.id,
      kind: 'level',
      title: `${level.id.toUpperCase()} · ${level.name}`,
      hint: `${level.units.length} unit`,
      order: 0,
      availability: locked ? 'locked' : 'available',
      ...(locked && lockReason ? { lockReason } : {}),
      progress: 'unknown',
    },
  ]

  // P6 có 65 unit thuộc bốn mạch khác hẳn nhau → thêm một tầng "mạch" để cây còn đọc được.
  // P1–P5 không unit nào khai `track` nên `nhomUnitTheoTrack` chỉ trả MỘT nhóm: khi đó bỏ
  // tầng mạch đi, giữ nguyên hình dạng cây hai tầng như các bậc khác.
  const nhom = nhomUnitTheoTrack(level.units)
  const coTangMach = nhom.length > 1

  let orderMach = 0
  for (const { track, units } of nhom) {
    let parentId = rootId
    if (coTangMach) {
      parentId = `chapter:${level.id}-track-${track.id}`
      nodes.push({
        nodeId: parentId,
        parentId: rootId,
        subjectId: SUBJECT_ID,
        contentId: track.id,
        kind: 'chapter',
        title: track.title,
        hint: `${units.length} unit`,
        order: orderMach++,
        availability: locked ? 'locked' : 'available',
        ...(locked && lockReason ? { lockReason } : {}),
        progress: 'unknown',
      })
    }
    units.forEach((unit, unitIndex) => {
      themUnit(nodes, unit, parentId, unitIndex, ctx, { locked, lockReason })
    })
  }

  return { rootId, subjectId: SUBJECT_ID, nodes, builtAt: Date.now() }
}

function themUnit(
  nodes: OutlineNode[],
  unit: ProgrammingUnit,
  parentId: string,
  order: number,
  ctx: ProgrammingOutlineCtx,
  opts: { locked: boolean; lockReason?: string },
): void {
  const lessons = getUnitSummaries(unit.id)
  const unitNodeId = `chapter:${unit.id}`
  nodes.push({
    nodeId: unitNodeId,
    parentId,
    subjectId: SUBJECT_ID,
    contentId: unit.id,
    kind: 'chapter',
    title: unit.title,
    // Unit CHƯA SOẠN BÀI vẫn giữ nút và nói rõ "sắp mở" — đó là thông tin có chủ đích cho
    // người học (biết phần này đang tới), chứ không sinh nút bài rỗng.
    hint: lessons.length === 0 ? 'sắp mở' : demBai(lessons.length),
    order,
    availability: opts.locked ? 'locked' : 'available',
    ...(opts.locked && opts.lockReason ? { lockReason: opts.lockReason } : {}),
    progress: 'unknown',
  })
  lessons.forEach((lesson, i) => {
    nodes.push(nutBai(lesson, unitNodeId, i, ctx, opts))
  })
}

/**
 * Cây một KHOÁ NGẮN: `course → chương → bài`. Khoá ngắn không có luật khoá nào (học độc lập).
 * Mã khoá lạ → `undefined`.
 *
 * Mọi nút mang `courseId`, và href bài mang `?khoa=<id>`: một bài có thể nằm trong nhiều khoá
 * (10 bài chung giữa `ml` và `mlds`), mở bài xong phải biết đường về đúng khoá đang học.
 */
export function buildCourseOutline(
  courseId: ShortCourseId | string,
  ctx: ProgrammingOutlineCtx,
): Outline | undefined {
  const course = getShortCourse(courseId)
  if (!course) return undefined

  const rootId = `course:${course.id}`
  const soBai = course.chapters.reduce((sum, c) => sum + c.lessonIds.length, 0)
  const nodes: OutlineNode[] = [
    {
      nodeId: rootId,
      subjectId: SUBJECT_ID,
      courseId: course.id,
      contentId: course.id,
      kind: 'level',
      title: course.title,
      hint: demBai(soBai),
      order: 0,
      availability: 'available',
      progress: 'unknown',
    },
  ]

  course.chapters.forEach((chapter, chapterIndex) => {
    const chapterNodeId = `chapter:${chapter.id}@${course.id}`
    // Bài được tham chiếu bằng id: bài chưa có trong chỉ mục thì bỏ qua (không dựng nút rỗng,
    // không ném) — `courses.test.ts` đã canh dữ liệu, đây chỉ là lưới an toàn lúc chạy.
    const lessons = chapter.lessonIds
      .map((id) => getLessonSummary(id))
      .filter((s): s is LessonSummary => s !== undefined)
    nodes.push({
      nodeId: chapterNodeId,
      parentId: rootId,
      subjectId: SUBJECT_ID,
      courseId: course.id,
      contentId: chapter.id,
      kind: 'chapter',
      title: chapter.title,
      hint: lessons.length === 0 ? 'sắp mở' : demBai(lessons.length),
      order: chapterIndex,
      availability: 'available',
      progress: 'unknown',
    })
    lessons.forEach((lesson, i) => {
      nodes.push(nutBai(lesson, chapterNodeId, i, ctx, { courseId: course.id, locked: false }))
    })
  })

  return { rootId, subjectId: SUBJECT_ID, courseId: course.id, nodes, builtAt: Date.now() }
}
