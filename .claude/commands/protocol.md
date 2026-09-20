---
description: In trạng thái hiện tại của một feature theo AI_DEVELOPMENT_PROTOCOL.md — vai chịu trách nhiệm + việc còn thiếu để chuyển trạng thái
argument-hint: <feature-id hoặc đường dẫn docs/specs/*.md>
---

Đọc `docs/AI_DEVELOPMENT_PROTOCOL.md` (đặc biệt §2.1 bảng điều kiện chuyển và §4 bảng 5 vai) rồi trả lời cho spec `$ARGUMENTS` — thay việc người dùng phải tự nhớ hai bảng đó (protocol §12 mục 2).

`$ARGUMENTS` có thể là: đường dẫn file spec (`docs/specs/2026-09-20-x.md`), hoặc một `feature.id` (CHỮ_HOA_SNAKE) — tìm file spec chứa đúng `id: <feature-id>` trong khối \`\`\`yaml `feature:` bằng `rg "id: $ARGUMENTS" docs/specs/`.

## Việc cần làm

1. **Tìm file spec**, đọc dòng `Trạng thái: **XXX**` ở header. Không tìm thấy file hoặc không có dòng trạng thái → nói rõ: "spec này chưa tham gia AI_DEVELOPMENT_PROTOCOL (không có header `Trạng thái:`)", không suy diễn thêm.
2. **Chạy máy kiểm trước khi kết luận bất cứ điều gì**: `npx tsx scripts/protocol-check.ts` và đọc phần liên quan tới file này trong output (không đoán — nếu script báo vi phạm, đó là sự thật, không phải "chắc là ổn").
3. In đúng khuôn sau:

```
Feature: <id> — <name>
Spec: docs/specs/<file>.md
Trạng thái hiện tại: <STATE>
Vai chịu trách nhiệm (theo §4): <vai>
Artifact bắt buộc ở trạng thái này (theo §2.1): <liệt kê>
Đã có / còn thiếu:
  - [✓|✗] <artifact 1> — <bằng chứng hoặc lý do thiếu>
  - [✓|✗] <artifact 2> — ...
protocol-check.ts: <OK | N vi phạm — liệt kê>
Điều kiện để sang trạng thái kế tiếp (<NEXT_STATE>): <điều kiện từ bảng §2.1>
```

4. Nếu spec đang ở `FAIL` hoặc có khối `reject:` chưa được xử lý (không có commit/PLAN.md task nào giải quyết `ref` của nó) → nêu rõ REJECT đó, `owner`, và trạng thái sẽ quay về theo bảng định tuyến §3.6.
5. **KHÔNG tự đổi trạng thái, KHÔNG tự ghi artifact còn thiếu** — lệnh này chỉ ĐỌC và BÁO CÁO. Đổi trạng thái là việc của vai chịu trách nhiệm, theo đúng cổng của trạng thái đó.
