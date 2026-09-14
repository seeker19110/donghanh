// StemLessonList — danh sách bài học của một môn STEM (Toán · Lí · Hoá · Sinh).
//
// MỘT trang dùng cho cả bốn môn: bốn môn chung một khuôn bài học nên chung luôn màn liệt kê.
// Trang chỉ đọc CHỈ MỤC NHẸ (`loader.index`), không nạp nội dung bài nào — nội dung chỉ tải
// khi người học mở đúng bài (xem StemLessonView).
import { useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { GraduationCap, Trophy, Play } from 'lucide-react'
import Layout from '../../components/Layout'
import { PageShell } from '@core/PageShell'
import { buttonClass } from '@core/buttonStyles'
import { usePageTitle } from '../../lib/usePageTitle'
import { TomTatChuaDuyet } from '../../components/ChuaDuyetChuyenMon'
import {
  duongDanBaiHoc,
  getStemSubject,
  nhanCapHsg,
  type StemSubject,
} from '../../lib/stemLessonRoutes'

/** Nhóm bài theo chương để danh sách đọc được như mục lục sách, không phải một dãy phẳng. */
function nhomTheoChuong(
  bai: ReturnType<StemSubject['loader']['listCoreByGrade']>,
): Array<{ so: number; tieuDe: string; bai: typeof bai }> {
  const nhom = new Map<number, { so: number; tieuDe: string; bai: typeof bai }>()
  for (const b of bai) {
    let g = nhom.get(b.chapterNumber)
    if (!g) {
      g = { so: b.chapterNumber, tieuDe: b.chapterTitle, bai: [] }
      nhom.set(b.chapterNumber, g)
    }
    g.bai.push(b)
  }
  return [...nhom.values()]
}

export default function StemLessonList() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const subject = getStemSubject(subjectId)
  const [grade, setGrade] = useState<string>(subject?.grades[0] ?? '10')
  const [nhanh, setNhanh] = useState<'core' | 'advanced'>('core')

  usePageTitle(subject ? `Bài học môn ${subject.label}` : 'Bài học')

  const baiCoBan = useMemo(
    () => (subject ? subject.loader.listCoreByGrade(grade) : []),
    [subject, grade],
  )
  const baiNangCao = useMemo(() => (subject ? subject.loader.listAdvanced() : []), [subject])

  if (!subject) return <Navigate to="/mon-hoc" replace />

  const chuong = nhomTheoChuong(baiCoBan)
  const nhapCoBan = baiCoBan.filter((b) => b.reviewStatus === 'draft').length
  const nhapNangCao = baiNangCao.filter((b) => b.reviewStatus === 'draft').length

  return (
    <>
      <Layout />
      <PageShell width="standard">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-content">
          Bài học môn {subject.label}
        </h1>
        <p className="mt-2 text-content-secondary">
          {subject.loader.index.length} bài, gồm {baiNangCao.length} chuyên đề bồi dưỡng học sinh
          giỏi.
        </p>

        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Nhánh học">
          <button
            type="button"
            role="tab"
            aria-selected={nhanh === 'core'}
            onClick={() => setNhanh('core')}
            className={buttonClass({ variant: nhanh === 'core' ? 'primary' : 'ghost' })}
          >
            <GraduationCap className="inline h-4 w-4 mr-2" aria-hidden="true" />
            Chương trình chuẩn
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={nhanh === 'advanced'}
            onClick={() => setNhanh('advanced')}
            className={buttonClass({ variant: nhanh === 'advanced' ? 'primary' : 'ghost' })}
          >
            <Trophy className="inline h-4 w-4 mr-2" aria-hidden="true" />
            Bồi dưỡng học sinh giỏi
          </button>
        </div>

        {nhanh === 'core' ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Chọn lớp">
              {subject.grades.map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={grade === g}
                  onClick={() => setGrade(g)}
                  className={buttonClass({ variant: grade === g ? 'primary' : 'ghost' })}
                >
                  Lớp {g}
                </button>
              ))}
            </div>

            <TomTatChuaDuyet soChuaDuyet={nhapCoBan} tong={baiCoBan.length} />

            {chuong.length === 0 ? (
              <p className="mt-8 text-content-secondary">
                Lớp {grade} của môn {subject.label} chưa có bài học nào. Hãy chọn lớp khác.
              </p>
            ) : (
              <ol className="mt-6 space-y-8">
                {chuong.map((c) => (
                  <li key={c.so}>
                    <h2 className="text-lg font-bold text-content">
                      Chương {c.so}: {c.tieuDe}
                    </h2>
                    <ul className="mt-3 space-y-2">
                      {c.bai.map((b) => (
                        <li key={b.id}>
                          <Link
                            to={duongDanBaiHoc(subject.id, b.id, b.title)}
                            className="flex min-h-[44px] items-center justify-between gap-3 rounded-xl border border-line-subtle bg-surface-card px-4 py-3 text-content"
                          >
                            <span>
                              Bài {b.lessonNumber}. {b.title}
                            </span>
                            {b.hasAnimation && (
                              <span className="shrink-0 text-content-muted">
                                <Play className="h-4 w-4" aria-hidden="true" />
                                <span className="sr-only">Bài này có hoạt ảnh minh hoạ</span>
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            )}
          </>
        ) : baiNangCao.length === 0 ? (
          <p className="mt-8 text-content-secondary">
            Môn {subject.label} chưa có chuyên đề bồi dưỡng học sinh giỏi.
          </p>
        ) : (
          <>
            <TomTatChuaDuyet soChuaDuyet={nhapNangCao} tong={baiNangCao.length} />
            <ul className="mt-6 space-y-2">
              {baiNangCao.map((b) => (
                <li key={b.id}>
                  <Link
                    to={duongDanBaiHoc(subject.id, b.id, b.title)}
                    className="flex min-h-[44px] flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-line-subtle bg-surface-card px-4 py-3 text-content"
                  >
                    <span className="rounded-lg border border-line-strong px-2 py-0.5 text-content-muted">
                      {nhanCapHsg(b.advancedTier)}
                    </span>
                    <span>{b.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </PageShell>
    </>
  )
}
