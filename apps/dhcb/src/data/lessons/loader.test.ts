// Loader bài hội thoại (S09c, spec §2.7 "khoảng cách source"): phải kiểm HTTP status, xác minh
// id TRƯỚC khi nhận `chunk[meta.idx]`, và cho thử lại sau lỗi (không cache lời hứa đã hỏng).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type LoaderModule = typeof import('./loader')

const META_1 = {
  id: 1,
  title: 'Giới thiệu bản thân',
  situation: 'Lan và Tom gặp nhau.',
  turnCount: 2,
  speakerAGender: 'female',
  speakerBGender: 'male',
  chunk: 0,
  idx: 0,
} as const

function lesson(id: number) {
  return {
    id,
    title: `Bài ${id}`,
    situation: 's',
    speakerAGender: 'female',
    speakerBGender: 'male',
    speakerAName: { vi: 'Lan', en: 'Lan' },
    speakerBName: { vi: 'Tom', en: 'Tom' },
    turns: [
      { speaker: 'A', en: 'Hi', vi: 'Chào' },
      { speaker: 'B', en: 'Hello', vi: 'Xin chào' },
    ],
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('data/lessons/loader', () => {
  const fetchMock = vi.fn<(input: string) => Promise<Response>>()
  let loader: LoaderModule

  beforeEach(async () => {
    vi.resetModules()
    fetchMock.mockReset()
    // Lời gọi loadIndex() lúc nạp module (tương thích INDEX cũ) — trả index hợp lệ.
    fetchMock.mockImplementation(async () => jsonResponse([META_1]))
    vi.stubGlobal('fetch', fetchMock)
    loader = await import('./loader')
  })

  afterEach(() => vi.unstubAllGlobals())

  it('loadIndex trả chỉ mục đã kiểm schema', async () => {
    await expect(loader.loadIndex()).resolves.toEqual([META_1])
  })

  it('HTTP lỗi ở index → ném LessonLoadError kind=http, lần sau thử lại được', async () => {
    vi.resetModules()
    fetchMock.mockReset()
    fetchMock.mockImplementation(async () => new Response('oops', { status: 503 }))
    loader = await import('./loader')
    await expect(loader.loadIndex()).rejects.toMatchObject({ kind: 'http', status: 503 })
    fetchMock.mockImplementation(async () => jsonResponse([META_1]))
    await expect(loader.loadIndex()).resolves.toEqual([META_1])
  })

  it('index sai hình dạng → kind=data (không nhận dữ liệu rác)', async () => {
    vi.resetModules()
    fetchMock.mockReset()
    fetchMock.mockImplementation(async () => jsonResponse([{ id: 'x' }]))
    loader = await import('./loader')
    await expect(loader.loadIndex()).rejects.toMatchObject({ kind: 'data' })
  })

  it('mất mạng → kind=network', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(loader.loadChunk(5)).rejects.toMatchObject({ kind: 'network' })
  })

  it('HTTP 404 ở chunk → kind=http, không cache; lần sau tải lại', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 404 }))
    await expect(loader.loadLesson(META_1)).rejects.toMatchObject({ kind: 'http', status: 404 })
    fetchMock.mockResolvedValueOnce(jsonResponse([lesson(1)]))
    await expect(loader.loadLesson(META_1)).resolves.toMatchObject({ id: 1 })
  })

  it('chunk[meta.idx] mang id KHÁC → không nhận, tìm đúng id trong chunk', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([lesson(9), lesson(1)]))
    await expect(loader.loadLesson(META_1)).resolves.toMatchObject({ id: 1 })
  })

  it('chunk không chứa bài → kind=data (không trả bài khác, không trả null lặng lẽ)', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([lesson(9)]))
    await expect(loader.loadLesson(META_1)).rejects.toMatchObject({ kind: 'data' })
  })

  it('chunk cũ trong cache thiếu bài → bỏ cache; Thử lại tải chunk mới từ mạng', async () => {
    // Deploy nửa chừng: chunk cũ (chưa có bài 1 ở đúng chỗ) nằm trong cache.
    fetchMock.mockResolvedValueOnce(jsonResponse([lesson(9)]))
    await expect(loader.loadLesson(META_1)).rejects.toMatchObject({ kind: 'data' })
    fetchMock.mockResolvedValueOnce(jsonResponse([lesson(1)]))
    await expect(loader.loadLesson(META_1)).resolves.toMatchObject({ id: 1 })
  })

  it('bài trong chunk sai schema → kind=data', async () => {
    const hong = { ...lesson(1), turns: [{ speaker: 'C', en: 1 }] }
    fetchMock.mockResolvedValueOnce(jsonResponse([hong]))
    await expect(loader.loadLesson(META_1)).rejects.toMatchObject({ kind: 'data' })
  })

  it('chunk không phải mảng → kind=data', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }))
    await expect(loader.loadChunk(8)).rejects.toMatchObject({ kind: 'data' })
  })

  it('chunk đã tải được cache, không gọi mạng lần hai', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([lesson(1)]))
    await loader.loadChunk(0)
    const n = fetchMock.mock.calls.length
    await loader.loadLesson(META_1)
    expect(fetchMock.mock.calls.length).toBe(n)
  })

  it('JSON hỏng → kind=data', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{not json', { status: 200 }))
    await expect(loader.loadChunk(7)).rejects.toMatchObject({ kind: 'data' })
  })
})
