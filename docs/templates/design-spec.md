# Khuôn DESIGN_SPEC (mục ⑦ của file đặc tả tính năng)

> Dán mục này vào **cuối** file `docs/specs/<ngày>-<slug>.md` (sau ô ⑥, trước "Nghiệm thu").
> Là CONTRACT 2 của `docs/AI_DEVELOPMENT_PROTOCOL.md` §3.2: Design nhận FEATURE_SPEC, trả
> DESIGN_SPEC; **không được đổi** `scope` / `user_flow` / tiêu chí chấp nhận — muốn đổi thì viết
> REJECT `owner: product`.
>
> Feature không có giao diện: Product ghi `DESIGN_SPEC: không áp dụng — lý do: ...` ở header spec
> và bỏ mục này.

---

## ⑦ DESIGN_SPEC

### Khối máy đọc

```yaml
screen: <slug-màn-hình>
route: /... # theo quy ước URL mang tiêu đề (CLAUDE.md mục 7) nếu có id nội dung
layout:
  desktop: { columns: 2, regions: [PageHeader, Sidebar, Main] }
  mobile: { columns: 1, regions: [PageHeader, Main, BottomNav] }
components:
  - { name: PageHeader, source: reuse, path: apps/dhcb/src/components/PageHeader.tsx }
  - { name: X, source: compose, from: [FormField, PrimaryButton] }
  - { name: Y, source: new, why_not_reuse: 'kết quả rg rỗng — chưa có component nào ...' }
tokens: { spacing: standard, typography: standard, color: --a-* only }
states: # mỗi state trong FEATURE_SPEC `states` phải có một dòng ở đây
  loading: <Skeleton>
  empty: <EmptyState>
  error: <ErrorState>
a11y: { content: AAA, controls: AA, touch_min: 44px }
themes_checked: [blue-sky, dark-blue, kid]
```

### Layout (vẽ chữ, 2 breakpoint bắt buộc)

**Desktop 1440px**

```
┌──────────────────────────────┐
│ Header                       │
├─────────┬────────────────────┤
│ Sidebar │ Main               │
└─────────┴────────────────────┘
```

**Mobile 390px**

```
Header → Main → Bottom Navigation
```

### Thứ tự ưu tiên nội dung

<!-- Cái gì phải thấy đầu tiên trên màn nhỏ; cái gì được gấp lại (progressive disclosure). -->

### Reuse trước, create sau — bằng chứng

<!-- Với mỗi component `source: new`: dán lệnh + kết quả (rỗng) đã chạy, ví dụ
     rg "export (default )?function <Tên>" apps/dhcb/src/components packages/core-ui -->

### Trạng thái & tương tác

| State   | Component | Người dùng thấy gì | Hành động tiếp theo |
| ------- | --------- | ------------------ | ------------------- |
| loading |           |                    |                     |
| empty   |           |                    |                     |
| error   |           |                    |                     |

### Definition of Done của vai Design (tự kiểm trước khi ghi `DESIGN_READY`)

- [ ] Desktop 1440px và mobile 390px đều có layout
- [ ] Mọi `state` của FEATURE_SPEC có component
- [ ] Mọi component ghi `reuse` / `compose` / `new` kèm đường dẫn hoặc lý do
- [ ] Màu chỉ qua token `--a-*` / `--z-*`; không hard-code
- [ ] Chữ nội dung AAA (≥ 7:1), điều khiển AA, vùng chạm ≥ 44px
- [ ] Đã xét cả 3 theme (`blue-sky`, `dark-blue`, `kid`)
- [ ] Product xác nhận flow/scope không đổi
