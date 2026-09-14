// lessonReviewHash.ts — Băm phần NỘI DUNG của một bài học STEM.
//
// TÁCH RIÊNG khỏi `lessonReview.ts` một cách có chủ đích: file này dùng `node:crypto`, còn
// `lessonReview.ts` bị `subject-*/lessonTypes.ts` import nên đi thẳng vào bundle trình duyệt.
// Trộn chung là kéo module Node vào mã chạy ở trình duyệt. Chỉ test, script và server dùng file
// này.
//
// VÌ SAO CẦN BĂM: không có nó, một đợt sửa nội dung về sau đi qua bài đã duyệt, chữ `reviewed`
// ở lại, và không ai biết nó đã hết đúng — đúng khuôn bẫy `TRAPS.md` mục 4 ở dạng khác: trạng
// thái nói một đằng, dữ liệu một nẻo.
import { createHash } from 'node:crypto'

/** Phần bài học được coi là NỘI DUNG — sửa bất cứ thứ gì trong đây là lượt duyệt hết hiệu lực. */
export interface NoiDungCanDuyet {
  theory: string
  workedExample: { problem: string; steps: readonly string[]; answer: string }
  checkQuestions: readonly {
    prompt: string
    choices?: readonly { id: string; label: string }[]
    answer: unknown
    explain: string
  }[]
}

/**
 * SHA-256 của phần nội dung, dạng hex 64 ký tự.
 *
 * CỐ Ý KHÔNG băm cả bài: `title`, `hook`, `srsCards`, `animation` sửa được mà không làm sai
 * kiến thức người duyệt đã xác nhận, nên bắt duyệt lại vì một chữ trong `hook` chỉ tạo ra
 * nhiễu — rồi người ta sẽ duyệt lại lấy lệ, và cổng mất giá trị. Băm đúng ba phần mà bảy tiêu
 * chí `sinh-v1` thật sự phán về: lý thuyết, ví dụ mẫu, câu hỏi.
 */
export function bamNoiDungBaiHoc(bai: NoiDungCanDuyet): string {
  // Chuẩn hoá TRƯỚC khi băm. `answer` là object (AnswerSpec) nên thứ tự khoá trong mã nguồn
  // lọt được vào JSON.stringify; ai đó sắp xếp lại field là băm đổi và cả loạt bài bị đòi duyệt
  // lại oan. `jsonOnDinh` sắp khoá theo alphabet ở mọi độ sâu để băm chỉ đổi khi nội dung THẬT
  // sự đổi.
  const chuanHoa = {
    theory: bai.theory,
    workedExample: {
      problem: bai.workedExample.problem,
      steps: [...bai.workedExample.steps],
      answer: bai.workedExample.answer,
    },
    checkQuestions: bai.checkQuestions.map((q) => ({
      prompt: q.prompt,
      choices: q.choices ? q.choices.map((c) => ({ id: c.id, label: c.label })) : null,
      answer: q.answer,
      explain: q.explain,
    })),
  }
  return createHash('sha256').update(jsonOnDinh(chuanHoa), 'utf8').digest('hex')
}

/** JSON tất định: khoá object sắp theo alphabet ở mọi độ sâu; mảng giữ nguyên thứ tự (thứ tự
 *  câu hỏi và thứ tự bước giải LÀ nội dung, đổi thì phải duyệt lại thật). */
function jsonOnDinh(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null'
  if (Array.isArray(v)) return `[${v.map(jsonOnDinh).join(',')}]`
  const cap = Object.entries(v as Record<string, unknown>)
    .filter(([, giaTri]) => giaTri !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([khoa, giaTri]) => `${JSON.stringify(khoa)}:${jsonOnDinh(giaTri)}`)
  return `{${cap.join(',')}}`
}
