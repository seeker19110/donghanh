// stemLessonAnchors — neo "Trong bài" của trang bài STEM (S09b).
//
// Contract: docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md §2.3.
//
// Hàm THUẦN, không đụng DOM: từ hash trên URL + hình dạng bài (bao nhiêu câu, có hoạt ảnh/thẻ ôn
// không) quyết định trang phải đưa tiêu điểm về đâu. Ba điều cố ý:
//  1. Id section CỐ ĐỊNH (không sinh từ tiêu đề hay prose) → link đã chia sẻ không gãy khi sửa chữ.
//  2. Chỉ nhận hash nằm trong DANH SÁCH TRẮNG. Hash lạ không bao giờ được dùng làm CSS selector
//     (`querySelector('#' + hash)` với chuỗi tùy ý là cửa cho lỗi cú pháp/tiêm selector); trang
//     chỉ gọi `getElementById` với id mà hàm này trả ra.
//  3. Section tùy chọn vắng mặt, câu vượt số lượng, hash hỏng → về tiêu đề bài (`tieu-de`), để
//     người học không bị bỏ lơ lửng ở đầu trang mà không biết link đã cũ.
import { neoCauHoi } from './mistakeRoutes'

/** Id các section cố định của một bài STEM (không kèm dấu `#`). */
export const NEO_TRONG_BAI = {
  dauBai: 'dau-bai',
  lyThuyet: 'ly-thuyet',
  hoatAnh: 'hoat-anh',
  viDu: 'vi-du',
  tuKiem: 'tu-kiem',
  ketQua: 'ket-qua',
  theOn: 'the-on',
} as const

export type NeoMuc = (typeof NEO_TRONG_BAI)[keyof typeof NEO_TRONG_BAI]

/** Hình dạng bài đủ để biết section nào tồn tại. */
export interface CauTrucBai {
  soCau: number
  coHoatAnh: boolean
  coTheOn: boolean
}

export interface MucTrongBai {
  id: NeoMuc
  /** Trùng đúng chữ tiêu đề đang hiện trên trang — người học thấy gì ở danh sách thì gặp đó ở bài. */
  nhan: string
}

/** Danh sách mục theo ĐÚNG thứ tự sư phạm: mở đầu → lý thuyết → (hoạt ảnh) → ví dụ → tự kiểm → kết quả → (ôn). */
export function mucTrongBai(c: CauTrucBai): MucTrongBai[] {
  const muc: MucTrongBai[] = [
    { id: NEO_TRONG_BAI.dauBai, nhan: 'Đầu bài' },
    { id: NEO_TRONG_BAI.lyThuyet, nhan: 'Lý thuyết' },
  ]
  if (c.coHoatAnh) muc.push({ id: NEO_TRONG_BAI.hoatAnh, nhan: 'Hoạt ảnh minh hoạ' })
  muc.push(
    { id: NEO_TRONG_BAI.viDu, nhan: 'Ví dụ mẫu' },
    { id: NEO_TRONG_BAI.tuKiem, nhan: 'Tự kiểm tra' },
    // "Kết quả" LUÔN có (kể cả bài không câu hỏi) — heading báo rõ trạng thái thay vì biến mất.
    { id: NEO_TRONG_BAI.ketQua, nhan: 'Kết quả' },
  )
  if (c.coTheOn) muc.push({ id: NEO_TRONG_BAI.theOn, nhan: 'Thẻ ôn tập' })
  return muc
}

/**
 * Kết quả giải hash:
 *  · `khong`   — URL không có hash: giữ hành vi mở bài hiện có, không cướp focus.
 *  · `dich`    — id đã qua danh sách trắng, chắc chắn thuộc bài này.
 *  · `tieu-de` — hash không dùng được → đưa về `<h1>` của bài hiện tại.
 */
export type DichNeo = { loai: 'khong' } | { loai: 'dich'; id: string } | { loai: 'tieu-de' }

// Đúng dạng `neoCauHoi` sinh ra: `cau-` + số nguyên dương không có số 0 đầu. Giới hạn 6 chữ số để
// chuỗi số khổng lồ không phải đi qua `Number()` (bài thật chỉ có vài câu).
const MAU_CAU = /^cau-([1-9]\d{0,5})$/

export function giaiNeoTrongBai(hash: string, c: CauTrucBai): DichNeo {
  if (hash === '' || hash === '#') return { loai: 'khong' }
  if (!hash.startsWith('#')) return { loai: 'tieu-de' }
  const id = hash.slice(1)

  if (mucTrongBai(c).some((m) => m.id === id)) return { loai: 'dich', id }

  const khop = MAU_CAU.exec(id)
  if (khop) {
    const thuTu = Number(khop[1])
    // So lại bằng `neoCauHoi` để neo trang dựng và neo được chấp nhận không bao giờ lệch nhau.
    if (thuTu <= c.soCau && neoCauHoi(thuTu - 1) === id) return { loai: 'dich', id }
  }
  return { loai: 'tieu-de' }
}
