// admin-stem-review.ts — Bàn làm việc của người duyệt chuyên môn nội dung STEM.
//
// Đặc tả: docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md (ô ②bis).
//
// GET  /api/admin-stem-review?mon=biology[&lessonId=sinh12-c1-b1]
//        → các lượt duyệt đã ghi, để giao diện đổ lại vào form và để `review:sync` đọc ra.
// POST /api/admin-stem-review   body: { lessonId, mon, loai, ... } (xem GhiDuyetSchema)
//        → ghi/ghi đè lượt duyệt của CHÍNH người đang đăng nhập cho bài đó.
//
// BẢNG NÀY KHÔNG PHẢI NGUỒN SỰ THẬT: nội dung bài học nằm trong mã nguồn, cổng CI chạy trên
// repo. Luồng đúng là ghi ở đây → `npm run review:sync` → commit. Xem migration 0078.
import { z } from 'zod'
import { getPgPool } from '@dhcb/core-db/pgPool'
import {
  validateAuth,
  getCorsHeaders,
  SECURITY_HEADERS,
  checkRateLimit,
  logSecurityEvent,
} from '@dhcb/core-auth/security'
import { getUserById } from '@dhcb/core-auth/authService'
import { isAdminEmail } from '@dhcb/core-auth/adminAuth'
import { readJsonBody, validateBody } from '@dhcb/core-http/validation'
import { jsonResponse, getClientIp } from '@dhcb/core-http/http'
import { KetQuaTieuChiSchema } from '@dhcb/core-contracts/lessonReview'

const MON = ['math', 'physics', 'chemistry', 'biology'] as const
const LESSON_ID = /^(toan|ly|hoa|sinh)(10|11|12)-c\d+-b\d+$/

/** Thân yêu cầu ghi một lượt duyệt. Hai nhánh khớp đúng hai nhánh của `LessonReviewSchema` và
 *  của ràng buộc CHECK trong migration 0078 — ba nơi cùng một luật, cố ý. */
const GhiDuyetSchema = z.discriminatedUnion('loai', [
  z
    .object({
      loai: z.literal('nguoi-duyet'),
      lessonId: z.string().regex(LESSON_ID),
      mon: z.enum(MON),
      nguoiDuyet: z.string().trim().min(2).max(100),
      phienBanTieuChi: z.string().min(1).max(50),
      tieuChi: KetQuaTieuChiSchema,
      bamNoiDung: z.string().regex(/^[0-9a-f]{64}$/),
      ghiChu: z.string().max(4000).optional(),
    })
    .strict(),
  z
    .object({
      loai: z.literal('ai-sang-loc'),
      lessonId: z.string().regex(LESSON_ID),
      mon: z.enum(MON),
      soCoNghiNgo: z.number().int().nonnegative(),
      ghiChu: z.string().max(4000).optional(),
    })
    .strict(),
])

const DocSchema = z.object({
  mon: z.enum(MON).optional(),
  lessonId: z.string().regex(LESSON_ID).optional(),
})

interface DongDuyet {
  lesson_id: string
  mon: string
  loai: string
  nguoi_duyet: string | null
  phien_ban_tieu_chi: string | null
  tieu_chi: unknown
  bam_noi_dung: string | null
  ghi_chu: string | null
  cap_nhat_luc: Date
}

export default async function handler(req: Request): Promise<Response> {
  const allHeaders = { ...getCorsHeaders(req), ...SECURITY_HEADERS }
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: allHeaders })

  const clientIp = getClientIp(req)
  if (!(await checkRateLimit(clientIp, 60, 'admin-stem-review'))) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', clientIp, { path: '/api/admin-stem-review' })
    return jsonResponse({ error: 'Quá nhiều yêu cầu — thử lại sau 1 phút' }, 429, allHeaders)
  }

  // Thứ tự BẮT BUỘC: xác thực token trước, rồi mới hỏi email có phải admin không. Không tin
  // bất kỳ cờ admin nào do client gửi lên (CLAUDE.md mục 4.2).
  const auth = await validateAuth(req)
  if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401, allHeaders)

  const user = await getUserById(auth.userId)
  if (!isAdminEmail(user?.email)) {
    logSecurityEvent('ADMIN_ACCESS_DENIED', clientIp, { path: '/api/admin-stem-review' })
    return jsonResponse({ error: 'Chỉ admin mới truy cập được' }, 403, allHeaders)
  }

  const pool = getPgPool()

  if (req.method === 'GET') {
    const url = new URL(req.url)
    const parsed = DocSchema.safeParse({
      mon: url.searchParams.get('mon') ?? undefined,
      lessonId: url.searchParams.get('lessonId') ?? undefined,
    })
    if (!parsed.success) {
      return jsonResponse({ error: 'Tham số truy vấn không hợp lệ' }, 400, allHeaders)
    }
    const { mon, lessonId } = parsed.data
    const dieuKien: string[] = []
    const thamSo: unknown[] = []
    if (mon) {
      thamSo.push(mon)
      dieuKien.push(`mon = $${thamSo.length}`)
    }
    if (lessonId) {
      thamSo.push(lessonId)
      dieuKien.push(`lesson_id = $${thamSo.length}`)
    }
    const menhDeWhere = dieuKien.length > 0 ? `where ${dieuKien.join(' and ')}` : ''
    const { rows } = await pool.query<DongDuyet>(
      `select lesson_id, mon, loai, nguoi_duyet, phien_ban_tieu_chi, tieu_chi, bam_noi_dung,
              ghi_chu, cap_nhat_luc
         from public.stem_lesson_reviews
         ${menhDeWhere}
        order by lesson_id, loai`,
      thamSo,
    )
    return jsonResponse({ luotDuyet: rows.map(doiSangDangTraVe) }, 200, allHeaders)
  }

  if (req.method === 'POST') {
    const bodyResult = await readJsonBody(req)
    if (!bodyResult.ok) {
      return jsonResponse({ error: bodyResult.error.message }, bodyResult.error.status, allHeaders)
    }
    const parsed = validateBody(GhiDuyetSchema, bodyResult.raw)
    if (!parsed.ok) {
      return jsonResponse({ error: parsed.error.message }, parsed.error.status, allHeaders)
    }
    const d = parsed.data

    if (!khopMon(d.lessonId, d.mon)) {
      return jsonResponse(
        { error: `lessonId "${d.lessonId}" không thuộc môn "${d.mon}"` },
        400,
        allHeaders,
      )
    }

    // Khoá duy nhất là (lesson_id, nguoi_duyet, loai): người duyệt sửa lại đánh giá của chính
    // mình thì GHI ĐÈ, không đẻ thêm dòng. Với 'ai-sang-loc' thì nguoi_duyet là null nên chỉ có
    // một dòng máy cho mỗi bài — chạy lại sàng lọc là cập nhật, đúng như mong đợi.
    const { rows } = await pool.query<DongDuyet>(
      `insert into public.stem_lesson_reviews
         (lesson_id, mon, loai, nguoi_duyet, user_id, phien_ban_tieu_chi, tieu_chi, bam_noi_dung, ghi_chu)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       on conflict (lesson_id, coalesce(nguoi_duyet, ''), loai) do update set
         mon = excluded.mon,
         user_id = excluded.user_id,
         phien_ban_tieu_chi = excluded.phien_ban_tieu_chi,
         tieu_chi = excluded.tieu_chi,
         bam_noi_dung = excluded.bam_noi_dung,
         ghi_chu = excluded.ghi_chu,
         cap_nhat_luc = now()
       returning lesson_id, mon, loai, nguoi_duyet, phien_ban_tieu_chi, tieu_chi, bam_noi_dung,
                 ghi_chu, cap_nhat_luc`,
      d.loai === 'nguoi-duyet'
        ? [
            d.lessonId,
            d.mon,
            d.loai,
            d.nguoiDuyet.trim(),
            auth.userId,
            d.phienBanTieuChi,
            JSON.stringify(d.tieuChi),
            d.bamNoiDung,
            d.ghiChu ?? null,
          ]
        : [
            d.lessonId,
            d.mon,
            d.loai,
            null,
            auth.userId,
            null,
            null,
            null,
            `soCoNghiNgo=${d.soCoNghiNgo}${d.ghiChu ? `\n${d.ghiChu}` : ''}`,
          ],
    )
    const dong = rows[0]
    if (!dong) return jsonResponse({ error: 'Ghi không thành công' }, 500, allHeaders)
    return jsonResponse({ luotDuyet: doiSangDangTraVe(dong) }, 200, allHeaders)
  }

  return jsonResponse({ error: 'Method not allowed' }, 405, allHeaders)
}

/** Tiền tố id bài học của từng môn — chặn ghi nhầm bài Sinh vào môn Hoá. */
const TIEN_TO_MON: Record<(typeof MON)[number], string> = {
  math: 'toan',
  physics: 'ly',
  chemistry: 'hoa',
  biology: 'sinh',
}

function khopMon(lessonId: string, mon: (typeof MON)[number]): boolean {
  return lessonId.startsWith(TIEN_TO_MON[mon])
}

function doiSangDangTraVe(d: DongDuyet) {
  return {
    lessonId: d.lesson_id,
    mon: d.mon,
    loai: d.loai,
    nguoiDuyet: d.nguoi_duyet,
    phienBanTieuChi: d.phien_ban_tieu_chi,
    tieuChi: d.tieu_chi,
    bamNoiDung: d.bam_noi_dung,
    ghiChu: d.ghi_chu,
    capNhatLuc: d.cap_nhat_luc instanceof Date ? d.cap_nhat_luc.toISOString() : d.cap_nhat_luc,
  }
}

export const config = { runtime: 'edge' }
