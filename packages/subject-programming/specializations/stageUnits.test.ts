// Cổng cho CẦU NỐI chặng → unit: khai sai ở đây nghĩa là học viên bấm "Vào học" rồi rơi vào
// trang trắng, nên mọi mã trong bảng phải TỒN TẠI THẬT ở cả hai đầu.
import { describe, expect, it } from 'vitest'
import { SPEC_STAGE_UNITS, unitsOfStage, specHasLessons } from './stageUnits.js'
import { resolveStage } from '../learningPaths/pathStages.js'
import { PROGRAMMING_LEVELS } from '../curriculum.js'
import { getLessonsByUnit } from '../lessons.js'

const UNIT_IDS = new Set(PROGRAMMING_LEVELS.flatMap((l) => l.units.map((u) => u.id)))

describe('cầu nối chặng chuyên sâu → unit bài học', () => {
  it('mọi chặng khai trong bảng đều là chặng CÓ THẬT (hướng chuyên sâu HOẶC chặng riêng của lộ trình)', () => {
    for (const stageId of Object.keys(SPEC_STAGE_UNITS)) {
      expect(resolveStage(stageId), `chặng ${stageId} không có trong bản đồ hướng`).toBeDefined()
    }
  })

  it('mọi unit khai trong bảng đều có thật trong curriculum VÀ đã có bài học', () => {
    for (const [stageId, units] of Object.entries(SPEC_STAGE_UNITS)) {
      expect(units.length, `chặng ${stageId} khai bảng rỗng`).toBeGreaterThan(0)
      for (const u of units) {
        expect(UNIT_IDS.has(u), `unit ${u} (chặng ${stageId}) không có trong curriculum`).toBe(true)
        expect(getLessonsByUnit(u).length, `unit ${u} chưa có bài học nào`).toBeGreaterThan(0)
      }
    }
  })

  it('một unit không được gán cho hai chặng khác nhau', () => {
    const tatCa = Object.values(SPEC_STAGE_UNITS).flat()
    expect(new Set(tatCa).size).toBe(tatCa.length)
  })

  it('chặng chưa soạn bài trả về mảng rỗng, không đoán bừa', () => {
    expect(unitsOfStage('architecture-s4')).toEqual([])
    expect(unitsOfStage('khong-co-huong-nay-s1')).toEqual([])
  })

  it('specHasLessons chỉ đúng với hướng đã có bài', () => {
    expect(specHasLessons('web')).toBe(true)
    expect(specHasLessons('game')).toBe(false)
  })

  it('mathforcode-s1 phủ đủ bốn module theo đúng thứ tự bằng bốn unit thật', () => {
    expect(unitsOfStage('mathforcode-s1')).toEqual(['p6-u134', 'p6-u135', 'p6-u136', 'p6-u137'])
  })

  it('mathforcode-s2 phủ đủ bốn module theo đúng thứ tự bằng bốn unit thật', () => {
    expect(unitsOfStage('mathforcode-s2')).toEqual(['p6-u138', 'p6-u139', 'p6-u140', 'p6-u141'])
  })
})
