// normalizeVi — chuẩn hoá chuỗi tiếng Việt để SO SÁNH/TÌM KIẾM không phụ thuộc dấu.
//
// Ô tìm trong mục lục phải cho gõ "phuong trinh" ra "Phương trình", và gõ "DAY SO" ra "Dãy số".
// Đây là đúng bước tiền xử lý mà `slugify` (packages/core-ui/slug.ts) vẫn làm trước khi thay
// ký tự lạ bằng dấu gạch ngang — nên tách ra dùng chung thay vì chép lại: `slugify` gọi lại
// hàm này, một chỗ sửa là cả hai đúng.
//
// THUẦN: không I/O, không phụ thuộc locale của máy (không dùng toLocaleLowerCase).

/** Bỏ dấu tiếng Việt, đ→d, hạ chữ thường, gộp khoảng trắng thừa. */
export function normalizeVi(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // NFD tách dấu thanh/dấu mũ ra ký tự riêng — bỏ chúng đi
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}
