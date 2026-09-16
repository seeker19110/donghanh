// useStemCompletionState — lớp TIẾN ĐỘ của mục lục môn STEM: đọc `completion_state` một lần
// khi mở trang, và lại sau mỗi lượt nộp thành công (KHÔNG polling).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md §③.5, AC-15/AC-16.
//
// VÌ SAO LÀ HOOK RIÊNG: hai trang STEM (danh sách bài · trang bài) đều cần đúng bộ ba
// `state`/`stateStatus`/`reload`. Chép tay hai lần là hai cơ hội để một trang quên phân biệt
// "đang tải" với "chưa học" — đúng loại lỗi mà bất biến AC-16 cấm ("mở bài không bao giờ làm
// một bài thành đang-học-dở").
//
// Khuôn lấy từ `useProgrammingOutlineCtx`, kể cả mẹo GIỮ KHOÁ CHỦ SỞ HỮU trong state: kết quả
// đang cầm luôn biết nó là của tài khoản/môn nào, nên đổi tài khoản hay đổi môn là bản cũ tự
// hết hiệu lực mà không cần một effect để dọn.
import { useCallback, useEffect, useState } from 'react'
import type { CompletionState } from '@dhcb/core-contracts/completionEvidence'
import type { StemSubjectId } from '@dhcb/core-contracts/stemLesson'
import { fetchCompletionState } from './stemEvidence'
import { useAuth } from '../context/useAuth'
import type { StemTienDoCtx } from './outline/stemOutlineApp'

const RONG: ReadonlyMap<string, CompletionState> = new Map()

export type StemCompletionCtx = StemTienDoCtx & { reload: () => void }

/**
 * @param subjectId môn đang xem; `undefined` (mã môn lạ) → không gọi gì, `ready` rỗng.
 */
export function useStemCompletionState(subjectId: StemSubjectId | undefined): StemCompletionCtx {
  const { user, loading } = useAuth()
  const [ketQua, setKetQua] = useState<{
    khoa: string
    state: ReadonlyMap<string, CompletionState>
    status: 'ready' | 'error'
  } | null>(null)
  const [lan, setLan] = useState(0)

  const uid = user?.id
  // Khoá = CHỦ SỞ HỮU + MÔN. Đổi một trong hai là kết quả cũ hết hiệu lực ngay trong lúc render.
  const khoa = uid && subjectId ? `${uid}:${subjectId}` : ''

  useEffect(() => {
    if (!uid || !subjectId) return
    let huy = false
    void fetchCompletionState(uid, subjectId).then((r) => {
      if (!huy) setKetQua({ khoa: `${uid}:${subjectId}`, state: r.state, status: r.status })
    })
    return () => {
      huy = true
    }
  }, [uid, subjectId, lan])

  const daVe = khoa !== '' && ketQua?.khoa === khoa

  // Chưa đăng nhập (kể cả khách chưa có id): không có bằng chứng nào để đo, nhưng cũng KHÔNG
  // phải lỗi — `ready` với map rỗng nói đúng điều đó, và mọi bài hiện "Chưa học".
  // Đang chờ AuthProvider hoặc chờ kết quả: `loading` → "Chưa đo được", KHÔNG phải "Chưa học".
  const stateStatus: 'loading' | 'ready' | 'error' = loading
    ? 'loading'
    : !uid || !subjectId
      ? 'ready'
      : daVe
        ? ketQua.status
        : 'loading'

  return {
    state: daVe ? ketQua.state : RONG,
    stateStatus,
    reload: useCallback(() => setLan((n) => n + 1), []),
  }
}
