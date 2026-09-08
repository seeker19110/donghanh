# 0284 — Daily Learning Plan deterministic (P1.1)

## Mục tiêu

Biến hai gợi ý trên Home từ thứ tự hard-code trong React thành một planner thuần, deterministic-first.
Planner chỉ xếp hạng tín hiệu đã có sẵn (SRS đến hạn, bài đang học, nhịp từ/ngày), không gọi AI,
không mutate trạng thái và chưa phụ thuộc Life Graph.

## Quy tắc slice này

- SRS đến hạn được ưu tiên trước bài mới vì có tính cấp thời theo cơ chế quên.
- Nếu không có SRS, tiếp tục mạch đang học là ưu tiên cao nhất.
- Khi thiếu tín hiệu, trả fallback an toàn sang lộ trình học.
- Chỉ trả tối đa 2 việc để giữ Home tập trung.
- Mỗi việc có `reason` và `estimatedMinutes` để UI giải thích được tại sao nó được chọn.

## Phạm vi

- `apps/dhcb/src/lib/dailyLearningPlan.ts`
- `apps/dhcb/src/lib/dailyLearningPlan.test.ts`
- `apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx`

Không schema, không API, không model call, không deploy riêng.

## Sửa cổng CI — 2026-09-08, PR #878

- Chuẩn hóa Prettier cho component và đặc tả roadmap.
- Đồng bộ test câu dự phòng với Daily Plan; giữ kiểm tra không khen streak khi thiếu dữ liệu.
- Giới hạn nhấp nháy tính đúng hai dòng skeleton, bỏ phần đếm comment đã bị xóa.
- Unmount component sau mỗi test để không giữ state/DOM giữa các ca.
- 11/11 test liên quan và 12.172/12.172 unit test đạt trên Node.js 22; cần CI của commit sửa đạt trước merge.
