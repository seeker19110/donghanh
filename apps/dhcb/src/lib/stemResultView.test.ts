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
    // [S09a §2.4] Không có bản ghi → KHÔNG dám gọi là đúng, và cũng KHÔNG được gọi là sai:
    // đó là "chưa có kết quả câu này" (`null`). Trước S09a ca này trả `false` — tức biến dữ
    // liệu thiếu thành lỗi kiến thức của người học.
    expect(r.items[0]?.correct).toBeNull()
    expect(r.items[1]?.correct).toBe(true)
  })

  it('server không trả chi tiết câu nào (bản ghi cũ) thì không dựng bảng rỗng', () => {
    const r = ketQuaSangManHinh({ kind: 'server', evidence: { ...EVIDENCE, items: [] } }, BAI, {})
    expect(r.items).toEqual([])
  })

  // ——— [S09a] Contract kết quả §2.4 (docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md) ———

  const BA_CAU = {
    id: 'ly10-c2-b10',
    checkQuestions: [
      { prompt: 'Câu một', explain: 'Giải một', answer: { kind: 'numeric', value: 1 } },
      { prompt: 'Câu hai', explain: 'Giải hai', answer: { kind: 'numeric', value: 2 } },
      { prompt: 'Câu ba', explain: 'Giải ba', answer: { kind: 'numeric', value: 3 } },
    ],
  } as unknown as Parameters<typeof ketQuaSangManHinh>[1]

  function server(items: { questionIndex: number; correct: boolean; reason: string }[]) {
    return {
      kind: 'server' as const,
      evidence: { ...EVIDENCE, correct: 7, total: 9, passed: true, items },
    }
  }

  it('mỗi hàng mang questionIndex GỐC và định danh ổn định theo bài', () => {
    const r = ketQuaSangManHinh(
      server([
        { questionIndex: 2, correct: false, reason: 'WRONG_VALUE' },
        { questionIndex: 0, correct: true, reason: 'CORRECT' },
        { questionIndex: 1, correct: true, reason: 'CORRECT' },
      ]),
      BA_CAU,
      {},
    )
    expect(r.items.map((it) => it.questionIndex)).toEqual([0, 1, 2])
    expect(r.items.map((it) => it.id)).toEqual([
      'ly10-c2-b10#cau-1',
      'ly10-c2-b10#cau-2',
      'ly10-c2-b10#cau-3',
    ])
    // AC04: câu 3 sai / câu 1 đúng — không được đảo nhãn thành "câu 1 sai".
    expect(r.items[0]?.correct).toBe(true)
    expect(r.items[2]?.correct).toBe(false)
  })

  it('câu thiếu là CHƯA CÓ KẾT QUẢ: không lý do, không lời giải suy diễn', () => {
    const r = ketQuaSangManHinh(
      server([
        { questionIndex: 0, correct: true, reason: 'CORRECT' },
        { questionIndex: 2, correct: false, reason: 'WRONG_VALUE' },
      ]),
      BA_CAU,
      { '1': '2' },
    )
    expect(r.items[1]?.correct).toBeNull()
    expect(r.items[1]).not.toHaveProperty('reason')
    expect(r.items[1]).not.toHaveProperty('explain')
    // Câu trả lời của người học vẫn hiện — thiếu là thiếu KẾT QUẢ, không phải thiếu bài làm.
    expect(r.items[1]?.yourAnswer).toBe('2')
  })

  it('index lạ (ngoài bài, âm, lẻ) không bị ghép nhầm vào câu nào', () => {
    const r = ketQuaSangManHinh(
      server([
        { questionIndex: 7, correct: true, reason: 'CORRECT' },
        { questionIndex: -1, correct: true, reason: 'CORRECT' },
        { questionIndex: 1.5, correct: true, reason: 'CORRECT' },
        { questionIndex: 0, correct: false, reason: 'WRONG_VALUE' },
      ]),
      BA_CAU,
      {},
    )
    expect(r.items.map((it) => it.correct)).toEqual([false, null, null])
    expect(r.items).toHaveLength(3)
  })

  it('không tính lại tổng của nguồn evidence và không sửa mảng/đối tượng đầu vào', () => {
    const items = Object.freeze([
      Object.freeze({ questionIndex: 0, correct: false, reason: 'WRONG_VALUE' }),
    ])
    const answers = Object.freeze({ '0': '5' })
    const kq = server(
      items as unknown as { questionIndex: number; correct: boolean; reason: string }[],
    )
    const truoc = JSON.stringify(kq)
    const r = ketQuaSangManHinh(kq, BA_CAU, answers)
    // Server nói 7/9 và ĐẠT dù chỉ trả một dòng sai — màn hình phải giữ đúng lời server.
    expect(r.correct).toBe(7)
    expect(r.total).toBe(9)
    expect(r.status).toBe('passed')
    expect(JSON.stringify(kq)).toBe(truoc)
  })

  it('tất cả đúng / tất cả sai giữ đúng thứ tự gốc (sắp xếp là việc của màn hình)', () => {
    const dung = ketQuaSangManHinh(
      server([0, 1, 2].map((i) => ({ questionIndex: i, correct: true, reason: 'CORRECT' }))),
      BA_CAU,
      {},
    )
    expect(dung.items.map((it) => [it.questionIndex, it.correct])).toEqual([
      [0, true],
      [1, true],
      [2, true],
    ])
    const sai = ketQuaSangManHinh(
      server([2, 1, 0].map((i) => ({ questionIndex: i, correct: false, reason: 'WRONG_VALUE' }))),
      BA_CAU,
      {},
    )
    expect(sai.items.map((it) => [it.questionIndex, it.correct, it.explain])).toEqual([
      [0, false, 'Giải một'],
      [1, false, 'Giải hai'],
      [2, false, 'Giải ba'],
    ])
  })
})
