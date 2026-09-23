// Cổng của lớp tiến độ mục lục STEM (S11-3, AC-15/AC-16).
//
// Ba thứ đáng canh, và cả ba đều là "nói đúng sự thật về HỆ THỐNG":
//   · đang chờ thì phải là `loading` (= "chưa đo được"), không được vội nói "chưa học";
//   · đổi tài khoản/đổi môn thì kết quả cũ hết hiệu lực NGAY, không rò sang chủ mới;
//   · server hỏng thì `error` để mục lục mời "Thử lại", không im lặng hiện số cũ.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { CompletionState } from '@dhcb/core-contracts/completionEvidence'
import type { StemSubjectId } from '@dhcb/core-contracts/stemLesson'
import { useStemCompletionState, type StemCompletionCtx } from './useStemCompletionState'
import { AuthContext } from '../context/authContext'
import type { User } from '../types'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const goi = vi.hoisted(() => vi.fn())
vi.mock('./stemEvidence', () => ({ fetchCompletionState: goi }))

const NGUOI: User = { id: 'u-1', email: 'a@b.c', name: 'A', plan: 'free', onboarded: true }

function bangGhi(contentId: string): CompletionState {
  return {
    subjectId: 'physics',
    contentId,
    status: 'completed',
    bestRatio: 1,
    lastRatio: 1,
    attempts: 1,
    completedAt: '2026-09-16T00:00:00.000Z',
    updatedAt: '2026-09-16T00:00:00.000Z',
    source: 'server',
  }
}

describe('useStemCompletionState', () => {
  let container: HTMLDivElement
  let root: Root
  let thay: StemCompletionCtx

  function Do({ subjectId }: { subjectId: StemSubjectId | undefined }) {
    thay = useStemCompletionState(subjectId)
    return null
  }

  async function hien(user: User | null, subjectId: StemSubjectId | undefined, loading = false) {
    await act(async () => {
      root.render(
        <AuthContext.Provider
          value={{
            user,
            loading,
            isGuest: false,
            refresh: async () => {},
            refreshVerified: async () => {
              throw new Error('Không dùng trong fixture này')
            },
          }}
        >
          <Do subjectId={subjectId} />
        </AuthContext.Provider>,
      )
    })
  }

  beforeEach(() => {
    goi.mockReset()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('đọc một lần khi mở và trả trạng thái theo mã bài', async () => {
    goi.mockResolvedValue({
      status: 'ready',
      state: new Map([['ly10-c2-b10', bangGhi('ly10-c2-b10')]]),
    })
    await hien(NGUOI, 'physics')
    expect(goi).toHaveBeenCalledTimes(1)
    expect(goi).toHaveBeenCalledWith('u-1', 'physics')
    expect(thay.stateStatus).toBe('ready')
    expect(thay.state.get('ly10-c2-b10')?.status).toBe('completed')
  })

  it('AuthProvider chưa xong → "đang tải", tuyệt đối chưa nói "chưa học"', async () => {
    await hien(null, 'physics', true)
    expect(thay.stateStatus).toBe('loading')
    expect(goi).not.toHaveBeenCalled()
  })

  it('chưa đăng nhập → ready rỗng (không có bằng chứng, nhưng cũng không phải lỗi)', async () => {
    await hien(null, 'physics')
    expect(thay.stateStatus).toBe('ready')
    expect(thay.state.size).toBe(0)
    expect(goi).not.toHaveBeenCalled()
  })

  it('mã môn lạ → không gọi server', async () => {
    await hien(NGUOI, undefined)
    expect(goi).not.toHaveBeenCalled()
    expect(thay.stateStatus).toBe('ready')
  })

  it('server hỏng → "error" để mục lục mời thử lại, và reload gọi lại đúng một lượt', async () => {
    goi.mockResolvedValue({ status: 'error', state: new Map() })
    await hien(NGUOI, 'physics')
    expect(thay.stateStatus).toBe('error')

    goi.mockResolvedValue({ status: 'ready', state: new Map([['x', bangGhi('x')]]) })
    await act(async () => thay.reload())
    expect(goi).toHaveBeenCalledTimes(2)
    expect(thay.stateStatus).toBe('ready')
  })

  it('đổi tài khoản: kết quả của người trước KHÔNG rò sang người sau', async () => {
    goi.mockResolvedValue({
      status: 'ready',
      state: new Map([['ly10-c2-b10', bangGhi('ly10-c2-b10')]]),
    })
    await hien(NGUOI, 'physics')
    expect(thay.state.size).toBe(1)

    // Người mới: kết quả cũ hết hiệu lực NGAY trong lúc render, trước cả khi request về.
    let goInRa: (v: unknown) => void = () => {}
    goi.mockReturnValue(new Promise((r) => (goInRa = r)))
    await hien({ ...NGUOI, id: 'u-2' }, 'physics')
    expect(thay.stateStatus).toBe('loading')
    expect(thay.state.size).toBe(0)

    await act(async () => {
      goInRa({ status: 'ready', state: new Map() })
    })
    expect(thay.stateStatus).toBe('ready')
  })

  it('giữ nguyên tham chiếu khi không có gì đổi (để useMemo dựng cây còn tác dụng)', async () => {
    goi.mockResolvedValue({ status: 'ready', state: new Map() })
    await hien(NGUOI, 'physics')
    const truoc = thay
    // Render lại với ĐÚNG cùng đầu vào: không có gì đổi thì kết quả phải là CHÍNH nó.
    await hien(NGUOI, 'physics')
    expect(thay).toBe(truoc)
    expect(goi).toHaveBeenCalledTimes(1)
  })

  it('đổi môn: đọc lại cho môn mới, không dùng lại bản của môn cũ', async () => {
    goi.mockResolvedValue({
      status: 'ready',
      state: new Map([['ly10-c2-b10', bangGhi('ly10-c2-b10')]]),
    })
    await hien(NGUOI, 'physics')
    goi.mockResolvedValue({ status: 'ready', state: new Map() })
    await hien(NGUOI, 'chemistry')
    expect(goi).toHaveBeenLastCalledWith('u-1', 'chemistry')
    expect(thay.state.size).toBe(0)
  })
})
