# 0376 — Hợp nhất 7 điểm mạnh từ `seeker19110/projects-template` vào quy trình AI-agent DHCB

- **Ngày:** 2026-09-19
- **PR:** (điền số PR khi tạo)
- **Nguồn tham khảo:** `seeker19110/projects-template` (repo khung mẫu quy trình AI-agent của cùng
  người dùng) — đối chiếu qua subagent nghiên cứu, chọn 7 cơ chế đáng hợp nhất, bỏ qua phần đã
  có tương đương tốt hơn (10 skill chuyên biệt, `docs/changelog/` theo file, `codemap.ts`) hoặc
  mâu thuẫn luật đã chốt (đa provider, đa theme).

## Đã làm

1. **`.claude/hooks/block-dangerous-git.sh` — nâng cấp.** Bản cũ (tham khảo mattpocock/skills) so
   khớp trực tiếp trên chuỗi lệnh thô nên có thể chặn oan chuỗi trong dấu nháy (vd commit message
   chứa chữ "reset --hard"). Thêm bước lọc phần trong dấu nháy đơn/kép + thân heredoc trước khi so
   khớp (tham khảo `projects-template`). **Sửa thêm một lỗi thật phát hiện lúc kiểm chứng:** rule
   "reset --hard" gọi nhầm `has_flag -- --hard` (hai tham số, hàm chỉ đọc `$1="--"`) khiến
   `git reset --hard` KHÔNG bị chặn — đã sửa thành `has_flag --hard`, kiểm lại bằng payload thật.
2. **`.claude/hooks/pre-commit-gate.sh` — mới.** Chặn `git commit` khi `npm run typecheck` /
   `npm run lint` / `npm test` đỏ. Cố ý KHÔNG chạy `npm run build` ở đây (1-3 phút, sẽ khiến mọi
   commit chậm bất hợp lý) — `build` vẫn bắt buộc ở CI job `build` + checklist merge (mục 9).
   Escape hatch: `git commit --no-verify`.
3. **`scripts/usage-estimate.sh` + `.claude/hooks/usage-guard.sh` + `.claude/usage-budget.example.sh`
   — mới.** Tự động hoá luật CLAUDE.md mục 3 "≥70% quota 5h → hoàn tất rồi dừng" — trước đây
   HOÀN TOÀN thủ công. Hook Stop đọc transcript phiên, ước tính % theo model (budget do người
   dùng tự khai ở `.claude/usage-budget.sh`, không commit), tiêm nhắc wind-down khi vượt ngưỡng
   (một lần/phiên qua file marker). Tự tắt khi chưa khai báo budget.
4. **`scripts/check-spec-paths.ts` — mới, nối vào CI job `audit` (chặn merge).** Kiểm mọi đường
   dẫn ở cột "Đường dẫn file" (mục ② khuôn `docs/templates/dac-ta-tinh-nang.md`) của đặc tả ĐÃ
   "Approved for implementation" trong `docs/specs/*.md` có tồn tại thật trong repo. Chống đúng
   lỗ hổng CLAUDE.md mục 5 nêu ("chống ảo giác" trước đây chỉ dựa kỷ luật, không có gác tự động
   cho NỘI DUNG đặc tả). **Thử ban đầu quét toàn văn mọi backtick ra rất nhiều khớp nhầm** (route
   URL, gọi hàm `nav('/x')`, truy cập thuộc tính, số dòng `file.ts:216`) — thu hẹp lại CHỈ đọc
   đúng cột bảng theo khuôn, yêu cầu có đuôi file đã biết. Chạy thật trên 124 đặc tả hiện có: 0
   đường dẫn thiếu.
5. **`scripts/maintenance-sweep.sh` (`npm run maintain`) — mới.** Gom 5 mảng bảo trì (git hygiene,
   dependency npm outdated/audit, tài liệu & nợ kỹ thuật — gọi lại
   `scripts/check-progress-freshness.sh` thay vì viết lại, vệ sinh repo & bí mật, CI/chuỗi cung
   ứng) + cổng khung (codemap cycles, check:specs, tuỳ chọn `--gate` chạy typecheck/lint/test)
   thành MỘT báo cáo Markdown, chỉ đọc không sửa. Trước đây DHCB chỉ có
   `check-progress-freshness.sh` — một mảnh nhỏ của việc này.
6. **4 file `.claude/agents/*.md` (điều phối 3 tầng theo route) — ĐÃ CÓ SẴN, không cần làm thêm.**
   Kiểm tra thấy DHCB đã có `complex-implementer`/`spec-executor`/`standard-worker`/
   `mechanical-worker` + `coordinator`/`reviewer` từ trước (khớp `docs/framework/KIEN-TRUC-DIEU-
PHOI-3-TANG.md`) — chỉ thêm một dòng trỏ tới ở CLAUDE.md mục 7 cho các phiên sau biết, không
   sửa nội dung agent.
7. **4 slash-command `.claude/commands/{debug,incident,gate,consult}.md` — mới, dịch/khớp DHCB.**
   `/debug` (6 pha chẩn đoán bug khó, tra `TRAPS.md` trước) · `/incident` (bám
   `docs/ke-hoach-khoi-phuc-su-co-server.md` thay vì tài liệu chưa có của template) · `/gate`
   (gọi thẳng lệnh npm cố định của DHCB thay vì lớp "tự dò stack" của template — DHCB một stack
   cố định) · `/consult` (bám `docs/framework/KHUNG-3-...`/`AP-DUNG-vao-du-an-co-san.md`, bỏ
   nhánh "greenfield" của bản gốc vì DHCB luôn brownfield).

## Thay đổi phụ trợ

- `.claude/settings.json`: nối `pre-commit-gate.sh` vào PreToolUse (cùng `block-dangerous-git.sh`)
  và `usage-guard.sh` vào Stop.
- `.gitignore`: thêm ngoại lệ `!.claude/commands` `!.claude/commands/*.md`
  `!.claude/usage-budget.example.sh` (mẫu `.claude/*` trước đó sẽ bỏ sót các file này).
- `package.json`: thêm script `check:specs` và `maintain`.
- `.github/workflows/ci.yml`: thêm bước "Đường dẫn trong đặc tả Approved (check:specs)" vào job
  `audit`, chạy `npm run check:specs -- --ci` (chặn merge khi đỏ).
- `CLAUDE.md` mục 3/7/8: ghi ngắn gọn các cơ chế mới (không lặp chi tiết, trỏ tới file).
- `PROGRESS.md`: thêm một đoạn tóm tắt vào "Đã xong — tóm tắt theo mảng".

## Bằng chứng kiểm chứng

- `bash -n` cho cả 5 script bash mới/sửa: không lỗi cú pháp.
- `block-dangerous-git.sh`: test bằng payload JSON thật cho 6 khuôn chặn (reset --hard, clean -fd,
  branch -D, checkout ., push --force, rebase --abort) — đều chặn đúng (exit 2) — **phát hiện và
  sửa 1 bug thật trong lúc test** (mục 1 trên); commit message chứa chuỗi "reset --hard" trong
  dấu nháy — không bị chặn oan (exit 0); `git add -A` — không bị chặn (exit 0).
- `npx tsx scripts/check-spec-paths.ts`: chạy thật trên toàn bộ `docs/specs/` (124 file) — 0
  đường dẫn thiếu ở đặc tả Approved.
- `bash scripts/maintenance-sweep.sh --no-deps`: chạy thật, không lỗi runtime, báo cáo hợp lệ
  (phát hiện thật: 1 dòng false-positive PEM trong tài liệu vận hành → đã loại `.md` khỏi quét
  bí mật; lỗi backtick trong nhãn dòng CI → đã escape).
- `npm ci` → cài sạch, 0 lỗi.
- `npm run typecheck` → 0 lỗi (phát hiện 1 lỗi strict thật ở `check-spec-paths.ts` lúc kiểm —
  `m[1]` có thể `undefined` — đã sửa bằng guard rõ ràng trước khi dùng).
- `npm run lint` → 0 cảnh báo.
- `npm run check:specs -- --ci` → OK, kiểm 124 đặc tả, 0 đường dẫn thiếu.
- `npm test` → 710 test file passed, 1 skipped (có trước, không liên quan) · 14965 tests passed,
  2 skipped (có trước) · 270s.
- `npm run build` → thành công (app + hub + packages + server), 0 lỗi.

## Quyết định giữ nguyên (không đổi)

- KHÔNG copy hệ thống telemetry/chi phí per-task (`telemetry-log.py`, `model-rates.json`) của
  template — phạm vi rộng hơn yêu cầu (theo dõi CHI PHÍ mỗi tác vụ), trong khi việc DHCB thật sự
  thiếu chỉ là NHẮC wind-down ở ngưỡng quota, đã giải quyết bằng `usage-guard.sh`.
- KHÔNG đổi model trong `.claude/settings.json` (vẫn `"opusplan"`) dù đây là alias đã bị CLI rút
  theo chính bài học ADR-0007 của `projects-template` — ngoài phạm vi 7 điểm được yêu cầu, cần
  người dùng xác nhận trước khi đổi field cấu hình model.
