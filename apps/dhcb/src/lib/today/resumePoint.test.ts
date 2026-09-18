import { describe, it, expect } from 'vitest'
import { ResumePointSchema } from '@dhcb/core-contracts/todayPlan'
import type { LearningSession, ResumableSessionSummary } from '../learningSession'
import { MATH_LOADER } from '@dhcb/subject-math/lessonsLoader'
import type { CefrLevel } from '../../data/cefr'
import { resumePointFromSummary, resumeTarget, toResumePoint } from './resumePoint'

const levelA1 = {
  id: 'A1',
  units: [
    {
      id: 'a1-u1',
      titleVi: 'Chào hỏi',
      grammar: [{ id: 'g1', titleVi: 'Thì hiện tại đơn' }],
      vocabCircleIds: ['c1'],
    },
  ],
} as unknown as CefrLevel

const NOW = 1_757_900_000_000

const session: LearningSession = {
  version: 1,
  subjectId: 'programming',
  courseId: 'git',
  contentId: 'p1-u1-l1',
  contentVersion: 'v1',
  owner: { kind: 'account', id: 'u1' },
  stepIndex: 3,
  stepLabel: 'quiz',
  draft: { code: 'print(1)' },
  startedAt: NOW - 100_000,
  updatedAt: NOW - 1_000,
}

describe('toResumePoint', () => {
  it('chép nguyên ngữ cảnh của phiên, đúng hợp đồng', () => {
    const point = ResumePointSchema.parse(toResumePoint(session))
    expect(point.contentId).toBe('p1-u1-l1')
    expect(point.courseId).toBe('git')
    expect(point.step).toBe(3)
    expect(point.activityId).toBe('quiz')
    expect(point.hasDraft).toBe(true)
    expect(point.updatedAt).toBe(session.updatedAt)
    expect(point.sessionId).toContain('u1')
  })

  it('phiên không có nháp → hasDraft false', () => {
    expect(toResumePoint({ ...session, draft: undefined }).hasDraft).toBe(false)
    expect(toResumePoint({ ...session, draft: null }).hasDraft).toBe(false)
  })

  it('tóm tắt phiên không mang nháp → hasDraft false (không hứa suông)', () => {
    const summary: ResumableSessionSummary = {
      subjectId: 'programming',
      contentId: 'p1-u1-l1',
      stepIndex: 0,
      updatedAt: NOW,
    }
    const point = resumePointFromSummary(summary, { kind: 'guest', id: 'guest_1' })
    expect(ResumePointSchema.parse(point).hasDraft).toBe(false)
    expect(point.courseId).toBeUndefined()
  })
})

describe('resumeTarget', () => {
  it('Lập trình: href dựng qua duongDanBaiHoc và giữ ?khoa=', () => {
    const target = resumeTarget(toResumePoint(session))
    expect(target?.href.startsWith('/goc-hoc-tap/programming/bai-hoc/p1-u1-l1--')).toBe(true)
    expect(target?.href).toContain('?khoa=git')
    expect(target?.title.length).toBeGreaterThan(0)
  })

  it('Lập trình: bài đã bị gỡ khỏi registry → không tra được (resolver sẽ bỏ phiên)', () => {
    expect(resumeTarget(toResumePoint({ ...session, contentId: 'khong-ton-tai' }))).toBeUndefined()
  })

  it('Tiếng Anh: tra ra cấp chứa vòng từ vựng', () => {
    const point = toResumePoint({ ...session, subjectId: 'english', contentId: 'c1' })
    expect(resumeTarget(point)).toBeUndefined() // chưa truyền dữ liệu cấp
    const target = resumeTarget(point, { cefrLevels: [levelA1] })
    expect(target?.href).toBe('/lo-trinh-hoc/a1')
    expect(target?.title).toBe('Chào hỏi')
  })

  it('Tiếng Anh: tra ra cấp chứa bài ngữ pháp', () => {
    const point = toResumePoint({ ...session, subjectId: 'english', contentId: 'g1' })
    expect(resumeTarget(point, { cefrLevels: [levelA1] })?.title).toBe('Thì hiện tại đơn')
  })

  it('Tiếng Anh: nội dung không thuộc cấp nào → undefined', () => {
    const point = toResumePoint({ ...session, subjectId: 'english', contentId: 'la' })
    expect(resumeTarget(point, { cefrLevels: [levelA1] })).toBeUndefined()
  })

  it('STEM: href dựng qua stemLessonRoutes', () => {
    const bai = MATH_LOADER.index[0]
    const point = toResumePoint({ ...session, subjectId: 'mathematics', contentId: bai.id })
    expect(resumeTarget(point)?.href.startsWith('/goc-hoc-tap/mathematics/bai-hoc/')).toBe(true)
  })

  it('môn lạ → undefined, không ném lỗi', () => {
    const point = toResumePoint({ ...session, subjectId: 'astrology', contentId: 'x' })
    expect(resumeTarget(point)).toBeUndefined()
  })
})
