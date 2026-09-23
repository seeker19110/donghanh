# S06 — Bài hội thoại và pill lĩnh vực Companion

Ngày 2026-09-23; worktree accessibility, Node 22.23.2. Đây là evidence targeted trên
working tree sau sửa, không thay kết quả complete gate/commit CI của primary.

## Phân biệt lỗi nguồn và giới hạn phép đo

- LessonList có tình huống `truncate` thật: mẫu bài 8 rộng 256px, dòng chữ vượt khung;
  geometry gốc ghi `clipped: true`. Đã đổi sang `break-words`, thẻ tăng cao tự nhiên.
- Scroll để đo bài 8 kích hoạt lazy-load, selector dựa màu cũng khớp bài 18. Đây là
  lỗi định danh cho phép đo, khác clipping. Đã thêm id ổn định từ lesson.id cho button,
  số bài, tiêu đề và tình huống; không đổi scrollbar hoặc ẩn nội dung khỏi scanner.
- Sidebar “Tiến độ” chỉ nằm ngoài scrollport, chưa thấy overlap thật khi quan sát;
  không sửa DesktopSidebar. Đo lại sau cuộn do helper phụ trách.
- Companion ở chat mặc định có pill lĩnh vực đang chọn dùng gradient (`from-accent-500`),
  khiến axe AA chưa xác định nền. Đã dùng `bg-accent-500 text-black` theo token selected
  button sẵn có, giữ nhãn, ring và hành động. Không đổi voice hoặc gọi provider.

## Kiểm tra

- Browser regression `e2e/lesson-list-visibility.spec.ts`: **2/2 pass**, 390 và 1440px.
  Tải thêm làm tăng số thẻ; ID toàn danh sách vẫn duy nhất, đích tình huống bài 8 còn
  đúng một phần tử, nội dung không tràn ngang phần tử.
- Targeted AAA `/ban-dong-hanh`: **3/3 theme pass** (dark-blue, blue-sky, kid).
- Targeted AAA `/bai-hoc`: **3 theme còn unresolved tại lượt này**, không báo xanh.
  Raw đo lại chỉ ra số bài 7 bị DOM thay đổi do lazy append; tiêu đề bài 9 và số/tiêu đề
  bài 10 có AA pass tỷ lệ 6.11–6.82 nhưng enhanced dưới 7. Chúng được classifier xếp
  chrome, nên việc collector phân biệt ngưỡng AA/AAA và snapshot sau scroll được bàn
  giao S06; không hạ ngưỡng chữ đọc hoặc bỏ incomplete.
- Codemap StudioDialogue đã ghi 4 consumer từ lượt trước. Rerun codemap cả hai hotspot
  bị OOM khi refresh graph; đã dừng, dùng rg xác nhận LessonList có hai caller trong
  Lessons.tsx (desktop compact và layout còn lại). Không báo codemap rerun đạt.
- ESLint hai source và E2E mới: pass. Prettier và diff-check: pass.

## Ảnh đã quan sát

Ảnh local ngoài repo, tại `C:/Users/liend/.codex/uiux-implementation/artifacts/`:

- `geometry-lessons.png`, `geometry-sidebar.png`: trước sửa, 1280px, minh chứng scrollport.
- `lesson-list-after-390.png`, `lesson-list-after-1440.png`: sau sửa, chữ tình huống
  xuống dòng đầy đủ; giữ danh sách và điều hướng hiện có.
- `companion-after-390.png`, `companion-after-1440.png`: sau sửa, freeze animation
  trước chụp; pill “Tự động” có chữ đen trên nền token đục.

Không gọi ảnh 1280px trước sửa là cặp trước/sau 390/1440. Ảnh là quan sát kỹ thuật,
không phải NVDA/VoiceOver hoặc nghiệm thu người học. Primary cần lưu artifact có thể
truy cập từ PR và chạy lại gate sau tích hợp helper cuối.
