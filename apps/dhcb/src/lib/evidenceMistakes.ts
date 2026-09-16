// evidenceMistakes — SỔ LỖI STEM đọc thẳng từ BẰNG CHỨNG hoàn thành (S12-2).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md AC-10, §③.3, §7 Q1.
//
// VÌ SAO KHÔNG CÓ BẢNG LỖI THỨ HAI: câu sai của bài STEM đã nằm sẵn trong
// `CompletionEvidence.items[]` — thứ do SERVER chấm, không phải client tự khai. Lập một bảng
// `mistakes` nữa nghĩa là hai đường ghi phải giữ khớp nhau mãi mãi, và chỉ cần một bên lệch
// chuẩn hoá là sổ lỗi nói khác kết quả bài làm.
//
// BA LUẬT CỦA FILE NÀY:
//  1. HÀM THUẦN. Không fetch, không đọc/ghi localStorage, không `Date.now()` ẩn. Nơi gọi đưa
//     dữ liệu đã đọc vào; nhờ vậy mọi ca biên test được.
//  2. LỖI ĐÃ SỬA THÌ BIẾN MẤT. Trả lời ĐÚNG ở một lượt MỚI HƠN sẽ gỡ mục khỏi sổ — sổ lỗi là
//     "còn sai gì", không phải nhật ký tội lỗi.
//  3. BẢN GHI HỎNG BỊ BỎ, KHÔNG NÉM. Nhật ký có thể lẫn bản ghi định dạng cũ hoặc bị sửa tay
//     trong localStorage; một bản hỏng không được làm trắng cả trang sổ lỗi.
import {
  CompletionEvidenceSchema,
  type CompletionEvidence,
} from '@dhcb/core-contracts/completionEvidence'
import type { StemSubjectId } from '@dhcb/core-contracts/stemLesson'
import { REVIEW_SPACING_MS } from './mistakes'
import { duongDanCauSaiStem } from './mistakeRoutes'

/** Một câu còn sai, dựng từ bằng chứng — KHÔNG lưu ở đâu cả, tính lại mỗi lần đọc. */
export interface MistakeEntry {
  /** `${subjectId}:${contentId}:${questionIndex}` — duy nhất trong sổ. */
  entryId: string
  subjectId: StemSubjectId
  contentId: string
  questionIndex: number
  /** Lượt sai GẦN NHẤT — đây chính là "bằng chứng". */
  attemptId: string
  evidenceKind: CompletionEvidence['evidenceKind']
  /** Mã lý do do grader ghi (`items[i].reason`). KHÔNG kéo nội dung câu hỏi vào đây. */
  reason: string
  /** Số lượt đã sai cùng câu này. */
  count: number
  lastWrongAt: number
  /**
   * S11 không sinh bằng chứng "đã ôn" nên luôn `null` trong S12; giãn cách tính từ `lastWrongAt`.
   * Giữ field để `getDueEvidenceMistakes` không phải đổi chữ ký khi có bằng chứng ôn.
   */
  lastReviewedAt: number | null
  href: string
}

/** Mốc thời gian của một lượt nộp: giờ SERVER trước, không có thì giờ máy học viên. */
function mocThoiGian(e: CompletionEvidence): number {
  const t = Date.parse(e.serverAt ?? e.clientAt)
  return Number.isFinite(t) ? t : 0
}

/**
 * Dựng sổ lỗi từ nhật ký bằng chứng của MỘT người (có thể gồm nhiều môn).
 *
 * Duyệt theo thứ tự thời gian TĂNG DẦN để "lượt mới hơn" luôn có nghĩa rõ ràng: sai thì cộng
 * dồn và giữ bằng chứng mới nhất, đúng thì gỡ mục.
 */
export function mistakesFromEvidence(evidence: readonly CompletionEvidence[]): MistakeEntry[] {
  const hopLe: CompletionEvidence[] = []
  for (const e of evidence) {
    // `safeParse` từng bản: bản thiếu field/sai kiểu bị bỏ, không ném.
    const ok = CompletionEvidenceSchema.safeParse(e)
    if (ok.success) hopLe.push(ok.data)
  }
  hopLe.sort((a, b) => mocThoiGian(a) - mocThoiGian(b))

  const theoKhoa = new Map<string, MistakeEntry>()
  for (const e of hopLe) {
    const at = mocThoiGian(e)
    for (const item of e.items) {
      const entryId = `${e.subjectId}:${e.contentId}:${item.questionIndex}`
      if (item.correct) {
        // Đã trả lời đúng ở lượt này (lượt mới hơn mọi lượt đã duyệt) → lỗi coi như đã sửa.
        theoKhoa.delete(entryId)
        continue
      }
      const cu = theoKhoa.get(entryId)
      theoKhoa.set(entryId, {
        entryId,
        subjectId: e.subjectId,
        contentId: e.contentId,
        questionIndex: item.questionIndex,
        attemptId: e.attemptId,
        evidenceKind: e.evidenceKind,
        reason: item.reason,
        count: (cu?.count ?? 0) + 1,
        lastWrongAt: at,
        lastReviewedAt: null,
        href: duongDanCauSaiStem(e.subjectId, e.contentId, item.questionIndex),
      })
    }
  }

  // Sai nhiều lần trước, rồi tới lỗi mới hơn — cùng luật sắp xếp với `getDueMistakes` môn Anh.
  return [...theoKhoa.values()].sort((a, b) => b.count - a.count || b.lastWrongAt - a.lastWrongAt)
}

/**
 * Lọc các mục ĐẾN HẠN ôn, dùng CHUNG hằng giãn cách với sổ lỗi môn Anh (`REVIEW_SPACING_MS` xuất
 * từ `lib/mistakes.ts`) — khai lại một con số thứ hai là mở đường cho hai sổ lệch hạn nhau.
 */
export function getDueEvidenceMistakes(
  entries: readonly MistakeEntry[],
  now: number,
): MistakeEntry[] {
  return entries.filter((m) =>
    m.lastReviewedAt == null ? true : now - m.lastReviewedAt >= REVIEW_SPACING_MS,
  )
}

/** Thời điểm mục đến hạn ôn — hàng đợi ôn xuyên môn (S12-1) sắp theo con số này. */
export function hanOnCuaMuc(m: MistakeEntry): number {
  return m.lastReviewedAt == null ? m.lastWrongAt : m.lastReviewedAt + REVIEW_SPACING_MS
}
