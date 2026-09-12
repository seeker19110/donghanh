# 0292 — 2026-09-12 — TRAPS.md + cổng kiểm PROGRESS.md lỗi thời

**PR:** #890 · **Đặc tả:** `docs/specs/2026-09-12-traps-va-kiem-progress-loi-thoi.md` (Approved for implementation)

## Việc đã làm

- Đọc repo khung `seeker19110/project-template` (cùng tác giả, nguồn của `docs/framework/KHUNG-*`
  mà `donghanh` đang dùng), thấy hai cơ chế quy trình đáng mang qua, điều chỉnh cho đúng quy ước
  thật của `donghanh` thay vì copy nguyên bản.
- **`TRAPS.md`** (gốc repo) — sổ bẫy đã mắc THẬT, khác `docs/adr/` (ghi quyết định): mỗi mục có
  ngày/PR, khuôn lỗi, cách rà, cổng chốt chặn. Seed 2 mục đầu bằng lỗi thật đã xảy ra: xung đột
  `PROGRESS.md` 2026-08-26 (bốn lần liên tiếp, PR #693/#695/#696/#697 — đã có chốt chặn tách
  `docs/changelog/`) và nhánh lỗi thời phát hiện tay 2026-09-03 (`PROGRESS.md` từng ghi nhánh
  `claude/chirp-3-hd-voice-upgrade-c06eds` "chưa merge" trong khi đã merge từ lâu).
- **`scripts/check-progress-freshness.sh`** — quét `PROGRESS.md` tìm tên nhánh dạng
  `` `claude/…` ``/`` `codex/…` ``/`` `fix/…` ``/`` `feat/…` `` trong backtick, bỏ qua nhánh đã có
  nhãn giải quyết (`ĐÃ MERGE`, `đã merge`, `ĐÃ SỬA XONG`, `không còn nhánh`, `đã xoá`, bọc
  `~~gạch ngang~~` trong khoảng ±3 dòng), còn lại đối chiếu `git ls-remote --heads origin`. Gắn
  vào job `audit` của `.github/workflows/ci.yml`, **chỉ chạy khi push thẳng `main`** (đang mở PR
  thì nhánh feature còn tồn tại là bình thường — kiểm lúc đó báo oan).
- Nhắc `TRAPS.md` + cổng này trong `CLAUDE.md` mục 2.

## Quyết định / đánh đổi (tự quyết trong lúc thi hành)

1. **KHÔNG copy nguyên script gốc của template** (nó đòi `PROGRESS.md` có dòng "Default-branch
   SHA đã đối chiếu" + "Nhánh đang làm:") — `donghanh` không dùng quy ước đó. Viết lại theo cách
   `PROGRESS.md` đã tự đánh dấu nhánh giải quyết thật (ví dụ mục nhánh TTS 14 giọng dùng
   "✅ ĐÃ MERGE").
2. **Ở dạng CẢNH BÁO (`::warning`), chưa chặn CI.** Heuristic quét backtick có thể còn false
   positive chưa lường hết (chạy thử trên `PROGRESS.md` thật chỉ còn đúng 1 cảnh báo hợp lý —
   nợ mở #10 Gemini Live, nhánh không nhãn rõ ràng). Siết thành chặn cứng ở đợt sau nếu chạy vài
   tuần không có báo giả.

## Bằng chứng đã kiểm chứng

- `bash scripts/check-progress-freshness.sh` trên `PROGRESS.md` thật: 1 cảnh báo hợp lý, 0 báo
  giả trên các mục đã gắn nhãn.
- Giả lập nhánh giả không tồn tại + không nhãn → cảnh báo đúng dòng; revert sạch.
- `npm run lint` ✅ · `npm run typecheck` ✅ · `npx vitest run scripts/ci-workflow-policy.test.ts`
  ✅ (7/7 — bước CI mới không phá luật `quality`/`e2e` bất biến) · `npx prettier --check` ✅.
- Không đụng code sản phẩm nên không cần `eval:tutor`/`eval:code-feedback`/build/E2E.

## Việc còn mở

Không có — cảnh báo tự vận hành trong CI, không cần việc tay. Theo dõi vài tuần xem có báo giả
không trước khi cân nhắc chặn cứng.
