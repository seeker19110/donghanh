import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function response(ok: boolean, data: unknown = []): Response {
  return { ok, json: async () => data } as Response
}

type CleanupCallback = (reason: unknown) => unknown

function capturePromiseCleanup(callbacks: CleanupCallback[]) {
  const originalCatch = Promise.prototype.catch
  return vi.spyOn(Promise.prototype, 'catch').mockImplementation(function <TResult = never>(
    this: Promise<unknown>,
    onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ) {
    if (onRejected) callbacks.push((reason) => onRejected(reason))
    return Reflect.apply(originalCatch, this, [() => undefined]) as Promise<unknown | TResult>
  })
}

describe('loadCefr — cache promise có thể phục hồi', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => vi.unstubAllGlobals())

  it('coalesce pending; rejection reset cache; retry tạo request mới', async () => {
    const cleanupCallbacks: CleanupCallback[] = []
    let catchSpy = capturePromiseCleanup(cleanupCallbacks)
    let rejectFirst: ((reason: Error) => void) | undefined
    try {
      vi.mocked(fetch).mockImplementation(
        () => new Promise<Response>((_resolve, reject) => (rejectFirst = reject)),
      )
      const { loadCefr } = await import('./cefrLoader')

      const oldAttemptStart = cleanupCallbacks.length
      const first = loadCefr()
      expect(loadCefr()).toBe(first)
      expect(fetch).toHaveBeenCalledTimes(1)
      rejectFirst?.(new Error('offline'))
      catchSpy.mockRestore()
      await expect(first).rejects.toThrow('offline')
      expect(loadCefr(), 'cleanup bị chặn nên cache cũ vẫn còn').toBe(first)
      const oldAttemptCallbacks = cleanupCallbacks.slice(oldAttemptStart)
      expect(oldAttemptCallbacks).toHaveLength(1)

      const oldCleanup = oldAttemptCallbacks[0]
      oldCleanup(new Error('old rejection'))
      let releaseRetry: ((value: Response) => void) | undefined
      vi.mocked(fetch).mockImplementation(
        () => new Promise<Response>((resolve) => (releaseRetry = resolve)),
      )
      catchSpy = capturePromiseCleanup(cleanupCallbacks)
      const retryAttemptStart = cleanupCallbacks.length
      const retried = loadCefr()
      catchSpy.mockRestore()
      expect(retried).not.toBe(first)
      expect(cleanupCallbacks.slice(retryAttemptStart)).toHaveLength(1)

      oldCleanup(new Error('late old cleanup'))
      expect(loadCefr(), 'cleanup cũ không được xóa promise retry đang pending').toBe(retried)
      expect(fetch).toHaveBeenCalledTimes(2)
      releaseRetry?.(response(true, []))
      await expect(retried).resolves.toEqual([])
    } finally {
      catchSpy.mockRestore()
    }
  })
})
