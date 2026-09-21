---
description: Phỏng vấn dồn dập để làm rõ một ý tưởng/kế hoạch/quyết định trước khi code — hỏi theo đợt, mỗi câu kèm đề xuất, tự tra sự kiện, dừng khi hết mơ hồ; gợi ý /adr khi có quyết định khó đảo
---

Chạy một phiên **phỏng vấn dồn dập** để đạt hiểu biết chung với người dùng trước khi hành động —
kỹ thuật thực thi cụ thể cho CLAUDE.md mục 12 ("khi nào phải dừng và hỏi") và mục 3 ("chủ động
góp ý"). (Nguồn: `seeker19110/projects-template` `.claude/commands/grill.md`, khớp DHCB
2026-09-21.)

> Dùng khi: yêu cầu người dùng mơ hồ/nhiều cách hiểu; một quyết định thiết kế có nhiều nhánh chưa
> chốt (tính năng mới, đổi cấu trúc); hoặc gõ `/grill` trực tiếp. Người làm ở dự án này **mới
> bắt đầu lập trình** — giải thích ngắn gọn bằng tiếng Việt trong lúc hỏi, tránh thuật ngữ không
> giải thích.

## Cơ chế — cây quyết định theo đợt (round)

1. **Dựng cây quyết định:** hình dung mọi thứ cần chốt cho việc đang bàn như một cây — mỗi
   quyết định phân nhánh ra các quyết định phụ thuộc vào nó.
2. **Tính "biên hỏi được" (frontier):** mọi câu hỏi mà **tiền đề của nó đã được trả lời** — hỏi
   được ngay, không phải đoán trước câu trả lời chưa nghe.
3. **Hỏi cả biên trong một đợt**, đánh số, mỗi câu kèm đề xuất:

   ```
   ❓ **C1** — **<tên câu hỏi>**: <nội dung, có thể nhiều lựa chọn>

   ➡️ <đề xuất của bạn>
   ```

   Câu nào còn phụ thuộc câu khác chưa trả lời trong đợt này → để dành đợt sau, không hỏi dồn.

4. **Chờ người dùng trả lời cả đợt**, rồi tính lại biên (câu vừa chốt có thể mở khóa câu phụ
   thuộc nó) và hỏi đợt tiếp.
5. **Việc tìm SỰ KIỆN luôn là việc của bạn, không phải người dùng.** Câu hỏi ở biên cần một dữ
   kiện từ môi trường (đọc file, tra phiên bản, tìm quy ước hiện có trong `CLAUDE.md`/`PROJECT.md`
   /`docs/`) → tự tra hoặc giao subagent `lookup`/`version-check`, **không hỏi người dùng thứ tự
   tra được**. Chỉ những câu phụ thuộc dữ kiện đó mới đợi, phần còn lại của biên vẫn hỏi luôn.
6. **Việc QUYẾT ĐỊNH luôn là việc của người dùng.** Đưa ra đề xuất, không tự chốt thay — đúng
   CLAUDE.md mục 9 "Quyết định tích hợp ... là của người dùng — AI trình bày lựa chọn, không tự
   chọn thay".
7. **Kết thúc khi biên rỗng** — không còn nhánh bỏ ngỏ, không còn gì bạn đang ngầm giả định. Xác
   nhận lại với người dùng đã đạt hiểu biết chung rồi mới hành động tiếp (viết spec, tạo ADR,
   hoặc bắt tay code).

## Trong lúc phỏng vấn

- **Quyết định vừa chốt khó đảo + gây bất ngờ nếu không biết lý do + có đánh đổi thật** (cả 3) →
  đề xuất ghi ADR: "Ghi lại quyết định này bằng `/adr` để phiên sau không vô tình lật ngược?".
- Tính năng cần bảng/cột DB mới hoặc endpoint mới lộ ra trong lúc hỏi → sau khi biên rỗng, chuyển
  sang `/contract` trước khi code.

## Bất biến

- Không tự chốt thay người dùng ở bất kỳ nhánh nào — kể cả khi biên chỉ còn 1 câu "hiển nhiên".
- Không hỏi lại thứ đã có sẵn trong code/tài liệu (CLAUDE.md mục 5 — chống ảo giác).
- Việc lớn quá 1 phiên (nhiều tính năng, nhiều tuần) → sau khi biên rỗng, đề xuất kế hoạch chia
  nhỏ (CLAUDE.md mục 3 "Chia nhỏ") thay vì cố phỏng vấn hết trong một lượt.

Bắt đầu: dựng nhanh cây quyết định cho việc đang bàn, tính biên đợt đầu, rồi hỏi.
