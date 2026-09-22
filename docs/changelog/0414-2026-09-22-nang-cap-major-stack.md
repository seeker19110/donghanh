# 0414 — 2026-09-22 — Nâng cấp major stack nền: ESLint 9 flat config, Express 5, size-limit 14, dotenv 18, nodemailer 10 (Vite 8 CHẶN LẠI)

- **PR:** #1112 · nhánh `claude/major-upgrade-assessment-qj0bb7`
- **Loại:** nâng cấp hạ tầng công cụ (`build`/`chore`), không đổi tính năng
- **Đặc tả/đánh giá:** `docs/specs/2026-09-22-nang-cap-major-stack.md` · ADR
  `docs/adr/0011-nang-eslint-9-flat-config.md`

## Việc đã làm

### 1. Đánh giá research-first trước khi sửa gì

Mọi phiên bản xác minh bằng **nguồn sống** ngày 2026-09-22 (`registry.npmjs.org`,
`nodejs/Release/schedule.json`, `npm view <gói> engines|peerDependencies`), không dùng trí nhớ.

Hai kết luận ban đầu **bị chính việc tra cứu bác bỏ** — ghi lại để lần sau không lặp:

| Nhận định ban đầu                       | Sự thật sau khi tra                                             | Hệ quả                                                                                                |
| --------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| "Node 22 là nợ bảo mật, phải nâng ngay" | v22 "Jod" vào maintenance 2025-10-21, **hỗ trợ đến 2027-04-30** | Không gấp. Hoãn, chờ Node 26 LTS (2026-10-28) rồi nhảy 22 → 26, vì v24 rời Active LTS ngày 2026-10-20 |
| "Nâng ESLint lên 10 (bản mới nhất)"     | `eslint-plugin-jsx-a11y@6.10.2` chỉ khai peer `eslint: ^3 … ^9` | ESLint 10 **bất khả thi** — jsx-a11y là cổng a11y bắt buộc. Đích là 9.39.5                            |

### 2. Gói minor/patch (không breaking)

Sentry 10.75.1 · aws-sdk 3.1137.0 · commitlint 21.2.3 · `@types/node` 26.6.2 · typescript-eslint
8.70.1 · prettier 3.9.8 · zod 4.6.5 · tsx 4.23.15 · lucide-react 1.47.0 · react-router-dom 7.18.4 ·
compression 1.8.2 · `@google/genai` 2.24.0 · `@types/nodemailer` 8.0.2.

### 3. size-limit 12 → 14, dotenv 17 → 18, nodemailer 9 → 10

- `size-limit@14` đòi Node `^22.19.0 || ^24.5.0 || >=26.0.0` → **siết `engines.node` từ `">=22"`
  thành `">=22.19.0"`**. Để `">=22"` là hứa sai: ai dùng Node 22.0 sẽ gãy ở bước đo ngân sách.
- `dotenv@18` mặc định in một dòng `injected env (n) from ...` mỗi lần nạp → thêm `quiet: true` ở
  `apps/server/src/server.ts` để không làm bẩn log PM2 production. Script vận hành **giữ nguyên**
  cho in, vì ở đó dòng đó hữu ích.
- `nodemailer@10` đòi Node >= 20 (đạt). API `createTransport` không đổi.

### 4. ESLint 8 → 9 + flat config (đảo một quyết định đã chốt → có ADR 0011)

`.eslintrc.cjs` xoá, thay bằng `eslint.config.js`. Chuyển **NGUYÊN TRẠNG** tập rule, không
thêm/bớt luật nào — muốn đổi luật thì PR riêng, để diff không lẫn "đổi định dạng cấu hình" với
"đổi luật".

**Cách chứng minh tương đương** (đây là phần đáng chép lại cho các đợt sau):
`npx eslint --print-config` trên 4 file đại diện (app `.tsx` · `packages` `.ts` · `scripts` `.ts` ·
`packages` `.ts` có override biên giới), so trước/sau bằng script chuẩn hoá mức severity. Kết quả:
khác biệt **đúng bằng** bộ thay đổi `eslint:recommended` của chính ESLint 9 — gỡ
`no-inner-declarations`, thêm `no-constant-binary-expression` · `no-empty-static-block` ·
`no-unused-private-class-members` — và **giống nhau ở cả 4 file**. Tức không mất luật nào do cách
viết config.

Hai chi tiết dễ sai đã xử lý:

- `reactHooks.configs.flat.recommended` (16 rule) là bản khớp baseline, **không** dùng
  `recommended-latest` (17 rule) vì bản đó bật thêm luật → đổi hành vi cổng.
- `ignores` của flat config khác `ignorePatterns`: viết trần `dist` chỉ khớp đúng **một file** tên
  `dist`, phải viết `**/dist/**`.

**Hai cổng riêng của dự án đã kiểm BẮT LỖI THẬT** (tạo file thử, xem báo đỏ, rồi xoá) — vì một cái
máy canh mà chưa từng thấy nó báo đỏ thì chưa biết nó có chạy:

- luật biên giới `packages/ ↛ apps/` → báo `no-restricted-imports` kèm đúng thông điệp ADR 0003;
- `jsx-a11y/alt-text` → báo `<img>` thiếu `alt`.

Phạm vi quét sau khi chuyển: **2.349 file** (ts 1.976 · tsx 363 · js 7 · mjs 3), `scripts/archive`
và `dist` loại đúng như cũ.

### 5. Express 4 → 5 (+ `@types/express` 5.0.6)

Rà 111 route: chỉ **2 chỗ** dùng wildcard, đều ở `apps/server/src/server.ts`.

- `'/api/*'` → `'/api/*splat'`
- `'*'` → `'/{*splat}'`

**Dấu `{}` ở catch-all là bắt buộc, không phải cho đẹp:** viết `'/*splat'` thì phần splat là
buộc-phải-có nên **không khớp trang gốc `/`** → trang chủ trả 404. Đây là bẫy lặng: typecheck và
unit test đều không bắt được, chỉ smoke thật mới thấy.

Đã rà và **không dùng** API nào bị gỡ ở v5: `res.sendfile` · `req.param()` · `app.del()` ·
`res.jsonp()` · gán lại `req.query`/`req.params`.

## Việc KHÔNG làm (có chủ đích)

- **React 18 · TypeScript 5.x · Tailwind 3: giữ nguyên** theo CLAUDE.md mục 6. Tailwind 4 chuyển
  cấu hình sang CSS-first `@theme`, phá pipeline token `--a-*`/`--z-*` đang là nguồn sự thật cho
  tương phản a11y.
- **Node 22 → 26: hoãn** tới sau 2026-10-28 (lý do ở bảng mục 1). Cần việc tay trên VPS nên phải
  đi PR riêng.
- **ESLint 10: không thể**, jsx-a11y chặn peer ở `^9`.

## Vite 7 → 8: ĐÃ THỬ, CHẶN LẠI, HOÀN NGUYÊN SẠCH

Vite 8 thay Rollup bằng **rolldown**. Đã cài thật `vite@8.3.0` + `@vitejs/plugin-react@6.1.1`
(bản 6 đòi đúng peer `vite ^8`, hai cái là một cặp) và build. Kết quả:

1. **Build gãy:** `[builtin:vite-alias] plugin 'rolldown:vite-resolve' threw an error`. Đã loại trừ
   giả thuyết đầu tiên — thử đổi alias regex `/^@dhcb\/(.*)$/` + `'$1'` sang alias chuỗi `'@dhcb'`,
   **vẫn gãy y nguyên**, nên nguyên nhân nằm sâu hơn ở tầng phân giải module của rolldown.
2. **`vite-plugin-compression@0.5.1` sinh đường dẫn sai** dưới Vite 8:
   `dist//home/user/donghanh/dist/assets/...gz` (nối đường dẫn tuyệt đối vào sau `dist/`). Gói này
   đã lâu không cập nhật; file `.gz`/`.br` sai chỗ nghĩa là nginx mất phần phục vụ nén sẵn.

Đã hoàn nguyên về `vite@7.3.6` + `@vitejs/plugin-react@4.7.0` và trả `package.json`/lockfile về
đúng HEAD (chú ý: `@vitejs/plugin-react` vốn **ghim cứng** `4.7.0` không có caret — lúc hoàn nguyên
dễ vô tình nới thành `^4.7.0`).

**Vite 8 cần một PR riêng của chính nó**, không nhét vào đợt này. Việc phải làm ở PR đó:

1. Tìm nguyên nhân thật của lỗi `rolldown:vite-resolve` (nghi các plugin tự viết có hook resolve:
   `apiEdgeDevMiddleware`, `pyodideSelfHostPlugin`, `sqlJsSelfHostPlugin`).
2. Thay `vite-plugin-compression` bằng gói còn được bảo trì / tương thích rolldown.
3. Kiểm `rollupOptions.output.manualChunks` còn đúng nghĩa dưới rolldown — **đây là rủi ro lớn
   nhất**: `.size-limit.json` đo theo đúng TÊN chunk, mà ngân sách bundle đang mỏng (nợ kỹ thuật
   PROGRESS #9). Chunk đổi tên = phép đo sai mà cổng vẫn xanh.

## Bằng chứng kiểm chứng (chạy trên checkout sạch, `rm -rf packages/*/dist dist dist-server` + `npm ci`)

| Cổng                    | Kết quả                                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| `npm ci`                | 0 vulnerabilities, lockfile khớp                                                                                |
| `npm run typecheck`     | xanh (4 project)                                                                                                |
| `npm run lint`          | 0 cảnh báo / 2.349 file                                                                                         |
| `npm run test:coverage` | 16.704 test xanh, 2 skip · stmts 94.63 / branches 90.5 / funcs 95.34 / lines 95.15 (ngưỡng 93/89/93/93)         |
| `npm run build`         | xanh                                                                                                            |
| `npm run size`          | Initial JS 132.14 kB / 150 kB · CSS 17.78 kB / 20 kB                                                            |
| `npm run check:docs`    | xanh                                                                                                            |
| `npm run check:specs`   | xanh (132 đặc tả)                                                                                               |
| Smoke Express 5         | `/api/health` 200 JSON · `/api/khong-ton-tai` 404 JSON · `/` 200 html · `/lap-trinh` 200 · `/tu-vung/hello` 200 |
| Boot server             | `node dist-server/server.js` + `/api/health` 200, log boot sạch                                                 |
| `npm run test:e2e`      | (điền kết quả)                                                                                                  |

## Bẫy mới phát hiện trong phiên (đã ghi vào TRAPS.md)

**`node_modules` lệch lockfile làm `typecheck` ĐỎ GIẢ.** Container phiên này có TypeScript
**6.0.2** trong `node_modules` còn lockfile ghim **5.9.3**, sinh lỗi
`TS5101: Option 'baseUrl' is deprecated ... TypeScript 7.0` ở bốn tsconfig. Lỗi này **mời người ta
đi sửa `baseUrl`** — sửa là sai, vì mã nguồn không có vấn đề gì. Cách xử lý đúng: `npm ci` rồi chạy
lại cổng (đúng như CLAUDE.md mục 8 đã dặn, lần này gặp thật).

## Nợ để lại

1. **Vite 8** — ba việc ở mục trên, PR riêng.
2. **Node 26 LTS** — sau 2026-10-28, kèm việc tay trên VPS (`.nvmrc`, `engines`, 5 chỗ
   `node-version: 22` trong `ci.yml`, `docs/deploy-vps-ubuntu.md`, cài Node + `pm2 update`).
3. **Có lint `.cjs` hay không** — flat config mặc định lint cả `.cjs` trong khi cấu hình cũ chạy
   `--ext ts,tsx,js,mjs` nên `.cjs` chưa bao giờ được lint. Tạm để `**/*.cjs` trong `ignores` để
   đợt này không lặng lẽ đổi phạm vi. Quyết ở PR riêng cho
   `commitlint.config.cjs` / `ecosystem.config.cjs`.
4. **ESLint 10** — chờ `eslint-plugin-jsx-a11y` mở peer.
