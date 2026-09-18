// subjectHome.ts — MỘT nguồn sự thật cho câu hỏi "trang chủ của môn X nằm ở đâu, thuộc host nào".
//
// Vì sao có file này (slice 02 Góc học tập, `docs/specs/2026-09-15-goc-hoc-tap-02-tieng-anh-la-mot-mon.md`):
// trước đây server (`apps/server/src/subjectsRouting.ts`) giữ một bảng `SUBJECTS_WITH_OWN_SPACE`
// riêng, còn client thì tự ghép chuỗi ở ba nhánh `if` trong `Subjects.tsx` — hai bên đã lệch nhau
// thật: trên host Góc học tập, client `navigate('/hoc-tieng-anh')` tại chỗ trong khi server coi
// đường đó thuộc app host, nên người đã đăng nhập bị đưa sang một origin có localStorage trống
// và thành khách. Gom về đây để cả hai bên đọc cùng một bảng.
//
// Quy ước ownership (spec cha §③ + slice 02 §③):
//   · Danh mục `/goc-hoc-tap` và trang môn STEM `/goc-hoc-tap/<mã>` → host Góc học tập (khi bật).
//   · Môn có KHÔNG GIAN HOẠT ĐỘNG riêng (dữ liệu học ghi ở origin app) → app host.

/** Môn thuộc APP HOST, kèm đường dẫn trang chủ của môn. Không có ở đây = môn thuộc danh mục. */
export const SUBJECTS_ON_APP_HOST: Readonly<Record<string, string>> = {
  // Tiếng Anh là MỘT MÔN ngang hàng (quyết định chủ dự án 2026-09-15); trang tổng quan nằm dưới
  // tiền tố Góc học tập nhưng dữ liệu hoạt động (từ vựng, SRS, token…) sống ở origin app.
  english: '/goc-hoc-tap/english',
  // Lập trình là môn hoạt động riêng trên app host, dưới tiền tố Góc học tập.
  programming: '/goc-hoc-tap/programming',
}

/** Môn này có trang chủ ở app host không (thay vì host Góc học tập). */
export function isAppHostSubject(subjectId: string): boolean {
  return Object.prototype.hasOwnProperty.call(SUBJECTS_ON_APP_HOST, subjectId)
}

/**
 * Đường dẫn trang chủ của một môn. Mã lạ KHÔNG ném lỗi — trả `/goc-hoc-tap/<mã>` để trang
 * "không tìm thấy" của app lo (cùng luật với slice 01: không đẩy rác sang host kia).
 */
export function subjectHomePath(subjectId: string): string {
  // Tra bằng hasOwnProperty (không dùng `obj[id] ??`): `subjectHomePath('toString')` không được
  // trả về hàm kế thừa từ Object.prototype.
  return isAppHostSubject(subjectId)
    ? SUBJECTS_ON_APP_HOST[subjectId]!
    : `/goc-hoc-tap/${subjectId}`
}
