# Bài học thật `security-s2`

- Thêm bốn unit `p6-u186..u189` và tám bài Python MÔ PHỎNG về phạm vi assessment được ủy quyền,
  triage finding web/API, exposure/secret và responsible disclosure.
- Nối unit vào curriculum, registry đồng bộ, lazy index và `SPEC_STAGE_UNITS['security-s2']`; thêm
  semantic gate kiểm structure, markers phòng thủ và cấm external I/O.
- Fixture synthetic/redacted luôn fail closed khi thiếu consent, scope, time window, test account,
  non-destructive mode, remediation hay disclosure state hợp lệ.
- Đã chạy `gen:lesson-index` (453 bài/198 unit) và 25 test semantic/stage/lazy xanh; CI chạy
  typecheck, lint, format, build, full unit và E2E trước khi merge.
