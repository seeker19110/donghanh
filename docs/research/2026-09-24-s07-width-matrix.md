# S07 — reflow 320/768 khi Chrome zoom 200%

**Kết luận kỹ thuật: có một vùng tab CEFR dưới ngưỡng 44 px; S07 tổng thể vẫn PARTIAL.** Đo trên source `9c3e2fa27d9da5b4ea5675f7abaec4abe3af2106` bằng Chrome 153.0.8010.53 headless/Windows, Page zoom 200% trong `chrome://settings/appearance`, ba theme và bốn route Home, Placement, kết quả STEM Vật lí, CEFR quiz. Tài khoản/API giả lập; không gọi dịch vụ thật. Script và `results.json` ở ngoài repo: `C:\Users\liend\.codex\uiux-implementation\qa-s07-widths\`; SHA256 JSON `aa5e1e333176fd88b62329d61008de94980b9ccce95ae62864692c874c136cb2`.

| CSS viewport            |  Ca | DPR 2 | Không tràn ngang document/body | Lỗi harness |
| ----------------------- | --: | ----: | -----------------------------: | ----------: |
| 320 px (cửa sổ 640 px)  |  12 |    12 |                             12 |           0 |
| 768 px (cửa sổ 1536 px) |  12 |    12 |                             12 |           0 |

Đây là probe reflow, không phải nghiệm thu cả màn: Home ở fallback API, Placement chỉ màn bắt đầu, STEM một response giả lập, CEFR một câu hỏi qua `?tab=quiz`. Không kiểm pinch, bàn phím ảo, NVDA/VoiceOver hoặc thiết bị thật.

Ở CEFR 320 px, sáu nút “Bài học”, “Hôm nay”, “Ôn SRS”, “Nghe”, “Từ khó”, “Kiểm tra” đều rộng **43 px**, cao 52 px. `CefrLevelPage.tsx` dùng `grid-cols-6 gap-1.5`; phần rộng 288 px sau lề không đủ sáu nút 44 px cộng năm khoảng 6 px. Đây là trường hợp cụ thể không đạt ngưỡng vùng tương tác **44×44 CSS px của dự án**. Ở 390 px mỗi nút rộng khoảng 54,7 px. Nút điều hướng “Tiếng Anh” 36×36 px cũng cần review, nhưng là control shared và không thuộc slice sửa tab CEFR. Skip link 1×1 khi chưa focus là phép đo thô khác, không tự tính là vi phạm.

Đề xuất slice S07b: dưới 340 CSS px chuyển hàng tab thành ba cột/hai hàng, từ 340 px giữ sáu cột; giữ thứ tự DOM, `aria-pressed`, trạng thái phiên và URL. Đo lại box/hit target sáu nút ở 320/390, ba theme và kiểm keyboard/focus. Bằng chứng này đủ mở sửa bố cục hẹp, **không** chứng minh các AC thiết bị thật của S07 đã đạt.
