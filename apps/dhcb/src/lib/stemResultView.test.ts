// Cổng của hàm chuyển kết quả nộp → màn kết quả (S11-3, AC-14).
//
// Hàm thuần nên test thẳng, không dựng trang: điều đáng canh là BẢNG ÁNH XẠ năm nhánh, và
// riêng bất biến "chỉ server mới phong `passed`/`failed`".
import { describe, it, expect } from 'vitest'
import { ketQuaSangManHinh } from './stemResultView'

describe('ketQuaSangManHinh', () => {
  const BAI = {
    id: 'ly10-c2-b10',
    checkQuestions: [
      {
        prompt: 'Chọn đáp án đúng',
        explain: 'Vì g ≈ 9,8 m/s².',
        answer: { kind: 'choice', correctIds: ['a'] },
        choices: [
          { id: 'a', label: '9,8 m/s²' },
          { id: 'b', label: '10 km/h' },
        ],
      },
      {
        prompt: 'Vận tốc đầu?',
        explain: 'Rơi tự do có v0 = 0.',
        answer: { kind: 'numeric', value: 0 },
      },
    ],
  } as unknown as Parameters<typeof ketQuaSangManHinh>[1]

  const EVIDENCE = {
    schemaVersion: 1 as const,
    subjectId: 'physics' as const,
    contentId: 'ly10-c2-b10',
    activityKind: 'stem_lesson_check' as const,
    attemptId: 'attempt-0123456789abcd',
    clientAt: '2026-09-16T00:00:00.000Z',
    ownerId: 'u-42',
    evidenceKind: 'server_graded' as const,
    correct: 1,
    total: 2,
    ratio: 0.5,
    passed: false,
    items: [
      { questionIndex: 0, correct: true, reason: 'CORRECT' },
      { questionIndex: 1, correct: false, reason: 'WRONG_VALUE' },
    ],
  }

  it('server ĐẠT/CHƯA ĐẠT là hai trạng thái riêng, và chỉ chúng mới đến từ server', () => {
    expect(
      ketQuaSangManHinh({ kind: 'server', evidence: { ...EVIDENCE, passed: true } }, BAI, {})
        .status,
    ).toBe('passed')
    expect(ketQuaSangManHinh({ kind: 'server', evidence: EVIDENCE }, BAI, {}).status).toBe('failed')
  })

  it('bản chấm ở máy và bản chờ gửi mang trạng thái riêng, kèm phán quyết cục bộ', () => {
    const local = ketQuaSangManHinh({ kind: 'local', evidence: EVIDENCE }, BAI, {})
    expect(local.status).toBe('local')
    expect(local.passed).toBe(false)

    const cho = ketQuaSangManHinh(
      { kind: 'queued', evidence: { ...EVIDENCE, passed: true }, reason: 'auth' },
      BAI,
      {},
    )
    expect(cho.status).toBe('pending')
    expect(cho.pendingReason).toBe('auth')
    expect(cho.passed).toBe(true)
  })

  it('bị từ chối: không bịa điểm, chỉ mang lời từ chối', () => {
    const r = ketQuaSangManHinh({ kind: 'rejected', error: 'CONTENT_NOT_FOUND' }, BAI, {})
    expect(r).toEqual({
      status: 'error',
      errorMessage: 'CONTENT_NOT_FOUND',
      correct: 0,
      total: 0,
      items: [],
    })
  })

  it('trắc nghiệm hiện NHÃN lựa chọn, không hiện id — người học nhớ chữ, không nhớ mã', () => {
    const r = ketQuaSangManHinh({ kind: 'server', evidence: EVIDENCE }, BAI, { '0': 'a', '1': '5' })
    expect(r.items[0]?.yourAnswer).toBe('9,8 m/s²')
    expect(r.items[1]?.yourAnswer).toBe('5')
    expect(r.items[1]?.reason).toBe('WRONG_VALUE')
    expect(r.items[1]?.explain).toBe('Rơi tự do có v0 = 0.')
  })

  it('ghép theo questionIndex chứ không theo thứ tự mảng (server trả thiếu thì không lệch hàng)', () => {
    const r = ketQuaSangManHinh(
      {
        kind: 'server',
        evidence: { ...EVIDENCE, items: [{ questionIndex: 1, correct: true, reason: 'CORRECT' }] },
      },
      BAI,
      { '0': 'a', '1': '0' },
    )
    expect(r.items[0]?.correct).toBe(false) // không có bản ghi → không dám gọi là đúng
    expect(r.items[1]?.correct).toBe(true)
  })

  it('server không trả chi tiết câu nào (bản ghi cũ) thì không dựng bảng rỗng', () => {
    const r = ketQuaSangManHinh({ kind: 'server', evidence: { ...EVIDENCE, items: [] } }, BAI, {})
    expect(r.items).toEqual([])
  })
})
