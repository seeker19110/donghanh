# Đặc tả GĐ2 — VIP học tự do (môn Anh), Free đi tuần tự

**Ngày:** 2026-09-12 · **Trạng thái:** ⛔ CHƯA duyệt — đọc §0.1 trước, có một quyết định kiến
trúc phải chốt · **Phụ thuộc:** GĐ1 phải merge trước (cần khái niệm gói đã gọn còn Free/VIP)

## 0. Một câu

Người dùng **VIP** được vào thẳng bất kỳ cấp CEFR nào (A1→C2) mà không cần đạt điều kiện mở khoá;
người dùng **Free** vẫn phải đi tuần tự từ A1 và thi đạt mới lên cấp — đúng luật đang chạy.

## 0.1. ⚠️ QUYẾT ĐỊNH KIẾN TRÚC PHẢI CHỐT TRƯỚC

**Luật khoá cấp hiện NẰM HOÀN TOÀN Ở CLIENT.** Khảo sát mã 2026-09-12:

- `apps/dhcb/src/lib/cefrProgress.ts` tính `computeLockedMap` **trong trình duyệt**, nguồn dữ
  liệu là `localStorage` (`et_cefr_unlocked_*`).
- Server (`apps/server/src/api/core/progress.ts` dòng 197) chỉ **lưu hộ**:
  `cefrUnlocked: mergeArrayUnion(existing, d.cefrUnlocked)` — **tin thẳng mảng client gửi lên**,
  không kiểm chứng gì.
- Không có API nào gác nội dung bài học theo cấp — client tự quyết hiển thị gì.

Hệ quả: hôm nay **ai cũng có thể mở mọi cấp** bằng cách sửa localStorage. Chừng nào quyền mở khoá
không phải quyền trả tiền thì điều đó vô hại. **Nhưng GĐ2 biến "học tự do" thành đặc quyền VIP
trả tiền** — nếu vẫn để ở client thì đó là paywall giả: bất kỳ ai cũng vượt được trong 10 giây.
Điều này vi phạm CLAUDE.md mục 4.2 ("logic nhạy cảm — kiểm quyền — luôn ở server").

Hai đường đi, chọn một:

|               | **(A) Paywall thật — chuyển kiểm quyền về server**                                                                            | **(B) Chỉ là trợ giúp giao diện, không phải paywall**                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Việc phải làm | Server gác: `progress.ts` từ chối `cefrUnlocked` mà user không đủ điều kiện (trừ VIP); nội dung cấp khoá không trả về qua API | Giữ nguyên client, chỉ thêm nhánh `if (plan === 'vip') → không khoá` |
| Công sức      | Lớn — đổi hợp đồng API, cần migration lưu bằng chứng thi đạt server-side                                                      | Nhỏ — ~20 dòng                                                       |
| Trung thực    | Đúng: trả tiền mới vượt được                                                                                                  | Người biết kỹ thuật vượt được miễn phí                               |
| Rủi ro        | Có thể chặn nhầm người dùng cũ đã grandfather                                                                                 | Thấp                                                                 |

**Khuyến nghị: (B) trước, (A) sau — và nói thật trên trang bán hàng.** Lý do: (1) dự án chưa có
người học thật nào (xem `PROGRESS.md` ưu tiên 1), làm paywall chống gian lận trước khi có người
dùng là tối ưu hoá sớm; (2) "học tự do" là **tiện lợi**, không phải nội dung độc quyền — người
vượt rào vẫn không nhận thêm nội dung nào mà Free không có; (3) (A) đụng `progress.ts` — file vừa
được sửa ở PR #883, đang là hotspot. Nếu chủ dự án muốn paywall nghiêm ngặt thì chọn (A) và **tách
thành GĐ2b riêng**, đừng gộp.

## ① Phạm vi

### LÀM (giả định chọn phương án B)

1. VIP: mọi cấp CEFR đều mở, không phụ thuộc `examPassed` hay `et_cefr_unlocked_*`.
2. Free: **giữ nguyên 100%** luật hiện tại (A1 mở; cấp sau cần thi đạt cấp trước; grandfather).
3. Giao diện nói rõ vì sao mở: VIP thấy nhãn kiểu "Mở tự do (VIP)" ở cấp mà Free sẽ thấy ổ khoá —
   không để người dùng tưởng mình đã đạt điều kiện.
4. Hạ VIP → Free (hết hạn) **không xoá tiến độ**: cấp đã thực sự thi đạt vẫn mở; cấp chỉ mở nhờ
   VIP thì khoá lại. Tức là **không ghi cấp mở-nhờ-VIP vào `et_cefr_unlocked_*`**.

### KHÔNG làm

- Không đụng luật thi cuối cấp (`isExamEligible`, ≥70% từ vựng + 100% ngữ pháp) — VIP vẫn phải
  học đủ mới **được thi**, chỉ khác là được **vào xem/học** cấp bất kỳ.
- Không đụng môn Lập trình / 4 trụ (GĐ3, GĐ4).
- Không chuyển kiểm quyền về server (đó là GĐ2b nếu chọn (A)).

## ② Điểm chạm

| File                                                                                                                            | Sửa gì                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/dhcb/src/lib/cefrProgress.ts`                                                                                             | `computeLockedMapPersisted(uid, levels, examPassed)` thêm tham số `plan: Plan`; `plan === 'vip'` → trả map toàn `false`. **`computeLockedMap` (hàm thuần) giữ nguyên chữ ký** để test cũ không vỡ |
| `persistUnlockedLevels` (cùng file)                                                                                             | Thêm chốt: **không** ghi vào `et_cefr_unlocked_*` những cấp chỉ mở vì VIP (nếu ghi, hạ gói sẽ vẫn mở vĩnh viễn — sai §①.4)                                                                        |
| `apps/dhcb/src/pages/subjects/english/CefrLevelPage.tsx`, `EnglishHome.tsx`, `components/RoadmapTab.tsx`, `pages/core/Home.tsx` | Truyền `plan` vào; hiện nhãn "Mở tự do (VIP)"                                                                                                                                                     |

`npm run codemap -- callers apps/dhcb/src/lib/cefrProgress.ts#computeLockedMapPersisted` trước khi sửa.

## ③ Hợp đồng dữ liệu

**Không có migration.** Không thêm cột, không đổi schema. `plan` đọc từ nguồn sẵn có (context
user phía client).

## ④ Tiêu chí chấp nhận

1. User VIP, chưa thi cấp nào → `computeLockedMapPersisted` trả **tất cả `false`** cho A1–C2.
2. User Free, chưa thi cấp nào → A1 mở, A2–C2 khoá (đúng như hôm nay — test hiện có phải còn xanh).
3. User VIP mở cấp B2 rồi hết hạn VIP → B2 khoá lại; cấp đã **thi đạt** vẫn mở.
4. VIP vào cấp C1 nhưng chưa đủ 70% từ vựng → **nút "Thi cuối cấp" vẫn tắt** (không được bỏ qua
   điều kiện dự thi).
5. Toàn bộ test cũ của `cefrProgress.test.ts` xanh không sửa (chứng minh Free không đổi hành vi).
6. Cổng a11y `e2e/a11y.spec.ts` + `a11y-aaa.spec.ts` xanh với nhãn mới (tương phản AA/AAA).

## ⑤ Bất biến không được phá

- **Grandfather không được mất:** người đã mở cấp theo luật cũ giữ nguyên quyền (lý do ghi rõ ở
  `cefrProgress.ts` dòng 183–188 — đọc trước khi sửa).
- `computeLockedMap*` phải **THUẦN** (gọi được trong `useMemo`) — ghi localStorage chỉ ở
  `persistUnlockedLevels` gọi từ `useEffect`. Nợ này đã trả ở 2026-08-24, **đừng tái phạm**.
- Free không đổi một hành vi nào.

## ⑥ Quy ước dự án liên quan

- Đây là `feat(` → mô tả PR phải trỏ file đặc tả này + "Approved for implementation".
- Chạm giao diện → **BẮT BUỘC Tầng 8b**: ảnh chụp 1440px + 390px trước/sau
  (`docs/framework/QUY-TRINH-AUDIT.md`).
- Không sửa `apps/dhcb/src/prompts/*` nên không cần `eval:tutor`.

## Nghiệm thu

- [ ] Đã chốt phương án (A) hay (B) ở §0.1 — ghi quyết định + ngày vào đây
- [ ] 6 tiêu chí §④ đạt · [ ] Có ảnh chụp Tầng 8b
