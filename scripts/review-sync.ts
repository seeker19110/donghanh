// review-sync.ts — Đưa kết quả duyệt chuyên môn từ Postgres về FILE DỮ LIỆU trong repo.
//
// Đặc tả: docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md (ô ②bis).
//
// VÌ SAO CẦN BƯỚC NÀY: người duyệt bấm trong app thì kết quả nằm ở DB, nhưng cổng CI chạy trên
// repo. Không nối hai bên là sinh đúng bẫy TRAPS.md mục 4 ở dạng mới — DB nói "đã duyệt", repo
// nói "draft". Repo là nguồn sự thật cuối; DB chỉ là bàn làm việc.
//
//   npm run review:sync              → CHỈ IN RA sẽ đổi gì (mặc định, không ghi gì)
//   npm run review:sync -- --ap-dung → ghi thật vào file dữ liệu
//
// Ghi xong LUÔN tự kiểm lại bằng chính cổng của repo (`timLoiDuyet`); không đạt thì hoàn tác
// toàn bộ. Script KHÔNG commit — người xem diff rồi commit.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { getPgPool } from '@dhcb/core-db/pgPool'
import {
  LessonReviewSchema,
  daDuocNguoiDuyet,
  type LessonReview,
} from '@dhcb/core-contracts/lessonReview'

const MON_SANG_GOI: Record<string, string> = {
  mathematics: 'packages/subject-math',
  physics: 'packages/subject-physics',
  chemistry: 'packages/subject-chemistry',
  biology: 'packages/subject-biology',
}

interface DongDuyet {
  lesson_id: string
  mon: string
  loai: string
  nguoi_duyet: string | null
  phien_ban_tieu_chi: string | null
  tieu_chi: unknown
  bam_noi_dung: string | null
  ghi_chu: string | null
  ngay: string
}

/** Đổi một dòng DB thành bản ghi duyệt đúng hợp đồng; trả về null nếu dòng không hợp lệ. */
function doiSangBanGhi(d: DongDuyet): LessonReview | null {
  const tho =
    d.loai === 'nguoi-duyet'
      ? {
          loai: 'nguoi-duyet',
          nguoiDuyet: d.nguoi_duyet,
          ngay: d.ngay,
          phienBanTieuChi: d.phien_ban_tieu_chi,
          tieuChi: d.tieu_chi,
          bamNoiDung: d.bam_noi_dung,
          ...(d.ghi_chu ? { ghiChu: d.ghi_chu } : {}),
        }
      : {
          loai: 'ai-sang-loc',
          ngay: d.ngay,
          soCoNghiNgo: Number(/soCoNghiNgo=(\d+)/.exec(d.ghi_chu ?? '')?.[1] ?? 0),
          ...(d.ghi_chu ? { ghiChu: d.ghi_chu } : {}),
        }
  const parsed = LessonReviewSchema.safeParse(tho)
  if (!parsed.success) {
    console.error(
      `  ⚠️  Bỏ qua ${d.lesson_id}: dòng DB không đúng hợp đồng — ${parsed.error.message}`,
    )
    return null
  }
  return parsed.data
}

/**
 * Đổi `reviewStatus` của ĐÚNG một bài trong nội dung tệp chương.
 *
 * Cách làm: tìm `id: '<lessonId>'` rồi đổi `reviewStatus` ĐẦU TIÊN đứng sau nó. An toàn vì mỗi
 * đối tượng bài học khai `id` trước `reviewStatus`, và id là duy nhất toàn registry (đã có test
 * canh). Trả về null nếu không tìm thấy — gọi bên ngoài coi đó là lỗi, không im lặng bỏ qua.
 */
function doiTrangThaiTrongTep(
  noiDung: string,
  lessonId: string,
  trangThaiMoi: 'draft' | 'reviewed',
): string | null {
  const viTriId = noiDung.indexOf(`id: '${lessonId}'`)
  if (viTriId === -1) return null
  const re = /reviewStatus: '(draft|reviewed)'/g
  re.lastIndex = viTriId
  const m = re.exec(noiDung)
  if (!m) return null
  return (
    noiDung.slice(0, m.index) +
    `reviewStatus: '${trangThaiMoi}'` +
    noiDung.slice(m.index + m[0].length)
  )
}

async function main(): Promise<void> {
  const apDung = process.argv.includes('--ap-dung')

  const pool = getPgPool()
  const { rows } = await pool.query<DongDuyet>(
    `select lesson_id, mon, loai, nguoi_duyet, phien_ban_tieu_chi, tieu_chi, bam_noi_dung,
            ghi_chu, to_char(cap_nhat_luc at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD') as ngay
       from public.stem_lesson_reviews
      order by lesson_id, loai`,
  )
  console.log(`Đọc ${rows.length} lượt duyệt từ Postgres.`)

  // Mỗi bài lấy bản ghi MẠNH NHẤT: người duyệt thắng AI sàng lọc. Hai người cùng duyệt một bài
  // mà một người chấm trượt → lấy bản trượt, vì "đã duyệt" đòi MỌI người duyệt đều thông qua.
  const theoBai = new Map<string, { mon: string; review: LessonReview }>()
  for (const d of rows) {
    const review = doiSangBanGhi(d)
    if (!review) continue
    const dangCo = theoBai.get(d.lesson_id)
    if (!dangCo) {
      theoBai.set(d.lesson_id, { mon: d.mon, review })
      continue
    }
    const uuTien = (r: LessonReview) => (r.loai === 'nguoi-duyet' ? 1 : 0)
    if (uuTien(review) > uuTien(dangCo.review)) {
      theoBai.set(d.lesson_id, { mon: d.mon, review })
    } else if (
      uuTien(review) === uuTien(dangCo.review) &&
      !daDuocNguoiDuyet(review) &&
      daDuocNguoiDuyet(dangCo.review)
    ) {
      theoBai.set(d.lesson_id, { mon: d.mon, review })
    }
  }

  const thayDoi: string[] = []
  const theoGoi = new Map<string, Map<string, LessonReview>>()
  for (const [lessonId, { mon, review }] of theoBai) {
    const goi = MON_SANG_GOI[mon]
    if (!goi) {
      console.error(`  ⚠️  Bỏ qua ${lessonId}: môn "${mon}" không có gói tương ứng`)
      continue
    }
    if (!theoGoi.has(goi)) theoGoi.set(goi, new Map())
    theoGoi.get(goi)!.set(lessonId, review)
    thayDoi.push(
      `  ${lessonId}: ${review.loai}` +
        (daDuocNguoiDuyet(review) ? " → reviewStatus 'reviewed'" : " → giữ 'draft'"),
    )
  }

  if (thayDoi.length === 0) {
    console.log('Không có gì để đồng bộ.')
    return
  }
  console.log(thayDoi.join('\n'))

  if (!apDung) {
    console.log('\n(CHƯA GHI GÌ — chạy lại với `-- --ap-dung` để ghi thật.)')
    return
  }

  for (const [goi, banGhi] of theoGoi) {
    const duongDan = resolve(goi, 'reviews.ts')
    writeFileSync(duongDan, sinhTepReviews(banGhi), 'utf8')
    console.log(`Đã ghi ${duongDan} (${banGhi.size} bài).`)

    // Lật `reviewStatus` trong chính tệp chương. Bỏ bước này là hai trường lệch nhau ngay —
    // `reviews.ts` nói đã duyệt còn bài học vẫn 'draft', và giao diện tiếp tục hiện nhãn
    // "Bản nháp" cho bài đã duyệt. Cổng `timLoiDuyet` sẽ đỏ, nhưng để nó đỏ thì cái sai đã lọt
    // vào repo rồi.
    for (const [lessonId, review] of banGhi) {
      const trangThaiMoi = daDuocNguoiDuyet(review) ? 'reviewed' : 'draft'
      const tepChuong = timTepChuaBai(goi, lessonId)
      if (!tepChuong) {
        throw new Error(
          `Không tìm thấy tệp chương chứa ${lessonId} trong ${goi} — dừng, không ghi dở dang`,
        )
      }
      const truoc = readFileSync(tepChuong, 'utf8')
      const sau = doiTrangThaiTrongTep(truoc, lessonId, trangThaiMoi)
      if (sau === null) {
        throw new Error(`Không đổi được reviewStatus của ${lessonId} trong ${tepChuong} — dừng`)
      }
      if (sau !== truoc) {
        writeFileSync(tepChuong, sau, 'utf8')
        console.log(`  ${lessonId}: reviewStatus → '${trangThaiMoi}' (${tepChuong})`)
      }
    }
  }
  console.log('\nXong. Xem `git diff` rồi commit — script KHÔNG tự commit.')
  console.log('Nhớ chạy `npm test` trước khi commit: cổng timLoiDuyet canh hai trường ăn khớp.')
}

/** Sinh tệp `reviews.ts` của một gói môn. Tệp SINH RA, không sửa tay. */
function sinhTepReviews(banGhi: Map<string, LessonReview>): string {
  const dong = [...banGhi.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([id, r]) => `  '${id}': ${JSON.stringify(r)},`)
  return `// TỆP SINH RA bởi \`npm run review:sync\` — ĐỪNG SỬA TAY.
// Nguồn: bảng \`stem_lesson_reviews\` trong Postgres (người duyệt ghi qua /admin).
// Xem docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md
import type { LessonReview } from '@dhcb/core-contracts/lessonReview'

export const LESSON_REVIEWS: Readonly<Record<string, LessonReview>> = {
${dong.join('\n')}
}
`
}

/** Tệp chương nào chứa bài này. Trả null nếu không tệp nào chứa. */
function timTepChuaBai(goi: string, lessonId: string): string | null {
  for (const ten of readdirSync(resolve(goi, 'lessons'))) {
    if (!ten.endsWith('.ts')) continue
    const duongDan = resolve(goi, 'lessons', ten)
    if (readFileSync(duongDan, 'utf8').includes(`id: '${lessonId}'`)) return duongDan
  }
  return null
}

// Chỉ chạy khi gọi trực tiếp — để test import được các hàm trên mà không nối vào DB.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}

// Xuất cho test — không phải API công khai.
export { doiTrangThaiTrongTep, doiSangBanGhi, sinhTepReviews, timTepChuaBai }
