import { describe, expect, it } from 'vitest'
import { gradeStemEvidence, type StemLessonLike } from './stemEvidenceGrader.js'

const bai: StemLessonLike = {
  checkQuestions: [
    { answer: { kind: 'numeric', value: 10, unit: 'm' } },
    { answer: { kind: 'choice', correctIds: ['b'] } },
    { answer: { kind: 'fraction', num: 1, den: 2 } },
  ],
}

describe('gradeStemEvidence', () => {
  it('chấm đúng từng câu và đếm số câu đúng', () => {
    const kq = gradeStemEvidence(bai, [
      { questionIndex: 0, raw: '10 m' },
      { questionIndex: 1, raw: 'b' },
      { questionIndex: 2, raw: '1/2' },
    ])
    expect(kq.correct).toBe(3)
    expect(kq.total).toBe(3)
    expect(kq.items.every((i) => i.correct)).toBe(true)
  })

  it('câu KHÔNG có trả lời tính là SAI, reason EMPTY — bỏ trống không phải cách đạt ngưỡng', () => {
    const kq = gradeStemEvidence(bai, [{ questionIndex: 0, raw: '10 m' }])
    expect(kq).toMatchObject({ correct: 1, total: 3 })
    expect(kq.items[1]).toEqual({ questionIndex: 1, correct: false, reason: 'EMPTY' })
    expect(kq.items[2]).toEqual({ questionIndex: 2, correct: false, reason: 'EMPTY' })
  })

  it('giữ mã lý do của engine chấm (thiếu đơn vị, sai giá trị)', () => {
    const kq = gradeStemEvidence(bai, [
      { questionIndex: 0, raw: '10' },
      { questionIndex: 1, raw: 'a' },
      { questionIndex: 2, raw: '1/3' },
    ])
    expect(kq.correct).toBe(0)
    expect(kq.items[0]?.reason).toBe('MISSING_UNIT')
    expect(kq.items[1]?.reason).toBe('WRONG_VALUE')
    expect(kq.items[2]?.reason).toBe('WRONG_VALUE')
  })

  it('trả lời trùng questionIndex: lấy bản ĐẦU TIÊN, tất định', () => {
    const kq = gradeStemEvidence(bai, [
      { questionIndex: 1, raw: 'b' },
      { questionIndex: 1, raw: 'a' },
    ])
    expect(kq.items[1]).toMatchObject({ correct: true })
  })

  it('questionIndex vượt số câu của bài bị bỏ qua, không làm phình total', () => {
    const kq = gradeStemEvidence(bai, [{ questionIndex: 9, raw: 'x' }])
    expect(kq).toMatchObject({ correct: 0, total: 3 })
    expect(kq.items).toHaveLength(3)
  })

  it('bài không có câu tự kiểm tra → total 0, items rỗng (server sẽ trả NO_CHECK_QUESTIONS)', () => {
    const kq = gradeStemEvidence({ checkQuestions: [] }, [{ questionIndex: 0, raw: 'x' }])
    expect(kq).toEqual({ correct: 0, total: 0, items: [] })
  })

  it('tất định: chạy 2 lần cùng đầu vào cho cùng kết quả (không AI, không ngẫu nhiên)', () => {
    const answers = [{ questionIndex: 0, raw: '1000 cm' }]
    expect(gradeStemEvidence(bai, answers)).toEqual(gradeStemEvidence(bai, answers))
  })
})
