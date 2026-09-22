// scripts/archive/sync-vocab-from-dictionary.ts
// ĐỒNG BỘ nghĩa/ví dụ/phiên âm của từng từ trong hai file vòng từ vựng sinh sẵn
// (src/data/cefrA1B2ExtraVocab.json, src/data/cefrC1C2Vocab.json) TỪ từ điển
// (public/data/dictionary/chunk-*.json) — GIỮ NGUYÊN thành phần và thứ tự vòng.
//
// VÌ SAO KHÔNG chạy lại gen-a1b2-extra-vocab.ts / gen-cefr-c1c2-vocab.ts: hai script đó xếp
// từ vào vòng theo CHỦ ĐỀ suy từ nghĩa tiếng Việt (scripts/lib/vocabTopics.ts), nên chỉ sửa
// nghĩa một từ cũng đủ xáo thành phần hàng chục vòng, kéo theo bộ câu mẫu VIẾT TAY theo id
// vòng (src/data/cefrCircleSentences.json) lệch hết. Phát hiện 2026-09-21 khi audit câu chữ
// (docs/changelog/0406). Script này là đường an toàn: sửa từ điển → chạy nó → vòng giữ nguyên,
// chữ trong vòng cập nhật.
//
// Chạy: npx tsx scripts/archive/sync-vocab-from-dictionary.ts
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeJsonPretty } from '../lib/writeJson.ts'
import type { DictEntry } from '../../apps/dhcb/src/types.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const DICT_DIR = path.join(ROOT, 'apps/dhcb/public/data/dictionary')
const TARGETS = [
  'apps/dhcb/src/data/cefrA1B2ExtraVocab.json',
  'apps/dhcb/src/data/cefrC1C2Vocab.json',
]
// Trường được chép từ từ điển sang (KHÔNG chép level/freq để không đổi cách xếp vòng).
const FIELDS = ['vi', 'ex_en', 'ex_vi', 'ipa_en', 'ipa_vi'] as const

const dict = new Map<string, DictEntry>()
for (const f of fs
  .readdirSync(DICT_DIR)
  .filter((n) => /^chunk-\d+\.json$/.test(n))
  .sort()) {
  const entries = JSON.parse(fs.readFileSync(path.join(DICT_DIR, f), 'utf8')) as DictEntry[]
  for (const e of entries) {
    const key = `${e.word.toLowerCase()}|${e.pos}`
    if (!dict.has(key)) dict.set(key, e) // giữ mục đầu tiên, giống thứ tự khử trùng của bộ sinh
  }
}

interface VocabWord extends Record<string, unknown> {
  word: string
  pos: string
}
interface VocabFile {
  circles: { id: string; words: VocabWord[] }[]
}

for (const rel of TARGETS) {
  const abs = path.join(ROOT, rel)
  const data = JSON.parse(fs.readFileSync(abs, 'utf8')) as VocabFile
  let changed = 0
  let missing = 0
  for (const c of data.circles) {
    for (const w of c.words) {
      const e = dict.get(`${w.word.toLowerCase()}|${w.pos}`)
      if (!e) {
        missing++
        continue
      }
      for (const k of FIELDS) {
        const v = e[k]
        if (v !== undefined && w[k] !== v) {
          w[k] = v
          changed++
        }
      }
    }
  }
  await writeJsonPretty(abs, data)
  console.log(
    `✅ ${rel}: cập nhật ${changed} trường; ${missing} từ không còn trong từ điển (giữ nguyên)`,
  )
}
