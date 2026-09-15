import { describe, it, expect, beforeAll } from 'vitest'
import { OutlineSchema } from '@dhcb/core-contracts/outline'
import { loadCefr } from '../../data/cefrLoader'
import { loadFoundation } from '../../data/curriculumLoader'
import type { CefrLevel } from '../../data/cefrTypes'
import type { Circle } from '../../data/curriculumTypes'
import { buildCefrOutline, duongDanHoatDongCefr, type CefrOutlineCtx } from './cefrOutline'

// Dữ liệu THẬT: vitest.setup.ts chặn fetch('/data/…') và đọc thẳng public/ — không ra mạng.
let levels: CefrLevel[] = []
let circles: Map<string, Circle> = new Map()

beforeAll(async () => {
  levels = await loadCefr()
  circles = new Map((await loadFoundation()).map((c) => [c.id, c]))
})

const ctxRong = (): CefrOutlineCtx => ({
  learned: new Set<string>(),
  doneGrammar: new Set<string>(),
  viewedDialogues: new Set<string>(),
  circles,
  lockedMap: new Map(),
})

const hoatDong = (outline: { nodes: readonly { kind: string }[] }) =>
  outline.nodes.filter((n) => n.kind === 'activity')

describe('buildCefrOutline — dữ liệu cefr.json thật', () => {
  it('số unit mỗi cấp đúng bằng dữ liệu thật', () => {
    const dem = Object.fromEntries(levels.map((l) => [l.id, l.units.length]))
    expect(dem).toEqual({ A1: 15, A2: 27, B1: 40, B2: 43, C1: 32, C2: 44 })
    for (const level of levels) {
      const outline = buildCefrOutline(level, ctxRong())
      OutlineSchema.parse(outline)
      expect(outline.nodes.filter((n) => n.kind === 'chapter')).toHaveLength(level.units.length)
    }
  })

  it('mỗi unit có đúng ① vòng từ vựng ② bài ngữ pháp ③ MỘT hội thoại, đúng thứ tự', () => {
    const level = levels.find((l) => l.id === 'A1')!
    const outline = buildCefrOutline(level, ctxRong())
    for (const unit of level.units) {
      const con = outline.nodes.filter((n) => n.parentId === `chapter:${unit.id}`)
      const soVong = unit.vocabCircleIds.filter((id) => circles.has(id)).length
      expect(con).toHaveLength(soVong + unit.grammar.length + 1)
      const loai = con.map((n) => n.nodeId.split(':')[2])
      expect(loai).toEqual([
        ...Array<string>(soVong).fill('vocab'),
        ...Array<string>(unit.grammar.length).fill('grammar'),
        'dialogue',
      ])
      // `order` chạy liên tục trong cùng unit.
      expect(con.map((n) => n.order)).toEqual(con.map((_, i) => i))
    }
  })

  it('unit KHÔNG có ngữ pháp thì không sinh nút ngữ pháp rỗng (B2: 43 unit / ít bài ngữ pháp)', () => {
    const level = levels.find((l) => l.id === 'B2')!
    const khongNguPhap = level.units.filter((u) => u.grammar.length === 0)
    expect(khongNguPhap.length).toBeGreaterThan(0)
    const outline = buildCefrOutline(level, ctxRong())
    for (const unit of khongNguPhap) {
      const con = outline.nodes.filter((n) => n.parentId === `chapter:${unit.id}`)
      expect(con.some((n) => n.nodeId.includes(':grammar:'))).toBe(false)
    }
  })

  it('vòng từ vựng: xong 100% → completed, dở dang → in-progress, chưa học → not-started', () => {
    const level = levels.find((l) => l.id === 'A1')!
    const unit = level.units.find((u) => u.vocabCircleIds.some((id) => circles.has(id)))!
    const circle = circles.get(unit.vocabCircleIds.find((id) => circles.has(id))!)!

    const ctxXong = ctxRong()
    const outlineXong = buildCefrOutline(level, {
      ...ctxXong,
      learned: new Set(circle.words.map((w) => w.word.toLowerCase())),
    })
    const nutXong = outlineXong.nodes.find((n) => n.nodeId.endsWith(`:vocab:${circle.id}`))!
    expect(nutXong).toMatchObject({ progress: 'completed', evidenceSource: 'english.vocab' })

    const outlineDo = buildCefrOutline(level, {
      ...ctxXong,
      learned: new Set([circle.words[0]!.word.toLowerCase()]),
    })
    const nutDo = outlineDo.nodes.find((n) => n.nodeId.endsWith(`:vocab:${circle.id}`))!
    expect(nutDo).toMatchObject({ progress: 'in-progress', evidenceSource: 'english.vocab' })

    const nutChua = buildCefrOutline(level, ctxRong()).nodes.find((n) =>
      n.nodeId.endsWith(`:vocab:${circle.id}`),
    )!
    expect(nutChua.progress).toBe('not-started')
    expect(nutChua.evidenceSource).toBeUndefined()
  })

  it('ngữ pháp và hội thoại: đánh dấu xong → completed kèm đúng nguồn bằng chứng', () => {
    const level = levels.find((l) => l.id === 'A1')!
    const unit = level.units.find((u) => u.grammar.length > 0)!
    const grammarId = unit.grammar[0]!.id
    const outline = buildCefrOutline(level, {
      ...ctxRong(),
      doneGrammar: new Set([grammarId]),
      viewedDialogues: new Set([`${unit.id}:Hello there`]),
    })
    expect(outline.nodes.find((n) => n.nodeId.endsWith(`:grammar:${grammarId}`))).toMatchObject({
      progress: 'completed',
      evidenceSource: 'english.cefrGrammar',
    })
    expect(
      outline.nodes.find((n) => n.nodeId === `activity:${unit.id}:dialogue:${unit.id}`),
    ).toMatchObject({ progress: 'completed', evidenceSource: 'english.cefrDialogue' })
    OutlineSchema.parse(outline)
  })

  it('cấp KHOÁ: đọc bản đồ khoá của server, hoạt động không có href', () => {
    const level = levels.find((l) => l.id === 'A2')!
    const outline = buildCefrOutline(level, {
      ...ctxRong(),
      lockedMap: new Map([['A2', true]]),
      prevLevelId: 'A1',
    })
    OutlineSchema.parse(outline)
    expect(outline.nodes.every((n) => n.availability === 'locked')).toBe(true)
    expect(outline.nodes[0]!.lockReason).toContain('cuối cấp A1')
    expect(hoatDong(outline).every((n) => (n as { href?: string }).href === undefined)).toBe(true)
  })

  it('duongDanHoatDongCefr: trang cấp + ngữ cảnh trên query', () => {
    expect(duongDanHoatDongCefr('B1', 'b1-u3', 'grammar', 'g-1')).toBe(
      '/lo-trinh-hoc/b1?unit=b1-u3&hd=grammar%3Ag-1',
    )
  })

  it('cây cấp lớn nhất (C2) dựng dưới 16 ms', () => {
    const level = levels.find((l) => l.id === 'C2')!
    const ctx = ctxRong()
    const t0 = performance.now()
    buildCefrOutline(level, ctx)
    expect(performance.now() - t0).toBeLessThan(16)
  })
})
