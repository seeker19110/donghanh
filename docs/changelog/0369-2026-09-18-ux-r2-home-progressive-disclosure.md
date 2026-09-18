# 0369 — 2026-09-18 — UX-R2 Trang chủ progressive disclosure

## Kết quả

- Giữ hierarchy mobile **Bạn Đồng Hành → Hôm nay → Hỏi nhanh**; `TodayCard` tiếp tục là hành
  động chính, còn entry Tiến độ trùng trong Companion được bỏ.
- Năm prompt chip dùng một panel DOM có `hidden`: mobile khởi tạo thu gọn, desktop hiện đủ; state
  và focus được giữ đúng khi resize, kể cả ca toggle unmount và ca blur có `relatedTarget=null`.
- Mobile chỉ hiện ba môn đầu trước disclosure, không render shortcut phụ; nhóm môn 4–6 luôn
  mounted sau toggle và dùng thứ tự Tab tự nhiên. Desktop giữ sáu môn, mô tả và mọi shortcut.
- Companion compact theo viewport, giữ đủ summary/daily fact/comeback và bỏ clamp riêng tại Home.
  Skeleton có reserve khớp normal/comeback; fallback lỗi ngắn, ổn định; chỉ reserve comeback khi
  có bằng chứng học English và còn khả năng học tiếp.
- Lỗi validation được chừa 56px để không đẩy nội dung; status môn dùng token nội dung đạt AAA.
- Thay nhánh `TwoPane` remount theo breakpoint bằng ancestor ổn định nhưng giữ nguyên hợp đồng
  desktop main + rail, nhờ đó disclosure/focus không mất khi resize.

## Bằng chứng canonical

Cùng fixture `ux-r2-member-v1`, timezone `Asia/Ho_Chi_Minh`, ba theme `dark-blue`, `blue-sky`,
`kid`; request ngoài fixture bị chặn. BEFORE ở `806e77c04d9f3bf3ee427c730ec3cfcd13c74b4d`, AFTER ở
working tree ứng viên:

| Viewport | BEFORE height | AFTER height | Giới hạn | Progress trong main | Chip focusable |
| -------- | ------------: | -----------: | -------: | ------------------: | -------------: |
| 320      |       2.082px |      1.663px | ≤1.850px |               2 → 1 |          5 → 0 |
| 390      |       1.906px |      1.581px | ≤1.700px |               2 → 1 |          5 → 0 |
| 1440     |       1.393px |      1.423px | ≤1.459px |               2 → 1 |          5 → 5 |

- `scrollWidth === innerWidth` ở 320/390/1440.
- AFTER có 33 ảnh/state/theme và `manifest-after.json`; max CLS toàn ma trận
  `0.06939588477366257 ≤ 0.1`. Error 390 dark/blue/kid lần lượt
  `0.0387535 / 0.0427663 / 0.0387535`.
- BEFORE report SHA-256:
  `a9580024293b0723e0771e93ba7d02d3149138a3aa1f0a5e0a7847993e873fbc`.
- AFTER report SHA-256:
  `c63bfdedeb5bae728ff10564a4106c44ad9ba982554a17aa4735a878440eb1f3`.
  Ảnh và manifest AFTER được `testInfo.attach()` để CI lưu làm artifact; PNG không commit.

## Validation

- Codemap impact cho đủ bốn file runtime theo spec.
- Canonical Playwright: **5/5 PASS**; capture manifest riêng: **1/1 PASS**, 33 cases.
- Component/unit tập trung: **69/69 PASS** trước review; bộ latest sau các regression focus, CLS,
  AAA, validation, CEFR settle, full-copy và fallback ổn định đạt **77/77 PASS**.
- Build, typecheck, lint, format và budget đã PASS trong working tree; budget JS
  137,65/150 kB, CSS 18,38/20 kB.
- Full unit lượt đầu có một test Swift timeout 5 giây dưới tải song song; chạy riêng test đó
  **44/44 PASS**. Lượt full cuối chạy một mình: **705 file / 14.925 test PASS**, 1 file / 2 test
  skip theo hợp đồng hiện hành.
- Full E2E phát hiện bảy fixture comeback cũ chỉ seed hoạt động đa miền; fixture đã được bổ sung
  bằng chứng English hợp lệ và **7/7 regression PASS**. Lượt full xác nhận sau đó đạt
  **842 PASS / 5 skip**, chỉ còn một race ngoài phạm vi ở `sync-offline` do navigation hủy
  execution context; case này PASS ở lượt full trước và **1/1 PASS** khi chạy cô lập ngay sau đó.
  Required E2E CI của PR vẫn là release gate cuối.
- Không API/schema/migration/dependency/provider call hoặc dữ liệu production.

## Rollback

Revert riêng PR UX-R2. Thay đổi chỉ ở UI và test, không có dữ liệu cần khôi phục.
