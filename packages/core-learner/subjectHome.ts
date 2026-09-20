// subjectHome.ts — MỘT nguồn sự thật cho câu hỏi "trang chủ của môn X nằm ở đâu".
//
// Vì sao có file này (slice 02 Góc học tập, `docs/specs/2026-09-15-goc-hoc-tap-02-tieng-anh-la-mot-mon.md`):
// trước đây server giữ một bảng riêng còn client thì tự ghép chuỗi ở ba nhánh `if` trong
// `Subjects.tsx` — hai bên đã lệch nhau thật. Gom về đây để mọi nơi đọc cùng một bảng.
//
// [2026-09-20] Cơ chế đa host (`hoc-tap.donghanhcungban.org`) ĐÃ GỠ: mọi môn nằm trên MỘT host,
// dưới tiền tố `/goc-hoc-tap`. Bảng dưới đây vì thế KHÔNG còn nói về host nữa — nó chỉ còn trả
// lời "môn này có TRANG CHỦ RIÊNG do app dựng (route riêng trong App.tsx) hay dùng trang chi
// tiết chung đọc manifest". `SubjectDetail.tsx` dùng đúng câu hỏi đó.

/**
 * Môn có TRANG CHỦ RIÊNG do app dựng, kèm đường dẫn của trang đó. Không có ở đây = môn dùng
 * trang chi tiết chung `/goc-hoc-tap/<mã>` (SubjectDetail, đọc manifest).
 *
 * Tên `…ON_APP_HOST` là di sản thời còn hai host — giữ nguyên để không phải đổi ~10 nơi gọi.
 */
export const SUBJECTS_ON_APP_HOST: Readonly<Record<string, string>> = {
  // Tiếng Anh là MỘT MÔN ngang hàng (quyết định chủ dự án 2026-09-15); có trang tổng quan riêng.
  english: '/goc-hoc-tap/english',
  // Lập trình có không gian hoạt động riêng (bậc, hướng, lộ trình) nên cũng có trang chủ riêng.
  programming: '/goc-hoc-tap/programming',
}

/** Môn này có trang chủ riêng do app dựng không (thay vì trang chi tiết chung)? */
export function isAppHostSubject(subjectId: string): boolean {
  return Object.prototype.hasOwnProperty.call(SUBJECTS_ON_APP_HOST, subjectId)
}

/**
 * Đường dẫn trang chủ của một môn. Mã lạ KHÔNG ném lỗi — trả `/goc-hoc-tap/<mã>` để trang
 * "không tìm thấy" của app lo.
 */
export function subjectHomePath(subjectId: string): string {
  // Tra bằng hasOwnProperty (không dùng `obj[id] ??`): `subjectHomePath('toString')` không được
  // trả về hàm kế thừa từ Object.prototype.
  return isAppHostSubject(subjectId)
    ? SUBJECTS_ON_APP_HOST[subjectId]!
    : `/goc-hoc-tap/${subjectId}`
}
