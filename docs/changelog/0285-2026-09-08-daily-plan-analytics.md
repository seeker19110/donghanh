# 0285 — P1.2 đo Daily Learning Plan

## Mục tiêu

P1.1 mới chỉ thay thứ tự hard-code bằng planner deterministic. P1.2 bổ sung bằng chứng hành vi để biết gợi ý nào thật sự được nhìn thấy và được bấm, trước khi thay đổi thuật toán tiếp.

## Thay đổi

- thêm hai event whitelist: `daily_plan_impression`, `daily_plan_click`;
- `ref_code` lưu `action.kind` (`srs_review`, `continue_learning`, `discover_path`);
- `utm_source` lưu phiên bản planner `p1.1`, giúp so sánh các phiên bản sau mà không migration;
- Home bắn impression theo tập action ổn định, không bắn lặp khi briefing/loading re-render;
- click được ghi trước navigation;
- Admin Analytics có nhãn cho hai event mới.

## Guardrails

- không thêm cookie/tracker bên thứ ba;
- không lưu nội dung học hay dữ liệu nhạy cảm vào analytics;
- chưa coi click là completion. Completion phải được suy ra từ event học/server state ở slice kế tiếp, không nhận một event `complete` tùy ý từ client.

## Tiếp theo

P1.3: định nghĩa completion server-derived theo action kind và thêm funnel impression → click → completion/return.

## Sửa cổng CI — 2026-09-08, PR #879

- Chuẩn hóa Prettier cho các file bị CI báo sai định dạng.
- Cập nhật test câu dự phòng theo Daily Plan, giữ kiểm tra không khen streak khi thiếu dữ liệu.
- Giới hạn nhấp nháy còn đúng hai dòng skeleton; số cũ tính thêm một comment đã bị xóa.
- Unmount component sau mỗi test và mock analytics để test giao diện không gửi request nền.
- Kiểm tra tại máy: 11/11 test liên quan và 12.172/12.172 unit test đạt.
- E2E tại máy chưa chạy được do thiếu Chromium; phải đọc kết quả CI của commit sửa trước merge.
- Admin hiện tổng hợp theo event/ngày; phân tích theo action kind/version và completion thuộc bước tiếp theo.
