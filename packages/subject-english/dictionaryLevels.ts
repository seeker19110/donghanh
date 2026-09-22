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

// ---------------------------------------------------------------------------
// Bất biến thứ ba: NHÃN KHÔNG CÓ NGUỒN phải tôn trọng SÀN BẬC THEO TẦN SUẤT.
//
// Nhãn bậc của từ điển đến từ 3 tầng (scripts/tag-cefr-levels.ts): CEFR-J/Octanove (nguồn
// chuẩn, tin) → Words-CEFR-Dataset (nội suy, tin thấp) → AI ước lượng. Đợt rà câu chữ
// 2026-09-21 (docs/changelog/0406) thấy tầng 2–3 gắn A1 cho `momentum` (hạng 12 944),
// `tenure` (12 754), `mane` (22 678), `congressional` (11 705)… — từ mà người học A1 tiếng Việt
// không thể gặp trong giáo trình nào. Cổng RARE_RANK_FLOOR (≥ 30 000) không bắt được vì các từ
// này chỉ "khá hiếm", chưa "rất hiếm".
//
// Quy tắc (chỉ áp cho mục KHÔNG có trong CEFR-J/Octanove — nhãn có nguồn chuẩn được giữ nguyên
// dù hạng thấp, vì CEFR-J chấm theo chủ đề giáo trình, xem RARE_EASY_ALLOWLIST):
//   hạng ≥ 30 000 → bậc tối thiểu C1 · ≥ 15 000 → B2 · ≥ 8 000 → B1.
// Mốc lấy từ phân bố thật của từ điển (đo lại 2026-09-22 sau đợt 0409, trên 12 153 mục): trung
// vị hạng của B1 là 6 498, của B2 là 12 675, của C1 là 17 853, của C2 là 21 652 — một từ hạng
// 8 000–15 000 nằm giữa B1 và B2, 15 000–30 000 giữa B2 và C1, ≥ 30 000 vượt cả trung vị C2
// (mốc 30 000 cũng trùng RARE_RANK_FLOOR: "rất hiếm" thì bậc thấp nhất hợp lý là C1).
// Mục biến thể (`base`) bỏ qua: bậc của nó theo từ gốc (bất biến thứ nhất).
//
// Mốc C1 thêm 2026-09-22 (đợt 0410) — nợ để mở của 0409: khi ấy sàn mới áp tới B2, nên 130 mục
// hạng ≥ 30 000 vẫn đứng B2 (`viscosity` 39 974, `urbanization` 73 622, `judiciary` 34 016).

export interface UnsourcedLevelFloor {
  minRank: number
  floor: CefrWordLevel
}

/** Sắp theo minRank GIẢM để mốc đầu tiên khớp là mốc chặt nhất. */
export const UNSOURCED_LEVEL_FLOORS: readonly UnsourcedLevelFloor[] = [
  { minRank: 30_000, floor: 'C1' },
  { minRank: 15_000, floor: 'B2' },
  { minRank: 8_000, floor: 'B1' },
]

// Ngoại lệ CÓ TÊN (không phải ngưỡng số): từ hạng thấp vì ngữ liệu viết ít dùng, nhưng người
// học nhỏ tuổi/nhập môn gặp sớm theo chủ đề gia đình, giải trí.
export const UNSOURCED_EASY_ALLOWLIST: readonly string[] = [
  'superhero::n', // truyện tranh, phim thiếu nhi — A2 hợp lý dù hạng 8 794
  'indian::adj', // tính từ quốc gia, cùng nhóm với các tính từ quốc tịch A1/A2
  'mini::adj', // tiền tố quen dùng trong tiếng Việt (mini-mart, minigame)
  // Hai mục dưới đây thêm cùng mốc C1 (2026-09-22, đợt 0410):
  'app::n', // chính hội thoại của dự án dùng 50 lần; người Việt nói nguyên chữ "app"
  'downloads::n', // số lượt tải — cùng gốc với `download` (v, A2), chỉ khác từ loại
]

/** Bậc tối thiểu theo hạng tần suất, hoặc null nếu hạng chưa chạm mốc nào. */
export function unsourcedLevelFloor(freq: number | undefined): CefrWordLevel | null {
  if (typeof freq !== 'number') return null
  for (const m of UNSOURCED_LEVEL_FLOORS) if (freq >= m.minRank) return m.floor
  return null
}

export interface UnsourcedEasyOutlier {
  word: string
  pos: string
  level: CefrWordLevel
  freq: number
  floor: CefrWordLevel
}

/**
 * Mục KHÔNG có trong nguồn chuẩn (`sourcedHeadwords` = headword CEFR-J + Octanove, chữ thường)
 * mà bậc đang gán THẤP HƠN sàn theo tần suất. Rỗng (ngoài allowlist) = đạt bất biến.
 */
export function findUnsourcedEasyOutliers(
  entries: readonly DictLevelEntry[],
  sourcedHeadwords: ReadonlySet<string>,
): UnsourcedEasyOutlier[] {
  const out: UnsourcedEasyOutlier[] = []
  for (const e of entries) {
    if (!e.level || e.base || typeof e.freq !== 'number') continue
    const word = e.word.trim().toLowerCase()
    if (sourcedHeadwords.has(word)) continue
    const floor = unsourcedLevelFloor(e.freq)
    if (!floor) continue
    if (ENTRY_LEVELS.indexOf(e.level) >= ENTRY_LEVELS.indexOf(floor)) continue
    out.push({ word: e.word, pos: e.pos, level: e.level, freq: e.freq, floor })
  }
  return out.sort((a, b) => a.word.localeCompare(b.word) || a.pos.localeCompare(b.pos))
}

/**
 * Đọc cột `headword` của một file CSV wordlist (CEFR-J / Octanove) thành tập chữ thường.
 * Headword dạng "a.m./A.M./am/AM" tách theo "/" thành từng biến thể. Trường có dấu nháy kép
 * (nghĩa chứa dấu phẩy) được tách đúng — không dùng `split(',')` thô.
 */
export function parseWordlistHeadwords(csv: string): Set<string> {
  const out = new Set<string>()
  const lines = csv.split(/\r?\n/)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    const first = readFirstCsvField(line)
    for (const h of first.split('/')) {
      const w = h.trim().toLowerCase()
      if (w) out.add(w)
    }
  }
  return out
}

function readFirstCsvField(line: string): string {
  if (!line.startsWith('"')) {
    const i = line.indexOf(',')
    return i < 0 ? line : line.slice(0, i)
  }
  let out = ''
  for (let i = 1; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (line[i + 1] === '"') {
        out += '"'
        i++
      } else break
    } else out += ch
  }
  return out
}

// ---------------------------------------------------------------------------
// Bất biến thứ tư: DẠNG CHIA KHÔNG ĐƯỢC ĐỨNG NHƯ MỘT TỪ RIÊNG.
//
// Bất biến thứ nhất chỉ so bậc của mục ĐÃ khai `base`. Nó im lặng với mục là dạng chia thật
// nhưng KHÔNG khai `base` — và chính những mục đó mới đắt: generator vòng từ vựng bỏ qua mục
// có `base`, nên mục không khai `base` trở thành MỘT THẺ TỪ VỰNG RIÊNG. Người học A1 phải học
// "bigger" như từ mới sau khi đã học "big". Đợt 0409 nối tay 12 mục (`heavier`, `posts`…), đợt
// này quét theo `forms` của từ gốc nên không còn phải nhớ bằng tay: 42 mục, 30 mục nối `base`.
//
// Nhận biết giống bất biến thứ nhất (từ gốc tự khai dạng đó trong `forms` + cùng từ loại), nên
// hai bất biến không thể mâu thuẫn nhau.
//
// Ngoại lệ là DANH SÁCH CÓ TÊN, không phải ngưỡng: dạng chia đã TỪ VỰNG HOÁ — mang nghĩa riêng
// mà từ gốc không có, nên đứng riêng là ĐÚNG (`premises` = mặt bằng ≠ `premise` = tiền đề).

export const LEXICALIZED_FORM_ALLOWLIST: readonly string[] = [
  'facilities::n', // tiện nghi / khu vệ sinh — nghĩa tập hợp, không phải "nhiều facility"
  'guts::n', // can đảm (B2) ≠ gut = ruột (C1)
  'lyrics::n', // lời bài hát ≠ lyric (thơ trữ tình)
  'nerves::n', // thần kinh, "get on my nerves" ≠ nerve = dây thần kinh đơn lẻ
  'norms::n', // chuẩn mực xã hội — luôn dùng số nhiều
  'premises::n', // mặt bằng, khuôn viên ≠ premise = tiền đề
  'provisions::n', // điều khoản (hợp đồng) ≠ provision = sự cung cấp
  'sales::n', // doanh số / ngành bán hàng ≠ sale = đợt giảm giá
  'stairs::n', // cầu thang — người Anh nói số nhiều; "stair" (một bậc) hiếm
  'terms::n', // điều khoản, "in terms of" ≠ term = học kỳ / thuật ngữ
  'trousers::n', // dạng thường dùng; "trouser" số ít chỉ gặp trong nghề may (C2)
  'utilities::n', // hoá đơn điện nước ≠ utility = tính hữu dụng
]

export interface UnlinkedInflection {
  word: string
  pos: string
  base: string
}

/**
 * Mục KHÔNG khai `base` nhưng là dạng chia được một từ gốc khác tự khai trong `forms`, cùng từ
 * loại. Rỗng (ngoài `LEXICALIZED_FORM_ALLOWLIST`) = đạt bất biến.
 */
export function findUnlinkedInflections(entries: readonly DictLevelEntry[]): UnlinkedInflection[] {
  // Chỉ mục "dạng chia đã khai → mục từ gốc khai nó", dựng MỘT lượt: quét đôi n×n trên 12 000
  // mục làm cổng chạy quá 5 giây (đã mắc lúc thêm test này).
  const declaredBy = new Map<string, DictLevelEntry[]>()
  for (const b of entries) {
    if (b.base) continue
    for (const k of FORM_KEYS) {
      const form = String(b.forms?.[k] ?? '')
        .trim()
        .toLowerCase()
      if (!form) continue
      const list = declaredBy.get(form)
      if (list) list.push(b)
      else declaredBy.set(form, [b])
    }
  }

  const out: UnlinkedInflection[] = []
  for (const e of entries) {
    if (e.base) continue
    const word = e.word.trim().toLowerCase()
    for (const b of declaredBy.get(word) ?? []) {
      if (b.pos !== e.pos || b.word.trim().toLowerCase() === word) continue
      out.push({ word: e.word, pos: e.pos, base: b.word })
    }
  }
  return out.sort((a, b) => a.word.localeCompare(b.word) || a.pos.localeCompare(b.pos))
}
