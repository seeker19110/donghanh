// apps/dhcb/src/lib/useLearningSession.ts — hook React gói khung phiên học cho một màn hình.
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s08-khung-phien-resume.md §3.2 (slice S08-1).
//
// Vòng đời: đọc MỘT lần lúc mount (hoặc khi danh tính đổi) → giữ state → ghi có debounce 500 ms
// → flush ngay khi rời trang (`pagehide`, `visibilitychange` → hidden) → nghe sự kiện `storage`
// của tab khác và nhận bản MỚI HƠN (last-write-wins theo `updatedAt`, tab nhận KHÔNG ghi lại nên
// không có vòng lặp ping-pong).
//
// Ba điều dễ làm sai, đã chốt chặn ở đây:
//  1. KHÔNG `setState` đồng bộ trong `useEffect` (luật `react-hooks/set-state-in-effect`): state
//     mang theo `identity` của phiên; danh tính đổi thì tính lại NGAY TRONG LƯỢT RENDER.
//  2. KHÔNG đọc/ghi `ref` lúc render (luật `react-hooks/refs`): mốc `lastUpdatedAt` nằm TRONG
//     state, ref chỉ được đồng bộ trong effect và chỉ đọc ở callback/effect.
//  3. Owner đổi giữa chừng (đăng nhập/đăng xuất) KHÔNG được ghi state cũ sang khoá của owner mới
//     — vì `identity` chứa owner nên state cũ bị vứt trước khi có lần ghi nào.
import { useCallback, useEffect, useRef, useState } from 'react'
import type { z } from 'zod'
import {
  clearSession,
  isSessionStorageAvailable,
  readSession,
  saveSession,
  sessionKey,
  type SessionKeyParts,
  type SessionOwner,
} from './learningSession'

/** Chờ bao lâu sau phím gõ cuối mới ghi xuống storage. */
export const SESSION_SAVE_DEBOUNCE_MS = 500

export interface UseLearningSessionArgs<T> {
  /** `null` khi AuthProvider chưa xong → `status: 'loading'`, tuyệt đối không ghi. */
  owner: SessionOwner | null
  subjectId: string
  contentId: string
  courseId?: string
  contentVersion: string
  /** Schema NHỎ của trang; payload không parse được thì coi như không có nháp. */
  draftSchema: z.ZodType<T>
  /** Giá trị mặc định khi không có gì để khôi phục. */
  initial: () => { stepIndex: number; draft: T }
  stepLabel?: (stepIndex: number) => string
  /**
   * Tạm NGỪNG ghi nháp (vẫn giữ nguyên state đang hiện trên màn hình).
   *
   * Dùng khi phiên học không còn gì để "học tiếp": bài Lập trình đã đạt hết test thì nháp bị
   * xoá (§7 Q6 của đặc tả S08) — nếu hook vẫn ghi tiếp thì chỉ một lần bấm "Bước tiếp" là nháp
   * của bài ĐÃ XONG sống lại, và lần sau mở bài người học lại thấy code cũ ở bước "Tự viết".
   */
  paused?: boolean
}

export interface UseLearningSessionResult<T> {
  status: 'loading' | 'restored' | 'fresh' | 'stale' | 'memory-only'
  stepIndex: number
  draft: T
  /** Có bản nháp cũ của bài đã đổi nội dung — để UI hỏi "dùng lại?". */
  staleSession: { stepIndex: number; draft: T } | null
  setStep(i: number): void
  setDraft(updater: T | ((prev: T) => T)): void
  adoptStale(): void
  discardStale(): void
  clear(): void
  storageMode: 'local' | 'memory'
}

interface InnerState<T> {
  identity: string
  status: UseLearningSessionResult<T>['status']
  stepIndex: number
  draft: T
  staleSession: { stepIndex: number; draft: T } | null
  storageMode: 'local' | 'memory'
  /** `updatedAt` của bản mới nhất tab này biết — mốc so sánh cho sự kiện `storage`. */
  lastUpdatedAt: number
}

function identityOf(
  owner: SessionOwner | null,
  subjectId: string,
  contentId: string,
  contentVersion: string,
): string {
  if (!owner) return 'loading'
  return `${owner.kind}:${owner.id}|${subjectId}|${contentId}|${contentVersion}`
}

export function useLearningSession<T>(
  args: UseLearningSessionArgs<T>,
): UseLearningSessionResult<T> {
  const { owner, subjectId, contentId, contentVersion, draftSchema, initial } = args
  const identity = identityOf(owner, subjectId, contentId, contentVersion)

  const buildState = useCallback((): InnerState<T> => {
    const storageMode: 'local' | 'memory' = isSessionStorageAvailable() ? 'local' : 'memory'
    const fallback = initial()
    const base = { identity, staleSession: null, storageMode, lastUpdatedAt: 0 }
    if (!owner) return { ...base, status: 'loading', ...fallback }

    const parts: SessionKeyParts = { owner, subjectId, contentId }
    const result = readSession(parts, contentVersion)
    if (result.status === 'ready' || result.status === 'stale') {
      const parsed = draftSchema.safeParse(result.session.draft)
      if (parsed.success) {
        const restored = { stepIndex: result.session.stepIndex, draft: parsed.data }
        const lastUpdatedAt = result.session.updatedAt
        if (result.status === 'ready') {
          return { ...base, lastUpdatedAt, status: 'restored', ...restored }
        }
        // `stale`: KHÔNG prefill ngầm — trang tự hỏi người học có dùng lại không.
        return { ...base, lastUpdatedAt, status: 'stale', ...fallback, staleSession: restored }
      }
    }
    return { ...base, status: storageMode === 'memory' ? 'memory-only' : 'fresh', ...fallback }
  }, [owner, subjectId, contentId, contentVersion, draftSchema, identity, initial])

  const [state, setState] = useState<InnerState<T>>(buildState)

  // Danh tính đổi (đổi bài, đổi owner, bài cập nhật nội dung) → đọc lại NGAY trong lượt render,
  // không dùng effect: state cũ không bao giờ được ghi sang khoá mới.
  const current = state.identity === identity ? state : buildState()
  if (state.identity !== identity) setState(current)

  // Ảnh chụp mới nhất cho callback (đồng bộ trong effect — không đụng ref lúc render).
  const stateRef = useRef(current)
  const argsRef = useRef(args)
  useEffect(() => {
    stateRef.current = current
    argsRef.current = args
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dirtyRef = useRef(false)

  const flush = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (!dirtyRef.current) return
    const snapshot = stateRef.current
    const now = argsRef.current
    if (!now.owner || now.paused || snapshot.status === 'loading') return
    dirtyRef.current = false
    const result = saveSession(
      { owner: now.owner, subjectId: now.subjectId, contentId: now.contentId },
      {
        contentVersion: now.contentVersion,
        stepIndex: snapshot.stepIndex,
        draft: snapshot.draft,
        ...(now.courseId === undefined ? {} : { courseId: now.courseId }),
        ...(now.stepLabel === undefined ? {} : { stepLabel: now.stepLabel(snapshot.stepIndex) }),
      },
    )
    // `too-large`: bản cũ giữ nguyên, mốc `lastUpdatedAt` cũng không đổi.
    if (result.status === 'too-large') return
    const lastUpdatedAt = result.session.updatedAt
    setState((prev) => (prev.lastUpdatedAt === lastUpdatedAt ? prev : { ...prev, lastUpdatedAt }))
  }, [])

  const scheduleSave = useCallback(() => {
    dirtyRef.current = true
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      flush()
    }, SESSION_SAVE_DEBOUNCE_MS)
  }, [flush])

  // Rời trang: ghi ngay, không chờ hết debounce. Safari iOS không bắn `beforeunload` ổn định nên
  // dùng `pagehide` + `visibilitychange` → hidden (repo không dùng `beforeunload` ở đâu).
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    const onPageHide = () => flush()
    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('visibilitychange', onHide)
      flush()
    }
  }, [flush])

  // Tab khác ghi bản mới hơn → nhận; cũ hơn/bằng → bỏ qua. Tab nhận KHÔNG ghi lại.
  useEffect(() => {
    if (!owner) return
    const parts: SessionKeyParts = { owner, subjectId, contentId }
    const key = sessionKey(parts)
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key || event.newValue === null) return
      const incoming = readSession(parts, contentVersion)
      if (incoming.status !== 'ready') return
      const parsed = draftSchema.safeParse(incoming.session.draft)
      if (!parsed.success) return
      setState((prev) => {
        if (prev.identity !== identity) return prev
        if (incoming.session.updatedAt <= prev.lastUpdatedAt) return prev
        return {
          ...prev,
          status: 'restored',
          stepIndex: incoming.session.stepIndex,
          draft: parsed.data,
          lastUpdatedAt: incoming.session.updatedAt,
        }
      })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [owner, subjectId, contentId, contentVersion, draftSchema, identity])

  const setStep = useCallback(
    (i: number) => {
      setState((prev) => (prev.stepIndex === i ? prev : { ...prev, stepIndex: i }))
      scheduleSave()
    },
    [scheduleSave],
  )

  const setDraft = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setState((prev) => ({
        ...prev,
        draft:
          typeof updater === 'function' ? (updater as (p: T) => T)(prev.draft) : (updater as T),
      }))
      scheduleSave()
    },
    [scheduleSave],
  )

  const adoptStale = useCallback(() => {
    setState((prev) =>
      prev.staleSession
        ? {
            ...prev,
            status: 'restored',
            stepIndex: prev.staleSession.stepIndex,
            draft: prev.staleSession.draft,
            staleSession: null,
          }
        : prev,
    )
    scheduleSave()
  }, [scheduleSave])

  const discardStale = useCallback(() => {
    const now = argsRef.current
    if (now.owner) {
      clearSession({ owner: now.owner, subjectId: now.subjectId, contentId: now.contentId })
    }
    setState((prev) => (prev.staleSession ? { ...prev, staleSession: null } : prev))
  }, [])

  const clear = useCallback(() => {
    const now = argsRef.current
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    dirtyRef.current = false
    if (now.owner) {
      clearSession({ owner: now.owner, subjectId: now.subjectId, contentId: now.contentId })
    }
    const fallback = now.initial()
    setState((prev) => ({
      ...prev,
      status: prev.storageMode === 'memory' ? 'memory-only' : 'fresh',
      stepIndex: fallback.stepIndex,
      draft: fallback.draft,
      staleSession: null,
      lastUpdatedAt: 0,
    }))
  }, [])

  return {
    status: current.status,
    stepIndex: current.stepIndex,
    draft: current.draft,
    staleSession: current.staleSession,
    storageMode: current.storageMode,
    setStep,
    setDraft,
    adoptStale,
    discardStale,
    clear,
  }
}
