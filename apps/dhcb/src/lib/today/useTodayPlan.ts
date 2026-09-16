// useTodayPlan — hook GOM dữ liệu cho "Hôm nay" rồi giao cho resolver thuần quyết định.
//
// Ranh giới cố ý: hook này chỉ làm ba việc — đọc (phiên S08, tiến độ Lập trình, CEFR, SRS), dịch
// sang `SubjectSignal`, và báo trạng thái tải. Mọi luật "học gì trước" nằm ở `buildTodayPlan`
// (gói `core-learner`, thuần, test bằng bảng). Đưa luật vào hook là đưa nó vào chỗ chỉ E2E mới
// với tới được.
//
// KHÔNG gọi AI, không endpoint mới: chỉ đúng những nguồn dữ liệu đã có từ trước.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildTodayPlan, type SubjectSignal } from '@dhcb/core-learner/today/buildTodayPlan'
import { SUPPORTED_SUBJECTS } from '@dhcb/core-learner/subjectRegistry'
import type { TodayPlan } from '@dhcb/core-contracts/todayPlan'
import type { CefrLevel } from '../../data/cefr'
import type { Circle } from '../../data/curriculum'
import { loadCefr } from '../../data/cefrLoader'
import { loadFoundation } from '../../data/curriculumLoader'
import { getLearnedWords } from '../vocab'
import { computeLockedMapFromServer, getDoneGrammar } from '../cefrProgress'
import { getPassedExamLevels } from '../cefrExam'
import { getSRSStats } from '../srs'
import { isGuestId } from '@core/guestId'
import { fetchProgress, type ProgrammingLessonProgress } from '../programmingProgress'
import { listResumableSessions, type SessionOwner } from '../learningSession'
import { getDirection } from '../storage'
import { englishNext, ENGLISH_SUBJECT_ID } from './englishNext'
import { programmingNext, PROGRAMMING_SUBJECT_ID } from './programmingNext'
import { resumePointFromSummary, resumeTarget } from './resumePoint'

export type TodayPlanState = 'loading' | 'ready' | 'error'

export interface UseTodayPlanResult {
  plan: TodayPlan | null
  state: TodayPlanState
  /** Tải lại tiến độ sau khi lỗi mạng. */
  retry: () => void
}

const KNOWN_SUBJECT_IDS: readonly string[] = SUPPORTED_SUBJECTS.map((s) => s.id)

/** Nhãn môn để nói "Môn thứ hai: …" — lấy từ registry, không tự đặt tên. */
const SUBJECT_LABELS: Readonly<Record<string, string>> = Object.fromEntries(
  SUPPORTED_SUBJECTS.map((s) => [s.id, s.label]),
)

function ownerOf(uid: string): SessionOwner {
  return { kind: isGuestId(uid) ? 'guest' : 'account', id: uid }
}

/**
 * Kế hoạch "Hôm nay" của một người học.
 *
 * @param uid id người dùng (khách cũng có id thật — mọi lib tiến độ dùng chung đường này).
 * @returns kế hoạch + trạng thái 4 nhánh của giao diện (tải · sẵn sàng · rỗng · lỗi).
 */
export function useTodayPlan(uid: string): UseTodayPlanResult {
  const [levels, setLevels] = useState<readonly CefrLevel[]>([])
  const [circleById, setCircleById] = useState<Record<string, Circle>>({})
  const [cefrLoaded, setCefrLoaded] = useState(false)
  // Tiến độ Lập trình lưu KÈM khoá của lần tải sinh ra nó. Nhờ vậy "đang tải" là thứ SUY RA
  // (khoá hiện tại khác khoá của dữ liệu) chứ không phải một `setState` gọi thẳng trong effect.
  const [reloadKey, setReloadKey] = useState(0)
  const [progressData, setProgressData] = useState<{
    key: string
    rows: readonly ProgrammingLessonProgress[]
    state: Exclude<TodayPlanState, 'loading'>
  }>({ key: '', rows: [], state: 'ready' })
  // `builtAt` chốt một lần lúc gắn hook — resolver là hàm thuần, gọi `Date.now()` trong render
  // làm kết quả đổi theo từng lần vẽ lại.
  const [mountedAt] = useState(() => Date.now())

  const progressKey = `${uid}#${reloadKey}`
  const progress = useMemo<readonly ProgrammingLessonProgress[]>(
    () => (progressData.key === progressKey ? progressData.rows : []),
    [progressData, progressKey],
  )
  const progressState: TodayPlanState =
    progressData.key === progressKey ? progressData.state : 'loading'

  useEffect(() => {
    let alive = true
    Promise.all([loadCefr(), loadFoundation()])
      .then(([lv, foundation]) => {
        if (!alive) return
        setLevels(lv)
        setCircleById(Object.fromEntries(foundation.map((c) => [c.id, c])))
      })
      .catch(() => {
        // Dữ liệu nội dung không tải được: coi như không có tín hiệu tiếng Anh, KHÔNG trắng thẻ.
        console.warn('[today] không tải được dữ liệu CEFR')
      })
      .finally(() => {
        if (alive) setCefrLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!uid) return
    let alive = true
    const key = `${uid}#${reloadKey}`
    fetchProgress(uid)
      .then((rows) => {
        if (alive) setProgressData({ key, rows, state: 'ready' })
      })
      .catch(() => {
        // `fetchProgress` đã tự rơi về cache; tới đây là lỗi thật sự → nói với người dùng.
        if (alive) setProgressData({ key, rows: [], state: 'error' })
      })
    return () => {
      alive = false
    }
  }, [uid, reloadKey])

  const retry = useCallback(() => setReloadKey((k) => k + 1), [])

  const plan = useMemo<TodayPlan | null>(() => {
    if (!uid || !cefrLoaded || progressState === 'loading') return null

    const owner = ownerOf(uid)
    const sessions = listResumableSessions(owner)
    const learned = getLearnedWords(uid)
    const doneGrammar = getDoneGrammar(uid)
    const examPassed = getPassedExamLevels(uid)
    const lockedMap = computeLockedMapFromServer(uid, [...levels], examPassed)

    const english = englishNext({
      levels,
      circleById,
      learned,
      doneGrammar,
      lockedMap,
      isA: getDirection() === 'A',
      srsDue: getSRSStats(uid).due,
    })
    const programming = programmingNext({ progress })

    const byId = new Map<string, SubjectSignal>()
    function signalOf(subjectId: string): SubjectSignal {
      const existing = byId.get(subjectId)
      if (existing) return existing
      const created: SubjectSignal = {
        subjectId,
        ...(SUBJECT_LABELS[subjectId] ? { subjectLabel: SUBJECT_LABELS[subjectId] } : {}),
      }
      byId.set(subjectId, created)
      return created
    }

    if (english.next) Object.assign(signalOf(ENGLISH_SUBJECT_ID), english)
    if (programming.next || programming.lastEvidenceAt !== undefined) {
      Object.assign(signalOf(PROGRAMMING_SUBJECT_ID), programming)
    }

    // Phiên đã sắp theo `updatedAt` giảm dần — lấy phiên mới nhất của mỗi môn.
    for (const summary of sessions) {
      const signal = signalOf(summary.subjectId)
      if (signal.resume) continue
      const point = resumePointFromSummary(summary, owner)
      const target = resumeTarget(point, { cefrLevels: levels })
      if (!target) continue
      Object.assign(signal, {
        resume: point,
        resumeHref: target.href,
        resumeTitle: target.title,
      })
    }

    return buildTodayPlan({
      signals: [...byId.values()],
      now: mountedAt,
      knownSubjectIds: KNOWN_SUBJECT_IDS,
    })
  }, [uid, cefrLoaded, levels, circleById, progress, progressState, mountedAt])

  const state: TodayPlanState =
    plan === null ? 'loading' : progressState === 'error' ? 'error' : 'ready'

  return { plan, state, retry }
}
