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

  // Ý ĐỊNH của phép đo này: adapter phải TUYẾN TÍNH theo số unit — cây C2 (44 unit) là cây
  // lớn nhất và nó được dựng lại mỗi lần render, nên một vòng lặp lồng vô tình (O(n²)) sẽ làm
  // trang cấp học giật mà không cổng nào khác bắt được.
  //
  // Bản đầu (S07-1, PR #933) đo bằng ĐỒNG HỒ TƯỜNG: `performance.now() - t0 < 16`. Nó đã
  // FLAKE thật — `expect(17.56).toBeLessThan(16)` khi chạy cả bộ test dưới tải, lượt sau xanh.
  // Mili-giây đo cả máy chủ CI đang bận chứ không đo riêng thuật toán, nên ngưỡng nào cũng sẽ
  // vừa quá chặt (đỏ oan) vừa quá lỏng (bỏ lọt hồi quy trên máy nhanh).
  //
  // Thay bằng phép đo ĐỘC LẬP VỚI MÁY: đếm số lần adapter tra cứu bản đồ vòng từ vựng, rồi so
  // TỈ LỆ giữa cấp nhỏ và cấp lớn. Tuyến tính thì tỉ lệ tra cứu xấp xỉ tỉ lệ số unit; bậc hai
  // thì nó vọt lên bình phương — 44/15 ≈ 2,9 lần so với ≈ 8,6 lần, cách nhau quá xa để nhầm.
  // ĐO THẬT 2026-09-15: A1 (15 unit) 54 lượt tra, C2 (44 unit) 147 lượt → tỉ lệ tra 2,72 so
  // với tỉ lệ unit 2,93. Bậc hai sẽ cho ≈ 8,6 — xa hơn ngưỡng dưới đây rất nhiều lần.
  it('dựng cây TUYẾN TÍNH theo số unit (không có vòng lặp lồng ẩn)', () => {
    /** Bản đồ vòng từ vựng có đếm số lần bị tra — thay cho phép đo bằng đồng hồ tường. */
    function demTraCuu(level: CefrLevel): number {
      let dem = 0
      const theoDoi: ReadonlyMap<string, Circle> = {
        ...circles,
        get: (k: string) => {
          dem += 1
          return circles.get(k)
        },
        has: (k: string) => {
          dem += 1
          return circles.has(k)
        },
        size: circles.size,
        keys: () => circles.keys(),
        values: () => circles.values(),
        entries: () => circles.entries(),
        forEach: circles.forEach.bind(circles),
        [Symbol.iterator]: () => circles[Symbol.iterator](),
      } as ReadonlyMap<string, Circle>
      buildCefrOutline(level, { ...ctxRong(), circles: theoDoi })
      return dem
    }

    const a1 = levels.find((l) => l.id === 'A1')!
    const c2 = levels.find((l) => l.id === 'C2')!
    const traA1 = demTraCuu(a1)
    const traC2 = demTraCuu(c2)

    expect(
      traA1,
      'adapter phải thật sự đọc bản đồ vòng — nếu 0 thì phép đo mất nghĩa',
    ).toBeGreaterThan(0)
    const tiLeUnit = c2.units.length / a1.units.length
    // Hệ số 1,5 là biên độ cho chênh lệch số vòng/bài ngữ pháp giữa hai cấp, KHÔNG phải biên
    // độ cho tốc độ máy — nên nó không dao động theo tải.
    expect(traC2 / traA1).toBeLessThan(tiLeUnit * 1.5)
  })
})
