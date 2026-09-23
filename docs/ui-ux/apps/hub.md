# App profile — Đồng Hành Hub

**Phạm vi:** `apps/hub/src/**`

## Product jobs

Hub là cửa vào/điều phối; ưu tiên orientation, trust, account state và chuyển domain rõ ràng hơn
gamification hoặc immersive motion.

## Default design posture

- Density: low-to-medium; hierarchy rõ, ít card cạnh tranh nhau.
- Motion: tối thiểu, không choreography.
- CTA: một primary action nổi bật theo context; secondary action tách rõ.
- Responsive: giữ cùng information architecture giữa mobile/desktop, chỉ đổi bố cục.
- Theme/token: dùng `packages/core-ui/theme.css` và mapping hiện hữu.

## Non-negotiable

- Không biến Hub thành landing page marketing generic.
- Domain status/availability phải có text, không chỉ màu/icon.
- Deep-link/back behavior phải giữ orientation.
- Auth/account/payment entry point phải rõ trạng thái và recovery.
- Không copy hero/pattern catalog upstream nếu không giải quyết job cụ thể.
