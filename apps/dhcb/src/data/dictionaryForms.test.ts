// Cổng canh DỮ LIỆU `forms` của từ điển (thêm 2026-09-22, docs/changelog/0407).
//
// VÌ SAO: trường `forms` (số nhiều, V-s/V-ing/quá khứ, so sánh hơn/nhất) được SINH bằng
// `npm run gen:word-forms` rồi commit thẳng vào `public/data/dictionary/chunk-*.json`. Không có
// gì bắt buộc người sửa bảng bất quy tắc phải chạy lại bộ sinh, nên dữ liệu đã commit từng trôi
// xa khỏi quy tắc: `repayed`, `resetted`, `mooses`, `monarches`, `mother-in-laws`, so sánh hơn
// bịa ra `liabler`/`nexter`/`numb → number`. Người học tra từ sẽ đọc đúng những dạng sai đó.
//
// Cổng này khoá hai chiều:
//   1. Mọi `forms` đã commit phải TRÙNG KHÍT kết quả `computeForms` hiện hành → sửa bảng quy tắc
//      mà quên chạy lại bộ sinh là đỏ, và ngược lại.
//   2. Chặn thẳng vài KHUÔN SAI kinh điển (dạng bịa đuôi -icing/-icked sai, -in-law chia sai,
//      so sánh hơn của tính từ phân loại) để lỗi được gọi đúng tên thay vì chỉ "lệch bộ sinh".
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { computeForms } from '../lib/wordForms'
import { CH_AS_K_NOUNS } from './irregularForms'
import type { DictEntry } from '../types'

const DICT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../public/data/dictionary',
)

function loadDictionary(): DictEntry[] {
  return readdirSync(DICT_DIR)
    .filter((f) => /^chunk-\d+\.json$/.test(f))
    .sort()
    .flatMap((f) => JSON.parse(readFileSync(path.join(DICT_DIR, f), 'utf8')) as DictEntry[])
}

const NHAC = 'Chạy `npm run gen:word-forms` rồi commit lại chunk-*.json'

describe('forms của từ điển khớp bộ sinh', () => {
  const entries = loadDictionary()

  it('nạp được toàn bộ từ điển', () => {
    expect(entries.length).toBeGreaterThan(10_000)
  })

  it('mọi entry CÓ forms đều trùng khít computeForms', () => {
    const lech: string[] = []
    for (const e of entries) {
      if (!e.forms) continue
      const mong = computeForms(e.word, e.pos)
      if (JSON.stringify(mong) !== JSON.stringify(e.forms)) {
        lech.push(`${e.word} (${e.pos}): ${JSON.stringify(e.forms)} ≠ ${JSON.stringify(mong)}`)
      }
    }
    expect(lech.slice(0, 20), `${NHAC} — ${lech.length} entry lệch`).toEqual([])
  })

  it('không còn dạng bịa của các khuôn sai đã gặp thật', () => {
    const xau: string[] = []
    for (const e of entries) {
      const f = e.forms
      if (!f) continue
      const moi = [f.plural, f.v3s, f.ving, f.past, f.pastPart, f.comparative, f.superlative]
      for (const v of moi) {
        if (typeof v !== 'string') continue
        // -ic phải thành -icking/-icked (mimicking), không phải -icing/-iced.
        if (/[^aeiou]icing$|[^aeiou]iced$/.test(v) && e.word.endsWith('ic')) {
          xau.push(`${e.word} → ${v}`)
        }
        // Danh từ ghép "-in-law" chia ở phần đầu: mothers-in-law, không phải mother-in-laws.
        if (v.endsWith('-in-laws')) xau.push(`${e.word} → ${v}`)
        // Đuôi -ch đọc /k/ không thêm -es: monarchs chứ không monarches.
        // (Chỉ các từ trong CH_AS_K_NOUNS — "march → marches", "speech → speeches" là ĐÚNG.)
        if (CH_AS_K_NOUNS.has(e.word.toLowerCase()) && v.endsWith('ches')) {
          xau.push(`${e.word} → ${v}`)
        }
      }
      // So sánh hơn không được trùng một từ khác hẳn nghĩa đã có trong từ điển
      // (numb → "number", own → "owner", lone → "loner").
      if (f.comparative && ['number', 'owner', 'loner', 'primer'].includes(f.comparative)) {
        xau.push(`${e.word} → ${f.comparative}`)
      }
    }
    expect(xau, NHAC).toEqual([])
  })

  it('không còn mục từ không tồn tại trong tiếng Anh (rà 2026-09-22)', () => {
    const words = new Set(entries.map((e) => e.word.toLowerCase()))
    for (const w of ['bereftly', 'evokingly']) expect(words.has(w), w).toBe(false)
  })
})
