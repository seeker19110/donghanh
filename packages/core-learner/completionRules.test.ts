import { describe, expect, it } from 'vitest'
import {
  CEFR_EXAM_PASS_RATIO,
  PROGRAMMING_STAGE_QUIZ_PASS_RATIO,
  STEM_CHECK_PASS_RATIO,
  decideCompletion,
} from './completionRules.js'

describe('STEM_CHECK_PASS_RATIO', () => {
  it('là 0.8 — hằng số ở ĐÚNG MỘT chỗ, khớp quiz chặng Lập trình', () => {
    expect(STEM_CHECK_PASS_RATIO).toBe(0.8)
    expect(PROGRAMMING_STAGE_QUIZ_PASS_RATIO).toBe(0.8)
    expect(CEFR_EXAM_PASS_RATIO).toBe(0.7)
  })
})

describe('decideCompletion — bài STEM', () => {
  it('4/5 đạt (đúng biên ngưỡng)', () => {
    const d = decideCompletion('stem_lesson_check', { correct: 4, total: 5 })
    expect(d).toEqual({ supported: true, passed: true, ratio: 0.8, threshold: 0.8 })
  })

  it('3/4 = 0.75 → KHÔNG đạt', () => {
    const d = decideCompletion('stem_lesson_check', { correct: 3, total: 4 })
    expect(d).toMatchObject({ supported: true, passed: false, ratio: 0.75 })
  })

  it('1/1 đạt; 0/2 không đạt', () => {
    expect(decideCompletion('stem_lesson_check', { correct: 1, total: 1 })).toMatchObject({
      passed: true,
    })
    expect(decideCompletion('stem_lesson_check', { correct: 0, total: 2 })).toMatchObject({
      passed: false,
      ratio: 0,
    })
  })

  it('2/3 (0.667) → KHÔNG đạt — so bằng số nguyên, không bằng ratio đã làm tròn numeric(4,3)', () => {
    expect(decideCompletion('stem_lesson_check', { correct: 2, total: 3 })).toMatchObject({
      passed: false,
    })
  })

  it('8/10 và 9/10 đạt; 7/10 không đạt', () => {
    expect(decideCompletion('stem_lesson_check', { correct: 8, total: 10 })).toMatchObject({
      passed: true,
    })
    expect(decideCompletion('stem_lesson_check', { correct: 9, total: 10 })).toMatchObject({
      passed: true,
    })
    expect(decideCompletion('stem_lesson_check', { correct: 7, total: 10 })).toMatchObject({
      passed: false,
    })
  })

  it('correct vượt total bị kẹp về total (không có cách nào ratio > 1)', () => {
    const d = decideCompletion('stem_lesson_check', { correct: 99, total: 5 })
    expect(d).toMatchObject({ supported: true, ratio: 1, passed: true })
  })

  it('total = 0 hoặc không hữu hạn → NO_CHECK_QUESTIONS (không có cách đo thì không giả vờ đo)', () => {
    expect(decideCompletion('stem_lesson_check', { correct: 0, total: 0 })).toEqual({
      supported: false,
      reason: 'NO_CHECK_QUESTIONS',
    })
    expect(decideCompletion('stem_lesson_check', { correct: 0, total: Number.NaN })).toEqual({
      supported: false,
      reason: 'NO_CHECK_QUESTIONS',
    })
  })
})

describe('decideCompletion — hoạt động có nguồn evidence riêng', () => {
  it('7 loại còn lại đều UNSUPPORTED_ACTIVITY trong S11', () => {
    for (const kind of [
      'programming_lesson',
      'programming_stage_quiz',
      'programming_project_step',
      'cefr_vocab_circle',
      'cefr_grammar',
      'cefr_dialogue',
      'cefr_level_exam',
    ] as const) {
      expect(decideCompletion(kind, { correct: 10, total: 10 })).toEqual({
        supported: false,
        reason: 'UNSUPPORTED_ACTIVITY',
      })
    }
  })
})
