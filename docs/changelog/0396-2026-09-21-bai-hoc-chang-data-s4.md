# 0396 — 2026-09-21 — Bài học thật cho chặng `data-s4` (hướng Dữ liệu, 4 unit / 8 bài)

> PR: (điền khi tạo) · Nhánh: `claude/keen-babbage-m8nfcq`
> Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md` (**Approved for
> implementation**, chủ dự án duyệt 2026-09-17) — lát cắt `M6/S1a`.

## Vì sao có đợt này

Audit 2026-09-21 (mục nợ P6 trong `PROGRESS.md`) đo được lệch lớn giữa "đã đặc tả" và "đã có bài
học thật" của 14 hướng chuyên sâu: `details/` đủ 56/56 chặng, còn `SPEC_STAGE_UNITS` thì thiếu 22
chặng. Đặc tả cho `data-s4` đã duyệt từ 2026-09-17 nhưng chưa ai thi hành — file bài học dừng ở
`p6u201`. Đợt này lấp đúng chặng đó.

Đặc tả ② đề xuất **tách hai PR** (`data-s4` trước, `security-s4` sau) để mỗi PR còn review được.
Đợt này làm PR thứ nhất; `security-s4` (`p6-u206…u209`) và `security-s3` (`p6-u210…u213`) vẫn còn.

## Đã làm

- **4 unit / 8 lesson Python mô phỏng**, bám đúng bốn module của `specializations/data.ts`:
  - `p6-u202` (m1) — danh mục dữ liệu: cổng công bố đòi `owner` + `classification`; du hành thời
    gian trong thời hạn lưu giữ (từ chối **kèm mốc gần nhất còn được**); tiến hoá schema chỉ cho
    thêm cột, chặn xoá cột / đổi kiểu.
  - `p6-u203` (m2) — SLO độ tươi & đầy đủ: **không gộp ba trạng thái** 0 dòng / NULL / chưa chạy;
    độ tươi xét độc lập với trạng thái job (job xanh vẫn ra `violated`); tốc độ đốt ngân sách sai
    số với ngưỡng mẫu tối thiểu → `unknown`.
  - `p6-u204` (m3) — tầng chỉ số: hai định nghĩa cùng tên ra `conflict` **nêu rõ khác ở phần nào và
    không tự chọn bên nào**; đổi định nghĩa không tăng phiên bản → `deny`; khác hạt hoặc khác múi
    giờ → `incomparable`.
  - `p6-u205` (m4) — đạo đức & pháp lý: thiếu cơ sở pháp lý/mục đích → `deny`; dùng lại ngoài mục
    đích đã khai → `deny`; nhóm dưới ngưỡng k → `suppress`; mẫu lệch → bắt buộc kèm câu giới hạn.
- **Cổng ngữ nghĩa mới `dataS4Lessons.test.ts`** (9 ca), canh: đủ 4 unit × 2 bài; mỗi Make có ca
  hiện + ẩn + **ca âm `invalid:`**; mọi output dùng đúng từ vựng quyết định đã chốt ở ③ của đặc tả;
  13 marker nội dung; không I/O ngoài / random / đồng hồ hệ thống; **không có email, dãy số định
  danh hay ngày sinh trong code chạy được LẪN fixture**; ca `suppress` không để lọt con số nào;
  mọi bài chạm pháp luật có câu "không thay thế ý kiến pháp lý".
- Nối vào: `stageUnits.ts` (`data-s4`), `lessons.ts`, `curriculum.ts` (4 mục P6),
  `learningPaths/principal-ai.ts` (chặng `data-s4` đặt **trước** `principal-s3`, `requires:
['principal-s2']`), `lessonsLazy.ts` (sinh lại bằng `npm run gen:lesson-index`).
- **Bổ sung ngoài đặc tả, do cổng bắt:** `stageQuizzes.ts` thiếu quiz cho `data-s4`.
  `ProgrammingPathPage.test.tsx` canh bất biến "mọi chặng của `principal-ai` đều có bài kiểm" nên
  đỏ ngay khi nối chặng vào lộ trình. Đã soạn 5 câu `data-s4-q1…q5` và khai vào `QUIZZED_STAGES`.
  Đây là điểm chạm mà đặc tả ② **không liệt kê** — ghi lại để đợt `security-s4` biết trước.

## Bằng chứng kiểm chứng (chạy thật, 2026-09-21)

| Lệnh                                                                                                                          | Kết quả                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `npm run gen:lesson-index`                                                                                                    | 517 bài · 230 unit                                                                                     |
| `npx vitest run packages/subject-programming/dataS4Lessons.test.ts`                                                           | 9/9 xanh                                                                                               |
| `npx vitest run lessonsPython + lessonsLazy + stageUnits + learningPaths + curriculum + specializations + lessons + srsCards` | 8 file, 3144 test xanh                                                                                 |
| `npm run typecheck` (sau khi `rm -rf packages/*/dist dist dist-server`)                                                       | xanh                                                                                                   |
| `npm run lint` (max-warnings 0)                                                                                               | xanh                                                                                                   |
| `npm run format:check`                                                                                                        | xanh                                                                                                   |
| `npm run build`                                                                                                               | xanh                                                                                                   |
| `npm run check:specs`                                                                                                         | 124 đặc tả, không thiếu đường dẫn                                                                      |
| `npm run test:coverage`                                                                                                       | 692 file · 14.854 test xanh · stmts 94,06 / branch 90,06 / funcs 94,58 / lines 94,61 (sàn 93/89/93/93) |

`lessonsPython.test.ts` chạy `python3` THẬT trên `sampleSolution` của cả 8 bài mới, đối chiếu từng
test-case — nên "code mẫu qua hết test-case" là kết quả đo, không phải khẳng định.

## Quyết định trong lúc làm

- **Không gộp module nào thành unit chung** (khác tiền lệ `data-s2`/`data-s3` gộp m3+m4). Bốn
  module của `data-s4` là bốn loại quyết định khác hẳn nhau — hạ tầng, giám sát, ngữ nghĩa số, pháp
  lý — gộp thì ca biên của cái này lẫn vào policy của cái kia.
- **Comment trong `starterCode` không được nhắc tên API bị cấm.** Bản đầu viết "không network,
  không file, không subprocess" ngay trong `starterCode`, mà `starterCode` nằm trong phần code chạy
  được nên chính cổng chống I/O ngoài bắt đỏ. Đã đổi sang "chỉ tính trên dòng nhập, không chạm hệ
  ngoài" — giữ nguyên ý cảnh báo, bỏ từ khoá.

## Còn lại của nợ P6 (không thuộc đợt này)

- `security-s4` `p6-u206…u209` — cùng đặc tả, PR thứ hai; phải gộp `main` rồi **sinh lại chỉ mục**
  trước khi push (cả hai PR đều chạm `lessonsLazy.ts`), và nhớ soạn quiz `security-s4`.
- `security-s3` `p6-u210…u213` — đặc tả riêng `docs/specs/2026-09-17-security-s3-bai-hoc-that.md`.
- 19 chặng còn rỗng khác: mobile S2–S4, algo S3–S4, systems S3–S4, game/embedded/desktop S1–S4.
