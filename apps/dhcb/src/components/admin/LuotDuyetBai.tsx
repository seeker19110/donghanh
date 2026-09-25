// LuotDuyetBai.tsx — Khối duyệt chuyên môn đặt CUỐI trang bài học STEM, CHỈ hiện với admin.
//
// Đặc tả: docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md (ô ②bis, CHỐT Q1).
//
// Người duyệt trả lời 7 câu tiêu chí `sinh-v1` NGAY TẠI ĐÂY — đọc đúng thứ người học sẽ đọc,
// không phải một phiếu tách rời. Băm nội dung do SERVER tự tính (xem admin-stem-review.ts) —
// component này không gửi và không cần biết băm là gì.
import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, ChevronDown, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { useToast } from '@core/ToastProvider'
import { getAuthHeader } from '@core/authHeader'
import { buttonClass } from '@core/buttonStyles'
import {
  TIEU_CHI_DUYET,
  PHIEN_BAN_TIEU_CHI,
  type KetQuaTieuChi,
  type TieuChiDuyet,
} from '@dhcb/core-contracts/lessonReview'
import type { StemSubjectId } from '@dhcb/core-contracts/stemLesson'
import { thongDiepLoiQuanTri } from '../../lib/friendlyError'

const NHAN_TIEU_CHI: Record<TieuChiDuyet, string> = {
  dungChuongTrinh:
    'Đúng chương trình GDPT 2018 của lớp này (không dạy vượt, không thiếu trọng tâm)',
  khongSaiKienThuc: 'Không có điểm sai kiến thức nào',
  dapAnDung: 'Với mỗi câu trắc nghiệm: phương án đánh dấu ĐÚNG thật sự đúng',
  nhieuHopLy: 'Phương án nhiễu hợp lý (không sai lộ liễu, không hai phương án cùng đúng)',
  giaiThichDung: 'Lời giải nói được VÌ SAO, không chỉ nhắc lại đáp án',
  thuatNguChuan: 'Thuật ngữ đúng chuẩn SGK hiện hành',
  phuHopLuaTuoi: 'Không có nội dung cần diễn đạt lại theo lứa tuổi',
}

interface LuotDuyetDaGhi {
  loai: 'ai-sang-loc' | 'nguoi-duyet'
  nguoiDuyet: string | null
  ngay?: string
  capNhatLuc: string
}

/**
 * Bọc ngoài: chỉ admin mới vào tới phần có hook (`useToast`, `useEffect`, gọi API). Tách riêng
 * thay vì early-return SAU khi gọi hết hook — gọi `useToast()` vô điều kiện đòi hỏi mọi nơi
 * dựng `StemLessonView` (kể cả test, kể cả người dùng thường) phải có `<ToastProvider>`, dù
 * người dùng thường không bao giờ thấy khối này. Tách component để nó KHÔNG mount ở người
 * thường — không tốn một lượt gọi hook, một effect, hay một provider nào cho họ.
 */
export function LuotDuyetBai(props: { lessonId: string; mon: StemSubjectId }) {
  const { user } = useAuth()
  if (!user?.isAdmin) return null
  return <NoiDungLuotDuyetBai {...props} />
}

function NoiDungLuotDuyetBai({ lessonId, mon }: { lessonId: string; mon: StemSubjectId }) {
  const toast = useToast()
  const [mo, setMo] = useState(false)
  const [dangTai, setDangTai] = useState(false)
  const [dangGui, setDangGui] = useState(false)
  const [daDuyet, setDaDuyet] = useState<LuotDuyetDaGhi | null>(null)
  const [nguoiDuyet, setNguoiDuyet] = useState('')
  const [tieuChi, setTieuChi] = useState<KetQuaTieuChi>(
    () => Object.fromEntries(TIEU_CHI_DUYET.map((k) => [k, false])) as KetQuaTieuChi,
  )

  const taiLuotDuyet = useCallback(async () => {
    setDangTai(true)
    try {
      const headers = await getAuthHeader()
      const res = await fetch(
        `/api/admin-stem-review?mon=${mon}&lessonId=${encodeURIComponent(lessonId)}`,
        { headers },
      )
      if (!res.ok) return
      const body = (await res.json()) as { luotDuyet: LuotDuyetDaGhi[] }
      const nguoiDuyetTruoc = body.luotDuyet.find((l) => l.loai === 'nguoi-duyet')
      setDaDuyet(nguoiDuyetTruoc ?? null)
    } finally {
      setDangTai(false)
    }
  }, [mon, lessonId])

  useEffect(() => {
    // Hoãn sang microtask để KHÔNG setState đồng bộ trong thân effect (luật react-hooks 7).
    void Promise.resolve().then(taiLuotDuyet)
  }, [taiLuotDuyet])

  const datHet = TIEU_CHI_DUYET.every((k) => tieuChi[k])

  async function guiDuyet() {
    if (!nguoiDuyet.trim() || nguoiDuyet.trim().length < 2) {
      toast.error('Điền tên người duyệt (ít nhất 2 ký tự)')
      return
    }
    setDangGui(true)
    try {
      const headers = await getAuthHeader()
      const res = await fetch('/api/admin-stem-review', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loai: 'nguoi-duyet',
          lessonId,
          mon,
          nguoiDuyet: nguoiDuyet.trim(),
          phienBanTieuChi: PHIEN_BAN_TIEU_CHI,
          tieuChi,
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Lỗi ${res.status}`)
      }
      toast.success(datHet ? 'Đã ghi: bài đạt duyệt.' : 'Đã ghi: bài CHƯA đạt, còn tiêu chí trượt.')
      await taiLuotDuyet()
    } catch (err) {
      toast.error(`Ghi lượt duyệt thất bại: ${thongDiepLoiQuanTri(err)}`)
    } finally {
      setDangGui(false)
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-dashed border-line-strong bg-surface-muted p-4">
      <button
        type="button"
        onClick={() => setMo((v) => !v)}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 text-left"
        aria-expanded={mo}
      >
        <span className="font-semibold text-content">
          {daDuyet ? (
            <span className="inline-flex items-center gap-1.5 text-green-400 theme-light:text-green-900">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Đã duyệt bởi {daDuyet.nguoiDuyet} (
              {new Date(daDuyet.capNhatLuc).toLocaleDateString('vi-VN')})
            </span>
          ) : (
            '[Admin] Duyệt chuyên môn bài này'
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${mo ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {mo && (
        <div className="mt-4 space-y-4">
          {dangTai && (
            <p className="flex items-center gap-2 text-sm text-content-secondary">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Đang tải lượt duyệt
              trước đó…
            </p>
          )}

          <label className="block">
            <span className="text-sm font-medium text-content">Tên người duyệt</span>
            <input
              type="text"
              value={nguoiDuyet}
              onChange={(e) => setNguoiDuyet(e.target.value)}
              placeholder="Ví dụ: Cô Lan (GV Sinh THPT)"
              className="mt-1 min-h-[44px] w-full rounded-lg border border-line-strong bg-surface-card px-3 text-content"
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-content">
              Bộ tiêu chí {PHIEN_BAN_TIEU_CHI} — một câu "không" là bài chưa đạt
            </legend>
            {TIEU_CHI_DUYET.map((khoa) => (
              <label
                key={khoa}
                className="flex min-h-[44px] items-start gap-2 rounded-lg border border-line-subtle bg-surface-card p-2"
              >
                <input
                  type="checkbox"
                  checked={tieuChi[khoa]}
                  onChange={(e) => setTieuChi((prev) => ({ ...prev, [khoa]: e.target.checked }))}
                  className="mt-0.5 h-5 w-5 shrink-0"
                />
                <span className="text-sm text-content">{NHAN_TIEU_CHI[khoa]}</span>
              </label>
            ))}
          </fieldset>

          <p className="text-sm text-content-secondary">
            {datHet
              ? 'Đạt hết 7 tiêu chí — ghi lại sẽ đánh dấu bài này ĐÃ DUYỆT.'
              : 'Còn tiêu chí chưa tick — ghi lại vẫn lưu lại đánh giá này, nhưng bài KHÔNG được tính là đã duyệt.'}
          </p>

          <button
            type="button"
            onClick={() => void guiDuyet()}
            disabled={dangGui}
            className={buttonClass({ variant: 'primary' })}
          >
            {dangGui ? 'Đang ghi…' : 'Ghi lượt duyệt'}
          </button>
        </div>
      )}
    </section>
  )
}
