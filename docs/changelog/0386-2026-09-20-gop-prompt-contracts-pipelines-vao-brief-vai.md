# 0386 — 2026-09-20 — Gộp "prompt contracts" của PIPELINES §18 vào brief chuẩn từng vai (§12 mục 4)

## Tóm tắt

Hoàn tất mục 4/4 (mục cuối) của `docs/AI_DEVELOPMENT_PROTOCOL.md` §12 "Việc kế tiếp để controller
thành máy" — nối tiếp đợt 0385. `docs/AI_DEVELOPMENT_PIPELINES.md` §18 trước đây giữ 5 prompt đầy
đủ (Planner / Astra architecture / Implementation / Sol verification / Astra audit) **lặp lại**
nội dung các file vai thật trong `.claude/agents/`, tạo rủi ro hai tài liệu lệch dần theo thời
gian mỗi khi một bên được sửa mà bên kia quên theo.

## Việc đã làm

- **`docs/AI_DEVELOPMENT_PIPELINES.md` §18** — thay 5 prompt đầy đủ bằng: (a) khuôn chung tham
  khảo `ROLE/INPUT/OBJECTIVE/RULES/VERIFY/IF BLOCKED/OUTPUT`, (b) bảng ánh xạ "vai chung (§2 model
  hierarchy) → vai DHCB (PROTOCOL §4) → file brief thật trong repo" — sửa nội dung một vai thì sửa
  ở file agent đó, không sửa ở PIPELINES.md.
- **`docs/AI_DEVELOPMENT_PIPELINES.md` §0** — làm rõ Astra/Sol/Terra/Luna là tên gọi
  **provider-agnostic** (không ngầm định riêng một hãng model nào, kể cả ChatGPT/OpenAI); trong
  repo này coding agent chạy trên Claude Code nên quy đổi sang đúng tier Claude đang có trong
  phiên (Opus/Sonnet/Haiku/Fable), theo `model:` field thật ở từng `.claude/agents/*.md`.
- **`.claude/agents/{spec-executor,standard-worker,complex-implementer,mechanical-worker}.md`** —
  thêm mục "Đầu ra" chuẩn (file đã sửa/thêm · lệnh kiểm chứng + kết quả thật · sai khác so với
  brief · rủi ro còn lại), lấy từ hợp đồng OUTPUT của prompt "Implementation" cũ ở PIPELINES §18.
- **4 file trên + `.claude/agents/coordinator.md`** — mục "Ranh giới"/escalation nay trỏ đúng khuôn
  **Blocker report** đã có sẵn ở PIPELINES §10 (hành vi quan sát được / hành vi mong đợi / bằng
  chứng / đã thử gì / nguyên nhân khả dĩ / điều chưa rõ / cần ai quyết định) thay vì chỉ nói chung
  chung "dừng và báo lên coordinator"; `coordinator.md` khi relay lên phiên chính phải giữ nguyên
  bằng chứng gốc, không tóm tắt lại bằng lời kể.
- **`docs/AI_DEVELOPMENT_PROTOCOL.md` §12 mục 4** — đánh dấu XONG, ghi rõ đã chuyển gì đi đâu.

## Quyết định

- **Không tạo tài liệu/cơ chế mới:** chỉ chuyển nội dung đã có từ một chỗ (PIPELINES §18, phần
  trùng lặp) sang chỗ đã có sẵn khác (agent files thật) — đúng tinh thần "luật nền" của protocol
  (không tạo cơ chế mới khi đã có cơ chế tương đương).
- **PIPELINES.md giữ vai trò "chọn model/effort"**, không còn giữ bản sao nội dung vai — đúng phân
  công đã ghi ở PROTOCOL §0 ("PROTOCOL nói ai làm gì; PIPELINES nói dùng model nào").

## Bằng chứng kiểm chứng

```
npm run typecheck   → 0 lỗi
npm run lint         → 0 cảnh báo
npm run format:check → tất cả file khớp Prettier
npm test             → 714 file / 14950 test PASS (1 skip có sẵn, không liên quan)
npx tsx scripts/protocol-check.ts → OK — không có vi phạm
npm run check:specs               → OK — 124 đặc tả, không thiếu đường dẫn
```

## Tài liệu đã đồng bộ (DOC_DELTA)

```yaml
doc_delta:
  changelog: docs/changelog/0386-2026-09-20-gop-prompt-contracts-pipelines-vao-brief-vai.md
  progress_md: ✗ # hạ tầng nội bộ cho protocol đã Accepted từ 0380, không đổi giai đoạn dự án
  claude_md: ✗
  project_md: ✗
  adr: ✗ # thi hành đúng §12 đã Accepted, không phải quyết định kiến trúc mới
  specs: ✗
  ops_docs: ✗
  traps_md: ✗
```
