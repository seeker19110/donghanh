// apps/dhcb/src/lib/subjectApi.ts — Client API for Multi-Subject Learning (V2-12)
//
// [S03-1, 2026-09-15] Trước đây hai hàm dưới chỉ `throw new Error(res.statusText)` và
// KHÔNG kiểm dữ liệu trả về. Nơi gọi (Subjects.tsx) bắt lỗi rồi biến thành danh sách
// rỗng, nên mất mạng / 503 / payload sai đều hiện ra đúng một màn hình "chưa có môn học
// nào" — người học tưởng catalog trống thật. Nay:
//   - Lỗi có PHÂN LOẠI (`SubjectApiError.kind`) kèm câu tiếng Việt nói đúng chuyện gì
//     đã xảy ra, để UI phân biệt được offline / máy chủ lỗi / dữ liệu sai.
//   - Response validate runtime bằng chính schema nguồn sự thật (CLAUDE.md mục 4.1).
//   - Nhận `AbortSignal` để nơi gọi huỷ request cũ khi người dùng đổi bộ lọc nhanh.
import { z } from 'zod'
import { getAuthHeader } from '@core/authHeader'
import { SubjectManifestSchema, type SubjectManifest } from '@dhcb/core-contracts/subjectManifest'

const API_BASE = '/api/subjects'

/**
 * Vì sao phân loại: ba nhóm này dẫn tới ba cách nói khác nhau với người dùng và ba cách
 * xử lý khác nhau (thử lại được ngay / chờ rồi thử lại / báo lỗi dữ liệu).
 * - `network`: fetch không tới được máy chủ (mất mạng, DNS, CORS) — chưa có mã HTTP.
 * - `http`: máy chủ trả mã lỗi; `status` giữ mã thật.
 * - `invalid`: gọi được, nhưng thân phản hồi không khớp hợp đồng dữ liệu.
 */
export type SubjectApiErrorKind = 'network' | 'http' | 'invalid'

export class SubjectApiError extends Error {
  readonly kind: SubjectApiErrorKind
  readonly status?: number

  constructor(kind: SubjectApiErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'SubjectApiError'
    this.kind = kind
    if (status !== undefined) this.status = status
  }
}

/** Envelope KHÔNG dùng `.strict()`: máy chủ thêm field bao ngoài (paging, meta…) không được
 *  phép làm hỏng cả danh mục. Riêng từng manifest thì giữ nguyên `.strict()` của hợp đồng. */
const ListResponseSchema = z.object({ subjects: z.array(SubjectManifestSchema) })
const DetailResponseSchema = z.object({ subject: SubjectManifestSchema })

/** Câu cho người dùng đọc, theo mã HTTP thật — không in `statusText` tiếng Anh ra giao diện. */
function httpMessage(status: number): string {
  if (status === 429) return 'Quá nhiều yêu cầu trong một phút. Chờ một chút rồi thử lại.'
  if (status === 503) return 'Máy chủ danh mục môn học đang bảo trì hoặc quá tải (503).'
  if (status >= 500) return `Máy chủ gặp lỗi khi trả danh mục môn học (${status}).`
  return `Máy chủ từ chối yêu cầu danh mục môn học (${status}).`
}

/** Mất mạng và "máy chủ trả lỗi" là hai chuyện khác nhau — nói đúng cái đang xảy ra. */
function networkMessage(): string {
  // `navigator.onLine === false` là bằng chứng chắc chắn; còn `true` KHÔNG bảo đảm có mạng
  // thật (máy vẫn nối wifi nhưng wifi không ra internet), nên chỉ dùng để nói rõ hơn khi
  // chắc chắn, mặc định giữ câu trung tính.
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false
  return offline
    ? 'Thiết bị đang ngoại tuyến nên chưa tải được danh mục môn học.'
    : 'Không kết nối được tới máy chủ để tải danh mục môn học.'
}

async function requestJson(url: string, signal?: AbortSignal): Promise<unknown> {
  let res: Response
  try {
    res = await fetch(url, { headers: getAuthHeader(), ...(signal ? { signal } : {}) })
  } catch (err: unknown) {
    // Huỷ request là hành vi BÌNH THƯỜNG (người dùng đổi bộ lọc), không phải lỗi để báo —
    // ném nguyên AbortError cho nơi gọi tự bỏ qua.
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new SubjectApiError('network', networkMessage())
  }

  if (!res.ok) {
    throw new SubjectApiError('http', httpMessage(res.status), res.status)
  }

  try {
    return (await res.json()) as unknown
  } catch {
    throw new SubjectApiError('invalid', 'Máy chủ trả về dữ liệu không đọc được.')
  }
}

export async function listSubjects(
  category?: 'language' | 'stem' | 'humanities',
  options?: { signal?: AbortSignal },
): Promise<SubjectManifest[]> {
  const url = category ? `${API_BASE}?category=${encodeURIComponent(category)}` : API_BASE
  const body = await requestJson(url, options?.signal)

  const parsed = ListResponseSchema.safeParse(body)
  if (!parsed.success) {
    throw new SubjectApiError('invalid', 'Danh mục môn học trả về không đúng định dạng.')
  }
  return parsed.data.subjects
}

export async function getSubjectDetails(
  subjectId: string,
  options?: { signal?: AbortSignal },
): Promise<SubjectManifest> {
  const url = `${API_BASE}?id=${encodeURIComponent(subjectId)}`
  const body = await requestJson(url, options?.signal)

  const parsed = DetailResponseSchema.safeParse(body)
  if (!parsed.success) {
    throw new SubjectApiError('invalid', 'Thông tin môn học trả về không đúng định dạng.')
  }
  return parsed.data.subject
}
