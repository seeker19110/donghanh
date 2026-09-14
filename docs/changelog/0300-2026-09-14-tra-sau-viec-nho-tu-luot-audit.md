# 0300 — 2026-09-14 — Trả sáu việc nhỏ từ lượt audit môn học

**PR:** #902 · **Nhánh:** `claude/audit-course-quality-vj5pcu`
**Nguồn:** `docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md` (F1 · F4 · F5 · F8 · F9 · F10)
**Nối tiếp:** đợt 0299 đã trả hai việc nặng nhất (9 đáp án Lí + cổng xanh giả).

## Việc đã làm

| #   | Phát hiện                                                    | Đã làm                                                                                                                               |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| F1  | 294/294 bài STEM là `draft` mà giao diện không đọc trường đó | `reviewStatus` vào hợp đồng dùng chung + chỉ mục nạp lười; hộp cảnh báo đầu trang bài; dòng tóm tắt đầu trang danh sách; 2 test canh |
| F4  | Cờ `notForKids` chỉ phủ 89 vòng thủ công                     | Bộ sinh gắn cờ theo khoá chủ đề; 30 vòng sinh tự động được gắn (tổng 42)                                                             |
| F5  | 23 vòng từ vựng dưới 5 từ, hai vòng chỉ 1 từ                 | Bucket ít từ dồn vào `other`, đuôi ngắn nhập vòng trước; cỡ nhỏ nhất 1 → 5                                                           |
| F8  | 6 bài Hoá trùng tiêu đề nguyên văn                           | 14 bài "Ôn tập chương N" nay mang thêm tên chương; test canh trùng tiêu đề cho cả 4 môn                                              |
| F9  | 19 câu Lí + 1 câu Hoá có `explain` dưới 40 ký tự             | Viết lại đủ 20, thêm phần vì sao và bẫy hay gặp; test canh ngưỡng 40                                                                 |
| F10 | 14 bài Lập trình chỉ có 1 test-case                          | Bổ ca thứ hai cho 7 bài Vibe, có đo thực nghiệm; 7 bài còn lại giữ nguyên **có lý do**                                               |

## Ba chỗ phải nói rõ vì kết quả KHÁC kế hoạch

**1. F10 — không bổ đủ 14 bài, và đó là chủ ý.** Bổ ca kiểm chỉ có nghĩa khi ca mới **loại được
bài đối phó**. Với mỗi ca thêm, đã chạy thử một bài làm qua được ca cũ để xem ca mới có trượt
không. Kết quả: 7 bài Vibe có phân biệt thật (nên giữ), còn:

- **4 bài SQL** chạy trên MỘT bộ seed cố định nên ca thứ hai sẽ khẳng định y hệt ca thứ nhất; ca
  sẵn có lại đang so KHỚP TUYỆT ĐỐI cả bảng kết quả nên vốn đã chặt. Muốn mạnh hơn phải cho mỗi
  ca một bộ dữ liệu riêng — việc kiến trúc, tách đợt.
- **vibe-u3-l1 và u3-l3**: hai ca dự kiến ĐÃ VIẾT rồi phải **bỏ đi** sau khi đo — bộ mô phỏng đã
  chặn sẵn đường tắt (không kiểm xanh thì không triển khai được) nên ca mới luôn đạt cùng lúc
  với ca cũ. Giữ lại là ghi một khẳng định sai vào nhãn test.
- **vibe-u4-l3**: ca sẵn có đã kiểm đúng tính chất phân biệt (đủ hai mốc).

**2. F9 — ngưỡng test đặt ở 40, không phải 60.** Ban đầu đặt cổng ở 60 ký tự thì lộ thêm **25 câu
Lí + 5 câu Hoá** ở dải 41–59 chưa ai đụng tới — ngoài phạm vi người dùng đã duyệt. Đặt cổng đúng
ngưỡng lượt audit đã đo (40, và đã sửa hết), ghi dải 41–59 thành nợ thay vì âm thầm mở rộng phạm
vi hoặc âm thầm nới ngưỡng.

**3. Test canh F1 bắt được một lỗi mà đọc mã không thấy.** App KHÔNG đọc thẳng
`src/data/curriculum.ts` — nó `fetch('/data/curriculum.json')`, tệp sinh ra từ file nguồn. Nếu chỉ
sửa nguồn (như dự định ban đầu) thì F4 và F5 **không tới được người dùng**, trong khi mọi cổng
vẫn xanh. Đã sinh lại `curriculum.json` + `cefr.json`.

## Hai lỗi hạ tầng chặn đường, sửa kèm

- Bốn script trong `scripts/archive/` tính sai gốc repo (còn lùi một cấp sau khi bị dời vào
  `archive`) nên **không chạy được**. Chú thích ở `.eslintrc.cjs` gọi chúng là "script dùng MỘT
  LẦN đã đóng băng" — thực tế không phải: muốn đổi cách gom vòng từ vựng thì bắt buộc chạy lại.
- `lint-staged` nạp `scripts/archive` vào ESLint trong khi `.eslintrc.cjs` cố ý bỏ qua thư mục
  đó, nên chạm vào file ở đó là hook chết vì cảnh báo "File ignored". Nay hai cấu hình khớp nhau.

## Bằng chứng kiểm chứng

```
Build ✅ | Typecheck ✅ (xoá sạch dist trước) | Lint ✅ 0 cảnh báo | Format ✅
npm run test:coverage → 590 file, 12316/12316 xanh (trước đợt: 12304)
size-limit → JS 135,1/140 kB · CSS 18,11/20 kB (không đổi so với trước đợt)
```

Số đo nội dung sau khi sửa: vòng từ vựng 699 → 677, cỡ nhỏ nhất 1 → 5 từ, **không mất từ nào**
(vẫn đủ 11 917 mục); `notForKids` 12 → 42 vòng; 0 bài STEM trùng tiêu đề; 0 câu có lời giải dưới
40 ký tự; 14 → 7 bài Lập trình còn một test-case.

## Nợ mới ghi nhận

- 25 câu Lí + 5 câu Hoá có `explain` dài 41–59 ký tự.
- 4 bài SQL muốn kiểm chặt hơn thì cần hạ tầng "mỗi test-case một bộ dữ liệu".
