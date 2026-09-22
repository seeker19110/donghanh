# ADR-0011: Nâng ESLint 8 → 9 và chuyển sang flat config

- **Trạng thái:** Đã chấp nhận
- **Ngày:** 2026-09-22

## Bối cảnh

CLAUDE.md mục 6 và `docs/system-requirements.md` từng chốt rõ: **giữ ESLint 8 với `.eslintrc.cjs`,
không chuyển flat config**. Lý do ghi lại lúc đó là "giữ tương thích với toàn bộ plugin custom".

Hai dữ kiện mới, xác minh ngày 2026-09-22:

1. **Dòng ESLint 8 đã ngoài vòng hỗ trợ.** `npm view eslint dist-tags` cho thấy tag `maintenance`
   nay trỏ `9.39.5` — tức 8.x không còn nhận vá, kể cả vá bảo mật.
2. **Lo ngại "plugin custom không tương thích" không còn đúng.** Kiểm `peerDependencies` của toàn
   bộ plugin dự án đang dùng: `@typescript-eslint/* 8.70.1` (`^8.57 || ^9 || ^10`),
   `eslint-plugin-jsx-a11y 6.10.2` (`… || ^9`), `eslint-plugin-react-hooks 7.1.1`
   (`… || ^9 || ^10`), `eslint-config-prettier 10.1.8` (`>=7`),
   `eslint-plugin-react-refresh 0.5.7` (`^9 || ^10`). Tất cả nhận ESLint 9.

## Quyết định

Nâng ESLint 8.57 → **9.39.5**, xoá `.eslintrc.cjs`, thay bằng `eslint.config.js` (flat config).

**Đích là 9.x, KHÔNG phải 10.** ESLint 10 bị chặn cứng: `eslint-plugin-jsx-a11y@6.10.2` (bản mới
nhất) chỉ khai peer tới `^9`. jsx-a11y là cổng a11y bắt buộc của dự án (CLAUDE.md mục 4.5), không
bỏ được để đổi lấy một số phiên bản. Xét lại ESLint 10 khi jsx-a11y mở peer.

Quyết định giữ nguyên **React 18 · TypeScript 5.x · Tailwind 3** KHÔNG bị ADR này đụng tới.

## Lý do

Một cổng chất lượng chạy trên công cụ không còn nhận vá bảo mật là nợ tăng dần theo thời gian: mỗi
tháng trôi qua thì khoảng cách để nâng lại xa thêm, và plugin mới dần bỏ hỗ trợ eslintrc. Nâng lúc
toàn bộ plugin đã sẵn sàng là thời điểm rẻ nhất.

## Các phương án đã cân nhắc

- **Giữ ESLint 8 vô thời hạn.** Không chọn: công cụ hết hỗ trợ, và mỗi lần nâng plugin về sau sẽ
  càng dễ vỡ vì plugin mới chỉ còn khai peer `^9 || ^10`.
- **Nhảy thẳng ESLint 10.** Không chọn được: jsx-a11y chặn peer ở `^9`. Bỏ jsx-a11y để lên 10 là
  đánh đổi sai hướng — mất một lớp gác a11y tĩnh để lấy một con số phiên bản.
- **Nâng ESLint 9 + đồng thời dọn/siết luật.** Không chọn: trộn "đổi định dạng cấu hình" với "đổi
  luật" vào một diff làm không ai soát được cái nào gây ra thay đổi nào. Đợt này chuyển NGUYÊN
  TRẠNG; muốn đổi luật thì PR riêng.

## Hệ quả

**Tích cực:**

- Công cụ lint trở lại dòng còn nhận vá.
- Mở đường nâng các plugin về sau (nhiều plugin đã bỏ hỗ trợ eslintrc).

**Đánh đổi / rủi ro phải chấp nhận:**

- `eslint:recommended` của ESLint 9 khác v8: **gỡ** `no-inner-declarations`, **thêm**
  `no-constant-binary-expression`, `no-empty-static-block`, `no-unused-private-class-members`.
  Đây là thay đổi nội tại của việc nâng phiên bản, không phải do cách viết config. Đã kiểm: mã
  nguồn hiện tại không vi phạm luật nào trong ba luật mới (`npm run lint` 0 cảnh báo trên 2.349 file).
- Flat config mặc định lint cả `.cjs`, trong khi cấu hình cũ chạy `--ext ts,tsx,js,mjs` nên `.cjs`
  chưa bao giờ được lint. Để đợt chuyển không lặng lẽ đổi phạm vi, `**/*.cjs` được đưa vào
  `ignores`. **Nợ mở:** có nên lint `commitlint.config.cjs` / `ecosystem.config.cjs` hay không —
  quyết ở PR riêng.
- Khuôn `ignores` của flat config khác `ignorePatterns`: viết trần `dist` chỉ khớp đúng một file
  tên `dist`, phải viết `**/dist/**`. Đây là lỗi dễ mắc khi sau này thêm mục ignore mới.

**Bằng chứng tương đương đã chạy (không phải "chắc là tương đương"):**

- `npx eslint --print-config` trên 4 file đại diện (app tsx · packages ts · scripts ts · packages
  ts có override biên giới), so trước/sau: khác biệt ĐÚNG bằng bộ thay đổi `eslint:recommended`
  của ESLint 9 nêu trên, giống nhau ở cả 4 file. Không mất luật nào khác.
- Phạm vi quét: 2.349 file (`ts` 1.976 · `tsx` 363 · `js` 7 · `mjs` 3), `scripts/archive` và
  `dist` bị loại đúng như cũ.
- Hai cổng riêng của dự án đã kiểm **bắt lỗi thật** bằng file thử rồi xoá: luật biên giới
  `packages/ ↛ apps/` báo `no-restricted-imports`; `jsx-a11y/alt-text` báo `<img>` thiếu `alt`.
