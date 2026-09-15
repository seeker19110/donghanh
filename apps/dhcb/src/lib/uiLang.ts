// Lưu và đọc ngôn ngữ giao diện (vi / en) từ localStorage
// [Cập nhật 2026-08-13] Đã đồng bộ đa thiết bị qua learning_progress.settings — xem
// lib/progressSync.ts (touchSettingsUpdated đánh dấu mốc để hợp nhất theo "mới hơn thắng").
import { touchSettingsUpdated } from './storage'

export type UiLang = 'vi' | 'en'

const KEY = 'ui_lang'

/** Khoá chiều học của môn Tiếng Anh (`DIRECTION_KEY` ở storage.ts) — đọc thẳng để không kéo
 *  storage.ts vào vòng import (storage.ts đã import file này qua touchSettingsUpdated). */
const ENGLISH_DIRECTION_KEY = 'et_direction'

/**
 * Ngôn ngữ giao diện nền tảng.
 *
 * [Slice 04] Trước đây các trang NỀN TẢNG (Home, Pricing, Profile…) chọn chữ giao diện bằng
 * `getDirection() === 'A'` — tức cấu hình CHIỀU HỌC của môn Tiếng Anh. Nay hai thứ tách nhau:
 * giao diện đọc `ui_lang`. Để người đang học chiều B (giao diện tiếng Anh) không bị đổi trải
 * nghiệm, lần ĐẦU chưa có `ui_lang` mà direction là B thì coi như `en` và ghi xuống cho ổn định.
 * Đã đặt `ui_lang` (kể cả `vi`) thì tôn trọng, không nhìn direction nữa.
 */
export function getUiLang(): UiLang {
  const stored = localStorage.getItem(KEY)
  if (stored === 'vi' || stored === 'en') return stored
  const fromDirection: UiLang = localStorage.getItem(ENGLISH_DIRECTION_KEY) === 'B' ? 'en' : 'vi'
  // Ghi trực tiếp, KHÔNG touchSettingsUpdated: đây là suy ra từ dữ liệu sẵn có, không phải
  // người dùng vừa đổi cài đặt — không nên đánh dấu "mới hơn" để ghi đè thiết bị khác.
  localStorage.setItem(KEY, fromDirection)
  return fromDirection
}

export function setUiLang(lang: UiLang) {
  localStorage.setItem(KEY, lang)
  touchSettingsUpdated()
}
