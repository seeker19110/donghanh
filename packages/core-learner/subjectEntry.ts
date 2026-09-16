// subjectEntry.ts — MỘT nguồn danh mục môn cho hub (apps/hub) và app nền tảng (apps/dhcb).
//
// Vì sao có file này (S05-2, docs/specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md §③.6):
// trước đây hub (`apps/hub/src/App.tsx`) khai lại tay 6 môn (id/nhãn/thứ tự/trạng thái) và
// `Home.tsx` của app cũng khai riêng — hai nơi lệch nhau (hub từng nói STEM "đang xây" trong khi
// app đã phục vụ hàng trăm bài nháp). File này suy TOÀN BỘ id/nhãn/thứ tự trực tiếp từ
// `SUPPORTED_SUBJECTS` (nguồn sự thật cũ), cộng thêm `ctaPath` (từ `subjectHomePath`, đã có sẵn
// và được `scripts/hub-links.test.ts` canh) và `status` hiển thị.
//
// Hub KHÔNG import gói `@dhcb/*` (apps/hub/tsconfig.json) nên không đọc trực tiếp file này —
// `scripts/gen-subject-catalog.ts` sinh một bản dữ liệu thuần `apps/hub/src/subjectsCatalog.generated.ts`
// từ đây. App (`Home.tsx`) import thẳng.
import { SUPPORTED_SUBJECTS } from './subjectRegistry.js'
import { subjectHomePath } from './subjectHome.js'

/**
 * Trạng thái hiển thị của môn trong danh mục:
 * - 'live'     — không gian hoạt động đầy đủ (english, programming).
 * - 'preview'  — có bài học thật để xem/học nhưng đang hoàn thiện dần (4 môn STEM: hàng trăm
 *   bài `draft` đã phục vụ ở `/goc-hoc-tap/<id>/bai-hoc`, xem Q5 của spec S05).
 * - 'building' — chưa có nội dung để bấm vào (dự phòng, hiện KHÔNG môn nào ở trạng thái này).
 */
export type SubjectEntryStatus = 'live' | 'preview' | 'building'

export interface SubjectEntry {
  /** Id môn — đúng tập id của `SUPPORTED_SUBJECTS`. */
  id: string
  /** Nhãn hiển thị — lấy NGUYÊN VĂN `manifest.label`, không rút gọn/đổi chữ ở đây. */
  label: string
  /** Vị trí trong danh mục, 0-based, đúng thứ tự `SUPPORTED_SUBJECTS`. */
  order: number
  /** Route nội bộ app dẫn tới trang tổng quan/hoạt động của môn. */
  ctaPath: string
  status: SubjectEntryStatus
}

/** Môn nào đang ở trạng thái 'preview' (Q5) — english/programming coi là 'live'. */
const PREVIEW_SUBJECT_IDS = new Set(['mathematics', 'physics', 'chemistry', 'biology'])

function statusOf(subjectId: string): SubjectEntryStatus {
  return PREVIEW_SUBJECT_IDS.has(subjectId) ? 'preview' : 'live'
}

/** Danh mục môn dùng chung cho hub và app — suy trực tiếp từ `SUPPORTED_SUBJECTS`. */
export const SUBJECT_ENTRIES: readonly SubjectEntry[] = SUPPORTED_SUBJECTS.map(
  (manifest, order): SubjectEntry => ({
    id: manifest.id,
    label: manifest.label,
    order,
    ctaPath: subjectHomePath(manifest.id),
    status: statusOf(manifest.id),
  }),
)
