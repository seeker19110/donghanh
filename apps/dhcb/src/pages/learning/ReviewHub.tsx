// ReviewHub — MỘT chỗ duy nhất trả lời "hôm nay tôi cần ôn gì trên MỌI môn" (S12-1, route
// `/goc-hoc-tap/on-tap`).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md AC-5.
//
// BA điều trang này CỐ Ý KHÔNG làm:
//  1. Không viết lại màn ôn nào — mỗi nhóm chỉ DẪN tới giao diện ôn đã có của môn, kèm cap phiên.
//  2. Không ghi gì vào kho SRS: hàng đợi dựng bằng hàm thuần `buildReviewQueue` trên bản chụp
//     CHỈ ĐỌC của kho.
//  3. Không gọi AI, không sinh thẻ mới. Hàng đợi rỗng là tin TỐT, nói thẳng như vậy.
//
// Vì sao không nạp từ điển: số từ vựng đến hạn đọc thẳng từ kho SRS (khoá không mang tiền tố
// namespace nào), nên hub không kéo theo cả từ điển (~nặng) chỉ để đếm — đúng cảnh báo §8 của
// đặc tả.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { Brain, ArrowRight, Sparkles } from 'lucide-react'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import { PageShell } from '@core/PageShell'
import { usePageTitle } from '../../lib/usePageTitle'
import { useAuth } from '../../context/useAuth'
import { getSrsSnapshot } from '../../lib/srs'
import { getDueProgCards } from '../../lib/programmingSrs'
import { getDueStemCards } from '../../lib/stemSrs'
import { getDueMistakes } from '../../lib/mistakes'
import { buildReviewQueue, docCapTuQuery, nhanMon, type ReviewSources } from '../../lib/reviewQueue'
import type { ReviewQueue } from '@dhcb/core-contracts/reviewItem'

/** Mã cấp CEFR — mã bài ngữ pháp luôn mở đầu bằng cấp (`a1-be`), đó là manh mối rẻ nhất. */
const CAP_CEFR = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

/**
 * Cấp CEFR để dẫn tới tab "Ôn SRS" đúng trang cấp. Suy từ chính mã bài ngữ pháp đến hạn — hub
 * KHÔNG nạp giáo trình/từ điển chỉ để biết cấp. Không suy được thì trả `undefined` và mục môn
 * Anh dẫn về danh sách lộ trình để người học tự chọn (không đoán bừa một cấp).
 */
function capCefrTuBaiNguPhap(grammarIds: readonly string[]): string | undefined {
  for (const id of grammarIds) {
    const cap = id.slice(0, 2).toLowerCase()
    if (CAP_CEFR.includes(cap)) return cap
  }
  return undefined
}

/** Tiền tố của các namespace KHÔNG phải từ vựng — dùng để tách nhóm từ vựng khỏi kho chung. */
const NAMESPACE = ['grammar:', 'prog:', 'stem:']

/** Đọc thẳng kho SRS ra hai danh sách môn Anh đến hạn, không cần nạp từ điển. */
function nguonAnh(uid: string, now: number) {
  const kho = getSrsSnapshot(uid)
  const words: { word: string }[] = []
  const grammarIds: string[] = []
  for (const [key, card] of Object.entries(kho)) {
    if (card.due > now) continue
    if (key.startsWith('grammar:')) grammarIds.push(key.slice('grammar:'.length))
    else if (!NAMESPACE.some((t) => key.startsWith(t))) words.push({ word: key })
  }
  return { words, grammarIds, kho }
}

export default function ReviewHub() {
  usePageTitle('Ôn tập hôm nay · Đồng hành cùng bạn')
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const cap = useMemo(() => docCapTuQuery(searchParams), [searchParams])
  // Mốc "bây giờ" chốt MỘT LẦN lúc vào trang: hàng đợi tính lại giữa chừng thì số mục nhảy
  // dưới chân người học (và lint react-hooks/purity cấm gọi Date.now() khi render).
  const [now] = useState(() => Date.now())

  // Mọi nguồn đều đọc ĐỒNG BỘ từ thiết bị (localStorage) nên không cần trạng thái tải: hàng đợi
  // dựng ngay trong render. Nguồn `learning.evidence` (câu sai bài STEM) chưa có ở slice này —
  // khai 'unavailable' để giao diện nói rõ chứ không im lặng coi là 0 lỗi.
  const queue: ReviewQueue | null = useMemo(() => {
    if (!user) return null
    const { words, grammarIds, kho } = nguonAnh(user.id, now)
    const sources: ReviewSources = {
      uid: user.id,
      englishDueWords: words,
      englishDueGrammarIds: grammarIds,
      programmingDueCards: getDueProgCards(user.id),
      stemDueCards: getDueStemCards(user.id),
      englishMistakesDue: getDueMistakes(user.id, now),
      srsCards: kho,
      englishLevelId: capCefrTuBaiNguPhap(grammarIds),
      sourcesState: {
        'english.srs': 'ready',
        'programming.srs': 'ready',
        'stem.srs': 'ready',
        'english.mistakes': 'ready',
        'learning.evidence': 'unavailable',
      },
    }
    return buildReviewQueue(sources, { cap, now })
  }, [user, cap, now])

  // Nhóm theo MÔN và theo LOẠI (thẻ / lỗi đã mắc): hai loại đó ôn ở hai màn khác nhau, gộp
  // chung một dòng thì nút "Ôn ngay" chỉ dẫn đúng được một nửa. Số đếm là số mục CỦA PHIÊN NÀY
  // (sau khi cắt cap) — phần còn lại được nói riêng ở dòng tổng bên trên, để hai con số không
  // mâu thuẫn nhau.
  const nhom = useMemo(() => {
    if (!queue) return []
    const theoNhom = new Map<string, { khoa: string; nhan: string; soMuc: number; href: string }>()
    for (const it of queue.items) {
      const laLoi = it.kind === 'mistake'
      const khoa = `${it.subjectId}|${laLoi ? 'mistake' : 'card'}`
      const cu = theoNhom.get(khoa)
      if (cu) {
        cu.soMuc += 1
        continue
      }
      theoNhom.set(khoa, {
        khoa,
        nhan: laLoi ? `${nhanMon(it.subjectId)} · lỗi đã mắc` : nhanMon(it.subjectId),
        soMuc: 1,
        href: it.href,
      })
    }
    return [...theoNhom.values()].sort((a, b) => b.soMuc - a.soMuc)
  }, [queue])

  const conLai = queue ? Math.max(0, queue.totalDue - queue.items.length) : 0

  return (
    <>
      <Layout />
      <PageShell width="standard" baseWidth="max-w-2xl" className="space-y-5">
        <PageHeader
          title="Ôn tập hôm nay"
          subtitle="Mọi thứ đến hạn ôn trên tất cả các môn, gộp vào một chỗ. Bấm vào một môn để ôn ngay trong màn quen thuộc của môn đó."
        />

        {queue && queue.totalDue === 0 && (
          <div
            className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-3"
            role="status"
          >
            <p className="flex items-center gap-2 text-sm font-bold text-content">
              <Sparkles
                className="w-5 h-5 text-emerald-400 theme-light:text-emerald-900"
                aria-hidden="true"
              />
              <span>Hôm nay không có gì đến hạn — quay lại ngày mai</span>
            </p>
            <p className="text-sm text-content-secondary leading-relaxed">
              Khoảng nghỉ chính là lúc trí nhớ được củng cố, nên không có gì để ôn là dấu hiệu tốt.
              Muốn học tiếp thì chọn một môn ở Góc học tập.
            </p>
            <Link
              to="/goc-hoc-tap"
              className="tap-44 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-500 hover:bg-accent-400 text-black font-semibold text-sm transition"
            >
              <span>Học tiếp</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        )}

        {queue && queue.totalDue > 0 && (
          <>
            <p className="text-sm text-content-secondary" aria-live="polite">
              {queue.items.length} mục trong phiên này (đã gộp mục trùng nhau)
              {conLai > 0 ? ` · còn ${conLai} mục sau phiên này` : ''}.
            </p>

            <ul className="space-y-3">
              {nhom.map((n) => (
                <li key={n.khoa}>
                  <Link
                    to={n.href}
                    className="tap-44 flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-accent-500/50 transition"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-content">{n.nhan}</span>
                      <span className="block text-sm text-content-secondary">
                        {n.soMuc} mục · tính trên thiết bị này
                      </span>
                    </span>
                    <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-400">
                      <Brain className="w-4 h-4" aria-hidden="true" />
                      <span>Ôn ngay</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-sm text-content-secondary leading-relaxed">
              Số ở đây tính từ dữ liệu trên thiết bị này. Ôn xong, kết quả được ghi đúng vào lịch ôn
              của từng môn như khi bạn ôn trong màn của môn đó.
            </p>
          </>
        )}
      </PageShell>
    </>
  )
}
