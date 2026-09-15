# 0319 — 2026-09-15 — Hỏi nhanh trung thực (bỏ AI giả ở Trang chủ)

**Nhánh:** `claude/adoring-brahmagupta-mrnppr` · **Base:** `46e7b54` (#920) · **Slice:** S02 của
[GOAL-2026-0915-LEARNING-UX](../goals/2026-09-15-learning-ux.md), theo
[đặc tả nền §④ A](../specs/2026-09-15-learning-ux-foundation.md).

## Vấn đề

Ô hỏi nhanh ở Trang chủ **giả vờ có AI**. Gõ câu hỏi xong nó hiện "Bạn Đồng Hành AI đang phân
tích và trích xuất lời giải…" trong 450ms (`setTimeout`, không có lệnh gọi mạng nào), rồi in ra
một đoạn văn **viết sẵn** chọn theo từ khoá — kèm cả "Gợi ý Socratic" và một công thức LaTeX cố
định. Câu hỏi thật của người học không hề được đọc: hỏi "Giải phương trình x + 2 = 5" thì nhận
về bài giảng về bảng biến thiên của hàm bậc ba.

Đây là lỗi **niềm tin**, không phải lỗi giao diện: người học tin mình vừa được AI trả lời.

## Thay đổi

- `apps/dhcb/src/components/Home/HomeUniversalAiBar.tsx` — bỏ toàn bộ lời giải viết sẵn, vòng
  quay "AI đang nghĩ" và lớp phủ "Phản Hồi Nhanh AI". Thay bằng thẻ **nội tuyến** "Gợi ý nơi
  học": nhắc lại nguyên văn câu hỏi, nói rõ đích được chọn **theo từ khoá** và "đây chưa phải câu
  trả lời", rồi để người dùng tự bấm mở nơi học. Panel tự cuộn vào tầm nhìn (màn hẹp trước đây
  hiện gợi ý dưới mép màn hình).
- `apps/dhcb/src/lib/learningDestination.ts` (mới) — bảng từ khoá → nơi học, tách khỏi thành phần
  để test riêng được.
- `apps/dhcb/src/lib/learningQuestionDraft.ts` (mới) — giữ nguyên văn câu hỏi khi chuyển trang:
  Zod ở biên, sessionStorage + dự phòng bộ nhớ khi trình duyệt chặn, TTL 30 phút, giới hạn 2000
  ký tự khớp `apps/server/src/api/personal/companion.ts`, đích theo allowlist. **Nháp có chủ sở
  hữu**: đổi tài khoản hay đăng xuất không prefill chéo; khách → tài khoản chỉ chuyển khi người
  dùng bấm "Dùng lại câu hỏi".
- `apps/dhcb/src/pages/companion/Companion.tsx` — nhận nháp, **đổ vào ô soạn chứ không gửi**. Ô
  đang có chữ dở thì hỏi thay/giữ, không ghi đè ngầm. Gửi thành công xoá đúng id đã gửi; gửi lỗi
  giữ nguyên nháp.

## Quyết định

- **Bỏ hẳn lớp phủ, dùng thẻ nội tuyến.** Lớp phủ cũ chặn cả trang, không có bẫy focus, và ở
  390/320px bị thanh điều hướng dưới che. Thẻ nội tuyến giải quyết cả ba mà không phải dựng lại
  `Modal`/`useDialogBehavior`. (Đặc tả S03 §B đã lường trước lựa chọn này.)
- **Màu lấy từ token ngữ nghĩa** (`surface-*`, `line-*`, `content-*`) chứ không phải thang
  `zinc-*` bê từ bản cũ. Bản đầu tôi bê nguyên màu cứng và **cổng a11y mới bắt được ngay**: 3/5
  theme vi phạm tương phản.
- **Chữ nội dung dùng `text-content-secondary`, không dùng `text-content-muted`** — `muted` chỉ
  đạt AA, mà luật dự án (mục 4.5) bắt `p`/`h*` phải AAA.

## Kiểm chứng (Node 22, lệnh chạy thật)

| Cổng                                             | Kết quả                                                      |
| ------------------------------------------------ | ------------------------------------------------------------ |
| `npm run build`                                  | ✅ 1865 modules, `dist/assets/index-DMUZ75lE.js` 217.33 kB   |
| `npm run typecheck`                              | ✅ (sau khi `rm -rf packages/*/dist dist dist-server`)       |
| `npm run lint`                                   | ✅ 0 cảnh báo                                                |
| `npm run format:check`                           | ✅                                                           |
| `npm run test:coverage`                          | ✅ 606 file / **12510 test**; statements 94.4%, lines 94.85% |
| `npx playwright test e2e/home-quick-ask.spec.ts` | ✅ **15/15**                                                 |
| `npx playwright test e2e/a11y.spec.ts`           | ✅ **277/277** (15 trang × 5 theme, 0 vi phạm A/AA)          |

Test mới: `learningQuestionDraft.test.ts` (21), `HomeUniversalAiBar.test.tsx` (12),
`e2e/home-quick-ask.spec.ts` (15, gồm quét a11y A/AA **và** AAA cho panel mới ở cả 5 theme).

**Ảnh trang thật** (Tầng 8b) chụp trước/sau ở 1440 · 390 · 320px. Ảnh 390px của bản sửa là thứ
phát hiện ra lỗi panel nằm dưới mép màn hình — đọc mã không thấy được.

**Bằng chứng "không tốn tiền API":** E2E đếm request **không phải GET** tới `/api/(agent|companion|tts|stt|chat)`
trong suốt bài test; mở trang, tải lại, bấm Back và điều hướng đều cho 0. (Chỉ đếm non-GET vì
`GET /api/companion` là đọc lịch sử hội thoại — miễn phí, vốn có từ trước.)

## Rủi ro, rollout và rollback

Chỉ frontend, không đụng schema/migration/billing/entitlement. Không mở API riêng tư cho khách,
không đổi `Login`/`RequireAccount`. Revert 4 file là về nguyên trạng; nháp nằm ở sessionStorage
nên không để lại dữ liệu thừa.

**Còn mở:** S03 trở đi vẫn cần review/đặc tả riêng. Bảng từ khoá vẫn là bảng từ khoá — nó đoán
sai được, và giao diện nay nói thẳng điều đó thay vì giấu đi.
