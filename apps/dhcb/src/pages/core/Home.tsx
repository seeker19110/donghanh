// apps/dhcb/src/pages/core/Home.tsx — Trang chủ: một việc tiếp theo, hỏi nhanh, rồi danh sách bộ môn.
//
// [2026-09-03, đợt C thiết kế lại UI/UX] Gỡ banner "Bạn Đồng Hành AI Đa Miền" (là lối vào thứ ba
// tới trang Bạn Đồng Hành trên cùng một màn — header và thẻ AI đã có), thu 3 thẻ quảng cáo bộ môn
// thành một danh sách phẳng. Xem docs/changelog/0262-*.md.
import { useEffect, useMemo, useState } from 'react'
import FirstTaskCard from '../../components/FirstTaskCard'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, History, TrendingUp, Briefcase } from 'lucide-react'
import Layout from '../../components/Layout.js'
import PricePromoBanner from '../../components/PricePromoBanner.js'
import RewardTipBanner from '../../components/RewardTipBanner.js'
import HomeAiBriefingCard, { type HomeComeback } from '../../components/Home/HomeAiBriefingCard.js'
import TodayCard from '../../components/Home/TodayCard.js'
import HomeUniversalAiBar from '../../components/Home/HomeUniversalAiBar.js'
import SubjectSpaceList from '../../components/Home/SubjectSpaceList.js'
import GuestHome from '../../components/Home/GuestHome.js'
import { usePageTitle } from '../../lib/usePageTitle'
import { useLang } from '../../context/useLang'
import { useAuth } from '../../context/useAuth'
import { useCloudSync } from '../../lib/useCloudSync'
import type { CefrLevel } from '../../data/cefr'
import type { Circle } from '../../data/curriculum'
import { loadCefr } from '../../data/cefrLoader'
import { loadFoundation } from '../../data/curriculumLoader'
import { getLearnedWords } from '../../lib/vocab'
import { getDoneGrammar, computeLockedMapFromServer } from '../../lib/cefrProgress'
import { getPassedExamLevels } from '../../lib/cefrExam'
import { getSRSStats } from '../../lib/srs'
import { getDailyLearned, getDailyMax } from '../../lib/curriculum'
import { useTodayPlan } from '../../lib/today/useTodayPlan'
import { ENGLISH_SUBJECT_ID, englishNext, duongDanCapCefr } from '../../lib/today/englishNext'
import { useIsDesktopViewport } from '../../lib/useIsDesktopViewport'
import { PageShell } from '@core/PageShell'
import { TwoPane } from '@core/TwoPane'
import {
  shouldShowComeback,
  dismissComebackToday,
  comebackDaysAway,
  COMEBACK_SRS_CARDS,
  COMEBACK_NEW_WORDS,
} from '../../lib/comeback'
import { duongDanHubOnTap } from '../../lib/reviewRoutes'
import { pickHomeBanner } from '../../lib/home/pickHomeBanner'
import { daysUntilPlanExpires } from '../../lib/planExpiryBanner'
import { daysUntilPromoEnds } from '../../lib/promoEndingBanner'
import { getAppSettings } from '../../lib/appSettings'
import { shouldShowRewardTip } from '../../lib/rewardTip'

export default function Home() {
  const nav = useNavigate()
  const { user, isGuest } = useAuth()
  const { T, lang } = useLang()
  // [Slice 04] `vi` = ngôn ngữ GIAO DIỆN; `isA` (chiều học Tiếng Anh) chỉ còn dùng cho nhãn NỘI
  // DUNG của môn (tên vòng từ vựng/bài ngữ pháp có bản Việt/Anh riêng).
  const vi = lang === 'vi'
  const syncVersion = useCloudSync(user?.id)
  // Desktop ≥1024px: bố cục 2 cột (chính + ngữ cảnh). Quyết định bằng JS chứ không bằng
  // `lg:hidden` để KHÔNG render trùng nội dung ở 2 nơi (xem useIsDesktopViewport.ts).
  const isDesktop = useIsDesktopViewport()

  const [comebackClosed, setComebackClosed] = useState(false)

  const [cefrLevels, setCefrLevels] = useState<CefrLevel[]>([])
  const [circleById, setCircleById] = useState<Record<string, Circle>>({})

  usePageTitle('Trang chủ | Đồng hành cùng bạn')

  useEffect(() => {
    Promise.all([loadCefr(), loadFoundation()]).then(([lv, foundation]) => {
      setCefrLevels(lv)
      setCircleById(Object.fromEntries(foundation.map((c) => [c.id, c])))
    })
  }, [])

  const uid = user?.id ?? ''
  // syncVersion tăng khi cloud sync xong → tham chiếu nó trong thân memo (void) để
  // dependency là "thật" (đọc lại localStorage đúng lúc), không cần eslint-disable.
  const learned = useMemo(() => {
    void syncVersion
    return getLearnedWords(uid)
  }, [uid, syncVersion])
  const doneGrammar = useMemo(() => {
    void syncVersion
    return getDoneGrammar(uid)
  }, [uid, syncVersion])
  const examPassed = useMemo(() => {
    void syncVersion
    return getPassedExamLevels(uid)
  }, [uid, syncVersion])

  // Quyền mở cấp do SERVER cấp (GĐ2a) — client chỉ đọc danh sách server trả về.
  const lockedMap = useMemo(
    () => computeLockedMapFromServer(uid, cefrLevels, examPassed),
    [uid, cefrLevels, examPassed],
  )

  // "Hôm nay": mọi luật chọn việc nằm ở `useTodayPlan` + `buildTodayPlan` (thuần, test bảng).
  // Home chỉ lắp ráp — gọi hook TRƯỚC mọi `return` sớm để thứ tự hook không đổi giữa các lần vẽ.
  const { plan: todayPlan, state: todayState, retry: todayRetry } = useTodayPlan(uid)
  // Người này có đang học môn Tiếng Anh không — quyết định dòng kế toán "x/y từ" (§7 Q5).
  const hocTiengAnh = todayPlan?.subjectsSeen.includes(ENGLISH_SUBJECT_ID) ?? false

  // [S06-3] Cấp CEFR "đang đi tới" của luồng quay lại lấy từ ĐÚNG adapter mà thẻ "Hôm nay" dùng
  // (`englishNext` bọc `findNextStep`), thay cho bản chép vòng lặp từng nằm ở đây và ở
  // `EnglishHome`. Không bọc useMemo: phép tính thuần, rẻ (≤6 cấp) — compiler tự memo.
  const { levelId: continueLevelId } = englishNext({
    levels: cefrLevels,
    circleById,
    learned,
    doneGrammar,
    lockedMap,
    isA: vi,
  })
  const continueHref = continueLevelId ? duongDanCapCefr(continueLevelId) : ''

  const showComeback = !comebackClosed && !!continueLevelId && shouldShowComeback(uid)
  const daysAway = showComeback ? comebackDaysAway(uid) : 0
  function closeComeback() {
    dismissComebackToday(uid)
    setComebackClosed(true)
  }

  if (!user) return null

  // [P0-3] Khách (chưa đăng nhập) có trang chủ RIÊNG, đơn giản hơn hẳn: không "Hôm nay"/streak/
  // lịch sử (những thứ đó cần tài khoản để tính) — chỉ Companion giới thiệu + ĐÚNG MỘT CTA vào
  // `/bat-dau` + dải môn. Trả sớm TRƯỚC khi tính mọi state chỉ người đã đăng nhập mới cần.
  if (isGuest) {
    return (
      <div className="min-h-dvh bg-zinc-950 text-zinc-100">
        <Layout title={T.greeting} back={false} />
        <PageShell width="standard" baseWidth="max-w-3xl">
          <GuestHome />
        </PageShell>
      </div>
    )
  }

  const srsDue = getSRSStats(user.id).due
  const dailyLearned = getDailyLearned(user.id)
  const dailyMax = getDailyMax(user.id)

  // [P0-2] Luồng "quay lại sau bỏ bẵng" gộp vào bong bóng Companion (`HomeAiBriefingCard`),
  // không còn là `.glass` card riêng — xem docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md.
  const comeback: HomeComeback | undefined =
    showComeback && continueLevelId
      ? {
          daysAway,
          reviewLabel: srsDue > 0 ? `Ôn ${Math.min(srsDue, COMEBACK_SRS_CARDS)} thẻ` : null,
          onReview: () => nav(duongDanHubOnTap(COMEBACK_SRS_CARDS)),
          learnLabel: `Học ${COMEBACK_NEW_WORDS} từ mới`,
          onLearnNew: () => nav(`${continueHref}?tab=today&cap=${COMEBACK_NEW_WORDS}`),
          onDismiss: closeComeback,
        }
      : undefined

  // ── Các khối nội dung tách riêng để LẮP LẠI theo 2 bố cục (mobile 1 cột / desktop 2 cột).
  // Mỗi khối chỉ render MỘT lần trong cây DOM, không nhân bản rồi ẩn bằng CSS.
  // [P0-1] `space-y-3` riêng (tách khỏi `space-y-5` của khung ngoài) để nhóm "Hôm nay" là khối
  // tương phản lớn nhất, gọn trong khung nhìn di động 390×844 không cần cuộn (AC-4).
  const topBlocks = (
    <div className="space-y-3">
      {/* Việc đầu tiên chọn ở luồng người mới — tự ẩn khi đã xong hoặc chưa chọn */}
      <FirstTaskCard />

      {/* ── TẦNG 1: EXECUTIVE AI COMPANION — lời chào + bản tin + luồng "quay lại" (S06-2, P0-2). ── */}
      <HomeAiBriefingCard
        userName={user.name || user.email?.split('@')[0]}
        dailyLearned={dailyLearned}
        dailyMax={dailyMax}
        showDailyWords={hocTiengAnh}
        comeback={comeback}
      />

      {/* ── "Hôm nay": ĐÚNG MỘT việc học tiếp, mọi môn, không mặc định tiếng Anh (S06-2). ── */}
      <TodayCard plan={todayPlan} state={todayState} onRetry={todayRetry} />

      {/* ── Universal AI Ask & Voice Bar (Hỏi nhanh đa năng mọi bộ môn & lĩnh vực) ── */}
      <HomeUniversalAiBar />
    </div>
  )

  // [P0-1] ĐÚNG MỘT banner phụ cho trang chủ (thay vì hiện cả mẹo thưởng lẫn khuyến mãi giá
  // cùng lúc như trước) — luật ưu tiên thuần ở `pickHomeBanner` (test bảng riêng). `planExpiry`/
  // `promoEnding` đã có bản TOÀN CỤC ở App.tsx (`PlanExpiryBanner`/`PromoEndingBanner`, hiện ở
  // mọi trang kể cả trang chủ) — khi luật chọn 1 trong 2 kind đó, trang chủ NHƯỜNG chỗ, không vẽ
  // thêm bản riêng đè lên; chỉ `pricePromo`/`rewardTip` mới có bản "của trang chủ" (2 banner này
  // vốn chỉ hiện ở Home/Profile, không có bản toàn cục).
  const isGuestUser = user.isGuest === true
  const planExpiresInDays =
    !isGuestUser && user.plan !== 'free' && user.planExpiresAt
      ? daysUntilPlanExpires(user.planExpiresAt, new Date())
      : null
  const { promoUntil } = getAppSettings()
  const promoEndsInDays = promoUntil ? daysUntilPromoEnds(promoUntil, new Date()) : null
  const hasRewardTip = !isGuestUser && !!uid && shouldShowRewardTip(uid)
  const homeBanner = pickHomeBanner({
    isGuest: isGuestUser,
    planExpiresInDays,
    promoEndsInDays,
    hasRewardTip,
  })
  const homeBannerNode =
    homeBanner?.kind === 'pricePromo' ? (
      <div data-home-banner data-home-banner-kind="pricePromo">
        <PricePromoBanner isA={vi} />
      </div>
    ) : homeBanner?.kind === 'rewardTip' ? (
      <div data-home-banner data-home-banner-kind="rewardTip">
        <RewardTipBanner uid={uid} isA={vi} />
      </div>
    ) : null

  // ── CÁC BỘ MÔN & KHÔNG GIAN ──
  // [P1-8] Phần MÔN HỌC (icon/mô tả/lối tắt/sắp môn đang học lên đầu/trạng thái bằng chữ) tách
  // sang `SubjectSpaceList` (components/Home/SubjectSpaceList.tsx) — thuần hơn để test, dùng
  // chung `orderSubjects` (lib/home/orderSubjects.ts). Thẻ Sự nghiệp/Khởi nghiệp & Đời sống GIỮ
  // NGUYÊN tại đây (không phải môn học, không tới từ `SUBJECT_ENTRIES`, không tham gia sắp xếp).
  const careerLifeSpace = {
    id: 'career-life',
    title: 'Sự nghiệp, Khởi nghiệp & Đời sống',
    desc: 'Phỏng vấn thử, quản lý công việc, Lean Canvas, bánh xe cuộc đời.',
    go: () => nav('/su-nghiep-khoi-nghiep'),
    shortcuts: [
      { label: 'Phỏng vấn thử', go: () => nav('/career/interview') },
      { label: 'Công việc', go: () => nav('/cong-viec-cuoc-song?muc=cong-viec') },
      { label: 'Lean Canvas', go: () => nav('/startup/canvas') },
      { label: 'Đời sống', go: () => nav('/cong-viec-cuoc-song?muc=doi-song') },
    ],
  }

  const spacesSection = (
    <section aria-labelledby="home-spaces-heading" className="pt-2">
      {/* Khoảng TRÊN tiêu đề (pt-2 + mt của section) lớn hơn khoảng dưới (mb-2) — luật 2 mục 9. */}
      <h2 id="home-spaces-heading" className="text-base font-bold text-white mb-2 px-1">
        Bộ môn & không gian
      </h2>
      <SubjectSpaceList plan={todayPlan} isDesktop={isDesktop} />
      <ul className="mt-3 divide-y divide-zinc-800 rounded-3xl border border-zinc-800 bg-zinc-900/90">
        <li className="p-4">
          <button
            onClick={careerLifeSpace.go}
            className="w-full flex items-start gap-3.5 text-left group"
            aria-label={`Vào không gian ${careerLifeSpace.title}`}
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-purple-500/15 text-purple-400 theme-light:text-purple-800">
              <Briefcase className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-base flex items-center gap-1.5">
                <span>{careerLifeSpace.title}</span>
                <ChevronRight
                  className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mt-0.5 read-measure">
                {careerLifeSpace.desc}
              </p>
            </div>
          </button>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 pl-[3.625rem]">
            {careerLifeSpace.shortcuts.map((sc) => (
              <button
                key={sc.label}
                onClick={sc.go}
                className="tap-44-y text-sm font-medium text-zinc-400 hover:text-white underline-offset-4 hover:underline transition"
              >
                {sc.label}
              </button>
            ))}
          </div>
        </li>
      </ul>
    </section>
  )

  // ── TIẾN ĐỘ & LỊCH SỬ HỌC ──
  // Desktop: nằm ở cột ngữ cảnh hẹp (w-72) nên xếp 1 cột cho dễ đọc; mobile giữ 2 cột như cũ.
  // [2026-09-02, đợt 2] Bỏ `lg:grid-cols-1`: trong cột phải desktop, một cột làm hai nút này
  // giãn hết bề ngang mà chỉ chứa một icon + một chữ, nên đọc như hai THẺ RỖNG chiếm chỗ lớn
  // (thấy rõ khi chụp màn hình 1440px). Giữ hai cột ở mọi bề rộng thì chúng trở lại đúng vai
  // trò: một cặp nút điều hướng gọn.
  const progressHistory = (
    <div className="grid grid-cols-2 gap-3 pt-1">
      {/* GIỮ transition-all: đổi cả màu viền/nền (hover) LẪN transform (active:scale). */}
      <button
        onClick={() => nav('/tien-do')}
        aria-label="Xem bảng tiến độ"
        className="bg-zinc-900/70 border border-zinc-800/80 hover:border-accent-500/40 rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-200 group hover:bg-zinc-800/60 active:scale-98 animate-fade-in shadow-sm"
      >
        <div className="w-9 h-9 rounded-xl bg-accent-500/10 border border-accent-500/20 group-hover:bg-accent-500/20 flex items-center justify-center shrink-0 transition">
          <TrendingUp className="w-4 h-4 text-accent-400" />
        </div>
        <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition flex-1 text-left">
          {vi ? 'Tiến độ' : 'Progress'}
        </span>
      </button>

      {/* GIỮ transition-all: đổi cả màu viền/nền (hover) LẪN transform (active:scale). */}
      <button
        onClick={() => nav('/lich-su-hoc')}
        aria-label="Xem lịch sử học"
        className="bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-200 group hover:bg-zinc-800/60 active:scale-98 animate-fade-in shadow-sm"
      >
        <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 group-hover:bg-zinc-700 flex items-center justify-center shrink-0 transition">
          <History className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
        </div>
        <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition flex-1 text-left">
          {vi ? 'Lịch sử' : 'History'}
        </span>
      </button>
    </div>
  )

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <Layout title={T.greeting} back={false} />

      {/* [2026-09-02, đợt 2] Cột trái = luồng thao tác chính (AI, hành động nhanh, không gian bộ
          môn); cột phải = ngữ cảnh phụ (tiến độ/lịch sử, ĐÚNG MỘT banner phụ). Bố cục này trước
          đây viết tay tại chỗ — nay dùng chung `PageShell` + `TwoPane`. Ở mobile thứ tự nội dung
          khác (ngữ cảnh phụ xen vào luồng chính) nên vẫn giữ nhánh riêng.
          [P0-1] Mọi banner phụ (progress/lịch sử KHÔNG tính) nay đứng SAU khối "Bộ môn & không
          gian" — trước đây mẹo thưởng đứng ngay dưới "Hôm nay", cạnh tranh sự chú ý với CTA
          chính (xem docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md §P0-1). */}
      <PageShell width="standard" baseWidth="max-w-3xl">
        <TwoPane
          isDesktop={isDesktop}
          railLabel="Gợi ý và tiến độ"
          rail={
            <div className="space-y-5">
              {progressHistory}
              {homeBannerNode}
            </div>
          }
        >
          <div className="space-y-5">
            <h1 className="sr-only">{T.greeting}</h1>
            {topBlocks}
            {spacesSection}
            {!isDesktop && progressHistory}
            {!isDesktop && homeBannerNode}
          </div>
        </TwoPane>
      </PageShell>
    </div>
  )
}
