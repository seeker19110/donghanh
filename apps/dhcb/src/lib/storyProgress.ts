// storyProgress — nhớ truyện ĐANG ĐỌC DỞ để mở lại đúng đoạn đang đọc ("Đọc tiếp").
// Đặc tả: docs/specs/2026-09-24-truyen-doc-tiep.md
//
// VÌ SAO CHỈ localStorage (không đồng bộ qua `learning_progress`): vị trí đọc dở là dữ liệu
// tạm, giá trị thấp khi đổi máy (mở truyện ra đọc từ đầu vẫn đọc được), trong khi đồng bộ
// đa thiết bị cần thêm cột CSDL + migration + nhánh hợp nhất ở server/progressSync.ts — quá
// tay cho tính năng này. Mất dữ liệu (xoá cache, tab ẩn danh) chỉ làm truyện trở về "Bắt đầu".
//
// Vị trí lưu theo CHỈ SỐ ĐOẠN (0-based, theo `groupLinesByParagraph`). Cấu trúc đoạn lấy từ
// `story.lines` — giống hệt nhau ở chiều A (đọc tiếng Anh) và chiều B (đọc tiếng Việt), nên
// một bản ghi dùng chung được cho cả hai chiều học.
import { z } from 'zod'

const STORAGE_KEY = 'et_story_progress'

/** Giữ tối đa bấy nhiêu truyện đọc dở — cũ nhất bị bỏ trước, tránh localStorage phình mãi. */
export const MAX_STORY_PROGRESS_ENTRIES = 30

const StoryProgressSchema = z.object({
  /** Đoạn đang đọc (0-based). Luôn ≥ 1 — đứng ở đoạn 0 thì chẳng có gì để "đọc tiếp". */
  para: z.number().int().min(1),
  /** Tổng số đoạn của truyện lúc lưu — để tính % và phát hiện truyện đã bị sửa ngắn đi. */
  total: z.number().int().min(2),
  /** Mốc lưu (ms) — để bỏ bản ghi cũ nhất khi vượt MAX_STORY_PROGRESS_ENTRIES. */
  updatedAt: z.number(),
})

export type StoryProgress = z.infer<typeof StoryProgressSchema>

/** Đọc toàn bộ map storyId → vị trí. Bản ghi hỏng (sửa tay, phiên bản cũ) bị bỏ qua từng cái. */
export function getAllStoryProgress(): Record<string, StoryProgress> {
  let raw: unknown
  try {
    const text = localStorage.getItem(STORAGE_KEY)
    if (!text) return {}
    raw = JSON.parse(text)
  } catch {
    return {}
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {}
  const out: Record<string, StoryProgress> = {}
  for (const [id, value] of Object.entries(raw)) {
    const parsed = StoryProgressSchema.safeParse(value)
    // `para < total` là bất biến của một bản ghi hợp lệ — sai thì coi như không có.
    if (parsed.success && parsed.data.para < parsed.data.total) out[id] = parsed.data
  }
  return out
}

export function getStoryProgress(storyId: string): StoryProgress | null {
  return getAllStoryProgress()[storyId] ?? null
}

function writeAll(map: Record<string, StoryProgress>): void {
  try {
    if (Object.keys(map).length === 0) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // localStorage đầy/bị chặn — bỏ qua: mất "Đọc tiếp" không làm hỏng việc đọc truyện.
  }
}

/** Xoá trạng thái đọc dở (đọc xong hết, hoặc người học chọn "Đọc lại từ đầu"). */
export function clearStoryProgress(storyId: string): void {
  const map = getAllStoryProgress()
  if (!(storyId in map)) return
  delete map[storyId]
  writeAll(map)
}

/**
 * Ghi vị trí đọc của một truyện.
 * - `para` ≤ 0 (chưa đọc / quay lại đầu truyện) → xoá bản ghi: không có gì để "đọc tiếp".
 * - `para` ≥ đoạn cuối (`total - 1`) → coi như ĐÃ ĐỌC XONG → xoá bản ghi.
 * - Còn lại → lưu, và cắt bớt bản ghi cũ nhất nếu vượt MAX_STORY_PROGRESS_ENTRIES.
 */
export function saveStoryProgress(
  storyId: string,
  para: number,
  total: number,
  now: number = Date.now(),
): void {
  if (!Number.isInteger(para) || !Number.isInteger(total) || para <= 0 || para >= total - 1) {
    clearStoryProgress(storyId)
    return
  }
  const map = getAllStoryProgress()
  map[storyId] = { para, total, updatedAt: now }
  const ids = Object.keys(map)
  if (ids.length > MAX_STORY_PROGRESS_ENTRIES) {
    ids
      .sort((a, b) => (map[a]?.updatedAt ?? 0) - (map[b]?.updatedAt ?? 0))
      .slice(0, ids.length - MAX_STORY_PROGRESS_ENTRIES)
      .forEach((id) => delete map[id])
  }
  writeAll(map)
}

/**
 * Phần trăm đã đọc để hiện trên thẻ truyện, kẹp trong [1, 99]: đã có bản ghi nghĩa là đã
 * đọc được một phần (không hiện 0%) và chưa xong (không hiện 100%).
 */
export function storyProgressPercent(p: StoryProgress): number {
  const pct = Math.round((p.para / p.total) * 100)
  return Math.min(99, Math.max(1, pct))
}
