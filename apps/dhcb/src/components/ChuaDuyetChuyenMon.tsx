// ChuaDuyetChuyenMon.tsx — Nói THẲNG với người học rằng bài học chưa có người chuyên môn đọc lại.
//
// Vì sao cần (audit 2026-09-14, `docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md` F1):
// cả 294 bài của 4 môn STEM đều mang `reviewStatus: 'draft'`, nhưng trước đợt này KHÔNG màn nào
// đọc trường đó — người học không hề biết. `docs/specs/2026-09-13-hoan-thien-4-mon-stem.md`
// mục 3.1 đã ghi nhận rủi ro "nội dung sai công thức/đơn vị đến thẳng người học" khi bỏ cổng
// duyệt; đây là phần còn thiếu của biện pháp giảm rủi ro đó.
import { AlertTriangle } from 'lucide-react'

/** Hộp cảnh báo đặt ngay đầu một bài học chưa duyệt. */
export function ChuaDuyetChuyenMon() {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-300 theme-light:text-amber-900">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>
        <strong className="font-semibold">Bản nháp — chưa duyệt chuyên môn.</strong> Bài này do AI
        soạn và mới qua kiểm tự động (đáp án tự chấm đúng, công thức nhất quán), chưa có giáo viên
        đọc lại. Gặp chỗ nghi sai, hãy đối chiếu sách giáo khoa trước khi tin.
      </p>
    </div>
  )
}

/** Dòng tóm tắt đặt đầu một DANH SÁCH bài — chỉ hiện khi còn bài chưa duyệt. */
export function TomTatChuaDuyet({ soChuaDuyet, tong }: { soChuaDuyet: number; tong: number }) {
  if (soChuaDuyet === 0) return null
  return (
    <p className="mt-4 flex items-start gap-2 text-sm text-amber-300 theme-light:text-amber-900">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        {soChuaDuyet === tong ? 'Toàn bộ' : `${soChuaDuyet}/${tong}`} bài ở đây là{' '}
        <strong className="font-semibold">bản nháp chưa duyệt chuyên môn</strong> — do AI soạn, mới
        qua kiểm tự động.
      </span>
    </p>
  )
}
