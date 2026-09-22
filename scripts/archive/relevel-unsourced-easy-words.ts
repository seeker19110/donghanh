// scripts/archive/relevel-unsourced-easy-words.ts
// ÁP SÀN BẬC THEO TẦN SUẤT cho các mục từ điển có nhãn bậc KHÔNG đến từ nguồn chuẩn
// (CEFR-J / Octanove) — quy tắc và lý do ở packages/subject-english/dictionaryLevels.ts
// (bất biến thứ ba, `UNSOURCED_LEVEL_FLOORS`). Cổng canh: dictionaryLevels.test.ts.
//
// Đồng thời NỐI `base` cho vài dạng chia đang đứng như từ riêng trong vòng từ vựng
// (`heavier`, `posts`, `learnt`…) và cho chúng bậc của từ gốc — generator vòng bỏ qua mục có
// `base`, nên người học không còn phải học "posts" như một thẻ riêng.
//
// SAU KHI CHẠY, phải sinh lại vòng theo đúng thứ tự 5 bước ở
// docs/audit/2026-09-15-sinh-lai-vong-theo-thang-bac.md mục 2 (A1B2 → curriculum → C1C2 →
// curriculum → learn-json), rồi chạy `apps/dhcb/src/data/cefrCircleSentences.test.ts` để biết
// vòng nào cần viết lại câu mẫu.
//
// Chạy: npx tsx scripts/archive/relevel-unsourced-easy-words.ts [--dry]
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeJsonPretty } from '../lib/writeJson.ts'
import type { DictEntry } from '../../apps/dhcb/src/types.ts'
import {
  findUnsourcedEasyOutliers,
  parseWordlistHeadwords,
  UNSOURCED_EASY_ALLOWLIST,
  type DictLevelEntry,
} from '../../packages/subject-english/dictionaryLevels.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const DICT_DIR = path.join(ROOT, 'apps/dhcb/public/data/dictionary')
const WORDLISTS = [
  'data/cefrj/cefrj-vocabulary-profile-1.5.csv',
  'data/cefrj/octanove-vocabulary-profile-c1c2-1.0.csv',
]
const DRY = process.argv.includes('--dry')

// Dạng chia đang đứng như từ riêng → nối về từ gốc (word|pos của mục biến thể → từ gốc).
// Chỉ nối khi từ gốc CÓ THẬT trong từ điển; bậc lấy theo mục từ gốc cùng pos, không có thì
// lấy mục từ gốc đầu tiên.
const INFLECTION_LINKS: Record<string, string> = {
  'credits|n': 'credit',
  'designs|n': 'design',
  'earliest|adj': 'early',
  'grandchildren|n': 'grandchild',
  'healthier|adj': 'healthy',
  'heavier|adj': 'heavy',
  'learnt|v': 'learn',
  'posts|n': 'post',
  'practices|n': 'practice',
  'releases|n': 'release',
  'replies|n': 'reply',
  'searches|n': 'search',
  // ── Đợt 0410 (2026-09-22): 30 mục tìm bằng QUÉT THEO `forms` của từ gốc, không nhớ tay nữa
  // (bất biến thứ tư `findUnlinkedInflections`). 12 mục từ vựng hoá còn lại đứng riêng có lý
  // do, liệt kê ở `LEXICALIZED_FORM_ALLOWLIST`.
  'ads|n': 'ad',
  'alumni|n': 'alumnus',
  'bigger|adj': 'big',
  'biggest|adj': 'big',
  'died|v': 'die',
  'easier|adj': 'easy',
  'easiest|adj': 'easy',
  'farther|adv': 'far',
  'farthest|adv': 'far',
  'faster|adj': 'fast',
  'greater|adj': 'great',
  'greatest|adj': 'great',
  'happier|adj': 'happy',
  'higher|adj': 'high',
  'highest|adj': 'high',
  'hottest|adj': 'hot',
  'larger|adj': 'large',
  'largest|adj': 'large',
  'latest|adj': 'late',
  'lied|v': 'lie',
  'longer|adj': 'long',
  'lower|adj': 'low',
  'lowest|adj': 'low',
  'newest|adj': 'new',
  'older|adj': 'old',
  'parameters|n': 'parameter',
  'smaller|adj': 'small',
  'stats|n': 'stat',
  'sucked|v': 'suck',
  'sued|v': 'sue',
}

const files = fs
  .readdirSync(DICT_DIR)
  .filter((n) => /^chunk-\d+\.json$/.test(n))
  .sort()
const chunks = files.map((f) => ({
  file: path.join(DICT_DIR, f),
  entries: JSON.parse(fs.readFileSync(path.join(DICT_DIR, f), 'utf8')) as DictEntry[],
}))
const all = chunks.flatMap((c) => c.entries)
const byWord = new Map<string, DictEntry[]>()
for (const e of all) {
  const k = e.word.trim().toLowerCase()
  ;(byWord.get(k) ?? byWord.set(k, []).get(k)!).push(e)
}

const sourced = new Set<string>()
for (const rel of WORDLISTS) {
  for (const w of parseWordlistHeadwords(fs.readFileSync(path.join(ROOT, rel), 'utf8'))) {
    sourced.add(w)
  }
}

// ── 1. Nối base cho dạng chia ─────────────────────────────────────────────
let linked = 0
for (const e of all) {
  const key = `${e.word.trim().toLowerCase()}|${e.pos}`
  const baseWord = INFLECTION_LINKS[key]
  if (!baseWord) continue
  const bases = byWord.get(baseWord)
  if (!bases || bases.length === 0) {
    console.warn(`⚠ ${key}: từ gốc "${baseWord}" không có trong từ điển — bỏ qua`)
    continue
  }
  const base = bases.find((b) => b.pos === e.pos) ?? bases[0]!
  const before = `${e.level}${e.base ? ` base=${e.base}` : ''}`
  e.base = base.word
  if (base.level) e.level = base.level
  linked++
  console.log(`🔗 ${key}: ${before} → base=${e.base}, level=${e.level}`)
}

// ── 2. Áp sàn bậc cho nhãn không có nguồn ─────────────────────────────────
const allow = new Set(UNSOURCED_EASY_ALLOWLIST)
const outliers = findUnsourcedEasyOutliers(all as DictLevelEntry[], sourced).filter(
  (o) => !allow.has(`${o.word.trim().toLowerCase()}::${o.pos}`),
)
const byLevel: Record<string, number> = {}
for (const o of outliers) {
  const e = all.find((x) => x.word === o.word && x.pos === o.pos)!
  byLevel[`${o.level}→${o.floor}`] = (byLevel[`${o.level}→${o.floor}`] ?? 0) + 1
  console.log(`↑ ${o.word} (${o.pos}) hạng ${o.freq}: ${o.level} → ${o.floor}`)
  e.level = o.floor
}

// ── 3. Lan bậc mới của từ gốc xuống dạng chia đã khai trong `forms` ───────
// (bất biến thứ nhất: `designate` lên B2 thì `designated` cũng phải B2).
let propagated = 0
for (const e of all) {
  if (!e.base) continue
  const bases = byWord.get(e.base.trim().toLowerCase()) ?? []
  const base = bases.find((b) => b.pos === e.pos)
  if (!base?.level || base.level === e.level) continue
  const w = e.word.trim().toLowerCase()
  const declared = Object.values(base.forms ?? {}).some(
    (v) => typeof v === 'string' && v.trim().toLowerCase() === w,
  )
  if (!declared) continue
  console.log(`↳ ${e.word} (${e.pos}): ${e.level} → ${base.level} (theo ${base.word})`)
  e.level = base.level
  propagated++
}

console.log(
  `\nNối base: ${linked} · Nâng bậc: ${outliers.length} · Lan xuống dạng chia: ${propagated}`,
  byLevel,
)
if (DRY) {
  console.log('(--dry: không ghi file)')
} else {
  for (const c of chunks) await writeJsonPretty(c.file, c.entries)
  console.log(`✅ Đã ghi ${chunks.length} chunk. Tiếp: sinh lại vòng theo 5 bước (xem đầu file).`)
}
