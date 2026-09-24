// Test storyProgress — lưu/đọc vị trí "Đọc tiếp" của truyện (docs/specs/2026-09-24-truyen-doc-tiep.md).
import { describe, it, expect, beforeEach } from 'vitest'
import {
  MAX_STORY_PROGRESS_ENTRIES,
  clearStoryProgress,
  getAllStoryProgress,
  getStoryProgress,
  saveStoryProgress,
  storyProgressPercent,
} from './storyProgress'

const KEY = 'et_story_progress'

beforeEach(() => {
  localStorage.clear()
})

describe('getStoryProgress', () => {
  it('chưa đọc gì → null, map rỗng', () => {
    expect(getStoryProgress('fox-crow')).toBeNull()
    expect(getAllStoryProgress()).toEqual({})
  })

  it('localStorage hỏng JSON / sai kiểu → coi như rỗng, không ném lỗi', () => {
    localStorage.setItem(KEY, '{không phải json')
    expect(getAllStoryProgress()).toEqual({})
    localStorage.setItem(KEY, JSON.stringify([1, 2]))
    expect(getAllStoryProgress()).toEqual({})
  })

  it('bỏ từng bản ghi sai schema hoặc para ≥ total, giữ bản hợp lệ', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        good: { para: 2, total: 5, updatedAt: 1 },
        badType: { para: '2', total: 5, updatedAt: 1 },
        overflow: { para: 5, total: 5, updatedAt: 1 },
        zero: { para: 0, total: 5, updatedAt: 1 },
      }),
    )
    expect(Object.keys(getAllStoryProgress())).toEqual(['good'])
  })
})

describe('saveStoryProgress', () => {
  it('đọc dở giữa chừng → lưu đúng vị trí', () => {
    saveStoryProgress('fox-crow', 3, 8, 1000)
    expect(getStoryProgress('fox-crow')).toEqual({ para: 3, total: 8, updatedAt: 1000 })
  })

  it('ghi đè vị trí cũ của cùng truyện, không đụng truyện khác', () => {
    saveStoryProgress('a', 2, 8, 1)
    saveStoryProgress('b', 4, 6, 2)
    saveStoryProgress('a', 5, 8, 3)
    expect(getStoryProgress('a')?.para).toBe(5)
    expect(getStoryProgress('b')?.para).toBe(4)
  })

  it('quay về đoạn đầu (para 0) → xoá bản ghi', () => {
    saveStoryProgress('a', 3, 8)
    saveStoryProgress('a', 0, 8)
    expect(getStoryProgress('a')).toBeNull()
  })

  it('tới đoạn cuối (đọc xong) → xoá bản ghi, và xoá cả key khi map rỗng', () => {
    saveStoryProgress('a', 3, 8)
    saveStoryProgress('a', 7, 8)
    expect(getStoryProgress('a')).toBeNull()
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('truyện chỉ 1 đoạn → không bao giờ có trạng thái đọc dở', () => {
    saveStoryProgress('short', 0, 1)
    saveStoryProgress('short', 1, 1)
    expect(getStoryProgress('short')).toBeNull()
  })

  it('giá trị không nguyên / âm → không lưu', () => {
    saveStoryProgress('a', 2.5, 8)
    saveStoryProgress('b', -1, 8)
    expect(getAllStoryProgress()).toEqual({})
  })

  it(`vượt ${MAX_STORY_PROGRESS_ENTRIES} truyện → bỏ bản cũ nhất`, () => {
    for (let i = 0; i <= MAX_STORY_PROGRESS_ENTRIES; i++) saveStoryProgress(`s${i}`, 1, 4, i)
    const map = getAllStoryProgress()
    expect(Object.keys(map)).toHaveLength(MAX_STORY_PROGRESS_ENTRIES)
    expect(map.s0).toBeUndefined()
    expect(map[`s${MAX_STORY_PROGRESS_ENTRIES}`]).toBeDefined()
  })
})

describe('clearStoryProgress', () => {
  it('xoá đúng một truyện; gọi với truyện chưa lưu là vô hại', () => {
    saveStoryProgress('a', 2, 8)
    saveStoryProgress('b', 2, 8)
    clearStoryProgress('a')
    clearStoryProgress('không-có')
    expect(getStoryProgress('a')).toBeNull()
    expect(getStoryProgress('b')).not.toBeNull()
  })
})

describe('storyProgressPercent', () => {
  it('tính % theo đoạn, kẹp trong [1, 99]', () => {
    expect(storyProgressPercent({ para: 4, total: 8, updatedAt: 0 })).toBe(50)
    expect(storyProgressPercent({ para: 1, total: 500, updatedAt: 0 })).toBe(1)
    expect(storyProgressPercent({ para: 998, total: 999, updatedAt: 0 })).toBe(99)
  })
})
