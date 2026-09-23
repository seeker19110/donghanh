# UI/UX Decision System — Đồng Hành

Đây là lớp **ra quyết định**, không phải nguồn token/style thứ hai.

## Source of truth

- Màu/theme/surface/text token: `packages/core-ui/theme.css`.
- Tailwind mapping: config của từng app.
- Quy tắc UI chi tiết: `.agents/skills/ui-ux-craftsman/SKILL.md`.
- Decision routing: `docs/ui-ux/decision-contract.json`.
- App context: `docs/ui-ux/apps/*.md`.

## Vì sao có lớp này

Skill UI hiện rất giàu tri thức nhưng dài và prose-heavy. UI/UX Pro Max có một ý hay: tách
**condition → action** thành grammar đóng để agent không bắt đầu bằng style. Đồng Hành native hóa
ý tưởng đó bằng JSON nhỏ, test được, không chạy code từ dữ liệu và không cần Python.

## Cách dùng

1. Xác định app: `dhcb` hoặc `hub`.
2. Viết một dominant intent 2–5 từ, ví dụ: `mobile voice latency`, `lesson long reading`,
   `payment retry trust`, `admin data table`.
3. Match signal trong contract; luôn áp `must-have`.
4. Đọc app profile và skill để chuyển constraint thành implementation đúng repo.
5. Nếu nhiều concern độc lập, review tách lượt; không gom accessibility + motion + hierarchy +
   copy + performance thành một query chung.
6. External guidance chỉ dùng làm inspiration sau các bước trên.

## Không được làm

- Không thêm mã màu/font/spacing value vào JSON.
- Không dùng contract để override business/security/pedagogy.
- Không gửi learner/private data ra ngoài để tìm design advice.
- Không xem action là mệnh lệnh executable; đây chỉ là constraint vocabulary.
- Không tạo page override nếu khác biệt chỉ là sở thích thẩm mỹ.

## Page override

Nếu một route/feature có constraint khác app profile, tạo
`docs/ui-ux/pages/<feature>.md` và ghi rõ: lý do, rule bị override, phạm vi, a11y/performance
implication, ngày review. Override không được định nghĩa lại token values.
