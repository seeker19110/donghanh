# Sửa CLS ngẫu nhiên ở Home comeback mobile: sàn dự trữ bong bóng Companion thiếu 46px

- **Ngày:** 2026-09-24 · **PR:** (xem mô tả PR của nhánh `claude/fix-flaky-home-clarity-cls-comeback-reserve`)
- **Loại:** Tầng 1b (`docs/framework/QUY-TRINH-AUDIT.md`) — test đỏ ngẫu nhiên. Kết luận: **không phải
  nhiễu đo lường**, mà là một layout shift THẬT của giao diện nằm sát ngưỡng; độ "ngẫu nhiên" chỉ
  đến từ việc các shift có rơi vào cùng một khung hình hay không.

## Triệu chứng

`e2e/home-clarity-evidence.spec.ts` ca `comeback có English evidence giữ CLS dưới 0,1 từ render
đầu` (và ca `member-comeback-*-390` trong `attach canonical screenshots và manifest`) đỏ khoảng 1/3
số lượt với CLS ≈ 0,103; đỏ y hệt trên `main` gốc `0d1d6bf` nên không phải hồi quy của PR nào.

## Nguyên nhân (đo, không đoán)

Gắn tạm một bộ ghi `requestAnimationFrame` đo chiều cao 3 khối + `startTime` từng layout-shift. Ở
390px, trang comeback có **ba** lần đổi chiều cao sau render đầu:

| Khối                 | Trước → sau     | Lúc nào                                          |
| -------------------- | --------------- | ------------------------------------------------ |
| `WeekRhythm`         | 90 → 120px      | `fetchQuestsStatus` về, hiện dòng "Nhiệm vụ x/y" |
| `TodayCard`          | 174 → 246px     | `useTodayPlan` dựng xong (có 2 việc phụ)         |
| `HomeAiBriefingCard` | **310 → 356px** | bản tin (`/api/proactive-briefing`) về           |

Khối thứ ba là **lỗi**: component đã cố ý dự trữ sàn `min-h-[173px]` cho comeback để KHÔNG nhảy,
nhưng con số tính cho "lead 2 dòng + detail 2 dòng + hàng action 44px". Bong bóng comeback có
**hai** nút icon 44px (🔊 + ✕) nên cột chữ ở 390px chỉ còn ~190px — lead của fixture và câu "Đã N
ngày rồi — …" đều xuống **3 dòng** → nội dung thật 219px, thiếu đúng 2 × 22,75px ≈ 46px.

Vì sao dao động: điểm layout-shift phụ thuộc cách các thay đổi gộp khung hình. Tách rời
(0,006 + 0,0227 + 0,0275) = **0,056**; `TodayCard` và bản tin về cùng khung → một shift 0,0735,
tổng **0,0795**; cả ba cùng khung (máy chậm/CI) → **0,090** đo được ở máy dưới tải CPU, 0,103 như
CI ghi nhận. Không có gì "ngẫu nhiên" trong giao diện — chỉ có thứ tự tới của 3 request.

## Đã sửa

- `apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx` — sàn comeback tách theo bố cục:
  **mobile 219px** (lead 3 dòng + detail 3 dòng + hàng action), desktop giữ 173px (cột chữ rộng,
  CLS desktop đo được 0,005 — không cần đổi). Comment giải thích phép tính tại chỗ.
- `apps/dhcb/src/components/Home/HomeAiBriefingCard.test.tsx` — ca reserve mobile đổi sang 219px,
  thêm ca desktop giữ 173px (canh cả hai nhánh).
- **KHÔNG nới ngưỡng 0,1 của test, không đổi cách chờ trong test.** Test vẫn giữ nguyên nên một
  hồi quy CLS thật vẫn bị bắt.

## Bằng chứng

- Trước sửa, `--repeat-each=30 --workers=3` + 2 vòng lặp bận CPU: CLS **0,0562–0,0902**
  (0,0562 ×14 · 0,0601 ×6 · 0,0778 ×3 · 0,0795 ×3 · 0,0902 ×3).
- Sau sửa, cùng điều kiện: **30/30 xanh, CLS 0,0222–0,0260** (còn 2 shift nhỏ của WeekRhythm và
  TodayCard; gộp cả hai vào một khung cũng chỉ 0,026) — cách ngưỡng ~4 lần.
- Không tải: `--repeat-each=20` 20/20 xanh; cả file spec 5/5 xanh (gồm canonical 33 ảnh + manifest,
  ngân sách chiều cao trang).
- Nhìn ảnh 390px comeback sau sửa (Tầng 8b): bong bóng vừa khít sàn 219px, không thừa khoảng trắng
  với fixture; bản tin ngắn hơn sẽ để lại tối đa 46px trống bên trong thẻ (chấp nhận — cùng cách
  các sàn 80/98px đang làm).
- Unit: `vitest run apps/dhcb/src/components/Home apps/dhcb/src/pages/core/Home.test.tsx` 7 file /
  83 test xanh; `npm run typecheck` · `npm run lint` thoát 0.

## Còn mở (góp ý, ngoài phạm vi)

- `TodayCard` (+72px khi có 2 việc phụ) và `WeekRhythm` (+30px khi nhiệm vụ về) vẫn là hai shift
  thật nhỏ ở mọi trạng thái member. Đủ xa ngưỡng nên không đỏ test, nhưng muốn CLS ≈ 0 thì cần dự
  trữ theo số việc phụ dự đoán được từ dữ liệu đồng bộ, và giữ chỗ cho dòng nhiệm vụ khi đã đăng nhập.
- Ở 320px cột chữ còn hẹp hơn nữa — sàn 219px có thể lại thiếu. Test chưa có ca comeback 320px.
