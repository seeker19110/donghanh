// syncOutboxSender.ts — PHẦN GỬI của hàng đợi đồng bộ (tách khỏi `syncOutbox.ts` 2026-09-16).
//
// Vì sao tách: đường XẾP HÀNG (`enqueue`) phải nằm trong chunk khởi động vì mọi thao tác lưu
// tiến độ đều gọi tới. Đường GỬI thì không — nó chỉ chạy khi tới hạn gửi, và vốn đã bất đồng bộ.
// Để cả hai chung một module thì `Initial JS` vượt trần 140 kB (đo thật ở CI, PR #984). `flush()`
// nạp module này bằng `import()` động nên nó thành chunk riêng.
//
// Module này KHÔNG giữ trạng thái riêng — mọi thứ vẫn đọc/ghi qua `syncOutbox.ts`.
import { getAuthHeader } from '@core/authHeader'
import {
  MAX_TRIES,
  backoffMs,
  handlers,
  pending,
  readEntries,
  writeEntries,
  type FlushResult,
  type OutboxEntry,
} from './syncOutbox.js'

/**
 * Chỉ MỘT tab được gửi tại một thời điểm (Web Locks) — hai tab cùng chủ gửi cùng lúc sẽ tạo hai
 * request tranh nhau (AC-12). Trình duyệt không có Web Locks thì mỗi tab tự gửi: server merge
 * theo luật bán dàn nên không mất dữ liệu, chỉ tốn thêm một request.
 */
export async function withLock(uid: string, fn: () => Promise<FlushResult>): Promise<FlushResult> {
  const locks = (navigator as Navigator & { locks?: LockManager }).locks
  if (!locks || typeof locks.request !== 'function') return fn()
  const result = await locks.request(`dhcb-sync-${uid}`, { ifAvailable: true }, async (lock) =>
    lock ? fn() : null,
  )
  return result ?? { sent: 0, remaining: pending(uid), blocked: 'locked' }
}

export async function sendDueEntries(uid: string): Promise<FlushResult> {
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
