// scripts/archive/reassign-circle-sentences.ts
// GÁN LẠI câu mẫu cho vòng từ vựng CEFR sau khi SINH LẠI VÒNG (gen-a1b2-extra-vocab.ts /
// gen-cefr-c1c2-vocab.ts xếp lại thành phần vòng → id vòng dịch chuyển, câu mẫu viết tay theo id
// vòng cũ không còn khớp).
//
// Cách làm: gom mọi câu "mồ côi" (thuộc id vòng đã biến mất, hoặc không còn dùng từ nào của vòng
// hiện tại / sai khung độ dài / quá 4 từ của vòng) rồi gán lại cho vòng đang THIẾU câu, nếu câu
// dùng ≥ 1 từ của vòng đó và đúng khung độ dài bậc. Câu không gán được thì bỏ (in số lượng).
// Cuối cùng in danh sách vòng vẫn còn thiếu để viết tay.
//
// Bằng chứng lần dùng đầu (2026-09-22, docs/changelog/0409): sinh lại vòng làm 96 vòng hỏng câu
// mẫu; script này gán lại 208 câu, còn 24 vòng / 31 câu phải viết tay — thay vì 239 câu.
//
// Chạy SAU 5 bước sinh lại vòng (docs/audit/2026-09-15-sinh-lai-vong-theo-thang-bac.md §2):
//   npx tsx scripts/archive/reassign-circle-sentences.ts
// rồi kiểm bằng: npx vitest run apps/dhcb/src/data/cefrCircleSentences.test.ts
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeJsonPretty } from '../lib/writeJson.ts'
import {
  LENGTH_BY_LEVEL,
  MAX_CIRCLE_WORDS_PER_SENTENCE,
  MAX_SENTENCES_PER_CIRCLE,
  MIN_DISTINCT_WORDS_COVERED,
  MIN_SENTENCES_PER_CIRCLE,
  countWords,
  matchedCircleWords,
  normalizeSentence,
  type CefrLevelId,
} from '../../apps/dhcb/src/lib/sentenceQuality.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const CURRICULUM = path.join(ROOT, 'apps/dhcb/public/data/curriculum.json')
const SENTENCES = path.join(ROOT, 'apps/dhcb/src/data/cefrCircleSentences.json')

interface Sentence {
  en: string
  vi: string
}
interface Circle {
  id: string
  words: { word: string }[]
}

const circles = JSON.parse(fs.readFileSync(CURRICULUM, 'utf8')) as Circle[]
const file = JSON.parse(fs.readFileSync(SENTENCES, 'utf8')) as {
  sentences: Record<string, Sentence[]>
} & Record<string, unknown>

const ids = new Set(circles.map((c) => c.id))
const levelOf = (id: string): CefrLevelId | null => {
  const m = /^cefr-(a1|a2|b1|b2|c1|c2)-/.exec(id)
  return m ? (m[1] as CefrLevelId) : null
}
function fits(s: Sentence, words: string[], lv: CefrLevelId): boolean {
  const hit = matchedCircleWords(s.en, words)
  const n = countWords(s.en)
  const { min, max } = LENGTH_BY_LEVEL[lv]
  return hit.length >= 1 && hit.length <= MAX_CIRCLE_WORDS_PER_SENTENCE && n >= min && n <= max
}

// ── 1. Tách câu còn khớp / câu mồ côi ─────────────────────────────────────
const loose: Sentence[] = []
const out: Record<string, Sentence[]> = {}
for (const [id, list] of Object.entries(file.sentences)) {
  if (!ids.has(id)) {
    loose.push(...list)
    continue
  }
  const lv = levelOf(id)
  const words = circles.find((c) => c.id === id)!.words.map((w) => w.word)
  out[id] = []
  for (const s of list) (lv && !fits(s, words, lv) ? loose : out[id]).push(s)
}
const used = new Set(
  Object.values(out)
    .flat()
    .map((s) => normalizeSentence(s.en)),
)

// ── 2. Gán câu mồ côi cho vòng thiếu ──────────────────────────────────────
let reassigned = 0
for (const c of circles) {
  const lv = levelOf(c.id)
  if (!lv) continue
  const words = c.words.map((w) => w.word)
  const cur = (out[c.id] ??= [])
  const covered = new Set(cur.flatMap((s) => matchedCircleWords(s.en, words)))
  const needMore = () =>
    cur.length < MAX_SENTENCES_PER_CIRCLE &&
    (cur.length < MIN_SENTENCES_PER_CIRCLE || covered.size < MIN_DISTINCT_WORDS_COVERED)
  for (let i = 0; i < loose.length && needMore(); i++) {
    const s = loose[i]!
    if (used.has(normalizeSentence(s.en)) || !fits(s, words, lv)) continue
    const hit = matchedCircleWords(s.en, words)
    // Đã đủ số câu mà câu này không phủ thêm từ mới thì không giúp gì cho độ phủ.
    if (cur.length >= MIN_SENTENCES_PER_CIRCLE && hit.every((w) => covered.has(w))) continue
    cur.push(s)
    used.add(normalizeSentence(s.en))
    for (const w of hit) covered.add(w)
    loose.splice(i, 1)
    i--
    reassigned++
  }
}

// ── 3. Ghi + báo vòng còn thiếu ───────────────────────────────────────────
// Khoá sắp tăng dần — test HINH_DANG_FILE canh, để diff các đợt sau đọc được.
file.sentences = Object.fromEntries(
  Object.entries(out).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
)
await writeJsonPretty(SENTENCES, file)
const thieu: string[] = []
for (const c of circles) {
  const lv = levelOf(c.id)
  if (!lv) continue
  const words = c.words.map((w) => w.word)
  const cur = out[c.id] ?? []
  const covered = new Set(cur.flatMap((s) => matchedCircleWords(s.en, words)))
  if (cur.length < MIN_SENTENCES_PER_CIRCLE || covered.size < MIN_DISTINCT_WORDS_COVERED) {
    thieu.push(`${c.id} (${cur.length} câu, phủ ${covered.size} từ)`)
  }
}
console.log(`✅ gán lại ${reassigned} câu · bỏ ${loose.length} câu mồ côi không gán được`)
console.log(
  thieu.length === 0
    ? '✅ mọi vòng cefr-* đủ câu mẫu'
    : `⚠ ${thieu.length} vòng còn thiếu, cần viết tay:\n  ${thieu.join('\n  ')}`,
)
