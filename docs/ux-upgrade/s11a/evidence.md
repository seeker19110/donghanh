# S11a — Khôi phục deep-link từ sổ lỗi STEM

Base `bdf4b838`, Node 22.23.2, Windows, 2026-09-23. Đây là bugfix của route đã có,
không phải hoàn tất feature S11 rộng hoặc phê duyệt grouped spec S09–S12.

## Lỗi và thay đổi

`mistakeRoutes.neoCauHoi` đã xuất `#cau-N`, nhưng trang bài không dựng id tương ứng.
E2E sổ lỗi cũ chỉ kiểm href. Câu hỏi nay có id từ cùng builder, focus được bằng mã
lệnh; sau nội dung tải xong hoặc hash đổi, trang focus/scroll tới câu. Hash #cau- sai/câu
không còn tồn tại về tiêu đề cùng bài; hash khác và URL không hash không bị chiếm focus. `scroll-mt-24` chừa chỗ header; cuộn instant
không tạo chuyển động cho người yêu cầu reduced motion. Không đổi route/schema,
draft/checked/answers, grader, attempt hoặc cơ chế gửi evidence.

Codemap impact trước edit: App.tsx, StemLesson.test.tsx, main.tsx. Áp dụng UI,
principal và pedagogy theo phạm vi sửa navigation; không đổi nội dung sư phạm.

## Kiểm chứng hiện tại

- Regression mới trước sửa: 6 fail do không có đích/focus, chứng minh thiếu behavior.
- Unit cuối sau review giới hạn namespace hash: **28 pass / 2 files** (8 deep-link,
  20 StemLesson hiện hữu), chạy bằng Node22 `vitest run` hai file với `--maxWorkers=1`.
  Fixture nguồn được preload để act chờ effect xác định; browser mới kiểm tải cold thật.
- Lint ba file source/test: pass sau sửa test Navigation cập nhật ngoài render bằng effect.
- E2E mới: click link thật từ sổ lỗi, focus/viewport dưới header, giữ choice qua Back/
  reload, không POST evidence ở 390/1440; thêm hash không tồn tại. **Chưa có pass**.
  Lượt đầu sai cấu hình Vite làm trang rỗng; đã sửa config. Lượt tiếp Node OOM và Vite
  Rust allocation failure trong môi trường chạy nhiều suite; server chết khiến lượt
  cuối connection refused. Sau khi suite khác dừng, Vite vẫn Rust allocation failure và
  Playwright worker thoát mã 3221226505; đã dừng retry sau ba lượt lỗi tài nguyên.
  Không coi các lượt setup/resource này là chứng minh UI đạt; cần CI/môi trường đủ RAM.
- Full build/typecheck/lint/format/unit/E2E: primary sẽ chạy/CI sau review; chưa báo đạt.

Chưa commit/push trong lượt agent. Root review trước publish. Không migration;
rollback revert ba file source/tests của slice, không xóa nháp/evidence. Manual AT,
thiết bị thật và pilot thuộc S12 vẫn chưa thực hiện.
