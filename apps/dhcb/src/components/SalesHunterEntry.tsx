import { salesHunterLaunchUrl, showSalesHunterEntry } from '../lib/salesHunter'

interface Props {
  hostname?: string
  enabled?: unknown
}

/** A separate product entry, not an additional Learning studio or a shared session. */
export default function SalesHunterEntry({
  hostname = window.location.hostname,
  enabled = import.meta.env.VITE_SALES_HUNTER_PILOT_ENABLED,
}: Props) {
  if (!showSalesHunterEntry(hostname)) return null
  const launchUrl = salesHunterLaunchUrl(enabled)

  return (
    <footer
      aria-label="Sales-Hunter trong hệ sinh thái Đồng Hành"
      className="mx-auto max-w-5xl px-4 pb-28 pt-6 lg:pl-[var(--sidebar-w)]"
    >
      <details className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-zinc-100">
        <summary className="cursor-pointer text-base font-semibold focus-visible:outline">
          Sales-Hunter · Ứng dụng riêng của Đồng Hành
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          Theo dõi ưu đãi và bản nháp affiliate. Bản thử nghiệm đầu chỉ đọc, dành cho người
          vận hành được cấp quyền riêng; chưa mở tự động đăng bài.
        </p>
        <p className="mt-2 text-sm text-zinc-300">
          Không dùng dữ liệu học tập, phiên đăng nhập hoặc gói thanh toán Learning.
        </p>
        {launchUrl ? (
          <a
            href={launchUrl}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-zinc-500 px-4 text-sm font-semibold focus-visible:outline"
          >
            Mở Sales-Hunter — tab mới
          </a>
        ) : (
          <p className="mt-4 text-sm font-semibold" role="status">
            Chưa mở truy cập — đang chuẩn bị thử nghiệm có kiểm soát.
          </p>
        )}
      </details>
    </footer>
  )
}
