// resumePoint — dịch phiên học dở (S08) sang `ResumePoint` của hợp đồng "Hôm nay" (S06), và tra
// đường dẫn mở lại phiên bằng ĐÚNG các hàm dựng URL đã có của từng môn.
//
// Vì sao tách riêng: `LearningSession` là khuôn LƯU (nháp, phiên bản nội dung, chủ sở hữu), còn
// `ResumePoint` là khuôn ĐI (đủ để mở lại đúng chỗ). Trộn hai khuôn lại thì thẻ "Hôm nay" phải
// biết chuyện lưu trữ, và mỗi lần S08 đổi trường là mọi nơi hiển thị phải sửa theo.
//
// KHÔNG tự ghép chuỗi URL ở đây: bài Lập trình đi qua `duongDanBaiHoc`, bài STEM đi qua
// `stemLessonRoutes.duongDanBaiHoc`, cấp CEFR đi qua danh sách cấp đã tải.
import type { ResumePoint } from '@dhcb/core-contracts/todayPlan'
import { getLessonSummary } from '@dhcb/subject-programming/lessonsLoader'
import type { StemSubjectId } from '@dhcb/core-contracts/stemLesson'
import type { CefrLevel } from '../../data/cefr'
import {
  sessionKey,
  type LearningSession,
  type ResumableSessionSummary,
  type SessionOwner,
} from '../learningSession'
import { duongDanBaiHoc } from '../programmingRoutes'
import { duongDanBaiHoc as duongDanBaiStem, getStemSubject } from '../stemLessonRoutes'
import { ENGLISH_SUBJECT_ID } from './englishNext'
import { PROGRAMMING_SUBJECT_ID } from './programmingNext'

/** Phiên đầy đủ → điểm quay lại. `hasDraft` đọc từ nháp thật, không đoán. */
export function toResumePoint(session: LearningSession): ResumePoint {
  return {
    sessionId: sessionKey({
      owner: session.owner,
      subjectId: session.subjectId,
      contentId: session.contentId,
    }),
    subjectId: session.subjectId,
    ...(session.courseId === undefined ? {} : { courseId: session.courseId }),
    contentId: session.contentId,
    ...(session.stepLabel === undefined ? {} : { activityId: session.stepLabel }),
    step: session.stepIndex,
    hasDraft: session.draft !== undefined && session.draft !== null,
    updatedAt: session.updatedAt,
  }
}

/**
 * Tóm tắt phiên (`listResumableSessions`) → điểm quay lại.
 *
 * Tóm tắt CỐ Ý không mang nháp (danh sách chỉ cần biết đi đâu), nên `hasDraft` là `false`: thà
 * nói ít hơn sự thật còn hơn hứa với người học một bản nháp mà thẻ không kiểm chứng được.
 */
export function resumePointFromSummary(
  summary: ResumableSessionSummary,
  owner: SessionOwner,
): ResumePoint {
  return {
    sessionId: sessionKey({
      owner,
      subjectId: summary.subjectId,
      contentId: summary.contentId,
    }),
    subjectId: summary.subjectId,
    ...(summary.courseId === undefined ? {} : { courseId: summary.courseId }),
    contentId: summary.contentId,
    ...(summary.stepLabel === undefined ? {} : { activityId: summary.stepLabel }),
    step: summary.stepIndex,
    hasDraft: false,
    updatedAt: summary.updatedAt,
  }
}

export interface ResumeTargetCtx {
  /** Cấp CEFR đã tải (Trang chủ đã có) — để tra cấp chứa nội dung tiếng Anh đang dở. */
  cefrLevels?: readonly CefrLevel[]
}

export interface ResumeTarget {
  href: string
  title: string
}

/** Cấp CEFR chứa một vòng từ vựng / bài ngữ pháp. */
function capChuaNoiDung(
  levels: readonly CefrLevel[],
  contentId: string,
): { level: CefrLevel; title: string } | undefined {
  for (const level of levels) {
    for (const unit of level.units) {
      if (unit.vocabCircleIds.includes(contentId)) return { level, title: unit.titleVi }
      const grammar = unit.grammar.find((g) => g.id === contentId)
      if (grammar) return { level, title: grammar.titleVi }
    }
  }
  return undefined
}

/**
 * Đường dẫn + tên bài để mở lại một phiên.
 *
 * `undefined` = không tra được (bài đã bị gỡ khỏi registry, môn lạ trong dữ liệu cũ). Khi ấy
 * resolver bỏ phiên và rơi xuống bài kế tiếp — thà thế còn hơn một nút bấm vào lỗi 404.
 */
export function resumeTarget(
  point: ResumePoint,
  ctx: ResumeTargetCtx = {},
): ResumeTarget | undefined {
  if (point.subjectId === PROGRAMMING_SUBJECT_ID) {
    const lesson = getLessonSummary(point.contentId)
    if (!lesson) return undefined
    return {
      href: duongDanBaiHoc(
        lesson,
        point.courseId === undefined ? {} : { courseId: point.courseId },
      ),
      title: lesson.title,
    }
  }

  if (point.subjectId === ENGLISH_SUBJECT_ID) {
    const found = ctx.cefrLevels ? capChuaNoiDung(ctx.cefrLevels, point.contentId) : undefined
    if (!found) return undefined
    return { href: `/lo-trinh-hoc/${found.level.id.toLowerCase()}`, title: found.title }
  }

  const stem = getStemSubject(point.subjectId)
  if (stem) {
    const summary = stem.loader.getSummary(point.contentId)
    if (!summary) return undefined
    return {
      href: duongDanBaiStem(point.subjectId as StemSubjectId, summary.id, summary.title),
      title: summary.title,
    }
  }

  return undefined
}
