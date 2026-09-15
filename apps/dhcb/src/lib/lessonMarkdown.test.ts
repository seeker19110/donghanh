// Cổng cho bộ đọc markdown của phần lý thuyết bài học.
//
// Hai nhóm test quan trọng nhất, cả hai đều canh lỗi làm HỎNG NỘI DUNG HỌC VIÊN ĐỌC:
//   1. Khối code giữ nguyên văn — code trong bài đầy ký tự trùng dấu markdown.
//   2. Dấu markdown lẻ (nhân, gạch ngang) không bị nuốt mất ký tự.
//
// Nhóm cuối chạy trên DỮ LIỆU THẬT của cả 68 bài: bắt được ca người soạn vô tình viết ra cú
// pháp mà bộ đọc hiểu sai — thứ mà test trên chuỗi tự bịa không bao giờ thấy.
import { describe, expect, it } from 'vitest'
import { parseInline, parseLessonMarkdown, type LessonBlock } from './lessonMarkdown'
import { PROGRAMMING_LESSONS } from '@dhcb/subject-programming/lessons'

/** Ghép lại toàn bộ chữ của một khối — dùng để kiểm "không mất chữ nào". */
function chuCuaKhoi(b: LessonBlock): string {
  if (b.kind === 'code') return b.code
  if (b.kind === 'para' || b.kind === 'heading') return b.inline.map((n) => n.text).join('')
  return b.items.map((it) => it.map((n) => n.text).join('')).join('\n')
}

describe('parseInline', () => {
  it('đọc được **đậm**, `code` và *nghiêng*', () => {
    expect(parseInline('Đây là **đậm** rồi `ma_code` rồi *nghiêng*.')).toEqual([
      { kind: 'text', text: 'Đây là ' },
      { kind: 'bold', text: 'đậm' },
      { kind: 'text', text: ' rồi ' },
      { kind: 'code', text: 'ma_code' },
      { kind: 'text', text: ' rồi ' },
      { kind: 'italic', text: 'nghiêng' },
      { kind: 'text', text: '.' },
    ])
  })

  it('phép nhân trong câu văn KHÔNG thành chữ nghiêng', () => {
    // Bẫy thật: "a * b * c" có hai dấu sao, bộ đọc ngây thơ sẽ bôi nghiêng phần giữa.
    const nodes = parseInline('Mỗi ngày 3 * 5 phút, tổng 10 * 2 buổi.')
    expect(nodes.every((n) => n.kind === 'text')).toBe(true)
    expect(nodes.map((n) => n.text).join('')).toBe('Mỗi ngày 3 * 5 phút, tổng 10 * 2 buổi.')
  })

  it('dấu sao lẻ giữ nguyên, không nuốt ký tự', () => {
    expect(
      parseInline('2 ** (lan - 1)')
        .map((n) => n.text)
        .join(''),
    ).toBe('2 ** (lan - 1)')
  })

  it('chuỗi không có dấu markdown nào trả về đúng một mảnh chữ', () => {
    expect(parseInline('Không có gì đặc biệt')).toEqual([
      { kind: 'text', text: 'Không có gì đặc biệt' },
    ])
  })
})

describe('parseLessonMarkdown — khối', () => {
  it('mỗi dòng chữ thường là MỘT đoạn riêng, dòng trống bị bỏ qua', () => {
    const b = parseLessonMarkdown('Đoạn một.\n\nĐoạn hai.')
    expect(b).toHaveLength(2)
    expect(b[0]).toEqual({ kind: 'para', inline: [{ kind: 'text', text: 'Đoạn một.' }] })
  })

  it('gom gạch đầu dòng liền nhau thành MỘT danh sách', () => {
    const b = parseLessonMarkdown('Mở bài:\n- một\n- hai\n- ba\nKết.')
    expect(b.map((x) => x.kind)).toEqual(['para', 'bullets', 'para'])
    expect(b[1]!.kind === 'bullets' && b[1]!.items).toHaveLength(3)
  })

  it('gom mục đánh số liền nhau thành MỘT danh sách', () => {
    const b = parseLessonMarkdown('1. một\n2. hai\n3. ba')
    expect(b.map((x) => x.kind)).toEqual(['numbers'])
    expect(b[0]!.kind === 'numbers' && b[0]!.items).toHaveLength(3)
  })

  it('mục danh sách VẪN đọc được **đậm** bên trong', () => {
    const b = parseLessonMarkdown('1. **LÀM RÕ ĐỀ** rồi mới viết.')
    expect(b[0]!.kind === 'numbers' && b[0]!.items[0]![0]).toEqual({
      kind: 'bold',
      text: 'LÀM RÕ ĐỀ',
    })
  })
})

describe('parseLessonMarkdown — khối code là VÙNG CẤM phân tích', () => {
  it('giữ nguyên ký tự trùng dấu markdown trong code', () => {
    // Đúng những ca có thật trong bài: luỹ thừa, COUNT(*), comment #, dấu huyền.
    const code = '  tong += gia * so_luong\n  SELECT COUNT(*) FROM don\n  # ghi chú\n  `Xin chao`'
    const b = parseLessonMarkdown(code)
    expect(b).toHaveLength(1)
    expect(b[0]).toEqual({
      kind: 'code',
      code: 'tong += gia * so_luong\nSELECT COUNT(*) FROM don\n# ghi chú\n`Xin chao`',
    })
  })

  it('`#` đầu dòng KHÔNG thành tiêu đề (nó là comment trong code)', () => {
    expect(parseLessonMarkdown('  # ghi chú')[0]!.kind).toBe('code')
  })

  it('bỏ thụt lề CHUNG nhưng giữ thụt lề tương đối bên trong', () => {
    const b = parseLessonMarkdown('    for x in ds:\n        tong += x')
    expect(b[0]!.kind === 'code' && b[0]!.code).toBe('for x in ds:\n    tong += x')
  })

  it('khối code nằm giữa hai đoạn văn được tách đúng', () => {
    const b = parseLessonMarkdown('Trước.\n  ma_code = 1\nSau.')
    expect(b.map((x) => x.kind)).toEqual(['para', 'code', 'para'])
  })
})

describe('chạy trên dữ liệu THẬT của mọi bài học', () => {
  it.each(PROGRAMMING_LESSONS)('$id — không mất chữ nào so với nguồn', (lesson) => {
    const goc = lesson.theory
      .split('\n')
      .filter((l) => l.trim() !== '')
      .map((l) =>
        // Dòng thụt lề là CODE: giữ nguyên văn, kể cả dấu ` và * bên trong. Chỉ dòng chữ
        // thường mới bị bóc dấu markdown và dấu đầu mục.
        /^ {2,}\S/.test(l)
          ? l.trim()
          : l
              .trim()
              .replace(/^- /, '')
              .replace(/^\d+\.\s+/, '')
              .replace(/\*\*|`/g, ''),
      )
      .join('')
    const doc = parseLessonMarkdown(lesson.theory)
      .map(chuCuaKhoi)
      .join('\n')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '')
      .join('')
    // Chỉ còn khác nhau ở dấu sao của chữ nghiêng (hiếm) — bỏ nốt để so phần chữ.
    expect(doc.replace(/\*/g, '')).toBe(goc.replace(/\*/g, ''))
  })

  it.each(PROGRAMMING_LESSONS)('$id — không có khối code nào bị hiểu thành đoạn văn', (lesson) => {
    const blocks = parseLessonMarkdown(lesson.theory)
    for (const b of blocks) {
      if (b.kind !== 'para') continue
      // Đoạn văn KHÔNG được bắt đầu bằng khoảng trắng: nếu có, nghĩa là một dòng code đã lọt
      // vào nhánh đoạn văn và sẽ bị phân tích markdown — đúng thứ luật cấm.
      expect(b.inline[0]!.text.startsWith(' ')).toBe(false)
    }
  })
})

// [S03-3, 2026-09-15] Rào ``` — thêm vì bộ đọc này nay còn phục vụ câu trả lời của Companion,
// mà LLM viết code bằng rào chứ không thụt lề.
describe('khối code RÀO ```', () => {
  it('gom nguyên văn phần thân, kể cả dòng KHÔNG thụt lề', () => {
    // Trước khi có nhánh rào, đúng chuỗi này vỡ thành 3 đoạn văn + 1 khối code lạc: hai dòng
    // thụt lề 0 rơi vào nhánh đoạn văn, dòng thụt lề 4 thành khối code riêng.
    const b = parseLessonMarkdown('Ví dụ:\n```python\ntong = 0\nfor x in ds:\n    tong += x\n```')
    expect(b).toHaveLength(2)
    expect(b[0]!.kind).toBe('para')
    expect(b[1]).toEqual({ kind: 'code', code: 'tong = 0\nfor x in ds:\n    tong += x' })
  })

  it('không phân tích markdown bên trong rào', () => {
    const b = parseLessonMarkdown(
      '```\n- khong phai gach dau dong\n**khong phai dam**\n1. khong phai so\n```',
    )
    expect(b).toEqual([
      { kind: 'code', code: '- khong phai gach dau dong\n**khong phai dam**\n1. khong phai so' },
    ])
  })

  it('giữ dòng trống bên trong rào', () => {
    const b = parseLessonMarkdown('```\na = 1\n\nb = 2\n```')
    expect(b).toEqual([{ kind: 'code', code: 'a = 1\n\nb = 2' }])
  })

  it('rào thiếu dấu đóng vẫn ra khối code, không rớt ra chữ', () => {
    // Ca thật: câu trả lời của LLM bị cắt vì hết token budget giữa khối code.
    const b = parseLessonMarkdown('Thu xem:\n```\nprint("chua dong")')
    expect(b[1]).toEqual({ kind: 'code', code: 'print("chua dong")' })
  })

  it('rào rỗng không sinh ô code trống', () => {
    expect(parseLessonMarkdown('```\n```')).toEqual([])
  })

  it('bỏ qua nhãn ngôn ngữ sau rào mở', () => {
    const b = parseLessonMarkdown('```js\nconst a = 1\n```')
    expect(b).toEqual([{ kind: 'code', code: 'const a = 1' }])
  })
})

describe('tiêu đề ## — TẮT mặc định, chỉ bật cho khung chat', () => {
  it('mặc định giữ nguyên dấu thăng là chữ (luật của bài học)', () => {
    const b = parseLessonMarkdown('## Buoc tiep theo')
    expect(b[0]!.kind).toBe('para')
    expect(chuCuaKhoi(b[0]!)).toBe('## Buoc tiep theo')
  })

  it('bật cờ thì ## và ### thành tiêu đề, có phân tích chữ bên trong', () => {
    const b = parseLessonMarkdown('## Buoc **mot**\n### Chi tiet', { headings: true })
    expect(b).toEqual([
      {
        kind: 'heading',
        level: 2,
        inline: [
          { kind: 'text', text: 'Buoc ' },
          { kind: 'bold', text: 'mot' },
        ],
      },
      { kind: 'heading', level: 3, inline: [{ kind: 'text', text: 'Chi tiet' }] },
    ])
  })

  it('MỘT dấu thăng KHÔNG bao giờ là tiêu đề, kể cả khi bật cờ', () => {
    // Lớp chặn thứ hai cho 305 dòng comment Python `# ...` trong kho bài học: comment lọt ra
    // ngoài khối code vẫn phải là chữ, không được biến thành tiêu đề rồi mất dấu thăng.
    const b = parseLessonMarkdown('# ghi chu python', { headings: true })
    expect(b[0]!.kind).toBe('para')
    expect(chuCuaKhoi(b[0]!)).toBe('# ghi chu python')
  })

  it('dấu thăng không có khoảng trắng theo sau vẫn là chữ (thẻ hashtag)', () => {
    const b = parseLessonMarkdown('##hashtag', { headings: true })
    expect(b[0]!.kind).toBe('para')
  })
})
