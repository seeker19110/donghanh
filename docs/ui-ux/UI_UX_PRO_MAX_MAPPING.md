# Mapping UI/UX Pro Max → Đồng Hành

Nguồn tham khảo: `nextlevelbuilder/ui-ux-pro-max-skill` (MIT), quét sâu 2026-09-23.

## Đã có sẵn ở Đồng Hành — không nhân đôi

- semantic theme/token + 3 theme + contrast audit;
- WCAG/axe E2E + AAA policy;
- mobile touch target, prose width, reduced-motion policy;
- anti-AI-UI rules từ Impeccable/Hallmark;
- responsive nav, 5-state guidance, typography/spacing/depth;
- Lucide, Inter, React/Vite/Tailwind stack.

## Native hóa sâu từ upstream

| Upstream                | Đồng Hành                                                             |
| ----------------------- | --------------------------------------------------------------------- |
| Query Contract          | dominant intent 2–5 từ, một concern mỗi pass                          |
| reasoning_contract.py   | `docs/ui-ux/decision-contract.json` grammar đóng, test bằng Vitest    |
| Master + page override  | app profile + page override chỉ chứa constraint, không copy token     |
| product/style reasoning | condition theo learning/voice/kids/gamification/payment/data-heavy    |
| stack guidance          | repo evidence + React/Vite/Tailwind/Lucide có precedence              |
| forms reference         | inputMode/autocomplete/error summary/read-only/unsaved-state guidance |
| navigation reference    | state preservation, route focus, hierarchy consistency                |
| chart reference         | accessible context/alternative, aggregation, mobile semantics         |
| validation              | `npm run check:ui-ux` tái dùng gate thật đang có                      |

## Cố ý không lấy

- Python search/install runtime;
- Google Fonts/style/icon catalogs;
- Phosphor thay Lucide;
- GSAP recipes;
- generic landing-page macrostructures;
- generic color palette;
- design-system output chứa token values.

Lý do: các phần trên hoặc trùng source of truth, hoặc không phù hợp product app, hoặc tăng
maintenance/runtime mà không tăng correctness.

## Nguyên tắc cập nhật về sau

Khi upstream có rule mới, chỉ nhập nếu:

1. có risk/outcome rõ trong Đồng Hành;
2. chưa được gate/rule hiện hữu bao phủ;
3. có thể diễn đạt bằng vocabulary repo;
4. không tạo source of truth thứ hai;
5. nếu machine-checkable thì thêm vào test/gate hiện hữu thay vì thêm toolchain mới.
