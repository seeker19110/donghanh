// packages/core-domains/domainReadModelService.ts
//
// Read model TÓM TẮT cho 4 trụ Career · Work · Startup · Life, để Bạn Đồng Hành (Companion)
// NHÌN THẤY dữ liệu của các trụ đó khi trò chuyện.
//
// [2026-09-20] Ba trụ Career · Startup · Life đã bị GỠ KHỎI GIAO DIỆN (không còn trang, route,
// client API nào) nhưng read model của chúng GIỮ NGUYÊN ở đây: dữ liệu người dùng đã nhập vẫn
// nằm trong CSDL, và Companion vẫn nên đọc được nó khi trò chuyện. Không có đường nào để nhập
// thêm dữ liệu mới cho ba trụ đó nữa — với người dùng mới các read model này đơn giản là rỗng.
// Trụ `work` nay mang tên hiển thị "Ghi chú".
//
// Vì sao cần: trước đây chỉ trụ Learning có read model nạp vào ngữ cảnh
// (`core-learner/learningReadModelService`), nên Companion — vốn được mô tả là "tác tử AI
// xuyên suốt 5 trụ" — trả lời câu hỏi về sự nghiệp/công việc/khởi nghiệp/đời sống mà KHÔNG
// biết gì về dữ liệu người dùng đã nhập ở đúng những trụ đó.
//
// PHẠM VI CỦA FILE NÀY LÀ CHỈ-ĐỌC. Không có hàm nào ghi/sửa/xoá. Companion đọc để trả lời
// cho đúng ngữ cảnh, còn muốn THAY ĐỔI dữ liệu 4 trụ thì vẫn phải đi qua luồng
// `proposedActionService` (người dùng bấm xác nhận) như mọi hành động có rủi ro khác.
//
// RIÊNG TƯ: mặc định các hàm dưới đây chỉ trả về SỐ ĐẾM, TRẠNG THÁI và TIÊU ĐỀ ngắn. KHÔNG lấy
// nội dung tự do nhạy cảm — cụ thể là `notes` của `wellbeing_checks` (nhật ký cảm xúc) và
// `description` dài của dự án/venture.
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

import {
  getOrCreateCareerProfile,
  listCareerExperiences,
  listCareerGoals,
} from './careerService.js'
import { listWorkDocuments, listWorkProjects, listWorkTasks } from './workService.js'
import { listVentures, listHypotheses, listProblems } from './startupService.js'
import { listLifePlans, listHabits, listWellbeingChecks } from './lifeFoundationService.js'

/** Các trụ có read model ở file này (Learning nằm ở `core-learner`, không thuộc đây). */
export const DOMAIN_READ_MODEL_DOMAINS = ['career', 'work', 'startup', 'life'] as const
export type DomainReadModelDomain = (typeof DOMAIN_READ_MODEL_DOMAINS)[number]

export function isDomainReadModelDomain(domain: string): domain is DomainReadModelDomain {
  return (DOMAIN_READ_MODEL_DOMAINS as readonly string[]).includes(domain)
}

// ---------------------------------------------------------------------------
// Career
// ---------------------------------------------------------------------------

export interface CareerReadModel {
  targetRole: string
  currentTitle?: string
  yearsOfExperience: number
  industry?: string
  experienceCount: number
  activeGoalCount: number
  /** Kỹ năng của MỤC TIÊU đang theo đuổi gần nhất — tối đa 5 cái, chỉ để gợi mạch trò chuyện. */
  topRequiredSkills: string[]
}

export function formatCareerReadModelForContext(model: CareerReadModel): string {
  const parts: string[] = [
    '[Domain: Career]',
    `Vị trí hiện tại: ${model.currentTitle ?? 'Chưa khai'}`,
    `Vị trí mục tiêu: ${model.targetRole}`,
    `Số năm kinh nghiệm: ${model.yearsOfExperience}`,
  ]
  if (model.industry) parts.push(`Ngành: ${model.industry}`)
  parts.push(`Kinh nghiệm đã ghi: ${model.experienceCount}`)
  parts.push(`Mục tiêu đang theo đuổi: ${model.activeGoalCount}`)
  if (model.topRequiredSkills.length > 0) {
    parts.push(`Kỹ năng mục tiêu cần: ${model.topRequiredSkills.join(', ')}`)
  }
  return parts.join(' | ')
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
// Startup
// ---------------------------------------------------------------------------

export interface StartupReadModel {
  ventureCount: number
  /** Tên + giai đoạn của venture mới nhất (nếu có) — đủ để Companion gọi đúng tên dự án. */
  latestVentureName?: string
  latestVentureStage?: string
  /** Vấn đề & giả định ĐẾM THEO VENTURE GẦN NHẤT (chúng gắn theo venture, không theo người). */
  problemCount: number
  hypothesisCountByStatus: Record<'unverified' | 'supported' | 'refuted' | 'pivoted', number>
}

export function formatStartupReadModelForContext(model: StartupReadModel): string {
  const h = model.hypothesisCountByStatus
  const parts: string[] = ['[Domain: Startup]', `Số venture: ${model.ventureCount}`]
  if (model.latestVentureName) {
    parts.push(
      `Venture gần nhất: "${model.latestVentureName}" (giai đoạn ${model.latestVentureStage ?? 'chưa rõ'})`,
    )
  }
  parts.push(`Vấn đề đã ghi: ${model.problemCount}`)
  parts.push(
    `Giả định — chưa kiểm ${h.unverified} / được ủng hộ ${h.supported} / bị bác ${h.refuted} / đã xoay ${h.pivoted}`,
  )
  return parts.join(' | ')
}

// ---------------------------------------------------------------------------
// Life
// ---------------------------------------------------------------------------

export interface LifeReadModel {
  activePlanCount: number
  activeHabitCount: number
  bestCurrentStreak: number
  /** Điểm tự chấm gần nhất. KHÔNG kèm `notes` — đó là nhật ký cảm xúc, không đưa vào ngữ cảnh. */
  latestWellbeing?: { moodScore: number; energyScore: number; stressScore: number }
}

export function formatLifeReadModelForContext(model: LifeReadModel): string {
  const parts: string[] = [
    '[Domain: Life]',
    `Kế hoạch đang chạy: ${model.activePlanCount}`,
    `Thói quen đang duy trì: ${model.activeHabitCount}`,
  ]
  if (model.bestCurrentStreak > 0) parts.push(`Chuỗi ngày dài nhất: ${model.bestCurrentStreak}`)
  if (model.latestWellbeing) {
    const w = model.latestWellbeing
    parts.push(
      `Tự chấm gần nhất — tâm trạng ${w.moodScore}/10, năng lượng ${w.energyScore}/10, căng thẳng ${w.stressScore}/10`,
    )
  }
  return parts.join(' | ')
}

// ---------------------------------------------------------------------------
// Nạp dữ liệu
// ---------------------------------------------------------------------------

export async function getCareerReadModel(pool: Pool, personId: string): Promise<CareerReadModel> {
  const [profile, experiences, activeGoals] = await Promise.all([
    getOrCreateCareerProfile(pool, personId),
    listCareerExperiences(pool, personId),
    listCareerGoals(pool, personId, 'active'),
  ])
  const model: CareerReadModel = {
    targetRole: profile.targetRole,
    yearsOfExperience: profile.yearsOfExperience,
    experienceCount: experiences.length,
    activeGoalCount: activeGoals.length,
    topRequiredSkills: (activeGoals[0]?.skillsRequired ?? []).slice(0, 5),
  }
  if (profile.currentTitle) model.currentTitle = profile.currentTitle
  if (profile.industry) model.industry = profile.industry
  return model
}

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

export async function getStartupReadModel(pool: Pool, personId: string): Promise<StartupReadModel> {
  const ventures = await listVentures(pool, personId)
  const hypothesisCountByStatus = { unverified: 0, supported: 0, refuted: 0, pivoted: 0 }
  const model: StartupReadModel = {
    ventureCount: ventures.length,
    problemCount: 0,
    hypothesisCountByStatus,
  }

  // listVentures sắp xếp mới nhất trước (order by created_at desc) — lấy phần tử đầu.
  const latest = ventures[0]
  if (!latest) return model

  model.latestVentureName = latest.name
  model.latestVentureStage = latest.stage

  // Vấn đề và giả định gắn theo TỪNG VENTURE (chữ ký hàm bắt buộc `ventureId`), không phải
  // theo người. Chỉ đếm cho venture gần nhất — đó cũng là cái người dùng đang nói tới khi
  // mở lời về khởi nghiệp, và tránh gọi N truy vấn cho người có nhiều venture.
  const [problems, hypotheses] = await Promise.all([
    listProblems(pool, personId, latest.id),
    listHypotheses(pool, personId, latest.id),
  ])
  model.problemCount = problems.length
  for (const h of hypotheses) hypothesisCountByStatus[h.status] += 1
  return model
}

export async function getLifeReadModel(pool: Pool, personId: string): Promise<LifeReadModel> {
  const [plans, habits, checks] = await Promise.all([
    listLifePlans(pool, personId),
    listHabits(pool, personId),
    listWellbeingChecks(pool, personId),
  ])
  const activeHabits = habits.filter((h) => h.isActive)
  const model: LifeReadModel = {
    activePlanCount: plans.filter((p) => p.status === 'active').length,
    activeHabitCount: activeHabits.length,
    bestCurrentStreak: activeHabits.reduce((max, h) => Math.max(max, h.currentStreak), 0),
  }
  const latest = checks[0]
  if (latest) {
    model.latestWellbeing = {
      moodScore: latest.moodScore,
      energyScore: latest.energyScore,
      stressScore: latest.stressScore,
    }
  }
  return model
}

/**
 * Trả về chuỗi tóm tắt của MỘT trụ để nạp vào ngữ cảnh Companion, hoặc `null` nếu `domain`
 * không thuộc 4 trụ này. Hàm gọi vẫn phải tự xử lý lỗi truy vấn — xem `companionRuntime`,
 * ở đó hỏng read model thì đi tiếp với ngữ cảnh rỗng chứ không làm hỏng cả lượt trả lời.
 */
export async function getDomainReadModelForContext(
  pool: Pool,
  personId: string,
  domain: string,
): Promise<string | null> {
  switch (domain) {
    case 'career':
      return formatCareerReadModelForContext(await getCareerReadModel(pool, personId))
    case 'work':
      return formatWorkReadModelForContext(await getWorkReadModel(pool, personId))
    case 'startup':
      return formatStartupReadModelForContext(await getStartupReadModel(pool, personId))
    case 'life':
      return formatLifeReadModelForContext(await getLifeReadModel(pool, personId))
    default:
      return null
  }
}
