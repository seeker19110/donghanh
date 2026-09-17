# Đặc tả nền — nâng trải nghiệm học Đồng Hành

> **Approved for implementation — S02 và S03 (S03-1/S03-2/S03-3), sau khi PR đặc tả được merge.** Người dùng đã yêu cầu triển khai kế hoạch tuần tự; agent chính review kỹ thuật S02 ngày 15/09/2026 trên base `45195feb`, chốt giới hạn 2000 ký tự, TTL 30 phút và cách ly nháp theo chủ sở hữu. S03-3 đã qua lượt review kỹ thuật bắt buộc của gạch 5 ngày 15/09/2026 (đọc `StudioDialogue.tsx` + `lessonMarkdown.ts`, đo thật đầu ra bộ đọc hiện có trên câu trả lời có rào ```, kiểm `grep dangerouslySetInnerHTML` = 0 và `package.json` không có thư viện markdown/sanitizer): **kết luận KHÔNG cài parser mới** — dùng lại `lib/lessonMarkdown.ts`, thêm đúng khối code rào. Renderer công thức toán (KaTeX) **tách PR/spec riêng**, chưa duyệt. S04–S13 vẫn cần review/đặc tả riêng. Tài liệu chưa được merge tại thời điểm tạo PR.
>
> Goal: [GOAL-2026-0915-LEARNING-UX](../goals/2026-09-15-learning-ux.md). Base: `45195feb` (#919), ngày 15/09/2026.

## 0. Một câu

Giúp khách và người có tài khoản bắt đầu đúng bài, học liên tục, xem đúng vị trí trong môn/khóa và hiểu kết quả học bằng bằng chứng đáng tin cậy.

## ④ Tiêu chí chấp nhận

### A. S02 — Hỏi nhanh trung thực

- [ ] Nhập `Giải phương trình x + 2 = 5` hoặc các chip hiện hữu: không hiện lời giải viết sẵn hoặc giả trạng thái AI suy nghĩ; chỉ hiện “Gợi ý nơi học” và đích điều hướng.
- [ ] Giữ nguyên câu hỏi có dấu, xuống dòng và ký tự đặc biệt trong nháp; kiểm tra chuỗi rỗng bằng trim nhưng không thay nguyên văn nháp.
- [ ] Chọn Companion bằng tài khoản: prefill composer, người dùng tự bấm gửi; mount/reload/Back không gọi paid AI. Chỉ tên/chủ đề phân loại được gọi là gợi ý, không bảo đảm chẩn đoán đúng.
- [ ] Với khách: Home giữ nháp qua login và reload trong cùng tab; CTA đăng nhập rõ ràng khi chọn Companion private. Login hiện về Home, nơi câu hỏi còn để bấm tiếp. Không đổi mọi route thành RequireAccount và không gọi companion API trước auth.
- [ ] Nếu storage bị chặn, giữ nháp trong bộ nhớ và báo rõ không bảo đảm giữ qua rời trang; cho sao chép câu hỏi trước đăng nhập. Không âm thầm xóa/ghi đè câu hỏi mới bằng draft cũ.
- [ ] Chỉ xóa pending draft khi người dùng chủ động xóa hoặc gửi thành công. Nháp hết hạn không tự nạp lại; nháp không vào URL, analytics/log hoặc localStorage lâu dài.
- [ ] Unit kiểm tra owner isolation, logout/đổi tài khoản, guest → account chỉ chuyển sau thao tác rõ, gửi thành công xóa đúng id và gửi lỗi giữ draft; kiểm tra validation/handoff; E2E tài khoản + khách, login trả Home, reload/Back, 0 network AI khi chỉ điều hướng, API lỗi vẫn giữ composer.

### B. S03 — Dialog, lỗi tải môn và renderer

- [ ] Dùng Modal/useDialogBehavior hiện có nếu còn panel hỏi nhanh sau S02: có tên, focus vào hộp, Tab/Shift+Tab không lọt nền, Escape đóng, trả focus nút mở, nút X có tên. Nếu S02 bỏ dialog thì kiểm tra không còn overlay cũ thay vì tạo lại.
- [ ] Ở 390×844 và 320px, nội dung và hành động không bị GuestBanner/bottom nav/header che; panel dài cuộn trong vùng có giới hạn; không tràn toàn trang.
- [ ] Subjects phân biệt tải/503 hoặc offline/thành công rỗng/lọc rỗng/dữ liệu. Retry chỉ chạy theo hành động; đổi filter nhanh không để response cũ ghi đè response mới.
- [ ] Renderer chỉ áp cho điểm hiển thị đã review: giữ nguyên code inline/block và công thức không hiểu được; không dùng raw HTML từ AI, không thực thi script/event handler hoặc liên kết javascript. Công thức hợp lệ được trình bày dễ đọc, có fallback an toàn khi lỗi.
- [ ] Không cài parser mới nếu chưa review bundle/dependency; việc renderer lớn được tách spec/PR nhỏ và ghi dependency, không mở rộng âm thầm S03.
- [ ] Unit cho race/error/retry, payload XSS/code; E2E bàn phím/modal và trạng thái lỗi; ảnh trước/sau với nguồn mock ghi rõ. Chính sách bỏ khóa zoom là quyết định riêng đang mở, không tự sửa viewport ở S03.

### C. Mục lục môn/khóa — yêu cầu bắt buộc S07, hoàn tất phủ S13

- [ ] Lập ma trận mọi môn và khóa xuất bản từ catalog thật; mục lục riêng ở thân trang tổng quan và trong vùng học, vẫn hoạt động khi shellbar/sidebar ứng dụng ẩn.
- [ ] Môn: cấp/lớp → chương/chủ đề → bài; khóa: học phần → bài → hoạt động thật. Không sinh tầng/phần rỗng; CEFR, STEM và lập trình giữ phân loại hiện có.
- [ ] Reuse/extend `TocRail` và rail chương đã có của `ProgrammingCoursePage`; bổ sung bài, trạng thái và mobile. Không viết lại toàn bộ navigation.
- [ ] Phân biệt đang mở/đang học dở/hoàn thành/chưa học/khóa bằng chữ hoặc icon cùng màu; không coi mở bài là hoàn thành. Chưa có evidence thì “chưa đo được”.
- [ ] Có tìm theo bài/chủ đề với đường dẫn chương, mở/thu chương, về bài đang học; chương hiện tại tự mở; chọn bài trong tối đa hai thao tác nếu chương đích mở sẵn.
- [ ] Desktop cột trái vùng học; mobile nút “Mục lục môn học”/“Mục lục khóa học” cạnh tên bài, panel focus chuẩn, chọn xong đóng và focus tiêu đề bài. “Trong bài này” tách khỏi cây toàn khóa.
- [ ] Deep link/Back/Forward/reload/prev-next giữ khóa nguồn kể cả lesson ID dùng chung nhiều khóa; canonical slug không được làm mất course context. Đổi môn/khóa dùng trạng thái mở chương riêng.
- [ ] Không vượt quyền/điều kiện khóa hiện hữu, không mất nháp khi đổi bài; hỗ trợ tải/lỗi retry/rỗng/tìm rỗng, tên dài và nhiều chương ở 320/390/768/1440px, cả năm theme.
- [ ] Không tải nội dung mọi bài chỉ để dựng mục lục. Adapter spec phải chốt payload metadata, khóa và evidence từng môn trước source S07.

### D. Sáu màn và hai phiên chuẩn — bàn giao ở S04–S13

- [ ] Hôm nay → mục lục/lộ trình → màn học → trợ giảng theo bài → kết quả → tiến độ; mẫu tiếng Anh, Toán và mục lục một khóa lập trình cụ thể.
- [ ] Mỗi mẫu thể hiện rỗng, tải, dữ liệu, lỗi và phản hồi; prototype chưa tồn tại trong S01 và chưa được nghiệm thu.
- [ ] Phiên học gồm nhớ lại trước đáp án, ví dụ, tự làm, gợi ý tăng dần, phản hồi chỉ lỗi, kết quả và hẹn ôn; không ép hoạt động không phù hợp vào mọi môn.
- [ ] Resume cùng thiết bị/cross-device cần spec riêng: offline khi gửi, server lưu rồi timeout, hai tab, thiết bị cũ gửi muộn, hết auth, đổi version bài. Không dùng state của UI làm authoritative completion.

## ① Phạm vi

**LÀM:** S01 chỉ ghi đặc tả, đối chiếu baseline, giao thức handoff đề xuất và ma trận nghiệm thu. S02/S03 là hai slice nguồn kế tiếp sau review/merge spec. Giữ nhận diện cyan, token, năm theme, nhịp chữ thoáng và thứ bậc rõ; mỗi vùng một CTA chính, avatar thu gọn khi học.

**KHÔNG LÀM:** S01 không tạo prototype/source/test, không claim cải thiện metric. S02 không mở API private cho khách, không đổi Login/RequireAccount, không gửi AI tự động. Không đổi billing, entitlement, schema, mastery, thuật toán SRS hoặc toàn bộ font/token. Bỏ khóa zoom chưa được quyết định; renderer dependency mới phải review riêng.

## ② Điểm chạm

| Việc             | Đường dẫn file                                                                                                                                                                                                                                                                    | Ghi chú                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| S02 sửa          | `apps/dhcb/src/components/Home/HomeUniversalAiBar.tsx`                                                                                                                                                                                                                            | Keyword + chuỗi đáp án, timeout 450ms đang tồn tại                                      |
| S02 sửa          | `apps/dhcb/src/pages/companion/Companion.tsx`                                                                                                                                                                                                                                     | Input khởi tạo rỗng; thêm nhận pending draft sau auth, không gọi send khi mount         |
| S02 thêm đề xuất | `apps/dhcb/src/lib/learningQuestionDraft.ts`                                                                                                                                                                                                                                      | Validation, sessionStorage TTL và allowlist; test cùng tên                              |
| Đọc/giữ          | `apps/dhcb/src/App.tsx`, `apps/dhcb/src/pages/core/Login.tsx`, `apps/dhcb/src/lib/companionApi.ts`                                                                                                                                                                                | Companion RequireAccount; Login về Home; API private                                    |
| S03 reuse        | `apps/dhcb/src/components/Modal.tsx`                                                                                                                                                                                                                                              | Kiểm tra hook useDialogBehavior và portal trước reuse                                   |
| S03 sửa          | `apps/dhcb/src/pages/learning/Subjects.tsx`, `apps/dhcb/src/lib/subjectApi.ts`                                                                                                                                                                                                    | Catch hiện biến lỗi thành danh sách rỗng; response cần validation runtime               |
| S03 khảo sát     | `apps/dhcb/src/components/CompanionStudios/StudioDialogue.tsx`, `apps/dhcb/src/lib/lessonMarkdown.ts`                                                                                                                                                                             | Renderer đích cần review; parser programming hiện giữ nguyên code, không thay wholesale |
| S07 reuse        | `packages/core-ui/TocRail.tsx`, `packages/subject-programming/courses/registry.ts`, `packages/subject-programming/curriculum.ts`                                                                                                                                                  | Flat anchors/courses hiện có; course IDs và lesson IDs là nguồn thật                    |
| S07 khảo sát     | `packages/core-contracts/subjectManifest.ts`, `apps/dhcb/src/data/curriculum.ts`, `apps/dhcb/src/lib/subjectsHost.ts`                                                                                                                                                             | Manifest không tự được xem là cây bài đầy đủ; adapter từng môn                          |
| Bất biến đọc     | `apps/dhcb/src/lib/guestProgress.ts`, ~~`apps/dhcb/src/lib/dailyLearningPlan.ts`~~ (ĐÃ LỖI THỜI — Home chuyển sang `curriculum.ts` từ PR #929, 2026-09-15, cùng ngày đặc tả này được viết; file mồ côi đã bị XOÁ ở PR dọn dẹp 2026-09-17), `apps/server/src/api/core/progress.ts` | Guest merge, evidence và completion authority                                           |

**Ảnh hưởng lan ra:** root chạy codemap read-only bằng Windows Node26.7 cho HomeUniversalAiBar: Home → App → main. Linux Node22 codemap bị package esbuild win32 trong node_modules hiện tại; không thay dependency để soạn docs. Trước sửa source phải chạy lại impact đúng file hotspot trên runtime phù hợp và chốt tập file thực tế; bảng này không phải claim đã chạy toàn bộ codemap.

## ③ Hợp đồng dữ liệu

S02 đề xuất payload riêng, không phải backend contract đã phát hành:

```ts
type LearningQuestionDraft = {
  version: 1
  id: string
  question: string // nguyên văn; không rỗng sau trim, tối đa 2000 ký tự, khớp personal/companion.ts message.max(2000)
  source: 'home'
  owner: { kind: 'guest' | 'account'; id: string } // guestId hoặc userId hiện tại
  target: 'companion' // allowlist, không nhận URL tùy ý
  createdAt: number // epoch milliseconds; TTL 30 phút
}
type DraftReadResult =
  | { status: 'ready'; draft: LearningQuestionDraft }
  | { status: 'empty' | 'expired' | 'invalid' | 'unavailable' }
```

Validate runtime bằng Zod; sessionStorage riêng cùng tab, không query string chứa câu hỏi. Không kế thừa raw context cá nhân xuyên domain. Tài khoản đọc draft vào composer; khách lưu trước CTA Login, sau Login về Home rồi bấm tiếp. Handoff không phải submit. Khi composer đã có nội dung mới thì hỏi thao tác thay/giữ ở giao diện, không overwrite ngầm. Giới hạn 2000 khớp `apps/server/src/api/personal/companion.ts` (message.max(2000)); TTL 30 phút được agent chính chấp nhận như quyết định triển khai thông thường. Draft gắn guestId/userId hiện tại; guest → tài khoản chỉ chuyển bằng thao tác xác nhận rõ trong cùng tab. Logout hoặc đổi tài khoản phải xóa hoặc ngăn đọc draft của chủ cũ, không prefill chéo tài khoản. Gửi thành công chỉ xóa đúng draft id đã gửi, không xóa bản mới phát sinh trong lúc chờ; gửi lỗi giữ nguyên draft.

S07 contract khung cần adapter spec để chốt:

```ts
type OutlineNode = {
  nodeId: string
  parentId?: string
  subjectId: string
  courseId?: string
  contentId?: string
  kind: 'level' | 'chapter' | 'lesson' | 'activity'
  title: string
  order: number
  href?: string // route nội bộ allowlist theo adapter
  availability: 'available' | 'locked'
  lockReason?: string
  progress: 'unknown' | 'not-started' | 'in-progress' | 'completed'
  evidenceSource?: string
}
```

Đang mở là trạng thái route riêng, không viết vào progress. Cây chỉ có metadata. Href giữ subject/course context; “completed” chỉ do adapter nhận domain evidence hợp lệ (guest local status phải ghi đúng tính cục bộ).

| Tình huống                    | Mã/trạng thái       | Hành vi                                                |
| ----------------------------- | ------------------- | ------------------------------------------------------ |
| Nháp rỗng/quá dài/sai version | invalid             | Báo tại input; không điều hướng hoặc silently truncate |
| Storage bị chặn/hết hạn       | unavailable/expired | Không auto gửi; giữ memory nếu còn; báo giới hạn lưu   |
| Companion chưa auth           | RequireAccount      | CTA Login, nháp ở Home; không gọi API private          |
| AI hạn mức/không khả dụng     | Mã API hiện hữu     | Hiện lỗi thật, giữ composer, retry do người dùng       |
| Catalog HTTP/network lỗi      | error               | Retry; không giả empty                                 |
| Response catalog cũ tới muộn  | stale request       | Bỏ response; không ghi đè filter hiện tại              |
| Markdown/LaTeX không hỗ trợ   | fallback            | Văn bản an toàn; không crash hoặc mất nội dung         |

## ⑤ Bất biến không được phá

| Bất biến                                           | Test canh/việc bổ sung                                                                                                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hạn mức khách server theo guest ID + IP            | `packages/core-auth/guestTrial.test.ts`, `packages/core-auth/guest.test.ts`                                                                                               |
| Merge guest không ghi đè tiến độ tài khoản         | `apps/dhcb/src/lib/guestProgress.test.ts`, `apps/server/src/api/_lib/progressMerge.test.ts`                                                                               |
| Completion/quyền do server, không do AI/click      | `apps/server/src/api/core/progress.test.ts`, ~~`apps/dhcb/src/lib/dailyLearningPlan.test.ts`~~ (ĐÃ LỖI THỜI — xem ghi chú ở bảng bất biến đọc; file đã bị xoá 2026-09-17) |
| Programming progress/khóa hiện hữu                 | `apps/server/src/api/subjects/programming/progress.test.ts`; không siết guest bằng server auth mới                                                                        |
| Code học lập trình không bị Markdown làm hỏng      | `apps/dhcb/src/lib/lessonMarkdown.test.ts`                                                                                                                                |
| Chuyển trang không gọi paid AI; giữ draft qua auth | Chưa có test dành handoff: S02 phải viết regression test trước sửa hành vi                                                                                                |
| Dialog/race/renderer đúng                          | S03 thêm regression test trước sửa; không coi test hiện hữu là đã phủ ca mới                                                                                              |
| A11y, tương phản                                   | `e2e/a11y.spec.ts`, `e2e/a11y-aaa.spec.ts`; thêm state mới, không bỏ rule                                                                                                 |

Không cho AI mutate billing/permissions/mastery. Không đọc dữ liệu tài khoản của khách hoặc chéo user. Evidence receipt hiện hữu cho daily plan `srs_review` không tự mở rộng thành completion mọi hoạt động. Không thay payload/cơ chế accounting trong các PR UI.

## ⑥ Quy ước dự án liên quan

- Node22, strict TypeScript, Zod tại biên; đọc AGENTS/CLAUDE/PROGRESS và impact map trước code.
- Áp dụng `.agents/skills/ui-ux-craftsman/SKILL.md`: reuse token, chữ nội dung tương phản ≥7:1, điều khiển AA, vùng chạm nội bộ ≥44px; cả năm theme.
- Body 16–18px, leading 1.5–1.7, khoảng 60–75 ký tự/dòng khi đủ rộng; không lồng thẻ nhiều lớp; focus tức thì; reduced-motion; không thêm transition-all.
- Ảnh trước/sau 1440/390 bắt buộc khi UI đổi; bổ sung 768/320 và tình huống nội dung dài. Không dùng mock screenshot làm bằng chứng production.
- Một agent một PR tuần tự. Không merge/deploy chưa có quyền rõ ràng; main tự deploy. Docs approved/merged trước feature source theo AI_DELIVERY_LOOP.
- Research sư phạm từ kế hoạch chỉ là định hướng; efficacy cần thử thực tế. Không thêm tuyên bố khoa học định lượng trong UI khi chưa có bằng chứng.

### Lệnh chứng minh

S01: Prettier ba file Markdown và `git diff --check`. Nguồn S02 trở đi: targeted tests tương ứng, `npm run build`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, `npm run test:e2e`. Ghi số test/commit/runtime thực tế; không chạy provider có phí. Thiếu test/environment ghi blocker, không giả gate xanh.

### Rollout và rollback

S01 không migration hoặc runtime effect; revert docs an toàn. S02/S03 focused frontend diff, rollback bằng revert giữ dữ liệu draft additive, không xóa tiến độ. Các slice persistence sau phải có version/migration/rollback riêng trước review. Staging/production chỉ khi được phép; PR và required checks chuẩn bị trước yêu cầu quyền cuối cùng.

## Nghiệm thu

- Lệnh đã chạy: Node22.23.2 Prettier check ba file PASS; git diff --check PASS. Chưa chạy UI/gate vì S01 docs-only.
- Tiêu chí ④: chưa nghiệm thu implementation; không có prototype mới.
- Bất biến ⑤: ghi guardrails; chưa chứng minh regression runtime ở S01.
- Phạm vi: ba tài liệu, không source/dependencies.
- Còn mở: merge S01; review kỹ thuật S04 trở đi (S03 đã review xong); nghiệm thu handoff và owner isolation; chính sách zoom; renderer đích; adapter outline từng môn; spec S04–S13; quyền phát hành.
