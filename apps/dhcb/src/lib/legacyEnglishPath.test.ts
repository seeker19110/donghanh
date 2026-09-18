import { describe, expect, it } from 'vitest'
import { legacyEnglishPath } from './legacyEnglishPath'

describe('legacyEnglishPath', () => {
  it.each([
    ['/lo-trinh-hoc', '/goc-hoc-tap/english/lo-trinh'],
    ['/lo-trinh-hoc/A2', '/goc-hoc-tap/english/lo-trinh/a2'],
    ['/bai-hoc', '/goc-hoc-tap/english/bai-hoc'],
    ['/tro-truyen', '/goc-hoc-tap/english/tro-truyen'],
    ['/luyen-noi', '/goc-hoc-tap/english/luyen-noi'],
    ['/luyen-viet', '/goc-hoc-tap/english/luyen-viet'],
    ['/luyen-nghe', '/goc-hoc-tap/english/luyen-nghe'],
    ['/tu-dien', '/goc-hoc-tap/english/tu-dien'],
    ['/cau-thong-dung', '/goc-hoc-tap/english/cau-thong-dung'],
    ['/truyen-song-ngu/story-1', '/goc-hoc-tap/english/truyen/story-1'],
    ['/so-tay-loi-sai', '/goc-hoc-tap/english/so-tay-loi-sai'],
    ['/on-thi', '/goc-hoc-tap/english/on-thi'],
    ['/thu-thach', '/goc-hoc-tap/english/thu-thach'],
  ])('%s → %s', (oldPath, newPath) => {
    expect(legacyEnglishPath(oldPath, '?from=test')).toBe(`${newPath}?from=test`)
  })

  it('đổi từ vựng và giữ trường hợp rỗng ở trang từ điển', () => {
    expect(legacyEnglishPath('/tu-vung/hello%20world', '')).toBe(
      '/goc-hoc-tap/english/tu-dien/hello%20world',
    )
    expect(legacyEnglishPath('/tu-vung/', '')).toBe('/goc-hoc-tap/english/tu-dien')
  })

  it.each(['/unknown', '/tro-truyen/extra', '/lo-trinh-hoc/invalid'])(
    'không redirect đường dẫn lạ %s',
    (path) => expect(legacyEnglishPath(path, '')).toBeNull(),
  )
})
