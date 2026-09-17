# 0359 — 2026-09-17 — Bỏ lặp chữ "Trang chủ" ở header desktop (nút Back + Breadcrumb)

**PR:** (điền khi tạo) · **Loại:** fix UI, không đổi luồng điều hướng.

## Bối cảnh

Người dùng chụp ảnh trang `/lap-trinh/p1--nhap-mon-tu-duy` (desktop) thấy header rối: chữ
"Trang chủ" hiện HAI LẦN liền nhau — một lần ở nút "← Trang chủ", một lần ở đốt đầu của
Breadcrumb "Trang chủ › Góc học tập" ngay bên dưới.

Điều tra (`apps/dhcb/src/components/Layout.tsx`) cho thấy đây không phải lỗi ngẫu nhiên: nút
Back thật ra LÙI MỘT BẬC theo `onBack`/`backTo` riêng của từng trang (ví dụ bài học Lập trình
lùi về đúng chặng P1/P3, không phải Trang chủ tuyệt đối) nhưng nhãn CHỮ luôn cứng là "Trang
chủ" (`T.home`) — sai với đích thật, và lặp với đốt đầu "Trang chủ" mà `Breadcrumb.tsx` luôn vẽ
(`lib/breadcrumb.ts` — `HOME: Crumb = { label: 'Trang chủ', to: '/' }`). Comment cũ ở
`Layout.tsx:201-205` giải thích Breadcrumb được thêm BỔ SUNG bên cạnh Back (không thay thế) vì
từng thử bỏ Back thì vỡ `e2e/programming-lesson.spec.ts` — nhưng hậu quả phụ (2 chữ "Trang chủ"
sát nhau) chưa được tính tới lúc đó.

**Người dùng chọn phương án:** bỏ hẳn Breadcrumb, để nút Back tự lấy NHÃN ĐÚNG theo đích thật
thay vì chữ cứng "Trang chủ".

## Đã làm

- `apps/dhcb/src/components/Layout.tsx`: tính `backLabel` bằng CHÍNH hàm `buildCrumbs` (dùng
  chung nguồn với Breadcrumb cũ, không phải đoán riêng) — lấy đốt cha gần nhất theo
  `location.pathname`/`title`/`crumbs`, mặc định về `T.home` khi không có đốt cha (đúng trang
  Trang chủ tuyệt đối). Nút Back dùng `backLabel` thay `T.home` ở cả `aria-label` lẫn chữ hiển
  thị; xoá hẳn `<Breadcrumb>` khỏi header.
- Xoá `apps/dhcb/src/components/Breadcrumb.tsx` (không còn ai import — đã `grep` xác nhận).
  `lib/breadcrumb.ts` (hàm `buildCrumbs` thuần) GIỮ NGUYÊN, nay dùng trực tiếp trong
  `Layout.tsx`.
- Sửa 2 spec E2E còn assert cứng nhãn "Trang chủ" của nút Back (đã sai từ trước, chỉ là chưa ai
  để ý vì test chỉ canh URL đích):
  - `e2e/programming-lesson.spec.ts` — bài `p3-u10-l1` nay nhãn nút Back là tên bậc P3
    ("Làm được việc thật", theo `curriculum.ts`).
  - `e2e/english-tools-context.spec.ts` — công cụ Tiếng Anh (`/tro-truyen`, `/tu-dien`,
    `/on-thi`) nay nhãn nút Back là "Tiếng Anh". Phải thêm `exact: true` — không thì Playwright
    khớp nhầm nút sidebar "Thu gọn công cụ Tiếng Anh" (chứa chuỗi con "Tiếng Anh", đứng trước
    trong DOM) thay vì nút Back thật trong `banner`.

## Bằng chứng kiểm chứng

```
npm ci                                  # PASS — lockfile lệch trước đó (tsc 6.0.2 vs ^5.2.2 khai báo)
npm run typecheck                       # PASS (tsc apps/dhcb + api + e2e + hub)
npm run lint                            # PASS, 0 cảnh báo
npm test                                # PASS — 679 file / 14106 test (2 skip, không liên quan)
npm run build                           # PASS (app + server + hub)
npx playwright test e2e/english-tools-context.spec.ts --project=chromium   # PASS 6/6
npx playwright test e2e/programming-lesson.spec.ts -g "quay lại từ bài học về ĐÚNG bậc"
                                         --project=chromium                # PASS 1/1
```

Chụp ảnh thật `/lap-trinh/p1--nhap-mon-tu-duy` (1440px + 390px, script tạm đã xoá sau khi xem):
desktop chỉ còn "← Góc học tập" + icon switcher, hết lặp "Trang chủ"; mobile không đổi (nhãn
chữ vốn đã ẩn dưới `sm:inline`, chỉ hiện mũi tên).

## Quyết định

Gộp hai nguồn thông tin "đi đâu tiếp" (Back) và "đang ở đâu" (Breadcrumb) thành MỘT — nút Back
với nhãn lấy từ đúng cây route (`buildCrumbs`), thay vì hiển thị cả hai cùng lúc. Chấp nhận mất
phần hiển thị TOÀN BỘ chuỗi đốt cha (Breadcrumb cũ có thể vẽ nhiều tầng, Back giờ chỉ hiện MỘT
đốt cha gần nhất) — bù lại là header gọn, đúng nghĩa, không lặp chữ.
