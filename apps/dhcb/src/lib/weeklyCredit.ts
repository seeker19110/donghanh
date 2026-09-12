// src/lib/weeklyCredit.ts — Đọc "còn bao nhiêu lượt AI HÔM NAY" từ SERVER (xem
// api/usage-summary.ts). Tên file/field giữ "weekly"/"freeWeekly*" vì LỊCH SỬ: gói Free từng
// dùng kho lượt cửa sổ trượt 7 ngày; GĐ1 2026-09-12 đổi sang hạn mức TỔNG/ngày (Free 30, VIP
// theo cấu hình) nhưng giữ nguyên tên field để không phá cache localStorage đã phát hành.
//   freeWeeklyCredit = còn bao nhiêu lượt hôm nay (null = server lỗi, chưa biết)
//   freeWeeklyCap    = hạn mức lượt mỗi ngày của gói hiện tại
//
// Không cache lâu (số đổi mỗi lần dùng AI) — luôn hỏi lại server khi vào các trang
// Chat/Writing/Speaking/Dashboard/Challenge để số hiển thị luôn đúng.

import { getAuthHeader } from '@core/authHeader'

export interface WeeklyCreditInfo {
  plan: 'free' | 'vip'
  freeWeeklyCredit: number | null // null = server không đọc được (fail-open, UI ẩn số)
  freeWeeklyCap: number
}

// Lỗi mạng/server → coi như hết lượt (an toàn hơn là coi như còn — tránh hiển thị sai
// "còn nhiều lượt" trong khi server có thể đang chặn thật). UI nơi gọi tự xử lý null/lỗi
// hiển thị phù hợp (vd ẩn số, không chặn cứng — chặn thật vẫn do server quyết định).
export async function fetchWeeklyCredit(): Promise<WeeklyCreditInfo | null> {
  try {
    const resp = await fetch('/api/usage-summary', { headers: getAuthHeader() })
    if (!resp.ok) return null
    return (await resp.json()) as WeeklyCreditInfo
  } catch {
    return null
  }
}
