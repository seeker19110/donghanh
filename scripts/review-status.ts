// review-status.ts — In TIẾN ĐỘ DUYỆT CHUYÊN MÔN thật, đọc thẳng từ registry.
//
// Vì sao có script này: con số nợ nội dung đã bị chép tay sai một lần (ghi "60% tổng số câu"
// trong khi thật ra 66,5% — xem docs/changelog/0300). Từ nay ai muốn biết còn bao nhiêu thì
// chạy lệnh, không chép lại từ tài liệu cũ.
//
//   npm run review:status            → bảng theo môn
//   npm run review:status -- --chuong → tách thêm theo từng chương (để chia lô)
//
// Không cần mạng, không cần DB — chỉ đọc mã nguồn.
import { MATH_LESSONS } from '@dhcb/subject-math/lessons'
import { PHYSICS_LESSONS } from '@dhcb/subject-physics/lessons'
import { CHEM_LESSONS } from '@dhcb/subject-chemistry/lessons'
import { BIOLOGY_LESSONS } from '@dhcb/subject-biology/lessons'
import { daDuocNguoiDuyet } from '@dhcb/core-contracts/lessonReview'
import type { StemLessonLike } from '@dhcb/core-contracts/stemLesson'
import type { LessonReview } from '@dhcb/core-contracts/lessonReview'

type BaiCoDuyet = StemLessonLike & { review?: LessonReview }

const MON: { ten: string; bai: readonly BaiCoDuyet[] }[] = [
  { ten: 'Toán', bai: MATH_LESSONS as readonly BaiCoDuyet[] },
  { ten: 'Vật lí', bai: PHYSICS_LESSONS as readonly BaiCoDuyet[] },
  { ten: 'Hoá học', bai: CHEM_LESSONS as readonly BaiCoDuyet[] },
  { ten: 'Sinh học', bai: BIOLOGY_LESSONS as readonly BaiCoDuyet[] },
]

interface ThongKe {
  bai: number
  baiDaDuyet: number
  cau: number
  cauTracNghiem: number
}

function dem(baiHoc: readonly BaiCoDuyet[]): ThongKe {
  const cauHoi = baiHoc.flatMap((b) => b.checkQuestions)
  return {
    bai: baiHoc.length,
    baiDaDuyet: baiHoc.filter((b) => daDuocNguoiDuyet(b.review)).length,
    cau: cauHoi.length,
    cauTracNghiem: cauHoi.filter((q) => q.answer.kind === 'choice').length,
  }
}

function phanTram(phan: number, tong: number): string {
  return tong === 0 ? '—' : `${((phan / tong) * 100).toFixed(1)}%`
}

function inHang(ten: string, t: ThongKe): void {
  console.log(
    `${ten.padEnd(10)} ${String(t.baiDaDuyet).padStart(4)}/${String(t.bai).padEnd(4)} bài đã duyệt` +
      ` (${phanTram(t.baiDaDuyet, t.bai).padStart(6)})` +
      ` · ${String(t.cauTracNghiem).padStart(4)}/${String(t.cau).padEnd(4)} câu trắc nghiệm` +
      ` (${phanTram(t.cauTracNghiem, t.cau).padStart(6)} — phần KHÔNG cổng máy nào kiểm được)`,
  )
}

const theoChuong = process.argv.includes('--chuong')

console.log('TIẾN ĐỘ DUYỆT CHUYÊN MÔN NỘI DUNG STEM')
console.log('(đọc thẳng từ registry — không chép tay)\n')

const tong: ThongKe = { bai: 0, baiDaDuyet: 0, cau: 0, cauTracNghiem: 0 }
for (const { ten, bai } of MON) {
  const t = dem(bai)
  inHang(ten, t)
  tong.bai += t.bai
  tong.baiDaDuyet += t.baiDaDuyet
  tong.cau += t.cau
  tong.cauTracNghiem += t.cauTracNghiem

  if (theoChuong) {
    const nhom = new Map<string, BaiCoDuyet[]>()
    for (const b of bai) {
      const khoa = `  ${b.grade}/c${b.chapterNumber} ${b.chapterTitle}`.slice(0, 60)
      nhom.set(khoa, [...(nhom.get(khoa) ?? []), b])
    }
    for (const [khoa, ds] of nhom) inHang(khoa, dem(ds))
    console.log('')
  }
}

console.log('')
inHang('TỔNG', tong)

if (tong.baiDaDuyet === 0) {
  console.log(
    '\n⚠️  CHƯA BÀI NÀO có người chuyên môn đọc. Cổng máy (selfGrade) kiểm được tính nhất quán\n' +
      '   và tính đúng số học, KHÔNG kiểm được nội dung dạy có đúng chương trình hay không.\n' +
      '   Quy trình duyệt: docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md',
  )
}
