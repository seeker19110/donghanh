// lessonsLazy.test.ts — canh chỉ mục nạp lười KHỚP với registry thật.
//
// Chỉ mục là tệp SINH TỰ ĐỘNG. Thêm hay sửa bài học mà quên chạy lại lệnh sinh thì giao diện
// sẽ liệt kê sai (thiếu bài, sai tiêu đề, sai nhánh) mà không cổng nào khác bắt được.
import { describe, expect, it } from 'vitest'
import { MATH_LESSONS } from './lessons.js'
import { CHAPTER_LOADERS, LESSON_INDEX } from './lessonsLazy.js'

const NHAC =
  'Chỉ mục lệch với nội dung thật — chạy `npm run gen:stem-lesson-index` rồi commit lại lessonsLazy.ts'

describe('chỉ mục nạp lười môn Toán', () => {
  it('có đúng số bài như registry', () => {
    expect(LESSON_INDEX.length, NHAC).toBe(MATH_LESSONS.length)
  })

  it('mọi bài trong registry đều có mặt và khớp tiêu đề, chương, nhánh', () => {
    const byId = new Map(LESSON_INDEX.map((s) => [s.id, s]))
    for (const lesson of MATH_LESSONS) {
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

  it('MỌI tệp chương nạp được và chứa đúng những bài chỉ mục nói nó chứa', async () => {
    // Nạp hết chứ không chỉ chương đầu: một tệp chương lỗi cú pháp hay đổi tên hằng xuất ra
    // sẽ làm người học mở bài lên thấy trang trắng, mà chỉ ca này bắt được.
    for (const [chapterKey, nap] of Object.entries(CHAPTER_LOADERS)) {
      const lessons = await nap()
      const idTrongTep = new Set(lessons.map((l) => l.id))
      const idTheoChiMuc = LESSON_INDEX.filter((s) => s.chapterKey === chapterKey).map((s) => s.id)
      expect(
        idTheoChiMuc.length,
        `${NHAC} (chương ${chapterKey} không có bài nào)`,
      ).toBeGreaterThan(0)
      for (const id of idTheoChiMuc) {
        expect(idTrongTep.has(id), `${NHAC} (chương ${chapterKey} thiếu bài ${id})`).toBe(true)
      }
    }
  })
})
