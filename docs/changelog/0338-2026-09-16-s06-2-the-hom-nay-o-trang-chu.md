# 0338 — 2026-09-16 — S06-2: thẻ "Hôm nay" một CTA học tiếp ở Trang chủ

- **PR:** #— (điền khi tạo) · **Nhánh:** `claude/laughing-babbage-o25bls-s06-2`
- **Đặc tả:** `docs/specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md` §④ S06-2 (Approved for implementation)
- **Tiếp nối:** S06-1 (#941, changelog `0337`) — hợp đồng `TodayPlan` + resolver thuần đã có, PR này là **nơi dùng đầu tiên**.

## Việc đã làm

1. **`apps/dhcb/src/components/Home/TodayCard.tsx` (mới)** — thẻ "Hôm nay": ĐÚNG MỘT nút chính
   ("Học tiếp: …" / "Bắt đầu: …") + tối đa 2 mục phụ, bốn trạng thái (đang tải · sẵn sàng · rỗng ·
   lỗi). Thẻ KHÔNG quyết định gì: điều hướng bằng đúng `TodayItem.href`, không tự ghép URL, không
   có nhánh riêng cho môn nào. Chữ nghĩa tách sang `todayCardText.ts` (`dongNguon`,
   `khoangThoiGian`, `nhanChinh`) để test thẳng.
2. **`HomeAiBriefingCard.tsx`** — bỏ hẳn khối "Kế hoạch hôm nay" + 5 prop
   (`srsDueCount`/`continueLessonLabel`/`continueLevelId`/`onContinueClick`/`hasSubjectProgress`)
   và hàm `runAction` (chứa hai lối `nav('/lo-trinh-hoc…')` hard-code). Giữ lời chào + bản tin +
   "Xem tiến độ"; dòng "Hôm nay đã học x/y từ" nay sau cờ `showDailyWords` (§7 Q5).
3. **`pages/core/Home.tsx`** — xoá `continueLevel` label/`nextLabel`/`goToNextStep`, thay bằng
   `useTodayPlan(uid)`. Comeback, spaces, rail, `?tab=today&cap=3` giữ nguyên (§7 Q3).
4. **`lib/today/useTodayPlan.ts`** — thêm luật **bằng chứng trước, gợi ý sau** (xem Quyết định 1).
5. **`lib/programmingProgress.ts`** — thêm `fetchProgressWithStatus` trả kèm cờ `fromCache`;
   `fetchProgress` thành vỏ mỏng gọi nó (4 nơi gọi cũ KHÔNG đổi hành vi). Có cờ này thẻ mới nói
   thật được "Chưa tải được tiến độ · Thử lại" thay vì im lặng hiện số cũ.
6. **Test:** `TodayCard.test.tsx` (10 ca: một CTA · ≤ 2 mục phụ · regex cấm con số chẩn đoán ·
   phiên dở · 4 trạng thái), `HomeAiBriefingCard.test.tsx` +2 ca bất biến mới, E2E
   `e2e/today-plan.spec.ts` (5 ca: phiên Lập trình dở → 1 bấm tới đúng bài · người mới → chọn môn ·
   chỉ Anh → đúng cấp CEFR · lỗi tiến độ → CTA + Thử lại · khách → 0 lượt gọi AI).
   `UiNoise.design.test.ts` thêm allowlist `animate-pulse` cho skeleton của thẻ.

## Quyết định trong lúc thi hành

1. **Một môn chỉ góp tín hiệu khi có BẰNG CHỨNG thật** (`useTodayPlan`). Đo bằng ảnh chụp và E2E:
   `findNextStep`/`pickNextLesson` luôn trả "bài đầu tiên" cho người chưa học gì, nên bản đầu của
   thẻ mời người dùng mới "Học tiếp: Chương trình đầu tiên" — đúng kiểu bịa tiến độ mà AC-8 cấm
   với STEM, chỉ khác môn. Nay môn Anh cần `learned/doneGrammar/examPassed` khác rỗng (đúng phép
   thử `hasEnglishProgress` mà Home vẫn dùng), môn Lập trình cần ≥ 1 dòng tiến độ; phiên dở luôn
   được tính. Không có gì → `pick` về `/goc-hoc-tap` (AC-3, AC-12c).
2. **`fetchProgressWithStatus` thay vì đổi `fetchProgress`.** `fetchProgress` nuốt lỗi và trả cache
   nên `state:'error'` của hook là nhánh chết. Thêm hàm mới giữ 4 nơi gọi cũ y nguyên, rủi ro 0.
3. **Nhãn CTA `Học tiếp: <tên bài>`** (và `Bắt đầu: …` khi `pick`) để tên truy cập được luôn mở
   đầu đúng khuôn E2E đếm, kể cả khi việc chính là ôn tập.

## Bằng chứng

- Cổng: build ✅ · typecheck ✅ · lint ✅ (0 cảnh báo) · format ✅ · `test:coverage` ✅ ·
  `e2e/today-plan.spec.ts` 5/5 · `a11y.spec.ts` + `a11y-aaa.spec.ts` ✅ · `comeback` ·
  `session-cap` · `continue-viewing` · `home-quick-ask` · `programming-home` ✅.
- Tầng 8b: ảnh 1440/768/390/320 × 3 trạng thái dữ liệu, trước/sau, dán trong mô tả PR.
