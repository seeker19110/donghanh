// packages/subject-programming/levelLockServer.ts — bản SERVER của luật khoá bậc P1→P6.
//
// Đặc tả: docs/specs/2026-09-12-gd3-khoa-bai-mon-lap-trinh.md (GĐ3) +
// docs/changelog/2026-09-19-siet-khoa-bac-lap-trinh-server.md (siết ở server, dọn nợ kỹ thuật
// ghi trong PROGRESS.md mục "Khoá bậc môn Lập trình mới cưỡng chế ở CLIENT").
//
// KHÁC `programmingLevelLock.ts` (tầng client) ở CHỖ DUY NHẤT: ráp danh sách bài "đã soạn" của
// từng bậc từ registry ĐẦY ĐỦ `lessons.ts` (server luôn có sẵn, không cần nạp lười như client) —
// luật tính vẫn dùng chung hàm THUẦN `computeLevelLockMap`.
//
// GRANDFATHER Ở SERVER: client giữ tập "bậc đã từng vào" trong localStorage (không có cột DB
// tương ứng — xem comment ở `programmingLevelLock.ts`). Server suy được tập tương đương TỪ DỮ
// LIỆU ĐÃ CÓ: bất kỳ bài nào ở một bậc đã có dòng `lesson_progress` (bất kể status) tức là người
// học ĐÃ TỪNG VÀO bậc đó — không cần migration/cột mới. Đây là phép suy CHÍNH XÁC cùng logic với
// `seedGrandfather()` phía client (cũng duyệt toàn bộ tiến độ để đánh dấu bậc đã vào).
import { PROGRAMMING_LEVELS } from './curriculum.js'
import { getLessonsByUnit } from './lessons.js'
import { computeLevelLockMap, type LevelLessons, type LockPlan } from './levelLock.js'

export type { LockPlan } from './levelLock.js'

/** Chỉ bài XƯƠNG SỐNG (`p<n>-u<x>-l<y>`) đi qua luật khoá bậc — đúng phạm vi đặc tả §"PHẠM VI". */
const SPINE_LESSON_RE = /^(p[1-6])-u\d+-l\d+$/

/** Bậc của một lessonId xương sống, hoặc null nếu ngoài phạm vi khoá (bước dự án/hướng chuyên
 * sâu/khoá ngắn — những khoá đó KHÔNG bị khoá theo bậc). */
export function levelOfSpineLesson(lessonId: string): string | null {
  const m = SPINE_LESSON_RE.exec(lessonId)
  return m?.[1] ?? null
}

let cachedLevels: LevelLessons[] | null = null

/** Danh sách bài ĐÃ SOẠN của từng bậc, theo đúng thứ tự P1→P6 — dữ liệu tĩnh, tính một lần. */
export function buildLevelLessonsServer(): LevelLessons[] {
  if (cachedLevels) return cachedLevels
  cachedLevels = PROGRAMMING_LEVELS.map((level) => ({
    levelId: level.id,
    lessonIds: level.units.flatMap((u) => getLessonsByUnit(u.id).map((l) => l.id)),
  }))
  return cachedLevels
}

export interface LevelWriteCheckInput {
  lessonId: string
  plan: LockPlan
  /** Id bài đã hoàn thành (status = 'completed'), TRƯỚC khi ghi mục đang xét. */
  completedLessonIds: Iterable<string>
  /** Id bài đã có dòng tiến độ (bất kể status) — dùng suy tập grandfather. */
  everEnteredLessonIds: Iterable<string>
}

export type LevelWriteCheckResult = { allowed: true } | { allowed: false; requiredLevelId?: string }

/**
 * Bậc bài học thuộc về CHƯA MỞ với gói/tiến độ hiện có → từ chối ghi.
 * Ngoài phạm vi khoá (không phải bài xương sống) → luôn cho phép (nội dung bài học không phải
 * bí mật, chỉ chặn GHI TIẾN ĐỘ vượt bậc — xem đặc tả nhiệm vụ mục 6).
 */
export function checkLevelWriteAllowed({
  lessonId,
  plan,
  completedLessonIds,
  everEnteredLessonIds,
}: LevelWriteCheckInput): LevelWriteCheckResult {
  const level = levelOfSpineLesson(lessonId)
  if (!level) return { allowed: true }

  const levels = buildLevelLessonsServer()
  const levelOfLesson = new Map<string, string>()
  for (const lv of levels) for (const id of lv.lessonIds) levelOfLesson.set(id, lv.levelId)

  const everUnlocked = new Set<string>()
  for (const id of everEnteredLessonIds) {
    const lv = levelOfLesson.get(id)
    if (lv) everUnlocked.add(lv)
  }

  const map = computeLevelLockMap({ levels, completedLessonIds, plan, everUnlocked })
  const info = map.get(level)
  if (!info || !info.locked) return { allowed: true }
  return { allowed: false, requiredLevelId: info.requiredLevelId }
}
