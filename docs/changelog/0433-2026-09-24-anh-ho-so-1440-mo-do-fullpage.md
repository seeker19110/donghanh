# Ảnh Hồ sơ 1440px "mờ toàn trang": lỗi của công cụ chụp, không phải của trang

- **Ngày:** 2026-09-24 · **PR:** xem mô tả PR của nhánh `claude/fix-profile-1440-blur-shot-fullpage`
- **Nguồn nợ:** `docs/audit/2026-09-22-danh-gia-sau-ui-ux.md` §6 + `PROGRESS.md` (đợt 0412, nợ số 3)
- **Công cụ lúc đo:** Playwright 1.63.0, Chromium `/opt/pw-browsers/chromium`, Vite dev (`playwright.config.ts`).

## Nguyên nhân thật (đã đo, tái hiện được)

1. `page.screenshot({ fullPage: true })` chụp bằng `captureBeyondViewport`. **Trong lúc chụp, trang
   thấy khung nhìn 1×1 px** thoáng qua: listener `matchMedia('(min-width: 1024px)')` ghi được
   `change matches=false innerWidth=1 innerHeight=1`, rồi `matches=true innerWidth=1440`.
2. Hồ sơ dùng `TwoPane` với cờ `useIsDesktopViewport()`. Cờ lật false → true thì `TwoPane` đổi hình cây,
   React **gỡ và dựng lại cả cột chính** (MutationObserver: `DIV.min-w-0 flex-1` + `ASIDE.sticky` bị
   gỡ, ~150ms sau 9 phần tử `animate-fade-in` chạy lại từ đầu).
3. Ảnh bị chụp giữa quãng `fade-in` (opacity 0→1, translateY 10px→0, 0,35s) → cột chính **mờ và lệch
   xuống ~6px**, còn thanh bên và cột phải thì nét. Đo `opacity` NGAY TRƯỚC khi chụp luôn = 1, vì
   chính lệnh chụp mới gây ra việc dựng lại. Đó là lý do đợt audit 2026-09-22 không lần ra.
4. Ở 390px không dính: 1px và 390px đều < 1024px, cờ không đổi.

**Người dùng thật không bị ảnh hưởng**: khung nhìn 1×1 chỉ tồn tại bên trong lệnh chụp. Không có
`filter: blur` hay `backdrop-filter` nào trên vùng nội dung (chỉ thanh bên cố định có
`backdrop-filter: blur(24px)`, và phần đó vẫn nét). Không sửa mã trang.

## Số đo trước / sau (ảnh lưu ngoài repo, không commit PNG)

| Cách chụp (Hồ sơ 1440px, sau 3s, 10 lần) | Lần bị dựng lại                                          | md5 khác nhau      |
| ---------------------------------------- | -------------------------------------------------------- | ------------------ |
| `fullPage: true` (công thức cũ)          | 8/10 (cả dark-blue lẫn blue-sky)                         | nhiều              |
| `freezeAnimations()` + `fullPage`        | hết mờ, nhưng khối Mời bạn / Người thân quay về skeleton | –                  |
| `fullPage: true, animations: 'disabled'` | 3–4/10                                                   | –                  |
| **`screenshotFullPage()` mới**           | **0/10**                                                 | **1** (cả 2 theme) |

Helper mới còn chạy 10 lần/tổ hợp trên `/`, `/tien-do` × 1440/390 × 2 theme: 12/12 tổ hợp cho đúng
1 md5 qua 10 lần. Chiều cao không đổi so với `fullPage`: Hồ sơ 1440px = 2004px, 390px = 2712px.
Ảnh trước (`fullPage`, chờ 5s, dark-blue): cột chính mờ rõ, lệch 6px. Ảnh sau: nét, khớp ảnh
"tốt" của cách cũ ở những lần không dính.

Phát hiện phụ khi chạy lại công thức: chờ cứng `waitForTimeout(1800)` cho ra cột chính **trống**
(1440px) khi dev server còn nguội, còn chỉ `waitForStableDom` thì ra **6 thẻ skeleton** (390px).
Đổi sang chờ theo trạng thái: DOM đứng yên + hết `.animate-shimmer`.

## Đã làm

- `e2e/helpers/fullPageShot.ts` (mới): `screenshotFullPage()` giữ nguyên bề rộng, nới chiều cao
  khung nhìn bằng chiều cao trang, chụp khung nhìn thường, trả lại kích thước cũ. Nó **ném lỗi**
  nếu truy vấn desktop vẫn lật trong lúc chụp, để ảnh sai không lọt ra im lặng.
  `waitForShotReady()` chờ DOM đứng yên + hết skeleton. Hết giờ thì cảnh báo, không ném lỗi.
- `scripts/shots-learning-ux.ts`: chụp qua `screenshotFullPage` thay cho `fullPage: true`.
- `docs/framework/QUY-TRINH-AUDIT.md` Tầng 8b: công thức dùng hai helper, thêm bẫy thứ tư.
- `scripts/shots-fullpage-helper.test.ts` (mới): chặn việc quay lại dùng `fullPage: true` ở
  helper/script/công thức, và chặn công thức chờ cứng.

## Hệ quả cần biết

Phần tử `position: fixed` (thanh bên desktop) nay cao hết ảnh, không còn dừng ở 900px như với `fullPage`.

## Còn mở (ngoài phạm vi)

Ba spec bằng chứng còn dùng `fullPage: true`: `e2e/programming-path.spec.ts`,
`e2e/home-clarity-evidence.spec.ts` và `e2e/ux-r3-4-english-disclosure-evidence.spec.ts`. Nếu trang
chúng chụp có `TwoPane` ở ≥1024px thì dính cùng bẫy.
