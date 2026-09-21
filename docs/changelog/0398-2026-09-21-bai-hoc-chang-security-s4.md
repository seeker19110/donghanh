# 0398 — 2026-09-21 — Bài học thật cho chặng `security-s4` (hướng An toàn, 4 unit / 8 bài)

> PR: (điền khi tạo) · Nhánh: `claude/charming-hypatia-e14hpi`
> Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md` (**Approved for
> implementation**, chủ dự án duyệt 2026-09-17) — lát cắt `M6/S1b`.

## Vì sao có đợt này

PR thứ hai của đặc tả, tiếp ngay sau `data-s4` (`docs/changelog/0396-*.md`). Đặc tả ② đề xuất tách
hai PR để mỗi PR còn review được; đợt này lấp nốt `security-s4` (`p6-u206…u209`). Sau đợt này còn
`security-s3` (`p6-u210…u213`, `docs/specs/2026-09-17-security-s3-bai-hoc-that.md`).

## Đã làm

- **4 unit / 8 lesson Python mô phỏng**, bám đúng bốn module của `specializations/security.ts`
  (dòng 228–285):
  - `p6-u206` (m1) — kiến trúc an toàn: cổng ranh giới tin cậy (**tin cậy theo vị trí mạng →
    `deny`**, đúng nguyên lý zero trust), phân đoạn phải có quyết định riêng; vòng đời khoá (khoá
    dùng chung giữa môi trường → `deny`, quá hạn → `deny: … phai rotate`), thay đổi chạm ranh giới
    tin cậy mà chưa có mô hình đe doạ → `block`. Chỉ tham chiếu **nhãn** khoá, không in giá trị.
  - `p6-u207` (m2) — phát hiện và ứng cứu: luật không bắt được ca dương tính nào → `noisy`; tỉ lệ
    dương tính giả vượt ngưỡng → `noisy` yêu cầu chỉnh luật; thiếu ánh xạ kỹ thuật ATT&CK → `deny`;
    trình tự ngăn chặn → diệt trừ → phục hồi, với **diệt trừ trước khi thu chứng cứ → `block`** và
    phục hồi chưa có nguyên nhân gốc → `incomplete`.
  - `p6-u208` (m3) — điều tra số: băm lệch hoặc đứt chuỗi lưu giữ → `inadmissible`; dòng thời gian
    đa nguồn chuẩn hoá về UTC và **gắn cờ độ bất định** (vượt ngưỡng → `incomplete`, cấm im lặng
    sắp xếp rồi kết luận nhân quả); báo cáo còn dữ liệu cá nhân thô → `redact`.
  - `p6-u209` (m4) — quản trị và tuân thủ: rủi ro "chấp nhận" thiếu chủ sở hữu hoặc ngày hết hiệu
    lực → `invalid`; nhà cung cấp thiếu thoả thuận xử lý dữ liệu hoặc kế hoạch rút lui → `deny` rủi
    ro cao; kiểm soát khai "đạt" mà không có bằng chứng → **`not-reported`, không bao giờ quy thành
    đạt**. Nội dung pháp luật chỉ ở mức khái niệm, kèm câu "không thay thế ý kiến pháp lý".
- **Cổng ngữ nghĩa mới `securityS4Lessons.test.ts`** (10 ca), canh: đủ 4 unit × 2 bài; mỗi Make có
  ca hiện + ẩn + **ca âm `invalid:`**; mọi output dùng đúng từ vựng quyết định ở ③; **KHÔNG có từ
  vựng tấn công** (`exploit`, `payload`, `shellcode`, `rop`, `bypass`, `scan`, `bruteforce`,
  `reverse engineer` — khớp theo biên từ, kiểm trên code chạy được + fixture + văn xuôi); 16 marker
  nội dung; không I/O ngoài / random / đồng hồ hệ thống; không lộ email, dãy số định danh, ngày
  sinh hay giá trị khoá/bí mật; ca "khai đạt mà không có bằng chứng" bắt buộc ra `not-reported`; ca
  luật rỗng tín hiệu bắt buộc ra `noisy`; hai bài `p6-u209` bắt buộc có câu miễn trừ pháp lý.
- Nối vào: `stageUnits.ts` (`security-s4`), `lessons.ts`, `curriculum.ts` (4 mục P6),
  `learningPaths/principal-ai.ts` (chặng `security-s4` đặt **trước** `principal-s3`, `requires:
['data-s4']`), `lessonsLazy.ts` (sinh lại bằng `npm run gen:lesson-index`).
- **Điểm chạm ngoài đặc tả, đã được đợt `data-s4` cảnh báo trước:** `stageQuizzes.ts` thiếu quiz
  cho `security-s4` → `ProgrammingPathPage.test.tsx` đỏ ("mọi chặng của `principal-ai` đều có bài
  kiểm"). Đã soạn 5 câu `security-s4-q1…q5` và khai vào `QUIZZED_STAGES` của
  `stageQuizzes.test.ts`. Ghi lại lần hai để đợt `security-s3` khỏi vấp.

## Bằng chứng kiểm chứng (chạy thật, 2026-09-21)

| Lệnh                                                                                | Kết quả                                                                                                |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `npm run gen:lesson-index`                                                          | 525 bài · 234 unit                                                                                     |
| `npx vitest run packages/subject-programming/securityS4Lessons.test.ts`             | 1 file · 10/10 test xanh                                                                               |
| `npx vitest run lessonsPython + stageUnits + lessonsLazy + learningPaths + lessons` | 5 file · 1072 test xanh                                                                                |
| `npx vitest run stageQuizzes.test.ts + ProgrammingPathPage.test.tsx`                | 2 file · 14 test xanh                                                                                  |
| `npm run typecheck`                                                                 | xanh                                                                                                   |
| `npm run lint` (max-warnings 0)                                                     | xanh, 0 cảnh báo                                                                                       |
| `npm run format:check`                                                              | xanh                                                                                                   |
| `npm run build`                                                                     | xanh (1871 module, `dist/assets/index-BUxQ3tIS.js` 216,94 kB)                                          |
| `npm run check:specs`                                                               | 124 đặc tả, không thiếu đường dẫn                                                                      |
| `npm run test:coverage`                                                             | 693 file · 14.944 test xanh · stmts 94,06 / branch 90,06 / funcs 94,59 / lines 94,62 (sàn 93/89/93/93) |

`lessonsPython.test.ts` chạy `python3` THẬT trên `sampleSolution` của cả 8 bài mới và đối chiếu
từng test-case, nên "code mẫu qua hết test-case" là kết quả đo chứ không phải khẳng định.

## Rủi ro còn lại

- **Chuyên môn nội dung chưa có người ngoài đọc lại.** Cổng máy chứng minh được bài không chứa từ
  vựng tấn công và mọi nhánh quyết định tất định, nhưng không chứng minh được thuật ngữ an toàn
  thông tin dùng chuẩn với người hành nghề. Nên nhờ một người làm bảo mật đọc `p6-u207`/`p6-u208`.
- **Danh sách từ vựng cấm là chặn theo từ, không theo ý.** Nó chặn được bài trượt thành playbook
  tấn công bằng đúng những từ đã liệt kê; một bài viết lách chữ vẫn lọt. Đây là hàng rào cuối, không
  thay được việc đọc nội dung.
- `principal-ai-p5` nay có 6 chặng (từ 4). Giao diện đã kiểm bằng test, chưa nhìn ảnh chụp trang
  thật — đợt này không sửa file giao diện nào nên chưa áp Tầng 8b.
