// lessons.test.ts — Gác chất lượng nội dung bài học Vật lí.
import { describe, expect, it } from 'vitest'
import { moTaLoiTuCham, timLoiTuCham } from '@dhcb/core-grading/selfGrade'
import {
  PHYSICS_LESSONS,
  getPhysicsLesson,
  listPhysicsAdvancedLessons,
  listPhysicsCoreLessons,
  listPhysicsLessonsByGrade,
} from './lessons.js'
import { PhysicsLessonSchema } from './lessonTypes.js'

describe('physics lessons', () => {
  it('mọi bài đúng khuôn PhysicsLessonSchema (Zod)', () => {
    for (const lesson of PHYSICS_LESSONS) {
      const r = PhysicsLessonSchema.safeParse(lesson)
      expect(r.success, `Bài ${lesson.id} sai khuôn: ${r.success ? '' : r.error.message}`).toBe(
        true,
      )
    }
  })

  it('id duy nhất trong toàn bộ registry', () => {
    const seen = new Set<string>()
    for (const lesson of PHYSICS_LESSONS) {
      expect(seen.has(lesson.id), `id trùng lặp: ${lesson.id}`).toBe(false)
      seen.add(lesson.id)
    }
  })

  it('mọi bài đánh dấu reviewStatus (không âm thầm coi là đã duyệt)', () => {
    for (const lesson of PHYSICS_LESSONS) {
      expect(['draft', 'reviewed']).toContain(lesson.reviewStatus)
    }
  })

  it('mọi checkQuestion tự chấm ĐÚNG với chính đáp án đã khai — dùng engine chấm thật, không AI', () => {
    // Cổng dùng chung ở `@dhcb/core-grading/selfGrade`: nạp vào engine ĐÚNG chuỗi tác giả đã
    // viết (`<value> <unit>`), KHÔNG tự đổi đơn vị. Bản cũ ở đây tự tính
    // `(value - offset) / factor` nên giả định sẵn điều cần kiểm và không thể đỏ — xem
    // `docs/audit/2026-09-14-tinh-chinh-xac-cong-thuc-va-ket-qua.md`.
    const loi = timLoiTuCham(PHYSICS_LESSONS)
    expect(loi.length, `Đáp án đã khai KHÔNG tự chấm đúng:\n${moTaLoiTuCham(loi)}`).toBe(0)
  })

  it("bài 'advanced' phải có advancedTier; bài 'core' tuyệt đối không được có", () => {
    for (const lesson of PHYSICS_LESSONS) {
      if (lesson.track === 'advanced') {
        expect(lesson.advancedTier, `Bài advanced ${lesson.id} thiếu advancedTier`).toBeDefined()
      } else {
        expect(
          lesson.advancedTier,
          `Bài core ${lesson.id} không được khai advancedTier`,
        ).toBeUndefined()
      }
    }
  })

  it('hoạt ảnh: id hình không trùng, keyframe không vượt durationMs, nhãn chữ không dùng màu đồ hoạ', () => {
    // Ba bất biến này Zod đã canh, nhưng lặp lại ở đây để khi đỏ thì thông báo chỉ đúng bài và
    // đúng hình sai — thay vì một khối lỗi Zod dài không đọc được.
    const mauCamChoChu = new Set(['correct', 'warn', 'danger'])
    for (const lesson of PHYSICS_LESSONS) {
      const anim = lesson.animation
      if (!anim) continue
      const ids = new Set<string>()
      for (const shape of anim.shapes) {
        expect(ids.has(shape.id), `Bài ${lesson.id}: id hình trùng "${shape.id}"`).toBe(false)
        ids.add(shape.id)
        for (const kf of shape.keyframes ?? []) {
          expect(
            kf.atMs,
            `Bài ${lesson.id}, hình "${shape.id}": keyframe ${kf.atMs}ms vượt quá durationMs ${anim.durationMs}ms`,
          ).toBeLessThanOrEqual(anim.durationMs)
        }
        if (shape.kind === 'label') {
          expect(
            mauCamChoChu.has(shape.fill ?? '') || mauCamChoChu.has(shape.stroke ?? ''),
            `Bài ${lesson.id}, nhãn "${shape.id}": chữ không được dùng vai trò màu đồ hoạ (correct/warn/danger)`,
          ).toBe(false)
        }
      }
      for (const caption of anim.captions ?? []) {
        expect(
          caption.atMs,
          `Bài ${lesson.id}: lời dẫn ở ${caption.atMs}ms vượt quá durationMs ${anim.durationMs}ms`,
        ).toBeLessThanOrEqual(anim.durationMs)
      }
    }
  })

  it('mỗi cấp HSG đều có chuyên đề, và chuyên đề nào cũng thuộc nhánh advanced', () => {
    const advanced = listPhysicsAdvancedLessons()
    expect(advanced.length).toBeGreaterThan(0)
    for (const tier of ['hsg-truong', 'hsg-tinh', 'hsg-quoc-gia'] as const) {
      expect(
        advanced.some((l) => l.advancedTier === tier),
        `Chưa có chuyên đề nào ở cấp ${tier}`,
      ).toBe(true)
    }
    expect(listPhysicsCoreLessons().every((l) => l.track === 'core')).toBe(true)
  })

  it('getPhysicsLesson tra được đúng bài theo id', () => {
    const lesson = getPhysicsLesson('ly10-c1-b1')
    expect(lesson?.title).toBe('Làm quen với Vật lí')
  })

  it('listPhysicsLessonsByGrade trả đúng thứ tự chương/bài', () => {
    const lessons10 = listPhysicsLessonsByGrade('10')
    expect(lessons10.length).toBeGreaterThan(0)
    for (let i = 1; i < lessons10.length; i++) {
      const prev = lessons10[i - 1]!
      const cur = lessons10[i]!
      const prevKey = prev.chapterNumber * 1000 + prev.lessonNumber
      const curKey = cur.chapterNumber * 1000 + cur.lessonNumber
      expect(curKey).toBeGreaterThanOrEqual(prevKey)
    }
  })
  it('không bài nào in ra chữ "\\n" thay vì xuống dòng thật', () => {
    // Đã dính thật 2026-09-13: 1052 chỗ viết '\\n' (hai gạch chéo) trong chuỗi, nên học sinh
    // nhìn thấy ký tự \n lẫn giữa nội dung và cả đoạn theory dồn thành một dòng. Kiểu vẫn
    // đúng, schema vẫn qua — chỉ ca test này bắt được.
    for (const lesson of PHYSICS_LESSONS) {
      expect(
        JSON.stringify(lesson).includes(String.fromCharCode(92, 92) + 'n'),
        `Bài ${lesson.id} còn chứa chuỗi gạch-chéo-n — phải là ký tự xuống dòng thật`,
      ).toBe(false)
    }
  })
})
