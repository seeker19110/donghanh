# 0390 — 2026-09-20 — Xóa hẳn backend ba trụ career/startup/life

**Commit:** `bd0bb42` · **Nhánh:** `claude/vigilant-euler-6brh5q`

## Bối cảnh

Đợt 0389 (2026-09-20) gỡ UI ba trụ "Sự nghiệp"/"Khởi nghiệp"/"Đời sống" nhưng cố ý GIỮ backend
vì Companion còn đọc dữ liệu qua `domainReadModelService.ts`. Chủ dự án chốt tiếp: xóa hẳn
backend + dữ liệu, chấp nhận Companion mất khả năng tư vấn xuyên trụ ở ba mảng này và mất dữ
liệu người dùng cũ (không hoàn tác).

## Đã làm

- Xóa service: `packages/core-domains/{careerService,startupService,lifeFoundationService,
lifeMilestoneMasteryService}.ts` (+ test).
- Xóa: `packages/core-ai/{careerInterviewService,compassionateCoachPrompt}.ts` (+ test) —
  `compassionateCoachPrompt` là mã chết sau khi mất consumer duy nhất.
- Xóa contract: `packages/core-contracts/{career,startup,lifeFoundation,careerInterview,
lifeMilestoneMastery,crossDomainGraph}.ts` (+ test).
- Xóa `packages/core-personal/{crossDomainGraphService,crossDomainSynergyService}.ts` (+ test)
  — đồng bộ mục tiêu sự nghiệp vào Life Graph, mất nguồn career thì không còn tác dụng.
- Xóa route: `apps/server/src/api/domains/{career,career-interview,startup,life}.ts` (+ test).
  **KHÔNG đụng `work.ts`** (trụ "Ghi chú").
- Xóa UI chết: `apps/dhcb/src/lib/knowledgeFabricApi.ts`,
  `apps/dhcb/src/components/LifeGraph/CrossDomainSynergyCard.tsx` (không còn ai import).
- Sửa `apps/server/src/routes.ts`: bỏ đăng ký 4 route trên.
- Sửa `apps/server/src/api/personal/life-graph.ts`: bỏ nhánh `kind=cross_domain`/`synergy`/
  `cross_domain_sync` (chỉ phần phục vụ 3 trụ vừa xóa).
- Sửa `packages/core-domains/domainReadModelService.ts`: `DOMAIN_READ_MODEL_DOMAINS = ['work']`,
  bỏ 3 import + logic career/startup/life.
- Sửa `packages/core-personal/subconsciousService.ts`,
  `packages/core-personal/personErasureService.ts`: bỏ tham chiếu 3 trụ (export/xóa dữ liệu cá
  nhân không còn bảng để đọc).
- Sửa `scripts/{eval-v2-privacy,eval-v2-final-audit,verify-v2-migration-safety}.ts`: bỏ 3 trụ
  khỏi danh sách schema/domain bắt buộc.
- **Migration mới `postgres/migrations/0085_drop_career_startup_life.sql`**: drop bảng + schema
  `career`/`startup`, drop 5 bảng trụ Life trong `worklife` (`plans/habits/habit_logs/
wellbeing_checks/growth_milestones`) — **giữ nguyên** `worklife.projects/tasks/meetings/
documents` (trụ "Ghi chú"). Lũy đẳng, có nhánh dự phòng cho DB chưa chạy `0066_worklife_merge`.
  **Chưa áp lên DB thật** — sẽ tự chạy khi merge lên `main` qua `scripts/deploy.sh`.
- Cập nhật `CLAUDE.md` mục 6 (bỏ câu "core-domains gộp 4 trụ ... vẫn giữ vì Companion đọc" —
  nay chỉ còn `work`).

## Cố ý GIỮ LẠI (ngoài phạm vi đợt này)

- `life-graph.ts`/`life-goals.ts`/`life-synthesis.ts` + `lifeGraphService`: đọc kỹ thì đây là
  hạ tầng **Personal/Learning** (schema `personal`, không phải schema Life ở `0050`/`worklife`),
  load-bearing cho `learningGoalAdapter` (`/api/profile`) và Companion studio "Tổng hợp"
  (`/api/life-synthesis` → `LifeSynthesisDashboard`, UI đang chạy thật). Xóa nhóm này sẽ gãy
  Learning + Companion, ngoài phạm vi "backend ba trụ" — cần chủ dự án chốt riêng nếu muốn xóa.
- Nhãn `career`/`startup`/`life` trong `CompanionStudios/studioTypes.ts`, `LifeSynthesis*`,
  `core-contracts/lifeSynthesis.ts` (`LifeDomainType`), consent scope — là phân loại chủ đề chat,
  không gọi service/API vừa xóa.

## Bằng chứng kiểm chứng

Sau `npm ci` (tránh xanh giả — công cụ lệch lockfile trong container) và
`rm -rf packages/*/dist dist dist-server`:

| Cổng                                                               | Kết quả                                                                            |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `npm run build`                                                    | ✅                                                                                 |
| `npm run typecheck`                                                | ✅ 0 lỗi                                                                           |
| `npm run lint`                                                     | ✅ 0 cảnh báo                                                                      |
| `npx prettier --check .`                                           | ✅                                                                                 |
| `npm run test:coverage`                                            | ✅ 692 file / 14773 test pass · coverage 94.06/90.06/94.57/94.61 (sàn 93/89/93/93) |
| `npm run check:specs`                                              | ✅                                                                                 |
| `scripts/migrations-readme-coverage.test.ts`                       | ✅                                                                                 |
| `npm run codemap -- impact` (routes.ts, domainReadModelService.ts) | ✅ không còn nơi gọi mồ côi                                                        |

`npm run test:e2e` (Playwright) chưa chạy ở máy — không còn trang nào của 3 trụ từ đợt 0389 nên
rủi ro thấp, CI sẽ là lần kiểm đầu.

## Rủi ro & rollback

- Migration `0085` xóa dữ liệu thật, **không hoàn tác**. Muốn giữ bản sao: `pg_dump` các bảng
  liên quan TRƯỚC khi PR này merge vào `main`.
- Rollback code: revert commit `bd0bb42`. Rollback dữ liệu: không thể (đã DROP TABLE).
