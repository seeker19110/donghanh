// Bảy test bất biến ngôn ngữ T1–T5 (§③.5 của đặc tả S05) + luật chọn việc.
// T6 ở `StartByIntent.test.tsx`, T7 ở `e2e/start-by-intent.spec.ts`.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Outline, OutlineNode } from '@dhcb/core-contracts/outline'
import {
  LearnerIntentSchema,
  type IntentSubjectId,
  type LearnerIntent,
} from '@dhcb/core-contracts/learnerIntent'
import {
  pickStartAction,
  collectStartActionTexts,
  StartActionResultSchema,
  CATALOG_PATH,
  SUBJECT_OVERVIEW_PATH,
  type StartActionCtx,
} from './pickStartAction'
import { findIntentForbiddenLanguage } from './intentForbidden'

const SUBJECTS: IntentSubjectId[] = [
  'english',
  'programming',
  'mathematics',
  'physics',
  'chemistry',
  'biology',
]
const PURPOSES = ['thi_cu', 'cong_viec', 'so_thich', 'chua_ro'] as const
const TIMES = [5, 10, 20, 30] as const
const LEVELS = ['lv_new', 'lv_some', 'lv_solid'] as const
const GRADES = [undefined, '10', '11', '12'] as const

/** Cây mẫu: bài đầu ĐÃ XONG, bài hai KHOÁ, bài ba mới là việc đúng. */
function cayMau(subjectId: IntentSubjectId): Outline {
  const nodes: OutlineNode[] = [
    {
      nodeId: `level:${subjectId}`,
      subjectId,
      kind: 'level',
      title: 'Chặng đầu',
      order: 0,
      availability: 'available',
      progress: 'not-started',
    },
    {
      nodeId: `lesson:${subjectId}-1`,
      parentId: `level:${subjectId}`,
      subjectId,
      contentId: `${subjectId}-1`,
      kind: 'lesson',
      title: 'Bài đã học xong',
      order: 0,
      href: `/x/${subjectId}/1`,
      availability: 'available',
      progress: 'completed',
      evidenceSource: 'test',
    },
    {
      nodeId: `lesson:${subjectId}-2`,
      parentId: `level:${subjectId}`,
      subjectId,
      contentId: `${subjectId}-2`,
      kind: 'lesson',
      title: 'Bài đang khoá',
      order: 1,
      availability: 'locked',
      lockReason: 'Còn 2 bài nữa là mở',
      progress: 'not-started',
    },
    {
      nodeId: `lesson:${subjectId}-3`,
      parentId: `level:${subjectId}`,
      subjectId,
      contentId: `${subjectId}-3`,
      kind: 'lesson',
      title: 'Làm quen với câu chào hỏi hằng ngày trong đời sống tại Việt Nam',
      order: 2,
      href: `/x/${subjectId}/3`,
      availability: 'available',
      progress: 'not-started',
    },
  ]
  return { rootId: `level:${subjectId}`, subjectId, nodes, builtAt: 1_700_000_000_000 }
}

function ctxDu(ids: readonly IntentSubjectId[]): StartActionCtx {
  return {
    outlines: new Map(ids.map((id) => [id, cayMau(id)])),
    catalogPath: CATALOG_PATH,
  }
}

function yDinh(fields: Partial<LearnerIntent> & { subjectIds: IntentSubjectId[] }): LearnerIntent {
  return LearnerIntentSchema.parse({
    schemaVersion: 1,
    createdAt: 1_700_000_000_000,
    updatedAt: 1_700_000_000_000,
    ...fields,
  })
}

/** Mọi tổ hợp ĐƠN MÔN: 6 × 4 × 4 × 3 × 4 = 1.152. */
function moiToHopDonMon(): LearnerIntent[] {
  const out: LearnerIntent[] = []
  for (const subject of SUBJECTS)
    for (const purpose of PURPOSES)
      for (const timeBudget of TIMES)
        for (const level of LEVELS)
          for (const grade of GRADES) {
            // `grade` chỉ hợp lệ khi có môn STEM — ca không hợp lệ đã có test hợp đồng riêng.
            const hopLe = grade === undefined || subject !== 'english'
            const stem = subject !== 'english' && subject !== 'programming'
            out.push(
              yDinh({
                subjectIds: [subject],
                purpose,
                timeBudget,
                level,
                ...(hopLe && stem && grade ? { grade } : {}),
              }),
            )
          }
  return out
}

const DA_MON: LearnerIntent[] = [
  yDinh({ subjectIds: ['programming', 'mathematics'] }),
  yDinh({ subjectIds: ['mathematics', 'programming'], grade: '11' }),
  yDinh({ subjectIds: ['english', 'physics', 'biology'], grade: '12', purpose: 'thi_cu' }),
  yDinh({ subjectIds: ['english', 'programming', 'mathematics', 'physics'], timeBudget: 30 }),
  yDinh({ subjectIds: SUBJECTS, grade: '10', level: 'lv_solid' }),
  yDinh({ subjectIds: ['chemistry', 'english'], purpose: 'chua_ro', timeBudget: 5 }),
]

const MOI_Y_DINH = [...moiToHopDonMon(), ...DA_MON]

describe('pickStartAction — luật chọn việc', () => {
  it('có đúng 1.152 tổ hợp đơn môn (test không âm thầm co lại)', () => {
    expect(moiToHopDonMon()).toHaveLength(1152)
  })

  it('bỏ hết 5 câu (không có ý định) → danh mục môn, KHÔNG phải môn Tiếng Anh [T5]', () => {
    const r = pickStartAction(null, ctxDu(SUBJECTS))
    expect(r.primary.href).toBe('/goc-hoc-tap')
    expect(r.alternatives).toEqual([])
    for (const xau of ['/hoc-tieng-anh', '/goc-hoc-tap/english', '/lo-trinh-hoc']) {
      expect(r.primary.href).not.toContain(xau)
    }
  })

  it('chọn LÁ ĐẦU còn học được: bỏ qua bài đã xong và bài đang khoá (không nới khoá)', () => {
    const r = pickStartAction(yDinh({ subjectIds: ['programming'] }), ctxDu(['programming']))
    expect(r.primary.href).toBe('/x/programming/3')
    expect(r.primary.title.startsWith('Bắt đầu: ')).toBe(true)
  })

  it('toàn cây khoá / không dựng được cây → trang tổng quan môn, không trắng trang', () => {
    const khoaHet: Outline = {
      ...cayMau('physics'),
      nodes: cayMau('physics').nodes.map((n) =>
        n.kind === 'lesson' ? { ...n, availability: 'locked' as const, href: undefined } : n,
      ),
    }
    const r1 = pickStartAction(yDinh({ subjectIds: ['physics'] }), {
      outlines: new Map([['physics', khoaHet]]),
      catalogPath: CATALOG_PATH,
    })
    expect(r1.primary.href).toBe(SUBJECT_OVERVIEW_PATH.physics)

    const r2 = pickStartAction(yDinh({ subjectIds: ['biology'] }), {
      outlines: new Map([['biology', undefined]]),
      catalogPath: CATALOG_PATH,
    })
    expect(r2.primary.href).toBe(SUBJECT_OVERVIEW_PATH.biology)
  })

  it('đa môn: môn chọn TRƯỚC là việc chính, đổi thứ tự thì đổi việc chính [AC-6]', () => {
    const a = pickStartAction(
      yDinh({ subjectIds: ['programming', 'mathematics'] }),
      ctxDu(SUBJECTS),
    )
    expect(a.primary.subjectId).toBe('programming')
    expect(a.alternatives[0]?.subjectId).toBe('mathematics')

    const b = pickStartAction(
      yDinh({ subjectIds: ['mathematics', 'programming'] }),
      ctxDu(SUBJECTS),
    )
    expect(b.primary.subjectId).toBe('mathematics')
    expect(b.alternatives[0]?.subjectId).toBe('programming')
  })

  it('một môn → không bịa thêm môn chưa chọn', () => {
    const r = pickStartAction(yDinh({ subjectIds: ['english'] }), ctxDu(SUBJECTS))
    expect(r.alternatives).toEqual([])
  })

  it('tất định: cùng đầu vào cho cùng kết quả', () => {
    const intent = yDinh({ subjectIds: ['english', 'physics'], grade: '10', timeBudget: 20 })
    expect(pickStartAction(intent, ctxDu(SUBJECTS))).toEqual(
      pickStartAction(intent, ctxDu(SUBJECTS)),
    )
  })

  it('KHÔNG import AI/mạng trong module thuần [AC-2/AC-11]', () => {
    const src = readFileSync(
      join(process.cwd(), 'apps/dhcb/src/lib/intent/pickStartAction.ts'),
      'utf-8',
    )
    for (const cam of ['aiConfig', 'agentApi', 'fetch(', '/api/']) {
      expect(src.includes(cam), `pickStartAction.ts không được dùng "${cam}"`).toBe(false)
    }
  })

  it('KHÔNG đọc `isDefault` của registry [AC-5]', () => {
    for (const f of [
      'pickStartAction.ts',
      'intentForbidden.ts',
      'learnerIntentStore.ts',
      'buildIntentOutlines.ts',
    ]) {
      const src = readFileSync(join(process.cwd(), 'apps/dhcb/src/lib/intent', f), 'utf-8')
      expect(src.includes('isDefault'), `${f} không được đọc isDefault`).toBe(false)
    }
  })
})

describe('pickStartAction — bất biến trên MỌI tổ hợp', () => {
  const ketQua = MOI_Y_DINH.map((intent) => pickStartAction(intent, ctxDu(SUBJECTS)))

  it('T3 — luôn đúng 1 primary, ≤ 2 alternatives, id khác nhau, href nội bộ', () => {
    for (const r of ketQua) {
      expect(r.primary.id).toBeTruthy()
      expect(r.alternatives.length).toBeLessThanOrEqual(2)
      const ids = [r.primary.id, ...r.alternatives.map((a) => a.id)]
      expect(new Set(ids).size).toBe(ids.length)
      for (const a of [r.primary, ...r.alternatives]) {
        expect(a.href.startsWith('/')).toBe(true)
        expect(a.href.startsWith('//')).toBe(false)
        expect(a.href.startsWith('http')).toBe(false)
      }
    }
  })

  it('T4 — ý định là ĐẦU VÀO, không bao giờ là đầu ra (schema strict)', () => {
    for (const r of ketQua) expect(() => StartActionResultSchema.parse(r)).not.toThrow()
    expect(StartActionResultSchema.safeParse({ ...ketQua[0], level: 'lv_new' }).success).toBe(false)
    expect(
      StartActionResultSchema.safeParse({
        ...ketQua[0],
        primary: { ...ketQua[0]!.primary, score: 72 },
      }).success,
    ).toBe(false)
  })

  it('T1 + T2 — không tổ hợp nào sinh chuỗi khớp 12 mẫu cấm', () => {
    for (const r of ketQua) {
      const hits = findIntentForbiddenLanguage(collectStartActionTexts(r))
      expect(hits, JSON.stringify(hits)).toEqual([])
    }
  })

  it('không tổ hợp nào ném lỗi', () => {
    for (const intent of MOI_Y_DINH) {
      expect(() => pickStartAction(intent, ctxDu(SUBJECTS))).not.toThrow()
    }
  })
})

describe('findIntentForbiddenLanguage — bộ lọc thật sự bắt được', () => {
  it('bắt 3 mẫu MỚI của S05', () => {
    expect(findIntentForbiddenLanguage(['Hồ sơ năng lực của bạn đã sẵn sàng'])).not.toEqual([])
    expect(findIntentForbiddenLanguage(['Mức lv_some phù hợp'])).not.toEqual([])
    expect(findIntentForbiddenLanguage(['Bạn đang ở bậc khởi đầu'])).not.toEqual([])
  })

  it('vẫn bắt 9 mẫu cũ (tiếng Việt có dấu, không dùng \\b)', () => {
    expect(findIntentForbiddenLanguage(['Bạn đạt 72/100'])).not.toEqual([])
    expect(findIntentForbiddenLanguage(['Đáng lẽ bạn phải xong rồi'])).not.toEqual([])
  })

  it('không báo nhầm chữ bình thường', () => {
    expect(findIntentForbiddenLanguage(['Bắt đầu: Câu chào hỏi hằng ngày'])).toEqual([])
  })
})
