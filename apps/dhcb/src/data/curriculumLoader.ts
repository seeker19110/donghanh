// Loader cho dữ liệu từ vựng nền tảng — tải từ /public/data/curriculum.json bằng fetch().

export type { Circle } from './curriculum'
import type { Circle } from './curriculum'

let _promise: Promise<Circle[]> | null = null

export function loadFoundation(): Promise<Circle[]> {
  if (!_promise) {
    const promise = fetch('/data/curriculum.json').then((response) => {
      if (!response.ok) throw new Error('Không tải được dữ liệu lộ trình nền tảng')
      return response.json() as Promise<Circle[]>
    })
    _promise = promise
    void promise.catch(() => {
      if (_promise === promise) _promise = null
    })
  }
  return _promise
}
