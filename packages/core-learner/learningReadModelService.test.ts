// packages/core-learner/learningReadModelService.test.ts — Unit tests for Learning Domain Read Model Service.
import { describe, expect, it, vi } from 'vitest'
import type { Pool } from 'pg'
import {
  getLearningReadModel,
  formatLearningReadModelForContext,
} from './learningReadModelService.js'

const PERSON_ID = '11111111-1111-4111-8111-111111111111'
const USER_ID = 'user-1'

/** Fixture pool: mock hai câu query theo đúng THỨ TỰ service gọi (profiles rồi learning_progress). */
function poolWithRows(profileRows: unknown[], progressRows: unknown[]): Pool {
  return {
    query: vi
      .fn()
      .mockResolvedValueOnce({ rows: profileRows })
      .mockResolvedValueOnce({ rows: progressRows }),
  } as unknown as Pool
}

describe('getLearningReadModel', () => {
  it('builds LearningReadModel accurately từ cột THẬT learned/srs/placement/updated_at', async () => {
    const model = await getLearningReadModel(
      poolWithRows(
        [{ onboarded: true, goal: 'Luyện thi IELTS', daily_minutes: 20 }],
        [
          {
            learned: ['apple', 'banana'],
            srs: {
              apple: { reps: 3, due: Date.now() - 1000 }, // đã thuộc, không tính inProgress
              cherry: { reps: 1, due: Date.now() - 1000 }, // chưa thuộc, đã đến hạn
              durian: { reps: 1, due: Date.now() + 1_000_000 }, // chưa thuộc, chưa đến hạn
            },
            placement: { cefr: 'B2' },
            updated_at: new Date('2026-08-17T00:00:00Z'),
          },
        ],
      ),
      { personId: PERSON_ID, userId: USER_ID, subject: 'english' },
    )

    expect(model.personId).toBe(PERSON_ID)
    expect(model.subject).toBe('english')
    expect(model.direction).toBe('A')
    expect(model.currentLevel).toBe('B2')
    expect(model.dailySpeed).toBe(10)
    expect(model.dailyMinutes).toBe(20)
    expect(model.activeGoal).toBe('Luyện thi IELTS')
    // masteredCount = số khoá trong `learned` (tự báo cáo).
    expect(model.masterySummary.masteredCount).toBe(2)
    // inProgressCount = số khoá trong `srs` CHƯA có trong `learned`: cherry, durian.
    expect(model.masterySummary.inProgressCount).toBe(2)
    // dueForReviewCount/srsDueCount = số khoá trong `srs` đã due <= now: apple và cherry.
    expect(model.masterySummary.dueForReviewCount).toBe(2)
    expect(model.srsDueCount).toBe(2)
    // english không có nguồn evidence thật → null, KHÔNG phải 0.
    expect(model.recentEvidenceCount).toBeNull()
  })

  it('handles missing progress rows gracefully with sensible defaults', async () => {
    const model = await getLearningReadModel(poolWithRows([], []), {
      personId: PERSON_ID,
      userId: USER_ID,
    })

    expect(model.direction).toBe('A')
    expect(model.currentLevel).toBeNull()
    expect(model.dailySpeed).toBe(10)
    expect(model.onboarded).toBe(false)
    expect(model.masterySummary.masteredCount).toBe(0)
    expect(model.masterySummary.inProgressCount).toBe(0)
    expect(model.masterySummary.dueForReviewCount).toBe(0)
    expect(model.srsDueCount).toBe(0)
    expect(model.recentEvidenceCount).toBeNull()
  })
})

describe('formatLearningReadModelForContext', () => {
  it('formats context string clearly for Context Engine', () => {
    const text = formatLearningReadModelForContext({
      personId: PERSON_ID,
      subject: 'english',
      direction: 'A',
      currentLevel: 'B1',
      dailySpeed: 10,
      dailyMinutes: 15,
      onboarded: true,
      activeGoal: 'Giao tiếp',
      masterySummary: {
        masteredCount: 100,
        inProgressCount: 20,
        dueForReviewCount: 5,
      },
      recentEvidenceCount: null,
      srsDueCount: 5,
      updatedAt: '2026-08-17T00:00:00.000Z',
      schemaVersion: 1,
    })

    expect(text).toContain('[Domain: Learning | Subject: english]')
    expect(text).toContain('Level: B1')
    expect(text).toContain('Direction: EN -> VI')
    expect(text).toContain('Mục tiêu: "Giao tiếp"')
    expect(text).toContain('SRS cần ôn: 5 từ')
    expect(text).toContain('Đã thành thạo: 100 từ')
  })

  it('formats context string with direction B and empty optional fields', () => {
    const text = formatLearningReadModelForContext({
      personId: PERSON_ID,
      subject: 'english',
      direction: 'B',
      currentLevel: null,
      dailySpeed: 10,
      dailyMinutes: 15,
      onboarded: false,
      activeGoal: null,
      masterySummary: {
        masteredCount: 0,
        inProgressCount: 0,
        dueForReviewCount: 0,
      },
      recentEvidenceCount: null,
      srsDueCount: 0,
      updatedAt: new Date().toISOString(),
      schemaVersion: 1,
    })

    expect(text).toContain('Level: Chưa xác định')
    expect(text).toContain('Direction: VI -> EN')
    expect(text).not.toContain('Mục tiêu:')
    expect(text).not.toContain('SRS cần ôn:')
    expect(text).not.toContain('Đã thành thạo:')
  })
})

// Nhánh biên: dữ liệu JSON lệch kiểu, thiếu trường, giá trị 0/null.
describe('getLearningReadModel — nhánh biên', () => {
  it('learned rỗng + srs rỗng → mọi số đếm bằng 0, direction/dailySpeed luôn mặc định', async () => {
    const model = await getLearningReadModel(
      poolWithRows(
        [{ onboarded: true, goal: null, daily_minutes: null }],
        [
          {
            learned: [],
            srs: {},
            placement: { cefr: 'Z9' }, // cefr sai → null
            updated_at: new Date('2026-08-17T00:00:00Z'),
          },
        ],
      ),
      { personId: PERSON_ID, userId: USER_ID },
    )

    expect(model.direction).toBe('A')
    expect(model.dailySpeed).toBe(10)
    expect(model.currentLevel).toBeNull()
    expect(model.activeGoal).toBeNull()
    expect(model.dailyMinutes).toBe(15)
    expect(model.masterySummary.masteredCount).toBe(0)
    expect(model.masterySummary.inProgressCount).toBe(0)
    expect(model.masterySummary.dueForReviewCount).toBe(0)
    expect(model.srsDueCount).toBe(0)
  })

  it('learned/srs/placement sai kiểu (không phải mảng/object) → vẫn dùng mặc định an toàn', async () => {
    const model = await getLearningReadModel(
      poolWithRows(
        [{ onboarded: false, goal: null, daily_minutes: 30 }],
        [
          {
            learned: 'khong-phai-mang',
            srs: 'khong-phai-object',
            placement: 'khong-phai-object',
            updated_at: new Date('2026-08-17T00:00:00Z'),
          },
        ],
      ),
      { personId: PERSON_ID, userId: USER_ID },
    )

    expect(model.direction).toBe('A')
    expect(model.currentLevel).toBeNull()
    expect(model.dailySpeed).toBe(10)
    expect(model.dailyMinutes).toBe(30)
    expect(model.masterySummary.masteredCount).toBe(0)
    expect(model.masterySummary.inProgressCount).toBe(0)
    expect(model.srsDueCount).toBe(0)
  })

  it('mục trong srs đã có trong learned → KHÔNG tính vào inProgress, dù đã due', async () => {
    const now = Date.now()
    const model = await getLearningReadModel(
      poolWithRows(
        [{ onboarded: true, goal: 'Giao tiếp', daily_minutes: 20 }],
        [
          {
            learned: ['apple'],
            srs: { apple: { reps: 5, due: now - 1000 } },
            placement: { cefr: 'A1' },
            updated_at: new Date('2026-08-17T00:00:00Z'),
          },
        ],
      ),
      { personId: PERSON_ID, userId: USER_ID },
    )

    expect(model.masterySummary.masteredCount).toBe(1)
    expect(model.masterySummary.inProgressCount).toBe(0)
    // due vẫn tính vào dueForReviewCount/srsDueCount dù đã "thuộc" — hai số đếm độc lập nhau.
    expect(model.masterySummary.dueForReviewCount).toBe(1)
    expect(model.srsDueCount).toBe(1)
  })

  it('srs có mục due là chuỗi/không hợp lệ → không tính là đến hạn', async () => {
    const model = await getLearningReadModel(
      poolWithRows(
        [{ onboarded: true, goal: 'Giao tiếp', daily_minutes: 20 }],
        [
          {
            learned: [],
            srs: { apple: { reps: 1, due: 'khong-phai-so' }, banana: { reps: 1 } },
            placement: {},
            updated_at: new Date('2026-08-17T00:00:00Z'),
          },
        ],
      ),
      { personId: PERSON_ID, userId: USER_ID },
    )

    expect(model.masterySummary.inProgressCount).toBe(2)
    expect(model.masterySummary.dueForReviewCount).toBe(0)
    expect(model.srsDueCount).toBe(0)
  })

  it('thiếu updated_at → dùng thời điểm hiện tại', async () => {
    const model = await getLearningReadModel(
      poolWithRows(
        [{ onboarded: true, goal: 'Giao tiếp', daily_minutes: 20 }],
        [{ learned: [], srs: {}, placement: {}, updated_at: null }],
      ),
      { personId: PERSON_ID, userId: USER_ID },
    )

    expect(new Date(model.updatedAt).getTime()).toBeGreaterThan(0)
  })

  it('recentEvidenceCount trả null cho subject english (mặc định)', async () => {
    const model = await getLearningReadModel(poolWithRows([], []), {
      personId: PERSON_ID,
      userId: USER_ID,
      subject: 'english',
    })

    expect(model.recentEvidenceCount).toBeNull()
  })
})

describe('formatLearningReadModelForContext — nhánh biên', () => {
  const base = {
    personId: PERSON_ID,
    subject: 'english' as const,
    direction: 'B' as const,
    currentLevel: null,
    dailySpeed: 10,
    dailyMinutes: 15,
    onboarded: false,
    activeGoal: null,
    masterySummary: { masteredCount: 0, inProgressCount: 0, dueForReviewCount: 0 },
    recentEvidenceCount: null,
    srsDueCount: 0,
    updatedAt: '2026-08-17T00:00:00.000Z',
    schemaVersion: 1,
  }

  it('người học mới (chưa có level/goal/SRS) → chỉ 4 phần cơ bản, chiều VI -> EN', () => {
    const text = formatLearningReadModelForContext(base)
    expect(text).toContain('Level: Chưa xác định')
    expect(text).toContain('Direction: VI -> EN')
    expect(text).not.toContain('Mục tiêu:')
    expect(text).not.toContain('SRS cần ôn')
    expect(text).not.toContain('Đã thành thạo')
    // 4 phần cơ bản, nhưng phần đầu tự nó đã chứa dấu " | " nên tách ra 5 mảnh.
    expect(text.split(' | ').length).toBe(5)
  })
})
