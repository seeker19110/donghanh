# 0396 — 2026-09-21 — Đặc tả triển khai cho 19 chặng P6 còn thiếu bài học

> PR: #TBD · Nhánh: `claude/youthful-newton-0mr8ie` · Loại: tài liệu (đặc tả), không đụng code.

## Bối cảnh

`PROGRESS.md` 2026-09-21 (PR #1077) ghi nhận lệch lớn giữa "đã đặc tả nội dung" và "đã có bài
học thật" ở bậc P6 môn Lập trình: `specializations/details/` đủ 56/56 chặng, nhưng
`SPEC_STAGE_UNITS` trong `specializations/stageUnits.ts` chỉ có 37 chặng. Ba hướng `game`,
`embedded`, `desktop` không có bài nào — học viên chọn vào sẽ gặp mảng rỗng.

Đợt này **chỉ viết đặc tả triển khai**, chưa soạn bài. Chủ dự án chốt thứ tự đó: đặc tả toàn bộ
trước, giao soạn bài sau.

## Đã làm

Sáu file đặc tả mới trong `docs/specs/`, phủ 19 chặng / 76 unit, theo khuôn
`docs/templates/dac-ta-tinh-nang.md` và bám đúng cấu trúc đặc tả tiền lệ
`docs/specs/2026-09-17-devops-s3-bai-hoc-that.md`:

| File                                        | Chặng                        | Dải unit id    |
| ------------------------------------------- | ---------------------------- | -------------- |
| `2026-09-21-mobile-s2-s4-bai-hoc-that.md`   | mobile S2·S3·S4              | `p6-u214…u225` |
| `2026-09-21-algo-s3-s4-bai-hoc-that.md`     | algo S3·S4                   | `p6-u226…u233` |
| `2026-09-21-systems-s3-s4-bai-hoc-that.md`  | systems S3·S4                | `p6-u234…u241` |
| `2026-09-21-game-s1-s4-bai-hoc-that.md`     | game S1→S4 (hướng trắng)     | `p6-u242…u257` |
| `2026-09-21-embedded-s1-s4-bai-hoc-that.md` | embedded S1→S4 (hướng trắng) | `p6-u258…u273` |
| `2026-09-21-desktop-s1-s4-bai-hoc-that.md`  | desktop S1→S4 (hướng trắng)  | `p6-u274…u289` |

Cộng với ba chặng đã có đặc tả chờ thi hành từ trước (`data-s4`, `security-s3`, `security-s4`),
**toàn bộ 56/56 chặng P6 nay đều đã có đặc tả triển khai** — khoảng trống ghi trong `PROGRESS.md`
đã khép về mặt kế hoạch.

Mỗi đặc tả có đủ: phạm vi kèm mục "KHÔNG LÀM", bảng điểm chạm file thật, hợp đồng simulator cho
TỪNG unit (ca hiện · ca ẩn · **ca âm**), tiêu chí chấp nhận đo được kèm lệnh chứng minh, bảng bất
biến ↔ test canh, quy ước dự án, rollout/rollback, và mục nghiệm thu bỏ trống cho bên giao việc.

## Quyết định (chủ dự án duyệt 2026-09-21)

1. **Khoá dải unit id** như bảng trên. Dải cao nhất đã cấp trước đợt này là `p6-u213`
   (`security-s3`); 76 id mới rời nhau tuyệt đối và không đụng dải cũ.
2. **KHÔNG nối 19 chặng này vào bất kỳ `learningPaths/*.ts` nào** — các hướng đứng độc lập, vào
   qua trang hướng chuyên sâu. Khác `devops-s3` (chỉ thêm một chặng vào lộ trình `principal-ai`
   đang chạy), ở đây phải quyết cho nhiều chặng liên tiếp cùng lúc, đổi mẫu số tiến độ hiển thị
   ngay từ chặng đầu. Muốn nối thì làm ở đợt riêng có đặc tả riêng.
3. **Nhịp PR khi soạn bài**: ba hướng trắng chia 2 PR mỗi hướng (S1+S2 rồi S3+S4, mở PR sau khi
   PR trước merge để không đụng nhau ở `stageUnits.ts`/`lessons.ts`/`curriculum.ts`);
   mobile/algo/systems mỗi hướng 1 PR. Tổng ~9 PR.
4. Các quyết định riêng từng lát cắt được duyệt theo đúng phương án mặc định mà đặc tả đề xuất —
   gồm tiêu chí nhận diện "cơ chế kiếm tiền bóc lột" ở `p6-u256` (`game-s4`), cách mô phỏng an
   toàn bộ nhớ kiểu Rust bằng Python thuần ở `embedded-s3-m4`, và các ngưỡng số cố định trong
   simulator hướng `desktop` (là hằng MÔ PHỎNG, không phải khuyến nghị vận hành thật).

## Bằng chứng kiểm chứng

- Đối chiếu id bằng máy: 76 id mới trong dải `p6-u214…u289`, mỗi file giữ một khối liên tục rời
  nhau; `comm` với tập id đã phát hành (`stageUnits.ts` + các đặc tả 2026-09-16/17) cho giao rỗng
  ở vùng cấp mới.
- `npx prettier --check docs/specs/2026-09-21-*.md` — xanh.
- `npm run check:specs` — xanh (130 đặc tả, không đường dẫn thiếu).

## Nợ / việc tiếp theo

- **Chưa soạn bài.** 76 unit × ≥2 lesson là khối lượng nội dung lớn, chia theo nhịp PR ở quyết
  định 3.
- ✅ **Đã sửa luôn trong đợt này** (chủ dự án yêu cầu giữa phiên) phát hiện phụ từ PR #1077:
  `CLAUDE.md` mục 2 dẫn tới `docs/research/dac-ta-huong-chuyen-sau-mon-lap-trinh-2026-08-27.md`
  **không tồn tại trong repo**, và ghi "13 hướng" trong khi `registry.ts` có **14**. Mục đó nay trỏ
  thẳng vào mã nguồn làm nguồn sự thật và ghi đúng 14 hướng (11 sản phẩm + 3 nền cắt ngang, hướng
  thiếu là `mathforcode`). Tài liệu nghiên cứu/đặc tả cũ ghi "13 hướng" giữ nguyên làm hồ sơ lịch
  sử — đúng với thời điểm viết, không sửa ngược.
- Trong lúc làm phát hiện `node_modules` của container lệch lockfile (tsc 6.0.2 thay vì 5.x ghim
  trong `package.json`) làm cổng typecheck đỏ giả — đúng khuôn bẫy CLAUDE.md mục 8, đã xử bằng
  `npm ci`. Không phải lỗi mã nguồn.
