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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import { z } from 'zod'
import { gradeAnswer } from '@dhcb/core-grading'
import type {
  StemCheckQuestion,
  StemLessonLike,
  StemSubjectId,
} from '@dhcb/core-contracts/stemLesson'
import { STEM_CHECK_PASS_RATIO } from '@dhcb/core-learner/completionRules'
import { LessonAnimation } from '@core/LessonAnimation'
import Layout from '../../components/Layout'
import { buttonClass } from '@core/buttonStyles'
import { usePageTitle } from '../../lib/usePageTitle'
import { useAuth } from '../../context/useAuth'
import { contentFingerprint } from '../../lib/learningSession'
import { useLearningSession } from '../../lib/useLearningSession'
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
import { LoiTienDo } from '../../components/OutlinePane'
import OutlinePrevNext from '../../components/OutlinePrevNext'
import ActivityResult from '../../components/learning/ActivityResult'
import { ketQuaSangManHinh } from '../../lib/stemResultView'
import { useStemCompletionState } from '../../lib/useStemCompletionState'
import { useIsDesktopViewport } from '../../lib/useIsDesktopViewport'
import {
  submitStemEvidence,
  flushPendingEvidence,
  hasPendingEvidence,
  type SubmitEvidenceResult,
} from '../../lib/stemEvidence'
import { prevNext } from '@dhcb/core-learner/outline/outlineNav'

// Nháp phần "Tự kiểm tra": CHỈ chữ người học gõ + danh sách câu đã bấm chấm.
// KHÔNG lưu kết quả đúng/sai — nó được TÍNH LẠI bằng `gradeAnswer` (hàm thuần, offline) mỗi lần
// dựng trang. Một nguồn sự thật cho việc chấm, và nháp không bao giờ là bằng chứng hoàn thành.
const stemDraftSchema = z.object({
  answers: z.record(z.string(), z.string()),
  checked: z.array(z.string()),
})
type StemDraft = z.infer<typeof stemDraftSchema>

const NHAP_RONG: StemDraft = { answers: {}, checked: [] }

function CauHoi({
  cau,
  thuTu,
  traLoi,
  daCham,
  onChon,
  onGo,
  onKiemTra,
}: {
  cau: StemCheckQuestion
  thuTu: number
  traLoi: string
  daCham: boolean
  onChon: (giaTri: string) => void
  onGo: (giaTri: string) => void
  onKiemTra: () => void
}) {
  // Kết quả SUY RA, không lưu: có bấm chấm và có chữ thì mới có đúng/sai.
  const ketQua: 'dung' | 'sai' | null =
    daCham && traLoi.trim() ? (gradeAnswer(traLoi, cau.answer).correct ? 'dung' : 'sai') : null

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
                onClick={() => onChon(c.id)}
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
            onChange={(e) => onGo(e.target.value)}
            className="min-h-[44px] flex-1 rounded-lg border border-line-strong bg-surface-base px-3 text-content"
            placeholder="Nhập câu trả lời"
          />
          <button type="button" onClick={onKiemTra} className={buttonClass({ variant: 'primary' })}>
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

/**
 * Phần "Tự kiểm tra" — MỘT nguồn ghi cho đáp án của mọi câu, để nháp sống qua reload.
 *
 * Vì sao tách thành component riêng: hook phiên học cần `bai` đã tải xong, mà bài STEM nạp lười
 * nên lúc `StemLessonView` mount thì chưa có `bai.id`/`bai.checkQuestions` — hook thì không được
 * gọi có điều kiện. Trang dựng nó với `key={bai.id}` nên đổi bài là dựng lại sạch.
 *
 * Ranh giới: đây chỉ là NHÁP trên cùng thiết bị. Bài STEM vẫn KHÔNG có tiến độ/evidence —
 * không khoá localStorage nào khác, không endpoint, không cột DB (đặc tả S08 §① KHÔNG LÀM).
 */
function TuKiemTra({
  bai,
  subjectId,
  nextHref,
  onSubmitted,
}: {
  bai: StemLessonLike
  subjectId: StemSubjectId
  /** Bài kế tiếp theo cây mục lục — màn kết quả mời đi tiếp thay vì bỏ người học ở đó. */
  nextHref?: string
  /** Nộp xong (bất kể đạt hay chưa) thì mục lục phải đọc lại trạng thái từ nguồn sự thật. */
  onSubmitted?: () => void
}) {
  const { user, loading, isGuest } = useAuth()
  // Owner `null` khi AuthProvider chưa xong → hook ở trạng thái `loading`, tuyệt đối không ghi.
  const owner = useMemo(
    () =>
      loading || !user
        ? null
        : { kind: isGuest ? ('guest' as const) : ('account' as const), id: user.id },
    [loading, user, isGuest],
  )

  // Vân tay khung bài: đổi đề thì nháp cũ thành `stale` và bị bỏ IM LẶNG (§3.5 của đặc tả) —
  // nháp STEM chỉ là chữ/chỉ số nên không đáng làm phiền người học bằng một hộp hỏi.
  const contentVersion = useMemo(
    () =>
      contentFingerprint([
        bai.id,
        bai.title,
        bai.checkQuestions.length,
        ...bai.checkQuestions.map((c) => c.prompt),
      ]),
    [bai],
  )

  const initial = useCallback(() => ({ stepIndex: 0, draft: NHAP_RONG }), [])
  const stepLabel = useCallback(() => 'Tự kiểm tra', [])

  const phien = useLearningSession<StemDraft>({
    owner,
    subjectId,
    contentId: bai.id,
    contentVersion,
    draftSchema: stemDraftSchema,
    initial,
    stepLabel,
  })

  const { draft, setDraft } = phien

  // Trắc nghiệm: bấm là chọn VÀ chấm luôn (giữ đúng hành vi đang có).
  const chon = useCallback(
    (i: number, giaTri: string) =>
      setDraft((prev) => ({
        answers: { ...prev.answers, [i]: giaTri },
        checked: prev.checked.includes(String(i)) ? prev.checked : [...prev.checked, String(i)],
      })),
    [setDraft],
  )

  // Tự luận: gõ là bỏ kết quả cũ, chỉ chấm khi bấm "Kiểm tra" (hành vi hiện có, giữ nguyên).
  const go = useCallback(
    (i: number, giaTri: string) =>
      setDraft((prev) => ({
        answers: { ...prev.answers, [i]: giaTri },
        checked: prev.checked.filter((k) => k !== String(i)),
      })),
    [setDraft],
  )

  const kiemTra = useCallback(
    (i: number) =>
      setDraft((prev) =>
        !(prev.answers[String(i)] ?? '').trim() || prev.checked.includes(String(i))
          ? prev
          : { ...prev, checked: [...prev.checked, String(i)] },
      ),
    [setDraft],
  )

  // ── Nộp bài: MỘT lượt cho cả bài, và người phán "đạt hay chưa" là SERVER (S11-2) ──
  const [dangNop, setDangNop] = useState(false)
  const [ketQuaNop, setKetQuaNop] = useState<SubmitEvidenceResult | null>(null)

  const uid = owner?.id ?? ''
  const soCau = bai.checkQuestions.length
  const daTraLoiHet =
    soCau > 0 &&
    bai.checkQuestions.every((_, i) => (draft.answers[String(i)] ?? '').trim().length > 0)

  // Gửi lại những lượt nộp đang kẹt trên máy này (mất mạng / server lỗi / hết phiên lúc nộp).
  // CÓ ĐIỀU KIỆN `hasPendingEvidence`: hàng đợi rỗng thì KHÔNG có request nào rời trình duyệt,
  // nên "mở bài" vẫn là không-gửi-gì (AC-13).
  useEffect(() => {
    if (!uid || owner?.kind !== 'account') return
    const gui = () => {
      if (hasPendingEvidence(uid)) void flushPendingEvidence(uid)
    }
    gui()
    window.addEventListener('online', gui)
    return () => window.removeEventListener('online', gui)
  }, [uid, owner?.kind])

  // Nạp TRƯỚC phần chấm điểm STEM (đợi lười, xem lib/stemEvidence.ts) ngay khi vào bài — lúc này
  // người học còn đang trả lời, còn thời gian để trình duyệt tải xong trước khi bấm Nộp. Không
  // await kết quả: nộp bài vẫn hoạt động đúng nếu preload chưa xong, chỉ là submitStemEvidence tự
  // await import() của chính nó lần nữa (cache module, gần như không tốn thêm gì).
  useEffect(() => {
    void import('@dhcb/core-learner/stemGrading.js')
  }, [])

  const nop = useCallback(async () => {
    if (!uid || dangNop) return
    setDangNop(true)
    // Nộp rồi thì mọi câu đều phải hiện đúng/sai — kể cả câu tự luận chưa bấm "Kiểm tra".
    setDraft((prev) => ({ ...prev, checked: bai.checkQuestions.map((_, i) => String(i)) }))
    const answers = bai.checkQuestions
      .map((_, i) => ({ questionIndex: i, raw: (draft.answers[String(i)] ?? '').trim() }))
      .filter((a) => a.raw.length > 0)
    try {
      setKetQuaNop(
        await submitStemEvidence(
          uid,
          { subjectId, contentId: bai.id, activityKind: 'stem_lesson_check', answers },
          bai,
        ),
      )
      onSubmitted?.()
    } finally {
      setDangNop(false)
    }
  }, [uid, dangNop, setDraft, bai, subjectId, draft.answers, onSubmitted])

  return (
    <>
      <h2 className="mt-8 text-xl font-bold text-content">Tự kiểm tra</h2>
      {phien.storageMode === 'memory' && (
        <p className="mt-2 text-content-secondary" role="status">
          Trình duyệt đang chặn lưu nháp — rời trang là mất phần đang gõ.
        </p>
      )}
      <ul className="mt-3 space-y-4">
        {bai.checkQuestions.map((cau, i) => (
          <CauHoi
            key={i}
            cau={cau}
            thuTu={i + 1}
            traLoi={draft.answers[String(i)] ?? ''}
            daCham={draft.checked.includes(String(i))}
            onChon={(giaTri) => chon(i, giaTri)}
            onGo={(giaTri) => go(i, giaTri)}
            onKiemTra={() => kiemTra(i)}
          />
        ))}
      </ul>

      {soCau > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => void nop()}
            disabled={!daTraLoiHet || dangNop || !uid}
            className={`${buttonClass({ variant: 'primary' })} min-h-[44px] disabled:opacity-60`}
          >
            {dangNop ? 'Đang nộp…' : 'Nộp bài tự kiểm tra'}
          </button>
          {!daTraLoiHet && (
            <p className="mt-2 text-content-secondary">Trả lời đủ {soCau} câu rồi mới nộp được.</p>
          )}
          {ketQuaNop && (
            <ActivityResult
              {...ketQuaSangManHinh(ketQuaNop, bai, draft.answers)}
              passRatio={STEM_CHECK_PASS_RATIO}
              onRetry={() => setKetQuaNop(null)}
              {...(nextHref ? { nextHref } : {})}
            />
          )}
        </div>
      )}
    </>
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
  // [S11-3] Lớp tiến độ: đọc `completion_state` MỘT LẦN khi mở, và lại sau mỗi lượt nộp
  // thành công (`reload` truyền xuống `TuKiemTra`). Không polling — mở bài không bao giờ ghi.
  const tienDo = useStemCompletionState(subject?.id)
  const outline =
    subject && tomTat ? buildStemOutlineForApp(subject, tomTat.grade, tienDo) : undefined
  const { rail, trigger, sheet } = useOutlinePane({
    outline,
    activeContentId: lessonId,
    title: 'Mục lục môn học',
    storageKey: `${subject?.id ?? 'stem'}:${tomTat?.grade ?? '?'}`,
    isDesktop,
    ...(tienDo.stateStatus === 'error' ? { footer: <LoiTienDo onRetry={tienDo.reload} /> } : {}),
  })
  // Bài kế tiếp theo ĐÚNG cây đang mở — cùng nguồn với hai nút "Bài trước / Bài sau" bên dưới.
  const baiSau = outline ? prevNext(outline, lessonId).next?.href : undefined

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

              <TuKiemTra
                key={bai.id}
                bai={bai}
                subjectId={subject.id}
                onSubmitted={tienDo.reload}
                {...(baiSau ? { nextHref: baiSau } : {})}
              />

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
