// Tailwind 4 dùng plugin PostCSS RIÊNG (`@tailwindcss/postcss`) thay cho `tailwindcss` ở v3.
//
// KHÔNG còn tuỳ chọn `config` ở đây: v4 chỉ định config bằng chỉ thị `@config` ngay trong CSS
// (xem `src/index.css`). Bản v3 phải trỏ đường dẫn tuyệt đối vì plugin tìm config theo cwd (gốc
// repo khi chạy npm script) nên không thấy config đã dời vào apps/dhcb ở PR-S2 — CSS mất sạch
// utilities, bắt được nhờ size-limit (15.75 kB tụt còn 2.44 kB). Ở v4 đường dẫn trong `@config`
// là tương đối so với chính file CSS, nên cái bẫy cwd đó không còn.
//
// Bỏ `autoprefixer`: v4 đã tự lo tiền tố (Lightning CSS) — để lại là chạy hai lần.
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
