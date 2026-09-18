// Loader cho dữ liệu CEFR — tải từ /public/data/cefr.json bằng fetch() thay vì bundle.
// Re-export các interface để code cũ import type không cần sửa.

export type { Example, CommonMistake, QuizItem, GrammarLesson, CefrUnit, CefrLevel } from './cefr'

import type { CefrLevel } from './cefr'

let _promise: Promise<CefrLevel[]> | null = null

export function loadCefr(): Promise<CefrLevel[]> {
  if (!_promise) {
    const promise = fetch('/data/cefr.json').then((response) => {
      if (!response.ok) throw new Error('Không tải được dữ liệu CEFR')
      return response.json() as Promise<CefrLevel[]>
    })
    _promise = promise
    void promise.catch(() => {
      if (_promise === promise) _promise = null
    })
  }
  return _promise
}
