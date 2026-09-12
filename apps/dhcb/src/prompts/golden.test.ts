// golden.test.ts — chống thay đổi PROMPT không chủ đích (học từ ý tưởng "golden test cho
// agent" của dự án tham khảo seeker19110/claude-agents — prompt là code, mọi lần sửa phải
// LỘ RA trong diff, không chỉ đổi hành vi âm thầm).
//
// KHÁC eval:tutor (scripts/eval-tutor.ts): eval:tutor gọi MODEL THẬT, tốn phí, đo recall/
// precision — chạy TAY, không vào CI. File này KHÔNG gọi AI, chỉ chụp lại chuỗi PROMPT hiện
// tại — chạy trong CI mọi PR, miễn phí, tức thời. Hai thứ bổ sung nhau, không thay thế nhau:
//   - Snapshot đổi mà PR không nói gì tới prompt → có thể là sửa nhầm, review phải hỏi lại.
//   - Sửa prompt CÓ CHỦ ĐÍCH → xem diff snapshot đúng như mong đợi, cập nhật bằng lệnh dưới,
//     rồi (nếu đổi prompt Chat/Speaking) vẫn phải chạy `npm run eval:tutor` theo CLAUDE.md §8
//     — snapshot không thay được bước đó.
//
// Cập nhật snapshot sau khi CỐ Ý sửa prompt:
//   npx vitest run apps/dhcb/src/prompts/golden.test.ts -u
import { describe, it, expect } from 'vitest'
import {
  chatSystemPrompt,
  speakingSystemPrompt,
  writingSystemPrompt,
  pronunciationScoringPrompt,
  speakingFullEvaluationPrompt,
  chatFullEvaluationPrompt,
  interviewAnswerFeedbackPrompt,
} from './index'
import { challengeFeedbackSystemPrompt } from './challenge'
import { pathCheckSystemPrompt } from './pathCheckPrompt'

describe('golden: chatSystemPrompt', () => {
  it('chiều A, beginner', () => {
    expect(chatSystemPrompt('Small talk ở quán cà phê', 'beginner', 'A')).toMatchSnapshot()
  })
  it('chiều B, intermediate', () => {
    expect(chatSystemPrompt('Ordering food', 'intermediate', 'B')).toMatchSnapshot()
  })
  it('chiều A, có targetWords + ageGroup nhi_dong', () => {
    expect(
      chatSystemPrompt('Small talk', 'beginner', 'A', ['apple', 'banana'], 'nhi_dong'),
    ).toMatchSnapshot()
  })
})

describe('golden: speakingSystemPrompt', () => {
  it('chiều A, advanced', () => {
    expect(speakingSystemPrompt('Job interview', 'advanced', 'A')).toMatchSnapshot()
  })
  it('chiều B, beginner', () => {
    expect(speakingSystemPrompt('Giới thiệu bản thân', 'beginner', 'B')).toMatchSnapshot()
  })
})

describe('golden: writingSystemPrompt', () => {
  it('chiều A', () => {
    expect(writingSystemPrompt('A')).toMatchSnapshot()
  })
  it('chiều B', () => {
    expect(writingSystemPrompt('B')).toMatchSnapshot()
  })
})

describe('golden: pronunciationScoringPrompt', () => {
  it('chiều A', () => {
    expect(pronunciationScoringPrompt('world', 'A')).toMatchSnapshot()
  })
  it('chiều B', () => {
    expect(pronunciationScoringPrompt('xin chào', 'B')).toMatchSnapshot()
  })
})

describe('golden: speakingFullEvaluationPrompt / chatFullEvaluationPrompt', () => {
  it('speaking chiều A', () => {
    expect(speakingFullEvaluationPrompt('A')).toMatchSnapshot()
  })
  it('chat chiều A', () => {
    expect(chatFullEvaluationPrompt('A')).toMatchSnapshot()
  })
})

describe('golden: interviewAnswerFeedbackPrompt', () => {
  it('chiều A', () => {
    expect(interviewAnswerFeedbackPrompt('A')).toMatchSnapshot()
  })
})

describe('golden: challengeFeedbackSystemPrompt', () => {
  const topic = {
    day: 1,
    titleEn: 'Introduce yourself',
    titleVi: 'Giới thiệu bản thân',
    week: 1 as const,
    hintWords: [],
  }
  it('chiều A', () => {
    expect(
      challengeFeedbackSystemPrompt('My name is Lan, I am a student.', topic, 'A'),
    ).toMatchSnapshot()
  })
})

describe('golden: pathCheckSystemPrompt', () => {
  it('có chặng + chủ đề', () => {
    expect(
      pathCheckSystemPrompt('Nhập môn tư duy lập trình', ['Biến', 'Vòng lặp']),
    ).toMatchSnapshot()
  })
})
