# 0380 — 2026-09-19 — AI Development Protocol: quy trình "kín" 5 vai thi hành được trong repo

## Tóm tắt

Người dùng đưa sơ đồ ý tưởng "5 AI" (Product/UX → Design → Engineering → QA/DevOps →
Documentation, có vòng phản hồi, có state machine) và yêu cầu biến nó thành **AI Development
Protocol** — quy trình mà coding agent thi hành trực tiếp trong `donghanh`. Đợt này chỉ là **tài
liệu + khuôn**, không đổi mã nguồn, không đổi CI.

## Việc đã làm

- **`docs/AI_DEVELOPMENT_PROTOCOL.md`** (mới) — 12 mục:
  - §0 thứ tự ưu tiên: `CLAUDE.md` > spec đã Approved > PROTOCOL (quy trình) >
    `AI_DEVELOPMENT_PIPELINES.md` (chọn model) > kiến trúc 3 tầng > prompt. Hai file AI_* bổ
    sung nhau, không thay nhau.
  - §2 state machine 14 trạng thái (`NEW … DONE`) + **bảng điều kiện chuyển**, mỗi dòng có vai
    chịu trách nhiệm, artifact bắt buộc và cách kiểm bằng máy/artifact. Trạng thái ghi ở dòng
    `Trạng thái:` của file spec — nguồn sự thật duy nhất.
  - §3 năm hợp đồng dạng YAML máy đọc: `FEATURE_SPEC` (khối `feature:` thêm vào khuôn 6 ô hiện
    có), `DESIGN_SPEC` (mục ⑦ trong cùng file spec), `IMPLEMENTATION_PLAN` + schema `TASK`
    (PLAN.md — không commit), `QA_REPORT`, `REJECT` (bắt buộc có `owner`, có bộ định tuyến
    deterministic), `DOC_DELTA`.
  - §4 ánh xạ 5 vai vào cơ chế sẵn có (`.claude/agents`, skill, CI, `/gate`, `/incident`) + luật
    QA độc lập với ngữ cảnh đã code.
  - §5 workflow controller bằng luật: khoá file, điều kiện chạy song song (giao tập file rỗng +
    không hotspot + worktree riêng), danh sách file khoá toàn cục, điều kiện merge máy kiểm.
  - §6 điều kiện spawn subagent, checklist Architecture Guardian, cây quyết định gọi AI (cục bộ →
    cache → đếm lượt → routing).
  - §7 đường ống kiểm chứng ánh xạ vào lệnh thật + ma trận chọn cổng theo rủi ro.
  - §8 bảng quyết định "sửa tài liệu nào" cho vai Documentation; **cố ý không** tái cấu trúc
    `docs/` theo cây `product/ux/design/...` của sơ đồ gốc (repo đã có `docs/README.md` làm bản
    đồ; đổi cây là việc riêng cần ADR).
  - §9 retry/fallback/escalation · §10 quyền sửa file theo vai · §11 điều kiện tự
    commit/PR/merge · §12 việc kế tiếp để controller thành máy (chưa làm).
- **`docs/templates/design-spec.md`** (mới) — khuôn CONTRACT 2, dán vào cuối file spec.
- **`.gitignore`**: thêm `PLAN.md` (protocol §3.3 cấm commit artifact tạm này).
- **`docs/README.md`**: thêm dòng PROTOCOL vào bảng nguồn thi hành, sửa mô tả PIPELINES và
  `templates/`.

## Quyết định

- **Không tạo Orchestrator AI thứ 6**, không tạo script mới trong đợt này: controller hiện = file
  trạng thái + hook + CI. Script `scripts/protocol-check.ts`, lệnh `/protocol`, agent
  `qa-verifier` ghi ở §12 là việc kế tiếp, tách PR riêng để người dùng quyết có làm không.
- Artifact nằm trong **một file spec** (trừ PLAN.md/changelog) để hai PR song song không xung
  đột file dùng chung — cùng lý do tách `docs/changelog/` (TRAPS.md mục 1).
- `DONE` chỉ do vai Documentation ghi sau `DEPLOYED`; Engineering dừng ở `IMPLEMENTED`.

## Bằng chứng kiểm chứng

Đợt chỉ chạm Markdown + `.gitignore`. Cổng đã chạy: `npm run format:check`, `npm test` (gồm
`scripts/changelog.test.ts`), `npm run lint` — kết quả dán ở mô tả PR.

## Tài liệu đã đồng bộ (DOC_DELTA)

```yaml
doc_delta:
  changelog: docs/changelog/0380-2026-09-19-ai-development-protocol-5-vai.md
  progress_md: ✗ # trạng thái dự án không đổi; việc kế tiếp §12 chờ người dùng quyết
  claude_md: ✗ # chưa đưa vào luật bắt buộc — đề xuất ở mô tả PR
  project_md: ✗
  adr: ✗
  specs: ✗
  ops_docs: ✗
  traps_md: ✗
```
