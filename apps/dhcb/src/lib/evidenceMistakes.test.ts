// evidenceMistakes.test.ts — Sổ lỗi STEM dựng từ bằng chứng (S12-2, AC-10).
//
// Ba thứ test này canh, vì chúng là LỜI HỨA của sản phẩm chứ không phải chi tiết kỹ thuật:
//  · lỗi đã sửa ở lượt sau thì BIẾN MẤT (sổ lỗi là "còn sai gì", không phải nhật ký tội lỗi),
//  · bản ghi hỏng bị BỎ chứ không làm trắng cả trang,
//  · hàm THUẦN: không fetch, không ghi localStorage.
import { describe, it, expect, vi, afterEach } from 'vitest'
import type { CompletionEvidence } from '@dhcb/core-contracts/completionEvidence'
import { mistakesFromEvidence, getDueEvidenceMistakes, hanOnCuaMuc } from './evidenceMistakes'
import { REVIEW_SPACING_MS } from './mistakes'

const BAI = 'ly10-c2-b10'

function luot(
  over: Partial<CompletionEvidence> & { items: CompletionEvidence['items'] },
): CompletionEvidence {
  return {
    schemaVersion: 1,
    subjectId: 'physics',
    contentId: BAI,
    activityKind: 'stem_lesson_check',
    attemptId: 'aaaaaaaabbbbcccc',
    clientAt: '2026-09-10T08:00:00.000Z',
    serverAt: '2026-09-10T08:00:01.000Z',
    ownerId: 'user-1',
    evidenceKind: 'server_graded',
    correct: 0,
    total: 2,
    ratio: 0,
    passed: false,
    ...over,
  }
}

afterEach(() => vi.restoreAllMocks())

describe('mistakesFromEvidence', () => {
  it('không có lượt nộp nào → sổ rỗng', () => {
    expect(mistakesFromEvidence([])).toEqual([])
  })

  it('đúng hết → không có mục nào', () => {
    const e = luot({
      items: [
        { questionIndex: 0, correct: true, reason: 'CORRECT' },
        { questionIndex: 1, correct: true, reason: 'CORRECT' },
      ],
    })
    expect(mistakesFromEvidence([e])).toEqual([])
  })

  it('sai một câu → đúng một mục, mang bằng chứng của lượt đó', () => {
    const ra = mistakesFromEvidence([
      luot({
        items: [
          { questionIndex: 0, correct: true, reason: 'CORRECT' },
          { questionIndex: 1, correct: false, reason: 'WRONG_VALUE' },
        ],
      }),
    ])
    expect(ra).toHaveLength(1)
    expect(ra[0]).toMatchObject({
      entryId: `physics:${BAI}:1`,
      subjectId: 'physics',
      contentId: BAI,
      questionIndex: 1,
      attemptId: 'aaaaaaaabbbbcccc',
      evidenceKind: 'server_graded',
      reason: 'WRONG_VALUE',
      count: 1,
      lastReviewedAt: null,
    })
    // "Ôn lại lỗi này" phải neo tới đúng câu — người đọc thấy "câu 2", dữ liệu là index 1.
    expect(ra[0]!.href).toBe(`/goc-hoc-tap/physics/bai-hoc/${BAI}#cau-2`)
  })

  it('sai cùng câu ở HAI lượt → MỘT mục, count = 2, giữ bằng chứng MỚI nhất', () => {
    const ra = mistakesFromEvidence([
      luot({
        attemptId: 'cu-cu-cu-cu-cu-cu',
        serverAt: '2026-09-10T08:00:00.000Z',
        items: [{ questionIndex: 0, correct: false, reason: 'WRONG_VALUE' }],
      }),
      luot({
        attemptId: 'moi-moi-moi-moi-moi',
        serverAt: '2026-09-12T08:00:00.000Z',
        items: [{ questionIndex: 0, correct: false, reason: 'MISSING_UNIT' }],
      }),
    ])
    expect(ra).toHaveLength(1)
    expect(ra[0]).toMatchObject({
      count: 2,
      attemptId: 'moi-moi-moi-moi-moi',
      reason: 'MISSING_UNIT',
    })
    expect(ra[0]!.lastWrongAt).toBe(Date.parse('2026-09-12T08:00:00.000Z'))
  })

  it('sửa đúng ở lượt SAU → mục bị gỡ khỏi sổ', () => {
    const ra = mistakesFromEvidence([
      luot({
        attemptId: 'sai-sai-sai-sai-sai',
        serverAt: '2026-09-10T08:00:00.000Z',
        items: [{ questionIndex: 0, correct: false, reason: 'WRONG_VALUE' }],
      }),
      luot({
        attemptId: 'dung-dung-dung-dung',
        serverAt: '2026-09-12T08:00:00.000Z',
        items: [{ questionIndex: 0, correct: true, reason: 'CORRECT' }],
      }),
    ])
    expect(ra).toEqual([])
  })

  it('thứ tự đầu vào lộn xộn vẫn cho cùng kết quả (sắp theo mốc thời gian, không theo mảng)', () => {
    const sai = luot({
      attemptId: 'sai-sai-sai-sai-sai',
      serverAt: '2026-09-10T08:00:00.000Z',
      items: [{ questionIndex: 0, correct: false, reason: 'WRONG_VALUE' }],
    })
    const dung = luot({
      attemptId: 'dung-dung-dung-dung',
      serverAt: '2026-09-12T08:00:00.000Z',
      items: [{ questionIndex: 0, correct: true, reason: 'CORRECT' }],
    })
    expect(mistakesFromEvidence([dung, sai])).toEqual([])
  })

  it('bản ghi thiếu field / sai schema bị BỎ, không ném, không nuốt bản còn lại', () => {
    const hong = { subjectId: 'physics' } as unknown as CompletionEvidence
    const ra = mistakesFromEvidence([
      hong,
      luot({ items: [{ questionIndex: 3, correct: false, reason: 'WRONG_VALUE' }] }),
    ])
    expect(ra).toHaveLength(1)
    expect(ra[0]!.questionIndex).toBe(3)
  })

  it('bản local_graded (khách tự chấm) vẫn vào sổ và NÓI RA là chấm trên thiết bị', () => {
    const ra = mistakesFromEvidence([
      luot({
        evidenceKind: 'local_graded',
        serverAt: undefined,
        items: [{ questionIndex: 0, correct: false, reason: 'WRONG_VALUE' }],
      }),
    ])
    expect(ra[0]!.evidenceKind).toBe('local_graded')
    // Không có giờ server thì lấy giờ máy học viên — không được rơi về 0 (mất thứ tự).
    expect(ra[0]!.lastWrongAt).toBe(Date.parse('2026-09-10T08:00:00.000Z'))
  })

  it('hai môn trùng mã bài KHÔNG lẫn vào nhau (entryId mang cả mã môn)', () => {
    const ra = mistakesFromEvidence([
      luot({ items: [{ questionIndex: 0, correct: false, reason: 'a' }] }),
      luot({
        subjectId: 'chemistry',
        items: [{ questionIndex: 0, correct: false, reason: 'b' }],
      }),
    ])
    expect(ra.map((m) => m.entryId).sort()).toEqual([`chemistry:${BAI}:0`, `physics:${BAI}:0`])
  })

  it('sai nhiều lần được xếp TRƯỚC lỗi mới hơn (cùng luật với sổ lỗi môn Anh)', () => {
    const ra = mistakesFromEvidence([
      luot({
        serverAt: '2026-09-10T08:00:00.000Z',
        items: [{ questionIndex: 0, correct: false, reason: 'a' }],
      }),
      luot({
        serverAt: '2026-09-11T08:00:00.000Z',
        items: [{ questionIndex: 0, correct: false, reason: 'a' }],
      }),
      luot({
        serverAt: '2026-09-13T08:00:00.000Z',
        items: [{ questionIndex: 1, correct: false, reason: 'b' }],
      }),
    ])
    expect(ra.map((m) => m.questionIndex)).toEqual([0, 1])
  })

  it('HÀM THUẦN: không fetch, không ghi localStorage', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    mistakesFromEvidence([luot({ items: [{ questionIndex: 0, correct: false, reason: 'a' }] })])
    expect(setItem).not.toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})

describe('giãn cách ôn dùng CHUNG hằng với sổ lỗi môn Anh', () => {
  const muc = mistakesFromEvidence([
    luot({ items: [{ questionIndex: 0, correct: false, reason: 'a' }] }),
  ])

  it('chưa ôn bao giờ → đến hạn ngay, hạn tính từ lúc sai', () => {
    expect(getDueEvidenceMistakes(muc, Date.now())).toHaveLength(1)
    expect(hanOnCuaMuc(muc[0]!)).toBe(muc[0]!.lastWrongAt)
  })

  it('đã ôn trong vòng giãn cách → chưa tới hạn', () => {
    const daOn = [{ ...muc[0]!, lastReviewedAt: 1_000_000 }]
    expect(getDueEvidenceMistakes(daOn, 1_000_000 + REVIEW_SPACING_MS - 1)).toHaveLength(0)
    expect(getDueEvidenceMistakes(daOn, 1_000_000 + REVIEW_SPACING_MS)).toHaveLength(1)
  })
})
