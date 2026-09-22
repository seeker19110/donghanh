# Đặc tả: Nâng cấp major stack nền (Node · ESLint · Vite · Express)

> Trạng thái: **Draft — chờ chủ dự án chốt** (chưa "Approved for implementation").
> Nền nghiên cứu: phiên tư vấn `/consult` 2026-09-22, mọi phiên bản xác minh bằng nguồn sống
> (`registry.npmjs.org`, `nodejs/Release/schedule.json`) đúng ngày 2026-09-22.

## 0. Một câu

Nâng bốn thành phần stack nền có đường nâng cấp an toàn (Node · ESLint · Vite · Express) theo bốn
PR độc lập, và ghi rõ ba thành phần **cố ý KHÔNG nâng** (React · TypeScript · Tailwind) kèm lý do.

## ① Phạm vi

**LÀM — bốn đợt, mỗi đợt MỘT PR riêng, không gộp:**

| Đợt | Nâng cấp             | Từ → Đến                                                 | Rủi ro     |
| --- | -------------------- | -------------------------------------------------------- | ---------- |
| U1  | Node runtime         | 22 → **26 LTS** (sau 2026-10-28) hoặc 24 LTS nếu cần sớm | Thấp       |
| U2  | ESLint + flat config | 8.57 → **9.39.5**                                        | Trung bình |
| U3  | Vite                 | 7.3.6 → **8.3.0**                                        | Trung bình |
| U4  | Express              | 4.21.2 → **5.2.1**                                       | Trung bình |

**KHÔNG LÀM (quan trọng ngang mục trên):**

- **KHÔNG nâng React 18 → 19.** Lý do: CLAUDE.md mục 6 chốt giữ nguyên; rủi ro hồi quy lan vào
  cổng a11y AAA/AA đang chặn CI (15 trang × 3 theme, dung sai 0). Không có lý do mới phát sinh.
- **KHÔNG nâng TypeScript 5.2 → 7.** TS 7 đổi compiler sang bản native; dự án dùng project
  references `tsc -b` cho 23 gói workspace — hệ sinh thái cần thời gian ổn định. Theo dõi, chưa làm.
- **KHÔNG nâng Tailwind 3 → 4.** CLAUDE.md mục 6 chốt giữ v3. v4 đổi cấu hình sang CSS-first
  `@theme`, phá toàn bộ pipeline token `--a-*`/`--z-*` đang là nguồn sự thật cho tương phản a11y.
- **KHÔNG nâng ESLint lên 10.** Bị chặn cứng: `eslint-plugin-jsx-a11y@6.10.2` (bản mới nhất)
  khai `peerDependencies.eslint: ^3 || … || ^9` — không nhận ESLint 10. jsx-a11y là cổng a11y bắt
  buộc, không bỏ được. Đích là 9.x; xét lại 10 khi jsx-a11y mở peer.
- **KHÔNG đụng** logic nghiệp vụ, prompt AI, schema Postgres, nội dung bài học trong cả bốn đợt.

## ② Điểm chạm

### U1 — Node 22 → 26 LTS

| Việc     | Đường dẫn file              | Ghi chú                                                  |
| -------- | --------------------------- | -------------------------------------------------------- |
| Sửa      | `.nvmrc`                    | `22` → `26`                                              |
| Sửa      | `package.json`              | `engines.node: ">=22"` → `">=26"`                        |
| Sửa      | `.github/workflows/ci.yml`  | **5 chỗ** `node-version: 22` (dòng 39, 60, 75, 120, 234) |
| Sửa      | `docs/deploy-vps-ubuntu.md` | phiên bản Node cài trên VPS                              |
| Việc tay | VPS                         | cài Node mới + `pm2 update`, ngoài phạm vi PR            |

### U2 — ESLint 8 → 9 flat config

| Việc | Đường dẫn file                     | Ghi chú                                                                                                                                                                |
| ---- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Xoá  | `.eslintrc.cjs`                    | thay bằng flat config                                                                                                                                                  |
| Thêm | `eslint.config.js`                 | chuyển nguyên rule set, KHÔNG đổi ý nghĩa rule nào                                                                                                                     |
| Sửa  | `package.json`                     | `eslint ^9.39.5`; `eslint-plugin-react-refresh` `^0.4.26` → `^0.5.7` (bản mới yêu cầu peer `^9 \|\| ^10`); script `lint` bỏ cờ `--ext` (flat config tự quản extension) |
| Kiểm | `.claude/hooks/pre-commit-gate.sh` | hook chạy `lint`, phải còn chạy đúng                                                                                                                                   |

Peer đã xác minh nhận ESLint 9: `@typescript-eslint/* 8.70.1` (`^8.57 || ^9 || ^10`),
`jsx-a11y 6.10.2` (`…|| ^9`), `react-hooks 7.1.1` (`…|| ^9 || ^10`), `eslint-config-prettier
10.1.8` (`>=7`).

### U3 — Vite 7 → 8

| Việc | Đường dẫn file                                 | Ghi chú                                |
| ---- | ---------------------------------------------- | -------------------------------------- |
| Sửa  | `package.json`                                 | `vite ^8.3.0`                          |
| Kiểm | `apps/dhcb/vite.config.ts`, `apps/hub/` config | plugin API + Rollup major có thể đổi   |
| Kiểm | ngân sách bundle (`npm run budget`)            | output build VẪN phải là `dist/` ở gốc |

### U4 — Express 4 → 5

| Việc | Đường dẫn file              | Ghi chú                                                           |
| ---- | --------------------------- | ----------------------------------------------------------------- |
| Sửa  | `package.json`              | `express ^5.2.1`                                                  |
| Rà   | `apps/server/src/routes.ts` | ~100 route — Express 5 đổi `path-to-regexp`, pattern cũ có thể vỡ |
| Rà   | `apps/server/src/server.ts` | middleware xử lý lỗi async đổi hành vi                            |

**Ảnh hưởng lan ra:** chạy `npm run codemap -- impact <file>` cho từng file sửa ở U3/U4 trước khi
mở PR (CLAUDE.md mục 9 — kiểm bằng công cụ, không bằng trí nhớ).

## ③ Hợp đồng dữ liệu

Không có hợp đồng dữ liệu mới. **Bất biến hợp đồng: hành vi quan sát được của app KHÔNG ĐỔI ở cả
bốn đợt.** Nâng cấp hạ tầng, không đổi tính năng.

| Tình huống              | Hành vi mong đợi                               |
| ----------------------- | ---------------------------------------------- |
| Route API bất kỳ sau U4 | cùng status code + cùng body như trước         |
| Build sau U3            | vẫn ra `dist/` ở gốc + `dist-server/server.js` |
| `npm run lint` sau U2   | cùng số vi phạm (0) trên cùng mã nguồn         |

## ④ Tiêu chí chấp nhận

Mỗi đợt PR phải đạt **toàn bộ** các dòng dưới, không dòng nào bỏ:

- [ ] `npm ci` thoát 0 (lockfile đã commit, khớp — TRAPS.md mục 3 biến thể 1)
- [ ] `rm -rf packages/*/dist dist dist-server && npm run typecheck` xanh (tái hiện checkout sạch của CI)
- [ ] `npm run lint` — 0 cảnh báo
- [ ] `npm run test:coverage` xanh, đạt ngưỡng (đây mới là cổng của CI, không phải `npm test`)
- [ ] `npm run build` xanh, `node dist-server/server.js` + `/api/health` trả 200
- [ ] `npm run test:e2e` xanh — gồm `e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts`
- [ ] CI xanh cả 3 required check: `quality` · `e2e` · `metadata`
- [ ] Riêng U2: `npx eslint --print-config apps/dhcb/src/main.tsx` trước/sau cho ra **cùng tập rule đang bật**
- [ ] Riêng U3: `npm run budget` — không tụt ngân sách bundle
- [ ] Riêng U4: smoke thật luồng chính (đăng nhập → chat → STT/TTS) trên server đã build

**Lệnh chứng minh:**

```bash
npm ci
rm -rf packages/*/dist dist dist-server
npm run typecheck && npm run lint && npm run test:coverage && npm run build
npm run test:e2e
npm run budget
```

## ⑤ Bất biến không được phá

| Bất biến                                                       | Test nào canh nó                       |
| -------------------------------------------------------------- | -------------------------------------- |
| A11y AA toàn site, 0 vi phạm, 15 trang × 3 theme               | `e2e/a11y.spec.ts`                     |
| A11y AAA cho nội dung/tiêu đề (tương phản ≥ 7:1)               | `e2e/a11y-aaa.spec.ts`                 |
| Tên job CI `quality` · `e2e` · `metadata` KHÔNG đổi; 4 luật CI | `scripts/ci-workflow-policy.test.ts`   |
| Prompt AI không bị sửa ngoài ý muốn                            | `apps/dhcb/src/prompts/golden.test.ts` |
| Chỉ mục bài học Lập trình khớp registry                        | `lessonsLazy.test.ts`                  |
| Ngân sách bundle + ngưỡng coverage                             | `npm run budget`, cổng coverage CI     |

Bốn đợt này **không thêm test mới** — chúng dựa vào bộ cổng đã có để chứng minh hành vi không đổi.
Đó là lý do phải chạy `test:e2e` đầy đủ ở mỗi đợt, không chỉ unit test.

## ⑥ Quy ước dự án liên quan

- Tiêu đề PR khớp regex `metadata`: dùng `build(...)` hoặc `chore(...)`, scope **chữ thường**
  (vd `build(deps): nâng eslint lên 9 + flat config`). **KHÔNG dùng `feat`** — `feat` đòi đường dẫn
  `docs/specs/...` + cụm "Approved for implementation" trong mô tả.
- Mô tả PR phải có đủ 6 tiêu đề: `## Tóm tắt` · `## Issue / outcome` · `## Research / spec` ·
  `## Validation` · `## Rủi ro, rollout và rollback` · `## Definition of Done`.
- Tạo PR ở trạng thái READY (không nháp), bật auto-merge squash ngay trong vài giây.
- Mỗi đợt kèm **một file changelog mới** `docs/changelog/NNNN-YYYY-MM-DD-slug.md`
  (`npm run changelog` in số kế tiếp), KHÔNG chồng mục vào `PROGRESS.md`.
- Thêm/đổi gói thì phải `npm install` và **commit `package-lock.json`** — CI dùng `npm ci`.

## Thứ tự và lý do

1. **U1 (Node)** trước vì rủi ro thấp nhất và độc lập hoàn toàn. **Đề xuất chờ đến sau
   2026-10-28** rồi nhảy thẳng 22 → 26 LTS: v22 còn hỗ trợ đến 2027-04-30 nên không gấp, còn v24
   rời Active LTS ngày 2026-10-20 — nâng lên 24 bây giờ là nâng vào một dòng sắp hạ cấp.
2. **U2 (ESLint)** vì ESLint 8 đã ngoài vòng hỗ trợ (dist-tag `maintenance` hiện trỏ 9.39.5, tức
   dòng 8 không còn nhận vá). Đây là đợt **đảo một quyết định đã chốt trong CLAUDE.md mục 6** →
   cần ADR riêng ở `docs/adr/` và chủ dự án đồng ý trước.
3. **U3 (Vite)** và **U4 (Express)** sau cùng, không cấp bách, làm khi có thời gian rà kỹ.

## Cần chủ dự án chốt trước khi thi hành

1. U1: chờ Node 26 LTS (2026-10-28) hay nâng 24 ngay?
2. U2: có đồng ý đảo quyết định "giữ ESLint 8 + `.eslintrc.cjs`" không? Nếu có, mở ADR trước.
3. U3/U4: làm đợt này hay để lại backlog?
4. Xác nhận KHÔNG đụng React 18 · TypeScript 5.2 · Tailwind 3.
