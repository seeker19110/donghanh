// Test hợp đồng bản ghi duyệt chuyên môn + hàm băm nội dung.
import { describe, it, expect } from 'vitest'
import {
  LessonReviewSchema,
  TIEU_CHI_DUYET,
  PHIEN_BAN_TIEU_CHI,
  datHetTieuChi,
  daDuocNguoiDuyet,
  type KetQuaTieuChi,
  type LessonReview,
} from './lessonReview.js'
import { bamNoiDungBaiHoc, type NoiDungCanDuyet } from './lessonReviewHash.js'

const tieuChiDat: KetQuaTieuChi = Object.fromEntries(
  TIEU_CHI_DUYET.map((k) => [k, true]),
) as KetQuaTieuChi

const banGhiNguoiDuyet: LessonReview = {
  loai: 'nguoi-duyet',
  nguoiDuyet: 'Cô Lan (GV Sinh THPT)',
  ngay: '2026-09-14',
  phienBanTieuChi: PHIEN_BAN_TIEU_CHI,
  tieuChi: tieuChiDat,
  bamNoiDung: 'a'.repeat(64),
}

describe('LessonReviewSchema', () => {
  it('nhận bản ghi người duyệt đầy đủ', () => {
    expect(LessonReviewSchema.safeParse(banGhiNguoiDuyet).success).toBe(true)
  })

  it('nhận bản ghi AI sàng lọc', () => {
    const r = { loai: 'ai-sang-loc', ngay: '2026-09-14', soCoNghiNgo: 3 }
    expect(LessonReviewSchema.safeParse(r).success).toBe(true)
  })

  it('TỪ CHỐI bản ghi người duyệt thiếu bất kỳ trường bắt buộc nào', () => {
    for (const truong of [
      'nguoiDuyet',
      'ngay',
      'phienBanTieuChi',
      'tieuChi',
      'bamNoiDung',
    ] as const) {
      const thieu: Record<string, unknown> = { ...banGhiNguoiDuyet }
      delete thieu[truong]
      expect(
        LessonReviewSchema.safeParse(thieu).success,
        `thiếu "${truong}" mà vẫn lọt — cổng duyệt mất răng`,
      ).toBe(false)
    }
  })

  it('TỪ CHỐI tên người duyệt rỗng hoặc quá ngắn', () => {
    for (const ten of ['', ' ', 'A']) {
      expect(LessonReviewSchema.safeParse({ ...banGhiNguoiDuyet, nguoiDuyet: ten }).success).toBe(
        false,
      )
    }
  })

  it('TỪ CHỐI ngày sai khuôn hoặc không có thật', () => {
    for (const ngay of ['14/09/2026', '2026-9-14', '2026-13-01', '2026-02-30', '']) {
      expect(
        LessonReviewSchema.safeParse({ ...banGhiNguoiDuyet, ngay }).success,
        `ngày "${ngay}" phải bị chặn`,
      ).toBe(false)
    }
  })

  it('TỪ CHỐI băm không phải SHA-256 hex 64 ký tự', () => {
    for (const bam of ['', 'a'.repeat(63), 'a'.repeat(65), 'A'.repeat(64), 'g'.repeat(64)]) {
      expect(
        LessonReviewSchema.safeParse({ ...banGhiNguoiDuyet, bamNoiDung: bam }).success,
        `băm "${bam.slice(0, 8)}…" phải bị chặn`,
      ).toBe(false)
    }
  })

  it('TỪ CHỐI tiêu chí thiếu câu hoặc thừa câu lạ', () => {
    const thieuMotCau = { ...tieuChiDat } as Record<string, boolean>
    delete thieuMotCau.dapAnDung
    expect(
      LessonReviewSchema.safeParse({ ...banGhiNguoiDuyet, tieuChi: thieuMotCau }).success,
    ).toBe(false)
    expect(
      LessonReviewSchema.safeParse({
        ...banGhiNguoiDuyet,
        tieuChi: { ...tieuChiDat, cauLa: true },
      }).success,
    ).toBe(false)
  })

  it('TỪ CHỐI loại lạ — không ai tự nghĩ ra trạng thái duyệt mới', () => {
    expect(LessonReviewSchema.safeParse({ loai: 'reviewed', ngay: '2026-09-14' }).success).toBe(
      false,
    )
  })
})

describe('datHetTieuChi / daDuocNguoiDuyet', () => {
  it('đạt hết 7 câu thì mới là đạt', () => {
    expect(datHetTieuChi(tieuChiDat)).toBe(true)
    for (const k of TIEU_CHI_DUYET) {
      expect(datHetTieuChi({ ...tieuChiDat, [k]: false }), `trượt "${k}" mà vẫn tính đạt`).toBe(
        false,
      )
    }
  })

  it('AI sàng lọc KHÔNG BAO GIỜ tính là đã duyệt — bất biến của cả quy trình', () => {
    expect(daDuocNguoiDuyet({ loai: 'ai-sang-loc', ngay: '2026-09-14', soCoNghiNgo: 0 })).toBe(
      false,
    )
  })

  it('không có bản ghi thì chưa duyệt', () => {
    expect(daDuocNguoiDuyet(undefined)).toBe(false)
  })

  it('người duyệt nhưng còn tiêu chí trượt thì chưa duyệt', () => {
    expect(
      daDuocNguoiDuyet({
        ...banGhiNguoiDuyet,
        tieuChi: { ...tieuChiDat, khongSaiKienThuc: false },
      }),
    ).toBe(false)
  })

  it('người duyệt và đạt hết thì mới là đã duyệt', () => {
    expect(daDuocNguoiDuyet(banGhiNguoiDuyet)).toBe(true)
  })
})

describe('bamNoiDungBaiHoc', () => {
  const bai: NoiDungCanDuyet = {
    theory: 'ADN nhân đôi theo nguyên tắc bổ sung và bán bảo toàn.',
    workedExample: { problem: 'Tính số nucleotide', steps: ['bước 1', 'bước 2'], answer: '120' },
    checkQuestions: [
      {
        prompt: 'Enzyme nào nối các đoạn Okazaki?',
        choices: [
          { id: 'a', label: 'ADN ligase' },
          { id: 'b', label: 'ADN polymerase' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain: 'Ligase nối các đoạn Okazaki trên mạch gián đoạn.',
      },
    ],
  }

  it('cùng nội dung cho cùng băm, dạng hex 64 ký tự', () => {
    const b1 = bamNoiDungBaiHoc(bai)
    expect(b1).toMatch(/^[0-9a-f]{64}$/)
    expect(bamNoiDungBaiHoc(structuredClone(bai))).toBe(b1)
  })

  it('KHÔNG đổi khi chỉ đảo thứ tự khoá — nếu không thì sắp lại field là cả loạt bài bị đòi duyệt lại oan', () => {
    const daoKhoa: NoiDungCanDuyet = {
      ...bai,
      checkQuestions: [
        {
          explain: bai.checkQuestions[0]!.explain,
          answer: { correctIds: ['a'], kind: 'choice' },
          choices: bai.checkQuestions[0]!.choices,
          prompt: bai.checkQuestions[0]!.prompt,
        },
      ],
    }
    expect(bamNoiDungBaiHoc(daoKhoa)).toBe(bamNoiDungBaiHoc(bai))
  })

  it('ĐỔI khi lý thuyết, ví dụ mẫu, câu hỏi hoặc ĐÁP ÁN đổi', () => {
    const goc = bamNoiDungBaiHoc(bai)
    expect(bamNoiDungBaiHoc({ ...bai, theory: bai.theory + ' Thêm một câu.' })).not.toBe(goc)
    expect(
      bamNoiDungBaiHoc({
        ...bai,
        workedExample: { ...bai.workedExample, answer: '121' },
      }),
    ).not.toBe(goc)
    expect(
      bamNoiDungBaiHoc({
        ...bai,
        checkQuestions: [
          { ...bai.checkQuestions[0]!, answer: { kind: 'choice', correctIds: ['b'] } },
        ],
      }),
    ).not.toBe(goc)
  })

  it('ĐỔI khi đảo thứ tự bước giải hoặc thứ tự câu hỏi — thứ tự LÀ nội dung', () => {
    const goc = bamNoiDungBaiHoc(bai)
    expect(
      bamNoiDungBaiHoc({
        ...bai,
        workedExample: { ...bai.workedExample, steps: ['bước 2', 'bước 1'] },
      }),
    ).not.toBe(goc)
  })
})
