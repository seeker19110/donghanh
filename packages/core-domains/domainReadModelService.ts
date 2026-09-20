// packages/core-domains/domainReadModelService.ts
//
// Read model TÓM TẮT cho trụ "Ghi chú" (khoá kỹ thuật `work`), để Bạn Đồng Hành (Companion)
// NHÌN THẤY dữ liệu người dùng đã nhập ở trụ đó khi trò chuyện.
//
// [2026-09-20] Ba trụ Career · Startup · Life đã bị XOÁ HẲN — giao diện gỡ trước đó, nay gỡ
// luôn service, route API và bảng CSDL (migration `0085_drop_career_startup_life.sql`, quyết
// định của chủ dự án). Companion vì thế KHÔNG còn tư vấn xuyên trụ ở ba mảng đó nữa. File này
// chỉ còn read model của trụ `work`; các trụ khác trả về `null` ở
// `getDomainReadModelForContext` và `companionRuntime` đi tiếp với ngữ cảnh rỗng.
//
// Vì sao cần: trước đây chỉ trụ Learning có read model nạp vào ngữ cảnh
// (`core-learner/learningReadModelService`), nên Companion trả lời câu hỏi về ghi chú/công
// việc mà KHÔNG biết gì về dữ liệu người dùng đã nhập ở đúng trụ đó.
//
// PHẠM VI CỦA FILE NÀY LÀ CHỈ-ĐỌC. Không có hàm nào ghi/sửa/xoá. Companion đọc để trả lời
// cho đúng ngữ cảnh, còn muốn THAY ĐỔI dữ liệu thì vẫn phải đi qua luồng
// `proposedActionService` (người dùng bấm xác nhận) như mọi hành động có rủi ro khác.
//
// MỘT NGOẠI LỆ CÓ CHỦ Ý (2026-09-20, yêu cầu của chủ dự án): trụ "Ghi chú" (`work`) ĐƯA NỘI
// DUNG ghi chú vào ngữ cảnh — vì đó chính là điều người dùng muốn Bạn Đồng Hành đọc được khi
// trò chuyện. Nội dung này vẫn đi qua đúng những cổng cũ: `isConsentActive(personId, 'work',
// purpose)` ở `contextEngine`, và độ nhạy `personal` của `domainState`. Để không nuốt hết ngân
// sách token của một lượt trò chuyện, chỉ lấy `NOTE_CONTEXT_LIMIT` ghi chú mới nhất và cắt mỗi
// cái ở `NOTE_CONTEXT_EXCERPT` ký tự. Việc chuỗi tóm tắt này có được nạp vào ngữ cảnh hay
// không còn phụ thuộc cổng `isConsentActive(personId, domain, purpose)` ở `contextEngine` —
// file này KHÔNG tự quyết định thay cổng đó.
import type { Pool } from 'pg'

import { listWorkDocuments, listWorkProjects, listWorkTasks } from './workService.js'

/** Các trụ có read model ở file này (Learning nằm ở `core-learner`, không thuộc đây). */
export const DOMAIN_READ_MODEL_DOMAINS = ['work'] as const
export type DomainReadModelDomain = (typeof DOMAIN_READ_MODEL_DOMAINS)[number]

export function isDomainReadModelDomain(domain: string): domain is DomainReadModelDomain {
  return (DOMAIN_READ_MODEL_DOMAINS as readonly string[]).includes(domain)
}

// ---------------------------------------------------------------------------
// Work
// ---------------------------------------------------------------------------

/** Số ghi chú MỚI NHẤT được nạp vào ngữ cảnh một lượt trò chuyện. */
export const NOTE_CONTEXT_LIMIT = 5

/** Số ký tự tối đa lấy từ MỘT ghi chú (nội dung đầy đủ có thể tới 10.000 ký tự). */
export const NOTE_CONTEXT_EXCERPT = 400

export interface WorkReadModel {
  activeProjectCount: number
  taskCountByStatus: Record<'todo' | 'in_progress' | 'blocked' | 'done', number>
  /** Việc CHƯA xong mà đã quá hạn — con số đáng nói nhất khi mở đầu câu chuyện công việc. */
  overdueTaskCount: number
  urgentOpenTaskCount: number
  /** Tiêu đề việc CHƯA xong, mới nhất trước — để Companion gọi đúng tên việc đang tồn đọng. */
  openTaskTitles: string[]
  /** Ghi chú mới nhất kèm NỘI DUNG đã cắt ngắn (xem ghi chú "RIÊNG TƯ" ở đầu file). */
  recentNotes: { title: string; excerpt: string; truncated: boolean }[]
}

/** Cắt một chuỗi ở `max` ký tự, gọn khoảng trắng để không nạp rác vào ngữ cảnh. */
export function excerptNote(
  raw: string,
  max = NOTE_CONTEXT_EXCERPT,
): { text: string; truncated: boolean } {
  const clean = raw.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return { text: clean, truncated: false }
  return { text: clean.slice(0, max), truncated: true }
}

export function formatWorkReadModelForContext(model: WorkReadModel): string {
  const s = model.taskCountByStatus
  // Nhãn hiển thị là "Ghi chú" (tên trụ từ 2026-09-20); khoá kỹ thuật vẫn là `work` vì API
  // (`/api/work`), bảng CSDL (`worklife.*`) và bản ghi consent đã phát hành đều mang tên đó.
  const parts: string[] = [
    '[Domain: Ghi chú]',
    `Dự án đang chạy: ${model.activeProjectCount}`,
    `Việc — chờ làm ${s.todo} / đang làm ${s.in_progress} / bị chặn ${s.blocked} / xong ${s.done}`,
  ]
  if (model.overdueTaskCount > 0) parts.push(`Quá hạn: ${model.overdueTaskCount}`)
  if (model.urgentOpenTaskCount > 0) parts.push(`Khẩn cấp chưa xong: ${model.urgentOpenTaskCount}`)
  if (model.openTaskTitles.length > 0) {
    parts.push(`Việc chưa xong: ${model.openTaskTitles.map((t) => `"${t}"`).join(', ')}`)
  }
  const head = parts.join(' | ')
  if (model.recentNotes.length === 0) return head
  // Ghi chú xuống DÒNG RIÊNG, không nhét vào chuỗi ' | ': nội dung tự do có thể chứa dấu gạch
  // đứng, nhồi chung thì mô hình đọc nhầm ranh giới giữa các trường.
  const noteLines = model.recentNotes.map(
    (n) => `- "${n.title}": ${n.excerpt}${n.truncated ? '…' : ''}`,
  )
  return `${head}\nGhi chú gần đây (${model.recentNotes.length}):\n${noteLines.join('\n')}`
}

// ---------------------------------------------------------------------------
// Nạp dữ liệu
// ---------------------------------------------------------------------------

export async function getWorkReadModel(pool: Pool, personId: string): Promise<WorkReadModel> {
  const [projects, tasks, documents] = await Promise.all([
    listWorkProjects(pool, personId),
    listWorkTasks(pool, personId),
    listWorkDocuments(pool, personId),
  ])
  const taskCountByStatus = { todo: 0, in_progress: 0, blocked: 0, done: 0 }
  let overdueTaskCount = 0
  let urgentOpenTaskCount = 0
  const now = Date.now()
  for (const t of tasks) {
    taskCountByStatus[t.status] += 1
    const isOpen = t.status !== 'done'
    // Quá hạn chỉ tính cho việc CHƯA xong — việc đã xong muộn thì không còn là việc phải lo.
    if (isOpen && t.dueAt && Date.parse(t.dueAt) < now) overdueTaskCount += 1
    if (isOpen && t.priority === 'urgent') urgentOpenTaskCount += 1
  }
  return {
    activeProjectCount: projects.filter((p) => p.status === 'active').length,
    taskCountByStatus,
    overdueTaskCount,
    urgentOpenTaskCount,
    // `listWorkTasks` sắp xếp mới nhất trước — cắt sau khi LỌC việc chưa xong, nếu cắt trước
    // thì người có nhiều việc đã xong sẽ ra danh sách rỗng dù còn việc tồn đọng.
    openTaskTitles: tasks
      .filter((t) => t.status !== 'done')
      .slice(0, NOTE_CONTEXT_LIMIT)
      .map((t) => t.title),
    recentNotes: documents.slice(0, NOTE_CONTEXT_LIMIT).map((d) => {
      const { text, truncated } = excerptNote(d.summary)
      return { title: d.title, excerpt: text, truncated }
    }),
  }
}

/**
 * Trả về chuỗi tóm tắt của MỘT trụ để nạp vào ngữ cảnh Companion, hoặc `null` nếu `domain`
 * không có read model ở đây. Hàm gọi vẫn phải tự xử lý lỗi truy vấn — xem `companionRuntime`,
 * ở đó hỏng read model thì đi tiếp với ngữ cảnh rỗng chứ không làm hỏng cả lượt trả lời.
 */
export async function getDomainReadModelForContext(
  pool: Pool,
  personId: string,
  domain: string,
): Promise<string | null> {
  switch (domain) {
    case 'work':
      return formatWorkReadModelForContext(await getWorkReadModel(pool, personId))
    default:
      return null
  }
}
