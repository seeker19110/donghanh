// ──────────────────────────────────────────────────────────────────────────
// Wrapper typed cho CÂU MẪU của các vòng từ vựng CEFR sinh tự động
// (`cefrCircleSentences.json`). Đúng khuôn hai wrapper hàng xóm
// `cefrC1C2Vocab.ts` / `cefrA1B2ExtraVocab.ts`.
//
// Vì sao cần file này: mỗi vòng `cefr-*` vốn có `sentences: []`, nên người học hết
// 89 vòng nền tảng là MẤT hẳn phần "ráp câu từ những từ vừa học". File JSON kèm
// theo lấp đúng khoảng trống đó, và được ghép vào vòng ở ĐÚNG MỘT chỗ:
// phần dựng `FOUNDATION` ở cuối `curriculum.ts`.
//
// JSON thô không có kiểu → validate lúc chạy bằng Zod (CLAUDE.md §4.1).
// ──────────────────────────────────────────────────────────────────────────
import { z } from 'zod'
import data from './cefrCircleSentences.json'
import type { CefrLevelId } from '../lib/sentenceQuality'

const sentenceSchema = z.object({
  en: z.string().min(1),
  vi: z.string().min(1),
})

const fileSchema = z.object({
  /** Phiên bản "công thức" đã sinh ra dữ liệu này — đổi cách viết câu thì tăng số. */
  promptVersion: z.number().int().positive(),
  /** Nguồn gốc để truy vết: viết tay hay model nào, ngày nào. */
  generatedWith: z.object({ model: z.string().min(1), date: z.string().min(1) }),
  /** Các bậc CEFR đã hoàn tất — test bất biến chỉ ép đúng những bậc này. */
  levelsDone: z.array(z.enum(['a1', 'a2', 'b1', 'b2', 'c1', 'c2'])).min(1),
  /** circleId → 3–5 câu song ngữ. */
  sentences: z.record(z.string(), z.array(sentenceSchema)),
})

export type CircleSentencesFile = z.infer<typeof fileSchema>

export const CEFR_CIRCLE_SENTENCES_FILE: CircleSentencesFile = fileSchema.parse(data)

/** Bản đồ `circleId → câu[]`. */
export const CEFR_CIRCLE_SENTENCES: Record<string, { en: string; vi: string }[]> =
  CEFR_CIRCLE_SENTENCES_FILE.sentences

/** Các bậc CEFR đã có câu mẫu đầy đủ. */
export const CEFR_SENTENCE_LEVELS_DONE: CefrLevelId[] = CEFR_CIRCLE_SENTENCES_FILE.levelsDone
