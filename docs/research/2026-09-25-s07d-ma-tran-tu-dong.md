# S07d — Probe ma trận reflow, vùng chạm và focus bị che

**Kết luận: tìm được ba nhóm lỗi tái hiện được. S07 tổng thể vẫn PARTIAL.**
Đo trên `main` `6e47152` ngày 2026-09-25. Dùng Playwright 1.63.0 và Chromium 141.0.7390.37
headless trên Linux, tài khoản và API giả lập (`mockLogin`), không gọi dịch vụ thật. Probe
chạy tạm trong `e2e/`, không commit; kết quả JSON nằm ngoài repo.

## Phạm vi đo

Có 9 trạng thái màn trong tập màn §3 AC2 của đặc tả S06–S08:

- Home và Home khi ô hỏi đang focus.
- Onboarding người mới.
- Placement ở màn bắt đầu và màn câu hỏi vòng 1.
- Bài STEM Vật lí, kết quả STEM sau khi nộp (response giả lập "attempted") và sheet
  "Mục lục môn học".
- CEFR A1 `?tab=quiz`.

Mỗi trạng thái đo ở bốn bề rộng 320/390/768/1440 CSS px và ba theme `dark-blue`/`blue-sky`/`kid`.
Tổng cộng 108 ô. Ba ô sheet mục lục ở 1440 là N/A vì bố cục desktop dùng rail cố định, không có
nút mở sheet.

Có ba phép đo:

1. **Tràn ngang:** `documentElement.scrollWidth − clientWidth`.
2. **Vùng tương tác dưới 44×44 CSS px:** đo mọi `a[href]`, `button`, ô nhập, `[role=button|tab|…]`
   đang hiển thị. Bỏ qua skip link 1×1 khi chưa focus.
3. **Focus bị che:** ở 320/390/768, nhấn Tab tối đa 80 lần. Với mỗi phần tử nhận focus, gọi
   `elementFromPoint` tại tâm và hai góc. Đủ ba điểm trúng phần tử khác thì tính là **bị che
   hoàn toàn**, tức vi phạm WCAG 2.4.11 (AA).

## Kết quả

| Phép đo           | Kết quả                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tràn ngang        | 0/105 ô tràn.                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Focus bị che**  | **Home 320/390/768: 3–7 nút mỗi bề rộng bị `nav.bottom-nav` che hoàn toàn** (ví dụ "Vào không gian Tiếng Anh", "Xem tất cả (6 môn)", "Thử 5 phút"). **CEFR quiz 320: 2 nút** bị che. Trình duyệt cuộn phần tử vào mép dưới viewport, nhưng thanh điều hướng đáy cố định (`--bnav-h`) nằm đè lên đó. Các màn STEM, Placement và Onboarding không bị, vì trang học bật chế độ tập trung (ẩn thanh đáy) hoặc nội dung ngắn. |
| Vùng chạm mobile  | Ô "Câu hỏi của bạn" ở Home cao 24 px (320/390) và 28 px (768). Nút "Bỏ qua — tự chọn trình độ" ở Placement cao 36 px ở mọi bề rộng. Nút "Thoát" ở màn câu hỏi Placement có kích thước 58×20 px.                                                                                                                                                                                                                          |
| Vùng chạm 1440    | Nút thu gọn nhóm sidebar 28×28 px, trong khi nút tương tự ở cấp con đã có `.tap-44`. Nút thu gọn thanh điều hướng 32×32 px. Liên kết con của sidebar cao 36 px. Liên kết "Free · Nâng cấp" cao 32 px. Tất cả đều đạt sàn 24 px của WCAG 2.5.8 AA. Riêng hai nút icon không nhất quán với nút anh em đã đạt 44 px.                                                                                                        |
| Ngữ nghĩa tiêu đề | CEFR ở mọi tab khác "Bài học" và Placement ở màn câu hỏi/kết quả có **0 `h1`**. Tiêu đề cấp độ CEFR đang là `<p>`.                                                                                                                                                                                                                                                                                                       |

Ô hỏi Home không có `outline` riêng. Chỉ báo focus nằm ở `form` (`focus-within` đổi viền). Đây
là thiết kế có chủ đích, nên không tính là lỗi focus vô hình.

## Giới hạn

- Viewport của Playwright không thay cho browser zoom thật, pinch zoom, bàn phím ảo hay thiết bị
  thật. Các mục đó vẫn **WAITING**.
- Phép thử focus chỉ đi xuôi bằng Tab ở một theme (`blue-sky`), vì hình học giống nhau ở cả ba
  theme. Cổng source sẽ đi cả Tab lẫn Shift+Tab.
