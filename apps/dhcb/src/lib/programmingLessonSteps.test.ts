// Cổng cho bản đồ URL ↔ bước của bài Lập trình (S09d).
// Đặc tả: docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md §2.8 (B3).
import { describe, it, expect } from 'vitest'
import {
  LESSON_STEP_KEYS,
  anchorOfStep,
  clampStepIndex,
  parseLessonHash,
  readEntryStep,
  resolveLessonTarget,
  stepIndexOfAnchor,
  withEntryStep,
} from './programmingLessonSteps'

describe('bảng sáu bước + hai đích phụ (§2.8)', () => {
  it('sáu khoá bước đúng thứ tự stepIndex 0–5', () => {
    expect(LESSON_STEP_KEYS).toEqual(['concept', 'example', 'predict', 'parsons', 'make', 'done'])
    LESSON_STEP_KEYS.forEach((k, i) => expect(stepIndexOfAnchor(k)).toBe(i))
  })

  it('#dau-bai thuộc bước 0, #ket-qua là đích CON của Make (bước 4), không phải bước thứ bảy', () => {
    expect(stepIndexOfAnchor('dau-bai')).toBe(0)
    expect(stepIndexOfAnchor('ket-qua')).toBe(4)
    expect(LESSON_STEP_KEYS).toHaveLength(6)
  })

  it('anchorOfStep ngược lại, bước ngoài phạm vi về concept', () => {
    expect(anchorOfStep(2)).toBe('predict')
    expect(anchorOfStep(5)).toBe('done')
    expect(anchorOfStep(99)).toBe('concept')
    expect(anchorOfStep(-1)).toBe('concept')
  })
})

describe('clampStepIndex — bước lưu ngoài [0,5] không được chạm STEPS ngoài phạm vi', () => {
  it.each([
    [0, 0],
    [4, 4],
    [5, 5],
    [6, 0],
    [99, 0],
    [-1, 0],
    [2.5, 0],
    [Number.NaN, 0],
    ['3', 0],
    [undefined, 0],
    [null, 0],
  ])('%p → %p', (input, expected) => {
    expect(clampStepIndex(input)).toBe(expected)
  })
})

describe('parseLessonHash', () => {
  it('rỗng hoặc chỉ "#" = không có hash', () => {
    expect(parseLessonHash('')).toEqual({ kind: 'none' })
    expect(parseLessonHash('#')).toEqual({ kind: 'none' })
  })

  it('tám đích hợp lệ', () => {
    for (const a of [...LESSON_STEP_KEYS, 'dau-bai', 'ket-qua'] as const) {
      expect(parseLessonHash(`#${a}`)).toEqual({ kind: 'valid', anchor: a })
    }
  })

  it.each([
    '#khong-co',
    '#Make',
    '#make ',
    '#make?x=1',
    '#make#done',
    '#cau-1',
    '#__proto__',
    '#constructor',
    '#toString',
    '#%6Dake',
    '#<img src=x>',
    'make',
    '#' + 'a'.repeat(5000),
  ])('hash lạ/sai cú pháp %s → invalid (không dùng làm selector)', (hash) => {
    expect(parseLessonHash(hash)).toEqual({ kind: 'invalid' })
  })
})

describe('resolveLessonTarget — precedence URL ↔ resume ↔ history', () => {
  it('S09-P-AC02: hash hợp lệ THẮNG bước resume (resume Make + #predict → Predict)', () => {
    expect(resolveLessonTarget({ hash: '#predict', navigation: 'open', resumeStep: 4 })).toEqual({
      stepIndex: 2,
      focus: 'predict',
    })
  })

  it('#ket-qua mở bước Make và focus heading kết quả', () => {
    expect(resolveLessonTarget({ hash: '#ket-qua', navigation: 'open', resumeStep: 0 })).toEqual({
      stepIndex: 4,
      focus: 'ket-qua',
    })
  })

  it('mở bình thường không hash dùng bước resume, không tự focus', () => {
    expect(resolveLessonTarget({ hash: '', navigation: 'open', resumeStep: 3 })).toEqual({
      stepIndex: 3,
      focus: null,
    })
  })

  it('resume ngoài phạm vi (step 99) → 0', () => {
    expect(resolveLessonTarget({ hash: '', navigation: 'open', resumeStep: 99 })).toEqual({
      stepIndex: 0,
      focus: null,
    })
  })

  it('S09-P-AC04: hash lạ → concept + focus đầu bài, bỏ qua resume', () => {
    expect(resolveLessonTarget({ hash: '#khong-co', navigation: 'open', resumeStep: 4 })).toEqual({
      stepIndex: 0,
      focus: 'dau-bai',
    })
  })

  it('Back về entry không hash dùng bước ghi trong entry, focus đầu bài', () => {
    expect(
      resolveLessonTarget({ hash: '', navigation: 'history', resumeStep: 1, entryStep: 4 }),
    ).toEqual({ stepIndex: 4, focus: 'dau-bai' })
  })

  it('Back về entry không hash THIẾU metadata → đầu bài, KHÔNG lấy resume vừa bị đổi', () => {
    expect(resolveLessonTarget({ hash: '', navigation: 'history', resumeStep: 3 })).toEqual({
      stepIndex: 0,
      focus: 'dau-bai',
    })
  })

  it('metadata entry hỏng (ngoài phạm vi) → 0', () => {
    expect(
      resolveLessonTarget({ hash: '', navigation: 'history', resumeStep: 3, entryStep: 42 }),
    ).toEqual({ stepIndex: 0, focus: 'dau-bai' })
  })

  it('Back/Forward tới entry CÓ hash thì hash quyết, không đụng metadata', () => {
    expect(
      resolveLessonTarget({ hash: '#parsons', navigation: 'history', resumeStep: 0, entryStep: 5 }),
    ).toEqual({ stepIndex: 3, focus: 'parsons' })
  })
})

describe('metadata bước trong history state', () => {
  it('ghi rồi đọc lại, giữ các khoá state khác', () => {
    const s = withEntryStep({ from: 'x' }, 4)
    expect(s).toEqual({ from: 'x', lessonStep: 4 })
    expect(readEntryStep(s)).toBe(4)
  })

  it('state không phải object hoặc thiếu/hỏng → undefined', () => {
    expect(readEntryStep(null)).toBeUndefined()
    expect(readEntryStep('abc')).toBeUndefined()
    expect(readEntryStep({})).toBeUndefined()
    expect(readEntryStep({ lessonStep: 'hai' })).toBeUndefined()
    expect(withEntryStep(null, 2)).toEqual({ lessonStep: 2 })
    expect(withEntryStep([1, 2], 2)).toEqual({ lessonStep: 2 })
  })
})
