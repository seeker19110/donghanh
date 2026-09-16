// syncOutbox.ts — HÀNG ĐỢI GỬI LẠI tiến độ học theo CHỦ SỞ HỮU (slice S09-2).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md §③.4.
//
// Vì sao cần: trước S09, mọi thay đổi tiến độ được POST NGAY, không debounce, không gửi lại;
// lỗi mạng/5xx/401/429 chỉ `console.warn` rồi mất (phát hiện F1/F3/F4 của đặc tả §②). Hệ quả
// thật: học lúc mất mạng → bài Lập trình hoàn thành BIẾN MẤT ở lần mở sau; ôn nhanh 40 thẻ SRS
// → 40 POST → chạm hạn mức 30/phút → 429 im lặng.
//
// Module này KHÔNG biết gì về nội dung từng loại tài liệu: mỗi loại (`english` · `programming` ·
// `evidence`) tự đăng ký một `KindHandler` dựng thân request lúc GỬI và xử lý response. Nhờ vậy
// CHỈ CÓ MỘT chính sách gửi lại (debounce · gộp · backoff · Web Locks · 401) cho cả ba loại, và
// module này không import ngược lên `progressSync`/`programmingProgress` (tránh vòng import).
//
// Bất biến quan trọng:
//   • Khách vãng lai (`isGuestId`) KHÔNG BAO GIỜ vào hàng đợi — họ không có phiên để gửi.
//   • Hàng đợi tách theo `uid` (`dhcb_sync_outbox_<uid>`): đổi tài khoản không gửi chéo dữ liệu,
//     đăng xuất KHÔNG xoá hàng đợi (đăng nhập lại đúng chủ là gửi tiếp).
//   • `attemptId` chỉ đổi khi PAYLOAD đổi — gửi lại nguyên payload giữ nguyên id, nhờ vậy server
//     (S09-1) nhận ra "đã lưu rồi" và không cộng thưởng hai lần.

import { isGuestId } from '@core/guestId'
import { getAuthHeader } from '@core/authHeader'

export type OutboxKind = 'english' | 'programming' | 'evidence'

export interface OutboxEntry {
  /** Khoá idempotency theo LẦN GỬI (server S09-1 tra `public.sync_receipts`). */
  attemptId: string
  kind: OutboxKind
  uid: string
  /**
   * Dữ liệu cần gửi. `english` luôn là `null`: bản chụp tiến độ được ĐỌC TỪ localStorage LÚC
   * GỬI, không phải lúc xếp hàng — giữ đúng tinh thần guard `pullInFlight` của `progressSync`
   * (gửi bản đã hợp nhất mới nhất, không phải bản cũ đã chụp sẵn).
   */
  payload: unknown
  /** Băm của payload — payload đổi thì `attemptId` phải đổi (đặc tả AC-11). */
  payloadHash: string
  createdAt: string
  tries: number
  /** Mốc epoch ms sớm nhất được thử lại; 0 = gửi ngay. */
  nextAt: number
  lastError?: 'network' | 'http_5xx' | 'http_401' | 'http_429' | 'timeout'
}

export interface FlushResult {
  sent: number
  remaining: number
  /**
   * Vì sao còn mục chưa gửi: hết phiên đăng nhập · mất mạng · tab khác đang giữ khoá gửi.
   * Không có nghĩa là mất dữ liệu — mục vẫn nằm trong hàng đợi.
   */
  blocked?: 'auth' | 'offline' | 'locked'
}

export interface KindHandler {
  /**
   * Chạy TRƯỚC khi dựng request (ví dụ chờ lượt `pullProgress` đang chạy xong để bản chụp đọc
   * ra là bản ĐÃ hợp nhất, không phải bản rỗng lúc app vừa mở). Lỗi ở đây bị bỏ qua.
   */
  beforeSend?(uid: string): Promise<void>
  /**
   * Dựng request LÚC GỬI. Trả `null` = không có gì để gửi nữa (mục bị bỏ, coi như xong).
   * `attemptId` của mục phải được gắn vào thân request (phong bì `sync` hoặc trường `attemptId`).
   */
  buildRequest(uid: string, entry: OutboxEntry): { url: string; body: unknown } | null
  /** Xử lý response 2xx (áp `merged`, ghi `version`, dọn hàng chờ phụ…). Lỗi ở đây KHÔNG chặn. */
  onSuccess?(uid: string, entry: OutboxEntry, body: unknown): void | Promise<void>
}

export const OUTBOX_KEY = (uid: string) => `dhcb_sync_outbox_${uid}`
export const VERSION_KEY = (uid: string) => `dhcb_sync_version_${uid}`

/** Chờ 1,5 giây gộp nhiều thay đổi liên tiếp thành MỘT request (AC-9). */
export const DEBOUNCE_MS = 1500
/** Số lần thử lại tự động tối đa trong một phiên tab; hết thì chờ `online`/mở lại app. */
export const MAX_TRIES = 6
/** Trần số mục giữ lại — vượt thì gộp/cắt bớt mục cũ nhất để localStorage không phình vô hạn. */
export const MAX_ENTRIES = 200

const handlers = new Map<OutboxKind, KindHandler>()
const subscribers = new Set<(uid: string) => void>()
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()
const inFlight = new Map<string, Promise<FlushResult>>()

export function registerKindHandler(kind: OutboxKind, handler: KindHandler): void {
  handlers.set(kind, handler)
}

/**
 * Bản sao trong BỘ NHỚ khi localStorage không ghi được (hết dung lượng, chế độ ẩn danh nghiêm
 * ngặt). Không bền qua lần tải trang, nhưng còn hơn im lặng đánh rơi thay đổi ngay tại chỗ —
 * phiên hiện tại vẫn gửi được lên server.
 */
const memoryQueues = new Map<string, OutboxEntry[]>()

// ── Lưu trữ ────────────────────────────────────────────────────────────────────────────────
function readEntries(uid: string): OutboxEntry[] {
  const inMemory = memoryQueues.get(uid)
  if (inMemory) return inMemory.map((e) => ({ ...e }))
  try {
    const raw = localStorage.getItem(OUTBOX_KEY(uid))
    if (!raw) return []
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return []
    // Lọc mục hỏng (người dùng/phiên bản cũ ghi lẫn) — thà bỏ còn hơn kẹt cả hàng đợi.
    return arr.filter(
      (e): e is OutboxEntry =>
        !!e && typeof e === 'object' && typeof (e as OutboxEntry).attemptId === 'string',
    )
  } catch {
    return []
  }
}

function writeEntries(uid: string, entries: OutboxEntry[]): void {
  const kept = entries.slice(-MAX_ENTRIES)
  try {
    if (kept.length === 0) localStorage.removeItem(OUTBOX_KEY(uid))
    else localStorage.setItem(OUTBOX_KEY(uid), JSON.stringify(kept))
    memoryQueues.delete(uid)
  } catch {
    // Không ghi được xuống đĩa → giữ trong bộ nhớ để phiên này vẫn gửi được.
    if (kept.length === 0) memoryQueues.delete(uid)
    else memoryQueues.set(uid, kept)
  }
  notify(uid)
}

function notify(uid: string): void {
  for (const cb of subscribers) {
    try {
      cb(uid)
    } catch {
      /* một người nghe lỗi không được chặn những người còn lại */
    }
  }
}

/** Version server mà client tin là đang có (gửi kèm `baseVersion`); 0 = chưa từng biết. */
export function getSyncVersion(uid: string): number {
  try {
    const v = Number(localStorage.getItem(VERSION_KEY(uid)))
    return Number.isFinite(v) && v > 0 ? v : 0
  } catch {
    return 0
  }
}

export function setSyncVersion(uid: string, version: number): void {
  if (!Number.isFinite(version) || version <= 0) return
  try {
    localStorage.setItem(VERSION_KEY(uid), String(version))
  } catch {
    /* ignore */
  }
}

// ── Tiện ích ───────────────────────────────────────────────────────────────────────────────
export function newAttemptId(): string {
  const c = globalThis.crypto as { randomUUID?: () => string } | undefined
  if (c && typeof c.randomUUID === 'function') return c.randomUUID()
  // Trình duyệt cũ / ngữ cảnh không bảo mật: id chỉ cần DUY NHẤT theo (user, lần gửi).
  return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

/** Băm djb2 — chỉ để so "payload có đổi không", không dùng cho bảo mật. */
function hashPayload(kind: OutboxKind, payload: unknown): string {
  let str: string
  try {
    str = kind + ':' + JSON.stringify(payload ?? null)
  } catch {
    return kind + ':unhashable-' + Date.now()
  }
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0
  return kind + ':' + (h >>> 0).toString(36)
}

function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false
}

// ── Xếp hàng ───────────────────────────────────────────────────────────────────────────────
/**
 * Xếp một thay đổi vào hàng đợi của `uid`.
 *
 * `english` chỉ giữ ĐÚNG MỘT mục (bản chụp toàn bộ localStorage — xếp thêm là thừa).
 * `programming` gộp các mục theo `lessonId` vào MỘT batch (≤ 50 mục/lần gửi, đúng hợp đồng
 * server §③.3). `evidence` mỗi bằng chứng một mục (server S11 tự dedupe theo `attemptId` riêng).
 */
export function enqueue(uid: string, kind: OutboxKind, payload: unknown = null): void {
  if (!uid || isGuestId(uid)) return // khách: localStorage LÀ nguồn sự thật, không có gì để gửi
  const entries = readEntries(uid)
  const now = Date.now()

  if (kind === 'english') {
    const existing = entries.find((e) => e.kind === 'english')
    if (existing) {
      // Đã có mục chờ: bản chụp được đọc lúc GỬI nên không có payload để so băm — nhưng nội dung
      // localStorage VỪA đổi (người học vừa làm gì đó), nên phải sinh `attemptId` MỚI. Giữ id cũ
      // thì lần gửi lại sẽ bị server coi là "đã lưu rồi" (biên nhận S09-1) và phần vừa học không
      // bao giờ tới nơi. Gửi lại KHÔNG kèm thay đổi mới thì id vẫn nguyên — đúng bất biến AC-11.
      existing.attemptId = newAttemptId()
      existing.nextAt = 0
      existing.tries = 0
      writeEntries(uid, entries)
    } else {
      entries.push(makeEntry(uid, 'english', null, now))
      writeEntries(uid, entries)
    }
  } else if (kind === 'programming') {
    const items = normalizeProgrammingItems(payload)
    if (items.length === 0) return
    const existing = entries.find((e) => e.kind === 'programming')
    if (existing) {
      const merged = mergeProgrammingItems(
        normalizeProgrammingItems(existing.payload),
        items,
      ).slice(-50)
      existing.payload = merged
      // Payload ĐỔI → phải sinh `attemptId` mới, nếu không server sẽ trả lại biên nhận cũ và
      // bài vừa thêm biến mất (bất biến AC-11).
      const hash = hashPayload('programming', merged)
      if (hash !== existing.payloadHash) {
        existing.payloadHash = hash
        existing.attemptId = newAttemptId()
      }
      existing.nextAt = 0
      existing.tries = 0
      writeEntries(uid, entries)
    } else {
      entries.push(makeEntry(uid, 'programming', items.slice(-50), now))
      writeEntries(uid, entries)
    }
  } else {
    entries.push(makeEntry(uid, kind, payload, now))
    writeEntries(uid, entries)
  }

  scheduleFlush(uid)
}

function makeEntry(uid: string, kind: OutboxKind, payload: unknown, now: number): OutboxEntry {
  return {
    attemptId: newAttemptId(),
    kind,
    uid,
    payload,
    payloadHash: hashPayload(kind, payload),
    createdAt: new Date(now).toISOString(),
    tries: 0,
    nextAt: 0,
  }
}

export interface ProgrammingItem {
  lessonId: string
  status: 'in_progress' | 'completed'
  clientUpdatedAt: string
}

function normalizeProgrammingItems(payload: unknown): ProgrammingItem[] {
  if (!Array.isArray(payload)) return []
  return payload.filter(
    (i): i is ProgrammingItem =>
      !!i && typeof i === 'object' && typeof (i as ProgrammingItem).lessonId === 'string',
  )
}

/** Gộp theo `lessonId`; `completed` KHÔNG BAO GIỜ bị kéo lùi (cùng luật server). */
function mergeProgrammingItems(a: ProgrammingItem[], b: ProgrammingItem[]): ProgrammingItem[] {
  const out = new Map<string, ProgrammingItem>()
  for (const item of [...a, ...b]) {
    const prev = out.get(item.lessonId)
    if (!prev || prev.status !== 'completed') out.set(item.lessonId, item)
  }
  return [...out.values()]
}

/** Các mục `programming` còn chờ gửi — dùng để phủ lên bản server khi đọc (AC-15). */
export function pendingProgrammingItems(uid: string): ProgrammingItem[] {
  if (!uid || isGuestId(uid)) return []
  const items: ProgrammingItem[] = []
  for (const e of readEntries(uid)) {
    if (e.kind === 'programming') items.push(...normalizeProgrammingItems(e.payload))
  }
  return items
}

export function pending(uid: string): number {
  if (!uid) return 0
  return readEntries(uid).length
}

/** `true` khi có mục đang bị chặn vì hết phiên đăng nhập (giao diện nói "đăng nhập lại"). */
export function isBlockedByAuth(uid: string): boolean {
  if (!uid) return false
  return readEntries(uid).some((e) => e.lastError === 'http_401')
}

export function subscribe(cb: (uid: string) => void): () => void {
  subscribers.add(cb)
  return () => {
    subscribers.delete(cb)
  }
}

function scheduleFlush(uid: string): void {
  const existing = debounceTimers.get(uid)
  if (existing) clearTimeout(existing)
  debounceTimers.set(
    uid,
    setTimeout(() => {
      debounceTimers.delete(uid)
      void flush(uid)
    }, DEBOUNCE_MS),
  )
}

// ── Gửi ────────────────────────────────────────────────────────────────────────────────────
/**
 * Gửi mọi mục tới hạn của `uid`. Gọi tay thì BỎ QUA debounce (`pushProgressAsync` cần chắc
 * chắn server đã nhận trước khi làm bước sau, ví dụ claim nhiệm vụ "thi đạt cấp CEFR").
 *
 * An toàn khi gọi chồng: lượt đang chạy được trả lại thay vì mở lượt thứ hai.
 */
export function flush(uid: string, opts: { resetBackoff?: boolean } = {}): Promise<FlushResult> {
  if (!uid || isGuestId(uid)) return Promise.resolve({ sent: 0, remaining: 0 })
  const timer = debounceTimers.get(uid)
  if (timer) {
    clearTimeout(timer)
    debounceTimers.delete(uid)
  }
  const running = inFlight.get(uid)
  if (running) return running
  const p = runFlush(uid, opts.resetBackoff === true).finally(() => {
    inFlight.delete(uid)
  })
  inFlight.set(uid, p)
  return p
}

async function runFlush(uid: string, resetBackoff: boolean): Promise<FlushResult> {
  if (resetBackoff) {
    const entries = readEntries(uid)
    let changed = false
    for (const e of entries) {
      if (e.tries > 0 || e.nextAt > 0) {
        e.tries = 0
        e.nextAt = 0
        changed = true
      }
    }
    if (changed) writeEntries(uid, entries)
  }
  if (readEntries(uid).length === 0) return { sent: 0, remaining: 0 }
  // Mất mạng: KHÔNG gọi fetch (tránh rác lỗi + tốn pin); sự kiện `online` sẽ gọi lại.
  if (!isOnline()) return { sent: 0, remaining: pending(uid), blocked: 'offline' }
  return withLock(uid, () => sendDueEntries(uid))
}

/**
 * Chỉ MỘT tab được gửi tại một thời điểm (Web Locks) — hai tab cùng chủ gửi cùng lúc sẽ tạo hai
 * request tranh nhau (AC-12). Trình duyệt không có Web Locks thì mỗi tab tự gửi: server merge
 * theo luật bán dàn nên không mất dữ liệu, chỉ tốn thêm một request.
 */
async function withLock(uid: string, fn: () => Promise<FlushResult>): Promise<FlushResult> {
  const locks = (navigator as Navigator & { locks?: LockManager }).locks
  if (!locks || typeof locks.request !== 'function') return fn()
  const result = await locks.request(`dhcb-sync-${uid}`, { ifAvailable: true }, async (lock) =>
    lock ? fn() : null,
  )
  return result ?? { sent: 0, remaining: pending(uid), blocked: 'locked' }
}

async function sendDueEntries(uid: string): Promise<FlushResult> {
  let sent = 0
  let blocked: FlushResult['blocked']

  // Chụp danh sách id tới hạn TRƯỚC vòng lặp; mỗi lượt đọc lại hàng đợi từ localStorage để
  // không ghi đè thay đổi mà tab/luồng khác vừa xếp thêm trong lúc đang gửi.
  const due = readEntries(uid)
    .filter((e) => e.nextAt <= Date.now())
    .map((e) => e.attemptId)

  for (const attemptId of due) {
    const entries = readEntries(uid)
    const entry = entries.find((e) => e.attemptId === attemptId)
    if (!entry) continue
    const handler = handlers.get(entry.kind)
    if (handler?.beforeSend) await handler.beforeSend(uid).catch(() => undefined)
    const request = handler?.buildRequest(uid, entry)
    if (!handler || !request) {
      // Không ai xử lý loại này (mã cũ/đăng ký thiếu) — bỏ mục, đừng giữ rác mãi mãi.
      writeEntries(
        uid,
        entries.filter((e) => e.attemptId !== attemptId),
      )
      continue
    }

    const outcome = await postEntry(request.url, request.body)
    if (outcome.kind === 'ok') {
      writeEntries(
        uid,
        readEntries(uid).filter((e) => e.attemptId !== attemptId),
      )
      sent++
      try {
        await handler.onSuccess?.(uid, entry, outcome.body)
      } catch {
        /* xử lý response lỗi KHÔNG được làm mục đã gửi thành công quay lại hàng đợi */
      }
      continue
    }

    if (outcome.kind === 'drop') {
      // 400/403/404/413…: gửi lại bao nhiêu lần cũng vẫn hỏng — bỏ mục, ghi lại để còn lần ra.
      console.warn(
        `[sync] bỏ mục ${entry.kind} (attemptId ${entry.attemptId}): HTTP ${outcome.status}`,
      )
      writeEntries(
        uid,
        readEntries(uid).filter((e) => e.attemptId !== attemptId),
      )
      continue
    }

    // Còn lại là "thử lại sau": giữ mục, tăng `tries`, lùi theo cấp số nhân có trần.
    const fresh = readEntries(uid)
    const target = fresh.find((e) => e.attemptId === attemptId)
    if (target) {
      target.tries += 1
      target.lastError = outcome.reason
      target.nextAt =
        outcome.reason === 'http_401'
          ? Number.MAX_SAFE_INTEGER // chờ token mới, không lùi vô ích
          : target.tries >= MAX_TRIES
            ? Number.MAX_SAFE_INTEGER // hết lượt tự động: chờ `online`/mở lại app/flush tay
            : Date.now() + backoffMs(target.tries, outcome.retryAfterMs)
      writeEntries(uid, fresh)
    }
    if (outcome.reason === 'http_401') {
      blocked = 'auth'
      break // hết phiên: các mục sau cũng 401, đừng bắn thêm request vô ích
    }
  }

  return { sent, remaining: pending(uid), blocked }
}

/** 2s → 4s → 8s → 16s → 32s (trần 32s); 429 tôn trọng `Retry-After`. */
export function backoffMs(tries: number, retryAfterMs?: number): number {
  if (retryAfterMs !== undefined) return retryAfterMs
  return Math.min(2 ** Math.max(1, tries), 32) * 1000
}

type SendOutcome =
  | { kind: 'ok'; body: unknown }
  | { kind: 'drop'; status: number }
  | { kind: 'retry'; reason: NonNullable<OutboxEntry['lastError']>; retryAfterMs?: number }

async function postEntry(url: string, body: unknown): Promise<SendOutcome> {
  let resp: Response
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(body),
    })
  } catch {
    return { kind: 'retry', reason: 'network' }
  }
  if (resp.ok) {
    let parsed: unknown = null
    try {
      parsed = await resp.json()
    } catch {
      /* response không phải JSON — vẫn tính là đã gửi xong */
    }
    return { kind: 'ok', body: parsed }
  }
  if (resp.status === 401) return { kind: 'retry', reason: 'http_401' }
  if (resp.status === 408) return { kind: 'retry', reason: 'timeout' }
  if (resp.status === 429) {
    const header = Number(resp.headers.get('Retry-After'))
    const retryAfterMs = Number.isFinite(header) && header > 0 ? header * 1000 : 60_000
    return { kind: 'retry', reason: 'http_429', retryAfterMs }
  }
  if (resp.status >= 500) return { kind: 'retry', reason: 'http_5xx' }
  return { kind: 'drop', status: resp.status }
}

// ── Kích hoạt gửi lại ──────────────────────────────────────────────────────────────────────
let activeUid: string | null = null

/**
 * Cho outbox biết ai đang đăng nhập, để các sự kiện toàn cục (`online`, `visibilitychange`,
 * `storage`) biết nên gửi hàng đợi của AI. Đăng xuất → gọi `setActiveUid(null)`: hàng đợi của
 * chủ cũ vẫn nằm nguyên, chỉ là không ai gửi hộ nữa.
 */
export function setActiveUid(uid: string | null): void {
  activeUid = uid && !isGuestId(uid) ? uid : null
  if (activeUid) void flush(activeUid, { resetBackoff: true })
}

export function getActiveUid(): string | null {
  return activeUid
}

function onWake(): void {
  if (activeUid) void flush(activeUid, { resetBackoff: true })
}

function onVisible(): void {
  if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return
  onWake()
}

function onStorage(ev: StorageEvent): void {
  // Tab khác vừa đổi hàng đợi (gửi xong hoặc xếp thêm) → báo giao diện vẽ lại số mục chờ.
  if (!ev.key || !ev.key.startsWith('dhcb_sync_outbox_')) return
  const uid = ev.key.slice('dhcb_sync_outbox_'.length)
  notify(uid)
  if (activeUid === uid && pending(uid) > 0) void flush(uid)
}

let listenersBound = false
export function bindOutboxListeners(): void {
  if (listenersBound || typeof window === 'undefined') return
  listenersBound = true
  window.addEventListener('online', onWake)
  window.addEventListener('storage', onStorage)
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible)
}

/** Chỉ dùng trong test: gỡ toàn bộ trạng thái trong bộ nhớ của module. */
export function __resetOutboxForTests(): void {
  for (const t of debounceTimers.values()) clearTimeout(t)
  debounceTimers.clear()
  inFlight.clear()
  subscribers.clear()
  handlers.clear()
  memoryQueues.clear()
  activeUid = null
}

bindOutboxListeners()
