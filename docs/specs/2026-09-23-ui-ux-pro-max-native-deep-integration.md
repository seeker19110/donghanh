# Feature spec: Native hóa sâu UI/UX Pro Max vào Đồng Hành

| Thuộc tính   | Giá trị |
| ------------ | ------- |
| Issue        | N/A — yêu cầu trực tiếp |
| Spec owner   | Chủ dự án |
| Trạng thái   | **Approved for implementation** |
| Người duyệt  | Chủ dự án — yêu cầu trực tiếp trong chat |
| Ngày duyệt   | 2026-09-23 |
| Lần cập nhật | 2026-09-23 |

## 1. Tóm tắt quyết định

Đồng Hành đã có UI governance mạnh, nên không vendor nguyên `ui-ux-pro-max-skill`. Tích hợp sâu
phần còn thiếu: decision contract có cấu trúc, profile theo app, query/review contract, precedence,
và gate machine-checkable. Giữ nguyên token/theme hiện hữu và các audit accessibility/contrast.

## 2. Vấn đề, người dùng và bằng chứng

- Persona/job-to-be-done: learner, companion user, admin/reviewer; agent triển khai UI.
- Pain point: `ui-ux` giàu guideline nhưng phần quyết định còn prose-heavy; dễ chọn
  pattern/motion/density trước khi xác định context.
- Repo đã có 3 theme, semantic token, a11y/AAA, contrast audit, anti-AI-UI rules và E2E.
- Upstream UI/UX Pro Max có giá trị ở query contract, conditional reasoning, stack-aware guidance,
  master/page override và taxonomy; catalog/installer/Python runtime không cần thiết.

## 3. Nghiên cứu hiện trạng

### Code và luồng hiện tại

- App chính: `apps/dhcb`; app Hub: `apps/hub`.
- Theme source of truth: `packages/core-ui/theme.css`, app mapping trong Tailwind/index CSS.
- UI agent: `.agents/skills/ui-ux/SKILL.md`.
- UI auto-rule: `.agents/rules/ui-ux-guidelines.md`.
- Gate: `scripts/fixed-color-contrast-audit.test.ts`,
  `apps/dhcb/src/lib/themeContrast.test.ts`, `scripts/a11y-gate-policy.test.ts`, Playwright axe.

### Nghiên cứu người dùng/sản phẩm

Sản phẩm vừa là learning app mobile-first vừa tiến tới Personal AI Companion; UI cần thay đổi
theo learning/voice/gamification/payment/admin/data-heavy chứ không dùng một style preset chung.

### Nghiên cứu kỹ thuật/nguồn ngoài

Tham khảo `nextlevelbuilder/ui-ux-pro-max-skill` (MIT), đặc biệt query contract, quick reference,
reasoning contract và master/page override. Không copy data catalog.

## 4. Phương án và quyết định

| Phương án | Lợi ích | Chi phí/rủi ro | Kết luận |
| --------- | ------- | -------------- | -------- |
| Không làm | Không đổi repo | Agent tiếp tục suy từ prose dài | Loại |
| Vendor upstream | Đủ search/catalog | Trùng source of truth, thêm Python/tooling | Loại |
| Native decision contract | Nhẹ, deterministic, đúng domain Đồng Hành | Cần duy trì schema nhỏ | **Chọn** |

## 5. Outcome và guardrails

- Decision contract hợp lệ được test trong `npm test`.
- Có app profile cho DHCB và Hub.
- Skill/rule trỏ vào contract và xác định precedence rõ.
- Không đổi runtime UI, không thêm dependency, không đổi token/theme, không hạ gate.

## 6. Scope và non-goals

### In scope

- `docs/ui-ux/**`
- skill/rule UI
- test contract
- script `check:ui-ux`

### Không làm

- Redesign hàng loạt màn hình.
- Thêm GSAP, Phosphor, Python engine hoặc catalog font/style.
- Token hóa lại toàn bộ màu cố định đã có quyết định giữ.
- Thay đổi spec S01–S12 đang có.

## 7. User journeys và trạng thái

Agent phải phân loại app + context + dominant intent trước khi đề xuất UI. Contract kích hoạt constraint
cho mobile/low-end, reading, voice, kids, gamification, payment/trust, data-heavy và accessibility.

## 8. Yêu cầu

### Functional requirements

- FR-1: decision contract dùng grammar đóng; action chỉ thuộc nhóm constraint/pattern/mode/review.
- FR-2: mỗi condition có signals và action deterministic.
- FR-3: app profiles nêu source of truth và constraint riêng.
- FR-4: query/review chỉ có một dominant UX intent mỗi lượt.
- FR-5: `check:ui-ux` chạy contract gate + a11y/contrast policy hiện hữu.

### Non-functional requirements

- NFR-1: không network.
- NFR-2: không dependency mới.
- NFR-3: không duplicate token values.
- NFR-4: backward compatible.

## 9. Acceptance criteria

- AC-1: malformed/unknown decision action làm test fail.
- AC-2: mọi condition có signals/action; must-have luôn có action.
- AC-3: skill dùng contract trước khi chọn visual pattern.
- AC-4: rule áp đúng `apps/dhcb/src/**` và `apps/hub/src/**`, không còn path cũ `apps/english`.
- AC-5: package có `npm run check:ui-ux`.

## 10. UX, nội dung và accessibility

Không thay UI runtime. Contract củng cố reduced-motion, focus, content hierarchy, mobile ergonomics,
error recovery, reading width, voice state, chart/data semantics và trust flow.

## 11. Kiến trúc, API và data contract

Docs/tooling only. Không API/DB/migration.

## 12. Security, privacy và abuse cases

Không đưa learner/private data vào query ngoài repo. Payment/trust condition chỉ thêm UX constraint,
không thay authorization/business state.

## 13. Telemetry và vận hành

Không runtime telemetry. Gate chạy local/CI qua Vitest.

## 14. Test plan

| Lớp | Trường hợp | Bằng chứng |
| --- | --- | --- |
| Unit | decision contract schema/grammar | `scripts/ui-ux-decision-contract.test.ts` |
| Integration | package script gom gate | `npm run check:ui-ux` |
| E2E/a11y | không đổi runtime | N/A trong slice này |
| Manual/eval | đọc skill/rule/profile | PR diff |
| Concurrent/retry/migration | không áp dụng | N/A |

## 15. Kế hoạch triển khai

Một PR docs/tooling: contract → profiles → skill/rule → test → package script.

## 16. Rollout và rollback

Merge không đổi runtime. Rollback bằng revert PR.

## 17. Rủi ro và giả định

| Rủi ro/giả định | Xác suất | Ảnh hưởng | Giảm thiểu/xác minh | Owner |
| --- | --- | --- | --- | --- |
| Contract thành source token thứ hai | Thấp | Cao | Cấm chứa token value; chỉ chứa constraints | Chủ dự án |
| Rule trùng guideline cũ | Vừa | Vừa | Precedence + map phần mới/đã có | Chủ dự án |

## 18. Câu hỏi mở và quyết định

Không còn blocking question cho slice docs/tooling này.

## 19. Phê duyệt

- [x] Product outcome và scope
- [x] UX/accessibility
- [x] Architecture/API/data
- [x] Security/privacy/cost
- [x] Test/telemetry/rollout/rollback
- [x] Mọi câu hỏi blocking đã đóng

**Kết luận:** **Approved for implementation**

**Người duyệt:** Chủ dự án  
**Ngày:** 2026-09-23  
**Ghi chú:** Yêu cầu trực tiếp “tích hợp sâu hơn cho tôi”.
