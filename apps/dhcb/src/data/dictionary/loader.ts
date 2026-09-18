// Loader cho từ điển — các file chunk-*.json nằm trong /public/data/dictionary/
// và được tải bằng fetch() thay vì import.meta.glob để giảm số module Vite phải xử lý lúc build.
// loadDictionary() tải TẤT CẢ chunk SONG SONG rồi ghép lại. Kết quả được cache.

import type { DictEntry } from '../../types'

// Đếm số chunk: script split-dictionary.mjs đặt tên chunk-000.json đến chunk-009.json (10 file).
const CHUNK_COUNT = 10

let cache: DictEntry[] | null = null
let _loadPromise: Promise<DictEntry[]> | null = null

async function fetchChunk(name: string): Promise<DictEntry[]> {
  const response = await fetch(`/data/dictionary/${name}`)
  if (!response.ok) throw new Error(`Không tải được dữ liệu từ điển: ${name}`)
  return response.json() as Promise<DictEntry[]>
}

// Tải toàn bộ từ điển (ghép mọi chunk). Chỉ tải MỘT lần dù gọi từ nhiều nơi.
export function loadDictionary(): Promise<DictEntry[]> {
  if (cache) return Promise.resolve(cache)
  if (_loadPromise) return _loadPromise

  const fetches = Array.from({ length: CHUNK_COUNT }, (_, i) => {
    const name = `chunk-${String(i).padStart(3, '0')}.json`
    return fetchChunk(name)
  })

  const promise = Promise.all(fetches).then((chunks) => {
    cache = chunks.flat()
    return cache
  })
  _loadPromise = promise
  void promise.catch(() => {
    if (_loadPromise === promise) _loadPromise = null
  })
  return promise
}
