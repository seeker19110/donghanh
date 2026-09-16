// todayCardText — chữ nghĩa của thẻ "Hôm nay", tách khỏi component để test thẳng và để mọi nơi
// nói CÙNG MỘT cách về nguồn bằng chứng (S06-2, đặc tả §③.3).
import type { TodayItem } from '@dhcb/core-contracts/todayPlan'

/** Khoảng cách thời gian đọc được bằng tiếng Việt — không dùng thư viện ngoài. */
export function khoangThoiGian(tuLuc: number, bayGio: number): string {
  const phut = Math.max(0, Math.round((bayGio - tuLuc) / 60000))
  if (phut < 1) return 'vừa xong'
  if (phut < 60) return `${phut} phút trước`
  const gio = Math.round(phut / 60)
  if (gio < 24) return `${gio} giờ trước`
  return `${Math.round(gio / 24)} ngày trước`
}

/**
 * Dòng phụ của một mục: nói nguồn bằng chữ.
 *
 * Phiên dở là nguồn DUY NHẤT tự dựng chữ ở đây (nó cần mốc thời gian tương đối, mà resolver thuần
 * thì không được gọi `Date.now()`); các nguồn khác đã có `hint` do adapter môn viết.
 *
 * [S06-3] Mục phụ của MÔN THỨ HAI mang `hint` = "Môn thứ hai: <tên môn>". Trước đây nhánh phiên
 * dở nuốt mất `hint` đó, nên hai phiên của hai môn khác nhau hiện y hệt nhau ("Phiên đang dở · …")
 * — người học không có cách nào biết mục phụ dẫn sang môn khác. Nay tên môn đứng TRƯỚC mốc thời
 * gian. Việc chính không bị ảnh hưởng: resolver không gắn `hint` cho mục phiên chính.
 */
export function dongNguon(item: TodayItem, bayGio: number): string | undefined {
  if (item.evidenceSource === 'session.resume' && item.resume) {
    const moc = `Phiên đang dở · ${khoangThoiGian(item.resume.updatedAt, bayGio)}`
    return item.hint ? `${item.hint} · ${moc}` : moc
  }
  if (item.kind === 'pick') return tachLoiMoi(item.title).dan ?? item.hint
  return item.hint
}

/**
 * Tách tiêu đề mục `pick` thành (lời dẫn, việc phải làm).
 *
 * Tiêu đề của resolver là một CÂU ("Chọn môn để bắt đầu", "Bạn đã đi hết nội dung đang có — chọn
 * môn hoặc khoá mới"). Ghép thẳng vào nhãn nút thành "Bắt đầu: Chọn môn để bắt đầu" — lặp chữ,
 * thấy rõ ở ảnh 320px. Nên ở đây: phần trước dấu "—" thành dòng nguồn, phần sau thành việc, và
 * bỏ đuôi "để bắt đầu" vì nhãn nút đã nói điều đó rồi.
 */
function tachLoiMoi(title: string): { viec: string; dan?: string } {
  const phan = title.split(' — ')
  const truoc = phan[0] ?? title
  const sau = phan.length > 1 ? phan[phan.length - 1] : undefined
  const viec = (sau ?? truoc).replace(/\s*để bắt đầu$/i, '')
  const hoa = viec.charAt(0).toUpperCase() + viec.slice(1)
  return sau ? { viec: hoa, dan: truoc } : { viec: hoa }
}

/** Nhãn nút chính — luôn mở đầu bằng "Học tiếp"/"Bắt đầu" (bất biến E2E đếm đúng MỘT nút). */
export function nhanChinh(item: TodayItem): string {
  if (item.kind === 'pick') return `Bắt đầu: ${tachLoiMoi(item.title).viec}`
  return `Học tiếp: ${item.title}`
}
