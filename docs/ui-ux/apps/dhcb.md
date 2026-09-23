# App profile — DHCB Learning / Companion

**Phạm vi:** `apps/dhcb/src/**`

## Product jobs

- Học/ôn/luyện có thời lượng dài; đọc hiểu và giữ tập trung quan trọng hơn decoration.
- Chat/voice cần feedback latency rõ nhưng không gây sensory overload.
- Mobile-first, mạng yếu/offline là tình huống thật.
- Gamification hỗ trợ động lực nhưng không được cạnh tranh với tác vụ học chính.
- Payment/profile/progress là high-trust flow.

## Default design posture

- Density: medium; lesson/reading spacious hơn, dashboard/review có thể dense hơn.
- Motion: subtle/functional; voice state có motion khi truyền trạng thái thật.
- Navigation: mobile bottom nav / desktop sidebar theo kiến trúc hiện hữu.
- Typography: Inter hiện hữu; prose dài 65–75ch, body line-height 1.5–1.7.
- Theme: dùng token hiện hữu; không định nghĩa palette ở profile này.

## Non-negotiable

- Touch target chính >=44px trên mobile.
- Không phụ thuộc motion để hiểu trạng thái.
- Không reward/toast che câu hỏi hoặc cản next action.
- Tất cả async learner action có pending/error/recovery phù hợp.
- Không dùng AI output để thể hiện authoritative mastery/payment state nếu backend chưa xác nhận.
