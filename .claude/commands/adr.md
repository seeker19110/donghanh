---
description: Tạo ADR mới (bản ghi quyết định kiến trúc) từ mẫu docs/adr/0000-template.md; đánh số tăng dần, không sửa ADR cũ
---

Tạo một **ADR (Architecture Decision Record)** mới cho một quyết định kỹ thuật quan trọng, khó
đảo. (Nguồn: `seeker19110/projects-template` `.claude/commands/adr.md`, khớp DHCB 2026-09-21.)

> Khi nào cần ADR: quyết định kiến trúc/công nghệ lớn, khó đảo, ảnh hưởng nhiều nơi — ví dụ đổi
> nhà cung cấp DB/AI, đổi cấu trúc workspace, xoá hẳn một mảng tính năng. Khác `docs/changelog/`
> (ghi ĐÃ LÀM GÌ theo đợt việc) — ADR ghi **TẠI SAO** một quyết định được chọn, để một phiên AI
> mới không vô tình lật ngược quyết định cũ mà không biết lý do. Ví dụ đã có:
> `docs/adr/0009-thoat-ly-supabase-postgres-tu-host.md`,
> `docs/adr/0010-xoa-ba-tru-career-startup-life.md`.

## Bước 1 — Đánh số & đặt tên (không đoán)

1. Đọc `docs/adr/` → tìm số ADR lớn nhất hiện có → số mới = **kế tiếp**, đệm 4 chữ số.
2. Tên file: `docs/adr/000X-<slug-ngan-gon-khong-dau>.md`.

## Bước 2 — Soạn nội dung theo mẫu

Sao cấu trúc từ `docs/adr/0000-template.md`, điền đủ: **Trạng thái** (Đề xuất / Đã chấp nhận /
Đã thay thế bởi ADR-XXXX) · **Ngày** (YYYY-MM-DD) · **Bối cảnh** · **Quyết định** · **Lý do**
(phần quan trọng nhất) · **Các phương án đã cân nhắc** (2–3 ứng viên thật, ưu/nhược, vì sao
loại) · **Hệ quả** (tích cực / đánh đổi-rủi ro / việc tiếp theo).

Nếu quyết định chạm **phiên bản/thư viện**: tuân research-first (CLAUDE.md mục 5) — xác minh
bằng nguồn sống (giao subagent `version-check` nếu cần) và ghi ngày xác minh; không khẳng định
khả năng API theo trí nhớ.

## Quy tắc bất biến

- **KHÔNG sửa ADR cũ.** Đổi ý → viết ADR mới, đánh dấu ADR cũ "Đã thay thế bởi ADR-XXXX".
- ADR ở trạng thái "Đề xuất" cần **người dùng duyệt** trước khi chuyển "Đã chấp nhận" — đúng
  CLAUDE.md mục 12 (đụng breaking change/kiến trúc lớn → dừng và hỏi).
- Sau khi tạo: nếu là quyết định stack, đối chiếu/cập nhật CLAUDE.md mục 6 cho khớp.

Hỏi nhanh **quyết định cần ghi là gì** (nếu chưa rõ), rồi làm Bước 1.
