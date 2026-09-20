// packages/core-domains/domainReadModelService.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Pool } from 'pg'

import {
  formatWorkReadModelForContext,
  getWorkReadModel,
  excerptNote,
  NOTE_CONTEXT_LIMIT,
  NOTE_CONTEXT_EXCERPT,
  getDomainReadModelForContext,
  isDomainReadModelDomain,
} from './domainReadModelService.js'

const listWorkProjects = vi.fn()
const listWorkTasks = vi.fn()
const listWorkDocuments = vi.fn()
vi.mock('./workService.js', () => ({
  listWorkProjects: (...a: unknown[]) => listWorkProjects(...a),
  listWorkTasks: (...a: unknown[]) => listWorkTasks(...a),
  listWorkDocuments: (...a: unknown[]) => listWorkDocuments(...a),
}))

const pool = {} as unknown as Pool
const PERSON = '11111111-1111-4111-8111-111111111111'

beforeEach(() => {
  vi.clearAllMocks()
  // Mặc định KHÔNG có ghi chú nào: mọi ca cũ phải chạy được y như trước khi nối nguồn này vào.
  listWorkDocuments.mockResolvedValue([])
})

describe('isDomainReadModelDomain', () => {
  it('chỉ còn trụ work (career/startup/life đã xoá 2026-09-20), từ chối Learning', () => {
    expect(isDomainReadModelDomain('work')).toBe(true)
    for (const removed of ['career', 'startup', 'life']) {
      expect(isDomainReadModelDomain(removed)).toBe(false)
    }
    expect(isDomainReadModelDomain('learning')).toBe(false)
    expect(isDomainReadModelDomain('general')).toBe(false)
  })
})

describe('Work read model', () => {
  it('đếm việc theo trạng thái, chỉ tính QUÁ HẠN cho việc chưa xong', async () => {
    const past = new Date(Date.now() - 86_400_000).toISOString()
    listWorkProjects.mockResolvedValue([
      { status: 'active' },
      { status: 'active' },
      { status: 'archived' },
    ])
    listWorkTasks.mockResolvedValue([
      { status: 'todo', priority: 'urgent', dueAt: past },
      { status: 'in_progress', priority: 'high', dueAt: past },
      { status: 'blocked', priority: 'low' },
      // Đã xong nhưng quá hạn — KHÔNG được tính là quá hạn nữa.
      { status: 'done', priority: 'urgent', dueAt: past },
    ])

    const m = await getWorkReadModel(pool, PERSON)
    expect(m.activeProjectCount).toBe(2)
    expect(m.taskCountByStatus).toEqual({ todo: 1, in_progress: 1, blocked: 1, done: 1 })
    expect(m.overdueTaskCount).toBe(2)
    expect(m.urgentOpenTaskCount).toBe(1)
  })

  it('không có việc nào → mọi ô đếm bằng 0, chuỗi vẫn dựng được', async () => {
    listWorkProjects.mockResolvedValue([])
    listWorkTasks.mockResolvedValue([])
    const m = await getWorkReadModel(pool, PERSON)
    expect(m.overdueTaskCount).toBe(0)
    expect(m.recentNotes).toEqual([])
    const text = formatWorkReadModelForContext(m)
    expect(text).toContain('Dự án đang chạy: 0')
    // Không có ghi chú thì KHÔNG in mục "Ghi chú gần đây" rỗng — đó là rác trong ngữ cảnh.
    expect(text).not.toContain('Ghi chú gần đây')
  })
})

// [2026-09-20] Nội dung ghi chú được nạp vào ngữ cảnh Bạn Đồng Hành — yêu cầu của chủ dự án.
describe('Ghi chú trong ngữ cảnh Companion', () => {
  beforeEach(() => {
    listWorkProjects.mockResolvedValue([])
  })

  it('nạp nội dung ghi chú và tiêu đề việc CHƯA xong vào chuỗi ngữ cảnh', async () => {
    listWorkTasks.mockResolvedValue([
      { status: 'todo', priority: 'high', title: 'Gọi cho khách hàng A' },
      { status: 'done', priority: 'low', title: 'Việc đã xong' },
    ])
    listWorkDocuments.mockResolvedValue([
      { title: 'Biên bản họp thứ Hai', summary: 'Chốt giá gói VIP và ngày ra mắt.' },
    ])

    const m = await getWorkReadModel(pool, PERSON)
    expect(m.openTaskTitles).toEqual(['Gọi cho khách hàng A'])
    expect(m.recentNotes).toEqual([
      {
        title: 'Biên bản họp thứ Hai',
        excerpt: 'Chốt giá gói VIP và ngày ra mắt.',
        truncated: false,
      },
    ])

    const text = formatWorkReadModelForContext(m)
    expect(text).toContain('Gọi cho khách hàng A')
    expect(text).toContain('Biên bản họp thứ Hai')
    expect(text).toContain('Chốt giá gói VIP và ngày ra mắt.')
    // Việc ĐÃ xong không được lọt vào danh sách việc tồn đọng.
    expect(text).not.toContain('Việc đã xong')
  })

  it('chỉ lấy NOTE_CONTEXT_LIMIT ghi chú mới nhất — không nuốt hết ngân sách token', async () => {
    listWorkTasks.mockResolvedValue([])
    listWorkDocuments.mockResolvedValue(
      // `listWorkDocuments` sắp xếp mới nhất trước, nên phần tử đầu là mới nhất.
      Array.from({ length: NOTE_CONTEXT_LIMIT + 3 }, (_, i) => ({
        title: `Ghi chú ${i}`,
        summary: `nội dung ${i}`,
      })),
    )
    const m = await getWorkReadModel(pool, PERSON)
    expect(m.recentNotes).toHaveLength(NOTE_CONTEXT_LIMIT)
    expect(m.recentNotes[0]?.title).toBe('Ghi chú 0')
  })

  it('ghi chú dài 10.000 ký tự bị CẮT ở NOTE_CONTEXT_EXCERPT và đánh dấu truncated', async () => {
    listWorkTasks.mockResolvedValue([])
    listWorkDocuments.mockResolvedValue([{ title: 'Ghi chú dài', summary: 'x'.repeat(10_000) }])
    const m = await getWorkReadModel(pool, PERSON)
    expect(m.recentNotes[0]?.excerpt).toHaveLength(NOTE_CONTEXT_EXCERPT)
    expect(m.recentNotes[0]?.truncated).toBe(true)
    expect(formatWorkReadModelForContext(m)).toContain('…')
  })

  it('excerptNote gộp khoảng trắng, ca biên đúng bằng ngưỡng thì KHÔNG cắt', () => {
    expect(excerptNote('  a\n\n  b  ').text).toBe('a b')
    const vua = 'y'.repeat(NOTE_CONTEXT_EXCERPT)
    expect(excerptNote(vua)).toEqual({ text: vua, truncated: false })
    expect(excerptNote('y'.repeat(NOTE_CONTEXT_EXCERPT + 1)).truncated).toBe(true)
  })
})

describe('getDomainReadModelForContext', () => {
  it('trụ không thuộc nhóm này → trả null (để bên gọi bỏ qua)', async () => {
    await expect(getDomainReadModelForContext(pool, PERSON, 'learning')).resolves.toBeNull()
    await expect(getDomainReadModelForContext(pool, PERSON, 'general')).resolves.toBeNull()
    // Ba trụ đã xoá hẳn: phải trả null chứ không được ném lỗi làm hỏng cả lượt trò chuyện.
    await expect(getDomainReadModelForContext(pool, PERSON, 'career')).resolves.toBeNull()
    await expect(getDomainReadModelForContext(pool, PERSON, 'startup')).resolves.toBeNull()
    await expect(getDomainReadModelForContext(pool, PERSON, 'life')).resolves.toBeNull()
  })

  it('điều phối đúng trụ work', async () => {
    listWorkProjects.mockResolvedValue([])
    listWorkTasks.mockResolvedValue([])
    const text = await getDomainReadModelForContext(pool, PERSON, 'work')
    // Nhãn hiển thị đổi sang 'Ghi chú' 2026-09-20; khoá kỹ thuật vẫn là 'work'.
    expect(text).toContain('[Domain: Ghi chú]')
  })
})
