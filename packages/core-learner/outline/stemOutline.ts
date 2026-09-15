// stemOutline — dựng cây mục lục cho MỘT LỚP của một môn STEM (Toán · Lí · Hoá · Sinh).
//
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md §③.3 (dòng STEM).
//
// Cây: lớp → chương → bài, cộng thêm MỘT chương "Bồi dưỡng học sinh giỏi" khi môn có chuyên đề.
//
// HAI BẪY DỮ LIỆU THẬT (đã khảo sát, đừng "dọn" lại):
//   · Gom chương theo `chapterNumber`, KHÔNG theo `chapterTitle` — Hoá có 15 chuyên đề HSG
//     trùng tên chương; gom theo tên sẽ dính các chương khác nhau vào nhau.
//   · Cũng KHÔNG gom theo `chapterKey` — Sinh dùng 9 tệp chương gộp nhiều chương, `chapterKey`
//     là khoá TỆP để nạp lười chứ không phải chương của chương trình.
//
// BẤT BIẾN: chỉ đọc CHỈ MỤC NHẸ (`loader.index`, `listCoreByGrade`, `listAdvanced`). Không gọi
// `loadLesson` — dựng mục lục mà tải nội dung bài là kéo cả megabyte cho một danh sách chữ.
//
// TIẾN ĐỘ: bốn môn STEM chưa có bằng chứng hoàn thành nào (không khoá lưu, không API) nên MỌI
// bài là `unknown` = "chưa đo được". Cố tình KHÔNG bịa evidence tạm bằng localStorage: "đã mở
// trang" không bao giờ là "đã học xong" (spec nền), và bằng chứng thật là việc của slice S11.
import type { Outline, OutlineNode } from '@dhcb/core-contracts/outline'
import type {
  StemLessonLike,
  StemLessonSummary,
  StemSubjectId,
} from '@dhcb/core-contracts/stemLesson'
import type { StemLessonLoader } from '../stemLessonLoader.js'

export interface StemOutlineCtx {
  loader: StemLessonLoader<StemLessonLike>
  /** Tên môn hiển thị ("Vật lí") — nút gốc là "Vật lí · Lớp 10". */
  subjectLabel: string
  /** Đường dẫn tới một bài; app truyền `duongDanBaiHoc` của `lib/stemLessonRoutes.ts` vào
   *  (gói `packages/` không được import `apps/`, nên URL do nơi gọi dựng). */
  buildHref: (lesson: StemLessonSummary) => string
  /** Nhãn cấp chuyên đề HSG ("Cấp tỉnh") — cũng sống ở app cùng bảng tên tiếng Việt. */
  tierLabel?: (tier: string | undefined) => string
}

const demBai = (n: number): string => `${n} bài`

/**
 * Cây mục lục một lớp. Lớp không có bài chuẩn nào và môn cũng không có chuyên đề → `undefined`
 * (nơi gọi xử lý như hiện nay: hiện trạng thái rỗng, không dựng cây trống).
 */
export function buildStemOutline(
  subjectId: StemSubjectId,
  grade: string,
  ctx: StemOutlineCtx,
): Outline | undefined {
  const core = ctx.loader.listCoreByGrade(grade)
  const advanced = ctx.loader.listAdvanced()
  if (core.length === 0 && advanced.length === 0) return undefined

  const rootId = `level:${subjectId}-${grade}`
  const nodes: OutlineNode[] = [
    {
      nodeId: rootId,
      subjectId,
      contentId: grade,
      kind: 'level',
      title: `${ctx.subjectLabel} · Lớp ${grade}`,
      hint: demBai(core.length + advanced.length),
      order: 0,
      availability: 'available',
      progress: 'unknown',
    },
  ]

  // Gom theo SỐ chương, giữ đúng thứ tự `listCoreByGrade` đã sắp (chương rồi tới bài).
  const theoChuong = new Map<number, StemLessonSummary[]>()
  for (const lesson of core) {
    const list = theoChuong.get(lesson.chapterNumber)
    if (list) list.push(lesson)
    else theoChuong.set(lesson.chapterNumber, [lesson])
  }

  let chapterOrder = 0
  for (const [chapterNumber, lessons] of theoChuong) {
    const chapterId = `chapter:${subjectId}-${grade}-c${chapterNumber}`
    nodes.push({
      nodeId: chapterId,
      parentId: rootId,
      subjectId,
      contentId: String(chapterNumber),
      kind: 'chapter',
      title: `Chương ${chapterNumber}. ${lessons[0]?.chapterTitle ?? ''}`.trim(),
      hint: demBai(lessons.length),
      order: chapterOrder++,
      availability: 'available',
      progress: 'unknown',
    })
    lessons.forEach((lesson, i) => {
      nodes.push(nutBai(subjectId, chapterId, lesson, i, ctx))
    })
  }

  // Nhánh HSG: MỘT chương riêng, và VẮNG HẲN khi môn không có chuyên đề nào (Sinh học).
  if (advanced.length > 0) {
    const hsgId = `chapter:${subjectId}-hsg`
    nodes.push({
      nodeId: hsgId,
      parentId: rootId,
      subjectId,
      contentId: 'hsg',
      kind: 'chapter',
      title: 'Bồi dưỡng học sinh giỏi',
      hint: demBai(advanced.length),
      order: chapterOrder,
      availability: 'available',
      progress: 'unknown',
    })
    advanced.forEach((lesson, i) => {
      const hint = ctx.tierLabel?.(lesson.advancedTier)
      nodes.push({
        ...nutBai(subjectId, hsgId, lesson, i, ctx),
        ...(hint ? { hint } : {}),
      })
    })
  }

  return { rootId, subjectId, nodes, builtAt: Date.now() }
}

function nutBai(
  subjectId: StemSubjectId,
  parentId: string,
  lesson: StemLessonSummary,
  order: number,
  ctx: StemOutlineCtx,
): OutlineNode {
  return {
    nodeId: `lesson:${lesson.id}`,
    parentId,
    subjectId,
    contentId: lesson.id,
    kind: 'lesson',
    title: lesson.title,
    order,
    href: ctx.buildHref(lesson),
    availability: 'available',
    // Chưa có bằng chứng hoàn thành cho STEM — xem ghi chú đầu file.
    progress: 'unknown',
  }
}
