// feedbackCopy — chữ PHẢN HỒI người học thấy sau khi trả lời, gom về MỘT nguồn (S10b).
//
// Vì sao tách: bộ xuất "phản hồi ứng viên" cho chuyên gia chấm
// (`scripts/s10-candidate-feedback.ts`) phải dựng lại ĐÚNG chữ app đang hiện. Nếu script chép
// lại chuỗi, chuyên gia sẽ chấm một bản không còn khớp app ngay khi ai đó sửa component. Component
// và script cùng đọc từ đây; cổng `scripts/s10-candidate-feedback.test.ts` đỏ khi chữ đổi mà
// chưa sinh lại bản xuất.
//
// Đổi chữ ở đây là đổi phản hồi sư phạm — cần chuyên gia rà lại theo rubric S10
// (docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md §3).

/** Câu tự kiểm tra bài STEM (StemLessonView). Theo sau là `explain` của câu. */
export const STEM_CHECK_COPY = {
  dung: 'Đúng rồi.',
  sai: 'Chưa đúng.',
  chuaTraLoiHet: (soCau: number) => `Trả lời đủ ${soCau} câu rồi mới nộp được.`,
} as const

/** Bước "Đoán kết quả" bài Lập trình (PredictStep). Theo sau là `predict.explain`. */
export const PREDICT_COPY = {
  dung: 'Chính xác! 🎉',
  sai: 'Chưa đúng — không sao, đoán sai là lúc học được nhiều nhất.',
} as const

/** Bước "Xếp code" bài Lập trình (ParsonsStep). Chữ CỐ ĐỊNH, không theo bài. */
export const PARSONS_COPY = {
  dung: 'Đúng thứ tự! Chương trình đọc từ trên xuống đúng như bạn xếp. 🎉',
  sai: 'Chưa đúng thứ tự — để ý: khai báo/đọc dữ liệu trước, rồi if → elif → else; dòng thụt lề nằm ngay dưới điều kiện của nó.',
} as const

/** Năm trạng thái của một lượt nộp — xem ghi chú 1 ở đầu `components/learning/ActivityResult.tsx`. */
export type ActivityResultStatus = 'passed' | 'failed' | 'pending' | 'local' | 'error'

/** Vì sao lượt nộp còn nằm trên máy (khớp `PendingReason` của `lib/stemEvidence.ts`). */
export type ActivityResultPendingReason = 'offline' | 'server' | 'auth'

/** Phần dữ liệu của màn kết quả mà câu tổng kết cần — tách khỏi props UI để script dùng được. */
export interface TongKetInput {
  status: ActivityResultStatus
  correct: number
  total: number
  /**
   * Kết quả chấm TẠI CHỖ (khách / bản đang chờ gửi). Không dùng cho `passed`/`failed` — hai
   * trạng thái đó đã tự nói lên phán quyết của server.
   */
  passed?: boolean
  pendingReason?: ActivityResultPendingReason
  /** Lời từ chối của server, hiện nguyên văn khi `status === 'error'`. */
  errorMessage?: string
}

/**
 * Câu tổng kết màn kết quả (ActivityResult) theo từng trạng thái. Đây là nơi DUY NHẤT quyết
 * định người học đọc được gì về lượt nộp.
 */
export function cauTongKetKetQua(p: TongKetInput): string {
  const diem = `Đúng ${p.correct}/${p.total} câu.`
  switch (p.status) {
    case 'passed':
      return `${diem} Đã hoàn thành bài này.`
    case 'failed':
      return `${diem} Chưa đạt.`
    case 'local':
      return p.passed
        ? `${diem} Đạt — kết quả ghi trên máy này, đăng nhập để lưu vào tài khoản.`
        : `${diem} Chưa đạt — kết quả ghi trên máy này.`
    case 'pending':
      // [S09a AC06] Nói rõ lượt nộp CHƯA GỬI XONG và vì sao: mất mạng hay máy chủ lỗi là hai
      // tình huống người học phản ứng khác nhau (tìm mạng / chỉ cần chờ).
      switch (p.pendingReason) {
        case 'auth':
          return `${diem} Đăng nhập lại để lưu kết quả — bài làm đang giữ trên máy này.`
        case 'offline':
          return `${diem} Mất kết nối nên chưa gửi xong. Đã lưu trên máy này, sẽ gửi lại khi có mạng.`
        default:
          return `${diem} Máy chủ chưa nhận nên chưa gửi xong. Đã lưu trên máy này, sẽ gửi lại.`
      }
    case 'error':
      return `Không gửi được kết quả: ${p.errorMessage ?? 'máy chủ từ chối lượt nộp này'}. Phần đúng/sai từng câu ở trên vẫn xem được.`
  }
}
