// audit-prose — RÀ CÂU CHỮ nội dung học trên toàn dự án (bài học, hội thoại, truyện, từ vựng).
//
// VÌ SAO: các cổng hiện có chỉ kiểm KHUÔN (Zod) và code chạy đúng test-case; `audit-lessons.ts`
// kiểm tham chiếu/slug. Còn một lớp lỗi không cổng nào bắt: chính tả tiếng Việt sai chuẩn
// ("chuẩn đoán", "bổ xung", "xử dụng"…), từ lặp đôi ("của của"), dấu câu sai khoảng trắng,
// câu tiếng Việt gõ không dấu lọt vào phần chữ cho người học đọc. Máy quét này bắt lớp đó;
// phần "dễ hiểu / đúng sư phạm" vẫn phải người (hoặc AI) đọc tay — xem docs/changelog/0405.
//
// Chạy: npx tsx scripts/audit-prose.ts          (in báo cáo, thoát 0)
//       npx tsx scripts/audit-prose.ts --ci     (thoát 1 nếu còn lỗi mức LỖI)
//       npx tsx scripts/audit-prose.ts <đường dẫn...>  (chỉ quét các file/thư mục đó)
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

// ── Nguồn nội dung cần quét ──────────────────────────────────────────────────────────────
const ROOT = process.cwd()
const MAC_DINH = [
  'packages/subject-programming/lessons',
  'packages/subject-programming/specializations',
  'packages/subject-programming/courses',
  'packages/subject-programming/learningPaths',
  'packages/subject-math/lessons',
  'packages/subject-physics/lessons',
  'packages/subject-chemistry/lessons',
  'packages/subject-biology/lessons',
  'apps/dhcb/src/data',
]
const BO_QUA_TEN = /\.(test|spec)\.ts$|\.snap$|Lazy\.ts$|Loader\.ts$/

// ── Từ điển lỗi chính tả tiếng Việt hay gặp (sai → đúng). Chỉ liệt kê cặp CHẮC CHẮN sai
// trong mọi ngữ cảnh; cặp tuỳ ngữ cảnh (giả thiết/giả thuyết…) không đưa vào để tránh báo giả.
const CHINH_TA: Array<[RegExp, string]> = [
  [/(?<!\p{L})chuẩn đoán(?!\p{L})/giu, 'chẩn đoán'],
  [/(?<!\p{L})bổ xung(?!\p{L})/giu, 'bổ sung'],
  [/(?<!\p{L})xử dụng(?!\p{L})/giu, 'sử dụng'],
  [/(?<!\p{L})sử lý(?!\p{L})/giu, 'xử lý'],
  [/(?<!\p{L})xúc tích(?!\p{L})/giu, 'súc tích'],
  [/(?<!\p{L})vô hình chung(?!\p{L})/giu, 'vô hình trung'],
  [/(?<!\p{L})chín mùi(?!\p{L})/giu, 'chín muồi'],
  [/(?<!\p{L})cọ sát(?!\p{L})/giu, 'cọ xát'],
  [/(?<!\p{L})che dấu(?!\p{L})/giu, 'che giấu'],
  [/(?<!\p{L})dấu diếm(?!\p{L})/giu, 'giấu giếm'],
  [/(?<!\p{L})sáng lạng(?!\p{L})/giu, 'xán lạn'],
  [/(?<!\p{L})xán lạng(?!\p{L})/giu, 'xán lạn'],
  [
    /(?<!\p{L})bàng quang(?!\p{L})(?! (?:là|bị|của|tiết niệu|viêm|hoạt|co|căng|đầy|rỗng|và|,))/giu,
    'bàng quan (trừ nghĩa y học)',
  ],
  [/(?<!\p{L})bắt trước(?!\p{L})/giu, 'bắt chước'],
  [/(?<!\p{L})tựu chung(?!\p{L})/giu, 'tựu trung'],
  [/(?<!\p{L})lãng mạng(?!\p{L})/giu, 'lãng mạn'],
  [/(?<!\p{L})chỉnh chu(?!\p{L})/giu, 'chỉn chu'],
  [/(?<!\p{L})xuất xắc(?!\p{L})/giu, 'xuất sắc'],
  [/(?<!\p{L})suất sắc(?!\p{L})/giu, 'xuất sắc'],
  [/(?<!\p{L})sát nhập(?!\p{L})/giu, 'sáp nhập'],
  [/(?<!\p{L})đọc giả(?!\p{L})/giu, 'độc giả'],
  [/(?<!\p{L})sơ xuất(?!\p{L})/giu, 'sơ suất'],
  [/(?<!\p{L})nghành(?!\p{L})/giu, 'ngành'],
  [/(?<!\p{L})nổ lực(?!\p{L})/giu, 'nỗ lực'],
  [/(?<!\p{L})lỗ lực(?!\p{L})/giu, 'nỗ lực'],
  [/(?<!\p{L})vô vàng(?!\p{L})/giu, 'vô vàn'],
  [/(?<!\p{L})chia sẽ(?!\p{L})/giu, 'chia sẻ'],
  [/(?<!\p{L})trìu tượng(?!\p{L})/giu, 'trừu tượng'],
  [/(?<!\p{L})cổ máy(?!\p{L})/giu, 'cỗ máy'],
  [/(?<!\p{L})khẳng khái(?!\p{L})/giu, 'khảng khái'],
  [/(?<!\p{L})xãy ra(?!\p{L})/giu, 'xảy ra'],
  [/(?<!\p{L})sảy ra(?!\p{L})/giu, 'xảy ra'],
  [/(?<!\p{L})dành chiến thắng(?!\p{L})/giu, 'giành chiến thắng'],
  [/(?<!\p{L})dành được(?!\p{L})/giu, 'giành được'],
  [/(?<!\p{L})giành thời gian(?!\p{L})/giu, 'dành thời gian'],
  [/(?<!\p{L})giành cho(?!\p{L})/giu, 'dành cho'],
  [/(?<!\p{L})khuyến mại(?!\p{L})/giu, 'khuyến mãi'],
  [/(?<!\p{L})thăm quan(?!\p{L})/giu, 'tham quan'],
  [/(?<!\p{L})mãi mê(?!\p{L})/giu, 'mải mê'],
  [/(?<!\p{L})thiếu xót(?!\p{L})/giu, 'thiếu sót'],
  [/(?<!\p{L})suông sẻ(?!\p{L})/giu, 'suôn sẻ'],
  [/(?<!\p{L})suôn sẽ(?!\p{L})/giu, 'suôn sẻ'],
  [/(?<!\p{L})suôn xẻ(?!\p{L})/giu, 'suôn sẻ'],
  [/(?<!\p{L})trao dồi(?!\p{L})/giu, 'trau dồi'],
  [/(?<!\p{L})dùm(?!\p{L})/giu, 'giùm'],
  [/(?<!\p{L})phong thanh(?!\p{L})/giu, 'phong phanh'],
  [/(?<!\p{L})cập nhập(?!\p{L})/giu, 'cập nhật'],
  [/(?<!\p{L})hàm xúc(?!\p{L})/giu, 'hàm súc'],
  [/(?<!\p{L})múa mai(?!\p{L})/giu, 'mỉa mai'],
  [/(?<!\p{L})nền nếp(?!\p{L})/giu, 'nề nếp'],
  [/(?<!\p{L})đường xá(?!\p{L})/giu, 'đường sá'],
  [/(?<!\p{L})sơ xài(?!\p{L})/giu, 'sơ sài'],
  [/(?<!\p{L})sơ xuất(?!\p{L})/giu, 'sơ suất'],
  [/(?<!\p{L})trùng lập(?!\p{L})/giu, 'trùng lặp'],
  [/(?<!\p{L})chính sát(?!\p{L})/giu, 'chính xác'],
  [/(?<!\p{L})giao động(?!\p{L})/giu, 'dao động'],
  [/(?<!\p{L})dao diện(?!\p{L})/giu, 'giao diện'],
  [/(?<!\p{L})xuất sứ(?!\p{L})/giu, 'xuất xứ'],
  [/(?<!\p{L})suất xứ(?!\p{L})/giu, 'xuất xứ'],
  [/(?<!\p{L})khuông khổ(?!\p{L})/giu, 'khuôn khổ'],
  [/(?<!\p{L})xuyên xuốt(?!\p{L})/giu, 'xuyên suốt'],
  [/(?<!\p{L})suyên suốt(?!\p{L})/giu, 'xuyên suốt'],
  [/(?<!\p{L})nhận nhiệm(?!\p{L})/giu, 'nhậm chức/nhận nhiệm vụ'],
  [/(?<!\p{L})chăm xóc(?!\p{L})/giu, 'chăm sóc'],
  [/(?<!\p{L})dục giã(?!\p{L})/giu, 'giục giã'],
  [/(?<!\p{L})thúc dục(?!\p{L})/giu, 'thúc giục'],
  [/(?<!\p{L})năng xuất(?!\p{L})/giu, 'năng suất'],
  [/(?<!\p{L})sản suất(?!\p{L})/giu, 'sản xuất'],
  [/(?<!\p{L})suất bản(?!\p{L})/giu, 'xuất bản'],
  [/(?<!\p{L})suất hiện(?!\p{L})/giu, 'xuất hiện'],
  [/(?<!\p{L})suất phát(?!\p{L})/giu, 'xuất phát'],
  [/(?<!\p{L})tỷ mỷ(?!\p{L})/giu, 'tỉ mỉ'],
  [/(?<!\p{L})xem sét(?!\p{L})/giu, 'xem xét'],
  [/(?<!\p{L})sem xét(?!\p{L})/giu, 'xem xét'],
  [/(?<!\p{L})khả rĩ(?!\p{L})/giu, 'khả dĩ'],
  [/(?<!\p{L})khả gi(?!\p{L})/giu, 'khả dĩ'],
  [/(?<!\p{L})xoay sở(?!\p{L})/giu, 'xoay xở'],
  [/(?<!\p{L})soay sở(?!\p{L})/giu, 'xoay xở'],
  [/(?<!\p{L})sắp sếp(?!\p{L})/giu, 'sắp xếp'],
  [/(?<!\p{L})xắp xếp(?!\p{L})/giu, 'sắp xếp'],
  [/(?<!\p{L})tập chung(?!\p{L})/giu, 'tập trung'],
  [/(?<!\p{L})nổi bậc(?!\p{L})/giu, 'nổi bật'],
  [/(?<!\p{L})vất vã(?!\p{L})/giu, 'vất vả'],
  [/(?<!\p{L})nghĩ ngơi(?!\p{L})/giu, 'nghỉ ngơi'],
  [/(?<!\p{L})mệt mõi(?!\p{L})/giu, 'mệt mỏi'],
  [/(?<!\p{L})cố gắn(?!\p{L})/giu, 'cố gắng'],
  [/(?<!\p{L})dản dị(?!\p{L})/giu, 'giản dị'],
  [/(?<!\p{L})hàng số(?!\p{L})/giu, 'hằng số'],
  [/(?<!\p{L})hằng đợi(?!\p{L})/giu, 'hàng đợi'],
  [/(?<!\p{L})ngoại lệch(?!\p{L})/giu, 'ngoại lệ'],
  [/(?<!\p{L})khoảng khắc(?!\p{L})/giu, 'khoảnh khắc'],
  [/(?<!\p{L})mãng nhãn(?!\p{L})/giu, 'mãn nhãn'],
  [/(?<!\p{L})máy mốc(?!\p{L})/giu, 'máy móc'],
  [/(?<!\p{L})cứng ngắt(?!\p{L})/giu, 'cứng nhắc'],
  [/(?<!\p{L})thiển cẩn(?!\p{L})/giu, 'thiển cận'],
  [/(?<!\p{L})cẩn thẩn(?!\p{L})/giu, 'cẩn thận'],
  [/(?<!\p{L})cận thận(?!\p{L})/giu, 'cẩn thận'],
  [/(?<!\p{L})đãm bảo(?!\p{L})/giu, 'đảm bảo'],
  [/(?<!\p{L})bão đảm(?!\p{L})/giu, 'bảo đảm'],
  [/(?<!\p{L})câu truyện(?!\p{L})/giu, 'câu chuyện'],
  [/(?<!\p{L})chuyện tranh(?!\p{L})/giu, 'truyện tranh'],
  [/(?<!\p{L})cuốn chuyện(?!\p{L})/giu, 'cuốn truyện'],
  [/(?<!\p{L})quyển chuyện(?!\p{L})/giu, 'quyển truyện'],
  [/(?<!\p{L})kể truyện(?!\p{L})/giu, 'kể chuyện'],
  [/(?<!\p{L})nói truyện(?!\p{L})/giu, 'nói chuyện'],
  [/(?<!\p{L})trò truyện(?!\p{L})/giu, 'trò chuyện'],
]
const CHINH_TA_SAI = CHINH_TA

// Dấu hiệu tiếng Việt gõ KHÔNG DẤU (chỉ tin khi có ≥ 4 từ khác nhau trong cùng chuỗi).
const VIET_KHONG_DAU = [
  'khong',
  'duoc',
  'nhung',
  'phai',
  'cua',
  'trong',
  'ngoai',
  'nguoi',
  'moi',
  'nay',
  'roi',
  'truoc',
  'sau',
  'bang',
  'nhieu',
  'hon',
  'thi',
  'neu',
  'lam',
  'dung',
  'sai',
  'ket qua',
  'chay',
]
// Dấu hiệu chuỗi là CODE (được phép không dấu theo luật soạn bài Pyodide/CI).
const CODE_SIGN =
  /[=(){}[\];]|\bprint\b|\bconsole\.|\bdef\b|\bfunction\b|\bfor\b.*\bin\b|\breturn\b|<\/?\w+>|^\s*(#|\/\/)/m

// ── Kết quả ─────────────────────────────────────────────────────────────────────────────
type Muc = 'LOI' | 'CANH_BAO'
interface Phat {
  muc: Muc
  ma: string
  file: string
  dong: number
  moTa: string
}
const phat: Phat[] = []
const ghi = (muc: Muc, ma: string, file: string, dong: number, moTa: string) =>
  phat.push({ muc, ma, file, dong, moTa })

// ── Trích chuỗi văn xuôi từ file ────────────────────────────────────────────────────────
interface Chuoi {
  text: string
  dong: number
}

function trichTs(src: string): Chuoi[] {
  // Chỉ lấy chuỗi nháy đơn/kép (văn xuôi của bài học). Template literal (`...`) hầu hết là
  // code mẫu → bỏ qua; chuỗi có dấu hiệu code cũng bỏ ở bước kiểm.
  const ra: Chuoi[] = []
  const re = /'((?:\\.|[^'\\\n])*)'|"((?:\\.|[^"\\\n])*)"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    const text = (m[1] ?? m[2] ?? '')
      .replace(/\\n/g, '\n')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
    if (text.length < 12) continue
    const dong = src.slice(0, m.index).split('\n').length
    ra.push({ text, dong })
  }
  return ra
}

function trichJson(src: string): Chuoi[] {
  const ra: Chuoi[] = []
  const re = /"((?:\\.|[^"\\])*)"\s*(?=[,\]}])/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    let text: string
    try {
      text = JSON.parse(`"${m[1]}"`) as string
    } catch {
      continue
    }
    if (text.length < 12) continue
    const dong = src.slice(0, m.index).split('\n').length
    ra.push({ text, dong })
  }
  return ra
}

// ── Kiểm một chuỗi ──────────────────────────────────────────────────────────────────────
function kiem(file: string, c: Chuoi) {
  const t = c.text
  const laCode = CODE_SIGN.test(t)

  for (const [re, dung] of CHINH_TA_SAI) {
    re.lastIndex = 0
    const m = re.exec(t)
    if (m) ghi('LOI', 'CHINH_TA', file, c.dong, `"${m[0]}" → "${dung}"`)
  }

  if (!laCode) {
    // Từ lặp đôi: "của của", "là là" (bỏ qua từ láy hợp lệ có trong danh sách).
    const layHopLe = new Set([
      'xa',
      'dần',
      'từ',
      'lâu',
      'nhanh',
      'chậm',
      'nhỏ',
      'to',
      'ngày',
      'đêm',
      'người',
      'ai',
      'gì',
      'nào',
      'đâu',
      'mãi',
      'thật',
      'luôn',
      'rất',
      'ha',
      'hi',
      'hu',
      'ho',
      'rồi',
      'đi',
      'nhé',
      'ừ',
      'ồ',
      'à',
      'ơ',
      'không',
      'có',
      'no',
      'yes',
      'bye',
      'very',
      'so',
      'go',
      'ok',
      'well',
      'that',
      'is',
      'blah',
      'la',
      'na',
      'nay',
      'thôi',
      'thêm',
      'nữa',
      'lần',
      'bước',
      'mỗi',
      'từng',
      'đều',
      'cùng',
      'sao',
      'bao',
      'chờ',
      'chạy',
      'chăm',
      'đúng',
      'ừm',
      'ừ',
      'hmm',
      'ai',
      'kìa',
    ])
    const lap = /(?<!\p{L})([\p{L}]{2,})\s+\1(?!\p{L})/giu
    let m: RegExpExecArray | null
    while ((m = lap.exec(t))) {
      if (layHopLe.has(m[1].toLowerCase())) continue
      ghi('CANH_BAO', 'TU_LAP', file, c.dong, `từ lặp đôi "${m[0]}"`)
    }
    // Khoảng trắng trước dấu câu / thiếu khoảng trắng sau dấu phẩy giữa hai chữ cái.
    if (/[\p{L}\p{N}] [,;:?!.](?:\s|$)/u.test(t))
      ghi('CANH_BAO', 'DAU_CAU', file, c.dong, 'khoảng trắng THỪA trước dấu câu')
    if (
      /\p{L}[,;]\p{L}/u.test(t) &&
      !/\d,\d/.test(t) &&
      !/\w+,\w+,\w+/.test(t) &&
      !/\w+:\w+,/.test(t)
    )
      ghi('CANH_BAO', 'DAU_CAU', file, c.dong, 'thiếu khoảng trắng sau dấu phẩy')
    if (/  +/.test(t.replace(/\n */g, '')))
      ghi('CANH_BAO', 'DAU_CAU', file, c.dong, 'hai khoảng trắng liền nhau')
    if (/[?!]{2,}|\.{4,}/.test(t) && !/`[^`]*!![^`]*`/.test(t))
      ghi('CANH_BAO', 'DAU_CAU', file, c.dong, 'dấu câu lặp (!!, ??, ....)')

    // Tiếng Việt không dấu trong văn xuôi.
    const thuong = ` ${t.toLowerCase()} `
    const trung = VIET_KHONG_DAU.filter((w) => thuong.includes(` ${w} `))
    if (trung.length >= 4 && !/[àáảãạăâđèéẻẽẹêìíỉĩịòóỏõọôơùúủũụưỳýỷỹỵ]/i.test(t))
      ghi(
        'LOI',
        'KHONG_DAU',
        file,
        c.dong,
        `tiếng Việt không dấu: ${trung.slice(0, 4).join(', ')}…`,
      )

    // Chỗ soạn dở.
    if (/\bTODO\b|\bTBD\b|\bFIXME\b|\bXXX\b|\blorem ipsum\b/i.test(t))
      ghi('LOI', 'SOAN_DO', file, c.dong, 'còn dấu TODO/TBD/FIXME/lorem ipsum')
  }
}

// ── Duyệt file ──────────────────────────────────────────────────────────────────────────
function duyet(duong: string) {
  const st = statSync(duong)
  if (st.isDirectory()) {
    for (const ten of readdirSync(duong)) duyet(join(duong, ten))
    return
  }
  if (BO_QUA_TEN.test(duong)) return
  const rel = relative(ROOT, duong)
  if (duong.endsWith('.ts')) {
    const src = readFileSync(duong, 'utf8')
    for (const c of trichTs(src)) kiem(rel, c)
  } else if (duong.endsWith('.json')) {
    const src = readFileSync(duong, 'utf8')
    for (const c of trichJson(src)) kiem(rel, c)
  }
}

const args = process.argv.slice(2)
const ci = args.includes('--ci')
const dauVao = args.filter((a) => !a.startsWith('--'))
for (const d of dauVao.length ? dauVao : MAC_DINH) {
  try {
    duyet(join(ROOT, d))
  } catch {
    // thư mục không tồn tại → bỏ qua (gói môn có thể chưa có)
  }
}

// ── Báo cáo ─────────────────────────────────────────────────────────────────────────────
const loi = phat.filter((p) => p.muc === 'LOI')
const canhBao = phat.filter((p) => p.muc === 'CANH_BAO')
const in_ = (p: Phat) =>
  console.log(`${p.muc === 'LOI' ? '✖' : '△'} [${p.ma}] ${p.file}:${p.dong} — ${p.moTa}`)
for (const p of loi) in_(p)
if (!ci) for (const p of canhBao) in_(p)
console.log(`\nTổng: ${loi.length} lỗi, ${canhBao.length} cảnh báo.`)
if (ci && loi.length > 0) process.exit(1)
