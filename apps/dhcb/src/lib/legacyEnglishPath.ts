import {
  duongDanBaiHocAnh,
  duongDanCauThongDung,
  duongDanLuyenNghe,
  duongDanLuyenNoi,
  duongDanLuyenViet,
  duongDanLoTrinh,
  duongDanOnThi,
  duongDanSoTayLoiSai,
  duongDanThuThach,
  duongDanTroTruyen,
  duongDanTruyen,
  duongDanTuDien,
} from './englishRoutes'

/** Đổi các URL Tiếng Anh đã phát hành sang tiền tố Góc học tập mới. */
export function legacyEnglishPath(pathname: string, search: string): string | null {
  const exact: Record<string, string> = {
    '/lo-trinh-hoc': duongDanLoTrinh(),
    '/bai-hoc': duongDanBaiHocAnh(),
    '/tro-truyen': duongDanTroTruyen(),
    '/luyen-noi': duongDanLuyenNoi(),
    '/luyen-viet': duongDanLuyenViet(),
    '/luyen-nghe': duongDanLuyenNghe(),
    '/tu-dien': duongDanTuDien(),
    '/cau-thong-dung': duongDanCauThongDung(),
    '/truyen-song-ngu': duongDanTruyen(),
    '/so-tay-loi-sai': duongDanSoTayLoiSai(),
    '/on-thi': duongDanOnThi(),
    '/thu-thach': duongDanThuThach(),
  }
  const direct = exact[pathname]
  if (direct) return `${direct}${search}`

  if (pathname === '/lo-trinh-hoc/' || pathname.startsWith('/lo-trinh-hoc/')) {
    const levelId = pathname.slice('/lo-trinh-hoc/'.length)
    const level = (['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).find(
      (id) => id.toLowerCase() === levelId.toLowerCase(),
    )
    if (level) return `${duongDanLoTrinh(level)}${search}`
  }
  if (pathname === '/tu-vung' || pathname.startsWith('/tu-vung/')) {
    const word = pathname.slice('/tu-vung'.length).replace(/^\//, '')
    if (!word) return `${duongDanTuDien()}${search}`
    try {
      return `${duongDanTuDien(decodeURIComponent(word))}${search}`
    } catch {
      return `${duongDanTuDien(word)}${search}`
    }
  }
  if (pathname === '/truyen-song-ngu/' || pathname.startsWith('/truyen-song-ngu/')) {
    const id = pathname.slice('/truyen-song-ngu/'.length)
    if (id && !id.includes('/')) return `${duongDanTruyen(id)}${search}`
  }
  return null
}
