// Cổng bất biến thang bậc CEFR của từ điển — đọc DỮ LIỆU THẬT trong
// apps/dhcb/public/data/dictionary/chunk-*.json, không dựng dữ liệu giả.
// Thêm 2026-09-14 sau đợt rà thang bậc: xem docs/audit/2026-09-14-thang-bac-cefr-tu-dien.md
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect } from 'vitest'
import {
  findInflectionLevelMismatches,
  findRareEasyOutliers,
  findUnsourcedEasyOutliers,
  parseWordlistHeadwords,
  RARE_EASY_ALLOWLIST,
  RARE_RANK_FLOOR,
  UNSOURCED_EASY_ALLOWLIST,
  UNSOURCED_LEVEL_FLOORS,
  type DictLevelEntry,
} from './dictionaryLevels.js'

const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const DICT_DIR = join(process.cwd(), 'apps', 'dhcb', 'public', 'data', 'dictionary')
// Nguồn chuẩn tầng 1 của scripts/tag-cefr-levels.ts (xem data/cefrj/SOURCE.md).
const WORDLIST_FILES = [
  join(process.cwd(), 'data', 'cefrj', 'cefrj-vocabulary-profile-1.5.csv'),
  join(process.cwd(), 'data', 'cefrj', 'octanove-vocabulary-profile-c1c2-1.0.csv'),
]

function loadSourcedHeadwords(): Set<string> {
  const out = new Set<string>()
  for (const f of WORDLIST_FILES) {
    for (const w of parseWordlistHeadwords(readFileSync(f, 'utf8'))) out.add(w)
  }
  return out
}

function loadDictionary(): DictLevelEntry[] {
  const files = readdirSync(DICT_DIR)
    .filter((f) => /^chunk-\d+\.json$/.test(f))
    .sort()
  return files.flatMap(
    (f) => JSON.parse(readFileSync(join(DICT_DIR, f), 'utf8')) as DictLevelEntry[],
  )
}

describe('thang bậc CEFR của từ điển', () => {
  const entries = loadDictionary()

  it('mọi mục từ đều có bậc CEFR hợp lệ', () => {
    const bad = entries.filter((e) => !e.level || !CEFR.includes(e.level))
    expect(bad.map((e) => `${e.word} (${e.pos})`)).toEqual([])
    expect(entries.length).toBeGreaterThan(10_000)
  })

  it('dạng chia cùng bậc với từ gốc (see A1 ⇒ saw A1, không phải từ mới)', () => {
    const mismatches = findInflectionLevelMismatches(entries)
    expect(
      mismatches.map((m) => `${m.word} (${m.pos}) ${m.level} ≠ ${m.base} ${m.baseLevel}`),
    ).toEqual([])
  })

  it('mọi mục biến thể trỏ về một từ gốc CÓ THẬT trong từ điển', () => {
    const words = new Set(entries.map((e) => e.word.trim().toLowerCase()))
    const orphans = entries.filter((e) => e.base && !words.has(e.base.trim().toLowerCase()))
    expect(orphans.map((e) => `${e.word} → ${e.base}`)).toEqual([])
  })

  it(`từ rất hiếm (hạng ≥ ${RARE_RANK_FLOOR}) không được nằm ở bậc A1/A2, trừ ngoại lệ đã ghi`, () => {
    expect(findRareEasyOutliers(entries)).toEqual([...RARE_EASY_ALLOWLIST].sort())
  })

  it('nhãn KHÔNG có nguồn chuẩn tôn trọng sàn bậc theo tần suất (momentum không thể là A1)', () => {
    const sourced = loadSourcedHeadwords()
    expect(sourced.size).toBeGreaterThan(5_000)
    expect(sourced.has('grandparent')).toBe(true) // headword thường
    expect(sourced.has('a.m.')).toBe(true) // headword ghép "a.m./A.M./am/AM" tách đúng
    const outliers = findUnsourcedEasyOutliers(entries, sourced).map(
      (o) => `${o.word.trim().toLowerCase()}::${o.pos}`,
    )
    expect(outliers).toEqual([...UNSOURCED_EASY_ALLOWLIST].sort())
  })

  it('sàn bậc sắp theo hạng GIẢM để mốc khớp đầu tiên là mốc chặt nhất', () => {
    const ranks = UNSOURCED_LEVEL_FLOORS.map((m) => m.minRank)
    expect(ranks).toEqual([...ranks].sort((a, b) => b - a))
  })
})

describe('parseWordlistHeadwords', () => {
  it('tách trường đầu có dấu nháy kép và headword ghép bằng "/"', () => {
    const csv = 'headword,pos,CEFR\n"a, an",determiner,A1\nx/y/Z,noun,B1\n\n'
    expect([...parseWordlistHeadwords(csv)].sort()).toEqual(['a, an', 'x', 'y', 'z'])
  })
})
