// packages/subject-programming/levelLock.ts — LUẬT KHOÁ BẬC P1→P6 của môn Lập trình.
//
// Đặc tả: docs/specs/2026-09-12-gd3-khoa-bai-mon-lap-trinh.md (GĐ3).
//
// Luật:
//   · VIP  → mọi bậc mở ("học tự do", giống môn Anh GĐ2a).
//   · Free → P1 luôn mở; bậc P(n+1) mở khi đã hoàn thành ≥ UNLOCK_PCT (70%) số bài ĐÃ SOẠN
//            của bậc P(n). Ngưỡng dùng chung với môn Anh — `@dhcb/core-learner/unlockThreshold`.
//   · Cộng thêm tập GRANDFATHER (bậc người học đã từng vào trước khi luật này ra đời) —
//     chống hồi tố, KHÔNG ai mất quyền đã có (bài học ghi ở `cefrProgress.ts` dòng 183–188).
//
// BẤT BIẾN: bậc CHƯA SOẠN BÀI NÀO (total = 0) không được chặn đường đi — nếu coi nó là "chưa
// đạt 70%" thì một bậc trống sẽ khoá vĩnh viễn toàn bộ phần sau. Bậc trống đã mở thì bậc kế
// tiếp cũng mở.
//
// PHẠM VI: chỉ xương sống P1→P6. Hướng chuyên sâu / khoá ngắn / lộ trình mục tiêu là nội dung
// song song, KHÔNG đi qua hàm này.
//
// Hàm THUẦN: không đọc DB, không đọc localStorage, không đọc đồng hồ.
import { UNLOCK_PCT, requiredToUnlock } from '@dhcb/core-learner/unlockThreshold'

export { UNLOCK_PCT }

/** Gói dịch vụ có hiệu lực (khớp `packages/core-billing/plan.ts`). */
export type LockPlan = 'free' | 'vip'

/** Một bậc rút gọn — chỉ cần id và danh sách id bài ĐÃ SOẠN của bậc đó. */
export interface LevelLessons {
  levelId: string
  lessonIds: readonly string[]
}

/** Trạng thái khoá của MỘT bậc, kèm đủ dữ liệu để giao diện viết câu giải thích. */
export interface LevelLockInfo {
  locked: boolean
  /** Bậc phải học cho đủ để mở bậc này (undefined ở bậc đầu / bậc không bị khoá vì lý do tuần tự). */
  requiredLevelId?: string
  /** Số bài đã hoàn thành ở bậc chặn. */
  doneInRequired: number
  /** Số bài tối thiểu phải hoàn thành ở bậc chặn (70%, làm tròn lên). */
  neededInRequired: number
  /** Còn thiếu bao nhiêu bài nữa là mở (0 khi không bị khoá). */
  remaining: number
}

export interface ComputeLevelLockInput {
  /** Các bậc theo ĐÚNG thứ tự học P1→P6. */
  levels: readonly LevelLessons[]
  /** Id các bài có `status = 'completed'`. */
  completedLessonIds: Iterable<string>
  /** Gói ĐANG có hiệu lực. Đọc lỗi → truyền 'free' (fail-safe khoá chặt). */
  plan: LockPlan
  /** Bậc đã từng được vào từ trước (grandfather) — không bao giờ bị khoá lại. */
  everUnlocked?: Iterable<string> | null
}

const moKhoa = (levelId: string): [string, LevelLockInfo] => [
  levelId,
  { locked: false, doneInRequired: 0, neededInRequired: 0, remaining: 0 },
]

/**
 * Bản đồ khoá bậc. Trả về Map theo đúng thứ tự `levels` truyền vào.
 * Bậc lạ (không có trong `levels`) → nơi gọi tự coi là mở.
 */
export function computeLevelLockMap({
  levels,
  completedLessonIds,
  plan,
  everUnlocked,
}: ComputeLevelLockInput): Map<string, LevelLockInfo> {
  const map = new Map<string, LevelLockInfo>()

  // VIP: học tự do — mở hết, không xét tiến độ.
  if (plan === 'vip') {
    for (const level of levels) map.set(...moKhoa(level.levelId))
    return map
  }

  const done = new Set(completedLessonIds)
  const grandfathered = new Set(everUnlocked ?? [])

  levels.forEach((level, index) => {
    // Bậc đầu tiên luôn mở — điểm bắt đầu của mọi người học.
    if (index === 0) {
      map.set(...moKhoa(level.levelId))
      return
    }
    // Quyền đã có thì giữ, không xét gì thêm (chống hồi tố).
    if (grandfathered.has(level.levelId)) {
      map.set(...moKhoa(level.levelId))
      return
    }

    const prev = levels[index - 1]
    if (!prev) {
      map.set(...moKhoa(level.levelId))
      return
    }

    // Bậc trước còn khoá → bậc này cũng khoá, và câu giải thích vẫn trỏ về ĐÚNG bậc mà người
    // học đang phải làm dở (bậc chặn gần nhất), chứ không phải bậc kề ngay trước.
    const prevInfo = map.get(prev.levelId)
    if (prevInfo?.locked) {
      map.set(level.levelId, { ...prevInfo })
      return
    }

    const total = prev.lessonIds.length
    // Bậc trước CHƯA CÓ BÀI NÀO → không có gì để hoàn thành, không được chặn đường (bất biến §⑤).
    if (total === 0) {
      map.set(...moKhoa(level.levelId))
      return
    }

    const doneInPrev = prev.lessonIds.filter((id) => done.has(id)).length
    const needed = requiredToUnlock(total)
    const locked = doneInPrev < needed
    map.set(level.levelId, {
      locked,
      requiredLevelId: prev.levelId,
      doneInRequired: doneInPrev,
      neededInRequired: needed,
      remaining: locked ? needed - doneInPrev : 0,
    })
  })

  return map
}
