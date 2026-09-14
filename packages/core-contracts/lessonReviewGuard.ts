// lessonReviewGuard.ts — Luật ăn khớp giữa `reviewStatus` và `review`, viết MỘT lần cho 4 môn.
//
// Vì sao là hàm riêng chứ không viết thẳng trong `lessons.test.ts` của từng môn: bốn bản chép
// tay sẽ trôi khỏi nhau đúng như bốn bản cổng tự chấm đã trôi (audit 2026-09-14 tìm ra Hoá đúng,
// Toán/Lí mù, Sinh không có — xem TRAPS.md mục 4). Và để luật kiểm được bằng dữ liệu GIẢ: cổng
// chạy trên dữ liệu thật hiện xanh vì chưa bài nào được duyệt, nên chỉ ca thử dữ liệu giả mới
// chứng minh được nó có răng.
import { daDuocNguoiDuyet, type LessonReview } from './lessonReview.js'
import { bamNoiDungBaiHoc, type NoiDungCanDuyet } from './lessonReviewHash.js'

export interface BaiCoTrangThaiDuyet extends NoiDungCanDuyet {
  id: string
  reviewStatus: 'draft' | 'reviewed'
  review?: LessonReview
}

export interface LoiDuyet {
  lessonId: string
  /** 'LECH_TRANG_THAI' = hai trường không ăn khớp · 'MAY_TU_PHONG' = AI sàng lọc mà thành
   *  reviewed · 'BAM_LECH' = nội dung đã đổi kể từ lượt duyệt. */
  loai: 'LECH_TRANG_THAI' | 'MAY_TU_PHONG' | 'BAM_LECH'
  chiTiet: string
}

/** Soát một registry bài học, trả về MỌI lỗi tìm được (không dừng ở lỗi đầu — người sửa cần
 *  thấy hết trong một lượt). Mảng rỗng = sạch. */
export function timLoiDuyet(baiHoc: readonly BaiCoTrangThaiDuyet[]): LoiDuyet[] {
  const loi: LoiDuyet[] = []
  for (const bai of baiHoc) {
    const daDuyet = daDuocNguoiDuyet(bai.review)
    const ghiLaDaDuyet = bai.reviewStatus === 'reviewed'

    if (ghiLaDaDuyet !== daDuyet) {
      loi.push({
        lessonId: bai.id,
        loai: 'LECH_TRANG_THAI',
        chiTiet: `reviewStatus='${bai.reviewStatus}' nhưng bản ghi duyệt ${
          daDuyet ? 'ĐÃ đủ' : 'CHƯA đủ'
        } (review=${bai.review?.loai ?? 'không có'})`,
      })
    }

    if (bai.review?.loai === 'ai-sang-loc' && ghiLaDaDuyet) {
      loi.push({
        lessonId: bai.id,
        loai: 'MAY_TU_PHONG',
        chiTiet: 'AI sàng lọc không bao giờ được làm bài thành reviewed',
      })
    }

    if (bai.review?.loai === 'nguoi-duyet') {
      const bamHienTai = bamNoiDungBaiHoc(bai)
      if (bamHienTai !== bai.review.bamNoiDung) {
        loi.push({
          lessonId: bai.id,
          loai: 'BAM_LECH',
          chiTiet:
            `nội dung đã đổi kể từ lượt duyệt ngày ${bai.review.ngay} ` +
            `(băm lúc duyệt ${bai.review.bamNoiDung.slice(0, 12)}…, hiện tại ${bamHienTai.slice(0, 12)}…)` +
            ' — duyệt lại hoặc hạ về draft',
        })
      }
    }
  }
  return loi
}

/** Thông báo nhiều dòng cho `expect(...)`. */
export function moTaLoiDuyet(loi: readonly LoiDuyet[]): string {
  return loi.map((l) => `  • ${l.lessonId} [${l.loai}] ${l.chiTiet}`).join('\n')
}
