// gradeReasonLabel — MỘT chỗ duy nhất đổi mã lý do của engine chấm sang chữ người học đọc được.
//
// Tách khỏi `components/learning/ActivityResult.tsx` ở S12-2: sổ lỗi (`MistakeBank`) hiện lại
// đúng những mã đó, và hai bảng chữ song song là cách chắc chắn nhất để một ngày nào đó màn kết
// quả nói "Thiếu đơn vị" còn sổ lỗi nói "MISSING_UNIT".
import type { ReasonCode } from '@dhcb/core-grading/index'

/** Mã lý do của engine chấm → chữ người học đọc được. */
export const NHAN_LY_DO: Record<ReasonCode, string> = {
  CORRECT: 'Đúng',
  CORRECT_LOOSE: 'Đúng, nhưng lệch nhẹ do làm tròn',
  WRONG_VALUE: 'Sai giá trị',
  WRONG_UNIT: 'Sai đơn vị',
  MISSING_UNIT: 'Thiếu đơn vị',
  WRONG_DIMENSION: 'Sai loại đại lượng',
  NOT_SIMPLIFIED: 'Chưa tối giản',
  SIGN_ERROR: 'Sai dấu',
  UNBALANCED_ATOMS: 'Phương trình chưa cân bằng số nguyên tử',
  UNBALANCED_CHARGE: 'Phương trình chưa cân bằng điện tích',
  WRONG_SUBSTANCES: 'Sai chất trong phương trình',
  PARSE_ERROR: 'Chưa đọc được câu trả lời',
  EMPTY: 'Chưa trả lời',
}

/**
 * Mã đi qua MẠNG nên kiểu vào là `string`: server cũ/mới có thể gửi mã chưa biết. Mã lạ trả
 * `undefined` để nơi gọi tự quyết (ẩn dòng lý do), KHÔNG in mã máy ra cho người học đọc.
 */
export function nhanLyDo(reason: string | undefined): string | undefined {
  return reason === undefined ? undefined : NHAN_LY_DO[reason as ReasonCode]
}
