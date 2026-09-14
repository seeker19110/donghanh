// lessons.test.ts — Gác chất lượng nội dung bài học Hoá: mọi bài phải qua ChemLessonSchema,
// mọi câu hỏi checkQuestions phải CHẤM ĐÚNG THẬT bằng packages/core-grading khi trả lời đúng
// đáp án đã khai (bảo đảm dữ liệu bài học không tự mâu thuẫn với chính engine chấm sẽ dùng nó).
import { describe, expect, it } from 'vitest'
import { moTaLoiTuCham, timLoiTuCham } from '@dhcb/core-grading/selfGrade'
import { CHEM_LESSONS, getChemLesson, listChemLessonsByGrade } from './lessons.js'
import { ChemLessonSchema } from './lessonTypes.js'

describe('chemistry lessons', () => {
  it('mọi bài đúng khuôn ChemLessonSchema (Zod)', () => {
    for (const lesson of CHEM_LESSONS) {
      const r = ChemLessonSchema.safeParse(lesson)
      expect(r.success, `Bài ${lesson.id} sai khuôn: ${r.success ? '' : r.error.message}`).toBe(
        true,
      )
    }
  })

  it('id duy nhất trong toàn bộ registry', () => {
    const seen = new Set<string>()
    for (const lesson of CHEM_LESSONS) {
      expect(seen.has(lesson.id), `id trùng lặp: ${lesson.id}`).toBe(false)
      seen.add(lesson.id)
    }
  })

  it('mọi bài đánh dấu reviewStatus (không âm thầm coi là đã duyệt)', () => {
    for (const lesson of CHEM_LESSONS) {
      expect(['draft', 'reviewed']).toContain(lesson.reviewStatus)
    }
  })

  it('mọi checkQuestion tự chấm ĐÚNG với chính đáp án đã khai — dùng engine chấm thật, không AI', () => {
    // Cổng dùng chung ở `@dhcb/core-grading/selfGrade`: nạp vào engine ĐÚNG chuỗi tác giả đã
    // viết (`<value> <unit>`), KHÔNG tự đổi đơn vị. Bản cũ ở đây tự tính
    // `(value - offset) / factor` nên giả định sẵn điều cần kiểm và không thể đỏ — xem
    // `docs/audit/2026-09-14-tinh-chinh-xac-cong-thuc-va-ket-qua.md`.
    const loi = timLoiTuCham(CHEM_LESSONS)
    expect(loi.length, `Đáp án đã khai KHÔNG tự chấm đúng:\n${moTaLoiTuCham(loi)}`).toBe(0)
  })

  it('getChemLesson tra được đúng bài theo id', () => {
    const lesson = getChemLesson('hoa10-c1-b1')
    expect(lesson?.title).toBe('Nhập môn Hoá học')
  })

  it('listChemLessonsByGrade trả đúng thứ tự chương/bài', () => {
    const lessons10 = listChemLessonsByGrade('10')
    expect(lessons10.length).toBeGreaterThan(0)
    for (let i = 1; i < lessons10.length; i++) {
      const prev = lessons10[i - 1]!
      const cur = lessons10[i]!
      const prevKey = prev.chapterNumber * 1000 + prev.lessonNumber
      const curKey = cur.chapterNumber * 1000 + cur.lessonNumber
      expect(curKey).toBeGreaterThanOrEqual(prevKey)
    }
  })
  it('không hai bài nào trùng tiêu đề nguyên văn', () => {
    // Audit 2026-09-14 (F8): 6 bài Hoá trùng tiêu đề y hệt giữa lớp 11 và 12 ("Ôn tập chương 1"…),
    // nên trong danh sách / kết quả tìm kiếm / slug URL chúng trông là một.
    const theoTieuDe = new Map<string, string[]>()
    for (const l of CHEM_LESSONS) {
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
    const cut = CHEM_LESSONS.flatMap((l) =>
      l.checkQuestions
        .map((q, i) => ({ q, i }))
        .filter(({ q }) => q.explain.trim().length < 40)
        .map(({ q, i }) => `${l.id}#q${i + 1} (${q.explain.trim().length} ký tự)`),
    )
    expect(cut, 'lời giải phải nói được vì sao, không chỉ thế số').toEqual([])
  })
})
