# 0323 — 2026-09-15 — Đặc tả kiến trúc Góc học tập

- Đặc tả đổi tên/URL xuyên client/server/hub, alias cũ, query/hash và quyền sở hữu route theo host; giữ origin của dữ liệu bài học. Không đổi DNS hay storage.
- Tiếng Anh là môn ngang hàng; chia riêng PR 02–04 cho trang môn, công cụ chuyên môn và bỏ mặc định English. Chưa phê duyệt source các slice này.
- Goal đối chiếu #920–#924 trên main `f5beb7a1`; Markdown đã có, toán và continuity còn thiếu. Ghi đúng quyền người dùng đã cấp cho auto-merge/deploy tuần tự.
- Không source/schema/dependency. Agent chính đã technical review và approve PR 01; hiệu lực sau khi merge spec.
- Validation docs: Node22.23.2 Prettier ba file PASS; `git diff --check` PASS trước review; không chạy runtime suite cho docs-only.
