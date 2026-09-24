// stemResultView — kết quả một lượt nộp bài STEM → props của màn kết quả dùng chung.
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md AC-14 (slice S11-3);
// định danh câu + trạng thái "chưa có kết quả": docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md
// §2.4 (slice S09a).
//
// Hàm THUẦN, để riêng khỏi trang: nhờ vậy nó test được trong mili giây mà không phải dựng cả
// trang bài học, và chỗ duy nhất quyết định "kind nào ra trạng thái nào" nằm gọn một chỗ, đọc
// một lượt là thấy đủ năm nhánh.
import type { StemLessonLike } from '@dhcb/core-contracts/stemLesson'
import type { ActivityResultItem, ActivityResultProps } from '../components/learning/ActivityResult'
import type { SubmitEvidenceResult } from './stemEvidence'
import { neoCauHoi } from './mistakeRoutes'

/**
 * Kết quả nộp (hợp đồng của `lib/stemEvidence.ts`) → props của màn kết quả dùng chung.
 *
 * Tách thành hàm THUẦN để test được không cần dựng trang, và để chỗ duy nhất quyết định
 * "kind nào ra trạng thái nào" nằm cạnh nhau, đọc một lượt là thấy đủ năm nhánh.
 *
 * Bất biến: `passed`/`failed` CHỈ đến từ `kind === 'server'` — tức từ phán quyết của máy chủ.
 * Bản chấm ở máy luôn là `local`/`pending`, và màn kết quả nói ra điều đó bằng chữ.
 */
export function ketQuaSangManHinh(
  ketQua: SubmitEvidenceResult,
  bai: StemLessonLike,
  daTraLoi: Readonly<Record<string, string>>,
): ActivityResultProps {
  if (ketQua.kind === 'rejected') {
    return { status: 'error', errorMessage: ketQua.error, correct: 0, total: 0, items: [] }
  }

  const { correct, total, passed, items } = ketQua.evidence
  // Câu hỏi là của BÀI, còn đúng/sai là của lượt chấm — ghép theo `questionIndex` chứ không
  // theo thứ tự mảng: server có thể trả thiếu (bản ghi cũ) và không được lệch hàng vì thế.
  // Duyệt theo câu CỦA BÀI nên index lạ (ngoài bài, âm, số lẻ) tự rơi ra ngoài, không bao giờ
  // bị ghép nhầm vào một câu khác.
  const theoCau = new Map(items.map((it) => [it.questionIndex, it]))
  const chiTiet: ActivityResultItem[] =
    items.length === 0
      ? []
      : bai.checkQuestions.map((cau, i) => {
          const it = theoCau.get(i)
          const raw = (daTraLoi[String(i)] ?? '').trim()
          // Trắc nghiệm lưu ID lựa chọn, nhưng người học nhớ NHÃN — hiện nhãn, không hiện id.
          const nhan = cau.choices?.find((c) => c.id === raw)?.label ?? raw
          return {
            // [S09a] Mang index GỐC (0-based) + định danh theo bài: màn hình sắp xếp lại thế
            // nào thì "Câu N" và neo `#cau-N` vẫn trỏ đúng câu của bài.
            questionIndex: i,
            id: `${bai.id}#${neoCauHoi(i)}`,
            prompt: cau.prompt,
            yourAnswer: nhan,
            // THIẾU bản ghi ≠ SAI: `null` là "chưa có kết quả câu này". Trước S09a chỗ này là
            // `it?.correct === true`, biến dữ liệu thiếu thành lỗi kiến thức của người học.
            correct: it ? it.correct : null,
            // Câu chưa có kết quả thì không kèm lý do hay lời giải — không suy diễn điều server
            // chưa nói.
            ...(it && cau.explain ? { explain: cau.explain } : {}),
            ...(it ? { reason: it.reason } : {}),
          }
        })

  const chung = { correct, total, items: chiTiet }
  if (ketQua.kind === 'server') {
    return { ...chung, status: passed ? 'passed' : 'failed' }
  }
  if (ketQua.kind === 'local') return { ...chung, status: 'local', passed }
  return { ...chung, status: 'pending', passed, pendingReason: ketQua.reason }
}
