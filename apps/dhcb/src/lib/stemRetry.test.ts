import { describe, expect, it } from 'vitest'
import { boCoTuThuLai, docCauTuThuLai, stateTuThuLai } from './stemRetry'

describe('stemRetry', () => {
  it('đọc lại đúng câu đã gắn', () => {
    expect(docCauTuThuLai(stateTuThuLai(0))).toBe(0)
    expect(docCauTuThuLai(stateTuThuLai(3))).toBe(3)
  })

  it('state lạ/thiếu/sai kiểu → null (không tin dữ liệu history)', () => {
    for (const s of [
      null,
      undefined,
      'x',
      {},
      { tuThuLaiCau: -1 },
      { tuThuLaiCau: 1.5 },
      { tuThuLaiCau: '2' },
    ]) {
      expect(docCauTuThuLai(s)).toBeNull()
    }
  })

  it('bỏ cờ nhưng giữ khoá khác', () => {
    expect(boCoTuThuLai({ tuThuLaiCau: 1 })).toBeNull()
    expect(boCoTuThuLai({ tuThuLaiCau: 1, from: '/so-tay-loi-sai' })).toEqual({
      from: '/so-tay-loi-sai',
    })
    expect(boCoTuThuLai(null)).toBeNull()
  })
})
