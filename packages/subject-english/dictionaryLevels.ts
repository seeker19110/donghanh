// packages/subject-english/dictionaryLevels.ts — logic THUẦN (không I/O) rà thang bậc CEFR
// của từ điển (apps/dhcb/public/data/dictionary/chunk-*.json).
//
// Bất biến canh ở đây: MỘT DẠNG CHIA PHẢI CÙNG BẬC VỚI TỪ GỐC.
// Vì sao: bậc CEFR đo ĐỘ KHÓ CỦA MỤC TỪ VỰNG, không đo độ khó của dạng chia. Người học
// biết "see" (A1) thì "saw" cũng là A1 — nó không phải từ mới phải học lại. Trước đợt rà
// 2026-09-14, 49 dạng chia mang bậc riêng do nguồn gắn nhãn (wordlist/AI) chấm từng dạng
// độc lập: "saw" B2 trong khi "see" A1, "found" B2 trong khi "find" A1.
//
// CHỈ áp cho dạng chia THẬT, nhận biết bằng HAI dấu hiệu cùng lúc:
//   (1) từ gốc tự khai dạng đó trong `forms` (plural/past/ving/...), và
//   (2) mục biến thể cùng từ loại với mục từ gốc.
// Hai điều kiện này loại ra các từ đã TỪ VỰNG HOÁ — mang nghĩa riêng nên có bậc riêng là
// đúng: "ground" (mặt đất, n) ≠ grind, "rose" (hoa hồng, n) ≠ rise, "drunk" (say, adj) ≠
// drink, "known/written/hidden" (adj) ≠ động từ gốc.

import type { CefrWordLevel } from './cefrTagging.js'

export interface DictLevelEntry {
  word: string
  pos: string
  level?: CefrWordLevel
  base?: string
  forms?: Record<string, unknown>
}

// Các khoá trong `forms` chứa một DẠNG CHIA (bỏ qua cờ boolean uncountable/irregular).
const FORM_KEYS = [
  'plural',
  'v3s',
  'ving',
  'past',
  'pastPart',
  'comparative',
  'superlative',
] as const

export interface InflectionLevelMismatch {
  word: string
  pos: string
  level: CefrWordLevel
  base: string
  baseLevel: CefrWordLevel
}

function indexByWord(entries: readonly DictLevelEntry[]): Map<string, DictLevelEntry[]> {
  const byWord = new Map<string, DictLevelEntry[]>()
  for (const e of entries) {
    const key = e.word.trim().toLowerCase()
    const list = byWord.get(key)
    if (list) list.push(e)
    else byWord.set(key, [e])
  }
  return byWord
}

// Mục biến thể có phải DẠNG CHIA thật của từ gốc không (điều kiện (1) ở đầu file).
function isDeclaredForm(baseEntries: readonly DictLevelEntry[], word: string): boolean {
  const w = word.trim().toLowerCase()
  return baseEntries.some((b) =>
    FORM_KEYS.some(
      (k) =>
        String(b.forms?.[k] ?? '')
          .trim()
          .toLowerCase() === w,
    ),
  )
}

// Mục từ gốc dùng để so bậc: ưu tiên mục CÙNG TỪ LOẠI với biến thể.
function pickBaseEntry(
  baseEntries: readonly DictLevelEntry[],
  pos: string,
): DictLevelEntry | undefined {
  return baseEntries.find((b) => b.pos === pos)
}

// Mọi dạng chia đang lệch bậc so với từ gốc. Rỗng = đạt bất biến.
export function findInflectionLevelMismatches(
  entries: readonly DictLevelEntry[],
): InflectionLevelMismatch[] {
  const byWord = indexByWord(entries)
  const out: InflectionLevelMismatch[] = []

  for (const e of entries) {
    if (!e.base || !e.level) continue
    const baseEntries = byWord.get(e.base.trim().toLowerCase())
    if (!baseEntries) continue
    if (!isDeclaredForm(baseEntries, e.word)) continue
    const base = pickBaseEntry(baseEntries, e.pos)
    if (!base?.level || base.level === e.level) continue
    out.push({
      word: e.word,
      pos: e.pos,
      level: e.level,
      base: base.word,
      baseLevel: base.level,
    })
  }

  return out
}
