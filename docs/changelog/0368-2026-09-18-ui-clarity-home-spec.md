# 0368 — 2026-09-18 — Đặc tả giảm nhiễu Trang chủ UX-R2

## Kết quả

- Đối chiếu `main@806e77c0`: PR #1020 đã merge UX-R1 reliability/touch cho `/tien-do`.
- Soạn đặc tả UX-R2 cho member Home theo progressive disclosure ở mobile 320/390px; desktop
  1440px giữ đủ chức năng.
- Chốt đúng bốn file runtime cho worker sau review: `Home.tsx`, `HomeAiBriefingCard.tsx`,
  `HomeUniversalAiBar.tsx`, `SubjectSpaceList.tsx`.
- Chốt hierarchy Companion → Hôm nay, một entry Tiến độ, năm prompt chip collapsed trên mobile,
  danh sách môn/Sự nghiệp compact nhưng empty CTA `Thử 5 phút` được giữ.
- Đặt cổng đo: Home data ≤1.700px ở 390, ≤1.850px ở 320; 0 chip focusable trước disclosure;
  đúng một entry Tiến độ; ảnh/state/a11y cho ba theme.
- Adversarial review vòng đầu BLOCK **2 critical · 7 major · 2 minor**. Bản sửa đóng toàn bộ:
  giới hạn đếm Tiến độ trong `<main>`; subject toggle luôn mounted + focus/Tab; canonical fixture
  và settle protocol; responsive state qua `isDesktop || expanded`; nội dung Companion theo state;
  desktop guard; dọn motion trong bốn file; phạm vi 44px; artifact CI qua `testInfo.attach`; zero-
  network negative control; decision record D1–D10.
- Re-review vòng hai BLOCK **2 critical · 4 major · 1 minor**. Bản sửa tiếp chốt: DOM mobile môn
  1–3 → toggle → list 4–6 và Tab tự nhiên; evidence B (BEFORE local, AFTER artifact CI);
  `effectiveExpanded` cho subject; fixture tắt bốn shell prompt/banner; Date init-script + RAF
  thật; CLS PerformanceObserver trước render; `member-error` tách khỏi validation; D11–D14.
- Re-review vòng ba BLOCK **1 critical · 1 major**. Bản sửa chốt controlled panel/list luôn
  mounted và đóng bằng HTML `hidden`, stable IDREF + axe/tab assertions; desktop không render
  toggle. Resize mobile→desktop khi prompt toggle đang focus chuyển focus tới chip đầu trước khi
  unmount; focus nơi khác giữ nguyên; thêm D15.
- Independent final review: **PASS — 0 critical · 0 major · 0 minor**. Theo mandate của chủ dự án
  “giao subagent theo từng PR cho tới khi hoàn thành”, spec đổi sang **Approved for implementation
  — chỉ UX-R2**; không mở quyền cho UX-R3, UX-R4 hoặc P2-10.

## Phạm vi và trạng thái

Docs-only; không source, test runtime, API, schema, migration, dependency hoặc production. UX-R3,
UX-R4 và P2-10 nằm ngoài phạm vi. Source chỉ bắt đầu sau khi PR spec Approved này merge vào main;
PR source riêng phải tuân toàn bộ AC/evidence trong spec.

## Validation

- Prettier check các Markdown thay đổi.
- `git diff --check`.

Kết quả: PASS trên Node 22.23.2; không chạy runtime test vì PR chỉ thay Markdown.
