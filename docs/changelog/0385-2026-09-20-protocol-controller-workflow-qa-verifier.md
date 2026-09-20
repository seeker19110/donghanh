# 0385 — 2026-09-20 — Workflow Controller cơ học cho AI_DEVELOPMENT_PROTOCOL.md (§12 mục 1–3)

## Tóm tắt

`docs/AI_DEVELOPMENT_PROTOCOL.md` (thêm 2026-09-19, changelog 0380) là tài liệu-nhưng-chưa-máy:
5 hợp đồng YAML + state machine 15 trạng thái được đặc tả nhưng "controller hiện tại = file
trạng thái + hook + CI, chưa có script riêng" (§12). Đợt này làm đúng 3 việc §12 liệt kê còn
thiếu, gộp một đợt theo yêu cầu người dùng.

## Việc đã làm

- **`scripts/protocol-check.ts`** (mới) + **`scripts/protocol-check.test.ts`** (14 test) — Workflow
  Controller cơ học:
  - Đọc header `Trạng thái: **XXX**` của mọi file `docs/specs/*.md`; spec không có dòng này (124
    spec hiện có) được bỏ qua — di sản, không phải lỗi.
  - Trạng thái ≥ `SPEC_READY`: bắt buộc khối \`\`\`yaml `feature:` đúng schema §3.1 (Zod), mỗi
    `acceptance_criteria` phải có `proof`.
  - `design_spec: required` + trạng thái ≥ `DESIGN_READY`: bắt buộc mục `## ⑦ DESIGN_SPEC` +
    khối đúng schema §3.2.
  - Trạng thái ≥ `PASS`: bắt buộc khối `qa:` (QA_REPORT, schema §3.5).
  - Trạng thái `DONE`: bắt buộc khối `doc_delta:` (schema §3.7) + đường dẫn `changelog` phải tồn
    tại thật (không chỉ đúng schema).
  - Mọi khối `reject:` ở bất kỳ đâu trong file phải có `owner` (schema §3.6) — reject không có
    owner là artifact vô hiệu theo protocol §1.3.
  - `PLAN.md` cục bộ (không commit, đã `.gitignore` từ đợt 0380): kiểm hai task không
    `depends_on` nhau mà đụng cùng `files.modify ∪ files.create` → vi phạm luật khoá file §5.2.
  - Gắn `npm run check:protocol -- --ci` vào CI job `audit`, ngay sau `check:specs`.
- **`.claude/commands/protocol.md`** (mới, `/protocol <feature-id>`) — in trạng thái hiện tại +
  vai chịu trách nhiệm (§4) + artifact còn thiếu, luôn chạy `protocol-check.ts` thật trước khi kết
  luận (không suy đoán). Chỉ đọc/báo cáo, không tự đổi trạng thái.
- **`.claude/agents/qa-verifier.md`** (mới, Sonnet) — vai "QA & DevOps" độc lập theo luật §4.1:
  brief chỉ gồm spec + PR + head SHA, không nhận diễn giải của Engineering; chạy đủ cổng theo ma
  trận rủi ro §7.2, ghi `QA_REPORT` hoặc `REJECT` có `owner`.
- **`docs/AI_DEVELOPMENT_PROTOCOL.md` §12** — đánh dấu 3/4 mục đã xong, giữ mục 4 (gộp
  prompt-contracts của PIPELINES §18) là việc chưa làm.
- **Dependency:** thêm `@types/js-yaml` (devDependency) — `js-yaml` (runtime) đã có sẵn trong
  `package.json`, chỉ thiếu type declaration cho TypeScript strict.

## Quyết định

- **Phạm vi cố ý hẹp:** chỉ spec TỰ KHAI tham gia protocol (có dòng `Trạng thái:`) mới bị kiểm —
  không hồi tố 124 spec cũ, không bắt ép toàn bộ `docs/specs/` theo khuôn mới ngay lập tức.
- **Không thêm cơ chế mới ngoài §12:** không tạo Orchestrator/agent thứ 6, không đổi state machine
  hay schema — chỉ hiện thực hoá đúng những gì `AI_DEVELOPMENT_PROTOCOL.md` đã đặc tả.

## Bằng chứng kiểm chứng

```
npm run typecheck   → 0 lỗi
npm run lint         → 0 cảnh báo
npm run format:check → tất cả file khớp Prettier
npm test             → 714 file / 14941 test PASS (1 skip có sẵn, không liên quan)
npx tsx scripts/protocol-check.ts        → OK — không có vi phạm
npm run check:specs                      → OK — 124 đặc tả, không thiếu đường dẫn
```

## Tài liệu đã đồng bộ (DOC_DELTA)

```yaml
doc_delta:
  changelog: docs/changelog/0385-2026-09-20-protocol-controller-workflow-qa-verifier.md
  progress_md: ✗ # trạng thái/giai đoạn dự án không đổi; đây là hạ tầng nội bộ cho protocol đã có
  claude_md: ✗ # CLAUDE.md không tham chiếu trực tiếp scripts/protocol-check.ts
  project_md: ✗
  adr: ✗ # không phải quyết định kiến trúc khó đảo — thi hành đúng §12 đã Accepted từ 0380
  specs: ✗ # không có spec riêng cho đợt hạ tầng nội bộ này
  ops_docs: ✗
  traps_md: ✗
```
