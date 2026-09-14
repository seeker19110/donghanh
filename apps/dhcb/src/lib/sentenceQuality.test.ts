import { describe, it, expect } from 'vitest'
import {
  countWords,
  hasVietnameseDiacritics,
  matchedCircleWords,
  normalizeSentence,
  wordVariants,
} from './sentenceQuality'

describe('sentenceQuality — bộ luật dùng chung cho câu mẫu của vòng từ vựng', () => {
  it('normalizeSentence bỏ dấu câu, hạ chữ thường, gộp khoảng trắng', () => {
    expect(normalizeSentence('  How do  you SPELL it? ')).toBe('how do you spell it')
    // Hai câu chỉ khác dấu câu/hoa thường thì coi là TRÙNG nhau.
    expect(normalizeSentence('I am fine.')).toBe(normalizeSentence('i am fine!'))
  })

  it('countWords đếm theo khoảng trắng', () => {
    expect(countWords('My mom is here.')).toBe(4)
    expect(countWords('   ')).toBe(0)
  })

  it('hasVietnameseDiacritics phân biệt được câu Việt và câu Anh', () => {
    expect(hasVietnameseDiacritics('Mẹ tôi ở đây.')).toBe(true)
    expect(hasVietnameseDiacritics('My mom is here.')).toBe(false)
  })

  it('wordVariants sinh biến thể hình thái đơn giản', () => {
    expect(wordVariants('live')).toContain('lives')
    expect(wordVariants('live')).toContain('living')
    expect(wordVariants('study')).toContain('studies')
    expect(wordVariants('stop')).toContain('stopped')
    // Từ có dấu chấm / cụm nhiều từ giữ nguyên, không suy biến thể bừa.
    expect(wordVariants('dr.')).toEqual(['dr.'])
    expect(wordVariants('credit card')).toEqual(['credit card'])
  })

  it('matchedCircleWords khớp theo ranh giới từ, không khớp nhầm bên trong từ khác', () => {
    expect(matchedCircleWords('My mom is here.', ['mom', 'dad'])).toEqual(['mom'])
    // "an" KHÔNG được khớp trong "another"
    expect(matchedCircleWords('Another day is coming.', ['an'])).toEqual([])
    // biến thể hình thái vẫn tính là dùng từ của vòng
    expect(matchedCircleWords('She lives here.', ['live'])).toEqual(['live'])
    // cụm nhiều từ và từ có dấu chấm
    expect(matchedCircleWords('I paid by credit card.', ['credit card'])).toEqual(['credit card'])
    expect(matchedCircleWords('Dr. Nam is kind.', ['dr.'])).toEqual(['dr.'])
  })
})
