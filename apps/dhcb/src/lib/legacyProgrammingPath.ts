import { PROGRAMMING_PREFIX } from './programmingRoutes'

/**
 * Đổi một URL Lập trình cũ sang URL chuẩn mới.
 *
 * Hàm chỉ nhận các nhánh đã có route thật; URL lạ trả `null` để router xử lý 404,
 * tránh redirect vòng hoặc biến một đường dẫn sai thành trang môn học.
 */
export function legacyProgrammingPath(pathname: string, search: string): string | null {
  const tail =
    pathname === '/lap-trinh' ? '' : pathname.startsWith('/lap-trinh/') ? pathname.slice(11) : null
  if (tail === null) return null

  let next: string | null
  if (tail === '') next = PROGRAMMING_PREFIX
  else if (/^(?:gioi-thieu|du-an|on-tap|chay-thu)$/.test(tail))
    next = `${PROGRAMMING_PREFIX}/${tail}`
  else if (/^bai-hoc\/[^/]+$/.test(tail)) next = `${PROGRAMMING_PREFIX}/${tail}`
  else if (/^khoa-hoc\/[^/]+$/.test(tail)) next = `${PROGRAMMING_PREFIX}/${tail}`
  else if (/^khoa\/[^/]+$/.test(tail)) next = `${PROGRAMMING_PREFIX}/khoa-hoc/${tail.slice(5)}`
  else if (/^huong(?:\/[^/]+){0,2}$/.test(tail)) next = `${PROGRAMMING_PREFIX}/${tail}`
  else if (/^lo-trinh\/[^/]+(?:\/(?:chan-doan|chang\/[^/]+))?$/.test(tail)) {
    next = `${PROGRAMMING_PREFIX}/${tail}`
  } else if (/^p[1-6](?:--[a-z0-9-]+)?$/.test(tail)) {
    next = `${PROGRAMMING_PREFIX}/bac/${tail}`
  } else next = null

  return next === null ? null : `${next}${search}`
}
