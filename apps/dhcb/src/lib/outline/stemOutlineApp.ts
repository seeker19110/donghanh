// stemOutlineApp — nối adapter cây STEM (ở `@dhcb/core-learner`) với dữ liệu của app.
//
// Adapter sống trong `packages/` nên KHÔNG được import `apps/` (luật phụ thuộc của dự án):
// nó nhận hàm dựng URL và nhãn cấp HSG từ ngoài. Hai thứ đó nằm ở `lib/stemLessonRoutes.ts`,
// nên chỗ ghép lại phải là app — và phải là ĐÚNG MỘT chỗ, nếu không hai trang STEM sẽ dựng
// hai cây khác nhau cho cùng một môn.
import type { Outline } from '@dhcb/core-contracts/outline'
import type { StemSubjectId } from '@dhcb/core-contracts/stemLesson'
import type { CompletionState } from '@dhcb/core-contracts/completionEvidence'
import { buildStemOutline } from '@dhcb/core-learner/outline/stemOutline'
import { duongDanBaiHoc, nhanCapHsg, type StemSubject } from '../stemLessonRoutes'

/**
 * [S11-3] Lớp TIẾN ĐỘ đắp lên cây — tách hẳn khỏi cấu trúc cây.
 *
 * Cấu trúc dựng đồng bộ từ chỉ mục nên có ngay từ khung hình đầu; tiến độ đến từ mạng nên có
 * thể đến muộn hoặc không đến. Giữ hai thứ rời nhau là lý do mục lục vẫn bấm được khi mạng
 * chập chờn, và là lý do `stateStatus` phải đi kèm `state` chứ không suy ra từ map rỗng.
 */
export interface StemTienDoCtx {
  state: ReadonlyMap<string, CompletionState>
  stateStatus: 'loading' | 'ready' | 'error'
}

/** Cây một lớp của một môn STEM, đã gắn URL thật và nhãn tiếng Việt của cấp HSG. */
export function buildStemOutlineForApp(
  subject: StemSubject,
  grade: string,
  tienDo?: StemTienDoCtx,
): Outline | undefined {
  const outline = buildStemOutline(subject.id, grade, {
    loader: subject.loader,
    subjectLabel: subject.label,
    buildHref: (lesson) => duongDanBaiHoc(subject.id, lesson.id, lesson.title),
    tierLabel: nhanCapHsg,
    ...(tienDo ?? {}),
  })
  if (!outline) return undefined

  // "Bài này có hoạt ảnh minh hoạ" là thông tin trang danh sách cũ vẫn nói ra, và nó giúp
  // người học chọn bài — giữ lại bằng cách thêm vào `hint` (CHỮ, không phải màu). Làm ở app
  // chứ không sửa adapter: `hasAnimation` là chuyện trình bày của môn STEM trên web, còn
  // adapter là hợp đồng cây dùng chung (và test S07-1 đang canh đúng hình dạng hiện tại).
  const nodes = outline.nodes.map((n) => {
    if (n.kind !== 'lesson' || n.contentId === undefined) return n
    if (subject.loader.getSummary(n.contentId)?.hasAnimation !== true) return n
    return { ...n, hint: n.hint ? `${n.hint} · Có hoạt ảnh` : 'Có hoạt ảnh' }
  })
  return { ...outline, nodes }
}

/** Mã nút chương "Bồi dưỡng học sinh giỏi" — dùng để tách hai nhánh khi hiển thị. */
export function idChuongHsg(subjectId: StemSubjectId): string {
  return `chapter:${subjectId}-hsg`
}

/**
 * Tách cây theo NHÁNH đang xem.
 *
 * Trang danh sách STEM có hai tab ("Chương trình chuẩn" · "Bồi dưỡng học sinh giỏi") nhưng
 * adapter trả MỘT cây chứa cả hai — đúng cho trang bài học (bài nào cũng tra được bài trước/
 * sau), không đúng cho tab. Lọc ở đây thay vì thêm tham số cho adapter: cây vẫn là một nguồn,
 * còn việc "tab nào hiện gì" là chuyện của giao diện.
 */
export function locNhanh(
  outline: Outline | undefined,
  subjectId: StemSubjectId,
  nhanh: 'core' | 'advanced',
): Outline | undefined {
  if (!outline) return undefined
  const hsgId = idChuongHsg(subjectId)
  const laHsg = (nodeId: string, parentId: string | undefined): boolean =>
    nodeId === hsgId || parentId === hsgId
  const nodes = outline.nodes.filter((n) => {
    if (n.nodeId === outline.rootId) return true
    return nhanh === 'advanced' ? laHsg(n.nodeId, n.parentId) : !laHsg(n.nodeId, n.parentId)
  })
  // Chỉ còn mỗi nút gốc → nhánh này rỗng; trả `undefined` để trang hiện thông điệp rỗng
  // của riêng nó thay vì một khung mục lục trống.
  return nodes.length <= 1 ? undefined : { ...outline, nodes }
}
