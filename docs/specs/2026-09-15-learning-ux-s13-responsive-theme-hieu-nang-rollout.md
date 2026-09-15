# Học tập liền mạch — slice S13: Responsive · theme · hiệu năng · rollout + audit cuối của goal

| Thuộc tính    | Giá trị                                                                                                                                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Goal          | [`learning-ux`](../goals/2026-09-15-learning-ux.md) dòng S13 (dependency: S12) — slice CUỐI, đóng goal                                                                                                                                        |
| Spec nền      | [`2026-09-15-learning-ux-foundation.md`](2026-09-15-learning-ux-foundation.md) §④ D (sáu màn, 5 trạng thái) + §⑥ (body 16–18px, leading 1.5–1.7, 60–75 ký tự/dòng, reduced-motion, không `transition-all`)                                    |
| Spec mẫu      | [`2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md`](2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md) (cấu trúc + độ chi tiết)                                                                                                                     |
| Quy trình     | [`docs/framework/QUY-TRINH-AUDIT.md`](../framework/QUY-TRINH-AUDIT.md) — S13 là MỘT LƯỢT AUDIT TOÀN DIỆN theo quy trình đó, phạm vi = mọi slice S02–S12 của goal, thứ tự chạy 1 → 1b → 2 → 2b → 3 → 4 → 5 → 6 → 6b → 8 → 8b → 9 → 10 → 11 → 7 |
| Base khảo sát | `main` `88778f4` (sau spec S07), khảo sát 2026-09-15 bằng grep/đọc mã thật; mọi số đếm trong file này là số đo, không phải ước lượng                                                                                                          |
| Trạng thái    | **In review** — chờ chủ sản phẩm chốt 6 quyết định ở §7                                                                                                                                                                                       |
| Người duyệt   | Chủ sản phẩm (goal §1: "Completion approver: chủ sản phẩm sau evidence trên main và kiểm tra trải nghiệm")                                                                                                                                    |

> Không bắt đầu code khi trạng thái chưa là **Approved for implementation**. Luật số 1 của khuôn
> `docs/templates/dac-ta-tinh-nang.md`: tiêu chí chấp nhận (§④) viết TRƯỚC giải pháp.
>
> S13 khác mọi slice trước ở một điểm: **sản phẩm chính của nó là BẰNG CHỨNG**, không phải tính
> năng. Nó chỉ sửa mã khi audit tìm ra hồi quy; nếu S07–S12 làm đúng thì PR sửa mã của S13 có thể
> rỗng — và đó là kết quả tốt, không phải dấu hiệu S13 "chưa làm gì".

## 0. Một câu

Chứng minh bằng ảnh, số đo và cổng tự động rằng sáu màn mẫu của goal (Hôm nay → mục lục → màn
học → trợ giảng → kết quả → tiến độ) đúng ở 4 bề rộng (320/390/768/1440), 5 theme và 5 trạng thái
(rỗng/tải/dữ liệu/lỗi/phản hồi), không làm mỏng thêm ngân sách bundle/coverage, đo được Core Web
Vitals trên production, có đường phát hành và lùi cho từng slice có persistence — rồi viết báo cáo
audit 11 tầng để chủ sản phẩm quyết "Goal complete" hay chưa.

## ④ Tiêu chí chấp nhận (đo được — mỗi dòng ghi lệnh/bằng chứng)

Chia 3 PR (§9): **S13-1** công cụ chụp + cổng bố cục (mã, không đổi giao diện) · **S13-2** sửa
hồi quy audit tìm ra (có thể rỗng) · **S13-3** báo cáo audit + cập nhật goal/PROGRESS/tài liệu
điều hành. AC ghi rõ thuộc PR nào.

### S13-1 — công cụ chụp và cổng bố cục (không đổi giao diện)

- [ ] **AC-1 Một nguồn sự thật cho sáu màn mẫu.** `e2e/helpers/learningUxScreens.ts` (mới)
      export `LEARNING_UX_SCREENS: readonly ScreenSpec[]` đúng §③.1 — **đúng 6 phần tử**, `id`
      theo thứ tự `today · outline · lesson · tutor · result · progress`; mỗi màn có `setup` cho
      **đủ 5 trạng thái** (`empty · loading · data · error · feedback`) — trạng thái nào màn đó
      không có thật (vd màn "tiến độ" không có "phản hồi") thì ghi `{ kind: 'n/a', reason }` chứ
      không bỏ khoá. Test canh: `scripts/learning-ux-screens.test.ts` (đặt ở `scripts/` vì `vitest.config.ts:23–29`
      KHÔNG include `e2e/**`, chỉ có `scripts/**/*.test.ts`) — 6 màn, 5 khoá trạng thái/màn,
      route bắt đầu bằng `/`, `id` duy nhất. — `npx vitest run scripts/learning-ux-screens.test.ts`.
- [ ] **AC-2 Script chụp toàn ma trận, chạy được ở máy và trong CI thủ công.**
      `scripts/shots-learning-ux.ts` (mới, `npm run shots:learning-ux`) dùng Playwright API
      (`chromium.launch`) + `mockLogin` thật của `e2e/helpers/auth.ts` (KHÔNG tự gieo
      `localStorage` — bẫy đã ghi ở QUY-TRINH-AUDIT Tầng 8b), chụp `fullPage` ra thư mục **ngoài
      repo** (`SHOT_OUT`, mặc định `/tmp/shots/learning-ux/<phase>/`), tên file
      `<screen>--<state>--<theme>--<w>.png`. Tuỳ chọn thu hẹp: `--screens`, `--states`,
      `--themes`, `--widths`, `--phase before|after`. Chạy đủ ma trận **6 × 5 × 5 × 4 = 600
      ảnh** trong ≤ 10 phút trên máy dev (đo bằng `time`), và in bảng `chiều cao trang (px)` đọc
      từ header PNG (không ước lượng). — `npm run shots:learning-ux -- --phase before` rồi
      `ls /tmp/shots/learning-ux/before | wc -l` = 600 (hoặc số đúng sau khi trừ `n/a`, script
      in số kỳ vọng).
- [ ] **AC-3 Cổng bố cục tự động cho 4 bề rộng — cái CI hiện KHÔNG có ở 768/1440.**
      `e2e/learning-ux-layout.spec.ts` (mới) chạy 6 màn × 4 viewport (320×568 · 390×844 ·
      768×1024 · 1440×900) ở trạng thái `data`, theme mặc định, kiểm 5 phép đo, mỗi phép là một
      `expect` có thông điệp lỗi nói rõ màn + bề rộng:
  1. **không cuộn ngang**: `document.documentElement.scrollWidth <= innerWidth`;
  2. **đúng một `<h1>`** hiển thị (Tầng 8b câu 1 — lỗi lặp tiêu đề của PR #861–#863);
  3. **CTA chính nằm trong màn hình đầu ở 1440** (`boundingBox().y + height <= 900`) — Tầng 8b
     câu 3;
  4. **không có đoạn văn nào dài hơn 80 ký tự/dòng ở ≥ 768** (đo `clientWidth / (font-size ×
0,5)` trên `p` trong `main`, ngưỡng 80 vì spec nền nói "khoảng 60–75") — tối đa **3 vi
     phạm/màn** là ngưỡng khởi điểm đo được, ghi số thật vào changelog;
  5. **chiều cao trang / chiều cao khung nhìn ≤ 4** hoặc có `nav[aria-label]` mục lục/đường tắt
     trong trang (Tầng 8b câu 2).
     Cổng này **nối vào mảnh E2E hiện có** (6 mảnh — `ci.yml:181–221`), KHÔNG tạo job mới. —
     `npx playwright test e2e/learning-ux-layout.spec.ts` = 24/24 xanh; bằng chứng cổng bắt được
     lỗi: tạm chèn `<h1>` thứ hai vào một màn → đúng 4 ca (4 viewport) của màn đó đỏ, dán vào PR.
- [ ] **AC-4 a11y AA + AAA phủ đủ sáu màn ở 5 theme.** Sau S07–S12, mọi route của sáu màn (§③.1)
      có mặt trong `ROUTES` của `e2e/a11y.spec.ts` (hiện 38 dòng route × 5 theme) và
      `e2e/a11y-aaa.spec.ts` (hiện 30 route × 5 theme); route nào thiếu thì S13-1 thêm. —
      `grep -c "<route>" e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts` ≥ 1 cho từng route; hai spec
      xanh 100% (`npx playwright test e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts`).
- [ ] **AC-5 Bốn trạng thái phi-dữ-liệu cũng qua axe.** `e2e/learning-ux-states.spec.ts` (mới)
      chạy axe AA trên **rỗng · tải · lỗi · phản hồi** của sáu màn ở theme `dark-blue` và
      `blue-sky` (một tối, một sáng — hai theme có tương phản khác nhau nhất), 390 và 1440 —
      vì cổng a11y hiện tại chỉ quét màn có dữ liệu mặc định (bẫy đã ghi ở
      `e2e/badge-contrast.spec.ts` dòng 1–6: phần tử chỉ hiện khi có dữ liệu chưa từng được axe
      thấy). — `npx playwright test e2e/learning-ux-states.spec.ts` = 0 vi phạm.
- [ ] **AC-6 Luật CI §11.1 không bị phá.** `scripts/ci-workflow-policy.test.ts` (6 ca) xanh;
      `ci.yml` KHÔNG thêm job mới, KHÔNG đổi tên `quality`/`e2e`, số mảnh giữ 6 **trừ khi đo
      được** mảnh chậm nhất tăng > 20% so với run CI của PR trước S13 (đọc
      `started_at`/`completed_at` của job `E2E shard k/6`) — khi đó tăng lên 7 và ghi số đo vào
      changelog. — `npx vitest run scripts/ci-workflow-policy.test.ts`.
- [ ] **AC-7 Script không làm nặng bundle/coverage.** `scripts/` và `e2e/` nằm ngoài
      `.size-limit.json` (`dist/js/index-*` + 3 vendor) và ngoài coverage `include` — kiểm bằng
      `npm run budget` trước/sau S13-1: 4 dòng ngân sách **không đổi tới 0,01 kB / 0,01 điểm**.

### S13-2 — sửa hồi quy audit tìm ra (có thể rỗng)

- [ ] **AC-8 Ma trận thị giác đạt 4/5 ở cả 5 trục, do HAI người chấm độc lập.** Bảng chấm §③.3
      (6 màn × 5 trục = 30 ô) do (a) agent tự chấm và (b) chủ sản phẩm chấm, mỗi ô kèm **một câu
      lý do trỏ vào ảnh cụ thể** (`<screen>--data--dark-blue--1440.png`…). Ô nào < 4 ở BẤT KỲ
      người chấm nào → là một mục việc của S13-2 (sửa) hoặc nợ ghi PROGRESS có số đo. Điểm cuối =
      điểm của chủ sản phẩm. — bảng nằm trong báo cáo audit (AC-14).
- [ ] **AC-9 320px không vỡ, 5 theme không lộ màu ghi cứng.** Ảnh `*--320.png` của 6 màn: không
      cuộn ngang (AC-3 đã canh), chữ nội dung không bị cắt (`line-clamp`/`break-words` — nhìn
      ảnh). Ở 5 theme: `grep -rnE "bg-(zinc|slate|gray)-(900|950)|text-white" <file 6 màn>` — mọi
      kết quả phải là nền cố định tối có chủ đích (`text-[#fff]`) hoặc token; ghi số dòng khớp và
      lý do từng dòng vào changelog. Màu chữ chỉ từ token `--a-*`/`--z-*`
      (`packages/core-ui/theme.css`: 10 token `--a-*`, 11 token `--z-*`, 5 khối `[data-theme]`
      dòng 23/82/114/146/178).
- [ ] **AC-10 Ngân sách bundle/coverage sau S07–S12 vẫn trong đệm.** `npm run build && npm run
test:coverage && npm run budget`: JS < 95% của 140 kB (mốc cảnh báo Tầng 1; đo 2026-09-14
      sau changelog 0304: **126,07 / 140 kB = 90,06%**), CSS < 95% của 20 kB (đo: **18,11 / 20 kB =
      90,6%**), 4 chỉ số coverage dư ≥ 1 điểm so với sàn THẬT ở `vitest.config.ts:138–143`
      (**93 / 89 / 93 / 93**). Vượt mốc → S13-2 xử lý bằng tách chunk/nạp lười (mẫu: sửa
      `manualChunks` ở changelog 0304), **không nới ngưỡng** — nới ngưỡng là quyết định của chủ
      sản phẩm (§7 Q4).
- [ ] **AC-11 Test không flaky trong phạm vi goal.** Chạy `npm run test:coverage` **3 lượt liên
      tiếp** (Tầng 1b) và `npx playwright test <6 file E2E của S07–S13>` **3 lượt**: 3/3 xanh cùng
      số test. Lượt đỏ → chạy riêng file ≥ 5 lượt, ghi cơ chế + tỉ lệ; flake có sẵn đã biết
      (`apps/dhcb/src/lib/programmingSrs.test.ts`, PROGRESS "Nợ kỹ thuật") **không tính là hồi
      quy của goal** nhưng phải ghi vào báo cáo.
- [ ] **AC-12 Reduced-motion và không thêm `transition-all`.** Với các file 6 màn chạm tới ở
      S04–S12: `grep -rln "transition-all" <danh sách file>` = **0 file mới** so với `main` trước
      S04 (toàn repo hiện có 75 file `.tsx` dùng `transition-all` — nợ cũ, KHÔNG dọn trong S13);
      chạy `page.emulateMedia({ reducedMotion: 'reduce' })` trên 6 màn trong
      `learning-ux-layout.spec.ts`: không phần tử nào còn `animation-duration` > 0 (khối
      reduced-motion toàn cục ở `apps/dhcb/src/index.css:370`).

### S13-3 — báo cáo audit + cập nhật goal

- [ ] **AC-13 Core Web Vitals đo THẬT trên production, 3 trang × 3 lượt.** Từ máy có mạng tới
      `https://en-vi.donghanhcungban.org` (container của phiên AI **bị proxy chặn** — nợ Tầng 8
      mở từ 2026-08-25, PROGRESS dòng 1032–1039), chạy `npm run cwv:prod` (script mới
      `scripts/lighthouse-cwv.sh`, §③.4) trên **Hôm nay · một màn học · tiến độ**, mobile
      emulation, 3 lượt/trang, lấy **median**: LCP ≤ 2,5 s · INP (Lighthouse báo TBT làm proxy,
      ghi rõ) ≤ 200 ms · CLS ≤ 0,1. Kết quả dán nguyên bảng vào báo cáo; trang vượt ngưỡng → nợ
      PROGRESS có số. Không chạy được (không có máy có mạng) → ghi "N/A + lý do", **không** kết
      luận "Goal complete" (§7 Q2).
- [ ] **AC-14 Báo cáo audit theo đúng mẫu §3 QUY-TRINH-AUDIT.** File mới
      `docs/audit/2026-MM-DD-learning-ux-audit-cuoi.md` (thư mục `docs/audit/` đã có 7 báo cáo
      cùng khuôn) có đủ 13 khối `TẦNG 1 … TẦNG 11` + `Quét scripts/tính năng` + `ĐÃ RÀ VÀ KHÔNG
CÓ LỖI` + `PHÂN LOẠI VIỆC`, **không khối nào để trống** (chưa kiểm được thì ghi "N/A — lý
      do"), kèm bảng chấm AC-8 và bảng CWV AC-13. — `grep -c "^TẦNG" <file>` = 13.
- [ ] **AC-15 Tầng 9 vận hành production có số.** Sau lần deploy cuối của goal: Sentry 0 lỗi mới
      chưa xem xét (7 ngày), `pm2 list` restart count không tăng bất thường (so với số trước
      deploy), ổ đĩa còn ≥ 20%, `curl /api/health` + `/api/health/deep` đúng theo
      `docs/DEPLOY.md` §6 (4 mục checklist). Cần SSH — người dùng chạy hoặc cấp quyền; không có →
      "N/A + lý do".
- [ ] **AC-16 Tài liệu điều hành nói đúng thực tế (Tầng 6b) — bao gồm lỗi ĐÃ TÌM THẤY khi khảo
      sát spec này.** Sàn coverage thật là **93/89/93/93** (`vitest.config.ts:138–143`, hiệu
      chuẩn lại 2026-09-08 khi lên Vitest 5), nhưng `CLAUDE.md:310` ("coverage 97/93/96/97"),
      `PROGRESS.md:945` và spec S07 §⑤ vẫn ghi 97/93/96/97. S13-3 sửa **cả ba** về số thật kèm
      ngày hiệu chuẩn; kiểm mọi đường dẫn trong 4 spec của goal còn sống (`grep -oE
"(apps|packages|docs|scripts|e2e)/[A-Za-z0-9_./*-]+" <spec> | sort -u | xargs ls`); hook
      `.claude/report-status.sh` không còn khẳng định lỗi thời.
- [ ] **AC-17 Goal đóng đúng luật.** `docs/goals/2026-09-15-learning-ux.md` §7 "Final audit":
      8 ô tick **chỉ khi có bằng chứng dẫn link** (PR/changelog/báo cáo audit); §3 bảng slice S13
      có PR/State/Evidence; §5 "Current truth" ghi commit `main` cuối; kết luận `COMPLETE` chỉ
      khi **AC-8, AC-10, AC-13, AC-15 đều không phải N/A** và chủ sản phẩm ký tên/ngày. Nợ còn mở
      → mỗi nợ một dòng ở `PROGRESS.md` "Nợ kỹ thuật còn mở" **có số đo và điều kiện gỡ**, không
      có dòng "cần xem lại".

**Lệnh chứng minh (chạy trên checkout sạch, `npm ci` trước lần đầu):**

```bash
rm -rf packages/*/dist dist dist-server && npm ci
npm run typecheck && npm run lint && npm run format:check && npm run build
npm run test:coverage && npm run budget                     # AC-7, AC-10
npx vitest run scripts/learning-ux-screens.test.ts scripts/ci-workflow-policy.test.ts   # AC-1, AC-6
npx playwright test e2e/learning-ux-layout.spec.ts e2e/learning-ux-states.spec.ts \
  e2e/a11y.spec.ts e2e/a11y-aaa.spec.ts e2e/mobile-layout-guards.spec.ts          # AC-3..5, AC-12
npm run shots:learning-ux -- --phase before && npm run shots:learning-ux -- --phase after   # AC-2, AC-8
for i in 1 2 3; do npm run test:coverage || echo "LƯỢT $i ĐỎ"; done               # AC-11
npm run cwv:prod            # AC-13 — CHỈ từ máy có mạng tới production
npm run codemap -- impact <từng file S13-2 sửa>                                   # §9
```

## ① Phạm vi

**LÀM (theo PR):**

**S13-1 — công cụ (mã ngoài bundle, không đổi giao diện):**

1. `e2e/helpers/learningUxScreens.ts` + test `scripts/learning-ux-screens.test.ts` — ma trận 6 màn × 5 trạng thái (§③.1), dùng chung
   cho script chụp và hai E2E mới. Setup trạng thái bằng `page.route('**/api/…')` + helper có sẵn
   (`mockLogin`, `mockDomainApis`, `muteTts`, `freezeAnimations`, `waitForStableDom`).
2. `scripts/shots-learning-ux.ts` + script npm `shots:learning-ux` — chụp ma trận, in bảng chiều
   cao trang đọc từ header PNG, ghi `manifest.json` (tên ảnh → chiều cao, md5) để so trước/sau
   bằng máy (khuôn PR #923: ảnh 1440 giống hệt từng điểm ảnh theo md5).
3. `e2e/learning-ux-layout.spec.ts` (24 ca) và `e2e/learning-ux-states.spec.ts` — nối vào 6
   mảnh E2E hiện có.
4. Bổ sung route sáu màn vào `ROUTES` của `a11y.spec.ts`/`a11y-aaa.spec.ts` nếu S07–S12 chưa thêm;
   thêm route màn học/mục lục vào `e2e/mobile-layout-guards.spec.ts` (hiện 13 route, 2 viewport)
   nếu chưa có.
5. `scripts/lighthouse-cwv.sh` + script npm `cwv:prod` (§③.4) — chạy tay từ máy có mạng.

**S13-2 — sửa hồi quy (phạm vi ĐÓNG: chỉ những gì báo cáo audit liệt kê):** mỗi mục sửa trỏ
về một dòng AC hoặc một ô < 4/5; mỗi mục có ảnh trước/sau + số đo; file sửa chạy
`npm run codemap -- impact`.

**S13-3 — tài liệu:** báo cáo `docs/audit/…`, changelog `docs/changelog/03xx-*.md` (số kế tiếp
lúc tạo PR: `npm run changelog`), goal §3/§5/§7, PROGRESS "Tiếp theo" + "Nợ kỹ thuật còn mở",
sửa lỗi Tầng 6b (AC-16), đổi trạng thái spec này.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- KHÔNG nâng dependency lớn: không cài `@lhci/cli`, `lighthouse` vào `package.json`, không nâng
  Playwright/Vitest/React/TS/Tailwind/ESLint (CLAUDE.md §6 "GIỮ NGUYÊN PHIÊN BẢN"). Lighthouse chạy
  qua `npx --yes lighthouse@<phiên bản ghim trong script>` từ máy có mạng, không vào lockfile.
- KHÔNG thêm job CI mới, KHÔNG đổi tên `quality`/`e2e`, KHÔNG bỏ chia mảnh, KHÔNG upload
  artifact khi xanh (CLAUDE.md §11.1 — `scripts/ci-workflow-policy.test.ts` canh). Lighthouse
  **không** thành cổng CI trong S13 (§7 Q2).
- KHÔNG commit ảnh PNG vào repo (repo hiện có **0** file PNG trong `docs/`; `playwright-report/`
  và `test-results/` đã trong `.gitignore`). KHÔNG dùng `toHaveScreenshot` với baseline commit
  (§7 Q1).
- KHÔNG đổi font toàn app, KHÔNG 3D/WebGL, KHÔNG đổi token/theme (`packages/core-ui/theme.css`,
  `packages/core-ui/theme.ts` 5 theme + `kid` tách khỏi cycle) trừ khi một ô AC-9 chứng minh
  màu ghi cứng — khi đó sửa **tại chỗ dùng**, không thêm token.
- KHÔNG xây cơ chế feature flag rollout mới. `FeatureGate` (`apps/dhcb/src/components/FeatureGate.tsx`)
  là **khoá theo GÓI** do admin bật/tắt qua `/api/plan-features` (`featureKey` `chat` · `writing` ·
  `speaking` · `learning_path` ở `App.tsx:727–775`), không phải cờ phát hành theo %; tái dùng nó
  cho mục lục/Hôm nay là dùng sai nghĩa (§7 Q5).
- KHÔNG deploy, KHÔNG SSH, KHÔNG đọc Sentry/PM2 khi chưa có quyền; KHÔNG dùng production data
  hay provider có phí trong test (goal "Budget/guardrails").
- KHÔNG dọn 75 file `transition-all` có sẵn, KHÔNG sửa nhãn hoạt ảnh STEM 390px (nợ 0309),
  KHÔNG sửa flake `programmingSrs.test.ts` — ba nợ cũ ngoài phạm vi goal, chỉ **ghi lại** trong
  báo cáo.
- KHÔNG nới `.size-limit.json` (140 kB / 20 kB) hay hạ sàn coverage; KHÔNG siết sàn coverage
  trong S13 (siết là đợt riêng có số đo ổn định ≥ 3 lượt).
- KHÔNG đụng billing/entitlement/guest limits/schema; S13 **không có migration**.

## ② Điểm chạm (đã khảo sát thật trên `88778f4`)

| PR  | Việc | Đường dẫn file                                                                                                                                      | Ghi chú khảo sát                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Thêm | `e2e/helpers/learningUxScreens.ts` + `scripts/learning-ux-screens.test.ts`                                                                          | Cạnh `auth.ts` (`mockLogin(page, uiLang, theme?)`, `ThemeName` 5 giá trị), `axe.ts` (`freezeAnimations`, `waitForStableDom`), `domains.ts` (`mockDomainApis`), `tts.ts` (`muteTts`). Vitest KHÔNG include `e2e/**` (`vitest.config.ts:23–29`) nên test đặt ở `scripts/` như `ci-workflow-policy.test.ts`; `tsconfig.e2e.json` include `e2e` + `playwright.config.ts` — kiểm `scripts/` được tsconfig nào bao trước khi import chéo. |
| 1   | Thêm | `scripts/shots-learning-ux.ts`                                                                                                                      | Cùng chỗ `check-budget-margin.ts`, `check-lesson-chunks.ts`, `codemap.ts`; chạy bằng `tsx`. Import `e2e/helpers/*` — kiểm `tsconfig.e2e.json` có bao `scripts/` không; nếu không thì thêm `include`.                                                                                                                                                                                                                                |
| 1   | Thêm | `scripts/lighthouse-cwv.sh`                                                                                                                         | Shell, không dependency; ghim `lighthouse@<ver>` qua `npx --yes`.                                                                                                                                                                                                                                                                                                                                                                   |
| 1   | Thêm | `e2e/learning-ux-layout.spec.ts`, `e2e/learning-ux-states.spec.ts`                                                                                  | Playwright `testDir: './e2e'`, `fullyParallel`, `workers: 2` trong CI, `retries: 1` trong CI; tổng hiện **784 test / 35 file**; 6 mảnh (`ci.yml:181–221`).                                                                                                                                                                                                                                                                          |
| 1   | Sửa  | `e2e/a11y.spec.ts` (38 route), `e2e/a11y-aaa.spec.ts` (30 route), `e2e/mobile-layout-guards.spec.ts` (13 route × 390/320)                           | Chỉ THÊM route vào mảng, không đổi cách quét.                                                                                                                                                                                                                                                                                                                                                                                       |
| 1   | Sửa  | `package.json` scripts                                                                                                                              | Thêm `shots:learning-ux`, `cwv:prod`. Không thêm dependency.                                                                                                                                                                                                                                                                                                                                                                        |
| 2   | Sửa  | (danh sách do báo cáo audit quyết) — dự kiến trong `apps/dhcb/src/pages/**` 6 màn, `packages/core-ui/*`                                             | Chạy `npm run codemap -- impact <file>` từng file; hotspot đo 2026-09-15: `Layout.tsx` 64 file import, `core-contracts/shared.ts` 62 — sửa hai file này là rủi ro cao nhất trong phạm vi UI.                                                                                                                                                                                                                                        |
| 3   | Thêm | `docs/audit/2026-MM-DD-learning-ux-audit-cuoi.md`, `docs/changelog/03xx-*.md`                                                                       | Khuôn báo cáo §3 QUY-TRINH-AUDIT.                                                                                                                                                                                                                                                                                                                                                                                                   |
| 3   | Sửa  | `docs/goals/2026-09-15-learning-ux.md` §3/§5/§7, `PROGRESS.md`, `CLAUDE.md:310`, spec S07 §⑤                                                        | AC-16, AC-17.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| —   | Đọc  | `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `scripts/deploy.sh`, `docs/DEPLOY.md` §5–6, `docs/rollback-runbook.md` "Rollback chung" | Rollout thật: push `main` → `deploy.yml` (concurrency `deploy-vps`, xếp hàng) → SSH `scripts/deploy.sh` (`git reset --hard`, `npm run migrate:pg`, build, PM2 reload, health check). Rollback = `git revert` + push.                                                                                                                                                                                                                |

**Ảnh hưởng lan ra (theo codemap, đo 2026-09-15):** S13-1 chỉ thêm file ở `e2e/`/`scripts/` —
không file nào trong `apps/`/`packages/` import chúng → impact = 0 (kiểm lại bằng
`npm run codemap -- orphans` không liệt kê file mới là hợp lý vì `scripts/` là điểm vào). S13-2
lan theo từng file sửa; điểm chạm chung nhiều nhất trong 6 màn: `apps/dhcb/src/components/Layout.tsx`
(64 file import) — nếu phải sửa, chạy lại `a11y.spec.ts` + `mobile-layout-guards.spec.ts` toàn bộ.

## ③ Hợp đồng

### 3.1 Ma trận sáu màn × năm trạng thái (`e2e/helpers/learningUxScreens.ts`)

```ts
import type { Page } from '@playwright/test'

export type ScreenId = 'today' | 'outline' | 'lesson' | 'tutor' | 'result' | 'progress'
export type StateId = 'empty' | 'loading' | 'data' | 'error' | 'feedback'
export type Width = 320 | 390 | 768 | 1440
export const WIDTHS: readonly Width[] = [320, 390, 768, 1440]
export const HEIGHTS: Record<Width, number> = { 320: 568, 390: 844, 768: 1024, 1440: 900 }

/** Cách dựng một trạng thái. `n/a` = màn này KHÔNG có trạng thái đó (phải ghi lý do). */
export type StateSetup =
  | { kind: 'route'; install: (page: Page) => Promise<void> } // page.route mock API
  | { kind: 'action'; install: (page: Page) => Promise<void> } // thao tác sau khi trang nạp (feedback)
  | { kind: 'n/a'; reason: string }

export type ScreenSpec = {
  id: ScreenId
  /** Route CHUẨN (khuôn `<mã>--<slug>` nếu có tham số nội dung — CLAUDE.md §7). */
  route: string
  /** Selector CTA chính — dùng cho phép đo "trong màn hình đầu ở 1440". */
  primaryCta: string
  states: Record<StateId, StateSetup>
  /** Route lấy từ spec slice nào — để audit Tầng 6b tra được. */
  source: 'S06' | 'S07' | 'S08' | 'S10' | 'S11' | 'S12'
}

export const LEARNING_UX_SCREENS: readonly ScreenSpec[] // đúng 6 phần tử, thứ tự cố định
```

Route dự kiến (**chốt lại khi spec S06/S10/S11 Approved** — cột `source` bắt buộc trỏ đúng spec;
S13 không tự quyết route). Spec slice đã có bản nháp trên đĩa lúc khảo sát:
`2026-09-15-learning-ux-s10-tro-giang-trong-bai-voice.md` ·
`2026-09-15-learning-ux-s11-completion-evidence.md` ·
`2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md` (cùng thư mục `docs/specs/`) — S13-1 đọc
route cuối từ đó, không từ bảng dưới:

| `id`       | Route hiện có gần nhất trên `main` (khảo sát)                                                                                                        | Slice quyết route cuối |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `today`    | `/` (Home) — "Hôm nay" là S06                                                                                                                        | S06                    |
| `outline`  | `/lap-trinh/khoa-hoc/git--git-github-thuc-hanh` (khoá ngắn, có `OutlinePane` sau S07-2) hoặc `/goc-hoc-tap/physics/bai-hoc`                          | S07                    |
| `lesson`   | `/lap-trinh/bai-hoc/p1-u4-l1` và `/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do` (2 môn — chọn 1 làm mẫu chính, môn kia chụp thêm ở `data`) | S08                    |
| `tutor`    | trợ giảng trong bài (S10) — hiện chỉ có `/ban-dong-hanh`                                                                                             | S10                    |
| `result`   | màn kết quả sau hoạt động (S11) — chưa có route                                                                                                      | S11                    |
| `progress` | `/tien-do`                                                                                                                                           | S12                    |

### 3.2 Script chụp (`scripts/shots-learning-ux.ts`)

```
npm run shots:learning-ux -- [--phase before|after] [--screens a,b] [--states x,y]
                             [--themes t1,t2] [--widths 390,1440] [--out DIR]
```

- Vào: cờ CLI trên + `SHOT_OUT` (env, mặc định `/tmp/shots/learning-ux`), `PORT` Vite dev (tự
  khởi động `npm run dev -- --port <PORT> --strictPort` như `playwright.config.ts:35–37`, hoặc
  nhận `BASE_URL` có sẵn).
- Ra: `DIR/<phase>/<screen>--<state>--<theme>--<w>.png` + `DIR/<phase>/manifest.json`:
  ```ts
  type ShotManifest = {
    phase: 'before' | 'after'
    commit: string // git rev-parse HEAD
    generatedAt: string // ISO UTC
    shots: Array<{
      file: string
      screen: ScreenId
      state: StateId
      theme: ThemeName
      width: Width
      pageHeightPx: number // đọc từ header PNG (struct.unpack '>II' byte 16–24)
      md5: string
    }>
    skipped: Array<{ screen: ScreenId; state: StateId; reason: string }> // các ô n/a
  }
  ```
- stdout: bảng `screen | state | theme | w | height | md5(8)` và dòng tổng `N ảnh, M bỏ qua`;
  exit 1 nếu có ảnh không chụp được (timeout/route lỗi), in tên ô lỗi.
- So trước/sau: `npx tsx scripts/shots-learning-ux.ts --diff before after` in các ô md5 khác nhau
  - chênh chiều cao — đây là **số đo** dán vào PR (Tầng 8b: "số đo là bằng chứng, 'trông đẹp hơn'
    thì không").

### 3.3 Bảng chấm 5 trục (nằm trong báo cáo audit)

| Màn (`id`) | Phân cấp | Typography | Bố cục | Nhất quán | Hoàn thiện | Ảnh dẫn chứng               | Người chấm  |
| ---------- | -------- | ---------- | ------ | --------- | ---------- | --------------------------- | ----------- |
| `today`    | 1–5      | 1–5        | 1–5    | 1–5       | 1–5        | `today--data--dark-blue--…` | agent / CSP |

Định nghĩa thang (để hai người chấm cùng thước): **5** = không có gì phải sửa; **4** = có ≤ 1 điểm
nhỏ, không cản việc học; **3** = có ≥ 1 điểm khiến người học phải dừng/tìm; **≤ 2** = sai luật
spec nền (§⑥: body 16–18px, leading 1.5–1.7, 60–75 ký tự/dòng, một CTA chính/vùng). Trục
**Typography** chấm bằng số đo từ AC-3 phép 4 (ký tự/dòng) + `getComputedStyle` font-size/line-height
của `p` trong `main` (script in kèm); trục còn lại chấm bằng mắt trên ảnh.

### 3.4 Đo CWV (`scripts/lighthouse-cwv.sh`)

```
npm run cwv:prod -- [BASE_URL=https://en-vi.donghanhcungban.org] [RUNS=3]
```

- Chạy `npx --yes lighthouse@<ghim> <url> --preset=mobile --only-categories=performance
--output=json --chrome-flags="--headless=new"` cho 3 URL (§③.1: `today`, `lesson`, `progress`),
  `RUNS` lượt mỗi URL; in bảng median `LCP (s) | TBT (ms, proxy INP) | CLS` + `pass/fail` theo
  2,5 / 200 / 0,1; exit 1 nếu có ô fail (để dán nguyên).
- Ghi rõ trong output: **Lighthouse lab không đo INP thật** (INP là chỉ số field); TBT là proxy.
  Đo INP field cần `web-vitals` gửi Sentry — repo hiện **không có** (`grep web-vitals|onLCP|onINP`
  = 0 kết quả; `errorTracking.ts:31` `tracesSampleRate: 0` có chủ đích) — là §7 Q3.

### 3.5 Ca lỗi (là hợp đồng)

| Tình huống                                               | Hành vi mong đợi                                                                                                           |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Route của một màn chưa tồn tại (S10/S11 chưa merge)      | `learningUxScreens.ts` KHÔNG được ghi route đoán; script/E2E bỏ qua màn đó với `reason` và **AC-8 chưa thể đạt** → S13 chờ |
| `mockLogin` đổi chữ ký ở slice trước                     | Test `learning-ux-screens.test.ts` + E2E đỏ ở bước setup, thông điệp nêu helper — sửa helper dùng, không tự gieo storage   |
| Ảnh chụp trắng/màn đăng nhập                             | Script kiểm `pageHeightPx < 400` hoặc có `form[action*="login"]` → đánh dấu lỗi, exit 1 (bẫy Tầng 8b đã dính)              |
| Lighthouse không tới được production (proxy 403 CONNECT) | Script in "N/A — <lỗi mạng>" + exit 2 (khác exit 1 = vượt ngưỡng); báo cáo ghi N/A, goal không COMPLETE                    |
| E2E mới làm mảnh chậm nhất tăng > 20%                    | AC-6: tăng lên 7 mảnh, ghi số đo `started_at/completed_at` vào changelog; không bỏ test                                    |
| Coverage/bundle vượt mốc 95% sau S07–S12                 | AC-10: S13-2 tách chunk/thêm test; KHÔNG nới ngưỡng; nếu không kịp → nợ PROGRESS có số + goal không COMPLETE               |
| Chủ sản phẩm chấm < 4 ở ô agent chấm ≥ 4                 | Điểm chủ sản phẩm thắng; ô đó thành mục S13-2 hoặc nợ có số đo                                                             |

## ⑤ Bất biến không được phá

| Bất biến                                                                                      | Test canh                                                                                                                             |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| CI: job con nối vào `quality`/`e2e`; tên hai job bất biến; E2E chia mảnh; artifact chỉ khi đỏ | `scripts/ci-workflow-policy.test.ts` (6 ca)                                                                                           |
| a11y AA 0 vi phạm mọi mức, AAA cho nội dung/tiêu đề, 5 theme                                  | `e2e/a11y.spec.ts`, `e2e/a11y-aaa.spec.ts`, `e2e/badge-contrast.spec.ts`, `e2e/skip-link.spec.ts`                                     |
| Mobile 390/320: lề dưới ≥ bottom nav, CTA bấm được                                            | `e2e/mobile-layout-guards.spec.ts` (+ route S13 thêm)                                                                                 |
| 4 bề rộng: không cuộn ngang, một `<h1>`, CTA trong màn đầu 1440                               | `e2e/learning-ux-layout.spec.ts` (mới, AC-3)                                                                                          |
| Ngân sách bundle 140/20 kB và sàn coverage 93/89/93/93 không nới                              | `.size-limit.json` (job `build` chạy `npm run size` + `size:chunks`), `vitest.config.ts` thresholds (job `unit`)                      |
| Không PNG/binary trong repo                                                                   | `git diff --stat` không có `Bin` ở PR S13 (CLAUDE.md §8); kiểm `find docs e2e scripts -name '*.png' \| wc -l` = 0                     |
| Không import chu trình, `packages/` không import `apps/`                                      | job `audit` (`codemap -- cycles`), ESLint rule sẵn có                                                                                 |
| Không dependency mới                                                                          | `git diff main -- package.json package-lock.json` chỉ đổi `scripts`                                                                   |
| Luật khoá/entitlement/guest limits/schema không đổi                                           | không có migration mới (`ls postgres/migrations` vẫn dừng ở `0080_*`), test billing/lock hiện có xanh                                 |
| Không mất nháp/tiến độ khi phát hành S08–S12 (rollback giữ dữ liệu)                           | test S09/S11 (version/idempotency) xanh trên `main` sau merge; §8 rollback = revert code, GIỮ bảng (quy ước migration README dòng 66) |

## ⑥ Quy ước dự án liên quan (bên thi hành không thấy hội thoại)

- Bốn bề rộng chuẩn: **320×568 · 390×844 · 768×1024 · 1440×900**; Tầng 8b bắt buộc 1440 + 390
  fullPage trước/sau, mở ảnh ra nhìn, trả lời 4 câu (lặp chữ · chiều cao trang · mảng trống ·
  390 trước/sau khớp). Đo chiều cao bằng header PNG, không ước lượng.
- Không tự gieo `localStorage` để giả đăng nhập — dùng `mockLogin(page, 'vi', theme)` ở
  `e2e/helpers/auth.ts`; trang gọi API thì `page.route('**/api/…')` đúng hình dạng đáp ứng.
- 5 theme: `dark-blue` (mặc định) · `blue-sky` · `pink` · `vibrant` · `kid` (`kid` tách khỏi
  cycle `ThemeToggle` — `packages/core-ui/theme.ts:19–21`). Màu từ token `--a-*`/`--z-*`
  (`packages/core-ui/theme.css`, `apps/dhcb/tailwind.config.js` map 12 `var(--a-…)`); `text-white`
  bị đảo ở theme sáng → nền cố định tối dùng `text-[#fff]`.
- Chữ nội dung AAA ≥ 7:1, điều khiển AA ≥ 4,5:1; vùng chạm ≥ 44px; body 16–18px, leading
  1.5–1.7, 60–75 ký tự/dòng; reduced-motion toàn cục (`index.css:370`); không thêm `transition-all`.
- CI: cổng test là `npm run test:coverage` (không phải `npm test`); trước push cuối
  `rm -rf packages/*/dist dist dist-server` rồi chạy lại typecheck; `npm ci` khớp lockfile.
- E2E mới đặt trong `e2e/`, tự động vào 6 mảnh; không thêm job; artifact chỉ khi đỏ.
- Rollout thật: merge `main` = deploy tự động (`deploy.yml` → `scripts/deploy.sh`, migration tự
  áp). Rollback: `git revert <sha>` + push (`docs/rollback-runbook.md` "Rollback chung"); cấm
  `reset --hard` + force-push `main`. Checklist sau deploy: `docs/DEPLOY.md` §6 (health, health/deep,
  PM2 online, đăng nhập + chat thử).
- PR: S13-1 là `test(learning): …` hoặc `chore(learning): …` (không có tính năng người dùng thấy);
  S13-2 `fix(learning): …`; S13-3 `docs(learning): …`. Nếu dùng `feat(` phải dẫn file này +
  "Approved for implementation". Đủ 6 tiêu đề cổng `metadata`; READY; bật auto-merge (squash)
  ngay sau tạo; CI đỏ là việc của PR.
- Changelog một file mới `docs/changelog/NNNN-YYYY-MM-DD-slug.md` (`npm run changelog` in số);
  PROGRESS sửa tại chỗ; nợ mở phải có số đo + điều kiện gỡ.

## 7. Quyết định cần chủ sản phẩm chốt trước khi Approved

| #   | Câu hỏi                                                                                                                 | Đề xuất của AI (mặc định nếu không có ý kiến khác)                                                                                                                                                                                                  | Lý do                                                                                                                                                                                                                                                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Ảnh chụp: script `scripts/shots-learning-ux.ts` xuất ra ngoài repo, hay E2E `toHaveScreenshot` với baseline PNG commit? | **Script + manifest md5/chiều cao, KHÔNG commit PNG.** Cổng tự động chỉ giữ 5 phép đo hình học (AC-3), không so ảnh.                                                                                                                                | 600 ảnh fullPage × mỗi lần đổi UI = repo phình không hồi phục; so ảnh pixel giữa máy dev/CI (font, GPU) là nguồn flake kinh điển; repo đang giữ kỷ luật 0 PNG. Bằng chứng đã dùng thật ở #923 là md5 + số đo, đủ thuyết phục.                                                                                                                     |
| Q2  | CWV: thêm Lighthouse CI thành job/cổng, hay đo tay trên production và ghi báo cáo?                                      | **Đo tay bằng `npm run cwv:prod` từ máy có mạng, 3 trang × 3 lượt, dán bảng; KHÔNG là cổng CI.** Goal KHÔNG được COMPLETE khi ô này N/A.                                                                                                            | PROGRESS dòng 669 đã quyết "size-limit thay Lighthouse CI" vì Lighthouse không đo được trong môi trường CI/container; đo `vite preview` trên runner GitHub không phải số production; thêm job = thêm ~1–2 phút đường tới hạn (§11.1) và dependency lớn. Nợ Tầng 8 mở từ 2026-08-25 chỉ gỡ được bằng máy có mạng — nói thẳng hơn là dựng cổng giả. |
| Q3  | Có thêm `web-vitals` (≈2 kB brotli) gửi LCP/INP/CLS field lên Sentry (đổi `tracesSampleRate: 0`) trong S13 không?       | **Không trong S13.** Ghi thành nợ "đo field" có điều kiện gỡ: khi có ≥ 100 người dùng thật/tuần (goal §1 "baseline production chưa đo").                                                                                                            | Bật tracing Sentry là quyết định chi phí quota + đụng chính sách đã ghi ở `errorTracking.ts:11`; bundle JS đang 90% ngân sách, thêm 2 kB là 1,4% nữa. S13 là audit, không phải nơi mở kênh telemetry mới.                                                                                                                                         |
| Q4  | Ngân sách bundle/coverage: giữ nguyên 140/20 kB và sàn 93/89/93/93 xuyên S13; vượt thì sửa mã hay nới?                  | **Giữ nguyên; vượt thì S13-2 tách chunk/thêm test; nới ngưỡng chỉ khi chủ sản phẩm chốt riêng, có bảng số đo 3 lượt.**                                                                                                                              | Lịch sử: CSS nới 18→20 (2026-09-02) sau khi đo; JS từng 99,7% và được kéo về 90% bằng sửa `manualChunks` (0304) chứ không nới. Nới trong slice audit làm mất ý nghĩa của audit.                                                                                                                                                                   |
| Q5  | Rollout: có cần cờ phát hành (bật dần mục lục/Hôm nay theo %) hay phát hành tuần tự theo PR + revert?                   | **Tuần tự theo PR, rollback = `git revert`; không xây feature flag.** Slice có persistence (S09 sync, S11 evidence): rollback = revert code, GIỮ bảng/cột (không `drop`), dữ liệu additive; ghi sẵn lệnh revert trong changelog của chính slice đó. | Repo không có cơ chế cờ theo % (`FeatureGate` là khoá theo gói, admin bật/tắt cho Free/VIP — dùng nó làm cờ rollout sẽ khoá nhầm người trả phí); deploy là push-to-main tự động, mỗi PR là một đơn vị lùi được. Quy ước migration (README dòng 66, 0044) đã là "gỡ code, giữ bảng".                                                               |
| Q6  | Ai chấm 5 trục và ai ký "Goal complete"?                                                                                | **Agent tự chấm trước (kèm lý do/ảnh) → chủ sản phẩm chấm độc lập → điểm chủ sản phẩm là điểm cuối; chủ sản phẩm ký goal §7.** Ô nào chủ sản phẩm chưa chấm → goal `NOT COMPLETE`.                                                                  | Goal §1 ghi rõ "Completion approver: chủ sản phẩm sau evidence trên main và kiểm tra trải nghiệm; không gọi goal complete khi mới viết spec hoặc tạo PR". Hai người chấm độc lập để tránh agent vừa làm vừa chấm.                                                                                                                                 |

## 8. Rủi ro và giảm thiểu

| Rủi ro                                                                                              | Giảm thiểu                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route `tutor`/`result` chưa tồn tại lúc S13 bắt đầu (S10/S11 trượt)                                 | §③.5: không đoán route; S13-1 vẫn merge được (4 màn), AC-8/AC-17 chờ; ghi rõ trong goal §5 "Current truth".                                                                                                   |
| 600 ảnh không ai nhìn hết → Tầng 8b thành hình thức                                                 | Nhìn theo tầng: **18 ảnh bắt buộc** (6 màn × 390/768/1440 × `data` × `dark-blue`) mở từng ảnh; 5 theme và 320 xem qua **contact sheet** do script ghép (một PNG/ màn, ngoài repo); trạng thái xem 390 + 1440. |
| E2E mới (24 + ~48 ca) kéo dài mảnh chậm nhất                                                        | AC-6 đo `started_at/completed_at`; `learning-ux-states` chỉ 2 theme × 2 bề rộng; dùng `waitForStableDom` thay `waitForTimeout`.                                                                               |
| Cổng "≤ 80 ký tự/dòng" báo sai vì đo gần đúng (0,5 em/ký tự)                                        | Ngưỡng khởi điểm nới (80, ≤ 3 vi phạm/màn) + ghi số thật vào changelog; siết sau khi có 2 lượt số ổn định. Cổng mới đỏ trên mã cũ trước khi sửa là bằng chứng nó đo được (khuôn #923).                        |
| Máy có mạng đo CWV cho số khác nhau giữa các lượt                                                   | 3 lượt/trang lấy median; ghi phiên bản Lighthouse ghim + thời điểm UTC + tải server (`pm2 list` nếu có).                                                                                                      |
| Sửa `Layout.tsx` (64 file import) trong S13-2 vì một ô < 4/5                                        | `codemap -- impact` trước; chạy lại toàn bộ a11y + mobile guards; ảnh 390 trước/sau md5 cho ≥ 3 trang ngoài phạm vi goal để chứng minh không lan.                                                             |
| Tài liệu điều hành ghi sai sàn coverage (97/93/96/97) khiến agent sau "sửa cho khớp" bằng cách siết | AC-16 sửa cả 3 chỗ về 93/89/93/93 + ngày hiệu chuẩn 2026-09-08 + lý do (Vitest 5 đổi cách đo); nguồn sự thật duy nhất là `vitest.config.ts`.                                                                  |
| Chủ sản phẩm không có thời gian chấm 30 ô                                                           | Bảng chấm nằm trong một file, mỗi ô một dòng lý do; agent chuẩn bị 18 ảnh bắt buộc kèm link; chưa chấm = goal chưa đóng, không ép.                                                                            |

## 9. Kế hoạch thi hành (3 PR, tuần tự; mỗi PR một subagent, agent chính review)

1. **S13-1 `test(learning): cong cu chup 6 man x 4 be rong x 5 theme + cong bo cuc`** —
   `learningUxScreens.ts` + test, `shots-learning-ux.ts`, `lighthouse-cwv.sh`, 2 E2E mới, bổ
   sung route a11y/mobile guards, 2 script npm. Bằng chứng trong PR: bảng `npm run budget`
   trước/sau (AC-7), cổng mới đỏ khi chèn `<h1>` thứ hai (AC-3), thời gian mảnh E2E (AC-6). Có
   thể làm **song song với S12** vì không chạm mã sản phẩm — nhưng AC-1 chỉ hoàn chỉnh khi route
   6 màn đã có.
2. **S13-2 `fix(learning): hoi quy tim thay o audit cuoi goal learning-ux`** — chỉ những mục báo
   cáo audit liệt kê; mỗi mục: ảnh trước/sau (md5 + chiều cao) + `codemap -- impact`. **Có thể
   rỗng** → bỏ PR này, ghi "0 hồi quy" trong báo cáo kèm bằng chứng đã chạy đủ cổng.
3. **S13-3 `docs(learning): bao cao audit cuoi + dong goal learning-ux`** — báo cáo
   `docs/audit/…` (13 khối, bảng chấm, bảng CWV, Tầng 9), changelog, goal §3/§5/§7, PROGRESS
   (Tiếp theo + nợ có số), sửa Tầng 6b (AC-16), trạng thái spec này → `Done`/`Closed`.
4. Mỗi PR: changelog riêng, cổng đầy đủ trên checkout sạch, auto-merge (squash) ngay sau tạo.

**Rollout của goal (áp cho S07–S12, S13 kiểm):** mỗi slice = một (hoặc vài) PR merge tuần tự,
mỗi merge tự deploy (`deploy.yml`, xếp hàng theo `concurrency: deploy-vps`); sau mỗi deploy chạy
checklist `docs/DEPLOY.md` §6; S13-3 chạy lại checklist đó cho deploy cuối và ghi kết quả (AC-15).

**Rollback:** S13-1/S13-3 là mã test + docs → `git revert` không ảnh hưởng người dùng. S13-2 →
`git revert <sha>` từng commit sửa (mỗi mục sửa một commit để lùi riêng). Không migration, không
schema, không storage mới trong S13. Slice có persistence (S09/S11) lùi theo quy ước §7 Q5 — lệnh
revert ghi trong changelog của slice đó, S13-3 kiểm là có.

## 19. Phê duyệt

- [ ] Product outcome và scope (Q1–Q6)
- [ ] UX/accessibility (ma trận 6 × 4 × 5 × 5, bảng chấm 2 người, 18 ảnh bắt buộc)
- [ ] Architecture (không dependency mới, không job CI mới, không PNG trong repo)
- [ ] Test/rollout/rollback (3 PR; CWV đo tay; Tầng 9 cần quyền SSH)

**Kết luận:** In review  
**Người duyệt:** —  
**Ngày:** —

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không (nếu có: bỏ ra hay giữ lại, vì sao):
- Còn để ngỏ:
