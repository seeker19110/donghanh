// Tailwind 4: plugin PostCSS riêng, config khai bằng `@config` trong src/index.css.
// Bỏ autoprefixer — v4 tự lo tiền tố (Lightning CSS).
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
