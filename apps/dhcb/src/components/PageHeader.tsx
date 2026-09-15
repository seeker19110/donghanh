// PageHeader — tiêu đề lớn của trang, đặt NGAY DƯỚI thanh AppHeader (Layout) trong phần
// nội dung. Tách khỏi thanh header để tiêu đề to, rõ, dễ đọc trên mobile.
// Dùng: đặt <PageHeader title=… subtitle=… /> ở đầu <main> của mỗi trang,
// và KHÔNG truyền title cho <Layout> nữa.

interface Props {
  title: string
  subtitle?: string
  className?: string
}

export default function PageHeader({ title, subtitle, className = '' }: Props) {
  return (
    <div className={`mb-6 ${className}`}>
      {/* `tabIndex={-1}`: KHÔNG thêm điểm dừng Tab mới, nhưng cho phép đưa tiêu điểm tới bằng
          mã lệnh — panel mục lục trên mobile đóng xong phải focus vào tiêu đề trang mới, nếu
          không tiêu điểm rơi về <body> và người dùng bàn phím mất chỗ đứng (S07-2 AC-11). */}
      <h1
        tabIndex={-1}
        className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight focus:outline-none"
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed font-normal">{subtitle}</p>
      )}
    </div>
  )
}
