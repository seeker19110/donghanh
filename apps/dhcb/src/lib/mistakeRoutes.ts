// mistakeRoutes — MỘT bảng duy nhất trả lời "lỗi này mắc ở đâu, quay về đó bằng URL nào" (S12-2).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md AC-11, §⑥.
//
// VÌ SAO TÁCH RA: nút "Ôn lại lỗi này" có hai họ nguồn hoàn toàn khác nhau — lỗi môn Anh (mắc
// trong Chat/Viết/Nói, không neo được vào câu nào) và câu sai bài STEM (neo được tới đúng câu).
// Rải chuỗi URL trong `MistakeBank` và `evidenceMistakes` là cách chắc chắn nhất để hai chỗ lệch
// nhau khi một route đổi tên — và route ĐÃ có bẫy như vậy: màn trò chuyện là `/tro-truyen`, KHÔNG
// phải `/tro-chuyen` như tên gọi trong đặc tả (kiểm bằng `App.tsx` dòng 762).
import type { StemSubjectId } from '@dhcb/core-contracts/stemLesson'
import type { MistakeSource } from './mistakes'
import { duongDanBaiHoc } from './stemLessonRoutes'

/** Nơi mắc lỗi của sổ lỗi môn Anh → route thật trong `App.tsx`. */
export const DUONG_DAN_NGUON_LOI: Record<MistakeSource, string> = {
  chat: '/tro-truyen',
  writing: '/luyen-viet',
  speaking: '/luyen-noi',
}

/** "Ôn lại lỗi này" của một lỗi môn Anh: về đúng màn đã sinh ra nó (không có neo tới câu). */
export function duongDanOnLaiLoiAnh(source: MistakeSource): string {
  return DUONG_DAN_NGUON_LOI[source]
}

/**
 * Neo tới một câu trong bài. `questionIndex` đếm từ 0 trong dữ liệu, nhưng người học đọc "câu 1"
 * — cộng 1 ở ĐÚNG MỘT chỗ này để không nơi nào tự cộng lệch.
 */
export function neoCauHoi(questionIndex: number): string {
  return `cau-${questionIndex + 1}`
}

/**
 * "Ôn lại lỗi này" của một câu sai bài STEM: đúng bài + neo tới đúng câu.
 *
 * `title` có thì URL mang tiêu đề theo quy ước `<mã>--<slug>` (CLAUDE.md mục 7); sổ lỗi dựng từ
 * bằng chứng chỉ có `contentId` nên thường bỏ trống — trang bài vẫn tra đúng mã và tự chuẩn hoá
 * URL, nên liên kết không gãy.
 */
export function duongDanCauSaiStem(
  subjectId: StemSubjectId,
  contentId: string,
  questionIndex: number,
  title = '',
): string {
  return `${duongDanBaiHoc(subjectId, contentId, title)}#${neoCauHoi(questionIndex)}`
}
