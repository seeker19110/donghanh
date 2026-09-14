// ──────────────────────────────────────────────────────────────────────────
// Bộ kiểm CHẤT LƯỢNG CÂU MẪU của vòng từ vựng (dùng chung cho test bất biến
// `data/cefrCircleSentences.test.ts` và cho script sinh câu sau này).
//
// Vì sao tách ra một file riêng: đặc tả
// `docs/specs/2026-09-14-cau-mau-cho-vong-tu-vung-cefr.md` §⑤ yêu cầu script sinh
// và test canh dùng CÙNG một bộ luật — chép hai bản là chắc chắn lệch nhau.
//
// Ghi chú vị trí file (khác đặc tả): đặc tả đề xuất `scripts/lib/sentenceQuality.ts`,
// nhưng test canh nằm trong `apps/dhcb/src`, mà `apps/dhcb/tsconfig.json` chỉ include
// `src` — import ngược ra `scripts/` sẽ nằm ngoài phạm vi biên dịch của app. Đặt ở
// `apps/dhcb/src/lib/` thì cả app lẫn `scripts/` đều import được (scripts ĐƯỢC phép
// import apps, xem CLAUDE.md §6).
// ──────────────────────────────────────────────────────────────────────────

/** Bậc CEFR mà đợt sinh câu mẫu này làm việc. */
export type CefrLevelId = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'

/**
 * Khung độ dài câu (đếm từ của phần `en`) theo bậc — bảng ở §④ của đặc tả.
 * A1 mà 20 từ/câu thì người mới không đọc nổi; C2 mà 5 từ/câu thì không tải nổi
 * từ vựng trừu tượng của bậc đó.
 */
export const LENGTH_BY_LEVEL: Record<CefrLevelId, { min: number; max: number }> = {
  a1: { min: 3, max: 10 },
  a2: { min: 4, max: 12 },
  b1: { min: 5, max: 16 },
  b2: { min: 6, max: 20 },
  c1: { min: 6, max: 24 },
  c2: { min: 6, max: 24 },
}

/** Số câu tối thiểu / tối đa cho mỗi vòng (N = 3, trần 5 — §0.5 đặc tả). */
export const MIN_SENTENCES_PER_CIRCLE = 3
export const MAX_SENTENCES_PER_CIRCLE = 5

/** Số từ PHÂN BIỆT của vòng mà cả bộ câu phải "ăn" được (chặn 3 câu lặp một từ). */
export const MIN_DISTINCT_WORDS_COVERED = 3

/**
 * Ký tự CHỈ có trong tiếng Việt có dấu (đủ cả hoa/thường).
 * Dùng hai chiều: `vi` BẮT BUỘC có ít nhất một ký tự loại này (chặn AI trả tiếng Anh
 * vào ô dịch), còn `en` thì TUYỆT ĐỐI không được có (chặn lẫn tiếng Việt vào ô Anh).
 */
const VIETNAMESE_CHARS = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ'
const VIETNAMESE_RE = new RegExp(`[${VIETNAMESE_CHARS}${VIETNAMESE_CHARS.toUpperCase()}]`)

/** Câu có chứa ít nhất một ký tự tiếng Việt có dấu hay không. */
export function hasVietnameseDiacritics(text: string): boolean {
  return VIETNAMESE_RE.test(text)
}

/**
 * Chuẩn hoá câu để so trùng: bỏ dấu câu, hạ chữ thường, gộp khoảng trắng.
 * Dùng cho bất biến "không câu nào trùng nhau trên toàn bộ 677 vòng".
 */
export function normalizeSentence(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

/** Đếm số từ của câu tiếng Anh (tách theo khoảng trắng). */
export function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length
}

/** Thoát ký tự đặc biệt của regex. */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])

/**
 * Sinh các biến thể hình thái ĐƠN GIẢN của một từ (gốc + s/es/ed/ing/ies/ied…).
 * Mục đích: câu mẫu viết tự nhiên ("She lives here") vẫn được tính là dùng từ "live"
 * của vòng. Cố tình KHÔNG dùng thư viện stemming: luật ở đây phải đọc được và đoán
 * trước được, vì nó là cơ sở của một test chặn CI.
 */
export function wordVariants(word: string): string[] {
  const base = word.trim().toLowerCase()
  const out = new Set<string>([base])
  // Chỉ suy biến thể cho từ ĐƠN thuần chữ cái (bỏ qua "dr.", "o'clock", "credit card"…).
  if (!/^[a-z]{3,}$/.test(base)) return [...out]

  out.add(`${base}s`)
  out.add(`${base}es`)
  out.add(`${base}ed`)
  out.add(`${base}d`)
  out.add(`${base}ing`)

  const last = base[base.length - 1] as string
  const secondLast = base[base.length - 2] as string

  // love → loving / loved ; make → making
  if (last === 'e') {
    const stem = base.slice(0, -1)
    out.add(`${stem}ing`)
    out.add(`${stem}ed`)
  }
  // study → studies / studied ; happy → happier / happiest
  if (last === 'y' && !VOWELS.has(secondLast)) {
    const stem = base.slice(0, -1)
    out.add(`${stem}ies`)
    out.add(`${stem}ied`)
    out.add(`${stem}ier`)
    out.add(`${stem}iest`)
  }
  // stop → stopped / stopping (phụ âm đơn sau nguyên âm đơn)
  if (!VOWELS.has(last) && last !== 'y' && last !== 'w' && VOWELS.has(secondLast)) {
    out.add(`${base}${last}ed`)
    out.add(`${base}${last}ing`)
  }
  return [...out]
}

/**
 * Trả về danh sách từ CỦA VÒNG mà câu tiếng Anh này dùng được (đã hạ chữ thường).
 * So khớp theo ranh giới không-phải-chữ-số nên "an" không khớp trong "another",
 * còn cụm nhiều từ ("credit card") và từ có dấu chấm ("dr.") vẫn khớp đúng.
 */
export function matchedCircleWords(en: string, circleWords: readonly string[]): string[] {
  const haystack = en.toLowerCase()
  const hit: string[] = []
  for (const raw of circleWords) {
    const word = raw.trim().toLowerCase()
    if (word === '') continue
    const matched = wordVariants(word).some((variant) =>
      new RegExp(`(^|[^a-z0-9])${escapeRegExp(variant)}($|[^a-z0-9])`, 'i').test(haystack),
    )
    if (matched) hit.push(word)
  }
  return hit
}
