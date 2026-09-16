// useProgrammingOutlineCtx — gom ĐÚNG MỘT LẦN ba thứ mà adapter cây môn Lập trình cần:
// tiến độ bài, trạng thái tải tiến độ, và bản đồ khoá bậc.
//
// Ba trang (bài · bậc · khoá ngắn) đều phải có đủ bộ này. Chép tay ba lần là ba cơ hội để
// một trang quên `seedGrandfather` (chống hồi tố luật khoá) hoặc quên phân biệt "lỗi mạng"
// với "chưa học" — đúng loại lỗi mà spec S07 §3.4 gọi tên.
import { useEffect, useState } from 'react'
import { fetchProgressWithState, type ProgrammingLessonProgress } from './programmingProgress'
import { levelLockMap, seedGrandfather } from './programmingLevelLock'
import { effectivePlan } from './promo'
import { useAuth } from '../context/useAuth'
import type { ProgrammingOutlineCtx } from './outline/programmingOutline'

/**
 * @returns ngữ cảnh truyền thẳng vào `buildLevelOutline`/`buildCourseOutline`, kèm `reload`
 *   cho nút "Thử lại" khi tải tiến độ hỏng.
 */
export function useProgrammingOutlineCtx(): ProgrammingOutlineCtx & { reload: () => void } {
  const { user } = useAuth()
  // Giữ CẢ uid trong state để biết kết quả đang cầm là của TÀI KHOẢN NÀO — đổi tài khoản
  // (hoặc khách → đăng nhập) là kết quả cũ tự hết hiệu lực, không cần một effect để dọn.
  const [ketQua, setKetQua] = useState<{
    uid: string
    lessons: readonly ProgrammingLessonProgress[]
    state: 'ready' | 'error'
  } | null>(null)
  const [lan, setLan] = useState(0)

  useEffect(() => {
    if (!user) return
    let huy = false
    void fetchProgressWithState(user.id).then(({ lessons, state }) => {
      if (huy) return
      // Chống hồi tố: bậc đã từng vào được thì không bị luật khoá mới lấy lại (cùng luật với
      // ProgrammingLevelPage — xem lib/programmingLevelLock.ts).
      seedGrandfather(user.id, lessons)
      setKetQua({ uid: user.id, lessons, state })
    })
    return () => {
      huy = true
    }
  }, [user, lan])

  // Chưa đăng nhập: không có tiến độ để đo, nhưng cũng KHÔNG phải lỗi — cây hiện đủ bài, mọi
  // lá là "chưa học". `ready` với mảng rỗng nói đúng điều đó.
  // Đang đăng nhập mà kết quả chưa về (hoặc là của tài khoản trước): `loading` → mọi lá
  // "chưa đo được", KHÔNG phải "chưa học".
  const daVe = user !== null && user !== undefined && ketQua?.uid === user.id
  const progress: readonly ProgrammingLessonProgress[] = daVe ? ketQua.lessons : []
  const progressState: 'loading' | 'ready' | 'error' = !user
    ? 'ready'
    : daVe
      ? ketQua.state
      : 'loading'

  const plan = user ? effectivePlan(user.plan) : 'free'
  const lockMap = levelLockMap(user?.id, progress, plan)

  return { progress, progressState, lockMap, reload: () => setLan((n) => n + 1) }
}
