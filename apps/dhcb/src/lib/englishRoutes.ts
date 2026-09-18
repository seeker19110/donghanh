import type { CefrLevel } from '../data/cefr'

/** Tiền tố URL chuẩn của toàn bộ nội dung môn Tiếng Anh. */
export const ENGLISH_PREFIX = '/goc-hoc-tap/english'

export function duongDanLoTrinh(levelId?: CefrLevel['id']): string {
  const base = `${ENGLISH_PREFIX}/lo-trinh`
  return levelId === undefined ? base : `${base}/${levelId.toLowerCase()}`
}

export function duongDanBaiHocAnh(): string {
  return `${ENGLISH_PREFIX}/bai-hoc`
}

export function duongDanTroTruyen(): string {
  return `${ENGLISH_PREFIX}/tro-truyen`
}

export function duongDanLuyenNoi(): string {
  return `${ENGLISH_PREFIX}/luyen-noi`
}

export function duongDanLuyenViet(): string {
  return `${ENGLISH_PREFIX}/luyen-viet`
}

export function duongDanLuyenNghe(): string {
  return `${ENGLISH_PREFIX}/luyen-nghe`
}

export function duongDanTuDien(word?: string): string {
  const base = `${ENGLISH_PREFIX}/tu-dien`
  return word === undefined ? base : `${base}/${encodeURIComponent(word)}`
}

export function duongDanOnThi(): string {
  return `${ENGLISH_PREFIX}/on-thi`
}

export function duongDanTruyen(id?: string): string {
  const base = `${ENGLISH_PREFIX}/truyen`
  return id === undefined ? base : `${base}/${id}`
}

export function duongDanCauThongDung(): string {
  return `${ENGLISH_PREFIX}/cau-thong-dung`
}

export function duongDanSoTayLoiSai(): string {
  return `${ENGLISH_PREFIX}/so-tay-loi-sai`
}

export function duongDanThuThach(): string {
  return `${ENGLISH_PREFIX}/thu-thach`
}
