// Practice — trang GỘP "Luyện tập" (4 kỹ năng Nghe/Nói/Đọc/Viết vào 1 trang).
// Các tính năng NẶNG (AI hội thoại, chấm bài viết) vẫn ở nguyên trang gốc /chat,
// /speaking, /writing — trang này chỉ điều hướng tới (KHÔNG đổi code các trang đó).
// Các bài tập MỚI chạy ngay tại đây, dùng lại dữ liệu/hàm đã có sẵn (curriculum,
// listening.ts, PronunciationCheck, challengeTopics) — không soạn nội dung mới,
// TRỪ 2 bài đợt 2 (shadowing, phỏng vấn ngược) cần gọi AI chấm nội dung —
// dùng chung cột lượt "speaking" đã có (LIMITS trong types.ts), KHÔNG thêm cột mới.
//
// [2026-09-06] File này từng dài 1.752 dòng; 8 mini-game + phần dùng chung nay nằm ở
// `pages/learning/practice/` (mỗi game một file), file này chỉ còn TRANG CHÍNH (hub).
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '../../lib/usePageTitle'
import {
  duongDanBaiHocAnh,
  duongDanCauThongDung,
  duongDanLuyenNghe,
  duongDanLuyenNoi,
  duongDanLuyenViet,
  duongDanSoTayLoiSai,
  duongDanThuThach,
  duongDanTroTruyen,
  duongDanTruyen,
  duongDanTuDien,
} from '../../lib/englishRoutes'
import {
  Headphones,
  Mic,
  PenLine,
  MessageCircle,
  Volume2,
  Keyboard,
  ListChecks,
  Shuffle,
  ChevronRight,
  Sparkles,
  BookOpen,
  BookMarked,
  Video,
  AlertCircle,
  Award,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Activity,
  GraduationCap,
  ArrowRight,
} from 'lucide-react'
import Layout from '../../components/Layout.js'
import { PageShell } from '@core/PageShell'
import PvPArenaCard from '../../components/PvPArena/PvPArenaCard.js'
import { useLang } from '../../context/useLang'
import { useAuth } from '../../context/useAuth'
import { loadCurriculum, getLearningPath } from '../../lib/curriculum'
import { getDirection } from '../../lib/storage'
import { getLearnedWords } from '../../lib/vocab'
import type { DictEntry } from '../../types'
import { shuffle } from '@dhcb/core-contracts/shuffle'
import { goToSubjects, duongDanMonTiengAnh } from '../../lib/subjectsHost'
import { SESSION_SIZE } from './practice/shared'
import { MiniHeader } from './practice/GameChrome'
import type { Mode } from './practice/shared'
import { VocabListenGuess } from './practice/VocabListenGuess'
import { SentenceScramble } from './practice/SentenceScramble'
import { DictationTyping } from './practice/DictationTyping'
import { FillBlankQuiz } from './practice/FillBlankQuiz'
import { PronounceList } from './practice/PronounceList'
import { Shadowing } from './practice/Shadowing'
import { ReverseInterview } from './practice/ReverseInterview'

// ── Trang chính ─────────────────────────────────────────────────────────
export default function Practice() {
  const nav = useNavigate()
  const { user } = useAuth()
  const ownerToken = useMemo(() => ({ owner: user?.id }), [user?.id])
  const uiLang: 'vi' | 'en' = useLang().lang === 'vi' ? 'vi' : 'en'
  const isUiVi = uiLang === 'vi'
  usePageTitle(isUiVi ? 'Luyện tập | Đồng hành cùng bạn' : 'Practice | Your Companion')
  const [mode, setMode] = useState<Mode>('hub')
  const [pool, setPool] = useState<DictEntry[]>([])
  const [poolState, setPoolState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [poolOwner, setPoolOwner] = useState<string | undefined>(undefined)
  const [retryPool, setRetryPool] = useState(0)
  const [session, setSession] = useState<{
    ownerToken: object
    direction: 'A' | 'B'
    pool: DictEntry[]
    pronunciationItems: string[]
  } | null>(null)

  useEffect(() => {
    let active = true
    loadCurriculum()
      .then(() => {
        if (!active) return
        const learned = getLearnedWords(user?.id ?? '')
        const path = getLearningPath()
        let p = path.filter((w) => learned.has(w.word.toLowerCase()))
        if (p.length < 12) p = path.slice(0, 80)
        setPool(p)
        setPoolOwner(user?.id)
        setPoolState('ready')
      })
      .catch(() => {
        if (active) {
          setPoolOwner(user?.id)
          setPoolState('error')
        }
      })
    return () => {
      active = false
    }
  }, [user?.id, retryPool])

  function openMode(nextMode: Exclude<Mode, 'hub'>) {
    if (poolState !== 'ready' || poolOwner !== user?.id) return
    const direction = getDirection() === 'B' ? 'B' : 'A'
    const learningIsA = direction === 'A'
    const sentencePool = pool.filter((w) => (learningIsA ? w.ex_en : w.ex_vi))
    const pronunciationItems =
      nextMode === 'pronounce-words'
        ? shuffle(pool)
            .slice(0, SESSION_SIZE)
            .map((w) => (learningIsA ? w.word : w.vi))
        : nextMode === 'read-aloud'
          ? shuffle(sentencePool)
              .slice(0, SESSION_SIZE)
              .map((w) => (learningIsA ? w.ex_en : w.ex_vi))
          : []
    setSession({ ownerToken, direction, pool: [...pool], pronunciationItems })
    setMode(nextMode)
  }

  function closeMode() {
    setSession(null)
    setMode('hub')
  }

  const activeMode = session?.ownerToken === ownerToken ? mode : 'hub'
  const poolReadyForUser = poolState === 'ready' && poolOwner === user?.id
  const learningIsA = session?.direction !== 'B'
  const sentencePool = useMemo(
    () => session?.pool.filter((w) => (session.direction === 'A' ? w.ex_en : w.ex_vi)) ?? [],
    [session],
  )

  if (activeMode !== 'hub' && session) {
    const titles: Record<Exclude<Mode, 'hub'>, [string, string]> = {
      'vocab-listen': [
        isUiVi ? 'Nghe đoán từ vựng' : 'Listen & guess',
        isUiVi ? 'Nghe rồi chọn nghĩa đúng' : 'Listen then pick the meaning',
      ],
      scramble: [
        isUiVi ? 'Sắp xếp câu' : 'Sentence scramble',
        isUiVi ? 'Ghép từ đúng thứ tự' : 'Put the words in order',
      ],
      dictation: [
        isUiVi ? 'Nghe & viết lại' : 'Listen & write',
        isUiVi ? 'Nghe rồi gõ lại câu' : 'Listen then type the sentence',
      ],
      fillblank: [
        isUiVi ? 'Điền từ trắc nghiệm' : 'Fill in the blank',
        isUiVi ? 'Chọn từ đúng cho câu' : 'Pick the right word',
      ],
      'pronounce-words': [
        isUiVi ? 'Chấm phát âm từ vựng' : 'Word pronunciation',
        isUiVi ? 'Đọc to từng từ, AI chấm điểm' : 'Read each word aloud',
      ],
      'read-aloud': [
        isUiVi ? 'Đọc lại câu' : 'Read the sentence',
        isUiVi ? 'Đọc to cả câu, AI chấm điểm' : 'Read the sentence aloud',
      ],
      shadowing: [
        isUiVi ? 'Shadowing' : 'Shadowing',
        isUiVi ? 'Nghe & nói đè theo ngay khi audio phát' : 'Speak along as the audio plays',
      ],
      interview: [
        isUiVi ? 'Phỏng vấn ngược' : 'Reverse interview',
        isUiVi ? 'AI hỏi, bạn trả lời nói, AI chấm nội dung' : 'AI asks, you answer, AI grades',
      ],
    }
    const [title, sub] = titles[activeMode]
    return (
      <>
        <Layout onBack={closeMode} />
        {/* [2026-09-02, đợt 4 thiết kế lại desktop] Bài luyện tập 1 lượt → width reading. */}
        <PageShell
          width="reading"
          baseWidth="max-w-2xl"
          className="!pb-[calc(1.5rem+var(--bnav-h))]"
        >
          <MiniHeader title={title} sub={sub} onBack={closeMode} />
          {activeMode === 'vocab-listen' && (
            <VocabListenGuess
              pool={session.pool}
              isA={learningIsA}
              uiLang={uiLang}
              onExit={closeMode}
            />
          )}
          {activeMode === 'scramble' && (
            <SentenceScramble
              pool={sentencePool}
              isA={learningIsA}
              uiLang={uiLang}
              onExit={closeMode}
            />
          )}
          {activeMode === 'dictation' && (
            <DictationTyping
              pool={sentencePool}
              isA={learningIsA}
              uiLang={uiLang}
              onExit={closeMode}
            />
          )}
          {activeMode === 'fillblank' && (
            <FillBlankQuiz
              pool={sentencePool}
              isA={learningIsA}
              uiLang={uiLang}
              onExit={closeMode}
            />
          )}
          {activeMode === 'pronounce-words' && (
            <PronounceList
              items={session.pronunciationItems}
              isA={learningIsA}
              uiLang={uiLang}
              lang={learningIsA ? 'en' : 'vi'}
              onExit={closeMode}
            />
          )}
          {activeMode === 'read-aloud' && (
            <PronounceList
              items={session.pronunciationItems}
              isA={learningIsA}
              uiLang={uiLang}
              lang={learningIsA ? 'en' : 'vi'}
              onExit={closeMode}
            />
          )}
          {activeMode === 'shadowing' && (
            <Shadowing pool={sentencePool} isA={learningIsA} uiLang={uiLang} onExit={closeMode} />
          )}
          {activeMode === 'interview' && user && (
            <ReverseInterview isA={learningIsA} uiLang={uiLang} user={user} onExit={closeMode} />
          )}
        </PageShell>
      </>
    )
  }

  return (
    <>
      <Layout
        back={false}
        title={
          isUiVi ? 'Phòng Luyện Tập Đa Môn & Sửa Lỗi' : 'Multi-Subject Practice & Mistake Studio'
        }
      />
      {/* [2026-09-02, đợt 4 thiết kế lại desktop] Trung tâm luyện tập, nhiều thẻ → width standard. */}
      <PageShell width="standard" baseWidth="max-w-3xl" className="space-y-7">
        <h1 tabIndex={-1} className="sr-only focus:outline-none">
          {isUiVi ? 'Phòng Luyện Tập Đa Môn & Sửa Lỗi' : 'Multi-Subject Practice & Mistake Studio'}
        </h1>

        {/* ── BANNER SPOTLIGHT: SỔ TAY SỬA LỖI ĐA MÔN & CUNG ĐIỆN TRÍ NHỚ ── */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-rose-500/15 via-zinc-900/90 to-amber-500/10 border border-rose-500/30 hover:border-rose-500/60 transition-all duration-200 shadow-lg group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform text-white font-bold">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-white text-base">Sổ Tay Sửa Lỗi Đa Môn AI</h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                Tự động tổng hợp các bẫy biến đổi Toán - Lý - Hóa, lỗi phát âm IPA, sai ngữ pháp
                IELTS để bạn ôn tập ngắt quãng (SRS) và không lặp lại lỗi sai.
              </p>
            </div>
          </div>
          <button
            onClick={() => nav(duongDanSoTayLoiSai())}
            className="tap-44 w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95 shrink-0"
          >
            <span>Mở Sổ Lỗi & Ôn Tập</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* DailyQuestsCard + ReferralVipBanner (dữ liệu giả in-memory) đã gỡ 2026-08-23 — hệ nhiệm vụ/giới thiệu THẬT ở /nhiem-vu và /profile (QuestsPanel, ReferralSection) */}

        {/* ── ĐẤU TRƯỜNG 1V1 PVP ARENA ── */}
        <PvPArenaCard />

        {/* ── TẦNG 1: LUYỆN TẬP 5 MÔN HỌC CỐT LÕI & GIẢI ĐỀ AI ── */}
        <section aria-label="Luyện tập 5 Môn học cốt lõi" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 theme-light:text-blue-800">
              1. Luyện Tập 5 Môn Học & Giải Đề Từng Bước
            </h2>
            <button
              onClick={() => goToSubjects(nav)}
              className="text-[11px] text-zinc-400 hover:text-blue-300 transition flex items-center gap-1 font-medium"
            >
              <span>Xem tất cả môn</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Toán Học */}
            <button
              onClick={() => goToSubjects(nav, 'mathematics')}
              className="tap-44 p-4 rounded-3xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-blue-500/30 hover:border-blue-500/60 text-left transition-all duration-200 group active:scale-[0.98] shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-bold text-white text-sm">Toán Học</h3>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-300 theme-light:text-blue-800 font-semibold border border-blue-500/20">
                      Giải từng bước
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    Khảo sát hàm số, đạo hàm, tích phân, hình học Oxyz & giải đề thi.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-blue-400 theme-light:text-blue-800 font-medium pt-2 border-t border-zinc-800/80">
                <span>Giải bài tập & Nhận gợi ý gợi mở</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Vật Lý */}
            <button
              onClick={() => goToSubjects(nav, 'physics')}
              className="tap-44 p-4 rounded-3xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-cyan-500/30 hover:border-cyan-500/60 text-left transition-all duration-200 group active:scale-[0.98] shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Atom className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-bold text-white text-sm">Vật Lý</h3>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 theme-light:text-cyan-800 font-semibold border border-cyan-500/20">
                      Thí nghiệm mô phỏng
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    Dao động cơ, sóng âm, điện xoay chiều kèm phân tích công thức.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-cyan-400 theme-light:text-cyan-800 font-medium pt-2 border-t border-zinc-800/80">
                <span>Luyện giải & Thí nghiệm</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Hóa Học */}
            <button
              onClick={() => goToSubjects(nav, 'chemistry')}
              className="tap-44 p-4 rounded-3xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all duration-200 group active:scale-[0.98] shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-bold text-white text-sm">Hóa Học</h3>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 theme-light:text-amber-800 font-semibold border border-amber-500/20">
                      Cân bằng phản ứng
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    Cân bằng oxi hóa khử, este - lipit, amino axit & bài toán dung dịch.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-400 theme-light:text-amber-800 font-medium pt-2 border-t border-zinc-800/80">
                <span>Luyện chuỗi phản ứng</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Sinh Học */}
            <button
              onClick={() => goToSubjects(nav, 'biology')}
              className="tap-44 p-4 rounded-3xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all duration-200 group active:scale-[0.98] shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Dna className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-bold text-white text-sm">Sinh Học</h3>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 theme-light:text-emerald-800 font-semibold border border-emerald-500/20">
                      Di Truyền
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    Di truyền Mendel, phiên mã ADN, đột biến gen và phả hệ.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-400 theme-light:text-emerald-800 font-medium pt-2 border-t border-zinc-800/80">
                <span>Luyện giải bài tập ADN</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Tiếng Anh Song Ngữ */}
            <button
              onClick={() => nav(duongDanMonTiengAnh())}
              className="tap-44 p-4 rounded-3xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-purple-500/30 hover:border-purple-500/60 text-left transition-all duration-200 group active:scale-[0.98] shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-bold text-white text-sm">Tiếng Anh CEFR</h3>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-300 theme-light:text-purple-800 font-semibold border border-purple-500/20">
                      A1 - C2
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    Lộ trình chuẩn hóa 6 cấp độ CEFR, từ vựng và phản xạ ngữ cảnh.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-purple-400 theme-light:text-purple-800 font-medium pt-2 border-t border-zinc-800/80">
                <span>Khám phá lộ trình</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* 10 Simulators Thí Nghiệm */}
            <button
              onClick={() => nav('/ung-dung-thuc-te')}
              className="tap-44 p-4 rounded-3xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-teal-500/30 hover:border-teal-500/60 text-left transition-all duration-200 group active:scale-[0.98] shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-bold text-white text-sm">10 thí nghiệm STEM</h3>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-teal-500/15 text-teal-300 theme-light:text-teal-800 font-semibold border border-teal-500/20">
                      Phòng Thí Nghiệm
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    Mô phỏng điện EVN, con lắc lò xo, tên lửa nước, thấu kính quang học.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-teal-400 theme-light:text-teal-800 font-medium pt-2 border-t border-zinc-800/80">
                <span>Vào phòng thí nghiệm</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </section>

        {/* ── TẦNG 2: 4 TRỤ CỘT KỸ NĂNG CHÍNH (Core Skills Mastery) ── */}
        <section aria-label="4 Kỹ năng cốt lõi" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent-400 theme-light:text-accent-800">
              2. 4 Kỹ Năng Đàm Thoại & Đánh Giá AI
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Luyện Nói & IPA */}
            <button
              onClick={() => nav(duongDanLuyenNoi())}
              className="tap-44 p-4 rounded-3xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-sky-500/30 hover:border-sky-500/60 text-left transition-all duration-200 group active:scale-[0.98] shadow-sm flex items-start gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5 text-zinc-950 font-bold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="font-bold text-white text-sm">Luyện Nói & Chấm Âm IPA</h3>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-300 theme-light:text-sky-800 font-semibold border border-sky-500/20">
                    Nghe bạn nói
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  Đàm thoại tự do, nhận diện và chấm điểm từng âm vị IPA, sửa lỗi bằng tiếng mẹ đẻ.
                </p>
              </div>
            </button>

            {/* Luyện Viết & IELTS */}
            <button
              onClick={() => nav(duongDanLuyenViet())}
              className="tap-44 p-4 rounded-3xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-violet-500/30 hover:border-violet-500/60 text-left transition-all duration-200 group active:scale-[0.98] shadow-sm flex items-start gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <PenLine className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="font-bold text-white text-sm">Luyện Viết & Chấm IELTS</h3>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-violet-500/15 text-violet-300 theme-light:text-violet-800 font-semibold border border-violet-500/20">
                    Chấm kiểu IELTS
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  Chấm 4 tiêu chí Task, Coherence, Lexical, Grammar kèm gợi ý viết lại xuất sắc.
                </p>
              </div>
            </button>

            {/* Chat Đối Thoại Gợi Mở */}
            <button
              onClick={() => nav(duongDanTroTruyen())}
              className="tap-44 p-4 rounded-3xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-accent-500/30 hover:border-accent-500/60 text-left transition-all duration-200 group active:scale-[0.98] shadow-sm flex items-start gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-500 to-amber-500 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 text-zinc-950 font-bold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="font-bold text-white text-sm">Chat Đàm Thoại AI</h3>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-accent-500/15 text-accent-300 theme-light:text-accent-800 font-semibold border border-accent-500/20">
                    Gợi mở
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  Nhập vai tình huống thực tế, trò chuyện linh hoạt và sửa lỗi ngữ cảnh tức thì.
                </p>
              </div>
            </button>

            {/* Thư Viện Nghe */}
            <button
              onClick={() => nav(duongDanLuyenNghe())}
              className="tap-44 p-4 rounded-3xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-rose-500/30 hover:border-rose-500/60 text-left transition-all duration-200 group active:scale-[0.98] shadow-sm flex items-start gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="font-bold text-white text-sm">Thư Viện Luyện Nghe</h3>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-300 theme-light:text-rose-800 font-semibold border border-rose-500/20">
                    Giọng bản xứ
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  Kho bài nghe, truyện cổ tích và hội thoại mẫu giọng bản xứ chuẩn Mỹ.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* ── TẦNG 3: 8 BÀI TẬP PHẢN XẠ NHANH (Interactive Drill Studio) ── */}
        <section
          aria-label={isUiVi ? 'Bài tập tương tác nhanh' : 'Quick interactive exercises'}
          className="space-y-3"
        >
          {(poolState === 'loading' || poolOwner !== user?.id) && (
            <p role="status" className="text-sm text-zinc-300">
              {isUiVi ? 'Đang tải nội dung luyện tập…' : 'Loading practice content…'}
            </p>
          )}
          {poolState === 'error' && poolOwner === user?.id && (
            <div role="alert" className="flex items-center gap-3 text-sm text-zinc-200">
              <span>
                {isUiVi ? 'Chưa tải được nội dung luyện tập.' : 'Could not load practice content.'}
              </span>
              <button
                type="button"
                className="underline underline-offset-2"
                onClick={() => {
                  setPoolState('loading')
                  setPool([])
                  setRetryPool((n) => n + 1)
                }}
              >
                {isUiVi ? 'Thử lại' : 'Retry'}
              </button>
            </div>
          )}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              {isUiVi ? '3. 8 Chế Độ Luyện Tập Phản Xạ Nhanh' : '3. Eight quick practice modes'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. Nghe đoán từ */}
            <button
              disabled={!poolReadyForUser}
              onClick={() => openMode('vocab-listen')}
              className="tap-44 flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 text-left transition active:scale-[0.98] group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 theme-light:text-sky-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                  {isUiVi ? 'Nghe Đoán Từ Vựng' : 'Listen and guess vocabulary'}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {isUiVi ? 'Nghe phát âm, chọn nghĩa đúng' : 'Listen and choose the meaning'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
            </button>

            {/* 2. Sắp xếp câu */}
            <button
              disabled={!poolReadyForUser}
              onClick={() => openMode('scramble')}
              className="tap-44 flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 text-left transition active:scale-[0.98] group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 theme-light:text-indigo-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Shuffle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {isUiVi ? 'Sắp Xếp Câu Hoàn Chỉnh' : 'Put the sentence in order'}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {isUiVi
                    ? 'Ghép từ ngữ thành câu chuẩn ngữ pháp'
                    : 'Arrange words into a sentence'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
            </button>

            {/* 3. Nghe viết chính tả */}
            <button
              disabled={!poolReadyForUser}
              onClick={() => openMode('dictation')}
              className="tap-44 flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 text-left transition active:scale-[0.98] group"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-400 theme-light:text-violet-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Keyboard className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                  {isUiVi ? 'Nghe & Viết Chính Tả' : 'Listen and type'}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {isUiVi
                    ? 'Nghe từng câu và gõ lại chính xác'
                    : 'Listen to each sentence and type it'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
            </button>

            {/* 4. Điền từ trắc nghiệm */}
            <button
              disabled={!poolReadyForUser}
              onClick={() => openMode('fillblank')}
              className="tap-44 flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 text-left transition active:scale-[0.98] group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 theme-light:text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <ListChecks className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                  {isUiVi ? 'Điền Từ Ngữ Cảnh' : 'Fill in the blank'}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {isUiVi
                    ? 'Chọn từ chính xác để hoàn chỉnh câu'
                    : 'Choose the word that completes the sentence'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
            </button>

            {/* 5. Chấm phát âm từ */}
            <button
              disabled={!poolReadyForUser}
              onClick={() => openMode('pronounce-words')}
              className="tap-44 flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 text-left transition active:scale-[0.98] group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 theme-light:text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  {isUiVi ? 'Chấm Phát Âm Từ Vựng' : 'Word pronunciation'}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {isUiVi ? 'Đọc to từ vựng, AI chấm điểm chuẩn' : 'Read words aloud for feedback'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
            </button>

            {/* 6. Đọc diễn cảm cả câu */}
            <button
              disabled={!poolReadyForUser}
              onClick={() => openMode('read-aloud')}
              className="tap-44 flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 text-left transition active:scale-[0.98] group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 theme-light:text-rose-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                  {isUiVi ? 'Đọc Lại Câu Ví Dụ' : 'Read example sentences'}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {isUiVi
                    ? 'Rèn ngữ điệu và nối âm tự nhiên'
                    : 'Practice intonation and connected speech'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
            </button>

            {/* 7. Shadowing */}
            <button
              disabled={!poolReadyForUser}
              onClick={() => openMode('shadowing')}
              className="tap-44 flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 text-left transition active:scale-[0.98] group"
            >
              <div className="w-9 h-9 rounded-xl bg-accent-500/15 text-accent-400 theme-light:text-accent-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-accent-300 transition-colors truncate">
                  {isUiVi ? 'Nói Đè Theo Mẫu' : 'Shadow the model'}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {isUiVi ? 'Nói đồng thời theo nhịp audio phát' : 'Speak along with the audio'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
            </button>

            {/* 8. Phỏng vấn ngược */}
            <button
              disabled={!poolReadyForUser}
              onClick={() => openMode('interview')}
              className="tap-44 flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 text-left transition active:scale-[0.98] group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 theme-light:text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                  {isUiVi ? 'Phỏng Vấn Ngược AI' : 'Reverse interview'}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {isUiVi
                    ? 'AI đặt câu hỏi, bạn trả lời bằng giọng nói'
                    : 'Answer AI questions by voice'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
            </button>
          </div>
        </section>

        {/* ── TẦNG 4: SỔ TAY LỖI SAI & KHO HỌC LIỆU BỔ TRỢ (Resource & Tool Vault) ── */}
        <section aria-label="Kho học liệu bổ trợ" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              4. Kho Học Liệu Bổ Trợ
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* [2026-09-22, audit UI/UX P2-1] Ô "Sổ Tay Lỗi Sai" ở đây đã gỡ: cùng đích với
                banner đầu trang, một trang không mở cùng một cửa hai lần. */}
            {/* Từ điển 12k từ */}
            <button
              onClick={() => nav(duongDanTuDien())}
              className="tap-44 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-amber-500/40 text-left transition active:scale-[0.98] group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 theme-light:text-amber-800 flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition">
                <BookOpen className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white truncate">Từ Điển 12k+ IPA</p>
              <p className="text-[11px] text-zinc-400 truncate">Tra cứu & Nghe phát âm</p>
            </button>

            {/* Truyện song ngữ */}
            <button
              onClick={() => nav(duongDanTruyen())}
              className="tap-44 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-pink-500/40 text-left transition active:scale-[0.98] group"
            >
              <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-400 theme-light:text-pink-800 flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition">
                <BookMarked className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white truncate">Truyện Karaoke Text</p>
              <p className="text-[11px] text-zinc-400 truncate">Vừa nghe vừa sáng chữ</p>
            </button>

            {/* Mẫu câu thông dụng */}
            <button
              onClick={() => nav(duongDanCauThongDung())}
              className="tap-44 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-blue-500/40 text-left transition active:scale-[0.98] group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 theme-light:text-blue-800 flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition">
                <MessageCircle className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white truncate">Mẫu Câu Giao Tiếp</p>
              <p className="text-[11px] text-zinc-400 truncate">Câu thông dụng hằng ngày</p>
            </button>

            {/* Bài học mẫu */}
            <button
              onClick={() => nav(duongDanBaiHocAnh())}
              className="tap-44 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-teal-500/40 text-left transition active:scale-[0.98] group"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-400 theme-light:text-teal-800 flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition">
                <Award className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white truncate">100+ Hội Thoại Mẫu</p>
              <p className="text-[11px] text-zinc-400 truncate">Tình huống theo chủ đề</p>
            </button>

            {/* Video Thử Thách */}
            <button
              onClick={() => nav(duongDanThuThach())}
              className="tap-44 p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-orange-500/40 text-left transition active:scale-[0.98] group"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 theme-light:text-orange-800 flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition">
                <Video className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white truncate">Thử Thách 1 Phút</p>
              <p className="text-[11px] text-zinc-400 truncate">Video nói tiếng Anh tuần</p>
            </button>
          </div>
        </section>
      </PageShell>
    </>
  )
}
