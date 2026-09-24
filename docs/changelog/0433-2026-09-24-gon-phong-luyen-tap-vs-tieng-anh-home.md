# Gọn Phòng luyện tập: chốt "nhà" của từng tính năng, gỡ lối vào trùng với Tiếng Anh home

- **Ngày:** 2026-09-24 · **PR:** #1157
- **Nguồn:** audit UI/UX sâu `docs/audit/2026-09-22-danh-gia-sau-ui-ux.md` mục **P2-1**
  (đợt C trong bảng kế hoạch — phần "Luyện tập").
- **Loại:** `refactor(ui)` — không đổi route, không xoá tính năng, chỉ gọn điểm vào.

## Vấn đề

`/luyen-tap` là trang danh mục 4 tầng. Tầng 4 "Kho học liệu bổ trợ" (Từ điển · Truyện · Mẫu câu ·
"100+ Hội thoại mẫu" · Thử thách 1 phút) lặp đúng các ô ở trang Tiếng Anh home
(`/goc-hoc-tap/english`); tầng 2 lặp 4 kỹ năng gia sư AI (Nói · Viết · Trò chuyện · Nghe) mà
Tiếng Anh home đã có mục "Gia sư luyện 4 kỹ năng AI". Thêm một lệch nhãn: cùng đích
`/goc-hoc-tap/english/bai-hoc` được gọi "100+ Hội Thoại Mẫu" ở Luyện tập nhưng "Ngữ Pháp · 100+
chủ điểm" ở Tiếng Anh home. Nội dung RIÊNG của trang (8 bài phản xạ nhanh) lại bị đẩy xuống dưới
hai lớp danh mục.

## Quyết định "nhà" của từng tính năng

Nguyên tắc: tính năng đặc thù một môn → nhà là trang môn đó; `/luyen-tap` là nơi của các hình
thức luyện tập nó tự chạy + lối tắt ngắn, không nhân bản mô tả.

| Tính năng                                                                 | Nhà (mô tả đầy đủ)                                                                                                                  | Nơi còn lại                                                                           |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 8 bài phản xạ nhanh (mini-game)                                           | `/luyen-tap` — chỉ trang này chạy được                                                                                              | — (lên đầu trang, mục 1)                                                              |
| Sổ tay lỗi sai                                                            | `/luyen-tap` (banner) — sổ gộp cả lỗi Toán/Lý/Hoá/Sinh (`MistakeBank` đọc `STEM_SUBJECTS`), dù URL nằm dưới `/goc-hoc-tap/english/` | Tiếng Anh home: ô ngắn 1 dòng, giữ nguyên                                             |
| 4 kỹ năng gia sư AI (Nói · Viết · Trò chuyện · Nghe)                      | Tiếng Anh home                                                                                                                      | `/luyen-tap`: 4 lối tắt 1 nhãn, bỏ mô tả 2 dòng (mục 2)                               |
| Từ điển · Truyện song ngữ · Mẫu câu · Ngữ pháp/bài học · Thử thách 1 phút | Tiếng Anh home                                                                                                                      | `/luyen-tap`: **gỡ hẳn**; thẻ "Tiếng Anh CEFR" ở mục 3 ghi rõ các tài nguyên này ở đó |
| Lộ trình 5 môn + phòng thí nghiệm STEM                                    | Góc học tập / trang từng môn                                                                                                        | `/luyen-tap`: giữ nguyên (mục 3) — ngoài phạm vi P2-1                                 |

Tiếng Anh home **không sửa** — nó đã là nhà đúng của các tính năng trên, mọi ô ở đó vẫn còn.

## Đã làm

- `apps/dhcb/src/pages/learning/Practice.tsx`: xếp lại thứ tự (Sổ tay → Đấu trường → 1. 8 bài
  phản xạ → 2. Luyện với gia sư AI · Tiếng Anh → 3. Luyện tập 5 môn); tầng 2 thành 4 lối tắt dựng
  từ bảng `AI_TUTOR_LINKS` (một nguồn, đi qua `duongDanLuyen*`/`duongDanTroTruyen`, `h2` có
  `aria-labelledby`); gỡ tầng 4; đổi mô tả thẻ Tiếng Anh thành "Lộ trình CEFR, từ điển, truyện
  song ngữ, mẫu câu & thử thách 1 phút." Bỏ 5 import route + 4 icon không còn dùng.
- Mọi URL giữ nguyên; không trang đích nào bị xoá.

## Bằng chứng

**Chiều cao trang (Tầng 8b)** — Playwright, `mockLogin` vi, theme mặc định, chờ 3s,
`document.body.scrollHeight`; server dev RIÊNG cổng 5391 (cổng 5179 lúc đo đang bị server của
worktree khác chiếm — lần đo đầu vô tình đọc bản của worktree đó, đã bỏ số đó và đo lại):

| Trang                  | 1440px trước → sau     | 390px trước → sau      |
| ---------------------- | ---------------------- | ---------------------- |
| `/luyen-tap`           | 1582 → **1184** (−25%) | 3154 → **2461** (−22%) |
| `/goc-hoc-tap/english` | 1009 → 1009            | 1577 → 1577            |

`scrollWidth` = bề rộng khung ở cả hai cỡ (không cuộn ngang). Đã nhìn ảnh chụp sau: 390px lưới
lối tắt 2×2, 1440px 1×4; không lặp nội dung trong trang.

**Cổng:** `typecheck` 0 · `lint` 0 cảnh báo · `prettier --check` sạch · `npm test` 739 file · 16.944 test xanh (2 skip), coverage 94,65/90,54/95,36/95,16 · `npm run build` 0 ·
E2E `a11y.spec.ts` `/luyen-tap` × 3 theme xanh · `mobile-layout-guards.spec.ts` xanh ·
`practice-direction.spec.ts` + `practice-fillblank.spec.ts` xanh (tổng 20/20 + 11 test lượt 2).
`npm run codemap -- impact` Practice.tsx → `App.tsx`, `Practice.s04.test.tsx`, `main.tsx` (không
test nào chọn phần tử đã gỡ).

## Rủi ro còn lại (không sửa trong đợt này)

- `/luyen-tap` và `/goc-hoc-tap/english` **không nằm trong cổng AAA** (`e2e/a11y-aaa.spec.ts`).
  Chạy thử AAA tạm cho cả hai trang: đỏ ở cả 3 theme, nhưng toàn bộ là `incomplete` "không xác
  định được màu nền do gradient" trên banner Sổ tay / Đấu trường (có từ trước, Tiếng Anh home
  không sửa cũng đỏ tương tự) — không có vi phạm nào ở phần tử mới.

## Bổ sung cùng PR: nút "N thẻ đến hạn" sai đích — ĐÃ SỬA

Nút "N thẻ đến hạn" ở Tiếng Anh home (`EnglishHome.tsx`) trỏ `/luyen-tap`, nơi không có phần ôn
thẻ SRS. Nay nút mở `duongDanCapCefr(cấp đang học)?tab=srs` — **đúng luật của adapter chung**
`lib/today/englishNext.ts` (mục ôn ở thẻ "Hôm nay" trang chủ): chỉ hiện khi có cấp đang học, đích
là tab `srs` của cấp đó. Tab `SRSReview` mặc định ôn thẻ của MỌI cấp (`pool` = toàn bộ từ đã học),
nên khớp con số `srsDue` trên nút.

- Test mới `EnglishHome.srsButton.test.tsx` (3 ca): nút mở đúng `…?tab=srs`; ẩn khi không có cấp
  đang học; ẩn khi 0 thẻ đến hạn.
- Phép thử ngược: trả nút về `/luyen-tap` → ca đầu đỏ (`expected '/luyen-tap' to be
'/goc-hoc-tap/english/lo-trinh/a1?tab=…'`); khôi phục → xanh.
- Ca biên giữ theo luật sẵn có: người học đã xong mọi cấp (không còn cấp đang học) mà vẫn có thẻ
  đến hạn thì nút ẩn — giống thẻ "Hôm nay". Muốn đổi thì đổi ở `englishNext` cho cả hai nơi.
