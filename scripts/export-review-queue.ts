// export-review-queue.ts — Xuất DANH SÁCH CÂU HỎI TRẮC NGHIỆM chưa duyệt chuyên môn ra Markdown
// dễ đọc, để người có chuyên môn rà và điền ý kiến — KHÔNG tự phán đáp án đúng/sai, KHÔNG sửa
// bất kỳ dữ liệu câu hỏi nào (chỉ ĐỌC registry, GHI ra thư mục docs/audit/, không đụng
// packages/subject-*).
//
// Vì sao có script này (khác `review-status.ts`): `review-status.ts` chỉ ĐẾM số lượng (bao
// nhiêu bài/câu đã duyệt) — nó không giúp người rà THẤY nội dung từng câu để đọc. Hạ tầng duyệt
// chuyên môn PR #301-303 (`packages/core-contracts/lessonReview.ts`, bảng
// `stem_lesson_reviews`, API admin) ghi lại KẾT QUẢ duyệt cấp BÀI (7 tiêu chí `sinh-v1`), nhưng
// không có công cụ nào xuất nội dung câu hỏi ra file tĩnh để đọc offline/in ra giấy — đó là việc
// script này làm, không xây lại phần nào đã có.
//
//   npm run export:review-queue
//
// Xuất 4 file: docs/audit/review-queue/{toan,vat-li,hoa-hoc,sinh-hoc}.md
// Mỗi dòng bảng: lesson id · chương · số thứ tự câu (trong bài) · đề bài · các phương án ·
// đáp án hệ thống đang đánh dấu đúng · cột trống "Ý kiến chuyên gia" để điền tay.
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { MATH_LESSONS } from '@dhcb/subject-math/lessons'
import { PHYSICS_LESSONS } from '@dhcb/subject-physics/lessons'
import { CHEM_LESSONS } from '@dhcb/subject-chemistry/lessons'
import { BIOLOGY_LESSONS } from '@dhcb/subject-biology/lessons'
import { daDuocNguoiDuyet } from '@dhcb/core-contracts/lessonReview'
import type { LessonReview } from '@dhcb/core-contracts/lessonReview'
import type { StemLessonLike, StemCheckQuestion } from '@dhcb/core-contracts/stemLesson'

type BaiCoDuyet = StemLessonLike & { review?: LessonReview }

interface Mon {
  ten: string
  slug: string
  bai: readonly BaiCoDuyet[]
}

const CAC_MON: Mon[] = [
  { ten: 'Toán', slug: 'toan', bai: MATH_LESSONS as readonly BaiCoDuyet[] },
  { ten: 'Vật lí', slug: 'vat-li', bai: PHYSICS_LESSONS as readonly BaiCoDuyet[] },
  { ten: 'Hoá học', slug: 'hoa-hoc', bai: CHEM_LESSONS as readonly BaiCoDuyet[] },
  { ten: 'Sinh học', slug: 'sinh-hoc', bai: BIOLOGY_LESSONS as readonly BaiCoDuyet[] },
]

/** Bài này đã duyệt xong (đạt hết tiêu chí) chưa — tận dụng đúng hàm dùng chung, không viết
 *  lại luật ăn khớp `reviewStatus`/`review` ở đây. */
function baiChuaDuyet(bai: BaiCoDuyet): boolean {
  return !daDuocNguoiDuyet(bai.review)
}

/** Thoát ký tự `|` và xuống dòng để không vỡ bảng Markdown (đề bài/lời giải có thể chứa chúng). */
function thoatO(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')
}

/** Lấy id các phương án hệ thống đang đánh dấu đúng — chỉ áp dụng câu `answer.kind === 'choice'`. */
function idDapAnDung(cauHoi: StemCheckQuestion): readonly string[] {
  return cauHoi.answer.kind === 'choice' ? cauHoi.answer.correctIds : []
}

function dongPhuongAn(cauHoi: StemCheckQuestion): string {
  const dungIds = new Set(idDapAnDung(cauHoi))
  return (cauHoi.choices ?? [])
    .map(
      (c) => `${dungIds.has(c.id) ? '**' : ''}${c.id}. ${c.label}${dungIds.has(c.id) ? '**' : ''}`,
    )
    .join('<br>')
}

function dongDapAnDung(cauHoi: StemCheckQuestion): string {
  const ids = idDapAnDung(cauHoi)
  const nhan = new Map((cauHoi.choices ?? []).map((c) => [c.id, c.label]))
  return ids.map((id) => `${id}. ${nhan.get(id) ?? '?'}`).join('; ')
}

interface HangBang {
  lessonId: string
  chuong: string
  stt: number
  deBai: string
  phuongAn: string
  dapAnDung: string
}

function gomHangChoMon(mon: Mon): HangBang[] {
  const hang: HangBang[] = []
  for (const bai of mon.bai) {
    if (!baiChuaDuyet(bai)) continue
    const chuong = `${bai.grade}/c${bai.chapterNumber} ${bai.chapterTitle}`
    bai.checkQuestions.forEach((cauHoi, idx) => {
      if (cauHoi.answer.kind !== 'choice') return
      hang.push({
        lessonId: bai.id,
        chuong,
        stt: idx + 1,
        deBai: thoatO(cauHoi.prompt),
        phuongAn: thoatO(dongPhuongAn(cauHoi)),
        dapAnDung: thoatO(dongDapAnDung(cauHoi)),
      })
    })
  }
  return hang
}

function dungMarkdown(mon: Mon, hang: HangBang[]): string {
  const dong = [
    `# Hàng chờ duyệt chuyên môn — môn ${mon.ten}`,
    '',
    `Sinh tự động bởi \`scripts/export-review-queue.ts\` (\`npm run export:review-queue\`) — KHÔNG` +
      ' sửa tay file này, sửa xong sẽ bị ghi đè ở lần chạy sau. Chỉ liệt kê câu TRẮC NGHIỆM' +
      ' (dạng `choice`) của các bài CHƯA đạt đủ 7 tiêu chí duyệt (`packages/core-contracts/lessonReview.ts`)' +
      ' — đây là phần KHÔNG cổng máy nào thẩm định được nội dung.',
    '',
    `Tổng: **${hang.length} câu** cần rà.`,
    '',
    '| Bài (id) | Chương | Câu # | Đề bài | Phương án (in đậm = hệ thống đánh dấu đúng) | Đáp án hệ thống | Ý kiến chuyên gia |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...hang.map(
      (h) =>
        `| ${h.lessonId} | ${h.chuong} | ${h.stt} | ${h.deBai} | ${h.phuongAn} | ${h.dapAnDung} | |`,
    ),
    '',
  ]
  return dong.join('\n')
}

const THU_MUC_XUAT = path.join(process.cwd(), 'docs', 'audit', 'review-queue')
mkdirSync(THU_MUC_XUAT, { recursive: true })

console.log('XUẤT HÀNG CHỜ DUYỆT CHUYÊN MÔN (câu trắc nghiệm chưa duyệt)\n')

let tongCau = 0
for (const mon of CAC_MON) {
  const hang = gomHangChoMon(mon)
  const duongDan = path.join(THU_MUC_XUAT, `${mon.slug}.md`)
  writeFileSync(duongDan, dungMarkdown(mon, hang), 'utf-8')
  console.log(`${mon.ten.padEnd(10)} ${String(hang.length).padStart(4)} câu → ${duongDan}`)
  tongCau += hang.length
}

console.log(`\nTổng cộng: ${tongCau} câu chờ rà.`)
