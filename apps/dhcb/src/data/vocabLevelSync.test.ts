// ──────────────────────────────────────────────────────────────────────────
// CỔNG ĐỒNG BỘ: bậc CEFR của từ trong VÒNG TỪ VỰNG sinh tự động phải khớp
// bậc của chính từ đó trong TỪ ĐIỂN (apps/dhcb/public/data/dictionary).
//
// Vì sao cần: các vòng `cefr-*` được sinh ra TỪ từ điển, nhưng bậc được CHÉP
// vào JSON chứ không đọc lại lúc chạy. Hai đợt sửa thang bậc (PR #915, #916)
// sửa từ điển mà không đụng bản chép → 43 từ vẫn được dạy ở bậc cũ: người học
// bậc A1 vẫn gặp "impetus"/"tensely" trong vòng A1. Không cổng nào bắt được
// cho tới đợt vệ sinh dữ liệu 2026-09-15.
// Xem docs/audit/2026-09-15-ve-sinh-du-lieu-tu-dien.md
// ──────────────────────────────────────────────────────────────────────────
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect } from 'vitest'
import { CEFR_A1B2_EXTRA_CIRCLES } from './cefrA1B2ExtraVocab'
import { CEFR_C1C2_CIRCLES } from './cefrC1C2Vocab'

const DICT_DIR = join(process.cwd(), 'apps', 'dhcb', 'public', 'data', 'dictionary')

interface DictEntry {
  word: string
  pos: string
  level?: string
}

function dictionaryLevels(): Map<string, string> {
  const files = readdirSync(DICT_DIR)
    .filter((f) => /^chunk-\d+\.json$/.test(f))
    .sort()
  const map = new Map<string, string>()
  for (const f of files) {
    for (const e of JSON.parse(readFileSync(join(DICT_DIR, f), 'utf8')) as DictEntry[]) {
      if (e.level) map.set(`${e.word.trim().toLowerCase()}::${e.pos}`, e.level)
    }
  }
  return map
}

describe('bậc CEFR của vòng từ vựng sinh tự động', () => {
  const levels = dictionaryLevels()
  const circles = [...CEFR_A1B2_EXTRA_CIRCLES, ...CEFR_C1C2_CIRCLES]

  it('khớp bậc của chính từ đó trong từ điển', () => {
    const lech: string[] = []
    for (const c of circles) {
      for (const w of c.words) {
        const level = levels.get(`${w.word.trim().toLowerCase()}::${w.pos}`)
        if (level && w.level && level !== w.level) {
          lech.push(`${c.id} · ${w.word} (${w.pos}): vòng ${w.level} ≠ từ điển ${level}`)
        }
      }
    }
    expect(lech).toEqual([])
  })

  it('mọi từ trong vòng đều còn tồn tại trong từ điển', () => {
    const mat: string[] = []
    for (const c of circles) {
      for (const w of c.words) {
        if (!levels.has(`${w.word.trim().toLowerCase()}::${w.pos}`)) {
          mat.push(`${c.id} · ${w.word} (${w.pos})`)
        }
      }
    }
    expect(mat).toEqual([])
  })
})
