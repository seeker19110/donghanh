// Golden snapshot của CÔNG THỨC SRS (FSRS) — chụp NGUYÊN VĂN lịch ôn sinh ra bởi
// `reviewWord` cho một chuỗi rating cố định, ở một mốc thời gian cố định.
//
// Vì sao cần: `srs.ts` bị 30 file import (codemap). Slice S12 chỉ ĐỌC kho SRS và
// thêm đúng MỘT tiền tố namespace (`stem:`) — không được đổi một hằng số nào của
// công thức. Snapshot này là cái chốt: PR nào làm số due/stability/difficulty/state/
// lapses đổi mà không có lý do ghi trong đặc tả thì test đỏ ngay.
//
// Chụp TRƯỚC mọi thay đổi của S12-1 (đặc tả
// docs/specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md AC-3).
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Chặn đồng bộ cloud như srs.test.ts — test phải chạy offline, không đụng mạng.
vi.mock('./progressSync.js', () => ({ pushProgress: vi.fn() }))

import {
  addToSRS,
  addToSRSKnown,
  reviewWord,
  _resetSrsMemCacheForTests,
  SRS_SESSION_CAP,
  NEW_CARD_DELAY_MS,
  type Rating,
  type SRSCard,
} from './srs'

// Mốc thời gian cố định — snapshot phải tái lập được ở mọi máy, mọi múi giờ.
const MOC = new Date('2026-01-01T00:00:00.000Z')
const CHUOI_RATING: readonly Rating[] = ['again', 'hard', 'good', 'good', 'easy']
// Ba thẻ đại diện ba namespace đang sống chung kho `srs_<uid>`: từ vựng, ngữ pháp,
// thẻ hỏi-đáp (Lập trình/STEM dùng chung khuôn).
const THE = ['apple', 'grammar:a1-be', 'prog:p1-b1:0'] as const

/** Chỉ giữ các trường thuộc CÔNG THỨC — bỏ trường phụ thuộc thời điểm chạy. */
function anh(card: SRSCard) {
  return {
    dueOffsetMs: card.due - MOC.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    state: card.state,
    lapses: card.lapses,
    reps: card.reps,
    scheduled_days: card.scheduled_days,
  }
}

function doc(uid: string): Record<string, SRSCard> {
  return JSON.parse(localStorage.getItem(`srs_${uid}`) ?? '{}') as Record<string, SRSCard>
}

describe('SRS golden — công thức FSRS không được đổi', () => {
  beforeEach(() => {
    localStorage.clear()
    _resetSrsMemCacheForTests()
    vi.useFakeTimers()
    vi.setSystemTime(MOC)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('chuỗi again→hard→good→good→easy trên 3 thẻ cho lịch ôn cố định', () => {
    const uid = 'golden-user'
    for (const khoa of THE) addToSRS(uid, khoa)

    const buoc: Record<string, ReturnType<typeof anh>>[] = []
    for (const rating of CHUOI_RATING) {
      for (const khoa of THE) reviewWord(uid, khoa, rating)
      const data = doc(uid)
      buoc.push(
        Object.fromEntries(THE.map((k) => [k, anh(data[k.toLowerCase()]!)])) as Record<
          string,
          ReturnType<typeof anh>
        >,
      )
    }
    expect(buoc).toMatchSnapshot()
  })

  it('thẻ mới và thẻ "đã biết sẵn" giữ nguyên mốc due ban đầu', () => {
    const uid = 'golden-user-2'
    addToSRS(uid, 'banana')
    addToSRSKnown(uid, 'cherry')
    const data = doc(uid)
    expect({ moi: anh(data.banana!), daBiet: anh(data.cherry!) }).toMatchSnapshot()
  })

  it('hằng số điều phối phiên ôn không đổi', () => {
    expect({ SRS_SESSION_CAP, NEW_CARD_DELAY_MS }).toMatchSnapshot()
  })
})
