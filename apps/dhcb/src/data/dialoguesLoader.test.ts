import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const data = {
  unit: [{ titleVi: 'Chào', titleEn: 'Hello', lines: [{ who: 'A', en: 'Hi', vi: 'Chào' }] }],
}

describe('dialoguesLoader phục hồi lỗi', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('chia sẻ request và cache dữ liệu hợp lệ', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(data)))
    const { getDialogues, getAllDialogues } = await import('./dialoguesLoader')
    expect(await Promise.all([getDialogues('unit'), getAllDialogues()])).toEqual([data.unit, data])
    expect(await getDialogues('missing')).toEqual([])
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it.each(['network', 'http', 'json', 'schema'])(
    'không cache lỗi %s và cho phép thử lại',
    async (failure) => {
      const mock = vi.mocked(fetch)
      if (failure === 'network') mock.mockRejectedValueOnce(new Error('offline'))
      if (failure === 'http') mock.mockResolvedValueOnce(new Response('{}', { status: 503 }))
      if (failure === 'json') mock.mockResolvedValueOnce(new Response('invalid JSON'))
      if (failure === 'schema') mock.mockResolvedValueOnce(new Response('{"unit":[{"lines":42}]}'))
      mock.mockResolvedValueOnce(new Response(JSON.stringify(data)))
      const { getDialogues } = await import('./dialoguesLoader')
      await expect(getDialogues('unit')).rejects.toThrow()
      await expect(getDialogues('unit')).resolves.toEqual(data.unit)
      expect(fetch).toHaveBeenCalledTimes(2)
    },
  )

  it('hủy request quá hạn rồi tải lại được', async () => {
    vi.useFakeTimers()
    vi.mocked(fetch)
      .mockImplementationOnce(
        (_url, init) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => reject(new Error('timeout')), {
              once: true,
            })
          }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify(data)))
    const { getDialogues, DIALOGUES_TIMEOUT_MS } = await import('./dialoguesLoader')
    const rejected = expect(getDialogues('unit')).rejects.toThrow('timeout')
    await vi.advanceTimersByTimeAsync(DIALOGUES_TIMEOUT_MS)
    await rejected
    await expect(getDialogues('unit')).resolves.toEqual(data.unit)
  })
})
