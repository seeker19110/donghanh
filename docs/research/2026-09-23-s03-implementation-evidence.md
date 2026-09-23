# S03 — Bằng chứng triển khai ôn đúng môn

## Phạm vi và trạng thái

Ngày 2026-09-23, base `origin/main` tại `f07820aa`, nhánh
`codex/uiux-learning-correctness`. Đây là bản sửa lỗi hàng đợi hiện có, độc lập S01/S02.
Agent điều phối đã review contract giữ nguyên hàng đợi tổng, lọc môn trước cap và cô lập
phiên theo người học/môn/cap. **Sẵn sàng review diff; chưa hoàn tất full gate, chưa commit,
chưa push/merge/deploy tại thời điểm ghi bằng chứng này.** Không suy trạng thái Approved
của các feature S02/S04/S05 từ việc giao subagent; các spec đó vẫn Draft.

## Thay đổi và hợp đồng

- `apps/dhcb/src/lib/stemSrs.ts`: thêm `getDueStemCardsForSubject(uid, subjectId, limit?)`,
  lọc `getAllStemCards` theo môn trước khi gọi `getDueBy`; giữ nguyên hàm xuyên môn
  `getDueStemCards` cho hub. Không nhân bản thứ tự due/difficulty hay sửa FSRS.
- `apps/dhcb/src/pages/learning/StemReview.tsx`: phiên con có key từ uid/môn/cap.
  Thay một trong ba giá trị bỏ ngay thẻ, mặt đáp án và tiến độ phiên cũ; effect cleanup
  chặn hydrate cũ tới muộn. Hàng đợi không tính lại sau từng rating. Chỉ chấm key đang
  có trong hàng đợi đã hydrate; vẫn ghi qua `reviewStemCard` hiện có.
- `apps/dhcb/src/lib/stemSrs.test.ts`: fixture đủ bốn môn, môn khác quá hạn lâu hơn,
  cap=1, thứ tự due/difficulty, cap=2, không cap, môn rỗng, future/namespace/user khác.
- `apps/dhcb/src/pages/learning/StemReview.test.tsx`: deferred hydration kiểm đổi
  route/user/cap, reset mặt đáp án, response trễ, rating đúng user/key, lỗi và retry.
- `e2e/review-hub.spec.ts`: kiểm câu hỏi thật trên bốn route môn với cap=1 và kho trộn
  bốn môn; nút mở bài đúng môn; môn rỗng không mượn thẻ khác. Giữ bốn ca hub cũ.

Không đổi schema, API, mastery, evidence hoặc quyền; không gọi paid provider.
Rollback bằng revert helper, caller và các test cùng nhau; không cần migration.

## Kiểm tra đã chạy trên bản diff này

Runtime Node.js `22.23.2`, dependency từ lockfile bằng `npm ci --ignore-scripts
--no-audit --no-fund`. Chạy trong worktree riêng, không dùng nguồn của checkout khác.

| Kiểm tra                                                               | Kết quả                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Codemap impact `stemSrs.ts` trước edit                                 | 7 file ảnh hưởng; xác nhận hub và reviewQueue phải giữ helper tổng |
| Codemap impact `StemReview.tsx` trước edit                             | 2 file ảnh hưởng: App và main                                      |
| Vitest `stemSrs.test.ts`, `StemReview.test.tsx`, `reviewQueue.test.ts` | **41/41 pass**, 3 file; lượt cuối không có cảnh báo act            |
| `npm run typecheck`                                                    | **PASS**, đủ 4 tsconfig theo script dự án                          |
| ESLint 5 file TS/TSX sửa/thêm                                          | **PASS**, exit 0                                                   |
| Prettier 5 file TS/TSX và báo cáo này                                  | **PASS**                                                           |
| `git diff --check`                                                     | **PASS**                                                           |
| Playwright `e2e/review-hub.spec.ts`                                    | **9/9 pass**, Chromium, 1 worker, port 5181, 13.5 giây             |

Playwright dùng config tạm ngoài repo chỉ đổi testDir/globalSetup thành đường dẫn tuyệt
đối, port 5181 và 1 worker để không xung đột workstream khác. Giữ globalSetup, browser,
fixtures và assertion dự án. Prewarm báo thiếu DATABASE_URL nên settings dùng mặc định;
các ca dùng `mockLogin`, không kết nối DB/provider production. Có cảnh báo PostCSS
`from` của dev server, không có ca fail.

Còn phải chạy full build/lint/format/unit/E2E tại bước tích hợp do root điều phối tuần tự;
không dùng kết quả S01 hoặc commit cũ. Chưa có ảnh trước/sau 390/1440 và kiểm trực quan
ba theme/320/768; đây vẫn là hạng mục nghiệm thu còn mở, không khẳng định đã đạt.

## Chuẩn bị S02, S04, S05 — chưa sửa source

### S02

Mã hiện tại vẫn nuốt lỗi `saveOnboarding`; `Onboarding.finish` cập nhật cache/speed rồi
refresh/nav vô điều kiện. `AuthContext.refresh` trả `Promise<void>` và AuthProvider
chuyển null thành guest. Cần review hợp đồng refresh trước: phân biệt refresh thành công
cùng user/onboarded với HTTP 401, HTTP 5xx, offline và JSON lỗi. Sau POST đã lưu, retry
refresh không được POST lại. S02 còn phụ thuộc S01 vì chạm Placement và cần bằng chứng
DB local cho retry/concurrent projection; unit mock không thay thế bằng chứng đó.
Đường dẫn Placement thực là `apps/dhcb/src/pages/subjects/english/Placement.tsx`.

### S04

`Practice.tsx` vẫn lấy `isA` từ UI language và truyền vào dữ liệu/audio/mini-game.
Chuẩn bị contract `learningIsA` từ snapshot `getDirection()` ở đầu lượt, `uiLang` cho
nhãn, không reset câu/score/options khi UI đổi. Truyền props đồng bộ tám mode, giữ helper
`isA` cũ mang nghĩa chiều học; PronunciationCheck dùng prop UI tùy chọn cho tương thích.
Cần độc quyền toàn nhóm Practice trước source, ma trận direction A/B × UI vi/en và
mock TTS/STT. Không sửa prompt/provider khi chỉ cần sửa propagation chiều học.

### S05

Phụ thuộc contract S04 vì cùng `FillBlankQuiz.tsx`; không chạy hai implementation đồng
thời. Builder thuần lọc câu hợp lệ trước shuffle/cap, span UTF-16 trên câu NFC, ranh giới
Unicode, đúng một vị trí, bốn options phân biệt, đáp án là chuỗi thực trong câu. Dữ liệu
forms chỉ nhận chuỗi; chiều B không tự chia nghĩa tiếng Việt để đoán. Thiếu bốn câu hợp
lệ trả empty state, không ghi điểm lỗi. Cần offline coverage và review 20 câu mỗi chiều
trước release. Các việc này chưa được triển khai hoặc nghiệm thu trong S03.
