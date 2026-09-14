# TRAPS.md — bẫy đã mắc trong repo này

> Sổ bẫy ĐÃ MẮC THẬT của dự án `donghanh`, không phải danh sách "nên tránh" chung chung. Mỗi
> mục có ngày + PR/changelog + cách rà + cổng/quy ước chốt chặn. Khác `docs/adr/` (ghi **quyết
> định** kiến trúc): file này ghi **lỗi đã xảy ra**. Ý tưởng mượn từ repo khung
> `seeker19110/project-template` (đọc 2026-09-12), điều chỉnh cho đúng quy ước thật của
> `donghanh`.
>
> Cách dùng: gặp lỗi lạ → tìm khuôn khớp ở đây trước khi đọc code từ đầu. Sửa xong → thêm mục
> mới nếu là khuôn mới, hoặc thêm ngày/PR vào mục cũ nếu là **tái phát**.

## 1. Nhiều đợt việc cùng sửa đầu `PROGRESS.md` → xung đột git hàng loạt

**Ngày/PR:** 2026-08-26, xung đột **bốn lần liên tiếp** trong một ngày (PR #693, #695, #696,
#697).

**Khuôn lỗi:** mọi đợt việc chèn thêm một mục vào **đầu** phần "Giai đoạn hiện tại" của
`PROGRESS.md`. Hai PR chạy song song → cả hai cùng sửa đúng vùng đầu file → xung đột git phải
giải tay, lặp lại mỗi lần có ≥ 2 PR đang mở cùng lúc.

**Cách rà:** thấy `PROGRESS.md` xung đột merge nhiều lần trong thời gian ngắn → không phải lỗi
người, mà là cấu trúc file ép nhiều tác nhân ghi cùng một vùng.

**Cổng chốt chặn:** tách nhật ký đợt việc ra `docs/changelog/`, mỗi đợt MỘT FILE MỚI
(`NNNN-YYYY-MM-DD-slug.md`, xem `docs/changelog/README.md`); `scripts/changelog.test.ts` canh
quy ước đặt tên. `PROGRESS.md` chỉ còn giữ trạng thái sửa TẠI CHỖ (không chồng thêm mục) —
CLAUDE.md mục 3.

## 2. `PROGRESS.md` ghi nhánh "chưa merge" trong khi đã merge từ lâu

**Ngày/PR:** phát hiện tay 2026-09-03 (xem `PROGRESS.md`, mục nhánh
`claude/chirp-3-hd-voice-upgrade-c06eds`).

**Khuôn lỗi:** `PROGRESS.md` là văn xuôi cập nhật thủ công, không có gì ép buộc đối chiếu với
git thật. Một mục ghi "nhánh X chưa merge, PHẢI chạy đủ cổng trước khi merge" — nhưng nhánh đó
đã merge từ lâu và không còn tồn tại trên remote. Sai lặng lẽ: phiên sau đọc phải trạng thái cũ,
dễ tưởng còn việc dở hoặc mở PR cho nhánh đã không còn tồn tại.

**Cách rà:** gặp một mục trong `PROGRESS.md` nêu tên nhánh cụ thể và tuyên bố nó "đang làm"/
"chưa merge" → chạy `git ls-remote --heads origin <nhánh>` trước khi tin, đặc biệt nếu mục đó
không có ngày cập nhật gần đây.

**Cổng chốt chặn:** `scripts/check-progress-freshness.sh` — quét tên nhánh dạng
`` `xxx/yyy` `` trong `PROGRESS.md`, bỏ qua nhánh đã có nhãn giải quyết rõ ràng ("ĐÃ MERGE",
"đã merge", "không còn nhánh", "đã xoá", hoặc bọc `~~gạch ngang~~`), còn lại đối chiếu
`git ls-remote --heads origin`; nhánh không nhãn mà cũng không còn tồn tại → cảnh báo. Chạy
trong job `audit` của CI khi push lên `main` (xem `.github/workflows/ci.yml`). Hiện ở dạng
**cảnh báo, chưa chặn CI** — xem `docs/specs/2026-09-12-traps-va-kiem-progress-loi-thoi.md`
mục Rollout.

## 3. Cổng ở máy XANH GIẢ vì môi trường máy khác môi trường CI

**Ngày/PR:** 2026-09-13, PR #893 (nối 4 môn STEM vào app). **Ba lần CI đỏ liên tiếp**, cả ba
đều đã chạy đủ cổng ở máy và đều xanh trước khi push.

**Khuôn lỗi:** "chạy đủ cổng ở máy rồi" KHÔNG đồng nghĩa "CI sẽ xanh". Máy lập trình mang theo
trạng thái mà runner CI không có, và cổng ở máy có khi chạy lệnh KHÁC lệnh CI chạy. Ba biến thể
đã mắc trong cùng một PR:

| Biến thể             | Máy xanh vì                                                | CI đỏ vì                                                                               |
| -------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Lockfile lệch**    | `npm install` tự liên kết workspace mới                    | CI chạy `npm ci`, lệnh này TỪ CHỐI khi `package.json` và `package-lock.json` lệch nhau |
| **Tạo tác build cũ** | còn `packages/*/dist` từ lần build trước để phân giải kiểu | runner checkout sạch, không có `dist` nào                                              |
| **Lệnh khác nhau**   | `npm test` (không bật coverage)                            | `npm run test:coverage` (có ngưỡng chặn)                                               |

Biến thể "lockfile lệch" nguy hiểm nhất vì nó giết **mọi** job cùng lúc ở bước cài đặt — nhìn
bảng check thấy toàn đỏ, dễ tưởng nội dung hỏng nặng, trong khi chưa cổng nào kịp chạy.

**Cách rà:** dấu hiệu nhận ra ngay từ bảng check, trước khi đọc log:

- **Mọi job đỏ, mỗi job chỉ sống ~10 giây** → hỏng ở bước cài đặt, gần như chắc chắn là
  lockfile. Đối chiếu: thêm/xoá thư mục trong `packages/` hay `apps/` ở PR này không?
- **Job đỏ ở một project TypeScript mình không đụng tới** → thiếu khai báo phân giải. Tái hiện:
  `rm -rf packages/*/dist && npm run typecheck`.
- **Chỉ "Unit tests + coverage" đỏ mà test không báo ca nào hỏng** → ngưỡng coverage. Tái hiện:
  `npm run test:coverage` (KHÔNG phải `npm test`).

**Cổng chốt chặn** — chưa tự động hoá được, nên là QUY ƯỚC làm việc, áp cho mọi PR:

1. **Thêm hoặc xoá một gói trong `packages/`/`apps/` thì PHẢI chạy `npm install` và commit
   `package-lock.json` kèm theo.** Kiểm nhanh trước khi push: `npm ci` phải trả về 0.
2. **Trước lần push cuối, xoá tạo tác build rồi chạy lại cổng:** `rm -rf packages/*/dist dist
dist-server` rồi `npm run typecheck`. Đây là cách duy nhất tái hiện được checkout sạch của
   CI mà không cần clone lại.
3. **Đọc `.github/workflows/ci.yml` để chạy ĐÚNG lệnh CI chạy, đừng chạy lệnh gần giống.**
   Cụ thể: cổng test của CI là `npm run test:coverage`, không phải `npm test`.

Liên quan: CLAUDE.md mục 8 đã cảnh báo "công cụ phải khớp lockfile" cho trường hợp `node_modules`
cũ; mục này mở rộng khuôn đó sang lockfile, tạo tác build và lệnh chạy.

---

## 4. Test "chấm lại toàn bộ đáp án" là cổng NHẤT QUÁN, không phải cổng ĐÚNG KIẾN THỨC

**Ngày/PR:** phát hiện 2026-09-14 khi rà lại số liệu nợ nội dung của đợt 4 môn STEM (PR #893,
`docs/changelog/0295-*.md`).

**Khuôn lỗi:** đợt #893 bỏ cổng người có chuyên môn duyệt trước khi nối nội dung vào app, và ghi
trong nhật ký rằng thay vào đó "mỗi môn có test canh chấm lại TOÀN BỘ đáp án bằng engine chấm
thật, coi như người duyệt tự động". Đọc mã thì ca test đó **lấy chính đáp án đã khai làm bài làm
của học sinh** rồi khẳng định engine chấm ra đúng
(`packages/subject-math/lessons.test.ts` — `studentInput` dựng từ `q.answer`, rồi
`expect(gradeAnswer(studentInput, q.answer).correct).toBe(true)`). Đó là một **tautology**:

- Với câu **trắc nghiệm**, nó chỉ chứng minh `correctIds` có mặt trong `choices` — KHÔNG chứng
  minh phương án được đánh dấu là phương án đúng về kiến thức. **442/665 câu (66,5%) của 4 môn
  STEM là trắc nghiệm**, riêng môn Sinh 169/170 = 99,4%.
- Với câu **numeric/expression**, nó chỉ chứng minh engine chấm nhất quán với dữ liệu, không
  chứng minh đáp số đúng.

Nguy hiểm không nằm ở ca test — ca test có ích thật (nó đã bắt lỗi engine nuốt số thập phân ba
chữ số). Nguy hiểm nằm ở chỗ **tài liệu điều hành mô tả nó như một cổng duyệt nội dung**, nên
"586 tệp test xanh" bị đọc thành "nội dung đã được duyệt", và nợ chuyên môn biến mất khỏi tầm
nhìn.

**Cách rà:** với bất kỳ test nào tự nhận là "kiểm chất lượng nội dung", hỏi đúng một câu —
**dữ liệu đầu vào của bài kiểm tra có ĐỘC LẬP với dữ liệu đang bị kiểm không?** Nếu đầu vào
được dựng ra từ chính trường đang kiểm, ca test không thể phát hiện trường đó sai. Dấu hiệu
nhận ra trong mã: `studentInput` (hay biến tương đương) được suy ra từ `q.answer` bằng một
`switch` trên `q.answer.kind`.

**Cổng chốt chặn:**

1. Mọi bài nội dung do AI soạn mang `reviewStatus: 'draft'` cho tới khi có người chuyên môn đọc.
   Test `mọi bài đánh dấu reviewStatus` canh trường này tồn tại ở cả 4 môn (từ 2026-09-14 môn
   Sinh cũng có — trước đó thiếu, dù nhật ký #893 ghi là đủ cả 4).
2. Comment cảnh báo ngay trên thân ca test ở cả 4 môn, nói rõ nó là cổng nhất quán chứ không
   phải cổng đúng kiến thức — để người đọc mã sau không kết luận nhầm như nhật ký #893.
3. `PROGRESS.md` phải ghi nợ theo **toàn bộ 665 câu + 294 bài `draft`**, không thu hẹp về riêng
   phần trắc nghiệm: 223 câu tự chấm được cũng chỉ được kiểm tính nhất quán.
