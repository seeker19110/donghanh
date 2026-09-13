// lessonsLazy.test.ts — canh chỉ mục nạp lười KHỚP với registry thật.
//
// Chỉ mục là tệp SINH TỰ ĐỘNG. Thêm hay sửa bài học mà quên chạy lại lệnh sinh thì giao diện
// sẽ liệt kê sai (thiếu bài, sai tiêu đề, sai nhánh) mà không cổng nào khác bắt được.
import { describe, expect, it } from 'vitest'
import { BIOLOGY_LESSONS } from './lessons.js'
import { CHAPTER_LOADERS, LESSON_INDEX } from './lessonsLazy.js'

const NHAC =
  'Chỉ mục lệch với nội dung thật — chạy `npm run gen:stem-lesson-index` rồi commit lại lessonsLazy.ts'

describe('chỉ mục nạp lười môn Sinh học', () => {
  it('có đúng số bài như registry', () => {
    expect(LESSON_INDEX.length, NHAC).toBe(BIOLOGY_LESSONS.length)
  })

  it('mọi bài trong registry đều có mặt và khớp tiêu đề, chương, nhánh', () => {
    const byId = new Map(LESSON_INDEX.map((s) => [s.id, s]))
    for (const lesson of BIOLOGY_LESSONS) {
      const s = byId.get(lesson.id)
      expect(s, `${NHAC} (thiếu bài ${lesson.id})`).toBeDefined()
      if (!s) continue
      expect(s.title, NHAC).toBe(lesson.title)
      expect(s.chapterNumber, NHAC).toBe(lesson.chapterNumber)
      expect(s.lessonNumber, NHAC).toBe(lesson.lessonNumber)
      expect(s.track, NHAC).toBe(lesson.track)
      expect(s.advancedTier, NHAC).toBe(lesson.advancedTier)
      expect(s.hasAnimation, NHAC).toBe(lesson.animation !== undefined)
    }
  })

  it('mọi chapterKey đều có hàm nạp tương ứng', () => {
    for (const s of LESSON_INDEX) {
      expect(CHAPTER_LOADERS[s.chapterKey], `${NHAC} (thiếu loader ${s.chapterKey})`).toBeTypeOf(
        'function',
      )
    }
  })

  it('nạp lười trả về đúng bài', async () => {
    const first = LESSON_INDEX[0]!
    const lessons = await CHAPTER_LOADERS[first.chapterKey]!()
    expect(lessons.some((l) => l.id === first.id)).toBe(true)
  })
})
