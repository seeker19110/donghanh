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
  freq?: number // THỨ HẠNG tần suất (1 = phổ biến nhất), không phải số lần xuất hiện
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

// ---------------------------------------------------------------------------
// Bất biến thứ hai: KHÔNG có từ rất hiếm nào nằm ở bậc nhập môn.
//
// Đợt rà 2026-09-15 tìm thấy 56 mục hạng ≥ 30 000 mà gắn A1/A2 — "tensely" A1 (hạng
// 72 439), "impetus" A1, "illegible" A1. Nguyên nhân: Words-CEFR-Dataset gán cho từ PHÁI
// SINH đúng bậc của từ GỐC ("tense" A1 → "tensely" A1), bỏ qua việc dạng phái sinh hiếm hơn
// hẳn và khó hơn về hình thái. Đã hạ 45 mục xuống B1/B2/C1 theo độ trong suốt của phái sinh.
//
// 11 mục còn lại là NGOẠI LỆ CÓ CHỦ ĐÍCH, liệt kê tên để mọi mục mới rơi vào nhóm này đều
// phải được xem xét (xem docs/audit/2026-09-15-tu-hiem-gan-bac-nhap-mon.md).

export const RARE_RANK_FLOOR = 30_000

// Ngoại lệ: 10 mục do CHÍNH CEFR-J chấm A1/A2 — giáo trình dạy sớm theo chủ đề, thứ hạng thấp
// là đặc tính của ngữ liệu viết chứ không phải của độ khó. (Mục thứ 11 trước đây là "iii" —
// chữ số La Mã — đã bị XOÁ khỏi từ điển trong đợt vệ sinh dữ liệu 2026-09-15.)
export const RARE_EASY_ALLOWLIST: readonly string[] = [
  'centimeter::n',
  'footballer::n',
  'grandparent::n',
  'headphone::n',
  'kilogram::n',
  'metre::n',
  'motorway::n',
  'schoolchild::n',
  'superlative::n',
  'tablespoon::n',
]

const ENTRY_LEVELS: readonly CefrWordLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

// Mục "rất hiếm mà gắn bậc nhập môn": hạng tần suất ≥ RARE_RANK_FLOOR nhưng bậc ≤ A2.
// Trả về khoá `word::pos` đã sắp xếp, để test so thẳng với danh sách ngoại lệ.
export function findRareEasyOutliers(entries: readonly DictLevelEntry[]): string[] {
  return entries
    .filter(
      (e) =>
        typeof e.freq === 'number' &&
        e.freq >= RARE_RANK_FLOOR &&
        e.level !== undefined &&
        ENTRY_LEVELS.indexOf(e.level) <= 1,
    )
    .map((e) => `${e.word.trim().toLowerCase()}::${e.pos}`)
    .sort()
}
