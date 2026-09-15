// slug — biến tiêu đề bài học (tiếng Việt hoặc Anh) thành URL đọc được, tốt cho SEO.
//
// URL bài học trước đây chỉ có id ngắn (vd "/lap-trinh/bai-hoc/p1-u1-l1"), không nói lên
// nội dung gì cả — vừa xấu vừa không giúp Google hiểu trang nói về gì. Nay ghép thêm phần
// mô tả: "/lap-trinh/bai-hoc/p1-u1-l1--chuong-trinh-dau-tien-may-tinh-lam-gi".
//
// Dùng "--" (hai gạch ngang) làm ranh giới giữa id và phần mô tả — id gốc và slug sinh ra
// từ slugify() đều chỉ có MỘT gạch ngang liền nhau, nên "--" không bao giờ lẫn vào trong id
// hay trong slug, tách lại luôn đúng mà không cần biết trước danh sách id hợp lệ.

import { normalizeVi } from '@dhcb/core-learner/outline/normalizeVi'

/** Bỏ dấu tiếng Việt, hạ chữ thường, thay ký tự không phải chữ/số bằng "-". */
export function slugify(text: string): string {
  // Bước bỏ dấu dùng chung với ô tìm trong mục lục (S07) — một chỗ sửa, hai nơi đúng.
  return normalizeVi(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '') // slice có thể cắt giữa cụm, dọn lại gạch ngang thừa ở cuối
}

/** Ghép id + tiêu đề thành 1 URL segment mô tả nội dung. */
export function buildSlugSegment(id: string, title: string): string {
  const slug = slugify(title)
  return slug ? `${id}--${slug}` : id
}

/** Tách id gốc ra khỏi 1 URL segment (bỏ qua phần mô tả sau "--", nếu có). */
export function idFromSlugSegment(segment: string): string {
  const sepIndex = segment.indexOf('--')
  return sepIndex === -1 ? segment : segment.slice(0, sepIndex)
}
