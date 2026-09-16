import { describe, it, expect } from 'vitest'
import { TodayItemSchema } from '@dhcb/core-contracts/todayPlan'
import type { CefrLevel } from '../../data/cefr'
import type { Circle } from '../../data/curriculum'
import { englishNext } from './englishNext'

function circle(id: string, soTu: number): Circle {
  return {
    id,
    titleVi: `Vòng ${id}`,
    titleEn: `Circle ${id}`,
    emoji: '🍜',
    words: Array.from({ length: soTu }, (_, i) => ({
      word: `w${i}`,
      pos: 'n',
      vi: `t${i}`,
      ex_en: '',
      ex_vi: '',
    })),
    sentences: [],
  } as unknown as Circle
}

const levelA1: CefrLevel = {
  id: 'A1',
  titleVi: 'Sơ cấp',
  titleEn: 'Beginner',
  subtitleVi: 'Người mới',
  goalVi: '',
  accent: 'emerald',
  canDo: [],
  units: [
    {
      id: 'a1-u1',
      titleVi: 'Chào hỏi',
      titleEn: 'Greetings',
      emoji: '👋',
      grammar: [
        {
          id: 'g1',
          titleVi: 'Thì hiện tại đơn',
          titleEn: 'Present simple',
        } as CefrLevel['units'][number]['grammar'][number],
      ],
      vocabCircleIds: ['c1'],
    },
  ],
}

const levelA2: CefrLevel = { ...levelA1, id: 'A2', units: [{ ...levelA1.units[0], id: 'a2-u1' }] }

const circleById: Record<string, Circle> = { c1: circle('c1', 10) }

const base = {
  levels: [levelA1],
  circleById,
  learned: new Set<string>(),
  doneGrammar: new Set<string>(),
  lockedMap: new Map<CefrLevel['id'], boolean>(),
  isA: true,
  srsDue: 0,
}

describe('englishNext', () => {
  it('vòng từ vựng chưa đủ → mục next với nhãn đếm từ, href là cấp đang học', () => {
    const { next } = englishNext(base)
    expect(TodayItemSchema.parse(next).href).toBe('/lo-trinh-hoc/a1')
    expect(next?.evidenceSource).toBe('english.vocab')
    expect(next?.title).toBe('🍜 Vòng c1 (0/10)')
    expect(next?.contentId).toBe('c1')
  })

  it('chiều B dùng nhãn tiếng Anh', () => {
    expect(englishNext({ ...base, isA: false }).next?.title).toContain('Circle c1')
  })

  it('xong từ vựng → chuyển sang bài ngữ pháp', () => {
    const learned = new Set(circleById.c1.words.map((w) => w.word))
    const { next } = englishNext({ ...base, learned })
    expect(next?.evidenceSource).toBe('english.cefrGrammar')
    expect(next?.title).toBe('Thì hiện tại đơn')
    expect(next?.hint).toBe('Ngữ pháp · Cấp A1')
  })

  it('cấp bị khoá bị bỏ qua, nhảy sang cấp mở tiếp theo', () => {
    const lockedMap = new Map<CefrLevel['id'], boolean>([['A1', true]])
    const { next } = englishNext({ ...base, levels: [levelA1, levelA2], lockedMap })
    expect(next?.href).toBe('/lo-trinh-hoc/a2')
  })

  it('xong hết mọi cấp → không mục nào (kể cả khi còn thẻ SRS)', () => {
    const learned = new Set(circleById.c1.words.map((w) => w.word))
    const doneGrammar = new Set(['g1'])
    expect(englishNext({ ...base, learned, doneGrammar, srsDue: 12 })).toEqual({})
  })

  it('có thẻ đến hạn → thêm mục ôn tập trỏ đúng cấp đang học', () => {
    const { review } = englishNext({ ...base, srsDue: 12 })
    expect(TodayItemSchema.parse(review).href).toBe('/lo-trinh-hoc/a1?tab=srs')
    expect(review?.title).toBe('Ôn 12 thẻ đến hạn')
    expect(review?.evidenceSource).toBe('english.srs')
  })

  it('không thẻ đến hạn → không mục ôn tập', () => {
    expect(englishNext(base).review).toBeUndefined()
  })

  it('không cấp nào (dữ liệu chưa tải) → rỗng, không ném lỗi', () => {
    expect(englishNext({ ...base, levels: [] })).toEqual({})
  })

  // ── [S06-3] `levelId` — cấp "đang đi tới" mà Trang chủ và trang môn dùng cho luồng quay lại.
  it('levelId là cấp MỞ đầu tiên còn bước chưa xong, không phải cấp đầu danh sách', () => {
    const lockedMap = new Map<CefrLevel['id'], boolean>([['A1', true]])
    expect(englishNext({ ...base, levels: [levelA1, levelA2], lockedMap }).levelId).toBe('A2')
  })

  it('xong hết → không levelId (luồng quay lại tắt, y như bản chép cũ)', () => {
    const learned = new Set(circleById.c1.words.map((w) => w.word))
    expect(englishNext({ ...base, learned, doneGrammar: new Set(['g1']) }).levelId).toBeUndefined()
  })

  // Bất biến giữ nguyên hành vi cũ: `levelId` được chốt ở cấp ĐẦU TIÊN mà `findNextStep` trả về
  // một bước, đúng như vòng lặp `continueLevel` từng nằm trong `Home.tsx`/`EnglishHome.tsx` —
  // kể cả khi cấp đó không dựng nổi mục `next`. Nhờ vậy luồng "Mừng bạn quay lại" không đổi.
  it('levelId chốt ở cấp đầu tiên có bước, không chạy tiếp xuống cấp sau', () => {
    const a1XongHet: CefrLevel = {
      ...levelA1,
      units: [{ ...levelA1.units[0], grammar: [], vocabCircleIds: ['c1'] }],
    }
    const a2 = { ...levelA2, id: 'A2' as CefrLevel['id'] }
    const ket = englishNext({ ...base, levels: [a1XongHet, a2] })
    expect(ket.levelId).toBe('A1')
    expect(ket.next?.href).toBe('/lo-trinh-hoc/a1')
  })

  it('srsDue là tuỳ chọn — trang môn gọi không truyền thì không có mục ôn', () => {
    const khongSrs: Omit<typeof base, 'srsDue'> & { srsDue?: number } = { ...base }
    delete khongSrs.srsDue
    const ket = englishNext(khongSrs)
    expect(ket.review).toBeUndefined()
    expect(ket.next?.title).toBe('🍜 Vòng c1 (0/10)')
  })
})
