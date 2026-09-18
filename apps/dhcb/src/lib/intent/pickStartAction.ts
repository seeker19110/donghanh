// lib/intent/pickStartAction.ts — Chọn ĐÚNG MỘT việc để bắt đầu, từ ý định người học.
// Đặc tả: docs/specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md §③.3.
//
// HÀM THUẦN, TẤT ĐỊNH, KHÔNG GỌI AI: cùng đầu vào luôn ra cùng kết quả. Nhờ vậy test quét được
// TOÀN BỘ tổ hợp câu trả lời (1.152 tổ hợp đơn môn) và bộ lọc ngôn ngữ §③.5 trở thành bảo chứng
// thật chứ không phải lời hứa. Module này KHÔNG gọi AI, không gọi mạng — có test đọc chính mã
// nguồn file này để canh điều đó (AC-2/AC-11).
//
// LUẬT SỐ 1: đầu ra là MỘT VIỆC NÊN LÀM, không phải bảng đánh giá con người. Vì thế
// `StartActionResult` cố ý không mang lại `level`/`purpose`/`grade` — ý định là đầu vào, không
// bao giờ là đầu ra.

import { z } from 'zod'
import type { Outline } from '@dhcb/core-contracts/outline'
import { flattenLeaves } from '@dhcb/core-learner/outline/outlineNav'
import type {
  IntentSubjectId,
  IntentPurpose,
  IntentTimeBudget,
  LearnerIntent,
} from '@dhcb/core-contracts/learnerIntent'

/** Trang tổng quan của từng môn — đích rơi về khi môn chưa dựng được cây, hoặc cây khoá hết. */
export const SUBJECT_OVERVIEW_PATH: Readonly<Record<IntentSubjectId, string>> = {
  english: '/goc-hoc-tap/english',
  programming: '/goc-hoc-tap/programming',
  mathematics: '/goc-hoc-tap/mathematics',
  physics: '/goc-hoc-tap/physics',
  chemistry: '/goc-hoc-tap/chemistry',
  biology: '/goc-hoc-tap/biology',
}

/** Danh mục môn — đích khi người dùng bỏ hết 5 câu (KHÔNG mặc định môn Tiếng Anh). */
export const CATALOG_PATH = '/goc-hoc-tap'

export interface StartActionCtx {
  /** Cây mục lục từng môn (adapter S07-1, ĐÃ mang tiến độ + luật khoá). */
  outlines: ReadonlyMap<IntentSubjectId, Outline | undefined>
  /** Đích khi không có ý định nào — thường là `CATALOG_PATH`. */
  catalogPath: string
}

export const START_ACTION_SCHEMA_VERSION = 1

/**
 * Một việc gợi ý. `.strict()` là chốt chặn của bất biến T4: không ai thêm được `score`/`rank`
 * hay chính các trường của `LearnerIntent` vào đầu ra hiển thị.
 */
export const StartActionSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    why: z.string().min(1),
    href: z.string().regex(/^\/(?!\/)/, 'href phải là route nội bộ bắt đầu bằng một dấu /'),
    subjectId: z.string().min(1).optional(),
  })
  .strict()
export type StartAction = z.infer<typeof StartActionSchema>

export const StartActionResultSchema = z
  .object({
    schemaVersion: z.literal(START_ACTION_SCHEMA_VERSION),
    primary: StartActionSchema,
    alternatives: z.array(StartActionSchema).max(2),
  })
  .strict()
export type StartActionResult = z.infer<typeof StartActionResultSchema>

// ── Câu "vì sao việc này" ───────────────────────────────────────────────────
// Bảng CỐ ĐỊNH, ≤ 8 câu, viết sao cho qua được bộ lọc §③.5: không điểm, không bậc, không nhắc
// tới hồ sơ, không dùng token enum. Đây là chỗ dễ vi phạm nhất nên nó nằm gọn một chỗ để test
// quét hết.
const WHY_BY_PURPOSE: Readonly<Record<IntentPurpose, string>> = {
  thi_cu: 'Bài này bám sát thứ bạn sẽ cần cho kỳ thi sắp tới.',
  cong_viec: 'Bài này dùng được ngay vào việc hằng ngày của bạn.',
  so_thich: 'Bài này nhẹ nhàng, hợp để học vì thích.',
  chua_ro: 'Chưa rõ cũng không sao — mình chọn một bài để cùng bắt đầu.',
}

const WHY_BY_TIME: Readonly<Record<IntentTimeBudget, string>> = {
  5: 'Bài này vừa một buổi ngắn.',
  10: 'Mươi phút là xong một lượt.',
  20: 'Hai mươi phút đủ để đi hết bài này.',
  30: 'Nửa tiếng là bạn đi được trọn bài này.',
}

function cauViSao(intent: LearnerIntent): string {
  const theoThoiGian = intent.timeBudget ? WHY_BY_TIME[intent.timeBudget] : ''
  const theoMucDich = intent.purpose ? WHY_BY_PURPOSE[intent.purpose] : ''
  const cau = [theoMucDich, theoThoiGian].filter(Boolean).join(' ')
  return cau || 'Bắt đầu từ bài đầu tiên cho nhẹ nhàng.'
}

/** Việc của MỘT môn: lá đầu tiên còn học được, hoặc trang tổng quan môn nếu không có lá nào. */
function viecCuaMon(
  subjectId: IntentSubjectId,
  intent: LearnerIntent,
  ctx: StartActionCtx,
): StartAction {
  const outline = ctx.outlines.get(subjectId)
  const why = cauViSao(intent)
  const leaf = outline
    ? flattenLeaves(outline).find(
        (n) => n.availability === 'available' && n.progress !== 'completed' && n.href,
      )
    : undefined

  if (leaf?.href) {
    return {
      id: `${subjectId}:${leaf.nodeId}`,
      title: `Bắt đầu: ${leaf.title}`,
      why,
      href: leaf.href,
      subjectId,
    }
  }
  return {
    id: `${subjectId}:overview`,
    title: `Bắt đầu: xem nội dung môn`,
    why,
    href: SUBJECT_OVERVIEW_PATH[subjectId],
    subjectId,
  }
}

/**
 * Chọn một việc chính + tối đa hai việc thay thế.
 *
 * Không có ý định ⇒ dẫn về DANH MỤC MÔN, tuyệt đối không mặc định môn Tiếng Anh (bất biến T5).
 */
export function pickStartAction(
  intent: LearnerIntent | null,
  ctx: StartActionCtx,
): StartActionResult {
  if (!intent) {
    return {
      schemaVersion: START_ACTION_SCHEMA_VERSION,
      primary: {
        id: 'catalog',
        title: 'Xem các môn đang có',
        why: 'Chưa chọn môn nào cũng được — ngó qua danh mục rồi chọn sau.',
        href: ctx.catalogPath,
      },
      alternatives: [],
    }
  }

  const viec = intent.subjectIds.map((id) => viecCuaMon(id, intent, ctx))
  // `subjectIds` đã được hợp đồng bảo đảm không rỗng và không trùng, nên phần tử đầu luôn có.
  const [primary, ...con] = viec as [StartAction, ...StartAction[]]
  return {
    schemaVersion: START_ACTION_SCHEMA_VERSION,
    primary,
    alternatives: con.slice(0, 2),
  }
}

/** Mọi chuỗi mà người dùng THẤY trong một kết quả — đầu vào cho bộ lọc ngôn ngữ §③.5. */
export function collectStartActionTexts(result: StartActionResult): string[] {
  return [result.primary, ...result.alternatives].flatMap((a) => [a.title, a.why])
}
