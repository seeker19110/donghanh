import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { SUBJECT_ENTRIES } from './subjectEntry.js'
import { SUPPORTED_SUBJECTS } from './subjectRegistry.js'

// Đọc `apps/dhcb/src/App.tsx` để đối chiếu ctaPath với route THẬT — khuôn cách `navTree.test.ts`
// kiểm dữ liệu điều hướng khớp `subjectRegistry`, áp dụng cho việc đọc route thật của App.tsx.
const here = path.dirname(fileURLToPath(import.meta.url))
const appTsxPath = path.resolve(here, '../../apps/dhcb/src/App.tsx')
const appTsx = readFileSync(appTsxPath, 'utf8')

/** Route tĩnh (chuỗi literal `path="..."`) khai trong App.tsx. */
function staticRoutePaths(source: string): string[] {
  return [...source.matchAll(/path="([^"]+)"/g)].map((m) => m[1]!)
}

describe('SUBJECT_ENTRIES — một nguồn danh mục môn', () => {
  const staticPaths = staticRoutePaths(appTsx)

  it('id/thứ tự/label khớp SUPPORTED_SUBJECTS 1-1', () => {
    expect(SUBJECT_ENTRIES.map((e) => e.id)).toEqual(SUPPORTED_SUBJECTS.map((s) => s.id))
    expect(SUBJECT_ENTRIES.map((e) => e.label)).toEqual(SUPPORTED_SUBJECTS.map((s) => s.label))
    SUBJECT_ENTRIES.forEach((e, i) => expect(e.order).toBe(i))
  })

  it('mọi ctaPath là route có thật trong App.tsx (tĩnh hoặc khớp mẫu /goc-hoc-tap/:subjectId)', () => {
    for (const entry of SUBJECT_ENTRIES) {
      const isStaticMatch = staticPaths.includes(entry.ctaPath)
      // App.tsx có route tham số `/goc-hoc-tap/:subjectId` (SubjectDetail) phục vụ mọi môn STEM
      // KHÔNG có không gian riêng — route Tiếng Anh dùng `duongDanMonTiengAnh()` (không phải
      // literal) nhưng đã được `subjectsHost.test.ts` canh trả về đúng '/goc-hoc-tap/english',
      // và đường đó cũng khớp mẫu tham số dưới đây nên không cần liệt kê riêng.
      const isParamMatch =
        staticPaths.includes('/goc-hoc-tap/:subjectId') &&
        /^\/goc-hoc-tap\/[a-z]+$/.test(entry.ctaPath)
      expect(isStaticMatch || isParamMatch, `ctaPath "${entry.ctaPath}" (môn ${entry.id})`).toBe(
        true,
      )
    }
  })

  it('không có id trùng, mọi trường bắt buộc có giá trị hợp lệ', () => {
    const ids = SUBJECT_ENTRIES.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const e of SUBJECT_ENTRIES) {
      expect(e.label.length).toBeGreaterThan(0)
      expect(e.ctaPath.startsWith('/')).toBe(true)
      expect(['live', 'preview', 'building']).toContain(e.status)
    }
  })

  it('Q5: english/programming live, 4 môn STEM preview (bài draft đã phục vụ, xem spec §7 Q5)', () => {
    const statusOf = (id: string) => SUBJECT_ENTRIES.find((e) => e.id === id)?.status
    expect(statusOf('english')).toBe('live')
    expect(statusOf('programming')).toBe('live')
    for (const id of ['mathematics', 'physics', 'chemistry', 'biology']) {
      expect(statusOf(id)).toBe('preview')
    }
  })
})
