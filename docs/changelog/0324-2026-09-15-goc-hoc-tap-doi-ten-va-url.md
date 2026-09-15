# 0324 — 2026-09-15 — Góc học tập: đổi tên không gian và URL, alias tương thích

**PR:** (điền khi tạo) · **Đặc tả:** `docs/specs/2026-09-15-goc-hoc-tap-architecture.md` — slice **01**
(slice duy nhất đã Approved; 02–04 chưa READY).

## Đã làm

1. **Một đường dẫn chuẩn duy nhất: `/goc-hoc-tap`.** Trước đây không gian học tập có HAI hình
   dạng URL cho cùng một nội dung: `www…/mon-hoc/mathematics` và `hoc-tap…/mathematics` (host
   riêng bỏ tiền tố). Nay tiền tố giữ nguyên trên MỌI host — chỉ host đổi.
2. **Alias cũ đi thẳng tới đích cuối.** `/mon-hoc`, `/subjects`, `/phong-hoc`, `/hoc-mon-hoc`
   (mọi độ sâu) và URL cũ không tiền tố của host Góc học tập đều về dạng chuẩn, **giữ nguyên
   query + hash**, dùng `replace` nên Back không kẹt vòng lặp.
3. **Sửa một lỗi chuyển hướng vòng lặp có thật (chỉ lộ khi host mode BẬT).** Luật server cũ chỉ
   phân biệt "một đoạn hay nhiều đoạn", nên `www…/mon-hoc/physics/bai-hoc` bị đẩy sang
   `hoc-tap…/physics/bai-hoc`, host đó lại đá ngược về `www…/physics/bai-hoc` — một đường dẫn
   KHÔNG tồn tại. Nay bảng ownership theo độ sâu (đặc tả §③) quyết định đích cuối ngay chặng
   đầu: danh mục + trang môn → host Góc học tập; bài học STEM, `/lap-trinh` và phần còn lại →
   app host.
4. **Đổi nhãn không gian** ở bottom nav, sidebar desktop, studio, breadcrumb, Profile, About và
   hub: "Phòng Học" / "Phòng Học & STEM" → **"Góc học tập"**. Giữ nguyên "phòng học nhóm" (tính
   năng âm thanh thời gian thực — khác hẳn) và các ví dụ ngôn ngữ trong dữ liệu bài học.
5. **Chuyển hướng mới dùng 302, không 301**, và chỉ áp cho GET/HEAD. 301 bị trình duyệt nhớ
   vĩnh viễn nên rollback sẽ không gỡ ra được; 301 chỉ còn cho luật đã nghiệm thu từ 2026-08-28
   (đẩy đường dẫn ngoài Góc học tập khỏi host Góc học tập).

## Quyết định trong đợt

- **Không đụng tới môn Tiếng Anh, onboarding, dữ liệu hay storage** — đó là slice 02–04, chưa
  được phê duyệt. Không đổi mã môn/bài, khoá localStorage, API, quyền hay trạng thái hoàn thành.
- **Anchor `#mon-hoc` ở hub giữ nguyên**: đó là anchor đã phát hành, không phải đường dẫn app.
- **Mã môn lạ ở lại app host** (`/goc-hoc-tap/khong-co-mon-nay`) để trang "không tìm thấy" hiện
  ra, thay vì đẩy rác sang host kia rồi bị đá ngược.

## Bằng chứng kiểm chứng (đo thật, 2026-09-15)

- `npm run build` ✅ · `npm run typecheck` ✅ · `npm run lint` ✅ (0 cảnh báo) · `npm run format` ✅
- `npx vitest run` ✅ **609 file / 12.593 test**, 0 đỏ (trong đó `subjectsRouting.test.ts` 77 test,
  `subjectsHost.test.ts` 34 test — đều viết lại theo hợp đồng mới).
- E2E: `route-alias` + `bottomnav` + `home-quick-ask` ✅ 38/38 (có 2 test MỚI: alias giữ
  query/hash; Back sau alias không kẹt vòng lặp). Bộ `a11y`, `a11y-aaa`,
  `subjects-catalog-states` và `mobile-layout-guards` ✅ **462/462** (15 trang × 5 theme, AA và AAA, 390px + 320px).
- **Ảnh trước/sau 1440px và 390px** (Tầng 8b): danh mục và danh sách bài STEM giống hệt nhau
  từng điểm ảnh ngoài đúng nhãn đã đổi — không có lỗi lặp/trôi bố cục.
