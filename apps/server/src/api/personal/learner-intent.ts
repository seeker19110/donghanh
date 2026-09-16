// api/personal/learner-intent.ts — Ý ĐỊNH HỌC của tài khoản (slice S05-1).
// Đặc tả: docs/specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md §③.2.
//
// GET  /api/learner-intent            → 200 { intent: LearnerIntent | null }
// PUT  /api/learner-intent { intent } → 200 { ok: true, intent }   (upsert theo user_id)
//
// Thứ tự kiểm cố định (đúng khuôn `intake.ts`): OPTIONS → rate limit → xác thực → method → Zod.
// Endpoint này KHÔNG bao giờ trả trường ngoài hợp đồng `LearnerIntent` — không điểm, không bậc,
// không xếp hạng (luật số 1 của sản phẩm).

import { z } from 'zod'
import { getPgPool } from '@dhcb/core-db/pgPool'
import {
  getCorsHeaders,
  SECURITY_HEADERS,
  checkRateLimit,
  validateAuth,
  logSecurityEvent,
} from '@dhcb/core-auth/security'
import { LearnerIntentSchema } from '@dhcb/core-contracts/learnerIntent'
import { getLearnerIntent, saveLearnerIntent } from '@dhcb/core-personal/learnerIntentService'
import { validateBody, readJsonBody } from '@dhcb/core-http/validation'
import { jsonResponse, getClientIp } from '@dhcb/core-http/http'

const BodySchema = z.object({ intent: LearnerIntentSchema })

export default async function handler(req: Request): Promise<Response> {
  const allHeaders = { ...getCorsHeaders(req), ...SECURITY_HEADERS }
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: allHeaders })

  const clientIp = getClientIp(req)
  if (!(await checkRateLimit(clientIp, 30, 'learner-intent'))) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', clientIp, { path: '/api/learner-intent' })
    return jsonResponse({ error: 'Quá nhiều yêu cầu — thử lại sau 1 phút' }, 429, allHeaders)
  }

  // Khách vãng lai KHÔNG gọi route này (ý định của khách nằm ở localStorage) — 401 ở đây là
  // đúng hợp đồng, không phải ngõ cụt của luồng `/bat-dau`.
  const auth = await validateAuth(req)
  if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401, allHeaders)

  const pool = getPgPool()

  if (req.method === 'GET') {
    // Chưa có dòng ⇒ `{ intent: null }` chứ không 404: "chưa có ý định" là trạng thái bình thường.
    const intent = await getLearnerIntent(pool, auth.userId)
    return jsonResponse({ intent }, 200, allHeaders)
  }

  if (req.method !== 'PUT') {
    return jsonResponse({ error: 'Method not allowed' }, 405, allHeaders)
  }

  const parsedBody = await readJsonBody(req)
  if (!parsedBody.ok)
    return jsonResponse({ error: parsedBody.error.message }, parsedBody.error.status, allHeaders)
  const result = validateBody(BodySchema, parsedBody.raw)
  if (!result.ok)
    return jsonResponse({ error: result.error.message }, result.error.status, allHeaders)

  const intent = await saveLearnerIntent(pool, auth.userId, result.data.intent)
  return jsonResponse({ ok: true, intent }, 200, allHeaders)
}
