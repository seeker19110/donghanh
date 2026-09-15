# 0321 — 2026-09-15 — Bố cục mobile: thanh điều hướng đáy không còn che hành động

**PR:** #923 · **Slice:** S03-2 của [GOAL-2026-0915-LEARNING-UX](../goals/2026-09-15-learning-ux.md)
· **Đặc tả:** [nền §④ B](../specs/2026-09-15-learning-ux-foundation.md) gạch 1–2 · **Base:** `main` sau #922 (S03-1)

## Việc đã làm

Đặc tả §④ B gạch 2 đòi: "ở 390×844 và 320px, nội dung và hành động không bị GuestBanner/bottom
nav/header che". Trước đợt này **không có phép đo nào canh điều đó** — `e2e/a11y*.spec.ts` chạy ở
viewport desktop mặc định, nên một trang quên chừa chỗ cho thanh điều hướng đáy hỏng LẶNG LẼ.

Nó đã hỏng thật, ở đúng chỗ đắt nhất:

- **`/welcome` và `/learn-vietnamese`** tự khai `pb-16` (64px) thay vì dùng `PageShell`, trong khi
  thanh điều hướng cao 97px. Nút CTA chính — "Đăng ký ngay — miễn phí" / "Sign up free" — nằm
  **dưới thanh nav và KHÔNG BẤM ĐƯỢC** ở cả 390px lẫn 320px. Đây là nút chuyển đổi của trang
  giới thiệu: người mới vào bằng điện thoại đọc hết trang rồi không bấm đăng ký được.
- **4 trang trụ** (Sự nghiệp · Khởi nghiệp · Công việc · Đời sống, và `LifeGraph`) dùng
  `!pb-20` (80px) có `!important` **ghi đè** lề `pb-[calc(2rem+var(--bnav-h))]` của `PageShell`,
  thiếu 17px. Lỗi TIỀM ẨN: chưa cắn khi dữ liệu còn ngắn, sẽ cắn khi người dùng có đủ nội dung.

Sửa: 7 file, mỗi file một lớp CSS — `pb-[calc(4rem+var(--bnav-h))]` cho hai trang landing,
`!pb-[calc(5rem+var(--bnav-h))]` cho 5 file domains. Giữ nguyên khoảng cách thị giác cũ, chỉ
cộng thêm phần chừa cho thanh nav. `--bnav-h` bằng 0 từ 1024px nên **desktop không đổi**.

Thêm cổng canh `e2e/mobile-layout-guards.spec.ts` (6 test).

## Quyết định

**Cổng dùng HAI phép đo khác nhau, cố ý.** Phép đo "bấm được thật" (`elementFromPoint` tại tâm
nút) là bằng chứng trực tiếp nhưng chỉ bắt được lỗi khi trang đủ dài. Phép đo "bất biến lề"
(`padding-bottom` vùng nội dung ≥ chiều cao thanh nav) **không phụ thuộc độ dài nội dung**, nên
nó bắt được cả lỗi tiềm ẩn. Bằng chứng cần hai phép đo: audit ban đầu chỉ dùng phép đo hành vi
đã báo 4 trang trụ "sạch" — vì dữ liệu mock ngắn, trang chưa cao đủ để chạm thanh nav.

**`/dong-hanh` là ngoại lệ có chủ đích, ghi rõ trong cổng.** Companion là khung chiều-cao-đầy ép
`!py-4`: đệm dưới lớn của `PageShell` đẩy nội dung chồng lên hàng nút Studio — đo được là 3 vi
phạm `target-size` (xem chú thích trong `Companion.tsx`, đợt 4 thiết kế lại desktop 2026-09-02).
Vùng cuộn nằm ở phần tử BÊN TRONG nên phép đo lề trên `<main>` không nói đúng về trang này.

**Danh sách route trong cổng là cố định, không quét tự động.** Trang mới quên `PageShell` sẽ
phải được thêm vào danh sách một cách CÓ Ý THỨC, thay vì lặng lẽ lọt qua vì vòng quét không biết
tới nó.

## Bằng chứng kiểm chứng

**Cổng viết trước, chứng minh bắt được lỗi cũ:** chạy `mobile-layout-guards.spec.ts` trên mã
CHƯA sửa → **6/6 đỏ**, và phép đo lề liệt kê đúng 6 mục cần sửa, không thừa không thiếu:

```
/welcome:                             lề dưới 64px < thanh nav 97px (thiếu 33px)
/learn-vietnamese:                    lề dưới 64px < thanh nav 97px (thiếu 33px)
/su-nghiep-khoi-nghiep?muc=su-nghiep: lề dưới 80px < thanh nav 97px (thiếu 17px)
/su-nghiep-khoi-nghiep?muc=khoi-nghiep: …17px
/cong-viec-cuoc-song?muc=cong-viec:   …17px
/cong-viec-cuoc-song?muc=doi-song:    …17px
```

7 route còn lại trong danh sách xanh ngay từ đầu. Sau khi sửa: **6/6 xanh**.

**Ảnh trang thật (Tầng 8b)** 1440 · 390 · 320px, trước/sau, cho `/welcome` và một trang trụ.
Ảnh "trước" ở 320px là bằng chứng trực tiếp: nút CTA chỉ ló ra một sợi sau thanh nav. Ảnh 1440px
trước/sau **giống hệt nhau từng điểm ảnh** (đối chiếu md5) — xác nhận desktop không bị chạm.

**Không tự chụp ảnh thay cho đo:** cổng a11y đầy đủ được chạy lại vì bản sửa tăng lề dưới ở 4
trang trụ, đúng thao tác từng gây 3 vi phạm `target-size` ở `Companion.tsx`.

| Cổng                                                            | Kết quả       |
| --------------------------------------------------------------- | ------------- |
| `npm run build`                                                 | ✅            |
| `npm run typecheck`                                             | ✅            |
| `npm run lint`                                                  | ✅ 0 cảnh báo |
| `npm run format:check`                                          | ✅            |
| `npm run test:coverage`                                         | ✅            |
| `e2e/mobile-layout-guards.spec.ts`                              | ✅ 6/6        |
| `e2e/a11y.spec.ts` + `a11y-aaa.spec.ts` + `a11y-modals.spec.ts` | ✅            |

## Đã ĐO và thấy KHÔNG có lỗi (ghi lại để đợt sau khỏi đo lại)

Phần lớn AC §④ B gạch 1–2 hoá ra **đã đạt sẵn** trước đợt này. Ghi rõ để không ai tưởng là còn nợ:

- **Không còn overlay cũ ở ô hỏi nhanh** sau #921 — không còn `role="dialog"`/`fixed inset-0`
  nào trong `components/Home/`. Đúng như AC dự liệu ("nếu S02 bỏ dialog thì kiểm tra không còn
  overlay cũ thay vì tạo lại").
- **15 hộp thoại × 390px và 320px: sạch.** `max-h-[90dvh]` cắt đúng (511px trong khung 568px),
  cuộn nội bộ hoạt động, không tràn ngang, không nút nào bị che hay lọt ra ngoài khung nhìn.
  Đây là "panel dài cuộn trong vùng có giới hạn; không tràn toàn trang" của AC.
- **6 hành vi bàn phím của hộp thoại** đã có unit test đủ ở `useDialogBehavior.test.tsx` (role +
  aria-modal + aria-labelledby, Escape, bẫy tiêu điểm hai chiều, trả tiêu điểm về nút mở, bấm
  nền, khoá cuộn nền).
- **Chế độ khách và màn lỗi danh mục (S03-1) ở mobile: sạch.** `GuestBanner` nằm trong luồng
  (`position: static`), không che gì. Khách VẪN có thanh điều hướng đáy — `AuthProvider` cấp một
  user khách nên `BottomNav` không `return null`; đọc mã dễ kết luận ngược, phải đo mới biết.

## Nợ / việc còn để ngỏ

- **`Landing.tsx`/`LandingEn.tsx` không đặt `id={MAIN_CONTENT_ID}` trên `<main>`** nên liên kết
  "Bỏ qua tới nội dung chính" (WCAG 2.4.1) **đứt lặng lẽ** trên hai trang này — trình duyệt không
  báo lỗi khi anchor không tồn tại. Phát hiện khi đo bố cục, KHÔNG sửa ở đây vì khác họ lỗi
  (a11y điều hướng, không phải bố cục mobile) và cần rà xem còn trang nào nữa cùng cảnh.
- Cổng mới canh 13 route. Còn ~87 file trong `apps/dhcb/src/pages` chưa nằm trong danh sách —
  phần lớn là thành phần con render bên trong trang cha đã dùng `PageShell`, nhưng chưa rà hết
  từng cái.
