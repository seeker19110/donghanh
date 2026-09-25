import { useEffect, useState } from 'react'

// Trạng thái nạp danh sách của một thẻ Bạn Đồng Hành. Tách 4 trạng thái để thẻ luôn hiện
// ĐÚNG MỘT thông điệp: đang tải · có dữ liệu · rỗng · lỗi (có nút thử lại). Trước đây thẻ
// "Nói Đè Theo Mẫu" và Scenario Holodeck nuốt lỗi vào console → thân thẻ trống trơn, người học
// không biết là đang tải, không có bài, hay mạng hỏng (nợ ghi ở changelog 0451).
export type ListLoadState = 'loading' | 'ready' | 'empty' | 'error'

/**
 * Nạp một danh sách từ API dạng `{ [key]: T[] }`.
 * `key` là tên trường chứa mảng trong JSON trả về (vd `passages`, `scenarios`).
 * `reload()` nạp lại — dùng cho nút "Thử lại" ở trạng thái lỗi.
 */
export function useCompanionList<T>(url: string, key: string) {
  const [items, setItems] = useState<T[]>([])
  const [state, setState] = useState<ListLoadState>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Cờ huỷ: thẻ bị gỡ (đổi studio) trước khi fetch xong thì không ghi state nữa.
    let cancelled = false
    async function load() {
      setState('loading')
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: unknown = await res.json()
        const list =
          data && typeof data === 'object' ? (data as Record<string, unknown>)[key] : undefined
        // Dữ liệu ngoài phải kiểm lúc chạy: không phải mảng thì coi như lỗi, đừng render bừa.
        if (!Array.isArray(list)) throw new Error(`Thiếu trường "${key}"`)
        if (cancelled) return
        setItems(list as T[])
        setState(list.length > 0 ? 'ready' : 'empty')
      } catch {
        if (!cancelled) setState('error')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [url, key, attempt])

  return { items, state, reload: () => setAttempt((n) => n + 1) }
}
