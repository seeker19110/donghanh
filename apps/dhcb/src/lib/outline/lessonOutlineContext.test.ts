// Cổng cho NGỮ CẢNH KHOÁ của trang bài học môn Lập trình (S07-2, AC-13).
//
// Bài `p3-u10-l1` vừa thuộc xương sống P3 vừa nằm trong khoá ngắn Git — ca chồng lấn THẬT.
// Mở nó từ khoá Git thì cây, breadcrumb, nút quay lại và URL bài phải nói về KHOÁ GIT; mở từ
// bậc P3 thì phải nói về P3. Đây là chỗ dễ sai nhất của quyết định "dùng query `?khoa=` thay
// vì route lồng", nên nó có test riêng chạy trên dữ liệu khoá thật.
import { describe, it, expect } from 'vitest'
import { getShortCourse } from '@dhcb/subject-programming/courses/registry'
import type { ProgrammingOutlineCtx } from './programmingOutline'
import { lessonOutlineContext } from './lessonOutlineContext'

/** Ngữ cảnh "đã tải tiến độ, chưa học gì, không bậc nào khoá". */
const CTX: ProgrammingOutlineCtx = {
  progress: [],
  progressState: 'ready',
  lockMap: new Map(),
}

const CHUNG = 'p3-u10-l1' // vừa ở P3 vừa ở khoá Git

describe('lessonOutlineContext', () => {
  it('ca chồng lấn còn thật: bài p3-u10-l1 vẫn nằm trong khoá Git', () => {
    const git = getShortCourse('git')!
    expect(git.chapters.some((c) => c.lessonIds.includes(CHUNG))).toBe(true)
  })

  it('mở theo khoá Git: cây là cây KHOÁ, breadcrumb và lối về trỏ về khoá', () => {
    const n = lessonOutlineContext(CHUNG, 'git', CTX)
    expect(n.course?.id).toBe('git')
    expect(n.outline?.courseId).toBe('git')
    expect(n.tenMucLuc).toBe('Mục lục khoá học')
    expect(n.storageKey).toBe('khoa:git')
    expect(n.backTo).toContain('/goc-hoc-tap/programming/khoa-hoc/git--')
    expect(n.crumbs.at(-1)?.label).toMatch(/^Khoá /)
  })

  it('mở theo khoá: MỌI liên kết bài trong cây mang theo ?khoa=git', () => {
    const n = lessonOutlineContext(CHUNG, 'git', CTX)
    const la = n.outline!.nodes.filter((x) => x.kind === 'lesson')
    expect(la.length).toBeGreaterThan(0)
    expect(la.every((x) => x.href?.includes('?khoa=git') === true)).toBe(true)
  })

  it('mở KHÔNG có ?khoa=: cây là cây BẬC P3, liên kết không dính khoá nào', () => {
    const n = lessonOutlineContext(CHUNG, undefined, CTX)
    expect(n.course).toBeUndefined()
    expect(n.outline?.courseId).toBeUndefined()
    expect(n.tenMucLuc).toBe('Mục lục môn học')
    expect(n.storageKey).toBe('p3')
    expect(n.backTo).toContain('/goc-hoc-tap/programming/bac/p3--')
    const la = n.outline!.nodes.filter((x) => x.kind === 'lesson')
    expect(la.some((x) => x.href?.includes('?khoa=') === true)).toBe(false)
  })

  it('mã khoá LẠ → bỏ qua query, dùng cây bậc (không ném, không vòng chuyển hướng)', () => {
    const n = lessonOutlineContext(CHUNG, 'khong-co-khoa-nay', CTX)
    expect(n.course).toBeUndefined()
    expect(n.backTo).toContain('/goc-hoc-tap/programming/bac/p3--')
  })

  it('khoá CÓ THẬT nhưng KHÔNG chứa bài này → cũng bỏ qua, dùng cây bậc', () => {
    const n = lessonOutlineContext('p1-u4-l1', 'git', CTX)
    expect(n.course).toBeUndefined()
    expect(n.backTo).toContain('/goc-hoc-tap/programming/bac/p1--')
  })

  it('bài chỉ thuộc khoá, mở không kèm ?khoa= → không có cây, nhưng có đường về khoá', () => {
    const git = getShortCourse('git')!
    // Bài "của riêng" khoá Git (không nằm trong xương sống P1–P6).
    const rieng = git.chapters.flatMap((c) => c.lessonIds).find((id) => id.startsWith('git-'))!
    const n = lessonOutlineContext(rieng, undefined, CTX)
    expect(n.outline).toBeUndefined()
    expect(n.khoaChuaBai.map((c) => c.id)).toContain('git')
    expect(n.backTo).toBe('/goc-hoc-tap/programming')
  })

  it('có cây rồi thì KHÔNG liệt kê khoá chứa bài (tránh nói thừa)', () => {
    expect(lessonOutlineContext(CHUNG, 'git', CTX).khoaChuaBai).toEqual([])
    expect(lessonOutlineContext(CHUNG, undefined, CTX).khoaChuaBai).toEqual([])
  })

  it('tiến độ chưa tải xong → mọi bài trong cây là "chưa đo được", không phải "chưa học"', () => {
    const n = lessonOutlineContext(CHUNG, undefined, { ...CTX, progressState: 'loading' })
    const la = n.outline!.nodes.filter((x) => x.kind === 'lesson')
    expect(la.every((x) => x.progress === 'unknown')).toBe(true)
  })
})
