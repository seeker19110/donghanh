// apps/dhcb/src/lib/useCatalogList.ts — tải một DANH MỤC dùng chung (bài mẫu, kịch bản…) có trạng
// thái tải / lỗi / sẵn sàng tách bạch, kèm thử lại.
//
// Vì sao có file này: thẻ Nói Đè Theo Mẫu và Scenario Holodeck từng nuốt lỗi tải (`if (res.ok)` +
// `console.error`). Mất mạng hay API 500 thì thân thẻ để TRỐNG, không một chữ nào báo — người học
// không biết là đang tải, là lỗi, hay là tính năng không có gì (CLAUDE.md mục 4.3).
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { thongDiepLoiThanThien } from './friendlyError'

export type CatalogState<T> =
  { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; items: T[] }

const DEFAULT_ERROR = 'Máy chủ chưa trả về danh sách. Kiểm tra kết nối rồi thử lại.'

/**
 * GET `url`, lấy mảng ở khoá `key` và kiểm từng phần tử bằng `itemSchema`. Ném lỗi khi HTTP
 * không OK, body không phải JSON, thiếu khoá hoặc sai hợp đồng — để UI hiện lỗi thay vì rỗng.
 * Mảng rỗng hợp lệ là kết quả "sẵn sàng nhưng chưa có gì", KHÔNG phải lỗi.
 */
export async function fetchCatalog<T>(
  url: string,
  key: string,
  itemSchema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T[]> {
  const res = await fetch(url, signal ? { signal } : undefined)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const body: unknown = await res.json()
  const parsed = z.object({ [key]: z.array(itemSchema) }).safeParse(body)
  if (!parsed.success) throw new Error(`Dữ liệu danh mục "${key}" không đúng định dạng.`)
  return parsed.data[key] as T[]
}

/**
 * Hook bọc `fetchCatalog`. `itemSchema` phải là hằng module (đổi tham chiếu mỗi lần render sẽ
 * tải lại liên tục). Huỷ request khi unmount hoặc khi thử lại.
 */
export function useCatalogList<T>(url: string, key: string, itemSchema: z.ZodType<T>) {
  const [state, setState] = useState<CatalogState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchCatalog(url, key, itemSchema, controller.signal).then(
      (items) => {
        if (!controller.signal.aborted) setState({ status: 'ready', items })
      },
      (err: unknown) => {
        if (!controller.signal.aborted)
          setState({ status: 'error', message: thongDiepLoiThanThien(err, DEFAULT_ERROR) })
      },
    )
    return () => controller.abort()
  }, [url, key, itemSchema, attempt])

  // Đặt 'loading' ngay trong handler (không trong thân effect) để nút Thử lại phản hồi tức thì.
  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  return { state, retry }
}
