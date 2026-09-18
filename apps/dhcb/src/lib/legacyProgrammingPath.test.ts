import { describe, expect, it } from 'vitest'
import { legacyProgrammingPath } from './legacyProgrammingPath'

describe('legacyProgrammingPath', () => {
  it.each([
    ['/lap-trinh', '/goc-hoc-tap/programming'],
    ['/lap-trinh/gioi-thieu', '/goc-hoc-tap/programming/gioi-thieu'],
    ['/lap-trinh/du-an', '/goc-hoc-tap/programming/du-an'],
    ['/lap-trinh/on-tap', '/goc-hoc-tap/programming/on-tap'],
    ['/lap-trinh/chay-thu', '/goc-hoc-tap/programming/chay-thu'],
    ['/lap-trinh/p1--nen-tang', '/goc-hoc-tap/programming/bac/p1--nen-tang'],
    ['/lap-trinh/bai-hoc/p1-u1-l1--hello', '/goc-hoc-tap/programming/bai-hoc/p1-u1-l1--hello'],
    ['/lap-trinh/khoa-hoc/git--git-github', '/goc-hoc-tap/programming/khoa-hoc/git--git-github'],
    ['/lap-trinh/khoa/git', '/goc-hoc-tap/programming/khoa-hoc/git'],
    ['/lap-trinh/huong', '/goc-hoc-tap/programming/huong'],
    ['/lap-trinh/huong/web--web', '/goc-hoc-tap/programming/huong/web--web'],
    [
      '/lap-trinh/huong/web--web/web-s2--full-stack',
      '/goc-hoc-tap/programming/huong/web--web/web-s2--full-stack',
    ],
    [
      '/lap-trinh/lo-trinh/principal-ai--arch',
      '/goc-hoc-tap/programming/lo-trinh/principal-ai--arch',
    ],
    [
      '/lap-trinh/lo-trinh/principal-ai--arch/chang/p5--tam-truong',
      '/goc-hoc-tap/programming/lo-trinh/principal-ai--arch/chang/p5--tam-truong',
    ],
  ])('%s → %s', (oldPath, newPath) => {
    expect(legacyProgrammingPath(oldPath, '')).toBe(newPath)
  })

  it('giữ nguyên query ngữ cảnh khoá', () => {
    expect(legacyProgrammingPath('/lap-trinh/bai-hoc/p3-u10-l1', '?khoa=git')).toBe(
      '/goc-hoc-tap/programming/bai-hoc/p3-u10-l1?khoa=git',
    )
  })

  it.each(['/programming', '/lap-trinh/khong-ton-tai', '/goc-hoc-tap/programming'])(
    'URL không hợp lệ trả null: %s',
    (path) => {
      expect(legacyProgrammingPath(path, '')).toBeNull()
    },
  )
})
