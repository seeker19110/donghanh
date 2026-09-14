// AdminStemReviewPanel.tsx — Tab "Duyệt nội dung STEM" trong /admin.
//
// Đặc tả: docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md (ô ②bis).
//
// CHỈ hiển thị TIẾN ĐỘ + liên kết mở nhanh bài kế tiếp chưa duyệt — không nhúng nội dung bài
// học (665 câu hỏi là quá nhiều cho một bảng). Duyệt THẬT diễn ra ngay trong trang bài học
// (`LuotDuyetBai`, cuối `StemLessonView`) — panel này chỉ là bảng điều khiển đi tới đó nhanh.
//
// Nạp CHỈ MỤC NHẸ của 4 môn (`loader.index`, vài trăm KB tổng cộng), không nạp registry đầy đủ
// (~2 MB) — bảng này chỉ cần id/tiêu đề/chương để biết bài nào còn thiếu.
import { useCallback, useEffect, useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { useToast } from '@core/ToastProvider'
import { getAuthHeader } from '@core/authHeader'
import { STEM_SUBJECTS, duongDanBaiHoc, type StemSubject } from '../../lib/stemLessonRoutes'
import type { StemSubjectId } from '@dhcb/core-contracts/stemLesson'

interface LuotDuyet {
  lessonId: string
  mon: StemSubjectId
  loai: 'ai-sang-loc' | 'nguoi-duyet'
}

function daDuyetXongTat(luot: LuotDuyet[], lessonId: string): boolean {
  return luot.some((l) => l.lessonId === lessonId && l.loai === 'nguoi-duyet')
}

function MonProgress({ subject, luotDuyet }: { subject: StemSubject; luotDuyet: LuotDuyet[] }) {
  const bai = subject.loader.index
  const daDuyet = bai.filter((b) => daDuyetXongTat(luotDuyet, b.id))
  const con = bai.filter((b) => !daDuyetXongTat(luotDuyet, b.id))
  const tienDo = bai.length === 0 ? 0 : Math.round((daDuyet.length / bai.length) * 100)
  const baiKeTiep = con[0]

  return (
    <div className="rounded-xl border border-line-subtle bg-surface-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-content">{subject.label}</h3>
        <span className="text-sm text-content-secondary">
          {daDuyet.length}/{bai.length} bài đã duyệt ({tienDo}%)
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-accent-500"
          style={{ width: `${tienDo}%` }}
          role="progressbar"
          aria-valuenow={tienDo}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Tiến độ duyệt môn ${subject.label}`}
        />
      </div>
      {baiKeTiep ? (
        <a
          href={duongDanBaiHoc(subject.id, baiKeTiep.id, baiKeTiep.title)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-[44px] items-center text-sm font-medium text-content underline underline-offset-2"
        >
          Duyệt bài kế tiếp: {baiKeTiep.title} →
        </a>
      ) : (
        <p className="mt-3 text-sm text-content-secondary">Đã duyệt hết bài của môn này.</p>
      )}
    </div>
  )
}

export default function AdminStemReviewPanel() {
  const toast = useToast()
  const toastError = toast.error
  const [luotDuyet, setLuotDuyet] = useState<LuotDuyet[] | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const headers = await getAuthHeader()
      setLoading(true)
      const res = await fetch('/api/admin-stem-review', { headers })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Lỗi ${res.status}`)
      }
      const body = (await res.json()) as { luotDuyet: LuotDuyet[] }
      setLuotDuyet(body.luotDuyet)
    } catch (err) {
      toastError(`Tải tiến độ duyệt thất bại: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }, [toastError])

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [load])

  const tongBai = Object.values(STEM_SUBJECTS).reduce((n, s) => n + s.loader.index.length, 0)
  const tongDaDuyet = luotDuyet
    ? Object.values(STEM_SUBJECTS).reduce(
        (n, s) => n + s.loader.index.filter((b) => daDuyetXongTat(luotDuyet, b.id)).length,
        0,
      )
    : 0

  return (
    <section className="rounded-2xl border border-line-subtle bg-surface-card p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-content">Duyệt nội dung STEM</h2>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line-strong px-3 text-sm text-content disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Tải lại
        </button>
      </div>
      <p className="mt-1 text-sm text-content-secondary">
        442/665 câu trắc nghiệm của 4 môn KHÔNG cổng máy nào kiểm được tính đúng kiến thức — duyệt
        ngay trong từng trang bài học, bảng này chỉ theo dõi tiến độ. Xem{' '}
        <code className="text-content">npm run review:status</code> để có số liệu chính xác nhất
        (đọc thẳng registry, không qua mạng).
      </p>

      {loading && !luotDuyet && (
        <p className="mt-4 flex items-center gap-2 text-content-secondary">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Đang tải…
        </p>
      )}

      {luotDuyet && (
        <>
          <p className="mt-4 font-medium text-content">
            Tổng: {tongDaDuyet}/{tongBai} bài đã duyệt
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {Object.values(STEM_SUBJECTS).map((s) => (
              <MonProgress key={s.id} subject={s} luotDuyet={luotDuyet} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
