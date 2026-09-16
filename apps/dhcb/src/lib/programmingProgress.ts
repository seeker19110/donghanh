// programmingProgress — tiến độ bài học môn Lập trình phía client (PR-L3).
// Nguồn sự thật: server (/api/programming/progress, schema programming.*); localStorage chỉ
// là bộ đệm hiển thị nhanh/ngoại tuyến — cùng mô hình với sổ tay lỗi sai (mistakes.ts).
import { getAuthHeader } from '@core/authHeader'
import { isGuestId } from '@core/guestId'

export interface ProgrammingLessonProgress {
  lessonId: string
  status: 'in_progress' | 'completed'
  completedAt: number | null
}

const cacheKey = (uid: string) => `dhcb_prog_progress_${uid}`

function readCache(uid: string): ProgrammingLessonProgress[] {
  try {
    const raw = localStorage.getItem(cacheKey(uid))
    return raw ? (JSON.parse(raw) as ProgrammingLessonProgress[]) : []
  } catch {
    return []
  }
}

function writeCache(uid: string, lessons: ProgrammingLessonProgress[]): void {
  try {
    localStorage.setItem(cacheKey(uid), JSON.stringify(lessons))
  } catch {
    // localStorage đầy/bị chặn — bỏ qua, server vẫn là nguồn sự thật.
  }
}

/** Đọc tiến độ: trả cache ngay nếu server lỗi (ngoại tuyến vẫn xem được). */
export async function fetchProgress(uid: string): Promise<ProgrammingLessonProgress[]> {
  // Khách vãng lai: localStorage LÀ nguồn sự thật (không có tài khoản để lưu server).
  if (isGuestId(uid)) return readCache(uid)
  try {
    const res = await fetch('/api/programming/progress', { headers: getAuthHeader() })
    if (!res.ok) return readCache(uid)
    const body = (await res.json()) as { lessons: ProgrammingLessonProgress[] }
    writeCache(uid, body.lessons)
    return body.lessons
  } catch {
    return readCache(uid)
  }
}

/** Ghi tiến độ 1 bài: cập nhật cache lạc quan rồi đẩy server (lỗi mạng không chặn UI). */
export async function saveLessonProgress(
  uid: string,
  lessonId: string,
  status: 'in_progress' | 'completed',
): Promise<void> {
  const lessons = readCache(uid)
  const existing = lessons.find((l) => l.lessonId === lessonId)
  // Giữ bất biến như server: completed không bị kéo lùi.
  if (existing) {
    if (existing.status !== 'completed') {
      existing.status = status
      existing.completedAt = status === 'completed' ? Date.now() : existing.completedAt
    }
  } else {
    lessons.push({ lessonId, status, completedAt: status === 'completed' ? Date.now() : null })
  }
  writeCache(uid, lessons)
  if (isGuestId(uid)) return // khách: đã ghi localStorage, không có gì để đẩy lên
  try {
    await fetch('/api/programming/progress', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ lessonId, status }),
    })
  } catch {
    // Ngoại tuyến: cache đã ghi, lần fetchProgress sau server sẽ là nguồn sự thật.
  }
}

/**
 * Như `fetchProgress`, nhưng NÓI RÕ lần đọc này có tới được server không.
 *
 * Vì sao cần: `fetchProgress` cố tình nuốt lỗi và trả cache — đúng cho danh sách bài (thà
 * hiện số cũ còn hơn trắng trang). Nhưng mục lục phải phân biệt "chưa học" với "CHƯA ĐO
 * ĐƯỢC": vẽ một dãy ○ "chưa học" trong khi thật ra vừa mất mạng là nói dối người học. Nơi
 * gọi lấy `state:'error'` để chuyển mọi lá về `unknown` và hiện dòng "Thử lại".
 *
 * Khách vãng lai luôn `ready`: localStorage LÀ nguồn sự thật của họ, không có gì để hỏng.
 */
export async function fetchProgressWithState(
  uid: string,
): Promise<{ lessons: ProgrammingLessonProgress[]; state: 'ready' | 'error' }> {
  if (isGuestId(uid)) return { lessons: readCache(uid), state: 'ready' }
  try {
    const res = await fetch('/api/programming/progress', { headers: getAuthHeader() })
    if (!res.ok) return { lessons: readCache(uid), state: 'error' }
    const body = (await res.json()) as { lessons: ProgrammingLessonProgress[] }
    writeCache(uid, body.lessons)
    return { lessons: body.lessons, state: 'ready' }
  } catch {
    return { lessons: readCache(uid), state: 'error' }
  }
}

export function isLessonCompleted(
  lessons: readonly ProgrammingLessonProgress[],
  lessonId: string,
): boolean {
  return lessons.some((l) => l.lessonId === lessonId && l.status === 'completed')
}
