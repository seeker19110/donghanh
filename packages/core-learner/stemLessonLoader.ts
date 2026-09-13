// stemLessonLoader.ts — Nạp lười bài học STEM cho GIAO DIỆN.
//
// VÌ SAO CẦN: bốn registry Toán/Lí/Hoá/Sinh cộng lại ~2 MB. Import thẳng vào app là mọi trang
// đều gánh cả bốn môn. Môn Lập trình đã gặp đúng chuyện này và giải bằng chỉ mục nhẹ + nạp
// lười theo unit (xem packages/subject-programming/lessonsLoader.ts); đây là bản dùng chung
// cho bốn môn STEM, tham số hoá để không viết lại bốn lần.
//
// Hai tầng:
//   · ĐỒNG BỘ, rẻ: chỉ mục `StemLessonSummary[]` (id, tiêu đề, chương, nhánh) — đủ cho mọi
//     màn liệt kê.
//   · BẤT ĐỒNG BỘ: `loadLesson` gọi `import()` của ĐÚNG tệp chương chứa bài, có cache.
//
// Tệp `lessonsLazy.ts` của mỗi môn do `npm run gen:stem-lesson-index` sinh ra — sửa bài học
// xong phải chạy lại, nếu không chỉ mục lệch với nội dung thật.
import type { StemLessonLike, StemLessonSummary } from '@dhcb/core-contracts/stemLesson'

export interface StemLessonLoader<T extends StemLessonLike> {
  /** Toàn bộ chỉ mục, thứ tự như registry. */
  index: StemLessonSummary[]
  getSummary(lessonId: string): StemLessonSummary | undefined
  /** Bài thuộc chương trình chuẩn của một lớp, đã sắp theo chương rồi bài. */
  listCoreByGrade(grade: string): StemLessonSummary[]
  /** Chuyên đề bồi dưỡng học sinh giỏi, sắp theo cấp tăng dần. */
  listAdvanced(): StemLessonSummary[]
  /** Nạp đủ nội dung một bài. Bài không tồn tại → `undefined` (không ném). */
  loadLesson(lessonId: string): Promise<T | undefined>
}

const TIER_ORDER = ['hsg-truong', 'hsg-tinh', 'hsg-quoc-gia']

export function createStemLessonLoader<T extends StemLessonLike>(
  index: StemLessonSummary[],
  chapterLoaders: Record<string, () => Promise<T[]>>,
): StemLessonLoader<T> {
  const summaryById = new Map(index.map((s) => [s.id, s]))
  // Cache PROMISE chứ không phải kết quả, để hai lời gọi cùng lúc không tải chương hai lần.
  // Nạp lỗi (mất mạng giữa chừng) thì xoá khỏi cache để lần sau còn thử lại được.
  const chapterCache = new Map<string, Promise<T[]>>()

  function loadChapter(chapterKey: string): Promise<T[]> {
    const loader = chapterLoaders[chapterKey]
    if (!loader) return Promise.resolve([])
    let pending = chapterCache.get(chapterKey)
    if (!pending) {
      pending = loader().catch((err: unknown) => {
        chapterCache.delete(chapterKey)
        throw err
      })
      chapterCache.set(chapterKey, pending)
    }
    return pending
  }

  return {
    index,
    getSummary: (lessonId) => summaryById.get(lessonId),

    listCoreByGrade: (grade) =>
      index
        .filter((s) => s.track === 'core' && s.grade === grade)
        .sort((a, b) =>
          a.chapterNumber !== b.chapterNumber
            ? a.chapterNumber - b.chapterNumber
            : a.lessonNumber - b.lessonNumber,
        ),

    listAdvanced: () =>
      index
        .filter((s) => s.track === 'advanced')
        .sort(
          (a, b) =>
            TIER_ORDER.indexOf(a.advancedTier ?? '') - TIER_ORDER.indexOf(b.advancedTier ?? '') ||
            a.chapterNumber - b.chapterNumber ||
            a.lessonNumber - b.lessonNumber,
        ),

    async loadLesson(lessonId) {
      const summary = summaryById.get(lessonId)
      if (!summary) return undefined
      const lessons = await loadChapter(summary.chapterKey)
      return lessons.find((l) => l.id === lessonId)
    },
  }
}
