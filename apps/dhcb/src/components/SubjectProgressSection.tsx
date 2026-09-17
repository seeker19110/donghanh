// SubjectProgressSection — khối "Tiến độ theo môn" của trang `/tien-do`.
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md AC-14 (S12-3).
//
// LUẬT SỐ 1 CỦA SẢN PHẨM (CLAUDE.md §2): khối này KHÔNG được chứa điểm chẩn đoán. Không
// `placement`, không band IELTS ước lượng, không `masterySummary`, không "số năng lực". Nó chỉ
// nói ra một việc duy nhất: trong phạm vi đang học, bao nhiêu mục đã có BẰNG CHỨNG hoàn thành —
// và khi chưa có bằng chứng nào thì nói thẳng "chưa đo được" bằng CHỮ, chứ không in "0%".
//
// Tách khỏi `Dashboard.tsx` (803 dòng) có chủ đích: dữ liệu ở đây đến từ sáu môn qua `import()`
// động, có bốn trạng thái riêng (tải · lỗi · rỗng · có dữ liệu), và phải test được mà không
// phải dựng cả trang tiến độ tiếng Anh.
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layers } from 'lucide-react'
import LoadError from './LoadError'
import { nhanNguonBangChung, rutGonPhamVi } from '../lib/progressSummary'
import { buildSubjectProgressBoard, type SubjectProgressCard } from '../lib/subjectProgressBoard'
import type { LockPlan } from '@dhcb/subject-programming/levelLock'

export interface SubjectProgressSectionProps {
  uid: string
  plan: LockPlan
  /** Chỉ để test tiêm dữ liệu sẵn; sản phẩm luôn dùng bản thật. */
  loader?: (uid: string, plan: LockPlan) => Promise<readonly SubjectProgressCard[]>
}

type TrangThai = 'loading' | 'ready' | 'error'

export default function SubjectProgressSection({
  uid,
  plan,
  loader = buildSubjectProgressBoard,
}: SubjectProgressSectionProps) {
  // Giữ CẢ khoá của lần tải sinh ra kết quả. Nhờ vậy "đang tải" là thứ SUY RA (khoá hiện tại
  // khác khoá của dữ liệu đang cầm) chứ không phải một `setState('loading')` gọi thẳng trong
  // effect — khuôn đã dùng ở `useProgrammingOutlineCtx`/`useStemCompletionState`.
  const [ketQua, setKetQua] = useState<{
    khoa: string
    cards: readonly SubjectProgressCard[]
    status: 'ready' | 'error'
  } | null>(null)
  const [lan, setLan] = useState(0)

  const khoa = `${uid}#${plan}#${lan}`

  useEffect(() => {
    if (!uid) return
    let con = true
    loader(uid, plan)
      .then((ds) => {
        if (con) setKetQua({ khoa: `${uid}#${plan}#${lan}`, cards: ds, status: 'ready' })
      })
      .catch(() => {
        // Hỏng cả khối (không phải một môn) — nói thật, đừng hiện khối rỗng giả vờ là "chưa học".
        if (con) setKetQua({ khoa: `${uid}#${plan}#${lan}`, cards: [], status: 'error' })
      })
    return () => {
      con = false
    }
  }, [uid, plan, lan, loader])

  const thuLai = useCallback(() => setLan((n) => n + 1), [])

  const daVe = ketQua?.khoa === khoa
  const cards = daVe ? ketQua.cards : []
  const trangThai: TrangThai = daVe ? ketQua.status : 'loading'

  return <SubjectProgressView cards={cards} trangThai={trangThai} onRetry={thuLai} />
}

export interface SubjectProgressViewProps {
  cards: readonly SubjectProgressCard[]
  trangThai: TrangThai
  onRetry: () => void
}

/**
 * Phần THUẦN TRÌNH BÀY — tách khỏi phần lấy dữ liệu để test render được bằng
 * `renderToStaticMarkup` (dự án không dùng testing-library) mà vẫn canh đủ bốn trạng thái và
 * canh được bất biến "không có điểm chẩn đoán".
 */
export function SubjectProgressView({ cards, trangThai, onRetry }: SubjectProgressViewProps) {
  return (
    <section className="animate-fade-in" aria-labelledby="tien-do-theo-mon">
      <h2
        id="tien-do-theo-mon"
        className="mb-3 flex items-center gap-2 text-sm font-semibold text-content"
      >
        <Layers className="h-4 w-4 text-accent-400" aria-hidden="true" />
        Tiến độ theo môn
      </h2>

      {trangThai === 'loading' && (
        <p role="status" className="t-caption text-content-secondary">
          Đang tính tiến độ từng môn…
        </p>
      )}

      {trangThai === 'error' && (
        <LoadError
          message="Chưa tính được tiến độ theo môn."
          hint="Tiến độ đã học của bạn vẫn còn nguyên — đây chỉ là lỗi tải dữ liệu môn."
          onRetry={onRetry}
        />
      )}

      {trangThai === 'ready' && cards.length === 0 && (
        <p className="t-caption text-content-secondary">
          Chưa có môn nào tải được nội dung để đếm tiến độ.
        </p>
      )}

      {trangThai === 'ready' && cards.length > 0 && (
        <>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cards.map((card) => (
              <li key={card.subjectId}>
                <TheTienDo card={card} />
              </li>
            ))}
          </ul>
          <p className="t-caption mt-3 text-content-secondary read-measure">
            Số ở đây chỉ đếm những mục đã có bằng chứng hoàn thành. Mục chưa có bằng chứng được ghi
            là “chưa đo được”, không tính thành 0.
          </p>
        </>
      )}
    </section>
  )
}

/** Một thẻ môn. `measured:false` → CHỮ "chưa đo được"; tuyệt đối không quy `unknown` về 0. */
function TheTienDo({ card }: { card: SubjectProgressCard }) {
  const { summary } = card
  const nguon = nhanNguonBangChung(summary.evidenceSources)

  return (
    <Link
      to={card.href}
      className="tap-44 block rounded-2xl border border-line-subtle bg-surface-card p-4 transition hover:border-line-strong"
    >
      <p className="text-sm font-semibold text-content">{card.subjectLabel}</p>
      <p className="t-caption mt-0.5 text-content-secondary">
        {rutGonPhamVi(card.subjectLabel, summary.scopeTitle)}
      </p>

      {summary.measured ? (
        <>
          <p className="mt-2 text-2xl font-extrabold leading-none text-content">
            {summary.completed}
            <span className="text-base font-semibold text-content-secondary">/{summary.total}</span>
          </p>
          <p className="t-caption mt-1 text-content-secondary">
            mục đã xong{nguon ? ` · ${nguon}` : ''}
            {summary.inProgress > 0 ? ` · ${summary.inProgress} đang học dở` : ''}
          </p>
        </>
      ) : (
        <p className="t-caption mt-2 text-content-secondary">
          Chưa đo được — môn này chưa có bằng chứng hoàn thành nào trên thiết bị/tài khoản hiện tại.
        </p>
      )}
    </Link>
  )
}
