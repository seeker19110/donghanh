// ──────────────────────────────────────────────────────────────────────────
// TEST BẤT BIẾN cho CÂU MẪU của các vòng từ vựng CEFR sinh tự động.
// Đặc tả: docs/specs/2026-09-14-cau-mau-cho-vong-tu-vung-cefr.md §⑤ (10 bất biến).
//
// Hai bất biến quan trọng nhất:
//  · KHONG_DUNG_VONG_THU_CONG — golden hash khoá 89 vòng thủ công, chặn "sửa nhầm
//    phần đang tốt".
//  · PUBLIC_JSON_DONG_BO — app đọc apps/dhcb/public/data/curriculum.json qua
//    curriculumLoader.ts, nên QUÊN SINH LẠI file đó = test xanh mà người học không
//    thấy gì. Đây là cái bẫy số một của đợt việc này.
// ──────────────────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest'
import { createHash } from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { FOUNDATION } from './curriculum'
import type { Circle } from './curriculumTypes'
import {
  CEFR_CIRCLE_SENTENCES,
  CEFR_CIRCLE_SENTENCES_FILE,
  CEFR_SENTENCE_LEVELS_DONE,
} from './cefrCircleSentences'
import {
  LENGTH_BY_LEVEL,
  MAX_SENTENCES_PER_CIRCLE,
  MAX_CIRCLE_WORDS_PER_SENTENCE,
  MIN_DISTINCT_WORDS_COVERED,
  MIN_SENTENCES_PER_CIRCLE,
  countWords,
  hasVietnameseDiacritics,
  matchedCircleWords,
  normalizeSentence,
  type CefrLevelId,
} from '../lib/sentenceQuality'

/**
 * Golden hash của 89 vòng THỦ CÔNG (id + danh sách từ + câu mẫu).
 * Đo lần đầu 2026-09-14 trên nhánh sạch, TRƯỚC khi thêm câu mẫu cho vòng CEFR.
 * Hash đổi = ai đó đã đụng vào vòng thủ công → phải giải trình, KHÔNG sửa hằng số
 * này cho vừa.
 *
 * Giải trình lần đổi 2026-09-21 (docs/changelog/0406): đợt audit câu chữ toàn dự án sửa
 * bản dịch/câu mẫu của một số vòng thủ công trong `curriculum.ts` (nghĩa sai, câu tiếng Anh
 * sai ngữ pháp, chính tả Anh-Anh/Anh-Mỹ lẫn lộn) — danh sách TỪ của 89 vòng KHÔNG đổi, chỉ
 * câu mẫu/bản dịch đổi. Hash mới đo trên kết quả sau khi sửa.
 */
const GOLDEN_MANUAL_HASH = 'ca7969b3ce30bc7120e050976a4cabc9322ed344984e150812ef418e5fd91563'

/**
 * Số vòng có câu mẫu TỐI THIỂU (chống lùi độ phủ — bất biến #9).
 * Mốc cũ là 677 (89 vòng thủ công + 588 vòng cefr-*). Hạ xuống **676** ngày 2026-09-15 vì
 * TỔNG SỐ VÒNG giảm đúng 1, KHÔNG phải vì mất câu mẫu: đợt sinh lại vòng theo thang bậc đã
 * sửa gộp 3 vòng A1/A2 bị rút hết từ và thêm 2 vòng mới (B2 + C1) — xem
 * docs/audit/2026-09-15-sinh-lai-vong-theo-thang-bac.md.
 *
 * Kèm theo, bất biến này nay kiểm điều MẠNH HƠN một con số đếm: MỌI vòng đều phải có câu mẫu
 * (số vòng thiếu câu = 0). Ngưỡng đếm đơn thuần có thể xanh trong khi một vòng mới bị bỏ quên;
 * đối chiếu với TOÀN BỘ FOUNDATION thì không.
 *
 * Hạ tiếp xuống **673** ngày 2026-09-22 (docs/changelog/0409): áp sàn bậc theo tần suất cho 306
 * nhãn không có nguồn chuẩn + nối `base` cho 12 dạng chia → sinh lại vòng A1–C2, tổng vòng giảm
 * 3 (từ rời A1/A2 làm vài vòng nhỏ gộp lại). Vẫn 0 vòng thiếu câu mẫu: 208 câu cũ được gán lại
 * cho vòng mới bằng `scripts/archive/reassign-circle-sentences.ts`, 31 câu viết tay thêm.
 */
const MIN_CIRCLES_WITH_SENTENCES = 673

const PUBLIC_JSON = path.resolve(process.cwd(), 'apps/dhcb/public/data/curriculum.json')

const manualCircles = FOUNDATION.filter((c) => !c.id.startsWith('cefr-'))
const cefrCircles = FOUNDATION.filter((c) => c.id.startsWith('cefr-'))

/** 'cefr-a1-noun-1' → 'a1' */
function levelOf(circleId: string): CefrLevelId | null {
  const m = /^cefr-(a1|a2|b1|b2|c1|c2)-/.exec(circleId)
  return m ? (m[1] as CefrLevelId) : null
}

const doneLevels = new Set<CefrLevelId>(CEFR_SENTENCE_LEVELS_DONE)
const circlesOfDoneLevels = cefrCircles.filter((c) => {
  const lv = levelOf(c.id)
  return lv !== null && doneLevels.has(lv)
})

describe('Câu mẫu cho vòng từ vựng CEFR', () => {
  it('HINH_DANG_FILE — file JSON đúng hình CircleSentencesFile và mọi circleId tồn tại thật', () => {
    expect(CEFR_CIRCLE_SENTENCES_FILE.promptVersion).toBeGreaterThanOrEqual(1)
    expect(CEFR_CIRCLE_SENTENCES_FILE.generatedWith.model).not.toBe('')
    expect(CEFR_SENTENCE_LEVELS_DONE.length).toBeGreaterThanOrEqual(1)

    const knownIds = new Set(cefrCircles.map((c) => c.id))
    for (const id of Object.keys(CEFR_CIRCLE_SENTENCES)) {
      expect(knownIds.has(id), `circleId không tồn tại trong FOUNDATION: ${id}`).toBe(true)
    }
    // Khoá sắp theo thứ tự tăng dần → diff của các đợt sau đọc được.
    const keys = Object.keys(CEFR_CIRCLE_SENTENCES)
    expect(keys).toEqual([...keys].sort())
  })

  it('PHAI_DU_CAU_MAU — mọi vòng của bậc đã xong có 3–5 câu', () => {
    expect(circlesOfDoneLevels.length).toBeGreaterThan(0)
    const thieu: string[] = []
    for (const c of circlesOfDoneLevels) {
      const n = c.sentences.length
      if (n < MIN_SENTENCES_PER_CIRCLE || n > MAX_SENTENCES_PER_CIRCLE) thieu.push(`${c.id}=${n}`)
    }
    expect(thieu, `vòng sai số câu: ${thieu.join(', ')}`).toEqual([])
  })

  it('CAU_PHAI_DUNG_TU_CUA_VONG — mỗi câu chứa ≥ 1 từ của chính vòng đó', () => {
    const loi: string[] = []
    for (const c of circlesOfDoneLevels) {
      const words = c.words.map((w) => w.word)
      for (const s of c.sentences) {
        if (matchedCircleWords(s.en, words).length === 0) loi.push(`${c.id}: "${s.en}"`)
      }
    }
    expect(loi, `câu không dùng từ nào của vòng:\n${loi.join('\n')}`).toEqual([])
  })

  it('PHU_DU_TU — bộ câu của mỗi vòng phủ được ≥ 3 từ phân biệt', () => {
    const loi: string[] = []
    for (const c of circlesOfDoneLevels) {
      const words = c.words.map((w) => w.word)
      const covered = new Set<string>()
      for (const s of c.sentences) for (const w of matchedCircleWords(s.en, words)) covered.add(w)
      if (covered.size < MIN_DISTINCT_WORDS_COVERED) loi.push(`${c.id}=${covered.size}`)
    }
    expect(loi, `vòng phủ chưa đủ từ: ${loi.join(', ')}`).toEqual([])
  })

  it('KHONG_NHOI_TU — không câu nào dồn quá nhiều từ của vòng vào một câu', () => {
    const loi: string[] = []
    for (const c of circlesOfDoneLevels) {
      const words = c.words.map((w) => w.word)
      for (const s of c.sentences) {
        const n = matchedCircleWords(s.en, words).length
        if (n > MAX_CIRCLE_WORDS_PER_SENTENCE) loi.push(`${c.id} (${n} từ): "${s.en}"`)
      }
    }
    expect(
      loi,
      `câu nhồi từ (câu mẫu để RÁP CÂU tự nhiên, không phải để phủ từ):\n${loi.join('\n')}`,
    ).toEqual([])
  })

  it('SONG_NGU_DUNG_NGON_NGU — vi có dấu tiếng Việt, en không lẫn tiếng Việt', () => {
    const loi: string[] = []
    for (const c of circlesOfDoneLevels) {
      for (const s of c.sentences) {
        if (s.en.trim() === '' || s.vi.trim() === '') loi.push(`${c.id}: câu rỗng`)
        if (!hasVietnameseDiacritics(s.vi)) loi.push(`${c.id}: vi không có dấu — "${s.vi}"`)
        if (hasVietnameseDiacritics(s.en)) loi.push(`${c.id}: en lẫn tiếng Việt — "${s.en}"`)
      }
    }
    expect(loi, loi.join('\n')).toEqual([])
  })

  it('DO_DAI_THEO_BAC — số từ của câu en nằm trong khung của bậc', () => {
    const loi: string[] = []
    for (const c of circlesOfDoneLevels) {
      const lv = levelOf(c.id)
      if (lv === null) continue
      const { min, max } = LENGTH_BY_LEVEL[lv]
      for (const s of c.sentences) {
        const n = countWords(s.en)
        if (n < min || n > max) loi.push(`${c.id} (${n} từ, cần ${min}-${max}): "${s.en}"`)
      }
    }
    expect(loi, loi.join('\n')).toEqual([])
  })

  it('KHONG_TRUNG_CAU — không câu nào trùng nhau trên TOÀN BỘ các vòng', () => {
    const seen = new Map<string, string>()
    const trung: string[] = []
    for (const c of FOUNDATION) {
      for (const s of c.sentences) {
        const key = normalizeSentence(s.en)
        const truoc = seen.get(key)
        if (truoc !== undefined) trung.push(`"${s.en}" ở ${truoc} và ${c.id}`)
        else seen.set(key, c.id)
      }
    }
    expect(trung, trung.join('\n')).toEqual([])
  })

  it('KHONG_DUNG_VONG_THU_CONG — golden hash của 89 vòng thủ công không đổi', () => {
    expect(manualCircles.length).toBe(89)
    const payload = JSON.stringify(
      manualCircles.map((c) => ({
        id: c.id,
        words: c.words.map((w) => w.word),
        sentences: c.sentences,
      })),
    )
    expect(createHash('sha256').update(payload).digest('hex')).toBe(GOLDEN_MANUAL_HASH)
  })

  it('KHONG_LUI_DO_PHU — mọi vòng đều có câu mẫu, và số vòng không tụt dưới mốc', () => {
    const thieuCau = FOUNDATION.filter((c) => c.sentences.length === 0).map((c) => c.id)
    expect(thieuCau, `vòng thiếu câu mẫu: ${thieuCau.join(', ')}`).toEqual([])
    const coCau = FOUNDATION.length - thieuCau.length
    expect(coCau).toBeGreaterThanOrEqual(MIN_CIRCLES_WITH_SENTENCES)
  })

  it('PUBLIC_JSON_DONG_BO — curriculum.json (thứ app THẬT SỰ đọc) đã sinh lại', () => {
    const raw = JSON.parse(fs.readFileSync(PUBLIC_JSON, 'utf8')) as Circle[]
    expect(raw.length).toBe(FOUNDATION.length)
    const byId = new Map(raw.map((c) => [c.id, c]))

    const lech: string[] = []
    for (const c of FOUNDATION) {
      const pub = byId.get(c.id)
      if (pub === undefined) {
        lech.push(`${c.id}: thiếu trong public json`)
        continue
      }
      if (JSON.stringify(pub.sentences ?? []) !== JSON.stringify(c.sentences)) {
        lech.push(`${c.id}: câu mẫu lệch giữa nguồn và public json`)
      }
    }
    expect(
      lech,
      `Chạy lại: npx tsx scripts/archive/gen-curriculum-json.ts\n${lech.join('\n')}`,
    ).toEqual([])
  })
})
