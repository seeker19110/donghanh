// lessonMarkdown — bộ đọc markdown TỐI GIẢN cho phần lý thuyết bài học môn Lập trình.
//
// Vì sao tự viết thay vì thêm thư viện: phần `theory` chỉ dùng đúng 5 cấu trúc (đã đếm trên
// toàn bộ 68 bài, xem bảng dưới), trong khi một thư viện markdown đầy đủ nặng vài chục kB —
// ngân sách bundle của app chỉ còn dư ~11% (xem PROGRESS.md "Nợ kỹ thuật còn mở").
//
// Thống kê thật trên 68 bài lúc viết file này:
//   190 dòng thụt lề (code)  ·  118 gạch đầu dòng  ·  110 mục đánh số
//    86 **đậm**              ·   13 `code` trong dòng  ·  1 *nghiêng*
//
// LUẬT QUAN TRỌNG NHẤT — dòng thụt lề là CODE, KHÔNG phân tích cú pháp bên trong.
// Code trong bài chứa đầy ký tự trùng với dấu markdown: `2 ** (lan - 1)`, `COUNT(*)`,
// `# ghi chú`, `` `Xin chao ${ten}` ``. Phân tích chúng như markdown là làm hỏng code hiển
// thị cho học viên — nên khối code đi thẳng ra màn hình, nguyên văn.
//
// Cũng vì thế `#` KHÔNG được hiểu là tiêu đề: cả 2 lần `#` xuất hiện đầu dòng trong dữ liệu
// đều nằm trong khối code (bộ chọn CSS `#tieu-de` và comment Python `# ghi chú`). Đếm lại
// 2026-09-15 khi mở rộng file cho khung chat: 305 dòng bắt đầu bằng `#` trong `lessons/`,
// TẤT CẢ là comment Python trong code. Hiểu `#` là tiêu đề sẽ nuốt mất 305 dòng comment —
// nên luật này giữ nguyên vĩnh viễn, đừng "bổ sung heading cho đủ markdown".
//
// [S03-3, 2026-09-15] Thêm KHỐI CODE RÀO ```. Lý do: file này nay còn dùng cho câu trả lời
// của Companion (`ChatProse`), mà LLM viết code bằng rào ba dấu huyền chứ không thụt lề.
// Đo thật trước khi sửa, trên một câu trả lời mẫu có rào: hai dòng `tong = 0` và
// `for x in ds:` (thụt lề 0) rơi ra thành ĐOẠN VĂN, còn dòng thân vòng lặp (thụt lề 4) thành
// một khối code lạc lõng — tức đúng cái "làm hỏng code hiển thị" mà luật trên cấm. Rào là
// dấu hiệu KHÔNG mập mờ, nên nó chặn mọi phân tích khác bên trong.
//
// Rào an toàn cho bài học: không bài `theory` nào trong 68 bài đang dùng rào (đã grep), nên
// đây là phần THÊM thuần tuý, không đổi cách đọc bất kỳ bài nào.

/** Một mảnh chữ trong dòng. `code` giữ nguyên văn, không phân tích tiếp. */
export interface InlineNode {
  kind: 'text' | 'bold' | 'italic' | 'code'
  text: string
}

export type LessonBlock =
  | { kind: 'para'; inline: InlineNode[] }
  | { kind: 'bullets'; items: InlineNode[][] }
  | { kind: 'numbers'; items: InlineNode[][] }
  /** Dòng thụt lề — giữ NGUYÊN VĂN, không phân tích markdown bên trong. */
  | { kind: 'code'; code: string }
  /**
   * Tiêu đề `##`/`###`. CHỈ sinh ra khi gọi với `{ headings: true }` — xem `ParseOptions`.
   * Bài học KHÔNG bật cờ này, nên `#` trong bài vẫn là chữ thường như trước.
   */
  | { kind: 'heading'; level: 2 | 3; inline: InlineNode[] }

/**
 * `**đậm**` · `` `code` `` · `*nghiêng*` — quét MỘT lượt, không lồng nhau.
 *
 * Nhánh nghiêng bắt buộc nội dung KHÔNG bắt đầu và KHÔNG kết thúc bằng khoảng trắng, để
 * phép nhân trong câu văn ("mỗi ngày 3 * 5 phút") không bị hiểu nhầm thành chữ nghiêng.
 * Cố tình KHÔNG dùng lookbehind: Safari chỉ hỗ trợ từ 16.4, mà regex sai cú pháp thì hỏng
 * ngay lúc nạp bundle chứ không phải hỏng một chỗ.
 */
const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`|\*[^\s*](?:[^*\n]*[^\s*])?\*)/g

/**
 * Tách một dòng chữ thành các mảnh. Dấu markdown không khớp cặp thì giữ nguyên là chữ —
 * người soạn viết dấu sao lẻ (vd "10 * 5") không bị mất ký tự.
 */
export function parseInline(line: string): InlineNode[] {
  const out: InlineNode[] = []
  let last = 0
  for (const m of line.matchAll(INLINE_RE)) {
    const at = m.index
    if (at > last) out.push({ kind: 'text', text: line.slice(last, at) })
    const raw = m[0]
    if (raw.startsWith('**')) out.push({ kind: 'bold', text: raw.slice(2, -2) })
    else if (raw.startsWith('`')) out.push({ kind: 'code', text: raw.slice(1, -1) })
    else out.push({ kind: 'italic', text: raw.slice(1, -1) })
    last = at + raw.length
  }
  if (last < line.length) out.push({ kind: 'text', text: line.slice(last) })
  return out
}

/**
 * Rào mở/đóng khối code: ba dấu huyền trở lên, cho phép thụt lề, phần "ngôn ngữ" phía sau
 * (```python) bị bỏ qua vì màn hình không tô màu cú pháp.
 */
const FENCE_RE = /^\s*```/

/**
 * Tiêu đề `##` hoặc `###`, chỉ đọc khi bật cờ (xem `ParseOptions.headings`).
 *
 * CỐ Ý KHÔNG nhận `#` một cấp: trong `packages/subject-programming/lessons/` có 305 dòng bắt
 * đầu bằng `#` và tất cả đều là comment Python. Cờ này chỉ bật cho khung chat, nhưng giới hạn
 * từ hai dấu thăng trở lên là lớp chặn thứ hai — comment code lọt ra ngoài rào vẫn là chữ.
 */
const HEADING_RE = /^(#{2,3}) +(.*)$/

const BULLET_RE = /^- (.*)$/
const NUMBER_RE = /^\d+\.\s+(.*)$/
/** Thụt lề từ 2 dấu cách trở lên = code. Ngưỡng 2 khớp đúng cách các bài đang soạn. */
const INDENT_RE = /^ {2,}\S/

/** Bỏ phần thụt lề CHUNG của cả khối, giữ nguyên thụt lề tương đối bên trong code. */
function dedent(lines: string[]): string {
  const widths = lines.filter((l) => l.trim() !== '').map((l) => l.length - l.trimStart().length)
  const chung = widths.length > 0 ? Math.min(...widths) : 0
  return lines.map((l) => l.slice(chung)).join('\n')
}

/**
 * Đọc phần `theory` thành các khối để hiển thị.
 *
 * Mỗi dòng chữ thường là MỘT đoạn riêng (không gộp các dòng liền nhau): người soạn xuống
 * dòng giữa đoạn là có chủ đích — thường để tách một dòng dẫn ra khỏi ví dụ ngay bên dưới.
 */
export interface ParseOptions {
  /**
   * Đọc `##`/`###` thành tiêu đề. Mặc định TẮT cho bài học (xem `HEADING_RE`); khung chat bật
   * lên vì LLM chia câu trả lời dài bằng tiêu đề, và in nguyên dấu thăng ra màn hình thì
   * người đọc thấy rác chứ không thấy cấu trúc.
   */
  headings?: boolean
}

export function parseLessonMarkdown(text: string, options: ParseOptions = {}): LessonBlock[] {
  const blocks: LessonBlock[] = []
  const lines = text.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]!

    if (line.trim() === '') {
      i += 1
      continue
    }

    // Khối code RÀO ```: mọi thứ tới rào đóng là code nguyên văn. Đặt TRƯỚC nhánh thụt lề
    // vì thân rào có thể thụt lề bất kỳ (kể cả 0) và không được đọc theo luật nào khác.
    if (FENCE_RE.test(line)) {
      i += 1
      const gom: string[] = []
      while (i < lines.length && !FENCE_RE.test(lines[i]!)) {
        gom.push(lines[i]!)
        i += 1
      }
      // Rào thiếu dấu đóng (LLM bị cắt giữa chừng): phần đã gom vẫn là code. Bỏ qua rào đóng
      // nếu có; nếu không có thì `i` đã ở cuối, vòng lặp ngoài tự dừng.
      if (i < lines.length) i += 1
      // Rào rỗng (``` rồi ``` ngay) không sinh khối — tránh ô code trống giữa câu trả lời.
      if (gom.some((l) => l.trim() !== '')) blocks.push({ kind: 'code', code: dedent(gom) })
      continue
    }

    // Khối code: gom các dòng thụt lề liền nhau, KHÔNG phân tích bên trong.
    if (INDENT_RE.test(line)) {
      const gom: string[] = []
      while (i < lines.length && INDENT_RE.test(lines[i]!)) {
        gom.push(lines[i]!)
        i += 1
      }
      blocks.push({ kind: 'code', code: dedent(gom) })
      continue
    }

    if (options.headings) {
      const h = line.match(HEADING_RE)
      if (h) {
        blocks.push({
          kind: 'heading',
          level: h[1]!.length === 2 ? 2 : 3,
          inline: parseInline(h[2]!),
        })
        i += 1
        continue
      }
    }

    if (BULLET_RE.test(line)) {
      const items: InlineNode[][] = []
      let m: RegExpMatchArray | null
      while (i < lines.length && (m = lines[i]!.match(BULLET_RE))) {
        items.push(parseInline(m[1]!))
        i += 1
      }
      blocks.push({ kind: 'bullets', items })
      continue
    }

    if (NUMBER_RE.test(line)) {
      const items: InlineNode[][] = []
      let m: RegExpMatchArray | null
      while (i < lines.length && (m = lines[i]!.match(NUMBER_RE))) {
        items.push(parseInline(m[1]!))
        i += 1
      }
      blocks.push({ kind: 'numbers', items })
      continue
    }

    blocks.push({ kind: 'para', inline: parseInline(line) })
    i += 1
  }

  return blocks
}
