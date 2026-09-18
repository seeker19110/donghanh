// Cổng cho bảng dựng URL của môn Lập trình.
//
// Bất biến quan trọng nhất sau khi đổi route (2026-08-31): URL mang thêm tiêu đề, nhưng **mã
// vẫn đứng đầu và tách lại được nguyên vẹn**. Mất tính chất đó là link cũ đã chia sẻ chết và
// tiến độ tra theo mã không khớp nữa — hỏng im lặng, không cổng nào khác bắt được.
import { describe, expect, it } from 'vitest'
import { idFromSlugSegment } from '@core/slug'
import { SHORT_COURSES } from '@dhcb/subject-programming/courses/registry'
import { PROGRAMMING_SPECIALIZATIONS } from '@dhcb/subject-programming/specializations/registry'
import { LEARNING_PATHS, pathStageRefs } from '@dhcb/subject-programming/learningPaths/registry'
import { getPathStage } from '@dhcb/subject-programming/learningPaths/pathStages'
import {
  PROGRAMMING_PREFIX,
  duongDanBac,
  duongDanBaiHoc,
  duongDanChangHuong,
  duongDanChangLoTrinh,
  duongDanHuong,
  duongDanKhoa,
  duongDanLoTrinh,
} from './programmingRoutes'
import { duongDanChangTheoId, maKhoaTuQuery } from './programmingRoutesSpec'

/** Đoạn cuối của URL — phần mang `<mã>--<tiêu đề>`. */
const doanCuoi = (url: string) => url.split('/').pop() ?? ''

describe('URL môn Lập trình — mã luôn tách lại được', () => {
  it('mọi URL dùng tiền tố Góc học tập; bậc có đốt bac riêng', () => {
    expect(duongDanBac({ id: 'p1', name: 'Nền tảng' })).toBe(
      `${PROGRAMMING_PREFIX}/bac/p1--nen-tang`,
    )
  })
  it('khoá ngắn: URL giữ nguyên mã khoá ở đầu', () => {
    for (const khoa of SHORT_COURSES) {
      const url = duongDanKhoa(khoa)
      expect(url.startsWith(`${PROGRAMMING_PREFIX}/khoa-hoc/`)).toBe(true)
      expect(idFromSlugSegment(doanCuoi(url))).toBe(khoa.id)
    }
  })

  it('hướng chuyên sâu và từng chặng: URL giữ nguyên mã hướng và mã chặng', () => {
    for (const spec of PROGRAMMING_SPECIALIZATIONS) {
      expect(idFromSlugSegment(doanCuoi(duongDanHuong(spec)))).toBe(spec.id)
      for (const stage of spec.stages) {
        const url = duongDanChangHuong(spec, stage)
        const segments = url.split('/')
        const doanHuong = segments.at(-2)
        const doanChang = segments.at(-1)
        expect(idFromSlugSegment(doanHuong ?? '')).toBe(spec.id)
        expect(idFromSlugSegment(doanChang ?? '')).toBe(stage.id)
        // Tra ngược từ MỘT id chặng (đường mà trang lộ trình dùng) phải ra đúng URL đó.
        expect(duongDanChangTheoId(stage.id)).toBe(url)
      }
    }
  })

  it('lộ trình mục tiêu và chặng riêng của nó: URL giữ nguyên mã', () => {
    for (const path of LEARNING_PATHS) {
      expect(idFromSlugSegment(doanCuoi(duongDanLoTrinh(path)))).toBe(path.id)
      for (const ref of pathStageRefs(path)) {
        const stage = getPathStage(ref.stageId)
        if (!stage) continue // chặng của hướng — đã kiểm ở test trên
        const url = duongDanChangLoTrinh(path, stage)
        expect(idFromSlugSegment(doanCuoi(url))).toBe(stage.id)
      }
    }
  })

  it('không hai trang nào sinh ra cùng một URL', () => {
    const tatCa = [
      ...SHORT_COURSES.map(duongDanKhoa),
      ...PROGRAMMING_SPECIALIZATIONS.flatMap((s) => [
        duongDanHuong(s),
        ...s.stages.map((st) => duongDanChangHuong(s, st)),
      ]),
      ...LEARNING_PATHS.map(duongDanLoTrinh),
    ]
    expect(new Set(tatCa).size).toBe(tatCa.length)
  })
})

describe('duongDanBaiHoc — URL bài học mang ngữ cảnh khoá', () => {
  const bai = { id: 'p3-u10-l1', title: 'Git: lưu lại lịch sử công việc' }

  it('không có khoá: chỉ `<mã>--<tiêu đề>`, tách lại đúng mã', () => {
    const url = duongDanBaiHoc(bai)
    expect(url.startsWith(`${PROGRAMMING_PREFIX}/bai-hoc/`)).toBe(true)
    expect(url).not.toContain('?')
    expect(idFromSlugSegment(doanCuoi(url))).toBe('p3-u10-l1')
  })

  it('có khoá: thêm `?khoa=`, và query KHÔNG lọt vào phần slug', () => {
    const url = duongDanBaiHoc(bai, { courseId: 'git' })
    expect(url).toContain('?khoa=git')
    const [segment, query] = doanCuoi(url).split('?')
    expect(idFromSlugSegment(segment ?? '')).toBe('p3-u10-l1')
    expect(segment).not.toContain('khoa=')
    expect(query).toBe('khoa=git')
  })

  it('cùng một bài ở hai khoá cho hai URL khác nhau, mã vẫn là một', () => {
    const a = duongDanBaiHoc(bai, { courseId: 'ml' })
    const b = duongDanBaiHoc(bai, { courseId: 'mlds' })
    expect(a).not.toBe(b)
    expect(idFromSlugSegment(doanCuoi(a).split('?')[0] ?? '')).toBe(
      idFromSlugSegment(doanCuoi(b).split('?')[0] ?? ''),
    )
  })

  it('tiêu đề rỗng vẫn cho URL tra được (chỉ còn mã)', () => {
    expect(duongDanBaiHoc({ id: 'p1-u1-l1', title: '' })).toBe(
      `${PROGRAMMING_PREFIX}/bai-hoc/p1-u1-l1`,
    )
  })
})

describe('maKhoaTuQuery', () => {
  it('mã khoá có thật → trả về mã', () => {
    expect(maKhoaTuQuery(new URLSearchParams('khoa=git'))).toBe('git')
  })

  it('mã lạ, rỗng, hoặc không có query → undefined (bỏ query, dùng cây bậc)', () => {
    expect(maKhoaTuQuery(new URLSearchParams('khoa=khong-co'))).toBeUndefined()
    expect(maKhoaTuQuery(new URLSearchParams('khoa='))).toBeUndefined()
    expect(maKhoaTuQuery(new URLSearchParams(''))).toBeUndefined()
  })

  it('đọc lại được đúng mã mà duongDanBaiHoc vừa ghi ra', () => {
    for (const course of SHORT_COURSES) {
      const url = duongDanBaiHoc({ id: 'p1-u1-l1', title: 'Bài mẫu' }, { courseId: course.id })
      const query = new URLSearchParams(url.split('?')[1] ?? '')
      expect(maKhoaTuQuery(query)).toBe(course.id)
    }
  })
})
