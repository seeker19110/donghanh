// Cổng cho cơ chế nạp lười dùng chung của bốn môn STEM.
//
// Bốn môn chia nhau đúng một bản cài đặt này, nên một lỗi ở đây hỏng cả bốn cùng lúc —
// đáng test kỹ hơn mức bình thường, nhất là phần cache (nơi lỗi im lặng nhất).
import { describe, expect, it, vi } from 'vitest'
import type { StemLessonLike, StemLessonSummary } from '@dhcb/core-contracts/stemLesson'
import { createStemLessonLoader } from './stemLessonLoader.js'

function bai(id: string, phan: Partial<StemLessonLike> = {}): StemLessonLike {
  return {
    id,
    grade: '10',
    chapterNumber: 1,
    chapterTitle: 'Chương thử',
    lessonNumber: 1,
    title: `Bài ${id}`,
    hook: 'mở đầu',
    theory: 'lý thuyết',
    workedExample: { problem: 'đề', steps: ['bước'], answer: 'đáp' },
    checkQuestions: [],
    srsCards: [],
    track: 'core',
    reviewStatus: 'draft',
    ...phan,
  }
}

function tomTat(
  id: string,
  chapterKey: string,
  phan: Partial<StemLessonSummary> = {},
): StemLessonSummary {
  return {
    id,
    grade: '10',
    chapterNumber: 1,
    chapterTitle: 'Chương thử',
    lessonNumber: 1,
    title: `Bài ${id}`,
    track: 'core',
    hasAnimation: false,
    reviewStatus: 'draft',
    chapterKey,
    ...phan,
  }
}

describe('createStemLessonLoader', () => {
  it('tra được tóm tắt theo id, id lạ thì trả undefined', () => {
    const loader = createStemLessonLoader([tomTat('a', 'c1')], {
      c1: () => Promise.resolve([bai('a')]),
    })
    expect(loader.getSummary('a')?.title).toBe('Bài a')
    expect(loader.getSummary('khong-co')).toBeUndefined()
  })

  it('listCoreByGrade lọc đúng lớp, bỏ bài nâng cao, và sắp theo chương rồi bài', () => {
    const loader = createStemLessonLoader(
      [
        tomTat('x', 'c1', { chapterNumber: 2, lessonNumber: 1 }),
        tomTat('y', 'c1', { chapterNumber: 1, lessonNumber: 5 }),
        tomTat('z', 'c1', { chapterNumber: 1, lessonNumber: 2 }),
        tomTat('lop11', 'c1', { grade: '11' }),
        tomTat('nc', 'c1', { track: 'advanced', advancedTier: 'hsg-tinh' }),
      ],
      {},
    )
    expect(loader.listCoreByGrade('10').map((s) => s.id)).toEqual(['z', 'y', 'x'])
  })

  it('listAdvanced sắp theo cấp tăng dần trường → tỉnh → quốc gia', () => {
    const loader = createStemLessonLoader(
      [
        tomTat('qg', 'c1', { track: 'advanced', advancedTier: 'hsg-quoc-gia' }),
        tomTat('tr', 'c1', { track: 'advanced', advancedTier: 'hsg-truong' }),
        tomTat('t', 'c1', { track: 'advanced', advancedTier: 'hsg-tinh' }),
        tomTat('thuong', 'c1'),
      ],
      {},
    )
    expect(loader.listAdvanced().map((s) => s.id)).toEqual(['tr', 't', 'qg'])
  })

  it('loadLesson nạp đúng bài trong tệp chương của nó', async () => {
    const loader = createStemLessonLoader([tomTat('a', 'c1'), tomTat('b', 'c2')], {
      c1: () => Promise.resolve([bai('a')]),
      c2: () => Promise.resolve([bai('b')]),
    })
    expect((await loader.loadLesson('b'))?.id).toBe('b')
  })

  it('bài không có trong chỉ mục trả undefined, KHÔNG ném lỗi', async () => {
    const loader = createStemLessonLoader([], {})
    await expect(loader.loadLesson('khong-co')).resolves.toBeUndefined()
  })

  it('chỉ mục trỏ tới chương không có hàm nạp thì trả undefined, không ném', async () => {
    const loader = createStemLessonLoader([tomTat('a', 'chuong-bien-mat')], {})
    await expect(loader.loadLesson('a')).resolves.toBeUndefined()
  })

  it('nạp hai bài cùng một chương chỉ tải tệp chương MỘT lần', async () => {
    const nap = vi.fn(() => Promise.resolve([bai('a'), bai('b')]))
    const loader = createStemLessonLoader([tomTat('a', 'c1'), tomTat('b', 'c1')], { c1: nap })
    await Promise.all([loader.loadLesson('a'), loader.loadLesson('b')])
    await loader.loadLesson('a')
    expect(nap).toHaveBeenCalledTimes(1)
  })

  it('nạp lỗi thì lần sau THỬ LẠI được — cache không giữ lại thất bại', async () => {
    let lan = 0
    const nap = vi.fn(() => {
      lan += 1
      return lan === 1 ? Promise.reject(new Error('mất mạng')) : Promise.resolve([bai('a')])
    })
    const loader = createStemLessonLoader([tomTat('a', 'c1')], { c1: nap })

    await expect(loader.loadLesson('a')).rejects.toThrow('mất mạng')
    expect((await loader.loadLesson('a'))?.id).toBe('a')
    expect(nap).toHaveBeenCalledTimes(2)
  })
})
