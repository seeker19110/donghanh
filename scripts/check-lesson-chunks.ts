// scripts/check-lesson-chunks.ts — Cổng kích thước CHUNK CHƯƠNG bài học STEM.
//
// VÌ SAO CÓ FILE NÀY (2026-09-14, người dùng chốt phương án (a) — xem
// `docs/specs/2026-09-14-hoat-anh-minh-hoa-stem.md` mục ④):
// Tiêu chí cũ của đặc tả là "file chương `packages/subject-*/lessons/*.ts` không vượt 120 kB
// NGUỒN". Nó đo sai chỗ, theo đúng nghĩa đen:
//
//   1. Byte mã nguồn KHÔNG phải thứ người học tải. Giữa nguồn và trình duyệt còn bundler (bỏ
//      comment, rút gọn tên) và nén brotli. Đo ngày 2026-09-14: `sinh12c1.ts` 249,6 kB nguồn
//      nhưng chunk sau build chỉ **33,7 kB brotli** — chênh hơn 7 lần.
//   2. Ngưỡng nguồn phạt nhầm thứ nên khuyến khích: comment tiếng Việt và mô tả hoạt ảnh dài
//      (bản văn bản thay thế cho người dùng trình đọc màn hình) đều tính vào byte nguồn, nhưng
//      comment thì bundler bỏ hẳn, còn mô tả thì nén rất tốt vì lặp từ.
//   3. Mốc nền của tiêu chí cũ còn ghi SAI — "hiện lớn nhất 56,7 kB" là con số của riêng môn Lí;
//      `sinh12c1.ts` khi đó đã 132 kB, tức tiêu chí đã bị vi phạm từ trước khi ai kiểm.
//
// Nên cổng này đo đúng thứ đáng đo: **kích thước chunk chương sau build, nén brotli** — bằng
// đơn vị mà `size-limit` dùng cho ngân sách bundle, để hai cổng nói cùng một ngôn ngữ.
//
// Dùng: `npm run size:chunks` (cần `dist/js/` đã build). Chạy trong CI ở job `build`.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { brotliCompressSync, constants } from 'node:zlib'

/** Trần cho MỘT chunk chương. Đặt 2026-09-14 khi mức thật cao nhất là 33,7 kB (`sinh12c1`).
 *  Đây là ngưỡng CỨNG như ratchet độ phủ: nới nó phải là quyết định có chủ đích, ghi lý do
 *  trong mô tả PR — không nới để cho một đợt việc đi qua. */
const TRAN_MOI_CHUONG_KB = 45

/** Chunk chương nhận ra bằng tên file do Vite đặt theo tên module nguồn: `sinh12c1-<hash>.js`,
 *  `ly10c3-<hash>.js`… Bốn tiền tố = 4 môn STEM. */
const TEN_CHUNK_CHUONG = /^(sinh|hoa|ly|toan)\d[\w]*-[\w-]+\.js$/

const THU_MUC = 'dist/js'

function kichThuocBrotli(duongDan: string): number {
  return brotliCompressSync(readFileSync(duongDan), {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
  }).length
}

function main(): void {
  let tenFile: string[]
  try {
    tenFile = readdirSync(THU_MUC)
  } catch {
    console.error(
      `❌ Không đọc được "${THU_MUC}". Chạy \`npm run build\` trước rồi gọi lại lệnh này.`,
    )
    process.exit(1)
  }

  const chunk = tenFile.filter((f) => TEN_CHUNK_CHUONG.test(f))
  if (chunk.length === 0) {
    // Im lặng bỏ qua là cách cổng này tự vô hiệu hoá mà không ai biết — đúng khuôn "xanh giả"
    // đã ghi ở TRAPS.md mục 3. Không tìm thấy chunk nào nghĩa là build hỏng hoặc quy ước đặt
    // tên chunk đã đổi; cả hai đều phải làm đỏ CI.
    console.error(
      `❌ Không tìm thấy chunk chương nào trong "${THU_MUC}".\n` +
        '   Hoặc build chưa chạy, hoặc quy ước đặt tên chunk đã đổi — sửa TEN_CHUNK_CHUONG.',
    )
    process.exit(1)
  }

  const do_ = chunk
    .map((f) => ({ ten: f, kb: kichThuocBrotli(join(THU_MUC, f)) / 1024 }))
    .sort((a, b) => b.kb - a.kb)

  const vuot = do_.filter((d) => d.kb > TRAN_MOI_CHUONG_KB)

  console.log(`\nKÍCH THƯỚC CHUNK CHƯƠNG BÀI HỌC (brotli, trần ${TRAN_MOI_CHUONG_KB} kB/chương):`)
  for (const d of do_.slice(0, 5)) {
    const dau = d.kb > TRAN_MOI_CHUONG_KB ? '❌' : '✅'
    console.log(
      `  ${dau} ${d.ten.padEnd(30)} ${d.kb.toFixed(1)} kB — còn ${(TRAN_MOI_CHUONG_KB - d.kb).toFixed(1)} kB`,
    )
  }
  console.log(`  … tổng ${do_.length} chunk chương, tổng cộng ${tong(do_).toFixed(1)} kB brotli`)

  if (vuot.length > 0) {
    console.error(
      `\n❌ ${vuot.length} chunk chương vượt trần ${TRAN_MOI_CHUONG_KB} kB brotli:\n` +
        vuot.map((d) => `   · ${d.ten} — ${d.kb.toFixed(1)} kB`).join('\n') +
        '\n\n   Cách xử lý ĐÚNG là tách chương thành nhiều file nguồn nhỏ hơn, không phải nới\n' +
        '   TRAN_MOI_CHUONG_KB. Một chương nặng là một lần chờ tải trên 3G của người học.',
    )
    process.exit(1)
  }
  console.log('')
}

function tong(ds: { kb: number }[]): number {
  return ds.reduce((s, d) => s + d.kb, 0)
}

main()
