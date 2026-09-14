// lessons.test.ts — Kiểm tra toàn bộ bài học Sinh học (chạy qua Zod schema validation).
import { describe, it, expect } from 'vitest'
import { BIOLOGY_LESSONS, getBiologyLesson, listBiologyLessonsByGrade } from './lessons.js'
import { BiologyLessonSchema, BIOLOGY_GRADES } from './lessonTypes.js'
import { moTaLoiTuCham, timLoiTuCham } from '@dhcb/core-grading/selfGrade'

describe('BIOLOGY_LESSONS registry', () => {
  it('có bài học từ tất cả 3 lớp', () => {
    for (const grade of BIOLOGY_GRADES) {
      const count = BIOLOGY_LESSONS.filter((l) => l.grade === grade).length
      expect(count, `Lớp ${grade} phải có ít nhất 1 bài`).toBeGreaterThan(0)
    }
  })

  it('tổng số bài học đủ số lượng tối thiểu', () => {
    // Sinh 10: 26 bài, Sinh 11: 26 bài, Sinh 12: 30 bài => ≥ 80
    expect(BIOLOGY_LESSONS.length).toBeGreaterThanOrEqual(80)
  })

  it('mọi id bài học là duy nhất', () => {
    const ids = BIOLOGY_LESSONS.map((l) => l.id)
    const uniqueIds = new Set(ids)
    expect(ids.length).toBe(uniqueIds.size)
  })

  it('mọi bài học đều pass Zod schema', () => {
    for (const lesson of BIOLOGY_LESSONS) {
      const result = BiologyLessonSchema.safeParse(lesson)
      if (!result.success) {
        console.error(`Lỗi bài ${lesson.id}:`, JSON.stringify(result.error.issues, null, 2))
      }
      expect(result.success, `Bài ${lesson.id} không hợp lệ`).toBe(true)
    }
  })

  it('id khớp đúng pattern sinh<lớp>-c<chương>-b<số bài>', () => {
    for (const lesson of BIOLOGY_LESSONS) {
      const expected = `sinh${lesson.grade}-c${lesson.chapterNumber}-b${lesson.lessonNumber}`
      expect(lesson.id, `Bài "${lesson.title}" có id sai`).toBe(expected)
    }
  })

  it('getBiologyLesson trả về đúng bài khi tìm theo id', () => {
    const sample = BIOLOGY_LESSONS[0]!
    const found = getBiologyLesson(sample.id)
    expect(found).toBeDefined()
    expect(found?.title).toBe(sample.title)
  })

  it('listBiologyLessonsByGrade trả về đúng bài theo lớp và sắp xếp đúng thứ tự', () => {
    for (const grade of BIOLOGY_GRADES) {
      const lessons = listBiologyLessonsByGrade(grade)
      expect(lessons.every((l) => l.grade === grade)).toBe(true)
      // Kiểm tra sắp xếp: chapterNumber tăng dần, trong cùng chapter lessonNumber tăng dần
      for (let i = 1; i < lessons.length; i++) {
        const prev = lessons[i - 1]!
        const curr = lessons[i]!
        const ok =
          curr.chapterNumber > prev.chapterNumber ||
          (curr.chapterNumber === prev.chapterNumber && curr.lessonNumber > prev.lessonNumber)
        expect(ok, `Thứ tự sắp xếp sai tại lớp ${grade}: ${prev.id} → ${curr.id}`).toBe(true)
      }
    }
  })

  it('mọi bài đánh dấu reviewStatus (không âm thầm coi là đã duyệt)', () => {
    // Ba môn kia đã có ca này từ #893; môn Sinh thiếu. Trường reviewStatus là chỗ DUY NHẤT
    // ghi nhận "nội dung này chưa ai có chuyên môn đọc" — mất nó thì bài nháp lẫn vào bài đã
    // duyệt mà không cổng nào kêu. Xem TRAPS.md mục 4.
    for (const lesson of BIOLOGY_LESSONS) {
      expect(['draft', 'reviewed']).toContain(lesson.reviewStatus)
    }
  })

  it('mọi checkQuestion tự chấm ĐÚNG với chính đáp án đã khai — dùng engine chấm thật, không AI', () => {
    // Ba môn STEM kia có cổng này từ đầu, môn Sinh thì KHÔNG — dù đặc tả
    // `docs/specs/2026-09-13-hoan-thien-4-mon-stem.md` mục 3.1 lấy chính nó làm biện pháp thay
    // cho khâu duyệt của người. Bổ sung 2026-09-14 sau audit tính chính xác.
    const loi = timLoiTuCham(BIOLOGY_LESSONS)
    expect(loi.length, `Đáp án đã khai KHÔNG tự chấm đúng:\n${moTaLoiTuCham(loi)}`).toBe(0)
  })

  it('mỗi bài có ít nhất 2 checkQuestions và 2 srsCards', () => {
    for (const lesson of BIOLOGY_LESSONS) {
      expect(
        lesson.checkQuestions.length,
        `${lesson.id}: thiếu checkQuestions`,
      ).toBeGreaterThanOrEqual(2)
      expect(lesson.srsCards.length, `${lesson.id}: thiếu srsCards`).toBeGreaterThanOrEqual(2)
    }
  })

  it('không bài nào in ra chữ "\\n" thay vì xuống dòng thật', () => {
    // Đã dính thật 2026-09-13: 1173 chỗ viết '\\n' (hai gạch chéo) trong chuỗi, nên học sinh
    // nhìn thấy ký tự \n lẫn giữa nội dung và cả đoạn theory dồn thành một dòng. Kiểu vẫn
    // đúng, schema vẫn qua — chỉ ca test này bắt được.
    const chuoiSai = String.fromCharCode(92) + 'n'
    for (const lesson of BIOLOGY_LESSONS) {
      expect(
        JSON.stringify(lesson).includes(String.fromCharCode(92, 92) + 'n'),
        `Bài ${lesson.id} còn chứa chuỗi "${chuoiSai}" — phải là ký tự xuống dòng thật`,
      ).toBe(false)
    }
  })
  it('không hai bài nào trùng tiêu đề nguyên văn', () => {
    // Audit 2026-09-14 (F8): 6 bài Hoá trùng tiêu đề y hệt giữa lớp 11 và 12 ("Ôn tập chương 1"…),
    // nên trong danh sách / kết quả tìm kiếm / slug URL chúng trông là một.
    const theoTieuDe = new Map<string, string[]>()
    for (const l of BIOLOGY_LESSONS) {
      const ds = theoTieuDe.get(l.title) ?? []
      ds.push(l.id)
      theoTieuDe.set(l.title, ds)
    }
    const trung = [...theoTieuDe.entries()].filter(([, ids]) => ids.length > 1)
    expect(
      trung.map(([t, ids]) => `"${t}" dùng cho ${ids.join(', ')}`),
      'tiêu đề phải phân biệt được bài này với bài kia',
    ).toEqual([])
  })
  it('không lời giải nào cụt dưới 40 ký tự', () => {
    // Audit 2026-09-14 (F9): 19 câu Lí + 1 câu Hoá có `explain` dưới 40 ký tự — đủ chỗ cho phép
    // thế số, không đủ chỗ nói VÌ SAO dùng công thức đó. Với môn mà học sinh sai vì hiểu nhầm
    // khái niệm, một dòng cụt là mất luôn giá trị sư phạm của câu hỏi. Schema chỉ ép min(1).
    // Ngưỡng 40 = đúng ngưỡng lượt audit đã đo và đã sửa hết. Đo lại 2026-09-14 ở ngưỡng 60 thì
    // còn 25 câu Lí + 5 câu Hoá nữa ở dải 41-59 — chưa sửa, chờ người dùng quyết (nợ đã ghi ở
    // PROGRESS.md). Nâng ngưỡng lên 60 chỉ khi đã viết lại nốt dải đó.
    const cut = BIOLOGY_LESSONS.flatMap((l) =>
      l.checkQuestions
        .map((q, i) => ({ q, i }))
        .filter(({ q }) => q.explain.trim().length < 40)
        .map(({ q, i }) => `${l.id}#q${i + 1} (${q.explain.trim().length} ký tự)`),
    )
    expect(cut, 'lời giải phải nói được vì sao, không chỉ thế số').toEqual([])
  })
})
