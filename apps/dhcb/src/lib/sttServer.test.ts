// Test cho vỏ bọc ghi âm `sttServer.ts` — trước 2026-09-15 file này KHÔNG có test nào.
//
// Bất biến cốt lõi được canh ở đây (AC-5, đặc tả
// `docs/specs/2026-09-15-learning-ux-s10-tro-giang-trong-bai-voice.md` §2.1 lỗi L5):
// **micro LUÔN được nhả**. `getUserMedia` mở micro xong mà `new MediaRecorder(...)` ném
// (mime không hỗ trợ, thiết bị bận) thì các track của stream không bao giờ được `.stop()`
// → đèn ghi âm của trình duyệt sáng vô hạn cho tới khi người dùng tự đóng tab.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@core/authHeader', () => ({
  getAuthHeader: vi.fn(async () => ({ Authorization: 'Bearer test-token' })),
}))

import { startRecording, isRecordingSupported } from './sttServer'

// ── Đồ giả cho thiết bị ghi âm ──────────────────────────────────────────────────────────────
class FakeTrack {
  stopCalls = 0
  stop() {
    this.stopCalls++
  }
}

let tracks: FakeTrack[] = []

class FakeStream {
  getTracks(): FakeTrack[] {
    return tracks
  }
}

/** Cấu hình cho `MediaRecorder` giả của từng test. */
const recorderConfig = {
  /** Cho constructor ném lỗi (mô phỏng mime không hỗ trợ / thiết bị bận). */
  throwOnConstruct: false,
  /** Dữ liệu audio "thu được" khi dừng — mảng rỗng = không thu được byte nào. */
  chunkSizes: [] as number[],
}

/** Đếm số lần `MediaRecorder.stop()` được gọi trong test hiện tại. */
let soLanRecorderStop = 0

class FakeRecorder {
  ondataavailable: ((e: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null

  static isTypeSupported(mime: string): boolean {
    return mime === 'audio/webm;codecs=opus'
  }

  constructor() {
    if (recorderConfig.throwOnConstruct) {
      throw new Error('NotSupportedError: mimeType không được hỗ trợ')
    }
  }

  start() {}

  stop() {
    soLanRecorderStop++
    // Trình duyệt bắn dataavailable rồi onstop ở tick sau — giữ đúng thứ tự đó.
    setTimeout(() => {
      for (const size of recorderConfig.chunkSizes) {
        this.ondataavailable?.({ data: new Blob([new Uint8Array(size)]) })
      }
      this.onstop?.()
    }, 0)
  }
}

beforeEach(() => {
  tracks = [new FakeTrack(), new FakeTrack()]
  recorderConfig.throwOnConstruct = false
  recorderConfig.chunkSizes = [8]
  soLanRecorderStop = 0
  vi.stubGlobal('MediaRecorder', FakeRecorder)
  vi.stubGlobal('navigator', {
    mediaDevices: { getUserMedia: vi.fn(async () => new FakeStream()) },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const tongSoLanStop = () => tracks.reduce((sum, t) => sum + t.stopCalls, 0)

describe('isRecordingSupported', () => {
  it('có getUserMedia + MediaRecorder → true', () => {
    expect(isRecordingSupported()).toBe(true)
  })
})

describe('AC-5 — micro luôn được nhả', () => {
  it('`new MediaRecorder(...)` NÉM → mọi track được stop đúng 1 lần rồi lỗi mới ném ra ngoài', async () => {
    recorderConfig.throwOnConstruct = true

    await expect(startRecording('vi')).rejects.toThrow(/mimeType/)

    expect(tracks).toHaveLength(2)
    for (const t of tracks) expect(t.stopCalls).toBe(1)
  })

  it('cancel() → dừng recorder và nhả hết track, không gọi /api/stt', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const rec = await startRecording('vi')
    expect(tongSoLanStop()).toBe(0) // đang ghi — micro còn mở, đúng

    rec.cancel()

    expect(soLanRecorderStop).toBe(1)
    for (const t of tracks) expect(t.stopCalls).toBe(1)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('stop() nhưng không thu được byte nào → EMPTY_RECORDING và track đã được nhả', async () => {
    recorderConfig.chunkSizes = []
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const rec = await startRecording('vi')
    await expect(rec.stop()).rejects.toThrow('EMPTY_RECORDING')

    for (const t of tracks) expect(t.stopCalls).toBe(1)
    // Chưa hề gọi API → nơi gọi không được tính 1 lượt STT (luật đếm lượt ở Speaking.tsx).
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('stop() bình thường → gọi /api/stt đúng 1 lần, có signal, và track đã được nhả', async () => {
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify({ text: '  xin chào  ' }), { status: 200 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const rec = await startRecording('vi')
    await expect(rec.stop()).resolves.toBe('xin chào')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/stt')
    expect(init.signal).toBeInstanceOf(AbortSignal)
    for (const t of tracks) expect(t.stopCalls).toBe(1)
  })
})
