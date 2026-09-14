// ──────────────────────────────────────────────────────────────────────────
// TEST BẤT BIẾN cho CHẤT LƯỢNG MỤC TỪ VỰNG.
//
// Vì sao có (2026-09-14): audit vòng `cefr-b2-noun-63` phát hiện người học đang
// được dạy những thứ KHÔNG PHẢI từ tiếng Anh — `los` ("thường thấy trong tên địa
// danh, ví dụ Los Angeles"), `des`, `kong`, `angeles`… Chúng lọt vào lộ trình vì
// các vòng `cefr-*` SINH TỰ ĐỘNG từ từ điển (`scripts/archive/gen-a1b2-extra-vocab.ts`
// đọc `public/data/dictionary/chunk-*.json` lọc theo `level`) — rác ở từ điển là
// rác hiện thẳng ra bài học. Tệ nhất: `des` nằm ở bậc A1, tức bài học đầu tiên.
//
// Hai bất biến dưới đây canh ĐÚNG lớp lỗi đó, ở ĐÚNG tầng nó sinh ra (từ điển),
// nên sinh lại vòng cũng không mang rác về được.
// ──────────────────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'

const DICT_DIR = path.resolve(process.cwd(), 'apps/dhcb/public/data/dictionary')

interface DictRow {
  word: string
  vi?: string
}

const dict: DictRow[] = fs
  .readdirSync(DICT_DIR)
  .filter((f) => f.startsWith('chunk-') && f.endsWith('.json'))
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(DICT_DIR, f), 'utf8')) as DictRow[])

/**
 * Các mục ĐÃ BỊ GỠ 2026-09-14 — không được quay lại.
 * 8 mục đầu là MẢNH của tên riêng (không phải danh từ tiếng Anh); `netsurfer` là
 * biến thể chính tả trùng với `net surfer` đã có; `ios` là tên hệ điều hành viết
 * thường, không phải từ vựng để học.
 */
const DA_GO = ['angeles', 'costa', 'des', 'hong', 'kong', 'las', 'los', 'york', 'netsurfer', 'ios']

/**
 * Dấu hiệu một mục TỰ NHẬN nó không phải từ tiếng Anh độc lập: phần nghĩa tiếng
 * Việt nói nó chỉ là mảnh của một tên riêng. Bắt theo LỜI GIẢI NGHĨA chứ không
 * theo danh sách từ, nên mục rác kiểu mới cũng bị chặn.
 */
const MO_TA_LA_MANH_TEN_RIENG =
  /thường thấy trong tên|tên địa danh|một phần của tên|viết tắt của tên/i

describe('Chất lượng mục từ vựng (từ điển là nguồn của mọi vòng cefr-* sinh tự động)', () => {
  it('CO_DU_LIEU — đọc được từ điển', () => {
    expect(dict.length).toBeGreaterThan(10_000)
  })

  it('KHONG_CO_MANH_TEN_RIENG — không mục nào tự nhận chỉ là mảnh của tên riêng', () => {
    const loi = dict
      .filter((e) => MO_TA_LA_MANH_TEN_RIENG.test(e.vi ?? ''))
      .map((e) => `${e.word} — "${e.vi}"`)
    expect(
      loi,
      `Đây KHÔNG phải từ tiếng Anh để học, và vòng cefr-* sinh thẳng từ từ điển nên chúng sẽ hiện ra trong bài học:\n${loi.join('\n')}`,
    ).toEqual([])
  })

  it('KHONG_MANG_LAI_MUC_DA_GO — các mục đã gỡ không quay lại', () => {
    const co = new Set(dict.map((e) => e.word.trim().toLowerCase()))
    const quayLai = DA_GO.filter((w) => co.has(w))
    expect(quayLai, `mục đã gỡ 2026-09-14 xuất hiện lại: ${quayLai.join(', ')}`).toEqual([])
  })
})
