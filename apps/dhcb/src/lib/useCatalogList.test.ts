import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { fetchCatalog } from './useCatalogList'

const ItemSchema = z.object({ id: z.string() })

function mockFetch(response: Response | Error) {
  const fn = vi.fn(() =>
    response instanceof Error ? Promise.reject(response) : Promise.resolve(response),
  )
  vi.stubGlobal('fetch', fn)
  return fn
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

afterEach(() => vi.unstubAllGlobals())

describe('fetchCatalog', () => {
  it('trả về mảng đã kiểm khi hợp đồng đúng', async () => {
    mockFetch(json({ items: [{ id: 'a' }, { id: 'b' }] }))
    await expect(fetchCatalog('/api/x', 'items', ItemSchema)).resolves.toEqual([
      { id: 'a' },
      { id: 'b' },
    ])
  })

  it('mảng rỗng là "sẵn sàng nhưng chưa có gì", không phải lỗi', async () => {
    mockFetch(json({ items: [] }))
    await expect(fetchCatalog('/api/x', 'items', ItemSchema)).resolves.toEqual([])
  })

  it('HTTP lỗi thì ném, không trả mảng rỗng', async () => {
    mockFetch(json({ error: 'boom' }, 500))
    await expect(fetchCatalog('/api/x', 'items', ItemSchema)).rejects.toThrow('HTTP 500')
  })

  it('body không phải JSON (trang HTML fallback) thì ném', async () => {
    mockFetch(new Response('<!doctype html><html></html>', { status: 200 }))
    await expect(fetchCatalog('/api/x', 'items', ItemSchema)).rejects.toThrow()
  })

  it('thiếu khoá hoặc phần tử sai hợp đồng thì ném', async () => {
    mockFetch(json({ other: [] }))
    await expect(fetchCatalog('/api/x', 'items', ItemSchema)).rejects.toThrow(
      /không đúng định dạng/,
    )
    mockFetch(json({ items: [{ id: 1 }] }))
    await expect(fetchCatalog('/api/x', 'items', ItemSchema)).rejects.toThrow(
      /không đúng định dạng/,
    )
  })

  it('mất mạng thì ném nguyên lỗi mạng', async () => {
    mockFetch(new TypeError('Failed to fetch'))
    await expect(fetchCatalog('/api/x', 'items', ItemSchema)).rejects.toThrow('Failed to fetch')
  })
})
