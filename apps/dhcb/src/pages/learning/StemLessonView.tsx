// StemLessonView — học MỘT bài của môn STEM (Toán · Lí · Hoá · Sinh).
//
// Nhịp trang đi đúng thứ tự sư phạm đã chốt ở docs/specs/2026-09-13-hoan-thien-4-mon-stem.md:
// tình huống mở đầu → lý thuyết → hoạt ảnh → ví dụ mẫu → tự kiểm tra → thẻ ôn.
//
// Hai quyết định đáng nhớ:
//  1. Nội dung bài nạp LƯỜI theo chương (`loader.loadLesson`) — bốn registry cộng lại ~2 MB,
//     nhét thẳng vào bundle là mọi trang đều phải gánh.
//  2. Chấm câu hỏi bằng `gradeAnswer` của @dhcb/core-grading — hàm thuần, tất định, chạy
//     offline. KHÔNG có AI trong luồng phán đúng/sai (nguyên tắc bất di bất dịch của engine).
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import { gradeAnswer } from '@dhcb/core-grading'
import type { StemCheckQuestion, StemLessonLike } from '@dhcb/core-contracts/stemLesson'
import { LessonAnimation } from '@core/LessonAnimation'
import Layout from '../../components/Layout'
import { buttonClass } from '@core/buttonStyles'
import { usePageTitle } from '../../lib/usePageTitle'
import { ChuaDuyetChuyenMon } from '../../components/ChuaDuyetChuyenMon'
import { LuotDuyetBai } from '../../components/admin/LuotDuyetBai'
import { PageShell } from '@core/PageShell'
import { TwoPane } from '@core/TwoPane'
import {
  duongDanDanhSachBai,
  getStemSubject,
  maBaiTuUrl,
  nhanCapHsg,
} from '../../lib/stemLessonRoutes'
import { buildStemOutlineForApp } from '../../lib/outline/stemOutlineApp'
import { useOutlinePane } from '../../components/useOutlinePane'
import OutlinePrevNext from '../../components/OutlinePrevNext'
import { useIsDesktopViewport } from '../../lib/useIsDesktopViewport'

function CauHoi({ cau, thuTu }: { cau: StemCheckQuestion; thuTu: number }) {
  const [traLoi, setTraLoi] = useState('')
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null)

  function cham(giaTri: string) {
    if (!giaTri.trim()) return
    setKetQua(gradeAnswer(giaTri, cau.answer).correct ? 'dung' : 'sai')
  }

  return (
    <li className="rounded-xl border border-line-subtle bg-surface-card p-4">
      <p className="font-medium text-content">
        Câu {thuTu}. {cau.prompt}
      </p>

      {cau.choices ? (
        <ul className="mt-3 space-y-2">
          {cau.choices.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  setTraLoi(c.id)
                  cham(c.id)
                }}
                aria-pressed={traLoi === c.id}
                className={`w-full min-h-[44px] rounded-lg border px-4 py-2 text-left text-content ${
                  traLoi === c.id ? 'border-accent-500' : 'border-line-strong'
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <label className="sr-only" htmlFor={`tra-loi-${thuTu}`}>
            Câu trả lời của bạn cho câu {thuTu}
          </label>
          <input
            id={`tra-loi-${thuTu}`}
            value={traLoi}
            onChange={(e) => {
              setTraLoi(e.target.value)
              setKetQua(null)
            }}
            className="min-h-[44px] flex-1 rounded-lg border border-line-strong bg-surface-base px-3 text-content"
            placeholder="Nhập câu trả lời"
          />
          <button
            type="button"
            onClick={() => cham(traLoi)}
            className={buttonClass({ variant: 'primary' })}
          >
            Kiểm tra
          </button>
        </div>
      )}

      {ketQua && (
        <div className="mt-3" role="status">
          <p className="font-medium text-content">
            {ketQua === 'dung' ? (
              <>
                <Check className="inline h-4 w-4 mr-1" aria-hidden="true" />
                Đúng rồi.
              </>
            ) : (
              <>
                <X className="inline h-4 w-4 mr-1" aria-hidden="true" />
                Chưa đúng.
              </>
            )}
          </p>
          <p className="mt-1 text-content-secondary">{cau.explain}</p>
        </div>
      )}
    </li>
  )
}

export default function StemLessonView() {
  const { subjectId, lessonSlug } = useParams<{ subjectId: string; lessonSlug: string }>()
  const subject = getStemSubject(subjectId)
  const lessonId = maBaiTuUrl(lessonSlug)

  // Giữ CẢ mã bài trong state, rồi suy ra trạng thái tải bằng cách so với mã bài đang xem.
  // Nhờ vậy không phải gọi setState đồng bộ ngay đầu effect khi chuyển bài (ESLint chặn, và
  // đó cũng là một lượt render thừa) — chuyển bài là kết quả cũ tự khác mã, tức đang tải.
  const [ketQua, setKetQua] = useState<{
    id: string
    bai: StemLessonLike | null
    loi: boolean
  } | null>(null)

  const tomTat = useMemo(() => subject?.loader.getSummary(lessonId), [subject, lessonId])
  usePageTitle(tomTat?.title ?? 'Bài học')

  useEffect(() => {
    if (!subject || !lessonId) return
    let huy = false
    subject.loader
      .loadLesson(lessonId)
      .then((l) => {
        if (!huy) setKetQua({ id: lessonId, bai: l ?? null, loi: false })
      })
      .catch(() => {
        if (!huy) setKetQua({ id: lessonId, bai: null, loi: true })
      })
    return () => {
      huy = true
    }
  }, [subject, lessonId])

  const daTaiXong = ketQua?.id === lessonId
  const bai = daTaiXong ? ketQua.bai : null
  const trangThai = !daTaiXong ? 'dang-tai' : ketQua.loi ? 'loi' : 'xong'

  // Mục lục môn (S07-2). Dựng từ CHỈ MỤC (`tomTat`), không chờ nội dung bài tải xong — nhờ
  // vậy cột trái có ngay từ khung hình đầu và không gây nhảy layout khi bài về.
  const isDesktop = useIsDesktopViewport()
  const outline = subject && tomTat ? buildStemOutlineForApp(subject, tomTat.grade) : undefined
  const { rail, trigger, sheet } = useOutlinePane({
    outline,
    activeContentId: lessonId,
    title: 'Mục lục môn học',
    storageKey: `${subject?.id ?? 'stem'}:${tomTat?.grade ?? '?'}`,
    isDesktop,
  })

  if (!subject) return <Navigate to="/goc-hoc-tap" replace />

  const duongDanVe = duongDanDanhSachBai(subject.id)

  return (
    <>
      {/* `focus`: trang ngồi học lâu → ẩn bộ chuyển Studio + huy hiệu streak (xem Layout). */}
      <Layout focus />
      <PageShell width={isDesktop && rail ? 'standard' : 'reading'}>
        <TwoPane isDesktop={isDesktop} railSide="left" railLabel="Mục lục môn học" rail={rail}>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={duongDanVe}
              className="inline-flex min-h-[44px] items-center gap-2 text-content-secondary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Bài học môn {subject.label}
            </Link>
            {trigger}
          </div>

          {trangThai === 'dang-tai' && <p className="mt-6 text-content-secondary">Đang tải bài…</p>}

          {trangThai === 'loi' && (
            <p className="mt-6 text-content">
              Không tải được nội dung bài. Kiểm tra kết nối mạng rồi tải lại trang.
            </p>
          )}

          {trangThai === 'xong' && !bai && (
            <p className="mt-6 text-content">
              Không tìm thấy bài học này. Có thể liên kết đã cũ —{' '}
              <Link to={duongDanVe} className="underline">
                xem danh sách bài
              </Link>
              .
            </p>
          )}

          {bai && (
            <article className="mt-4">
              <p className="text-content-muted">
                {bai.track === 'advanced'
                  ? `Chuyên đề bồi dưỡng học sinh giỏi · ${nhanCapHsg(bai.advancedTier)}`
                  : `Lớp ${bai.grade} · Chương ${bai.chapterNumber}: ${bai.chapterTitle}`}
              </p>
              {/* `tabIndex={-1}`: không thêm điểm dừng Tab, nhưng cho phép đưa tiêu điểm tới
                bằng mã lệnh — panel mục lục mobile đóng xong sẽ focus đúng vào đây. */}
              <h1
                tabIndex={-1}
                className="mt-1 text-2xl sm:text-3xl font-extrabold text-content focus:outline-none"
              >
                {bai.title}
              </h1>

              {bai.reviewStatus === 'draft' && <ChuaDuyetChuyenMon />}

              <p className="mt-4 text-content-secondary">{bai.hook}</p>

              <h2 className="mt-8 text-xl font-bold text-content">Lý thuyết</h2>
              <p className="mt-2 whitespace-pre-line text-content">{bai.theory}</p>

              {bai.animation && (
                <>
                  <h2 className="mt-8 text-xl font-bold text-content">Hoạt ảnh minh hoạ</h2>
                  <LessonAnimation spec={bai.animation} className="mt-2" />
                </>
              )}

              <h2 className="mt-8 text-xl font-bold text-content">Ví dụ mẫu</h2>
              <p className="mt-2 text-content">{bai.workedExample.problem}</p>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-content">
                {bai.workedExample.steps.map((buoc, i) => (
                  <li key={i}>{buoc}</li>
                ))}
              </ol>
              <p className="mt-3 font-medium text-content">Đáp số: {bai.workedExample.answer}</p>

              <h2 className="mt-8 text-xl font-bold text-content">Tự kiểm tra</h2>
              <ul className="mt-3 space-y-4">
                {bai.checkQuestions.map((cau, i) => (
                  <CauHoi key={i} cau={cau} thuTu={i + 1} />
                ))}
              </ul>

              <h2 className="mt-8 text-xl font-bold text-content">Thẻ ôn tập</h2>
              <dl className="mt-3 space-y-3">
                {bai.srsCards.map((the, i) => (
                  <div key={i} className="rounded-xl border border-line-subtle bg-surface-card p-4">
                    <dt className="font-medium text-content">{the.hoi}</dt>
                    <dd className="mt-1 text-content-secondary">{the.dap}</dd>
                  </div>
                ))}
              </dl>

              <LuotDuyetBai lessonId={bai.id} mon={subject.id} />

              {/* Bài trước / bài sau theo đúng cây đang mở (AC-14). */}
              <OutlinePrevNext outline={outline} contentId={lessonId} />
            </article>
          )}
        </TwoPane>
      </PageShell>
      {sheet}
    </>
  )
}
