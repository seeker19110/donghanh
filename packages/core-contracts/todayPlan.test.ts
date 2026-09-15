import { describe, it, expect } from 'vitest'
import {
  ResumePointSchema,
  TodayItemSchema,
  TodayPlanSchema,
  TodaySourceSchema,
  todayItemId,
  type TodayItem,
} from './todayPlan.js'

const NOW = 1_757_900_000_000

const resume = {
  sessionId: 'dhcb_lsession_v1_account:u1_programming_p3-u10-l1',
  subjectId: 'programming',
  courseId: 'git',
  contentId: 'p3-u10-l1',
  step: 1,
  hasDraft: true,
  updatedAt: NOW - 5000,
}

const item: TodayItem = {
  id: 'next:programming:p3-u10-l2',
  kind: 'next',
  subjectId: 'programming',
  contentId: 'p3-u10-l2',
  title: 'Nhánh và merge',
  href: '/lap-trinh/bai-hoc/p3-u10-l2--nhanh-va-merge?khoa=git',
  evidenceSource: 'outline.next',
}

describe('ResumePointSchema', () => {
  it('nhận điểm quay lại đủ trường', () => {
    expect(ResumePointSchema.parse(resume).contentId).toBe('p3-u10-l1')
  })

  it('từ chối updatedAt không phải mốc thời gian dương', () => {
    expect(ResumePointSchema.safeParse({ ...resume, updatedAt: 0 }).success).toBe(false)
  })

  it('hasDraft là bắt buộc — không suy đoán nháp', () => {
    const thieu: Record<string, unknown> = { ...resume }
    delete thieu.hasDraft
    expect(ResumePointSchema.safeParse(thieu).success).toBe(false)
  })
})

describe('TodayItemSchema', () => {
  it('href phải là route NỘI BỘ', () => {
    expect(TodayItemSchema.parse(item).href.startsWith('/')).toBe(true)
    expect(TodayItemSchema.safeParse({ ...item, href: 'https://vi.dụ/x' }).success).toBe(false)
    expect(TodayItemSchema.safeParse({ ...item, href: '//cdn.vi-du/x' }).success).toBe(false)
  })

  it('evidenceSource phải thuộc bảng nguồn bằng chứng', () => {
    expect(TodaySourceSchema.options).toContain('session.resume')
    expect(TodayItemSchema.safeParse({ ...item, evidenceSource: 'tu-bia' }).success).toBe(false)
  })

  it('title không được rỗng và bị chặn độ dài', () => {
    expect(TodayItemSchema.safeParse({ ...item, title: '' }).success).toBe(false)
    expect(TodayItemSchema.safeParse({ ...item, title: 'a'.repeat(161) }).success).toBe(false)
  })

  it('todayItemId dựng đúng khuôn, thiếu trường thì dùng dấu gạch', () => {
    expect(todayItemId('next', 'english', 'c1')).toBe('next:english:c1')
    expect(todayItemId('pick', undefined, undefined)).toBe('pick:-:-')
  })
})

describe('TodayPlanSchema', () => {
  const plan = { primary: item, secondary: [], subjectsSeen: ['programming'], builtAt: NOW }

  it('nhận kế hoạch hợp lệ', () => {
    expect(TodayPlanSchema.parse(plan).primary?.id).toBe(item.id)
  })

  it("kind:'resume' bắt buộc có resume kèm updatedAt", () => {
    const thieu = { ...plan, primary: { ...item, kind: 'resume' as const } }
    expect(TodayPlanSchema.safeParse(thieu).success).toBe(false)
    const du = { ...plan, primary: { ...item, kind: 'resume' as const, resume } }
    expect(TodayPlanSchema.parse(du).primary?.resume?.updatedAt).toBe(resume.updatedAt)
  })

  it("kind:'pick' phải nói rõ là chưa có bằng chứng", () => {
    const sai = { ...plan, primary: { ...item, kind: 'pick' as const } }
    expect(TodayPlanSchema.safeParse(sai).success).toBe(false)
  })

  it('tối đa 2 mục phụ', () => {
    const qua = {
      ...plan,
      secondary: [1, 2, 3].map((n) => ({ ...item, id: `next:programming:l${n}` })),
    }
    expect(TodayPlanSchema.safeParse(qua).success).toBe(false)
  })

  it('mục phụ không trùng id với mục chính và không bao giờ là pick', () => {
    expect(TodayPlanSchema.safeParse({ ...plan, secondary: [item] }).success).toBe(false)
    const pick = {
      ...item,
      id: 'pick:-:-',
      kind: 'pick' as const,
      evidenceSource: 'none' as const,
      href: '/goc-hoc-tap',
    }
    expect(TodayPlanSchema.safeParse({ ...plan, secondary: [pick] }).success).toBe(false)
  })

  it('subjectId rỗng bị từ chối (môn phải có id thật)', () => {
    const sai = { ...plan, primary: { ...item, subjectId: '' } }
    expect(TodayPlanSchema.safeParse(sai).success).toBe(false)
  })
})
